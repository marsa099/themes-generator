"""Render-only checks: do not apply themes or contact the desktop."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('processor', ROOT / 'theme-processor.py')
processor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(processor)


def luminance(color):
    rgb = [int(color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
    return sum(v * w for v, w in zip(linear, (.2126, .7152, .0722)))


class NeutralAccentsTest(unittest.TestCase):
    def render(self, template, mode):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'theme'
            errors = io.StringIO()
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(errors):
                processor.process_template(str(ROOT / 'templates' / template),
                                           str(ROOT / 'colors.json'), mode, str(output))
            self.assertEqual(errors.getvalue(), '')
            text = output.read_text()
            self.assertNotIn('{{', text)
            return text

    def test_all_templates_resolve_in_both_modes(self):
        for template in (ROOT / 'templates').glob('*.template'):
            for mode in ('dark', 'light'):
                with self.subTest(template=template.name, mode=mode):
                    self.render(template.name, mode)

    def test_neutral_accent_and_selected_text_contrast(self):
        for palette in ('colors.json', 'colors_default.json'):
            themes = json.loads((ROOT / palette).read_text())['themes']
            for mode, expected in (('dark', '#C4C4C4'), ('light', '#595959')):
                theme = themes[mode]
                self.assertEqual(theme['semantic']['cursor'], expected)
                values = sorted([luminance(expected), luminance(theme['background']['primary'])])
                self.assertGreaterEqual((values[1] + .05) / (values[0] + .05), 4.5)

    def test_warning_error_and_terminal_colors_preserved(self):
        themes = json.loads((ROOT / 'colors.json').read_text())['themes']
        expected = {'dark': ('#FF570D', '#FF7B72'), 'light': ('#69756C', '#ED333B')}
        for mode, (warning, error) in expected.items():
            self.assertEqual(processor.get_nested_color(themes[mode], 'semantic.warning'), warning)
            self.assertEqual(processor.get_nested_color(themes[mode], 'semantic.error'), error)
            self.assertEqual(themes[mode]['terminal']['yellow'], 'accent.orange')

    def test_ui_and_warning_uses_are_separate(self):
        for mode, accent in (('dark', '#C4C4C4'), ('light', '#595959')):
            theme = json.loads((ROOT / 'colors.json').read_text())['themes'][mode]
            gtk = self.render('gtk.template', mode)
            self.assertIn(f'@define-color accent_bg_color {accent};', gtk)
            self.assertIn(f"@define-color accent_fg_color {theme['background']['primary']};", gtk)
            self.assertIn('levelbar block.low {\n    background-color: ' + theme['accent']['orange'] + ';', gtk)
            opencode = json.loads(self.render('opencode.template', mode))['theme']
            self.assertEqual(opencode['borderActive'][mode], accent)
            self.assertEqual(opencode['warning'][mode], theme['accent']['orange'])
            claude = json.loads(self.render(f'claude-code-{mode}.template', mode))
            # Branding is neutral; dedicated orange/rainbow roles remain colored.
            self.assertIn(f'"claude": "{accent}"', json.dumps(claude))


if __name__ == '__main__':
    unittest.main()
