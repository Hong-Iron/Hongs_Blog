---
layout: "note"
title: "17_b-tree-practice_p5.py"
display_title: "17_b-tree-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "17"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-practice/"
parent_title: "B-트리 연습"
description: "데이터베이스 설계 · B-트리 연습 문제 5 풀이 코드"
permalink: "/studies/database-design/code/17_b-tree-practice_p5/"
---
{% raw %}
[B-트리 연습](/Hongs_Blog/studies/database-design/b-tree-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리 연습 p5 (슬라이드 연습 3): 빈 B-트리(t = 2)에 키 21개를 차례로 넣는다.

문제: 03.3-2_B-tree-insertion.pdf p.31 (= 04.4-1_B-tree-deletion.pdf p.11)
      F, S, Q, K, C, L, H, T, V, W, M, R, N, P, A, B, X, Y, D, Z, E
답:   04.4_B-tree-solutions.pdf p.3
      [K Q] / [B F] [M] [T W] / [A] [C D E] [H] | [L] [N P] | [R S] [V] [X Y Z]
인덱스: 0부터 센다(슬라이드 의사코드는 1부터).
실행: python3 17_b-tree-practice_p5.py
"""


class Node:
    def __init__(self, keys=None, ch=None):
        self.keys = list(keys or [])
        self.ch = list(ch or [])

    @property
    def leaf(self):
        return not self.ch


def show(root):
    """층은 ' / '로, 부모가 다른 묶음은 ' | '로 가른 한 줄 표기."""
    out, cur = [], [[root]]
    while cur:
        out.append(" | ".join(" ".join("[" + " ".join(n.keys) + "]" for n in grp) for grp in cur))
        cur = [n.ch for grp in cur for n in grp if n.ch]
    return " / ".join(out)


def check(root, t):
    depths = set()

    def rec(x, lo, hi, depth, is_root):
        n = len(x.keys)
        assert n <= 2 * t - 1 and (is_root or n >= t - 1)
        assert all(a < b for a, b in zip(x.keys, x.keys[1:]))
        assert all((lo is None or lo < k) and (hi is None or k < hi) for k in x.keys)
        if x.leaf:
            depths.add(depth)
            return
        assert len(x.ch) == n + 1
        bounds = [lo] + x.keys + [hi]
        for i, c in enumerate(x.ch):
            rec(c, bounds[i], bounds[i + 1], depth + 1, False)

    rec(root, None, None, 0, True)
    assert len(depths) == 1
    return depths.pop()


def split_child(x, i, t):
    """가득 찬 자식 x.ch[i]를 쪼개고 가운데 키를 x로 올린다."""
    y = x.ch[i]
    z = Node(y.keys[t:], y.ch[t:])
    mid = y.keys[t - 1]
    y.keys = y.keys[:t - 1]
    y.ch = y.ch[:t]
    x.ch.insert(i + 1, z)
    x.keys.insert(i, mid)
    return mid


def insert(root, k, t, log):
    """B-TREE-INSERT. 가득 찬 노드는 내려가기 전에 쪼갠다."""
    if len(root.keys) == 2 * t - 1:
        root = Node([], [root])
        log.append("뿌리 쪼갬(%s)" % split_child(root, 0, t))
    x = root
    while not x.leaf:
        i = sum(1 for a in x.keys if a < k)
        if len(x.ch[i].keys) == 2 * t - 1:
            log.append("자식 쪼갬(%s)" % split_child(x, i, t))
            if k > x.keys[i]:
                i += 1
        x = x.ch[i]
    x.keys.append(k)
    x.keys.sort()
    return root


# 문서의 표: 삽입 21번의 결과
TRACE = [   # (넣는 키, 일어난 쪼개기와 올라간 키, 넣은 뒤의 트리)
    ("F", [], "[F]"),
    ("S", [], "[F S]"),
    ("Q", [], "[F Q S]"),
    ("K", ["뿌리 쪼갬(Q)"], "[Q] / [F K] [S]"),
    ("C", [], "[Q] / [C F K] [S]"),
    ("L", ["자식 쪼갬(F)"], "[F Q] / [C] [K L] [S]"),
    ("H", [], "[F Q] / [C] [H K L] [S]"),
    ("T", [], "[F Q] / [C] [H K L] [S T]"),
    ("V", [], "[F Q] / [C] [H K L] [S T V]"),
    ("W", ["자식 쪼갬(T)"], "[F Q T] / [C] [H K L] [S] [V W]"),
    ("M", ["뿌리 쪼갬(Q)", "자식 쪼갬(K)"], "[Q] / [F K] [T] / [C] [H] [L M] | [S] [V W]"),
    ("R", [], "[Q] / [F K] [T] / [C] [H] [L M] | [R S] [V W]"),
    ("N", [], "[Q] / [F K] [T] / [C] [H] [L M N] | [R S] [V W]"),
    ("P", ["자식 쪼갬(M)"], "[Q] / [F K M] [T] / [C] [H] [L] [N P] | [R S] [V W]"),
    ("A", ["자식 쪼갬(K)"], "[K Q] / [F] [M] [T] / [A C] [H] | [L] [N P] | [R S] [V W]"),
    ("B", [], "[K Q] / [F] [M] [T] / [A B C] [H] | [L] [N P] | [R S] [V W]"),
    ("X", [], "[K Q] / [F] [M] [T] / [A B C] [H] | [L] [N P] | [R S] [V W X]"),
    ("Y", ["자식 쪼갬(W)"], "[K Q] / [F] [M] [T W] / [A B C] [H] | [L] [N P] | [R S] [V] [X Y]"),
    ("D", ["자식 쪼갬(B)"], "[K Q] / [B F] [M] [T W] / [A] [C D] [H] | [L] [N P] | [R S] [V] [X Y]"),
    ("Z", [], "[K Q] / [B F] [M] [T W] / [A] [C D] [H] | [L] [N P] | [R S] [V] [X Y Z]"),
    ("E", [], "[K Q] / [B F] [M] [T W] / [A] [C D E] [H] | [L] [N P] | [R S] [V] [X Y Z]"),
]
ANSWER = "[K Q] / [B F] [M] [T W] / [A] [C D E] [H] | [L] [N P] | [R S] [V] [X Y Z]"


def main():
    t = 2
    keys = "F S Q K C L H T V W M R N P A B X Y D Z E".split()
    assert len(keys) == 21 and len(set(keys)) == 21 and [row[0] for row in TRACE] == keys
    root = Node()
    heights = []
    for k, want_splits, want_tree in TRACE:
        log = []
        root = insert(root, k, t, log)
        heights.append(check(root, t))
        print("%s: %s%s" % (k, (", ".join(log) + " -> ") if log else "", show(root)))
        assert log == want_splits and show(root) == want_tree, (k, log, show(root))
    assert show(root) == ANSWER
    # 높이가 는 것은 뿌리를 쪼갠 K와 M 두 번뿐이다
    grew = [k for j, k in enumerate(keys) if heights[j] > (heights[j - 1] if j else 0)]
    assert grew == ["K", "M"] and heights[-1] == 2
    # 쪼개기는 삽입 8번에서 모두 9번(뿌리 2번 + 자식 7번)
    assert sum(len(row[1]) for row in TRACE) == 9 and sum(1 for row in TRACE if row[1]) == 8
    assert sum(a.startswith("뿌리") for row in TRACE for a in row[1]) == 2
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
