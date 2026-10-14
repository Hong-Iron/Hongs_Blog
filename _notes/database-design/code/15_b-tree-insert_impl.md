---
layout: "note"
title: "15_b-tree-insert_impl.py"
display_title: "15_b-tree-insert_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "15"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-insert/"
parent_title: "B-트리 삽입"
description: "데이터베이스 설계 · B-트리 삽입 구현 코드"
sitemap: false
permalink: "/studies/database-design/code/15_b-tree-insert_impl/"
---
{% raw %}
[B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리 삽입 구현과 검증 (노드 쪼개기 포함).

문서: 14.B-트리 노드 쪼개기, 15.B-트리 삽입, 연습 15.B-트리 삽입 예제 사다리
출처: 03.3-2_B-tree-insertion.pdf p.17~31, 04.4-1_B-tree-deletion.pdf p.5~11, 04.4_B-tree-solutions.pdf p.2~3
인덱스: 슬라이드 의사코드(CLRS)는 1부터 센다(x.key_1, x.c_1). 이 코드는 0부터 센다.
        의사코드의 x.key_i는 x.keys[i-1], x.c_i는 x.ch[i-1]이다.
실행: python3 15_b-tree-insert_impl.py

확인하는 것
  1. B-TREE-SPLIT-CHILD: t = 4 그림(p.20)의 [P Q R S T U V]가 [P Q R] / S / [T U V]로 갈린다. 자식 8개는 4개씩.
  2. B-TREE-INSERT: 뿌리가 가득 차면 먼저 쪼갠다(p.25의 [A D F H L N P] -> H).
  3. t = 3 예(p.28~29, 4-1 p.9~10): B, Q, L, F를 차례로 넣은 네 그림.
  4. t = 2 실행 추적(F S Q K C L H)과 연습 3(21개 키)의 답(4s p.3).
  5. 무작위 삽입: 넣을 때마다 B-트리 성질이 모두 지켜지고, 차례로 읽으면 정렬된 목록과 같다.
     높이는 뿌리를 쪼갤 때만, 그때마다 1씩 는다. 내려가는 노드는 가득 차 있지 않다.
  6. 예제 사다리와 확인 문제의 답.
"""
import random


class Node:
    """B-트리 노드. keys는 정렬된 키 목록, ch는 자식 목록이다. 잎은 ch가 비어 있다."""

    def __init__(self, keys=None, ch=None):
        self.keys = list(keys or [])
        self.ch = list(ch or [])

    @property
    def leaf(self):
        return not self.ch


def K(keys):
    """'G M P X' -> ['G', 'M', 'P', 'X'], '20 40' -> [20, 40]."""
    if isinstance(keys, str):
        return [int(a) if a.isdigit() else a for a in keys.split()]
    return list(keys)


def T(spec):
    """트리를 적는 법: 잎은 키 목록(또는 문자열), 내부 노드는 (키, [자식, ...])."""
    if isinstance(spec, tuple):
        keys, kids = spec
        return Node(K(keys), [T(c) for c in kids])
    return Node(K(spec))


def show(root):
    """층은 ' / '로, 부모가 다른 묶음은 ' | '로 가른 한 줄 표기."""
    out, cur = [], [[root]]
    while cur:
        out.append(" | ".join(" ".join("[" + " ".join(map(str, n.keys)) + "]" for n in grp) for grp in cur))
        cur = [n.ch for grp in cur for n in grp if n.ch]
    return " / ".join(out)


def inorder(x):
    """작은 키부터 차례로 읽는다."""
    if x.leaf:
        return list(x.keys)
    out = []
    for i, c in enumerate(x.ch):
        out += inorder(c)
        if i < len(x.keys):
            out.append(x.keys[i])
    return out


def height(x):
    """뿌리에서 잎까지의 간선 수. 노드 하나짜리 트리는 0."""
    return 0 if x.leaf else 1 + height(x.ch[0])


def check(root, t):
    """B-트리 성질(3 p.15~17)을 모두 확인하고 높이를 돌려준다. 어기면 AssertionError."""
    depths = set()

    def rec(x, lo, hi, depth, is_root):
        n = len(x.keys)
        assert n <= 2 * t - 1, "키가 2t - 1개를 넘는다"
        assert is_root or n >= t - 1, "뿌리가 아닌데 키가 t - 1개보다 적다"
        assert all(a <= b for a, b in zip(x.keys, x.keys[1:])), "노드 안의 키가 정렬되어 있지 않다"
        assert all((lo is None or lo <= k) and (hi is None or k <= hi) for k in x.keys), "키가 부모가 정한 범위를 벗어났다"
        if x.leaf:
            depths.add(depth)
            return
        assert n >= 1, "내부 노드에 키가 없다"
        assert len(x.ch) == n + 1, "자식 수가 키 수 + 1이 아니다"
        bounds = [lo] + x.keys + [hi]
        for i, c in enumerate(x.ch):
            rec(c, bounds[i], bounds[i + 1], depth + 1, False)

    rec(root, None, None, 0, True)
    assert len(depths) == 1, "잎의 깊이가 서로 다르다"
    return depths.pop()


# ---------------------------------------------------------------- 삽입 (3-2 p.21, 25, 27)

def split_child(x, i, t):
    """B-TREE-SPLIT-CHILD(x, i+1). 가득 찬 자식 y = x.ch[i]를 둘로 쪼개고 가운데 키를 x로 올린다.

    x는 가득 차 있지 않은 내부 노드여야 한다. 올라간 키를 돌려준다.
    """
    y = x.ch[i]
    assert len(y.keys) == 2 * t - 1, "쪼갤 자식이 가득 차 있지 않다"
    assert len(x.keys) < 2 * t - 1, "부모가 가득 차 있다"
    z = Node(y.keys[t:], y.ch[t:])      # 1~9행: 새 노드 z가 큰 쪽 키 t - 1개와 자식 t개를 가져간다
    mid = y.keys[t - 1]                 # 가운데 키 y.key_t
    y.keys = y.keys[:t - 1]             # 10행: y에는 작은 쪽 키 t - 1개가 남는다
    y.ch = y.ch[:t]
    x.ch.insert(i + 1, z)               # 11~13행: z를 y 바로 오른쪽 자식으로 끼운다
    x.keys.insert(i, mid)               # 14~17행: 가운데 키가 y와 z 사이로 올라간다
    return mid


def insert_nonfull(x, k, t, log, visited):
    """B-TREE-INSERT-NONFULL(x, k). x는 가득 차 있지 않다."""
    assert len(x.keys) < 2 * t - 1, "가득 찬 노드로 내려왔다"
    visited.append(x)
    i = len(x.keys) - 1                              # 1행 (의사코드의 i = x.n)
    if x.leaf:                                       # 2~8행: 잎이면 자리를 만들어 넣는다
        x.keys.append(None)
        while i >= 0 and k < x.keys[i]:
            x.keys[i + 1] = x.keys[i]
            i -= 1
        x.keys[i + 1] = k
        log.append("잎 [%s]에 넣음" % " ".join(map(str, x.keys)))
        return
    while i >= 0 and k < x.keys[i]:                  # 9~10행: 내려갈 자식을 찾는다
        i -= 1
    i += 1                                           # 11행
    if len(x.ch[i].keys) == 2 * t - 1:               # 13행: 그 자식이 가득 찼으면
        mid = split_child(x, i, t)                   # 14행: 먼저 쪼갠다
        log.append("자식 쪼갬(%s 올라감)" % mid)
        if k > x.keys[i]:                            # 15~16행: 올라온 키보다 크면 오른쪽 조각으로
            i += 1
    insert_nonfull(x.ch[i], k, t, log, visited)      # 17행


def insert(root, k, t, log=None, visited=None):
    """B-TREE-INSERT(T, k). 새 뿌리를 돌려준다."""
    log = [] if log is None else log
    visited = [] if visited is None else visited
    if len(root.keys) == 2 * t - 1:                  # 2행: 뿌리가 가득 찼으면
        s = Node([], [root])                         # 3~7행: 빈 노드 s를 새 뿌리로 삼고 옛 뿌리를 자식으로 단다
        mid = split_child(s, 0, t)                   # 8행
        log.append("뿌리 쪼갬(%s 올라감)" % mid)
        root = s
    insert_nonfull(root, k, t, log, visited)         # 9~10행
    return root


def build(keys, t):
    """빈 트리(B-TREE-CREATE: 키 없는 잎 하나)에 keys를 차례로 넣는다."""
    root = Node()
    for k in K(keys):
        root = insert(root, k, t)
        check(root, t)
    return root


# ---------------------------------------------------------------- 검증

def expect(name, root, want, t):
    check(root, t)
    got = show(root)
    assert got == show(T(want)), "%s\n  나온 것: %s\n  기대한 것: %s" % (name, got, show(T(want)))
    print("[OK] %s: %s" % (name, got))


def main():
    # 1. B-TREE-SPLIT-CHILD, t = 4 그림 (3-2 p.20~24). 자식 T1..T8을 넣어 4개씩 갈리는지도 본다.
    t = 4
    kids = [Node(["T%d" % j]) for j in range(1, 9)]
    y = Node(list("PQRSTUV"), kids)
    x = Node(["N", "W"], [Node(["a"]), y, Node(["z"])])
    up = split_child(x, 1, t)
    z = x.ch[2]
    assert up == "S" and x.keys == ["N", "S", "W"] and len(x.ch) == 4
    assert y.keys == list("PQR") and z.keys == list("TUV")
    assert [c.keys[0] for c in y.ch] == ["T1", "T2", "T3", "T4"] and [c.keys[0] for c in z.ch] == ["T5", "T6", "T7", "T8"]
    assert len(y.keys) == len(z.keys) == t - 1 and len(y.ch) == len(z.ch) == t
    print("[OK] 쪼개기 t = 4: [P Q R S T U V] -> [P Q R], S 올라감, [T U V]. 자식은 T1~T4 / T5~T8")

    # 가득 찬 부모 밑에서는 쪼갤 수 없다(가운데 키가 올라갈 자리가 없다)
    full_parent = T(("B D F", ["A", "C", "E", "G H I"]))
    try:
        split_child(full_parent, 3, 2)
        raise SystemExit("가득 찬 부모에서 쪼개기가 통과했다")
    except AssertionError:
        print("[OK] 부모가 가득 차 있으면 쪼개기를 거부한다 (t = 2, 부모 [B D F])")

    # 2. 뿌리 쪼개기, t = 4 그림 (3-2 p.25): [A D F H L N P] -> [H] / [A D F] [L N P]
    r = T("A D F H L N P")
    log = []
    r = insert(r, "B", 4, log)
    expect("뿌리 쪼개기 t = 4 (B를 넣음)", r, ("H", ["A B D F", "L N P"]), 4)
    assert log[0] == "뿌리 쪼갬(H 올라감)" and height(r) == 1

    # 3. t = 3 예 (3-2 p.28~29, 4-1 p.9~10, 4s p.2)
    t = 3
    r = T(("G M P X", ["A C D E", "J K", "N O", "R S T U V", "Y Z"]))
    check(r, t)
    logs = {}
    for k, want in [
        ("B", ("G M P X", ["A B C D E", "J K", "N O", "R S T U V", "Y Z"])),
        ("Q", ("G M P T X", ["A B C D E", "J K", "N O", "Q R S", "U V", "Y Z"])),
        ("L", ("P", [("G M", ["A B C D E", "J K L", "N O"]), ("T X", ["Q R S", "U V", "Y Z"])])),
        ("F", ("P", [("C G M", ["A B", "D E F", "J K L", "N O"]), ("T X", ["Q R S", "U V", "Y Z"])])),
    ]:
        logs[k] = []
        r = insert(r, k, t, logs[k])
        expect("t = 3, %s 삽입" % k, r, want, t)
    assert logs["B"] == ["잎 [A B C D E]에 넣음"]
    assert logs["Q"] == ["자식 쪼갬(T 올라감)", "잎 [Q R S]에 넣음"]
    assert logs["L"] == ["뿌리 쪼갬(P 올라감)", "잎 [J K L]에 넣음"]      # 잎 [J K]는 가득 차 있지 않았는데도 뿌리를 쪼갠다
    assert logs["F"] == ["자식 쪼갬(C 올라감)", "잎 [D E F]에 넣음"]

    # 4. t = 2 실행 추적(문서 15의 표)과 연습 3 (3-2 p.31, 답 4s p.3)
    t = 2
    r = Node()
    trace = []
    for k in K("F S Q K C L H"):
        log = []
        r = insert(r, k, t, log)
        check(r, t)
        trace.append((k, log, show(r)))
    assert [s for _, _, s in trace] == [
        "[F]", "[F S]", "[F Q S]",
        "[Q] / [F K] [S]", "[Q] / [C F K] [S]",
        "[F Q] / [C] [K L] [S]", "[F Q] / [C] [H K L] [S]"]
    assert trace[3][1] == ["뿌리 쪼갬(Q 올라감)", "잎 [F K]에 넣음"]
    assert trace[5][1] == ["자식 쪼갬(F 올라감)", "잎 [K L]에 넣음"]
    print("[OK] t = 2 추적 F S Q K C L H:", " -> ".join(s for _, _, s in trace))

    ex3 = "F S Q K C L H T V W M R N P A B X Y D Z E"
    r = build(ex3, 2)
    expect("연습 3 (t = 2, 키 21개)", r,
           ("K Q", [("B F", ["A", "C D E", "H"]), ("M", ["L", "N P"]), ("T W", ["R S", "V", "X Y Z"])]), 2)
    assert height(r) == 2 and inorder(r) == sorted(K(ex3))

    # 5. 무작위 삽입
    rnd = random.Random(20261012)
    trials = inserts = root_splits = 0
    for t in (2, 3, 4, 5):
        for j in range(150):
            n = 1 + (j * 37) % 120                                       # 트리마다 키 1~120개(크기는 정해 둔다)
            keys = rnd.sample(range(1000), n)
            r = Node()
            for j, k in enumerate(keys):
                h0, was_full = height(r), len(r.keys) == 2 * t - 1
                log, visited = [], []
                r = insert(r, k, t, log, visited)
                h1 = check(r, t)
                assert inorder(r) == sorted(keys[:j + 1])
                assert h1 == h0 + (1 if was_full else 0)                 # 높이는 뿌리를 쪼갤 때만 1 는다
                assert was_full == (log[0].startswith("뿌리 쪼갬"))
                assert len(visited) == h1 + 1                            # 뿌리에서 잎까지 한 번만 내려간다
                assert sum("쪼갬" in a for a in log) <= h0 + 1               # 쪼개기는 많아야 (넣기 전 높이 + 1)번
                root_splits += was_full
                inserts += 1
            trials += 1
    assert inserts == 35940 and trials == 600                            # 문서에 적은 횟수
    print("[OK] 무작위 삽입 %d번(트리 %d개, t = 2~5): 성질 유지, 정렬된 목록과 일치, 높이는 뿌리 쪼개기 %d번에서만 늘었다"
          % (inserts, trials, root_splits))

    # 6-1. 예제 사다리 (연습 15.B-트리 삽입 예제 사다리)
    # 문제 2: t = 2, [20] / [10] [30 40 50] 에 45, 35를 차례로
    r = T(("20", ["10", "30 40 50"]))
    r = insert(r, 45, 2)
    expect("사다리 2-1 (45)", r, ("20 40", ["10", "30", "45 50"]), 2)
    r = insert(r, 35, 2)
    expect("사다리 2-2 (35)", r, ("20 40", ["10", "30 35", "45 50"]), 2)
    # 문제 3: t = 2, [10 20 30] / [5] [15] [25] [35 40 45] 에 50, 12
    r = T(("10 20 30", ["5", "15", "25", "35 40 45"]))
    log = []
    r = insert(r, 50, 2, log)
    expect("사다리 3-1 (50)", r, ("20", [("10", ["5", "15"]), ("30 40", ["25", "35", "45 50"])]), 2)
    assert log == ["뿌리 쪼갬(20 올라감)", "자식 쪼갬(40 올라감)", "잎 [45 50]에 넣음"]
    r = insert(r, 12, 2)
    expect("사다리 3-2 (12)", r, ("20", [("10", ["5", "12 15"]), ("30 40", ["25", "35", "45 50"])]), 2)
    # 문제 4: t = 3, 빈 트리에 10, 20, ..., 120
    r = Node()
    states = []
    for k in range(10, 130, 10):
        r = insert(r, k, 3)
        states.append(show(r))
    assert states[4] == "[10 20 30 40 50]"
    assert states[5] == "[30] / [10 20] [40 50 60]"
    assert states[8] == "[30 60] / [10 20] [40 50] [70 80 90]"
    assert states[11] == "[30 60 90] / [10 20] [40 50] [70 80] [100 110 120]"
    expect("사다리 4 (t = 3, 10~120)", r, ("30 60 90", ["10 20", "40 50", "70 80", "100 110 120"]), 3)

    # 6-2. 확인 문제
    # 14 C1: t = 3, x = [G M]의 첫 자식 [A B C D E]를 쪼갠다 -> [C G M] / [A B] [D E] ...
    x = T(("G M", ["A B C D E", "J K L", "N O"]))
    assert split_child(x, 0, 3) == "C"
    assert show(x) == "[C G M] / [A B] [D E] [J K L] [N O]"
    # 14 C4: t = 2, x = [20 40]의 가운데 자식 [25 30 35]를 쪼갠다
    x = T(("20 40", ["10", "25 30 35", "50"]))
    assert split_child(x, 1, 2) == 30 and show(x) == "[20 30 40] / [10] [25] [35] [50]"
    # 15 C1: t = 2, [F Q] / [C] [H K L] [S] 에 M
    r = T(("F Q", ["C", "H K L", "S"]))
    log = []
    r = insert(r, "M", 2, log)
    assert show(r) == "[F K Q] / [C] [H] [L M] [S]" and log == ["자식 쪼갬(K 올라감)", "잎 [L M]에 넣음"]
    # 15 C5: t = 2, [10 20 30] / [5] [15] [25] [35] 에 1 -> 잎에 자리가 있어도 뿌리를 쪼갠다
    r = T(("10 20 30", ["5", "15", "25", "35"]))
    log = []
    r = insert(r, 1, 2, log)
    assert show(r) == "[20] / [10] [30] / [1 5] [15] | [25] [35]" and log[0] == "뿌리 쪼갬(20 올라감)"
    # 15 본문: 넣기 전에 쪼개지 않고 가득 찬 잎에 그냥 넣으면 성질이 깨진다
    bad = T(("G M P X", ["A C D E", "J K", "N O", "Q R S T U V", "Y Z"]))
    try:
        check(bad, 3)
        raise SystemExit("키 6개짜리 잎이 통과했다")
    except AssertionError:
        pass
    print("[OK] 예제 사다리 문제 2~4와 확인 문제(14 C1·C4, 15 C1·C5)의 답")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
