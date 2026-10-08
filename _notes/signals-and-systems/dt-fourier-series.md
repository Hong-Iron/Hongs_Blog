---
layout: "note"
title: "이산 시간 푸리에 급수"
display_title: "이산 시간 푸리에 급수 (Discrete-Time Fourier Series)"
kind: "concept"
kind_label: "정리"
num: "33"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Discrete-Time Fourier Series", "DTFS", "이산 푸리에 급수", "이산 시간 푸리에 계수", "Discrete-Time Fourier Coefficients", "유한 급수", "Finite Series"]
description: "주기 N인 수열도 고조파 e^{jk(2\\pi/N)n}의 합으로 나눌 수 있다. 연속 시간과 다른 점은, 이산 시간에서는 서로 다른 고조파가 딱 N개뿐이라 급수가 무한합이 아니라 N개 항의 유한합이라는 것이다. 그래서 수렴 걱정이 없고, N개의 값을 N개의 계수로 정확히 바꿨다가 정…"
prev_url: "/studies/signals-and-systems/ctfs-properties/"
prev_title: "연속 시간 푸리에 급수의 성질"
next_url: "/studies/signals-and-systems/dtfs-properties/"
next_title: "이산 시간 푸리에 급수의 성질"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/dt-fourier-series/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주기 $$N$$인 수열도 고조파 $$e^{jk(2\pi/N)n}$$의 합으로 나눌 수 있다. 연속 시간과 다른 점은, 이산 시간에서는 서로 다른 고조파가 딱 $$N$$개뿐이라 급수가 무한합이 아니라 $$N$$개 항의 유한합이라는 것이다. 그래서 수렴 걱정이 없고, $$N$$개의 값을 $$N$$개의 계수로 정확히 바꿨다가 정확히 되돌릴 수 있다. 계수도 주기 $$N$$으로 되풀이되므로, 아무 $$N$$칸 구간이나 하나만 보면 된다.

</div>


## 예시로 보기

주기 4인 수열이 한 주기에 $$x[0] = 1$$, $$x[1] = 0$$, $$x[2] = 2$$, $$x[3] = -1$$이다[^1].

이 수열을 $$x[n] = \sum_{k=0}^{3}a_ke^{jk(2\pi/4)n}$$으로 쓰고 싶다. $$e^{j(2\pi/4)} = j$$이므로 $$n = 0, 1, 2, 3$$을 넣으면 미지수 넷, 식 넷인 연립방정식이 된다.

$$\begin{aligned} a_0 + a_1 + a_2 + a_3 &= 1\\ a_0 + ja_1 - a_2 - ja_3 &= 0\\ a_0 - a_1 + a_2 - a_3 &= 2\\ a_0 - ja_1 - a_2 + ja_3 &= -1\end{aligned}$$


풀면 $$a_0 = \frac12$$, $$a_1 = -\frac{1+j}{4}$$, $$a_2 = 1$$, $$a_3 = \frac{-1+j}{4}$$이다. 연립방정식을 매번 풀지 않고 계수를 바로 구하는 공식이 분석식이다.

## 정의

주기 $$N$$($$x[n] = x[n+N]$$), 기본 주파수 $$\omega_0 = \frac{2\pi}{N}$$인 수열에서 고조파는 $$\phi_k[n] = e^{jk(2\pi/N)n}$$이다. [이산 복소 지수의 성질](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)로 $$\phi_{k+N} = \phi_k$$라서 서로 다른 것은 연속한 $$N$$개뿐이다[^2]. 합을 연속한 $$N$$개 $$k$$에 대해서만 한다는 뜻으로 $$\sum_{k = \langle N\rangle}$$이라 쓴다. $$k = 0, \dots, N-1$$이든 $$k = 3, \dots, N+2$$든 결과가 같다[^3].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">이산 시간 푸리에 급수 쌍</div>

$$x[n] = \sum_{k=\langle N\rangle}a_ke^{jk\omega_0n} = \sum_{k=\langle N\rangle}a_ke^{jk(2\pi/N)n} \qquad \text{(합성식)}$$

$$a_k = \frac1N\sum_{n=\langle N\rangle}x[n]e^{-jk\omega_0n} = \frac1N\sum_{n=\langle N\rangle}x[n]e^{-jk(2\pi/N)n} \qquad \text{(분석식)}$$

[^4]

</div>


**한 주기 합의 공식.** 계수 공식의 열쇠다[^5].

$$\sum_{n=\langle N\rangle}e^{jk(2\pi/N)n} = \begin{cases}N & k = 0, \pm N, \pm 2N, \dots\\ 0 & \text{그 밖}\end{cases}$$


$$k$$가 $$N$$의 배수면 모든 항이 $$e^{j2\pi(\text{정수})} = 1$$이라 $$N$$이다. 아니면 등비수열의 합 $$\sum_{n=0}^{N-1}a^n = \frac{1 - a^N}{1 - a}$$에서 $$a^N = e^{j2\pi k} = 1$$이라 분자가 0이다. 예: $$N = 4$$, $$k = 1$$이면 $$1 + j - 1 - j = 0$$.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">분석식 유도</summary>

1. 합성식 양변에 $$e^{-jr(2\pi/N)n}$$을 곱하고 $$N$$칸 더한다: $$\sum_nx[n]e^{-jr(2\pi/N)n} = \sum_n\sum_ka_ke^{j(k-r)(2\pi/N)n}$$
2. 유한합이라 순서를 바꿔도 된다: $$= \sum_ka_k\sum_ne^{j(k-r)(2\pi/N)n}$$
3. 한 주기 합의 공식: $$k$$와 $$r$$을 같은 범위에서 고르면 $$k = r$$일 때만 $$N$$, 나머지는 0
4. 오른쪽은 $$Na_r$$, 그래서 $$a_r = \frac1N\sum_nx[n]e^{-jr(2\pi/N)n}$$[^6]

</details>


**계수도 주기 $$N$$.** $$a_{k+N} = a_k$$다. $$e^{-j(k+N)(2\pi/N)n} = e^{-jk(2\pi/N)n}$$이기 때문이다[^7]. 연속 시간의 계수는 $$k$$마다 다르지만, 이산 시간의 계수는 막대그래프가 $$N$$칸마다 똑같이 반복된다(그림 3.13).

**수렴 문제가 없다.** 분석식은 $$N$$개의 수를 $$N$$개의 계수로 바꾸고, 합성식은 유한한 $$N$$개 항이라 그대로 되돌린다. 부분합 $$\hat x[n] = \sum_{k=-M}^{M}a_ke^{jk(2\pi/N)n}$$은 항이 $$N$$개가 되는 순간($$N$$이 홀수면 $$M = \frac{N-1}{2}$$) 원래 수열과 정확히 같다. 깁스 현상이 없다(그림 3.18)[^8]. 연속 시간 주기 신호는 한 주기에 값이 무한히 많아 무한히 많은 계수가 필요한 것과 다르다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 등비수열 합에서 분자 $$1 - a^N$$이 0인 이유는?</summary>

$$a = e^{jk(2\pi/N)}$$이므로 $$a^N = e^{jk2\pi} = 1$$이다. 분모는 $$k$$가 $$N$$의 배수가 아니면 $$a \ne 1$$이라 0이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 왜 이산 시간에서는 계수가 $$N$$개면 충분한가?</summary>

고조파가 $$N$$개만 서로 다르고($$\phi_{k+N} = \phi_k$$), 한 주기에 수열 값도 $$N$$개다. 미지수 $$N$$개, 식 $$N$$개인 연립방정식이라 정확히 풀린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

연속 시간의 직교 기저 분해와 같지만, 기저가 유한 개라 행렬 하나(DFT 행렬)의 곱으로 정확히 끝난다.

</details>


## 예제

**예제 3.10** $$x[n] = \sin\omega_0n$$[^9]

- $$\omega_0 = \frac{2\pi}{N}$$이면 오일러 관계로 $$x = \frac{1}{2j}e^{j(2\pi/N)n} - \frac{1}{2j}e^{-j(2\pi/N)n}$$. 그래서 $$a_1 = \frac{1}{2j}$$, $$a_{-1} = -\frac{1}{2j}$$, 한 주기의 나머지는 0. 주기 $$N$$으로 반복되므로 $$a_{N+1} = \frac{1}{2j}$$, $$a_{N-1} = -\frac{1}{2j}$$이다($$N = 5$$이면 그림 3.13).
- $$\omega_0 = \frac{2\pi M}{N}$$($$M$$과 $$N$$은 서로소)이면 $$a_M = \frac{1}{2j}$$, $$a_{-M} = -\frac{1}{2j}$$. $$M = 3$$, $$N = 5$$이면 $$a_{-3} = a_2$$다(그림 3.14).

**예제 3.11** $$x[n] = 1 + \sin\frac{2\pi}{N}n + 3\cos\frac{2\pi}{N}n + \cos\left(\frac{4\pi}{N}n + \frac\pi2\right)$$[^10]

- 모두 복소 지수로 풀어 같은 주파수끼리 모은다.
- $$a_0 = 1$$, $$a_1 = \frac32 - \frac12j$$, $$a_{-1} = \frac32 + \frac12j$$, $$a_2 = \frac12e^{j\pi/2} = \frac12j$$, $$a_{-2} = -\frac12j$$.
- $$\vert a_1\vert  = \frac{\sqrt{10}}{2}$$, $$\angle a_1 = -\tan^{-1}\frac13 \approx -18.43°$$. 실수 수열이라 $$a_{-k} = a_k^*$$다(그림 3.15)[^11].

**예제 3.12 이산 구형파** 한 주기에서 $$-N_1 \le n \le N_1$$이면 1[^12]

1. *합 범위:* $$a_k = \frac1N\sum_{n=-N_1}^{N_1}e^{-jk(2\pi/N)n}$$
2. *0부터 세게 바꾸기:* $$m = n + N_1$$로 두면 $$a_k = \frac1Ne^{jk(2\pi/N)N_1}\sum_{m=0}^{2N_1}e^{-jk(2\pi/N)m}$$
3. *등비수열 합:* $$= \frac1Ne^{jk(2\pi/N)N_1}\frac{1 - e^{-jk2\pi(2N_1+1)/N}}{1 - e^{-jk(2\pi/N)}}$$
4. *분자·분모에서 반각 지수를 빼내 사인으로:* $$a_k = \dfrac1N\dfrac{\sin[2\pi k(N_1 + \frac12)/N]}{\sin(\pi k/N)}$$ ($$k \ne 0, \pm N, \dots$$)
5. *$$k$$가 $$N$$의 배수:* 모든 항이 1이라 $$a_k = \frac{2N_1+1}{N}$$.

$$2N_1 + 1 = 5$$, $$N = 10$$이면 $$a_0 = \frac12$$, $$a_1 = \frac{1}{10}\cdot\frac{\sin(\pi/2)}{\sin(\pi/10)} \approx 0.3236$$, $$a_2 = 0$$, $$a_3 = \frac{1}{10}\cdot\frac{\sin(3\pi/2)}{\sin(3\pi/10)} \approx -0.1236$$, $$a_4 = 0$$이다. $$N$$을 20, 40으로 키우면 $$Na_k$$가 같은 sinc 꼴 포락선을 더 촘촘히 찍는다(그림 3.17).

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 10주차 p.19 "$$a_3 = \frac{1}{10}\cdot\frac{\sin(3\pi/2)}{\sin(3\pi/10)} = -0.11269$$" / 문제점: $$\sin(3\pi/10) \approx 0.8090$$이라 $$\frac{-1}{10 \times 0.8090} \approx -0.1236$$이다 / 수정안: $$a_3 \approx -0.1236$$ / 근거: [33_dt-fourier-series_verify.py](/Hongs_Blog/studies/signals-and-systems/code/33_dt-fourier-series_verify/)가 분석식 합으로 $$-0.12361$$을 계산

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$N = 4$$ 예의 계수와 복원, 한 주기 합 공식, $$a_{k+N} = a_k$$, 예제 3.10·3.11·3.12의 계수(5개 경우의 닫힌 꼴 포함), $$N = 9$$ 구형파의 부분합이 $$M = 4$$에서 정확히 같아짐 확인 — [33_dt-fourier-series_verify.py](/Hongs_Blog/studies/signals-and-systems/code/33_dt-fourier-series_verify/)</div>

</div>


## 활용

- 컴퓨터가 실제로 계산하는 푸리에 해석은 모두 이 유한합이다. 이산 푸리에 변환(DFT)은 계수에 $$N$$을 곱한 것과 같고, FFT로 $$O(N\log N)$$에 계산한다 → [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)[^s1]
- 흔한 실수: 연속 시간처럼 계수를 $$k = -\infty \dots \infty$$로 모두 다른 값이라 생각하는 것, 합 구간을 $$N$$개보다 많이 잡아 같은 항을 두 번 세는 것.

## 연결

- 선수: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/) (고조파가 $$N$$개뿐인 이유)
- 다음: [이산 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/dtfs-properties/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이산 구형파의 푸리에 급수도 경계에서 깁스 현상이 생긴다."</div>

틀렸다. 연속 시간 사각파의 깁스 현상을 그대로 옮겨 생각해서 그럴듯하다. 이산 시간 급수는 항이 $$N$$개뿐인 유한합이라, 항을 모두 쓰면 원래 수열과 정확히 같다. 확인: 그림 3.18에서 $$N = 9$$일 때 $$M = 4$$(항 9개)의 부분합은 원래 구형파와 똑같다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 이산 시간 푸리에 급수의 합성식과 분석식을 쓰라.</summary>

**답:** $$x[n] = \sum_{k=\langle N\rangle}a_ke^{jk(2\pi/N)n}$$, $$a_k = \frac1N\sum_{n=\langle N\rangle}x[n]e^{-jk(2\pi/N)n}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주기 2인 수열 $$x[0] = 3$$, $$x[1] = 1$$의 푸리에 계수 $$a_0$$, $$a_1$$을 구하라.</summary>

**답:** $$a_0 = \frac12(3 + 1) = 2$$, $$a_1 = \frac12(3 + 1 \cdot e^{-j\pi}) = \frac12(3 - 1) = 1$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 연속 시간 푸리에 급수와 이산 시간 푸리에 급수의 차이를 계수 개수와 수렴 관점에서 말하라.</summary>

**답:** 연속 시간은 계수가 무한히 많고(모두 다를 수 있음) 무한합이 수렴하는지(디리클레 조건, 깁스 현상)가 문제다. 이산 시간은 서로 다른 계수가 $$N$$개뿐이고(주기 $$N$$으로 반복) 유한합이라 수렴 문제가 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 분석식 유도에서 $$\sum_ka_k\sum_ne^{j(k-r)(2\pi/N)n} = Na_r$$인 근거는?</summary>

**답:** 한 주기 합의 공식. $$k - r$$이 $$N$$의 배수일 때만 안쪽 합이 $$N$$이고 그 밖은 0이다. $$k$$와 $$r$$을 같은 $$N$$칸 범위에서 고르면 그런 $$k$$는 $$k = r$$ 하나다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/10.Week10_CH03_3_handout.pdf, p.6~7
[^2]: 같은 자료, p.2
[^3]: 같은 자료, p.4
[^4]: 같은 자료, p.10~11
[^5]: 같은 자료, p.8
[^6]: 같은 자료, p.9~10
[^7]: 같은 자료, p.11, p.13
[^8]: 같은 자료, p.20~21 (그림 3.18)
[^9]: 같은 자료, p.12~14 (예제 3.10, 그림 3.13, 3.14)
[^10]: 같은 자료, p.15~16 (예제 3.11)
[^11]: 같은 자료, p.16~17 (그림 3.15)
[^12]: 같은 자료, p.18~19 (예제 3.12, 그림 3.16, 3.17)
[^s1]: 에이전트 보충. DFT·FFT 연결, 오해 항목, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
