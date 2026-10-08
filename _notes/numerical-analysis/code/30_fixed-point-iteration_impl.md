---
layout: "note"
title: "30_fixed-point-iteration_impl.py"
display_title: "30_fixed-point-iteration_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/fixed-point-iteration/"
parent_title: "고정점 반복"
description: "수치해석 · 고정점 반복 구현 코드"
permalink: "/studies/numerical-analysis/code/30_fixed-point-iteration_impl/"
---
{% raw %}
[고정점 반복](/Hongs_Blog/studies/numerical-analysis/fixed-point-iteration/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""고정점 반복 구현과 검증."""
import math


def fixed_point(g, x, n):
    out = [x]
    for _ in range(n):
        x = g(x); out.append(x)
    return out


def main():
    root = 0.56714329040978387
    xs = fixed_point(lambda x: math.exp(-x), 0.0, 10)
    slide = [0, 1.000000, 0.367879, 0.692201, 0.500473, 0.606244, 0.545396, 0.579612, 0.560115, 0.571143, 0.564879]
    assert all(abs(a - b) < 1e-6 for a, b in zip(xs, slide))               # 슬라이드 p.5
    ea = [abs((xs[i] - xs[i - 1]) / xs[i]) * 100 for i in range(1, 11)]
    et = [abs(root - v) / root * 100 for v in xs]
    assert [round(v, 1) for v in ea[:3]] == [100.0, 171.8, 46.9] and round(ea[-1], 2) == 1.11
    assert round(et[1], 1) == 76.3 and round(et[10], 3) == 0.399
    # 선형 수렴: 오차 비율 → |g'(root)| = e^{−root} = root ≈ 0.567
    ratios = [abs(xs[i + 1] - root) / abs(xs[i] - root) for i in range(5, 9)]
    assert all(abs(r - root) < 0.05 for r in ratios)
    # x² − x − 2 = 0 (근 2)의 세 가지 g
    g1 = lambda x: x * x - 2; g2 = lambda x: math.sqrt(x + 2); g3 = lambda x: 1 + 2 / x
    assert abs(fixed_point(g2, 1.0, 40)[-1] - 2) < 1e-12 and abs(fixed_point(g3, 1.0, 60)[-1] - 2) < 1e-12
    assert abs(fixed_point(g1, 2.1, 6)[-1]) > 100                           # |g1'(2)| = 4 > 1 → 발산
    # 기울기: g2'(2) = 1/4, g3'(2) = −1/2 (부호가 음이면 근 양쪽을 오가며 다가간다)
    s3 = fixed_point(g3, 1.0, 6)
    assert all((s3[i] - 2) * (s3[i + 1] - 2) < 0 for i in range(5))
    # 카드 C2: g(x) = cos x, x0 = 0 → 1, 0.5403
    c = fixed_point(math.cos, 0.0, 2)
    assert c[1] == 1.0 and round(c[2], 4) == 0.5403
    # 연립: x² + xy = 10, y + 3xy² = 57 (참값 (2, 3))
    x, y = 1.5, 3.5
    x1 = (10 - x * x) / y; y1 = 57 - 3 * x1 * y * y                         # 슬라이드 p.8은 새 x1을 쓴다
    assert round(x1, 5) == 2.21429 and abs(y1 + 24.375) < 1e-3              # 슬라이드는 −24.3으로 줄여 씀
    x2 = (10 - x1 * x1) / y1; y2 = 57 - 3 * x2 * y1 * y1
    assert abs(x2 + 0.2091) < 1e-4 and abs(y2 - 429.71) < 0.01                # 슬라이드 −0.20910, 429.709: 발산
    # 방법 ii (새 x를 바로 쓴다)
    x, y = 1.5, 3.5; seq = []
    for _ in range(30):
        x = math.sqrt(10 - x * y); y = math.sqrt((57 - y) / (3 * x)); seq.append((x, y))
    assert [round(v, 5) for v in seq[0]] == [2.17945, 2.86051] and [round(v, 5) for v in seq[1]] == [1.94053, 3.04955]
    assert abs(seq[-1][0] - 2) < 1e-6 and abs(seq[-1][1] - 3) < 1e-6
    # 반복 함수 g1 = √(10 − xy), g2 = √((57 − y)/(3x))의 편미분 (근 (2, 3)에서)
    dg1 = (abs(-3 / (2 * 2)), abs(-2 / (2 * 2)))                                 # (0.75, 0.5) → 합 1.25
    dg2 = (abs(-(54) / (3 * 4) / (2 * 3)), abs(-1 / (3 * 2) / (2 * 3)))          # (0.75, 0.0278)
    assert abs(sum(dg1) - 1.25) < 1e-12 and sum(dg2) < 1
    # 원래 함수 u = x² + xy − 10의 편미분 합은 (2x + y) + x = 9로 1보다 훨씬 크다
    assert (2 * 2 + 3) + 2 == 9
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
