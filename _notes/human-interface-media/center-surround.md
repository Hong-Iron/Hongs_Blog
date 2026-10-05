---
layout: "note"
title: "중심-주변 길항"
display_title: "중심-주변 길항 (Center-surround Antagonism)"
kind: "concept"
kind_label: "모델"
num: "10"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
aliases: ["Center-surround Antagonism", "중심-주변", "길항 작용", "Antagonism", "수용장", "receptive field", "흥분성 중심", "억제성 주변"]
description: "과녁 모양의 감지 구역을 가진 뉴런이다. 과녁 가운데에 자극이 오면 신나게 발화하고, 둘레에 오면 오히려 발화를 줄인다. 그래서 넓고 고른 자극에는 둔하고, 가운데와 둘레의 차이, 곧 경계나 작은 점에 민감하다. 가운데를 딱 채우는 크기의 자극에 가장 세게 반응한다."
prev_url: "/studies/human-interface-media/neuron-convergence/"
prev_title: "뉴런의 수렴"
next_url: "/studies/human-interface-media/wave-and-light/"
next_title: "파동과 빛"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/center-surround/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

과녁 모양의 감지 구역을 가진 뉴런이다. 과녁 가운데에 자극이 오면 신나게 발화하고, 둘레에 오면 오히려 발화를 줄인다. 그래서 넓고 고른 자극에는 둔하고, 가운데와 둘레의 차이, 곧 경계나 작은 점에 민감하다. 가운데를 딱 채우는 크기의 자극에 가장 세게 반응한다.

</div>


## 예시로 보기

원숭이 팔의 피부 한 곳을 누르면 반응하는 뉴런이 있다. 이 뉴런에 영향을 주는 피부 구역이 그 뉴런의 수용장(receptive field)이다. 수용장의 가운데는 흥분성, 둘레는 억제성이다[^1][^s1].

같은 수용장에 크기가 다른 자극을 준다[^1].

| 자극 | 덮는 곳 | 발화 |
|---|---|---|
| (a) | 가운데 안의 작은 점 | 늘어난다 |
| (b) | 가운데를 딱 채움 | 가장 많다 |
| (c) | 가운데 + 둘레 일부 | 줄어든다 |
| (d) | 가운데 + 둘레 전부 | 더 줄어든다 |

(b)에서 (d)로 갈수록 자극은 커지는데 반응은 작아진다. 둘레에 닿은 자극이 가운데의 흥분을 깎기 때문이다. 이것이 길항(antagonism), 곧 서로 반대로 작용해 효과를 줄이는 관계다.

[뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)의 회로 3이 이 구조의 1차원판이다. 수용기 3~5가 가운데, 1·2·6·7이 둘레이고, 반응이 1 → 3 → 1 → 0으로 3~5를 딱 채울 때 가장 크다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

흥분성 중심·억제성 주변 수용장을 가진 뉴런은, 가운데에 닿은 자극에 발화를 늘리고 둘레에 닿은 자극에 발화를 줄인다[^1]. 반응은 두 효과의 차이로 정해진다.

</div>


넓이로 셈하는 모형으로 쓰면 이렇다[^s2]. 가운데는 반지름 1인 원, 둘레는 반지름 1~2인 고리다.

$$
r = \max\bigl(0,\ r_0 + g\,(S_{\text{중심}} - k\,S_{\text{주변}})\bigr)
$$


$$S_{\text{중심}}$$과 $$S_{\text{주변}}$$은 자극이 가운데와 둘레를 덮은 넓이, $$r_0$$는 자발 발화, $$g > 0$$은 민감도, $$k > 0$$은 둘레 억제의 세기다. 반지름 $$\rho$$인 둥근 자극을 가운데에 놓으면, $$\rho$$가 1이 될 때까지는 $$S_{\text{중심}}$$만 늘어 반응이 커진다. $$\rho$$가 1을 넘으면 $$S_{\text{주변}}$$만 늘어 반응이 작아진다. 그래서 $$k$$가 얼마든 반응은 $$\rho = 1$$에서 가장 크다.

가운데와 둘레의 억제 총량이 같게 맞춰져 있으면($$k \cdot 3\pi = \pi$$, 곧 $$k = 1/3$$) 수용장 전체를 고르게 비출 때 반응은 자발 발화 그대로다. 빛의 경계가 수용장을 지나면 반응이 오르거나 내린다. 이 뉴런은 밝기 자체가 아니라 밝기의 차이를 보고한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$k = 0.2, 1/3, 0.5, 1$$ 모두에서 반응 최대는 $$\rho = 1$$, $$0 \le \rho \le 1$$에서 증가·$$1 \le \rho \le 2$$에서 감소. $$k = 1/3$$에서 균일한 빛 → 자발 발화 그대로, 경계 위치에 따라 위·아래로 약 8 변함 (격자 적분, 실험으로 확인됨) — [10_center-surround_verify.py](/Hongs_Blog/studies/human-interface-media/code/10_center-surround_verify/)</div>

</div>


## 신호·머신러닝·인공지능 관점

**신호.** 중심-주변 수용장은 공간 필터다. 가운데 +, 둘레 −, 합이 0인 1차원 수용장에 줄무늬 $$\cos(2\pi u x)$$를 비추면 반응 크기는

$$
R(u) = \frac{2\sin(2\pi u)\,\bigl(1 - \cos(2\pi u)\bigr)}{\pi u}
$$


이다. $$R(0) = 0$$이라 고른 빛(공간 주파수 0)은 통과하지 못한다. 약 $$u = 0.29$$ 사이클/단위에서 가장 크고, 촘촘한 줄무늬($$u \ge 3$$)에서는 최대의 20%도 안 된다. 너무 성기지도, 너무 촘촘하지도 않은 무늬만 통과시키는 대역 통과 필터다. 줄무늬 한 줄의 폭이 가운데 크기와 비슷할 때 가장 세게 반응한다는 뜻이다. 영상 처리에서는 가우스 두 개의 차(DoG)나 가우스의 라플라시안(LoG)이 같은 모양의 필터로, 경계 검출에 쓴다. 강의 계획표 6주차 "Spatial Frequency"와 7주차 "Convolution"의 대상이다[^2][^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 공식과 수치 적분이 $$u = 0.1, 0.29, 0.5, 1.3, 3.2$$에서 일치, $$R(0) = 0$$, 최대 $$u \approx 0.287$$, $$u \ge 3$$에서 최대의 20% 미만 (실험으로 확인됨) — [10_center-surround_verify.py](/Hongs_Blog/studies/human-interface-media/code/10_center-surround_verify/)</div>

</div>


**머신러닝.** 합성곱 신경망은 이런 필터를 사람이 설계하지 않고 데이터로 배운다. 이미지 분류로 학습한 신경망의 첫 층 필터를 그려 보면, 방향이 있는 모서리 검출기와 색 얼룩 검출기가 저절로 나타난다. 시각계의 초기 단계가 하는 일과 비슷한 필터를 학습이 다시 찾아낸 셈이다[^s4].

**인공지능.** Hubel과 Wiesel이 시각 피질에서 수용장이 계층적으로 쌓이는 구조를 밝혔고, Fukushima의 네오코그니트론(1980)이 이를 본떠 층을 쌓은 인공 신경망을 만들었다. 이것이 합성곱 신경망의 직접적인 조상이다[^s4].

## 연결

- 선수: [흥분성과 억제성 시냅스](/Hongs_Blog/studies/human-interface-media/excitatory-inhibitory/), [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/) (회로 3)
- 이런 수용장을 만드는 배선: [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)
- 경계를 수식으로 잡는 다른 방법(1차 미분): [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/)의 $$\nabla i$$

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"자극이 크고 셀수록 뉴런은 더 세게 반응한다"</div>

틀렸다. 대부분의 감각에서 "많이 = 세게"가 맞아 보여서 그럴듯하다. 중심-주변 수용장에서는 자극이 가운데를 넘어 둘레까지 덮으면 반응이 오히려 줄어든다. 확인 방법: 슬라이드 p.15의 (b)와 (d)를 비교하면 더 큰 자극 (d)의 스파이크가 훨씬 드물다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 수용장을 정의하고, 흥분성 중심·억제성 주변 수용장이 가운데와 둘레의 자극에 각각 어떻게 반응하는지 쓰라.</summary>


**답:** 수용장은 그 뉴런의 발화에 영향을 주는 수용기 영역(피부나 망막의 구역)이다. 가운데에 자극이 오면 발화가 늘고, 둘레에 오면 발화가 준다. 둘 다 오면 서로 깎는다(길항).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 같은 수용장에 (a) 가운데 안의 작은 점 (b) 가운데를 딱 채우는 원 (c) 가운데와 둘레 일부를 덮는 원 (d) 수용장 전체를 덮는 원을 비춘다. 발화가 가장 많은 것과, (b)에서 (d)로 갈 때의 변화를 쓰라.</summary>


**답:** (b)가 가장 많다. (b) → (c) → (d)로 자극이 커질수록 둘레의 억제가 더해져 발화가 줄어든다.<br>
**흔한 오답:** (d)가 가장 크다고 쓴다. 가장 큰 자극이 가장 센 반응을 만들지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 뉴런 수렴의 회로 3(수용기 1~7, A·C가 B에 억제성으로 연결)에서 무엇이 수용장의 "가운데"와 "둘레"에 해당하는가? 회로 3의 반응 1, 3, 1, 0은 수용장의 어떤 성질을 보여 주는가?</summary>


**답:** 수용기 3·4·5가 가운데(흥분성), A·C를 거치는 1·2·6·7이 둘레(억제성)다. 반응이 3~5 자극에서 가장 크고 더 넓어지면 작아지는 것은 "가운데를 딱 채울 때 최대"라는 중심-주변 수용장의 성질이다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.15 (Center-surround Antagonism). 요약 p.16의 "길항 작용 Antagonism"
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar 6~7주차
[^s1]: 에이전트 보충. "수용장"이라는 이름은 슬라이드에 없다. 그림의 Excitatory center와 Inhibitory surround가 가리키는 구역의 표준 용어다. 가운데가 억제성이고 둘레가 흥분성인 반대 모양의 뉴런도 있다.
[^s2]: 에이전트 보충. 넓이 모형과 그 식은 원본에 없다. 슬라이드 (a)~(d)의 순서를 설명하려는 설명용 모형이다. (a)와 (c)의 크기 순서는 $$k$$에 따라 달라지므로 모형에서 주장하지 않는다.
[^s3]: 에이전트 보충. 1차원 줄무늬 응답 공식은 가중치 함수 $$w(x)$$(가운데 +1, 둘레 −1)와 $$\cos(2\pi ux)$$의 적분에서 나온다. $$\int_{-1}^{1}\cos(2\pi ux)\,dx - 2\int_{1}^{2}\cos(2\pi ux)\,dx = \frac{2\sin 2\pi u - \sin 4\pi u}{\pi u}$$이고, $$\sin 4\pi u = 2\sin 2\pi u\cos 2\pi u$$로 정리했다. DoG·LoG 필터는 Marr와 Hildreth(1980)의 경계 검출 이론에서 널리 알려졌다.
[^s4]: 에이전트 보충. 학습된 첫 층 필터의 모양은 Krizhevsky, Sutskever & Hinton(2012, AlexNet) 논문의 그림 등에서 보고되었다. Hubel & Wiesel(1959~1962)의 수용장 연구와 Fukushima(1980)의 네오코그니트론은 신경망 교과서의 표준 역사다.
{% endraw %}
