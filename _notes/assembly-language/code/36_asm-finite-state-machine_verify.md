---
layout: "note"
title: "36_asm-finite-state-machine_verify.py"
display_title: "36_asm-finite-state-machine_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/asm-finite-state-machine/"
parent_title: "유한 상태 기계"
description: "어셈블리어 · 유한 상태 기계 검증 코드"
permalink: "/studies/assembly-language/code/36_asm-finite-state-machine_verify/"
---
{% raw %}
[유한 상태 기계](/Hongs_Blog/studies/assembly-language/asm-finite-state-machine/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유한 상태 기계 검증. 실행: python3 36_asm-finite-state-machine_verify.py
MASM이 없어 슬라이드의 어셈블리 코드를 파이썬으로 한 줄씩 흉내 낸다.
슬라이드 wk09-2-2 p.5(두 그림), p.6(Your turn), p.7~12(Finite.asm)의 동작을 확인한다."""
import itertools
import re

ENTER = "\r"          # ENTER_KEY = 13


def run_fsm(table, start, accepting, text, classify):
    """전이 표로 FSM을 돌린다. 갈 곳이 없으면 거절."""
    state = start
    for ch in text:
        state = table.get((state, classify(ch)))
        if state is None:
            return False
    return state in accepting


# ---- p.5 위 그림: x로 시작, a..y가 0개 이상, z로 끝 ----
def fsm_xz(text):
    state = "A"
    for ch in text:
        if state == "A" and ch == "x":
            state = "B"
        elif state == "B" and "a" <= ch <= "y":
            state = "B"
        elif state == "B" and ch == "z":
            state = "C"
        else:
            return False
    return state == "C"


# ---- p.5 아래 그림: 부호 있는 정수 ----
def cls_int(ch):
    if ch in "+-":
        return "sign"
    if ch.isdigit() and ch.isascii():
        return "digit"
    return "other"


INT_FSM = {("A", "sign"): "B", ("A", "digit"): "C", ("B", "digit"): "C", ("C", "digit"): "C"}
# ---- p.6 Your turn의 그림: 상태 둘 ----
BAD_FSM = {("A", "sign"): "B", ("A", "digit"): "B", ("B", "digit"): "B"}


# ---- p.8 IsDigit: 명령 한 줄씩 플래그를 계산한다 ----
def is_digit_asm(al):
    """ZF를 돌려준다. cmp는 al - 상수의 결과로 ZF, CF를 정한다."""
    zf, cf = int(al == ord("0")), int(al < ord("0"))      # cmp al,'0'
    if cf:                                                 # jb ID1
        return zf
    zf, cf = int(al == ord("9")), int(al < ord("9"))      # cmp al,'9'
    if not cf and not zf:                                  # ja ID1
        return zf
    zf = int((al & 0) == 0)                                # test ax,0 → 항상 ZF = 1
    return zf


# ---- p.10~12 Finite.asm: 상태마다 이름표, 간선마다 cmp + 조건 점프 ----
def finite_asm(keys, state_c_has_jz_quit):
    """키 입력 keys를 넣어 돌린다. ("ok" 또는 "error", 읽은 글자 수)를 돌려준다.
    Getnext(ReadChar, WriteChar)는 ZF를 바꾸지 않는다고 가정한다."""
    it = iter(keys)
    read = 0
    zf = 0

    def getnext():
        nonlocal read
        read += 1
        return ord(next(it))

    # StateA
    al = getnext()
    if al in (ord("+"), ord("-")):                # cmp/je StateB 두 번
        state = "B"
    else:
        zf = is_digit_asm(al)                     # call IsDigit
        if zf:                                    # jz StateC
            state = "C"
        else:
            return "error", read                  # DisplayErrorMsg, jmp Quit
    if state == "B":
        al = getnext()
        zf = is_digit_asm(al)
        if not zf:
            return "error", read
        state = "C"
    while True:                                   # StateC
        al = getnext()
        if state_c_has_jz_quit and zf:            # jz Quit (슬라이드 p.11의 줄)
            return "ok", read
        zf = is_digit_asm(al)
        if zf:
            continue                              # jz StateC
        zf = int(al == 13)                        # cmp AL,ENTER_KEY
        if zf:
            return "ok", read                     # je Quit
        return "error", read


if __name__ == "__main__":
    # p.5 위 그림과 정규식 x[a-y]*z
    alpha = "axyzb1"
    for n in range(0, 6):
        for t in itertools.product(alpha, repeat=n):
            s = "".join(t)
            assert fsm_xz(s) == bool(re.fullmatch(r"x[a-y]*z", s)), s
    assert fsm_xz("xz") and fsm_xz("xabcz") and fsm_xz("xxz")
    assert not fsm_xz("xab") and not fsm_xz("abz") and not fsm_xz("xzz") and not fsm_xz("x")

    # p.5 아래 그림과 정규식 [+-]?[0-9]+ (길이 5 이하 전수)
    alpha = "+-059a"
    for n in range(0, 6):
        for t in itertools.product(alpha, repeat=n):
            s = "".join(t)
            want = bool(re.fullmatch(r"[+-]?[0-9]+", s))
            assert run_fsm(INT_FSM, "A", {"C"}, s, cls_int) == want, s
    for s, want in [("+123", True), ("-5", True), ("42", True), ("+", False), ("", False),
                    ("12a", False), ("+-3", False), ("3+", False)]:
        assert run_fsm(INT_FSM, "A", {"C"}, s, cls_int) == want, s

    # p.6 Your turn: 상태 둘짜리 그림은 부호만 있는 "+", "-"도 받아들인다
    diff = []
    for n in range(0, 5):
        for t in itertools.product("+-05a", repeat=n):
            s = "".join(t)
            good = run_fsm(INT_FSM, "A", {"C"}, s, cls_int)
            bad = run_fsm(BAD_FSM, "A", {"B"}, s, cls_int)
            if good != bad:
                diff.append(s)
    assert diff == ["+", "-"], diff

    # p.8 IsDigit: 256가지 AL 전부에서 ZF = 1 ⇔ '0'..'9'
    for al in range(256):
        assert is_digit_asm(al) == int(ord("0") <= al <= ord("9")), al
    assert is_digit_asm(ord("0")) == 1 and is_digit_asm(ord("9")) == 1
    assert is_digit_asm(ord("/")) == 0 and is_digit_asm(ord(":")) == 0

    # 고친 코드(StateC에서 jz Quit을 뺀 것)는 그림의 FSM과 같은 판정을 한다
    for n in range(0, 5):
        for t in itertools.product("+-05a", repeat=n):
            s = "".join(t)
            want = "ok" if run_fsm(INT_FSM, "A", {"C"}, s, cls_int) else "error"
            got, _ = finite_asm(s + ENTER, state_c_has_jz_quit=False)
            assert got == want, (s, got, want)

    # 슬라이드 p.11 그대로(jz Quit이 있는 것): 상태 C에 들어올 때 ZF = 1이라
    # 다음 글자를 읽자마자 검사 없이 끝난다 → "1a"가 오류 없이 통과한다
    assert finite_asm("1a" + ENTER, True) == ("ok", 2)
    assert finite_asm("1a" + ENTER, False) == ("error", 2)
    assert finite_asm("+7x9" + ENTER, True) == ("ok", 3)
    assert finite_asm("+7x9" + ENTER, False) == ("error", 3)
    assert finite_asm("-25" + ENTER, False) == ("ok", 4)
    assert finite_asm("+" + ENTER, False) == ("error", 2)

    # 카드 C2: "-40" 추적 A → B → C → C
    path, st = ["A"], "A"
    for ch in "-40":
        st = INT_FSM[(st, cls_int(ch))]
        path.append(st)
    assert path == ["A", "B", "C", "C"]
    print("ALL CHECKS PASSED")
```
{% endraw %}
