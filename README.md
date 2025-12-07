# Centralized Theme System

A unified theme management system that maintains consistent colors across all development tools through a single source of truth.

## Overview

This system uses a centralized `colors.json` file to generate theme configurations for multiple tools, ensuring visual consistency across your entire development environment.

### Supported Tools
- **Neovim** - Custom colorscheme with full TreeSitter and LSP support
- **Fish Shell** - Terminal colors
- **FZF** - Fuzzy finder interface colors
- **Tide** - Fish prompt framework
- **Wezterm** - Terminal emulator theme
- **Mako** - Notification daemon
- **Waybar** - Status bar styling
- **spotify-player** - Spotify TUI client
- **opencode** - AI coding assistant

## Architecture

```
theme-generator/
├── colors.json          # Single source of truth for all colors
├── theme-manager.sh     # Generation and application script
├── theme-processor.py   # Template processing engine
├── templates/           # Template files with placeholders
│   ├── nvim-dark.template
│   ├── nvim-light.template
│   ├── fish.template
│   ├── fzf.template
│   ├── tide.template
│   ├── wezterm.template
│   ├── mako.template
│   ├── waybar.template
│   ├── spotify-player.template
│   └── opencode.template
└── generated/           # Auto-generated theme files
    ├── nvim/
    ├── fish/
    ├── fzf/
    ├── tide/
    ├── wezterm/
    ├── mako/
    ├── waybar/
    ├── spotify-player/
    └── opencode/
```

## Core Components

### 1. Colors Definition (`colors.json`)

The central configuration file containing all color definitions organized by theme mode:

```json
{
  "themes": {
    "dark": {
      "background": {
        "primary": "#181818",
        "secondary": "#1B1B1B",
        "tertiary": "#1B1B1B",
        "selection": "#282F38",
        "surface": "#1B1B1B",
        "overlay": "#292826",
        "prompt": "#323A40"
      },
      "foreground": {
        "primary": "#EDEDED",
        "secondary": "#C3C8C6",
        "muted": "#707B84",
        "subtle": "#707B84"
      },
      "accent": {
        "red": "#FF7B72",
        "orange": "#FF570D",
        "yellow": "#ff8a31",
        "green": "#97B5A6",
        "cyan": "#8A9AA6",
        "blue": "#CCD5E4",
        "purple": "#8A92A7",
        "pink": "#8A92A7"
      },
      "semantic": {
        "error": "accent.red",
        "warning": "accent.orange",
        "keyword": "accent.green",
        "string": "accent.blue",
        "cursor": "#FF570D"
      },
      "terminal": {
        "black": "background.tertiary",
        "red": "accent.red",
        "green": "accent.green"
      }
    },
    "light": {
      // Light theme definitions...
    }
  }
}
```

**Color References**: Semantic and terminal colors can reference other colors (e.g., `"error": "accent.red"`), which the processor resolves automatically.

### 2. Template System

Templates use placeholder syntax `{{path.to.color}}` to reference colors:

```lua
-- Example from nvim-dark.template
local c = {
  bg = "{{dark.background.primary}}",
  keyword = "{{dark.semantic.keyword}}",
}
```

```bash
# Example from fzf.template
--color=bg:{{background.primary}}
--color=fg:{{foreground.primary}}
```

### 3. Generation Process

The `theme-processor.py` script:
1. Reads color values from `colors.json`
2. Resolves chained references (semantic → accent → hex)
3. Replaces `{{placeholders}}` with resolved colors
4. Outputs tool-specific configuration files

## Commands

### Theme Manager Script

```bash
# Generate themes for specific mode
./theme-manager.sh generate dark
./theme-manager.sh generate light

# Apply themes for specific mode
./theme-manager.sh apply dark
./theme-manager.sh apply light

# Switch theme (generate + apply)
./theme-manager.sh switch dark
./theme-manager.sh switch light

# Toggle between light and dark
./theme-manager.sh toggle

# Auto-detect system theme
./theme-manager.sh auto

# Show status
./theme-manager.sh status

# Show help
./theme-manager.sh help
```

## Theme Toggle Flow

When you press `Super+Ctrl+T` (or your configured keybind), here's what happens:

```
┌─────────────────────────────────────────────────────────────────┐
│  Keybind (niri/sway/etc)                                        │
│  Super+Ctrl+T → fish -c toggle_theme                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  toggle_theme (Fish function)                                   │
│  1. Read current theme from ~/.config/theme_mode                │
│  2. Write new theme ("dark" or "light") to file                 │
│  3. Call set_dark_theme or set_light_theme                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  set_dark_theme / set_light_theme (Fish functions)              │
│                                                                 │
│  Direct updates:                                                │
│  • Fish colors     → source generated/fish/{mode}.theme         │
│  • FZF colors      → set_fzf_colors function                    │
│  • Tide prompt     → always dark (looks good in both modes)     │
│  • GTK settings    → update settings.ini + gsettings            │
│                                                                 │
│  File copy + reload:                                            │
│  • Wezterm         → touch config to trigger hot-reload         │
│  • Mako            → cp to ~/.config/mako/config + makoctl reload│
│  • Waybar          → cp to ~/.config/waybar/style.css + SIGUSR2 │
│  • spotify-player  → cp to theme.toml (restart required)        │
└─────────────────────────────────────────────────────────────────┘
                      │
                      │ (parallel - via file watchers)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Auto-updating apps (watch ~/.config/theme_mode)                │
│                                                                 │
│  • Neovim          → vim.uv file watcher in colorscheme.lua     │
│                      re-applies colorscheme on change           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `~/.config/theme_mode` | Stores current theme ("dark" or "light") |
| `~/.config/fish/functions/toggle_theme.fish` | Main toggle function |
| `~/.config/fish/functions/set_dark_theme.fish` | Applies dark theme to all apps |
| `~/.config/fish/functions/set_light_theme.fish` | Applies light theme to all apps |
| `~/.config/nvim/lua/plugins/colorscheme.lua` | Neovim file watcher |
| `~/.config/fish/conf.d/theme_watcher.fish` | Fish prompt theme checker |

## Tool-Specific Integration

### Neovim

**Generated files**: `generated/nvim/dark.theme`, `generated/nvim/light.theme`

**Applied to**: `~/.config/nvim/colors/custom-theme-{dark,light}.lua`

**Features**:
- Full TreeSitter syntax highlighting
- LSP semantic token support (explicitly linked to theme colors)
- Plugin support (Telescope, Neo-tree, Lazy, Mason, GitSigns, blink.cmp, etc.)

**Neovim config integration** (`colorscheme.lua`):
- Reads `~/.config/theme_mode` to determine current theme
- Watches file for live theme switching
- Re-applies colorscheme on `LspAttach` to ensure correct LSP colors

### Fish Shell / FZF / Tide

- **Fish & FZF**: Switch with system theme
- **Tide**: Always uses dark theme (looks good on both light and dark backgrounds)

**Auto-switching**: The `theme_watcher.fish` in `~/.config/fish/conf.d/` handles this:
- Checks `~/.config/theme_mode` on each prompt
- Sources Fish and FZF themes when mode changes
- Always sources dark Tide theme on shell start

### Wezterm

**Generated file**: `generated/wezterm/{dark,light}.theme`

Wezterm config should require the generated theme:
```lua
local colors = require('path.to.generated.wezterm.dark')
config.colors = colors
```

Wezterm hot-reloads when the file changes.

### Mako / Waybar

**Applied to**:
- Mako: `~/.config/mako/config`
- Waybar: `~/.config/waybar/style.css`

Both are automatically reloaded when applied.

## Workflow

### Daily Usage
```bash
# Toggle between themes
./theme-manager.sh toggle
```

### Modifying Colors
```bash
# 1. Edit colors.json
vim colors.json

# 2. Regenerate and apply
./theme-manager.sh switch dark
```

### Adding a New Tool

1. Create template in `templates/newtool.template`
2. Use `{{path.to.color}}` placeholders
3. Add apply logic to `theme-manager.sh` if needed
4. Run `./theme-manager.sh generate dark`

## Dependencies

- **Python 3** - For template processing
- **jq** - For JSON parsing in shell script

## Quick Reference

| Action | Command |
|--------|---------|
| Switch to dark | `./theme-manager.sh switch dark` |
| Switch to light | `./theme-manager.sh switch light` |
| Toggle themes | `./theme-manager.sh toggle` |
| Regenerate all | `./theme-manager.sh generate` |
| Check status | `./theme-manager.sh status` |
