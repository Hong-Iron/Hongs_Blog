---
layout: "note"
title: "오일러 각과 짐벌 잠금"
display_title: "오일러 각과 짐벌 잠금 (Euler Angles and Gimbal Lock)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Euler Angles", "오일러 각", "짐벌 잠금", "짐벌 락", "Gimbal Lock", "ZXZ", "ZXY", "요 피치 롤", "Yaw Pitch Roll"]
description: "비행기의 자세를 \"왼쪽으로 몇 도, 위로 몇 도, 옆으로 몇 도 기울었다\"처럼 각도 세 개로 적는 방법이다. 어떤 3차원 회전이든 축 회전 세 번의 곱으로 만들 수 있어서 사람이 읽고 입력하기 쉽다. 그러나 가운데 회전이 90°가 되면 나머지 두 회전이 같은 축을 돌게 되어 자유도…"
prev_url: "/studies/numerical-analysis/axis-rotation/"
prev_title: "임의 축 회전"
next_url: "/studies/numerical-analysis/quaternion/"
next_title: "쿼터니언"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/euler-angles/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

비행기의 자세를 "왼쪽으로 몇 도, 위로 몇 도, 옆으로 몇 도 기울었다"처럼 각도 세 개로 적는 방법이다. 어떤 3차원 회전이든 축 회전 세 번의 곱으로 만들 수 있어서 사람이 읽고 입력하기 쉽다. 그러나 가운데 회전이 90°가 되면 나머지 두 회전이 같은 축을 돌게 되어 자유도 하나를 잃는다(짐벌 잠금). 같은 자세를 나타내는 각도 묶음이 여러 개라, 두 자세 사이를 각도로 보간하면 이상한 길로 돌 수도 있다.

</div>


## 예시로 보기

카메라를 $$x$$축으로 $$\alpha$$, $$y$$축으로 $$\beta$$, $$z$$축으로 $$\gamma$$ 순서로 돌린다: $$X' = R_z(\gamma)R_y(\beta)R_x(\alpha)X$$.

$$\beta = 90°$$로 두면 $$R_y$$가 $$z$$축을 $$x$$축 자리로 눕힌다. 그 뒤로는 첫 회전($$x$$축)과 마지막 회전($$z$$축)이 같은 축을 돈다. 실제로 $$(\alpha, \gamma) = (10°, 40°)$$와 $$(0°, 30°)$$는 같은 회전이다. 둘 다 $$\gamma - \alpha = 30°$$이기 때문이다. 다이얼은 세 개인데 실제로 움직일 수 있는 방향은 두 개뿐이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: ZXZ·ZXY 곱이 회전 행렬, 순서가 다르면 다른 회전, 짐벌 잠금에서 $$\gamma - \alpha$$만 남음, 같은 자세의 두 각도 묶음, 보간 경로가 다름, 카드 C2 — [09_euler-angles_verify.py](/Hongs_Blog/studies/numerical-analysis/code/09_euler-angles_verify/)</div>

</div>


## 정의

아무 회전이나 세 축의 회전을 차례로 곱해 나타낼 수 있다. 순서가 다르면 결과가 다르다[^1]. **오일러 각**은 기본 회전 세 번으로 임의의 회전을 나타내는 세 각이다. 축을 고르는 조합은 여러 가지다[^2].

| 방식 | 식 | 뜻 |
|---|---|---|
| Z-X-Z | $$X' = R_zR_xR_zX$$ | $$z$$축, 새 $$x$$축, 새 $$z$$축 순서[^3] |
| Z-X-Y | $$X' = R_yR_xR_zX$$ | $$z$$축, $$x$$축, $$y$$축 순서[^4] |

가장 오른쪽 행렬이 먼저 작용한다. 같은 세 각이라도 방식이 다르면 다른 회전이다.

**짐벌 잠금.** 한 축의 회전이 다른 축의 회전을 덮어써서 자유도 하나를 잃는다. 슬라이드의 예: X-Y-Z 순서에서 $$y$$축을 90° 돌리면 $$z$$축이 $$x$$축과 겹친다[^5]. 식으로는 $$\beta = 90°$$일 때 $$R_z(\gamma)R_y(90°)R_x(\alpha)$$가 $$\gamma - \alpha$$에만 달려 있다[^s1].

**보간 문제.** 두 자세 사이를 이어 움직이고 싶을 때 각도를 그대로 보간하면 매끄럽지 않을 수 있다[^5]. 같은 자세를 나타내는 각도 묶음이 여럿이기 때문이다. 예를 들어 Z-X-Z에서 $$(\phi, \theta, \psi)$$와 $$(\phi + 180°, -\theta, \psi + 180°)$$는 같은 자세다. 어느 묶음을 쓰느냐에 따라 보간의 중간 자세가 달라진다[^s1].

## 활용

- 비행기·드론의 요(yaw, 좌우), 피치(pitch, 위아래), 롤(roll, 옆 기울기)이 오일러 각이다. Unity 같은 게임 엔진의 인스펙터도 회전을 오일러 각으로 보여 주지만, 안에서는 쿼터니언으로 저장한다[^s1].
- 흔한 실수: 다른 프로그램에서 받은 오일러 각을 축 순서를 확인하지 않고 쓰는 것. Z-X-Z와 Z-X-Y는 같은 숫자로 다른 자세를 만든다.

## 연결

- 선수: [임의 축 회전](/Hongs_Blog/studies/numerical-analysis/axis-rotation/)(기본 회전과 순서)
- 짐벌 잠금과 보간 문제를 피하는 표현: [쿼터니언](/Hongs_Blog/studies/numerical-analysis/quaternion/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 오일러 각이 무엇이고, Z-X-Z 방식의 식은? 오일러 각의 두 문제는?</summary>

**답:** 기본 회전 세 번으로 임의의 회전을 나타내는 세 각. Z-X-Z는 $$X' = R_zR_xR_zX$$. 문제는 짐벌 잠금(자유도 하나를 잃음)과 보간이 매끄럽지 않음.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$X' = R_z(\gamma)R_y(90°)R_x(\alpha)X$$에서 $$(\alpha, \gamma) = (10°, 40°)$$와 같은 회전이 되는 $$\alpha = 0°$$일 때의 $$\gamma$$는?</summary>

**답:** $$\gamma - \alpha$$만 남으므로 $$40° - 10° = 30°$$. $$\gamma = 30°$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 짐벌 잠금에서 "자유도 하나를 잃는다"는 것은 무슨 뜻인가?</summary>

**답:** 가운데 회전이 90°가 되면 첫 회전 축과 마지막 회전 축이 같은 방향이 된다. 그러면 두 다이얼을 돌려도 같은 축으로만 돌아, 세 다이얼로 만들 수 있는 회전 방향이 셋에서 둘로 준다. 남은 한 방향으로는 그 자세에서 바로 돌릴 수 없다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/06.na06_rotation.pdf, p.19
[^2]: 같은 자료, p.20
[^3]: 같은 자료, p.21
[^4]: 같은 자료, p.22
[^5]: 같은 자료, p.23
[^s1]: 에이전트 보충. 짐벌 잠금의 $$\gamma - \alpha$$ 식과 예, 같은 자세의 두 각도 묶음, 요·피치·롤과 게임 엔진, 흔한 실수, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
