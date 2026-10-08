---
layout: "note"
title: "인코딩 예제 사다리"
display_title: "인코딩 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: NRZ의 높이 규칙, NRZI와 맨체스터의 한가운데 전이 규칙, 4B/5B의 표."
prev_url: "/studies/computer-communication/timing-analysis-ladder/"
prev_title: "소요시간 분석 예제 사다리"
next_url: "/studies/computer-communication/crc-ladder/"
next_title: "CRC 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/line-coding-ladder/"
---
{% raw %}
사용 개념: [NRZ](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/)의 높이 규칙, [NRZI와 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/)의 한가운데 전이 규칙, [4B/5B](/Hongs_Blog/studies/computer-communication/4b5b/)의 표.

"비트열을 신호로 그려라", "신호를 비트로 읽어라"라는 문제는 늘 같은 네 하위목표로 나뉜다. 칸을 반으로 나누고, 칸마다 규칙을 적용하고, 이어서 그리고, 거꾸로 읽어 확인한다. 그림은 칸 하나에 반 칸 두 개, 낮음 `_`, 높음 `‾`로 적는다. 맨체스터는 0이 올라감, 1이 내려감이다. NRZI는 따로 말이 없으면 처음 높이가 낮음이다[^s1].

## 문제 1 · 완전한 풀이

비트열 `1100`을 NRZ, NRZI, 맨체스터로 그리라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *칸 나누기:* 비트 4개 → 칸 4개, 반 칸 8개.
2. *칸마다 규칙 적용:*
    - NRZ: 1은 `‾‾`, 0은 `__`.
    - NRZI: 1번째 1은 낮음에서 뒤집어 `_‾`, 2번째 1은 높음에서 뒤집어 `‾_`, 0 두 개는 낮음 그대로 `__ __`.
    - 맨체스터: 1은 `‾_`, 0은 `_‾`.
3. *이어서 그리기:* NRZ `‾‾ ‾‾ __ __`, NRZI `_‾ ‾_ __ __`, 맨체스터 `‾_ ‾_ _‾ _‾`.
4. *거꾸로 읽어 확인:* NRZI는 칸 안에서 바뀐 칸이 1이다. 1·2번째 칸이 바뀌었으니 `1100`. 맨체스터는 앞 절반이 데이터다. ‾, ‾, _, _ 이니 `1100`.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

비트열 `0110`을 NRZI와 맨체스터로 그리라.

1. *칸 나누기:* 칸 4개, 반 칸 8개.
2. *칸마다 규칙 적용:* NRZI는 0 → 낮음 그대로 `__`, 1 → 뒤집어 `_‾`, 1 → 뒤집어 `‾_`, 0 → 그대로 `__`. 맨체스터는 `_‾`, `‾_`, `‾_`, `_‾`.
3. *이어서 그리기:* NRZI `__ _‾ ‾_ __`, 맨체스터 `_‾ ‾_ ‾_ _‾`.
4. *거꾸로 읽어 확인:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

NRZI에서 칸 안에서 바뀐 칸은 2·3번째 → `0110`. 맨체스터 앞 절반은 _, ‾, ‾, _ → `0110`. 둘 다 원래 비트열과 같다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

비트열 `101100`을 NRZI(처음 높이가 **높음**)와 맨체스터로 그리라.

1. *칸 나누기:* 칸 6개, 반 칸 12개.
2. *칸마다 규칙 적용:* ______
3. *이어서 그리기:* ______
4. *거꾸로 읽어 확인:* NRZI는 칸 안에서 바뀐 칸(1·3·4번째)이 1이므로 `101100`. 맨체스터 앞 절반 ‾, _, ‾, ‾, _, _ → `101100`.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. NRZI는 높음에서 출발한다. 1 → `‾_`(낮음이 됨), 0 → `__`, 1 → `_‾`(높음), 1 → `‾_`(낮음), 0 → `__`, 0 → `__`. 맨체스터는 1 `‾_`, 0 `_‾`, 1 `‾_`, 1 `‾_`, 0 `_‾`, 0 `_‾`.
3. NRZI `‾_ __ _‾ ‾_ __ __`, 맨체스터 `‾_ _‾ ‾_ ‾_ _‾ _‾`.<br>
처음 높이를 높음으로 바꿔도 NRZI를 읽는 법(칸 안에서 바뀌었는가)은 같다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~3의 그림과 되읽기 — [41_nrzi-manchester_impl.py](/Hongs_Blog/studies/computer-communication/code/41_nrzi-manchester_impl/)</div>

</div>


## 문제 4 · 독립 문제

데이터 `0100 1101`을 4B/5B로 바꾼 뒤 NRZI(처음 낮음)로 보낸다. (a) 보내는 5비트 열, (b) NRZI 신호, (c) 신호가 바뀌지 않고 가장 오래 이어지는 길이(비트 폭 단위)를 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 0100 → 01010, 1101 → 11011. 이어서 `0101011011`.<br>
(b) `__ _‾ ‾‾ ‾_ __ _‾ ‾_ __ _‾ ‾_`. 붙여 쓰면 `___‾‾‾‾____‾‾____‾‾_`.<br>
(c) 반 칸 4개, 즉 2비트 폭. 예: 2번째 칸의 뒤 절반부터 4번째 칸의 앞 절반까지 높음.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 4와 변형 문제 — [43_line-coding-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/43_line-coding-ladder_p4/)</div>

</div>


## 변형 문제

- 데이터 `0000 0000`을 (a) NRZ로 그냥 보낼 때와 (b) 4B/5B + NRZI로 보낼 때, 신호가 바뀌지 않는 가장 긴 구간을 각각 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 8비트 폭 내내 낮음. (b) 4B/5B 부호는 `11110 11110`이고, NRZI 신호에서 가장 긴 평평한 구간은 가운데 0 근처의 2비트 폭이다. 0 연속을 4B/5B가 끊어 준 효과다.

</details>


- 받은 맨체스터 신호가 `_‾ ‾_ ‾_ _‾ _‾`이다. 데이터는? 같은 반 칸 열 `__ _‾ ‾_ __ _‾`을 NRZI로 읽으면?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

맨체스터: 앞 절반 _, ‾, ‾, _, _ → `01100`. NRZI: 칸 안에서 바뀐 칸은 2·3·5번째 → `01101`.

</details>


[^s1]: 에이전트 보충. 이 문서의 문제와 비트열은 원본에 없다. 슬라이드 38(NRZI와 맨체스터 규칙)과 40(4B/5B 표)을 연습하도록 만들었고, 답은 구현·검증 코드로 확인했다.
{% endraw %}
