---
layout: "note"
title: "이산 시간 푸리에 급수의 성질"
display_title: "이산 시간 푸리에 급수의 성질 (Properties of Discrete-Time Fourier Series)"
kind: "concept"
kind_label: "정리"
num: "34"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Properties of Discrete-Time Fourier Series", "표 3.2", "첫 번째 차 성질", "First Difference Property", "누적 합 성질", "Running Sum Property", "이산 주기 컨벌루션", "Discrete Periodic Convolution", "이산 파스발 관계"]
description: "이산 시간 푸리에 급수의 성질은 연속 시간 표 3.1과 거의 같다. 옮기면 위상이 돌고, 뒤집으면 k와 -k가 바뀌고, 곱하면 계수끼리 컨벌루션하고, 주기 컨벌루션하면 계수끼리 곱한다. 다른 점은 이산 시간에 맞게 바뀐 몇 가지다. 미분 대신 첫 번째 차(x[n] - x[n-1])…"
prev_url: "/studies/signals-and-systems/dt-fourier-series/"
prev_title: "이산 시간 푸리에 급수"
next_url: "/studies/signals-and-systems/fourier-series-lti/"
next_title: "푸리에 급수와 LTI 시스템"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/dtfs-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이산 시간 푸리에 급수의 성질은 연속 시간 표 3.1과 거의 같다. 옮기면 위상이 돌고, 뒤집으면 $$k$$와 $$-k$$가 바뀌고, 곱하면 계수끼리 컨벌루션하고, 주기 컨벌루션하면 계수끼리 곱한다. 다른 점은 이산 시간에 맞게 바뀐 몇 가지다. 미분 대신 첫 번째 차($$x[n] - x[n-1]$$), 적분 대신 누적 합을 쓰고, 계수의 컨벌루션은 $$N$$칸 범위에서만 한다. 시간 척도는 칸 사이에 0을 끼워 넣는 꼴로 바뀐다.

</div>


## 예시로 보기

예제 3.13의 수열(주기 5)은 한 주기가 $$\dots, 1, 2, 2, 2, 1, \dots$$처럼 생겼다[^1]. 직접 적분(합)하지 않고 두 조각으로 나눈다.

- $$x_1[n]$$: $$\vert n\vert  \le 1$$에서 1인 구형파($$N_1 = 1$$, $$N = 5$$). 예제 3.12에서 $$b_k = \frac15\frac{\sin(3\pi k/5)}{\sin(\pi k/5)}$$, $$b_0 = \frac35$$.
- $$x_2[n] = 1$$: 직류뿐이라 $$c_0 = 1$$, 나머지 $$c_k = 0$$.
- 선형성으로 $$a_k = b_k + c_k$$: $$a_k = \frac15\frac{\sin(3\pi k/5)}{\sin(\pi k/5)}$$ ($$k \ne 0, \pm5, \dots$$), $$a_0 = \frac35 + 1 = \frac85$$.

## 정의

주기 $$N$$, $$\omega_0 = \frac{2\pi}{N}$$, $$x[n] \leftrightarrow a_k$$, $$y[n] \leftrightarrow b_k$$ (둘 다 주기 $$N$$)[^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">표 3.2 (주요 성질)</div>

| 성질 | 수열 | 계수 |
|---|---|---|
| 선형성 | $$Ax[n] + By[n]$$ | $$Aa_k + Bb_k$$ |
| 시간 이동 | $$x[n - n_0]$$ | $$a_ke^{-jk(2\pi/N)n_0}$$ |
| 주파수 이동 | $$e^{jM(2\pi/N)n}x[n]$$ | $$a_{k-M}$$ |
| 켤레 | $$x^*[n]$$ | $$a_{-k}^*$$ |
| 시간 반전 | $$x[-n]$$ | $$a_{-k}$$ |
| 시간 척도 | $$x_{(m)}[n] = x[n/m]$$ ($$n$$이 $$m$$의 배수), 0 (그 밖), 주기 $$mN$$ | $$\frac1ma_k$$ (주기 $$mN$$으로 봄) |
| 주기 컨벌루션 | $$\sum_{r=\langle N\rangle}x[r]y[n-r]$$ | $$Na_kb_k$$ |
| 곱셈 | $$x[n]y[n]$$ | $$\sum_{l=\langle N\rangle}a_lb_{k-l}$$ |
| 첫 번째 차 | $$x[n] - x[n-1]$$ | $$(1 - e^{-jk(2\pi/N)})a_k$$ |
| 누적 합 | $$\sum_{k=-\infty}^{n}x[k]$$ ($$a_0 = 0$$일 때만 유한·주기적) | $$\dfrac{1}{1 - e^{-jk(2\pi/N)}}a_k$$ |
| 실수 수열 | $$x$$ 실수 | $$a_k = a_{-k}^*$$ ($$\mathrm{Re}$$ 짝, $$\mathrm{Im}$$ 홀, $$\lvert a_k\rvert$$ 짝, $$\angle a_k$$ 홀) |
| 실수·짝 / 실수·홀 | | $$a_k$$ 실수·짝 / 순허수·홀 |
| 파스발 관계 | $$\frac1N\sum_{n=\langle N\rangle}\lvert x[n]\rvert^2$$ | $$\sum_{k=\langle N\rangle}\lvert a_k\rvert^2$$ |

</div>


[^2]

**첫 번째 차.** 수열이 바로 앞 칸과 얼마나 다른지를 나타낸다. 시간 이동($$x[n-1] \to e^{-jk\omega_0}a_k$$)과 선형성만 쓰면 바로 나온다. 원래 수열보다 첫 번째 차의 계수가 구하기 쉬울 때 쓴다[^3].

**곱셈과 주기 컨벌루션.** 곱셈 증명에서 $$m = k + l$$로 바꾼 뒤, $$b_{m-k}$$와 $$e^{j\omega_0mn}$$이 모두 주기 $$N$$이라 합 범위를 $$0 \dots N-1$$로 되돌릴 수 있다. 그래서 계수의 컨벌루션도 $$N$$칸 범위에서만 한다[^4].

**파스발 관계.** 한 주기의 평균 전력 = 모든 고조파 성분의 평균 전력 $$\vert a_k\vert ^2$$의 합. 합도 $$N$$개뿐이다[^3].

## 예제

**예제 3.14 조건으로 수열 찾기**[^5]. 주기 6, $$\sum_{n=0}^{5}x[n] = 2$$, $$\sum_{n=2}^{7}(-1)^nx[n] = 1$$, 이 조건을 만족하는 수열 중 한 주기 평균 전력이 가장 작은 것.

1. *조건 2:* $$a_0 = \frac16\sum x[n] = \frac13$$.
2. *조건 3:* $$(-1)^n = e^{-j\pi n} = e^{-j(2\pi/6)3n}$$이므로 $$\frac16\sum(-1)^nx[n] = a_3 = \frac16$$.
3. *파스발:* 평균 전력은 $$\sum_{k=0}^{5}\vert a_k\vert ^2$$. 0이 아닌 계수가 있으면 늘어나므로 정해지지 않은 $$a_1, a_2, a_4, a_5$$를 0으로 둔다.
4. *답:* $$x[n] = \frac13 + \frac16(-1)^n$$. $$x[0] = \frac12$$, $$x[1] = \frac16$$, $$x[2] = \frac12$$, … (그림 3.20)

**예제 3.15 주기 컨벌루션**[^6]. $$x[n]$$은 $$N_1 = 1$$, $$N = 7$$인 구형파, $$w[n] = \sum_{r=\langle 7\rangle}x[r]x[n-r]$$.

- *계수:* 주기 컨벌루션 성질로 $$c_k = 7d_k^2$$, $$d_k$$는 구형파의 계수 $$\frac17\frac{\sin(3\pi k/7)}{\sin(\pi k/7)}$$. 그래서 $$c_k = \dfrac{\sin^2(3\pi k/7)}{7\sin^2(\pi k/7)}$$.
- *수열 자체:* 한 주기만 남긴 $$\hat x[r]$$($$-1 \le r \le 1$$에서 1)과 $$x$$의 보통 컨벌루션과 같다. $$w[0] = 3$$, $$w[\pm1] = 2$$, $$w[\pm2] = 1$$, $$w[\pm3] = 0$$인 삼각형이 7마다 반복된다(그림 3.21). 사각형끼리 컨벌루션하면 삼각형이 되는 연속 시간 결과와 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표 3.2의 시간 이동·반전·곱셈·주기 컨벌루션·첫 번째 차·켤레 대칭·주파수 이동·시간 척도·파스발을 주기 6 수열로 확인, 예제 3.13·3.14·3.15의 값 확인 — [34_dtfs-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/34_dtfs-properties_verify/)</div>

</div>


## 활용

- 예제 3.14처럼 "몇 가지 조건만 알 때 가장 에너지가 적은 신호"를 찾는 문제는 파스발 관계로 푼다. 신호 복원, 압축에서 쓰는 생각이다[^s1].
- 디지털 신호 처리의 원형 컨벌루션(circular convolution)이 주기 컨벌루션이다. FFT로 컨벌루션을 빨리 계산할 때 이 성질을 쓴다[^s1].

## 연결

- 선수: [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/), [연속 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/ctfs-properties/) (같은 표의 연속 시간판)
- 다음: [푸리에 급수와 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/fourier-series-lti/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 연속 시간 표 3.1과 이산 시간 표 3.2에서 ① 미분 ② 적분 ③ 계수 컨벌루션의 합 범위는 각각 무엇으로 바뀌는가?</summary>

**답:** ① 첫 번째 차 $$x[n] - x[n-1] \to (1 - e^{-jk\omega_0})a_k$$ ② 누적 합 $$\to \frac{1}{1 - e^{-jk\omega_0}}a_k$$ ③ 무한합이 $$N$$칸 합 $$\sum_{l=\langle N\rangle}$$으로.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주기 $$N$$ 수열의 계수가 $$a_k$$이다. $$y[n] = x[n] - x[n-2]$$의 계수는?</summary>

**답:** $$(1 - e^{-jk(2\pi/N)2})a_k = (1 - e^{-j4\pi k/N})a_k$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제 3.14에서 $$a_1, a_2, a_4, a_5$$를 0으로 두는 이유는?</summary>

**답:** 파스발 관계로 평균 전력은 $$\sum\vert a_k\vert ^2$$이고, 조건은 $$a_0$$과 $$a_3$$만 정한다. 나머지 계수가 0이 아니면 $$\vert a_k\vert ^2 > 0$$만큼 전력이 늘어나므로, 전력이 가장 작으려면 0이어야 한다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/10.Week10_CH03_3_handout.pdf, p.25~26 (예제 3.13, 그림 3.19)
[^2]: 같은 자료, p.22 (표 3.2)
[^3]: 같은 자료, p.24
[^4]: 같은 자료, p.23~24
[^5]: 같은 자료, p.27~28 (예제 3.14, 그림 3.20)
[^6]: 같은 자료, p.29~31 (예제 3.15, 그림 3.21)
[^s1]: 에이전트 보충. 신호 복원·원형 컨벌루션 활용과 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
