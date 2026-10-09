---
layout: "note"
title: "주기 신호의 푸리에 변환"
display_title: "주기 신호의 푸리에 변환 (Fourier Transform for Periodic Signals)"
kind: "concept"
kind_label: "정리"
num: "39"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Fourier Transform for Periodic Signals", "주기 신호의 스펙트럼", "임펄스 열", "Impulse Train", "선 스펙트럼", "Line Spectrum"]
description: "주기 신호는 에너지가 무한대라 보통의 적분으로는 변환이 나오지 않는다. 대신 임펄스를 쓰면 된다. 주기 신호는 고조파 주파수에만 성분이 있으므로, 그 변환은 고조파 자리에 세운 임펄스들의 줄이다. k번째 임펄스의 넓이는 푸리에 급수 계수의 2\\pi배다. 그래서 주기 신호와 비주기 …"
prev_url: "/studies/signals-and-systems/ct-fourier-transform/"
prev_title: "연속 시간 푸리에 변환"
next_url: "/studies/signals-and-systems/fourier-transform-properties/"
next_title: "푸리에 변환의 성질"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/periodic-fourier-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주기 신호는 에너지가 무한대라 보통의 적분으로는 변환이 나오지 않는다. 대신 임펄스를 쓰면 된다. 주기 신호는 고조파 주파수에만 성분이 있으므로, 그 변환은 고조파 자리에 세운 임펄스들의 줄이다. $$k$$번째 임펄스의 넓이는 푸리에 급수 계수의 $$2\pi$$배다. 그래서 주기 신호와 비주기 신호를 하나의 푸리에 변환 틀로 함께 다룰 수 있다.

</div>


## 예시로 보기

$$x(t) = 1$$(모든 시간에 1)을 그대로 변환하면 $$\omega = 0$$에서 $$\int1\,dt = \infty$$다[^1]. 이 신호는 주파수 0 성분만 있다. 그래서 $$\omega = 0$$에 넓이 $$2\pi$$인 임펄스를 세운 $$X(j\omega) = 2\pi\delta(\omega)$$로 쓴다. 역변환해 보면 $$\frac{1}{2\pi}\int2\pi\delta(\omega)e^{j\omega t}d\omega = e^{j0t} = 1$$로 맞다.

## 정의

같은 방법으로 $$X(j\omega) = 2\pi\delta(\omega - \omega_0)$$를 역변환하면 $$e^{j\omega_0t}$$다. 선형성으로 묶으면[^1]

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

푸리에 급수 계수가 $$\{a_k\}$$인 주기 신호 $$x(t) = \sum_ka_ke^{jk\omega_0t}$$의 푸리에 변환은

$$X(j\omega) = \sum_{k=-\infty}^{\infty}2\pi a_k\,\delta(\omega - k\omega_0)$$

이다. $$k$$번째 고조파 주파수 $$k\omega_0$$에 넓이 $$2\pi a_k$$인 임펄스가 선다.

</div>


## 예제

**예제 4.6 주기 사각파**[^2]. 계수 $$a_k = \frac{2\sin(k\omega_0T_1)}{k\omega_0T}$$(예제 3.5)이므로 $$X(j\omega) = \sum_k\frac{2\sin(k\omega_0T_1)}{k}\delta(\omega - k\omega_0)$$. $$T = 4T_1$$이면 $$k\omega_0T_1 = \frac{k\pi}{2}$$라 넓이는 $$\pi\,\mathrm{sinc}(\frac k2)$$: $$k = 0$$에서 $$\pi$$, $$k = \pm1$$에서 2, $$k = \pm2$$에서 0, $$k = \pm3$$에서 $$-\frac23$$(그림 4.12). 계수 막대그래프를 $$2\pi$$배 한 모양이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/39_periodic-fourier-transform_fig1.svg" alt="그림" loading="lazy">

화살표 길이가 임펄스의 넓이 $$\pi, 2, 0, -\frac23, \dots$$이다. 화살표 끝은 모두 펄스 하나의 변환 $$\frac{2\sin\omega T_1}{\omega}$$에 $$\omega_0$$를 곱한 점선 위에 있다[^s2].

**예제 4.7 정현파**[^3]

- $$\sin\omega_0t = \frac{1}{2j}(e^{j\omega_0t} - e^{-j\omega_0t})$$이므로 $$X(j\omega) = \frac\pi j\delta(\omega - \omega_0) - \frac\pi j\delta(\omega + \omega_0) = -j\pi\delta(\omega - \omega_0) + j\pi\delta(\omega + \omega_0)$$. 계수 $$a_{\pm1} = \pm\frac{1}{2j}$$에 $$2\pi$$를 곱한 것과 같다.
- $$\cos\omega_0t$$는 $$a_{\pm1} = \frac12$$이므로 $$X(j\omega) = \pi\delta(\omega - \omega_0) + \pi\delta(\omega + \omega_0)$$(그림 4.13).

**예제 4.8 임펄스 열** $$x(t) = \sum_k\delta(t - kT)$$[^4]. 예제 3.8에서 $$a_k = \frac1T$$이므로

$$X(j\omega) = \frac{2\pi}{T}\sum_{k=-\infty}^{\infty}\delta\left(\omega - \frac{2\pi k}{T}\right)$$


시간의 임펄스 열은 주파수에서도 임펄스 열이다. 시간 간격 $$T$$가 길어지면 주파수 간격 $$\frac{2\pi}{T}$$는 좁아진다(그림 4.14). 4장 뒤의 표본화가 이 성질 위에 서 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 4.6의 넓이($$\pi$$, 2, 0, $$-\frac23$$)와 합성식으로 사각파 복원, 예제 4.7의 $$\sin$$·$$\cos$$ 복원, $$1 \leftrightarrow 2\pi\delta$$, 예제 4.8의 간격 — [39_periodic-fourier-transform_verify.py](/Hongs_Blog/studies/signals-and-systems/code/39_periodic-fourier-transform_verify/)</div>

</div>


## 활용

- 스펙트럼 분석기에서 주기 신호는 선이 띄엄띄엄 선 선 스펙트럼으로 보인다. 각 선의 높이가 고조파 성분이다[^s1].
- 진폭 변조에서 반송파 $$\cos\omega_0t$$의 변환이 두 임펄스라서, 곱하면 스펙트럼이 $$\pm\omega_0$$로 옮겨진다 → [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)

## 연결

- 선수: [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/), [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$x(t) = 3 + 2\cos 5t$$의 푸리에 변환을 쓰라.</summary>

**답:** $$6\pi\delta(\omega) + 2\pi\delta(\omega - 5) + 2\pi\delta(\omega + 5)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주기 신호의 푸리에 변환에 임펄스가 필요한 이유는?</summary>

**답:** 주기 신호는 에너지가 무한대이고 고조파 주파수에만 성분이 몰려 있다. 그 몇 개 주파수에 유한한 크기($$a_k$$)가 있으려면 넓이가 유한한 임펄스로 나타내야 한다. 보통 함수로는 한 점의 넓이가 0이기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주기 $$T = 1$$인 임펄스 열의 스펙트럼에서 임펄스 간격과 넓이는?</summary>

**답:** 간격 $$2\pi$$, 넓이 $$2\pi$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/14.Week14_CH04_2_handout.pdf, p.1~2
[^2]: 같은 자료, p.3 (예제 4.6, 그림 4.12)
[^3]: 같은 자료, p.4 (예제 4.7, 그림 4.13)
[^4]: 같은 자료, p.5 (예제 4.8, 그림 4.14)
[^s1]: 에이전트 보충. 스펙트럼 분석기 활용과 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [39_periodic-fourier-transform_plot.py](/Hongs_Blog/studies/signals-and-systems/code/39_periodic-fourier-transform_plot/)로 그렸고, 같은 코드로 다음을 확인했다: $$T_1 = 1$$, $$T = 4$$에서 넓이 $$\pi, 2, 0, -\frac23$$이 $$2\pi a_k$$와 같고, 합성식으로 사각파 값 1과 0이 되돌아옴.
{% endraw %}
