---
layout: "note"
title: "28_bisection_impl.py"
display_title: "28_bisection_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "28"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bisection-method/"
parent_title: "이분법"
description: "수치해석 · 이분법 구현 코드"
permalink: "/studies/numerical-analysis/code/28_bisection_impl/"
---
{% raw %}
[이분법](/Hongs_Blog/studies/numerical-analysis/bisection-method/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이분법 구현과 검증."""
import math


def bisection(f, xl, xu, es=None, max_iter=100):
    """행마다 (반복, xl, xu, xr, εa%)를 남긴다. es(%)를 주면 εa < es에서 멈춘다."""
    assert f(xl) * f(xu) < 0, "양 끝의 부호가 달라야 한다"
    rows = []; old = None
    for i in range(1, max_iter + 1):
        xr = (xl + xu) / 2
        ea = abs((xr - old) / xr) * 100 if old is not None else None
        rows.append((i, xl, xu, xr, ea))
        if es is not None and ea is not None and ea < es:
            break
        s = f(xl) * f(xr)
        if s < 0:
            xu = xr
        elif s > 0:
            xl = xr
        else:
            break
        old = xr
    return rows


def incremental_search(f, a, b, dx):
    out = []; x = a
    while x < b:
        if f(x) * f(x + dx) < 0:
            out.append((x, x + dx))
        x += dx
    return out


def main():
    # 슬라이드 p.11: 낙하산 항력 계수 c
    f = lambda c: 9.8 * 68.1 / c * (1 - math.exp(-(c / 68.1) * 10)) - 40
    true = 14.780203831661058                      # 다른 방법(이분법 100번)으로 구한 참값
    rows = bisection(f, 12, 16, max_iter=6)
    slide = [(12, 16, 14, None, 5.279), (14, 16, 15, 6.667, 1.487), (14, 15, 14.5, 3.448, 1.896),
             (14.5, 15, 14.75, 1.695, 0.204), (14.75, 15, 14.875, 0.840, 0.641), (14.75, 14.875, 14.8125, 0.422, 0.219)]
    for (i, xl, xu, xr, ea), (sl, su, sr, sea, set_) in zip(rows, slide):
        assert (xl, xu, xr) == (sl, su, sr)
        assert sea is None and ea is None or abs(ea - sea) < 1e-3
        assert abs(abs(true - xr) / true * 100 - set_) < 2e-3
    # 구간이 매번 절반: n번 뒤 폭은 (b − a)/2ⁿ
    rows = bisection(f, 12, 16, max_iter=20)
    assert abs((rows[-1][2] - rows[-1][1]) - 4 / 2 ** 19) < 1e-12
    # 폭이 ε 이하가 되는 데 필요한 횟수 ⌈log2((b − a)/ε)⌉
    assert math.ceil(math.log2(4 / 1e-6)) == 22
    # 카드 C2: x² − 3 on [1, 2]
    g = lambda x: x * x - 3
    r = bisection(g, 1, 2, max_iter=3)
    assert [row[3] for row in r] == [1.5, 1.75, 1.625]
    # 부호가 바뀌어도 근이 없는 경우: 1/x on [−1, 1]
    h = lambda x: 1 / x
    r = bisection(h, -1, 1.5, max_iter=40)
    assert abs(r[-1][3]) < 1e-9 and abs(h(r[-1][3])) > 1e8          # 근이 아니라 불연속점으로 간다
    # 부호가 같아도 근이 둘 있을 수 있다: (x − 1)(x − 2) on [0, 3]
    q = lambda x: (x - 1) * (x - 2)
    assert q(0) * q(3) > 0
    try:
        bisection(q, 0, 3); raise RuntimeError
    except AssertionError:
        pass
    # 증분 탐색: 간격이 너무 크면 근을 놓친다
    q2 = lambda x: (x - 1.05) * (x - 2.05)
    assert len(incremental_search(q2, 0, 3, 0.1)) == 2 and len(incremental_search(q2, 0, 3, 3)) == 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
