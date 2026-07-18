#!/usr/bin/env python3
"""
Content management CLI for this Jekyll site.

Stdlib only — no pip install required. Run `python3 scripts/blog.py --help`
or `python3 scripts/blog.py <command> --help` for details on any command.
"""

import argparse
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "_posts"
PROJECTS_DIR = ROOT / "_projects"
DATA_DIR = ROOT / "_data"
CATEGORIES_FILE = DATA_DIR / "categories.yml"
NOTIFICATIONS_FILE = DATA_DIR / "notifications.yml"
THEME_FILE = DATA_DIR / "theme.yml"
UPLOADS_DIR = ROOT / "assets" / "img" / "uploads"

VALID_BACKGROUNDS = ["paper-cream", "linen-gray", "midnight"]
VALID_ACCENTS = ["rust", "ochre", "moss", "plum", "inkblue"]
VALID_EFFECTS = ["grain", "scroll_reveal", "link_underline_draw", "dismissible_banner"]
VALID_NOTICE_TYPES = ["info", "success", "warning"]


# ---------------------------------------------------------------------------
# small hand-rolled YAML helpers
#
# These files are only ever written by this script, and every value we write
# stays on a single line (no ">-" block scalars) specifically so this parser
# doesn't need to be a real YAML implementation.
# ---------------------------------------------------------------------------

def slugify(text):
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "untitled"


def yaml_str(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    escaped = str(value).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def yaml_list(items):
    return "[" + ", ".join(yaml_str(i) for i in items) + "]"


def parse_scalar(v):
    v = v.strip()
    if v in ("", "null", "~"):
        return None
    if v in ("true", "True"):
        return True
    if v in ("false", "False"):
        return False
    if len(v) >= 2 and v[0] == '"' and v[-1] == '"':
        return v[1:-1].replace('\\"', '"').replace("\\\\", "\\")
    if len(v) >= 2 and v[0] == "[" and v[-1] == "]":
        inner = v[1:-1].strip()
        return [parse_scalar(p) for p in inner.split(",")] if inner else []
    return v


def parse_yaml_list(text):
    """Parse a flat list-of-dicts YAML file into a list of plain dicts."""
    items = []
    current = None
    for raw in text.splitlines():
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("- "):
            if current is not None:
                items.append(current)
            current = {}
            rest = stripped[2:]
            if ":" in rest:
                k, v = rest.split(":", 1)
                current[k.strip()] = parse_scalar(v)
        elif ":" in stripped and current is not None:
            k, v = stripped.split(":", 1)
            current[k.strip()] = parse_scalar(v)
    if current is not None:
        items.append(current)
    return items


def read_front_matter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    result = {}
    for line in text[3:end].splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        k, v = line.split(":", 1)
        result[k.strip()] = parse_scalar(v)
    return result


def copy_upload(local_path, base_slug):
    src = Path(local_path).expanduser()
    if not src.exists():
        sys.exit(f"error: cover image not found: {local_path}")
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    dest = UPLOADS_DIR / f"{base_slug}{src.suffix.lower()}"
    counter = 2
    while dest.exists():
        dest = UPLOADS_DIR / f"{base_slug}-{counter}{src.suffix.lower()}"
        counter += 1
    shutil.copy2(src, dest)
    return "/" + str(dest.relative_to(ROOT)).replace("\\", "/")


# ---------------------------------------------------------------------------
# posts / projects
# ---------------------------------------------------------------------------

def read_categories():
    if not CATEGORIES_FILE.exists():
        return []
    return parse_yaml_list(CATEGORIES_FILE.read_text(encoding="utf-8"))


def cmd_post_new(args):
    known = {c.get("slug") for c in read_categories()}
    if args.category not in known:
        print(
            f"warning: '{args.category}' isn't in _data/categories.yml yet — "
            f"the post is still created, but it won't have a listing page until "
            f"you run: python3 scripts/blog.py category add {args.category} \"Display Name\"",
            file=sys.stderr,
        )

    date = datetime.now().astimezone()
    slug = slugify(args.title)
    path = POSTS_DIR / f"{date:%Y-%m-%d}-{slug}.md"
    if path.exists():
        sys.exit(f"error: {path} already exists")

    cover = copy_upload(args.cover, f"{slug}-cover") if args.cover else None
    tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    lines = [
        "---",
        f"title: {yaml_str(args.title)}",
        f"subtitle: {yaml_str(args.subtitle)}",
        f"date: {date:%Y-%m-%d %H:%M:%S %z}",
        f"categories: [{args.category}]",
        f"tags: {yaml_list(tags)}",
        f"excerpt: {yaml_str(args.excerpt)}",
        f"cover: {yaml_str(cover)}",
        "---",
        "",
        "Write your post here.",
        "",
    ]
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"created {path.relative_to(ROOT)}")


def cmd_project_new(args):
    date = datetime.now()
    slug = slugify(args.title)
    path = PROJECTS_DIR / f"{slug}.md"
    if path.exists():
        sys.exit(f"error: {path} already exists")

    cover = copy_upload(args.cover, f"{slug}-cover") if args.cover else None
    stack = [s.strip() for s in args.stack.split(",") if s.strip()]
    tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    lines = [
        "---",
        f"title: {yaml_str(args.title)}",
        f"subtitle: {yaml_str(args.subtitle)}",
        f"date: {date:%Y-%m-%d}",
        f"role: {yaml_str(args.role)}",
        f"stack: {yaml_list(stack)}",
        f"status: {yaml_str(args.status)}",
        f"repo: {yaml_str(args.repo)}",
        f"demo: {yaml_str(args.demo)}",
        f"summary: {yaml_str(args.summary)}",
        f"cover: {yaml_str(cover)}",
        "gallery: []",
        f"tags: {yaml_list(tags)}",
        "---",
        "",
        "Write your case study here.",
        "",
    ]
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"created {path.relative_to(ROOT)}")


def cmd_list(args):
    if args.what == "posts":
        for f in sorted(POSTS_DIR.glob("*.md"), reverse=True):
            fm = read_front_matter(f)
            cats = ",".join(fm.get("categories") or [])
            print(f"{f.name:<42} [{cats:<10}] {fm.get('title', '')}")
    else:
        for f in sorted(PROJECTS_DIR.glob("*.md")):
            fm = read_front_matter(f)
            print(f"{f.name:<32} {str(fm.get('status', '')):<10} {fm.get('title', '')}")


# ---------------------------------------------------------------------------
# categories
# ---------------------------------------------------------------------------

def cmd_category_add(args):
    existing = read_categories()
    if any(c.get("slug") == args.slug for c in existing):
        sys.exit(f"error: category '{args.slug}' already exists")

    block = "\n".join([
        "",
        f"- slug: {args.slug}",
        f"  name: {yaml_str(args.name)}",
        "  group: writing",
        f"  accent: {args.accent}",
        f"  description: {yaml_str(args.description)}",
        "",
    ])
    with CATEGORIES_FILE.open("a", encoding="utf-8") as f:
        f.write(block)
    print(f"added category '{args.slug}' to {CATEGORIES_FILE.relative_to(ROOT)}")

    page_path = ROOT / f"{args.slug}.html"
    if not page_path.exists():
        page_path.write_text(
            "\n".join([
                "---",
                "layout: category-index",
                f"title: {yaml_str(args.name)}",
                f"category: {args.slug}",
                f"permalink: /{args.slug}/",
                "---",
                "",
            ]),
            encoding="utf-8",
        )
        print(f"created {page_path.relative_to(ROOT)}")
    print("It will show up in the nav and get posts automatically on the next build.")
    print(f'Add posts to it with: post new "Title" --category {args.slug}')


def cmd_category_list(args):
    cats = read_categories()
    if not cats:
        print("No categories yet.")
        return
    for c in cats:
        print(f"{str(c.get('slug')):<14} {str(c.get('name')):<18} accent={c.get('accent'):<9} {c.get('description', '')}")


# ---------------------------------------------------------------------------
# notifications
# ---------------------------------------------------------------------------

NOTIFICATIONS_HEADER = """\
# Site-wide announcement banner entries.
# Managed via: python3 scripts/blog.py notify add|list|remove
#
# A notice shows when active: true AND today falls within
# [start_date, end_date] (both YYYY-MM-DD, inclusive). Evaluated at build
# time, so it updates on the next push/rebuild — not live in the browser.
"""


def read_notifications():
    if not NOTIFICATIONS_FILE.exists():
        return []
    return parse_yaml_list(NOTIFICATIONS_FILE.read_text(encoding="utf-8"))


def write_notifications(notes):
    lines = [NOTIFICATIONS_HEADER.rstrip("\n"), ""]
    for n in notes:
        lines += [
            f"- id: {n.get('id')}",
            f"  message: {yaml_str(n.get('message'))}",
            f"  url: {yaml_str(n.get('url'))}",
            f"  type: {n.get('type', 'info')}",
            f"  start_date: {yaml_str(n.get('start_date'))}",
            f"  end_date: {yaml_str(n.get('end_date'))}",
            f"  active: {yaml_str(bool(n.get('active')))}",
            "",
        ]
    NOTIFICATIONS_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")


def cmd_notify_add(args):
    start = args.start or datetime.now().strftime("%Y-%m-%d")
    try:
        start_date = datetime.strptime(start, "%Y-%m-%d")
    except ValueError:
        sys.exit("error: --start must be YYYY-MM-DD")
    end_date = start_date + timedelta(days=args.days)
    notice_id = f"{start_date:%Y-%m-%d}-{slugify(args.message)[:30]}"

    block = "\n".join([
        "",
        f"- id: {notice_id}",
        f"  message: {yaml_str(args.message)}",
        f"  url: {yaml_str(args.url)}",
        f"  type: {args.type}",
        f"  start_date: {yaml_str(f'{start_date:%Y-%m-%d}')}",
        f"  end_date: {yaml_str(f'{end_date:%Y-%m-%d}')}",
        "  active: true",
        "",
    ])
    with NOTIFICATIONS_FILE.open("a", encoding="utf-8") as f:
        f.write(block)
    print(f"added notification '{notice_id}' (live {start_date:%Y-%m-%d} → {end_date:%Y-%m-%d})")


def cmd_notify_list(args):
    notes = read_notifications()
    if not notes:
        print("No notifications.")
        return
    today = datetime.now().strftime("%Y-%m-%d")
    for n in notes:
        live = bool(n.get("active")) and str(n.get("start_date")) <= today <= str(n.get("end_date"))
        flag = "LIVE" if live else "    "
        print(f"[{flag}] {str(n.get('id')):<34} {n.get('start_date')} -> {n.get('end_date')}  {n.get('message')}")


def cmd_notify_remove(args):
    notes = read_notifications()
    remaining = [n for n in notes if n.get("id") != args.id]
    if len(remaining) == len(notes):
        sys.exit(f"error: no notification with id '{args.id}'")
    write_notifications(remaining)
    print(f"removed notification '{args.id}'")


# ---------------------------------------------------------------------------
# theme (background / effects)
# ---------------------------------------------------------------------------

def cmd_theme_background(args):
    text = THEME_FILE.read_text(encoding="utf-8")
    new_text, count = re.subn(r"(?m)^background:\s*\S+", f"background: {args.slug}", text, count=1)
    if count == 0:
        sys.exit("error: could not find 'background:' in _data/theme.yml")
    THEME_FILE.write_text(new_text, encoding="utf-8")
    print(f"background set to '{args.slug}'")


def cmd_theme_effect(args):
    text = THEME_FILE.read_text(encoding="utf-8")
    value = "true" if args.state == "on" else "false"
    pattern = rf"(?m)^(\s+{re.escape(args.name)}:)\s*\S+"
    new_text, count = re.subn(pattern, rf"\g<1> {value}", text, count=1)
    if count == 0:
        sys.exit(f"error: could not find effect '{args.name}' in _data/theme.yml")
    THEME_FILE.write_text(new_text, encoding="utf-8")
    print(f"effect '{args.name}' turned {args.state}")


def cmd_theme_show(args):
    print(THEME_FILE.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# local preview / publish
# ---------------------------------------------------------------------------

def cmd_serve(args):
    if shutil.which("bundle") is None:
        print("Ruby/Bundler isn't installed locally.")
        print("That's only needed for local preview — GitHub Pages builds the")
        print("site itself on every push, so this step is optional.\n")
        print("To preview locally (Arch Linux):")
        print("  sudo pacman -S ruby ruby-bundler")
        print(f"  cd {ROOT}")
        print("  bundle install")
        print("  bundle exec jekyll serve --livereload")
        return
    subprocess.run(["bundle", "exec", "jekyll", "serve", "--livereload"], cwd=ROOT)


def _git(*cmd_args, **kwargs):
    return subprocess.run(["git", *cmd_args], cwd=ROOT, **kwargs)


def _git_commit(message):
    _git("add", "-A", check=True)
    status = _git("status", "--porcelain", capture_output=True, text=True, check=True)
    if not status.stdout.strip():
        print("Nothing to commit.")
        return False
    if not message:
        message = f"Update site — {datetime.now():%Y-%m-%d %H:%M}"
    _git("commit", "-m", message, check=True)
    print(f"committed: {message}")
    return True


def cmd_publish(args):
    _git_commit(args.message)
    if args.push:
        _git("push", check=True)
        print("pushed — GitHub Pages will rebuild automatically in a minute or two.")
    else:
        print("Committed locally only. Re-run with --push, or use `sync`, to push it.")


def cmd_sync(args):
    _git_commit(args.message)
    _git("push", check=True)
    print("pushed — GitHub Pages will rebuild automatically in a minute or two.")


# ---------------------------------------------------------------------------
# argument parsing
# ---------------------------------------------------------------------------

def build_parser():
    parser = argparse.ArgumentParser(
        prog="blog.py",
        description="Manage posts, projects, categories, notifications, theme, and publishing.",
        epilog=(
            "examples:\n"
            '  post new "My Trip" --category writings --tags travel,film\n'
            '  project new "Portfolio Site" --role "Designer" --stack "Jekyll,CSS" --repo https://github.com/you/repo\n'
            '  category add photography "Photography" --accent moss\n'
            '  notify add "New project is live" --url /projects/ --days 7\n'
            "  theme background midnight\n"
            "  theme effect grain off\n"
            "  list posts\n"
            "  serve\n"
            '  sync -m "add trip writeup"\n'
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # post ---------------------------------------------------------------
    post_p = sub.add_parser("post", help="Manage posts (writings/studies/etc.)")
    post_sub = post_p.add_subparsers(dest="action", required=True)
    p = post_sub.add_parser("new", help="Create a new post")
    p.add_argument("title")
    p.add_argument("--category", required=True, help="Category slug (see: category list)")
    p.add_argument("--subtitle")
    p.add_argument("--excerpt", help="Shown on cards and listing pages")
    p.add_argument("--tags", default="", help="Comma-separated")
    p.add_argument("--cover", help="Path to a local image to use as the cover")
    p.set_defaults(func=cmd_post_new)

    # project --------------------------------------------------------------
    project_p = sub.add_parser("project", help="Manage portfolio projects")
    project_sub = project_p.add_subparsers(dest="action", required=True)
    p = project_sub.add_parser("new", help="Create a new project")
    p.add_argument("title")
    p.add_argument("--subtitle")
    p.add_argument("--summary", help="One sentence, shown on project cards")
    p.add_argument("--role")
    p.add_argument("--stack", default="", help="Comma-separated, e.g. Python,React")
    p.add_argument("--status", default="Active")
    p.add_argument("--repo")
    p.add_argument("--demo")
    p.add_argument("--cover", help="Path to a local image to use as the cover")
    p.add_argument("--tags", default="")
    p.set_defaults(func=cmd_project_new)

    # category ---------------------------------------------------------------
    category_p = sub.add_parser("category", help="Manage writing categories")
    category_sub = category_p.add_subparsers(dest="action", required=True)
    p = category_sub.add_parser("add", help="Add a new category + listing page")
    p.add_argument("slug", help="URL slug, e.g. photography")
    p.add_argument("name", help="Display name, e.g. Photography")
    p.add_argument("--accent", default="rust", choices=VALID_ACCENTS)
    p.add_argument("--description", default="")
    p.set_defaults(func=cmd_category_add)
    p = category_sub.add_parser("list", help="List categories")
    p.set_defaults(func=cmd_category_list)

    # notify ---------------------------------------------------------------
    notify_p = sub.add_parser("notify", help="Manage the site-wide notification banner")
    notify_sub = notify_p.add_subparsers(dest="action", required=True)
    p = notify_sub.add_parser("add", help="Add a notification")
    p.add_argument("message")
    p.add_argument("--url")
    p.add_argument("--type", default="info", choices=VALID_NOTICE_TYPES)
    p.add_argument("--days", type=int, default=14, help="How long it stays live")
    p.add_argument("--start", help="YYYY-MM-DD, defaults to today")
    p.set_defaults(func=cmd_notify_add)
    p = notify_sub.add_parser("list", help="List notifications")
    p.set_defaults(func=cmd_notify_list)
    p = notify_sub.add_parser("remove", help="Remove a notification by id")
    p.add_argument("id")
    p.set_defaults(func=cmd_notify_remove)

    # theme ---------------------------------------------------------------
    theme_p = sub.add_parser("theme", help="Change background preset and visual effects")
    theme_sub = theme_p.add_subparsers(dest="action", required=True)
    p = theme_sub.add_parser("background", help="Switch background preset")
    p.add_argument("slug", choices=VALID_BACKGROUNDS)
    p.set_defaults(func=cmd_theme_background)
    p = theme_sub.add_parser("effect", help="Toggle a visual effect")
    p.add_argument("name", choices=VALID_EFFECTS)
    p.add_argument("state", choices=["on", "off"])
    p.set_defaults(func=cmd_theme_effect)
    p = theme_sub.add_parser("show", help="Print current theme settings")
    p.set_defaults(func=cmd_theme_show)

    # list / serve / publish / sync ---------------------------------------
    p = sub.add_parser("list", help="List posts or projects")
    p.add_argument("what", choices=["posts", "projects"])
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("serve", help="Preview the site locally")
    p.set_defaults(func=cmd_serve)

    p = sub.add_parser("publish", help="Commit changes (optionally push)")
    p.add_argument("-m", "--message")
    p.add_argument("--push", action="store_true", help="Push to the remote after committing")
    p.set_defaults(func=cmd_publish)

    p = sub.add_parser("sync", help="Commit and push in one step")
    p.add_argument("-m", "--message")
    p.set_defaults(func=cmd_sync)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
