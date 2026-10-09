---
layout: "note"
title: "측면 억제 예제 사다리"
display_title: "측면 억제 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "18"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 측면 억제의 최종 반응 = 자기 수용기 반응 − 이웃마다 (이웃 수용기 반응 × k)."
prev_url: "/studies/human-interface-media/metamerism-ladder/"
prev_title: "조건등색 예제 사다리"
next_url: "/studies/human-interface-media/convolution-practice/"
next_title: "합성곱 연습"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/lateral-inhibition-ladder/"
---
{% raw %}
사용 개념: [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)의 최종 반응 = 자기 수용기 반응 − 이웃마다 (이웃 수용기 반응 × $$k$$).

이 계산을 떠올리는 신호는 "수용기 반응이 주어지고, 이웃이 서로 억제할 때 최종 반응이나 보이는 밝기"를 묻는 문제다. 풀이는 늘 같은 하위목표로 나뉜다. 이웃을 찾고, 이웃마다 억제량을 구하고, 빼고, 결과를 비교해 무엇이 보이는지 말한다. 모든 문제에서 줄 끝 바깥은 끝 세포와 같은 밝기가 이어진다고 본다.

## 문제 1 · 완전한 풀이

수용기 반응이 A~F 순으로 (100, 100, 100, 20, 20, 20)이다. 각 수용기는 좌우 이웃에 자기 반응의 10%만큼 억제를 보낸다. 최종 반응을 구하고 무엇이 보이는지 쓰라(슬라이드 p.12의 마하 띠)[^1].

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *이웃 찾기:* A의 이웃은 바깥(100)과 B, C는 B와 D, D는 C와 E, F는 E와 바깥(20).
2. *이웃별 억제량:* 밝기 100인 이웃은 10, 20인 이웃은 2를 보낸다.
3. *빼기:* A $$= 100 - 10 - 10 = 80$$, B $$= 80$$, C $$= 100 - 10 - 2 = 88$$, D $$= 20 - 10 - 2 = 8$$, E $$= 20 - 2 - 2 = 16$$, F $$= 16$$.
4. *비교해 결론:* (80, 80, 88, 8, 16, 16). 경계 바로 앞 C가 고른 밝은 영역(80)보다 밝고, 경계 바로 뒤 D가 고른 어두운 영역(16)보다 어둡다. 경계 양쪽에 밝은 띠와 어두운 띠가 보인다.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

헤르만 격자에서 흰 길은 100, 검은 칸은 20이고, 억제는 상하좌우 이웃에 10%다. 교차점 A와 두 검은 칸 사이의 길 D의 최종 반응을 구하고, 어느 쪽이 어둡게 보이는지 쓰라(슬라이드 p.11)[^1].

1. *이웃 찾기:* A의 이웃 넷은 모두 흰 길. D의 이웃은 위아래 흰 길 둘, 좌우 검은 칸 둘.
2. *이웃별 억제량:* A는 10 × 4. D는 10, 10, 2, 2.
3. *빼기:* A $$= 100 - 40 = 60$$. D $$= 100 - 24 = 76$$.
4. *비교해 결론:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

A(60) < D(76)이라 교차점이 길보다 어둡게 보인다. 교차점에 회색 점이 보이는 이유다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

수용기 반응이 (50, 50, 50, 150, 150, 150)으로 어두운 쪽에서 밝은 쪽으로 바뀐다. 억제는 좌우 이웃에 10%다. 최종 반응을 구하고, 띠가 어느 세포에서 어느 방향으로 생기는지 쓰라.

1. *이웃 찾기:* 문제 1과 같다.
2. *이웃별 억제량:* 밝기 50인 이웃은 5, 150인 이웃은 15.
3. *빼기:* ______
4. *비교해 결론:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="3"}
3. (40, 40, 30, 130, 120, 120). 셋째 세포 $$= 50 - 5 - 15 = 30$$, 넷째 세포 $$= 150 - 5 - 15 = 130$$.
4. 고른 어두운 영역은 40, 고른 밝은 영역은 120이다. 경계 바로 앞 셋째 세포(30)는 어두운 영역보다 더 어둡고, 경계 바로 뒤 넷째 세포(130)는 밝은 영역보다 더 밝다. 문제 1과 방향만 뒤집혀, 어두운 띠가 먼저, 밝은 띠가 나중에 나온다.

</details>


## 문제 4 · 독립 문제

어두운 바탕(20) 가운데에 밝은 선(100) 하나가 있다: (20, 20, 100, 20, 20). 억제는 좌우 이웃에 10%다. 최종 반응을 구하고, 가는 밝은 선이 어떻게 보이는지 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(16, 8, 96, 8, 16). 둘째 세포 $$= 20 - 2 - 10 = 8$$, 셋째 세포 $$= 100 - 2 - 2 = 96$$.<br>
밝은 선 양옆이 고른 바탕(16)보다 어두운 8이 되어, 선이 어두운 테두리에 싸인 것처럼 더 또렷하게 보인다. 가는 선을 잘 보이게 하는 경계 강조다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답 (80, 80, 88, 8, 16, 16), 60과 76(실제 격자 영상에서도), (40, 40, 30, 130, 120, 120), (16, 8, 96, 8, 16) — [18_lateral-inhibition_verify.py](/Hongs_Blog/studies/human-interface-media/code/18_lateral-inhibition_verify/)</div>

</div>


## 변형 문제

- 문제 1에서 억제 비율이 10%에서 20%로 커지면 최종 반응은? 계산값 그대로 쓸 수 없는 세포가 있다면 어떻게 해야 하는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

계산값은 (60, 60, 76, −4, 12, 12)다. D의 −4는 발화율로 불가능하다. 발화율은 0 밑으로 내려가지 않으므로 D는 0이다. 억제가 세지면 띠가 커지다가 바닥(0)에 닿는다. [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)에서 활성 함수가 하한 0을 두는 이유와 같다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 억제 20%의 (60, 60, 76, −4, 12, 12)와 0으로 자른 결과 — [18_lateral-inhibition_verify.py](/Hongs_Blog/studies/human-interface-media/code/18_lateral-inhibition_verify/)</div>

</div>


[^1]: 에이전트 보충. 문제 1·2는 슬라이드 p.11~12의 예를 하위목표로 나눈 것이고, 문제 3·4와 변형 문제의 수치는 원본에 없는 설명용 가상 수치다.
{% endraw %}
