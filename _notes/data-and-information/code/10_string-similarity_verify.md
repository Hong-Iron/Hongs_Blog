---
layout: "note"
title: "10_string-similarity_verify.py"
display_title: "10_string-similarity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
parent_url: "/studies/data-and-information/string-similarity/"
parent_title: "문자열 유사도"
description: "자료와 정보 · 문자열 유사도 검증 코드"
permalink: "/studies/data-and-information/code/10_string-similarity_verify/"
---
{% raw %}
[문자열 유사도](/Hongs_Blog/studies/data-and-information/string-similarity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""문자열 유사도 문서의 주장 확인.

문서: 10.문자열 유사도
      (같이 확인: 공학수학 선형대수학 02.내적과 노름의 '자료와 정보' 단락)
출처: 자료와 정보 4회 슬라이드(강의04-1) p.12, (강의04-2) p.7~11
주장:
  1. 슬라이드 예 r = {frontier, computer, science}, s = {computer, science}:
     OLP 2, JAC 2/3, COS 2/sqrt(6) = 0.816, DICE 4/5.
  2. JAC, COS, DICE는 0~1이고, 두 집합이 같을 때만 1, 겹치지 않을 때만 0이다. OLP는 그렇지 않다.
  3. 늘 JAC <= DICE <= COS. JAC = DICE / (2 - DICE).
  4. 토큰 집합을 0/1 벡터로 적으면 토큰 코사인은 벡터의 코사인 유사도와 같다.
  5. 토큰 기반은 낱말 순서를 보지 않고, 낱말 안의 오타 하나에 낱말 전체가 어긋난다.
  6. 코사인 유사도는 -1~1, 성분이 모두 0 이상이면 0~1이고 코사인 거리 1 - cos도 0~1이다.
실행: python3 10_string-similarity_verify.py
"""
import math
import random
from fractions import Fraction


def tokens(s):
    return set(s.lower().split())


def olp(r, s):
    return len(r & s)


def jac(r, s):
    return Fraction(len(r & s), len(r | s))


def cos(r, s):
    return len(r & s) / math.sqrt(len(r) * len(s))


def dice(r, s):
    return Fraction(2 * len(r & s), len(r) + len(s))


def vec_cos(x, y):
    return sum(a * b for a, b in zip(x, y)) / (math.sqrt(sum(a * a for a in x)) * math.sqrt(sum(b * b for b in y)))


if __name__ == "__main__":
    r, s = tokens("frontier computer science"), tokens("computer science")
    assert olp(r, s) == 2 and jac(r, s) == Fraction(2, 3) and dice(r, s) == Fraction(4, 5)
    assert abs(cos(r, s) - 2 / math.sqrt(6)) < 1e-12 and round(cos(r, s), 3) == 0.816
    assert Fraction(len(r & s), len(r) + len(s) - len(r & s)) == jac(r, s)
    # 0/1 벡터로
    vocab = ["frontier", "computer", "science"]
    x = [1 if w in r else 0 for w in vocab]
    y = [1 if w in s else 0 for w in vocab]
    assert x == [1, 1, 1] and y == [0, 1, 1]
    assert abs(vec_cos(x, y) - cos(r, s)) < 1e-12
    assert sum(a * b for a, b in zip(x, y)) == 2

    rng = random.Random(5)
    U = list("abcdefgh")
    for _ in range(3000):
        a = set(rng.sample(U, rng.randint(1, 8)))
        b = set(rng.sample(U, rng.randint(1, 8)))
        j, c, d = jac(a, b), cos(a, b), dice(a, b)
        assert 0 <= j <= 1 and 0 <= c <= 1 + 1e-12 and 0 <= d <= 1
        assert (j == 1) == (a == b) == (d == 1) and (abs(c - 1) < 1e-12) == (a == b)
        assert (j == 0) == (not a & b) == (d == 0) == (c == 0)
        assert j <= d and float(d) <= c + 1e-12
        assert j == d / (2 - d)
        va = [1 if u in a else 0 for u in U]
        vb = [1 if u in b else 0 for u in U]
        assert abs(vec_cos(va, vb) - c) < 1e-12
    # OLP는 크기를 보지 않는다
    big1, big2 = set(range(100)), set(range(2, 102))
    assert olp({"a", "b"}, {"a", "b"}) == 2 and olp(big1, big2) == 98 and jac(big1, big2) < 1

    # 5. 순서와 오타
    assert jac(tokens("computer science"), tokens("science computer")) == 1
    assert jac(tokens("computer science"), tokens("computer sciense")) == Fraction(1, 3)
    # 카드
    r, s = tokens("data and information"), tokens("information theory")
    assert olp(r, s) == 1 and jac(r, s) == Fraction(1, 4) and dice(r, s) == Fraction(2, 5)
    assert abs(cos(r, s) - 1 / math.sqrt(6)) < 1e-12 and round(cos(r, s), 3) == 0.408

    # 6. 코사인의 범위
    for _ in range(2000):
        u = [rng.uniform(-1, 1) for _ in range(4)]
        v = [rng.uniform(-1, 1) for _ in range(4)]
        assert -1 - 1e-12 <= vec_cos(u, v) <= 1 + 1e-12
        up, vp = [abs(t) for t in u], [abs(t) for t in v]
        assert -1e-12 <= vec_cos(up, vp) <= 1 + 1e-12 and -1e-12 <= 1 - vec_cos(up, vp) <= 1 + 1e-12
    assert vec_cos([1, 0], [-1, 0]) == -1 and 1 - vec_cos([1, 0], [-1, 0]) == 2
    assert abs(vec_cos([1, 2], [2, 4]) - 1) < 1e-12
    # 카드(내적과 노름 C6): r = {a, b, c, d}, s = {c, d, e}
    r, s = set("abcd"), set("cde")
    assert abs(cos(r, s) - 2 / math.sqrt(12)) < 1e-12 and round(cos(r, s), 3) == 0.577
    assert abs(vec_cos([1, 1, 1, 1, 0], [0, 0, 1, 1, 1]) - cos(r, s)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
