---
layout: "note"
title: "컨벌루션 성질과 주파수 응답"
display_title: "컨벌루션 성질과 주파수 응답 (Convolution Property)"
kind: "concept"
kind_label: "정리"
num: "42"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Convolution Property", "컨벌루션 성질", "Y = HX", "주파수 응답", "Frequency Response", "이상적 저역 통과 필터", "Ideal Lowpass Filter", "부분 분수", "Partial Fraction", "역변환", "Inverse Transform"]
description: "시간 영역에서 컨벌루션한 것은 주파수 영역에서 곱한 것과 같다: y = h x이면 Y = HX. 그래서 LTI 시스템의 출력을 구할 때 복잡한 컨벌루션 적분 대신 변환해서 곱하고 다시 역변환하면 된다. 임펄스 응답의 변환 H(j\\omega)가 곧 주파수 응답이고, 주파수마다 입력을…"
prev_url: "/studies/signals-and-systems/fourier-duality/"
prev_title: "푸리에 변환의 쌍대성"
next_url: "/studies/signals-and-systems/multiplication-modulation/"
next_title: "곱셈 성질과 진폭 변조"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/convolution-property/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시간 영역에서 컨벌루션한 것은 주파수 영역에서 곱한 것과 같다: $$y = h * x$$이면 $$Y = HX$$. 그래서 LTI 시스템의 출력을 구할 때 복잡한 컨벌루션 적분 대신 변환해서 곱하고 다시 역변환하면 된다. 임펄스 응답의 변환 $$H(j\omega)$$가 곧 주파수 응답이고, 주파수마다 입력을 얼마나 키우고 미는지를 알려 준다. 단, $$H(j\omega)$$는 시스템이 안정할 때(임펄스 응답이 절대 적분 가능할 때) 존재가 보장된다.

</div>


## 예시로 보기

$$h(t) = e^{-at}u(t)$$인 시스템에 $$x(t) = e^{-bt}u(t)$$를 넣는다($$a, b > 0$$, 예제 4.19)[^1].

1. *변환:* $$X = \frac{1}{b + j\omega}$$, $$H = \frac{1}{a + j\omega}$$(예제 4.1).
2. *곱하기:* $$Y = \dfrac{1}{(a + j\omega)(b + j\omega)}$$.
3. *부분 분수($$a \ne b$$):* $$Y = \dfrac{A}{a + j\omega} + \dfrac{B}{b + j\omega}$$로 두고 분자를 맞추면 $$A + B = 0$$, $$Ab + Ba = 1$$이라 $$A = \frac{1}{b - a} = -B$$.
4. *역변환:* $$y(t) = \dfrac{1}{b - a}\left[e^{-at} - e^{-bt}\right]u(t)$$.

시간 영역 컨벌루션 $$\int_0^te^{-b\tau}e^{-a(t-\tau)}d\tau$$를 직접 해도 같은 답이 나온다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/42_convolution-property_fig1.svg" alt="그림" loading="lazy">

$$a = 1$$, $$b = 2$$일 때다. 왼쪽 시간에서는 두 신호를 컨벌루션해 $$y = e^{-t} - e^{-2t}$$를 얻고, 오른쪽 주파수에서는 같은 결과가 크기끼리의 곱 $$\vert Y\vert  = \vert H\vert \vert X\vert $$로 나온다[^s2].

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">컨벌루션 성질</div>

$$y(t) = h(t) * x(t) \overset{\mathcal{F}}{\longleftrightarrow} Y(j\omega) = H(j\omega)X(j\omega)$$

[^2]

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. $$Y = \int\left[\int x(\tau)h(t - \tau)d\tau\right]e^{-j\omega t}dt$$ (컨벌루션을 변환식에 넣음)
2. 적분 순서를 바꾸고, $$x(\tau)$$는 $$t$$와 무관하므로 밖으로: $$Y = \int x(\tau)\left[\int h(t - \tau)e^{-j\omega t}dt\right]d\tau$$
3. 안쪽은 $$h$$를 $$\tau$$만큼 옮긴 것의 변환이라 시간 이동 성질로 $$e^{-j\omega\tau}H(j\omega)$$
4. $$Y = H(j\omega)\int x(\tau)e^{-j\omega\tau}d\tau = H(j\omega)X(j\omega)$$[^2]

다른 길: 비주기 신호를 복소 지수의 적분 $$\frac{1}{2\pi}\int X(j\omega)e^{j\omega t}d\omega$$로 보면, 각 $$e^{j\omega t}$$는 고유함수라 $$H(j\omega)$$가 곱해지고, 중첩으로 $$y = \frac{1}{2\pi}\int X(j\omega)H(j\omega)e^{j\omega t}d\omega$$다. 이것을 역변환식과 비교하면 $$Y = XH$$[^3].

</details>


$$H(j\omega)$$를 주파수 응답이라 한다. 입력 스펙트럼이 주파수 $$\omega$$에서 받는 복소 배율이다. 주파수 선택 필터에서는 원하는 대역에서 $$H \approx 1$$(변화 없음), 나머지에서 $$H \approx 0$$(제거)이다[^4].

**직렬 연결.** 두 LTI 시스템을 직렬로 이으면 주파수 응답은 곱 $$H_1H_2$$이고, 곱은 순서를 바꿔도 같으므로 연결 순서와 무관하다(그림 4.19)[^4].

**존재 조건.** 모든 LTI 시스템에서 주파수 응답이 정의되지는 않는다. 안정한 시스템은 $$\int\vert h(t)\vert dt < \infty$$라 디리클레 조건 하나를 만족하고, 나머지 두 조건까지 만족하면 $$H(j\omega)$$가 존재한다[^5].

## 예제

**예제 4.15 시간 지연** $$h = \delta(t - t_0)$$[^6]. $$H = e^{-j\omega t_0}$$, $$Y = e^{-j\omega t_0}X$$이므로 $$y = x(t - t_0)$$. 모든 주파수에서 크기 1, 위상은 $$\omega$$에 비례하는 $$-\omega t_0$$.

**예제 4.16 미분기** $$y = \frac{dx}{dt}$$: $$H = j\omega$$. **예제 4.17 적분기** $$y = \int_{-\infty}^{t}x$$: $$h = u(t)$$, $$H = \frac{1}{j\omega} + \pi\delta(\omega)$$, $$Y = \frac{1}{j\omega}X + \pi X(0)\delta(\omega)$$[^7].

**예제 4.18 이상적 저역 통과 필터**[^8]. $$H = 1$$ ($$\vert \omega\vert  < \omega_c$$), 0 (그 밖).

- 예제 4.5로 $$h(t) = \dfrac{\sin\omega_ct}{\pi t} = \dfrac{\omega_c}{\pi}\mathrm{sinc}\left(\dfrac{\omega_ct}{\pi}\right)$$, $$h(0) = \frac{\omega_c}{\pi}$$(그림 4.21).
- $$t < 0$$에서 $$h(t) \ne 0$$이라 인과적이지 않다. 출력이 미래 입력에 영향을 받으므로, 실시간 시스템에는 이상적 필터를 쓸 수 없다.
- 그래서 실제로는 $$h(t) = e^{-t}u(t)$$, $$H = \frac{1}{j\omega + 1}$$(RC 회로) 같은 비이상적 필터를 쓴다. 날카로운 선택성은 없지만 인과적이고, 임펄스 응답이 진동 없이 줄어든다(그림 4.22). 더 높은 차수의 미분방정식에 해당하는 필터를 쓰면 인과성, 구현의 쉬움, 주파수 선택성, 시간 영역 진동 사이에서 균형을 맞출 수 있다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/42_convolution-property_fig2.svg" alt="그림" loading="lazy">

$$\omega_c = 3$$인 이상적 저역 통과 필터의 임펄스 응답은 색칠한 $$t < 0$$ 쪽에서도 출렁인다. RC 필터 $$e^{-t}u(t)$$는 $$t < 0$$에서 0이고 진동 없이 줄어든다[^s2].

**예제 4.19 ($$a = b$$)**[^9]. $$Y = \frac{1}{(a + j\omega)^2} = j\frac{d}{d\omega}\left[\frac{1}{a + j\omega}\right]$$. 주파수 미분 성질 $$tx(t) \leftrightarrow j\frac{dX}{d\omega}$$로 $$y(t) = te^{-at}u(t)$$.

**예제 4.20 sinc 입력과 이상적 저역 통과**[^10]. $$x = \frac{\sin\omega_it}{\pi t}$$, $$h = \frac{\sin\omega_ct}{\pi t}$$이면 $$X$$와 $$H$$는 각각 폭 $$\omega_i$$, $$\omega_c$$인 사각형이라 $$Y$$는 좁은 쪽 사각형($$\omega_0 = \min(\omega_i, \omega_c)$$). $$y = \frac{\sin\omega_0t}{\pi t}$$로, $$x$$와 $$h$$ 중 대역이 좁은 쪽이 출력이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 4.15의 크기·위상, 예제 4.19($$a \ne b$$, $$a = b$$)를 시간 영역 수치 컨벌루션과 비교, 부분 분수, $$te^{-at}u(t) \leftrightarrow \frac{1}{(a+j\omega)^2}$$, 예제 4.20의 sinc 컨벌루션이 좁은 쪽 sinc, 이상적 필터 $$h$$의 $$t < 0$$ 값이 0이 아님 — [42_convolution-property_verify.py](/Hongs_Blog/studies/signals-and-systems/code/42_convolution-property_verify/)</div>

</div>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3단계에서 $$\int h(t - \tau)e^{-j\omega t}dt = e^{-j\omega\tau}H(j\omega)$$인 이유는?</summary>

$$h(t - \tau)$$는 $$h$$를 $$\tau$$만큼 늦춘 신호이고, 시간 이동 성질로 그 변환은 $$e^{-j\omega\tau}H(j\omega)$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 이상적 저역 통과 필터가 비인과적인 이유를 쌍대성으로 설명하라.</summary>

주파수에서 사각형이면 시간에서는 sinc이고, sinc는 $$t < 0$$ 쪽으로도 무한히 이어진다. 임펄스를 넣기 전($$t < 0$$)부터 출력이 나오는 셈이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

시간 영역에서 어려운 연산(컨벌루션)을 주파수 영역의 쉬운 연산(곱셈)으로 옮겨 풀고, 다시 돌아온다.

</details>


## 활용

- 필터 설계와 오디오 이퀄라이저는 $$Y = HX$$의 $$H$$를 정하는 일이다.
- 큰 컨벌루션을 FFT로 빠르게 계산하는 것도 이 성질이다(이산 시간판)[^s1].
- 흔한 실수: 부분 분수에서 중근($$(a + j\omega)^2$$)을 따로 처리하지 않는 것 → [미분방정식 시스템의 주파수 응답](/Hongs_Blog/studies/signals-and-systems/lccde-frequency-response/)

## 연결

- 선수: [푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/), [푸리에 급수와 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/fourier-series-lti/) (주기 입력판)
- 필터: [주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/)
- 쌍대: [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이상적 필터는 만들기 어려울 뿐, 충분히 좋은 부품을 쓰면 실시간으로 만들 수 있다."</div>

틀렸다. 부품의 문제가 아니라 원리의 문제다. 이상적 저역 통과 필터의 임펄스 응답 $$\frac{\sin\omega_ct}{\pi t}$$는 $$t < 0$$에서도 0이 아니므로, 인과 시스템으로는 원리적으로 만들 수 없다. 확인: $$t = -0.4$$, $$\omega_c = 3$$에서 $$h \approx 0.74$$(검증 코드).

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컨벌루션 성질을 쓰고, $$H(j\omega)$$가 무엇인지 말하라.</summary>

**답:** $$h * x \leftrightarrow H(j\omega)X(j\omega)$$. $$H$$는 임펄스 응답의 푸리에 변환, 곧 주파수 응답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$h = e^{-2t}u(t)$$, $$x = e^{-3t}u(t)$$일 때 $$y(t)$$를 주파수 영역에서 구하라.</summary>

**답:** $$Y = \frac{1}{(2+j\omega)(3+j\omega)} = \frac{1}{2+j\omega} - \frac{1}{3+j\omega}$$, $$y = (e^{-2t} - e^{-3t})u(t)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 LTI 시스템을 직렬로 이을 때 순서를 바꿔도 되는 이유를 주파수 영역에서 설명하라.</summary>

**답:** 전체 주파수 응답은 $$H_1(j\omega)H_2(j\omega)$$이고, 복소수 곱셈은 교환법칙이 성립해 $$H_2H_1$$과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 예제 4.19($$a = b$$)에서 $$\frac{1}{(a+j\omega)^2} = j\frac{d}{d\omega}\frac{1}{a + j\omega}$$인 근거는?</summary>

**답:** 몫의 미분 $$\frac{d}{d\omega}\frac{1}{a + j\omega} = \frac{-j}{(a + j\omega)^2}$$에 $$j$$를 곱하면 $$\frac{-j^2}{(a+j\omega)^2} = \frac{1}{(a+j\omega)^2}$$이다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/15.Week15_CH04_3_handout.pdf, p.12 (예제 4.19)
[^2]: 같은 자료, p.4
[^3]: 같은 자료, p.1~4
[^4]: 같은 자료, p.5~6 (그림 4.19)
[^5]: 같은 자료, p.7
[^6]: 같은 자료, p.8 (예제 4.15)
[^7]: 같은 자료, p.9 (예제 4.16, 4.17)
[^8]: 같은 자료, p.10~11 (예제 4.18, 그림 4.20~4.22)
[^9]: 같은 자료, p.13
[^10]: 같은 자료, p.14 (예제 4.20)
[^s1]: 에이전트 보충. FFT 활용, 오해 항목의 수치, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 2장은 원본에 없다. [42_convolution-property_plot.py](/Hongs_Blog/studies/signals-and-systems/code/42_convolution-property_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 수치 컨벌루션과 $$(e^{-t} - e^{-2t})u(t)$$가 같음, 이상적 필터의 $$h(-0.4) \approx 0.74$$.
{% endraw %}
