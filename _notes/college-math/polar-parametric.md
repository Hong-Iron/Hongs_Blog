---
layout: "note"
title: "극좌표와 매개변수 곡선"
display_title: "극좌표와 매개변수 곡선 (Polar Coordinates and Parametric Curves)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Polar Coordinates", "Parametric Equations", "극좌표", "매개변수 방정식", "매개변수 곡선", "parametric curve", "선형 보간", "linear interpolation", "lerp", "궤적", "trajectory"]
description: "점을 (가로, 세로) 대신 \"원점에서 얼마나 멀리, 어느 방향으로\"로 적는 것이 극좌표이고, 곡선을 \"시각 t에 점이 어디 있는가\"로 적는 것이 매개변수 표현이다. 원·나선·회전처럼 중심을 도는 모양은 극좌표로, 움직임과 궤적은 매개변수로 적으면 식이 훨씬 단순해진다. 다만 극좌표…"
prev_url: "/studies/college-math/triangle-laws/"
prev_title: "사인 법칙과 코사인 법칙"
next_url: "/studies/college-math/complex-numbers/"
next_title: "복소수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/polar-parametric/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점을 (가로, 세로) 대신 "원점에서 얼마나 멀리, 어느 방향으로"로 적는 것이 극좌표이고, 곡선을 "시각 t에 점이 어디 있는가"로 적는 것이 매개변수 표현이다. 원·나선·회전처럼 중심을 도는 모양은 극좌표로, 움직임과 궤적은 매개변수로 적으면 식이 훨씬 단순해진다. 다만 극좌표는 같은 점을 여러 방법으로 적을 수 있고(각에 한 바퀴를 더해도 같다), 원점에서는 방향이 정해지지 않는다.

</div>


## 예시로 보기

로봇의 레이저 거리 센서(라이다)는 "정면에서 30° 왼쪽, 2 m 앞에 벽"처럼 방향과 거리로 측정한다. 이것이 극좌표 $$(r, \theta) = (2, \pi/6)$$다. 지도에 찍으려면 가로·세로로 바꿔야 한다: $$(2\cos\frac{\pi}{6},\ 2\sin\frac{\pi}{6}) = (\sqrt3, 1)$$.

같은 원도 표현에 따라 식의 모양이 다르다.

| 표현 | 반지름 2인 원 | 원점에서 뻗는 나선 |
|---|---|---|
| 직교좌표 | $$x^2 + y^2 = 4$$ | 간단한 식이 없다 |
| 극좌표 | $$r = 2$$ | $$r = \theta$$ |
| 매개변수 | $$(2\cos t, 2\sin t)$$, $$0 \le t < 2\pi$$ | $$(t\cos t,\ t\sin t)$$, $$t \ge 0$$ |

매개변수 표현은 곡선의 모양뿐 아니라 **움직임**까지 담는다. $$(2\cos t, 2\sin t)$$와 $$(2\cos 2t, 2\sin 2t)$$는 같은 원이지만 둘째는 두 배 빠르게 돈다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**극좌표.** 평면의 점을 원점까지의 거리 $$r \ge 0$$과, 양의 $$x$$축에서 잰 방향각 $$\theta$$로 적은 $$(r, \theta)$$[^1]. 직교좌표와는

$$x = r\cos\theta,\quad y = r\sin\theta; \qquad r = \sqrt{x^2 + y^2},\quad \theta = \operatorname{atan2}(y, x)$$

로 오간다. $$(r, \theta)$$와 $$(r, \theta + 2\pi k)$$는 같은 점이고, $$r = 0$$이면 $$\theta$$는 아무 값이어도 원점이다.

**매개변수 곡선.** 구간 $$I$$의 각 $$t$$에 점 $$(x(t), y(t))$$를 대응시킨 것[^2]. $$t$$를 매개변수라 하고, 흔히 시각으로 읽는다.

</div>


일부 교재는 $$r < 0$$도 허용해 $$(-r, \theta)$$를 $$(r, \theta + \pi)$$와 같은 점으로 본다. 이 볼트는 $$r \ge 0$$으로 쓴다.

방향각은 [atan2](/Hongs_Blog/studies/college-math/inverse-trig/)로 구한다. $$\arctan(y/x)$$는 사분면을 잃는다.

## 예제

**직교좌표 → 극좌표.** 점 $$(-1, \sqrt3)$$.

1. *거리:* $$r = \sqrt{1 + 3} = 2$$.
2. *방향:* $$\operatorname{atan2}(\sqrt3, -1) = \frac{2\pi}{3}$$. 제2사분면이라 $$\arctan(-\sqrt3) = -\frac{\pi}{3}$$이 아니다.
3. *확인:* $$(2\cos\frac{2\pi}{3}, 2\sin\frac{2\pi}{3}) = (-1, \sqrt3)$$.

**선형 보간.** 점 $$P$$에서 $$Q$$로 가는 선분은 $$L(t) = P + t(Q - P)$$, $$0 \le t \le 1$$이다. $$P = (0, 0)$$, $$Q = (4, 2)$$이면 $$L(0.25) = (1, 0.5)$$, $$L(0.5) = (2, 1)$$이다. $$t$$가 0이면 출발점, 1이면 도착점이다.

**포물선 운동.** 속력 $$v$$, 발사각 $$\alpha$$로 던진 공은 $$(vt\cos\alpha,\ vt\sin\alpha - \frac12 g t^2)$$을 따라간다. $$v = 20$$ m/s, $$\alpha = 45°$$, $$g = 9.8$$ m/s²이면 $$y = 0$$으로 돌아오는 $$t = 2v\sin\alpha / g$$에서 약 40.8 m 떨어진 곳에 떨어진다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 좌표 변환, 각에 $$2\pi k$$ 더하기, 두 원의 속력 2와 4, 선형 보간, 포물선 사거리 40.82 m — [17_polar-parametric_verify.py](/Hongs_Blog/studies/college-math/code/17_polar-parametric_verify/)</div>

</div>


## 활용

- **애니메이션.** 물체를 A에서 B로 옮기는 트윈(tween)은 선형 보간 $$L(t)$$에 시간을 넣는 것이다. $$t$$를 $$t^2$$ 같은 곡선으로 바꾸면 천천히 출발하는 움직임이 된다.
- **센서와 로봇.** 라이다·레이더·소나 데이터는 극좌표로 나온다. 지도를 만들려면 $$x = r\cos\theta$$, $$y = r\sin\theta$$로 바꾼다.
- **곡선 그리기.** 폰트와 벡터 그래픽의 베지어 곡선은 $$t$$에 대한 다항식으로 된 매개변수 곡선이다([추상 벡터공간과 베지어 곡선](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/)).
- **복소수.** 복소수의 극형식 $$r(\cos\theta + i\sin\theta)$$는 극좌표와 같은 생각이다. [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)으로 이어진다.
- 알고리즘에서: 한 점 둘레의 점들을 방향각 $$\theta$$ 순서로 세우는 각도 순 정렬이 [계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)에 나온다. 코드에서는 실수 오차를 피하려고 $$\theta$$를 atan2로 구하지 않고, 외적의 부호로 두 점의 순서를 정한다. 다만 이 비교는 점들이 그 점에서 본 180도 미만의 범위 안에 있을 때만 앞뒤가 맞는다.

## 연결

- 선수: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)
- 함께 쓰는 개념: [역삼각함수](/Hongs_Blog/studies/college-math/inverse-trig/)(atan2)
- 이어지는 개념: [복소수의 극형식](/Hongs_Blog/studies/college-math/euler-formula/), 미분적분학의 [중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/)에서 극좌표 변환

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 점 (−1, √3)을 극좌표로 (b) 극좌표 (3, π/6)을 직교좌표로 바꾸라.</summary>

**답:** (a) $$(2, \frac{2\pi}{3})$$. (b) $$(3\cos\frac{\pi}{6}, 3\sin\frac{\pi}{6}) = (\frac{3\sqrt3}{2}, \frac32)$$.

**흔한 오답:** (a)에서 $$\arctan(\sqrt3 / -1) = -\frac{\pi}{3}$$을 그대로 쓰는 것. 점은 제2사분면에 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 매개변수 곡선 (2 cos t, 2 sin t)와 (2 cos 2t, 2 sin 2t)를 x, y의 식으로 바꾸고, 두 움직임의 차이를 쓰라.</summary>

**답:** 둘 다 $$x^2 + y^2 = 4$$(반지름 2인 원)다. $$\cos^2 + \sin^2 = 1$$이기 때문이다. 첫째는 $$t$$가 $$2\pi$$ 늘 때 한 바퀴, 둘째는 $$\pi$$만 늘어도 한 바퀴라 두 배 빠르다(속력 2와 4). 식 하나로 바꾸면 이 속도 정보가 사라진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 점 (0, 0)에서 (4, 2)로 가는 선분을 매개변수로 쓰고, 전체의 1/4 지점과 중점을 구하라.</summary>

**답:** $$L(t) = (4t, 2t)$$, $$0 \le t \le 1$$. $$L(0.25) = (1, 0.5)$$, $$L(0.5) = (2, 1)$$.

</details>


[^1]: OpenStax, *Precalculus 2e*, 8.3절 "Polar Coordinates", 8.4절 "Polar Coordinates: Graphs"
[^2]: OpenStax, *Precalculus 2e*, 8.6절 "Parametric Equations", 8.7절 "Parametric Equations: Graphs"(포물선 운동 포함)
{% endraw %}
