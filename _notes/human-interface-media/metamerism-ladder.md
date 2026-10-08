---
layout: "note"
title: "조건등색 예제 사다리"
display_title: "조건등색 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "17"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 삼색 이론의 반응 rk = \\sum\\lambda i(\\lambda)\\,\\sigmak(\\lambda)(\\sum은 차례로 모두 더한다는 기호), 조건등색의 판정 \"세 반응이 모두 같다\"."
prev_url: "/studies/human-interface-media/neuron-convergence-modeling/"
prev_title: "뉴런 수렴 모델링 연습"
next_url: "/studies/human-interface-media/lateral-inhibition-ladder/"
next_title: "측면 억제 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/metamerism-ladder/"
---
{% raw %}
사용 개념: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 반응 $$r_k = \sum_\lambda i(\lambda)\,\sigma_k(\lambda)$$($$\sum$$은 차례로 모두 더한다는 기호), [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)의 판정 "세 반응이 모두 같다".

빛을 파장 칸 네 개의 세기로 나타낸 장난감 세계다. 추상체 민감도 표는 모든 문제에 같다[^s1].

| 추상체 | 칸 1 | 칸 2 | 칸 3 | 칸 4 |
|---|---|---|---|---|
| S | 6 | 3 | 0 | 0 |
| M | 2 | 5 | 6 | 4 |
| L | 0 | 1 | 4 | 6 |

이 기법을 떠올리는 신호는 "스펙트럼(칸별 세기)이 다른 두 빛이 같은 색으로 보이는가"를 묻는 문제다. 풀이는 늘 같은 하위목표로 나뉜다. 각 빛의 세 반응을 표의 행과 곱해 더해 구하고, 세 반응을 비교한다.

## 문제 1 · 완전한 풀이

빛 P = (1, 2, 1, 1)과 빛 Q = (2, 0, 3, 0)은 조건등색인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *반응 계산법 세우기:* 추상체 $$k$$의 반응 = (표의 $$k$$ 행) · (빛의 칸별 세기). 칸마다 곱해 더한다.
2. *P의 반응:* S $$= 6 \cdot 1 + 3 \cdot 2 = 12$$. M $$= 2 + 10 + 6 + 4 = 22$$. L $$= 0 + 2 + 4 + 6 = 12$$. → (12, 22, 12)
3. *Q의 반응:* S $$= 6 \cdot 2 = 12$$. M $$= 4 + 0 + 18 + 0 = 22$$. L $$= 0 + 0 + 12 + 0 = 12$$. → (12, 22, 12)
4. *비교해 결론:* 세 반응이 모두 같다. 스펙트럼은 다르지만(P는 네 칸 모두, Q는 칸 1·3만) 같은 색으로 보이는 조건등색이다.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

빛 R = (0, 2, 0, 1)과 빛 T = (1, 0, 2, 0)은 조건등색인가?

1. *반응 계산법 세우기:* 표의 행과 빛의 칸별 세기를 곱해 더한다.
2. *R의 반응:* S $$= 6$$. M $$= 10 + 4 = 14$$. L $$= 2 + 6 = 8$$. → (6, 14, 8)
3. *T의 반응:* S $$= 6$$. M $$= 2 + 12 = 14$$. L $$= 8$$. → (6, 14, 8)
4. *비교해 결론:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

세 반응이 모두 (6, 14, 8)로 같으므로 조건등색이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

빛 U = (1, 1, 1, 1)과 빛 W = (1, 1, 2, 0)은 조건등색인가? 아니라면 어느 추상체가 차이를 알아채는가?

1. *반응 계산법 세우기:* 표의 행과 빛의 칸별 세기를 곱해 더한다.
2. *U의 반응:* ______
3. *W의 반응:* ______
4. *비교해 결론:* 세 반응을 성분별로 비교한다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. U: S $$= 9$$, M $$= 17$$, L $$= 11$$ → (9, 17, 11)
3. W: S $$= 9$$, M $$= 2 + 5 + 12 = 19$$, L $$= 1 + 8 = 9$$ → (9, 19, 9)
4. S는 같지만 M과 L이 다르다. 조건등색이 아니다. M과 L 추상체가 차이를 알아챈다.

</details>


## 문제 4 · 독립 문제

빛 Y = (2, 4, 1, 1)과 조건등색이면서 Y와 다른 빛을 하나 찾으라. 그런 빛은 몇 개나 있는가? (빛의 세기는 어느 칸에서도 음수가 될 수 없다.)

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

Y의 반응은 (24, 34, 14)다. 표의 세 행에 모두 곱해 0이 되는 방향 $$\mathbf{v} = (1, -2, 2, -1)$$이 있다(S: $$6 - 6 = 0$$, M: $$2 - 10 + 12 - 4 = 0$$, L: $$-2 + 8 - 6 = 0$$). 그래서 $$Y + t\,\mathbf{v}$$는 모두 Y와 반응이 같다.<br>
음수 칸이 없으려면 $$2 + t \ge 0$$, $$4 - 2t \ge 0$$, $$1 + 2t \ge 0$$, $$1 - t \ge 0$$이다. 곧 $$-\tfrac{1}{2} \le t \le 1$$.<br>
예: $$t = 1$$이면 (3, 2, 3, 0). 반응을 다시 계산하면 S $$= 18 + 6 = 24$$, M $$= 6 + 10 + 18 = 34$$, L $$= 2 + 12 = 14$$로 같다.<br>
$$t$$가 그 구간의 어떤 실수여도 되므로 조건등색인 빛은 무수히 많다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 계수 3과 영공간 방향 $$\mathbf{v}$$, 네 문제의 반응 값, 문제 4의 허용 범위 $$-\tfrac12 \le t \le 1$$과 $$t = 1$$의 빛 — [17_metamerism_verify.py](/Hongs_Blog/studies/human-interface-media/code/17_metamerism_verify/)</div>

</div>


## 변형 문제

1. 빛 X = (3, 0, 0, 1)과 조건등색인 다른 빛이 이 세계에 있는가?
2. 실제 눈에서는 조건등색이 이 장난감 세계보다 훨씬 흔하다. 칸의 개수로 이유를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 없다. $$X + t\,\mathbf{v} = (3 + t,\ -2t,\ 2t,\ 1 - t)$$에서 칸 2가 음수가 아니려면 $$t \le 0$$, 칸 3이 음수가 아니려면 $$t \ge 0$$이라 $$t = 0$$뿐이다. 조건등색은 "보이지 않는 방향"이 있어도 세기가 음수가 될 수 없다는 제약에 막힐 수 있다.
2. 이 세계는 칸 4개에 추상체 3개라 보이지 않는 방향이 $$4 - 3 = 1$$개뿐이다. 실제 스펙트럼은 10 nm 간격으로만 나눠도 31칸이라 보이지 않는 방향이 28개다. 방향이 많을수록 음수 제약을 피해 갈 길이 많아 조건등색 빛이 훨씬 많다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변형 1은 $$t$$를 −3~3에서 0.01 간격으로 훑어 $$t = 0$$만 허용됨을 확인, 변형 2의 28차원은 가우스 모형 31칸 행렬에서 확인 — [17_metamerism_verify.py](/Hongs_Blog/studies/human-interface-media/code/17_metamerism_verify/)</div>

</div>


[^s1]: 에이전트 보충. 이 문서의 민감도 표와 빛은 모두 설명용 가상 수치다. 표는 조건등색 쌍이 정수로 나오도록 만들었고, 실제 추상체 민감도가 아니다.
{% endraw %}
