---
layout: "note"
title: "35_type-inference-rules_verify.py"
display_title: "35_type-inference-rules_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/type-inference-rules/"
parent_title: "타입 추론 규칙"
description: "컴파일러 · 타입 추론 규칙 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/35_type-inference-rules_verify/"
---
{% raw %}
[타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 35_type-inference-rules_verify.py
# 타입 추론 규칙 문서의 예를 확인한다. 규칙을 "가정들 / 결론" 꼴 그대로 적용해 증명 나무를 만들고,
# 문서의 예(A + B, A && B, 상수, x + 3, 함수 호출, 배열)에서
# 붙는 타입과 쓰인 규칙 수를 본다. 표준 라이브러리만 쓴다.
# 식: ("int", 3) ("double", 1.5) ("string", "s") ("bool", True) ("var", "x")
#     (연산자, 왼쪽, 오른쪽) ("call", f, [식...]) ("index", 식, 식)
# 스코프 S: {변수 이름: 타입, 함수 이름: ((인자 타입들), 반환 타입)}. None이면 스코프 정보가 없다.
# 실행: python3 35_type-inference-rules_verify.py

NUMERIC = ("short", "int", "long", "float", "double")
PRIMITIVE = ("byte", "short", "int", "long", "float", "double", "char", "bool")


class NoRule(Exception):
    pass


def derive(e, S):
    """(타입, 증명 나무)를 돌려준다. 증명 나무 = (규칙 이름, 결론, [가정의 증명 나무...])."""
    k = e[0]
    if k in ("int", "double", "string", "bool"):
        return k, ("상수", "%s : %s" % (e[1], k), [])
    if k == "var":
        if S is None or e[1] not in S:
            raise NoRule("자유 변수 %s의 타입을 정할 정보가 없다" % e[1])
        return S[e[1]], ("변수", "%s : %s" % (e[1], S[e[1]]), [])
    if k == "call":
        if S is None or e[1] not in S:
            raise NoRule(e[1])
        params, ret = S[e[1]]
        if len(params) != len(e[2]):
            raise NoRule("인자 수")
        proofs = []
        for want, arg in zip(params, e[2]):
            t, p = derive(arg, S)
            if t != want:
                raise NoRule("인자 타입")
            proofs.append(p)
        return ret, ("함수 호출", "%s(...) : %s" % (e[1], ret), proofs)
    t1, p1 = derive(e[1], S)
    t2, p2 = derive(e[2], S)
    if k == "index":
        if t1.endswith("[]") and t2 == "int":
            return t1[:-2], ("배열", "e1[e2] : %s" % t1[:-2], [p1, p2])
    elif k == "+":
        if t1 == t2 and t1 in NUMERIC:
            return t1, ("덧셈", "e1 + e2 : %s" % t1, [p1, p2])
    elif k == "&&":
        if t1 == t2 == "bool":
            return "bool", ("논리곱", "e1 && e2 : bool", [p1, p2])
    elif k in ("==", "!=", "<=", ">="):
        if t1 == t2 and t1 in PRIMITIVE:
            return "bool", ("비교", "e1 %s e2 : bool" % k, [p1, p2])
    raise NoRule("%s %s %s" % (t1, k, t2))


def size(proof):
    return 1 + sum(size(p) for p in proof[2])


def typed(e, S):
    try:
        return derive(e, S)[0]
    except NoRule:
        return None


if __name__ == "__main__":
    var = lambda n: ("var", n)

    # A, B가 int면 A + B는 int
    assert typed(("+", var("A"), var("B")), {"A": "int", "B": "int"}) == "int"
    # A가 bool, B가 int면 A && B에 맞는 규칙이 없다
    assert typed(("&&", var("A"), var("B")), {"A": "bool", "B": "int"}) is None
    assert typed(("&&", var("A"), var("B")), {"A": "bool", "B": "bool"}) == "bool"

    # 공리와 상수 규칙은 스코프 정보 없이도 쓸 수 있다
    assert typed(("bool", True), None) == "bool" and typed(("bool", False), None) == "bool"
    assert typed(("int", 1), None) == "int" and typed(("int", 1000), None) == "int"
    assert typed(("string", "hi"), None) == "string" and typed(("double", 2.5), None) == "double"
    # 덧셈은 T가 short, int, long, float, double일 때만. 두 쪽의 T가 같아야 한다
    for T in NUMERIC:
        assert typed(("+", var("p"), var("q")), {"p": T, "q": T}) == T
    for T in ("bool", "char", "string", "byte"):
        assert typed(("+", var("p"), var("q")), {"p": T, "q": T}) is None
    assert typed(("+", ("int", 1), ("double", 2.0)), None) is None
    # 비교는 원시 타입 T가 같을 때 bool
    for op in ("==", "!=", "<=", ">="):
        for T in PRIMITIVE:
            assert typed((op, var("p"), var("q")), {"p": T, "q": T}) == "bool"
        assert typed((op, var("p"), var("q")), {"p": "int", "q": "double"}) is None
        assert typed((op, var("p"), var("q")), {"p": "string", "q": "string"}) is None

    # 스코프 정보가 없으면 x + 3의 x는 자유 변수라 타입을 못 정한다
    assert typed(("+", var("x"), ("int", 3)), None) is None
    # 스코프 정보를 주면 정해진다. 같은 식이 스코프에 따라 다른 답을 낸다
    assert typed(("+", var("x"), ("int", 3)), {"x": "int"}) == "int"
    assert typed(("+", var("x"), ("int", 3)), {"x": "double"}) is None
    assert typed(("+", var("x"), ("int", 3)), {"x": "bool"}) is None

    # 함수 호출과 배열
    S = {"f": (("int", "bool"), "double"), "a": "int[]", "i": "int", "ok": "bool", "d": "double"}
    assert typed(("call", "f", [var("i"), var("ok")]), S) == "double"
    assert typed(("call", "f", [var("ok"), var("i")]), S) is None
    assert typed(("call", "f", [var("i")]), S) is None
    assert typed(("index", var("a"), var("i")), S) == "int"
    assert typed(("index", var("a"), var("d")), S) is None
    assert typed(("index", var("i"), var("i")), S) is None

    # 증명 나무: x + 3 == y  (x, y가 int) 는 규칙 다섯 번
    t, proof = derive(("==", ("+", var("x"), ("int", 3)), var("y")), {"x": "int", "y": "int"})
    assert t == "bool" and size(proof) == 5
    assert proof[0] == "비교" and proof[2][0][0] == "덧셈" and proof[2][1][0] == "변수"
    assert [p[0] for p in proof[2][0][2]] == ["변수", "상수"]
    # 규칙 수 = 식 나무의 노드 수
    t, proof = derive(("+", ("index", var("a"), var("i")), ("int", 1)), S)
    assert t == "int" and size(proof) == 5
    # 카드: f(a[i], i == 1) + d
    t, proof = derive(("+", ("call", "f", [("index", var("a"), var("i")), ("==", var("i"), ("int", 1))]), var("d")), S)
    assert t == "double" and size(proof) == 9
    # 카드: (1 == 2) && (x <= 3), x가 int
    assert typed(("&&", ("==", ("int", 1), ("int", 2)), ("<=", var("x"), ("int", 3))), {"x": "int"}) == "bool"
    assert typed(("==", ("&&", ("bool", True), ("bool", False)), ("int", 1)), None) is None

    print("ALL CHECKS PASSED")
```
{% endraw %}
