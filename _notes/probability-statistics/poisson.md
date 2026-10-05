---
layout: "note"
title: "포아송 분포"
display_title: "포아송 분포 (Poisson Distribution)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Poisson Distribution", "포아송 분포", "푸아송 분포", "포아송 근사", "Poisson approximation", "소수의 법칙", "law of rare events", "도착률", "arrival rate", "과대산포", "overdispersion"]
description: "넓은 시간이나 공간에 드문드문 흩어져 일어나는 일이, 정해진 구간에 몇 번 일어나는지의 분포다. 1초 동안 서버에 오는 요청 수, 한 페이지의 오타 수가 예다. 평균 하나로 모양이 정해지고, 평균과 분산이 같다. 시도는 아주 많고 각각의 확률은 아주 작은 이항분포의 극한이라 계산이…"
prev_url: "/studies/probability-statistics/geometric-distribution/"
prev_title: "기하분포"
next_url: "/studies/probability-statistics/discrete-distributions-compared/"
next_title: "이항·기하·포아송 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/poisson/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

넓은 시간이나 공간에 드문드문 흩어져 일어나는 일이, 정해진 구간에 몇 번 일어나는지의 분포다. 1초 동안 서버에 오는 요청 수, 한 페이지의 오타 수가 예다. 평균 하나로 모양이 정해지고, 평균과 분산이 같다. 시도는 아주 많고 각각의 확률은 아주 작은 이항분포의 극한이라 계산이 훨씬 간단하다. 하지만 사건들이 몰려서 오거나 서로 영향을 주면 실제 흔들림이 훨씬 커서 맞지 않는다.

</div>


## 예시로 보기

서버에 요청이 1초에 평균 3개 들어온다. 1초를 아주 잘게, 예를 들어 1,000조각으로 나누면 조각마다 요청이 올 확률은 $$0.003$$쯤이고, 조각끼리는 독립이라 볼 수 있다. 그러면 1초 동안의 요청 수는 $$\mathrm{Bin}(1000, 0.003)$$이다. 조각을 한없이 잘게 나눈 극한이 포아송 분포 $$\lambda = 3$$이다. 두 분포의 확률은 값마다 $$3.4 \times 10^{-4}$$ 이내로 같다.

| 요청 수 $$k$$ | 0 | 1 | 2 | 3 | 4 | 6 이상 |
|---|---|---|---|---|---|---|
| $$P(X = k)$$ | 0.050 | 0.149 | 0.224 | 0.224 | 0.168 | 0.084 |

평균 3이 아래 식의 $$\lambda$$다. 요청이 하나도 없는 1초도 5%쯤 있고, 두 배인 6개 이상 몰리는 1초도 8%쯤 있다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$\lambda > 0$$일 때 **포아송 분포** $$\mathrm{Pois}(\lambda)$$를 따르는 $$X$$는

$$P(X = k) = \frac{e^{-\lambda}\lambda^k}{k!}\quad(k = 0, 1, 2, \dots)$$

이고, $$\mathbb{E}[X] = \operatorname{Var}[X] = \lambda$$다[^1].

</div>


확률의 합이 1인 것은 $$e^\lambda$$의 [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/) $$\sum_k\frac{\lambda^k}{k!} = e^\lambda$$ 덕분이다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">이항분포의 포아송 극한</div>

$$\lambda$$를 고정하고 $$p = \frac{\lambda}{n}$$으로 두면, 모든 $$k$$에서 $$n \to \infty$$일 때 $$\binom nk p^k(1 - p)^{n-k} \to \frac{e^{-\lambda}\lambda^k}{k!}$$.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *정리:* $$\binom nk p^k(1-p)^{n-k} = \frac{n(n-1)\cdots(n-k+1)}{n^k}\cdot\frac{\lambda^k}{k!}\cdot\left(1 - \frac\lambda n\right)^n\cdot\left(1 - \frac\lambda n\right)^{-k}$$.
2. *첫째 인수:* $$k$$는 고정이라 $$\frac{n - j}{n} \to 1$$인 인수 $$k$$개의 곱이 1로 간다.
3. *셋째 인수:* [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/)의 $$\left(1 + \frac xn\right)^n \to e^x$$에서 $$x = -\lambda$$로 $$e^{-\lambda}$$.
4. *넷째 인수:* $$1 - \frac\lambda n \to 1$$의 고정된 거듭제곱이라 1로 간다. 곱하면 결론이다. ∎

</details>


**독립인 포아송의 합.** $$X \sim \mathrm{Pois}(\lambda_1)$$, $$Y \sim \mathrm{Pois}(\lambda_2)$$가 독립이면 $$X + Y \sim \mathrm{Pois}(\lambda_1 + \lambda_2)$$다. 두 서버로 오는 요청을 합친 것도 포아송이다.

## 예제

**용량 계획.** 요청이 1초에 평균 3개($$\mathrm{Pois}(3)$$)이고, 1초에 처리할 수 있는 요청 수 $$c$$를 정한다. 넘치는 1초가 1% 미만이 되는 가장 작은 $$c$$는?

1. *꼬리 확률:* $$P(X > c) = 1 - \sum_{k=0}^{c}\frac{e^{-3}3^k}{k!}$$.
2. *값 대입:* $$c = 7$$이면 약 0.0119, $$c = 8$$이면 약 0.0038.
3. *결론:* $$c = 8$$. 평균의 2.7배 용량을 둬야 1% 기준을 맞춘다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: PMF의 합과 평균 = 분산 = $$\lambda$$(세 가지 $$\lambda$$), 예시 표의 값, 용량 계획의 꼬리 확률, 이항분포와의 차이 $$3.4 \times 10^{-4}$$, 카드의 근사값, 독립인 포아송의 합(합성곱 직접 계산) — [12_poisson_verify.py](/Hongs_Blog/studies/probability-statistics/code/12_poisson_verify/)</div>

</div>


## 활용

- **도착 과정.** 요청, 패킷, 전화, 방사능 붕괴처럼 서로 독립이고 드물게 일어나는 사건의 개수 모델. 대기행렬 이론의 기본 가정이다.
- **근사 계산.** 1000명 중 오늘이 생일인 사람 수처럼 $$n$$이 크고 $$p$$가 작은 이항분포는 포아송으로 바로 어림한다.
- **맞지 않는 경우.** 실제 네트워크 트래픽은 몰려서 오는 [버스티 트래픽](/Hongs_Blog/studies/computer-communication/bursty-traffic/)이라, 분산이 평균보다 훨씬 크고 포아송 모델은 넘칠 확률을 크게 과소평가한다[^s1]. 표본의 분산이 평균보다 훨씬 크면(과대산포) 포아송 가정부터 의심한다.

## 연결

- 선수: [이항분포](/Hongs_Blog/studies/probability-statistics/binomial/), [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/)
- 비교: [이항·기하·포아송 비교](/Hongs_Blog/studies/probability-statistics/discrete-distributions-compared/)
- 이어지는 개념: 사건 사이의 대기 시간은 [지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/)를 따른다

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 요청이 1초에 평균 3개인 포아송 과정에서, 어떤 1초 동안 요청이 하나도 없을 확률은?</summary>

**답:** $$P(X = 0) = e^{-3} \approx 0.050$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 불량률 0.2%인 부품 1000개 중 불량이 하나도 없을 확률을 포아송으로 어림하고, 정확한 값과 비교하라.</summary>

**답:** $$\lambda = 1000 \times 0.002 = 2$$라 $$e^{-2} \approx 0.1353$$. 정확한 값 $$0.998^{1000} \approx 0.1351$$과 거의 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 포아송 분포가 이항분포의 극한이라는 것을 직관적으로 설명하라. 무엇을 한없이 늘리고 무엇을 고정하는가?</summary>

**답:** 구간을 $$n$$개의 작은 조각으로 나누고 조각마다 사건이 일어날 확률을 $$\frac\lambda n$$으로 둔다. 평균 $$n \cdot \frac\lambda n = \lambda$$는 고정한 채 조각 수 $$n$$을 늘리면, 한 조각에 두 번 일어나는 일은 무시할 수 있게 되고 사건 수의 분포가 $$\mathrm{Pois}(\lambda)$$로 간다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 4.7절 "Poisson"(PMF, 평균과 분산, 독립인 포아송의 합), 4.8절 "Connections between Poisson and Binomial"(포아송 극한).
[^s1]: 에이전트 보충. 광역 네트워크 트래픽이 포아송 모델과 맞지 않는다는 측정 결과는 Paxson, Floyd, "Wide Area Traffic: The Failure of Poisson Modeling", *IEEE/ACM Transactions on Networking* 3(3), 1995에 있다.
{% endraw %}
