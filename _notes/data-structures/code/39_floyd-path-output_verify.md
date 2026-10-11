---
layout: "note"
title: "39_floyd-path-output_verify.py"
display_title: "39_floyd-path-output_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/floyd-path-output/"
parent_title: "플로이드 알고리즘의 경로 출력"
description: "자료구조 · 플로이드 알고리즘의 경로 출력 검증 코드"
permalink: "/studies/data-structures/code/39_floyd-path-output_verify/"
---
{% raw %}
[플로이드 알고리즘의 경로 출력](/Hongs_Blog/studies/data-structures/floyd-path-output/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""플로이드 알고리즘의 경로 출력 검증.

문서: 1-2학기/자료구조/3.개념집/39.플로이드 알고리즘의 경로 출력.md
출처: 자료구조 12주차 슬라이드 p.61~70. 전수 비교는 에이전트 보충.
실행: python3 39_floyd-path-output_verify.py
정점 번호는 1부터다. C 구현(39_floyd-path-output_impl.c)과 같은 알고리즘을 다시 짜서 넓게 확인한다.

확인하는 것
  1. 슬라이드의 정점 8개 그래프: 비용 표, kay 표, 1에서 7로 가는 길 1 4 2 5 8 6 7(길이 14)과
     슬라이드 p.66~69가 읽는 kay 값 일곱 개. 3에서 1로 가는 길 3 6 7 1(길이 12, 부른 횟수 5).
  2. 무작위 방향 그래프 400개(정점 2~7, 비용 0 이상)와 음수 간선이 섞인 400개(음수 사이클 없음)의 모든 쌍에서
     - 되짚은 길의 간선이 모두 그래프에 있고, 비용의 합이 c(i, j)다.
     - c(i, j) = 같은 정점을 두 번 지나지 않는 모든 길의 최솟값(전수).
     - kay(i, j) = 되짚은 길의 중간 정점 가운데 가장 큰 번호. 중간 정점이 없으면 0.
     - 되짚은 길은 같은 정점을 두 번 지나지 않는다.
     - 길이 없으면 c는 무한대, kay는 0.
  3. outputPath가 자기를 부르는 횟수는 2 x (길의 간선 수) - 1번이다.
"""
import random

INF = float("inf")

SLIDE = [
    [0, 7, 5, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0],
    [0, 7, 0, 0, 9, 9, 0, 0],
    [0, 5, 0, 0, 0, 0, 16, 0],
    [0, 0, 0, 4, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [2, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 2, 4, 0],
]
SLIDE_C = [
    [0, 6, 5, 1, 10, 13, 14, 11],
    [10, 0, 15, 8, 4, 7, 8, 5],
    [12, 7, 0, 13, 9, 9, 10, 10],
    [15, 5, 20, 0, 9, 12, 13, 10],
    [6, 9, 11, 4, 0, 3, 4, 1],
    [3, 9, 8, 4, 13, 0, 1, 5],
    [2, 8, 7, 3, 12, 6, 0, 4],
    [5, 11, 10, 6, 15, 2, 3, 0],
]
SLIDE_KAY = [
    [0, 4, 0, 0, 4, 8, 8, 5],
    [8, 0, 8, 5, 0, 8, 8, 5],
    [7, 0, 0, 5, 0, 0, 6, 5],
    [8, 0, 8, 0, 2, 8, 8, 5],
    [8, 4, 8, 0, 0, 8, 8, 0],
    [7, 7, 7, 7, 7, 0, 0, 7],
    [0, 4, 1, 1, 4, 8, 0, 0],
    [7, 7, 7, 7, 7, 0, 6, 0],
]


def floyd_with_kay(n, cost0):
    """cost0[i][j]: 간선 비용(없으면 INF, i = j면 0). (c, kay)를 돌려준다."""
    c = [row[:] for row in cost0]
    kay = [[0] * (n + 1) for _ in range(n + 1)]
    for k in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if c[i][j] > c[i][k] + c[k][j]:
                    kay[i][j] = k
                    c[i][j] = c[i][k] + c[k][j]
    return c, kay


def output_path(kay, i, j, out, calls):
    """슬라이드 p.70. 첫 정점 i는 적지 않는다."""
    calls[0] += 1
    if i == j:
        return
    if kay[i][j] == 0:
        out.append(j)
    else:
        output_path(kay, i, kay[i][j], out, calls)
        output_path(kay, kay[i][j], j, out, calls)


def brute_simple_paths(n, cost0, s):
    best = [INF] * (n + 1)

    def walk(v, length, seen):
        if length < best[v]:
            best[v] = length
        for w in range(1, n + 1):
            if w not in seen and cost0[v][w] < INF and w != v:
                walk(w, length + cost0[v][w], seen | {w})

    walk(s, 0, {s})
    return best


def to_cost0(n, rows):
    cost0 = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if i == j:
                cost0[i][j] = 0
            elif rows[i - 1][j - 1]:
                cost0[i][j] = rows[i - 1][j - 1]
    return cost0


def random_cost0(rng, n, low, high):
    cost0 = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        cost0[i][i] = 0
        for j in range(1, n + 1):
            if i != j and rng.random() < 0.4:
                cost0[i][j] = rng.randint(low, high)
    return cost0


def check_all_pairs(n, cost0, c, kay):
    for i in range(1, n + 1):
        truth = brute_simple_paths(n, cost0, i)
        for j in range(1, n + 1):
            assert c[i][j] == truth[j], (i, j, c[i][j], truth[j])
            if c[i][j] == INF:
                assert kay[i][j] == 0
                continue
            out, calls = [], [0]
            output_path(kay, i, j, out, calls)
            path = [i] + out
            assert path[-1] == j
            assert len(set(path)) == len(path)                       # 같은 정점을 두 번 지나지 않는다
            assert all(cost0[a][b] < INF for a, b in zip(path, path[1:]))
            assert sum(cost0[a][b] for a, b in zip(path, path[1:])) == c[i][j]
            middle = path[1:-1]
            assert kay[i][j] == (max(middle) if middle else 0)
            if i != j:
                assert calls[0] == 2 * (len(path) - 1) - 1           # 3. 부르는 횟수


def main():
    # 1. 슬라이드 그래프
    cost0 = to_cost0(8, SLIDE)
    c, kay = floyd_with_kay(8, cost0)
    for i in range(1, 9):
        assert c[i][1:] == SLIDE_C[i - 1], (i, c[i][1:])
        assert kay[i][1:] == SLIDE_KAY[i - 1], (i, kay[i][1:])
    out, calls = [], [0]
    output_path(kay, 1, 7, out, calls)
    assert [1] + out == [1, 4, 2, 5, 8, 6, 7] and c[1][7] == 14
    assert calls[0] == 2 * 6 - 1 == 11
    assert (kay[1][7], kay[1][8], kay[1][5], kay[1][4], kay[4][5], kay[4][2], kay[2][5], kay[5][8], kay[8][7]) \
        == (8, 5, 4, 0, 2, 0, 0, 0, 6)
    assert kay[8][6] == 0 and kay[6][7] == 0
    out3, calls3 = [], [0]
    output_path(kay, 3, 1, out3, calls3)                      # 카드 C1
    assert [3] + out3 == [3, 6, 7, 1] and c[3][1] == 12 == 9 + 1 + 2 and calls3[0] == 5
    assert (kay[3][1], kay[3][7], kay[3][6], kay[6][7], kay[7][1]) == (7, 6, 0, 0, 0)
    edges = sum(1 for i in range(1, 9) for j in range(1, 9) if i != j and cost0[i][j] < INF)
    assert edges == 16
    check_all_pairs(8, cost0, c, kay)
    print("[OK] 슬라이드 그래프: 비용 표, kay 표, 길 1 4 2 5 8 6 7(길이 14, 부른 횟수 11), 64쌍 전수")

    # 2. 무작위
    rng = random.Random(20261012)
    for _ in range(400):
        n = rng.randint(2, 7)
        cost0 = random_cost0(rng, n, 0, 9)
        c, kay = floyd_with_kay(n, cost0)
        check_all_pairs(n, cost0, c, kay)
    print("[OK] 비용 0 이상 무작위 400개: 모든 쌍에서 되짚은 길의 길이 = c(i, j) = 전수 최솟값, kay = 가장 큰 중간 정점")

    done = 0
    while done < 400:
        n = rng.randint(2, 7)
        cost0 = random_cost0(rng, n, -3, 9)
        c, kay = floyd_with_kay(n, cost0)
        if any(c[i][i] < 0 for i in range(1, n + 1)):     # 음수 사이클이 있으면 건너뛴다
            continue
        done += 1
        check_all_pairs(n, cost0, c, kay)
    print("[OK] 음수 간선이 섞인 무작위 400개(음수 사이클 없음): 같은 결과")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
