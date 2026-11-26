---
layout: "note"
title: "38_chromaticity-diagram_verify.py"
display_title: "38_chromaticity-diagram_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-diagram/"
parent_title: "색도도"
description: "휴먼 인터페이스 미디어 · 색도도 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-diagram_verify/"
---
{% raw %}
[색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색도도 검증.

문서: 38.색도도 (예시로 보기, 정의, 증명, 예제, 자주 하는 오해, 카드 C1~C5)
실행: python3 -I 38_chromaticity-diagram_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 섞은 빛의 색도는 각 빛의 색도를 무게 S = X + Y + Z로 평균 낸 자리다(무게중심 법칙).
     무작위 빛 1,000쌍과 1,000세 쌍에서 XYZ를 더해 구한 색도와 무게 평균이 일치한다.
     휘도 Y로 무게를 주면 일반적으로 틀린다.
  2. 광원 A(0.2, 0.2), B(0.6, 0.3), C(0.1, 0.4)로 색온도 6500K의 흰색을 만드는 비율.
     - 목표를 D65 (0.3127, 0.3290)로 두면 무게(X+Y+Z) 비 = 1423 : 3544 : 4033 (/9000)
       = 0.1581 : 0.3938 : 0.4481 ≈ 1 : 2.49 : 2.83, 휘도(Y) 비 ≈ 0.0961 : 0.3591 : 0.5448 ≈ 1 : 3.74 : 5.67
     - 목표를 흑체 6500K (0.3135, 0.3237)로 두면 무게 비 ≈ 0.187 : 0.390 : 0.424, 휘도 비 ≈ 0.115 : 0.361 : 0.524
     - 목표를 (1/3, 1/3)로 두면 무게 비 1 : 4 : 4, 휘도 비 1 : 6 : 8 (그러나 이 점은 약 5,450K)
     - 무게 비 숫자를 그대로 휘도 비로 쓰면 색도가 약 (0.328, 0.310)으로 어긋난다.
  3. 흑체 궤적 근사식(Kim 등 2002)으로 6500K는 (0.3135, 0.3237).
     McCamy(1992) 근사식으로 D65의 색온도는 약 6,500K, (1/3, 1/3)은 약 5,450K.
  4. 등색 함수의 해석적 근사(Wyman, Sloan, Shirley 2013)로 구한 스펙트럼 궤적이 CIE 1931 표의
     단색광 색도와 420~640 nm에서 0.015 안으로 맞는다(양 끝 700 nm 등에서는 크게 어긋난다). 6500K 흑체 스펙트럼을 이 근사로 적분한 색도가 Kim 근사와 0.003 안에서 맞는다.
  5. 카드 C3: P(0.15, 0.06) 휘도 3과 Q(0.3, 0.6) 휘도 30을 섞으면 (0.225, 0.33).
     휘도로 무게를 주면 (0.286, 0.551)이라는 틀린 답이 나온다.
  6. 세 원색이 만드는 색의 범위는 세 꼭짓점의 삼각형이고, 무게중심 좌표(넓이 비)가 모두 0 이상인 것과 같다.
"""
import math
import random
from fractions import Fraction as F


def chroma(X, Y, Z):
    s = X + Y + Z
    return X / s, Y / s


def from_xyY(x, y, Y):
    """색도 (x, y)와 휘도 Y로 XYZ를 만든다."""
    S = Y / y
    return x * S, Y, (1 - x - y) * S


def bary(P, W):
    """삼각형 P = [A, B, C] 안에서 점 W의 무게중심 좌표 (합이 1)."""
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


def area(p, q, r):
    return abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1])) / 2


# Wyman, Sloan, Shirley (2013) 다봉 근사. g는 왼쪽과 오른쪽 폭이 다른 가우스
def _g(lam, mu, s1, s2):
    t = (lam - mu) / (s1 if lam < mu else s2)
    return math.exp(-0.5 * t * t)


def cmf(lam):
    xb = 1.056 * _g(lam, 599.8, 37.9, 31.0) + 0.362 * _g(lam, 442.0, 16.0, 26.7) - 0.065 * _g(lam, 501.1, 20.4, 26.2)
    yb = 0.821 * _g(lam, 568.8, 46.9, 40.5) + 0.286 * _g(lam, 530.9, 16.3, 31.1)
    zb = 1.217 * _g(lam, 437.0, 11.8, 36.0) + 0.681 * _g(lam, 459.0, 26.0, 13.8)
    return xb, yb, zb


def kim_planck(T):
    """Kim 등(2002)의 흑체 궤적 근사 (1667K <= T <= 25000K)."""
    if T <= 4000:
        x = -0.2661239e9 / T**3 - 0.2343589e6 / T**2 + 0.8776956e3 / T + 0.179910
    else:
        x = -3.0258469e9 / T**3 + 2.1070379e6 / T**2 + 0.2226347e3 / T + 0.240390
    if T <= 2222:
        y = -1.1063814 * x**3 - 1.34811020 * x**2 + 2.18555832 * x - 0.20219683
    elif T <= 4000:
        y = -0.9549476 * x**3 - 1.37418593 * x**2 + 2.09137015 * x - 0.16748867
    else:
        y = 3.0817580 * x**3 - 5.87338670 * x**2 + 3.75112997 * x - 0.37001483
    return x, y


def mccamy(x, y):
    """McCamy(1992)의 상관 색온도 근사."""
    n = (x - 0.3320) / (0.1858 - y)
    return 449 * n**3 + 3525 * n**2 + 6823.3 * n + 5520.33


def planck(lam_nm, T):
    lam = lam_nm * 1e-9
    h, c, k = 6.62607015e-34, 2.99792458e8, 1.380649e-23
    return 1 / (lam**5 * (math.exp(h * c / (lam * k * T)) - 1))


def main():
    rng = random.Random(38)

    # 주장 1: 무게중심 법칙
    worst_S, worst_Y = 0.0, 0.0
    for n in (2, 3):
        for _ in range(1000):
            lights = [(rng.uniform(0.01, 1), rng.uniform(0.01, 1), rng.uniform(0.01, 1)) for _ in range(n)]
            mix = chroma(*[sum(l[i] for l in lights) for i in range(3)])
            S = [sum(l) for l in lights]
            cs = [chroma(*l) for l in lights]
            wS = (sum(s * c[0] for s, c in zip(S, cs)) / sum(S), sum(s * c[1] for s, c in zip(S, cs)) / sum(S))
            Ys = [l[1] for l in lights]
            wY = (sum(t * c[0] for t, c in zip(Ys, cs)) / sum(Ys), sum(t * c[1] for t, c in zip(Ys, cs)) / sum(Ys))
            worst_S = max(worst_S, abs(wS[0] - mix[0]), abs(wS[1] - mix[1]))
            worst_Y = max(worst_Y, abs(wY[0] - mix[0]), abs(wY[1] - mix[1]))
    assert worst_S < 1e-12
    assert worst_Y > 0.05
    print(f"[OK] 무게 X+Y+Z 평균 = XYZ 합의 색도 (최대 오차 {worst_S:.1e}), 휘도 Y 무게는 최대 {worst_Y:.3f} 어긋남")

    # 주장 2: 강의 문제
    A, B, C = (0.2, 0.2), (0.6, 0.3), (0.1, 0.4)
    D65 = (0.3127, 0.3290)
    lam = bary([A, B, C], D65)
    exact = bary([(F(1, 5), F(1, 5)), (F(3, 5), F(3, 10)), (F(1, 10), F(2, 5))], (F(3127, 10000), F(329, 1000)))
    assert exact == (F(1423, 9000), F(3544, 9000), F(4033, 9000)), exact
    assert all(abs(a - b) < 5e-5 for a, b in zip(lam, (0.1581, 0.3938, 0.4481)))
    assert all(v > 0 for v in lam)
    r = [v / lam[0] for v in lam]
    assert abs(r[1] - 2.49) < 0.005 and abs(r[2] - 2.83) < 0.005
    ys = [lam[i] * P[1] for i, P in enumerate((A, B, C))]
    yr = [v / sum(ys) for v in ys]
    assert all(abs(a - b) < 5e-5 for a, b in zip(yr, (0.0961, 0.3591, 0.5448))), yr
    assert abs(ys[1] / ys[0] - 3.74) < 0.005 and abs(ys[2] / ys[0] - 5.67) < 0.005
    assert abs(sum(ys) - D65[1]) < 1e-12  # 휘도 합 / 무게 합 = y
    # 대입해 확인
    back = (sum(l * P[0] for l, P in zip(lam, (A, B, C))), sum(l * P[1] for l, P in zip(lam, (A, B, C))))
    assert abs(back[0] - D65[0]) < 1e-12 and abs(back[1] - D65[1]) < 1e-12
    # 손 풀이 중간 식: 0.1a + 0.5b = 0.2127, 0.2a + 0.1b = 0.071
    assert abs(0.1 * lam[0] + 0.5 * lam[1] - 0.2127) < 1e-12 and abs(0.2 * lam[0] + 0.1 * lam[1] - 0.071) < 1e-12
    # 넓이 비로도 같다
    T_abc = area(A, B, C)
    areas = (area(D65, B, C) / T_abc, area(A, D65, C) / T_abc, area(A, B, D65) / T_abc)
    assert all(abs(a - b) < 1e-12 for a, b in zip(areas, lam))
    assert abs(T_abc - 0.045) < 1e-12
    print(f"[OK] D65: 무게 비 {lam[0]:.4f} : {lam[1]:.4f} : {lam[2]:.4f} (1 : {r[1]:.2f} : {r[2]:.2f}), "
          f"휘도 비 {yr[0]:.4f} : {yr[1]:.4f} : {yr[2]:.4f} (1 : {ys[1]/ys[0]:.2f} : {ys[2]/ys[0]:.2f})")

    BB = (0.3135, 0.3237)
    lb = bary([A, B, C], BB)
    yb = [lb[i] * P[1] for i, P in enumerate((A, B, C))]
    yb = [v / sum(yb) for v in yb]
    assert all(abs(a - b) < 5e-4 for a, b in zip(lb, (0.187, 0.390, 0.424))), lb
    assert all(abs(a - b) < 5e-4 for a, b in zip(yb, (0.115, 0.361, 0.524))), yb
    print(f"[OK] 흑체 6500K: 무게 비 {lb[0]:.3f} : {lb[1]:.3f} : {lb[2]:.3f}, 휘도 비 {yb[0]:.3f} : {yb[1]:.3f} : {yb[2]:.3f}")

    le = bary([(F(1, 5), F(1, 5)), (F(3, 5), F(3, 10)), (F(1, 10), F(2, 5))], (F(1, 3), F(1, 3)))
    assert le == (F(1, 9), F(4, 9), F(4, 9))
    ye = [le[0] * F(1, 5), le[1] * F(3, 10), le[2] * F(2, 5)]
    assert [v / ye[0] for v in ye] == [1, 6, 8]
    print("[OK] (1/3, 1/3)이면 무게 비 1 : 4 : 4, 휘도 비 1 : 6 : 8")

    # 무게 비 숫자를 휘도로 잘못 쓰면
    S_wrong = [lam[i] / P[1] for i, P in enumerate((A, B, C))]
    w = [s / sum(S_wrong) for s in S_wrong]
    wrong = (sum(a * P[0] for a, P in zip(w, (A, B, C))), sum(a * P[1] for a, P in zip(w, (A, B, C))))
    assert abs(wrong[0] - 0.328) < 0.0005 and abs(wrong[1] - 0.310) < 0.0005, wrong
    print(f"[OK] 무게 비를 휘도 비로 착각하면 ({wrong[0]:.3f}, {wrong[1]:.3f})")

    # 주장 3: 색온도
    kx, ky = kim_planck(6500)
    assert abs(kx - 0.3135) < 5e-5 and abs(ky - 0.3237) < 5e-5, (kx, ky)
    t_d65 = mccamy(*D65)
    t_e = mccamy(1 / 3, 1 / 3)
    assert 6450 < t_d65 < 6550 and 5400 < t_e < 5500, (t_d65, t_e)
    # 흑체 궤적은 온도가 오를수록 x가 줄어든다(빨강 쪽 -> 파랑 쪽)
    xs = [kim_planck(T)[0] for T in (2000, 3000, 4000, 5000, 6500, 10000)]
    assert all(a > b for a, b in zip(xs, xs[1:]))
    print(f"[OK] 흑체 6500K ≈ ({kx:.4f}, {ky:.4f}), D65의 색온도 ≈ {t_d65:.0f}K, (1/3, 1/3)의 색온도 ≈ {t_e:.0f}K")

    # 주장 4: 해석적 근사의 스펙트럼 궤적
    # CIE 1931 2도 표준 관찰자의 단색광 색도(표준표 값). 근사는 420~640 nm에서만 표와 0.015 안으로 맞는다.
    table = {420: (0.1714, 0.0051), 440: (0.1644, 0.0109), 450: (0.1566, 0.0177), 460: (0.1440, 0.0297),
             470: (0.1241, 0.0578), 480: (0.0913, 0.1327), 490: (0.0454, 0.2950), 500: (0.0082, 0.5384),
             510: (0.0139, 0.7502), 520: (0.0743, 0.8338), 530: (0.1547, 0.8059), 540: (0.2296, 0.7543),
             550: (0.3016, 0.6923), 560: (0.3731, 0.6245), 570: (0.4441, 0.5547), 580: (0.5125, 0.4866),
             590: (0.5752, 0.4242), 600: (0.6270, 0.3725), 610: (0.6658, 0.3340), 620: (0.6915, 0.3083),
             630: (0.7079, 0.2920), 640: (0.7190, 0.2809)}
    worst = 0.0
    for l, (tx, ty) in table.items():
        cx, cy = chroma(*cmf(l))
        worst = max(worst, abs(cx - tx), abs(cy - ty))
    assert worst < 0.015, worst
    # 양 끝에서는 근사가 어긋난다: 700 nm 표준값 (0.7347, 0.2653), 근사는 0.1 넘게 벗어남
    assert abs(chroma(*cmf(700))[0] - 0.7347) > 0.1
    XYZ = [0.0, 0.0, 0.0]
    for l in range(380, 781):
        p = planck(l, 6500)
        for i, v in enumerate(cmf(l)):
            XYZ[i] += p * v
    px, py = chroma(*XYZ)
    assert abs(px - kx) < 0.003 and abs(py - ky) < 0.003, (px, py)
    print(f"[OK] 근사 궤적 최대 오차 {worst:.4f}, 근사로 적분한 6500K 흑체 ({px:.4f}, {py:.4f})")

    # 주장 5: 카드 C3
    P, Q = from_xyY(0.15, 0.06, 3), from_xyY(0.3, 0.6, 30)
    assert abs(sum(P) - 50) < 1e-9 and abs(sum(Q) - 50) < 1e-9
    m = chroma(P[0] + Q[0], P[1] + Q[1], P[2] + Q[2])
    assert abs(m[0] - 0.225) < 1e-12 and abs(m[1] - 0.33) < 1e-12
    wy = ((3 * 0.15 + 30 * 0.3) / 33, (3 * 0.06 + 30 * 0.6) / 33)
    assert abs(wy[0] - 0.2864) < 5e-5 and abs(wy[1] - 0.5509) < 5e-5, wy
    print(f"[OK] C3: 섞은 색 ({m[0]:.3f}, {m[1]:.3f}), 휘도 무게로 틀린 답 ({wy[0]:.3f}, {wy[1]:.3f})")

    # 주장 6: 안쪽 판정 = 무게중심 좌표가 모두 0 이상 (sRGB 원색으로 확인)
    R, G, Bl = (0.64, 0.33), (0.30, 0.60), (0.15, 0.06)
    assert all(v > 0 for v in bary([R, G, Bl], D65))
    out = bary([R, G, Bl], chroma(*cmf(500)))   # 500 nm 청록은 sRGB 삼각형 밖
    assert min(out) < 0
    inside = 0
    for _ in range(20000):
        pt = (rng.random(), rng.random())
        lam3 = bary([R, G, Bl], pt)
        in_by_area = abs(area(pt, G, Bl) + area(R, pt, Bl) + area(R, G, pt) - area(R, G, Bl)) < 1e-12
        assert (min(lam3) >= 0) == in_by_area
        inside += in_by_area
    assert inside > 0
    print("[OK] 삼각형 안 <=> 무게중심 좌표가 모두 0 이상 (무작위 점 20,000개)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
