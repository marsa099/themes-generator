# Helium live light/dark switching

## Fix

GTK now uses one installed theme, `ThemesGenerator`, with **different** light
(`gtk.css`) and dark (`gtk-dark.css`) variants for GTK 3 and GTK 4. Both palettes
are generated before the system preference is published. The theme name stays
constant during subsequent toggles.

The files live under `${XDG_DATA_HOME:-$HOME/.local/share}/themes/ThemesGenerator/`.
Old regular `~/.config/gtk-{3,4}.0/gtk.css` files bearing our generated header are
moved to unique `gtk.css.pre-named-theme.*` backups. Custom CSS and symlinks are
preserved, with a warning: those overrides can still prevent live recoloring.

Inspired by daphen/nixos-config commit `88e269f` (reloadable named GTK themes and
removal of forced `GTK_THEME`). This is a selective port, not adoption of his Go
engine. Unlike that commit's separate mode-specific theme names, this fork uses
one name and both variants, which passed the Helium regression scenario below.

## Diagnosis and validation (2026-10-01)

Tested Helium 0.14.5.1 / Chromium 150.0.7871.114:

- The live desktop portal returned the correct preference **and emitted**
  `org.freedesktop.portal.Settings.SettingChanged` in both directions.
- A fresh profile reproduced stale `matchMedia('(prefers-color-scheme: dark)')`
  values. This was not limited to saved browser-profile preferences.
- Tests were then moved off the working desktop: headless Weston, a private
  D-Bus session, temporary HOME/config/runtime directories, real GTK/GNOME portal
  processes, and a disposable Helium profile. No real profiles were modified.
- The old GTK override plus preference/theme-name writes reproduced the failure
  there. A direct separate-named-theme port also failed in the full application
  sequence, despite passing a simpler experiment.
- The final implementation's actual GTK generation/application and preference
  signaling passed light → dark → light → dark, with media-query results
  false → true → false → true, without restarting the test browser.

This confirms the tested web-content preference path, not visual verification of
all toolbar colors in the user's active browser. Chromium's GTK and portal theme
updates can interact; the exact browser-internal race was not instrumented.

## Activation

Code changes do not apply themselves to the desktop. At a convenient break, run
one normal theme switch to install the variants and retire the generated
startup override. Then fully quit and reopen Helium **once** to discard its
already-cached CSS. Keep its Classic appearance unless GTK styling is desired.
Subsequent toggles should not require restarting it.

Do not restart desktop portals or browsers while the user is working. The
active-session visual check remains pending until a convenient break.

## File-only regression tests

```sh
python3 -m unittest discover -s tests -v
bash -n theme-manager.sh
```

These tests use temporary HOME/data directories and mocked signaling; they do
not contact the desktop bus or open windows.
