---
layout: "note"
title: "49_ear-anatomy_verify.py"
display_title: "49_ear-anatomy_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/ear-anatomy/"
parent_title: "귀의 구조"
description: "휴먼 인터페이스 미디어 · 귀의 구조 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/49_ear-anatomy_verify/"
---
{% raw %}
[귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""귀의 구조 검증.

문서: 49.귀의 구조 (예시로 보기, 정의, 확인 문제 C2)
실행: python3 -I 49_ear-anatomy_verify.py  (표준 라이브러리만 쓴다)

주장
  1. 공기(약 415 Pa s/m)에서 물(약 1.48 x 10^6 Pa s/m, 공기의 약 3,600배)로 소리가 곧장 넘어가면
     에너지의 약 0.11% 만 들어가고 나머지는 되튄다. 약 -29.5 dB 다.
  2. 가운데귀의 넓이 비 약 17배와 지렛대 비 약 1.3배를 곱하면 압력이 약 22배가 되고,
     이는 약 27 dB 다.
  3. 한쪽이 막힌 길이 2.5 cm 관(외이도)의 가장 낮은 울림 주파수는 c / (4L) 로 약 3.4 kHz 다.
     이는 조용할 때 들리기 시작하는 문턱이 가장 낮은 3~4 kHz 와 겹친다.
"""
import math

RHO_AIR, C_AIR = 1.21, 343.0        # kg/m^3, m/s (약 20도)
RHO_WATER, C_WATER = 1000.0, 1480.0


def main() -> None:
    # 1. 공기 -> 물 세기 투과율 T = 4 Z1 Z2 / (Z1 + Z2)^2 (수직으로 들어갈 때)
    z1, z2 = RHO_AIR * C_AIR, RHO_WATER * C_WATER
    t = 4 * z1 * z2 / (z1 + z2) ** 2
    t_db = 10 * math.log10(t)
    assert abs(z1 - 415) < 1 and abs(z2 - 1.48e6) < 1
    assert 3500 < z2 / z1 < 3650   # 물이 공기의 약 3,600배
    assert abs(t - 0.00112) < 0.00002 and abs(t_db + 29.5) < 0.1, (t, t_db)
    print(f"[OK] Z_air = {z1:.0f}, Z_water = {z2:.3g}, 투과 {t:.3%} ({t_db:.1f} dB), 되튐 {1 - t:.2%}")

    # 2. 가운데귀의 압력 이득
    gain = 17 * 1.3
    gain_db = 20 * math.log10(gain)
    assert abs(gain - 22.1) < 1e-9 and abs(gain_db - 26.9) < 0.05
    print(f"[OK] 17 x 1.3 = {gain:.1f} 배 = {gain_db:.1f} dB")

    # 3. 외이도 울림
    f_res = C_AIR / (4 * 0.025)
    assert abs(f_res - 3430) < 1
    k = f_res / 1000
    tq = 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4   # Terhardt (1979)
    assert tq < -4.5, tq
    print(f"[OK] 외이도 울림 {f_res:.0f} Hz, 그 주파수의 문턱 근사 {tq:.1f} dB (가장 낮은 곳 근처)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
