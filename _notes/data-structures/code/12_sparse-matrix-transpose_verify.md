---
layout: "note"
title: "12_sparse-matrix-transpose_verify.py"
display_title: "12_sparse-matrix-transpose_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sparse-matrix-transpose/"
parent_title: "희소 행렬의 전치"
description: "자료구조 · 희소 행렬의 전치 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/12_sparse-matrix-transpose_verify/"
---
{% raw %}
[희소 행렬의 전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""희소 행렬 전치의 걸음 수 세기와 무작위 비교.

문서: 1-2학기/자료구조/3.개념집/12.희소 행렬의 전치.md
같은 알고리즘의 C 구현은 12_sparse-matrix-transpose_impl.c에 있다. 여기서는 파이썬으로 다시 짜서 걸음 수를 센다.
행·열 번호는 행렬 표기대로 1부터 센다.

확인하는 것
  1. 문서 예시(4 x 5, 0이 아닌 칸 6개)의 개수 [0, 1, 3, 1, 1], 시작 [0, 0, 1, 4, 5], 결과 목록.
  2. 빠른 전치의 걸음 수가 정확히 2t + 2n - 1이다 (n = 열 수, t = 0이 아닌 칸 수).
     1단계 n + t, 2단계 n - 1, 3단계 t. 행 수 m과는 상관없다.
  3. 느린 전치(열마다 목록 전체 훑기)는 n * t걸음, 2차원 배열 뒤집기는 m * n걸음.
  4. 문서의 표: 500 x 500, t = 1,994일 때 4,987 / 997,000 / 250,000걸음.
  5. 무작위 행렬 1,000개에서 빠른 전치 = 느린 전치 = 2차원 배열 뒤집기.
  6. n과 t를 두 배로 하면 빠른 전치의 걸음 수도 거의 두 배(n + t에 비례).
"""
import random


def to_triples(dense):
    return [(i + 1, j + 1, v) for i, row in enumerate(dense) for j, v in enumerate(row) if v != 0]


def fast_transpose(triples, n):
    """돌려주는 값: (결과 목록, 열별 개수, 처음 시작 위치, 걸음 수)"""
    steps = 0
    size = [0] * (n + 1)
    steps += n                                  # 1단계: 개수 칸 n개를 0으로
    for (_, c, _) in triples:                   # 1단계: 목록을 한 번 훑는다
        size[c] += 1
        steps += 1
    start = [0] * (n + 1)
    for c in range(2, n + 1):                   # 2단계: 앞 행들의 개수를 더한다
        start[c] = start[c - 1] + size[c - 1]
        steps += 1
    first_start = start[1:]
    out = [None] * len(triples)
    cur = start[:]
    for (r, c, v) in triples:                   # 3단계: 한 번 더 훑으며 꽂는다
        out[cur[c]] = (c, r, v)
        cur[c] += 1
        steps += 1
    return out, size[1:], first_start, steps


def slow_transpose(triples, n):
    steps = 0
    out = []
    for c in range(1, n + 1):
        for (r, cc, v) in triples:
            steps += 1
            if cc == c:
                out.append((c, r, v))
    return out, steps


def dense_transpose(dense):
    m, n = len(dense), len(dense[0])
    steps = 0
    out = [[0] * m for _ in range(n)]
    for i in range(m):
        for j in range(n):
            out[j][i] = dense[i][j]
            steps += 1
    return out, steps


def main():
    A = [[0, 0, 3, 0, 4],
         [0, 0, 5, 7, 0],
         [0, 0, 0, 0, 0],
         [0, 2, 6, 0, 0]]
    tri = to_triples(A)
    assert tri == [(1, 3, 3), (1, 5, 4), (2, 3, 5), (2, 4, 7), (4, 2, 2), (4, 3, 6)]
    out, size, start, steps = fast_transpose(tri, 5)
    assert size == [0, 1, 3, 1, 1] and start == [0, 0, 1, 4, 5]
    assert out == [(2, 4, 2), (3, 1, 3), (3, 2, 5), (3, 4, 6), (4, 2, 7), (5, 1, 4)]
    assert steps == 2 * 6 + 2 * 5 - 1 == 21
    slow, slow_steps = slow_transpose(tri, 5)
    assert slow == out and slow_steps == 5 * 6 == 30
    flipped, dense_steps = dense_transpose(A)
    assert to_triples(flipped) == out and dense_steps == 4 * 5 == 20
    print(f"문서 예시: 빠른 전치 {steps}걸음, 느린 전치 {slow_steps}걸음, 2차원 배열 {dense_steps}걸음")

    # 무작위 1,000개: 결과가 같고 걸음 수 식이 맞다
    rng = random.Random(20261012)
    for _ in range(1000):
        m, n = rng.randint(1, 12), rng.randint(1, 12)
        p = rng.choice([0.0, 0.1, 0.3, 0.6, 1.0])
        dense = [[rng.randint(1, 9) if rng.random() < p else 0 for _ in range(n)] for _ in range(m)]
        tri = to_triples(dense)
        t = len(tri)
        out, size, start, steps = fast_transpose(tri, n)
        slow, slow_steps = slow_transpose(tri, n)
        flipped, dense_steps = dense_transpose(dense)
        assert out == slow == to_triples(flipped)
        assert steps == 2 * t + 2 * n - 1
        assert slow_steps == n * t and dense_steps == m * n
        assert sum(size) == t and start == [sum(size[:c]) for c in range(n)]
    print("무작위 1,000개: 세 방법의 결과가 같고, 걸음 수는 2t + 2n - 1, n*t, m*n")

    # 문서의 표: 500 x 500, t = 1,994 (3원소 표현 문서의 크기)
    m = n = 500
    cells = rng.sample(range(m * n), 1994)
    dense = [[0] * n for _ in range(m)]
    for k in cells:
        dense[k // n][k % n] = 1
    tri = to_triples(dense)
    out, _, _, steps = fast_transpose(tri, n)
    slow, slow_steps = slow_transpose(tri, n)
    flipped, dense_steps = dense_transpose(dense)
    assert out == slow == to_triples(flipped)
    assert (steps, slow_steps, dense_steps) == (4987, 997000, 250000)
    print(f"500 x 500, t = 1,994: 빠른 전치 {steps:,} / 느린 전치 {slow_steps:,} / 2차원 배열 {dense_steps:,}걸음")

    # n과 t를 함께 두 배로 하면 걸음 수도 거의 두 배
    prev = None
    for n in (100, 200, 400, 800):
        t = 4 * n
        tri = sorted((rng.randint(1, 50), c, 1) for c in rng.choices(range(1, n + 1), k=t))
        _, _, _, steps = fast_transpose(tri, n)
        assert steps == 2 * t + 2 * n - 1
        if prev is not None:
            assert 1.99 < steps / prev < 2.01
        prev = steps
    # 행 수 m만 키우면 걸음 수는 그대로다
    tri = [(1, 2, 5), (1, 3, 6)]
    assert fast_transpose(tri, 4)[3] == fast_transpose([(900, 2, 5), (999, 3, 6)], 4)[3]
    print("걸음 수는 n + t에 비례하고 행 수와는 상관없다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
