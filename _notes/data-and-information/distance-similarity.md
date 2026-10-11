---
layout: "note"
title: "거리와 유사도"
display_title: "거리와 유사도 (Distance and Similarity)"
kind: "concept"
kind_label: "정의"
num: "08"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-11"
status: "verified"
aliases: ["Distance and Similarity", "거리", "Distance", "유사도", "Similarity", "거리 함수", "거리 척도", "Metric", "거리의 조건", "삼각부등식", "Triangle Inequality", "대소 비교", "코사인 거리", "Cosine Distance"]
description: "두 대상이 얼마나 다른지를 수 하나로 적은 것이 거리이고, 얼마나 닮았는지를 적은 것이 유사도다. 지도 위 두 도시 사이의 길이처럼 거리는 작을수록 가깝고, 유사도는 그 눈금을 뒤집어 클수록 닮았다. 다만 아무 수나 거리라 부를 수는 없고, 자기 자신과만 0이고, 재는 방향을 바꿔…"
prev_url: "/studies/data-and-information/hamming-code/"
prev_title: "해밍 부호"
next_url: "/studies/data-and-information/mahalanobis-distance/"
next_title: "마할라노비스 거리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/distance-similarity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 대상이 얼마나 다른지를 수 하나로 적은 것이 거리이고, 얼마나 닮았는지를 적은 것이 유사도다. 지도 위 두 도시 사이의 길이처럼 거리는 작을수록 가깝고, 유사도는 그 눈금을 뒤집어 클수록 닮았다. 다만 아무 수나 거리라 부를 수는 없고, 자기 자신과만 0이고, 재는 방향을 바꿔도 같고, 다른 곳을 들러 가는 길이 곧장 가는 길보다 짧지 않아야 한다. 이 조건이 깨진 값은 "가까운 것의 가까운 것은 가깝다"는 추론에 쓸 수 없다.

</div>


## 예시로 보기

수는 크다·작다, 많다·적다를 비교할 수 있다. 사진, 문장, 장바구니는 그대로는 비교할 수 없다. "이 사진과 가장 닮은 사진"을 찾으려면 두 대상을 받아 수 하나를 내놓는 규칙이 있어야 한다. 그 수끼리 대소를 비교하면 가깝다·멀다가 나온다[^1].

슬라이드의 그림에서 바다사자 사진과 다른 세 사진의 유사도는 표범 0.81, 물범 0.88, 너구리 0.81이다[^1]. 물범이 가장 닮았다. 유사도를 "1에서 뺀 값"으로 거리로 바꾸면 0.19, 0.12, 0.19이고, 물범이 가장 가깝다. 순서가 뒤집힌 채로 같은 말을 한다.

거리라 부르려면 지켜야 할 조건이 있다. 좌표 위의 세 점 0, 1, 2에서 "차이의 제곱"을 거리로 쓰면 이렇게 된다.

- 0에서 2까지: $$(0 - 2)^2 = 4$$
- 0에서 1을 들러 2까지: $$(0 - 1)^2 + (1 - 2)^2 = 2$$

들러 가는 길이 곧장 가는 길보다 짧다. 지도에서는 있을 수 없는 일이다. 차이의 제곱은 순서를 매기는 데는 쓸 수 있지만 거리의 조건은 지키지 못한다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 유클리드·맨해튼·체비셰프 거리의 네 조건(무작위 2,000쌍), 바꾸기 식이 순서를 뒤집는 것, 조건이 깨지는 세 예(제곱 유클리드, 코사인 거리, 좌표 하나만 보기), 4 × 3 예의 5·7·4, 카드의 값 — [08_distance-similarity_verify.py](/Hongs_Blog/studies/data-and-information/code/08_distance-similarity_verify/)</div>

</div>


## 정의

대상들의 모음을 $$\mathcal{S}$$라 하자. 사진 전체, 문장 전체, 좌표 평면 위의 점 전체 같은 것이다.

**거리 함수.** 대상 둘을 받아 0 이상의 실수를 내놓는 함수 $$d : \mathcal{S} \times \mathcal{S} \to \mathbb{R}^+ \cup \{0\}$$이다[^2]. $$\mathbf x, \mathbf y, \mathbf z \in \mathcal{S}$$에 대해,

- $$d(\mathbf x, \mathbf y)$$가 작으면 $$\mathbf x$$와 $$\mathbf y$$는 가깝다. 곧 비슷하다.
- $$d(\mathbf x, \mathbf y) < d(\mathbf x, \mathbf z)$$이면 $$\mathbf x$$는 $$\mathbf z$$보다 $$\mathbf y$$에 더 가깝다.

**유사도 함수.** 대상 둘을 받아 실수를 내놓는 함수 $$s : \mathcal{S} \times \mathcal{S} \to \mathbb{R}$$이다. $$\mathbf x$$와 $$\mathbf y$$가 비슷하면 $$s(\mathbf x, \mathbf y)$$가 크다. 흔히 0부터 1까지로 맞춘다[^3].

**서로 바꾸기**[^3].

| 가진 것 | 바꾸는 식 | 쓰는 때 |
|---|---|---|
| 0~1의 유사도 $$s$$ | $$d_s = 1 - s$$ | 유사도에서 거리로 |
| 0~1의 거리 $$d$$ | $$s_d = 1 - d$$ | 거리에서 유사도로 |
| 가장 큰 값이 $$D$$인 거리 | $$s_d = 1 - \dfrac{d}{D}$$ | 거리가 1을 넘을 때 |
| 끝없이 커질 수 있는 거리 | $$s_d = \dfrac{1}{1 + d}$$ | 가장 큰 값을 모를 때 |

모두 거리가 0이면 유사도가 1이고, 거리가 클수록 유사도가 작다. 예: $$d = 3$$이면 $$\frac{1}{1 + 3} = 0.25$$다.

**거리의 척도.** 거리 함수가 다음 네 조건을 모두 지키면 거리의 척도(metric)라 한다[^4].

1. **0 이상:** $$d(\mathbf x, \mathbf y) \ge 0$$.
2. **같을 때만 0:** $$d(\mathbf x, \mathbf y) = 0 \iff \mathbf x = \mathbf y$$.
3. **대칭:** $$d(\mathbf x, \mathbf y) = d(\mathbf y, \mathbf x)$$.
4. **삼각부등식:** $$d(\mathbf x, \mathbf z) \le d(\mathbf x, \mathbf y) + d(\mathbf y, \mathbf z)$$.

4번은 삼각형의 한 변이 나머지 두 변의 합보다 길 수 없다는 말이다. 슬라이드의 그림은 삼각형을 점점 납작하게 눌러 $$\mathbf y$$가 $$\mathbf x$$와 $$\mathbf z$$를 잇는 선 위에 올 때 양쪽이 같아지는 것을 보여 준다[^4].

각 조건이 왜 필요한지는 깨지는 예로 본다[^s1].

| 깨지는 조건 | 예 | 무슨 일이 생기나 |
|---|---|---|
| 2 (같을 때만 0) | 첫 좌표만 비교: $$(1, 2)$$와 $$(1, 9)$$가 0 | 다른 대상을 같다고 본다 |
| 3 (대칭) | 일방통행 길의 주행 시간 | "A에서 가까운 B"가 "B에서 가까운 A"가 아니다 |
| 4 (삼각부등식) | 차이의 제곱: $$4 > 1 + 1$$ | 가까운 것의 가까운 것이 멀 수 있다 |

**어떤 자료에 어떤 척도를 쓰나.** 슬라이드는 관계를 재야 할 자료를 아홉 가지로 든다. 숫자, 범주, 둘이 섞인 것, 집합, 이진, 문자열, 글, 그래프, 시계열이다[^5]. 이 과목 4회가 다루는 척도는 이렇게 나뉜다[^6].

| 자료 | 척도 | 문서 |
|---|---|---|
| 숫자 벡터 | 민코프스키 거리 | [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/) |
| 숫자 벡터(퍼진 모양까지) | 마할라노비스 거리 | [마할라노비스 거리](/Hongs_Blog/studies/data-and-information/mahalanobis-distance/) |
| 숫자 벡터(방향만) | 코사인 유사도 | [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/) |
| 범주, 이진 부호 | 겹침 유사도, 해밍 거리, 자카드 | [범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/), [해밍 거리와 부호 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/) |
| 문자열 | 토큰 기반 유사도, 편집 거리 | [문자열 유사도](/Hongs_Blog/studies/data-and-information/string-similarity/), [편집 거리](/Hongs_Blog/studies/data-and-information/edit-distance/) |

## 예제

**코사인 거리는 척도가 아니다.** 코사인 유사도를 1에서 뺀 $$1 - \cos(\mathbf x, \mathbf y)$$를 코사인 거리라 부른다[^7]. 이름은 거리지만 조건 2와 4를 어긴다[^s1].

1. *같을 때만 0인가:* $$(1, 2)$$와 $$(2, 4)$$는 방향이 같아 코사인이 1, 거리가 0이다. 다른 점인데 0이다.
2. *삼각부등식:* $$\mathbf a = (1, 0)$$, $$\mathbf b = (1, 1)$$, $$\mathbf c = (0, 1)$$로 잰다. $$\mathbf a$$와 $$\mathbf c$$는 직각이라 거리 1이다. $$\mathbf a$$–$$\mathbf b$$와 $$\mathbf b$$–$$\mathbf c$$는 45도라 각각 $$1 - \frac{1}{\sqrt2} \approx 0.293$$이다.
3. *비교:* 들러 가는 길 $$0.293 + 0.293 = 0.586$$이 곧장 가는 길 1보다 짧다. 삼각부등식이 깨진다.

코사인 거리는 "닮은 순서"를 매기는 데는 쓸 수 있다. 하지만 삼각부등식에 기대는 계산에는 넣을 수 없다.

## 활용

- **가까운 것 찾기.** 최근접 이웃 찾기, 군집화, 추천, 중복 찾기가 모두 거리나 유사도의 대소 비교다[^s1].
- **삼각부등식으로 계산 아끼기.** $$d(\mathbf x, \mathbf y)$$가 크고 $$d(\mathbf y, \mathbf z)$$가 작으면 $$d(\mathbf x, \mathbf z) \ge d(\mathbf x, \mathbf y) - d(\mathbf y, \mathbf z)$$라서 $$\mathbf z$$도 멀다는 것을 재지 않고 안다. 척도가 아니면 이 지름길을 쓸 수 없다[^s1].
- **오류 정정.** [부호 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/)가 $$2t + 1$$이면 $$t$$개를 고친다는 증명이 해밍 거리의 삼각부등식을 쓴다.
- 흔한 실수: 유사도와 거리를 섞어 "값이 큰 쪽이 가깝다"와 "값이 작은 쪽이 가깝다"를 뒤바꾸는 것. 정렬 방향을 먼저 확인한다.

## 연결

- 선수: [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)(벡터의 길이와 삼각부등식)
- 대칭이 깨지는 척도: [KL 발산](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/)
- 이어지는 개념: [마할라노비스 거리](/Hongs_Blog/studies/data-and-information/mahalanobis-distance/), [문자열 유사도](/Hongs_Blog/studies/data-and-information/string-similarity/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 거리 함수가 거리의 척도가 되기 위한 네 조건을 쓰라.</summary>

**답:** ① $$d(\mathbf x, \mathbf y) \ge 0$$ ② $$d(\mathbf x, \mathbf y) = 0$$인 것은 $$\mathbf x = \mathbf y$$일 때뿐 ③ $$d(\mathbf x, \mathbf y) = d(\mathbf y, \mathbf x)$$ ④ $$d(\mathbf x, \mathbf z) \le d(\mathbf x, \mathbf y) + d(\mathbf y, \mathbf z)$$.<br>
**흔한 오답:** ②를 "같으면 0"으로만 쓰는 것. "0이면 같다"까지 있어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 두 대상의 거리가 3이다. 가장 큰 거리가 10인 경우의 유사도와, 가장 큰 거리를 모르는 경우의 유사도를 구하라.</summary>

**답:** $$1 - \frac{3}{10} = 0.7$$. 모르면 $$\frac{1}{1 + 3} = 0.25$$.<br>
**이유:** 두 값이 달라도 괜찮다. 같은 식으로 바꾼 값끼리만 비교하면 순서는 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "차이의 제곱" $$d(a, b) = (a - b)^2$$이 거리의 척도가 아님을 보여라. 어느 조건이 깨지는가?</summary>

**답:** 삼각부등식. $$a = 0, b = 1, c = 2$$에서 $$d(a, c) = 4$$인데 $$d(a, b) + d(b, c) = 1 + 1 = 2$$다. 조건 1~3은 지킨다.

</details>


[^1]: 자료와 정보 4회 강의 자료 「D&I_강의04-1-유사도와거리」, p.2 (대소 비교: 크다/작다, 많다/적다, 가깝다/멀다, 동물 사진과 0.81·0.88·0.81)
[^2]: 같은 자료, p.3 (거리: distance function의 꼴과 직관)
[^3]: 같은 자료, p.4 (비슷함: similarity function, $$d_s = 1 - s$$, $$s_d = 1 - d$$, $$1 - \frac{d}{D}$$, $$\frac{1}{1 + d}$$)
[^4]: 같은 자료, p.5 (거리의 척도: 네 조건, 삼각형 그림)
[^5]: 같은 자료, p.6 (관계 측정하기: numerical, categorical, mixed, sets, binary, strings, text, graphs, time series)
[^6]: 자료와 정보 4회 강의 자료 「D&I_강의04-2-유사도와거리」, p.19 (요약: Vector space와 Code space의 척도 목록)
[^7]: 자료와 정보 4회 강의 자료 「D&I_강의04-1-유사도와거리」, p.12 (Cosine distance: $$1 - \cos(\mathbf x, \mathbf y)$$)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 지도 비유, 사진 유사도를 거리로 바꾼 값, 조건이 깨지는 예 셋(차이의 제곱, 첫 좌표만 비교, 일방통행)과 코사인 거리의 반례, 활용 절, 카드는 슬라이드에 없다. 수치는 검증 코드로 확인했다. 삼각부등식으로 계산을 아끼는 방법은 Elkan, "Using the triangle inequality to accelerate k-means"(2003)가 대표 예다.
{% endraw %}
