/* Note sidebar (_layouts/note.html).
   - Lists this note's h2/h3 headings under its entry and marks the one in view.
   - Keeps the current entry in view inside the sidebar.
   - On narrow screens the sidebar is a drawer opened by the 목차 button. */
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

  // drawer on narrow screens
  var btn = document.querySelector(".note-toc-toggle");
  var scrim = document.querySelector(".note-toc-scrim");
  function setOpen(open) {
    document.body.classList.toggle("note-toc-open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (scrim) scrim.hidden = !open;
  }
  if (btn) btn.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("note-toc-open"));
  });
  if (scrim) scrim.addEventListener("click", function () { setOpen(false); });
  toc.addEventListener("click", function (e) {
    if (e.target.closest("a") && window.matchMedia("(max-width: 1099.98px)").matches) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("note-toc-open")) setOpen(false);
  });
})();
