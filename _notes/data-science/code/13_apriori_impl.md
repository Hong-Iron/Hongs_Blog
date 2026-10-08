---
layout: "note"
title: "13_apriori_impl.py"
display_title: "13_apriori_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "13"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/apriori/"
parent_title: "Apriori 알고리즘"
description: "데이터 과학 · Apriori 알고리즘 구현 코드"
permalink: "/studies/data-science/code/13_apriori_impl/"
---
{% raw %}
[Apriori 알고리즘](/Hongs_Blog/studies/data-science/apriori/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""Apriori 알고리즘 구현과 자체 테스트.

문서: 13.Apriori 알고리즘 (예시, 의사코드, 실행 추적, 정확성, 카드), 11.연관 규칙(규칙 만들기),
      4.연습문제/13.Apriori 예제 사다리 (문제 1~3)
출처: 데이터 과학 3회 슬라이드 3-1 p.17~24, 3-4 풀이 p.1~2
입력: 거래 목록(각 거래는 항목 집합), 최소 지지 개수 min_sup(정수).
출력: {빈발 항목 집합(frozenset): 지지 개수}. 단계별 후보 C_k와 빈발 L_k도 기록한다.
검사: 모든 부분집합을 세는 무식한 방법과 무작위 자료 300개에서 결과가 같다.
"""
from itertools import combinations
import random


def support_counts(db, cands):
    return {c: sum(1 for t in db if c <= t) for c in cands}


def gen_candidates(Lk, k):
    """길이 k 빈발 집합 Lk로 길이 k+1 후보를 만든다. 정렬했을 때 앞 k-1개가 같은 둘을 잇고(결합),
    길이 k 부분집합 중 하나라도 빈발이 아니면 버린다(가지치기)."""
    items = sorted(tuple(sorted(x)) for x in Lk)
    out = set()
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            a, b = items[i], items[j]
            if a[:k - 1] == b[:k - 1] and a[k - 1] < b[k - 1]:
                c = frozenset(a) | frozenset(b)
                if all(frozenset(s) in Lk for s in combinations(sorted(c), k)):
                    out.add(c)
    return out


def apriori(db, min_sup, trace=None):
    db = [frozenset(t) for t in db]
    items = {frozenset([i]) for t in db for i in t}
    C = items; k = 1; result = {}; scans = 0
    while C:
        counts = support_counts(db, C); scans += 1
        L = {c: n for c, n in counts.items() if n >= min_sup}
        if trace is not None:
            trace.append((k, counts, L))
        result.update(L)
        C = gen_candidates(set(L), k); k += 1
    return result, scans


def rules(freq, itemset, min_conf):
    """빈발 집합 l의 공집합이 아닌 진부분집합 s마다 s -> l - s, 신뢰도 = sup(l) / sup(s)."""
    l = frozenset(itemset); out = []
    for r in range(1, len(l)):
        for s in combinations(sorted(l), r):
            s = frozenset(s); conf = freq[l] / freq[s]
            out.append((tuple(sorted(s)), tuple(sorted(l - s)), conf, conf >= min_conf))
    return out


def brute(db, min_sup):
    db = [frozenset(t) for t in db]
    items = sorted({i for t in db for i in t}); res = {}
    for r in range(1, len(items) + 1):
        for c in combinations(items, r):
            n = sum(1 for t in db if set(c) <= t)
            if n >= min_sup:
                res[frozenset(c)] = n
    return res


S = lambda *x: frozenset(x)
TDB = [{"A", "C", "D"}, {"B", "C", "E"}, {"A", "B", "C", "E"}, {"B", "E"}]            # 3-1 p.20
EX1 = [set("ABE"), set("ABD"), set("BC"), set("BD"), set("AC"), set("BC"), set("AC"), set("ABCE"), set("ABC")]  # 3-1 p.24


def main():
    tr = []
    f, scans = apriori(TDB, 2, tr)
    assert {k: dict(sorted(((tuple(sorted(c)), n) for c, n in cnt.items()))) for k, cnt, _ in tr}[1] == \
        {("A",): 2, ("B",): 3, ("C",): 3, ("D",): 1, ("E",): 3}
    assert set(tr[1][1]) == {S("A", "B"), S("A", "C"), S("A", "E"), S("B", "C"), S("B", "E"), S("C", "E")}
    assert tr[1][1][S("A", "B")] == 1 and tr[1][1][S("B", "E")] == 3 and tr[1][1][S("A", "E")] == 1
    assert set(tr[1][2]) == {S("A", "C"), S("B", "C"), S("B", "E"), S("C", "E")}
    assert set(tr[2][1]) == {S("B", "C", "E")} and tr[2][2] == {S("B", "C", "E"): 2}
    assert scans == 3
    print("[OK] p.20 추적: C1 -> L1(D 탈락), C2 6개 -> L2 4개, C3 = {BCE} -> L3 {BCE:2}, DB 3번 훑음")

    # p.21 후보 생성: L3 = {abc, abd, acd, ace, bcd} -> 결합 abcd, acde -> acde 가지치기
    L3 = {S(*"abc"), S(*"abd"), S(*"acd"), S(*"ace"), S(*"bcd")}
    assert gen_candidates(L3, 3) == {S(*"abcd")}
    print("[OK] p.21: abcd만 남고 acde는 ade·cde가 빈발이 아니라 가지치기")

    r = {(s, t): (round(c, 3), ok) for s, t, c, ok in rules(f, "BCE", 0.7)}
    assert r[(("B",), ("C", "E"))] == (0.667, False)
    assert r[(("C",), ("B", "E"))] == (0.667, False)       # 슬라이드 p.23은 100%로 적음
    assert r[(("B", "C"), ("E",))] == (1.0, True) and r[(("C", "E"), ("B",))] == (1.0, True)
    assert r[(("B", "E"), ("C",))] == (0.667, False) and r[(("E",), ("B", "C"))] == (0.667, False)
    print("[OK] p.23 규칙: {C}->{B,E}는 2/3 = 66.7% (슬라이드의 100%는 오기). 강한 규칙은 BC->E, CE->B")

    f1, scans1 = apriori(EX1, 2)
    expect = {S("A"): 6, S("B"): 7, S("C"): 6, S("D"): 2, S("E"): 2, S("A", "B"): 4, S("A", "C"): 4, S("A", "E"): 2,
              S("B", "C"): 4, S("B", "D"): 2, S("B", "E"): 2, S("A", "B", "C"): 2, S("A", "B", "E"): 2}
    assert f1 == expect and scans1 == 3
    assert gen_candidates({S("A", "B", "C"), S("A", "B", "E")}, 3) == set()
    rr = {(s, t): round(c, 4) for s, t, c, _ in rules(f1, "ABC", 0.5)}
    assert rr[(("A",), ("B", "C"))] == round(2 / 6, 4) and rr[(("B",), ("A", "C"))] == round(2 / 7, 4)
    assert rr[(("A", "B"), ("C",))] == 0.5
    rr2 = {(s, t): round(c, 4) for s, t, c, _ in rules(f1, "ABE", 0.5)}
    assert rr2[(("E",), ("A", "B"))] == 1.0 and rr2[(("A", "E"), ("B",))] == 1.0 and rr2[(("A", "B"), ("E",))] == 0.5
    print("[OK] 연습 1(3-4 풀이 p.1~2): 빈발 13개, 규칙 신뢰도 33%, 28.6%, 50%, 100% ... (DB 3번 훑음. C4 후보 ABCE는 ACE·BCE가 빈발이 아니라 가지치기)")

    rnd = random.Random(7)
    for _ in range(300):
        db = [set(rnd.sample("ABCDEFG", rnd.randint(1, 5))) for _ in range(rnd.randint(3, 12))]
        ms = rnd.randint(1, 4)
        assert apriori(db, ms)[0] == brute(db, ms)
    print("[OK] 무작위 자료 300개: 무식한 방법과 결과가 같다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
