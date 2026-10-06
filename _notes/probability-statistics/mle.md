---
layout: "note"
title: "최대가능도 추정"
display_title: "최대가능도 추정 (Maximum Likelihood Estimation)"
kind: "concept"
kind_label: "기법"
num: "30"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Maximum Likelihood Estimation", "최대가능도 추정", "최대우도 추정", "MLE", "가능도 함수", "likelihood function", "로그 가능도", "log-likelihood", "음의 로그 가능도", "negative log-likelihood", "점수 함수", "score function", "피셔 정보량", "Fisher information", "불변성", "invariance"]
description: "여러 후보 설명 중에서 지금 본 데이터가 나올 가능성을 가장 크게 만드는 것을 고르는 방법이다. 동전을 10번 던져 앞면이 7번이면, 앞면 확률 0.7이 이 결과를 가장 그럴듯하게 만든다. 확률을 곱한 식에 로그를 씌워 합으로 바꾸고 미분해 0으로 놓는 기계적인 절차라, 거의 모든…"
prev_url: "/studies/probability-statistics/estimators/"
prev_title: "표본분포와 추정량"
next_url: "/studies/probability-statistics/confidence-intervals/"
next_title: "신뢰구간"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/mle/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 후보 설명 중에서 지금 본 데이터가 나올 가능성을 가장 크게 만드는 것을 고르는 방법이다. 동전을 10번 던져 앞면이 7번이면, 앞면 확률 0.7이 이 결과를 가장 그럴듯하게 만든다. 확률을 곱한 식에 로그를 씌워 합으로 바꾸고 미분해 0으로 놓는 기계적인 절차라, 거의 모든 통계 모델과 기계학습 학습의 기본이다. 하지만 데이터가 적으면 극단적인 답(세 번 모두 앞면이면 앞면 확률 1)을 내고, 모델 가정이 틀리면 그럴듯하게 틀린 답을 낸다.

</div>


## 예시로 보기

동전을 10번 던져 앞면이 7번 나왔다. 앞면 확률이 $$p$$라면 이 결과(순서까지 고정)가 나올 확률은 $$p^7(1 - p)^3$$이다.

| 후보 $$p$$ | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|---|---|---|---|---|---|
| $$p^7(1 - p)^3$$ ($$\times 10^{-3}$$) | 0.98 | 1.79 | 2.22 | 1.68 | 0.48 |

0.7에서 가장 크다. 데이터를 고정하고 $$p$$를 움직이며 본 이 함수가 아래의 가능도 $$L(p)$$이고, 가장 높은 곳이 최대가능도 추정값 $$\hat p = 0.7$$이다.

## 정의

**적용 조건.** 데이터가 모수 $$\theta$$로 정해지는 확률 모델 $$f(x; \theta)$$에서 독립으로 나왔다고 볼 수 있을 때.

**알아보는 신호.** "모수를 추정하라", "모델을 데이터에 맞춰라", "손실 함수는 음의 로그 가능도" 같은 말.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

독립인 관측 $$x_1, \dots, x_n$$에 대해 **가능도 함수**는 $$L(\theta) = \prod_{i=1}^{n}f(x_i; \theta)$$, **로그 가능도**는 $$\ell(\theta) = \sum_{i=1}^{n}\ln f(x_i; \theta)$$($$\sum$$은 차례로 모두 더한다는 기호)다. **최대가능도 추정값**은 $$\hat\theta = \arg\max_\theta L(\theta) = \arg\max_\theta\ell(\theta)$$다[^1].

</div>


로그는 증가함수라 최댓점이 같다. 곱을 합으로 바꿔 미분하기 쉽고, 아주 작은 확률의 곱이 컴퓨터에서 0으로 뭉개지는 것도 막는다.

**대표적인 결과.**

| 모델 | MLE |
|---|---|
| 베르누이($$p$$), 성공 $$k$$번 / $$n$$번 | $$\hat p = \frac kn$$ |
| 포아송($$\lambda$$) | $$\hat\lambda = \bar x$$ |
| 지수($$\lambda$$) | $$\hat\lambda = \frac{1}{\bar x}$$ |
| 정규($$\mu, \sigma^2$$) | $$\hat\mu = \bar x$$, $$\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$$ |

정규분포의 $$\hat\sigma^2$$는 $$n$$으로 나눠 [편향](/Hongs_Blog/studies/probability-statistics/estimators/)이 있다. MLE가 늘 불편인 것은 아니다.

**성질 [증명 생략: Wasserman "Parametric Inference" 장].** 모델이 맞고 규칙성 조건이 맞으면 MLE는 일치 추정량이고, $$n$$이 크면 대략 정규분포를 따르며 분산은 $$\frac{1}{nI(\theta)}$$($$I$$는 피셔 정보량)로 가능한 한 가장 작다. **불변성:** $$g(\theta)$$의 MLE는 $$g(\hat\theta)$$다. 지수분포의 평균 $$\frac1\lambda$$의 MLE는 $$\frac{1}{\hat\lambda} = \bar x$$다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">베르누이 MLE의 유도</summary>

1. *로그 가능도:* $$\ell(p) = k\ln p + (n - k)\ln(1 - p)$$, $$0 < p < 1$$.
2. *미분:* $$\ell'(p) = \frac kp - \frac{n - k}{1 - p}$$.
3. *0으로 놓기:* $$k(1 - p) = (n - k)p$$에서 $$p = \frac kn$$.
4. *최대 확인:* $$\ell''(p) = -\frac{k}{p^2} - \frac{n - k}{(1 - p)^2} < 0$$이라 [극대](/Hongs_Blog/studies/calculus/curve-analysis/)다. 구간 끝($$p \to 0, 1$$)에서 $$\ell \to -\infty$$라 전역 최대다($$0 < k < n$$일 때). ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 1단계에서 $$\binom nk$$ 같은 상수를 빼도 되는 이유는?</summary>

상수배는 로그를 취하면 $$p$$와 무관한 덧셈 상수가 되어, 미분하면 사라지고 최댓점을 바꾸지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4단계에서 2계 도함수만으로는 부족하고 끝점을 따로 보는 이유는?</summary>

2계 도함수가 음수라는 것은 그 점이 지역 최대라는 뜻이다. 전역 최대인지 보려면 경계에서의 값과 비교해야 한다. 여기서는 $$\ell$$이 오목해서(2계 도함수가 늘 음수) 지역 최대가 곧 전역 최대이기도 하다([볼록성](/Hongs_Blog/studies/calculus/convexity/)).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 최대가능도의 핵심 아이디어는?</summary>

"모수 → 데이터" 방향의 확률 모델을 데이터를 고정한 채 모수의 함수로 거꾸로 읽고, 그 함수를 최적화 문제로 푼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 같은 방법을 쓰는 다른 상황은?</summary>

[선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/)(정규 잡음의 MLE = 최소제곱), 로지스틱 회귀와 신경망 분류([교차 엔트로피](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/) 최소화 = MLE), 언어 모델 학습.

</details>


## 예제

**대표 문제 1: 포아송 도착률.** 5분 동안 분마다 들어온 요청 수가 $$2, 3, 1, 4, 0$$이다.

1. *모델:* 분당 요청 수 $$\sim \mathrm{Pois}(\lambda)$$($$X \sim$$ 분포는 "$$X$$가 그 분포를 따른다"), 서로 독립.
2. *로그 가능도:* $$\ell(\lambda) = \sum(x_i\ln\lambda - \lambda - \ln x_i!) = 10\ln\lambda - 5\lambda + \text{상수}$$.
3. *미분:* $$\frac{10}{\lambda} - 5 = 0$$에서 $$\hat\lambda = 2$$ = 표본평균.
4. *해석:* 도착률의 MLE는 관측 평균이다. 2계 도함수 $$-\frac{10}{\lambda^2} < 0$$이라 최대다.

**대표 문제 2: 닫힌 꼴이 없을 때.** 로지스틱 회귀는 $$\ell$$을 0으로 놓은 식을 손으로 풀 수 없다. $$\ell$$이 오목하므로 [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)(기울기는 [행렬 미분](/Hongs_Blog/studies/calculus/matrix-calculus/)의 $$X^\top(\mathbf{y} - \mathbf{p})$$)으로 수치적으로 최대화한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 최댓점 0.7(가능도와 로그 가능도 모두 격자 탐색), 표의 네 닫힌 꼴(무작위 자료에서 수치 최적화와 일치), 카드의 값, 불변성과 일치성(표본 10·100·1만 개), 가능도를 모수로 적분한 값 $$\frac{1}{1320}$$, 예제 사다리의 값 — [30_mle_verify.py](/Hongs_Blog/studies/probability-statistics/code/30_mle_verify/)</div>

</div>


## 활용

- **모델 학습의 표준.** 분류 모델의 교차 엔트로피 손실, 회귀의 제곱 오차, 언어 모델의 다음 단어 예측 손실은 모두 음의 로그 가능도다.
- **분포 맞추기.** 요청 간격에 지수분포, 오류 수에 포아송을 맞출 때 모수를 MLE로 정한다.
- **흔한 실수.** 데이터가 적을 때 MLE를 그대로 믿는 것(3번 모두 앞면 → $$\hat p = 1$$). 사전 분포로 보정하는 [MAP](/Hongs_Blog/studies/probability-statistics/bayesian-inference/)나 정칙화를 쓴다.
- 연습: [최대가능도 예제 사다리](/Hongs_Blog/studies/probability-statistics/mle-ladder/)

## 연결

- 선수: [추정량](/Hongs_Blog/studies/probability-statistics/estimators/), [결합분포](/Hongs_Blog/studies/probability-statistics/joint-distributions/)(독립이면 결합 확률이 곱), [최적화](/Hongs_Blog/studies/calculus/curve-analysis/)
- 이어지는 개념: [베이즈 추론과 MAP](/Hongs_Blog/studies/probability-statistics/bayesian-inference/), [선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/), [교차 엔트로피](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"가능도 $$L(\theta)$$는 모수 $$\theta$$가 그 값일 확률이다"</div>

틀렸다. 식이 확률 $$f(x; \theta)$$로 되어 있어 그렇게 읽기 쉽다. 하지만 가능도는 데이터를 고정하고 $$\theta$$를 움직인 함수라, $$\theta$$에 대해 적분해도 1이 되지 않는다. 동전 예시에서 $$\int_0^1 p^7(1 - p)^3dp = \frac{1}{1320}$$($$\int$$는 넓이를 구하는 적분 기호)이다. "$$\theta$$일 확률"을 말하려면 사전 분포를 두고 [베이즈 추론](/Hongs_Blog/studies/probability-statistics/bayesian-inference/)을 해야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 동전 10번 중 앞면 7번일 때 앞면 확률의 MLE는?</summary>

**답:** $$\ell(p) = 7\ln p + 3\ln(1 - p)$$, $$\ell' = \frac7p - \frac{3}{1 - p} = 0$$에서 $$\hat p = 0.7$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 대기 시간이 지수분포를 따른다고 보고 관측 평균이 2.5초였다. 발생률 $$\lambda$$의 MLE는?</summary>

**답:** $$\ell(\lambda) = n\ln\lambda - \lambda\sum x_i$$, $$\frac n\lambda - \sum x_i = 0$$에서 $$\hat\lambda = \frac{1}{\bar x} = 0.4$$(초당).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 가능도를 그대로 최대화하지 않고 로그를 취하는 이유 두 가지는?</summary>

**답:** (1) 독립 관측의 곱이 합이 되어 미분이 쉽다. (2) 작은 확률 수천 개의 곱은 부동소수점에서 0으로 뭉개지지만, 로그의 합은 안정적이다. 로그는 증가함수라 최댓점은 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "관측 결과가 나올 확률"과 "가능도"는 같은 식인데 무엇이 다른가?</summary>

**답:** 확률 $$f(x; \theta)$$는 모수를 고정하고 데이터의 함수로 본 것이라 데이터에 대해 합하면 1이다. 가능도 $$L(\theta)$$는 데이터를 고정하고 모수의 함수로 본 것이라 모수에 대해 적분해도 1이 아니며, 모수의 확률도 아니다.

</details>


[^1]: Wasserman, *All of Statistics*, "Parametric Inference" 장(최대가능도, 일치성, 점근 정규성, 피셔 정보량, 불변성).
{% endraw %}
