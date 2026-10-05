---
layout: "note"
title: "07_curve-analysis_verify.py"
display_title: "07_curve-analysis_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/curve-analysis/"
parent_title: "도함수의 활용과 최적화"
description: "미분적분학 · 도함수의 활용과 최적화 검증 코드"
permalink: "/studies/calculus/code/07_curve-analysis_verify/"
---
{% raw %}
[도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""도함수의 활용과 최적화 검증.

문서: 07.도함수의 활용과 최적화 (예시, 정리, 예제, 활용, 카드 C1~C4, 자주 하는 오해),
      4.연습문제/07.최적화 문제 예제 사다리
주장 1: 12×12 철판 상자 V(x) = x(12 - 2x)²의 최댓값은 x = 2에서 128 (0 < x < 6 격자 탐색으로 확인).
주장 2: 체크포인트 비용 C/T + T/(2M)의 최솟값은 T* = √(2CM). C = 5분, M = 1440분이면 T* = 120분.
주장 3: x³은 x = 0에서 도함수가 0이지만 극값이 아니다.
주장 4: 울타리 100 m로 만든 직사각형의 최대 넓이는 25 × 25 = 625.
주장 5: 부피 1000 cm³ 원통의 겉넓이 최소는 r = (500/π)^(1/3) ≈ 5.42 cm, h = 2r.
주장 6: a/n + bn의 최소는 n = √(a/b), 최솟값 2√(ab).
주장 7: 닫힌 구간에서 끝점도 후보: f(x) = x² - 2x를 [0, 3]에서 보면 최댓값은 끝점 x = 3의 3.
"""
import math


def argmin(f, a, b, n=200000):
    best = min((f(a + (b - a) * i / n), a + (b - a) * i / n) for i in range(1, n))
    return best[1], best[0]


def main():
    V = lambda x: x * (12 - 2 * x) ** 2
    x, negv = argmin(lambda t: -V(t), 0, 6)
    assert abs(x - 2) < 1e-3 and abs(-negv - 128) < 1e-4
    print("[OK] 주장 1·카드 C2: x = 2, V = 128")

    C, M = 5, 1440
    cost = lambda T: C / T + T / (2 * M)
    T, _ = argmin(cost, 1, 1000)
    assert abs(T - math.sqrt(2 * C * M)) < 0.01 and math.sqrt(2 * C * M) == 120
    print("[OK] 주장 2·사다리 3: T* = 120분")

    f = lambda x: x ** 3
    assert all(f(-10 ** -k) < f(0) < f(10 ** -k) for k in range(1, 10))
    print("[OK] 주장 3·카드 C3·오해")

    x, negA = argmin(lambda w: -(w * (50 - w)), 0, 50)
    assert abs(x - 25) < 1e-3 and abs(-negA - 625) < 1e-4
    print("[OK] 주장 4·사다리 2")

    S = lambda r: 2 * math.pi * r * r + 2000 / r
    r, _ = argmin(S, 1, 20)
    r_star = (500 / math.pi) ** (1 / 3)
    h = 1000 / (math.pi * r_star ** 2)
    assert abs(r - r_star) < 1e-3 and f"{r_star:.2f}" == "5.42" and abs(h - 2 * r_star) < 1e-9
    S2 = lambda r: math.pi * r * r + 2000 / r
    r2, _ = argmin(S2, 1, 20)
    r2_star = (1000 / math.pi) ** (1 / 3)
    assert abs(r2 - r2_star) < 1e-3 and abs(1000 / (math.pi * r2_star ** 2) - r2_star) < 1e-9
    assert [round(V(t)) for t in (1, 3, 4, 5)] == [100, 108, 64, 20]
    print("[OK] 주장 5·사다리 4와 변형(뚜껑 없으면 h = r), 예시 표")

    for a, b in ((100, 1), (5, 0.2), (3, 7)):
        n, val = argmin(lambda t: a / t + b * t, 0.01, 100)
        assert abs(n - math.sqrt(a / b)) < 1e-2 and abs(val - 2 * math.sqrt(a * b)) < 1e-4
    print("[OK] 주장 6·사다리 변형")

    g = lambda x: x * x - 2 * x
    cands = {0: g(0), 1: g(1), 3: g(3)}
    assert max(cands, key=cands.get) == 3 and cands[3] == 3 and min(cands, key=cands.get) == 1
    print("[OK] 주장 7·카드 C4: 끝점이 최대")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
