---
layout: "note"
title: "컨벌루션 합"
display_title: "컨벌루션 합 (Convolution Sum)"
kind: "concept"
kind_label: "알고리즘"
num: "18"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Convolution Sum", "컨볼루션 합", "합성곱", "이산 시간 LTI 시스템", "Discrete-Time LTI System", "단위 임펄스 응답", "Unit Impulse Response", "임펄스 응답", "Impulse Response", "중첩 합", "Superposition Sum", "LTI"]
description: "선형이고 시불변인 시스템(LTI)은 \"입력 한 방울에 어떻게 반응하는가\" 하나만 알면 모든 입력의 출력을 계산할 수 있다. 입력을 시각마다의 바늘(임펄스) 여러 개로 쪼개면, 각 바늘의 반응은 그 한 방울 반응을 그 시각으로 옮기고 바늘 높이만큼 키운 것이다. 이 반응들을 모두 더…"
prev_url: "/studies/signals-and-systems/linearity/"
prev_title: "선형성"
next_url: "/studies/signals-and-systems/convolution-integral/"
next_title: "컨벌루션 적분"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/convolution-sum/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

선형이고 시불변인 시스템(LTI)은 "입력 한 방울에 어떻게 반응하는가" 하나만 알면 모든 입력의 출력을 계산할 수 있다. 입력을 시각마다의 바늘(임펄스) 여러 개로 쪼개면, 각 바늘의 반응은 그 한 방울 반응을 그 시각으로 옮기고 바늘 높이만큼 키운 것이다. 이 반응들을 모두 더한 것이 컨벌루션 합이다. 산에서 소리를 지르면 메아리가 겹쳐 들리는 것과 같다. 단, 시스템이 선형이 아니거나 시간에 따라 바뀌면 이 계산은 틀린다.

</div>


## 예시로 보기

어떤 시스템에 $$n = 0$$에서만 1인 입력 $$\delta[n]$$을 넣었더니 $$h[n] = 1, 1, 1$$($$n = 0, 1, 2$$)이 나왔다. 이제 입력 $$x[0] = 0.5$$, $$x[1] = 2$$를 넣으면 출력은 무엇일까(예제 2.1)[^1]?

1. 입력을 쪼갠다: $$x[n] = 0.5\,\delta[n] + 2\,\delta[n-1]$$.
2. 조각마다 반응을 구한다. 시불변이므로 $$\delta[n-1]$$의 반응은 $$h[n-1]$$이고, 선형이므로 크기를 곱한다: $$0.5\,h[n]$$과 $$2\,h[n-1]$$.
3. 더한다(선형).

| $$n$$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $$0.5\,h[n]$$ | 0.5 | 0.5 | 0.5 | 0 | 0 |
| $$2\,h[n-1]$$ | 0 | 2 | 2 | 2 | 0 |
| $$y[n]$$ | 0.5 | 2.5 | 2.5 | 2 | 0 |

여기서 $$h[n]$$을 단위 임펄스 응답이라 부른다. 시스템에 $$\delta[n]$$을 넣었을 때의 출력이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/18_convolution-sum_fig1.svg" alt="그림" loading="lazy">

위 두 줄이 입력 조각 각각의 메아리이고, 맨 아래가 그 합이다. 같은 $$n$$의 막대 높이를 더하면 아래 줄이 된다[^s2].

## 정의

**1단계: 신호를 임펄스로 쪼개기.** 어떤 이산 신호든 옮긴 임펄스들의 가중합이다[^2]. 가중치는 그 시각의 신호 값이다.

$$x[n] = \cdots + x[-1]\delta[n+1] + x[0]\delta[n] + x[1]\delta[n-1] + \cdots = \sum_{k=-\infty}^{\infty}x[k]\,\delta[n-k]$$


**2단계: 선형이면.** $$\delta[n-k]$$의 출력을 $$h_k[n]$$이라 하면 $$y[n] = \sum_k x[k]h_k[n]$$이다(그림 2.2)[^3].

**3단계: 시불변이기까지 하면.** 옮긴 임펄스의 응답은 처음 응답을 옮긴 것이다: $$h_k[n] = h[n-k]$$. 그래서 $$h[n]$$ 하나만 있으면 된다[^4].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">컨벌루션 합</div>

단위 임펄스 응답이 $$h[n]$$인 이산 시간 LTI 시스템의 출력은

$$y[n] = \sum_{k=-\infty}^{\infty}x[k]\,h[n-k] = x[n] * h[n]$$

이다. $$*$$는 컨벌루션을 뜻한다[^4].

</div>


기호 읽기[^5]

- $$n$$: 지금 보고 싶은 출력의 시각.
- $$k$$: 입력이 들어온 시각. 합을 내려고 축을 쭉 훑는 임시 변수다.
- $$x[k]h[n-k]$$: 시각 $$k$$에 들어온 입력이 $$n - k$$칸 뒤인 지금 남긴 메아리.

**계산 방법(그림 2.4)**[^6]

1. $$h[k]$$를 $$k$$축에서 뒤집는다: $$h[-k]$$.
2. $$n$$만큼 오른쪽으로 민다: $$h[n-k]$$.
3. $$x[k]$$와 $$h[n-k]$$를 같은 $$k$$끼리 곱해 모두 더하면 $$y[n]$$.
4. $$n$$을 바꿔 가며 되풀이한다. "뒤집은 $$h$$가 $$x$$ 위를 미끄러져 지나가는 것"이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$x[n] = \sum_k x[k]\delta[n-k]$$는 왜 맞는가?</summary>

$$\delta[n-k]$$는 $$k = n$$일 때만 1이다. 그래서 합에서 $$k = n$$인 항 $$x[n] \cdot 1$$만 남는다. [표본화 성질](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/)과 같은 말이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. $$h_k[n] = h[n-k]$$는 어떤 성질에서 나오는가?</summary>

시불변성이다. 입력 $$\delta[n]$$을 $$k$$만큼 늦춘 것이 $$\delta[n-k]$$이므로 출력도 $$h[n]$$을 $$k$$만큼 늦춘 $$h[n-k]$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. $$\sum_k x[k]h[n-k]$$로 모으는 것은 어떤 성질에서 나오는가?</summary>

선형성이다. 입력이 $$x[k]$$를 가중치로 한 합이므로 출력도 같은 가중치의 합이다. 무한히 많은 항에도 중첩이 통한다고 가정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

복잡한 입력을 가장 단순한 조각(임펄스)으로 나누고, 조각 하나의 반응만 알아 둔 뒤 옮기고 키워서 더한다.

</details>


## 예제

**예제 2.3** $$x[n] = \alpha^n u[n]$$ ($$0 < \alpha < 1$$), $$h[n] = u[n]$$[^7]

- $$n < 0$$: $$h[n-k]$$가 0이 아닌 곳($$k \le n < 0$$)과 $$x[k]$$가 0이 아닌 곳($$k \ge 0$$)이 겹치지 않아 $$y[n] = 0$$.
- $$n \ge 0$$: $$0 \le k \le n$$에서만 $$x[k]h[n-k] = \alpha^k$$.
- 등비수열의 합(첫째항 1, 공비 $$\alpha$$, 항 $$n + 1$$개): $$y[n] = \sum_{k=0}^{n}\alpha^k = \dfrac{1 - \alpha^{n+1}}{1 - \alpha}$$.
- 정리하면 $$y[n] = \left(\dfrac{1 - \alpha^{n+1}}{1 - \alpha}\right)u[n]$$ (그림 2.7). $$n$$이 커지면 $$\frac{1}{1-\alpha}$$로 다가간다.

**예제 2.4** $$x[n] = 1$$ ($$0 \le n \le 4$$), $$h[n] = \alpha^n$$ ($$0 \le n \le 6$$, $$\alpha > 1$$)[^8]

$$h[n-k]$$가 미끄러지며 $$x[k]$$와 겹치는 정도에 따라 다섯 구간으로 나눈다.

| 구간 | 겹치는 $$k$$ | $$y[n]$$ |
|---|---|---|
| $$n < 0$$ | 없음 | 0 |
| $$0 \le n \le 4$$ | $$0 \le k \le n$$ ($$n + 1$$개) | $$\dfrac{1 - \alpha^{n+1}}{1 - \alpha}$$ |
| $$4 < n \le 6$$ | $$0 \le k \le 4$$ (늘 5개) | $$\dfrac{\alpha^{n-4} - \alpha^{n+1}}{1 - \alpha}$$ |
| $$6 < n \le 10$$ | $$n - 6 \le k \le 4$$ | $$\dfrac{\alpha^{n-4} - \alpha^{7}}{1 - \alpha}$$ |
| $$n > 10$$ | 없음 | 0 |

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/18_convolution-sum_fig2.svg" alt="그림" loading="lazy">

$$\alpha = 1.2$$로 계산한 예다. 뒤집힌 $$h[n-k]$$가 오른쪽으로 미끄러지며 $$x[k]$$와 겹치는 칸(색칠)이 늘었다가 줄어든다. 맨 아래에서 동그라미 친 $$y[2]$$, $$y[5]$$, $$y[8]$$이 위 세 줄의 겹친 곱을 더한 값이다[^s2].

**예제 2.5** $$x[n] = 2^n u[-n]$$, $$h[n] = u[n]$$[^9]

- $$n \ge 0$$: $$k \le 0$$ 전체가 겹친다. $$\sum_{k=-\infty}^{0}2^k = \sum_{r=0}^{\infty}(\tfrac12)^r = 2$$.
- $$n < 0$$: $$k \le n$$만 겹친다. $$\sum_{k=-\infty}^{n}2^k = 2^n \cdot 2 = 2^{n+1}$$.

**실행 추적** 예제 2.1을 그림 2.4 방식($$h$$를 뒤집어 밀기)으로 계산하면[^10]

| $$n$$ | 겹치는 항 | $$y[n]$$ |
|---|---|---|
| $$-1$$ | 없음 | 0 |
| 0 | $$x[0]h[0]$$ | 0.5 |
| 1 | $$x[0]h[1] + x[1]h[0]$$ | 2.5 |
| 2 | $$x[0]h[2] + x[1]h[1]$$ | 2.5 |
| 3 | $$x[1]h[2]$$ | 2 |
| 4 | 없음 | 0 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 유한 수열 컨벌루션 구현을 정의대로의 합과 무작위 200회 비교, 예제 2.1·2.3·2.4·2.5의 결과와 다섯 구간 닫힌 꼴 일치 — [18_convolution-sum_impl.py](/Hongs_Blog/studies/signals-and-systems/code/18_convolution-sum_impl/)</div>

</div>


단계별 연습: [컨벌루션 계산 예제 사다리](/Hongs_Blog/studies/signals-and-systems/convolution-ladder/)

## 활용

- **복잡도:** 길이 $$N$$, $$M$$인 두 수열을 정의대로 계산하면 곱셈이 $$NM$$번, 결과 길이는 $$N + M - 1$$이다. 길이가 비슷하면 $$O(N^2)$$이고, 4장 이후의 푸리에 변환(FFT)을 쓰면 $$O(N\log N)$$으로 줄일 수 있다[^s1].
- **실제 사용처:** 오디오의 메아리·잔향 효과, 영상의 흐림·선명하게 하기, 이동 평균. NumPy의 `numpy.convolve`, 딥러닝의 합성곱 층(CNN)이 이 계산이다. CNN은 보통 $$h$$를 뒤집지 않는 상호상관을 쓴다[^s1].
- **흔한 실수:** $$h[n-k]$$를 그릴 때 뒤집기를 빼먹고 밀기만 하는 것, 구간 경계에서 겹치는 개수를 하나 틀리는 것.

## 연결

- 선수: [단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/), [시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/), [선형성](/Hongs_Blog/studies/signals-and-systems/linearity/)
- 연속 시간 버전: [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/)
- 수학 쪽: [푸리에 변환과 합성곱](/Hongs_Blog/studies/calculus/fourier-transform/), [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"어떤 시스템이든 임펄스 응답만 알면 출력을 구할 수 있다."</div>

틀렸다. 그럴듯한 이유는 "임펄스로 쪼개서 더한다"가 너무 일반적으로 들리기 때문이다. 옮긴 임펄스의 응답이 $$h[n-k]$$인 것은 시불변일 때, 반응들을 더해도 되는 것은 선형일 때만이다. 확인: $$y[n] = x^2[n]$$은 $$h[n] = \delta[n]$$이지만, $$x = 2\delta[n]$$을 넣으면 출력은 $$4\delta[n]$$이고 컨벌루션 $$x * h = 2\delta[n]$$과 다르다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컨벌루션 합의 식을 쓰고, $$n$$과 $$k$$가 각각 무엇인지 말하라.</summary>

**답:** $$y[n] = \sum_{k=-\infty}^{\infty}x[k]h[n-k]$$. $$n$$은 출력을 보는 시각, $$k$$는 입력이 들어온 시각(합을 위한 임시 변수)이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x[n] = 1, 2, 3$$ ($$n = 0, 1, 2$$), $$h[n] = 1, -1$$ ($$n = 0, 1$$)일 때 $$y[n]$$을 모두 구하라.</summary>

**답:** $$y[0] = 1$$, $$y[1] = 2 - 1 = 1$$, $$y[2] = 3 - 2 = 1$$, $$y[3] = -3$$. 그 밖은 0.<br>
**흔한 오답:** 길이를 $$\max(3, 2)$$로 잡아 $$y[3]$$을 빠뜨리는 것. 길이는 $$3 + 2 - 1 = 4$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 코드가 하는 일을 한 문장으로 말하라. `for i,a in enumerate(xs): for j,b in enumerate(hs): ys[i+j] += a*b`</summary>

**답:** 입력의 각 값이 남기는 메아리(임펄스 응답을 그 시각으로 옮겨 그 값만큼 키운 것)를 모두 출력에 더해, 두 수열의 컨벌루션을 구한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 컨벌루션 합을 만들 때 선형성과 시불변성이 각각 어디에 쓰이는가?</summary>

**답:** 시불변성은 $$\delta[n-k]$$의 응답이 $$h[n-k]$$라는 것(옮긴 입력 → 옮긴 출력)에, 선형성은 입력의 가중합 $$\sum x[k]\delta[n-k]$$의 응답이 응답들의 가중합이라는 것에 쓰인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$x[n] = (0.5)^n u[n]$$, $$h[n] = u[n]$$일 때 $$y[3]$$은?</summary>

**답:** $$1 + 0.5 + 0.25 + 0.125 = 1.875$$. 공식으로는 $$\frac{1 - 0.5^4}{0.5} = 1.875$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/05.Week05_CH02_1_handout.pdf, p.14 (예제 2.1, 그림 2.3)
[^2]: 같은 자료, p.3~5 (그림 2.1)
[^3]: 같은 자료, p.6~10 (그림 2.2)
[^4]: 같은 자료, p.11~13
[^5]: 같은 자료, p.17
[^6]: 같은 자료, p.16 (예제 2.2, 그림 2.4)
[^7]: 같은 자료, p.18~19 (예제 2.3, 그림 2.5~2.7)
[^8]: 같은 자료, p.19~25 (예제 2.4, 그림 2.8~2.10)
[^9]: 같은 자료, p.25~26 (예제 2.5, 그림 2.11)
[^10]: 같은 자료, p.15~16
[^s1]: 에이전트 보충. 계산 복잡도와 FFT, NumPy·CNN 예, 오해 항목의 $$x^2$$ 반례, 확인 문제 C2~C5는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 2장은 원본에 없다. [18_convolution-sum_plot.py](/Hongs_Blog/studies/signals-and-systems/code/18_convolution-sum_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 예제 2.1의 0.5, 2.5, 2.5, 2와 예제 2.4($$\alpha = 1.2$$)의 다섯 구간 닫힌 꼴, 세 장면의 겹친 곱의 합.
{% endraw %}
