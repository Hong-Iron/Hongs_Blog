---
layout: "note"
title: "연속 시간 푸리에 변환"
display_title: "연속 시간 푸리에 변환 (Continuous-Time Fourier Transform)"
kind: "concept"
kind_label: "정리"
num: "38"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Continuous-Time Fourier Transform", "CTFT", "푸리에 변환", "Fourier Transform", "역푸리에 변환", "Inverse Fourier Transform", "푸리에 변환 쌍", "Fourier Transform Pair", "스펙트럼", "Spectrum", "sinc 함수", "Sinc Function", "비주기 신호", "Aperiodic Signal"]
description: "푸리에 급수는 되풀이되는 신호만 나눌 수 있다. 한 번 나타났다 사라지는 신호는 \"주기가 무한히 긴 주기 신호\"로 본다. 주기를 늘리면 고조파 사이 간격이 좁아지다가 결국 모든 주파수가 이어진 연속 스펙트럼이 되고, 급수의 합은 적분이 된다. 그것이 푸리에 변환이다. 에너지가 유한…"
prev_url: "/studies/signals-and-systems/edge-detection-smoothing/"
prev_title: "영상의 경계 검출과 평활화"
next_url: "/studies/signals-and-systems/periodic-fourier-transform/"
next_title: "주기 신호의 푸리에 변환"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/ct-fourier-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

푸리에 급수는 되풀이되는 신호만 나눌 수 있다. 한 번 나타났다 사라지는 신호는 "주기가 무한히 긴 주기 신호"로 본다. 주기를 늘리면 고조파 사이 간격이 좁아지다가 결국 모든 주파수가 이어진 연속 스펙트럼이 되고, 급수의 합은 적분이 된다. 그것이 푸리에 변환이다. 에너지가 유한한 신호, 또는 디리클레 조건을 만족하는 신호면 변환이 존재한다.

</div>


## 예시로 보기

주기 사각파($$\vert t\vert  < T_1$$에서 1)를 생각하자[^1]. 한 펄스의 폭 $$T_1$$은 그대로 두고 주기 $$T$$만 $$4T_1 \to 8T_1 \to 16T_1$$로 늘린다.

- 계수에 주기를 곱한 $$Ta_k = \frac{2\sin(k\omega_0T_1)}{k\omega_0}$$은 늘 같은 곡선 $$\frac{2\sin\omega T_1}{\omega}$$(포락선)을 $$\omega = k\omega_0$$에서 찍은 값이다.
- $$T$$를 키우면 $$\omega_0 = \frac{2\pi}{T}$$가 작아져 찍는 점이 촘촘해진다(그림 4.2).
- $$T \to \infty$$이면 이웃 펄스가 무한히 멀어져 펄스 하나만 남고, 찍은 점들은 곡선 전체가 된다. 이 곡선이 펄스 하나의 푸리에 변환이다.

포락선은 진동하는 신호의 진폭이 어떻게 변하는지를 따라 그린 곡선이다[^1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">푸리에 변환 쌍</div>

$$X(j\omega) = \int_{-\infty}^{\infty}x(t)e^{-j\omega t}dt \qquad \text{(푸리에 변환, 분석식)}$$

$$x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty}X(j\omega)e^{j\omega t}d\omega \qquad \text{(역푸리에 변환, 합성식)}$$

$$x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$$, $$X(j\omega) = \mathcal{F}\{x(t)\}$$, $$x(t) = \mathcal{F}^{-1}\{X(j\omega)\}$$로 쓴다[^2].

</div>


$$X(j\omega)$$를 $$x(t)$$의 스펙트럼이라 한다. 주기 신호는 고조파 주파수 $$k\omega_0$$에서만 크기 $$a_k$$를 갖는 복소 지수의 합이고, 비주기 신호는 모든 주파수에 걸쳐 크기 $$X(j\omega)\frac{d\omega}{2\pi}$$를 갖는 복소 지수들의 적분이다[^2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">급수에서 변환으로 (유도)</summary>

1. 비주기 신호 $$x(t)$$($$\vert t\vert  > T_1$$에서 0)의 한 주기를 되풀이해 주기 $$T$$($$T > 2T_1$$)인 $$\tilde x(t)$$를 만든다(그림 4.3).
2. $$\tilde x$$의 계수: $$\vert t\vert  < \frac T2$$에서 $$\tilde x = x$$이고 그 밖에서 $$x = 0$$이라 $$a_k = \frac1T\int_{-T/2}^{T/2}\tilde xe^{-jk\omega_0t}dt = \frac1T\int_{-\infty}^{\infty}xe^{-jk\omega_0t}dt$$.
3. $$X(j\omega) = \int x(t)e^{-j\omega t}dt$$로 정의하면 $$a_k = \frac1TX(jk\omega_0)$$.
4. 합성식에 넣고 $$\frac1T = \frac{\omega_0}{2\pi}$$를 쓰면 $$\tilde x(t) = \frac{1}{2\pi}\sum_kX(jk\omega_0)e^{jk\omega_0t}\omega_0$$.
5. 각 항은 높이 $$X(jk\omega_0)e^{jk\omega_0t}$$, 폭 $$\omega_0$$인 직사각형의 넓이다(그림 4.4). $$T \to \infty$$면 $$\omega_0 \to 0$$이고 $$\tilde x \to x$$이므로, 리만 합이 적분이 되어 $$x(t) = \frac{1}{2\pi}\int X(j\omega)e^{j\omega t}d\omega$$[^3].

역변환에 변환을 넣으면 $$\frac{1}{2\pi}\int e^{j\omega(t-t')}d\omega = \delta(t - t')$$라서 원래 $$x(t)$$가 나온다[^4].

</details>


**수렴 조건**[^5]

- 에너지가 유한하면($$\int\vert x\vert ^2dt < \infty$$) $$X(j\omega)$$가 유한하고, 역변환으로 만든 $$\hat x$$와 $$x$$의 오차 에너지가 0이다.
- 디리클레 조건(절대 적분 가능 $$\int\vert x\vert dt < \infty$$, 유한 구간에서 극값·불연속점이 유한, 불연속에서 뛰는 크기 유한)을 만족하면, 불연속점을 뺀 모든 점에서 $$\hat x = x$$이고 불연속점에서는 양쪽 평균이다. 그래서 적분 가능한 연속 신호나 불연속점이 유한한 신호는 푸리에 변환할 수 있다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 유도 2단계에서 적분 범위를 $$\pm\frac T2$$에서 $$\pm\infty$$로 넓혀도 되는 이유는?</summary>

$$x(t)$$는 $$\vert t\vert  > T_1$$에서 0이고 $$\frac T2 > T_1$$이라, 넓힌 구간에서 더해지는 값이 모두 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 유도 5단계에서 합이 적분이 되는 이유는?</summary>

폭 $$\omega_0$$인 직사각형 넓이를 더한 리만 합이고, 폭이 0으로 가면 리만 합은 정적분으로 수렴한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

비주기 신호를 주기가 무한히 긴 주기 신호로 보면, 띄엄띄엄한 고조파가 연속 주파수로 메워진다.

</details>


## 예제

**예제 4.1** $$x(t) = e^{-at}u(t)$$, $$a > 0$$[^6]

- $$X(j\omega) = \int_0^\infty e^{-(a+j\omega)t}dt = -\frac{1}{a+j\omega}e^{-(a+j\omega)t}\Big\vert _0^\infty = \frac{1}{a + j\omega}$$.
- 복소수라 크기와 위상으로 그린다: $$\vert X\vert  = \frac{1}{\sqrt{a^2 + \omega^2}}$$, $$\angle X = -\tan^{-1}\frac\omega a$$ (분모를 실수화 $$\frac{a - j\omega}{a^2 + \omega^2}$$). $$\omega = \pm a$$에서 크기는 $$\frac{\sqrt2}{2a}$$, 위상은 $$\mp\frac\pi4$$(그림 4.5).
- $$a$$가 복소수여도 $$\mathrm{Re}\{a\} > 0$$이면 같은 식이 맞다. $$a$$가 음수면 적분이 발산한다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/38_ct-fourier-transform_fig1.svg" alt="그림" width="650" height="266" loading="lazy">

$$a = 1$$일 때다. 크기는 $$\omega = 0$$에서 가장 큰 짝함수, 위상은 홀함수다. 점은 $$\omega = \pm1$$에서 크기 $$\frac{\sqrt2}{2}$$, 위상 $$\mp\frac\pi4$$다[^s2].

**예제 4.2** $$x(t) = e^{-a\vert t\vert }$$, $$a > 0$$[^7]. 양쪽으로 나눠 적분하면 $$\frac{1}{a - j\omega} + \frac{1}{a + j\omega} = \frac{2a}{a^2 + \omega^2}$$. 실수이고 짝인 종 모양이다(그림 4.7).

**예제 4.3** $$x(t) = \delta(t)$$[^7]. 표본화 성질로 $$X(j\omega) = 1$$. 모든 주파수에서 크기가 같아, 시스템에 임펄스를 넣으면 모든 주파수의 반응을 한 번에 본다. $$\delta(t - a)$$이면 $$e^{-j\omega a}$$다.

**예제 4.4** 사각 펄스 $$\vert t\vert  < T_1$$에서 1[^8]. $$X(j\omega) = \frac{1}{-j\omega}(e^{-j\omega T_1} - e^{j\omega T_1}) = \frac{2\sin\omega T_1}{\omega}$$ ($$\omega \ne 0$$), $$\omega = 0$$에서 $$2T_1$$. sinc 함수 $$\mathrm{sinc}(\theta) = \frac{\sin\pi\theta}{\pi\theta}$$로 쓰면 $$2T_1\mathrm{sinc}\left(\frac{\omega T_1}{\pi}\right)$$이다. $$\lim_{x\to0}\frac{\sin x}{x} = 1$$(테일러 급수 $$\sin x = x - \frac{x^3}{3!} + \cdots$$)이라 $$\mathrm{sinc}(0) = 1$$이다. 펄스는 불연속이라 역변환은 $$t = \pm T_1$$에서 $$\frac12$$로 수렴한다(깁스 현상).

**예제 4.5** $$X(j\omega) = 1$$ ($$\vert \omega\vert  < W$$), 0 (그 밖)[^9]. $$x(t) = \frac{1}{2\pi}\int_{-W}^{W}e^{j\omega t}d\omega = \frac{\sin Wt}{\pi t} = \frac W\pi\mathrm{sinc}\left(\frac{Wt}{\pi}\right)$$, $$x(0) = \frac W\pi$$.

예제 4.4와 4.5는 사각형과 sinc가 자리를 바꾼 쌍이다(쌍대성). $$W$$를 키우면 $$X$$가 넓어지고, $$x(t)$$는 꼭대기가 높아지며 첫 봉우리 폭($$\vert t\vert  < \frac\pi W$$)이 좁아진다. $$W \to \infty$$면 $$x(t)$$는 임펄스에 다가간다(그림 4.11). 시간에서 좁으면 주파수에서 넓다[^10].

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/38_ct-fourier-transform_fig2.svg" alt="그림" width="631" height="266" loading="lazy">

$$W$$를 1, 2, 4로 키우면 왼쪽 사각형은 넓어지고, 오른쪽 $$x(t)$$는 꼭대기 $$\frac{W}{\pi}$$가 높아지며 가운데 봉우리가 좁아진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 4.1(실수·복소수 $$a$$)·4.2·4.4·4.5를 분석식·합성식 수치 적분과 비교, 주기 사각파의 $$Ta_k$$가 포락선 값과 같음, $$X = \frac{1}{1+j\omega}$$를 역변환해 $$t = 1$$에서 $$e^{-1}$$이 나옴 — [38_ct-fourier-transform_verify.py](/Hongs_Blog/studies/signals-and-systems/code/38_ct-fourier-transform_verify/)</div>

</div>


## 활용

- 소리, 영상, 통신 신호가 어떤 주파수로 이루어져 있는지 보는 스펙트럼 분석기의 원리다.
- 시간 폭과 주파수 폭이 반비례한다는 사실(짧은 펄스는 넓은 대역이 필요)은 통신에서 빠르게 데이터를 보내려면 넓은 대역폭이 필요한 이유다[^s1].

## 연결

- 선수: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/) (포락선), [푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/)
- 수학 쪽: [푸리에 변환과 합성곱](/Hongs_Blog/studies/calculus/fourier-transform/)
- 다음: [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/), [푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"푸리에 변환의 값 $$X(j\omega_1)$$은 주파수 $$\omega_1$$ 성분의 진폭이다."</div>

틀렸다. 푸리에 급수의 $$a_k$$와 혼동해서 그럴듯하다. 연속 스펙트럼에서 한 점 주파수의 성분은 넓이가 0이다. 실제 크기는 $$X(j\omega)\frac{d\omega}{2\pi}$$, 곧 어느 주파수 구간에 걸친 밀도다. 확인: 유도 4단계에서 $$a_k = \frac1TX(jk\omega_0)$$이고 $$T \to \infty$$면 각 $$a_k$$는 0으로 간다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 푸리에 변환과 역푸리에 변환의 식을 쓰라.</summary>

**답:** $$X(j\omega) = \int x(t)e^{-j\omega t}dt$$, $$x(t) = \frac{1}{2\pi}\int X(j\omega)e^{j\omega t}d\omega$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t) = e^{-2t}u(t)$$의 $$\vert X(j\omega)\vert $$와 $$\angle X(j\omega)$$를 구하라. $$\omega = 2$$에서는?</summary>

**답:** $$X = \frac{1}{2 + j\omega}$$, $$\vert X\vert  = \frac{1}{\sqrt{4 + \omega^2}}$$, $$\angle X = -\tan^{-1}\frac\omega2$$. $$\omega = 2$$에서 $$\frac{1}{2\sqrt2}$$, $$-\frac\pi4$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주기 $$T$$를 무한히 키우면 푸리에 급수가 왜 적분이 되는가?</summary>

**답:** $$Ta_k$$는 포락선 $$X(j\omega)$$를 $$\omega_0 = \frac{2\pi}{T}$$ 간격으로 찍은 값이고, 합성식은 폭 $$\omega_0$$ 직사각형 넓이의 합(리만 합)이다. $$\omega_0 \to 0$$이면 리만 합이 적분으로 수렴한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 사각 펄스의 폭 $$T_1$$을 두 배로 늘리면 스펙트럼 $$\frac{2\sin\omega T_1}{\omega}$$의 꼭대기 높이와 첫 영점은 어떻게 되는가?</summary>

**답:** 꼭대기 $$2T_1$$은 두 배, 첫 영점 $$\frac{\pi}{T_1}$$은 절반으로 가까워진다. 시간에서 넓으면 주파수에서 좁다.

</details>


[^1]: 신호 및 시스템 14회 강의 자료 「Week14_CH04_1_handout」, p.2~6 (그림 3.7, 4.1, 4.2)
[^2]: 같은 자료, p.12
[^3]: 같은 자료, p.7~11 (그림 4.3, 4.4)
[^4]: 같은 자료, p.12
[^5]: 같은 자료, p.13
[^6]: 같은 자료, p.14 (예제 4.1, 그림 4.5)
[^7]: 같은 자료, p.15 (예제 4.2, 4.3)
[^8]: 같은 자료, p.16 (예제 4.4, 그림 4.8, 4.10)
[^9]: 같은 자료, p.17 (예제 4.5, 그림 4.9)
[^10]: 같은 자료, p.17~18 (그림 4.11)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 통신 대역폭 활용, 오해 항목, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 2장은 원본에 없다. [38_ct-fourier-transform_plot.py](/Hongs_Blog/studies/signals-and-systems/code/38_ct-fourier-transform_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 예제 4.1의 분석식 수치 적분, $$\omega = \pm1$$의 크기·위상, 예제 4.5($$W = 1, 2, 4$$)의 합성식 수치 적분과 $$x(0) = \frac W\pi$$.
{% endraw %}
