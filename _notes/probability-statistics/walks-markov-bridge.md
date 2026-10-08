---
layout: "note"
title: "인접행렬 거듭제곱 ↔ 마르코프 전이"
display_title: "인접행렬 거듭제곱 ↔ 마르코프 전이: 길을 모두 더하는 행렬 곱"
kind: "concept"
kind_label: "브리지"
num: "24"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Walks and Markov Chains", "보행 수와 전이 확률", "무작위 보행", "random walk on a graph", "그래프 위의 무작위 보행", "인접행렬 거듭제곱"]
description: "표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다. 특히 \"행렬 곱의 한 성분을 계산할 때 더하는 항 하나하나가 무엇을 뜻하는가\"를 두 쪽에서 각각 말해 본다."
prev_url: "/studies/probability-statistics/markov-chains/"
prev_title: "마르코프 연쇄"
next_url: "/studies/probability-statistics/pagerank/"
next_title: "PageRank"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/walks-markov-bridge/"
---
{% raw %}
## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다. 특히 "행렬 곱의 한 성분을 계산할 때 더하는 항 하나하나가 무엇을 뜻하는가"를 두 쪽에서 각각 말해 본다.

| 이산수학: 그래프의 보행 수 | 확률과 통계: 마르코프 연쇄의 전이 |
|---|---|
| 정점 $$i, j$$ 사이에 간선이 있으면 $$A_{ij} = 1$$ | 상태 $$i$$에서 $$j$$로 옮길 확률 $$P_{ij}$$ |
| $$(A^2)_{ij} = \sum_k A_{ik}A_{kj}$$ | $$(P^2)_{ij} = \sum_k P_{ik}P_{kj}$$ |
| $$(A^k)_{ij}$$ = 길이 $$k$$인 보행의 수 | $$(P^k)_{ij}$$ = $$k$$단계 뒤 $$j$$에 있을 확률 |
| 정점의 차수 $$\deg(i)$$ | ? |

<details class="callout callout-info" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 그래프 | 마르코프 연쇄 | 공통 구조 |
|---|---|---|
| 인접행렬 $$A$$ | 전이행렬 $$P$$ | 한 걸음의 "무게" 표 |
| 간선 있음(1)/없음(0) | 옮길 확률 | 한 걸음의 무게 |
| 경유 정점 $$k$$에 대한 합 | 중간 상태에 대한 합(전확률 공식) | 행렬 곱 = 가능한 모든 중간 지점에 대한 합 |
| 한 보행의 무게 = 1 | 한 경로의 확률 = 걸음 확률의 곱 | 경로의 무게 = 걸음 무게의 곱 |
| $$(A^k)_{ij}$$ = 보행 수 | $$(P^k)_{ij}$$ = 경로 확률의 합 | 길이 $$k$$인 모든 경로의 무게 합 |
| 무작위 보행: 이웃 중 하나를 고르게 선택 | $$P = D^{-1}A$$ ($$D$$는 차수 대각행렬) | 행마다 차수로 나눠 합을 1로 |
| 차수 $$\deg(i)$$ | 정상분포 $$\pi_i = \frac{\deg(i)}{2m}$$ | 연결이 많은 곳에 오래 머문다 |

</details>


## 어디까지 같은가

- **같은 것:** 두 성분 모두 "길이 $$k$$인 모든 경로에 대해, 걸음 무게의 곱을 더한 것"이다. 행렬 곱이 중간 지점에 대한 합이라서 생기는 구조로, 무게가 0/1이면 경로를 세고 확률이면 경로 확률을 더한다[^1].
- **다른 것 ① 크기:** $$A^k$$의 성분은 보행 수가 늘면서 가장 큰 고윳값의 $$k$$제곱 속도로 커진다. $$P^k$$는 행의 합이 늘 1이라 커지지 않고, 가장 큰 고윳값이 1이다.
- **다른 것 ② 방향:** 무방향 그래프의 $$A$$는 대칭이지만, $$P = D^{-1}A$$는 차수가 다르면 대칭이 아니다.
- **같이 깨지는 곳:** 그래프가 [이분 그래프](/Hongs_Blog/studies/discrete-math/bipartite-coloring/)이면 $$A$$에 고윳값 $$-\lambda_{\max}$$가 있고, 무작위 보행은 두 편을 번갈아 오가는 주기 2의 연쇄라 분포가 수렴하지 않는다. 홀수 사이클이 하나라도 있으면(이분이 아니면) 연결된 그래프의 무작위 보행은 수렴한다.

## 이 연결로 얻는 것

- **정상분포가 공짜로 나온다.** 연결된 무방향 그래프의 무작위 보행은 $$\pi_i = \frac{\deg(i)}{2m}$$이다. $$\sum_i\deg(i) = 2m$$(악수 정리)이 정규화 상수다. 고윳값 문제를 풀 필요 없이 차수만 세면 된다[^2].
- **보행 수를 고윳값으로 센다.** $$A = Q\Lambda Q^\top$$($$^\top$$는 행과 열을 바꾸는 전치)로 [대각화](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)하면 $$(A^k)_{ij} = \sum_\ell\lambda_\ell^k q_{i\ell}q_{j\ell}$$이라, 긴 보행의 수는 가장 큰 고윳값이 지배한다.
- **주기성을 그래프로 판정한다.** 연쇄가 수렴하는지를 "그래프에 홀수 사이클이 있는가"로 확인할 수 있다.
- 알고리즘에서: 걸음 무게를 곱하는 대신 더하고 경로 중 가장 작은 것을 고르도록 연산을 바꾸면 성분이 최단 거리가 되고, [플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/)은 이 틀에서 걸음 수 대신 거쳐도 되는 점을 하나씩 늘려 표를 채운다. 상태 그래프의 보행 수는 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/) 표 dp[k][상태]를 한 줄씩 채워도 센다. 한 줄을 채우는 일이 인접행렬을 한 번 곱하는 일이다.

## 전이 문제

길이 $$k$$인 이진 문자열 중 "11"이 들어 있지 않은 것의 수를, 상태 두 개("마지막이 0이거나 시작", "마지막이 1")짜리 그래프의 보행 수로 바꿔 구하라. 이 수는 어떤 수열인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

상태 0(마지막 0 또는 시작)에서는 0을 붙여 상태 0으로, 1을 붙여 상태 1로 간다. 상태 1에서는 0만 붙일 수 있어 상태 0으로 간다. 인접행렬 $$T = \begin{pmatrix}1 & 1\\ 1 & 0\end{pmatrix}$$이고, 길이 $$k$$인 문자열 수는 상태 0에서 출발한 길이 $$k$$ 보행의 수 $$(T^k)_{00} + (T^k)_{01}$$이다. $$k = 1, 2, 3, \dots$$에서 $$2, 3, 5, 8, \dots$$로 피보나치 수 $$F_{k+2}$$다. [선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)과 같은 행렬이 나온다. 유한 오토마타가 받아들이는 문자열의 수를 셀 때 늘 쓰는 방법이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 그래프 30개에서 $$(A^k)_{ij}$$ = 전수 나열한 보행 수($$k \le 3$$), $$(P^3)_{ij}$$ = 모의실험 확률, 정상분포 $$\frac{\deg}{2m}$$, 짝수 사이클의 고윳값 $$-2$$와 번갈아 뛰는 분포·삼각형에서의 수렴, 전이 문제($$k \le 15$$ 전수), 카드의 값 — [24_walks-markov-bridge_verify.py](/Hongs_Blog/studies/probability-statistics/code/24_walks-markov-bridge_verify/)</div>

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 경로 그래프 1–2–3–4에서 $$(A^2)_{13}$$과 $$(A^2)_{22}$$를 구하고 각각 어떤 보행을 센 것인지 쓰라.</summary>

**답:** $$(A^2)_{13} = 1$$: 1→2→3. $$(A^2)_{22} = 2$$: 2→1→2와 2→3→2. 대각 성분은 한 정점의 이웃 수(차수)와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 중심 하나에 잎 네 개가 붙은 별 그래프에서 무작위 보행의 정상분포는?</summary>

**답:** 간선 $$m = 4$$, 차수 합 8. 중심 $$\frac48 = \frac12$$, 잎마다 $$\frac18$$. (이 그래프는 이분이라 분포가 수렴하지는 않지만, 머무는 비율은 이 값으로 간다.)

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$A^k$$의 성분은 $$k$$와 함께 커지는데 $$P^k$$의 성분은 1을 넘지 않는 이유는?</summary>

**답:** $$A$$의 걸음 무게는 1이라 경로가 많아질수록 합이 커진다. $$P$$는 한 상태에서 나가는 확률의 합이 1이라, 경로가 갈라질 때 무게도 나뉘어 전체 합이 늘 1로 유지된다. 고윳값으로는 $$P$$의 가장 큰 고윳값이 1, $$A$$의 것은 보통 1보다 크다.

</details>


## 출처

[^1]: Rosen, *Discrete Mathematics and Its Applications* 7판, 10장(그래프의 연결성과 길이 $$r$$인 경로의 수 = 인접행렬의 $$r$$제곱).
[^2]: Blitzstein, Hwang, *Introduction to Probability* 2판, 11.1절(전이행렬의 거듭제곱), 11.4절 "Reversibility"(무방향 그래프 위 무작위 보행의 정상분포가 차수에 비례함).
{% endraw %}
