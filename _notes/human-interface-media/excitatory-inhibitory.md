---
layout: "note"
title: "흥분성과 억제성 시냅스"
display_title: "흥분성과 억제성 시냅스 (Excitatory & Inhibitory)"
kind: "concept"
kind_label: "모델"
num: "06"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
aliases: ["Excitatory & Inhibitory", "흥분", "억제", "흥분성", "억제성", "탈분극", "depolarization", "과분극", "hyperpolarization", "문턱", "threshold"]
description: "시냅스는 다음 뉴런에 \"발화해라\" 또는 \"참아라\" 두 종류의 쪽지를 보낸다. 흥분성 신호는 막전위를 발화 문턱 쪽으로 올리고, 억제성 신호는 문턱에서 멀어지게 내린다. 뉴런은 두 신호를 합친 결과로 발화 빈도를 정한다. 억제가 있어서 신경계는 신호를 더하기만 하지 않고 빼기도 한다…"
prev_url: "/studies/human-interface-media/rate-coding/"
prev_title: "발화율 부호화"
next_url: "/studies/human-interface-media/neuron-computational-model/"
next_title: "뉴런의 연산 모형"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/excitatory-inhibitory/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시냅스는 다음 뉴런에 "발화해라" 또는 "참아라" 두 종류의 쪽지를 보낸다. 흥분성 신호는 막전위를 발화 문턱 쪽으로 올리고, 억제성 신호는 문턱에서 멀어지게 내린다. 뉴런은 두 신호를 합친 결과로 발화 빈도를 정한다. 억제가 있어서 신경계는 신호를 더하기만 하지 않고 빼기도 한다. 뒤에 나올 대비 강조가 이 빼기에서 나온다.

</div>


## 예시로 보기

슬라이드 p.10 왼쪽 그래프는 막전위의 두 방향을 보여 준다[^1].

| | 흥분성 (Excitatory) | 억제성 (Inhibitory) |
|---|---|---|
| 막전위 변화 | −70 mV에서 위로(0 쪽으로) 올라간다: 탈분극(depolarization) | −70 mV에서 아래로 내려간다: 과분극(hyperpolarization) |
| 발화 문턱(점선)과의 관계 | 문턱에 가까워진다 | 문턱에서 멀어진다 |
| 결과 | 발화가 쉬워진다 | 발화가 어려워진다 |

오른쪽 그림은 흥분성 시냅스(E)와 억제성 시냅스(I)를 함께 받는 뉴런이다[^1]. 위에서 아래로 (a) 흥분이 훨씬 셈 → (e) 억제가 훨씬 셈 순서로 두 입력의 비율을 바꾼다. 자극을 켜면 (a)에서는 발화가 크게 늘고, 아래로 갈수록 줄다가, (e)에서는 자극이 있는 동안 발화가 멈춘다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

뉴런은 흥분성 입력의 합과 억제성 입력의 합을 모두 받는다. 막전위가 발화 문턱을 넘으면 활동 전위가 생긴다. 흥분이 우세할수록 발화율이 오르고, 억제가 우세할수록 자발 발화보다도 내려간다[^1].

</div>


발화율을 식 하나로 줄이면 이렇게 쓸 수 있다[^s1].

$$
r = \max\bigl(0,\ r_0 + g\,(x_{+} - x_{-})\bigr)
$$


$$r_0$$는 자발 발화율, $$x_{+}$$와 $$x_{-}$$는 흥분성·억제성 입력의 합, $$g > 0$$은 민감도다. 억제가 아무리 커도 발화율은 0 밑으로 내려가지 않는다. (e)에서 발화가 멈추는 것이 바로 이 바닥이다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "교감/부교감 신경 구조 Excitatory & Inhibitory" (강의 2 p.16 요약) / 문제점: 교감·부교감 신경은 자율신경계의 두 갈래로, 심장 박동·소화 같은 기관의 활동을 서로 반대로 조절한다. p.10이 다루는 것은 뉴런 하나에 들어오는 시냅스 입력의 두 종류(흥분성·억제성)다. 서로 다른 층위의 개념이다. / 수정안: "흥분성/억제성 시냅스 구조" / 근거: p.10의 제목과 그림은 시냅스 수준의 탈분극·과분극을 다룬다. 교감·부교감은 표준 생리학 용어로 자율신경계의 구분이다. "서로 반대로 작용하는 두 신호"라는 비유로 쓴 표현일 수 있다.

</div>


## 연결

- 선수: [뉴런과 신호 전달](/Hongs_Blog/studies/human-interface-media/neuron-signaling/), [발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/)
- 흥분은 양수 가중치, 억제는 음수 가중치가 된다: [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)
- 억제가 공간적으로 배치되면: [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)의 회로 3, [중심-주변 길항](/Hongs_Blog/studies/human-interface-media/center-surround/), [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 흥분성 입력과 억제성 입력이 막전위를 각각 어느 쪽으로 움직이는지, 이름(탈분극·과분극)과 발화 문턱과의 관계까지 쓰라.</summary>


**답:** 흥분성은 막전위를 올린다(탈분극). 문턱에 가까워져 발화가 쉬워진다. 억제성은 막전위를 내린다(과분극). 문턱에서 멀어져 발화가 어려워진다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 흥분성·억제성 시냅스를 함께 받는 뉴런이 있다. 흥분이 훨씬 셀 때, 둘이 비슷할 때, 억제가 훨씬 셀 때 자극을 켜면 발화율이 각각 어떻게 되는가?</summary>


**답:** 흥분이 훨씬 셀 때: 크게 늘어난다. 비슷할 때: 자발 발화 근처에서 크게 변하지 않는다. 억제가 훨씬 셀 때: 자발 발화보다 줄고, 충분히 세면 자극이 있는 동안 멈춘다.  
**이유:** 발화율은 흥분과 억제의 차이로 정해지고, 0 밑으로는 내려가지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "흥분성·억제성 시냅스"와 "교감·부교감 신경"은 같은 것인가? 각각 무엇을 가리키는지 쓰라.</summary>


**답:** 다르다. 흥분성·억제성은 뉴런 하나에 들어오는 시냅스 입력이 발화를 돕는지 막는지의 구분이다. 교감·부교감은 자율신경계의 두 갈래로, 기관(심장, 소화기 등)의 활동을 서로 반대로 조절한다.  
**참고:** 강의 2 요약 슬라이드는 둘을 같은 줄에 적었다. 원본 오류 의심으로 기록해 두었다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.10 (Excitatory & Inhibitory)
[^s1]: 에이전트 보충. 발화율 식은 원본에 없다. p.10의 (a)~(e) 결과를 한 줄로 요약하는 설명용 모형이며, [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)의 $$a(Ax + b)$$에서 가중치가 두 개인 경우와 같다.
{% endraw %}
