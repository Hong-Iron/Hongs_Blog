---
layout: "note"
title: "42_xyz-vs-lab_verify.py"
display_title: "42_xyz-vs-lab_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/xyz-vs-lab/"
parent_title: "CIE XYZ와 CIE Lab 비교"
description: "휴먼 인터페이스 미디어 · CIE XYZ와 CIE Lab 비교 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/42_xyz-vs-lab_verify/"
---
{% raw %}
[CIE XYZ와 CIE Lab 비교](/Hongs_Blog/studies/human-interface-media/xyz-vs-lab/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CIE XYZ와 CIE Lab 비교 검증.

문서: 42.CIE XYZ와 CIE Lab 비교 (어느 쪽일까 카드 C1~C3, 결정적 차이 표)
실행: python3 -I 42_xyz-vs-lab_verify.py  (표준 라이브러리만 쓴다)
기준 백색 D65 (0.95047, 1, 1.08883), sRGB(선형) -> XYZ 행렬은 IEC 61966-2-1.

주장:
  1. sRGB 빨강과 초록 빛을 반씩 섞은 색: XYZ를 평균 낸 뒤 Lab으로 바꾸면 (73.8, -17.1, 75.0),
     두 Lab 값을 평균 내면 (70.5, -3.0, 75.2). 둘의 ΔE는 약 14.4로 눈에 띄게 다르다.
     두 빛을 다 켠 색의 Lab은 (97.1, -21.6, 94.5)인데 두 Lab 값을 더하면 L*가 141로 100을 넘는다.
  2. 초록과 파랑을 섞어 가는 길(양을 0~1로 바꿈)은 색도도에서 곧은 선분이지만,
     Lab에서는 두 끝을 잇는 직선에서 최대 약 26만큼 휜다.
  3. 눈에 고르게 보이는 회색 10단계(L* 10, 20, ..., 100)의 휘도 Y/Yn은
     0.0113, 0.0299, 0.0624, 0.1125, 0.1842, 0.2812, 0.4075, 0.5668, 0.7630, 1.0.
     휘도 간격은 0.019에서 0.237까지 벌어진다.
  4. Lab은 기준 흰색에 따라 값이 바뀐다: 같은 XYZ도 기준 흰색을 D65에서 E(1, 1, 1)로 바꾸면 a*, b*가 달라진다.
     XYZ는 기준 흰색 없이 정해진다.
"""
import math

D = 6 / 29
M = [[0.4124564, 0.3575761, 0.1804375],
     [0.2126729, 0.7151522, 0.0721750],
     [0.0193339, 0.1191920, 0.9503041]]


def f(t):
    return t ** (1 / 3) if t > D**3 else t / (3 * D * D) + 4 / 29


def finv(u):
    return u**3 if u > D else 3 * D * D * (u - 4 / 29)


def lab(X, Y, Z, white=(0.95047, 1.0, 1.08883)):
    fx, fy, fz = f(X / white[0]), f(Y / white[1]), f(Z / white[2])
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def xyz(r, g, b):
    return [sum(M[i][j] * c for j, c in enumerate((r, g, b))) for i in range(3)]


def chroma(v):
    s = sum(v)
    return v[0] / s, v[1] / s


def dist_to_line(P, A, B):
    v = [b - a for a, b in zip(A, B)]
    w = [p - a for a, p in zip(A, P)]
    t = sum(x * y for x, y in zip(v, w)) / sum(x * x for x in v)
    q = [a + t * x for a, x in zip(A, v)]
    return math.dist(P, q)


def main():
    R, G, B = xyz(1, 0, 0), xyz(0, 1, 0), xyz(0, 0, 1)

    # 주장 1
    mix = lab(*[(a + b) / 2 for a, b in zip(R, G)])
    avg = [(a + b) / 2 for a, b in zip(lab(*R), lab(*G))]
    d = math.dist(mix, avg)
    assert all(abs(a - b) < 0.05 for a, b in zip(mix, (73.8, -17.1, 75.0))), mix
    assert all(abs(a - b) < 0.05 for a, b in zip(avg, (70.5, -3.0, 75.2))), avg
    assert abs(d - 14.4) < 0.1, d
    both = lab(*[a + b for a, b in zip(R, G)])
    added = [a + b for a, b in zip(lab(*R), lab(*G))]
    assert all(abs(a - b) < 0.05 for a, b in zip(both, (97.1, -21.6, 94.5))), both
    assert added[0] > 140
    print(f"[OK] 빨강+초록 반씩: XYZ 평균의 Lab {tuple(round(v, 1) for v in mix)}, "
          f"Lab 평균 {tuple(round(v, 1) for v in avg)}, ΔE {d:.1f}; Lab을 더하면 L* {added[0]:.0f}")

    # 주장 2
    path_xyz = [[t * a + (1 - t) * b for a, b in zip(G, B)] for t in [i / 200 for i in range(201)]]
    xy = [chroma(v) for v in path_xyz]
    dev_xy = max(dist_to_line(p, xy[0], xy[-1]) for p in xy)
    labs = [lab(*v) for v in path_xyz]
    dev_lab = max(dist_to_line(p, labs[0], labs[-1]) for p in labs)
    assert dev_xy < 1e-9 and abs(dev_lab - 26.0) < 0.2, (dev_xy, dev_lab)
    print(f"[OK] 초록~파랑 섞는 길: 색도도에서 직선(어긋남 {dev_xy:.1e}), Lab에서 최대 {dev_lab:.1f} 휨")

    # 주장 3
    ys = [finv((L + 16) / 116) for L in range(10, 101, 10)]
    want = [0.0113, 0.0299, 0.0624, 0.1125, 0.1842, 0.2812, 0.4075, 0.5668, 0.7630, 1.0]
    assert all(abs(a - b) < 6e-5 for a, b in zip(ys, want)), ys
    gaps = [b - a for a, b in zip(ys, ys[1:])]
    assert abs(gaps[0] - 0.019) < 0.001 and abs(gaps[-1] - 0.237) < 0.001
    print(f"[OK] L* 10단계의 휘도 {[round(v, 4) for v in ys]}, 간격 {gaps[0]:.3f} ~ {gaps[-1]:.3f}")

    # 주장 4
    c = xyz(0.2, 0.5, 0.3)
    l65 = lab(*c)
    le = lab(*c, white=(1.0, 1.0, 1.0))
    assert abs(l65[0] - le[0]) < 1e-12 and (abs(l65[1] - le[1]) > 1 or abs(l65[2] - le[2]) > 1)
    print(f"[OK] 같은 XYZ, 기준 흰색 D65 -> {tuple(round(v, 1) for v in l65)}, E -> {tuple(round(v, 1) for v in le)}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
