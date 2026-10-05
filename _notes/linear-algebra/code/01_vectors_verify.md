---
layout: "note"
title: "01_vectors_verify.py"
display_title: "01_vectors_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/vectors/"
parent_title: "벡터"
description: "선형대수학 · 벡터 검증 코드"
permalink: "/studies/linear-algebra/code/01_vectors_verify/"
---
{% raw %}
[벡터](/Hongs_Blog/studies/linear-algebra/vectors/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""벡터 검증.

문서: 01.벡터 (예시, 정의, 여덟 법칙, 화살표와 목록, 예제, 카드 C1~C3)
주장 1: 예시 — (1, 2) + (3, 4) = (4, 6), 2(3, 4) = (6, 8), (3, 4) + (-1, 0) = (2, 4).
주장 2: 크기 5, 각 atan2(4, 3) = 53.13°로 만든 벡터가 (3, 4).
주장 3: 여덟 법칙 — 무작위 유리수 벡터 1000쌍에서 정확히 성립.
주장 4: 예제·카드 C1 — 2u - 3v = (1, -14, 6).
주장 5: 카드 C2 — (2cos60°, 2sin60°) = (1, √3), -1.5배는 길이 3, 방향 240°.
주장 6: 카드 C3 — 원점을 a만큼 옮기면 P + Q는 2a만큼, (P + Q)/2는 a만큼 바뀐다(아핀 결합만 좌표계와 무관).
"""
import math
import random
from fractions import Fraction as F


def add(u, v):
    return tuple(a + b for a, b in zip(u, v))


def smul(c, v):
    return tuple(c * a for a in v)


def main():
    assert add((1, 2), (3, 4)) == (4, 6) and smul(2, (3, 4)) == (6, 8) and add((3, 4), (-1, 0)) == (2, 4)
    print("[OK] 주장 1: 예시")

    th = math.atan2(4, 3)
    assert abs(math.degrees(th) - 53.13) < 0.01
    assert abs(5 * math.cos(th) - 3) < 1e-12 and abs(5 * math.sin(th) - 4) < 1e-12
    print("[OK] 주장 2: 크기와 방향")

    rng = random.Random(1)
    rv = lambda n: tuple(F(rng.randint(-20, 20), rng.randint(1, 9)) for _ in range(n))
    for _ in range(1000):
        n = rng.randint(1, 6)
        u, v, w = rv(n), rv(n), rv(n)
        c, d = F(rng.randint(-9, 9), rng.randint(1, 5)), F(rng.randint(-9, 9), rng.randint(1, 5))
        z = tuple(F(0) for _ in range(n))
        assert add(u, v) == add(v, u) and add(add(u, v), w) == add(u, add(v, w))
        assert add(v, z) == v and add(v, smul(-1, v)) == z
        assert smul(c, add(u, v)) == add(smul(c, u), smul(c, v))
        assert smul(c + d, v) == add(smul(c, v), smul(d, v)) and smul(c, smul(d, v)) == smul(c * d, v) and smul(1, v) == v
    print("[OK] 주장 3: 여덟 법칙")

    u, v = (2, -1, 3), (1, 4, 0)
    assert add(smul(2, u), smul(-3, v)) == (1, -14, 6)
    print("[OK] 주장 4·카드 C1")

    w = (2 * math.cos(math.radians(60)), 2 * math.sin(math.radians(60)))
    assert abs(w[0] - 1) < 1e-12 and abs(w[1] - math.sqrt(3)) < 1e-12
    x = smul(-1.5, w)
    assert abs(math.hypot(*x) - 3) < 1e-12 and abs(math.degrees(math.atan2(x[1], x[0])) % 360 - 240) < 1e-9
    print("[OK] 주장 5·카드 C2")

    for _ in range(200):
        P, Q, a = rv(3), rv(3), rv(3)
        P2, Q2 = add(P, a), add(Q, a)
        assert add(P2, Q2) == add(add(P, Q), smul(2, a))
        assert smul(F(1, 2), add(P2, Q2)) == add(smul(F(1, 2), add(P, Q)), a)
    print("[OK] 주장 6·카드 C3: 아핀 결합")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
