---
layout: "note"
title: "최대가능도 예제 사다리"
display_title: "최대가능도 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "30"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
description: "사용 개념: 최대가능도 추정, 도함수의 활용과 최적화."
prev_url: "/studies/probability-statistics/expectation-ladder/"
prev_title: "기댓값 선형성 예제 사다리"
next_url: "/studies/probability-statistics/hypothesis-testing-ladder/"
next_title: "가설검정 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/probability-statistics/mle-ladder/"
---
{% raw %}
사용 개념: [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/), [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/).

MLE 문제는 모델만 바뀌고 절차는 같다. 핵심은 **모수와 상관없는 항을 일찍 버리고, 끝에서 최대인지 확인하는 것**이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *모델과 가능도:* 관측마다 확률(밀도) $$f(x_i; \theta)$$를 쓰고 독립이므로 곱한다.
2. *로그 가능도:* 로그를 취해 합으로 바꾸고, $$\theta$$와 무관한 항은 "상수"로 묶는다.
3. *미분해서 0:* $$\ell'(\theta) = 0$$을 풀어 후보를 얻는다.
4. *최대 확인과 해석:* 2계 도함수의 부호나 경계를 확인하고, 결과가 직관(표본평균 등)과 맞는지 본다.

## 문제 1 · 완전한 풀이

분마다 들어온 요청 수 $$2, 3, 1, 4, 0$$을 포아송 분포로 모델링할 때 $$\lambda$$의 MLE는?

1. *모델과 가능도:* $$L(\lambda) = \prod_i\frac{e^{-\lambda}\lambda^{x_i}}{x_i!}$$.
2. *로그 가능도:* $$\ell(\lambda) = (\sum x_i)\ln\lambda - 5\lambda + \text{상수} = 10\ln\lambda - 5\lambda + \text{상수}$$.
3. *미분해서 0:* $$\frac{10}{\lambda} - 5 = 0$$, $$\hat\lambda = 2$$.
4. *확인:* $$\ell'' = -\frac{10}{\lambda^2} < 0$$이라 최대. 표본평균과 같다.

## 문제 2 · 마지막 하위목표만 빈칸

대기 시간 $$1, 3, 2, 2$$초를 지수분포 $$\mathrm{Exp}(\lambda)$$로 모델링할 때 $$\lambda$$의 MLE는?

1. *모델과 가능도:* $$L(\lambda) = \prod_i\lambda e^{-\lambda x_i} = \lambda^4e^{-8\lambda}$$.
2. *로그 가능도:* $$\ell(\lambda) = 4\ln\lambda - 8\lambda$$.
3. *미분해서 0:* $$\frac4\lambda - 8 = 0$$, $$\hat\lambda = 0.5$$.
4. *최대 확인과 해석:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\ell''(\lambda) = -\frac{4}{\lambda^2} < 0$$이라 최대다. $$\hat\lambda = 0.5$$는 "초당 0.5번"이고, 평균 대기 시간의 MLE는 불변성으로 $$\frac{1}{0.5} = 2$$초 = 표본평균이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

측정값 $$4, 6, 5, 9$$가 표준편차 2인 정규분포 $$\mathcal{N}(\mu, 4)$$에서 나왔다. $$\mu$$의 MLE는?

1. *모델과 가능도:* $$L(\mu) = \prod_i\frac{1}{2\sqrt{2\pi}}\exp\left(-\frac{(x_i - \mu)^2}{8}\right)$$.
2. *로그 가능도:* ______
3. *미분해서 0:* ______
4. *최대 확인과 해석:* $$\ell'' = -\frac{4}{4} = -1 < 0$$이라 최대. 제곱 오차를 최소로 하는 값이 곧 MLE다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$\ell(\mu) = -\frac18\sum(x_i - \mu)^2 + \text{상수}$$.
3. $$\ell'(\mu) = \frac14\sum(x_i - \mu) = 0$$에서 $$\hat\mu = \bar x = \frac{24}{4} = 6$$.

</details>


## 문제 4 · 독립 문제

어떤 작업을 성공할 때까지 시도한 횟수가 네 번의 실험에서 $$1, 3, 2, 4$$였다. 시도마다 성공 확률 $$p$$인 기하분포(시행 수)로 볼 때 $$p$$의 MLE는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$L(p) = \prod_i(1 - p)^{x_i - 1}p = p^4(1 - p)^{10 - 4}$$. $$\ell = 4\ln p + 6\ln(1 - p)$$, $$\frac4p - \frac{6}{1 - p} = 0$$에서 $$\hat p = 0.4 = \frac{4}{10}$$. "성공 4번 / 시도 10번"이라는 직관과 맞는다.

**흔한 오답:** 평균 시도 수 2.5를 그대로 $$p$$로 쓰는 것. 기하분포의 평균은 $$\frac1p$$이라 $$\hat p = \frac{1}{2.5}$$다.

</details>


## 변형 문제

$$0$$과 $$\theta$$ 사이 균등분포에서 $$0.3, 0.9, 0.5$$를 관측했다. $$\theta$$의 MLE는? 미분해서 0으로 놓는 방법이 왜 통하지 않는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\theta$$가 관측값 중 가장 큰 0.9보다 작으면 그 값이 나올 수 없어 $$L = 0$$이다. $$\theta \ge 0.9$$에서는 $$L(\theta) = \theta^{-3}$$로 $$\theta$$가 커질수록 줄어든다. 그래서 $$\hat\theta = 0.9$$(최댓값)이다. 최댓점이 가능한 범위의 경계에 있고 거기서 $$L$$이 불연속이라, 도함수가 0인 점이 없다. 미분은 최댓점을 찾는 한 가지 도구일 뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 추정값과 2계 도함수 부호, 균등분포 가능도의 최댓점(격자 탐색) — [30_mle_verify.py](/Hongs_Blog/studies/probability-statistics/code/30_mle_verify/)</div>

</div>


[^1]: Wasserman, *All of Statistics*, "Parametric Inference" 장.
{% endraw %}
