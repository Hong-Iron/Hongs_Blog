// Renders ```mermaid fences on study-note pages. Loaded only when the page's
// front matter has `mermaid: true` (see _includes/head.html).
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";

const dark = document.body.dataset.bg === "midnight";
mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "neutral", securityLevel: "strict" });

// kramdown/rouge wraps the fence as <div class="language-mermaid highlighter-rouge">…<code>
const nodes = [...document.querySelectorAll("div.language-mermaid, pre > code.language-mermaid")].map((el) => {
  const box = el.matches("code") ? el.parentElement : el;
  const pre = document.createElement("pre");
  pre.className = "mermaid";
  pre.textContent = box.textContent;
  box.replaceWith(pre);
  return pre;
});

// A wide diagram squeezed into a phone-width column ends up with unreadable
// text. Below 65% of its natural size it keeps that size and scrolls sideways.
const MIN_SCALE = 0.65;
function fit(pre) {
  const svg = pre.querySelector("svg");
  if (!svg) return;
  const vb = svg.viewBox && svg.viewBox.baseVal;
  const natural = parseFloat(svg.dataset.naturalWidth || svg.style.maxWidth) || (vb && vb.width) || 0;
  if (!natural) return;
  svg.dataset.naturalWidth = natural;
  const wide = natural * MIN_SCALE > pre.clientWidth + 4;
  pre.classList.toggle("is-wide", wide);
  svg.style.width = wide ? Math.round(natural * MIN_SCALE) + "px" : "";
  svg.style.maxWidth = wide ? "none" : natural + "px";
  let hint = pre.nextElementSibling;
  if (!hint || !hint.classList.contains("mermaid-hint")) hint = null;
  if (wide && !hint) {
    hint = document.createElement("p");
    hint.className = "mermaid-hint";
    hint.textContent = "옆으로 밀어서 보기 →";
    pre.after(hint);
  } else if (!wide && hint) {
    hint.remove();
  }
}
// refit when the column width changes (rotation, window resize)
const widths = new WeakMap();
const watch = "ResizeObserver" in window ? new ResizeObserver((entries) => {
  for (const e of entries) {
    const w = Math.round(e.contentRect.width);
    if (widths.get(e.target) !== w) { widths.set(e.target, w); fit(e.target); }
  }
}) : null;
async function render(list) {
  await mermaid.run({ nodes: list });
  list.forEach((pre) => { fit(pre); if (watch) watch.observe(pre); });
}

// Diagrams inside a closed <details> can't be measured until it opens.
const visible = [];
for (const pre of nodes) {
  const closed = pre.closest("details:not([open])");
  if (closed) {
    closed.addEventListener("toggle", () => render([pre]), { once: true });
  } else {
    visible.push(pre);
  }
}
if (visible.length) render(visible);
