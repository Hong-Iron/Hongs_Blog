---
layout: "note"
title: "27_dft_impl.py"
display_title: "27_dft_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/dft/"
parent_title: "이산 푸리에 변환과 FFT"
description: "선형대수학 · 이산 푸리에 변환과 FFT 구현 코드"
permalink: "/studies/linear-algebra/code/27_dft_impl/"
---
{% raw %}
[이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이산 푸리에 변환(DFT)과 고속 푸리에 변환(FFT).

문서: 27.이산 푸리에 변환과 FFT
dft(x): X_k = Σ_j x_j ω^{-jk}, ω = e^{2πi/n}. 정의대로 O(n²).
fft(x): 쿨리–튜키 기수 2. n이 2의 거듭제곱일 때 짝수·홀수 번째로 나눠 재귀. O(n log n).
ifft(X): x_j = (1/n) Σ_k X_k ω^{jk}. 켤레를 취해 fft를 재사용한다.
poly_mul(a, b): 정수 계수 다항식 곱을 FFT로(합성곱 정리). 결과를 반올림한다(계수가 크면 부동소수점 한계에 주의).
"""
import cmath
import random


def dft(x):
    n = len(x)
    return [sum(x[j] * cmath.exp(-2j * cmath.pi * j * k / n) for j in range(n)) for k in range(n)]


def fft(x):
    n = len(x)
    if n == 1:
        return [complex(x[0])]
    if n % 2:
        raise ValueError("길이는 2의 거듭제곱이어야 한다")
    even, odd = fft(x[0::2]), fft(x[1::2])
    out = [0j] * n
    for k in range(n // 2):
        t = cmath.exp(-2j * cmath.pi * k / n) * odd[k]   # 회전 인자 ω^{-k}
        out[k] = even[k] + t
        out[k + n // 2] = even[k] - t
    return out


def ifft(X):
    n = len(X)
    y = fft([v.conjugate() for v in X])
    return [v.conjugate() / n for v in y]


def poly_mul(a, b):
    m = len(a) + len(b) - 1
    size = 1
    while size < m:
        size *= 2
    A = fft(list(a) + [0] * (size - len(a)))
    B = fft(list(b) + [0] * (size - len(b)))
    c = ifft([p * q for p, q in zip(A, B)])
    return [round(v.real) for v in c[:m]]


if __name__ == "__main__":
    X = fft([1, 2, 3, 4])
    assert all(abs(p - q) < 1e-12 for p, q in zip(X, [10, -2 + 2j, -2, -2 - 2j]))
    rng = random.Random(27)
    for n in (1, 2, 4, 8, 16, 64):
        x = [complex(rng.uniform(-1, 1), rng.uniform(-1, 1)) for _ in range(n)]
        assert all(abs(p - q) < 1e-9 for p, q in zip(fft(x), dft(x)))
        assert all(abs(p - q) < 1e-12 for p, q in zip(ifft(fft(x)), x))
    for _ in range(100):
        a = [rng.randint(-9, 9) for _ in range(rng.randint(1, 30))]
        b = [rng.randint(-9, 9) for _ in range(rng.randint(1, 30))]
        naive = [0] * (len(a) + len(b) - 1)
        for i, u in enumerate(a):
            for j, v in enumerate(b):
                naive[i + j] += u * v
        assert poly_mul(a, b) == naive
    try:
        fft([1, 2, 3])
        raise AssertionError("예외가 나야 한다")
    except ValueError:
        pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
