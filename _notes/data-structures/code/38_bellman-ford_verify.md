---
layout: "note"
title: "38_bellman-ford_verify.py"
display_title: "38_bellman-ford_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/bellman-ford/"
parent_title: "벨만–포드 알고리즘"
description: "자료구조 · 벨만–포드 알고리즘 검증 코드"
permalink: "/studies/data-structures/code/38_bellman-ford_verify/"
---
{% raw %}
[벨만–포드 알고리즘](/Hongs_Blog/studies/data-structures/bellman-ford/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""벨만-포드 알고리즘 검증.

문서: 1-2학기/자료구조/3.개념집/38.벨만–포드 알고리즘.md
출처: 자료구조 12주차 슬라이드 p.24~40 (점화식, 의사코드, 예제 표). 전수 비교와 반례는 에이전트 보충.
실행: python3 38_bellman-ford_verify.py
정점 번호는 슬라이드처럼 1부터다. d[k][v]가 슬라이드의 d(v, k)다.

확인하는 것
  1. 슬라이드 예제(정점 6, 간선 9, 6 -> 2의 비용 -6): d(v, k)와 p(v, k) 표의 k = 0 ~ 5 여섯 줄,
     1에서 5로 가는 길 1 4 6 2 3 5, 길이 9.
  2. 같은 그래프에서 "한 번 확정한 정점은 다시 보지 않는" 다익스트라는 2, 3, 5의 거리를 3, 7, 10으로 틀린다(참은 2, 6, 9).
     모든 간선에 6을 더해 음수를 없앤 그래프에서는 2로 가는 가장 싼 길이 1 2로 바뀐다(원래는 1 4 6 2).
     카드 C1의 정점 4개 그래프: 표 0 4 5 - / 0 2 5 6 / 0 2 5 4.
  3. 무작위 그래프 600개(정점 2~6, 비용 -3~9, 음수 사이클 없음)에서
     d(v, k) = 간선 k개 이하인 모든 길 가운데 가장 짧은 것(전수), d(v, n-1) = 같은 정점을 두 번 지나지 않는 모든 길의 최솟값(전수).
  4. 제자리 계산: 몇 바퀴째든 d(v, n-1) <= d(v) <= d(v, k)가 맞다(무작위 600개, 간선 순서도 무작위).
     슬라이드 p.40의 "d(v, k+1) <= d(v)"는 틀린다: 사슬 1->2->3->4->5에서 한 바퀴 뒤 d(5) = 4인데 d(5, 2)는 무한대다.
  5. 어느 바퀴에서 아무 값도 안 바뀌면 그 뒤로도 안 바뀐다. 슬라이드 예제는 k = 5에서도 바뀌어 일찍 못 멈춘다.
  6. 음수 사이클이 출발점에서 닿으면 n번째 바퀴에서도 값이 줄고, 닿지 않으면 줄지 않는다(무작위 600개).
  7. 한 바퀴에 간선을 한 번씩 본다: 표를 다 채우는 데 (n - 1) x e번(슬라이드 예제는 5 x 9 = 45번).
"""
import random

INF = float("inf")

SLIDE_N = 6
SLIDE_EDGES = [(1, 2, 3), (1, 4, 7), (2, 3, 4), (2, 4, 5), (3, 5, 3),
               (3, 6, 6), (4, 5, 9), (4, 6, 1), (6, 2, -6)]


def bellman_ford_table(n, edges, s):
    """슬라이드 p.32의 의사코드. (d, p, 본 간선 수). d[k][v], p[k][v], 0번 칸은 쓰지 않는다."""
    d = [[INF] * (n + 1)]
    p = [[None] * (n + 1)]
    d[0][s] = 0
    looked = 0
    for k in range(1, n):
        d.append(d[k - 1][:])                 # d(v, k) = d(v, k-1)로 시작한다
        p.append(p[k - 1][:])
        for u, v, cost in edges:              # 간선마다 한 번씩
            looked += 1
            if d[k - 1][u] + cost < d[k][v]:  # 앞 줄의 값만 읽는다
                d[k][v] = d[k - 1][u] + cost
                p[k][v] = u
    return d, p, looked


def path_from(p_row, s, v):
    """p를 거꾸로 따라가 s에서 v로 가는 길을 만든다."""
    path = [v]
    while path[-1] != s:
        path.append(p_row[path[-1]])
    return path[::-1]


def one_pass_in_place(d, edges):
    """제자리 한 바퀴. 값이 하나라도 줄었으면 True."""
    changed = False
    for u, v, cost in edges:
        if d[u] + cost < d[v]:
            d[v] = d[u] + cost
            changed = True
    return changed


def dijkstra_no_reopen(n, edges, s):
    """배열 판 다익스트라: 확정한 정점은 다시 고치지 않는다."""
    d = [INF] * (n + 1)
    d[s] = 0
    done = [False] * (n + 1)
    for _ in range(n):
        best = None
        for v in range(1, n + 1):
            if not done[v] and d[v] < INF and (best is None or d[v] < d[best]):
                best = v
        if best is None:
            break
        done[best] = True
        for u, v, cost in edges:
            if u == best and not done[v] and d[u] + cost < d[v]:
                d[v] = d[u] + cost
    return d


def brute_at_most_k_edges(n, edges, s, k):
    """간선 k개 이하인 모든 길(같은 정점을 다시 지나도 된다)을 다 따라가 본다."""
    best = [INF] * (n + 1)
    out = {u: [] for u in range(1, n + 1)}
    for u, v, cost in edges:
        out[u].append((v, cost))

    def walk(v, length, used):
        if length < best[v]:
            best[v] = length
        if used == k:
            return
        for w, cost in out[v]:
            walk(w, length + cost, used + 1)

    walk(s, 0, 0)
    return best


def brute_simple_paths(n, edges, s):
    """같은 정점을 두 번 지나지 않는 모든 길의 최솟값."""
    best = [INF] * (n + 1)
    out = {u: [] for u in range(1, n + 1)}
    for u, v, cost in edges:
        out[u].append((v, cost))

    def walk(v, length, seen):
        if length < best[v]:
            best[v] = length
        for w, cost in out[v]:
            if w not in seen:
                walk(w, length + cost, seen | {w})

    walk(s, 0, {s})
    return best


def has_negative_cycle_anywhere(n, edges):
    """플로이드 표의 대각선으로 음수 사이클을 찾는다. (있는가, 표)"""
    c = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        c[i][i] = 0
    for u, v, cost in edges:
        c[u][v] = min(c[u][v], cost)
    for k in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if c[i][k] + c[k][j] < c[i][j]:
                    c[i][j] = c[i][k] + c[k][j]
    return any(c[i][i] < 0 for i in range(1, n + 1)), c


def random_digraph(rng, n, low, high):
    edges = []
    for u in range(1, n + 1):
        for v in range(1, n + 1):
            if u != v and rng.random() < 0.45:
                edges.append((u, v, rng.randint(low, high)))
    rng.shuffle(edges)
    return edges


def main():
    # 1. 슬라이드 예제의 표
    d, p, looked = bellman_ford_table(SLIDE_N, SLIDE_EDGES, 1)
    want_d = [
        [0, INF, INF, INF, INF, INF],
        [0, 3, INF, 7, INF, INF],
        [0, 3, 7, 7, 16, 8],
        [0, 2, 7, 7, 10, 8],
        [0, 2, 6, 7, 10, 8],
        [0, 2, 6, 7, 9, 8],
    ]
    want_p = [
        [None, None, None, None, None, None],
        [None, 1, None, 1, None, None],
        [None, 1, 2, 1, 4, 4],
        [None, 6, 2, 1, 3, 4],
        [None, 6, 2, 1, 3, 4],
        [None, 6, 2, 1, 3, 4],
    ]
    for k in range(6):
        assert d[k][1:] == want_d[k], (k, d[k][1:])
        assert p[k][1:] == want_p[k], (k, p[k][1:])
    assert path_from(p[5], 1, 5) == [1, 4, 6, 2, 3, 5]
    assert 7 + 1 - 6 + 4 + 3 == 9 == d[5][5]
    assert looked == 5 * 9                                   # 7. (n - 1) x e
    print("[OK] 슬라이드 표: d(v, 5) = 0 2 6 7 9 8, p(v, 5) = - 6 2 1 3 4, 길 1 4 6 2 3 5(길이 9), 간선 45번 봄")

    # 2. 다익스트라가 틀리는 것
    dj = dijkstra_no_reopen(SLIDE_N, SLIDE_EDGES, 1)
    assert dj[1:] == [0, 3, 7, 7, 10, 8] and d[5][1:] == [0, 2, 6, 7, 9, 8]
    print("[OK] 같은 그래프에서 다익스트라는 0 3 7 7 10 8을 낸다: 정점 2, 3, 5가 틀린다")

    # 오해 반례: 모든 간선에 6을 더해 음수를 없애고 다익스트라를 쓰면 길이 달라진다
    shifted = [(u, v, cost + 6) for u, v, cost in SLIDE_EDGES]
    assert min(cost for _, _, cost in shifted) == 0
    ds, ps, _ = bellman_ford_table(SLIDE_N, shifted, 1)
    assert dijkstra_no_reopen(SLIDE_N, shifted, 1) == ds[5]          # 음수가 없으니 다익스트라도 맞다
    assert path_from(ps[5], 1, 2) == [1, 2] and ds[5][2] == 3 + 6     # 바꾼 그래프의 가장 싼 길: 1 2
    assert path_from(p[5], 1, 2) == [1, 4, 6, 2] and d[5][2] == 2     # 원래 그래프의 가장 싼 길: 1 4 6 2
    assert (7 + 6) + (1 + 6) + (-6 + 6) == 20 > 9                     # 간선 셋짜리 길은 18이 더해진다
    print("[OK] 모든 간선에 6을 더하면 2로 가는 가장 싼 길이 1 4 6 2(원래 2)에서 1 2(원래 3)로 바뀐다")

    # 카드 C1: 정점 4개, 음수 간선 하나
    card = [(1, 2, 4), (1, 3, 5), (3, 2, -3), (2, 4, 2)]
    dc1, pc1, _ = bellman_ford_table(4, card, 1)
    assert [row[1:] for row in dc1] == [[0, INF, INF, INF], [0, 4, 5, INF], [0, 2, 5, 6], [0, 2, 5, 4]]
    assert pc1[3][1:] == [None, 3, 1, 2] and path_from(pc1[3], 1, 4) == [1, 3, 2, 4]
    assert dijkstra_no_reopen(4, card, 1)[1:] == [0, 4, 5, 6]         # 2를 4로 확정한 뒤라 2는 4, 4는 6에 머문다
    print("[OK] 카드 C1: 표 0 4 5 - / 0 2 5 6 / 0 2 5 4, 길 1 3 2 4. 다익스트라는 0 4 5 6으로 2와 4를 틀린다")

    # 5. 슬라이드 예제는 일찍 못 멈춘다
    assert all(d[k] != d[k - 1] for k in range(1, 6))
    print("[OK] 슬라이드 예제는 k = 1 ~ 5 모든 줄이 앞줄과 다르다: n - 1바퀴를 다 돈다")

    # 4. 슬라이드 p.40의 부등식 반례
    chain = [(1, 2, 1), (2, 3, 1), (3, 4, 1), (4, 5, 1)]
    dc, _, _ = bellman_ford_table(5, chain, 1)
    d_in = [INF] * 6
    d_in[1] = 0
    one_pass_in_place(d_in, chain)                           # 간선을 사슬 순서대로 본 한 바퀴
    assert d_in[5] == 4 and dc[2][5] == INF and dc[1][5] == INF
    assert not (dc[2][5] <= d_in[5])                         # d(5, 2) <= d(5)는 거짓
    assert dc[4][5] <= d_in[5] <= dc[1][5]                   # d(5, n-1) <= d(5) <= d(5, 1)은 참
    d_rev = [INF] * 6
    d_rev[1] = 0
    one_pass_in_place(d_rev, chain[::-1])                    # 거꾸로 보면 한 바퀴에 한 칸만 나간다
    assert d_rev[1:] == dc[1][1:]
    print("[OK] 사슬 1->2->3->4->5: 제자리 한 바퀴 뒤 d(5) = 4, d(5, 2) = 무한대. 'd(v, k+1) <= d(v)'는 틀린다")

    # 3, 4, 5, 6. 무작위 그래프
    rng = random.Random(20261012)
    checked, with_cycle, early = 0, 0, 0
    while checked < 600 or with_cycle < 600:
        n = rng.randint(2, 6)
        edges = random_digraph(rng, n, -3, 9)
        negative, floyd = has_negative_cycle_anywhere(n, edges)
        s = rng.randint(1, n)
        if negative:
            if with_cycle >= 600:
                continue
            with_cycle += 1
            # 6. 출발점에서 닿는 음수 사이클이 있으면 n번째 바퀴에서도 줄어든다
            reachable_cycle = any(floyd[s][v] < INF and floyd[v][v] < 0 for v in range(1, n + 1))
            dd = [INF] * (n + 1)
            dd[s] = 0
            for _ in range(n - 1):
                one_pass_in_place(dd, edges)
            assert one_pass_in_place(dd, edges) == reachable_cycle
            continue
        if checked >= 600:
            continue
        checked += 1
        d, p, looked = bellman_ford_table(n, edges, s)
        assert looked == (n - 1) * len(edges)
        for k in range(n):                                    # 3. 점화식의 뜻
            assert d[k][1:] == brute_at_most_k_edges(n, edges, s, k)[1:]
        assert d[n - 1][1:] == brute_simple_paths(n, edges, s)[1:]
        assert d[n - 1][1:] == floyd[s][1:]
        for v in range(1, n + 1):                             # p를 따라간 길의 길이 = d
            if v != s and d[n - 1][v] < INF:
                path = path_from(p[n - 1], s, v)
                cost_of = {}
                for u, w, cost in edges:
                    cost_of[(u, w)] = min(cost, cost_of.get((u, w), INF))
                assert sum(cost_of[(a, b)] for a, b in zip(path, path[1:])) == d[n - 1][v]
        for k in range(1, n):                                 # 5. 한 줄이 그대로면 그 뒤도 그대로
            if d[k] == d[k - 1]:
                assert all(d[j] == d[k - 1] for j in range(k, n))
                early += 1
                break
        dd = [INF] * (n + 1)                                  # 4. 제자리 계산의 범위
        dd[s] = 0
        order = edges[:]
        for k in range(1, n):
            rng.shuffle(order)
            one_pass_in_place(dd, order)
            for v in range(1, n + 1):
                assert d[n - 1][v] <= dd[v] <= d[k][v]
        assert dd == d[n - 1]
        assert one_pass_in_place(dd, edges) is False          # 6. 음수 사이클이 없으면 더 줄지 않는다
    print(f"[OK] 음수 사이클 없는 무작위 600개: d(v, k) = 간선 k개 이하 길의 최솟값(전수), 제자리 값은 d(v, n-1)과 d(v, k) 사이")
    print(f"[OK] 그 가운데 {early}개는 n - 1바퀴 전에 한 줄이 그대로여서 일찍 멈출 수 있었다")
    print("[OK] 음수 사이클 있는 무작위 600개: n번째 바퀴에서 값이 주는 것 = 출발점에서 음수 사이클에 닿는 것")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
