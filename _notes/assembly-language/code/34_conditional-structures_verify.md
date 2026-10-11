---
layout: "note"
title: "34_conditional-structures_verify.py"
display_title: "34_conditional-structures_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/conditional-structures/"
parent_title: "조건 구조를 점프로 옮기기"
description: "어셈블리어 · 조건 구조를 점프로 옮기기 검증 코드"
permalink: "/studies/assembly-language/code/34_conditional-structures_verify/"
---
{% raw %}
[조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""조건 구조를 점프로 옮기기 문서의 코드 확인 (파이썬 흉내, 실제 MASM 실행 아님).
슬라이드의 어셈블리 코드를 흉내기로 돌린 결과를, 같은 뜻의 파이썬 if/while 결과와 견준다.
실행: python3 34_conditional-structures_verify.py"""
import itertools
import re

# ---------------------------------------------------------------------------
# x86 흉내기: 이 파일에서 쓰는 만큼만 흉내 낸다 (MASM 문법의 일부를 그대로 읽는다).
# 레지스터 8·16·32비트, ZF/SF/CF/OF/PF, 리틀 엔디언 메모리, 스택, CALL/RET.
# 코드 주소는 실제 기계어 길이가 아니다. 줄 앞에 8자리 16진수를 쓰면 그 주소를 쓰고,
# 안 쓰면 CALL은 5, 나머지는 2씩 늘린다(슬라이드의 00000020 call → 00000025와 맞춘 값).
# ---------------------------------------------------------------------------
REG32 = ["eax", "ecx", "edx", "ebx", "esp", "ebp", "esi", "edi"]
REG16 = {"ax": "eax", "cx": "ecx", "dx": "edx", "bx": "ebx",
         "sp": "esp", "bp": "ebp", "si": "esi", "di": "edi"}
REG8L = {"al": "eax", "cl": "ecx", "dl": "edx", "bl": "ebx"}
REG8H = {"ah": "eax", "ch": "ecx", "dh": "edx", "bh": "ebx"}
TYPES = {"byte": 1, "sbyte": 1, "word": 2, "sword": 2, "dword": 4, "sdword": 4}
STOP = 0xFFFFFFF0          # call_proc이 스택에 넣어 두는 가짜 복귀 주소

JCC = {
    "jz": lambda f: f["ZF"], "je": lambda f: f["ZF"],
    "jnz": lambda f: not f["ZF"], "jne": lambda f: not f["ZF"],
    "jc": lambda f: f["CF"], "jb": lambda f: f["CF"], "jnae": lambda f: f["CF"],
    "jnc": lambda f: not f["CF"], "jae": lambda f: not f["CF"], "jnb": lambda f: not f["CF"],
    "jo": lambda f: f["OF"], "jno": lambda f: not f["OF"],
    "js": lambda f: f["SF"], "jns": lambda f: not f["SF"],
    "jp": lambda f: f["PF"], "jnp": lambda f: not f["PF"],
    "ja": lambda f: not f["CF"] and not f["ZF"], "jnbe": lambda f: not f["CF"] and not f["ZF"],
    "jbe": lambda f: f["CF"] or f["ZF"], "jna": lambda f: f["CF"] or f["ZF"],
    "jg": lambda f: not f["ZF"] and f["SF"] == f["OF"],
    "jnle": lambda f: not f["ZF"] and f["SF"] == f["OF"],
    "jge": lambda f: f["SF"] == f["OF"], "jnl": lambda f: f["SF"] == f["OF"],
    "jl": lambda f: f["SF"] != f["OF"], "jnge": lambda f: f["SF"] != f["OF"],
    "jle": lambda f: f["ZF"] or f["SF"] != f["OF"],
    "jng": lambda f: f["ZF"] or f["SF"] != f["OF"],
}


def signed(v, n):
    """n바이트 값 v를 부호 있는 정수로 읽는다."""
    bits = 8 * n
    return v - (1 << bits) if v >> (bits - 1) else v


class CPU:
    def __init__(self, esp=0x1000):
        self.r = {k: 0 for k in REG32}
        self.r["esp"] = esp
        self.f = dict(ZF=0, SF=0, CF=0, OF=0, PF=0)
        self.mem = {}       # 주소 -> 바이트
        self.sym = {}       # 변수 이름 -> (주소, 원소 크기, 원소 수)
        self.const = {}     # 기호 상수 -> 값
        self.here = 0x4000  # 데이터 위치 카운터
        self.code = []      # (주소, 연산, [피연산자], 원문)
        self.label = {}     # 레이블 -> 코드 주소
        self.at = {}        # 코드 주소 -> code 인덱스
        self.hook = {}      # 라이브러리 프로시저 흉내: 이름 -> 함수(cpu)
        self.steps = 0
        self.trace = None   # 리스트를 넣어 두면 (원문, 레지스터, 플래그)를 쌓는다
        self.calls = []     # 호출한 프로시저 이름 기록

    # ---- 레지스터와 메모리 ----
    def get(self, name):
        name = name.lower()
        if name in self.r:
            return self.r[name]
        if name in REG16:
            return self.r[REG16[name]] & 0xFFFF
        if name in REG8L:
            return self.r[REG8L[name]] & 0xFF
        if name in REG8H:
            return (self.r[REG8H[name]] >> 8) & 0xFF
        raise KeyError(name)

    def put(self, name, v):
        name = name.lower()
        if name in self.r:
            self.r[name] = v & 0xFFFFFFFF
        elif name in REG16:
            k = REG16[name]
            self.r[k] = (self.r[k] & 0xFFFF0000) | (v & 0xFFFF)
        elif name in REG8L:
            k = REG8L[name]
            self.r[k] = (self.r[k] & 0xFFFFFF00) | (v & 0xFF)
        elif name in REG8H:
            k = REG8H[name]
            self.r[k] = (self.r[k] & 0xFFFF00FF) | ((v & 0xFF) << 8)
        else:
            raise KeyError(name)

    @staticmethod
    def regsize(name):
        name = name.lower()
        if name in REG32:
            return 4
        if name in REG16:
            return 2
        if name in REG8L or name in REG8H:
            return 1
        return None

    def rd(self, addr, n):
        """리틀 엔디언: 낮은 주소에 낮은 바이트."""
        return sum(self.mem.get(addr + i, 0) << (8 * i) for i in range(n))

    def wr(self, addr, n, v):
        for i in range(n):
            self.mem[addr + i] = (v >> (8 * i)) & 0xFF

    # ---- 데이터 정의 ----
    def data(self, name, typ, values):
        """name TYPE values. 문자열은 글자마다 한 바이트, 레이블 이름은 그 코드 주소."""
        n = TYPES[typ.lower()]
        flat = []
        for v in values:
            if isinstance(v, str) and v in self.label:
                flat.append(self.label[v])
            elif isinstance(v, str):
                flat.extend(ord(c) for c in v)
            else:
                flat.append(v)
        addr = self.here
        if name:
            self.sym[name.lower()] = (addr, n, len(flat))
        for v in flat:
            self.wr(self.here, n, v)
            self.here += n
        return addr

    # ---- 식과 피연산자 ----
    def num(self, s):
        """상수식: 10진, 16진(h), 2진(b), 글자, 기호 상수, OFFSET/LENGTHOF/TYPE/SIZEOF, + - * / ( )."""
        s = s.strip()
        s = re.sub(r"'(.)'", lambda m: str(ord(m.group(1))), s)

        def op(m):
            a, n, c = self.sym[m.group(2).lower()]
            return str({"offset": a, "lengthof": c, "type": n, "sizeof": n * c}[m.group(1).lower()])
        s = re.sub(r"(?i)\b(offset|lengthof|type|sizeof)\s+(\w+)", op, s)

        def tok(m):
            t = m.group(0)
            low = t.lower()
            if re.fullmatch(r"[0-9][0-9a-f]*h", low):
                return str(int(low[:-1], 16))
            if re.fullmatch(r"[01]+b", low):
                return str(int(low[:-1], 2))
            if re.fullmatch(r"[0-9]+d?", low):
                return str(int(low.rstrip("d")))
            if low in self.const:
                return str(self.const[low])
            if low in self.label:
                return str(self.label[low])
            if t in self.label:
                return str(self.label[t])
            raise ValueError("모르는 이름: " + t)
        s = re.sub(r"\w+", tok, s)
        if not re.fullmatch(r"[0-9+\-*/() ]+", s):
            raise ValueError("식을 못 읽음: " + s)
        return int(eval(s.replace("/", "//")))

    def operand(self, s):
        """('reg', 이름, 크기) / ('imm', 값, None) / ('mem', 주소, 크기 또는 None)"""
        s = s.strip()
        size = None
        m = re.match(r"(?i)(byte|sbyte|word|sword|dword|sdword|near)\s+ptr\s+(.*)", s)
        if m:
            size = 4 if m.group(1).lower() == "near" else TYPES[m.group(1).lower()]
            s = m.group(2).strip()
        if self.regsize(s):
            return ("reg", s.lower(), self.regsize(s))
        m = re.fullmatch(r"(\w+)?\s*\[([^\]]+)\]", s)
        if m:
            addr = 0
            if m.group(1):
                a, n, _ = self.sym[m.group(1).lower()]
                addr, size = a, size or n
            for sign, term in re.findall(r"([+-]?)\s*([^+-]+)", m.group(2)):
                term = term.strip()
                v = self.get(term) if self.regsize(term) else self.num(term)
                addr += -v if sign == "-" else v
            return ("mem", addr & 0xFFFFFFFF, size)
        m = re.fullmatch(r"(\w+)\s*(?:([+-])\s*(\w+))?", s)
        if m and m.group(1).lower() in self.sym and not re.match(r"(?i)(offset|lengthof|type|sizeof)\b", s):
            a, n, _ = self.sym[m.group(1).lower()]
            if m.group(2):
                d = self.num(m.group(3))
                a += -d if m.group(2) == "-" else d
            return ("mem", a, size or n)
        return ("imm", self.num(s), None)

    def val(self, o, n):
        if o[0] == "reg":
            return self.get(o[1])
        if o[0] == "imm":
            return o[1] & ((1 << (8 * n)) - 1)
        return self.rd(o[1], n)

    def store(self, o, n, v):
        v &= (1 << (8 * n)) - 1
        if o[0] == "reg":
            self.put(o[1], v)
        else:
            self.wr(o[1], n, v)

    # ---- 플래그 ----
    def szp(self, v, n):
        self.f["ZF"] = int(v == 0)
        self.f["SF"] = (v >> (8 * n - 1)) & 1
        self.f["PF"] = int(bin(v & 0xFF).count("1") % 2 == 0)

    def add(self, a, b, n):
        mask = (1 << (8 * n)) - 1
        r = (a + b) & mask
        top = 8 * n - 1
        self.f["CF"] = int(a + b > mask)
        self.f["OF"] = int((a >> top) == (b >> top) and (r >> top) != (a >> top))
        self.szp(r, n)
        return r

    def sub(self, a, b, n):
        mask = (1 << (8 * n)) - 1
        r = (a - b) & mask
        top = 8 * n - 1
        self.f["CF"] = int(a < b)
        self.f["OF"] = int((a >> top) != (b >> top) and (r >> top) != (a >> top))
        self.szp(r, n)
        return r

    def logic(self, r, n):
        self.f["CF"] = self.f["OF"] = 0
        self.szp(r, n)
        return r

    # ---- 스택 ----
    def push(self, v, n=4):
        self.r["esp"] = (self.r["esp"] - n) & 0xFFFFFFFF
        self.wr(self.r["esp"], n, v)

    def pop(self, n=4):
        v = self.rd(self.r["esp"], n)
        self.r["esp"] = (self.r["esp"] + n) & 0xFFFFFFFF
        return v

    def eflags(self):
        f = self.f
        return f["CF"] | 2 | f["PF"] << 2 | f["ZF"] << 6 | f["SF"] << 7 | f["OF"] << 11

    # ---- 코드 읽기 ----
    def load(self, text, base=0):
        cur = base
        pending, uses = [], []
        for raw in text.splitlines():
            line = raw.split(";")[0].strip()
            if not line or line.lower() in (".code", ".data"):
                continue
            m = re.match(r"([0-9A-Fa-f]{8})\s+(.*)", line)
            if m:
                cur, line = int(m.group(1), 16), m.group(2).strip()
            m = re.fullmatch(r"(?i)(\w+)\s+PROC(?:\s+USES\s+(.*))?", line)
            if m:
                pending.append(m.group(1))
                uses = m.group(2).split() if m.group(2) else []
                for reg in uses:                      # USES가 만드는 push
                    cur = self._emit(cur, "push", [reg], "push " + reg, pending)
                    pending = []
                continue
            if re.fullmatch(r"(?i)\w+\s+ENDP", line):
                uses = []
                continue
            m = re.match(r"(\w+)::?\s*(.*)", line)
            if m and ":" in line.split()[0]:
                pending.append(m.group(1))
                line = m.group(2).strip()
                if not line:
                    continue
            parts = line.split(None, 1)
            op = parts[0].lower()
            args = [a.strip() for a in parts[1].split(",")] if len(parts) > 1 else []
            if op == "ret":
                for reg in reversed(uses):            # USES가 만드는 pop
                    cur = self._emit(cur, "pop", [reg], "pop " + reg, pending)
                    pending = []
            cur = self._emit(cur, op, args, line, pending)
            pending = []
        for name in pending:                          # 맨 끝의 레이블(next: 같은 것)
            self.label[name] = self.label[name.lower()] = cur
        self.end = cur

    def _emit(self, cur, op, args, line, pending):
        for name in pending:
            self.label[name] = self.label[name.lower()] = cur
        self.at[cur] = len(self.code)
        self.code.append((cur, op, args, line))
        return cur + (5 if op == "call" else 2)

    def target(self, s):
        if s in self.label:
            return self.label[s]
        if s.lower() in self.label:
            return self.label[s.lower()]
        o = self.operand(s)
        return self.val(o, 4)

    # ---- 실행 ----
    def run(self, start=None, max_steps=10 ** 6):
        eip = self.target(start) if isinstance(start, str) else (start if start is not None else self.code[0][0])
        while eip in self.at:
            self.steps += 1
            if self.steps > max_steps:
                raise RuntimeError("너무 오래 돈다")
            i = self.at[eip]
            addr, op, a, line = self.code[i]
            nxt = self.code[i + 1][0] if i + 1 < len(self.code) else self.end
            eip = self.step(op, a, nxt)
            if self.trace is not None:
                self.trace.append((line, dict(self.r), dict(self.f)))
            if eip is None:
                break
        self.eip = eip
        return self

    def call_proc(self, name):
        self.push(STOP)
        return self.run(name)

    def step(self, op, a, nxt):
        f = self.f
        if op in ("exit", "hlt"):
            return None
        if op == "nop":
            return nxt
        if op == "jmp":
            return self.target(a[0])
        if op in JCC:
            return self.target(a[0]) if JCC[op](f) else nxt
        if op == "jecxz":
            return self.target(a[0]) if self.r["ecx"] == 0 else nxt
        if op == "jcxz":
            return self.target(a[0]) if self.get("cx") == 0 else nxt
        if op in ("loop", "loope", "loopz", "loopne", "loopnz"):
            self.r["ecx"] = (self.r["ecx"] - 1) & 0xFFFFFFFF      # 플래그는 안 바뀐다
            go = self.r["ecx"] != 0
            if op in ("loope", "loopz"):
                go = go and f["ZF"] == 1
            if op in ("loopne", "loopnz"):
                go = go and f["ZF"] == 0
            return self.target(a[0]) if go else nxt
        if op == "call":
            if a[0] in self.hook:
                self.calls.append(a[0])
                self.hook[a[0]](self)
                return nxt
            t = self.target(a[0])
            self.calls.append(a[0])
            self.push(nxt)
            return t
        if op == "ret":
            t = self.pop()
            return None if t == STOP else t
        if op == "push":
            o = self.operand(a[0])
            n = 2 if (o[0] == "reg" and o[2] == 2) or (o[0] == "mem" and o[2] == 2) else 4
            self.push(self.val(o, n), n)
            return nxt
        if op == "pop":
            o = self.operand(a[0])
            n = 2 if o[2] == 2 else 4
            self.store(o, n, self.pop(n))
            return nxt
        if op == "pushfd":
            self.push(self.eflags())
            return nxt
        if op == "popfd":
            v = self.pop()
            f.update(CF=v & 1, PF=(v >> 2) & 1, ZF=(v >> 6) & 1, SF=(v >> 7) & 1, OF=(v >> 11) & 1)
            return nxt
        if op == "pushad":
            old = self.r["esp"]
            for k in ["eax", "ecx", "edx", "ebx"]:
                self.push(self.r[k])
            self.push(old)
            for k in ["ebp", "esi", "edi"]:
                self.push(self.r[k])
            return nxt
        if op == "popad":
            for k in ["edi", "esi", "ebp"]:
                self.r[k] = self.pop()
            self.pop()                                            # ESP 칸은 버린다
            for k in ["ebx", "edx", "ecx", "eax"]:
                self.r[k] = self.pop()
            return nxt
        # ---- 피연산자가 있는 명령 ----
        d = self.operand(a[0])
        s = self.operand(a[1]) if len(a) > 1 else None
        n = d[2] or (s[2] if s else None)
        if n is None:
            raise ValueError("크기를 알 수 없다: " + " ".join(a))
        if op in ("movzx", "movsx"):
            sn = s[2]
            v = self.val(s, sn)
            self.store(d, d[2], signed(v, sn) if op == "movsx" else v)
            return nxt
        if s is not None and s[0] != "imm" and d[2] and s[2] and d[2] != s[2] and op not in ("shl", "sal", "shr", "sar"):
            raise ValueError("크기가 다르다: " + " ".join(a))
        x = self.val(d, n)
        y = self.val(s, n) if s else None
        top = 8 * n - 1
        if op == "mov":
            self.store(d, n, y)
        elif op == "xchg":
            self.store(d, n, y)
            self.store(s, n, x)
        elif op == "add":
            self.store(d, n, self.add(x, y, n))
        elif op == "sub":
            self.store(d, n, self.sub(x, y, n))
        elif op == "cmp":
            self.sub(x, y, n)                                     # 결과는 버린다
        elif op == "inc":
            c = f["CF"]
            self.store(d, n, self.add(x, 1, n))
            f["CF"] = c                                           # INC는 CF를 안 건드린다
        elif op == "dec":
            c = f["CF"]
            self.store(d, n, self.sub(x, 1, n))
            f["CF"] = c
        elif op == "neg":
            self.store(d, n, self.sub(0, x, n))
        elif op == "and":
            self.store(d, n, self.logic(x & y, n))
        elif op == "test":
            self.logic(x & y, n)                                  # 결과는 버린다
        elif op == "or":
            self.store(d, n, self.logic(x | y, n))
        elif op == "xor":
            self.store(d, n, self.logic(x ^ y, n))
        elif op == "not":
            self.store(d, n, ~x)                                  # 플래그는 안 바뀐다
        elif op in ("shl", "sal", "shr", "sar"):
            c = self.val(s, 1) & 31
            for _ in range(c):
                if op in ("shl", "sal"):
                    f["CF"] = (x >> top) & 1
                    x = (x << 1) & ((1 << (8 * n)) - 1)
                else:
                    f["CF"] = x & 1
                    x = (x >> 1) | ((x >> top) << top if op == "sar" else 0)
            if c:
                self.szp(x, n)
            self.store(d, n, x)
        else:
            raise ValueError("모르는 명령: " + op)
        return nxt


def machine(code, esp=0x1000, base=0):
    c = CPU(esp)
    c.load(code, base)
    return c

E32 = [0, 1, 2, 5, 6, 0x7FFFFFFF, 0x80000000, 0xFFFFFFFE, 0xFFFFFFFF]
E8 = [0, 1, 2, 3, 0x7E, 0x7F, 0x80, 0x81, 0xFE, 0xFF]


def run(code, regs=None, data=None):
    c = machine(code)
    addr = {}
    for name, v in (data or {}).items():
        addr[name] = c.data(name, "DWORD", [v])
    for k, v in (regs or {}).items():
        c.put(k, v)
    c.run()
    return c, {k: c.rd(a, 4) for k, a in addr.items()}


def main():
    # 1. if-else (wk09-2-1 p.10)
    code = "mov eax,op1\ncmp eax,op2\njne L1\nmov X,1\njmp L2\nL1:mov X,2\nL2:"
    for a, b in itertools.product(E32, E32):
        c, d = run(code, data=dict(op1=a, op2=b, X=0))
        assert d["X"] == (1 if a == b else 2)
    # 2. Your turn (p.11): 부호 없는 if (ebx <= ecx) { eax = 5; edx = 6; }
    code = "cmp ebx,ecx\nja next\nmov eax,5\nmov edx,6\nnext:"
    for b, cx in itertools.product(E32, E32):
        c, d = run(code, dict(ebx=b, ecx=cx, eax=99, edx=99))
        assert (c.r["eax"], c.r["edx"]) == ((5, 6) if b <= cx else (99, 99))
    # 3. Your turn (p.12): 부호 있는 if (var1 <= var2) var3 = 10; else { var3 = 6; var4 = 7; }
    code = "mov eax,var1\ncmp eax,var2\njle L1\nmov var3,6\nmov var4,7\njmp L2\nL1:mov var3,10\nL2:"
    for a, b in itertools.product(E32, E32):
        c, d = run(code, data=dict(var1=a, var2=b, var3=0, var4=0))
        want = (10, 0) if signed(a, 4) <= signed(b, 4) else (6, 7)
        assert (d["var3"], d["var4"]) == want
    # 조건을 뒤집어 쓴 판도 같은 답
    code2 = "mov eax,var1\ncmp eax,var2\njg L1\nmov var3,10\njmp L2\nL1:mov var3,6\nmov var4,7\nL2:"
    for a, b in itertools.product(E32, E32):
        assert run(code, data=dict(var1=a, var2=b, var3=0, var4=0))[1] == run(code2, data=dict(var1=a, var2=b, var3=0, var4=0))[1]
    # 4. AND (p.14~15): 두 구현이 같고, 명령 수 7 -> 5
    long_and = "cmp al,bl\nja L1\njmp next\nL1:\ncmp bl,cl\nja L2\njmp next\nL2:\nmov X,1\nnext:"
    short_and = "cmp al,bl\njbe next\ncmp bl,cl\njbe next\nmov X,1\nnext:"
    n_long, n_short = len(machine(long_and).code), len(machine(short_and).code)
    assert (n_long, n_short) == (7, 5) and round((n_long - n_short) / n_long * 100) == 29
    for a, b, cl in itertools.product(E8, E8, E8):
        want = 1 if (a > b and b > cl) else 0
        for code in (long_and, short_and):
            c, d = run(code, dict(al=a, bl=b, cl=cl), dict(X=0))
            assert d["X"] == want
    # 단락 평가: 첫 조건이 거짓이면 둘째 CMP는 실행되지 않는다
    c = machine(short_and)
    c.data("X", "DWORD", [0])
    c.put("al", 1)
    c.put("bl", 2)
    c.trace = []
    c.run()
    assert [l for l, r, f in c.trace] == ["cmp al,bl", "jbe next"]
    # 5. Your turn (p.16): if (ebx <= ecx && ecx > edx) { eax = 5; edx = 6; }
    code = "cmp ebx,ecx\nja next\ncmp ecx,edx\njbe next\nmov eax,5\nmov edx,6\nnext:"
    for b, cx, dx in itertools.product(E32, E32, E32):
        c, d = run(code, dict(ebx=b, ecx=cx, edx=dx, eax=99))
        assert (c.r["eax"], c.r["edx"]) == ((5, 6) if (b <= cx and cx > dx) else (99, dx))
    # 6. OR (p.18)
    code = "cmp al,bl\nja L1\ncmp bl,cl\njbe next\nL1:mov X,1\nnext:"
    for a, b, cl in itertools.product(E8, E8, E8):
        c, d = run(code, dict(al=a, bl=b, cl=cl), dict(X=0))
        assert d["X"] == (1 if (a > b or b > cl) else 0)
    c = machine(code)
    c.data("X", "DWORD", [0])
    c.put("al", 2)
    c.put("bl", 1)
    c.trace = []
    c.run()
    assert [l for l, r, f in c.trace] == ["cmp al,bl", "ja L1", "mov X,1"]
    # 7. WHILE (p.19): while (eax < ebx) eax = eax + 1;
    code = "top:cmp eax,ebx\njae next\ninc eax\njmp top\nnext:"
    for a, b in [(0, 0), (0, 5), (3, 5), (5, 5), (6, 5), (0xFFFFFFFD, 0xFFFFFFFF), (0xFFFFFFFF, 0)]:
        c, d = run(code, dict(eax=a, ebx=b))
        assert c.r["eax"] == max(a, b)
    c = machine(code)
    c.r.update(eax=3, ebx=5)
    c.trace = []
    c.run()
    assert len([1 for l, r, f in c.trace if l.startswith("cmp")]) == 3     # 조건 검사는 몸통 횟수 + 1
    # 8. Your turn (p.20): while (ebx <= val1) { ebx = ebx + 5; val1 = val1 - 1; }
    code = "top:cmp ebx,val1\nja next\nadd ebx,5\ndec val1\njmp top\nnext:"
    for b, v in [(0, 10), (3, 3), (4, 3), (1, 100), (7, 8)]:
        c, d = run(code, dict(ebx=b), dict(val1=v))
        pb, pv = b, v
        while pb <= pv:
            pb, pv = pb + 5, pv - 1
        assert (c.r["ebx"], d["val1"]) == (pb, pv)
    c, d = run(code, dict(ebx=0), dict(val1=10))
    assert (c.r["ebx"], d["val1"]) == (10, 8)
    # 경계: ebx = 0, val1 = 0이면 한 바퀴 뒤 val1 = FFFFFFFFh가 되어 계속 돈다
    c = machine(code)
    v = c.data("val1", "DWORD", [0])
    try:
        c.run(max_steps=5)
    except RuntimeError:
        pass
    assert c.rd(v, 4) == 0xFFFFFFFF and c.r["ebx"] == 5
    # 9. 뒤집은 조건 표: 조건 c로 뛰는 점프와 그 반대 점프는 모든 플래그 조합에서 서로 반대
    opposite = {"je": "jne", "ja": "jbe", "jae": "jb", "jg": "jle", "jge": "jl"}
    for flags in itertools.product((0, 1), repeat=4):
        f = dict(zip(("ZF", "SF", "CF", "OF"), flags), PF=0)
        for p, q in opposite.items():
            assert bool(JCC[p](f)) != bool(JCC[q](f))
    # 10. 카드 C2: 부호 있는 if (eax > ebx) ecx = 1; else ecx = 2;  eax = -3, ebx = 2
    code = "cmp eax,ebx\njle L1\nmov ecx,1\njmp L2\nL1:mov ecx,2\nL2:"
    c, d = run(code, dict(eax=0xFFFFFFFD, ebx=2))
    assert c.r["ecx"] == 2
    c, d = run(code.replace("jle", "jbe"), dict(eax=0xFFFFFFFD, ebx=2))
    assert c.r["ecx"] == 1                      # 부호 없는 점프를 쓰면 틀린 쪽으로 간다
    # 카드 C4: do-while 꼴. 조건 검사가 아래에 있으면 몸통이 적어도 한 번 돈다
    code = "top:inc eax\ncmp eax,ebx\njb top"
    c, d = run(code, dict(eax=9, ebx=5))
    assert c.r["eax"] == 10
    c, d = run("top:cmp eax,ebx\njae next\ninc eax\njmp top\nnext:", dict(eax=9, ebx=5))
    assert c.r["eax"] == 9

    # 오해 항목: 조건 그대로 jbe를 쓰고 몸통을 바로 아래에 두면 참일 때 건너뛴다
    c, d = run("cmp ebx,ecx\njbe next\nmov eax,5\nnext:", dict(ebx=1, ecx=5, eax=99))
    assert c.r["eax"] == 99
    c, d = run("cmp ebx,ecx\nja next\nmov eax,5\nnext:", dict(ebx=1, ecx=5, eax=99))
    assert c.r["eax"] == 5

if __name__ == "__main__":
    main()
    print("ALL CHECKS PASSED")
```
{% endraw %}
