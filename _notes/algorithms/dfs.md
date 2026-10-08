---
layout: "note"
title: "깊이 우선 탐색(DFS)"
display_title: "깊이 우선 탐색(DFS) (Depth-First Search)"
kind: "concept"
kind_label: "알고리즘"
num: "25"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
updated: "2026-10-02"
status: "verified"
aliases: ["DFS", "Depth-First Search", "깊이 우선 탐색", "연결 성분", "사이클 판정", "세 가지 색"]
description: "미로에서 한 길을 막힐 때까지 끝까지 가 보고, 막히면 마지막 갈림길로 돌아와 다른 길을 가는 방식이다. 출발점에서 닿을 수 있는 곳을 빠짐없이 한 번씩 돌아, 연결된 덩어리를 찾거나 사이클이 있는지 볼 때 쓴다. 코드가 재귀로 짧게 써진다. 대신 처음 닿은 길이 가장 짧은 길이라…"
prev_url: "/studies/algorithms/bfs/"
prev_title: "너비 우선 탐색(BFS)"
next_url: "/studies/algorithms/dijkstra/"
next_title: "다익스트라"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/dfs/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

미로에서 한 길을 막힐 때까지 끝까지 가 보고, 막히면 마지막 갈림길로 돌아와 다른 길을 가는 방식이다. 출발점에서 닿을 수 있는 곳을 빠짐없이 한 번씩 돌아, 연결된 덩어리를 찾거나 사이클이 있는지 볼 때 쓴다. 코드가 재귀로 짧게 써진다. 대신 처음 닿은 길이 가장 짧은 길이라는 보장은 없고, 파이썬 재귀는 깊이 1,000 근처에서 멈춘다.

</div>


## 예시로 보기

무방향 그래프 1–2, 1–3, 2–4, 4–5, 3–5, 6–7에서 1부터 DFS를 한다(이웃은 번호 순).

| 지금 칸 | 아직 안 간 이웃 | 한 일 | 재귀로 쌓인 길 |
|---|---|---|---|
| 1 | 2, 3 | 2로 들어감 | 1 |
| 2 | 4 | 4로 들어감 | 1 → 2 |
| 4 | 5 | 5로 들어감 | 1 → 2 → 4 |
| 5 | 3 | 3으로 들어감 | 1 → 2 → 4 → 5 |
| 3 | 없음(1, 5는 갔음) | 5로 돌아감 → 4 → 2 → 1 | 1 → 2 → 4 → 5 → 3 |
| 1 | 없음 | 끝 | |

방문 순서는 1, 2, 4, 5, 3이다. 3은 1의 바로 이웃인데도 가장 늦게 간다. 한 길(2 → 4 → 5)을 끝까지 판 뒤에야 5를 통해 3에 닿기 때문이다. 6, 7은 1에서 닿지 않는 다른 덩어리다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">입력과 출력</div>

- **입력:** 그래프 $$G = (V, E)$$(인접 리스트)와 출발점 $$s$$.
- **출력:** $$s$$에서 간선을 따라 닿을 수 있는 모든 점을 한 번씩 방문한 순서.

</div>


```python
def dfs(graph, v, seen, out):
    seen.add(v)
    out.append(v)
    for u in graph[v]:
        if u not in seen:
            dfs(graph, u, seen, out)     # 한 이웃으로 끝까지 들어간다
```

재귀 대신 스택으로도 짠다. 꺼낼 때 방문 표시를 하고 이웃을 거꾸로 넣으면 재귀와 같은 순서가 나온다. 깊이가 수천 이상이면 스택 방식이 안전하다.

닿을 수 있는 점을 모두 방문하는 까닭: s에서 v로 가는 길 s = x₀, x₁, …, x_k = v가 있다고 하자. x₀은 방문한다. x_i를 방문하면 그 이웃 목록을 다 훑으니, x_{i+1}은 그때 방문하거나 이미 방문했다. 귀납적으로 v도 방문한다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시와 확인 문제 C1의 방문 순서, C3의 다이아몬드 그래프를 코드로 확인했다. 무작위 그래프 2,000개에서 재귀와 스택 방식의 순서가 같았고, 덩어리 수가 BFS로 센 수와, 세 가지 색 사이클 판정이 위상 정렬(칸 판정)과 같았다. 점 2,000개가 한 줄로 이어지면 재귀 DFS가 기본 재귀 한도에서 `RecursionError`를 내는 것도 확인했다 — [25_dfs_impl.py](/Hongs_Blog/studies/algorithms/code/25_dfs_impl/)</div>

</div>


## 활용

- **비용:** 점마다 한 번 방문하고 이웃 목록을 한 번 훑어 $$O(n + m)$$이다.
- **연결 덩어리 세기:** 아직 안 간 점마다 DFS를 한 번씩 시작하면, 시작한 횟수가 덩어리 수다(확인 문제 C2).
- **방향 그래프의 사이클:** 칸을 세 가지 색으로 둔다. 아직(흰색), 탐색 중(회색: 재귀가 아직 이 칸 안에 있음), 끝남(검정). 탐색 중에 회색 칸을 다시 만나면 사이클이다. 검정 칸을 만나는 것은 사이클이 아니다(확인 문제 C3).
- **위상 정렬:** DFS가 끝나는 순서를 거꾸로 하면 위상 정렬이다. [부분순서와 위상 정렬](/Hongs_Blog/studies/discrete-math/partial-orders/)의 칸 방식(들어오는 간선이 없는 점부터 떼기)도 같은 결과를 준다.
- **고르는 기준:** 최단 거리가 필요하면 [BFS](/Hongs_Blog/studies/algorithms/bfs/)다. 닿는 곳을 모두 보기만 하면 둘 다 되고, 사이클·위상 정렬·트리의 아래쪽부터 계산하기는 DFS가 자연스럽다.
- **흔한 실수:** 방향 그래프에서 "이미 방문한 점을 다시 만나면 사이클"로 판정한다. 깊은 그래프에서 재귀 한도를 늘리지 않는다. 방문 표시를 재귀 호출 뒤에 해 같은 점을 여러 번 들어간다.

## 연결

- 선수: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/), [그래프 표현](/Hongs_Blog/studies/algorithms/graph-representation/)
- 백트래킹은 "선택의 나무"를 DFS로 도는 것이다. DFS는 그 나무가 그래프일 때 같은 점을 두 번 가지 않게 방문 표시를 더한 것이다.
- 수학 쪽: [경로와 연결성](/Hongs_Blog/studies/discrete-math/connectivity/)에서 DFS가 찾은 길이 최단이 아닐 수 있음을 예로 보인다.
- 무방향 그래프에서 "서로 닿는다"는 동치관계다([경로와 연결성](/Hongs_Blog/studies/discrete-math/connectivity/)의 정리 2). 그래서 점들이 서로 겹치지 않는 덩어리로 나뉜다([동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)). DFS 한 번은 시작점이 든 덩어리만 빠짐없이 표시하니, 시작한 횟수가 곧 덩어리 수다.
- 맞다는 근거: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/). 닿을 수 있는 점을 모두 방문한다는 위의 설명이 길 위의 순서 i에 대한 귀납법이다.
- 역방향 자동미분도 DFS로 만든 위상 정렬을 쓴다. [연쇄 법칙 ↔ 역전파](/Hongs_Blog/studies/calculus/backprop-bridge/)의 구현은 출력에서 "이 값을 만든 값" 쪽으로 DFS를 하고, 끝나는 순서를 거꾸로 훑으며 기울기를 넘긴다. 그래서 한 값의 기울기는 그 값을 쓴 곳에서 다 모인 뒤에야 그 값을 만든 값들로 넘어간다.
- [마르코프 연쇄](/Hongs_Blog/studies/probability-statistics/markov-chains/)가 어느 상태에서든 어느 상태로든 갈 수 있는지(기약)도 DFS로 판정한다. 확률이 0보다 큰 이동을 간선으로 둔 방향 그래프에서, 한 상태로부터 모든 상태에 닿고 간선을 모두 뒤집은 그래프에서도 모두 닿으면 기약이다. 기약이 아니면 오래 돌린 뒤의 분포가 출발점에 따라 달라질 수 있다.
- 함께 보면 좋은 수학: [대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)(무방향 그래프의 덩어리 수는 그래프 라플라시안이라는 행렬의 고윳값 0의 개수와 같다)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 무방향 간선 1–2, 1–5, 2–3, 2–4, 5–6에서 1부터 DFS를 할 때(이웃은 번호 순) 방문 순서는?</summary>

**답:** 1, 2, 3, 4, 5, 6. 2로 들어가 3을 다 보고 2로 돌아와 4, 다시 1로 돌아와 5, 6 순서다. BFS였다면 1, 2, 5, 3, 4, 6이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드가 돌려주는 값을 한 문장으로 말하라.</summary>

```python
def f(n, graph):
    seen, cnt = [False] * n, 0
    for s in range(n):
        if not seen[s]:
            cnt += 1
            stack = [s]
            seen[s] = True
            while stack:
                v = stack.pop()
                for u in graph[v]:
                    if not seen[u]:
                        seen[u] = True
                        stack.append(u)
    return cnt
```
**답:** 무방향 그래프의 연결 덩어리(연결 성분) 수다. 아직 안 간 점에서 탐색을 시작할 때마다 새 덩어리를 하나 세고, 그 덩어리의 점을 모두 방문 표시한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 방향 그래프에서 "이미 방문한 점을 다시 만나면 사이클"이라고 판정하면 틀리는 예를 들어라.</summary>

**답:** a → b, a → c, b → d, c → d(다이아몬드). a에서 b, d를 방문하고 돌아온 뒤 c에서 d를 다시 만난다. d는 이미 방문했지만 사이클은 없다. d는 탐색이 끝난(검정) 칸이기 때문이다. 탐색 중인(회색) 칸을 다시 만날 때만 사이클이다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 12.1 "Depth-first search"(재귀 구현, O(n + m)), 12.3 "Applications"(연결성, 사이클 찾기). 세 가지 색과 끝나는 순서의 위상 정렬은 Cormen 외, *Introduction to Algorithms* 3판, 22.3절과 22.4절.
{% endraw %}
