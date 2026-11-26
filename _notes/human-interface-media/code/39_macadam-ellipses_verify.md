---
layout: "note"
title: "39_macadam-ellipses_verify.py"
display_title: "39_macadam-ellipses_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/macadam-ellipses/"
parent_title: "맥애덤 타원"
description: "휴먼 인터페이스 미디어 · 맥애덤 타원 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/39_macadam-ellipses_verify/"
---
{% raw %}
[맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""맥애덤 타원 검증.

문서: 39.맥애덤 타원 (정의, 선형 변환 한 번으로는 안 되는 이유)
실행: python3 -I 39_macadam-ellipses_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 중심에서 (dx, dy)만큼 떨어진 점이 g11 dx^2 + 2 g12 dx dy + g22 dy^2 = 1을 만족하면 타원 위의 점이다.
     긴 반지름 a, 짧은 반지름 b, 기울기 theta인 타원의 계수는 G = R diag(1/a^2, 1/b^2) R^T 이다.
  2. 평면 전체에 같은 2x2 행렬 M을 곱하는 변환(선형 변환)은 계수 행렬이 서로 비례하지 않는 두 타원을
     동시에 원으로 만들 수 없다. M이 첫 타원을 원으로 만들면 둘째 타원은 여전히 찌그러져 있다.
     (M으로 옮긴 뒤의 계수 행렬은 M^{-T} G M^{-1} 이고, 원이려면 이것이 단위행렬의 상수배여야 한다.)
  3. 같은 행렬로 옮긴 두 원은 크기 비가 그대로라서, 크기만 다른 두 타원도 같은 크기의 원으로 만들 수 없다.
"""
import math


def mat(a, b, c, d):
    return [[a, b], [c, d]]


def mul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]


def T(A):
    return [[A[0][0], A[1][0]], [A[0][1], A[1][1]]]


def inv(A):
    det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    return [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]]


def ellipse_G(a, b, theta):
    c, s = math.cos(theta), math.sin(theta)
    R = mat(c, -s, s, c)
    D = mat(1 / a**2, 0, 0, 1 / b**2)
    return mul(mul(R, D), T(R))


def axis_ratio(G):
    """대칭 2x2 행렬의 두 고윳값 비 (1이면 원)."""
    tr = G[0][0] + G[1][1]
    det = G[0][0] * G[1][1] - G[0][1] * G[1][0]
    disc = math.sqrt(max(tr * tr / 4 - det, 0.0))
    l1, l2 = tr / 2 + disc, tr / 2 - disc
    return math.sqrt(l1 / l2)   # 반지름 비 = sqrt(고윳값 비)


def sqrt_sym(G):
    """대칭 양의 정부호 2x2 행렬의 제곱근 (G = S S, S 대칭)."""
    tr = G[0][0] + G[1][1]
    det = G[0][0] * G[1][1] - G[0][1] * G[1][0]
    s = math.sqrt(det)
    t = math.sqrt(tr + 2 * s)
    return [[(G[0][0] + s) / t, G[0][1] / t], [G[1][0] / t, (G[1][1] + s) / t]]


def main():
    # 주장 1: 매개변수로 그린 타원 위의 점이 이차식 = 1을 만족한다
    a, b, th = 0.009, 0.002, math.radians(100)
    G = ellipse_G(a, b, th)
    for k in range(36):
        t = 2 * math.pi * k / 36
        dx = a * math.cos(t) * math.cos(th) - b * math.sin(t) * math.sin(th)
        dy = a * math.cos(t) * math.sin(th) + b * math.sin(t) * math.cos(th)
        q = G[0][0] * dx * dx + 2 * G[0][1] * dx * dy + G[1][1] * dy * dy
        assert abs(q - 1) < 1e-9, q
    assert abs(axis_ratio(G) - a / b) < 1e-9
    print(f"[OK] 타원 위의 점 36개가 g11 dx^2 + 2 g12 dx dy + g22 dy^2 = 1을 만족 (반지름 비 {a/b:.1f})")

    # 주장 2: 초록 쪽처럼 길쭉한 타원 G1과, 다른 방향으로 기운 타원 G2
    G1 = ellipse_G(0.009, 0.002, math.radians(100))
    G2 = ellipse_G(0.0015, 0.0006, math.radians(60))
    S = sqrt_sym(G1)             # S로 옮기면 G1은 단위원이 된다
    Si = inv(S)
    G1n = mul(mul(T(Si), G1), Si)
    G2n = mul(mul(T(Si), G2), Si)
    assert abs(G1n[0][0] - 1) < 1e-9 and abs(G1n[1][1] - 1) < 1e-9 and abs(G1n[0][1]) < 1e-9
    r2 = axis_ratio(G2n)
    assert r2 > 1.5, r2
    print(f"[OK] 첫 타원을 원으로 만든 같은 행렬로 옮기면 둘째 타원의 반지름 비는 {r2:.2f} (원이 아님)")

    # 주장 3: 모양이 같고 크기만 다른 두 타원(반지름 3배 차이)은 옮긴 뒤에도 크기 비 3이 그대로다
    G3 = ellipse_G(0.003, 0.003 * 0.002 / 0.009, math.radians(100))   # G1과 모양·방향 같고 3배 작다
    G3n = mul(mul(T(Si), G3), Si)
    assert abs(axis_ratio(G3n) - 1) < 1e-9      # 원은 되지만
    assert abs(math.sqrt(1 / G3n[0][0]) - 1 / 3) < 1e-9   # 반지름이 1/3이라 같은 크기 원이 아니다
    print("[OK] 크기만 3배 다른 타원은 같은 행렬로 옮기면 반지름 1과 1/3인 원이 된다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
