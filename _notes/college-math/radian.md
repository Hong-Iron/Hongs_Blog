---
layout: "note"
title: "각과 라디안"
display_title: "각과 라디안 (Radian)"
kind: "concept"
kind_label: "정의"
num: "11"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Radian", "rad", "호도법", "도", "degree", "호의 길이", "arc length", "부채꼴 넓이", "각속도", "angular velocity", "동경", "coterminal angle"]
description: "라디안은 각을 \"호의 길이가 반지름의 몇 배인가\"로 재는 단위다. 도(°)는 한 바퀴를 360으로 나눈 사람이 정한 눈금이지만, 라디안은 원의 크기에서 저절로 나와서 호의 길이·넓이·미분 공식이 가장 간단해진다. 한 바퀴는 약 6.28라디안(2π)이다. 프로그래밍 언어의 삼각함수는…"
prev_url: "/studies/college-math/positional-notation/"
prev_title: "진법과 자릿수"
next_url: "/studies/college-math/trig-functions/"
next_title: "삼각함수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/radian/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

라디안은 각을 "호의 길이가 반지름의 몇 배인가"로 재는 단위다. 도(°)는 한 바퀴를 360으로 나눈 사람이 정한 눈금이지만, 라디안은 원의 크기에서 저절로 나와서 호의 길이·넓이·미분 공식이 가장 간단해진다. 한 바퀴는 약 6.28라디안(2π)이다. 프로그래밍 언어의 삼각함수는 거의 모두 라디안을 받으므로, 도를 그대로 넣으면 오류 없이 틀린 값이 나온다.

</div>


## 예시로 보기

반지름 2 m인 원 둘레를 따라 2 m를 걸으면, 중심에서 본 각이 1라디안이다. 반지름만큼 걸었기 때문이다. 이 각은 도로 약 57.3°다. 둘레 전체는 $$2\pi \times 2$$ m이므로 한 바퀴는 $$2\pi$$라디안이다.

| 도 | 30° | 45° | 60° | 90° | 180° | 360° |
|---|---|---|---|---|---|---|
| 라디안 | $$\pi/6$$ | $$\pi/4$$ | $$\pi/3$$ | $$\pi/2$$ | $$\pi$$ | $$2\pi$$ |

걸은 거리가 아래 정의의 호의 길이 $$s$$, 반지름이 $$r$$, 각이 $$\theta$$다. 라디안은 "길이 ÷ 길이"라 단위가 없는 수다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/11_radian_fig1.svg" alt="그림" loading="lazy">

주황 호의 길이가 반지름(파란 선)과 같은 2일 때, 두 반지름 사이의 각이 1라디안이다. 원을 여섯으로 나눈 60°보다 조금 작다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

반지름 $$r$$인 원에서 중심각 $$\theta$$가 잘라 내는 호의 길이를 $$s$$라 할 때, $$\theta = s / r$$을 그 각의 **라디안** 크기라 한다[^1]. 한 바퀴는 $$2\pi$$라디안이므로

$$1\ \text{rad} = \frac{180°}{\pi} \approx 57.2958°, \qquad 1° = \frac{\pi}{180}\ \text{rad}$$

이다. $$\theta$$가 라디안일 때
- 호의 길이: $$s = r\theta$$
- 부채꼴 넓이: $$A = \tfrac12 r^2 \theta$$ (원 전체 $$\pi r^2$$의 $$\theta / 2\pi$$만큼)
- 각속도 $$\omega$$(rad/s)로 도는 점의 속력: $$v = r\omega$$

</div>


각은 방향이 있다. 시계 반대 방향이 양수, 시계 방향이 음수다. $$\theta$$와 $$\theta + 2\pi k$$($$k$$는 정수)는 같은 방향을 가리킨다.

**설계 이유.** 360은 날짜 수에 가까워 옛사람이 고른 수다. 라디안은 원 자체에서 나와서, 공식에 변환 상수가 끼지 않는다. 도로 쓰면 호의 길이가 $$s = \pi r \theta / 180$$이 된다. 미분에서도 $$\sin$$의 도함수가 $$\cos$$이 되는 것은 라디안일 때뿐이다[^s1].

## 예제

**각속도에서 속력으로.** 7200 rpm(분당 회전수)으로 도는 원판에서 중심으로부터 4 cm 떨어진 점의 속력을 구한다.

1. *라디안 각속도로 바꾸기:* 한 바퀴가 $$2\pi$$라디안이므로 $$\omega = 7200 \times 2\pi / 60 \approx 753.98$$ rad/s.
2. *속력:* $$v = r\omega = 0.04 \times 753.98 \approx 30.16$$ m/s. 시속 약 109 km다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변환표, 호의 길이를 선분 10만 개의 합과 비교(실험으로 확인됨), 예제, 각 맞추기, 카드 C2·C3과 오해의 값 — [11_radian_verify.py](/Hongs_Blog/studies/college-math/code/11_radian_verify/)</div>

</div>


## 활용

- 파이썬 `math.sin`, C의 `sin`, 자바스크립트 `Math.sin`은 모두 라디안을 받는다. 도는 `math.radians(도)`로 바꿔 넣는다. CSS의 `rotate(90deg)`처럼 단위를 적는 곳도 있다.
- 게임에서 캐릭터가 계속 돌면 각이 계속 커진다. $$[0, 2\pi)$$로 맞추려면 파이썬에서는 `theta % (2*math.pi)`를 쓴다. 파이썬의 `%`는 법이 양수이면 결과가 늘 0 이상이다. C의 `fmod`는 부호를 유지해서 음수가 나올 수 있다[^s1].
- 모터·디스크·바퀴의 회전 속도(rpm)를 선속도로 바꿀 때 $$v = r\omega$$를 쓴다.

## 연결

- 선수: [함수](/Hongs_Blog/studies/college-math/function/)
- 이어지는 개념: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)(각을 입력으로 받는 함수), [극좌표](/Hongs_Blog/studies/college-math/polar-parametric/)(점을 거리와 각으로 적기)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"math.sin(30)은 0.5다"</div>

틀렸다. 교과서에서 $$\sin 30° = \frac12$$을 외워서 30을 넣으면 0.5가 나올 것 같다. 실제로 `math.sin(30)`은 30**라디안**의 사인이라 약 $$-0.988$$이다. 30라디안은 거의 다섯 바퀴다. `math.sin(math.radians(30))`이라야 0.5가 나온다. 오류가 나지 않아서 늦게 발견되는 버그다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 라디안을 정의하고, 한 바퀴가 왜 2π 라디안인지 설명하라.</summary>

**답:** 중심각이 잘라 내는 호의 길이를 반지름으로 나눈 값이다($$\theta = s/r$$). 한 바퀴의 호는 원 둘레 $$2\pi r$$이므로 $$2\pi r / r = 2\pi$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (a) 150°를 라디안으로 (b) 3 rad을 도로 바꾸라. (c) 반지름 5인 원에서 중심각 0.8 rad의 호의 길이는?</summary>

**답:** (a) $$150 \times \pi / 180 = 5\pi/6$$. (b) $$3 \times 180 / \pi \approx 171.9°$$. (c) $$s = r\theta = 5 \times 0.8 = 4$$.

**흔한 오답:** (c)에서 $$5 \times 0.8 \times \pi$$처럼 $$\pi$$를 한 번 더 곱하는 것. 라디안에는 이미 $$\pi$$가 들어 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 각 −π/3과 5π/3이 같은 방향인 이유를 쓰고, 파이썬에서 임의의 각을 [0, 2π)로 맞추는 식을 쓰라.</summary>

**답:** $$-\pi/3 + 2\pi = 5\pi/3$$으로 한 바퀴 차이다. 식은 `theta % (2*math.pi)`. $$-\pi/3$$을 넣으면 $$5\pi/3 \approx 5.236$$이 나온다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 5.1절 "Angles"(라디안, 호의 길이, 부채꼴 넓이, 각속도와 선속도)
[^s1]: 에이전트 보충. $$\sin$$의 도함수가 라디안에서만 $$\cos$$이라는 것은 미분적분학의 [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)에서 보인다. 파이썬 `%`와 C `fmod`의 부호 차이는 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [11_radian_plot.py](/Hongs_Blog/studies/college-math/code/11_radian_plot/)로 그렸고, 그림에 쓴 값(선분 10만 개로 잰 호의 길이가 2, $$1\ \text{rad} = 57.2958°$$)을 같은 코드로 확인했다.
{% endraw %}
