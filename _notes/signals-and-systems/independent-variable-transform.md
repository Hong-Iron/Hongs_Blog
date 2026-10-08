---
layout: "note"
title: "독립 변수의 변환"
display_title: "독립 변수의 변환 (Transformations of the Independent Variable)"
kind: "concept"
kind_label: "기법"
num: "05"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Transformations of the Independent Variable", "시간 이동", "Time Shift", "시간 반전", "Time Reversal", "시간 척도 변환", "Time Scaling", "지연", "Delay", "아핀 변환", "Affine Transformation"]
description: "신호의 값은 그대로 두고 시간축만 밀고(이동), 뒤집고(반전), 늘이거나 줄이는(척도) 조작이다. 녹음 파일을 늦게 틀기, 거꾸로 틀기, 빨리 감기와 같다. 괄호 안에서 일어나는 일이라 방향이 직관과 반대로 보이는 것이 함정이다. x(t - 2)는 왼쪽이 아니라 오른쪽으로 2만큼 …"
prev_url: "/studies/signals-and-systems/signal-energy-power/"
prev_title: "신호의 에너지와 전력"
next_url: "/studies/signals-and-systems/periodic-signals/"
next_title: "주기 신호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/independent-variable-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신호의 값은 그대로 두고 시간축만 밀고(이동), 뒤집고(반전), 늘이거나 줄이는(척도) 조작이다. 녹음 파일을 늦게 틀기, 거꾸로 틀기, 빨리 감기와 같다. 괄호 안에서 일어나는 일이라 방향이 직관과 반대로 보이는 것이 함정이다. $$x(t - 2)$$는 왼쪽이 아니라 오른쪽으로 2만큼 밀리고, $$x(2t)$$는 두 배 길어지는 것이 아니라 절반으로 줄어든다.

</div>


## 예시로 보기

레이더는 전파를 쏘고 반사파를 받는다. 받은 신호는 보낸 신호와 모양이 같고 늦게 도착할 뿐이다. 도착이 $$t_0$$만큼 늦으면 받은 신호는 $$x(t - t_0)$$이다[^1]. 왜 빼기일까? 보낸 신호가 $$t = 0$$에 가진 값이 받은 쪽에서는 $$t = t_0$$에 나타나야 한다. $$t = t_0$$을 넣으면 $$x(t_0 - t_0) = x(0)$$이 되므로 맞다.

예: $$\cos 2t$$를 $$t_0$$만큼 늦추려면 $$t$$ 자리에 $$t - t_0$$을 넣는다. $$\cos 2(t - t_0) = \cos(2t - 2t_0)$$이다. $$\cos(2t - t_0)$$이 아니다[^1].

## 정의

| 변환 | 식 | 모양의 변화 |
|---|---|---|
| 시간 이동 | $$x(t - t_0)$$, $$x[n - n_0]$$ | $$t_0 > 0$$이면 오른쪽으로 밀림(지연), $$t_0 < 0$$이면 왼쪽(앞당김)[^1] |
| 시간 반전 | $$x(-t)$$, $$x[-n]$$ | $$t = 0$$(또는 $$n = 0$$)을 축으로 좌우가 뒤집힘[^2] |
| 시간 척도 | $$x(\alpha t)$$ | $$\lvert\alpha\rvert > 1$$이면 좁아짐, $$\lvert\alpha\rvert < 1$$이면 넓어짐[^3] |

셋을 합친 일반형은 $$y(t) = x(\alpha t + \beta)$$다(아핀 변환)[^4]. $$\alpha < 0$$이면 반전이 들어 있고, $$\beta \neq 0$$이면 이동이 들어 있다.

**그리는 순서.** 먼저 이동하고 그다음 척도를 바꾸는 것이 안전하다[^5].

1. $$v(t) = x(t + \beta)$$를 그린다 ($$\beta$$만큼 왼쪽으로).
2. $$y(t) = v(\alpha t)$$를 그린다 (가로를 $$1/\vert \alpha\vert $$배로, $$\alpha < 0$$이면 뒤집기).

순서를 바꿔 척도를 먼저 하면, 이동량은 $$\beta$$가 아니라 $$\beta/\alpha$$다. $$x(\alpha t + \beta) = x\bigl(\alpha(t + \beta/\alpha)\bigr)$$이기 때문이다.

**빠른 확인법.** 원래 신호가 $$a \le t \le b$$에서만 0이 아니면, $$x(\alpha t + \beta)$$는 $$\alpha t + \beta$$가 그 범위에 드는 $$t$$, 즉 $$\dfrac{a - \beta}{\alpha}$$와 $$\dfrac{b - \beta}{\alpha}$$ 사이에서만 0이 아니다[^s1].

## 예제

그림 1.13(a)의 $$x(t)$$: $$0 \le t \le 1$$에서 1, $$1 \le t \le 2$$에서 1에서 0으로 곧게 내려가고, 나머지는 0이다[^6].

**예 1** $$x(-t + 1)$$[^6]

- 이동: $$x(t + 1)$$은 왼쪽으로 1 → $$-1 \le t \le 0$$에서 1, $$0 \le t \le 1$$에서 내려감.
- 반전: $$t$$를 $$-t$$로 → $$0 \le t \le 1$$에서 1, $$-1 \le t \le 0$$에서 0에서 1로 올라감.

**예 2** $$x\!\left(\frac32 t + 1\right)$$[^6][^5]

- 이동: $$x(t + 1)$$ (예 1과 같다).
- 척도: 가로를 $$\frac23$$배로 → $$-\frac23 \le t \le 0$$에서 1, $$0 \le t \le \frac23$$에서 내려감.
- 다른 순서: $$x(\frac32 t)$$를 먼저 그리면 $$0 \sim \frac23$$에서 1, $$\frac23 \sim \frac43$$에서 내려간다. 여기서 1이 아니라 $$\frac23$$만큼 왼쪽으로 밀어야 같은 답이 나온다.
- 빠른 확인: $$a = 0$$, $$b = 2$$, $$\alpha = \frac32$$, $$\beta = 1$$이면 $$\frac{0 - 1}{3/2} = -\frac23$$, $$\frac{2 - 1}{3/2} = \frac23$$. 맞다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예 1·2의 모양을 점마다 계산해 두 그리는 순서가 같은 답을 내고, 척도 뒤 1만큼 밀면 틀린 답이 됨을 확인 — [05_independent-variable-transform_verify.py](/Hongs_Blog/studies/signals-and-systems/code/05_independent-variable-transform_verify/)</div>

</div>


## 활용

- 지연 $$x[n - 1]$$은 디지털 회로의 레지스터 한 칸, 오디오의 메아리 효과다.
- 시간 이동이 시스템을 통과해도 그대로인지가 [시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/)의 정의다.
- 시험에서는 그림 하나를 주고 $$x(at + b)$$를 그리게 하는 문제가 흔하다. 끝점 두 개를 빠른 확인법으로 먼저 구해 두면 실수가 준다[^s1].

## 연결

- 선수: [함수의 변환과 합성](/Hongs_Blog/studies/college-math/function-transformation/) (고등학교의 평행이동·대칭이동과 같은 조작)
- 다음: [주기 신호](/Hongs_Blog/studies/signals-and-systems/periodic-signals/), [짝 신호와 홀 신호](/Hongs_Blog/studies/signals-and-systems/even-odd-signals/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$x(2t)$$는 신호를 두 배로 늘인 것이다."</div>

틀렸다. 2배 빨리 감은 것이라 가로 폭이 절반이 된다. "2"가 크니까 커질 것 같아 그럴듯하다. 실제로는 $$x(2t)$$가 $$t = 1$$에서 갖는 값은 원래 신호의 $$t = 2$$ 값이다. 원래 신호의 2초 분량이 1초 안에 들어간다. 확인: 그림 1.12에서 $$x(2t)$$의 폭은 $$x(t)$$의 절반이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 위 예의 $$x(t)$$로 $$x(2t - 2)$$가 0이 아닌 구간을 구하라.</summary>

**답:** $$2t - 2$$가 0~2 사이 → $$1 \le t \le 2$$. 이 중 $$1 \le t \le 1.5$$에서 1, $$1.5 \le t \le 2$$에서 내려간다.<br>
**흔한 오답:** 척도를 먼저 하고 2만큼 밀어 $$2 \le t \le 3$$으로 적는 것 (실제 이동량은 $$2/2 = 1$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t - 3)$$이 오른쪽으로 밀리는 이유를 한 점을 따라가며 설명하라.</summary>

**답:** 원래 $$t = 0$$에 있던 값 $$x(0)$$이 새 신호에서는 괄호 안이 0이 되는 $$t = 3$$에 나타난다. 모든 점이 3만큼 늦게 나타나므로 오른쪽으로 밀린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "신호를 뒤집은 다음 오른쪽으로 2만큼 민다"를 식으로 쓰라.</summary>

**답:** 뒤집으면 $$x(-t)$$. 여기서 $$t$$를 $$t - 2$$로 바꾸면 $$x(-(t - 2)) = x(-t + 2)$$.<br>
**흔한 오답:** $$x(-t - 2)$$. 이것은 왼쪽으로 2만큼 민 것이다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.28~29 (그림 1.8)
[^2]: 같은 자료, p.30 (그림 1.10, 1.11)
[^3]: 같은 자료, p.31 (그림 1.12)
[^4]: 같은 자료, p.32
[^5]: 같은 자료, p.35
[^6]: 같은 자료, p.33~34 (예제 1.1~1.3, 그림 1.13)
[^s1]: 에이전트 보충. 끝점으로 구간을 구하는 빠른 확인법, 시험 문제 유형에 관한 말, 확인 문제 C1·C3은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
