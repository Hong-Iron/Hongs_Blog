---
layout: "note"
title: "36_type-checking-practice_p4.py"
display_title: "36_type-checking-practice_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "36"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/type-checking-practice/"
parent_title: "타입 검사 연습"
description: "컴파일러 · 타입 검사 연습 문제 4 풀이 코드"
permalink: "/studies/compilers/code/36_type-checking-practice_p4/"
---
{% raw %}
[타입 검사 연습](/Hongs_Blog/studies/compilers/type-checking-practice/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 36_type-checking-practice_p4.py
# 타입 검사 연습의 문제 1~4의 답을 확인한다. 식에는 타입 추론 규칙을, 문장에는 WF 규칙을 쓰는
# 검사기로 문서에 적은 타입, 규칙을 쓰는 순서와 횟수, 오류 판정을 다시 만든다.
# 개념 코드(36번의 구현)에서 필요한 부분을 복사해 넣었다. 표준 라이브러리만 쓴다.
# 실행: python3 36_type-checking-practice_p4.py


NUMERIC = ("short", "int", "long", "float", "double")
PRIMITIVE = ("byte", "short", "int", "long", "float", "double", "char", "bool")


class TypeErr(Exception):
    pass


class Scope:
    """심벌 테이블 한 장. parent를 따라 바깥 스코프로 올라간다."""
    def __init__(self, parent=None, returns=None):
        self.table, self.parent = {}, parent
        self.returns = returns if returns is not None else (parent.returns if parent else None)

    def declare(self, name, typ):
        if name in self.table:
            raise TypeErr("%s를 같은 스코프에서 두 번 선언했다" % name)
        self.table[name] = typ

    def lookup(self, name):
        s = self
        while s:
            if name in s.table:
                return s.table[name]
            s = s.parent
        raise TypeErr("%s는 선언되지 않았다(타입을 정할 수 없다)" % name)


def type_of(e, S, log=None):
    """식 e의 타입을 추론 규칙으로 구한다. 맞는 규칙이 없으면 TypeErr."""
    def note(label, t):
        if log is not None:
            log.append((label, t))
        return t
    k = e[0]
    if k == "num":
        return note(str(e[1]), "int")                 # i가 정수 상수면 S ⊢ i : int
    if k == "dbl":
        return note(str(e[1]), "double")
    if k == "str":
        return note(e[1], "string")
    if k == "bool":
        return note(str(e[1]).lower(), "bool")        # 공리: S ⊢ true : bool
    if k == "id":
        return note(e[1], S.lookup(e[1]))             # x가 스코프 S에 타입 T로 선언 → S ⊢ x : T
    if k == "call":
        sig = S.lookup(e[1])
        if not (isinstance(sig, tuple) and sig[0] == "fn"):
            raise TypeErr("%s는 함수가 아니다" % e[1])
        params, ret = sig[1], sig[2]
        if len(params) != len(e[2]):
            raise TypeErr("%s의 인자 수가 다르다" % e[1])
        for want, arg in zip(params, e[2]):
            got = type_of(arg, S, log)
            if got != want:
                raise TypeErr("%s의 인자 타입 %s, 기대 %s" % (e[1], got, want))
        return note(e[1] + "()", ret)
    if k == "index":
        t1, t2 = type_of(e[1], S, log), type_of(e[2], S, log)
        if not (isinstance(t1, str) and t1.endswith("[]")) or t2 != "int":
            raise TypeErr("배열 규칙에 맞지 않는다: %s[%s]" % (t1, t2))
        return note("[]", t1[:-2])
    t1, t2 = type_of(e[1], S, log), type_of(e[2], S, log)
    if k in ("+", "-", "*", "/"):
        if t1 == t2 and t1 in NUMERIC:
            return note(k, t1)
    elif k in ("&&", "||"):
        if t1 == t2 == "bool":
            return note(k, "bool")
    elif k in ("==", "!=", "<=", ">=", "<", ">"):
        if t1 == t2 and t1 in PRIMITIVE:
            return note(k, "bool")
    raise TypeErr("%s %s %s 에 맞는 규칙이 없다" % (t1, k, t2))


def check(s, S, log=None):
    """문장 s가 스코프 S에서 의미에 맞게 짜였는지(WF) 본다. 아니면 TypeErr."""
    def wf(label):
        if log is not None:
            log.append((label, "WF"))
    k = s[0]
    if k == "decl":                                   # ("decl", 타입, 이름[, 초기값 식])
        if len(s) == 4:
            t = type_of(s[3], S, log)
            if t != s[1]:
                raise TypeErr("%s %s 의 초기값이 %s다" % (s[1], s[2], t))
        S.declare(s[2], s[1])
        wf("decl")
    elif k == "=":
        if s[1][0] != "id":
            raise TypeErr("대입의 왼쪽이 변수가 아니다")
        t1, t2 = type_of(s[1], S, log), type_of(s[2], S, log)
        if t1 != t2:
            raise TypeErr("%s 변수에 %s 값을 넣는다" % (t1, t2))
        wf("=")
    elif k == "return":
        if s[1] is None:
            if S.returns != "void":
                raise TypeErr("값 없는 return, 함수는 %s를 돌려준다" % S.returns)
        else:
            t = type_of(s[1], S, log)
            if t != S.returns:
                raise TypeErr("return %s, 함수는 %s를 돌려준다" % (t, S.returns))
        wf("return")
    elif k == "block":
        for x in s[1]:
            check(x, S, log)
        wf("block")
    elif k == "while":
        if type_of(s[1], S, log) != "bool":
            raise TypeErr("while 조건이 bool이 아니다")
        if log is not None:
            log.append(("cond", "bool"))
        check(s[2], Scope(S), log)                    # S' = 반복문 안쪽 스코프
        wf("while")
    elif k == "if":
        if type_of(s[1], S, log) != "bool":
            raise TypeErr("if 조건이 bool이 아니다")
        if log is not None:
            log.append(("cond", "bool"))
        check(s[2], Scope(S), log)                    # S' = if 블록 안쪽
        if len(s) > 3 and s[3] is not None:
            check(s[3], Scope(S), log)                # S'' = else 블록 안쪽
        wf("if")
    elif k == "func":                                 # ("func", 반환 타입, 이름, [(타입, 이름)...], 블록)
        S.declare(s[2], ("fn", tuple(t for t, _ in s[3]), s[1]))
        inner = Scope(S, returns=s[1])
        for t, n in s[3]:
            inner.declare(n, t)
        check(s[4], inner, log)
        wf("func")
    elif k == "expr":
        type_of(s[1], S, log)
        wf("expr")
    else:
        raise ValueError(k)
    return True


def ok(fn, *a):
    try:
        fn(*a)
        return True
    except TypeErr:
        return False


def I(n):
    return ("id", n)


if __name__ == "__main__":
    one = ("num", 1)

    # 문제 1: S = {int[] arr; int i; bool flag; double f(int, bool)},  f(arr[i + 1], flag)
    S = Scope()
    for n, t in (("arr", "int[]"), ("i", "int"), ("flag", "bool"), ("n", "int"), ("d", "double")):
        S.declare(n, t)
    S.declare("f", ("fn", ("int", "bool"), "double"))
    log = []
    e1 = ("call", "f", [("index", I("arr"), ("+", I("i"), one)), I("flag")])
    assert type_of(e1, S, log) == "double"
    assert log == [("arr", "int[]"), ("i", "int"), ("1", "int"), ("+", "int"), ("[]", "int"),
                   ("flag", "bool"), ("f()", "double")]
    assert len(log) == 7

    # 문제 2: 다섯 식의 판정
    assert type_of(("==", ("+", I("i"), one), I("n")), S) == "bool"            # (가)
    assert not ok(type_of, ("+", I("d"), I("i")), S)                            # (나) double + int
    assert not ok(type_of, ("&&", I("flag"), ("<=", I("i"), I("d"))), S)        # (다) int <= double
    assert type_of(("&&", I("flag"), ("<=", I("i"), I("n"))), S) == "bool"
    assert not ok(type_of, ("index", I("arr"), I("flag")), S)                   # (라) 첨자가 bool
    assert not ok(type_of, ("call", "f", [I("i"), I("flag"), I("n")]), S)       # (마) 인자 수
    assert type_of(("+", ("call", "f", [I("i"), I("flag")]), I("d")), S) == "double"

    # 문제 3: while (i <= n) { d = f(i, flag); i = i + 1; }
    log = []
    loop = ("while", ("<=", I("i"), I("n")),
            ("block", [("=", I("d"), ("call", "f", [I("i"), I("flag")])),
                       ("=", I("i"), ("+", I("i"), one))]))
    assert check(loop, S, log)
    assert [x[0] for x in log] == ["i", "n", "<=", "cond", "d", "i", "flag", "f()", "=",
                                   "i", "i", "1", "+", "=", "block", "while"]
    assert len(log) == 16 and [x for x in log if x[1] == "WF"] == [("=", "WF"), ("=", "WF"), ("block", "WF"), ("while", "WF")]
    # 변형: 첫 문장을 i = f(i, flag); 로 바꾸면 int 변수에 double을 넣어 대입 규칙이 깨진다
    bad = ("while", ("<=", I("i"), I("n")), ("block", [("=", I("i"), ("call", "f", [I("i"), I("flag")]))]))
    assert not ok(check, bad, S)

    # 문제 4: int abs(int x) { if (x >= 0) { return x; } else { return 0 - x; } }
    G = Scope()
    body = ("block", [("if", (">=", I("x"), ("num", 0)),
                       ("block", [("return", I("x"))]),
                       ("block", [("return", ("-", ("num", 0), I("x")))]))])
    log = []
    assert check(("func", "int", "abs", [("int", "x")], body), G, log)
    assert [x[0] for x in log] == ["x", "0", ">=", "cond", "x", "return", "block",
                                   "0", "x", "-", "return", "block", "if", "block", "func"]
    assert G.lookup("abs") == ("fn", ("int",), "int")
    # 변형 (a): 반환 타입을 bool로 바꾸면 두 return이 모두 깨진다
    assert not ok(check, ("func", "bool", "abs", [("int", "x")], body), Scope())
    # 변형 (b): else 쪽만 return x >= 0; 으로 바꾸면 그 한 문장 때문에 전체가 WF가 아니다
    body_b = ("block", [("if", (">=", I("x"), ("num", 0)),
                         ("block", [("return", I("x"))]),
                         ("block", [("return", (">=", I("x"), ("num", 0)))]))])
    assert not ok(check, ("func", "int", "abs", [("int", "x")], body_b), Scope())
    # 변형 (c): 조건을 if (x) 로 바꾸면 조건이 int라 if 규칙의 첫 가정이 깨진다
    body_c = ("block", [("if", I("x"), ("block", [("return", I("x"))]), ("block", [("return", I("x"))]))])
    assert not ok(check, ("func", "int", "abs", [("int", "x")], body_c), Scope())

    print("ALL CHECKS PASSED")
```
{% endraw %}
