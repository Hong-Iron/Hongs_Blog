---
layout: "note"
title: "07_adder-circuit_verify.py"
display_title: "07_adder-circuit_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/adder-circuit/"
parent_title: "가산기"
description: "컴퓨터 구조 · 가산기 검증 코드"
permalink: "/studies/computer-architecture/code/07_adder-circuit_verify/"
---
{% raw %}
[가산기](/Hongs_Blog/studies/computer-architecture/adder-circuit/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 07.가산기: 전가산기, 8비트 리플 캐리 가산기, 뺄셈, 넘침, 올림 예측을 전수 검사한다.
# 실행: python3 07_adder-circuit_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬으로 게이트를 흉내 낸 것이다.
from itertools import product

N = 8


def full_adder(a, b, c):
    s = a ^ b ^ c                              # 합 = 세 입력의 XOR
    cout = (a & b) | (a & c) | (b & c)         # 올림 = 다수결
    return s, cout


def ripple(a, b, cin=0, n=N):
    """n비트 리플 캐리 가산기. 돌려주는 것: (합, 올림 목록 c0..cn)"""
    carries = [cin]
    total = 0
    for i in range(n):
        s, c = full_adder((a >> i) & 1, (b >> i) & 1, carries[i])
        total |= s << i
        carries.append(c)
    return total, carries


def addsub(a, b, sub, n=N):
    """SUB=1이면 b의 비트를 모두 뒤집고(XOR) 맨 아래 올림에 1을 넣는다: a + ~b + 1 = a - b"""
    mask = (1 << n) - 1
    bx = b ^ (mask if sub else 0)
    total, c = ripple(a, bx, sub, n)
    overflow = c[n] ^ c[n - 1]                 # 부호 있는 수의 넘침
    return total, c[n], overflow


def lookahead_carries(a, b, cin=0, n=N):
    """올림 예측: g_i = a_i b_i, p_i = a_i + b_i, c_(i+1) = g_i + p_i c_i 를 풀어 쓴 식으로
    모든 올림을 아래 자리 올림을 기다리지 않고 a, b, c0만으로 구한다."""
    g = [((a >> i) & 1) & ((b >> i) & 1) for i in range(n)]
    p = [((a >> i) & 1) | ((b >> i) & 1) for i in range(n)]
    carries = [cin]
    for i in range(n):
        # c_(i+1) = g_i + p_i g_(i-1) + p_i p_(i-1) g_(i-2) + ... + p_i ... p_0 c0
        c = 0
        for j in range(i, -1, -1):
            term = g[j]
            for k in range(j + 1, i + 1):
                term &= p[k]
            c |= term
        term = cin
        for k in range(0, i + 1):
            term &= p[k]
        c |= term
        carries.append(c)
    return carries, g, p


def signed(x, n=N):
    return x - (1 << n) if x >> (n - 1) else x


if __name__ == "__main__":
    # 전가산기 진리표 8줄: 2*올림 + 합 = 세 입력의 합
    for a, b, c in product((0, 1), repeat=3):
        s, co = full_adder(a, b, c)
        assert 2 * co + s == a + b + c
        assert co == (a & b) | (c & (a ^ b))   # 이산수학 문서의 식과 같은 값
    # 8비트 전수: 256 x 256 x 올림 입력 2가지
    for a in range(256):
        for b in range(256):
            for cin in (0, 1):
                total, c = ripple(a, b, cin)
                assert total == (a + b + cin) & 0xFF
                assert c[N] == (a + b + cin) >> 8
                assert lookahead_carries(a, b, cin)[0] == c
            # 뺄셈
            d, cout, ov = addsub(a, b, 1)
            assert d == (a - b) & 0xFF
            assert ov == int(not -128 <= signed(a) - signed(b) <= 127)
            assert cout == int(a >= b)          # 부호 없는 뺄셈에서 빌림이 없으면 올림 1
            s, cout, ov = addsub(a, b, 0)
            assert ov == int(not -128 <= signed(a) + signed(b) <= 127)
            assert cout == int(a + b > 255)     # 부호 없는 수의 넘침은 맨 위 올림
    # 예시: 0110 1101(109) + 0101 0110(86)
    a, b = 0b01101101, 0b01010110
    total, c = ripple(a, b)
    assert total == 0b11000011 == 195 and signed(total) == -61
    assert c == [0, 0, 0, 1, 1, 1, 1, 1, 0], c
    assert c[8] ^ c[7] == 1                     # 부호 있는 수로는 넘쳤다
    assert addsub(a, b, 0) == (195, 0, 1)
    # 같은 두 수의 뺄셈 109 - 86 = 23
    d, cout, ov = addsub(a, b, 1)
    assert (d, cout, ov) == (23, 1, 0)
    assert b ^ 0xFF == 0b10101001
    # 올림이 끝까지 물결치는 가장 나쁜 경우: 1111 1111 + 0000 0001
    total, c = ripple(0xFF, 0x01)
    assert total == 0 and c == [0, 1, 1, 1, 1, 1, 1, 1, 1]
    # 올림 예측 4비트 예: a = 0110, b = 0111, c0 = 0
    cs, g, p = lookahead_carries(0b0110, 0b0111, 0, 4)
    assert g == [0, 1, 1, 0] and p == [1, 1, 1, 0]      # 아랫자리부터
    assert cs == [0, 0, 1, 1, 0]
    assert ripple(0b0110, 0b0111, 0, 4) == (0b1101, cs)
    # 게이트 단 수: 리플은 자리마다 2단(AND-OR)이라 n비트에 2n단. 8비트 16단, 32비트 64단
    assert 2 * 8 == 16 and 2 * 32 == 64
    # 카드 C2: 1001 0110 + 0111 0101 (8비트)
    total, c = ripple(0b10010110, 0b01110101)
    assert total == 0b00001011 and c[8] == 1 and c[7] == 1 and c[8] ^ c[7] == 0
    assert 150 + 117 == 267 and signed(0b10010110) + signed(0b01110101) == 11
    # 카드 C3: 80 - 120을 가산기로: 0101 0000 + 1000 0111 + 1
    d, cout, ov = addsub(80, 120, 1)
    assert d == 0b11011000 and signed(d) == -40 and cout == 0 and ov == 0
    assert 120 ^ 0xFF == 0b10000111
    print("ALL CHECKS PASSED")
```
{% endraw %}
