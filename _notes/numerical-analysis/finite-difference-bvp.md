---
layout: "note"
title: "유한 차분법"
display_title: "유한 차분법 (Finite-Difference Method)"
kind: "concept"
kind_label: "기법"
num: "37"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Finite-Difference Method", "유한 차분", "Finite Difference", "중심 차분", "Centered Difference", "삼중대각 행렬", "Tridiagonal Matrix", "토마스 알고리즘", "Thomas Algorithm"]
description: "경계값 문제를 사격법처럼 쏘아 맞히지 않고, 막대를 같은 간격의 점으로 나눠 각 점의 값을 미지수로 둔다. 미분을 이웃 점 값의 차이로 바꾸면 각 점에서 일차방정식 하나가 생기고, 양 끝 값은 알므로 오른쪽으로 옮긴다. 결과는 대각선 근처 세 줄에만 수가 있는 연립 일차방정식이라 …"
prev_url: "/studies/numerical-analysis/shooting-method/"
prev_title: "사격법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/finite-difference-bvp/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

경계값 문제를 사격법처럼 쏘아 맞히지 않고, 막대를 같은 간격의 점으로 나눠 각 점의 값을 미지수로 둔다. 미분을 이웃 점 값의 차이로 바꾸면 각 점에서 일차방정식 하나가 생기고, 양 끝 값은 알므로 오른쪽으로 옮긴다. 결과는 대각선 근처 세 줄에만 수가 있는 연립 일차방정식이라 아주 빠르게 풀린다. 간격을 반으로 줄이면 오차가 약 4분의 1로 준다. 다만 방정식이 비선형이면 연립 비선형 방정식이 되어 반복이 필요하다.

</div>


## 예시로 보기

[사격법](/Hongs_Blog/studies/numerical-analysis/shooting-method/)과 같은 막대 문제($$h' = 0.01$$, $$T_a = 20$$, $$T(0) = 40$$, $$T(10) = 200$$)를 간격 $$\Delta x = 2$$로 나눈다. 안쪽 점은 $$x = 2, 4, 6, 8$$의 넷이다[^1].

$$h'\Delta x^2 = 0.04$$라 대각선은 $$2.04$$, 우변은 $$0.04 \times 20 = 0.8$$에 양 끝 점에서는 경계 온도를 더한다[^1].

$$\begin{pmatrix}2.04 & -1 & 0 & 0\\ -1 & 2.04 & -1 & 0\\ 0 & -1 & 2.04 & -1\\ 0 & 0 & -1 & 2.04\end{pmatrix}\begin{pmatrix}T_1\\ T_2\\ T_3\\ T_4\end{pmatrix} = \begin{pmatrix}40.8\\ 0.8\\ 0.8\\ 200.8\end{pmatrix}$$


| $$x$$ | 2 | 4 | 6 | 8 |
|---|---|---|---|---|
| 유한 차분 ($$\Delta x = 2$$) | 65.9698 | 93.7785 | 124.5382 | 159.4795 |
| 참값 | 65.9518 | 93.7478 | 124.5035 | 159.4534 |

가장 큰 오차는 0.035다. $$\Delta x = 1$$로 줄이면 0.0087로 약 4분의 1이 된다[^1][^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 행렬·우변·해, 참값(지수함수 풀이)과 비교, 간격을 반으로 하면 오차 1/4, 토마스 알고리즘 = 직접 대입 확인(무작위 50개), 카드 C2 — [37_finite-difference-bvp_impl.py](/Hongs_Blog/studies/numerical-analysis/code/37_finite-difference-bvp_impl/)</div>

</div>


## 정의

원래 방정식의 도함수를 유한 차분으로 바꿔, 선형 미분방정식을 연립 대수 방정식으로 만든다. 2계 도함수에는 중심 차분을 쓴다[^2].

$$\frac{d^2T}{dx^2} \approx \frac{T_{i-1} - 2T_i + T_{i+1}}{\Delta x^2}$$


막대를 $$n$$칸으로 나누면 안쪽 점 $$n - 1$$개마다 식이 하나씩 생긴다. $$\frac{d^2T}{dx^2} + h'(T_a - T) = 0$$에 넣고 정리하면 다음과 같다[^3].

$$\frac{T_{i-1} - 2T_i + T_{i+1}}{\Delta x^2} + h'(T_a - T_i) = 0 \quad\Longrightarrow\quad -T_{i-1} + (2 + h'\Delta x^2)T_i - T_{i+1} = h'\Delta x^2T_a$$


$$T_0$$와 $$T_n$$은 알고 있으므로 첫 식과 마지막 식의 오른쪽으로 옮긴다. 그러면 계수 행렬은 대각선과 그 바로 위아래에만 수가 있는 **삼중대각 행렬**이다[^4].

$$\begin{pmatrix}2 + h'\Delta x^2 & -1 & & \\ -1 & 2 + h'\Delta x^2 & -1 & \\ & \ddots & \ddots & \ddots\\ & & -1 & 2 + h'\Delta x^2\end{pmatrix}\begin{pmatrix}T_1\\ T_2\\ \vdots\\ T_{n-1}\end{pmatrix} = \begin{pmatrix}h'\Delta x^2T_a + T_0\\ h'\Delta x^2T_a\\ \vdots\\ h'\Delta x^2T_a + T_n\end{pmatrix}$$


삼중대각 연립방정식은 가우스 소거를 대각선 근처만 하는 토마스 알고리즘으로 $$O(n)$$ 연산에 푼다[^s1]. 이 행렬은 대각 우세($$2.04 > 1 + 1$$)라 [가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/)으로도 수렴한다.

중심 차분의 오차가 $$\Delta x^2$$에 비례하므로 결과의 오차도 $$\Delta x^2$$ 차수다[^s1].

## 활용

- 열 전도, 보의 처짐, 정전기 전위처럼 경계 조건이 양 끝에 있는 문제에 쓴다. 2차원·3차원으로 넓히면 격자의 연립방정식이 되어 큰 희소 행렬을 반복법으로 푼다(편미분방정식의 수치 풀이)[^s1].
- 사격법과 비교: 유한 차분법은 연립방정식 하나로 전체 해를 한 번에 얻고 선형이면 반복이 없다. 사격법은 이미 있는 초깃값 풀이(RK4)를 그대로 쓰고, 비선형에서도 근 찾기만 더하면 된다.
- 흔한 실수: 경계 값 $$T_0$$, $$T_n$$을 미지수에 넣는 것. 또 우변에 경계 값을 더하는 것을 첫 식과 마지막 식에서 빠뜨리는 것.

## 연결

- 선수: [사격법](/Hongs_Blog/studies/numerical-analysis/shooting-method/)(같은 문제, 다른 방법), [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)(삼중대각 소거)
- 큰 격자의 연립방정식: [야코비 방법과 가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/)
- 같은 중심 차분 공식: [헤세 행렬과 극값 판정](/Hongs_Blog/studies/calculus/hessian/)의 과목별 관점

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\frac{d^2T}{dx^2} + h'(T_a - T) = 0$$을 중심 차분으로 바꾼 안쪽 점의 식을 쓰라. 경계 값은 어디로 가나?</summary>

**답:** $$-T_{i-1} + (2 + h'\Delta x^2)T_i - T_{i+1} = h'\Delta x^2T_a$$. $$T_0$$는 첫 식, $$T_n$$은 마지막 식의 우변에 더한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$T'' = 0$$, $$T(0) = 0$$, $$T(3) = 3$$을 $$\Delta x = 1$$로 풀라.</summary>

**답:** 안쪽 점 둘: $$2T_1 - T_2 = 0$$, $$-T_1 + 2T_2 = 3$$. $$T_1 = 1$$, $$T_2 = 2$$. 참값 $$T = x$$와 같다(직선은 중심 차분이 정확하다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형 경계값 문제를 격자 점 1,000개에서 한 번에 풀고 싶다. 사격법과 유한 차분법 중 무엇이 자연스러운가? 다른 쪽은 왜 덜 맞는가?</summary>

**답:** 유한 차분법. 삼중대각 연립방정식 하나를 $$O(n)$$에 풀어 모든 격자 점의 값을 한 번에 얻는다. 사격법도 되지만 RK4로 두 번 끝까지 적분하고 보간해야 하며, 결과가 적분 걸음의 점에서만 나온다. 방정식이 비선형이고 RK 풀이가 이미 있으면 사격법이 편하다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/19.na19_diff_eq2.pdf, p.13
[^2]: 같은 자료, p.10
[^3]: 같은 자료, p.11
[^4]: 같은 자료, p.12
[^s1]: 에이전트 보충. 참값 비교와 간격 실험, 토마스 알고리즘, 대각 우세, 오차 차수, 활용, 사격법과의 비교, 흔한 실수, 카드 C2·C3은 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
