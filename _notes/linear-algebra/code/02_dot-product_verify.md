---
layout: "note"
title: "02_dot-product_verify.py"
display_title: "02_dot-product_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/dot-product/"
parent_title: "내적과 노름"
description: "선형대수학 · 내적과 노름 검증 코드"
permalink: "/studies/linear-algebra/code/02_dot-product_verify/"
---
{% raw %}
[내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""내적과 노름 검증.

문서: 02.내적과 노름 (예시, 정의, 동치 정의, 부등식, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — (5,1,0)·(4,2,0) = 22, (5,1,0)·(0,1,5) = 1, cos ≈ 0.965, 각 ≈ 15°.
주장 2: 예제·카드 C2 — (1,1,0), (1,0,1)의 각 60°.
주장 3: 대수적 정의 = 기하적 정의 — 평면에서 극좌표로 만든 벡터(각을 알고 있음), 공간에서 코사인 법칙으로 잰 각.
주장 4: 코시–슈바르츠·삼각부등식 — 무작위 1만 쌍, 스칼라배에서 등호.
주장 5: 성질 — 대칭, 선형, v·v >= 0 (유리수로 정확히).
주장 6: 해당하는 예 — (1,2)·(-2,1) = 0, (1,1)·(2,2) = 4 = √2·2√2, (1,0)·(-3,0) = -3.
주장 7: 오해·카드 C4 — q = (1,0): 내적 10 vs 1, 코사인 0.995 vs 1, 각 5.7°.
주장 8: 활용 — 1000차원 무작위 가우스 벡터 쌍의 코사인 표준편차 ≈ 1/√1000 ≈ 0.032(실험).
"""
import math
import random
from fractions import Fraction as F


def dot(u, v):
    return sum(a * b for a, b in zip(u, v))


def norm(v):
    return math.sqrt(dot(v, v))


def main():
    u, v, w = (5, 1, 0), (4, 2, 0), (0, 1, 5)
    assert dot(u, v) == 22 and dot(u, w) == 1
    c = 22 / (math.sqrt(26) * math.sqrt(20))
    assert f"{c:.3f}" == "0.965" and abs(math.degrees(math.acos(c)) - 15) < 0.5
    print("[OK] 주장 1: 예시")

    a, b = (1, 1, 0), (1, 0, 1)
    assert dot(a, b) == 1 and abs(math.degrees(math.acos(dot(a, b) / (norm(a) * norm(b)))) - 60) < 1e-9
    print("[OK] 주장 2·카드 C2: 60°")

    rng = random.Random(2)
    for _ in range(2000):
        r1, r2 = rng.uniform(0.1, 5), rng.uniform(0.1, 5)
        t1, t2 = rng.uniform(0, 2 * math.pi), rng.uniform(0, 2 * math.pi)
        p, q = (r1 * math.cos(t1), r1 * math.sin(t1)), (r2 * math.cos(t2), r2 * math.sin(t2))
        assert abs(dot(p, q) - r1 * r2 * math.cos(t1 - t2)) < 1e-9
        P = [rng.uniform(-3, 3) for _ in range(3)]
        Q = [rng.uniform(-3, 3) for _ in range(3)]
        A, B = norm(P), norm(Q)
        Cc = norm([x - y for x, y in zip(P, Q)])
        cos_law = (A * A + B * B - Cc * Cc) / (2 * A * B)
        assert abs(dot(P, Q) - A * B * cos_law) < 1e-9
    print("[OK] 주장 3·카드 C3: 기하적 정의와 같다")

    for _ in range(10000):
        n = rng.randint(1, 10)
        x = [rng.gauss(0, 1) for _ in range(n)]
        y = [rng.gauss(0, 1) for _ in range(n)]
        assert abs(dot(x, y)) <= norm(x) * norm(y) + 1e-12
        assert norm([p + q for p, q in zip(x, y)]) <= norm(x) + norm(y) + 1e-12
        k = rng.uniform(-3, 3)
        z = [k * p for p in x]
        assert abs(abs(dot(x, z)) - norm(x) * norm(z)) < 1e-9
    print("[OK] 주장 4: 코시–슈바르츠, 삼각부등식, 등호")

    for _ in range(500):
        n = rng.randint(1, 5)
        rv = lambda: [F(rng.randint(-9, 9), rng.randint(1, 4)) for _ in range(n)]
        x, y, z = rv(), rv(), rv()
        s, t = F(rng.randint(-5, 5)), F(rng.randint(-5, 5), 3)
        assert dot(x, y) == dot(y, x)
        assert dot([s * p + t * q for p, q in zip(x, z)], y) == s * dot(x, y) + t * dot(z, y)
        assert dot(x, x) >= 0 and (dot(x, x) == 0) == all(p == 0 for p in x)
    print("[OK] 주장 5: 대칭·선형·양의 정부호")

    assert dot((1, 2), (-2, 1)) == 0 and dot((1, 1), (2, 2)) == 4
    assert abs(math.sqrt(2) * 2 * math.sqrt(2) - 4) < 1e-12 and dot((1, 0), (-3, 0)) == -3
    print("[OK] 주장 6: 해당하는 예")

    q = (1, 0)
    assert dot(q, (10, 1)) == 10 and dot(q, (1, 0)) == 1
    cos_a = 10 / math.sqrt(101)
    assert f"{cos_a:.3f}" == "0.995" and abs(math.degrees(math.acos(cos_a)) - 5.7) < 0.05
    print("[OK] 주장 7·오해·카드 C4")

    n, trials = 1000, 400
    cs = []
    for _ in range(trials):
        x = [rng.gauss(0, 1) for _ in range(n)]
        y = [rng.gauss(0, 1) for _ in range(n)]
        cs.append(dot(x, y) / (norm(x) * norm(y)))
    sd = math.sqrt(sum(cc * cc for cc in cs) / trials)
    assert abs(sd - 1 / math.sqrt(n)) < 0.006 and max(abs(cc) for cc in cs) < 0.15
    print(f"[OK] 주장 8: 1000차원 코사인 표준편차 {sd:.4f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
