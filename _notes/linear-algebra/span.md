---
layout: "note"
title: "선형결합과 생성"
display_title: "선형결합과 생성 (Linear Combinations and Span)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Linear Combination", "선형결합", "일차결합", "Span", "생성", "생성하는 공간", "spanned subspace"]
description: "벡터 몇 개를 각각 늘이거나 줄여서 더한 것이 선형결합이고, 그렇게 만들 수 있는 모든 벡터의 모임이 생성(span)이다. 물감 세 가지를 비율만 바꿔 섞어 만들 수 있는 모든 색을 떠올리면 된다. \"이 목표에 닿을 수 있는가\"가 곧 \"연립방정식에 해가 있는가\"라서 선형대수의 거의…"
prev_url: "/studies/linear-algebra/dot-product/"
prev_title: "내적과 노름"
next_url: "/studies/linear-algebra/matrix-vector/"
next_title: "행렬과 행렬-벡터 곱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/span/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

벡터 몇 개를 각각 늘이거나 줄여서 더한 것이 선형결합이고, 그렇게 만들 수 있는 모든 벡터의 모임이 생성(span)이다. 물감 세 가지를 비율만 바꿔 섞어 만들 수 있는 모든 색을 떠올리면 된다. "이 목표에 닿을 수 있는가"가 곧 "연립방정식에 해가 있는가"라서 선형대수의 거의 모든 질문이 여기서 시작한다. 다만 벡터를 더 준다고 늘 닿는 곳이 넓어지지는 않는다. 새 벡터가 이미 만들 수 있는 것이면 생성은 그대로다.

</div>


## 예시로 보기

오른쪽으로 1·위로 1 가는 버튼 $$\mathbf{a} = (1, 1)$$과 오른쪽으로 1·위로 2 가는 버튼 $$\mathbf{b} = (1, 2)$$가 있다. 버튼을 원하는 만큼(음수·소수 허용) 눌러 $$(3, 5)$$에 갈 수 있을까?

$$c\,\mathbf{a} + d\,\mathbf{b} = (c + d,\ c + 2d) = (3, 5)$$에서 $$d = 2$$, $$c = 1$$이다. 갈 수 있다. 사실 두 버튼은 방향이 달라 평면의 어디든 갈 수 있다. 반면 $$\mathbf{a} = (1, 2)$$, $$\mathbf{b} = (2, 4)$$라면 $$\mathbf{b} = 2\mathbf{a}$$라서, 아무리 눌러도 직선 $$y = 2x$$ 위만 다닌다. 버튼이 아래 정의의 $$\mathbf{v}_i$$, 누르는 횟수가 계수 $$c_i$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- 벡터 $$\mathbf{v}_1, \dots, \mathbf{v}_k \in \mathbb{R}^n$$($$\in$$은 "~에 속한다")과 스칼라 $$c_1, \dots, c_k$$로 만든 $$c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k$$를 **선형결합**이라 한다.
- 가능한 모든 선형결합의 집합을 **생성**이라 하고 $$\operatorname{span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$$로 쓴다[^1].

</div>


생성은 늘 원점을 지난다(모든 계수를 0으로). 또 생성 안의 두 벡터를 더하거나 스칼라배해도 생성 안에 남는다. 그래서 생성은 원점을 지나는 "평평한" 모양이다.

| 벡터 | 생성의 모양 |
|---|---|
| $$\mathbf{0}$$ 하나 | 점(원점) |
| $$\mathbf{0}$$이 아닌 벡터 하나 | 원점을 지나는 직선 |
| 평행하지 않은 두 벡터 | 원점을 지나는 평면 |
| $$\mathbb{R}^3$$에서 한 평면에 있지 않은 세 벡터 | $$\mathbb{R}^3$$ 전체 |

"목표 $$\mathbf{b}$$가 생성 안에 있는가?"는 미지수 $$c_1, \dots, c_k$$에 대한 연립일차방정식 $$c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{b}$$에 해가 있는지와 같은 질문이다. 이것을 행렬로 쓴 것이 $$A\mathbf{x} = \mathbf{b}$$다([행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)).

## 예제

$$\mathbf{b} = (1, 3, 5)$$가 $$\mathbf{v}_1 = (1, 1, 1)$$, $$\mathbf{v}_2 = (0, 1, 2)$$의 생성 안에 있는가?

1. *식 세우기:* $$c_1 = 1$$, $$c_1 + c_2 = 3$$, $$c_1 + 2c_2 = 5$$.
2. *앞의 두 식으로 풀기:* $$c_1 = 1$$, $$c_2 = 2$$.
3. *셋째 식 확인:* $$1 + 4 = 5$$. 맞으므로 $$\mathbf{b} = \mathbf{v}_1 + 2\mathbf{v}_2$$다. 셋째 성분을 6으로 바꾸면 $$1 + 4 \ne 6$$이라 생성 밖이다. 두 벡터는 $$\mathbb{R}^3$$에서 평면 하나만 만든다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$(3, 5) = 1\cdot(1, 1) + 2\cdot(1, 2)$$, $$(1, 2)$$와 $$(2, 4)$$의 생성이 직선 $$y = 2x$$ 위, 두 방향이 다른 벡터로 무작위 점에 도달, 예제와 $$(1, 3, 6)$$의 판정, 생성이 덧셈·스칼라배에 닫힘, 카드의 값 — [03_span_verify.py](/Hongs_Blog/studies/linear-algebra/code/03_span_verify/)</div>

</div>


## 활용

- **색 혼합.** [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)에서 원색 세 개의 세기를 $$\mathbf{w}$$라 하면 만들어지는 색 반응은 원색 벡터들의 선형결합 $$P\mathbf{w}$$다. 모니터가 낼 수 있는 색의 범위는 세기가 0 이상이라는 제약이 붙은 결합의 모임이다[^s1].
- **데이터의 표현.** 얼굴 사진을 "기본 얼굴" 몇 장의 선형결합으로 근사하는 것이 차원 축소(주성분 분석)의 생각이다. 몇 장으로 충분한지는 생성이 얼마나 넓은지에 달려 있다([특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)).
- **흔한 실수.** 벡터가 $$k$$개면 생성이 $$k$$차원이라고 단정하는 것. 서로를 만들 수 있으면(선형종속) 더 좁다.

## 연결

- 선수: [벡터](/Hongs_Blog/studies/linear-algebra/vectors/)
- 이어지는 개념: [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/), [선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/)과 [기저](/Hongs_Blog/studies/linear-algebra/basis-dimension/)
- 다른 과목: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 $$P\mathbf{w} = \mathbf{r}$$

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$(3, 5)$$를 $$(1, 1)$$과 $$(1, 2)$$의 선형결합으로 쓰라.</summary>

**답:** $$c + d = 3$$, $$c + 2d = 5$$에서 $$d = 2$$, $$c = 1$$. $$(3, 5) = 1\cdot(1, 1) + 2\cdot(1, 2)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 어떤 벡터들의 생성이든 원점을 반드시 포함하는 이유는? 그래서 직선 $$y = x + 1$$이 생성이 될 수 없는 이유는?</summary>

**답:** 모든 계수를 0으로 두면 영벡터가 나온다. $$y = x + 1$$은 원점을 지나지 않으므로 어떤 벡터들의 생성도 될 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\mathbb{R}^3$$에서 $$\{(1, 2, 3), (2, 4, 6)\}$$과 $$\{(1, 2, 3), (0, 1, 0)\}$$의 생성은 각각 어떤 모양인가?</summary>

**답:** 앞의 것은 $$(2, 4, 6) = 2(1, 2, 3)$$이라 원점을 지나는 직선이다. 뒤의 것은 두 벡터가 평행하지 않아 원점을 지나는 평면이다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 1.1절 "Vectors and Linear Combinations", 3.1절 "Spaces of Vectors"(열들의 모든 결합).
[^s1]: 에이전트 보충. 음이 아닌 계수만 허용한 결합은 원뿔(원점에서 뻗는 부채꼴 모양)을 이룬다. 선형대수의 생성과 달리 모니터의 색 영역은 이 제약 때문에 모든 색을 포함하지 못한다.
{% endraw %}
