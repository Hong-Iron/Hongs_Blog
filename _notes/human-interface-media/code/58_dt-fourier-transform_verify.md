---
layout: "note"
title: "58_dt-fourier-transform_verify.py"
display_title: "58_dt-fourier-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "58"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dt-fourier-transform/"
parent_title: "이산 시간 푸리에 변환"
description: "휴먼 인터페이스 미디어 · 이산 시간 푸리에 변환 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/58_dt-fourier-transform_verify/"
---
{% raw %}
[이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 푸리에 변환 문서의 주장과 카드 답을 수치로 확인한다.
# 실행: python3 -I 58_dt-fourier-transform_verify.py  (표준 라이브러리만 사용)
import cmath
import math

TOL = 1e-9


def close(a, b, tol=TOL):
    return abs(a - b) < tol


def dtft(x, w):
    """x는 {n: 값} 사전. X(e^{jw}) = 합 x[n] e^{-jwn}."""
    return sum(v * cmath.exp(-1j * w * n) for n, v in x.items())


def inverse(Xf, n, M=4096):
    """x[n] = (1/2pi) 적분_{-pi}^{pi} X(e^{jw}) e^{jwn} dw. 주기 함수라 사다리꼴 합이 매우 정확하다."""
    h = 2 * math.pi / M
    s = sum(Xf(-math.pi + i * h) * cmath.exp(1j * (-math.pi + i * h) * n) for i in range(M))
    return s * h / (2 * math.pi)


def rect(N1):
    return {n: 1.0 for n in range(-N1, N1 + 1)}


def check_rect():
    """사각 펄스 |n| <= N1: X = sin(w(N1+1/2)) / sin(w/2), 주기 2pi."""
    for N1 in [0, 1, 2, 5]:
        x = rect(N1)
        for w in [0.3, 1.0, 2.0, 3.0, -2.2]:
            closed = math.sin(w * (N1 + 0.5)) / math.sin(w / 2)
            assert close(dtft(x, w), closed, 1e-9)
            assert close(dtft(x, w + 2 * math.pi), dtft(x, w), 1e-9)       # 주기 2pi
        assert close(dtft(x, 0.0), 2 * N1 + 1, 1e-12)
    x = rect(2)
    vals = {w: dtft(x, w).real for w in [0.0, math.pi / 2, math.pi, 2 * math.pi / 5]}
    assert close(vals[0.0], 5) and close(vals[math.pi / 2], -1) and close(vals[math.pi], 1)
    assert close(vals[2 * math.pi / 5], 0, 1e-12)                           # 첫 영점 2pi/5
    assert close(dtft(x, 1.0), 1 + 2 * math.cos(1.0) + 2 * math.cos(2.0), 1e-12)
    print("rect N1=2: X(0)=5, X(pi/2)=-1, X(pi)=1, first zero at 2pi/5, period 2pi")


def check_inverse():
    """역변환으로 원래 수열이 돌아온다. 핵심 사실 (1/2pi) 적분 e^{jw(n-m)} = [n == m]."""
    for d in range(-5, 6):
        v = inverse(lambda w: 1.0, d)                                       # X = e^{-jwm}, m=0
        assert close(v, 1.0 if d == 0 else 0.0, 1e-12)
    x = rect(2)
    for n in range(-6, 7):
        assert close(inverse(lambda w: dtft(x, w), n), x.get(n, 0.0), 1e-9)
    a = 0.5
    Xa = lambda w: 1 / (1 - a * cmath.exp(-1j * w))
    for n in range(-4, 9):
        assert close(inverse(Xa, n), a ** n if n >= 0 else 0.0, 1e-9)
    print("inverse transform recovers rect and a^n u[n]")


def check_exponential():
    """a^n u[n] (|a|<1): X = 1/(1 - a e^{-jw}). 크기, 위상, 위상의 최댓값."""
    for a in [0.5, -0.5, 0.9, -0.3]:
        x = {n: a ** n for n in range(0, 400)}
        for w in [0.0, 0.7, math.pi / 2, math.pi, -1.1]:
            closed = 1 / (1 - a * cmath.exp(-1j * w))
            assert close(dtft(x, w), closed, 1e-9)
            assert close(abs(closed) ** 2, 1 / (1 - 2 * a * math.cos(w) + a * a), 1e-12)
            assert close(cmath.phase(closed), -math.atan2(a * math.sin(w), 1 - a * math.cos(w)), 1e-12)
        # 위상이 가장 큰 곳은 cos w = a, 그 값은 atan(a / sqrt(1-a^2))
        ws = [-math.pi + i * 2 * math.pi / 200000 for i in range(200000)]
        best = max(ws, key=lambda w: abs(cmath.phase(1 / (1 - a * cmath.exp(-1j * w)))))
        peak = abs(cmath.phase(1 / (1 - a * cmath.exp(-1j * best))))
        assert close(peak, math.atan(abs(a) / math.sqrt(1 - a * a)), 1e-8)
        assert close(math.cos(best), a, 1e-3)
    X = lambda w, a: 1 / (1 - a * cmath.exp(-1j * w))
    assert close(X(0, 0.5), 2) and close(X(math.pi, 0.5), 2 / 3)
    assert close(X(0, -0.5), 2 / 3) and close(X(math.pi, -0.5), 2)
    assert close(abs(X(math.pi / 2, 0.5)), 1 / math.sqrt(1.25))
    assert close(math.degrees(cmath.phase(X(math.pi / 2, 0.5))), -26.5650512, 1e-6)
    assert close(math.degrees(math.atan(0.5 / math.sqrt(0.75))), 30.0, 1e-9)
    print("a^n u[n]: a=0.5 -> X(0)=2, X(pi)=2/3; a=-0.5 -> 2/3, 2; max phase 30 deg at w=pi/3")


def check_two_sided():
    """a^|n|: X = (1-a^2)/(1 - 2a cos w + a^2), 실수이고 짝."""
    a = 0.5
    x = {n: a ** abs(n) for n in range(-400, 401)}
    for w in [0.0, 0.4, 1.3, math.pi]:
        closed = (1 - a * a) / (1 - 2 * a * math.cos(w) + a * a)
        v = dtft(x, w)
        assert close(v, closed, 1e-9) and abs(v.imag) < 1e-9
        assert close(dtft(x, -w), v, 1e-9)
    assert close(dtft(x, 0), 3.0, 1e-9) and close(dtft(x, math.pi), 1 / 3, 1e-9)
    print("a^|n| (a=0.5): X(0)=3, X(pi)=1/3, real and even")


def check_divergence():
    """|a| >= 1 이면 합이 수렴하지 않는다: 부분합이 끝없이 커진다."""
    for a in [1.0, 1.1, -1.0]:
        s100 = abs(sum(a ** n for n in range(100)))
        s1000 = abs(sum(a ** n for n in range(1000)))
        if a == -1.0:
            assert {abs(sum(a ** n for n in range(m))) for m in range(1, 10)} == {0.0, 1.0}   # 0과 1 사이를 오감
        else:
            assert s1000 > s100 > 50
    print("|a| >= 1: partial sums do not settle")


def dfs_coeffs(xper, N):
    return [sum(xper[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) / N for k in range(N)]


def check_derivation_and_dft():
    """주기로 늘인 수열의 N a_k = X(e^{j 2pi k / N}), 그리고 DFT는 DTFT를 N개 점에서 찍은 값."""
    x = rect(2)                                 # n = -2..2
    for N in [5, 10, 20, 40]:
        xper = [0.0] * N
        for n, v in x.items():
            xper[n % N] += v                    # N >= 5 이면 겹치지 않는다
        a = dfs_coeffs(xper, N)
        for k in range(N):
            assert close(N * a[k], dtft(x, 2 * math.pi * k / N), 1e-9)
    # 겹치면(N < 5) 계수 등식은 그대로지만, 한 주기가 원래 수열과 달라져 x를 되찾을 수 없다
    N = 4
    xper = [0.0] * N
    for n, v in x.items():
        xper[n % N] += v
    a = dfs_coeffs(xper, N)
    for k in range(N):
        assert close(N * a[k], dtft(x, 2 * math.pi * k / N), 1e-9)
    assert xper == [1.0, 1.0, 2.0, 1.0]         # n = 2 와 n = -2 가 같은 칸에 겹쳐 2가 된다
    # 길이 N 유한 수열의 DFT = DTFT 표본
    seq = [1.0, 2.0, 3.0, 4.0]
    xs = dict(enumerate(seq))
    dft = [sum(seq[n] * cmath.exp(-2j * math.pi * k * n / 4) for n in range(4)) for k in range(4)]
    for k in range(4):
        assert close(dft[k], dtft(xs, 2 * math.pi * k / 4), 1e-12)
    assert close(dft[1], -2 + 2j, 1e-12)
    # 0을 덧붙이면(길이 8) 같은 DTFT를 더 촘촘히 찍는다
    seq8 = seq + [0.0] * 4
    dft8 = [sum(seq8[n] * cmath.exp(-2j * math.pi * k * n / 8) for n in range(8)) for k in range(8)]
    for k in range(8):
        assert close(dft8[k], dtft(xs, 2 * math.pi * k / 8), 1e-12)
    print("N a_k = X(e^{j2pi k/N}); with N = 4 copies overlap (period = [1,1,2,1]); DFT = DTFT samples; zero-padding samples denser")


def check_moving_average():
    """5점 이동 평균 h[n] = 1/5 (|n|<=2) 은 주기 5 샘플의 코사인을 지운다."""
    h = {n: 0.2 for n in range(-2, 3)}
    assert close(dtft(h, 0.0), 1.0, 1e-12)
    assert close(dtft(h, 2 * math.pi / 5), 0.0, 1e-12)
    xs = [math.cos(2 * math.pi * n / 5) for n in range(-10, 30)]
    y = [sum(0.2 * xs[i + m] for m in range(-2, 3)) for i in range(2, len(xs) - 2)]
    assert max(abs(v) for v in y) < 1e-12
    print("5-point moving average: H(0)=1, H(2pi/5)=0, kills cos(2pi n/5)")


def check_parseval():
    """에너지: 합 |x[n]|^2 = (1/2pi) 적분_{2pi} |X|^2 dw. a = 0.5 이면 4/3."""
    a = 0.5
    M = 4096
    h = 2 * math.pi / M
    rhs = sum(abs(1 / (1 - a * cmath.exp(-1j * (-math.pi + i * h)))) ** 2 for i in range(M)) * h / (2 * math.pi)
    lhs = sum(a ** (2 * n) for n in range(200))
    assert close(lhs, 4 / 3, 1e-12) and close(rhs, 4 / 3, 1e-9)
    print("Parseval: sum |x|^2 = (1/2pi) int |X|^2 = 4/3 for a = 0.5")


def check_highest_frequency():
    """w = pi 는 (-1)^n, w = 2pi 는 상수 1: 가장 빠른 진동은 pi."""
    for n in range(-5, 6):
        assert close(cmath.exp(1j * math.pi * n), (-1) ** n, 1e-12)
        assert close(cmath.exp(1j * 2 * math.pi * n), 1.0, 1e-12)
        assert close(cmath.exp(1j * 0.3 * n), cmath.exp(1j * (0.3 + 2 * math.pi) * n), 1e-12)
    print("e^{j pi n} = (-1)^n, e^{j 2pi n} = 1, w and w+2pi give the same sequence")


if __name__ == "__main__":
    check_rect()
    check_inverse()
    check_exponential()
    check_two_sided()
    check_divergence()
    check_derivation_and_dft()
    check_moving_average()
    check_parseval()
    check_highest_frequency()
    print("ALL CHECKS PASSED")
```
{% endraw %}
