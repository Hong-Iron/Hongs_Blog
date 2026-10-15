---
layout: "note"
title: "31_er-diagram-design-practice_p2.py"
display_title: "31_er-diagram-design-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "31"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-diagram-design-practice/"
parent_title: "ER 다이어그램 설계 연습"
description: "데이터베이스 설계 · ER 다이어그램 설계 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/31_er-diagram-design-practice_p2/"
---
{% raw %}
[ER 다이어그램 설계 연습](/Hongs_Blog/studies/database-design/er-diagram-design-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER 다이어그램 설계 연습 p2: MOVIE.

문서: 31.ER 다이어그램 설계 연습 (문제 2)
확인하는 것:
  1. 겹선을 MOVIE 쪽 둘에만 그은 그림의 숫자와 선을 (min, max)로 옮기면 PRODUCES는 1:N, 나머지 셋은 M:N이다.
  2. 요구사항의 "one or more" 문장 여섯 개 가운데 그 그림의 겹선이 지켜 주는 것은 둘뿐이다
     (영화마다 제작사 하나, 영화마다 감독 한 명 이상).
     나머지 넷(영화마다 배우 한 명 이상, 배우는 한 편 이상 출연, 감독은 한 편 이상 연출,
     제작사는 한 편 이상 제작)을 어긴 자료가 그 그림의 규칙은 통과한다.
  3. 요구사항대로 겹선을 더 그은 판은 그 넷을 모두 걸러 낸다.
"""
from collections import Counter

N = float("inf")
# 틀리기 쉬운 그림: 겹선은 MOVIE-PRODUCES, MOVIE-DIRECTS 둘뿐이다
SLIDE = {
    "PRODUCES": [("PRODUCTION", (0, N)), ("MOVIE", (1, 1))],
    "DIRECTS": [("DIRECTOR", (0, N)), ("MOVIE", (1, N))],
    "ACTS": [("ACTOR", (0, N)), ("MOVIE", (0, N))],
    "DIR_ACTS": [("DIRECTOR", (0, N)), ("MOVIE", (0, N))],
}
# 요구사항의 "one or more"를 모두 옮긴 판 (문서의 답)
BY_REQUIREMENT = dict(SLIDE,
                      PRODUCES=[("PRODUCTION", (1, N)), ("MOVIE", (1, 1))],
                      DIRECTS=[("DIRECTOR", (1, N)), ("MOVIE", (1, N))],
                      ACTS=[("ACTOR", (1, N)), ("MOVIE", (1, N))])


def violations(schema, entities, rels):
    out = []
    for rel, roles in schema.items():
        for i, (etype, (lo, hi)) in enumerate(roles):
            count = Counter(t[i] for t in rels.get(rel, []))
            out += [(rel, etype, e, count[e]) for e in entities[etype] if not lo <= count[e] <= hi]
    return out


def ratio(roles):
    (_, a), (_, b) = roles
    left, right = ("1" if b[1] == 1 else "N"), ("1" if a[1] == 1 else "N")
    return "M:N" if (left, right) == ("N", "N") else f"{left}:{right}"


def main():
    assert ratio(SLIDE["PRODUCES"]) == "1:N"
    assert [ratio(SLIDE[r]) for r in ("DIRECTS", "ACTS", "DIR_ACTS")] == ["M:N"] * 3
    print("[OK] PRODUCES는 제작사 1 : 영화 N, DIRECTS·ACTS·DIR_ACTS는 M:N")

    ents = {"PRODUCTION": ["c1"], "MOVIE": ["m1"], "DIRECTOR": ["d1"], "ACTOR": ["a1"]}
    rels = {"PRODUCES": [("c1", "m1")], "DIRECTS": [("d1", "m1")], "ACTS": [("a1", "m1")], "DIR_ACTS": []}
    assert violations(SLIDE, ents, rels) == [] and violations(BY_REQUIREMENT, ents, rels) == []

    # MOVIE 쪽에만 겹선을 그은 그림이 지켜 주는 두 문장
    no_company = dict(rels, PRODUCES=[])
    assert ("PRODUCES", "MOVIE", "m1", 0) in violations(SLIDE, ents, no_company)
    no_director = dict(rels, DIRECTS=[])
    assert ("DIRECTS", "MOVIE", "m1", 0) in violations(SLIDE, ents, no_director)
    print("[OK] MOVIE 쪽에만 겹선을 그은 그림: 제작사 없는 영화, 감독 없는 영화는 걸린다")

    # 그 그림이 못 지키는 네 문장
    cases = {
        "배우 없는 영화": (ents, dict(rels, ACTS=[]), ("ACTS", "MOVIE", "m1", 0)),
        "출연작 없는 배우": (dict(ents, ACTOR=["a1", "a2"]), rels, ("ACTS", "ACTOR", "a2", 0)),
        "연출작 없는 감독": (dict(ents, DIRECTOR=["d1", "d2"]), rels, ("DIRECTS", "DIRECTOR", "d2", 0)),
        "제작한 영화 없는 제작사": (dict(ents, PRODUCTION=["c1", "c2"]), rels, ("PRODUCES", "PRODUCTION", "c2", 0)),
    }
    for name, (e, r, expect) in cases.items():
        assert violations(SLIDE, e, r) == [], name
        assert expect in violations(BY_REQUIREMENT, e, r), name
    print("[OK] 네 가지 자료는 MOVIE 쪽에만 겹선을 그은 그림을 통과하고, 요구사항대로 그은 판에서는 모두 걸린다")

    # 감독이 배우로 나오는 것은 '할 수도 있다'라서 DIR_ACTS는 양쪽 다 부분 참여여야 한다
    assert SLIDE["DIR_ACTS"] == BY_REQUIREMENT["DIR_ACTS"] == [("DIRECTOR", (0, N)), ("MOVIE", (0, N))]
    print("[OK] DIR_ACTS는 두 판 모두 양쪽 부분 참여")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
