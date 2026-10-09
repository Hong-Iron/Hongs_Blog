---
layout: "note"
title: "표본 추출"
display_title: "표본 추출 (Sampling)"
kind: "concept"
kind_label: "기법"
num: "09"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Sampling", "데이터 샘플링", "데이터 축소", "Data Reduction", "비복원 추출", "Sampling without Replacement", "복원 추출", "Sampling with Replacement", "층화 추출", "Stratified Sampling", "층", "Stratum"]
description: "데이터가 너무 커서 다 분석할 수 없을 때, 전체를 잘 대표하는 일부만 뽑아 쓰는 방법이다. 뽑은 것을 다시 넣지 않고 뽑을 수도, 다시 넣고 뽑을 수도 있고, 무리를 나눠 무리마다 뽑을 수도 있다. 작은 표본으로 빠르게 분석할 수 있지만, 뽑는 방법이 나쁘면 드문 무리를 통째로 …"
prev_url: "/studies/data-science/discretization/"
prev_title: "이산화"
next_url: "/studies/data-science/frequent-patterns/"
next_title: "빈발 패턴"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/sampling/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터가 너무 커서 다 분석할 수 없을 때, 전체를 잘 대표하는 일부만 뽑아 쓰는 방법이다. 뽑은 것을 다시 넣지 않고 뽑을 수도, 다시 넣고 뽑을 수도 있고, 무리를 나눠 무리마다 뽑을 수도 있다. 작은 표본으로 빠르게 분석할 수 있지만, 뽑는 방법이 나쁘면 드문 무리를 통째로 놓쳐 전체와 다른 결론이 나온다.

</div>


## 예시로 보기

고객 1,000명 중 VIP가 10명(1%)이다. 20명만 무작위로 뽑아 설문하면 VIP가 한 명도 안 뽑힐 확률이 약 $$0.99^{20} \approx 0.82$$다[^s1]. 열 번에 여덟 번은 VIP 의견 없이 결론을 내는 셈이다.

등급을 먼저 나눠(VIP 10명, 일반 990명) 각 등급에서 같은 비율로 뽑으면 이 문제가 없다. 100명을 뽑는다면 VIP에서 1명, 일반에서 99명을 뽑는다. 이렇게 나눈 무리 하나하나를 층이라 부르고, 층마다 뽑는 방법을 층화 추출이라 부른다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 복원 추출 100번에서 서로 다른 자료 평균 63.4개, 층화 표본의 비율 보존, VIP를 놓칠 확률 0.818 — [09_sampling_verify.py](/Hongs_Blog/studies/data-science/code/09_sampling_verify/)</div>

</div>


## 정의

표본 추출은 대표성 있는 소수의 자료만 뽑아 데이터 크기를 줄인다. 데이터가 너무 클 때 쓸모 있다[^1].

| 방법 | 하는 일 | 특징 |
|---|---|---|
| 비복원 추출 | 데이터 $$D$$에서 뽑은 것을 다시 넣지 않는다 | 같은 자료가 두 번 뽑히지 않는다 |
| 복원 추출 | 뽑은 것을 다시 $$D$$에 넣고 또 뽑는다 | 같은 자료가 여러 번 뽑힐 수 있다 |
| 층화 추출 | $$D$$를 겹치지 않는 부분(층)으로 나누고 층마다 뽑는다 | 층의 비율이 표본에 그대로 남는다 |

복원 추출로 $$n$$개에서 $$n$$개를 뽑으면, 어떤 자료가 한 번도 안 뽑힐 확률은 $$(1 - \frac1n)^n$$이다. $$n = 100$$이면 약 0.366이라, 서로 다른 자료는 평균 약 63.4개만 들어간다[^s1].

## 활용

- 복원 추출은 6회 앙상블의 배깅이 훈련 자료를 여러 벌 만들 때 쓴다[^s1].
- 층화 추출은 분류 모델을 평가할 때 훈련·시험 자료의 정답 비율을 맞추는 데 쓴다. 사이킷런 `train_test_split(..., stratify=y)`가 이것이다[^s1].

## 연결

- 표본으로 전체를 짐작할 때의 오차: [표본분포와 추정량](/Hongs_Blog/studies/probability-statistics/estimators/)
- 같은 데이터 변환 단계: [정규화](/Hongs_Blog/studies/data-science/normalization/), [이산화](/Hongs_Blog/studies/data-science/discretization/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음에 알맞은 추출 방법은? ① 1억 건의 로그에서 분석용으로 10만 건을 겹치지 않게 뽑는다 ② 같은 자료로 서로 조금씩 다른 훈련 자료 여러 벌을 만든다 ③ 사기 거래가 0.1%뿐인 자료에서 시험 자료를 뽑는다</summary>

**답:** ① 비복원 추출 ② 복원 추출(중복이 생겨 벌마다 조금씩 달라진다) ③ 층화 추출. 단순 추출이면 시험 자료에 사기 거래가 거의 없거나 아예 없을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 고객 1,000명 중 VIP가 10명이다. 20명을 단순 무작위로 뽑으면 VIP가 빠질 확률은 대략 얼마이고, 층화 추출은 이 문제를 어떻게 막는가?</summary>

**답:** 한 명이 VIP가 아닐 확률이 0.99라 약 $$0.99^{20} \approx 0.82$$다. 층화 추출은 VIP 층과 일반 층에서 따로 뽑으므로 VIP가 반드시 비율만큼 들어간다[^s1].

</details>


[^1]: 데이터 과학 2회 강의 자료 「2-1_data-measure-preprocess」, p.44
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> VIP 예와 놓칠 확률(비복원이라 정확히는 약 0.817), 복원 추출에서 빠지는 비율, 배깅과 사이킷런의 쓰임, 카드는 원본에 없다. 수치는 검증 코드로 확인했다.
{% endraw %}
