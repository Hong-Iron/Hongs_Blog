---
layout: "note"
title: "연속 시간 복소 지수 신호"
display_title: "연속 시간 복소 지수 신호 (Continuous-Time Complex Exponential Signal)"
kind: "concept"
kind_label: "정의"
num: "08"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Continuous-Time Complex Exponential Signal", "복소 지수 신호", "Complex Exponential", "실수 지수 신호", "Real Exponential", "정현파 신호", "Sinusoidal Signal", "각주파수", "Angular Frequency", "위상", "Phase", "페이저", "Phasor", "고조파", "Harmonic", "감쇠 정현파", "Damped Sinusoid"]
description: "e^{j\\omega0 t}는 복소평면에서 반지름 1인 원 위를 일정한 속도로 도는 점이다. 그 그림자를 실수축에 비추면 \\cos\\omega0 t, 허수축에 비추면 \\sin\\omega0 t가 된다. 그래서 모든 정현파는 회전하는 화살표로 바꿔 쓸 수 있고, 삼각함수의 복잡한 덧셈정리…"
prev_url: "/studies/signals-and-systems/even-odd-signals/"
prev_title: "짝 신호와 홀 신호"
next_url: "/studies/signals-and-systems/dt-complex-exponential/"
next_title: "이산 시간 복소 지수 신호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/ct-complex-exponential/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

$$e^{j\omega_0 t}$$는 복소평면에서 반지름 1인 원 위를 일정한 속도로 도는 점이다. 그 그림자를 실수축에 비추면 $$\cos\omega_0 t$$, 허수축에 비추면 $$\sin\omega_0 t$$가 된다. 그래서 모든 정현파는 회전하는 화살표로 바꿔 쓸 수 있고, 삼각함수의 복잡한 덧셈정리 대신 지수의 곱셈만으로 계산할 수 있다. 여기에 $$e^{rt}$$를 곱하면 원이 나선이 되어, 진동하면서 커지거나 줄어드는 신호까지 한 식 $$Ce^{at}$$로 적는다. 실제 측정값은 실수이므로, 복소 신호는 계산 도구이고 결과는 실수부를 취해 읽는다.

</div>


## 예시로 보기

자전거 바퀴의 바람 넣는 꼭지를 떠올리자[^s1]. 1주차 자료도 원 위를 도는 점의 그림자로 정현파를 그린다[^1]. 바퀴가 초당 $$f_0$$바퀴씩 돌면, 꼭지의 높이는 시간에 따라 사인파를 그린다.

- 진폭 $$A$$는 바퀴의 반지름, 곧 꼭지가 오르내리는 폭이다.
- 주파수 $$f_0$$는 1초에 도는 바퀴 수(Hz)다. 각주파수 $$\omega_0 = 2\pi f_0$$은 1초에 도는 각도(rad/s)다. 0.25Hz면 4초에 한 바퀴, $$2\pi$$ rad/s면 1초에 한 바퀴다.
- 위상 $$\phi$$는 $$t = 0$$일 때 꼭지가 어디서 출발했는지다.

$$x(t) = A\cos(\omega_0 t + \phi) = A\cos\!\bigl(2\pi f_0 (t - t_d)\bigr), \quad t_d = -\frac{\phi}{2\pi f_0}$$


마지막 꼴은 위상이 결국 시간 지연과 같다는 뜻이다[^1]. 이 바퀴 위 점을 복소평면에 놓으면 $$Ae^{j(\omega_0 t + \phi)}$$이고, 그 실수부가 $$A\cos(\omega_0 t + \phi)$$다.

## 정의

**일반형.** 복소 지수 신호는 $$x(t) = Ce^{at}$$ 꼴이다. $$C$$와 $$a$$는 복소수일 수 있다[^2].

**실수 지수 신호.** $$C$$와 $$a$$가 실수면 $$a > 0$$일 때 커지고(세포 분열, 연쇄 반응), $$a < 0$$일 때 줄어든다(방사성 붕괴, RC 회로의 방전)[^2].

**주기적 복소 지수 신호.** $$a$$가 순허수 $$j\omega_0$$이면 $$x(t) = e^{j\omega_0 t}$$다[^3].

- 주기 $$T$$이려면 $$e^{j\omega_0(t+T)} = e^{j\omega_0 t}e^{j\omega_0 T}$$이므로 $$e^{j\omega_0 T} = 1$$, 즉 $$\omega_0 T = 2\pi k$$ ($$k$$는 정수)여야 한다[^4].
- $$\omega_0 \neq 0$$이면 기본 주기는 $$T_0 = \dfrac{2\pi}{\vert \omega_0\vert }$$다. $$e^{j\omega_0 t}$$와 $$e^{-j\omega_0 t}$$는 도는 방향만 다르고 기본 주기가 같다.
- $$\omega_0 = 0$$이면 $$x(t) = 1$$이고 기본 주기는 정의되지 않는다.
- 모든 $$\omega_0$$에 대해 주기적이다. 이산 시간과 다른 점이다.

**오일러 관계와 정현파.** 오일러 공식 $$e^{j\omega_0 t} = \cos\omega_0 t + j\sin\omega_0 t$$에서[^5]

$$\cos\omega t = \frac{e^{j\omega t} + e^{-j\omega t}}{2}, \qquad \sin\omega t = \frac{e^{j\omega t} - e^{-j\omega t}}{2j}$$


$$A\cos(\omega_0 t + \phi) = \frac A2 e^{j\phi}e^{j\omega_0 t} + \frac A2 e^{-j\phi}e^{-j\omega_0 t} = A\,\mathrm{Re}\{e^{j(\omega_0 t + \phi)}\}$$


정현파 하나는 반대로 도는 복소 지수 두 개의 합이다. 또는 복소 지수 하나의 실수부다. $$A\sin(\omega_0 t + \phi) = A\,\mathrm{Im}\{e^{j(\omega_0 t + \phi)}\}$$다. 몇 가지 값은 외워 두면 편하다: $$e^{j\pi/2} = j$$, $$e^{j\pi} = -1$$, $$e^{j2\pi n} = 1$$ ($$n$$은 정수)[^5].

**페이저.** 같은 주파수의 정현파만 다룰 때는 $$e^{j\omega_0 t}$$를 떼고 크기와 위상만 남긴 복소수 $$X = Ae^{j\phi}$$로 적는다. 이것을 페이저라 한다. 직교 형식 $$A\cos\phi + jA\sin\phi$$, 지수 형식 $$Ae^{j\phi}$$, 극형식 $$A\angle\phi$$로 쓴다[^6]. 예: $$z = 1 + j0.5$$는 $$r = \sqrt{1^2 + 0.5^2} \approx 1.118$$, $$\theta = \tan^{-1}(0.5) \approx 0.4636$$ rad($$26.56°$$)이므로 $$1.118\angle 26.56° = 1.118e^{j0.4636}$$이다[^7].

**에너지와 전력.** $$\vert e^{j\omega_0 t}\vert  = 1$$이라 한 주기의 에너지는 $$\int_0^{T_0}1\,dt = T_0$$, 평균 전력은 1이다. 시간이 끝없이 이어지니 전체 에너지는 무한대인 전력 신호다[^8].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 3주차 p.7 "$$\vert e^{j\omega t}\vert  = e^{j\omega t}\cdot e^{-j\omega t} = 1$$" / 문제점: 복소수와 그 켤레의 곱은 크기가 아니라 크기의 제곱이다($$z z^* = \vert z\vert ^2$$). 이 경우 값이 1이라 결과는 같다 / 수정안: $$\vert e^{j\omega t}\vert ^2 = e^{j\omega t}e^{-j\omega t} = 1$$이므로 $$\vert e^{j\omega t}\vert  = 1$$ / 근거: 같은 쪽 오른쪽 상자의 $$z\bar z = a^2 + b^2 = \vert z\vert ^2$$

</div>


**고조파.** $$\omega_0$$의 정수배 주파수를 갖는 복소 지수들의 모임이다[^9].

$$\phi_k(t) = e^{jk\omega_0 t}, \qquad k = 0, \pm1, \pm2, \dots$$


$$k = 0$$이면 상수다. $$k \neq 0$$이면 기본 주파수 $$\vert k\vert \omega_0$$, 기본 주기 $$\dfrac{2\pi}{\vert k\vert \omega_0} = \dfrac{T_0}{\vert k\vert }$$인 주기 신호다. 모두 공통으로 $$T_0$$마다 되풀이된다. 3장 푸리에 급수의 재료가 이 모임이다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 3주차 p.8 "$$k = 4,\ \phi_3 = e^{j4\omega_0 t}$$" / 문제점: 정의 $$\phi_k = e^{jk\omega_0 t}$$에 따르면 $$k = 4$$인 신호의 이름은 $$\phi_4$$다 / 수정안: $$\phi_4 = e^{j4\omega_0 t}$$ / 근거: 같은 쪽 정의 $$\phi_k(t) = e^{jk\omega_0 t}$$

</div>


**일반 복소 지수 신호.** $$C = \vert C\vert e^{j\theta}$$(극형식), $$a = r + j\omega_0$$(직교 형식)로 쓰면[^10]

$$Ce^{at} = \vert C\vert e^{rt}e^{j(\omega_0 t + \theta)} = \vert C\vert e^{rt}\cos(\omega_0 t + \theta) + j\vert C\vert e^{rt}\sin(\omega_0 t + \theta)$$


| $$r$$ | 실수부·허수부의 모양 |
|---|---|
| $$r = 0$$ | 정현파 |
| $$r > 0$$ | 진폭이 지수적으로 커지는 정현파 (그림 1.23(a)) |
| $$r < 0$$ | 진폭이 지수적으로 줄어드는 정현파, 감쇠 정현파 (그림 1.23(b)) |

$$e^{st}$$로 쓰면 $$s$$ 하나가 성장·감쇠($$s$$의 실수부)와 진동($$s$$의 허수부)을 함께 담는다[^4].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$e^{j\omega_0 t}$$의 기본 주기는 $$2\pi/\vert \omega_0\vert $$다.</summary>

$$e^{j\omega_0 T} = 1$$이려면 $$\omega_0 T$$가 $$2\pi$$의 정수배여야 하고(오일러 공식에서 $$\cos = 1$$, $$\sin = 0$$), 그중 가장 작은 양수는 $$\omega_0 T = \pm 2\pi$$일 때다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. $$A\cos(\omega_0 t + \phi) = \frac A2 e^{j\phi}e^{j\omega_0 t} + \frac A2e^{-j\phi}e^{-j\omega_0 t}$$다.</summary>

$$\cos\theta = \frac12(e^{j\theta} + e^{-j\theta})$$에 $$\theta = \omega_0 t + \phi$$를 넣고 지수법칙 $$e^{j(\omega_0 t + \phi)} = e^{j\phi}e^{j\omega_0 t}$$로 나눈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 표현의 핵심 아이디어는?</summary>

진동을 원 위의 회전으로 보면, 곱셈은 각의 덧셈이 되어 삼각함수 계산이 지수 계산으로 바뀐다.

</details>



## 예제

**예제 1.5** 두 복소 지수의 합 $$x(t) = e^{j2t} + e^{j3t}$$를 복소 지수와 정현파의 곱으로 쓰라[^11].

- 평균 주파수를 빼낸다: $$\frac{2 + 3}{2} = 2.5$$이므로 $$x(t) = e^{j2.5t}(e^{-j0.5t} + e^{j0.5t})$$.
- 괄호를 오일러 관계로: $$e^{-j0.5t} + e^{j0.5t} = 2\cos(0.5t)$$. 그래서 $$x(t) = 2e^{j2.5t}\cos(0.5t)$$.
- 크기: $$\vert e^{j2.5t}\vert  = 1$$이므로 $$\vert x(t)\vert  = 2\vert \cos(0.5t)\vert $$. 크기가 전파 정류된 정현파 모양이다. $$2\cos(0.5t)$$의 주기는 $$4\pi \approx 12.566$$이고, 절댓값을 씌운 $$\vert x(t)\vert $$는 그 절반인 $$2\pi$$마다 되풀이된다[^s1].

**페이저 덧셈** 같은 주파수의 두 정현파 $$2\cos(3t + 0.4) + \cos(3t - 1.1)$$은 페이저 $$2e^{j0.4} + e^{-j1.1}$$의 크기와 위상을 가진 정현파 하나다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 오일러 관계, 예제 1.5의 분해와 크기, 기본 주기와 고조파 주기, $$Ce^{at}$$의 실수부와 포락선, 페이저 덧셈, $$1 + j0.5$$의 극형식을 여러 시각에서 계산해 일치 — [08_ct-complex-exponential_verify.py](/Hongs_Blog/studies/signals-and-systems/code/08_ct-complex-exponential_verify/)</div>

</div>


## 활용

- 교류 회로 해석은 페이저로 미분방정식을 복소수 대수로 바꿔 푼다[^s1].
- 3장에서 $$e^{st}$$가 모든 LTI 시스템을 통과해도 모양이 바뀌지 않는(상수배만 되는) 신호라는 것을 배운다. 그래서 신호를 복소 지수들로 나누는 것이 이 과목 후반의 중심이다.
- 감쇠 정현파는 종소리, 충격을 받은 구조물, 2계 미분방정식의 복소근 해 $$e^{\alpha t}\cos\beta t$$에서 나온다 → [상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/)

## 연결

- 선수: [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/), [주기 신호](/Hongs_Blog/studies/signals-and-systems/periodic-signals/)
- 같은 구조: [덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/)
- 이산 시간 버전: [이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\omega_0$$가 클수록 주기가 길다."</div>

틀렸다. $$\omega_0$$는 1초에 도는 각도라서 클수록 빨리 돌고 주기 $$2\pi/\vert \omega_0\vert $$는 짧아진다. "숫자가 크면 길다"는 느낌 때문에 헷갈린다. 확인: 그림 1.21에서 $$\omega_1 > \omega_2 > \omega_3$$이면 $$T_1 < T_2 < T_3$$이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\cos\omega t$$와 $$\sin\omega t$$를 복소 지수로 쓰라.</summary>

**답:** $$\cos\omega t = \frac{e^{j\omega t} + e^{-j\omega t}}{2}$$, $$\sin\omega t = \frac{e^{j\omega t} - e^{-j\omega t}}{2j}$$.<br>
**흔한 오답:** $$\sin$$의 분모에 $$j$$를 빠뜨리는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x(t) = e^{j4t} + e^{j6t}$$를 $$(\text{복소 지수})\times(\text{실수 정현파})$$ 꼴로 쓰고 $$\vert x(t)\vert $$를 구하라.</summary>

**답:** $$x(t) = e^{j5t}(e^{-jt} + e^{jt}) = 2e^{j5t}\cos t$$, $$\vert x(t)\vert  = 2\vert \cos t\vert $$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$s = -0.5 + j3$$일 때 $$\mathrm{Re}\{e^{st}\}$$의 모양을 말로 설명하고 식으로 쓰라.</summary>

**답:** 각주파수 3 rad/s로 진동하면서 진폭이 $$e^{-0.5t}$$를 따라 줄어드는 감쇠 정현파. $$e^{-0.5t}\cos 3t$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$e^{j\omega_0 t}$$와 $$e^{-j\omega_0 t}$$의 기본 주기가 같은 이유는?</summary>

**답:** 둘 다 원을 같은 속도로 돌고 방향만 반대다. 식으로는 둘 다 $$\vert \omega_0\vert T = 2\pi$$일 때 처음 제자리로 온다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/01.Week01_1_자연상수와 오일러 등식.pdf, p.6
[^2]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.2
[^3]: 같은 자료, p.3
[^4]: 같은 자료, p.3, p.7
[^5]: 같은 자료, p.6
[^6]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.6, 3-1학기/신호 및 시스템/1.수업자료/01.Week01_1_자연상수와 오일러 등식.pdf, p.7
[^7]: 3-1학기/신호 및 시스템/1.수업자료/01.Week01_1_자연상수와 오일러 등식.pdf, p.7
[^8]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.7
[^9]: 같은 자료, p.7~8
[^10]: 같은 자료, p.11~12 (그림 1.23)
[^11]: 같은 자료, p.10
[^s1]: 에이전트 보충. 자전거 바퀴 비유, $$\vert x(t)\vert $$의 주기가 $$2\pi$$라는 설명, 페이저 덧셈 예, 교류 회로 해석에 쓰인다는 활용, 스스로 설명해 보기, 확인 문제 C2~C4는 원본에 없다. 값은 검증 코드로 확인했다.
{% endraw %}
