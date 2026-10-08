---
layout: "note"
title: "14_eclat_impl.py"
display_title: "14_eclat_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "14"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/eclat/"
parent_title: "ECLAT"
description: "데이터 과학 · ECLAT 구현 코드"
permalink: "/studies/data-science/code/14_eclat_impl/"
---
{% raw %}
[ECLAT](/Hongs_Blog/studies/data-science/eclat/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ECLAT(수직 데이터 형식) 구현과 자체 테스트.

문서: 14.ECLAT (예시, 의사코드, 카드)
출처: 데이터 과학 3회 슬라이드 3-1 p.27~28
입력: 거래 목록 {TID: 항목 집합}, 최소 지지 개수 min_sup.
방법: 항목마다 그 항목이 든 거래 번호 집합(TID 목록)을 만들고(DB 한 번 훑기),
      같은 앞부분을 가진 집합끼리 TID 목록의 교집합으로 지지 개수를 구하며 깊이 우선으로 늘린다.
검사: 슬라이드 수직 표, 2·3항목 결과, 무작위 자료 300개에서 무식한 방법과 같음.
"""
from itertools import combinations
import random

H = {10: "ABE", 20: "ABD", 30: "BC", 40: "BD", 50: "AC", 60: "BC", 70: "AC", 80: "ABCE", 90: "ABC"}


def vertical(db):
    v = {}
    for tid, items in db.items():
        for i in items:
            v.setdefault(i, set()).add(tid)
    return v


def eclat(db, min_sup):
    v = vertical(db)
    res = {}

    def grow(prefix_items):
        # prefix_items: [(항목 집합, TID 집합)] 같은 앞부분을 가진 빈발 집합들
        for i, (a, ta) in enumerate(prefix_items):
            res[a] = len(ta)
            nxt = []
            for b, tb in prefix_items[i + 1:]:
                t = ta & tb
                if len(t) >= min_sup:
                    nxt.append((a | b, t))
            if nxt:
                grow(nxt)

    start = sorted((frozenset([i]), t) for i, t in v.items() if len(t) >= min_sup)
    start.sort(key=lambda x: sorted(x[0]))
    grow(start)
    return res, v


def brute(db, min_sup):
    items = sorted({i for t in db.values() for i in t}); res = {}
    for r in range(1, len(items) + 1):
        for c in combinations(items, r):
            n = sum(1 for t in db.values() if set(c) <= set(t))
            if n >= min_sup:
                res[frozenset(c)] = n
    return res


def main():
    f, v = eclat(H, 2)
    assert {i: sorted(t) for i, t in v.items()} == {
        "A": [10, 20, 50, 70, 80, 90], "B": [10, 20, 30, 40, 60, 80, 90], "C": [30, 50, 60, 70, 80, 90],
        "D": [20, 40], "E": [10, 80]}
    print("[OK] p.27 수직 형식: A 6개, B 7개, C 6개, D 2개, E 2개 TID")
    S = lambda s: frozenset(s)
    assert sorted(v["A"] & v["B"]) == [10, 20, 80, 90] and sorted(v["A"] & v["C"]) == [50, 70, 80, 90]
    assert sorted(v["A"] & v["B"] & v["C"]) == [80, 90] and sorted(v["A"] & v["B"] & v["E"]) == [10, 80]
    assert not (v["C"] & v["D"]) and sorted(v["C"] & v["E"]) == [80]
    two = {k: n for k, n in f.items() if len(k) == 2}; three = {k: n for k, n in f.items() if len(k) == 3}
    assert two == {S("AB"): 4, S("AC"): 4, S("AE"): 2, S("BC"): 4, S("BD"): 2, S("BE"): 2}
    assert three == {S("ABC"): 2, S("ABE"): 2}
    print("[OK] p.28: 2항목 AB4 AC4 AE2 BC4 BD2 BE2, 3항목 ABC2 ABE2")
    assert f == brute(H, 2)

    rnd = random.Random(3)
    for _ in range(300):
        db = {10 * (k + 1): "".join(rnd.sample("ABCDEFG", rnd.randint(1, 5))) for k in range(rnd.randint(3, 12))}
        ms = rnd.randint(1, 4)
        assert eclat(db, ms)[0] == brute(db, ms)
    print("[OK] 무작위 자료 300개: 무식한 방법과 같다")

    # 카드 C3: TID 목록의 크기 합 = 전체 항목 등장 수. 거래 9개, 항목 등장 23번
    assert sum(len(t) for t in v.values()) == sum(len(x) for x in H.values()) == 23
    print("[OK] 카드 C3: 수직 형식 TID 수 합 23 = 거래 속 항목 등장 수")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
