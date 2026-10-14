---
layout: "note"
title: "17_b-tree-delete_impl.py"
display_title: "17_b-tree-delete_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "17"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-delete/"
parent_title: "B-트리 삭제"
description: "데이터베이스 설계 · B-트리 삭제 구현 코드"
sitemap: false
permalink: "/studies/database-design/code/17_b-tree-delete_impl/"
---
{% raw %}
[B-트리 삭제](/Hongs_Blog/studies/database-design/b-tree-delete/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리 삭제 구현과 검증: 잎에서 지우고, 모자라면 위로 올라가며 고친다.

문서: 17.B-트리 삭제, 연습 17.B-트리 삭제 예제 사다리
출처: 04.4-1_B-tree-deletion.pdf p.13~21, 04.4_B-tree-solutions.pdf p.4
주의: 교재(CLRS)의 삭제는 내려가는 길에 미리 키를 채워 두는 방식이다. 이 코드는 그 방식이 아니라 슬라이드의 방식이다.
인덱스: 0부터 센다. keys[i]의 왼쪽 자식은 ch[i], 오른쪽 자식은 ch[i + 1]이다.
실행: python3 17_b-tree-delete_impl.py

규칙 (4-1 p.13~20)
  경우 2    지울 키가 내부 노드에 있다 -> 선행 키(왼쪽 서브트리에서 가장 큰 키, 늘 잎에 있다)를 그 자리에 올리고,
            잎에서 선행 키를 지운다. 그다음은 경우 1이다.
  경우 1-1  키를 지운 잎에 키가 t - 1개 이상 남는다 -> 끝.
  경우 1-2a 모자란다. 왼쪽 형제에 키가 t개 이상이면 왼쪽에서, 아니면 오른쪽 형제에 t개 이상이면 오른쪽에서 빌린다.
            형제의 키는 부모로 올라가고, 부모의 키가 내려온다.
  경우 1-2b 두 형제 모두 t - 1개뿐이다 -> 부모의 키 하나를 내려 형제와 한 노드로 합친다.
            부모의 키가 하나 줄었으니 부모에서 1-2a, 1-2b를 다시 본다.
  높이      뿌리의 키가 0개가 되면 하나 남은 자식이 새 뿌리가 된다.

확인하는 것
  1. 슬라이드 그림 여섯 장면(p.14~20)을 그대로 재현한다. p.17과 p.20의 마지막 그림은 잎 하나가 잘못 그려져 있다.
  2. 연습 4(p.21)를 왼쪽 형제 먼저(본문 규칙)와 오른쪽 형제 먼저(풀이 4s p.4) 두 가지로 푼다.
  3. 무작위 삽입·삭제: 지울 때마다 B-트리 성질이 지켜지고, 차례로 읽으면 정렬된 목록과 같다.
  4. 예제 사다리와 확인 문제의 답.
  5. 교재(CLRS)식 삭제도 구현해 견준다. 같은 키를 지워도 결과의 모양이 다를 수 있다(둘 다 올바른 B-트리다).
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
    if x.leaf:
        return list(x.keys)
    out = []
    for i, c in enumerate(x.ch):
        out += inorder(c)
        if i < len(x.keys):
            out.append(x.keys[i])
    return out


def height(x):
    return 0 if x.leaf else 1 + height(x.ch[0])


def check(root, t):
    """B-트리 성질을 모두 확인하고 높이를 돌려준다. 어기면 AssertionError."""
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


# ---------------------------------------------------------------- 삽입 (무작위 시험용, 3-2 p.21~27)

def split_child(x, i, t):
    y = x.ch[i]
    z = Node(y.keys[t:], y.ch[t:])
    mid = y.keys[t - 1]
    y.keys = y.keys[:t - 1]
    y.ch = y.ch[:t]
    x.ch.insert(i + 1, z)
    x.keys.insert(i, mid)


def insert(root, k, t):
    if len(root.keys) == 2 * t - 1:
        root = Node([], [root])
        split_child(root, 0, t)
    x = root
    while not x.leaf:
        i = sum(1 for a in x.keys if a < k)
        if len(x.ch[i].keys) == 2 * t - 1:
            split_child(x, i, t)
            if k > x.keys[i]:
                i += 1
        x = x.ch[i]
    x.keys.append(k)
    x.keys.sort()
    return root


# ---------------------------------------------------------------- 삭제 (4-1 p.13~20)

def delete(root, k, t, first="left", log=None):
    """키 k를 지우고 새 뿌리를 돌려준다.

    first: 빌리거나 합칠 때 먼저 보는 형제. "left"가 슬라이드 본문(p.16)의 규칙이다.
    log:   거친 경우의 이름을 차례로 담는다.
    """
    log = [] if log is None else log
    # 1) k가 있는 노드까지 내려가며 지나온 길을 적는다: (부모, 부모의 몇 번째 자식으로 내려갔나)
    path = []
    x = root
    while k not in x.keys:
        if x.leaf:
            raise KeyError(k)
        i = sum(1 for a in x.keys if a < k)
        path.append((x, i))
        x = x.ch[i]
    # 2) 경우 2: 내부 노드의 키면 선행 키를 올리고, 지울 자리를 잎으로 옮긴다
    if not x.leaf:
        i = x.keys.index(k)
        path.append((x, i))
        y = x.ch[i]
        while not y.leaf:                      # 왼쪽 서브트리의 가장 오른쪽 잎까지
            path.append((y, len(y.ch) - 1))
            y = y.ch[-1]
        x.keys[i] = y.keys.pop()               # 그 잎의 마지막 키가 선행 키
        log.append("2(선행 키 %s)" % x.keys[i])
        x = y
    else:
        x.keys.remove(k)
    # 3) 경우 1: 잎에서 시작해, 키가 모자란 동안 위로 올라가며 고친다
    if len(x.keys) >= t - 1 or not path:
        log.append("1-1")
    while path and len(x.keys) < t - 1:
        p, i = path.pop()                      # x는 p의 i번째 자식
        left = p.ch[i - 1] if i > 0 else None
        right = p.ch[i + 1] if i + 1 < len(p.ch) else None
        order = ["L", "R"] if first == "left" else ["R", "L"]
        done = False
        for side in order:                     # 경우 1-2a: 키가 t개 이상인 형제에게서 빌린다
            if side == "L" and left is not None and len(left.keys) >= t:
                x.keys.insert(0, p.keys[i - 1])        # 부모의 키가 내려오고
                p.keys[i - 1] = left.keys.pop()        # 왼쪽 형제의 가장 큰 키가 부모로 올라간다
                if left.ch:
                    x.ch.insert(0, left.ch.pop())      # 내부 노드면 자식도 하나 따라온다
                log.append("1-2a(왼쪽)")
                done = True
                break
            if side == "R" and right is not None and len(right.keys) >= t:
                x.keys.append(p.keys[i])
                p.keys[i] = right.keys.pop(0)          # 오른쪽 형제의 가장 작은 키가 부모로 올라간다
                if right.ch:
                    x.ch.append(right.ch.pop(0))
                log.append("1-2a(오른쪽)")
                done = True
                break
        if done:
            break
        # 경우 1-2b: 부모의 키 하나를 내려 형제와 합친다
        if first == "left":
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
        x = p                                  # 키가 하나 준 부모를 다시 본다
    # 4) 뿌리가 비면 하나 남은 자식이 새 뿌리다
    if not root.keys and root.ch:
        root = root.ch[0]
        log.append("높이 1 줄어듦")
    return root


def delete_clrs(root, k, t):
    """견주기용: 교재(CLRS 18.3)의 삭제. 내려가는 노드가 늘 키 t개 이상이 되도록 미리 빌리거나 합친다.

    형제가 둘이면 왼쪽을 먼저 본다(교재는 순서를 정하지 않는다).
    """

    def rec(x, k):
        if k in x.keys:
            i = x.keys.index(k)
            if x.leaf:                                   # 경우 1: 잎에서 지운다
                x.keys.pop(i)
                return
            y, z = x.ch[i], x.ch[i + 1]
            if len(y.keys) >= t:                         # 경우 2a: 선행 키로 바꾸고 왼쪽 자식에서 지운다
                q = y
                while not q.leaf:
                    q = q.ch[-1]
                x.keys[i] = q.keys[-1]
                rec(y, x.keys[i])
            elif len(z.keys) >= t:                       # 경우 2b: 후속 키로 바꾸고 오른쪽 자식에서 지운다
                q = z
                while not q.leaf:
                    q = q.ch[0]
                x.keys[i] = q.keys[0]
                rec(z, x.keys[i])
            else:                                        # 경우 2c: 두 자식과 k를 합친 뒤 거기서 지운다
                y.keys += [k] + z.keys
                y.ch += z.ch
                x.keys.pop(i)
                x.ch.pop(i + 1)
                rec(y, k)
            return
        if x.leaf:
            raise KeyError(k)
        i = sum(1 for a in x.keys if a < k)
        c = x.ch[i]
        if len(c.keys) == t - 1:                         # 경우 3: 내려갈 자식이 최소 개수뿐이면 미리 채운다
            left = x.ch[i - 1] if i > 0 else None
            right = x.ch[i + 1] if i + 1 < len(x.ch) else None
            if left is not None and len(left.keys) >= t:             # 3a: 왼쪽 형제에게서
                c.keys.insert(0, x.keys[i - 1])
                x.keys[i - 1] = left.keys.pop()
                if left.ch:
                    c.ch.insert(0, left.ch.pop())
            elif right is not None and len(right.keys) >= t:         # 3a: 오른쪽 형제에게서
                c.keys.append(x.keys[i])
                x.keys[i] = right.keys.pop(0)
                if right.ch:
                    c.ch.append(right.ch.pop(0))
            elif left is not None:                                   # 3b: 왼쪽 형제와 합친다
                left.keys += [x.keys.pop(i - 1)] + c.keys
                left.ch += c.ch
                x.ch.pop(i)
                c = left
            else:                                                    # 3b: 오른쪽 형제와 합친다
                c.keys += [x.keys.pop(i)] + right.keys
                c.ch += right.ch
                x.ch.pop(i + 1)
        rec(c, k)

    rec(root, k)
    if not root.keys and root.ch:
        root = root.ch[0]
    return root


# ---------------------------------------------------------------- 검증

def expect(name, root, want, t, log=None, cases=None):
    check(root, t)
    got = show(root)
    assert got == show(T(want)), "%s\n  나온 것: %s\n  기대한 것: %s" % (name, got, show(T(want)))
    if cases is not None:
        assert log == cases, "%s: 경우 %s, 기대 %s" % (name, log, cases)
    print("[OK] %s%s: %s" % (name, "" if log is None else " (" + " -> ".join(log) + ")", got))


def base():
    """4-1 p.14의 t = 2 트리."""
    return T(("20 40", [("10", ["5", "15"]), ("30 33", ["25 28", "31 32", "35"]), ("50 60", ["45", "55", "65"])]))


def ex4():
    """4-1 p.21 연습 4의 t = 3 트리."""
    return T(("E L P T X", ["A C", "J K", "N O", "Q R S", "U V", "Y Z"]))


def main():
    # 1. 슬라이드 그림 (4-1 p.14~20), t = 2
    t = 2
    r = base()
    check(r, t)
    lg = []
    r = delete(r, 32, t, log=lg)
    expect("p.14 32 삭제", r, ("20 40", [("10", ["5", "15"]), ("30 33", ["25 28", "31", "35"]), ("50 60", ["45", "55", "65"])]),
           t, lg, ["1-1"])
    lg = []
    r = delete(r, 31, t, log=lg)
    expect("p.16 31 삭제", r, ("20 40", [("10", ["5", "15"]), ("28 33", ["25", "30", "35"]), ("50 60", ["45", "55", "65"])]),
           t, lg, ["1-2a(왼쪽)"])
    lg = []
    r = delete(r, 30, t, log=lg)
    expect("p.17 30 삭제", r, ("20 40", [("10", ["5", "15"]), ("33", ["25 28", "35"]), ("50 60", ["45", "55", "65"])]),
           t, lg, ["1-2b(왼쪽)"])
    # p.17의 마지막 그림은 [33]의 둘째 잎을 [45]로 그렸다. 그 그림대로면 B-트리가 아니다(45는 40보다 크다).
    slide_p17 = T(("20 40", [("10", ["5", "15"]), ("33", ["25 28", "45"]), ("50 60", ["45", "55", "65"])]))
    try:
        check(slide_p17, t)
        raise SystemExit("p.17 그림이 통과했다")
    except AssertionError as e:
        print("[OK] p.17의 그려진 그림([33] 밑에 [45])은 성질을 어긴다:", e)
    assert 35 in inorder(r) and inorder(r).count(45) == 1

    r = base()
    lg = []
    r = delete(r, 33, t, log=lg)
    expect("p.18 33 삭제", r, ("20 40", [("10", ["5", "15"]), ("30 32", ["25 28", "31", "35"]), ("50 60", ["45", "55", "65"])]),
           t, lg, ["2(선행 키 32)", "1-1"])

    r = T(("20 40", [("10", ["5", "15"]), ("30 32", ["25", "31", "35"]), ("50 60", ["45", "55", "65"])]))
    check(r, t)
    lg = []
    r = delete(r, 30, t, log=lg)
    expect("p.19 30 삭제", r, ("20 40", [("10", ["5", "15"]), ("32", ["25 31", "35"]), ("50 60", ["45", "55", "65"])]),
           t, lg, ["2(선행 키 25)", "1-2b(오른쪽)"])

    r = T(("20", [("10", ["5", "15"]), ("35", ["30", "70"])]))
    check(r, t)
    lg = []
    r = delete(r, 10, t, log=lg)
    expect("p.20 10 삭제", r, ("20 35", ["5 15", "30", "70"]), t, lg,
           ["2(선행 키 5)", "1-2b(오른쪽)", "1-2b(오른쪽)", "높이 1 줄어듦"])
    assert height(r) == 1
    # p.20의 마지막 그림은 첫 잎을 [5 35]로 그렸다. 15가 사라지고 35가 두 번 나온다.
    slide_p20 = T(("20 35", ["5 35", "30", "70"]))
    try:
        check(slide_p20, t)
        raise SystemExit("p.20 그림이 통과했다")
    except AssertionError as e:
        print("[OK] p.20의 그려진 그림(첫 잎 [5 35])은 성질을 어긴다:", e)
    assert inorder(r) == [5, 15, 20, 30, 35, 70]

    # 빌릴 때 형제의 키를 부모를 거치지 않고 곧장 가져오면 범위가 깨진다 (문서의 오해 항목)
    wrong = T(("20 40", [("10", ["5", "15"]), ("30 33", ["25", "28", "35"]), ("50 60", ["45", "55", "65"])]))
    try:
        check(wrong, t)
        raise SystemExit("곧장 가져온 그림이 통과했다")
    except AssertionError:
        print("[OK] 31을 지우고 28을 곧장 옮긴 [30 33] / [25] [28] [35]는 성질을 어긴다")

    # 2. 연습 4 (4-1 p.21, 풀이 4s p.4), t = 3: C, P, V를 차례로 지운다
    t = 3
    # (가) 본문 규칙: 왼쪽 형제 먼저
    r = ex4()
    check(r, t)
    lg = []
    r = delete(r, "C", t, "left", lg)
    expect("연습 4 C (왼쪽 먼저)", r, ("L P T X", ["A E J K", "N O", "Q R S", "U V", "Y Z"]), t, lg, ["1-2b(오른쪽)"])
    lg = []
    r = delete(r, "P", t, "left", lg)
    expect("연습 4 P (왼쪽 먼저)", r, ("K O T X", ["A E J", "L N", "Q R S", "U V", "Y Z"]), t, lg, ["2(선행 키 O)", "1-2a(왼쪽)"])
    lg = []
    r = delete(r, "V", t, "left", lg)
    expect("연습 4 V (왼쪽 먼저)", r, ("K O S X", ["A E J", "L N", "Q R", "T U", "Y Z"]), t, lg, ["1-2a(왼쪽)"])
    left_final = inorder(r)
    # (나) 풀이 쪽: 오른쪽 형제 먼저
    r = ex4()
    lg = []
    r = delete(r, "C", t, "right", lg)
    expect("연습 4 C (오른쪽 먼저)", r, ("L P T X", ["A E J K", "N O", "Q R S", "U V", "Y Z"]), t, lg, ["1-2b(오른쪽)"])
    lg = []
    r = delete(r, "P", t, "right", lg)
    expect("연습 4 P (오른쪽 먼저)", r, ("L Q T X", ["A E J K", "N O", "R S", "U V", "Y Z"]), t, lg, ["2(선행 키 O)", "1-2a(오른쪽)"])
    lg = []
    r = delete(r, "V", t, "right", lg)
    expect("연습 4 V (오른쪽 먼저)", r, ("L Q T", ["A E J K", "N O", "R S", "U X Y Z"]), t, lg, ["1-2b(오른쪽)"])
    assert inorder(r) == left_final == sorted(set("ACEJKLNOPQRSTUVXYZ") - set("CPV"))
    # (다) 풀이의 P 뒤 그림에서 V만 왼쪽 먼저로 지우면
    r = T(("L Q T X", ["A E J K", "N O", "R S", "U V", "Y Z"]))
    lg = []
    r = delete(r, "V", t, "left", lg)
    expect("연습 4 V (풀이의 P 뒤 그림 + 왼쪽 먼저)", r, ("L Q X", ["A E J K", "N O", "R S T U", "Y Z"]), t, lg, ["1-2b(왼쪽)"])

    # 3. 무작위 삽입·삭제
    rnd = random.Random(20261012)
    deletes = trees = shrink = 0
    seen = set()
    for t in (2, 3, 4, 5):
        for first in ("left", "right"):
            for j in range(120):
                n = 1 + (j * 37) % 90                                          # 트리마다 키 1~90개(크기는 정해 둔다)
                keys = rnd.sample(range(1000), n)
                r = Node()
                for k in keys:
                    r = insert(r, k, t)
                check(r, t)
                alive = sorted(keys)
                rnd.shuffle(keys)
                for k in keys:
                    h0 = height(r)
                    lg = []
                    r = delete(r, k, t, first, lg)
                    alive.remove(k)
                    h1 = check(r, t)
                    assert inorder(r) == alive
                    assert h1 == h0 - (1 if lg[-1] == "높이 1 줄어듦" else 0)   # 높이는 뿌리가 빌 때만 1 준다
                    assert sum(a.startswith("1-2b") for a in lg) <= h0
                    shrink += lg[-1] == "높이 1 줄어듦"
                    seen.update(a.split("(")[0] for a in lg)
                    deletes += 1
                assert r.leaf and not r.keys                                   # 다 지우면 빈 잎 하나
                try:
                    delete(r, 1, t, first)
                    raise SystemExit("없는 키를 지웠다")
                except KeyError:
                    pass
                trees += 1
    assert seen == {"1-1", "1-2a", "1-2b", "2", "높이 1 줄어듦"}
    assert deletes == 43680 and trees == 960                                   # 문서에 적은 횟수
    print("[OK] 무작위 삭제 %d번(트리 %d개, t = 2~5, 왼쪽 먼저·오른쪽 먼저): 성질 유지, 정렬된 목록과 일치, 높이는 뿌리가 빈 %d번에서만 줄었다"
          % (deletes, trees, shrink))

    # 4-1. 예제 사다리 (연습 17.B-트리 삭제 예제 사다리)
    t = 2
    # 문제 2: [20 40] / [10] [25 30 35] [50 60] 에서 60, 10, 50
    r = T(("20 40", ["10", "25 30 35", "50 60"]))
    check(r, t)
    lg = []
    r = delete(r, 60, t, log=lg)
    expect("사다리 2-1 (60)", r, ("20 40", ["10", "25 30 35", "50"]), t, lg, ["1-1"])
    lg = []
    r = delete(r, 10, t, log=lg)
    expect("사다리 2-2 (10)", r, ("25 40", ["20", "30 35", "50"]), t, lg, ["1-2a(오른쪽)"])
    lg = []
    r = delete(r, 50, t, log=lg)
    expect("사다리 2-3 (50)", r, ("25 35", ["20", "30", "40"]), t, lg, ["1-2a(왼쪽)"])
    # 문제 3: [30 60] / [10 20] [40] [70] 에서 40, 60, 30을 차례로
    r = T(("30 60", ["10 20", "40", "70"]))
    check(r, t)
    lg = []
    r = delete(r, 40, t, log=lg)
    expect("사다리 3-1 (40)", r, ("20 60", ["10", "30", "70"]), t, lg, ["1-2a(왼쪽)"])
    lg = []
    r = delete(r, 60, t, log=lg)
    expect("사다리 3-2 (60)", r, ("30", ["10 20", "70"]), t, lg, ["2(선행 키 30)", "1-2b(왼쪽)"])
    lg = []
    r = delete(r, 30, t, log=lg)
    expect("사다리 3-3 (30)", r, ("20", ["10", "70"]), t, lg, ["2(선행 키 20)", "1-1"])
    # 문제 4: 높이 2인 트리에서 30, 50, 40을 지우면 마지막에 높이가 준다
    r = T(("40", [("20", ["5", "30"]), ("60 80", ["50", "70", "90"])]))
    check(r, t)
    lg = []
    r = delete(r, 30, t, log=lg)
    expect("사다리 4-1 (30)", r, ("60", [("40", ["5 20", "50"]), ("80", ["70", "90"])]), t, lg,
           ["1-2b(왼쪽)", "1-2a(오른쪽)"])
    lg = []
    r = delete(r, 50, t, log=lg)
    expect("사다리 4-2 (50)", r, ("60", [("20", ["5", "40"]), ("80", ["70", "90"])]), t, lg, ["1-2a(왼쪽)"])
    lg = []
    r = delete(r, 40, t, log=lg)
    expect("사다리 4-3 (40)", r, ("60 80", ["5 20", "70", "90"]), t, lg,
           ["1-2b(왼쪽)", "1-2b(오른쪽)", "높이 1 줄어듦"])

    # 4-2. 확인 문제 (17.B-트리 삭제)
    # C1: p.14 트리에서 45 삭제 -> 1-2b(오른쪽)
    r = base()
    lg = []
    r = delete(r, 45, 2, log=lg)
    assert lg == ["1-2b(오른쪽)"]
    assert show(r) == "[20 40] / [10] [30 33] [60] / [5] [15] | [25 28] [31 32] [35] | [50 55] [65]"
    # C2: p.14 트리에서 40 삭제 -> 선행 키 35, 1-2a(왼쪽)
    r = base()
    lg = []
    r = delete(r, 40, 2, log=lg)
    assert lg == ["2(선행 키 35)", "1-2a(왼쪽)"]
    assert show(r) == "[20 35] / [10] [30 32] [50 60] / [5] [15] | [25 28] [31] [33] | [45] [55] [65]"
    # C5: p.14 트리에서 15 삭제 -> 잎 합치기, 부모가 비어 오른쪽 형제에게서 빌림(자식도 하나 따라온다)
    r = base()
    lg = []
    r = delete(r, 15, 2, log=lg)
    assert lg == ["1-2b(왼쪽)", "1-2a(오른쪽)"]
    assert show(r) == "[30 40] / [20] [33] [50 60] / [5 10] [25 28] | [31 32] [35] | [45] [55] [65]"
    print("[OK] 예제 사다리 문제 2~4와 확인 문제(C1, C2, C5)의 답")

    # 5. 교재(CLRS)식 삭제와 견주기
    start = ("40", [("20", ["10 15", "30"]), ("60", ["50", "70"])])
    a = delete(T(start), 15, 2)
    b = delete_clrs(T(start), 15, 2)
    check(a, 2)
    check(b, 2)
    assert show(a) == "[40] / [20] [60] / [10] [30] | [50] [70]" and height(a) == 2        # 수업 방식: 잎에서 빼고 끝
    assert show(b) == "[20 40 60] / [10] [30] [50] [70]" and height(b) == 1                # 교재 방식: 내려가며 미리 합친다
    assert inorder(a) == inorder(b)
    rnd = random.Random(7)
    same = diff = 0
    for t in (2, 3, 4):
        for j in range(150):
            n = 1 + (j * 37) % 60
            keys = rnd.sample(range(500), n)
            ra, rb = Node(), Node()
            for k in keys:
                ra = insert(ra, k, t)
                rb = insert(rb, k, t)
            alive = sorted(keys)
            rnd.shuffle(keys)
            for k in keys:
                ra = delete(ra, k, t)
                rb = delete_clrs(rb, k, t)
                alive.remove(k)
                check(ra, t)
                check(rb, t)
                assert inorder(ra) == inorder(rb) == alive
                if show(ra) == show(rb):
                    same += 1
                else:
                    diff += 1
    assert diff > 0 and same > 0 and same + diff == 13635 and diff * 2 > same + diff   # 절반 넘게 모양이 다르다
    print("[OK] 교재(CLRS)식 삭제와 견줌: [40] / [20] [60] / [10 15] [30] | [50] [70]에서 15를 지우면 수업 방식은 높이 2 그대로,"
          " 교재 방식은 높이 1. 무작위 %d번 가운데 모양이 달라진 때가 %d번(담긴 키는 늘 같다)" % (same + diff, diff))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
