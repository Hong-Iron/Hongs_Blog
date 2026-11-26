---
layout: "note"
title: "61_sampling-theorem_verify.py"
display_title: "61_sampling-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "61"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-theorem/"
parent_title: "표본화 정리"
description: "휴먼 인터페이스 미디어 · 표본화 정리 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/61_sampling-theorem_verify/"
---
{% raw %}
[표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본화 정리 검증.

문서: 61.표본화 정리 (예시로 보기, 정의, 증명, 예제, 확인 문제)
실행: python3 -I 61_sampling-theorem_verify.py   (표준 라이브러리만 쓴다)

시험 신호: x(t) = sinc²(t), sinc(u) = sin(πu)/(πu).
이 신호의 스펙트럼은 |f| ≤ 1 Hz에만 있는 삼각형 X(f) = max(0, 1 − |f|)이다(최고 주파수 f_M = 1 Hz).
주파수는 Hz(f)로 계산한다. 각주파수로는 ω = 2πf다.

주장:
  1. sinc²(t)의 푸리에 변환은 삼각형이다(수치 적분으로 확인).
  2. 임펄스열로 표본화한 신호의 스펙트럼 Σ x(nT) e^{-j2πfnT}는 (1/T) Σ_k X(f − k f_s)와 같다.
     f_s = 3 Hz(> 2 f_M)이면 |f| < f_s − f_M = 2 Hz에서 복사본이 겹치지 않아 (1/T) X(f)만 남는다.
  3. 이득 T, 차단 주파수 f_c인 이상적 저역 통과 필터로 되살리면
     x_r(t) = Σ x(nT) · T sin(2πf_c(t − nT)) / (π(t − nT)).
     f_M < f_c < f_s − f_M(1 < f_c < 2)이면 x_r = x. f_c = 0.8이나 2.2이면 어긋난다(오차 약 0.04).
  4. 경계: 100 Hz 사인을 정확히 200 Hz로 재면 표본이 모두 0이다.
     100 Hz 코사인을 200 Hz로 재면 진폭과 위상이 섞여(A cos φ) 구별되지 않는다.
  5. 표준 표본화율: 하이파이 f_M = 20 kHz → 40 kHz 초과, 44.1 kHz(절반 22.05 kHz, 여유 2.05 kHz).
     전화 f_M ≈ 3.4 kHz → 6.8 kHz 초과, 8 kHz(절반 4 kHz).
  6. 이산 주파수와 실제 주파수: 간격 t0로 재면 ω = 2π f t0, 최대 ω = π는 f = 1/(2 t0) = f_s/2.
     t0 = 1/8000 s면 4000 Hz, t0 = 1/44100 s면 22050 Hz. 1 kHz를 8 kHz로 재면 cos(πn/4).
  7. 1 kHz 톤을 8 kHz로 재면 기본 주기 8표본, 44.1 kHz로 재면 441표본(그동안 10주기).
  8. 카드 답: f_M = 15 kHz면 f_s > 30 kHz, 32 kHz는 된다. t0 = 125 μs면 최대 4000 Hz.
  9. 예시: 1000 Hz를 8000 Hz로 재면 4000 Hz보다 느린 사인파 가운데 같은 점을 지나는 것은 1000 Hz뿐이다
     (1 Hz 간격으로 1~3999 Hz를 모두 대 봄). 1500 Hz로 재면 500 Hz와 표본이 같다.
 10. 피아노 최고음 C8의 기본 주파수: A4 = 440 Hz 평균율에서 440·2^(39/12) ≈ 4186 Hz.
"""
import cmath
import math
from fractions import Fraction


def sinc(u: float) -> float:
    return 1.0 if u == 0 else math.sin(math.pi * u) / (math.pi * u)


def x(t: float) -> float:
    return sinc(t) ** 2


def X(f: float) -> float:
    return max(0.0, 1.0 - abs(f))


def ft_numeric(f: float, L: float = 400.0, h: float = 0.005) -> float:
    """x가 실수 짝함수라서 X(f) = 2∫_0^∞ x(t) cos(2πft) dt. 사다리꼴 적분."""
    n = int(L / h)
    s = 0.5 * (x(0.0) + x(L) * math.cos(2 * math.pi * f * L))
    for i in range(1, n):
        t = i * h
        s += x(t) * math.cos(2 * math.pi * f * t)
    return 2 * s * h


def sampled_spectrum(f: float, fs: float, N: int = 30000) -> complex:
    T = 1 / fs
    return sum(x(n * T) * cmath.exp(-2j * math.pi * f * n * T) for n in range(-N, N + 1))


def copies(f: float, fs: float, K: int = 10) -> float:
    return fs * sum(X(f - k * fs) for k in range(-K, K + 1))


def reconstruct(t: float, fs: float, fc: float, N: int = 3000) -> float:
    T = 1 / fs
    s = 0.0
    for n in range(-N, N + 1):
        d = t - n * T
        kern = 2 * fc * T if abs(d) < 1e-12 else T * math.sin(2 * math.pi * fc * d) / (math.pi * d)
        s += x(n * T) * kern
    return s


def main() -> None:
    # 1. 삼각형 스펙트럼
    for f in (0.0, 0.25, 0.5, 0.9, 1.2, 1.7):
        assert abs(ft_numeric(f) - X(f)) < 2e-3, (f, ft_numeric(f))

    # 2. 표본화한 스펙트럼 = 복사본의 합, 높이 1/T
    fs = 3.0
    for f in (0.0, 0.3, 0.8, 1.5, 1.9, 2.4, 3.0, 4.1):
        val = sampled_spectrum(f, fs)
        assert abs(val.imag) < 1e-6
        assert abs(val.real - copies(f, fs)) < 1e-3, (f, val, copies(f, fs))
    for f in (0.0, 0.5, 0.99, 1.5, 1.99):          # |f| < f_s − f_M = 2: 원래 스펙트럼 하나만
        assert abs(copies(f, fs) - fs * X(f)) < 1e-12
    assert abs(copies(0.0, fs) - 3.0) < 1e-12       # 높이 1/T = 3

    # 3. 저역 통과 필터로 되살리기
    ts = [i * 0.05 for i in range(-60, 61)]
    for fc in (1.2, 1.5, 1.8):
        err = max(abs(reconstruct(t, fs, fc) - x(t)) for t in ts)
        assert err < 1e-4, (fc, err)
    for fc in (0.8, 2.2):
        err = max(abs(reconstruct(t, fs, fc) - x(t)) for t in ts)
        assert 0.03 < err < 0.05, (fc, err)
    # 차단 주파수 f_s/2에서 커널은 sinc((t − nT)/T)
    T = 1 / fs
    for d in (0.1, 0.37, 1.2):
        assert abs(T * math.sin(2 * math.pi * (fs / 2) * d) / (math.pi * d) - sinc(d / T)) < 1e-12

    # 4. 경계 f_s = 2f
    for n in range(50):
        assert abs(math.sin(2 * math.pi * 100 * n / 200)) < 1e-9
        a = 1.0 * math.cos(2 * math.pi * 100 * n / 200 + math.pi / 3)
        b = 0.5 * math.cos(2 * math.pi * 100 * n / 200)
        assert abs(a - b) < 1e-9

    # 5. 표준 표본화율
    assert 2 * 20000 < 44100 and 44100 / 2 == 22050 and 22050 - 20000 == 2050
    assert 2 * 3400 < 8000 and 8000 / 2 == 4000

    # 6. 이산 주파수 ↔ 실제 주파수
    for fs_, fmax in ((8000, 4000), (44100, 22050)):
        t0 = 1 / fs_
        assert abs(1 / (2 * t0) - fmax) < 1e-9
        assert abs(2 * math.pi * fmax * t0 - math.pi) < 1e-12
    t0 = 1 / 8000
    for n in range(100):
        assert abs(math.cos(2 * math.pi * 1000 * n * t0) - math.cos(math.pi * n / 4)) < 1e-9

    # 7. 1 kHz 톤의 기본 주기
    for fs_, N0, m in ((8000, 8, 1), (44100, 441, 10)):
        r = Fraction(1000, fs_)
        assert r.denominator == N0 and r.numerator == m
        w = 2 * math.pi * 1000 / fs_
        for n in range(30):
            assert abs(math.cos(w * (n + N0)) - math.cos(w * n)) < 1e-9
        for N in range(1, N0):                       # 더 짧은 주기는 없다
            assert max(abs(math.cos(w * (n + N)) - math.cos(w * n)) for n in range(5)) > 1e-6

    # 8. 카드 답
    assert 2 * 15000 == 30000 < 32000 and 32000 / 2 == 16000
    assert abs(1 / (2 * 125e-6) - 4000) < 1e-6

    # 9. 예시의 두 표본화
    target = [math.cos(2 * math.pi * 1000 * n / 8000) for n in range(16)]
    same = [f for f in range(1, 4000)
            if all(abs(math.cos(2 * math.pi * f * n / 8000) - target[n]) < 1e-6 for n in range(16))]
    assert same == [1000], same
    for n in range(30):
        assert abs(math.cos(2 * math.pi * 1000 * n / 1500) - math.cos(2 * math.pi * 500 * n / 1500)) < 1e-9

    # 10. 피아노 최고음
    assert abs(440 * 2 ** (39 / 12) - 4186.0) < 0.1

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
