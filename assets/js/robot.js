/* 홍철, the corner robot. Opens a game-style speech bubble with two modes:
 * 질문하기 (pick one of the course's preset questions) and 대화하기 (a random
 * line from the course's pool, no repeats until the pool runs out).
 * Lines come from _data/robot.yml via the JSON in _includes/robot.html.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-robot]");
  if (!root) return;

  var data;
  try {
    data = JSON.parse(root.querySelector(".robot__data").textContent);
  } catch (e) {
    return;
  }
  var script = data.script || {};
  var base = root.getAttribute("data-base") || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var button = root.querySelector(".robot__button");
  var dialog = root.querySelector(".robot__dialog");
  var textEl = root.querySelector(".robot__text");
  var liveEl = root.querySelector(".robot__live");
  var choicesEl = root.querySelector(".robot__choices");
  var closeEl = root.querySelector(".robot__close");

  var typing = null;      // { full, i, timer, done }
  var bag = [];           // shuffled indices of talk lines still to come

  /* -- text --------------------------------------------------------------- */

  function fill(text) {
    var stats = data.stats || {}, site = data.site || {};
    return String(text || "").replace(/\{(\w+)\}/g, function (m, key) {
      if (stats[key] != null) return stats[key];
      if (site[key] != null) return site[key];
      return m;
    });
  }

  function say(text, then) {
    stopTyping();
    var full = fill(text);
    // the clicked choice is about to disappear; keep focus inside the bubble
    var active = document.activeElement;
    if (!dialog.hidden && (active === document.body || dialog.contains(active))) dialog.focus();
    liveEl.textContent = full;
    dialog.classList.remove("is-done");
    choicesEl.innerHTML = "";
    if (reduceMotion) {
      textEl.textContent = full;
      finish(then);
      return;
    }
    dialog.classList.add("is-typing");
    root.classList.add("is-talking");
    textEl.textContent = "";
    typing = { full: full, i: 0, timer: 0, then: then };
    step();
  }

  function step() {
    if (!typing) return;
    typing.i++;
    textEl.textContent = typing.full.slice(0, typing.i);
    if (typing.i >= typing.full.length) {
      finish(typing.then);
      return;
    }
    var ch = typing.full.charAt(typing.i - 1);
    var delay = /[.!?…]/.test(ch) ? 170 : /[,·]/.test(ch) ? 90 : 26;
    typing.timer = window.setTimeout(step, delay);
  }

  function skip() {
    if (!typing) return;
    var then = typing.then;
    textEl.textContent = typing.full;
    finish(then);
  }

  function stopTyping() {
    if (typing) window.clearTimeout(typing.timer);
    typing = null;
  }

  function finish(then) {
    stopTyping();
    dialog.classList.remove("is-typing");
    dialog.classList.add("is-done");
    root.classList.remove("is-talking");
    if (then) then();
  }

  /* -- choices ------------------------------------------------------------- */

  function choices(list, row) {
    choicesEl.innerHTML = "";
    choicesEl.classList.toggle("robot__choices--row", !!row);
    list.forEach(function (c) {
      var el;
      if (c.href) {
        el = document.createElement("a");
        el.href = c.href.charAt(0) === "/" ? base + c.href : c.href;
      } else {
        el = document.createElement("button");
        el.type = "button";
        el.addEventListener("click", c.run);
      }
      el.className = "robot__choice" + (c.kind ? " robot__choice--" + c.kind : "");
      el.textContent = c.label;
      choicesEl.appendChild(el);
    });
    var first = choicesEl.querySelector(".robot__choice");
    if (first && document.activeElement === dialog) first.focus();
  }

  function linkChoice(item) {
    return item && item.link ? [{ label: (item.link_label || "글 보러 가기") + " →", href: item.link, kind: "primary" }] : [];
  }

  /* -- screens ------------------------------------------------------------- */

  function home() {
    say(script.greeting || "안녕하세요!", function () {
      choices([
        { label: "질문하기", run: questions, kind: "primary" },
        { label: "대화하기", run: talk }
      ], true);
    });
  }

  function questions() {
    var qs = script.questions || [];
    say(script.ask || "뭐가 궁금해요?", function () {
      choices(qs.map(function (q) {
        return { label: q.q, run: function () { answer(q); } };
      }).concat([{ label: "처음으로", run: home, kind: "quiet" }]));
    });
  }

  function answer(q) {
    say(q.a, function () {
      choices(linkChoice(q).concat([
        { label: "다른 것도 물어볼래요", run: questions },
        { label: "그냥 얘기해요", run: talk, kind: "quiet" }
      ]));
    });
  }

  function nextTalk() {
    var lines = script.talk || [];
    if (!lines.length) return null;
    if (!bag.length) {
      bag = lines.map(function (_, i) { return i; });
      for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = bag[i];
        bag[i] = bag[j];
        bag[j] = t;
      }
    }
    return lines[bag.pop()];
  }

  function talk() {
    var line = nextTalk();
    if (!line) return home();
    say(line.text, function () {
      choices(linkChoice(line).concat([
        { label: "더 얘기해 줘요", run: talk },
        { label: "물어볼 게 있어요", run: questions, kind: "quiet" }
      ]));
    });
  }

  /* -- open / close ---------------------------------------------------------- */

  function open() {
    root.classList.remove("has-hint");
    try { sessionStorage.setItem("robot-seen", "1"); } catch (e) { /* storage blocked */ }
    dialog.hidden = false;
    root.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    dialog.focus();
    home();
  }

  function close() {
    stopTyping();
    dialog.hidden = true;
    root.classList.remove("is-open", "is-talking");
    button.setAttribute("aria-expanded", "false");
    button.focus();
  }

  button.addEventListener("click", function () {
    if (dialog.hidden) open(); else close();
  });
  closeEl.addEventListener("click", close);
  textEl.addEventListener("click", skip);

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if ((e.key === "Enter" || e.key === " ") && typing && e.target === dialog) {
      e.preventDefault();
      skip();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      var items = [].slice.call(choicesEl.querySelectorAll(".robot__choice"));
      var i = items.indexOf(document.activeElement);
      if (!items.length) return;
      e.preventDefault();
      var next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[i < 0 ? 0 : next].focus();
    }
  });

  document.addEventListener("click", function (e) {
    // a choice removes itself when clicked, so ignore targets no longer on the page
    if (!dialog.hidden && e.target.isConnected && !root.contains(e.target)) close();
  });

  // a little "!" the first time per visit
  var seen = false;
  try { seen = sessionStorage.getItem("robot-seen") === "1"; } catch (e) { /* storage blocked */ }
  if (!seen) {
    window.setTimeout(function () {
      if (dialog.hidden) root.classList.add("has-hint");
    }, 2500);
  }
})();
