---
layout: "note"
title: "40_cie-lab_verify.py"
display_title: "40_cie-lab_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-lab/"
parent_title: "CIE Lab"
description: "휴먼 인터페이스 미디어 · CIE Lab 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/40_cie-lab_verify/"
---
{% raw %}
[CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CIE Lab 검증.

문서: 40.CIE Lab (예시로 보기, 정의, 활용, 자주 하는 오해, 카드 C1~C3)
실행: python3 -I 40_cie-lab_verify.py  (표준 라이브러리만 쓴다)
기준 백색은 D65: (Xn, Yn, Zn) = (0.95047, 1.00000, 1.08883). sRGB(선형) -> XYZ 행렬은 IEC 61966-2-1의 D65 행렬.

주장:
  1. f(t)의 두 조각은 t0 = (6/29)^3 ≈ 0.008856에서 값(6/29)과 기울기((1/3)(29/6)^2 ≈ 7.787)가 같다.
     세제곱근만 쓰면 t -> 0에서 기울기가 끝없이 커진다(t = 10^-6에서 3333).
  2. 기준 백색 -> (100, 0, 0), 검정(0, 0, 0) -> (0, 0, 0). 아주 어두운 쪽은 L* = (29/3)^3 Y/Yn ≈ 903.3 Y/Yn.
  3. sRGB 원색: 빨강 ≈ (53.24, 80.09, 67.20), 초록 ≈ (87.73, -86.18, 83.18), 파랑 ≈ (32.30, 79.19, -107.86).
  4. 회색 Y/Yn = 0.1, 0.2, ..., 1.0의 L*: 37.8, 51.8, 61.7, 69.5, 76.1, 81.8, 87.0, 91.7, 96.0, 100.
     첫 간격 14.0, 마지막 간격 4.0. 반사율 18% 회색은 L* ≈ 49.5, L* = 50은 Y/Yn ≈ 0.184.
  5. 색도도에서 y를 똑같이 0.01 올려도(Y = 0.1 고정) 초록 (0.25, 0.60) 근처는 ΔE ≈ 1.9,
     파랑 (0.17, 0.08) 근처는 ΔE ≈ 14.2로 7배 넘게 다르다.
  6. 카드 C3: X/Xn = Y/Yn = Z/Zn = 0.064인 회색은 (30.4, 0, 0)이고, (32.4, 3, -6)과의 ΔE는 7.
  7. Lab -> XYZ 역변환으로 무작위 색 1,000개가 되돌아온다.
"""
import math
import random

XN, YN, ZN = 0.95047, 1.00000, 1.08883
D = 6 / 29
M_SRGB = [[0.4124564, 0.3575761, 0.1804375],
          [0.2126729, 0.7151522, 0.0721750],
          [0.0193339, 0.1191920, 0.9503041]]


def f(t):
    return t ** (1 / 3) if t > D**3 else t / (3 * D * D) + 4 / 29


def finv(u):
    return u**3 if u > D else 3 * D * D * (u - 4 / 29)


def lab(X, Y, Z):
    fx, fy, fz = f(X / XN), f(Y / YN), f(Z / ZN)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def xyz_from_lab(L, a, b):
    fy = (L + 16) / 116
    fx = fy + a / 500
    fz = fy - b / 200
    return XN * finv(fx), YN * finv(fy), ZN * finv(fz)


def srgb_linear_to_xyz(r, g, b):
    return tuple(sum(M_SRGB[i][j] * c for j, c in enumerate((r, g, b))) for i in range(3))


def from_xyY(x, y, Y):
    return x / y * Y, Y, (1 - x - y) / y * Y


def dE(p, q):
    return math.sqrt(sum((u - v) ** 2 for u, v in zip(p, q)))


def close(p, q, tol):
    return all(abs(u - v) < tol for u, v in zip(p, q))


def main():
    # 주장 1
    t0 = D**3
    assert abs(t0 - 0.008856) < 1e-6
    lin = lambda t: t / (3 * D * D) + 4 / 29
    assert abs(t0 ** (1 / 3) - lin(t0)) < 1e-15 and abs(lin(t0) - 6 / 29) < 1e-15
    slope_cube = (1 / 3) * t0 ** (-2 / 3)
    slope_lin = 1 / (3 * D * D)
    assert abs(slope_cube - slope_lin) < 1e-9 and abs(slope_lin - 7.787) < 0.001
    assert abs((1 / 3) * (1e-6) ** (-2 / 3) - 3333.3) < 0.1
    print(f"[OK] t0 = {t0:.6f}에서 두 조각의 값 {6/29:.4f}, 기울기 {slope_lin:.3f}가 같다")

    # 주장 2
    assert close(lab(XN, YN, ZN), (100, 0, 0), 1e-9)
    assert close(lab(0, 0, 0), (0, 0, 0), 1e-9)
    k = (29 / 3) ** 3
    assert abs(k - 903.3) < 0.05
    for y in (0.001, 0.005, 0.008):
        assert abs(lab(y * XN, y, y * ZN)[0] - k * y) < 1e-9
    print(f"[OK] 흰색 (100, 0, 0), 검정 (0, 0, 0), 어두운 쪽 L* = {k:.1f} Y/Yn")

    # 주장 3
    ref = {"빨강": ((1, 0, 0), (53.24, 80.09, 67.20)), "초록": ((0, 1, 0), (87.73, -86.18, 83.18)),
           "파랑": ((0, 0, 1), (32.30, 79.19, -107.86))}
    for name, (rgb, want) in ref.items():
        got = lab(*srgb_linear_to_xyz(*rgb))
        assert close(got, want, 0.02), (name, got)
        print(f"[OK] sRGB {name} -> ({got[0]:.2f}, {got[1]:.2f}, {got[2]:.2f})")
    # sRGB 흰색(1, 1, 1)도 D65라 (100, 0, 0)
    assert close(lab(*srgb_linear_to_xyz(1, 1, 1)), (100, 0, 0), 0.01)

    # 주장 4
    Ls = [lab(t * XN, t, t * ZN)[0] for t in [i / 10 for i in range(1, 11)]]
    want = [37.8, 51.8, 61.7, 69.5, 76.1, 81.8, 87.0, 91.7, 96.0, 100.0]
    assert all(abs(a - b) < 0.06 for a, b in zip(Ls, want)), Ls
    assert abs((Ls[1] - Ls[0]) - 14.0) < 0.05 and abs((Ls[9] - Ls[8]) - 4.0) < 0.05
    L18 = lab(0.18 * XN, 0.18, 0.18 * ZN)[0]
    assert abs(L18 - 49.5) < 0.01
    y50 = finv((50 + 16) / 116)
    assert abs(y50 - 0.184) < 0.0005
    print(f"[OK] 회색 단계 L* = {[round(v, 1) for v in Ls]}, 18% 회색 L* = {L18:.2f}, L*=50 <-> Y = {y50:.3f}")

    # 주장 5
    g = dE(lab(*from_xyY(0.25, 0.60, 0.1)), lab(*from_xyY(0.25, 0.61, 0.1)))
    bl = dE(lab(*from_xyY(0.17, 0.08, 0.1)), lab(*from_xyY(0.17, 0.09, 0.1)))
    assert abs(g - 1.87) < 0.01 and abs(bl - 14.24) < 0.01 and bl / g > 7, (g, bl)
    print(f"[OK] y를 0.01 올렸을 때 초록 근처 ΔE = {g:.2f}, 파랑 근처 ΔE = {bl:.2f} ({bl/g:.1f}배)")

    # 주장 6
    gray = lab(0.064 * XN, 0.064, 0.064 * ZN)
    assert close(gray, (30.4, 0, 0), 1e-9)
    assert abs(dE(gray, (32.4, 3, -6)) - 7) < 1e-9
    print(f"[OK] C3: 회색 0.064 -> ({gray[0]:.1f}, {gray[1]:.0f}, {gray[2]:.0f}), ΔE = 7")
    # 본문의 작은 예: 0.125 -> L* 42, 휘도 절반 -> L* 76.1, ΔE 예 5, L*=50 -> f = 66/116
    assert abs(lab(0.125 * XN, 0.125, 0.125 * ZN)[0] - 42) < 1e-9
    assert abs(lab(0.5 * XN, 0.5, 0.5 * ZN)[0] - 76.07) < 0.01
    assert abs(dE((60, 20, 30), (63, 16, 30)) - 5) < 1e-12
    assert abs((50 + 16) / 116 - 0.569) < 0.0005 and abs(8 ** (1 / 3) - 2) < 1e-12
    print("[OK] 본문 예: 0.125 -> 42, 절반 휘도 -> 76.1, ΔE 5")

    # 주장 7
    rng = random.Random(40)
    for _ in range(1000):
        X, Y, Z = rng.uniform(0, 1), rng.uniform(0, 1), rng.uniform(0, 1.1)
        back = xyz_from_lab(*lab(X, Y, Z))
        assert close(back, (X, Y, Z), 1e-12)
    print("[OK] Lab -> XYZ 역변환으로 무작위 1,000개가 되돌아온다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
