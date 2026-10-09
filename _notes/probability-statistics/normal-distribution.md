---
layout: "note"
title: "정규분포"
display_title: "정규분포 (Normal Distribution)"
kind: "concept"
kind_label: "정의"
num: "16"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Normal Distribution", "정규분포", "가우스 분포", "Gaussian distribution", "표준정규분포", "standard normal", "표준화", "standardization", "z점수", "z-score", "68-95-99.7 규칙", "empirical rule", "Φ", "오차함수", "error function"]
description: "가운데가 가장 높고 양쪽으로 대칭으로 빠르게 낮아지는 종 모양 분포다. 평균과 표준편차 두 수만으로 모양이 완전히 정해지고, 평균에서 표준편차 1배·2배·3배 안에 약 68%·95%·99.7%가 들어간다. 작은 독립 요인이 많이 더해진 양(측정 오차, 합과 평균)은 대개 이 모양에…"
prev_url: "/studies/probability-statistics/uniform-exponential/"
prev_title: "균등분포와 지수분포"
next_url: "/studies/probability-statistics/joint-distributions/"
next_title: "결합분포와 조건부 기댓값"
math: true
mermaid: false
code_count: 2
permalink: "/studies/probability-statistics/normal-distribution/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가운데가 가장 높고 양쪽으로 대칭으로 빠르게 낮아지는 종 모양 분포다. 평균과 표준편차 두 수만으로 모양이 완전히 정해지고, 평균에서 표준편차 1배·2배·3배 안에 약 68%·95%·99.7%가 들어간다. 작은 독립 요인이 많이 더해진 양(측정 오차, 합과 평균)은 대개 이 모양에 가까워져서 통계의 기본 도구가 된다. 대신 꼬리가 아주 빨리 얇아져서, 가끔 극단값이 나오는 자료(응답 지연 등)에 쓰면 드문 사건의 확률을 크게 과소평가한다.

</div>


## 예시로 보기

서버 응답 시간이 평균 200 ms, 표준편차 20 ms인 정규분포를 따른다고 하자.

| 범위 | 표준편차로 | 확률 |
|---|---|---|
| 180~220 ms | 평균 ± 1σ | 약 68.3% |
| 160~240 ms | 평균 ± 2σ | 약 95.4% |
| 140~260 ms | 평균 ± 3σ | 약 99.7% |

160 ms 미만일 확률은 "평균보다 표준편차 2개 아래"라 $$\frac{1 - 0.954}{2} \approx 2.3\%$$다. 값을 "평균에서 표준편차 몇 개 떨어졌나"로 바꾸는 이 계산이 아래의 표준화이고, 200이 $$\mu$$, 20이 $$\sigma$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/16_normal-distribution_fig1.svg" alt="그림" loading="lazy">

가장 진한 띠가 평균 ± 1σ, 그다음이 ± 2σ와 ± 3σ다. 띠를 한 칸 넓힐 때마다 더해지는 넓이가 빠르게 줄어, ± 3σ 밖에는 0.3%만 남는다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

평균 $$\mu \in \mathbb{R}$$($$\in$$은 "~에 속한다"), 분산 $$\sigma^2 > 0$$인 **정규분포** $$\mathcal{N}(\mu, \sigma^2)$$의 밀도는

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)\quad(x \in \mathbb{R})$$

이다. $$\mu = 0$$, $$\sigma = 1$$인 것이 **표준정규분포**이고, 그 CDF를 $$\Phi$$로 쓴다[^1].

</div>


$$\Phi$$는 기본 함수로 쓸 수 없어 표나 오차함수로 계산한다. $$\Phi(z) = \frac12\left(1 + \operatorname{erf}\frac{z}{\sqrt2}\right)$$이고, 파이썬에서는 `math.erf`로 계산한다.

**동치인 다른 정의(표준화).** $$X \sim \mathcal{N}(\mu, \sigma^2)$$ ⇔ $$Z = \frac{X - \mu}{\sigma} \sim \mathcal{N}(0, 1)$$. 그래서 모든 정규분포 계산은 $$P(X \le x) = \Phi\left(\frac{x - \mu}{\sigma}\right)$$ 하나로 끝난다. $$\frac{x - \mu}{\sigma}$$를 $$z$$점수라 한다.

**성질.**
- 일차 변환: $$aX + b \sim \mathcal{N}(a\mu + b, a^2\sigma^2)$$ ($$a \ne 0$$).
- 독립인 정규분포의 합: $$\mathcal{N}(\mu_1, \sigma_1^2) + \mathcal{N}(\mu_2, \sigma_2^2) = \mathcal{N}(\mu_1 + \mu_2, \sigma_1^2 + \sigma_2^2)$$.
- 95%를 담는 대칭 구간은 $$\mu \pm 1.96\sigma$$다.

**설계 이유.** 지수 안의 $$-\frac{(x - \mu)^2}{2\sigma^2}$$는 평균에서 멀어질수록 거리의 제곱으로 빠르게 줄게 한다. 앞의 $$\frac{1}{\sigma\sqrt{2\pi}}$$는 넓이를 1로 맞추는 상수이고, $$\sqrt{2\pi}$$는 가우스 적분에서 나온다(아래 증명). 이 모양이 특별한 이유는 [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/) 때문이다. 독립인 것들의 합은 원래 분포와 상관없이 이 모양으로 모인다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/16_normal-distribution_fig2.svg" alt="그림" loading="lazy">

$$\mu$$를 0에서 3으로 바꾸면 종이 모양 그대로 옮겨 간다. $$\sigma$$를 2로 키우면 종이 두 배 넓어지고 높이는 절반이 되어, 넓이 1이 그대로다[^s2].

| 해당함(대략 정규) | 해당하지 않음 |
|---|---|
| 여러 번 잰 측정값의 오차 | 대기 시간(지수분포, 한쪽으로 치우침) |
| 주사위 100개의 합 | 응답 지연, 파일 크기처럼 꼬리가 두꺼운 자료 |
| 많은 사람의 키 |  |

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">넓이가 1인 이유</summary>

1. *치환:* $$z = \frac{x - \mu}{\sigma}$$로 두면 $$dx = \sigma\,dz$$이고 $$\int f\,dx = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-z^2/2}dz$$.
2. *한 번 더 치환:* $$z = \sqrt2\,u$$로 두면 $$\int e^{-z^2/2}dz = \sqrt2\int e^{-u^2}du$$.
3. *가우스 적분:* [중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/)에서 극좌표로 구한 $$\int_{-\infty}^{\infty}e^{-u^2}du = \sqrt\pi$$를 쓴다.
4. *정리:* $$\frac{1}{\sqrt{2\pi}} \cdot \sqrt2 \cdot \sqrt\pi = 1$$. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 1단계에서 $$dx = \sigma\,dz$$가 앞의 $$\frac1\sigma$$를 지우는 것은 무엇을 뜻하는가?</summary>

가로로 $$\sigma$$배 늘이면 넓이가 $$\sigma$$배가 되므로, 높이를 $$\frac1\sigma$$배 해야 넓이 1이 유지된다. 표준편차가 클수록 종이 낮고 넓은 이유다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 가우스 적분이 없으면 이 증명의 어디가 막히는가?</summary>

3단계다. $$e^{-u^2}$$는 원시함수를 기본 함수로 쓸 수 없어 미적분의 기본정리를 쓸 수 없다. 제곱해 이중적분으로 바꾸고 극좌표로 풀어야 값이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 이 정의의 핵심 아이디어는?</summary>

평균과 분산만 정하면 나머지는 "거리 제곱에 대한 지수적 감소"라는 하나의 모양으로 고정된다. 그래서 표준화 한 번으로 모든 정규분포를 표준정규분포 하나로 계산한다.

</details>


## 예제

**응답 시간의 기준 잡기.** 응답 시간이 $$\mathcal{N}(200, 20^2)$$ ms일 때, 요청의 95%가 들어가는 대칭 구간과 160 ms 미만일 확률은?

1. *구간:* $$200 \pm 1.96 \times 20 = [160.8,\ 239.2]$$ ms.
2. *표준화:* $$z = \frac{160 - 200}{20} = -2$$.
3. *확률:* $$\Phi(-2) \approx 0.0228$$.
4. *주의:* 실제 응답 시간은 오른쪽 꼬리가 길어 정규 가정이 자주 틀린다. 꼬리 지연 기준은 정규 가정 대신 측정한 분위수로 잡는 편이 안전하다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 가지 $$(\mu, \sigma)$$에서 넓이·평균·분산(수치 적분), 68-95-99.7과 1.96, 일차 변환과 합(모의실험 20만 개), 예제와 카드의 값, 지수분포의 1σ 확률 0.865, 꼬리가 두꺼운 분포의 3σ 밖 확률, 박스–뮬러 표본 — [16_normal-distribution_verify.py](/Hongs_Blog/studies/probability-statistics/code/16_normal-distribution_verify/)</div>

</div>


## 활용

- **오차 막대와 신뢰구간.** 표본평균은 중심극한정리로 정규분포에 가까워서, "평균 ± 1.96 × 표준오차"를 95% 구간으로 쓴다.
- **잡음 모델.** 통신과 센서의 열잡음, 회귀 분석의 오차 항을 정규분포로 둔다. 정규 잡음 가정에서 최대가능도 추정은 최소제곱과 같아진다([선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/)).
- **표본 생성.** [박스–뮬러 변환](/Hongs_Blog/studies/calculus/multiple-integrals/)으로 균등 난수 두 개에서 독립인 표준정규 난수 두 개를 만든다.

## 연결

- 선수: [연속 확률변수와 확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/), [분산](/Hongs_Blog/studies/probability-statistics/variance/), [가우스 적분](/Hongs_Blog/studies/calculus/multiple-integrals/)
- 이어지는 개념: [다변량 정규분포](/Hongs_Blog/studies/probability-statistics/multivariate-normal/), [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"평균에서 표준편차 3개 넘게 떨어진 값은 거의(0.3%) 나오지 않는다"</div>

정규분포에서만 맞다. 이 규칙이 워낙 유명해 모든 자료에 쓰기 쉽다. 하지만 꼬리가 두꺼운 분포에서는 3σ 밖 확률이 훨씬 크다. 자유도 3인 t분포를 모의실험하면 약 1.3%로 정규분포의 0.27%보다 약 5배다. 지연 시간, 트래픽, 파일 크기처럼 가끔 아주 큰 값이 나오는 자료에 정규 가정을 쓰면 장애를 과소평가한다. 자료의 분위수를 직접 보고 확인한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$X \sim \mathcal{N}(100, 15^2)$$일 때 $$P(X > 130)$$은?</summary>

**답:** $$z = \frac{130 - 100}{15} = 2$$. $$1 - \Phi(2) \approx 0.0228$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 응답 시간이 $$\mathcal{N}(200, 20^2)$$ ms일 때 95%가 들어가는 대칭 구간은?</summary>

**답:** $$200 \pm 1.96 \times 20 = [160.8, 239.2]$$ ms.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 정규분포 밀도의 앞에 $$\frac{1}{\sigma\sqrt{2\pi}}$$가 붙는 이유를 두 부분으로 나눠 설명하라.</summary>

**답:** $$\frac1\sigma$$는 가로로 $$\sigma$$배 넓어진 만큼 높이를 낮춰 넓이를 유지하는 배율이다. $$\frac{1}{\sqrt{2\pi}}$$는 $$\int e^{-z^2/2}dz = \sqrt{2\pi}$$(가우스 적분에서 나옴)를 나눠 넓이를 1로 맞추는 상수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 68-95-99.7 규칙이 정규분포가 아닌 분포에서 깨지는 예를 계산으로 보여라.</summary>

**답:** $$\mathrm{Exp}(1)$$은 평균 1, 표준편차 1이다. 평균 ± 1σ 안, 곧 $$0 < X < 2$$일 확률은 $$1 - e^{-2} \approx 0.865$$로 0.68과 다르다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 5.4절 "Normal"(밀도, 표준화, $$\Phi$$, 68-95-99.7 규칙, 정규분포의 일차 변환), 6.6절 "Sums of independent r.v.s via MGFs"(독립인 정규분포의 합).
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [16_normal-distribution_plot.py](/Hongs_Blog/studies/probability-statistics/code/16_normal-distribution_plot/)로 그렸고, 그림에 쓴 값(68.3%·95.4%·99.7%, $$\Phi(-2) \approx 0.023$$, 세 밀도의 넓이 1, $$\sigma = 2$$일 때 꼭대기 높이가 절반)을 같은 코드로 확인했다.
{% endraw %}
