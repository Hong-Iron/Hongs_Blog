---
layout: "note"
title: "데이터 정제"
display_title: "데이터 정제 (Data Cleaning)"
kind: "concept"
kind_label: "기법"
num: "05"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Data Cleaning", "데이터 클리닝", "데이터 전처리", "Data Preprocessing", "데이터 품질", "Data Quality", "결측값", "Missing Value", "결측치", "잡음", "Noise", "비닝", "Binning", "구간화 평활", "Smoothing by Bin Means", "이상치", "Outlier"]
description: "현실의 데이터는 빈칸이 있고, 잘못 잰 값이 섞이고, 서로 맞지 않는 값이 들어 있다. 분석 전에 빈칸을 채우고, 튀는 값을 다듬고, 맞지 않는 값을 바로잡는 일이 데이터 정제다. 쓰레기를 넣으면 쓰레기가 나오므로 결과의 질은 데이터의 질을 넘지 못한다. 다만 채우거나 다듬은 값은…"
prev_url: "/studies/data-science/minkowski-distance/"
prev_title: "민코프스키 거리"
next_url: "/studies/data-science/data-integration/"
next_title: "데이터 통합"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/data-cleaning/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

현실의 데이터는 빈칸이 있고, 잘못 잰 값이 섞이고, 서로 맞지 않는 값이 들어 있다. 분석 전에 빈칸을 채우고, 튀는 값을 다듬고, 맞지 않는 값을 바로잡는 일이 데이터 정제다. 쓰레기를 넣으면 쓰레기가 나오므로 결과의 질은 데이터의 질을 넘지 못한다. 다만 채우거나 다듬은 값은 진짜 값이 아니라 추측이라, 방법을 잘못 고르면 없던 경향을 만들어 낸다.

</div>


## 예시로 보기

어느 회사 고객 자료에서 몇몇 고객의 소득 칸이 비어 있고, 몇몇 상품의 가격이 터무니없이 크거나 작다[^1]. 이대로 평균을 내거나 군집화를 돌리면 결과가 망가진다.

**빈칸 채우기.** 소득이 빈 고객을 그냥 지우면 그 고객의 다른 정보까지 함께 버린다. 빈칸에 "0"을 넣으면 분석 프로그램은 돌아가지만, "소득 0인 고객 무리" 같은 엉뚱한 결론이 나올 수 있다[^2]. 평균 소득으로 채우는 편이 낫고, 소득 분포가 한쪽으로 치우쳤으면 중앙값이 낫다[^3].

**튀는 값 다듬기(비닝).** 가격을 정렬해 3개씩 칸(bin)에 나누고, 칸 안의 값을 대표값으로 바꾼다[^4].

| | 칸 1 | 칸 2 | 칸 3 |
|---|---|---|---|
| 원래 값 | 4, 8, 15 | 21, 21, 24 | 25, 28, 34 |
| 칸 평균으로 | 9, 9, 9 | 22, 22, 22 | 29, 29, 29 |
| 칸 중앙값으로 | 8, 8, 8 | 21, 21, 21 | 28, 28, 28 |
| 칸 경계로 | 4, 4, 15 | 21, 21, 24 | 25, 25, 34 |

칸 경계로 바꿀 때는 각 값을 칸의 최솟값과 최댓값 중 더 가까운 쪽으로 옮긴다. 8은 4와 4만큼, 15와 7만큼 떨어져 4가 된다. 이웃한 값들과 평균을 내니 값 하나의 우연한 흔들림이 줄어든다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 가지 비닝 결과가 슬라이드와 같음, 평균으로 채우면 분산이 줄어듦, 카드 C2 — [05_data-cleaning_verify.py](/Hongs_Blog/studies/data-science/code/05_data-cleaning_verify/)</div>

</div>


## 정의

**데이터 품질**은 쓰려는 목적에 맞는지로 판단한다. 기준은 정확성(값이 맞는가), 완전성(필요한 속성이 다 있는가), 일관성(서로 맞는가), 시의성(낡지 않았는가) 등이다[^5].

**데이터 정제**는 세 가지 일을 한다[^1].

1. 빠진 값(결측값)을 채운다.
2. 잡음(잰 값에 섞인 무작위 오차)을 다듬고 이상치를 찾는다.
3. 서로 맞지 않는 값을 바로잡는다.

결측값을 다루는 방법은 다음과 같다[^2][^3].

| 방법 | 장점 | 문제 |
|---|---|---|
| 그 줄을 무시 | 간단 | 다른 속성의 정보도 잃는다. 속성마다 빈칸 비율이 다르면 효과 없다 |
| 손으로 채움 | 정확 | 시간과 비용. 큰 자료에는 불가능 |
| 전체 상수("Unknown", 0) | 프로그램이 돈다 | 뜻 없는 패턴을 캐낼 수 있다 |
| 속성의 중심값 | 간단 | 정규분포 꼴이면 평균, 치우치면 중앙값 |
| 같은 부류의 중심값 | 더 정확 | 같은 부류는 값이 비슷하다는 가정이 필요 |
| 가장 그럴듯한 값 | 다른 속성과의 관계를 지킨다 | 회귀, 베이즈 추론, 결정 트리 같은 모델이 필요 |

잡음을 다듬는 방법은 다음과 같다[^4][^6].

- **비닝:** 정렬한 값을 칸으로 나누고 칸의 평균, 중앙값, 경계로 바꾼다.
- **회귀:** 두 속성 사이에 가장 잘 맞는 선을 구하고 값을 그 선 위로 옮긴다. 한 속성으로 다른 속성을 예측하는 것이다.
- **이상치 분석:** 군집화로 비슷한 값을 무리 짓고, 어느 무리에도 들지 않는 값을 잡음으로 보고 뺀다.

## 활용

- 판다스(pandas)의 `fillna`(채우기), `dropna`(빈 줄 지우기), `cut`·`qcut`(칸 나누기)가 이 문서의 방법이다[^s1].
- 흔한 실수: 평균으로 채운 뒤 분산이나 상관을 그대로 보고하는 것. 채운 값은 모두 평균에 놓여 흩어짐을 실제보다 작게 만든다(카드 C3).

## 연결

- 선수: [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)(평균, 중앙값과 치우침)
- 회귀로 다듬기: [선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/)
- 다음 단계: [데이터 통합](/Hongs_Blog/studies/data-science/data-integration/), [정규화](/Hongs_Blog/studies/data-science/normalization/)
- 같은 "칸 나누기"를 연속값을 구간 이름으로 바꾸는 데 쓰면: [이산화](/Hongs_Blog/studies/data-science/discretization/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 결측값을 다루는 방법을 넷 이상 쓰고, "전체 상수(0이나 Unknown)로 채우기"의 위험을 말하라.</summary>

**답:** 그 줄 무시, 손으로 채우기, 전체 상수, 속성의 평균·중앙값, 같은 부류의 평균·중앙값, 모델로 예측한 가장 그럴듯한 값. 상수로 채우면 분석이 그 상수를 하나의 진짜 값으로 보고 "0인 무리" 같은 뜻 없는 패턴을 캐낼 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 정렬된 값 $$3, 7, 8, 12, 15, 20$$을 3개씩 두 칸으로 나눠 칸 경계로 다듬으라.</summary>

**답:** 칸 1 $$(3, 7, 8)$$: 7은 3과 4, 8과 1 떨어져 8로. 결과 $$3, 8, 8$$. 칸 2 $$(12, 15, 20)$$: 15는 12와 3, 20과 5 떨어져 12로. 결과 $$12, 12, 20$$. 합쳐서 $$3, 8, 8, 12, 12, 20$$[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 소득 $$10, 20, 30, 40$$과 빈칸 2개를 평균 25로 채웠다. 평균과 분산은 어떻게 되는가? 이것이 왜 문제인가?</summary>

**답:** 평균은 25 그대로지만 분산은 125에서 약 83.3으로 줄어든다. 채운 값이 모두 한가운데 놓여 자료가 실제보다 덜 흩어져 보인다. 이 자료로 신뢰구간이나 상관을 계산하면 확신을 지나치게 크게 잡는다[^s1].

</details>


[^1]: 데이터 과학 2회 강의 자료 「2-1_data-measure-preprocess」, p.30, p.32
[^2]: 같은 자료, p.33
[^3]: 같은 자료, p.34
[^4]: 같은 자료, p.35
[^5]: 같은 자료, p.31
[^6]: 같은 자료, p.36
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 칸 경계 방식의 동점 처리(같으면 아래 경계), 판다스 함수, 분산이 줄어드는 문제, 카드 C2·C3은 원본에 없다. 수치는 검증 코드로 확인했다.
{% endraw %}
