---
layout: "note"
title: "데이터 통합"
display_title: "데이터 통합 (Data Integration)"
kind: "concept"
kind_label: "기법"
num: "06"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Data Integration", "개체 식별 문제", "Entity Identification", "스키마 통합", "Schema Integration", "객체 매칭", "Object Matching", "메타데이터", "Metadata", "중복", "Redundancy", "상관 분석", "Correlation Analysis"]
description: "여러 곳에서 모은 데이터를 하나로 합치는 일이다. 같은 고객이 한 곳에서는 \"Customerid\", 다른 곳에서는 \"Customernumber\"로 적혀 있으면 둘이 같은 칸임을 알아봐야 하고, 합친 뒤 다른 칸에서 계산해 낼 수 있는 칸(중복)은 골라내야 한다. 잘 합치면 이후 분…"
prev_url: "/studies/data-science/data-cleaning/"
prev_title: "데이터 정제"
next_url: "/studies/data-science/normalization/"
next_title: "정규화"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/data-integration/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 곳에서 모은 데이터를 하나로 합치는 일이다. 같은 고객이 한 곳에서는 "Customer_id", 다른 곳에서는 "Customer_number"로 적혀 있으면 둘이 같은 칸임을 알아봐야 하고, 합친 뒤 다른 칸에서 계산해 낼 수 있는 칸(중복)은 골라내야 한다. 잘 합치면 이후 분석이 더 정확하고 빨라진다. 반대로 같은 것을 다른 것으로, 다른 것을 같은 것으로 잘못 잇으면 이후 모든 분석이 틀어진다.

</div>


## 예시로 보기

회사가 온라인 몰과 오프라인 매장의 고객 자료를 합친다[^1][^2].

- 온라인 자료의 `Customer_id`와 매장 자료의 `Customer_number`는 이름은 다르지만 같은 것을 가리킨다. 반대로 두 자료의 `price`가 하나는 원, 하나는 달러일 수도 있다.
- 각 칸의 자료형, 이름, 뜻, 값의 범위 같은 "데이터에 대한 데이터"(메타데이터)를 보면 어떤 칸끼리 같은지 알아보기 쉽다.

합치고 나니 `월 매출`과 `연 매출` 칸이 둘 다 있다. 연 매출은 월 매출 × 12로 계산되므로 새 정보가 없다. 이런 칸이 중복이다[^3]. 중복은 저장 공간을 낭비하고, 두 칸이 서로 어긋나게 고쳐지면 어느 값이 맞는지 모르게 된다.

## 정의

**데이터 통합**은 여러 출처의 데이터를 합치는 일이다. 출처마다 뜻과 구조가 달라서(의미적 이질성) 어렵다. 신중하게 합치면 중복과 불일치를 줄일 수 있다[^1].

**개체 식별 문제**는 여러 출처에서 같은 현실 대상을 가리키는 것끼리 맞추는 문제다. 칸 구조를 맞추는 일(스키마 통합)과 같은 대상의 줄을 찾아 잇는 일(객체 매칭)로 이루어진다. 메타데이터가 도움이 된다. 합칠 때 칸 사이의 규칙(한 칸이 다른 칸을 결정하는 관계, 다른 표를 가리키는 칸의 제약)을 깨지 않아야 한다[^2].

**중복과 상관 분석.** 한 속성이 다른 속성(들)에서 "계산되어 나올" 수 있으면 중복일 수 있다. 상관 분석으로 한 속성이 다른 속성을 얼마나 강하게 암시하는지 잰다. 수치 속성은 [피어슨 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/), 명목 속성은 [카이제곱 검정](/Hongs_Blog/studies/data-science/chi-square-correlation/)을 쓴다. 강한 상관은 중복의 신호일 수 있다[^3].

## 연결

- 선수: [카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/), [데이터 정제](/Hongs_Blog/studies/data-science/data-cleaning/)
- 수치 속성의 상관: [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)
- 다음 단계: [정규화](/Hongs_Blog/studies/data-science/normalization/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"상관계수가 1에 가까우면 둘 중 하나를 무조건 지워도 된다"</div>

아니다. 슬라이드도 강한 상관이 중복을 "암시할 수 있다"고만 한다. 키와 몸무게처럼 상관이 높아도 각자 다른 정보를 담는 속성이 있다. 반대로 $$y = x^2$$($$x$$가 −1~1)처럼 한 속성이 다른 속성을 완전히 결정해도 상관계수는 0일 수 있다. 상관은 지울 후보를 고르는 도구이고, 지울지는 뜻(메타데이터)과 함께 판단한다[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 개체 식별 문제는 무엇이고, 어떤 두 일로 이루어지는가? 무엇이 도움이 되는가?</summary>

**답:** 여러 출처에서 같은 현실 대상을 가리키는 것끼리 맞추는 문제다. 칸 구조를 맞추는 스키마 통합과 같은 대상의 줄을 잇는 객체 매칭으로 이루어진다. 자료형, 이름, 뜻, 값의 범위 같은 메타데이터가 도움이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 합친 자료에서 중복을 찾으려 한다. 다음 각 쌍에 어떤 상관 분석을 쓰는가? ① 월 매출과 연 매출 ② 거주 도시와 선호 매장 ③ 나이와 연령대(10대, 20대, …)</summary>

**답:** ① 둘 다 수치라 피어슨 상관계수(1이 나와 중복). ② 둘 다 명목이라 카이제곱 검정. ③ 연령대는 나이에서 계산되므로 뜻만 봐도 중복이다. 순서 속성이라 상관계수보다 정의를 확인하는 편이 확실하다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/02.2-1_data-measure-preprocess.pdf, p.37
[^2]: 같은 자료, p.38
[^3]: 같은 자료, p.39
[^s1]: 에이전트 보충. 오해 항목과 카드 C2의 판단은 원본에 없다. $$y = x^2$$ 예는 [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)의 카드 C2와 같다.
{% endraw %}
