---
title: SMASH 대학교
subtitle: Pick your campus and knock it down. 337 Korean university campuses rebuilt in 3D from open map data, with every texture and sound written in code.
date: 2026-10-15
role: Solo project — game design, map data pipeline, 3D rendering and physics, sound, ranking server, deployment
stack:
  - three.js / WebGL
  - GLSL shaders
  - Web Audio API
  - Python (numpy)
  - OpenStreetMap / Overpass API
  - VWorld (building data)
  - Cloudflare Workers / D1
  - GitHub Pages / Actions
status: Live
featured: true   # leads /projects/ (projects.html)
repo: https://github.com/Hong-Iron/SMASH
demo: https://smash-univ.app/
summary: A browser game that rebuilds 337 Korean university campuses in 3D from open map data so you can blow them up. Every texture and sound is generated in code. 154,610 visits to the hub in a single day.
cover: /assets/img/uploads/smash-cover.jpg
image: /assets/img/uploads/smash-cover.jpg
cover_alt: "SMASH CAU in daylight: Chung-Ang University's Seoul campus in 3D. Two giant Pepero sticks stand in the rubble of the library and the 100th Anniversary Hall, which they pierced and brought down, and three bombs are exploding on other halls. The style rank in the corner reads SSS with a score of 55,636, and the weapon bar at the bottom has seven weapons, the last one Pepero."
tags:
  - threejs
  - webgl
  - game
  - gis
---

In exam season, students joke about wanting to blow up their school. **SMASH 대학교** lets them do it. Pick one of 337 Korean university campuses, and its real buildings stand in 3D on its real hills. Knock them down with a bomb, a giant baseball bat, a laser, a meteor, an earthquake, a nuke or, since Pepero Day, a giant Pepero stick, then keep digging until you reach the center of the Earth. It runs in the browser on phones and PCs, with nothing to install.

It is live at [smash-univ.app](https://smash-univ.app/). On October 23, 2026, after posts about it spread on X, the hub took **154,610 visits in a single day**. Its sister game, [SMASH 회사]({{ '/projects/smash-company/' | relative_url }}), does the same for office districts.

The screenshot at the top is a real session on the first campus, 중앙대 (Chung-Ang University): two Pepero sticks have gone through two halls, and three bombs are going off.

<figure>
  <img src="{{ '/assets/img/uploads/smash-hub.jpg' | relative_url }}" alt="The SMASH 대학교 hub at smash-univ.app. A switch at the top moves between SMASH 대학교 and SMASH 회사, marked NEW. Below the title are a search box for school names (Korean initial consonants work too), the school-versus-school ranking led by Pukyong National University's Daeyeon campus, a count of 337 schools with list and map views, and cards with each campus's thumbnail and its points today." loading="lazy">
  <figcaption>The hub: search, a ranking between schools, and a card for each of the 337 campuses with today's points.</figcaption>
</figure>

## My role

A solo project: game design, the map data pipeline, 3D rendering and physics, sound, the ranking server, and deploying 337 campus sites plus the hub that ties them together.

## What I built

**Maps from open data.** Campus outlines, buildings with their names and floor counts, roads, parks, and water come from OpenStreetMap through the Overpass API. The hills come from AWS Terrain Tiles (SRTM, 30 m). A Python pipeline turns latitude and longitude into local metres, merges the duplicated outlines OpenStreetMap often has (they made walls flicker), plants trees, and cleans the terrain: it fills holes in the elevation data, removes the "hills" that tall buildings leave in a surface model, and flattens lakes. VWorld, the Korean government's map service, later filled in 3,949 school buildings with real floor counts and heights, and roof colours read from aerial photos. Wall colours for 945 buildings at 125 schools were checked against photos.

**Every texture is code.** Building walls are a shader. Each building gets one of five styles, its windows follow its floor height, bricks are laid in a running bond with mortar, and detail fades with distance so nothing shimmers. The ground and roads are painted once onto a canvas straight from the map data. Dig a hole and the walls turn from soil to rock to mantle to a glowing core. There are no image files.

**Every sound is synthesized.** Explosions, crumbling walls, and the laser are built live with the Web Audio API: noise and oscillators through sweeping filters, a generated reverb, and a compressor. The bat's home-run "clang" runs a metal-tube tone through distortion and a stadium echo. Twenty-one effects, no sound files.

**Destruction without a physics engine.** On the first hit a building splits into blocks by grid cell and floor; every later hit cuts a piece again along random planes. A small hand-written simulation handles gravity, bounces, friction, and pieces coming to rest, with a spatial grid so falling blocks land on standing ones quickly. Undo plays the destruction backwards, because every piece remembers the piece it came from.

**A seventh weapon for Pepero Day.** November 11 is Pepero Day in Korea, so the seventh weapon is a giant Pepero stick in four flavours, from half to three times its normal size. It drops in on a steep arc. Small sticks stick where they land; from twice the size up, a stick pierces everything in its path, and a skewered building loses its ground floor and comes down whole.

**One file per campus.** A shared template, the campus data, and a small config file build one self-contained HTML page per campus. Each campus has its own repository deployed by GitHub Actions, and the hub lists all 337 with search (including Korean initial consonants), a map, sorting and favourites.

**Campuses by request.** Players ask for their school through GitHub issues. Requests are counted per campus, the most-wanted campuses are built in batches, and each request is closed when its school goes live. Batches 7 to 9 alone added 140 campuses, taking the game from 197 to 337.

**A leaderboard between schools.** Points add up per school, and each game shows how far your school is from the one above it. The first version ran on Supabase. When the traffic from X arrived, the games' frequent leaderboard requests used up its free monthly bandwidth in about a week. On November 2 the ranking moved to a Cloudflare Worker with a D1 database. The Worker answers on the same paths as before, so 338 sites only had to change one address. It caps the points per request, the requests per minute from one IP, and the points per school per day, and that daily cap grows with the number of different players. The board is cached for 60 seconds.

**A lighter hub.** Every hub card used to load that game's 1.1 MB share image, so one hub visit downloaded 5 to 10 MB. Each game now also has a 600×315 WebP card of about 30 KB, and a hub visit costs about 150 KB.

**Sharing and search.** A 1080×1350 result card goes to KakaoTalk through the Kakao SDK and to Instagram through the share sheet. Link-preview thumbnails are rendered in headless Chrome, and every page carries a search-friendly title, structured data, and a place in a sitemap for Google and Naver.

**Testing.** Headless Chrome drives the simulation through a debug hook, a numpy port of the synthesizer renders the sounds for listening offline, and the ranking server has its own tests that run the Worker and the database locally.

## Result

337 campuses are live, from Seoul to Jeju. The hub took 154,610 visits on October 23, 2026, the day posts on X spread it, and both SMASH games now share one domain.

**Focus:** 3D rendering · map data pipeline · procedural textures · sound synthesis · game feel
