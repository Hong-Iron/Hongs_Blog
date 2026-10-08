---
layout: "note"
title: "푸리에 급수와 LTI 시스템"
display_title: "푸리에 급수와 LTI 시스템 (Fourier Series and LTI Systems)"
kind: "concept"
kind_label: "정리"
num: "35"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Fourier Series and LTI Systems", "주파수 응답", "Frequency Response", "H(jω)", "H(e^jω)", "시스템 함수", "System Function", "출력 계수", "Output Coefficients"]
description: "주기 신호를 LTI 시스템에 넣으면, 출력도 같은 주기의 주기 신호이고 출력의 각 푸리에 계수는 입력 계수에 그 주파수의 주파수 응답 값을 곱한 것이다. 오디오 이퀄라이저가 저음은 그대로, 고음은 절반으로 줄이는 것과 같다. 그래서 출력을 구할 때 컨벌루션 적분 대신 \"주파수마다 …"
prev_url: "/studies/signals-and-systems/dtfs-properties/"
prev_title: "이산 시간 푸리에 급수의 성질"
next_url: "/studies/signals-and-systems/frequency-filters/"
next_title: "주파수 형성 필터와 주파수 선택 필터"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/fourier-series-lti/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주기 신호를 LTI 시스템에 넣으면, 출력도 같은 주기의 주기 신호이고 출력의 각 푸리에 계수는 입력 계수에 그 주파수의 주파수 응답 값을 곱한 것이다. 오디오 이퀄라이저가 저음은 그대로, 고음은 절반으로 줄이는 것과 같다. 그래서 출력을 구할 때 컨벌루션 적분 대신 "주파수마다 곱하기"만 하면 된다. 단, 시스템이 LTI여야 하고 주파수 응답을 정의하는 적분(합)이 수렴해야 한다.

</div>


## 예시로 보기

예제 3.2의 주기 신호 $$x(t) = 1 + \frac12\cos2\pi t + \cos4\pi t + \frac23\cos6\pi t$$를 임펄스 응답이 $$h(t) = e^{-t}u(t)$$인 시스템에 넣는다(예제 3.16)[^1].

1. *주파수 응답:* $$H(j\omega) = \int_0^\infty e^{-\tau}e^{-j\omega\tau}d\tau = \dfrac{1}{1 + j\omega}$$.
2. *주파수마다 곱하기:* 기본 주파수가 $$2\pi$$이므로 $$b_k = a_kH(jk2\pi)$$.
   - $$b_0 = 1 \cdot H(0) = 1$$
   - $$b_{\pm1} = \frac14\cdot\frac{1}{1 \pm j2\pi}$$, $$b_{\pm2} = \frac12\cdot\frac{1}{1 \pm j4\pi}$$, $$b_{\pm3} = \frac13\cdot\frac{1}{1 \pm j6\pi}$$
3. *출력:* $$y(t) = \sum_{k=-3}^{3}b_ke^{jk2\pi t}$$.

직류 성분은 그대로 통과하고, 주파수가 높을수록 $$\vert H\vert $$가 작아져 크게 줄어든다.

## 정의

[고유함수 성질](/Hongs_Blog/studies/signals-and-systems/lti-eigenfunction/)에서 $$s$$를 순허수 $$j\omega$$(크기가 변하지 않는 진동)로 두면 주파수 응답이 나온다[^2].

| | 연속 시간 | 이산 시간 |
|---|---|---|
| 주파수 응답 | $$H(j\omega) = \int_{-\infty}^{\infty}h(t)e^{-j\omega t}dt$$ | $$H(e^{j\omega}) = \sum_{n=-\infty}^{\infty}h[n]e^{-j\omega n}$$ |
| 입력 | $$x(t) = \sum_ka_ke^{jk\omega_0t}$$ | $$x[n] = \sum_{k=\langle N\rangle}a_ke^{jk(2\pi/N)n}$$ |
| 출력 | $$y(t) = \sum_ka_kH(jk\omega_0)e^{jk\omega_0t}$$ | $$y[n] = \sum_{k=\langle N\rangle}a_kH(e^{j2\pi k/N})e^{jk(2\pi/N)n}$$ |
| 출력 계수 | $$b_k = a_kH(jk\omega_0)$$ | $$b_k = a_kH(e^{j2\pi k/N})$$ |

[^3][^4]

이산 시간 주파수 응답은 $$\vert z\vert  = 1$$인 $$z = e^{j\omega}$$에서 시스템 함수 $$H(z)$$를 읽은 것이고, $$\omega$$에 대해 주기 $$2\pi$$다[^3].

**실수 출력의 정리.** $$x$$와 $$h$$가 실수면 $$y$$도 실수라 $$b_{-k} = b_k^*$$다. 그래서[^5]

$$y(t) = b_0 + \sum_{k=1}^{\infty}\left[b_ke^{jk\omega_0t} + b_k^*e^{-jk\omega_0t}\right] = b_0 + 2\sum_{k=1}^{\infty}\mathrm{Re}\{b_ke^{jk\omega_0t}\}$$


$$b_k = D_ke^{j\theta_k}$$로 쓰면 각 항은 $$2D_k\cos(k\omega_0t + \theta_k)$$, 곧 크기 $$2D_k$$, 위상 $$\theta_k$$인 코사인이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 출력 계수가 $$a_kH(jk\omega_0)$$인 이유를 두 성질로 설명하라.</summary>

고유함수 성질: $$e^{jk\omega_0t}$$ 하나는 시스템을 지나 $$H(jk\omega_0)e^{jk\omega_0t}$$가 된다. 선형성: 입력이 이것들의 가중합이므로 출력도 같은 가중치 $$a_k$$를 곱한 합이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 출력이 입력과 같은 주기인 이유는?</summary>

출력도 $$e^{jk\omega_0t}$$들만의 합이고, 이 고조파들은 모두 주기 $$T = \frac{2\pi}{\omega_0}$$로 되풀이된다. LTI 시스템은 새 주파수를 만들지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

입력을 주파수 성분으로 나누고, 시스템은 성분마다 크기와 위상만 바꾸는 "주파수별 볼륨·지연 조절기"로 본다.

</details>


## 예제

**예제 3.16의 $$b_1$$을 극형식과 직교 형식으로**[^6]

- $$\vert b_1\vert  = D_1 = \frac14\cdot\frac{1}{\vert 1 + j2\pi\vert } = \dfrac{1}{4\sqrt{1 + 4\pi^2}}$$, $$\angle b_1 = \theta_1 = -\tan^{-1}(2\pi)$$.
- 분모를 실수로 만들기: $$b_1 = \frac14\cdot\frac{1 - j2\pi}{1 + 4\pi^2}$$, 실수부 $$E_1 = \dfrac{1}{4(1 + 4\pi^2)}$$, 허수부 $$F_1 = -\dfrac{\pi}{2(1 + 4\pi^2)}$$.

**예제 3.17 이산 시간**[^7]. $$h[n] = \alpha^nu[n]$$ ($$-1 < \alpha < 1$$), $$x[n] = \cos\frac{2\pi n}{N}$$

1. *입력 나누기:* $$x[n] = \frac12e^{j(2\pi/N)n} + \frac12e^{-j(2\pi/N)n}$$.
2. *주파수 응답:* $$H(e^{j\omega}) = \sum_{n=0}^{\infty}(\alpha e^{-j\omega})^n = \dfrac{1}{1 - \alpha e^{-j\omega}}$$ ($$\vert \alpha\vert  < 1$$이라 등비급수가 수렴).
3. *출력:* $$y[n] = \frac12H(e^{j2\pi/N})e^{j(2\pi/N)n} + \frac12H(e^{-j2\pi/N})e^{-j(2\pi/N)n}$$.
4. *정리:* $$\frac{1}{1 - \alpha e^{-j2\pi/N}} = re^{j\theta}$$이면 $$y[n] = r\cos\left(\frac{2\pi}{N}n + \theta\right)$$.
5. *$$N = 4$$:* $$e^{-j\pi/2} = -j$$이라 $$\frac{1}{1 + \alpha j} = \frac{1}{\sqrt{1+\alpha^2}}e^{-j\tan^{-1}\alpha}$$. 그래서 $$y[n] = \dfrac{1}{\sqrt{1+\alpha^2}}\cos\left(\dfrac{\pi n}{2} - \tan^{-1}\alpha\right)$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 3.16의 출력 계수로 만든 $$y(t)$$를 $$h = e^{-t}u(t)$$와의 수치 컨벌루션과 비교해 $$10^{-4}$$ 이내로 일치, $$D_1$$·$$\theta_1$$·$$E_1$$·$$F_1$$ 확인, 예제 3.17을 $$\alpha = 0.5, -0.3, 0.9$$와 $$N = 4, 7$$에서 직접 컨벌루션 합과 비교 — [35_fourier-series-lti_verify.py](/Hongs_Blog/studies/signals-and-systems/code/35_fourier-series-lti_verify/)</div>

</div>


## 활용

- 필터 설계는 "어떤 $$H(j\omega)$$를 원하는가"에서 시작한다 → [주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/)
- 회로 해석에서 교류 입력의 정상 상태 출력은 $$\vert H(j\omega)\vert $$배, $$\angle H(j\omega)$$만큼 밀린 같은 주파수 정현파다. 페이저 해석이 이것이다[^s1].
- 흔한 실수: $$H(j\omega)$$에 $$\omega$$ 대신 $$k$$를 넣는 것. 넣어야 하는 값은 실제 각주파수 $$k\omega_0$$다(예제 3.16에서 $$H(j2\pi k)$$).

## 연결

- 선수: [LTI 시스템의 고유함수](/Hongs_Blog/studies/signals-and-systems/lti-eigenfunction/), [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/)
- 다음: [주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"LTI 시스템을 지나면 입력에 없던 주파수 성분이 새로 생길 수 있다."</div>

틀렸다. 소리가 왜곡되면 새 음이 들리는 경험 때문에 그럴듯하다. 하지만 그런 왜곡은 비선형 시스템(포화된 앰프)에서 생긴다. LTI 시스템은 각 성분에 $$H$$를 곱할 뿐이라, 입력에서 $$a_k = 0$$이면 출력도 $$b_k = 0$$이다. 확인: 예제 3.16에서 입력에 없는 $$k = 4$$ 성분은 출력에도 없다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주기 신호를 연속 시간 LTI 시스템에 넣었을 때 출력 계수 $$b_k$$의 식은?</summary>

**답:** $$b_k = a_kH(jk\omega_0)$$, $$H(j\omega) = \int h(t)e^{-j\omega t}dt$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$H(j\omega) = \frac{1}{1 + j\omega}$$인 시스템에 $$x(t) = 2 + \cos t$$를 넣으면 출력은?</summary>

**답:** 직류: $$2H(0) = 2$$. $$\cos t$$: $$\vert H(j1)\vert  = \frac{1}{\sqrt2}$$, $$\angle H(j1) = -\frac\pi4$$. $$y(t) = 2 + \frac{1}{\sqrt2}\cos(t - \frac\pi4)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제 3.17에서 $$H(e^{j\omega})$$의 등비급수가 수렴하는 조건과, 그 조건이 시스템의 어떤 성질과 같은가?</summary>

**답:** $$\vert \alpha e^{-j\omega}\vert  = \vert \alpha\vert  < 1$$. 이것은 $$\sum\vert h[n]\vert  = \sum\vert \alpha\vert ^n < \infty$$, 곧 시스템이 안정할 조건과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$b_k = D_ke^{j\theta_k}$$일 때 $$b_ke^{jk\omega_0t} + b_{-k}e^{-jk\omega_0t}$$를 코사인 하나로 쓰라 (출력이 실수).</summary>

**답:** $$b_{-k} = b_k^*$$이므로 $$2\mathrm{Re}\{D_ke^{j(k\omega_0t + \theta_k)}\} = 2D_k\cos(k\omega_0t + \theta_k)$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/10.Week10_CH03_3_handout.pdf, p.34 (예제 3.16)
[^2]: 같은 자료, p.32~33
[^3]: 같은 자료, p.33
[^4]: 같은 자료, p.36
[^5]: 같은 자료, p.35
[^6]: 같은 자료, p.35~36
[^7]: 같은 자료, p.37~38 (예제 3.17)
[^s1]: 에이전트 보충. 페이저 해석 연결, 오해 항목, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
