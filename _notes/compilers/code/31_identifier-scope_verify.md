---
layout: "note"
title: "31_identifier-scope_verify.py"
display_title: "31_identifier-scope_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/identifier-scope/"
parent_title: "스코프"
description: "컴파일러 · 스코프 검증 코드"
permalink: "/studies/compilers/code/31_identifier-scope_verify/"
---
{% raw %}
[스코프](/Hongs_Blog/studies/compilers/identifier-scope/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 검증: 스코프 문서의 예(가장 가까운 안쪽 스코프 규칙, 정적 스코프와 동적 스코프의 차이)
# 실행: python3 31_identifier-scope_verify.py
# 작은 언어: ("decl", 이름, 값), ("print", 이름), ("block", [문장...]), ("call", 함수 이름)
# 함수는 {이름: 몸통 문장 목록}. 전역 선언은 맨 바깥 문장 목록에 둔다.


def run(globals_, funcs, main, dynamic):
    """dynamic=False면 정적 스코프(함수 몸통은 전역만 바깥으로 본다), True면 동적 스코프(부른 쪽을 바깥으로 본다)."""
    out = []
    genv = {}
    for _, name, val in globals_:
        genv[name] = val

    def lookup(chain, name):
        for env in reversed(chain):
            if name in env:
                return env[name]
        raise NameError(name)

    def exec_block(stmts, chain):
        chain = chain + [{}]
        for s in stmts:
            if s[0] == "decl":
                chain[-1][s[1]] = s[2]
            elif s[0] == "print":
                out.append(lookup(chain, s[1]))
            elif s[0] == "block":
                exec_block(s[1], chain)
            elif s[0] == "call":
                exec_block(funcs[s[1]], chain if dynamic else [genv])

    exec_block(main, [genv])
    return out


if __name__ == "__main__":
    # (1) L09 p.16: 전역 a = 2, 함수 안에서 a를 찍고, a = 3을 선언하고, 다시 찍는다 -> 2, 3
    g = [("decl", "a", 2)]
    foo = [("print", "a"), ("decl", "a", 3), ("print", "a")]
    assert run(g, {"foo": foo}, [("call", "foo")], dynamic=False) == [2, 3]

    # (2) L09 p.13: 안쪽 블록에서 같은 이름을 다시 선언하면 그 블록 안에서만 가린다
    body = [("decl", "a", 2), ("block", [("print", "a"), ("decl", "a", 3), ("print", "a")]), ("print", "a")]
    assert run([], {"foo": body}, [("call", "foo")], dynamic=False) == [2, 3, 2]

    # (3) L09 p.14의 예: foo() { int a = 3; } ... int a = 2; foo(); print(a);  두 방식 모두 2
    prog = [("decl", "a", 2), ("call", "foo"), ("print", "a")]
    f = {"foo": [("decl", "a", 3)]}
    assert run([], f, prog, dynamic=False) == [2]
    assert run([], f, prog, dynamic=True) == [2]

    # (4) 두 방식이 갈리는 예: 전역 a = 2, show()는 a를 찍고, foo()는 a = 3을 선언한 뒤 show()를 부른다
    g = [("decl", "a", 2)]
    f = {"show": [("print", "a")], "foo": [("decl", "a", 3), ("call", "show")]}
    assert run(g, f, [("call", "foo")], dynamic=False) == [2]
    assert run(g, f, [("call", "foo")], dynamic=True) == [3]
    # 부르는 자리가 바뀌면 동적 스코프의 답만 바뀐다
    assert run(g, f, [("call", "show")], dynamic=True) == [2]
    assert run(g, f, [("call", "show")], dynamic=False) == [2]
    # (5) 확인 문제 C2: 세 겹 블록에서 선언 전후로 찍히는 값
    g = [("decl", "a", 1)]
    f = {"f": [("print", "a"),
               ("block", [("decl", "a", 2), ("print", "a"),
                          ("block", [("print", "a"), ("decl", "a", 3), ("print", "a")]),
                          ("print", "a")]),
               ("print", "a")]}
    assert run(g, f, [("call", "f")], dynamic=False) == [1, 2, 2, 3, 2, 1]
    print("정적 스코프: 2, 동적 스코프: 3 (show를 foo가 부를 때)")
    print("ALL CHECKS PASSED")
```
{% endraw %}
