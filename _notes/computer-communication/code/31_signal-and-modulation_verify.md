---
layout: "note"
title: "31_signal-and-modulation_verify.py"
display_title: "31_signal-and-modulation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/signal-and-modulation/"
parent_title: "신호와 변조"
description: "컴퓨터 통신 · 신호와 변조 검증 코드"
permalink: "/studies/computer-communication/code/31_signal-and-modulation_verify/"
---
{% raw %}
[신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""신호의 주파수·파장 관계 검증.

문서: 31.신호와 변조 (예시, 카드 C3)
관계: 신호 속도 v = 주파수 f x 파장 lambda. 진공(공기)에서 v = 3.0e8 m/s.
"""
from fractions import Fraction as F

C = 300_000_000


def wavelength_m(f_hz, v=C):
    return F(v, f_hz)


def main():
    assert wavelength_m(1_000_000) == 300                 # AM 1 MHz -> 300 m
    assert wavelength_m(100_000_000) == 3                 # FM 100 MHz -> 3 m
    assert wavelength_m(2_400_000_000) == F(1, 8)         # 2.4 GHz -> 12.5 cm
    assert wavelength_m(5_000_000_000) == F(6, 100)       # 5 GHz -> 6 cm
    assert wavelength_m(2 * 10**14) == F(15, 10**7)       # 2e14 Hz -> 1.5 um
    print("[OK] 1 MHz 300 m, 100 MHz 3 m, 2.4 GHz 12.5 cm, 5 GHz 6 cm, 2e14 Hz 1.5 um")
    # 주파수를 10배 올리면 파장은 1/10
    for f in (10**4, 10**6, 10**8, 10**10):
        assert wavelength_m(10 * f) == wavelength_m(f) / 10
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
