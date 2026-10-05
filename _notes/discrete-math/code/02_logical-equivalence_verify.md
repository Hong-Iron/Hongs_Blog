---
layout: "note"
title: "02_logical-equivalence_verify.py"
display_title: "02_logical-equivalence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/logical-equivalence/"
parent_title: "논리적 동치와 정규형"
description: "이산수학 · 논리적 동치와 정규형 검증 코드"
permalink: "/studies/discrete-math/code/02_logical-equivalence_verify/"
---
{% raw %}
[논리적 동치와 정규형](/Hongs_Blog/studies/discrete-math/logical-equivalence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""논리적 동치와 정규형 검증.

문서: 02.논리적 동치와 정규형 (정리, 증명, 예제, 카드 C1~C4, 자주 하는 오해)
주장 1: 동치 법칙 표의 모든 식을 진리표 전수로 확인한다(증명: 변수 n개면 2^n행을 모두 보는 것이 곧 증명).
주장 2: p → q ≡ ¬p ∨ q ≡ ¬q → ¬p, 그러나 역 q → p, 이 ¬p → ¬q와는 동치가 아니다(반례 p = F, q = T).
주장 3: ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q.
주장 4: 진리표에서 만든 DNF와 CNF는 원래 함수와 같다 (변수 1~4개의 무작위 함수 2,000개).
주장 5: 3입력 다수결 함수 = (p∧q) ∨ (p∧r) ∨ (q∧r).
주장 6: not (a and not b)  ==  (not a) or b.
"""
from itertools import product
import random

B = [True, False]
IMP = lambda p, q: (not p) or q


def equiv(f, g, n):
    return all(f(*v) == g(*v) for v in product(B, repeat=n))


def main():
    laws = [
        (lambda p: not (not p), lambda p: p, 1),
        (lambda p, q: not (p and q), lambda p, q: (not p) or (not q), 2),
        (lambda p, q: not (p or q), lambda p, q: (not p) and (not q), 2),
        (lambda p, q, r: p and (q or r), lambda p, q, r: (p and q) or (p and r), 3),
        (lambda p, q, r: p or (q and r), lambda p, q, r: (p or q) and (p or r), 3),
        (lambda p, q: p or (p and q), lambda p, q: p, 2),
        (lambda p, q: p and (p or q), lambda p, q: p, 2),
        (lambda p: p or (not p), lambda p: True, 1),
        (lambda p: p and (not p), lambda p: False, 1),
        (lambda p, q: IMP(p, q), lambda p, q: (not p) or q, 2),
        (lambda p, q: not IMP(p, q), lambda p, q: p and not q, 2),
        (lambda p, q: p == q, lambda p, q: IMP(p, q) and IMP(q, p), 2),
    ]
    for f, g, n in laws:
        assert equiv(f, g, n)
    print(f"[OK] 주장 1·카드 C1: 동치 법칙 {len(laws)}개 진리표 전수")

    assert equiv(lambda p, q: IMP(p, q), lambda p, q: IMP(not q, not p), 2)
    assert not equiv(lambda p, q: IMP(p, q), lambda p, q: IMP(q, p), 2)
    assert not equiv(lambda p, q: IMP(p, q), lambda p, q: IMP(not p, not q), 2)
    assert IMP(False, True) and not IMP(True, False)
    assert equiv(lambda p, q: IMP(q, p), lambda p, q: IMP(not p, not q), 2)
    print("[OK] 주장 2·카드 C2·C4: 대우는 동치, 역·이는 아님(서로는 동치)")

    assert equiv(lambda p, q: not (p or ((not p) and q)), lambda p, q: (not p) and (not q), 2)
    print("[OK] 주장 3·카드 C3")

    rng = random.Random(2)
    for _ in range(2000):
        n = rng.randint(1, 4)
        truth = {v: rng.random() < 0.5 for v in product(B, repeat=n)}
        dnf_terms = [v for v, t in truth.items() if t]
        cnf_clauses = [v for v, t in truth.items() if not t]
        dnf = lambda *x: any(all(xi == vi for xi, vi in zip(x, v)) for v in dnf_terms)
        cnf = lambda *x: all(any(xi != vi for xi, vi in zip(x, v)) for v in cnf_clauses)
        assert all(dnf(*v) == truth[v] == cnf(*v) for v in truth)
    print("[OK] 주장 4: 무작위 불 함수 2,000개에서 DNF·CNF 구성")

    maj = lambda p, q, r: (p + q + r) >= 2
    assert equiv(maj, lambda p, q, r: (p and q) or (p and r) or (q and r), 3)
    print("[OK] 주장 5: 다수결 함수")

    assert equiv(lambda a, b: not (a and not b), lambda a, b: (not a) or b, 2)
    print("[OK] 주장 6: 조건문 단순화")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
