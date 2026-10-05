---
layout: "note"
title: "표본분포와 추정량"
display_title: "표본분포와 추정량 (Estimators and Sampling Distributions)"
kind: "concept"
kind_label: "정의"
num: "29"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Estimator", "추정량", "점추정", "point estimation", "표본분포", "sampling distribution", "편향", "bias", "불편추정량", "unbiased estimator", "평균제곱오차", "MSE", "mean squared error", "편향-분산 분해", "bias-variance decomposition", "일치성", "consistency", "베셀 보정", "Bessel's correction"]
description: "표본에서 계산한 평균 같은 값은 표본을 다시 뽑으면 달라지는 확률변수다. 그래서 \"이 계산법이 얼마나 좋은가\"를 과녁 맞히기처럼 따진다. 평균적으로 과녁 중심에서 비껴 있는가(편향), 화살이 얼마나 흩어지는가(분산), 둘을 합쳐 중심에서 평균적으로 얼마나 먼가(평균제곱오차). 표본…"
prev_url: "/studies/probability-statistics/descriptive-statistics/"
prev_title: "기술통계"
next_url: "/studies/probability-statistics/mle/"
next_title: "최대가능도 추정"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/estimators/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표본에서 계산한 평균 같은 값은 표본을 다시 뽑으면 달라지는 확률변수다. 그래서 "이 계산법이 얼마나 좋은가"를 과녁 맞히기처럼 따진다. 평균적으로 과녁 중심에서 비껴 있는가(편향), 화살이 얼마나 흩어지는가(분산), 둘을 합쳐 중심에서 평균적으로 얼마나 먼가(평균제곱오차). 표본분산을 표본 수가 아니라 하나 적은 수로 나누는 것은 편향을 없애기 위해서지만, 편향이 없는 계산법이 늘 가장 정확한 것은 아니다.

</div>


## 예시로 보기

주사위를 4번 던져 평균을 내는 실험을 10만 번 되풀이하면, 표본평균은 매번 다르다. 그 값들의 평균은 3.5, 분산은 $$\frac{35/12}{4} \approx 0.73$$이다. 한 번의 표본평균은 이 분포에서 뽑힌 하나의 값이다.

표본평균이 따르는 이 분포가 아래의 표본분포이고, "4번 던져 평균 내기"라는 규칙이 추정량 $$\hat\theta$$, 3.5가 추정하려는 모수 $$\theta$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

모수 $$\theta$$를 표본 $$X_1, \dots, X_n$$으로 어림하는 규칙 $$\hat\theta = g(X_1, \dots, X_n)$$을 **추정량**이라 하고, 그 분포를 **표본분포**라 한다[^1].
- **편향:** $$\operatorname{bias}(\hat\theta) = \mathbb{E}[\hat\theta] - \theta$$. 0이면 **불편**.
- **표준오차:** $$\operatorname{SD}(\hat\theta)$$.
- **평균제곱오차:** $$\operatorname{MSE}(\hat\theta) = \mathbb{E}[(\hat\theta - \theta)^2]$$.
- **일치성:** $$n \to \infty$$일 때 모든 $$\varepsilon > 0$$에서 $$P(\vert \hat\theta - \theta\vert  > \varepsilon) \to 0$$.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">편향-분산 분해</div>

$$\operatorname{MSE}(\hat\theta) = \operatorname{bias}(\hat\theta)^2 + \operatorname{Var}(\hat\theta)$$.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

$$\mu = \mathbb{E}[\hat\theta]$$로 두고 $$\hat\theta - \theta = (\hat\theta - \mu) + (\mu - \theta)$$로 쪼갠다. 제곱해 기댓값을 취하면 교차항 $$2(\mu - \theta)\mathbb{E}[\hat\theta - \mu]$$는 $$\mathbb{E}[\hat\theta - \mu] = 0$$이라 사라진다. 남는 것이 $$\operatorname{Var}(\hat\theta) + (\mu - \theta)^2$$이다. ∎

</details>


**표본평균.** $$\bar X$$는 불편이고 분산 $$\frac{\sigma^2}{n}$$이라 일치 추정량이다([큰 수의 법칙](/Hongs_Blog/studies/probability-statistics/lln/)). $$n$$이 크면 표본분포가 정규분포에 가깝다([중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)).

**$$n - 1$$로 나누는 이유.** $$\mathbb{E}\left[\sum(X_i - \bar X)^2\right] = (n - 1)\sigma^2$$이다. 편차를 참 평균 $$\mu$$가 아니라 자료에 가장 가깝게 맞춘 $$\bar X$$로 재서 제곱합이 조금 작게 나온다. 그만큼 나누는 수를 줄여 보정한다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">$$(n - 1)\sigma^2$$의 유도</summary>

1. *쪼개기:* $$\sum(X_i - \bar X)^2 = \sum(X_i - \mu)^2 - n(\bar X - \mu)^2$$(전개하면 교차항이 $$-2n(\bar X - \mu)^2$$로 모인다).
2. *기댓값:* 첫 합의 기댓값은 $$n\sigma^2$$, 둘째 항은 $$n \cdot \operatorname{Var}(\bar X) = n \cdot \frac{\sigma^2}{n} = \sigma^2$$.
3. *결론:* $$n\sigma^2 - \sigma^2 = (n - 1)\sigma^2$$. ∎

</details>


## 예제

**불편이 최선은 아니다.** 정규분포에서 표본 5개로 분산 $$\sigma^2$$를 어림한다.

1. *두 후보:* 불편 $$S^2_{n-1} = \frac{1}{4}\sum(X_i - \bar X)^2$$, 편향된 $$S^2_n = \frac15\sum(X_i - \bar X)^2$$.
2. *불편 추정량의 MSE:* 편향 0, 분산 $$\frac{2\sigma^4}{n - 1} = 0.5\sigma^4$$.
3. *편향된 추정량의 MSE:* 편향 $$-\frac{\sigma^2}{5}$$, 분산이 더 작아 합이 $$\frac{2n - 1}{n^2}\sigma^4 = 0.36\sigma^4$$.
4. *결론:* 조금 치우쳐도 덜 흩어지는 쪽이 평균적으로 더 정확하다. 이 편향-분산 줄다리기가 [과적합](/Hongs_Blog/studies/probability-statistics/overfitting-cv/)과 정칙화의 핵심이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 주사위 4개 평균의 표본분포(모의실험 10만 회), 편향-분산 분해(무작위 이산 분포 100개로 정확히), $$(n - 1)\sigma^2$$(주사위 2·3개 전수로 분수 확인), 두 분산 추정량의 MSE 0.5와 0.36(식과 모의실험 10만 회), 카드의 값 — [29_estimators_verify.py](/Hongs_Blog/studies/probability-statistics/code/29_estimators_verify/)</div>

</div>


## 활용

- **측정 설계.** 벤치마크를 몇 번 돌릴지는 표준오차 $$\frac{\sigma}{\sqrt n}$$을 원하는 크기로 줄이는 $$n$$으로 정한다.
- **기계학습.** 모델의 예측 오차도 편향(모델이 너무 단순)과 분산(데이터에 너무 민감)으로 나뉜다. 정칙화는 편향을 조금 받아들이고 분산을 크게 줄이는 선택이다.

## 연결

- 선수: [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/), [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)
- 이어지는 개념: [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)(추정량을 만드는 일반적 방법), [신뢰구간](/Hongs_Blog/studies/probability-statistics/confidence-intervals/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 어떤 추정량의 편향이 2, 분산이 5다. 평균제곱오차는?</summary>

**답:** $$2^2 + 5 = 9$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 표본분산을 $$n$$이 아니라 $$n - 1$$로 나누는 이유를 설명하라.</summary>

**답:** 편차를 참 평균 대신 표본평균으로 재는데, 표본평균은 그 자료의 제곱합을 가장 작게 만드는 값이다. 그래서 $$\sum(X_i - \bar X)^2$$의 기댓값이 $$n\sigma^2$$이 아니라 $$(n - 1)\sigma^2$$이다. $$n - 1$$로 나눠야 기댓값이 $$\sigma^2$$이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 불편 추정량보다 평균제곱오차가 작은 편향 추정량의 예를 들어라.</summary>

**답:** 정규분포, 표본 5개에서 분산을 $$\frac15\sum(X_i - \bar X)^2$$로 어림하면 MSE가 $$0.36\sigma^4$$로, 불편인 $$\frac14\sum(\cdots)$$의 $$0.5\sigma^4$$보다 작다. 편향이 조금 생기지만 분산이 더 크게 준다.

</details>


[^1]: Wasserman, *All of Statistics*, "Models, Statistical Inference and Learning" 장(점추정, 편향, 표준오차, MSE의 편향-분산 분해, 일치성). Blitzstein, Hwang, *Introduction to Probability* 2판, 6.3절 "Sample moments"(표본분산의 기댓값).
[^s1]: 에이전트 보충. 정규분포에서 $$\operatorname{Var}(S^2_{n-1}) = \frac{2\sigma^4}{n - 1}$$은 $$\frac{(n-1)S^2}{\sigma^2}$$이 자유도 $$n - 1$$인 카이제곱분포를 따른다는 데서 나온다(Blitzstein·Hwang 10.4절). 두 MSE는 29_estimators_verify.py로 확인했다.
{% endraw %}
