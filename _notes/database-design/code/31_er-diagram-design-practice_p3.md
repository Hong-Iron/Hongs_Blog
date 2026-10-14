---
layout: "note"
title: "31_er-diagram-design-practice_p3.py"
display_title: "31_er-diagram-design-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "31"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-diagram-design-practice/"
parent_title: "ER 다이어그램 설계 연습"
description: "데이터베이스 설계 · ER 다이어그램 설계 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/31_er-diagram-design-practice_p3/"
---
{% raw %}
[ER 다이어그램 설계 연습](/Hongs_Blog/studies/database-design/er-diagram-design-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER 다이어그램 설계 연습 p3: CONF_REVIEW.

문서: 31.ER 다이어그램 설계 연습 (문제 3)
출처: 데이터베이스 설계 6주차 슬라이드 6-1 풀이 p.27~35
확인하는 것:
  1. 완성 그림(p.35)의 (min, max): SUBMITS 저자 (1,N)·논문 (1,N), IS_CONTACT 저자 (0,N)·논문 (1,1),
     REVIEWS 심사자 (1,N)·논문 (2,4). 요구사항을 지키는 자료는 통과한다.
  2. p.32의 물음: Is_contact를 SUBMITS의 속성으로만 두면, 연락 저자가 둘이거나 없는 논문도 통과한다.
     IS_CONTACT를 따로 두고 논문 쪽에 (1,1)을 적으면 둘 다 걸린다.
  3. 심사자가 1명이거나 5명인 논문, 심사할 논문이 없는 심사자는 REVIEWS에서 걸린다.
  4. 그림이 적지 못하는 것: 연락 저자가 그 논문의 저자가 아니어도 (min, max)는 모두 통과한다.
"""
from collections import Counter

N = float("inf")
DESIGN_A = {   # p.32: Is_contact는 SUBMITS의 속성
    "SUBMITS": [("AUTHOR", (1, N)), ("PAPER", (1, N))],
    "REVIEWS": [("REVIEWER", (1, N)), ("PAPER", (2, 4))],
}
DESIGN_B = dict(DESIGN_A, IS_CONTACT=[("AUTHOR", (0, N)), ("PAPER", (1, 1))])   # p.33, p.35


def violations(schema, entities, rels):
    out = []
    for rel, roles in schema.items():
        for i, (etype, (lo, hi)) in enumerate(roles):
            count = Counter(t[i] for t in rels[rel])
            out += [(rel, etype, e, count[e]) for e in entities[etype] if not lo <= count[e] <= hi]
    return out


ENTS = {"AUTHOR": ["a1", "a2", "a3"], "REVIEWER": ["r1", "r2", "r3"], "PAPER": ["p1", "p2"]}
SUBMITS = [("a1", "p1"), ("a2", "p1"), ("a2", "p2"), ("a3", "p2")]
REVIEWS = [("r1", "p1"), ("r2", "p1"), ("r1", "p2"), ("r2", "p2"), ("r3", "p2")]


def main():
    good = {"SUBMITS": SUBMITS, "REVIEWS": REVIEWS, "IS_CONTACT": [("a1", "p1"), ("a2", "p2")]}
    assert violations(DESIGN_B, ENTS, good) == []
    print("[OK] 요구사항을 지키는 자료는 완성 그림의 (min, max)를 모두 지킨다")

    # 설계 A: Is_contact는 SUBMITS 인스턴스에 붙은 값일 뿐이라 구조 제약이 보지 못한다
    flags_two = {("a1", "p1"): True, ("a2", "p1"): True, ("a2", "p2"): True, ("a3", "p2"): False}
    flags_none = {k: False for k in flags_two}
    contacts = lambda flags, paper: [a for (a, p), f in flags.items() if p == paper and f]
    assert len(contacts(flags_two, "p1")) == 2 and len(contacts(flags_none, "p1")) == 0
    assert violations(DESIGN_A, ENTS, good) == []          # 표시값이 어떻든 SUBMITS의 짝은 같다
    print("[OK] 설계 A: 연락 저자 표시가 둘이어도, 하나도 없어도 구조 제약은 통과한다")

    two = dict(good, IS_CONTACT=[("a1", "p1"), ("a2", "p1"), ("a2", "p2")])
    none = dict(good, IS_CONTACT=[("a2", "p2")])
    assert violations(DESIGN_B, ENTS, two) == [("IS_CONTACT", "PAPER", "p1", 2)]
    assert violations(DESIGN_B, ENTS, none) == [("IS_CONTACT", "PAPER", "p1", 0)]
    print("[OK] 설계 B: 연락 저자가 둘인 논문, 없는 논문은 IS_CONTACT의 (1,1)에 걸린다")

    one_reviewer = dict(good, REVIEWS=[("r1", "p1"), ("r1", "p2"), ("r2", "p2"), ("r3", "p2")])
    assert violations(DESIGN_B, ENTS, one_reviewer) == [("REVIEWS", "PAPER", "p1", 1)]
    five = dict(ENTS, REVIEWER=["r1", "r2", "r3", "r4", "r5"])
    crowd = dict(good, REVIEWS=[(r, "p1") for r in five["REVIEWER"]] + [("r1", "p2"), ("r2", "p2")])
    assert violations(DESIGN_B, five, crowd) == [("REVIEWS", "PAPER", "p1", 5)]
    idle = dict(ENTS, REVIEWER=["r1", "r2", "r3", "r4"])
    assert violations(DESIGN_B, idle, good) == [("REVIEWS", "REVIEWER", "r4", 0)]
    print("[OK] 심사자 1명·5명인 논문, 논문이 없는 심사자는 REVIEWS에서 걸린다")

    # a3은 p1의 저자가 아닌데 p1의 연락 저자다. (min, max)는 모두 통과한다
    outsider = dict(good, IS_CONTACT=[("a3", "p1"), ("a2", "p2")])
    assert ("a3", "p1") not in SUBMITS and violations(DESIGN_B, ENTS, outsider) == []
    print("[OK] 그림의 한계: 저자가 아닌 사람이 연락 저자여도 (min, max)는 통과한다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
