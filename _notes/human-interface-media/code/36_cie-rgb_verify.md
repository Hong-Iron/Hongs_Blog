---
layout: "note"
title: "36_cie-rgb_verify.py"
display_title: "36_cie-rgb_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-rgb/"
parent_title: "CIE RGB 등색 함수"
description: "휴먼 인터페이스 미디어 · CIE RGB 등색 함수 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/36_cie-rgb_verify/"
---
{% raw %}
[CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CIE RGB 등색 함수 검증.

문서: 36.CIE RGB 등색 함수 (예시로 보기, 정의, 활용, 카드 C2·C3)
실행: python3 -I 36_cie-rgb_verify.py  (표준 라이브러리만 쓴다)

등색 함수 근사 (설명용):
  x_bar, y_bar, z_bar는 Wyman, Sloan, Shirley (2013)의 다중 가우스 근사(CIE 1931 2도 표준 관찰자).
  r_bar, g_bar, b_bar는 그 값에 RGB -> XYZ 행렬의 역행렬을 곱해 얻는다:
    [r g b] = 0.17697 x M^-1 [x y z],  M = [[0.49, 0.31, 0.20], [0.17697, 0.81240, 0.01063], [0, 0.01, 0.99]]
  근사이므로 표준 표와 소수 셋째 자리쯤에서 다를 수 있다. 특히 700 nm 근처처럼 값이 아주 작은 곳의 비율은 믿지 않는다.
주장:
  1. 원색 파장에서는 나머지 두 함수가 0이다: 546.1 nm에서 r_bar, b_bar, 435.8 nm에서 r_bar, g_bar (근사 오차 0.002 안).
  2. r_bar는 약 450~545 nm에서 음수이고, 가장 깊은 곳은 약 518 nm에서 약 -0.09다. 550~700 nm에서는 양수다.
  3. 세 함수의 봉우리: b_bar 약 0.32 (약 448 nm), g_bar 약 0.22 (약 542 nm), r_bar 약 0.35 (약 604 nm).
  4. 세 함수 아래 넓이가 같다(0.5% 안). 그래서 모든 파장의 세기가 같은 빛은 R = G = B다.
  5. 어느 파장에서든 뚜렷이(-0.002 아래) 음수인 함수는 많아야 하나다.
  6. 원색의 밝기 비 1 : 4.5907 : 0.0601은 행렬 둘째 줄 0.17697 : 0.81240 : 0.01063과 같다.
  7. 그라스만 법칙의 계산: 선명한 청록 + 38R = 42G + 91B 이면 선명한 청록 = -38R + 42G + 91B.
     청록(7R + 33G + 39B)과 선명한 청록을 1단위씩 섞으면 -31R + 75G + 130B다.
  8. 500 nm 단색광 1단위를 맞추는 양은 약 (-0.07, 0.09, 0.05)다.
  9. 500 nm 1단위와 600 nm 1단위가 섞인 빛의 R, G, B는 두 파장의 필요량을 더한 약 (0.27, 0.15, 0.05)다.
"""
import math

M = [[0.49, 0.31, 0.20], [0.17697, 0.81240, 0.01063], [0.0, 0.01, 0.99]]


def g(x: float, mu: float, s1: float, s2: float) -> float:
    s = s1 if x < mu else s2
    return math.exp(-0.5 * ((x - mu) / s) ** 2)


def xyz_bar(lam: float) -> tuple[float, float, float]:
    x = 1.056 * g(lam, 599.8, 37.9, 31.0) + 0.362 * g(lam, 442.0, 16.0, 26.7) - 0.065 * g(lam, 501.1, 20.4, 26.2)
    y = 0.821 * g(lam, 568.8, 46.9, 40.5) + 0.286 * g(lam, 530.9, 16.3, 31.1)
    z = 1.217 * g(lam, 437.0, 11.8, 36.0) + 0.681 * g(lam, 459.0, 26.0, 13.8)
    return x, y, z


def inv3(m: list[list[float]]) -> list[list[float]]:
    (a, b, c), (d, e, f), (p, q, r) = m
    det = a * (e * r - f * q) - b * (d * r - f * p) + c * (d * q - e * p)
    return [[(e * r - f * q) / det, (c * q - b * r) / det, (b * f - c * e) / det],
            [(f * p - d * r) / det, (a * r - c * p) / det, (c * d - a * f) / det],
            [(d * q - e * p) / det, (b * p - a * q) / det, (a * e - b * d) / det]]


MI = inv3(M)


def rgb_bar(lam: float) -> list[float]:
    v = xyz_bar(lam)
    return [0.17697 * sum(MI[i][k] * v[k] for k in range(3)) for i in range(3)]


def main() -> None:
    lams = [380 + i / 10 for i in range(4001)]   # 380~780 nm, 0.1 nm 간격
    tab = [rgb_bar(l) for l in lams]

    # 주장 1
    r, gg, b = rgb_bar(546.1)
    assert abs(r) < 0.002 and abs(b) < 0.002 and gg > 0.2, (r, gg, b)
    r, gg, b = rgb_bar(435.8)
    assert abs(r) < 0.002 and abs(gg) < 0.002 and b > 0.29, (r, gg, b)

    # 주장 2
    assert all(rgb_bar(l)[0] < 0 for l in range(450, 546))
    assert all(rgb_bar(l)[0] > 0 for l in range(550, 701))
    rmin, lmin = min((t[0], l) for t, l in zip(tab, lams))
    assert -0.095 < rmin < -0.085 and 512 < lmin < 524, (rmin, lmin)

    # 주장 3
    for k, (lo, hi), (vlo, vhi) in ((2, (440, 455), (0.31, 0.33)), (1, (535, 550), (0.21, 0.22)),
                                     (0, (595, 610), (0.34, 0.355))):
        v, l = max((t[k], l) for t, l in zip(tab, lams))
        assert vlo < v < vhi and lo < l < hi, (k, v, l)

    # 주장 4: 0.1 nm 간격 합 x 0.1 = 넓이
    areas = [sum(t[k] for t in tab) * 0.1 for k in range(3)]
    assert max(areas) / min(areas) < 1.005, areas
    # 같은 에너지 빛(I = 1)의 R, G, B
    assert max(areas) - min(areas) < 0.1

    # 주장 5
    assert all(sum(1 for v in t if v < -0.002) <= 1 for t in tab)

    # 주장 6
    assert abs(M[1][1] / M[1][0] - 4.5907) < 2e-4 and abs(M[1][2] / M[1][0] - 0.0601) < 1e-4

    # 주장 7: 벡터 (R, G, B) 계수로 계산
    vbg_plus_38r = (38, 0, 0)
    rhs = (0, 42, 91)
    vbg = tuple(a - c for a, c in zip(rhs, vbg_plus_38r))
    assert vbg == (-38, 42, 91)
    bg = (7, 33, 39)
    assert tuple(a + c for a, c in zip(bg, vbg)) == (-31, 75, 130)

    # 주장 8
    r5, g5, b5 = rgb_bar(500)
    assert abs(r5 + 0.074) < 0.005 and abs(g5 - 0.087) < 0.005 and abs(b5 - 0.048) < 0.005, (r5, g5, b5)

    # 주장 9
    r6, g6, b6 = rgb_bar(600)
    two = (r5 + r6, g5 + g6, b5 + b6)
    assert abs(two[0] - 0.268) < 0.005 and abs(two[1] - 0.151) < 0.005 and abs(two[2] - 0.047) < 0.005, two

    print(f"r_bar 최솟값 {rmin:.4f} @ {lmin:.1f} nm, 넓이 {[round(a, 3) for a in areas]}")
    print(f"600 nm: ({r6:.3f}, {g6:.3f}, {b6:.4f}), 두 파장 합 {tuple(round(v, 3) for v in two)}")
    print(f"500 nm: ({r5:.3f}, {g5:.3f}, {b5:.3f}), 밝기 비 1 : {M[1][1] / M[1][0]:.4f} : {M[1][2] / M[1][0]:.4f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
