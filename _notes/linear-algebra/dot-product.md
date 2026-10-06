---
layout: "note"
title: "내적과 노름"
display_title: "내적과 노름 (Dot Product and Norm)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Dot Product", "내적", "점곱", "inner product", "Norm", "노름", "길이", "length", "단위벡터", "unit vector", "직교", "orthogonal", "수직", "코사인 유사도", "cosine similarity", "코시-슈바르츠 부등식", "Cauchy–Schwarz inequality", "삼각부등식", "triangle inequality"]
description: "두 벡터의 성분끼리 곱해 더한 수가 내적이다. 이 수는 \"두 화살표가 얼마나 같은 쪽을 향하는가\"를 재며, 같은 방향이면 크고, 수직이면 0, 반대면 음수다. 자기 자신과의 내적은 길이의 제곱이라, 길이·각도·수직을 모두 이것 하나로 계산한다. 추천 시스템의 유사도, 뉴런의 가중합…"
prev_url: "/studies/linear-algebra/vectors/"
prev_title: "벡터"
next_url: "/studies/linear-algebra/span/"
next_title: "선형결합과 생성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/dot-product/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 벡터의 성분끼리 곱해 더한 수가 내적이다. 이 수는 "두 화살표가 얼마나 같은 쪽을 향하는가"를 재며, 같은 방향이면 크고, 수직이면 0, 반대면 음수다. 자기 자신과의 내적은 길이의 제곱이라, 길이·각도·수직을 모두 이것 하나로 계산한다. 추천 시스템의 유사도, 뉴런의 가중합이 모두 내적이다. 다만 내적은 길이에도 비례하므로, 방향만 비교하려면 길이로 나눈 코사인 유사도를 써야 한다.

</div>


## 예시로 보기

상품 세 개(A, B, C)에 대한 평점 벡터를 본다. 나는 $$\mathbf{u} = (5, 1, 0)$$, 친구1은 $$\mathbf{v} = (4, 2, 0)$$, 친구2는 $$\mathbf{w} = (0, 1, 5)$$.

- $$\mathbf{u} \cdot \mathbf{v} = 5 \cdot 4 + 1 \cdot 2 + 0 \cdot 0 = 22$$. 둘 다 A를 좋아해 곱이 크다.
- $$\mathbf{u} \cdot \mathbf{w} = 0 + 1 + 0 = 1$$. 좋아하는 상품이 겹치지 않아 거의 0이다.

길이는 $$\Vert \mathbf{u}\Vert  = \sqrt{25 + 1} = \sqrt{26}$$, $$\Vert \mathbf{v}\Vert  = \sqrt{20}$$이고, $$\cos\theta = \frac{22}{\sqrt{26}\sqrt{20}} \approx 0.965$$라 사잇각은 약 15°다. 거의 같은 방향이다. 평점 벡터가 아래 정의의 $$\mathbf{u}$$, $$\mathbf{v}$$, 22가 $$\mathbf{u} \cdot \mathbf{v}$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$$($$\in$$은 "~에 속한다")에 대해
- **내적**: $$\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i = \mathbf{u}^\top\mathbf{v}$$($$\sum$$은 차례로 모두 더한다는 기호).
- **노름(길이)**: $$\Vert \mathbf{v}\Vert  = \sqrt{\mathbf{v} \cdot \mathbf{v}}$$. 길이가 1이면 **단위벡터**이고, $$\mathbf{v} \ne \mathbf{0}$$이면 $$\frac{\mathbf{v}}{\Vert \mathbf{v}\Vert }$$가 같은 방향의 단위벡터다.
- **사잇각**: $$\mathbf{u}, \mathbf{v} \ne \mathbf{0}$$이면 $$\cos\theta = \frac{\mathbf{u}\cdot\mathbf{v}}{\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert }$$($$0 \le \theta \le \pi$$). $$\mathbf{u}\cdot\mathbf{v} = 0$$이면 **직교**(수직)한다고 한다[^1].

</div>


내적은 순서를 바꿔도 같고($$\mathbf{u}\cdot\mathbf{v} = \mathbf{v}\cdot\mathbf{u}$$), 한쪽에 대해 선형이며($$(a\mathbf{u} + b\mathbf{w})\cdot\mathbf{v} = a\,\mathbf{u}\cdot\mathbf{v} + b\,\mathbf{w}\cdot\mathbf{v}$$), $$\mathbf{v}\cdot\mathbf{v} \ge 0$$이고 0은 $$\mathbf{v} = \mathbf{0}$$일 때뿐이다.

**동치인 다른 정의.** 평면과 공간에서 $$\mathbf{u}\cdot\mathbf{v} = \Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$이다(아래 증명). 성분으로 계산하는 대수적 정의와 길이·각으로 읽는 기하적 정의가 같은 수다. $$n$$차원에서는 이 식으로 각을 **정의**한다. 이때 $$\frac{\mathbf{u}\cdot\mathbf{v}}{\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert }$$가 $$-1$$과 1 사이에 들어 코사인 값이 될 수 있음을 보증하는 것이 코시–슈바르츠 부등식이다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">코시–슈바르츠 부등식과 삼각부등식</div>

$$\vert \mathbf{u}\cdot\mathbf{v}\vert  \le \Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert $$(등호는 한쪽이 다른 쪽의 스칼라배일 때). 그래서 $$\Vert \mathbf{u} + \mathbf{v}\Vert  \le \Vert \mathbf{u}\Vert  + \Vert \mathbf{v}\Vert $$.

</div>


**설계 이유.** 성분 곱의 합은 피타고라스 정리의 일반화다. $$\mathbf{v}\cdot\mathbf{v} = v_1^2 + \cdots + v_n^2$$가 길이의 제곱이 되도록 고른 것이고, 선형성 덕분에 식을 전개하듯 계산할 수 있다.

**해당하는 예:** $$(1, 2)\cdot(-2, 1) = 0$$(수직), $$(1, 1)\cdot(2, 2) = 4 = \sqrt2 \cdot 2\sqrt2$$(같은 방향, $$\cos\theta = 1$$), $$(1, 0)\cdot(-3, 0) = -3$$(반대 방향). **해당하지 않는 예:** 성분별 곱 $$(u_1v_1, u_2v_2)$$(하다마르 곱)는 수가 아니라 벡터라 내적이 아니다. $$\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert $$만 곱한 것은 방향 정보가 없어 내적이 아니다.

## 증명

기하적 정의는 코사인 법칙과 내적의 전개를 맞대어 얻고, 코시–슈바르츠는 음이 아닌 이차식의 판별식으로 얻는다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**기하적 정의.**
1. *코사인 법칙:* $$\mathbf{u}$$, $$\mathbf{v}$$, $$\mathbf{u} - \mathbf{v}$$가 이루는 삼각형에서 [코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/)으로 $$\Vert \mathbf{u} - \mathbf{v}\Vert ^2 = \Vert \mathbf{u}\Vert ^2 + \Vert \mathbf{v}\Vert ^2 - 2\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$.
2. *내적으로 전개:* 선형성으로 $$\Vert \mathbf{u} - \mathbf{v}\Vert ^2 = (\mathbf{u} - \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \Vert \mathbf{u}\Vert ^2 - 2\,\mathbf{u}\cdot\mathbf{v} + \Vert \mathbf{v}\Vert ^2$$.
3. *비교:* 두 식의 좌변이 같으므로 $$\mathbf{u}\cdot\mathbf{v} = \Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$.

**코시–슈바르츠.** $$\mathbf{v} \ne \mathbf{0}$$이라 하자(아니면 양변이 0).

{: start="4"}
4. *음이 아닌 이차식:* 모든 실수 $$t$$에서 $$0 \le \Vert \mathbf{u} + t\mathbf{v}\Vert ^2 = \Vert \mathbf{v}\Vert ^2 t^2 + 2(\mathbf{u}\cdot\mathbf{v})t + \Vert \mathbf{u}\Vert ^2$$.
5. *판별식:* 늘 0 이상인 이차식은 판별식이 0 이하다. $$4(\mathbf{u}\cdot\mathbf{v})^2 - 4\Vert \mathbf{u}\Vert ^2\Vert \mathbf{v}\Vert ^2 \le 0$$.
6. *삼각부등식:* $$\Vert \mathbf{u} + \mathbf{v}\Vert ^2 = \Vert \mathbf{u}\Vert ^2 + 2\,\mathbf{u}\cdot\mathbf{v} + \Vert \mathbf{v}\Vert ^2 \le \Vert \mathbf{u}\Vert ^2 + 2\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert  + \Vert \mathbf{v}\Vert ^2 = (\Vert \mathbf{u}\Vert  + \Vert \mathbf{v}\Vert )^2$$. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계에서 $$(\mathbf{u} - \mathbf{v})\cdot(\mathbf{u} - \mathbf{v})$$를 전개할 때 쓰는 성질은?</summary>

선형성과 대칭성이다. $$\mathbf{u}\cdot\mathbf{u} - \mathbf{u}\cdot\mathbf{v} - \mathbf{v}\cdot\mathbf{u} + \mathbf{v}\cdot\mathbf{v}$$에서 대칭성으로 가운데 두 항이 같아 $$-2\,\mathbf{u}\cdot\mathbf{v}$$가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 5단계의 "늘 0 이상이면 판별식 ≤ 0"은 왜 맞는가?</summary>

판별식이 양수면 서로 다른 두 실근이 있고, 최고차 계수 $$\Vert \mathbf{v}\Vert ^2 > 0$$인 포물선은 두 근 사이에서 음수가 된다. 늘 0 이상이라는 가정에 어긋난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명들의 핵심 아이디어는?</summary>

길이의 제곱을 내적으로 쓰고 전개한다. 기하의 사실(코사인 법칙)이나 부등식(0 이상)을 내적의 식으로 옮기면 필요한 관계가 한 줄로 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓸 수 있는 다른 상황은?</summary>

확률의 $$\vert \operatorname{Cov}(X, Y)\vert  \le \sigma_X\sigma_Y$$(상관계수가 $$-1$$과 1 사이)도 $$\operatorname{Var}(X + tY) \ge 0$$의 판별식으로 같은 방식으로 증명한다([공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)).

</details>


## 예제

$$\mathbf{a} = (1, 1, 0)$$과 $$\mathbf{b} = (1, 0, 1)$$의 사잇각.

1. *내적:* $$1 + 0 + 0 = 1$$.
2. *길이:* $$\Vert \mathbf{a}\Vert  = \Vert \mathbf{b}\Vert  = \sqrt2$$.
3. *각:* $$\cos\theta = \frac{1}{2}$$이라 $$\theta = 60°$$. 정육면체의 두 면 대각선 사이의 각이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 22, 1, $$\cos\theta \approx 0.965$$와 15°, 예제의 60°, 대수적 정의 = 기하적 정의(무작위 평면·공간 벡터), 코시–슈바르츠와 삼각부등식(무작위 1만 쌍, 등호 조건), 해당하는 예, 오해의 수치, 고차원 무작위 벡터의 코사인 — [02_dot-product_verify.py](/Hongs_Blog/studies/linear-algebra/code/02_dot-product_verify/)</div>

</div>


## 활용

- **유사도 검색.** 문서·이미지·사용자를 벡터로 만든 뒤 코사인 유사도 $$\frac{\mathbf{u}\cdot\mathbf{v}}{\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert }$$가 큰 것을 찾는다. 벡터를 미리 단위벡터로 바꿔 두면 내적만 계산하면 된다.
- **뉴런의 가중합.** [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)의 $$\mathbf{w}^\top\mathbf{x} + b$$는 입력과 가중치의 내적에 치우침을 더한 것이다. 내적이 $$-b$$보다 크냐 작으냐로 입력 공간을 초평면 $$\mathbf{w}^\top\mathbf{x} + b = 0$$의 양쪽으로 가른다.
- **그래픽스.** 면의 법선과 빛 방향의 내적으로 밝기를 정한다(램버트 조명). 법선과 시선의 내적 부호로 뒤쪽 면을 건너뛴다[^s1].
- **고차원의 성질.** 1000차원에서 무작위로 뽑은 두 벡터의 코사인은 거의 0이다(대부분 거의 수직). 그래서 고차원 임베딩에서는 코사인 0.3도 꽤 비슷한 편이다[^s1].

## 연결

- 선수: [벡터](/Hongs_Blog/studies/linear-algebra/vectors/), [코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/)
- 이어지는 개념: [행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)(각 행과의 내적), [직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)과 [최소제곱](/Hongs_Blog/studies/linear-algebra/least-squares/)
- 다른 과목: [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)의 가중합 $$\mathbf{w}^\top\mathbf{x} + b$$

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"내적이 클수록 두 벡터가 더 비슷하다"</div>

틀렸다. 내적이 방향이 같을 때 커지니 유사도처럼 쓰고 싶어진다. 하지만 내적은 길이에도 비례한다. $$\mathbf{q} = (1, 0)$$과 같은 방향인 $$(1, 0)$$의 내적은 1인데, 방향이 약 5.7° 다른 $$(10, 1)$$과의 내적은 10이다. 평점을 많이 매긴 사용자나 긴 문서가 무조건 "비슷한 것"으로 뽑힌다. 방향만 비교하려면 길이로 나눈 코사인 유사도를 쓴다. $$(1, 0)$$과는 1, $$(10, 1)$$과는 약 0.995다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 내적, 노름, 사잇각의 정의를 쓰라.</summary>

**답:** $$\mathbf{u}\cdot\mathbf{v} = \sum u_iv_i$$, $$\Vert \mathbf{v}\Vert  = \sqrt{\mathbf{v}\cdot\mathbf{v}}$$, $$\cos\theta = \frac{\mathbf{u}\cdot\mathbf{v}}{\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert }$$($$\mathbf{u}, \mathbf{v} \ne \mathbf{0}$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(1, 1, 0)$$과 $$(1, 0, 1)$$의 사잇각을 구하라.</summary>

**답:** 내적 1, 길이 모두 $$\sqrt2$$라 $$\cos\theta = \frac12$$, $$\theta = 60°$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 코사인 법칙으로 $$\mathbf{u}\cdot\mathbf{v} = \Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$를 끌어내는 과정에서, 비교하는 두 식은 각각 어디서 나오는가?</summary>

**답:** 하나는 삼각형의 코사인 법칙 $$\Vert \mathbf{u} - \mathbf{v}\Vert ^2 = \Vert \mathbf{u}\Vert ^2 + \Vert \mathbf{v}\Vert ^2 - 2\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$. 다른 하나는 내적의 선형성과 대칭성으로 전개한 $$\Vert \mathbf{u} - \mathbf{v}\Vert ^2 = \Vert \mathbf{u}\Vert ^2 - 2\,\mathbf{u}\cdot\mathbf{v} + \Vert \mathbf{v}\Vert ^2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 질의 벡터 $$\mathbf{q}$$와의 내적은 $$\mathbf{a}$$가 더 큰데, 코사인 유사도는 $$\mathbf{b}$$가 더 큰 예를 들라.</summary>

**답:** $$\mathbf{q} = (1, 0)$$, $$\mathbf{a} = (10, 1)$$, $$\mathbf{b} = (1, 0)$$. 내적은 10 대 1, 코사인은 약 0.995 대 1이다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 1.2절 "Lengths and Dot Products"(내적, 길이, 단위벡터, 코사인 공식, 코시–슈바르츠와 삼각부등식).
[^s1]: 에이전트 보충. 램버트 조명과 뒷면 제거는 컴퓨터 그래픽스 교재의 표준 내용이다. 고차원 무작위 벡터의 코사인이 0 근처에 모이는 것(1000차원에서 표준편차 약 $$1/\sqrt{1000} \approx 0.03$$)은 02_dot-product_verify.py에서 실험으로 확인했다.
{% endraw %}
