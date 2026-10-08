---
layout: "note"
title: "08_axis-rotation-ladder_p4.py"
display_title: "08_axis-rotation-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "08"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/axis-rotation-ladder/"
parent_title: "임의 축 회전 예제 사다리"
description: "수치해석 · 임의 축 회전 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/numerical-analysis/code/08_axis-rotation-ladder_p4/"
---
{% raw %}
[임의 축 회전 예제 사다리](/Hongs_Blog/studies/numerical-analysis/axis-rotation-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""임의 축 회전 예제 사다리 문제 1~4 검증. 로드리게스 공식."""
import math


def rod(A, P, deg):
    n = math.sqrt(sum(a * a for a in A)); A = [a / n for a in A]
    t = math.radians(deg); c, s = math.cos(t), math.sin(t)
    d = sum(a * p for a, p in zip(A, P))
    x = [A[1] * P[2] - A[2] * P[1], A[2] * P[0] - A[0] * P[2], A[0] * P[1] - A[1] * P[0]]
    return [P[i] * c + x[i] * s + A[i] * d * (1 - c) for i in range(3)], d, x


def close(a, b):
    return all(abs(x - y) < 1e-12 for x, y in zip(a, b))


def main():
    r, d, x = rod((0, 0, 2), (1, 1, 1), 90)                         # 문제 1
    assert d == 1 and close(x, (-1, 1, 0)) and close(r, (-1, 1, 1))
    r, d, x = rod((1, 0, 0), (1, 2, 3), 180)                        # 문제 2
    assert d == 1 and close(x, (0, -3, 2)) and close(r, (1, -2, -3))
    r, d, x = rod((1, 1, 0), (1, 0, 0), 90)                         # 문제 3
    h = 1 / math.sqrt(2)
    assert abs(d - h) < 1e-12 and close(x, (0, 0, -h)) and close(r, (0.5, 0.5, -h))
    assert abs(sum(v * v for v in r) - 1) < 1e-12
    r, d, x = rod((0, 1, 0), (1, 0, 0), 90)                         # 문제 4
    assert close(r, (0, 0, -1))
    Ry = lambda t: [[math.cos(t), 0, math.sin(t)], [0, 1, 0], [-math.sin(t), 0, math.cos(t)]]
    M = Ry(math.pi / 2)
    assert close([sum(M[i][k] * (1, 0, 0)[k] for k in range(3)) for i in range(3)], (0, 0, -1))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
