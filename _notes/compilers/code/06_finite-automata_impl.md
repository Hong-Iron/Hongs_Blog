---
layout: "note"
title: "06_finite-automata_impl.py"
display_title: "06_finite-automata_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "06"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/finite-automata/"
parent_title: "유한 오토마타"
description: "컴파일러 · 유한 오토마타 구현 코드"
permalink: "/studies/compilers/code/06_finite-automata_impl/"
---
{% raw %}
[유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 유한 오토마타: 전이 그래프를 표로 적고 문자열을 받아들이는지 따라가 본다 (슬라이드 L03 p.4~11)
# 실행: python3 06_finite-automata_impl.py   (표준 라이브러리만 쓴다)
# 오토마타는 (시작 상태, 받아들이는 상태 집합, 화살표 목록)이다. 화살표는 (출발, 라벨, 도착), 라벨 None이 ε이다.
import itertools
import re

EPS = None


def closure(edges, states):
    stack, seen = list(states), set(states)
    while stack:
        p = stack.pop()
        for (a, label, b) in edges:
            if a == p and label is EPS and b not in seen:
                seen.add(b)
                stack.append(b)
    return seen


def run(fa, text):
    """글자를 하나씩 읽으며 지금 있을 수 있는 상태의 집합을 적어 나간다."""
    start, finals, edges = fa
    cur = closure(edges, {start})
    history = [set(cur)]
    for ch in text:
        cur = closure(edges, {b for (a, label, b) in edges if a in cur and label == ch})
        history.append(set(cur))
    return bool(cur & set(finals)), history


def accepts(fa, text):
    return run(fa, text)[0]


def all_strings(alphabet, max_len):
    for k in range(max_len + 1):
        for tup in itertools.product(alphabet, repeat=k):
            yield "".join(tup)


def table(fa, symbols):
    """전이 표: (상태, 기호) -> 도착 상태 집합. 빈 집합이 슬라이드의 ∅ 칸이다."""
    _, _, edges = fa
    states = sorted({a for a, _, _ in edges} | {b for _, _, b in edges})
    return {(q, s): {b for (a, label, b) in edges if a == q and label == s} for q in states for s in symbols}


M6 = ("q0", {"q1"}, [("q0", "0", "q1")])                                   # p.6: 정규 표현식 0
M7 = ("q0", {"q0"}, [("q0", "0", "q0")])                                   # p.7: 0*
M8 = ("q0", {"q1"}, [("q0", "1", "q0"), ("q0", "0", "q1")])                # p.8: 물음
# p.10: 물음. 기호 d가 숫자 0~9를, m이 빼기 기호를 대신한다.
M10 = ("q0", {"q3"}, [("q0", "m", "q1"), ("q0", EPS, "q2"), ("q1", "d", "q3"),
                      ("q2", "d", "q3"), ("q3", "d", "q3")])


def no_small_dfa_for_parens(max_states, max_len):
    """상태가 max_states개 이하인 어떤 DFA도 길이 max_len 이하에서 { (^n )^n }과 답이 같을 수 없음을 전수 확인한다.
    전이는 빠짐없이 채운 것만 본다(빠진 칸은 죽은 상태 하나로 보내면 되므로 상태 하나 차이다)."""
    words = list(all_strings("()", max_len))
    inside = {w for w in words if len(w) % 2 == 0 and w == "(" * (len(w) // 2) + ")" * (len(w) // 2)}
    for k in range(1, max_states + 1):
        for delta in itertools.product(range(k), repeat=2 * k):       # delta[2*q + (0 또는 1)]
            reach_in, reach_out = set(), set()
            for w in words:
                q = 0
                for ch in w:
                    q = delta[2 * q + (ch == ")")]
                (reach_in if w in inside else reach_out).add(q)
            if not (reach_in & reach_out):       # 받아들이는 상태를 reach_in으로 잡으면 맞아떨어진다
                return False
    return True


if __name__ == "__main__":
    # p.6: 0 하나만 받아들인다
    assert [s for s in all_strings("0", 5) if accepts(M6, s)] == ["0"]
    # p.7: 0을 몇 번 이어 써도(0번 포함) 받아들인다
    assert all(accepts(M7, s) for s in all_strings("0", 8))
    # p.8의 답: 1*0
    assert all(accepts(M8, s) == bool(re.fullmatch("1*0", s)) for s in all_strings("01", 9))
    assert accepts(M8, "1110") and accepts(M8, "0") and not accepts(M8, "01") and not accepts(M8, "")
    # p.10의 답: (-|ε) digit digit*
    assert all(accepts(M10, s) == bool(re.fullmatch("m?d+", s)) for s in all_strings("md", 8))
    assert accepts(M10, "mdd") and accepts(M10, "d") and not accepts(M10, "m") and not accepts(M10, "dm")
    # 문서의 추적: -42 (m d d)
    ok, hist = run(M10, "mdd")
    assert ok and hist == [{"q0", "q2"}, {"q1"}, {"q3"}, {"q3"}]
    ok, hist = run(M10, "dm")
    assert not ok and hist == [{"q0", "q2"}, {"q3"}, set()]

    # p.11의 전이 표
    assert table(M6, ["0"]) == {("q0", "0"): {"q1"}, ("q1", "0"): set()}
    assert table(M7, ["0"]) == {("q0", "0"): {"q0"}}
    eps_fa = ("qi", {"qj"}, [("qi", EPS, "qj")])
    assert table(eps_fa, [EPS]) == {("qi", EPS): {"qj"}, ("qj", EPS): set()}
    # p.9: 자기 자신으로 가는 ε-화살표는 받아들이는 문자열을 바꾸지 않는다
    M8_loop = (M8[0], M8[1], M8[2] + [("q0", EPS, "q0")])
    assert all(accepts(M8, s) == accepts(M8_loop, s) for s in all_strings("01", 8))

    # 카드 값
    #  trace: M8에 1101 -> q0 q0 q0 q1 뒤 갈 곳 없음
    assert run(M8, "1101")[1] == [{"q0"}, {"q0"}, {"q0"}, {"q1"}, set()] and not accepts(M8, "1101")
    #  짝수 개의 1: 상태 둘(짝, 홀)
    EVEN = ("짝", {"짝"}, [("짝", "0", "짝"), ("짝", "1", "홀"), ("홀", "0", "홀"), ("홀", "1", "짝")])
    assert all(accepts(EVEN, s) == (s.count("1") % 2 == 0) for s in all_strings("01", 10))

    # 괄호 짝 맞추기 (^n )^n: 상태 3개 이하의 DFA는 길이 8 이하에서 이미 틀린다
    assert no_small_dfa_for_parens(3, 8)
    # 증명의 비둘기집: 상태 k개인 DFA에 (, ((, ..., (^(k+1)을 넣으면 같은 상태에 닿는 두 개가 반드시 있다
    for k in range(1, 4):
        for delta in itertools.product(range(k), repeat=2 * k):
            reached, q = [], 0
            for _ in range(k + 1):
                q = delta[2 * q]
                reached.append(q)
            assert len(set(reached)) < len(reached)
    print("ALL CHECKS PASSED")
```
{% endraw %}
