---
layout: "note"
title: "속성의 종류"
display_title: "속성의 종류 (Attribute Types)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Attribute Types", "데이터 객체", "Data Object", "속성", "Attribute", "특징", "Feature", "명목 속성", "Nominal", "범주형", "Categorical", "이진 속성", "Binary", "대칭 이진", "비대칭 이진", "순서 속성", "Ordinal", "수치 속성", "Numeric", "구간 척도", "Interval-scaled", "비율 척도", "Ratio-scaled"]
description: "데이터의 한 줄(고객 한 명, 상품 하나)을 설명하는 칸 하나하나가 속성이다. 칸에 든 값으로 할 수 있는 계산은 속성의 종류마다 다르다. 이름표 같은 값은 같은지 다른지만 따질 수 있고, 순서가 있는 값은 크고 작음까지, 진짜 0이 있는 수만 \"두 배\"를 말할 수 있다. 종류를 …"
next_url: "/studies/data-science/chi-square-correlation/"
next_title: "카이제곱 상관 분석"
math: false
mermaid: false
code_count: 0
permalink: "/studies/data-science/attribute-types/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터의 한 줄(고객 한 명, 상품 하나)을 설명하는 칸 하나하나가 속성이다. 칸에 든 값으로 할 수 있는 계산은 속성의 종류마다 다르다. 이름표 같은 값은 같은지 다른지만 따질 수 있고, 순서가 있는 값은 크고 작음까지, 진짜 0이 있는 수만 "두 배"를 말할 수 있다. 종류를 잘못 잡으면 "머리색 평균 1.5" 같은 뜻 없는 계산을 하게 된다.

</div>


## 예시로 보기

고객 표를 보자[^1].

| Customer_id | Name | Age | Gender | 만족도 | 근속 연수 |
|---|---|---|---|---|---|
| 101 | Smith | 25 | Male | 만족(4) | 2 |
| 102 | Kim | 32 | Female | 보통(3) | 6 |

한 줄(고객 한 명)을 데이터 객체라 부른다. 표본, 사례, 데이터 점이라고도 한다. 칸 하나(Age, Gender…)가 속성이다. 차원, 특징, 변수라고도 한다[^1].

이 칸들로 할 수 있는 계산이 다르다.

- Gender: 같은지 다른지만 따진다. Male을 1, Female을 0으로 적어도 "평균 0.5"는 뜻이 없다.
- 만족도: 4가 3보다 낫다는 순서는 있다. 하지만 4와 3의 차이가 3과 2의 차이와 같은 크기라고 말할 수 없다. 사람의 느낌을 순서로 적은 것이기 때문이다[^2].
- 섭씨 기온: 20 °C와 10 °C의 차이(10도)는 잴 수 있다. 그런데 "20 °C가 10 °C보다 두 배 따뜻하다"고 할 수 있을까? 없다. 0 °C가 "온도가 없음"이 아니기 때문이다[^3].
- 근속 연수, 켈빈 온도: 0이 정말 "없음"이다. 6년은 2년의 세 배다[^4].

## 정의

| 종류 | 무엇인가 | 할 수 있는 비교 | 예 |
|---|---|---|---|
| 명목 (범주형) | 사물의 이름. 숫자로 적어도 숫자 계산은 뜻이 없다 | 같다/다르다 | 머리색, 직업[^5] |
| 이진 | 상태가 둘(0: 없음, 1: 있음)인 명목 속성. 참·거짓이면 불(Boolean) 속성 | 같다/다르다 | 흡연 여부, 검사 결과[^6] |
| 순서 | 값 사이에 뜻 있는 순서가 있다. 간격의 크기는 모른다 | + 크다/작다 | 음료 크기, 만족도 1~5[^2] |
| 수치: 구간 척도 | 같은 크기의 단위로 잰다. 진짜 0점이 없다 | + 차이 | 섭씨 기온, 날짜[^3] |
| 수치: 비율 척도 | 진짜 0점이 있다 | + 비율(몇 배), 평균·중앙값·최빈값 | 켈빈 온도, 근속 연수, 단어 수[^4] |

아래 칸으로 갈수록 위 칸의 비교를 모두 할 수 있고 하나씩 더할 수 있다.

이진 속성은 두 상태가 같은 무게인지에 따라 다시 나뉜다[^6].

- **대칭 이진:** 두 상태가 똑같이 중요하다. 예: 성별.
- **비대칭 이진:** 한 상태가 더 중요하다. 예: 의료 검사의 양성(1)은 음성(0)보다 드물고 의미가 크다. 이 차이가 [비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/)를 계산하는 방법을 바꾼다.

## 연결

- 속성 종류에 따라 비슷함을 재는 법: [범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/)(명목·이진), [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)(수치)
- 속성 종류에 따라 관련성을 재는 법: [카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/)(명목), [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)(수치)
- 수치 속성의 요약: [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"숫자로 적혀 있으면 수치 속성이다"</div>

아니다. 우편번호, 학번, 머리색을 0, 1, 2로 바꾼 값은 숫자 모양이지만 이름표다. 숫자처럼 보여서 평균을 내고 싶어지지만, 우편번호 평균은 어떤 지역도 가리키지 않는다. 확인하는 법: "두 값의 차이나 비율이 현실에서 뜻이 있는가?"를 묻는다. 없으면 명목이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 명목, 이진, 순서, 구간 척도, 비율 척도 속성을 할 수 있는 비교로 구별해 쓰라.</summary>

**답:** 명목·이진은 같다/다르다만, 순서는 크고 작음까지, 구간 척도는 차이까지, 비율 척도는 몇 배인지까지 말할 수 있다. 구간과 비율을 가르는 것은 진짜 0점이 있느냐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 종류를 고르라. ① 섭씨 기온 ② 켈빈 기온 ③ 별점 1~5 ④ 혈액형 ⑤ 코로나 검사 결과(양성/음성) ⑥ 한 달 접속 횟수</summary>

**답:** ① 구간 척도 ② 비율 척도 ③ 순서 ④ 명목 ⑤ 비대칭 이진 ⑥ 비율 척도.<br>
**흔한 오답:** ③을 수치로 보는 것. 별점 4와 5의 차이가 1과 2의 차이와 같은 크기라는 보장이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 섭씨 20 °C가 10 °C의 "두 배 따뜻하다"고 말할 수 없는 이유는? 켈빈으로는 어떤가?</summary>

**답:** 섭씨의 0 °C는 물이 어는 점일 뿐 "열이 없음"이 아니라서 비율이 뜻이 없다. 같은 두 기온을 화씨로 바꾸면 50 °F와 68 °F로 비율이 1.36배가 되어 단위마다 비율이 달라진다. 켈빈은 0 K가 진짜 0이라 비율을 말할 수 있다(283.15 K와 293.15 K는 약 1.04배)[^s1].

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/02.2-1_data-measure-preprocess.pdf, p.4~5
[^2]: 같은 자료, p.8
[^3]: 같은 자료, p.9
[^4]: 같은 자료, p.10
[^5]: 같은 자료, p.6
[^6]: 같은 자료, p.7
[^s1]: 에이전트 보충. 화씨와 켈빈으로 바꾼 비율, 오해 항목, 카드 C2의 예는 원본에 없다. 10 °C = 50 °F = 283.15 K, 20 °C = 68 °F = 293.15 K다.
{% endraw %}
