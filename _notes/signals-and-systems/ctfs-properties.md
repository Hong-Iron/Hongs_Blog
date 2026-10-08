---
layout: "note"
title: "연속 시간 푸리에 급수의 성질"
display_title: "연속 시간 푸리에 급수의 성질 (Properties of Continuous-Time Fourier Series)"
kind: "concept"
kind_label: "정리"
num: "32"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Properties of Continuous-Time Fourier Series", "푸리에 급수의 성질", "시간 이동 성질", "Time Shifting Property", "시간 반전 성질", "시간 척도 성질", "곱셈 성질", "Multiplication Property", "주기 컨벌루션", "Periodic Convolution", "미분 성질", "Differentiation Property", "켤레 대칭", "Conjugate Symmetry", "파스발 관계", "Parseval's Relation"]
description: "신호를 옮기거나, 뒤집거나, 미분하거나, 곱하면 푸리에 계수가 정해진 규칙대로 바뀐다. 이 규칙표(표 3.1)를 알면 매번 적분하지 않고 이미 아는 신호의 계수에서 새 신호의 계수를 얻는다. 예를 들어 신호를 늦추면 계수의 크기는 그대로이고 위상만 돈다. 미분하면 높은 고조파일수록…"
prev_url: "/studies/signals-and-systems/fourier-series-convergence/"
prev_title: "푸리에 급수의 수렴"
next_url: "/studies/signals-and-systems/dt-fourier-series/"
next_title: "이산 시간 푸리에 급수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/ctfs-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신호를 옮기거나, 뒤집거나, 미분하거나, 곱하면 푸리에 계수가 정해진 규칙대로 바뀐다. 이 규칙표(표 3.1)를 알면 매번 적분하지 않고 이미 아는 신호의 계수에서 새 신호의 계수를 얻는다. 예를 들어 신호를 늦추면 계수의 크기는 그대로이고 위상만 돈다. 미분하면 높은 고조파일수록 크게 커진다. 다만 모든 성질은 같은 주기 $$T$$의 신호끼리 쓸 때 맞다.

</div>


## 예시로 보기

예제 3.6의 $$g(t)$$를 직접 적분하지 않고 구해 보자[^1]. $$g$$는 주기 4인 대칭 사각파 $$x(t)$$($$\vert t\vert  < 1$$에서 1)를 1만큼 늦추고 0.5를 뺀 것이다: $$g(t) = x(t-1) - 0.5$$.

1. $$x$$의 계수는 이미 안다(예제 3.5): $$a_k = \frac{\sin(\pi k/2)}{k\pi}$$ ($$k \ne 0$$), $$a_0 = \frac12$$.
2. 1만큼 늦추면 계수에 $$e^{-jk\omega_0 \cdot 1} = e^{-jk\pi/2}$$가 곱해진다(시간 이동).
3. 상수 $$-0.5$$는 $$k = 0$$ 계수만 $$-0.5$$ 바꾼다(선형성).
4. 결과: $$d_k = \frac{\sin(\pi k/2)}{k\pi}e^{-jk\pi/2}$$ ($$k \ne 0$$), $$d_0 = \frac12 - \frac12 = 0$$.

적분 한 번 없이 표의 규칙 두 개로 끝났다.

## 정의

주기 $$T$$, 기본 주파수 $$\omega_0 = \frac{2\pi}{T}$$인 신호의 계수를 $$x(t) \overset{FS}{\longleftrightarrow} a_k$$, $$y(t) \overset{FS}{\longleftrightarrow} b_k$$로 쓴다[^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">표 3.1 (주요 성질)</div>

| 성질 | 신호 | 계수 |
|---|---|---|
| 선형성 | $$Ax(t) + By(t)$$ | $$Aa_k + Bb_k$$ |
| 시간 이동 | $$x(t - t_0)$$ | $$a_ke^{-jk\omega_0t_0}$$ |
| 주파수 이동 | $$e^{jM\omega_0t}x(t)$$ | $$a_{k-M}$$ |
| 켤레 | $$x^*(t)$$ | $$a_{-k}^*$$ |
| 시간 반전 | $$x(-t)$$ | $$a_{-k}$$ |
| 시간 척도 | $$x(\alpha t)$$, $$\alpha > 0$$ (주기 $$T/\alpha$$) | $$a_k$$ (기본 주파수는 $$\alpha\omega_0$$) |
| 주기 컨벌루션 | $$\int_Tx(\tau)y(t-\tau)d\tau$$ | $$Ta_kb_k$$ |
| 곱셈 | $$x(t)y(t)$$ | $$\sum_{l=-\infty}^{\infty}a_lb_{k-l}$$ |
| 미분 | $$\frac{dx}{dt}$$ | $$jk\omega_0a_k$$ |
| 적분 | $$\int_{-\infty}^{t}x(\tau)d\tau$$ ($$a_0 = 0$$일 때만 유한·주기적) | $$\frac{1}{jk\omega_0}a_k$$ |
| 실수 신호 | $$x$$ 실수 | $$a_k = a_{-k}^*$$, $$\lvert a_k\rvert = \lvert a_{-k}\rvert$$, $$\angle a_k = -\angle a_{-k}$$ |
| 실수·짝 | $$x$$ 실수이고 짝 | $$a_k$$ 실수이고 짝 |
| 실수·홀 | $$x$$ 실수이고 홀 | $$a_k$$ 순허수이고 홀 |
| 파스발 관계 | $$\frac1T\int_T\lvert x(t)\rvert^2dt$$ | $$\sum_k\lvert a_k\rvert^2$$ |

</div>


[^3]

규칙마다 뜻을 말로 풀면 다음과 같다.

- **시간 이동:** 신호를 늦춰도 각 고조파의 크기 $$\vert a_k\vert $$는 그대로다. 위상만 $$k\omega_0t_0$$씩 늦는다. 높은 고조파일수록 같은 시간 지연이 더 큰 위상이 된다[^4].
- **시간 반전:** 뒤집으면 $$k$$와 $$-k$$가 자리를 바꾼다. 그래서 짝 신호는 $$a_{-k} = a_k$$, 홀 신호는 $$a_{-k} = -a_k$$다[^5].
- **시간 척도:** 빨리 감으면 주기가 $$\frac T\alpha$$로 줄고 기본 주파수가 $$\alpha\omega_0$$로 커질 뿐, 계수 자체는 같다[^6].
- **곱셈:** 시간에서 곱하면 계수끼리는 이산 컨벌루션이 된다. 반대로 시간에서 (주기) 컨벌루션하면 계수끼리 곱해진다[^7].
- **미분·적분:** 미분하면 $$k$$번째 계수의 크기가 $$k\omega_0$$배, 위상은 $$+90°$$ 돈다. 적분하면 크기가 $$\frac{1}{k\omega_0}$$배, 위상은 $$-90°$$다[^8].
- **파스발 관계:** 한 주기의 평균 전력은 모든 고조파 성분의 평균 전력 $$\vert a_k\vert ^2$$을 더한 것과 같다. $$a_ke^{jk\omega_0t}$$ 하나의 평균 전력이 $$\frac1T\int_T\vert a_k\vert ^2dt = \vert a_k\vert ^2$$이기 때문이다[^9].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">시간 이동과 곱셈, 파스발의 증명</summary>

**시간 이동.** $$b_k = \frac1T\int_Tx(t - t_0)e^{-jk\omega_0t}dt$$에서 $$\tau = t - t_0$$로 바꾸면 $$\tau$$도 길이 $$T$$인 구간을 돌므로 $$= e^{-jk\omega_0t_0}\frac1T\int_Tx(\tau)e^{-jk\omega_0\tau}d\tau = e^{-jk\omega_0t_0}a_k$$[^4].

**곱셈.** $$c_k = \frac1T\int_T\left(\sum_ma_me^{jm\omega_0t}\right)\left(\sum_lb_le^{jl\omega_0t}\right)e^{-jk\omega_0t}dt = \sum_ma_m\sum_lb_l\frac1T\int_Te^{j(m+l-k)\omega_0t}dt$$. 직교성으로 $$l = k - m$$일 때만 1이고 나머지는 0이라 $$c_k = \sum_ma_mb_{k-m}$$[^7].

**미분.** 부분적분 $$c_k = \frac1T[e^{-jk\omega_0t}x(t)]_0^T + jk\omega_0\frac1T\int_Tx(t)e^{-jk\omega_0t}dt$$. 첫 항은 $$x(T) = x(0)$$(주기 신호)이고 $$e^{-jk2\pi} = 1$$이라 0이다. 그래서 $$c_k = jk\omega_0a_k$$[^8].

**파스발.** $$\frac1T\int_T\vert x\vert ^2dt = \frac1T\int_Tx\,x^*dt = \frac1T\int_Tx\sum_ka_k^*e^{-jk\omega_0t}dt = \sum_ka_k^*\left(\frac1T\int_Txe^{-jk\omega_0t}dt\right) = \sum_ka_k^*a_k = \sum\vert a_k\vert ^2$$[^9].

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 미분 증명에서 경계항 $$\frac1T[e^{-jk\omega_0t}x(t)]_0^T$$가 0인 이유는?</summary>

$$x$$가 주기 $$T$$라 $$x(T) = x(0)$$이고, $$e^{-jk\omega_0T} = e^{-jk2\pi} = 1 = e^0$$이다. 그래서 두 끝값이 같아 빼면 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 실수이고 짝인 신호의 계수가 실수인 이유를 두 성질로 보이라.</summary>

실수라서 $$a_{-k} = a_k^*$$(켤레 대칭), 짝이라서 $$a_{-k} = a_k$$(시간 반전). 둘을 합치면 $$a_k = a_k^*$$, 곧 $$a_k$$는 실수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

시간 영역의 조작 하나하나가 고조파 하나하나에 무엇을 하는지(위상을 돌리나, 크기를 바꾸나, 번호를 옮기나)로 번역한다.

</details>


## 예제

**예제 3.7 삼각파**[^10]. 주기 4, $$\omega_0 = \frac\pi2$$, $$x(0) = 0$$, $$x(\pm2) = 1$$인 삼각파의 도함수가 예제 3.6의 $$g(t)$$다.

- *미분 성질:* $$d_k = jk\frac\pi2e_k$$이므로 $$e_k = \frac{2d_k}{jk\pi} = \frac{2\sin(\pi k/2)}{j(k\pi)^2}e^{-jk\pi/2}$$ ($$k \ne 0$$).
- *$$k = 0$$은 따로:* 미분 성질로는 $$e_0$$를 알 수 없다(0을 곱했기 때문). 한 주기의 평균을 직접 구한다: $$e_0 = \frac14\left[\int_0^2\frac t2dt + \int_2^4\left(2 - \frac t2\right)dt\right] = \frac14(1 + 1) = \frac12$$.

**예제 3.8 임펄스 열**[^11]. $$x(t) = \sum_k\delta(t - kT)$$. 적분 경계에 임펄스가 걸리지 않게 $$-\frac T2 \sim \frac T2$$에서 적분하면 $$a_k = \frac1T\int\delta(t)e^{-jk\omega_0t}dt = \frac1T$$. 모든 계수가 같다. 그래서 임펄스는 모든 주파수를 똑같은 크기로 담고 있고, 시스템에 임펄스를 넣어 보면 모든 주파수의 반응을 한꺼번에 본다.

사각파의 도함수는 임펄스 열 두 개의 차 $$q(t) = \delta(t + T_1) - \delta(t - T_1)$$(주기적)이다. 시간 이동으로 $$b_k = \frac1T(e^{jk\omega_0T_1} - e^{-jk\omega_0T_1}) = \frac{2j\sin(k\omega_0T_1)}{T}$$이고, 미분 성질 $$b_k = jk\omega_0c_k$$로 사각파 계수 $$c_k = \frac{\sin(k\omega_0T_1)}{k\pi}$$가 다시 나온다[^12].

**예제 3.9 조건으로 신호 찾기**[^13]. 실수, 주기 4, $$\vert k\vert  > 1$$이면 $$a_k = 0$$, $$b_k = e^{-j\pi k/2}a_{-k}$$인 신호가 홀함수, $$\frac14\int_4\vert x\vert ^2dt = \frac12$$.

1. *남은 계수:* $$a_0, a_1, a_{-1}$$만 있고 실수라 $$a_{-1} = a_1^*$$. $$x = a_0 + 2\mathrm{Re}\{a_1e^{j\pi t/2}\}$$.
2. *$$b_k$$의 신호:* 반전($$a_{-k}$$)과 1만큼 늦춤($$e^{-jk\omega_0}$$)이므로 $$x(-(t-1)) = x(-t+1)$$. 실수이고 홀이라 $$b_k$$는 순허수이고 홀: $$b_0 = 0$$, $$b_{-1} = -b_1$$.
3. *파스발:* 반전·이동은 평균 전력을 바꾸지 않으므로 $$\vert b_1\vert ^2 + \vert b_{-1}\vert ^2 = \frac12$$, $$\vert b_1\vert  = \frac12$$. 순허수라 $$b_1 = \pm\frac j2$$.
4. *되돌리기:* $$a_0 = b_0 = 0$$, $$a_1 = e^{-j\pi/2}b_{-1} = -jb_{-1} = jb_1$$. $$b_1 = \frac j2$$이면 $$a_1 = -\frac12$$, $$x = -\cos\frac{\pi t}{2}$$. $$b_1 = -\frac j2$$이면 $$a_1 = \frac12$$, $$x = \cos\frac{\pi t}{2}$$.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 9주차 p.28~30 사실 4 "$$b_k = e^{j\pi k/2}a_{-k}$$", p.30 "$$b_1 = \frac12$$로 하면 $$a_1 = -\frac12$$" / 문제점: ① 사실 4의 지수 부호가 같은 쪽의 풀이($$x(-(t-1))$$, $$e^{-jk\omega_0}$$)와 오른쪽 상자의 유도($$b_{-k} = e^{j\pi k/2}a_k$$)와 반대다. ② 바로 앞에서 $$b_1$$은 순허수라 $$\pm\frac j2$$라고 했으므로 "$$b_1 = \frac12$$"는 "$$b_1 = \frac j2$$"여야 $$a_1 = jb_1 = -\frac12$$가 나온다 / 수정안: $$b_k = e^{-j\pi k/2}a_{-k}$$, $$b_1 = \pm\frac j2$$ / 근거: Oppenheim·Willsky 2판 예제 3.9의 원래 조건, [32_ctfs-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/32_ctfs-properties_verify/)가 $$x(-t+1)$$의 계수와 $$e^{-j\pi k/2}a_{-k}$$가 같음을 계산 (최종 답 $$\pm\cos\frac{\pi t}{2}$$는 맞다)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표 3.1의 선형성·시간 이동·반전·척도·곱셈·미분·켤레 대칭·주기 컨벌루션·파스발을 분석식 수치 적분으로 확인, 예제 3.6·3.7·3.8과 사각파 도함수의 계수, 예제 3.9의 답 확인 — [32_ctfs-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/32_ctfs-properties_verify/)</div>

</div>


## 활용

- 계산 시간을 아낀다: 사각파, 삼각파, 임펄스 열 몇 개의 계수만 외워 두면 이동·미분·적분으로 많은 신호의 계수를 얻는다.
- 미분 성질은 "미분하면 고주파가 커진다"는 뜻이다. 12주차의 영상 경계 검출(미분 필터)이 잡음에 약한 이유다 → [영상의 경계 검출과 평활화](/Hongs_Blog/studies/signals-and-systems/edge-detection-smoothing/)
- 파스발 관계로 신호 전력이 어느 주파수에 몰려 있는지(전력 스펙트럼)를 본다.

## 연결

- 선수: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [짝 신호와 홀 신호](/Hongs_Blog/studies/signals-and-systems/even-odd-signals/)
- 이산 시간 버전: [이산 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/dtfs-properties/)
- 전력: [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"신호를 늦추면 푸리에 계수의 크기가 바뀐다."</div>

틀렸다. 그림이 옆으로 움직이니 무언가 달라질 것 같아 그럴듯하다. 실제로는 각 고조파가 똑같은 시간만큼 늦을 뿐이라 크기 $$\vert a_k\vert $$는 그대로이고 위상만 $$-k\omega_0t_0$$ 바뀐다. 확인: 예제 3.6에서 $$\vert d_k\vert  = \vert a_k\vert $$ ($$k \ne 0$$)[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 시간 이동, 시간 반전, 미분, 파스발 관계를 계수 쪽 식으로 쓰라.</summary>

**답:** $$x(t - t_0) \to a_ke^{-jk\omega_0t_0}$$, $$x(-t) \to a_{-k}$$, $$\frac{dx}{dt} \to jk\omega_0a_k$$, $$\frac1T\int_T\vert x\vert ^2dt = \sum\vert a_k\vert ^2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t)$$의 계수가 $$a_k$$이다. $$y(t) = 3x(t + 2) + x(-t)$$의 계수는?</summary>

**답:** $$3a_ke^{jk\omega_0 \cdot 2} + a_{-k}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제 3.7에서 미분 성질로 $$e_0$$를 구할 수 없는 이유와, 대신 어떻게 구하는가?</summary>

**답:** $$d_0 = j \cdot 0 \cdot \omega_0e_0 = 0$$이라 $$e_0$$에 대한 정보가 사라진다(상수는 미분하면 0). 대신 한 주기 평균 $$e_0 = \frac1T\int_Tx\,dt = \frac12$$를 직접 계산한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 실수 신호의 계수가 ① 모두 실수 ② 모두 순허수 ③ 일반 복소수일 때, 신호는 각각 짝·홀·둘 다 아님 중 무엇인가?</summary>

**답:** ① 짝 ② 홀 ③ 둘 다 아님(짝 부분과 홀 부분이 모두 있다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 파스발 증명의 "$$\frac1T\int_Tx(t)e^{-jk\omega_0t}dt = a_k$$"는 어디서 나오는가?</summary>

**답:** 푸리에 급수의 분석식 그 자체다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/09.Week09_CH03_2_handout.pdf, p.21~22 (예제 3.6, 그림 3.10)
[^2]: 같은 자료, p.10~11
[^3]: 같은 자료, p.10 (표 3.1)
[^4]: 같은 자료, p.12
[^5]: 같은 자료, p.13~14
[^6]: 같은 자료, p.15, p.16
[^7]: 같은 자료, p.15, p.18
[^8]: 같은 자료, p.19, p.21
[^9]: 같은 자료, p.20
[^10]: 같은 자료, p.22 (예제 3.7, 그림 3.11)
[^11]: 같은 자료, p.23 (예제 3.8, 그림 3.12)
[^12]: 같은 자료, p.23~24
[^13]: 같은 자료, p.24~26 (예제 3.9)
[^s1]: 에이전트 보충. 오해 항목과 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
