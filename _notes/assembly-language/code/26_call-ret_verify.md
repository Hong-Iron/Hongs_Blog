---
layout: "note"
title: "26_call-ret_verify.py"
display_title: "26_call-ret_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/call-ret/"
parent_title: "프로시저와 CALL·RET"
description: "어셈블리어 · 프로시저와 CALL·RET 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/26_call-ret_verify/"
---
{% raw %}
[프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""프로시저와 CALL·RET 문서의 값 확인 (파이썬 흉내, 실제 MASM 실행 아님).
실행: python3 26_call-ret_verify.py"""
import re

# ---------------------------------------------------------------------------
# x86 흉내기: 이 파일에서 쓰는 만큼만 흉내 낸다 (MASM 문법의 일부를 그대로 읽는다).
# 레지스터 8·16·32비트, ZF/SF/CF/OF/PF, 리틀 엔디언 메모리, 스택, CALL/RET.
# 코드 주소는 실제 기계어 길이가 아니다. 줄 앞에 8자리 16진수를 쓰면 그 주소를 쓰고,
# 안 쓰면 CALL은 5, 나머지는 2씩 늘린다(문서 예시의 00000020 call → 00000025와 맞춘 값).
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

def main():
    # 1. CALL-RET 예
    c = machine("""main PROC
        00000020 call MySub
        00000025 mov eax,ebx
        exit
        main ENDP
        MySub PROC
        00000040 mov eax,edx
        ret
        MySub ENDP""")
    c.trace = []
    c.run()
    lines = [l for l, r, f in c.trace]
    assert lines == ["call MySub", "mov eax,edx", "ret", "mov eax,ebx", "exit"]
    assert c.trace[0][1]["esp"] == 0xFFC and c.rd(0xFFC, 4) == 0x25   # CALL: 복귀 주소를 넣는다
    assert c.label["MySub"] == 0x40
    assert c.trace[2][1]["esp"] == 0x1000                              # RET: 꺼내서 EIP로
    # 2. 중첩 호출: Sub3 안에서는 복귀 주소 세 개가 쌓여 있다
    c = machine("""main PROC
        00000000 call Sub1
        00000005 exit
        main ENDP
        Sub1 PROC
        00000010 call Sub2
        00000015 ret
        Sub1 ENDP
        Sub2 PROC
        00000020 call Sub3
        00000025 ret
        Sub2 ENDP
        Sub3 PROC
        00000030 nop
        00000032 ret
        Sub3 ENDP""")
    c.trace = []
    c.run()
    esp = {l: r["esp"] for l, r, f in c.trace}
    assert esp["nop"] == 0xFF4
    assert [c.rd(a, 4) for a in (0xFFC, 0xFF8, 0xFF4)] == [0x05, 0x15, 0x25]
    assert c.calls == ["Sub1", "Sub2", "Sub3"] and c.r["esp"] == 0x1000
    # 돌아오는 순서는 부른 순서의 거꾸로
    after = [l for l, r, f in c.trace][3:]
    assert after == ["nop", "ret", "ret", "ret", "exit"]
    # 3. SumOf
    c = machine("""SumOf PROC
        add eax,ebx
        add eax,ecx
        ret
        SumOf ENDP""")
    c.r.update(eax=1, ebx=2, ecx=3)
    c.call_proc("SumOf")
    assert c.r["eax"] == 6 and c.r["esp"] == 0x1000
    c = machine("SumOf PROC\nadd eax,ebx\nadd eax,ecx\nret\nSumOf ENDP")
    c.r.update(eax=0xFFFFFFFF, ebx=1, ecx=0)
    c.call_proc("SumOf")
    assert c.r["eax"] == 0                 # 넘치면 값이 접히고 플래그가 바뀐 채 돌아온다
    # 4. 실패 시나리오: PUSH만 하고 POP을 빼먹으면 RET이 엉뚱한 값을 주소로 쓴다
    c = machine("""main PROC
        00000000 mov eax,1
        00000005 call Bad
        0000000A exit
        main ENDP
        Bad PROC
        00000050 push eax
        00000051 mov eax,0Ah
        00000056 ret
        Bad ENDP""").run()
    assert c.eip == 1 and c.r["esp"] == 0xFFC and c.rd(0xFFC, 4) == 0x0A
    # POP을 넣으면 제대로 돌아온다
    c = machine("""main PROC
        00000000 mov eax,1
        00000005 call Good
        0000000A exit
        main ENDP
        Good PROC
        00000050 push eax
        00000051 mov eax,0Ah
        00000056 pop eax
        00000057 ret
        Good ENDP""")
    c.trace = []
    c.run()
    assert c.trace[-1][0] == "exit" and c.r["esp"] == 0x1000 and c.r["eax"] == 1
    # 5. 카드 C2: 00000100 call F / 00000105 ..., F는 00000200
    c = machine("""00000100 call F
        00000105 exit
        F PROC
        00000200 push ebx
        00000201 pop ebx
        00000202 ret
        F ENDP""", esp=0x2000)
    c.trace = []
    c.run()
    assert [r["esp"] for l, r, f in c.trace] == [0x1FFC, 0x1FF8, 0x1FFC, 0x2000, 0x2000]
    assert c.rd(0x1FFC, 4) == 0x105


if __name__ == "__main__":
    main()
    print("ALL CHECKS PASSED")
```
{% endraw %}
