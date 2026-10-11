---
layout: "note"
title: "02_virtual-machine-levels_verify.py"
display_title: "02_virtual-machine-levels_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/virtual-machine-levels/"
parent_title: "가상 기계 계층"
description: "어셈블리어 · 가상 기계 계층 검증 코드"
permalink: "/studies/assembly-language/code/02_virtual-machine-levels_verify/"
---
{% raw %}
[가상 기계 계층](/Hongs_Blog/studies/assembly-language/virtual-machine-levels/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가상 기계 계층 검증.

문서: 02.가상 기계 계층
출처: 어셈블리어 1주차 p.9 (해석과 번역), 2주차 2-1 p.1~5 (네 단계), 2-2 p.19~21 (진리표, 멀티플렉서)
주장:
  1. 같은 L1 프로그램을 (가) 한 줄씩 해석해 돌린 결과와 (나) 통째로 L0로 번역한 뒤 돌린 결과가 같다.
  2. 해석은 L1 문장을 실행할 때마다 다시 읽고, 번역은 한 번만 읽는다 (반복문 100번이면 100번 대 1번).
  3. 네 단계는 위에서 아래로 4 → 3 → 2 → 1 로 넘겨진다 (슬라이드 p.2의 "(Level 4)"는 3이 맞다).
  4. 1단계 부품의 예: 슬라이드 진리표 세 개 (¬X∨Y, X∧¬Y, 멀티플렉서 (Y∧S)∨(X∧¬S)).
"""
from itertools import product

# L0: 가상의 기계어. (연산, 인자) 쌍.
# L1: 사람이 읽기 쉬운 문장. "acc = A", "acc *= B", "acc += C", "print"


def run_l0(code, env):
    acc, out = 0, []
    for op, arg in code:
        if op == "LOAD":
            acc = env[arg]
        elif op == "MUL":
            acc *= env[arg]
        elif op == "ADD":
            acc += env[arg]
        elif op == "OUT":
            out.append(acc)
    return out


def translate_one(stmt):
    s = stmt.split()
    if stmt == "print":
        return ("OUT", None)
    if s[1] == "=":
        return ("LOAD", s[2])
    if s[1] == "*=":
        return ("MUL", s[2])
    if s[1] == "+=":
        return ("ADD", s[2])
    raise ValueError(stmt)


def interpret(l1, env, times, counter):
    """L1 문장을 실행할 때마다 한 줄씩 읽어 L0 한 걸음으로 바꿔 돌린다."""
    out = []
    for _ in range(times):
        acc = 0
        for stmt in l1:
            counter[0] += 1                      # L1 문장을 읽은 횟수
            op, arg = translate_one(stmt)
            if op == "LOAD":
                acc = env[arg]
            elif op == "MUL":
                acc *= env[arg]
            elif op == "ADD":
                acc += env[arg]
            else:
                out.append(acc)
    return out


def translate(l1, counter):
    code = []
    for stmt in l1:
        counter[0] += 1
        code.append(translate_one(stmt))
    return code


LEVELS = {4: "고급 언어", 3: "어셈블리어", 2: "명령어 집합 구조(ISA)", 1: "디지털 논리"}
GOES_TO = {4: 3, 3: 2, 2: 1}            # 슬라이드 p.2~4를 바로잡은 것


def main():
    l1 = ["acc = A", "acc *= B", "acc += C", "print"]
    env = {"A": 3, "B": 4, "C": 5}
    c_int, c_tr = [0], [0]
    out_i = interpret(l1, env, 100, c_int)
    code = translate(l1, c_tr)
    out_t = []
    for _ in range(100):
        out_t += run_l0(code, env)
    assert out_i == out_t == [17] * 100
    assert c_int[0] == 400 and c_tr[0] == 4
    print("[OK] 해석과 번역의 결과가 같다 (17). L1 문장 읽기: 해석 400번, 번역 4번")

    chain, lv = [4], 4
    while lv in GOES_TO:
        lv = GOES_TO[lv]
        chain.append(lv)
    assert chain == [4, 3, 2, 1] and len(LEVELS) == 4
    print("[OK] 4 → 3 → 2 → 1 (고급 언어는 3단계 어셈블리어로 컴파일된다)")

    T, F = True, False
    t1 = [(x, y, (not x) or y) for x, y in product([F, T], repeat=2)]
    assert [r[2] for r in t1] == [T, T, F, T]                 # 2-2 p.19
    t2 = [(x, y, x and (not y)) for x, y in product([F, T], repeat=2)]
    assert [r[2] for r in t2] == [F, F, T, F]                 # 2-2 p.20
    # 2-2 p.21: 줄 순서는 S, Y, X 순으로 X가 가장 빨리 바뀜. X Y S = FFF, FTF, TFF, TTF, FFT, FTT, TFT, TTT
    rows = [(F, F, F), (F, T, F), (T, F, F), (T, T, F), (F, F, T), (F, T, T), (T, F, T), (T, T, T)]
    mux = [(y and s) or (x and (not s)) for x, y, s in rows]
    assert mux == [F, F, T, T, F, T, F, T]
    for x, y, s in rows:
        assert ((y and s) or (x and (not s))) == (y if s else x)
    print("[OK] 진리표 세 개. 멀티플렉서: S = F면 X, S = T면 Y가 나온다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
