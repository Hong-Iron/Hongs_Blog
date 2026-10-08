---
layout: "note"
title: "14_continuous-rv_verify.py"
display_title: "14_continuous-rv_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/continuous-rv/"
parent_title: "연속 확률변수와 확률밀도"
description: "확률과 통계 · 연속 확률변수와 확률밀도 검증 코드"
permalink: "/studies/probability-statistics/code/14_continuous-rv_verify/"
---
{% raw %}
[연속 확률변수와 확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연속 확률변수와 확률밀도 검증.

문서: 14.연속 확률변수와 확률밀도 (예시, 정의, 예제, 카드 C1~C3)
주장 1: 예시·카드 C1 — f(x) = 2x (0 <= x <= 1): 넓이 1, P(X <= 1/2) = 1/4, E[X] = 2/3, Var = 1/18, f(1) = 2 > 1.
주장 2: 정의 — CDF F(x) = x²의 도함수가 f(미적분의 기본정리), 한 점의 확률 = 폭 0 구간의 넓이 = 0(폭을 줄이며 확인).
주장 3: 예제 — 단조 변환 Y = X²의 밀도 f_Y(y) = f_X(√y)/(2√y) = 1 (0 < y < 1): 모의실험 히스토그램과 CDF 비교.
주장 4: 모의실험 — 역변환 X = √U로 뽑은 표본의 평균·P(X <= 1/2)가 이론값과 맞는다.
"""
import math
import random


def simpson(f, a, b, n=2000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    f = lambda x: 2 * x
    assert abs(simpson(f, 0, 1) - 1) < 1e-12
    assert abs(simpson(f, 0, 0.5) - 0.25) < 1e-12
    m = simpson(lambda x: x * f(x), 0, 1)
    v = simpson(lambda x: x * x * f(x), 0, 1) - m * m
    assert abs(m - 2 / 3) < 1e-12 and abs(v - 1 / 18) < 1e-12 and f(1) == 2
    print("[OK] 주장 1·카드 C1")

    F = lambda x: x * x
    for x in (0.1, 0.4, 0.9):
        assert abs((F(x + 1e-6) - F(x - 1e-6)) / 2e-6 - f(x)) < 1e-6
    widths = [simpson(f, 0.5 - w, 0.5 + w, 10) for w in (0.1, 0.01, 0.001, 0.0)]
    assert widths[-1] == 0 and widths[0] > widths[1] > widths[2] > 0
    print("[OK] 주장 2: F' = f, 한 점의 확률 0")

    rng = random.Random(14)
    xs = [math.sqrt(rng.random()) for _ in range(200000)]
    ys = [x * x for x in xs]
    for t in (0.2, 0.5, 0.8):
        assert abs(sum(1 for y in ys if y <= t) / len(ys) - t) < 0.005
    print("[OK] 주장 3: Y = X²은 균등")

    assert abs(sum(xs) / len(xs) - 2 / 3) < 0.003 and abs(sum(1 for x in xs if x <= 0.5) / len(xs) - 0.25) < 0.005
    print("[OK] 주장 4: 역변환 표본")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
