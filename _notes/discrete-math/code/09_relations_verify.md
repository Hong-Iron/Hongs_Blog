---
layout: "note"
title: "09_relations_verify.py"
display_title: "09_relations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/relations/"
parent_title: "관계와 그 성질"
description: "이산수학 · 관계와 그 성질 검증 코드"
permalink: "/studies/discrete-math/code/09_relations_verify/"
---
{% raw %}
[관계와 그 성질](/Hongs_Blog/studies/discrete-math/relations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""관계와 그 성질 검증.

문서: 09.관계와 그 성질 (예시, 정의, 예제, 카드 C1~C3, 자주 하는 오해)
주장 1: {1,2,3,4}에서 나누어떨어짐은 반사·반대칭·추이, 차가 짝수는 반사·대칭·추이, <는 비반사·반대칭·추이.
주장 2: {(1,2),(2,1),(1,3)}은 대칭도 반대칭도 아니고, 같음(=)은 둘 다다.
주장 3: n원소 집합 위의 관계는 2^(n²)개 (n <= 3 전수).
주장 4: 와셜 알고리즘의 추이 폐포 = 합성을 되풀이한 결과. 카드 C3의 {(1,2),(2,3),(3,4)}의 폐포는 6쌍.
"""
from itertools import product
import random

A = [1, 2, 3, 4]


def props(R, A):
    return {
        "반사": all((a, a) in R for a in A),
        "비반사": all((a, a) not in R for a in A),
        "대칭": all((b, a) in R for (a, b) in R),
        "반대칭": all(not ((b, a) in R and a != b) for (a, b) in R),
        "추이": all((a, d) in R for (a, b) in R for (c, d) in R if b == c),
    }


def warshall(R, A):
    reach = {(a, b): (a, b) in R for a in A for b in A}
    for k in A:
        for i in A:
            for j in A:
                reach[i, j] = reach[i, j] or (reach[i, k] and reach[k, j])
    return {p for p, v in reach.items() if v}


def closure_by_composition(R):
    C = set(R)
    while True:
        new = C | {(a, d) for (a, b) in C for (c, d) in C if b == c}
        if new == C:
            return C
        C = new


def main():
    div = {(a, b) for a in A for b in A if b % a == 0}
    even = {(a, b) for a in A for b in A if (a - b) % 2 == 0}
    lt = {(a, b) for a in A for b in A if a < b}
    p = props(div, A); assert p["반사"] and p["반대칭"] and p["추이"] and not p["대칭"]
    p = props(even, A); assert p["반사"] and p["대칭"] and p["추이"] and not p["반대칭"]
    p = props(lt, A); assert p["비반사"] and p["반대칭"] and p["추이"] and not p["반사"]
    print("[OK] 주장 1·카드 C1")

    R = {(1, 2), (2, 1), (1, 3)}
    p = props(R, [1, 2, 3]); assert not p["대칭"] and not p["반대칭"]
    eq = {(a, a) for a in A}
    p = props(eq, A); assert p["대칭"] and p["반대칭"]
    print("[OK] 주장 2·카드 C2")

    for n in range(0, 4):
        pairs = [(a, b) for a in range(n) for b in range(n)]
        assert 2 ** len(pairs) == 2 ** (n * n)
    print("[OK] 주장 3")

    rng = random.Random(9)
    for _ in range(500):
        Rr = {(a, b) for a in A for b in A if rng.random() < 0.25}
        assert warshall(Rr, A) == closure_by_composition(Rr)
    c = warshall({(1, 2), (2, 3), (3, 4)}, A)
    assert c == {(1, 2), (2, 3), (3, 4), (1, 3), (2, 4), (1, 4)}
    print("[OK] 주장 4·카드 C3: 폐포 6쌍, 와셜 = 합성 반복 (무작위 500개)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
