---
layout: "note"
title: "04_minkowski-distance_verify.py"
display_title: "04_minkowski-distance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/minkowski-distance/"
parent_title: "민코프스키 거리"
description: "데이터 과학 · 민코프스키 거리 검증 코드"
permalink: "/studies/data-science/code/04_minkowski-distance_verify/"
---
{% raw %}
[민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""민코프스키 거리 검증.

문서: 04.민코프스키 거리 (예시, 정의, 반례, 카드 C2·C3)
출처: 데이터 과학 2회 슬라이드 p.25
주장:
  1. x1 = (1, 2), x2 = (3, 5): 유클리드 sqrt(13) = 3.61, 맨해튼 5 (슬라이드 그림).
  2. h = 1, 2에서 세 성질(0 이상, 대칭, 삼각부등식)을 무작위 점 2,000쌍에서 만족한다.
  3. h가 커질수록 거리는 줄어 가장 큰 좌표 차이(최대 거리, h -> 무한)에 다가간다. (1,2)-(3,5)에서 3.
  4. h < 1이면 삼각부등식이 깨진다: h = 1/2, (0,0)-(1,1) = 4 > (0,0)-(1,0) + (1,0)-(1,1) = 2.
  5. 단위를 바꾸면 거리 순위가 바뀔 수 있다 (정규화가 필요한 이유). 카드 C3.
"""
import random


def mink(x, y, h):
    if h == float("inf"):
        return max(abs(a - b) for a, b in zip(x, y))
    return sum(abs(a - b) ** h for a, b in zip(x, y)) ** (1 / h)


def main():
    x1, x2 = (1, 2), (3, 5)
    assert round(mink(x1, x2, 2), 2) == 3.61 and mink(x1, x2, 1) == 5
    print("[OK] p.25: 유클리드 3.61, 맨해튼 5")

    rnd = random.Random(0)
    for h in (1, 2, 3):
        for _ in range(2000):
            p, q, r = [tuple(rnd.uniform(-5, 5) for _ in range(3)) for _ in range(3)]
            assert mink(p, q, h) >= 0 and abs(mink(p, q, h) - mink(q, p, h)) < 1e-12
            assert mink(p, r, h) <= mink(p, q, h) + mink(q, r, h) + 1e-9
    print("[OK] h = 1, 2, 3: 무작위 2,000쌍에서 세 성질")

    ds = [mink(x1, x2, h) for h in (1, 2, 4, 10, 50)]
    assert all(a > b for a, b in zip(ds, ds[1:])) and abs(ds[-1] - 3) < 0.05
    assert mink(x1, x2, float("inf")) == 3
    print("[OK] h = 1, 2, 4, 10, 50:", [round(d, 3) for d in ds], "-> 최대 거리 3")

    z, q = (0, 0), (4, 3)
    assert (mink(z, q, 1), mink(z, q, 2), mink(z, q, float("inf"))) == (7, 5, 4)
    print("[OK] 카드 C1: 7, 5, 4")

    o, a, b = (0, 0), (1, 0), (1, 1)
    assert mink(o, b, 0.5) == 4 and mink(o, a, 0.5) + mink(a, b, 0.5) == 2
    print("[OK] h = 1/2: 4 > 1 + 1, 삼각부등식이 깨진다")

    # 카드 C3: (키, 몸무게 kg). 키를 cm로 적을 때와 m로 적을 때
    A, B, C = (170, 60), (180, 61), (171, 62)
    assert round(mink(A, B, 2), 2) == 10.05 and round(mink(A, C, 2), 2) == 2.24      # cm: C가 가깝다
    Am, Bm, Cm = (1.70, 60), (1.80, 61), (1.71, 62)
    assert round(mink(Am, Bm, 2), 3) == 1.005 and round(mink(Am, Cm, 2), 3) == 2.0   # m: B가 가깝다
    print("[OK] 카드 C3: 키를 cm에서 m로 바꾸면 (170,60)에 더 가까운 점이 (171,62)에서 (180,61)로 바뀐다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
