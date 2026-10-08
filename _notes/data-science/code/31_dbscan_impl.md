---
layout: "note"
title: "31_dbscan_impl.py"
display_title: "31_dbscan_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/dbscan/"
parent_title: "DBSCAN"
description: "데이터 과학 · DBSCAN 구현 코드"
permalink: "/studies/data-science/code/31_dbscan_impl/"
---
{% raw %}
[DBSCAN](/Hongs_Blog/studies/data-science/dbscan/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""DBSCAN 구현과 자체 테스트.

문서: 31.DBSCAN (예시, 의사코드, 실행 추적, 카드)
출처: 데이터 과학 7회 슬라이드 7-2 p.8~13
정의: 이웃 N(p) = {q : d(p, q) <= Eps} (p 자신 포함). |N(p)| >= MinPts면 핵심점.
      핵심점이 아니지만 어떤 핵심점의 이웃이면 경계점, 둘 다 아니면 잡음.
주장:
  1. 1차원 점 1, 2, 3, 4, 10, 11, 12, 20 (Eps 1, MinPts 3): 핵심점 2, 3, 11, 경계점 1, 4, 10, 12, 잡음 20.
     군집 {1, 2, 3, 4}, {10, 11, 12}.
  2. 밀도 도달은 대칭이 아니다: 경계점 1은 핵심점 2에서 도달 가능하지만 2는 1에서 도달 불가(1은 핵심점이 아님).
  3. 결과 군집 = 핵심점들을 "Eps 이내면 잇는" 그래프의 연결 요소 + 그 이웃 경계점 (브루트포스 정의와 무작위 200회 일치, 핵심점·잡음 기준).
  4. 고리 모양 자료: 바깥 고리와 안쪽 덩어리를 DBSCAN은 둘로 나누고, k-평균(k=2)은 나누지 못한다.
  5. 군집 수를 미리 정하지 않는다.
"""
import math
import random


def neighbors(X, i, eps, dist):
    return [j for j in range(len(X)) if dist(X[i], X[j]) <= eps]


def dbscan(X, eps, minpts, dist):
    n = len(X); lab = [None] * n; visited = [False] * n; c = -1
    core = [len(neighbors(X, i, eps, dist)) >= minpts for i in range(n)]
    for i in range(n):
        if visited[i]:
            continue
        visited[i] = True
        if not core[i]:
            lab[i] = -1                       # 일단 잡음, 나중에 경계점이 될 수 있다
            continue
        c += 1; lab[i] = c; stack = [i]
        while stack:
            p = stack.pop()
            for q in neighbors(X, p, eps, dist):
                if lab[q] is None or lab[q] == -1:
                    lab[q] = c
                    if not visited[q]:
                        visited[q] = True
                        if core[q]:
                            stack.append(q)
    return lab, core


def kinds(lab, core):
    return ["핵심" if core[i] else ("잡음" if lab[i] == -1 else "경계") for i in range(len(lab))]


def main():
    d1 = lambda a, b: abs(a - b)
    X = [1, 2, 3, 4, 10, 11, 12, 20]
    lab, core = dbscan(X, 1, 3, d1)
    k = kinds(lab, core)
    print("     ", list(zip(X, k, lab)))
    assert [x for x, t in zip(X, k) if t == "핵심"] == [2, 3, 11]
    assert [x for x, t in zip(X, k) if t == "경계"] == [1, 4, 10, 12] and [x for x, t in zip(X, k) if t == "잡음"] == [20]
    assert lab[:4] == [0] * 4 and lab[4:7] == [1] * 3 and lab[7] == -1
    print("[OK] 1차원 예: 핵심 2, 3, 11 / 경계 1, 4, 10, 12 / 잡음 20, 군집 둘")

    Y = [1, 2, 3, 7, 8, 9, 10, 15]
    lab2, core2 = dbscan(Y, 1, 3, d1); k2 = kinds(lab2, core2)
    assert [y for y, t in zip(Y, k2) if t == "핵심"] == [2, 8, 9] and [y for y, t in zip(Y, k2) if t == "잡음"] == [15]
    assert lab2 == [0, 0, 0, 1, 1, 1, 1, -1]
    print("[OK] 카드 C2: 핵심 2, 8, 9 / 잡음 15 / 군집 {1,2,3}, {7,8,9,10}")

    rnd = random.Random(5)
    d2 = lambda a, b: math.dist(a, b)
    for _ in range(200):
        P = [(rnd.uniform(0, 10), rnd.uniform(0, 10)) for _ in range(rnd.randint(5, 25))]
        eps = rnd.uniform(0.8, 2.5); mp = rnd.randint(2, 5)
        lab, core = dbscan(P, eps, mp, d2)
        # 브루트포스: 핵심점 그래프의 연결 요소
        comp = {}; cid = 0
        for i in range(len(P)):
            if core[i] and i not in comp:
                stack = [i]; comp[i] = cid
                while stack:
                    p = stack.pop()
                    for q in range(len(P)):
                        if core[q] and q not in comp and d2(P[p], P[q]) <= eps:
                            comp[q] = cid; stack.append(q)
                cid += 1
        assert len({lab[i] for i in comp}) == cid
        for i in comp:
            for j in comp:
                assert (comp[i] == comp[j]) == (lab[i] == lab[j])
        for i in range(len(P)):
            if not core[i]:
                near_core = any(core[j] and d2(P[i], P[j]) <= eps for j in range(len(P)))
                assert (lab[i] != -1) == near_core
    print("[OK] 무작위 200회: 핵심점 그래프의 연결 요소와 같고, 경계점·잡음 판정이 정의와 같다")

    ring = [(5 * math.cos(t / 40 * 2 * math.pi), 5 * math.sin(t / 40 * 2 * math.pi)) for t in range(40)]
    blob = [(rnd.uniform(-0.5, 0.5), rnd.uniform(-0.5, 0.5)) for _ in range(15)]
    P = ring + blob
    lab, core = dbscan(P, 1.0, 3, d2)
    assert len(set(lab[:40])) == 1 and len(set(lab[40:])) == 1 and lab[0] != lab[40] and -1 not in lab
    # k-평균 k = 2 (여러 초기값 중 가장 좋은 답)도 고리와 덩어리를 나누지 못한다
    def km(P, C):
        for _ in range(50):
            L = [min(range(2), key=lambda j: math.dist(p, C[j])) for p in P]
            C = [tuple(sum(c) / max(1, L.count(j)) for c in zip(*[p for p, l in zip(P, L) if l == j])) or C[j] for j in range(2)]
        return L
    L = km(P, [P[0], P[45]])
    assert not (len(set(L[:40])) == 1 and len(set(L[40:])) == 1 and L[0] != L[40])
    print("[OK] 고리 + 가운데 덩어리: DBSCAN은 둘로 나누고, k-평균은 나누지 못한다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
