---
layout: "note"
title: "30_min-max-notation_verify.py"
display_title: "30_min-max-notation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/min-max-notation/"
parent_title: "(min, max) 표기"
description: "데이터베이스 설계 · (min, max) 표기 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/30_min-max-notation_verify/"
---
{% raw %}
[(min, max) 표기](/Hongs_Blog/studies/database-design/min-max-notation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""(min, max) 표기 검증.

문서: 30.(min, max) 표기 (예시, COMPANY 표, 예와 아닌 예, 카드 C1~C5), 29.ER 다이어그램 표기법(COMPANY 그림)
출처: 데이터베이스 설계 5주차 슬라이드 p.25~31, p.34, p.36, 풀이 p.3, 4주차 4-2 p.5,
      6주차 6-1 풀이 p.32~35, COMPANY 상태 6-2 p.21
주장:
  1. COMPANY 여섯 관계의 (min, max)(5주차 p.34)에서 1/N 표기의 숫자와 참여(전체/부분)를 뽑으면
     4-2 p.5 그림의 숫자·겹선과 모두 같다. 숫자는 서로 반대쪽에 놓인다.
  2. 같은 값이 5주차 p.25~30의 글과도 같다. 단 p.28(SUPERVISION)의 참여 설명만 다르다(원본 오류 의심).
  3. COMPANY 상태(6-2 p.21)는 (min, max) 12개 가운데 11개를 지킨다.
     WORKS_FOR의 부서 쪽 (4, N)만 어긴다: 4번 부서 3명, 1번 부서 1명.
  4. 연습 3(5주차 p.36)의 답 (2,4), (1,4), (0,5), (1,N)에 맞는 자료와 어기는 자료.
  5. 비율·참여 -> (min, max) -> 비율·참여로 돌아오면 그대로지만,
     (2,4) -> 비율·참여 -> (min, max)는 (1,N)이 된다. (min, max)가 더 많은 것을 적는다.
  6. CONF_REVIEW(6-1 풀이 p.32~35)의 세 관계.
"""
from collections import Counter

N = float("inf")   # 위 한계가 없다

# 관계 타입 -> [(개체 타입, 역할, (min, max)), (개체 타입, 역할, (min, max))]   (5주차 p.34)
COMPANY = {
    "WORKS_FOR": [("EMPLOYEE", "Employee", (1, 1)), ("DEPARTMENT", "Department", (4, N))],
    "MANAGES": [("EMPLOYEE", "Manager", (0, 1)), ("DEPARTMENT", "Department Managed", (1, 1))],
    "CONTROLS": [("DEPARTMENT", "Controlling Department", (0, N)), ("PROJECT", "Controlled Project", (1, 1))],
    "SUPERVISION": [("EMPLOYEE", "Supervisor", (0, N)), ("EMPLOYEE", "Supervisee", (0, 1))],
    "WORKS_ON": [("EMPLOYEE", "Worker", (1, N)), ("PROJECT", "Project", (1, N))],
    "DEPENDENTS_OF": [("EMPLOYEE", "Employee", (0, N)), ("DEPENDENT", "Dependent", (1, 1))],
}

# 4-2 p.5 그림: 각 쪽에 적힌 숫자(1, N, M)와 선(겹선 = 전체 참여). 순서는 위와 같다.
FIGURE_1N = {
    "WORKS_FOR": [("N", "전체"), ("1", "전체")],
    "MANAGES": [("1", "부분"), ("1", "전체")],
    "CONTROLS": [("1", "부분"), ("N", "전체")],
    "SUPERVISION": [("1", "부분"), ("N", "부분")],
    "WORKS_ON": [("M", "전체"), ("N", "전체")],
    "DEPENDENTS_OF": [("1", "부분"), ("N", "전체")],
}

# 5주차 p.25~30의 글: (비율, [첫째 쪽 참여, 둘째 쪽 참여]). p.28은 적힌 그대로 옮기면 CONTROLS의 문장이다.
TEXT = {
    "MANAGES": ("1:1", ["부분", "전체"]),           # p.25
    "WORKS_FOR": ("N:1", ["전체", "전체"]),         # p.26: 1쪽 DEPARTMENT, N쪽 EMPLOYEE
    "CONTROLS": ("1:N", ["부분", "전체"]),          # p.27
    "SUPERVISION": ("1:N", None),                    # p.28: "PROJECT ... total, DEPARTMENT ... partial"
    "WORKS_ON": ("M:N", ["전체", "전체"]),          # p.29
    "DEPENDENTS_OF": ("1:N", ["부분", "전체"]),     # p.30
}


def participation(minmax):
    return "전체" if minmax[0] >= 1 else "부분"


def label_1n(other_max):
    """1/N 표기에서 이쪽에 적는 글자: 상대편 개체 하나에 이쪽 개체가 몇 개까지 붙는가 = 상대 쪽 max."""
    return "1" if other_max == 1 else "N"


def to_1n(roles):
    (_, _, a), (_, _, b) = roles
    return [(label_1n(b[1]), participation(a)), (label_1n(a[1]), participation(b))]


def ratio(roles):
    left, right = to_1n(roles)
    return "M:N" if (left[0], right[0]) == ("N", "N") else f"{left[0]}:{right[0]}"


def from_1n(label_here, label_there, part_here):
    """1/N 표기 -> (min, max). 이쪽의 max는 상대 쪽에 적힌 글자에서 온다."""
    return (1 if part_here == "전체" else 0, 1 if label_there == "1" else N)


def violations(schema, entities, rels):
    """(min, max)를 어기는 (관계, 역할, 개체, 낀 횟수)."""
    out = []
    for rel, roles in schema.items():
        for i, (etype, role, (lo, hi)) in enumerate(roles):
            count = Counter(t[i] for t in rels[rel])
            for e in entities[etype]:
                if not lo <= count[e] <= hi:
                    out.append((rel, role, e, count[e]))
    return out


# COMPANY 상태 (6-2 p.21)
EMP = [("123456789", "333445555", 5), ("333445555", "888665555", 5), ("999887777", "987654321", 4),
       ("987654321", "888665555", 4), ("666884444", "333445555", 5), ("453453453", "333445555", 5),
       ("987987987", "987654321", 4), ("888665555", None, 1)]            # (Ssn, Super_ssn, Dno)
DEPT_MGR = {5: "333445555", 4: "987654321", 1: "888665555"}
PROJ_DNUM = {1: 5, 2: 5, 3: 5, 10: 4, 20: 1, 30: 4}
WORKS_ON = [("123456789", 1), ("123456789", 2), ("666884444", 3), ("453453453", 1), ("453453453", 2),
            ("333445555", 2), ("333445555", 3), ("333445555", 10), ("333445555", 20), ("999887777", 30),
            ("999887777", 10), ("987987987", 10), ("987987987", 30), ("987654321", 30), ("987654321", 20),
            ("888665555", 20)]
DEPENDENT = [("333445555", "Alice"), ("333445555", "Theodore"), ("333445555", "Joy"), ("987654321", "Abner"),
             ("123456789", "Michael"), ("123456789", "Alice"), ("123456789", "Elizabeth")]


def main():
    # 1. (min, max) -> 1/N 표기와 참여
    for rel, roles in COMPANY.items():
        got = to_1n(roles)
        want = [("N" if c == "M" else c, p) for c, p in FIGURE_1N[rel]]
        assert got == want, (rel, got, want)
    print("[OK] 여섯 관계의 (min, max)에서 뽑은 1/N 숫자와 겹선이 4-2 p.5 그림과 모두 같다")

    wf = COMPANY["WORKS_FOR"]
    assert wf[0][2] == (1, 1) and to_1n(wf)[0][0] == "N" and to_1n(wf)[1][0] == "1"
    print("[OK] WORKS_FOR: (1,1)은 EMPLOYEE 옆, 1/N 표기의 1은 DEPARTMENT 옆 -> 숫자가 반대쪽에 놓인다")

    # 2. 글(p.25~30)과 비교
    mismatch = []
    for rel, (text_ratio, text_part) in TEXT.items():
        roles = COMPANY[rel]
        assert ratio(roles) == text_ratio, rel
        if text_part != [participation(roles[0][2]), participation(roles[1][2])]:
            mismatch.append(rel)
    assert mismatch == ["SUPERVISION"]
    sup = COMPANY["SUPERVISION"]
    assert [participation(r[2]) for r in sup] == ["부분", "부분"]
    print("[OK] 비율 여섯 개와 참여 다섯 개가 글과 같다. SUPERVISION의 참여만 글과 다르다(그림은 양쪽 다 부분)")

    # 3. COMPANY 상태가 (min, max)를 지키는가
    ssns = [e[0] for e in EMP]
    entities = {"EMPLOYEE": ssns, "DEPARTMENT": list(DEPT_MGR), "PROJECT": list(PROJ_DNUM), "DEPENDENT": DEPENDENT}
    rels = {
        "WORKS_FOR": [(ssn, dno) for ssn, _, dno in EMP],
        "MANAGES": [(mgr, d) for d, mgr in DEPT_MGR.items()],
        "CONTROLS": [(d, p) for p, d in PROJ_DNUM.items()],
        "SUPERVISION": [(sup_ssn, ssn) for ssn, sup_ssn, _ in EMP if sup_ssn],
        "WORKS_ON": WORKS_ON,
        "DEPENDENTS_OF": [(d[0], d) for d in DEPENDENT],
    }
    bad = violations(COMPANY, entities, rels)
    assert sorted(bad) == [("WORKS_FOR", "Department", 1, 1), ("WORKS_FOR", "Department", 4, 3)], bad
    assert Counter(dno for _, _, dno in EMP) == {5: 4, 4: 3, 1: 1}
    relaxed = dict(COMPANY, WORKS_FOR=[COMPANY["WORKS_FOR"][0], ("DEPARTMENT", "Department", (1, N))])
    assert violations(relaxed, entities, rels) == []
    print("[OK] 6-2 p.21 상태: (4,N)만 어긴다(4번 부서 3명, 1번 부서 1명). (1,N)으로 바꾸면 12개 모두 지킨다")

    # 4. 연습 3 (5주차 p.36, 풀이 p.3)
    ex3 = {"TEACHES": [("INSTRUCTOR", "", (2, 4)), ("COURSE", "", (1, 4))],
           "USES": [("COURSE", "", (0, 5)), ("TEXT", "", (1, N))]}
    ents = {"INSTRUCTOR": ["i1", "i2"], "COURSE": ["c1", "c2", "c3", "c4"], "TEXT": ["t1"]}
    good = {"TEACHES": [("i1", "c1"), ("i1", "c2"), ("i2", "c2"), ("i2", "c3"), ("i2", "c4")],
            "USES": [("c1", "t1"), ("c3", "t1")]}
    assert violations(ex3, ents, good) == []
    one_course = dict(good, TEACHES=[t for t in good["TEACHES"] if t != ("i1", "c2")])
    assert violations(ex3, ents, one_course) == [("TEACHES", "", "i1", 1)]
    five = {"INSTRUCTOR": ["i1", "i2"], "COURSE": ["c1", "c2", "c3", "c4", "c5"], "TEXT": ["t1"]}
    five_rel = dict(good, TEACHES=[("i1", c) for c in five["COURSE"]] + [("i2", "c1"), ("i2", "c2")])
    assert violations(ex3, five, five_rel) == [("TEACHES", "", "i1", 5)]
    unused_text = dict(ents, TEXT=["t1", "t2"])
    assert violations(ex3, unused_text, good) == [("USES", "", "t2", 0)]
    assert to_1n(ex3["TEACHES"]) == [("N", "전체"), ("N", "전체")]
    assert to_1n(ex3["USES"]) == [("N", "부분"), ("N", "전체")]
    print("[OK] 연습 3: 맞는 자료 1개, 어기는 자료 3개(1과목만 맡은 교수, 5과목 맡은 교수, 안 쓰이는 교재)")

    # 5. 오가기
    for rel, sides in FIGURE_1N.items():
        (la, pa), (lb, pb) = [("N" if c == "M" else c, p) for c, p in sides]
        a, b = from_1n(la, lb, pa), from_1n(lb, la, pb)
        back = to_1n([("", "", a), ("", "", b)])
        assert back == [(la, pa), (lb, pb)]
    assert from_1n("N", "1", "전체") == (1, 1) and from_1n("1", "N", "전체") == (1, N)
    coarse = to_1n(ex3["TEACHES"])                       # (2,4), (1,4) -> N/전체, N/전체
    again = (from_1n(coarse[0][0], coarse[1][0], coarse[0][1]), from_1n(coarse[1][0], coarse[0][0], coarse[1][1]))
    assert again == ((1, N), (1, N)) and again != ((2, 4), (1, 4))
    assert from_1n("N", "1", "전체") == (1, 1) != (4, N)
    print("[OK] 1/N 표기 -> (min, max) -> 1/N 표기는 그대로. (2,4)는 돌아오면 (1,N)이 된다")

    # 6. CONF_REVIEW (6-1 풀이 p.32~35)
    conf = {"SUBMITS": [("AUTHOR", "", (1, N)), ("PAPER", "", (1, N))],
            "IS_CONTACT": [("AUTHOR", "", (0, N)), ("PAPER", "", (1, 1))],
            "REVIEWS": [("REVIEWER", "", (1, N)), ("PAPER", "", (2, 4))]}
    assert ratio(conf["SUBMITS"]) == "M:N" and ratio(conf["REVIEWS"]) == "M:N"
    assert to_1n(conf["IS_CONTACT"]) == [("1", "부분"), ("N", "전체")]
    assert to_1n(conf["REVIEWS"]) == [("N", "전체"), ("N", "전체")]
    print("[OK] CONF_REVIEW: SUBMITS·REVIEWS는 M:N, IS_CONTACT는 저자 1 : 논문 N(논문만 전체 참여)")

    # 예시로 보기: INSTRUCTOR 옆 (2,4). 교수 한 명이 맡은 과목 수 2, 3, 4는 지키고 1, 5는 어긴다
    lo, hi = ex3["TEACHES"][0][2]
    assert [lo <= k <= hi for k in (2, 3, 4, 1, 5)] == [True, True, True, False, False]
    print("[OK] (2,4): 2, 3, 4과목은 지키고 1과목, 5과목은 어긴다")

    # 카드 C1: MANAGES
    assert to_1n(COMPANY["MANAGES"]) == [("1", "부분"), ("1", "전체")]
    # 카드 C2(보충): 학생 (0,2), 동아리 (5,N)
    club = [("STUDENT", "", (0, 2)), ("CLUB", "", (5, N))]
    assert to_1n(club) == [("N", "부분"), ("N", "전체")] and ratio(club) == "M:N"
    # 카드 C4: DEPENDENTS_OF의 Dependent (1,1)을 어기는 두 자료
    dep = {"DEPENDENTS_OF": COMPANY["DEPENDENTS_OF"]}
    people = {"EMPLOYEE": ["e1", "e2"], "DEPENDENT": ["x1"]}
    assert violations(dep, people, {"DEPENDENTS_OF": []}) == [("DEPENDENTS_OF", "Dependent", "x1", 0)]
    assert violations(dep, people, {"DEPENDENTS_OF": [("e1", "x1"), ("e2", "x1")]}) == [("DEPENDENTS_OF", "Dependent", "x1", 2)]
    assert violations(dep, people, {"DEPENDENTS_OF": [("e1", "x1")]}) == []
    # 카드 C5: 네 가지 기본 꼴이 COMPANY 그림에 놓인 자리
    assert COMPANY["MANAGES"][0][2] == (0, 1) and COMPANY["CONTROLS"][1][2] == (1, 1)
    assert COMPANY["CONTROLS"][0][2] == (0, N) and COMPANY["WORKS_ON"][1][2] == (1, N)
    assert to_1n(COMPANY["DEPENDENTS_OF"]) == [("1", "부분"), ("N", "전체")]
    print("[OK] 카드 C1(MANAGES 1:1, 부서만 전체), C2(동아리 M:N), C4(주인이 0명·2명인 부양가족), C5")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
