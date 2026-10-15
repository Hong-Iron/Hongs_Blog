---
layout: "note"
title: "31_er-model-practice_p3.py"
display_title: "31_er-model-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "31"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-model-practice/"
parent_title: "ER 모델 연습"
description: "데이터베이스 설계 · ER 모델 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/31_er-model-practice_p3/"
---
{% raw %}
[ER 모델 연습](/Hongs_Blog/studies/database-design/er-model-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER 모델 연습 p3: (min, max) 제약 붙이기.

문서: 31.ER 모델 연습 (p3과 변형 문제)
확인하는 것:
  1. 문서의 답 INSTRUCTOR (2,4), COURSE(TEACHES 쪽) (1,4), COURSE(USES 쪽) (0,5), TEXT (1,N)이
     다섯 문장을 모두 지키는 자료는 받아들이고, 문장을 하나씩 어긴 자료는 걸러 낸다.
  2. 변형 문제: 답을 1/N 표기로 옮기면 두 관계 모두 M:N이고, 부분 참여는 USES의 COURSE 쪽 하나뿐이다.
"""
from collections import Counter

N = float("inf")
SCHEMA = {
    "TEACHES": [("INSTRUCTOR", (2, 4)), ("COURSE", (1, 4))],
    "USES": [("COURSE", (0, 5)), ("TEXT", (1, N))],
}


def violations(schema, entities, rels):
    out = []
    for rel, roles in schema.items():
        for i, (etype, (lo, hi)) in enumerate(roles):
            count = Counter(t[i] for t in rels[rel])
            out += [(rel, etype, e, count[e]) for e in entities[etype] if not lo <= count[e] <= hi]
    return out


def one_n(roles):
    (_, a), (_, b) = roles
    label = lambda other_max: "1" if other_max == 1 else "N"
    part = lambda mm: "전체" if mm[0] >= 1 else "부분"
    return [(label(b[1]), part(a)), (label(a[1]), part(b))]


def main():
    ents = {"INSTRUCTOR": ["i1", "i2"], "COURSE": ["c1", "c2", "c3", "c4"], "TEXT": ["t1", "t2"]}
    ok = {"TEACHES": [("i1", "c1"), ("i1", "c2"), ("i2", "c2"), ("i2", "c3"), ("i2", "c4")],
          "USES": [("c1", "t1"), ("c1", "t2"), ("c3", "t1")]}          # c2, c4는 교재를 안 쓴다
    assert violations(SCHEMA, ents, ok) == []
    print("[OK] 다섯 문장을 모두 지키는 자료(교재를 안 쓰는 과목 c2, c4 포함)는 통과한다")

    # 문장 2: 과목은 교재를 5권 넘게 못 쓴다
    six_texts = dict(ents, TEXT=[f"t{k}" for k in range(1, 7)])
    six = dict(ok, USES=[("c1", t) for t in six_texts["TEXT"]])
    assert violations(SCHEMA, six_texts, six) == [("USES", "COURSE", "c1", 6)]
    # 문장 3: 과목에는 교수가 적어도 한 명, 많아야 네 명
    no_teacher = dict(ents, COURSE=ents["COURSE"] + ["c5"])
    assert violations(SCHEMA, no_teacher, ok) == [("TEACHES", "COURSE", "c5", 0)]
    five_prof = {"INSTRUCTOR": [f"i{k}" for k in range(1, 6)], "COURSE": ["c1", "c2"], "TEXT": ["t1"]}
    crowd = {"TEACHES": [(i, c) for i in five_prof["INSTRUCTOR"] for c in five_prof["COURSE"]], "USES": [("c1", "t1")]}
    assert violations(SCHEMA, five_prof, crowd) == [("TEACHES", "COURSE", "c1", 5), ("TEACHES", "COURSE", "c2", 5)]
    # 문장 4: 교재는 어느 과목에선가 쓰이는 책이다
    assert violations(SCHEMA, dict(ents, TEXT=["t1", "t2", "t3"]), ok) == [("USES", "TEXT", "t3", 0)]
    # 문장 5: 교수는 2~4과목을 가르친다
    one = dict(ok, TEACHES=[t for t in ok["TEACHES"] if t != ("i1", "c2")])
    assert violations(SCHEMA, ents, one) == [("TEACHES", "INSTRUCTOR", "i1", 1)]
    print("[OK] 문장 2~5를 하나씩 어긴 자료는 모두 걸린다")

    assert one_n(SCHEMA["TEACHES"]) == [("N", "전체"), ("N", "전체")]
    assert one_n(SCHEMA["USES"]) == [("N", "부분"), ("N", "전체")]
    print("[OK] 변형: 1/N 표기로는 둘 다 M:N, 부분 참여는 USES의 COURSE 쪽뿐")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
