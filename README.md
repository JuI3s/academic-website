# Academic Website

A single-page personal academic website. Pure HTML and CSS — no build step, no dependencies.

## Preview locally

One command — starts a server and opens the site in your browser:

```bash
./serve.sh          # default port 8000
./serve.sh 3000     # custom port
```

Press Ctrl+C to stop.

## Project structure

The site renders as a single page, but the content is split into modular
files under `content/` — edit only the file you need:

```
index.html                  page layout (rarely needs editing)
styles.css                  colors, fonts, spacing, dark mode
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

- **Bio / contact / links** — `content/intro.html`. Update the Google Scholar
  and GitHub URLs, and drop a `cv.pdf` in the project root for the CV link.
- **Publications** — `content/publications.html`. Copy an existing
  `<li class="pub">` block and edit the title, authors, venue, and links.
  Wrap your own name in `<span class="me">…</span>` to highlight it.
  Newest go at the top.
- **Teaching** — `content/teaching.html`. Add `<li>` entries, newest first.
- **Blog post** — copy an existing post file in `blog/` as a template (it
  includes MathJax for LaTeX math), write the post, then add a `<li>` entry
  with the date and link to `blog/index.html`, newest first.
- **New section** — create `content/<name>.html` with a
  `<section id="<name>"><h2>…</h2>…</section>` block, then add a matching
  `<div data-include="content/<name>.html"></div>` line in `index.html`.

Note: because content is loaded with `fetch`, the site must be viewed through
a server (`./serve.sh`) — opening `index.html` directly as a file won't load
the sections.

Colors, fonts, and dark mode are configured via CSS variables at the top of `styles.css`.

## Deploying

Hosted on GitHub Pages at https://jui3s.github.io/academic-website/.

Push to `main` to publish:

```bash
git add -A && git commit -m "Update site" && git push
```
