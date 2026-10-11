---
layout: "note"
title: "11_riemann-integral_verify.py"
display_title: "11_riemann-integral_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/riemann-integral/"
parent_title: "정적분과 리만 합"
description: "미분적분학 · 정적분과 리만 합 검증 코드"
permalink: "/studies/calculus/code/11_riemann-integral_verify/"
---
{% raw %}
[정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""정적분과 리만 합 검증.

문서: 11.정적분과 리만 합 (예시, 정의, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: v(t) = t²의 [0, 3] 왼쪽·오른쪽 끝 합 표(n = 3, 6, 30, 300)와 극한 9. 닫힌 꼴 R_n = 9(n+1)(2n+1)/(2n²).
주장 2: 예제 ∫_0^1 x dx의 R_n = (n+1)/(2n) -> 1/2 (유리수로 정확히).
주장 3: 카드 C2: x²의 [0, 2] 4등분 합 1.75, 3.75, 참값 8/3, 차 2.
주장 4: 증가함수에서 R_n - L_n = (f(b) - f(a))(b - a)/n (무작위 증가함수 200개, 유리수로 정확히).
주장 5: 계단 함수 floor x의 [0, 3] 적분 3, 리만 합이 3으로 모임.
주장 6: 디리클레 함수는 유리수 점을 고르면 합이 b - a, 무리수 점을 고르면 0 (구성으로).
주장 7: 오해: ∫_0^{2π} sin = 0, ∫_0^{2π} |sin| = 4 (심프슨).
주장 8: 오차 차수(실험): n을 두 배로 하면 왼쪽 끝 오차 약 1/2, 중점·사다리꼴 약 1/4, 심프슨 약 1/16.
"""
import math
import random
from fractions import Fraction as F


def riemann(f, a, b, n, shift):
    dx = (b - a) / n
    return sum(f(a + (i + shift) * dx) for i in range(n)) * dx


def simpson(f, a, b, n):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    sq = lambda x: x * x
    table = {3: (5, 14), 6: (6.875, 11.375), 30: (8.555, 9.455), 300: (8.95505, 9.04505)}
    for n, (L, R) in table.items():
        Le, Re = riemann(lambda x: x * x, F(0), F(3), n, 0), riemann(lambda x: x * x, F(0), F(3), n, 1)
        assert Re == F(9 * (n + 1) * (2 * n + 1), 2 * n * n) and Le == F(9 * (n - 1) * (2 * n - 1), 2 * n * n)
        assert abs(float(Le) - L) < 1e-9 and abs(float(Re) - R) < 1e-9
    assert abs(float(riemann(sq, F(0), F(3), 10 ** 4, 1)) - 9) < 2e-3
    print("[OK] 주장 1: 예시 표와 극한 9")

    for n in (1, 2, 10, 1000):
        assert riemann(lambda x: x, F(0), F(1), n, 1) == F(n + 1, 2 * n)
    print("[OK] 주장 2: 예제 (n+1)/(2n)")

    L, R = riemann(sq, F(0), F(2), 4, 0), riemann(sq, F(0), F(2), 4, 1)
    assert (L, R) == (F(7, 4), F(15, 4)) and L < F(8, 3) < R and R - L == 2
    print("[OK] 주장 3·카드 C2")

    rng = random.Random(11)
    for _ in range(200):
        steps = [F(rng.randint(0, 9), rng.randint(1, 5)) for _ in range(6)]
        cum = [sum(steps[:k + 1]) for k in range(6)]  # 증가하는 조각 값
        a, b = F(0), F(rng.randint(1, 5))
        f = lambda x, a=a, b=b, cum=cum: cum[min(5, int((x - a) / (b - a) * 6))] + x
        n = rng.choice([6, 12, 30])
        diff = riemann(f, a, b, n, 1) - riemann(f, a, b, n, 0)
        assert diff == (f(b) - f(a)) * (b - a) / n
    print("[OK] 주장 4·카드 C4: R_n - L_n = (f(b) - f(a))Δx")

    fl = lambda x: math.floor(x)
    assert abs(riemann(fl, 0, 3, 3000, 0.5) - 3) < 1e-9
    print("[OK] 주장 5: 계단 함수 3")

    for n in (1, 7, 100):
        a, b = F(0), F(1)
        dx = (b - a) / n
        rational_pts = [a + i * dx for i in range(n)]              # 유리수 -> 값 1
        irr_pts = [(a + i * dx, dx / 2) for i in range(n)]          # a + i·dx + (dx/2)·√2: 무리수 -> 값 0
        S_rat = sum(1 * dx for _ in rational_pts)
        S_irr = sum(0 * dx for _ in irr_pts)
        assert S_rat == b - a and S_irr == 0
    print("[OK] 주장 6·카드 C3: 디리클레 함수의 합은 1과 0으로 갈린다")

    assert abs(simpson(math.sin, 0, 2 * math.pi, 1000)) < 1e-12
    assert abs(simpson(lambda x: abs(math.sin(x)), 0, 2 * math.pi, 1000) - 4) < 1e-9
    assert abs(simpson(math.sin, 0, math.pi, 100) - 2) < 1e-7
    print("[OK] 주장 7·오해: sin의 0과 |sin|의 4")

    ex = math.e - 1
    ratio = lambda g: abs(g(64) - ex) / abs(g(128) - ex)
    rl = ratio(lambda n: riemann(math.exp, 0, 1, n, 0))
    rm = ratio(lambda n: riemann(math.exp, 0, 1, n, 0.5))
    dxs = lambda n: 1 / n
    rt = ratio(lambda n: dxs(n) * (0.5 * math.exp(0) + sum(math.exp(i / n) for i in range(1, n)) + 0.5 * math.e))
    rs = abs(simpson(math.exp, 0, 1, 16) - ex) / abs(simpson(math.exp, 0, 1, 32) - ex)
    assert 1.9 < rl < 2.1 and 3.9 < rm < 4.1 and 3.9 < rt < 4.1 and 15 < rs < 17
    print(f"[OK] 주장 8: 오차 비 왼쪽 {rl:.2f}, 중점 {rm:.2f}, 사다리꼴 {rt:.2f}, 심프슨 {rs:.2f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
