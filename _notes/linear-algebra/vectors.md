---
layout: "note"
title: "벡터"
display_title: "벡터 (Vectors)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Vector", "벡터", "스칼라", "scalar", "벡터 덧셈", "vector addition", "스칼라배", "scalar multiplication", "성분", "component", "영벡터", "zero vector", "위치 벡터", "변위"]
description: "벡터는 \"어느 쪽으로 얼마나\"를 나타내는 화살표이자, 숫자 몇 개를 순서대로 늘어놓은 목록이다. 할 수 있는 연산은 두 가지뿐이다. 화살표를 이어 붙이는 덧셈과, 길이를 늘이거나 줄이는 수배(스칼라배)다. 게임 캐릭터의 속도, 데이터 한 행(키, 몸무게, 나이), 단어의 임베딩이 …"
next_url: "/studies/linear-algebra/dot-product/"
next_title: "내적과 노름"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/vectors/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

벡터는 "어느 쪽으로 얼마나"를 나타내는 화살표이자, 숫자 몇 개를 순서대로 늘어놓은 목록이다. 할 수 있는 연산은 두 가지뿐이다. 화살표를 이어 붙이는 덧셈과, 길이를 늘이거나 줄이는 수배(스칼라배)다. 게임 캐릭터의 속도, 데이터 한 행(키, 몸무게, 나이), 단어의 임베딩이 모두 벡터이고, 같은 두 연산으로 다룬다. 다만 "위치"와 "이동"을 구별하지 않거나 단위가 다른 성분을 섞으면, 계산은 되지만 뜻이 없는 결과가 나온다.

</div>


## 예시로 보기

게임 캐릭터가 점 $$(1, 2)$$에 있고, 1초에 오른쪽으로 3, 위로 4만큼 움직인다. 속도를 $$\mathbf{v} = (3, 4)$$로 쓴다.

- 1초 뒤 위치: $$(1, 2) + (3, 4) = (4, 6)$$. 이동(화살표)을 위치에 이어 붙였다.
- 달리기 버튼으로 속도가 두 배: $$2\mathbf{v} = (6, 8)$$. 방향은 같고 길이만 두 배다.
- 바람 $$\mathbf{w} = (-1, 0)$$이 더해지면 실제 속도는 $$\mathbf{v} + \mathbf{w} = (2, 4)$$. 두 화살표를 이어 붙인 결과다.

같은 $$\mathbf{v}$$를 "길이 5, 오른쪽 위로 약 53°"로도 쓸 수 있다. $$(5\cos 53.13°, 5\sin 53.13°) \approx (3, 4)$$이다([삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)). 숫자 목록 $$(3, 4)$$가 아래 정의의 성분, 2가 스칼라다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- $$n$$개의 실수를 세로로 늘어놓은 $$\mathbf{v} = \begin{pmatrix} v_1 \\ \vdots \\ v_n \end{pmatrix}$$를 $$\mathbb{R}^n$$의 **벡터**라 하고, $$v_i$$를 **성분**이라 한다. 지면에서는 $$(v_1, \dots, v_n)$$로도 쓴다.
- **덧셈**: $$\mathbf{u} + \mathbf{v} = (u_1 + v_1, \dots, u_n + v_n)$$. **스칼라배**: $$c\mathbf{v} = (cv_1, \dots, cv_n)$$($$c \in \mathbb{R}$$).
- 모든 성분이 0인 **영벡터** $$\mathbf{0}$$, 방향을 뒤집은 $$-\mathbf{v} = (-1)\mathbf{v}$$[^1].

</div>


두 연산은 성분마다 하는 보통의 덧셈·곱셈이라 익숙한 법칙이 그대로 성립한다. $$\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$$, $$(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$$, $$\mathbf{v} + \mathbf{0} = \mathbf{v}$$, $$\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$$, $$c(\mathbf{u} + \mathbf{v}) = c\mathbf{u} + c\mathbf{v}$$, $$(c + d)\mathbf{v} = c\mathbf{v} + d\mathbf{v}$$, $$c(d\mathbf{v}) = (cd)\mathbf{v}$$, $$1\mathbf{v} = \mathbf{v}$$. 이 여덟 법칙만 쓰면 되는 대상은 모두 벡터처럼 다룰 수 있다([추상 벡터공간](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/)).

**화살표와 목록의 대응.** 평면에서 크기 $$r$$, 방향각 $$\theta$$인 화살표는 $$(r\cos\theta, r\sin\theta)$$다. 덧셈은 화살표의 꼬리를 앞 화살표의 머리에 붙이는 것(평행사변형 법칙), 스칼라배는 같은 직선 위에서 늘이는 것($$c < 0$$이면 방향이 뒤집힌다)이다. 화살표 그림은 2·3차원에서만 그릴 수 있지만, 목록은 1000차원에서도 똑같이 계산된다.

## 예제

$$\mathbf{u} = (2, -1, 3)$$, $$\mathbf{v} = (1, 4, 0)$$일 때 $$2\mathbf{u} - 3\mathbf{v}$$.

1. *스칼라배:* $$2\mathbf{u} = (4, -2, 6)$$, $$3\mathbf{v} = (3, 12, 0)$$.
2. *빼기:* $$(4 - 3, -2 - 12, 6 - 0) = (1, -14, 6)$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 위치·속도 계산, 크기 5·각 53.13°와 $$(3, 4)$$의 대응, 여덟 법칙(무작위 벡터 1,000개, 유리수로 정확히), 예제와 카드의 값, 점의 중점이 좌표계를 옮겨도 같은 점이라는 것 — [01_vectors_verify.py](/Hongs_Blog/studies/linear-algebra/code/01_vectors_verify/)</div>

</div>


## 활용

- **데이터 한 행.** 표의 한 행(키 170, 몸무게 65, 나이 21)은 $$\mathbb{R}^3$$의 벡터다. 기계학습의 입력은 대부분 이런 벡터다. 단어나 이미지를 수백 차원 벡터로 바꾼 것이 임베딩이다.
- **그래픽스와 물리.** 위치, 속도, 힘, 법선이 모두 3차원 벡터다. 매 프레임 "위치 += 속도 × 시간 간격"으로 움직인다.
- **배열 연산.** NumPy의 `u + v`, `2 * v`가 성분별 연산이다. GPU가 수천 개 성분을 한꺼번에 계산하는 이유는 성분끼리 서로 기다릴 필요가 없기 때문이다.
- 알고리즘에서: 격자 문제의 방향 배열은 상하좌우 이동 벡터 네 개를 리스트에 담아 두고 지금 칸의 위치에 더한다([구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)). 세 점 $$o, p, q$$가 어느 쪽으로 꺾는지 보는 외적도 점 좌표를 그대로 곱하지 않고 차이 $$p - o$$, $$q - o$$로 계산한다. 원점을 옮기면 점 좌표는 바뀌지만 차이(이동)는 그대로이기 때문이다([계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)).

## 연결

- 선수: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)(방향각과 성분), [극좌표](/Hongs_Blog/studies/college-math/polar-parametric/)
- 이어지는 개념: [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)(길이와 각), [선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\mathbf{u} = (2, -1, 3)$$, $$\mathbf{v} = (1, 4, 0)$$일 때 $$2\mathbf{u} - 3\mathbf{v}$$를 구하라.</summary>

**답:** $$(4, -2, 6) - (3, 12, 0) = (1, -14, 6)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 크기 2, 방향각 60°인 평면 벡터를 성분으로 쓰고, 이 벡터를 $$-1.5$$배한 화살표를 말로 설명하라.</summary>

**답:** $$(2\cos 60°, 2\sin 60°) = (1, \sqrt3)$$. $$-1.5$$배는 $$(-1.5, -1.5\sqrt3)$$로, 방향이 정반대(240°)이고 길이가 3이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 위치(점) $$P$$, $$Q$$를 더한 $$P + Q$$는 뜻이 없는데 중점 $$\frac{P + Q}{2}$$는 뜻이 있는 이유는?</summary>

**답:** 좌표의 원점을 $$\mathbf{a}$$만큼 옮기면 두 점의 좌표가 모두 $$\mathbf{a}$$만큼 바뀐다. $$P + Q$$는 $$2\mathbf{a}$$만큼 바뀌어 원점을 어디에 두느냐에 따라 다른 점이 된다. $$\frac{P + Q}{2}$$는 정확히 $$\mathbf{a}$$만큼 바뀌어 늘 같은 점을 가리킨다. 계수의 합이 1인 결합만 좌표계와 상관없는 점이다[^s1].

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 1.1절 "Vectors and Linear Combinations"(벡터의 덧셈, 스칼라배, 세로 벡터 표기).
[^s1]: 에이전트 보충. 점과 벡터를 구별하고 계수 합이 1인 결합(아핀 결합)만 점으로 보는 관점은 컴퓨터 그래픽스 교재의 표준 내용이다. 01_vectors_verify.py에서 원점을 옮겨 확인했다.
{% endraw %}
