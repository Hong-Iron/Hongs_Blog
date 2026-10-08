---
layout: "note"
title: "15_fp-growth_impl.py"
display_title: "15_fp-growth_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "15"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/fp-growth/"
parent_title: "FP-Growth"
description: "데이터 과학 · FP-Growth 구현 코드"
permalink: "/studies/data-science/code/15_fp-growth_impl/"
---
{% raw %}
[FP-Growth](/Hongs_Blog/studies/data-science/fp-growth/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FP-Growth 구현과 자체 테스트.

문서: 15.FP-Growth (예시, 의사코드, 실행 추적, 카드), 4.연습문제/15.FP-Growth 예제 사다리
출처: 데이터 과학 3회 슬라이드 3-1 p.29~36, 3-4 풀이 p.3~11
방법:
  1. DB를 한 번 훑어 항목별 개수를 세고, min_sup 이상인 항목만 개수 내림차순(같으면 이름순)으로 정한다.
  2. DB를 다시 훑어 거래마다 빈발 항목만 그 순서로 늘어놓고 트리(FP-tree)에 넣는다. 앞부분이 같으면 가지를 공유하고 개수를 더한다.
  3. 순서의 맨 뒤 항목부터, 그 항목에 이르는 앞 경로들(조건부 패턴 베이스)로 작은 트리(조건부 FP-tree)를 만들어 재귀로 캔다.
검사: 슬라이드의 조건부 패턴 베이스·조건부 FP-tree·빈발 패턴, 연습 2의 결과와 규칙, 무작위 자료 300개.
"""
from itertools import combinations
import random


class Node:
    def __init__(self, item, parent):
        self.item, self.parent, self.count, self.children = item, parent, 0, {}


def order_of(transactions, min_sup):
    cnt = {}
    for t, w in transactions:
        for i in set(t):
            cnt[i] = cnt.get(i, 0) + w
    freq = {i: c for i, c in cnt.items() if c >= min_sup}
    return sorted(freq, key=lambda i: (-freq[i], i)), freq


def build(transactions, min_sup, order=None):
    if order is None:
        order, freq = order_of(transactions, min_sup)
    else:
        _, freq = order_of(transactions, min_sup)
        order = [i for i in order if i in freq]
    rank = {i: k for k, i in enumerate(order)}
    root = Node(None, None); header = {i: [] for i in order}; paths = []
    for t, w in transactions:
        items = sorted({i for i in t if i in rank}, key=rank.get)
        paths.append(items)
        node = root
        for i in items:
            if i not in node.children:
                node.children[i] = Node(i, node); header[i].append(node.children[i])
            node = node.children[i]; node.count += w
    return root, header, order, freq, paths


def cond_base(header, item):
    out = []
    for n in header[item]:
        p, path = n.parent, []
        while p.item is not None:
            path.append(p.item); p = p.parent
        if path:
            out.append((tuple(reversed(path)), n.count))
    return out


def fp_growth(transactions, min_sup, suffix=(), out=None, log=None, order=None):
    if out is None:
        out = {}
    root, header, order, freq, _ = build(transactions, min_sup, order)
    for item in reversed(order):
        pat = frozenset(suffix + (item,)); out[pat] = freq[item]
        base = cond_base(header, item)
        sub_order, sub_freq = order_of(base, min_sup)
        if log is not None and not suffix:
            log[item] = (base, [(i, sub_freq[i]) for i in order if i in sub_freq])
        if base:
            fp_growth(base, min_sup, suffix + (item,), out, None, order)
    return out


def brute(db, min_sup):
    items = sorted({i for t in db for i in t}); res = {}
    for r in range(1, len(items) + 1):
        for c in combinations(items, r):
            n = sum(1 for t in db if set(c) <= set(t))
            if n >= min_sup:
                res[frozenset(c)] = n
    return res


EX1 = ["ABE", "ABD", "BC", "BD", "AC", "BC", "AC", "ABCE", "ABC"]
EX2 = ["EKMNOY", "DEKNOY", "AEKM", "CKMUY", "CEIKOO"]


def main():
    S = frozenset
    tx = [(t, 1) for t in EX1]
    root, header, order, freq, paths = build(tx, 2)
    assert order == ["B", "A", "C", "D", "E"] and freq == {"B": 7, "A": 6, "C": 6, "D": 2, "E": 2}
    assert ["".join(p) for p in paths] == ["BAE", "BAD", "BC", "BD", "AC", "BC", "AC", "BACE", "BAC"]
    assert root.children["B"].count == 7 and root.children["A"].count == 2
    assert root.children["B"].children["A"].count == 4 and root.children["B"].children["C"].count == 2
    print("[OK] p.30: 순서 <B:7, A:6, C:6, D:2, E:2>, 루트 아래 B:7과 A:2, B-A:4, B-C:2")

    log = {}
    f = fp_growth(tx, 2, log=log)
    assert sorted(log["E"][0]) == [(("B", "A"), 1), (("B", "A", "C"), 1)] and log["E"][1] == [("B", 2), ("A", 2)]
    assert sorted(log["D"][0]) == [(("B",), 1), (("B", "A"), 1)] and log["D"][1] == [("B", 2)]
    assert sorted(log["C"][0]) == [(("A",), 2), (("B",), 2), (("B", "A"), 2)] and log["C"][1] == [("B", 4), ("A", 4)]
    assert log["A"][0] == [(("B",), 4)] and log["A"][1] == [("B", 4)]
    assert f == brute(EX1, 2)
    print("[OK] p.31~34: E, D, C, A의 조건부 패턴 베이스와 빈발 항목, 결과가 Apriori·무식한 방법과 같다")

    tx2 = [(t, 1) for t in EX2]
    root2, header2, order2, freq2, paths2 = build(tx2, 3)
    assert order2 == ["K", "E", "M", "O", "Y"] and [freq2[i] for i in order2] == [5, 4, 3, 3, 3]
    assert ["".join(p) for p in paths2] == ["KEMOY", "KEOY", "KEM", "KMY", "KEO"]
    log2 = {}
    f2 = fp_growth(tx2, 3, log=log2)
    assert sorted(log2["Y"][0]) == sorted([(("K", "E", "M", "O"), 1), (("K", "E", "O"), 1), (("K", "M"), 1)])
    assert log2["Y"][1] == [("K", 3)]
    assert sorted(log2["O"][0]) == sorted([(("K", "E", "M"), 1), (("K", "E"), 2)]) and log2["O"][1] == [("K", 3), ("E", 3)]
    assert sorted(log2["M"][0]) == sorted([(("K", "E"), 2), (("K",), 1)]) and log2["M"][1] == [("K", 3)]
    assert log2["E"][0] == [(("K",), 4)]
    multi = {k: n for k, n in f2.items() if len(k) > 1}
    assert multi == {S("KY"): 3, S("KO"): 3, S("EO"): 3, S("EKO"): 3, S("KM"): 3, S("EK"): 4}
    assert f2 == brute(EX2, 3)
    print("[OK] 연습 2(3-4 풀이 p.3~8): 순서 <K:5, E:4, M:3, O:3, Y:3>, 조건부 베이스 Y·O·M·E, 가장 긴 패턴 {K,E,O}:3")

    conf = {}
    l = S("KEO")
    for r in (1, 2):
        for s in combinations("KEO", r):
            conf["".join(s)] = f2[l] / f2[S(s)]
    assert {k: round(v, 2) for k, v in conf.items()} == {"K": 0.6, "E": 0.75, "O": 1.0, "KE": 0.75, "KO": 1.0, "EO": 1.0}
    print("[OK] p.10: K->EO 60%, E->KO 75%, O->KE 100%, KE->O 75%, KO->E 100%, EO->K 100%")

    rnd = random.Random(11)
    for _ in range(300):
        db = ["".join(rnd.sample("ABCDEFG", rnd.randint(1, 5))) for _ in range(rnd.randint(3, 12))]
        ms = rnd.randint(1, 4)
        assert fp_growth([(t, 1) for t in db], ms) == brute(db, ms)
    print("[OK] 무작위 자료 300개: 무식한 방법과 같다")

    # 카드: 트리 노드 수 (루트 제외) - 연습 1은 거래 속 빈발 항목 등장 23번을 노드 몇 개로 줄이나
    def count_nodes(n):
        return sum(1 + count_nodes(c) for c in n.children.values())
    assert count_nodes(root) == 10 and sum(len(p) for p in paths) == 23
    assert count_nodes(root2) == 9 and sum(len(p) for p in paths2) == 18
    r5, h5, o5, f5, p5 = build([(t, 1) for t in ["ABC", "AB", "AC", "B"]], 2)
    assert o5 == ["A", "B", "C"]
    a = r5.children["A"]
    assert a.count == 3 and a.children["B"].count == 2 and a.children["B"].children["C"].count == 1
    assert a.children["C"].count == 1 and r5.children["B"].count == 1 and len(h5["C"]) == 2
    print("[OK] 카드 C5: A:3(B:2(C:1), C:1), B:1, C 마디 2개")
    print("[OK] 카드: 연습 1은 항목 등장 23번 -> 노드 10개, 연습 2는 18번 -> 노드 9개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
