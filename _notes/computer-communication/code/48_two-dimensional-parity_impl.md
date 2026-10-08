---
layout: "note"
title: "48_two-dimensional-parity_impl.py"
display_title: "48_two-dimensional-parity_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "48"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/two-dimensional-parity/"
parent_title: "2차원 패리티"
description: "컴퓨터 통신 · 2차원 패리티 구현 코드"
permalink: "/studies/computer-communication/code/48_two-dimensional-parity_impl/"
---
{% raw %}
[2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""2차원 패리티 구현과 검증 (슬라이드 p.49, p.60)."""
import itertools, random

ROWS = ["1011110", "1101001", "0101001", "1011111", "0110100", "0001110"]     # 데이터 6바이트(7비트씩)


def encode(rows):
    m = [[int(c) for c in r] for r in rows]
    m = [r + [sum(r) % 2] for r in m]                         # 가로(행) 패리티 비트
    m.append([sum(col) % 2 for col in zip(*m)])               # 세로(열) 패리티 바이트
    return m


def check(m):
    bad_rows = [i for i, r in enumerate(m) if sum(r) % 2]
    bad_cols = [j for j, c in enumerate(zip(*m)) if sum(c) % 2]
    return bad_rows, bad_cols


def main():
    m = encode(ROWS)
    assert [r[-1] for r in m[:-1]] == [1, 0, 1, 0, 1, 1]      # 슬라이드의 패리티 비트
    assert m[-1] == [1, 1, 1, 1, 0, 1, 1, 0]                   # 슬라이드의 패리티 바이트 1111011 0
    assert check(m) == ([], [])
    # 1비트 오류: 행과 열이 하나씩 틀려 위치를 알고 고칠 수 있다
    for i in range(7):
        for j in range(8):
            r = [row[:] for row in m]; r[i][j] ^= 1
            br, bc = check(r)
            assert br == [i] and bc == [j]
            r[br[0]][bc[0]] ^= 1
            assert r == m
    # 2·3비트 오류는 모두 검출 (위치는 모를 수 있다)
    cells = [(i, j) for i in range(7) for j in range(8)]
    for k in (2, 3):
        for pos in itertools.combinations(cells, k):
            r = [row[:] for row in m]
            for i, j in pos:
                r[i][j] ^= 1
            assert check(r) != ([], [])
    # 직사각형 꼭짓점 4비트 오류는 놓친다
    r = [row[:] for row in m]
    for i, j in ((0, 0), (0, 3), (2, 0), (2, 3)):
        r[i][j] ^= 1
    assert check(r) == ([], [])
    # 카드 C2: 행 2와 열 5가 틀리면 (행 2, 열 5) 비트를 뒤집는다
    r = [row[:] for row in m]; r[2][5] ^= 1
    assert check(r) == ([2], [5])
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
