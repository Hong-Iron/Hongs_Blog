---
layout: "note"
title: "12_closed-maximal_verify.py"
display_title: "12_closed-maximal_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/closed-maximal-patterns/"
parent_title: "닫힌 패턴과 최대 패턴"
description: "데이터 과학 · 닫힌 패턴과 최대 패턴 검증 코드"
permalink: "/studies/data-science/code/12_closed-maximal_verify/"
---
{% raw %}
[닫힌 패턴과 최대 패턴](/Hongs_Blog/studies/data-science/closed-maximal-patterns/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""닫힌 패턴과 최대 패턴 검증.

문서: 12.닫힌 패턴과 최대 패턴 (예시, 정의, 카드)
출처: 데이터 과학 3회 슬라이드 3-1 p.12~15
주장:
  1. 슬라이드 예(거래 2개 {a1..a50}, {a1..a100}, min_sup 1)를 작게 줄인 {a1..a3}, {a1..a6}에서
     닫힌 패턴은 {a1..a3}:2, {a1..a6}:1 두 개, 최대 패턴은 {a1..a6} 하나. 빈발 패턴은 2^6 - 1 = 63개.
  2. 닫힌 패턴과 그 지지도로 모든 빈발 패턴의 지지도를 되살릴 수 있다: sup(X) = max{sup(C) : C 닫힘, C ⊇ X}.
     최대 패턴만으로는 어떤 집합이 빈발인지는 알지만 지지도는 모른다.
  3. 빈발 ⊇ 닫힘 ⊇ 최대 (무작위 자료 200개).
"""
from itertools import combinations
import random


def mine(db, ms, items):
    res = {}
    for r in range(1, len(items) + 1):
        for c in combinations(items, r):
            n = sum(1 for t in db if set(c) <= t)
            if n >= ms:
                res[frozenset(c)] = n
    return res


def closed(freq):
    return {x: n for x, n in freq.items() if not any(x < y and freq[y] == n for y in freq)}


def maximal(freq):
    return {x: n for x, n in freq.items() if not any(x < y for y in freq)}


def main():
    a = [f"a{i}" for i in range(1, 7)]
    db = [set(a[:3]), set(a)]
    f = mine(db, 1, a)
    assert len(f) == 2 ** 6 - 1
    c = closed(f); m = maximal(f)
    assert c == {frozenset(a[:3]): 2, frozenset(a): 1} and m == {frozenset(a): 1}
    for x, n in f.items():
        assert n == max(cn for cx, cn in c.items() if cx >= x)
    print("[OK] 줄인 예: 빈발 63개, 닫힘 2개, 최대 1개. 닫힌 패턴으로 모든 지지도 복원")
    assert f[frozenset(["a1", "a2"])] == 2 and f[frozenset(["a4"])] == 1

    rnd = random.Random(2)
    for _ in range(200):
        items = list("ABCDE")
        db = [set(rnd.sample(items, rnd.randint(1, 5))) for _ in range(rnd.randint(2, 8))]
        f = mine(db, rnd.randint(1, 3), items)
        c = closed(f); m = maximal(f)
        assert set(m) <= set(c) <= set(f)
        for x, n in f.items():
            assert n == max(cn for cx, cn in c.items() if cx >= x)
    print("[OK] 무작위 자료 200개: 최대 ⊆ 닫힘 ⊆ 빈발, 닫힌 패턴으로 지지도 복원")

    # 카드 C2: 3-1 p.24 연습 1 자료(min_sup 2)의 닫힌·최대 패턴
    ex = [set("ABE"), set("ABD"), set("BC"), set("BD"), set("AC"), set("BC"), set("AC"), set("ABCE"), set("ABC")]
    f = mine(ex, 2, list("ABCDE"))
    c = closed(f); m = maximal(f)
    S = lambda s: frozenset(s)
    assert c == {S("A"): 6, S("B"): 7, S("C"): 6, S("AB"): 4, S("AC"): 4, S("BC"): 4, S("BD"): 2, S("ABC"): 2, S("ABE"): 2}
    assert m == {S("BD"): 2, S("ABC"): 2, S("ABE"): 2}
    print("[OK] 카드 C2: 빈발 13개, 닫힘 9개, 최대 3개 (BD, ABC, ABE)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
