/* Note sidebar (_layouts/note.html).
   - Lists this note's h2/h3 headings under its entry and marks the one in view.
   - Keeps the current entry in view inside the sidebar.
   - Wide screens: the « button folds the whole sidebar away and the 목차 pill
     brings it back; the choice is remembered (localStorage "note-toc", also
     read by the inline script in the layout so it applies before paint).
   - Narrow screens: the sidebar is a drawer opened by the 목차 pill. */
(function () {
  var toc = document.getElementById("note-toc");
  if (!toc) return;
  var body = document.querySelector(".note-body");
  var list = toc.querySelector("[data-note-headings]");

  // this note's headings
  var heads = body ? [].slice.call(body.querySelectorAll("h2, h3")) : [];
  heads = heads.filter(function (h) { return h.textContent.trim(); });
  var links = [];
  if (list && heads.length) {
    heads.forEach(function (h, i) {
      if (!h.id) h.id = "sec-" + (i + 1);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.trim();
      if (h.tagName === "H3") a.className = "is-sub";
      li.appendChild(a);
      list.appendChild(li);
      links.push({ a: a, h: h });
    });

    // fold button beside the current entry; the choice is remembered
    var KEY = "note-toc-headings";
    var link = list.previousElementSibling;
    var entry = document.createElement("div");
    entry.className = "note-toc__entry";
    link.parentNode.insertBefore(entry, link);
    entry.appendChild(link);
    var fold = document.createElement("button");
    fold.type = "button";
    fold.className = "note-toc__fold";
    fold.textContent = "▾";
    if (!list.id) list.id = "note-toc-here";
    fold.setAttribute("aria-controls", list.id);
    entry.appendChild(fold);
    function setFold(open) {
      list.hidden = !open;
      fold.setAttribute("aria-expanded", open ? "true" : "false");
      fold.setAttribute("aria-label", open ? "이 문서의 소제목 접기" : "이 문서의 소제목 펼치기");
    }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    setFold(saved !== "closed");
    fold.addEventListener("click", function () {
      var open = list.hidden;
      setFold(open);
      try { localStorage.setItem(KEY, open ? "open" : "closed"); } catch (e) {}
    });
  }

  var ticking = false;
  function spy() {
    ticking = false;
    var y = 120, active = null;
    links.forEach(function (l) { if (l.h.getBoundingClientRect().top <= y) active = l; });
    links.forEach(function (l) { l.a.classList.toggle("is-active", l === active); });
  }
  if (links.length) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();
  }

  // start with the current entry in view
  var cur = toc.querySelector(".note-toc__link.is-current");
  if (cur) {
    var box = toc.getBoundingClientRect(), r = cur.getBoundingClientRect();
    if (r.top > box.top + box.height * 0.6) toc.scrollTop += r.top - box.top - box.height / 3;
  }

  // wide screens: fold the sidebar away; narrow screens: a drawer
  var root = document.documentElement;
  var wide = window.matchMedia("(min-width: 1100px)");
  var btn = document.querySelector(".note-toc-toggle");
  var hide = toc.querySelector(".note-toc__hide");
  var scrim = document.querySelector(".note-toc-scrim");
  function collapsed() { return root.classList.contains("note-toc-collapsed"); }
  function sync() {
    var open = wide.matches ? !collapsed() : document.body.classList.contains("note-toc-open");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (scrim) scrim.hidden = wide.matches || !open;
  }
  function setOpen(open) {
    document.body.classList.toggle("note-toc-open", open);
    sync();
  }
  function setCollapsed(c) {
    root.classList.toggle("note-toc-collapsed", c);
    try { localStorage.setItem("note-toc", c ? "closed" : "open"); } catch (e) {}
    sync();
    // the column just changed width: let diagrams and the background re-measure
    window.dispatchEvent(new Event("resize"));
  }
  if (btn) btn.addEventListener("click", function () {
    if (wide.matches) { setCollapsed(false); if (hide) hide.focus(); }
    else setOpen(!document.body.classList.contains("note-toc-open"));
  });
  if (hide) hide.addEventListener("click", function () {
    if (wide.matches) { setCollapsed(true); if (btn) btn.focus(); }
    else setOpen(false);
  });
  if (scrim) scrim.addEventListener("click", function () { setOpen(false); });
  toc.addEventListener("click", function (e) {
    if (e.target.closest("a") && !wide.matches) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("note-toc-open")) setOpen(false);
  });
  if (wide.addEventListener) wide.addEventListener("change", function () { setOpen(false); });
  sync();
})();

/* Keep the sidebar (and the pill that brings it back) below the site header
   while the header is on screen. */
(function () {
  var toc = document.querySelector(".note-toc"), header = document.querySelector(".site-header");
  if (!toc || !header) return;
  var ticking = false;
  function place() {
    ticking = false;
    var b = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty("--toc-top", b + "px");
  }
  function ask() { if (!ticking) { ticking = true; requestAnimationFrame(place); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  place();
})();
