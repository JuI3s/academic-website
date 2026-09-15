#!/usr/bin/env bash
# Stitch content/*.html into a static index.html crawlers can read.
# Also regenerates Recent writing from blog/index.html.
# Usage: ./build.sh

set -euo pipefail
cd "$(dirname "$0")"

python3 - <<'PY'
from pathlib import Path
import re

root = Path(".")

blog = (root / "blog/index.html").read_text(encoding="utf-8")
posts = re.findall(
    r'<li[^>]*>\s*<span class="blog-date">([^<]+)</span>\s*<a href="([^"]+)">([\s\S]*?)</a>',
    blog,
)

def short_date(raw: str) -> str:
    parts = raw.strip().split()
    if len(parts) >= 2:
        return f"{parts[-2]} {parts[-1]}"
    return raw.strip()

items = []
for date, href, title in posts[:3]:
    items.append(
        "    <li>\n"
        f'      <span class="blog-date">{short_date(date)}</span>\n'
        f'      <a href="blog/{href}">{title}</a>\n'
        "    </li>"
    )

writing = """<section id="writing">
  <h2>Recent writing</h2>
  <ul class="blog-list">
{items}
  </ul>
  <p class="writing-more"><a href="blog/index.html">All posts &rarr;</a></p>
</section>
""".format(items="\n".join(items) if items else "    <li>No posts yet.</li>")
(root / "content/writing.html").write_text(writing, encoding="utf-8")

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
print("Wrote content/writing.html and index.html")
PY
