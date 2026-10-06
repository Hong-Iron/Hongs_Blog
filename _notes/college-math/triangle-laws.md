---
layout: "note"
title: "사인 법칙과 코사인 법칙"
display_title: "사인 법칙과 코사인 법칙 (Laws of Sines and Cosines)"
kind: "concept"
kind_label: "정리"
num: "16"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Law of Sines", "Law of Cosines", "사인 법칙", "코사인 법칙", "삼각형의 넓이", "삼각측량", "triangulation", "두 점 사이의 거리", "distance formula", "모호한 경우", "ambiguous case"]
description: "직각이 아닌 삼각형에서도 변과 각 사이의 관계를 알려 주는 두 공식이다. 코사인 법칙은 피타고라스 정리에 \"직각에서 벗어난 만큼\" 보정하는 항을 붙인 것이라, 세 변을 알면 각을, 두 변과 끼인각을 알면 나머지 변을 구한다. 사인 법칙은 각과 마주 보는 변의 비가 모두 같다는 것이…"
prev_url: "/studies/college-math/inverse-trig/"
prev_title: "역삼각함수"
next_url: "/studies/college-math/polar-parametric/"
next_title: "극좌표와 매개변수 곡선"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/triangle-laws/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직각이 아닌 삼각형에서도 변과 각 사이의 관계를 알려 주는 두 공식이다. 코사인 법칙은 피타고라스 정리에 "직각에서 벗어난 만큼" 보정하는 항을 붙인 것이라, 세 변을 알면 각을, 두 변과 끼인각을 알면 나머지 변을 구한다. 사인 법칙은 각과 마주 보는 변의 비가 모두 같다는 것이다. 다만 두 변과 그 사이에 끼지 않은 각만 알면 삼각형이 두 개일 수 있다.

</div>


## 예시로 보기

두 도로가 한 교차로에서 60° 벌어져 나간다. 한 도로로 5 km, 다른 도로로 8 km 간 두 지점 사이의 직선 거리는 얼마인가? 60°가 90°였다면 피타고라스로 $$\sqrt{25 + 64}$$다. 각이 더 좁으니 거리가 그보다 짧아야 한다. 코사인 법칙은 그 차이를 정확히 뺀다.

$$c^2 = 5^2 + 8^2 - 2 \cdot 5 \cdot 8 \cdot \cos 60° = 25 + 64 - 40 = 49, \qquad c = 7 \text{ km}$$


두 도로의 길이가 아래 정리의 $$a$$, $$b$$, 벌어진 각이 $$C$$, 구하는 거리가 $$c$$다.

## 정의

삼각형의 세 변을 $$a$$, $$b$$, $$c$$, 각 변과 마주 보는 각을 $$A$$, $$B$$, $$C$$라 한다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

모든 삼각형에서[^1]
1. **코사인 법칙:** $$c^2 = a^2 + b^2 - 2ab\cos C$$ (다른 변도 같은 꼴)
2. **사인 법칙:** $$\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$$
3. **넓이:** $$\text{넓이} = \tfrac12 ab\sin C$$

</div>


$$C = 90°$$이면 $$\cos C = 0$$이라 코사인 법칙이 피타고라스 정리가 된다. $$C$$가 90°보다 작으면 $$\cos C > 0$$이라 $$c$$가 짧아지고, 크면 길어진다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. $$C$$를 원점에, $$B$$를 $$(a, 0)$$에 두면 $$A$$는 $$(b\cos C, b\sin C)$$다([삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)의 정의). 두 점 사이 거리의 제곱은 $$(b\cos C - a)^2 + (b\sin C)^2 = b^2(\cos^2 C + \sin^2 C) - 2ab\cos C + a^2 = a^2 + b^2 - 2ab\cos C$$.
3. 같은 좌표에서 밑변 $$a$$ 위의 높이가 $$b\sin C$$이므로 넓이는 $$\frac12 ab\sin C$$다.
2. 넓이를 세 가지로 쓰면 $$\frac12 ab\sin C = \frac12 bc\sin A = \frac12 ca\sin B$$다. 모두 $$\frac12 abc$$로 나누면 $$\frac{\sin C}{c} = \frac{\sin A}{a} = \frac{\sin B}{b}$$. ∎

</details>


좌표평면의 두 점 $$(x_1, y_1)$$, $$(x_2, y_2)$$ 사이 거리 $$\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$은 가로·세로가 직각을 이루는 피타고라스의 경우다.

## 예제

**삼각측량.** 10 m 떨어진 두 관측점 P, Q에서 목표 T를 보니, 기선 PQ와 이루는 각이 P에서 60°, Q에서 70°다. P에서 T까지의 거리는?

1. *셋째 각:* $$\angle T = 180° - 60° - 70° = 50°$$.
2. *사인 법칙 세우기:* PT는 Q의 맞은편 변이므로 $$\dfrac{PT}{\sin 70°} = \dfrac{PQ}{\sin 50°}$$.
3. *계산:* $$PT = 10 \times \dfrac{\sin 70°}{\sin 50°} \approx 12.27$$ m.

두 눈이 조금 떨어져 있어 거리를 가늠하는 [양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/)도 같은 삼각측량이다. 두 눈 사이가 기선이다.

**모호한 경우.** $$a = 6$$, $$b = 8$$, $$A = 30°$$인 삼각형을 찾는다.

1. *사인 법칙:* $$\sin B = \dfrac{8\sin 30°}{6} = \dfrac23$$.
2. *각 두 개:* $$B \approx 41.81°$$ 또는 $$180° - 41.81° = 138.19°$$.
3. *둘 다 되는지:* $$30° + 138.19° < 180°$$이므로 두 경우 모두 삼각형이 된다. 주어진 정보만으로는 하나로 정해지지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 삼각형 5,000개(각은 좌표에서 따로 측정)에서 세 공식, 예시의 7 km, 삼각측량 12.27 m, 모호한 경우의 두 삼각형 — [16_triangle-laws_verify.py](/Hongs_Blog/studies/college-math/code/16_triangle-laws_verify/)</div>

</div>


## 활용

- **위치 추정.** 측량, GPS 이전의 항법, 스테레오 카메라의 깊이 추정이 삼각측량이다.
- **그래픽.** 삼각형 메시의 넓이 $$\frac12 ab\sin C$$, 두 변 사이 각을 세 변에서 구하는 계산($$\arccos$$과 함께)이 흔하다.
- **내적으로 가는 다리.** 코사인 법칙을 벡터로 쓰면 $$\Vert \mathbf{u} - \mathbf{v}\Vert ^2 = \Vert \mathbf{u}\Vert ^2 + \Vert \mathbf{v}\Vert ^2 - 2\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$($$\lVert\cdot\rVert$$는 벡터의 길이)다. 여기서 $$\Vert \mathbf{u}\Vert \Vert \mathbf{v}\Vert \cos\theta$$가 선형대수학의 [내적](/Hongs_Blog/studies/linear-algebra/dot-product/)이다.
- 알고리즘에서: 증명에서처럼 각 $$C$$를 변 CB에서 CA까지 반시계 방향으로 재서 부호를 살리면 $$ab\sin C$$는 [계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)의 외적이 된다. 크기는 삼각형 넓이의 두 배이고, 부호는 C → B → A가 왼쪽으로 꺾는지 오른쪽으로 꺾는지를 알려 준다.

## 연결

- 선수: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)
- 함께 쓰는 개념: [역삼각함수](/Hongs_Blog/studies/college-math/inverse-trig/)(세 변에서 각을 구할 때 $$\arccos$$)
- 이어지는 곳: 선형대수학의 [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 두 변이 5와 8이고 끼인각이 60°인 삼각형의 셋째 변과 넓이를 구하라.</summary>

**답:** $$c^2 = 25 + 64 - 80 \cdot \frac12 = 49$$이므로 $$c = 7$$. 넓이는 $$\frac12 \cdot 5 \cdot 8 \cdot \sin 60° = 10\sqrt3 \approx 17.32$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 코사인 법칙의 −2ab cos C 항은 무엇을 보정하는가? C가 예각, 직각, 둔각일 때 c²는 a² + b²보다 각각 어떤가?</summary>

**답:** 끼인각이 직각에서 벗어난 만큼 셋째 변의 길이를 고친다. 예각이면 $$\cos C > 0$$이라 $$c^2 < a^2 + b^2$$(더 짧음), 직각이면 같음(피타고라스), 둔각이면 $$\cos C < 0$$이라 더 길다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 변과 한 각을 알아도 삼각형이 하나로 정해지지 않는 예를 들고, 두 삼각형의 각을 구하라.</summary>

**답:** $$a = 6$$, $$b = 8$$, $$A = 30°$$. $$\sin B = \frac23$$이라 $$B \approx 41.81°$$(그러면 $$C \approx 108.19°$$)와 $$B \approx 138.19°$$(그러면 $$C \approx 11.81°$$)가 모두 된다. 주어진 각이 두 변 사이에 끼어 있지 않을 때 생긴다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 8.1절 "Non-right Triangles: Law of Sines"(모호한 경우와 넓이 포함), 8.2절 "Non-right Triangles: Law of Cosines"
{% endraw %}
