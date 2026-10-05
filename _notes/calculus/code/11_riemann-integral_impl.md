---
layout: "note"
title: "11_riemann-integral_impl.py"
display_title: "11_riemann-integral_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "11"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/riemann-integral/"
parent_title: "정적분과 리만 합"
description: "미분적분학 · 정적분과 리만 합 구현 코드"
permalink: "/studies/calculus/code/11_riemann-integral_impl/"
---
{% raw %}
[정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""수치 적분: 리만 합, 사다리꼴 규칙, 심프슨 규칙.

문서: 11.정적분과 리만 합 (활용)
구간 [a, b]를 n등분해 넓이의 합으로 적분을 어림한다. 모두 f를 n + 1번(심프슨은 n이 짝수) 부른다.
- left / right / midpoint: 직사각형. 매끄러운 f에서 left·right의 오차는 1/n, midpoint는 1/n²에 비례한다.
- trapezoid: 사다리꼴. 오차는 1/n²에 비례한다.
- simpson: 두 칸마다 포물선. 오차는 1/n⁴에 비례한다.
"""
import math


def riemann(f, a, b, n, rule="left"):
    """n등분 리만 합. rule은 left, right, midpoint 중 하나."""
    if n <= 0:
        raise ValueError("n은 양의 정수여야 한다")
    dx = (b - a) / n
    shift = {"left": 0.0, "right": 1.0, "midpoint": 0.5}[rule]
    return sum(f(a + (i + shift) * dx) for i in range(n)) * dx


def trapezoid(f, a, b, n):
    dx = (b - a) / n
    inner = sum(f(a + i * dx) for i in range(1, n))
    return dx * (0.5 * f(a) + inner + 0.5 * f(b))


def simpson(f, a, b, n):
    """n은 짝수. 가중치 1, 4, 2, 4, ..., 2, 4, 1."""
    if n % 2:
        raise ValueError("심프슨 규칙은 짝수 n이 필요하다")
    dx = (b - a) / n
    s = f(a) + f(b)
    s += 4 * sum(f(a + i * dx) for i in range(1, n, 2))
    s += 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


if __name__ == "__main__":
    sq = lambda x: x * x
    # 예시: 0~3초 동안 v(t) = t²의 이동 거리 = 9
    assert riemann(sq, 0, 3, 3, "left") == 5 and riemann(sq, 0, 3, 3, "right") == 14
    assert abs(riemann(sq, 0, 3, 300, "right") - 9.04505) < 1e-9
    # 이차 이하 다항식은 심프슨이 정확하다(사실 삼차까지)
    assert abs(simpson(lambda x: x ** 3 - 2 * x, -1, 2, 2) - (2 ** 4 / 4 - 4 - (1 / 4 - 1))) < 1e-12
    # 오차 차수: n을 두 배로 하면 오차가 left는 약 1/2, trapezoid는 1/4, simpson은 1/16
    exact = 2.0  # ∫_0^π sin
    e = {r: [abs(g(n) - exact) for n in (64, 128)] for r, g in {
        "left": lambda n: riemann(math.sin, 0, math.pi, n, "left") + 0 * n,
        "trap": lambda n: trapezoid(math.sin, 0, math.pi, n),
        "simp": lambda n: simpson(math.sin, 0, math.pi, n),
    }.items()}
    assert 3.8 < e["trap"][0] / e["trap"][1] < 4.2
    assert 15 < e["simp"][0] / e["simp"][1] < 17
    # sin은 [0, π]에서 대칭이라 left도 trapezoid와 같아진다(끝값이 0). 비대칭 함수로 left의 1/n을 본다.
    el = [abs(riemann(math.exp, 0, 1, n, "left") - (math.e - 1)) for n in (64, 128)]
    assert 1.9 < el[0] / el[1] < 2.1
    for bad in (lambda: riemann(sq, 0, 1, 0), lambda: simpson(sq, 0, 1, 3)):
        try:
            bad()
            raise AssertionError("예외가 나야 한다")
        except ValueError:
            pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
