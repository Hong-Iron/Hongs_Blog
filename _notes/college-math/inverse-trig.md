---
layout: "note"
title: "역삼각함수"
display_title: "역삼각함수 (Inverse Trigonometric Functions)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Inverse Trigonometric Functions", "아크사인", "arcsin", "asin", "아크코사인", "arccos", "acos", "아크탄젠트", "arctan", "atan", "atan2", "주치", "principal value"]
description: "역삼각함수는 삼각함수의 값을 보고 각을 되찾는 함수다. 사인은 한 바퀴 안에서도 같은 값을 두 번 내므로 그대로는 되돌릴 수 없고, 입력 범위를 반 바퀴로 잘라야 되돌릴 수 있다. 그래서 역삼각함수가 돌려주는 각은 가능한 답 가운데 하나뿐이다. 방향각을 구할 때는 어느 사분면인지 …"
prev_url: "/studies/college-math/trig-identities/"
prev_title: "삼각함수 항등식"
next_url: "/studies/college-math/triangle-laws/"
next_title: "사인 법칙과 코사인 법칙"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/inverse-trig/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

역삼각함수는 삼각함수의 값을 보고 각을 되찾는 함수다. 사인은 한 바퀴 안에서도 같은 값을 두 번 내므로 그대로는 되돌릴 수 없고, 입력 범위를 반 바퀴로 잘라야 되돌릴 수 있다. 그래서 역삼각함수가 돌려주는 각은 가능한 답 가운데 하나뿐이다. 방향각을 구할 때는 어느 사분면인지 잃어버리는 아크탄젠트 대신 두 좌표를 따로 받는 atan2를 쓴다.

</div>


## 예시로 보기

$$\sin\theta = \frac12$$인 각은 $$\frac{\pi}{6}$$과 $$\frac{5\pi}{6}$$이 있고, 여기에 $$2\pi$$의 정수배를 더한 것도 모두 답이다. 계산기의 $$\sin^{-1}(0.5)$$는 이 중 $$\frac{\pi}{6}$$ 하나만 내놓는다. 답이 여럿이면 함수가 될 수 없으므로 "대표 답" 하나를 고르도록 범위를 정해 둔 것이다.

점 $$(-1, -1)$$의 방향도 같은 문제를 겪는다. 기울기 $$y/x = 1$$의 아크탄젠트는 $$\frac{\pi}{4}$$로, $$(1, 1)$$ 쪽을 가리킨다. 부호 두 개가 나눗셈에서 지워져 사분면을 잃었다. `atan2(-1, -1)`은 두 좌표를 따로 받아 $$-\frac{3\pi}{4}$$, 즉 왼쪽 아래를 정확히 돌려준다.

## 정의

[역함수](/Hongs_Blog/studies/college-math/inverse-function/)는 일대일 함수에만 있으므로, 삼각함수의 정의역을 값이 한 번씩만 나오는 구간으로 자른다[^1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/15_inverse-trig_fig1.svg" alt="그림" loading="lazy">

왼쪽에서 가로선 $$y = 1/2$$은 사인 그래프와 끝없이 많이 만난다. 굵게 칠한 $$[-\pi/2, \pi/2]$$ 부분과는 $$\pi/6$$에서 한 번만 만난다. 그 굵은 부분을 직선 $$y = x$$에 대해 뒤집은 것이 오른쪽의 $$\arcsin x$$다[^s2].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

| 함수 | 정의역 | 치역(돌려주는 각) | 뜻 |
|---|---|---|---|
| $$\arcsin x$$ | $$[-1, 1]$$ | $$[-\pi/2, \pi/2]$$ | $$\sin\theta = x$$인 그 구간의 $$\theta$$ |
| $$\arccos x$$ | $$[-1, 1]$$ | $$[0, \pi]$$ | $$\cos\theta = x$$인 그 구간의 $$\theta$$ |
| $$\arctan x$$ | $$\mathbb{R}$$ | $$(-\pi/2, \pi/2)$$ | $$\tan\theta = x$$인 그 구간의 $$\theta$$ |

$$\arcsin$$을 $$\sin^{-1}$$로도 쓴다. $$1/\sin$$과 헷갈리지 않도록 이 볼트에서는 $$\arcsin$$으로 쓴다.

**atan2.** $$(x, y) \ne (0, 0)$$에 대해 $$\operatorname{atan2}(y, x)$$는 점 $$(x, y)$$의 방향각을 $$(-\pi, \pi]$$에서 돌려준다. $$x > 0$$이면 $$\arctan(y/x)$$와 같고, 나머지 사분면은 부호를 보고 $$\pm\pi$$를 더한다.

</div>


**일반해.** $$\sin\theta = s$$ ($$\vert s\vert  \le 1$$)의 모든 해는 $$\theta = \arcsin s + 2\pi k$$ 또는 $$\theta = \pi - \arcsin s + 2\pi k$$ ($$k$$는 정수)다. 두 번째 꼴은 $$\sin(\pi - \theta) = \sin\theta$$에서 온다[^1].

두 가지 관계가 자주 쓰인다. 모두 $$\vert x\vert  \le 1$$에서 맞는다.
- $$\arcsin x + \arccos x = \dfrac{\pi}{2}$$. 각 $$\theta = \arcsin x$$에 대해 $$\cos\left(\frac{\pi}{2} - \theta\right) = \sin\theta = x$$이고, $$\frac{\pi}{2} - \theta$$가 $$[0, \pi]$$에 들기 때문이다.
- $$\sin(\arccos x) = \sqrt{1 - x^2}$$. $$\theta = \arccos x \in [0, \pi]$$($$\in$$은 "~에 속한다")에서 $$\sin\theta \ge 0$$이고 $$\sin^2\theta = 1 - \cos^2\theta = 1 - x^2$$이기 때문이다.

## 예제

$$[0, 2\pi)$$에서 $$\sin\theta = \frac12$$을 푼다.

1. *대표 답:* $$\arcsin\frac12 = \frac{\pi}{6}$$.
2. *대칭 답:* $$\pi - \frac{\pi}{6} = \frac{5\pi}{6}$$.
3. *범위 맞추기:* 둘 다 $$[0, 2\pi)$$ 안이고 $$2\pi$$를 더하거나 빼면 밖으로 나간다. 답은 $$\frac{\pi}{6}$$, $$\frac{5\pi}{6}$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 치역과 되돌리기(무작위 1만 개), 두 관계식, $$[0, 2\pi)$$의 72만 격자에서 해가 두 개뿐임, atan2, 오해의 값, 코사인 유사도의 부동소수점 문제 — [15_inverse-trig_verify.py](/Hongs_Blog/studies/college-math/code/15_inverse-trig_verify/)</div>

</div>


## 활용

- **방향 구하기.** 게임에서 적이 플레이어를 바라보게 하려면 `angle = atan2(py - ey, px - ex)`를 쓴다. 로봇의 진행 방향, 마우스 방향, [극좌표](/Hongs_Blog/studies/college-math/polar-parametric/) 변환도 모두 atan2다.
- **두 벡터 사이의 각.** $$\theta = \arccos\dfrac{\mathbf{u}\cdot\mathbf{v}}{\Vert \mathbf{u}\Vert \,\Vert \mathbf{v}\Vert }$$($$\lVert\cdot\rVert$$는 벡터의 길이)로 구한다(선형대수학의 [내적](/Hongs_Blog/studies/linear-algebra/dot-product/)). 부동소수점 오차 때문에 같은 벡터끼리도 분수 값이 $$1.0000000000000002$$처럼 1을 넘을 수 있고, 그러면 `math.acos`가 `ValueError`를 낸다. 값을 $$[-1, 1]$$로 잘라서 넣는다[^s1].
- 삼각형의 세 변에서 각을 구할 때 [코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/)과 $$\arccos$$을 함께 쓴다.
- 알고리즘에서: 원점에서 본 두 점 $$p = (p_x, p_y)$$, $$q = (q_x, q_y)$$의 각도 순서만 필요하면 atan2 대신 외적 $$p_x q_y - p_y q_x$$의 부호를 본다. 정수 좌표면 곱셈과 뺄셈뿐이라 오차가 없다. 다만 점들이 모두 180도 미만의 범위 안에 있어야 이 비교로 순서가 맞는다([계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)).

## 연결

- 선수: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/), [역함수](/Hongs_Blog/studies/college-math/inverse-function/)(정의역을 잘라 역함수를 만드는 방법)
- 이어지는 개념: [극좌표와 매개변수 곡선](/Hongs_Blog/studies/college-math/polar-parametric/)의 $$\theta = \operatorname{atan2}(y, x)$$

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"arcsin(sin x) = x다"</div>

틀렸다. 역함수라서 되돌리면 제자리일 것 같다. 하지만 $$\arcsin$$은 $$[-\pi/2, \pi/2]$$ 안의 각만 돌려준다. $$x = \frac{2\pi}{3}$$이면 $$\sin x = \frac{\sqrt3}{2}$$이고 $$\arcsin\frac{\sqrt3}{2} = \frac{\pi}{3}$$이라 원래 각이 아니다. $$\arcsin(\sin x) = x$$는 $$x$$가 그 구간 안에 있을 때만 맞는다. 반대 방향인 $$\sin(\arcsin y) = y$$는 $$\vert y\vert  \le 1$$에서 늘 맞는다.

</div>


<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/15_inverse-trig_fig2.svg" alt="그림" loading="lazy">

회색 띠 $$[-\pi/2, \pi/2]$$ 안에서만 $$\arcsin(\sin x)$$가 점선 $$y = x$$와 겹친다. 띠 밖에서는 $$-\pi/2$$와 $$\pi/2$$ 사이를 지그재그로 오갈 뿐이라 $$x$$로 돌아오지 않는다[^s2].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** arcsin의 정의역과 치역을 쓰고, 치역을 그 구간으로 제한하는 이유를 설명하라.</summary>

**답:** 정의역 $$[-1, 1]$$, 치역 $$[-\pi/2, \pi/2]$$. 사인은 실수 전체에서 일대일이 아니라 역함수가 없다. $$[-\pi/2, \pi/2]$$에서는 순증가라 일대일이고 $$[-1, 1]$$의 모든 값을 한 번씩 낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** [0, 2π)에서 sin θ = 1/2의 해를 모두 구하고, arcsin(1/2)의 값과 비교하라.</summary>

**답:** $$\frac{\pi}{6}$$, $$\frac{5\pi}{6}$$. $$\arcsin\frac12 = \frac{\pi}{6}$$로 그중 하나만 돌려준다. 나머지는 $$\pi - \arcsin\frac12$$로 구한다.

**흔한 오답:** $$\frac{\pi}{6}$$ 하나만 쓰는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 점 (−1, −1)의 방향각을 arctan(y/x)와 atan2(y, x)로 각각 구하고, 어느 쪽이 맞는지와 그 이유를 쓰라.</summary>

**답:** $$\arctan(1) = \pi/4$$(오른쪽 위를 가리켜 틀림), $$\operatorname{atan2}(-1, -1) = -3\pi/4$$(왼쪽 아래, 맞음). $$y/x$$를 계산하는 순간 두 부호가 지워져 제1사분면과 제3사분면을 구별할 수 없다. atan2는 두 부호를 따로 본다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 6.3절 "Inverse Trigonometric Functions", 일반해는 7.5절 "Solving Trigonometric Equations"
[^s1]: 에이전트 보충. atan2는 C·파이썬·자바스크립트 등 대부분의 수학 라이브러리에 있는 함수로, 인자 순서가 $$(y, x)$$다. 코사인 유사도가 1을 넘는 벡터 $$(-0.4, 0.5, 0.2)$$는 검증 코드로 찾아 확인했다.
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [15_inverse-trig_plot.py](/Hongs_Blog/studies/college-math/code/15_inverse-trig_plot/)로 그렸고, 그림에 쓴 값($$\arcsin(1/2) = \pi/6$$, 그림에 찍은 해에서 모두 $$\sin\theta = 1/2$$, $$\arcsin(\sin\frac{2\pi}{3}) = \frac{\pi}{3}$$)을 같은 코드로 확인했다.
{% endraw %}
