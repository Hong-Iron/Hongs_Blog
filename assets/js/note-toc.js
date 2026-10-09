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
      if (h.tagName === "H3") a.style.paddingLeft = "0.8rem";
      li.appendChild(a);
      list.appendChild(li);
      links.push({ a: a, h: h });
    });
    list.hidden = false;
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
