/* Studies table of contents (studies.html).
   The courses are a grid of tiles, so there is no single course "in view":
   scrolling marks the part (category) you are in, pointing at a tile marks its
   entry, and pointing at an entry marks its tile. Clicking an entry scrolls
   to the tile. On narrow screens the contents are a horizontal strip, and the
   current part is kept in view inside it. */
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

  // the hub spans the full window width; tell the CSS how wide the
  // scrollbar is so 100vw doesn't spill past it
  function measureScrollbar() {
    var w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", (w > 0 ? w : 0) + "px");
  }
  measureScrollbar();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var strip = window.matchMedia("(max-width: 960px)");
  var current = null;
  var curPart = null;
  var pointed = null;     // the tile under the pointer or holding focus
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

  function setPart(part) {
    if (part === curPart) return;
    if (curPart) curPart.classList.remove("is-current");
    curPart = part;
    if (!part) return;
    part.classList.add("is-current");
    if (strip.matches) keepVisible(part.querySelector(".study-toc__part-name") || part);
  }

  function setActive(it) {
    if (it === current) return;
    if (current) {
      current.link.classList.remove("is-active");
      current.link.removeAttribute("aria-current");
    }
    current = it;
    if (!it) return;
    it.link.classList.add("is-active");
    it.link.setAttribute("aria-current", "location");
    if (!strip.matches) keepVisible(it.link);
  }

  function update() {
    ticking = false;
    if (pinned) return;
    // the part whose first tiles have crossed 40% of the viewport
    var line = window.innerHeight * 0.4;
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].row.getBoundingClientRect().top <= line) found = items[i];
      else break;
    }
    setPart(found ? found.part : null);
    setActive(pointed);
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

  // show which tile an entry led to, for a moment
  function flash(row) {
    row.classList.add("is-pointed");
    setTimeout(function () { row.classList.remove("is-pointed"); }, 1800);
  }

  items.forEach(function (it) {
    function enter() { pointed = it; if (!pinned) setActive(it); }
    function leave() { if (pointed === it) { pointed = null; if (!pinned) setActive(null); } }
    it.row.addEventListener("pointerenter", enter);
    it.row.addEventListener("pointerleave", leave);
    it.row.addEventListener("focus", enter);
    it.row.addEventListener("blur", leave);
    it.link.addEventListener("pointerenter", function () { it.row.classList.add("is-pointed"); });
    it.link.addEventListener("pointerleave", function () { it.row.classList.remove("is-pointed"); });
    it.link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      pinned = it;
      setPart(it.part);
      setActive(it);
      flash(it.row);
      it.row.scrollIntoView({ behavior: behavior(), block: "center" });
      if (history.replaceState) history.replaceState(null, "", "#" + it.row.id);
      clearTimeout(pinTimer);
      pinTimer = setTimeout(unpin, 1200);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", function () { if (pinned) unpin(); });
  window.addEventListener("resize", function () { measureScrollbar(); onScroll(); });
  update();
})();
