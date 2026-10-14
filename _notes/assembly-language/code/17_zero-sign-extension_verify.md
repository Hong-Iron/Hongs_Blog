---
layout: "note"
title: "17_zero-sign-extension_verify.py"
display_title: "17_zero-sign-extension_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/zero-sign-extension/"
parent_title: "제로 확장과 부호 확장"
description: "어셈블리어 · 제로 확장과 부호 확장 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/17_zero-sign-extension_verify/"
---
{% raw %}
[제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「제로 확장과 부호 확장」: MOVZX·MOVSX 슬라이드 값, 8비트 전수 검사, 카드 C1·C3

실행: python3 17_zero-sign-extension_verify.py  (표준 라이브러리만 쓴다)
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
    # p.9~10
    c.mov("bl", 0b10001111); c.movzx("ax", "bl"); assert c.get("ax") == 0b0000000010001111 == 0x008F
    c.mov("bl", 0b10001111); c.movsx("ax", "bl"); assert c.get("ax") == 0b1111111110001111 == 0xFF8F
    assert signed(0x8F, 1) == -113 and signed(0xFF8F, 2) == -113 and 0x8F == 143
    # 크기가 다르면 MOV는 안 된다
    assert must_fail(c.mov, "ax", "bl") == "size mismatch"
    # 목적지는 레지스터여야 한다
    assert must_fail(c.movzx, ("m", 0x100, 2), "bl") == "destination must be a register"
    assert must_fail(c.movsx, ("m", 0x100, 2), "bl") == "destination must be a register"
    # 전수: 8비트 -> 16비트, 8비트 -> 32비트, 16비트 -> 32비트(표본)
    for v in range(256):
        c.mov("bl", v)
        c.mov("eax", 0xFFFFFFFF); c.movzx("ax", "bl"); assert c.get("ax") == v and c.get("eax") >> 16 == 0xFFFF
        c.movzx("eax", "bl"); assert c.get("eax") == v
        c.movsx("ax", "bl"); assert signed(c.get("ax"), 2) == signed(v, 1)
        c.movsx("eax", "bl"); assert signed(c.get("eax"), 4) == signed(v, 1)
        # 윗부분은 모두 부호 비트의 복사
        assert c.get("eax") >> 8 == (0xFFFFFF if v >> 7 else 0)
        # 양수(부호 비트 0)에서는 둘이 같다
        c.movzx("ecx", "bl")
        assert (c.get("ecx") == c.get("eax")) == (v < 128)
    for v in range(0, 0x10000, 3):
        c.mov("bx", v); c.movzx("eax", "bx"); assert c.get("eax") == v
        c.movsx("eax", "bx"); assert signed(c.get("eax"), 4) == signed(v, 2)
    # 손으로 하는 제로 확장
    c.mov("bl", 0x8F); c.mov("eax", 0xDEADBEEF); c.mov("eax", 0); c.mov("al", "bl"); assert c.get("eax") == 0x8F
    # 값이 그대로인 까닭: -2^7 = -2^15 + (2^14 + ... + 2^7)
    assert -2**7 == -2**15 + sum(2**k for k in range(7, 15))
    # 카드 C1
    c.mov("bl", 0x7F); c.movzx("ax", "bl"); a = c.get("ax"); c.movsx("ax", "bl"); assert a == c.get("ax") == 0x007F
    c.mov("bl", 0xF0); c.movzx("ax", "bl"); assert c.get("ax") == 0x00F0
    c.movsx("ax", "bl"); assert c.get("ax") == 0xFFF0
    # 카드 C3: 나이 200을 MOVSX로 넓히면 -56, 기온 -5를 MOVZX로 넓히면 251
    c.mov("bl", 200); c.movsx("eax", "bl"); assert signed(c.get("eax"), 4) == -56
    c.mov("bl", -5 & 0xFF); c.movzx("eax", "bl"); assert c.get("eax") == 251
    c.movsx("eax", "bl"); assert signed(c.get("eax"), 4) == -5 and c.get("eax") == 0xFFFFFFFB
    print("ALL CHECKS PASSED")
```
{% endraw %}
