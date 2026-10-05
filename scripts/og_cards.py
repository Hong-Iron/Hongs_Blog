#!/usr/bin/env python3
"""
Link-preview images (og:image) for the site.

    python3 scripts/og_cards.py            # all cards
    python3 scripts/og_cards.py site       # just the site card
    python3 scripts/og_cards.py algorithms # just one course

Writes 1200 x 630 PNGs to assets/img/og/:
  site.png      the default card: logo, name, the three sections
  <slug>.png    one per course in _data/study_courses.yml, with that
                course's colours and its moving drawing from geo.js

Each card is an HTML page rendered by headless Chrome/Chromium. Set CHROME
to the browser binary if it isn't found on its own. Re-run after adding a
course (and add its `image` default in _config.yml).
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "og"
W, H = 1200, 630

FONTS = ("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;"
         "1,9..144,500&family=Inter:wght@500;600&family=Nanum+Myeongjo:wght@700;800&display=block")

BASE_CSS = """
:root { --bg: #f5efe4; --card: #faf6ee; --ink: #221f1a; --ink-muted: #6b6255; --rule: #d9cdb4;
        --rust: #b0432c; --ochre: #866016; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: %dpx; height: %dpx; overflow: hidden; }
body { position: relative; background: var(--bg); color: var(--ink);
       font-family: "Inter", "Nanum Myeongjo", sans-serif; -webkit-font-smoothing: antialiased; }
.dots { position: absolute; inset: 0;
        background: radial-gradient(circle at 1px 1px, rgba(34,31,26,.13) 1.3px, transparent 1.5px) 0 0 / 28px 28px; }
.brand { display: flex; align-items: center; gap: 16px; }
.brand svg { display: block; }
.brand b { font-family: "Fraunces", serif; font-weight: 600; letter-spacing: -0.01em; }
.url { font-size: 22px; color: var(--ink-muted); letter-spacing: 0.01em; }
""" % (W, H)

LOGO = ('<svg viewBox="0 0 64 64" width="{s}" height="{s}">'
        '<rect x="7" y="8" width="14" height="48" rx="2" fill="#221f1a"/>'
        '<rect x="43" y="8" width="14" height="48" rx="2" fill="#221f1a"/>'
        '<circle cx="32" cy="32" r="12" fill="#b0432c"/>'
        '<path d="M43 8h14v14z" fill="#866016"/></svg>')

# the home page's three doors
DOOR_GLYPHS = {
    "projects": ('#2f4858', '<rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3"/>'
                 '<path d="M5 35L35 5" stroke="currentColor" stroke-width="2"/><circle cx="27" cy="27" r="5" fill="currentColor"/>'),
    "studies": ('#59713f', '<path d="M20 4L37 34H3z" fill="currentColor" opacity="0.9"/><circle cx="20" cy="24" r="6.5" fill="#f5efe4"/>'),
    "pensees": ('#6c4a6e', '<path d="M7 36V19a13 13 0 0 1 26 0v17z" fill="none" stroke="currentColor" stroke-width="3"/>'
                '<circle cx="20" cy="19" r="4" fill="currentColor"/><path d="M20 23v13" stroke="currentColor" stroke-width="2"/>'),
}
CONFETTI = {
    "tri": '<path d="M20 5L36 33H4z" fill="currentColor"/>',
    "square": '<rect x="7" y="7" width="26" height="26" fill="currentColor"/>',
    "semi": '<path d="M4 24a16 16 0 0 1 32 0z" fill="currentColor"/>',
    "circle": '<circle cx="20" cy="20" r="15" fill="currentColor"/>',
}


def glyph(inner, color, size, x, y, rot=0, opacity=1.0):
    return (f'<svg viewBox="0 0 40 40" width="{size}" height="{size}" style="position:absolute;left:{x}px;top:{y}px;'
            f'color:{color};opacity:{opacity};transform:rotate({rot}deg)">{inner}</svg>')


def site_card():
    shapes = [
        glyph(DOOR_GLYPHS["projects"][1], DOOR_GLYPHS["projects"][0], 150, 820, 120),
        glyph(DOOR_GLYPHS["studies"][1], DOOR_GLYPHS["studies"][0], 170, 930, 290),
        glyph(DOOR_GLYPHS["pensees"][1], DOOR_GLYPHS["pensees"][0], 150, 770, 360),
        glyph(CONFETTI["semi"], "#b0432c", 46, 1060, 140, 18, 0.75),
        glyph(CONFETTI["square"], "#866016", 34, 740, 270, 24, 0.7),
        glyph(CONFETTI["circle"], "#1f6874", 30, 1110, 500, 0, 0.6),
        glyph(CONFETTI["tri"], "#9b3567", 36, 1000, 70, -14, 0.6),
        glyph(CONFETTI["circle"], "#c9952e", 22, 700, 150, 0, 0.7),
        glyph(CONFETTI["semi"], "#3f4f9a", 32, 930, 520, -30, 0.55),
    ]
    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="{FONTS}"><style>{BASE_CSS}
.left {{ position: absolute; left: 88px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 26px; }}
.brand b {{ font-size: 104px; line-height: 1; }}
.tagline {{ font-family: "Nanum Myeongjo", serif; font-weight: 800; font-size: 44px; letter-spacing: -0.01em; }}
.tagline i {{ font-style: normal; color: var(--rust); margin: 0 0.25em; }}
</style></head><body>
<div class="dots"></div>
{''.join(shapes)}
<div class="left">
  <div class="brand">{LOGO.format(s=112)}<b>Hong-Iron</b></div>
  <div class="tagline">프로젝트<i>·</i>지식 DB<i>·</i>나의 팡세</div>
  <div class="url">hong-iron.github.io/Hongs_Blog</div>
</div>
</body></html>"""


def course_colors():
    css = (ROOT / "assets" / "css" / "geo.css").read_text(encoding="utf-8")
    out = {}
    for slug, a, b in re.findall(r'\[data-course="([^"]+)"\]\s*\{\s*--course:\s*(#[0-9a-fA-F]+);\s*--course-2:\s*(#[0-9a-fA-F]+);', css):
        out[slug] = (a, b)
    return out


def courses():
    """Minimal reader for the generated _data/study_courses.yml."""
    out, track, cur = [], None, None
    for line in (ROOT / "_data" / "study_courses.yml").read_text(encoding="utf-8").splitlines():
        m = re.match(r'- track:\s*"(.*)"', line)
        if m:
            track = m.group(1)
            continue
        m = re.match(r'\s+- name:\s*"(.*)"', line)
        if m:
            cur = {"track": track, "name": m.group(1)}
            out.append(cur)
            continue
        m = re.match(r'\s+(\w+):\s*"?(.*?)"?$', line)
        if m and cur is not None:
            cur[m.group(1)] = m.group(2)
    return out


def course_card(c, colors):
    a, b = colors.get(c["slug"], ("#b0432c", "#2f4858"))
    kicker = "지식 DB" if c["track"] == c["name"] else f"지식 DB · {c['track']}"
    units = c.get("units", "")
    geo_js = (ROOT / "assets" / "js" / "geo.js").as_uri()
    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="{FONTS}"><style>{BASE_CSS}
body {{ background: color-mix(in srgb, {a} 7%, #f5efe4); }}
.left {{ position: absolute; left: 80px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; }}
.kicker {{ display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 600; letter-spacing: 0.06em; color: {a}; font-family: "Inter", "Nanum Myeongjo", sans-serif; }}
.kicker::before {{ content: ""; width: 20px; height: 20px; border-radius: 3px; background: {a}; }}
h1 {{ margin-top: 18px; font-family: "Nanum Myeongjo", serif; font-weight: 800; font-size: {92 if len(c['name']) <= 6 else 72}px; line-height: 1.12; letter-spacing: -0.02em; word-break: keep-all; }}
.units {{ margin-top: 22px; font-family: "Nanum Myeongjo", serif; font-weight: 700; font-size: 25px; line-height: 1.55; color: var(--ink-muted); word-break: keep-all; }}
.meta {{ margin-top: 22px; display: flex; gap: 26px; font-size: 22px; color: var(--ink-muted); font-family: "Inter", "Nanum Myeongjo", sans-serif; }}
.meta b {{ color: var(--ink); font-weight: 600; }}
.brand {{ position: absolute; left: 80px; bottom: 52px; gap: 12px; }}
.brand b {{ font-size: 30px; }}
.art {{ position: absolute; right: 72px; top: 105px; width: 460px; height: 420px; border: 1.5px solid var(--rule); border-radius: 18px;
        background: color-mix(in srgb, {a} 6%, var(--card)); overflow: hidden; box-shadow: 0 30px 60px -38px {a}; }}
.art a, .art canvas {{ display: block; width: 100%; height: 100%; }}
</style></head><body>
<div class="dots" style="opacity:.6"></div>
<div class="left">
  <div class="kicker">{escape(kicker)}</div>
  <h1>{escape(c['name'])}</h1>
  {f'<p class="units">{escape(units)}</p>' if units else ''}
  <p class="meta"><span>개념 <b>{c.get('concepts', '')}</b></span><span>연습 <b>{c.get('practices', '')}</b></span><span>코드 <b>{c.get('codes', '')}</b></span></p>
</div>
<div class="brand">{LOGO.format(s=34)}<b>Hong-Iron</b></div>
<div class="art" data-course="{c['slug']}" style="--course:{a};--course-2:{b};--geo-1:{a};--geo-2:{b};--geo-3:#2f4858;--geo-4:#c9952e">
  <a><canvas data-motif="{c['slug']}"></canvas></a>
</div>
<script src="{geo_js}"></script>
<script>
  // show the drawing in its finished (hover) state
  setTimeout(function () {{ document.querySelector('.art a').dispatchEvent(new Event('pointerenter')); }}, 300);
</script>
</body></html>"""


def find_chrome():
    cands = [os.environ.get("CHROME"), "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
             "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
    for c in cands:
        if not c:
            continue
        p = shutil.which(c) or (c if Path(c).exists() else None)
        if p:
            return p
    sys.exit("headless Chrome/Chromium not found; set CHROME=/path/to/browser")


def shoot(chrome, html, out):
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "card.html"
        page.write_text(html, encoding="utf-8")
        subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--allow-file-access-from-files", f"--window-size={W},{H}",
                        "--force-device-scale-factor=1", "--virtual-time-budget=6000",
                        f"--screenshot={out}", page.as_uri()],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"wrote {out.relative_to(ROOT)}")


def main():
    want = set(sys.argv[1:])
    chrome = find_chrome()
    OUT.mkdir(parents=True, exist_ok=True)
    if not want or "site" in want:
        shoot(chrome, site_card(), OUT / "site.png")
    colors = course_colors()
    for c in courses():
        if not want or c["slug"] in want:
            shoot(chrome, course_card(c, colors), OUT / f"{c['slug']}.png")


if __name__ == "__main__":
    main()
