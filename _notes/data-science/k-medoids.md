---
layout: "note"
title: "k-메도이드"
display_title: "k-메도이드 (K-medoids)"
kind: "concept"
kind_label: "알고리즘"
num: "26"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["K-medoids", "k-medoids", "메도이드", "Medoid", "PAM", "Partitioning Around Medoids"]
description: "k-평균과 같은 방식으로 무리를 나누지만, 무리의 대표를 평균 위치가 아니라 무리 안의 실제 자료점 하나로 고른다. 다른 점들까지의 거리 합이 가장 작은 점, 즉 무리 한가운데 있는 실제 점이 대표가 된다. 대표가 실제 고객이나 실제 문서라 해석하기 쉽고, 튀는 점 하나에 끌려가지…"
prev_url: "/studies/data-science/k-means/"
prev_title: "k-평균"
next_url: "/studies/data-science/contrast--kmeans-kmedoids/"
next_title: "k-평균과 k-메도이드 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-science/k-medoids/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

k-평균과 같은 방식으로 무리를 나누지만, 무리의 대표를 평균 위치가 아니라 무리 안의 실제 자료점 하나로 고른다. 다른 점들까지의 거리 합이 가장 작은 점, 즉 무리 한가운데 있는 실제 점이 대표가 된다. 대표가 실제 고객이나 실제 문서라 해석하기 쉽고, 튀는 점 하나에 끌려가지 않는다. 대신 대표를 고를 때 무리 안 모든 점 쌍의 거리를 재야 해서 느리다.

</div>


## 예시로 보기

[k-평균](/Hongs_Blog/studies/data-science/k-means/)에서 점 1, 2, 3, 8, 9, 10, 25의 둘째 중심은 25에 끌려 13이 되었다. 같은 자료를 $$k = 2$$, 처음 대표 1, 2로 k-메도이드에 넣는다. 거리는 두 수의 차이다[^s1].

| 단계 | 대표 | 소속 | 비용(대표까지 거리 합) |
|---|---|---|---|
| 1 | 1, 2 | {1} / {2, 3, 8, 9, 10, 25} | 45 |
| 2 | 1, 8 | {1, 2, 3} / {8, 9, 10, 25} | 23 |
| 3 | 2, 9 | 그대로 | 20 → 멈춤 |

3단계에서 둘째 무리 {8, 9, 10, 25}의 대표를 고른다. 8은 다른 점들까지 거리 합이 $$1 + 2 + 17 = 20$$, 9는 $$1 + 1 + 16 = 18$$이다. 9가 대표가 된다. 25가 아무리 멀어도 대표는 실제 점 중에서 고르므로 8~10 근처를 벗어나지 않는다. 중앙값이 평균보다 이상치에 덜 흔들리는 것과 같은 이유다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/data-science/26_k-medoids_fig1.svg" alt="그림" width="612" height="276" loading="lazy">

왼쪽은 같은 점 일곱 개에서 k-평균의 중심(2, 13)과 k-메도이드의 대표(2, 9)다. 오른쪽은 둘째 무리 {8, 9, 10, 튀는 점}에서 튀는 점을 10부터 60까지 멀리 보낸 결과다. 평균은 따라서 계속 커지고, 메도이드는 9에 머문다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적, 편집 거리로 단어 묶기, 무작위 200회에서 비용 단조 감소(맨해튼 거리), 거리 계산 횟수 — [26_k-medoids_impl.py](/Hongs_Blog/studies/data-science/code/26_k-medoids_impl/)</div>

</div>


## 정의

k-메도이드는 각 군집을 실제 자료점 하나(메도이드)로 대표하는 중심 기반 군집화다. 메도이드는 군집에서 가장 대표적인 실제 대상이라, 대표 고객 프로필, 대표 문서, 대표 사진처럼 해석하기 쉽다[^1].

목적 함수는 점과 그 메도이드 사이의 비유사도 합이다[^1].

$$\min \sum_{\alpha=1}^{k}\sum_{\mathbf x_i \in C_\alpha} \operatorname{dist}(\mathbf x_i, \mathbf m_\alpha)$$


$$C_\alpha$$는 군집 $$\alpha$$에 속한 점들, $$\mathbf m_\alpha \in C_\alpha$$는 그 메도이드다.

**알고리즘(PAM, 메도이드 둘레로 나누기)**[^2]:

```
k개 점을 무작위로 골라 메도이드로 정한다
반복:
    각 점을 가장 가까운 메도이드의 군집에 넣는다
    각 군집에서 같은 군집 다른 점들까지 거리 합이 가장 작은 점을 새 메도이드로 고른다
메도이드가 바뀌지 않으면 멈춘다
```

슬라이드는 "결정적 한계는?"이라고 묻는다[^2]. 답은 계산량이다. 메도이드를 고를 때 군집 안 점 $$m$$개마다 다른 점 $$m$$개까지 거리를 재므로 $$m^2$$번이 든다. 점 100개짜리 군집 하나에 1만 번이다. k-평균은 평균 한 번으로 끝난다[^3][^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 7-1 슬라이드 p.16 표의 "Distance requirement" 줄에 k-means와 k-medoids 모두 "Euclidean distance" / 문제점: k-메도이드는 점들 사이의 거리만 쓰고 평균을 내지 않으므로, 맨해튼 거리나 편집 거리 같은 아무 비유사도로도 돌아간다. 이것이 k-평균과 다른 장점이다. k-평균은 평균이 거리 제곱 합을 최소화한다는 성질 때문에 (제곱) 유클리드 거리에 묶인다 / 수정안: k-medoids의 칸을 "임의의 비유사도"로 / 근거: 26_k-medoids_impl.py에서 편집 거리로 단어를 묶었다

</div>


## 활용

- 수치가 아닌 자료(문자열, 범주형 속성, 그래프 위의 점)를 군집화할 때 쓴다. [범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/)를 그대로 넣을 수 있다.
- 단어 "data, date, dated, mining, minning, dining"을 편집 거리로 두 무리로 나누면 메도이드는 "date"와 "mining"이다[^s1].

## 연결

- 선수: [k-평균](/Hongs_Blog/studies/data-science/k-means/)
- 평균 대 중앙값의 견고성: [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)
- 비교: [k-평균과 k-메도이드 비교](/Hongs_Blog/studies/data-science/contrast--kmeans-kmedoids/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 메도이드의 정의와 k-메도이드의 목적 함수를 쓰라.</summary>

**답:** 메도이드는 군집 안의 실제 자료점 중 같은 군집 다른 점들까지의 비유사도 합이 가장 작은 점이다. 목적 함수는 $$\sum_\alpha\sum_{\mathbf x \in C_\alpha}\operatorname{dist}(\mathbf x, \mathbf m_\alpha)$$의 최소화다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 군집 {8, 9, 10, 25}의 메도이드와 평균을 각각 구하라(거리는 차이의 절댓값).</summary>

**답:** 거리 합은 8: 20, 9: 18, 10: 18, 25: 48. 가장 작은 9(같으면 먼저 나온 점)가 메도이드다. 평균은 13이다. 이상치 25가 평균은 크게 끌지만 메도이드는 거의 끌지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** k-메도이드가 k-평균과 달리 편집 거리 같은 비유사도로도 돌아가는 이유는?</summary>

**답:** k-메도이드는 점들 사이의 거리만 계산하고 새 대표도 실제 점 중에서 고른다. k-평균은 갱신 단계에서 점들의 평균을 내야 하는데, 문자열의 "평균"은 정의되지 않고, 평균이 최적이라는 성질도 거리 제곱 합(유클리드)일 때만 맞다.

</details>


[^1]: 데이터 과학 7회 강의 자료 「7-1_basic-clustering」, p.14
[^2]: 같은 자료, p.15
[^3]: 같은 자료, p.16
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 1차원 추적, 거리 계산 횟수, 단어 예, 카드 C2·C3은 원본에 없다. 구현 코드로 확인했다. 원래 PAM(Kaufman & Rousseeuw, 1990)은 메도이드와 다른 점을 맞바꾸는 방식이고, 슬라이드의 갱신은 군집마다 메도이드를 다시 고르는 간단한 방식이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [26_k-medoids_plot.py](/Hongs_Blog/studies/data-science/code/26_k-medoids_plot/)로 그렸고, k-평균의 중심 2, 13과 메도이드 2, 9, 튀는 점이 10~60일 때 메도이드가 늘 9인 것을 같은 코드로 확인했다. 10도 다른 점들까지 거리 합이 $$2 + 1 + 15 = 18$$로 9와 같다. 거리 합이 같으면 앞에 있는 9를 고른다.
{% endraw %}
