---
layout: "note"
title: "41_stack-frame_verify.py"
display_title: "41_stack-frame_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/stack-frame/"
parent_title: "스택 프레임"
description: "어셈블리어 · 스택 프레임 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/41_stack-frame_verify/"
---
{% raw %}
[스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스택 프레임 검증. 실행: python3 41_stack-frame_verify.py
MASM이 없어 x86 32비트 명령 일부(레지스터, 리틀 엔디언 메모리, PUSH/POP/CALL/RET,
ENTER/LEAVE, ZF/CF)를 파이썬으로 흉내 낸다. 문서에 실린 코드를 글자 그대로 넣어 돌린다.
스택은 ESP = 00001000h에서 시작하고, 명령 주소는 가짜 값(00401000h + 4 × 순번)이다.
AddTwo 호출의 명령별 ESP·EBP, 프레임의 주소별 내용, 정리를 빠뜨린 고장 두 가지를 확인한다."""
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


def show(cpu):
    for raw, r, zf, cf in cpu.trace:
        print(f"{raw:32s} ESP={r['esp']:08X} EBP={r['ebp']:08X} EAX={r['eax']:08X}")


ADDTWO = """
main PROC
    push 6
    push 5
    call AddTwo
    hlt
main ENDP
AddTwo PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+12]
    add  eax,[ebp+8]
    pop  ebp
    ret  8
AddTwo ENDP
"""

# 레지스터를 지키는 틀
MYSUB = """
main PROC
    push 7
    call MySub
    hlt
main ENDP
MySub PROC
    push ebp
    mov  ebp,esp
    push ecx
    push edx
    mov  ecx,[ebp+8]
    mov  edx,ecx
    add  edx,ecx
    mov  eax,edx
    pop  edx
    pop  ecx
    pop  ebp
    ret  4
MySub ENDP
"""

# 고장 1: pop ebp를 빠뜨린다 → RET이 저장해 둔 EBP 값을 복귀 주소로 꺼낸다
NO_POP = ADDTWO.replace("    pop  ebp\n", "")
# 고장 2: 프로시저 안에서 push 하나를 pop 없이 남긴다
EXTRA_PUSH = ADDTWO.replace("    pop  ebp\n", "    push eax\n    pop  ebp\n")

if __name__ == "__main__":
    c = CPU(ADDTWO)
    c.r["ebp"] = 0x00001010          # main이 쓰던 EBP (아무 값)
    seen_ebp = []

    def watch(cpu):
        raw = cpu.trace[-1][0]
        if raw.startswith(("mov  eax", "add  eax")):
            seen_ebp.append(cpu.r["ebp"])

    c.run("main", watch=watch)
    t = [(raw, r["esp"], r["ebp"], r["eax"]) for raw, r, _, _ in c.trace]
    # 명령별 추적 표 (문서의 표와 같은 값)
    assert t[0][:2] == ("push 6", 0x0FFC)
    assert t[1][:2] == ("push 5", 0x0FF8)
    assert t[2][:2] == ("call AddTwo", 0x0FF4)
    assert t[3][:3] == ("push ebp", 0x0FF0, 0x1010)
    assert t[4][:3] == ("mov  ebp,esp", 0x0FF0, 0x0FF0)
    assert t[5] == ("mov  eax,[ebp+12]", 0x0FF0, 0x0FF0, 6)
    assert t[6] == ("add  eax,[ebp+8]", 0x0FF0, 0x0FF0, 11)
    assert t[7][:3] == ("pop  ebp", 0x0FF4, 0x1010)
    assert t[8][:3] == ("ret  8", 0x1000, 0x1010)
    # 스택 그림: 주소마다 든 값
    ret_addr = c.addr_of(3)                     # call 다음 명령(hlt)의 주소
    assert c.rd(0x0FFC) == 6 and c.rd(0x0FF8) == 5
    assert c.rd(0x0FF4) == ret_addr and c.rd(0x0FF0) == 0x1010
    # 불변식 1: 몸통에서 EBP는 그대로다
    assert seen_ebp == [0x0FF0, 0x0FF0]
    # 불변식 2: 돌아온 뒤 ESP와 EBP는 인수를 넣기 전 값이다
    assert c.r["esp"] == 0x1000 and c.r["ebp"] == 0x1010 and c.r["eax"] == 11
    # EBP 기준 자리: [EBP] 옛 EBP, [EBP+4] 복귀 주소, [EBP+8] 첫 매개변수
    base = 0x0FF0
    assert [c.rd(base + k) for k in (0, 4, 8, 12)] == [0x1010, ret_addr, 5, 6]

    # 레지스터 저장: ECX, EDX가 호출 전 값으로 돌아온다
    m = CPU(MYSUB)
    m.r.update(ebp=0x1010, ecx=0xAAAA, edx=0xBBBB)
    m.run("main")
    assert (m.r["eax"], m.r["ecx"], m.r["edx"]) == (14, 0xAAAA, 0xBBBB)
    assert m.r["esp"] == 0x1000 and m.r["ebp"] == 0x1010
    tm = {raw: r for raw, r, _, _ in m.trace}
    assert tm["push edx"]["esp"] == 0x0FEC       # 프레임 맨 아래
    assert m.rd(0x0FF0) == 0xAAAA and m.rd(0x0FEC) == 0xBBBB   # [EBP-4], [EBP-8]
    assert tm["push edx"]["ebp"] == 0x0FF4
    # ESP는 push 두 번으로 8 내려갔지만 [ebp+8]은 여전히 매개변수 7이다
    assert tm["mov  ecx,[ebp+8]"]["ecx"] == 7

    # 고장 1: pop ebp를 빼면 RET이 옛 EBP 값(1010h)을 주소로 알고 뛴다
    b = CPU(NO_POP)
    b.r["ebp"] = 0x1010
    b.eip = b.labels["main"]
    for _ in range(7):
        b.step()
    assert b.prog[b.eip][0] == "ret"
    assert b.rd(b.r["esp"]) == 0x1010 != b.addr_of(3)
    # 고장 2: 남은 push 때문에 pop ebp가 EAX 값(11)을 EBP에 넣고, RET은 옛 EBP로 뛴다
    e = CPU(EXTRA_PUSH)
    e.r["ebp"] = 0x1010
    e.eip = e.labels["main"]
    for _ in range(9):
        e.step()
    assert e.prog[e.eip][0] == "ret" and e.r["ebp"] == 11 and e.rd(e.r["esp"]) == 0x1010

    # 카드 C3: push 10, push 20, push 30, call 뒤 프레임을 세운 상태에서 [ebp+16]
    k = CPU("""
main PROC
    push 10
    push 20
    push 30
    call F
    hlt
main ENDP
F PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+16]
    mov  ebx,[ebp+8]
    pop  ebp
    ret  12
F ENDP
""")
    k.run("main")
    assert (k.r["eax"], k.r["ebx"], k.r["esp"]) == (10, 30, 0x1000)
    if __import__("sys").argv[1:] == ["-v"]:
        show(c); show(m)
    print("ALL CHECKS PASSED")
```
{% endraw %}
