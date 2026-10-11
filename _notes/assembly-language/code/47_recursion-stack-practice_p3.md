---
layout: "note"
title: "47_recursion-stack-practice_p3.py"
display_title: "47_recursion-stack-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "47"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/recursion-stack-practice/"
parent_title: "재귀 호출 스택 추적 연습"
description: "어셈블리어 · 재귀 호출 스택 추적 연습 문제 3 풀이 코드"
permalink: "/studies/assembly-language/code/47_recursion-stack-practice_p3/"
---
{% raw %}
[재귀 호출 스택 추적 연습](/Hongs_Blog/studies/assembly-language/recursion-stack-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""재귀 호출 스택 추적 연습의 답 확인. 실행: python3 47_recursion-stack-practice_p3.py
MASM이 없어 x86 32비트 명령 일부를 파이썬으로 흉내 낸다. 문서의 코드를 글자 그대로 넣어 돌린다.
문제 1~4의 표, 스택 주소, 고장 난 코드의 동작을 단언한다. 명령 주소는 가짜 값(00401000h + 4 × 순번)이다."""
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


CALCSUM = """
main PROC
    mov  ecx,3
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
    {ret}
Factorial ENDP
"""
# 문제 4의 답: 1부터 n까지의 합을 스택 매개변수로 받는 재귀
SUMTO = """
main PROC
    push {n}
    call SumTo
ReturnMain: hlt
main ENDP
SumTo PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+8]
    cmp  eax,0
    je   L2
    dec  eax
    push eax
    call SumTo
    add  eax,[ebp+8]
L2: pop  ebp
    ret  4
SumTo ENDP
"""


def deepest(c, start="main"):
    low, snap = [c.r["esp"]], {}

    def watch(cpu):
        if cpu.r["esp"] < low[0]:
            low[0] = cpu.r["esp"]
            snap.clear()
            snap.update(cpu.mem)

    c.run(start, watch=watch)
    return low[0], snap


def rd(mem, a):
    return sum(mem.get(a + i, 0) << (8 * i) for i in range(4))


if __name__ == "__main__":
    # 문제 1: CalcSum, ECX = 3
    c = CPU(CALCSUM)
    rows = []

    def w(cpu):
        if cpu.trace[-1][0].startswith("call"):
            rows.append((cpu.r["ecx"], cpu.r["eax"], cpu.r["esp"]))

    c.run("main", watch=w)
    assert rows == [(3, 0, 0xFFC), (2, 3, 0xFF8), (1, 5, 0xFF4), (0, 6, 0xFF0)]
    assert (c.r["eax"], c.r["ecx"], c.r["esp"]) == (6, 0, 0x1000)
    assert sum(1 for raw, _, _, _ in c.trace if raw.endswith("ret")) == 4

    # 문제 2: Factorial(4)
    f = CPU(FACT.format(n=4, ret="ret  4"))
    f.r["ebp"] = 0x1010
    low, snap = deepest(f)
    assert f.r["eax"] == 24 and low == 0x1000 - 60 == 0xFC4
    n_addr = [0xFFC - 12 * k for k in range(5)]
    assert n_addr == [0xFFC, 0xFF0, 0xFE4, 0xFD8, 0xFCC]
    assert [rd(snap, a) for a in n_addr] == [4, 3, 2, 1, 0]
    ebp_addr = [a - 8 for a in n_addr]
    assert ebp_addr == [0xFF4, 0xFE8, 0xFDC, 0xFD0, 0xFC4]
    assert [rd(snap, a) for a in ebp_addr] == [0x1010, 0xFF4, 0xFE8, 0xFDC, 0xFD0]
    assert [r["eax"] for raw, r, _, _ in f.trace if raw.startswith("mul")] == [1, 2, 6, 24]

    # 문제 3: ret 4를 ret으로 바꾸면 (n = 1)
    b = CPU(FACT.format(n=1, ret="ret"))
    b.r["ebp"] = 0x1010
    b.eip = b.labels["main"]
    steps = []
    while True:
        op = b.prog[b.eip][0]
        if op == "ret" and len([s for s in steps if s == "ret"]) == 1:
            break                       # 바깥 호출의 ret 직전에서 멈춘다
        b.step()
        steps.append(op)
    # 안쪽 호출이 돌아온 뒤 인수 0이 남아, 바깥의 pop ebp가 그 0을 EBP에 넣었다
    assert b.r["ebp"] == 0 and b.r["esp"] == 0xFF4
    # ret이 꺼낼 값은 복귀 주소가 아니라 main의 EBP 값이다
    assert b.rd(b.r["esp"]) == 0x1010
    assert b.r["eax"] == 1               # 곱셈까지는 맞게 했다

    # 문제 4: SumTo
    for n in range(0, 40):
        s = CPU(SUMTO.format(n=n))
        s.r["ebp"] = 0x1010
        low, _ = deepest(s)
        assert s.r["eax"] == n * (n + 1) // 2
        assert (s.r["esp"], s.r["ebp"]) == (0x1000, 0x1010)
        assert 0x1000 - low == 12 * (n + 1)
    s = CPU(SUMTO.format(n=3))
    s.run("main")
    assert [r["eax"] for raw, r, _, _ in s.trace if raw.startswith("add  eax")] == [1, 3, 6]
    print("ALL CHECKS PASSED")
```
{% endraw %}
