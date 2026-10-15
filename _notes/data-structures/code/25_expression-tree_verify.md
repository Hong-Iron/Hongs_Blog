---
layout: "note"
title: "25_expression-tree_verify.py"
display_title: "25_expression-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/expression-tree/"
parent_title: "수식 트리와 전위·중위·후위 표기"
description: "자료구조 · 수식 트리와 전위·중위·후위 표기 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/25_expression-tree_verify/"
---
{% raw %}
[수식 트리와 전위·중위·후위 표기](/Hongs_Blog/studies/data-structures/expression-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""수식 트리와 전위·중위·후위 표기 문서의 수치 검증.

실행: python3 25_expression-tree_verify.py   (표준 라이브러리만 쓴다)

수식 트리: 잎은 피연산자 이름(문자열), 안쪽 노드는 (연산자, 왼쪽, 오른쪽) 튜플.
값은 분수(Fraction)로 정확히 계산한다.
우선순위는 문서의 우선순위 표 숫자를 쓴다: * / 는 13, + - 는 12. 같은 우선순위는 왼쪽부터 계산한다.
"""
import random
from fractions import Fraction

PREC = {"*": 13, "/": 13, "+": 12, "-": 12}


def apply(op, x, y):
    if op == "+":
        return x + y
    if op == "-":
        return x - y
    if op == "*":
        return x * y
    return x / y                     # 0으로 나누면 ZeroDivisionError


# ---------- 세 순회 = 세 표기 ----------

def prefix(t):
    """전위 순회: 뿌리 -> 왼쪽 -> 오른쪽"""
    if isinstance(t, str):
        return [t]
    op, left, right = t
    return [op] + prefix(left) + prefix(right)


def postfix(t):
    """후위 순회: 왼쪽 -> 오른쪽 -> 뿌리"""
    if isinstance(t, str):
        return [t]
    op, left, right = t
    return postfix(left) + postfix(right) + [op]


def infix_plain(t):
    """중위 순회 그대로: 괄호가 없다"""
    if isinstance(t, str):
        return [t]
    op, left, right = t
    return infix_plain(left) + [op] + infix_plain(right)


def infix_full(t):
    """중위 순회를 하되 부분 트리마다 괄호로 싼다"""
    if isinstance(t, str):
        return [t]
    op, left, right = t
    return ["("] + infix_full(left) + [op] + infix_full(right) + [")"]


def infix_min(t):
    """꼭 필요한 곳에만 괄호를 친다.
    왼쪽 자식은 우선순위가 더 낮을 때, 오른쪽 자식은 우선순위가 낮거나 같을 때 싼다."""
    if isinstance(t, str):
        return [t]
    op, left, right = t
    lt, rt = infix_min(left), infix_min(right)
    if not isinstance(left, str) and PREC[left[0]] < PREC[op]:
        lt = ["("] + lt + [")"]
    if not isinstance(right, str) and PREC[right[0]] <= PREC[op]:
        rt = ["("] + rt + [")"]
    return lt + [op] + rt


# ---------- 값 계산 네 가지 ----------

def eval_tree(t, env):
    """트리를 후위 순서로 돌며 계산: 두 자식의 값이 나온 뒤 자기 연산을 한다"""
    if isinstance(t, str):
        return Fraction(env[t])
    op, left, right = t
    return apply(op, eval_tree(left, env), eval_tree(right, env))


def eval_postfix(tokens, env, trace=None):
    """후위 표기: 왼쪽부터 읽으며 스택 하나로 계산"""
    stack = []
    for tok in tokens:
        if tok in PREC:
            y = stack.pop()
            x = stack.pop()
            stack.append(apply(tok, x, y))
        else:
            stack.append(Fraction(env[tok]))
        if trace is not None:
            trace.append((tok, list(stack)))
    assert len(stack) == 1
    return stack[0]


def eval_prefix(tokens, env):
    """전위 표기: 오른쪽부터 읽으며 스택 하나로 계산"""
    stack = []
    for tok in reversed(tokens):
        if tok in PREC:
            x = stack.pop()
            y = stack.pop()
            stack.append(apply(tok, x, y))
        else:
            stack.append(Fraction(env[tok]))
    assert len(stack) == 1
    return stack[0]


def eval_infix(tokens, env):
    """중위 표기: 괄호와 우선순위 표(높은 것 먼저, 같으면 왼쪽부터)를 따라 계산"""
    pos = 0

    def primary():
        nonlocal pos
        tok = tokens[pos]
        pos += 1
        if tok == "(":
            v = expr(0)
            assert tokens[pos] == ")"
            pos += 1
            return v
        return Fraction(env[tok])

    def expr(min_prec):
        nonlocal pos
        v = primary()
        while pos < len(tokens) and tokens[pos] in PREC and PREC[tokens[pos]] >= min_prec:
            op = tokens[pos]
            pos += 1
            rhs = expr(PREC[op] + 1)          # 같은 우선순위는 왼쪽부터 묶는다
            v = apply(op, v, rhs)
        return v

    v = expr(0)
    assert pos == len(tokens)
    return v


def parse_prefix(tokens):
    """전위 표기만으로 수식 트리를 되살린다(연산자는 자식이 꼭 둘, 피연산자는 잎)"""
    pos = 0

    def go():
        nonlocal pos
        tok = tokens[pos]
        pos += 1
        if tok in PREC:
            left = go()
            right = go()
            return (tok, left, right)
        return tok

    t = go()
    assert pos == len(tokens)
    return t


def random_tree(rng, n_ops, names):
    """연산자 n_ops개짜리 무작위 수식 트리. 피연산자 이름은 names에서 차례로 꺼낸다"""
    if n_ops == 0:
        return names.pop()
    k = rng.randrange(n_ops)
    op = rng.choice("+-*/")
    left = random_tree(rng, k, names)
    right = random_tree(rng, n_ops - 1 - k, names)
    return (op, left, right)


if __name__ == "__main__":
    # 1. 문서 예시: A / B - C, A = 6, B = 3, C = 2
    env = {"A": 6, "B": 3, "C": 2}
    t1 = ("-", ("/", "A", "B"), "C")          # (A / B) - C
    t2 = ("/", "A", ("-", "B", "C"))          # A / (B - C)
    assert eval_tree(t1, env) == 0 and eval_tree(t2, env) == 6
    # 두 트리는 괄호 없는 중위 표기가 같다. 전위·후위 표기는 다르다
    assert infix_plain(t1) == infix_plain(t2) == ["A", "/", "B", "-", "C"]
    assert prefix(t1) == ["-", "/", "A", "B", "C"] and prefix(t2) == ["/", "A", "-", "B", "C"]
    assert postfix(t1) == ["A", "B", "/", "C", "-"] and postfix(t2) == ["A", "B", "C", "-", "/"]
    # 우선순위 표대로 읽으면 A / B - C는 (A / B) - C다
    assert eval_infix(["A", "/", "B", "-", "C"], env) == 0
    assert infix_min(t1) == ["A", "/", "B", "-", "C"]
    assert infix_min(t2) == ["A", "/", "(", "B", "-", "C", ")"]

    # 2. 문서의 수식 트리와 세 표기
    T = ("/", ("*", ("+", "a", "b"), ("-", "c", "d")), ("+", "e", "f"))
    assert " ".join(prefix(T)) == "/ * + a b - c d + e f"            # 전위
    assert " ".join(infix_plain(T)) == "a + b * c - d / e + f"        # 중위(괄호 없음)
    assert " ".join(postfix(T)) == "a b + c d - * e f + /"            # 후위
    assert "".join(infix_full(T)) == "(((a+b)*(c-d))/(e+f))"
    assert " ".join(infix_min(T)) == "( a + b ) * ( c - d ) / ( e + f )"
    env = {"a": 8, "b": 4, "c": 6, "d": 3, "e": 2, "f": 4}
    assert eval_tree(T, env) == 6                                      # (8+4)*(6-3)/(2+4) = 36/6
    assert eval_prefix(prefix(T), env) == eval_postfix(postfix(T), env) == 6
    assert eval_infix(infix_full(T), env) == eval_infix(infix_min(T), env) == 6
    # 괄호 없는 중위 표기를 우선순위 표대로 읽으면 다른 식이다: 8 + 4*6 - 3/2 + 4 = 34.5
    assert eval_infix(infix_plain(T), env) == Fraction(69, 2)
    # 후위 표기 계산의 스택 추적 (본문의 표)
    trace = []
    eval_postfix(postfix(T), env, trace)
    assert [(tok, [int(v) for v in st]) for tok, st in trace] == [
        ("a", [8]), ("b", [8, 4]), ("+", [12]), ("c", [12, 6]), ("d", [12, 6, 3]),
        ("-", [12, 3]), ("*", [36]), ("e", [36, 2]), ("f", [36, 2, 4]), ("+", [36, 6]), ("/", [6]),
    ]
    assert max(len(st) for _, st in trace) == 3

    # 3. 카드
    c1 = ("-", ("*", "a", ("+", "b", "c")), ("/", "d", "e"))           # a * (b + c) - d / e
    assert " ".join(prefix(c1)) == "- * a + b c / d e"
    assert " ".join(postfix(c1)) == "a b c + * d e / -"
    assert " ".join(infix_min(c1)) == "a * ( b + c ) - d / e"
    assert " ".join(infix_plain(c1)) == "a * b + c - d / e"
    env3 = {"a": 2, "b": 3, "c": 4, "d": 10, "e": 5}
    assert eval_tree(c1, env3) == 12 and eval_infix(infix_plain(c1), env3) == 8
    c3 = ("-", "a", ("-", "b", "c"))                                    # a - (b - c)
    assert " ".join(infix_plain(c3)) == "a - b - c"
    env4 = {"a": 9, "b": 5, "c": 2}
    assert eval_tree(c3, env4) == 6 and eval_infix(infix_plain(c3), env4) == 2
    assert " ".join(postfix(c3)) == "a b c - -" and " ".join(postfix(("-", ("-", "a", "b"), "c"))) == "a b - c -"

    # 4. 무작위 수식 트리 1,000개: 네 가지 계산이 모두 같은 값
    rng = random.Random(25)
    done = differ = 0
    while done < 1000:
        n_ops = rng.randint(1, 7)
        names = [chr(ord("a") + i) for i in range(n_ops + 1)][::-1]
        t = random_tree(rng, n_ops, names)
        env = {chr(ord("a") + i): rng.randint(1, 9) for i in range(n_ops + 1)}
        try:
            v = eval_tree(t, env)
            plain = eval_infix(infix_plain(t), env)
        except ZeroDivisionError:
            continue                    # 0으로 나누는 식은 버리고 다시 만든다
        assert eval_prefix(prefix(t), env) == v
        assert eval_postfix(postfix(t), env) == v
        assert eval_infix(infix_full(t), env) == v
        assert eval_infix(infix_min(t), env) == v
        assert parse_prefix(prefix(t)) == t              # 전위 표기만으로 트리가 되살아난다
        # 잎(피연산자)은 세 표기에서 같은 차례로 나온다
        ops = set(PREC)
        leaves = [x for x in prefix(t) if x not in ops]
        assert leaves == [x for x in postfix(t) if x not in ops] == [x for x in infix_plain(t) if x not in ops]
        if plain != v:
            differ += 1
        done += 1
    assert differ > 0
    print(f"무작위 식 1,000개에서 네 가지 계산이 일치. 괄호 없는 중위 표기가 다른 값을 낸 식: {differ}개")
    print("ALL CHECKS PASSED")
```
{% endraw %}
