---
layout: "note"
title: "25_master-theorem_verify.py"
display_title: "25_master-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/master-theorem/"
parent_title: "분할 정복 점화식과 마스터 정리"
description: "이산수학 · 분할 정복 점화식과 마스터 정리 검증 코드"
permalink: "/studies/discrete-math/code/25_master-theorem_verify/"
---
{% raw %}
[분할 정복 점화식과 마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""분할 정복 점화식과 마스터 정리 검증.

문서: 25.분할 정복 점화식과 마스터 정리 (예시, 정리, 증명, 예제, 카드 C1~C4, 자주 하는 오해),
      4.연습문제/25.마스터 정리 예제 사다리
방법: n = b^k에서 점화식을 정확히 계산하고, 예측한 Θ(g)에 대해 T(n)/g(n)이 일정한 값으로 모이는지 본다(실험).
주장 1: 2T(n/2) + n -> n lg n, T(n/2) + 1 -> lg n, 3T(n/2) + n -> n^lg3, 4T(n/2) + n -> n²,
        7T(n/2) + n² -> n^lg7, 2T(n/2) + n² -> n², 3T(n/4) + n lg n -> n lg n, 2T(n/4) + √n -> √n lg n.
주장 2: 정리의 다항식판: f(n) = n^d이면 층 비율 r = a/b^d가 1보다 작은지·같은지·큰지로 경우가 갈린다.
주장 3: 2T(n/2) + n/lg n은 세 경우 어디에도 들지 않고 Θ(n lg lg n)이다.
주장 4: T(n) = T(n/3) + T(2n/3) + n은 Θ(n lg n)이다(재귀 트리, 비율이 모임).
주장 5: 예시 표 — n = 16에서 세 점화식의 층별 비용과 합 80, 496, 31.
주장 6: 역의 반례 2T(n/2) + n/lg² n = Θ(n), 오해 2T(n/2) + n lg n = Θ(n lg² n)(정확히 n·k(k+1)/2 + n).
주장 7: 정칙 조건 반례 — T(n/2) + f(n), f는 lg n 짝수면 n², 홀수면 n: T/f가 한없이 커진다.
주장 8: T(n − 1) + n, T(1) = 1은 n(n+1)/2.
주장 9: 사다리 변형 T(n) = 2T(√n) + lg n, m = lg n으로 바꾸면 Θ(lg n lg lg n).
"""
import math
from functools import lru_cache


def exact(a, b, f, k):
    """n = b^k, T(1) = 1."""
    T = 1.0
    vals = [T]
    for j in range(1, k + 1):
        n = b ** j
        T = a * T + f(n)
        vals.append(T)
    return vals


def settles(ratios, tol=0.05):
    tail = ratios[-6:]
    return max(tail) - min(tail) <= tol * max(tail) and min(tail) > 0


def main():
    lg = math.log2
    cases = [
        (2, 2, lambda n: n, lambda n: n * lg(n), 40),
        (1, 2, lambda n: 1, lambda n: lg(n), 60),
        (3, 2, lambda n: n, lambda n: n ** lg(3), 40),
        (4, 2, lambda n: n, lambda n: n * n, 40),
        (7, 2, lambda n: n * n, lambda n: n ** lg(7), 30),
        (2, 2, lambda n: n * n, lambda n: n * n, 40),
        (3, 4, lambda n: n * lg(n), lambda n: n * lg(n), 25),
        (2, 4, lambda n: math.sqrt(n), lambda n: math.sqrt(n) * lg(n), 25),
    ]
    for a, b, f, g, k in cases:
        vals = exact(a, b, f, k)
        ratios = [vals[j] / g(b ** j) for j in range(2, k + 1)]
        assert settles(ratios, 0.08), (a, b, ratios[-6:])
    print("[OK] 주장 1·카드 C2·사다리: 여덟 점화식의 비가 일정한 값으로 모임")

    for a, b, d in ((2, 2, 1), (4, 2, 1), (2, 2, 2), (3, 4, 1), (8, 2, 3)):
        r = a / b ** d
        p = math.log(a, b)
        kind = 1 if d < p - 1e-12 else (2 if abs(d - p) < 1e-12 else 3)
        assert (r > 1) == (kind == 1) and (abs(r - 1) < 1e-12) == (kind == 2) and (r < 1) == (kind == 3)
    print("[OK] 주장 2·카드 C3: r = a/b^d와 경우의 대응")

    vals = exact(2, 2, lambda n: n / lg(n) if n > 1 else 0, 60)
    ratios = [vals[j] / (2 ** j * lg(lg(2 ** j))) for j in range(4, 61)]
    assert 0.5 < ratios[-1] < 1.5 and abs(ratios[-1] - ratios[-10]) < 0.1
    nlgn = [vals[j] / (2 ** j * j) for j in range(4, 61)]
    assert nlgn[-1] < nlgn[10] / 2
    print(f"[OK] 주장 3·카드 C4: T/(n lg lg n) -> {ratios[-1]:.3f}, T/(n lg n)은 계속 줄어듦")

    @lru_cache(maxsize=None)
    def T(n):
        if n <= 2:
            return 1
        return T(n // 3) + T(2 * n // 3) + n
    rs = [T(n) / (n * lg(n)) for n in (10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6)]
    assert max(rs) / min(rs) < 1.3
    print(f"[OK] 주장 4·오해: T(n/3) + T(2n/3) + n의 T/(n lg n) = " + ", ".join(f"{r:.3f}" for r in rs))
    def levels(a, n, f):
        rows, size, cnt = [], n, 1
        while size > 1:
            rows.append(cnt * f(size))
            size //= 2
            cnt *= a
        rows.append(cnt * 1)
        return rows
    L1, L2, L3 = levels(2, 16, lambda m: m), levels(4, 16, lambda m: m), levels(1, 16, lambda m: m)
    assert L1 == [16] * 5 and L2 == [16, 32, 64, 128, 256] and L3 == [16, 8, 4, 2, 1]
    assert (sum(L1), sum(L2), sum(L3)) == (80, 496, 31)
    assert [exact(a, 2, lambda m: m, 4)[-1] for a in (2, 4, 1)] == [80, 496, 31]
    print("[OK] 주장 5: 예시 표 80, 496, 31")

    v = exact(2, 2, lambda m: m / lg(m) ** 2 if m > 1 else 0, 200)
    rs = [v[j] / 2 ** j for j in (50, 100, 150, 200)]
    assert all(1.5 < r < 1 + math.pi ** 2 / 6 + 0.01 for r in rs) and rs[-1] - rs[0] < 0.02
    for k in range(1, 40):
        assert exact(2, 2, lambda m: m * lg(m), k)[-1] == 2 ** k * k * (k + 1) / 2 + 2 ** k
    print(f"[OK] 주장 6: n/lg²n의 T/n -> {rs[-1]:.4f} (1 + π²/6 이하), n lg n은 정확히 n·k(k+1)/2 + n")

    f = lambda m: m * m if int(round(lg(m))) % 2 == 0 else m
    v = exact(1, 2, f, 40)
    ratio = [v[k] / f(2 ** k) for k in range(1, 41, 2)]
    assert all(v[k] >= (2 ** k) ** 2 / 4 for k in range(1, 41, 2)) and ratio[-1] > 1e10
    print(f"[OK] 주장 7: lg n 홀수에서 T/f = {ratio[-1]:.3g} (계속 커짐)")

    t = 1
    for n in range(2, 2001):
        t = t + n
        assert t == n * (n + 1) // 2
    print("[OK] 주장 8: T(n-1) + n = n(n+1)/2")

    # n = 2^(2^k): T(n) = 2T(√n) + lg n, T(2) = 1. m = lg n = 2^k.
    Tv, rs = 1.0, []
    for k in range(1, 60):
        m = 2 ** k
        Tv = 2 * Tv + m
        rs.append(Tv / (m * lg(m)))
    assert settles(rs, 0.08)
    print(f"[OK] 주장 9: T/(lg n · lg lg n) -> {rs[-1]:.3f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
