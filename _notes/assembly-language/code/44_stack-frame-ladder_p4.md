---
layout: "note"
title: "44_stack-frame-ladder_p4.py"
display_title: "44_stack-frame-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "44"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/stack-frame-ladder/"
parent_title: "스택 프레임 그리기 예제 사다리"
description: "어셈블리어 · 스택 프레임 그리기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/assembly-language/code/44_stack-frame-ladder_p4/"
---
{% raw %}
[스택 프레임 그리기 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-frame-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스택 프레임 그리기 예제 사다리의 답 확인. 실행: python3 44_stack-frame-ladder_p4.py
MASM이 없어 x86 32비트 명령 일부를 파이썬으로 흉내 낸다. 문서의 코드를 글자 그대로 넣어 돌린다.
문제 1~4의 명령별 ESP·EBP와 프레임의 주소별 값을 단언한다. 명령 주소는 가짜 값(00401000h + 4 × 순번)이다."""
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


P1 = """
main PROC
    push 9
    push 4
    call Sub2
    hlt
main ENDP
Sub2 PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+12]
    sub  eax,[ebp+8]
    pop  ebp
    ret  8
Sub2 ENDP
"""
P2 = """
main PROC
    push 7
    call P
    hlt
main ENDP
P PROC
    push ebp
    mov  ebp,esp
    sub  esp,8
    mov  DWORD PTR [ebp-4],1
    mov  eax,[ebp+8]
    mov  [ebp-8],eax
    add  eax,[ebp-4]
    mov  esp,ebp
    pop  ebp
    ret  4
P ENDP
"""
P3 = """
main PROC
    push 30
    push 20
    push 10
    call R
    hlt
main ENDP
R PROC
    push ebp
    mov  ebp,esp
    sub  esp,4
    push esi
    push edi
    mov  esi,[ebp+8]
    mov  edi,[ebp+16]
    mov  [ebp-4],esi
    add  [ebp-4],edi
    mov  eax,[ebp-4]
    pop  edi
    pop  esi
    mov  esp,ebp
    pop  ebp
    ret  12
R ENDP
"""
P4 = """
main PROC
    push 2
    push 8
    call Q
    add  esp,8
    hlt
main ENDP
Q PROC
    enter 4,0
    mov  eax,[ebp+8]
    add  eax,[ebp+12]
    mov  [ebp-4],eax
    add  eax,[ebp-4]
    leave
    ret
Q ENDP
"""


def run(src, esp, ebp, **regs):
    c = CPU(src, esp=esp)
    c.r["ebp"] = ebp
    c.r.update(regs)
    c.run("main")
    return c, [(raw, r["esp"], r["ebp"], r["eax"]) for raw, r, _, _ in c.trace]


if __name__ == "__main__":
    # 문제 1
    c, t = run(P1, 0x1000, 0x1010)
    assert [x[1] for x in t[:9]] == [0xFFC, 0xFF8, 0xFF4, 0xFF0, 0xFF0, 0xFF0, 0xFF0, 0xFF4, 0x1000]
    assert t[4][2] == 0xFF0 and c.r["eax"] == 5 and c.r["ebp"] == 0x1010
    assert [c.rd(a) for a in (0xFFC, 0xFF8, 0xFF4, 0xFF0)] == [9, 4, c.addr_of(3), 0x1010]
    # 문제 2
    c, t = run(P2, 0x1000, 0x1010)
    d = {x[0]: x for x in t}
    assert d["sub  esp,8"][1:3] == (0xFEC, 0xFF4)
    assert [c.rd(a) for a in (0xFFC, 0xFF8, 0xFF4, 0xFF0, 0xFEC)] == [7, c.addr_of(2), 0x1010, 1, 7]
    assert d["mov  esp,ebp"][1] == 0xFF4 and d["pop  ebp"][1:3] == (0xFF8, 0x1010) and d["ret  4"][1] == 0x1000
    assert c.r["eax"] == 8
    # 문제 3
    c, t = run(P3, 0x2000, 0x2020, esi=0x5555, edi=0x6666)
    d = {x[0]: x for x in t}
    assert d["call R"][1] == 0x1FF0 and d["mov  ebp,esp"][2] == 0x1FEC
    assert d["sub  esp,4"][1] == 0x1FE8 and d["push edi"][1] == 0x1FE0
    words = [c.rd(a) for a in range(0x1FFC, 0x1FDC, -4)]
    assert words == [30, 20, 10, c.addr_of(4), 0x2020, 40, 0x5555, 0x6666]
    assert d["pop  edi"][1] == 0x1FE4 and d["pop  esi"][1] == 0x1FE8
    assert d["mov  esp,ebp"][1] == 0x1FEC and d["pop  ebp"][1] == 0x1FF0 and d["ret  12"][1] == 0x2000
    assert (c.r["eax"], c.r["esi"], c.r["edi"], c.r["ebp"]) == (40, 0x5555, 0x6666, 0x2020)
    # 문제 4
    c, t = run(P4, 0x0012FF80, 0x0012FF94)
    d = {x[0]: x for x in t}
    assert d["call Q"][1] == 0x12FF74
    assert d["enter 4,0"][1:3] == (0x12FF6C, 0x12FF70)
    assert [c.rd(a) for a in (0x12FF7C, 0x12FF78, 0x12FF74, 0x12FF70, 0x12FF6C)] == \
        [2, 8, c.addr_of(3), 0x12FF94, 10]
    assert d["leave"][1:3] == (0x12FF74, 0x12FF94)
    assert d["ret"][1] == 0x12FF78 and d["add  esp,8"][1] == 0x12FF80
    assert c.r["eax"] == 20
    print("ALL CHECKS PASSED")
```
{% endraw %}
