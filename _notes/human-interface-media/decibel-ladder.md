---
layout: "note"
title: "데시벨 예제 사다리"
display_title: "데시벨 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
description: "사용 개념: 데시벨의 식 L = 10\\log{10}(Io/Ir) = 20\\log{10}(Po/Pr), 서로 상관없는 소리는 세기가 더해진다는 규칙 Lt = 10\\log{10}(10^{L1/10} + 10^{L2/10}), 작은 점에서 퍼지는 소리는 세기가 거리의 제곱에 반비례한다는…"
prev_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
prev_title: "색도도 혼합 예제 사다리"
next_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
next_title: "표본화와 에일리어싱 예제 사다리"
math: true
mermaid: false
code_count: 5
code_files: [{"t": "44_decibel-ladder_p1.py", "u": "/studies/human-interface-media/code/44_decibel-ladder_p1/", "r": "문제 1 풀이"}, {"t": "44_decibel-ladder_p2.py", "u": "/studies/human-interface-media/code/44_decibel-ladder_p2/", "r": "문제 2 풀이"}, {"t": "44_decibel-ladder_p3.py", "u": "/studies/human-interface-media/code/44_decibel-ladder_p3/", "r": "문제 3 풀이"}, {"t": "44_decibel-ladder_p4.py", "u": "/studies/human-interface-media/code/44_decibel-ladder_p4/", "r": "문제 4 풀이"}, {"t": "44_decibel-ladder_plot.py", "u": "/studies/human-interface-media/code/44_decibel-ladder_plot/", "r": "그림 생성"}]
permalink: "/studies/human-interface-media/decibel-ladder/"
---
{% raw %}
사용 개념: [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)의 식 $$L = 10\log_{10}(I_o/I_r) = 20\log_{10}(P_o/P_r)$$, 서로 상관없는 소리는 세기가 더해진다는 규칙 $$L_t = 10\log_{10}(10^{L_1/10} + 10^{L_2/10})$$, 작은 점에서 퍼지는 소리는 세기가 거리의 제곱에 반비례한다는 규칙.

이 기법을 떠올리는 신호는 "dB로 주어진 소리를 합치거나, 개수를 늘리거나, 거리를 바꾼 뒤 몇 dB인가"를 묻는 문제다. dB 숫자끼리는 바로 더하거나 곱하지 않는다. 풀이는 늘 같은 하위목표로 나뉜다. 어떤 물리 법칙을 쓸지 조건을 확인하고, dB를 세기 비로 풀고, 세기로 계산한 뒤, 다시 dB로 바꾼다.

## 문제 1 · 완전한 풀이

같은 자리에서 잰 소리가 기계 A만 켜면 80 dB SPL, 기계 B만 켜면 74 dB SPL이다. 두 기계를 함께 켜면 몇 dB인가?[^s1]

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *조건 확인:* 서로 다른 기계라 두 소리는 서로 상관없다. 상관없는 소리는 음압이 아니라 세기가 더해진다.
2. *세기 비로 풀기:* $$L = 10\log_{10}(I/I_r)$$을 거꾸로 풀면 $$I/I_r = 10^{L/10}$$이다. A는 $$10^{80/10} = 10^{8}$$, B는 $$10^{74/10} = 10^{7.4} \approx 2.512 \times 10^{7}$$이다.
3. *세기로 계산:* 두 세기를 더한다. $$10^{8} + 2.512 \times 10^{7} = 1.2512 \times 10^{8}$$.
4. *다시 dB로:* $$10\log_{10}(1.2512 \times 10^{8}) = 80 + 10\log_{10}1.2512 \approx 80 + 0.97 = 80.97$$ dB. 큰 쪽 80 dB에 1 dB도 안 되는 양이 얹힌다.

</details>


차이가 $$d$$ dB인 두 소리를 합칠 때 큰 쪽에 얹히는 양은 $$10\log_{10}(1 + 10^{-d/10})$$이다. 차이마다 그리면 이렇다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/44_decibel-ladder_fig1.svg" alt="그림" width="642" height="306" loading="lazy">

왼쪽 끝은 같은 크기 두 소리로 +3.01 dB다. 차이가 커질수록 곡선이 빠르게 내려가, 6 dB 차이(문제 1)에서 +0.97 dB, 10 dB 차이에서 +0.41 dB다. 오른쪽으로 갈수록 작은 소리는 합계에 거의 보태지 못한다.

## 문제 2 · 마지막 하위목표만 빈칸

작은 스피커(점음원으로 본다)에서 2 m 떨어진 자리의 소리가 90 dB SPL이다. 8 m 떨어진 자리에서는 몇 dB인가?

1. *조건 확인:* 점음원의 소리는 공 모양으로 퍼지므로 세기가 거리의 제곱에 반비례한다.
2. *세기 비로 풀기:* 2 m에서 $$I/I_r = 10^{90/10} = 10^{9}$$.
3. *세기로 계산:* 거리가 $$8/2 = 4$$배이므로 세기는 $$1/4^2 = 1/16$$배, $$10^9/16 = 6.25 \times 10^{7}$$.
4. *다시 dB로:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$10\log_{10}(6.25 \times 10^{7}) \approx 77.96$$ dB, 곧 약 78 dB다. 90 dB에서 $$10\log_{10}(1/16) \approx -12.04$$ dB 줄었다. 거리 2배마다 $$-6.02$$ dB인데 4배는 2배를 두 번 한 것이라 $$-12.04$$ dB다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

스피커 한 대가 듣는 자리에서 85 dB SPL이다. 같은 스피커를 여러 대 두고 각각 다른 음악을 튼다(서로 상관없음). (가) 4대면 몇 dB인가? (나) 95 dB 이상이 되려면 최소 몇 대가 필요한가?

1. *조건 확인:* 서로 다른 음악이므로 세기가 더해진다.
2. *세기 비로 풀기:* ______
3. *세기로 계산:* 같은 스피커 $$n$$대면 세기가 $$n$$배다.
4. *다시 dB로:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. 한 대의 세기 비는 $$10^{85/10} = 10^{8.5} \approx 3.16 \times 10^{8}$$.
4. $$n$$대면 $$10\log_{10}(n \times 10^{8.5}) = 85 + 10\log_{10}n$$ dB다. (가) $$n = 4$$이면 $$85 + 6.02 = 91.02$$ dB. (나) $$85 + 10\log_{10}n \ge 95$$에서 $$\log_{10}n \ge 1$$, 곧 $$n \ge 10$$. 최소 10대다(9대면 94.54 dB). 10 dB를 올리는 데 스피커가 10배 필요하다.

</details>


## 문제 4 · 독립 문제

공연장 스피커 하나가 1 m 떨어진 곳에서 110 dB SPL이다(점음원으로 본다). 같은 스피커 두 대를 나란히 두고 서로 다른 소리를 낸다. 관객이 85 dB SPL 이하로 들으려면 스피커에서 몇 m 이상 떨어져야 하는가? 스피커가 한 대일 때와 비교하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

두 대는 서로 상관없으므로 세기가 2배가 되어, 1 m에서 $$110 + 10\log_{10}2 = 113.01$$ dB다.<br>
거리 $$r$$ m에서는 세기가 $$1/r^2$$배이므로 $$113.01 - 20\log_{10}r$$ dB다.<br>
이것이 85 이하가 되려면 $$20\log_{10}r \ge 28.01$$, 곧 $$r \ge 10^{28.01/20} \approx 25.15$$ m다.<br>
한 대라면 $$20\log_{10}r \ge 25$$에서 $$r \ge 17.78$$ m다. 두 대가 되면 필요한 거리가 $$\sqrt{2} \approx 1.41$$배로 늘어난다. 세기 2배를 거리로 갚으려면 $$r^2$$이 2배, 곧 $$r$$이 $$\sqrt{2}$$배여야 하기 때문이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1의 80.97 dB, 문제 2의 77.96 dB와 $$-12.04$$ dB, 문제 3의 91.02 dB와 최소 10대(9대 94.54 dB), 문제 4의 113.01 dB와 25.15 m(한 대 17.78 m, 비 $$\sqrt{2}$$), 그림의 +3.01·+0.97·+0.41 dB — [p1](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_p1/), [p2](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_p2/), [p3](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_p3/), [p4](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_p4/), [그림 코드](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_plot/)</div>

</div>


## 변형 문제

1. 문제 1의 두 소리가 한 앰프에서 같은 신호를 받아 같은 위상으로 만나는 스피커 소리였다면 몇 dB인가?
2. 음압의 실효값이 0.2 Pa인 소리는 몇 dB SPL인가? 공기($$\rho c \approx 413$$ Pa·s/m)에서 세기로 바꾸면 몇 dB IL인가?
3. 고속도로처럼 긴 줄에서 나는 소리(선음원)가 10 m에서 75 dB이다. 40 m에서는 몇 dB인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 같은 위상이면 세기가 아니라 음압이 더해진다. 음압 비는 $$10^{80/20} = 10^4$$과 $$10^{74/20} \approx 5012$$라 합이 $$15012$$, $$20\log_{10}15012 \approx 83.53$$ dB다. 상관없는 경우(80.97 dB)보다 2.6 dB 크다.
2. $$20\log_{10}(0.2 / (2 \times 10^{-5})) = 20\log_{10}10^4 = 80$$ dB SPL. 세기는 $$0.2^2/413 \approx 9.68 \times 10^{-5}$$ W/m²이고 $$10\log_{10}(9.68 \times 10^{-5}/10^{-12}) \approx 79.86$$ dB IL이다. 두 값은 0.14 dB 차이로 거의 같다.
3. 선음원은 원통 모양으로 퍼져 세기가 거리에 반비례한다. 거리 4배면 세기 1/4, $$10\log_{10}(1/4) \approx -6.02$$ dB라 68.98 dB, 약 69 dB다. 점음원이었다면 $$-12.04$$ dB였을 것이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변형 1의 83.53 dB(p1), 변형 2의 80 dB SPL과 79.86 dB IL(p3), 변형 3의 68.98 dB(p2)</div>

</div>


[^s1]: 문제와 변형의 모든 수치는 설명용 가상 수치다. 실제 스피커는 가까운 거리에서 점음원처럼 퍼지지 않고, 실내에서는 벽에 되튄 소리가 더해지므로 결과는 어림이다.
[^s2]: [44_decibel-ladder_plot.py](/Hongs_Blog/studies/human-interface-media/code/44_decibel-ladder_plot/)로 그렸고, 그림의 세 값과 직접 더한 값이 같은지를 같은 코드로 확인했다.
{% endraw %}
