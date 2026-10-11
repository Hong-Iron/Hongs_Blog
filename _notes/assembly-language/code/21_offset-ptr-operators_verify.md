---
layout: "note"
title: "21_offset-ptr-operators_verify.py"
display_title: "21_offset-ptr-operators_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/offset-ptr-operators/"
parent_title: "OFFSET과 PTR 연산자"
description: "어셈블리어 · OFFSET과 PTR 연산자 검증 코드"
permalink: "/studies/assembly-language/code/21_offset-ptr-operators_verify/"
---
{% raw %}
[OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「OFFSET과 PTR 연산자」: OFFSET 값, PTR로 일부만 읽고 쓰기, Your turn, LABEL, 카드 C1·C2

실행: python3 21_offset-ptr-operators_verify.py  (표준 라이브러리만 쓴다)
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
    # 5-3-2 p.10 OFFSET
    c = CPU(); d = Data(c, base=0x00404000)
    d.byte("bVal", None); d.word("wVal", None); d.dword("dVal", None); d.dword("dVal2", None)
    for name, want in (("bVal", 0x00404000), ("wVal", 0x00404001), ("dVal", 0x00404003), ("dVal2", 0x00404007)):
        c.mov("esi", d.offset(name)); assert c.get("esi") == want
    # p.12, p.14 PTR
    c = CPU(); d = Data(c)
    d.dword("myDouble", 0x12345678)
    assert must_fail(c.mov, "ax", d.m("myDouble")) == "size mismatch"
    c.mov("ax", d.m("myDouble", 0, 2)); assert c.get("ax") == 0x5678
    c.mov("al", d.m("myDouble", 0, 1)); assert c.get("al") == 0x78
    c.mov("al", d.m("myDouble", 1, 1)); assert c.get("al") == 0x56
    c.mov("al", d.m("myDouble", 2, 1)); assert c.get("al") == 0x34
    c.mov("ax", d.m("myDouble", 2, 2)); assert c.get("ax") == 0x1234
    c.mov(d.m("myDouble", 0, 2), 0x4321)
    assert c.get(d.m("myDouble")) == 0x12344321 and d.bytes_of("myDouble") == [0x21, 0x43, 0x34, 0x12]
    # p.15 작은 것을 모아 큰 것으로
    c = CPU(); d = Data(c)
    d.byte("myBytes", 0x12, 0x34, 0x56, 0x78)
    c.mov("ax", d.m("myBytes", 0, 2)); assert c.get("ax") == 0x3412
    c.mov("ax", d.m("myBytes", 2, 2)); assert c.get("ax") == 0x7856
    c.mov("eax", d.m("myBytes", 0, 4)); assert c.get("eax") == 0x78563412
    # p.16 Your turn
    c = CPU(); d = Data(c)
    d.byte("varB", 0x65, 0x31, 0x02, 0x05); d.word("varW", 0x6543, 0x1202); d.dword("varD", 0x12345678)
    c.mov("ax", d.m("varB", 2, 2)); assert c.get("ax") == 0x0502
    c.mov("bl", d.m("varD", 0, 1)); assert c.get("bl") == 0x78
    c.mov("bl", d.m("varW", 2, 1)); assert c.get("bl") == 0x02
    c.mov("ax", d.m("varD", 2, 2)); assert c.get("ax") == 0x1234
    c.mov("eax", d.m("varW", 0, 4)); assert c.get("eax") == 0x12026543
    # 5-3-3 p.5 LABEL
    c = CPU(); d = Data(c)
    d.label("dwList", 4); d.label("wordList", 2); d.byte("intList", 0x00, 0x10, 0x00, 0x20)
    assert d.offset("dwList") == d.offset("wordList") == d.offset("intList")
    c.mov("eax", d.m("dwList")); assert c.get("eax") == 0x20001000
    c.mov("cx", d.m("wordList")); assert c.get("cx") == 0x1000
    c.mov("dl", d.m("intList")); assert c.get("dl") == 0x00
    # 모든 DWORD 표본: BYTE PTR [x+k]는 k번째 바이트, WORD PTR 둘을 붙이면 원래 값
    for v in (0, 1, 0x12345678, 0xFFFFFFFF, 0x80000001, 0xDEADBEEF, 0x00FF00FF):
        c = CPU(); d = Data(c); d.dword("x", v)
        for k in range(4):
            assert c.get(d.m("x", k, 1)) == (v >> (8 * k)) & 0xFF
        assert c.get(d.m("x", 0, 2)) | (c.get(d.m("x", 2, 2)) << 16) == v
    # 카드 C1: OFFSET
    c = CPU(); d = Data(c, base=0x00404000)
    d.word("a", 1, 2, 3); d.byte("b", "Hi", 0); d.dword("cc", 5)
    assert (d.offset("a"), d.offset("b"), d.offset("cc")) == (0x00404000, 0x00404006, 0x00404009)
    # 카드 C2 추적
    c = CPU(); d = Data(c)
    d.dword("big", 0xCAFE1234); d.byte("small", 0xAA, 0xBB)
    c.mov("ax", d.m("big", 1, 2)); assert c.get("ax") == 0xFE12
    c.mov("bl", d.m("big", 3, 1)); assert c.get("bl") == 0xCA
    c.mov("cx", d.m("small", 0, 2)); assert c.get("cx") == 0xBBAA
    c.mov(d.m("big", 0, 1), 0xFF); assert c.get(d.m("big")) == 0xCAFE12FF
    print("ALL CHECKS PASSED")
```
{% endraw %}
