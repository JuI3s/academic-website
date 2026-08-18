# Academic Website

A single-page personal academic website. Content lives in `content/`; `./build.sh` inlines it into `index.html` so search engines see the full page without JavaScript.

## Preview locally

One command — rebuilds the homepage, starts a server, and opens the site:

```bash
./serve.sh          # default port 8000
./serve.sh 3000     # custom port
```

Press Ctrl+C to stop. After editing `content/`, run `./build.sh` (or `./serve.sh`) before committing.

## Project structure

```
layout.html                 page shell (meta tags, section order)
build.sh                    inlines content/ into index.html
index.html                  generated homepage — do not edit by hand
styles.css                  colors, fonts, spacing, dark mode
robots.txt                  crawler rules
sitemap.xml                 page list for search engines
content/
  intro.html                bio, contact, profile links, photo
  publications.html         publication list
  talks.html                talks
  notes.html                expository notes
  teaching.html             teaching entries
blog/
  index.html                technical blog index (list of posts)
  <slug>.html               one standalone page per blog post
```

## Editing content

- **Bio / contact / links** — `content/intro.html`.
- **Publications** — `content/publications.html`. Copy an existing
  `<li class="pub">` block and edit the title, authors, venue, and links.
  Wrap your own name in `<span class="me">…</span>` to highlight it.
  Newest go at the top.
- **Teaching** — `content/teaching.html`. Add `<li>` entries, newest first.
- **Blog post** — copy an existing post file in `blog/` as a template (it
  includes MathJax for LaTeX math), write the post, then add a `<li>` entry
  with the date and link to `blog/index.html`, newest first. Also add the URL
  to `sitemap.xml`.
- **New section** — create `content/<name>.html` with a
  `<section id="<name>"><h2>…</h2>…</section>` block, then add a matching
  `<div data-include="content/<name>.html"></div>` line in `layout.html`
  and run `./build.sh`.

Colors, fonts, and dark mode are configured via CSS variables at the top of `styles.css`.

## Deploying

Hosted on GitHub Pages at https://jui3s.github.io/academic-website/.

```bash
./build.sh
git add -A && git commit -m "Update site" && git push
```
