---
layout: "note"
title: "11_edit-distance_impl.py"
display_title: "11_edit-distance_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "11"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/edit-distance/"
parent_title: "편집 거리"
description: "자료와 정보 · 편집 거리 구현 코드"
sitemap: false
permalink: "/studies/data-and-information/code/11_edit-distance_impl/"
---
{% raw %}
[편집 거리](/Hongs_Blog/studies/data-and-information/edit-distance/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""편집 거리 구현과 자체 테스트.

문서: 11.편집 거리 (예시, 의사코드, 실행 추적, 정확성, 카드), 4.연습문제/11.편집 거리 예제 사다리
표의 칸 D[i][j] = 첫 문자열의 앞 i글자를 둘째 문자열의 앞 j글자로 바꾸는 가장 싼 비용 (i, j는 0부터).
문서 점화식의 S1(i)는 1부터 세므로 코드에서는 a[i - 1]이다.
주장:
  1. 점화식으로 채운 값은 편집 연산을 직접 다 해 보는 탐색(BFS)의 값과 같다 (짧은 문자열 전수 검사).
  2. 문서 예: intention -> execution은 모든 연산이 1이면 5, 바꾸기가 2면 8. 문서의 실행 추적 표 100칸과 일치.
  3. 비용이 모두 1인 편집 거리는 거리의 네 조건을 지킨다 (무작위 검사).
  4. 길이 차 <= ED <= 긴 쪽 길이. 길이가 같으면 ED <= 해밍 거리.
  5. 정규화 편집 거리 NED = ED / max(|r|, |s|)는 0~1, 편집 유사도 EDS = 1 - NED.
  6. 되짚기는 많아야 n + m걸음.
실행: python3 11_edit-distance_impl.py
"""
import random
from collections import deque
from itertools import product


def ed_table(a, b, ins=1, dele=1, sub=1):
    n, m = len(a), len(b)
    D = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        D[i][0] = D[i - 1][0] + dele
    for j in range(1, m + 1):
        D[0][j] = D[0][j - 1] + ins
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i][j] = min(D[i - 1][j] + dele,
                          D[i][j - 1] + ins,
                          D[i - 1][j - 1] + (0 if a[i - 1] == b[j - 1] else sub))
    return D


def ed(a, b, ins=1, dele=1, sub=1):
    return ed_table(a, b, ins, dele, sub)[len(a)][len(b)]


def backtrace(a, b, ins=1, dele=1, sub=1):
    """연산 목록을 앞에서부터 돌려준다. 같은 값이면 대각선, 위(지우기), 왼쪽(넣기) 순으로 고른다."""
    D = ed_table(a, b, ins, dele, sub)
    i, j, ops, steps = len(a), len(b), [], 0
    while i > 0 or j > 0:
        steps += 1
        if i > 0 and j > 0 and D[i][j] == D[i - 1][j - 1] + (0 if a[i - 1] == b[j - 1] else sub):
            ops.append(("같음" if a[i - 1] == b[j - 1] else "바꾸기", a[i - 1], b[j - 1]))
            i, j = i - 1, j - 1
        elif i > 0 and D[i][j] == D[i - 1][j] + dele:
            ops.append(("지우기", a[i - 1], ""))
            i -= 1
        else:
            ops.append(("넣기", "", b[j - 1]))
            j -= 1
    return ops[::-1], steps


def apply_ops(ops):
    return "".join(o[2] for o in ops)


def ed_bfs(a, b, alphabet):
    """편집 연산을 직접 해 보는 너비 우선 탐색 (비용이 모두 1일 때)."""
    limit = max(len(a), len(b))
    seen, q = {a: 0}, deque([a])
    while q:
        s = q.popleft()
        if s == b:
            return seen[s]
        nxt = set()
        for i in range(len(s)):
            nxt.add(s[:i] + s[i + 1:])
            for c in alphabet:
                nxt.add(s[:i] + c + s[i + 1:])
        for i in range(len(s) + 1):
            for c in alphabet:
                nxt.add(s[:i] + c + s[i:])
        for t in nxt:
            if t not in seen and len(t) <= limit + 1:
                seen[t] = seen[s] + 1
                q.append(t)


def hamming(a, b):
    return sum(x != y for x, y in zip(a, b))


def ned(a, b):
    return ed(a, b) / max(len(a), len(b))


def show(a, b, **kw):
    D = ed_table(a, b, **kw)
    lines = ["    # " + " ".join("%2s" % c for c in b)]
    for i, row in enumerate(D):
        lines.append("%s " % (a[i - 1] if i else "#") + " ".join("%2d" % v for v in row))
    return "\n".join(lines)


if __name__ == "__main__":
    # 1. 전수 검사
    words = ["".join(p) for k in range(0, 4) for p in product("ab", repeat=k)]
    for a in words:
        for b in words:
            assert ed(a, b) == ed_bfs(a, b, "ab"), (a, b)

    # 2. 문서 예
    A, B = "intention", "execution"
    assert ed(A, B) == 5 and ed(A, B, sub=2) == 8
    slide = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
             [1, 2, 3, 4, 5, 6, 7, 6, 7, 8],
             [2, 3, 4, 5, 6, 7, 8, 7, 8, 7],
             [3, 4, 5, 6, 7, 8, 7, 8, 9, 8],
             [4, 3, 4, 5, 6, 7, 8, 9, 10, 9],
             [5, 4, 5, 6, 7, 8, 9, 10, 11, 10],
             [6, 5, 6, 7, 8, 9, 8, 9, 10, 11],
             [7, 6, 7, 8, 9, 10, 9, 8, 9, 10],
             [8, 7, 8, 9, 10, 11, 10, 9, 8, 9],
             [9, 8, 9, 10, 11, 12, 11, 10, 9, 8]]
    assert ed_table(A, B, sub=2) == slide
    # 문서의 맞춤 INTE*NTION / *EXECUTION: 지우기 1, 바꾸기 3, 넣기 1
    align = [("지우기", "i", ""), ("바꾸기", "n", "e"), ("바꾸기", "t", "x"), ("같음", "e", "e"), ("넣기", "", "c"),
             ("바꾸기", "n", "u"), ("같음", "t", "t"), ("같음", "i", "i"), ("같음", "o", "o"), ("같음", "n", "n")]
    assert "".join(o[1] for o in align) == A and apply_ops(align) == B
    kinds = [o[0] for o in align]
    assert kinds.count("지우기") + kinds.count("넣기") == 2 and kinds.count("바꾸기") == 3
    assert 2 * 1 + 3 * 1 == 5 and 2 * 1 + 3 * 2 == 8
    # 길 찾기의 첫 걸음
    assert ed("intention", "ntention") == 1 and ed("intention", "eintention") == 1 and ed("intention", "entention") == 1

    # 3, 4, 5, 6. 무작위 검사
    rng = random.Random(7)
    rs = lambda: "".join(rng.choice("abc") for _ in range(rng.randint(0, 7)))
    for _ in range(3000):
        x, y, z = rs(), rs(), rs()
        d = ed(x, y)
        assert d >= 0 and (d == 0) == (x == y) and d == ed(y, x)
        assert ed(x, z) <= d + ed(y, z)
        assert abs(len(x) - len(y)) <= d <= max(len(x), len(y))
        if len(x) == len(y):
            assert d <= hamming(x, y)
        if x or y:
            assert 0 <= ned(x, y) <= 1
        for kw in ({}, {"sub": 2}, {"ins": 2, "dele": 3, "sub": 4}):
            ops, steps = backtrace(x, y, **kw)
            assert "".join(o[1] for o in ops) == x and apply_ops(ops) == y
            assert steps <= len(x) + len(y)
            cost = sum({"같음": 0, "바꾸기": kw.get("sub", 1), "지우기": kw.get("dele", 1), "넣기": kw.get("ins", 1)}[o[0]] for o in ops)
            assert cost == ed(x, y, **kw)
        # 바꾸기가 2면 '지우고 넣기'와 값이 같아, 바꾸기 없이도 같은 비용이 나온다
        assert ed(x, y, sub=2) == ed(x, y, sub=99)
    assert abs(ned(A, B) - 5 / 9) < 1e-12 and abs((1 - ned(A, B)) - 4 / 9) < 1e-12

    # ----- 문서의 예시와 실행 추적: flaw -> lawn -----
    assert hamming("flaw", "lawn") == 4 and ed("flaw", "lawn") == 2
    assert ed_table("flaw", "lawn") == [[0, 1, 2, 3, 4],
                                        [1, 1, 2, 3, 4],
                                        [2, 1, 2, 3, 4],
                                        [3, 2, 1, 2, 3],
                                        [4, 3, 2, 1, 2]]
    ops, _ = backtrace("flaw", "lawn")
    assert [o[0] for o in ops] == ["지우기", "같음", "같음", "같음", "넣기"]
    assert ned("flaw", "lawn") == 0.5
    # 오해 항목: abcde -> bcdea
    assert hamming("abcde", "bcdea") == 5 and ed("abcde", "bcdea") == 2
    # 카드
    assert ed_table("form", "from")[-1] == [4, 3, 2, 2, 2] and ed("form", "from") == 2
    assert ed("kitten", "sitting") == 3 and abs(ned("kitten", "sitting") - 3 / 7) < 1e-12
    assert ed("kitten", "sitting", sub=2) == 5
    assert ed("abc", "") == 3 and ed("", "abcd") == 4
    # 가중치: 이웃한 글자끼리 바꾸는 비용을 0.5로 낮추면 순위가 바뀐다 (활용 절의 예)
    def ed_w(a, b, subcost):
        n, m = len(a), len(b)
        D = [[0.0] * (m + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            D[i][0] = i
        for j in range(1, m + 1):
            D[0][j] = j
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                D[i][j] = min(D[i - 1][j] + 1, D[i][j - 1] + 1,
                              D[i - 1][j - 1] + (0 if a[i - 1] == b[j - 1] else subcost(a[i - 1], b[j - 1])))
        return D[n][m]
    near = lambda x, y: 0.5 if {x, y} == {"e", "r"} else 1
    assert ed("thr", "the") == 1 and ed("thr", "tho") == 1
    assert ed_w("thr", "the", near) == 0.5 and ed_w("thr", "tho", near) == 1

    # ----- 예제 사다리 -----
    assert ed_table("tea", "eat") == [[0, 1, 2, 3], [1, 1, 2, 2], [2, 1, 2, 3], [3, 2, 1, 2]]
    assert [o[0] for o in backtrace("tea", "eat")[0]] == ["지우기", "같음", "같음", "넣기"]
    assert ed_table("moon", "mono") == [[0, 1, 2, 3, 4], [1, 0, 1, 2, 3], [2, 1, 0, 1, 2], [3, 2, 1, 1, 1], [4, 3, 2, 1, 2]]
    assert ed("moon", "mono") == 2 and ned("moon", "mono") == 0.5
    assert ed_table("abcd", "bcda", sub=2) == [[0, 1, 2, 3, 4], [1, 2, 3, 4, 3], [2, 1, 2, 3, 4], [3, 2, 1, 2, 3], [4, 3, 2, 1, 2]]
    assert ed("abcd", "bcda") == 2 and ed("abcd", "bcda", sub=2) == 2
    assert ed("stone", "notes") == 4 and ed("stone", "notes", sub=2) == 6
    assert ed_table("stone", "notes")[-1] == [5, 4, 4, 4, 3, 4]
    assert abs(ned("stone", "notes") - 0.8) < 1e-12 and hamming("stone", "notes") == 5
    print("ALL CHECKS PASSED")
```
{% endraw %}
