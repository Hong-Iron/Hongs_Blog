/* Post index (_layouts/category-index.html): the cards / list switch.
   The choice is remembered in localStorage "post-view"; until one is made, a
   wide screen shows cards and a phone shows the list. */
(function () {
  var tools = document.querySelector("[data-post-tools]");
  if (!tools) return;
  var panels = [].slice.call(document.querySelectorAll("[data-view-panel]"));
  var views = [].slice.call(tools.querySelectorAll("[data-view]"));

  function applyView(view) {
    panels.forEach(function (p) { p.hidden = p.getAttribute("data-view-panel") !== view; });
    views.forEach(function (b) {
      var on = b.getAttribute("data-view") === view;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  views.forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-view");
      applyView(v);
      try { localStorage.setItem("post-view", v); } catch (e) {}
    });
  });

  var saved = null;
  try { saved = localStorage.getItem("post-view"); } catch (e) {}
  // a phone starts on the list (23 cards in one column is a long scroll)
  var phone = window.matchMedia("(max-width: 640px)").matches;
  applyView(saved === "list" || saved === "cards" ? saved : (phone ? "list" : "cards"));
})();
