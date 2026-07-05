# Outstanding / To Verify

## Open

- **Light-mode Claude Code user-message background still dark?**
  Reproduce by reloading ghostty (`ctrl+shift+,`) or opening a fresh ghostty window, then opening Claude. The current palette has ANSI 15 (`bright_white`) = `#F8F8F8` and ANSI 0 (`black`) = `#2D4A3D`, so a "black-on-bright-white" user message should render as dark green on near-white.
  - If still dark after reload → Claude is probably using a 256-color cell (e.g. 235–243) for the highlight, which ghostty's `palette = N=#...` only covers for `N <= 15`. Fix path: stop using `light-ansi` and ship a non-ansi Claude Code theme (the `dotfiles.json` we already write becomes load-bearing), OR pick a different background slot.

- **Ghostty padding (8px) on existing windows**
  The new `window-padding-x/y = 8` only applies to new ghostty windows or after a config reload (`ctrl+shift+,`). Sanity-check it looks right; bump if too tight.

## Recently Landed (just for context)

- Niri border: 5px, brand orange `#FF570D` (both themes)
- Light background unified to `#F8F8F8` across ghostty / waybar / dunst
- Dunst added to theme system (`templates/dunst.template`, theme-manager.sh apply case, systemd restart on theme switch)
- Light palette tweaks: `accent.sage` `#6B8254` → `#4F7A3A`, `foreground.muted` `#9893a5` → `#6B7280` (statusline numbers/dim text more readable)
- ANSI 7/15 mapping in light: 7 = `foreground.secondary` (visible subtle text), 15 = `background.secondary` (subtle bg)
- Nvim: init.lua picks colorscheme from `~/.config/theme_mode`; bufferline re-applies highlights on `ColorScheme`; theme-manager reloads running nvim instances via RPC socket
- `assets/` gitignored

## Things to keep in mind

- ANSI 7/15 is a tradeoff: if anything renders text as `bright_white` (ANSI 15), it's currently `#F8F8F8` ≈ invisible on the light bg. If we hit that, swap which slot we use as the subtle bg.
- The dunst template hardcodes `frame_color = "#FF570D"` for the normal frame so it tracks the niri brand orange rather than per-theme `accent.orange` (which is rose `#d7827e` in light). If we ever change the niri border color, also update the template.
