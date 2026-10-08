---
layout: "note"
title: "정규화"
display_title: "정규화 (Normalization)"
kind: "concept"
kind_label: "기법"
num: "07"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Normalization", "데이터 정규화", "데이터 변환", "Data Transformation", "최소-최대 정규화", "Min-max Normalization", "z-점수 정규화", "Z-score Normalization", "표준화", "Standardization", "스케일링", "Feature Scaling"]
description: "키를 cm로 적느냐 m로 적느냐에 따라 거리 계산 결과가 뒤집힌다. 정규화는 속성마다 값을 같은 크기의 범위로 옮겨서 단위의 영향을 없앤다. 가장 작은 값을 0, 가장 큰 값을 1로 맞추는 방법은 간단하지만, 튀는 값 하나가 나머지를 한쪽 구석에 몰아넣는다. 평균을 0, 표준편차를…"
prev_url: "/studies/data-science/data-integration/"
prev_title: "데이터 통합"
next_url: "/studies/data-science/discretization/"
next_title: "이산화"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/normalization/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

키를 cm로 적느냐 m로 적느냐에 따라 거리 계산 결과가 뒤집힌다. 정규화는 속성마다 값을 같은 크기의 범위로 옮겨서 단위의 영향을 없앤다. 가장 작은 값을 0, 가장 큰 값을 1로 맞추는 방법은 간단하지만, 튀는 값 하나가 나머지를 한쪽 구석에 몰아넣는다. 평균을 0, 표준편차를 1로 맞추는 방법은 튀는 값에 덜 흔들리지만, 분포의 모양까지 바꿔 주지는 않는다.

</div>


## 예시로 보기

[민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)로 사람들의 비슷함을 재면, 값이 큰 속성이 거리를 독차지한다. 슬라이드의 그림에서도 키와 몸무게의 관계가 (cm, g), (cm, kg), (m, kg)에 따라 전혀 다른 기울기로 보인다[^1].

세 사람의 (나이, 연봉 만원)이 A(25, 3000), B(26, 5000), C(60, 3100)이다. 그대로 거리를 재면 연봉 차이가 거리를 정해서, 나이가 35살 많은 C가 A와 가장 가깝다. 나이 범위를 20~60, 연봉 범위를 2,000~10,000으로 보고 0~1로 옮기면 A(0.125, 0.125), B(0.15, 0.375), C(1, 0.1375)다. 이제 A와 B의 거리 0.25, A와 C의 거리 0.88로 B가 가깝다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 소득 예 0.716·1.225, z-점수 뒤 평균 0·표준편차 1·치우침은 그대로, 이상치 하나가 나머지를 0.008 안에 몰아넣음, 카드 C1, 위 세 사람 예 — [07_normalization_verify.py](/Hongs_Blog/studies/data-science/code/07_normalization_verify/)</div>

</div>


## 정의

**최소-최대 정규화**는 값에서 최솟값을 빼고(최솟값에서 얼마나 떨어졌나), 실제 값의 범위로 나눈다. 결과는 0~1 사이다[^1].

$$x_{\text{scaled}} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$


예: 소득 범위가 12,000~98,000일 때 73,600은 $$\frac{61{,}600}{86{,}000} \approx 0.716$$이다[^s2].

한계는 둘이다[^1].
1. 실제 최솟값·최댓값을 모르면 쓸 수 없다. 나중에 범위 밖의 값이 들어오면 0~1을 벗어난다.
2. 최솟값과 최댓값이 이상치이면 결과가 크게 흔들린다.

**z-점수 정규화**(평균 0 정규화)는 속성 $$A$$의 값 $$v_i$$에서 평균 $$\bar A$$를 빼고 표준편차 $$\sigma_A$$로 나눈다[^2].

$$v'_i = \frac{v_i - \bar A}{\sigma_A}$$


결과는 "평균에서 표준편차 몇 개만큼 떨어졌나"다. 바꾼 값들은 평균 0, 표준편차 1이 된다. 실제 최솟값·최댓값을 모르거나 이상치가 있을 때 쓸모 있다[^2]. 예: 평균 54,000, 표준편차 16,000이면 73,600은 $$\frac{19{,}600}{16{,}000} = 1.225$$다[^s2].

## 연결

- 정규화가 필요한 이유: [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)의 단위 문제
- z-점수의 재료: [분산과 표준편차](/Hongs_Blog/studies/probability-statistics/variance/). 정규분포의 표준화와 같은 식이다: [정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/)
- 같은 데이터 변환 단계: [이산화](/Hongs_Blog/studies/data-science/discretization/), [표본 추출](/Hongs_Blog/studies/data-science/sampling/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"z-점수로 정규화하면 데이터가 정규분포가 된다"</div>

아니다. z-점수는 모든 값에서 같은 수를 빼고 같은 수로 나누는 직선 변환이라, 위치와 폭만 바꾸고 모양은 그대로 둔다. 오른쪽으로 꼬리가 긴 자료는 정규화 뒤에도 꼬리가 길다. 슬라이드 그림이 종 모양 둘을 나란히 그려 그렇게 보이기 쉽다[^2]. 확인하는 법: 치우친 자료의 왜도(치우침을 재는 값)를 정규화 전후로 계산하면 같다(검증 코드에서 1.85 그대로).

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 값 $$20, 30, 50, 100$$을 최소-최대 정규화하라. 여기에 1,000이 하나 더 들어오면 50은 얼마가 되는가?</summary>

**답:** 범위 20~100이라 $$0, 0.125, 0.375, 1$$. 1,000이 들어오면 범위가 20~1,000이 되어 50은 $$\frac{30}{980} \approx 0.031$$이다. 이상치 하나가 나머지를 0 근처로 몰아넣는다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 상황에서 최소-최대와 z-점수 중 무엇이 알맞은가? ① 픽셀 밝기 0~255를 0~1로 ② 앞으로 들어올 센서 값의 범위를 모른다 ③ 연봉 자료에 수십억 원 연봉이 몇 개 섞였다</summary>

**답:** ① 최소-최대. 범위가 정해져 있다. ② z-점수. 실제 최솟값·최댓값을 몰라도 된다. ③ z-점수가 최소-최대보다 덜 흔들린다. (평균과 표준편차도 이상치에 영향을 받으므로, 더 견고하게 하려면 중앙값과 IQR로 나누는 방법을 쓴다[^s1].)

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 세 사람 A(25세, 3,000만 원), B(26세, 5,000만 원), C(60세, 3,100만 원)에서 A와 가장 가까운 사람이 정규화 전후로 바뀌는 이유를 설명하라.</summary>

**답:** 정규화 전에는 연봉 차이(수천)가 나이 차이(수십)보다 훨씬 커서 연봉이 비슷한 C가 가깝다. 정규화하면 두 속성이 같은 0~1 범위에서 겨루므로, 나이 차이 35살이 크게 반영되어 B가 가까워진다(0.25 < 0.88).

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/02.2-1_data-measure-preprocess.pdf, p.41
[^2]: 같은 자료, p.42
[^s1]: 에이전트 보충. 세 사람 예, 이상치 예, 중앙값·IQR로 나누는 견고한 정규화, 오해 항목, 카드 C1~C3은 원본에 없다. 수치는 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 소득 73,600의 두 정규화 예는 Han, Kamber, Pei, *Data Mining: Concepts and Techniques* 3판, 3.5.2절의 예다.
{% endraw %}
