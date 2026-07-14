#!/usr/bin/env bash
# Compare this repo against daphen's live theme system.
#
# His themes generator lives as a subtree of github.com/daphen/nixos-config
# (dotfiles/themes/.config/themes/). Our histories are unrelated, so there is
# nothing to merge — this script keeps a cheap blobless clone in ~/.cache,
# shows what changed upstream since the last reviewed commit, and diffs
# individual files for manual cherry-picking.
#
# Usage:
#   ./sync-upstream.sh              # commits upstream since last 'mark'
#   ./sync-upstream.sh files        # which files those commits touched
#   ./sync-upstream.sh diff <file>  # local file vs upstream (e.g. theme-manager.sh)
#   ./sync-upstream.sh show <file>  # upstream commits+patches for one file since last mark
#   ./sync-upstream.sh fetch        # subtree-split the themes dir and update the local
#                                   #   daphen-themes/main ref (cherry-pickable commits)
#   ./sync-upstream.sh mark         # record current upstream HEAD as reviewed
set -euo pipefail

UPSTREAM_REPO="https://github.com/daphen/nixos-config"
SUBDIR="dotfiles/themes/.config/themes"
CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/themes-generator/nixos-config"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKER="$REPO_DIR/.upstream-synced"

if [ ! -d "$CACHE/.git" ]; then
    echo "Cloning $UPSTREAM_REPO (blobless) into $CACHE ..." >&2
    git clone --filter=blob:none --quiet "$UPSTREAM_REPO" "$CACHE"
else
    git -C "$CACHE" pull --quiet
fi

last=$(cat "$MARKER" 2>/dev/null || true)
range=${last:+$last..HEAD}

cmd="${1:-log}"
case "$cmd" in
    log)
        # shellcheck disable=SC2086
        git -C "$CACHE" log --oneline --date=short --format='%h %ad %s' \
            ${range:---since=3.months} -- "$SUBDIR"
        [ -n "$last" ] || echo "(no .upstream-synced marker — showing last 3 months; run 'mark' after reviewing)" >&2
        ;;
    files)
        # shellcheck disable=SC2086
        git -C "$CACHE" log --name-only --format= ${range:---since=3.months} -- "$SUBDIR" \
            | sed "s|^$SUBDIR/||" | sort | uniq -c | sort -rn
        ;;
    diff)
        f="${2:?usage: $0 diff <file relative to repo root>}"
        diff -u "$REPO_DIR/$f" "$CACHE/$SUBDIR/$f"
        ;;
    show)
        f="${2:?usage: $0 show <file relative to repo root>}"
        # shellcheck disable=SC2086
        git -C "$CACHE" log -p ${range:---since=3.months} -- "$SUBDIR/$f"
        ;;
    fetch)
        # Extract the themes subtree into its own history (paths rewritten to
        # root, matching this repo's layout) and publish it as the local ref
        # daphen-themes/main. The split is deterministic, so re-running just
        # extends the same history. Note: this must PUSH from the cache clone —
        # fetching from a blobless clone fails (it can't serve missing blobs),
        # while pushing lazily downloads them from GitHub on demand.
        sha=$(git -C "$CACHE" subtree split --prefix="$SUBDIR" origin/HEAD 2>/dev/null | tail -1)
        git -C "$CACHE" push -q "$REPO_DIR" "$sha:refs/remotes/daphen-themes/main"
        echo "Updated daphen-themes/main -> $(git -C "$REPO_DIR" rev-parse --short refs/remotes/daphen-themes/main)"
        echo "Browse: git log daphen-themes/main    Port: git cherry-pick <sha>"
        ;;
    mark)
        git -C "$CACHE" rev-parse HEAD > "$MARKER"
        echo "Marked $(cat "$MARKER") as reviewed."
        ;;
    *)
        echo "Unknown command: $cmd (use: log | files | diff <file> | show <file> | fetch | mark)" >&2
        exit 1
        ;;
esac
