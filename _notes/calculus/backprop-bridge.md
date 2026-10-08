---
layout: "note"
title: "연쇄 법칙 ↔ 역전파"
display_title: "연쇄 법칙 ↔ 역전파: 계산 그래프를 거꾸로 훑으며 야코비를 곱한다"
kind: "concept"
kind_label: "브리지"
num: "22"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Chain Rule and Backpropagation", "역전파", "backpropagation", "오차 역전파", "자동미분", "automatic differentiation", "역방향 모드", "reverse mode", "순방향 모드", "forward mode", "계산 그래프", "computational graph"]
description: "신경망을 학습시키는 역전파는 새로운 수학이 아니라, 다변수 연쇄 법칙을 계산 그래프 위에서 출력 쪽부터 거꾸로 적용하는 방법이다. 연쇄 법칙의 \"길을 따라 곱하고, 여러 길은 더한다\"가 역전파의 \"간선을 따라 기울기를 곱해 내려보내고, 한 노드에 모이면 더한다\"와 같다. 출력이 손…"
prev_url: "/studies/calculus/multivariable-chain-rule/"
prev_title: "다변수 연쇄 법칙과 야코비 행렬"
next_url: "/studies/calculus/hessian/"
next_title: "헤세 행렬과 극값 판정"
math: true
mermaid: false
code_count: 2
permalink: "/studies/calculus/backprop-bridge/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신경망을 학습시키는 역전파는 새로운 수학이 아니라, 다변수 연쇄 법칙을 계산 그래프 위에서 출력 쪽부터 거꾸로 적용하는 방법이다. 연쇄 법칙의 "길을 따라 곱하고, 여러 길은 더한다"가 역전파의 "간선을 따라 기울기를 곱해 내려보내고, 한 노드에 모이면 더한다"와 같다. 출력이 손실 하나일 때 거꾸로 계산하면, 가중치가 수백만 개여도 모든 기울기를 함수 계산 몇 번 값의 비용으로 얻는다. 다만 앞으로 계산한 중간값을 모두 저장해야 해서 메모리가 들고, 미분할 수 없는 점에서는 약속이 필요하다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다. $$x = 2$$, $$y = 3$$에서 $$f = (x + y)\cdot y$$를 본다.

| 미분적분학: 연쇄 법칙으로 손 계산 | 계산 그래프: 역전파 |
|---|---|
| $$u = x + y = 5$$, $$f = uy = 15$$ | 앞으로: $$x, y \to (+) \to u \to (\times) \to f$$, 그리고 $$y$$가 $$(\times)$$에도 직접 들어간다 |
| $$\frac{\partial f}{\partial x} = \frac{\partial f}{\partial u}\frac{\partial u}{\partial x} = y \cdot 1 = 3$$ | 뒤로: $$f$$의 기울기 1 → $$(\times)$$가 $$u$$ 쪽으로 $$1 \times y = 3$$ → $$(+)$$가 $$x$$로 그대로 3 |
| $$\frac{\partial f}{\partial y} = \frac{\partial f}{\partial u}\frac{\partial u}{\partial y} + \frac{\partial f}{\partial y}\Big\vert _{\text{직접}} = 3 + 5 = 8$$ | $$y$$로 두 간선이 돌아온다: $$(+)$$ 쪽에서 3, $$(\times)$$ 쪽에서 $$1 \times u = 5$$. 더해 8 |

<details class="callout callout-info" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 다변수 연쇄 법칙 | 역전파(역방향 자동미분) | 공통 구조 |
|---|---|---|
| 중간 변수 $$u$$ | 그래프의 노드 | 계산의 단계 |
| 국소 편미분 $$\frac{\partial u}{\partial x}$$ | 간선에 붙은 국소 도함수 | 한 단계의 민감도 |
| 길을 따라 곱하기 | 기울기를 간선 따라 곱해 내려보내기 | 합성의 미분 |
| 여러 길의 합 | 한 노드에 모이는 기울기를 더하기(`grad +=`) | 영향의 중첩 |
| 야코비 곱 $$J_L\cdots J_2J_1$$ | 출력 쪽부터 벡터–야코비 곱 $$((\mathbf{g}^\top J_L)J_{L-1})\cdots$$ | 행렬 곱의 결합 순서 |

역전파는 야코비 행렬들을 **왼쪽(출력)부터** 묶어 곱하는 것이다. 출력이 스칼라면 왼쪽 끝이 행벡터라 매번 "벡터 × 행렬"만 계산한다[^1].

</details>


## 어디까지 같은가

- **곱하는 순서가 비용을 가른다.** 수학적으로는 [행렬 곱의 결합법칙](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)으로 어느 순서든 같다. 하지만 출력 1개, 입력 $$n$$개, 층이 $$L$$개인 $$n \times n$$ 야코비들이면, 왼쪽부터(역방향) 곱하면 곱셈 약 $$Ln^2$$번, 오른쪽부터(순방향) 곱하면 약 $$Ln^3$$번이다. 입력은 적고 출력이 많으면 반대로 순방향이 유리하다.
- **메모리.** 역방향으로 국소 도함수를 계산하려면 앞으로 계산한 중간값이 필요해, 층의 활성값을 모두 저장한다. 메모리를 줄이려고 일부만 저장하고 다시 계산하기도 한다(체크포인팅)[^1].
- **미분할 수 없는 점.** ReLU $$\max(0, x)$$는 0에서 미분할 수 없다. 자동미분 라이브러리는 그 점의 도함수를 0 같은 값으로 약속해 쓴다.
- **수치 미분과는 다르다.** 자동미분은 차분으로 어림하지 않고 정확한 도함수 공식을 쓰므로 반올림 오차만 있다. [수치 미분](/Hongs_Blog/studies/calculus/derivative/)의 $$h$$ 선택 문제가 없다.

## 이 연결로 얻는 것

- **싼 기울기.** 스칼라 손실의 기울기 전체를 함수를 한 번 계산하는 비용의 몇 배 이내로 얻는다(싼 기울기 원리)[^2]. 수치 미분으로는 가중치마다 함수를 두 번 불러야 해서 수백만 개의 가중치에서는 불가능하다.
- **검산.** 직접 짠 역전파는 작은 입력에서 [중앙 차분](/Hongs_Blog/studies/calculus/partial-derivatives/)과 비교해 확인한다(기울기 검사).
- **구현.** 스칼라 역방향 자동미분의 최소 구현: [22_backprop-bridge_impl.py](/Hongs_Blog/studies/calculus/code/22_backprop-bridge_impl/). [뉴런](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/) 하나 $$(\sigma(\mathbf{w}^\top\mathbf{x} + b) - t)^2$$의 기울기를 이것으로 계산해 수치 미분과 맞춰 본다.
- 알고리즘에서: 역전파는 노드마다 기울기를 한 번만 구해 다시 쓰는 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)이라, 입력에서 출력까지 가는 길이 아무리 많아도 계산은 간선 수에 비례한다. 야코비를 곱할 순서를 고르는 일은 [구간 DP](/Hongs_Blog/studies/algorithms/interval-dp/)의 행렬 곱셈 순서 문제이고, 층마다 폭이 다르면 왼쪽부터가 늘 가장 싸지는 않다. 위 구현의 `backward()`는 출력에서 시작한 [DFS](/Hongs_Blog/studies/algorithms/dfs/)가 끝나는 순서를 거꾸로 훑어(위상 정렬), 한 노드에 기울기가 다 모인 뒤에 넘긴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 비교 표의 3과 8, 자동미분 구현이 무작위 뉴런 손실 200개에서 중앙 차분과 일치, 카드 C2의 18과 6, 전이 문제의 64와 32, 곱셈 순서에 따른 비용 $$Ln^2$$ 대 $$Ln^3$$(세기) — [22_backprop-bridge_verify.py](/Hongs_Blog/studies/calculus/code/22_backprop-bridge_verify/)</div>

</div>


## 전이 문제

스프레드시트에서 $$A = 2$$, $$B = 3$$이고 $$C = A \times B$$, $$D = C + A$$, $$E = D^2$$이다. $$E$$가 $$A$$와 $$B$$에 얼마나 민감한지($$\frac{\partial E}{\partial A}$$, $$\frac{\partial E}{\partial B}$$)를 셀을 거꾸로 따라가며 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

앞으로: $$C = 6$$, $$D = 8$$, $$E = 64$$. 뒤로: $$\frac{\partial E}{\partial D} = 2D = 16$$. $$D = C + A$$라 $$C$$와 $$A$$로 각각 16이 간다. $$C = AB$$라 $$A$$로 $$16 \times B = 48$$, $$B$$로 $$16 \times A = 32$$가 간다. $$A$$에는 두 길이 모여 $$16 + 48 = 64$$. 그래서 $$\frac{\partial E}{\partial A} = 64$$, $$\frac{\partial E}{\partial B} = 32$$다. 셀 참조 그래프가 계산 그래프이고, 한 셀이 여러 곳에서 쓰이면 기울기가 더해진다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 계산 그래프 $$x, y \to u = x + y$$, $$f = u \cdot y$$에서 $$\frac{\partial f}{\partial y}$$를 연쇄 법칙의 식으로 쓰고, 그래프에서 어느 두 길에 대응하는지 말하라.</summary>

**답:** $$\frac{\partial f}{\partial y} = \frac{\partial f}{\partial u}\frac{\partial u}{\partial y} + \frac{\partial f}{\partial y}\big\vert _{u\text{ 고정}} = y \cdot 1 + u$$. 첫 항은 $$y \to (+) \to u \to (\times) \to f$$ 길, 둘째 항은 $$y \to (\times) \to f$$로 바로 가는 길이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$f = (xy + x)^2$$에서 $$x = 1$$, $$y = 2$$일 때 역전파로 $$\frac{\partial f}{\partial x}$$, $$\frac{\partial f}{\partial y}$$를 구하라.</summary>

**답:** 앞으로 $$u = xy + x = 3$$, $$f = 9$$. 뒤로 $$\frac{\partial f}{\partial u} = 2u = 6$$. $$\frac{\partial u}{\partial x} = y + 1 = 3$$이라 $$\frac{\partial f}{\partial x} = 18$$. $$\frac{\partial u}{\partial y} = x = 1$$이라 $$\frac{\partial f}{\partial y} = 6$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 출력이 손실 하나이고 가중치가 수백만 개일 때 역방향(출력부터) 곱이 순방향보다 훨씬 싼 이유를 행렬 크기로 설명하라.</summary>

**답:** 맨 왼쪽의 손실 기울기가 $$1 \times n$$ 행벡터라, 출력부터 곱하면 매 단계가 "행벡터 × 행렬"($$n^2$$번)이다. 입력부터 곱하면 "행렬 × 행렬"($$n^3$$번)을 되풀이하게 된다. 결과는 결합법칙으로 같지만 비용이 $$n$$배 차이 난다.

</details>


## 출처

[^1]: Goodfellow, Bengio, Courville, *Deep Learning*, 6.5절 "Back-Propagation and Other Differentiation Algorithms"(계산 그래프, 연쇄 법칙의 재귀적 적용, 메모리와 비용).
[^2]: Griewank, Walther, *Evaluating Derivatives* 2판, 3장(역방향 모드와 기울기 계산 비용의 상수배 한계).
{% endraw %}
