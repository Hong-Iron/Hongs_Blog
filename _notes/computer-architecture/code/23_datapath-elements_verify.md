---
layout: "note"
title: "23_datapath-elements_verify.py"
display_title: "23_datapath-elements_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/datapath-elements/"
parent_title: "데이터패스의 구성 요소"
description: "컴퓨터 구조 · 데이터패스의 구성 요소 검증 코드"
permalink: "/studies/computer-architecture/code/23_datapath-elements_verify/"
---
{% raw %}
[데이터패스의 구성 요소](/Hongs_Blog/studies/computer-architecture/datapath-elements/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 데이터패스 부품 하나하나의 동작 확인 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 23_datapath-elements_verify.py
MASK = 0xFFFFFFFF


def sign_extend16(x):
    """16비트 -> 32비트. 맨 위 비트(15번)를 위쪽 16칸에 복사한다."""
    return x | 0xFFFF0000 if x & 0x8000 else x


def to_signed(x, bits=32):
    return x - (1 << bits) if x >> (bits - 1) else x


def shift_left2(x):
    return (x << 2) & MASK


def mux(sel, in0, in1):
    return in1 if sel else in0


class RegisterFile:
    """읽기 구멍 둘(조합), 쓰기 구멍 하나(클록 가장자리). 0번은 늘 0이다."""
    def __init__(self):
        self.r = [0] * 32

    def read(self, n1, n2):
        return self.r[n1], self.r[n2]

    def clock(self, regwrite, n, data):
        if regwrite and n != 0:
            self.r[n] = data & MASK


if __name__ == "__main__":
    # 부호 확장: 16비트 값 65,536가지 모두에서 2의 보수로 읽은 값이 그대로다
    for x in range(1 << 16):
        assert to_signed(sign_extend16(x)) == to_signed(x, 16)
    assert sign_extend16(0x0008) == 0x00000008
    assert sign_extend16(0xFFFC) == 0xFFFFFFFC and to_signed(0xFFFFFFFC) == -4
    assert sign_extend16(0x8004) == 0xFFFF8004 and to_signed(0xFFFF8004) == -32764
    # 0으로만 채우면 음수가 큰 양수로 바뀐다
    assert 0x0000FFFC == 65532
    # 왼쪽으로 두 칸 밀기 = 4를 곱하기 (명령어 수를 바이트 수로)
    for x in (0, 1, 3, 0xFFFFFFFD, 0x3FFFFFFF):
        assert shift_left2(x) == (x * 4) & MASK
    assert shift_left2(3) == 12 and to_signed(shift_left2(sign_extend16(0xFFFD))) == -12
    # PC + 4, 분기 목표 = (PC + 4) + (오프셋 << 2)
    pc = 0x00400020
    assert pc + 4 == 0x00400024
    assert (pc + 4 + shift_left2(sign_extend16(3))) & MASK == 0x00400030
    assert (pc + 4 + shift_left2(sign_extend16(0xFFFD))) & MASK == 0x00400018
    # 점프 목표 = PC + 4의 위 4비트 | 주소 칸 26비트 | 00
    addr26 = 0x0100010
    assert ((pc + 4) & 0xF0000000) | (addr26 << 2) == 0x00400040
    # 멀티플렉서
    assert mux(0, 11, 22) == 11 and mux(1, 11, 22) == 22
    # 레지스터 파일: 쓰기 신호가 0이면 그대로, 0번은 늘 0, 쓴 값은 다음 읽기부터 보인다
    rf = RegisterFile()
    rf.clock(1, 8, 123); rf.clock(0, 9, 456); rf.clock(1, 0, 789)
    assert rf.read(8, 9) == (123, 0) and rf.read(0, 0) == (0, 0)
    # 명령어 하나가 32비트 = 4바이트라서 PC는 4씩 는다. 레지스터 번호 5비트로 32개를 가리킨다
    assert 32 // 8 == 4 and 2 ** 5 == 32
    print("ALL CHECKS PASSED")
```
{% endraw %}
