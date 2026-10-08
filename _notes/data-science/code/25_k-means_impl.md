---
layout: "note"
title: "25_k-means_impl.py"
display_title: "25_k-means_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "25"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/k-means/"
parent_title: "k-평균"
description: "데이터 과학 · k-평균 구현 코드"
permalink: "/studies/data-science/code/25_k-means_impl/"
---
{% raw %}
[k-평균](/Hongs_Blog/studies/data-science/k-means/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""k-평균(로이드 알고리즘) 구현과 자체 테스트.

문서: 25.k-평균 (예시, 의사코드, 실행 추적, 정확성, 카드), 4.연습문제/25.k-평균 예제 사다리
출처: 데이터 과학 7회 슬라이드 7-1 p.8~13, p.17
목적 함수: J = Σ_i Σ_α [z_i]_α ||x_i - μ_α||²  (z_i는 한 칸만 1인 소속 벡터)
주장:
  1. 배정 단계와 갱신 단계는 각각 J를 늘리지 않는다 -> J는 단조 감소하고 유한 번 안에 멈춘다 (무작위 200회).
  2. 멈춘 답이 가장 좋은 답(전역 최소)이라는 보장은 없다: 초기값에 따라 J가 다른 답에 멈추는 예.
  3. k를 늘리면 최적 J는 줄어든다. k = n이면 J = 0.
  4. 1차원 추적: 점 1, 2, 3, 8, 9, 10, 25, 처음 중심 1, 2 -> J 679, 341.5, 248, 196에서 멈춤, 중심 2와 13.
     25가 둘째 중심을 끌어당겼다. 같은 자료의 최적 J는 77.5({1..10} / {25}).
"""
import random
from itertools import product


def d2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def assign(X, C):
    return [min(range(len(C)), key=lambda j: (d2(x, C[j]), j)) for x in X]


def update(X, lab, C):
    out = []
    for j in range(len(C)):
        pts = [x for x, l in zip(X, lab) if l == j]
        out.append(tuple(sum(c) / len(pts) for c in zip(*pts)) if pts else C[j])
    return out


def J(X, lab, C):
    return sum(d2(x, C[l]) for x, l in zip(X, lab))


def kmeans(X, C, trace=None, max_iter=100):
    C = [tuple(c) for c in C]
    for _ in range(max_iter):
        lab = assign(X, C)
        if trace is not None:
            trace.append(("배정", lab[:], C[:], J(X, lab, C)))
        newC = update(X, lab, C)
        if trace is not None:
            trace.append(("갱신", lab[:], newC[:], J(X, lab, newC)))
        if newC == C:
            return lab, C
        C = newC
    return lab, C


def best_J(X, k):
    best = None
    for lab in product(range(k), repeat=len(X)):
        if len(set(lab)) < k:
            continue
        C = update(X, list(lab), [X[0]] * k)
        v = J(X, list(lab), C)
        best = v if best is None or v < best else best
    return best


def main():
    X = [(1,), (2,), (3,), (8,), (9,), (10,), (25,)]
    tr = []
    lab, C = kmeans(X, [(1,), (2,)], tr)
    for step, l, c, j in tr:
        print(f"     {step}: 소속 {l}, 중심 {[round(v[0], 2) for v in c]}, J = {j:.2f}")
    assert [c[0] for c in C] == [2.0, 13.0] and J(X, lab, C) == 196
    assert best_J(X, 2) == 77.5      # {1,2,3,8,9,10} / {25}: 멈춘 답은 가장 좋은 답이 아니다
    js = [t[3] for t in tr]
    assert all(a >= b - 1e-9 for a, b in zip(js, js[1:]))
    print("[OK] 1차원 추적: J가 단계마다 줄거나 그대로")

    rnd = random.Random(0)
    for _ in range(200):
        X2 = [(rnd.uniform(0, 10), rnd.uniform(0, 10)) for _ in range(rnd.randint(5, 15))]
        k = rnd.randint(2, 4)
        tr2 = []
        kmeans(X2, rnd.sample(X2, k), tr2)
        js = [t[3] for t in tr2]
        assert all(a >= b - 1e-9 for a, b in zip(js, js[1:]))
    print("[OK] 무작위 200회: J 단조 감소, 유한 번 안에 멈춤")

    # 국소 최적: 네 점 정사각형 (0,0),(0,1),(4,0),(4,1)
    sq = [(0, 0), (0, 1), (4, 0), (4, 1)]
    l1, c1 = kmeans(sq, [(0, 0), (4, 0)]); l2, c2 = kmeans(sq, [(0, 0), (0, 1)])
    j1, j2 = J(sq, l1, c1), J(sq, l2, c2)
    assert j1 == 1.0 and j2 == 16.0 and best_J(sq, 2) == 1.0
    print(f"[OK] 초기값에 따라 J = {j1} (전역 최소) 또는 {j2} (국소 최적)에서 멈춘다")

    X3 = [(0,), (2,), (4,), (10,), (12,)]
    l3, c3 = kmeans(X3, [(0,), (4,)])
    assert [c[0] for c in c3] == [2.0, 11.0] and J(X3, l3, c3) == 10
    print("[OK] 카드 C2: 중심 2, 11, J = 10")

    small = [(1,), (2,), (4,), (7,), (8,)]
    bests = [best_J(small, k) for k in range(1, 6)]
    assert all(a >= b for a, b in zip(bests, bests[1:])) and bests[-1] == 0
    print("[OK] k = 1..5의 최적 J:", [round(b, 2) for b in bests], "(k = n이면 0)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
