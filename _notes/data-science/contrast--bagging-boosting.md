---
layout: "note"
title: "배깅과 부스팅 비교"
display_title: "배깅과 부스팅 비교"
kind: "concept"
kind_label: "비교"
num: "23"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Bagging vs Boosting", "배깅 대 부스팅"]
description: "둘 다 여러 모델을 합친다. 가르는 질문은 \"모델들이 서로를 보면서 만들어지는가\"다. 배깅은 서로 모른 채 따로 만들어 흔들림(분산)을 상쇄하고, 부스팅은 앞 모델의 실수를 보고 차례로 만들어 체계적인 실수(편향)를 고친다."
prev_url: "/studies/data-science/boosting-adaboost/"
prev_title: "부스팅과 AdaBoost"
next_url: "/studies/data-science/cluster-analysis/"
next_title: "군집 분석"
math: false
mermaid: false
code_count: 0
permalink: "/studies/data-science/contrast--bagging-boosting/"
---
{% raw %}
둘 다 여러 모델을 합친다. 가르는 질문은 "모델들이 서로를 보면서 만들어지는가"다. 배깅은 서로 모른 채 따로 만들어 흔들림(분산)을 상쇄하고, 부스팅은 앞 모델의 실수를 보고 차례로 만들어 체계적인 실수(편향)를 고친다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 깊게 자란 결정 트리가 훈련 자료에 너무 잘 맞아, 자료가 조금만 바뀌어도 예측이 크게 달라진다. (b) 깊이 1짜리 나무(그루터기)는 너무 단순해 훈련 자료조차 잘 못 맞힌다. 각각 배깅과 부스팅 중 무엇이 알맞은가?</summary>

**답:** (a) 배깅(랜덤 포레스트). 분산이 큰 모델이라 평균 내면 흔들림이 크게 준다. (b) 부스팅. 편향이 큰 약한 모델을 차례로 더해 틀린 곳을 고쳐 간다. 그루터기를 배깅하면 모두 비슷하게 틀려 이득이 거의 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 정답 표시 중 10%쯤이 잘못 붙어 있다. (d) 계산기 여러 대에서 동시에 훈련해 빨리 끝내야 한다. 무엇이 알맞은가?</summary>

**답:** (c) 배깅. 부스팅은 잘못 붙은 점을 "어려운 예제"로 보고 가중치를 계속 키워 잡음에 매달린다. (d) 배깅. 모델들이 서로 기다리지 않아 병렬로 훈련할 수 있다. 부스팅은 앞 모델이 끝나야 다음 모델을 만든다.

</details>


## 결정적 차이

| | 배깅 | 부스팅 |
|---|---|---|
| 훈련 | 따로따로(독립) | 차례로(앞 모델에 기댐) |
| 자료 만드는 법 | 부트스트랩(복원 추출) | 같은 자료에 가중치를 바꿔 가며 |
| 주로 줄이는 것 | 분산 | 편향(과 분산) |
| 잡음에 대한 견고함 | 높다 | 잡음에 민감하다 |
| 알맞은 기본 모델 | 분산이 큰 모델(깊은 나무) | 약한 모델(그루터기) |
| 모으는 법 | 똑같은 무게로 투표·평균 | 잘 맞힌 모델에 큰 무게 |

표는 슬라이드 비교표를 옮기고 마지막 줄을 더한 것이다[^1][^s1]. 슬라이드 p.17은 부스팅이 "분산 감소가 아니라 편향 감소에 초점"이라 하고, p.19 표는 "편향과 분산을 줄인다"고 적는다[^2]. 두 말은 함께 맞다. 부스팅의 목표는 편향 감소이고, 여러 모델의 가중 결합이라 분산도 어느 정도 준다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 배깅이 분산을 줄이고 편향은 그대로(21_bagging_impl.py), 부스팅이 약한 그루터기 셋으로 훈련 오류를 0으로(22_adaboost_impl.py) — [21_bagging_impl.py](/Hongs_Blog/studies/data-science/code/21_bagging_impl/), [22_adaboost_impl.py](/Hongs_Blog/studies/data-science/code/22_adaboost_impl/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 배깅도 부스팅도 도움이 안 되는 경우와 그때의 선택지를 쓰라.</summary>

**답:** ① 오차의 대부분이 줄일 수 없는 잡음일 때. 어떤 앙상블도 잡음은 못 줄인다. 자료의 질(측정, 정답 표시)을 고쳐야 한다. ② 모델 하나로 이미 편향과 분산이 모두 작을 때. 앙상블은 계산과 해석의 비용만 늘린다. 서로 다른 종류의 모델을 합치는 스태킹은 또 다른 선택지다[^s1].

</details>


[^1]: 데이터 과학 6회 강의 자료 「6-2_ensemble」, p.19
[^2]: 같은 자료, p.17
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 상황 문제, "모으는 법" 줄, 두 슬라이드 표현의 해석, 스태킹은 원본에 없다.
{% endraw %}
