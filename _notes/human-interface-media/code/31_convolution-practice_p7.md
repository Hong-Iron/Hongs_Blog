---
layout: "note"
title: "31_convolution-practice_p7.py"
display_title: "31_convolution-practice_p7.py"
kind: "code"
kind_label: "코드 · 문제 7 풀이"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/convolution-practice/"
parent_title: "합성곱 연습"
description: "휴먼 인터페이스 미디어 · 합성곱 연습 문제 7 풀이 코드"
permalink: "/studies/human-interface-media/code/31_convolution-practice_p7/"
---
{% raw %}
[합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/) 문서의 문제 7 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합성곱 연습 p6·p7: 2차원 합성곱 (강의 6 p.21~22).

p6: f = h = 단위 정사각형(0~1 × 0~1에서 1)이면 g(x, y) = tri(x) tri(y).
    네 구역 (1) xy (2) x(2 - y) (3) (2 - x)y (4) (2 - x)(2 - y). 꼭대기 g(1, 1) = 1.
p7: f는 m, n ∈ {-1, 0, 1}에서 1, h는 (m, n) = (1, 0), (0, -1), (0, 0)에서 1.
    g(m, n) = Σ f(k, l) h(m - k, n - l). 위에서부터(m = 2, 1, 0, -1), n = -2 … 1:
      m = 2:  0 1 1 1
      m = 1:  1 3 3 2
      m = 0:  1 3 3 2
      m = -1: 1 2 2 1
"""


def main() -> None:
    N = 300
    def g_num(x, y):
        s = 0
        for i in range(N):
            a = (i + 0.5) / N
            for j in range(N):
                b = (j + 0.5) / N
                if 0 <= x - a <= 1 and 0 <= y - b <= 1:
                    s += 1
        return s / N ** 2
    tri = lambda t: t if t <= 1 else 2 - t
    cases = [((0.4, 0.7), 0.4 * 0.7), ((0.5, 1.6), 0.5 * (2 - 1.6)),
             ((1.5, 0.3), (2 - 1.5) * 0.3), ((1.2, 1.8), (2 - 1.2) * (2 - 1.8)), ((1.0, 1.0), 1.0)]
    for (x, y), want in cases:
        assert abs(g_num(x, y) - want) < 0.01 and abs(tri(x) * tri(y) - want) < 1e-12
    f = {(m, n): 1 for m in (-1, 0, 1) for n in (-1, 0, 1)}
    h = {(1, 0): 1, (0, -1): 1, (0, 0): 1}
    g = {}
    for (k, l), a in f.items():
        for (p, q), b in h.items():
            g[(k + p, l + q)] = g.get((k + p, l + q), 0) + a * b
    table = [[g.get((m, n), 0) for n in (-2, -1, 0, 1)] for m in (2, 1, 0, -1)]
    assert table == [[0, 1, 1, 1], [1, 3, 3, 2], [1, 3, 3, 2], [1, 2, 2, 1]]
    assert g[(-1, -2)] == 1 and g[(2, 1)] == 1
    h4 = dict(h)
    h4[(0, 1)] = 1                                     # 변형 2: 점 하나 더하면 값 4인 칸
    g4 = {}
    for (k, l), a in f.items():
        for (p, q), b in h4.items():
            g4[(k + p, l + q)] = g4.get((k + p, l + q), 0) + a * b
    assert g4[(1, 0)] == 4 and g4[(0, 0)] == 4 and max(g4.values()) == 4
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
