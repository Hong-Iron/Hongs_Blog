---
layout: "note"
title: "35_relational-database-schema_verify.py"
display_title: "35_relational-database-schema_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relational-database-schema/"
parent_title: "관계형 데이터베이스 스키마와 상태"
description: "데이터베이스 설계 · 관계형 데이터베이스 스키마와 상태 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/35_relational-database-schema_verify/"
---
{% raw %}
[관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""관계형 데이터베이스 스키마와 상태 검증.

문서: 35.관계형 데이터베이스 스키마와 상태 (COMPANY 스키마와 상태 표, 카드 C1~C3)
출처: Elmasri & Navathe, Fundamentals of Database Systems의 COMPANY 스키마, 상태, CREATE TABLE 문
실행: python3 35_relational-database-schema_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. COMPANY 스키마는 릴레이션 6개이고, 속성과 기본 키가 문서의 스키마 표와 같다.
  2. 문서의 상태는 8, 3, 5, 6, 16, 7행, 모두 45행이다.
  3. 이 상태는 올바르다: 기본 키 값이 안 겹치고, 기본 키에 NULL이 없고, 외래 키 8개의 값이 모두
     가리키는 릴레이션에 있거나 NULL이다. (제약을 끈 채 직접 세어 확인하고, SQLite의 검사로 한 번 더 본다.)
  4. 값 하나만 바꿔도 올바르지 않은 상태가 된다: Smith의 Dno를 7로 바꾸면 가리킬 부서가 없다.
  5. WORKS_ON.Hours를 NOT NULL로 선언하면 상태의 (888665555, 20, NULL) 때문에
     이 상태를 넣을 수 없다.
"""
import sqlite3

# ---- COMPANY 스키마와 상태 (Elmasri & Navathe의 COMPANY, DDL은 같은 교재의 CREATE TABLE 문). 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
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

SCHEMA = {   # 문서의 스키마 표: 속성 순서와 기본 키
    "EMPLOYEE": (["Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary", "Super_ssn", "Dno"], ["Ssn"]),
    "DEPARTMENT": (["Dname", "Dnumber", "Mgr_ssn", "Mgr_start_date"], ["Dnumber"]),
    "DEPT_LOCATIONS": (["Dnumber", "Dlocation"], ["Dnumber", "Dlocation"]),
    "PROJECT": (["Pname", "Pnumber", "Plocation", "Dnum"], ["Pnumber"]),
    "WORKS_ON": (["Essn", "Pno", "Hours"], ["Essn", "Pno"]),
    "DEPENDENT": (["Essn", "Dependent_name", "Sex", "Bdate", "Relationship"], ["Essn", "Dependent_name"]),
}
FKS = [   # 문서 그림의 화살표 8개: (릴레이션, 외래 키, 가리키는 릴레이션, 그쪽 기본 키)
    ("EMPLOYEE", "Super_ssn", "EMPLOYEE", "Ssn"), ("EMPLOYEE", "Dno", "DEPARTMENT", "Dnumber"),
    ("DEPARTMENT", "Mgr_ssn", "EMPLOYEE", "Ssn"), ("DEPT_LOCATIONS", "Dnumber", "DEPARTMENT", "Dnumber"),
    ("PROJECT", "Dnum", "DEPARTMENT", "Dnumber"), ("WORKS_ON", "Essn", "EMPLOYEE", "Ssn"),
    ("WORKS_ON", "Pno", "PROJECT", "Pnumber"), ("DEPENDENT", "Essn", "EMPLOYEE", "Ssn"),
]


def violations(c):
    """키·개체 무결성·참조 무결성을 SQL로 직접 센다. (DBMS의 제약 검사에 기대지 않는다.)"""
    out = []
    for rel, (_, pk) in SCHEMA.items():
        cols = ", ".join(pk)
        dup = c.execute(f"SELECT COUNT(*) FROM (SELECT {cols} FROM {rel} GROUP BY {cols} HAVING COUNT(*) > 1)").fetchone()[0]
        nul = c.execute(f"SELECT COUNT(*) FROM {rel} WHERE " + " OR ".join(f"{a} IS NULL" for a in pk)).fetchone()[0]
        if dup: out.append(("key", rel))
        if nul: out.append(("entity", rel))
    for rel, fk, ref, pk in FKS:
        bad = c.execute(f"SELECT COUNT(*) FROM {rel} WHERE {fk} IS NOT NULL AND {fk} NOT IN (SELECT {pk} FROM {ref})").fetchone()[0]
        if bad: out.append(("referential", rel, fk))
    return out


def main():
    c = make_company()
    # 1. 스키마
    assert len(SCHEMA) == 6
    for rel, (attrs, pk) in SCHEMA.items():
        info = c.execute(f"PRAGMA table_info({rel})").fetchall()          # (cid, name, type, notnull, default, pk순서)
        assert [r[1] for r in info] == attrs, rel
        assert [r[1] for r in sorted((r for r in info if r[5]), key=lambda r: r[5])] == pk, rel
    fk_db = set()
    for rel in SCHEMA:
        for row in c.execute(f"PRAGMA foreign_key_list({rel})"):          # (id, seq, table, from, to, ...)
            fk_db.add((rel, row[3], row[2], row[4]))
    assert fk_db == set(FKS) and len(FKS) == 8
    print("[OK] 릴레이션 6개, 속성·기본 키가 문서의 스키마 표와 같고 외래 키는 8개")

    # 2. 상태의 크기
    counts = [c.execute(f"SELECT COUNT(*) FROM {rel}").fetchone()[0] for rel in SCHEMA]
    assert counts == [8, 3, 5, 6, 16, 7] and sum(counts) == 45
    print("[OK] 행 수", counts, "모두", sum(counts))

    # 3. 올바른 상태
    assert violations(c) == []
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    nulls = c.execute("SELECT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NULL), (SELECT COUNT(*) FROM WORKS_ON WHERE Hours IS NULL)").fetchone()
    assert nulls == (1, 1)                                               # Borg의 상사, Borg의 20번 프로젝트 시간
    print("[OK] 키·개체 무결성·참조 무결성 위반 0건. NULL은 Borg의 Super_ssn과 Hours 두 칸뿐")

    # 4. 값 하나만 바꾼 올바르지 않은 상태 (제약을 끄고 바꾼 뒤 직접 센다)
    c.execute("PRAGMA foreign_keys=OFF")
    c.execute("UPDATE EMPLOYEE SET Dno = 7 WHERE Ssn = '123456789'")
    assert violations(c) == [("referential", "EMPLOYEE", "Dno")]
    c.execute("UPDATE EMPLOYEE SET Dno = 5 WHERE Ssn = '123456789'")
    assert violations(c) == []
    print("[OK] Smith의 Dno를 7로 바꾸면 참조 무결성이 깨진 상태가 된다")

    # 5. Hours를 NOT NULL로 선언한 표에는 문서의 상태가 들어가지 않는다
    try:
        make_company(hours_not_null=True)
        raise AssertionError("Hours NOT NULL인데 상태가 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "NOT NULL constraint failed: WORKS_ON.Hours" in str(e)
    print("[OK] Hours NOT NULL이면 (888665555, 20, NULL) 때문에 상태를 넣을 수 없다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
