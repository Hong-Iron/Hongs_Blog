---
layout: "note"
title: "가설검정과 p값"
display_title: "가설검정과 p값 (Hypothesis Testing and p-values)"
kind: "concept"
kind_label: "기법"
num: "32"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Hypothesis Testing", "가설검정", "p값", "p-value", "귀무가설", "null hypothesis", "대립가설", "alternative hypothesis", "유의수준", "significance level", "제1종 오류", "type I error", "제2종 오류", "type II error", "검정력", "power", "z검정", "z-test", "순열 검정", "permutation test", "다중 검정", "multiple testing", "본페로니 보정", "Bonferroni correction", "A/B 테스트", "A/B testing"]
description: "\"차이가 없다\"는 기본 가설을 세우고, 그 가설이 맞는데도 지금만큼(또는 더) 극단적인 결과가 우연히 나올 확률을 계산한다. 이 확률(p값)이 아주 작으면 \"우연으로 보기 어렵다\"며 기본 가설을 버린다. 새 기능이 전환율을 올렸는지, 새 버전이 느려졌는지를 판정하는 A/B 테스트의…"
prev_url: "/studies/probability-statistics/confidence-intervals/"
prev_title: "신뢰구간"
next_url: "/studies/probability-statistics/bayesian-inference/"
next_title: "베이즈 추론과 MAP"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/hypothesis-testing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"차이가 없다"는 기본 가설을 세우고, 그 가설이 맞는데도 지금만큼(또는 더) 극단적인 결과가 우연히 나올 확률을 계산한다. 이 확률(p값)이 아주 작으면 "우연으로 보기 어렵다"며 기본 가설을 버린다. 새 기능이 전환율을 올렸는지, 새 버전이 느려졌는지를 판정하는 A/B 테스트의 도구다. 하지만 p값은 가설이 참일 확률이 아니고, 효과가 얼마나 큰지도 말해 주지 않으며, 검정을 여러 번 하면 아무 효과가 없어도 우연히 "유의한" 결과가 나온다.

</div>


## 예시로 보기

기존 페이지(A)와 새 페이지(B)를 1,000명씩에게 보여 줬더니 A는 100명(10%), B는 130명(13%)이 가입했다. 3%p 차이는 진짜일까, 우연일까?

- 차이가 없다면 두 그룹은 같은 비율(합쳐서 $$\frac{230}{2000} = 11.5\%$$)을 따른다.
- 그 가정 아래 두 비율의 차이는 평균 0, 표준오차 약 0.0143으로 흔들린다.
- 관측한 차이 0.03은 표준오차의 약 2.1배이고, 이 정도 이상(양쪽 방향) 벌어질 확률은 약 3.5%다.

3.5%는 흔하지 않으니 "차이가 없다"를 버린다(유의수준 5% 기준). "차이가 없다"가 아래 정의의 귀무가설 $$H_0$$, 2.1이 검정통계량, 3.5%가 p값이다.

## 정의

**적용 조건.** 비교하려는 두 상황과, 차이가 없을 때 검정통계량이 어떻게 흔들리는지(귀무분포)를 계산하거나 모의실험할 수 있을 때.

**알아보는 신호.** "유의미한 차이인가", "우연으로 설명되는가", "성능이 나빠졌다고 할 수 있는가".

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**귀무가설** $$H_0$$(기본 입장, 보통 "효과 없음")과 **대립가설** $$H_1$$을 세운다. 자료에서 계산한 **검정통계량** $$T$$에 대해, **p값**은 $$H_0$$이 참일 때 $$T$$가 관측값만큼 또는 더 극단적으로 나올 확률이다. p값이 미리 정한 **유의수준** $$\alpha$$(흔히 0.05) 이하면 $$H_0$$을 기각한다[^1].

</div>


| | $$H_0$$ 참 | $$H_0$$ 거짓 |
|---|---|---|
| 기각함 | 제1종 오류(확률 $$\alpha$$ 이하로 통제) | 맞음(확률 = **검정력**) |
| 기각 안 함 | 맞음 | 제2종 오류 |

**두 비율의 z검정.** 그룹마다 $$n$$명, 성공 $$a$$, $$b$$명이면 합동 비율 $$\hat p = \frac{a + b}{2n}$$, 표준오차 $$\sqrt{\hat p(1 - \hat p)\frac2n}$$, $$z = \frac{(b - a)/n}{\text{표준오차}}$$, 양측 p값 $$2(1 - \Phi(\vert z\vert ))$$다. 정규 근사는 [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)에서 나온다.

**신뢰구간과의 관계.** 차이의 95% [신뢰구간](/Hongs_Blog/studies/probability-statistics/confidence-intervals/)이 0을 포함하지 않는 것과, 유의수준 5% 양측 검정이 기각하는 것은 (같은 표준오차를 쓰면) 같은 판정이다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">$$H_0$$이 참이면 p값은 균등분포다(연속인 검정통계량)</summary>

1. *정의:* 한쪽 검정에서 $$p = 1 - F_0(T)$$($$F_0$$은 $$H_0$$ 아래 $$T$$의 CDF).
2. *확률 적분 변환:* $$F_0$$이 연속이면 $$F_0(T)$$는 $$\mathrm{Unif}(0, 1)$$을 따른다([균등분포의 보편성](/Hongs_Blog/studies/probability-statistics/uniform-exponential/)의 역방향).
3. *결론:* $$p = 1 - F_0(T)$$도 균등분포라 $$P(p \le \alpha) = \alpha$$. "p ≤ 0.05면 기각"하면 제1종 오류가 정확히 5%다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3단계에서 "제1종 오류 = α"가 나오는 이유는?</summary>

제1종 오류는 $$H_0$$이 참인데 기각하는 것, 곧 $$H_0$$ 아래에서 $$p \le \alpha$$인 사건이다. $$p$$가 균등분포라 그 확률이 $$\alpha$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 이 성질이 다중 검정의 위험을 어떻게 설명하는가?</summary>

효과가 전혀 없는 검정 20개를 독립으로 하면 각각의 p값이 균등분포라, 적어도 하나가 0.05 아래로 떨어질 확률은 $$1 - 0.95^{20} \approx 0.64$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 가설검정의 핵심 아이디어는?</summary>

귀류법의 확률판이다. "효과가 없다"고 가정하고 관측 결과가 그 가정 아래 얼마나 드문지 계산해, 너무 드물면 가정을 의심한다. 다만 귀류법과 달리 "드물다"는 모순이 아니라서 틀릴 확률($$\alpha$$)이 남는다.

</details>


## 예제

**대표 문제 1: A/B 테스트(예시의 계산).**

1. *가설:* $$H_0$$: 두 전환율이 같다. $$H_1$$: 다르다(양측).
2. *통계량:* $$\hat p = 0.115$$, 표준오차 $$\sqrt{0.115 \times 0.885 \times \frac{2}{1000}} \approx 0.01427$$, $$z = \frac{0.03}{0.01427} \approx 2.10$$.
3. *p값:* $$2(1 - \Phi(2.10)) \approx 0.035$$. 두 그룹의 표를 무작위로 섞어 다시 나누는 순열 검정(모의실험 4,000회)으로도 비슷한 값이 나온다.
4. *결론과 한계:* 5% 수준에서 기각. 하지만 차이의 크기는 신뢰구간 $$0.03 \pm 1.96 \times 0.0143$$, 곧 약 0.2%p에서 5.8%p로 불확실성이 크다.

**대표 문제 2: 검정력과 표본 크기.** 참 전환율이 정말 10%와 13%라면, 1,000명씩으로는 5% 수준에서 차이를 잡아낼 확률(검정력)이 약 56%에 불과하다. 2,000명씩이면 80%를 넘는다. 실험 전에 원하는 검정력으로 표본 크기를 정해야, 효과가 있는데도 "유의하지 않음"으로 놓치는 일을 줄인다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: A/B의 합동 비율·표준오차·z·p값과 순열 검정, $$H_0$$ 아래 p < 0.05 비율 약 5%(A/A 테스트 3,000회), 다중 검정 0.64(식과 모의실험), 검정력 1,000명 약 0.56과 2,000명에서의 증가, 예제 사다리의 값 — [32_hypothesis-testing_verify.py](/Hongs_Blog/studies/probability-statistics/code/32_hypothesis-testing_verify/)</div>

</div>


## 활용

- **A/B 테스트.** 기능 출시 판단, 추천 알고리즘 비교. 실험 전에 지표·유의수준·표본 크기를 정해 두고, 결과를 보며 도중에 멈추지 않는다(멈춘 시점을 고르면 제1종 오류가 커진다).
- **성능 회귀 검사.** 새 빌드의 지연 시간이 기준보다 유의하게 커졌는지 CI에서 판정한다.
- **다중 검정 보정.** 지표 $$m$$개를 한꺼번에 보면 각 검정을 $$\frac{\alpha}{m}$$ 수준으로 하는 본페로니 보정 같은 방법을 쓴다.
- 연습: [가설검정 예제 사다리](/Hongs_Blog/studies/probability-statistics/hypothesis-testing-ladder/)

## 연결

- 선수: [신뢰구간](/Hongs_Blog/studies/probability-statistics/confidence-intervals/)
- 근거: [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)(정규 근사), [베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/)(p값과 "가설이 참일 확률"의 차이)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"p = 0.03이면 귀무가설이 참일 확률이 3%다"</div>

틀렸다. p값이 작을수록 "효과가 있다"는 확신이 커지는 느낌이라 이렇게 읽기 쉽다. 하지만 p값은 $$P(\text{이만큼 극단적인 자료} \mid H_0)$$이고, 알고 싶은 $$P(H_0 \mid \text{자료})$$와는 방향이 반대다. 둘을 오가려면 사전확률이 필요하다([베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/)). 미국통계학회도 p값은 가설이 참일 확률이 아니고, 효과의 크기나 중요성을 재지 않는다고 밝혔다[^2]. 효과 크기와 신뢰구간을 함께 보고한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 양측 검정의 검정통계량이 $$z = 2.1$$이다. p값은? 유의수준 5%에서 결론은?</summary>

**답:** $$2(1 - \Phi(2.1)) \approx 0.036$$. 0.05보다 작아 귀무가설을 기각한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** p값이 "귀무가설이 참일 확률"이 아닌 이유를 조건부 확률로 설명하라.</summary>

**답:** p값은 귀무가설이 참이라고 **가정한 상태에서** 이만큼 극단적인 자료가 나올 확률 $$P(\text{자료} \mid H_0)$$다. 귀무가설이 참일 확률은 $$P(H_0 \mid \text{자료})$$로 조건의 방향이 반대이고, 이것은 사전확률 없이는 계산할 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 효과가 전혀 없는 지표 20개를 각각 유의수준 5%로 독립 검정하면, 적어도 하나가 "유의"하게 나올 확률은? 본페로니 보정을 하면 각 검정의 기준은?</summary>

**답:** $$1 - 0.95^{20} \approx 0.64$$. 본페로니는 각 검정을 $$\frac{0.05}{20} = 0.0025$$ 수준으로 해 전체 오류를 5% 이하로 묶는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** (가) 새 기능이 효과가 없는데 효과가 있다고 결론 내림 (나) 새 기능이 실제로 효과가 있는데 "유의하지 않음"으로 끝남. 각각 어떤 오류이고 무엇으로 줄이는가?</summary>

**답:** (가) 제1종 오류. 유의수준 $$\alpha$$를 낮추거나 다중 검정을 보정해 줄인다. (나) 제2종 오류. 표본 크기를 늘려 검정력을 높여 줄인다. 같은 표본에서 한쪽을 줄이면 다른 쪽이 커진다.

</details>


[^1]: Wasserman, *All of Statistics*, "Hypothesis Testing and p-values" 장(귀무·대립가설, 유의수준, 검정력, p값, 순열 검정, 다중 검정과 본페로니).
[^2]: Wasserstein, Lazar, "The ASA Statement on p-Values: Context, Process, and Purpose", *The American Statistician* 70(2), 2016.
{% endraw %}
