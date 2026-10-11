---
layout: "note"
title: "07_dfa-vs-nfa_verify.py"
display_title: "07_dfa-vs-nfa_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/dfa-vs-nfa/"
parent_title: "DFA와 NFA 비교"
description: "컴파일러 · DFA와 NFA 비교 검증 코드"
permalink: "/studies/compilers/code/07_dfa-vs-nfa_verify/"
---
{% raw %}
[DFA와 NFA 비교](/Hongs_Blog/studies/compilers/dfa-vs-nfa/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# DFA와 NFA 비교: 슬라이드 L03 p.13의 두 오토마타가 같은 언어 (0|1)*00 을 받아들이는지 확인한다
# 실행: python3 07_dfa-vs-nfa_verify.py   (표준 라이브러리만 쓴다)
import itertools
import re

# p.13의 DFA: (상태, 글자) -> 다음 상태 하나
DFA = {("q0", "0"): "q1", ("q0", "1"): "q0", ("q1", "0"): "q2", ("q1", "1"): "q0",
       ("q2", "0"): "q2", ("q2", "1"): "q0"}
# p.13의 NFA: (상태, 글자) -> 다음 상태 집합
NFA = {("q0", "0"): {"q0", "q1"}, ("q0", "1"): {"q0"}, ("q1", "0"): {"q2"}}
FINAL = "q2"


def dfa_path(text):
    path = ["q0"]
    for ch in text:
        path.append(DFA[(path[-1], ch)])
    return path


def nfa_paths(text):
    """갈 수 있는 길을 모두 늘어놓는다. 중간에 막힌 길은 그때까지의 길만 남는다."""
    done, live = [], [["q0"]]
    for ch in text:
        nxt = []
        for p in live:
            targets = NFA.get((p[-1], ch), set())
            if not targets:
                done.append((p, False))          # 막힌 길
            for t in sorted(targets):
                nxt.append(p + [t])
        live = nxt
    return [p for p in live], [p for p, _ in done]


def nfa_sets(text):
    cur, hist = {"q0"}, [{"q0"}]
    for ch in text:
        cur = set().union(*[NFA.get((q, ch), set()) for q in cur]) if cur else set()
        hist.append(set(cur))
    return hist


def all_strings(alphabet, max_len):
    for k in range(max_len + 1):
        for tup in itertools.product(alphabet, repeat=k):
            yield "".join(tup)


if __name__ == "__main__":
    pat = re.compile("(0|1)*00")
    for s in all_strings("01", 12):
        want = bool(pat.fullmatch(s))
        assert (dfa_path(s)[-1] == FINAL) == want
        full, _ = nfa_paths(s) if len(s) <= 8 else ([], [])
        assert (FINAL in nfa_sets(s)[-1]) == want
        if len(s) <= 8:
            assert any(p[-1] == FINAL for p in full) == want
    # 문서의 추적: 100
    assert dfa_path("100") == ["q0", "q0", "q1", "q2"]
    full, dead = nfa_paths("100")
    assert sorted(full) == [["q0", "q0", "q0", "q0"], ["q0", "q0", "q0", "q1"], ["q0", "q0", "q1", "q2"]]
    assert dead == []
    assert nfa_sets("100") == [{"q0"}, {"q0"}, {"q0", "q1"}, {"q0", "q1", "q2"}]
    # 카드: 1001 -> DFA는 q0에서 끝나 거절. NFA는 끝까지 간 길이 q0에서 끝나는 하나뿐이고 두 길은 중간에 막힌다
    assert dfa_path("1001") == ["q0", "q0", "q1", "q2", "q0"]
    full, dead = nfa_paths("1001")
    assert sorted(full) == [["q0", "q0", "q0", "q0", "q0"]] and len(dead) == 2
    assert nfa_sets("1001")[-1] == {"q0"}
    # 카드: 0000 -> 끝까지 간 길 3개, 그중 q2에서 끝나는 길은 하나. 막힌 길 2개
    full, dead = nfa_paths("0000")
    assert len(full) == 3 and sum(p[-1] == FINAL for p in full) == 1 and len(dead) == 2
    assert dfa_path("0000") == ["q0", "q1", "q2", "q2", "q2"]
    # p.15: DFA는 (상태, 글자)마다 화살표가 0개나 1개, NFA는 2개 이상인 칸이 있다
    assert max(len(v) for v in NFA.values()) == 2 and len(DFA) == 6 and len(NFA) == 3
    # NFA의 화살표 수 4개(0,1 고리 2개 + 0 + 0), DFA 6개
    assert sum(len(v) for v in NFA.values()) == 4
    print("ALL CHECKS PASSED")
```
{% endraw %}
