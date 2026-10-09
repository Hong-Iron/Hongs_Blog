---
layout: "note"
title: "추천 방법 비교"
display_title: "추천 방법 비교"
kind: "concept"
kind_label: "비교"
num: "42"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Content-based vs Collaborative Filtering", "내용 기반 대 협업 필터링", "하이브리드 추천", "Hybrid Recommendation", "내용을 통한 협업", "Collaboration via Content"]
description: "세 방법 모두 \"사용자가 좋아할 것\"을 고르지만 근거가 다르다. 내용 기반은 아이템의 속성을, 사용자 기반 협업 필터링은 비슷한 사람을, 아이템 기반 협업 필터링은 함께 소비된 아이템을 근거로 삼는다. 가르는 질문은 \"새로 들어온 것이 사용자인가 아이템인가, 평점이 충분한가\"다."
prev_url: "/studies/data-science/collaborative-filtering/"
prev_title: "협업 필터링"
next_url: "/studies/data-science/recommender-metrics/"
next_title: "추천 평가 지표"
math: false
mermaid: false
code_count: 0
permalink: "/studies/data-science/contrast--recommendation-methods/"
---
{% raw %}
세 방법 모두 "사용자가 좋아할 것"을 고르지만 근거가 다르다. 내용 기반은 아이템의 속성을, 사용자 기반 협업 필터링은 비슷한 사람을, 아이템 기반 협업 필터링은 함께 소비된 아이템을 근거로 삼는다. 가르는 질문은 "새로 들어온 것이 사용자인가 아이템인가, 평점이 충분한가"다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 오늘 올라온 뉴스 기사를 바로 추천해야 한다. 아직 아무도 읽지 않았다. (b) 영화 앱에 평점이 수백만 개 쌓였고, 사용자 수가 아이템 수보다 훨씬 많고 자주 바뀐다. 어느 방법인가?</summary>

**답:** (a) 내용 기반. 기사의 단어로 아이템 프로필을 바로 만들 수 있다. 협업 필터링은 평점이 없는 새 아이템을 추천하지 못한다. (b) 아이템 기반 협업 필터링. 아이템 사이 유사도는 평점이 많이 쌓여 안정적이고 미리 계산해 둘 수 있어, 사용자 기반보다 확장성이 좋다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 사용자가 좋아한 것과 비슷한 것만 계속 나와 지루하다는 불만이 많다. (d) 음악처럼 내용(소리)을 뽑기 어렵지만 재생 기록은 많다. 어느 방법인가?</summary>

**답:** (c) 사용자 기반 협업 필터링. 비슷한 사람이 좋아한 뜻밖의 아이템이 나와 더 다양하다. 내용 기반과 아이템 기반은 이미 좋아한 것과 비슷한 것만 추천해 과잉 특화된다. (d) 협업 필터링. 내용 분석 없이 기록만으로 추천한다.

</details>


## 결정적 차이

| | 내용 기반 | 사용자 기반 CF | 아이템 기반 CF |
|---|---|---|---|
| 핵심 생각 | 내용·속성이 비슷한 아이템 | 비슷한 사용자가 좋아한 아이템 | 이전에 좋아한 것과 비슷한 아이템 |
| 쓰는 정보 | 아이템 메타데이터(손으로 설계한 특징) | 사용자-아이템 평점 행렬 | 사용자-아이템 평점 행렬 |
| 장점 | 간단, 해석 가능, 새 아이템에 효과적 | 개인 취향을 더 정확히, 더 다양한 추천 | 사용자 기반보다 안정적이고 확장성이 좋다 |
| 한계 | 내용 분석의 한계, 과잉 특화, 새 사용자 문제 | 새 사용자·새 아이템에 약함, 희소성 | 다양성이 낮음, 새 아이템에 약함, 희소성 |

표는 슬라이드 p.28을 옮긴 것이다[^1]. 선택을 가르는 줄은 "한계"다. 새 아이템이 문제면 내용 기반, 다양성이 문제면 사용자 기반, 규모와 안정성이 문제면 아이템 기반이다.

## 둘 다 아닐 때: 하이브리드

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 내용 기반과 협업 필터링의 한계를 함께 덜고 싶다. 하이브리드 세 가지 방식을 쓰고, "함께 평가한 아이템이 너무 적어 이웃을 찾기 어렵다"는 문제에 맞는 방식을 고르라.</summary>

**답:** ① 따로 만든 두 추천기의 결과(평점)를 선형 결합하거나 더 믿을 만한 쪽을 고른다. ② 협업 필터링에 내용 정보를 더한다(내용을 통한 협업): 내용 기반 사용자 프로필로 이웃을 더 찾고, 내용 기반 예측 평점으로 사용자의 평점 벡터를 채운다. ③ 내용 기반에 협업 정보를 더한다: 여러 사용자의 내용 프로필을 행렬로 모아 SVD 같은 차원 축소를 해 낮은 차원으로 옮긴다. 이웃 찾기 문제에는 ②가 맞다. 평점 벡터를 채우면 함께 채워진 칸이 늘어 희소성 문제가 준다[^2][^3][^4].

</details>


[^1]: 데이터 과학 11회 강의 자료 「11-1_intro-rec」, p.28
[^2]: 같은 자료, p.29 (방식 1: 따로 만든 추천기 결합)
[^3]: 같은 자료, p.30 (방식 2: 내용을 통한 협업)
[^4]: 같은 자료, p.31 (방식 3: 내용 프로필의 차원 축소)
{% endraw %}
