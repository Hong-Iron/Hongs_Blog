/* /studies/review/: due cards and new-card sessions, built on window.Study.
   Cards are taken from the note pages themselves (fetched once each), so the
   question and answer always match what the note shows. Cards answered wrong
   come back at the end of the same session, up to twice. */
(function () {
  var S = window.Study;
  var root = document.getElementById("review");
  if (!S || !root) return;
  function q(sel) { return root.querySelector(sel); }
  var home = q("[data-review-home]"), sess = q("[data-review-session]"), summ = q("[data-review-summary]");
  var stage = q("[data-review-stage]"), prog = q("[data-review-progress]"), from = q("[data-review-from]");
  var nextRow = q("[data-review-nextrow]");
  var params = new URLSearchParams(location.search);
  var pages = {}, ix = null;
  var queue = [], pos = 0, tries = {}, results = [];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    // keep cards of the same note apart where possible
    for (var k = 1; k < a.length; k++) {
      if (a[k].doc.u === a[k - 1].doc.u) {
        for (var m = k + 1; m < a.length; m++) {
          if (a[m].doc.u !== a[k - 1].doc.u) { var tmp = a[k]; a[k] = a[m]; a[m] = tmp; break; }
        }
      }
    }
    return a;
  }

  function page(u) {
    if (!pages[u]) {
      pages[u] = fetch(S.base + u).then(function (r) { return r.text(); }).then(function (html) {
        return new DOMParser().parseFromString(html, "text/html");
      });
    }
    return pages[u];
  }

  // ---- home ----
  function renderHome() {
    var t = q("[data-review-today]");
    var due = S.dueList(ix);
    t.innerHTML = "";
    if (!due.length) {
      t.appendChild(el("p", "review-big", "오늘 복습할 카드가 없어요."));
      t.appendChild(el("p", "review-hint", "노트에서 카드를 풀거나 아래에서 새 카드를 섞어 풀면, 다음 복습 날짜에 여기 모여요."));
    } else {
      t.appendChild(el("p", "review-big", "오늘 복습할 카드 " + due.length + "장"));
      var byCourse = {};
      due.forEach(function (c) { (byCourse[c.doc.c] = byCourse[c.doc.c] || []).push(c); });
      var row = el("div", "review-row");
      var all = el("button", "study-btn study-btn--primary", "모두 섞어 풀기");
      all.type = "button";
      all.addEventListener("click", function () { start(due.slice()); });
      row.appendChild(all);
      Object.keys(byCourse).forEach(function (slug) {
        var b = el("button", "study-btn", ix.courses[slug].name + " " + byCourse[slug].length);
        b.type = "button";
        b.addEventListener("click", function () { start(byCourse[slug].slice()); });
        row.appendChild(b);
      });
      t.appendChild(row);
    }
    // exams
    Object.keys(ix.courses).forEach(function (slug) {
      var e = S.nextExam(ix, slug);
      if (e) t.appendChild(el("p", "review-hint", ix.courses[slug].name + " " + e.label + "고사까지 " + e.days + "일 (" + S.pretty(e.date) + ")"));
    });
    // course picker
    var box = q("[data-review-courses]");
    box.innerHTML = "";
    var want = params.get("course");
    Object.keys(ix.courses).forEach(function (slug) {
      var has = ix.docs.some(function (d) { return d.c === slug && d.cards.length; });
      if (!has) return;
      var lab = el("label", "review-course");
      var cb = el("input");
      cb.type = "checkbox";
      cb.value = slug;
      cb.checked = want === slug;
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(" " + ix.courses[slug].name));
      box.appendChild(lab);
    });
  }

  function newCards(slugs, count) {
    var cards = S.read().cards, pool = [];
    ix.docs.forEach(function (d) {
      if (slugs.indexOf(d.c) < 0) return;
      d.cards.forEach(function (n) {
        var id = d.id + "#C" + n;
        if (!cards[id]) pool.push({ id: id, n: n, doc: d });
      });
    });
    return shuffle(pool).slice(0, count);
  }

  // ---- session ----
  function start(list) {
    if (!list.length) return;
    queue = shuffle(list);
    pos = 0;
    tries = {};
    results = [];
    home.hidden = true;
    summ.hidden = true;
    sess.hidden = false;
    show();
  }

  function show() {
    if (pos >= queue.length) return finish();
    var item = queue[pos];
    prog.textContent = (pos + 1) + " / " + queue.length;
    stage.innerHTML = "";
    nextRow.hidden = true;
    from.innerHTML = "";
    var a = el("a", null, (ix.courses[item.doc.c] || {}).name + " · " + item.doc.t);
    a.href = S.base + item.doc.u;
    a.target = "_blank";
    from.appendChild(a);
    stage.appendChild(el("p", "review-hint", "카드를 불러오는 중…"));
    page(item.doc.u).then(function (doc) {
      var body = doc.querySelector(".note-body");
      var card = body && S.findCards(body).filter(function (d) {
        return new RegExp("C" + item.n + "\\s*<").test(d.querySelector("summary").innerHTML);
      })[0];
      stage.innerHTML = "";
      if (!card) {
        stage.appendChild(el("p", "review-hint", "이 카드를 찾지 못했어요. 노트가 바뀌었을 수 있어요."));
        nextRow.hidden = false;
        return;
      }
      var node = document.importNode(card, true);
      stage.appendChild(node);
      S.mount(node, {
        docId: item.doc.id, slug: item.doc.c,
        onDone: function (correct, st) {
          results.push({ item: item, correct: correct, conf: st.h[st.h.length - 1][1], due: st.d });
          tries[item.id] = (tries[item.id] || 0) + 1;
          if (!correct && tries[item.id] < 3) queue.push(item);
          prog.textContent = (pos + 1) + " / " + queue.length;
          nextRow.hidden = false;
          q("[data-review-next]").focus();
        }
      });
      if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([stage]).catch(function () {});
    }).catch(function () {
      stage.innerHTML = "";
      stage.appendChild(el("p", "review-hint", "노트를 불러오지 못했어요."));
      nextRow.hidden = false;
    });
  }

  function finish() {
    sess.hidden = true;
    summ.hidden = false;
    summ.innerHTML = "";
    var first = {};
    results.forEach(function (r) { if (!(r.item.id in first)) first[r.item.id] = r; });
    var firsts = Object.keys(first).map(function (k) { return first[k]; });
    var ok = firsts.filter(function (r) { return r.correct; }).length;
    summ.appendChild(el("h2", "review-h", "끝났어요"));
    summ.appendChild(el("p", "review-big", "처음 시도에서 " + firsts.length + "장 중 " + ok + "장을 맞혔어요."));
    var sure = firsts.filter(function (r) { return !r.correct && r.conf === 3; });
    if (sure.length) {
      summ.appendChild(el("p", "review-hint", "확실하다고 했는데 틀린 카드예요. 다시 볼 만해요:"));
      var ul = el("ul");
      sure.forEach(function (r) {
        var li = el("li"), a = el("a", null, r.item.doc.t + " C" + r.item.n);
        a.href = S.base + r.item.doc.u;
        li.appendChild(a);
        ul.appendChild(li);
      });
      summ.appendChild(ul);
    }
    var dues = results.map(function (r) { return r.due; }).sort();
    if (dues.length) summ.appendChild(el("p", "review-hint", "가장 가까운 다음 복습: " + S.pretty(dues[0])));
    var back = el("button", "study-btn study-btn--primary", "복습 첫 화면으로");
    back.type = "button";
    back.addEventListener("click", function () { summ.hidden = true; home.hidden = false; renderHome(); });
    summ.appendChild(back);
  }

  q("[data-review-next]").addEventListener("click", function () { pos++; show(); });
  q("[data-review-quit]").addEventListener("click", function () { pos = queue.length; finish(); });
  q("[data-review-new]").addEventListener("click", function () {
    var slugs = [].map.call(root.querySelectorAll("[data-review-courses] input:checked"), function (c) { return c.value; });
    var err = q("[data-review-err]");
    if (!slugs.length) { err.textContent = "과목을 하나 이상 골라 주세요."; return; }
    var list = newCards(slugs, +q("[data-review-count]").value);
    if (!list.length) { err.textContent = "고른 과목에 아직 안 푼 카드가 없어요."; return; }
    err.textContent = "";
    start(list);
  });
  root.addEventListener("change", function (e) {
    if (e.target.closest("[data-review-courses]")) q("[data-review-err]").textContent = "";
  });
  var msg = q("[data-review-msg]");
  q("[data-review-csv]").addEventListener("click", function () {
    S.download("review-log-" + S.today() + ".csv", S.exportCsv(), "text/csv");
  });
  q("[data-review-backup]").addEventListener("click", function () {
    S.download("study-progress-" + S.today() + ".json", JSON.stringify(S.read()), "application/json");
  });
  q("[data-review-import]").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    f.text().then(function (txt) {
      var data = JSON.parse(txt);
      if (!data || !data.cards) throw new Error("bad");
      var mine = S.read(), n = 0;
      Object.keys(data.cards).forEach(function (id) {
        var a = mine.cards[id], b = data.cards[id];
        if (!a || (b.h || []).length > (a.h || []).length) { mine.cards[id] = b; n++; }
      });
      S.write(mine);
      msg.textContent = "카드 " + n + "장의 기록을 가져왔어요.";
      renderHome();
    }).catch(function () { msg.textContent = "이 파일은 백업 파일이 아니에요."; });
    e.target.value = "";
  });

  S.index().then(function (data) {
    ix = data;
    renderHome();
    var slug = params.get("course");
    if (slug && params.get("new")) {
      var list = newCards([slug], +params.get("new") || 10);
      if (list.length) start(list);
    } else if (slug) {
      var due = S.dueList(ix, slug);
      if (due.length) start(due);
    }
  }).catch(function () {
    q("[data-review-today]").textContent = "카드 목록을 불러오지 못했어요.";
  });
})();
