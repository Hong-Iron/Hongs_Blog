---
layout: "note"
title: "41_yuv-ycbcr_verify.py"
display_title: "41_yuv-ycbcr_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/yuv-ycbcr/"
parent_title: "YUV와 YCbCr"
description: "휴먼 인터페이스 미디어 · YUV와 YCbCr 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/41_yuv-ycbcr_verify/"
---
{% raw %}
[YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""YUV와 YCbCr 검증.

문서: 41.YUV와 YCbCr (예시로 보기, 정의, 활용, 자주 하는 오해, 카드 C1~C3)
실행: python3 -I 41_yuv-ycbcr_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 장치 의존: 세 원색의 색도와 흰색점으로 RGB -> XYZ 행렬을 만든다. 같은 (1, 0, 0)이 sRGB 화면에서는
     (0.64, 0.33), NTSC(1953) 화면에서는 (0.67, 0.33)에 찍힌다. 같은 (1, 1, 0) 노랑도 두 화면에서 자리가 다르다.
     sRGB 삼각형의 넓이는 NTSC 삼각형의 약 71% (xy 넓이 기준).
  2. 밝기 가중치는 그 원색으로 만든 행렬의 Y 행이다.
     NTSC(1953) 원색 + C 흰색 -> (0.299, 0.587, 0.114) (BT.601), sRGB 원색 + D65 -> (0.2126, 0.7152, 0.0722) (BT.709).
  3. BT.601 8비트 YCbCr(방송 범위): Y' = 16 + 219 E_Y, Cb = 128 + 224 (B - E_Y)/1.772, Cr = 128 + 224 (R - E_Y)/1.402.
     펼친 계수 65.481, 128.553, 24.966 / -37.797, -74.203, 112.0 / 112.0, -93.786, -18.214.
     흰색 (235, 128, 128), 검정 (16, 128, 128), 빨강 (81, 90, 240), 초록 (145, 54, 34), 파랑 (41, 240, 110).
     회색이면 늘 Cb = Cr = 128. RGB 정육면체 전체에서 Y' 16~235, Cb·Cr 16~240.
  4. 아날로그 YUV: U = 0.492 (B - Y), V = 0.877 (R - Y). U는 -0.436 ~ 0.436, V는 -0.615 ~ 0.615.
  5. JPEG(JFIF) 방식(0~255 전체 범위)은 역변환으로 되돌아온다(반올림 전).
  6. 크로마 서브샘플링: 픽셀당 4:4:4 = 24비트, 4:2:2 = 16비트, 4:2:0 = 12비트. 4:2:0이어도 13~19 Mbps의 약 79~115배.
     풀HD 한 장 4:2:0 = 3,110,400 바이트(4:4:4의 절반), 초당 60장 2.986 Gbps -> 1.493 Gbps.
     카드 C2: 1280 x 720 한 장 4:4:4 = 2,764,800 바이트, 4:2:0 = 1,382,400 바이트, 4:2:2 = 1,843,200 바이트.
  7. 루마와 휘도: sRGB 값 (0.5, 0.5, 0.5) 회색의 루마는 0.5지만 실제 상대 휘도는 약 0.214.
"""
import random


def xyz_from_xy(x, y, Y=1.0):
    return x / y * Y, Y, (1 - x - y) / y * Y


def solve3(M, b):
    """가우스 소거법 (3x3)."""
    a = [row[:] + [b[i]] for i, row in enumerate(M)]
    for c in range(3):
        p = max(range(c, 3), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        for r in range(3):
            if r != c:
                f = a[r][c] / a[c][c]
                a[r] = [u - f * v for u, v in zip(a[r], a[c])]
    return [a[i][3] / a[i][i] for i in range(3)]


def rgb_to_xyz_matrix(prims, white):
    """원색 색도 3개와 흰색 색도로 RGB -> XYZ 행렬을 만든다(흰색의 Y = 1)."""
    cols = [xyz_from_xy(*p) for p in prims]
    P = [[cols[j][i] for j in range(3)] for i in range(3)]
    s = solve3(P, list(xyz_from_xy(*white)))
    return [[P[i][j] * s[j] for j in range(3)] for i in range(3)]


def apply(M, v):
    return [sum(M[i][j] * v[j] for j in range(3)) for i in range(3)]


def chroma(X, Y, Z):
    s = X + Y + Z
    return X / s, Y / s


def area(p, q, r):
    return abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1])) / 2


SRGB = [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)]
D65 = (0.3127, 0.3290)
NTSC = [(0.67, 0.33), (0.21, 0.71), (0.14, 0.08)]
ILL_C = (0.3101, 0.3162)
KR, KB = 0.299, 0.114
KG = 1 - KR - KB


def ycbcr601(r, g, b):
    """R, G, B는 0~1 (감마 보정된 값). 방송 범위 8비트 YCbCr (반올림 전)."""
    ey = KR * r + KG * g + KB * b
    return 16 + 219 * ey, 128 + 224 * (b - ey) / 1.772, 128 + 224 * (r - ey) / 1.402


def ycbcr_jpeg(R, G, B):
    """R, G, B는 0~255. JPEG(JFIF) 전체 범위."""
    Y = KR * R + KG * G + KB * B
    return Y, 128 + (B - Y) / 1.772, 128 + (R - Y) / 1.402


def rgb_from_jpeg(Y, Cb, Cr):
    R = Y + 1.402 * (Cr - 128)
    B = Y + 1.772 * (Cb - 128)
    G = (Y - KR * R - KB * B) / KG
    return R, G, B


def main():
    # 주장 1
    Ms = rgb_to_xyz_matrix(SRGB, D65)
    Mn = rgb_to_xyz_matrix(NTSC, ILL_C)
    rs, rn = chroma(*apply(Ms, [1, 0, 0])), chroma(*apply(Mn, [1, 0, 0]))
    assert abs(rs[0] - 0.64) < 1e-9 and abs(rn[0] - 0.67) < 1e-9
    ys, yn = chroma(*apply(Ms, [1, 1, 0])), chroma(*apply(Mn, [1, 1, 0]))
    assert abs(ys[0] - 0.4193) < 5e-4 and abs(ys[1] - 0.5053) < 5e-4, ys
    assert abs(yn[0] - ys[0]) > 0.005 or abs(yn[1] - ys[1]) > 0.005, (ys, yn)
    ratio = area(*SRGB) / area(*NTSC)
    assert abs(ratio - 0.708) < 0.001, ratio
    print(f"[OK] (1,0,0): sRGB {rs[0]:.2f},{rs[1]:.2f} / NTSC {rn[0]:.2f},{rn[1]:.2f}; "
          f"(1,1,0): sRGB ({ys[0]:.3f}, {ys[1]:.3f}) / NTSC ({yn[0]:.3f}, {yn[1]:.3f}); 넓이 비 {ratio:.3f}")

    # 주장 2
    yrow_n, yrow_s = Mn[1], Ms[1]
    assert all(abs(a - b) < 0.0015 for a, b in zip(yrow_n, (0.299, 0.587, 0.114))), yrow_n
    assert all(abs(a - b) < 0.0002 for a, b in zip(yrow_s, (0.2126, 0.7152, 0.0722))), yrow_s
    print(f"[OK] 밝기 가중치: NTSC 원색 {[round(v, 4) for v in yrow_n]}, sRGB 원색 {[round(v, 4) for v in yrow_s]}")

    # 주장 3
    for (r, g, b), coef in [((1, 0, 0), (65.481, -37.797, 112.0)), ((0, 1, 0), (128.553, -74.203, -93.786)),
                            ((0, 0, 1), (24.966, 112.0, -18.214))]:
        y, cb, cr = ycbcr601(r, g, b)
        assert abs(y - 16 - coef[0]) < 0.001 and abs(cb - 128 - coef[1]) < 0.001 and abs(cr - 128 - coef[2]) < 0.001
    want = {(1, 1, 1): (235, 128, 128), (0, 0, 0): (16, 128, 128), (1, 0, 0): (81, 90, 240),
            (0, 1, 0): (145, 54, 34), (0, 0, 1): (41, 240, 110)}
    for rgb, w in want.items():
        got = tuple(round(v) for v in ycbcr601(*rgb))
        assert got == w, (rgb, got)
    rng = random.Random(41)
    for _ in range(1000):
        v = rng.random()
        _, cb, cr = ycbcr601(v, v, v)
        assert abs(cb - 128) < 1e-9 and abs(cr - 128) < 1e-9
    lo, hi = [999] * 3, [-999] * 3
    for r in (0, 1):
        for g in (0, 1):
            for b in (0, 1):
                for i, v in enumerate(ycbcr601(r, g, b)):
                    lo[i], hi[i] = min(lo[i], v), max(hi[i], v)
    assert abs(lo[0] - 16) < 1e-9 and abs(hi[0] - 235) < 1e-9
    assert abs(lo[1] - 16) < 1e-9 and abs(hi[1] - 240) < 1e-9 and abs(lo[2] - 16) < 1e-9 and abs(hi[2] - 240) < 1e-9
    print("[OK] BT.601 YCbCr: 계수, 다섯 색의 값, 회색 Cb=Cr=128, 범위 16~235 / 16~240")

    # 주장 4
    def yuv(r, g, b):
        y = KR * r + KG * g + KB * b
        return y, 0.492 * (b - y), 0.877 * (r - y)
    us = [yuv(r, g, b)[1] for r in (0, 1) for g in (0, 1) for b in (0, 1)]
    vs = [yuv(r, g, b)[2] for r in (0, 1) for g in (0, 1) for b in (0, 1)]
    assert abs(max(us) - 0.436) < 0.0005 and abs(min(us) + 0.436) < 0.0005
    assert abs(max(vs) - 0.615) < 0.0005 and abs(min(vs) + 0.615) < 0.0005
    print(f"[OK] YUV 범위: U ±{max(us):.3f}, V ±{max(vs):.3f}")

    # 주장 5
    for _ in range(1000):
        R, G, B = (rng.uniform(0, 255) for _ in range(3))
        back = rgb_from_jpeg(*ycbcr_jpeg(R, G, B))
        assert all(abs(u - v) < 1e-9 for u, v in zip(back, (R, G, B)))
    print("[OK] JPEG 방식 YCbCr -> RGB 역변환 1,000회")

    # 주장 6
    bpp = {"4:4:4": (4 + 4 + 4) * 8 / 4, "4:2:2": (4 + 2 + 2) * 8 / 4, "4:2:0": (4 + 1 + 1) * 8 / 4}
    assert bpp == {"4:4:4": 24, "4:2:2": 16, "4:2:0": 12}
    full = 1920 * 1080 * 24 // 8
    sub = 1920 * 1080 * 12 // 8
    assert full == 6_220_800 and sub == 3_110_400
    assert abs(full * 8 * 60 / 1e9 - 2.986) < 0.001 and abs(sub * 8 * 60 / 1e9 - 1.493) < 0.001
    assert 1280 * 720 * 3 == 2_764_800 and 1280 * 720 * 12 // 8 == 1_382_400 and 1280 * 720 * 16 // 8 == 1_843_200
    # 4:2:0으로 줄여도 HDTV 방송 전송률 13~19 Mbps보다 약 79~115배 크다
    rate = sub * 8 * 60
    assert abs(rate / 19e6 - 78.6) < 0.1 and abs(rate / 13e6 - 114.8) < 0.1
    print(f"[OK] 픽셀당 비트 {bpp}, 풀HD 한 장 {full:,} -> {sub:,} 바이트, 초당 2.986 -> 1.493 Gbps")

    # 주장 7
    lin = ((0.5 + 0.055) / 1.055) ** 2.4
    assert abs(lin - 0.214) < 0.0005
    assert abs(0.2126 * 0.5 + 0.7152 * 0.5 + 0.0722 * 0.5 - 0.5) < 1e-12
    print(f"[OK] sRGB 0.5 회색: 루마 0.5, 상대 휘도 {lin:.3f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
