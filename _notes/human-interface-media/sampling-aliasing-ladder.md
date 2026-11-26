---
layout: "note"
title: "표본화와 에일리어싱 예제 사다리"
display_title: "표본화와 에일리어싱 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
description: "사용 개념: 표본화 정리의 조건 fs 2fM(fs는 1초에 재는 횟수, fM은 신호의 최고 주파수)과 이산 주파수 \\omega = 2\\pi f / fs, 에일리어싱의 보이는 주파수 fa = \\lvert f - kfs \\rvert(k는 f/fs에 가장 가까운 정수)."
prev_url: "/studies/human-interface-media/decibel-ladder/"
prev_title: "데시벨 예제 사다리"
next_url: "/studies/human-interface-media/digital-audio-practice/"
next_title: "디지털 오디오 계산 연습"
math: true
mermaid: false
code_count: 5
code_files: [{"t": "62_sampling-aliasing-ladder_p1.py", "u": "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p1/", "r": "문제 1 풀이"}, {"t": "62_sampling-aliasing-ladder_p2.py", "u": "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p2/", "r": "문제 2 풀이"}, {"t": "62_sampling-aliasing-ladder_p3.py", "u": "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p3/", "r": "문제 3 풀이"}, {"t": "62_sampling-aliasing-ladder_p4.py", "u": "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p4/", "r": "문제 4 풀이"}, {"t": "62_sampling-aliasing-ladder_plot.py", "u": "/studies/human-interface-media/code/62_sampling-aliasing-ladder_plot/", "r": "그림 생성"}]
permalink: "/studies/human-interface-media/sampling-aliasing-ladder/"
---
{% raw %}
사용 개념: [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)의 조건 $$f_s > 2f_M$$($$f_s$$는 1초에 재는 횟수, $$f_M$$은 신호의 최고 주파수)과 이산 주파수 $$\omega = 2\pi f / f_s$$, [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)의 보이는 주파수 $$f_a = \lvert f - kf_s \rvert$$($$k$$는 $$f/f_s$$에 가장 가까운 정수).

이 기법을 떠올리는 신호는 "연속 신호를 어떤 표본화율로 재면 표본에 무엇이 남는가"를 묻는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다. 최고 주파수를 찾고, 필요한 표본화율과 비교하고, 성분마다 보이는 주파수를 구하고, 그것을 이산 주파수 $$\omega$$로 옮긴다. 마지막 단계에서 $$\omega$$는 $$-\pi$$부터 $$\pi$$ 사이로 맞춘다[^s1].

## 문제 1 · 완전한 풀이

$$x(t) = \cos(2\pi \cdot 1000t) + \cos(2\pi \cdot 6000t)$$를 1초에 8000번 잰다. (가) 원래 신호를 되살리려면 표본화율이 얼마보다 커야 하는가? (나) 8000 Hz로 잰 표본에서 각 성분은 몇 Hz로 보이는가? (다) 표본 $$x[n]$$을 이산 주파수로 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *최고 주파수 찾기:* 두 성분 가운데 높은 것은 6000 Hz다. $$f_M = 6000$$ Hz.
2. *필요한 표본화율과 비교:* 되살리려면 $$f_s > 2 \times 6000 = 12000$$ Hz여야 한다. 8000 Hz는 모자라다. 담을 수 있는 한계 $$f_s/2 = 4000$$ Hz보다 높은 6000 Hz 성분이 둔갑하고, 1000 Hz 성분은 그대로다.
3. *보이는 주파수 구하기:* $$1000/8000 = 0.125$$에 가장 가까운 정수는 0이라 1000 Hz 그대로다. $$6000/8000 = 0.75$$에 가장 가까운 정수는 1이라 $$\lvert 6000 - 8000 \rvert = 2000$$ Hz로 보인다.
4. *이산 주파수로 옮기기:* $$\omega = 2\pi \times 1000/8000 = \pi/4$$, $$\omega = 2\pi \times 2000/8000 = \pi/2$$. 그래서 $$x[n] = \cos(\pi n/4) + \cos(\pi n/2)$$다. 6000 Hz를 그대로 옮기면 $$3\pi/2$$인데, $$2\pi$$를 빼면 $$-\pi/2$$이고 코사인은 부호를 바꿔도 값이 같아 $$\pi/2$$와 같다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/62_sampling-aliasing-ladder_fig1.svg" alt="그림" width="560" height="306" loading="lazy"><br>
왼쪽부터 0.125 ms마다 6000 Hz 코사인(회색)을 잰 주황 표본이 2000 Hz 코사인(점선) 위에 그대로 놓인다. 표본만 보면 2000 Hz와 구별되지 않는다[^s2].

</details>


## 문제 2 · 마지막 하위목표만 빈칸

$$x(t) = \cos(2\pi \cdot 300t) + \cos(2\pi \cdot 2500t)$$를 1초에 2000번 잰다. 표본 $$x[n]$$을 이산 주파수로 쓰라.

1. *최고 주파수 찾기:* 2500 Hz.
2. *필요한 표본화율과 비교:* 5000 Hz보다 커야 한다. 2000 Hz는 모자라서 $$f_s/2 = 1000$$ Hz보다 높은 2500 Hz 성분이 둔갑한다.
3. *보이는 주파수 구하기:* 300 Hz는 그대로다. $$2500/2000 = 1.25$$에 가장 가까운 정수는 1이라 $$\lvert 2500 - 2000 \rvert = 500$$ Hz로 보인다.
4. *이산 주파수로 옮기기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$\omega = 2\pi \times 300/2000 = 0.3\pi$$, $$\omega = 2\pi \times 500/2000 = 0.5\pi$$. 그래서 $$x[n] = \cos(0.3\pi n) + \cos(0.5\pi n)$$이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

재기 전에 거르는 필터가 없는 녹음기가 1초에 48,000번 잰다. 1000 Hz 소리에 사람 귀에는 들리지 않는 30 kHz 초음파가 섞여 $$x(t) = \cos(2\pi \cdot 1000t) + 0.2\cos(2\pi \cdot 30000t)$$가 들어왔다. 녹음된 표본 $$x[n]$$을 이산 주파수로 쓰고, 녹음을 틀면 무엇이 들리는지 쓰라.

1. *최고 주파수 찾기:* 30,000 Hz.
2. *필요한 표본화율과 비교:* 60,000 Hz보다 커야 한다. 48,000 Hz는 모자라서 $$f_s/2 = 24{,}000$$ Hz보다 높은 30 kHz 성분이 둔갑한다.
3. *보이는 주파수 구하기:* ______
4. *이산 주파수로 옮기기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="3"}
3. 1000 Hz는 그대로다. $$30000/48000 = 0.625$$에 가장 가까운 정수는 1이라 $$\lvert 30000 - 48000 \rvert = 18000$$ Hz로 보인다.
4. $$\omega = 2\pi \times 1000/48000 = \pi/24$$, $$\omega = 2\pi \times 18000/48000 = 3\pi/4$$. 그래서 $$x[n] = \cos(\pi n/24) + 0.2\cos(3\pi n/4)$$이다.<br>
들리지 않던 30 kHz가 18 kHz 소리로 바뀌어 녹음된다. 18 kHz는 사람이 들을 수 있는 범위(약 20 Hz~20 kHz, [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)) 안이라 높은 삐 소리로 들릴 수 있다. 재기 전에 24 kHz 위를 걸렀다면 생기지 않는 소리다.

</details>


## 문제 4 · 독립 문제

표본 $$x[n] = \cos(0.4\pi n)$$을 1초에 10,000번 재서 얻었다. 원래 연속 신호가 0~25 kHz 사이의 코사인 하나였다면, 그 주파수로 가능한 것을 모두 쓰라. 재기 전에 5 kHz 위를 없애는 필터를 거쳤다면 어느 것인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

이산 주파수를 실제 주파수로 옮기면 $$f_a = \omega f_s/(2\pi) = 0.4\pi \times 10000/(2\pi) = 2000$$ Hz다. 같은 표본을 내는 주파수는 $$f_s$$의 정수배에서 2000 Hz만큼 떨어진 것들, 곧 $$k \times 10000 \pm 2000$$ Hz다. 0~25 kHz 안에서는 2, 8, 12, 18, 22 kHz 다섯 개다. 5 kHz 위를 없앴다면 남을 수 있는 것은 2 kHz뿐이다.<br>
[에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)의 접힘 그림을 표본화율 10 kHz로 다시 그리면, 지그재그 선이 높이 2 kHz 가로선과 만나는 점이 이 다섯 주파수다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 최고 주파수와 필요한 표본화율, 보이는 주파수, 이산 주파수, 그리고 표본이 실제로 같은지(64~96개 표본 비교), 문제 4는 0~25,000 Hz를 1 Hz 간격으로 모두 대 보아 다섯 개만 맞음 — [62_sampling-aliasing-ladder_p1.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_p1/), [62_sampling-aliasing-ladder_p2.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_p2/), [62_sampling-aliasing-ladder_p3.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_p3/), [62_sampling-aliasing-ladder_p4.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_p4/)</div>

</div>


## 변형 문제

1. 바큇살 8개(45° 간격)인 바퀴를 1초에 24장 찍는다. 바퀴가 한 장 사이에 44° 돈다. 화면에서는 어느 방향으로 1초에 몇 도씩 도는 것처럼 보이는가?
2. 픽셀 하나당 0.6주기인 촘촘한 줄무늬를 찍으면 픽셀당 몇 주기로 보이는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 45°마다 같은 모양이라 44°는 $$44° - 45° = -1°$$로 보인다. 한 장에 1°씩, 1초에 24°씩 거꾸로 도는 것처럼 보인다. 회전에는 방향이 있어서 절댓값을 씌우지 않고 부호를 그대로 읽는다.
2. 픽셀마다 한 번 재는 셈이라 $$f_s = 1$$(픽셀당 1번)이다. 0.6에 가장 가까운 정수는 1이라 $$\lvert 0.6 - 1 \rvert = 0.4$$주기로 보인다([해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/)).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변형 1의 $$-1°$$와 초당 $$-24°$$, 변형 2의 0.4 — [62_sampling-aliasing-ladder_p4.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_p4/)</div>

</div>


[^s1]: 이 문서의 신호, 표본화율, 바퀴와 줄무늬의 수치는 모두 설명용으로 고른 값이다.
[^s2]: 그림 1장은 [62_sampling-aliasing-ladder_plot.py](/Hongs_Blog/studies/human-interface-media/code/62_sampling-aliasing-ladder_plot/)로 그렸고, 같은 코드로 6000 Hz와 2000 Hz의 표본 13개가 일치함을 확인했다.
{% endraw %}
