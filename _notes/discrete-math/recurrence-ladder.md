---
layout: "note"
title: "점화식 풀이 예제 사다리"
display_title: "점화식 풀이 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "21"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 선형 점화식의 특성방정식."
prev_url: "/studies/discrete-math/counting-ladder/"
prev_title: "경우의 수 예제 사다리"
next_url: "/studies/discrete-math/master-theorem-ladder/"
next_title: "마스터 정리 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/discrete-math/recurrence-ladder/"
---
{% raw %}
사용 개념: [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)의 특성방정식.

이 방법을 떠올리는 신호는 **앞의 몇 항에 상수를 곱해 더한 규칙**과 초기값이다. 문제에서 점화식을 직접 세워야 할 때는 "맨 끝(또는 맨 앞)이 무엇이냐"로 경우를 나눈다. 풀이는 늘 같은 다섯 하위목표로 나뉜다[^1].

1. *점화식 정리:* 계수, 차수, 동차인지, 초기값을 적는다.
2. *특성방정식과 근:* $$x^k = c_1 x^{k-1} + \cdots$$을 풀고, 겹근인지 본다.
3. *일반해:* 서로 다른 근이면 $$\sum \alpha_i r_i^n$$($$\sum$$은 차례로 모두 더한다는 기호), 겹근이면 $$(\alpha + \beta n)r^n$$.
4. *상수 결정:* 초기값을 넣어 연립방정식을 푼다.
5. *검산:* 점화식으로 한두 항을 더 계산해 닫힌 꼴과 비교한다.

## 문제 1 · 완전한 풀이

$$a_n = a_{n-1} + 2a_{n-2}$$, $$a_0 = 2$$, $$a_1 = 1$$.

1. *정리:* 2계 동차, 계수 1과 2.
2. *특성방정식:* $$x^2 = x + 2$$, 즉 $$(x - 2)(x + 1) = 0$$. 근 2, $$-1$$(서로 다름).
3. *일반해:* $$a_n = \alpha 2^n + \beta(-1)^n$$.
4. *상수:* $$\alpha + \beta = 2$$, $$2\alpha - \beta = 1$$에서 $$\alpha = 1$$, $$\beta = 1$$.
5. *검산:* $$a_n = 2^n + (-1)^n$$. 점화식으로 $$a_2 = 1 + 4 = 5$$이고 공식은 $$4 + 1 = 5$$.

## 문제 2 · 마지막 하위목표만 빈칸

$$a_n = 6a_{n-1} - 9a_{n-2}$$, $$a_0 = 1$$, $$a_1 = 6$$.

1. *정리:* 2계 동차.
2. *특성방정식:* $$x^2 - 6x + 9 = (x - 3)^2 = 0$$. 근 3이 겹근.
3. *일반해:* $$a_n = (\alpha + \beta n)3^n$$.
4. *상수:* $$\alpha = 1$$, $$3(\alpha + \beta) = 6$$에서 $$\beta = 1$$. 즉 $$a_n = (1 + n)3^n$$.
5. *검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

점화식으로 $$a_2 = 36 - 9 = 27$$, 공식으로 $$(1 + 2) \cdot 9 = 27$$. 같다. $$a_3 = 6 \cdot 27 - 9 \cdot 6 = 108$$, 공식 $$4 \cdot 27 = 108$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

2×$$n$$ 칸을 1×2 도미노로 빈틈없이 덮는 방법의 수 $$t_n$$을 구하라.

1. *정리:* 맨 왼쪽을 세로 도미노 하나로 덮으면 남은 것은 2×$$(n-1)$$, 가로 도미노 두 개로 덮으면 2×$$(n-2)$$. 그래서 $$t_n = t_{n-1} + t_{n-2}$$, $$t_1 = 1$$, $$t_2 = 2$$.
2. *특성방정식:* ______
3. *일반해:* ______
4. *상수:* 초기값을 맞추면 $$t_n = F_{n+1}$$(피보나치 수)이다.
5. *검산:* $$t_3 = 3$$(세로 셋, 세로+가로 둘, 가로 둘+세로).

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$x^2 = x + 1$$, 근 $$\varphi = \frac{1 + \sqrt5}{2}$$, $$\psi = \frac{1 - \sqrt5}{2}$$.
3. $$t_n = \alpha\varphi^n + \beta\psi^n$$. 피보나치와 같은 점화식이고 초기값이 한 칸 밀려 있다.

</details>


## 문제 4 · 독립 문제

길이 $$n$$인 0·1 문자열 중 1이 연달아 나오지 않는 것의 수 $$s_n$$을 점화식으로 세우고 $$s_{10}$$을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

마지막 글자가 0이면 앞은 아무 올바른 문자열($$s_{n-1}$$개), 1이면 그 앞은 반드시 0이고 그 앞은 올바른 문자열($$s_{n-2}$$개). $$s_n = s_{n-1} + s_{n-2}$$, $$s_1 = 2$$, $$s_2 = 3$$. 그래서 $$s_n = F_{n+2}$$이고 $$s_{10} = F_{12} = 144$$.

**흔한 오답:** 초기값을 $$s_1 = 1$$로 잡는 것. 길이 1인 "0"과 "1" 둘 다 올바르다.

</details>


## 변형 문제

$$a_n = 2a_{n-1} + 1$$, $$a_0 = 0$$(하노이)처럼 상수가 더해진 1계 점화식은 어떻게 푸는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

고정점 $$a = 2a + 1$$, 즉 $$a = -1$$을 빼면 $$b_n = a_n + 1$$이 $$b_n = 2b_{n-1}$$을 만족한다. $$b_n = 2^n b_0 = 2^n$$이라 $$a_n = 2^n - 1$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 답을 점화식의 반복값과 정확히 비교, 타일링·문자열은 전수로 셈 — [21_linear-recurrences_verify.py](/Hongs_Blog/studies/discrete-math/code/21_linear-recurrences_verify/)</div>

</div>


[^1]: Rosen, *Discrete Mathematics and Its Applications* 7판, 8장(점화식 세우기와 선형 점화식의 풀이)
{% endraw %}
