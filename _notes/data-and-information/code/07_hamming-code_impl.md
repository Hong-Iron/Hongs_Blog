---
layout: "note"
title: "07_hamming-code_impl.py"
display_title: "07_hamming-code_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "07"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
parent_url: "/studies/data-and-information/hamming-code/"
parent_title: "해밍 부호"
description: "자료와 정보 · 해밍 부호 구현 코드"
permalink: "/studies/data-and-information/code/07_hamming-code_impl/"
---
{% raw %}
[해밍 부호](/Hongs_Blog/studies/data-and-information/hamming-code/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""해밍 부호 구현과 자체 테스트.

문서: 07.해밍 부호 (예시, 의사코드, 실행 추적, 정확성, 카드), 4.연습문제/07.해밍 부호 예제 사다리
출처: 자료와 정보 3회 슬라이드(강의03-2-부호2) p.8~15
자리 번호는 슬라이드처럼 1부터 센다(파이썬 리스트는 0부터라 code[i - 1]이 i번 자리다).

두 가지 배치를 구현한다.
  A. 자리 배치형: 패리티를 1, 2, 4, 8, ...번 자리에 두고 데이터를 나머지 자리에 차례로 넣는다.
     패리티 P_(2^j)는 자리 번호의 2진 표기에서 j번째 비트가 1인 자리들의 짝수 패리티다.
     검사값을 P8 P4 P2 P1 순서로 읽은 수(신드롬)가 곧 오류가 난 자리 번호다.
  B. 체계형 (7,4): 슬라이드 p.9의 G, H. 부호어 = (x1 x2 x3 x4 a b c).
주장:
  1. 슬라이드 예: 데이터 00101110 -> 010101011110. 5번 자리가 바뀐 010111011110의 신드롬은 0101 = 5.
  2. 오류가 한 자리면 신드롬 = 그 자리 번호다 (데이터 1~11비트 전수 검사).
  3. 부호 거리는 3이다 ((7,4) 전수 검사).
  4. 두 자리가 바뀌면 신드롬이 0이 아니지만(검출), 고치면 엉뚱한 부호어가 된다 (전수 검사).
  5. 패리티 수 p와 데이터 수 d: 2^p >= d + p + 1. 같은 p를 쓰는 d의 범위는 2^(p-1) - p + 1 <= d <= 2^p - p - 1.
  6. 슬라이드 p.9: G H^T = 0, a = (1,0,1,1) -> 1011010.
실행: python3 07_hamming-code_impl.py
"""
from itertools import combinations, product


def parity_count(d):
    p = 0
    while 2 ** p < d + p + 1:
        p += 1
    return p


def encode(data):
    """data: 0/1 리스트. 자리 배치형 해밍 부호어(리스트)를 돌려준다."""
    d = len(data)
    p = parity_count(d)
    n = d + p
    code = [0] * (n + 1)  # code[1..n]
    it = iter(data)
    for i in range(1, n + 1):
        if i & (i - 1):  # 2의 거듭제곱이 아닌 자리
            code[i] = next(it)
    for j in range(p):
        q = 1 << j
        code[q] = sum(code[i] for i in range(1, n + 1) if i & q and i != q) % 2
    return code[1:]


def syndrome(word):
    """검사값을 ... P8 P4 P2 P1 순서로 읽은 수. 0이면 오류 없음."""
    n = len(word)
    s = 0
    j = 0
    while (1 << j) <= n:
        q = 1 << j
        if sum(word[i - 1] for i in range(1, n + 1) if i & q) % 2:
            s |= q
        j += 1
    return s


def correct(word):
    """(고친 열, 신드롬). 신드롬이 가리키는 자리를 뒤집는다."""
    s = syndrome(word)
    out = list(word)
    if 1 <= s <= len(word):
        out[s - 1] ^= 1
    return out, s


def extract(word):
    return [word[i - 1] for i in range(1, len(word) + 1) if i & (i - 1)]


def bits(s):
    return [int(c) for c in s]


def text(v):
    return "".join(map(str, v))


# ----- 체계형 (7,4): 슬라이드 p.9 -----
G74 = [[1, 0, 0, 0, 1, 1, 0],
       [0, 1, 0, 0, 1, 0, 1],
       [0, 0, 1, 0, 0, 1, 1],
       [0, 0, 0, 1, 1, 1, 1]]
H74 = [[1, 1, 0, 1, 1, 0, 0],
       [1, 0, 1, 1, 0, 1, 0],
       [0, 1, 1, 1, 0, 0, 1]]


def enc74(x):
    return [sum(x[i] * G74[i][j] for i in range(4)) % 2 for j in range(7)]


def syn74(r):
    return tuple(sum(h * b for h, b in zip(row, r)) % 2 for row in H74)


if __name__ == "__main__":
    # 1. 슬라이드 예
    data = bits("00101110")
    code = encode(data)
    assert text(code) == "010101011110"
    assert (code[0], code[1], code[3], code[7]) == (0, 1, 1, 1)  # P1 P2 P4 P8
    recv = bits("010111011110")
    assert syndrome(recv) == 5 and format(5, "04b") == "0101"
    fixed, s = correct(recv)
    assert text(fixed) == "010101011110" and extract(fixed) == data
    assert syndrome(code) == 0
    # 검사값 하나씩 (P1, P2, P4, P8)
    chk = [sum(recv[i - 1] for i in range(1, 13) if i & q) % 2 for q in (1, 2, 4, 8)]
    assert chk == [1, 0, 1, 0]
    # 패리티 영역
    area = {q: [i for i in range(1, 13) if i & q] for q in (1, 2, 4, 8)}
    assert area[1] == [1, 3, 5, 7, 9, 11] and area[2] == [2, 3, 6, 7, 10, 11]
    assert area[4] == [4, 5, 6, 7, 12] and area[8] == [8, 9, 10, 11, 12]

    # 2. 한 자리 오류: 신드롬 = 자리 번호
    for d in range(1, 12):
        for m in product([0, 1], repeat=d):
            c = encode(list(m))
            assert syndrome(c) == 0 and extract(c) == list(m)
            for e in range(1, len(c) + 1):
                r = list(c)
                r[e - 1] ^= 1
                assert syndrome(r) == e
                assert correct(r)[0] == c

    # 3. 부호 거리 3, 4. 두 자리 오류
    C7 = [encode(list(m)) for m in product([0, 1], repeat=4)]
    assert len(C7[0]) == 7
    dist = min(sum(a != b for a, b in zip(x, y)) for x, y in combinations(C7, 2))
    assert dist == 3
    for c in C7:
        for e1, e2 in combinations(range(7), 2):
            r = list(c)
            r[e1] ^= 1
            r[e2] ^= 1
            assert syndrome(r) != 0            # 알아챈다
            f, s = correct(r)
            assert f != c and f in C7          # 고치면 다른 부호어가 된다
            assert s == (e1 + 1) ^ (e2 + 1)    # 신드롬 = 두 자리 번호의 XOR
    # 완전 부호: 반지름 1인 공 16개가 2^7개 열을 빈틈없이 덮는다
    assert 16 * (1 + 7) == 2 ** 7

    # 5. 패리티 수
    for p in range(2, 8):
        lo, hi = 2 ** (p - 1) - p + 1, 2 ** p - p - 1
        for d in range(lo, hi + 1):
            assert parity_count(d) == p
        assert parity_count(hi + 1) == p + 1
    assert (2 ** 3 - 4 + 1, 2 ** 4 - 4 - 1) == (5, 11)
    assert parity_count(8) == 4 and parity_count(4) == 3 and parity_count(11) == 4 and parity_count(12) == 5
    for m in (2, 3, 4, 5):
        n, k = 2 ** m - 1, 2 ** m - 1 - m
        assert parity_count(k) == m and len(encode([0] * k)) == n
    assert [(2 ** m - 1, 2 ** m - 1 - m) for m in (2, 3, 4)] == [(3, 1), (7, 4), (15, 11)]

    # 6. 체계형 (7,4)
    for g in G74:
        assert syn74(g) == (0, 0, 0)
    assert text(enc74([1, 0, 1, 1])) == "1011010"
    raw = [sum(x * G74[i][j] for i, x in enumerate([1, 0, 1, 1])) for j in range(7)]
    assert raw == [1, 0, 1, 1, 2, 3, 2]
    for x in product([0, 1], repeat=4):
        c = enc74(list(x))
        a, b, cc = (x[0] + x[1] + x[3]) % 2, (x[0] + x[2] + x[3]) % 2, (x[1] + x[2] + x[3]) % 2
        assert c == list(x) + [a, b, cc]
        for e in range(7):
            r = list(c)
            r[e] ^= 1
            assert syn74(r) == tuple(row[e] for row in H74)  # 신드롬 = H의 그 열
    assert len({tuple(row[e] for row in H74) for e in range(7)}) == 7
    C74 = [enc74(list(x)) for x in product([0, 1], repeat=4)]
    assert min(sum(a != b for a, b in zip(x, y)) for x, y in combinations(C74, 2)) == 3

    # ----- 문서의 실행 추적과 카드 -----
    # 예시: 데이터 1011 -> 0110011
    assert text(encode(bits("1011"))) == "0110011"
    r = bits("0110111")  # 5번 자리가 바뀜
    assert syndrome(r) == 5 and text(correct(r)[0]) == "0110011"
    # 카드 C2(trace): 받은 열 1010011
    r = bits("1010011")
    assert [sum(r[i - 1] for i in range(1, 8) if i & q) % 2 for q in (1, 2, 4)] == [1, 1, 0]
    assert syndrome(r) == 3 and text(correct(r)[0]) == "1000011" and text(extract(correct(r)[0])) == "0011"
    # 오해 항목: 0110011의 2번, 5번 자리가 바뀐 0010111 -> 신드롬 7 -> 0010110 (틀린 부호어), 데이터 1011 -> 1110
    r = bits("0010111")
    assert syndrome(r) == 7 == 2 ^ 5
    f, _ = correct(r)
    assert text(f) == "0010110" and f in C7 and text(extract(f)) == "1110"

    # ----- 예제 사다리 -----
    # 문제 1: 데이터 1101 -> 1010101, 6번 자리 오류 -> 1010111, 신드롬 6
    assert text(encode(bits("1101"))) == "1010101"
    assert syndrome(bits("1010111")) == 6 and text(correct(bits("1010111"))[0]) == "1010101"
    # 문제 2: 데이터 0110 -> 1100110, 받은 열 1100010 -> 검사값 P1=1 P2=0 P4=1 -> 5
    assert text(encode(bits("0110"))) == "1100110"
    r = bits("1100010")
    assert [sum(r[i - 1] for i in range(1, 8) if i & q) % 2 for q in (1, 2, 4)] == [1, 0, 1]
    assert syndrome(r) == 5 and text(correct(r)[0]) == "1100110" and text(extract(correct(r)[0])) == "0110"
    # 문제 3: 데이터 10011010 (8비트) -> 12비트
    c = encode(bits("10011010"))
    assert text(c) == "011100101010"
    assert (c[0], c[1], c[3], c[7]) == (0, 1, 1, 0)
    r = list(c)
    r[9] ^= 1  # 10번 자리
    assert text(r) == "011100101110"
    assert [sum(r[i - 1] for i in range(1, 13) if i & q) % 2 for q in (1, 2, 4, 8)] == [0, 1, 0, 1]
    assert syndrome(r) == 10
    # 문제 4: 받은 열 001111001010 (12비트)
    r = bits("001111001010")
    s4 = syndrome(r)
    f4, _ = correct(r)
    assert [sum(r[i - 1] for i in range(1, 13) if i & q) % 2 for q in (1, 2, 4, 8)] == [0, 1, 1, 0]
    assert s4 == 6 and text(f4) == "001110001010" and text(extract(f4)) == "11001010"
    assert encode(extract(f4)) == f4
    # 문제 4 (b): 데이터 20비트에 필요한 패리티 수
    assert parity_count(20) == 5 and (2 ** 4 - 5 + 1, 2 ** 5 - 5 - 1) == (12, 26)
    print("ALL CHECKS PASSED")
```
{% endraw %}
