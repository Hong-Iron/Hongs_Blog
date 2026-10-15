---
layout: "note"
title: "17_b-tree-practice_p6.py"
display_title: "17_b-tree-practice_p6.py"
kind: "code"
kind_label: "코드 · 문제 6 풀이"
num: "17"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-practice/"
parent_title: "B-트리 연습"
description: "데이터베이스 설계 · B-트리 연습 문제 6 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/17_b-tree-practice_p6/"
---
{% raw %}
[B-트리 연습](/Hongs_Blog/studies/database-design/b-tree-practice/) 문서의 문제 6 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리 연습 p6: t = 3인 트리에서 C, P, V를 차례로 지운다.

처음 트리: [E L P T X] / [A C] [J K] [N O] [Q R S] [U V] [Y Z]
오른쪽 형제를 먼저 보는 규칙의 결과:
      C 뒤 [L P T X] / [A E J K] [N O] [Q R S] [U V] [Y Z]
      P 뒤 [L Q T X] / [A E J K] [N O] [R S] [U V] [Y Z]
      V 뒤 [L Q T]   / [A E J K] [N O] [R S] [U X Y Z]
왼쪽 형제를 먼저 보는 규칙으로는 P와 V의 결과가 다르다.
      P 뒤 [K O T X] / [A E J] [L N] [Q R S] [U V] [Y Z]
      V 뒤 [K O S X] / [A E J] [L N] [Q R] [T U] [Y Z]
이 파일은 두 결과를 모두 만들고, 둘 다 올바른 B-트리이며 담긴 키가 같다는 것을 확인한다.
실행: python3 17_b-tree-practice_p6.py
"""


class Node:
    def __init__(self, keys=None, ch=None):
        self.keys = list(keys or [])
        self.ch = list(ch or [])

    @property
    def leaf(self):
        return not self.ch


def T(spec):
    """잎은 'A C' 같은 문자열, 내부 노드는 (키, [자식, ...])."""
    if isinstance(spec, tuple):
        return Node(spec[0].split(), [T(c) for c in spec[1]])
    return Node(spec.split())


def show(root):
    out, cur = [], [[root]]
    while cur:
        out.append(" | ".join(" ".join("[" + " ".join(n.keys) + "]" for n in grp) for grp in cur))
        cur = [n.ch for grp in cur for n in grp if n.ch]
    return " / ".join(out)


def inorder(x):
    if x.leaf:
        return list(x.keys)
    out = []
    for i, c in enumerate(x.ch):
        out += inorder(c)
        if i < len(x.keys):
            out.append(x.keys[i])
    return out


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


def delete(root, k, t, first, log):
    """잎에서 지우고, 키가 모자라면 위로 올라가며 고친다. first는 먼저 보는 형제."""
    path = []
    x = root
    while k not in x.keys:
        i = sum(1 for a in x.keys if a < k)
        path.append((x, i))
        x = x.ch[i]
    if not x.leaf:                                   # 경우 2: 선행 키를 올리고 잎에서 지운다
        i = x.keys.index(k)
        path.append((x, i))
        y = x.ch[i]
        while not y.leaf:
            path.append((y, len(y.ch) - 1))
            y = y.ch[-1]
        x.keys[i] = y.keys.pop()
        log.append("2(선행 키 %s)" % x.keys[i])
        x = y
    else:
        x.keys.remove(k)
    if len(x.keys) >= t - 1 or not path:
        log.append("1-1")
    while path and len(x.keys) < t - 1:
        p, i = path.pop()
        left = p.ch[i - 1] if i > 0 else None
        right = p.ch[i + 1] if i + 1 < len(p.ch) else None
        done = False
        for side in (["L", "R"] if first == "left" else ["R", "L"]):
            if side == "L" and left is not None and len(left.keys) >= t:      # 경우 1-2a: 왼쪽에서 빌린다
                x.keys.insert(0, p.keys[i - 1])
                p.keys[i - 1] = left.keys.pop()
                if left.ch:
                    x.ch.insert(0, left.ch.pop())
                log.append("1-2a(왼쪽)")
                done = True
                break
            if side == "R" and right is not None and len(right.keys) >= t:    # 경우 1-2a: 오른쪽에서 빌린다
                x.keys.append(p.keys[i])
                p.keys[i] = right.keys.pop(0)
                if right.ch:
                    x.ch.append(right.ch.pop(0))
                log.append("1-2a(오른쪽)")
                done = True
                break
        if done:
            break
        if first == "left":                                                    # 경우 1-2b: 합친다
            side = "L" if left is not None else "R"
        else:
            side = "R" if right is not None else "L"
        if side == "L":
            left.keys += [p.keys.pop(i - 1)] + x.keys
            left.ch += x.ch
            p.ch.pop(i)
            log.append("1-2b(왼쪽)")
        else:
            x.keys += [p.keys.pop(i)] + right.keys
            x.ch += right.ch
            p.ch.pop(i + 1)
            log.append("1-2b(오른쪽)")
        x = p
    if not root.keys and root.ch:
        root = root.ch[0]
        log.append("높이 1 줄어듦")
    return root


START = ("E L P T X", ["A C", "J K", "N O", "Q R S", "U V", "Y Z"])

LEFT_FIRST = [      # 왼쪽 형제 먼저 (문서의 첫 답)
    ("C", ["1-2b(오른쪽)"], "[L P T X] / [A E J K] [N O] [Q R S] [U V] [Y Z]"),
    ("P", ["2(선행 키 O)", "1-2a(왼쪽)"], "[K O T X] / [A E J] [L N] [Q R S] [U V] [Y Z]"),
    ("V", ["1-2a(왼쪽)"], "[K O S X] / [A E J] [L N] [Q R] [T U] [Y Z]"),
]
RIGHT_FIRST = [     # 오른쪽 형제 먼저 (문서의 둘째 답)
    ("C", ["1-2b(오른쪽)"], "[L P T X] / [A E J K] [N O] [Q R S] [U V] [Y Z]"),
    ("P", ["2(선행 키 O)", "1-2a(오른쪽)"], "[L Q T X] / [A E J K] [N O] [R S] [U V] [Y Z]"),
    ("V", ["1-2b(오른쪽)"], "[L Q T] / [A E J K] [N O] [R S] [U X Y Z]"),
]


def main():
    t = 3
    finals = {}
    for first, steps in (("left", LEFT_FIRST), ("right", RIGHT_FIRST)):
        root = T(START)
        check(root, t)
        print("왼쪽 형제 먼저" if first == "left" else "오른쪽 형제 먼저")
        for k, cases, want in steps:
            log = []
            root = delete(root, k, t, first, log)
            check(root, t)
            print("  %s 삭제  %-28s %s" % (k, " -> ".join(log), show(root)))
            assert log == cases and show(root) == want, (first, k, log, show(root))
        finals[first] = inorder(root)
    # 두 결과는 모양만 다르고 담긴 키는 같다
    assert finals["left"] == finals["right"] == sorted(set("ACEJKLNOPQRSTUVXYZ") - set("CPV"))
    # 풀이의 "P 뒤" 그림에서 V를 왼쪽 먼저로 지우면 또 다른 모양이 나온다
    root = T(("L Q T X", ["A E J K", "N O", "R S", "U V", "Y Z"]))
    log = []
    root = delete(root, "V", t, "left", log)
    check(root, t)
    assert log == ["1-2b(왼쪽)"] and show(root) == "[L Q X] / [A E J K] [N O] [R S T U] [Y Z]"
    print("오른쪽 먼저로 P까지 지운 트리에서 V를 왼쪽 먼저로:", show(root))
    # 첫 단계 C는 왼쪽 형제가 없어서 어느 쪽을 먼저 보든 같다
    assert LEFT_FIRST[0] == RIGHT_FIRST[0]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
