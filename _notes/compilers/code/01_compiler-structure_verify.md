---
layout: "note"
title: "01_compiler-structure_verify.py"
display_title: "01_compiler-structure_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/compiler-structure/"
parent_title: "컴파일러의 구조"
description: "컴파일러 · 컴파일러의 구조 검증 코드"
permalink: "/studies/compilers/code/01_compiler-structure_verify/"
---
{% raw %}
[컴파일러의 구조](/Hongs_Blog/studies/compilers/compiler-structure/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컴파일러의 구조: 슬라이드 L01 p.11~16의 예(A = B + C)를 단계마다 실행해, 모든 단계의 결과가 같은 값을 내는지 확인한다
# 실행: python3 01_compiler-structure_verify.py   (표준 라이브러리만 쓴다)
# 슬라이드에는 B와 C의 타입이 적혀 있지 않다. inttofloat(C)가 붙었으므로 C는 정수, A와 B는 실수로 두었다.
import random


def run_tree(tree, env):
    """구문 트리를 아래에서 위로 계산한다. 트리는 (연산, 왼쪽, 오른쪽) 또는 변수 이름이다."""
    if isinstance(tree, str):
        return env[tree]
    op = tree[0]
    if op == "inttofloat":
        return float(run_tree(tree[1], env))
    if op == "+":
        return run_tree(tree[1], env) + run_tree(tree[2], env)
    if op == "=":
        env[tree[1]] = run_tree(tree[2], env)
        return env[tree[1]]


def run_tac(lines, env):
    """3주소 코드 한 줄은 (받는 곳, 연산, 인자들)이다."""
    env = dict(env)
    for dst, op, *args in lines:
        vals = [env[a] for a in args]
        env[dst] = float(vals[0]) if op == "inttofloat" else vals[0] + vals[1] if op == "+" else vals[0]
    return env


def run_machine(lines, memory):
    """슬라이드 p.16의 네 명령만 아는 흉내기. LDF 레지스터, 변수 / ADDF 받는 곳, 왼쪽, 오른쪽 / STF 변수, 레지스터."""
    memory, reg = dict(memory), {}
    for op, *args in lines:
        if op == "LDF":
            reg[args[0]] = float(memory[args[1]])
        elif op == "ADDF":
            reg[args[0]] = reg[args[1]] + reg[args[2]]
        elif op == "STF":
            memory[args[0]] = reg[args[1]]
    return memory


TOKENS = ["A", "=", "B", "+", "C"]                                   # p.11
TREE = ("=", "A", ("+", "B", "C"))                                   # p.12
TREE_TYPED = ("=", "A", ("+", "B", ("inttofloat", "C")))             # p.13
TAC = [("t1", "inttofloat", "C"), ("t2", "+", "t1", "B"), ("A", "copy", "t2")]     # p.14
TAC_OPT = [("t1", "inttofloat", "C"), ("A", "+", "t1", "B")]                       # p.15
MACHINE = [("LDF", "R2", "C"), ("LDF", "R1", "B"), ("ADDF", "R1", "R1", "R2"), ("STF", "A", "R1")]   # p.16

if __name__ == "__main__":
    assert "".join(TOKENS) == "A=B+C" and len(TOKENS) == 5
    rng = random.Random(1)
    for _ in range(1000):
        env = {"B": rng.uniform(-100, 100), "C": rng.randint(-100, 100)}
        want = env["B"] + env["C"]
        a1 = run_tree(TREE, dict(env))
        a2 = run_tree(TREE_TYPED, dict(env))
        a3 = run_tac(TAC, env)["A"]
        a4 = run_tac(TAC_OPT, env)["A"]
        a5 = run_machine(MACHINE, env)["A"]
        assert a1 == a2 == a3 == a4 == a5 == want
    # 문서의 수치 예: B = 1.5, C = 2
    env = {"B": 1.5, "C": 2}
    assert run_tac(TAC, env) == {"B": 1.5, "C": 2, "t1": 2.0, "t2": 3.5, "A": 3.5}
    assert run_tac(TAC_OPT, env)["A"] == 3.5 and run_machine(MACHINE, env)["A"] == 3.5
    # 최적화는 줄 수를 3에서 2로, 임시 변수를 2개에서 1개로 줄였다
    assert (len(TAC), len(TAC_OPT)) == (3, 2)
    assert len({l[0] for l in TAC if l[0].startswith("t")}) == 2 and len({l[0] for l in TAC_OPT if l[0].startswith("t")}) == 1
    # 틀린 "최적화"의 예: inttofloat 줄까지 지우면 줄은 더 줄지만 C가 큰 정수일 때 결과의 타입이 달라진다
    wrong = [("A", "+", "C", "C")]
    assert run_tac(wrong, {"B": 1.5, "C": 2})["A"] != 3.5
    print("ALL CHECKS PASSED")
```
{% endraw %}
