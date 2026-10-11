---
layout: "note"
title: "47_recursive-procedure_impl.py"
display_title: "47_recursive-procedure_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "47"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/recursive-procedure/"
parent_title: "재귀 프로시저"
description: "어셈블리어 · 재귀 프로시저 구현 코드"
permalink: "/studies/assembly-language/code/47_recursive-procedure_impl/"
---
{% raw %}
[재귀 프로시저](/Hongs_Blog/studies/assembly-language/recursive-procedure/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""재귀 프로시저 검증. 실행: python3 47_recursive-procedure_impl.py
MASM이 없어 x86 32비트 명령 일부(레지스터, 리틀 엔디언 메모리, PUSH/POP/CALL/RET,
ENTER/LEAVE, ZF/CF)를 파이썬으로 흉내 낸다. 문서에 실린 코드를 글자 그대로 넣어 돌린다.
스택은 ESP = 00001000h에서 시작하고, 명령 주소는 가짜 값(00401000h + 4 × 순번)이다.
슬라이드 wk11-2-2 p.4의 CalcSum 표, p.5~7의 Factorial 값과 스택 그림을 그대로 재현한다."""
import math
import re

M32 = 0xFFFFFFFF
REG32 = ["eax", "ecx", "edx", "ebx", "esp", "ebp", "esi", "edi"]
REG8 = {"al": ("eax", 0), "ah": ("eax", 8), "bl": ("ebx", 0), "bh": ("ebx", 8),
        "cl": ("ecx", 0), "ch": ("ecx", 8), "dl": ("edx", 0), "dh": ("edx", 8)}
REG16 = {"ax": "eax", "bx": "ebx", "cx": "ecx", "dx": "edx", "si": "esi", "di": "edi"}


class CPU:
    """x86 32비트 명령 일부만 흉내 낸다. 문서에 실린 코드를 글자 그대로 받아 돌린다."""

    CODE_BASE = 0x00401000   # 명령 i번의 주소를 CODE_BASE + 4*i 로 친다(가짜 주소)

    def __init__(self, source, esp=0x00001000, symbols=None):
        self.r = {k: 0 for k in REG32}
        self.r["esp"] = esp
        self.mem = {}                 # 주소 -> 바이트
        self.zf = self.cf = self.sf = 0
        self.sym = dict(symbols or {})  # 변수 이름 -> 주소
        self.prog, self.labels = [], {}
        self.trace = []
        self.halted = False
        for raw in source.strip().splitlines():
            line = raw.split(";")[0].strip()
            if not line:
                continue
            m = re.match(r"^(\w+)\s+(PROC|ENDP)\b.*$", line)
            if m:
                if m.group(2) == "PROC":
                    self.labels[m.group(1)] = len(self.prog)
                continue
            m = re.match(r"^(\w+):\s*(.*)$", line)
            if m:
                self.labels[m.group(1)] = len(self.prog)
                line = m.group(2).strip()
                if not line:
                    continue
            parts = line.split(None, 1)
            op = parts[0].lower()
            args = [a.strip() for a in parts[1].split(",")] if len(parts) > 1 else []
            self.prog.append((op, args, raw.strip()))
        self.eip = 0

    # ---- 메모리 (리틀 엔디언) ----
    def rd(self, addr, size=4):
        return sum(self.mem.get((addr + i) & M32, 0) << (8 * i) for i in range(size))

    def wr(self, addr, val, size=4):
        for i in range(size):
            self.mem[(addr + i) & M32] = (val >> (8 * i)) & 0xFF

    def addr_of(self, i):
        return self.CODE_BASE + 4 * i

    # ---- 피연산자 ----
    def _ea(self, expr):
        """[ebp+8], [ebp-4], [esi] 꼴의 주소를 계산한다."""
        inner = expr.strip()[1:-1].replace(" ", "")
        m = re.match(r"^(\w+)(?:([+-])(\w+))?$", inner)
        base = self.r[m.group(1).lower()]
        if m.group(2):
            d = self._imm(m.group(3))
            base = base + d if m.group(2) == "+" else base - d
        return base & M32

    @staticmethod
    def _imm(tok):
        t = tok.strip().lower()
        if t.endswith("h"):
            return int(t[:-1], 16)
        if t.endswith("b") and set(t[:-1]) <= {"0", "1"}:
            return int(t[:-1], 2)
        return int(t)

    def _parse(self, a):
        """(종류, 값, 크기)를 돌려준다. 종류: reg, reg8, mem, imm."""
        size = 4
        m = re.match(r"^(DWORD|WORD|BYTE)\s+PTR\s+(.*)$", a, re.I)
        if m:
            size = {"DWORD": 4, "WORD": 2, "BYTE": 1}[m.group(1).upper()]
            a = m.group(2).strip()
        low = a.lower()
        if low in self.r:
            return ("reg", low, 4)
        if low in REG8:
            return ("reg8", low, 1)
        if low in REG16:
            return ("reg16", low, 2)
        if a.startswith("["):
            return ("mem", self._ea(a), size)
        if low.startswith("offset "):
            return ("imm", self.sym[a.split()[1]], 4)
        if a in self.sym:
            return ("mem", self.sym[a], size)
        return ("imm", self._imm(a) & M32, 4)

    def get(self, a, size_hint=None):
        kind, v, size = self._parse(a)
        if kind == "mem" and size_hint:
            size = size_hint
        if kind == "reg":
            return self.r[v]
        if kind == "reg16":
            return self.r[REG16[v]] & 0xFFFF
        if kind == "reg8":
            base, sh = REG8[v]
            return (self.r[base] >> sh) & 0xFF
        if kind == "mem":
            return self.rd(v, size)
        return v

    def put(self, a, val, size_hint=None):
        kind, v, size = self._parse(a)
        if kind == "mem" and size_hint:
            size = size_hint
        if kind == "reg":
            self.r[v] = val & M32
        elif kind == "reg16":
            self.r[REG16[v]] = (self.r[REG16[v]] & 0xFFFF0000) | (val & 0xFFFF)
        elif kind == "reg8":
            base, sh = REG8[v]
            self.r[base] = (self.r[base] & ~(0xFF << sh) & M32) | ((val & 0xFF) << sh)
        elif kind == "mem":
            self.wr(v, val, size)
        else:
            raise ValueError("즉시값에는 쓸 수 없다: " + a)

    # ---- 스택 ----
    def push(self, val):
        self.r["esp"] = (self.r["esp"] - 4) & M32
        self.wr(self.r["esp"], val)

    def pop(self):
        v = self.rd(self.r["esp"])
        self.r["esp"] = (self.r["esp"] + 4) & M32
        return v

    def _flags(self, res, carry):
        self.zf = int(res & M32 == 0)
        self.sf = (res >> 31) & 1
        self.cf = int(carry)

    # ---- 한 명령 실행 ----
    def step(self):
        op, a, raw = self.prog[self.eip]
        nxt = self.eip + 1
        if op == "mov":
            # 한쪽이 8·16비트 레지스터면 메모리 피연산자도 그 크기로 읽고 쓴다
            hint = None
            for x in a:
                k = self._parse(x)
                if k[0] in ("reg8", "reg16"):
                    hint = k[2]
            self.put(a[0], self.get(a[1], hint), hint)
        elif op == "lea":
            self.put(a[0], self._ea(a[1]))
        elif op == "push":
            self.push(self.get(a[0]))
        elif op == "pop":
            self.put(a[0], self.pop())
        elif op in ("add", "sub", "cmp"):
            x, y = self.get(a[0]), self.get(a[1])
            res = x + y if op == "add" else x - y
            self._flags(res, res > M32 if op == "add" else x < y)
            if op != "cmp":
                self.put(a[0], res)
        elif op in ("inc", "dec"):
            res = self.get(a[0]) + (1 if op == "inc" else -1)
            cf = self.cf
            self._flags(res, cf)          # INC/DEC는 CF를 건드리지 않는다
            self.put(a[0], res)
        elif op == "mul":
            prod = self.r["eax"] * self.get(a[0])
            self.r["eax"], self.r["edx"] = prod & M32, (prod >> 32) & M32
            self.cf = int(self.r["edx"] != 0)
        elif op == "jmp":
            nxt = self.labels[a[0]]
        elif op in ("jz", "je"):
            if self.zf:
                nxt = self.labels[a[0]]
        elif op in ("jnz", "jne"):
            if not self.zf:
                nxt = self.labels[a[0]]
        elif op == "ja":
            if not self.cf and not self.zf:
                nxt = self.labels[a[0]]
        elif op == "loop":
            self.r["ecx"] = (self.r["ecx"] - 1) & M32
            if self.r["ecx"]:
                nxt = self.labels[a[0]]
        elif op == "call":
            self.push(self.addr_of(nxt))
            nxt = self.labels[a[0]]
        elif op == "ret":
            target = self.pop()
            if a:
                self.r["esp"] = (self.r["esp"] + self._imm(a[0])) & M32
            nxt = (target - self.CODE_BASE) // 4
        elif op == "enter":
            self.push(self.r["ebp"])
            self.r["ebp"] = self.r["esp"]
            self.r["esp"] = (self.r["esp"] - self._imm(a[0])) & M32
        elif op == "leave":
            self.r["esp"] = self.r["ebp"]
            self.r["ebp"] = self.pop()
        elif op == "pushad":
            old = self.r["esp"]
            for k in REG32:
                self.push(old if k == "esp" else self.r[k])
        elif op == "popad":
            for k in reversed(REG32):
                v = self.pop()
                if k != "esp":
                    self.r[k] = v
        elif op == "hlt":
            self.halted = True
        else:
            raise ValueError("모르는 명령: " + raw)
        self.trace.append((raw, dict(self.r), self.zf, self.cf))
        self.eip = nxt

    def run(self, start, limit=100000, watch=None):
        self.eip = self.labels[start]
        n = 0
        while not self.halted:
            self.step()
            if watch:
                watch(self)
            n += 1
            assert n < limit, "끝나지 않는다"
        return self


# wk11-2-2 p.4: CalcSum. ECX = 개수, EAX = 합 (main이 EAX = 0, ECX = 5로 부른다)
CALCSUM = """
main PROC
    mov  ecx,5
    mov  eax,0
    call CalcSum
L1: hlt
main ENDP
CalcSum PROC
    cmp  ecx,0
    jz   L2
    add  eax,ecx
    dec  ecx
    call CalcSum
L2: ret
CalcSum ENDP
"""

# p.6: Factorial. 스택으로 n을 받고 EAX로 n!을 돌려준다
FACT = """
main PROC
    push {n}
    call Factorial
ReturnMain: hlt
main ENDP
Factorial PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+8]
    cmp  eax,0
    ja   L1
    mov  eax,1
    jmp  L2
L1: dec  eax
    push eax
    call Factorial
ReturnFact:
    mov  ebx,[ebp+8]
    mul  ebx
L2: pop  ebp
    ret  4
Factorial ENDP
"""


def run_fact(n, ebp0=0x1010):
    c = CPU(FACT.format(n=n))
    c.r["ebp"] = ebp0
    low = [c.r["esp"]]
    snap = {}

    def watch(cpu):
        if cpu.r["esp"] < low[0]:
            low[0] = cpu.r["esp"]
            snap.clear()
            snap.update(cpu.mem)

    c.run("main", watch=watch)
    return c, low[0], snap


def rd(mem, addr):
    return sum(mem.get(addr + i, 0) << (8 * i) for i in range(4))


if __name__ == "__main__":
    # ---- CalcSum: 슬라이드 p.4의 표 ----
    c = CPU(CALCSUM)
    rows = []

    def watch(cpu):
        raw = cpu.trace[-1][0]
        if raw.startswith("call"):
            ret = cpu.rd(cpu.r["esp"])
            name = "L1" if ret == cpu.addr_of(cpu.labels["L1"]) else "L2"
            assert name == "L1" or ret == cpu.addr_of(cpu.labels["L2"])
            rows.append((name, cpu.r["ecx"], cpu.r["eax"]))

    c.run("main", watch=watch)
    assert rows == [("L1", 5, 0), ("L2", 4, 5), ("L2", 3, 9), ("L2", 2, 12), ("L2", 1, 14), ("L2", 0, 15)]
    assert c.r["eax"] == 15 and c.r["ecx"] == 0 and c.r["esp"] == 0x1000
    # 복귀 주소 6개 = 24바이트. CalcSum은 프레임에 복귀 주소만 둔다
    assert min(r["esp"] for _, r, _, _ in c.trace) == 0x1000 - 6 * 4
    # 1부터 n까지의 합 n(n+1)/2 (배열을 읽지 않는다)
    for n in range(0, 60):
        k = CPU(CALCSUM.replace("mov  ecx,5", f"mov  ecx,{n}")).run("main")
        assert k.r["eax"] == n * (n + 1) // 2
        assert min(r["esp"] for _, r, _, _ in k.trace) == 0x1000 - (n + 1) * 4

    # ---- Factorial: p.5의 값 ----
    for n, want in [(0, 1), (1, 1), (2, 2), (3, 6), (4, 24), (5, 120)]:
        f, _, _ = run_fact(n)
        assert f.r["eax"] == want and f.r["esp"] == 0x1000 and f.r["ebp"] == 0x1010
    for n in range(0, 13):
        f, low, _ = run_fact(n)
        assert f.r["eax"] == math.factorial(n)
        # 호출 n+1번, 한 번에 12바이트 (n, 복귀 주소, 옛 EBP)
        assert 0x1000 - low == 12 * (n + 1)
    # 12! = 479001600 = 1C8CFC00h는 32비트에 들어간다
    f, low, snap = run_fact(12)
    assert f.r["eax"] == 479001600 == 0x1C8CFC00 and f.r["edx"] == 0
    # 13! = 6227020800은 32비트를 넘는다: EDX = 1, EAX = 7328CC00h (틀린 값)
    f13, _, _ = run_fact(13)
    assert math.factorial(13) > 2 ** 32
    assert f13.r["edx"] == 1 and f13.r["eax"] == math.factorial(13) % 2 ** 32 == 0x7328CC00 == 1932053504

    # ---- p.7의 그림: 12!을 부를 때 처음 네 프레임 ----
    ret_main = f.addr_of(f.labels["ReturnMain"])
    ret_fact = f.addr_of(f.labels["ReturnFact"])
    words = [rd(snap, a) for a in range(0x0FFC, 0x0FFC - 48, -4)]
    assert words[0:3] == [12, ret_main, 0x1010]          # n, ReturnMain, ebp0
    assert words[3:6] == [11, ret_fact, 0x0FF4]          # n-1, ReturnFact, ebp1
    assert words[6:9] == [10, ret_fact, 0x0FE8]          # n-2, ReturnFact, ebp2
    assert words[9:12] == [9, ret_fact, 0x0FDC]          # n-3, ReturnFact, ebp3
    # 저장된 EBP들은 한 줄로 이어진 사슬이다: 각 값이 바로 위 프레임의 EBP 자리를 가리킨다
    assert rd(snap, 0x0FE8) == 0x0FF4 and rd(snap, 0x0FF4) == 0x1010

    # ---- Factorial(3) 추적: 문서의 표 ----
    f3, low3, snap3 = run_fact(3)
    assert low3 == 0x1000 - 48
    frames = [[rd(snap3, a) for a in (b, b - 4, b - 8)] for b in (0x0FFC, 0x0FF0, 0x0FE4, 0x0FD8)]
    rm, rf = f3.addr_of(f3.labels["ReturnMain"]), f3.addr_of(f3.labels["ReturnFact"])
    assert frames == [[3, rm, 0x1010], [2, rf, 0x0FF4], [1, rf, 0x0FE8], [0, rf, 0x0FDC]]
    # 되돌아오며 곱하는 순서: mul 직후의 EAX가 1, 2, 6
    muls = [r["eax"] for raw, r, _, _ in f3.trace if raw.startswith("mul")]
    assert muls == [1, 2, 6]
    # 각 mul이 읽는 n ([ebp+8])은 1, 2, 3
    ns = [r["ebx"] for raw, r, _, _ in f3.trace if raw.startswith("mov  ebx")]
    assert ns == [1, 2, 3]

    # 실행하는 명령 수: main의 3개를 빼면 12n + 9
    for n in range(0, 13):
        assert len(run_fact(n)[0].trace) - 3 == 12 * n + 9
    # 카드 C2: Factorial(2)의 가장 깊은 스택 아홉 칸
    f2, low2, snap2 = run_fact(2)
    assert low2 == 0x0FDC
    assert [rd(snap2, a) for a in range(0x0FFC, 0x0FD8, -4)] == [2, rm, 0x1010, 1, rf, 0x0FF4, 0, rf, 0x0FE8]
    # CalcSum이 끝나면 ECX는 0이다 (레지스터 하나를 모든 호출이 함께 쓴다)
    assert c.r["ecx"] == 0

    # ---- 주석 "n < 0?"와 실제 동작 ----
    # ja는 부호 없는 "크다"이므로 n > 0일 때 L1로 간다. n = 0이면 1을 돌려준다.
    assert run_fact(0)[0].r["eax"] == 1
    # n = -1 (FFFFFFFFh)은 부호 없이 보면 아주 큰 수라 재귀로 들어간다 (바닥에 닿지 못한다)
    g = CPU(FACT.format(n="0FFFFFFFFh"))
    g.eip = g.labels["main"]
    for _ in range(7):
        g.step()
    assert g.prog[g.eip][0] == "dec"       # ja L1을 탔다

    # ---- 바닥 조건을 빼면 스택이 끝없이 자란다 ----
    bad = CPU(CALCSUM.replace("    jz   L2\n", ""))
    bad.eip = bad.labels["main"]
    for _ in range(3000):
        bad.step()
    assert 0x1000 - bad.r["esp"] > 2000

    # ---- 카드 ----
    # Factorial(5)가 쓰는 스택: 6번 × 12 = 72바이트
    assert 0x1000 - run_fact(5)[1] == 72
    # CalcSum에 ECX = 3: EAX = 6, 복귀 주소 4개
    k = CPU(CALCSUM.replace("mov  ecx,5", "mov  ecx,3")).run("main")
    assert k.r["eax"] == 6 and min(r["esp"] for _, r, _, _ in k.trace) == 0x1000 - 16
    if __import__("sys").argv[1:] == ["-v"]:
        for raw, r, zf, cf in f3.trace:
            print(f"{raw:24s} ESP={r['esp']:08X} EBP={r['ebp']:08X} EAX={r['eax']:08X} EBX={r['ebx']:08X}")
        print(hex(rm), hex(rf))
    print("ALL CHECKS PASSED")
```
{% endraw %}
