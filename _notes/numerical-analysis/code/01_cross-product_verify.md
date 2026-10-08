---
layout: "note"
title: "01_cross-product_verify.py"
display_title: "01_cross-product_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/cross-product/"
parent_title: "외적"
description: "수치해석 · 외적 검증 코드"
permalink: "/studies/numerical-analysis/code/01_cross-product_verify/"
---
{% raw %}
[외적](/Hongs_Blog/studies/numerical-analysis/cross-product/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외적 문서의 주장 검증. 벡터는 파이썬 튜플(0-based)."""
import math, random


def cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def sub(a, b):
    return tuple(x - y for x, y in zip(a, b))


def det3(m):
    return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
            + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))


def main():
    i, j, k = (1, 0, 0), (0, 1, 0), (0, 0, 1)
    assert cross(i, j) == k and cross(j, k) == i and cross(k, i) == j
    assert cross((1, 2, 3), (4, 5, 6)) == (-3, 6, -3)
    assert cross((1, 0, 2), (0, 3, 0)) == (-6, 0, 3)          # 카드 C2
    random.seed(1)
    for _ in range(1000):
        a = tuple(random.uniform(-5, 5) for _ in range(3)); b = tuple(random.uniform(-5, 5) for _ in range(3))
        c = cross(a, b)
        assert abs(dot(c, a)) < 1e-9 and abs(dot(c, b)) < 1e-9          # 두 벡터에 모두 수직
        assert all(abs(x + y) < 1e-12 for x, y in zip(c, cross(b, a)))  # 순서를 바꾸면 부호가 바뀐다
        # |a×b|² = |a|²|b|² − (a·b)²  ⇒ |a×b| = |a||b|sinθ
        assert abs(dot(c, c) - (dot(a, a) * dot(b, b) - dot(a, b) ** 2)) < 1e-6
        # 행렬식 꼴: 첫 행에 a×b의 성분을 넣으면 c·x = det[x; a; b]
        x = tuple(random.uniform(-5, 5) for _ in range(3))
        assert abs(dot(c, x) - det3([x, a, b])) < 1e-6
    assert cross((2, 4, 6), (1, 2, 3)) == (0, 0, 0)                       # 평행하면 0
    # 결합법칙이 깨지는 예 (카드 C4)
    assert cross(cross(i, i), j) == (0, 0, 0) and cross(i, cross(i, j)) == (0, -1, 0)
    # 삼각형 넓이와 평면의 법선
    p, q, r = (0, 0, 0), (2, 0, 0), (0, 3, 0)
    c = cross(sub(q, p), sub(r, p)); assert math.sqrt(dot(c, c)) / 2 == 3
    p, q, r = (1, 0, 0), (0, 1, 0), (0, 0, 1)
    assert cross(sub(q, p), sub(r, p)) == (1, 1, 1)
    # 2차원에서 꺾는 방향: z 성분의 부호
    assert cross((1, 0, 0), (1, 1, 0))[2] > 0 and cross((1, 0, 0), (1, -1, 0))[2] < 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
