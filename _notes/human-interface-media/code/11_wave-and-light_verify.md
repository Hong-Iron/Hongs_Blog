---
layout: "note"
title: "11_wave-and-light_verify.py"
display_title: "11_wave-and-light_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/wave-and-light/"
parent_title: "파동과 빛"
description: "휴먼 인터페이스 미디어 · 파동과 빛 검증 코드"
permalink: "/studies/human-interface-media/code/11_wave-and-light_verify/"
---
{% raw %}
[파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""파동과 빛 검증.

문서: 11.파동과 빛 (예시로 보기, 정의, 자주 하는 오해, 카드 C2·C3)
주장:
  1. c = f * lambda. 가시광 400~700 nm의 주파수는 약 7.5 x 10^14 ~ 4.3 x 10^14 Hz다.
     파장이 길수록 주파수는 낮다. 500 nm는 약 6.0 x 10^14 Hz다.
  2. 소리(공기 중 약 343 m/s)의 가청 범위 20 Hz ~ 20 kHz는 파장 약 17 m ~ 1.7 cm다.
  3. s(t) = A sin(2 pi f t + phi)의 한 주기 평균 제곱은 A^2 / 2다. 진폭이 2배면 세기(에너지)는 4배다.
  4. 위상 phi = pi/2만큼 밀린 사인은 코사인이다.
  5. 공간 주파수: 줄무늬 한 쌍(밝음+어두움)의 폭이 2 mm면 500 cycle/m다.
"""
import math

C_LIGHT = 299_792_458.0  # m/s
V_SOUND = 343.0  # m/s, 20도 공기


def freq_from_wavelength(lam_m: float, speed: float = C_LIGHT) -> float:
    return speed / lam_m


def mean_square(A: float, f: float, phi: float, n: int = 100_000) -> float:
    T = 1.0 / f
    total = 0.0
    for i in range(n):
        t = (i + 0.5) * T / n
        s = A * math.sin(2 * math.pi * f * t + phi)
        total += s * s
    return total / n


def main() -> None:
    f400 = freq_from_wavelength(400e-9)
    f700 = freq_from_wavelength(700e-9)
    f500 = freq_from_wavelength(500e-9)
    assert abs(f400 - 7.49e14) / 7.49e14 < 0.001
    assert abs(f700 - 4.28e14) / 4.28e14 < 0.001
    assert abs(f500 - 6.00e14) / 6.00e14 < 0.001
    assert f400 > f500 > f700
    print(f"[OK] 400 nm -> {f400:.3e} Hz, 500 nm -> {f500:.3e} Hz, 700 nm -> {f700:.3e} Hz")

    lam20 = V_SOUND / 20
    lam20k = V_SOUND / 20_000
    assert abs(lam20 - 17.15) < 0.01 and abs(lam20k - 0.01715) < 1e-5
    print(f"[OK] 소리 20 Hz -> {lam20:.2f} m, 20 kHz -> {lam20k * 100:.3f} cm")

    for A in (1.0, 2.0, 3.0):
        ms = mean_square(A, 5.0, 0.7)
        assert abs(ms - A * A / 2) < 1e-6
    ratio = mean_square(2.0, 5.0, 0.0) / mean_square(1.0, 5.0, 0.0)
    assert abs(ratio - 4.0) < 1e-9
    print("[OK] 평균 제곱 = A^2/2, 진폭 2배 -> 세기 4배")

    for i in range(100):
        t = i / 100
        assert abs(math.sin(2 * math.pi * 3 * t + math.pi / 2) - math.cos(2 * math.pi * 3 * t)) < 1e-12
    print("[OK] 위상 pi/2 -> sin이 cos가 된다")

    period_m = 2e-3
    assert abs(1 / period_m - 500) < 1e-9
    print("[OK] 줄무늬 주기 2 mm -> 500 cycle/m")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
