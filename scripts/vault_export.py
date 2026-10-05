#!/usr/bin/env python3
"""
Export the Obsidian study vault into this Jekyll site's Studies section.

    python3 scripts/vault_export.py --vault ~/Documents/VAULT/공부

Stdlib only. Every run regenerates, from scratch:

    _notes/<course>/index.md          course roadmap  -> /studies/<course>/
    _notes/<course>/<id>.md           concept/practice -> /studies/<course>/<id>/
    _notes/<course>/code/<stem>.md    code page        -> /studies/<course>/code/<stem>/
    _data/study_courses.yml           course list used by studies.html
    studies.html                      the Studies hub page

Only the notes written in the vault are exported (roadmaps, 3.개념집,
4.연습문제 and their code). Lecture PDFs, slide captures, recordings,
2.필기노트 and _시스템 never leave the vault. Add anything else that must stay
private to EXCLUDE below.

Obsidian syntax is rewritten into what GitHub Pages' kramdown understands:
wikilinks become site links, callouts become styled blocks (foldable ones
become <details>), "- 답" answer lists fold, single-dollar math becomes
kramdown's $$ math (rendered by MathJax), and soft line breaks are kept.
"""

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "_notes"
DATA_FILE = ROOT / "_data" / "study_courses.yml"
STUDIES_PAGE = ROOT / "studies.html"

# (track, [(vault folder, course name, url slug), ...]) in display order.
TRACKS = [
    ("4-1학기", [
        ("4-1학기/이상 심리학", "이상 심리학", "abnormal-psychology"),
        ("4-1학기/컴퓨터 통신", "컴퓨터 통신", "computer-communication"),
        ("4-1학기/휴먼 인터페이스 미디어", "휴먼 인터페이스 미디어", "human-interface-media"),
    ]),
    ("공학수학", [
        ("공학수학/대학수학", "대학수학", "college-math"),
        ("공학수학/이산수학", "이산수학", "discrete-math"),
        ("공학수학/미분적분학", "미분적분학", "calculus"),
        ("공학수학/선형대수학", "선형대수학", "linear-algebra"),
        ("공학수학/확률과 통계", "확률과 통계", "probability-statistics"),
    ]),
    ("알고리즘", [
        ("알고리즘", "알고리즘", "algorithms"),
    ]),
]

# Vault paths (relative, with extension) that must not be published.
# Links pointing at them render as plain text.
EXCLUDE = {
    "4-1학기/컴퓨터 통신/4.연습문제/26.과제 2.md",  # graded assignment solution
}

CODE_EXTS = {".py": "python", ".c": "c", ".js": "javascript"}

DOC_TYPE_LABELS = {
    "definition": "정의", "theorem": "정리", "algorithm": "알고리즘",
    "data-structure": "자료구조", "technique": "기법", "model": "모델",
    "contrast": "비교", "steps": "징검다리", "bridge": "브리지",
}
CODE_ROLE_LABELS = {"impl": "구현", "verify": "검증", "bench": "실험"}

CALLOUT_TITLES = {
    "summary": "요약", "definition": "정의", "theorem": "정리", "proof": "증명",
    "example": "예시", "question": "질문", "answer": "답", "hint": "힌트",
    "check": "검증", "misconception": "오해", "warning": "주의",
    "info": "정보", "important": "중요", "note": "노트", "tip": "팁",
}

warnings = []


def warn(msg):
    warnings.append(msg)


def yaml_str(value):
    # JSON strings are valid YAML scalars and escape everything we need.
    return json.dumps(value, ensure_ascii=False)


def read_baseurl():
    m = re.search(r'^baseurl:\s*"?([^"\n]*)"?', (ROOT / "_config.yml").read_text(encoding="utf-8"), re.M)
    return (m.group(1) if m else "").rstrip("/")


def split_front_matter(text):
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            return text[4:end], text[end + 4:].lstrip("\n")
    return "", text


def parse_front_matter(fm):
    """Just enough YAML for the vault's flat front matter."""
    data = {}
    for line in fm.splitlines():
        m = re.match(r"^([A-Za-z_]+):\s*(.*?)(?:\s+#[^\"\]]*)?$", line)
        if not m:
            continue
        key, raw = m.groups()
        if raw.startswith("["):
            try:
                data[key] = json.loads(raw)
            except ValueError:
                data[key] = [s.strip().strip('"') for s in raw.strip("[]").split(",") if s.strip()]
        else:
            data[key] = raw.strip('"')
    return data


def num_prefix(name):
    m = re.match(r"^(\d+)", name)
    return m.group(1) if m else ""


# ---------------------------------------------------------------------------
# Line-level (block structure) conversion
# ---------------------------------------------------------------------------

FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})")
CALLOUT_RE = re.compile(r"^\[!([A-Za-z-]+)\]([+-]?)\s*(.*)$")
LIST_RE = re.compile(r"^(\s*)([-*+]|\d+\.)(\s+)")
OL_RE = re.compile(r"^(\s*)(\d+)\.\s")


def indent_of(line):
    return len(line) - len(line.lstrip(" "))


def expand_leading_tabs(lines):
    out, fence = [], None
    for line in lines:
        m = FENCE_RE.match(line)
        if fence is None and not m:
            lead = re.match(r"^[ \t]*", line).group(0)
            line = lead.replace("\t", "    ") + line[len(lead):]
        if m:
            fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
        out.append(line)
    return out


def is_text_line(line):
    s = line.strip()
    if not s:
        return False
    if s[0] in "|#<" or s.startswith("$$") or s.startswith("{:") or FENCE_RE.match(s):
        return False
    if re.match(r"^\[\^[^\]]+\]:", s) or re.match(r"^(-{3,}|\*{3,})$", s):
        return False
    return True


def convert_lines(lines, nested=False):
    """Convert one container level (document body, or a callout's inside).
    `nested` is true inside an HTML block (callout, fold)."""
    lines = expand_leading_tabs(lines)
    chunks = []  # ("md", [lines]) or ("raw", [lines])
    md = []
    i, fence = 0, None

    def flush():
        if md:
            chunks.append(("md", md[:]))
            md.clear()

    while i < len(lines):
        line = lines[i]
        m = FENCE_RE.match(line)
        if fence is not None or m:
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            md.append(line)
            i += 1
            continue

        q = re.match(r"^(\s*)>", line)
        if q:
            pad = q.group(1)
            group = []
            while i < len(lines) and re.match(r"^" + re.escape(pad) + r">", lines[i]):
                body = lines[i][len(pad) + 1:]
                group.append(body[1:] if body.startswith(" ") else body)
                i += 1
            flush()
            chunks.append(("raw", convert_quote(group, pad, nested)))
            continue

        a = re.match(r"^(\s*)- 답\s*$", line)
        if a:
            pad = a.group(1)
            j = i + 1
            while j < len(lines) and (not lines[j].strip() or indent_of(lines[j]) > len(pad)):
                j += 1
            while j > i + 1 and not lines[j - 1].strip():
                j -= 1
            children = lines[i + 1:j]
            if children:
                cut = min(indent_of(c) for c in children if c.strip())
                inner = convert_lines([c[cut:] for c in children], nested=True)
                flush()
                chunks.append(("raw", wrap_fold("answer-fold", "답", inner, pad)))
                i = j
                continue

        md.append(line)
        i += 1
    flush()

    out = []
    for kind, block in chunks:
        if kind == "md":
            block = fix_details(block)
            block = normalize_math_blocks(block)
            block = add_list_starts(block)
            block = add_hard_breaks(block, nested)
        if out and out[-1].strip() and block and block[0].strip() and kind == "raw":
            out.append("")
        out.extend(block)
    return out


def wrap_fold(css_class, title, inner, pad=""):
    out = [f'{pad}<details class="{css_class}" markdown="1"><summary markdown="span">{title}</summary>', ""]
    out += [(pad + l) if l.strip() else "" for l in inner]
    out += ["", f"{pad}</details>", ""]
    return out


def convert_quote(group, pad, nested=False):
    head = CALLOUT_RE.match(group[0].strip()) if group else None
    if not head:
        inner = convert_lines(group, nested)
        return [f"{pad}> {l}".rstrip() for l in inner] + [""]

    ctype, fold, title = head.group(1).lower(), head.group(2), head.group(3).strip()
    inner = convert_lines(group[1:], nested=True)
    while inner and not inner[-1].strip():
        inner.pop()
    default = not title
    title = title or CALLOUT_TITLES.get(ctype, ctype.capitalize())
    title_cls = "callout-title callout-title--default" if default else "callout-title"

    if fold:
        open_attr = " open" if fold == "+" else ""
        out = [f'{pad}<details class="callout callout-{ctype}" markdown="1"{open_attr}>',
               f'{pad}<summary class="{title_cls}" markdown="span">{title}</summary>']
        close = f"{pad}</details>"
    else:
        out = [f'{pad}<div class="callout callout-{ctype}" markdown="1">',
               f'{pad}<div class="{title_cls}" markdown="span">{title}</div>']
        close = f"{pad}</div>"
    if inner:
        out.append("")
        out += [(pad + l) if l.strip() else "" for l in inner]
    out += ["", close, ""]
    return out


INLINE_DETAILS_RE = re.compile(r"^(?P<lead>.*?\S)\s*<details>\s*<summary>(?P<sum>.*?)</summary>(?P<body>.*?)</details>\s*$")


def fix_details(lines):
    """Make <details> blocks parse their Markdown, and move one-line
    `text <details>…</details>` answers onto their own lines."""
    out, fence = [], None
    for line in lines:
        m = FENCE_RE.match(line)
        if fence is not None or m:
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            out.append(line)
            continue

        inline = INLINE_DETAILS_RE.match(line)
        if inline and not line.lstrip().startswith("<details"):
            lead = inline.group("lead")
            lm = LIST_RE.match(lead)
            pad = " " * len(lm.group(0)) if lm else re.match(r"^\s*", lead).group(0)
            out.append(lead)
            if not lm:
                out.append("")
            out.append(f'{pad}<details class="inline-fold" markdown="1"><summary markdown="span">{inline.group("sum")}</summary>')
            out.append(f'{pad}{inline.group("body").strip()}')
            out.append(f"{pad}</details>")
            continue

        stripped = line.lstrip()
        pad = line[: len(line) - len(stripped)]
        if stripped.startswith("<details") or stripped.startswith("<summary") or stripped.startswith("</details>"):
            line = re.sub(r"<details(?![^>]*markdown=)", '<details markdown="1"', line)
            line = re.sub(r"<summary(?![^>]*markdown=)", '<summary markdown="span"', line)
            # text after </summary> or before </details> goes on its own line
            parts = re.split(r"(?<=</summary>)|(?=</details>)", line)
            parts = [p for p in (x.strip() for x in parts) if p]
            for k, part in enumerate(parts):
                if part.startswith("</details>"):
                    if out and out[-1].strip():
                        out.append("")
                    out.append(pad + part)
                else:
                    out.append(pad + part)
                    if part.endswith("</summary>") or (k + 1 < len(parts) and not part.startswith("<")):
                        out.append("")
            continue
        out.append(line)
    return out


def normalize_math_blocks(lines):
    """kramdown only treats $$…$$ as display math at block boundaries."""
    out, fence, in_math = [], None, False
    for idx, line in enumerate(lines):
        m = FENCE_RE.match(line)
        if not in_math and (fence is not None or m):
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            out.append(line)
            continue
        s = line.strip()
        if not in_math and s.startswith("$$"):
            single = len(s) > 4 and s.endswith("$$") and s.count("$$") == 2
            if s == "$$" or single or not s.endswith("$$"):
                if out and out[-1].strip():
                    out.append("")
                out.append(line)
                if single:
                    out.append("")
                else:
                    in_math = True
                continue
        if in_math:
            out.append(line)
            if s.endswith("$$"):
                in_math = False
                out.append("")
            continue
        out.append(line)
    return out


def add_list_starts(lines):
    """kramdown ignores an ordered list's first number; Obsidian keeps it."""
    out, fence = [], None
    for idx, line in enumerate(lines):
        m = FENCE_RE.match(line)
        if fence is not None or m:
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            out.append(line)
            continue
        ol = OL_RE.match(line)
        if ol and ol.group(2) != "1":
            ind = len(ol.group(1))
            starts = True
            for prev in reversed(lines[:idx]):
                if not prev.strip() or indent_of(prev) > ind:
                    continue
                pm = OL_RE.match(prev)
                starts = not (pm and len(pm.group(1)) == ind)
                break
            if starts:
                if out and out[-1].strip():
                    out.append("")
                out.append(f'{ol.group(1)}{{: start="{int(ol.group(2))}"}}')
        out.append(line)
    return out


def add_hard_breaks(lines, nested=False):
    """Obsidian shows a single newline as a line break. At the top level the
    site's kramdown `hard_wrap` does that; inside HTML blocks (callouts,
    folds) it doesn't, so those lines get an explicit <br>."""
    out, fence, in_math, depth = list(lines), None, False, 0
    for idx, line in enumerate(lines):
        depth += line.count("<details") - line.count("</details>")
        m = FENCE_RE.match(line)
        if fence is not None or m:
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            continue
        s = line.strip()
        if s.startswith("$$") and not (len(s) > 4 and s.endswith("$$")):
            in_math = not in_math
            continue
        if in_math or idx + 1 >= len(lines):
            continue
        nxt = lines[idx + 1]
        if (nested or depth > 0) and is_text_line(line) and is_text_line(nxt) \
                and not LIST_RE.match(nxt) and not nxt.strip().startswith("$$") \
                and not line.rstrip().endswith("<br>"):
            out[idx] = line.rstrip() + "<br>"
    return out


# ---------------------------------------------------------------------------
# Span-level conversion (links, math, highlights)
# ---------------------------------------------------------------------------

WIKILINK_RE = re.compile(r"(!?)\[\[([^\[\]]+?)\]\]")
INLINE_MATH_RE = re.compile(r"(?<![\\$])\$(?=[^\s$])((?:\\.|[^$\\\n])+?)(?<!\\)\$(?![$\d])")
CODE_SPAN_RE = re.compile(r"(`+)(.+?)\1")


class Linker:
    def __init__(self, baseurl):
        self.baseurl = baseurl
        self.by_path = {}   # vault path (no .md) -> (url, title)
        self.by_name = {}   # basename -> [(url, title)]
        self.unresolved = {}

    def add(self, vault_path, url, title):
        key = vault_path[:-3] if vault_path.endswith(".md") else vault_path
        self.by_path[key] = (self.baseurl + url, title)
        self.by_name.setdefault(key.rsplit("/", 1)[-1], []).append((self.baseurl + url, title))

    def remove(self, vault_path):
        entry = self.by_path.pop(vault_path, None)
        name = self.by_name.get(vault_path.rsplit("/", 1)[-1], [])
        if entry in name:
            name.remove(entry)

    def resolve(self, target):
        target = target.strip()
        if target.endswith(".md"):
            target = target[:-3]
        if target in self.by_path:
            return self.by_path[target]
        hits = self.by_name.get(target.rsplit("/", 1)[-1], [])
        return hits[0] if len(hits) == 1 else None

    def replace(self, match, source):
        embed, inner = match.group(1), match.group(2)
        if not re.search(r"[^\W\d_]", inner):
            return match.group(0)   # e.g. a nested list like [[1, 2]], not a link
        parts = re.split(r"\\?\|", inner, maxsplit=1)
        target = parts[0].split("#", 1)[0]
        display = parts[1].strip() if len(parts) > 1 else None
        hit = self.resolve(target) if target else None
        if display is None:
            display = hit[1] if hit else re.sub(r"^\d+[._]", "", target.rsplit("/", 1)[-1])
        if embed or not hit:
            if not embed and not re.search(r"/(1\.수업자료|2\.필기노트)/|^_시스템/|\.(pdf|png|jpe?g|webm)$", target) \
                    and target + ".md" not in EXCLUDE:
                self.unresolved.setdefault(target, set()).add(source)
            return display
        label = display.replace("[", r"\[").replace("]", r"\]")
        return f"[{label}]({hit[0]})"


def convert_spans(lines, linker, source):
    out, fence, in_math = [], None, False
    for idx, line in enumerate(lines):
        m = FENCE_RE.match(line)
        if fence is not None or m:
            if m:
                fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            out.append(line)
            continue
        s = line.strip()
        if s.startswith("$$") and not (len(s) > 4 and s.endswith("$$")):
            in_math = not in_math
            out.append(line)
            continue
        if in_math:
            out.append(line)
            continue

        # kramdown starts a table at any line holding an unescaped "|", even
        # inside math or code, so pipes outside real tables are neutralized.
        table_row = s.startswith("|")
        codes, maths = [], []

        def stash_code(cm):
            code = cm.group(0)
            if not table_row and "|" in code:
                inner = cm.group(2).strip()
                inner = inner.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("|", "&#124;")
                code = f"<code>{inner}</code>"
            codes.append(code)
            return f"\x00{len(codes) - 1}\x00"

        def stash_math(tex, converted):
            if not table_row:
                tex = tex.replace(r"\|", r"\Vert ").replace("|", r"\vert ")
            maths.append((f"$${tex}$$", converted))
            return f"\x01{len(maths) - 1}\x01"

        work = CODE_SPAN_RE.sub(stash_code, line)
        work = WIKILINK_RE.sub(lambda mm: linker.replace(mm, source), work)
        work = re.sub(r"==([^=\s][^=]*?)==", r"<mark>\1</mark>", work)
        work = re.sub(r"\$\$(.+?)\$\$", lambda mm: stash_math(mm.group(1), False), work)
        work = INLINE_MATH_RE.sub(lambda mm: stash_math(mm.group(1), True), work)
        if not table_row:
            work = re.sub(r"(?<!\\)\|", r"\\|", work)

        # A line holding nothing but one inline formula would become display
        # math in kramdown; a leading backslash keeps it inline.
        body = LIST_RE.sub("", work, count=1).strip()
        prev_blank = idx == 0 or not lines[idx - 1].strip() or bool(LIST_RE.match(work))
        next_blank = idx + 1 >= len(lines) or not lines[idx + 1].strip()
        lone = re.fullmatch(r"\x01(\d+)\x01", body)
        if lone and maths[int(lone.group(1))][1] and prev_blank and next_blank:
            k = int(lone.group(1))
            maths[k] = ("\\" + maths[k][0], True)

        work = re.sub(r"\x01(\d+)\x01", lambda mm: maths[int(mm.group(1))][0], work)
        work = re.sub(r"\x00(\d+)\x00", lambda mm: codes[int(mm.group(1))], work)
        out.append(work)
    return out


# ---------------------------------------------------------------------------
# Document assembly
# ---------------------------------------------------------------------------

def clean_body(body, is_roadmap):
    body = re.sub(r"<!--.*?-->\n?", "", body, flags=re.S)
    # drop an empty "## 내 메모" section (keeps any notes actually written there)
    body = re.sub(r"^## 내 메모\s*\n(?:[ \t]*\n)*(?=\[\^|^## |\Z)", "", body, flags=re.M)
    title = None
    m = re.match(r"^\s*# (.+)\n", body)
    if m:
        title = m.group(1).strip()
        body = body[m.end():]
    if is_roadmap:
        body = re.sub(r"^> (시험|진도):.*\n", "", body, flags=re.M)
        body = re.sub(r"^## 확인할 것\n.*?(?=^## |\Z)", "", body, flags=re.M | re.S)
        body = drop_status_column(body)
    return title, body


def drop_status_column(body):
    """Roadmap tables end in a personal progress column (상태)."""
    lines, out, col = body.split("\n"), [], None
    for line in lines:
        if line.startswith("|"):
            cells = re.split(r"(?<!\\)\|", line.strip())[1:-1]
            if col is None and "상태" in [c.strip() for c in cells]:
                col = [c.strip() for c in cells].index("상태")
            if col is not None and len(cells) > col:
                del cells[col]
                line = "|" + "|".join(cells) + "|"
        else:
            col = None
        out.append(line)
    return "\n".join(out)


def plain_text(md, linker):
    text = WIKILINK_RE.sub(lambda m: (re.split(r"\\?\|", m.group(2), maxsplit=1) + [None])[1]
                           or m.group(2).rsplit("/", 1)[-1], md)
    text = re.sub(r"\$+([^$]*)\$+", r"\1", text)
    text = re.sub(r"\[\^[^\]]+\]|[*_`>]|<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()


def describe(body, linker):
    m = re.search(r"^> \[!summary\][^\n]*\n((?:>.*\n?)+)", body, re.M)
    if m:
        src = "\n".join(l[1:] for l in m.group(1).splitlines())
    else:
        paras = [p for p in body.split("\n\n") if p.strip() and not re.match(r"^\s*[#>|<!-]", p)]
        src = paras[0] if paras else ""
    text = plain_text(src, linker)
    return text[:157] + "…" if len(text) > 160 else text


def title_html(title):
    # titles render outside Markdown; turn $…$ into MathJax's \(…\)
    return re.sub(r"\$([^$]+)\$", r"\\(\1\\)", title)


def write_page(path, front, body_lines):
    path.parent.mkdir(parents=True, exist_ok=True)
    fm = ["---"]
    for key, value in front.items():
        if value is None or value == "" or value == []:
            continue
        if isinstance(value, bool):
            fm.append(f"{key}: {'true' if value else 'false'}")
        elif isinstance(value, int):
            fm.append(f"{key}: {value}")
        elif isinstance(value, list):
            fm.append(f"{key}: [{', '.join(yaml_str(v) for v in value)}]")
        else:
            fm.append(f"{key}: {yaml_str(str(value))}")
    fm.append("---")
    text = "\n".join(fm) + "\n{% raw %}\n" + "\n".join(body_lines).strip("\n") + "\n{% endraw %}\n"
    if "{% endraw %}" in "\n".join(body_lines):
        warn(f"{path}: body contains an endraw tag")
    path.write_text(text, encoding="utf-8")


def export(vault):
    baseurl = read_baseurl()
    linker = Linker(baseurl)
    courses = []   # dicts with everything needed to render

    # pass 1: collect pages and register every link target
    for track, entries in TRACKS:
        for folder, name, slug in entries:
            cdir = vault / folder
            if not cdir.is_dir():
                warn(f"missing course folder: {folder}")
                continue
            course = {"track": track, "folder": folder, "name": name, "slug": slug,
                      "url": f"/studies/{slug}/", "docs": [], "code": []}
            roadmap = cdir / "0.로드맵.md"
            if roadmap.exists():
                course["roadmap"] = roadmap
                linker.add(f"{folder}/0.로드맵", course["url"], f"{name} 로드맵")
            for sub, kind in (("3.개념집", "concept"), ("4.연습문제", "practice")):
                for f in sorted((cdir / sub).glob("*")):
                    rel = f"{folder}/{sub}/{f.name}"
                    if rel in EXCLUDE or f.name.startswith("."):
                        continue
                    if f.suffix == ".md":
                        meta = parse_front_matter(split_front_matter(f.read_text(encoding="utf-8"))[0])
                        doc_id = meta.get("id") or re.sub(r"[^a-z0-9-]+", "-", f.stem.lower()).strip("-")
                        doc = {"path": f, "rel": rel, "kind": kind, "meta": meta, "id": doc_id,
                               "num": num_prefix(f.name), "title": meta.get("title") or f.stem.split(".", 1)[-1],
                               "url": f"/studies/{slug}/{doc_id}/"}
                        course["docs"].append(doc)
                        linker.add(rel, doc["url"], doc["title"])
                    elif f.suffix in CODE_EXTS:
                        code = {"path": f, "rel": rel, "kind": kind, "num": num_prefix(f.name),
                                "url": f"/studies/{slug}/code/{f.stem.lower()}/"}
                        course["code"].append(code)
                        linker.add(rel, code["url"], f.name)
            courses.append(course)

    # code named after an excluded document (<num>_<id>_<role>) stays private too
    excluded_ids = set()
    for rel in EXCLUDE:
        if rel.endswith(".md") and (vault / rel).exists():
            meta = parse_front_matter(split_front_matter((vault / rel).read_text(encoding="utf-8"))[0])
            if meta.get("id"):
                excluded_ids.add((rel.rsplit("/", 2)[0], meta["id"]))
    for course in courses:
        ids = {d["id"]: d for d in course["docs"]}
        kept = []
        for code in course["code"]:
            parts = code["path"].stem.split("_")
            code_id = "_".join(parts[1:-1]) if len(parts) >= 3 else ""
            if (code["rel"].rsplit("/", 2)[0], code_id) in excluded_ids:
                linker.remove(code["rel"])
                continue
            parent = ids.get(code_id)
            if parent is None:
                same = [d for d in course["docs"] if d["kind"] == code["kind"] and d["num"] == code["num"]]
                parent = same[0] if len(same) == 1 else None
            code["parent"] = parent
            code["role"] = parts[-1] if len(parts) >= 3 else ""
            kept.append(code)
        course["code"] = kept

    if NOTES_DIR.exists():
        shutil.rmtree(NOTES_DIR)

    # pass 2: write pages
    for course in courses:
        base = {"course": course["name"], "course_slug": course["slug"],
                "course_url": course["url"], "track": course["track"]}

        for kind in ("concept", "practice"):
            docs = sorted((d for d in course["docs"] if d["kind"] == kind),
                          key=lambda d: (int(d["num"] or 0), d["path"].name))
            for k, doc in enumerate(docs):
                text = doc["path"].read_text(encoding="utf-8")
                fm, body = split_front_matter(text)
                h1, body = clean_body(body, False)
                lines = convert_spans(convert_lines(body.split("\n")), linker, doc["rel"])
                meta = doc["meta"]
                prev_doc = docs[k - 1] if k > 0 else None
                next_doc = docs[k + 1] if k + 1 < len(docs) else None
                code_pages = [c for c in course["code"] if c.get("parent") is doc]
                front = dict(
                    layout="note", title=doc["title"],
                    display_title=title_html(h1 or doc["title"]),
                    kind=kind,
                    kind_label=("연습" if kind == "practice" else DOC_TYPE_LABELS.get(meta.get("type", ""), "개념")),
                    num=doc["num"], **base,
                    updated=meta.get("updated"), status=meta.get("status"),
                    aliases=[a for a in (meta.get("aliases") or []) if isinstance(a, str)],
                    description=describe(body, linker),
                    prev_url=prev_doc and prev_doc["url"], prev_title=prev_doc and prev_doc["title"],
                    next_url=next_doc and next_doc["url"], next_title=next_doc and next_doc["title"],
                    math="$" in body, mermaid="```mermaid" in body,
                    code_count=len(code_pages),
                    permalink=doc["url"],
                )
                write_page(NOTES_DIR / course["slug"] / f"{doc['id']}.md", front, lines)
                if h1 and "$" in h1:
                    warn(f"math in title: {doc['rel']}")

        for code in course["code"]:
            src = code["path"].read_text(encoding="utf-8")
            longest = max((len(r) for r in re.findall(r"`+", src)), default=0)
            fence = "`" * max(3, longest + 1)
            parent = code.get("parent")
            role = code["role"]
            if re.fullmatch(r"p\d+", role):
                role_label = f"문제 {role[1:]} 풀이"
            else:
                role_label = CODE_ROLE_LABELS.get(role, "코드")
            intro = []
            if parent:
                intro.append(f"[{parent['title']}]({baseurl}{parent['url']}) 문서의 {role_label} 코드다."
                             + (" `if __name__ == \"__main__\":` 아래가 자체 테스트다." if "__main__" in src else ""))
            lines = intro + ["", f"{fence}{CODE_EXTS[code['path'].suffix]}", src.rstrip("\n"), fence]
            front = dict(
                layout="note", title=code["path"].name, display_title=code["path"].name,
                kind="code", kind_label=f"코드 · {role_label}", num=code["num"], **base,
                parent_url=parent and parent["url"], parent_title=parent and parent["title"],
                description=f"{course['name']} · {parent['title'] if parent else ''} {role_label} 코드".strip(),
                permalink=code["url"]
            )
            write_page(NOTES_DIR / course["slug"] / "code" / f"{code['path'].stem.lower()}.md", front, lines)

        if course.get("roadmap"):
            text = course["roadmap"].read_text(encoding="utf-8")
            _, body = split_front_matter(text)
            h1, body = clean_body(body, True)
            lines = convert_spans(convert_lines(body.split("\n")), linker, f"{course['folder']}/0.로드맵.md")
            units = [re.sub(r"^[^·]*·\s*", "", h) for h in re.findall(r"^## (\d+\s*(?:회|단원|주차|장|부)[^\n]*)", body, re.M)]
            course["units"] = units
            front = dict(
                layout="course", title=course["name"], display_title=title_html(h1 or course["name"]),
                **base,
                concepts=sum(d["kind"] == "concept" for d in course["docs"]),
                practices=sum(d["kind"] == "practice" for d in course["docs"]),
                codes=len(course["code"]),
                description=f"{course['name']} 공부 노트: 개념 문서, 연습 문제, 코드",
                math="$" in body, mermaid="```mermaid" in body,
                permalink=course["url"]
            )
            write_page(NOTES_DIR / course["slug"] / "index.md", front, lines)

    write_course_data(courses)
    write_studies_page(courses)
    return courses, linker


def write_course_data(courses):
    out = ["# Generated by scripts/vault_export.py — do not edit by hand.", ""]
    for track, _ in TRACKS:
        members = [c for c in courses if c["track"] == track]
        if not members:
            continue
        out.append(f"- track: {yaml_str(track)}")
        out.append("  courses:")
        for c in members:
            units = c.get("units") or []
            preview = " · ".join(units[:4]) + (" …" if len(units) > 4 else "")
            out += [
                f"    - name: {yaml_str(c['name'])}",
                f"      slug: {yaml_str(c['slug'])}",
                f"      url: {yaml_str(c['url'])}",
                f"      concepts: {sum(d['kind'] == 'concept' for d in c['docs'])}",
                f"      practices: {sum(d['kind'] == 'practice' for d in c['docs'])}",
                f"      codes: {len(c['code'])}",
                f"      heavy: {sum(d['kind'] == 'concept' and d['meta'].get('weight') == 'heavy' for d in c['docs'])}",
                f"      units: {yaml_str(preview)}",
            ]
    DATA_FILE.write_text("\n".join(out) + "\n", encoding="utf-8")


def write_studies_page(courses):
    total = sum(len(c["docs"]) for c in courses)
    STUDIES_PAGE.write_text(f"""---
layout: category-index
title: Studies
category: studies
permalink: /studies/
notes_assets: true
nav_always: true
geo: confetti
geo_clear: none
eyebrow: "{len(courses)} courses · {total} notes"
---
<!-- Generated by scripts/vault_export.py; the course list comes from _data/study_courses.yml. -->
<div class="study-hub">
{{% for track in site.data.study_courses %}}
  <h2 class="study-track__title">{{{{ track.track }}}}</h2>
  {{% for c in track.courses %}}
  <a class="course-row" href="{{{{ c.url | relative_url }}}}" data-course="{{{{ c.slug }}}}" data-scene="{{{{ c.slug }}}}">
    <span class="course-row__art"><canvas data-motif="{{{{ c.slug }}}}" aria-hidden="true"></canvas></span>
    <span class="course-row__text">
      <span class="course-row__kicker">{{{{ track.track }}}}</span>
      <span class="course-row__name">{{{{ c.name }}}}</span>
      {{% if c.units != "" %}}<span class="course-row__units">{{{{ c.units }}}}</span>{{% endif %}}
      <span class="course-row__meta"><span>개념 <b>{{{{ c.concepts }}}}</b></span><span>연습 <b>{{{{ c.practices }}}}</b></span><span>코드 <b>{{{{ c.codes }}}}</b></span></span>
      <span class="course-row__go">로드맵 보기 &rarr;</span>
    </span>
  </a>
  {{% endfor %}}
{{% endfor %}}
</div>
""", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--vault", required=True, type=Path, help="vault folder that holds 홈.md")
    args = ap.parse_args()
    vault = args.vault.expanduser().resolve()
    if not (vault / "홈.md").exists():
        sys.exit(f"{vault} does not look like the study vault (no 홈.md)")

    courses, linker = export(vault)
    docs = sum(len(c["docs"]) for c in courses)
    code = sum(len(c["code"]) for c in courses)
    print(f"exported {len(courses)} courses, {docs} notes, {code} code pages -> {NOTES_DIR.relative_to(ROOT)}/")
    if linker.unresolved:
        print(f"{len(linker.unresolved)} link target(s) not found (rendered as plain text):")
        for target, sources in sorted(linker.unresolved.items())[:30]:
            print(f"  {target}  <- {sorted(sources)[0]}")
    for w in warnings:
        print("warning:", w)


if __name__ == "__main__":
    main()
