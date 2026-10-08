---
layout: "note"
title: "단일 클래스 협업 필터링"
display_title: "단일 클래스 협업 필터링 (One-Class Collaborative Filtering)"
kind: "concept"
kind_label: "알고리즘"
num: "45"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["One-Class Collaborative Filtering", "OCCF", "암묵적 피드백", "Implicit Feedback", "WRMF", "Weighted Regularized Matrix Factorization", "가중 정칙화 행렬 분해", "BPR", "Bayesian Personalized Ranking", "쌍별 학습", "Pair-wise Training", "점별 학습", "Point-wise Training"]
description: "별점은 사람들이 잘 남기지 않지만, 누르고 보고 산 기록은 넘치게 쌓인다. 이 기록은 \"했다(1)\"만 있고 \"싫다\"는 없다. 단일 클래스 협업 필터링은 이 1과 빈칸만으로 \"이 사람이 이것을 좋아할까\"를 예측한다. 핵심 어려움은 빈칸이 싫어서 안 한 것인지 몰라서 안 한 것인지 모…"
prev_url: "/studies/data-science/mf-recommendation/"
prev_title: "행렬 분해 추천"
next_url: "/studies/data-science/zero-injection/"
next_title: "0 주입"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/one-class-cf/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

별점은 사람들이 잘 남기지 않지만, 누르고 보고 산 기록은 넘치게 쌓인다. 이 기록은 "했다(1)"만 있고 "싫다"는 없다. 단일 클래스 협업 필터링은 이 1과 빈칸만으로 "이 사람이 이것을 좋아할까"를 예측한다. 핵심 어려움은 빈칸이 싫어서 안 한 것인지 몰라서 안 한 것인지 모른다는 점이다. WRMF는 빈칸에 작은 무게만 주고, BPR은 "한 것이 안 한 것보다 위에 오게" 순서를 직접 배운다.

</div>


## 예시로 보기

평점(1~5) 예측은 추천의 목표와 어긋난다. 모델 A가 아이템 C를 3.6으로 예측해 5위에 올리고, 모델 B가 4.2로 예측해 20위에 올렸다면 어느 쪽이 나은가? 평점의 정확도보다 순위가 중요하다. 또 별점은 사용자가 일부러 남겨야 해서 아주 희소하고, 사람마다 아이템마다 복잡한 편향이 있다[^1].

사용자 20명이 아이템 10개를 쓴 기록(1)에서 사용자마다 쓴 아이템 하나를 숨기고, 숨긴 아이템이 쓰지 않은 아이템들보다 위에 오는 비율(AUC)을 쟀다[^s1].

| 방법 | AUC |
|---|---|
| 무작위 점수 | 0.51 |
| WRMF (빈칸 무게 0.1) | 0.81 |
| WRMF (빈칸 무게 1, 모든 빈칸을 확실한 0으로) | 0.70 |
| BPR | 0.76 |

빈칸을 모두 확실한 "싫어함"으로 믿으면, 숨겨진 좋아하는 아이템까지 0으로 맞추려 해 순위가 나빠진다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표(시험할 아이템을 숨긴 실험), BPR 쌍의 수, 시그모이드 값 — [45_one-class-cf_impl.py](/Hongs_Blog/studies/data-science/code/45_one-class-cf_impl/)</div>

</div>


## 정의

**단일 클래스 협업 필터링(OCCF)**은 대상 사용자가 아이템을 좋아할지(상호작용할지)를 예측한다[^2].

- 추천의 목표와 맞는다. 사용자·아이템 편향을 잡을 필요가 없다.
- 암묵적 피드백(클릭, 시청, 구매)을 써서 명시적 피드백보다 덜 희소하다.
- 어려움: 빈칸을 어떻게 읽나? 일부러 안 한 음성일 수도 있고, 아직 몰라서 안 한 잠재적 양성일 수도 있다.

### WRMF (가중 정칙화 행렬 분해)

상호작용한 칸은 1, 안 한 칸은 0으로 두고, 모든 사용자-아이템 쌍에서 무게 붙은 제곱 오차를 줄인다[^3].

$$\min_{P, Q}\sum_{u,i}c_{ui}\left(x_{ui} - \mathbf p_u^\top\mathbf q_i\right)^2 + \lambda\left(\Vert \mathbf p_u\Vert ^2 + \Vert \mathbf q_i\Vert ^2\right)$$


$$c_{ui}$$는 사용자 $$u$$와 아이템 $$i$$의 칸에 주는 무게다. 상호작용한 칸은 $$c_{ui} = 1$$이다. 빈칸의 무게는 여러 방식으로 정한다[^4].

- **고르게:** $$c_{ui} = \delta \in [0, 1]$$. 빈칸을 약한 음성으로 본다.
- **사용자 쪽:** $$c_{ui} \propto \sum_i R_{ui}$$. 상호작용이 많은 사용자의 빈칸일수록 음성일 가능성이 크다.
- **아이템 쪽:** $$c_{ui} \propto m - \sum_u R_{ui}$$. 상호작용이 적은(인기 없는) 아이템의 빈칸일수록 음성일 가능성이 크다.

재구성하면 상호작용한 칸은 1 근처, 빈칸은 0 근처의 값을 받고, 빈칸 중 값이 큰 것을 추천한다[^3].

### BPR (베이즈 개인화 순위)

점별 학습(각 칸의 값을 맞추기, 회귀와 같음)은 두 아이템의 순서를 직접 보지 않는다. 모델 A가 4.20 < 4.23, 모델 B가 3.45 > 3.33으로 예측했다면 오차는 A가 작아도 순서는 B만 맞을 수 있다. 그런데 추천은 정밀도·재현율·MRR·nDCG 같은 순위 지표로 평가된다[^5]. BPR은 쌍별 학습으로 바꾼다[^6].

$$\hat x_{ui} = \mathbf p_u^\top\mathbf q_i, \qquad \max\sum_{(u,i,j)}\ln\sigma(\hat x_{ui} - \hat x_{uj}) - \lambda\Vert \Theta\Vert ^2$$


$$(u, i, j)$$는 사용자 $$u$$가 상호작용한 아이템 $$i$$와 안 한 아이템 $$j$$의 쌍이다. $$\sigma(x) = \frac{1}{1 + e^{-x}}$$(시그모이드)는 차이가 클수록 1에 가깝다. 상호작용한 아이템의 점수가 안 한 아이템보다 크게 벌어지도록 학습한다. $$\Theta$$는 모든 학습 값이다.

| | 자료 | 학습 | 손실 | 목표 |
|---|---|---|---|---|
| WRMF | 암묵적 | 점별 | 무게 붙은 MSE | 선호 예측 |
| BPR-MF | 암묵적 | 쌍별 | BPR | 순위 |

표는 슬라이드 p.24의 일부다[^7]. 최근에는 같은 단일 클래스 설정과 BPR 손실에 신경망(NeuMF)과 그래프 신경망(NGCF, LightGCN) 표현을 더한다[^8].

## 활용

- 구현: [45_one-class-cf_impl.py](/Hongs_Blog/studies/data-science/code/45_one-class-cf_impl/)
- BPR의 쌍은 너무 많아(사용자마다 상호작용 수 × 빈칸 수) 매 단계 무작위로 뽑아 확률적 경사 상승을 한다[^s1].

## 연결

- 선수: [행렬 분해 추천](/Hongs_Blog/studies/data-science/mf-recommendation/), [추천 평가 지표](/Hongs_Blog/studies/data-science/recommender-metrics/)(순위 지표)
- 빈칸 중 확실히 관심 없는 것을 골라내기: [0 주입](/Hongs_Blog/studies/data-science/zero-injection/)
- $$\ln\sigma$$의 합을 최대화하는 것은 쌍마다 "$$i$$가 $$j$$보다 좋다"의 가능도를 최대화하는 것이다: [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** WRMF의 목적 함수와 빈칸 무게를 정하는 세 방식을 쓰라.</summary>

**답:** $$\min\sum_{u,i}c_{ui}(x_{ui} - \mathbf p_u^\top\mathbf q_i)^2 + \lambda(\Vert \mathbf p_u\Vert ^2 + \Vert \mathbf q_i\Vert ^2)$$. 상호작용한 칸은 $$c = 1$$. 빈칸은 고르게($$\delta$$), 사용자 쪽(상호작용이 많은 사용자일수록 크게), 아이템 쪽(상호작용이 적은 아이템일수록 크게).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아이템 8개 중 3개와 상호작용한 사용자 한 명에 대해 BPR이 만들 수 있는 $$(u, i, j)$$ 쌍은 몇 개인가? 두 아이템 점수가 같으면 $$\sigma(\hat x_{ui} - \hat x_{uj})$$는?</summary>

**답:** 상호작용 3개 × 빈칸 5개 = 15쌍. 차이가 0이면 $$\sigma(0) = 0.5$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 점별 학습으로 평점 오차를 줄이는 것보다 BPR의 쌍별 학습이 추천에 더 잘 맞는 이유를 설명하라.</summary>

**답:** 추천은 상위 몇 개의 순서로 평가된다. 점별 학습은 각 값의 크기만 맞추므로 두 아이템의 순서가 뒤바뀌어도 오차는 작을 수 있다(4.20 대 4.23). BPR은 상호작용한 아이템이 안 한 아이템보다 위에 오도록 순서 자체를 목표로 학습한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** WRMF에서 빈칸 무게 $$c_{ui}$$를 1보다 작게 주는 것이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 빈칸이 정말 싫어서 비었는지 확실하지 않으므로 그 칸의 0을 덜 믿게 해서, 아직 몰라서 비어 있는 좋아할 아이템이 0으로 끌려 내려가지 않게 한다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/12.12-1_MF-based.pdf, p.18
[^2]: 같은 자료, p.19 (Pan et al., ICDM 2008)
[^3]: 같은 자료, p.20
[^4]: 같은 자료, p.21
[^5]: 같은 자료, p.22
[^6]: 같은 자료, p.23 (Rendle et al., UAI 2009)
[^7]: 같은 자료, p.24
[^8]: 같은 자료, p.25
[^s1]: 에이전트 보충. 숨긴 아이템 실험과 AUC 표, 쌍을 무작위로 뽑는 학습, 최대가능도 해석, 카드 C2~C4는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
