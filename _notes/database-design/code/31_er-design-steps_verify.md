---
layout: "note"
title: "31_er-design-steps_verify.py"
display_title: "31_er-design-steps_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-design-steps/"
parent_title: "ER 설계 절차"
description: "데이터베이스 설계 · ER 설계 절차 검증 코드"
permalink: "/studies/database-design/code/31_er-design-steps_verify/"
---
{% raw %}
[ER 설계 절차](/Hongs_Blog/studies/database-design/er-design-steps/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER 설계 절차 검증.

문서: 31.ER 설계 절차 (COMPANY 표, 대표 문제, 카드 C2·C4), 연습 31.ER 다이어그램 설계 연습
출처: 데이터베이스 설계 4주차 슬라이드 4-2 p.13~16, 5주차 p.24~31, p.34, 6주차 6-1 풀이 p.12~35
주장:
  1. COMPANY의 처음 설계(4-2 p.13~14)에서 다른 개체를 가리키는 속성은 6개이고(5주차 p.24의 파란 상자),
     여기에 Manager_start_date를 더한 7개가 관계 타입 6개로 바뀐다(5주차 p.31).
  2. 그 7개를 지우면 다듬은 그림(5주차 p.34)의 개체 속성이 남는다.
     (이름만 달라진 것: Birth_date -> Bdate, Dependent_name -> Name. 새로 생긴 것: 유도 속성 Number_of_employees.)
  3. 관계 타입의 속성 Hours, Start_date는 처음 설계의 Works_on(Project, Hours)와 Manager_start_date에서 온다.
  4. 6주차 연습 셋도 같은 장부가 맞는다: PART_ORDER 3개 -> 3개, MOVIE 7개 -> 4개, CONF_REVIEW 4개 -> 3개.
     서로 뒤집은 속성 짝(예: MOVIE의 Production과 PRODUCTION의 Produces)은 관계 타입 하나가 된다.
"""

# 처음 설계: 개체 타입 -> 속성(성분은 풀지 않고 맨 위 이름만). 4-2 p.13~14
COMPANY_FIRST = {
    "DEPARTMENT": ["Name", "Number", "Locations", "Manager", "Manager_start_date"],
    "PROJECT": ["Name", "Number", "Location", "Controlling_department"],
    "EMPLOYEE": ["Name", "Ssn", "Sex", "Address", "Salary", "Birth_date", "Department", "Supervisor", "Works_on"],
    "DEPENDENT": ["Employee", "Dependent_name", "Sex", "Birth_date", "Relationship"],
}
# 5주차 p.24에서 파란 상자를 친 속성(다른 개체를 가리킨다)
COMPANY_POINTERS = [("DEPARTMENT", "Manager"), ("PROJECT", "Controlling_department"), ("EMPLOYEE", "Department"),
                    ("EMPLOYEE", "Supervisor"), ("EMPLOYEE", "Works_on"), ("DEPENDENT", "Employee")]
# 5주차 p.31: 관계 타입 <- 없어지는 속성. p.25~30: 참여 개체 타입, 관계 타입의 속성
COMPANY_RELS = {
    "MANAGES": ([("DEPARTMENT", "Manager"), ("DEPARTMENT", "Manager_start_date")], ("EMPLOYEE", "DEPARTMENT"), ["Start_date"]),
    "WORKS_FOR": ([("EMPLOYEE", "Department")], ("EMPLOYEE", "DEPARTMENT"), []),
    "CONTROLS": ([("PROJECT", "Controlling_department")], ("DEPARTMENT", "PROJECT"), []),
    "SUPERVISION": ([("EMPLOYEE", "Supervisor")], ("EMPLOYEE", "EMPLOYEE"), []),
    "WORKS_ON": ([("EMPLOYEE", "Works_on")], ("EMPLOYEE", "PROJECT"), ["Hours"]),
    "DEPENDENTS_OF": ([("DEPENDENT", "Employee")], ("EMPLOYEE", "DEPENDENT"), []),
}
# 다듬은 그림: 5주차 p.34
COMPANY_FINAL = {
    "DEPARTMENT": ["Name", "Number", "Locations", "Number_of_employees"],
    "PROJECT": ["Name", "Number", "Location"],
    "EMPLOYEE": ["Name", "Ssn", "Sex", "Address", "Salary", "Bdate"],
    "DEPENDENT": ["Name", "Sex", "Birth_date", "Relationship"],
}
RENAMED = {("EMPLOYEE", "Birth_date"): "Bdate", ("DEPENDENT", "Dependent_name"): "Name"}
ADDED = {("DEPARTMENT", "Number_of_employees")}


def removed(rels):
    return [a for attrs, _, _ in rels.values() for a in attrs]


def check(first, rels, final, renamed=None, added=frozenset()):
    """관계로 바뀐 속성을 지우면 다듬은 그림의 개체 속성과 같은가."""
    gone = set(removed(rels))
    for etype, attrs in first.items():
        kept = [(renamed or {}).get((etype, a), a) for a in attrs if (etype, a) not in gone]
        want = [a for a in final[etype] if (etype, a) not in added]
        assert sorted(kept) == sorted(want), (etype, kept, want)
    for _, parts, _ in rels.values():
        assert all(p in first for p in parts)


def main():
    assert len(COMPANY_POINTERS) == 6
    gone = removed(COMPANY_RELS)
    assert len(gone) == 7 and set(COMPANY_POINTERS) < set(gone)
    assert set(gone) - set(COMPANY_POINTERS) == {("DEPARTMENT", "Manager_start_date")}
    assert len(COMPANY_RELS) == 6
    print("[OK] COMPANY: 가리키는 속성 6개 + Manager_start_date = 7개 -> 관계 타입 6개")

    check(COMPANY_FIRST, COMPANY_RELS, COMPANY_FINAL, RENAMED, ADDED)
    print("[OK] 7개를 지우면 5주차 p.34 그림의 개체 속성이 남는다")

    with_attr = {r: a for r, (_, _, a) in COMPANY_RELS.items() if a}
    assert with_attr == {"MANAGES": ["Start_date"], "WORKS_ON": ["Hours"]}
    assert COMPANY_RELS["SUPERVISION"][1] == ("EMPLOYEE", "EMPLOYEE")
    print("[OK] 속성이 붙는 관계 타입은 MANAGES(Start_date), WORKS_ON(Hours). SUPERVISION은 EMPLOYEE가 두 번 낀다")

    # PART_ORDER (6-1 풀이 p.12~18)
    po_first = {"EMPLOYEE": ["Employee_no", "First_name", "Last_name", "Zip_code", "Takes_order"],
                "CUSTOMER": ["Customer_no", "First_name", "Last_name", "Zip_code", "Places_order"],
                "PART": ["Part_no", "Name", "Price", "Quantity"],
                "ORDER": ["Order_no", "Expected_date", "Actual_date", "Receipt_date", "Contains_part"]}
    po_rels = {"TAKES": ([("EMPLOYEE", "Takes_order")], ("EMPLOYEE", "ORDER"), []),
               "PLACES": ([("CUSTOMER", "Places_order")], ("CUSTOMER", "ORDER"), []),
               "CONTAINS": ([("ORDER", "Contains_part")], ("ORDER", "PART"), ["Specified_qty"])}
    po_final = {"EMPLOYEE": ["Employee_no", "First_name", "Last_name", "Zip_code"],
                "CUSTOMER": ["Customer_no", "First_name", "Last_name", "Zip_code"],
                "PART": ["Part_no", "Name", "Price", "Quantity"],
                "ORDER": ["Order_no", "Expected_date", "Actual_date", "Receipt_date"]}   # p.18 그림은 Actual_date 자리에 Quantity
    check(po_first, po_rels, po_final)
    assert len(removed(po_rels)) == 3 and len(po_rels) == 3
    print("[OK] PART_ORDER: 3개 -> 관계 타입 3개. ORDER에는 날짜 셋이 남는다(Quantity가 아니다)")

    # MOVIE (6-1 풀이 p.20~26)
    mv_first = {"MOVIE": ["Mkey", "Length", "Plot_outline", "Genre", "Production", "Directors", "Actors"],
                "ACTOR": ["Akey", "Acts_on"],
                "DIRECTOR": ["Dkey", "Directs", "Acts_on"],
                "PRODUCTION": ["Name", "Address", "Produces"]}
    mv_rels = {"PRODUCES": ([("MOVIE", "Production"), ("PRODUCTION", "Produces")], ("PRODUCTION", "MOVIE"), []),
               "DIRECTS": ([("MOVIE", "Directors"), ("DIRECTOR", "Directs")], ("DIRECTOR", "MOVIE"), []),
               "ACTS": ([("MOVIE", "Actors"), ("ACTOR", "Acts_on")], ("ACTOR", "MOVIE"), ["Role", "Quotes"]),
               "DIR_ACTS": ([("DIRECTOR", "Acts_on")], ("DIRECTOR", "MOVIE"), ["Role", "Quotes"])}
    mv_final = {"MOVIE": ["Mkey", "Length", "Plot_outline", "Genre"], "ACTOR": ["Akey"],
                "DIRECTOR": ["Dkey"], "PRODUCTION": ["Name", "Address"]}
    check(mv_first, mv_rels, mv_final)
    assert len(removed(mv_rels)) == 7 and len(mv_rels) == 4
    assert sum(1 for attrs, _, _ in mv_rels.values() if len(attrs) == 2) == 3
    print("[OK] MOVIE: 7개 -> 관계 타입 4개(서로 뒤집은 짝 3쌍 + DIRECTOR의 Acts_on)")

    # CONF_REVIEW (6-1 풀이 p.29~35)
    cr_first = {"AUTHOR": ["A_email", "First_name", "Last_name", "Submits_paper"],
                "REVIEWER": ["R_email", "First_name", "Last_name", "Phone_no", "Affiliation", "Interest_topic", "Reviews_paper"],
                "PAPER": ["P_id", "Title", "Abstract", "File_name", "Author", "Reviewer"]}
    cr_rels = {"SUBMITS": ([("AUTHOR", "Submits_paper"), ("PAPER", "Author")], ("AUTHOR", "PAPER"), []),
               "REVIEWS": ([("REVIEWER", "Reviews_paper"), ("PAPER", "Reviewer")], ("REVIEWER", "PAPER"),
                           ["Recommendation", "Comments", "Rating"]),
               "IS_CONTACT": ([], ("AUTHOR", "PAPER"), [])}     # Submits_paper의 성분 Is_contact에서 나온다
    cr_final = {"AUTHOR": ["A_email", "First_name", "Last_name"],
                "REVIEWER": ["R_email", "First_name", "Last_name", "Phone_no", "Affiliation", "Interest_topic"],
                "PAPER": ["P_id", "Title", "Abstract", "File_name"]}
    check(cr_first, cr_rels, cr_final)
    assert len(removed(cr_rels)) == 4 and len(cr_rels) == 3
    print("[OK] CONF_REVIEW: 4개 -> 관계 타입 3개(SUBMITS, REVIEWS, 그리고 Is_contact에서 나온 IS_CONTACT)")

    # 카드 C2(보충): 도서관. 회원은 책을 여러 권 빌리고, 책 한 권은 한 번에 한 회원만 빌린다. 빌린 날짜를 적는다.
    borrows = [("m1", "b1", "2024-10-01"), ("m1", "b2", "2024-10-03"), ("m2", "b3", "2024-10-03")]
    per_member = {}
    per_book = {}
    for m, b, day in borrows:
        per_member.setdefault(m, []).append(day)
        per_book.setdefault(b, []).append(day)
    assert max(len(v) for v in per_book.values()) == 1          # 책은 인스턴스 하나에만 낀다 -> BOOK이 N쪽
    assert max(len(v) for v in per_member.values()) == 2        # 회원은 여러 번 낀다 -> MEMBER가 1쪽
    assert len(set(per_member["m1"])) == 2                      # 빌린 날짜는 회원만으로는 안 정해진다
    print("[OK] 카드 C2: BORROWS는 회원 1 : 책 N, 빌린 날짜는 책(N쪽)으로는 정해지고 회원으로는 안 정해진다")

    # 카드 C5: 관계 타입이 되는 속성과 남는 속성
    assert ("PROJECT", "Controlling_department") in gone and ("EMPLOYEE", "Supervisor") in gone
    assert "Locations" in COMPANY_FINAL["DEPARTMENT"] and "Address" in COMPANY_FINAL["EMPLOYEE"]
    assert "Genre" in mv_final["MOVIE"]
    print("[OK] 카드 C5: Controlling_department, Supervisor는 관계 타입이 되고 Locations, Address, Genre는 속성으로 남는다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
