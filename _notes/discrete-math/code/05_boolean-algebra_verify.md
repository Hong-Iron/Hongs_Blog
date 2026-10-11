---
layout: "note"
title: "05_boolean-algebra_verify.py"
display_title: "05_boolean-algebra_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/boolean-algebra/"
parent_title: "불 대수와 논리 회로"
description: "이산수학 · 불 대수와 논리 회로 검증 코드"
permalink: "/studies/discrete-math/code/05_boolean-algebra_verify/"
---
{% raw %}
[불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""불 대수와 논리 회로 검증.

문서: 05.불 대수와 논리 회로 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: 반가산기 합 = a ⊕ b, 올림 = a·b. 전가산기로 만든 4비트 리플 캐리 가산기가 0~15의 모든 쌍을 맞게 더한다.
주장 2: 0101 + 0011의 올림 비트는 아래 자리부터 1, 1, 1, 0이고 합은 1000이다.
주장 3: NAND 하나로 NOT, AND, OR, XOR을 만들 수 있다.
주장 4: 입력 n개인 불 함수는 2^(2^n)개다 (n = 2이면 16).
주장 5: ab + ab' = a, a + a = a, 1 + 1 = 1 (불 대수의 +는 OR).
주장 6: x & (x - 1)은 가장 낮은 1비트를 지운다.
"""
from itertools import product

NAND = lambda a, b: 1 - (a & b)


def full_adder(a, b, c):
    s = a ^ b ^ c
    carry = (a & b) | (c & (a ^ b))
    return s, carry


def ripple(x, y, n=4):
    c, out, carries = 0, 0, []
    for i in range(n):
        s, c = full_adder((x >> i) & 1, (y >> i) & 1, c)
        out |= s << i
        carries.append(c)
    return out, c, carries


def main():
    for a, b in product([0, 1], repeat=2):
        assert (a ^ b, a & b) == ((a + b) % 2, (a + b) // 2)
    for x in range(16):
        for y in range(16):
            s, c, _ = ripple(x, y)
            assert s + 16 * c == x + y
    print("[OK] 주장 1·카드 C1: 반가산기, 4비트 가산기 256쌍")

    s, c, carries = ripple(0b0101, 0b0011)
    assert s == 0b1000 and carries == [1, 1, 1, 0] and c == 0
    print("[OK] 주장 2·카드 C2: 0101 + 0011 = 1000, 올림 1,1,1,0")

    for a, b in product([0, 1], repeat=2):
        NOT = NAND(a, a)
        AND = NAND(NAND(a, b), NAND(a, b))
        OR = NAND(NAND(a, a), NAND(b, b))
        t = NAND(a, b)
        XOR = NAND(NAND(a, t), NAND(b, t))
        assert (NOT, AND, OR, XOR) == (1 - a, a & b, a | b, a ^ b)
    print("[OK] 주장 3·카드 C3: NAND만으로 NOT·AND·OR·XOR")

    funcs = {tuple(outs) for outs in product([0, 1], repeat=4)}
    assert len(funcs) == 16 == 2 ** (2 ** 2)
    print("[OK] 주장 4: 2입력 불 함수 16개")

    for a, b in product([0, 1], repeat=2):
        assert ((a & b) | (a & (1 - b))) == a and (a | a) == a
    assert (1 | 1) == 1
    print("[OK] 주장 5")

    for x in range(1, 5000):
        low = x & -x
        assert x & (x - 1) == x - low
    print("[OK] 주장 6: x & (x-1)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
