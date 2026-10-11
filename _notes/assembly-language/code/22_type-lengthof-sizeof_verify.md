---
layout: "note"
title: "22_type-lengthof-sizeof_verify.py"
display_title: "22_type-lengthof-sizeof_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/type-lengthof-sizeof/"
parent_title: "TYPE·LENGTHOF·SIZEOF 연산자"
description: "어셈블리어 · TYPE·LENGTHOF·SIZEOF 연산자 검증 코드"
permalink: "/studies/assembly-language/code/22_type-lengthof-sizeof_verify/"
---
{% raw %}
[TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「TYPE·LENGTHOF·SIZEOF 연산자」: 슬라이드 표의 값, SIZEOF = LENGTHOF x TYPE, 여러 줄 정의, 카드 C1·C3

실행: python3 22_type-lengthof-sizeof_verify.py  (표준 라이브러리만 쓴다)
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
    c = CPU(); d = Data(c)
    # p.1 TYPE
    d.byte("var1", None); d.word("var2", None); d.dword("var3", None); d.define("var4", 8, None)
    assert [d.sym[n]["type"] for n in ("var1", "var2", "var3", "var4")] == [1, 2, 4, 8]
    # p.2~3 LENGTHOF, SIZEOF
    d.byte("byte1", 10, 20, 30)
    d.word("array1", dup(30, None), 0, 0)
    d.word("array2", dup(5, dup(3, None)))
    d.dword("array3", 1, 2, 3, 4)
    d.byte("digitStr", "12345678", 0)
    want = {"byte1": (3, 3), "array1": (32, 64), "array2": (15, 30), "array3": (4, 16), "digitStr": (9, 9)}
    for name, (length, size) in want.items():
        s = d.sym[name]
        assert (s["length"], s["size"]) == (length, size), name
        assert s["size"] == s["length"] * s["type"]          # SIZEOF = LENGTHOF x TYPE
    c.mov("ecx", d.sym["array1"]["length"]); assert c.get("ecx") == 32
    c.mov("ecx", d.sym["array1"]["size"]); assert c.get("ecx") == 64
    # p.4: 쉼표로 이은 여러 줄
    d.word("array", 10, 20, 30, 40, 50, 60)
    assert (d.sym["array"]["length"], d.sym["array"]["size"]) == (6, 12)
    # 쉼표 없이 새 지시어로 이으면 첫 줄만 센다 (메모리에는 이어서 놓인다)
    d2 = Data(CPU()); d2.word("arr", 10, 20); d2.word(None, 30, 40)
    assert (d2.sym["arr"]["length"], d2.sym["arr"]["size"]) == (2, 4) and d2.loc - d2.offset("arr") == 8
    # 위치 카운터로 센 값과 같다
    d3 = Data(CPU()); d3.word("list", 0x1000, 0x2000, 0x3000, 0x4000)
    assert (d3.loc - d3.offset("list")) // 2 == d3.sym["list"]["length"] == 4
    # 카드 C1
    d4 = Data(CPU()); d4.dword("tbl", dup(4, dup(2, 0)), 1)
    assert (d4.sym["tbl"]["type"], d4.sym["tbl"]["length"], d4.sym["tbl"]["size"]) == (4, 9, 36)
    # 카드 C3
    d5 = Data(CPU()); d5.byte("msg", "Hello", 0x0D, 0x0A, 0); d5.word("pts", dup(3, 1, 2))
    assert (d5.sym["msg"]["length"], d5.sym["msg"]["size"]) == (8, 8)
    assert (d5.sym["pts"]["length"], d5.sym["pts"]["size"]) == (6, 12)
    print("ALL CHECKS PASSED")
```
{% endraw %}
