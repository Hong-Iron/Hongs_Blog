---
layout: "note"
title: "08_distance-similarity_verify.py"
display_title: "08_distance-similarity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
parent_url: "/studies/data-and-information/distance-similarity/"
parent_title: "거리와 유사도"
description: "자료와 정보 · 거리와 유사도 검증 코드"
permalink: "/studies/data-and-information/code/08_distance-similarity_verify/"
---
{% raw %}
[거리와 유사도](/Hongs_Blog/studies/data-and-information/distance-similarity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""거리와 유사도 문서의 주장 확인.

문서: 08.거리와 유사도
      (같이 확인: 3-2학기 데이터 과학 03.범주형 속성의 비유사도, 04.민코프스키 거리의 '자료와 정보' 단락)
출처: 자료와 정보 4회 슬라이드(강의04-1) p.2~9, p.13~16
주장:
  1. 유클리드·맨해튼·체비셰프 거리는 거리의 네 조건을 지킨다 (무작위 2,000쌍).
  2. 유사도 <-> 거리 바꾸기: s = 1 - d, s = 1 - d/D, s = 1/(1 + d)는 모두 "거리가 작을수록 유사도가 크다"를 지킨다.
  3. 네 조건 중 하나가 깨지는 예: 제곱 유클리드와 코사인 거리(삼각부등식), 좌표 하나만 보는 차이(d = 0인데 다른 점).
  4. 슬라이드의 4 x 3 예: 유클리드 5, 맨해튼 7, 체비셰프 4.
  5. 범주형 예(슬라이드 p.13~14): 겹침 유사도 2/3, 빈도 유사도 10/27, 13/27.
  6. 이진 부호(p.15~16): 9비트 예의 해밍 거리 5. 자카드 경우 1은 995/1005 = 0.99, 경우 2는 0, 해밍 거리는 둘 다 10.
실행: python3 08_distance-similarity_verify.py
"""
import math
import random
from fractions import Fraction


def lp(x, y, p):
    if p == math.inf:
        return max(abs(a - b) for a, b in zip(x, y))
    return sum(abs(a - b) ** p for a, b in zip(x, y)) ** (1 / p)


def cos_sim(x, y):
    return sum(a * b for a, b in zip(x, y)) / (math.hypot(*x) * math.hypot(*y))


if __name__ == "__main__":
    rng = random.Random(1)
    pt = lambda: tuple(rng.uniform(-5, 5) for _ in range(3))
    for _ in range(2000):
        x, y, z = pt(), pt(), pt()
        for p in (1, 2, math.inf):
            assert lp(x, y, p) >= 0 and lp(x, x, p) == 0 and lp(x, y, p) > 0
            assert abs(lp(x, y, p) - lp(y, x, p)) < 1e-12
            assert lp(x, z, p) <= lp(x, y, p) + lp(y, z, p) + 1e-9

    # 2. 바꾸기 식은 순서를 뒤집는다
    ds = sorted(rng.uniform(0, 10) for _ in range(200))
    D = 10
    for f in (lambda d: 1 - d / D, lambda d: 1 / (1 + d)):
        vals = [f(d) for d in ds]
        assert all(a >= b for a, b in zip(vals, vals[1:])) and all(0 <= v <= 1 for v in vals)
    assert 1 / (1 + 0) == 1 and 1 / (1 + 3) == 0.25 and 1 - 3 / 10 == 0.7
    # 바다사자 예: 유사도 0.81, 0.88, 0.81 -> d = 1 - s 는 0.19, 0.12, 0.19
    assert [round(1 - s, 2) for s in (0.81, 0.88, 0.81)] == [0.19, 0.12, 0.19]

    # 3. 조건이 깨지는 예
    sq = lambda a, b: (a - b) ** 2
    assert sq(0, 2) == 4 > sq(0, 1) + sq(1, 2) == 2
    cd = lambda x, y: 1 - cos_sim(x, y)
    a, b, c = (1, 0), (1, 1), (0, 1)
    assert abs(cd(a, c) - 1) < 1e-12 and abs(cd(a, b) - (1 - 1 / math.sqrt(2))) < 1e-12
    assert cd(a, c) > cd(a, b) + cd(b, c) and round(cd(a, b) + cd(b, c), 3) == 0.586
    assert cd((1, 2), (2, 4)) < 1e-12  # 다른 점인데 0
    first = lambda x, y: abs(x[0] - y[0])
    assert first((1, 2), (1, 9)) == 0

    # 4. 4 x 3
    assert lp((0, 0), (4, 3), 2) == 5 and lp((0, 0), (4, 3), 1) == 7 and lp((0, 0), (4, 3), math.inf) == 4
    assert lp((0, 0), (4, 3), 1) >= lp((0, 0), (4, 3), 2) >= lp((0, 0), (4, 3), math.inf)
    # 카드: (1, 5)와 (4, 1)
    assert lp((1, 5), (4, 1), 1) == 7 and lp((1, 5), (4, 1), 2) == 5 and lp((1, 5), (4, 1), math.inf) == 4

    # 5. 범주형
    pets = {"Bella": ("F", "red", "tame"), "Molly": ("F", "red", "shy"), "Teddy": ("M", "red", "tame"),
            "Ruby": ("F", "red", "brave"), "Coco": ("F", "silver", "cool"), "Max": ("M", "silver", "brave")}
    n = len(pets)
    freq = [{} for _ in range(3)]
    for v in pets.values():
        for i, x in enumerate(v):
            freq[i][x] = freq[i].get(x, 0) + 1
    p = lambda i, x: Fraction(freq[i][x], n)
    assert p(0, "F") == Fraction(2, 3) and p(0, "M") == Fraction(1, 3)
    assert p(1, "red") == Fraction(2, 3) and p(1, "silver") == Fraction(1, 3)
    assert p(2, "tame") == p(2, "brave") == Fraction(1, 3) and p(2, "shy") == p(2, "cool") == Fraction(1, 6)
    overlap = lambda a, b: Fraction(sum(x == y for x, y in zip(pets[a], pets[b])), 3)
    fsim = lambda a, b: sum(1 - p(i, x) ** 2 for i, (x, y) in enumerate(zip(pets[a], pets[b])) if x == y) / 3
    for a_, b_, f in [("Bella", "Molly", Fraction(10, 27)), ("Bella", "Teddy", Fraction(13, 27)),
                      ("Bella", "Ruby", Fraction(10, 27)), ("Molly", "Ruby", Fraction(10, 27))]:
        assert overlap(a_, b_) == Fraction(2, 3) and fsim(a_, b_) == f
    # 카드(데이터 과학 03 C4): Coco-Max는 silver만 같다
    assert overlap("Coco", "Max") == Fraction(1, 3) and fsim("Coco", "Max") == Fraction(8, 27)
    assert overlap("Bella", "Molly") == overlap("Bella", "Teddy") and fsim("Bella", "Teddy") > fsim("Bella", "Molly")

    # 6. 이진 부호
    x, y = "010010010", "100001011"
    assert sum(a != b for a, b in zip(x, y)) == 5 == sum(abs(int(a) - int(b)) for a, b in zip(x, y))
    X1, Y1 = set(range(1000)), set(range(5, 1005))
    assert len(X1 & Y1) == 995 and len(X1 ^ Y1) == 10
    assert Fraction(len(X1 & Y1), len(X1 | Y1)) == Fraction(995, 1005) and round(995 / 1005, 2) == 0.99
    X2, Y2 = set(range(5)), set(range(5, 10))
    assert len(X2 ^ Y2) == 10 and len(X2 & Y2) == 0
    # 장바구니 표: basket1 = 00110, basket2 = 11000, basket4 = 10101
    b1, b2, b4 = "00110", "11000", "10101"
    ham = lambda s, t: sum(u != v for u, v in zip(s, t))
    jac = lambda s, t: Fraction(sum(u == v == "1" for u, v in zip(s, t)), sum(u == "1" or v == "1" for u, v in zip(s, t)))
    assert ham(b1, b2) == 4 and jac(b1, b2) == 0 and ham(b1, b4) == 3 and jac(b1, b4) == Fraction(1, 4)
    print("ALL CHECKS PASSED")
```
{% endraw %}
