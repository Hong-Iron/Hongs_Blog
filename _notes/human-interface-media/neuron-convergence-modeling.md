---
layout: "note"
title: "뉴런 수렴 모델링 연습"
display_title: "뉴런 수렴 모델링 연습"
kind: "practice"
kind_label: "연습"
num: "09"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 뉴런의 연산 모형 o' = a(A\\mathbf{x} + \\mathbf{b}), 뉴런의 수렴의 세 회로."
next_url: "/studies/human-interface-media/metamerism-ladder/"
next_title: "조건등색 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/neuron-convergence-modeling/"
---
{% raw %}
사용 개념: [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/) $$o' = a(A\mathbf{x} + \mathbf{b})$$, [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)의 세 회로.

강의 2 p.13~14는 세 회로의 그림과 그래프만 두고 오른쪽을 비워 두었다. 그 자리를 연산 모형으로 채우는 연습이다[^1]. 공통 설정: 수용기 1~7이 한 줄로 있고, 자극받은 수용기의 출력은 1, 아니면 0이다. 자극은 4 하나, 3~5, 2~6, 1~7 네 가지다. 출력은 뉴런 B 하나라서 $$A$$는 $$1 \times 7$$ 행렬, 곧 가중치 벡터 $$\mathbf{w}$$다. 바이어스는 0으로 둔다.

풀이 전략은 늘 같다. 회로 그림에서 "각 수용기가 B까지 어떤 부호로 몇 번 닿는가"를 세면 그것이 가중치다. 중간 뉴런(A, C)을 거치면 그 뉴런이 B에 닿는 부호를 곱한다. 그다음 네 자극을 넣어 그래프와 맞는지 확인한다.

## 문제 1 · 수렴 없는 회로

회로 1은 수용기마다 뉴런이 하나씩 있고, B는 수용기 4에만 연결된다. $$\mathbf{w}$$를 쓰고 네 자극에 대한 B를 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *가중치 세기:* B에 닿는 것은 수용기 4 하나, 흥분성. $$\mathbf{w} = (0, 0, 0, 1, 0, 0, 0)$$.
2. *자극 넣기:* 네 자극 모두 수용기 4를 포함하므로 $$\mathbf{w}\cdot\mathbf{x} = 1$$.
3. *결과:* $$(1, 1, 1, 1)$$. 그래프의 수평선과 같다. 자극이 넓어져도 B는 모른다.

</details>


## 문제 2 · 흥분성 수렴

회로 2는 1·2 → A, 6·7 → C로 모이고, 3·4·5와 A·C가 모두 흥분성으로 B에 닿는다. $$\mathbf{w}$$를 쓰고 네 자극에 대한 B를 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *가중치 세기:* 3·4·5는 B에 직접 +1. 1·2는 A를 거쳐 +1, 6·7은 C를 거쳐 +1. $$\mathbf{w} = (1, 1, 1, 1, 1, 1, 1)$$.
2. *자극 넣기:* B = 자극받은 수용기의 수.
3. *결과:* $$(1, 3, 5, 7)$$. 그래프의 직선과 같다.

</details>


## 문제 3 · 억제성 수렴

회로 3은 회로 2와 같되 A·C가 B에 억제성 시냅스로 닿는다. $$\mathbf{w}$$를 쓰고 네 자극에 대한 B를 구하라. 활성 함수가 없으면 어떤 문제가 생기는지도 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *가중치 세기:* 3·4·5는 +1. 1·2·6·7은 흥분성으로 A·C에 닿지만 A·C가 B를 억제하므로 부호가 뒤집혀 −1. $$\mathbf{w} = (-1, -1, 1, 1, 1, -1, -1)$$.
2. *자극 넣기:* 4 → 1. 3~5 → 3. 2~6 → $$3 - 2 = 1$$. 1~7 → $$3 - 4 = -1$$.
3. *활성 함수 적용:* 발화율은 음수가 될 수 없으므로 $$a(o) = \max(0, o)$$를 씌운다. 1~7 → 0.
4. *결과:* $$(1, 3, 1, 0)$$. 그래프는 3~5에서 봉우리이고 1~7에서 0에 가까운 값이다. 활성 함수가 없으면 −1이라는 불가능한 발화율이 나온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 회로의 네 값, 128가지 모든 자극에서 $$\max(0, \mathbf{w}\cdot\mathbf{x})$$와 회로 계산이 일치 — [09_neuron-convergence_verify.py](/Hongs_Blog/studies/human-interface-media/code/09_neuron-convergence_verify/)</div>

</div>


## 문제 4 · 가장 센 반응

회로 3에서 B가 가장 세게 반응하는 자극(자극받은 수용기의 집합)은 무엇인가? 그런 자극이 하나뿐인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *상한 구하기:* 양수 가중치는 3·4·5의 +1 셋뿐이라 $$\mathbf{w}\cdot\mathbf{x} \le 3$$.
2. *상한에 닿는 조건:* 3·4·5를 모두 자극하고, 음수 가중치 수용기(1·2·6·7)는 하나도 자극하지 않아야 한다.
3. *결론:* {3, 4, 5} 하나뿐이다. 수용장의 가운데를 딱 채우는 자극이 최대라는 [중심-주변 길항](/Hongs_Blog/studies/human-interface-media/center-surround/)의 성질이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$2^7 = 128$$가지 자극 전수 조사에서 최대 3은 {3, 4, 5}에서만 나옴 — [09_neuron-convergence_verify.py](/Hongs_Blog/studies/human-interface-media/code/09_neuron-convergence_verify/)</div>

</div>


## 변형 문제

1. 회로 3에서 억제성 시냅스의 세기를 0.5로 줄이면($$\mathbf{w} = (-0.5, -0.5, 1, 1, 1, -0.5, -0.5)$$) 네 자극에 대한 B는?
2. 빛이 약해 자극받은 수용기의 출력이 0.3뿐이고, B가 발화하려면 합이 1 이상이어야 한다(문턱 1). 일곱 수용기를 모두 자극할 때 회로 1과 회로 2의 B는 발화하는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$(1, 3, 2, 1)$$. 2~6: $$3 - 0.5 \times 2 = 2$$. 1~7: $$3 - 0.5 \times 4 = 1$$. 억제가 약해지면 봉우리 뒤로 덜 떨어진다.
2. 회로 1: 0.3 < 1이라 발화하지 않는다. 회로 2: $$7 \times 0.3 = 2.1 \ge 1$$이라 발화한다. 수렴이 약한 신호를 모아 문턱을 넘게 한다. 문턱이 있는 이 뉴런은 가중치가 모두 1이고 바이어스가 −1인 [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)과 같다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변형 1의 (1, 3, 2, 1), 변형 2의 0.3과 2.1 — [09_neuron-convergence_verify.py](/Hongs_Blog/studies/human-interface-media/code/09_neuron-convergence_verify/)</div>

</div>


[^1]: 에이전트 보충. 가중치 벡터로 푸는 방법은 슬라이드의 빈칸을 연산 모형으로 채운 것이다. 강의에서 교수님이 쓴 식과 표기가 다를 수 있다. 문제 4와 변형 문제는 원본에 없다.
{% endraw %}
