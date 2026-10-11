---
layout: "note"
title: "행렬과 행렬-벡터 곱"
display_title: "행렬과 행렬-벡터 곱 (Matrices and Matrix-Vector Products)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Matrix", "행렬", "Matrix-Vector Product", "행렬-벡터 곱", "열 관점", "column picture", "행 관점", "row picture", "연립일차방정식", "system of linear equations", "선형 함수", "linear map", "단위행렬", "identity matrix", "표준 기저", "standard basis"]
description: "행렬은 숫자를 직사각형으로 늘어놓은 표이자, 벡터를 받아 벡터를 내놓는 기계다. 행렬에 벡터를 곱하면 행렬의 열들을 벡터의 성분만큼씩 섞은 것이 나온다. 같은 계산을 각 행과의 내적으로 볼 수도 있다. 이 한 가지 연산으로 연립방정식, 신경망의 한 층, 그래픽스의 좌표 변환을 모두…"
prev_url: "/studies/linear-algebra/span/"
prev_title: "선형결합과 생성"
next_url: "/studies/linear-algebra/gaussian-elimination/"
next_title: "가우스 소거법"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/matrix-vector/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

행렬은 숫자를 직사각형으로 늘어놓은 표이자, 벡터를 받아 벡터를 내놓는 기계다. 행렬에 벡터를 곱하면 행렬의 열들을 벡터의 성분만큼씩 섞은 것이 나온다. 같은 계산을 각 행과의 내적으로 볼 수도 있다. 이 한 가지 연산으로 연립방정식, 신경망의 한 층, 그래픽스의 좌표 변환을 모두 "행렬 곱하기 벡터" 한 줄로 쓴다. 다만 행렬의 열 수와 벡터의 길이가 맞아야 곱이 정의되고, 곱한 결과에 고정된 벡터를 더하면 더 이상 선형이 아니다.

</div>


## 예시로 보기

공장이 제품 1을 $$x_1$$개, 제품 2를 $$x_2$$개 만든다. 제품 1개당 재료 사용량이 표와 같다.

| | 제품 1 | 제품 2 |
|---|---|---|
| 재료 1 | 2 | 1 |
| 재료 2 | 1 | 3 |

$$\mathbf{x} = (4, 5)$$개를 만들 때 재료 사용량을 두 방법으로 계산한다.

- **열 관점(제품별로 섞기):** $$4 \begin{pmatrix} 2 \\ 1 \end{pmatrix} + 5 \begin{pmatrix} 1 \\ 3 \end{pmatrix} = \begin{pmatrix} 13 \\ 19 \end{pmatrix}$$. 제품 하나가 쓰는 재료(열)를 개수만큼 더했다.
- **행 관점(재료별로 합산):** 재료 1은 $$(2, 1)\cdot(4, 5) = 13$$, 재료 2는 $$(1, 3)\cdot(4, 5) = 19$$.

거꾸로 "재료가 13, 19만큼 있을 때 몇 개씩 만들면 딱 맞게 쓰나"는 연립방정식 $$2x_1 + x_2 = 13$$, $$x_1 + 3x_2 = 19$$이다. 표가 아래 정의의 행렬 $$A$$, 개수가 $$\mathbf{x}$$, 재료량이 $$\mathbf{b}$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/04_matrix-vector_fig1.svg" alt="그림" width="577" height="333" loading="lazy">

왼쪽은 열 관점이다. 열 $$(2, 1)$$을 4번, 열 $$(1, 3)$$을 5번 이어 붙이면 $$(13, 19)$$에 닿는다. 오른쪽은 행 관점이다. 식 하나가 직선 하나이고, 두 직선이 만나는 $$(4, 5)$$가 답이다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- $$m \times n$$ **행렬** $$A$$는 $$m$$개의 행과 $$n$$개의 열로 늘어놓은 실수 $$a_{ij}$$($$i$$행 $$j$$열)의 표다. $$A \in \mathbb{R}^{m \times n}$$($$\in$$은 "~에 속한다")으로 쓰고, $$j$$번째 열을 $$\mathbf{a}_j \in \mathbb{R}^m$$으로 쓴다.
- $$\mathbf{x} \in \mathbb{R}^n$$에 대해 **행렬-벡터 곱**은 $$A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + \cdots + x_n\mathbf{a}_n \in \mathbb{R}^m$$이다(열들의 선형결합).
- 성분으로는 $$(A\mathbf{x})_i = \sum_{j=1}^{n} a_{ij}x_j$$($$\sum$$은 차례로 모두 더한다는 기호), 즉 $$A$$의 $$i$$번째 행과 $$\mathbf{x}$$의 내적이다[^1].

</div>


**동치인 다른 정의.** 열 관점과 행 관점은 같은 합 $$\sum_{i}\sum_{j} a_{ij}x_j$$를 열 단위로 묶느냐 행 단위로 묶느냐의 차이다. 열 관점은 "$$A\mathbf{x}$$는 [열들의 생성](/Hongs_Blog/studies/linear-algebra/span/) 안에 있다"를 바로 보여 주고, 행 관점은 손 계산과 내적의 해석에 편하다.

**선형성.** $$A(c\mathbf{x} + d\mathbf{y}) = cA\mathbf{x} + dA\mathbf{y}$$. 성분이 $$\sum_j a_{ij}x_j$$로 $$\mathbf{x}$$에 대해 일차식이기 때문이다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">선형 함수는 행렬이다</div>

함수 $$T: \mathbb{R}^n \to \mathbb{R}^m$$($$f: A \to B$$는 "$$A$$의 원소를 받아 $$B$$의 원소를 내놓는 함수 $$f$$")이 $$T(c\mathbf{x} + d\mathbf{y}) = cT(\mathbf{x}) + dT(\mathbf{y})$$를 만족하면, $$j$$번째 열이 $$T(\mathbf{e}_j)$$인 행렬 $$A$$에 대해 모든 $$\mathbf{x}$$에서 $$T(\mathbf{x}) = A\mathbf{x}$$이다. 여기서 $$\mathbf{e}_j$$는 $$j$$번째 성분만 1인 표준 기저 벡터다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. *표준 기저로 쪼개기:* $$\mathbf{x} = x_1\mathbf{e}_1 + \cdots + x_n\mathbf{e}_n$$.
2. *선형성:* $$T(\mathbf{x}) = x_1T(\mathbf{e}_1) + \cdots + x_nT(\mathbf{e}_n)$$.
3. *열 관점:* 우변은 열이 $$T(\mathbf{e}_j)$$인 행렬 $$A$$의 $$A\mathbf{x}$$ 정의 그 자체다. ∎

</details>


**설계 이유.** 행렬 곱을 "열들의 결합"으로 정의한 것은 위 정리 때문이다. 선형 함수는 표준 기저 벡터를 어디로 보내는지만 알면 전부 정해지고, 그 도착점들을 열로 적은 것이 행렬이다. 그래서 $$A\mathbf{e}_j = \mathbf{a}_j$$(단위벡터를 넣으면 열 하나가 나온다)이다.

**해당하는 예:** 단위행렬 $$I$$($$I\mathbf{x} = \mathbf{x}$$), 대각행렬 $$\operatorname{diag}(2, 3)$$(축마다 늘이기), $$x$$축으로의 사영 $$\begin{pmatrix}1 & 0\\0 & 0\end{pmatrix}$$. **해당하지 않는 예:** $$2 \times 3$$ 행렬과 길이 2인 벡터의 곱은 정의되지 않는다(열 수 3 ≠ 길이 2). 평행이동 $$\mathbf{x} \mapsto \mathbf{x} + \mathbf{b}$$($$\mathbf{b} \ne \mathbf{0}$$)는 $$\mathbf{0}$$을 $$\mathbf{b}$$로 보내므로 어떤 $$A\mathbf{x}$$로도 쓸 수 없다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계에서 선형성을 몇 번 쓰는가?</summary>

합이 $$n$$개 항이라 "합의 함숫값 = 함숫값의 합"을 되풀이하고(귀납적으로 $$n - 1$$번), 각 항에서 "상수배는 밖으로"를 쓴다. 정의의 $$T(c\mathbf{x} + d\mathbf{y}) = cT(\mathbf{x}) + dT(\mathbf{y})$$가 두 가지를 한꺼번에 담고 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계에서 우변이 곧 $$A\mathbf{x}$$인 이유는?</summary>

열 관점 정의가 $$A\mathbf{x} = x_1\mathbf{a}_1 + \cdots + x_n\mathbf{a}_n$$이고, 열을 $$\mathbf{a}_j = T(\mathbf{e}_j)$$로 골랐기 때문이다. 정의를 그대로 맞춰 읽은 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정리의 핵심 아이디어는?</summary>

선형 함수는 "기저 벡터를 어디로 보내는가"로 완전히 정해진다. 무한히 많은 입력의 행동이 $$n$$개의 값으로 요약된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

기저를 바꾸면 같은 선형변환이 다른 행렬로 보이는 [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/), 그리고 [생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/)처럼 수열 전체를 계수 몇 개로 다루는 곳.

</details>


## 예제

**연립방정식을 행렬로.** $$x + 2y + z = 2$$, $$3x + 8y + z = 12$$, $$4y + z = 2$$.

1. *계수를 행렬로:* $$A = \begin{pmatrix}1 & 2 & 1\\ 3 & 8 & 1\\ 0 & 4 & 1\end{pmatrix}$$, $$\mathbf{b} = (2, 12, 2)$$. 미지수가 없는 항($$3$$행의 $$x$$)은 0으로 적는다.
2. *한 줄로:* $$A\mathbf{x} = \mathbf{b}$$.
3. *열 관점의 질문:* $$\mathbf{b}$$가 $$A$$의 세 열의 선형결합인가? 답은 $$\mathbf{x} = (2, 1, -2)$$로, $$2\mathbf{a}_1 + \mathbf{a}_2 - 2\mathbf{a}_3 = (2 + 2 - 2,\ 6 + 8 - 2,\ 0 + 4 - 2) = (2, 12, 2)$$. 푸는 방법은 [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 13, 19(두 관점), 예제의 해, 무작위 행렬 1,000개에서 열 관점 = 행 관점, 선형성, 선형 함수가 열 $$T(\mathbf{e}_j)$$인 행렬과 같음, $$A\mathbf{e}_j = \mathbf{a}_j$$, 평행이동이 선형이 아님, 카드의 값 — [04_matrix-vector_verify.py](/Hongs_Blog/studies/linear-algebra/code/04_matrix-vector_verify/)</div>

</div>


## 활용

- **신경망의 층.** [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)의 $$\mathbf{o} = a(W\mathbf{x} + \mathbf{b})$$에서 $$W\mathbf{x}$$가 행렬-벡터 곱이다. 행 하나가 뉴런 하나의 가중치이고, 행 관점으로 보면 뉴런마다 입력과의 내적을 계산한다.
- **그래픽스.** 회전·늘이기·전단이 모두 $$A\mathbf{x}$$다. 평행이동까지 한 행렬로 쓰려고 좌표 끝에 1을 붙인 동차 좌표 $$(x, y, 1)$$을 쓴다. 그러면 $$\mathbf{x} + \mathbf{b}$$도 $$3 \times 3$$ 행렬 곱이 된다[^s1].
- **비용.** $$m \times n$$ 행렬과 벡터의 곱은 곱셈 $$mn$$번이다. 성분 대부분이 0인 희소 행렬은 0이 아닌 성분만 저장해 그 개수만큼만 계산한다.
- 알고리즘에서: [그래프 표현](/Hongs_Blog/studies/algorithms/graph-representation/)의 인접 리스트는 인접 행렬을 희소 행렬로 저장한 것이다. 점 10만 개, 양방향 간선 20만 개인 그래프는 인접 행렬로 100억 칸이지만, 인접 리스트로는 목록 길이의 합이 40만이다.

## 연결

- 선수: [선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/)(열 관점), [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)(행 관점)
- 이어지는 개념: [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/), [행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)
- 다른 과목: [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)의 $$\mathbf{o} = A\mathbf{x} + \mathbf{b}$$

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\mathbf{x} \mapsto A\mathbf{x} + \mathbf{b}$$도 선형변환이다"</div>

틀렸다. 그래프가 직선이라 "일차함수 = 선형"으로 배운 기억 때문에 그렇게 보인다. 하지만 선형이려면 $$T(\mathbf{0}) = \mathbf{0}$$이어야 하는데, $$A\mathbf{0} + \mathbf{b} = \mathbf{b}$$이다. 또 $$T(2\mathbf{x}) = 2A\mathbf{x} + \mathbf{b} \ne 2T(\mathbf{x}) = 2A\mathbf{x} + 2\mathbf{b}$$이다. 이런 함수는 아핀 함수라 부른다. 신경망에서는 치우침 $$\mathbf{b}$$를 가중치 행렬에 한 열로 넣고 입력 끝에 1을 붙여 선형 식처럼 다루기도 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$A = \begin{pmatrix}1 & 2\\ 3 & 4\\ 5 & 6\end{pmatrix}$$, $$\mathbf{x} = (2, -1)$$일 때 $$A\mathbf{x}$$를 열 관점과 행 관점으로 각각 계산하라.</summary>

**답:** 열 관점 $$2(1, 3, 5) - (2, 4, 6) = (0, 2, 4)$$. 행 관점 $$(1, 2)\cdot(2, -1) = 0$$, $$(3, 4)\cdot(2, -1) = 2$$, $$(5, 6)\cdot(2, -1) = 4$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 연립방정식 $$x - y = 1$$, $$2x + z = 0$$, $$y + 3z = 5$$를 $$A\mathbf{x} = \mathbf{b}$$로 쓰라.</summary>

**답:** $$A = \begin{pmatrix}1 & -1 & 0\\ 2 & 0 & 1\\ 0 & 1 & 3\end{pmatrix}$$, $$\mathbf{x} = (x, y, z)$$, $$\mathbf{b} = (1, 0, 5)$$. 없는 항은 0으로 적는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형 함수 $$T$$가 $$T(1, 0) = (2, 1)$$, $$T(0, 1) = (-1, 3)$$이면 $$T$$의 행렬은? 왜 이 두 값만으로 $$T$$가 정해지는가?</summary>

**답:** $$A = \begin{pmatrix}2 & -1\\ 1 & 3\end{pmatrix}$$(열이 두 도착점). 모든 $$(x, y) = x(1, 0) + y(0, 1)$$이고 선형성으로 $$T(x, y) = xT(1, 0) + yT(0, 1)$$이라, 표준 기저의 도착점만 알면 나머지가 모두 정해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$T(\mathbf{x}) = \mathbf{x} + (1, 0)$$이 선형이 아님을 보여라.</summary>

**답:** $$T(\mathbf{0}) = (1, 0) \ne \mathbf{0}$$. 또 $$T(2\mathbf{e}_1) = (3, 0)$$인데 $$2T(\mathbf{e}_1) = (4, 0)$$이다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 1.3절 "Matrices"(열들의 결합으로 본 $$A\mathbf{x}$$), 2.1절 "Vectors and Linear Equations"(행 그림과 열 그림, 성분별 계산).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 동차 좌표로 평행이동을 행렬 곱으로 쓰는 방법은 컴퓨터 그래픽스 교재의 표준 내용이다. 04_matrix-vector_verify.py에서 $$3 \times 3$$ 행렬로 평행이동이 되는 것을 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [04_matrix-vector_plot.py](/Hongs_Blog/studies/linear-algebra/code/04_matrix-vector_plot/)로 그렸고, $$4(2, 1) + 5(1, 3) = (13, 19)$$와 두 직선의 교점 $$(4, 5)$$를 같은 코드로 확인했다.
{% endraw %}
