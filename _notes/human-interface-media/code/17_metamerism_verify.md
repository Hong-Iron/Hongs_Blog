---
layout: "note"
title: "17_metamerism_verify.py"
display_title: "17_metamerism_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/metamerism/"
parent_title: "조건등색"
description: "휴먼 인터페이스 미디어 · 조건등색 검증 코드"
permalink: "/studies/human-interface-media/code/17_metamerism_verify/"
---
{% raw %}
[조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""조건등색 검증 (조건등색 예제 사다리의 답 포함).

문서: 17.조건등색, 4.연습문제/17.조건등색 예제 사다리
주장:
  1. 스펙트럼을 400~700 nm, 10 nm 간격 31칸의 세기 벡터로 보면 추상체 반응은 3 x 31 행렬 C를 곱한 값이다.
     C의 영공간은 28차원이다. 흰빛(모든 칸 1)에 영공간 벡터를 조금 더하면, 스펙트럼은 달라도
     세 반응은 같은 빛(조건등색 쌍)이 된다.
  2. 예제 사다리의 장난감 표 (파장 칸 4개, 설명용 가상 수치):
       S = (6, 3, 0, 0), M = (2, 5, 6, 4), L = (0, 1, 4, 6)
     영공간은 v = (1, -2, 2, -1) 한 방향뿐이다.
       문제 1: P = (1, 2, 1, 1), Q = (2, 0, 3, 0) -> 둘 다 (12, 22, 12). 조건등색.
       문제 2: R = (0, 2, 0, 1), T = (1, 0, 2, 0) -> 둘 다 (6, 14, 8). 조건등색.
       문제 3: U = (1, 1, 1, 1) -> (9, 17, 11), W = (1, 1, 2, 0) -> (9, 19, 9). M·L이 달라 조건등색 아님.
       문제 4: Y = (2, 4, 1, 1) -> (24, 34, 14). Y + t v가 음수 칸 없이 있으려면 -1/2 <= t <= 1.
               예: t = 1 -> (3, 2, 3, 0).
       변형: X = (3, 0, 0, 1)은 t = 0 말고는 음수 칸이 생겨, 이 세계에서 X의 조건등색 빛은 X 자신뿐이다.
"""
import math
from fractions import Fraction as F

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}


def sens(cone: str, lam: float) -> float:
    return math.exp(-((lam - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


def apply(c, spec):
    return tuple(sum(a * b for a, b in zip(row, spec)) for row in c)


def solve3(m, b):
    a = [row[:] + [b[i]] for i, row in enumerate(m)]
    for col in range(3):
        p = max(range(col, 3), key=lambda r: abs(a[r][col]))
        a[col], a[p] = a[p], a[col]
        for r in range(3):
            if r != col:
                f = a[r][col] / a[col][col]
                a[r] = [x - f * y for x, y in zip(a[r], a[col])]
    return [a[i][3] / a[i][i] for i in range(3)]


def rank(rows) -> int:
    m = [list(map(F, r)) for r in rows]
    rk, col = 0, 0
    ncols = len(m[0])
    while rk < len(m) and col < ncols:
        piv = next((r for r in range(rk, len(m)) if m[r][col] != 0), None)
        if piv is None:
            col += 1
            continue
        m[rk], m[piv] = m[piv], m[rk]
        for r in range(len(m)):
            if r != rk and m[r][col] != 0:
                f = m[r][col] / m[rk][col]
                m[r] = [x - f * y for x, y in zip(m[r], m[rk])]
        rk += 1
        col += 1
    return rk


def main() -> None:
    # 주장 1: 가우스 모형, 31칸
    lams = [400 + 10 * i for i in range(31)]
    C = [[sens(k, lam) for lam in lams] for k in "SML"]
    # 칸 5, 15, 25를 기준으로 칸 10 방향의 영공간 벡터를 만든다
    base = [5, 15, 25]
    extra = 10
    y = solve3([[C[r][j] for j in base] for r in range(3)], [-C[r][extra] for r in range(3)])
    v = [0.0] * 31
    for j, yj in zip(base, y):
        v[j] = yj
    v[extra] = 1.0
    assert all(abs(x) < 1e-12 for x in apply(C, v))
    white = [1.0] * 31
    eps = min(1.0 / abs(x) for x in v if x < 0) * 0.9
    other = [w + eps * vv for w, vv in zip(white, v)]
    assert min(other) >= 0 and max(abs(a - b) for a, b in zip(other, white)) > 0.5
    rw, ro = apply(C, white), apply(C, other)
    assert all(abs(a - b) < 1e-9 for a, b in zip(rw, ro))
    print(f"[OK] 31칸 흰빛과 다른 스펙트럼(최대 차이 {max(abs(a - b) for a, b in zip(other, white)):.2f})의 "
          f"세 반응이 같다: {tuple(round(x, 4) for x in rw)}")
    print(f"[OK] 영공간 차원 = 31 - 3 = {31 - 3}")

    # 주장 2: 장난감 표
    Ct = [(6, 3, 0, 0), (2, 5, 6, 4), (0, 1, 4, 6)]
    v4 = (1, -2, 2, -1)
    assert rank(Ct) == 3 and apply(Ct, v4) == (0, 0, 0)
    print("[OK] 장난감 표: 계수 3, 영공간 = v = (1, -2, 2, -1) 방향")

    cases = [
        ("문제 1", (1, 2, 1, 1), (2, 0, 3, 0), (12, 22, 12), True),
        ("문제 2", (0, 2, 0, 1), (1, 0, 2, 0), (6, 14, 8), True),
    ]
    for name, p, q, resp, _ in cases:
        assert apply(Ct, p) == apply(Ct, q) == resp
        assert tuple(b - a for a, b in zip(p, q)) == v4
        print(f"[OK] {name}: {p}, {q} -> 둘 다 {resp}")
    assert apply(Ct, (1, 1, 1, 1)) == (9, 17, 11) and apply(Ct, (1, 1, 2, 0)) == (9, 19, 9)
    print("[OK] 문제 3: U -> (9, 17, 11), W -> (9, 19, 9). 조건등색 아님")

    Y = (2, 4, 1, 1)
    assert apply(Ct, Y) == (24, 34, 14)
    ok_t = [F(t, 4) for t in range(-8, 9) if all(a + F(t, 4) * b >= 0 for a, b in zip(Y, v4))]
    assert min(ok_t) == F(-1, 2) and max(ok_t) == 1
    y1 = tuple(a + b for a, b in zip(Y, v4))
    assert y1 == (3, 2, 3, 0) and apply(Ct, y1) == (24, 34, 14)
    print("[OK] 문제 4: Y -> (24, 34, 14), 허용 범위 -1/2 <= t <= 1, t=1 -> (3, 2, 3, 0)")

    X = (3, 0, 0, 1)
    ok = [F(t, 100) for t in range(-300, 301) if all(a + F(t, 100) * b >= 0 for a, b in zip(X, v4))]
    assert ok == [0]
    print("[OK] 변형: X = (3, 0, 0, 1)은 t = 0만 허용")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
