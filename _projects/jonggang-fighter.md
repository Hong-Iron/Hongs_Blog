---
title: 종강 파이터
subtitle: An engineering student in a department jacket fights their professors with a clicky keyboard. A pixel-art browser game where you build a professor, send the link, and see how far your friends get.
date: 2026-10-19 20:00:00 +0900
role: Solo project — game design, pixel art in code, battle system, sharing, leaderboard
stack:
  - JavaScript / Canvas 2D
  - pxl (pixel-art engine)
  - Galmuri pixel font
  - Supabase
  - Kakao JavaScript SDK
  - GitHub Pages
status: Live
repo: https://github.com/Hong-Iron/JONGGANG-FIGHTER
demo: https://hong-iron.github.io/JONGGANG-FIGHTER/
summary: A pixel-art browser game about the last week of the semester. Mash to submit assignments, parry the professor's lines, then build your own professor and send them to friends as a link. 12 colleges compete on a streak leaderboard.
cover: /assets/img/uploads/jonggang-fighter-cover.png
image: /assets/img/uploads/jonggang-fighter-cover.png
cover_alt: "Three real screens of 종강 파이터 in pixel art: the title menu (연속 대전 시작, 교수님 목록, 학생 꾸미기, 단과대 랭킹); a fight where the student, seen from behind with a keyboard, takes a hit for -10 sleep; and the professor shouting 졸지 마! while a red 반박! button appears."
tags:
  - game
  - pixel-art
  - canvas
  - supabase
---

종강 is the day the semester ends. In **종강 파이터** (Jonggang Fighter) an engineering student in a department jacket faces the professor across the lecture hall, armed with a clicky mechanical keyboard. Mash the screen to submit assignments and wear the professor down. When the professor fires a line like "졸지 마!" (no dozing!), a red **[반박!]** (objection!) mark pops up somewhere on screen. Hit it in time to parry.

It runs in the browser on phones and PCs at [hong-iron.github.io/JONGGANG-FIGHTER](https://hong-iron.github.io/JONGGANG-FIGHTER/). The screens at the top are from a real run: the title menu, a hit that costs the student 10 sleep, and a parry prompt.

<figure>
  <img src="{{ '/assets/img/uploads/jonggang-fighter-professors.png' | relative_url }}" alt="Two pixel-art screens. Left: the professor list with eight professors from different colleges, each with edit and delete buttons. Right: the builder for the first professor, 공대 김OO, with fields for the name and three catchphrases, and pickers for college, difficulty, lab leader, gender and age." loading="lazy" style="image-rendering: pixelated;">
  <figcaption>The professor list (up to eight) and the builder. The whole list travels as one link.</figcaption>
</figure>

## My role

A solo project: game design, the pixel art (drawn in code), the battle system, sharing, and the leaderboard.

## What I built

**A fight that starts fast.** The framing borrows from Punch-Out!!. The professor faces you from behind the lectern, you see the student from behind, and the student's face sits in the HUD. The screen is 180×320 pixels, scaled by whole numbers on a PC; on a phone it fills the width. A fight opens with roll call, and the first attack comes 1.7 seconds in: chalk, speech bubbles, and pop quizzes where you mash to write answers. At half health the professor enters phase 2, "conference deadline D-1" mode, with monitor arms and a summoned lab leader. Phase 2 also brings a gray [재수강] (retake) mark, a trap that costs you sleep if you tap it. Each college gives the student its own three skills.

**A run, not one fight.** Beat a professor and the next one on your list steps up three seconds later. Each win makes the next fight harder: more health (+12% per win), harder hits (+8%), shorter warnings, more quiz answers to write, more traps. After each win you pick one of three upgrades from a pool of 12. The whole run shares one 4 minute 30 second clock. Your grade is how many professors you beat, from F (retake) up to A+ at 15 wins, "대학원 납치" (kidnapped into grad school). I set those thresholds with a bot simulation: a beginner bot clears 1 or 2, a relaxed bot that uses skills about 10, an average one about 15, and a strong one about 19.

**Build a professor, send a link.** You pick the professor's face, hair and glasses, outfit, hands and lectern, gender, age (a new hire in their 30s up to a wrinkled 60-something), one of five eye shapes, catchphrases, and college. A list of up to eight professors packs into one link. KakaoTalk was the hard part. Its SDK refuses a message whose JSON passes 10,000 characters, and each character of the link cost about 15. So the link format was rebuilt (built-in professors become numbers, choices become base-36 strings), and for KakaoTalk the link is trimmed to 600 characters, which keeps the message near 8,200.

**Pixel art without circles.** All the art lives in one script that the pxl engine runs in your browser, with your choices plugged in, to draw the sprites. The style rules are strict: no circles, ellipses or round brushes. Limbs are trapezoids with angled elbows, shading comes in flat facets, light falls from the top left, and even shadows are square. Every letter is a real 1× pixel letter. The Galmuri font is drawn at 1× and cut into on/off pixels along its actual ink rows; cutting at a fixed height clipped the top strokes, and "종강" read as "송삼". The back of the jacket prints your college in those pixel letters, and each of the 36 weapons is drawn along the hand's axis so it fits all eight attack poses.

**Sharing and the leaderboard.** A run ends in a 1080×1350 result card styled as an official school form; quit early and it becomes a course-withdrawal or leave-of-absence form. The card goes to KakaoTalk through the Kakao SDK with a "나도 해보기" (let me try) button that opens your professor list. Twelve colleges compete on win streaks through Supabase, the same project behind SMASH's leaderboard: the browser key can call only two functions, sends are limited per hashed IP, and wins that fail to send are queued and retried. Phones buzz on parries and hits: Android through the Vibration API, and iPhone (iOS 18 and later) through a hidden switch control whose toggle makes the system haptic.

**Testing.** Test pages in headless Chrome drive real battles and post the results back to a small local server. Before each deploy a script stamps a fresh `?v=` on every script, stylesheet and art path; without it, GitHub Pages' 10-minute cache once served an old `main.js` next to a new `battle.js`, and taps landed in the wrong place.

## Result

The game is live with 12 colleges, a built-in professor for each, and 36 weapons.

**Focus:** game feel · pixel art in code · link sharing · leaderboard
