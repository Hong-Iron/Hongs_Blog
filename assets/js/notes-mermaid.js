// Renders ```mermaid fences on study-note pages. Loaded only when the page's
// front matter has `mermaid: true` (see _includes/head.html).
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

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

// Diagrams inside a closed <details> can't be measured until it opens.
const visible = [];
for (const pre of nodes) {
  const closed = pre.closest("details:not([open])");
  if (closed) {
    closed.addEventListener("toggle", () => mermaid.run({ nodes: [pre] }), { once: true });
  } else {
    visible.push(pre);
  }
}
if (visible.length) mermaid.run({ nodes: visible });
