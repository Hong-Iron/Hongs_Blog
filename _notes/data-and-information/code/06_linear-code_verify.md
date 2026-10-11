---
layout: "note"
title: "06_linear-code_verify.py"
display_title: "06_linear-code_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "수학"
parent_url: "/studies/data-and-information/linear-code/"
parent_title: "선형 부호와 패리티 검사 행렬"
description: "자료와 정보 · 선형 부호와 패리티 검사 행렬 검증 코드"
permalink: "/studies/data-and-information/code/06_linear-code_verify/"
---
{% raw %}
[선형 부호와 패리티 검사 행렬](/Hongs_Blog/studies/data-and-information/linear-code/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 부호와 패리티 검사 행렬 문서의 주장 확인.

문서: 06.선형 부호와 패리티 검사 행렬
출처: 자료와 정보 3회 슬라이드(강의03-부호) p.17, (강의03-2-부호2) p.4~7
주장:
  1. 슬라이드의 (6,3) 부호: G = [I | P]로 만든 부호어 8개와 무게 표, 가장 작은 거리 3, 비율 1/2.
  2. 선형 부호는 두 부호어를 더해도 부호어다. 그래서 부호 거리 = 0이 아닌 부호어의 가장 작은 무게.
  3. G = [I | P]이면 H = [P^T | I]이고 G H^T = 0. c가 부호어 <=> H c = 0 (길이 6의 2진 열 64개 전수 검사).
  4. 부호 거리 = H에서 더해서 0이 되는 열의 가장 적은 개수.
  5. 오류가 한 자리 e에 나면 H r = H의 e번째 열.
  6. 짝수 패리티 부호 [k+1, k, 2]: G = [I | 1], H = [1 1 ... 1].
  7. 싱글턴 한계 d <= n - k + 1.
  8. 슬라이드의 2차원 패리티 표: 한 비트가 바뀌면 행 하나와 열 하나의 패리티가 깨진다.
실행: python3 06_linear-code_verify.py
"""
from itertools import combinations, product


def matvec(M, v):
    return tuple(sum(a * b for a, b in zip(row, v)) % 2 for row in M)


def encode(m, G):
    return tuple(sum(m[i] * G[i][j] for i in range(len(G))) % 2 for j in range(len(G[0])))


def wt(v):
    return sum(v)


def col(M, j):
    return tuple(row[j] for row in M)


def min_dependent_columns(H):
    n = len(H[0])
    for k in range(1, n + 1):
        for idx in combinations(range(n), k):
            if all(sum(H[r][j] for j in idx) % 2 == 0 for r in range(len(H))):
                return k
    return None


def H_from_systematic(G):
    k, n = len(G), len(G[0])
    P = [row[k:] for row in G]
    r = n - k
    return [[P[i][j] for i in range(k)] + [1 if t == j else 0 for t in range(r)] for j in range(r)]


if __name__ == "__main__":
    G = [[1, 0, 0, 1, 1, 0], [0, 1, 0, 0, 1, 1], [0, 0, 1, 1, 0, 1]]
    table = {"000": ("000000", 0), "001": ("001101", 3), "010": ("010011", 3), "011": ("011110", 4),
             "100": ("100110", 3), "101": ("101011", 4), "110": ("110101", 4), "111": ("111000", 3)}
    C = set()
    for m in product([0, 1], repeat=3):
        c = encode(m, G)
        C.add(c)
        key = "".join(map(str, m))
        assert "".join(map(str, c)) == table[key][0] and wt(c) == table[key][1], key
    # 닫혀 있다
    for a in C:
        for b in C:
            assert tuple((x + y) % 2 for x, y in zip(a, b)) in C
    dmin = min(sum(x != y for x, y in zip(a, b)) for a, b in combinations(sorted(C), 2))
    assert dmin == 3 == min(wt(c) for c in C if any(c)) and max(wt(c) for c in C) == 4
    assert 3 <= 6 - 3 + 1

    H = H_from_systematic(G)
    assert H == [[1, 0, 1, 1, 0, 0], [1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 1]]
    for g in G:
        assert matvec(H, g) == (0, 0, 0)
    for v in product([0, 1], repeat=6):
        assert (v in C) == (matvec(H, v) == (0, 0, 0))
    assert min_dependent_columns(H) == 3
    # 한 자리 오류의 신드롬 = 그 자리의 열
    for c in C:
        for e in range(6):
            r = list(c)
            r[e] ^= 1
            assert matvec(H, r) == col(H, e)
    assert len({col(H, j) for j in range(6)}) == 6  # 열이 모두 달라 한 자리 오류의 자리를 알 수 있다
    # 문서 예: 101011의 넷째 자리가 바뀌어 101111 -> 신드롬 (1,0,0) = H의 넷째 열
    assert matvec(H, (1, 0, 1, 1, 1, 1)) == (1, 0, 0) == col(H, 3)
    # 카드: 받은 열 110111 -> 신드롬 (0,1,0) = 다섯째 열 -> 110101
    assert matvec(H, (1, 1, 0, 1, 1, 1)) == (0, 1, 0) == col(H, 4)
    assert (1, 1, 0, 1, 0, 1) in C

    # 짝수 패리티 부호
    Gp = [[1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1]]
    assert encode((1, 0, 1), Gp) == (1, 0, 1, 0)
    Hp = H_from_systematic(Gp)
    assert Hp == [[1, 1, 1, 1]] and min_dependent_columns(Hp) == 2
    Cp = {encode(m, Gp) for m in product([0, 1], repeat=3)}
    assert min(wt(c) for c in Cp if any(c)) == 2
    # 슬라이드 p.4의 그림 그대로: 검사 열이 (0,1,0)
    Gs = [[1, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 0]]
    assert encode((1, 0, 1), Gs) == (1, 0, 1, 0)
    Cs = {encode(m, Gs) for m in product([0, 1], repeat=3)}
    assert min(wt(c) for c in Cs if any(c)) == 1  # 한 자리 오류도 못 알아챈다
    # 8비트 10010101: 1이 4개 -> 짝수 패리티 0, 홀수 패리티 1
    assert sum(map(int, "10010101")) == 4

    # 2차원 패리티 (슬라이드 p.5의 표)
    rows = ["10101111", "10000011", "01000000", "11110000", "10111001", "00000111", "11111111", "01111000"]
    rp = [sum(map(int, r)) % 2 for r in rows]
    cp = [sum(int(r[j]) for r in rows) % 2 for j in range(8)]
    assert rp == [0, 1, 1, 0, 1, 1, 0, 0] and cp == [1, 0, 1, 0, 0, 1, 0, 1]
    bad = [list(map(int, r)) for r in rows]
    bad[4][4] ^= 1  # 다섯째 행, 다섯째 열
    rp2 = [sum(r) % 2 for r in bad]
    cp2 = [sum(r[j] for r in bad) % 2 for j in range(8)]
    assert [i for i in range(8) if rp[i] != rp2[i]] == [4] and [j for j in range(8) if cp[j] != cp2[j]] == [4]
    print("ALL CHECKS PASSED")
```
{% endraw %}
