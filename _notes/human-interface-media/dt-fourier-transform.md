---
layout: "note"
title: "이산 시간 푸리에 변환"
display_title: "이산 시간 푸리에 변환 (Discrete-Time Fourier Transform)"
kind: "concept"
kind_label: "정리"
num: "58"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Discrete-Time Fourier Transform", "DTFT", "역 이산 시간 푸리에 변환", "Inverse DTFT", "이산 시간 푸리에 변환 쌍", "디지털 주파수", "Digital Frequency"]
description: "일정한 간격으로 잰 값들의 줄(수열)이 한 번 나타났다 사라질 때, 그 안에 어떤 주파수가 얼마나 들어 있는지를 이어진 곡선으로 그려 준다. 수열은 정수 시각에서만 값이 있어서, 한 샘플마다 한 바퀴를 더 도는 진동은 원래 진동과 똑같은 수열이 된다. 그래서 이 곡선은 주파수 축에…"
prev_url: "/studies/human-interface-media/real-signal-real-spectrum/"
prev_title: "실수 신호와 실수 스펙트럼"
next_url: "/studies/human-interface-media/dt-periodic-fourier-transform/"
next_title: "이산 주기 신호의 푸리에 변환"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "58_dt-fourier-transform_plot.py", "u": "/studies/human-interface-media/code/58_dt-fourier-transform_plot/", "r": "그림 생성"}, {"t": "58_dt-fourier-transform_verify.py", "u": "/studies/human-interface-media/code/58_dt-fourier-transform_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/dt-fourier-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

일정한 간격으로 잰 값들의 줄(수열)이 한 번 나타났다 사라질 때, 그 안에 어떤 주파수가 얼마나 들어 있는지를 이어진 곡선으로 그려 준다. 수열은 정수 시각에서만 값이 있어서, 한 샘플마다 한 바퀴를 더 도는 진동은 원래 진동과 똑같은 수열이 된다. 그래서 이 곡선은 주파수 축에서 일정한 간격마다 똑같이 되풀이된다. 값들이 충분히 빨리 0으로 줄어드는 수열이어야 변환이 존재하고, 컴퓨터가 계산하는 이산 푸리에 변환(DFT)은 길이가 유한한 수열에서 이 곡선을 몇 개 점에서 찍은 값이다.

</div>


## 예시로 보기

계속 되풀이되는 수열은 [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/)로 나눌 수 있다. 그런데 손뼉 소리를 녹음한 샘플처럼 한 번 나타났다 사라지는 수열은 되풀이되지 않아서 급수를 쓸 수 없다.

가장 단순한 예로 $$x[n] = 1$$ ($$-2 \le n \le 2$$), 그 밖은 0인 수열을 보자. 이 수열을 억지로 주기 $$N = 10$$으로 되풀이시키면 급수를 쓸 수 있다. 급수 계수에 $$N$$을 곱한 $$Na_k$$를 주파수 $$\omega = 2\pi k/N$$ 자리에 막대로 세우면, 막대 끝이 한 매끄러운 곡선 위에 놓인다. $$N = 20$$으로 늘리면 같은 곡선 위에 막대가 두 배로 촘촘해진다. $$N$$을 끝없이 키우면 되풀이된 복사본은 무한히 멀어지고, 막대는 곡선 전체를 채운다. 그 곡선이 이 수열의 이산 시간 푸리에 변환이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/58_dt-fourier-transform_fig1.svg" alt="그림" width="679" height="602" loading="lazy">

맨 위는 원래 수열(파랑)과 주기 10으로 늘인 복사본(회색)이다. 가운데와 아래는 $$N = 10$$과 $$N = 20$$일 때의 막대 $$Na_k$$다. 두 경우 모두 막대 끝이 같은 점선 곡선 위에 있다. 곡선은 회색 칸(길이 $$2\pi$$) 바깥에서 같은 모양을 되풀이한다[^s1].

곡선을 직접 구하면 이렇다. $$n$$과 $$-n$$의 두 항을 묶으면 $$e^{j\omega n} + e^{-j\omega n} = 2\cos\omega n$$이므로

$$X(e^{j\omega}) = \sum_{n=-2}^{2}e^{-j\omega n} = 1 + 2\cos\omega + 2\cos 2\omega$$


| $$\omega$$ | $$0$$ | $$\frac{2\pi}{5}$$ | $$\frac{\pi}{2}$$ | $$\pi$$ | $$2\pi$$ |
|---|---|---|---|---|---|
| $$X(e^{j\omega})$$ | 5 | 0 | $$-1$$ | 1 | 5 |

$$\omega = 2\pi$$의 값이 $$\omega = 0$$의 값과 같다. 곡선이 $$2\pi$$마다 되풀이된다는 뜻이다.

## 정의

수열 $$x[n]$$의 이산 시간 푸리에 변환은, 시각 $$n$$의 값에 그 시각만큼 돌린 회전 $$e^{-j\omega n}$$을 곱해 모든 $$n$$에 대해 더한 것이다. 주파수 $$\omega$$는 한 샘플마다 도는 각도(라디안)이고, $$\omega$$마다 복소수 값이 하나 나온다. 되돌릴 때는 길이 $$2\pi$$인 한 구간의 주파수만 적분한다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">기호로 쓰면</div>

$$X(e^{j\omega}) = \sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n} \qquad \text{(분석식, 변환)}$$

$$x[n] = \frac{1}{2\pi}\int_{2\pi}X(e^{j\omega})e^{j\omega n}\,d\omega \qquad \text{(합성식, 역변환)}$$

$$n$$은 정수 시각, $$\omega$$는 실수 주파수(라디안/샘플), $$\int_{2\pi}$$는 길이 $$2\pi$$인 아무 구간(예: $$-\pi \le \omega < \pi$$)의 적분이다.

</div>


- **존재 조건.** 값의 절댓값을 다 더한 $$\sum_n\lvert x[n]\rvert$$가 유한하면(절대 합 가능) 합이 모든 $$\omega$$에서 수렴하고 $$X(e^{j\omega})$$는 이어진 함수다. 에너지 $$\sum_n\lvert x[n]\rvert^2$$만 유한하면 오차의 에너지가 0이 되는 뜻으로 수렴한다[^s2].
- **주기 $$2\pi$$.** $$n$$이 정수라서 $$e^{-j(\omega + 2\pi)n} = e^{-j\omega n}e^{-j2\pi n} = e^{-j\omega n}$$이다. 그래서 $$X(e^{j(\omega + 2\pi)}) = X(e^{j\omega})$$다. 이름에 $$e^{j\omega}$$를 넣어 $$X(e^{j\omega})$$로 쓰는 것도 이 때문이다. $$X$$는 $$\omega$$를 $$e^{j\omega}$$를 거쳐서만 쓰므로, $$e^{j\omega}$$가 같으면 값도 같다.
- **가장 빠른 진동은 $$\omega = \pi$$.** $$e^{j\pi n} = (-1)^n$$은 한 샘플마다 부호가 바뀌는, 수열이 낼 수 있는 가장 빠른 진동이다. $$\omega$$를 $$\pi$$보다 더 키우면 오히려 느린 진동과 같은 수열이 되고, $$\omega = 2\pi$$는 상수 1이다. 그래서 $$-\pi \le \omega < \pi$$ 한 구간만 보면 된다.
- **에너지.** $$\sum_n\lvert x[n]\rvert^2 = \frac{1}{2\pi}\int_{2\pi}\lvert X(e^{j\omega})\rvert^2d\omega$$(파스발 관계)라서, $$\frac{\lvert X(e^{j\omega})\rvert^2}{2\pi}$$가 주파수별 에너지의 분포다[^s2].
- **실수 수열.** $$x[n]$$이 실수면 $$X(e^{-j\omega}) = X^*(e^{j\omega})$$다. 연속 시간과 같은 켤레 대칭이다([실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/)).

## 증명

역변환이 원래 수열을 돌려준다는 것은 회전 하나를 한 바퀴 적분하면 0이라는 사실 하나로 보인다. 변환식이 나온 과정은 위의 예처럼 주기를 끝없이 늘리는 극한이다.

<details markdown="1"><summary markdown="span">역변환이 맞는 이유</summary>


1. 정수 $$d$$에 대해 $$\frac{1}{2\pi}\int_{-\pi}^{\pi}e^{j\omega d}d\omega$$는 $$d = 0$$이면 1이고, $$d \ne 0$$이면 $$\frac{e^{j\pi d} - e^{-j\pi d}}{2\pi jd} = \frac{\sin\pi d}{\pi d} = 0$$이다. $$e^{j\omega d}$$는 $$\omega$$가 $$2\pi$$만큼 가는 동안 정확히 $$\lvert d\rvert$$바퀴 돌아 넓이가 상쇄되기 때문이다.
2. 역변환식에 변환식을 넣고 합과 적분의 순서를 바꾼다(절대 합 가능이면 바꿔도 된다): $$\frac{1}{2\pi}\int\sum_m x[m]e^{-j\omega m}e^{j\omega n}d\omega = \sum_m x[m]\cdot\frac{1}{2\pi}\int e^{j\omega(n - m)}d\omega$$.
3. 1단계에 따라 $$m = n$$인 항만 1이 남고 나머지는 0이다. 그래서 결과는 $$x[n]$$이다[^s3].

</details>

<details markdown="1"><summary markdown="span">급수에서 변환으로 (유도)</summary>


1. $$x[n]$$이 $$-N_1 \le n \le N_2$$ 밖에서 0이라 하자. 이 조각을 주기 $$N$$으로 되풀이한 $$\tilde x[n]$$을 만든다. 복사본끼리 겹치지 않도록 $$N \ge N_1 + N_2 + 1$$로 잡는다[^s3].
2. $$\tilde x$$의 급수 계수는 $$a_k = \frac1N\sum_{n=\langle N\rangle}\tilde x[n]e^{-jk(2\pi/N)n}$$이다. 한 주기로 $$-N_1 \le n \le N_2$$를 고르면 그 안에서 $$\tilde x = x$$이고, 바깥에서 $$x = 0$$이라 합을 모든 $$n$$으로 넓혀도 된다: $$a_k = \frac1N\sum_{n=-\infty}^{\infty}x[n]e^{-jk(2\pi/N)n}$$.
3. $$X(e^{j\omega}) = \sum_n x[n]e^{-j\omega n}$$로 정의하면 $$a_k = \frac1N X(e^{jk\omega_0})$$, $$\omega_0 = \frac{2\pi}{N}$$이다.
4. 합성식에 넣고 $$\frac1N = \frac{\omega_0}{2\pi}$$를 쓰면 $$\tilde x[n] = \frac{1}{2\pi}\sum_{k=\langle N\rangle}X(e^{jk\omega_0})e^{jk\omega_0 n}\omega_0$$이다.
5. 각 항은 높이 $$X(e^{jk\omega_0})e^{jk\omega_0 n}$$, 폭 $$\omega_0$$인 직사각형의 넓이다. 연속한 $$N$$개 $$k$$의 폭을 다 더하면 $$N\omega_0 = 2\pi$$다. $$N \to \infty$$이면 $$\omega_0 \to 0$$이고 $$\tilde x[n] \to x[n]$$이므로, 넓이의 합이 길이 $$2\pi$$ 구간의 적분이 된다: $$x[n] = \frac{1}{2\pi}\int_{2\pi}X(e^{j\omega})e^{j\omega n}d\omega$$.

1단계의 조건이 깨져 $$N < N_1 + N_2 + 1$$이면, 3단계의 등식 $$Na_k = X(e^{j2\pi k/N})$$은 그대로 맞지만 한 주기의 $$\tilde x$$가 원래 $$x$$와 달라진다. 예: 다섯 개의 1을 주기 $$N = 4$$로 늘리면 $$n = 2$$와 $$n = -2$$가 같은 칸에 겹쳐 한 주기가 $$1, 1, 2, 1$$이 된다[^s3].

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 사각 펄스($$N_1 = 0, 1, 2, 5$$)와 $$a^n u[n]$$($$a = 0.5, -0.5, 0.9, -0.3$$), $$a^{\vert n\vert }$$의 닫힌 꼴을 정의대로 한 합과 비교, 역변환 수치 적분으로 원래 수열 복원, 주기 $$2\pi$$, $$Na_k = X(e^{j2\pi k/N})$$($$N = 4, 5, 10, 20, 40$$), DFT가 DTFT의 표본과 같음, 파스발 $$\frac43$$, 위상 최댓값 $$30°$$ (실험으로 확인됨) — [58_dt-fourier-transform_verify.py](/Hongs_Blog/studies/human-interface-media/code/58_dt-fourier-transform_verify/)</div>

</div>


### 스스로 설명해 보기

1. "$$X(e^{j(\omega + 2\pi)}) = X(e^{j\omega})$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   변환식의 각 항에서 $$e^{-j(\omega + 2\pi)n} = e^{-j\omega n}e^{-j2\pi n}$$이고, $$n$$이 정수라 $$e^{-j2\pi n} = 1$$이다. 시각이 정수뿐이라는 이산 신호의 성질에서 나온다.
   </details>
2. "유도 2단계에서 합을 모든 $$n$$으로 넓혀도 된다"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   한 주기 안에서는 $$\tilde x = x$$이고, 그 바깥에서 $$x[n] = 0$$이라 더해지는 항이 모두 0이다. 1단계에서 복사본이 겹치지 않게 $$N$$을 잡았기 때문에 첫 문장이 맞는다.
   </details>
3. "유도 5단계에서 합이 길이 $$2\pi$$ 적분이 된다"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   폭 $$\omega_0$$인 직사각형 $$N$$개의 합(리만 합)이고, 폭의 총합이 $$N\omega_0 = 2\pi$$로 고정된 채 폭이 0으로 가므로 길이 $$2\pi$$ 구간의 정적분으로 간다. 연속 시간과 달리 적분 구간이 무한히 넓어지지 않는다.
   </details>
- 이 유도의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  되풀이되지 않는 수열을 주기가 무한히 긴 주기 수열로 보면, 띄엄띄엄한 급수 계수가 이어진 곡선으로 메워진다. 연속 시간 푸리에 변환을 만든 방법과 같다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/)의 유도가 같은 구조다. 거꾸로 길이 $$N$$짜리 수열의 DFT는 이 극한을 하기 전 단계, 곧 주기 $$N$$으로 늘인 수열의 급수 계수($$N$$배)다.
  </details>

## 예제

**예 1.** $$x[n] = a^n u[n]$$, $$\lvert a\rvert < 1$$

- *합 범위 줄이기:* $$u[n]$$은 $$n < 0$$에서 0이므로 $$X(e^{j\omega}) = \sum_{n=0}^{\infty}a^ne^{-j\omega n}$$.
- *등비수열로 묶기:* $$a^ne^{-j\omega n} = (ae^{-j\omega})^n$$이고 공비의 크기가 $$\lvert ae^{-j\omega}\rvert = \lvert a\rvert < 1$$이라 수렴한다.
- *합 공식:* $$\sum_{n=0}^{\infty}r^n = \frac{1}{1 - r}$$에서 $$X(e^{j\omega}) = \dfrac{1}{1 - ae^{-j\omega}}$$.
- *크기와 위상:* 분모 $$1 - a\cos\omega + ja\sin\omega$$에서 $$\lvert X\rvert^2 = \frac{1}{1 - 2a\cos\omega + a^2}$$, $$\angle X = -\tan^{-1}\frac{a\sin\omega}{1 - a\cos\omega}$$.
- *숫자로:* $$a = 0.5$$이면 $$X(e^{j0}) = 2$$, $$X(e^{j\pi}) = \frac23$$. 위상은 $$\cos\omega = a$$인 $$\omega = \frac\pi3$$에서 가장 커서 $$\tan^{-1}\frac{a}{\sqrt{1 - a^2}} = 30°$$다. $$a = -0.5$$이면 $$X(e^{j0}) = \frac23$$, $$X(e^{j\pi}) = 2$$로 뒤바뀐다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/58_dt-fourier-transform_fig2.svg" alt="그림" width="698" height="448" loading="lazy">

위 줄 $$a = 0.5$$는 부드럽게 줄어드는 수열이라 크기가 $$\omega = 0$$ 근처(느린 진동)에 몰려 있다. 아래 줄 $$a = -0.5$$는 한 샘플마다 부호가 바뀌는 수열이라 크기가 $$\omega = \pm\pi$$ 근처(가장 빠른 진동)에 몰린다. 두 곡선 모두 $$2\pi$$마다 되풀이된다[^s1].

**예 2.** $$x[n] = a^{\vert n\vert }$$, $$\lvert a\rvert < 1$$

- *양쪽으로 나누기:* $$X = \sum_{n=0}^{\infty}a^ne^{-j\omega n} + \sum_{n=-\infty}^{-1}a^{-n}e^{-j\omega n}$$.
- *뒤쪽 합의 변수 바꾸기:* $$m = -n$$으로 두면 $$\sum_{m=1}^{\infty}(ae^{j\omega})^m = \frac{ae^{j\omega}}{1 - ae^{j\omega}}$$.
- *통분:* $$\frac{1}{1 - ae^{-j\omega}} + \frac{ae^{j\omega}}{1 - ae^{j\omega}}$$의 분자는 $$1 - ae^{j\omega} + ae^{j\omega} - a^2 = 1 - a^2$$, 분모는 $$1 - a(e^{j\omega} + e^{-j\omega}) + a^2 = 1 - 2a\cos\omega + a^2$$.
- *결과:* $$X(e^{j\omega}) = \dfrac{1 - a^2}{1 - 2a\cos\omega + a^2}$$. 실수이고 짝인 수열이라 스펙트럼도 실수이고 짝이다. $$a = 0.5$$이면 $$\omega = 0$$에서 3, $$\omega = \pi$$에서 $$\frac13$$.

**예 3.** 사각 펄스 $$x[n] = 1$$ ($$\lvert n\rvert \le N_1$$), 그 밖 0

- *0부터 세게 바꾸기:* $$m = n + N_1$$로 두면 $$X = e^{j\omega N_1}\sum_{m=0}^{2N_1}e^{-j\omega m}$$.
- *등비수열 합:* $$= e^{j\omega N_1}\dfrac{1 - e^{-j\omega(2N_1 + 1)}}{1 - e^{-j\omega}}$$.
- *반각 지수 빼내기:* 분자에서 $$e^{-j\omega(N_1 + \frac12)}$$, 분모에서 $$e^{-j\omega/2}$$를 묶어 내면 남는 괄호가 각각 $$2j\sin\omega(N_1 + \frac12)$$, $$2j\sin\frac\omega2$$다. 앞에 붙은 지수는 서로 지워진다.
- *결과:* $$X(e^{j\omega}) = \dfrac{\sin\omega(N_1 + \frac12)}{\sin(\omega/2)}$$. $$\omega = 0$$에서는 모든 항이 1이라 $$2N_1 + 1$$이다. 처음 0이 되는 곳은 $$\omega = \frac{2\pi}{2N_1 + 1}$$이다. $$N_1 = 2$$이면 위의 표와 같다.

**경계 사례.** $$\lvert a\rvert \ge 1$$이면 예 1의 합이 수렴하지 않는다. $$a = 1$$($$x[n] = u[n]$$)이면 $$\omega = 0$$에서 부분합이 항의 개수만큼 끝없이 커진다. $$a = -1$$이면 $$\omega = 0$$의 부분합이 0과 1 사이를 오가며 한 값에 머물지 않는다. 이런 수열은 보통 함수로는 변환이 없고, 임펄스를 허용해야 다룰 수 있다([이산 주기 신호의 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-periodic-fourier-transform/))[^s3].

## 이산 푸리에 변환(DFT)과의 차이

책에 따라 이 변환을 그냥 "이산 푸리에 변환"이라 부르기도 해서 헷갈린다[^s4]. 보통 DFT라 하면 길이 $$N$$짜리 수열을 $$N$$개 숫자로 바꾸는 계산을 뜻한다([이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)).

| | 이산 시간 푸리에 변환 (DTFT) | 이산 푸리에 변환 (DFT) |
|---|---|---|
| 넣는 것 | 정수 시각 전체의 수열. 무한히 길어도 된다 | 길이 $$N$$인 수열, 숫자 $$N$$개 |
| 나오는 것 | $$\omega$$에 대한 이어진 함수, 주기 $$2\pi$$ | $$k = 0, \dots, N-1$$의 숫자 $$N$$개 |
| 식 | $$\sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n}$$ | $$X[k] = \sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}$$ |
| 컴퓨터 계산 | 닫힌 식이 없으면 곡선 전체를 정확히 구할 수 없다 | FFT로 정확히 계산한다 |

둘을 잇는 식: $$x[n]$$이 $$0 \le n \le N-1$$ 밖에서 0이면 $$X[k] = X(e^{j2\pi k/N})$$이다. DFT는 DTFT 곡선을 $$2\pi/N$$ 간격으로 찍은 값이다. 또 $$X[k]$$는 그 수열을 주기 $$N$$으로 늘인 수열의 급수 계수 $$a_k$$에 $$N$$을 곱한 값과 같다. 예: $$x = (1, 2, 3, 4)$$의 DFT $$X[1] = -2 + 2j$$는 DTFT를 $$\omega = \frac\pi2$$에서 찍은 값이다. 끝에 0을 붙여 길이 8로 만들면 같은 곡선을 $$\frac\pi4$$ 간격으로 더 촘촘히 찍는다[^s3].

## 활용

- **디지털 필터의 주파수 응답.** 필터가 임펄스에 내놓는 반응 $$h[n]$$의 DTFT $$H(e^{j\omega})$$는 각 주파수를 몇 배로 키우고 줄이는지 알려 준다. 예: 5점 이동 평균 $$h[n] = \frac15$$($$\lvert n\rvert \le 2$$)는 예 3을 5로 나눈 것이라 $$H(e^{j0}) = 1$$(평균값은 그대로), $$H(e^{j2\pi/5}) = 0$$이다. 그래서 5샘플마다 되풀이되는 진동 $$\cos\frac{2\pi n}{5}$$를 완전히 지운다[^s3].
- **컴퓨터의 스펙트럼 계산.** 컴퓨터는 FFT로 DFT를 구해 DTFT 곡선의 점들을 얻는다. 0을 덧붙여 길이를 늘리면 점이 촘촘해질 뿐, 곡선 자체가 바뀌지는 않는다.
- **주파수 단위 바꾸기.** 1초에 $$f_s$$번 잰 소리에서 $$\omega = 2\pi f/f_s$$다. $$\omega = \pi$$는 $$f = f_s/2$$이고, CD 음질($$f_s = 44.1$$ kHz)이면 22.05 kHz다. 왜 이 위로는 표현할 수 없는지는 [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)가 설명한다[^s3].
- 흔한 실수: $$\omega$$를 Hz로 읽는 것, $$\pi$$보다 큰 $$\omega$$를 더 높은 주파수로 읽는 것, 이 변환과 DFT를 같은 것으로 보는 것.

## 연결

- 선수: [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/) (유도의 출발점), [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/) (같은 유도의 연속판), [이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/) ($$\omega$$와 $$\omega + 2\pi$$가 같은 수열인 이유)
- 다음: [이산 주기 신호의 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-periodic-fourier-transform/), [푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/)
- 헷갈리는 개념: [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/). 둘을 상황별로 가르는 연습은 [이산 시간 푸리에 변환과 이산 푸리에 변환 비교](/Hongs_Blog/studies/human-interface-media/dtft-vs-dft/)에 있다.
- 대칭: [실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/) (예 2의 실수·짝 스펙트럼)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\omega$$가 클수록 더 빠른 진동이다"</div>

틀렸다. 연속 시간에서는 주파수가 클수록 빠르니 그럴듯하다. 수열은 정수 시각에서만 값을 가지므로 $$\omega$$와 $$\omega + 2\pi$$가 똑같은 수열을 만든다. 수열이 낼 수 있는 가장 빠른 진동은 $$\omega = \pi$$인 $$(-1)^n$$이다. 확인: $$\omega = 2\pi$$를 넣으면 $$e^{j2\pi n} = 1$$로 전혀 흔들리지 않는다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이산 시간 푸리에 변환과 이산 푸리에 변환(DFT)은 같은 것이다"</div>

틀렸다. 둘 다 이산 수열을 다루고 이름도 비슷해서 그럴듯하다. 이산 시간 푸리에 변환은 $$\omega$$에 대한 이어진 함수이고, DFT는 길이 $$N$$짜리 수열을 넣어 숫자 $$N$$개를 얻는 계산이다. 확인: $$x = (1, 2, 3, 4)$$의 DFT는 숫자 4개지만, DTFT는 $$1 + 2e^{-j\omega} + 3e^{-j2\omega} + 4e^{-j3\omega}$$라는 곡선이다. DFT 4개는 이 곡선을 $$\omega = 0, \frac\pi2, \pi, \frac{3\pi}{2}$$에서 찍은 값이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 이산 시간 푸리에 변환의 분석식과 합성식을 쓰라. 합성식의 적분 구간은 어디인가?</summary>


**답:** $$X(e^{j\omega}) = \sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n}$$, $$x[n] = \frac{1}{2\pi}\int_{2\pi}X(e^{j\omega})e^{j\omega n}d\omega$$. 적분은 길이 $$2\pi$$인 아무 구간 하나다.<br>
**흔한 오답:** 연속 시간처럼 $$-\infty$$부터 $$\infty$$까지 적분하는 것. $$X$$가 주기 $$2\pi$$라 무한 구간 적분은 한 값으로 모이지 않는다. 한 주기에 정보가 다 있으므로 한 주기만 적분한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$X(e^{j\omega})$$가 반드시 주기 $$2\pi$$인 함수인 이유를 쓰라. 연속 시간 푸리에 변환 $$X(j\omega)$$는 왜 그렇지 않은가?</summary>


**답:** 수열은 정수 시각 $$n$$에서만 값이 있어서 $$e^{-j(\omega + 2\pi)n} = e^{-j\omega n}$$이다. 변환식의 모든 항이 $$\omega$$와 $$\omega + 2\pi$$에서 같으므로 합도 같다. 연속 시간에서는 $$t$$가 실수라 $$e^{-j2\pi t} \ne 1$$이고, 주파수를 올리면 정말로 다른 신호가 된다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> $$x[n] = (0.5)^n u[n]$$에 대해 $$X(e^{j0})$$와 $$X(e^{j\pi})$$를 구하고, 이 수열이 낮은 주파수와 높은 주파수 중 어느 쪽에 더 많이 들어 있는지 말하라.</summary>


**답:** $$X(e^{j\omega}) = \frac{1}{1 - 0.5e^{-j\omega}}$$이므로 $$X(e^{j0}) = \frac{1}{0.5} = 2$$, $$X(e^{j\pi}) = \frac{1}{1.5} = \frac23$$. 크기가 $$\omega = 0$$ 쪽에서 더 크므로 낮은 주파수에 더 많다.<br>
**이유:** 부호가 바뀌지 않고 부드럽게 줄어드는 수열이라 느린 변화가 주를 이룬다. $$a = -0.5$$로 바꾸면 값이 뒤바뀐다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 1024개 샘플에 FFT를 돌려 얻은 숫자 1024개는 이산 시간 푸리에 변환인가, 이산 푸리에 변환인가? 다른 쪽과는 어떤 관계인가?</summary>


**답:** 이산 푸리에 변환(DFT)이다. 그 1024개 샘플 바깥을 0으로 둔 수열의 이산 시간 푸리에 변환을 $$\omega = \frac{2\pi k}{1024}$$($$k = 0, \dots, 1023$$)에서 찍은 값과 같다.<br>
**흔한 오답:** "FFT가 이산 시간 푸리에 변환을 계산한다". FFT는 곡선 위의 점 $$N$$개만 계산한다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 급수에서 변환을 유도할 때 주기 $$N$$을 $$N \ge N_1 + N_2 + 1$$로 잡아야 하는 이유는? 이 조건이 깨지면 무엇이 달라지는가?</summary>


**답:** 한 주기 안에서 $$\tilde x[n] = x[n]$$이어야 급수 계수를 원래 수열 $$x$$로 쓰고 $$N \to \infty$$에서 $$\tilde x \to x$$라고 말할 수 있다. 수열이 $$N_1 + N_2 + 1$$칸을 차지하므로 주기가 그보다 짧으면 복사본끼리 겹쳐 값이 더해진다. 예: 다섯 개의 1을 $$N = 4$$로 늘리면 한 주기가 $$1, 1, 2, 1$$이 된다.

</details>

[^s1]: [58_dt-fourier-transform_plot.py](/Hongs_Blog/studies/human-interface-media/code/58_dt-fourier-transform_plot/)로 그렸고, 같은 코드로 $$Na_k$$가 곡선 값과 같음($$N = 10, 20$$), $$a = \pm0.5$$의 $$\omega = 0, \pi$$ 값 $$2$$와 $$\frac23$$, 주기 $$2\pi$$를 확인했다.
[^s2]: 존재 조건(절대 합 가능, 에너지 유한)과 파스발 관계 $$\sum\lvert x\rvert^2 = \frac{1}{2\pi}\int_{2\pi}\lvert X\rvert^2d\omega$$는 표준 교재(Oppenheim·Willsky, *Signals and Systems* 2판 5장)의 내용이다.
[^s3]: 모두 검증 코드로 확인했다.
[^s4]: 신호 처리 교재(Oppenheim·Willsky)는 이 변환을 이산 시간 푸리에 변환이라 하고, 이산 푸리에 변환(DFT)은 길이 $$N$$짜리 유한 수열의 변환을 가리킨다. 이 문서는 교재의 이름을 따랐다.
{% endraw %}
