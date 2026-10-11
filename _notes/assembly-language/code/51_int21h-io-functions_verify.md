---
layout: "note"
title: "51_int21h-io-functions_verify.py"
display_title: "51_int21h-io-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "51"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/int21h-io-functions/"
parent_title: "INT 21h 입출력 함수"
description: "어셈블리어 · INT 21h 입출력 함수 검증 코드"
permalink: "/studies/assembly-language/code/51_int21h-io-functions_verify/"
---
{% raw %}
[INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 51.INT 21h 입출력 함수 문서의 확인. 실행: python3 51_int21h-io-functions_verify.py
# MS-DOS가 없어서 INT 21h를 실제로 부르지 않는다. 슬라이드가 적은 규칙(AH에 번호, 입력·출력 레지스터)을
# 파이썬 함수로 흉내 내고, 슬라이드 코드의 레지스터 값과 계산만 단언한다.

class Dos:
    """INT 21h 가운데 문서에 나온 몇 개만 흉내 낸다."""

    def __init__(self, keys=b""):
        self.keys = list(keys)   # 표준 입력에 기다리는 글자
        self.out = bytearray()   # 표준 출력
        self.mem = {}            # 오프셋 -> 바이트 (DS 세그먼트라고 본다)
        self.zf = 0

    def load(self, off, data):
        for i, b in enumerate(data):
            self.mem[off + i] = b

    def int21(self, ah, al=0, bx=0, cx=0, dx=0):
        dl = dx & 0xFF
        if ah == 0x01:                       # 글자 하나 읽기 (에코 있음, 기다림)
            ch = self.keys.pop(0)
            self.out.append(ch)
            return ch
        if ah == 0x02:                       # 글자 하나 쓰기
            self.out.append(dl)
            return al
        if ah == 0x06:                       # DL=FFh면 기다리지 않고 읽기, 아니면 DL을 쓰기
            if dl == 0xFF:
                if self.keys:
                    self.zf = 0
                    return self.keys.pop(0)
                self.zf = 1
                return 0
            self.out.append(dl)
            return al
        if ah == 0x09:                       # '$'로 끝나는 문자열 쓰기
            off = dx
            while self.mem[off] != ord("$"):
                self.out.append(self.mem[off])
                off += 1
            return al
        if ah == 0x0B:                       # 입력 버퍼 상태: 있으면 FFh, 없으면 0
            return 0xFF if self.keys else 0
        if ah == 0x40:                       # CX바이트 쓰기, AX = 쓴 바이트 수
            for i in range(cx):
                self.out.append(self.mem[dx + i])
            return cx
        raise ValueError(hex(ah))


def read_string(dos, cx):
    """wk13-2-2 p.22 ReadString을 한 줄씩 옮겼다. (AX, 버퍼)를 돌려준다."""
    stack = [cx, "si", cx]      # push cx / push si / push cx
    buf = []
    cx -= 1                     # dec cx
    while True:
        al = dos.int21(0x01)    # L1: mov ah,1 / int 21h
        if al == 0x0D:          # cmp al,0Dh / je L2
            break
        buf.append(al)          # mov [si],al / inc si
        cx = (cx - 1) & 0xFFFF  # loop L1
        if cx == 0:
            break
    buf.append(0)               # L2: mov BYTE PTR [si],0
    ax = stack.pop()            # pop ax
    ax = (ax - cx) & 0xFFFF     # sub ax,cx
    return ax, buf


if __name__ == "__main__":
    # 02h: 'A' 쓰기. 05h 예의 65도 같은 글자다 (wk13-2-1 p.18~19)
    d = Dos()
    d.int21(0x02, dx=ord("A"))
    assert d.out == b"A" and ord("A") == 65 == 0x41
    # 제어 문자 값 (wk13-2-1 p.17)
    assert (0x08, 0x09, 0x0A, 0x0C, 0x0D, 0x1B) == (8, 9, 10, 12, 13, 27)

    # 09h: '$' 앞까지만 나온다 (wk13-2-1 p.20)
    d = Dos()
    d.load(0x100, b"This is a string$")
    d.int21(0x09, dx=0x100)
    assert d.out == b"This is a string"
    # '$'가 없으면 멈출 곳이 없다: 뒤에 놓인 다른 자료까지 나온다
    d = Dos()
    d.load(0x100, b"Hello" + b"SECRET$")
    d.int21(0x09, dx=0x100)
    assert d.out == b"HelloSECRET"

    # 40h: LENGTHOF message = 31, AX = 31 (wk13-2-1 p.21)
    msg = b"Writing a string to the console"
    assert len(msg) == 31
    d = Dos()
    d.load(0x200, msg)
    assert d.int21(0x40, bx=1, cx=len(msg), dx=0x200) == 31 and d.out == msg

    # 06h + DL=FFh: 글자가 없으면 ZF=1, 있으면 ZF=0이고 AL에 글자 (wk13-2-2 p.3)
    d = Dos(b"x")
    assert d.int21(0x06, dx=0xFF) == ord("x") and d.zf == 0
    assert d.int21(0x06, dx=0xFF) == 0 and d.zf == 1
    # 0Bh: 버퍼가 비면 AL=0 (wk13-2-2 p.6, wk14-16 p.16 부록)
    assert Dos(b"").int21(0x0B) == 0 and Dos(b"k").int21(0x0B) == 0xFF

    # 문자열 암호화 (wk13-2-2 p.7): XORVAL = 239
    XORVAL = 239
    assert XORVAL == 0xEF

    def encrypt(data):
        d = Dos(data)
        while True:
            al = d.int21(0x06, dx=0xFF)      # L1
            if d.zf:                         # jz L2
                break
            al ^= XORVAL                     # xor al,XORVAL
            d.int21(0x06, dx=al)             # mov dl,al / int 21h
        return bytes(d.out)

    # 0FFh가 되는 글자(10h)는 "쓰기"가 아니라 "읽기"로 해석되므로 빼고 확인한다
    plain = bytes(b for b in range(256) if b ^ XORVAL != 0xFF)
    assert len(plain) == 255 and 0x10 ^ XORVAL == 0xFF
    cipher = encrypt(plain)
    assert cipher == bytes(b ^ XORVAL for b in plain)
    # 같은 값으로 두 번 XOR하면 원래대로 (8비트 전수)
    assert all((b ^ XORVAL) ^ XORVAL == b for b in range(256))
    assert ord("A") ^ XORVAL == 0xAE

    # ReadString (wk13-2-2 p.20~22): CX = 20, "abc" + Enter
    ax, buf = read_string(Dos(b"abc\r"), 20)
    assert buf == [ord("a"), ord("b"), ord("c"), 0]
    assert ax == 4            # 슬라이드 코드 그대로면 글자 수 3이 아니라 4가 나온다
    # 19글자를 꽉 채운 경우: 20이 나온다 (글자 수 19)
    ax, buf = read_string(Dos(b"x" * 25), 20)
    assert len(buf) == 20 and buf[-1] == 0 and ax == 20
    # Enter만 누른 경우: 1 (글자 수 0)
    ax, buf = read_string(Dos(b"\r"), 20)
    assert buf == [0] and ax == 1
    # 어느 길이든 "글자 수 + 1"
    for n in range(0, 20):
        ax, buf = read_string(Dos(b"y" * n + b"\r"), 20)
        assert ax == n + 1 and len(buf) == n + 1

    # 날짜·시간 함수의 성공 검사 (wk13-2-2 p.11, 13): 코드는 AL != 0이면 failed로 간다
    def set_date_branch(al):
        return "failed" if al != 0 else "ok"   # cmp al,0 / jne failed
    assert set_date_branch(0) == "ok" and set_date_branch(0xFF) == "failed"

    # 4Ch: AH = 4Ch, AL = 반환 코드 (wk13-2-1 p.15)
    assert 0x4C == 76
    print("ALL CHECKS PASSED")
```
{% endraw %}
