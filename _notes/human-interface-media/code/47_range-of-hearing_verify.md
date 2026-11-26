---
layout: "note"
title: "47_range-of-hearing_verify.py"
display_title: "47_range-of-hearing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/range-of-hearing/"
parent_title: "가청 대역"
description: "휴먼 인터페이스 미디어 · 가청 대역 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/47_range-of-hearing_verify/"
---
{% raw %}
[가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가청 대역 검증.

문서: 47.가청 대역 (예시로 보기, 정의, 활용, 확인 문제 C2·C3)
실행: python3 -I 47_range-of-hearing_verify.py  (표준 라이브러리만 쓴다)

주장
  1. 크기 범위 0~120 dB 는 세기로 10^12 배(1조 배), 음압으로 10^6 배(100만 배)다.
  2. 음압 기준 20 uPa 에서 0 dB SPL 은 20 uPa, 120 dB SPL 은 20 Pa 다.
     20 Pa 는 대기압(101,325 Pa)의 약 0.02% 다.
  3. 조용할 때 들리기 시작하는 문턱의 근사식(Terhardt 1979)으로
     30 Hz 약 60 dB, 100 Hz 약 23 dB, 1 kHz 약 3.4 dB 이고, 가장 낮은 곳은 3~4 kHz 사이(약 -5 dB)다.
     그래서 같은 40 dB SPL 이라도 30 Hz 는 안 들리고 100 Hz 와 1 kHz 는 들린다.
  4. 20 kHz 까지 담으려면 1초에 40,000번보다 많이 재야 한다(표본화 정리).
     CD 의 44,100번은 22,050 Hz 까지 담고, 20 kHz 와의 사이에 2,050 Hz 여유가 있다.
     전화의 8,000번은 4,000 Hz 까지 담아 말소리 대역 300~3,400 Hz 를 덮는다.
  5. 카드 C3: 60 dB 차이는 세기 10^6 배, 음압 10^3 배다.
  6. 20 Hz~20 kHz 는 약 10 옥타브(log2 1000 = 9.97)이고, 가시광 400~700 nm 는 주파수 비 1.75 로 한 옥타브가 안 된다.
"""
import math

P_REF = 20e-6        # Pa, 0 dB SPL
I_REF = 1e-12        # W/m^2, 0 dB IL
P_ATM = 101_325.0    # Pa, 1기압


def terhardt_db(f_hz: float) -> float:
    """조용할 때 들리기 시작하는 문턱의 근사 (dB SPL). Terhardt (1979)."""
    k = f_hz / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def main() -> None:
    # 1. 120 dB 범위
    i_ratio = 10 ** (120 / 10)
    p_ratio = 10 ** (120 / 20)
    assert i_ratio == 1e12 and abs(p_ratio - 1e6) < 1e-6
    print(f"[OK] 120 dB = 세기 {i_ratio:.0e} 배, 음압 {p_ratio:.0e} 배")

    # 2. 절대 음압
    p0, p120 = P_REF * 10 ** (0 / 20), P_REF * 10 ** (120 / 20)
    assert abs(p0 - 20e-6) < 1e-12 and abs(p120 - 20.0) < 1e-9
    share = p120 / P_ATM
    assert abs(share - 1.974e-4) < 1e-6
    i120 = I_REF * 10 ** (120 / 10)
    assert abs(i120 - 1.0) < 1e-12
    print(f"[OK] 0 dB SPL = 20 uPa, 120 dB SPL = {p120:.0f} Pa = 대기압의 {share:.4%}, 120 dB IL = {i120:.0f} W/m^2")

    # 3. 문턱 근사식
    t = {f: terhardt_db(f) for f in (30, 100, 1000)}
    assert abs(t[30] - 60.2) < 0.1 and abs(t[100] - 23.0) < 0.1 and abs(t[1000] - 3.37) < 0.01, t
    grid = [f for f in range(1000, 8001, 10)]
    fmin = min(grid, key=terhardt_db)
    assert 3000 <= fmin <= 4000 and -5.2 < terhardt_db(fmin) < -4.8, (fmin, terhardt_db(fmin))
    assert t[30] > 40 > t[100] and 40 > t[1000]
    print(f"[OK] 문턱: 30 Hz {t[30]:.1f}, 100 Hz {t[100]:.1f}, 1 kHz {t[1000]:.2f} dB, "
          f"가장 낮은 곳 {fmin} Hz {terhardt_db(fmin):.2f} dB")
    print("     40 dB SPL 에서 30 Hz 는 문턱 아래, 100 Hz 와 1 kHz 는 문턱 위")

    # 4. 표본화율
    f_max = 20_000
    assert 2 * f_max == 40_000 and 44_100 > 2 * f_max
    assert 44_100 / 2 == 22_050 and 44_100 / 2 - f_max == 2_050
    assert 8_000 / 2 == 4_000 > 3_400
    print("[OK] CD 44.1 kHz -> 22.05 kHz 까지, 여유 2,050 Hz. 전화 8 kHz -> 4 kHz 까지 (말소리 300~3,400 Hz)")

    # 5. 카드 C3
    assert 10 ** (60 / 10) == 1e6 and abs(10 ** (60 / 20) - 1e3) < 1e-9
    print("[OK] 60 dB = 세기 10^6 배, 음압 10^3 배")

    # 6. 옥타브 수 비교
    oct_hear = math.log2(20_000 / 20)
    assert abs(oct_hear - 9.97) < 0.01 and 700 / 400 == 1.75 < 2
    print(f"[OK] 가청 대역 {oct_hear:.2f} 옥타브, 가시광 주파수 비 {700 / 400}")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
