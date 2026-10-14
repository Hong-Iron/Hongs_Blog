---
layout: "note"
title: "01_computer-abstraction-layers_verify.py"
display_title: "01_computer-abstraction-layers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/computer-abstraction-layers/"
parent_title: "컴퓨터 구조와 추상화 계층"
description: "컴퓨터 구조 · 컴퓨터 구조와 추상화 계층 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/01_computer-abstraction-layers_verify/"
---
{% raw %}
[컴퓨터 구조와 추상화 계층](/Hongs_Blog/studies/computer-architecture/computer-abstraction-layers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 01.컴퓨터 구조와 추상화 계층: 문서의 예(고급 언어 한 줄 -> 어셈블리 한 줄 -> 기계어 32비트)를 확인한다.
# 실행: python3 01_computer-abstraction-layers_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬으로 비트를 이어 붙여 보는 확인이다.

REG = {"$zero": 0, "$t0": 8, "$t1": 9, "$s0": 16, "$s1": 17, "$s2": 18}


def encode_r(op, rs, rt, rd, shamt, funct):
    """R 형식: op(6) rs(5) rt(5) rd(5) shamt(5) funct(6)"""
    return (op << 26) | (rs << 21) | (rt << 16) | (rd << 11) | (shamt << 6) | funct


def fields(word):
    return (word >> 26, (word >> 21) & 31, (word >> 16) & 31,
            (word >> 11) & 31, (word >> 6) & 31, word & 63)


if __name__ == "__main__":
    # add $t0, $s1, $s2  ->  op=0, rs=$s1, rt=$s2, rd=$t0, shamt=0, funct=0x20
    w = encode_r(0, REG["$s1"], REG["$s2"], REG["$t0"], 0, 0x20)
    assert w == 0x02324020, hex(w)
    assert format(w, "032b") == "00000010001100100100000000100000"
    assert fields(w) == (0, 17, 18, 8, 0, 32)
    # 여섯 칸으로 끊어 쓴 모양
    b = format(w, "032b")
    parts = [b[0:6], b[6:11], b[11:16], b[16:21], b[21:26], b[26:32]]
    assert parts == ["000000", "10001", "10010", "01000", "00000", "100000"]
    # 카드 C3: sub $s0, $t0, $t1 (funct 0x22)
    w2 = encode_r(0, REG["$t0"], REG["$t1"], REG["$s0"], 0, 0x22)
    assert w2 == 0x01098022, hex(w2)
    # 같은 뜻(b + c)을 파이썬으로 계산한 값과 32비트 덧셈이 같다
    s1, s2 = 1234, 4321
    assert (s1 + s2) & 0xFFFFFFFF == 5555
    print("add $t0,$s1,$s2 =", hex(w), " sub $s0,$t0,$t1 =", hex(w2))
    print("ALL CHECKS PASSED")
```
{% endraw %}
