---
layout: "note"
title: "29_secant-method_impl.py"
display_title: "29_secant-method_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "29"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/secant-method/"
parent_title: "할선법"
description: "수치해석 · 할선법 구현 코드"
permalink: "/studies/numerical-analysis/code/29_secant-method_impl/"
---
{% raw %}
[할선법](/Hongs_Blog/studies/numerical-analysis/secant-method/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""할선법 구현과 검증. 뉴턴 방법과 비교."""
import math


def secant(f, x_prev, x, n):
    out = [x_prev, x]
    for _ in range(n):
        fx, fp = f(x), f(x_prev)
        x_prev, x = x, x - fx * (x - x_prev) / (fx - fp)
        out.append(x)
    return out


def newton(f, df, x, n):
    out = [x]
    for _ in range(n):
        x = x - f(x) / df(x); out.append(x)
    return out


def main():
    f = lambda x: math.exp(-x) - x
    df = lambda x: -math.exp(-x) - 1
    root = 0.56714329040978387
    s = secant(f, 0.0, 1.0, 6)
    assert round(f(0.0), 5) == 1.0 and round(f(1.0), 5) == -0.63212
    assert round(s[2], 5) == 0.61270 and round(f(s[2]), 5) == -0.07081            # 슬라이드 p.20
    assert round(s[3], 5) == 0.56384
    assert round(abs(root - s[2]) / root * 100, 1) == 8.0 and round(abs(root - s[3]) / root * 100, 2) == 0.58
    # 뉴턴 방법 표 (미분적분학 문서의 슬라이드 예)
    nw = newton(f, df, 0.0, 4)
    assert [round(v, 9) for v in nw] == [0.0, 0.5, 0.566311003, 0.567143165, 0.56714329]
    # 수렴 빠르기: 오차가 줄어드는 차수(log 비율). 뉴턴 약 2, 할선법 약 1.618
    def order(seq):
        e = [abs(v - root) for v in seq if abs(v - root) > 1e-14]
        return math.log(e[-1] / e[-2]) / math.log(e[-2] / e[-3])
    on, os_ = order(nw[:5]), order(secant(f, 0.0, 1.0, 5))
    assert 1.8 < on < 2.2 and 1.4 < os_ < 1.9
    print("수렴 차수 추정: 뉴턴", round(on, 2), "할선", round(os_, 2))
    # 할선법은 두 시작점이 근을 사이에 두지 않아도 된다
    s2 = secant(f, 2.0, 3.0, 8)
    assert f(2.0) * f(3.0) > 0 and abs(s2[-1] - root) < 1e-10
    # 분모가 0이 되는 실패: 두 점의 함수 값이 같을 때
    g = lambda x: x * x - 4
    try:
        secant(g, -1.0, 1.0, 1); raise RuntimeError
    except ZeroDivisionError:
        pass
    # 카드 C2: x² − 2, 시작 1과 2 → 4/3
    h = lambda x: x * x - 2
    assert abs(secant(h, 1.0, 2.0, 1)[-1] - 4 / 3) < 1e-15
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
