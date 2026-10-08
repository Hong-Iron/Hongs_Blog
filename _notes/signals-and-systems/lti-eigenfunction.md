---
layout: "note"
title: "LTI 시스템의 고유함수"
display_title: "LTI 시스템의 고유함수 (Eigenfunctions of LTI Systems)"
kind: "concept"
kind_label: "정리"
num: "28"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Eigenfunctions of LTI Systems", "고유함수", "Eigenfunction", "고유값", "Eigenvalue", "시스템 함수", "System Function", "H(s)", "H(z)", "복소 지수 응답", "Response to Complex Exponentials"]
description: "복소 지수 e^{st}는 어떤 LTI 시스템을 지나도 모양이 그대로이고 크기와 위상만 바뀐다. 거울에 비친 얼굴이 밝기만 달라지고 얼굴 모양은 그대로인 것과 같다. 그래서 입력을 복소 지수들의 합으로 쪼개 두면, 각 조각에 시스템이 정하는 수 H(s)를 곱하기만 하면 출력이 나온다…"
prev_url: "/studies/signals-and-systems/singularity-functions/"
prev_title: "특이함수"
next_url: "/studies/signals-and-systems/eigenfunction-eigenvector-bridge/"
next_title: "LTI 고유함수 ↔ 행렬 고유벡터"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/lti-eigenfunction/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

복소 지수 $$e^{st}$$는 어떤 LTI 시스템을 지나도 모양이 그대로이고 크기와 위상만 바뀐다. 거울에 비친 얼굴이 밝기만 달라지고 얼굴 모양은 그대로인 것과 같다. 그래서 입력을 복소 지수들의 합으로 쪼개 두면, 각 조각에 시스템이 정하는 수 $$H(s)$$를 곱하기만 하면 출력이 나온다. 컨벌루션 적분을 매번 하는 대신 곱셈으로 바뀌는 것이 3장과 4장 전체의 출발점이다. 다만 $$H(s)$$를 정의하는 적분이 수렴할 때만 이 말이 맞다.

</div>


## 예시로 보기

입력을 3초 늦추는 시스템 $$y(t) = x(t - 3)$$에 $$x(t) = e^{j2t}$$를 넣어 보자(예제 3.1)[^1].

$$y(t) = e^{j2(t-3)} = e^{-j6}\,e^{j2t}$$


출력은 입력 $$e^{j2t}$$에 복소수 $$e^{-j6}$$을 곱한 것이다. 모양은 같고, 위상만 6라디안 밀렸다. 이 곱하는 수 $$e^{-j6}$$을 고유값이라 부른다.

이번엔 $$x(t) = \cos 4t + \cos 7t$$를 넣는다. 오일러 공식으로 $$x = \frac12e^{j4t} + \frac12e^{-j4t} + \frac12e^{j7t} + \frac12e^{-j7t}$$로 쪼개면, 조각마다 자기 고유값($$e^{-j12}$$, $$e^{j12}$$, $$e^{-j21}$$, $$e^{j21}$$)을 곱해 더한 것이 출력이고, 정리하면 $$\cos 4(t-3) + \cos 7(t-3)$$이다[^1].

## 정의

어떤 시스템에 신호 $$\phi(t)$$를 넣었을 때 출력이 상수배 $$\lambda\phi(t)$$이면, $$\phi$$를 그 시스템의 고유함수, $$\lambda$$를 고유값이라 한다[^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

임펄스 응답이 $$h(t)$$인 연속 시간 LTI 시스템에 $$x(t) = e^{st}$$ ($$s$$는 복소수)를 넣으면

$$y(t) = H(s)\,e^{st}, \qquad H(s) = \int_{-\infty}^{\infty}h(\tau)e^{-s\tau}d\tau$$

이다. 이산 시간에서는 $$x[n] = z^n$$이면 $$y[n] = H(z)z^n$$, $$H(z) = \sum_{k=-\infty}^{\infty}h[k]z^{-k}$$다[^3][^4]. 단, 오른쪽의 적분(합)이 수렴해야 한다.

</div>


$$H(s)$$, $$H(z)$$를 시스템 함수라 한다. $$s$$와 $$z$$는 아무 복소수나 될 수 있지만, 푸리에 해석에서는 크기가 변하지 않는 순수한 진동만 쓴다[^5].

| | 연속 시간 | 이산 시간 |
|---|---|---|
| 고유함수 | $$e^{j\omega t}$$ ($$s = j\omega$$) | $$e^{j\omega n}$$ ($$z = e^{j\omega}$$) |
| 주파수 응답 | $$H(j\omega) = \int h(t)e^{-j\omega t}dt$$ | $$H(e^{j\omega}) = \sum h[n]e^{-j\omega n}$$ |

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 컨벌루션: $$y(t) = \int h(\tau)x(t - \tau)d\tau$$ (교환법칙으로 $$h$$를 앞에 둔다)
2. 입력을 넣는다: $$= \int h(\tau)e^{s(t-\tau)}d\tau$$
3. 지수법칙: $$e^{s(t-\tau)} = e^{st}e^{-s\tau}$$
4. $$e^{st}$$는 $$\tau$$와 무관하므로 적분 밖으로: $$= e^{st}\int h(\tau)e^{-s\tau}d\tau = H(s)e^{st}$$[^3]

이산 시간도 합으로 똑같이 한다: $$\sum h[k]z^{n-k} = z^n\sum h[k]z^{-k}$$[^4].

</details>


**중첩과 함께 쓰기.** 입력이 $$x(t) = \sum_k a_ke^{s_kt}$$이면 선형성으로 출력은[^6]

$$y(t) = \sum_k a_kH(s_k)e^{s_kt}$$


각 성분의 크기 $$a_k$$에 그 주파수의 고유값 $$H(s_k)$$를 곱한 것이다. 입력과 같은 복소 지수들의 합이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3단계에서 $$e^{st}$$를 적분 밖으로 꺼낼 수 있는 이유는?</summary>

적분 변수가 $$\tau$$이고 $$e^{st}$$에는 $$\tau$$가 없다. $$t$$는 적분하는 동안 고정된 수라서 상수처럼 밖으로 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 시간 이동 시스템 $$y = x(t - 3)$$의 $$H(s)$$가 $$e^{-3s}$$인 이유는?</summary>

임펄스 응답이 $$h(t) = \delta(t - 3)$$이고, 표본화 성질로 $$\int\delta(\tau - 3)e^{-s\tau}d\tau = e^{-3s}$$다. $$s = j2$$를 넣으면 $$e^{-j6}$$으로 예시와 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

미분하거나 옮겨도 모양이 변하지 않는 지수함수는, 그런 연산으로만 이루어진 LTI 시스템을 지나도 모양이 변하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

행렬의 고유벡터($$A\mathbf{v} = \lambda\mathbf{v}$$)로 벡터를 나누면 행렬 곱이 성분별 곱셈이 된다 → [LTI 고유함수 ↔ 행렬 고유벡터](/Hongs_Blog/studies/signals-and-systems/eigenfunction-eigenvector-bridge/)

</details>


## 예제

**$$h(t) = e^{-t}u(t)$$**[^s1]. $$H(s) = \int_0^\infty e^{-\tau}e^{-s\tau}d\tau = \dfrac{1}{s + 1}$$ ($$s$$의 실수부가 $$-1$$보다 클 때만 수렴). 입력 $$e^{j2t}$$의 출력은 $$\dfrac{1}{1 + j2}e^{j2t}$$로 크기는 $$\frac{1}{\sqrt5}$$배, 위상은 $$-\tan^{-1}2$$만큼 바뀐다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$h = e^{-t}u(t)$$에 $$e^{st}$$ 세 가지를 넣어 수치 컨벌루션이 $$H(s)e^{st}$$와 일치, 예제 3.1의 고유값 분해와 직접 지연 결과 일치, 이산 $$z^n$$ 확인, 행렬 예의 고유값 1, 3 확인 — [28_lti-eigenfunction_verify.py](/Hongs_Blog/studies/signals-and-systems/code/28_lti-eigenfunction_verify/)</div>

</div>


## 활용

- 주파수 응답 $$H(j\omega)$$ 하나로 오디오 장비, 필터, 통신 채널의 성질을 나타낸다. "저음은 그대로, 고음은 절반" 같은 설명이 곧 $$\vert H(j\omega)\vert $$다[^7].
- 푸리에 이론이 중요한 이유: 신호를 주파수 성분으로 나누면 시스템 해석이 곱셈이 되고, 잡음처럼 높은 주파수를 골라 없애는 시스템을 설계할 수 있다[^7].
- 흔한 실수: $$\cos\omega t$$도 고유함수라고 생각하는 것. $$\cos$$은 $$e^{j\omega t}$$와 $$e^{-j\omega t}$$의 합이라, 두 고유값이 다르면(위상이 달라지면) 모양은 같아도 단순한 상수배가 아니다.

## 연결

- 선수: [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/), [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/)
- 같은 구조: [LTI 고유함수 ↔ 행렬 고유벡터](/Hongs_Blog/studies/signals-and-systems/eigenfunction-eigenvector-bridge/)
- 다음: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [푸리에 급수와 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/fourier-series-lti/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\cos\omega t$$를 LTI 시스템에 넣으면 출력은 늘 $$H(j\omega)\cos\omega t$$다."</div>

틀렸다. $$e^{j\omega t}$$에 대한 결과를 $$\cos$$에 그대로 옮겨서 생기는 오해다. $$\cos\omega t = \frac12(e^{j\omega t} + e^{-j\omega t})$$이고 두 성분의 고유값이 $$H(j\omega)$$, $$H(-j\omega)$$로 다르다. 실수 $$h$$이면 출력은 $$\vert H(j\omega)\vert \cos(\omega t + \angle H(j\omega))$$다. 확인: 지연 시스템에서 $$\cos 4t$$의 출력은 $$\cos(4t - 12)$$이지 $$e^{-j12}\cos 4t$$(복소수)가 아니다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** LTI 시스템에 $$e^{st}$$를 넣었을 때의 출력과 $$H(s)$$의 식을 쓰라.</summary>

**답:** $$y(t) = H(s)e^{st}$$, $$H(s) = \int_{-\infty}^{\infty}h(\tau)e^{-s\tau}d\tau$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 증명에서 $$\int h(\tau)e^{s(t-\tau)}d\tau = e^{st}\int h(\tau)e^{-s\tau}d\tau$$로 바뀌는 근거 두 가지는?</summary>

**답:** 지수법칙 $$e^{s(t-\tau)} = e^{st}e^{-s\tau}$$, 그리고 $$e^{st}$$가 적분 변수 $$\tau$$와 무관해 상수처럼 밖으로 나온다는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$h[n] = \delta[n] + 0.5\delta[n-1]$$이다. 입력 $$e^{j\pi n/2}$$의 출력은?</summary>

**답:** $$H(e^{j\omega}) = 1 + 0.5e^{-j\omega}$$, $$\omega = \frac\pi2$$에서 $$1 - 0.5j$$. 출력 $$(1 - 0.5j)e^{j\pi n/2}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 입력을 복소 지수들의 합으로 나누면 왜 출력 계산이 쉬워지는가?</summary>

**답:** 각 복소 지수는 고유함수라 시스템을 지나면 상수 $$H(s_k)$$만 곱해진다. 선형성으로 출력은 그 결과들의 합이므로, 컨벌루션 대신 성분별 곱셈만 하면 된다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/07.Week07_CH03_1_handout.pdf, p.24 (예제 3.1)
[^2]: 같은 자료, p.18, p.20
[^3]: 같은 자료, p.21
[^4]: 같은 자료, p.22
[^5]: 같은 자료, p.24
[^6]: 같은 자료, p.22~24
[^7]: 같은 자료, p.19
[^s1]: 에이전트 보충. $$h = e^{-t}u(t)$$ 예, 오해 항목, 스스로 설명해 보기의 1·3·4, 확인 문제 C3은 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
