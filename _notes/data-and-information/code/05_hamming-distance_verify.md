---
layout: "note"
title: "05_hamming-distance_verify.py"
display_title: "05_hamming-distance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/hamming-distance/"
parent_title: "해밍 거리와 부호 거리"
description: "자료와 정보 · 해밍 거리와 부호 거리 검증 코드"
sitemap: false
permalink: "/studies/data-and-information/code/05_hamming-distance_verify/"
---
{% raw %}
[해밍 거리와 부호 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""해밍 거리와 부호 거리 문서의 주장 확인.

문서: 05.해밍 거리와 부호 거리
출처: 자료와 정보 3회 슬라이드(강의03-부호) p.13~14, p.16, (강의03-2-부호2) p.2~3
주장:
  1. 해밍 거리는 거리의 네 조건을 지킨다 (길이 5의 모든 2진 열 전수 검사).
  2. 2진에서 Delta(x, y) = wt(x - y) = wt(x XOR y).
  3. 반지름 r인 해밍 공의 크기는 sum_{i<=r} C(n, i).
  4. 부호 거리 d인 부호는 d - 1개까지의 오류를 반드시 알아채고, floor((d - 1) / 2)개까지 고치고,
     d - 1개까지의 지워진 자리를 채운다. 그보다 하나 많으면 실패하는 경우가 있다.
     (반복 부호 {000,111}, {00000,11111}, 짝수 패리티 부호, (6,3) 부호에서 전수 검사)
  5. 문서의 예와 카드 값.
실행: python3 05_hamming-distance_verify.py
"""
from itertools import combinations, product
from math import comb


def hd(x, y):
    assert len(x) == len(y)
    return sum(a != b for a, b in zip(x, y))


def wt(x):
    return sum(c != "0" for c in x)


def code_distance(C):
    return min(hd(a, b) for a, b in combinations(sorted(C), 2))


def flip(x, pos):
    return "".join(("1" if c == "0" else "0") if i in pos else c for i, c in enumerate(x))


def detects_all(C, t):
    """t개 이하의 오류가 부호어를 다른 부호어로 바꾸는 일이 없는가"""
    n = len(next(iter(C)))
    for c in C:
        for k in range(1, t + 1):
            for pos in combinations(range(n), k):
                if flip(c, pos) in C:
                    return False
    return True


def corrects_all(C, t):
    """t개 이하의 오류가 난 열에서 가장 가까운 부호어가 늘 원래 부호어 하나뿐인가"""
    n = len(next(iter(C)))
    for c in C:
        for k in range(0, t + 1):
            for pos in combinations(range(n), k):
                r = flip(c, pos)
                dmin = min(hd(r, z) for z in C)
                near = [z for z in C if hd(r, z) == dmin]
                if near != [c]:
                    return False
    return True


def fills_all(C, e):
    """e개 이하의 자리가 지워져도 남은 자리와 맞는 부호어가 하나뿐인가"""
    n = len(next(iter(C)))
    for c in C:
        for k in range(0, e + 1):
            for pos in combinations(range(n), k):
                match = [z for z in C if all(z[i] == c[i] for i in range(n) if i not in pos)]
                if match != [c]:
                    return False
    return True


if __name__ == "__main__":
    S = ["".join(p) for p in product("01", repeat=5)]
    for x in S:
        for y in S:
            assert hd(x, y) >= 0 and (hd(x, y) == 0) == (x == y) and hd(x, y) == hd(y, x)
            xor = "".join(str(int(a) ^ int(b)) for a, b in zip(x, y))
            assert hd(x, y) == wt(xor)
    for x in S[::3]:
        for y in S[::5]:
            for z in S:
                assert hd(x, z) <= hd(x, y) + hd(y, z)
    for r in range(6):
        assert sum(1 for y in S if hd("00000", y) <= r) == sum(comb(5, i) for i in range(r + 1))

    # 문서의 예
    assert hd("10110", "10011") == 2 and wt("10110") == 3
    assert hd("010010010", "100001011") == 5  # 4회 슬라이드의 9비트 예
    assert sum(1 for y in ["".join(p) for p in product("01", repeat=3)] if hd("000", y) <= 1) == 4

    rep3 = {"000", "111"}
    rep5 = {"00000", "11111"}
    par = {"".join(m) + str(sum(map(int, m)) % 2) for m in product("01", repeat=3)}
    G = ["100110", "010011", "001101"]
    c63 = set()
    for m in product([0, 1], repeat=3):
        c63.add("".join(str(sum(m[i] * int(G[i][j]) for i in range(3)) % 2) for j in range(6)))
    two = {"00", "01", "10", "11"}
    for C, d in [(rep3, 3), (rep5, 5), (par, 2), (c63, 3), (two, 1)]:
        assert code_distance(C) == d
        assert detects_all(C, d - 1) and not detects_all(C, d)
        t = (d - 1) // 2
        assert corrects_all(C, t) and not corrects_all(C, t + 1)
        assert fills_all(C, d - 1) and not fills_all(C, d)

    # 상대 거리
    assert code_distance(rep3) / 3 == 1.0 and abs(code_distance(c63) / 6 - 0.5) < 1e-12
    # 카드: {0000, 0011, 1100, 1111} 거리 2 -> 1개 검출, 0개 정정
    C = {"0000", "0011", "1100", "1111"}
    assert code_distance(C) == 2 and detects_all(C, 1) and not corrects_all(C, 1)
    # 카드: 거리 5 -> 4개 검출, 2개 정정, 4개 채움
    assert (5 - 1, (5 - 1) // 2) == (4, 2)
    # 000이 010으로 바뀌면 가장 가까운 부호어는 000 (거리 1), 111은 거리 2
    assert hd("010", "000") == 1 and hd("010", "111") == 2
    # 두 자리가 바뀐 011은 111로 잘못 고쳐진다
    assert hd("011", "111") == 1 and hd("011", "000") == 2
    # 카드 C1
    assert hd("1011010", "1001110") == 2 and wt("1011010") == 4 and wt("1001110") == 4
    # 예제: {0000, 0011, 1100, 1111}에서 0001은 0000과도 0011과도 거리 1
    assert hd("0001", "0000") == 1 and hd("0001", "0011") == 1
    assert code_distance({"00", "11"}) == 2 and not corrects_all({"00", "11"}, 1)
    print("ALL CHECKS PASSED")
```
{% endraw %}
