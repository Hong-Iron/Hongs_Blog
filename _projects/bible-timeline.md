---
title: 바이블 타임라인
subtitle: Slide through the events of the Bible and church history on one timeline, with the verse, the map, and photos of the real artifacts that bear on each event.
date: 2026-11-06 12:00:00 +0900
role: Solo project — research, information design, data and writing, front end
stack:
  - JavaScript (ES modules)
  - d3.js / SVG
  - Natural Earth
  - Wikimedia Commons
  - Python / Node.js (data checks)
  - GitHub Pages / Actions
status: Live
repo: https://github.com/Hong-Iron/BIBLE-TIMELINE
demo: https://hong-iron.github.io/BIBLE-TIMELINE/
summary: A timeline from 2200 BC to today with 152 events, 158 people, the 66 books and 48 church-history controversies. Every artifact says how directly it bears on the event and what it does not prove.
cover: /assets/img/uploads/bible-timeline-cover.jpg
image: /assets/img/uploads/bible-timeline-cover.jpg
cover_alt: "바이블 타임라인 centred on 701 BC. On the left, a map of the Near East draws the Assyrian army's route from Nineveh to Lachish and Jerusalem. On the right, the timeline shows the era band of the divided kingdom, event titles such as 산헤립이 예루살렘을 에워싸다 (Sennacherib besieges Jerusalem), and two rows of artifact photos, each placed at the year it was made."
tags:
  - d3
  - data-visualization
  - maps
  - history
---

**바이블 타임라인** ("Bible Timeline") puts the events of the Bible on one timeline you slide sideways, from Abraham leaving Haran (around 2091 BC) to the church today. Each event comes with its verse, its place on the map, and photos of real artifacts, each set at the year it was made. It covers 60 biblical events and 92 events from church history, including the church in Korea, plus 158 people with a profile each.

It is live at [hong-iron.github.io/BIBLE-TIMELINE](https://hong-iron.github.io/BIBLE-TIMELINE/). The screenshot at the top is the timeline around 701 BC, when Sennacherib's army marched on Jerusalem.

<figure>
  <img src="{{ '/assets/img/uploads/bible-timeline-room.jpg' | relative_url }}" alt="The exhibit room for 701 BC, Sennacherib besieges Jerusalem. On the left is a photo of the Taylor Prism with two more artifacts as thumbnails, and a label card: made in 691 BC, ten years after the event, held at the British Museum, found near Nineveh in 1830, tagged 직접 언급 (direct mention), with what it says and a caution that it never claims Jerusalem fell. On the right are the verse from 2 Kings 18:13, the people involved, and a small map of the route." loading="lazy">
  <figcaption>An exhibit room. The Taylor Prism names the event directly, was made ten years after it, and comes with a caution: it never says Jerusalem fell.</figcaption>
</figure>

## My role

A solo project: the research, the information design, the data and the writing, and the front end.

## What I built

**A map beside a timeline.** The screen is split in two. On the left, a map follows whatever event sits in the middle of the timeline and draws its route. On the right, the timeline has lanes for eras, events and evidence, and more lanes for the books of the Bible, people and empires can be switched on. Tap an event and its exhibit room opens; slide the rooms and the timeline behind them moves to the same event.

**Evidence that says how strong it is.** Every artifact carries one of four labels: it names the event directly, it is indirect evidence, it is background, or it is an old manuscript. It also says when it was made relative to the event and what it does *not* show. The Taylor Prism, for example, names Sennacherib and Hezekiah but never claims that Jerusalem fell. The photos come from Wikimedia Commons, and each one shows its author and licence.

**Church history without picking a side.** 48 controversies, from Gnosticism to recent debates, are laid out the same way: the question at stake, each side's argument and its Bible verses, what the councils decided, and where today's churches stand. The positions are given for six traditions (the Church of the East, the Oriental Orthodox, the Eastern Orthodox, the Catholic Church, Protestant churches by denomination, and academic historians), each under the name it uses for itself. The site does not choose a winner.

<figure>
  <img src="{{ '/assets/img/uploads/bible-timeline-debate.jpg' | relative_url }}" alt="The page for the Filioque controversy, 589 to 1054. On the left: the question at stake (does the Spirit proceed from the Father alone, or from the Father and the Son, and may one church add words to a creed set by an ecumenical council), the people involved, and the related events on the timeline. On the right: the history in a few lines, then position cards for 'from the Father alone' (Photius and the Byzantine church) and 'from the Father and the Son' (the Latin church and Frankish theologians), each with a quotation from a primary source and its Bible references." loading="lazy">
  <figcaption>One of the 48 controversies. Each side gets its argument, a quotation from its own sources and its Bible references.</figcaption>
</figure>

**More ways in.** The 66 books each have a guide and a page on their historical background (events, culture, literature and the way texts were built) with a source for every item. A reading mode lets you scroll through a book's events while the map follows. One search box finds events, people, books and controversies. A pixel guide named 홍철 answers the questions a visitor is likely to have at the spot they are viewing: 1,344 questions with 4,207 branching answers, prepared ahead of time in the site owner's voice, so nothing is sent to an AI while you read.

**Checks on the data.** The Bible text is the 1961 Korean Revised Version, which is out of copyright. Scripts pull every cited verse into the site and compare it against the claim it supports, and other scripts check that every person has a profile, every place named in a book guide is on the map, and every background item has a source.

**Fast on phones.** At first the map re-projected the whole coastline on every frame, which took about 70% of a phone's time. Now it draws the map once and moves it with a transform. The heavy data (about 3 MB of verses and profiles) loads only when a screen needs it, and the address bar always holds the current screen, so the back button returns to exactly where you were.

## Result

The site is live with 152 events, 158 people, the 66 books and 48 controversies, and every artifact photo credited to its source.

**Focus:** information design · maps and timelines · source checking · performance
