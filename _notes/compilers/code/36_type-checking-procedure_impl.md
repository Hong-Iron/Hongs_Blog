---
layout: "note"
title: "36_type-checking-procedure_impl.py"
display_title: "36_type-checking-procedure_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/type-checking-procedure/"
parent_title: "타입 검사 절차"
description: "컴파일러 · 타입 검사 절차 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/36_type-checking-procedure_impl/"
---
{% raw %}
[타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 36_type-checking-procedure_impl.py
# AST를 재귀로 돌며 타입을 검사하는 작은 검사기. 식에는 타입 추론 규칙을, 문장에는 WF 규칙을 쓴다.
# 슬라이드 L10 p.28~37의 while (a != b) { a = a + 1; } 추적(붙는 타입과 그 순서),
# p.38의 return 예, p.27의 if (A && B) { var = 3; } 순서를 다시 만들고, 틀린 프로그램을 걸러내는지 본다.
# 자동 타입 변환은 하지 않는다(강의 규칙에 없다). 표준 라이브러리만 쓴다.
# AST: ("num", 1) ("dbl", 1.0) ("str", "ok") ("bool", True) ("id", "a") (연산자, 왼쪽, 오른쪽)
#      ("call", f, [식...]) ("index", 식, 식) / ("decl", 타입, 이름[, 식]) ("=", ("id", x), 식)
#      ("return", 식 또는 None) ("block", [문장...]) ("while", 식, 블록) ("if", 식, 블록, 블록 또는 None)
#      ("func", 반환 타입, 이름, [(타입, 이름)...], 블록)
# 실행: python3 36_type-checking-procedure_impl.py


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


if __name__ == "__main__":
    a, b, one = ("id", "a"), ("id", "b"), ("num", 1)

    # p.28~37: 스코프 검사 뒤의 심벌 테이블 {a: int, b: int}
    S = Scope()
    S.declare("a", "int")
    S.declare("b", "int")
    prog = ("while", ("!=", a, b), ("block", [("=", a, ("+", a, one))]))
    log = []
    assert check(prog, S, log)
    assert log == [
        ("a", "int"), ("b", "int"), ("!=", "bool"), ("cond", "bool"),      # 2. 부분식 a != b
        ("a", "int"), ("a", "int"), ("1", "int"), ("+", "int"), ("=", "WF"),  # 3. 자식 문장 a = a + 1
        ("block", "WF"),
        ("while", "WF"),                                                   # 4. 전체
    ]

    # p.27: if (A && B) { var = 3; }  부분식 -> 자식 문장 -> 전체
    S2 = Scope()
    for n, t in (("A", "bool"), ("B", "bool"), ("var", "int")):
        S2.declare(n, t)
    log = []
    check(("if", ("&&", ("id", "A"), ("id", "B")), ("block", [("=", ("id", "var"), ("num", 3))]), None), S2, log)
    assert [x[0] for x in log] == ["A", "B", "&&", "cond", "var", "3", "=", "block", "if"]

    # p.38 (보충): bool compare(int a, int b) { return a >= b; }
    G = Scope()
    log = []
    f = ("func", "bool", "compare", [("int", "a"), ("int", "b")], ("block", [("return", (">=", a, b))]))
    assert check(f, G, log)
    assert log == [("a", "int"), ("b", "int"), (">=", "bool"), ("return", "WF"), ("block", "WF"), ("func", "WF")]
    assert G.lookup("compare") == ("fn", ("int", "int"), "bool")
    # 반환 타입을 int로 바꾸면 return 규칙의 가정 S ⊢ e : T 가 깨진다
    assert not ok(check, ("func", "int", "cmp2", [("int", "a"), ("int", "b")],
                          ("block", [("return", (">=", a, b))])), Scope())
    # void 함수의 return; 과 값 있는 return
    assert ok(check, ("func", "void", "v", [], ("block", [("return", None)])), Scope())
    assert not ok(check, ("func", "void", "v", [], ("block", [("return", one)])), Scope())
    assert not ok(check, ("func", "int", "v", [], ("block", [("return", None)])), Scope())

    # p.15: A가 bool, B가 int면 A && B는 타입 오류
    S3 = Scope()
    S3.declare("A", "bool")
    S3.declare("B", "int")
    assert not ok(type_of, ("&&", ("id", "A"), ("id", "B")), S3)
    # p.11: int a = 3; a = "ok";  정적 타입 언어에서는 컴파일할 때 걸린다
    S4 = Scope()
    assert check(("decl", "int", "a", ("num", 3)), S4)
    assert not ok(check, ("=", a, ("str", "ok")), S4)
    # p.23: 의미에 맞는 문장들
    S5 = Scope()
    assert check(("block", [("decl", "int", "a", ("num", 3)),
                            ("decl", "bool", "well_formed", ("bool", True)),
                            ("decl", "string", "s", ("str", "this is well-formed")),
                            ("while", (">", ("num", 1), ("num", 0)), ("block", [])),
                            ("if", ("==", ("num", 10), ("num", 10)), ("block", []), ("block", []))]), S5)
    # p.9: if (1.0 + 2.0) 는 조건이 double이라 오류
    assert type_of(("+", ("dbl", 1.0), ("dbl", 2.0)), Scope()) == "double"
    assert not ok(check, ("if", ("+", ("dbl", 1.0), ("dbl", 2.0)), ("block", []), None), Scope())

    # if-else 규칙(보충): 조건이 bool, 두 블록이 각자 안쪽 스코프에서 WF
    S6 = Scope()
    S6.declare("x", "int")
    good = ("if", ("==", ("id", "x"), one),
            ("block", [("decl", "int", "y", one), ("=", ("id", "x"), ("id", "y"))]),
            ("block", [("decl", "bool", "y", ("bool", True)), ("=", ("id", "x"), ("num", 2))]))
    assert check(good, S6)                  # 두 블록의 y는 서로 다른 스코프라 겹치지 않는다
    assert not ok(S6.lookup, "y")           # 블록 밖에서는 y가 보이지 않는다
    bad = ("if", ("==", ("id", "x"), one), ("block", [("=", ("id", "x"), one)]),
           ("block", [("=", ("id", "x"), ("bool", True))]))
    assert not ok(check, bad, S6)           # else 쪽 한 문장만 틀려도 전체가 WF가 아니다
    assert not ok(check, ("if", ("id", "x"), ("block", []), ("block", [])), S6)   # 조건이 int

    # 자동 변환은 없다: int + double 에 맞는 규칙이 없다 (L01 p.13의 inttofloat는 이 규칙들 밖이다)
    S7 = Scope()
    S7.declare("B", "double")
    S7.declare("C", "int")
    S7.declare("A", "double")
    assert not ok(type_of, ("+", ("id", "B"), ("id", "C")), S7)
    assert not ok(check, ("=", ("id", "A"), ("+", ("id", "B"), ("id", "C"))), S7)

    # 원본 오류 의심: p.24의 대입 규칙은 e2가 '변수 또는 상수'여야 한다고 적었다.
    # 그대로면 p.35에서 통과시킨 a = a + 1 (e2가 식)이 떨어진다.
    def assign_p24(s, S):
        return s[2][0] in ("id", "num", "dbl", "str", "bool") and ok(check, s, S)
    assert assign_p24(("=", a, ("num", 3)), S) and not assign_p24(("=", a, ("+", a, one)), S)
    assert ok(check, ("=", a, ("+", a, one)), S)

    # 연습 문서와 카드의 답
    T = Scope()
    for n, t in (("i", "int"), ("n", "int"), ("d", "double"), ("flag", "bool"), ("arr", "int[]")):
        T.declare(n, t)
    T.declare("f", ("fn", ("int", "bool"), "double"))
    assert type_of(("<=", ("id", "i"), ("id", "n")), T) == "bool"
    assert type_of(("index", ("id", "arr"), ("+", ("id", "i"), one)), T) == "int"
    assert type_of(("call", "f", [("id", "i"), ("id", "flag")]), T) == "double"
    assert not ok(type_of, ("call", "f", [("id", "i")]), T)                      # 인자 수
    assert not ok(type_of, ("call", "f", [("id", "flag"), ("id", "i")]), T)      # 인자 타입
    assert not ok(type_of, ("index", ("id", "arr"), ("id", "d")), T)             # 첨자가 double
    assert not ok(type_of, ("index", ("id", "i"), one), T)                       # 배열이 아니다
    assert not ok(type_of, ("+", ("id", "flag"), ("id", "flag")), T)             # bool + bool
    assert type_of(("==", ("id", "flag"), ("bool", True)), T) == "bool"
    assert not ok(type_of, ("==", ("id", "i"), ("id", "d")), T)                  # T가 서로 다르다
    log = []
    loop = ("while", ("<=", ("id", "i"), ("id", "n")),
            ("block", [("=", ("id", "d"), ("call", "f", [("id", "i"), ("id", "flag")])),
                       ("=", ("id", "i"), ("+", ("id", "i"), one))]))
    assert check(loop, T, log)
    assert [x for x in log if x[1] in ("WF", "bool", "double")] == [
        ("<=", "bool"), ("cond", "bool"), ("d", "double"), ("flag", "bool"), ("f()", "double"),
        ("=", "WF"), ("=", "WF"), ("block", "WF"), ("while", "WF")]
    assert len(log) == 16
    # while (i) { ... } : 조건이 int라 오류. while 안에서 선언한 변수는 밖에서 안 보인다
    assert not ok(check, ("while", ("id", "i"), ("block", [])), T)
    assert check(("while", ("id", "flag"), ("block", [("decl", "int", "tmp", one)])), T)
    assert not ok(T.lookup, "tmp")
    assert not ok(type_of, ("+", ("id", "x"), ("num", 3)), T)                    # x는 자유 변수

    print("ALL CHECKS PASSED")
```
{% endraw %}
