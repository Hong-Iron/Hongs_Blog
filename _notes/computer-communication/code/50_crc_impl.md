---
layout: "note"
title: "50_crc_impl.py"
display_title: "50_crc_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "50"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/crc/"
parent_title: "CRC"
description: "컴퓨터 통신 · CRC 구현 코드"
permalink: "/studies/computer-communication/code/50_crc_impl/"
---
{% raw %}
[CRC](/Hongs_Blog/studies/computer-communication/crc/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CRC 구현과 검증. 비트는 '0'/'1' 문자열, 다항식 연산(XOR 나눗셈)."""
import random


def xor_div(dividend, divisor):
    """XOR 나눗셈. (몫, 나머지)를 돌려준다. 나머지는 len(divisor) − 1비트."""
    r = list(dividend); k = len(divisor) - 1; q = []
    for i in range(len(dividend) - k):
        if r[i] == "1":
            q.append("1")
            for j in range(len(divisor)):
                r[i + j] = "0" if r[i + j] == divisor[j] else "1"
        else:
            q.append("0")
    return "".join(q).lstrip("0") or "0", "".join(r[-k:])


def crc(msg, c):
    """보낼 프레임 M || F."""
    k = len(c) - 1
    _, f = xor_div(msg + "0" * k, c)
    return msg + f


def check(frame, c):
    return set(xor_div(frame, c)[1]) <= {"0"}


def shift_register(msg, c):
    """슬라이드 p.56의 하드웨어: (|C| − 1)비트 레지스터, C의 1 자리 앞에 XOR."""
    k = len(c) - 1; reg = [0] * k                      # reg[0] = x^0 칸
    taps = [int(c[::-1][i]) for i in range(k)]         # x^0..x^(k−1)의 계수
    for b in msg + "0" * k:
        fb = reg[-1]
        new = [0] * k
        new[0] = int(b) ^ (fb & taps[0])
        for i in range(1, k):
            new[i] = reg[i - 1] ^ (fb & taps[i])
        reg = new
    return "".join(str(x) for x in reversed(reg))


def main():
    M, C = "10011010", "1101"
    q, f = xor_div(M + "000", C)
    assert q == "11111001" and f == "101"                  # 슬라이드 p.54
    P = crc(M, C)
    assert P == "10011010101" and check(P, C)
    # 슬라이드의 "10011010000 − 101 = 10011010101"은 XOR이다(보통의 뺄셈이면 10011001011)
    assert format(int("10011010000", 2) - 0b101, "b") == "10011001011"
    assert format(int("10011010000", 2) ^ 0b101, "b") == "10011010101"
    # 하드웨어 시프트 레지스터도 같은 나머지
    assert shift_register(M, C) == "101"
    # 다항식 표기
    assert [7 - i for i, b in enumerate(M) if b == "1"] == [7, 4, 3, 1]
    # 받는 쪽: 1비트 오류는 모두 검출 (C에 항이 둘 이상)
    for i in range(len(P)):
        bad = P[:i] + ("1" if P[i] == "0" else "0") + P[i + 1:]
        assert not check(bad, C)
    # 놓치는 오류: 오류 패턴이 C의 배수이면 나머지가 0
    E = "00000001101"
    bad = "".join("1" if a != b else "0" for a, b in zip(P, E))
    assert check(bad, C)
    # 길이 k 이하의 연속 오류(버스트)는 모두 검출 (C = 1101, k = 3)
    random.seed(50)
    for _ in range(3000):
        m = "".join(random.choice("01") for _ in range(random.randint(4, 40)))
        p = crc(m, C)
        assert check(p, C) and shift_register(m, C) == p[-3:]
        L = random.randint(1, 3); s = random.randint(0, len(p) - L)
        burst = "1" + "".join(random.choice("01") for _ in range(L - 2)) + ("1" if L > 1 else "")
        burst = burst[:L]
        e = "0" * s + burst + "0" * (len(p) - s - L)
        bad = "".join("1" if a != b else "0" for a, b in zip(p, e))
        assert not check(bad, C)
    # CRC-32: 슬라이드의 다항식 = 표준 0x04C11DB7
    exps = [32, 26, 23, 22, 16, 12, 11, 10, 8, 7, 5, 4, 2, 1, 0]
    assert sum(1 << e for e in exps if e < 32) == 0x04C11DB7
    # 카드 C2: M = 1101, C = 1011 → F = 001
    assert crc("1101", "1011") == "1101001"
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
