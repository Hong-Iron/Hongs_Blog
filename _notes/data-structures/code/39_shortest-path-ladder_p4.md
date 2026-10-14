---
layout: "note"
title: "39_shortest-path-ladder_p4.py"
display_title: "39_shortest-path-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "39"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/shortest-path-ladder/"
parent_title: "최단 경로 표 채우기 예제 사다리"
description: "자료구조 · 최단 경로 표 채우기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/39_shortest-path-ladder_p4/"
---
{% raw %}
[최단 경로 표 채우기 예제 사다리](/Hongs_Blog/studies/data-structures/shortest-path-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""최단 경로 표 채우기 예제 사다리: 문제 1 ~ 4의 답 확인.

문서: 1-2학기/자료구조/4.연습문제/39.최단 경로 표 채우기 예제 사다리.md
출처: 문제 1 ~ 3은 자료구조 12주차 슬라이드 p.10~19, p.35~38, p.62~69의 그래프와 표.
      문제 4의 그래프와 수치는 에이전트가 만든 것이다.
실행: python3 39_shortest-path-ladder_p4.py
정점 번호는 1부터다.

확인하는 것
  문제 1. 배열 판 다익스트라(슬라이드 그래프, 출발점 1): 고르는 순서 1 3 5 2 4 6 7과 단계마다의 d, p 줄,
          끝난 뒤 d = 0 6 2 9 5 10 11, p = - 1 1 5 3 3 6, 7로 가는 길 1 3 6 7.
          "싼 간선만 따라가기"는 1 3 5 4 7(길이 12)을 낸다. 점 1,000개일 때 배열 판 n^2 = 100만과
          힙 판 (n + m) lg n(간선 3,000개면 약 4만, 간선 999,000개면 약 1,000만) 견주기.
  문제 2. 벨만-포드(슬라이드 그래프): p(v, 5) = - 6 2 1 3 4를 거꾸로 따라가면 1 4 6 2 3 5, 길이 9.
          6으로 가는 길은 1 4 6(길이 8), 3으로 가는 길은 1 4 6 2 3(길이 6).
  문제 3. 플로이드의 kay 표(슬라이드 그래프): 1에서 7은 1 4 2 5 8 6 7(14), 3에서 1은 3 6 7 1(12), 4에서 3은 4 2 5 8 6 7 1 3(20).
  문제 4. 정점 5개, 음수 간선 하나(3 -> 2, -4)인 그래프:
          다익스트라는 0 2 5 5 6을 내고, 벨만-포드 표의 마지막 줄은 0 1 5 4 5, p = - 3 1 2 4, 5로 가는 길 1 3 2 4 5.
          표의 네 줄(k = 1 ~ 4)이 모두 앞줄과 다르다.
"""

INF = float("inf")

DIJ_EDGES = [(1, 3, 2), (1, 2, 6), (1, 4, 16), (1, 7, 14), (3, 2, 7), (3, 5, 3), (3, 6, 8),
             (2, 4, 5), (2, 5, 4), (5, 4, 4), (5, 7, 10), (4, 7, 3), (6, 7, 1)]

BF_EDGES = [(1, 2, 3), (1, 4, 7), (2, 3, 4), (2, 4, 5), (3, 5, 3),
            (3, 6, 6), (4, 5, 9), (4, 6, 1), (6, 2, -6)]

FLOYD = [
    [0, 7, 5, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0],
    [0, 7, 0, 0, 9, 9, 0, 0],
    [0, 5, 0, 0, 0, 0, 16, 0],
    [0, 0, 0, 4, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [2, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 2, 4, 0],
]

P4_EDGES = [(1, 2, 2), (1, 3, 5), (3, 2, -4), (2, 4, 3), (4, 5, 1), (3, 5, 6)]


def dijkstra_array(n, edges, s):
    """배열 판 다익스트라. (고른 순서, 고른 뒤마다의 (d, p) 줄, 끝난 d, 끝난 p)
    아직 고르지 않은 정점 가운데 d가 가장 작은 것을 배열을 훑어 찾는다. 같으면 번호가 작은 것."""
    d = [INF] * (n + 1)
    p = [None] * (n + 1)
    d[s] = 0
    done = [False] * (n + 1)
    order, rows = [], []
    for _ in range(n):
        best = None
        for v in range(1, n + 1):
            if not done[v] and d[v] < INF and (best is None or d[v] < d[best]):
                best = v
        if best is None:
            break
        done[best] = True
        order.append(best)
        for u, v, cost in edges:
            if u == best and not done[v] and d[u] + cost < d[v]:
                d[v] = d[u] + cost
                p[v] = u
        rows.append((d[1:], p[1:]))
    return order, rows, d, p


def bellman_ford_table(n, edges, s):
    d = [[INF] * (n + 1)]
    p = [[None] * (n + 1)]
    d[0][s] = 0
    for k in range(1, n):
        d.append(d[k - 1][:])
        p.append(p[k - 1][:])
        for u, v, cost in edges:
            if d[k - 1][u] + cost < d[k][v]:
                d[k][v] = d[k - 1][u] + cost
                p[k][v] = u
    return d, p


def path_from(p_row, s, v):
    path = [v]
    while path[-1] != s:
        path.append(p_row[path[-1]])
    return path[::-1]


def floyd_with_kay(n, rows):
    c = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            c[i][j] = 0 if i == j else (rows[i - 1][j - 1] or INF)
    kay = [[0] * (n + 1) for _ in range(n + 1)]
    for k in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if c[i][j] > c[i][k] + c[k][j]:
                    kay[i][j] = k
                    c[i][j] = c[i][k] + c[k][j]
    return c, kay


def output_path(kay, i, j, out):
    if i == j:
        return
    if kay[i][j] == 0:
        out.append(j)
    else:
        output_path(kay, i, kay[i][j], out)
        output_path(kay, kay[i][j], j, out)


def main():
    X = INF
    # 문제 1
    order, rows, d, p = dijkstra_array(7, DIJ_EDGES, 1)
    assert order == [1, 3, 5, 2, 4, 6, 7]
    want_rows = [
        ([0, 6, 2, 16, X, X, 14], [None, 1, 1, 1, None, None, 1]),     # 1을 고른 뒤 (p.13)
        ([0, 6, 2, 16, 5, 10, 14], [None, 1, 1, 1, 3, 3, 1]),          # 3을 고른 뒤 (p.14)
        ([0, 6, 2, 9, 5, 10, 14], [None, 1, 1, 5, 3, 3, 1]),           # 5를 고른 뒤 (p.15)
        ([0, 6, 2, 9, 5, 10, 14], [None, 1, 1, 5, 3, 3, 1]),           # 2를 고른 뒤 (p.16)
        ([0, 6, 2, 9, 5, 10, 12], [None, 1, 1, 5, 3, 3, 4]),           # 4를 고른 뒤 (p.17)
        ([0, 6, 2, 9, 5, 10, 11], [None, 1, 1, 5, 3, 3, 6]),           # 6을 고른 뒤 (p.18)
        ([0, 6, 2, 9, 5, 10, 11], [None, 1, 1, 5, 3, 3, 6]),           # 7을 고른 뒤
    ]
    assert rows == want_rows
    assert path_from(p, 1, 7) == [1, 3, 6, 7] and d[7] == 11 == 2 + 8 + 1
    assert path_from(p, 1, 4) == [1, 3, 5, 4] and d[4] == 9
    # p.7~8의 "싼 간선만 따라가기": 지금 점에서 새 점으로 가는 가장 싼 간선을 탄다
    here, walk, length, seen = 1, [1], 0, {1}
    while here != 7:
        cost, nxt = min((c, v) for u, v, c in DIJ_EDGES if u == here and v not in seen)
        walk.append(nxt); length += cost; seen.add(nxt); here = nxt
    assert walk == [1, 3, 5, 4, 7] and length == 12 > d[7]
    # 배열 판 n^2과 힙 판 (n + m) lg n 견주기: 점 1,000개
    import math
    n_big = 1000
    sparse, dense = 3000, n_big * (n_big - 1)
    assert (n_big + sparse) * math.log2(n_big) < n_big ** 2 < (n_big + dense) * math.log2(n_big)
    assert round((n_big + sparse) * math.log2(n_big)) == 39863
    assert 9.9e6 < (n_big + dense) * math.log2(n_big) < 1.0e7
    assert sum(1 for _ in range(7) for _ in range(7)) == 49   # 점 7개: 고를 때마다 7칸을 훑어 49칸
    print("[OK] 문제 1: 고르는 순서 1 3 5 2 4 6 7, d = 0 6 2 9 5 10 11, p = - 1 1 5 3 3 6, 길 1 3 6 7")

    # 문제 2
    bd, bp = bellman_ford_table(6, BF_EDGES, 1)
    assert bd[5][1:] == [0, 2, 6, 7, 9, 8] and bp[5][1:] == [None, 6, 2, 1, 3, 4]
    assert path_from(bp[5], 1, 5) == [1, 4, 6, 2, 3, 5] and 7 + 1 - 6 + 4 + 3 == 9
    assert path_from(bp[5], 1, 6) == [1, 4, 6] and bd[5][6] == 8
    assert path_from(bp[5], 1, 3) == [1, 4, 6, 2, 3] and bd[5][3] == 6
    print("[OK] 문제 2: p(v, 5) = - 6 2 1 3 4 -> 5로 가는 길 1 4 6 2 3 5(9), 6은 1 4 6(8), 3은 1 4 6 2 3(6)")

    # 문제 3
    c, kay = floyd_with_kay(8, FLOYD)
    out = []
    output_path(kay, 1, 7, out)
    assert [1] + out == [1, 4, 2, 5, 8, 6, 7] and c[1][7] == 14
    out = []
    output_path(kay, 3, 1, out)
    assert [3] + out == [3, 6, 7, 1] and c[3][1] == 12 == 9 + 1 + 2
    assert (kay[3][1], kay[3][7], kay[3][6], kay[6][7], kay[7][1]) == (7, 6, 0, 0, 0)
    out = []
    output_path(kay, 4, 3, out)
    assert [4] + out == [4, 2, 5, 8, 6, 7, 1, 3] and c[4][3] == 20 == 5 + 4 + 1 + 2 + 1 + 2 + 5
    assert (kay[4][3], kay[4][8], kay[8][3], kay[4][5], kay[5][8], kay[8][7], kay[7][3]) == (8, 5, 7, 2, 0, 6, 1)
    assert (kay[4][2], kay[2][5], kay[8][6], kay[6][7], kay[7][1], kay[1][3]) == (0, 0, 0, 0, 0, 0)
    print("[OK] 문제 3: 1 -> 7은 1 4 2 5 8 6 7(14), 3 -> 1은 3 6 7 1(12), 4 -> 3은 4 2 5 8 6 7 1 3(20)")

    # 문제 4
    order, rows, d, p = dijkstra_array(5, P4_EDGES, 1)
    assert order == [1, 2, 3, 4, 5] and d[1:] == [0, 2, 5, 5, 6]
    bd, bp = bellman_ford_table(5, P4_EDGES, 1)
    assert [row[1:] for row in bd] == [
        [0, X, X, X, X],
        [0, 2, 5, X, X],
        [0, 1, 5, 5, 11],
        [0, 1, 5, 4, 6],
        [0, 1, 5, 4, 5],
    ]
    assert [row[1:] for row in bp] == [
        [None, None, None, None, None],
        [None, 1, 1, None, None],
        [None, 3, 1, 2, 3],
        [None, 3, 1, 2, 4],
        [None, 3, 1, 2, 4],
    ]
    assert all(bd[k] != bd[k - 1] for k in range(1, 5))
    assert path_from(bp[4], 1, 5) == [1, 3, 2, 4, 5] and 5 - 4 + 3 + 1 == 5
    wrong = [v for v in range(1, 6) if d[v] != bd[4][v]]
    assert wrong == [2, 4, 5]
    print("[OK] 문제 4: 다익스트라 0 2 5 5 6(2, 4, 5가 틀림), 벨만-포드 0 1 5 4 5, 길 1 3 2 4 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
