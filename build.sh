#!/usr/bin/env bash
# Stitch content/*.html into a static index.html crawlers can read.
# Usage: ./build.sh

set -euo pipefail
cd "$(dirname "$0")"

python3 - <<'PY'
from pathlib import Path
import re

root = Path(".")
layout = (root / "layout.html").read_text(encoding="utf-8")

def include(match: re.Match) -> str:
    path = Path(match.group(1))
    if not path.is_file():
        raise SystemExit(f"missing include: {path}")
    return path.read_text(encoding="utf-8").rstrip() + "\n"

html = re.sub(
    r'[ \t]*<div data-include="([^"]+)"></div>\s*',
    include,
    layout,
)
(root / "index.html").write_text(html, encoding="utf-8")
print("Wrote index.html")
PY
