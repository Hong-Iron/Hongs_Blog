---
layout: "note"
title: "50_crc-ladder_p4.py"
display_title: "50_crc-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "50"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/crc-ladder/"
parent_title: "CRC 예제 사다리"
description: "컴퓨터 통신 · CRC 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/computer-communication/code/50_crc-ladder_p4/"
---
{% raw %}
[CRC 예제 사다리](/Hongs_Blog/studies/computer-communication/crc-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CRC 예제 사다리 문제 1~4 검증. XOR 나눗셈은 3.개념집/50_crc_impl.py에서 복사했다."""


def xor_div(dividend, divisor):
    r = list(dividend); k = len(divisor) - 1; q = []; windows = []
    for i in range(len(dividend) - k):
        if r[i] == "1":
            q.append("1"); windows.append("".join(r[i:i + k + 1]))
            for j in range(len(divisor)):
                r[i + j] = "0" if r[i + j] == divisor[j] else "1"
        else:
            q.append("0")
    return "".join(q).lstrip("0") or "0", "".join(r[-k:]), windows


def main():
    q, f, w = xor_div("10011010" + "000", "1101")                             # 문제 1
    assert (q, f) == ("11111001", "101") and w == ["1001", "1001", "1000", "1011", "1100", "1000"]
    q, f, w = xor_div("110101" + "000", "1011")                               # 문제 2
    assert f == "111" and w == ["1101", "1100", "1111", "1000", "1100"]
    q, f, w = xor_div("101110" + "0000", "10011")                             # 문제 3
    assert f == "1011" and w == ["10111", "10000", "11000"]
    assert xor_div("1011101011", "10011")[1] == "0000"
    assert xor_div("10011010111", "1101")[1] == "010"                         # 문제 4 (a)
    e = "00001101000"                                                          # 문제 4 (b): 오류 = C를 옮긴 것
    p = "10011010101"
    bad = "".join("1" if a != b else "0" for a, b in zip(p, e))
    assert xor_div(bad, "1101")[1] == "000"
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
