---
layout: "note"
title: "베르누이 시행과 이항분포"
display_title: "베르누이 시행과 이항분포 (Bernoulli Trials and the Binomial Distribution)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Binomial Distribution", "이항분포", "베르누이 시행", "Bernoulli trial", "베르누이 분포", "Bernoulli distribution", "초기하분포", "hypergeometric distribution", "패킷 손실", "packet loss"]
description: "성공과 실패 둘 중 하나만 나오는 시도를 같은 성공 확률로 서로 영향 없이 여러 번 할 때, 성공한 횟수의 분포다. 동전 앞면 수, 손실된 패킷 수, 동시에 접속한 사용자 수가 모두 이 모양이다. \"몇 번째 시도가 성공인가\"의 경우의 수에 각 경우의 확률을 곱해 구하고, 평균은 시…"
prev_url: "/studies/probability-statistics/variance/"
prev_title: "분산과 표준편차"
next_url: "/studies/probability-statistics/geometric-distribution/"
next_title: "기하분포"
math: true
mermaid: false
code_count: 2
permalink: "/studies/probability-statistics/binomial/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

성공과 실패 둘 중 하나만 나오는 시도를 같은 성공 확률로 서로 영향 없이 여러 번 할 때, 성공한 횟수의 분포다. 동전 앞면 수, 손실된 패킷 수, 동시에 접속한 사용자 수가 모두 이 모양이다. "몇 번째 시도가 성공인가"의 경우의 수에 각 경우의 확률을 곱해 구하고, 평균은 시도 수 × 성공 확률이다. 시도들이 서로 영향을 주거나(뽑은 것을 되돌려 놓지 않는 추출), 성공 확률이 시도마다 바뀌면 맞지 않는다.

</div>


## 예시로 보기

패킷 10개를 보내고, 패킷마다 독립으로 10% 확률로 손실된다. 손실 수 $$X$$는?

- 하나도 잃지 않을 확률: $$0.9^{10} \approx 0.349$$.
- 정확히 하나 잃을 확률: 어느 패킷인지 10가지, 각각 $$0.1 \times 0.9^9$$라 $$10 \times 0.1 \times 0.9^9 \approx 0.387$$.
- 하나 이하로 잃을 확률: 두 값의 합 약 0.736.

"어느 패킷인지 10가지"가 아래 식의 $$\binom{n}{k}$$, "$$0.1 \times 0.9^9$$"가 $$p^k(1 - p)^{n - k}$$다. 패킷 하나의 성공·실패가 베르누이 시행이고, 10개를 모은 것이 이항분포다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

성공 확률이 $$p$$인 **베르누이 시행**은 성공이면 1, 실패면 0인 확률변수다. 서로 독립이고 성공 확률이 모두 $$p$$인 베르누이 시행 $$n$$번의 성공 횟수 $$X$$는 **이항분포** $$\mathrm{Bin}(n, p)$$를 따르고,

$$P(X = k) = \binom{n}{k}p^k(1 - p)^{n - k}\quad(k = 0, 1, \dots, n).$$

평균은 $$np$$, 분산은 $$np(1 - p)$$다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">식과 평균·분산의 유도</summary>

1. *PMF:* 성공이 정확히 $$k$$번인 결과 하나(예: 앞 $$k$$번 성공)의 확률은 독립이라 $$p^k(1-p)^{n-k}$$. 성공 자리를 고르는 방법이 $$\binom nk$$가지이고 이 결과들은 서로 배반이라 더한다.
2. *합이 1:* [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)로 $$\sum_k\binom nk p^k(1-p)^{n-k} = (p + (1 - p))^n = 1$$.
3. *평균:* $$X = I_1 + \cdots + I_n$$($$I_j$$는 $$j$$번째 성공의 지시 확률변수). [선형성](/Hongs_Blog/studies/probability-statistics/expectation/)으로 $$\mathbb{E}[X] = np$$.
4. *분산:* $$\operatorname{Var}[I_j] = p - p^2 = p(1 - p)$$이고 $$I_j$$들이 독립이라 [분산이 더해져](/Hongs_Blog/studies/probability-statistics/variance/) $$np(1 - p)$$. ∎

</details>


<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/10_binomial_fig1.svg" alt="그림" loading="lazy">

시도 수 $$n = 10$$은 그대로 두고 $$p$$만 바꾼 그림이다. 봉우리는 평균 $$np$$ 근처에 서고, $$p$$가 0.5에서 멀어질수록 한쪽 끝으로 쏠려 좌우가 비대칭이 된다[^s2].

**해당하지 않는 예.** 카드 52장에서 되돌려 놓지 않고 5장을 뽑을 때 에이스 수는 이항분포가 아니다. 앞에서 에이스를 뽑으면 남은 에이스 비율이 바뀌어 시도들이 독립이 아니기 때문이다. 이것은 초기하분포이고, 에이스가 0장일 확률이 $$\frac{\binom{48}{5}}{\binom{52}{5}} \approx 0.659$$로 이항분포 $$\left(\frac{12}{13}\right)^5 \approx 0.670$$과 다르다. 전체가 뽑는 수보다 훨씬 크면 두 분포는 가까워진다.

## 예제

**통계적 다중화의 넘침 확률.** 1 Mbps 링크를 100 kbps씩 쓰는 사용자 35명이 공유하고, 각자 시간의 10%만 독립으로 활동한다.

1. *모델:* 동시에 활동하는 사용자 수 $$X \sim \mathrm{Bin}(35, 0.1)$$.
2. *평균과 흔들림:* 평균 3.5명, 표준편차 $$\sqrt{35 \times 0.1 \times 0.9} \approx 1.77$$명.
3. *넘침:* 링크는 10명까지 감당하므로 넘칠 확률은 $$P(X \ge 11) = \sum_{k=11}^{35}\binom{35}{k}0.1^k 0.9^{35-k} \approx 0.00042$$.
4. *결론:* 고정 할당이면 10명만 받는데, 넘칠 확률 0.04%를 받아들이면 35명을 받는다. [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)가 회선 교환보다 많은 사용자를 받는 수학적 근거다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/10_binomial_fig2.svg" alt="그림" loading="lazy">

막대 대부분이 0~8명에 몰려 있다. 링크 한계(점선) 오른쪽의 막대는 너무 작아 거의 보이지 않는다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: PMF의 합·평균·분산($$n \le 12$$, 세 가지 $$p$$, 분수로 정확히, $$2^6$$개 결과 전수), 패킷 손실 확률, 넘침 확률 0.000424와 표준편차, 초기하분포와의 차이, 카드의 값 — [10_binomial_verify.py](/Hongs_Blog/studies/probability-statistics/code/10_binomial_verify/)</div>

</div>


## 활용

- **네트워크.** 패킷 손실 수, 오류가 난 비트 수, 동시 접속자 수.
- **신뢰성.** 서버 $$n$$대 중 $$k$$대 이상이 살아 있어야 하는 다수결 복제(예: 5대 중 3대)의 가용성은 이항분포의 꼬리 합이다.
- **흔한 실수.** 독립이 아닌 시도(같은 원인으로 한꺼번에 실패, 비복원 추출)에 이항분포를 쓰는 것. [독립](/Hongs_Blog/studies/probability-statistics/independence/)의 공통 원인 예제처럼 꼬리 확률이 크게 틀린다.

## 연결

- 선수: [분산과 표준편차](/Hongs_Blog/studies/probability-statistics/variance/), [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)
- 다른 과목에서: [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)의 넘칠 확률
- 이어지는 개념: [포아송 분포](/Hongs_Blog/studies/probability-statistics/poisson/)(시도가 많고 확률이 작을 때의 극한)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 공정한 동전을 5번 던져 앞면이 정확히 2번 나올 확률은?</summary>

**답:** $$\binom52 \left(\frac12\right)^5 = \frac{10}{32} = 0.3125$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 이항분포의 식에 $$\binom{n}{k}$$가 곱해지는 이유는?</summary>

**답:** "성공 $$k$$번"은 성공이 어느 자리에 있느냐에 따라 서로 다른 결과들로 이루어진다. 자리를 고르는 방법이 $$\binom nk$$가지이고, 각 결과의 확률은 모두 $$p^k(1-p)^{n-k}$$로 같으며 서로 배반이라 더한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 사용자 35명이 각자 독립으로 10% 확률로 활동할 때, 동시 활동자 수의 평균과 표준편차는?</summary>

**답:** 평균 $$35 \times 0.1 = 3.5$$, 분산 $$35 \times 0.1 \times 0.9 = 3.15$$, 표준편차 약 1.77.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 3.3절 "Bernoulli and Binomial", 3.4절 "Hypergeometric", 4.6절 "Variance"(이항분포의 분산).
[^s1]: 에이전트 보충. 링크 용량과 사용자 수는 컴퓨터 통신 문서의 예제와 같은 값이다. 넘침 확률은 10_binomial_verify.py로 다시 계산했다.
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [10_binomial_plot.py](/Hongs_Blog/studies/probability-statistics/code/10_binomial_plot/)로 그렸고, 그림에 쓴 값($$P(X = 0) = 0.349$$, $$P(X = 1) = 0.387$$, $$P(X \ge 11) = 0.000424$$)을 같은 코드로 확인했다.
{% endraw %}
