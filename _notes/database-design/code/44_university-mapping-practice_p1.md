---
layout: "note"
title: "44_university-mapping-practice_p1.py"
display_title: "44_university-mapping-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "44"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/university-mapping-practice/"
parent_title: "UNIVERSITY 사상 연습"
description: "데이터베이스 설계 · UNIVERSITY 사상 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/44_university-mapping-practice_p1/"
---
{% raw %}
[UNIVERSITY 사상 연습](/Hongs_Blog/studies/database-design/university-mapping-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""UNIVERSITY 사상 연습 검증.

문서: 44.UNIVERSITY 사상 연습 p1
출처: 데이터베이스 설계 7 슬라이드 p.31 (UNIVERSITY ER, (min, max) 표기), 7 풀이 슬라이드 p.3~6 (단계별 답)
실행: python3 44_university-mapping-practice_p1.py   (표준 라이브러리 sqlite3만 쓴다)
하는 일: 강의의 사상 단계를 옮긴 사상기에 UNIVERSITY ER을 넣고, 단계마다의 결과를 풀이 슬라이드와 견준다.
확인하는 것:
  1. (min, max)에서 읽은 관계의 종류: 1:1이 2개(DEAN, CHAIR), 1:N이 6개, M:N이 1개(TAKES).
  2. 1단계(풀이 p.3): 개체 릴레이션 6개. 복합 속성 SName, CRoom은 성분으로 들어간다.
  3. 2단계(풀이 p.4): COLLEGE에 DeanId, DEPARTMENT에 ChairId와 CStartDate.
  4. 3단계(풀이 p.5): Employed, Admined, Offered, Taught, Belongs, Dept가 max = 1인 쪽 릴레이션에 붙는다.
  5. 4단계(풀이 p.6): TAKES(SId, SecId, Grade). 릴레이션은 모두 7개(개체 6 + 관계 1), 외래 키는 10개.
  6. 외래 키 10개가 가리키는 곳이 풀이 p.5~6의 화살표와 같다.
  7. min이 1인 쪽의 외래 키 7개만 NOT NULL이다. STUDENT.Dept는 (0, 1)이라 NULL을 받는다.
  8. 만든 표가 SQLite에서 돌아간다. 지어낸 행으로 외래 키가 걸리는 것까지 본다.
  9. 변형 (가): HAS를 교차 참조로 옮기면 STUDENT에서 Dept가 빠지고 HAS(SId, DName)(기본 키 SId)가 생겨 릴레이션이 8개다.
     변형 (나): STUDENT의 Phone이 다치 속성이면 STUDENT_PHONE(SId, Phone)(기본 키는 둘의 묶음)이 생겨 릴레이션이 8개다.
"""
import copy
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

UNIVERSITY_ER = {   # 7 p.31. 개체 DEPT의 릴레이션 이름은 풀이 슬라이드를 따라 DEPARTMENT로 적었다
    "entities": [
        {"name": "COLLEGE", "key": ["CName"], "attrs": ["CName", "COffice", "CPhone"]},
        {"name": "INSTRUCTOR", "key": ["Id"], "attrs": ["Id", "Rank", "IName", "IOffice", "IPhone"]},
        {"name": "DEPARTMENT", "key": ["DName"], "attrs": ["DName", "DCode", "DOffice", "DPhone"]},
        {"name": "COURSE", "key": ["CCode"], "attrs": ["CCode", "Credits", "CoName", "Level", "CDesc"]},
        {"name": "SECTION", "key": ["SecId"],
         "attrs": ["SecId", "SecNo", "Sem", "Year", ("CRoom", ["Bldg", "RoomNo"]), "DaysTime"]},
        {"name": "STUDENT", "key": ["SId"],
         "attrs": ["SId", "DOB", ("SName", ["FName", "MName", "LName"]), "Addr", "Phone", "Major"]},
    ],
    "relationships": [
        {"name": "DEAN", "ends": minmax(("COLLEGE", 1, 1), ("INSTRUCTOR", 0, 1)), "fk": ["DeanId"]},
        {"name": "CHAIR", "ends": minmax(("DEPARTMENT", 1, 1), ("INSTRUCTOR", 0, 1)), "fk": ["ChairId"], "attrs": ["CStartDate"]},
        {"name": "EMPLOYS", "ends": minmax(("DEPARTMENT", 0, "N"), ("INSTRUCTOR", 1, 1)), "fk": ["Employed"]},
        {"name": "ADMINS", "ends": minmax(("COLLEGE", 0, "N"), ("DEPARTMENT", 1, 1)), "fk": ["Admined"]},
        {"name": "OFFERS", "ends": minmax(("DEPARTMENT", 0, "N"), ("COURSE", 1, 1)), "fk": ["Offered"]},
        {"name": "TEACHES", "ends": minmax(("INSTRUCTOR", 0, "N"), ("SECTION", 1, 1)), "fk": ["Taught"]},
        {"name": "SECS", "ends": minmax(("COURSE", 0, "N"), ("SECTION", 1, 1)), "fk": ["Belongs"]},
        {"name": "HAS", "ends": minmax(("DEPARTMENT", 0, "N"), ("STUDENT", 0, 1)), "fk": ["Dept"],
         "ends_fk": [["DName"], ["SId"]]},
        {"name": "TAKES", "ends": minmax(("STUDENT", 0, "N"), ("SECTION", 5, "N")), "ends_fk": [["SId"], ["SecId"]], "attrs": ["Grade"]},
    ],
}

STEP1 = {   # 풀이 p.3
    "COLLEGE": ["CName", "COffice", "CPhone"],
    "INSTRUCTOR": ["Id", "Rank", "IName", "IOffice", "IPhone"],
    "DEPARTMENT": ["DName", "DCode", "DOffice", "DPhone"],
    "COURSE": ["CCode", "Credits", "CoName", "Level", "CDesc"],
    "SECTION": ["SecId", "SecNo", "Sem", "Year", "Bldg", "RoomNo", "DaysTime"],
    "STUDENT": ["SId", "DOB", "FName", "MName", "LName", "Addr", "Phone", "Major"],
}
FINAL = {   # 풀이 p.6 (DEPARTMENT의 Chaired는 p.4의 ChairId와 같은 속성이다)
    "COLLEGE": STEP1["COLLEGE"] + ["DeanId"],
    "INSTRUCTOR": STEP1["INSTRUCTOR"] + ["Employed"],
    "DEPARTMENT": STEP1["DEPARTMENT"] + ["ChairId", "CStartDate", "Admined"],
    "COURSE": STEP1["COURSE"] + ["Offered"],
    "SECTION": STEP1["SECTION"] + ["Taught", "Belongs"],
    "STUDENT": STEP1["STUDENT"] + ["Dept"],
    "TAKES": ["SId", "SecId", "Grade"],
}
ARROWS = {   # 풀이 p.5~6의 화살표: (릴레이션, 외래 키) → (가리키는 릴레이션, 기본 키)
    ("COLLEGE", "DeanId"): ("INSTRUCTOR", "Id"), ("DEPARTMENT", "ChairId"): ("INSTRUCTOR", "Id"),
    ("INSTRUCTOR", "Employed"): ("DEPARTMENT", "DName"), ("DEPARTMENT", "Admined"): ("COLLEGE", "CName"),
    ("COURSE", "Offered"): ("DEPARTMENT", "DName"), ("SECTION", "Taught"): ("INSTRUCTOR", "Id"),
    ("SECTION", "Belongs"): ("COURSE", "CCode"), ("STUDENT", "Dept"): ("DEPARTMENT", "DName"),
    ("TAKES", "SId"): ("STUDENT", "SId"), ("TAKES", "SecId"): ("SECTION", "SecId"),
}


def main():
    rels, log = map_er(UNIVERSITY_ER)
    step = dict(log)

    kinds = {}
    for r in UNIVERSITY_ER["relationships"]:
        marks = tuple(sorted(m for _, m, _ in r["ends"]))
        k = {("1", "1"): "1:1", ("1", "N"): "1:N"}.get(marks, "M:N")
        kinds.setdefault(k, []).append(r["name"])
    assert kinds == {"1:1": ["DEAN", "CHAIR"], "1:N": ["EMPLOYS", "ADMINS", "OFFERS", "TEACHES", "SECS", "HAS"], "M:N": ["TAKES"]}
    print("[OK] 관계 9개: 1:1 2개, 1:N 6개, M:N 1개")

    assert step["일반 개체"] == STEP1 and step["다치 속성"] == STEP1          # 약한 개체도 다치 속성도 없다
    print("[OK] 1단계: 개체 릴레이션 6개가 풀이 p.3과 같다")

    s2 = step["1:1 관계"]
    assert s2["COLLEGE"] == STEP1["COLLEGE"] + ["DeanId"]
    assert s2["DEPARTMENT"] == STEP1["DEPARTMENT"] + ["ChairId", "CStartDate"]
    assert all(s2[n] == STEP1[n] for n in ("INSTRUCTOR", "COURSE", "SECTION", "STUDENT"))
    print("[OK] 2단계: COLLEGE + DeanId, DEPARTMENT + ChairId, CStartDate (풀이 p.4)")

    s3 = step["1:N 관계"]
    assert s3 == {n: FINAL[n] for n in STEP1}
    print("[OK] 3단계: Employed, Admined, Offered, Taught, Belongs, Dept (풀이 p.5)")

    assert {n: r["attrs"] for n, r in rels.items()} == FINAL
    assert rels["TAKES"]["pk"] == ["SId", "SecId"] and len(rels) == 7
    assert step["n항 관계"] == step["M:N 관계"]
    print("[OK] 4단계: TAKES(SId, SecId, Grade). 릴레이션 7개 (풀이 p.6)")

    arrows = {(n, cols[0]): (ref, refcols[0]) for n, r in rels.items() for cols, ref, refcols in r["fks"]}
    assert arrows == ARROWS and len(arrows) == 10
    print("[OK] 외래 키 10개가 풀이 p.5~6의 화살표와 같다")

    fk_not_null = {(n, c) for n, r in rels.items() for cols, _, _ in r["fks"] for c in cols if c in r["not_null"]}
    assert fk_not_null == set(ARROWS) - {("STUDENT", "Dept")}
    assert len(fk_not_null) == 9 and len(fk_not_null - {("TAKES", "SId"), ("TAKES", "SecId")}) == 7
    print("[OK] NOT NULL인 외래 키: 기본 키에 든 TAKES의 둘을 빼면 7개. STUDENT.Dept만 NULL을 받는다")

    c = build_sqlite(rels)
    c.execute("BEGIN")
    c.execute("INSERT INTO COLLEGE VALUES ('Engineering', 'E101', '820-5000', 'i1')")
    c.execute("INSERT INTO INSTRUCTOR VALUES ('i1', 'Professor', 'Ko', 'E310', '820-5310', 'CSE')")
    c.execute("INSERT INTO DEPARTMENT VALUES ('CSE', 'D01', 'E208', '820-5300', 'i1', '2024-03-01', 'Engineering')")
    c.execute("INSERT INTO COURSE VALUES ('CS3380', 3, 'Database Design', 2, 'ER, relational model, SQL', 'CSE')")
    c.execute("INSERT INTO SECTION VALUES (135, 1, 'Fall', 2024, 'E', '208', 'Thu 9', 'i1', 'CS3380')")
    c.execute("INSERT INTO STUDENT VALUES (17, '2003-05-01', 'Jin', NULL, 'Kim', 'Seoul', '010', 'CS', 'CSE')")
    c.execute("INSERT INTO STUDENT VALUES (8, '2004-01-09', 'Min', NULL, 'Lee', 'Seoul', '010', 'CS', NULL)")   # 학과 없는 학생
    c.execute("INSERT INTO TAKES VALUES (17, 135, 'A')")
    c.execute("COMMIT")
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    for sql, needle in (("INSERT INTO TAKES VALUES (99, 135, 'B')", "FOREIGN KEY"),
                        ("INSERT INTO TAKES VALUES (17, 135, 'B')", "UNIQUE"),
                        ("INSERT INTO SECTION VALUES (136, 2, 'Fall', 2024, 'E', '209', 'Fri 9', NULL, 'CS3380')", "NOT NULL")):
        try:
            c.execute(sql)
            raise AssertionError(sql)
        except sqlite3.IntegrityError as e:
            assert needle in str(e), str(e)
    assert c.execute("SELECT COUNT(*) FROM TAKES WHERE SecId = 135").fetchone()[0] == 1        # (5, N)은 표가 지켜 주지 않는다
    print("[OK] SQLite에서 표 7개가 만들어지고 외래 키가 걸린다. 수강생이 1명뿐인 분반도 들어간다")

    # 9. 변형 문제
    alt, _ = map_er(UNIVERSITY_ER, approach={"HAS": "cross"})
    assert len(alt) == 8 and "Dept" not in alt["STUDENT"]["attrs"]
    assert set(alt["HAS"]["attrs"]) == {"SId", "DName"} and alt["HAS"]["pk"] == ["SId"]
    assert {(cols, ref) for cols, ref, _ in alt["HAS"]["fks"]} == {(("DName",), "DEPARTMENT"), (("SId",), "STUDENT")}
    build_sqlite(alt)
    er2 = copy.deepcopy(UNIVERSITY_ER)
    stu = next(e for e in er2["entities"] if e["name"] == "STUDENT")
    stu["attrs"].remove("Phone")
    stu["multivalued"] = [("STUDENT_PHONE", "Phone", ["SId"])]
    alt2, _ = map_er(er2)
    assert len(alt2) == 8 and "Phone" not in alt2["STUDENT"]["attrs"]
    assert alt2["STUDENT_PHONE"]["attrs"] == ["SId", "Phone"] and alt2["STUDENT_PHONE"]["pk"] == ["SId", "Phone"]
    build_sqlite(alt2)
    print("[OK] 변형: HAS를 교차 참조로 → HAS(SId, DName) 8개. Phone이 다치 속성 → STUDENT_PHONE(SId, Phone) 8개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
