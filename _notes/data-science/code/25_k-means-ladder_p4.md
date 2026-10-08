---
layout: "note"
title: "25_k-means-ladder_p4.py"
display_title: "25_k-means-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "25"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/k-means-ladder/"
parent_title: "k-평균 예제 사다리"
description: "데이터 과학 · k-평균 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-science/code/25_k-means-ladder_p4/"
---
{% raw %}
[k-평균 예제 사다리](/Hongs_Blog/studies/data-science/k-means-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""k-평균 예제 사다리 문제 2~4 검증 (문제 1은 3.개념집/25_k-means_impl.py가 확인한다).

문서: 4.연습문제/25.k-평균 예제 사다리
k-평균 구현은 3.개념집/25_k-means_impl.py에서 필요한 부분을 복사했다. 거리가 같으면 앞 번호 중심으로 배정한다.
"""
from fractions import Fraction as Fr


def d2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def kmeans(X, C, log):
    C = [tuple(Fr(v) for v in c) for c in C]
    while True:
        lab = [min(range(len(C)), key=lambda j: (d2(x, C[j]), j)) for x in X]
        newC = []
        for j in range(len(C)):
            pts = [x for x, l in zip(X, lab) if l == j]
            newC.append(tuple(Fr(sum(c), len(pts)) for c in zip(*pts)) if pts else C[j])
        log.append((lab, newC))
        if newC == C:
            return lab, C
        C = newC


def J(X, lab, C):
    return sum(d2(x, C[l]) for x, l in zip(X, lab))


def main():
    X2 = [(1, 1), (1, 2), (2, 1), (5, 4), (5, 5), (6, 5)]
    lg = []
    lab, C = kmeans(X2, [(1, 1), (5, 4)], lg)
    assert lab == [0, 0, 0, 1, 1, 1] and C == [(Fr(4, 3), Fr(4, 3)), (Fr(16, 3), Fr(14, 3))]
    assert J(X2, lab, C) == Fr(8, 3)
    print("[OK] 문제 2: 중심 (4/3, 4/3), (16/3, 14/3), J = 8/3")

    X3 = [(2,), (3,), (4,), (10,), (11,), (12,), (20,), (25,), (30,)]
    lg = []
    lab, C = kmeans(X3, [(2,), (4,), (6,)], lg)
    for l, c in lg:
        print("     ", l, [str(v[0]) for v in c])
    assert [c[0] for c in C] == [3, 11, 25] and J(X3, lab, C) == 2 + 2 + 50
    print("[OK] 문제 3: 중심 3, 11, 25, J = 54")

    X4 = [(0, 0), (0, 2), (6, 0), (6, 2)]
    la, ca = kmeans(X4, [(0, 0), (0, 2)], [])
    lb, cb = kmeans(X4, [(0, 0), (6, 0)], [])
    assert J(X4, la, ca) == 36 and J(X4, lb, cb) == 4
    print("[OK] 문제 4: 처음 중심 (0,0),(0,2) -> J 36 (위·아래), (0,0),(6,0) -> J 4 (왼·오른)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
