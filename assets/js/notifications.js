(function () {
  "use strict";

  var STORAGE_PREFIX = "notice-dismissed:";

  document.querySelectorAll(".notice-banner").forEach(function (banner) {
    var id = banner.dataset.noticeId;
    if (id && localStorage.getItem(STORAGE_PREFIX + id) === "1") {
      banner.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-dismiss-notice]");
    if (!btn) return;
    var id = btn.getAttribute("data-dismiss-notice");
    if (id) localStorage.setItem(STORAGE_PREFIX + id, "1");
    var banner = btn.closest(".notice-banner");
    if (banner) banner.style.display = "none";
  });
})();
