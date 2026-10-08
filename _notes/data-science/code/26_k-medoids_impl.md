---
layout: "note"
title: "26_k-medoids_impl.py"
display_title: "26_k-medoids_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/k-medoids/"
parent_title: "k-메도이드"
description: "데이터 과학 · k-메도이드 구현 코드"
permalink: "/studies/data-science/code/26_k-medoids_impl/"
---
{% raw %}
[k-메도이드](/Hongs_Blog/studies/data-science/k-medoids/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""k-메도이드(슬라이드의 PAM식 갱신) 구현과 자체 테스트.

문서: 26.k-메도이드 (예시, 의사코드, 카드), 27.k-평균과 k-메도이드 비교
출처: 데이터 과학 7회 슬라이드 7-1 p.14~16
갱신: 군집마다 "같은 군집의 다른 점들까지 거리 합"이 가장 작은 점을 새 메도이드로 고른다.
주장:
  1. 점 1, 2, 3, 8, 9, 10, 25 (k = 2, 처음 메도이드 1, 2): k-평균과 달리 25에 끌려가지 않는다.
  2. 메도이드는 늘 실제 자료점이다.
  3. 거리로 유클리드가 아닌 것(맨해튼, 편집 거리 등)도 쓸 수 있다: 문자열 예.
  4. 목적 함수(메도이드까지 거리 합)는 단조 감소한다 (무작위 200회).
  5. 한 번 갱신에 군집 크기 m마다 m² 번 거리 계산이 필요하다.
"""
import random


def kmedoids(X, M, dist, trace=None, max_iter=100):
    M = list(M); calls = [0]

    def d(a, b):
        calls[0] += 1; return dist(a, b)
    for _ in range(max_iter):
        lab = [min(range(len(M)), key=lambda j: (d(x, M[j]), j)) for x in X]
        cost = sum(d(x, M[l]) for x, l in zip(X, lab))
        if trace is not None:
            trace.append((M[:], lab[:], cost))
        newM = []
        for j in range(len(M)):
            pts = [x for x, l in zip(X, lab) if l == j]
            newM.append(min(pts, key=lambda c: sum(d(c, y) for y in pts)) if pts else M[j])  # 같으면 먼저 나온 점
        if newM == M:
            return lab, M, calls[0]
        M = newM
    return lab, M, calls[0]


def edit(a, b):
    dp = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, dp[0] = dp[0], i
        for j, cb in enumerate(b, 1):
            prev, dp[j] = dp[j], min(dp[j] + 1, dp[j - 1] + 1, prev + (ca != cb))
    return dp[-1]


def main():
    X = [1, 2, 3, 8, 9, 10, 25]
    tr = []
    lab, M, _ = kmedoids(X, [1, 2], lambda a, b: abs(a - b), tr)
    for m, l, c in tr:
        print(f"     메도이드 {m}, 소속 {l}, 비용 {c}")
    assert sorted(M) == [2, 9] and lab == [0, 0, 0, 1, 1, 1, 1]
    print("[OK] 메도이드 2와 9. k-평균의 둘째 중심 13과 달리 25에 끌려가지 않는다")
    assert all(m in X for m in M)

    words = ["data", "date", "dated", "mining", "minning", "dining"]
    lab2, M2, _ = kmedoids(words, ["data", "dining"], edit)
    assert sorted(M2) == ["date", "mining"] and lab2 == [0, 0, 0, 1, 1, 1]
    print("[OK] 편집 거리로 단어 군집: 메도이드", M2)

    rnd = random.Random(4)
    for _ in range(200):
        P = [(rnd.randint(0, 20), rnd.randint(0, 20)) for _ in range(rnd.randint(5, 12))]
        k = rnd.randint(2, 3)
        tr = []
        kmedoids(P, rnd.sample(P, k), lambda a, b: abs(a[0] - b[0]) + abs(a[1] - b[1]), tr)
        cs = [t[2] for t in tr]
        assert all(a >= b for a, b in zip(cs, cs[1:]))
    print("[OK] 무작위 200회: 비용 단조 감소 (맨해튼 거리)")

    # 갱신 한 번의 거리 계산 수: 군집 크기 m이면 m²
    m = 100
    pts = list(range(m))
    _, _, calls = kmedoids(pts, [0], lambda a, b: abs(a - b), None, max_iter=1)
    assert calls == m + m + m * m
    print(f"[OK] 한 군집 100점: 배정 100 + 비용 100 + 갱신 10,000 = {calls}번 거리 계산")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
