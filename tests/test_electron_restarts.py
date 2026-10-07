"""No real process inspection, termination, or app launches in these tests."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ElectronRestartTest(unittest.TestCase):
    def run_switch(self, opt_in=None):
        with tempfile.TemporaryDirectory() as directory:
            log = Path(directory) / 'calls'
            env = dict(os.environ, HOME=directory, CALL_LOG=str(log))
            env.pop('THEMES_RESTART_ELECTRON', None)
            if opt_in is not None:
                env['THEMES_RESTART_ELECTRON'] = opt_in
            script = '''
source "$1"
GENERATED_DIR="$HOME/generated"
prepare_theme_cache() { CACHED_THEME_TOOLS=(); }
# All side effects are replaced before exercising the real switch function.
set_theme_mode() { :; }
generate_tool_theme() { :; }
apply_tool_theme() { :; }
signal_color_scheme() { :; }
generate_all() { :; }
apply_all() { :; }
apply_system_theme() { :; }
pgrep() {
    printf 'pgrep %s\\n' "$*" >> "$CALL_LOG"
    [[ "$*" == '-if teams-for-linux' ]]
}
pkill() { printf 'pkill %s\\n' "$*" >> "$CALL_LOG"; }
setsid() { printf 'setsid %s\\n' "$*" >> "$CALL_LOG"; }
sleep() { :; }
disown() { :; }
switch_theme dark
wait
'''
            subprocess.run(['bash', '-c', script, 'test', str(ROOT / 'theme-manager.sh')],
                           env=env, capture_output=True, text=True, check=True)
            return log.read_text() if log.exists() else ''

    def test_default_toggle_never_inspects_or_restarts_apps(self):
        self.assertEqual(self.run_switch(), '')

    def test_disabled_or_invalid_opt_in_does_not_restart(self):
        for value in ('0', '', 'true', 'yes'):
            with self.subTest(value=value):
                self.assertEqual(self.run_switch(value), '')

    def test_explicit_opt_in_retains_legacy_fallback(self):
        calls = self.run_switch('1')
        self.assertIn('pkill -if teams-for-linux', calls)
        self.assertIn('setsid -f teams-for-linux --minimized', calls)
        self.assertNotIn('pkill -if vesktop', calls)
        self.assertNotIn('pkill -x slack', calls)


if __name__ == '__main__':
    unittest.main()
