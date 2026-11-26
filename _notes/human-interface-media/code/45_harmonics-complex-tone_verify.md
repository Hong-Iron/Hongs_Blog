---
layout: "note"
title: "45_harmonics-complex-tone_verify.py"
display_title: "45_harmonics-complex-tone_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "45"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/harmonics-complex-tone/"
parent_title: "고조파와 복합음"
description: "휴먼 인터페이스 미디어 · 고조파와 복합음 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/45_harmonics-complex-tone_verify/"
---
{% raw %}
[고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""고조파와 복합음 검증.

문서: 45.고조파와 복합음 (예시로 보기, 정의, 예제, 확인 문제 C1~C3)
실행: python3 -I 45_harmonics-complex-tone_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. k차 고조파의 세 가지 꼴 A e^{i(2 pi f_k t + phi)} = A e^{i(2 pi k f0 t + phi)} = A e^{i(2 pi k t / T0 + phi)}는
     f_k = k f0 = k / T0일 때 같은 값이다.
  2. 고조파의 합 x(t) = sum A_k e^{i 2 pi k f0 t}는 T0 = 1/f0마다 되풀이된다.
     가장 짧은 되풀이 간격(기본 주기)은 T0 / g이고, g는 진폭이 0이 아닌 차수 k들의 최대공약수다.
     예 (f0 = 200 Hz, T0 = 5 ms): {1,2,3} -> 5 ms, {2,3,4} -> 5 ms, {2,4} -> 2.5 ms, {3,6,9} -> 5/3 ms.
     (T0 / m 꼴의 후보를 모두 대 보는 전수 검사로 확인. 주기 T0인 함수의 주기는 T0/m 꼴뿐이다)
  3. 슬라이드의 두 고조파 예 x1 + x2 (x2의 주파수 3 f1)도 기본파 주기마다 되풀이된다.
     그래프에서 읽은 진폭 약 1.27, 0.42, 0.25는 네모파의 푸리에 계수 4/(k pi) (k = 1, 3, 5)와 맞는다.
     네모파의 부분합은 항을 더할수록 반 주기 평균이 1에 가까워진다.
  4. 440 Hz 기본음과 880, 1320 Hz 고조파의 합은 1/440 s = 2.27 ms마다 되풀이된다.
  5. 정수배 관계가 없는 200, 200 sqrt2, 200 sqrt5 Hz의 합은 0.5~100 ms의 어떤 간격으로 밀어도
     원래 모양과 같아지지 않는다 (평균 제곱 차이가 신호 평균 제곱의 1% 아래로 내려가지 않음).
  6. i와 j는 같은 허수 단위다: e^{i theta}와 e^{j theta}(파이썬의 1j)는 같은 수다.
카드:
  C1 f0 = 250 Hz: 3차 고조파 750 Hz, 1~4차의 합은 4 ms마다.
  C3 f0 = 100 Hz에서 2, 4차만 -> 5 ms, 2, 3차 -> 10 ms.
"""
import cmath
import math
from functools import reduce


def harmonic_sum(amps: dict, f0: float):
    """amps: {차수 k: 복소 진폭 A_k}"""
    return lambda t: sum(A * cmath.exp(1j * 2 * math.pi * k * f0 * t) for k, A in amps.items())


def same_on_samples(x, tau: float, T: float, n: int = 400, tol: float = 1e-9) -> bool:
    return all(abs(x(t + tau) - x(t)) < tol for t in (T * j / n for j in range(n)))


def fundamental_period(amps: dict, f0: float, max_m: int = 60) -> float:
    """주기 T0 = 1/f0인 x의 가장 짧은 주기를 T0/m (m = max_m, ..., 1) 후보 중에서 찾는다."""
    x = harmonic_sum(amps, f0)
    T0 = 1 / f0
    for m in range(max_m, 0, -1):
        if same_on_samples(x, T0 / m, T0):
            return T0 / m
    raise AssertionError("T0도 주기가 아니다")


def gcd_rule(amps: dict, f0: float) -> float:
    g = reduce(math.gcd, [k for k, A in amps.items() if A != 0])
    return (1 / f0) / g


def main() -> None:
    # 1. 세 가지 꼴
    f0, A, phi = 200.0, 0.7, 0.3
    T0 = 1 / f0
    for k in (1, 2, 3, 7):
        fk = k * f0
        assert abs(fk - k / T0) < 1e-9
        for t in (0.0, 0.0011, 0.0042):
            a = A * cmath.exp(1j * (2 * math.pi * fk * t + phi))
            b = A * cmath.exp(1j * (2 * math.pi * k * f0 * t + phi))
            c = A * cmath.exp(1j * (2 * math.pi * k * t / T0 + phi))
            assert abs(a - b) < 1e-12 and abs(a - c) < 1e-12
    print("[OK] f_k = k f0 = k/T0, 고조파의 세 가지 꼴이 같다")

    # 2. 기본 주기 = T0 / gcd
    cases = {
        "1,2,3": {1: 1.0, 2: 0.6, 3: 0.4},
        "1,2,3,4": {1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0},
        "2,3,4": {2: 1.0, 3: 1.0, 4: 1.0},
        "2,4": {2: 1.0, 4: 0.5},
        "3,6,9": {3: 1.0, 6: 0.5j, 9: 0.2},
        "1,3 (위상 섞음)": {1: 1.0, 3: 0.4 * cmath.exp(1j * 1.1)},
    }
    for name, amps in cases.items():
        got = fundamental_period(amps, f0)
        assert abs(got - gcd_rule(amps, f0)) < 1e-12, name
        print(f"     차수 {{{name}}}: 기본 주기 {got * 1e3:.4f} ms")
    print("[OK] 고조파 합의 기본 주기 = T0 / gcd(차수) (f0 = 200 Hz, T0 = 5 ms)")

    # 3. 슬라이드의 두 고조파 합과 네모파 계수
    f1 = 50.0
    amps_sq = {1: 4 / math.pi, 3: 4 / (3 * math.pi), 5: 4 / (5 * math.pi)}
    assert abs(amps_sq[1] - 1.27) < 0.005 and abs(amps_sq[3] - 0.42) < 0.005 and abs(amps_sq[5] - 0.25) < 0.006
    two = {1: 4 / math.pi, 3: 4 / (3 * math.pi)}
    assert abs(fundamental_period(two, f1) - 1 / f1) < 1e-12
    # 실수 꼴(허수부 = 사인)의 반 주기 평균이 1에 가까워진다: 2/pi * sum_{홀수 k<=K} 4/(k pi) * (2/(k pi))... 수치로
    def half_mean(K):
        terms = {k: 4 / (k * math.pi) for k in range(1, K + 1, 2)}
        x = harmonic_sum(terms, f1)
        n = 4000
        T = 1 / f1
        return sum(x((j + 0.5) * (T / 2) / n).imag for j in range(n)) / n
    means = [half_mean(K) for K in (1, 3, 5, 51)]
    assert means[0] < means[1] < means[2] < means[3] < 1.0 and means[3] > 0.99
    print(f"[OK] 진폭 4/(k pi) = {amps_sq[1]:.3f}, {amps_sq[3]:.3f}, {amps_sq[5]:.3f}; 반 주기 평균 "
          + ", ".join(f"{m:.3f}" for m in means) + " (1, 3, 5, 51차까지)")

    # 4. 440 Hz 복합음
    amps440 = {1: 1.0, 2: 0.8, 3: 0.6}
    assert abs(fundamental_period(amps440, 440.0) - 1 / 440) < 1e-12
    assert abs(1e3 / 440 - 2.27) < 0.005
    print("[OK] 440 + 880 + 1320 Hz: 2.27 ms마다 되풀이")

    # 5. 정수배가 아닌 합
    fs = (200.0, 200.0 * math.sqrt(2), 200.0 * math.sqrt(5))
    y = lambda t: sum(math.sin(2 * math.pi * f * t) for f in fs)
    grid = [j * 1e-5 for j in range(3000)]                       # 0 ~ 30 ms
    power = sum(y(t) ** 2 for t in grid) / len(grid)
    worst = min(sum((y(t + tau) - y(t)) ** 2 for t in grid[::10]) / len(grid[::10])
                for tau in (k * 1e-5 for k in range(50, 10001)))  # 0.5 ~ 100 ms
    assert worst / power > 0.01
    print(f"[OK] 200, 283, 447 Hz의 합: 0.5~100 ms 밀기에서 최소 평균 제곱 차이 = 신호의 {100 * worst / power:.1f}%")

    # 6. i 와 j
    for th in (0.0, 1.0, math.pi / 3):
        assert abs(cmath.exp(1j * th) - complex(math.cos(th), math.sin(th))) < 1e-15
    print("[OK] e^{i theta} = cos + i sin (i와 j는 같은 허수 단위)")

    # 카드
    assert 3 * 250 == 750 and abs(fundamental_period({1: 1, 2: 1, 3: 1, 4: 1}, 250.0) - 0.004) < 1e-12
    assert abs(fundamental_period({2: 1, 4: 1}, 100.0) - 0.005) < 1e-12
    assert abs(fundamental_period({2: 1, 3: 1}, 100.0) - 0.010) < 1e-12
    print("[OK] 카드 C1 (750 Hz, 4 ms), C3 ({2,4} -> 5 ms, {2,3} -> 10 ms)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
