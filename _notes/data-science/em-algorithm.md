---
layout: "note"
title: "EM 알고리즘"
display_title: "EM 알고리즘 (Expectation-Maximization)"
kind: "concept"
kind_label: "알고리즘"
num: "30"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["EM", "Expectation-Maximization", "기댓값 최대화", "E 단계", "E-step", "M 단계", "M-step", "로그가능도", "Log-likelihood"]
description: "가우스 혼합 모델의 매개변수를 자료에서 찾는 방법이다. \"각 점이 어느 무리에서 왔는지\"를 알면 무리마다 평균과 퍼짐을 바로 계산할 수 있고, 반대로 평균과 퍼짐을 알면 각 점이 어느 무리에서 왔을 확률을 계산할 수 있다. 둘 다 모르니 아무렇게나 시작해 두 계산을 번갈아 되풀이한…"
prev_url: "/studies/data-science/gaussian-mixture-model/"
prev_title: "가우스 혼합 모델"
next_url: "/studies/data-science/dbscan/"
next_title: "DBSCAN"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/em-algorithm/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가우스 혼합 모델의 매개변수를 자료에서 찾는 방법이다. "각 점이 어느 무리에서 왔는지"를 알면 무리마다 평균과 퍼짐을 바로 계산할 수 있고, 반대로 평균과 퍼짐을 알면 각 점이 어느 무리에서 왔을 확률을 계산할 수 있다. 둘 다 모르니 아무렇게나 시작해 두 계산을 번갈아 되풀이한다. 되풀이할 때마다 자료가 나올 가능성은 줄지 않지만, 가장 좋은 답이 아닌 곳에 멈출 수 있어 처음 값이 중요하다.

</div>


## 예시로 보기

[GMM](/Hongs_Blog/studies/data-science/gaussian-mixture-model/)의 책임도를 계산하려면 무리별 평균, 분산, 비중이 필요한데, 그것을 구하려면 어느 점이 어느 무리인지 알아야 한다. 닭이 먼저냐 달걀이 먼저냐다.

1차원 점 0, 1, 2, 6, 7, 8을 두 무리로 나눈다. 처음 평균 1과 2, 분산 1, 비중 $$\frac12$$로 시작한다[^s1].

**E 단계 (책임도).** 무리 1의 책임도를 점마다 계산한다.

| 점 | 0 | 1 | 2 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|
| 무리 1 책임도 | 0.818 | 0.622 | 0.378 | 0.011 | 0.004 | 0.002 |

점 0은 평균 1에 더 가까워 무리 1의 책임이 크고, 6, 7, 8은 평균 2 쪽(무리 2)이 훨씬 그럴듯하다.

**M 단계 (다시 맞추기).** 책임도를 무게로 삼아 무리마다 가중 평균, 가중 분산, 비중을 다시 계산한다.

| | 평균 | 분산 | 비중 |
|---|---|---|---|
| 무리 1 | 0.809 | 0.885 | 0.306 |
| 무리 2 | 5.405 | 7.076 | 0.694 |

무리 2의 평균이 2에서 5.4로 크게 움직였다. 이를 되풀이하면 평균 1과 7, 비중 $$\frac12$$씩으로 다가간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 두 표, 수렴값, 자료 2,000개에서 매개변수 되찾기, 무작위 자료 100개에서 로그가능도가 한 번도 줄지 않음 — [30_em-gmm_impl.py](/Hongs_Blog/studies/data-science/code/30_em-gmm_impl/)</div>

</div>


## 정의

GMM의 매개변수를 EM으로 추정하는 순서는 다음과 같다[^1]. ① 매개변수를 정한다 ② 군집 배정(책임도)을 계산한다 ③ 새 배정으로 매개변수를 고친다 ④ 수렴할 때까지 되풀이한다.

- **E 단계**(기댓값): 지금 매개변수로 각 점의 군집 소속 확률을 계산한다. 어느 가우스 분포가 각 점을 만들었는지를 사후 확률로 나눠 준다.
- **M 단계**(최대화): 그 확률을 놓고, 자료를 만들 가능성(가능도)이 가장 커지도록 매개변수를 고친다.

### 의사코드

슬라이드의 식을 그대로 옮긴다[^2][^3].

```
μ_α, Σ_α는 무작위로, π_α는 1/k로 정한다
repeat
    E 단계: 모든 i, α에 대해
        [z_i]_α = π_α N(x_i | μ_α, Σ_α) / Σ_l π_l N(x_i | μ_l, Σ_l)
    M 단계: α = 1..k에 대해
        μ_α = Σ_i [z_i]_α x_i / Σ_i [z_i]_α                         # 새 중심
        Σ_α = Σ_i [z_i]_α (x_i − μ_α)(x_i − μ_α)ᵀ / Σ_i [z_i]_α        # 새 모양
        π_α = (1/n) Σ_i [z_i]_α                                      # 새 비중
until 수렴
```

M 단계는 책임도를 무게로 한 평균과 공분산이다. 책임도가 큰 점일수록 그 군집의 계산에 많이 들어간다[^3].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 7-1 슬라이드 p.28 "$$\pi_\alpha$$ is initialized $$1/n$$" / 문제점: $$\pi_\alpha$$는 군집 $$k$$개의 비중이라 합이 1이어야 한다. $$1/n$$($$n$$은 점 수)으로 두면 합이 $$k/n$$이 된다. M 단계 식 $$\pi_\alpha = \frac1n\sum_i[\mathbf z_i]_\alpha$$의 $$\frac1n$$과 섞인 것으로 보인다 / 수정안: "$$\pi_\alpha$$ is initialized $$1/k$$" / 근거: $$\sum_\alpha \pi_\alpha = 1$$(p.25). 30_em-gmm_impl.py는 $$1/k$$로 시작한다

</div>


### 정확성: 가능도는 줄지 않는다

**주장.** 매 반복에서 로그가능도 $$\ell = \sum_i \log\sum_\alpha \pi_\alpha\mathcal N(\mathbf x_i \mid \boldsymbol\mu_\alpha, \Sigma_\alpha)$$는 줄지 않는다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치</summary>

1. **아래 경계.** 아무 확률 $$q_{i\alpha}$$($$\sum_\alpha q_{i\alpha} = 1$$)에 대해 $$\log\sum_\alpha \pi_\alpha\mathcal N_{i\alpha} = \log\sum_\alpha q_{i\alpha}\frac{\pi_\alpha\mathcal N_{i\alpha}}{q_{i\alpha}} \ge \sum_\alpha q_{i\alpha}\log\frac{\pi_\alpha\mathcal N_{i\alpha}}{q_{i\alpha}}$$. — 로그는 오목해서 평균의 로그 ≥ 로그의 평균(옌센 부등식)
2. **E 단계는 경계를 딱 붙인다.** $$q_{i\alpha}$$를 책임도 $$[\mathbf z_i]_\alpha$$로 두면 $$\frac{\pi_\alpha\mathcal N_{i\alpha}}{q_{i\alpha}}$$가 $$\alpha$$에 상관없이 $$\sum_l\pi_l\mathcal N_{il}$$로 같아져, 1단계의 부등호가 등호가 된다. — 대입
3. **M 단계는 경계를 올린다.** $$q$$를 고정하고 오른쪽 식을 매개변수에 대해 최대화한다. 그 답이 위 의사코드의 가중 평균·가중 공분산·비중이다. — 미분과 최소화
4. **합치기.** 옛 매개변수에서 $$\ell_{\text{옛}}$$ = 경계(2단계) ≤ 새 매개변수의 경계(3단계) ≤ $$\ell_{\text{새}}$$(1단계). ∎

[증명 스케치] 3단계의 최댓값 계산은 생략했다. Bishop, *Pattern Recognition and Machine Learning*, 9.2~9.4절을 따른다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에 옌센 부등식을 쓰는 이유</summary>

로그 안의 합 $$\log\sum$$은 다루기 어렵다. 부등식으로 합을 로그 밖으로 꺼내면 $$\sum\log$$가 되어, 각 군집의 식이 따로 떨어져 M 단계에서 쉽게 최대화된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 2단계에서 책임도를 고르면 등호가 되는 이유</summary>

옌센 부등식은 평균 내는 값들이 모두 같을 때 등호다. 책임도로 나누면 $$\frac{\pi_\alpha\mathcal N_{i\alpha}}{[\mathbf z_i]_\alpha} = \sum_l\pi_l\mathcal N_{il}$$로 모든 $$\alpha$$에서 같은 값이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. "줄지 않는다"가 "가장 좋은 답에 간다"는 뜻이 아닌 이유</summary>

매 단계가 지금 위치 근처의 경계만 올린다. 가능도에 봉우리가 여럿이면 처음 값이 가까운 봉우리에서 멈춘다(국소 최적). 그래서 처음 값을 바꿔 여러 번 돌린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

어려운 목적 함수 아래에 다루기 쉬운 경계를 깔고(E), 그 경계를 올린다(M). 경계가 현재 위치에서 목적 함수에 붙어 있으므로 경계를 올리면 목적 함수도 올라간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

빠진 값이 있는 자료의 최대가능도 추정, 은닉 마르코프 모델의 학습(바움-웰치), 그리고 하드 배정 버전인 [k-평균](/Hongs_Blog/studies/data-science/k-means/)(배정 = E, 평균 = M).

</details>


### 복잡도

한 번 반복에 점 $$n$$개와 군집 $$k$$개의 책임도를 모두 계산한다. $$d$$차원 공분산을 쓰면 가우스 밀도 계산에 역행렬과 행렬식이 들어 $$O(nkd^2 + kd^3)$$이다[^s1]. 차원이 크면 공분산 추정이 불안정해진다[^4].

## 활용

- 구현: [30_em-gmm_impl.py](/Hongs_Blog/studies/data-science/code/30_em-gmm_impl/)(1차원)
- 처음 값으로 k-평균의 결과를 쓰는 경우가 많다(사이킷런 `GaussianMixture`의 기본 설정)[^s1].

## 연결

- 선수: [가우스 혼합 모델](/Hongs_Blog/studies/data-science/gaussian-mixture-model/), [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)(M 단계가 무게 붙은 최대가능도다)
- 같은 번갈아 고치기: [k-평균](/Hongs_Blog/studies/data-science/k-means/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"EM은 GMM의 참 매개변수를 반드시 찾는다"</div>

아니다. EM은 가능도를 줄이지 않을 뿐, 처음 값에 따라 다른 봉우리에 멈춘다. 또 한 성분이 점 하나에만 붙으면 분산이 0으로 줄며 가능도가 무한대로 커지는 퇴화도 생긴다(구현에서 분산 아래한계를 두는 이유). 그럴듯해 보이는 이유는 예시처럼 잘 떨어진 자료에서는 거의 늘 참값에 가기 때문이다. 확인하는 법: 처음 값을 바꿔 여러 번 돌려 로그가능도를 비교한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** EM의 E 단계와 M 단계가 각각 계산하는 것을 식과 함께 쓰라.</summary>

**답:** E: 책임도 $$[\mathbf z_i]_\alpha = \frac{\pi_\alpha\mathcal N(\mathbf x_i \mid \boldsymbol\mu_\alpha, \Sigma_\alpha)}{\sum_l\pi_l\mathcal N(\mathbf x_i \mid \boldsymbol\mu_l, \Sigma_l)}$$. M: $$\boldsymbol\mu_\alpha$$는 책임도 가중 평균, $$\Sigma_\alpha$$는 책임도 가중 공분산, $$\pi_\alpha = \frac1n\sum_i[\mathbf z_i]_\alpha$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 점 0, 1, 2, 6, 7, 8과 처음 값(평균 1, 2, 분산 1, 비중 반반)에서 첫 E 단계 뒤 무리 1의 책임도 합과, M 단계의 무리 1 비중을 구하라.</summary>

**답:** 책임도 0.818 + 0.622 + 0.378 + 0.011 + 0.004 + 0.002 ≈ 1.835. 비중 $$\pi_1 = \frac{1.835}{6} \approx 0.306$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 `μ_α = Σ_i [z_i]_α x_i / Σ_i [z_i]_α` 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 각 점이 군집 $$\alpha$$에 속할 확률을 무게로 삼아 점들의 가중 평균을 내서, 군집 $$\alpha$$의 새 중심을 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 증명 4단계의 부등식 사슬 $$\ell_{\text{옛}} \le \ell_{\text{새}}$$에서 첫 등호와 둘째·셋째 부등호의 근거를 각각 대라.</summary>

**답:** 첫 등호($$\ell_{\text{옛}}$$ = 경계): E 단계에서 책임도를 고르면 옌센 부등식이 등호가 된다. 둘째(경계 ≤ 새 경계): M 단계가 그 경계를 최대화한다. 셋째(새 경계 ≤ $$\ell_{\text{새}}$$): 옌센 부등식은 아무 $$q$$에서나 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$\pi_\alpha$$를 슬라이드처럼 $$1/n$$으로 시작하면 무엇이 깨지는가? 점 6개, 군집 2개로 보여라.</summary>

**답:** 비중이 $$\frac16, \frac16$$이라 합이 $$\frac13$$이다. $$p(\mathbf x) = \sum\pi_\alpha\mathcal N$$이 확률밀도가 아니게 되어(전체 적분이 1/3) 첫 로그가능도가 틀린다. 책임도는 분자·분모의 공통 배수가 약분되어 우연히 같지만, 비중의 뜻은 깨진다. $$1/k = \frac12$$로 시작해야 한다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-1_basic-clustering.pdf, p.27
[^2]: 같은 자료, p.28
[^3]: 같은 자료, p.29
[^4]: 같은 자료, p.31
[^s1]: 에이전트 보충. 1차원 추적 표, 단조성 증명 스케치, 스스로 설명해 보기, 복잡도, k-평균 초기화, 퇴화, 카드 C2·C4·C5는 원본에 없다. 구현 코드로 확인했다(Dempster, Laird, Rubin, 1977).
{% endraw %}
