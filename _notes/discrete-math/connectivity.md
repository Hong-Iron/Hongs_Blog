---
layout: "note"
title: "경로와 연결성"
display_title: "경로와 연결성 (Paths and Connectivity)"
kind: "concept"
kind_label: "정의"
num: "33"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Paths and Connectivity", "보행", "walk", "트레일", "trail", "경로", "path", "사이클", "cycle", "연결 그래프", "connected graph", "연결 성분", "connected component", "도달 가능성", "reachability", "너비 우선 탐색", "BFS", "breadth-first search", "깊이 우선 탐색", "DFS", "depth-first search", "강연결 성분", "strongly connected component"]
description: "그래프에서 간선을 따라 한 정점에서 다른 정점으로 갈 수 있는지, 가장 적게 몇 번 건너면 되는지를 묻는다. 서로 오갈 수 있는 정점끼리 묶으면 그래프가 섬(연결 성분)들로 깔끔하게 나뉜다. 너비 우선 탐색(BFS)은 가까운 곳부터 넓혀 가며 최단 거리를, 깊이 우선 탐색(DFS)…"
prev_url: "/studies/discrete-math/graph-basics/"
prev_title: "그래프의 기초"
next_url: "/studies/discrete-math/euler-hamilton/"
next_title: "오일러 경로와 해밀턴 경로"
math: true
mermaid: false
code_count: 2
permalink: "/studies/discrete-math/connectivity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

그래프에서 간선을 따라 한 정점에서 다른 정점으로 갈 수 있는지, 가장 적게 몇 번 건너면 되는지를 묻는다. 서로 오갈 수 있는 정점끼리 묶으면 그래프가 섬(연결 성분)들로 깔끔하게 나뉜다. 너비 우선 탐색(BFS)은 가까운 곳부터 넓혀 가며 최단 거리를, 깊이 우선 탐색(DFS)은 한 길을 끝까지 파고들며 구조를 찾는다. 둘 다 간선 수에 비례하는 시간이지만, 최단 거리는 BFS만 보장하고 그것도 간선에 무게가 없을 때만 그렇다.

</div>


## 예시로 보기

정점 1~7과 간선 1–2, 1–3, 2–4, 3–4, 4–5, 6–7이 있다. 1에서 BFS를 한다. 대기열(큐)에서 하나 꺼내 아직 못 본 이웃을 뒤에 넣는다.

| 꺼낸 정점 | 새로 찾은 정점(거리) | 큐 |
|---|---|---|
| — | 1(0) | [1] |
| 1 | 2(1), 3(1) | [2, 3] |
| 2 | 4(2) | [3, 4] |
| 3 | 없음(4는 이미 봄) | [4] |
| 4 | 5(3) | [5] |
| 5 | 없음 | [] |

1에서 5까지 최단 거리는 3이다(1–2–4–5). 6과 7은 끝내 닿지 않는다. 그래프가 $$\{1, \dots, 5\}$$와 $$\{6, 7\}$$ 두 섬으로 나뉜다. 거리가 아래 정의의 경로 길이, 섬이 연결 성분이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **보행(walk)**: 정점과 간선을 번갈아 늘어놓은 $$v_0, e_1, v_1, \dots, e_k, v_k$$($$e_i = \{v_{i-1}, v_i\}$$). 길이는 간선 수 $$k$$.
- **트레일(trail)**: 간선이 반복되지 않는 보행. **경로(path)**: 정점이 반복되지 않는 보행.
- **사이클(cycle)**: 시작과 끝이 같고, 그 밖에는 정점이 반복되지 않는 길이 3 이상의 닫힌 보행.
- $$u$$에서 $$v$$로 가는 보행이 있으면 $$v$$에 **도달 가능**하다. $$u$$, $$v$$ 사이의 **거리**는 가장 짧은 경로의 길이다.
- 모든 두 정점이 서로 도달 가능하면 **연결 그래프**다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">도달 가능성과 연결 성분</div>

1. $$u$$에서 $$v$$로 가는 보행이 있으면 경로도 있다. 가장 짧은 보행은 경로다.
2. 무방향 그래프에서 "도달 가능"은 동치관계다. 그 동치류가 **연결 성분**이고, 정점들을 겹치지 않게 나눈다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 가장 짧은 보행에서 정점 $$w$$가 두 번 나온다면, 두 $$w$$ 사이를 잘라내도 보행이다. 더 짧아져 모순이므로 정점이 반복되지 않는다.
2. *반사:* 길이 0인 보행. *대칭:* 보행을 거꾸로 걷는다(간선에 방향이 없다). *추이:* $$u \to v$$ 보행과 $$v \to w$$ 보행을 이어 붙인다. 동치관계이므로 [동치류가 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)을 이룬다. ∎

</details>


방향 그래프에서는 대칭이 깨진다. $$1 \to 2$$만 있으면 2는 1에서 도달 가능하지만 거꾸로는 아니다. 그래서 "서로 도달 가능"으로 묶은 **강연결 성분**을 쓴다.

**탐색 알고리즘.** 두 방법 모두 모든 정점과 간선을 한 번씩 보므로 인접 리스트에서 $$O(n + m)$$이다[^2].

| | BFS | DFS |
|---|---|---|
| 자료구조 | 큐(먼저 넣은 것을 먼저) | 스택 또는 재귀(나중에 넣은 것을 먼저) |
| 방문 모양 | 거리 0, 1, 2, … 층층이 | 한 갈래를 끝까지 간 뒤 되돌아옴 |
| 보장 | 무게 없는 그래프의 최단 거리 | 사이클 찾기, 위상 정렬, 강연결 성분에 쓰는 구조 |

**보행의 수.** 인접 행렬 $$A$$의 거듭제곱 $$A^k$$의 $$(u, v)$$ 성분은 $$u$$에서 $$v$$로 가는 길이 $$k$$인 보행의 수다. 길이 $$k$$ 보행은 길이 $$k - 1$$ 보행 뒤에 간선 하나를 붙인 것이라, 행렬 곱의 정의 $$\sum_w (A^{k-1})_{uw}A_{wv}$$와 같다(귀납법)[^s1].

## 예제

**DFS가 찾은 길은 최단이 아닐 수 있다.** 간선 1–2, 2–3, 1–3에서 1부터 DFS를 하되 이웃 목록이 [2, 3] 순서라 하자.

1. *탐색:* 1에서 2로 들어가고, 2에서 3으로 들어간다. DFS 트리에서 3의 깊이는 2다.
2. *실제 거리:* 1–3 간선이 있어 거리는 1이다.
3. *차이:* DFS는 먼저 본 갈래를 끝까지 파고들어, 가까운 이웃을 뒤로 미룬다. BFS는 1의 이웃 2, 3을 모두 거리 1로 먼저 확정한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 BFS 거리와 큐 순서, DFS 순서, 두 연결 성분, 무작위 그래프 300개에서 BFS 거리 = 모든 경로를 전수로 찾은 최단 길이, 최단 보행이 경로, 무방향 도달 가능성이 동치관계, 방향 그래프의 비대칭, $$A^k$$와 보행 수(전수), 오해의 DFS 깊이 — [33_connectivity_impl.py](/Hongs_Blog/studies/discrete-math/code/33_connectivity_impl/), [33_connectivity_verify.py](/Hongs_Blog/studies/discrete-math/code/33_connectivity_verify/)</div>

</div>


## 활용

- **네트워크.** 인터넷의 라우팅은 "어디로 도달 가능한가, 몇 단계인가"의 문제다. 무게가 없으면 BFS, 무게(지연, 비용)가 있으면 다익스트라 같은 알고리즘을 쓴다(알고리즘 과목).
- **도달 가능성 분석.** 쓰레기 수집기는 루트 객체에서 도달 가능한 객체만 남기고 나머지를 지운다(표시 단계가 그래프 탐색이다)[^s1]. 소셜 그래프의 "친구의 친구", 퍼즐의 상태 공간 탐색도 BFS다.
- **구현.** 깊은 그래프에서 재귀 DFS는 재귀 깊이 제한에 걸린다. [33_connectivity_impl.py](/Hongs_Blog/studies/discrete-math/code/33_connectivity_impl/)는 스택으로 구현했다.
- 알고리즘에서: BFS가 거리 순서로 점을 찾는다는 증명과 여러 출발점·상태 BFS는 [너비 우선 탐색(BFS)](/Hongs_Blog/studies/algorithms/bfs/)에, 연결 성분을 세고 방향 그래프의 사이클을 세 가지 색으로 찾는 코드는 [깊이 우선 탐색(DFS)](/Hongs_Blog/studies/algorithms/dfs/)에 있다. 위 네트워크 항목의 다익스트라는 무게가 모두 0 이상일 때만 맞는다([다익스트라](/Hongs_Blog/studies/algorithms/dijkstra/)). 무게 합이 음수인 닫힌 보행이 없으면, 정리 1의 증명처럼 두 번 나온 정점 사이를 잘라 내도 비용이 늘지 않아 가장 싼 보행 가운데 경로인 것이 늘 있다([플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/), [튜브의 소개팅](/Hongs_Blog/studies/algorithms/pg1839/)). 그 밖에 [유니온 파인드](/Hongs_Blog/studies/algorithms/union-find/)에서도 쓴다.

## 연결

- 선수: [그래프의 기초](/Hongs_Blog/studies/discrete-math/graph-basics/)
- 같은 구조: [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)(연결 성분)
- 이어지는 개념: [오일러 경로와 해밀턴 경로](/Hongs_Blog/studies/discrete-math/euler-hamilton/), [트리](/Hongs_Blog/studies/discrete-math/trees/), [이분 그래프](/Hongs_Blog/studies/discrete-math/bipartite-coloring/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 보행, 경로, 사이클을 구별해 정의하라.</summary>

**답:** 보행은 간선을 따라 이어진 정점·간선의 열로 반복이 허용된다. 경로는 정점이 반복되지 않는 보행이다. 사이클은 시작과 끝이 같고 그 밖에는 정점이 반복되지 않는 길이 3 이상의 닫힌 보행이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 간선 a–b, a–c, b–d, c–d, d–e, e–f에서 a부터 BFS를 할 때 각 정점의 거리를 쓰라(이웃은 알파벳 순서).</summary>

**답:** a 0, b 1, c 1, d 2, e 3, f 4. 방문 순서는 a, b, c, d, e, f.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 방향 그래프에서 "도달 가능"이 동치관계가 아닌 이유를 예로 보여라.</summary>

**답:** 대칭성이 깨진다. 간선 $$1 \to 2$$ 하나뿐이면 2는 1에서 도달 가능하지만 1은 2에서 도달 불가능하다. 그래서 방향 그래프는 "서로 도달 가능"으로 묶은 강연결 성분을 쓴다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 10장(방향 그래프의 보행과 경로), 12장(단순 그래프의 연결성).
[^2]: Cormen et al., *Introduction to Algorithms* 3판, 22.2절 "Breadth-first search"(최단 거리의 정확성), 22.3절 "Depth-first search".
[^s1]: 에이전트 보충. $$A^k$$와 보행 수의 관계는 33_connectivity_verify.py에서 작은 그래프의 모든 보행을 세어 확인했고, 선형대수학에서 다시 다룬다. 쓰레기 수집기의 표시–청소(mark-and-sweep) 방식은 운영체제·언어 구현 교재의 표준 내용이다.
{% endraw %}
