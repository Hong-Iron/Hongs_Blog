/* Code panel (_layouts/note.html, _layouts/course.html).
   A click on a link to a code page opens that code in a panel on the right
   instead of leaving the page. ⌘/Ctrl/Shift-click and middle-click still open
   the code page itself.
   - Wide screens (960px and up): the page narrows and the panel sits beside
     it, so the note and the code scroll side by side. The panel's left edge
     drags to resize (double-click resets); the width is remembered
     (localStorage "code-panel-w").
   - Narrow screens: a sheet over the page. Back closes it.
   - Every opened file is a tab. A note with code files (front matter
     code_files, written by scripts/vault_export.py) has a 코드 button in its
     header and a 목록 tab listing them.
   The code is read from the code page itself (its rouge-highlighted block),
   so it looks the same as on that page. */
(function () {
  var main = document.querySelector("main");
  if (!main) return;

  var CODE_PATH = /\/studies\/[^\/]+\/code\/[^\/?#]+\/?$/;
  var LIST = "#list";
  var KEY_W = "code-panel-w";
  var root = document.documentElement;
  var split = window.matchMedia("(min-width: 960px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var listBox = document.querySelector("[data-code-files]");
  var listFiles = listBox ? [].map.call(listBox.querySelectorAll("a"), function (a) {
    return { url: a.href, name: a.textContent.trim(), role: a.getAttribute("data-role") || "" };
  }) : [];

  var panel, tabBar, views, scrim;
  var tabs = [];            // { key, url, name, tab, view, loaded }
  var active = null;        // key of the shown tab
  var isOpen = false;
  var pushed = false;       // a history entry stands for the open sheet
  var trigger = null;       // element to give focus back to on close
  var cache = {};           // url -> Promise of the parsed code page

  function keyOf(href) {
    try {
      var u = new URL(href, location.href);
      return u.origin === location.origin && CODE_PATH.test(u.pathname) ? u.pathname.replace(/\/?$/, "/") : null;
    } catch (e) {
      return null;
    }
  }

  function shortName(name) {
    return name.replace(/^\d+_/, "");
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* -- width ---------------------------------------------------------------- */

  function defaultWidth() {
    return Math.round(Math.min(Math.max(window.innerWidth * 0.42, 380), 760));
  }

  function clampWidth(w) {
    return Math.round(Math.max(320, Math.min(w, window.innerWidth - 420)));
  }

  function storedWidth() {
    try {
      var w = parseInt(localStorage.getItem(KEY_W), 10);
      return w > 0 ? w : null;
    } catch (e) {
      return null;
    }
  }

  function setWidth(w, save) {
    w = clampWidth(w);
    root.style.setProperty("--code-panel-w", w + "px");
    if (panel) panel.querySelector(".code-panel__grip").setAttribute("aria-valuenow", w);
    if (save) {
      try { localStorage.setItem(KEY_W, String(w)); } catch (e) {}
    }
  }

  /* Opening, closing and resizing re-wrap the text; keep what the reader was
     looking at in the same place on screen. */
  function anchorNear() {
    var x = Math.min(window.innerWidth / 3, 360), y = window.innerHeight / 3;
    var n = document.elementFromPoint(x, y);
    return n && main.contains(n) ? n : null;
  }

  function holdInView(anchor, change) {
    var top = anchor ? anchor.getBoundingClientRect().top : 0;
    change();
    if (anchor && anchor.isConnected) {
      var moved = anchor.getBoundingClientRect().top - top;
      // instant: the site scrolls smoothly (base.css), which would drift here
      if (Math.abs(moved) > 1) window.scrollBy({ top: moved, behavior: "instant" });
    }
  }

  /* -- panel ---------------------------------------------------------------- */

  function build() {
    if (panel) return;
    panel = el("aside", "code-panel");
    panel.id = "code-panel";
    panel.setAttribute("aria-label", "코드 보기");
    panel.tabIndex = -1;
    panel.hidden = true;

    var grip = el("div", "code-panel__grip");
    grip.setAttribute("role", "separator");
    grip.setAttribute("aria-orientation", "vertical");
    grip.setAttribute("aria-label", "코드 패널 폭");
    grip.setAttribute("aria-valuemin", "320");
    grip.title = "끌어서 폭 바꾸기 · 두 번 누르면 처음 폭";
    grip.tabIndex = 0;

    var bar = el("div", "code-panel__bar");
    tabBar = el("div", "code-panel__tabs");
    tabBar.setAttribute("role", "tablist");
    tabBar.setAttribute("aria-label", "열린 코드");
    var close = el("button", "code-panel__close");
    close.type = "button";
    close.setAttribute("aria-label", "코드 패널 닫기");
    close.title = "닫기 (Esc)";
    close.innerHTML = '<span aria-hidden="true">×</span>';
    close.addEventListener("click", function () { requestClose(); });
    bar.appendChild(tabBar);
    bar.appendChild(close);

    views = el("div", "code-panel__views");
    panel.appendChild(grip);
    panel.appendChild(bar);
    panel.appendChild(views);

    scrim = el("div", "code-panel-scrim");
    scrim.hidden = true;
    scrim.addEventListener("click", function () { requestClose(); });

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    setWidth(storedWidth() || defaultWidth(), false);
    wireGrip(grip);
    wireTabKeys();
  }

  function applyMode() {
    var isSplit = isOpen && split.matches;
    root.classList.toggle("code-panel-split", isSplit);
    root.classList.toggle("code-panel-sheet", isOpen && !split.matches);
    if (scrim) scrim.hidden = !(isOpen && !split.matches);
  }

  function show() {
    build();
    if (isOpen) return;
    var anchor = trigger && main.contains(trigger) ? trigger : anchorNear();
    isOpen = true;
    panel.hidden = false;
    holdInView(anchor, applyMode);
    panel.getBoundingClientRect(); // start the slide from off screen
    root.classList.add("code-panel-open");
    if (!split.matches) {
      try { history.pushState({ codePanel: 1 }, ""); pushed = true; } catch (e) {}
    }
  }

  function hide() {
    if (!isOpen) return;
    var anchor = anchorNear();
    isOpen = false;
    root.classList.remove("code-panel-open");
    holdInView(anchor, applyMode);
    markLinks(null);
    var done = function () { if (!isOpen) panel.hidden = true; };
    if (reduceMotion.matches) done();
    else setTimeout(done, 260);
    if (trigger && document.contains(trigger) && panel.contains(document.activeElement)) {
      trigger.focus({ preventScroll: true });
    }
  }

  function requestClose() {
    if (pushed && history.state && history.state.codePanel) {
      history.back(); // popstate closes the sheet
      return;
    }
    pushed = false;
    hide();
  }

  window.addEventListener("popstate", function () {
    if (pushed && isOpen) {
      pushed = false;
      hide();
    }
  });

  function onModeChange() {
    if (!panel) return;
    setWidth(storedWidth() || defaultWidth(), false);
    applyMode();
  }
  if (split.addEventListener) split.addEventListener("change", onModeChange);
  else if (split.addListener) split.addListener(onModeChange);

  window.addEventListener("resize", function () {
    if (panel && isOpen && split.matches) {
      setWidth(parseInt(root.style.getPropertyValue("--code-panel-w"), 10) || defaultWidth(), false);
    }
  });

  function wireGrip(grip) {
    var startX = 0, startW = 0, anchor = null;
    grip.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || !split.matches) return;
      e.preventDefault();
      startX = e.clientX;
      startW = panel.getBoundingClientRect().width;
      anchor = anchorNear();
      grip.setPointerCapture(e.pointerId);
      root.classList.add("code-panel-dragging");
    });
    grip.addEventListener("pointermove", function (e) {
      if (!grip.hasPointerCapture || !grip.hasPointerCapture(e.pointerId)) return;
      holdInView(anchor, function () { setWidth(startW + (startX - e.clientX), false); });
    });
    function end(e) {
      if (!root.classList.contains("code-panel-dragging")) return;
      root.classList.remove("code-panel-dragging");
      if (grip.hasPointerCapture && grip.hasPointerCapture(e.pointerId)) grip.releasePointerCapture(e.pointerId);
      setWidth(panel.getBoundingClientRect().width, true);
    }
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
    grip.addEventListener("dblclick", function () {
      try { localStorage.removeItem(KEY_W); } catch (e) {}
      holdInView(anchorNear(), function () { setWidth(defaultWidth(), false); });
    });
    grip.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 96 : 32, w = panel.getBoundingClientRect().width;
      if (e.key === "ArrowLeft") w += step;
      else if (e.key === "ArrowRight") w -= step;
      else if (e.key === "Enter") w = defaultWidth();
      else return;
      e.preventDefault();
      holdInView(anchorNear(), function () { setWidth(w, true); });
    });
  }

  /* -- tabs ----------------------------------------------------------------- */

  function find(key) {
    for (var i = 0; i < tabs.length; i++) if (tabs[i].key === key) return tabs[i];
    return null;
  }

  function addTab(key, url, name) {
    var t = { key: key, url: url, name: name, loaded: false };
    var id = "code-tab-" + Math.random().toString(36).slice(2, 8);

    t.tab = el("div", "code-tab" + (key === LIST ? " code-tab--list" : ""));
    var btn = el("button", "code-tab__btn");
    btn.type = "button";
    btn.id = id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-controls", id + "-view");
    btn.addEventListener("click", function () { activate(key); });
    t.tab.appendChild(btn);
    if (key !== LIST) {
      var x = el("button", "code-tab__x");
      x.type = "button";
      x.tabIndex = -1;
      x.innerHTML = '<span aria-hidden="true">×</span>';
      x.addEventListener("click", function (e) { e.stopPropagation(); closeTab(key); });
      t.tab.appendChild(x);
      t.tab.addEventListener("auxclick", function (e) {
        if (e.button === 1) { e.preventDefault(); closeTab(key); }
      });
    }

    t.view = el("section", "code-panel__view");
    t.view.id = id + "-view";
    t.view.setAttribute("role", "tabpanel");
    t.view.setAttribute("aria-labelledby", id);
    t.view.hidden = true;

    // a new file opens next to the tab in view, the list stays first
    var at = tabs.length;
    if (key === LIST) at = 0;
    else if (active) at = tabs.indexOf(find(active)) + 1;
    tabs.splice(at, 0, t);
    tabBar.insertBefore(t.tab, tabBar.children[at] || null);
    views.appendChild(t.view);
    rename(t, name);
    return t;
  }

  function rename(t, name) {
    t.name = name;
    var btn = t.tab.querySelector(".code-tab__btn");
    if (t.key === LIST) {
      btn.innerHTML = '<span class="code-tab__icon" aria-hidden="true">≡</span>';
      btn.appendChild(document.createTextNode("목록 " + listFiles.length));
      return;
    }
    btn.textContent = shortName(name);
    btn.title = name;
    t.tab.querySelector(".code-tab__x").setAttribute("aria-label", name + " 닫기");
  }

  function activate(key) {
    var t = find(key);
    if (!t) return;
    var prev = active && find(active);
    if (prev && prev !== t) prev.scrollTop = scrollerOf(prev).scrollTop;
    active = key;
    tabs.forEach(function (o) {
      var on = o === t;
      o.tab.classList.toggle("is-active", on);
      o.tab.querySelector(".code-tab__btn").setAttribute("aria-selected", on ? "true" : "false");
      o.tab.querySelector(".code-tab__btn").tabIndex = on ? 0 : -1;
      o.view.hidden = !on;
    });
    if (t.scrollTop) scrollerOf(t).scrollTop = t.scrollTop;
    revealTab(t);
    if (key === LIST) renderList(t);
    else load(t);
    markLinks(key === LIST ? null : key);
  }

  function closeTab(key) {
    var t = find(key);
    if (!t) return;
    var i = tabs.indexOf(t);
    tabs.splice(i, 1);
    t.tab.remove();
    t.view.remove();
    var files = tabs.filter(function (o) { return o.key !== LIST; });
    if (!tabs.length || (!files.length && !listFiles.length)) {
      active = null;
      requestClose();
      return;
    }
    if (active === key) activate(tabs[Math.min(i, tabs.length - 1)].key);
  }

  // scroll only the tab strip (scrollIntoView would also move the page)
  function revealTab(t) {
    var left = t.tab.offsetLeft, right = left + t.tab.offsetWidth;
    if (left < tabBar.scrollLeft) tabBar.scrollLeft = left;
    else if (right > tabBar.scrollLeft + tabBar.clientWidth) tabBar.scrollLeft = right - tabBar.clientWidth;
  }

  function scrollerOf(t) {
    return t.view.querySelector(".code-view") || t.view;
  }

  function wireTabKeys() {
    tabBar.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var i = tabs.indexOf(find(active));
      if (i < 0) return;
      e.preventDefault();
      var next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      activate(next.key);
      next.tab.querySelector(".code-tab__btn").focus();
    });
  }

  // the links in the page that point at the code in view
  function markLinks(key) {
    [].forEach.call(main.querySelectorAll("a.is-code-open"), function (a) { a.classList.remove("is-code-open"); });
    if (!key) return;
    [].forEach.call(main.querySelectorAll("a[href]"), function (a) {
      if (keyOf(a.href) === key) a.classList.add("is-code-open");
    });
  }

  /* -- content -------------------------------------------------------------- */

  function fetchPage(url) {
    var key = keyOf(url);
    if (!cache[key]) {
      cache[key] = fetch(key, { credentials: "same-origin" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var block = doc.querySelector(".note-body div.highlighter-rouge") || doc.querySelector(".note-body pre");
          if (!block) throw new Error("no code block");
          var title = doc.querySelector(".note-title");
          var label = doc.querySelector(".note-header .eyebrow");
          var parent = doc.querySelector(".note-header .article-meta a");
          return {
            block: block,
            name: title ? title.textContent.trim() : "",
            label: label ? label.textContent.trim() : "코드",
            parentUrl: parent ? parent.getAttribute("href") : "",
            parentTitle: parent ? parent.textContent.trim() : ""
          };
        });
      cache[key].catch(function () { delete cache[key]; });
    }
    return cache[key];
  }

  function load(t) {
    if (t.loaded) return;
    t.loaded = true;
    t.view.innerHTML = "";
    var wait = el("p", "code-panel__status", "코드를 불러오는 중…");
    t.view.appendChild(wait);
    fetchPage(t.url).then(function (page) {
      if (page.name) rename(t, page.name);
      t.view.innerHTML = "";
      t.view.appendChild(renderHead(t, page));
      t.view.appendChild(renderCode(page.block));
    }, function () {
      t.loaded = false;
      t.view.innerHTML = "";
      var p = el("p", "code-panel__status", "코드를 불러오지 못했어요. ");
      var a = el("a", null, "코드 쪽에서 열기");
      a.href = t.url;
      p.appendChild(a);
      var again = el("button", "code-panel__retry", "다시 시도");
      again.type = "button";
      again.addEventListener("click", function () { load(t); });
      p.appendChild(again);
      t.view.appendChild(p);
    });
  }

  function renderHead(t, page) {
    var head = el("div", "code-panel__head");
    var tag = el("span", "eyebrow tag code-panel__tag", page.label);
    tag.style.setProperty("--tag-color", "var(--course)");
    head.appendChild(tag);
    head.appendChild(el("p", "code-panel__name", page.name || t.name));

    var here = location.pathname.replace(/\/?$/, "/");
    if (page.parentUrl && page.parentUrl.replace(/\/?$/, "/") !== here) {
      var from = el("p", "code-panel__parent", "문서 ");
      var a = el("a", null, page.parentTitle);
      a.href = page.parentUrl;
      from.appendChild(a);
      head.appendChild(from);
    }

    var tools = el("div", "code-panel__tools");
    var copy = el("button", "code-panel__tool", "복사");
    copy.type = "button";
    copy.addEventListener("click", function () {
      var code = t.view.querySelector(".code-view__src code") || t.view.querySelector(".code-view__src pre");
      copyText(code ? code.textContent : "").then(function () {
        copy.textContent = "복사함";
        copy.classList.add("is-done");
      }, function () {
        copy.textContent = "복사 못 함";
      }).then(function () {
        setTimeout(function () { copy.textContent = "복사"; copy.classList.remove("is-done"); }, 1600);
      });
    });
    var open = el("a", "code-panel__tool", "새 창 ↗");
    open.href = t.url;
    open.target = "_blank";
    open.rel = "noopener";
    open.title = "코드 쪽을 새 창에서 열기";
    tools.appendChild(copy);
    tools.appendChild(open);
    head.appendChild(tools);
    return head;
  }

  function renderCode(block) {
    var wrap = el("div", "code-view");
    wrap.tabIndex = 0;
    wrap.setAttribute("aria-label", "코드");
    var src = el("div", "code-view__src");
    src.appendChild(document.importNode(block, true));
    var code = src.querySelector("code") || src.querySelector("pre");
    var count = (code ? code.textContent : "").replace(/\n$/, "").split("\n").length;
    var nums = [];
    for (var i = 1; i <= count; i++) nums.push(i);
    var ln = el("pre", "code-view__ln", nums.join("\n"));
    ln.setAttribute("aria-hidden", "true");
    var inner = el("div", "code-view__inner");
    inner.appendChild(ln);
    inner.appendChild(src);
    wrap.appendChild(inner);
    return wrap;
  }

  function renderList(t) {
    if (t.loaded) {
      t.view.querySelectorAll(".code-list__item").forEach(function (b) {
        b.classList.toggle("is-open", !!find(b.getAttribute("data-key")));
      });
      return;
    }
    t.loaded = true;
    var box = el("div", "code-list");
    box.appendChild(el("p", "code-list__title", "이 문서의 코드"));
    var ol = el("ol", "code-list__items");
    listFiles.forEach(function (f) {
      var li = el("li");
      var b = el("button", "code-list__item");
      b.type = "button";
      b.setAttribute("data-key", keyOf(f.url));
      b.appendChild(el("span", "code-list__role", f.role));
      b.appendChild(el("span", "code-list__name", f.name));
      b.addEventListener("click", function () { openFile(f.url, f.name); });
      li.appendChild(b);
      ol.appendChild(li);
    });
    box.appendChild(ol);
    t.view.appendChild(box);
    renderList(t);
  }

  // the Clipboard API first; a hidden textarea where it is missing or refused
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return copyByTextarea(text); });
    }
    return copyByTextarea(text);
  }

  function copyByTextarea(text) {
    return new Promise(function (resolve, reject) {
      var was = document.activeElement;
      var ta = el("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove();
      if (was && was.focus) was.focus({ preventScroll: true });
      if (ok) resolve(); else reject();
    });
  }

  /* -- opening ---------------------------------------------------------------- */

  function ensureList() {
    if (listFiles.length && !find(LIST)) addTab(LIST, "", "목록");
  }

  function openFile(href, name) {
    var key = keyOf(href);
    if (!key) return;
    build();
    ensureList();
    var t = find(key) || addTab(key, key, name || decodeURIComponent(key.split("/").slice(-2, -1)[0]));
    activate(t.key);
    show();
  }

  function openList(from) {
    trigger = from;
    build();
    ensureList();
    activate(LIST);
    show();
    var btn = find(LIST).tab.querySelector(".code-tab__btn");
    btn.focus({ preventScroll: true });
  }

  function nameFor(a, key) {
    for (var i = 0; i < listFiles.length; i++) if (keyOf(listFiles[i].url) === key) return listFiles[i].name;
    var text = a.textContent.trim();
    return /\.[a-z]+$/i.test(text) ? text : "";
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || !main.contains(a) || a.target === "_blank") return;
    var key = keyOf(a.href);
    if (!key) return;
    e.preventDefault();
    trigger = a;
    openFile(a.href, nameFor(a, key));
  });

  // start loading on hover, so the code is usually there by the click
  main.addEventListener("pointerover", function (e) {
    if (e.pointerType !== "mouse") return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (a && keyOf(a.href)) fetchPage(a.href).catch(function () {});
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || e.defaultPrevented || !isOpen) return;
    if (document.body.classList.contains("note-toc-open")) return;
    if (e.target.closest && e.target.closest(".robot")) return;
    requestClose();
  });

  if (listBox && listFiles.length) {
    listBox.hidden = false;
    listBox.querySelector("button").addEventListener("click", function (e) {
      if (isOpen && active === LIST) requestClose();
      else openList(e.currentTarget);
    });
  }
})();
