---
layout: "note"
title: "13_luminance-and-illuminance_verify.py"
display_title: "13_luminance-and-illuminance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/luminance-and-illuminance/"
parent_title: "휘도와 조도"
description: "휴먼 인터페이스 미디어 · 휘도와 조도 검증 코드"
permalink: "/studies/human-interface-media/code/13_luminance-and-illuminance_verify/"
---
{% raw %}
[휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""휘도와 조도 검증.

문서: 13.휘도와 조도 (예시로 보기, 정의, 카드 C2·C3)
주장:
  1. 점광원(광도 I cd)에서 거리 d m 떨어진, 빛에 수직인 면의 조도는 E = I / d^2 lx다.
     I = 100 cd이면 1 m에서 100 lx, 2 m에서 25 lx다. 거리가 2배면 조도는 1/4이다.
  2. 빛을 모든 방향으로 고르게 되쏘는 면(완전 확산면)의 휘도는 L = rho * E / pi다.
     E = 500 lx에서 흰 종이(rho = 0.8)는 약 127.3 cd/m^2, 검은 종이(rho = 0.05)는 약 8.0 cd/m^2다.
     같은 조도에서도 휘도는 다르다.
  3. 두 종이의 마이컬슨 대비 (Lmax - Lmin)/(Lmax + Lmin)는 조도와 상관없이
     (0.8 - 0.05)/(0.8 + 0.05) = 0.882로 같다.
"""
import math


def illuminance(I_cd: float, d_m: float) -> float:
    return I_cd / d_m ** 2


def luminance(rho: float, E_lx: float) -> float:
    return rho * E_lx / math.pi


def michelson(l_max: float, l_min: float) -> float:
    return (l_max - l_min) / (l_max + l_min)


def weber(l_target: float, l_background: float) -> float:
    return (l_target - l_background) / l_background


def main() -> None:
    assert illuminance(100, 1) == 100 and illuminance(100, 2) == 25
    print("[OK] 100 cd: 1 m -> 100 lx, 2 m -> 25 lx")

    white = luminance(0.8, 500)
    black = luminance(0.05, 500)
    assert abs(white - 127.32) < 0.01 and abs(black - 7.96) < 0.01
    print(f"[OK] E=500 lx: 흰 종이 {white:.1f} cd/m^2, 검은 종이 {black:.2f} cd/m^2")

    expected = (0.8 - 0.05) / (0.8 + 0.05)
    for E in (50, 500, 5000, 50000):
        c = michelson(luminance(0.8, E), luminance(0.05, E))
        assert abs(c - expected) < 1e-12
    print(f"[OK] 조도 50~50,000 lx에서 마이컬슨 대비 = {expected:.3f}로 일정")

    w = weber(luminance(0.8, 500), luminance(0.05, 500))
    assert abs(w - 15.0) < 1e-9
    print(f"[OK] 검은 배경 위 흰 종이의 웨버 대비 = {w:.1f}")

    # 카드 C2: 100 cd, 2 m -> 25 lx, 반사율 0.8 -> 약 6.4 cd/m^2
    assert abs(luminance(0.8, illuminance(100, 2)) - 6.366) < 0.001
    print(f"[OK] 카드 C2: 25 lx에서 흰 종이 {luminance(0.8, 25):.2f} cd/m^2")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
