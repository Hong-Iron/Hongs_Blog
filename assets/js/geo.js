/* Geometry behind every page.
 *
 * <body data-geo="NAME"> picks a motif: confetti (home, About), rose
 * (Pensées), blueprint (projects) or a course slug (study notes). On course
 * pages the motif is driven by how far you have scrolled: the bars get
 * sorted, the Riemann sum gets finer, the lattice shears. Sections with
 * data-scene="…" recolour the whole page as they reach the middle of the
 * screen. Canvases with data-motif="…" (course tiles) draw a small version
 * that plays on hover.
 *
 * The canvas sits behind the content; on reading pages CSS masks it to the
 * margins and the header band (see .geo-canvas--masked in geo.css).
 */
(function () {
  "use strict";

  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TAU = Math.PI * 2;

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */

  function seeded(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    var a = h >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, f) { return a + (b - a) * f; }
  function frac(v) { return v - Math.floor(v); }
  function ease(f) { return f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2; }

  function parseColor(str) {
    var m;
    str = (str || "").trim();
    if ((m = str.match(/^#([0-9a-f]{3})$/i))) {
      return m[1].split("").map(function (h) { return parseInt(h + h, 16); });
    }
    if ((m = str.match(/^#([0-9a-f]{6})/i))) {
      return [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); });
    }
    if ((m = str.match(/rgba?\(([^)]+)\)/))) {
      return m[1].split(/[\s,\/]+/).slice(0, 3).map(Number);
    }
    return [128, 118, 104];
  }

  function rgba(c, a) {
    return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")";
  }

  var PAL_KEYS = ["a", "b", "c", "d", "ink", "bg"];

  function readPalette(el) {
    var cs = getComputedStyle(el);
    function v(name) { return parseColor(cs.getPropertyValue(name)); }
    return { a: v("--geo-1"), b: v("--geo-2"), c: v("--geo-3"), d: v("--geo-4"), ink: v("--ink"), bg: v("--bg") };
  }

  function mixPalette(from, to, f) {
    var out = {};
    PAL_KEYS.forEach(function (k) {
      out[k] = [lerp(from[k][0], to[k][0], f), lerp(from[k][1], to[k][1], f), lerp(from[k][2], to[k][2], f)];
    });
    return out;
  }

  function smoothClosed(ctx, pts) {
    var n = pts.length;
    ctx.beginPath();
    ctx.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
    for (var i = 0; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.closePath();
  }

  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
  }

  function line(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function arrow(ctx, x0, y0, x1, y1, head) {
    var a = Math.atan2(y1 - y0, x1 - x0);
    line(ctx, x0, y0, x1, y1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - head * Math.cos(a - 0.45), y1 - head * Math.sin(a - 0.45));
    ctx.lineTo(x1 - head * Math.cos(a + 0.45), y1 - head * Math.sin(a + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  function label(ctx, text, x, y, color, size) {
    ctx.font = (size || 11) + 'px "SFMono-Regular", Consolas, monospace';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // one Bauhaus-ish primitive centred on the origin
  function shape(ctx, kind, s) {
    var h = s / 2;
    switch (kind) {
      case "circle": circle(ctx, 0, 0, h); ctx.fill(); break;
      case "ring": circle(ctx, 0, 0, h * 0.85); ctx.stroke(); break;
      case "square": ctx.fillRect(-h * 0.85, -h * 0.85, h * 1.7, h * 1.7); break;
      case "semi": ctx.beginPath(); ctx.arc(0, 0, h, 0, Math.PI); ctx.closePath(); ctx.fill(); break;
      case "tri":
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(h * 0.95, h * 0.7);
        ctx.lineTo(-h * 0.95, h * 0.7);
        ctx.closePath();
        ctx.fill();
        break;
      case "plus":
        ctx.fillRect(-h, -h * 0.16, s, h * 0.32);
        ctx.fillRect(-h * 0.16, -h, h * 0.32, s);
        break;
      case "zig":
        ctx.beginPath();
        ctx.moveTo(-h, h * 0.3);
        for (var i = 1; i <= 4; i++) ctx.lineTo(-h + i * h / 2, i % 2 ? -h * 0.3 : h * 0.3);
        ctx.stroke();
        break;
      default: // dots
        for (var x = -1; x <= 1; x++) {
          for (var y = -1; y <= 1; y++) { circle(ctx, x * h * 0.62, y * h * 0.62, s * 0.07); ctx.fill(); }
        }
    }
  }

  // where a motif can put a feature: in the side margins, in the header
  // band (narrow screens), or anywhere (home page, thumbnails)
  function region(L) {
    if (L.mode === "band") return { y0: 0, y1: L.band };
    return { y0: 0, y1: L.H };
  }

  function spot(L, rand, i) {
    if (L.mode === "margins") {
      var side = i % 2 ? L.right : L.left;
      return [lerp(side[0], side[1], 0.18 + rand() * 0.64), L.H * (0.1 + rand() * 0.8)];
    }
    if (L.mode === "band") return [L.W * (0.06 + rand() * 0.88), L.band * (0.12 + rand() * 0.76)];
    return [L.W * (0.06 + rand() * 0.88), L.H * (0.08 + rand() * 0.84)];
  }

  // centres for one or two "hero" features
  function anchors(L, ys) {
    if (L.mode === "margins") {
      return [[(L.left[0] + L.left[1]) / 2, L.H * ys[0]], [(L.right[0] + L.right[1]) / 2, L.H * ys[1]]];
    }
    if (L.mode === "band") return [[L.W * 0.84, L.band * 0.5]];
    return [[L.W / 2, L.H / 2]];
  }

  function featureSize(L, f, min, max) {
    if (L.mode === "margins") return clamp((L.left[1] - L.left[0]) * f, min, max);
    if (L.mode === "band") return clamp(L.band * f, min, max);
    return clamp(Math.min(L.W, L.H) * f, min, max * 1.6);
  }

  /* ------------------------------------------------------------------ */
  /* motifs                                                              */
  /* ------------------------------------------------------------------ */

  var MOTIFS = {};

  /* -- the morphing shape field (Home, About, Studies hub) --------------- */

  // Every shape is an outline of NP points spaced evenly along its edge,
  // centred, scaled to radius 1, clockwise and starting at the top, so any
  // two shapes can be blended point by point while you scroll.
  var NP = 40;

  function resample(raw) {
    var n = raw.length, segs = [], total = 0, i;
    for (i = 0; i < n; i++) {
      var a = raw[i], b = raw[(i + 1) % n];
      var d = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
      segs.push(d);
      total += d;
    }
    var pts = [], acc = 0, k = 0;
    for (i = 0; i < NP; i++) {
      var target = i * total / NP;
      while (k < n - 1 && acc + segs[k] < target) { acc += segs[k]; k++; }
      var f = segs[k] ? (target - acc) / segs[k] : 0, p = raw[k], q = raw[(k + 1) % n];
      pts.push([lerp(p[0], q[0], f), lerp(p[1], q[1], f)]);
    }
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = 0, area = 0;
    pts = pts.map(function (p) { return [p[0] - cx, p[1] - cy]; });
    pts.forEach(function (p, j) {
      r = Math.max(r, Math.sqrt(p[0] * p[0] + p[1] * p[1]));
      var q2 = pts[(j + 1) % NP];
      area += p[0] * q2[1] - q2[0] * p[1];
    });
    if (area < 0) pts.reverse();
    var start = 0, best = Infinity;
    pts.forEach(function (p, j) {
      var off = Math.abs(Math.atan2(p[1], p[0]) + Math.PI / 2);
      if (off < best) { best = off; start = j; }
    });
    var out = new Float64Array(NP * 2);
    for (i = 0; i < NP; i++) {
      var s = pts[(start + i) % NP];
      out[2 * i] = s[0] / r;
      out[2 * i + 1] = s[1] / r;
    }
    return out;
  }

  function ngon(n, r0, r1) {
    var pts = [], m = r1 ? n * 2 : n;
    for (var i = 0; i < m; i++) {
      var a = -Math.PI / 2 + i * TAU / m, r = r1 && i % 2 ? r1 : r0;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return pts;
  }

  function polar(fn, n) {
    var pts = [];
    for (var i = 0; i < (n || 64); i++) {
      var a = -Math.PI / 2 + i * TAU / (n || 64), r = fn(a);
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return pts;
  }

  // a closed band between two curves: along `top` left to right, back along `bottom`
  function band(top, bottom, x0, x1) {
    var pts = [], i, x;
    for (i = 0; i <= 40; i++) { x = lerp(x0, x1, i / 40); pts.push([x, top(x)]); }
    for (i = 40; i >= 0; i--) { x = lerp(x0, x1, i / 40); pts.push([x, bottom(x)]); }
    return pts;
  }

  function arcPts(cx, cy, r, a0, a1, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var a = lerp(a0, a1, i / n);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  var RECT = function (w, h) { return [[0, -h], [w, -h], [w, h], [-w, h], [-w, -h]]; };
  var A53 = Math.atan2(0.8, 0.6), A77 = Math.atan2(0.8, 0.18);

  // [outline, filled (1) or drawn as a line (0), size factor]
  var SHAPE_DEFS = {
    circle: [polar(function () { return 1; }), 1, 1],
    ring: [polar(function () { return 1; }), 0, 0.95],
    dot: [polar(function () { return 1; }), 1, 0.42],
    tri: [ngon(3, 1), 1, 1],
    square: [RECT(1, 1), 1, 0.85],
    tile: [RECT(1, 1), 1, 0.7],
    squareOutline: [RECT(1, 1), 0, 0.9],
    diamond: [ngon(4, 1), 1, 0.9],
    hexagon: [ngon(6, 1), 1, 0.85],
    star5: [ngon(5, 1, 0.45), 1, 0.8],
    sparkle: [ngon(4, 1, 0.3), 1, 0.85],
    plus: [[[-0.3, -1], [0.3, -1], [0.3, -0.3], [1, -0.3], [1, 0.3], [0.3, 0.3], [0.3, 1], [-0.3, 1], [-0.3, 0.3], [-1, 0.3], [-1, -0.3], [-0.3, -0.3]], 1, 0.9],
    semi: [arcPts(0, 0, 1, Math.PI, TAU, 32), 1, 1],
    wedge: [[[0, 0]].concat(arcPts(0, 0, 1, -Math.PI / 2, 0, 24)), 1, 0.95],
    bar: [RECT(0.28, 1), 1, 1.05],
    tallbar: [RECT(0.17, 1.3), 1, 1.15],
    packet: [RECT(1, 0.55), 1, 0.85],
    wave: [band(function (x) { return -0.18 + 0.3 * Math.sin(x * Math.PI * 1.5); }, function (x) { return 0.18 + 0.3 * Math.sin(x * Math.PI * 1.5); }, -1, 1), 1, 1.1],
    arch: [band(function (x) { return 0.45 - 1.1 * Math.cos(x * Math.PI / 2); }, function () { return 0.45; }, -1, 1), 1, 0.95],
    bell: [band(function (x) { return 0.5 - 1.3 * Math.exp(-x * x / 0.2); }, function () { return 0.5; }, -1.2, 1.2), 1, 1.05],
    dice: [polar(function (a) { return Math.pow(Math.pow(Math.abs(Math.cos(a)), 4) + Math.pow(Math.abs(Math.sin(a)), 4), -0.25); }), 1, 0.85],
    drop: [(function () { var p = []; for (var i = 0; i < 64; i++) { var t = i / 64 * TAU; p.push([0.85 * Math.sin(t) * Math.sin(t / 2), -Math.cos(t)]); } return p; })(), 1, 0.95],
    crescent: [arcPts(0, 0, 1, -A53, -TAU + A53, 40).concat(arcPts(0.42, 0, 0.82, -TAU + A77, -A77, 30)), 1, 0.95],
    blob: [polar(function (a) { return 1 + 0.16 * Math.sin(3 * a + 0.7) + 0.09 * Math.sin(5 * a + 2.1); }), 1, 1],
    butterfly: [polar(function (a) { var b = a + Math.PI / 2; return 0.55 + 0.4 * Math.pow(Math.abs(Math.sin(b)), 0.7) + 0.1 * Math.cos(4 * b); }), 1, 1.05],
    eye: [band(function (x) { return -0.55 * Math.pow(1 - x * x, 0.8); }, function (x) { return 0.55 * Math.pow(1 - x * x, 0.8); }, -1, 1), 1, 1.05],
    arrow: [[[-1, -0.16], [0.2, -0.16], [0.2, -0.6], [1, 0], [0.2, 0.6], [0.2, 0.16], [-1, 0.16]], 1, 1.05],
    parallelogram: [[[-0.55, -0.6], [1, -0.6], [0.55, 0.6], [-1, 0.6]], 1, 0.95],
    capsule: [arcPts(0.6, 0, 0.4, -Math.PI / 2, Math.PI / 2, 16).concat(arcPts(-0.6, 0, 0.4, Math.PI / 2, Math.PI * 1.5, 16)), 1, 1],
    chevron: [[[0.35, -1], [0.8, -0.65], [0.12, 0], [0.8, 0.65], [0.35, 1], [-0.6, 0]], 1, 0.9],
    stairs: [[[-1, 1], [-1, 0.33], [-0.33, 0.33], [-0.33, -0.33], [0.33, -0.33], [0.33, -1], [1, -1], [1, 1]], 1, 0.9]
  };

  var SHAPES = {};
  Object.keys(SHAPE_DEFS).forEach(function (k) {
    var d = SHAPE_DEFS[k];
    SHAPES[k] = { pts: resample(d[0]), fill: d[1], size: d[2] };
  });

  // Page scenes. Course scenes are added at start-up from the course colours
  // in geo.css, so each course keeps its own shapes everywhere.
  var PAPER = { bg: "#f5efe4", bgAlt: "#ece2cd", card: "#faf6ee", ink: "#221f1a", inkMuted: "#6b6255", rule: "#d9cdb4", accent: "#b0432c", accentInk: "#fbf3ea" };

  function sceneColors(over) {
    var out = {};
    Object.keys(PAPER).forEach(function (k) { out[k] = parseColor((over && over[k]) || PAPER[k]); });
    return out;
  }

  var SCENES = {
    paper: { colors: sceneColors(), palette: ["#b0432c", "#c9952e", "#2f4858", "#6f8a4d"], vocab: ["circle", "tri", "square", "semi", "plus"], size: 1 },
    linen: {
      colors: sceneColors({ bg: "#e8e7df", bgAlt: "#d9d8cc", card: "#f3f2ec", rule: "#cbc8b8" }),
      palette: ["#2f4858", "#5d86a3", "#b0432c", "#c9952e"], vocab: ["squareOutline", "plus", "ring", "diamond"], size: 0.95
    },
    sage: {
      colors: sceneColors({ bg: "#e6eadc", bgAlt: "#d6dcc6", card: "#f1f3e9", rule: "#c3cbaf" }),
      palette: ["#59713f", "#8fae6a", "#1f6874", "#c9952e"],
      vocab: ["wave", "hexagon", "arrow", "bell", "bar", "chevron", "blob", "packet", "sparkle"], size: 0.95
    },
    night: {
      dark: true, stars: 1, size: 0.5,
      colors: sceneColors({ bg: "#17161d", bgAlt: "#221f2b", card: "#1f1c27", ink: "#ece6d8", inkMuted: "#aaa3b5", rule: "#34303f", accent: "#e8925c", accentInk: "#17161d" }),
      palette: ["#f1e7d0", "#e8925c", "#b892ba", "#8fb3c7"], vocab: ["star5", "sparkle", "dot", "crescent"]
    }
  };

  var COURSE_SHAPES = {
    "abnormal-psychology": ["blob", "drop", "butterfly", "crescent"],
    "computer-communication": ["packet", "diamond", "ring", "dot"],
    "human-interface-media": ["circle", "eye", "sparkle"],
    "college-math": ["wave", "wedge", "semi"],
    "discrete-math": ["hexagon", "tri", "capsule"],
    "calculus": ["bar", "arch", "tallbar"],
    "linear-algebra": ["arrow", "parallelogram", "squareOutline"],
    "probability-statistics": ["bell", "dice", "dot"],
    "algorithms": ["chevron", "tile", "stairs"],
    "operating-systems": ["tile", "squareOutline", "capsule"],
    "signals-and-systems": ["wave", "bell", "tallbar"],
    "numerical-analysis": ["arch", "wedge", "dot"],
    "data-science": ["dot", "circle", "hexagon"]
  };

  function mixHex(a, b, f) {
    var x = parseColor(a), y = parseColor(b);
    return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(lerp(y[i], x[i], f)); }).join(",") + ")";
  }

  function addCourseScenes() {
    var probe = document.createElement("span");
    probe.hidden = true;
    body.appendChild(probe);
    Object.keys(COURSE_SHAPES).forEach(function (slug) {
      probe.setAttribute("data-course", slug);
      var cs = getComputedStyle(probe);
      var c = cs.getPropertyValue("--course").trim() || PAPER.accent;
      var c2 = cs.getPropertyValue("--course-2").trim() || "#c9952e";
      SCENES[slug] = {
        colors: sceneColors({ bg: mixHex(c, PAPER.bg, 0.08), bgAlt: mixHex(c, PAPER.bgAlt, 0.1), card: mixHex(c, PAPER.card, 0.04), rule: mixHex(c, PAPER.rule, 0.18), accent: c }),
        palette: slug === "human-interface-media" ? ["#00a9cc", "#d6398b", "#e9b81f", c] : [c, c2, "#2f4858", "#c9952e"],
        vocab: COURSE_SHAPES[slug], size: 1
      };
    });
    body.removeChild(probe);
    Object.keys(SCENES).forEach(function (k) { SCENES[k].rgb = SCENES[k].palette.map(parseColor); });
  }

  // How visible a shape at viewport (x, y) with radius r is: 1 in the clear,
  // low while it overlaps a text box (see `calm` in startBackground).
  function clearOfText(F, x, y, r) {
    var boxes = F.calm, yd = y + (F.scrollY || 0);
    if (!boxes || !boxes.length) return 1;
    for (var k = 0; k < boxes.length; k++) {
      var b = boxes[k];
      var dx = x < b[0] ? b[0] - x : x > b[2] ? x - b[2] : 0;
      var dy = yd < b[1] ? b[1] - yd : yd > b[3] ? yd - b[3] : 0;
      if (dx * dx + dy * dy < r * r) return 0.1;
    }
    return 1;
  }

  MOTIFS.confetti = {
    ambient: true,
    pointer: true,
    calm: true,
    setup: function (L, rand) {
      var n = clamp(Math.round(L.W * L.H / 26000), 14, 58), list = [], stars = [];
      for (var i = 0; i < n; i++) {
        list.push({
          x: rand() * L.W, y: rand() * (L.H + 240) - 120, z: 0.35 + rand() * 0.65,
          s: 14 + rand() * 42, slot: (rand() * 9973) | 0, r: rand() * TAU,
          spin: rand() - 0.5, c: (rand() * 4) | 0, ph: rand() * TAU, ox: 0, oy: 0, q: 1
        });
      }
      for (var j = 0; j < 110; j++) {
        stars.push({ x: rand() * L.W, y: rand() * L.H, r: 0.5 + rand() * 1.5, ph: rand() * TAU, sp: 0.5 + rand() * 2 });
      }
      return { list: list, stars: stars, buf: new Float64Array(NP * 2) };
    },
    draw: function (ctx, L, S, F) {
      var mix = F.mix || [{ s: SCENES.paper, w: 1 }], span = L.H + 240, buf = S.buf, i, m;
      var starW = 0, sceneSize = 0;
      mix.forEach(function (e) { starW += e.w * (e.s.stars || 0); sceneSize += e.w * (e.s.size || 1); });
      if (starW > 0.02) {
        var sc = [0, 0, 0];
        mix.forEach(function (e) { for (var q = 0; q < 3; q++) sc[q] += e.w * e.s.rgb[0][q]; });
        S.stars.forEach(function (st) {
          ctx.fillStyle = rgba(sc, starW * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(F.t * st.sp + st.ph))));
          circle(ctx, st.x, st.y, st.r);
          ctx.fill();
        });
      }
      ctx.lineJoin = "round";
      S.list.forEach(function (o) {
        var y = ((o.y - F.scroll * 0.35 * o.z) % span + span) % span - 120;
        var x = o.x + Math.sin(F.t * 0.25 * o.z + o.ph) * 10 * o.z;
        var tx = 0, ty = 0;
        if (F.ptr) {
          var dx = x - F.ptr[0], dy = y - F.ptr[1], d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180 && d > 0.1) {
            var push = (180 - d) / 180 * 52 * o.z;
            tx = dx / d * push;
            ty = dy / d * push;
          }
        }
        o.ox += (tx - o.ox) * 0.1;
        o.oy += (ty - o.oy) * 0.1;

        // blend this particle's shape, colour, size and fill across the scenes in view
        var col = [0, 0, 0], fill = 0, kSize = 0;
        for (i = 0; i < NP * 2; i++) buf[i] = 0;
        for (m = 0; m < mix.length; m++) {
          var e = mix[m], sh = SHAPES[e.s.vocab[o.slot % e.s.vocab.length]], rgb = e.s.rgb[o.c];
          for (i = 0; i < NP * 2; i++) buf[i] += e.w * sh.pts[i];
          col[0] += e.w * rgb[0]; col[1] += e.w * rgb[1]; col[2] += e.w * rgb[2];
          fill += e.w * sh.fill;
          kSize += e.w * sh.size;
        }
        var size = o.s * (0.55 + 0.45 * o.z) * sceneSize * kSize, r = size / 2;
        var want = clearOfText(F, x + o.ox, y + o.oy, r * 0.8);
        o.q = F.still ? want : o.q + (want - o.q) * 0.12;
        if (o.q < 0.02) return;
        ctx.save();
        ctx.translate(x + o.ox, y + o.oy);
        ctx.rotate(o.r + F.scroll * 0.004 * o.spin + F.t * 0.15 * o.spin);
        ctx.beginPath();
        ctx.moveTo(buf[0] * r, buf[1] * r);
        for (i = 1; i < NP; i++) ctx.lineTo(buf[2 * i] * r, buf[2 * i + 1] * r);
        ctx.closePath();
        if (fill > 0.02) {
          ctx.fillStyle = rgba(col, (0.32 + 0.4 * o.z) * fill * o.q);
          ctx.fill();
        }
        if (fill < 0.98) {
          ctx.strokeStyle = rgba(col, (0.5 + 0.4 * o.z) * (1 - fill) * o.q);
          ctx.lineWidth = Math.max(1.6, size * 0.12);
          ctx.stroke();
        }
        ctx.restore();
      });
    }
  };

  // Pensées: rose windows that turn as you read.
  MOTIFS.rose = {
    setup: function (L) {
      return { c: anchors(L, [0.38, 0.72]), R: featureSize(L, 0.62, 60, 230) };
    },
    draw: function (ctx, L, S, F) {
      S.c.forEach(function (c, k) {
        var R = S.R, i;
        ctx.save();
        ctx.translate(c[0], c[1]);
        ctx.rotate((k ? -1 : 1) * F.p * Math.PI * 0.8);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = rgba(F.pal.a, 0.55);
        circle(ctx, 0, 0, R); ctx.stroke();
        circle(ctx, 0, 0, R * 0.93); ctx.stroke();
        ctx.strokeStyle = rgba(F.pal.a, 0.4);
        for (i = 0; i < 12; i++) {
          var a = i / 12 * TAU;
          circle(ctx, Math.cos(a) * R * 0.46, Math.sin(a) * R * 0.46, R * 0.46);
          ctx.stroke();
        }
        ctx.strokeStyle = rgba(F.pal.b, 0.6);
        for (i = 0; i < 6; i++) {
          var b = i / 6 * TAU + Math.PI / 6;
          circle(ctx, Math.cos(b) * R * 0.23, Math.sin(b) * R * 0.23, R * 0.23);
          ctx.stroke();
        }
        ctx.strokeStyle = rgba(F.pal.c, 0.25);
        for (i = 0; i < 24; i++) {
          var s = i / 24 * TAU;
          line(ctx, Math.cos(s) * R * 0.93, Math.sin(s) * R * 0.93, Math.cos(s) * R, Math.sin(s) * R);
        }
        ctx.fillStyle = rgba(F.pal.b, 0.75);
        for (i = 0; i < 24; i++) {
          var d = (i + 0.5) / 24 * TAU;
          circle(ctx, Math.cos(d) * R * 0.965, Math.sin(d) * R * 0.965, Math.max(1.5, R * 0.016));
          ctx.fill();
        }
        ctx.fillStyle = rgba(F.pal.c, 0.45);
        circle(ctx, 0, 0, R * 0.07);
        ctx.fill();
        ctx.restore();
      });
    }
  };

  // Projects: drafting paper; the figures get drawn in as you scroll.
  MOTIFS.blueprint = {
    setup: function (L, rand) {
      var figs = [];
      for (var i = 0; i < 8; i++) {
        var p = spot(L, rand, i);
        figs.push({ x: p[0], y: p[1], w: 50 + rand() * 90, h: 34 + rand() * 70, kind: rand() < 0.5 ? "rect" : "circ", at: i / 8 });
      }
      return { figs: figs };
    },
    draw: function (ctx, L, S, F) {
      var R = region(L), off = (F.scroll * 0.25) % 120, x, y;
      ctx.lineWidth = 1;
      for (x = 0; x < L.W; x += 24) {
        ctx.strokeStyle = rgba(F.pal.c, x % 120 === 0 ? 0.16 : 0.07);
        line(ctx, x, R.y0, x, R.y1);
      }
      for (y = R.y0 - off; y < R.y1; y += 24) {
        ctx.strokeStyle = rgba(F.pal.c, Math.round(y + off) % 120 === 0 ? 0.16 : 0.07);
        line(ctx, 0, y, L.W, y);
      }
      S.figs.forEach(function (g) {
        var prog = clamp((F.p * 1.3 - g.at * 0.9) / 0.35, 0, 1);
        if (prog <= 0) return;
        ctx.strokeStyle = rgba(F.pal.c, 0.6);
        ctx.lineWidth = 1.4;
        var per = g.kind === "rect" ? 2 * (g.w + g.h) : TAU * g.h / 2;
        ctx.setLineDash([per, per]);
        ctx.lineDashOffset = per * (1 - prog);
        if (g.kind === "rect") {
          ctx.strokeRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
        } else {
          circle(ctx, g.x, g.y, g.h / 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        if (prog === 1) {
          ctx.strokeStyle = rgba(F.pal.a, 0.55);
          ctx.fillStyle = rgba(F.pal.a, 0.55);
          if (g.kind === "rect") {
            var yb = g.y + g.h / 2 + 12;
            line(ctx, g.x - g.w / 2, yb - 4, g.x - g.w / 2, yb + 4);
            line(ctx, g.x + g.w / 2, yb - 4, g.x + g.w / 2, yb + 4);
            line(ctx, g.x - g.w / 2, yb, g.x + g.w / 2, yb);
            label(ctx, String(Math.round(g.w)), g.x - 8, yb + 15, rgba(F.pal.a, 0.75), 10);
          } else {
            line(ctx, g.x - g.h / 2 - 6, g.y, g.x + g.h / 2 + 6, g.y);
            line(ctx, g.x, g.y - g.h / 2 - 6, g.x, g.y + g.h / 2 + 6);
            label(ctx, "Ø" + Math.round(g.h), g.x + g.h / 2 + 6, g.y - g.h / 2, rgba(F.pal.a, 0.75), 10);
          }
        }
      });
    }
  };

  /* -- course motifs -------------------------------------------------- */

  // 이상 심리학: a Rorschach card; the text column is the fold.
  MOTIFS["abnormal-psychology"] = {
    ambient: true,
    setup: function (L, rand) {
      var blobs = [], drops = [], half = L.W / 2, n = L.mode === "band" ? 4 : 6;
      var h = L.mode === "band" ? L.band : L.H;
      for (var i = 0; i < n; i++) {
        var cx;
        if (L.mode === "margins") cx = lerp(L.left[0], L.left[1], 0.2 + rand() * 0.75);
        else cx = half * (0.42 + rand() * 0.5);
        var harm = [];
        for (var k = 2; k <= 6; k++) harm.push({ k: k, a: rand() * 0.2 / Math.sqrt(k - 1), ph: rand() * TAU, w: (rand() - 0.5) * 8 });
        blobs.push({ cx: cx, cy: h * (0.1 + rand() * 0.8), r: Math.min(h * 0.11, 140) * (0.6 + rand() * 0.9), harm: harm });
      }
      for (var j = 0; j < 14; j++) {
        var b = blobs[j % n];
        drops.push({ x: b.cx + (rand() - 0.5) * b.r * 3, y: b.cy + (rand() - 0.5) * b.r * 3, r: 2 + rand() * 6 });
      }
      return { blobs: blobs, drops: drops };
    },
    draw: function (ctx, L, S, F) {
      function side() {
        S.blobs.forEach(function (b) {
          var pts = [];
          for (var j = 0; j < 56; j++) {
            var th = j / 56 * TAU, rr = 1;
            b.harm.forEach(function (h) { rr += h.a * Math.sin(h.k * th + h.ph + F.p * h.w + F.t * 0.04 * h.w); });
            pts.push([b.cx + b.r * rr * Math.cos(th), b.cy + b.r * rr * Math.sin(th) * 1.2]);
          }
          smoothClosed(ctx, pts);
          ctx.fillStyle = rgba(F.pal.a, 0.24);
          ctx.fill();
          ctx.strokeStyle = rgba(F.pal.a, 0.4);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });
        ctx.fillStyle = rgba(F.pal.b, 0.35);
        S.drops.forEach(function (d) { circle(ctx, d.x, d.y, d.r * (0.6 + 0.6 * F.p)); ctx.fill(); });
      }
      side();
      ctx.save();
      ctx.translate(L.W, 0);
      ctx.scale(-1, 1);
      side();
      ctx.restore();
    }
  };

  // 컴퓨터 통신: routers, links and packets in flight.
  MOTIFS["computer-communication"] = {
    ambient: true,
    setup: function (L, rand) {
      var area = L.W * (L.mode === "band" ? L.band : L.H);
      var n = clamp(Math.round(area / 24000), 10, 44), nodes = [], edges = [], seen = {};
      for (var i = 0; i < n; i++) {
        var p = spot(L, rand, i);
        nodes.push({ x: p[0], y: p[1], router: rand() < 0.4, ph: rand() * 40 });
      }
      nodes.forEach(function (a, i) {
        var near = nodes.map(function (b, j) { return [j, (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)]; })
          .sort(function (x, y) { return x[1] - y[1]; }).slice(1, 3);
        near.forEach(function (nb) {
          var key = Math.min(i, nb[0]) + "-" + Math.max(i, nb[0]);
          if (!seen[key]) { seen[key] = 1; edges.push({ a: i, b: nb[0], sp: 0.06 + rand() * 0.12, off: rand() }); }
        });
      });
      return { nodes: nodes, edges: edges };
    },
    draw: function (ctx, L, S, F) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(F.pal.a, 0.3);
      S.edges.forEach(function (e) {
        var a = S.nodes[e.a], b = S.nodes[e.b];
        line(ctx, a.x, a.y, b.x, b.y);
      });
      S.nodes.forEach(function (nd) {
        if (!nd.router) return;
        var r = (F.t * 18 + nd.ph) % 40;
        ctx.strokeStyle = rgba(F.pal.a, 0.35 * (1 - r / 40));
        circle(ctx, nd.x, nd.y, 6 + r);
        ctx.stroke();
      });
      ctx.fillStyle = rgba(F.pal.b, 0.85);
      S.edges.forEach(function (e, i) {
        var a = S.nodes[e.a], b = S.nodes[e.b], f = frac(F.t * e.sp + F.p * 2 + e.off);
        if (i % 2) f = 1 - f;
        ctx.fillRect(lerp(a.x, b.x, f) - 2.5, lerp(a.y, b.y, f) - 2.5, 5, 5);
      });
      S.nodes.forEach(function (nd) {
        if (nd.router) {
          ctx.fillStyle = rgba(F.pal.a, 0.75);
          ctx.fillRect(nd.x - 4.5, nd.y - 4.5, 9, 9);
        } else {
          ctx.fillStyle = rgba(F.pal.ink, 0.45);
          circle(ctx, nd.x, nd.y, 3.2);
          ctx.fill();
        }
      });
    }
  };

  // 휴먼 인터페이스 미디어: three colour discs converge as you scroll
  // (subtractive mixing), plus centre-surround receptive fields.
  MOTIFS["human-interface-media"] = {
    setup: function (L, rand) {
      var fields = [];
      for (var i = 0; i < 9; i++) fields.push(spot(L, rand, i));
      return { c: anchors(L, [0.32, 0.68]), R: featureSize(L, 0.3, 34, 110), fields: fields };
    },
    draw: function (ctx, L, S, F) {
      ctx.lineWidth = 1.2;
      S.fields.forEach(function (f) {
        ctx.fillStyle = rgba(F.pal.a, 0.35);
        circle(ctx, f[0], f[1], 5);
        ctx.fill();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = rgba(F.pal.b, 0.5);
        circle(ctx, f[0], f[1], 15);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(F.pal.a, 0.2);
        circle(ctx, f[0], f[1], 25);
        ctx.stroke();
      });
      var inks = [[0, 172, 205], [215, 60, 142], [244, 204, 46]];
      ctx.globalCompositeOperation = "multiply";
      S.c.forEach(function (c) {
        var d = S.R * (1.15 - 0.95 * F.p);
        inks.forEach(function (ink, i) {
          var a = -Math.PI / 2 + i * TAU / 3;
          ctx.fillStyle = rgba(ink, 0.62);
          circle(ctx, c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, S.R);
          ctx.fill();
        });
      });
      ctx.globalCompositeOperation = "source-over";
    }
  };

  // 대학수학: the unit circle unrolls into a sine wave.
  MOTIFS["college-math"] = {
    setup: function (L) {
      var c = anchors(L, [0.5, 0.5])[0];
      return { O: c, R: featureSize(L, 0.3, 30, 105), dir: L.mode === "band" ? -1 : 1 };
    },
    draw: function (ctx, L, S, F) {
      var Rg = region(L), O = S.O, R = S.R, x, y;
      ctx.lineWidth = 1;
      for (x = O[0] % 40; x < L.W; x += 40) { ctx.strokeStyle = rgba(F.pal.ink, 0.05); line(ctx, x, Rg.y0, x, Rg.y1); }
      for (y = O[1] % 40; y < Rg.y1; y += 40) { ctx.strokeStyle = rgba(F.pal.ink, 0.05); line(ctx, 0, y, L.W, y); }
      ctx.strokeStyle = rgba(F.pal.ink, 0.22);
      line(ctx, 0, O[1], L.W, O[1]);
      line(ctx, O[0], Rg.y0, O[0], Rg.y1);
      var th = F.p * TAU * 1.25 + 0.7;
      var P = [O[0] + R * Math.cos(th), O[1] - R * Math.sin(th)];
      ctx.strokeStyle = rgba(F.pal.a, 0.7);
      ctx.lineWidth = 1.6;
      circle(ctx, O[0], O[1], R);
      ctx.stroke();
      // the wave starts where the circle ends and runs away from it
      var x0 = O[0] + S.dir * (R + 26);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = rgba(F.pal.b, 0.55);
      line(ctx, P[0], P[1], x0, P[1]);
      line(ctx, P[0], P[1], P[0], O[1]);
      ctx.setLineDash([]);
      ctx.beginPath();
      for (var i = 0; i < 2000; i += 3) {
        x = x0 + S.dir * i;
        if (x < -10 || x > L.W + 10) break;
        y = O[1] - R * Math.sin(th - i / R);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = rgba(F.pal.a, 0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = rgba(F.pal.b, 0.9);
      line(ctx, O[0], O[1], P[0], P[1]);
      ctx.fillStyle = rgba(F.pal.b, 0.95);
      circle(ctx, P[0], P[1], 4);
      ctx.fill();
      label(ctx, "θ = " + (th % TAU).toFixed(2), O[0] - R, O[1] + R + 18, rgba(F.pal.ink, 0.5));
    }
  };

  // 이산수학: a spanning tree connects the dots (Kruskal order).
  MOTIFS["discrete-math"] = {
    setup: function (L, rand) {
      var g = L.mode === "thumb" ? 40 : 54, Rg = region(L);
      var cols = Math.ceil(L.W / g) + 1, rows = Math.ceil((Rg.y1 - Rg.y0) / g) + 1;
      var pts = [], edges = [], parent = [], tree = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          pts.push([c * g + (rand() - 0.5) * 14 + g / 3, Rg.y0 + r * g + (rand() - 0.5) * 14 + g / 3]);
          parent.push(pts.length - 1);
          var id = r * cols + c;
          if (c > 0) edges.push([id - 1, id, rand()]);
          if (r > 0) edges.push([id - cols, id, rand()]);
          if (r > 0 && c > 0 && rand() < 0.3) edges.push([id - cols - 1, id, rand() + 0.2]);
        }
      }
      function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
      edges.sort(function (a, b) { return a[2] - b[2]; }).forEach(function (e) {
        var a = find(e[0]), b = find(e[1]);
        if (a !== b) { parent[a] = b; tree.push(e); }
      });
      return { pts: pts, tree: tree };
    },
    draw: function (ctx, L, S, F) {
      var k = Math.round(lerp(4, S.tree.length, F.p));
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = rgba(F.pal.a, 0.5);
      for (var i = 0; i < k - 6; i++) {
        var e = S.tree[i];
        line(ctx, S.pts[e[0]][0], S.pts[e[0]][1], S.pts[e[1]][0], S.pts[e[1]][1]);
      }
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = rgba(F.pal.b, 0.9);
      for (var j = Math.max(0, k - 6); j < k; j++) {
        var f = S.tree[j];
        line(ctx, S.pts[f[0]][0], S.pts[f[0]][1], S.pts[f[1]][0], S.pts[f[1]][1]);
      }
      ctx.fillStyle = rgba(F.pal.ink, 0.3);
      S.pts.forEach(function (p) { circle(ctx, p[0], p[1], 2.2); ctx.fill(); });
      if (k > 0) {
        var last = S.tree[k - 1];
        ctx.fillStyle = rgba(F.pal.b, 1);
        circle(ctx, S.pts[last[1]][0], S.pts[last[1]][1], 4.5);
        ctx.fill();
      }
    }
  };

  // 미분적분학: a Riemann sum gets finer as you scroll; a tangent slides along.
  MOTIFS.calculus = {
    draw: function (ctx, L, S, F) {
      var Rg = region(L), h = Rg.y1 - Rg.y0, yb = Rg.y0 + h * 0.92;
      function f(x) {
        return Rg.y0 + h * (0.5 - 0.17 * Math.sin(x / L.W * TAU * 1.1 + 0.6) - 0.07 * Math.sin(x / L.W * TAU * 3.2 + 1.3));
      }
      var n = Math.round(lerp(5, 72, F.p)), w = L.W / n;
      ctx.lineWidth = 1;
      for (var i = 0; i < n; i++) {
        var y = f((i + 0.5) * w);
        ctx.fillStyle = rgba(F.pal.a, 0.11);
        ctx.fillRect(i * w, y, w, yb - y);
        ctx.strokeStyle = rgba(F.pal.a, 0.3);
        ctx.strokeRect(i * w, y, w, yb - y);
      }
      ctx.beginPath();
      for (var x = 0; x <= L.W; x += 5) { if (x === 0) ctx.moveTo(x, f(x)); else ctx.lineTo(x, f(x)); }
      ctx.strokeStyle = rgba(F.pal.ink, 0.55);
      ctx.lineWidth = 2;
      ctx.stroke();
      var xt = L.W * (0.05 + 0.9 * F.p), slope = (f(xt + 1) - f(xt - 1)) / 2, len = Math.min(160, L.W * 0.12);
      ctx.strokeStyle = rgba(F.pal.b, 0.95);
      line(ctx, xt - len, f(xt) - slope * len, xt + len, f(xt) + slope * len);
      ctx.fillStyle = rgba(F.pal.b, 1);
      circle(ctx, xt, f(xt), 4.5);
      ctx.fill();
      label(ctx, "n = " + n, 14, yb + 16, rgba(F.pal.ink, 0.5));
    }
  };

  // 선형대수학: the plane shears and turns as you scroll.
  MOTIFS["linear-algebra"] = {
    setup: function (L) {
      var O = L.mode === "margins" ? [(L.left[0] + L.left[1]) * 0.45, L.H * 0.62] :
        L.mode === "band" ? [L.W * 0.82, L.band * 0.62] : [L.W * 0.42, L.H * 0.62];
      return { O: O, s: L.mode === "thumb" ? 34 : 46 };
    },
    draw: function (ctx, L, S, F) {
      var O = S.O, s = S.s, ph = F.p * 0.55, sh = F.p * 0.9, sc = 1 + 0.3 * F.p;
      var c = Math.cos(ph), sn = Math.sin(ph);
      // A = R(ph) [[1, sh], [0, sc]]; screen y points down
      var u = [c, -sn], v = [c * sh - sn * sc, -(sn * sh + c * sc)];
      var Rg = region(L), N = Math.ceil(Math.max(L.W, Rg.y1) / s) + 4, far = N * s * 2, i;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(F.pal.ink, 0.07);
      for (i = -N; i <= N; i++) {
        line(ctx, O[0] + i * s, Rg.y0, O[0] + i * s, Rg.y1);
        line(ctx, 0, O[1] + i * s, L.W, O[1] + i * s);
      }
      ctx.strokeStyle = rgba(F.pal.a, 0.34);
      ctx.lineWidth = 1.2;
      for (i = -N; i <= N; i++) {
        line(ctx, O[0] + i * s * v[0] - far * u[0], O[1] + i * s * v[1] - far * u[1], O[0] + i * s * v[0] + far * u[0], O[1] + i * s * v[1] + far * u[1]);
        line(ctx, O[0] + i * s * u[0] - far * v[0], O[1] + i * s * u[1] - far * v[1], O[0] + i * s * u[0] + far * v[0], O[1] + i * s * u[1] + far * v[1]);
      }
      ctx.beginPath();
      ctx.moveTo(O[0], O[1]);
      ctx.lineTo(O[0] + s * u[0], O[1] + s * u[1]);
      ctx.lineTo(O[0] + s * (u[0] + v[0]), O[1] + s * (u[1] + v[1]));
      ctx.lineTo(O[0] + s * v[0], O[1] + s * v[1]);
      ctx.closePath();
      ctx.fillStyle = rgba(F.pal.d, 0.22);
      ctx.fill();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = ctx.fillStyle = rgba(F.pal.b, 0.95);
      arrow(ctx, O[0], O[1], O[0] + 2 * s * u[0], O[1] + 2 * s * u[1], 9);
      ctx.strokeStyle = ctx.fillStyle = rgba(F.pal.a, 0.95);
      arrow(ctx, O[0], O[1], O[0] + 2 * s * v[0], O[1] + 2 * s * v[1], 9);
      label(ctx, "det = " + sc.toFixed(2), O[0] + 10, O[1] + 20, rgba(F.pal.ink, 0.55));
    }
  };

  // 확률과 통계: a Galton board fills up into a bell curve as you scroll.
  MOTIFS["probability-statistics"] = {
    ambient: true,
    setup: function (L, rand) {
      var rows = 9, boards = [], N = 280, paths = [];
      var bw = L.mode === "margins" ? clamp((L.left[1] - L.left[0]) * 0.78, 120, 300) :
        L.mode === "band" ? Math.min(260, L.W * 0.36) : L.W * 0.62;
      var Rg = region(L), top = Rg.y0 + (Rg.y1 - Rg.y0) * (L.mode === "margins" ? 0.12 : 0.08);
      var bottom = Rg.y0 + (Rg.y1 - Rg.y0) * (L.mode === "margins" ? 0.88 : 0.94);
      anchors(L, [0.5, 0.5]).forEach(function (c) { boards.push({ cx: c[0], top: top, bottom: bottom, bw: bw }); });
      for (var i = 0; i < N; i++) {
        var bits = [];
        for (var r = 0; r < rows; r++) bits.push(rand() < 0.5 ? 1 : 0);
        paths.push(bits);
      }
      return { rows: rows, boards: boards, paths: paths };
    },
    draw: function (ctx, L, S, F) {
      var rows = S.rows, N = S.paths.length, k = Math.floor(F.p * N);
      S.boards.forEach(function (b, bi) {
        var dx = b.bw / (rows + 1), pegH = (b.bottom - b.top) * 0.45, dy = pegH / rows;
        var binTop = b.top + pegH + dy, avail = b.bottom - binTop, unit = avail / (N * 0.27);
        var counts = [], i, r, j;
        for (i = 0; i <= rows; i++) counts.push(0);
        for (i = 0; i < k; i++) {
          var path = S.paths[(i + bi * 97) % N], sum = 0;
          for (r = 0; r < rows; r++) sum += path[r];
          counts[sum]++;
        }
        ctx.fillStyle = rgba(F.pal.ink, 0.35);
        for (r = 0; r < rows; r++) {
          for (j = 0; j <= r; j++) { circle(ctx, b.cx + (j - r / 2) * dx, b.top + (r + 1) * dy, 1.8); ctx.fill(); }
        }
        ctx.strokeStyle = rgba(F.pal.ink, 0.15);
        ctx.lineWidth = 1;
        for (j = 0; j <= rows + 1; j++) line(ctx, b.cx + (j - (rows + 1) / 2) * dx, binTop, b.cx + (j - (rows + 1) / 2) * dx, b.bottom);
        line(ctx, b.cx - (rows + 1) / 2 * dx, b.bottom, b.cx + (rows + 1) / 2 * dx, b.bottom);
        ctx.fillStyle = rgba(F.pal.a, 0.55);
        counts.forEach(function (n, j2) {
          var hgt = Math.min(avail, n * unit);
          ctx.fillRect(b.cx + (j2 - rows / 2) * dx - dx * 0.36, b.bottom - hgt, dx * 0.72, hgt);
        });
        if (k > 8) {
          var sd = Math.sqrt(rows) / 2;
          ctx.beginPath();
          for (var x = -rows / 2 - 0.5; x <= rows / 2 + 0.5; x += 0.1) {
            var z = x / sd, pdf = Math.exp(-z * z / 2) / (sd * Math.sqrt(TAU));
            var px = b.cx + x * dx, py = b.bottom - Math.min(avail, k * pdf * unit);
            if (x === -rows / 2 - 0.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = rgba(F.pal.b, 0.85);
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        // three balls in flight
        ctx.fillStyle = rgba(F.pal.b, 0.95);
        for (var m = 0; m < 3; m++) {
          var ph = frac(F.t * 0.3 + m / 3 + bi * 0.17), pos = ph * (rows + 1), row = Math.floor(pos);
          var bitsF = S.paths[(k + m * 13 + bi * 7) % N], right = 0;
          for (r = 0; r < Math.min(row, rows); r++) right += bitsF[r];
          var nextRight = right + (row < rows ? bitsF[row] : 0);
          var xr = lerp(right - row / 2, nextRight - (row + 1) / 2, frac(pos));
          circle(ctx, b.cx + xr * dx, b.top + pos * dy, 3.2);
          ctx.fill();
        }
      });
    }
  };

  // 운영체제: a round-robin Gantt chart fills in as you scroll.
  MOTIFS["operating-systems"] = {
    setup: function () {
      // 다섯 프로세스 (도착, 서비스 시간), 시간 할당량 1인 라운드 로빈
      var P = [[0, 3], [2, 6], [4, 4], [6, 5], [8, 2]], left = P.map(function (x) { return x[1]; });
      var queue = [], slots = [], t = 0, next = 0, cur = -1, done = 0;
      while (done < P.length) {
        while (next < P.length && P[next][0] <= t) queue.push(next++);
        if (cur >= 0 && left[cur] > 0) queue.push(cur);
        cur = queue.length ? queue.shift() : -1;
        slots.push(cur);
        if (cur >= 0 && --left[cur] === 0) { done++; cur = -1; }
        t++;
      }
      return { P: P, slots: slots };
    },
    draw: function (ctx, L, S, F) {
      var Rg = region(L), h = Rg.y1 - Rg.y0, n = S.slots.length, rows = S.P.length;
      var x0 = L.W * 0.06, x1 = L.W * 0.94, w = (x1 - x0) / n, rh = h * 0.62 / rows, y0 = Rg.y0 + h * 0.16;
      var shown = Math.round(F.p * n), i, r;
      ctx.lineWidth = 1;
      for (r = 0; r < rows; r++) {
        ctx.strokeStyle = rgba(F.pal.ink, 0.08);
        line(ctx, x0, y0 + (r + 1) * rh, x1, y0 + (r + 1) * rh);
        ctx.fillStyle = rgba(F.pal.a, 0.12);
        ctx.fillRect(x0 + S.P[r][0] * w, y0 + r * rh + rh * 0.42, 3, rh * 0.16);
      }
      for (i = 0; i < shown; i++) {
        r = S.slots[i];
        if (r < 0) continue;
        var hot = i === shown - 1;
        ctx.fillStyle = hot ? rgba(F.pal.b, 0.95) : rgba(F.pal.a, 0.42);
        ctx.fillRect(x0 + i * w + 1, y0 + r * rh + rh * 0.18, w - 2, rh * 0.64);
      }
      var xt = x0 + shown * w;
      ctx.strokeStyle = rgba(F.pal.b, 0.8);
      ctx.lineWidth = 1.5;
      line(ctx, xt, y0 - 8, xt, y0 + rows * rh + 8);
      for (r = 0; r < rows; r++) label(ctx, "ABCDE"[r], x0 - 14, y0 + r * rh + rh * 0.62, rgba(F.pal.ink, 0.5));
      label(ctx, "t = " + shown, x0, y0 + rows * rh + 22, rgba(F.pal.ink, 0.5));
    }
  };

  // 신호 및 시스템: harmonics add up into a square wave as you scroll.
  MOTIFS["signals-and-systems"] = {
    draw: function (ctx, L, S, F) {
      var Rg = region(L), h = Rg.y1 - Rg.y0, ym = Rg.y0 + h * 0.5, A = h * 0.22;
      var N = Math.round(lerp(1, 31, F.p)), cyc = 2.5, k, x;
      function harm(k, x) { return 4 / (Math.PI * k) * Math.sin(k * x / L.W * TAU * cyc); }
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(F.pal.ink, 0.08);
      line(ctx, 0, ym, L.W, ym);
      for (k = 1; k <= Math.min(N, 9); k += 2) {
        ctx.beginPath();
        for (x = 0; x <= L.W; x += 4) {
          var yk = ym - A * harm(k, x) * 0.55;
          if (x === 0) ctx.moveTo(x, yk); else ctx.lineTo(x, yk);
        }
        ctx.strokeStyle = rgba(F.pal.a, 0.12 + 0.18 / k);
        ctx.stroke();
      }
      ctx.beginPath();
      for (x = 0; x <= L.W; x += 2) {
        var sum = 0;
        for (k = 1; k <= N; k += 2) sum += harm(k, x);
        var y = ym - A * sum;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = rgba(F.pal.b, 0.9);
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.strokeStyle = rgba(F.pal.ink, 0.25);
      ctx.lineWidth = 1;
      var half = L.W / (2 * cyc);
      for (var c = 0; c * half < L.W; c++) {
        var yy = ym - (c % 2 === 0 ? A : -A);
        line(ctx, c * half, yy, (c + 1) * half, yy);
      }
      label(ctx, "N = " + N, 14, Rg.y0 + h * 0.92, rgba(F.pal.ink, 0.5));
    }
  };

  // 수치해석: Newton's method walks down tangents to the root as you scroll.
  MOTIFS["numerical-analysis"] = {
    draw: function (ctx, L, S, F) {
      var Rg = region(L), h = Rg.y1 - Rg.y0;
      var xmin = -0.6, xmax = 2.9, ymin = -3.2, ymax = 10;
      function f(x) { return x * x * x - 2 * x - 1.2; }
      function df(x) { return 3 * x * x - 2; }
      function X(x) { return (x - xmin) / (xmax - xmin) * L.W; }
      function Y(y) { return Rg.y1 - (y - ymin) / (ymax - ymin) * h; }
      var x, i;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(F.pal.ink, 0.15);
      line(ctx, 0, Y(0), L.W, Y(0));
      ctx.beginPath();
      for (i = 0; i <= 200; i++) {
        x = xmin + (xmax - xmin) * i / 200;
        if (i === 0) ctx.moveTo(X(x), Y(f(x))); else ctx.lineTo(X(x), Y(f(x)));
      }
      ctx.strokeStyle = rgba(F.pal.a, 0.85);
      ctx.lineWidth = 2.2;
      ctx.stroke();
      var steps = F.p * 5, xn = 2.5, k;
      for (k = 0; k < 5 && k < steps; k++) {
        var part = Math.min(1, steps - k), yn = f(xn), xn1 = xn - yn / df(xn);
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(F.pal.ink, 0.3);
        line(ctx, X(xn), Y(0), X(xn), Y(yn));
        ctx.strokeStyle = rgba(F.pal.b, 0.9);
        ctx.lineWidth = 1.6;
        line(ctx, X(xn), Y(yn), X(lerp(xn, xn1, part)), Y(lerp(yn, 0, part)));
        ctx.fillStyle = rgba(F.pal.b, 0.95);
        ctx.beginPath(); ctx.arc(X(xn), Y(yn), 3.2, 0, TAU); ctx.fill();
        if (part < 1) break;
        xn = xn1;
      }
      ctx.fillStyle = rgba(F.pal.b, 0.95);
      ctx.beginPath(); ctx.arc(X(xn), Y(0), 3.6, 0, TAU); ctx.fill();
      label(ctx, "x = " + xn.toFixed(4), 14, Rg.y0 + h * 0.12, rgba(F.pal.ink, 0.5));
    }
  };

  // 데이터 과학: k-means moves three centers to their clusters as you scroll.
  MOTIFS["data-science"] = {
    setup: function (L, rand) {
      var pts = [], c, i, cs = [[0.22, 0.35], [0.55, 0.7], [0.82, 0.32]];
      for (c = 0; c < 3; c++) for (i = 0; i < 26; i++) {
        var r = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * 0.07, t = rand() * TAU;
        pts.push([cs[c][0] + r * Math.cos(t), cs[c][1] + r * Math.sin(t) * 1.2]);
      }
      var cen = [[0.45, 0.2], [0.5, 0.28], [0.58, 0.22]], hist = [], it, j;
      function assign(cn) {
        return pts.map(function (p) {
          var best = 0, bd = 1e9;
          cn.forEach(function (q, k) { var d = (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]); if (d < bd) { bd = d; best = k; } });
          return best;
        });
      }
      for (it = 0; it < 8; it++) {
        var lab = assign(cen);
        hist.push({ cen: cen.map(function (q) { return q.slice(); }), lab: lab });
        cen = cen.map(function (q, k) {
          var sx = 0, sy = 0, n = 0;
          for (j = 0; j < pts.length; j++) if (lab[j] === k) { sx += pts[j][0]; sy += pts[j][1]; n++; }
          return n ? [sx / n, sy / n] : q;
        });
      }
      return { pts: pts, hist: hist };
    },
    draw: function (ctx, L, S, F) {
      var Rg = region(L), h = Rg.y1 - Rg.y0;
      var t = F.p * (S.hist.length - 1), a = Math.floor(t), b = Math.min(a + 1, S.hist.length - 1), u = t - a;
      var lab = S.hist[a].lab, cols = [F.pal.a, F.pal.b, F.pal.ink];
      function P(p) { return [p[0] * L.W, Rg.y0 + p[1] * h]; }
      S.pts.forEach(function (p, i) {
        var q = P(p);
        ctx.fillStyle = rgba(cols[lab[i]], 0.55);
        ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, TAU); ctx.fill();
      });
      S.hist[a].cen.forEach(function (c, k) {
        var d = S.hist[b].cen[k], q = P([lerp(c[0], d[0], u), lerp(c[1], d[1], u)]);
        ctx.strokeStyle = rgba(cols[k], 0.95);
        ctx.lineWidth = 2;
        line(ctx, q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7);
        line(ctx, q[0] - 7, q[1] + 7, q[0] + 7, q[1] - 7);
      });
      label(ctx, "iter " + a, 14, Rg.y0 + h * 0.95, rgba(F.pal.ink, 0.5));
    }
  };

  // 알고리즘: insertion sort (and selection sort on the right) run as you scroll.
  MOTIFS.algorithms = {
    setup: function (L, rand) {
      var n = 22, vals = [], i, j;
      for (i = 1; i <= n; i++) vals.push(i);
      for (i = n - 1; i > 0; i--) { j = (rand() * (i + 1)) | 0; var t = vals[i]; vals[i] = vals[j]; vals[j] = t; }
      function insertion(a) {
        a = a.slice();
        var steps = [{ arr: a.slice(), hi: [] }];
        for (var x = 1; x < a.length; x++) {
          for (var y = x; y > 0 && a[y - 1] > a[y]; y--) {
            var tmp = a[y]; a[y] = a[y - 1]; a[y - 1] = tmp;
            steps.push({ arr: a.slice(), hi: [y - 1, y] });
          }
        }
        steps.push({ arr: a.slice(), hi: [] });
        return steps;
      }
      function selection(a) {
        a = a.slice();
        var steps = [{ arr: a.slice(), hi: [] }];
        for (var x = 0; x < a.length - 1; x++) {
          var min = x;
          for (var y = x + 1; y < a.length; y++) if (a[y] < a[min]) min = y;
          var tmp = a[x]; a[x] = a[min]; a[min] = tmp;
          steps.push({ arr: a.slice(), hi: [x, min] });
        }
        steps.push({ arr: a.slice(), hi: [] });
        return steps;
      }
      return { n: n, ins: insertion(vals), sel: selection(vals) };
    },
    draw: function (ctx, L, S, F) {
      function state(steps) { return steps[Math.round(F.p * (steps.length - 1))]; }
      function horizontal(st, x0, x1, alignRight) {
        var th = L.H * 0.78 / S.n, y0 = L.H * 0.11, len = x1 - x0 - 24;
        st.arr.forEach(function (v, i) {
          var w = v / S.n * len, hot = st.hi.indexOf(i) >= 0;
          ctx.fillStyle = hot ? rgba(F.pal.b, 0.95) : rgba(F.pal.a, 0.45);
          ctx.fillRect(alignRight ? x1 - 12 - w : x0 + 12, y0 + i * th, w, th * 0.62);
        });
      }
      function vertical(st, top, bottom) {
        var w = L.W / S.n;
        st.arr.forEach(function (v, i) {
          var h = v / S.n * (bottom - top), hot = st.hi.indexOf(i) >= 0;
          ctx.fillStyle = hot ? rgba(F.pal.b, 0.95) : rgba(F.pal.a, 0.42);
          ctx.fillRect(i * w + w * 0.18, bottom - h, w * 0.64, h);
        });
      }
      var ins = state(S.ins);
      if (L.mode === "margins") {
        horizontal(ins, L.left[0], L.left[1], false);
        horizontal(state(S.sel), L.right[0], L.right[1], true);
        label(ctx, "insertion sort", L.left[0] + 12, L.H * 0.11 - 10, rgba(F.pal.ink, 0.5));
        label(ctx, "selection sort", L.right[1] - 110, L.H * 0.11 - 10, rgba(F.pal.ink, 0.5));
      } else if (L.mode === "band") {
        vertical(ins, L.band * 0.55, L.band * 0.96);
      } else {
        vertical(ins, L.H * 0.12, L.H * 0.94);
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* page background                                                     */
  /* ------------------------------------------------------------------ */

  function luminance(c) {
    var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }

  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  function smooth(f) {
    f = clamp(f, 0, 1);
    return f * f * (3 - 2 * f);
  }

  function startBackground(canvas, theme) {
    var ctx = canvas.getContext("2d");
    var motif = MOTIFS[theme] || MOTIFS.confetti;
    var masked = canvas.classList.contains("geo-canvas--masked");
    var bandEl = document.querySelector("[data-geo-band]");
    var dpr = 1, W = 0, H = 0, L = null, S = null, raf = 0, ptr = null, t0 = performance.now();
    var pal = readPalette(body);

    // Scenes: sections marked data-scene="…" blend into each other in
    // proportion to how far you've scrolled, so colours and shapes morph
    // continuously instead of switching at a threshold.
    var sceneEls = [].slice.call(document.querySelectorAll("[data-scene]"));
    var segs = [], hoverName = null, hoverScene = null, hoverW = 0;

    // Text the shapes should not cross: motifs with `calm` fade a shape while
    // it overlaps the box of any element that holds text (document
    // coordinates, padded). Fixed layers (robot, overlays) are skipped.
    var SKIP = ".robot, .search-overlay, .note-toc, script, style, noscript, svg";
    var calm = [], calmLive = [];

    function measure() {
      if (motif.calm) {
        var y0 = window.scrollY, pad = 6, seen = new Set(), walk, n, el, r;
        // text inside sticky/fixed boxes moves with the viewport: re-read it per frame
        var pinned = [].filter.call(body.querySelectorAll("*"), function (e) {
          var pos = getComputedStyle(e).position;
          return (pos === "sticky" || pos === "fixed") && !e.closest(SKIP);
        });
        calm = [];
        calmLive = [];
        walk = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (t) { return t.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }
        });
        for (n = walk.nextNode(); n; n = walk.nextNode()) {
          el = n.parentElement;
          if (!el || seen.has(el)) continue;
          seen.add(el);
          if (el.closest(SKIP)) continue;
          if (pinned.some(function (box) { return box.contains(el); })) { calmLive.push(el); continue; }
          r = el.getBoundingClientRect();
          if (r.width && r.height) calm.push([r.left - pad, r.top + y0 - pad, r.right + pad, r.bottom + y0 + pad]);
        }
      }
      segs = sceneEls.map(function (el) {
        var r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, s: SCENES[el.getAttribute("data-scene")] };
      }).filter(function (g) { return g.s; }).sort(function (a, b) { return a.top - b.top; });
      if (segs.length && segs[0].top > H * 0.5) segs.unshift({ top: 0, bottom: segs[0].top, s: SCENES.paper });
    }

    function calmBoxes(y0) {
      if (!calmLive.length) return calm;
      return calm.concat(calmLive.map(function (el) {
        var r = el.getBoundingClientRect();
        return [r.left - 6, r.top + y0 - 6, r.right + 6, r.bottom + y0 + 6];
      }));
    }

    function scrollMix() {
      if (!segs.length) return [{ s: SCENES.paper, w: 1 }];
      var y = window.scrollY + H * 0.5;
      for (var k = 0; k < segs.length - 1; k++) {
        var A = segs[k], B = segs[k + 1], b = (A.bottom + B.top) / 2;
        var T = clamp(Math.min(A.bottom - A.top, B.bottom - B.top) / 2, 60, H * 0.4);
        if (y < b - T) return [{ s: A.s, w: 1 }];
        if (y <= b + T) {
          var w = smooth((y - (b - T)) / (2 * T));
          return [{ s: A.s, w: 1 - w }, { s: B.s, w: w }];
        }
      }
      return [{ s: segs[segs.length - 1].s, w: 1 }];
    }

    function currentMix() {
      var mix = scrollMix();
      if (hoverScene && hoverW > 0.001) {
        mix = mix.map(function (e) { return { s: e.s, w: e.w * (1 - hoverW) }; });
        mix.push({ s: hoverScene, w: hoverW });
      }
      return mix;
    }

    var KEYS = [["bg", "--bg"], ["bgAlt", "--bg-alt"], ["card", "--card"], ["rule", "--rule"]];
    var TEXT = [["ink", "--ink"], ["inkMuted", "--ink-muted"], ["accent", "--accent"], ["accentInk", "--accent-ink"]];

    // Page colours follow the scenes too. Where a light and a dark scene
    // meet, the ground flips over a shorter stretch than the shapes do, and
    // the text jumps to whichever set has more contrast (a crossfade would
    // put mid-grey text on a mid-grey ground).
    function paint(mix) {
      var dark = 0;
      mix.forEach(function (e) { if (e.s.dark) dark += e.w; });
      var mixed = dark > 0 && dark < 1;
      var dGround = mixed ? smooth((dark - 0.35) / 0.3) : dark;
      function avg(key, darkSide) {
        var c = [0, 0, 0], tw = 0;
        mix.forEach(function (e) {
          if (!!e.s.dark !== darkSide) return;
          var v = e.s.colors[key];
          c[0] += e.w * v[0]; c[1] += e.w * v[1]; c[2] += e.w * v[2];
          tw += e.w;
        });
        return tw ? [c[0] / tw, c[1] / tw, c[2] / tw] : null;
      }
      function blend(key, d) {
        var l = avg(key, false), k = avg(key, true);
        if (!k) return l;
        if (!l) return k;
        return [lerp(l[0], k[0], d), lerp(l[1], k[1], d), lerp(l[2], k[2], d)];
      }
      function css(c) { return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")"; }
      KEYS.forEach(function (k) { body.style.setProperty(k[1], css(blend(k[0], dGround))); });
      // text takes whichever set reads better on the current ground
      var dText = dark;
      if (mixed) {
        var ground = blend("bg", dGround), inkL = avg("ink", false), inkD = avg("ink", true);
        dText = contrast(ground, inkD) > contrast(ground, inkL) ? 1 : 0;
      }
      TEXT.forEach(function (k) { body.style.setProperty(k[1], css(blend(k[0], dText))); });
      var tone = dGround > 0.5 ? "dark" : "light";
      if (body.getAttribute("data-tone") !== tone) body.setAttribute("data-tone", tone);
    }

    function clearPx() {
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return (parseFloat(getComputedStyle(canvas).getPropertyValue("--geo-clear")) || 0) * rem;
    }

    function layout() {
      var bandDoc = bandEl ? bandEl.getBoundingClientRect().bottom + window.scrollY : 0;
      var L2 = { W: W, H: H, band: Math.max(bandDoc, 240), clear: 0, mode: "full" };
      if (masked) {
        L2.clear = clearPx();
        var mw = W / 2 - L2.clear - 16;
        if (mw >= 150) { L2.mode = "margins"; L2.left = [0, mw]; L2.right = [W - mw, W]; }
        else L2.mode = "band";
      }
      return L2;
    }

    function resize(force) {
      var w = window.innerWidth, h = window.innerHeight;
      var rebuild = force || w !== W || Math.abs(h - H) > 140;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      if (rebuild || !L) {
        L = layout();
        S = motif.setup ? motif.setup(L, seeded(theme + ":" + L.mode)) : {};
      }
      measure();
      schedule();
    }

    function progress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    }

    function draw() {
      raf = 0;
      var now = performance.now();
      var scroll = window.scrollY, p = reduceMotion ? 0.5 : progress();
      var hoverTo = hoverName ? 1 : 0;
      hoverW += (hoverTo - hoverW) * (reduceMotion ? 1 : 0.1);
      if (!hoverName && hoverW < 0.002) { hoverW = 0; hoverScene = null; }
      var mix = currentMix();
      if (sceneEls.length) paint(mix);
      body.style.setProperty("--geo-p", p.toFixed(3));
      if (masked && bandEl) canvas.style.setProperty("--geo-band", Math.round(bandEl.getBoundingClientRect().bottom) + "px");

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var visible = !(L.mode === "band" && scroll > L.band);
      if (visible) {
        if (L.mode === "band") ctx.translate(0, -scroll);
        motif.draw(ctx, L, S, {
          p: p, t: reduceMotion ? 0 : (now - t0) / 1000, scroll: reduceMotion ? 0 : scroll,
          pal: pal, ptr: ptr, mix: mix, calm: calmBoxes(scroll), scrollY: L.mode === "band" ? 0 : scroll, still: reduceMotion
        });
      }
      var settling = Math.abs(hoverTo - hoverW) > 0.002;
      if (settling || (visible && motif.ambient && !reduceMotion && !document.hidden)) schedule();
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    // on the home page, pointing at a course tile turns the field into that course
    [].forEach.call(document.querySelectorAll(".course-tile[data-course]"), function (tile) {
      var slug = tile.getAttribute("data-course");
      function enter() { if (SCENES[slug]) { hoverName = slug; hoverScene = SCENES[slug]; schedule(); } }
      function leave() { if (hoverName === slug) { hoverName = null; schedule(); } }
      tile.addEventListener("pointerenter", enter);
      tile.addEventListener("pointerleave", leave);
      tile.addEventListener("focus", enter);
      tile.addEventListener("blur", leave);
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", function () { resize(false); });
    document.addEventListener("visibilitychange", schedule);
    if (motif.pointer && !reduceMotion) {
      window.addEventListener("pointermove", function (e) {
        if (e.pointerType === "mouse") { ptr = [e.clientX, e.clientY + (L && L.mode === "band" ? window.scrollY : 0)]; schedule(); }
      }, { passive: true });
      document.addEventListener("pointerleave", function () { ptr = null; });
    }
    // fonts and images move things after first paint
    window.addEventListener("load", function () { resize(true); });
    // scroll-reveal moves text into place after the first measure
    setTimeout(function () { measure(); schedule(); }, 1500);
    if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); schedule(); }).observe(document.body);
    resize(true);
  }

  /* ------------------------------------------------------------------ */
  /* thumbnails: canvas[data-motif]                                      */
  /* ------------------------------------------------------------------ */

  function initThumb(c) {
    var motif = MOTIFS[c.getAttribute("data-motif")];
    if (!motif || !c.getContext) return;
    var ctx = c.getContext("2d"), VW = 560, VH = 350, S = null, pal = null;
    var p = 0.55, from = 0.55, to = 0.55, start = 0, raf = 0, t0 = performance.now();
    var host = c.closest("[data-course]") || c.parentElement;
    var hover = c.closest("a") || c;

    function L() { return { W: VW, H: VH, mode: "thumb", band: VH, clear: 0 }; }

    function size() {
      var r = c.getBoundingClientRect();
      if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      VH = VW * r.height / r.width;
      S = motif.setup ? motif.setup(L(), seeded(c.getAttribute("data-motif") + ":thumb")) : {};
      pal = readPalette(host);
      render();
    }

    function render() {
      raf = 0;
      if (!S) return;
      var now = performance.now(), f = clamp((now - start) / 1400, 0, 1);
      p = lerp(from, to, ease(f));
      var k = c.width / VW;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, VW, VH);
      motif.draw(ctx, L(), S, { p: p, t: (now - t0) / 1000, scroll: 0, pal: pal, ptr: null, night: 0 });
      if (f < 1 || (motif.ambient && hover.matches(":hover"))) raf = requestAnimationFrame(render);
    }

    function go(target) {
      if (reduceMotion) return;
      from = p;
      to = target;
      start = performance.now();
      if (!raf) raf = requestAnimationFrame(render);
    }

    hover.addEventListener("pointerenter", function () { go(1); });
    hover.addEventListener("pointerleave", function () { go(0.55); });
    hover.addEventListener("focus", function () { go(1); });
    hover.addEventListener("blur", function () { go(0.55); });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); size(); }
      }, { rootMargin: "200px" });
      io.observe(c);
    } else {
      size();
    }
    window.addEventListener("resize", function () { if (S) size(); });
  }

  /* ------------------------------------------------------------------ */

  var bg = document.querySelector("canvas.geo-canvas");
  var theme = body.getAttribute("data-geo");
  addCourseScenes();
  if (bg && theme && bg.getContext) startBackground(bg, theme);
  [].forEach.call(document.querySelectorAll("canvas[data-motif]"), initThumb);
})();
