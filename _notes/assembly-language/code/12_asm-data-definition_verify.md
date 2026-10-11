---
layout: "note"
title: "12_asm-data-definition_verify.py"
display_title: "12_asm-data-definition_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/asm-data-definition/"
parent_title: "데이터 정의"
description: "어셈블리어 · 데이터 정의 검증 코드"
permalink: "/studies/assembly-language/code/12_asm-data-definition_verify/"
---
{% raw %}
[데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「데이터 정의」: 자료형 크기, 초깃값이 메모리 바이트가 되는 모습, 문자열, DUP, AddSub2, 카드 C1·C3

실행: python3 12_asm-data-definition_verify.py  (표준 라이브러리만 쓴다)
MASM으로 돌린 결과가 아니다. 아래의 작은 x86 흉내기(8·16·32비트 레지스터, ZF·SF·CF·OF,
리틀 엔디언 메모리)로 슬라이드에 적힌 값과 문서의 값을 확인한다.
주소와 배열 번호는 0부터 센다.
"""
# ---- x86 흉내기 (이 파일 안에서만 쓴다. 다른 파일을 import하지 않는다) ----
MASK = {1: 0xFF, 2: 0xFFFF, 4: 0xFFFFFFFF}
R32 = ["eax", "ebx", "ecx", "edx", "esi", "edi", "ebp", "esp"]
PART = {}
for _r in "abcd":
    PART[_r + "l"] = ("e" + _r + "x", 0, 1)
    PART[_r + "h"] = ("e" + _r + "x", 8, 1)
    PART[_r + "x"] = ("e" + _r + "x", 0, 2)
for _r in ("si", "di", "bp", "sp"):
    PART[_r] = ("e" + _r, 0, 2)
for _r in R32:
    PART[_r] = (_r, 0, 4)
SREG = {"cs", "ds", "ss", "es", "fs", "gs"}


class AsmError(Exception):
    """어셈블러가 받아 주지 않는 문장."""


def signed(v, size):
    """size바이트 값 v를 부호 있는 수로 읽는다."""
    bits = 8 * size
    v &= MASK[size]
    return v - (1 << bits) if v >> (bits - 1) else v


class CPU:
    def __init__(self):
        self.r = dict.fromkeys(R32, 0)
        self.mem = {}
        self.ZF = self.SF = self.CF = self.OF = 0

    # --- 메모리: 리틀 엔디언 ---
    def rd(self, addr, size):
        return sum(self.mem.get(addr + i, 0) << (8 * i) for i in range(size))

    def wr(self, addr, size, v):
        for i in range(size):
            self.mem[addr + i] = (v >> (8 * i)) & 0xFF

    def dump(self, addr, n):
        return [self.mem.get(addr + i, 0) for i in range(n)]

    # --- 피연산자: "al" 같은 레지스터 이름, 정수(즉시값), ("m", 주소, 크기) ---
    def size(self, op):
        if isinstance(op, str):
            if op in SREG or op in ("ip",):
                return 2
            if op == "eip":
                return 4
            return PART[op][2]
        if isinstance(op, tuple):
            return op[2]
        return None

    def get(self, op):
        if isinstance(op, int):
            return op
        if isinstance(op, tuple):
            return self.rd(op[1], op[2])
        full, shift, size = PART[op]
        return (self.r[full] >> shift) & MASK[size]

    def set(self, op, v):
        if isinstance(op, tuple):
            self.wr(op[1], op[2], v & MASK[op[2]])
            return
        full, shift, size = PART[op]
        keep = self.r[full] & ~(MASK[size] << shift) & 0xFFFFFFFF
        self.r[full] = keep | ((v & MASK[size]) << shift)

    def _check(self, d, s):
        if isinstance(d, int):
            raise AsmError("immediate value cannot be destination")
        if d in ("eip", "ip", "cs"):
            raise AsmError("EIP/IP/CS cannot be the destination")
        if isinstance(d, tuple) and isinstance(s, tuple):
            raise AsmError("memory-to-memory not permitted")
        if isinstance(d, str) and d in SREG and isinstance(s, int):
            raise AsmError("immediate move to segment register not permitted")
        ds, ss = self.size(d), self.size(s)
        if ds is None:
            raise AsmError("ambiguous operand size")
        if ss is not None and ds != ss:
            raise AsmError("size mismatch")
        if ss is None and not -(1 << (8 * ds - 1)) <= s <= MASK[ds]:
            raise AsmError("immediate too large")
        return ds

    def flags(self):
        return (self.ZF, self.SF, self.CF, self.OF)

    def _zs(self, r, n):
        self.ZF = int(r == 0)
        self.SF = (r >> (8 * n - 1)) & 1

    # --- 명령 ---
    def mov(self, d, s):
        self._check(d, s)
        if isinstance(d, str) and d in SREG:
            return
        self.set(d, self.get(s))          # 플래그는 건드리지 않는다

    def xchg(self, a, b):
        if isinstance(a, int) or isinstance(b, int):
            raise AsmError("no immediate operands")
        self._check(a, b)
        va, vb = self.get(a), self.get(b)
        self.set(a, vb)
        self.set(b, va)

    def movzx(self, d, s):
        if not isinstance(d, str):
            raise AsmError("destination must be a register")
        if self.size(s) >= self.size(d):
            raise AsmError("source must be smaller")
        self.set(d, self.get(s))

    def movsx(self, d, s):
        if not isinstance(d, str):
            raise AsmError("destination must be a register")
        if self.size(s) >= self.size(d):
            raise AsmError("source must be smaller")
        self.set(d, signed(self.get(s), self.size(s)))

    def _add(self, a, b, n, keep_cf=False):
        m, top = MASK[n], 8 * n - 1
        full = a + b
        r = full & m
        if not keep_cf:
            self.CF = (full >> (top + 1)) & 1
        self.OF = (((a ^ r) & (b ^ r)) >> top) & 1
        self._zs(r, n)
        return r

    def _sub(self, a, b, n, keep_cf=False):
        m, top = MASK[n], 8 * n - 1
        r = (a - b) & m
        if not keep_cf:
            self.CF = int(a < b)
        self.OF = (((a ^ b) & (a ^ r)) >> top) & 1
        self._zs(r, n)
        return r

    def add(self, d, s):
        n = self._check(d, s)
        self.set(d, self._add(self.get(d), self.get(s) & MASK[n], n))

    def sub(self, d, s):
        n = self._check(d, s)
        self.set(d, self._sub(self.get(d), self.get(s) & MASK[n], n))

    def inc(self, d):
        n = self.size(d)
        if n is None:
            raise AsmError("ambiguous operand size")
        self.set(d, self._add(self.get(d), 1, n, keep_cf=True))   # CF는 그대로

    def dec(self, d):
        n = self.size(d)
        if n is None:
            raise AsmError("ambiguous operand size")
        self.set(d, self._sub(self.get(d), 1, n, keep_cf=True))   # CF는 그대로

    def neg(self, d):
        n = self.size(d)
        self.set(d, self._sub(0, self.get(d), n))                 # 0 - 값


def dup(count, *items):
    return list(items) * count


class Data:
    """데이터 세그먼트. 정의한 순서대로 바이트를 채우고 이름마다 주소·TYPE·LENGTHOF·SIZEOF를 적어 둔다."""

    def __init__(self, cpu, base=0x00404000):
        self.cpu, self.base, self.loc, self.sym = cpu, base, base, {}

    def _flat(self, items):
        for it in items:
            if isinstance(it, list):
                yield from self._flat(it)
            else:
                yield it

    def define(self, name, tsize, *items):
        start, count = self.loc, 0
        for it in self._flat(items):
            if isinstance(it, str) and tsize == 1:
                for ch in it:
                    self.cpu.wr(self.loc, 1, ord(ch))
                    self.loc += 1
                    count += 1
            else:
                self.cpu.wr(self.loc, tsize, (it or 0) & MASK.get(tsize, (1 << 8 * tsize) - 1))
                self.loc += tsize
                count += 1
        if name:
            self.sym[name] = {"addr": start, "type": tsize, "length": count, "size": count * tsize}

    def byte(self, name, *items):
        self.define(name, 1, *items)

    def word(self, name, *items):
        self.define(name, 2, *items)

    def dword(self, name, *items):
        self.define(name, 4, *items)

    def label(self, name, tsize):
        self.sym[name] = {"addr": self.loc, "type": tsize, "length": 1, "size": tsize}

    def offset(self, name):
        return self.sym[name]["addr"]

    def m(self, name, off=0, size=None):
        """이름+오프셋 메모리 피연산자. size를 주면 PTR로 크기를 바꾼 것이다."""
        return ("m", self.sym[name]["addr"] + off, size or self.sym[name]["type"])

    def bytes_of(self, name):
        return self.cpu.dump(self.sym[name]["addr"], self.sym[name]["size"])


def must_fail(fn, *args):
    try:
        fn(*args)
    except AsmError as e:
        return str(e)
    raise AssertionError("오류가 나야 하는데 통과했다")
# ---- 흉내기 끝 ----


if __name__ == "__main__":
    c = CPU()
    d = Data(c)
    # 내장 자료형의 크기(바이트): p.7~8
    TYPES = {"BYTE": 1, "SBYTE": 1, "WORD": 2, "SWORD": 2, "DWORD": 4, "SDWORD": 4,
             "QWORD": 8, "TBYTE": 10, "REAL4": 4, "REAL8": 8, "REAL10": 10}
    assert TYPES["TBYTE"] * 8 == 80 and TYPES["QWORD"] * 8 == 64
    # 범위: p.10, 4-3 p.2~3
    assert (0, 255) == (0, 2**8 - 1) and (-128, 127) == (-2**7, 2**7 - 1)
    assert 65535 == 2**16 - 1 and -32768 == -2**15 and -2147483648 == -2**31
    # p.10: 한 바이트씩
    d.byte("value1", "A"); d.byte("value3", 255); d.byte("value4", -128); d.byte("value5", 127)
    assert d.bytes_of("value1") == [0x41] and d.bytes_of("value3") == [0xFF]
    assert d.bytes_of("value4") == [0x80] and d.bytes_of("value5") == [0x7F]
    # SBYTE -1과 BYTE 255는 같은 바이트
    d.byte("m1", -1); d.byte("u255", 255)
    assert d.bytes_of("m1") == d.bytes_of("u255") == [0xFF]
    assert signed(0xFF, 1) == -1
    # p.11: 초깃값 여러 개
    d.byte("list1", 10, 20, 30, 40)
    start = d.loc
    d.byte("list2", 10, 20, 30, 40); d.byte(None, 50, 60, 70, 80); d.byte(None, 81, 82, 83, 84)
    assert d.loc - start == 12
    d.byte("list3", None, 32, 0x41, 0b00100010)
    d.byte("list4", 0x0A, 0x20, "A", 0x22)
    assert d.bytes_of("list3") == [0x00, 0x20, 0x41, 0x22]
    assert d.bytes_of("list4") == [0x0A, 0x20, 0x41, 0x22]
    assert d.bytes_of("list3")[1:] == d.bytes_of("list4")[1:]
    # p.12~14: 문자열
    d.byte("str1", "Enter your name", 0)
    assert d.sym["str1"]["size"] == 16 and d.bytes_of("str1")[-1] == 0
    d.byte("str3", "A", "E", "I", "O", "U")
    assert d.bytes_of("str3") == [0x41, 0x45, 0x49, 0x4F, 0x55]
    d.byte("greeting", "Welcome to the Encryption Demo program ", "created by Kip Irvine.", 0)
    assert d.sym["greeting"]["size"] == 39 + 22 + 1 == 62
    d.byte("menu", "Checking Account", 0x0D, 0x0A, 0x0D, 0x0A,
           "1. Create a new account", 0x0D, 0x0A,
           "2. Open an existing account", 0x0D, 0x0A,
           "3. Credit the account", 0x0D, 0x0A,
           "4. Debit the account", 0x0D, 0x0A,
           "5. Exit", 0x0A, 0x0A, "Choice> ", 0)
    assert d.sym["menu"]["size"] == 137, d.sym["menu"]["size"]
    d.byte("newLine", 0x0D, 0x0A, 0)
    assert d.bytes_of("newLine") == [13, 10, 0]
    # 4-3 p.1: DUP
    d.byte("var1", dup(20, 0)); d.byte("var2", dup(20, None)); d.byte("var3", dup(4, "STACK"))
    d.byte("var4", 10, dup(3, 0), 20)
    assert d.sym["var1"]["size"] == d.sym["var2"]["size"] == d.sym["var3"]["size"] == 20
    assert bytes(d.bytes_of("var3")) == b"STACKSTACKSTACKSTACK"
    assert d.bytes_of("var4") == [0x0A, 0, 0, 0, 0x14]
    # 4-3 p.2~3: WORD, DWORD
    d.word("word1", 65535); d.word("word2", -32768); d.word("myList", 1, 2, 3, 4, 5); d.word("array", dup(5, None))
    assert d.bytes_of("word1") == [0xFF, 0xFF] and d.bytes_of("word2") == [0x00, 0x80]
    assert d.sym["myList"]["size"] == 10 and d.sym["array"]["size"] == 10
    d.dword("val2", -2147483648); d.dword("val3", dup(20, None)); d.dword("val4", -3, -2, -1, 0, 1)
    assert d.bytes_of("val2") == [0, 0, 0, 0x80] and d.sym["val3"]["size"] == 80
    assert d.bytes_of("val4")[:4] == [0xFD, 0xFF, 0xFF, 0xFF] and d.sym["val4"]["size"] == 20
    # 4-3 p.5: AddSub2
    c2 = CPU(); d2 = Data(c2)
    d2.dword("val1", 0x10000); d2.dword("val2", 0x40000); d2.dword("val3", 0x20000); d2.dword("finalVal", None)
    c2.mov("eax", d2.m("val1")); c2.add("eax", d2.m("val2")); c2.sub("eax", d2.m("val3")); c2.mov(d2.m("finalVal"), "eax")
    assert c2.get(d2.m("finalVal")) == 0x30000
    # 카드 C1: buf BYTE 3,2 DUP(0FFh),"OK",0
    c3 = CPU(); d3 = Data(c3)
    d3.byte("buf", 3, dup(2, 0xFF), "OK", 0)
    assert d3.bytes_of("buf") == [0x03, 0xFF, 0xFF, 0x4F, 0x4B, 0x00] and d3.sym["buf"]["size"] == 6
    # 카드 C3: 세 정의의 전체 바이트 수
    d3.word("w", dup(3, 0)); d3.dword("dd", 1, 2); d3.byte("s", "Hi", 0x0D, 0x0A, 0)
    assert d3.sym["w"]["size"] + d3.sym["dd"]["size"] + d3.sym["s"]["size"] == 6 + 8 + 5 == 19
    print("ALL CHECKS PASSED")
```
{% endraw %}
