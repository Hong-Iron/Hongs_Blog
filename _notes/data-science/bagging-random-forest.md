---
layout: "note"
title: "배깅과 랜덤 포레스트"
display_title: "배깅과 랜덤 포레스트 (Bagging and Random Forest)"
kind: "concept"
kind_label: "알고리즘"
num: "21"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Bagging", "Bootstrap Aggregating", "부트스트랩 집계", "부트스트랩", "Bootstrap", "랜덤 포레스트", "Random Forest", "속성 뽑기", "Feature Subsampling", "다수결 투표", "Majority Voting", "OOB", "Out-of-Bag"]
description: "같은 훈련 자료에서 복원 추출로 조금씩 다른 자료 여러 벌을 만들고, 벌마다 모델을 따로 훈련해 예측을 투표나 평균으로 모은다. 자료가 조금씩 달라 모델들도 조금씩 달라지고, 그 차이가 평균으로 상쇄되어 흔들림(분산)이 준다. 랜덤 포레스트는 결정 트리로 배깅을 하면서 나무마다 쓸…"
prev_url: "/studies/data-science/ensemble-learning/"
prev_title: "앙상블 학습"
next_url: "/studies/data-science/boosting-adaboost/"
next_title: "부스팅과 AdaBoost"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-science/bagging-random-forest/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 훈련 자료에서 복원 추출로 조금씩 다른 자료 여러 벌을 만들고, 벌마다 모델을 따로 훈련해 예측을 투표나 평균으로 모은다. 자료가 조금씩 달라 모델들도 조금씩 달라지고, 그 차이가 평균으로 상쇄되어 흔들림(분산)이 준다. 랜덤 포레스트는 결정 트리로 배깅을 하면서 나무마다 쓸 속성까지 무작위로 골라, 나무들을 더 서로 다르게 만든다. 다만 모델들이 공통으로 틀리는 부분(편향)은 줄지 않는다.

</div>


## 예시로 보기

[앙상블](/Hongs_Blog/studies/data-science/ensemble-learning/)은 모델들이 서로 다를수록 효과가 크다. 그런데 자료가 한 벌뿐이면 어떻게 서로 다른 모델을 만들까[^1]?

자료 40개에서 복원 추출로 40개를 뽑아 한 벌을 만든다. 어떤 자료는 두세 번, 어떤 자료는 한 번도 안 뽑힌다. 한 벌에는 서로 다른 원래 자료가 평균 약 63.7%만 들어 있다. 이렇게 50벌을 만들어 벌마다 "가장 가까운 이웃 하나의 값을 그대로 답하는" 모델(분산이 큰 모델)을 만들고 예측을 평균 냈다[^s1].

| | 모델 하나 | 배깅 (50개 평균) |
|---|---|---|
| 예측의 분산 | 0.089 | 0.043 |
| 편향² | 0.0003 | 0.0004 |

분산은 절반으로 줄고 편향은 그대로다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/data-science/21_bagging-random-forest_fig1.svg" alt="그림" loading="lazy">

같은 참 함수(굵은 회색)에서 훈련 자료를 다섯 번 새로 뽑아 모델을 만들었다. 왼쪽 1-NN 예측은 자료마다 들쭉날쭉 크게 다르다. 오른쪽 배깅 예측은 다섯 선이 서로 더 가깝게 붙는다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 부트스트랩 표본 속 서로 다른 자료 63.6%(이론 63.7%), 위 표, 속성 조합 수 — [21_bagging_impl.py](/Hongs_Blog/studies/data-science/code/21_bagging_impl/)</div>

</div>


## 정의

**배깅**(Bootstrap Aggregating)은 부트스트랩 표본으로 여러 모델을 훈련한다[^1].

```
배깅(훈련 자료 D, 모델 수 k):
    for i = 1..k:
        D_i ← D에서 복원 추출로 |D|개를 뽑은 부트스트랩 표본
        M_i ← D_i로 훈련한 모델
    새 점 x의 예측: 분류면 M_1(x), ..., M_k(x)의 다수결, 회귀면 평균
```

복원 추출이 자료 벌들을 서로 다르게 만든다. 각 모델의 편향과 분산은 비슷하고, 모아서 분산이 준다[^1].

**랜덤 포레스트**는 분산이 큰 결정 트리에 쓰는 배깅이다[^2].

1. **자료 뽑기:** 훈련 자료에서 복원 추출로 훈련 자료 $$k$$벌을 만든다.
2. **속성 뽑기:** 나무마다(보통은 마디마다) 속성 $$n$$개 중 $$m$$개만 무작위로 골라 쓴다.
3. **다수결:** 나무들의 예측을 투표로 모은다.

속성 뽑기는 나무들 사이의 상관을 낮춘다. 아주 강한 속성 하나가 있으면 모든 나무가 맨 위에서 그 속성으로 갈라 비슷해지는데, 그 속성을 못 쓰는 나무가 생기기 때문이다. [앙상블의 분산 공식](/Hongs_Blog/studies/data-science/ensemble-learning/)에서 $$\rho$$가 줄면 분산이 준다[^2][^s1].

### 복잡도

모델 $$k$$개를 따로 훈련하므로 훈련 시간은 모델 하나의 약 $$k$$배다. 모델끼리 기다릴 필요가 없어 동시에(병렬로) 훈련할 수 있다[^s1].

## 활용

- 사이킷런의 `BaggingClassifier`, `RandomForestClassifier`(`max_features`가 $$m$$)가 이 방법이다[^s1].
- 한 번도 안 뽑힌 자료(OOB, 약 36.8%)로 그 모델을 평가하면 따로 시험 집합을 떼지 않아도 된다[^s1].
- 편향이 큰 모델(아주 얕은 나무, 직선 모델)에는 효과가 작다. 줄일 분산이 적기 때문이다.

## 연결

- 선수: [앙상블 학습](/Hongs_Blog/studies/data-science/ensemble-learning/), [표본 추출](/Hongs_Blog/studies/data-science/sampling/)(복원 추출)
- 차례로 실수를 고치는 다른 앙상블: [부스팅과 AdaBoost](/Hongs_Blog/studies/data-science/boosting-adaboost/)
- 비교: [배깅과 부스팅 비교](/Hongs_Blog/studies/data-science/contrast--bagging-boosting/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 배깅의 세 단계를 쓰고, 랜덤 포레스트가 배깅에 더하는 것을 말하라.</summary>

**답:** ① 복원 추출로 부트스트랩 표본 여러 벌을 만든다 ② 벌마다 모델을 훈련한다 ③ 투표나 평균으로 모은다. 랜덤 포레스트는 결정 트리를 쓰고, 나무마다 속성 $$n$$개 중 $$m$$개만 무작위로 골라 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 랜덤 포레스트에서 속성을 무작위로 고르면 각 나무는 조금 약해지는데, 숲 전체는 오히려 좋아질 수 있는 이유를 앙상블의 분산 공식으로 설명하라.</summary>

**답:** 분산 $$\frac{\sigma^2}{k} + \frac{k-1}{k}\rho\sigma^2$$에서 $$k$$가 크면 $$\rho\sigma^2$$가 남는다. 속성을 무작위로 고르면 나무들이 같은 강한 속성에 의존하지 않아 $$\rho$$가 준다. 나무 하나의 $$\sigma^2$$가 조금 늘어도 $$\rho$$가 충분히 줄면 전체 분산이 준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 <code>D_i ← D에서 복원 추출로 &#124;D&#124;개를 뽑은 부트스트랩 표본</code> 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 원래 자료와 크기는 같지만 일부가 겹치고 일부가 빠진, 조금씩 다른 훈련 자료를 만들어 모델들이 서로 달라지게 한다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/06.6-2_ensemble.pdf, p.15
[^2]: 같은 자료, p.16
[^s1]: 에이전트 보충. 실험 수치, 속성 뽑기가 상관을 낮추는 이유, 마디마다 뽑는 보통의 구현(Breiman, "Random Forests", Machine Learning 2001), 복잡도, 사이킷런, OOB 평가, 카드는 원본에 없다. 검증 코드로 실험했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [21_bagging-random-forest_plot.py](/Hongs_Blog/studies/data-science/code/21_bagging-random-forest_plot/)로 그렸다. 같은 코드에서 다른 난수로 150회 다시 실험해 예측 분산 0.090 → 0.046, 편향² 0.0002 그대로를 확인했다(위 표와 같은 경향).
{% endraw %}
