---
layout: "note"
title: "48_activation-tree_verify.py"
display_title: "48_activation-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/activation-tree/"
parent_title: "활성 트리와 호출 스택"
description: "컴파일러 · 활성 트리와 호출 스택 검증 코드"
permalink: "/studies/compilers/code/48_activation-tree_verify/"
---
{% raw %}
[활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 활성 트리와 호출 스택.
# 실행: python3 48_activation-tree_verify.py  (표준 라이브러리만 쓴다)
# 슬라이드 14회 p.13~22의 fib(3) 활성 트리와 스택 그림을 실행으로 다시 만든다.
import random


def trace_fib(n):
    """main이 fib(n)을 부르는 실행을 따라가며 (사건, 스택 사본)과 트리 간선을 모은다."""
    stack, events, edges, intervals = [], [], [], {}
    clock = [0]
    counter = [0]

    def enter(name):
        counter[0] += 1
        node = (name, counter[0])            # 같은 fib(1)이 두 번 불리므로 번호로 구별한다
        if stack:
            edges.append((stack[-1], node))
        stack.append(node)
        clock[0] += 1
        intervals[node] = [clock[0], None]
        events.append(("call", [x[0] for x in stack]))
        return node

    def leave(node):
        assert stack[-1] is node             # 맨 위에 있는 것만 끝난다
        stack.pop()
        clock[0] += 1
        intervals[node][1] = clock[0]
        events.append(("return", [x[0] for x in stack]))

    def fib(k):
        node = enter(f"fib({k})")
        r = k if k <= 1 else fib(k - 1) + fib(k - 2)
        leave(node)
        return r

    m = enter("main")
    value = fib(n)
    leave(m)
    return value, events, edges, intervals


if __name__ == "__main__":
    value, events, edges, intervals = trace_fib(3)
    assert value == 2
    # ---- p.13: 활성 트리 ----
    tree = sorted((p[0], c[0]) for p, c in edges)
    assert tree == sorted([("main", "fib(3)"), ("fib(3)", "fib(2)"), ("fib(3)", "fib(1)"),
                           ("fib(2)", "fib(1)"), ("fib(2)", "fib(0)")])
    assert len(intervals) == 6               # main 1개 + fib 활성 5개
    # ---- p.14~22: 스택의 모습 (맨 뒤가 지금 실행 중인 함수) ----
    snaps = [s for _, s in events]
    assert snaps == [
        ["main"],                                        # p.14
        ["main", "fib(3)"],                              # p.15
        ["main", "fib(3)", "fib(2)"],                    # p.16
        ["main", "fib(3)", "fib(2)", "fib(1)"],          # p.17
        ["main", "fib(3)", "fib(2)"],                    # p.18: fib(1)이 빠졌다
        ["main", "fib(3)", "fib(2)", "fib(0)"],          # p.19
        ["main", "fib(3)", "fib(2)"],
        ["main", "fib(3)"],                              # p.20: fib(0), fib(2)가 빠졌다
        ["main", "fib(3)", "fib(1)"],                    # p.21
        ["main", "fib(3)"],
        ["main"],
        [],                                              # p.22: 모두 끝났다
    ]
    # 대기 중인 함수 = 맨 위를 뺀 나머지 (p.17: fib(2), fib(3), main)
    assert snaps[3][-1] == "fib(1)" and snaps[3][:-1][::-1] == ["fib(2)", "fib(3)", "main"]
    assert max(len(s) for s in snaps) == 4

    # ---- 활성의 수명은 서로 겹치지 않거나 한쪽이 다른 쪽을 완전히 품는다 (p.13 "properly nested") ----
    iv = list(intervals.values())
    for a in iv:
        for b in iv:
            if a is not b:
                disjoint = a[1] < b[0] or b[1] < a[0]
                nested = (a[0] < b[0] and b[1] < a[1]) or (b[0] < a[0] and a[1] < b[1])
                assert disjoint or nested
    # 스택은 늘 트리의 뿌리에서 지금 노드까지의 길이다
    for n in range(0, 9):
        v, ev, ed, _ = trace_fib(n)
        par = {c: p for p, c in ed}
        # 호출 사건마다: 스택 = 새 노드에서 부모를 따라 올라간 길
        calls = [c for _, c in ed]
        idx = 0
        for kind, s in ev[1:]:
            if kind == "call":
                node, path = calls[idx], []
                idx += 1
                while node in par:
                    path.append(node[0])
                    node = par[node]
                path.append(node[0])
                assert path[::-1] == s
        # fib 활성의 수 = 2·F(n+1) − 1, 가장 깊을 때 스택 높이 = max(n, 1) + 1
        F = [0, 1]
        while len(F) < n + 3:
            F.append(F[-1] + F[-2])
        assert len(ed) == 2 * F[n + 1] - 1
        assert max(len(s) for _, s in ev) == max(n, 1) + 1
    assert len(trace_fib(3)[2]) == 5

    # ---- 무작위 호출 구조에서도 수명은 겹쳐 엇갈리지 않는다 ----
    rnd = random.Random(2)
    for _ in range(200):
        stack, log, t = [], [], [0]

        def f(depth):
            t[0] += 1
            me = [t[0], None]
            stack.append(me)
            log.append(me)
            for _ in range(rnd.randint(0, 2) if depth < 4 else 0):
                f(depth + 1)
            assert stack.pop() is me
            t[0] += 1
            me[1] = t[0]
        f(0)
        for a in log:
            for b in log:
                assert a is b or a[1] < b[0] or b[1] < a[0] or (a[0] < b[0] and b[1] < a[1]) or (b[0] < a[0] and a[1] < b[1])

    # ---- 카드: fib(4)는 fib 활성 9개, 스택은 가장 높을 때 main까지 5겹 ----
    v, ev, ed, _ = trace_fib(4)
    assert v == 3 and len(ed) == 9 and max(len(s) for _, s in ev) == 5
    assert [s for _, s in ev if len(s) == 5] == [["main", "fib(4)", "fib(3)", "fib(2)", "fib(1)"],
                                                 ["main", "fib(4)", "fib(3)", "fib(2)", "fib(0)"]]
    print("ALL CHECKS PASSED")
```
{% endraw %}
