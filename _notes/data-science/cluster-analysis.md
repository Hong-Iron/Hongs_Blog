---
layout: "note"
title: "군집 분석"
display_title: "군집 분석 (Cluster Analysis)"
kind: "concept"
kind_label: "정의"
num: "24"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["Cluster Analysis", "군집화", "Clustering", "군집", "Cluster", "비지도 학습", "Unsupervised Learning", "군집 내 유사도", "Intra-cluster Similarity", "군집 간 유사도", "Inter-cluster Similarity"]
description: "정답 표시가 없는 자료를 비슷한 것끼리 몇 무리로 나누는 일이다. 좋은 무리는 안쪽끼리는 서로 닮고, 다른 무리와는 확실히 다르다. 고객을 취향별로 나누거나, 사진의 색을 몇 가지로 줄이는 데 쓴다. 다만 정답이 없어 \"잘 나눴다\"를 재는 기준부터 정해야 하고, 그 기준(거리, 확…"
prev_url: "/studies/data-science/contrast--bagging-boosting/"
prev_title: "배깅과 부스팅 비교"
next_url: "/studies/data-science/k-means/"
next_title: "k-평균"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/cluster-analysis/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

정답 표시가 없는 자료를 비슷한 것끼리 몇 무리로 나누는 일이다. 좋은 무리는 안쪽끼리는 서로 닮고, 다른 무리와는 확실히 다르다. 고객을 취향별로 나누거나, 사진의 색을 몇 가지로 줄이는 데 쓴다. 다만 정답이 없어 "잘 나눴다"를 재는 기준부터 정해야 하고, 그 기준(거리, 확률, 밀도, 연결)에 따라 같은 자료도 다르게 나뉜다.

</div>


## 예시로 보기

분류는 "이 사진은 고양이"처럼 정답을 보고 배운다. 그런데 정답 없이 고객 수만 명의 구매 기록만 있다면, 비슷한 고객끼리 묶는 것부터 해야 한다[^1]. 정답이 없으니 오답률도 계산할 수 없다. 그래서 군집화는 어렵고 주관적이다[^1].

쓰임 두 가지[^2][^3].

- **자료 요약:** 숫자 손글씨 사진들을 군집화하면 군집 중심이 "평균적인 0, 1, 2…"의 모습이 된다. 중심은 실제 사진이 아니지만 그 무리를 잘 대표한다.
- **색 줄이기:** 사진의 각 화소는 (R, G, B) 세 값이다. 화소들을 $$k$$개 군집으로 묶고 각 화소를 자기 군집의 중심 색으로 바꾸면, 사진에 쓰인 색이 $$k$$가지로 준다. 압축이자 영상 분할이다.

## 정의

**군집**은 같은 군집 안에서는 서로 비슷하고 다른 군집의 점들과는 다른 자료점의 모임이다[^1].

**군집 분석**은 자료점 $$\{\mathbf x_i\}_{i=1}^{n}$$, $$\mathbf x_i \in \mathbb{R}^d$$($$d$$는 자료의 차원)를 $$k$$개 무리로 나누는 일이다. 출력은 군집 중심과 각 점의 소속이다. 미리 정한 정답 표시가 없는 비지도 학습이다[^1].

좋은 군집화는[^4]

- **군집 내 유사도가 높다:** 군집 안쪽이 촘촘하다.
- **군집 간 유사도가 낮다:** 군집끼리 뚜렷이 다르다.

"얼마나 비슷해야 충분히 비슷한가"는 주관적이고, 응용마다 알맞은 유사도가 다르다. 그래서 군집화 방법은 기준에 따라 거리 기반, 확률 기반, 밀도 기반, 연결 기반으로 나뉜다[^4].

| 기준 | 이 과목의 방법 |
|---|---|
| 거리 | [k-평균](/Hongs_Blog/studies/data-science/k-means/), [k-메도이드](/Hongs_Blog/studies/data-science/k-medoids/) |
| 확률 | [가우스 혼합 모델](/Hongs_Blog/studies/data-science/gaussian-mixture-model/) |
| 밀도 | [DBSCAN](/Hongs_Blog/studies/data-science/dbscan/), [CLIQUE](/Hongs_Blog/studies/data-science/clique/) |

## 연결

- 선수: [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)(비슷함을 재는 법)
- 이상치 찾기: [데이터 정제](/Hongs_Blog/studies/data-science/data-cleaning/)의 이상치 분석은 어느 군집에도 들지 않는 값을 잡음으로 본다.
- 방법 비교: [군집화 알고리즘 비교](/Hongs_Blog/studies/data-science/contrast--clustering-algorithms/)

## 과목별 관점

**자료와 정보 (2-1학기).** 군집화를 "자료를 요약할 대표 선수 뽑기"로 시작한다. 가진 것이 자료 $$N$$개뿐일 때 그 자료를 잘 나타내는 대표를 뽑으려면 네 가지를 정해야 한다. 대표를 몇 개 둘지, 대표를 점 하나로 둘지 무리로 둘지, 무리의 대표를 무엇으로 적을지, 대표를 어떻게 고를지다[^i1]. 자료는 $$\mathbf x_0, \dots, \mathbf x_{N-1}$$처럼 0번부터 세고 차원은 $$D$$로 쓴다($$\mathbf x_i \in \mathbb{R}^D$$). 이 문서의 $$n$$, $$d$$와 같은 수다[^i2].

- **묶는 기준은 정하기 나름이다.** 심슨 만화의 인물 아홉 명은 "심슨 가족 / 학교 직원"으로도, "여자 / 남자"로도 나뉜다. 사람들이 한 줄로 선 사진도 성별, 나이, 옷차림 가운데 무엇을 보느냐에 따라 다르게 묶인다. 어느 쪽도 틀린 답이 아니다. 기준을 먼저 정해야 답이 생긴다[^i3].
- **왜 묶는가.** 자료마다 정답 표시를 붙이는 일은 비싸다. 자료가 어떤 짜임인지 알고 싶다. 자료를 대표하는 본보기(prototype)를 찾고 싶다[^i4]. 묶고 나면 얻는 것은 넷이다. 자료 안에 서로 다른 집단이 몇 개인지 가설을 세운다. 무리마다 예측 모델을 따로 만든다. 무리를 그 중심 하나로 바꿔 자료를 줄인다. 중심에서 먼 점이나 아주 작은 무리에 끼인 점을 이상치로 골라낸다[^i5].
- **방법을 가르는 다른 축.** 위 표는 "비슷함을 무엇으로 재는가"로 방법을 갈랐다. 이 강의는 "무리를 어떤 꼴로 내놓는가"로 가른다. 평면 방식(flat)은 처음에 아무렇게나 나눈 뒤 조금씩 고쳐 간다. k-평균과 모델 기반 군집화가 여기에 든다. 계층 방식(hierarchical)은 무리 안에 무리가 든 나무를 만든다. 점 하나짜리 무리에서 시작해 가까운 것끼리 합쳐 올라가는 방식(agglomerative)과, 전체를 한 무리로 두고 쪼개 내려가는 방식(divisive)이 있다[^i6].
- **한 곳에만 넣기와 여러 곳에 넣기.** 점마다 무리 하나에만 넣는 방식(hard clustering)이 더 흔하고 쉽다. 한 점을 여러 무리에 넣는 방식(soft clustering)도 있다. 운동화 한 켤레는 "스포츠 의류"에도 "신발"에도 들어가야 손님이 찾기 쉽다. 이런 일은 여러 곳에 넣는 방식으로만 할 수 있다[^i7].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 군집 분석의 입력과 출력을 쓰고, 좋은 군집화의 두 조건을 쓰라.</summary>

**답:** 입력은 정답 없는 자료점 $$n$$개($$d$$차원 벡터), 출력은 군집 중심과 각 점의 소속이다. 군집 안쪽 유사도는 높고, 군집 사이 유사도는 낮아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 중 군집 분석으로 풀 일과 분류로 풀 일을 가르라. ① 스팸/정상 표시가 붙은 메일로 새 메일을 판정 ② 표시 없는 뉴스 기사 수만 건을 주제별로 묶기 ③ 사진의 색을 16가지로 줄이기</summary>

**답:** ① 분류(정답 표시로 배운다). ② 군집 분석. ③ 군집 분석(화소 색을 16개 군집으로 묶고 중심 색으로 바꾼다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 일에 맞는 방식을 고르라. ① 온라인 상점에서 운동화를 "신발"과 "스포츠 의류" 두 갈래 모두에서 찾게 한다 ② 생물을 "큰 무리 안에 작은 무리, 그 안에 더 작은 무리"로 보여 준다 ③ 고객을 겹치지 않는 세 무리로 나눠 무리마다 다른 쿠폰을 보낸다</summary>

**답:** ① 여러 곳에 넣기(소프트 군집화). ② 계층 방식. ③ 한 곳에만 넣는 평면 방식(k-평균 등).<br>
**이유:** ①은 한 물건이 두 무리에 동시에 들어야 하므로 한 곳에만 넣는 방식으로는 할 수 없다. ②는 무리가 서로 품는 나무 꼴이 필요한데, 평면 방식은 같은 높이의 무리 몇 개만 내놓는다. ③은 한 사람이 쿠폰 하나만 받아야 하므로 겹치지 않게 나눈다[^is1].

</details>


[^1]: 데이터 과학 7회 강의 자료 「7-1_basic-clustering」, p.3
[^2]: 같은 자료, p.5
[^3]: 같은 자료, p.6
[^4]: 같은 자료, p.4
[^i1]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.2 (데이터 요약하기: 대표 선수 뽑기와 풀어야 할 문제 네 가지)
[^i2]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.12 (자료 집합과 차원의 표기)
[^i3]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.5~7 (어떻게 나눌 것인가, 정하기 나름, 묶는 기준: 성별·나이·스타일)
[^i4]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.8 (군집화를 하는 이유, 비지도 학습)
[^i5]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.9 (군집화의 효과 네 가지)
[^i6]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.10 (평면 방식과 계층 방식, 분류 그림)
[^i7]: 자료와 정보 5회 강의 자료 「D&I_강의05-군집화」, p.11 (hard clustering과 soft clustering, 운동화 예)
[^is1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 카드 C3의 ②와 ③은 원본에 없는 상황이다. 슬라이드 p.10의 계층 방식 설명과 p.11의 hard clustering 설명에 맞춰 만들었다. ①은 슬라이드 p.11의 예다.
{% endraw %}
