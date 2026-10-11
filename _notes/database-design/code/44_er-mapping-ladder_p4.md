---
layout: "note"
title: "44_er-mapping-ladder_p4.py"
display_title: "44_er-mapping-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "44"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-mapping-ladder/"
parent_title: "ER-관계형 사상 예제 사다리"
description: "데이터베이스 설계 · ER-관계형 사상 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/database-design/code/44_er-mapping-ladder_p4/"
---
{% raw %}
[ER-관계형 사상 예제 사다리](/Hongs_Blog/studies/database-design/er-mapping-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER-관계형 사상 예제 사다리 문제 2~4 검증.

문서: 44.ER-관계형 사상 예제 사다리 (문제 2 PART_ORDER, 문제 3 MOVIE, 문제 4 CONF_REVIEW)
출처: ER 그림은 데이터베이스 설계 6-1 풀이 슬라이드 p.18, p.26, p.35. 릴레이션으로 옮긴 답은 슬라이드에 없다(보충).
      옮기는 규칙은 7 슬라이드 p.13~28.
실행: python3 44_er-mapping-ladder_p4.py   (표준 라이브러리 sqlite3만 쓴다)
하는 일: 강의의 사상 단계를 옮긴 사상기에 세 ER을 넣고, 문서에 실은 답과 같은지 본다. 답을 CREATE TABLE로 만들어 SQLite에서 돌린다.
확인하는 것:
  문제 2 PART_ORDER: 릴레이션 5개, 외래 키 4개. ORDER에 E_no, C_no(둘 다 NOT NULL), CONTAINS(O_no, P_no, Specified_qty).
                     ORDER는 SQL 예약어라 따옴표 없이는 표 이름으로 쓸 수 없다.
  문제 3 MOVIE: 릴레이션 10개, 외래 키 10개. 복합 키 (Title, Year)가 외래 키로 갈 때도 두 속성이 함께 간다.
                다치 속성 Genre, 관계 타입의 다치 속성 Quotes는 따로 릴레이션이 된다.
  문제 4 CONF_REVIEW: 릴레이션 6개, 외래 키 6개. IS_CONTACT는 max = 1인 PAPER에 Contact_email로 들어간다.
                REVIEWS의 복합 속성 Comments, Rating은 성분 6개로 들어간다.
                (2, 4)명의 심사자 조건은 표가 지켜 주지 않는다(심사자 1명뿐인 논문이 들어간다).
"""
import sqlite3

# ---- ER → 릴레이션 사상기 (강의 7 p.12의 순서). 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
# ER 적는 법
#   개체: {"name", "attrs": [단순 속성 이름 | (복합 속성 이름, [성분들])], "key": [기본 키로 고른 키 속성],
#          "multivalued": [(릴레이션 이름, 값 속성, [외래 키 이름])], "derived": [유도 속성],
#          "weak": {"owner": 소유 개체, "fk": [외래 키 이름], "partial_key": [부분 키]}}
#   관계: {"name", "ends": [(개체, 그 개체 옆에 적힌 "1"·"N"·"M", "total"·"partial")], "attrs": [...],
#          "fk": [외래 키 이름] (외래 키 방법일 때), "ends_fk": [끝마다 외래 키 이름들] (관계 릴레이션일 때),
#          "multivalued": [(릴레이션 이름, 값 속성)]}
STEPS = ["일반 개체", "약한 개체", "다치 속성", "1:1 관계", "1:N 관계", "M:N 관계", "n항 관계"]


def minmax(*ends):
    """(min, max) 표기 → 사상기가 읽는 꼴. ends: (개체, min, max). 이항 관계만.
    개체 X 옆의 1·N은 "상대 개체 하나에 X가 몇 개까지 이어지나"이므로 상대의 max를 X 옆에 적는다.
    min이 1 이상이면 전체 참여다."""
    (e1, lo1, hi1), (e2, lo2, hi2) = ends
    both_many = hi1 != 1 and hi2 != 1
    mark1 = "M" if both_many else ("1" if hi2 == 1 else "N")
    mark2 = "N" if both_many else ("1" if hi1 == 1 else "N")
    return [(e1, mark1, "total" if lo1 >= 1 else "partial"), (e2, mark2, "total" if lo2 >= 1 else "partial")]


def simple_attrs(attrs):
    out = []
    for a in attrs:
        out.extend(a[1] if isinstance(a, tuple) else [a])       # 복합 속성은 성분만 넣는다
    return out


def map_er(er, approach=None):
    """릴레이션 사전과 단계별 기록을 돌려준다. approach: {관계 이름: "cross"}이면 그 관계는 관계 릴레이션으로 만든다."""
    approach = approach or {}
    rels, log = {}, []

    def new(name, attrs, pk):
        rels[name] = {"attrs": list(attrs), "pk": list(pk), "fks": [], "not_null": set(pk)}

    def add_fk(rel, cols, ref, total):
        r = rels[rel]
        r["attrs"] += [c for c in cols if c not in r["attrs"]]
        r["fks"].append((tuple(cols), ref, tuple(rels[ref]["pk"])))
        if total:
            r["not_null"] |= set(cols)

    def snap(step):
        log.append((step, {n: list(r["attrs"]) for n, r in rels.items()}))

    ents = {e["name"]: e for e in er["entities"]}
    for e in er["entities"]:                                     # 일반 개체: 단순 속성 전부, 키 속성 하나를 기본 키로
        if "weak" not in e:
            new(e["name"], simple_attrs(e["attrs"]), e["key"])
    snap("일반 개체")
    for e in er["entities"]:                                     # 약한 개체: 소유자 기본 키를 외래 키로, 기본 키 = 그것 + 부분 키
        if "weak" in e:
            w = e["weak"]
            new(e["name"], w["fk"] + simple_attrs(e["attrs"]), w["fk"] + w["partial_key"])
            add_fk(e["name"], w["fk"], w["owner"], True)
    snap("약한 개체")
    for e in er["entities"]:                                     # 다치 속성: 따로 릴레이션, 기본 키 = 외래 키 + 값
        for rel, col, fk in e.get("multivalued", []):
            new(rel, fk + [col], fk + [col])
            add_fk(rel, fk, e["name"], True)
    snap("다치 속성")

    def kind(r):
        marks = sorted(m for _, m, _ in r["ends"])
        if len(marks) > 2:
            return "n항 관계"
        return {("1", "1"): "1:1 관계", ("1", "N"): "1:N 관계"}.get(tuple(marks), "M:N 관계")

    def relationship_relation(r, pk_of):
        cols, fks = [], []
        for (ent, _, _), fk in zip(r["ends"], r["ends_fk"]):
            cols += fk
            fks.append((fk, ent))
        new(r["name"], cols + simple_attrs(r.get("attrs", [])), pk_of(r, fks))
        for fk, ent in fks:
            add_fk(r["name"], fk, ent, True)
        for rel, col in r.get("multivalued", []):                # 관계 타입의 다치 속성
            new(rel, cols + [col], cols + [col])
            add_fk(rel, cols, r["name"], True)

    for step in STEPS[3:]:
        for r in er["relationships"]:
            if kind(r) != step:
                continue
            if step == "1:1 관계" and approach.get(r["name"]) != "cross":
                totals = [e for e in r["ends"] if e[2] == "total"]
                s = totals[0] if totals else r["ends"][0]          # 전체 참여 쪽을 S로
                t = next(e for e in r["ends"] if e is not s)
                add_fk(s[0], r["fk"], t[0], s[2] == "total")
                rels[s[0]]["attrs"] += simple_attrs(r.get("attrs", []))
            elif step == "1:N 관계" and approach.get(r["name"]) != "cross":
                s = next(e for e in r["ends"] if e[1] == "N")      # N쪽이 S
                t = next(e for e in r["ends"] if e[1] == "1")
                add_fk(s[0], r["fk"], t[0], s[2] == "total")
                rels[s[0]]["attrs"] += simple_attrs(r.get("attrs", []))
            elif step == "1:1 관계":                               # 교차 참조: 기본 키는 두 외래 키 중 하나
                relationship_relation(r, lambda r, fks: fks[0][0])
            elif step == "1:N 관계":                               # 교차 참조: 기본 키는 N쪽(S)의 키
                relationship_relation(r, lambda r, fks: next(fk for (ent, m, _), fk in zip(r["ends"], r["ends_fk"]) if m == "N"))
            else:                                                  # M:N과 n항: 기본 키는 외래 키 전부
                relationship_relation(r, lambda r, fks: [c for fk, _ in fks for c in fk])
        snap(step)
    return rels, log


def ddl(rels):
    """사상 결과를 CREATE TABLE 문으로. SQLite는 아직 없는 표를 가리키는 외래 키도 받으므로 순서는 신경 쓰지 않는다."""
    out = []
    for name, r in rels.items():
        parts = [f'"{a}"' + (" NOT NULL" if a in r["not_null"] else "") for a in r["attrs"]]
        parts.append("PRIMARY KEY (" + ", ".join(f'"{a}"' for a in r["pk"]) + ")")
        for cols, ref, refcols in r["fks"]:
            parts.append("FOREIGN KEY (" + ", ".join(f'"{c}"' for c in cols) + f') REFERENCES "{ref}" (' +
                         ", ".join(f'"{c}"' for c in refcols) + ") DEFERRABLE INITIALLY DEFERRED")
        out.append(f'CREATE TABLE "{name}" (' + ", ".join(parts) + ");")
    return "\n".join(out)


def shape(rels):
    """견주기 쉬운 꼴: {이름: (속성 집합, 기본 키 집합, 외래 키 집합)}. 속성 순서는 릴레이션의 뜻이 아니라서 집합으로 본다."""
    return {n: (frozenset(r["attrs"]), frozenset(r["pk"]), frozenset(r["fks"])) for n, r in rels.items()}


def build_sqlite(rels):
    """DDL을 SQLite에서 실제로 돌리고, 외래 키가 가리키는 표와 열이 정말 있는지 확인한다."""
    c = sqlite3.connect(":memory:")
    c.isolation_level = None
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(ddl(rels))
    for name, r in rels.items():
        cols = [row[1] for row in c.execute(f'PRAGMA table_info("{name}")')]
        assert cols == r["attrs"], name
        for row in c.execute(f'PRAGMA foreign_key_list("{name}")'):
            ref, to = row[2], row[4]
            assert ref in rels and to in rels[ref]["pk"], (name, ref, to)
    return c
# ---- 사상기 끝 ----

PART_ORDER_ER = {   # 6-1 풀이 p.18. ORDER의 Actual_date는 요구 사항(p.11~12)을 따랐다(그림에는 Quantity로 적혀 있다)
    "entities": [
        {"name": "EMPLOYEE", "key": ["E_no"], "attrs": ["E_no", "F_name", "L_name", "Zip"]},
        {"name": "CUSTOMER", "key": ["C_no"], "attrs": ["C_no", "F_name", "L_name", "Zip"]},
        {"name": "PART", "key": ["P_no"], "attrs": ["P_no", "Name", "Price", "Quantity"]},
        {"name": "ORDER", "key": ["O_no"], "attrs": ["O_no", "Receipt_date", "Expected_date", "Actual_date"]},
    ],
    "relationships": [
        {"name": "TAKES", "ends": [("EMPLOYEE", "1", "partial"), ("ORDER", "N", "total")], "fk": ["E_no"]},
        {"name": "PLACES", "ends": [("CUSTOMER", "1", "partial"), ("ORDER", "N", "total")], "fk": ["C_no"]},
        {"name": "CONTAINS", "ends": [("ORDER", "M", "total"), ("PART", "N", "partial")],
         "ends_fk": [["O_no"], ["P_no"]], "attrs": ["Specified_qty"]},
    ],
}
PART_ORDER_ANSWER = {
    "EMPLOYEE": (["E_no", "F_name", "L_name", "Zip"], ["E_no"], {}),
    "CUSTOMER": (["C_no", "F_name", "L_name", "Zip"], ["C_no"], {}),
    "PART": (["P_no", "Name", "Price", "Quantity"], ["P_no"], {}),
    "ORDER": (["O_no", "Receipt_date", "Expected_date", "Actual_date", "E_no", "C_no"], ["O_no"],
              {("E_no",): "EMPLOYEE", ("C_no",): "CUSTOMER"}),
    "CONTAINS": (["O_no", "P_no", "Specified_qty"], ["O_no", "P_no"], {("O_no",): "ORDER", ("P_no",): "PART"}),
}

MOVIE_ER = {   # 6-1 풀이 p.26 (겹줄은 PRODUCES–MOVIE, DIRECTS–MOVIE에만 그려져 있다)
    "entities": [
        {"name": "PRODUCTION", "key": ["Name"], "attrs": ["Name", "Address"]},
        {"name": "MOVIE", "key": ["Title", "Year"], "attrs": [("MKey", ["Title", "Year"]), "Length", "Plot_outline"],
         "multivalued": [("MOVIE_GENRE", "Genre", ["Title", "Year"])]},
        {"name": "DIRECTOR", "key": ["Name", "Date_of_birth"], "attrs": [("DKey", ["Name", "Date_of_birth"])]},
        {"name": "ACTOR", "key": ["Name", "Date_of_birth"], "attrs": [("AKey", ["Name", "Date_of_birth"])]},
    ],
    "relationships": [
        {"name": "PRODUCES", "ends": [("PRODUCTION", "1", "partial"), ("MOVIE", "N", "total")], "fk": ["Production_name"]},
        {"name": "DIRECTS", "ends": [("MOVIE", "M", "total"), ("DIRECTOR", "N", "partial")],
         "ends_fk": [["Title", "Year"], ["Dname", "Ddob"]]},
        {"name": "ACTS", "ends": [("MOVIE", "M", "partial"), ("ACTOR", "N", "partial")],
         "ends_fk": [["Title", "Year"], ["Aname", "Adob"]], "attrs": ["Role"], "multivalued": [("ACTS_QUOTES", "Quote")]},
        {"name": "DIR_ACTS", "ends": [("MOVIE", "M", "partial"), ("DIRECTOR", "N", "partial")],
         "ends_fk": [["Title", "Year"], ["Dname", "Ddob"]], "attrs": ["Role"], "multivalued": [("DIR_ACTS_QUOTES", "Quote")]},
    ],
}
MOVIE_ANSWER = {
    "PRODUCTION": (["Name", "Address"], ["Name"], {}),
    "MOVIE": (["Title", "Year", "Length", "Plot_outline", "Production_name"], ["Title", "Year"], {("Production_name",): "PRODUCTION"}),
    "DIRECTOR": (["Name", "Date_of_birth"], ["Name", "Date_of_birth"], {}),
    "ACTOR": (["Name", "Date_of_birth"], ["Name", "Date_of_birth"], {}),
    "MOVIE_GENRE": (["Title", "Year", "Genre"], ["Title", "Year", "Genre"], {("Title", "Year"): "MOVIE"}),
    "DIRECTS": (["Title", "Year", "Dname", "Ddob"], ["Title", "Year", "Dname", "Ddob"],
                {("Title", "Year"): "MOVIE", ("Dname", "Ddob"): "DIRECTOR"}),
    "ACTS": (["Title", "Year", "Aname", "Adob", "Role"], ["Title", "Year", "Aname", "Adob"],
             {("Title", "Year"): "MOVIE", ("Aname", "Adob"): "ACTOR"}),
    "ACTS_QUOTES": (["Title", "Year", "Aname", "Adob", "Quote"], ["Title", "Year", "Aname", "Adob", "Quote"],
                    {("Title", "Year", "Aname", "Adob"): "ACTS"}),
    "DIR_ACTS": (["Title", "Year", "Dname", "Ddob", "Role"], ["Title", "Year", "Dname", "Ddob"],
                 {("Title", "Year"): "MOVIE", ("Dname", "Ddob"): "DIRECTOR"}),
    "DIR_ACTS_QUOTES": (["Title", "Year", "Dname", "Ddob", "Quote"], ["Title", "Year", "Dname", "Ddob", "Quote"],
                        {("Title", "Year", "Dname", "Ddob"): "DIR_ACTS"}),
}

CONF_ER = {   # 6-1 풀이 p.35 ((min, max) 표기)
    "entities": [
        {"name": "AUTHOR", "key": ["A_email"], "attrs": ["A_email", "First_name", "Last_name"]},
        {"name": "PAPER", "key": ["P_id"], "attrs": ["P_id", "Title", "Abstract", "File_name"]},
        {"name": "REVIEWER", "key": ["R_email"], "attrs": ["R_email", "First_name", "Last_name", "Phone_no", "Affiliation"],
         "multivalued": [("REVIEWER_TOPIC", "Interest_topic", ["R_email"])]},
    ],
    "relationships": [
        {"name": "IS_CONTACT", "ends": minmax(("AUTHOR", 0, "N"), ("PAPER", 1, 1)), "fk": ["Contact_email"]},
        {"name": "SUBMITS", "ends": minmax(("AUTHOR", 1, "N"), ("PAPER", 1, "N")), "ends_fk": [["A_email"], ["P_id"]]},
        {"name": "REVIEWS", "ends": minmax(("REVIEWER", 1, "N"), ("PAPER", 2, 4)), "ends_fk": [["R_email"], ["P_id"]],
         "attrs": ["Recommendation", ("Comments", ["For_committee", "Feedback"]), ("Rating", ["C1", "C2", "C3", "C4"])]},
    ],
}
CONF_ANSWER = {
    "AUTHOR": (["A_email", "First_name", "Last_name"], ["A_email"], {}),
    "PAPER": (["P_id", "Title", "Abstract", "File_name", "Contact_email"], ["P_id"], {("Contact_email",): "AUTHOR"}),
    "REVIEWER": (["R_email", "First_name", "Last_name", "Phone_no", "Affiliation"], ["R_email"], {}),
    "REVIEWER_TOPIC": (["R_email", "Interest_topic"], ["R_email", "Interest_topic"], {("R_email",): "REVIEWER"}),
    "SUBMITS": (["A_email", "P_id"], ["A_email", "P_id"], {("A_email",): "AUTHOR", ("P_id",): "PAPER"}),
    "REVIEWS": (["R_email", "P_id", "Recommendation", "For_committee", "Feedback", "C1", "C2", "C3", "C4"], ["R_email", "P_id"],
                {("R_email",): "REVIEWER", ("P_id",): "PAPER"}),
}


def check(er, answer, n_rel, n_fk):
    rels, _ = map_er(er)
    got = {n: (r["attrs"], r["pk"], {cols: ref for cols, ref, _ in r["fks"]}) for n, r in rels.items()}
    assert got == answer, got
    assert len(rels) == n_rel and sum(len(r["fks"]) for r in rels.values()) == n_fk
    return rels, build_sqlite(rels)


def refuses(c, sql, needle):
    try:
        c.execute(sql)
    except sqlite3.IntegrityError as e:
        assert needle in str(e), str(e)
        return True
    return False


def main():
    # 문제 2
    rels, c = check(PART_ORDER_ER, PART_ORDER_ANSWER, 5, 4)
    assert {"E_no", "C_no"} <= rels["ORDER"]["not_null"]
    c.executescript("""INSERT INTO EMPLOYEE VALUES (1, 'A', 'Kim', '06974'); INSERT INTO CUSTOMER VALUES (7, 'B', 'Lee', '04524');
                       INSERT INTO PART VALUES (10, 'bolt', 100, 500), (11, 'nut', 50, 800);
                       INSERT INTO "ORDER" VALUES (100, '2024-10-01', '2024-10-05', NULL, 1, 7);
                       INSERT INTO CONTAINS VALUES (100, 10, 20), (100, 11, 40);""")
    assert refuses(c, """INSERT INTO "ORDER" VALUES (101, '2024-10-02', NULL, NULL, NULL, 7)""", "NOT NULL")     # 받은 직원이 없는 주문
    assert refuses(c, "INSERT INTO CONTAINS VALUES (100, 99, 1)", "FOREIGN KEY")
    assert refuses(c, "INSERT INTO CONTAINS VALUES (100, 10, 5)", "UNIQUE")
    try:
        sqlite3.connect(":memory:").execute("CREATE TABLE ORDER (O_no INT)")
        raise AssertionError("ORDER가 따옴표 없이 표 이름이 됐다")
    except sqlite3.OperationalError as e:
        assert "syntax error" in str(e)
    print("[OK] 문제 2 PART_ORDER: 릴레이션 5개, 외래 키 4개. 따옴표 없는 ORDER는 구문 오류")

    # 문제 3
    rels, c = check(MOVIE_ER, MOVIE_ANSWER, 10, 10)
    assert rels["MOVIE"]["not_null"] >= {"Title", "Year", "Production_name"}
    c.executescript("""INSERT INTO PRODUCTION VALUES ('P1', 'Seoul');
                       INSERT INTO MOVIE VALUES ('M', 2020, 120, 'x', 'P1'), ('M', 2024, 100, 'remake', 'P1');
                       INSERT INTO MOVIE_GENRE VALUES ('M', 2020, 'drama'), ('M', 2020, 'action');
                       INSERT INTO ACTOR VALUES ('Kim', '1990-01-01'); INSERT INTO DIRECTOR VALUES ('Bong', '1969-09-14');
                       INSERT INTO DIRECTS VALUES ('M', 2020, 'Bong', '1969-09-14');
                       INSERT INTO ACTS VALUES ('M', 2020, 'Kim', '1990-01-01', 'lead');
                       INSERT INTO ACTS_QUOTES VALUES ('M', 2020, 'Kim', '1990-01-01', 'q1'), ('M', 2020, 'Kim', '1990-01-01', 'q2');
                       INSERT INTO DIR_ACTS VALUES ('M', 2020, 'Bong', '1969-09-14', 'cameo');""")
    assert c.execute("SELECT COUNT(*) FROM MOVIE WHERE Title = 'M'").fetchone()[0] == 2        # 제목이 같아도 해가 다르면 다른 영화
    assert refuses(c, "INSERT INTO MOVIE_GENRE VALUES ('M', 1999, 'drama')", "FOREIGN KEY")    # (M, 1999)는 없는 영화
    assert refuses(c, "INSERT INTO ACTS_QUOTES VALUES ('M', 2024, 'Kim', '1990-01-01', 'q')", "FOREIGN KEY")   # 그 영화에 출연한 적이 없다
    assert refuses(c, "INSERT INTO MOVIE VALUES ('N', 2021, 90, 'y', NULL)", "NOT NULL")
    print("[OK] 문제 3 MOVIE: 릴레이션 10개, 외래 키 10개. 복합 키와 다치 속성이 걸린다")

    # 문제 4
    rels, c = check(CONF_ER, CONF_ANSWER, 6, 6)
    assert "Contact_email" in rels["PAPER"]["not_null"]
    kinds = {r["name"]: tuple(sorted(m for _, m, _ in r["ends"])) for r in CONF_ER["relationships"]}
    assert kinds == {"IS_CONTACT": ("1", "N"), "SUBMITS": ("M", "N"), "REVIEWS": ("M", "N")}
    assert CONF_ER["relationships"][0]["ends"] == [("AUTHOR", "1", "partial"), ("PAPER", "N", "total")]
    c.executescript("""INSERT INTO AUTHOR VALUES ('a@x', 'A', 'Kim'), ('b@x', 'B', 'Lee');
                       INSERT INTO PAPER VALUES (1, 'T', 'abs', 'p1.pdf', 'a@x');
                       INSERT INTO SUBMITS VALUES ('a@x', 1), ('b@x', 1);
                       INSERT INTO REVIEWER VALUES ('r@x', 'R', 'Park', '010', 'CAU');
                       INSERT INTO REVIEWER_TOPIC VALUES ('r@x', 'database'), ('r@x', 'graph mining');
                       INSERT INTO REVIEWS VALUES ('r@x', 1, 'accept', 'ok', 'good', 8, 7, 9, 8);""")
    assert refuses(c, "INSERT INTO PAPER VALUES (2, 'U', 'abs', 'p2.pdf', 'nobody@x')", "FOREIGN KEY")
    assert refuses(c, "INSERT INTO PAPER VALUES (2, 'U', 'abs', 'p2.pdf', NULL)", "NOT NULL")
    assert refuses(c, "INSERT INTO REVIEWS VALUES ('r@x', 1, 'reject', '', '', 1, 1, 1, 1)", "UNIQUE")
    assert c.execute("SELECT COUNT(*) FROM REVIEWS WHERE P_id = 1").fetchone()[0] == 1          # (2, 4)를 어겼지만 들어가 있다
    print("[OK] 문제 4 CONF_REVIEW: 릴레이션 6개, 외래 키 6개. 심사자 1명뿐인 논문도 들어간다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
