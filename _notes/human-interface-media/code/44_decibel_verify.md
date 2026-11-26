---
layout: "note"
title: "44_decibel_verify.py"
display_title: "44_decibel_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel/"
parent_title: "데시벨"
description: "휴먼 인터페이스 미디어 · 데시벨 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel_verify/"
---
{% raw %}
[데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데시벨 검증.

문서: 44.데시벨 (예시로 보기, 정의, 원본 오류 의심, 증명, 예제, 확인 문제 C1~C5)
실행: python3 -I 44_decibel_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 기준값의 단위 환산. 1 Pa = 10 dyn/cm^2, 1 W/m^2 = 10^-4 W/cm^2.
     표준 기준 음압 20 uPa = 2e-4 dyn/cm^2, 기준 세기 1e-16 W/cm^2 = 1e-12 W/m^2.
     원본의 0.002 dyn/cm^2는 200 uPa로, 표준값의 10배(20 dB 차이)다.
  2. 세기와 음압의 관계 I = P^2 / (rho c). 공기(20 도, rho = 1.204 kg/m^3, c = 343.2 m/s)에서
     rho c = 413 Pa.s/m. P_r = 20 uPa를 세기로 바꾸면 0.97e-12 W/m^2로 I_r과 0.14 dB 안에서 맞는다.
     원본 값 200 uPa를 쓰면 I_r의 약 97배가 되어 dB IL과 dB SPL이 약 20 dB 어긋난다.
  3. 10 log(I/I_r) = 20 log(P/P_r) (I_r = P_r^2 / (rho c)일 때, 아무 P에서나).
  4. 세기 2배 = +3.01 dB, 음압 2배 = +6.02 dB, 세기 10배 = +10 dB, 음압 10배 = +20 dB.
  5. 상대 진폭 표: 1, 10, 100, 1000, 1e5, 1e6, 1e7 -> 0, 20, 40, 60, 100, 120, 140 dB.
  6. 서로 상관없는 두 소리는 세기가 더해진다: 60 + 60 dB = 63.01 dB, 60 + 50 dB = 60.41 dB.
     같은 신호를 같은 위상으로 겹치면 음압이 더해져 66.02 dB, 반대 위상이면 상쇄된다.
     (두 사인파의 평균 제곱을 수치 적분해 확인)
  7. 점음원은 거리 2배마다 -6.02 dB (30 dB -> 23.98 dB, 거리 절반이면 36.02 dB),
     선음원은 -3.01 dB.
  8. 60 dB SPL의 실효 음압은 0.02 Pa(사인파의 봉우리 0.0283 Pa), 대기압 101,325 Pa의 약 2e-7.
  9. dB HL 예: 문턱이 35 dB SPL인 주파수에서 40 dB SPL 소리는 5 dB HL, 문턱이 0 dB SPL이면 40 dB HL.
  10. 같은 소리 n개(서로 상관없음)는 +10 log10 n: 10개면 +10 dB.
카드:
  C1 기준값과 식, C3 70 + 70 = 73.01 dB, 70 + 60 = 70.41 dB, 점음원 거리 4배 -12.04 dB,
  C4 같은 위상 66.02 dB와 반대 위상 상쇄, C5 HL 비교.
"""
import math

RHO = 1.204        # 공기 밀도, kg/m^3 (20 도, 1기압)
C_AIR = 343.2      # 음속, m/s
Z = RHO * C_AIR    # 공기의 특성 임피던스, Pa.s/m
P_R = 20e-6        # 표준 기준 음압, Pa (실효값)
I_R_SI = 1e-12     # 기준 세기, W/m^2
P_ATM = 101325.0   # 1기압, Pa


def db_il(i_w_m2: float) -> float:
    return 10 * math.log10(i_w_m2 / I_R_SI)


def db_spl(p_pa: float) -> float:
    return 20 * math.log10(p_pa / P_R)


def add_incoherent(*levels: float) -> float:
    return 10 * math.log10(sum(10 ** (L / 10) for L in levels))


def mean_square(signal, T: float, n: int = 20000) -> float:
    """구간 [0, T)에서 signal(t)^2의 평균 (중점 규칙)."""
    h = T / n
    return sum(signal((k + 0.5) * h) ** 2 for k in range(n)) / n


def close(a: float, b: float, tol: float) -> bool:
    return abs(a - b) <= tol


def main() -> None:
    # 1. 단위 환산
    dyn_per_cm2_per_pa = 1e5 / 1e4                  # 1 N = 1e5 dyn, 1 m^2 = 1e4 cm^2
    assert dyn_per_cm2_per_pa == 10
    pr_dyn = P_R * dyn_per_cm2_per_pa
    assert close(pr_dyn, 2e-4, 1e-15)
    assert close(1e-16 * 1e4, I_R_SI, 1e-25)        # W/cm^2 -> W/m^2
    slide_pr_pa = 0.002 / dyn_per_cm2_per_pa
    assert close(slide_pr_pa, 200e-6, 1e-15)
    assert close(20 * math.log10(slide_pr_pa / P_R), 20.0, 1e-9)
    print(f"[OK] 20 uPa = {pr_dyn:.0e} dyn/cm^2, 원본 0.002 dyn/cm^2 = {slide_pr_pa * 1e6:.0f} uPa (표준의 10배, +20 dB)")

    # 2. I = P^2 / Z 로 두 기준의 짝 맞추기
    assert close(Z, 413.2, 0.1)
    i_from_pr = P_R ** 2 / Z
    assert close(i_from_pr, 0.968e-12, 0.001e-12)
    assert abs(db_il(i_from_pr)) < 0.15
    i_from_slide = slide_pr_pa ** 2 / Z
    assert close(i_from_slide / I_R_SI, 96.8, 0.1)
    assert close(db_il(i_from_slide), 19.86, 0.01)
    print(f"[OK] rho c = {Z:.0f}, 20 uPa -> {i_from_pr:.3e} W/m^2 ({db_il(i_from_pr):+.2f} dB IL), "
          f"200 uPa -> I_r의 {i_from_slide / I_R_SI:.1f}배 ({db_il(i_from_slide):.2f} dB IL)")

    # 3. 기준을 짝지으면 IL과 SPL이 같은 숫자
    i_r_matched = P_R ** 2 / Z
    for p in (1e-5, 2e-5, 3.7e-3, 0.02, 0.2, 1.0, 20.0, 200.0):
        il = 10 * math.log10((p ** 2 / Z) / i_r_matched)
        assert close(il, db_spl(p), 1e-9)
    print("[OK] I_r = P_r^2/(rho c)이면 10 log(I/I_r) = 20 log(P/P_r) (음압 8개)")

    # 4. 2배, 10배
    assert close(10 * math.log10(2), 3.0103, 1e-4) and close(20 * math.log10(2), 6.0206, 1e-4)
    assert close(10 * math.log10(10), 10, 1e-12) and close(20 * math.log10(10), 20, 1e-12)
    print("[OK] 세기 2배 +3.01 dB, 음압 2배 +6.02 dB, 세기 10배 +10 dB, 음압 10배 +20 dB")

    # 5. 상대 진폭 표
    table = [(1, 0), (10, 20), (100, 40), (1000, 60), (1e5, 100), (1e6, 120), (1e7, 140)]
    for amp, dbv in table:
        assert close(20 * math.log10(amp), dbv, 1e-9)
    print("[OK] 상대 진폭 1~1e7 -> 0~140 dB (20 log)")

    # 6. 소리 더하기
    assert close(add_incoherent(60, 60), 63.0103, 1e-4)
    assert close(add_incoherent(60, 50), 60.4139, 1e-4)
    f, T = 1000.0, 1e-3
    a = math.sqrt(2) * db_to_p(60)                  # 실효값 0.02 Pa인 사인파의 봉우리
    one = lambda t: a * math.sin(2 * math.pi * f * t)
    same = lambda t: 2 * one(t)
    opposite = lambda t: one(t) + a * math.sin(2 * math.pi * f * t + math.pi)
    other = lambda t: one(t) + a * math.sin(2 * math.pi * 1.5 * f * t + 0.7)   # 다른 주파수
    lvl = lambda ms: 10 * math.log10(ms / P_R ** 2)
    assert close(lvl(mean_square(one, T)), 60.0, 1e-6)
    assert close(lvl(mean_square(same, T)), 66.0206, 1e-4)
    assert mean_square(opposite, T) < 1e-20
    assert close(lvl(mean_square(other, 2 * T)), 63.0103, 1e-4)     # 공통 주기 2 ms
    print("[OK] 60+60: 상관없음 63.01 dB, 같은 위상 66.02 dB, 반대 위상 0 (평균 제곱 수치 적분)")

    # 7. 거리
    assert close(30 + 10 * math.log10((1 / 2) ** 2), 23.98, 0.01)
    assert close(30 + 10 * math.log10(2 ** 2), 36.02, 0.01)
    assert close(10 * math.log10(1 / 2), -3.0103, 1e-4)
    # 구 넓이 4 pi r^2, 원통 옆면 2 pi r L 로 직접
    sphere = lambda r: 4 * math.pi * r ** 2
    cyl = lambda r: 2 * math.pi * r * 1.0
    assert close(10 * math.log10(sphere(1) / sphere(2)), -6.0206, 1e-4)
    assert close(10 * math.log10(cyl(1) / cyl(2)), -3.0103, 1e-4)
    print("[OK] 점음원 거리 2배 -6.02 dB (30 -> 23.98, 절반이면 36.02), 선음원 -3.01 dB")

    # 8. 60 dB SPL의 압력
    p60 = db_to_p(60)
    assert close(p60, 0.02, 1e-12) and close(p60 * math.sqrt(2), 0.02828, 1e-5)
    assert close(p60 / P_ATM, 1.97e-7, 0.01e-7)
    print(f"[OK] 60 dB SPL: 실효 {p60} Pa, 봉우리 {p60 * math.sqrt(2):.4f} Pa, 대기압의 {p60 / P_ATM:.2e}")

    # 9. dB HL
    hl = lambda spl, threshold: spl - threshold
    assert hl(40, 35) == 5 and hl(40, 0) == 40
    print("[OK] 40 dB SPL: 문턱 35 dB SPL이면 5 dB HL, 문턱 0 dB SPL이면 40 dB HL")

    # 10. 같은 소리 n개
    assert close(add_incoherent(*[85] * 10), 95.0, 1e-9)
    assert close(add_incoherent(*[85] * 4), 91.0206, 1e-4)
    print("[OK] 같은 소리 10개 +10 dB, 4개 +6.02 dB")

    # 카드
    assert close(add_incoherent(70, 70), 73.0103, 1e-4)          # C3
    assert close(add_incoherent(70, 60), 70.4139, 1e-4)          # C3
    assert close(10 * math.log10(1 / 4 ** 2), -12.0412, 1e-4)    # C3 거리 4배
    assert close(70 - 12.0412, 57.96, 0.01)
    assert close(20 * math.log10(2 * db_to_p(70) / P_R), 76.0206, 1e-4)   # C4
    assert hl(50, 35) == 15 and hl(30, 5) == 25                  # C5
    print("[OK] 카드 C3 (73.01, 70.41, 57.96 dB), C4 (76.02 dB), C5 (15 대 25 dB HL)")

    print("ALL CHECKS PASSED")


def db_to_p(level_db: float) -> float:
    return P_R * 10 ** (level_db / 20)


if __name__ == "__main__":
    main()
```
{% endraw %}
