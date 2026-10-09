/* Site search: ⌘K / Ctrl+K / "/" or the search button opens a spotlight-style
   panel over a dimmed page. The index (assets/search-index.json, built by
   search-index.json) loads the first time the panel opens. Every word of the
   query has to appear somewhere in a document; title and alias matches rank
   first, then course, summary and text. */
(function () {
  var btn = document.querySelector("[data-search-open]");
  if (!btn) return;
  var indexUrl = btn.getAttribute("data-search-index");
  var docs = null, loading = null;
  var overlay, input, list, note, results = [], active = -1, lastFocus = null;
  var MAX = 40;

  // 고윳값/고유값, 최댓값/최대값: drop a ㅅ final before 값 so both spellings
  // match. One character in, one character out, so indices stay aligned.
  function fold(t) {
    return (t || "").toLowerCase().replace(/[가-힣](?=값)/g, function (c) {
      var k = c.charCodeAt(0) - 0xac00;
      return k % 28 === 19 ? String.fromCharCode(c.charCodeAt(0) - 19) : c;
    });
  }

  // Search previews show TeX source as readable text: \frac12 → 1/2,
  // e^{j4t} → eʲ⁴ᵗ, \mathbf{v}_k → vₖ, \pm → ±.
  var SYM = { alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η",
    theta: "θ", vartheta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ",
    sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω", Gamma: "Γ",
    Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
    pm: "±", mp: "∓", times: "×", cdot: "·", cdots: "⋯", ldots: "…", dots: "…", le: "≤", leq: "≤", ge: "≥",
    geq: "≥", ne: "≠", neq: "≠", approx: "≈", sim: "∼", equiv: "≡", to: "→", rightarrow: "→", leftarrow: "←",
    Rightarrow: "⇒", Leftarrow: "⇐", Leftrightarrow: "⇔", leftrightarrow: "↔", iff: "⇔", implies: "⇒",
    mapsto: "↦", infty: "∞", sum: "Σ", prod: "Π", int: "∫", oint: "∮", partial: "∂", nabla: "∇", in: "∈",
    notin: "∉", subseteq: "⊆", subsetneq: "⊊", subset: "⊂", cup: "∪", cap: "∩", emptyset: "∅", varnothing: "∅",
    forall: "∀", exists: "∃", neg: "¬", land: "∧", lor: "∨", wedge: "∧", vee: "∨", oplus: "⊕", otimes: "⊗",
    circ: "∘", angle: "∠", perp: "⊥", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉", langle: "⟨",
    rangle: "⟩", mid: "|", vert: "|", lvert: "|", rvert: "|", Vert: "‖", lVert: "‖", rVert: "‖", quad: " ",
    qquad: " ", top: "ᵀ", intercal: "ᵀ", prime: "′", ell: "ℓ", star: "⋆", ast: "∗", deg: "°", hbar: "ħ" };
  var BB = { R: "ℝ", N: "ℕ", Z: "ℤ", Q: "ℚ", C: "ℂ" };
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "−": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", n: "ⁿ", i: "ⁱ", j: "ʲ", k: "ᵏ", t: "ᵗ",
    x: "ˣ", s: "ˢ", T: "ᵀ", "*": "*", "′": "′", "ᵀ": "ᵀ" };
  var SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "−": "₋", "=": "₌", "(": "₍", ")": "₎", a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ",
    k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ", p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", x: "ₓ" };
  function script(body, map, sign) {
    var out = "", ch = body.replace(/\s+/g, "");
    for (var i = 0; i < ch.length; i++) {
      if (!map[ch[i]]) return sign + (ch.length > 1 ? "(" + body + ")" : body);
      out += map[ch[i]];
    }
    return out;
  }
  function plainTex(t) {
    if (!t || !/[\\^_$]/.test(t)) return t;
    t = t.replace(/\$/g, "");
    for (var n = 0; n < 3; n++) {
      t = t.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, function (_, a, b) {
        return (a.length > 1 ? "(" + a + ")" : a) + "/" + (b.length > 1 ? "(" + b + ")" : b);
      });
    }
    t = t.replace(/\\[dt]?frac\s*([A-Za-z0-9])\s*([A-Za-z0-9])/g, "$1/$2")
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√($1)").replace(/\\sqrt\s*([A-Za-z0-9])/g, "√$1")
      .replace(/\\mathbb\s*\{?([RNZQC])\}?/g, function (_, c) { return BB[c]; })
      .replace(/\\(?:mathbf|mathrm|mathit|mathcal|mathsf|boldsymbol|bm|text|textbf|textit|operatorname|vec|hat|bar|tilde|overline|underline|widehat|widetilde)\s*\{([^{}]*)\}/g, "$1")
      .replace(/\\(?:mathbf|mathrm|boldsymbol|vec|hat|bar|tilde)\s+([A-Za-z])/g, "$1")
      .replace(/\\(?:left|right|big|Big|bigg|Bigg)(?![A-Za-z])\s*/g, "")
      .replace(/\\([A-Za-z]+)/g, function (_, name) { return SYM.hasOwnProperty(name) ? SYM[name] : name; })
      .replace(/\\[,;:! ]/g, " ").replace(/\\\\/g, " ").replace(/\\([{}%&#_$|])/g, "$1")
      .replace(/\^\{([^{}]*)\}/g, function (_, a) { return script(a, SUP, "^"); })
      .replace(/\^([A-Za-z0-9′ᵀ*])(?![A-Za-z0-9])/g, function (_, a) { return script(a, SUP, "^"); })
      .replace(/_\{([^{}]*)\}/g, function (_, a) { return script(a, SUB, "_"); })
      .replace(/([A-Za-z0-9)}α-ω])_([A-Za-z0-9])(?![A-Za-z0-9])/g, function (_, b, a) { return b + script(a, SUB, "_"); })
      .replace(/[{}]/g, "")
      .replace(/\s+/g, " ");
    return t;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function build() {
    overlay = el("div", "search-overlay");
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "모든 문서 검색");
    var panel = el("div", "search-panel");
    var field = el("div", "search-field");
    field.innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    input = el("input", "search-input");
    input.type = "search";
    input.placeholder = "개념, 과목, 영어 이름, 글 제목으로 찾기";
    input.setAttribute("aria-label", "검색어");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-controls", "search-results");
    var esc = el("button", "search-esc", "esc");
    esc.type = "button";
    esc.setAttribute("aria-label", "검색 닫기");
    field.appendChild(input);
    field.appendChild(esc);
    note = el("div", "search-note");
    list = el("ul", "search-results");
    list.id = "search-results";
    list.setAttribute("role", "listbox");
    var foot = el("div", "search-foot");
    foot.innerHTML = "<span><kbd>↑</kbd> <kbd>↓</kbd> 고르기</span><span><kbd>Enter</kbd> 열기</span><span><kbd>esc</kbd> 닫기</span>";
    panel.appendChild(field);
    panel.appendChild(note);
    panel.appendChild(list);
    panel.appendChild(foot);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
    esc.addEventListener("click", close);
    input.addEventListener("input", run);
    input.addEventListener("keydown", onKey);
    list.addEventListener("mousemove", function (e) {
      var a = e.target.closest(".search-hit");
      if (a) setActive(+a.getAttribute("data-i"));
    });
  }

  function load() {
    if (docs) return Promise.resolve(docs);
    if (!loading) {
      note.textContent = "문서 목록을 불러오는 중…";
      loading = fetch(indexUrl).then(function (r) { return r.json(); }).then(function (data) {
        var ent = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
        var unent = function (t) { return (t || "").replace(/&(amp|lt|gt|quot|#39|nbsp);/g, function (m) { return ent[m]; }); };
        docs = data.map(function (d) {
          d.code = (d.k || "").indexOf("코드") === 0;
          if (!d.code) {
            d.t = plainTex(d.t);
            d.x = plainTex(unent(d.x));
            d.d = plainTex(unent(d.d));
          }
          d._t = fold(d.t);
          d._a = fold(d.a);
          d._al = d._a ? d._a.split(" · ") : [];
          d._s = fold(d.s);
          d._k = fold(d.k);
          d._d = fold(d.d);
          d._x = fold(d.x);
          return d;
        });
        return docs;
      }).catch(function () {
        loading = null;
        note.textContent = "문서 목록을 불러오지 못했어요. 잠시 뒤 다시 열어 보세요.";
        throw new Error("search index");
      });
    }
    return loading;
  }

  // Code pages list their note's title as an alias; that match alone would
  // put every plot/verify script next to the note, so it doesn't count.
  function score(d, words) {
    var total = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], s = 0;
      var it = d._t.indexOf(w);
      if (it >= 0) s += it === 0 ? 14 : 10;
      if (d._t === w) s += 10;
      if (!d.code && d._a.indexOf(w) >= 0) s += d._al.indexOf(w) >= 0 ? 16 : 6;
      if (d._s.indexOf(w) >= 0) s += 4;
      if (d._k.indexOf(w) >= 0) s += 2;
      if (d._d.indexOf(w) >= 0) s += 3;
      if (d._x.indexOf(w) >= 0) s += 1;
      if (!s) return 0;
      total += s;
    }
    if (d.code) total -= 8;
    return total;
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function mark(text, words) {
    var low = fold(text), on = [], i, k;
    if (low.length !== text.length) low = text.toLowerCase();
    words.forEach(function (w) {
      if (!w) return;
      for (var at = low.indexOf(w); at >= 0; at = low.indexOf(w, at + w.length)) {
        for (k = at; k < at + w.length; k++) on[k] = true;
      }
    });
    var out = "";
    for (i = 0; i < text.length; i++) {
      if (on[i] && !on[i - 1]) out += "<mark>";
      out += esc(text[i]);
      if (on[i] && !on[i + 1]) out += "</mark>";
    }
    return out;
  }

  function snippet(d, words) {
    var src = d.d || d.x || d.a || "";
    var low = fold(src), at = -1;
    for (var i = 0; i < words.length && at < 0; i++) at = low.indexOf(words[i]);
    if (at < 0 && d.x) {
      low = d._x;
      for (var j = 0; j < words.length && at < 0; j++) at = low.indexOf(words[j]);
      if (at >= 0) src = d.x;
    }
    if (at < 0) return src.slice(0, 120);
    var start = Math.max(0, at - 40);
    return (start > 0 ? "…" : "") + src.slice(start, start + 140);
  }

  function run() {
    var q = fold(input.value.trim());
    if (!q) {
      results = [];
      list.innerHTML = "";
      note.hidden = false;
      note.textContent = "강의 노트, 연습 문제, 코드, 팡세, 프로젝트를 한꺼번에 찾아요. 여러 낱말을 띄어 쓰면 모두 들어 있는 문서만 보여요.";
      return;
    }
    load().then(function () {
      if (fold(input.value.trim()) !== q) return;
      var words = q.split(/\s+/).filter(Boolean);
      var hits = [];
      for (var i = 0; i < docs.length; i++) {
        var s = score(docs[i], words);
        if (s) hits.push([s, docs[i]]);
      }
      hits.sort(function (a, b) { return b[0] - a[0] || a[1].t.length - b[1].t.length; });
      results = hits.slice(0, MAX).map(function (h) { return h[1]; });
      render(words, hits.length);
    }).catch(function () {});
  }

  function render(words, count) {
    list.innerHTML = "";
    if (!results.length) {
      note.hidden = false;
      note.textContent = "‘" + input.value.trim() + "’이(가) 들어 있는 문서가 없어요.";
      return;
    }
    note.hidden = count <= MAX;
    note.textContent = "관련 문서 " + count + "개 중 앞의 " + MAX + "개";
    results.forEach(function (d, i) {
      var li = el("li");
      var a = el("a", "search-hit");
      a.href = d.u;
      a.setAttribute("role", "option");
      a.setAttribute("data-i", i);
      a.innerHTML = '<span class="search-hit__title">' + mark(d.t, words) + "</span>" +
        '<span class="search-hit__meta">' + esc([d.s, d.k].filter(Boolean).join(" · ")) + "</span>" +
        (d.d || d.x ? '<span class="search-hit__snip">' + mark(snippet(d, words), words) + "</span>" : "");
      li.appendChild(a);
      list.appendChild(li);
    });
    setActive(0);
  }

  function setActive(i) {
    var hits = list.querySelectorAll(".search-hit");
    if (!hits.length) return;
    active = Math.max(0, Math.min(i, hits.length - 1));
    hits.forEach(function (h, k) {
      h.classList.toggle("is-active", k === active);
      h.setAttribute("aria-selected", k === active ? "true" : "false");
    });
    var cur = hits[active], box = list.getBoundingClientRect(), r = cur.getBoundingClientRect();
    if (r.top < box.top) list.scrollTop -= box.top - r.top + 4;
    else if (r.bottom > box.bottom) list.scrollTop += r.bottom - box.bottom + 4;
  }

  function onKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") {
      var hit = list.querySelectorAll(".search-hit")[active];
      if (hit) {
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) window.open(hit.href, "_blank");
        else window.location.href = hit.href;
      }
    } else if (e.key === "Escape") { e.preventDefault(); close(); }
  }

  function open() {
    if (!overlay) build();
    if (!overlay.hidden) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("search-open");
    input.focus();
    input.select();
    run();
    load().catch(function () {});
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("search-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btn.addEventListener("click", open);
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (overlay && !overlay.hidden) close(); else open();
    } else if (e.key === "/" && !typing) {
      e.preventDefault();
      open();
    }
  });
  if (!/Mac|iPhone|iPad/.test(navigator.platform || "")) {
    var kbd = btn.querySelector(".site-search-btn__kbd");
    if (kbd) kbd.textContent = "Ctrl K";
  }
})();
