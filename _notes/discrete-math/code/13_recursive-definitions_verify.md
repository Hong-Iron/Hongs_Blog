---
layout: "note"
title: "13_recursive-definitions_verify.py"
display_title: "13_recursive-definitions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/recursive-definitions/"
parent_title: "재귀적 정의와 구조적 귀납법"
description: "이산수학 · 재귀적 정의와 구조적 귀납법 검증 코드"
permalink: "/studies/discrete-math/code/13_recursive-definitions_verify/"
---
{% raw %}
[재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""재귀적 정의와 구조적 귀납법 검증.

문서: 13.재귀적 정의와 구조적 귀납법 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: 규칙(ε, (s), st)으로 만든 괄호 문자열 = 앞에서부터 셀 때 열린 수 >= 닫힌 수이고 끝에서 같은 문자열. 길이 2n인 것의 개수는 1, 1, 2, 5, 14, 42, 132 (n = 0..6).
주장 2: 규칙으로 만든 문자열은 모두 여는 괄호와 닫는 괄호의 수가 같다.
주장 3: 무작위 완전 이진 트리 3,000개에서 잎 = 내부 노드 + 1.
주장 4: 재귀 함수 leaves(t)가 정의와 같은 값을 낸다.
주장 5: 순진한 재귀 피보나치 fib(n)의 호출 수는 2·fib(n+1) - 1이다.
"""
import random
from itertools import product


def generate(max_len):
    S = {""}
    changed = True
    while changed:
        changed = False
        new = set(S)
        for s in S:
            if len(s) + 2 <= max_len:
                new.add("(" + s + ")")
        for s in S:
            for t in S:
                if len(s) + len(t) <= max_len:
                    new.add(s + t)
        if new != S:
            S, changed = new, True
    return S


def balanced(w):
    depth = 0
    for c in w:
        depth += 1 if c == "(" else -1
        if depth < 0:
            return False
    return depth == 0


def rand_tree(rng, depth=0):
    if depth > 8 or rng.random() < 0.35:
        return None  # 잎
    return (rand_tree(rng, depth + 1), rand_tree(rng, depth + 1))


def leaves(t):
    return 1 if t is None else leaves(t[0]) + leaves(t[1])


def internal(t):
    return 0 if t is None else 1 + internal(t[0]) + internal(t[1])


def main():
    S = generate(12)
    all_bal = {"".join(p) for L in range(0, 13, 2) for p in product("()", repeat=L) if balanced("".join(p))}
    assert S == all_bal
    counts = [sum(1 for s in S if len(s) == 2 * n) for n in range(7)]
    assert counts == [1, 1, 2, 5, 14, 42, 132]
    assert sorted(s for s in S if len(s) == 6) == ["((()))", "(()())", "(())()", "()(())", "()()()"]
    print("[OK] 주장 1·카드 C1: 규칙으로 만든 집합 = 균형 문자열, 개수 1,1,2,5,14,42,132")

    assert all(s.count("(") == s.count(")") for s in S)
    print("[OK] 주장 2")

    rng = random.Random(13)
    for _ in range(3000):
        t = rand_tree(rng)
        assert leaves(t) == internal(t) + 1
    print("[OK] 주장 3·4·카드 C2·C3: 잎 = 내부 + 1 (무작위 3,000개)")

    calls = 0
    def fib(n):
        nonlocal calls
        calls += 1
        return n if n < 2 else fib(n - 1) + fib(n - 2)
    F = [0, 1]
    for i in range(2, 30):
        F.append(F[-1] + F[-2])
    for n in range(0, 22):
        calls = 0
        assert fib(n) == F[n] and calls == 2 * F[n + 1] - 1
    print("[OK] 주장 5: fib(n) 호출 수 = 2·fib(n+1) - 1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
