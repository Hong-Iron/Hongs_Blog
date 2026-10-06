---
layout: "note"
title: "부분공간, 기저와 차원"
display_title: "부분공간, 기저와 차원 (Subspaces, Bases and Dimension)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Subspace", "부분공간", "Basis", "기저", "Dimension", "차원", "좌표", "coordinates", "표준 기저", "standard basis"]
description: "원점을 지나는 직선이나 평면처럼, 안에서 더하고 늘여도 밖으로 나가지 않는 \"평평한 공간\"이 부분공간이다. 그 공간의 모든 점을 빠짐없이, 그리고 겹침 없이 만들어 내는 최소한의 벡터 모음이 기저이고, 기저에 든 벡터의 개수가 차원이다. 기저를 정하면 공간의 모든 점에 좌표(계수)…"
prev_url: "/studies/linear-algebra/linear-independence/"
prev_title: "선형독립"
next_url: "/studies/linear-algebra/four-subspaces/"
next_title: "랭크와 네 부분공간"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/basis-dimension/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

원점을 지나는 직선이나 평면처럼, 안에서 더하고 늘여도 밖으로 나가지 않는 "평평한 공간"이 부분공간이다. 그 공간의 모든 점을 빠짐없이, 그리고 겹침 없이 만들어 내는 최소한의 벡터 모음이 기저이고, 기저에 든 벡터의 개수가 차원이다. 기저를 정하면 공간의 모든 점에 좌표(계수)가 하나씩 붙는다. 기저를 고르는 방법은 무수히 많지만 개수는 늘 같아서, 차원은 공간 자체의 성질이다.

</div>


## 예시로 보기

$$\mathbb{R}^3$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체)에서 세 성분의 합이 0인 벡터들, 곧 평면 $$x + y + z = 0$$을 본다. 두 벡터가 이 평면에 있으면 합과 스칼라배도 성분 합이 0이라 평면을 벗어나지 않는다. 원점도 들어 있다.

평면 위의 벡터 $$(x, y, z)$$는 $$z = -x - y$$라 $$(x, y, -x - y) = x(1, 0, -1) + y(0, 1, -1)$$로 쓸 수 있다. 두 벡터 $$(1, 0, -1)$$, $$(0, 1, -1)$$은 평면을 빠짐없이 만들고(생성), 서로 평행하지 않다(독립). 그래서 이 평면의 기저이고 차원은 2다. 예를 들어 $$(2, 3, -5)$$의 좌표는 $$(2, 3)$$이다. 평면이 아래 정의의 부분공간 $$V$$, 두 벡터가 기저다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- $$\mathbb{R}^n$$의 부분집합 $$V$$가 $$\mathbf{0}$$을 포함하고, 덧셈과 스칼라배에 닫혀 있으면($$\mathbf{u}, \mathbf{v} \in V$$, $$c \in \mathbb{R}$$이면 $$\mathbf{u} + \mathbf{v}, c\mathbf{u} \in V$$) **부분공간**이다.
- $$V$$의 **기저**는 $$V$$를 생성하는 선형독립인 벡터 모음이다.
- $$V$$의 **차원** $$\dim V$$는 기저에 든 벡터의 개수다. $$\{\mathbf{0}\}$$의 차원은 0이다[^1].

</div>


**동치인 다른 정의.** $$V$$의 벡터 모음 $$\mathcal{B} = \{\mathbf{v}_1, \dots, \mathbf{v}_k\}$$에 대해 다음은 같다.
1. $$\mathcal{B}$$는 기저다(생성하고 독립).
2. $$V$$의 모든 벡터가 $$\mathcal{B}$$의 선형결합으로 **정확히 한 가지 방법**으로 쓰인다.
3. $$\mathcal{B}$$는 $$V$$를 생성하는 모음 중 가장 작다(하나라도 빼면 생성하지 못한다).
4. $$\mathcal{B}$$는 $$V$$의 독립인 모음 중 가장 크다(하나라도 더하면 종속이 된다).

**설계 이유.** 생성은 "빠짐없이", 독립은 "겹침 없이"를 보장한다. 둘을 함께 요구하면 좌표가 존재하고(생성) 하나로 정해진다(독립). 그래서 부분공간의 점을 숫자 $$k$$개로 다룰 수 있다.

**해당하는 예:** $$\mathbb{R}^n$$ 전체(표준 기저 $$\mathbf{e}_1, \dots, \mathbf{e}_n$$, 차원 $$n$$), 원점을 지나는 직선(차원 1), 위의 평면(차원 2). **해당하지 않는 예:** 직선 $$y = x + 1$$은 원점을 지나지 않아 부분공간이 아니다. $$\{(1, 0), (0, 1), (1, 1)\}$$은 $$\mathbb{R}^2$$를 생성하지만 종속이라 기저가 아니다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">차원은 잘 정의된다</div>

부분공간 $$V$$의 기저는 여러 개일 수 있지만, 모든 기저는 벡터의 개수가 같다.

</div>


## 증명

핵심은 "벡터 $$k$$개로 생성되는 공간에서는 $$k$$개보다 많은 벡터가 늘 종속"이라는 보조정리다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**보조정리.** $$V = \operatorname{span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$$이고 $$\mathbf{w}_1, \dots, \mathbf{w}_m \in V$$, $$m > k$$이면 $$\mathbf{w}$$들은 종속이다.
1. *$$\mathbf{w}$$를 $$\mathbf{v}$$로 쓰기:* 각 $$\mathbf{w}_j = \sum_i a_{ij}\mathbf{v}_i$$. 계수를 모은 $$k \times m$$ 행렬 $$A = (a_{ij})$$에 대해 $$W = VA$$($$V$$, $$W$$는 벡터들을 열로 세운 행렬)다.
2. *$$A$$의 영공간:* $$A$$는 열($$m$$)이 행($$k$$)보다 많아 $$A\mathbf{c} = \mathbf{0}$$에 0이 아닌 해가 있다([너무 많으면 종속](/Hongs_Blog/studies/linear-algebra/linear-independence/)과 같은 이유).
3. *결론:* 그 $$\mathbf{c}$$에 대해 $$W\mathbf{c} = VA\mathbf{c} = \mathbf{0}$$. 곧 $$\mathbf{w}$$들의 0이 아닌 결합이 $$\mathbf{0}$$이다.

**정리.** 두 기저 $$\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$$, $$\{\mathbf{w}_1, \dots, \mathbf{w}_m\}$$이 있다고 하자. $$\mathbf{w}$$들은 독립이고 $$\mathbf{v}$$들이 생성하는 공간에 있으므로 보조정리로 $$m \le k$$. 역할을 바꾸면 $$k \le m$$. 그래서 $$k = m$$. ∎

동치 조건 2는 [선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/)의 "계수가 하나뿐" 동치에서 바로 나온다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 보조정리 1단계의 $$W = VA$$는 어떤 뜻인가?</summary>

행렬 곱의 열 관점이다. $$VA$$의 $$j$$번째 열은 $$V$$의 열들을 $$A$$의 $$j$$열 계수로 섞은 $$\sum_i a_{ij}\mathbf{v}_i = \mathbf{w}_j$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 정리에서 보조정리를 "두 번" 쓰는 이유는?</summary>

한 번은 "$$\mathbf{v}$$들이 생성하고 $$\mathbf{w}$$들이 독립"이라 $$m \le k$$, 다른 한 번은 역할을 바꿔 $$k \le m$$을 얻는다. 기저는 생성과 독립을 모두 가져서 양쪽 방향을 다 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

독립인 벡터의 개수는 생성하는 벡터의 개수를 넘을 수 없다. 기저는 둘 다라서 개수가 한 가지로 고정된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

[랭크](/Hongs_Blog/studies/linear-algebra/four-subspaces/)가 소거 순서와 상관없이 정해지는 이유, [신장 트리](/Hongs_Blog/studies/discrete-math/trees/)의 간선 수가 어떤 신장 트리를 골라도 $$n - 1$$인 것과 같은 모양의 "최소 = 최대" 논증이다.

</details>


## 예제

$$V = \{(x_1, x_2, x_3, x_4) : x_1 + x_2 = 0,\ x_3 = 2x_4\}$$의 기저와 차원.

1. *자유로운 값 고르기:* $$x_2 = s$$, $$x_4 = t$$로 두면 $$x_1 = -s$$, $$x_3 = 2t$$.
2. *벡터로 나누기:* $$(-s, s, 2t, t) = s(-1, 1, 0, 0) + t(0, 0, 2, 1)$$.
3. *판정:* 두 벡터가 $$V$$를 생성하고, 서로 다른 자리에 0이 아닌 성분이 있어 독립이다. 기저이고 $$\dim V = 2$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 평면의 닫힘과 기저·좌표 $$(2, 3)$$, 예제의 기저, 무작위 부분공간에서 서로 다른 기저 두 개의 개수가 같음, 보조정리($$m > k$$면 종속, 무작위), 동치 조건(좌표 유일성, 최소 생성, 최대 독립), 합집합이 부분공간이 아님 — [10_basis-dimension_verify.py](/Hongs_Blog/studies/linear-algebra/code/10_basis-dimension_verify/)</div>

</div>


## 활용

- **데이터의 진짜 차원.** 1000차원 데이터라도 점들이 50차원 부분공간 근처에 몰려 있으면 좌표 50개로 거의 손실 없이 나타낼 수 있다. 그 부분공간을 찾는 것이 주성분 분석이다([특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)).
- **좌표계 선택.** 같은 공간도 기저에 따라 좌표가 달라진다. 계산이 쉬워지는 기저를 고르는 것이 [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)이다.
- **자유도.** 기저의 크기는 "마음대로 정할 수 있는 수의 개수"다. [소거](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)에서 자유변수의 개수가 해 공간의 차원이다.
- 알고리즘에서: 간선 a–b를 'a 칸 1, b 칸 −1, 나머지 0'인 벡터로 적으면, 고리가 없는 간선 모음이 곧 선형독립인 모음이다. [최소 신장 트리](/Hongs_Blog/studies/algorithms/mst/)의 크루스칼은 싼 간선부터 보며 이미 고른 간선들과 독립인 것만 남기니, 기저를 하나씩 모으는 셈이다. 그래서 점이 $$n$$개인 연결 그래프면 끝났을 때 간선이 늘 $$n - 1$$개다.

## 연결

- 선수: [선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/)
- 이어지는 개념: [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/), [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/), [추상 벡터공간](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"공간마다 기저는 하나로 정해져 있다"</div>

틀렸다. 표준 기저 $$\mathbf{e}_1, \mathbf{e}_2$$를 먼저 배워서 기저가 공간에 붙어 있는 것처럼 느껴진다. 하지만 $$\mathbb{R}^2$$에서 평행하지 않은 아무 두 벡터, 예를 들어 $$(1, 1)$$과 $$(1, -1)$$도 기저다. 기저는 무수히 많고, 정해져 있는 것은 **개수**(차원)뿐이다. 그래서 문제에 맞는 기저를 고르는 것이 선형대수의 중요한 기술이 된다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 부분공간, 기저, 차원의 정의를 쓰라.</summary>

**답:** 부분공간은 $$\mathbf{0}$$을 포함하고 덧셈·스칼라배에 닫힌 집합. 기저는 그 공간을 생성하는 선형독립인 벡터 모음. 차원은 기저의 벡터 개수.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\{(x, y, z) : x + y + z = 0\}$$의 기저를 하나 쓰고 차원을 구하라.</summary>

**답:** $$(1, 0, -1)$$, $$(0, 1, -1)$$(또는 $$(1, -1, 0)$$, $$(1, 0, -1)$$ 등). 차원 2.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 기저가 주어지면 각 벡터의 좌표가 하나로 정해지는 이유는?</summary>

**답:** 생성하므로 좌표가 있다. 두 좌표 $$\mathbf{c}$$, $$\mathbf{d}$$가 있다면 $$\sum(c_i - d_i)\mathbf{v}_i = \mathbf{0}$$이고, 기저가 독립이라 $$c_i = d_i$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 두 부분공간의 합집합이 부분공간이 아닌 예를 들라.</summary>

**답:** $$x$$축과 $$y$$축의 합집합. $$(1, 0)$$과 $$(0, 1)$$은 들어 있지만 합 $$(1, 1)$$은 어느 축에도 없어 덧셈에 닫혀 있지 않다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 3.1절 "Spaces of Vectors"(부분공간), 3.4절 "Independence, Basis and Dimension"(기저, 차원, 모든 기저의 크기가 같음).
{% endraw %}
