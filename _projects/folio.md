---
title: Folio
subtitle: A quiet macOS menu bar app that counts the time you actually study. Reading a textbook counts. Scrolling your phone doesn't.
date: 2026-10-12
role: Solo project — product design, on-device sensing, the decision engine, the macOS app
stack:
  - Swift / SwiftUI
  - Apple Vision
  - Rust (UniFFI)
  - SFace via tract
  - SQLite
  - Homebrew
status: Released
repo: https://github.com/Hong-Iron/folio
demo:
summary: A study timer that doesn't take your word for it. It watches where you look and what is in front of you, keeps an honest tally, and asks when it can't tell. No account, no network, no images saved.
cover: /assets/img/uploads/folio-cover.jpg
image: /assets/img/uploads/folio-cover.jpg
cover_alt: "Three Folio screens: a session summary reading 1 h 17 m of real work with a colored timeline, the menu bar popover showing 1:17 focused and At your desk, studying, and a nudge reading You've wandered to youtube.com. All drawn by the app's snapshot mode from made-up history."
tags:
  - macos
  - swift
  - rust
  - computer-vision
  - privacy
---

Most study timers trust you. Start the clock, pick up your phone, and the clock keeps running. **Folio** sits in the macOS menu bar and checks. It notices where you are looking, whether a phone is in your hands, and whether a social site is in front of you. Then it keeps an honest tally: reading a textbook counts, staring at the wall doesn't. When it can't tell, it says so and asks you at the end of the session instead of guessing.

Everything stays on your Mac. There is no account and no network, and no image is ever saved. It needs macOS 15 or later on Apple silicon:

```bash
brew install --cask hong-iron/tap/folio
```

<figure>
  <img src="{{ '/assets/img/uploads/folio-week.png' | relative_url }}" alt="Folio's week view: 28 h 19 m focused this week, one strip per day from Monday to Sunday colored by state, a When you focus histogram, and What pulled you away listing Phone 59 m, instagram.com 31 m and Looking away 10 m." loading="lazy">
  <figcaption>The week view. Like the screens at the top, it comes from Folio's own snapshot mode, which fills the app with made-up history, so these are not real numbers.</figcaption>
</figure>

## My role

A solo project: product design, on-device sensing, the engine that decides what counts, and the macOS app around it.

## What I built

**Sensing in Swift, deciding in Rust.** The Swift side only measures and draws. The camera runs at its lowest format and frame rate, and Apple's Vision framework runs only when the engine asks: face direction every second, hands and objects every 2 seconds at the desk and every 10 seconds otherwise, identity at the start and every 2 minutes. Between sessions the camera is off and nothing ticks. Every decision happens in a Rust core linked into the app through UniFFI, so the logic can be tested without a camera. It turns face angles into gaze zones (screen, desk, elsewhere) from a short calibration, classifies each moment, smooths the result, and backdates a change to when it really began.

**Rules you can read.** The classifier is a first-match table:

| Looking at | Also seen | Counts as |
|---|---|---|
| Screen | Focus or neutral app, input in the last 90 s | Focus |
| Screen | Social site or app in front for 15 s or more | Drift |
| Desk | Book, writing hand, or small reading head movements | Focus |
| Desk | Phone in hand for 20 s or more | Drift |
| Desk | Eyes closed 8 s or more | Drift (dozing) |
| Desk | Very still, no sign of study for 3+ minutes | Unclear: you're asked |
| Elsewhere | More than 45 s | Drift |
| Nobody, or not you | More than 10 s | Away |

After about 30 seconds of drifting, a small note appears in the corner. It never blocks anything. At the end of a session you get a summary, and the week view lays out one strip per day, when you focus best, and what pulls you away.

**It knows it's you.** Your face is enrolled once and checked at the start of a session, when you come back, and every couple of minutes, so time with someone else in the chair doesn't count. Recognition uses the SFace model from the OpenCV Model Zoo, run inside the Rust core with tract. The face is kept as 128 numbers, never as a photo. The build downloads the 38.7 MB model once and refuses it unless its SHA-256 matches.

**Accuracy as tests.** `cargo test` plays eight synthetic study scenarios through the engine and checks them against targets: focus-time error of 5% or less, under 1% of phone or social time counted as focus, at least 95% per-second agreement on confident time, and no nudges during real focus. Synthetic traces are not your desk, so the app also has a label mode. Mark what you are really doing with a hotkey while you study, and a replay tool scores the engine against your own recorded traces, which hold numbers only.

**Shipping.** The app is one executable with the Rust core statically linked, depending only on system frameworks. A snapshot mode renders every screen in light and dark from made-up history, which is where the screenshots come from. One script publishes a release: the GitHub release, the dmg, and the Homebrew cask update. Folio isn't notarized (that takes a paid Apple developer account), so the first launch needs one click on Open Anyway in System Settings.

## Result

Version 0.1.0 is out as a dmg and a Homebrew cask, MIT-licensed.

**Focus:** on-device computer vision · Rust and Swift together · privacy by design · testable decisions
