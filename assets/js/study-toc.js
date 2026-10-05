/* Studies table of contents (studies.html).
   Marks the course whose section is in view, so its entry grows like the
   current chapter in a book, and scrolls to a course when its entry is
   clicked. On narrow screens the contents are a horizontal strip, and the
   active entry is kept in view inside it. */
(function () {
  var toc = document.querySelector(".study-toc");
  if (!toc) return;

  var items = [].slice.call(toc.querySelectorAll("[data-toc]")).map(function (link) {
    return {
      link: link,
      row: document.getElementById(link.getAttribute("data-toc")),
      part: link.closest(".study-toc__part")
    };
  }).filter(function (it) { return it.row; });
  if (!items.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var strip = window.matchMedia("(max-width: 960px)");
  var current = null;
  var pinned = null;      // the clicked entry, held while the page scrolls to it
  var pinTimer = 0;
  var ticking = false;

  function behavior() {
    return reduce.matches ? "auto" : "smooth";
  }

  // scroll the TOC box itself, never the page
  function keepVisible(link) {
    var box = toc.getBoundingClientRect();
    var r = link.getBoundingClientRect();
    if (strip.matches) {
      toc.scrollTo({ left: toc.scrollLeft + (r.left - box.left) - (box.width - r.width) / 2, behavior: behavior() });
    } else if (r.top < box.top + 8 || r.bottom > box.bottom - 8) {
      toc.scrollTo({ top: toc.scrollTop + (r.top - box.top) - box.height / 3, behavior: behavior() });
    }
  }

  function setActive(it) {
    if (it === current) return;
    if (current) {
      current.link.classList.remove("is-active");
      current.link.removeAttribute("aria-current");
      current.part.classList.remove("is-current");
    }
    current = it;
    if (!it) return;
    it.link.classList.add("is-active");
    it.link.setAttribute("aria-current", "location");
    it.part.classList.add("is-current");
    keepVisible(it.link);
  }

  function update() {
    ticking = false;
    if (pinned) return;
    // the course whose section has crossed 40% of the viewport
    var line = window.innerHeight * 0.4;
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].row.getBoundingClientRect().top <= line) found = items[i];
      else break;
    }
    setActive(found);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function unpin() {
    clearTimeout(pinTimer);
    pinned = null;
    update();
  }

  items.forEach(function (it) {
    it.link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      pinned = it;
      setActive(it);
      it.row.scrollIntoView({ behavior: behavior(), block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#" + it.row.id);
      clearTimeout(pinTimer);
      pinTimer = setTimeout(unpin, 1200);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", function () { if (pinned) unpin(); });
  window.addEventListener("resize", onScroll);
  update();
})();
