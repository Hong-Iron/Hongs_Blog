---
layout: "note"
title: "27_gcd-euclid_impl.py"
display_title: "27_gcd-euclid_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/gcd-euclid/"
parent_title: "최대공약수와 유클리드 호제법"
description: "이산수학 · 최대공약수와 유클리드 호제법 구현 코드"
permalink: "/studies/discrete-math/code/27_gcd-euclid_impl/"
---
{% raw %}
[최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유클리드 호제법과 확장 유클리드 호제법.

문서: 27.최대공약수와 유클리드 호제법
gcd(a, b): a, b >= 0, 둘 다 0은 아님. 나머지로 바꿔 가며 b가 0이 되면 a가 답.
ext_gcd(a, b): (g, s, t)를 돌려준다. g = gcd(a, b) = a·s + b·t (베주 항등식).
  반복마다 불변식 r0 = a·s0 + b·t0, r1 = a·s1 + b·t1, gcd(r0, r1) = gcd(a, b)를 지킨다.
"""
import math
import random


def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a


def ext_gcd(a, b, trace=None):
    if a < 0 or b < 0 or (a == 0 and b == 0):
        raise ValueError("a, b >= 0이고 둘 다 0은 아니어야 한다")
    r0, s0, t0 = a, 1, 0
    r1, s1, t1 = b, 0, 1
    if trace is not None:
        trace.append((r0, None, s0, t0))
        trace.append((r1, None, s1, t1))
    while r1 != 0:
        q = r0 // r1
        r0, r1 = r1, r0 - q * r1
        s0, s1 = s1, s0 - q * s1
        t0, t1 = t1, t0 - q * t1
        assert r0 == a * s0 + b * t0 and r1 == a * s1 + b * t1  # 불변식
        if trace is not None:
            trace.append((r1, q, s1, t1))
    return r0, s0, t0


def steps(a, b):
    """나눗셈 횟수."""
    n = 0
    while b != 0:
        a, b = b, a % b
        n += 1
    return n


if __name__ == "__main__":
    tr = []
    assert ext_gcd(252, 105, tr) == (21, -2, 5)
    assert [row[0] for row in tr] == [252, 105, 42, 21, 0] and [row[1] for row in tr[2:]] == [2, 2, 2]
    assert ext_gcd(1071, 462) == (21, -3, 7) and ext_gcd(240, 46) == (2, -9, 47)
    assert gcd(105, 252) == 21 and steps(105, 252) == steps(252, 105) + 1
    rng = random.Random(27)
    for _ in range(5000):
        a, b = rng.randint(0, 10 ** 12), rng.randint(0, 10 ** 12)
        if a == b == 0:
            continue
        g, s, t = ext_gcd(a, b)
        assert g == math.gcd(a, b) == gcd(a, b) and a * s + b * t == g
        if min(a, b) > 0:
            assert steps(max(a, b), min(a, b)) <= 2 * math.ceil(math.log2(min(a, b)) + 1)
    assert steps(89, 55) == 9
    try:
        ext_gcd(0, 0)
        raise AssertionError("예외가 나야 한다")
    except ValueError:
        pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
