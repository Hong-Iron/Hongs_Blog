---
layout: "note"
title: "17_system-properties-ladder_p4.py"
display_title: "17_system-properties-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "17"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/system-properties-ladder/"
parent_title: "시스템 성질 판별 예제 사다리"
description: "신호 및 시스템 · 시스템 성질 판별 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/signals-and-systems/code/17_system-properties-ladder_p4/"
---
{% raw %}
[시스템 성질 판별 예제 사다리](/Hongs_Blog/studies/signals-and-systems/system-properties-ladder/) 문서의 문제 4 풀이 코드다.

```python
"""시스템 성질 판별 예제 사다리: 문제 1~4의 시스템을 기억·인과·안정·시불변·선형으로 수치 판정한다."""
import cmath, math, random
random.seed(13)
SP = range(-40, 41)

def rnd(cplx=False):
    v = {n: complex(random.uniform(-1, 1), random.uniform(-1, 1) if cplx else 0) for n in range(-200, 201)}
    return lambda n: v.get(n, 0)

def memoryless(S):
    x = rnd(); z = dict()
    for n in range(-10, 11):
        x2 = lambda m, n=n: x(m) if m == n else x(m) + 5      # 지금 이외 입력만 바꾼다
        if abs(S(x2, n) - S(x, n)) > 1e-9: return False
    return True

def causal(S):
    x = rnd()
    for n0 in range(-5, 6):
        x2 = lambda m, n0=n0: x(m) if m <= n0 else x(m) + 5
        if any(abs(S(x2, n) - S(x, n)) > 1e-9 for n in range(-20, n0 + 1)): return False
    return True

def ti(S):
    x = rnd()
    for k in (1, 2, -3):
        x2 = lambda m, k=k: x(m - k)
        if any(abs(S(x2, n) - S(x, n - k)) > 1e-9 for n in range(-20, 21)): return False
    return True

def linear(S):
    for _ in range(5):
        x1, x2 = rnd(True), rnd(True)
        a, b = complex(random.uniform(-2, 2), random.uniform(-2, 2)), complex(random.uniform(-2, 2), 1)
        x3 = lambda m: a * x1(m) + b * x2(m)
        if any(abs(S(x3, n) - a * S(x1, n) - b * S(x2, n)) > 1e-9 for n in range(-20, 21)): return False
    return True

def bounded_out(S, x, N=2000):                 # 유계 입력에 대한 출력의 최대 크기
    return max(abs(S(x, n)) for n in range(0, N, 50))

# 이산 버전으로 판정한다 (문제 1의 t·x(t)는 n·x[n], 문제 3의 x(2t)는 x[2n])
s1 = lambda x, n: n * x(n)
s2 = lambda x, n: x(n) - x(n + 1)
s3 = lambda x, n: x(2 * n)
s4 = lambda x, n: complex(x(n)).real + x(n - 1) ** 2
one = lambda n: 1
assert (memoryless(s1), causal(s1), ti(s1), linear(s1)) == (True, True, False, True)
assert bounded_out(s1, one) >= 1950                                           # 불안정
assert (memoryless(s2), causal(s2), ti(s2), linear(s2)) == (False, False, True, True)
assert bounded_out(s2, lambda n: (-1) ** n) <= 2                            # 안정 (한계 2B)
assert (memoryless(s3), causal(s3), ti(s3), linear(s3)) == (False, False, False, True)
assert bounded_out(s3, lambda n: math.cos(n)) <= 1                            # 안정
assert (memoryless(s4), causal(s4), ti(s4), linear(s4)) == (False, True, True, False)
assert bounded_out(s4, lambda n: 1) <= 2                                      # 안정 (B + B^2)
print("ALL CHECKS PASSED")
```
{% endraw %}
