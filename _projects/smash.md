---
title: SMASH 대학교
subtitle: Pick your campus and knock it down. 60 Korean university campuses rebuilt in 3D from open map data, with every texture and sound written in code.
date: 2026-10-15
role: Solo project — game design, map data pipeline, 3D rendering and physics, sound, deployment
stack:
  - three.js / WebGL
  - GLSL shaders
  - Web Audio API
  - Python (numpy)
  - OpenStreetMap / Overpass API
  - GitHub Pages / Actions
  - Supabase
status: Live
featured: true   # leads /projects/ (projects.html)
repo: https://github.com/Hong-Iron/SMASH
demo: https://hong-iron.github.io/SMASH/
summary: A browser game that rebuilds 60 Korean university campuses in 3D from open map data so you can blow them up. Every texture and sound is generated in code. 7,193 visitors in a day.
cover: /assets/img/uploads/smash-cover.png
image: /assets/img/uploads/smash-cover.png
shot: /assets/img/uploads/smash-shot.jpg
cover_alt: "Diagram: OpenStreetMap and terrain tiles go through a Python pipeline into SMASH (three.js, WebGL, Web Audio; bomb, bat, laser, meteor, quake, nuke), which GitHub Pages serves as 60 campuses with 7,193 visitors a day. No image or sound files: shaders and synth, all in code."
tags:
  - threejs
  - webgl
  - game
  - gis
---

In exam season, students joke about wanting to blow up their school. **SMASH 대학교** lets them do it. Pick one of 60 Korean university campuses, and its real buildings stand in 3D on its real hills. Knock them down with a bomb, a giant baseball bat, a laser, a meteor, an earthquake, or a nuke, then keep digging until you reach the center of the Earth. It runs in the browser on phones and PCs, with nothing to install.

It is live at [hong-iron.github.io/SMASH](https://hong-iron.github.io/SMASH/), and it reached **7,193 visitors in a single day**.

<figure>
  <img src="{{ '/assets/img/uploads/smash-shot.jpg' | relative_url }}" alt="SMASH CAU: a 3D model of Chung-Ang University's Seoul campus on its hillside. Five explosions go off at once on the library, the main hall and three other buildings; the style rank in the corner reads SSS with a score of 21,834, and the line below it shows the school's place on today's leaderboard." loading="lazy">
  <figcaption>SMASH CAU, the first campus. Five bombs land at once and the style rank jumps to SSS. The line under the score is the school leaderboard: 중앙대 is 3rd of 60 today.</figcaption>
</figure>

## My role

A solo project: game design, the map data pipeline, 3D rendering and physics, sound, and deploying 60 campus sites plus the hub that ties them together.

## What I built

**Maps from open data.** Campus outlines, buildings with their names and floor counts, roads, parks, and water come from OpenStreetMap through the Overpass API. The hills come from AWS Terrain Tiles (SRTM, 30 m). A Python pipeline turns latitude and longitude into local metres, merges the duplicated outlines OpenStreetMap often has (they made walls flicker), plants trees, and cleans the terrain: it fills holes in the elevation data, removes the "hills" that tall buildings leave in a surface model, and flattens lakes.

**Every texture is code.** Building walls are a shader. Each building gets one of five styles, its windows follow its floor height, bricks are laid in a running bond with mortar, and detail fades with distance so nothing shimmers. The ground and roads are painted once onto a canvas straight from the map data. Dig a hole and the walls turn from soil to rock to mantle to a glowing core. There are no image files.

**Every sound is synthesized.** Explosions, crumbling walls, and the laser are built live with the Web Audio API: noise and oscillators through sweeping filters, a generated reverb, and a compressor. The bat's home-run "clang" runs a metal-tube tone through distortion and a stadium echo. Nineteen effects, no sound files.

**Destruction without a physics engine.** On the first hit a building splits into blocks by grid cell and floor; every later hit cuts a piece again along random planes. A small hand-written simulation handles gravity, bounces, friction, and pieces coming to rest, with a spatial grid so falling blocks land on standing ones quickly. Undo plays the destruction backwards, because every piece remembers the piece it came from.

**One file per campus.** A shared template, the campus data, and a small config file build one self-contained HTML page per campus. Each campus has its own repository deployed by GitHub Actions, and the hub page lists all 60 with search (including Korean initial consonants) and sorting.

**A leaderboard between schools.** Points flow to Supabase every 30 seconds and add up per school. The browser key can only call two functions, the tables stay locked behind row-level security, and each send has a cap and a per-IP limit. The hub shows today's and all-time rankings, and each game shows how far your school is from the one above it.

**Sharing and search.** A 1080×1350 result card goes to KakaoTalk through the Kakao SDK and to Instagram through the share sheet. Link-preview thumbnails are rendered in headless Chrome, and every page carries a search-friendly title, structured data, and a place in a sitemap for Google and Naver.

**Testing.** Headless Chrome drives the simulation through a debug hook, a numpy port of the synthesizer renders the sounds for listening offline, and the leaderboard was tested against a local Postgres and PostgREST before it went live.

## Result

60 campuses are live, from Seoul to Busan and Gwangju, and SMASH reached 7,193 visitors in a single day.

**Focus:** 3D rendering · map data pipeline · procedural textures · sound synthesis · game feel
