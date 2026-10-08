---
layout: "note"
title: "34_curse-of-dimensionality_verify.py"
display_title: "34_curse-of-dimensionality_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/curse-of-dimensionality/"
parent_title: "차원의 저주"
description: "데이터 과학 · 차원의 저주 검증 코드"
permalink: "/studies/data-science/code/34_curse-of-dimensionality_verify/"
---
{% raw %}
[차원의 저주](/Hongs_Blog/studies/data-science/curse-of-dimensionality/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""차원의 저주 검증.

문서: 34.차원의 저주 (예시, 정의, 카드)
출처: 데이터 과학 10회 슬라이드 10-1 p.9~11
주장:
  1. 단위 초입방체에 고르게 흩은 점 1,000개 중 가장 가까운 10개를 담는 작은 초입방체의 한 변
     l = (10/1000)^(1/d): d = 1 -> 0.01, 2 -> 0.1, 3 -> 0.215, 10 -> 0.631, 100 -> 0.955, 1000 -> 0.9954.
  2. 무작위 점 쌍의 거리에서 (최대 - 최소)/최소가 차원이 커질수록 0 쪽으로 준다 (거리가 비슷해진다).
  3. 카드 C2: 점 100개 중 가까운 1개를 담는 한 변이 0.5가 되는 차원 d는 (1/100)^(1/d) >= 0.5 -> d >= 6.64, 곧 7.
"""
import math
import random


def edge(k, n, d):
    return (k / n) ** (1 / d)


def main():
    vals = {d: edge(10, 1000, d) for d in (1, 2, 3, 10, 100, 1000)}
    assert round(vals[1], 3) == 0.01 and round(vals[2], 3) == 0.1 and round(vals[3], 3) == 0.215
    assert round(vals[10], 2) == 0.63 and round(vals[100], 3) == 0.955 and round(vals[1000], 4) == 0.9954
    print("[OK] p.10 표:", {d: round(v, 4) for d, v in vals.items()})

    rnd = random.Random(0)
    ratios = []
    for d in (2, 10, 100, 1000):
        P = [[rnd.random() for _ in range(d)] for _ in range(60)]
        ds = [math.dist(P[i], P[j]) for i in range(60) for j in range(i + 1, 60)]
        ratios.append((max(ds) - min(ds)) / min(ds))
    print("     (최대-최소)/최소, d = 2, 10, 100, 1000:", [round(r, 2) for r in ratios])
    assert all(a > b for a, b in zip(ratios, ratios[1:])) and ratios[-1] < 0.25
    print("[OK] 차원이 커질수록 가장 먼 쌍과 가장 가까운 쌍의 거리 차이가 상대적으로 준다")

    d = next(d for d in range(1, 50) if edge(1, 100, d) >= 0.5)
    assert d == 7 and math.log(100) / math.log(2) > 6.6
    print("[OK] 카드 C2: d = 7")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
