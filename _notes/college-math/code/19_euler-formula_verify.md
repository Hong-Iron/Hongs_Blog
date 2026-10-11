---
layout: "note"
title: "19_euler-formula_verify.py"
display_title: "19_euler-formula_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/euler-formula/"
parent_title: "복소수의 극형식과 오일러 공식"
description: "대학수학 · 복소수의 극형식과 오일러 공식 검증 코드"
permalink: "/studies/college-math/code/19_euler-formula_verify/"
---
{% raw %}
[복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""복소수의 극형식과 오일러 공식 검증.

문서: 19.복소수의 극형식과 오일러 공식 (예시, 정리, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: 극형식의 곱은 크기를 곱하고 각을 더한다 (무작위 5,000쌍).
주장 2: (1 + i)^8 = 16, (1 + √3 i)^6 = 64.
주장 3: (1 + iθ/n)^n은 n이 커지면 cos θ + i sin θ에 다가간다 (θ = π에서 -1).
주장 4: e^{iπ} + 1 = 0 (부동소수점 오차 1.22e-16 이내).
주장 5: 1의 n제곱근 e^{2πik/n}의 합은 n >= 2이면 0이다. 세제곱근은 1, -1/2 ± (√3/2)i.
주장 6: 드무아브르로 cos 3θ = 4cos³θ - 3cos θ.
주장 7: 주값 arg끼리 더한 값이 곱의 주값과 다를 수 있다: arg(-1) + arg(-1) = 2π, arg(1) = 0.
주장 8: 정수가 아닌 지수에서 (e^{iθ})^(1/2)은 θ를 무엇으로 적느냐에 따라 1 또는 -1이 된다.
"""
import cmath
import math
import random


def main():
    rng = random.Random(19)
    for _ in range(5000):
        r1, r2 = rng.uniform(0.1, 5), rng.uniform(0.1, 5)
        t1, t2 = rng.uniform(-10, 10), rng.uniform(-10, 10)
        z1, z2 = cmath.rect(r1, t1), cmath.rect(r2, t2)
        assert cmath.isclose(z1 * z2, cmath.rect(r1 * r2, t1 + t2), rel_tol=1e-9, abs_tol=1e-12)
    print("[OK] 주장 1·카드 C1: 크기는 곱, 각은 합")

    assert cmath.isclose((1 + 1j) ** 8, 16) and cmath.isclose((1 + math.sqrt(3) * 1j) ** 6, 64)
    print("[OK] 주장 2·카드 C2: (1+i)^8 = 16, (1+√3i)^6 = 64")

    for theta in (0.5, 1.0, math.pi):
        approx = (1 + 1j * theta / 10 ** 6) ** (10 ** 6)
        assert cmath.isclose(approx, complex(math.cos(theta), math.sin(theta)), rel_tol=1e-5)
    print(f"[OK] 주장 3: (1 + iπ/10^6)^(10^6) = {(1 + 1j * math.pi / 10**6) ** (10**6):.6f}")

    v = cmath.exp(1j * math.pi) + 1
    assert abs(v) < 2e-16
    print(f"[OK] 주장 4: e^(iπ) + 1 = {v}")

    for n in range(2, 50):
        s = sum(cmath.exp(2j * math.pi * k / n) for k in range(n))
        assert abs(s) < 1e-12
    roots3 = [cmath.exp(2j * math.pi * k / 3) for k in range(3)]
    assert cmath.isclose(roots3[1], complex(-0.5, math.sqrt(3) / 2)) and all(cmath.isclose(w ** 3, 1) for w in roots3)
    print("[OK] 주장 5·카드 C3: n = 2..49에서 합 0, 세제곱근")

    for _ in range(5000):
        t = rng.uniform(-10, 10)
        assert math.isclose(math.cos(3 * t), 4 * math.cos(t) ** 3 - 3 * math.cos(t), abs_tol=1e-9)
        z3 = complex(math.cos(t), math.sin(t)) ** 3
        assert cmath.isclose(z3, complex(math.cos(3 * t), math.sin(3 * t)), abs_tol=1e-9)
    print("[OK] 주장 6: cos 3θ = 4cos³θ - 3cosθ")

    assert cmath.phase(-1) + cmath.phase(-1) == 2 * math.pi and cmath.phase((-1) * (-1)) == 0
    print("[OK] 주장 7·카드 C4: arg(-1) + arg(-1) = 2π, arg(1) = 0")

    half0 = cmath.exp(1j * 0 / 2); half2pi = cmath.exp(1j * 2 * math.pi / 2)
    assert cmath.isclose(half0, 1) and cmath.isclose(half2pi, -1)
    print("[OK] 주장 8: 1 = e^{i0} = e^{i2π}인데 반으로 나누면 1과 -1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
