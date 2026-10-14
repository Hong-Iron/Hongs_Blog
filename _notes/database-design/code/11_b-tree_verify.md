---
layout: "note"
title: "11_b-tree_verify.py"
display_title: "11_b-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree/"
parent_title: "B-트리"
description: "데이터베이스 설계 · B-트리 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/11_b-tree_verify/"
---
{% raw %}
[B-트리](/Hongs_Blog/studies/database-design/b-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리의 성질 검증: 성질 검사기, 슬라이드 예, 성질을 어기는 예, 올바른 B-트리 전수 세기.

문서: 11.B-트리, 연습 17.B-트리 연습 p1
출처: 03.3_B-tree.pdf p.13~19, 03.3_B-tree-solutions.pdf p.1, 03.3-2_B-tree-insertion.pdf p.14, 18~19
실행: python3 11_b-tree_verify.py

확인하는 것
  1. 슬라이드의 예(3 p.14~17, t = 2)가 B-트리의 성질을 모두 지킨다. 높이는 2다.
  2. 성질을 하나씩 어긴 트리는 검사기가 걸러 낸다(3-2 p.18~19의 두 그림 포함).
  3. 키 수와 자식 수의 범위(t = 2, 3, 4).
  4. 3-2 p.14의 트리는 t = 2로도 t = 3으로도 올바르다. 3 p.14의 트리는 t = 2로만 올바르다.
  5. 연습 1: 키 1~5를 담는 t = 2 B-트리는 정확히 4개다(모든 모양을 만들어 센다).
  6. p.13 그림의 수: 노드마다 키 1,000개면 높이 2에서 1,003,003,000개.
"""


class Node:
    def __init__(self, keys=None, ch=None):
        self.keys = list(keys or [])
        self.ch = list(ch or [])

    @property
    def leaf(self):
        return not self.ch


def K(keys):
    if isinstance(keys, str):
        return [int(a) if a.isdigit() else a for a in keys.split()]
    return list(keys)


def T(spec):
    """잎은 키 목록(또는 문자열), 내부 노드는 (키, [자식, ...])."""
    if isinstance(spec, tuple):
        keys, kids = spec
        return Node(K(keys), [T(c) for c in kids])
    return Node(K(spec))


def show(root):
    out, cur = [], [[root]]
    while cur:
        out.append(" | ".join(" ".join("[" + " ".join(map(str, n.keys)) + "]" for n in grp) for grp in cur))
        cur = [n.ch for grp in cur for n in grp if n.ch]
    return " / ".join(out)


def violations(root, t):
    """어긴 성질의 이름을 모은다. 빈 집합이면 최소 차수 t인 올바른 B-트리다."""
    bad = set()
    depths = set()

    def rec(x, lo, hi, depth, is_root):
        n = len(x.keys)
        if n > 2 * t - 1:
            bad.add("키가 2t - 1개를 넘는다")
        if not is_root and n < t - 1:
            bad.add("뿌리가 아닌데 키가 t - 1개보다 적다")
        if is_root and n == 0 and x.ch:
            bad.add("비어 있지 않은 트리의 뿌리에 키가 없다")
        if any(a > b for a, b in zip(x.keys, x.keys[1:])):
            bad.add("노드 안의 키가 정렬되어 있지 않다")
        if any((lo is not None and k < lo) or (hi is not None and k > hi) for k in x.keys):
            bad.add("키가 부모가 정한 범위를 벗어났다")
        if x.leaf:
            depths.add(depth)
            return
        if len(x.ch) != n + 1:
            bad.add("자식 수가 키 수 + 1이 아니다")
        bounds = [lo] + x.keys + [hi]
        for i, c in enumerate(x.ch):
            rec(c, bounds[min(i, n)], bounds[min(i + 1, n + 1)], depth + 1, False)

    rec(root, None, None, 0, True)
    if len(depths) > 1:
        bad.add("잎의 깊이가 서로 다르다")
    return bad


def height(x):
    return 0 if x.leaf else 1 + height(x.ch[0])


def all_btrees(keys, t):
    """정렬된 keys를 모두 담는 최소 차수 t의 B-트리를 빠짐없이 만든다(한 줄 표기의 목록)."""

    def gen(ks, h, is_root):
        """ks를 담는 높이 h짜리 서브트리의 모든 모양."""
        n = len(ks)
        lo = 1 if is_root else t - 1
        if h == 0:
            return [Node(ks)] if lo <= n <= 2 * t - 1 else []
        out = []
        for m in range(lo, 2 * t):                     # 이 노드의 키 수 m

            def place(start, left, picked):
                """ks[start:]에서 가름 키 left개를 더 고른다. picked는 지금까지 고른 자리."""
                if left == 0:
                    cuts = [-1] + picked + [n]
                    parts = [ks[cuts[j] + 1:cuts[j + 1]] for j in range(m + 1)]
                    subs = [gen(p, h - 1, False) for p in parts]
                    if all(subs):
                        combos = [[]]
                        for s in subs:
                            combos = [c + [a] for c in combos for a in s]
                        for c in combos:
                            out.append(Node([ks[j] for j in picked], c))
                    return
                for j in range(start, n):
                    place(j + 1, left - 1, picked + [j])

            place(0, m, [])
        return out

    found = []
    h = 0
    while True:
        # 높이 h인 트리가 담는 키는 적어도 2t^h - 1개다. 그보다 적으면 더 높은 트리는 없다.
        if h > 0 and 2 * t ** h - 1 > len(keys):
            break
        found += gen(list(keys), h, True)
        h += 1
    return found


def main():
    # 1. 슬라이드의 예 (3 p.14~17), t = 2
    ex = T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", "15", "18"]), ("23 27", ["22", "25", "30"])]))
    assert violations(ex, 2) == set() and height(ex) == 2
    mid = ex.ch[1]
    assert mid.keys == [14, 17] and len(mid.keys) == 2 and len(mid.ch) == 3 and not mid.leaf     # x.n = 2, 자식 3개
    assert all(c.leaf for c in mid.ch)
    # 키가 범위를 가른다: {5} <= 10 <= {14, 17} <= 20 <= {23, 27}
    assert max(ex.ch[0].keys) <= 10 <= min(ex.ch[1].keys) and max(ex.ch[1].keys) <= 20 <= min(ex.ch[2].keys)
    assert [c.keys for c in mid.ch] == [[11, 12], [15], [18]] and 12 <= 14 <= 15 <= 17 <= 18
    print("[OK] 3 p.14~17의 예: 성질을 모두 지킨다, 높이 2, 가운데 노드는 키 2개와 자식 3개 —", show(ex))

    # 2. 성질을 어긴 예
    cases = [
        ("키가 2t - 1개를 넘는다",                       # 3-2 p.19: [23 27]에 28, 29를 더 넣은 노드
         T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", "15", "18"]), ("23 27 28 29", ["22", "25", "27", "28", "30"])]))),
        ("잎의 깊이가 서로 다르다",                      # 3-2 p.18: 잎 밑에 새 잎을 단 그림
         T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", "15", "18"]), ("23 27", ["22", "25", ("30", ["29", "31"])])]))),
        ("뿌리가 아닌데 키가 t - 1개보다 적다",          # 잎 [15]에서 15를 그냥 지운 그림
         T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", [], "18"]), ("23 27", ["22", "25", "30"])]))),
        ("키가 부모가 정한 범위를 벗어났다",             # 13은 14보다 작은데 14와 17 사이 자식에 있다
         T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", "13", "18"]), ("23 27", ["22", "25", "30"])]))),
        ("노드 안의 키가 정렬되어 있지 않다",
         T(("10 20", [("5", ["3", "7"]), ("17 14", ["11 12", "15", "18"]), ("23 27", ["22", "25", "30"])]))),
        ("자식 수가 키 수 + 1이 아니다",
         T(("10 20", [("5", ["3", "7"]), ("14 17", ["11 12", "15"]), ("23 27", ["22", "25", "30"])]))),
    ]
    for name, tree in cases:
        assert name in violations(tree, 2), name
    print("[OK] 성질을 하나씩 어긴 트리 %d개를 모두 걸러 낸다" % len(cases))

    # 3. 키 수와 자식 수의 범위
    table = {t: (t - 1, 2 * t - 1, t, 2 * t) for t in (2, 3, 4)}
    assert table == {2: (1, 3, 2, 4), 3: (2, 5, 3, 6), 4: (3, 7, 4, 8)}
    for t in (2, 3, 4):
        for n in range(0, 2 * t + 1):
            leaf = Node(list(range(n)))
            as_root = violations(leaf, t)
            as_child = violations(Node([100], [leaf, Node(list(range(200, 200 + t)))]), t)
            assert (as_root == set()) == (n <= 2 * t - 1)                      # 뿌리(잎 하나짜리 트리)는 0개부터 된다
            assert (as_child == set()) == (t - 1 <= n <= 2 * t - 1)            # 뿌리가 아니면 t - 1개부터
    print("[OK] 키 수 범위: t = 2는 1~3개, t = 3은 2~5개, t = 4는 3~7개. 내부 노드의 자식은 t~2t개")

    # 4. 한 트리가 여러 t에서 올바를 수 있다
    clrs = T(("M", [("D H", ["B C", "F G", "J K L"]), ("Q T X", ["N P", "R S", "V W", "Y Z"])]))
    assert [t for t in range(2, 7) if not violations(clrs, t)] == [2, 3]
    assert [t for t in range(2, 7) if not violations(ex, t)] == [2]
    print("[OK] 3-2 p.14의 트리는 t = 2, 3에서 올바르다. 3 p.14의 트리는 t = 2에서만 올바르다(키 1개짜리 노드가 있다)")

    # 5. 연습 1 (3 p.19, 답 3s p.1)
    trees = all_btrees([1, 2, 3, 4, 5], 2)
    got = sorted(show(x) for x in trees)
    want = sorted(["[2] / [1] [3 4 5]", "[3] / [1 2] [4 5]", "[4] / [1 2 3] [5]", "[2 4] / [1] [3] [5]"])
    assert got == want and all(not violations(x, 2) for x in trees)
    counts = {n: len(all_btrees(list(range(1, n + 1)), 2)) for n in range(1, 9)}
    assert counts[3] == 2 and sorted(show(x) for x in all_btrees([1, 2, 3], 2)) == ["[1 2 3]", "[2] / [1] [3]"]
    assert counts[5] == 4
    assert all_btrees([1, 2, 3, 4, 5], 3) != [] and sorted(show(x) for x in all_btrees([1, 2, 3, 4, 5], 3)) == ["[1 2 3 4 5]", "[3] / [1 2] [4 5]"]
    print("[OK] 연습 1: t = 2, 키 1~5의 B-트리는 4개 —", ", ".join(got))
    print("     키 n개일 때의 개수(t = 2):", counts)

    # 6. 3 p.13 그림의 수
    keys_per_node, fanout = 1000, 1001
    by_depth = [fanout ** d * keys_per_node for d in range(3)]
    assert by_depth == [1000, 1001000, 1002001000] and sum(by_depth) == 1003003000 == fanout ** 3 - 1
    print("[OK] 노드마다 키 1,000개, 자식 1,001개: 깊이별 1,000 / 1,001,000 / 1,002,001,000, 모두 1,003,003,000개")

    # 확인 문제
    # C2: t = 2에서 (가) [10 20] / [5] [12 15 17 18] [25] 는 키 4개짜리 잎 때문에, (나) [10] / [5] [20 30] / ... 꼴은 잎 깊이 때문에 틀리다
    a = T(("10 20", ["5", "12 15 17 18", "25"]))
    b = T(("10", ["5", ("20", ["15", "25"])]))
    c = T(("10 20", ["5", "15", "25 30 35"]))
    assert show(a) == "[10 20] / [5] [12 15 17 18] [25]" and show(c) == "[10 20] / [5] [15] [25 30 35]"
    assert violations(a, 2) == {"키가 2t - 1개를 넘는다"}
    assert violations(b, 2) == {"잎의 깊이가 서로 다르다"}
    assert violations(c, 2) == set()
    assert violations(a, 3) == {"뿌리가 아닌데 키가 t - 1개보다 적다"}        # t = 3이면 4개는 되지만 1개짜리 잎이 걸린다
    # C5: 예시 트리에서 16이 들어갈 범위는 [14 17]의 둘째 자식 [15]
    x, path = ex, []
    while True:
        path.append(x.keys)
        if x.leaf:
            break
        x = x.ch[sum(1 for k in x.keys if k < 16)]
    assert path == [[10, 20], [14, 17], [15]]
    print("[OK] 확인 문제 C2, C5의 답")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
