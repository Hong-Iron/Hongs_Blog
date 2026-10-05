---
layout: "note"
title: "10_equivalence-relations_verify.py"
display_title: "10_equivalence-relations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/equivalence-relations/"
parent_title: "동치관계와 분할"
description: "이산수학 · 동치관계와 분할 검증 코드"
permalink: "/studies/discrete-math/code/10_equivalence-relations_verify/"
---
{% raw %}
[동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""동치관계와 분할 검증.

문서: 10.동치관계와 분할 (예시, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 동치관계의 동치류는 서로 겹치지 않고 전체를 덮는다. 분할에서 만든 관계는 동치관계다. 두 변환은 서로의 역이다(무작위 1,000개).
주장 2: mod 3 합동은 정수를 세 동치류로 나눈다.
주장 3: "차가 1 이하"는 추이적이지 않다: 0~1, 1~2이지만 0과 2는 아니다.
주장 4: 유니온-파인드로 합친 결과가 같은 분할을 만든다.
주장 5: NaN은 자기 자신과 같지 않다(반사성이 깨짐). 파이썬 in은 동일성을 먼저 봐서 x in [x]는 참이다.
"""
import random


def classes(R, A):
    out = []
    for a in A:
        cls = frozenset(b for b in A if (a, b) in R)
        if cls not in out:
            out.append(cls)
    return out


def is_equiv(R, A):
    return all((a, a) in R for a in A) and all((b, a) in R for a, b in R) and all((a, d) in R for a, b in R for c, d in R if b == c)


class DSU:
    def __init__(s, n): s.p = list(range(n))
    def find(s, x):
        while s.p[x] != x:
            s.p[x] = s.p[s.p[x]]; x = s.p[x]
        return x
    def union(s, a, b): s.p[s.find(a)] = s.find(b)


def main():
    rng = random.Random(10)
    for _ in range(1000):
        n = rng.randint(1, 8)
        A = list(range(n))
        label = [rng.randint(0, 3) for _ in A]
        R = {(a, b) for a in A for b in A if label[a] == label[b]}
        assert is_equiv(R, A)
        cl = classes(R, A)
        assert set().union(*cl) == set(A) and sum(len(c) for c in cl) == n
        R2 = {(a, b) for c in cl for a in c for b in c}
        assert R2 == R
        d = DSU(n)
        for a, b in R:
            d.union(a, b)
        assert {frozenset(b for b in A if d.find(b) == d.find(a)) for a in A} == set(cl)
    print("[OK] 주장 1·4·카드 C1: 동치관계 ↔ 분할, 유니온-파인드 (무작위 1,000개)")

    Z = range(-30, 31)
    R = {(a, b) for a in Z for b in Z if (a - b) % 3 == 0}
    assert is_equiv(R, list(Z)) and len(classes(R, list(Z))) == 3
    print("[OK] 주장 2·카드 C2: mod 3의 동치류 3개")

    from itertools import product
    strings = [''.join(t) for L in range(4) for t in product("01", repeat=L)]
    sizes = {}
    for w in strings:
        sizes[w.count("1")] = sizes.get(w.count("1"), 0) + 1
    assert len(strings) == 15 and sizes == {0: 4, 1: 6, 2: 4, 3: 1}
    print("[OK] 카드 C2: 1의 개수로 나눈 동치류 4개, 크기 4, 6, 4, 1")

    close = lambda a, b: abs(a - b) <= 1
    assert close(0, 1) and close(1, 2) and not close(0, 2)
    print("[OK] 주장 3·카드 C3")

    x = float("nan")
    assert x != x and (x in [x]) and not (float("nan") in [float("nan")])
    print("[OK] 주장 5: NaN")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
