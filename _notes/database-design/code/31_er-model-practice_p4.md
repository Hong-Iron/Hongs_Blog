---
layout: "note"
title: "31_er-model-practice_p4.py"
display_title: "31_er-model-practice_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "31"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-model-practice/"
parent_title: "ER 모델 연습"
description: "데이터베이스 설계 · ER 모델 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/31_er-model-practice_p4/"
---
{% raw %}
[ER 모델 연습](/Hongs_Blog/studies/database-design/er-model-practice/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER 모델 연습 p4: ER 그림을 보고 문장이 참인지 가리기.

문서: 31.ER 모델 연습 (p4와 변형 문제)
방법: 그림의 숫자와 겹선을 (min, max)로 옮긴다. 문장마다
  - True  = 그림의 규칙을 지키는 자료라면 늘 참이다(문장을 어기는 자료는 규칙에도 어긋난다).
  - False = 그림의 규칙을 지키면서 문장과 반대인 자료가 있다(문장이 "~할 수 없다"고 했는데 할 수 있다).
  - Maybe = 규칙을 지키는 자료 가운데 문장이 참인 것도 있고 거짓인 것도 있다.
문서의 답: (a) True (b) Maybe (c) Maybe (d) True (e) False (f) Maybe
"""
from collections import Counter

N = float("inf")
# 문서의 그림을 (min, max)로 옮긴 것. 겹선 = min 1, 홑선 = min 0. 상대 쪽에 적힌 숫자가 이쪽의 max다.
SCHEMA = {
    "PERFORMS_IN": [("ACTOR", (1, N)), ("MOVIE", (1, N))],       # M:N, 양쪽 겹선
    "LEAD_ROLE": [("ACTOR", (0, N)), ("MOVIE", (1, 2))],         # ACTOR 옆 2, MOVIE 옆 N, MOVIE 쪽 겹선
    "ALSO_A_DIRECTOR": [("ACTOR", (0, 1)), ("DIRECTOR", (0, 1))],
    "DIRECTS": [("DIRECTOR", (0, N)), ("MOVIE", (1, 1))],        # DIRECTOR 옆 1, MOVIE 옆 N, MOVIE 쪽 겹선
    "ACTOR_PRODUCER": [("ACTOR", (0, 1)), ("PRODUCER", (0, 1))],
    "PRODUCES": [("PRODUCER", (0, N)), ("MOVIE", (1, N))],       # M:N, MOVIE 쪽 겹선
}


def violations(entities, rels):
    out = []
    for rel, roles in SCHEMA.items():
        for i, (etype, (lo, hi)) in enumerate(roles):
            count = Counter(t[i] for t in rels.get(rel, []))
            out += [(rel, etype, e, count[e]) for e in entities[etype] if not lo <= count[e] <= hi]
    return out


def valid(entities, rels):
    return not violations(entities, rels)


def base(n_movies=1):
    """규칙을 모두 지키는 가장 작은 자료: 배우 a1, 감독 d1, 제작자 p1, 영화 n편."""
    movies = [f"m{k}" for k in range(1, n_movies + 1)]
    ents = {"ACTOR": ["a1"], "DIRECTOR": ["d1"], "PRODUCER": ["p1"], "MOVIE": movies}
    rels = {"PERFORMS_IN": [("a1", m) for m in movies], "LEAD_ROLE": [("a1", m) for m in movies],
            "DIRECTS": [("d1", m) for m in movies], "PRODUCES": [("p1", m) for m in movies],
            "ALSO_A_DIRECTOR": [], "ACTOR_PRODUCER": []}
    return ents, rels


def main():
    ents, rels = base()
    assert valid(ents, rels)

    # (a) 영화에 한 편도 안 나온 배우는 없다 -> True
    lonely = dict(ents, ACTOR=["a1", "a2"])
    assert violations(lonely, rels) == [("PERFORMS_IN", "ACTOR", "a2", 0)]
    assert SCHEMA["PERFORMS_IN"][0][1][0] >= 1
    print("[OK] (a) True: 영화에 안 나온 배우 a2를 넣으면 PERFORMS_IN의 전체 참여에 어긋난다")

    # (b) 열 편 넘게 출연한 배우가 있다 -> Maybe
    e11, r11 = base(11)
    assert valid(e11, r11) and Counter(a for a, _ in r11["PERFORMS_IN"])["a1"] == 11
    assert valid(ents, rels) and max(Counter(a for a, _ in rels["PERFORMS_IN"]).values()) <= 10
    print("[OK] (b) Maybe: 11편에 나온 배우가 있는 자료도, 없는 자료도 규칙을 지킨다")

    # (c) 여러 영화에서 주연을 한 배우가 있다 -> Maybe
    e2, r2 = base(2)
    assert valid(e2, r2) and Counter(a for a, _ in r2["LEAD_ROLE"])["a1"] == 2
    assert max(Counter(a for a, _ in rels["LEAD_ROLE"]).values()) == 1
    print("[OK] (c) Maybe: 한 배우가 두 영화의 주연인 자료도, 아닌 자료도 규칙을 지킨다")

    # (d) 한 영화의 주연은 많아야 두 명 -> True
    three = dict(ents, ACTOR=["a1", "a2", "a3"])
    r3 = dict(rels, PERFORMS_IN=[(a, "m1") for a in three["ACTOR"]], LEAD_ROLE=[(a, "m1") for a in three["ACTOR"]])
    assert violations(three, r3) == [("LEAD_ROLE", "MOVIE", "m1", 3)]
    two = dict(ents, ACTOR=["a1", "a2"])
    r2lead = dict(rels, PERFORMS_IN=[("a1", "m1"), ("a2", "m1")], LEAD_ROLE=[("a1", "m1"), ("a2", "m1")])
    assert valid(two, r2lead) and SCHEMA["LEAD_ROLE"][1][1][1] == 2
    print("[OK] (d) True: 주연 둘은 통과하고 셋은 LEAD_ROLE의 위 한계 2에 걸린다")

    # (e) 제작자는 다른 영화의 배우가 될 수 없다 -> False
    em, rm = base(2)
    em = dict(em, PRODUCER=["p1", "p2"])
    rm = dict(rm, ACTOR_PRODUCER=[("a1", "p1")], PRODUCES=[("p1", "m1"), ("p2", "m2")])
    # 제작자 p1은 배우 a1과 같은 사람이다(ACTOR_PRODUCER). p1은 m1만 제작했고, a1은 다른 영화 m2에도 나온다
    assert valid(em, rm) and ("a1", "m2") in rm["PERFORMS_IN"] and ("p1", "m2") not in rm["PRODUCES"]
    print("[OK] (e) False: m1의 제작자가 다른 영화 m2의 배우인 자료가 규칙을 지킨다")

    # (f) 감독은 한 명인데 제작자는 여럿인 영화가 있다 -> Maybe
    several = dict(ents, PRODUCER=["p1", "p2"])
    rs = dict(rels, PRODUCES=[("p1", "m1"), ("p2", "m1")])
    assert valid(several, rs) and Counter(m for _, m in rs["DIRECTS"])["m1"] == 1
    assert valid(ents, rels) and Counter(m for _, m in rels["PRODUCES"])["m1"] == 1
    two_directors = dict(ents, DIRECTOR=["d1", "d2"])
    rd = dict(rels, DIRECTS=[("d1", "m1"), ("d2", "m1")])
    assert violations(two_directors, rd) == [("DIRECTS", "MOVIE", "m1", 2)]
    print("[OK] (f) Maybe: 제작자가 둘인 영화가 있는 자료도, 없는 자료도 규칙을 지킨다. 감독 둘은 규칙에 어긋난다")

    # 변형 문제 (g) 감독이 없는 영화가 있을 수 있다 -> False, (h) 배우이면서 감독인 사람이 있다 -> Maybe
    assert violations(ents, dict(rels, DIRECTS=[])) == [("DIRECTS", "MOVIE", "m1", 0)]
    assert valid(ents, dict(rels, ALSO_A_DIRECTOR=[("a1", "d1")])) and valid(ents, rels)
    print("[OK] 변형: (g) 감독 없는 영화는 규칙에 어긋난다, (h) 배우 겸 감독은 있어도 없어도 된다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
