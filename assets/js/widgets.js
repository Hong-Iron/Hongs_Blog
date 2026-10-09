/* Hands-on versions of a few note figures. Each widget is keyed by the SVG
   figure it extends; it appears under that figure (after its caption) as a
   folded "직접 움직여 보기" box and draws only once opened. The notes in the
   vault stay unchanged: this is a blog-only layer. */
(function () {
  var imgs = document.querySelectorAll(".note-body img.note-fig");
  if (!imgs.length) return;

  // ---- helpers ----
  function css(name, fb) {
    var v = getComputedStyle(document.body).getPropertyValue(name).trim();
    return v || fb;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function slider(box, label, min, max, step, value, fmt) {
    var wrap = el("label", "widget-ctl");
    var name = el("span", "widget-ctl__name", label);
    var input = el("input");
    input.type = "range";
    input.min = min; input.max = max; input.step = step; input.value = value;
    var out = el("output", "widget-ctl__val");
    function show() { out.textContent = fmt ? fmt(+input.value) : input.value; }
    input.addEventListener("input", show);
    show();
    wrap.appendChild(name); wrap.appendChild(input); wrap.appendChild(out);
    box.appendChild(wrap);
    return input;
  }
  function select(box, label, options) {
    var wrap = el("label", "widget-ctl");
    wrap.appendChild(el("span", "widget-ctl__name", label));
    var s = el("select");
    options.forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; s.appendChild(op); });
    wrap.appendChild(s);
    box.appendChild(wrap);
    return s;
  }
  // a canvas with a data → pixel mapping
  function plot(box, h) {
    var c = el("canvas", "widget-canvas");
    box.appendChild(c);
    var ctx = c.getContext("2d"), W = 0, H = h, dpr = window.devicePixelRatio || 1;
    var P = { ctx: ctx, pad: 30 };
    P.size = function () {
      W = Math.max(260, box.clientWidth);
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P.W = W; P.H = H;
    };
    P.view = function (x0, x1, y0, y1) { P.x0 = x0; P.x1 = x1; P.y0 = y0; P.y1 = y1; };
    P.X = function (x) { return P.pad + (x - P.x0) / (P.x1 - P.x0) * (P.W - 2 * P.pad); };
    P.Y = function (y) { return P.H - P.pad + -(y - P.y0) / (P.y1 - P.y0) * (P.H - 2 * P.pad); };
    P.clear = function () {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = css("--rule", "#ccc");
      ctx.lineWidth = 1;
      if (P.y0 < 0 && P.y1 > 0) line(P.X(P.x0), P.Y(0), P.X(P.x1), P.Y(0));
      if (P.x0 < 0 && P.x1 > 0) line(P.X(0), P.Y(P.y0), P.X(0), P.Y(P.y1));
    };
    function line(a, b, c2, d) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c2, d); ctx.stroke(); }
    P.line = line;
    P.curve = function (f, color, width, dash) {
      ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.setLineDash(dash || []);
      ctx.beginPath();
      var n = 400, pen = false;
      for (var i = 0; i <= n; i++) {
        var x = P.x0 + (P.x1 - P.x0) * i / n, y = f(x);
        if (!isFinite(y) || y > P.y1 * 4 + 10 || y < P.y0 * 4 - 10) { pen = false; continue; }
        var px = P.X(x), py = P.Y(Math.max(P.y0 - 1, Math.min(P.y1 + 1, y)));
        if (pen) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        pen = true;
      }
      ctx.stroke(); ctx.setLineDash([]);
    };
    P.text = function (s, x, y, color, align) {
      ctx.fillStyle = color || css("--ink-muted", "#888");
      ctx.font = "12px " + css("--font-sans", "sans-serif");
      ctx.textAlign = align || "left";
      ctx.fillText(s, x, y);
    };
    return P;
  }
  var INK = function () { return css("--ink", "#222"); };
  var MUTED = function () { return css("--ink-muted", "#777"); };
  var ACC = function () { return css("--course", css("--accent", "#b0432c")); };
  var BLUE = "#3b82c4", ORANGE = "#d9622b";

  // ---- widgets ----
  var W = {};

  // 테일러 다항식: 차수와 함수를 바꾸며 근사가 넓어지는 모습
  W["18_taylor-series_fig1.svg"] = {
    hint: "차수를 올리며 다항식이 함수에 붙는 구간을 보세요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var fn = select(ctl, "함수", [["exp", "e^x"], ["sin", "sin x"], ["cos", "cos x"], ["log", "ln(1+x)"]]);
      var n = slider(ctl, "차수 n", 0, 15, 1, 3);
      var P = plot(box, 280), note = el("p", "widget-note"); box.appendChild(note);
      function coef(k, f) {
        var fact = 1; for (var i = 2; i <= k; i++) fact *= i;
        if (f === "exp") return 1 / fact;
        if (f === "sin") return k % 2 ? (((k - 1) / 2) % 2 ? -1 : 1) / fact : 0;
        if (f === "cos") return k % 2 ? 0 : ((k / 2) % 2 ? -1 : 1) / fact;
        return k ? (k % 2 ? 1 : -1) / k : 0;
      }
      var F = { exp: Math.exp, sin: Math.sin, cos: Math.cos, log: function (x) { return x > -1 ? Math.log(1 + x) : NaN; } };
      var V = { exp: [-4, 4, -2, 12], sin: [-9, 9, -2.5, 2.5], cos: [-9, 9, -2.5, 2.5], log: [-1, 2.2, -3, 2] };
      function draw() {
        P.size();
        var f = fn.value, N = +n.value, v = V[f];
        P.view(v[0], v[1], v[2], v[3]); P.clear();
        P.curve(F[f], MUTED(), 3.5);
        P.curve(function (x) { var s = 0, p = 1; for (var k = 0; k <= N; k++) { s += coef(k, f) * p; p *= x; } return s; }, ACC(), 2);
        P.text("회색: 원래 함수   색: T" + N, P.pad, 16);
        note.textContent = f === "log" ? "ln(1+x)는 수렴 반지름이 1이라, 차수를 올려도 x > 1 쪽은 오히려 더 벗어나요." : "차수를 하나 올릴 때마다 0 근처에서 겹치는 구간이 바깥으로 넓어져요.";
      }
      fn.addEventListener("change", draw); n.addEventListener("input", draw);
      return draw;
    }
  };

  // 컨벌루션: 뒤집고 밀어서 겹친 넓이
  W["19_convolution-integral_fig1.svg"] = {
    hint: "t를 움직이며 뒤집힌 h가 지나갈 때 겹친 넓이가 y(t)가 되는 모습을 보세요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var xs = select(ctl, "x(τ)", [["rect", "사각 (0~1)"], ["rect2", "사각 (0~2)"], ["tri", "삼각 (0~1)"]]);
      var hs = select(ctl, "h(τ)", [["exp", "e^(-2τ) (τ≥0)"], ["rect", "사각 (0~1)"], ["ramp", "기울기 (0~1)"]]);
      var t = slider(ctl, "t", -1, 4, 0.01, 0.6, function (v) { return v.toFixed(2); });
      var P = plot(box, 200), P2 = plot(box, 170);
      var SH = {
        rect: function (u) { return u >= 0 && u < 1 ? 1 : 0; },
        rect2: function (u) { return u >= 0 && u < 2 ? 1 : 0; },
        tri: function (u) { return u >= 0 && u < 1 ? 1 - Math.abs(2 * u - 1) : 0; },
        exp: function (u) { return u >= 0 ? Math.exp(-2 * u) : 0; },
        ramp: function (u) { return u >= 0 && u < 1 ? u : 0; }
      };
      function conv(x, h, tt) { var s = 0, d = 0.01; for (var a = -1; a < 5; a += d) s += x(a + d / 2) * h(tt - a - d / 2) * d; return s; }
      function draw() {
        P.size(); P2.size();
        var x = SH[xs.value], h = SH[hs.value], tt = +t.value, ctx = P.ctx;
        P.view(-1, 4, -0.2, 1.3); P.clear();
        ctx.fillStyle = "rgba(217,98,43,0.28)";
        ctx.beginPath(); ctx.moveTo(P.X(-1), P.Y(0));
        for (var i = 0; i <= 400; i++) { var a = -1 + 5 * i / 400; ctx.lineTo(P.X(a), P.Y(Math.min(x(a), h(tt - a)))); }
        ctx.lineTo(P.X(4), P.Y(0)); ctx.fill();
        P.curve(x, BLUE, 2);
        P.curve(function (a) { return h(tt - a); }, ORANGE, 2, [5, 4]);
        P.text("파랑: x(τ)   주황 점선: h(t - τ)   칠한 부분: 겹친 곱", P.pad, 16);
        P2.view(-1, 4, -0.1, 1.3); P2.clear();
        var ys = []; for (var k = 0; k <= 250; k++) { var tk = -1 + 5 * k / 250; ys.push([tk, conv(x, h, tk)]); }
        var top = Math.max.apply(null, ys.map(function (p) { return p[1]; })) || 1;
        P2.view(-1, 4, -0.1 * top, 1.25 * top); P2.clear();
        P2.curve(function (u) { var k = Math.round((u + 1) / 5 * 250); return ys[Math.max(0, Math.min(250, k))][1]; }, MUTED(), 1.5, [3, 3]);
        P2.curve(function (u) { if (u > tt) return NaN; var k = Math.round((u + 1) / 5 * 250); return ys[Math.max(0, Math.min(250, k))][1]; }, ACC(), 2.5);
        var yt = conv(x, h, tt);
        P2.ctx.fillStyle = ACC(); P2.ctx.beginPath(); P2.ctx.arc(P2.X(tt), P2.Y(yt), 4, 0, 7); P2.ctx.fill();
        P2.text("y(t) = 칠한 넓이 = " + yt.toFixed(3), P2.pad, 16);
      }
      [xs, hs].forEach(function (s) { s.addEventListener("change", draw); });
      t.addEventListener("input", draw);
      return draw;
    }
  };

  // 푸리에 부분합과 깁스 현상
  W["31_fourier-series-convergence_fig1.svg"] = {
    hint: "더하는 고조파 수를 늘려 보세요. 모서리 옆 봉우리는 낮아지지 않고 좁아지기만 해요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var N = slider(ctl, "최고 차수 N", 1, 99, 2, 5);
      var P = plot(box, 260);
      function S(x, n) { var s = 0; for (var k = 1; k <= n; k += 2) s += 4 / (Math.PI * k) * Math.sin(k * x); return s; }
      function draw() {
        P.size(); var n = +N.value;
        P.view(-Math.PI, Math.PI, -1.5, 1.5); P.clear();
        P.curve(function (x) { return x === 0 ? 0 : (x > 0 ? 1 : -1); }, MUTED(), 3);
        P.curve(function (x) { return S(x, n); }, ACC(), 2);
        var peak = 0; for (var x = 0.0005; x < 1; x += 0.0005) peak = Math.max(peak, S(x, n));
        P.text("사각파와 N = " + n + "까지 더한 부분합 · 봉우리 높이 " + peak.toFixed(3), P.pad, 16);
      }
      N.addEventListener("input", draw);
      return draw;
    }
  };

  // 2차원 합성곱: 평균 창의 폭과 줄무늬
  W["31_two-dimensional-convolution_fig1.svg"] = {
    hint: "창 폭을 바꾸며 어느 줄무늬가 먼저 지워지는지, 언제 밝고 어두운 줄이 뒤집히는지 보세요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var w = slider(ctl, "창 폭", 1, 25, 1, 3);
      var P = plot(box, 220), note = el("p", "widget-note"); box.appendChild(note);
      var seg = 48, xs = [];
      for (var i = 0; i < 3 * seg; i++) xs.push(Math.cos(2 * Math.PI * i / (i < seg ? 4 : i < 2 * seg ? 8 : 16)));
      function draw() {
        P.size(); var k = +w.value, half = Math.floor(k / 2);
        var ys = xs.map(function (_, i) {
          var s = 0; for (var j = i - half; j < i - half + k; j++) s += xs[Math.max(0, Math.min(xs.length - 1, j))]; return s / k;
        });
        P.view(0, xs.length - 1, -1.2, 1.2); P.clear();
        P.curve(function (x) { return xs[Math.round(x)]; }, MUTED(), 1);
        P.curve(function (x) { return ys[Math.round(x)]; }, ACC(), 2.2);
        [4, 8, 16].forEach(function (p, i) {
          var g = Math.sin(Math.PI * k / p) / (k * Math.sin(Math.PI / p));
          P.text("주기 " + p + ": " + (Math.abs(g) < 1e-9 ? "0" : g.toFixed(2)) + "배", P.X(i * seg + seg / 2), 16, null, "center");
        });
        note.textContent = "숫자는 창이 줄무늬 진폭을 몇 배로 바꾸는지예요. 음수면 밝고 어두운 줄이 뒤집혀요. 창 폭이 주기의 배수면 0이 돼요.";
      }
      w.addEventListener("input", draw);
      return draw;
    }
  };

  // 복소수 표현: 도는 점과 그림자
  W["24_complex-wave_fig1.svg"] = {
    hint: "진폭, 주기, 위상을 바꾸고 재생을 눌러 원 위의 점과 사인 곡선이 함께 움직이는 모습을 보세요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var A = slider(ctl, "진폭 A", 0.2, 1, 0.05, 1, function (v) { return v.toFixed(2); });
      var T = slider(ctl, "주기 T", 0.25, 2, 0.05, 1, function (v) { return v.toFixed(2); });
      var ph = slider(ctl, "위상 φ", 0, 6.28, 0.01, 0, function (v) { return (v / Math.PI).toFixed(2) + "π"; });
      var play = el("button", "study-btn", "재생"); play.type = "button"; ctl.appendChild(play);
      var P = plot(box, 240), t0 = 0, raf = 0, last = 0;
      function draw() {
        P.size(); var ctx = P.ctx, a = +A.value, per = +T.value, phi = +ph.value;
        var R = (P.H - 2 * P.pad) / 2.4, cx = P.pad + R * 1.2, cy = P.H / 2;
        ctx.clearRect(0, 0, P.W, P.H);
        ctx.strokeStyle = css("--rule", "#ccc"); ctx.lineWidth = 1;
        P.line(cx - R * 1.15, cy, cx + R * 1.15, cy); P.line(cx, cy - R * 1.15, cx, cy + R * 1.15);
        ctx.beginPath(); ctx.arc(cx, cy, R * a, 0, 7); ctx.strokeStyle = MUTED(); ctx.stroke();
        var ang = 2 * Math.PI * t0 / per + phi, px = cx + R * a * Math.cos(ang), py = cy - R * a * Math.sin(ang);
        ctx.strokeStyle = ACC(); ctx.lineWidth = 2; P.line(cx, cy, px, py);
        var x0 = cx + R * 1.4, x1 = P.W - P.pad, span = 2;
        ctx.strokeStyle = css("--rule", "#ccc"); ctx.lineWidth = 1; P.line(x0, cy, x1, cy);
        ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.beginPath();
        for (var i = 0; i <= 300; i++) {
          var tt = span * i / 300, xx = x0 + (x1 - x0) * i / 300, yy = cy - R * a * Math.sin(2 * Math.PI * tt / per + phi);
          if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
        }
        ctx.stroke();
        var sx = x0 + (x1 - x0) * ((t0 % span) / span);
        var sy = cy - R * a * Math.sin(2 * Math.PI * (t0 % span) / per + phi);
        ctx.setLineDash([3, 3]); ctx.strokeStyle = MUTED(); P.line(px, py, sx, sy); ctx.setLineDash([]);
        ctx.fillStyle = ACC(); ctx.beginPath(); ctx.arc(px, py, 4.5, 0, 7); ctx.fill();
        ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, 7); ctx.fill();
        P.text("t = " + (t0 % span).toFixed(2) + "  ·  A sin(2πt/T + φ) = " + (a * Math.sin(2 * Math.PI * (t0 % span) / per + phi)).toFixed(2), x0, 16);
      }
      function tick(now) {
        if (last) t0 += (now - last) / 1000 * 0.5;
        last = now; draw(); raf = requestAnimationFrame(tick);
      }
      play.addEventListener("click", function () {
        if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0; play.textContent = "재생"; }
        else { play.textContent = "멈춤"; raf = requestAnimationFrame(tick); }
      });
      [A, T, ph].forEach(function (s) { s.addEventListener("input", draw); });
      return draw;
    }
  };

  // 중심극한정리: 주사위 n개의 합
  W["22_clt_fig1.svg"] = {
    hint: "주사위 개수를 늘리며 합의 분포가 종 모양에 가까워지는 모습을 보세요.",
    build: function (box) {
      var ctl = el("div", "widget-ctls"); box.appendChild(ctl);
      var n = slider(ctl, "주사위 수 n", 1, 30, 1, 2);
      var P = plot(box, 240);
      function draw() {
        P.size(); var k = +n.value, dist = [1];
        for (var r = 0; r < k; r++) {
          var nx = new Array(dist.length + 6).fill(0);
          dist.forEach(function (p, i) { for (var f = 1; f <= 6; f++) nx[i + f] += p / 6; });
          dist = nx;
        }
        var mu = 3.5 * k, sd = Math.sqrt(35 / 12 * k), top = 0;
        dist.forEach(function (p) { top = Math.max(top, p); });
        P.view(k - 0.5, 6 * k + 0.5, 0, top * 1.15); P.clear();
        var ctx = P.ctx, bw = Math.max(1, (P.X(1) - P.X(0)) * 0.8);
        ctx.fillStyle = "rgba(59,130,196,0.55)";
        dist.forEach(function (p, s) { if (s >= k) ctx.fillRect(P.X(s) - bw / 2, P.Y(p), bw, P.Y(0) - P.Y(p)); });
        P.curve(function (x) { return Math.exp(-((x - mu) * (x - mu)) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)); }, ACC(), 2);
        P.text("합의 정확한 분포(막대)와 평균 " + mu.toFixed(1) + ", 표준편차 " + sd.toFixed(2) + "인 정규분포(선)", P.pad, 16);
      }
      n.addEventListener("input", draw);
      return draw;
    }
  };

  // ---- mount ----
  [].forEach.call(imgs, function (img) {
    var file = (img.getAttribute("src") || "").split("/").pop();
    var spec = W[file];
    if (!spec) return;
    var anchor = img.closest("p") || img;
    var after = anchor.nextElementSibling && anchor.nextElementSibling.tagName === "P" ? anchor.nextElementSibling : anchor;
    var d = el("details", "widget");
    var s = el("summary", "widget__summary");
    s.appendChild(el("span", "widget__badge", "직접 움직여 보기"));
    s.appendChild(el("span", "widget__hint", spec.hint));
    d.appendChild(s);
    var box = el("div", "widget__box");
    d.appendChild(box);
    after.parentNode.insertBefore(d, after.nextSibling);
    var draw = null;
    d.addEventListener("toggle", function () {
      if (d.open && !draw) draw = spec.build(box);
      if (d.open && draw) draw();
    });
    var rt = 0;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (d.open && draw) draw(); }, 150);
    });
  });
})();
