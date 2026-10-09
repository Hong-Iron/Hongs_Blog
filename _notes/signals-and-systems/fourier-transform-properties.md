---
layout: "note"
title: "푸리에 변환의 성질"
display_title: "푸리에 변환의 성질 (Properties of the Fourier Transform)"
kind: "concept"
kind_label: "정리"
num: "40"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Properties of the Fourier Transform", "표 4.1", "시간 이동", "주파수 이동", "Frequency Shifting", "켤레 대칭", "Conjugate Symmetry", "시간 척도", "Time Scaling", "미분 성질", "적분 성질", "주파수 미분", "Differentiation in Frequency", "파스발 관계", "Parseval's Relation", "에너지 밀도 스펙트럼", "Energy-Density Spectrum"]
description: "푸리에 급수에서 본 성질표(표 3.1)가 푸리에 변환에도 거의 그대로 있다(표 4.1). 늦추면 위상만 돌고, 빨리 감으면 스펙트럼이 넓어지고, 미분하면 j\\omega가 곱해지고, 실수 신호의 스펙트럼은 좌우 켤레 대칭이다. 이 표를 쓰면 적분을 직접 하지 않고 아는 변환 몇 개에…"
prev_url: "/studies/signals-and-systems/periodic-fourier-transform/"
prev_title: "주기 신호의 푸리에 변환"
next_url: "/studies/signals-and-systems/fourier-duality/"
next_title: "푸리에 변환의 쌍대성"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/fourier-transform-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

푸리에 급수에서 본 성질표(표 3.1)가 푸리에 변환에도 거의 그대로 있다(표 4.1). 늦추면 위상만 돌고, 빨리 감으면 스펙트럼이 넓어지고, 미분하면 $$j\omega$$가 곱해지고, 실수 신호의 스펙트럼은 좌우 켤레 대칭이다. 이 표를 쓰면 적분을 직접 하지 않고 아는 변환 몇 개에서 새 변환을 얻는다. 단, 적분 성질에는 직류 성분 때문에 임펄스 항 $$\pi X(0)\delta(\omega)$$가 붙는다.

</div>


## 예시로 보기

예제 4.9의 신호는 높이 1.5와 1의 계단 모양이다(그림 4.15)[^1]. 직접 적분하지 않고 사각 펄스 둘로 나눈다.

1. $$x(t) = \frac12x_1(t - 2.5) + x_2(t - 2.5)$$. $$x_1$$은 폭 $$\frac12$$($$T_1 = \frac12$$), $$x_2$$는 폭 $$\frac32$$($$T_1 = \frac32$$)인 대칭 사각 펄스.
2. 예제 4.4로 $$X_1 = \frac{2\sin(\omega/2)}{\omega}$$, $$X_2 = \frac{2\sin(3\omega/2)}{\omega}$$.
3. 선형성과 시간 이동: $$X(j\omega) = e^{-j5\omega/2}\dfrac{\sin(\omega/2) + 2\sin(3\omega/2)}{\omega}$$.

## 정의

$$x(t) \leftrightarrow X(j\omega)$$, $$y(t) \leftrightarrow Y(j\omega)$$[^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">표 4.1 (주요 성질)</div>

| 성질 | 신호 | 변환 |
|---|---|---|
| 선형성 | $$ax(t) + by(t)$$ | $$aX(j\omega) + bY(j\omega)$$ |
| 시간 이동 | $$x(t - t_0)$$ | $$e^{-j\omega t_0}X(j\omega)$$ |
| 주파수 이동 | $$e^{j\omega_0t}x(t)$$ | $$X(j(\omega - \omega_0))$$ |
| 켤레 | $$x^*(t)$$ | $$X^*(-j\omega)$$ |
| 시간 반전 | $$x(-t)$$ | $$X(-j\omega)$$ |
| 척도 | $$x(at)$$ | $$\frac{1}{\lvert a\rvert}X\left(\frac{j\omega}{a}\right)$$ |
| 컨벌루션 | $$x(t) * y(t)$$ | $$X(j\omega)Y(j\omega)$$ |
| 곱셈 | $$x(t)y(t)$$ | $$\frac{1}{2\pi}\int X(j\theta)Y(j(\omega - \theta))d\theta$$ |
| 시간 미분 | $$\frac{dx}{dt}$$ | $$j\omega X(j\omega)$$ |
| 적분 | $$\int_{-\infty}^{t}x(\tau)d\tau$$ | $$\frac{1}{j\omega}X(j\omega) + \pi X(0)\delta(\omega)$$ |
| 주파수 미분 | $$tx(t)$$ | $$j\frac{d}{d\omega}X(j\omega)$$ |
| 실수 신호 | $$x$$ 실수 | $$X(j\omega) = X^*(-j\omega)$$: $$\mathrm{Re}$$ 짝, $$\mathrm{Im}$$ 홀, $$\lvert X\rvert$$ 짝, $$\angle X$$ 홀 |
| 실수·짝 / 실수·홀 | | $$X$$ 실수·짝 / 순허수·홀 |
| 짝·홀 분해 | $$\mathcal{E}v\{x\}$$, $$\mathcal{O}d\{x\}$$ ($$x$$ 실수) | $$\mathrm{Re}\{X\}$$, $$j\mathrm{Im}\{X\}$$ |
| 파스발 관계 | $$\int\lvert x(t)\rvert^2dt$$ | $$\frac{1}{2\pi}\int\lvert X(j\omega)\rvert^2d\omega$$ |

</div>


[^2]

**시간 이동.** 합성식의 $$t$$를 $$t - t_0$$로 바꾸면 $$x(t - t_0) = \frac{1}{2\pi}\int(e^{-j\omega t_0}X)e^{j\omega t}d\omega$$다. 크기 $$\vert X\vert $$는 그대로이고 위상만 $$-\omega t_0$$ 바뀐다: $$\mathcal{F}\{x(t - t_0)\} = \vert X\vert e^{j[\angle X - \omega t_0]}$$[^3].

**켤레 대칭.** $$X^*(j\omega) = \int x^*(t)e^{j\omega t}dt$$에서 $$\omega$$를 $$-\omega$$로 바꾸면 $$x^* \leftrightarrow X^*(-j\omega)$$. $$x$$가 실수면 $$X(-j\omega) = X^*(j\omega)$$다. 그래서 양의 주파수만 계산하면 음의 주파수 값은 저절로 정해진다[^4]. 예제 4.1에서 $$\mathrm{Re}\{X\} = \frac{a}{a^2+\omega^2}$$는 짝, $$\mathrm{Im}\{X\} = \frac{-\omega}{a^2+\omega^2}$$는 홀이다[^5].

**미분과 적분.** 합성식을 $$t$$로 미분하면 $$\frac{dx}{dt} = \frac{1}{2\pi}\int j\omega X e^{j\omega t}d\omega$$, 곧 시간 미분은 주파수에서 $$j\omega$$ 곱셈이다. 미분방정식 시스템을 해석할 때 미분이 곱셈으로 바뀐다. 적분은 $$\frac{1}{j\omega}$$ 곱셈에, 직류 성분(평균값) 때문에 $$\omega = 0$$에 임펄스 $$\pi X(0)\delta(\omega)$$가 더해진다[^6].

**척도.** $$\tau = at$$로 바꾸면 $$a > 0$$이면 $$\frac1aX(\frac{j\omega}{a})$$, $$a < 0$$이면 적분 범위가 뒤집혀 $$-\frac1aX(\frac{j\omega}{a})$$다. 합쳐서 $$\frac{1}{\vert a\vert }X(\frac{j\omega}{a})$$[^7]. 시간에서 $$a$$배 압축하면 주파수에서 $$\frac1a$$배 압축, 곧 $$a$$배 넓어진다. 녹음을 빨리 틀면($$\vert a\vert  > 1$$) 소리가 높아지고(스펙트럼 확장), 느리게 틀면 낮아진다[^8]. $$a = -1$$이면 시간 반전 $$x(-t) \leftrightarrow X(-j\omega)$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/40_fourier-transform-properties_fig1.svg" alt="그림" width="640" height="266" loading="lazy">

$$\vert t\vert  < 1$$인 펄스 $$x(t)$$와 두 배 빨리 감은 $$x(2t)$$다. 시간 폭이 절반이 되면 스펙트럼은 첫 영점이 $$\pi$$에서 $$2\pi$$로 옮겨 가 두 배 넓어지고, 높이는 2에서 1로 절반이 된다[^s2].

**파스발 관계.** $$\int\vert x\vert ^2dt = \int x\left[\frac{1}{2\pi}\int X^*e^{-j\omega t}d\omega\right]dt$$에서 적분 순서를 바꾸면 $$\frac{1}{2\pi}\int X^*\left[\int xe^{-j\omega t}dt\right]d\omega = \frac{1}{2\pi}\int\vert X\vert ^2d\omega$$. 전체 에너지는 시간에서 $$\vert x\vert ^2$$를 적분해도, 주파수에서 $$\frac{\vert X\vert ^2}{2\pi}$$를 적분해도 같다. 그래서 $$\vert X(j\omega)\vert ^2$$를 에너지 밀도 스펙트럼이라 한다. 주기 신호의 파스발 관계 $$\frac1T\int_T\vert x\vert ^2dt = \sum\vert a_k\vert ^2$$와 짝이다[^9].

## 예제

**예제 4.10 대칭 성질로 구하기**[^10]. $$e^{-a\vert t\vert } = e^{-at}u(t) + e^{at}u(-t) = 2\mathcal{E}v\{e^{-at}u(t)\}$$. 실수 신호의 짝 부분은 $$\mathrm{Re}\{X\}$$에 대응하므로 $$X = 2\mathrm{Re}\left\{\frac{1}{a + j\omega}\right\} = \frac{2a}{a^2 + \omega^2}$$. 예제 4.2와 같다.

**예제 4.11 단위 계단**[^11]. $$u(t) = \int_{-\infty}^{t}\delta(\tau)d\tau$$이고 $$\delta \leftrightarrow 1$$이라 적분 성질로 $$U(j\omega) = \frac{1}{j\omega} + \pi\delta(\omega)$$. 거꾸로 미분하면 $$j\omega\left[\frac{1}{j\omega} + \pi\delta(\omega)\right] = 1$$($$\omega\delta(\omega) = 0$$)로 $$\delta$$의 변환이 나온다.

**예제 4.12 미분해서 구하기**[^12]. $$x(t) = t$$ ($$-1 \le t < 1$$), 그 밖 0.

1. 미분하면 $$g(t) = \frac{dx}{dt}$$는 높이 1, 폭 2인 사각 펄스에서 $$t = \pm1$$의 임펄스(넓이 $$-1$$) 둘을 뺀 것이다(그림 4.16).
2. $$G(j\omega) = \frac{2\sin\omega}{\omega} - e^{j\omega} - e^{-j\omega}$$. $$G(0) = 2 - 1 - 1 = 0$$.
3. 적분 성질: $$X = \frac{G}{j\omega} + \pi G(0)\delta(\omega) = \frac{2\sin\omega}{j\omega^2} - \frac{2\cos\omega}{j\omega}$$.
4. 확인: $$x$$는 실수·홀이고 $$X$$는 순허수·홀이다.

**예제 4.14 스펙트럼만으로 계산**[^13]. 그림 4.18의 $$X(j\omega)$$로 에너지 $$E = \int\vert x\vert ^2dt$$와 $$D = \frac{dx}{dt}\big\vert _{t=0}$$을 구한다.

- $$E$$는 파스발로: (a) $$\frac{1}{2\pi}[\pi \cdot 0.5 + \frac\pi4 \cdot 1 + \pi \cdot 0.5] = \frac58$$, (b) $$\vert {\pm j\sqrt\pi}\vert ^2 = \pi$$라 $$\frac{1}{2\pi}[\pi + \pi] = 1$$.
- $$D$$는 미분 성질과 역변환식 $$t = 0$$으로: $$D = \frac{1}{2\pi}\int j\omega X(j\omega)d\omega$$. (a) $$X$$가 짝이라 $$\omega X$$는 홀, 적분이 0. (b) $$\frac{1}{2\pi}\left[\int_{-1}^{0}\sqrt\pi\omega d\omega - \int_0^1\sqrt\pi\omega d\omega\right] = -\frac{1}{2\sqrt\pi}$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 시간 이동·주파수 이동·반전·켤레 대칭·척도($$a = 2, 0.5, -3$$)·미분·주파수 미분을 가우스 꼴 시험 신호로 수치 적분해 확인, 실수 짝·홀 대칭, 예제 4.10의 파스발, 예제 4.9·4.12의 식, 예제 4.14의 $$\frac58$$, 1, 0, $$-\frac{1}{2\sqrt\pi}$$ — [40_fourier-transform-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/40_fourier-transform-properties_verify/)</div>

</div>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 척도 성질에서 $$a < 0$$일 때 부호가 바뀌어 $$\frac{1}{\vert a\vert }$$이 되는 이유는?</summary>

$$\tau = at$$로 바꾸면 $$dt = \frac{d\tau}{a}$$이고, $$a < 0$$이면 $$t$$가 $$-\infty \to \infty$$일 때 $$\tau$$는 $$\infty \to -\infty$$로 간다. 적분 범위를 바로잡으며 부호가 한 번 더 바뀌어 $$-\frac1a = \frac{1}{\vert a\vert }$$이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 예제 4.14 (a)에서 $$D = 0$$인 이유를 대칭으로 설명하라.</summary>

$$X$$가 실수·짝이라 $$x$$도 실수·짝이다. 짝함수의 도함수는 홀함수이고 홀함수는 $$t = 0$$에서 0이다. 식으로도 $$\omega X(j\omega)$$가 홀이라 적분이 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

변환을 직접 적분하지 말고, 아는 쌍에 시간 영역 조작을 하고 그 조작의 주파수 쪽 짝(표 4.1)을 적용한다.

</details>


## 활용

- 미분방정식 → 다항식: 미분이 $$j\omega$$ 곱셈이라 회로·기계 시스템을 대수식으로 푼다 → [미분방정식 시스템의 주파수 응답](/Hongs_Blog/studies/signals-and-systems/lccde-frequency-response/)
- 척도 성질은 "빠르게 변하는 신호일수록 넓은 대역폭이 필요하다"는 통신의 기본 원리다.
- 흔한 실수: 적분 성질에서 $$\pi X(0)\delta(\omega)$$를 빠뜨리는 것, 척도에서 $$\frac{1}{\vert a\vert }$$을 빠뜨리는 것.

## 연결

- 선수: [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/), [연속 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/ctfs-properties/) (같은 표의 급수판)
- 다음: [푸리에 변환의 쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/), [컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"신호를 두 배 빨리 재생하면 스펙트럼도 두 배 좁아진다."</div>

틀렸다. 시간이 압축되니 스펙트럼도 압축될 것 같아 그럴듯하다. 실제로는 $$x(2t) \leftrightarrow \frac12X(\frac{j\omega}{2})$$라서 스펙트럼은 두 배 넓어진다(높은 주파수로 퍼진다). 확인: 테이프를 빨리 틀면 목소리가 높아진다[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 시간 이동, 척도, 시간 미분, 적분 성질을 변환 쪽 식으로 쓰라.</summary>

**답:** $$e^{-j\omega t_0}X$$, $$\frac{1}{\vert a\vert }X(\frac{j\omega}{a})$$, $$j\omega X$$, $$\frac{1}{j\omega}X + \pi X(0)\delta(\omega)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t) = e^{-a(t-2)}u(t-2)$$의 변환은?</summary>

**답:** 시간 이동으로 $$\frac{e^{-j2\omega}}{a + j\omega}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 실수 신호 $$x(t)$$의 스펙트럼에서 ① $$\vert X(j\omega)\vert $$ ② $$\angle X(j\omega)$$ ③ $$\mathrm{Re}\{X\}$$ ④ $$\mathrm{Im}\{X\}$$는 각각 짝인가 홀인가?</summary>

**답:** ① 짝 ② 홀 ③ 짝 ④ 홀.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 파스발 관계 증명에서 $$\int x\left[\frac{1}{2\pi}\int X^*e^{-j\omega t}d\omega\right]dt$$가 나오는 근거는?</summary>

**답:** $$\vert x\vert ^2 = x\,x^*$$이고, $$x^*$$를 역변환식의 켤레 $$x^*(t) = \frac{1}{2\pi}\int X^*(j\omega)e^{-j\omega t}d\omega$$로 바꿨다.

</details>


[^1]: 신호 및 시스템 14회 강의 자료 「Week14_CH04_2_handout」, p.9 (예제 4.9, 그림 4.15)
[^2]: 같은 자료, p.6~7 (표 4.1), 신호 및 시스템 15회 강의 자료 「Week15_CH04_3_handout」, p.25
[^3]: 같은 자료(14.Week14_CH04_2_handout.pdf), p.8
[^4]: 같은 자료, p.10
[^5]: 같은 자료, p.11
[^6]: 같은 자료, p.17
[^7]: 같은 자료, p.21
[^8]: 같은 자료, p.22
[^9]: 같은 자료, p.29~30
[^10]: 같은 자료, p.12~14 (예제 4.10)
[^11]: 같은 자료, p.18 (예제 4.11)
[^12]: 같은 자료, p.19~20 (예제 4.12, 그림 4.16)
[^13]: 같은 자료, p.31~32 (예제 4.14, 그림 4.18)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 오해 항목, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [40_fourier-transform-properties_plot.py](/Hongs_Blog/studies/signals-and-systems/code/40_fourier-transform-properties_plot/)로 그렸고, 같은 코드로 다음을 확인했다: $$x(2t)$$의 변환을 수치 적분해 $$\frac12X(\frac{j\omega}{2})$$와 비교, 첫 영점 $$\pi$$와 $$2\pi$$.
{% endraw %}
