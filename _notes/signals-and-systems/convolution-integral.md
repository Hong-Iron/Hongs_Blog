---
layout: "note"
title: "컨벌루션 적분"
display_title: "컨벌루션 적분 (Convolution Integral)"
kind: "concept"
kind_label: "알고리즘"
num: "19"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Convolution Integral", "컨볼루션 적분", "중첩 적분", "Superposition Integral", "연속 시간 LTI 시스템", "Continuous-Time LTI System", "계단 근사", "Staircase Approximation"]
description: "컨벌루션 합의 연속 시간판이다. 매끄러운 입력을 아주 가는 막대(펄스)들로 잘라 계단 모양으로 근사하고, 막대마다의 반응을 더한 뒤, 막대 폭을 0으로 줄이면 합이 적분이 된다. 그래서 연속 시간 LTI 시스템도 임펄스 응답 h(t) 하나로 모든 출력이 정해진다. 계산은 \"h를 뒤…"
prev_url: "/studies/signals-and-systems/convolution-sum/"
prev_title: "컨벌루션 합"
next_url: "/studies/signals-and-systems/convolution-properties/"
next_title: "컨벌루션의 성질"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/convolution-integral/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컨벌루션 합의 연속 시간판이다. 매끄러운 입력을 아주 가는 막대(펄스)들로 잘라 계단 모양으로 근사하고, 막대마다의 반응을 더한 뒤, 막대 폭을 0으로 줄이면 합이 적분이 된다. 그래서 연속 시간 LTI 시스템도 임펄스 응답 $$h(t)$$ 하나로 모든 출력이 정해진다. 계산은 "$$h$$를 뒤집고 밀어서 겹친 넓이를 구하기"이며, 겹치는 모양이 바뀌는 시각마다 구간을 나눠야 한다는 점이 까다롭다.

</div>


## 예시로 보기

축전기에 전류를 흘린다고 하자. 지금 전압은 지금까지 들어온 전류를 모두 쌓은 것이다. 이 시스템의 임펄스 응답은 $$h(t) = u(t)$$(한 번 받은 전하가 계속 남는다)다. 입력 전류가 $$x(t) = e^{-at}u(t)$$ ($$a > 0$$)로 점점 약해지면 출력은 무엇일까(예제 2.6)[^1]?

- $$t < 0$$: 아직 아무것도 안 들어왔으므로 $$y(t) = 0$$.
- $$t > 0$$: 0부터 $$t$$까지 들어온 양을 모두 더한다. $$y(t) = \int_0^t e^{-a\tau}d\tau = \frac1a(1 - e^{-at})$$.
- 결과: $$y(t) = \frac1a(1 - e^{-at})u(t)$$. 처음엔 빠르게 차고, $$\frac1a$$에 다가간다(그림 2.18).

## 정의

**1단계: 계단으로 근사하기.** 폭 $$\Delta$$, 높이 $$\frac1\Delta$$인 펄스 $$\delta_\Delta(t)$$로 신호를 자른다. 각 막대의 높이는 그 시각의 신호 값이다(그림 2.12)[^2].

$$\hat x(t) = \sum_{k=-\infty}^{\infty}x(k\Delta)\,\delta_\Delta(t - k\Delta)\,\Delta$$


$$\delta_\Delta$$의 높이가 $$\frac1\Delta$$이라 마지막에 $$\Delta$$를 곱해야 막대 높이가 $$x(k\Delta)$$가 된다.

**2단계: 극한.** $$\Delta \to 0$$이면 $$\hat x(t) \to x(t)$$이고, 합은 [리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)처럼 적분이 된다[^3].

$$x(t) = \int_{-\infty}^{\infty}x(\tau)\,\delta(t - \tau)\,d\tau$$


**3단계: 시스템을 통과시키기.** 선형이면 막대마다 반응을 더하고, 시불변이면 $$\delta(t-\tau)$$의 반응은 $$h(t-\tau)$$다(그림 2.15~2.16)[^4].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">컨벌루션 적분</div>

임펄스 응답이 $$h(t)$$인 연속 시간 LTI 시스템의 출력은

$$y(t) = \int_{-\infty}^{\infty}x(\tau)\,h(t - \tau)\,d\tau = x(t) * h(t)$$

이다[^5]. $$\tau$$는 입력이 들어온 시각, $$t$$는 출력을 보는 시각이다.

</div>


**계산 방법**[^6]

1. $$h(\tau)$$를 세로축에 대해 뒤집고 $$t$$만큼 민다: $$h(t - \tau)$$.
2. $$x(\tau)$$와 곱해 $$\tau = -\infty$$부터 $$\infty$$까지 적분한다(겹친 부분의 넓이).
3. 겹침 모양이 바뀌는 $$t$$마다 구간을 나눠 적분 범위를 정한다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$\hat x(t)$$의 식에 왜 $$\Delta$$를 곱하는가?</summary>

$$\delta_\Delta$$는 넓이 1이 되도록 높이를 $$\frac1\Delta$$로 잡았다. 막대의 높이를 신호 값 $$x(k\Delta)$$로 맞추려면 $$\frac1\Delta$$를 없애야 하므로 $$\Delta$$를 곱한다. 이 $$\Delta$$가 극한에서 $$d\tau$$가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 예제 2.6에서 $$t > 0$$일 때 적분 범위가 0부터 $$t$$인 이유는?</summary>

$$x(\tau)$$는 $$\tau > 0$$에서만 0이 아니고, $$h(t - \tau) = u(t - \tau)$$는 $$\tau < t$$에서만 1이다. 둘이 함께 0이 아닌 곳이 $$0 < \tau < t$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

이산 시간에서 쓴 "쪼개고, 옮기고, 키우고, 더한다"를 그대로 쓰되, 조각을 무한히 가늘게 해서 합을 적분으로 바꾼다.

</details>


## 예제

**예제 2.7** $$x(t) = 1$$ ($$0 < t < T$$), $$h(t) = t$$ ($$0 < t < 2T$$)[^7]

- $$t < 0$$이나 $$t > 3T$$: 겹치지 않아 0.
- $$0 < t < T$$: $$\int_0^t (t - \tau)d\tau = \frac12 t^2$$.
- $$T < t < 2T$$: $$\int_0^T (t - \tau)d\tau = Tt - \frac12T^2$$.
- $$2T < t < 3T$$: $$\int_{t-2T}^{T}(t - \tau)d\tau = -\frac12t^2 + Tt + \frac32T^2$$.
- 구간 경계 $$t = T, 2T, 3T$$에서 값이 이어진다(그림 2.21). 이어지는지 확인하는 것이 계산 실수를 잡는 좋은 방법이다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/19_convolution-integral_fig1.svg" alt="그림" width="581" height="564" loading="lazy">

$$T = 1$$일 때다. 색칠한 넓이가 그 순간의 $$y(t)$$이고, 맨 아래의 점 세 개가 위 세 장면의 넓이다. 점선 $$t = 1, 2, 3$$에서 겹치는 모양이 바뀌어 식도 바뀐다[^s2].

**예제 2.8** $$x(t) = e^{2t}u(-t)$$, $$h(t) = u(t - 3)$$[^8]

- $$h(t - \tau) = u(t - 3 - \tau)$$는 $$\tau < t - 3$$에서 1이다.
- $$t - 3 \le 0$$: $$\int_{-\infty}^{t-3}e^{2\tau}d\tau = \frac12e^{2(t-3)}$$.
- $$t - 3 \ge 0$$: $$x$$가 $$\tau < 0$$에서만 0이 아니므로 $$\int_{-\infty}^{0}e^{2\tau}d\tau = \frac12$$.

**사각 펄스 두 개** 높이 1, 폭 $$a$$와 $$b$$($$b > a$$)인 펄스를 컨벌루션하면 사다리꼴이 나온다[^9]. $$0 \le t < a$$에서 $$t$$, $$a \le t < b$$에서 $$a$$, $$b \le t < a + b$$에서 $$a + b - t$$, 나머지 0. 폭이 같으면($$a = b$$) 삼각형이 된다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/19_convolution-integral_fig2.svg" alt="그림" width="506" height="276" loading="lazy">

폭 1과 폭 2이면 꼭대기가 평평한 사다리꼴, 둘 다 폭 1이면 삼각형이다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 2.6·2.7·2.8과 사다리꼴 결과를 중점 규칙 수치 적분과 비교해 오차 $$10^{-3}$$ 이내, 예제 2.7의 구간 경계 연속성 확인 — [19_convolution-integral_verify.py](/Hongs_Blog/studies/signals-and-systems/code/19_convolution-integral_verify/)</div>

</div>


단계별 연습: [컨벌루션 계산 예제 사다리](/Hongs_Blog/studies/signals-and-systems/convolution-ladder/)

## 활용

- 회로·기계 시스템의 출력 계산, 카메라의 흔들림 흐림(움직임이 만든 $$h$$와 선명한 영상의 컨벌루션), 확률에서 독립 확률변수 합의 분포가 모두 컨벌루션 적분이다[^s1].
- 흔한 실수: 겹치는 구간의 끝점을 $$t$$로 쓸지 $$t - 2T$$로 쓸지 헷갈리는 것. 그림을 먼저 그리고 끝점 두 개를 읽는다.

## 연결

- 선수: [컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/), [정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)
- 다음: [컨벌루션의 성질](/Hongs_Blog/studies/signals-and-systems/convolution-properties/)
- 수학 쪽: [푸리에 변환과 합성곱](/Hongs_Blog/studies/calculus/fourier-transform/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$y(t) = \int x(\tau)h(\tau)d\tau$$처럼 같은 시각끼리 곱하면 된다."</div>

틀렸다. 같은 시각끼리 곱하면 결과가 $$t$$와 상관없는 숫자 하나가 된다. 그럴듯해 보이는 이유는 곱해서 적분한다는 모양이 비슷해서다. 컨벌루션은 $$h$$를 뒤집어 $$t$$만큼 민 $$h(t - \tau)$$와 곱하므로 $$t$$마다 다른 값이 나온다. 확인: 예제 2.6에서 $$\int e^{-a\tau}u(\tau)u(\tau)d\tau = \frac1a$$로 상수지만, 실제 출력은 $$\frac1a(1 - e^{-at})$$로 시간에 따라 변한다.

</div>


## 과목별 관점

**휴먼 인터페이스 미디어 (4-1학기).** 강의 6은 합성곱을 두 데이터의 "모양 맞추기" 도구의 하나로, 뒤집지 않고 옮기는 교차 상관과 나란히 소개한다[^h1]. 예제도 같은 뒤집고-밀기로 푼다: 폭 1 사각 펄스끼리는 꼭대기 $$(1, 1)$$의 삼각형, 높이 2·폭 2인 펄스와 폭 1 펄스는 0~1에서 오르고 1~2에서 2로 평평하고 3에서 0이 되는 사다리꼴이다[^h2]. 풀이는 [합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/), 두 연산의 차이는 [교차 상관과 합성곱 비교](/Hongs_Blog/studies/human-interface-media/correlation-vs-convolution/)에 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컨벌루션 적분의 식을 쓰고, 계산하는 순서를 세 단계로 말하라.</summary>

**답:** $$y(t) = \int_{-\infty}^{\infty}x(\tau)h(t-\tau)d\tau$$. ① $$h(\tau)$$를 뒤집고 $$t$$만큼 민다 ② $$x(\tau)$$와 곱한다 ③ $$\tau$$에 대해 적분한다(겹친 넓이).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 높이 1, 폭 1인 사각 펄스 $$x(t) = u(t) - u(t-1)$$을 자기 자신과 컨벌루션하면? $$t = 0.5$$, $$1$$, $$1.5$$에서의 값은?</summary>

**답:** 삼각형 $$y(t) = t$$ ($$0 \le t < 1$$), $$2 - t$$ ($$1 \le t < 2$$). 값은 0.5, 1, 0.5.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 계산이 하는 일을 한 문장으로 말하라: `sum(x(lo+(i+0.5)*d) * h(t-lo-(i+0.5)*d) for i in range(n)) * d`</summary>

**답:** $$\tau$$축을 폭 $$d$$의 칸으로 잘라 각 칸 가운데에서 $$x(\tau)h(t-\tau)$$를 구해 더하는 방식(중점 규칙)으로, 시각 $$t$$의 컨벌루션 적분값을 근사한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 예제 2.7에서 구간을 $$0<t<T$$, $$T<t<2T$$, $$2T<t<3T$$로 나누는 이유는?</summary>

**답:** $$h(t-\tau)$$가 $$\tau$$축에서 $$[t - 2T, t]$$에 있고 $$x$$는 $$[0, T]$$에 있다. $$t$$가 커지며 겹친 구간의 끝점이 바뀌는 시각($$t = T$$에서 오른쪽 끝이 $$T$$에 닿음, $$t = 2T$$에서 왼쪽 끝이 0을 넘음, $$t = 3T$$에서 겹침이 끝남)마다 적분 범위가 달라지기 때문이다.

</details>


[^1]: 신호 및 시스템 5회 강의 자료 「Week05_CH02_1_handout」, p.40~41 (예제 2.6, 그림 2.17~2.18)
[^2]: 같은 자료, p.28~29 (그림 2.12)
[^3]: 같은 자료, p.30~32 (그림 2.13)
[^4]: 같은 자료, p.35~37 (그림 2.15, 2.16)
[^5]: 같은 자료, p.38
[^6]: 같은 자료, p.39
[^7]: 같은 자료, p.42~45 (예제 2.7, 그림 2.19~2.21)
[^8]: 같은 자료, p.45~47 (예제 2.8, 그림 2.22)
[^9]: 신호 및 시스템 7회 강의 자료 「Week07_CH03_1_handout」, p.3~4
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 축전기 비유, 구간 경계 연속성으로 실수를 잡는 방법, 폭이 같으면 삼각형이라는 점, 흐림·확률 활용, 오해 항목, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 2장은 원본에 없다. [19_convolution-integral_plot.py](/Hongs_Blog/studies/signals-and-systems/code/19_convolution-integral_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 예제 2.7($$T = 1$$)의 겹친 넓이를 수치 적분해 네 구간 답과 비교, 경계 $$t = 1, 2$$에서의 연속성, 사다리꼴 값.
[^h1]: 휴먼 인터페이스 미디어 6회 강의 자료 「HIM_강의06_모양맞추기」, p.6, p.10~11 (분산·상관·합성곱, 합성곱 정의, 비교)
[^h2]: 같은 자료, p.12~13 (1-D 합성곱 예, 예2)
{% endraw %}
