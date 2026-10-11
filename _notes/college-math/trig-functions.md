---
layout: "note"
title: "삼각함수"
display_title: "삼각함수 (Trigonometric Functions)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Trigonometric Functions", "사인", "sine", "sin", "코사인", "cosine", "cos", "탄젠트", "tangent", "tan", "단위원", "unit circle", "기준각", "reference angle", "피타고라스 항등식"]
description: "반지름이 1인 원 위를 도는 점을 떠올린다. 점의 가로 위치가 코사인, 세로 위치가 사인이다. 각이 한 바퀴 돌 때마다 값이 되풀이되므로 모든 주기 현상의 기본 재료가 된다. 삼각형에서 배우는 \"빗변 분의 높이\"는 90°보다 작은 각에서만 통하지만, 원 위의 점으로 정하면 어떤 각…"
prev_url: "/studies/college-math/radian/"
prev_title: "각과 라디안"
next_url: "/studies/college-math/sinusoid/"
next_title: "사인파"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/trig-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

반지름이 1인 원 위를 도는 점을 떠올린다. 점의 가로 위치가 코사인, 세로 위치가 사인이다. 각이 한 바퀴 돌 때마다 값이 되풀이되므로 모든 주기 현상의 기본 재료가 된다. 삼각형에서 배우는 "빗변 분의 높이"는 90°보다 작은 각에서만 통하지만, 원 위의 점으로 정하면 어떤 각에서도 통한다. 다만 탄젠트는 코사인이 0인 각에서 정의되지 않는다.

</div>


## 예시로 보기

반지름 1인 원(단위원)에서 $$(1, 0)$$을 출발해 시계 반대 방향으로 각 $$\theta$$만큼 돈 점을 $$P(\theta)$$라 하자. $$\theta = \pi/6$$(30°)이면 $$P = \left(\tfrac{\sqrt3}{2}, \tfrac12\right)$$이다. 이 점의 가로 좌표 $$\tfrac{\sqrt3}{2}$$가 $$\cos(\pi/6)$$, 세로 좌표 $$\tfrac12$$가 $$\sin(\pi/6)$$이다.

| $$\theta$$ | $$0$$ | $$\pi/6$$ | $$\pi/4$$ | $$\pi/3$$ | $$\pi/2$$ | $$\pi$$ | $$3\pi/2$$ |
|---|---|---|---|---|---|---|---|
| $$\cos\theta$$ (가로) | $$1$$ | $$\frac{\sqrt3}{2}$$ | $$\frac{\sqrt2}{2}$$ | $$\frac12$$ | $$0$$ | $$-1$$ | $$0$$ |
| $$\sin\theta$$ (세로) | $$0$$ | $$\frac12$$ | $$\frac{\sqrt2}{2}$$ | $$\frac{\sqrt3}{2}$$ | $$1$$ | $$0$$ | $$-1$$ |

점이 원을 따라 도는 동안 세로 좌표만 시간축에 펼쳐 그리면 사인 그래프, 가로 좌표만 펼치면 코사인 그래프다. 두 그래프는 모양이 같고 $$\pi/2$$만큼 어긋나 있다. 점이 $$\pi/2$$에서 $$\pi$$로 가는 동안 원에서는 왼쪽 위로 내려오고, 그래프에서는 사인이 1에서 0으로, 코사인이 0에서 −1로 내려간다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/12_trig-functions_fig1.svg" alt="그림" width="612" height="276" loading="lazy">

왼쪽 단위원에서 $$P(\pi/6)$$의 가로 길이(파랑)가 $$\cos(\pi/6)$$, 세로 길이(주황)가 $$\sin(\pi/6)$$이다. 오른쪽 그래프에서 점선 $$\theta = \pi/6$$ 위의 두 점이 같은 두 값이다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

실수 $$\theta$$에 대해, 단위원 $$x^2 + y^2 = 1$$ 위의 점 $$(1, 0)$$을 원점 중심으로 $$\theta$$라디안 돌린 점을 $$P(\theta) = (x, y)$$라 하자($$\theta < 0$$이면 시계 방향). 이때[^1]

$$\cos\theta = x, \qquad \sin\theta = y, \qquad \tan\theta = \frac{y}{x}\ \ (x \ne 0)$$

역수인 $$\sec\theta = 1/\cos\theta$$, $$\csc\theta = 1/\sin\theta$$, $$\cot\theta = 1/\tan\theta$$도 쓴다.

</div>


정의에서 곧바로 나오는 성질은 다음과 같다.
- **피타고라스 항등식:** 점이 단위원 위에 있으므로 $$\sin^2\theta + \cos^2\theta = 1$$. 그래서 두 값은 $$[-1, 1]$$ 안에 있다.
- **주기:** 한 바퀴 돌면 같은 점이므로 $$\sin(\theta + 2\pi) = \sin\theta$$, $$\cos(\theta + 2\pi) = \cos\theta$$. 탄젠트의 주기는 $$\pi$$다.
- **대칭:** $$-\theta$$는 $$x$$축에 대칭인 점이라 $$\cos(-\theta) = \cos\theta$$, $$\sin(-\theta) = -\sin\theta$$.
- **어긋남:** $$\sin\left(\theta + \tfrac{\pi}{2}\right) = \cos\theta$$.
- 반지름 $$r$$인 원 위의 점은 $$(r\cos\theta, r\sin\theta)$$다.

**설계 이유.** 직각삼각형의 비로 정하면 각이 $$0$$과 $$\pi/2$$ 사이일 때만 뜻이 있다. 단위원으로 정하면 둔각, 음수 각, 여러 바퀴 돈 각까지 모두 정의되고 주기성이 저절로 따라온다. 각을 라디안으로 재는 것도 이 정의와 맞물린다. 단위원에서는 호의 길이가 곧 각이다.

**동치인 다른 정의.**

| 정의 | 근거 |
|---|---|
| 예각 $$\theta$$에서 $$\sin\theta = \dfrac{\text{높이}}{\text{빗변}}$$, $$\cos\theta = \dfrac{\text{밑변}}{\text{빗변}}$$ | 빗변 $$h$$인 직각삼각형을 $$1/h$$배로 줄이면 단위원 안의 삼각형과 닮은꼴이 된다[^1] |
| $$\sin x = x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \cdots$$ | [증명 생략: [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)] |
| $$e^{i\theta} = \cos\theta + i\sin\theta$$의 실수부와 허수부 | [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/) |

**해당하는 예:** $$\sin(\pi/6) = \tfrac12$$, $$\cos\pi = -1$$, $$\tan(\pi/4) = 1$$. **해당하지 않는 예:** $$\tan(\pi/2)$$(가로 좌표가 0이라 정의되지 않는다), $$\sin\theta = 2$$인 $$\theta$$(세로 좌표는 1을 넘지 못한다).

## 증명

특수각의 값은 두 가지 삼각형에서 나온다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *$$\pi/4$$:* $$P(\pi/4)$$는 직선 $$y = x$$ 위에 있으므로 $$x = y$$다. $$x^2 + y^2 = 1$$에서 $$2x^2 = 1$$, $$x = y = \frac{\sqrt2}{2}$$. — 피타고라스 항등식
2. *$$\pi/6$$:* $$P(\pi/6)$$, $$P(-\pi/6)$$, 원점은 세 변이 1이고 두 반지름 사이 각이 $$\pi/3$$인 정삼각형을 이룬다(나머지 두 각이 같고 합이 $$2\pi/3$$이므로). 두 점 사이 거리 $$2y = 1$$이므로 $$y = \frac12$$, 그리고 $$x = \sqrt{1 - \frac14} = \frac{\sqrt3}{2}$$.
3. *$$\pi/3$$:* $$P(\pi/3)$$은 직선 $$y = x$$에 대해 $$P(\pi/6)$$과 대칭이므로 좌표를 바꾼 $$\left(\frac12, \frac{\sqrt3}{2}\right)$$다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2에서 "두 점 사이 거리가 2y"인 이유는?</summary>

두 점 $$(x, y)$$와 $$(x, -y)$$는 가로 좌표가 같고 세로 좌표만 부호가 반대라 거리가 $$2y$$다. $$P(-\pi/6)$$은 $$P(\pi/6)$$을 $$x$$축에 대칭한 점이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. sin(π − θ) = sin θ, cos(π − θ) = −cos θ는 단위원에서 어디서 나오나?</summary>

$$P(\pi - \theta)$$는 $$P(\theta)$$를 $$y$$축에 대칭한 점이다. 세로 좌표는 그대로, 가로 좌표는 부호만 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

각을 "원 위의 위치"로 바꾸면, 삼각함수의 성질은 모두 원의 대칭(좌우·상하·회전)에서 읽힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

시계 바늘 끝의 좌표, 게임에서 방향 $$\theta$$로 속력 $$v$$로 움직이는 물체의 한 걸음 $$(v\cos\theta, v\sin\theta)$$, 회전하는 바퀴의 한 점.

</details>


## 예제

$$\sin\frac{5\pi}{6}$$, $$\cos\frac{5\pi}{6}$$을 구한다.

1. *기준각 찾기:* $$\frac{5\pi}{6} = \pi - \frac{\pi}{6}$$이므로 $$x$$축과 이루는 예각이 $$\frac{\pi}{6}$$이다.
2. *사분면으로 부호 정하기:* 제2사분면이라 가로는 음수, 세로는 양수다.
3. *값 넣기:* $$\sin\frac{5\pi}{6} = \frac12$$, $$\cos\frac{5\pi}{6} = -\frac{\sqrt3}{2}$$.

같은 방법으로 $$\sin\frac{7\pi}{4} = -\frac{\sqrt2}{2}$$(제4사분면, 기준각 $$\pi/4$$), $$\tan\frac{2\pi}{3} = \frac{\sqrt3/2}{-1/2} = -\sqrt3$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 특수각, 무작위 2만 각에서 피타고라스 항등식·대칭·주기(실험으로 확인됨), 직각삼각형 정의와 일치, 예제, 카드 C2·C3 — [12_trig-functions_verify.py](/Hongs_Blog/studies/college-math/code/12_trig-functions_verify/)</div>

</div>


## 활용

- **방향으로 움직이기.** 게임과 로봇에서 방향 $$\theta$$, 속력 $$v$$로 $$\Delta t$$초 움직이면 위치가 $$(v\cos\theta\,\Delta t,\ v\sin\theta\,\Delta t)$$만큼 바뀐다.
- **원 그리기.** 원·호·원형 진행 표시줄은 $$(c_x + r\cos\theta, c_y + r\sin\theta)$$를 $$\theta$$를 조금씩 늘리며 찍어 그린다.
- **부동소수점.** `math.sin(math.pi)`는 0이 아니라 약 $$1.22 \times 10^{-16}$$이다. `math.pi`가 $$\pi$$와 정확히 같지 않기 때문이다. 결과를 0과 비교할 때는 `==` 대신 오차 범위(`math.isclose`)를 쓴다.
- 주기 신호는 [사인파](/Hongs_Blog/studies/college-math/sinusoid/)로, 회전의 합성은 [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)으로 이어진다.

## 연결

- 선수: [각과 라디안](/Hongs_Blog/studies/college-math/radian/)
- 이어지는 개념: [사인파](/Hongs_Blog/studies/college-math/sinusoid/), [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/), [역삼각함수](/Hongs_Blog/studies/college-math/inverse-trig/), [사인 법칙과 코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/), [극좌표와 매개변수 곡선](/Hongs_Blog/studies/college-math/polar-parametric/)
- 선형대수학의 회전 행렬과 [내적](/Hongs_Blog/studies/linear-algebra/dot-product/)이 이 정의 위에 선다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"사인은 빗변 분의 높이라서, 둔각이나 음수 각에는 없다"</div>

틀렸다. 중학교에서 직각삼각형으로 처음 배워 그 정의가 전부인 것처럼 느껴진다. 실제 정의는 단위원 위 점의 좌표이고, 삼각형의 비는 예각에서 그 정의와 일치하는 특별한 경우다. 그래서 $$\sin 120° = \frac{\sqrt3}{2}$$, $$\cos(-\pi/3) = \frac12$$, $$\sin(7\pi) = 0$$처럼 모든 각에서 값이 있다. 단위원에서 120°의 점 $$\left(-\frac12, \frac{\sqrt3}{2}\right)$$을 찍어 보면 확인된다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사인과 코사인을 단위원으로 정의하고, 이 정의가 직각삼각형 정의보다 나은 점을 쓰라.</summary>

**답:** $$(1, 0)$$을 원점 중심으로 $$\theta$$만큼 돌린 단위원 위의 점의 가로 좌표가 $$\cos\theta$$, 세로 좌표가 $$\sin\theta$$다. 모든 실수 각에서 정의되고, 주기성·대칭이 원의 모양에서 바로 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** sin(5π/6), cos(5π/6), sin(7π/4), tan(2π/3)을 구하라.</summary>

**답:** $$\frac12$$, $$-\frac{\sqrt3}{2}$$, $$-\frac{\sqrt2}{2}$$, $$-\sqrt3$$.

**흔한 오답:** 부호를 빠뜨리는 것. 기준각으로 크기를 구한 뒤, 그 점이 몇 사분면에 있는지로 부호를 따로 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 단위원 위의 점이 θ = π/2에서 θ = π까지 움직인다. 사인 그래프와 코사인 그래프는 이 구간에서 각각 어떻게 움직이는가? 원 위의 어떤 움직임이 그 변화를 만드는가?</summary>

**답:** 사인은 1에서 0으로, 코사인은 0에서 −1로 둘 다 줄어든다. 점이 꼭대기 $$(0, 1)$$에서 왼쪽 끝 $$(-1, 0)$$으로 내려오면서 세로 좌표는 줄고 가로 좌표는 왼쪽(음수)으로 커지기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** sin(π/6) = 1/2을 단위원과 정삼각형으로 보여라.</summary>

**답:** $$P(\pi/6)$$, $$P(-\pi/6)$$, 원점은 두 변이 반지름 1이고 끼인각이 $$\pi/3$$이라 정삼각형이다. 그래서 두 점 사이 거리가 1이다. 두 점은 $$x$$축에 대칭이라 거리가 $$2\sin(\pi/6)$$이므로 $$\sin(\pi/6) = \frac12$$.

</details>


[^1]: OpenStax, *Precalculus 2e*, 5.2절 "Unit Circle: Sine and Cosine Functions", 5.3절 "The Other Trigonometric Functions", 5.4절 "Right Triangle Trigonometry". 그래프는 6.1절 "Graphs of the Sine and Cosine Functions".
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [12_trig-functions_plot.py](/Hongs_Blog/studies/college-math/code/12_trig-functions_plot/)로 그렸고, 그림에 쓴 값($$P(\pi/6) = (\sqrt3/2,\ 1/2)$$, $$\sin(\theta + \pi/2) = \cos\theta$$)을 같은 코드로 확인했다.
{% endraw %}
