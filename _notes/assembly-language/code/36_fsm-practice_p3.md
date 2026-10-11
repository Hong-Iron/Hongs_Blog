---
layout: "note"
title: "36_fsm-practice_p3.py"
display_title: "36_fsm-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "36"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/fsm-practice/"
parent_title: "유한 상태 기계 연습"
description: "어셈블리어 · 유한 상태 기계 연습 문제 3 풀이 코드"
permalink: "/studies/assembly-language/code/36_fsm-practice_p3/"
---
{% raw %}
[유한 상태 기계 연습](/Hongs_Blog/studies/assembly-language/fsm-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유한 상태 기계 연습의 답 확인. 실행: python3 36_fsm-practice_p3.py
MASM이 없어 그림은 전이 표로, 어셈블리 코드는 플래그 계산까지 파이썬으로 옮겨 확인한다."""
import itertools
import re


def run(table, start, accepting, text, classify):
    """전이 표로 FSM을 돌린다. (지나간 상태들, 받아들였는가)를 돌려준다."""
    state, path = start, [start]
    for ch in text:
        state = table.get((state, classify(ch)))
        if state is None:
            return path, False
        path.append(state)
    return path, state in accepting


def cls_int(ch):
    return "sign" if ch in "+-" else "digit" if ch in "0123456789" else "other"


INT = {("A", "sign"): "B", ("A", "digit"): "C", ("B", "digit"): "C", ("C", "digit"): "C"}
TWO = {("A", "sign"): "B", ("A", "digit"): "B", ("B", "digit"): "B"}


# 문제 3: MASM의 16진 정수 상수. 부호(없어도 됨) + 숫자로 시작 + 16진 숫자들 + h
def cls_hex(ch):
    if ch in "+-":
        return "sign"
    if ch in "0123456789":
        return "digit"
    if ch in "ABCDEFabcdef":
        return "letter"
    if ch in "hH":
        return "h"
    return "other"


HEX = {("A", "sign"): "B", ("A", "digit"): "C", ("B", "digit"): "C",
       ("C", "digit"): "C", ("C", "letter"): "C", ("C", "h"): "D"}


def is_hex_digit_asm(al):
    """문제 3의 IsHexDigit를 명령 한 줄씩 옮긴 것. ZF를 돌려준다."""
    def cmp(x, k):                      # (ZF, CF)
        return int(x == k), int(x < k)
    zf, cf = cmp(al, ord("0"))
    if cf:                              # jb NotHex
        return zf
    zf, cf = cmp(al, ord("9"))
    if cf or zf:                        # jbe IsHex
        return 1                        # test ax,0 → ZF = 1
    zf, cf = cmp(al, ord("A"))
    if cf:                              # jb NotHex
        return zf
    zf, cf = cmp(al, ord("F"))
    if cf or zf:                        # jbe IsHex
        return 1
    zf, cf = cmp(al, ord("a"))
    if cf:                              # jb NotHex
        return zf
    zf, cf = cmp(al, ord("f"))
    if not cf and not zf:               # ja NotHex
        return zf
    return 1                            # IsHex: test ax,0


def hex_asm(keys):
    """문제 3의 답 코드를 옮긴 것. 키 입력 끝에는 Enter(13)가 온다."""
    it = iter(keys)
    al = ord(next(it))                                  # StateA
    if al in (ord("+"), ord("-")):
        al = ord(next(it))                              # StateB
        if not (ord("0") <= al <= ord("9")):
            return "error"
    elif not (ord("0") <= al <= ord("9")):
        return "error"
    while True:                                         # StateC
        al = ord(next(it))
        if is_hex_digit_asm(al):
            continue
        if al in (ord("h"), ord("H")):
            break
        return "error"
    al = ord(next(it))                                  # StateD
    return "ok" if al == 13 else "error"


# 문제 4: 앞에 쓸데없는 0이 없는 부호 없는 정수. "0" 또는 1~9로 시작하는 숫자열
def cls_nz(ch):
    return "zero" if ch == "0" else "nonzero" if ch in "123456789" else "other"


NOLEAD = {("A", "zero"): "Z", ("A", "nonzero"): "C", ("C", "zero"): "C", ("C", "nonzero"): "C"}

if __name__ == "__main__":
    # 문제 1
    assert run(INT, "A", {"C"}, "+12", cls_int) == (["A", "B", "C", "C"], True)
    assert run(INT, "A", {"C"}, "-", cls_int) == (["A", "B"], False)
    assert run(INT, "A", {"C"}, "3-4", cls_int) == (["A", "C"], False)
    assert run(INT, "A", {"C"}, "007", cls_int) == (["A", "C", "C", "C"], True)
    assert run(INT, "A", {"C"}, "", cls_int) == (["A"], False)
    # 문제 2: 두 그림의 판정이 갈리는 입력은 "+", "-"뿐 (길이 5 이하 전수)
    diff = [s for n in range(6) for s in map("".join, itertools.product("+-07a", repeat=n))
            if run(INT, "A", {"C"}, s, cls_int)[1] != run(TWO, "A", {"B"}, s, cls_int)[1]]
    assert diff == ["+", "-"]
    # 문제 3: 그림과 정규식, 그림과 코드가 같은 판정 (길이 5 이하 전수)
    for n in range(6):
        for s in map("".join, itertools.product("+09AfhHg", repeat=n)):
            want = bool(re.fullmatch(r"[+-]?[0-9][0-9A-Fa-f]*[hH]", s))
            assert run(HEX, "A", {"D"}, s, cls_hex)[1] == want, s
            assert (hex_asm(s + "\r") == "ok") == want, s
    for s, want in [("6Ah", True), ("0A5h", True), ("A5h", False), ("42", False),
                    ("-1Fh", True), ("1Gh", False), ("h", False), ("0h", True), ("12hh", False)]:
        assert run(HEX, "A", {"D"}, s, cls_hex)[1] == want, s
    assert run(HEX, "A", {"D"}, "0A5h", cls_hex)[0] == ["A", "C", "C", "C", "D"]
    for al in range(256):
        assert is_hex_digit_asm(al) == int(chr(al) in "0123456789ABCDEFabcdef"), al
    # 문제 4
    for n in range(6):
        for s in map("".join, itertools.product("0159a", repeat=n)):
            assert run(NOLEAD, "A", {"Z", "C"}, s, cls_nz)[1] == bool(re.fullmatch(r"0|[1-9][0-9]*", s)), s
    assert run(NOLEAD, "A", {"Z", "C"}, "007", cls_nz) == (["A", "Z"], False)
    assert run(NOLEAD, "A", {"Z", "C"}, "700", cls_nz) == (["A", "C", "C", "C"], True)
    print("ALL CHECKS PASSED")
```
{% endraw %}
