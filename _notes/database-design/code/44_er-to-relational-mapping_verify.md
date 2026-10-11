---
layout: "note"
title: "44_er-to-relational-mapping_verify.py"
display_title: "44_er-to-relational-mapping_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-to-relational-mapping/"
parent_title: "ER-관계형 사상 절차"
description: "데이터베이스 설계 · ER-관계형 사상 절차 검증 코드"
permalink: "/studies/database-design/code/44_er-to-relational-mapping_verify/"
---
{% raw %}
[ER-관계형 사상 절차](/Hongs_Blog/studies/database-design/er-to-relational-mapping/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ER-관계형 사상 절차 검증.

문서: 44.ER-관계형 사상 절차 (예시, 절차, 대응표, 카드 C1~C6)
출처: 데이터베이스 설계 7 슬라이드 p.11~29 (COMPANY ER → 릴레이션 6개), 6-2 p.20~21 (스키마와 상태), 9 p.17~18 (DDL)
실행: python3 44_er-to-relational-mapping_verify.py   (표준 라이브러리 sqlite3만 쓴다)
하는 일: 강의의 단계(개체 → 다치 속성 → 관계)를 그대로 코드로 옮긴 사상기에 COMPANY ER을 넣고,
        나온 릴레이션을 슬라이드의 답과 견준다. 그 결과를 CREATE TABLE로 만들어 SQLite에서 실제로 돌린다.
주장:
  1. 사상 결과는 릴레이션 6개이고, 속성·기본 키·외래 키 8개가 6-2 p.20과 7 p.11의 그림과 같다.
  2. 단계마다의 중간 결과가 7 p.13~27의 그림과 같다.
  3. 개수: 일반 개체 3 + 약한 개체 1 + 다치 속성 1 + M:N 관계 1 = 릴레이션 6개.
     외래 키는 약한 개체 1 + 다치 속성 1 + 1:1 관계 1 + 1:N 관계 3 + M:N 관계 2 = 8개.
  4. 유도 속성 Number_of_employees와 복합 속성 Name, 다치 속성 Locations는 열이 되지 않는다.
  5. 전체 참여인 쪽에 넣은 외래 키만 NOT NULL로 두면 9 p.17~18 DDL의 NOT NULL과 같다(Mgr_ssn, Dno, Dnum. Super_ssn은 아님).
  6. 만든 표에 6-2 p.21의 상태가 그대로 들어가고 외래 키 검사를 통과한다.
  7. 1:N인 WORKS_FOR를 교차 참조 방법으로 바꾸면 릴레이션이 7개가 된다(외래 키 방법이 릴레이션 수를 줄인다, 7 p.21).
  8. 7 p.11·p.29의 완성 그림은 PROJECT의 Plocation에도 밑줄이 있다. 상태에서 Pnumber 혼자 안 겹치므로
     {Pnumber, Plocation}은 줄일 수 있는 묶음이고 기본 키는 Pnumber다.
  9. 5 p.34의 (min, max) 표기로 읽어도 같은 1·N과 전체·부분 참여가 나온다(max가 1인 쪽이 외래 키를 받는다).
 10. 1:1과 1:N을 모두 외래 키 방법으로 옮길 때의 개수 식:
     릴레이션 = 일반 개체 + 약한 개체 + 다치 속성 + M:N 관계 + n항 관계,
     외래 키 = 약한 개체 + 다치 속성 + 1:1 관계 + 1:N 관계 + 2 × M:N 관계 + (n항 관계마다 n).
     COMPANY (6, 8), UNIVERSITY (7, 10), 카드 C3의 ER (10, 12).
"""
import sqlite3

# ---- COMPANY 스키마와 상태 (6-2 p.20~21, DDL은 9 p.17~18). 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
DDL = """
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname), FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1) {hours_null},
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
"""
EMP = [
 ('John','B','Smith','123456789','1965-01-09','731 Fondren, Houston, TX','M',30000,'333445555',5),
 ('Franklin','T','Wong','333445555','1955-12-08','638 Voss, Houston, TX','M',40000,'888665555',5),
 ('Alicia','J','Zelaya','999887777','1968-01-19','3321 Castle, Spring, TX','F',25000,'987654321',4),
 ('Jennifer','S','Wallace','987654321','1941-06-20','291 Berry, Bellaire, TX','F',43000,'888665555',4),
 ('Ramesh','K','Narayan','666884444','1962-09-15','975 Fire Oak, Humble, TX','M',38000,'333445555',5),
 ('Joyce','A','English','453453453','1972-07-31','5631 Rice, Houston, TX','F',25000,'333445555',5),
 ('Ahmad','V','Jabbar','987987987','1969-03-29','980 Dallas, Houston, TX','M',25000,'987654321',4),
 ('James','E','Borg','888665555','1937-11-10','450 Stone, Houston, TX','M',55000,None,1)]
DEPT = [('Research',5,'333445555','1988-05-22'),('Administration',4,'987654321','1995-01-01'),('Headquarters',1,'888665555','1981-06-19')]
LOC = [(1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston')]
PROJ = [('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4)]
WORKS = [('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),('987654321',20,15.0),('888665555',20,None)]
DEPN = [('333445555','Alice','F','1986-04-05','Daughter'),('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse')]


def make_company(hours_not_null=False):
    """COMPANY를 메모리 SQLite에 만든다. EMPLOYEE와 DEPARTMENT가 서로 가리켜서 그 외래 키는 커밋 때 검사한다."""
    c = sqlite3.connect(':memory:')
    c.isolation_level = None
    c.execute('PRAGMA foreign_keys=ON')
    c.executescript(DDL.format(hours_null='NOT NULL' if hours_not_null else ''))
    c.execute('BEGIN')
    c.executemany('INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)', EMP)
    c.executemany('INSERT INTO DEPARTMENT VALUES (?,?,?,?)', DEPT)
    c.executemany('INSERT INTO DEPT_LOCATIONS VALUES (?,?)', LOC)
    c.executemany('INSERT INTO PROJECT VALUES (?,?,?,?)', PROJ)
    c.executemany('INSERT INTO WORKS_ON VALUES (?,?,?)', WORKS)
    c.executemany('INSERT INTO DEPENDENT VALUES (?,?,?,?,?)', DEPN)
    c.execute('COMMIT')
    return c
# ---- COMPANY 끝 ----

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

COMPANY_ER = {   # 7 p.11 왼쪽 그림. 속성 이름은 오른쪽 그림(릴레이션)의 이름으로 적었다
    "entities": [
        {"name": "EMPLOYEE", "key": ["Ssn"],
         "attrs": [("Name", ["Fname", "Minit", "Lname"]), "Ssn", "Bdate", "Address", "Sex", "Salary"]},
        {"name": "DEPARTMENT", "key": ["Dnumber"], "attrs": ["Dname", "Dnumber"],
         "multivalued": [("DEPT_LOCATIONS", "Dlocation", ["Dnumber"])], "derived": ["Number_of_employees"]},
        {"name": "PROJECT", "key": ["Pnumber"], "attrs": ["Pname", "Pnumber", "Plocation"]},
        {"name": "DEPENDENT", "attrs": ["Dependent_name", "Sex", "Bdate", "Relationship"],
         "weak": {"owner": "EMPLOYEE", "fk": ["Essn"], "partial_key": ["Dependent_name"]}},
    ],
    "relationships": [   # 식별 관계 DEPENDENTS_OF는 약한 개체를 옮길 때 함께 처리된다(7 p.14)
        {"name": "MANAGES", "ends": [("EMPLOYEE", "1", "partial"), ("DEPARTMENT", "1", "total")],
         "fk": ["Mgr_ssn"], "attrs": ["Mgr_start_date"], "ends_fk": [["Essn"], ["Dno"]]},
        {"name": "WORKS_FOR", "ends": [("EMPLOYEE", "N", "total"), ("DEPARTMENT", "1", "total")],
         "fk": ["Dno"], "ends_fk": [["Essn"], ["Dno"]]},
        {"name": "SUPERVISION", "ends": [("EMPLOYEE", "1", "partial"), ("EMPLOYEE", "N", "partial")], "fk": ["Super_ssn"]},
        {"name": "CONTROLS", "ends": [("DEPARTMENT", "1", "partial"), ("PROJECT", "N", "total")], "fk": ["Dnum"]},
        {"name": "WORKS_ON", "ends": [("EMPLOYEE", "M", "total"), ("PROJECT", "N", "total")],
         "ends_fk": [["Essn"], ["Pno"]], "attrs": ["Hours"]},
    ],
}

EXPECTED = {   # 6-2 p.20의 속성과 밑줄, 7 p.11의 화살표
    "EMPLOYEE": (["Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary", "Super_ssn", "Dno"], ["Ssn"],
                 [(("Super_ssn",), "EMPLOYEE", ("Ssn",)), (("Dno",), "DEPARTMENT", ("Dnumber",))]),
    "DEPARTMENT": (["Dname", "Dnumber", "Mgr_ssn", "Mgr_start_date"], ["Dnumber"], [(("Mgr_ssn",), "EMPLOYEE", ("Ssn",))]),
    "DEPT_LOCATIONS": (["Dnumber", "Dlocation"], ["Dnumber", "Dlocation"], [(("Dnumber",), "DEPARTMENT", ("Dnumber",))]),
    "PROJECT": (["Pname", "Pnumber", "Plocation", "Dnum"], ["Pnumber"], [(("Dnum",), "DEPARTMENT", ("Dnumber",))]),
    "WORKS_ON": (["Essn", "Pno", "Hours"], ["Essn", "Pno"],
                 [(("Essn",), "EMPLOYEE", ("Ssn",)), (("Pno",), "PROJECT", ("Pnumber",))]),
    "DEPENDENT": (["Essn", "Dependent_name", "Sex", "Bdate", "Relationship"], ["Essn", "Dependent_name"],
                  [(("Essn",), "EMPLOYEE", ("Ssn",))]),
}


def count(regular, weak, multi, one_one, one_n, m_n, nary=()):
    """외래 키 방법만 쓸 때의 (릴레이션 수, 외래 키 수). nary는 n항 관계마다의 n."""
    return regular + weak + multi + m_n + len(nary), weak + multi + one_one + one_n + 2 * m_n + sum(nary)


def main():
    rels, log = map_er(COMPANY_ER)

    # 1. 결과가 슬라이드와 같다
    want = {n: (frozenset(a), frozenset(pk), frozenset(fks)) for n, (a, pk, fks) in EXPECTED.items()}
    assert shape(rels) == want
    assert sum(len(r["fks"]) for r in rels.values()) == 8 and len(rels) == 6
    print("[OK] COMPANY ER → 릴레이션 6개, 외래 키 8개. 6-2 p.20, 7 p.11과 같다")

    # 2. 단계별 중간 결과 (7 p.13, 14, 15, 17, 24, 27)
    step = dict(log)
    emp8 = ["Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary"]
    assert step["일반 개체"] == {"EMPLOYEE": emp8, "DEPARTMENT": ["Dname", "Dnumber"], "PROJECT": ["Pname", "Pnumber", "Plocation"]}
    assert step["약한 개체"]["DEPENDENT"] == ["Essn", "Dependent_name", "Sex", "Bdate", "Relationship"]
    assert step["다치 속성"]["DEPT_LOCATIONS"] == ["Dnumber", "Dlocation"]
    assert step["1:1 관계"]["DEPARTMENT"] == ["Dname", "Dnumber", "Mgr_ssn", "Mgr_start_date"]
    assert step["1:1 관계"]["EMPLOYEE"] == emp8                                   # 직원 쪽에는 아무것도 안 붙는다
    assert step["1:N 관계"]["EMPLOYEE"] == emp8 + ["Dno", "Super_ssn"]            # 7 p.24의 순서
    assert step["1:N 관계"]["PROJECT"] == ["Pname", "Pnumber", "Plocation", "Dnum"]
    assert "WORKS_ON" not in step["1:N 관계"] and step["M:N 관계"]["WORKS_ON"] == ["Essn", "Pno", "Hours"]
    assert step["n항 관계"] == step["M:N 관계"]                                   # COMPANY에는 n항 관계가 없다
    print("[OK] 단계마다의 중간 결과가 7 p.13~27과 같다")

    # 3. 개수
    n_regular = sum(1 for e in COMPANY_ER["entities"] if "weak" not in e)
    n_weak = len(COMPANY_ER["entities"]) - n_regular
    n_multi = sum(len(e.get("multivalued", [])) for e in COMPANY_ER["entities"])
    assert (n_regular, n_weak, n_multi) == (3, 1, 1) and n_regular + n_weak + n_multi + 1 == 6
    assert 1 + 1 + 1 + 3 + 2 == 8
    print("[OK] 3 + 1 + 1 + 1 = 6개, 외래 키 1 + 1 + 1 + 3 + 2 = 8개")

    # 4. 열이 되지 않는 것
    all_cols = {a for r in rels.values() for a in r["attrs"]}
    assert not {"Number_of_employees", "Name", "Locations"} & all_cols
    print("[OK] 유도 속성, 복합 속성 이름, 다치 속성 이름은 열이 아니다")

    # 5. 전체 참여 쪽 외래 키의 NOT NULL
    fk_cols = {c for r in rels.values() for cols, _, _ in r["fks"] for c in cols}
    fk_not_null = {(n, c) for n, r in rels.items() for c in r["not_null"] if c in fk_cols and c not in r["pk"]}
    assert fk_not_null == {("DEPARTMENT", "Mgr_ssn"), ("EMPLOYEE", "Dno"), ("PROJECT", "Dnum")}
    c = make_company()
    ddl_not_null = {(t, row[1]) for t in EXPECTED for row in c.execute(f"PRAGMA table_info({t})")
                    if row[3] and row[1] in ("Mgr_ssn", "Dno", "Dnum", "Super_ssn")}
    assert ddl_not_null == fk_not_null
    print("[OK] 전체 참여 쪽 외래 키 Mgr_ssn, Dno, Dnum만 NOT NULL. 9 p.17~18의 DDL과 같다")

    # 6. 만든 표에 상태를 넣는다
    m = build_sqlite(rels)
    m.execute("BEGIN")
    for name, cols, rows in (("EMPLOYEE", EXPECTED["EMPLOYEE"][0], EMP), ("DEPARTMENT", EXPECTED["DEPARTMENT"][0], DEPT),
                             ("DEPT_LOCATIONS", EXPECTED["DEPT_LOCATIONS"][0], LOC), ("PROJECT", EXPECTED["PROJECT"][0], PROJ),
                             ("WORKS_ON", EXPECTED["WORKS_ON"][0], WORKS), ("DEPENDENT", EXPECTED["DEPENDENT"][0], DEPN)):
        q = f'INSERT INTO "{name}" (' + ", ".join(f'"{x}"' for x in cols) + ") VALUES (" + ", ".join("?" * len(cols)) + ")"
        m.executemany(q, rows)
    m.execute("COMMIT")
    assert m.execute("PRAGMA foreign_key_check").fetchall() == []
    assert [m.execute(f'SELECT COUNT(*) FROM "{n}"').fetchone()[0] for n in EXPECTED] == [8, 3, 5, 6, 16, 7]
    try:
        m.execute("INSERT INTO PROJECT (Pname, Pnumber, Plocation, Dnum) VALUES ('ProductW', 4, 'Houston', 9)")
        raise AssertionError("없는 9번 부서를 가리키는 프로젝트가 들어갔다")
    except sqlite3.IntegrityError:
        pass
    print("[OK] 사상 결과로 만든 표에 6-2 p.21의 45행이 들어가고 외래 키 검사를 통과한다")

    # 7. 다른 선택: WORKS_FOR를 교차 참조로
    alt, _ = map_er(COMPANY_ER, approach={"WORKS_FOR": "cross"})
    assert len(alt) == 7 and alt["WORKS_FOR"]["attrs"] == ["Essn", "Dno"] and alt["WORKS_FOR"]["pk"] == ["Essn"]
    assert "Dno" not in alt["EMPLOYEE"]["attrs"]
    alt2, _ = map_er(COMPANY_ER, approach={"MANAGES": "cross"})
    assert alt2["MANAGES"]["attrs"] == ["Essn", "Dno", "Mgr_start_date"] and alt2["MANAGES"]["pk"] in (["Essn"], ["Dno"])
    build_sqlite(alt); build_sqlite(alt2)
    print("[OK] WORKS_FOR를 교차 참조로 바꾸면 릴레이션 7개. MANAGES(Essn, Dno)도 만들어진다")

    # 8. Plocation의 밑줄
    assert c.execute("SELECT COUNT(DISTINCT Pnumber), COUNT(*) FROM PROJECT").fetchone() == (6, 6)
    assert c.execute("SELECT COUNT(DISTINCT Plocation) FROM PROJECT").fetchone()[0] == 4      # Houston 2, Stafford 2
    print("[OK] Pnumber 혼자 6행에서 안 겹친다. {Pnumber, Plocation}은 최소가 아니다")

    # 9. (min, max)로 읽기 (5 p.34)
    mm = {"MANAGES": minmax(("EMPLOYEE", 0, 1), ("DEPARTMENT", 1, 1)),
          "WORKS_FOR": minmax(("EMPLOYEE", 1, 1), ("DEPARTMENT", 4, "N")),
          "SUPERVISION": minmax(("EMPLOYEE", 0, "N"), ("EMPLOYEE", 0, 1)),          # 상사, 부하 순서
          "CONTROLS": minmax(("DEPARTMENT", 0, "N"), ("PROJECT", 1, 1)),
          "WORKS_ON": minmax(("EMPLOYEE", 1, "N"), ("PROJECT", 1, "N"))}
    for r in COMPANY_ER["relationships"]:
        assert mm[r["name"]] == r["ends"], r["name"]
    print("[OK] 5 p.34의 (min, max)에서 뽑은 1·N과 참여가 7 p.11 그림의 표기와 같다")

    # 10. 개수 식
    assert count(3, 1, 1, 1, 3, 1) == (len(rels), sum(len(r["fks"]) for r in rels.values())) == (6, 8)
    assert count(6, 0, 0, 2, 6, 1) == (7, 10)               # UNIVERSITY (7 p.31, 풀이 p.6)
    assert count(5, 1, 2, 1, 4, 2) == (10, 12)              # 카드 C3
    assert count(3, 0, 0, 0, 0, 0, nary=(3,)) == (4, 3)     # SUPPLY (7 p.28): 개체 셋과 삼항 관계 하나
    print("[OK] 개수 식: COMPANY (6, 8), UNIVERSITY (7, 10), 카드 C3 (10, 12), SUPPLY (4, 3)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
