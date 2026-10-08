---
layout: "note"
title: "25_golden-section_impl.py"
display_title: "25_golden-section_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "25"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/golden-section-search/"
parent_title: "황금분할 탐색"
description: "수치해석 · 황금분할 탐색 구현 코드"
permalink: "/studies/numerical-analysis/code/25_golden-section_impl/"
---
{% raw %}
[황금분할 탐색](/Hongs_Blog/studies/numerical-analysis/golden-section-search/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""황금분할 탐색 구현과 검증. 단봉 함수의 최솟값."""
import math

R = (-1 + math.sqrt(5)) / 2          # 0.6180339887...


def golden(f, a, b, steps):
    """슬라이드 p.17의 방식. 행마다 (a, c, d, b, f(c), f(d))를 남긴다."""
    c = a + (1 - R) * (b - a); d = a + R * (b - a)
    fc, fd = f(c), f(d); rows = [(a, c, d, b, fc, fd)]; evals = 2
    for _ in range(steps):
        if fc <= fd:                  # 최솟값은 [a, d]에
            b, d, fd = d, c, fc
            c = a + (1 - R) * (b - a); fc = f(c)
        else:                         # 최솟값은 [c, b]에
            a, c, fc = c, d, fd
            d = a + R * (b - a); fd = f(d)
        evals += 1
        rows.append((a, c, d, b, fc, fd))
    return rows, evals


def main():
    assert abs(R * R + R - 1) < 1e-15                              # r² + r − 1 = 0
    f = lambda x: x * x - math.sin(x)
    rows, ev = golden(f, 0.0, 1.0, 23)
    assert abs(rows[0][1] - 0.3819660) < 1e-7 and abs(rows[0][2] - 0.6180340) < 1e-7
    assert abs(rows[1][1] - 0.2360680) < 1e-7                       # 슬라이드 p.17의 c1
    slide = {0: (0.0, 0.3819660, 0.6180340, 1.0, -0.22684748, -0.19746793),
             1: (0.0, 0.2360680, 0.3819660, 0.6180340, -0.17815339, -0.22684748),
             2: (0.2360680, 0.3819660, 0.4721360, 0.6180340, -0.22684748, -0.23187724),
             3: (0.3819660, 0.4721360, 0.5278640, 0.6180340, -0.23187724, -0.22504882),
             4: (0.3819660, 0.4376941, 0.4721360, 0.5278640, -0.23227594, -0.23187724),
             5: (0.3819660, 0.4164079, 0.4376941, 0.4721360, -0.23108238, -0.23227594),
             6: (0.4164079, 0.4376941, 0.4508497, 0.4721360, -0.23227594, -0.23246503),
             21: (0.4501574, 0.4501730, 0.4501827, 0.4501983, -0.23246558, -0.23246558),
             22: (0.4501730, 0.4501827, 0.4501886, 0.4501983, -0.23246558, -0.23246558)}
    for k, row in slide.items():
        assert all(abs(x - y) < 2e-7 for x, y in zip(rows[k], row)), (k, rows[k])
    # 한 걸음마다 구간이 r배, 함수 계산은 한 번
    for k in range(5):
        w0 = rows[k][3] - rows[k][0]; w1 = rows[k + 1][3] - rows[k + 1][0]
        assert abs(w1 / w0 - R) < 1e-9
    assert ev == 2 + 23
    # 참 최솟값 f'(x) = 2x − cos x = 0
    x = 0.45
    for _ in range(30):
        x -= (2 * x - math.cos(x)) / (2 + math.sin(x))
    assert abs(x - 0.4501836) < 1e-7 and rows[23][0] <= x <= rows[23][3]
    # 22행에서 f(c), f(d)가 8자리까지 같아 비교가 반올림에 달린다. 슬라이드의 23행 [0.4501827, 0.4501983]도
    # 이 코드의 23행 [0.4501730, 0.4501886]도 참 최솟값을 담는다.
    assert 0.4501827 <= x <= 0.4501983
    # 카드 C2: [0, 2]의 첫 두 내부점
    _, c, d, _, _, _ = golden(f, 0.0, 2.0, 0)[0][0]
    assert abs(c - 0.7639320) < 1e-7 and abs(d - 1.2360680) < 1e-7
    # 단봉이 아니면 전체 최솟값이 아닌 극소로 갈 수 있다: sin 5x + 0.05x on [0, 4]
    g = lambda x: math.sin(5 * x) + 0.05 * x
    rr, _ = golden(g, 0.0, 4.0, 40)
    xm = (rr[-1][0] + rr[-1][3]) / 2
    grid_min = min((g(i / 10000), i / 10000) for i in range(40001))
    assert abs(xm - 2.1971) < 1e-3 and abs(grid_min[1] - 0.9405) < 1e-3          # 2.197로 가지만 전체 최솟값은 0.94
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
