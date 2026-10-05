---
layout: "note"
title: "가설검정 예제 사다리"
display_title: "가설검정 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "32"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
description: "사용 개념: 가설검정과 p값, 중심극한정리(정규 근사)."
prev_url: "/studies/probability-statistics/mle-ladder/"
prev_title: "최대가능도 예제 사다리"
next_url: "/studies/probability-statistics/pca-ladder/"
next_title: "주성분 분석 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/probability-statistics/hypothesis-testing-ladder/"
---
{% raw %}
사용 개념: [가설검정과 p값](/Hongs_Blog/studies/probability-statistics/hypothesis-testing/), [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)(정규 근사).

검정 문제의 핵심은 **"차이가 없다면 통계량이 어떻게 흔들리는가"를 먼저 세우는 것**이다. 계산보다 가설과 한쪽·양쪽의 선택에서 더 자주 틀린다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *가설 세우기:* 귀무가설 $$H_0$$(효과 없음)과 대립가설 $$H_1$$을 쓰고, 한쪽인지 양쪽인지 정한다.
2. *통계량과 귀무분포:* $$H_0$$ 아래에서 통계량의 평균과 표준오차를 구하고 표준화한다.
3. *p값:* 관측값만큼 또는 더 극단적인 쪽의 확률을 구한다(양쪽이면 두 꼬리).
4. *결론과 한계:* 유의수준과 비교하고, 효과 크기·근사의 정확도·다중 검정을 함께 말한다.

## 문제 1 · 완전한 풀이

동전을 100번 던져 앞면이 60번 나왔다. 이 동전이 공정하지 않다고 할 수 있는가(유의수준 5%)?

1. *가설:* $$H_0$$: $$p = 0.5$$. $$H_1$$: $$p \ne 0.5$$(양쪽. 어느 쪽으로 치우쳤는지 미리 몰랐다).
2. *통계량:* $$H_0$$ 아래 앞면 수는 평균 50, 표준편차 5. 연속성 보정으로 $$z = \frac{59.5 - 50}{5} = 1.9$$.
3. *p값:* $$2(1 - \Phi(1.9)) \approx 0.057$$. 이항분포로 정확히 계산하면 0.057(0.0569)이다.
4. *결론:* 0.05보다 커서 기각하지 않는다. "공정하다"가 증명된 것이 아니라, 이 자료로는 치우침을 확신할 수 없다는 뜻이다.

## 문제 2 · 마지막 하위목표만 빈칸

A/B 테스트에서 1,000명씩 보여 주고 A는 100명, B는 130명이 가입했다.

1. *가설:* $$H_0$$: 두 전환율이 같다. $$H_1$$: 다르다(양쪽).
2. *통계량:* 합동 비율 0.115, 표준오차 0.01427, $$z = \frac{0.03}{0.01427} \approx 2.10$$.
3. *p값:* $$2(1 - \Phi(2.10)) \approx 0.035$$.
4. *결론과 한계:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

5% 수준에서 귀무가설을 기각한다. 다만 차이의 95% 신뢰구간은 약 0.2%p~5.8%p로 넓어 효과 크기는 불확실하다. 여러 지표를 함께 봤다면 보정이 필요하고, 결과를 보다가 중간에 멈춘 실험이면 p값이 실제보다 작게 나온다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

기존 버전의 응답 시간은 평균 200 ms, 표준편차 20 ms로 알려져 있다. 새 버전에서 36번 쟀더니 평균 208 ms였다. 새 버전이 느려졌는가(유의수준 5%)?

1. *가설:* ______
2. *통계량:* ______
3. *p값:* 한쪽 $$1 - \Phi(2.4) \approx 0.0082$$.
4. *결론:* 0.05보다 작아 "느려졌다"고 판정한다. 8 ms 차이가 사용자에게 의미 있는지는 따로 판단한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$H_0$$: 평균 = 200. $$H_1$$: 평균 > 200(한쪽. 관심은 느려졌는가뿐이고, 이것은 자료를 보기 **전에** 정해야 한다).
2. 표준오차 $$\frac{20}{\sqrt{36}} = \frac{10}{3}$$, $$z = \frac{208 - 200}{10/3} = 2.4$$.

</details>


## 문제 4 · 독립 문제

공급사는 불량률이 2%라고 한다. 부품 1,000개를 검사했더니 30개가 불량이었다. 불량률이 주장보다 높다고 할 수 있는가? 정규 근사와 정확한 이항 계산을 비교하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$H_0$$: $$p = 0.02$$, $$H_1$$: $$p > 0.02$$. $$H_0$$ 아래 불량 수는 평균 20, 표준편차 $$\sqrt{1000 \times 0.02 \times 0.98} \approx 4.43$$. 정규 근사로 $$z = \frac{10}{4.43} \approx 2.26$$, 한쪽 p값 약 0.012. 연속성 보정을 하면 약 0.016. 이항분포로 정확히 $$P(X \ge 30)$$을 계산하면 약 0.021이다. 어느 쪽이든 5% 수준에서 기각한다.

**주의:** 확률이 작은 이항분포는 오른쪽으로 치우쳐서, 정규 근사가 꼬리 확률을 작게 잡는다. 경계에 가까운 판정이면 정확한 계산을 쓴다.

</details>


## 변형 문제

한 번의 실험에서 지표 20개를 각각 유의수준 5%로 검정했더니 하나가 p = 0.03이었다. 이 결과를 어떻게 봐야 하는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

효과가 전혀 없어도 20개 중 적어도 하나가 p < 0.05일 확률은 $$1 - 0.95^{20} \approx 0.64$$라, 하나쯤 유의한 것은 흔한 일이다. 본페로니 보정 기준 $$\frac{0.05}{20} = 0.0025$$와 비교하면 유의하지 않다. 그 지표에 대해 새 실험으로 다시 확인해야 한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 z값과 p값, 정확한 이항 계산, 다중 검정 확률 — [32_hypothesis-testing_verify.py](/Hongs_Blog/studies/probability-statistics/code/32_hypothesis-testing_verify/)</div>

</div>


[^1]: Wasserman, *All of Statistics*, "Hypothesis Testing and p-values" 장.
{% endraw %}
