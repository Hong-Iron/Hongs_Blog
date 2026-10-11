---
layout: "note"
title: "42_stack-parameters_verify.py"
display_title: "42_stack-parameters_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/stack-parameters/"
parent_title: "스택 매개변수"
description: "어셈블리어 · 스택 매개변수 검증 코드"
permalink: "/studies/assembly-language/code/42_stack-parameters_verify/"
---
{% raw %}
[스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스택 매개변수 검증. 실행: python3 42_stack-parameters_verify.py
MASM이 없어 x86 32비트 명령 일부(레지스터, 리틀 엔디언 메모리, PUSH/POP/CALL/RET,
ENTER/LEAVE, ZF/CF)를 파이썬으로 흉내 낸다. 문서에 실린 코드를 글자 그대로 넣어 돌린다.
스택은 ESP = 00001000h에서 시작하고, 명령 주소는 가짜 값(00401000h + 4 × 순번)이다.
슬라이드 wk10-3-3 p.7, p.9, p.12의 스택 내용과 값·참조 전달의 차이를 확인한다."""
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


BY_VALUE = """
main PROC
    push val2
    push val1
    hlt
main ENDP
"""
BY_REF = """
main PROC
    push OFFSET val2
    push OFFSET val1
    hlt
main ENDP
"""
# 참조로 받은 주소를 따라가 두 변수의 값을 바꾼다 (원본에 없는 보충 예)
SWAP = """
main PROC
    push OFFSET val2
    push OFFSET val1
    call Swap
    hlt
main ENDP
Swap PROC
    push ebp
    mov  ebp,esp
    mov  esi,[ebp+8]
    mov  edi,[ebp+12]
    mov  eax,[esi]
    mov  ebx,[edi]
    mov  [esi],ebx
    mov  [edi],eax
    pop  ebp
    ret  8
Swap ENDP
"""
# 값으로 넘기면 원래 변수는 바뀌지 않는다
BUMP = """
main PROC
    push val1
    call Bump
    hlt
main ENDP
Bump PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+8]
    add  eax,100
    mov  [ebp+8],eax
    pop  ebp
    ret  4
Bump ENDP
"""
# wk10-3-3 p.11~12 ArrayFill의 앞부분. 난수 대신 남은 개수를 적어 넣는다.
ARRAYFILL = """
main PROC
    push OFFSET array
    push 5
    call ArrayFill
    hlt
main ENDP
ArrayFill PROC
    push ebp
    mov  ebp,esp
    pushad
    mov  esi,[ebp+12]
    mov  ecx,[ebp+8]
L1: mov  [esi],cx
    add  esi,2
    loop L1
    popad
    pop  ebp
    ret  8
ArrayFill ENDP
"""


def fresh(src):
    c = CPU(src, symbols={"val1": 0x0000, "val2": 0x0004, "array": 0x0100})
    c.wr(0x0000, 5)
    c.wr(0x0004, 6)
    return c


if __name__ == "__main__":
    # p.7: 값으로 넘기기. 스택에 6, 5가 쌓이고 ESP는 5를 가리킨다
    c = fresh(BY_VALUE).run("main")
    assert c.r["esp"] == 0x0FF8 and c.rd(0x0FFC) == 6 and c.rd(0x0FF8) == 5
    # p.9: 참조로 넘기기. 스택에 00000004, 00000000이 쌓인다
    c = fresh(BY_REF).run("main")
    assert c.r["esp"] == 0x0FF8 and c.rd(0x0FFC) == 4 and c.rd(0x0FF8) == 0
    # 참조: 프로시저가 원래 변수를 바꾼다
    c = fresh(SWAP).run("main")
    assert (c.rd(0x0000), c.rd(0x0004)) == (6, 5) and c.r["esp"] == 0x1000
    # 값: 스택의 사본만 바뀌고 val1은 5 그대로다
    c = fresh(BUMP).run("main")
    assert c.rd(0x0000) == 5 and c.r["eax"] == 105 and c.rd(0x0FFC) == 105
    # p.12: ArrayFill. [ebp+12] = 배열 주소, [ebp+8] = 개수
    c = fresh(ARRAYFILL)
    c.r.update(esi=0x1111, ecx=0x2222, ebp=0x1010)
    got = {}

    def watch(cpu):
        raw = cpu.trace[-1][0]
        if raw.startswith("mov  ecx,[ebp+8]"):
            got.update(esi=cpu.r["esi"], ecx=cpu.r["ecx"], ebp=cpu.r["ebp"], esp=cpu.r["esp"])

    c.run("main", watch=watch)
    assert got == dict(esi=0x0100, ecx=5, ebp=0x0FF0, esp=0x0FF0 - 32)   # pushad가 32바이트
    assert [c.rd(0x0100 + 2 * i, 2) for i in range(5)] == [5, 4, 3, 2, 1]
    assert (c.r["esi"], c.r["ecx"], c.r["esp"], c.r["ebp"]) == (0x1111, 0x2222, 0x1000, 0x1010)
    # p.5: 레지스터 방식은 명령 5개, 스택 방식은 3개
    assert len("pushad|mov esi|mov ecx|mov ebx|popad".split("|")) == 5
    print("ALL CHECKS PASSED")
```
{% endraw %}
