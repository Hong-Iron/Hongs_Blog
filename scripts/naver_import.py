#!/usr/bin/env python3
"""
Import Naver blog posts (SmartEditor ONE) as Pensées posts.

    python3 scripts/naver_import.py 224431571808=i-am-israel-too [more logNo=slug ...]
        [--blog red_iron04] [--category pensees] [--meta meta.json] [--dry-run]

Stdlib only. For each post it writes _posts/<date>-<slug>.md and downloads
the post's images to assets/img/uploads/<slug>-<n>.jpg. The text keeps its
line structure: one paragraph per line (the site's kramdown hard_wrap turns
those into line breaks), empty paragraphs become paragraph breaks, quotes
become blockquotes with "— cite", bold stays bold, size-19+ bold lines
become ## headings, and dividers become ---.

--meta points at a JSON file {"<slug>": {"tags": [...], "excerpt": "..."}}
for the front matter; without it those fields are left empty to fill in.
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "_posts"
UPLOADS = ROOT / "assets" / "img" / "uploads"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
KST = timezone(timedelta(hours=9))
VOID = {"br", "hr", "img", "meta", "link", "input", "source", "col", "area", "base", "wbr", "param", "track", "embed"}


# ---------------------------------------------------------------------------
# a tiny DOM
# ---------------------------------------------------------------------------

class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs or {}), parent, []

    @property
    def classes(self):
        return self.attrs.get("class", "").split()

    def has(self, cls):
        return cls in self.classes

    def walk(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.walk()

    def find_all(self, pred):
        return [n for n in self.walk() if pred(n)]

    def find(self, pred):
        return next((n for n in self.walk() if pred(n)), None)

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(html):
    b = Builder()
    b.feed(html)
    return b.root


# ---------------------------------------------------------------------------
# inline text
# ---------------------------------------------------------------------------

def escape(text):
    text = text.replace("​", "").replace("\xa0", " ")
    text = re.sub(r"([\\`*_|])", r"\\\1", text)
    text = text.replace("<", "&lt;")
    return text


def font_size(node):
    sizes = []
    for n in [node] + list(node.walk()):
        for c in n.classes:
            m = re.match(r"se-fs-fs(\d+)", c)
            if m:
                sizes.append(int(m.group(1)))
    return max(sizes) if sizes else 0


def inline(node):
    out = []
    for c in node.children:
        if isinstance(c, str):
            out.append(escape(c))
            continue
        if c.tag in ("b", "strong"):
            out.append(wrap(inline(c), "**"))
        elif c.tag in ("i", "em"):
            out.append(wrap(inline(c), "*"))
        elif c.tag in ("s", "strike", "del"):
            out.append(wrap(inline(c), "~~"))
        elif c.tag == "a" and c.attrs.get("href", "").startswith("http"):
            label = inline(c).strip() or escape(c.attrs["href"])
            out.append(f"[{label}]({c.attrs['href']})")
        elif c.tag == "br":
            out.append("\n")
        else:
            out.append(inline(c))
    return "".join(out)


def wrap(s, mark):
    if not s.strip():
        return s
    lead = s[: len(s) - len(s.lstrip())]
    trail = s[len(s.rstrip()):]
    return f"{lead}{mark}{s.strip()}{mark}{trail}"


def is_all_bold(p):
    texts = []

    def visit(n, bold):
        for c in n.children:
            if isinstance(c, str):
                if c.replace("​", "").strip():
                    texts.append(bold)
            else:
                visit(c, bold or c.tag in ("b", "strong"))
    visit(p, False)
    return bool(texts) and all(texts)


def paragraph(p):
    """One SmartEditor paragraph -> one markdown line ('' for an empty one)."""
    raw = p.text().replace("​", "").replace("\xa0", " ").strip()
    if not raw:
        return ""
    if is_all_bold(p) and font_size(p) >= 19 and len(raw) <= 60:
        return "## " + escape(raw)
    line = inline(p).strip()
    # keep text that merely looks like Markdown block syntax as text
    line = re.sub(r"^(#{1,6}|>|[-+]) ", lambda m: "\\" + m.group(0), line)
    line = re.sub(r"^(\d+)\. ", r"\1\\. ", line)
    return line


# ---------------------------------------------------------------------------
# components
# ---------------------------------------------------------------------------

def paragraphs_of(node):
    return node.find_all(lambda n: n.tag == "p" and n.has("se-text-paragraph"))


def text_component(comp):
    lines = []
    module = comp.find(lambda n: n.has("se-module-text")) or comp
    for child in module.walk():
        if child.tag == "p" and child.has("se-text-paragraph") and child.parent.tag != "li":
            lines.append(paragraph(child))
        elif child.tag in ("ol", "ul") and child.has("se-text-list"):
            ordered = child.tag == "ol"
            for i, li in enumerate([c for c in child.children if isinstance(c, Node) and c.tag == "li"], 1):
                body = " ".join(paragraph(p) for p in paragraphs_of(li)).strip()
                lines.append(f"{i}. {body}" if ordered else f"- {body}")
    return lines


def quote_component(comp):
    quote = comp.find(lambda n: n.has("se-quote"))
    cite = comp.find(lambda n: n.has("se-cite"))
    lines = [paragraph(p) for p in paragraphs_of(quote)] if quote else []
    while lines and not lines[-1]:
        lines.pop()
    out = [f"> {l}" if l else ">" for l in lines]
    cite_text = cite.text().replace("​", "").strip() if cite else ""
    if cite_text:
        out += [">", f"> — {escape(cite_text)}"]
    return out


def image_sources(comp):
    srcs = []
    for a in comp.find_all(lambda n: n.tag == "a" and "data-linkdata" in n.attrs):
        try:
            srcs.append(json.loads(a.attrs["data-linkdata"])["src"])
        except (ValueError, KeyError):
            pass
    if not srcs:
        srcs = [img.attrs.get("data-lazy-src") or img.attrs.get("src")
                for img in comp.find_all(lambda n: n.tag == "img" and n.has("se-image-resource"))]
    return [s.split("?")[0] for s in srcs if s]


def caption_of(comp):
    cap = comp.find(lambda n: n.has("se-caption"))
    return cap.text().replace("​", "").strip() if cap else ""


def convert(html, slug, images):
    root = parse(html)
    main = root.find(lambda n: n.has("se-main-container"))
    if main is None:
        raise SystemExit("no SmartEditor content found (se-main-container)")
    blocks, warnings = [], []
    for comp in main.find_all(lambda n: n.tag == "div" and n.has("se-component")):
        kind = next((c for c in comp.classes if c.startswith("se-") and c not in ("se-component",) and not c.startswith("se-l-")), "")
        if kind == "se-text":
            blocks.append(("text", text_component(comp)))
        elif kind == "se-quotation":
            blocks.append(("quote", quote_component(comp)))
        elif kind == "se-horizontalLine":
            blocks.append(("hr", ["---"]))
        elif kind in ("se-image", "se-imageStrip", "se-imageGroup"):
            srcs = image_sources(comp)
            paths = [images(src) for src in srcs]
            blocks.append(("image", (paths, caption_of(comp))))
        elif kind:
            warnings.append(f"skipped component {kind}")
    return root, blocks, warnings


def render(blocks, title):
    out = []
    for kind, data in blocks:
        if kind == "image":
            paths, cap = data
            alt = escape(cap or title).replace('"', "&quot;")
            imgs = "".join(f'<img src="{{{{ \'{p}\' | relative_url }}}}" alt="{alt}" loading="lazy">' for p in paths)
            if len(paths) > 1:
                imgs = f'<div class="image-strip">{imgs}</div>'
            fig = f"<figure>{imgs}" + (f"<figcaption>{escape(cap)}</figcaption>" if cap else "") + "</figure>"
            out += ["", fig, ""]
        else:
            out += [""] + data + [""]
    text = "\n".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"
    return text


# ---------------------------------------------------------------------------

def fetch(url, referer=None):
    # curl first: python.org builds on macOS often lack a CA bundle
    if shutil.which("curl"):
        cmd = ["curl", "-sSfL", "--max-time", "30", "-A", UA] + (["-e", referer] if referer else []) + [url]
        return subprocess.run(cmd, check=True, capture_output=True).stdout
    req = urllib.request.Request(url, headers={"User-Agent": UA, **({"Referer": referer} if referer else {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("posts", nargs="+", help="logNo=slug pairs")
    ap.add_argument("--blog", default="red_iron04")
    ap.add_argument("--category", default="pensees")
    ap.add_argument("--meta", type=Path, help="JSON with tags/excerpt per slug")
    ap.add_argument("--dry-run", action="store_true", help="print Markdown, write nothing")
    args = ap.parse_args()
    meta = json.loads(args.meta.read_text(encoding="utf-8")) if args.meta else {}

    for pair in args.posts:
        log_no, _, slug = pair.partition("=")
        if not slug:
            sys.exit(f"expected logNo=slug, got {pair!r}")
        url = f"https://blog.naver.com/PostView.naver?blogId={args.blog}&logNo={log_no}"
        html = fetch(url).decode("utf-8", errors="replace")
        counter = {"n": 0}

        def images(src):
            counter["n"] += 1
            ext = Path(src).suffix.lower() if Path(src).suffix.lower() in (".jpg", ".jpeg", ".png", ".gif", ".webp") else ".jpg"
            rel = f"/assets/img/uploads/{slug}-{counter['n']}{ext.replace('.jpeg', '.jpg')}"
            if not args.dry_run:
                UPLOADS.mkdir(parents=True, exist_ok=True)
                data = fetch(src + "?type=w966", referer="https://blog.naver.com/")
                (ROOT / rel.lstrip("/")).write_bytes(data)
            return rel

        root, blocks, warnings = convert(html, slug, images)
        title_meta = root.find(lambda n: n.tag == "meta" and n.attrs.get("property") == "og:title")
        title = title_meta.attrs.get("content", slug) if title_meta else slug
        # postWriteDate (epoch ms) is absolute; the visible date can read "19시간 전"
        m_ts = re.search(r'postWriteDate\s*=\s*"(\d+)"', html)
        if m_ts:
            stamp = datetime.fromtimestamp(int(m_ts.group(1)) / 1000, KST).replace(tzinfo=None)
        else:
            date_node = root.find(lambda n: n.has("se_publishDate"))
            stamp = datetime.strptime(re.sub(r"\s+", " ", date_node.text().strip()), "%Y. %m. %d. %H:%M")

        # tidy dividers: no runs of several, none at the very start or end
        blocks = [b for b in blocks if not (b[0] == "text" and not any(l for l in b[1]))]
        tidy = []
        for b in blocks:
            if b[0] == "hr" and (not tidy or tidy[-1][0] == "hr"):
                continue
            tidy.append(b)
        while tidy and tidy[-1][0] == "hr":
            tidy.pop()
        blocks = tidy

        # a post that opens with an image uses it as the cover instead
        cover = ""
        if blocks and blocks[0][0] == "image" and len(blocks[0][1][0]) == 1:
            cover = blocks[0][1][0][0]
            blocks = blocks[1:]

        body = render(blocks, title)
        if "{{" in re.sub(r"\{\{ '[^']*' \| relative_url \}\}", "", body) or "{%" in body:
            warnings.append("body contains Liquid-like braces; check the output")
        m = meta.get(slug, {})
        tags = ", ".join(m.get("tags", []))
        fm = [
            "---",
            f"title: {json.dumps(title, ensure_ascii=False)}",
            "subtitle:",
            f"date: {stamp.strftime('%Y-%m-%d %H:%M:00')} +0900",
            f"categories: [{args.category}]",
            f"tags: [{tags}]",
            f"excerpt: {json.dumps(m.get('excerpt', ''), ensure_ascii=False)}",
            f"cover: {cover}",
            f"original: http://blog.naver.com/{args.blog}/{log_no}",
            "---",
            "",
        ]
        text = "\n".join(fm) + body
        name = f"{stamp.strftime('%Y-%m-%d')}-{slug}.md"
        if args.dry_run:
            print(f"===== {name}\n{text}")
        else:
            (POSTS / name).write_text(text, encoding="utf-8")
            print(f"wrote _posts/{name} ({counter['n']} images)")
        for w in warnings:
            print(f"  warning: {w}")


if __name__ == "__main__":
    main()
