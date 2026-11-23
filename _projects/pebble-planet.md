---
title: Pebble Planet
subtitle: A survival and crafting game on a planet small enough to walk around, where the rocks, rivers, plants and ores all come from the planet's simulated history.
date: 2026-11-15 12:00:00 +0900
role: Solo project — game design, game code, asset pipeline and test tools. The planet comes from B-PCG, my capstone team's planet generator.
stack:
  - Godot 4.7 (.NET)
  - C# / .NET 10
  - B-PCG (planet generator)
  - Blender / Python
status: In development
repo:
demo:
summary: A planet 10 km in radius, built from plate motion, rain and rivers. Nine biomes, 96 kinds of plants and 73 kinds of animals placed by the land they need, rock layers under your feet, a sea to dive in, houses built from the local stone, and crops that ripen with the local climate.
cover: /assets/img/uploads/pebble-planet-cover.jpg
image: /assets/img/uploads/pebble-planet-cover.jpg
cover_width: 1440
cover_height: 1080
cover_alt: "The player character, a red-haired kid in a blue headband and green overalls, runs toward the camera through tall grass on a grassland hillside. Behind are a green valley and a pale mountain with grey rock showing through, dotted with small trees."
tags:
  - godot
  - csharp
  - game
  - procedural-generation
---

**Pebble Planet** is a survival and crafting game set on a planet you can walk all the way around: 10 km in radius, about 63 km around the equator. You land with nothing. You read the colour of the rocks, the plants and the rivers to guess what is where, then gather, craft, dig, build, and get through cold nights, thirst and hunger.

The planet comes from [B-PCG](https://github.com/CAU-8/B-PCG), the planet generator my capstone team at Chung-Ang University is building. It works the planet out from plate motion, rainfall and river erosion instead of drawing it from noise, so every river reaches the sea and every rock layer has a reason to be where it is. Pebble Planet reads that planet and turns it into a game.

Work started on November 15, 2026. Every screenshot on this page comes from the current build, with all the models, textures and sounds made so far in place. The one at the top is from the closing shot of the game's own camera tour, which flies over the planet and stops in each biome.

## My role

A solo project: the game design, the game code in C#, the pipeline that makes the models and sounds, and the tools that test it all. B-PCG is a team project; I added the fields the game needed, such as biomes, ore deposits and the sea floor, on feature branches of its repository.

## How it was built

**The budget came first.** Before any content went in, I fixed the limits: every frame within 16.7 ms (60 fps), no hitch longer than 50 ms, memory under 4 GB. A benchmark flies a fixed path over the planet and checks them. The whole planet is drawn in terrain chunks that get coarser with distance, and chunks behind the horizon are skipped. On a MacBook Air M3 the bare terrain, from walking on the ground up to orbit, stayed under 8 ms for 99% of frames.

**Ground you can dig.** Near the player the ground turns into 1 m voxels that can be dug while you play. They are built on another thread, so walking never stutters. Digging down shows the rock layers B-PCG worked out for that depth, and a pickaxe cuts tunnels, ramps and shafts you can walk through.

**The land decides what lives where.** The planet has nine biomes, from ice fields to rainforest. Each of the 96 kinds of plants and 73 kinds of animals has a placement rule that names the land values behind it: temperature, rainfall, rock, distance to water. Nothing is scattered without one. Gold flakes turn up in river sand only downstream of a gold-bearing vein, the way placer gold forms on Earth, and copper ore shows as green-stained rock.

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-grassland.jpg' | relative_url }}" alt="A grassland slope covered in pale tufts of grass, small blue and yellow wildflowers, and a tree with red fruit at the top left edge. Three bison graze toward the camera; small trees dot the hills behind." loading="lazy">
  <figcaption>A herd of bison on the grassland.</figcaption>
</figure>

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-boreal.jpg' | relative_url }}" alt="Inside a boreal forest under a dark green canopy. Thick spruce and birch trunks frame two deer, one standing side-on in the middle, with a pine cone and a fallen branch on the ground." loading="lazy">
  <figcaption>Boreal forest, where deer and bears live among spruce, larch and birch.</figcaption>
</figure>


**Getting through the day.** A day lasts 20 minutes. Health, fullness, water and body warmth change with the local temperature and the hour. There are 287 items and 213 recipes, from a stone axe up to copper and iron tools. Breaking a rock gives a piece of whatever rock is there, and walls and roofs built from it keep its colour, so the same house comes out pinkish grey on granite and ochre on sandstone. A shelter is graded from 1 (a hut) to 6 (a good house) by its size, floor, windows, fire and bed.

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-stone-house.jpg' | relative_url }}" alt="A small house on a grassy slope with a pitched roof. The foundation, the walls of rounded blocks and the overlapping roof slabs are all the same warm ochre sandstone; one wall has a window framed in grey stone, and the navy outline beside it is the player standing behind the house, drawn through the wall. Pale hills and a mountain with grey rock patches rise behind." loading="lazy">
  <figcaption>A sample house on sandstone ground, built from the sandstone the player breaks there: foundation, walls and roof slabs.</figcaption>
</figure>

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-shore-house.jpg' | relative_url }}" alt="A log cabin with a yellow thatched roof and a window, standing where a sandy beach meets the sea. Its seaward side rests on short posts over the shallow water, and a spruce forest lines the shore behind it." loading="lazy">
  <figcaption>Floors can run out over the water on posts.</figcaption>
</figure>

**Farming and planting.** Fields take a dozen crops, from wheat and barley to taro, squash and cotton. Each crop ripens by adding up warmth day by day from the local temperature and season, using values from real crops, and dry land needs watering. Trees grow from acorns, cones and cuttings, and eight fruit trees bear fruit only where their winter cold, summer heat and dryness fit.

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-orchard.jpg' | relative_url }}" alt="Day 10 in the savanna at 33 °C. The player stands under a mango tree hung with red and yellow mangoes. A message at the top reads 망고나무를 땄습니다: 망고 2 (picked the mango tree: 2 mangoes), and the hint below says the tree fruits again in about 3 days and can be felled with an axe. A stream runs behind, with another mango tree on the far bank, and the minimap shows the coast close by." loading="lazy">
  <figcaption>A mango tree grown from a seedling. A scripted player made the seedling from a wild mango, planted it, and picked the fruit nine game days later.</figcaption>
</figure>

**The sea.** You can swim, then dive with 45 seconds of breath. The sea floor splits into 11 kinds of places, such as rocky shores, seagrass meadows, kelp forests and coral reefs, read from B-PCG's water temperature and floor type. Jellyfish sting, big sharks follow you in deep water, and dolphins circle you.

<figure>
  <img src="{{ '/assets/img/uploads/pebble-planet-shore.jpg' | relative_url }}" alt="A cold sandy beach with snow on the dunes behind it. A walrus with long tusks lies on the sand next to a small grey seal, with more walruses at the edges of the frame and waves breaking on the right." loading="lazy">
  <figcaption>A cold shore with walruses and a seal.</figcaption>
</figure>

**Start where you like.** A new world opens on a globe of the planet, painted in the same biome colours as the ground. You spin it, zoom in and pick a spot. Click the sea and it moves you to the nearest low shore.

**Models from recipes.** Plants, animals, structures and items are generated 3D models. Each object is first drawn from several angles, and only goes on to 3D when the angles really differ. Blender scripts then clean the mesh, add bones and animate it. Every asset keeps a recipe file with what went in and its licence. Sound effects are synthesized in code, and six ambient layers (sea, river, lake, heights, caves, underwater) follow where you stand.

**Same seed, same world.** All randomness comes from B-PCG's integer hash, so a seed rebuilds the same planet with the same forests. A save file holds only the seed and what the player changed.

**Bots that play it through.** Scripted players run the main loops without a person: drink from a river, make a stone axe, build a hut and get through the first night; raise a house to grade 6; dive and touch the sea floor; plant and harvest crops and fruit trees. Each run ends in a pass or a fail, so a change that breaks a loop shows up at once.

## Where it is now

Pebble Planet is not released yet. The first-session loop of water, stone axe, shelter and first night works from start to end, and the land, sea, digging, building and farming systems are in. Next come play tests with real players and more balancing.

**Focus:** procedural worlds · performance budgets · content rules from geology · asset pipeline
