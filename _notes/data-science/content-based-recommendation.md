---
layout: "note"
title: "내용 기반 추천"
display_title: "내용 기반 추천 (Content-based Recommendation)"
kind: "concept"
kind_label: "기법"
num: "40"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Content-based Recommendation", "아이템 프로필", "Item Profile", "사용자 프로필", "User Profile", "TF-IDF", "단어 빈도", "Term Frequency", "역문서 빈도", "Inverse Document Frequency", "효용 함수", "Utility Function", "과잉 특화", "Overspecialization", "차가운 시작", "Cold Start"]
description: "사용자가 좋아한 아이템과 내용이 비슷한 아이템을 추천한다. 아이템마다 \"어떤 단어·장르·배우가 얼마나 중요한가\"를 숫자 목록으로 만들고, 사용자가 본 아이템들의 목록을 합쳐 사용자의 취향 목록을 만든 뒤, 둘이 가장 비슷한 아이템을 고른다. 다른 사용자가 필요 없어 아직 아무도 안…"
prev_url: "/studies/data-science/recommender-systems/"
prev_title: "추천 시스템"
next_url: "/studies/data-science/collaborative-filtering/"
next_title: "협업 필터링"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/content-based-recommendation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사용자가 좋아한 아이템과 내용이 비슷한 아이템을 추천한다. 아이템마다 "어떤 단어·장르·배우가 얼마나 중요한가"를 숫자 목록으로 만들고, 사용자가 본 아이템들의 목록을 합쳐 사용자의 취향 목록을 만든 뒤, 둘이 가장 비슷한 아이템을 고른다. 다른 사용자가 필요 없어 아직 아무도 안 본 새 아이템도 추천할 수 있다. 대신 내용을 뽑기 어려운 사진·영상에 약하고, 늘 비슷한 것만 추천하며, 기록이 없는 새 사용자에게는 추천할 수 없다.

</div>


## 예시로 보기

사용자가 생명정보학 논문을 많이 읽었다. "genome", "sequencing" 같은 단어가 많은 후보 논문을 추천하면 된다[^1]. 이를 숫자로 하려면 단어마다 그 논문에서의 중요도를 매겨야 한다.

"the" 같은 단어는 모든 논문에 나와 아무것도 구별하지 못한다. 그래서 그 논문에 자주 나오면서(TF) 다른 논문에는 드물게 나오는(IDF) 단어에 큰 가중치를 준다[^2].

논문 4편에 단어 4개(genome, sequencing, network, the)가 나온 횟수로 해 보자. p1, p2는 생명정보학, p3, p4는 네트워크 논문이다[^s1].

| | genome | sequencing | network | the |
|---|---|---|---|---|
| 나온 논문 수 $$n_i$$ | 2 | 3 | 3 | 4 |
| IDF $$= \lg\frac{4}{n_i}$$ | 1.0 | 0.415 | 0.415 | 0 |

"the"는 IDF가 0이라 어느 논문에서나 가중치 0이다. p1을 읽은 사용자의 프로필과 코사인 유사도를 재면 p2 0.984, p4 0.047, p3 0이다. 생명정보학 논문 p2가 먼저 추천된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: IDF, "the"의 가중치 0, 효용 순서, 평점 없는 새 글의 효용, 카드 C2 — [40_content-based_verify.py](/Hongs_Blog/studies/data-science/code/40_content-based_verify/)</div>

</div>


## 정의

내용 기반 추천은 사용자가 좋아한 아이템과 내용이 비슷한 아이템을 추천한다. 내용은 아이템의 메타데이터(영화의 장르, 배우, 감독 등)다. 대상 사용자와 후보 아이템이 주어지면 ① 사용자 프로필과 아이템 프로필(벡터)을 뽑고 ② 둘의 유사도를 재서 가장 비슷한 아이템을 추천한다[^3].

**아이템 프로필.** 아이템을 잘 나타내는 특징을 고르는 것(특징 공학)이 중요하다. 예: 영화에서는 상영 시간·제작사보다 감독·배우가 나은 특징일 수 있다. 글은 TF-IDF로 나타낸다[^2].

$$TF_{i,j} = \frac{f_{i,j}}{\max_z f_{z,j}}, \qquad IDF_i = \log\frac{N}{n_i}, \qquad w_{i,j} = TF_{i,j} \times IDF_i$$


$$f_{i,j}$$는 글 $$d_j$$에서 단어 $$k_i$$가 나온 횟수, $$\max_z f_{z,j}$$는 그 글에서 가장 많이 나온 단어의 횟수, $$N$$은 전체 글 수, $$n_i$$는 단어 $$k_i$$가 나온 글의 수다. 글의 프로필은 $$\operatorname{Content}(d_j) = (w_{1j}, w_{2j}, \dots, w_{kj})$$다.

**사용자 프로필.** 사용자가 좋아한 아이템들의 내용을 모은다(평균, 가중 평균, 최댓값, 선형 변환 등). 평균이면 $$w_{i,c} = \frac1n\sum_{j=1}^{n}w_{i,j}$$다[^4].

**효용 함수.** 아이템 $$s$$가 사용자 $$c$$에게 얼마나 쓸모 있는지를 $$u(c, s) = \operatorname{score}(\operatorname{ContentBasedProfile}(c), \operatorname{Content}(s))$$로 재고, 점수가 높은 아이템 몇 개를 고른다. 점수로는 코사인 유사도, 피어슨 상관계수, 유클리드 거리 등을 쓴다[^5].

**모델 기반 방법.** 자료로 학습한 모델로 선호를 예측한다. 추천을 "추천함/안 함"의 이진 분류로 보고 베이즈 분류기, 결정 트리, 로지스틱 회귀, 딥러닝 모델을 쓴다. 나이브 베이즈는 아이템 $$j$$의 내용 $$k_{1,j}, \dots, k_{n,j}$$가 주어질 때 부류 $$c_i$$의 확률을 $$P(c_i \mid k_{1,j} \& \cdots \& k_{n,j}) = \frac{P(c_i)\prod_n P(k_{n,j} \mid c_i)}{\prod_n P(k_{n,j})}$$로 근사한다. 이 식은 단어들이 서로 독립이라고 가정한다[^6].

## 활용

- **한계**[^7]:
    - 내용 분석의 한계: 글보다 사진·소리·영상에서 내용을 뽑기 어렵다. 같은 단어로 이루어진 두 글(잘 쓴 글과 못 쓴 글)을 구별하지 못한다.
    - 과잉 특화: 이미 평가한 것과 비슷한 것만 추천해 다양성이 낮다. 같은 사건의 뉴스만 계속 나온다.
    - 새 사용자의 차가운 시작: 기록이 없으면 추천도 없다. 믿을 만한 추천을 받으려면 충분히 평가해야 한다.
- **장점:** 다른 사용자의 기록이 필요 없어 새 아이템도 바로 추천할 수 있다[^8].

## 연결

- 선수: [추천 시스템](/Hongs_Blog/studies/data-science/recommender-systems/), [코사인 유사도](/Hongs_Blog/studies/linear-algebra/dot-product/)
- 다른 사용자를 쓰는 방법: [협업 필터링](/Hongs_Blog/studies/data-science/collaborative-filtering/)
- 나이브 베이즈의 바탕: [베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** TF, IDF, TF-IDF 가중치의 식을 쓰고, 각각 무엇을 잡아내는지 말하라.</summary>

**답:** $$TF_{i,j} = \frac{f_{i,j}}{\max_z f_{z,j}}$$는 그 글에서 단어가 얼마나 자주 나오는지, $$IDF_i = \log\frac{N}{n_i}$$는 그 단어가 전체에서 얼마나 드문지, $$w_{i,j} = TF \times IDF$$는 둘을 함께 본다. 그 글에 자주 나오면서 다른 글에 드문 단어가 그 글을 대표한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 글 8편 중 2편에 나오는 단어가 있다. 어떤 글에서 이 단어가 2번, 그 글의 최다 빈도 단어가 4번 나온다. 이 단어의 TF, IDF(밑 2), 가중치는?</summary>

**답:** $$TF = \frac24 = 0.5$$, $$IDF = \lg\frac82 = 2$$, 가중치 $$0.5 \times 2 = 1$$[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 내용 기반 추천이 새 아이템에는 강하고 새 사용자에게는 약한 이유를 설명하라.</summary>

**답:** 새 아이템도 내용(단어, 장르)은 있으므로 아이템 프로필을 바로 만들어 사용자 프로필과 비교할 수 있다. 새 사용자는 좋아한 아이템이 없어 사용자 프로필을 만들 수 없다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/11.11-1_intro-rec.pdf, p.17
[^2]: 같은 자료, p.14
[^3]: 같은 자료, p.13
[^4]: 같은 자료, p.15
[^5]: 같은 자료, p.16
[^6]: 같은 자료, p.18
[^7]: 같은 자료, p.19
[^8]: 같은 자료, p.28 (비교표: 새 아이템에 효과적)
[^s1]: 에이전트 보충. 논문 4편 × 단어 4개 예와 효용 값, 카드 C2는 원본에 없다. 검증 코드로 계산했다.
{% endraw %}
