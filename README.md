# Hong-Iron — personal site

Jekyll site for projects (portfolio), writings (hobbies), and studies.
Editorial/magazine design: paper-textured background, serif display type,
single-column reading layout with a drop cap, magazine-style card grids.

Hosted on GitHub Pages, built natively by GitHub on every push to `main` —
no CI configuration required.

## One-time setup: enable GitHub Pages

1. Push this repo to `main` on GitHub (see "Publishing" below).
2. On GitHub: **Settings → Pages → Build and deployment → Source** → "Deploy
   from a branch" → Branch: `main`, folder `/ (root)` → Save.
3. The site will be live at `https://hong-iron.github.io/Hongs_Blog/`
   within a couple of minutes. `_config.yml` already has `baseurl` set to
   match this repo name — if you ever rename the repo, update `baseurl`
   to match.

## Everyday use: `scripts/blog.py`

A single stdlib-only Python 3 script is the whole "admin panel." It edits
the same Markdown/YAML files Jekyll reads — there's no database and no
build step to run locally; GitHub does the building.

```
python3 scripts/blog.py --help
python3 scripts/blog.py <command> --help
```

### Posts (writings / studies / any category you add)

```
python3 scripts/blog.py post new "My Trip to the Mountains" \
  --category writings --tags travel,film --excerpt "A short teaser." \
  --cover ~/Pictures/trip-cover.jpg
```

Creates `_posts/YYYY-MM-DD-my-trip-to-the-mountains.md` with front matter
filled in and the cover image copied into `assets/img/uploads/`. Open the
file and write the post body in Markdown below the `---`.

### Projects (portfolio)

```
python3 scripts/blog.py project new "Portfolio Site" \
  --role "Designer & Developer" --stack "Jekyll,CSS,Python" \
  --status Active --repo https://github.com/you/repo --demo https://you.dev \
  --summary "One sentence for the project card."
```

Creates `_projects/portfolio-site.md`. Add a photo gallery by listing image
paths under `gallery:` in the front matter.

### Categories

`writings` and `studies` exist by default. Add more (e.g. a dedicated
hobby category) any time:

```
python3 scripts/blog.py category add photography "Photography" --accent moss \
  --description "Frames worth keeping."
```

This appends to `_data/categories.yml`, generates `photography.html`
(the listing page), and the nav updates automatically on the next build.
`--accent` must be one of `rust`, `ochre`, `moss`, `plum`, `inkblue`.

```
python3 scripts/blog.py category list
```

### Notifications (site-wide banner)

```
python3 scripts/blog.py notify add "New project just went live" \
  --url /projects/ --type success --days 7
python3 scripts/blog.py notify list
python3 scripts/blog.py notify remove <id>
```

A notice is live while `active: true` and today is within
`[start_date, end_date]`. This is evaluated when the site builds, so a
notice appears/disappears on the next push, not live in visitors' browsers.
Visitors can dismiss a banner themselves (stored in their `localStorage`).

### Background & effects

```
python3 scripts/blog.py theme show
python3 scripts/blog.py theme background midnight   # paper-cream | linen-gray | midnight
python3 scripts/blog.py theme effect grain off       # grain | scroll_reveal | link_underline_draw | dismissible_banner
```

Backgrounds are full presets (paper texture + accent color together, see
`assets/css/base.css`), so switching one swaps the whole mood in one
command. Effects are independent toggles layered on top.

### Publishing

```
python3 scripts/blog.py list posts
python3 scripts/blog.py list projects
python3 scripts/blog.py publish -m "add trip writeup"     # commit only
python3 scripts/blog.py publish -m "add trip writeup" --push
python3 scripts/blog.py sync -m "add trip writeup"        # commit + push
```

`sync` / `publish --push` push straight to `main`, which is what triggers
GitHub Pages to rebuild — that's the entire deploy step.

### Local preview (optional)

GitHub builds the live site for you, so this is only needed if you want to
check a change before pushing. Requires Ruby (not installed by default):

```
sudo pacman -S ruby ruby-bundler   # Arch Linux, one-time
cd /home/red_iron/CodeBase/blog
bundle install
python3 scripts/blog.py serve      # wraps: bundle exec jekyll serve --livereload
```

## Structure

```
_config.yml          site config, baseurl, collections, permalinks
_layouts/            default (shell), post, project, category-index
_includes/            head, nav, footer, notification-banner, post/project cards
_data/
  categories.yml      category registry (drives nav + listing pages)
  notifications.yml   banner entries
  theme.yml           active background preset + effect toggles
_posts/               writings & studies (any category via front matter)
_projects/             portfolio case studies (Jekyll collection)
assets/css/           base (tokens/type), layout, components, effects
assets/js/             scroll-reveal, notification dismiss
assets/img/uploads/    cover images copied in by the CLI
scripts/blog.py        the CLI described above
"Templates and references/"   original design references (excluded from the build)
```
