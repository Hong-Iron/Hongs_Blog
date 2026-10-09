/* Study features: solving the check-question cards, spaced review, progress.

   Everything is kept in this browser only (localStorage "study-progress").
   The vault's rules, simplified for self-checking:
     phase 0 (처음) → 1 → 2 → 3 → 4 (익힘). A right answer moves one phase up and
     schedules the next review 1, 3, 7, 21 days later; a wrong answer keeps the
     phase and halves the gap (at least 1 day). When the course has an exam
     ahead, the gap is capped by the time left (CLAUDE.md §8.3).
   Card ids are "<note id>#C<n>", the same as the vault's review-log.csv, so an
   exported log can be merged back into the vault.

   Used by: notes (cards, sidebar dots), course pages (progress box), the
   Studies page (bars, today's review link) and /studies/review/. */
(function () {
  var me = document.currentScript;
  var BASE = (me && me.getAttribute("data-base")) || "";
  var INDEX_URL = (me && me.getAttribute("data-index")) || BASE + "/assets/study-index.json";
  var KEY = "study-progress";
  var GAPS = [0, 1, 3, 7, 21];
  var PHASE = ["처음", "1차 복습", "2차 복습", "3차 복습", "익힘"];

  // ---- dates -------------------------------------------------------------
  function ymd(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function today() { return ymd(new Date()); }
  function addDays(s, n) {
    var p = s.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + n);
    return ymd(d);
  }
  function daysBetween(a, b) {
    var pa = a.split("-"), pb = b.split("-");
    return Math.round((new Date(+pb[0], +pb[1] - 1, +pb[2]) - new Date(+pa[0], +pa[1] - 1, +pa[2])) / 864e5);
  }
  function pretty(s) {
    var p = s.split("-");
    return (+p[1]) + "월 " + (+p[2]) + "일";
  }

  // ---- store -------------------------------------------------------------
  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v && v.cards) return v;
    } catch (e) {}
    return { v: 1, cards: {} };
  }
  function write(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }

  // ---- index -------------------------------------------------------------
  var indexP = null, byUrl = null;
  function index() {
    if (!indexP) {
      indexP = fetch(INDEX_URL).then(function (r) { return r.json(); }).then(function (ix) {
        byUrl = {};
        ix.docs.forEach(function (d) { byUrl[d.u] = d; d.id = d.u.replace(/\/$/, "").split("/").pop(); });
        ix.byUrl = byUrl;
        return ix;
      });
    }
    return indexP;
  }

  function nextExam(ix, slug) {
    var c = ix.courses[slug], t = today();
    if (!c) return null;
    var ahead = c.exams.filter(function (e) { return e.date >= t; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    return ahead[0] ? { label: ahead[0].label, date: ahead[0].date, days: daysBetween(t, ahead[0].date) } : null;
  }

  function examCap(R) {
    if (R <= 7) return Math.max(1, Math.round(0.3 * R));
    if (R <= 30) return Math.max(1, Math.round(0.2 * R));
    if (R <= 120) return Math.max(1, Math.round(0.12 * R));
    return 21;
  }

  // record one attempt; returns the new card state
  function record(ix, cardId, slug, conf, correct) {
    var data = read(), t = today();
    var st = data.cards[cardId] || { p: 0, d: t, g: 0, h: [] };
    var exam = ix ? nextExam(ix, slug) : null;
    var gap;
    if (correct) {
      st.p = Math.min(st.p + 1, 4);
      gap = GAPS[st.p];
    } else {
      gap = Math.max(1, Math.floor((st.g || 1) / 2));
    }
    if (exam && exam.days > 0) gap = Math.min(gap, examCap(exam.days));
    st.g = gap;
    st.d = addDays(t, gap);
    st.h.push([t, conf, correct ? 1 : 0]);
    data.cards[cardId] = st;
    write(data);
    return st;
  }

  // ---- progress ----------------------------------------------------------
  function docState(d, cards) {
    if (!d || !d.cards.length) return null;
    var sum = 0, seen = 0, due = 0, t = today();
    d.cards.forEach(function (n) {
      var st = cards[d.id + "#C" + n];
      if (st) {
        seen++;
        sum += st.p;
        if (st.d <= t) due++;
      }
    });
    var frac = sum / (4 * d.cards.length);
    var state = !seen ? "new" : (sum === 4 * d.cards.length ? "mastered" : "learning");
    return { frac: frac, state: state, seen: seen, total: d.cards.length, due: due };
  }

  function courseStats(ix, slug, cards) {
    var docs = ix.docs.filter(function (d) { return d.c === slug && d.cards.length; });
    var s = { concepts: docs.length, mastered: 0, learning: 0, cards: 0, seen: 0, due: 0, frac: 0, next: [] };
    var mastered = {};
    docs.forEach(function (d) {
      var ds = docState(d, cards);
      s.cards += ds.total;
      s.seen += ds.seen;
      s.due += ds.due;
      s.frac += ds.frac;
      if (ds.state === "mastered") { s.mastered++; mastered[d.u] = true; }
      else if (ds.state === "learning") s.learning++;
    });
    s.frac = docs.length ? s.frac / docs.length : 0;
    // ready to learn: not mastered, every prerequisite in this course mastered (roadmap order)
    s.next = docs.filter(function (d) {
      if (mastered[d.u]) return false;
      return d.pre.every(function (u) { return mastered[u] || !byUrl[u] || !byUrl[u].cards.length; });
    }).slice(0, 3);
    return s;
  }

  function dueList(ix, slug) {
    var cards = read().cards, t = today(), out = [];
    ix.docs.forEach(function (d) {
      if (slug && d.c !== slug) return;
      d.cards.forEach(function (n) {
        var id = d.id + "#C" + n, st = cards[id];
        if (st && st.d <= t) out.push({ id: id, n: n, doc: d });
      });
    });
    return out;
  }

  // ---- card widget -------------------------------------------------------
  var CARD_SUMMARY = /^\s*(?:<b>|<strong>)\s*C(\d+)\s*(?:<\/b>|<\/strong>)\s*/;

  function findCards(root) {
    return [].slice.call(root.querySelectorAll("details")).filter(function (dt) {
      var s = dt.querySelector(":scope > summary");
      return s && CARD_SUMMARY.test(s.innerHTML);
    });
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function statusText(st) {
    if (!st) return "새 카드";
    if (st.p === 4) return "익힘 · 다음 " + pretty(st.d);
    if (st.d <= today()) return PHASE[st.p] + " · 오늘 복습";
    return PHASE[st.p] + " · 다음 " + pretty(st.d);
  }

  /* Turn one <details> card into a solve-first card.
     opts: { docId, slug, onDone(correct) } */
  function mount(details, opts) {
    var summary = details.querySelector(":scope > summary");
    var m = summary.innerHTML.match(CARD_SUMMARY);
    var n = +m[1];
    var cardId = opts.docId + "#C" + n;
    var box = el("div", "study-card");
    box.setAttribute("data-card", cardId);

    var head = el("div", "study-card__head");
    head.appendChild(el("span", "study-card__no", "C" + n));
    var status = el("span", "study-card__status", statusText(read().cards[cardId]));
    head.appendChild(status);
    var peek = el("button", "study-card__peek", "답만 보기");
    peek.type = "button";
    head.appendChild(peek);

    var q = el("div", "study-card__q");
    q.innerHTML = summary.innerHTML.replace(CARD_SUMMARY, "");

    var ans = el("div", "study-card__a");
    ans.hidden = true;
    var lab = el("div", "study-card__label", "답");
    ans.appendChild(lab);
    while (summary.nextSibling) ans.appendChild(summary.nextSibling);

    var work = el("div", "study-card__work");
    var ta = el("textarea", "study-card__input");
    ta.rows = 2;
    ta.placeholder = "답을 보기 전에 먼저 써 보세요. 짧게라도 괜찮아요.";
    ta.setAttribute("aria-label", "C" + n + " 내 답");
    var conf = el("div", "study-card__conf");
    conf.appendChild(el("span", "study-card__conf-label", "확신도"));
    var picked = 0;
    [["1", "추측"], ["2", "반쯤"], ["3", "확실"]].forEach(function (c) {
      var b = el("button", "study-chip", c[0] + " " + c[1]);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        picked = +c[0];
        [].forEach.call(conf.querySelectorAll(".study-chip"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        err.textContent = "";
      });
      conf.appendChild(b);
    });
    var reveal = el("button", "study-btn study-btn--primary", "답 확인");
    reveal.type = "button";
    var err = el("span", "study-card__err");
    var row = el("div", "study-card__row");
    row.appendChild(conf);
    row.appendChild(reveal);
    row.appendChild(err);
    work.appendChild(ta);
    work.appendChild(row);

    var grade = el("div", "study-card__grade");
    grade.hidden = true;
    var mine = el("div", "study-card__mine");
    var gq = el("span", "study-card__gq", "내 답이 핵심을 다 담았나요?");
    var right = el("button", "study-btn study-btn--ok", "맞혔어요");
    var wrong = el("button", "study-btn study-btn--no", "틀렸어요");
    right.type = wrong.type = "button";
    grade.appendChild(mine);
    grade.appendChild(gq);
    grade.appendChild(right);
    grade.appendChild(wrong);
    var done = el("div", "study-card__done");
    done.hidden = true;

    box.appendChild(head);
    box.appendChild(q);
    box.appendChild(work);
    box.appendChild(ans);
    box.appendChild(grade);
    box.appendChild(done);
    details.parentNode.replaceChild(box, details);

    peek.addEventListener("click", function () {
      ans.hidden = !ans.hidden;
      peek.textContent = ans.hidden ? "답만 보기" : "답 가리기";
    });
    reveal.addEventListener("click", function () {
      if (!picked) { err.textContent = "확신도를 먼저 골라 주세요."; return; }
      ans.hidden = false;
      work.hidden = true;
      peek.hidden = true;
      var t = ta.value.trim();
      mine.hidden = !t;
      mine.textContent = t ? "내 답: " + t : "";
      grade.hidden = false;
      right.focus();
    });
    function finish(correct) {
      index().catch(function () { return null; }).then(function (ix) {
        var st = record(ix, cardId, opts.slug, picked, correct);
        grade.hidden = true;
        done.hidden = false;
        done.textContent = (correct ? "기록했어요. " : "괜찮아요, 기록했어요. ") +
          (st.p === 4 ? "익힘 단계예요. " : "") + "다음 복습은 " + pretty(st.d) + "이에요.";
        status.textContent = statusText(st);
        var again = el("button", "study-card__again", "다시 풀기");
        again.type = "button";
        again.addEventListener("click", function () {
          picked = 0;
          ta.value = "";
          [].forEach.call(conf.querySelectorAll(".study-chip"), function (x) { x.setAttribute("aria-pressed", "false"); });
          ans.hidden = true;
          work.hidden = false;
          peek.hidden = false;
          peek.textContent = "답만 보기";
          done.hidden = true;
        });
        done.appendChild(again);
        document.dispatchEvent(new CustomEvent("study:recorded", { detail: { id: cardId, correct: correct } }));
        if (opts.onDone) opts.onDone(correct, st);
      });
    }
    right.addEventListener("click", function () { finish(true); });
    wrong.addEventListener("click", function () { finish(false); });
    return box;
  }

  // ---- export / import ---------------------------------------------------
  function exportCsv() {
    var data = read(), rows = ["date,card,phase,confidence,correct,next_due"];
    Object.keys(data.cards).sort().forEach(function (id) {
      var st = data.cards[id], p = 0;
      st.h.forEach(function (h, i) {
        var before = ["initial", "r1", "r2", "r3", "maintain"][Math.min(p, 4)];
        if (h[2]) p = Math.min(p + 1, 4);
        rows.push([h[0], id, before, h[1], h[2], i === st.h.length - 1 ? st.d : ""].join(","));
      });
    });
    return rows.join("\n") + "\n";
  }
  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---- page wiring -------------------------------------------------------
  function here() { return location.pathname.replace(BASE, ""); }

  function wireNote() {
    var body = document.querySelector(".note-body");
    var slug = document.body.getAttribute("data-course");
    if (!body || !slug || document.querySelector(".note--course")) return;
    var docId = here().replace(/\/$/, "").split("/").pop();
    findCards(body).forEach(function (d) { mount(d, { docId: docId, slug: slug }); });
  }

  function dot(link, ds) {
    var old = link.querySelector(".study-dot");
    if (old) old.remove();
    if (!ds) return;
    var d = el("span", "study-dot study-dot--" + ds.state);
    d.style.setProperty("--p", Math.round(ds.frac * 100) + "%");
    d.title = ds.state === "new" ? "아직 안 풂" : (ds.state === "mastered" ? "익힘" : "푸는 중 · " + Math.round(ds.frac * 100) + "%") + (ds.due ? " · 오늘 복습 " + ds.due + "장" : "");
    link.appendChild(d);
  }

  function statsLine(ix, slug, s) {
    var exam = nextExam(ix, slug);
    var parts = ["익힘 " + s.mastered + " / " + s.concepts];
    if (s.learning) parts.push("푸는 중 " + s.learning);
    if (s.due) parts.push("오늘 복습 " + s.due + "장");
    if (exam) parts.push(exam.label + "고사까지 " + exam.days + "일");
    return parts.join(" · ");
  }

  function paintToc(ix) {
    var toc = document.getElementById("note-toc");
    if (!toc) return;
    var cards = read().cards, slug = document.body.getAttribute("data-course");
    [].forEach.call(toc.querySelectorAll(".note-toc__link"), function (a) {
      dot(a, docState(byUrl[a.getAttribute("href").replace(BASE, "")], cards));
    });
    var s = courseStats(ix, slug, cards);
    var line = toc.querySelector(".study-toc-stats") || el("a", "study-toc-stats");
    line.href = BASE + "/studies/review/?course=" + slug;
    line.textContent = statsLine(ix, slug, s);
    var course = toc.querySelector(".note-toc__course");
    if (course && !line.parentNode) course.parentNode.insertBefore(line, course.nextSibling);
  }

  function paintCourse(ix) {
    var page = document.querySelector(".note--course");
    var slug = document.body.getAttribute("data-course");
    if (!page || !slug) return;
    var cards = read().cards, s = courseStats(ix, slug, cards);
    var box = document.querySelector(".study-progress") || el("section", "study-progress container");
    box.setAttribute("aria-label", "내 진도");
    box.innerHTML = "";
    var bar = el("div", "study-bar");
    var fill = el("span", "study-bar__fill");
    fill.style.width = Math.round(s.frac * 100) + "%";
    bar.appendChild(fill);
    box.appendChild(el("p", "study-progress__line", statsLine(ix, slug, s)));
    box.appendChild(bar);
    if (s.next.length) {
      var nx = el("p", "study-progress__next");
      nx.appendChild(document.createTextNode("다음에 배울 수 있는 것: "));
      s.next.forEach(function (d, i) {
        if (i) nx.appendChild(document.createTextNode(", "));
        var a = el("a", null, d.t);
        a.href = BASE + d.u;
        nx.appendChild(a);
      });
      box.appendChild(nx);
    }
    var go = el("a", "study-btn study-btn--primary", s.due ? "오늘 복습 " + s.due + "장 풀기" : "이 과목 카드 섞어 풀기");
    go.href = BASE + "/studies/review/?course=" + slug + (s.due ? "" : "&new=10");
    box.appendChild(go);
    if (!box.parentNode) {
      var header = page.querySelector(".course-header");
      header.parentNode.insertBefore(box, header.nextSibling);
    }
    // dots in the roadmap tables
    [].forEach.call(page.querySelectorAll(".note-body td a[href]"), function (a) {
      var d = byUrl[a.getAttribute("href").replace(BASE, "")];
      if (d && d.k === "concept" && a.closest("td") === a.closest("tr").children[1]) dot(a, docState(d, cards));
    });
  }

  function paintHub(ix) {
    var layout = document.querySelector(".study-layout");
    if (!layout) return;
    var cards = read().cards, totalDue = 0;
    [].forEach.call(document.querySelectorAll(".course-row[data-course]"), function (row) {
      var slug = row.getAttribute("data-course"), s = courseStats(ix, slug, cards);
      totalDue += s.due;
      var meta = row.querySelector(".course-row__meta");
      var bar = row.querySelector(".study-bar") || el("span", "study-bar study-bar--row");
      bar.innerHTML = "";
      var fill = el("span", "study-bar__fill");
      fill.style.width = Math.round(s.frac * 100) + "%";
      bar.appendChild(fill);
      bar.title = statsLine(ix, slug, s);
      if (!bar.parentNode && meta) meta.parentNode.insertBefore(bar, meta.nextSibling);
    });
    var banner = document.querySelector(".study-banner") || el("a", "study-banner");
    banner.href = BASE + "/studies/review/";
    banner.textContent = totalDue ? "오늘 복습할 카드 " + totalDue + "장 →" : "카드 섞어 풀기 →";
    if (!banner.parentNode) layout.parentNode.insertBefore(banner, layout);
  }

  function paintAll() {
    index().then(function (ix) {
      paintToc(ix);
      paintCourse(ix);
      paintHub(ix);
    }).catch(function () {});
  }

  window.Study = {
    base: BASE, index: index, read: read, write: write, today: today, pretty: pretty,
    record: record, docState: docState, courseStats: courseStats, dueList: dueList,
    findCards: findCards, mount: mount, exportCsv: exportCsv, download: download, nextExam: nextExam
  };

  function start() {
    wireNote();
    paintAll();
    document.addEventListener("study:recorded", paintAll);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
