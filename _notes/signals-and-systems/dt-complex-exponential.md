---
layout: "note"
title: "이산 시간 복소 지수 신호"
display_title: "이산 시간 복소 지수 신호 (Discrete-Time Complex Exponential Signal)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Discrete-Time Complex Exponential Signal", "이산 시간 정현파", "Discrete-Time Sinusoid", "이산 시간 주기성", "Periodicity of Discrete-Time Complex Exponentials", "기본 주파수", "Fundamental Frequency", "고조파 집합", "Harmonically Related Exponentials"]
description: "이산 시간 복소 지수 e^{j\\omega0 n}은 원 위를 도는 점을 정수 시각에만 찍은 것이다. 한 번에 \\omega0만큼씩 건너뛰는데, \\omega0와 \\omega0 + 2\\pi는 한 바퀴 더 돌았을 뿐 같은 자리에 찍히므로 구별되지 않는다. 그래서 주파수는 -\\pi부터 \\pi…"
prev_url: "/studies/signals-and-systems/ct-complex-exponential/"
prev_title: "연속 시간 복소 지수 신호"
next_url: "/studies/signals-and-systems/unit-impulse-step/"
next_title: "단위 임펄스와 단위 계단"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/dt-complex-exponential/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이산 시간 복소 지수 $$e^{j\omega_0 n}$$은 원 위를 도는 점을 정수 시각에만 찍은 것이다. 한 번에 $$\omega_0$$만큼씩 건너뛰는데, $$\omega_0$$와 $$\omega_0 + 2\pi$$는 한 바퀴 더 돌았을 뿐 같은 자리에 찍히므로 구별되지 않는다. 그래서 주파수는 $$-\pi$$부터 $$\pi$$까지만 의미가 있고, $$\pi$$일 때 가장 빨리 진동한다. 또 연속 시간과 달리 늘 주기적이지 않다. $$\omega_0/2\pi$$가 유리수일 때만, 즉 몇 칸 뒤에 정확히 출발점에 다시 찍힐 때만 주기 신호다.

</div>


## 예시로 보기

시계의 초침을 1초마다 사진 찍는다고 하자. 초침은 한 장마다 $$6°$$씩 움직인다. 이번엔 초침이 1초에 $$366°$$씩 돈다고 하자. 사진만 보면 한 바퀴 더 돌았다는 것을 알 수 없고, $$6°$$씩 움직이는 것과 똑같이 보인다. 이것이 $$\omega_0$$와 $$\omega_0 + 2\pi$$가 같은 이산 신호가 되는 이유다[^s1].

수업 자료의 예로 보면 $$\omega_0 = 7\pi$$인 $$\cos(7\pi n)$$과 $$\omega_0 = \pi$$인 $$\cos(\pi n)$$은 모든 정수 $$n$$에서 같다. 둘 다 $$1, -1, 1, -1, \dots$$이다[^1]. $$7\pi = \pi + 3 \cdot 2\pi$$이기 때문이다.

## 정의

**일반형.** $$x[n] = C\alpha^n$$이다. $$C$$와 $$\alpha$$는 복소수일 수 있다. $$\alpha = e^{\beta}$$로 두면 $$x[n] = Ce^{\beta n}$$으로도 쓴다[^2].

**실수인 경우** ($$C$$, $$\alpha$$가 실수, 그림 1.24)[^2]

| $$\alpha$$ | 모양 |
|---|---|
| $$\alpha > 1$$ | 같은 부호로 지수적으로 커짐 |
| $$0 < \alpha < 1$$ | 같은 부호로 줄어듦 |
| $$-1 < \alpha < 0$$ | 부호가 번갈아 바뀌며 줄어듦 |
| $$\alpha < -1$$ | 부호가 번갈아 바뀌며 커짐 |

**정현파와 일반 복소 지수.** $$x[n] = A\cos(\omega_0 n + \phi)$$에서 $$\omega_0$$와 $$\phi$$의 단위는 라디안이고 $$n$$은 단위가 없다[^3]. 연속 시간과 같은 오일러 관계가 통한다. $$C = \vert C\vert e^{j\theta}$$, $$\alpha = \vert \alpha\vert e^{j\omega_0}$$로 쓰면 $$C\alpha^n = \vert C\vert \vert \alpha\vert ^n\cos(\omega_0 n + \theta) + j\vert C\vert \vert \alpha\vert ^n\sin(\omega_0 n + \theta)$$이다. $$\vert \alpha\vert  = 1$$이면 정현파, $$\vert \alpha\vert  < 1$$이면 줄어드는 정현파, $$\vert \alpha\vert  > 1$$이면 커지는 정현파다(그림 1.26)[^4].

### 연속 시간과 다른 두 성질

**1. 주파수가 $$2\pi$$마다 되풀이된다.** $$e^{j(\omega_0 + 2\pi)n} = e^{j2\pi n}e^{j\omega_0 n} = e^{j\omega_0 n}$$이다. $$n$$이 정수라 $$e^{j2\pi n} = 1$$이기 때문이다[^5].

- 그래서 길이 $$2\pi$$인 구간 하나($$0 \le \omega_0 < 2\pi$$ 또는 $$-\pi \le \omega_0 < \pi$$)만 보면 된다.
- $$\omega_0$$를 0에서 키우면 진동이 빨라지다가 $$\omega_0 = \pi$$에서 가장 빠르고, $$2\pi$$까지 가며 다시 느려진다(그림 1.27).
- 느리게 변하는(저주파) 신호는 $$\omega_0$$가 $$0, 2\pi$$ 같은 $$\pi$$의 짝수배 근처, 빠르게 변하는(고주파) 신호는 $$\pm\pi$$ 같은 홀수배 근처다. $$e^{j\pi n} = (-1)^n$$은 매 칸 부호가 바뀌는 가장 빠른 신호다[^6].

**2. 늘 주기적이지는 않다.** 주기 $$N > 0$$이려면 $$e^{j\omega_0(n + N)} = e^{j\omega_0 n}$$, 즉 $$e^{j\omega_0 N} = 1$$이어야 한다. 그러려면 $$\omega_0 N = 2\pi m$$인 정수 $$m$$이 있어야 한다[^7].

$$\frac{\omega_0}{2\pi} = \frac{m}{N}$$


$$\omega_0/2\pi$$가 유리수일 때만 주기적이다. $$m$$과 $$N$$을 기약분수로 두면($$m$$과 $$N$$의 공약수가 1) $$N$$이 기본 주기이고, 기본 주파수는 $$\dfrac{2\pi}{N} = \dfrac{\omega_0}{m}$$, 기본 주기는 $$N = m\left(\dfrac{2\pi}{\omega_0}\right)$$이다. $$m$$은 $$N$$칸 동안 원을 몇 바퀴 도는지를 센다[^7].

**표 1.1** 두 신호의 비교[^8]

| | $$e^{j\omega_0 t}$$ | $$e^{j\omega_0 n}$$ |
|---|---|---|
| 서로 다른 $$\omega_0$$ | 서로 다른 신호 | $$2\pi$$의 정수배만큼 다르면 같은 신호 |
| 주기성 | 모든 $$\omega_0$$에서 주기적 | $$\omega_0 = 2\pi m/N$$일 때만 주기적 |
| 기본 주파수 | $$\omega_0$$ | $$\omega_0/m$$ |
| 기본 주기 ($$\omega_0 \neq 0$$) | $$2\pi/\omega_0$$ | $$m(2\pi/\omega_0)$$ |
| 기본 주기 ($$\omega_0 = 0$$) | 정의되지 않음 | 정의되지 않음 |

표의 $$m$$, $$N$$은 공약수가 없다고 가정한다.

**고조파 집합.** 공통 주기 $$N$$을 갖는 복소 지수들은 $$\phi_k[n] = e^{jk(2\pi/N)n}$$ ($$k = 0, \pm1, \dots$$)이다. 연속 시간에서는 $$k$$마다 다른 신호지만, 이산 시간에서는 $$\phi_{k+N}[n] = e^{jk(2\pi/N)n}e^{j2\pi n} = \phi_k[n]$$이다. 그래서 서로 다른 것은 $$\phi_0, \phi_1, \dots, \phi_{N-1}$$ $$N$$개뿐이다[^9].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$e^{j\omega_0 n}$$이 주기 $$N$$이면 $$\omega_0 N = 2\pi m$$이다.</summary>

$$e^{j\omega_0(n+N)} = e^{j\omega_0 n}$$에서 양변을 $$e^{j\omega_0 n}$$(0이 아님)으로 나누면 $$e^{j\omega_0 N} = 1$$이다. 오일러 공식에서 $$\cos\theta = 1$$, $$\sin\theta = 0$$인 각은 $$2\pi$$의 정수배뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 이산 시간 고조파는 $$N$$개뿐이다.</summary>

$$k$$에 $$N$$을 더하면 지수에 $$j2\pi n$$이 더해지고, $$n$$이 정수라 $$e^{j2\pi n} = 1$$이다. 그래서 $$k$$와 $$k + N$$은 같은 신호다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">두 성질의 공통 원인은?</summary>

$$n$$이 정수라는 것. 연속 시간에서는 $$t$$가 모든 실수라서 $$e^{j2\pi t} \neq 1$$인 순간이 있다.

</details>



## 예제

**그림 1.27의 $$\cos(\omega_0 n)$$들**[^10]

| $$\omega_0$$ | $$\omega_0/2\pi$$ | $$N$$, $$m$$ |
|---|---|---|
| $$\pi/8$$ | $$1/16$$ | 16, 1 |
| $$\pi/4$$ | $$1/8$$ | 8, 1 |
| $$\pi/2$$ | $$1/4$$ | 4, 1 |
| $$\pi$$ | $$1/2$$ | 2, 1 |
| $$3\pi/2$$ | $$3/4$$ | 4, 3 |
| $$7\pi/4$$ | $$7/8$$ | 8, 7 |
| $$15\pi/8$$ | $$15/16$$ | 16, 15 |

$$15\pi/8 = 2\pi - \pi/8$$이라 $$\cos(15\pi n/8) = \cos(\pi n/8)$$이다. 표에서 아래로 갈수록 주파수 숫자는 크지만 그림은 다시 느려진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/09_dt-complex-exponential_fig1.svg" alt="그림" loading="lazy">

$$\omega_0$$를 $$\pi/8$$에서 $$\pi$$까지 키우면 진동이 빨라지고, $$15\pi/8$$에서는 $$\pi/8$$과 똑같은 점이 찍힌다. 맨 아래의 회색 곡선은 연속 시간 $$\cos(15\pi t/8)$$이고, 정수 $$n$$에서만 점선 $$\cos(\pi t/8)$$과 만난다[^s2].

**그림 1.25.**[^7] $$\cos(2\pi n/12)$$는 $$N = 12$$, $$\cos(8\pi n/31)$$은 $$\frac{4}{31}$$이므로 $$N = 31$$, $$m = 4$$다. $$\cos(n/6)$$은 $$\frac{\omega_0}{2\pi} = \frac{1}{12\pi}$$가 무리수라 주기가 없다. 모양은 코사인처럼 보이지만 정수 칸이 정확히 출발점에 다시 오지 않는다.

**예제 1.6** $$x[n] = e^{j(2\pi/3)n} + e^{j(3\pi/4)n}$$의 기본 주기[^11]

- 첫 항: $$\frac{2\pi/3}{2\pi} = \frac13$$이므로 $$N_1 = 3$$.
- 둘째 항: $$\frac{3\pi/4}{2\pi} = \frac38$$이므로 $$N_2 = 8$$ ($$m = 3$$).
- 합이 되풀이되려면 두 항이 함께 출발점에 와야 하므로 3과 8의 최소공배수 $$N = 24$$. 첫 항은 8번, 둘째 항은 3번 반복한다.
- 평균 주파수로 묶으면 $$x[n] = 2e^{j(17\pi/24)n}\cos\!\left(\frac{\pi n}{24}\right)$$이다. $$\cos(\pi n/24)$$ 자체의 기본 주기는 48이지만, 크기 $$\vert x[n]\vert  = 2\vert \cos(\pi n/24)\vert $$는 음수 쪽이 뒤집혀 24마다 되풀이된다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 3주차 p.27 크기 그래프의 설명 "주기는 48 (크기(power)라서 음수부분이 반전)" / 문제점: 같은 쪽 그래프의 크기 $$2\vert \cos(\pi n/24)\vert $$는 $$n = 0, 24, 48$$에서 최댓값 2를 갖고 $$n = 12, 36$$에서 0이다. 크기의 주기는 24다. 48은 절댓값을 씌우기 전 $$\cos(\pi n/24)$$의 주기다 / 수정안: "$$\cos(\pi n/24)$$의 주기는 48이지만, 크기는 음수 부분이 뒤집혀 주기가 24" / 근거: [09_dt-complex-exponential_verify.py](/Hongs_Blog/studies/signals-and-systems/code/09_dt-complex-exponential_verify/)가 크기의 가장 작은 주기 24, $$\cos(\pi n/24)$$의 주기 48을 계산

</div>


**MATLAB 예.**[^12] $$\omega_0 = 30\pi/8$$이면 $$\frac{15}{8}$$이므로 $$N = 8$$, $$m = 15$$. $$\omega_0 = 300\pi/8$$이면 $$\frac{75}{4}$$이므로 $$N = 4$$, $$m = 75$$. $$\omega_0 = 7\pi$$이면 $$N = 2$$, $$m = 7$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 그림 1.25·1.27의 $$N$$과 $$m$$, $$7\pi \equiv \pi$$, 예제 1.6의 주기 24, 크기의 주기 24와 $$\cos(\pi n/24)$$의 주기 48, 고조파가 $$N$$개뿐임, $$C\alpha^n$$의 네 경우를 계산해 확인 — [09_dt-complex-exponential_verify.py](/Hongs_Blog/studies/signals-and-systems/code/09_dt-complex-exponential_verify/)</div>

</div>


단계별 연습: [이산 신호 주기 예제 사다리](/Hongs_Blog/studies/signals-and-systems/dt-period-ladder/)

## 활용

- 디지털 오디오에서 소리를 너무 드문드문 뽑으면, 높은 음이 낮은 음과 같은 표본이 되어 다른 소리로 들린다(에일리어싱). $$\omega_0$$와 $$\omega_0 + 2\pi$$가 구별되지 않는 성질 때문이다[^s1].
- $$N$$개의 고조파 $$e^{jk(2\pi/N)n}$$은 이산 푸리에 변환(DFT)의 기저다 → [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)
- 흔한 실수: 연속 시간처럼 "$$\cos(\omega_0 n)$$의 주기는 $$2\pi/\omega_0$$"라고 쓰는 것. $$2\pi/\omega_0$$가 정수가 아니면 틀린다.

## 연결

- 선수: [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/)
- 다음: [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\omega_0$$를 키우면 이산 정현파도 계속 빨리 진동한다."</div>

틀렸다. 연속 시간에서는 맞기 때문에 그럴듯하다. 이산 시간에서는 $$\omega_0 = \pi$$에서 가장 빠르고, 그 뒤로는 다시 느려져 $$\omega_0 = 2\pi$$에서 상수가 된다. 확인: $$\cos(2\pi n) = 1$$이고 $$\cos(15\pi n/8) = \cos(\pi n/8)$$이다(그림 1.27(h), (i)).

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이산 정현파는 모두 주기 신호다."</div>

틀렸다. $$\cos(n/6)$$은 코사인 모양이지만 $$\frac{1}{12\pi}$$가 무리수라 어떤 정수 $$N$$으로 밀어도 정확히 겹치지 않는다. 확인: $$N = 1, \dots, 4999$$ 어느 것도 $$\cos((1 + N)/6) = \cos(1/6)$$을 만족하지 않는다(검증 코드).

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$x[n] = \cos(3\pi n/5)$$의 기본 주기는?</summary>

**답:** $$\frac{3\pi/5}{2\pi} = \frac{3}{10}$$이므로 $$N = 10$$ ($$m = 3$$).<br>
**흔한 오답:** $$2\pi/\omega_0 = 10/3$$으로 적는 것. 정수가 아니므로 주기가 될 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 중 주기 신호는? ① $$\cos(2n)$$ ② $$\cos(2\pi n/7)$$ ③ $$\cos(2t)$$ ④ $$e^{j\pi n/\sqrt2}$$</summary>

**답:** ②, ③. ①은 $$\frac{2}{2\pi} = \frac1\pi$$가 무리수, ④는 $$\frac{1}{2\sqrt2}$$가 무리수라 주기가 없다. ③은 연속 시간이라 언제나 주기적이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이산 시간에서 $$\omega_0 = \pi$$가 가장 높은 주파수인 이유는?</summary>

**답:** $$e^{j\pi n} = (-1)^n$$은 매 칸 부호가 바뀌어 두 칸보다 짧게 되풀이될 수 없다. $$\omega_0$$를 $$\pi$$보다 키우면 $$\omega_0 - 2\pi$$(크기가 $$\pi$$보다 작은 음의 주파수)와 같은 신호가 되어 다시 느려진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$x[n] = e^{j(\pi/2)n} + e^{j(2\pi/5)n}$$의 기본 주기는?</summary>

**답:** 첫 항 $$\frac14$$ → 4, 둘째 항 $$\frac15$$ → 5. 최소공배수 20.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.22, p.25
[^2]: 같은 자료, p.13~14 (그림 1.24)
[^3]: 같은 자료, p.15 (그림 1.25)
[^4]: 같은 자료, p.16 (그림 1.26)
[^5]: 같은 자료, p.17~18
[^6]: 같은 자료, p.19
[^7]: 같은 자료, p.20 (그림 1.25의 $$N$$, $$m$$ 표시)
[^8]: 같은 자료, p.22 (표 1.1)
[^9]: 같은 자료, p.28
[^10]: 같은 자료, p.18, p.21 (그림 1.27의 $$N$$, $$m$$ 표시)
[^11]: 같은 자료, p.26~27 (예제 1.6)
[^12]: 같은 자료, p.24~25
[^s1]: 에이전트 보충. 초침 사진 비유, 예제 1.6에서 크기의 주기가 24라는 설명, 에일리어싱 활용, 스스로 설명해 보기, 확인 문제 C1·C2·C4는 원본에 없다. 값은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [09_dt-complex-exponential_plot.py](/Hongs_Blog/studies/signals-and-systems/code/09_dt-complex-exponential_plot/)로 그렸고, 같은 코드로 다음을 확인했다: $$\cos(15\pi n/8) = \cos(\pi n/8)$$, $$\cos 7\pi n = (-1)^n$$, 네 신호의 기본 주기 16, 4, 2, 16.
{% endraw %}
