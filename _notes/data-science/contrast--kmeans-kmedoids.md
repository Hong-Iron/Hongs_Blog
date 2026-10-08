---
layout: "note"
title: "k-평균과 k-메도이드 비교"
display_title: "k-평균과 k-메도이드 비교"
kind: "concept"
kind_label: "비교"
num: "27"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["K-means vs K-medoids"]
description: "둘 다 k를 정하고 \"가장 가까운 대표에 넣기 → 대표 고치기\"를 되풀이한다. 가르는 질문은 \"대표가 실제 자료점이어야 하는가\"다. 그 답이 이상치에 대한 견고함, 쓸 수 있는 거리, 계산량을 함께 정한다."
prev_url: "/studies/data-science/k-medoids/"
prev_title: "k-메도이드"
next_url: "/studies/data-science/choosing-k/"
next_title: "군집 수 고르기"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/contrast--kmeans-kmedoids/"
---
{% raw %}
둘 다 $$k$$를 정하고 "가장 가까운 대표에 넣기 → 대표 고치기"를 되풀이한다. 가르는 질문은 "대표가 실제 자료점이어야 하는가"다. 그 답이 이상치에 대한 견고함, 쓸 수 있는 거리, 계산량을 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 수백만 명의 (키, 몸무게, 나이) 자료를 빠르게 다섯 무리로 나눈다. (b) 고객 500명의 구매 기록을 몇 무리로 나누고, 무리마다 "대표 고객 한 명"을 마케팅 팀에 보여 준다. 어느 쪽인가?</summary>

**답:** (a) k-평균. 수치 자료이고 크기가 커서 빠른 평균 계산이 유리하다. (b) k-메도이드. 대표가 실제 고객이라 보여 줄 수 있고, 자료가 작아 $$m^2$$ 계산도 감당된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 자료에 입력 실수로 생긴 아주 큰 값이 섞여 있다. (d) 단백질 서열(문자열)을 편집 거리로 묶는다. 어느 쪽인가?</summary>

**답:** (c) k-메도이드. 평균은 이상치에 끌리지만 메도이드는 실제 점 중에서 골라 덜 흔들린다. (d) k-메도이드. 문자열의 평균은 정의되지 않고, k-메도이드는 아무 비유사도로도 돈다.

</details>


## 결정적 차이

| | k-평균 | k-메도이드 |
|---|---|---|
| 대표 | 평균(중심). 실제 점이 아닐 수 있다 | 메도이드. 자료 속 실제 점 |
| 이상치 | 민감하다(평균이 쉽게 끌린다) | 더 견고하다 |
| 거리 | (제곱) 유클리드 | 아무 비유사도 |
| 계산 | 효율적, 큰 자료에 쓴다 | 비싸다(거리 계산이 많다) |
| 공통 한계 | $$k$$를 미리 정한다, 하드 배정 | 같다 |

표는 슬라이드 p.16을 옮기고 "거리" 줄을 바로잡은 것이다[^1]. 슬라이드는 두 방법 모두 "Euclidean distance"라 적었지만, k-메도이드는 아무 비유사도로도 돌아간다([k-메도이드](/Hongs_Blog/studies/data-science/k-medoids/)의 원본 오류 의심). 선택을 가르는 줄은 "이상치"와 "계산"이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 자료(1, 2, 3, 8, 9, 10, 25)에서 k-평균의 중심 13, k-메도이드의 메도이드 9 — [25_k-means_impl.py](/Hongs_Blog/studies/data-science/code/25_k-means_impl/), [26_k-medoids_impl.py](/Hongs_Blog/studies/data-science/code/26_k-medoids_impl/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 둘 다 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>

**답:** ① 군집이 길쭉한 타원이거나 서로 겹쳐, 점마다 "어느 군집일 확률"이 필요할 때 → [가우스 혼합 모델](/Hongs_Blog/studies/data-science/gaussian-mixture-model/). ② 군집 수를 모르고 고리·나선처럼 모양이 제멋대로이며 잡음이 섞였을 때 → [DBSCAN](/Hongs_Blog/studies/data-science/dbscan/)[^2].

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-1_basic-clustering.pdf, p.16
[^2]: 같은 자료, p.22. 3-2학기/데이터 과학/1.수업자료/07.7-2_density-clustering.pdf, p.8
{% endraw %}
