---
title: Visual Timer
subtitle: A 3D take on the classic disc timer. Set any time, watch the colored wedge shrink, poke the timer, and collect a tomato for every focus session.
date: 2026-10-19 12:00:00 +0900
role: Solo project — design, 3D modelling in code, interaction, record keeping
stack:
  - three.js / WebGL
  - Canvas 2D
  - Picture-in-Picture API
  - Web Share API
  - GitHub Pages
status: Live
repo: https://github.com/Hong-Iron/VISUAL-TIMER
demo: https://hong-iron.github.io/VISUAL-TIMER/
summary: A pomodoro timer you can poke. The wedge shows the time left at a glance, finished sessions drop tomatoes on the desk, and your record stays in your browser with no account.
cover: /assets/img/uploads/visual-timer-cover.jpg
image: /assets/img/uploads/visual-timer-cover.jpg
cover_alt: "Visual Timer in the browser: a mint-green 3D disc timer with a green wedge covering 25 minutes, and a panel below reading FOCUS 24:52, with Focus 25, Short 5 and Long 15 presets and Reset, Pause and +1 min buttons."
tags:
  - threejs
  - webgl
  - productivity
---

A disc timer shows the time left as a colored wedge that shrinks toward zero, so you can tell how long is left without reading a number. **Visual Timer** brings that timer into the browser in 3D. Type any time as hours, minutes and seconds (up to 99:59:59) or drag the dial, and the dial's range switches itself: 60 seconds, 60 minutes, or 2 to 120 hours. Pomodoro presets give 25 minutes of focus and 5- or 15-minute breaks.

It is live at [hong-iron.github.io/VISUAL-TIMER](https://hong-iron.github.io/VISUAL-TIMER/). There is nothing to install and no account.

<figure>
  <img src="{{ '/assets/img/uploads/visual-timer-done.jpg' | relative_url }}" alt="The same timer just after a focus session ended: confetti lies scattered on the desk, a tomato sits in front of the timer, and the panel has switched to SHORT BREAK 05:00 with one tomato counted." loading="lazy">
  <figcaption>A focus session just ended: confetti, a tomato on the desk, and the panel already set for a 5-minute break.</figcaption>
</figure>

## My role

A solo project: the design, the 3D timer built in code, the interactions, and the saved record.

## What I built

**A timer made of code.** The body is a rounded square pushed out into 3D with a beveled edge. Its outline uses only distinct points, because repeating the start point as the end point broke the bevel at one corner. The face and its tick marks are drawn on canvases and wrapped onto the model, and the wedge is rebuilt whenever the remaining fraction changes. Soft shadows (shadow maps blurred by variance, plus blurred contact shadows under the timer and the tomatoes) keep it sitting on the desk instead of floating.

**Things to poke.** Tap the knob to start or pause, drag the body to tilt it, poke it to make it hop, tap the light to change its color, and scroll over it to nudge the time. When time is up it rings and dances, confetti flies, and each finished focus session drops a tomato on the desk. Everything also works from the keyboard: Space, R, the arrow keys, C, M, H and ?.

**Time that survives a reload.** The timer stores the moment it should end and compares it with the clock, instead of counting frames. A background tab or a reload therefore cannot make it drift, and a running timer picks up where it was after a reload. Sessions, color and settings are saved in the browser with localStorage, plus a cookie copy of the last 25 sessions as a fallback. The Record drawer shows today's focus time, your streak, the last 7 days as bars, a recent list, and a CSV export.

**A brag card.** Share my record makes a 1080×1350 card for today, the last 7 days or all time. It puts a snapshot of your own 3D timer next to your total focus time, tomatoes, streak, and a rank from Tomato Sprout up to Time Lord. Share it from the phone's share sheet, save the PNG, copy it, or post it on X.

**A mini window.** Press P and the timer's face floats above your other windows. On desktop Chrome and Edge it is a real little window (Document Picture-in-Picture), with the face redrawn flat in 2D: drag the dial, tap the knob, scroll to nudge, and use start, reset and +1 minute from a bar that appears on hover. Other browsers get the face as a floating video whose play and pause buttons run the timer.

**A preview made from the page itself.** The link-preview image is the real page in a demo mode (`?og`) that never saves anything, captured by headless Chrome at 1200×630.

## Result

Visual Timer is live with no build step: plain HTML, CSS and JavaScript, with three.js loaded from a CDN.

**Focus:** 3D in the browser · interaction design · offline-first storage
