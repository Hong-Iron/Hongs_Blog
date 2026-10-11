---
layout: "note"
title: "19_x86-status-flags_verify.py"
display_title: "19_x86-status-flags_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/x86-status-flags/"
parent_title: "산술 연산과 상태 플래그"
description: "어셈블리어 · 산술 연산과 상태 플래그 검증 코드"
permalink: "/studies/assembly-language/code/19_x86-status-flags_verify/"
---
{% raw %}
[산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""「산술 연산과 상태 플래그」와 「올림 플래그와 넘침 플래그 비교」: 슬라이드 값과 Your turn, ADD·SUB 8비트 전수 검사(65,536쌍), 'OF = CF XOR MSB' 반증, INC·DEC·NEG, 카드

실행: python3 19_x86-status-flags_verify.py  (표준 라이브러리만 쓴다)
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


def true_cf(a, b, n, sub):
    """부호 없는 수로 본 참값이 n바이트 범위(0 ~ 2^(8n)-1)를 벗어나는가."""
    t = a - b if sub else a + b
    return int(not 0 <= t <= MASK[n])


def true_of(a, b, n, sub):
    """부호 있는 수로 본 참값이 n바이트 범위를 벗어나는가."""
    t = signed(a, n) - signed(b, n) if sub else signed(a, n) + signed(b, n)
    lim = 1 << (8 * n - 1)
    return int(not -lim <= t <= lim - 1)


if __name__ == "__main__":
    c = CPU()
    # 5-3-1 p.13 ZF
    c.mov("cx", 1); c.sub("cx", 1); assert c.get("cx") == 0 and c.ZF == 1
    c.mov("ax", 0xFFFF); c.inc("ax"); assert c.get("ax") == 0 and c.ZF == 1
    c.inc("ax"); assert c.get("ax") == 1 and c.ZF == 0
    # p.14 SF
    c.mov("cx", 0); c.sub("cx", 1); assert signed(c.get("cx"), 2) == -1 and c.SF == 1
    c.add("cx", 2); assert c.get("cx") == 1 and c.SF == 0
    c.mov("al", 0); c.sub("al", 1); assert c.get("al") == 0b11111111 and c.SF == 1
    c.add("al", 2); assert c.get("al") == 0b00000001 and c.SF == 0
    # 5-3-2 p.3 CF
    c.mov("al", 0xFF); c.add("al", 1); assert c.CF == 1 and c.get("al") == 0x00
    c.mov("al", 0); c.sub("al", 1); assert c.CF == 1 and c.get("al") == 0xFF
    # p.4 Your turn (OF 칸은 슬라이드에 없다. 흉내기 값을 문서 표에 실었다)
    c.mov("ax", 0x00FF)
    c.add("ax", 1); assert (c.get("ax"), c.SF, c.ZF, c.CF, c.OF) == (0x0100, 0, 0, 0, 0)
    c.sub("ax", 1); assert (c.get("ax"), c.SF, c.ZF, c.CF, c.OF) == (0x00FF, 0, 0, 0, 0)
    c.add("al", 1); assert (c.get("al"), c.SF, c.ZF, c.CF, c.OF) == (0x00, 0, 1, 1, 0)
    c.mov("bh", 0x6C)
    c.add("bh", 0x95); assert (c.get("bh"), c.SF, c.ZF, c.CF, c.OF) == (0x01, 0, 0, 1, 0)
    c.mov("al", 2)
    c.sub("al", 3); assert (c.get("al"), c.SF, c.ZF, c.CF, c.OF) == (0xFF, 1, 0, 1, 0)
    # p.5 OF
    c.mov("al", 127); c.add("al", 1); assert c.OF == 1 and c.get("al") == 0x80 and signed(0x80, 1) == -128
    c.mov("al", 0x7F); c.add("al", 1); assert c.OF == 1 and c.get("al") == 0x80
    # p.6 Rule of thumb
    c.mov("al", 0x80); c.add("al", 0x92); assert c.OF == 1 and c.get("al") == 0x12
    c.mov("al", -2 & 0xFF); c.add("al", 127); assert c.OF == 0 and c.get("al") == 125
    # MOV는 플래그를 그대로 둔다 (p.11)
    c.mov("al", 0x7F); c.add("al", 1); f = c.flags(); c.mov("al", 0); assert c.flags() == f == (0, 1, 0, 1)

    # ---- 8비트 전수 검사: 65,536쌍 x (ADD, SUB) ----
    wrong = {("add", k): 0 for k in "rab"}
    wrong.update({("sub", k): 0 for k in "rab"})
    literal_neg_wrong = 0
    for a in range(256):
        for b in range(256):
            # ADD
            c.mov("al", a); c.add("al", b); r = c.get("al")
            assert r == (a + b) & 0xFF
            assert c.CF == true_cf(a, b, 1, False) and c.OF == true_of(a, b, 1, False)
            assert c.ZF == int(r == 0) and c.SF == r >> 7
            carry_in = ((a & 0x7F) + (b & 0x7F)) >> 7        # 6번 비트에서 7번 비트로 올라온 올림
            carry_out = (a + b) >> 8                         # 7번 비트 밖으로 나간 올림
            assert c.CF == carry_out
            assert c.OF == carry_in ^ carry_out              # 7주차 p.4의 규칙
            sa, sb, sr = a >> 7, b >> 7, r >> 7
            assert c.OF == int(sa == sb and sr != sa)        # p.6의 어림 규칙
            for k, v in (("r", r), ("a", a), ("b", b)):       # "OF = CF XOR MSB"를 세 가지로 읽어 본다
                wrong[("add", k)] += int((c.CF ^ (v >> 7)) != c.OF)
            # SUB: a + (b의 비트 뒤집기) + 1 로 계산
            c.mov("al", a); c.sub("al", b); r = c.get("al")
            assert r == (a - b) & 0xFF
            assert c.CF == true_cf(a, b, 1, True) and c.OF == true_of(a, b, 1, True)
            nb = ~b & 0xFF
            carry_in = ((a & 0x7F) + (nb & 0x7F) + 1) >> 7
            carry_out = (a + nb + 1) >> 8
            assert r == (a + nb + 1) & 0xFF
            assert c.CF == 1 - carry_out                     # CF = 올림을 뒤집은 것 (p.2)
            assert c.OF == carry_in ^ carry_out
            assert c.OF == int((a >> 7) != (b >> 7) and (r >> 7) != (a >> 7))
            # "source를 NEG한 뒤 더한다"를 글자 그대로 하면 b = 0에서 CF가 틀린다
            literal_neg_wrong += int(1 - ((a + (-b & 0xFF)) >> 8) != c.CF)
            for k, v in (("r", r), ("a", a), ("b", b)):
                wrong[("sub", k)] += int((c.CF ^ (v >> 7)) != c.OF)
    # 어떻게 읽어도 절반이 틀린다
    assert all(v == 32768 for v in wrong.values()), wrong
    assert literal_neg_wrong == 256
    # 반례 하나: FFh + 01h
    c.mov("al", 0xFF); c.add("al", 1)
    assert (c.get("al"), c.CF, c.OF) == (0, 1, 0) and (c.CF ^ (c.get("al") >> 7)) == 1 != c.OF
    # 부호가 다른 두 수의 덧셈은 넘치지 않는다 (증명의 3단계)
    for a in range(128):
        for b in range(128, 256):
            c.mov("al", a); c.add("al", b); assert c.OF == 0
    # INC, DEC는 CF를 건드리지 않는다. 나머지 플래그는 ADD 1, SUB 1과 같다
    for v in range(256):
        for cf0 in (0, 1):
            c.mov("al", 0xFF if cf0 else 0); c.add("al", 1 if cf0 else 0); assert c.CF == cf0
            c.mov("al", v); c.inc("al"); got = c.flags()
            c2 = CPU(); c2.mov("al", v); c2.add("al", 1)
            assert got[2] == cf0 and (got[0], got[1], got[3]) == (c2.ZF, c2.SF, c2.OF)
            c.mov("al", 0xFF if cf0 else 0); c.add("al", 1 if cf0 else 0)
            c.mov("al", v); c.dec("al"); got = c.flags()
            c2 = CPU(); c2.mov("al", v); c2.sub("al", 1)
            assert got[2] == cf0 and (got[0], got[1], got[3]) == (c2.ZF, c2.SF, c2.OF)
    # NEG: CF는 값이 0이 아닐 때 1, OF는 -128일 때만 1
    for v in range(256):
        c.mov("al", v); c.neg("al"); assert c.CF == int(v != 0) and c.OF == int(v == 0x80)
    # 16비트 표본 검사
    for a in range(0, 0x10000, 257):
        for b in range(0, 0x10000, 263):
            c.mov("ax", a); c.add("ax", b); assert c.CF == true_cf(a, b, 2, False) and c.OF == true_of(a, b, 2, False)
            c.mov("ax", a); c.sub("ax", b); assert c.CF == true_cf(a, b, 2, True) and c.OF == true_of(a, b, 2, True)

    # (CF, OF) 네 조합의 개수 (비교 문서의 표)
    combos = {}
    for a in range(256):
        for b in range(256):
            c.mov("al", a); c.add("al", b); combos[(c.CF, c.OF)] = combos.get((c.CF, c.OF), 0) + 1
    assert combos == {(0, 0): 24768, (0, 1): 8128, (1, 0): 24384, (1, 1): 8256}
    for (a, b), want in {(0x50, 0x20): (0x70, 0, 0), (0xFF, 0x01): (0x00, 1, 0),
                         (0x7F, 0x01): (0x80, 0, 1), (0x80, 0x80): (0x00, 1, 1)}.items():
        c.mov("al", a); c.add("al", b); assert (c.get("al"), c.CF, c.OF) == want
    # OF가 서는 예 셋, 서지 않는 예 둘
    c.mov("al", 0x80); c.sub("al", 1); assert (c.get("al"), c.OF, c.CF) == (0x7F, 1, 0)
    c.mov("al", 2); c.sub("al", 3); assert c.OF == 0
    # 카드 C2 추적
    c = CPU()
    c.mov("al", 0xF0)
    c.add("al", 0x20); assert (c.get("al"), c.ZF, c.SF, c.CF, c.OF) == (0x10, 0, 0, 1, 0)
    c.sub("al", 0x11); assert (c.get("al"), c.ZF, c.SF, c.CF, c.OF) == (0xFF, 0, 1, 1, 0)
    c.add("al", 1);    assert (c.get("al"), c.ZF, c.SF, c.CF, c.OF) == (0x00, 1, 0, 1, 0)
    c.mov("al", 0x90); assert (c.ZF, c.SF, c.CF, c.OF) == (1, 0, 1, 0)
    c.sub("al", 0x20); assert (c.get("al"), c.ZF, c.SF, c.CF, c.OF) == (0x70, 0, 0, 0, 1)
    # 「올림 플래그와 넘침 플래그 비교」 카드 C1~C3의 값
    c.mov("al", 200); c.add("al", 100); assert (c.get("al"), c.CF, c.OF) == (44, 1, 0)
    c.mov("al", 100); c.add("al", 50); assert (c.get("al"), c.CF, c.OF) == (150, 0, 1) and signed(150, 1) == -106
    c.mov("al", -100 & 0xFF); c.add("al", -100 & 0xFF); assert (c.get("al"), c.CF, c.OF) == (56, 1, 1)
    c.mov("al", 0xFF); c.inc("al"); assert c.get("al") == 0 and c.ZF == 1
    # 소프트웨어 프로젝트 「연산자와 오버플로」의 카드: byte 127 + 1, 그리고 FFh + 1
    c = CPU(); c.mov("al", 0x7F); c.add("al", 1); assert (signed(c.get("al"), 1), c.CF, c.OF) == (-128, 0, 1)
    c.mov("al", 0xFF); c.add("al", 1); assert (c.get("al"), c.CF, c.OF) == (0, 1, 0)
    print("ALL CHECKS PASSED")
```
{% endraw %}
