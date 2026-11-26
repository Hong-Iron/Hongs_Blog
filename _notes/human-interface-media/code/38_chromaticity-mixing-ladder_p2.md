---
layout: "note"
title: "38_chromaticity-mixing-ladder_p2.py"
display_title: "38_chromaticity-mixing-ladder_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
parent_title: "색도도 혼합 예제 사다리"
description: "휴먼 인터페이스 미디어 · 색도도 혼합 예제 사다리 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p2/"
---
{% raw %}
[색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색도도 혼합 예제 사다리, 문제 2와 변형 2.

실행: python3 -I 38_chromaticity-mixing-ladder_p2.py  (표준 라이브러리만 쓴다)
문제 2: 빛 A(0.6, 0.3), B(0.3, 0.6), C(0.15, 0.06)로 목표 T(0.42, 0.342)를 만드는 비율.
  답: 몫 0.5 : 0.3 : 0.2, 휘도 비 0.15 : 0.18 : 0.012 = 25 : 30 : 2.
변형 2: 같은 세 빛을 휘도 15, 30, 3으로 켜면 색도는 (0.35, 0.32) (세 무게가 모두 50이라 세 점의 평균).
"""
from fractions import Fraction as F


def bary(P, W):
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


def mix(lights):
    S = [Y / y for _, y, Y in lights]
    tot = sum(S)
    return sum(s * x for s, (x, _, _) in zip(S, lights)) / tot, sum(s * y for s, (_, y, _) in zip(S, lights)) / tot


def main():
    A, B, C = (F(6, 10), F(3, 10)), (F(3, 10), F(6, 10)), (F(15, 100), F(6, 100))
    T = (F(42, 100), F(342, 1000))
    lam = bary([A, B, C], T)
    assert lam == (F(1, 2), F(3, 10), F(1, 5)), lam
    # 손 풀이 중간 식: 0.45a + 0.15b = 0.27, 0.24a + 0.54b = 0.282
    a, b, _ = lam
    assert F(45, 100) * a + F(15, 100) * b == F(27, 100) and F(24, 100) * a + F(54, 100) * b == F(282, 1000)
    lum = [l * P[1] for l, P in zip(lam, (A, B, C))]
    assert lum == [F(15, 100), F(18, 100), F(12, 1000)]
    assert [v / lum[2] * 2 for v in lum] == [25, 30, 2]
    assert sum(lum) == T[1]
    assert mix([(A[0], A[1], 25), (B[0], B[1], 30), (C[0], C[1], 2)]) == T
    print("[OK] 문제 2: 몫 0.5 : 0.3 : 0.2, 휘도 비 25 : 30 : 2, 다시 섞으면 (0.42, 0.342)")

    m = mix([(A[0], A[1], 15), (B[0], B[1], 30), (C[0], C[1], 3)])
    assert m == (F(35, 100), F(32, 100)), m
    print("[OK] 변형 2: 휘도 15, 30, 3이면 무게가 모두 50이라 (0.35, 0.32)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
