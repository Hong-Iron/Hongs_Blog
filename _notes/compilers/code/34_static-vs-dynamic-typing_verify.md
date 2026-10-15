---
layout: "note"
title: "34_static-vs-dynamic-typing_verify.py"
display_title: "34_static-vs-dynamic-typing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/static-vs-dynamic-typing/"
parent_title: "정적 타입과 동적 타입 비교"
description: "컴파일러 · 정적 타입과 동적 타입 비교 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/34_static-vs-dynamic-typing_verify/"
---
{% raw %}
[정적 타입과 동적 타입 비교](/Hongs_Blog/studies/compilers/static-vs-dynamic-typing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 34_static-vs-dynamic-typing_verify.py
# 정적 타입과 동적 타입 비교 문서의 예를 확인한다. 문서의 a = 3; a = "ok"; 를
# (가) 동적 타입 언어인 파이썬에서 실제로 돌리고, (나) 선언된 타입을 미리 보는 작은 정적 검사기에 넣는다.
# 표준 라이브러리만 쓴다.
# 실행: python3 34_static-vs-dynamic-typing_verify.py


def static_check(program):
    """program: ("decl", 타입, 이름, 값) 또는 ("assign", 이름, 값)의 목록.
    실행하지 않고 선언된 타입만 보고 틀린 줄 번호들을 돌려준다."""
    kind = {int: "int", str: "string", bool: "bool", float: "double"}
    declared, errors = {}, []
    for no, stmt in enumerate(program, 1):
        if stmt[0] == "decl":
            declared[stmt[2]] = stmt[1]
            if kind[type(stmt[3])] != stmt[1]:
                errors.append(no)
        else:
            if stmt[1] not in declared or kind[type(stmt[2])] != declared[stmt[1]]:
                errors.append(no)
    return errors


def risky(flag):
    if flag:
        return 1 + "a"        # 이 줄에 닿아야 타입 오류가 난다
    return 0


if __name__ == "__main__":
    # (가) 동적 타입: 타입은 변수가 아니라 값에 붙는다. 같은 변수에 다른 타입의 값을 넣어도 된다
    a = 3
    assert type(a) is int
    a = "ok"
    assert type(a) is str

    # 검사는 실행 중에, 그 연산에 닿았을 때 한다
    assert risky(False) == 0                 # 틀린 줄이 있어도 그 줄을 지나지 않으면 돈다
    try:
        risky(True)
        raised = False
    except TypeError:
        raised = True
    assert raised

    # (나) 정적 타입: int a = 3; a = "ok";  실행하기 전에 둘째 줄에서 걸린다
    assert static_check([("decl", "int", "a", 3), ("assign", "a", "ok")]) == [2]
    assert static_check([("decl", "int", "a", 3), ("assign", "a", 4)]) == []
    # 지나가지 않는 줄의 오류도 잡는다(실행 경로와 상관없이 모든 줄을 본다)
    assert static_check([("decl", "int", "a", 3), ("decl", "bool", "f", False),
                         ("assign", "a", "never run")]) == [3]
    print("ALL CHECKS PASSED")
```
{% endraw %}
