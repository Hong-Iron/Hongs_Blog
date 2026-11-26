---
layout: "note"
title: "57_real-signal-real-spectrum_verify.py"
display_title: "57_real-signal-real-spectrum_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "57"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/real-signal-real-spectrum/"
parent_title: "실수 신호와 실수 스펙트럼"
description: "휴먼 인터페이스 미디어 · 실수 신호와 실수 스펙트럼 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/57_real-signal-real-spectrum_verify/"
---
{% raw %}
[실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 실수 신호와 실수 스펙트럼 문서의 주장을 수치로 확인한다.
# 실행: python3 -I 57_real-signal-real-spectrum_verify.py  (표준 라이브러리만 사용)
# 연속 푸리에 변환은 심프슨 적분으로, 이산 쪽은 정의대로 합으로 계산한다.
import cmath
import math
import random

TOL = 1e-6


def simpson(f, a, b, n=20000):
    """[a, b]에서 f의 적분 (n은 짝수). f는 복소수를 돌려줘도 된다."""
    if n % 2:
        n += 1
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3


def ctft(x, w, pieces):
    """X(jw) = 적분 x(t) e^{-jwt} dt. pieces는 (a, b) 구간 목록(꺾이는 점에서 나눈다)."""
    return sum(simpson(lambda t: x(t) * cmath.exp(-1j * w * t), a, b) for a, b in pieces)


def close(a, b, tol=TOL):
    return abs(a - b) < tol


def check_one_sided_exp():
    """x(t) = e^{-t}u(t): X = 1/(1+jw), X(-jw) = X*(jw), |X| 짝, 위상 홀."""
    x = lambda t: math.exp(-t)
    pieces = [(0.0, 40.0)]
    table = {}
    for w in [0.0, 0.5, 1.0, 2.0]:
        Xp = ctft(x, w, pieces)
        Xm = ctft(x, -w, pieces)
        assert close(Xp, 1 / (1 + 1j * w), 1e-6), (w, Xp)
        assert close(Xm, Xp.conjugate(), 1e-9)               # 켤레 대칭
        assert close(abs(Xm), abs(Xp), 1e-9)                 # 크기 짝
        assert close(cmath.phase(Xm), -cmath.phase(Xp), 1e-9)  # 위상 홀
        table[w] = Xp
    # 문서 표의 값
    assert close(table[0.5], 0.8 - 0.4j, 1e-6)
    assert close(table[1.0], 0.5 - 0.5j, 1e-6)
    assert close(table[2.0], 0.2 - 0.4j, 1e-6)
    assert close(abs(table[1.0]), 1 / math.sqrt(2), 1e-6)
    assert close(math.degrees(cmath.phase(table[1.0])), -45.0, 1e-4)
    assert close(math.degrees(cmath.phase(table[2.0])), -63.4349, 1e-3)
    print("e^{-t}u(t): X(j1) =", table[1.0], " X(-j1) = conj, |X| even, phase odd")


def check_two_sided_exp():
    """x(t) = e^{-|t|}: 실수이고 짝 -> X = 2/(1+w^2)도 실수이고 짝."""
    x = lambda t: math.exp(-abs(t))
    pieces = [(-40.0, 0.0), (0.0, 40.0)]
    for w in [0.0, 1.0, 2.0, 3.5]:
        Xp = ctft(x, w, pieces)
        Xm = ctft(x, -w, pieces)
        assert close(Xp, 2 / (1 + w * w), 1e-6)
        assert abs(Xp.imag) < 1e-9 and close(Xp, Xm, 1e-9)
    print("e^{-|t|}: X(j1) = 1, X(j2) = 0.4, imag = 0, even")


def check_conjugate_property():
    """복소 신호에서 x*(t) <-> X*(-jw) (실수라는 가정 없이 맞는 성질)."""
    x = lambda t: math.exp(-t * t) * (1 + 1j * t + 0.3j)
    xc = lambda t: x(t).conjugate()
    pieces = [(-12.0, 12.0)]
    for w in [-1.5, 0.0, 0.7, 2.0]:
        lhs = ctft(xc, w, pieces)
        rhs = ctft(x, -w, pieces).conjugate()
        assert close(lhs, rhs, 1e-9)
    # 복소 신호는 켤레 대칭이 깨진다
    X1 = ctft(x, 1.0, pieces)
    Xm1 = ctft(x, -1.0, pieces)
    assert abs(Xm1 - X1.conjugate()) > 0.1
    print("x*(t) <-> X*(-jw) holds for complex x; symmetry fails when x is complex")


def check_real_not_even_gaussian():
    """실수지만 짝이 아닌 신호: 스펙트럼은 켤레 대칭이지만 실수가 아니다."""
    x = lambda t: math.exp(-(t - 1) ** 2) + 0.5 * math.exp(-2 * (t + 0.5) ** 2)
    pieces = [(-12.0, 12.0)]
    X1 = ctft(x, 1.3, pieces)
    Xm1 = ctft(x, -1.3, pieces)
    assert close(Xm1, X1.conjugate(), 1e-9)
    assert abs(X1.imag) > 0.1
    print("real non-even gaussian pair: conj symmetric, X not real (Im =", round(X1.imag, 4), ")")


def check_one_sided_real_spectrum():
    """X(jw) = 1 (0 < w < W), 0 그 밖: 실수 스펙트럼 -> x(-t) = x*(t), x는 복소수."""
    W = 2.0

    def x_num(t):
        return simpson(lambda w: cmath.exp(1j * w * t), 0.0, W, 4000) / (2 * math.pi)

    def x_closed(t):
        return (math.sin(W * t) + 1j * (1 - math.cos(W * t))) / (2 * math.pi * t)

    for t in [0.3, 1.0, 2.5]:
        a, b = x_num(t), x_num(-t)
        assert close(a, x_closed(t), 1e-9)
        assert close(b, a.conjugate(), 1e-9)       # x(-t) = x*(t)
        assert close(a.real, b.real, 1e-9)         # Re 짝
        assert close(a.imag, -b.imag, 1e-9)        # Im 홀
    v = x_closed(1.0)
    assert close(v.real, 0.144720, 1e-5) and close(v.imag, 0.225391, 1e-5)
    print("one-sided real spectrum W=2: x(1) =", v, " x(-1) = conj")


def check_discrete_analogues():
    """이산 신호(길이 N)에서도 같은 대칭이 맞는지 DFT로 확인 (무작위 300회)."""
    rnd = random.Random(57)

    def dft(x):
        N = len(x)
        return [sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) for k in range(N)]

    for _ in range(100):
        N = rnd.randint(2, 16)
        x = [rnd.uniform(-1, 1) for _ in range(N)]                     # 실수
        X = dft(x)
        for k in range(N):
            assert close(X[(-k) % N], X[k].conjugate(), 1e-9)
    for _ in range(100):
        N = rnd.randint(2, 16)
        x = [0.0] * N
        for n in range(N):
            if x[n] == 0.0:
                v = rnd.uniform(-1, 1)
                x[n] = v
                x[(-n) % N] = v                                       # 실수이고 짝
        X = dft(x)
        assert all(abs(v.imag) < 1e-9 for v in X)
        for k in range(N):
            assert close(X[(-k) % N], X[k], 1e-9)                   # 스펙트럼도 짝
    for _ in range(100):
        N = rnd.randint(2, 16)
        x = [0j] * N
        for n in range(N):
            m = (-n) % N
            if n <= m:
                v = complex(rnd.uniform(-1, 1), rnd.uniform(-1, 1))
                if n == m:
                    v = complex(v.real, 0.0)
                x[n] = v
                x[m] = v.conjugate()                                 # x[-n] = x*[n]
        X = dft(x)
        assert all(abs(v.imag) < 1e-9 for v in X)                    # 스펙트럼이 실수
    print("discrete analogues: real -> conj sym, real&even -> real&even, x[-n]=x*[n] -> real (300 random)")


def fs_coeff(x, k, T=1.0, n=4000):
    """주기 T 신호의 푸리에 급수 계수 a_k = (1/T) 적분 x(t) e^{-jk w0 t} dt."""
    w0 = 2 * math.pi / T
    return simpson(lambda t: x(t) * cmath.exp(-1j * k * w0 * t), 0.0, T, n) / T


def check_phase_example():
    """그림 2: 사인 위상 합과 코사인 위상 합은 |a_k|가 같고, 코사인 쪽만 짝함수다."""
    amps = [1.0, 0.5, 1 / 3]
    xs = lambda t: sum(A * math.sin(2 * math.pi * (i + 1) * t) for i, A in enumerate(amps))
    xc = lambda t: sum(A * math.cos(2 * math.pi * (i + 1) * t) for i, A in enumerate(amps))
    for k in range(-4, 5):
        a_s, a_c = fs_coeff(xs, k), fs_coeff(xc, k)
        assert close(abs(a_s), abs(a_c), 1e-9)
        if k != 0 and abs(k) <= 3:
            assert close(abs(a_c), amps[abs(k) - 1] / 2, 1e-9)
            assert abs(a_c.imag) < 1e-9                               # 코사인 합: 실수 계수
            assert abs(a_s.real) < 1e-9                               # 사인 합: 순허수 계수
    for t in [0.05, 0.13, 0.37]:
        assert close(xc(-t), xc(t), 1e-12)
        assert close(xs(-t), -xs(t), 1e-12)
        assert abs(xs(t) - xs(-t)) > 0.1
    print("same |a_k| = 0.5, 0.25, 0.1667; cos-phase even, sin-phase odd")


def check_cards():
    # C4: X(j2) = 3 - 4j 인 실수 신호
    X2 = 3 - 4j
    Xm2 = X2.conjugate()
    assert Xm2 == 3 + 4j and close(abs(Xm2), 5.0)
    assert close(math.degrees(cmath.phase(Xm2)), 53.1301, 1e-3)
    # C5: sin w0 t -> 순허수·홀, cos w0 t -> 실수·짝 (계수로 확인)
    s = lambda t: math.sin(2 * math.pi * t)
    c = lambda t: math.cos(2 * math.pi * t)
    a1s, am1s = fs_coeff(s, 1), fs_coeff(s, -1)
    assert close(a1s, 1 / 2j, 1e-9) and close(am1s, -1 / 2j, 1e-9)
    a1c, am1c = fs_coeff(c, 1), fs_coeff(c, -1)
    assert close(a1c, 0.5, 1e-9) and close(am1c, 0.5, 1e-9)
    print("cards: X(-j2) = 3+4j, |.| = 5, angle 53.13 deg; sin -> +-1/(2j), cos -> 1/2")


if __name__ == "__main__":
    check_one_sided_exp()
    check_two_sided_exp()
    check_conjugate_property()
    check_real_not_even_gaussian()
    check_one_sided_real_spectrum()
    check_discrete_analogues()
    check_phase_example()
    check_cards()
    print("ALL CHECKS PASSED")
```
{% endraw %}
