---
layout: "note"
title: "13_apriori-ladder_p4.py"
display_title: "13_apriori-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "13"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/apriori-ladder/"
parent_title: "Apriori 예제 사다리"
description: "데이터 과학 · Apriori 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-science/code/13_apriori-ladder_p4/"
---
{% raw %}
[Apriori 예제 사다리](/Hongs_Blog/studies/data-science/apriori-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""Apriori 예제 사다리 문제 2~4 검증 (문제 1은 13_apriori_impl.py가 확인한다).

문서: 4.연습문제/13.Apriori 예제 사다리
문제 2: ABC, AB, AC, BC, ABCD (min_sup 3)
문제 3: 3-1 p.24 연습 1 (min_sup 2) — 13_apriori_impl.py와 같은 결과를 여기서도 계산한다
문제 4: 영수증 5장 (맥주·견과·기저귀 / 맥주·커피·기저귀 / 맥주·기저귀·달걀 / 견과·달걀·우유 / 견과·커피·기저귀·달걀·우유),
        min_sup 2, 가장 긴 빈발 집합에서 min_conf 60% 규칙
Apriori 구현은 3.개념집/13_apriori_impl.py에서 필요한 부분을 복사했다.
"""
from itertools import combinations


def apriori(db, ms):
    db = [frozenset(t) for t in db]
    C = {frozenset([i]) for t in db for i in t}; k = 1; res = {}; log = []
    while C:
        cnt = {c: sum(1 for t in db if c <= t) for c in C}
        L = {c: n for c, n in cnt.items() if n >= ms}
        log.append((k, cnt, L)); res.update(L)
        items = sorted(tuple(sorted(x)) for x in L); nxt = set()
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i], items[j]
                if a[:k - 1] == b[:k - 1] and a[k - 1] < b[k - 1]:
                    c = frozenset(a) | frozenset(b)
                    if all(frozenset(s) in L for s in combinations(sorted(c), k)):
                        nxt.add(c)
        C = nxt; k += 1
    return res, log


def S(*x):
    return frozenset(x)


def main():
    f2, log2 = apriori([set("ABC"), set("AB"), set("AC"), set("BC"), set("ABCD")], 3)
    assert log2[0][1] == {S("A"): 4, S("B"): 4, S("C"): 4, S("D"): 1}
    assert log2[1][1] == {S("A", "B"): 3, S("A", "C"): 3, S("B", "C"): 3}
    assert log2[2][1] == {S("A", "B", "C"): 2} and log2[2][2] == {}
    print("[OK] 문제 2: L1 = A,B,C (D 1), L2 = AB3 AC3 BC3, C3 = ABC 2 -> L3 없음")

    ex = [set("ABE"), set("ABD"), set("BC"), set("BD"), set("AC"), set("BC"), set("AC"), set("ABCE"), set("ABC")]
    f3, log3 = apriori(ex, 2)
    assert set(log3[1][2]) == {S("A", "B"), S("A", "C"), S("A", "E"), S("B", "C"), S("B", "D"), S("B", "E")}
    assert set(log3[2][1]) == {S("A", "B", "C"), S("A", "B", "E")}
    print("[OK] 문제 3: L2 6개, C3 = ABC, ABE")

    db4 = [{"Beer", "Nuts", "Diaper"}, {"Beer", "Coffee", "Diaper"}, {"Beer", "Diaper", "Eggs"},
           {"Nuts", "Eggs", "Milk"}, {"Nuts", "Coffee", "Diaper", "Eggs", "Milk"}]
    f4, log4 = apriori(db4, 2)
    L2 = {tuple(sorted(c)): n for c, n in log4[1][2].items()}
    assert L2 == {("Beer", "Diaper"): 3, ("Coffee", "Diaper"): 2, ("Diaper", "Eggs"): 2, ("Diaper", "Nuts"): 2,
                  ("Eggs", "Milk"): 2, ("Eggs", "Nuts"): 2, ("Milk", "Nuts"): 2}
    C3 = {tuple(sorted(c)): n for c, n in log4[2][1].items()}
    assert C3 == {("Diaper", "Eggs", "Nuts"): 1, ("Eggs", "Milk", "Nuts"): 2}
    L3 = {tuple(sorted(c)): n for c, n in log4[2][2].items()}
    assert L3 == {("Eggs", "Milk", "Nuts"): 2}
    assert len(log4) == 3 or log4[3][2] == {}
    l = S("Eggs", "Milk", "Nuts")
    rules = {}
    for r in (1, 2):
        for s in combinations(sorted(l), r):
            rules[s] = f4[l] / f4[frozenset(s)]
    strong = {s: round(c, 3) for s, c in rules.items() if c >= 0.6}
    assert strong == {("Eggs", "Milk"): 1.0, ("Eggs", "Nuts"): 1.0, ("Milk",): 1.0, ("Milk", "Nuts"): 1.0,
                      ("Eggs",): 0.667, ("Nuts",): 0.667}
    print("[OK] 문제 4: L2 7개, L3 = {달걀, 우유, 견과}:2, 60% 이상 규칙 6개 모두")
    print("     규칙 신뢰도:", {"+".join(k): round(v, 3) for k, v in rules.items()})
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
