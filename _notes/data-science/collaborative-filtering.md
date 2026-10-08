---
layout: "note"
title: "협업 필터링"
display_title: "협업 필터링 (Collaborative Filtering)"
kind: "concept"
kind_label: "알고리즘"
num: "41"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Collaborative Filtering", "CF", "사용자 기반 협업 필터링", "User-based CF", "아이템 기반 협업 필터링", "Item-based CF", "이웃", "Neighbors", "평점 행렬", "Rating Matrix", "희소성", "Sparsity"]
description: "아이템의 내용은 보지 않고, 여러 사용자가 남긴 평점만으로 추천한다. \"나와 취향이 비슷한 사람들이 좋아한 것\"을 고르거나(사용자 기반), \"내가 좋아한 것과 비슷하게 평가된 것\"을 고른다(아이템 기반). 내용을 뽑을 필요가 없고 뜻밖의 좋은 추천도 나온다. 하지만 평점 행렬은 대…"
prev_url: "/studies/data-science/content-based-recommendation/"
prev_title: "내용 기반 추천"
next_url: "/studies/data-science/contrast--recommendation-methods/"
next_title: "추천 방법 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/collaborative-filtering/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

아이템의 내용은 보지 않고, 여러 사용자가 남긴 평점만으로 추천한다. "나와 취향이 비슷한 사람들이 좋아한 것"을 고르거나(사용자 기반), "내가 좋아한 것과 비슷하게 평가된 것"을 고른다(아이템 기반). 내용을 뽑을 필요가 없고 뜻밖의 좋은 추천도 나온다. 하지만 평점 행렬은 대부분이 비어 있어 비교할 공통 평가가 적고, 평가가 거의 없는 새 사용자와 새 아이템에는 추천하기 어렵다.

</div>


## 예시로 보기

세 사용자가 아이템 여섯 개에 평점을 주었다. 빈칸은 평가하지 않은 것이다[^1].

| | $$i_1$$ | $$i_2$$ | $$i_3$$ | $$i_4$$ | $$i_5$$ | $$i_6$$ |
|---|---|---|---|---|---|---|
| A | 4.0 | 1.0 | 4.5 | 5.0 | 2.0 | |
| B | | 1.5 | 5.0 | 4.5 | 2.0 | 5.0 |
| C | 1.0 | | 1.5 | 1.0 | 5.0 | 1.0 |

A와 B는 함께 평가한 $$i_2 \sim i_5$$에서 높고 낮음이 거의 같다. 피어슨 상관계수 0.971이다. A와 C는 반대다($$-0.943$$). 그래서 A에게 $$i_6$$를 추천할지는 C가 아니라 B의 평점 5.0을 보고 정한다[^s1].

사용자마다 점수를 주는 버릇이 다르다는 것도 고려해야 한다. A가 늘 B보다 1점씩 짜게 준다면, B가 4점 준 아이템에 A는 3점쯤 줄 것이다. 평균에서 얼마나 벗어났는지를 빌려 오면 이 차이가 지워진다[^2][^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: A-B 0.971, A-C −0.943, 평균 보정 예측, 아이템 기반 유사도, 공통 평가가 하나면 피어슨 계산 불가, 카드 C3 — [41_collaborative-filtering_impl.py](/Hongs_Blog/studies/data-science/code/41_collaborative-filtering_impl/)</div>

</div>


## 정의

**협업 필터링**은 다른 사용자들의 협업 신호를 쓴다. 곧 다른 사용자들이 이전에 평가한 아이템들로 대상 사용자에게 아이템의 효용을 추정한다[^3]. 자료는 $$N \times M$$ 평점 행렬이다. 행은 한 사용자의 평가 기록, 열은 한 아이템을 평가한 사용자 목록이다[^4].

- **사용자 기반:** 비슷한 사용자는 비슷한 아이템을 좋아한다. "당신과 비슷한 사용자들이 이 아이템을 좋아했다."
- **아이템 기반:** 사용자는 비슷한 아이템을 좋아한다. "이 아이템은 당신이 전에 좋아한 아이템과 비슷하다."

### 사용자 기반의 세 단계[^5]

**1. 이웃 찾기.** 두 사용자 $$x, y$$가 함께 평가한 아이템 $$S_{xy}$$ 위에서 유사도를 잰다[^1].

$$\operatorname{sim}_{PCC}(x, y) = \frac{\sum_{s \in S_{xy}}(r_{x,s} - \bar r_x)(r_{y,s} - \bar r_y)}{\sqrt{\sum_{s \in S_{xy}}(r_{x,s} - \bar r_x)^2}\sqrt{\sum_{s \in S_{xy}}(r_{y,s} - \bar r_y)^2}}, \qquad \operatorname{sim}_{cos}(x, y) = \frac{\sum_{s \in S_{xy}} r_{x,s}r_{y,s}}{\sqrt{\sum r_{x,s}^2}\sqrt{\sum r_{y,s}^2}}$$


유사도가 높은 몇 명(상위 $$k$$명, 또는 기준 이상)을 이웃 $$\hat C$$로 고른다.

**2. 평점 추정.** 이웃의 평점을 모은다[^2].

$$r_{c,s} = \frac1N\sum_{c' \in \hat C} r_{c',s} \ \to\ r_{c,s} = k\sum_{c' \in \hat C}\operatorname{sim}(c, c') \times r_{c',s} \ \to\ r_{c,s} = \bar r_c + k\sum_{c' \in \hat C}\operatorname{sim}(c, c') \times (r_{c',s} - \bar r_{c'})$$


첫째는 단순 평균, 둘째는 비슷한 이웃의 말을 더 듣는 가중 합($$k$$는 정규화 상수, 보통 $$\frac{1}{\sum\vert \operatorname{sim}\vert }$$), 셋째는 사용자마다 후하고 짠 정도를 평균 $$\bar r_c = \frac{1}{\vert S_c\vert }\sum_{s \in S_c} r_{c,s}$$로 보정한 것이다. 이웃이 "자기 평균보다 얼마나 높게 줬나"를 빌려 와 대상 사용자의 평균에 더한다.

**3. 추천.** 추정 평점이 가장 높은 상위 $$k$$개를 추천한다[^6].

**아이템 기반**은 많은 사용자가 함께 소비(평가)한 아이템끼리 유사도를 잰다. 대상 사용자가 비슷한 아이템들에 준 평점으로 대상 아이템의 평점을 추정하고, 상위 $$k$$개를 추천한다[^7].

### 실행 추적: 평균 보정 예측

사용자 $$c$$가 아이템 1, 2에 4, 2를, 이웃 $$x$$가 5, 3, 5를, $$y$$가 2, 4, 1을 주었다. $$c$$의 아이템 3 평점을 예측한다[^s1].

| 단계 | 계산 | 값 |
|---|---|---|
| 유사도 | 공통 아이템 1, 2에서 $$c$$는 4 → 2, $$x$$는 5 → 3(같은 방향), $$y$$는 2 → 4(반대) | $$\operatorname{sim}(c, x) = 1$$, $$\operatorname{sim}(c, y) = -1$$ |
| 평균 | $$\bar r_c = 3$$, $$\bar r_x = \frac{13}{3}$$, $$\bar r_y = \frac73$$ | |
| 편차 | $$x$$: $$5 - \frac{13}{3} = \frac23$$, $$y$$: $$1 - \frac73 = -\frac43$$ | |
| 정규화 | $$k = \frac{1}{\lvert 1\rvert + \lvert -1\rvert} = \frac12$$ | |
| 예측 | $$3 + \frac12\left(1 \times \frac23 + (-1) \times (-\frac43)\right)$$ | $$4$$ |

$$y$$는 취향이 반대인데 아이템 3을 자기 평균보다 낮게 줬으므로, $$c$$에게는 오히려 높은 점수의 근거가 된다.

### 복잡도

사용자 기반은 대상 사용자와 다른 모든 사용자의 유사도를 재야 한다. 사용자가 많고 자주 바뀌면 비싸다. 아이템 기반은 아이템 사이 유사도를 미리 계산해 둘 수 있어 더 안정적이고 확장성이 좋다[^8].

## 활용

- 구현: [41_collaborative-filtering_impl.py](/Hongs_Blog/studies/data-science/code/41_collaborative-filtering_impl/)
- 아마존의 "이 상품을 본 사람들이 함께 본 상품"은 아이템 기반 협업 필터링으로 알려져 있다(Linden, Smith, York, IEEE Internet Computing 2003)[^s1].
- 슬라이드의 질문들[^8]: 어느 유사도가 더 안정적인가(아이템 사이 유사도는 평가가 많이 쌓여 덜 흔들린다), 어느 계산이 효율적인가, 추천이 얼마나 다양한가(아이템 기반은 이미 좋아한 것과 비슷한 것만 나와 다양성이 낮다). 새 사용자가 아이템 두 개만 평가했다면 두 방법 모두 어렵다.

## 연결

- 선수: [추천 시스템](/Hongs_Blog/studies/data-science/recommender-systems/), [피어슨 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/), [코사인 유사도](/Hongs_Blog/studies/linear-algebra/dot-product/)
- 비교: [추천 방법 비교](/Hongs_Blog/studies/data-science/contrast--recommendation-methods/)
- 평점 행렬을 숨은 요인으로 분해하는 협업 필터링: [행렬 분해 추천](/Hongs_Blog/studies/data-science/mf-recommendation/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사용자 기반 협업 필터링의 세 단계를 쓰고, 평균 보정 예측식을 쓰라.</summary>

**답:** ① 평점 기록으로 비슷한 이웃 찾기 ② 이웃의 평점으로 대상 아이템 평점 추정 ③ 추정 평점 상위 $$k$$개 추천. $$r_{c,s} = \bar r_c + k\sum_{c'}\operatorname{sim}(c, c')(r_{c',s} - \bar r_{c'})$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 평점 추정에서 이웃의 평점을 그대로 쓰지 않고 "이웃 평균과의 차이"를 쓰는 이유는?</summary>

**답:** 사용자마다 점수를 주는 버릇이 다르다. 후한 사람의 4점과 짠 사람의 4점은 뜻이 다르다. 평균에서 얼마나 벗어났는지만 빌려 와 대상 사용자의 평균에 더하면 이 차이가 지워진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 사용자 $$c$$가 (4, 2, ?), 이웃 $$x$$가 (5, 3, 5), $$y$$가 (2, 4, 1)이다. 피어슨 유사도와 평균 보정 예측으로 $$c$$의 셋째 평점을 구하라.</summary>

**답:** 공통 아이템 1, 2에서 $$\operatorname{sim}(c, x) = 1$$, $$\operatorname{sim}(c, y) = -1$$. $$\bar r_c = 3$$, $$\bar r_x = \frac{13}{3}$$, $$\bar r_y = \frac73$$, $$k = \frac12$$. 예측 $$3 + \frac12\left(\frac23 + \frac43\right) = 4$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 예측식의 $$\operatorname{sim}(c, c') \times (r_{c',s} - \bar r_{c'})$$ 항이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 이웃이 그 아이템을 자기 평소보다 얼마나 좋게(나쁘게) 봤는지를, 대상 사용자와 취향이 닮은 정도(반대면 부호를 뒤집어)만큼 반영한다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/11.11-1_intro-rec.pdf, p.23
[^2]: 같은 자료, p.24
[^3]: 같은 자료, p.20
[^4]: 같은 자료, p.21
[^5]: 같은 자료, p.22
[^6]: 같은 자료, p.25
[^7]: 같은 자료, p.26
[^8]: 같은 자료, p.27~28
[^s1]: 에이전트 보충. 유사도 수치, "1점 짠 사용자" 예, 실행 추적, 아마존 사례, 슬라이드 질문의 답, 카드 C3·C4는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
