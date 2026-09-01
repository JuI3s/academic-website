(function () {
  const article = document.querySelector("article.post");
  const main = document.querySelector("main");
  if (!article || !main) return;

  const headings = [...article.querySelectorAll("h2, h3")];
  if (headings.length < 2) return;

  function label(el) {
    return el.textContent
      .replace(/\\\((.+?)\\\)/g, "$1")
      .replace(/\\\[(.+?)\\\]/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slug(text) {
    return (
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section"
    );
  }

  const title = article.querySelector("h1");
  if (title && !title.id) title.id = "top";

  const used = new Set(["top"]);
  headings.forEach((h) => {
    if (h.id) {
      used.add(h.id);
      return;
    }
    const base = slug(label(h));
    let id = base;
    let n = 2;
    while (used.has(id) || document.getElementById(id)) id = base + "-" + n++;
    h.id = id;
    used.add(id);
  });

  const nav = document.createElement("nav");
  nav.className = "post-toc";
  nav.setAttribute("aria-label", "Contents");

  const heading = document.createElement("div");
  heading.className = "post-toc-title";
  heading.textContent = "Contents";
  nav.appendChild(heading);

  const ul = document.createElement("ul");
  const items = [{ id: title ? "top" : "", text: "Top", el: title }];

  headings.forEach((h) => {
    items.push({ id: h.id, text: label(h), el: h, level: h.tagName });
  });

  items.forEach((item) => {
    if (!item.id) return;
    const li = document.createElement("li");
    if (item.level === "H3") li.className = "toc-h3";
    const a = document.createElement("a");
    a.href = "#" + item.id;
    a.textContent = item.text;
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  main.parentNode.insertBefore(nav, main);

  const links = [...nav.querySelectorAll("a")];

  function setActive(id) {
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  function update() {
    const threshold = 96;
    let current = title ? "top" : headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= threshold) current = h.id;
    }
    setActive(current);
  }

  document.addEventListener("scroll", update, { passive: true });
  update();
})();

(function () {
  const notes = document.querySelector("article.post .footnotes");
  if (!notes) return;

  const refs = [...document.querySelectorAll('article.post a[id^="fnref"]')];
  if (!refs.length) return;

  refs.forEach((ref) => {
    const id = (ref.getAttribute("href") || "").replace("#", "");
    const li = document.getElementById(id);
    if (!li) return;

    const sidenote = document.createElement("span");
    sidenote.className = "post-sidenote";

    const num = document.createElement("sup");
    num.textContent = ref.textContent.trim();
    sidenote.appendChild(num);
    sidenote.append(" ");

    const clone = li.cloneNode(true);
    clone.querySelectorAll("a[href^='#fnref']").forEach((a) => a.remove());
    while (clone.firstChild) sidenote.appendChild(clone.firstChild);

    const mark = ref.closest("sup") || ref;
    mark.after(sidenote);
  });

  notes.classList.add("has-sidenotes");

  function uncollide() {
    if (!window.matchMedia("(min-width: 1400px)").matches) return;
    const sidenotes = [...document.querySelectorAll(".post-sidenote")];
    let last = -Infinity;
    sidenotes.forEach((n) => {
      n.style.marginTop = "";
      const top = n.getBoundingClientRect().top;
      if (top < last + 8) n.style.marginTop = last + 8 - top + "px";
      last = n.getBoundingClientRect().bottom;
    });
  }

  function afterMath() {
    uncollide();
  }

  if (window.MathJax && MathJax.startup) {
    MathJax.startup.promise
      .then(() =>
        MathJax.typesetPromise
          ? MathJax.typesetPromise([...document.querySelectorAll(".post-sidenote")])
          : null
      )
      .then(afterMath);
  } else {
    requestAnimationFrame(uncollide);
  }

  window.addEventListener("resize", uncollide);
})();
