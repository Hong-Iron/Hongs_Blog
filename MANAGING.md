# Managing this blog

A day-to-day manual for adding content and keeping the site running. For repo
setup / architecture, see `README.md`.

## The mental model

Everything on the live site — https://hong-iron.github.io/Hongs_Blog/ — comes
from Markdown and YAML files in this repo. There's no database and no admin
panel to log into. **Pushing a commit to `master` *is* the publish step** —
GitHub rebuilds the site automatically within about a minute of every push.

You can edit those files two ways:

| Method | Best for |
|---|---|
| `scripts/blog.py` (CLI) | Fastest, scaffolds files correctly, handles slugs/uploads/nav wiring for you |
| GitHub.com in the browser | No install, works from any device, good for quick edits or posting from your phone |

Both produce the exact same files — pick whichever's convenient at the time.

---

## Posts (writings / studies / any category)

**CLI:**
```
python3 scripts/blog.py post new "My Trip to the Mountains" \
  --category writings --tags travel,film \
  --excerpt "A short teaser." --cover ~/Pictures/trip-cover.jpg
```

**GUI:** In the repo, open `_posts/` → **Add file → Create new file**. Name it
`_posts/YYYY-MM-DD-your-slug.md` (that exact date-prefixed pattern is
required — it's how Jekyll recognizes a post), then paste:

```yaml
---
title: "My Trip to the Mountains"
subtitle: null
date: 2026-07-19 09:00:00 +0900
categories: [writings]
tags: ["travel", "film"]
excerpt: "A short teaser shown on cards and listing pages."
cover: null
---

Write the post body here in Markdown.
```

Commit straight to `master`. To add a cover image via GUI: upload it into
`assets/img/uploads/` first (**Add file → Upload files**), then point
`cover:` at `/assets/img/uploads/whatever.jpg`.

> **Don't backdate the `date:` field into the future**, even by a few
> minutes — Jekyll silently excludes posts dated after the build runs. See
> Troubleshooting below for why that's worth avoiding.

---

### Importing Pensées from the Naver blog

Posts written on blog.naver.com/red_iron04 can be pulled in as-is:

```
python3 scripts/naver_import.py 224431571808=i-am-israel-too 224426652152=tenacity \
  --meta meta.json          # optional: {"<slug>": {"tags": [...], "excerpt": "..."}}
python3 scripts/naver_import.py --dry-run 224431571808=i-am-israel-too   # preview only
```

The number is the post's `logNo` (the last part of its URL). The script
keeps the post's paragraphs, bold text, headings, quotes (with "— cite")
and dividers, downloads its images to `assets/img/uploads/<slug>-N.jpg`,
uses an opening image as the cover, and records the source URL in an
`original:` field. Without `--meta`, fill in `tags:` and `excerpt:` by hand.

---

## Projects (portfolio)

**CLI:**
```
python3 scripts/blog.py project new "Portfolio Site" \
  --role "Designer & Developer" --stack "Jekyll,CSS,Python" \
  --status Active --repo https://github.com/you/repo --demo https://you.dev \
  --summary "One sentence for the project card."
```

**GUI:** new file under `_projects/your-slug.md`:

```yaml
---
title: "Portfolio Site"
subtitle: null
date: 2026-07-19
role: "Designer & Developer"
stack: ["Jekyll", "CSS", "Python"]
status: "Active"
repo: "https://github.com/you/repo"
demo: "https://you.dev"
summary: "One sentence for the project card."
cover: null
gallery: []
tags: []
---

Write the case study here.
```

Add a photo gallery by listing image paths under `gallery:`, e.g.
`gallery: ["/assets/img/uploads/shot1.jpg", "/assets/img/uploads/shot2.jpg"]`.

---

## Categories

`writings` and `studies` exist by default. Add more any time (e.g. a
dedicated `photography` category):

**CLI:**
```
python3 scripts/blog.py category add photography "Photography" \
  --accent moss --description "Frames worth keeping."
```
This appends to `_data/categories.yml` **and** generates `photography.html`
(the listing page) for you. `--accent` must be one of `rust`, `ochre`,
`moss`, `plum`, `inkblue`.

**GUI:** two manual steps —
1. Edit `_data/categories.yml`, copy the `studies` block and change it:
   ```yaml
   - slug: photography
     name: Photography
     group: writing
     accent: moss
     description: "Frames worth keeping."
   ```
2. Create `photography.html` in the repo root:
   ```yaml
   ---
   layout: category-index
   title: Photography
   category: photography
   permalink: /photography/
   ---
   ```

Either way, it shows up in the nav automatically on the next build — no
other file needs to change.

```
python3 scripts/blog.py category list     # see what exists
```

---

## Study notes (exported from the Obsidian vault)

Everything under https://hong-iron.github.io/Hongs_Blog/studies/ is generated
from the study vault — don't edit those files by hand, edit the vault and
re-export:

```
python3 scripts/vault_export.py --vault ~/Documents/VAULT/공부
python3 scripts/blog.py sync -m "studies: re-export vault"
```

The export wipes and rewrites `_notes/`, `_data/study_courses.yml` and
`studies.html`. It publishes only the notes written in the vault (each
course's roadmap, `3.개념집`, `4.연습문제` and their code); lecture PDFs,
slide captures, recordings, `2.필기노트` and `_시스템` stay private. To keep
anything else private, add its vault path to `EXCLUDE` at the top of
`scripts/vault_export.py`; to add a course, add it to `TRACKS` there.

The script converts Obsidian syntax for kramdown: wikilinks become site
links, callouts become styled boxes (folded ones become click-to-open, so
quiz answers stay hidden), `$…$` math is rendered by MathJax, and ` ```mermaid `
blocks are drawn by Mermaid. It prints any link it couldn't resolve.

---

## Geometry backgrounds, scenes and course themes

Every page has a canvas of shapes behind it, drawn by `assets/js/geo.js`
(styles in `assets/css/geo.css`).

- **Which drawing a page gets:** the body's `data-geo`. Defaults: study
  notes use their course's motif, Pensées get rose windows, projects get
  drafting paper, everything else gets floating shapes. Override with
  `geo: <name>` in a page's front matter.
- **Reading pages keep the text clear:** `geo_clear` (set in the layouts)
  is half the width of the text column; the shapes only show in the margins
  and the header. `geo_clear: none` gives the full canvas (home, About,
  Studies hub).
- **Scenes:** a section with `data-scene="paper|linen|sage|night|<course slug>"`
  blends into its neighbours in proportion to scroll position: colours and
  the floating shapes morph continuously (every shape is a 40-point outline,
  so a circle can melt into a star). Scene colours and shape sets are
  `SCENES` / `COURSE_SHAPES` in `geo.js`. On the home page, pointing at a
  course tile morphs the field into that course's shapes.
- **Course themes:** colours are the `[data-course="…"]` rules in `geo.css`;
  each course's scroll-driven drawing is the matching entry in `MOTIFS` in
  `geo.js`. A new course needs both, plus a `TRACKS` entry in
  `scripts/vault_export.py`.
- Visitors with "reduce motion" turned on get a still picture.

## Link previews (og:image)

What shows when someone pastes a link into KakaoTalk, iMessage, Slack, etc.
`jekyll-seo-tag` writes it from each page's `image:`.

- **Site card** `assets/img/og/site.png`: the fallback for every page
  (set in `_config.yml` → `defaults`).
- **Course cards** `assets/img/og/<course-slug>.png`: every note in that
  course, via a `_notes/<slug>` default in `_config.yml`.
- **Posts and projects** with a picture set `image:` in their front matter
  (the cover, or the first image). `scripts/naver_import.py` adds it.
- Regenerate the cards with `python3 scripts/og_cards.py` (needs headless
  Chrome or Chromium; set `CHROME=` if it isn't found). A new course needs
  its card and a `_notes/<slug>` default.
- Messengers cache previews. KakaoTalk keeps an old one until you clear it
  at developers.kakao.com → Tools → Debugger (공유 디버거).

## 홍철 (the corner robot)

The pixel face in the bottom-right corner opens a speech bubble with three
buttons: 질문하기 (preset questions), 대화하기 (conversation threads where the
visitor picks what to say and each answer offers the next lines), and
아무 얘기나 (a random line, no repeats until the pool runs out).

- **What it says:** `_data/robot/<course-slug>.yml`, plus `default.yml` for
  other pages; on course pages the course's lines mix with the default ones.
  The format is in `_data/robot/README.md`. The data reaches the browser as
  `assets/robot-data.json`, fetched the first time the bubble opens.
  `{concepts}`, `{heavy}` etc. are filled from the course numbers.
- **The face:** a 24 × 23 pixel grid in `scripts/robot_face.py`; edit the
  grid and run `python3 scripts/robot_face.py` to rewrite
  `_includes/robot-face.svg`. Blink and talk frames are swapped in
  `assets/css/robot.css`.
- The bubble text uses the Galmuri pixel font from jsDelivr (OFL), which
  downloads only when the bubble first opens.

---

## Notifications (site-wide banner)

**CLI:**
```
python3 scripts/blog.py notify add "New project just went live" \
  --url /projects/ --type success --days 7
python3 scripts/blog.py notify list
python3 scripts/blog.py notify remove <id>
```

**GUI:** edit `_data/notifications.yml` directly, following the format
already in the file (each notice needs `id`, `message`, `url`, `type`,
`start_date`, `end_date`, `active`).

A notice shows while `active: true` and today is within
`[start_date, end_date]`. This is checked **at build time**, so a notice
appears/disappears on the next push — not live in a visitor's browser.
Visitors can also dismiss a banner themselves (remembered via their
browser's `localStorage`).

---

## Background & visual effects

```
python3 scripts/blog.py theme show
python3 scripts/blog.py theme background midnight   # paper-cream | linen-gray | midnight
python3 scripts/blog.py theme effect grain off       # grain | scroll_reveal | link_underline_draw | dismissible_banner
```

Or edit `_data/theme.yml` directly in the GUI — it's a small, commented
file. Backgrounds are full presets (paper texture + accent color bundled
together); effects are independent on/off toggles layered on top.

---

## Publishing

```
python3 scripts/blog.py list posts
python3 scripts/blog.py list projects
python3 scripts/blog.py publish -m "add trip writeup"          # commit only
python3 scripts/blog.py sync -m "add trip writeup"             # commit + push
```

`sync` (or `publish --push`) pushes to `master`, which is what triggers the
rebuild. Via the GUI, committing directly to `master` does the same thing —
there's nothing extra to run.

---

## Checking whether it actually deployed

GitHub's Pages build can fail silently from your side — you won't see an
error unless you look. After pushing:

1. Go to the repo → **Actions** tab. You should see a run with a green
   check within ~1–2 minutes. Click it to see `build` / `deploy` / logs if
   something's red.
2. Or: repo → **Settings → Pages** — shows the current build status and the
   live URL.
3. Or just load https://hong-iron.github.io/Hongs_Blog/ and check the page
   actually changed (hard-refresh if it looks stale).

---

## Troubleshooting

**I pushed but the site didn't update at all — not even old pages.**
Jekyll aborts the *entire* build if any single page throws a template
error — it's all-or-nothing, so one bad post can take down pages that
didn't change. Check the Actions tab (above) for the actual error instead
of guessing. The most common cause we've hit:

**A post doesn't show up on its category page / caused a build failure.**
Check its `date:` isn't in the future relative to when GitHub builds it
(a few minutes ahead is enough to trigger this) — Jekyll silently drops
future-dated posts from the build.

**Local preview isn't required to publish.** GitHub builds the live site
for you on every push. Only set up local preview if you want to check a
change *before* pushing it:
```
sudo pacman -S ruby ruby-bundler   # Arch Linux, one-time
cd /home/red_iron/CodeBase/blog
bundle install
python3 scripts/blog.py serve      # wraps: bundle exec jekyll serve --livereload
```

---

## File map

```
_data/categories.yml      category registry — drives nav + listing pages
_data/notifications.yml   banner entries
_data/theme.yml           active background preset + effect toggles
_posts/                   writings & studies (any category, via front matter)
_notes/                   study notes — generated by scripts/vault_export.py
_data/study_courses.yml   course list on /studies/ — generated, don't edit
_projects/                portfolio case studies
assets/img/uploads/       cover/gallery images
scripts/blog.py           the CLI described throughout this file
scripts/vault_export.py   Obsidian vault -> /studies/ exporter
assets/js/geo.js          background shapes, scenes, course motifs
assets/css/geo.css        course colours, home/About components, hub sections
_data/robot.yml           the robot's questions and lines
scripts/robot_face.py     pixel face -> _includes/robot-face.svg
scripts/naver_import.py   Naver blog post -> _posts/ (Pensées)
```
