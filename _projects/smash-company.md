---
title: SMASH 회사
subtitle: The sister game of SMASH 대학교. Pick a business district and knock down the real office towers, rebuilt in 3D on top of the real aerial photo.
date: 2026-11-06 18:00:00 +0900
role: Solo project — game design, map and building data pipeline, district requests, ranking server, deployment
stack:
  - three.js / WebGL
  - Web Audio API
  - Python
  - OpenStreetMap / Overpass API
  - VWorld (building data, aerial photos)
  - Cloudflare Workers / D1
  - GitHub Pages / Actions
status: Live
repo: https://github.com/Hong-Iron/SMASH-COMPANY
demo: https://company.smash-univ.app/
summary: Office districts across Korea, from Gangnam and Yeouido to industrial parks in Ansan and Incheon, rebuilt in 3D from open map data and government building records. 69 districts, a leaderboard between districts, and homes, schools, hospitals and public offices kept off-limits.
cover: /assets/img/uploads/smash-company-cover.jpg
image: /assets/img/uploads/smash-company-cover.jpg
cover_alt: "SMASH 회사 in Yeouido: real office towers stand on the aerial photo of the district. Three bombs have just gone off; the Fairmont Ambassador Seoul tower is breaking apart in large wall blocks and two other buildings show fresh blasts. The style rank in the corner reads SSS with a score of 19,653, and the weapon bar at the bottom shows bomb, bat, laser, meteor, earthquake and nuke."
tags:
  - threejs
  - webgl
  - game
  - gis
---

**SMASH 회사** ("SMASH Company") is the sister game of [SMASH 대학교]({{ '/projects/smash/' | relative_url }}). Students knock down their campus; workers get their office. Pick a business district, and its real towers stand in 3D on the real aerial photo of the streets. Then bring out the same bomb, bat, laser, meteor, earthquake and nuke.

It went live on the day it was started, November 6, 2026, at [company.smash-univ.app](https://company.smash-univ.app/). It now covers 69 districts: the office districts of Seoul and Pangyo, business centres in Busan, Daegu, Daejeon, Gwangju and other cities, a science park in Jeju, knowledge-industry centres such as Guro and Munjeong, and industrial parks in Ansan and Incheon. It is an unofficial parody and has nothing to do with the companies in it.

The screenshot at the top is a real session in Yeouido, a few seconds after three bombs.

<figure>
  <img src="{{ '/assets/img/uploads/smash-company-hub.jpg' | relative_url }}" alt="The SMASH 회사 hub page. A switch at the top moves between SMASH 대학교 and SMASH 회사. Below the title is a search box for company, building or area names, then the district-versus-district ranking led by Gangnam Yeoksam, a count of 69 districts with list and map views, and cards with an aerial photo of each district and its points today." loading="lazy">
  <figcaption>The hub: search by company, building or area, a ranking between districts, and one card per district with today's points.</figcaption>
</figure>

## My role

A solo project: the game design, the data pipeline for buildings and districts, the hub, the ranking server, and deploying all of it.

## What I built

**One engine, two games.** The game runs on the SMASH 대학교 engine: the same destruction, text, fonts, weapons and controls, so anyone who has played one can play the other. What changed is underneath. A campus is a few dozen buildings on a hill; a business district is hundreds of towers packed into a few blocks.

**Real buildings from public data.** Outlines and heights come from OpenStreetMap through the Overpass API. Parts of a building that start above the ground, such as a sky bridge between two towers, keep their real bottom height. VWorld, the Korean government's map service, adds the height, floor count, use and name of each building, and its aerial photo becomes the ground texture, so real roads, crossings and plazas appear under the towers. Where no height is known, the floor count times 3.8 m stands in. A district keeps up to 350 buildings to smash.

**What stays standing.** Homes and apartments, schools, hospitals, places of worship and public offices (government complexes, courts, tax offices, post offices, fire stations) can never be hit. The rules read the building's use and its name, and they keep growing as gaps turn up, for example officetel brands and funeral halls. At first these buildings stood as plain grey blocks, which looked out of place, so now they are not drawn at all and only the aerial photo shows where they are.

**Labels without people's names.** In the government records, a building's name often holds the owner's address, its use and the owner's personal name. Before a name becomes a label, the address and the use are cut, the owner stays only when it is a company, and a name that is only a lot number is left blank.

**Districts from requests.** Players ask for their district through a GitHub issue form. Each request is located with VWorld's search API, nearby requests are grouped into one district, and when the district is live the issue gets a reply saying what made it into the game. Many of the newer districts came in this way, such as Nonhyeon, Daechi and Hannam in Seoul and the industrial parks in Cheonan and Daegu.

**A leaderboard between districts.** Damage adds up per district on a Cloudflare Worker with a D1 database, forked from the SMASH 대학교 ranking server, with caps per call and per IP. The hub shows today's and all-time rankings, and each card shows the district's points today.

**Thumbnails that find their building.** A script opens every district in headless Chrome, picks its landmark (the building the district is known for, or else the largest named one), tries the camera from four sides, and keeps the side where the fewest other buildings block the view. Then it drops a few bombs and takes the share image.

## Result

69 districts are live, from Seoul and Pangyo to Busan, Daegu, Gwangju and Jeju. Both hubs now sit under one domain, [smash-univ.app](https://smash-univ.app/), with a switch at the top to move between schools and offices.

**Focus:** map data pipeline · public building records · content rules · game feel
