---
layout: "note"
title: "37_cie-xyz_verify.py"
display_title: "37_cie-xyz_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-xyz/"
parent_title: "CIE XYZ"
description: "휴먼 인터페이스 미디어 · CIE XYZ 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/37_cie-xyz_verify/"
---
{% raw %}
[CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CIE XYZ 검증.

문서: 37.CIE XYZ (예시로 보기, 정의, 증명, 예제, 카드 C2~C5)
실행: python3 -I 37_cie-xyz_verify.py  (표준 라이브러리만 쓴다)

행렬: [X Y Z] = (1/0.17697) x M x [R G B],  M = [[0.49, 0.31, 0.20], [0.17697, 0.81240, 0.01063], [0, 0.01, 0.99]]
등색 함수 근사 (설명용): x_bar, y_bar, z_bar는 Wyman, Sloan, Shirley (2013)의 다중 가우스 근사.
V(lambda) 표: CIE 1924 명소시 값 10 nm 간격 (33_luminous-efficiency_verify.py와 같은 표).
주장 (증명된 것):
  1. M의 각 줄의 합이 1이다. 그래서 R = G = B이면 X = Y = Z이고, 색도 x = y = z = 1/3이다.
  2. Y = R + 4.5907 G + 0.0601 B. 둘째 줄은 세 원색의 밝기 비다.
  3. CIE RGB 원색의 색도: R (0.7347, 0.2653), G (0.2738, 0.7174), B (0.1666, 0.0089).
     표준 스펙트럼 궤적의 700, 546.1, 435.8 nm 색도와 소수 넷째 자리까지 같다.
  4. 선명한 청록 (-38, 42, 91)은 XYZ로 (71.20, 160.27, 511.44)로 모두 양수다. 청록 (7, 33, 39)은 (121.26, 160.83, 220.04).
  5. XYZ에서 두 색을 섞으면 값이 더해지고, 섞은 색의 색도는 두 색도를 (X + Y + Z)로 무게를 매겨 평균한 점이다.
  6. xyY에서 되돌리기: X = xY/y, Z = (1 - x - y)Y/y.
  7. 행렬식이 0이 아니어서 XYZ와 RGB는 서로 되돌릴 수 있다.
  12. 카드 C2: CIE RGB 초록 원색 (0, 1, 0)은 XYZ (1.7517, 4.5906, 0.0565), 색도 (0.2738, 0.7174).
      예제의 빨강 원색 (1, 0, 0)은 XYZ (2.7688, 1, 0), 같은 에너지 흰빛 (1, 1, 1)은 (5.6507, 5.6507, 5.6507).
      예제 표의 XYZ (1, 0, 0)은 RGB (0.4185, -0.0912, 0.0009), (-1, 2, 1)은 RGB (-0.8186, 0.6117, 0.1726), 색도 (-0.5, 1).
주장 (근사 곡선으로 실험한 것):
  8. 380~780 nm에서 x_bar, y_bar, z_bar는 모두 0 이상이다.
  9. y_bar는 V(lambda) 표와 0.008 안에서 같다.
  10. 650 nm 이상에서 z_bar는 1e-6보다 작다.
  11. 세 함수 아래 넓이가 0.2% 안에서 같다(같은 에너지 빛은 X = Y = Z).
"""
import math

M = [[0.49, 0.31, 0.20], [0.17697, 0.81240, 0.01063], [0.0, 0.01, 0.99]]
V = {380: 0.000039, 390: 0.00012, 400: 0.000396, 410: 0.00121, 420: 0.004, 430: 0.0116,
     440: 0.023, 450: 0.038, 460: 0.06, 470: 0.09098, 480: 0.13902, 490: 0.20802,
     500: 0.323, 510: 0.503, 520: 0.71, 530: 0.862, 540: 0.954, 550: 0.99495, 555: 1.0,
     560: 0.995, 570: 0.952, 580: 0.87, 590: 0.757, 600: 0.631, 610: 0.503, 620: 0.381,
     630: 0.265, 640: 0.175, 650: 0.107, 660: 0.061, 670: 0.032, 680: 0.017, 690: 0.00821,
     700: 0.004102}


def to_xyz(r: float, g: float, b: float) -> tuple[float, float, float]:
    return tuple((row[0] * r + row[1] * g + row[2] * b) / 0.17697 for row in M)


def chroma(X: float, Y: float, Z: float) -> tuple[float, float]:
    s = X + Y + Z
    return X / s, Y / s


def gl(x: float, mu: float, s1: float, s2: float) -> float:
    s = s1 if x < mu else s2
    return math.exp(-0.5 * ((x - mu) / s) ** 2)


def xyz_bar(lam: float) -> tuple[float, float, float]:
    x = 1.056 * gl(lam, 599.8, 37.9, 31.0) + 0.362 * gl(lam, 442.0, 16.0, 26.7) - 0.065 * gl(lam, 501.1, 20.4, 26.2)
    y = 0.821 * gl(lam, 568.8, 46.9, 40.5) + 0.286 * gl(lam, 530.9, 16.3, 31.1)
    z = 1.217 * gl(lam, 437.0, 11.8, 36.0) + 0.681 * gl(lam, 459.0, 26.0, 13.8)
    return x, y, z


def inv3(m: list[list[float]]) -> list[list[float]]:
    (a, b, c), (d, e, f), (p, q, r) = m
    det = a * (e * r - f * q) - b * (d * r - f * p) + c * (d * q - e * p)
    return [[(e * r - f * q) / det, (c * q - b * r) / det, (b * f - c * e) / det],
            [(f * p - d * r) / det, (a * r - c * p) / det, (c * d - a * f) / det],
            [(d * q - e * p) / det, (b * p - a * q) / det, (a * e - b * d) / det]]


def det3(m: list[list[float]]) -> float:
    (a, b, c), (d, e, f), (p, q, r) = m
    return a * (e * r - f * q) - b * (d * r - f * p) + c * (d * q - e * p)


def main() -> None:
    # 주장 1
    assert all(abs(sum(row) - 1.0) < 1e-12 for row in M)
    X, Y, Z = to_xyz(1, 1, 1)
    assert abs(X - Y) < 1e-12 and abs(Y - Z) < 1e-12 and abs(X - 5.6507) < 1e-4
    x, y = chroma(X, Y, Z)
    assert abs(x - 1 / 3) < 1e-12 and abs(y - 1 / 3) < 1e-12

    # 주장 2
    for rgb in ((1, 0, 0), (0, 1, 0), (0, 0, 1), (0.3, 0.5, 0.2)):
        _, Yv, _ = to_xyz(*rgb)
        assert abs(Yv - (rgb[0] + 4.5907 * rgb[1] + 0.0601 * rgb[2])) < 2e-4, rgb

    # 주장 3: 표준 스펙트럼 궤적 (CIE 1931 2도) 700, 546.1, 435.8 nm의 색도
    std = {"R": (0.73469, 0.26531), "G": (0.27368, 0.71743), "B": (0.16654, 0.00888)}
    for name, rgb in (("R", (1, 0, 0)), ("G", (0, 1, 0)), ("B", (0, 0, 1))):
        cx, cy = chroma(*to_xyz(*rgb))
        assert abs(cx - std[name][0]) < 1e-4 and abs(cy - std[name][1]) < 1e-4, (name, cx, cy)

    # 주장 4
    vbg = to_xyz(-38, 42, 91)
    assert all(v > 0 for v in vbg)
    assert all(abs(a - b) < 0.01 for a, b in zip(vbg, (71.20, 160.27, 511.44))), vbg
    bg = to_xyz(7, 33, 39)
    assert all(abs(a - b) < 0.01 for a, b in zip(bg, (121.26, 160.83, 220.04))), bg

    # 주장 5: 섞기 = 더하기, 색도는 무게 중심
    mix = tuple(a + b for a, b in zip(vbg, bg))
    s1, s2 = sum(vbg), sum(bg)
    c1, c2 = chroma(*vbg), chroma(*bg)
    cm = chroma(*mix)
    expect = tuple((s1 * a + s2 * b) / (s1 + s2) for a, b in zip(c1, c2))
    assert all(abs(a - b) < 1e-12 for a, b in zip(cm, expect))

    # 주장 6
    x6, y6 = chroma(*bg)
    Y6 = bg[1]
    assert abs(x6 * Y6 / y6 - bg[0]) < 1e-9 and abs((1 - x6 - y6) * Y6 / y6 - bg[2]) < 1e-9

    # 주장 12 (카드 C2와 예제)
    gx = to_xyz(0, 1, 0)
    assert all(abs(a - b) < 1e-4 for a, b in zip(gx, (1.7517, 4.5906, 0.0565))), gx
    assert all(abs(a - b) < 1e-4 for a, b in zip(chroma(*gx), (0.2738, 0.7174)))
    rx = to_xyz(1, 0, 0)
    assert all(abs(a - b) < 1e-4 for a, b in zip(rx, (2.7688, 1.0, 0.0))), rx
    # 선명한 청록의 색도 (0.0958, 0.2157), 청록 (0.2415, 0.3203)
    assert all(abs(a - b) < 1e-4 for a, b in zip(chroma(*vbg), (0.0958, 0.2157)))
    assert all(abs(a - b) < 1e-4 for a, b in zip(chroma(*bg), (0.2415, 0.3203)))

    # 예제 표: XYZ (1, 0, 0)과 (-1, 2, 1)을 RGB로 되돌린 값, (-1, 2, 1)의 색도
    mi = inv3(M)
    back = lambda v: tuple(0.17697 * sum(mi[i][k] * v[k] for k in range(3)) for i in range(3))
    assert all(abs(a - b) < 1e-4 for a, b in zip(back((1, 0, 0)), (0.4185, -0.0912, 0.0009)))
    assert all(abs(a - b) < 1e-4 for a, b in zip(back((-1, 2, 1)), (-0.8186, 0.6117, 0.1726)))
    assert chroma(-1, 2, 1) == (-0.5, 1.0)
    # 되돌린 RGB를 다시 XYZ로 보내면 처음 값
    assert all(abs(a - b) < 1e-12 for a, b in zip(to_xyz(*back((1, 0, 0))), (1, 0, 0)))

    # 주장 7
    assert abs(det3(M)) > 0.1

    # 주장 8~11 (근사 곡선, 0.1 nm 간격)
    lams = [380 + i / 10 for i in range(4001)]
    tab = [xyz_bar(l) for l in lams]
    assert all(min(t) >= 0 for t in tab)
    dev = max(abs(xyz_bar(l)[1] - v) for l, v in V.items())
    assert dev < 0.008, dev
    assert max(xyz_bar(l)[2] for l in range(650, 781)) < 1e-6
    areas = [sum(t[k] for t in tab) * 0.1 for k in range(3)]
    assert max(areas) / min(areas) < 1.002, areas

    print("원색의 색도:", {n: tuple(round(v, 4) for v in chroma(*to_xyz(*rgb)))
                        for n, rgb in (("R", (1, 0, 0)), ("G", (0, 1, 0)), ("B", (0, 0, 1)))})
    print("선명한 청록 XYZ:", tuple(round(v, 2) for v in vbg), " 청록 XYZ:", tuple(round(v, 2) for v in bg))
    print(f"y_bar와 V 최대 차이 {dev:.4f}, 넓이 {[round(a, 2) for a in areas]}, 행렬식 {det3(M):.4f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
