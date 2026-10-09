---
layout: "note"
title: "연속 시간 푸리에 급수"
display_title: "연속 시간 푸리에 급수 (Continuous-Time Fourier Series)"
kind: "concept"
kind_label: "정리"
num: "30"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Continuous-Time Fourier Series", "CTFS", "푸리에 급수", "Fourier Series", "푸리에 계수", "Fourier Coefficients", "스펙트럼 계수", "Spectral Coefficients", "합성식", "Synthesis Equation", "분석식", "Analysis Equation", "직류 성분", "DC Component", "기본파", "Fundamental", "포락선", "Envelope", "sinc 함수"]
description: "주기 신호는 \"기본 진동과 그 2배, 3배, … 빠른 진동들\"을 알맞은 비율로 섞어 만들 수 있다. 화음이 기본음과 배음으로 이루어진 것과 같다. 섞는 비율(푸리에 계수)은 신호에 각 진동을 곱해 한 주기 동안 평균 내면 구해진다. 이 진동들은 서로 겹치지 않아서(직교), 하나의 …"
prev_url: "/studies/signals-and-systems/eigenfunction-eigenvector-bridge/"
prev_title: "LTI 고유함수 ↔ 행렬 고유벡터"
next_url: "/studies/signals-and-systems/fourier-series-convergence/"
next_title: "푸리에 급수의 수렴"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/ct-fourier-series/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주기 신호는 "기본 진동과 그 2배, 3배, … 빠른 진동들"을 알맞은 비율로 섞어 만들 수 있다. 화음이 기본음과 배음으로 이루어진 것과 같다. 섞는 비율(푸리에 계수)은 신호에 각 진동을 곱해 한 주기 동안 평균 내면 구해진다. 이 진동들은 서로 겹치지 않아서(직교), 하나의 비율을 구할 때 다른 것이 끼어들지 않기 때문이다. 다만 계수는 보통 복소수라 크기와 위상을 함께 봐야 하고, 끊긴 신호는 끝없이 많은 진동이 필요하다.

</div>


## 예시로 보기

기본 주파수가 $$2\pi$$인 신호를 네 조각으로 만든다(예제 3.2)[^1].

$$x(t) = \sum_{k=-3}^{3}a_ke^{jk2\pi t}, \quad a_0 = 1,\ a_{\pm1} = \tfrac14,\ a_{\pm2} = \tfrac12,\ a_{\pm3} = \tfrac13$$


짝이 되는 두 항을 오일러 관계로 묶으면 $$\frac14(e^{j2\pi t} + e^{-j2\pi t}) = \frac12\cos2\pi t$$처럼 코사인이 된다.

$$x(t) = 1 + \tfrac12\cos2\pi t + \cos4\pi t + \tfrac23\cos6\pi t$$


그림 3.4는 상수 1에 $$\frac12\cos2\pi t$$, $$\cos4\pi t$$, $$\frac23\cos6\pi t$$를 차례로 더해 가며 모양이 쌓이는 것을 보여 준다. 반대로 이 모양만 받았을 때 1, $$\frac14$$, $$\frac12$$, $$\frac13$$을 되찾는 방법이 분석식이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/30_ct-fourier-series_fig1.svg" alt="그림" loading="lazy">

칸마다 점선이 앞 칸까지의 합, 색 선이 한 항을 더 더한 합이다. 항을 더할수록 $$t = 0, \pm1$$에 뾰족한 봉우리가 생긴다[^s2].

## 정의

주기 $$T$$인 신호 $$x(t)$$의 기본 주파수는 $$\omega_0 = \frac{2\pi}{T}$$이다. 같은 주기 $$T$$를 공유하는 고조파 $$\phi_k(t) = e^{jk\omega_0 t}$$ ($$k = 0, \pm1, \pm2, \dots$$)로 신호를 나타낸다[^2].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">푸리에 급수</div>

$$x(t) = \sum_{k=-\infty}^{\infty}a_ke^{jk\omega_0t} = \sum_{k=-\infty}^{\infty}a_ke^{jk(2\pi/T)t} \qquad \text{(합성식)}$$

$$a_k = \frac1T\int_T x(t)e^{-jk\omega_0t}dt = \frac1T\int_T x(t)e^{-jk(2\pi/T)t}dt \qquad \text{(분석식)}$$

$$\int_T$$는 길이 $$T$$인 아무 구간에서의 적분이다[^3].

</div>


기호 읽기[^3][^2]

- $$a_k$$: 푸리에 계수(스펙트럼 계수). $$k$$번째 고조파가 신호에 얼마나, 어떤 위상으로 들어 있는가.
- $$a_0 = \frac1T\int_T x(t)dt$$: 한 주기의 평균값, 곧 직류(dc) 성분.
- $$k = \pm1$$: 기본파(제1고조파). $$k = \pm2$$: 주파수가 2배인 제2고조파. $$k = \pm N$$: 제$$N$$고조파.

**계수 공식이 나오는 이유: 직교성.** 서로 다른 고조파를 곱해 한 주기 적분하면 0이다[^4].

$$\int_T e^{j(k-n)\omega_0t}dt = \begin{cases}T & k = n\\ 0 & k \ne n\end{cases}$$


$$k \ne n$$이면 $$\cos(k-n)\omega_0t$$와 $$\sin(k-n)\omega_0t$$는 주기가 $$\frac{T}{\vert k-n\vert }$$인 정현파라, 길이 $$T$$에 정확히 $$\vert k-n\vert $$바퀴가 들어가고 넓이가 0이 된다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">분석식 유도</summary>

1. 합성식 양변에 $$e^{-jn\omega_0t}$$를 곱한다: $$x(t)e^{-jn\omega_0t} = \sum_ka_ke^{j(k-n)\omega_0t}$$
2. 양변을 한 주기 적분하고, 적분과 합의 순서를 바꾼다(수렴한다고 가정): $$\int_Tx(t)e^{-jn\omega_0t}dt = \sum_ka_k\int_Te^{j(k-n)\omega_0t}dt$$
3. 직교성으로 $$k = n$$인 항만 $$T$$가 남고 나머지는 0: 오른쪽 $$= Ta_n$$
4. 그래서 $$a_n = \frac1T\int_Tx(t)e^{-jn\omega_0t}dt$$[^4]

벡터로 보면 $$\phi_k$$가 직교 기저이고, $$a_k$$는 $$x$$와 $$\phi_k$$의 내적을 $$\phi_k$$의 길이 제곱 $$T$$로 나눈 것이다. 복소 벡터의 내적은 한쪽에 켤레를 씌워 $$\sum u_n^*v_n$$으로 정의한다. 그래야 자기 자신과의 내적이 늘 0 이상의 실수(길이의 제곱)가 된다[^5].

</details>


**실수 신호의 성질과 삼각함수 꼴.** $$x(t)$$가 실수면 $$x^* = x$$에서 $$a_{-k} = a_k^*$$이다[^6]. 그래서 짝 항을 묶으면

$$x(t) = a_0 + 2\sum_{k=1}^{\infty}\mathrm{Re}\{a_ke^{jk\omega_0t}\} = a_0 + 2\sum_{k=1}^{\infty}A_k\cos(k\omega_0t + \theta_k) = a_0 + 2\sum_{k=1}^{\infty}\left[B_k\cos k\omega_0t - C_k\sin k\omega_0t\right]$$


여기서 $$a_k = A_ke^{j\theta_k} = B_k + jC_k$$이다[^7]. 세 꼴은 같은 신호이고, 계산이 편한 복소수 꼴을 주로 쓴다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 유도 3단계에서 합 전체가 $$Ta_n$$ 하나로 줄어드는 이유는?</summary>

직교성 때문에 $$\int_Te^{j(k-n)\omega_0t}dt$$는 $$k = n$$일 때만 $$T$$이고 나머지는 모두 0이다. 그래서 무한히 많은 항 중 $$a_n \cdot T$$만 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 실수 신호에서 $$a_{-k} = a_k^*$$인 이유는?</summary>

합성식의 켤레를 취하면 $$x^* = \sum a_k^*e^{-jk\omega_0t}$$이고, $$k$$를 $$-k$$로 바꾸면 $$\sum a_{-k}^*e^{jk\omega_0t}$$다. $$x$$가 실수라 $$x = x^*$$이므로 두 급수의 계수를 비교하면 $$a_k = a_{-k}^*$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

서로 직교하는 진동들을 기준 자로 삼아, 신호를 각 자에 대어(내적) 그 성분만 읽어 낸다.

</details>


## 예제

**예제 3.3** $$x(t) = \sin\omega_0t$$[^8]

- 오일러 관계로 바로 쓴다: $$\sin\omega_0t = \frac{1}{2j}e^{j\omega_0t} - \frac{1}{2j}e^{-j\omega_0t}$$.
- 합성식과 비교: $$a_1 = \frac{1}{2j}$$, $$a_{-1} = -\frac{1}{2j}$$, 나머지 $$a_k = 0$$. 분석식으로 적분해도 같다.

**예제 3.4** $$x(t) = 1 + \sin\omega_0t + 2\cos\omega_0t + \cos(2\omega_0t + \frac\pi4)$$[^9]

- 모두 복소 지수로 풀고 같은 주파수끼리 모은다.
- $$a_0 = 1$$, $$a_1 = 1 + \frac{1}{2j} = 1 - \frac12j$$, $$a_{-1} = 1 + \frac12j$$, $$a_2 = \frac12e^{j\pi/4} = \frac{\sqrt2}{4}(1 + j)$$, $$a_{-2} = \frac{\sqrt2}{4}(1 - j)$$, $$\vert k\vert  > 2$$이면 0.
- 크기와 위상(그림 3.5): $$\vert a_0\vert  = 1$$, $$\vert a_{\pm1}\vert  = \sqrt{1 + 0.25} \approx 1.118$$, $$\vert a_{\pm2}\vert  = 0.5$$. 위상 $$\angle a_1 \approx -26.57°$$, $$\angle a_2 = 45°$$.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 7주차 p.41 그림 3.5 크기 그래프의 표시 "$$\vert a_k\vert $$ 1.25" / 문제점: $$a_1 = 1 - \frac12j$$의 크기는 $$\sqrt{1^2 + 0.5^2} = \sqrt{1.25} \approx 1.118$$이다. 1.25는 크기의 제곱이다 / 수정안: $$\vert a_{\pm1}\vert  \approx 1.118$$ / 근거: [30_ct-fourier-series_verify.py](/Hongs_Blog/studies/signals-and-systems/code/30_ct-fourier-series_verify/)가 분석식 적분으로 $$\vert a_1\vert  = 1.118$$을 계산

</div>


**예제 3.5 주기 사각파** 한 주기에서 $$\vert t\vert  < T_1$$이면 1, $$T_1 < \vert t\vert  < \frac T2$$이면 0[^10]

- *대칭 구간 선택:* $$t = 0$$에 대칭이므로 $$-\frac T2 \sim \frac T2$$에서 적분한다.
- *$$k = 0$$:* $$a_0 = \frac1T\int_{-T_1}^{T_1}dt = \frac{2T_1}{T}$$. 한 주기 중 1인 부분의 비율이다.
- *$$k \ne 0$$:* $$a_k = \frac1T\int_{-T_1}^{T_1}e^{-jk\omega_0t}dt = \frac{2\sin(k\omega_0T_1)}{k\omega_0T} = \frac{\sin(k\omega_0T_1)}{k\pi}$$ (마지막 등호는 $$\omega_0T = 2\pi$$).
- *$$T = 4T_1$$일 때:* $$\omega_0T_1 = \frac\pi2$$이므로 $$a_k = \frac{\sin(k\pi/2)}{k\pi}$$. $$a_0 = \frac12$$, $$a_{\pm1} = \frac1\pi$$, $$a_{\pm3} = -\frac{1}{3\pi}$$, $$a_{\pm5} = \frac{1}{5\pi}$$, 짝수 $$k$$(0 제외)는 0.
- *$$T = 8T_1$$일 때:* $$a_0 = \frac14$$, $$a_1 = \frac{\sqrt2}{2\pi}$$, $$a_2 = \frac{1}{2\pi}$$, $$a_3 = \frac{\sqrt2}{6\pi}$$.

**포락선.** $$Ta_k = \frac{2\sin(\omega T_1)}{\omega}\Big\vert _{\omega = k\omega_0}$$이다. 즉 $$Ta_k$$는 매끄러운 곡선 $$\frac{2\sin\omega T_1}{\omega}$$(포락선)을 $$\omega_0$$ 간격으로 찍은 값이다. $$T$$를 키우면($$4T_1 \to 8T_1 \to 16T_1$$) 같은 곡선을 더 촘촘히 찍는다(그림 3.7)[^11]. 이 곡선은 정규화된 sinc 함수 $$\mathrm{sinc}\,x = \frac{\sin\pi x}{\pi x}$$ 꼴이다. 4장의 푸리에 변환이 이 "촘촘해지는 극한"에서 나온다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/30_ct-fourier-series_fig2.svg" alt="그림" loading="lazy">

$$T_1 = 1$$일 때다. 세 줄의 막대는 모두 같은 점선 곡선 위에 있고, $$T$$가 두 배가 될 때마다 막대 간격 $$\omega_0$$가 절반으로 좁아진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 직교성, 예제 3.2·3.3·3.4·3.5의 계수를 분석식 수치 적분으로 재계산해 일치, $$a_{-k} = a_k^*$$ 확인 — [30_ct-fourier-series_verify.py](/Hongs_Blog/studies/signals-and-systems/code/30_ct-fourier-series_verify/)</div>

</div>


단계별 연습: [푸리에 계수 계산 예제 사다리](/Hongs_Blog/studies/signals-and-systems/fourier-coefficient-ladder/)

## 활용

- 음악의 음색은 배음 계수 $$\vert a_k\vert $$의 비율로 정해진다. 같은 음높이(기본 주파수)라도 피아노와 바이올린 소리가 다른 이유다[^s1].
- 전력 공학의 고조파 분석, 오디오 이퀄라이저, JPEG·MP3의 압축(코사인 성분 중 작은 것을 버림)이 이 생각을 쓴다[^s1].
- 흔한 실수: 계수를 실수로만 생각해 위상을 빼먹는 것, $$\omega_0T = 2\pi$$를 써서 정리하지 않아 식이 길어지는 것, $$a_0$$를 $$k \ne 0$$ 공식에 넣어 0으로 나누는 것.

## 연결

- 선수: [LTI 시스템의 고유함수](/Hongs_Blog/studies/signals-and-systems/lti-eigenfunction/) (왜 복소 지수로 나누는가)
- 수학 쪽: [푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/) (삼각급수 꼴과 파스발 항등식)
- 같은 구조: [LTI 고유함수 ↔ 행렬 고유벡터](/Hongs_Blog/studies/signals-and-systems/eigenfunction-eigenvector-bridge/)
- 다음: [푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$a_k$$는 $$k$$번째 코사인의 진폭이다."</div>

틀렸다. 실수 삼각함수 꼴에 익숙해서 그럴듯하다. 복소수 꼴에서는 $$a_k$$와 $$a_{-k}$$ 두 개가 합쳐져 코사인 하나를 만들고, 그 진폭은 $$2\vert a_k\vert $$다. 확인: 예제 3.2에서 $$a_1 = \frac14$$이지만 코사인 진폭은 $$\frac12$$다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 푸리에 급수의 합성식과 분석식을 쓰라.</summary>

**답:** $$x(t) = \sum_k a_ke^{jk\omega_0t}$$, $$a_k = \frac1T\int_Tx(t)e^{-jk\omega_0t}dt$$ ($$\omega_0 = 2\pi/T$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t) = 3\cos(2t) + \sin(4t)$$의 0이 아닌 푸리에 계수를 모두 구하라. ($$\omega_0 = 2$$)</summary>

**답:** $$a_{\pm1} = \frac32$$, $$a_2 = \frac{1}{2j} = -\frac j2$$, $$a_{-2} = \frac j2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 분석식 유도에서 "$$\sum_k a_k\int_Te^{j(k-n)\omega_0t}dt = Ta_n$$"인 근거는?</summary>

**답:** 고조파의 직교성. $$k \ne n$$이면 $$e^{j(k-n)\omega_0t}$$는 한 주기에 정수 바퀴 돌아 적분이 0이고, $$k = n$$이면 피적분 함수가 1이라 $$T$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 예제 3.5에서 $$T = 4T_1$$일 때 $$a_k$$를 $$k = -3 \dots 3$$으로 막대그래프로 그린다면 높이는? 그래프가 어떤 곡선을 따라가는가?</summary>

**답:** $$a_0 = 0.5$$, $$a_{\pm1} = \frac1\pi \approx 0.318$$, $$a_{\pm2} = 0$$, $$a_{\pm3} = -\frac{1}{3\pi} \approx -0.106$$. 막대 끝이 sinc 모양 포락선 $$\frac{\sin(\omega T_1)}{\omega T/2}$$를 따라간다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/07.Week07_CH03_1_handout.pdf, p.28~29 (예제 3.2, 그림 3.4)
[^2]: 같은 자료, p.26, p.28
[^3]: 같은 자료, p.36
[^4]: 같은 자료, p.35~36
[^5]: 같은 자료, p.37~38
[^6]: 같은 자료, p.30
[^7]: 같은 자료, p.31~32
[^8]: 같은 자료, p.39 (예제 3.3)
[^9]: 같은 자료, p.40~41 (예제 3.4, 그림 3.5)
[^10]: 같은 자료, p.42~44 (예제 3.5, 그림 3.6)
[^11]: 같은 자료, p.45 (그림 3.7)
[^s1]: 에이전트 보충. 음색, 고조파 분석, JPEG·MP3 예, 오해 항목, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 2장은 원본에 없다. [30_ct-fourier-series_plot.py](/Hongs_Blog/studies/signals-and-systems/code/30_ct-fourier-series_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 예제 3.2의 $$x(0) = 1 + \frac12 + 1 + \frac23$$, 예제 3.5($$T = 4T_1$$)의 $$a_0 = \frac12$$, $$a_1 = \frac1\pi$$, $$a_3 = -\frac{1}{3\pi}$$를 분석식 수치 적분과 비교, $$T = 8T_1$$의 $$a_1 = \frac{\sqrt2}{2\pi}$$.
{% endraw %}
