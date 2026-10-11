---
layout: "note"
title: "23_sums-asymptotics_verify.py"
display_title: "23_sums-asymptotics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/sums-asymptotics/"
parent_title: "합의 계산과 어림"
description: "이산수학 · 합의 계산과 어림 검증 코드"
permalink: "/studies/discrete-math/code/23_sums-asymptotics_verify/"
---
{% raw %}
[합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합의 계산과 어림 검증.

문서: 23.합의 계산과 어림 (예시, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: Σk³ = (n(n+1)/2)² (n <= 2000).
주장 2: Σ_{k=1}^{n} k·2^k = (n-1)·2^(n+1) + 2, Σ_{k=1}^{n} k/2^k = 2 - (n+2)/2^n < 2 (유리수로 정확히).
주장 3: 1 + ⌊lg n⌋/2 <= H_n <= 1 + lg n (n <= 10^5). 즉 H_n = Θ(log n).
주장 4: (n/2)^(n/2) <= n! <= n^n, lg n! / (n lg n) -> 1 (n = 10^5에서 0.9 이상).
주장 5: 높이 h 노드가 많아야 ⌈n/2^(h+1)⌉개인 힙 만들기 비용 Σ h·n/2^(h+1) < n.
"""
import math
from fractions import Fraction as F


def main():
    for n in range(0, 2001):
        assert sum(k ** 3 for k in range(1, n + 1)) == (n * (n + 1) // 2) ** 2
    print("[OK] 주장 1")

    for n in range(1, 80):
        assert sum(k * 2 ** k for k in range(1, n + 1)) == (n - 1) * 2 ** (n + 1) + 2
        s = sum(F(k, 2 ** k) for k in range(1, n + 1))
        assert s == 2 - F(n + 2, 2 ** n) and s < 2
    print("[OK] 주장 2·카드 C1")

    H = 0.0
    for n in range(1, 10 ** 5 + 1):
        H += 1 / n
        assert 1 + (n.bit_length() - 1) / 2 <= H + 1e-12 and H <= 1 + math.log2(n) + 1e-12
    print("[OK] 주장 3·카드 C2")

    for n in range(2, 300):
        lf = math.lgamma(n + 1)                       # ln n!
        assert (n / 2) * math.log(n / 2) <= lf + 1e-9 and lf <= n * math.log(n) + 1e-9
    n = 10 ** 5
    ratio = math.lgamma(n + 1) / math.log(2) / (n * math.log2(n))
    assert ratio > 0.9
    print(f"[OK] 주장 4·카드 C3: lg n!/(n lg n) = {ratio:.3f} (n = 10^5)")

    for n in (15, 1023, 10 ** 6):
        cost = sum(h * math.ceil(n / 2 ** (h + 1)) for h in range(0, n.bit_length() + 1))
        assert cost < n + n.bit_length() ** 2
    print("[OK] 주장 5: 힙 만들기 O(n)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
