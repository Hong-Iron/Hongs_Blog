---
layout: "note"
title: "17_linearity_verify.py"
display_title: "17_linearity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/linearity/"
parent_title: "선형성"
description: "신호 및 시스템 · 선형성 검증 코드"
permalink: "/studies/signals-and-systems/code/17_linearity_verify/"
---
{% raw %}
[선형성](/Hongs_Blog/studies/signals-and-systems/linearity/) 문서의 검증 코드다.

```python
"""선형성 문서: 중첩(덧셈성과 동차성)을 무작위 입력으로 확인한다 (예제 1.17~1.20, 증분 선형)."""
import cmath, math, random
random.seed(11)
R = range(-20, 21)

def linear(S, cplx=False):
    for _ in range(20):
        A = {n: random.uniform(-2, 2) for n in range(-60, 61)}
        B = {n: random.uniform(-2, 2) for n in range(-60, 61)}
        a = complex(random.uniform(-2, 2), random.uniform(-2, 2) if cplx else 0)
        b = complex(random.uniform(-2, 2), random.uniform(-2, 2) if cplx else 0)
        x1, x2 = (lambda n: A.get(n, 0)), (lambda n: B.get(n, 0))
        x3 = lambda n: a * x1(n) + b * x2(n)
        if any(abs(S(x3, n) - (a * S(x1, n) + b * S(x2, n))) > 1e-9 for n in R):
            return False
    return True

assert linear(lambda x, n: n * x(n), cplx=True)                     # 예제 1.17: 선형(이산 버전)
assert not linear(lambda x, n: x(n) ** 2)                            # 예제 1.18
assert linear(lambda x, n: sum(x(k) for k in range(-60, n + 1)), True) and linear(lambda x, n: x(n - 1), True)
assert not linear(lambda x, n: cmath.sin(x(n)))
# 예제 1.18 수치: x1 = 1, a = 2 -> (2·1)^2 = 4 ≠ 2·1^2 = 2
assert (2 * 1) ** 2 == 4 and 2 * 1 ** 2 == 2
# 예제 1.19: y = Re{x}는 덧셈성은 만족, 복소수 배율에서 동차성이 깨진다
Re = lambda x, n: complex(x(n)).real
assert linear(Re, cplx=False)
x1 = lambda n: complex(3, 4)
assert Re(lambda n: 1j * x1(n), 0) == -4 and (1j * Re(x1, 0)) == 3j
# 예제 1.20: y = 2x + 3 -> 7 + 9 = 16 ≠ 13, 입력 0이면 출력 3
S = lambda v: 2 * v + 3
assert S(2) + S(3) == 16 and S(2 + 3) == 13 and S(0) == 3
assert not linear(lambda x, n: 2 * x(n) + 3)
# 증분 선형: 출력의 차이는 입력 차이의 선형 함수 y1 - y2 = 2(x1 - x2)
for _ in range(100):
    p, q = random.uniform(-5, 5), random.uniform(-5, 5)
    assert abs((S(p) - S(q)) - 2 * (p - q)) < 1e-12
# 선형 시스템은 입력 0에 출력 0
for T in (lambda x, n: n * x(n), lambda x, n: x(n - 1)):
    assert all(T(lambda n: 0, n) == 0 for n in R)
print("ALL CHECKS PASSED")
```
{% endraw %}
