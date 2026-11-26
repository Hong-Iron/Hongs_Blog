---
layout: "note"
title: "60_four-fourier-representations_verify.py"
display_title: "60_four-fourier-representations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "60"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/four-fourier-representations/"
parent_title: "푸리에 표현 네 가지 비교"
description: "휴먼 인터페이스 미디어 · 푸리에 표현 네 가지 비교 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/60_four-fourier-representations_verify/"
---
{% raw %}
[푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 표현 네 가지 비교 문서의 주장을 수치로 확인한다.
# 실행: python3 -I 60_four-fourier-representations_verify.py  (표준 라이브러리만 사용)
import cmath
import math

TOL = 1e-9


def close(a, b, tol=TOL):
    return abs(a - b) < tol


def simpson(f, a, b, n=20000):
    if n % 2:
        n += 1
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3


def dft(x):
    N = len(x)
    return [sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) for k in range(N)]


def check_ctfs_vs_ctft():
    """연속·주기(사각파, T=4, T1=1)의 T a_k 는 연속·비주기(펄스 하나)의 X(jw)를 w = k w0 에서 찍은 값.
    계수는 k 에 대해 되풀이되지 않는다."""
    T, T1 = 4.0, 1.0
    w0 = 2 * math.pi / T
    X = lambda w: 2 * T1 if w == 0 else 2 * math.sin(w * T1) / w
    a = {}
    for k in range(-12, 13):
        a[k] = simpson(lambda t: cmath.exp(-1j * k * w0 * t), -T1, T1, 4000) / T
        assert close(T * a[k], X(k * w0), 1e-9)
    assert close(a[0], 0.5) and close(a[1], 1 / math.pi) and close(a[3], -1 / (3 * math.pi))
    assert not close(a[1], a[1 + 8], 1e-3)        # 되풀이 없음
    print("CTFS of square wave: T a_k = X(j k w0); a_1 != a_9 (no repetition)")


def check_dtfs_vs_dtft():
    """이산·주기(N=10)의 N a_k 는 이산·비주기(1이 5개)의 X(e^{jw})를 2pi k/N 에서 찍은 값. a_k 는 N칸마다 되풀이."""
    N = 10
    x = [1.0 if (n % N) in (0, 1, 2, 8, 9) else 0.0 for n in range(N)]
    a = [v / N for v in dft(x)]
    X = lambda w: 5.0 if abs(math.sin(w / 2)) < 1e-15 else math.sin(2.5 * w) / math.sin(w / 2)
    for k in range(-15, 16):
        assert close(N * a[k % N], X(2 * math.pi * k / N), 1e-9)
    for w in [0.3, 1.7, -2.4]:
        assert close(X(w + 2 * math.pi), X(w), 1e-12)               # 이산 시간 -> 주파수 주기 2pi
    assert close(a[1], 0.3236068, 1e-6)
    print("DTFS (N=10): N a_k = X(e^{j2pi k/N}); a_k repeats every N; DTFT repeats every 2pi")


def check_dft_is_dtfs_and_dtft_samples():
    """DFT = 한 주기의 N a_k = 유한 수열 DTFT의 표본."""
    seq = [2.0, -1.0, 0.5, 3.0, 0.0, 1.5]
    N = len(seq)
    D = dft(seq)
    a = [sum(seq[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) / N for k in range(N)]
    dtft = lambda w: sum(seq[n] * cmath.exp(-1j * w * n) for n in range(N))
    for k in range(N):
        assert close(D[k], N * a[k], 1e-12)
        assert close(D[k], dtft(2 * math.pi * k / N), 1e-12)
    # 되돌리기도 정확하다 (N개 숫자 <-> N개 숫자)
    back = [sum(D[k] * cmath.exp(2j * math.pi * k * n / N) for k in range(N)) / N for n in range(N)]
    assert all(close(back[n], seq[n], 1e-12) for n in range(N))
    print("DFT = N a_k = DTFT samples; inverse DFT restores the 6 numbers exactly")


def check_leakage():
    """구간에 정수 개 주기가 들어가면 두 칸에만, 아니면 모든 칸으로 퍼진다(누설). 해닝 창은 퍼짐을 줄인다."""
    N = 32
    whole = [math.cos(2 * math.pi * 4 * n / N) for n in range(N)]
    half = [math.cos(2 * math.pi * 4.5 * n / N) for n in range(N)]
    Dw = [abs(v) for v in dft(whole)]
    Dh = [abs(v) for v in dft(half)]
    nz_w = [k for k in range(N) if Dw[k] > 1e-9]
    nz_h = [k for k in range(N) if Dh[k] > 1e-9]
    assert nz_w == [4, 28] and close(Dw[4], 16.0, 1e-9)
    assert len(nz_h) == N
    far = max(Dh[k] for k in range(10, 23))                          # 4.5 에서 먼 칸
    hann = [0.5 - 0.5 * math.cos(2 * math.pi * n / N) for n in range(N)]
    Dhw = [abs(v) for v in dft([half[n] * hann[n] for n in range(N)])]
    far_w = max(Dhw[k] for k in range(10, 23))
    assert far_w < far / 10
    print("leakage: 4 cycles -> bins 4, 28 only; 4.5 cycles -> all 32 bins; Hann window cuts far leakage",
          round(far, 3), "->", round(far_w, 4))


if __name__ == "__main__":
    check_ctfs_vs_ctft()
    check_dtfs_vs_dtft()
    check_dft_is_dtfs_and_dtft_samples()
    check_leakage()
    print("ALL CHECKS PASSED")
```
{% endraw %}
