/* While you read downward on a narrow screen, the floating buttons (robot,
   목차) step aside so they don't sit on the text; scrolling up, reaching the
   top or the bottom brings them back. CSS: body.is-reading in layout.css. */
(function () {
  "use strict";

  var body = document.body, lastY = window.scrollY, ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    var dy = y - lastY;
    if (y < 80 || y > max - 80) body.classList.remove("is-reading");
    else if (dy > 6) body.classList.add("is-reading");
    else if (dy < -6) body.classList.remove("is-reading");
    else return;
    lastY = y;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();

(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();
