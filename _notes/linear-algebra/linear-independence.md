---
layout: "note"
title: "선형독립"
display_title: "선형독립 (Linear Independence)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Linear Independence", "선형독립", "일차독립", "Linear Dependence", "선형종속", "일차종속", "다중공선성", "multicollinearity", "해밍 부호", "Hamming code"]
description: "벡터 몇 개가 선형독립이라는 것은 그중 어느 것도 나머지를 섞어서 만들 수 없다는 뜻이다. 즉 모두가 새로운 방향을 하나씩 보태고, 쓸데없이 겹치는 정보가 없다. 독립인 벡터로 만든 결합은 계수가 하나로 정해져서 \"몇 개씩 섞었는지\"를 되짚을 수 있다. 반대로 겹치는 벡터가 있으면…"
prev_url: "/studies/linear-algebra/lu-decomposition/"
prev_title: "LU 분해"
next_url: "/studies/linear-algebra/basis-dimension/"
next_title: "부분공간, 기저와 차원"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/linear-independence/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

벡터 몇 개가 선형독립이라는 것은 그중 어느 것도 나머지를 섞어서 만들 수 없다는 뜻이다. 즉 모두가 새로운 방향을 하나씩 보태고, 쓸데없이 겹치는 정보가 없다. 독립인 벡터로 만든 결합은 계수가 하나로 정해져서 "몇 개씩 섞었는지"를 되짚을 수 있다. 반대로 겹치는 벡터가 있으면 같은 결과를 여러 방법으로 만들 수 있어, 회귀 분석의 계수가 정해지지 않는 등의 문제가 생긴다. 두 개씩 평행하지 않다고 해서 전체가 독립인 것은 아니다.

</div>


## 예시로 보기

평면에서 $$(1, 0)$$, $$(0, 1)$$, $$(1, 1)$$을 본다. 어느 두 개도 평행하지 않지만, $$(1, 1) = (1, 0) + (0, 1)$$이라 셋째는 새 방향을 보태지 않는다. 그래서 $$(2, 3)$$을 $$2(1, 0) + 3(0, 1)$$으로도, $$1(1, 0) + 2(0, 1) + 1(1, 1)$$로도 만들 수 있다. 계수가 하나로 정해지지 않는다.

$$(1, 0)$$과 $$(0, 1)$$만 쓰면 $$(2, 3)$$을 만드는 방법은 계수 $$(2, 3)$$ 하나뿐이다. 이 두 벡터가 아래 정의의 독립인 모임, $$(1, 1)$$을 더한 셋이 종속인 모임이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

벡터 $$\mathbf{v}_1, \dots, \mathbf{v}_k$$가 **선형독립**이라는 것은

$$c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{0} \implies c_1 = \cdots = c_k = 0$$

이라는 뜻이다. 0이 아닌 계수로 $$\mathbf{0}$$을 만들 수 있으면 **선형종속**이다[^1].

</div>


**동치인 다른 정의.** 다음은 모두 같은 말이다.
1. $$\mathbf{v}_1, \dots, \mathbf{v}_k$$가 선형독립이다.
2. 어느 $$\mathbf{v}_i$$도 나머지의 선형결합이 아니다.
3. 생성 안의 모든 벡터가 **단 한 가지** 계수로 쓰인다.
4. 이 벡터들을 열로 세운 행렬 $$A$$에서 $$A\mathbf{c} = \mathbf{0}$$의 해는 $$\mathbf{c} = \mathbf{0}$$뿐이다. 곧 [소거](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)하면 모든 열에 피벗이 있다.

**설계 이유.** "어느 것도 나머지로 만들 수 없다"(2)를 그대로 정의하면 벡터마다 따로 확인해야 한다. "$$\mathbf{0}$$을 만드는 방법이 계수 전부 0뿐"(정의)은 한 번의 식으로 모두를 다루고, 곧바로 $$A\mathbf{c} = \mathbf{0}$$이라는 계산 문제가 된다.

**해당하는 예:** $$\mathbf{e}_1, \mathbf{e}_2, \mathbf{e}_3$$. $$(1, 2)$$와 $$(3, 1)$$. $$(1, 0, 0)$$, $$(1, 1, 0)$$, $$(1, 1, 1)$$(소거하면 피벗 3개). **해당하지 않는 예:** $$(1, 2)$$와 $$(2, 4)$$($$2\mathbf{v}_1 - \mathbf{v}_2 = \mathbf{0}$$). $$\mathbf{0}$$을 포함한 모임($$1 \cdot \mathbf{0} = \mathbf{0}$$).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">너무 많으면 종속</div>

$$\mathbb{R}^n$$의 벡터가 $$n$$개보다 많으면 반드시 선형종속이다.

</div>


## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**동치 (1 ⇔ 2).**
- *(종속 ⇒ 하나가 나머지의 결합):* $$c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{0}$$이고 $$c_i \ne 0$$이라 하자. $$c_i$$로 나누면 $$\mathbf{v}_i = -\sum_{j \ne i}\frac{c_j}{c_i}\mathbf{v}_j$$.
- *(하나가 나머지의 결합 ⇒ 종속):* $$\mathbf{v}_i = \sum_{j \ne i} d_j\mathbf{v}_j$$이면 $$\sum_{j \ne i} d_j\mathbf{v}_j - 1 \cdot \mathbf{v}_i = \mathbf{0}$$이고 $$\mathbf{v}_i$$의 계수 $$-1 \ne 0$$.

**동치 (1 ⇔ 3).** 같은 벡터를 두 계수로 쓰면 $$\sum c_j\mathbf{v}_j = \sum d_j\mathbf{v}_j$$에서 $$\sum (c_j - d_j)\mathbf{v}_j = \mathbf{0}$$이다. 독립이면 $$c_j = d_j$$, 곧 계수가 하나뿐이다. 거꾸로 $$\mathbf{0}$$도 생성 안의 벡터라 계수가 하나(모두 0)뿐이면 독립이다.

**너무 많으면 종속.** $$k > n$$개의 벡터를 열로 세우면 $$A$$는 $$n \times k$$ 행렬이다. 피벗은 행마다 많아야 하나라 $$n$$개 이하이고, 열이 $$k > n$$개이므로 피벗 없는 열(자유변수)이 생긴다. 그 자유변수를 1로 두면 $$A\mathbf{c} = \mathbf{0}$$의 0이 아닌 해가 나온다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 첫 번째 방향에서 $$c_i \ne 0$$인 $$i$$를 골라야 하는 이유는?</summary>

$$\mathbf{v}_i$$에 대해 풀려면 $$c_i$$로 나눠야 한다. 종속의 정의가 "적어도 하나는 0이 아니다"라서 그런 $$i$$가 반드시 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. "너무 많으면 종속"에서 피벗이 $$n$$개 이하인 이유는?</summary>

피벗은 서로 다른 행에 하나씩 놓인다. 행이 $$n$$개뿐이라 피벗도 $$n$$개를 넘을 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

"$$\mathbf{0}$$을 만드는 방법이 하나뿐인가"라는 한 질문으로 겹침(중복 정보)을 판정한다. 그 질문은 $$A\mathbf{c} = \mathbf{0}$$을 푸는 소거로 기계적으로 답한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각이 쓰이는 다른 상황은?</summary>

[가역 행렬 정리](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)의 "$$A\mathbf{x} = \mathbf{0}$$의 해가 0뿐"은 곧 열들이 독립이라는 말이다. 이산수학의 [합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)에서 "0이 되는 곱이 자명한 것뿐"(소거 가능성)도 비슷한 모양이다.

</details>


## 예제

$$(1, 1, 0)$$, $$(0, 1, 1)$$, $$(1, 0, 1)$$이 독립인지 판정한다.

1. *행렬:* 열로 세우면 $$\left(\begin{smallmatrix}1 & 0 & 1\\ 1 & 1 & 0\\ 0 & 1 & 1\end{smallmatrix}\right)$$.
2. *소거:* 2행 $$-$$ 1행 → $$(0, 1, -1)$$. 3행 $$-$$ 2행 → $$(0, 0, 2)$$.
3. *판정:* 피벗 1, 1, 2가 세 열 모두에 있어 독립이다. 같은 벡터에서 $$(1, 0, 1)$$을 $$(1, 2, 1)$$로 바꾸면 $$(1, 1, 0) + (0, 1, 1)$$이라 종속이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 두 계수 표현, 해당하는 예·않는 예, 동치 조건 1~4가 무작위 벡터 모임(정수, 유리수 소거)에서 같은 판정, $$n + 1$$개 벡터가 늘 종속, 예제와 카드의 판정, 해밍(7, 4) 부호의 최소 거리 3(전수) — [09_linear-independence_verify.py](/Hongs_Blog/studies/linear-algebra/code/09_linear-independence_verify/)</div>

</div>


## 활용

- **회귀의 다중공선성.** 입력 특징 중 하나가 다른 것들의 선형결합이면(예: 섭씨 온도와 화씨 온도를 둘 다 넣음) 데이터 행렬의 열이 종속이다. 그러면 최소제곱의 계수가 하나로 정해지지 않는다([최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)).
- **오류 정정 부호.** 선형 부호의 검사 행렬 $$H$$에서 어떤 $$d - 1$$개의 열도 독립이면, 서로 다른 부호어는 적어도 $$d$$자리가 다르다. 해밍(7, 4) 부호는 $$H$$의 열이 서로 다른 0이 아닌 3비트 벡터 7개라 두 열씩은 늘 독립이고(최소 거리 3), 한 비트 오류를 고친다[^s1].
- **흔한 실수.** 두 개씩 평행한지만 보고 독립이라 판정하는 것(아래 오해).

## 연결

- 선수: [선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/), [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)
- 이어지는 개념: [부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/), [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"어느 두 벡터도 평행하지 않으면 선형독립이다"</div>

틀렸다. 벡터가 두 개일 때는 "평행하지 않음 = 독립"이 맞아서 일반화하기 쉽다. 하지만 세 개 이상이면 한 벡터가 다른 **여러** 벡터의 결합일 수 있다. $$(1, 0)$$, $$(0, 1)$$, $$(1, 1)$$은 어느 두 개도 평행하지 않지만 $$(1, 1) = (1, 0) + (0, 1)$$이라 종속이다. 사실 $$\mathbb{R}^2$$의 벡터 세 개는 늘 종속이다. 판정은 쌍이 아니라 전체를 한 행렬로 소거해서 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 선형독립의 정의를 쓰고, 동치인 말을 하나 더 쓰라.</summary>

**답:** $$c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{0}$$이면 모든 $$c_i = 0$$. 동치: 어느 벡터도 나머지의 선형결합이 아니다(또는 생성 안의 벡터를 쓰는 계수가 하나뿐이다, 또는 열로 세운 행렬의 모든 열에 피벗이 있다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(1, 2, 3)$$, $$(4, 5, 6)$$, $$(7, 8, 9)$$가 독립인지 판정하라.</summary>

**답:** 종속이다. 열로 세워 소거하면 셋째 행이 0이 되어 피벗이 둘뿐이다. 실제로 $$(7, 8, 9) = 2(4, 5, 6) - (1, 2, 3)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어느 두 개도 평행하지 않은데 선형종속인 벡터 세 개를 들라.</summary>

**답:** $$(1, 0)$$, $$(0, 1)$$, $$(1, 1)$$. $$(1, 0) + (0, 1) - (1, 1) = \mathbf{0}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$\mathbb{R}^3$$의 벡터 네 개가 늘 종속인 이유를 소거로 설명하라.</summary>

**답:** 열로 세운 $$3 \times 4$$ 행렬은 피벗이 많아야 3개(행마다 하나)라 피벗 없는 열이 적어도 하나 있다. 그 자유변수를 1로 두면 $$A\mathbf{c} = \mathbf{0}$$의 0이 아닌 해가 생긴다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 3.4절 "Independence, Basis and Dimension"(독립의 정의, 영공간과의 관계, $$n$$개보다 많은 벡터는 종속).
[^s1]: 에이전트 보충. "검사 행렬의 어떤 $$d - 1$$개 열도 독립이면 최소 거리 $$\ge d$$"는 부호 이론 교재의 표준 결과이고, 여기서는 2진수(법 2) 위의 선형대수다. 해밍(7, 4) 부호의 모든 부호어 16개의 최소 무게가 3임을 09_linear-independence_verify.py에서 전수로 확인했다.
{% endraw %}
