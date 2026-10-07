"""Cache and switch orchestration tests; no live desktop access."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('theme_cache', ROOT / 'theme-cache.py')
cache = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cache)


class ThemeCacheTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.templates = self.root / 'templates'
        self.templates.mkdir()
        self.colors = self.root / 'colors.json'
        self.generated = self.root / 'generated'
        shutil.copy(ROOT / 'theme-processor.py', self.root)
        shutil.copy(ROOT / 'colors.json', self.colors)
        (self.templates / 'test.template').write_text('color={{semantic.cursor}}\n')

    def prepare(self):
        return cache.prepare(self.root, self.colors, self.templates, self.generated)[0]

    def test_both_modes_cached_and_warm_hit_does_not_rewrite(self):
        self.assertEqual(self.prepare(), 'rebuilt')
        dark = self.generated / 'test/dark.theme'
        light = self.generated / 'test/light.theme'
        self.assertEqual(dark.read_text(), 'color=#C4C4C4\n')
        self.assertEqual(light.read_text(), 'color=#595959\n')
        before = (dark.stat().st_mtime_ns, light.stat().st_mtime_ns)
        self.assertEqual(self.prepare(), 'hit')
        self.assertEqual(before, (dark.stat().st_mtime_ns, light.stat().st_mtime_ns))

    def test_palette_template_and_processor_changes_invalidate(self):
        self.prepare()
        data = json.loads(self.colors.read_text())
        data['themes']['dark']['semantic']['cursor'] = '#BBBBBB'
        self.colors.write_text(json.dumps(data))
        self.assertEqual(self.prepare(), 'rebuilt')
        self.assertIn('#BBBBBB', (self.generated / 'test/dark.theme').read_text())
        template = self.templates / 'test.template'
        template.write_text(template.read_text() + 'updated\n')
        self.assertEqual(self.prepare(), 'rebuilt')
        processor = self.root / 'theme-processor.py'
        processor.write_text(processor.read_text() + '\n# changed\n')
        self.assertEqual(self.prepare(), 'rebuilt')

    def test_missing_corrupt_output_and_manifest_are_repaired(self):
        self.prepare()
        output = self.generated / 'test/light.theme'
        output.unlink()
        self.assertEqual(self.prepare(), 'rebuilt')
        output.write_text('corrupt')
        self.assertEqual(self.prepare(), 'rebuilt')
        (self.generated / '.theme-cache.json').write_text('invalid json')
        self.assertEqual(self.prepare(), 'rebuilt')

    def test_mode_specific_templates_and_removed_tools(self):
        (self.templates / 'test-dark.template').write_text('dark override')
        (self.templates / 'extra.template').write_text('extra')
        self.prepare()
        self.assertEqual((self.generated / 'test/dark.theme').read_text(), 'dark override')
        (self.templates / 'extra.template').unlink()
        self.assertEqual(self.prepare(), 'rebuilt')
        manifest = json.loads((self.generated / '.theme-cache.json').read_text())
        self.assertEqual(manifest['tools'], ['test'])

    def test_concurrent_cache_builds_are_serialized(self):
        command = ['python3', str(ROOT / 'theme-cache.py'), '--colors', str(self.colors),
                   '--templates', str(self.templates), '--generated', str(self.generated)]
        processes = [subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                      text=True) for _ in range(2)]
        outputs = []
        for process in processes:
            stdout, stderr = process.communicate(timeout=10)
            self.assertEqual(process.returncode, 0, stderr)
            outputs.append(stdout)
        self.assertEqual(sum('rebuilt' in output for output in outputs), 1)
        self.assertEqual(sum('hit' in output for output in outputs), 1)
        self.assertEqual(self.prepare(), 'hit')

    def test_failed_build_keeps_previous_cache(self):
        self.prepare()
        previous = (self.generated / 'test/dark.theme').read_bytes()
        manifest = (self.generated / '.theme-cache.json').read_bytes()
        (self.templates / 'test.template').write_text('{{missing.color}}')
        with self.assertRaises(ValueError):
            self.prepare()
        self.assertEqual(previous, (self.generated / 'test/dark.theme').read_bytes())
        self.assertEqual(manifest, (self.generated / '.theme-cache.json').read_bytes())


class CachedSwitchTest(unittest.TestCase):
    def run_script(self, body):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for tool in ('gtk', 'ghostty', 'first', 'second'):
                for mode in ('dark', 'light'):
                    output = root / 'generated' / tool / f'{mode}.theme'
                    output.parent.mkdir(parents=True, exist_ok=True)
                    output.write_text('test')
            env = dict(os.environ, HOME=directory, EVENTS=str(root / 'events'))
            script = '''
source "$1"
GENERATED_DIR="$HOME/generated"
prepare_theme_cache() { echo cache >> "$EVENTS"; CACHED_THEME_TOOLS=(gtk ghostty first second); }
generate_tool_theme() { echo unexpected-generation >> "$EVENTS"; return 1; }
set_theme_mode() { echo "mode:$1" >> "$EVENTS"; echo "$1" > "$HOME/mode"; }
get_current_theme() { if [[ -f "$HOME/mode" ]]; then cat "$HOME/mode"; else echo dark; fi; }
signal_color_scheme() { echo signal >> "$EVENTS"; }
apply_system_theme() { echo system >> "$EVENTS"; }
restart_electron_apps() { echo restart-check >> "$EVENTS"; }
apply_tool_theme() { echo "apply:$1" >> "$EVENTS"; }
''' + body
            result = subprocess.run(['bash', '-c', script, 'test', str(ROOT / 'theme-manager.sh')],
                                    env=env, text=True, capture_output=True, timeout=10)
            events = (root / 'events').read_text().splitlines() if (root / 'events').exists() else []
            return result, events

    def test_prepare_before_notification_and_apply_each_tool_once(self):
        result, events = self.run_script('switch_theme light')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(events[0], 'cache')
        for tool in ('gtk', 'ghostty', 'first', 'second'):
            self.assertEqual(events.count(f'apply:{tool}'), 1)
        self.assertLess(events.index('apply:gtk'), events.index('signal'))
        self.assertLess(events.index('apply:ghostty'), events.index('signal'))
        self.assertNotIn('unexpected-generation', events)

    def test_cache_failure_does_not_touch_desktop(self):
        result, events = self.run_script('prepare_theme_cache() { return 1; }; switch_theme dark')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(events, [])

    def test_independent_adapters_run_concurrently(self):
        result, events = self.run_script('''
apply_tool_theme() {
 echo "apply:$1" >> "$EVENTS"
 case "$1" in
 first|second)
  touch "$HOME/$1"
  for ((i=0; i<100; i++)); do
   [[ -f "$HOME/first" && -f "$HOME/second" ]] && return 0
   sleep .01
  done
  return 1;;
 esac
}
switch_theme dark
''')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_failed_adapter_is_reported(self):
        result, events = self.run_script('apply_tool_theme() { [[ "$1" != first ]]; }; switch_theme dark')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Theme application failed: first', result.stdout)
        self.assertNotIn('restart-check', events)

    def test_queued_toggles_resolve_mode_after_lock(self):
        result, events = self.run_script('toggle_theme & a=$!; toggle_theme & b=$!; wait "$a"; wait "$b"')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([e for e in events if e.startswith('mode:')], ['mode:light', 'mode:dark'])


if __name__ == '__main__':
    unittest.main()
