---
layout: "note"
title: "푸리에 변환의 쌍대성"
display_title: "푸리에 변환의 쌍대성 (Duality)"
kind: "concept"
kind_label: "정리"
num: "41"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Duality", "쌍대성", "쌍대성 정리", "Duality Theorem", "사각 펄스와 sinc"]
description: "푸리에 변환식과 역변환식은 부호와 2\\pi만 빼면 모양이 같다. 그래서 시간과 주파수의 역할을 바꾼 쌍이 늘 함께 있다. 사각 펄스의 변환이 sinc이면, sinc의 변환은 사각 펄스다. 한쪽 쌍만 알면 다른 쪽 쌍을 공짜로 얻는다. 다만 바꿀 때 2\\pi와 \\omega의 부호(-…"
prev_url: "/studies/signals-and-systems/fourier-transform-properties/"
prev_title: "푸리에 변환의 성질"
next_url: "/studies/signals-and-systems/convolution-property/"
next_title: "컨벌루션 성질과 주파수 응답"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/fourier-duality/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

푸리에 변환식과 역변환식은 부호와 $$2\pi$$만 빼면 모양이 같다. 그래서 시간과 주파수의 역할을 바꾼 쌍이 늘 함께 있다. 사각 펄스의 변환이 sinc이면, sinc의 변환은 사각 펄스다. 한쪽 쌍만 알면 다른 쪽 쌍을 공짜로 얻는다. 다만 바꿀 때 $$2\pi$$와 $$\omega$$의 부호($$-\omega$$)를 빠뜨리지 말아야 한다.

</div>


## 예시로 보기

예제 4.4와 4.5를 나란히 놓는다(그림 4.17)[^1].

| 시간 | 주파수 |
|---|---|
| $$x_1(t)$$: $$\lvert t\rvert < T_1$$에서 1 | $$X_1(j\omega) = \frac{2\sin\omega T_1}{\omega}$$ |
| $$x_2(t) = \frac{\sin Wt}{\pi t}$$ | $$X_2(j\omega)$$: $$\lvert\omega\rvert < W$$에서 1 |

사각형과 sinc가 자리를 서로 바꿨다. 어떤 시간 함수의 성질이 주파수 쪽과 관계가 있으면, 같은 성질이 주파수 함수와 시간 쪽 사이에도 있다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">쌍대성 정리</div>

$$x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$$이면 $$X(t) \overset{\mathcal{F}}{\longleftrightarrow} 2\pi x(-\omega)$$이다[^2].

</div>


역변환식 $$2\pi x(t) = \int X(j\omega)e^{j\omega t}d\omega$$에서 $$t$$를 $$-t$$로 바꾼 뒤 $$t$$와 $$\omega$$의 이름을 맞바꾸면 $$2\pi x(-\omega) = \int X(t)e^{-j\omega t}dt$$, 곧 $$X(t)$$의 푸리에 변환이다[^s1].

**성질 표에서의 쌍**[^3]

| 시간 쪽 성질 | 쌍대 성질 |
|---|---|
| 미분 $$\frac{dx}{dt} \leftrightarrow j\omega X$$ | 주파수 미분 $$-jtx(t) \leftrightarrow \frac{dX}{d\omega}$$ |
| 시간 이동 $$x(t - t_0) \leftrightarrow e^{-j\omega t_0}X$$ | 주파수 이동 $$e^{j\omega_0t}x \leftrightarrow X(j(\omega - \omega_0))$$ |
| 컨벌루션 → 곱 | 곱 → 컨벌루션 |

## 예제

**예제 4.13** $$g(t) = \frac{2}{1 + t^2}$$의 변환[^4]

1. 예제 4.2에서 $$e^{-\vert t\vert } \leftrightarrow \frac{2}{1 + \omega^2}$$.
2. 역변환식: $$e^{-\vert t\vert } = \frac{1}{2\pi}\int\frac{2}{1+\omega^2}e^{j\omega t}d\omega$$.
3. $$2\pi$$를 곱하고 $$t$$를 $$-t$$로: $$2\pi e^{-\vert t\vert } = \int\frac{2}{1+\omega^2}e^{-j\omega t}d\omega$$.
4. $$t$$와 $$\omega$$를 바꾸면 $$2\pi e^{-\vert \omega\vert } = \int\frac{2}{1+t^2}e^{-j\omega t}dt$$, 곧 $$G(j\omega) = 2\pi e^{-\vert \omega\vert }$$.

**다른 예**[^2]

- $$\delta(t) \leftrightarrow 1$$이면 $$1 \leftrightarrow 2\pi\delta(-\omega) = 2\pi\delta(\omega)$$.
- $$e^{-at}u(t) \leftrightarrow \frac{1}{a + j\omega}$$이면 $$\frac{1}{a + jt} \leftrightarrow 2\pi e^{a\omega}u(-\omega)$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 4.13을 수치 적분해 $$2\pi e^{-\vert \omega\vert }$$와 일치, sinc 꼴 $$\frac{2\sin t}{t}$$의 변환이 $$2\pi \times$$ 사각 펄스임, $$1$$의 변환이 $$\omega = 0$$에서만 커짐 확인 — [41_duality_verify.py](/Hongs_Blog/studies/signals-and-systems/code/41_duality_verify/)</div>

</div>


## 활용

- 이상적 저역 통과 필터(주파수에서 사각형)의 임펄스 응답이 sinc인 이유를 쌍대성으로 바로 안다 → [컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/)
- 컨벌루션 성질의 쌍대가 곱셈 성질이고, 이것이 진폭 변조의 원리다 → [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)

## 연결

- 선수: [푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 쌍대성 정리를 식으로 쓰라.</summary>

**답:** $$x(t) \leftrightarrow X(j\omega)$$이면 $$X(t) \leftrightarrow 2\pi x(-\omega)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 쌍대성으로 $$\frac{\sin 3t}{\pi t}$$의 변환을 구하라.</summary>

**답:** 예제 4.5의 쌍($$W = 3$$)과 같다: $$\vert \omega\vert  < 3$$에서 1, 그 밖 0.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 쌍대성에서 $$x(-\omega)$$처럼 부호가 바뀌는 이유는?</summary>

**답:** 변환식은 $$e^{-j\omega t}$$, 역변환식은 $$e^{+j\omega t}$$를 쓴다. 한쪽 식을 다른 쪽 모양으로 맞추려면 $$t$$를 $$-t$$로 바꿔야 해서 부호가 뒤집힌다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/14.Week14_CH04_2_handout.pdf, p.25 (그림 4.17), 3-1학기/신호 및 시스템/1.수업자료/14.Week14_CH04_1_handout.pdf, p.17
[^2]: 같은 자료(14.Week14_CH04_2_handout.pdf), p.28 (쌍대성 정리)
[^3]: 같은 자료, p.26
[^4]: 같은 자료, p.27 (예제 4.13)
[^s1]: 에이전트 보충. 쌍대성 정리의 한 줄 유도와 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
