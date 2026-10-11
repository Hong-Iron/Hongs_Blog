---
layout: "note"
title: "44_local-variables_verify.py"
display_title: "44_local-variables_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/local-variables/"
parent_title: "지역 변수"
description: "어셈블리어 · 지역 변수 검증 코드"
permalink: "/studies/assembly-language/code/44_local-variables_verify/"
---
{% raw %}
[지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""지역 변수 검증. 실행: python3 44_local-variables_verify.py
MASM이 없어 x86 32비트 명령 일부(레지스터, 리틀 엔디언 메모리, PUSH/POP/CALL/RET,
ENTER/LEAVE, ZF/CF)를 파이썬으로 흉내 낸다. 문서에 실린 코드를 글자 그대로 넣어 돌린다.
스택은 ESP = 00001000h에서 시작하고, 명령 주소는 가짜 값(00401000h + 4 × 순번)이다.
슬라이드 wk11-2-1 p.7(x = 10, y = 20), p.10~11(ENTER·LEAVE), p.14, p.16의 내용을 확인한다."""
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


# wk11-2-1 p.7: 지역 변수 x = 10, y = 20
MYSUB = """
main PROC
    call MySub
    hlt
main ENDP
MySub PROC
    push ebp
    mov  ebp,esp
    sub  esp,8
    mov  DWORD PTR [ebp-4],10
    mov  DWORD PTR [ebp-8],20
    mov  eax,[ebp-4]
    add  eax,[ebp-8]
    mov  esp,ebp
    pop  ebp
    ret
MySub ENDP
"""
# p.10~11: ENTER 8,0 / LEAVE로 바꾼 것
ENTER_LEAVE = """
main PROC
    call MySub
    hlt
main ENDP
MySub PROC
    enter 8,0
    mov  DWORD PTR [ebp-4],10
    mov  DWORD PTR [ebp-8],20
    mov  eax,[ebp-4]
    add  eax,[ebp-8]
    leave
    ret
MySub ENDP
"""
# p.14: LOCAL이 만드는 코드. add esp,0FFFFFFF8h
LOCAL_GEN = MYSUB.replace("sub  esp,8", "add  esp,0FFFFFFF8h")
# 초기화하지 않은 지역 변수: 앞 호출이 남긴 값이 그대로 보인다
GARBAGE = """
main PROC
    call First
    call Second
    hlt
main ENDP
First PROC
    push ebp
    mov  ebp,esp
    sub  esp,4
    mov  DWORD PTR [ebp-4],1234h
    mov  esp,ebp
    pop  ebp
    ret
First ENDP
Second PROC
    push ebp
    mov  ebp,esp
    sub  esp,4
    mov  eax,[ebp-4]
    mov  esp,ebp
    pop  ebp
    ret
Second ENDP
"""
# mov esp,ebp를 빠뜨리면 pop ebp가 지역 변수 y(20)를 EBP에 넣는다
NO_FREE = MYSUB.replace("    mov  esp,ebp\n", "")
# p.16: 바이트 지역 변수 하나. 4바이트를 잡고 var1은 [EBP-1]
BYTE_LOCAL = """
main PROC
    call Example1
    hlt
main ENDP
Example1 PROC
    push ebp
    mov  ebp,esp
    add  esp,0FFFFFFFCh
    mov  BYTE PTR [ebp-1],7Fh
    mov  al,BYTE PTR [ebp-1]
    mov  esp,ebp
    pop  ebp
    ret
Example1 ENDP
"""

if __name__ == "__main__":
    c = CPU(MYSUB)
    c.r["ebp"] = 0x1010
    c.run("main")
    t = [(raw, r["esp"], r["ebp"]) for raw, r, _, _ in c.trace]
    assert t[0] == ("call MySub", 0x0FFC, 0x1010)
    assert t[1] == ("push ebp", 0x0FF8, 0x1010)
    assert t[2] == ("mov  ebp,esp", 0x0FF8, 0x0FF8)
    assert t[3] == ("sub  esp,8", 0x0FF0, 0x0FF8)
    assert t[8] == ("mov  esp,ebp", 0x0FF8, 0x0FF8)
    assert t[9] == ("pop  ebp", 0x0FFC, 0x1010)
    assert t[10] == ("ret", 0x1000, 0x1010)
    # 스택 그림 (p.7): [ebp-4] = 10, [ebp-8] = 20, [ebp] = 옛 EBP, [ebp+4] = 복귀 주소
    assert c.rd(0x0FF4) == 10 and c.rd(0x0FF0) == 20
    assert c.rd(0x0FF8) == 0x1010 and c.rd(0x0FFC) == c.addr_of(1)
    assert c.r["eax"] == 30

    # LEA는 주소를, MOV는 값을 넣는다: lea esi,[ebp-8] → 0FF0h, mov eax,[ebp-8] → 20
    q = CPU(MYSUB.replace("    mov  eax,[ebp-4]\n    add  eax,[ebp-8]\n", "    lea  esi,[ebp-8]\n    mov  eax,[ebp-8]\n"))
    q.r["ebp"] = 0x1010
    q.run("main")
    assert q.r["esi"] == 0x0FF0 and q.r["eax"] == 20
    # 카드 C2: sub esp,12 뒤 EBP = 0FF8h, ESP = 0FECh
    w = CPU(MYSUB.replace("sub  esp,8", "sub  esp,12"))
    w.r["ebp"] = 0x1010
    w.eip = w.labels["main"]
    for _ in range(4):
        w.step()
    assert (w.r["esp"], w.r["ebp"]) == (0x0FEC, 0x0FF8)

    # ENTER 8,0 = push ebp / mov ebp,esp / sub esp,8,  LEAVE = mov esp,ebp / pop ebp
    e = CPU(ENTER_LEAVE)
    e.r["ebp"] = 0x1010
    e.run("main")
    te = {raw: (r["esp"], r["ebp"]) for raw, r, _, _ in e.trace}
    assert te["enter 8,0"] == (0x0FF0, 0x0FF8) == (t[3][1], t[3][2])
    assert te["leave"] == (0x0FFC, 0x1010) == (t[9][1], t[9][2])
    assert (e.r["eax"], e.r["esp"], e.r["ebp"]) == (c.r["eax"], c.r["esp"], c.r["ebp"])
    assert e.mem == c.mem

    # add esp,0FFFFFFF8h 는 sub esp,8 과 같다 (32비트에서 -8)
    assert 0xFFFFFFF8 == (-8) & 0xFFFFFFFF
    g = CPU(LOCAL_GEN)
    g.r["ebp"] = 0x1010
    g.run("main")
    assert [(r["esp"], r["ebp"]) for _, r, _, _ in g.trace] == [(x[1], x[2]) for x in t]
    for esp in (0x1000, 8, 0x12FF00, 0xFFFFFFFF):
        assert (esp + 0xFFFFFFF8) & 0xFFFFFFFF == (esp - 8) & 0xFFFFFFFF

    # 초기화 안 한 지역 변수에는 앞 호출의 값 1234h가 남아 있다
    z = CPU(GARBAGE).run("main")
    assert z.r["eax"] == 0x1234 and z.r["esp"] == 0x1000

    # mov esp,ebp를 빼면: pop ebp가 y(20)를 꺼내고 ret은 x(10)를 복귀 주소로 꺼낸다
    b = CPU(NO_FREE)
    b.r["ebp"] = 0x1010
    b.eip = b.labels["main"]
    for _ in range(9):
        b.step()
    assert b.prog[b.eip][0] == "ret" and b.r["ebp"] == 20 and b.rd(b.r["esp"]) == 10

    # 바이트 지역 변수: ESP는 4 내려가고 var1은 EBP-1 한 칸
    y = CPU(BYTE_LOCAL)
    y.r["ebp"] = 0x1010
    y.run("main")
    ty = {raw: (r["esp"], r["ebp"]) for raw, r, _, _ in y.trace}
    assert ty["add  esp,0FFFFFFFCh"] == (0x0FF4, 0x0FF8)
    assert y.mem[0x0FF7] == 0x7F and y.r["eax"] & 0xFF == 0x7F
    # LOCAL temp:DWORD, SwapFlag:BYTE → 4 + 1 = 5바이트를 4의 배수로 올려 8
    assert -(-(4 + 1) // 4) * 4 == 8
    # 카드: 지역 변수 DWORD 3개면 sub esp,12, 셋째는 [ebp-12]
    assert 3 * 4 == 12
    print("ALL CHECKS PASSED")
```
{% endraw %}
