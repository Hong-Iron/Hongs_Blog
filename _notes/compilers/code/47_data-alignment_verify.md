---
layout: "note"
title: "47_data-alignment_verify.py"
display_title: "47_data-alignment_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/data-alignment/"
parent_title: "데이터 정렬과 패딩"
description: "컴파일러 · 데이터 정렬과 패딩 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/47_data-alignment_verify/"
---
{% raw %}
[데이터 정렬과 패딩](/Hongs_Blog/studies/compilers/data-alignment/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 데이터 정렬과 패딩, 배열이 메모리에 놓이는 모양.
# 실행: python3 47_data-alignment_verify.py  (표준 라이브러리만 쓴다)
# 슬라이드 14회 p.6~9의 표와 그림(오프셋 0, 2, 4, 8, 12)을 계산으로 다시 만든다.
import ctypes

# 14회 p.7의 표: x86 32비트 기계에서 C 기본 타입의 (크기, 정렬)
TABLE = {"char": (1, 1), "short": (2, 2), "int": (4, 4), "long": (4, 4), "float": (4, 4),
         "double": (8, 4), "long long": (8, 4), "pointer": (4, 4)}


def layout(types, table=TABLE):
    """선언 순서대로 놓는다. 각 객체의 시작 주소를 그 타입 정렬 값의 배수로 올린다.
    돌려주는 값: (오프셋 목록, 끝 주소, 패딩 바이트 수)."""
    offs, pos, pad = [], 0, 0
    for t in types:
        size, align = table[t]
        skip = (-pos) % align           # 다음 배수까지 비우는 바이트
        pad += skip
        pos += skip
        offs.append(pos)
        pos += size
    return offs, pos, pad


def c_index(i, j, n):
    """C 방식 2차원 배열 A[m][n]에서 A[i][j]가 몇 번째 칸인가 (행을 차례로 이어 붙인다)."""
    return i * n + j


if __name__ == "__main__":
    # ---- p.7: char a; short b; short c; int d; double e; ----
    offs, end, pad = layout(["char", "short", "short", "int", "double"])
    assert offs == [0, 2, 4, 8, 12]
    assert end == 20 and pad == 3       # 1번지 한 칸, 6~7번지 두 칸이 빈다
    assert sum(TABLE[t][0] for t in ["char", "short", "short", "int", "double"]) == 17
    # 모든 시작 주소가 정렬 값의 배수다 (N바이트 정렬의 뜻, p.6)
    for o, t in zip(offs, ["char", "short", "short", "int", "double"]):
        assert o % TABLE[t][1] == 0
    # 같은 규칙(정렬 값을 4로 묶은 것)을 ctypes에 시켜도 같은 오프셋이 나온다

    class Rec(ctypes.Structure):
        _pack_ = 4
        _layout_ = "ms"
        _fields_ = [("a", ctypes.c_char), ("b", ctypes.c_short), ("c", ctypes.c_short),
                    ("d", ctypes.c_int), ("e", ctypes.c_double)]
    assert [getattr(Rec, f).offset for f in "abcde"] == [0, 2, 4, 8, 12] and ctypes.sizeof(Rec) == 20
    # double을 8바이트 정렬로 바꾸면 e가 16번지로 밀린다 (표의 "double은 4바이트 정렬"이 결과를 바꾼다)
    t8 = dict(TABLE, double=(8, 8))
    assert layout(["char", "short", "short", "int", "double"], t8)[0] == [0, 2, 4, 8, 16]
    # 선언 순서를 바꾸면 패딩이 달라진다: 큰 것부터 놓으면 0, char와 int를 번갈아 놓으면 6
    assert layout(["double", "int", "short", "short", "char"])[1:] == (17, 0)
    assert layout(["char", "int", "char", "int"])[1:] == (16, 6)
    # 정렬 값이 1이면 패딩이 없다
    assert layout(["char"] * 5) == ([0, 1, 2, 3, 4], 5, 0)

    # ---- p.8: C 방식 배열은 원소가 이어져 있다. A[i]의 주소 = 시작 주소 + i × 원소 크기 ----
    base, size, n = 1000, 4, 6
    addrs = [base + i * size for i in range(n)]
    assert all(b - a == size for a, b in zip(addrs, addrs[1:]))
    # Java 방식은 맨 앞에 길이 칸이 하나 더 있다 (칸 크기를 4로 두면 A[i]는 4만큼 뒤)
    java = [base + 4 + i * size for i in range(n)]
    assert java[0] - base == 4 and len(java) == n

    # ---- p.9: C 방식 2차원 배열은 한 덩어리. 그림의 순서는 A[0][0], …, A[0][n-1], A[1][0], … ----
    m, n = 3, 4
    order = [(i, j) for i in range(m) for j in range(n)]
    assert [c_index(i, j, n) for i, j in order] == list(range(m * n))
    assert c_index(1, 0, n) == n and c_index(m - 1, n - 1, n) == m * n - 1
    # Java 방식은 덩어리가 1 + m개: 바깥 배열(길이 m과 주소 m칸) 하나와 안쪽 배열 m개
    blocks = 1 + m
    cells = (1 + m) + m * (1 + n)       # 바깥: 길이 1 + 주소 m, 안쪽마다: 길이 1 + 원소 n
    assert blocks == 4 and cells == 19 and m * n == 12

    # ---- 카드 C1: char c1; int i; char c2; short s; double d; ----
    assert layout(["char", "int", "char", "short", "double"]) == ([0, 4, 8, 10, 12], 20, 4)
    assert layout(["double", "int", "short", "char", "char"]) == ([0, 8, 12, 14, 15], 16, 0)
    print("ALL CHECKS PASSED")
```
{% endraw %}
