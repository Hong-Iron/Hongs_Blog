---
layout: "note"
title: "15_fp-growth-ladder_p4.py"
display_title: "15_fp-growth-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "15"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/fp-growth-ladder/"
parent_title: "FP-Growth 예제 사다리"
description: "데이터 과학 · FP-Growth 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-science/code/15_fp-growth-ladder_p4/"
---
{% raw %}
[FP-Growth 예제 사다리](/Hongs_Blog/studies/data-science/fp-growth-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FP-Growth 예제 사다리 문제 3·4 검증 (문제 1·2는 3.개념집/15_fp-growth_impl.py가 확인한다).

문서: 4.연습문제/15.FP-Growth 예제 사다리
문제 3: 거래 5개 (a,c,d,f,g,i,m,p / a,b,c,f,l,m,o / b,f,h,j,o / b,c,k,p,s / a,c,e,f,l,m,n,p), min_sup 3
        항목 순서는 개수 내림차순, 같으면 알파벳순.
문제 4: 거래 6개 (우유,빵,버터 / 빵,버터 / 우유,빵 / 우유,빵,버터,잼 / 빵,잼 / 우유,버터), min_sup 2,
        항목 순서는 개수 내림차순, 같으면 가나다순. 가장 긴 빈발 집합에서 신뢰도 60% 이상 규칙.
FP-Growth 구현은 3.개념집/15_fp-growth_impl.py에서 필요한 부분을 복사했다.
"""
from itertools import combinations


class Node:
    def __init__(self, item, parent):
        self.item, self.parent, self.count, self.children = item, parent, 0, {}


def order_of(tx, ms):
    cnt = {}
    for t, w in tx:
        for i in set(t):
            cnt[i] = cnt.get(i, 0) + w
    freq = {i: c for i, c in cnt.items() if c >= ms}
    return sorted(freq, key=lambda i: (-freq[i], i)), freq


def build(tx, ms, order=None):
    o, freq = order_of(tx, ms)
    order = o if order is None else [i for i in order if i in freq]
    rank = {i: k for k, i in enumerate(order)}
    root = Node(None, None); header = {i: [] for i in order}; paths = []
    for t, w in tx:
        items = sorted({i for i in t if i in rank}, key=rank.get); paths.append(items)
        n = root
        for i in items:
            if i not in n.children:
                n.children[i] = Node(i, n); header[i].append(n.children[i])
            n = n.children[i]; n.count += w
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


def fp_growth(tx, ms, suffix=(), out=None, log=None, order=None):
    out = {} if out is None else out
    root, header, order, freq, _ = build(tx, ms, order)
    for item in reversed(order):
        out[frozenset(suffix + (item,))] = freq[item]
        base = cond_base(header, item)
        _, sf = order_of(base, ms)
        if log is not None and not suffix:
            log[item] = (sorted(base), [(i, sf[i]) for i in order if i in sf])
        if base:
            fp_growth(base, ms, suffix + (item,), out, None, order)
    return out


def brute(db, ms):
    items = sorted({i for t in db for i in t}); res = {}
    for r in range(1, len(items) + 1):
        for c in combinations(items, r):
            n = sum(1 for t in db if set(c) <= set(t))
            if n >= ms:
                res[frozenset(c)] = n
    return res


def show(n, d=0):
    out = []
    for c in n.children.values():
        out.append("  " * d + f"{c.item}:{c.count}"); out += show(c, d + 1)
    return out


def main():
    db3 = [list("acdfgimp"), list("abcflmo"), list("bfhjo"), list("bckps"), list("acefl mnp".replace(" ", ""))]
    tx3 = [(t, 1) for t in db3]
    root, header, order, freq, paths = build(tx3, 3)
    assert order == ["c", "f", "a", "b", "m", "p"] and [freq[i] for i in order] == [4, 4, 3, 3, 3, 3]
    assert ["".join(p) for p in paths] == ["cfamp", "cfabm", "fb", "cbp", "cfamp"]
    print("문제 3 트리:"); print("\n".join(show(root)))
    log = {}
    f3 = fp_growth(tx3, 3, log=log)
    assert log["p"] == ([(("c", "b"), 1), (("c", "f", "a", "m"), 2)], [("c", 3)])
    assert log["m"] == ([(("c", "f", "a"), 2), (("c", "f", "a", "b"), 1)], [("c", 3), ("f", 3), ("a", 3)])
    assert log["b"] == ([(("c",), 1), (("c", "f", "a"), 1), (("f",), 1)], [])
    assert log["a"] == ([(("c", "f"), 3)], [("c", 3), ("f", 3)])
    assert log["f"] == ([(("c",), 3)], [("c", 3)])
    multi = {"".join(sorted(k)): n for k, n in f3.items() if len(k) > 1}
    assert multi == {"cp": 3, "cm": 3, "fm": 3, "am": 3, "cfm": 3, "acm": 3, "afm": 3, "acfm": 3,
                     "ac": 3, "af": 3, "acf": 3, "cf": 3}
    assert f3 == brute(db3, 3)
    print("[OK] 문제 3: 조건부 베이스 p, m, b, a, f와 빈발 패턴 (가장 긴 것 {a,c,f,m}:3)")

    db4 = [["우유", "빵", "버터"], ["빵", "버터"], ["우유", "빵"], ["우유", "빵", "버터", "잼"], ["빵", "잼"], ["우유", "버터"]]
    tx4 = [(t, 1) for t in db4]
    r4, h4, o4, fr4, p4 = build(tx4, 2)
    print("문제 4 순서:", o4, [fr4[i] for i in o4]); print("\n".join(show(r4)))
    log4 = {}
    f4 = fp_growth(tx4, 2, log=log4)
    assert f4 == brute(db4, 2)
    for k, v in log4.items():
        print("  ", k, v)
    multi4 = {"·".join(sorted(k)): n for k, n in f4.items() if len(k) > 1}
    print("   빈발:", multi4)
    assert o4 == ["빵", "버터", "우유", "잼"]
    assert multi4 == {"빵·잼": 2, "버터·빵": 3, "버터·우유": 3, "버터·빵·우유": 2, "빵·우유": 3}
    l = frozenset(["우유", "빵", "버터"])
    conf = {}
    for r in (1, 2):
        for s in combinations(sorted(l), r):
            conf["·".join(s)] = round(f4[l] / f4[frozenset(s)], 3)
    print("   규칙 신뢰도:", conf)
    assert conf == {"버터": 0.5, "빵": 0.4, "우유": 0.5, "버터·빵": 0.667, "버터·우유": 0.667, "빵·우유": 0.667}
    print("[OK] 문제 4: 가장 긴 빈발 집합 {우유, 빵, 버터}:2, 60% 이상 규칙은 둘 이상을 앞에 둔 세 개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
