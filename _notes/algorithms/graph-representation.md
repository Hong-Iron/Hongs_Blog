---
layout: "note"
title: "그래프 표현"
display_title: "그래프 표현 (Graph Representation)"
kind: "concept"
kind_label: "자료구조"
num: "23"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
updated: "2026-10-02"
status: "verified"
aliases: ["Graph Representation", "Adjacency List", "Adjacency Matrix", "Edge List", "인접 리스트", "인접 행렬", "간선 목록", "격자 그래프", "상태 그래프"]
description: "지하철 노선도를 코드로 옮기는 방법이다. 역마다 \"바로 갈 수 있는 역 목록\"을 적어 두는 인접 리스트가 기본이다. 역이 몇백 개 이하이고 \"두 역이 바로 이어졌나\"를 자주 물으면 표(인접 행렬)를 쓴다. 격자 지도는 따로 옮기지 않고 칸 자체를 역으로 본다. 번호가 1부터인지, …"
prev_url: "/studies/algorithms/greedy/"
prev_title: "그리디"
next_url: "/studies/algorithms/bfs/"
next_title: "너비 우선 탐색(BFS)"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/graph-representation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

지하철 노선도를 코드로 옮기는 방법이다. 역마다 "바로 갈 수 있는 역 목록"을 적어 두는 인접 리스트가 기본이다. 역이 몇백 개 이하이고 "두 역이 바로 이어졌나"를 자주 물으면 표(인접 행렬)를 쓴다. 격자 지도는 따로 옮기지 않고 칸 자체를 역으로 본다. 번호가 1부터인지, 길이 양방향인지를 잘못 옮기는 실수가 가장 흔하다.

</div>


## 예시로 보기

도시 1 ~ 4와 양방향 도로 1–2(5km), 1–3(2km), 2–4(1km), 3–4(7km)가 있다. 문제는 보통 이것을 **간선 목록**으로 준다: `[[1, 2, 5], [1, 3, 2], [2, 4, 1], [3, 4, 7]]`.

**인접 리스트**로 옮기면 도시마다 (이웃, 거리) 목록이 생긴다. 번호가 1부터라 칸을 n + 1개 만들고 0번은 비워 둔다.

```python
n = 4
graph = [[] for _ in range(n + 1)]
for a, b, w in edges:
    graph[a].append((b, w))
    graph[b].append((a, w))      # 양방향이면 반대쪽도 넣는다
# graph[1] = [(2, 5), (3, 2)], graph[4] = [(2, 1), (3, 7)]
```

**인접 행렬**로 옮기면 (n + 1)×(n + 1) 표의 M[a][b]에 거리를 적는다. 길이 없으면 무한대(`float("inf")`), 자기 자신은 0이다.

| | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| 1 | 0 | 5 | 2 | ∞ |
| 2 | 5 | 0 | ∞ | 1 |
| 3 | 2 | ∞ | 0 | 7 |
| 4 | ∞ | 1 | 7 | 0 |

인접 리스트의 목록 길이를 모두 더하면 8이다. 양방향 도로 4개가 양쪽에 한 번씩 들어가서 간선 수의 두 배다([그래프의 기초](/Hongs_Blog/studies/discrete-math/graph-basics/)의 악수 정리).

## 세 가지 방식과 격자

| | 인접 리스트 | 인접 행렬 | 간선 목록 |
|---|---|---|---|
| 메모리 | $$O(n + m)$$ | $$O(n^2)$$ | $$O(m)$$ |
| v의 이웃 모두 보기 | $$O(\deg v)$$ | $$O(n)$$ | $$O(m)$$ |
| a–b가 이어졌나 | $$O(\deg a)$$ | $$O(1)$$ | $$O(m)$$ |
| 알맞은 곳 | 대부분(BFS, 다익스트라) | n ≤ 수백, 플로이드–워셜 | 간선을 정렬해 쓰는 알고리즘 |

n은 점 수, m은 간선 수, deg v는 v에 붙은 간선 수다[^1]. 점이 10만 개면 인접 행렬은 칸이 100억 개라 만들 수 없다.

**격자:** 미로 같은 격자는 칸 (r, c)가 점이고, 벽이 아닌 상하좌우 이웃과 이어진다. 그래프를 따로 만들지 않고, 이웃을 그때그때 방향 목록으로 만든다.

```python
for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
    nr, nc = r + dr, c + dc
    if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0:
        ...                      # (nr, nc)가 이웃
```

**상태를 점으로 보기:** 점이 꼭 "장소"일 필요는 없다. "위치와 바라보는 방향", "로봇이 차지한 두 칸"처럼 문제의 상태 하나를 점으로, 한 번의 동작을 간선으로 보면 같은 탐색을 그대로 쓴다. 이때도 그래프를 미리 만들지 않고, 상태에서 갈 수 있는 다음 상태를 그때그때 만든다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 인접 리스트·행렬, 목록 길이의 합 = 간선 수의 두 배, 확인 문제 C1·C3의 답, 격자 이웃 수(모서리 2, 가장자리 3, 안쪽 4)를 확인했다. 무작위 그래프 1,000개에서 인접 리스트와 인접 행렬이 같은 간선과 가중치를 나타냈다 — [23_graph-representation_verify.py](/Hongs_Blog/studies/algorithms/code/23_graph-representation_verify/)</div>

</div>


## 활용

- [너비 우선 탐색(BFS)](/Hongs_Blog/studies/algorithms/bfs/), [다익스트라](/Hongs_Blog/studies/algorithms/dijkstra/)는 인접 리스트로, [플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/)은 인접 행렬로 짠다.
- 딕셔너리로도 만든다: `graph = defaultdict(list)`. 점 이름이 문자열이거나 번호가 띄엄띄엄일 때 편하다. [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/) 참고.
- **흔한 실수:** 1부터 번호를 매기는데 칸을 n개만 만들어 범위를 넘는다. 양방향인데 한쪽만 넣는다. 같은 두 점 사이에 간선이 여러 개인데 행렬에 마지막 값만 남긴다(보통 가장 작은 값을 남겨야 한다). `[[]] * n`으로 만들어 모든 칸이 같은 리스트가 된다.

## 연결

- 선수: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/), [그래프의 기초](/Hongs_Blog/studies/discrete-math/graph-basics/)
- 격자 이동은 [구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)의 방향 배열과 같다. 도달 가능성과 경로의 뜻은 [경로와 연결성](/Hongs_Blog/studies/discrete-math/connectivity/)에서 다룬다.
- 인접 리스트는 인접 행렬의 각 행에서 간선이 있는 칸만 골라 적은 것이다. 거의 빈 표에서 찬 칸만 적어 두는 이 방식을 희소 행렬 저장이라 한다([행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)). 메모리가 n² 대신 n + m인 까닭이 이것이다.
- [PageRank](/Hongs_Blog/studies/probability-statistics/pagerank/)는 식으로는 점수 벡터에 n × n 행렬을 거듭 곱하는 계산이다. 실제로는 그 행렬을 만들지 않고 링크 목록(인접 리스트)을 한 번씩 훑어서, 반복 한 번이 $$O(n + m)$$에 끝난다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 점 1 ~ 4와 방향 간선 [1, 2], [2, 3], [3, 1], [3, 4]를 인접 리스트(이웃 번호만)로 쓰라.</summary>

**답:** graph[1] = [2], graph[2] = [3], graph[3] = [1, 4], graph[4] = []. 방향 간선이라 반대쪽은 넣지 않는다. graph[0]은 비어 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 두 상황에 인접 리스트와 인접 행렬 중 무엇을 쓰는가? (가) 점 10만 개, 간선 20만 개에서 한 점부터 최단 거리를 구한다. (나) 점 200개에서 모든 점 쌍의 최단 거리를 구한다.</summary>

**답:** (가)는 인접 리스트다. 행렬이면 칸이 100억 개라 만들 수조차 없다. (나)는 인접 행렬이다. 칸이 4만 개라 넉넉하고, 모든 쌍을 다루는 플로이드–워셜이 행렬 위에서 돈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 양방향 도로 `[2, 1]` 하나만 있는 그래프를 한쪽 방향(`graph[2].append(1)`)으로만 넣었다. 1에서 출발한 탐색은 무엇을 틀리는가?</summary>

**답:** 1에서 2로 갈 수 없다고 답한다. graph[1]이 비어 있어 1의 이웃이 없기 때문이다. 양방향이면 `graph[1].append(2)`도 넣어야 한다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 11.2 "Graph representation"(인접 리스트, 인접 행렬, 간선 목록), Cormen 외, *Introduction to Algorithms* 3판, 22.1절(인접 리스트는 Θ(V + E), 인접 행렬은 Θ(V²) 메모리).
{% endraw %}
