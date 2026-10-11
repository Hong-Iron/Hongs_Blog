---
layout: "note"
title: "02_compilation-vs-interpretation_verify.py"
display_title: "02_compilation-vs-interpretation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/compilation-vs-interpretation/"
parent_title: "컴파일과 인터프리트 비교"
description: "컴파일러 · 컴파일과 인터프리트 비교 검증 코드"
permalink: "/studies/compilers/code/02_compilation-vs-interpretation_verify/"
---
{% raw %}
[컴파일과 인터프리트 비교](/Hongs_Blog/studies/compilers/compilation-vs-interpretation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컴파일과 인터프리트 비교: "언제, 얼마만큼 번역하는가"(슬라이드 L01 p.5)를 작은 장난감 언어로 세어 본다
# 실행: python3 02_compilation-vs-interpretation_verify.py   (표준 라이브러리만 쓴다)
# 장난감 언어: 한 줄에 문장 하나. "x = 식", "print 식", "repeat n" ... "end".
# 번역 = 문장의 글자를 읽어 파이썬 함수 하나로 바꾸는 일. 번역 횟수를 센다.

PROGRAM = """total = 0
repeat 1000
total = total + 2
end
print total"""

BROKEN = """print 1
print 2
x = = 3
print 4"""


class Counter:
    def __init__(self):
        self.translations = 0


def translate(line, counter):
    """문장 하나를 번역한다. 문법이 틀리면 SyntaxError."""
    counter.translations += 1
    if line.startswith("print "):
        code = compile(line[6:], "<toy>", "eval")
        return lambda env, out: out.append(eval(code, {}, env))
    name, _, expr = line.partition(" = ")
    if not name.isidentifier():
        raise SyntaxError(line)
    code = compile(expr, "<toy>", "eval")
    return lambda env, out: env.__setitem__(name, eval(code, {}, env))


def interpret(source):
    """실행하려는 문장을 그때마다 번역해 바로 실행한다."""
    lines, counter, env, out = source.split("\n"), Counter(), {}, []
    def block(i):
        while i < len(lines) and lines[i] != "end":
            if lines[i].startswith("repeat "):
                n = int(lines[i].split()[1])
                for _ in range(n):
                    j = block(i + 1)
                i = j + 1
            else:
                translate(lines[i], counter)(env, out)
                i += 1
        return i
    try:
        block(0)
        error = None
    except SyntaxError as e:
        error = str(e)
    return out, counter.translations, error


def compile_program(source):
    """프로그램 전체를 먼저 번역해 둔다. 틀린 줄이 있으면 실행할 것을 만들지 않는다."""
    lines, counter = source.split("\n"), Counter()
    def block(i):
        ops = []
        while i < len(lines) and lines[i] != "end":
            if lines[i].startswith("repeat "):
                n = int(lines[i].split()[1])
                body, j = block(i + 1)
                ops.append(("repeat", n, body))
                i = j + 1
            else:
                ops.append(("stmt", translate(lines[i], counter)))
                i += 1
        return ops, i
    try:
        target, _ = block(0)
    except SyntaxError as e:
        return None, counter.translations, str(e)
    return target, counter.translations, None


def run_target(target):
    env, out = {}, []
    def go(ops):
        for op in ops:
            if op[0] == "repeat":
                for _ in range(op[1]):
                    go(op[2])
            else:
                op[1](env, out)
    go(target)
    return out


if __name__ == "__main__":
    # 같은 프로그램, 같은 출력
    out_i, n_i, err_i = interpret(PROGRAM)
    target, n_c, err_c = compile_program(PROGRAM)
    assert err_i is None and err_c is None
    assert out_i == run_target(target) == [2000]
    # 번역 횟수: 인터프리트는 실행한 문장 수만큼(1 + 1000 + 1), 컴파일은 문장 수만큼(3)
    assert n_i == 1002 and n_c == 3
    # 번역해 둔 것은 다시 번역하지 않고 몇 번이고 돌릴 수 있다
    assert run_target(target) == [2000] and run_target(target) == [2000]
    # 틀린 줄이 있을 때: 인터프리트는 그 줄 앞까지 실행하고 멈춘다. 컴파일은 아무것도 실행하지 않는다
    out_i, _, err_i = interpret(BROKEN)
    target, _, err_c = compile_program(BROKEN)
    assert out_i == [1, 2] and err_i is not None
    assert target is None and err_c is not None
    print("ALL CHECKS PASSED")
```
{% endraw %}
