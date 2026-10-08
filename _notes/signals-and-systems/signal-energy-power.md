---
layout: "note"
title: "신호의 에너지와 전력"
display_title: "신호의 에너지와 전력 (Signal Energy and Power)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Signal Energy", "Signal Power", "에너지 신호", "Energy Signal", "전력 신호", "Power Signal", "평균 전력", "Average Power", "순시 전력", "Instantaneous Power", "실효값", "RMS", "Root Mean Square"]
description: "신호가 얼마나 \"센지\"를 하나의 숫자로 재는 방법이다. 저항에 걸린 전압이 쓰는 에너지를 본떠, 신호 크기의 제곱을 시간에 걸쳐 모두 더한 것을 에너지, 그것을 시간으로 나눈 평균을 전력이라 한다. 잠깐 나타났다 사라지는 신호는 에너지가 유한하고(에너지 신호), 영원히 계속되는 주…"
prev_url: "/studies/signals-and-systems/ct-dt-signals/"
prev_title: "연속 시간 신호와 이산 시간 신호"
next_url: "/studies/signals-and-systems/independent-variable-transform/"
next_title: "독립 변수의 변환"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/signal-energy-power/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신호가 얼마나 "센지"를 하나의 숫자로 재는 방법이다. 저항에 걸린 전압이 쓰는 에너지를 본떠, 신호 크기의 제곱을 시간에 걸쳐 모두 더한 것을 에너지, 그것을 시간으로 나눈 평균을 전력이라 한다. 잠깐 나타났다 사라지는 신호는 에너지가 유한하고(에너지 신호), 영원히 계속되는 주기 신호는 에너지가 무한대라 대신 평균 전력으로 잰다(전력 신호). 어느 쪽에도 들지 않는 신호도 있다.

</div>


## 예시로 보기

저항 $$R$$에 전압 $$v(t)$$가 걸리면 매 순간 쓰는 전력은 $$p(t) = v(t)i(t) = \dfrac{1}{R}v^2(t)$$다[^1]. $$t_1$$부터 $$t_2$$까지 쓴 에너지는 이 전력을 그 시간 동안 모두 더한(적분한) 값이다.

$$\int_{t_1}^{t_2} p(t)\,dt = \int_{t_1}^{t_2}\frac1R v^2(t)\,dt$$


신호 이론은 저항값을 1로 두고, 전압이든 전류든 그냥 $$x(t)$$로 부른다. 그러면 순간 전력은 $$x^2(t)$$다[^2]. 신호의 값이 복소수일 수도 있어서 $$x^2$$ 대신 크기의 제곱 $$\vert x(t)\vert ^2$$를 쓴다.

이제 세 신호를 비교해 보자.

| 신호 | 에너지 $$E_\infty$$ | 평균 전력 $$P_\infty$$ | 종류 |
|---|---|---|---|
| $$0 \le t \le 1$$에서만 1인 펄스 | 1 | 0 | 에너지 신호 |
| 상수 $$x(t) = 4$$ | $$\infty$$ | 16 | 전력 신호 |
| $$x(t) = t$$ | $$\infty$$ | $$\infty$$ | 둘 다 아님 |

펄스는 1초 동안만 크기 1이니 에너지가 $$1^2 \times 1 = 1$$이다. 상수 4는 매초 16씩 영원히 쌓여 에너지는 끝이 없지만, 1초당 평균은 늘 16이다[^3].

## 정의

**유한 구간.** 연속 시간 신호 $$x(t)$$가 $$t_1 \le t \le t_2$$에서 가진 에너지와, 이산 시간 신호 $$x[n]$$이 $$n_1 \le n \le n_2$$에서 가진 에너지는 다음과 같다[^4]. 평균 전력은 에너지를 구간 길이 $$t_2 - t_1$$, 또는 점의 개수 $$n_2 - n_1 + 1$$로 나눈 것이다.

$$\int_{t_1}^{t_2}\vert x(t)\vert ^2\,dt, \qquad \sum_{n = n_1}^{n_2}\vert x[n]\vert ^2$$


**무한 구간.** 구간을 끝없이 넓힌 극한으로 정의한다[^4][^5]. $$\triangleq$$는 "이렇게 정의한다"는 뜻이다.

$$E_\infty \triangleq \lim_{T\to\infty}\int_{-T}^{T}\vert x(t)\vert ^2dt = \int_{-\infty}^{\infty}\vert x(t)\vert ^2dt, \qquad E_\infty \triangleq \sum_{n=-\infty}^{\infty}\vert x[n]\vert ^2$$


$$P_\infty \triangleq \lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T}\vert x(t)\vert ^2dt, \qquad P_\infty \triangleq \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}\vert x[n]\vert ^2$$


이산 시간에서는 $$-N$$부터 $$N$$까지 점이 $$2N + 1$$개라서 그 수로 나눈다.

**세 부류**[^3]

- 에너지 신호: $$E_\infty < \infty$$. 그러면 $$P_\infty = \lim E_\infty / 2T = 0$$이다.
- 전력 신호: $$0 < P_\infty < \infty$$. 그러면 $$E_\infty = \infty$$다(평균이 양수인 채로 무한히 쌓이므로).
- 둘 다 아닌 신호: $$P_\infty = E_\infty = \infty$$. 예: $$x(t) = t$$이면 $$P = \lim \frac{1}{2T}\cdot\frac{2T^3}{3} = \infty$$.

**실효값(RMS).** 제곱의 시간 평균에 제곱근을 씌운 값이다. 모양이 다른 파형끼리 "얼마나 센가"를 비교할 때 쓴다. 주기 $$T$$인 신호라면 $$x_{\text{rms}} = \sqrt{\frac1T\int_0^T x^2(t)\,dt}$$다[^6]. 진폭 $$A$$인 사인파의 실효값은 $$A/\sqrt2$$, 약 $$0.707A$$다[^s1].

## 예제

**$$\cos 2\pi t$$의 전력**[^7]

- 반각 공식 $$\cos^2\theta = \frac{1 + \cos 2\theta}{2}$$로 바꾼다: $$P_\infty = \lim\frac{1}{4T}\int_{-T}^{T}\bigl(\cos 4\pi t + 1\bigr)dt$$.
- $$\cos 4\pi t$$의 적분은 $$\frac{1}{4\pi}\sin 4\pi t$$로 아무리 커도 $$\pm\frac{1}{4\pi}$$ 사이에 갇혀 있어 $$\frac{1}{4T}$$를 곱하면 0으로 간다.
- 남는 것은 $$\frac{1}{4T}\cdot 2T = \frac12$$. 주기 신호는 전력 신호다.

**$$Ae^{-t}$$ ($$t \ge 0$$)의 에너지.**[^7] $$E_\infty = \int_0^\infty A^2e^{-2t}dt = \frac{A^2}{2}$$이고 $$P_\infty = 0$$이다.

**이산 시간 예.**[^8] $$x[n] = (0.5)^n$$ ($$n \ge 0$$), $$2^n$$ ($$n < 0$$)

- 제곱하면 양쪽 모두 $$0.25^{\vert n\vert }$$꼴이다: $$E_\infty = \sum_{n=1}^{\infty}0.25^n + \sum_{n=0}^{\infty}0.25^n$$.
- 등비급수 공식(첫째항 $$a$$, 공비 $$\vert r\vert <1$$이면 합은 $$\frac{a}{1-r}$$)으로 $$\frac{0.25}{0.75} + \frac{1}{0.75} = \frac13 + \frac43 = \frac53$$.
- 에너지가 유한하니 전력은 0이다.

**단위 계단 $$u[n]$$.**[^8] $$n \ge 0$$에서 1이므로 $$E_\infty = \infty$$, $$P_\infty = \lim\frac{N+1}{2N+1} = \frac12$$. 연속 시간 $$u(t)$$도 같은 방식으로 $$P_\infty = \frac12$$다[^9].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 예의 값($$\frac12$$, $$\frac{A^2}{2}$$, 1, 16, $$\frac53$$, $$\frac12$$, $$T^2/3$$, 사인파 실효값)을 수치 적분과 합으로 재계산해 일치 — [04_signal-energy-power_verify.py](/Hongs_Blog/studies/signals-and-systems/code/04_signal-energy-power_verify/)</div>

</div>


## 활용

- 잡음이 섞인 신호의 품질은 신호 전력과 잡음 전력의 비로 잰다(신호 대 잡음비, SNR)[^s1].
- 가정용 전기 220V는 실효값이다. 실제 최고 전압은 약 $$220\sqrt2 \approx 311$$V다[^s1].
- 3장의 푸리에 급수에서는 한 주기의 평균 전력을 주파수 성분별로 나눠 보게 된다.

## 연결

- 선수: [연속 시간 신호와 이산 시간 신호](/Hongs_Blog/studies/signals-and-systems/ct-dt-signals/), [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/), [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)
- [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/)는 한 주기 에너지가 $$T_0$$이고 평균 전력이 1인 전력 신호다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음은 에너지 신호, 전력 신호, 둘 다 아님 중 무엇인가? ① $$\sin 5t$$ ② $$e^{-\vert t\vert }$$ ③ $$e^{t}$$ ④ $$u[n]$$</summary>

**답:** ① 전력 신호 ($$P = \frac12$$) ② 에너지 신호 ($$E = 1$$) ③ 둘 다 아님 ($$P = \infty$$) ④ 전력 신호 ($$P = \frac12$$).<br>
**흔한 오답:** ③을 전력 신호로 고르는 것. 전력도 무한대라 어느 쪽도 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 에너지가 유한한 신호의 평균 전력은 왜 반드시 0인가?</summary>

**답:** 평균 전력은 에너지를 구간 길이 $$2T$$로 나눈 극한이다. 분자는 유한한 $$E_\infty$$로 가고 분모는 무한히 커지므로 0으로 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$x[n] = (0.5)^n u[n]$$의 에너지를 구하라.</summary>

**답:** $$\sum_{n=0}^\infty 0.25^n = \frac{1}{1 - 0.25} = \frac43$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.10, p.17
[^2]: 같은 자료, p.21
[^3]: 같은 자료, p.24
[^4]: 같은 자료, p.20
[^5]: 같은 자료, p.23
[^6]: 같은 자료, p.21 (정보통신기술용어해설 인용)
[^7]: 같은 자료, p.23
[^8]: 같은 자료, p.25
[^9]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.32
[^s1]: 에이전트 보충. 사인파 실효값 $$A/\sqrt2$$, 신호 대 잡음비, 220V 예, 확인 문제 C1의 ②·③과 C3는 원본에 없다. 값은 검증 코드로 확인했다.
{% endraw %}
