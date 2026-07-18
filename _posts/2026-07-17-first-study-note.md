---
title: "How This Site Is Built"
subtitle: "Jekyll, GitHub Pages, and a small CLI to manage it all."
date: 2026-07-17 20:00:00 +0900
categories: [studies]
tags: [jekyll, github-pages]
excerpt: "A quick note on the stack behind this site: Jekyll for templating, native GitHub Pages for hosting, and a stdlib-only Python script for day-to-day content management."
cover:
---

This is a sample post in the **studies** category — for notes on things
you're learning.

The site itself is a small case study: static Markdown content, a Liquid
templating layer for the editorial layout, and `scripts/blog.py` as the only
"admin panel" — a plain Python CLI that scaffolds posts, projects, and
categories, manages the notification banner, and switches the background
theme and effects, all by editing files that Jekyll already understands.

Pushing to `master` is the entire deploy step: GitHub Pages rebuilds the site
automatically, no CI configuration required.
