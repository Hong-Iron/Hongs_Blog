---
layout: "note"
title: "추천 시스템"
display_title: "추천 시스템 (Recommender System)"
kind: "concept"
kind_label: "정의"
num: "39"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Recommender System", "추천 시스템", "정보 과부하", "Information Overload", "내용 정보", "Content Information", "협업 정보", "Collaborative Information", "다양성", "Diversity", "공정성", "Fairness", "설명 가능성", "Explainability"]
description: "쇼핑몰, OTT, 뉴스, SNS에는 고를 것이 너무 많다. 추천 시스템은 한 사람이 그동안 산 것·본 것을 보고 그 사람이 좋아할 만한 것 몇 개만 골라 보여 준다. 실마리는 두 가지다. 물건 자체의 내용(장르, 배우, 단어)과, 다른 사람들의 취향(나와 비슷한 사람이 좋아한 것)…"
prev_url: "/studies/data-science/spectral-clustering/"
prev_title: "스펙트럼 군집화"
next_url: "/studies/data-science/content-based-recommendation/"
next_title: "내용 기반 추천"
math: false
mermaid: false
code_count: 0
permalink: "/studies/data-science/recommender-systems/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쇼핑몰, OTT, 뉴스, SNS에는 고를 것이 너무 많다. 추천 시스템은 한 사람이 그동안 산 것·본 것을 보고 그 사람이 좋아할 만한 것 몇 개만 골라 보여 준다. 실마리는 두 가지다. 물건 자체의 내용(장르, 배우, 단어)과, 다른 사람들의 취향(나와 비슷한 사람이 좋아한 것)이다. 다만 사람의 취향은 바뀌고, 무엇이 "좋은 추천"인지 재기도 어렵고, 비슷한 것만 반복하거나 인기 있는 것만 미는 문제도 있다.

</div>


## 예시로 보기

정보가 폭발적으로 늘어 사용자는 넘치는 선택지 앞에서 지친다(정보 과부하). 넷플릭스, 왓챠, 아마존, 음악 스트리밍, 네이버 뉴스·쇼핑, BBC가 모두 추천 시스템을 쓴다[^1][^2].

추천 시스템은 네 단계로 일한다[^3]. ① 사용자가 아이템을 산다(본다, 누른다) ② 시스템이 그 기록으로 취향을 분석한다 ③ 좋아할 만한 아이템 몇 개를 고른다 ④ 추천한다.

쓸 수 있는 정보는 여러 가지다[^4].

| 정보 | 무엇인가 | 예 |
|---|---|---|
| 내용 정보 | 아이템 자체의 속성 | 영화의 감독·배우·장르·줄거리, 상품의 이름·분류·사진 |
| 협업 정보 | 사용자들이 함께 남긴 상호작용 | 존과 팀의 취향이 비슷하다. 두 아이스크림을 비슷한 사람들이 먹는다 |
| 사회 정보 | 사용자 사이의 신뢰·친구 관계 | 친구가 본 영화 |
| 외부 지식 | 지식 그래프 같은 바깥 정보 | 감독과 영화의 관계 |

## 정의

**추천 시스템**의 목표는 사용자의 정보 과부하를 덜고 만족을 최대로 하는 것, 곧 대상 사용자가 좋아할 아이템 몇 개를 제공하는 것이다[^3].

**분류**[^5]: 내용 기반 추천, 협업 필터링(CF) 기반 추천, 둘을 섞은 하이브리드 추천, 신뢰 기반(사회적) 추천 등.

**주요 과제**[^6][^7]:

- **사용자·아이템 모델링:** 각 사용자의 진짜 취향을 어떻게 정확히 잡나? 정해진 꼴이 없는 자료(글, 사진)에서 아이템 특징을 어떻게 뽑나? 시간에 따라 바뀌는 취향, 짧은 관심과 오래가는 관심을 어떻게 구분하나?
- **평가:** 추천의 질을 어떻게 재나? 어떤 지표가 실제 만족을 잘 반영하나?
- **그 밖의 면:** 같은 것만 반복하지 않는 다양성, 사용자 무리 사이의 공정성, 왜 추천했는지 설명하는 설명 가능성과 신뢰.

## 연결

- 두 갈래의 방법: [내용 기반 추천](/Hongs_Blog/studies/data-science/content-based-recommendation/), [협업 필터링](/Hongs_Blog/studies/data-science/collaborative-filtering/)
- 평가: [추천 평가 지표](/Hongs_Blog/studies/data-science/recommender-metrics/)
- "함께 산 것"으로 묶음을 제안하는 다른 방법: [연관 규칙](/Hongs_Blog/studies/data-science/association-rules/)(장바구니 분석)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 추천 시스템의 목표와 네 단계를 쓰라.</summary>

**답:** 정보 과부하를 덜고 만족을 최대로 하도록, 사용자가 좋아할 아이템 몇 개를 제공한다. ① 사용자가 아이템을 이용 ② 시스템이 취향 분석 ③ 좋아할 아이템 선택 ④ 추천.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 추천 이유는 내용 정보와 협업 정보 중 무엇을 쓴 것인가? ① "당신이 본 스릴러와 같은 감독의 영화" ② "이 상품을 산 사람들이 함께 산 상품" ③ "당신과 취향이 비슷한 사용자가 높게 평가한 앨범"</summary>

**답:** ① 내용 정보(아이템의 감독). ② 협업 정보(다른 사용자들의 구매). ③ 협업 정보(비슷한 사용자의 평가).

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/11.11-1_intro-rec.pdf, p.3~4
[^2]: 같은 자료, p.6
[^3]: 같은 자료, p.5
[^4]: 같은 자료, p.9~10
[^5]: 같은 자료, p.11
[^6]: 같은 자료, p.7
[^7]: 같은 자료, p.8
{% endraw %}
