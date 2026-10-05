---
layout: "note"
title: "04_polynomial_verify.py"
display_title: "04_polynomial_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/polynomial/"
parent_title: "다항식과 방정식"
description: "대학수학 · 다항식과 방정식 검증 코드"
permalink: "/studies/college-math/code/04_polynomial_verify/"
---
{% raw %}
[다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다항식과 방정식 검증.

문서: 04.다항식과 방정식 (예시, 정의, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: p(x) = x^3 - 6x^2 + 11x - 6 = (x-1)(x-2)(x-3). 조립제법으로 (x - 1)을 떼면 x^2 - 5x + 6.
주장 2: 나머지 정리 — p(x)를 (x - a)로 나눈 나머지는 p(a)다 (무작위 다항식으로 확인).
주장 3: 서로 다른 x좌표를 가진 n+1개 점을 지나는 차수 n 이하 다항식은 하나뿐이다
        (라그랑주 보간으로 만든 다항식과, 연립방정식으로 푼 계수가 일치).
주장 4: 호너 방법은 곱셈 n번으로 값을 계산하고, 결과는 전개식과 같다.
주장 5: 근의 공식을 그대로 부동소수점으로 계산하면 b^2 >> 4ac일 때 작은 근이 크게 틀린다.
"""
import random
from fractions import Fraction as F


def peval(c, x):
    """c[i]는 x^i의 계수."""
    return sum(ci * x ** i for i, ci in enumerate(c))


def synthetic_division(c, a):
    """(x - a)로 나눈 몫(낮은 차수부터)과 나머지."""
    hi = list(reversed(c))           # 높은 차수부터
    out = [hi[0]]
    for coef in hi[1:]:
        out.append(coef + a * out[-1])
    rem = out.pop()
    return list(reversed(out)), rem


def horner(c, x):
    acc, mults = 0, 0
    for i, coef in enumerate(reversed(c)):
        if i:
            acc *= x
            mults += 1
        acc += coef
    return acc, mults


def lagrange_coeffs(pts):
    n = len(pts)
    coeffs = [F(0)] * n
    for i, (xi, yi) in enumerate(pts):
        basis = [F(1)]
        denom = F(1)
        for j, (xj, _) in enumerate(pts):
            if j == i:
                continue
            basis = [F(0)] + basis                      # x * basis
            for t in range(len(basis) - 1):
                basis[t] -= xj * basis[t + 1]
            denom *= xi - xj
        for t in range(n):
            coeffs[t] += yi * basis[t] / denom
    return coeffs


def solve_vandermonde(pts):
    n = len(pts)
    A = [[F(x) ** j for j in range(n)] + [F(y)] for x, y in pts]
    for col in range(n):
        piv = next(r for r in range(col, n) if A[r][col] != 0)
        A[col], A[piv] = A[piv], A[col]
        for r in range(n):
            if r != col and A[r][col] != 0:
                m = A[r][col] / A[col][col]
                A[r] = [a - m * b for a, b in zip(A[r], A[col])]
    return [A[i][n] / A[i][i] for i in range(n)]


def main():
    p = [-6, 11, -6, 1]
    assert [x for x in range(-10, 11) if peval(p, x) == 0] == [1, 2, 3]
    q, r = synthetic_division(p, 1)
    assert q == [6, -5, 1] and r == 0
    print("[OK] 예시: x^3 - 6x^2 + 11x - 6 = (x-1)(x^2 - 5x + 6), 근 1, 2, 3")

    rng = random.Random(4)
    for _ in range(2000):
        c = [rng.randint(-9, 9) for _ in range(rng.randint(1, 7))]
        a = rng.randint(-6, 6)
        qq, rr = synthetic_division(c, a)
        assert rr == peval(c, a)
        # p(x) = (x - a)q(x) + r 를 여러 점에서 확인
        for x in range(-3, 4):
            assert peval(c, x) == (x - a) * peval(qq, x) + rr
    print("[OK] 나머지 정리: 무작위 다항식 2,000개에서 나머지 = p(a)")

    c1 = [6, -5, -2, 1]  # 카드 C1: x^3 - 2x^2 - 5x + 6
    assert sorted(x for x in range(-10, 11) if peval(c1, x) == 0) == [-2, 1, 3]
    print("[OK] 카드 C1: x^3 - 2x^2 - 5x + 6의 근 -2, 1, 3")

    for _ in range(300):
        n = rng.randint(1, 6)
        xs = rng.sample(range(-20, 21), n + 1)
        pts = [(F(x), F(rng.randint(-50, 50))) for x in xs]
        a1, a2 = lagrange_coeffs(pts), solve_vandermonde(pts)
        assert a1 == a2
        assert all(peval(a1, x) == y for x, y in pts)
    print("[OK] 보간의 유일성: 무작위 300세트에서 두 방법의 계수가 일치")

    val, mults = horner([-5, 4, -3, 2], 2)  # 카드 C3: 2x^3 - 3x^2 + 4x - 5 at x = 2
    assert val == 7 == peval([-5, 4, -3, 2], 2) and mults == 3
    steps = []
    acc = 0
    for i, coef in enumerate([2, -3, 4, -5]):
        acc = acc * 2 + coef if i else coef
        steps.append(acc)
    assert steps == [2, 1, 6, 7]
    print("[OK] 카드 C3: 호너 2 -> 1 -> 6 -> 7, 곱셈 3번")

    import math
    a, b, c = 1.0, 1e8, 1.0
    naive = (-b + math.sqrt(b * b - 4 * a * c)) / (2 * a)
    x1 = (-b - math.copysign(math.sqrt(b * b - 4 * a * c), b)) / (2 * a)
    stable = c / (a * x1)
    true_small = -1.00000000000000000001e-8  # 정확한 값: 약 -1e-8 (다음 항 -1e-24)
    rel_naive = abs((naive - true_small) / true_small)
    rel_stable = abs((stable - true_small) / true_small)
    print(f"     naive = {naive:.6e}, stable = {stable:.6e}, 상대오차 {rel_naive:.2f} vs {rel_stable:.1e}")
    assert rel_naive > 0.2 and rel_stable < 1e-15
    print("[OK] 오해: b = 1e8일 때 그대로 쓴 근의 공식의 작은 근은 20% 넘게 틀리고, 안정된 공식은 정확하다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
