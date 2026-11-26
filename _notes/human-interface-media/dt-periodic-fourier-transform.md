---
layout: "note"
title: "이산 주기 신호의 푸리에 변환"
display_title: "이산 주기 신호의 푸리에 변환 (Fourier Transform of Discrete-Time Periodic Signals)"
kind: "concept"
kind_label: "정리"
num: "59"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Fourier Transform of Discrete-Time Periodic Signals", "이산 주기 수열의 스펙트럼", "주기 임펄스 열", "Periodic Impulse Train", "디리클레 커널", "Dirichlet Kernel"]
description: "끝없이 되풀이되는 수열은 값이 줄어들지 않아서, 이산 시간 푸리에 변환의 합이 수렴하지 않는다. 그런데 이런 수열은 몇 개 주파수만 가지고 있으므로, 그 자리마다 폭은 0이고 넓이만 있는 바늘(임펄스)을 세워 스펙트럼을 나타낸다. 바늘의 넓이는 이산 시간 푸리에 급수 계수의 2\\p…"
prev_url: "/studies/human-interface-media/dt-fourier-transform/"
prev_title: "이산 시간 푸리에 변환"
next_url: "/studies/human-interface-media/four-fourier-representations/"
next_title: "푸리에 표현 네 가지 비교"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "59_dt-periodic-fourier-transform_plot.py", "u": "/studies/human-interface-media/code/59_dt-periodic-fourier-transform_plot/", "r": "그림 생성"}, {"t": "59_dt-periodic-fourier-transform_verify.py", "u": "/studies/human-interface-media/code/59_dt-periodic-fourier-transform_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/dt-periodic-fourier-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

끝없이 되풀이되는 수열은 값이 줄어들지 않아서, 이산 시간 푸리에 변환의 합이 수렴하지 않는다. 그런데 이런 수열은 몇 개 주파수만 가지고 있으므로, 그 자리마다 폭은 0이고 넓이만 있는 바늘(임펄스)을 세워 스펙트럼을 나타낸다. 바늘의 넓이는 이산 시간 푸리에 급수 계수의 $$2\pi$$배이고, 이산 수열이라서 이 바늘 묶음이 주파수 축에서 $$2\pi$$마다 똑같이 되풀이된다.

</div>


## 예시로 보기

모든 시각에서 1인 수열 $$x[n] = 1$$을 [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/)의 식에 넣으면 $$\sum_n e^{-j\omega n}$$이다. $$\omega = 0$$에서는 1을 끝없이 더하니 무한대이고, 다른 $$\omega$$에서도 합이 한 값으로 모이지 않는다. 보통의 함수로는 이 수열의 스펙트럼을 쓸 수 없다.

대신 $$\lvert n\rvert \le M$$만 남기고 잘라 본다. 잘린 수열은 1이 $$2M+1$$개인 사각 펄스라서 변환이 $$\frac{\sin\omega(M + \frac12)}{\sin(\omega/2)}$$다. $$M$$을 키우면 이렇게 된다[^s1].

- $$\omega = 0$$의 봉우리 높이 $$2M+1$$이 끝없이 커진다($$M = 2, 5, 20$$이면 5, 11, 41).
- 봉우리 폭(처음 0이 되는 곳 $$\frac{2\pi}{2M+1}$$)은 0으로 좁아진다.
- 그런데 한 주기 $$-\pi \le \omega < \pi$$의 넓이는 $$M$$과 상관없이 늘 $$2\pi$$다. 넓이를 구하면 $$\int_{-\pi}^{\pi}\sum_n e^{-j\omega n}d\omega$$에서 $$n = 0$$인 항만 $$2\pi$$를 남기고 나머지는 한 바퀴씩 돌아 0이 되기 때문이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/59_dt-periodic-fourier-transform_fig1.svg" alt="그림" width="698" height="247" loading="lazy">

왼쪽에서 오른쪽으로 갈수록 $$M$$이 커진다. 세로 눈금이 5, 11, 41로 커지고 가운데 봉우리는 좁아지지만, 세 곡선 아래의 넓이는 모두 $$2\pi$$다[^s2].

넓이는 그대로인 채 폭이 0으로 가는 극한이 임펄스다. [단위 임펄스](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/) $$\delta(\omega)$$는 폭이 0이고 넓이가 1인 바늘이다. 그래서 $$x[n] = 1$$의 변환은 $$\omega = 0$$에 넓이 $$2\pi$$인 임펄스 $$2\pi\delta(\omega)$$이고, 이것이 $$2\pi$$마다 되풀이된다.

## 정의

주파수가 $$\omega_0$$인 복소 지수 수열 $$e^{j\omega_0 n}$$은 $$\omega_0$$ 자리와, 거기서 $$2\pi$$씩 떨어진 모든 자리에 넓이 $$2\pi$$인 임펄스를 가진다. 주기 $$N$$인 수열은 [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/)로 이런 복소 지수 $$N$$개의 합이 되므로, $$\frac{2\pi k}{N}$$ 자리마다 넓이 $$2\pi a_k$$인 임펄스를 세우면 된다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">기호로 쓰면</div>

$$e^{j\omega_0 n} \overset{\mathcal{F}}{\longleftrightarrow} \sum_{l=-\infty}^{\infty}2\pi\,\delta(\omega - \omega_0 - 2\pi l)$$

$$x[n] = \sum_{k=\langle N\rangle}a_ke^{jk(2\pi/N)n} \overset{\mathcal{F}}{\longleftrightarrow} X(e^{j\omega}) = \sum_{k=-\infty}^{\infty}2\pi a_k\,\delta\!\left(\omega - \frac{2\pi k}{N}\right)$$

$$\delta(\omega)$$는 주파수 축의 단위 임펄스, $$a_k$$는 주기 $$N$$인 수열의 이산 시간 푸리에 급수 계수다. $$a_k$$는 $$k$$에 대해 주기 $$N$$이다($$a_{k+N} = a_k$$).

</div>


**왜 $$2\pi$$마다 되풀이되나.** 이산 시간 푸리에 변환은 늘 주기 $$2\pi$$다. 또 $$e^{j(\omega_0 + 2\pi l)n} = e^{j\omega_0 n}$$이라, $$\omega_0 + 2\pi l$$ 자리의 임펄스들은 모두 같은 수열을 나타낸다.

**역변환으로 확인.** 길이 $$2\pi$$인 한 구간에는 $$\omega_0 + 2\pi r$$ 꼴의 임펄스가 하나만 들어간다. 그래서 $$\frac{1}{2\pi}\int_{2\pi}\sum_l 2\pi\delta(\omega - \omega_0 - 2\pi l)e^{j\omega n}d\omega = e^{j(\omega_0 + 2\pi r)n} = e^{j\omega_0 n}$$이다.

**두 번째 식이 나오는 과정.** 첫 번째 식을 $$a_ke^{jk(2\pi/N)n}$$마다 쓰고 더하면 $$\sum_{k=\langle N\rangle}\sum_l 2\pi a_k\delta\!\left(\omega - \frac{2\pi k}{N} - 2\pi l\right)$$이다. $$\frac{2\pi k}{N} + 2\pi l = \frac{2\pi(k + lN)}{N}$$이고 $$a_{k+lN} = a_k$$이므로, $$k' = k + lN$$으로 묶으면 $$k'$$가 모든 정수를 한 번씩 지나는 합 $$\sum_{k'}2\pi a_{k'}\delta\!\left(\omega - \frac{2\pi k'}{N}\right)$$가 된다[^s3].


연속 시간의 [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/)과 나란히 놓으면 차이는 되풀이 여부 하나다.

| | 연속 시간 주기 신호 (주기 $$T$$) | 이산 시간 주기 수열 (주기 $$N$$) |
|---|---|---|
| 변환 | $$\sum_k 2\pi a_k\delta(\omega - k\omega_0)$$, $$\omega_0 = \frac{2\pi}{T}$$ | $$\sum_k 2\pi a_k\delta(\omega - \frac{2\pi k}{N})$$ |
| 계수 $$a_k$$ | $$k$$마다 다를 수 있다 | $$N$$칸마다 되풀이된다 |
| 스펙트럼 | 되풀이되지 않는다 | $$2\pi$$마다 되풀이된다 |

## 예제

**예 1.** $$x[n] = \cos\frac{2\pi n}{5}$$

- *복소 지수로 풀기:* $$\cos\omega_0 n = \frac12e^{j\omega_0 n} + \frac12e^{-j\omega_0 n}$$, $$\omega_0 = \frac{2\pi}{5}$$.
- *계수 읽기:* 주기 $$N = 5$$이고 $$a_1 = a_{-1} = \frac12$$, 한 주기의 나머지 계수는 0이다. 주기 5로 되풀이되므로 $$a_4 = a_{-1} = \frac12$$이기도 하다.
- *임펄스 세우기:* $$X(e^{j\omega}) = \sum_l\pi\delta\!\left(\omega - \frac{2\pi}{5} - 2\pi l\right) + \sum_l\pi\delta\!\left(\omega + \frac{2\pi}{5} - 2\pi l\right)$$.
- *한 주기만 보면:* $$-\pi \le \omega < \pi$$에서 $$X(e^{j\omega}) = \pi\delta\!\left(\omega - \frac{2\pi}{5}\right) + \pi\delta\!\left(\omega + \frac{2\pi}{5}\right)$$. 그 바깥, 예를 들어 $$\omega = 2\pi - \frac{2\pi}{5} = \frac{8\pi}{5}$$에도 넓이 $$\pi$$인 임펄스가 있다($$k = 4$$).

**예 2.** 주기 $$N$$ 임펄스 열 $$x[n] = \sum_{k=-\infty}^{\infty}\delta[n - kN]$$

- *계수:* 한 주기 $$0 \le n \le N-1$$에서 $$x[0] = 1$$이고 나머지는 0이라 $$a_k = \frac1N\sum_{n=0}^{N-1}x[n]e^{-jk(2\pi/N)n} = \frac1N$$이다. 모든 $$k$$에서 같다.
- *변환:* $$X(e^{j\omega}) = \frac{2\pi}{N}\sum_{k=-\infty}^{\infty}\delta\!\left(\omega - \frac{2\pi k}{N}\right)$$.
- *읽기:* 시간에서 $$N$$칸 간격의 바늘 열이 주파수에서 $$\frac{2\pi}{N}$$ 간격, 넓이 $$\frac{2\pi}{N}$$인 바늘 열이 된다. $$N = 4$$이면 간격과 넓이가 모두 $$\frac\pi2$$다. 시간 간격 $$N$$을 키우면 주파수 간격은 좁아진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/59_dt-periodic-fourier-transform_fig2.svg" alt="그림" width="698" height="458" loading="lazy">

위 줄은 예 1이다. 왼쪽 수열은 5칸마다 되풀이되고, 오른쪽에는 $$\pm\frac{2\pi}{5}$$에 넓이 $$\pi$$인 화살표 둘이 서고 그 쌍이 $$2\pi$$마다 되풀이된다. 아래 줄은 예 2의 $$N = 4$$다. 4칸 간격의 바늘이 주파수에서 $$\frac\pi2$$ 간격의 바늘로 바뀐다. 회색 칸이 한 주기 $$-\pi \le \omega < \pi$$다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 잘린 1 수열의 변환이 $$M = 2, 5, 20, 100$$에서 한 주기 넓이 $$2\pi$$, 잘린 $$\cos\frac{2\pi n}{5}$$($$M = 2000$$)의 넓이가 $$\pm\frac{2\pi}{5} + 2\pi l$$ 근처에 $$\pi$$로 몰림, 임펄스 표현을 역변환해 $$e^{j\omega_0 n}$$·$$\cos\frac{2\pi n}{5}$$·임펄스 열·카드 C1의 수열 복원, $$a_k = \frac1N$$, $$e^{jn}$$은 정확히 되풀이되지 않음 (실험으로 확인됨) — [59_dt-periodic-fourier-transform_verify.py](/Hongs_Blog/studies/human-interface-media/code/59_dt-periodic-fourier-transform_verify/)</div>

</div>


**주의할 경우.** 위 첫 번째 식은 $$\omega_0$$가 무엇이든 맞는다. 하지만 $$e^{j\omega_0 n}$$이 실제로 되풀이되는 수열인 것은 $$\frac{\omega_0}{2\pi}$$가 분수(유리수)일 때뿐이다([이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)). 예: $$e^{jn}$$($$\omega_0 = 1$$)은 어떤 $$N$$에서도 정확히 되풀이되지 않는다. $$N = 710$$에서 가장 가깝게 돌아오지만 차이가 약 $$6 \times 10^{-5}$$ 남는다. 이런 수열도 변환은 임펄스 하나(와 $$2\pi$$마다의 복사본)이지만, 두 번째 식의 "주기 $$N$$" 꼴로는 쓸 수 없다[^s3].

## 활용

- 디지털 신호 발생기가 내는 주기 파형처럼 되풀이되는 수열의 스펙트럼은 선 몇 개로 나타난다. 한 주기 $$N$$개 값을 DFT하면 바로 $$Na_k$$가 나오므로, 선의 넓이 $$2\pi a_k$$를 곧장 얻는다 → [푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/)
- 주기 임펄스 열과 그 변환은 표본화를 계산하는 기본 도구다. 연속 시간판(시간 간격 $$T$$ ↔ 주파수 간격 $$\frac{2\pi}{T}$$)은 [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/)에 있고, 표본화에서의 쓰임은 [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)에 있다. 이산판은 수열에서 $$N$$칸마다 값 하나만 남기고 나머지를 0으로 바꿀 때(이산 시간 표본화) 스펙트럼이 $$\frac{2\pi}{N}$$ 간격으로 복사되는 이유를 설명한다[^s4].
- 흔한 실수: 임펄스 넓이를 $$a_k$$로 쓰고 $$2\pi$$를 빼먹는 것, $$-\pi \sim \pi$$ 한 주기만 그리고 되풀이를 잊는 것.

## 연결

- 선수: [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/), [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/)
- 연속 시간 짝: [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/)
- 다음: [푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> $$x[n] = 1 + \cos\frac{\pi n}{2}$$의 푸리에 변환을 $$-\pi \le \omega < \pi$$ 구간에서 쓰고, 그 바깥은 어떻게 되는지 말하라.</summary>


**답:** 주기 $$N = 4$$이고 $$a_0 = 1$$, $$a_{\pm1} = \frac12$$다. 그래서 $$-\pi \le \omega < \pi$$에서 $$X(e^{j\omega}) = 2\pi\delta(\omega) + \pi\delta\!\left(\omega - \frac\pi2\right) + \pi\delta\!\left(\omega + \frac\pi2\right)$$이고, 이 세 임펄스가 $$2\pi$$마다 되풀이된다.<br>
**흔한 오답:** 상수 1의 넓이를 1이나 $$\pi$$로 쓰는 것. 계수 $$a_0 = 1$$에 $$2\pi$$를 곱해 $$2\pi$$다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 연속 시간 주기 신호의 스펙트럼은 되풀이되지 않는데, 이산 시간 주기 수열의 스펙트럼은 $$2\pi$$마다 되풀이되는 이유를 쓰라.</summary>


**답:** 이산 수열은 정수 시각에서만 값이 있어서 $$e^{j(\omega + 2\pi)n} = e^{j\omega n}$$이다. 그래서 $$\omega$$ 자리의 성분과 $$\omega + 2\pi$$ 자리의 성분은 같은 수열이고, 변환은 늘 주기 $$2\pi$$다. 연속 시간에서는 $$t$$가 실수라 $$e^{j2\pi t} \ne 1$$이고, $$\omega$$를 올리면 정말로 다른 신호가 된다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 어떤 수열의 스펙트럼이 $$\frac\pi2$$ 간격으로 선 넓이 $$\frac\pi2$$인 임펄스들뿐이다. 이 수열을 시간 축에 그려라(어떤 수열인가?).</summary>


**답:** 넓이 $$2\pi a_k = \frac\pi2$$에서 $$a_k = \frac14$$이고, 간격 $$\frac{2\pi}{N} = \frac\pi2$$에서 $$N = 4$$다. 모든 $$k$$에서 $$a_k = \frac14$$인 주기 4 수열은 4칸마다 1이고 나머지는 0인 임펄스 열 $$\sum_k\delta[n - 4k]$$다.

</details>

[^s1]: 잘린 수열의 변환은 [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/) 예 3의 식이고, 넓이 $$2\pi$$는 검증 코드의 수치 적분으로 확인했다.
[^s2]: [59_dt-periodic-fourier-transform_plot.py](/Hongs_Blog/studies/human-interface-media/code/59_dt-periodic-fourier-transform_plot/)로 그렸고, 같은 코드로 봉우리 5, 11, 41과 넓이 $$2\pi$$, 임펄스 넓이 $$\pi$$와 $$\frac\pi2$$를 확인했다.
[^s3]: 수치는 검증 코드로 확인했다.
[^s4]: 이산 시간 표본화에서 스펙트럼이 $$\frac{2\pi}{N}$$ 간격으로 복사되는 것은 디지털 신호 처리 교재(Oppenheim·Schafer, *Discrete-Time Signal Processing*)의 표준 내용이다.
{% endraw %}
