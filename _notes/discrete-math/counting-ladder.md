---
layout: "note"
title: "경우의 수 예제 사다리"
display_title: "경우의 수 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "17"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 순열·조합·중복조합 비교의 네 칸 표, 셈의 기본 법칙."
prev_url: "/studies/discrete-math/induction-ladder/"
prev_title: "귀납법 증명 예제 사다리"
next_url: "/studies/discrete-math/recurrence-ladder/"
next_title: "점화식 풀이 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/discrete-math/counting-ladder/"
---
{% raw %}
사용 개념: [순열·조합·중복조합 비교](/Hongs_Blog/studies/discrete-math/counting-formula-choice/)의 네 칸 표, [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/).

이 방법을 떠올리는 신호는 **"몇 가지인가", "몇 개인가"를 묻는 문제**다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *무엇을 몇 개 고르는지 정하기:* 후보 $$n$$종류와 고르는 개수 $$k$$를 적는다.
2. *순서 판단:* 순서만 바꾼 두 결과를 다르게 치는가?
3. *중복 판단:* 같은 것을 다시 고를 수 있는가?
4. *공식 적용과 검산:* 네 칸 표에서 공식을 고르고, 작은 경우로 확인한다.

## 문제 1 · 완전한 풀이

알파벳 26자로 같은 글자를 두 번 쓰지 않는 3자리 코드는 몇 개인가?

1. *무엇을 몇 개:* 26종류에서 3개.
2. *순서:* "ABC"와 "CBA"는 다른 코드다. 순서가 중요하다.
3. *중복:* 같은 글자 금지. 중복 없음.
4. *공식과 검산:* 순열 $$P(26, 3) = 26 \cdot 25 \cdot 24 = 15{,}600$$. 알파벳이 A, B, C 셋뿐이면 $$3 \cdot 2 \cdot 1 = 6$$이고 ABC, ACB, BAC, BCA, CAB, CBA로 맞다.

## 문제 2 · 마지막 하위목표만 빈칸

물감 7색 중 3색을 골라 섞는다. 섞는 순서는 결과와 무관하다. 가능한 조합은 몇 가지인가?

1. *무엇을 몇 개:* 7종류에서 3개.
2. *순서:* 무관하다.
3. *중복:* 같은 색을 두 번 고르지 않는다.
4. *공식과 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

조합 $$\binom{7}{3} = 35$$. 순열 $$P(7,3) = 210$$을 세 색을 줄 세우는 $$3! = 6$$으로 나눈 값과 같다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

음료 5종류가 있는 자판기에서 캔 8개를 산다. 같은 음료를 여러 개 사도 된다. 가능한 구성은 몇 가지인가?

1. *무엇을 몇 개:* 5종류에서 8개.
2. *순서:* ______
3. *중복:* ______
4. *공식과 검산:* 중복조합 $$\binom{5 + 8 - 1}{8} = \binom{12}{8} = 495$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 봉지 안의 순서는 무관하다. 3. 같은 음료를 여러 번 고를 수 있다(중복 허용). 그래서 중복조합이다.

</details>


## 문제 4 · 독립 문제

각 자리 숫자의 합이 5인 세 자리 자연수는 몇 개인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

자리를 $$a, b, c$$라 하면 $$a + b + c = 5$$, $$a \ge 1$$, $$b, c \ge 0$$이다. $$a' = a - 1$$로 두면 $$a' + b + c = 4$$의 음이 아닌 정수해 수라 $$\binom{4 + 3 - 1}{2} = \binom{6}{2} = 15$$. 숫자가 9를 넘는 해는 없어 그대로 답이다. (104, 113, 122, …, 500을 직접 세도 15개다.)

**흔한 오답:** $$a \ge 1$$을 빼먹고 $$\binom{7}{2} = 21$$을 답하는 것. 050 같은 두 자리 수가 섞인다.

</details>


## 변형 문제

5명이 원탁에 앉는 방법은 몇 가지인가(돌려서 같으면 같은 배치)? 네 칸 표만으로 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

줄 세우기 $$5! = 120$$을 돌려서 같은 5가지로 나눠 $$4! = 24$$. 네 칸 표에 더해 [나눗셈 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)이 필요하다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 답 — [17_counting-formula-choice_verify.py](/Hongs_Blog/studies/discrete-math/code/17_counting-formula-choice_verify/)</div>

</div>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장 "Cardinality Rules"(연습 문제 유형)
{% endraw %}
