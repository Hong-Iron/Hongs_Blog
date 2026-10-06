---
layout: "note"
title: "푸리에 변환과 합성곱"
display_title: "푸리에 변환과 합성곱 (Fourier Transform and Convolution)"
kind: "concept"
kind_label: "정리"
num: "31"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Fourier Transform", "푸리에 변환", "역푸리에 변환", "inverse Fourier transform", "스펙트럼", "spectrum", "합성곱", "convolution", "합성곱 정리", "convolution theorem", "변조", "modulation", "sinc 함수", "불확정성 원리", "uncertainty principle", "저역 통과 필터", "low-pass filter"]
description: "되풀이되지 않는 신호도 모든 주파수의 사인파로 나눌 수 있고, 주파수마다의 세기를 모은 것이 스펙트럼이다. 프리즘이 빛을 색깔별로 펼치는 것과 같다. 가장 큰 장점은, 두 신호를 겹쳐 미끄러뜨리며 곱해 더하는 번거로운 연산(합성곱)이 주파수 쪽에서는 그냥 곱셈이 된다는 것이다. 그…"
prev_url: "/studies/calculus/fourier-series/"
prev_title: "푸리에 급수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/fourier-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

되풀이되지 않는 신호도 모든 주파수의 사인파로 나눌 수 있고, 주파수마다의 세기를 모은 것이 스펙트럼이다. 프리즘이 빛을 색깔별로 펼치는 것과 같다. 가장 큰 장점은, 두 신호를 겹쳐 미끄러뜨리며 곱해 더하는 번거로운 연산(합성곱)이 주파수 쪽에서는 그냥 곱셈이 된다는 것이다. 그래서 필터와 흐림 효과를 "특정 주파수를 줄이는 곱셈"으로 설계한다. 대신 신호가 시간에서 짧게 몰릴수록 스펙트럼은 넓게 퍼져, 두 쪽에서 동시에 좁게 만들 수는 없다.

</div>


## 예시로 보기

높이 1, 폭 1인 상자 모양 펄스(구간 $$\vert x\vert  < \frac12$$에서 1, 밖에서 0)를 주파수로 펼치면

$$\hat f(\xi) = \frac{\sin\pi\xi}{\pi\xi}\quad(\xi = 0\text{에서는 }1)$$

인 sinc 함수가 나온다. 주파수 0(평균)에서 가장 크고, $$\xi = \frac12$$에서 $$\frac2\pi \approx 0.64$$, 정수 주파수에서 0이다. 뚝 끊기는 모서리를 만들려면 높은 주파수가 끝없이 필요해서 꼬리가 길게 이어진다.

펄스 폭을 2로 늘이면 첫 0점이 $$\xi = 1$$에서 $$\frac12$$로 당겨진다. 시간에서 넓어지면 주파수에서 좁아진다. 여기서 $$x$$는 시간(또는 위치), $$\xi$$는 1초당 진동 수이고, 아래 정의의 적분이 이 계산이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

실수 전체에서 $$\int\vert f\vert  < \infty$$($$\int$$는 넓이를 구하는 적분 기호)인 함수 $$f$$의 **푸리에 변환**은

$$\hat f(\xi) = \int_{-\infty}^{\infty}f(x)\,e^{-2\pi i x\xi}\,dx,$$

적당한 조건(예: $$f$$와 $$\hat f$$가 모두 매끄럽고 빨리 줄어듦)에서 **역변환** $$f(x) = \int_{-\infty}^{\infty}\hat f(\xi)\,e^{2\pi i x\xi}\,d\xi$$로 되돌아온다. 두 함수의 **합성곱**은

$$(f * g)(x) = \int_{-\infty}^{\infty}f(y)\,g(x - y)\,dy$$

다. 한 함수를 뒤집어 $$x$$만큼 밀면서 겹친 부분의 곱을 더한 값이다[^1].

</div>


[푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)는 주기 신호에 정수배 주파수만 썼다. 주기를 한없이 늘리면 주파수 간격이 0으로 좁아지고, 계수의 합이 [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/)이 된 것이 푸리에 변환이다. 책마다 지수를 $$-i\omega x$$로 쓰고 앞에 $$\frac{1}{2\pi}$$나 $$\frac{1}{\sqrt{2\pi}}$$를 붙이기도 한다. 결과를 옮겨 올 때는 규약부터 확인한다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">주요 성질</div>

1. **합성곱 정리:** $$\widehat{f * g} = \hat f\,\hat g$$.
2. **이동:** $$f(x - a)$$의 변환은 $$e^{-2\pi i a\xi}\hat f(\xi)$$. 크기는 그대로이고 위상만 돈다.
3. **변조:** $$f(x)\cos(2\pi\xi_0 x)$$의 변환은 $$\frac12\big(\hat f(\xi - \xi_0) + \hat f(\xi + \xi_0)\big)$$. 스펙트럼이 $$\pm\xi_0$$로 옮겨 간다.
4. **늘이기:** $$a > 0$$일 때 $$f(ax)$$의 변환은 $$\frac1a\hat f\left(\frac\xi a\right)$$.
5. **가우스 함수:** $$e^{-\pi x^2}$$의 변환은 자기 자신이다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">합성곱 정리의 증명</summary>

1. *정의 대입:* $$\widehat{f * g}(\xi) = \int\left(\int f(y)g(x - y)\,dy\right)e^{-2\pi i x\xi}\,dx$$.
2. *순서 바꾸기:* $$f, g$$가 절대적분 가능하면 [푸비니 정리](/Hongs_Blog/studies/calculus/multiple-integrals/)로 적분 순서를 바꾼다. $$\int f(y)\left(\int g(x - y)e^{-2\pi i x\xi}\,dx\right)dy$$.
3. *치환:* 안쪽에서 $$u = x - y$$로 두면 $$e^{-2\pi i x\xi} = e^{-2\pi i y\xi}e^{-2\pi i u\xi}$$라 안쪽 적분은 $$e^{-2\pi i y\xi}\hat g(\xi)$$.
4. *정리:* $$\hat g(\xi)\int f(y)e^{-2\pi i y\xi}\,dy = \hat f(\xi)\hat g(\xi)$$. ∎

핵심은 3단계다. 지수함수가 "더하기를 곱하기로" 바꾸는 성질($$e^{a + b} = e^ae^b$$) 때문에, 겹쳐 밀기가 주파수마다 따로 노는 곱셈으로 풀린다.

</details>


## 예제

**주파수 분할 다중화.** 전화 음성처럼 0~4 kHz 대역만 쓰는 신호 여러 개를 한 선로로 보낸다.

1. *변조:* 신호에 반송파 $$\cos(2\pi\cdot 100\text{ kHz}\cdot t)$$를 곱한다. 성질 3으로 스펙트럼이 100 kHz 양옆, 곧 96~104 kHz로 옮겨진다(음의 주파수 쪽 거울상은 실수 신호라 대칭으로 따라온다).
2. *다른 채널:* 둘째 신호는 110 kHz 반송파에 실어 106~114 kHz를 쓴다. 두 대역이 겹치지 않는다.
3. *받기:* 수신 쪽은 대역 통과 필터로 원하는 구간만 골라 같은 반송파를 다시 곱하고, 낮은 주파수만 남긴다.
4. *결론:* 반송파 간격이 신호 대역폭의 두 배(8 kHz)보다 좁으면 스펙트럼이 겹쳐 서로 섞인다. 이것이 [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)의 수학이다. 실제 전화망은 양쪽 대역 중 한쪽만 남겨 채널당 4 kHz를 쓴다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 상자함수의 변환과 sinc 값, 폭 2에서 첫 0점 이동, 가우스 함수의 자기 변환과 역변환, 합성곱 정리(가우스 둘, 상자 둘 → 삼각형과 sinc²), 이동·변조 성질, DFT로 본 100 kHz 변조 대역 96~104 kHz와 채널 간격, 이산 순환 합성곱 = DFT 곱, 불확정성 부등식(가우스는 등호) — [31_fourier-transform_verify.py](/Hongs_Blog/studies/calculus/code/31_fourier-transform_verify/)</div>

</div>


## 활용

- **필터.** 잡음을 줄이는 저역 통과 필터는 스펙트럼에 "낮은 주파수는 1, 높은 주파수는 0에 가까운" 함수를 곱하는 것이고, 시간 쪽에서는 그 함수의 역변환과의 합성곱이다.
- **이미지 흐림.** 가우스 흐림은 이미지와 가우스 함수의 합성곱이다. 가우스의 변환도 가우스라 높은 주파수(세밀한 무늬)가 부드럽게 줄어든다.
- **빠른 합성곱.** 길이 $$n$$ 수열의 합성곱을 직접 계산하면 $$O(n^2)$$이지만, [FFT](/Hongs_Blog/studies/linear-algebra/dft/)로 변환해 곱하고 되돌리면 $$O(n\log n)$$이다.
- **CNN.** 합성곱 신경망의 합성곱 층은 필터를 뒤집지 않고 밀며 곱해 더한다(상호상관). 이름은 합성곱이지만, 필터를 학습하므로 뒤집었는지는 결과에 영향이 없다[^2].
- **불확정성.** 신호의 퍼진 정도 $$\Delta x$$와 스펙트럼의 퍼진 정도 $$\Delta\xi$$(각각 $$\vert f\vert ^2$$, $$\vert \hat f\vert ^2$$의 표준편차) 사이에 $$\Delta x\,\Delta\xi \ge \frac{1}{4\pi}$$가 맞고, 가우스 함수에서 등호다[^1]. 짧은 펄스로 빠르게 보내려면 넓은 대역이 필요하다는 통신의 기본 제약이다.

## 연결

- 선수: [푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/), [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/), [오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)
- 이산판: [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)의 합성곱 정리
- 다른 과목에서: [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)(변조 성질), 확률과 통계의 독립 확률변수의 합(밀도의 합성곱, [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/))

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 폭 1인 상자함수의 푸리에 변환을 $$\xi = \frac12$$에서 계산하라.</summary>

**답:** $$\int_{-1/2}^{1/2}e^{-2\pi i x\xi}dx = \frac{\sin\pi\xi}{\pi\xi}$$이므로 $$\frac{\sin(\pi/2)}{\pi/2} = \frac2\pi \approx 0.637$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 합성곱이 주파수 쪽에서 곱셈이 되는 이유를 증명의 핵심 단계로 설명하라.</summary>

**답:** $$g(x - y)$$에 곱해진 $$e^{-2\pi i x\xi}$$를 $$x = y + (x - y)$$로 쪼개면 지수법칙으로 $$e^{-2\pi i y\xi}\cdot e^{-2\pi i(x - y)\xi}$$가 된다. 앞쪽은 $$f(y)$$와 묶여 $$\hat f$$가, 뒤쪽은 $$g(x - y)$$와 묶여 $$\hat g$$가 된다. 순서를 바꿀 수 있는 것은 푸비니 정리 덕분이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 0~4 kHz 음성 신호에 100 kHz 코사인 반송파를 곱하면 스펙트럼은 어디에 놓이는가? 이런 채널 여러 개를 겹치지 않게 놓으려면 반송파 간격은 최소 얼마인가?</summary>

**답:** 변조 성질로 96~104 kHz(와 음의 주파수 쪽 거울상)에 놓인다. 채널마다 8 kHz 폭을 차지하므로 반송파 간격이 8 kHz 이상이어야 한다. 딱 8 kHz면 경계에서 맞닿고, 5 kHz면 101~104 kHz가 겹친다. 실제로는 필터가 완벽하지 않아 보호 대역을 더 둔다.

</details>


[^1]: Stein, Shakarchi, *Fourier Analysis: An Introduction*, 5장 "The Fourier Transform on R"($$e^{-2\pi ix\xi}$$ 규약, 가우스 함수, 합성곱, 역변환 공식, 하이젠베르크 불확정성 원리).
[^2]: Goodfellow, Bengio, Courville, *Deep Learning*, 9.1절 "The Convolution Operation"(많은 라이브러리가 상호상관을 합성곱이라 부른다).
[^s1]: 에이전트 보충. 반송파를 곱하면 양쪽 측파대가 생기고, 한쪽 측파대만 남기는 방식(SSB)이 대역을 절반만 쓴다는 것은 변조 성질에서 바로 나온다. 연결된 컴퓨터 통신 문서의 60~64 kHz 채널(반송파 64 kHz)이 한쪽 측파대를 쓴 배치다. 대역 수치는 31_fourier-transform_verify.py에서 DFT로 확인했다.
{% endraw %}
