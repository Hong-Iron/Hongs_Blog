---
layout: "note"
title: "01_propositional-logic_verify.py"
display_title: "01_propositional-logic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/propositional-logic/"
parent_title: "명제와 논리 연산"
description: "이산수학 · 명제와 논리 연산 검증 코드"
permalink: "/studies/discrete-math/code/01_propositional-logic_verify/"
---
{% raw %}
[명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""명제와 논리 연산 검증.

문서: 01.명제와 논리 연산 (예시, 정의, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: 연결사의 진리표 (¬, ∧, ∨, →, ↔, ⊕). p → q는 p가 거짓이면 늘 참이다.
주장 2: (p → q) ∧ (q → p)의 진리표는 p ↔ q와 같다.
주장 3: 로그인 조건 (맞음 ∧ 활성) ∨ 관리자의 진리표 8행 중 참은 5행이다.
주장 4: 파이썬 and/or는 단락 평가를 한다: False and f()에서 f는 호출되지 않는다.
주장 5: ⊕(배타적 또는)는 ∨와 p = q = 참인 행에서만 다르다.
"""
from itertools import product

NOT = lambda p: not p
AND = lambda p, q: p and q
OR = lambda p, q: p or q
IMP = lambda p, q: (not p) or q
IFF = lambda p, q: p == q
XOR = lambda p, q: p != q


def main():
    table = {(p, q): IMP(p, q) for p, q in product([True, False], repeat=2)}
    assert table == {(True, True): True, (True, False): False, (False, True): True, (False, False): True}
    print("[OK] 주장 1·카드 C1: → 진리표 (거짓인 경우는 p 참, q 거짓뿐)")

    assert all(AND(IMP(p, q), IMP(q, p)) == IFF(p, q) for p, q in product([True, False], repeat=2))
    print("[OK] 주장 2: (p→q)∧(q→p) = p↔q")

    rows = [(a, b, c) for a, b, c in product([True, False], repeat=3) if OR(AND(a, b), c)]
    assert len(rows) == 5
    print("[OK] 주장 3: 로그인 조건 참인 행 5개")

    called = []
    def f():
        called.append(1); return True
    _ = False and f()
    _ = True or f()
    assert called == []
    _ = True and f()
    assert called == [1]
    print("[OK] 주장 4: 단락 평가")

    diff = [(p, q) for p, q in product([True, False], repeat=2) if XOR(p, q) != OR(p, q)]
    assert diff == [(True, True)]
    print("[OK] 주장 5·카드 C3: ⊕와 ∨는 둘 다 참인 행에서만 다름")

    # 카드 C2: p = 비가 온다(거짓), q = 소풍 간다(참)일 때 ¬p → q는 참, p = 참, q = 거짓이면 ¬p → q는 참
    assert IMP(NOT(False), True) is True and IMP(NOT(True), False) is True and IMP(NOT(False), False) is False
    print("[OK] 카드 C2: ¬p → q는 비가 안 오는데 소풍을 안 갈 때만 거짓")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
