---
layout: "note"
title: "26_fibonacci-search_impl.py"
display_title: "26_fibonacci-search_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/fibonacci-search/"
parent_title: "피보나치 탐색"
description: "수치해석 · 피보나치 탐색 구현 코드"
permalink: "/studies/numerical-analysis/code/26_fibonacci-search_impl/"
---
{% raw %}
[피보나치 탐색](/Hongs_Blog/studies/numerical-analysis/fibonacci-search/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""피보나치 탐색 구현과 검증. F0 = 0, F1 = 1."""
import math


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def smallest_n(width, tol):
    n = 0
    while fib(n) <= width / tol:
        n += 1
    return n


def fibonacci_search(f, a, b, tol, e):
    """슬라이드 p.25~28. 행마다 (a, c, d, b)."""
    n = smallest_n(b - a, tol)
    rows = []
    c = a + (1 - fib(n - 1) / fib(n)) * (b - a); d = a + fib(n - 1) / fib(n) * (b - a)
    fc, fd = f(c), f(d); rows.append((a, c, d, b)); evals = 2
    for k in range(1, n - 2):
        if fc <= fd:
            b, d, fd = d, c, fc
            r = fib(n - k - 1) / fib(n - k)
            if k == n - 3:
                r = 0.5 + e                       # 마지막: 두 점이 겹치지 않게
            c = a + (1 - r) * (b - a); fc = f(c)
        else:
            a, c, fc = c, d, fd
            r = fib(n - k - 1) / fib(n - k)
            if k == n - 3:
                r = 0.5 + e
            d = a + r * (b - a); fd = f(d)
        evals += 1
        rows.append((a, c, d, b))
    return n, rows, evals


def main():
    assert [fib(k) for k in range(9)] == [0, 1, 1, 2, 3, 5, 8, 13, 21]
    assert fib(20) == 6765 and fib(21) == 10946
    assert smallest_n(1.0, 1e-4) == 21                                # 슬라이드 p.27
    f = lambda x: x * x - math.sin(x)
    n, rows, ev = fibonacci_search(f, 0.0, 1.0, 1e-4, 0.01)
    assert abs(rows[0][1] - 0.3819660) < 1e-7 and abs(rows[0][2] - 0.6180340) < 1e-7
    assert abs(rows[1][1] - 0.2360680) < 1e-7                         # 슬라이드 p.28
    slide = {0: (0.0, 0.3819660, 0.6180340, 1.0), 1: (0.0, 0.2360680, 0.3819660, 0.6180340),
             2: (0.2360680, 0.3819660, 0.4721359, 0.6180340), 3: (0.3819660, 0.4721359, 0.5278641, 0.6180340),
             4: (0.3819660, 0.4376941, 0.4721359, 0.5278641), 16: (0.4499360, 0.4501188, 0.4502102, 0.4503928),
             17: (0.4501188, 0.4502101, 0.4503015, 0.4503928), 18: (0.4501188, 0.4502083, 0.4502101, 0.4503015)}
    for k, row in slide.items():
        assert all(abs(x - y) < 2e-7 for x, y in zip(rows[k], row)), (k, rows[k])
    assert len(rows) == 19 and n - 2 == 19                           # 모두 n − 2 = 19단계
    # 마지막 구간의 길이 ≈ (b0 − a0)/F_n
    assert abs((rows[18][3] - rows[18][0]) - 2 / fib(21)) < 1e-6
    # c18 계산 (슬라이드 p.28): 0.4501188 + 0.49 × (0.4503015 − 0.4501188)
    assert abs(0.4501188 + 0.49 * (0.4503015 - 0.4501188) - 0.4502083) < 1e-7
    assert abs(0.4501188 + 0.49 * (0.450315 - 0.4501188) - 0.4502083) > 1e-6      # 슬라이드의 0.450315로는 안 나옴
    # 같은 함수 계산 횟수면 두 방법의 마지막 폭은 거의 같다 (차이 10% 이내)
    R = (-1 + math.sqrt(5)) / 2
    golden_width = R ** (ev - 2)                                     # 처음 두 번 뒤 매번 r배
    fw = rows[-1][3] - rows[-1][0]
    assert ev == 20 and abs(fw / golden_width - 1) < 0.1
    print("함수 계산", ev, "피보나치 폭", round(fw, 9), "황금분할 폭", round(golden_width, 9))
    # 카드 C2: 폭 1, 허용 오차 0.01 → F_n > 100 → n = 12 (F12 = 144)
    assert smallest_n(1.0, 0.01) == 12 and fib(11) == 89 and fib(12) == 144
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
