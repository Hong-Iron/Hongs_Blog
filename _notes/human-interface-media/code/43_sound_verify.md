---
layout: "note"
title: "43_sound_verify.py"
display_title: "43_sound_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sound/"
parent_title: "소리"
description: "휴먼 인터페이스 미디어 · 소리 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/43_sound_verify/"
---
{% raw %}
[소리](/Hongs_Blog/studies/human-interface-media/sound/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소리 검증.

문서: 43.소리 (예시로 보기, 정의, 확인 문제 C2)
실행: python3 -I 43_sound_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 보통 대화 크기인 60 dB SPL의 실효 음압은 20 uPa * 10^(60/20) = 0.02 Pa이고,
     사인파라면 봉우리(대기압에서 가장 높은 곳까지)는 0.02 * sqrt(2) = 0.0283 Pa다.
     이것은 대기압 101,325 Pa의 약 2e-7, 곧 약 500만분의 1이다. 대기압을 1억 원으로 치면 약 20원이다.
  2. 사인파 A sin(2 pi f t)의 실효값(제곱 평균의 제곱근)은 A / sqrt(2)다.
  3. 카드 C2: p(t) = 101325 + 0.05 sin(2 pi 250 t) Pa에서
     대기압에서 봉우리까지 0.05 Pa, 봉우리에서 골까지 0.1 Pa, 주파수 250 Hz, 주기 4 ms.
     (표본을 촘촘히 찍어 최댓값·최솟값과, 같은 값으로 되돌아오는 가장 짧은 간격을 찾는다)
  4. 그림 1의 세 소리: 440 Hz 봉우리 0.0283 Pa(60 dB SPL), 같은 주파수 봉우리 2배(66.02 dB SPL),
     880 Hz 같은 봉우리(주기 1.136 ms, 440 Hz의 절반).
"""
import math

P_R = 20e-6
P_ATM = 101325.0


def rms_of_sine(A: float, f: float, n: int = 100000) -> float:
    T = 1 / f
    h = T / n
    ms = sum((A * math.sin(2 * math.pi * f * (k + 0.5) * h)) ** 2 for k in range(n)) / n
    return math.sqrt(ms)


def main() -> None:
    p_rms = P_R * 10 ** (60 / 20)
    assert abs(p_rms - 0.02) < 1e-12
    peak = p_rms * math.sqrt(2)
    assert abs(peak - 0.02828) < 1e-5
    ratio = p_rms / P_ATM
    assert abs(ratio - 1.974e-7) < 0.001e-7
    assert abs(1e8 * ratio - 19.7) < 0.1
    assert abs(1 / ratio - 5.07e6) < 0.01e6                 # 약 500만분의 1
    print(f"[OK] 60 dB SPL: 실효 {p_rms} Pa, 봉우리 {peak:.4f} Pa, 대기압의 {ratio:.2e} (1억 원 중 {1e8 * ratio:.1f}원)")

    for A in (0.05, 1.0, 3.0):
        assert abs(rms_of_sine(A, 250.0) - A / math.sqrt(2)) < 1e-9
    print("[OK] 사인파의 실효값 = 봉우리 / sqrt(2)")

    # 카드 C2
    f = 250.0
    p = lambda t: P_ATM + 0.05 * math.sin(2 * math.pi * f * t)
    ts = [k * 1e-6 for k in range(0, 20001)]           # 0 ~ 20 ms, 1 us 간격
    vals = [p(t) for t in ts]
    hi, lo = max(vals), min(vals)
    assert abs((hi - P_ATM) - 0.05) < 1e-6 and abs((hi - lo) - 0.1) < 1e-6
    # 가장 짧은 되풀이 간격: 0.1 ms 간격 후보 중 모든 표본에서 값이 같아지는 첫 간격
    period = None
    for k in range(1, 200):
        tau = k * 1e-4
        if all(abs(p(t + tau) - p(t)) < 1e-9 for t in ts[::50]):
            period = tau
            break
    assert period is not None and abs(period - 0.004) < 1e-12
    print(f"[OK] 카드 C2: 대기압~봉우리 {hi - P_ATM:.3f} Pa, 봉우리~골 {hi - lo:.3f} Pa, 주기 {period * 1e3:.1f} ms -> {1 / period:.0f} Hz")

    # 그림 1의 값
    assert abs(20 * math.log10((2 * peak / math.sqrt(2)) / P_R) - 66.0206) < 1e-4
    assert abs(1e3 / 880 - 1.136) < 0.001 and abs((1 / 880) / (1 / 440) - 0.5) < 1e-12
    print("[OK] 그림 1: 봉우리 2배 -> 66.02 dB SPL, 880 Hz 주기 1.136 ms (440 Hz의 절반)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
