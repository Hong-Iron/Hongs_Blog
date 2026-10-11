---
layout: "note"
title: "08_alu_verify.py"
display_title: "08_alu_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/alu/"
parent_title: "ALU"
description: "컴퓨터 구조 · ALU 검증 코드"
permalink: "/studies/computer-architecture/code/08_alu_verify/"
---
{% raw %}
[ALU](/Hongs_Blog/studies/computer-architecture/alu/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 08.ALU: 1비트 ALU를 8개 이어 붙인 회로를 여섯 연산에 대해 전수 검사한다(8비트, 65,536쌍 x 6).
# 실행: python3 08_alu_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬으로 게이트를 흉내 낸 것이다. MIPS의 ALU는 32비트이고 여기서는 8비트로 줄였다.
N = 8
MASK = (1 << N) - 1

# 제어선 4비트 = Ainvert, Bnegate, Operation(2비트)
CTRL = {"and": 0b0000, "or": 0b0001, "add": 0b0010, "sub": 0b0110, "slt": 0b0111, "nor": 0b1100}


def alu1(a, b, less, ainvert, binvert, carry_in, op):
    """1비트 ALU. 돌려주는 것: (결과, 올림 출력, 가산기 출력)"""
    a2 = a ^ ainvert
    b2 = b ^ binvert
    and_ = a2 & b2
    or_ = a2 | b2
    s = a2 ^ b2 ^ carry_in
    cout = (a2 & b2) | (a2 & carry_in) | (b2 & carry_in)
    result = (and_, or_, s, less)[op]          # 4입력 멀티플렉서
    return result, cout, s


def alu(a, b, ctrl, fix_slt=False, n=N):
    """n비트 ALU. 돌려주는 것: (결과, zero, overflow, 올림 출력)
    fix_slt=False: 맨 윗자리 가산기 출력(Set)을 그대로 맨 아랫자리 Less에 잇는다.
    fix_slt=True : Set XOR Overflow를 잇는다(뺄셈이 넘칠 때도 맞게)."""
    ainvert = (ctrl >> 3) & 1
    bnegate = (ctrl >> 2) & 1
    op = ctrl & 3
    # 1단계: 가산기 줄을 먼저 흘려 Set과 넘침을 얻는다(조합 회로라 값이 가라앉은 뒤의 상태를 계산)
    carry = [bnegate]
    sums = []
    for i in range(n):
        _, c, s = alu1((a >> i) & 1, (b >> i) & 1, 0, ainvert, bnegate, carry[i], op)
        carry.append(c)
        sums.append(s)
    overflow = carry[n] ^ carry[n - 1]
    set_ = sums[n - 1]
    less0 = set_ ^ overflow if fix_slt else set_
    # 2단계: Less 입력을 넣어 결과를 고른다(윗자리 Less는 모두 0)
    result = 0
    for i in range(n):
        r, _, _ = alu1((a >> i) & 1, (b >> i) & 1, less0 if i == 0 else 0, ainvert, bnegate, carry[i], op)
        result |= r << i
    zero = int(result == 0)                    # 모든 결과 비트를 OR한 뒤 뒤집는다
    return result, zero, overflow, carry[n]


def signed(x, n=N):
    return x - (1 << n) if x >> (n - 1) else x


if __name__ == "__main__":
    wrong_naive = 0
    for a in range(256):
        for b in range(256):
            assert alu(a, b, CTRL["and"])[0] == a & b
            assert alu(a, b, CTRL["or"])[0] == a | b
            assert alu(a, b, CTRL["nor"])[0] == ~(a | b) & MASK
            r, z, ov, _ = alu(a, b, CTRL["add"])
            assert r == (a + b) & MASK and z == int(r == 0)
            assert ov == int(not -128 <= signed(a) + signed(b) <= 127)
            r, z, ov, _ = alu(a, b, CTRL["sub"])
            assert r == (a - b) & MASK
            assert z == int(a == b)            # beq가 쓰는 성질: a - b = 0  <=>  a = b
            assert ov == int(not -128 <= signed(a) - signed(b) <= 127)
            want = int(signed(a) < signed(b))
            naive = alu(a, b, CTRL["slt"], fix_slt=False)[0]
            fixed = alu(a, b, CTRL["slt"], fix_slt=True)[0]
            assert naive in (0, 1) and fixed == want
            if naive != want:
                wrong_naive += 1
                assert ov == 1                 # 틀리는 것은 뺄셈이 넘칠 때뿐이다
    # 부호 비트만 보는 slt는 65,536쌍 가운데 16,384쌍(정확히 4분의 1)에서 틀린다
    assert wrong_naive == 16384, wrong_naive
    # 예시: a = 0011 0110(54), b = 0010 1001(41)
    a, b = 0b00110110, 0b00101001
    assert alu(a, b, CTRL["and"])[0] == 0b00100000
    assert alu(a, b, CTRL["or"])[0] == 0b00111111
    assert alu(a, b, CTRL["add"])[0] == 0b01011111 == 95
    assert alu(a, b, CTRL["sub"])[0] == 0b00001101 == 13
    assert alu(a, b, CTRL["slt"])[0] == 0
    assert alu(b, a, CTRL["slt"])[0] == 1
    assert alu(b, a, CTRL["sub"])[0] == 0b11110011 and signed(0b11110011) == -13
    assert alu(a, b, CTRL["nor"])[0] == 0b11000000
    assert alu(a, a, CTRL["sub"])[:2] == (0, 1)        # 같은 값이면 zero = 1
    assert alu(a, b, CTRL["sub"])[1] == 0
    # 넘칠 때의 예: a = 100, b = -100. a - b = 200은 8비트에 안 들어간다
    a, b = 100, (-100) & MASK
    r, z, ov, _ = alu(a, b, CTRL["sub"])
    assert r == 0b11001000 and ov == 1 and r >> 7 == 1
    assert alu(a, b, CTRL["slt"], fix_slt=False)[0] == 1   # 틀림: 100 < -100이라고 답한다
    assert alu(a, b, CTRL["slt"], fix_slt=True)[0] == 0    # 맞음
    # NOR = (NOT a) AND (NOT b): 드모르간
    for a in range(256):
        for b in range(256):
            assert (~a & ~b) & MASK == ~(a | b) & MASK
    # 카드 C2: a = 0001 0100(20), b = 0001 0100(20), 제어 0110 -> 결과 0, zero 1
    assert alu(20, 20, 0b0110)[:2] == (0, 1)
    # 카드 C3: a = 1111 1011(-5), b = 0000 0011(3), 제어 0111 -> 1
    assert alu(0b11111011, 3, 0b0111)[0] == 1 and alu(0b11111011, 3, 0b0110)[0] == 0b11111000
    print("naive slt wrong pairs:", wrong_naive)
    print("ALL CHECKS PASSED")
```
{% endraw %}
