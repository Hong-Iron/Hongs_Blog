---
layout: "note"
title: "선형 점화식"
display_title: "선형 점화식 (Linear Recurrences)"
kind: "concept"
kind_label: "기법"
num: "21"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Linear Recurrence", "Recurrence Relation", "점화식", "선형 점화식", "특성방정식", "characteristic equation", "비네 공식", "Binet's formula", "피보나치 수", "Fibonacci numbers", "하노이의 탑", "Tower of Hanoi", "동차", "homogeneous"]
description: "점화식은 \"다음 항을 앞의 항들로 만드는 규칙\"이다. 피보나치처럼 앞 항들에 상수를 곱해 더하는 선형 점화식은, 거듭제곱 꼴 해를 넣어 얻는 방정식(특성방정식)의 근으로 닫힌 꼴을 찾는다. 재귀 알고리즘의 비용과 동적 계획법의 경우의 수가 점화식으로 나오므로, 닫힌 꼴을 알면 얼마…"
prev_url: "/studies/discrete-math/pigeonhole/"
prev_title: "비둘기집 원리"
next_url: "/studies/discrete-math/generating-functions/"
next_title: "생성함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/linear-recurrences/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점화식은 "다음 항을 앞의 항들로 만드는 규칙"이다. 피보나치처럼 앞 항들에 상수를 곱해 더하는 선형 점화식은, 거듭제곱 꼴 해를 넣어 얻는 방정식(특성방정식)의 근으로 닫힌 꼴을 찾는다. 재귀 알고리즘의 비용과 동적 계획법의 경우의 수가 점화식으로 나오므로, 닫힌 꼴을 알면 얼마나 빨리 자라는지 한눈에 보인다. 다만 특성방정식에 겹근이 있으면 해의 모양이 달라지고, 선형이 아닌 점화식에는 이 방법을 쓸 수 없다.

</div>


## 예시로 보기

하노이의 탑에서 원판 $$n$$개를 옮기는 최소 횟수 $$T_n$$을 생각한다. 위의 $$n - 1$$개를 옆으로 치우고($$T_{n-1}$$번), 맨 아래 원판을 옮기고(1번), 치운 것을 다시 올린다($$T_{n-1}$$번). 그래서 $$T_n = 2T_{n-1} + 1$$, $$T_0 = 0$$이다.

| $$n$$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| $$T_n$$ | 0 | 1 | 3 | 7 | 15 | 31 |

값이 늘 2의 거듭제곱보다 1 작다: $$T_n = 2^n - 1$$. 원판 64개면 $$1.8 \times 10^{19}$$번이다. 이렇게 규칙에서 한 번에 계산되는 식을 닫힌 꼴이라 한다. 앞 항에 곱한 2가 아래 정의의 계수, 더한 1이 비동차 항이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

상수 $$c_1, \dots, c_k$$ ($$c_k \ne 0$$)에 대해

$$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \cdots + c_k a_{n-k} \quad (n \ge k)$$

를 $$k$$계 **선형 동차 점화식**이라 하고, $$x^k = c_1 x^{k-1} + \cdots + c_k$$를 **특성방정식**이라 한다[^1]. 처음 $$k$$개 항(초기값)을 정하면 수열이 하나로 정해진다(귀납법).

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">특성방정식으로 풀기</div>

1. 특성방정식의 근 $$r_1, \dots, r_k$$가 서로 다르면, 해는 모두 $$a_n = \alpha_1 r_1^n + \cdots + \alpha_k r_k^n$$ 꼴이다. 상수 $$\alpha_i$$는 초기값으로 정한다.
2. 근 $$r$$이 $$m$$겹이면 그 자리에 $$(\alpha_0 + \alpha_1 n + \cdots + \alpha_{m-1}n^{m-1})r^n$$이 들어간다.
3. 1계 비동차 $$a_n = c\,a_{n-1} + d$$ ($$c \ne 1$$)는 $$a_n = c^n\left(a_0 - \frac{d}{1 - c}\right) + \frac{d}{1 - c}$$다.

</div>


**이 기법을 알아보는 신호.** 문제가 "크기 $$n$$은 크기 $$n-1$$, $$n-2$$로 쪼개진다"는 구조를 가질 때다. 한 칸짜리와 두 칸짜리 조각으로 채우기, 맨 끝 글자에 따라 경우 나누기, 재귀 호출이 크기를 1씩 줄이는 알고리즘이 모두 선형 점화식을 낳는다. 크기가 절반씩 줄면 [분할 정복 점화식](/Hongs_Blog/studies/discrete-math/master-theorem/)이다.

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *거듭제곱 꼴 해:* $$a_n = r^n$$($$r \ne 0$$)을 넣으면 $$r^n = c_1 r^{n-1} + \cdots + c_k r^{n-k}$$이고, $$r^{n-k}$$로 나누면 특성방정식이 된다. 그래서 $$r^n$$이 해 $$\iff$$ $$r$$이 특성근.
2. *겹쳐 놓기:* 식이 선형이라 해 두 개의 상수배 합도 해다.
3. *초기값 맞추기:* 서로 다른 근 $$k$$개면 초기값 $$k$$개로 $$\alpha_i$$에 대한 연립방정식이 생긴다. 계수 행렬(방데르몽드 행렬)은 근이 서로 다를 때 가역이라 해가 하나 있다([역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)).
4. *모든 해를 덮음:* 초기값이 같으면 수열이 같으므로(귀납법), 3에서 초기값을 맞춘 식이 곧 그 수열이다.
5. *1계 비동차:* $$b_n = a_n - \frac{d}{1 - c}$$로 두면 $$b_n = c\,b_{n-1}$$이라 $$b_n = c^n b_0$$. 되돌리면 정리 3이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 1에서 $$r^{n-k}$$로 나눠도 되는 조건은?</summary>

$$r \ne 0$$이어야 한다. $$c_k \ne 0$$이면 0은 특성근이 아니므로 문제가 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4에서 "초기값이 같으면 수열이 같다"는 왜 참인가?</summary>

점화식이 $$a_n$$을 앞의 $$k$$개 항으로 정하므로, 처음 $$k$$개가 같으면 강한 귀납법으로 모든 항이 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 기법의 핵심 아이디어는?</summary>

풀기 어려운 수열 문제를 "어떤 거듭제곱이 규칙을 만족하나"라는 다항식의 근 문제로 바꾼다. 그 뒤 초기값에 맞게 섞는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

행렬로 쓰면 특성근은 행렬의 고윳값이다(선형대수학의 [선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)). 미분방정식 $$y'' = y' + y$$도 $$e^{rt}$$를 넣어 같은 특성방정식을 얻는다.

</details>


## 예제

**피보나치 수의 닫힌 꼴.** $$F_n = F_{n-1} + F_{n-2}$$, $$F_0 = 0$$, $$F_1 = 1$$.

1. *특성방정식:* $$x^2 = x + 1$$, 근 $$\varphi = \frac{1 + \sqrt5}{2} \approx 1.618$$, $$\psi = \frac{1 - \sqrt5}{2} \approx -0.618$$.
2. *일반해:* $$F_n = \alpha\varphi^n + \beta\psi^n$$.
3. *초기값:* $$\alpha + \beta = 0$$, $$\alpha\varphi + \beta\psi = 1$$에서 $$\alpha = \frac{1}{\sqrt5}$$, $$\beta = -\frac{1}{\sqrt5}$$.
4. *결과:* $$F_n = \dfrac{\varphi^n - \psi^n}{\sqrt5}$$(비네 공식). $$\vert \psi\vert  < 1$$이라 $$F_n$$은 $$\frac{\varphi^n}{\sqrt5}$$을 반올림한 수이고, 약 $$1.618^n$$배로 자란다.

연습: [점화식 풀이 예제 사다리](/Hongs_Blog/studies/discrete-math/recurrence-ladder/)

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 하노이·피보나치(비네 공식, $$n \le 70$$)·예제와 사다리의 닫힌 꼴을 점화식 반복값과 $$n \le 60$$에서 정확히 비교, 도미노 타일링과 "11이 없는 문자열"의 전수 셈, 순진한 재귀의 호출 수 — [21_linear-recurrences_verify.py](/Hongs_Blog/studies/discrete-math/code/21_linear-recurrences_verify/)</div>

</div>


## 활용

- **재귀 알고리즘의 비용.** 크기를 1 줄이며 두 번 호출하는 재귀는 $$T_n = 2T_{n-1} + c$$로 $$2^n$$에 비례한다. 피보나치를 정의 그대로 재귀하면 호출 수가 $$2F_{n+1} - 1$$로 $$1.618^n$$배씩 는다.
- **동적 계획법.** 2×$$n$$ 칸을 도미노로 덮는 수, 이웃한 1이 없는 이진 문자열의 수는 맨 끝을 보고 경우를 나누면 피보나치 점화식이 된다. 앞에서부터 표를 채우면 $$n$$번에 계산한다.
- **빠른 계산.** $$\varphi^n$$의 성질이나 행렬 거듭제곱을 쓰면 $$F_n$$을 $$O(\log n)$$번의 곱셈으로 구한다.
- 알고리즘에서: 상태, 점화식, 시작값, 계산 순서 네 가지를 정해 표를 채우는 방법은 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)에 있다. 1을 터는 집으로 보면, 길이 $$i$$이고 이웃한 1이 없는 문자열의 수 $$a_i = a_{i-1} + a_{i-2}$$에서 덧셈을 max로 바꾸고 $$a_{i-2}$$ 쪽에 $$i$$번째 집의 돈을 더한 것이 [도둑질](/Hongs_Blog/studies/algorithms/pg42897/)의 점화식이다. 층이 $$k$$개인 포화 이진 트리의 칸 수는 $$s_k = 2s_{k-1} + 1$$로 하노이와 같은 식이라 $$2^k - 1$$이다([표현 가능한 이진트리](/Hongs_Blog/studies/algorithms/pg150367/)). 그 밖에 [동적 계획법 예제 사다리](/Hongs_Blog/studies/algorithms/dp-ladder/)에서도 쓴다.

## 연결

- 선수: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/), [다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/)(특성방정식의 근), [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)
- 이어지는 개념: [생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/)(다른 풀이법), [분할 정복 점화식과 마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"점화식이면 무엇이든 특성방정식으로 풀 수 있다"</div>

틀렸다. 피보나치와 하노이가 모두 그렇게 풀려서 만능처럼 보인다. 특성방정식은 **상수 계수 선형** 점화식에서만 통한다. $$T(n) = 2T(n/2) + n$$처럼 크기가 비율로 줄거나, $$a_n = a_{n-1}^2$$처럼 곱이 들어가거나, $$a_n = n\,a_{n-1}$$처럼 계수가 $$n$$에 따라 바뀌면 $$r^n$$을 넣어도 방정식이 나오지 않는다. 첫째는 마스터 정리, 둘째는 로그를 취해 선형으로 바꾸기, 셋째는 곱으로 펼치기($$a_n = n!\,a_0$$)를 쓴다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 2계 선형 동차 점화식을 푸는 절차를 네 단계로 쓰라.</summary>

**답:** (1) 특성방정식 $$x^2 = c_1 x + c_2$$를 세운다. (2) 근을 구한다. (3) 서로 다른 근이면 $$\alpha r_1^n + \beta r_2^n$$, 겹근이면 $$(\alpha + \beta n)r^n$$을 일반해로 쓴다. (4) 초기값 두 개로 $$\alpha$$, $$\beta$$를 정하고 작은 $$n$$으로 검산한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** aₙ = 5aₙ₋₁ − 6aₙ₋₂, a₀ = 1, a₁ = 4를 풀라.</summary>

**답:** $$x^2 - 5x + 6 = 0$$에서 근 2, 3. $$a_n = \alpha 2^n + \beta 3^n$$, $$\alpha + \beta = 1$$, $$2\alpha + 3\beta = 4$$에서 $$\beta = 2$$, $$\alpha = -1$$. $$a_n = 2 \cdot 3^n - 2^n$$. 검산: $$a_2 = 5 \cdot 4 - 6 \cdot 1 = 14 = 18 - 4$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** rⁿ이 aₙ = c₁aₙ₋₁ + c₂aₙ₋₂의 해일 필요충분조건이 "r이 특성방정식의 근"인 이유를 보여라.</summary>

**답:** $$r^n = c_1 r^{n-1} + c_2 r^{n-2}$$의 양변을 $$r^{n-2}$$($$r \ne 0$$)로 나누면 $$r^2 = c_1 r + c_2$$다. 거꾸로 이 식에 $$r^{n-2}$$를 곱하면 점화식이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 하노이의 탑의 최소 이동 횟수 점화식을 세우고 닫힌 꼴을 구하라.</summary>

**답:** $$T_n = 2T_{n-1} + 1$$, $$T_0 = 0$$. 정리 3에서 $$c = 2$$, $$d = 1$$이라 $$T_n = 2^n(0 + 1) - 1 = 2^n - 1$$. 또는 $$T_n + 1 = 2(T_{n-1} + 1)$$로 보면 $$T_n + 1 = 2^n$$.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 22장 "Recurrences"(하노이의 탑, 선형 점화식). Rosen, *Discrete Mathematics and Its Applications* 7판, 8장(선형 점화식의 풀이).
{% endraw %}
