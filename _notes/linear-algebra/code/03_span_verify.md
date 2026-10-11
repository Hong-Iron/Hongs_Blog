---
layout: "note"
title: "03_span_verify.py"
display_title: "03_span_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/span/"
parent_title: "선형결합과 생성"
description: "선형대수학 · 선형결합과 생성 검증 코드"
permalink: "/studies/linear-algebra/code/03_span_verify/"
---
{% raw %}
[선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형결합과 생성 검증.

문서: 03.선형결합과 생성 (예시, 정의, 표, 예제, 카드 C1~C3)
주장 1: 예시·카드 C1 — (3, 5) = 1·(1, 1) + 2·(1, 2). 두 벡터로 평면의 무작위 점 500개에 도달(2×2 풀이, 유리수).
주장 2: (1, 2), (2, 4)의 결합은 모두 y = 2x 위.
주장 3: 예제 — (1, 3, 5) = v1 + 2 v2, (1, 3, 6)은 생성 밖(앞 두 식의 해가 셋째 식을 어김).
주장 4: 생성은 원점을 포함하고 덧셈·스칼라배에 닫혀 있다(무작위 결합).
주장 5: 카드 C3 — (2,4,6) = 2(1,2,3), (1,2,3)과 (0,1,0)은 평행하지 않음(외적이 0이 아님).
"""
import random
from fractions import Fraction as F


def comb(cs, vs):
    return tuple(sum(c * v[i] for c, v in zip(cs, vs)) for i in range(len(vs[0])))


def main():
    a, b = (1, 1), (1, 2)
    assert comb((1, 2), (a, b)) == (3, 5)
    rng = random.Random(3)
    for _ in range(500):
        x, y = F(rng.randint(-50, 50), rng.randint(1, 7)), F(rng.randint(-50, 50), rng.randint(1, 7))
        d = y - x          # c + d = x, c + 2d = y
        c = x - d
        assert comb((c, d), (a, b)) == (x, y)
    print("[OK] 주장 1·카드 C1")

    for _ in range(500):
        c, d = F(rng.randint(-20, 20), 3), F(rng.randint(-20, 20), 7)
        px, py = comb((c, d), ((1, 2), (2, 4)))
        assert py == 2 * px
    print("[OK] 주장 2: 직선 위")

    v1, v2 = (1, 1, 1), (0, 1, 2)
    assert comb((1, 2), (v1, v2)) == (1, 3, 5)
    c1 = 1
    c2 = 3 - c1
    assert c1 + 2 * c2 == 5 and c1 + 2 * c2 != 6
    print("[OK] 주장 3: 예제")

    vs = [(1, 2, 3), (0, 1, 4), (2, -1, 0)]
    for _ in range(300):
        cs1 = [F(rng.randint(-9, 9)) for _ in vs]
        cs2 = [F(rng.randint(-9, 9)) for _ in vs]
        k = F(rng.randint(-9, 9), 5)
        s = tuple(p + q for p, q in zip(comb(cs1, vs), comb(cs2, vs)))
        assert s == comb([p + q for p, q in zip(cs1, cs2)], vs)
        assert tuple(k * p for p in comb(cs1, vs)) == comb([k * p for p in cs1], vs)
    assert comb([0, 0, 0], vs) == (0, 0, 0)
    print("[OK] 주장 4·카드 C2: 원점 포함, 닫힘")

    u, w = (1, 2, 3), (0, 1, 0)
    assert (2, 4, 6) == tuple(2 * p for p in u)
    cross = (u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0])
    assert cross != (0, 0, 0)
    print("[OK] 주장 5·카드 C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
