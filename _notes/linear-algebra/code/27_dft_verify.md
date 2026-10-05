---
layout: "note"
title: "27_dft_verify.py"
display_title: "27_dft_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/dft/"
parent_title: "이산 푸리에 변환과 FFT"
description: "선형대수학 · 이산 푸리에 변환과 FFT 검증 코드"
permalink: "/studies/linear-algebra/code/27_dft_verify/"
---
{% raw %}
[이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이산 푸리에 변환과 FFT 검증.

문서: 27.이산 푸리에 변환과 FFT (예시, 정의, 알고리즘, 정확성, 복잡도, 합성곱 정리, 예제, 카드 C1~C3)
주장 1: 예시 — DFT(1,2,3,4) = (10, -2+2i, -2, -2-2i), 역변환으로 복원.
주장 2: 무작위 벡터(n = 1..128, 2의 거듭제곱) — FFT = 정의 DFT, ifft(fft(x)) = x.
주장 3: 푸리에 행렬 — conj(F)^T F = n I (n <= 16), 단위근의 합 = 0, 카드 C3.
주장 4: 합성곱 정리 — 순환 합성곱의 DFT = 성분별 곱 (무작위).
주장 5: 예제 — â = (3, 1-2i, -1, 1+2i), b̂ = (7, 3-4i, -1, 3+4i), 곱 (21, -5-10i, 1, -5+10i), 역변환 (3,10,8,0).
         무작위 다항식 곱이 단순 곱과 같다.
주장 6: 곱셈 횟수 — 회전 인자 곱셈이 (n/2) log2 n, n = 2^20에서 n²과의 비가 약 10만 배.
주장 7: 카드 C1 — DFT(1,0,-1,0) = (0,2,0,2).
"""
import cmath
import math
import random


def dft(x):
    n = len(x)
    return [sum(x[j] * cmath.exp(-2j * cmath.pi * j * k / n) for j in range(n)) for k in range(n)]


def fft(x, counter=None):
    n = len(x)
    if n == 1:
        return [complex(x[0])]
    even, odd = fft(x[0::2], counter), fft(x[1::2], counter)
    out = [0j] * n
    for k in range(n // 2):
        t = cmath.exp(-2j * cmath.pi * k / n) * odd[k]
        if counter is not None:
            counter[0] += 1
        out[k] = even[k] + t
        out[k + n // 2] = even[k] - t
    return out


def ifft(X):
    n = len(X)
    return [v.conjugate() / n for v in fft([v.conjugate() for v in X])]


def close(u, v, tol=1e-9):
    return all(abs(a - b) < tol for a, b in zip(u, v))


def main():
    X = fft([1, 2, 3, 4])
    assert close(X, [10, -2 + 2j, -2, -2 - 2j]) and close(dft([1, 2, 3, 4]), X) and close(ifft(X), [1, 2, 3, 4])
    print("[OK] 주장 1: 예시")

    rng = random.Random(27)
    for m in range(0, 8):
        n = 2 ** m
        for _ in range(5):
            x = [complex(rng.uniform(-1, 1), rng.uniform(-1, 1)) for _ in range(n)]
            assert close(fft(x), dft(x), 1e-8) and close(ifft(fft(x)), x, 1e-12)
    print("[OK] 주장 2: FFT = DFT, 왕복")

    for n in range(1, 17):
        w = cmath.exp(2j * cmath.pi / n)
        for j in range(n):
            for l in range(n):
                s = sum((w ** (k * j)).conjugate() * w ** (k * l) for k in range(n))
                assert abs(s - (n if j == l else 0)) < 1e-9
        if n > 1:
            assert abs(sum(w ** k for k in range(n))) < 1e-9
    print("[OK] 주장 3·카드 C3: 열의 직교성, 단위근의 합")

    for _ in range(50):
        n = 2 ** rng.randint(1, 6)
        a = [rng.uniform(-3, 3) for _ in range(n)]
        b = [rng.uniform(-3, 3) for _ in range(n)]
        conv = [sum(a[j] * b[(k - j) % n] for j in range(n)) for k in range(n)]
        assert close(fft(conv), [p * q for p, q in zip(fft(a), fft(b))], 1e-8)
    print("[OK] 주장 4: 합성곱 정리")

    A, B = fft([1, 2, 0, 0]), fft([3, 4, 0, 0])
    assert close(A, [3, 1 - 2j, -1, 1 + 2j]) and close(B, [7, 3 - 4j, -1, 3 + 4j])
    P = [p * q for p, q in zip(A, B)]
    assert close(P, [21, -5 - 10j, 1, -5 + 10j]) and close(ifft(P), [3, 10, 8, 0])
    for _ in range(100):
        a = [rng.randint(-9, 9) for _ in range(rng.randint(1, 20))]
        b = [rng.randint(-9, 9) for _ in range(rng.randint(1, 20))]
        m = len(a) + len(b) - 1
        size = 1
        while size < m:
            size *= 2
        c = ifft([p * q for p, q in zip(fft(a + [0] * (size - len(a))), fft(b + [0] * (size - len(b))))])
        naive = [0] * m
        for i, u in enumerate(a):
            for j, v in enumerate(b):
                naive[i + j] += u * v
        assert [round(v.real) for v in c[:m]] == naive
    print("[OK] 주장 5: 예제와 다항식 곱")

    for m in range(1, 11):
        n = 2 ** m
        cnt = [0]
        fft([0.0] * n, cnt)
        assert cnt[0] == n // 2 * m
    n = 2 ** 20
    ratio = n * n / (n // 2 * 20)
    assert 1.0e5 < ratio < 1.1e5
    print(f"[OK] 주장 6: 곱셈 수 (n/2)log2 n, 백만 점에서 {ratio:.3g}배")

    assert close(fft([1, 0, -1, 0]), [0, 2, 0, 2])
    print("[OK] 주장 7·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
