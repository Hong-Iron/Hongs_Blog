---
layout: "note"
title: "10_frequent-patterns_verify.py"
display_title: "10_frequent-patterns_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/frequent-patterns/"
parent_title: "빈발 패턴"
description: "데이터 과학 · 빈발 패턴 검증 코드"
permalink: "/studies/data-science/code/10_frequent-patterns_verify/"
---
{% raw %}
[빈발 패턴](/Hongs_Blog/studies/data-science/frequent-patterns/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""빈발 패턴과 지지도 검증.

문서: 10.빈발 패턴 (예시, 정의, 카드), 11.연관 규칙 (예시, 카드)
출처: 데이터 과학 3회 슬라이드 3-1 p.7~11
주장:
  1. 거래 5개(맥주·견과·기저귀 / 맥주·커피·기저귀 / 맥주·기저귀·달걀 / 견과·달걀·우유 / 견과·커피·기저귀·달걀·우유)에서
     지지 개수 맥주 3, 기저귀 4, 견과 3, {맥주, 기저귀} 3, {맥주, 달걀} 1, {견과, 달걀} 2.
  2. min_sup 50%면 1항목 빈발 4개(기저귀 80%, 맥주·견과·달걀 60%), 2항목 빈발은 {맥주, 기저귀} 하나뿐, 3항목 빈발은 없다.
  3. 기저귀 -> 맥주 (60%, 75%), 맥주 -> 기저귀 (60%, 100%).
  4. 빈발 집합의 모든 부분집합은 빈발이다(무작위 자료로 확인). 길이 100인 빈발 집합의 공집합 아닌 부분집합은 2^100 - 1 ≈ 1.27 × 10^30개.
"""
from itertools import combinations
import random

DB = [{"Beer", "Nuts", "Diaper"}, {"Beer", "Coffee", "Diaper"}, {"Beer", "Diaper", "Eggs"},
      {"Nuts", "Eggs", "Milk"}, {"Nuts", "Coffee", "Diaper", "Eggs", "Milk"}]


def sup(db, X):
    return sum(1 for t in db if set(X) <= t)


def main():
    assert (sup(DB, ["Beer"]), sup(DB, ["Diaper"]), sup(DB, ["Nuts"])) == (3, 4, 3)
    assert (sup(DB, ["Beer", "Diaper"]), sup(DB, ["Beer", "Eggs"]), sup(DB, ["Nuts", "Eggs"])) == (3, 1, 2)
    print("[OK] p.7 지지 개수")
    items = sorted({i for t in DB for i in t})
    freq = {k: [c for c in combinations(items, k) if sup(DB, c) / 5 >= 0.5] for k in (1, 2, 3)}
    assert sorted(x[0] for x in freq[1]) == ["Beer", "Diaper", "Eggs", "Nuts"]
    assert freq[2] == [("Beer", "Diaper")] and freq[3] == []
    print("[OK] p.8: 빈발 1항목 4개, 2항목 {Beer, Diaper} 하나, 3항목 없음")
    s = sup(DB, ["Beer", "Diaper"]) / 5
    assert s == 0.6 and sup(DB, ["Beer", "Diaper"]) / sup(DB, ["Diaper"]) == 0.75 and sup(DB, ["Beer", "Diaper"]) / sup(DB, ["Beer"]) == 1
    print("[OK] p.10: Diaper -> Beer (60%, 75%), Beer -> Diaper (60%, 100%)")

    rnd = random.Random(5)
    for _ in range(200):
        db = [set(rnd.sample("ABCDEF", rnd.randint(1, 5))) for _ in range(rnd.randint(3, 10))]
        ms = rnd.randint(1, 3)
        for r in range(1, 5):
            for c in combinations("ABCDEF", r):
                if sup(db, c) >= ms:
                    assert all(sup(db, s) >= ms for k in range(1, r) for s in combinations(c, k))
    print("[OK] 무작위 자료 200개: 빈발 집합의 부분집합은 모두 빈발 (아프리오리 성질)")
    n = 2 ** 100 - 1
    assert 1.26e30 < n < 1.27e30
    print(f"[OK] p.11: 길이 100 빈발 집합의 부분집합 {n:.3e}개")

    # 카드 C2 (10): 같은 DB에서 {Nuts, Milk}의 지지 개수와 상대 지지도
    assert sup(DB, ["Nuts", "Milk"]) == 2
    # 카드 C3 (11): Eggs -> Nuts 의 지지도와 신뢰도
    assert sup(DB, ["Eggs", "Nuts"]) / 5 == 0.4 and round(sup(DB, ["Eggs", "Nuts"]) / sup(DB, ["Eggs"]), 3) == 0.667
    print("[OK] 카드: {Nuts, Milk} 2개(40%), Eggs -> Nuts (40%, 66.7%)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
