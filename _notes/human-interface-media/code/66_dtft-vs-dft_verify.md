---
layout: "note"
title: "66_dtft-vs-dft_verify.py"
display_title: "66_dtft-vs-dft_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "66"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dtft-vs-dft/"
parent_title: "이산 시간 푸리에 변환과 이산 푸리에 변환 비교"
description: "휴먼 인터페이스 미디어 · 이산 시간 푸리에 변환과 이산 푸리에 변환 비교 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/66_dtft-vs-dft_verify/"
---
{% raw %}
[이산 시간 푸리에 변환과 이산 푸리에 변환 비교](/Hongs_Blog/studies/human-interface-media/dtft-vs-dft/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 66.이산 시간 푸리에 변환과 이산 푸리에 변환 비교 — 문서 주장 검증
# 실행: python3 -I 66_dtft-vs-dft_verify.py   (표준 라이브러리만 씀, 인덱스는 0부터)
import cmath
import math


def dtft(x, w, n0=0):
    """수열 x[n0], x[n0+1], ...의 DTFT를 주파수 w(rad/샘플)에서 계산한다."""
    return sum(v * cmath.exp(-1j * w * (n0 + n)) for n, v in enumerate(x))


def dft(x, N=None):
    """길이 N DFT. x가 N보다 짧으면 뒤에 0을 채운다."""
    N = N or len(x)
    x = list(x) + [0] * (N - len(x))
    return [sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) for k in range(N)]


def idft(X):
    N = len(X)
    return [sum(X[k] * cmath.exp(2j * math.pi * k * n / N) for k in range(N)) / N for n in range(N)]


def close(a, b, tol=1e-9):
    return abs(a - b) < tol


def main():
    # 1. DFT는 DTFT 곡선을 2πk/N에서 찍은 값이다 (길이 4, 0 채워 8, 16)
    x = [1, 2, 3, 4]
    for N in (4, 8, 16):
        X = dft(x, N)
        for k in range(N):
            assert close(X[k], dtft(x, 2 * math.pi * k / N))
    X4 = dft(x)
    assert close(X4[0], 10) and close(X4[1], -2 + 2j) and close(X4[2], -2) and close(X4[3], -2 - 2j)

    # 2. 0을 덧붙여도 DTFT 곡선은 그대로다 (아무 주파수에서나 같음)
    for w in (0.1, 0.77, 2.5, -1.3):
        assert close(dtft(x, w), dtft(x + [0] * 12, w))

    # 3. 곱셈: DTFT 곱 = 선형 합성곱, DFT 곱 = 순환 합성곱
    a, b = [1, 2, 3], [1, 1, 1]
    lin = [sum(a[i] * b[n - i] for i in range(len(a)) if 0 <= n - i < len(b)) for n in range(len(a) + len(b) - 1)]
    assert lin == [1, 3, 6, 5, 3]
    for w in (0.3, 1.1, 2.9):
        assert close(dtft(a, w) * dtft(b, w), dtft(lin, w))
    circ3 = [round(v.real, 9) for v in idft([p * q for p, q in zip(dft(a, 3), dft(b, 3))])]
    assert circ3 == [6, 6, 6], circ3                  # 뒤쪽 5, 3이 앞으로 접혀 1+5, 3+3, 6
    circ5 = [round(v.real, 9) for v in idft([p * q for p, q in zip(dft(a, 5), dft(b, 5))])]
    assert circ5 == lin                               # 길이 3+3-1 = 5 이상으로 채우면 선형과 같다
    circ4 = [round(v.real, 9) for v in idft([p * q for p, q in zip(dft(a, 4), dft(b, 4))])]
    assert circ4 == [4, 3, 6, 5], circ4               # 4로는 모자라 맨 끝 3이 앞으로 접힌다

    # 4. 점 개수 N이 수열 길이보다 작으면 시간 쪽에서 접힌다
    y = [1, 2, 3]
    Y2 = [dtft(y, 0), dtft(y, math.pi)]
    assert close(Y2[0], 6) and close(Y2[1], 2)
    back = [round(v.real, 9) for v in idft(Y2)]
    assert back == [4, 2], back                       # (1+3, 2)

    # 5. 5점 이동 평균: DTFT는 2π/5에서 정확히 0, DFT 8점은 그 자리를 찍지 않는다
    h = [1 / 5] * 5
    assert abs(dtft(h, 2 * math.pi / 5)) < 1e-12 and abs(dtft(h, 4 * math.pi / 5)) < 1e-12
    H8 = [abs(v) for v in dft(h, 8)]
    assert min(H8) > 0.08, H8                         # 가장 작은 값이 약 0.083 (k=3, 5): 0인 점이 없다
    # 5점 평균의 DTFT 크기는 |sin(5w/2) / (5 sin(w/2))| 이다. k=3(w=3π/4)에서 그 값과 같다
    assert close(H8[3], abs(math.sin(5 * 3 * math.pi / 8) / (5 * math.sin(3 * math.pi / 8))))
    H10 = [abs(v) for v in dft(h, 10)]
    assert sum(1 for v in H10 if v < 1e-12) == 4      # 10점이면 2π/5의 배수 넷(k=2,4,6,8)을 찍는다

    # 6. 해상도: 0.20, 0.22 사이클/샘플의 두 코사인. 24샘플은 0을 아무리 채워도(곡선 전체) 봉우리 하나, 128샘플은 둘
    def peaks(L, grid=2048):
        s = [math.cos(2 * math.pi * 0.20 * n) + math.cos(2 * math.pi * 0.22 * n) for n in range(L)]
        ws = [math.pi * i / grid for i in range(grid + 1)]
        mag = [abs(dtft(s, w)) for w in ws]
        top = max(mag)
        lo, hi = int(0.15 * 2 * grid), int(0.27 * 2 * grid)   # 0.15~0.27 사이클/샘플 구간만 본다
        return [ws[i] / (2 * math.pi) for i in range(lo + 1, hi)
                if mag[i] > mag[i - 1] and mag[i] > mag[i + 1] and mag[i] > 0.5 * top]
    p24, p128 = peaks(24), peaks(128)
    assert len(p24) == 1 and 0.205 < p24[0] < 0.215, p24
    assert len(p128) == 2 and abs(p128[0] - 0.20) < 0.003 and abs(p128[1] - 0.22) < 0.003, p128
    # 두 주파수 간격 0.02 사이클/샘플을 가르려면 대략 1/0.02 = 50샘플보다 길어야 한다
    assert 24 < 1 / 0.02 < 128

    # 6-2. 카드 C3: 1초에 8000번 재서 1000 Hz와 1010 Hz. 80샘플(0.01초)은 0을 채워도 하나, 1600샘플(0.2초)은 둘
    def peaks_hz(L, fs=8000, grid=4000):
        s = [math.cos(2 * math.pi * 1000 * n / fs) + math.cos(2 * math.pi * 1010 * n / fs) for n in range(L)]
        fr = [900 + 0.05 * i for i in range(grid + 1)]          # 900~1100 Hz를 0.05 Hz 간격으로
        mag = [abs(dtft(s, 2 * math.pi * f / fs)) for f in fr]
        top = max(mag)
        return [fr[i] for i in range(1, grid) if mag[i] > mag[i - 1] and mag[i] > mag[i + 1] and mag[i] > 0.5 * top]
    h80, h1600 = peaks_hz(80), peaks_hz(1600)
    assert len(h80) == 1, h80
    assert len(h1600) == 2 and abs(h1600[0] - 1000) < 1 and abs(h1600[1] - 1010) < 1, h1600
    assert 8000 / 80 == 100 and 8000 / 10 == 800                # 봉우리 폭 대략 fs/L = 100 Hz, 필요한 길이 약 800샘플

    # 7. 무한히 긴 수열 0.5^n u[n]: DTFT는 닫힌 식, DFT는 잘라야만 계산된다 (잘린 만큼 오차)
    w = 1.0
    closed = 1 / (1 - 0.5 * cmath.exp(-1j * w))
    for L, tol in ((8, 1e-2), (20, 1e-5)):
        assert abs(dtft([0.5 ** n for n in range(L)], w) - closed) < tol
    err8 = abs(dtft([0.5 ** n for n in range(8)], w) - closed)
    assert 0.004 < err8 < 0.005, err8                           # 8개로 자르면 약 0.005 차이 난다
    # 1초(44,100샘플) DFT의 점 간격은 fs/N = 1 Hz
    assert 44100 / 44100 == 1

    print(f"DFT 4점: {[complex(round(v.real, 6), round(v.imag, 6)) for v in X4]}")
    print(f"순환(N=3) {circ3}, 순환(N=4) {circ4}, 선형 {lin}")
    print(f"시간 접힘 N=2: {back}")
    print(f"이동 평균 DFT 8점 최솟값 {min(H8):.4f}")
    print(f"봉우리 24샘플 {[round(p, 4) for p in p24]}, 128샘플 {[round(p, 4) for p in p128]}")
    print(f"1000/1010 Hz 봉우리: 80샘플 {[round(v, 2) for v in h80]}, 1600샘플 {[round(v, 2) for v in h1600]}")
    print(f"0.5^n을 8개로 자른 오차 {err8:.5f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
