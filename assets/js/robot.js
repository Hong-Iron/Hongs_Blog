/* 홍철, the corner robot. Opens a game-style speech bubble with three modes:
 *   질문하기   the course's preset questions
 *   대화하기   conversation threads: the visitor picks what to say, 홍철
 *              answers, and each answer offers the next things to say
 *   아무 얘기나 a random one-liner, no repeats until the pool runs out
 * Lines live in _data/robot/*.yml and load from assets/robot-data.json the
 * first time the bubble opens. On a course page the course's threads mix with
 * the general ones from default.yml.
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
  var base = root.getAttribute("data-base") || "";
  var script = null;      // this page's block
  var common = null;      // default.yml's block, mixed in on course pages
  var loading = null;

  function load(then) {
    if (script) return then();
    if (!loading) {
      loading = fetch(base + "/assets/robot-data.json", { credentials: "same-origin" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (all) {
          script = all[data.key] || all["default"] || {};
          common = data.key !== "default" ? all["default"] || null : null;
        })
        .catch(function () { loading = null; });
    }
    loading.then(function () {
      if (script) then();
      else say("어, 지금은 말이 잘 안 나오네요. 잠시 뒤에 다시 눌러 주세요.");
    });
  }
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var button = root.querySelector(".robot__button");
  var dialog = root.querySelector(".robot__dialog");
  var textEl = root.querySelector(".robot__text");
  var liveEl = root.querySelector(".robot__live");
  var choicesEl = root.querySelector(".robot__choices");
  var closeEl = root.querySelector(".robot__close");

  var typing = null;      // { full, i, timer, done }
  var bag = [];           // shuffled talk lines still to come
  var heard = [];         // conversation threads already started this visit

  /* -- text --------------------------------------------------------------- */

  // a line can be one string or a list of variants
  function pick(v) {
    if (Array.isArray(v)) return v[Math.floor(Math.random() * v.length)];
    return v;
  }

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

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

  function home(again) {
    var hi = again ? (pick(script.again) || pick(common && common.again) || "또 뭐 할까요?") : pick(script.greeting) || "안녕하세요!";
    say(hi, function () {
      choices([
        { label: "질문하기", run: questions, kind: "primary" },
        { label: "대화하기", run: topics },
        { label: "아무 얘기나 해 줘요", run: talk, kind: "quiet" }
      ]);
    });
  }

  function questions() {
    var qs = script.questions || [];
    say(pick(script.ask) || "뭐가 궁금해요?", function () {
      choices(qs.map(function (q) {
        return { label: q.q, run: function () { reply(q, questions); } };
      }).concat([{ label: "처음으로", run: function () { home(true); }, kind: "quiet" }]));
    });
  }

  /* threads to offer: unheard first; on a course page, mostly the course's */
  function offer() {
    var own = script.chats || [], general = (common && common.chats) || [];
    function fresh(list) {
      var f = list.filter(function (c) { return heard.indexOf(c) < 0; });
      return shuffled(f.length ? f : list);
    }
    var a = fresh(own), b = fresh(general);
    var out = common ? a.slice(0, 3).concat(b.slice(0, 1)) : a.slice(0, 4);
    if (out.length < 4) out = out.concat(a.slice(3), b.slice(1)).slice(0, 4);
    return shuffled(out);
  }

  function topics() {
    var list = offer();
    if (!list.length) return talk();
    say(pick(script.chat_prompt) || pick(common && common.chat_prompt) || "무슨 얘기 할까요?", function () {
      choices(list.map(function (c) {
        return { label: c.q, run: function () { heard.push(c); reply(c, topics); } };
      }).concat([
        { label: "다른 얘기는 없어요?", run: topics },
        { label: "처음으로", run: function () { home(true); }, kind: "quiet" }
      ]));
    });
  }

  /* one exchange: 홍철 answers, then offers what the visitor might say next.
     `rest` carries the not-yet-asked options from earlier in the same thread,
     so a dead end still offers the other branches. */
  function reply(node, back, rest) {
    rest = (rest || []).filter(function (n) { return n !== node; });
    say(pick(node.a), function () {
      var kids = node.next || [];
      var offer = kids.length ? kids : rest.slice(0, 3);
      var carry = kids.length ? rest : rest.slice(3);
      var next = offer.map(function (n) {
        var others = offer.filter(function (o) { return o !== n; }).concat(carry);
        return { label: n.q, run: function () { reply(n, back, others); } };
      });
      var other = back === questions ? "다른 거 물어볼래요" : "다른 얘기 해요";
      var tail = next.length
        ? [{ label: other, run: back, kind: "quiet" }]
        : [
            { label: back === questions ? "다른 것도 물어볼래요" : "다른 얘기 해요", run: back },
            { label: "처음으로", run: function () { home(true); }, kind: "quiet" }
          ];
      choices(next.concat(linkChoice(node), tail));
    });
  }

  function nextTalk() {
    var lines = (script.talk || []).concat(common ? (common.talk || []).slice(0) : []);
    if (!lines.length) return null;
    if (!bag.length) bag = shuffled(lines);
    return bag.pop();
  }

  function talk() {
    var line = nextTalk();
    if (!line) return home(true);
    say(pick(line.text), function () {
      choices(linkChoice(line).concat([
        { label: "더 얘기해 줘요", run: talk },
        { label: "대화할래요", run: topics },
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
    if (script) return home();
    textEl.textContent = "…";
    load(function () { home(); });
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
