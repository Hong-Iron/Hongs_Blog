---
layout: "note"
title: "18_arithmetic-expression-practice_p3.py"
display_title: "18_arithmetic-expression-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "18"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/arithmetic-expression-practice/"
parent_title: "산술식을 어셈블리로 옮기기 연습"
description: "어셈블리어 · 산술식을 어셈블리로 옮기기 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/assembly-language/code/18_arithmetic-expression-practice_p3/"
---
{% raw %}
[산술식을 어셈블리로 옮기기 연습](/Hongs_Blog/studies/assembly-language/arithmetic-expression-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「산술식을 어셈블리로 옮기기 연습」 문제 1~3과 변형: 식의 값과 Xval·Yval·Zval이 그대로인지 확인

실행: python3 18_arithmetic-expression-practice_p3.py  (표준 라이브러리만 쓴다)
MASM으로 돌린 결과가 아니다. 아래의 작은 x86 흉내기(8·16·32비트 레지스터, ZF·SF·CF·OF,
리틀 엔디언 메모리)로 문서의 값을 확인한다.
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


def setup(x=26, y=30, z=40):
    c = CPU(); d = Data(c)
    d.dword("Rval", None); d.dword("Xval", x); d.dword("Yval", y); d.dword("Zval", z)
    return c, d


def unchanged(c, d, x, y, z):
    return [signed(c.get(d.m(n)), 4) for n in ("Xval", "Yval", "Zval")] == [x, y, z]


def p1(x, y, z):                      # Rval = -Xval + (Yval - Zval)
    c, d = setup(x, y, z)
    c.mov("eax", d.m("Xval")); c.neg("eax")
    c.mov("ebx", d.m("Yval")); c.sub("ebx", d.m("Zval"))
    c.add("eax", "ebx"); c.mov(d.m("Rval"), "eax")
    assert unchanged(c, d, x, y, z)
    return signed(c.get(d.m("Rval")), 4)


def p1_one_register(x, y, z):         # 변형: EAX 하나로
    c, d = setup(x, y, z)
    c.mov("eax", d.m("Yval")); c.sub("eax", d.m("Zval")); c.sub("eax", d.m("Xval"))
    c.mov(d.m("Rval"), "eax")
    assert unchanged(c, d, x, y, z) and c.get("ebx") == 0
    return signed(c.get(d.m("Rval")), 4)


def p2(x, y, z):                      # Rval = Xval - (-Yval + Zval)  (문서의 답)
    c, d = setup(x, y, z)
    c.mov("ebx", d.m("Yval")); c.neg("ebx"); c.add("ebx", d.m("Zval"))
    c.mov("eax", d.m("Xval")); c.sub("eax", "ebx"); c.mov(d.m("Rval"), "eax")
    assert unchanged(c, d, x, y, z)
    return signed(c.get(d.m("Rval")), 4)


def p2_wrong(x, y, z):                # 흔한 실수: neg Yval (변수를 바꿔 버린다)
    c, d = setup(x, y, z)
    c.neg(d.m("Yval")); c.mov("ebx", d.m("Yval")); c.add("ebx", d.m("Zval"))
    c.mov("eax", d.m("Xval")); c.sub("eax", "ebx"); c.mov(d.m("Rval"), "eax")
    return signed(c.get(d.m("Rval")), 4), unchanged(c, d, x, y, z)


def p3(x, y, z):                      # Rval = (Xval - Yval) + (-Zval + 10)
    c, d = setup(x, y, z)
    c.mov("eax", d.m("Xval")); c.sub("eax", d.m("Yval"))
    c.mov("ebx", d.m("Zval")); c.neg("ebx"); c.add("ebx", 10)
    c.add("eax", "ebx"); c.mov(d.m("Rval"), "eax")
    assert unchanged(c, d, x, y, z)
    return signed(c.get(d.m("Rval")), 4)


def p3_variant(x, y, z):              # 변형: Rval = Xval - Yval - Zval + 10 을 EAX 하나로
    c, d = setup(x, y, z)
    c.mov("eax", d.m("Xval")); c.sub("eax", d.m("Yval")); c.sub("eax", d.m("Zval")); c.add("eax", 10)
    c.mov(d.m("Rval"), "eax")
    assert unchanged(c, d, x, y, z)
    return signed(c.get(d.m("Rval")), 4)


if __name__ == "__main__":
    import random
    assert p1(26, 30, 40) == -36
    assert -36 & 0xFFFFFFFF == 0xFFFFFFDC
    assert p1_one_register(26, 30, 40) == -36
    assert p2(26, 30, 40) == 16
    assert p2_wrong(26, 30, 40) == (16, False)   # 값은 같아도 Yval이 -30으로 바뀐다
    assert p3(26, 30, 40) == -34 and p3_variant(26, 30, 40) == -34
    random.seed(1)
    for _ in range(2000):
        x, y, z = (random.randint(-10**6, 10**6) for _ in range(3))
        assert p1(x, y, z) == -x + (y - z) == p1_one_register(x, y, z)
        assert p2(x, y, z) == x - (-y + z)
        assert p3(x, y, z) == (x - y) + (-z + 10) == p3_variant(x, y, z)
    print("ALL CHECKS PASSED")
```
{% endraw %}
