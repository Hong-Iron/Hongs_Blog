---
layout: "note"
title: "59_dt-periodic-fourier-transform_verify.py"
display_title: "59_dt-periodic-fourier-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "59"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dt-periodic-fourier-transform/"
parent_title: "이산 주기 신호의 푸리에 변환"
description: "휴먼 인터페이스 미디어 · 이산 주기 신호의 푸리에 변환 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/59_dt-periodic-fourier-transform_verify/"
---
{% raw %}
[이산 주기 신호의 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-periodic-fourier-transform/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 주기 신호의 푸리에 변환 문서의 주장과 카드 답을 수치로 확인한다.
# 실행: python3 -I 59_dt-periodic-fourier-transform_verify.py  (표준 라이브러리만 사용)
import cmath
import math

TOL = 1e-9


def close(a, b, tol=TOL):
    return abs(a - b) < tol


def dirichlet(w, M):
    """D_M(w) = 합_{n=-M}^{M} e^{-jwn} = sin(w(M+1/2)) / sin(w/2)."""
    s = math.sin(w / 2)
    return 2 * M + 1 if abs(s) < 1e-15 else math.sin(w * (M + 0.5)) / s


def integrate(f, a, b, n=20000):
    if n % 2:
        n += 1
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3


def check_dirichlet_area():
    """1을 2M+1개 더한 수열의 DTFT: 봉우리 2M+1, 첫 영점 2pi/(2M+1), 한 주기 넓이는 늘 2pi."""
    for M in [2, 5, 20, 100]:
        assert close(dirichlet(0.0, M), 2 * M + 1)
        assert close(dirichlet(2 * math.pi / (2 * M + 1), M), 0.0, 1e-9)
        area = integrate(lambda w: dirichlet(w, M), -math.pi, math.pi, 40000)
        assert close(area, 2 * math.pi, 1e-6), (M, area)
        direct = sum(cmath.exp(-1j * 0.37 * n) for n in range(-M, M + 1))
        assert close(direct, dirichlet(0.37, M), 1e-9)
    print("Dirichlet kernel: peak 2M+1, first zero 2pi/(2M+1), area over one period = 2pi (M = 2, 5, 20, 100)")


def check_area_concentrates():
    """cos(2pi n/5)를 |n| <= M 만 남겨 변환하면, w0 = 2pi/5 근처의 넓이가 pi로 간다."""
    w0 = 2 * math.pi / 5
    M = 2000

    def XM(w):
        # cos(w0 n) = (e^{jw0 n} + e^{-jw0 n})/2 이므로 X_M(w) = (D_M(w - w0) + D_M(w + w0))/2
        return 0.5 * (dirichlet(w - w0, M) + dirichlet(w + w0, M))

    for k in range(-1, 2):                      # 2pi 간격으로 되풀이되는 자리에서도
        c = w0 + 2 * math.pi * k
        area = integrate(XM, c - 0.3, c + 0.3, 200000)
        assert abs(area - math.pi) < 0.01 * math.pi, (k, area)
    area0 = integrate(XM, -0.3, 0.3, 200000)
    assert abs(area0) < 0.01                    # 다른 곳에는 거의 없다
    print("truncated cos(2pi n/5): area near +-2pi/5 (+2pi l) -> pi, near 0 -> 0")


def inverse_from_impulses(spikes, n):
    """spikes: [(위치, 넓이)], 한 주기 [-pi, pi) 안의 임펄스만 써서 x[n] = (1/2pi) 합 넓이 e^{jwn}."""
    inside = [(w, A) for w, A in spikes if -math.pi <= w < math.pi]
    return sum(A * cmath.exp(1j * w * n) for w, A in inside) / (2 * math.pi)


def spikes_from_coeffs(a, N, periods=3):
    """주기 N 수열의 계수 a_k로 X = 합 2pi a_k delta(w - 2pi k/N) 의 임펄스 목록을 만든다."""
    out = []
    for k in range(-periods * N, periods * N):
        out.append((2 * math.pi * k / N, 2 * math.pi * a[k % N]))
    return out


def dfs(x):
    N = len(x)
    return [sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) / N for k in range(N)]


def check_complex_exponential():
    """e^{jw0 n} -> 합_l 2pi delta(w - w0 - 2pi l). 역변환으로 확인, w0 + 2pi r 도 같은 수열."""
    for w0 in [0.4, 2 * math.pi / 5, 1.0, -2.5]:
        # 한 주기 [-pi, pi) 안으로 옮긴 임펄스 하나
        wr = (w0 + math.pi) % (2 * math.pi) - math.pi
        for n in range(-6, 7):
            assert close(inverse_from_impulses([(wr, 2 * math.pi)], n), cmath.exp(1j * w0 * n), 1e-12)
            assert close(cmath.exp(1j * (w0 + 2 * math.pi * 3) * n), cmath.exp(1j * w0 * n), 1e-9)
    # w0 / 2pi 가 무리수이면 수열은 정확히 되풀이되지 않는다 (w0 = 1). N = 710 처럼 거의 되풀이되는 N은 있다.
    x = [cmath.exp(1j * n) for n in range(0, 1200)]
    gaps = [abs(x[N] - x[0]) for N in range(1, 1000)]
    assert min(gaps) > 1e-9
    assert gaps.index(min(gaps)) + 1 == 710 and abs(min(gaps) - 6.0e-5) < 1e-6
    print("e^{jw0 n}: one impulse 2pi per period recovers it; e^{jn} never repeats exactly (closest N = 710)")


def check_cos_example():
    """cos(2pi n/5): a_1 = a_{-1} = a_4 = 1/2 -> -pi <= w < pi 에서 pi delta(w -+ 2pi/5)."""
    N = 5
    x = [math.cos(2 * math.pi * n / N) for n in range(N)]
    a = dfs(x)
    assert close(a[1], 0.5) and close(a[4], 0.5) and all(close(a[k], 0) for k in (0, 2, 3))
    spikes = spikes_from_coeffs(a, N)
    inside = [(w, A) for w, A in spikes if -math.pi <= w < math.pi and abs(A) > 1e-9]
    assert len(inside) == 2
    assert sorted(round(w, 9) for w, _ in inside) == [round(-2 * math.pi / 5, 9), round(2 * math.pi / 5, 9)]
    assert all(close(A, math.pi) for _, A in inside)
    for n in range(-7, 8):
        assert close(inverse_from_impulses(spikes, n), math.cos(2 * math.pi * n / 5), 1e-12)
    # 2pi 바깥 자리: 2pi - 2pi/5 = 8pi/5 (k = 4) 에도 넓이 pi
    assert any(close(w, 8 * math.pi / 5) and close(A, math.pi) for w, A in spikes)
    print("cos(2pi n/5): impulses pi at +-2pi/5 (+2pi l), also at 8pi/5; inverse recovers cos")


def check_impulse_train():
    """주기 N 임펄스 열: a_k = 1/N -> 넓이 2pi/N, 간격 2pi/N."""
    for N in [4, 5, 8]:
        x = [1.0] + [0.0] * (N - 1)
        a = dfs(x)
        assert all(close(v, 1 / N) for v in a)
        spikes = spikes_from_coeffs(a, N)
        ws = sorted(w for w, _ in spikes)
        assert all(close(ws[i + 1] - ws[i], 2 * math.pi / N, 1e-12) for i in range(len(ws) - 1))
        assert all(close(A, 2 * math.pi / N) for _, A in spikes)
        for n in range(-2 * N, 2 * N):
            assert close(inverse_from_impulses(spikes, n), 1.0 if n % N == 0 else 0.0, 1e-12)
    print("impulse train: a_k = 1/N, areas 2pi/N, spacing 2pi/N (N = 4: pi/2, pi/2)")


def check_card_c1():
    """x[n] = 1 + cos(pi n / 2): N = 4, a_0 = 1, a_{+-1} = 1/2 -> 넓이 2pi (w=0), pi (w = +-pi/2)."""
    N = 4
    x = [1 + math.cos(math.pi * n / 2) for n in range(N)]
    a = dfs(x)
    assert close(a[0], 1) and close(a[1], 0.5) and close(a[3], 0.5) and close(a[2], 0)
    spikes = spikes_from_coeffs(a, N)
    inside = {round(w, 9): A for w, A in spikes if -math.pi <= w < math.pi and abs(A) > 1e-9}
    assert close(inside[0.0], 2 * math.pi) and close(inside[round(math.pi / 2, 9)], math.pi)
    assert close(inside[round(-math.pi / 2, 9)], math.pi) and len(inside) == 3
    for n in range(-8, 9):
        assert close(inverse_from_impulses(spikes, n), 1 + math.cos(math.pi * n / 2), 1e-12)
    print("card C1: 1 + cos(pi n/2) -> 2pi delta(w) + pi delta(w -+ pi/2), repeated every 2pi")


if __name__ == "__main__":
    check_dirichlet_area()
    check_area_concentrates()
    check_complex_exponential()
    check_cos_example()
    check_impulse_train()
    check_card_c1()
    print("ALL CHECKS PASSED")
```
{% endraw %}
