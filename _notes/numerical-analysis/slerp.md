---
layout: "note"
title: "구면 선형 보간"
display_title: "구면 선형 보간 (Spherical Linear Interpolation)"
kind: "concept"
kind_label: "기법"
num: "23"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Spherical Linear Interpolation", "Slerp", "선형 보간", "Lerp", "Linear Interpolation", "정규화 선형 보간", "Nlerp", "쌍선형 보간", "Bilinear Interpolation", "삼선형 보간", "Trilinear Interpolation"]
description: "두 방향(단위 벡터나 회전 쿼터니언) 사이를 일정한 빠르기로 돌아가며 잇는 방법이다. 두 점을 직선으로 섞으면(선형 보간) 가운데가 짧아지고, 길이를 1로 되돌려도 처음과 끝에서 느리고 가운데서 빠르게 돈다. 구면 선형 보간은 사잇각을 시간에 정비례로 나눠 원호 위를 고른 빠르기로…"
prev_url: "/studies/numerical-analysis/newton-divided-difference/"
prev_title: "뉴턴 다항식과 분할 차분"
next_url: "/studies/numerical-analysis/data-linearization/"
next_title: "자료 선형화"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/slerp/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 방향(단위 벡터나 회전 쿼터니언) 사이를 일정한 빠르기로 돌아가며 잇는 방법이다. 두 점을 직선으로 섞으면(선형 보간) 가운데가 짧아지고, 길이를 1로 되돌려도 처음과 끝에서 느리고 가운데서 빠르게 돈다. 구면 선형 보간은 사잇각을 시간에 정비례로 나눠 원호 위를 고른 빠르기로 간다. 다만 두 방향이 거의 같으면 $$\sin\theta$$로 나누는 값이 0에 가까워 계산이 불안정하므로, 그때는 그냥 선형 보간을 쓴다.

</div>


## 예시로 보기

카메라를 오른쪽($$\mathbf q_1 = (1, 0)$$)에서 위쪽($$\mathbf q_2 = (0, 1)$$)으로 1초 동안 돌린다.

- **선형 보간** $$(1 - t)\mathbf q_1 + t\mathbf q_2$$: 0.5초에 $$(0.5, 0.5)$$로 길이가 $$\frac{1}{\sqrt2} \approx 0.71$$로 줄어든다.
- **정규화한 선형 보간**: 길이는 1로 되돌리지만, 0.25초 간격마다 돈 각도가 고르지 않다. 가운데에서 빨리 돈다[^1][^2].
- **구면 선형 보간**: $$t$$초에 정확히 $$90° \times t$$만큼 돈다. $$t = \frac13$$이면 30° 방향 $$(\frac{\sqrt3}{2}, \frac12)$$다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 선형 보간의 길이 줄어듦, 정규화한 선형 보간의 고르지 않은 각, 구면 선형 보간의 길이 1과 각 $$\theta t$$, 4차원 무작위 쿼터니언 100쌍, 쌍선형·삼선형 보간, 카드 C2·C3 — [23_slerp_verify.py](/Hongs_Blog/studies/numerical-analysis/code/23_slerp_verify/)</div>

</div>


## 정의

**선형 보간**은 $$\mathbf q(t) = (1 - t)\mathbf q_1 + t\mathbf q_2$$($$0 \le t \le 1$$)다. 단위 벡터 사이에서 쓰려고 길이로 나누면 $$\mathbf q(t) = \frac{(1 - t)\mathbf q_1 + t\mathbf q_2}{\Vert (1 - t)\mathbf q_1 + t\mathbf q_2\Vert }$$다. 이것은 원호 위에 있지만, $$\mathbf q_1$$과의 각 $$\cos^{-1}(\mathbf q(t)\cdot\mathbf q_1)$$이 $$t$$에 정비례하지 않고 S자 모양으로 는다[^1][^2].

**구면 선형 보간**은 $$\mathbf q(t) = a(t)\mathbf q_1 + b(t)\mathbf q_2$$로 두고, $$\mathbf q(t)$$가 $$\mathbf q_1$$과 각 $$\theta t$$, $$\mathbf q_2$$와 각 $$\theta(1 - t)$$를 이루게 한다. $$\theta = \cos^{-1}(\mathbf q_1\cdot\mathbf q_2)$$는 두 단위 벡터의 사잇각이다[^3].

$$\mathbf q(t) = \frac{\sin\theta(1 - t)}{\sin\theta}\mathbf q_1 + \frac{\sin\theta t}{\sin\theta}\mathbf q_2, \qquad \sin\theta = \sqrt{1 - (\mathbf q_1\cdot\mathbf q_2)^2}$$


$$a(t)$$는 그림에서 $$\mathbf q(t)$$의 끝에서 $$\mathbf q_2$$ 방향과 나란히 $$\mathbf q_1$$ 쪽 선까지 그은 길이다. 닮은 삼각형으로 $$\frac{a(t)}{\Vert \mathbf q_1\Vert } = \frac{\Vert \mathbf q(t)\Vert \sin\theta(1 - t)}{\Vert \mathbf q_1\Vert \sin\theta}$$이고, 단위 벡터라 $$a(t) = \frac{\sin\theta(1 - t)}{\sin\theta}$$다. $$b(t)$$도 같은 방식이다(사인 법칙)[^3][^4][^5].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">각이 $$\theta t$$인지 확인</summary>

$$\mathbf q(t)\cdot\mathbf q_1 = \frac{\sin\theta(1 - t) + \sin\theta t\cos\theta}{\sin\theta}$$ ($$\mathbf q_1\cdot\mathbf q_2 = \cos\theta$$)

$$\sin\theta(1 - t) = \sin\theta\cos\theta t - \cos\theta\sin\theta t$$ (사인의 덧셈정리)라 분자는 $$\sin\theta\cos\theta t$$, 곧 $$\mathbf q(t)\cdot\mathbf q_1 = \cos\theta t$$.

</details>


쿼터니언 두 개를 이을 때도 같은 공식을 4차원 단위 벡터에 쓴다. $$\mathbf q_1\cdot\mathbf q_2 < 0$$이면 한쪽 부호를 뒤집어 짧은 쪽 호로 간다($$\mathbf q$$와 $$-\mathbf q$$는 같은 회전)[^s1].

### 격자에서의 보간

**쌍선형 보간.** 네 격자점 $$Q_{11}, Q_{21}, Q_{12}, Q_{22}$$의 값으로 사이 점 $$P = (x, y)$$의 값을 짐작한다. $$x$$ 방향으로 두 번 선형 보간한 뒤 $$y$$ 방향으로 한 번 더 한다[^6].

$$f(R_1) \approx \frac{x_2 - x}{x_2 - x_1}f(Q_{11}) + \frac{x - x_1}{x_2 - x_1}f(Q_{21}), \qquad f(R_2) \approx \frac{x_2 - x}{x_2 - x_1}f(Q_{12}) + \frac{x - x_1}{x_2 - x_1}f(Q_{22})$$


$$f(P) \approx \frac{y_2 - y}{y_2 - y_1}f(R_1) + \frac{y - y_1}{y_2 - y_1}f(R_2)$$


$$y$$ 방향을 먼저 해도 결과가 같다[^s1]. **삼선형 보간**은 정육면체의 꼭짓점 여덟 개로 같은 일을 세 방향으로 한다[^7].

## 활용

- 게임 캐릭터·카메라의 회전 애니메이션(Unity의 `Quaternion.Slerp`), 두 자세 사이의 부드러운 전환. 쌍선형 보간은 텍스처를 확대할 때 픽셀 사이 색을, 삼선형 보간은 3D 의료 영상이나 밉맵 사이를 채울 때 쓴다[^s1].
- 흔한 실수: 쿼터니언 내적이 음수인데 그대로 보간해 먼 쪽(360° 가까이) 호로 도는 것. 또 $$\theta \approx 0$$에서 $$\sin\theta$$로 나누는 것.

## 연결

- 선수: [쿼터니언](/Hongs_Blog/studies/numerical-analysis/quaternion/)(잇는 대상), [다항식 보간](/Hongs_Blog/studies/numerical-analysis/polynomial-interpolation/)(선형 보간), [사인 법칙과 코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/)
- 오일러 각을 보간하면 생기는 문제: [오일러 각과 짐벌 잠금](/Hongs_Blog/studies/numerical-analysis/euler-angles/)
- 쌍선형 곡면과 같은 식: [매개변수 곡면 패치](/Hongs_Blog/studies/numerical-analysis/surface-patches/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 구면 선형 보간 공식과 $$\theta$$의 뜻을 쓰라.</summary>

**답:** $$\mathbf q(t) = \frac{\sin\theta(1 - t)}{\sin\theta}\mathbf q_1 + \frac{\sin\theta t}{\sin\theta}\mathbf q_2$$, $$\theta = \cos^{-1}(\mathbf q_1\cdot\mathbf q_2)$$는 두 단위 벡터의 사잇각.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\mathbf q_1 = (1, 0)$$, $$\mathbf q_2 = (0, 1)$$에서 $$t = \frac13$$의 구면 선형 보간 값은?</summary>

**답:** $$\theta = 90°$$, $$\sin\theta = 1$$. 계수 $$\sin60° = \frac{\sqrt3}{2}$$, $$\sin30° = \frac12$$. $$\mathbf q = (\frac{\sqrt3}{2}, \frac12)$$, 곧 30° 방향.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 격자 $$(0,0), (1,0), (0,1), (1,1)$$의 값이 $$1, 3, 2, 6$$이다. $$(0.25, 0.5)$$의 쌍선형 보간 값은?</summary>

**답:** $$y = 0$$ 줄: $$0.75\cdot1 + 0.25\cdot3 = 1.5$$. $$y = 1$$ 줄: $$0.75\cdot2 + 0.25\cdot6 = 3$$. $$y = 0.5$$로 섞으면 $$2.25$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 두 회전 사이를 일정한 각속도로 돌려야 한다. 정규화한 선형 보간과 구면 선형 보간 중 무엇을 쓰나? 다른 쪽은 왜 아닌가?</summary>

**답:** 구면 선형 보간. 각이 $$\theta t$$로 시간에 정비례한다. 정규화한 선형 보간은 같은 원호 위를 지나지만 각이 S자로 늘어 가운데에서 빨라진다. 각속도가 중요하지 않고 계산을 아끼고 싶으면 정규화한 선형 보간도 쓴다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/12.na12_interpolation.pdf, p.29~30
[^2]: 같은 자료, p.31
[^3]: 같은 자료, p.32
[^4]: 같은 자료, p.33
[^5]: 같은 자료, p.34
[^6]: 같은 자료, p.35
[^7]: 같은 자료, p.36
[^s1]: 에이전트 보충. 카메라 예와 수치, 각이 $$\theta t$$인 확인, 쿼터니언 부호 뒤집기, 순서를 바꿔도 같은 쌍선형 보간, 쓰는 곳, 흔한 실수, 카드 C2~C4는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
