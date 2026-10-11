---
layout: "note"
title: "32_symbol-table-scope-checking_impl.py"
display_title: "32_symbol-table-scope-checking_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "32"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/symbol-table-scope-checking/"
parent_title: "심벌 테이블과 스코프 검사"
description: "컴파일러 · 심벌 테이블과 스코프 검사 구현 코드"
permalink: "/studies/compilers/code/32_symbol-table-scope-checking_impl/"
---
{% raw %}
[심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구현과 검증: 심벌 테이블과 스코프 검사 (L09 p.19~55)
# 실행: python3 32_symbol-table-scope-checking_impl.py
# AST 노드: ("decl", 이름, 타입), ("use", 이름), ("block", [노드...]),
#           ("func", 이름, 타입, [(매개변수 이름, 타입)...], [몸통 노드...]), ("call", 이름),
#           ("class", 이름, [멤버 노드...]) 또는 ("class", 이름, [멤버 노드...], 부모 클래스 이름)
import random


# ---------- 방법 1: 표 하나에 스코프 깊이를 적는다 (L09 p.19~29) ----------
def flat_table(ast):
    """돌려주는 것: (표, 쓰임마다 찾은 줄). 표의 한 줄 = (이름, 타입, 깊이). 블록을 나가도 줄은 남는다."""
    table, found = [], []

    def lookup(name, level):
        for lv in range(level, -1, -1):                 # 같은 깊이부터, 없으면 더 얕은 깊이로
            for row in table:
                if row[0] == name and row[2] == lv:
                    return row
        return None

    def walk(nodes, level):
        for n in nodes:
            if n[0] == "decl":
                table.append((n[1], n[2], level))
            elif n[0] == "use":
                found.append((n[1], lookup(n[1], level)))
            elif n[0] == "block":
                walk(n[1], level + 1)
            elif n[0] == "func":
                table.append((n[1], n[2], level))
                walk([("decl", a, t) for a, t in n[3]] + n[4], level + 1)

    walk(ast, 0)
    return table, found


# ---------- 방법 2: 스코프마다 표를 하나씩 만들고 부모로 잇는다 (L09 p.32~50) ----------
class Table:
    def __init__(self, parent=None):
        self.parent = parent
        self.rows = {}                                  # 이름 -> 타입
        self.children = []
        self.inherits = None                            # 부모 클래스의 표 (상속받은 이름을 찾을 때만 쓴다)
        if parent is not None:
            parent.children.append(self)

    def lookup(self, name):
        """돌려주는 것: (이름이 있는 표, 몇 번 위로 올라갔나) 또는 None."""
        t, hops = self, 0
        while t is not None:
            if name in t.rows:
                return t, hops
            up = t.inherits                             # 클래스의 표면 부모 클래스의 표들도 본다
            while up is not None:
                if name in up.rows:
                    return up, hops
                up = up.inherits
            t, hops = t.parent, hops + 1
        return None


def scope_check(ast, two_pass=False, inherit=True):
    """돌려주는 것: (맨 바깥 표, 오류 목록, 쓰임마다 (이름, 올라간 횟수 또는 None))."""
    root = Table()
    errors, uses = [], []
    class_tables = {}

    def declare(table, name, typ):
        if name in table.rows:
            errors.append("중복 선언: " + name)
        else:
            table.rows[name] = typ

    def gather(nodes, table):                           # 1차 훑기: 함수와 클래스 이름만 모은다
        for n in nodes:
            if n[0] in ("func", "class"):
                table.rows.setdefault(n[1], n[2] if n[0] == "func" else "class")

    def walk(nodes, table):
        if two_pass:
            dup = [n[1] for n in nodes if n[0] in ("func", "class")]
            for name in sorted(set(d for d in dup if dup.count(d) > 1)):
                errors.append("중복 선언: " + name)
            gather(nodes, table)
        for n in nodes:
            if n[0] == "decl":
                declare(table, n[1], n[2])
            elif n[0] in ("use", "call"):
                r = table.lookup(n[1])
                uses.append((n[1], None if r is None else r[1]))
                if r is None:
                    errors.append("선언 안 됨: " + n[1])
            elif n[0] == "block":
                walk(n[1], Table(table))
            elif n[0] == "func":
                if not two_pass:
                    declare(table, n[1], n[2])
                inner = Table(table)
                for a, t in n[3]:
                    declare(inner, a, t)
                walk(n[4], inner)
            elif n[0] == "class":
                if not two_pass:
                    declare(table, n[1], "class")
                inner = Table(table)
                class_tables[n[1]] = inner
                if len(n) > 3 and inherit:
                    inner.inherits = class_tables[n[3]]
                walk(n[2], inner)

    walk(ast, root)
    return root, errors, uses


def shape(table):
    return (sorted(table.rows.items()), [shape(c) for c in table.children])


# ---------- 견줄 뻔한 방법: 쓰는 자리에서 바깥으로 나가며, 그 자리보다 앞선 선언을 찾는다 ----------
def naive_resolve(ast):
    out = []

    def walk(nodes, enclosing):
        for i, n in enumerate(nodes):
            if n[0] == "use":
                hops, ans = 0, None
                for blk, upto in [(nodes, i)] + enclosing:
                    if any(m[0] == "decl" and m[1] == n[1] for m in blk[:upto]):
                        ans = hops
                        break
                    hops += 1
                out.append((n[1], ans))
            elif n[0] == "block":
                walk(n[1], [(nodes, i)] + enclosing)

    walk(ast, [])
    return out


def random_ast(rng, depth):
    nodes = []
    for _ in range(rng.randint(1, 5)):
        k = rng.random()
        if k < 0.35:
            nodes.append(("decl", rng.choice("abc"), "int"))
        elif k < 0.75 or depth == 0:
            nodes.append(("use", rng.choice("abc")))
        else:
            nodes.append(("block", random_ast(rng, depth - 1)))
    return nodes


if __name__ == "__main__":
    # (1) L09 p.19: int foo() { int a; int b; { int a; { int b; } } }
    prog = [("func", "foo", "int", [], [
        ("decl", "a", "int"), ("decl", "b", "int"),
        ("block", [("decl", "a", "int"), ("block", [("decl", "b", "int")])])])]
    table, _ = flat_table(prog)
    assert table == [("foo", "int", 0), ("a", "int", 1), ("b", "int", 1), ("a", "int", 2), ("b", "int", 3)]

    # (2) L09 p.27~29: 깊이 3에서 b, 선언 전의 b, c를 쓰면
    def inner(stmts):
        return [("func", "foo", "int", [], [
            ("decl", "a", "int"), ("decl", "b", "int"),
            ("block", [("decl", "a", "int"), ("block", stmts)])])]
    _, f = flat_table(inner([("decl", "b", "int"), ("use", "b")]))
    assert f == [("b", ("b", "int", 3))]                        # p.27: 같은 깊이에 있다
    _, f = flat_table(inner([("use", "b"), ("decl", "b", "int")]))
    assert f == [("b", ("b", "int", 1))]                        # p.28: 없으니 바깥에서 가장 가까운 것
    _, f = flat_table(inner([("decl", "b", "int"), ("use", "c")]))
    assert f == [("c", None)]                                   # p.29: 어디에도 없다 -> 오류

    # (3) L09 p.30: 형제 블록 { int c; } 를 붙이면 표가 헷갈린다
    prog30 = [("func", "foo", "int", [], [
        ("decl", "a", "int"), ("decl", "b", "int"),
        ("block", [("decl", "a", "int"), ("block", [("decl", "b", "int")])]),
        ("block", [("decl", "c", "int"), ("use", "a")])])]
    table, f = flat_table(prog30)
    assert table[-1] == ("c", "int", 2) and ("a", "int", 2) in table
    assert f == [("a", ("a", "int", 2))]                        # 틀린 답: 이미 나온 옆 블록의 a를 집는다
    root, errors, uses = scope_check(prog30)
    assert errors == [] and uses == [("a", 1)]                  # 맞는 답: 한 칸 위(함수 몸통)의 a

    # (4) L09 p.32, p.44: 표 다섯 개와 부모 연결
    assert shape(root) == ([("foo", "int")], [
        ([("a", "int"), ("b", "int")], [
            ([("a", "int")], [([("b", "int")], [])]),
            ([("c", "int")], [])])])

    # (5) L09 p.46~50: 가장 안쪽 블록에서 printf(b); int b; printf(b); printf(c);
    prog46 = [("func", "foo", "int", [], [
        ("decl", "a", "int"), ("decl", "b", "int"),
        ("block", [("decl", "a", "int"),
                   ("block", [("use", "b"), ("decl", "b", "int"), ("use", "b"), ("use", "c")])]),
        ("block", [("decl", "c", "int")])])]
    root, errors, uses = scope_check(prog46)
    assert uses == [("b", 2), ("b", 0), ("c", None)]            # 조상에서, 지금 표에서, 어디에도 없음
    assert errors == ["선언 안 됨: c"]

    # (6) L09 p.5~7의 예: 규칙 1~3
    ok1 = [("decl", "a", "int"), ("func", "foo", "void", [], [("use", "a")])]
    ok2 = [("func", "foo", "void", [("a", "int")], [("use", "a")])]
    ok3 = [("func", "foo", "void", [], [("decl", "a", "int"), ("use", "a")])]
    bad1 = [("func", "foo", "void", [], [("use", "a"), ("decl", "a", "int")])]
    assert [scope_check(p)[1] for p in (ok1, ok2, ok3)] == [[], [], []]
    assert scope_check(bad1)[1] == ["선언 안 됨: a"]                       # 규칙 1
    ok4 = [("decl", "a", "int"), ("func", "foo", "void", [], [("decl", "a", "int")])]
    bad2 = [("func", "foo", "void", [], [("decl", "a", "int"), ("decl", "a", "int")])]
    assert scope_check(ok4)[1] == [] and scope_check(bad2)[1] == ["중복 선언: a"]   # 규칙 2
    bad3 = [("func", "foo", "void", [], []), ("func", "foo", "void", [], [])]
    assert scope_check(bad3)[1] == ["중복 선언: foo"]                      # 규칙 3
    assert scope_check(bad3, two_pass=True)[1] == ["중복 선언: foo"]

    # (7) L09 p.17, p.52~53: 선언보다 먼저 부르는 함수는 두 번 훑어야 통과한다
    cls = [("class", "test", [
        ("func", "bar", "void", [], [("call", "foo")]),
        ("func", "foo", "void", [], [])])]
    assert scope_check(cls)[1] == ["선언 안 됨: foo"]
    root, errors, uses = scope_check(cls, two_pass=True)
    assert errors == [] and uses == [("foo", 1)]
    assert root.rows == {"test": "class"} and root.children[0].rows == {"bar": "void", "foo": "void"}
    # 변수는 두 번 훑어도 선언 전에 못 쓴다
    assert scope_check(bad1, two_pass=True)[1] == ["선언 안 됨: a"]

    # (7-2) L09 p.18, p.54: 물려받은 함수. 클래스의 표를 부모 클래스의 표에 이으면 찾는다
    inh = [("class", "Parent", [("func", "foo", "void", [], [])]),
           ("class", "Test", [("func", "bar", "void", [], [("call", "foo")])], "Parent")]
    assert scope_check(inh, two_pass=True, inherit=False)[1] == ["선언 안 됨: foo"]
    assert scope_check(inh, two_pass=True, inherit=True)[1] == []

    # (7-3) 확인 문제 C2, C4, C5
    c2 = [("decl", "g", "int"), ("func", "f", "void", [], [
        ("decl", "x", "int"),
        ("block", [("decl", "y", "int"), ("block", [("decl", "x", "int")])]),
        ("block", [("decl", "z", "int")])])]
    assert shape(scope_check(c2)[0]) == ([("f", "void"), ("g", "int")], [
        ([("x", "int")], [([("y", "int")], [([("x", "int")], [])]), ([("z", "int")], [])])])
    c4 = [("func", "f", "void", [], [("block", [("decl", "a", "int")]), ("block", [("use", "a")])])]
    assert flat_table(c4)[1] == [("a", ("a", "int", 2))]            # 깊이 표는 통과시킨다
    assert scope_check(c4)[1] == ["선언 안 됨: a"]                    # 이은 표는 오류를 낸다
    c5 = [("class", "T", [("func", "bar", "void", [], [("call", "foo"), ("use", "x")]),
                          ("func", "foo", "void", [], []), ("decl", "x", "int")])]
    assert scope_check(c5, two_pass=True)[1] == ["선언 안 됨: x"]

    # (8) 무작위 프로그램 3,000개: 표를 부모로 이은 방법 = 뻔한 방법
    rng = random.Random(9)
    n_use = wrong_flat = 0
    for _ in range(3000):
        ast = random_ast(rng, 3)
        _, _, uses = scope_check(ast)
        want = naive_resolve(ast)
        assert uses == want
        n_use += len(uses)
        # 깊이만 적은 표가 틀리는 횟수도 센다: 찾은 줄의 깊이로 '몇 칸 위'를 되짚어 견준다
        _, f = flat_table(ast)
        levels = []

        def depth_of_uses(nodes, level):
            for n in nodes:
                if n[0] == "use":
                    levels.append(level)
                elif n[0] == "block":
                    depth_of_uses(n[1], level + 1)
        depth_of_uses(ast, 0)
        for (name, row), lv, (_, hops) in zip(f, levels, want):
            got = None if row is None else lv - row[2]
            wrong_flat += got != hops
    assert wrong_flat > 0
    print("무작위 프로그램 3,000개, 쓰임 %d번: 부모로 이은 표는 모두 맞고, 깊이만 적은 표는 %d번 틀린다" % (n_use, wrong_flat))
    print("ALL CHECKS PASSED")
```
{% endraw %}
