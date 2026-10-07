#!/usr/bin/env python3
"""Validate/build both palettes without applying anything to the desktop."""
import argparse
import contextlib
import fcntl
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(root, colors, templates, generated):
    generated.mkdir(parents=True, exist_ok=True)
    with (generated / '.theme-cache.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        sources = sorted(templates.glob('*.template'))
        if not sources:
            raise ValueError('No theme templates found')
        tools = sorted({p.stem.removesuffix('-dark').removesuffix('-light') for p in sources})
        inputs = {'colors': digest(colors), 'processor': digest(root / 'theme-processor.py'),
                  'cache': digest(Path(__file__)),
                  'templates': {p.name: digest(p) for p in sources}}
        expected = [f'{tool}/{mode}.theme' for tool in tools for mode in ('dark', 'light')]
        manifest_path = generated / '.theme-cache.json'
        try:
            manifest = json.loads(manifest_path.read_text())
            if (manifest.get('inputs') == inputs and manifest.get('tools') == tools
                    and all((generated / name).is_file()
                            and manifest.get('outputs', {}).get(name) == digest(generated / name)
                            for name in expected)):
                return 'hit', len(expected)
        except (OSError, ValueError, AttributeError, TypeError):
            pass

        spec = importlib.util.spec_from_file_location('theme_processor', root / 'theme-processor.py')
        processor = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(processor)
        # Render everything before replacing any published output. On a template
        # failure the previously valid cache is preserved and no app is notified.
        with tempfile.TemporaryDirectory(prefix='.theme-build-', dir=generated) as temp:
            staging = Path(temp)
            outputs = {}
            for tool in tools:
                for mode in ('dark', 'light'):
                    template = templates / f'{tool}-{mode}.template'
                    if not template.is_file():
                        template = templates / f'{tool}.template'
                    name = f'{tool}/{mode}.theme'
                    destination = staging / name
                    warnings = io.StringIO()
                    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(warnings):
                        processor.process_template(str(template), str(colors), mode,
                                                   str(destination), tool)
                    if warnings.getvalue() or '{{' in destination.read_text():
                        raise ValueError(f'{template.name}: unresolved template colors: {warnings.getvalue()}')
                    outputs[name] = digest(destination)
            # Do not publish a mixture of palette/template revisions if an editor
            # changed an input while the cache was being built.
            if (digest(colors) != inputs['colors']
                    or digest(root / 'theme-processor.py') != inputs['processor']
                    or {p.name: digest(p) for p in sorted(templates.glob('*.template'))}
                    != inputs['templates']):
                raise ValueError('Theme inputs changed during generation; retry the toggle')
            manifest = {'inputs': inputs, 'tools': tools, 'outputs': outputs}
            for name in expected:
                destination = generated / name
                destination.parent.mkdir(parents=True, exist_ok=True)
                os.replace(staging / name, destination)
            staged_manifest = staging / 'manifest.json'
            staged_manifest.write_text(json.dumps(manifest, sort_keys=True) + '\n')
            os.replace(staged_manifest, manifest_path)
        return 'rebuilt', len(expected)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--colors', type=Path, required=True)
    parser.add_argument('--templates', type=Path, required=True)
    parser.add_argument('--generated', type=Path, required=True)
    args = parser.parse_args()
    try:
        state, count = prepare(Path(__file__).resolve().parent, args.colors,
                               args.templates, args.generated)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(1, f'Theme cache failed: {error}\n')
    print(f'Theme cache {state}: {count} files (dark + light)')


if __name__ == '__main__':
    main()
