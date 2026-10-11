---
layout: "note"
title: "36_entity-integrity-constraint_verify.py"
display_title: "36_entity-integrity-constraint_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/entity-integrity-constraint/"
parent_title: "개체 무결성 제약"
description: "데이터베이스 설계 · 개체 무결성 제약 검증 코드"
permalink: "/studies/database-design/code/36_entity-integrity-constraint_verify/"
---
{% raw %}
[개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""개체 무결성 제약 검증.

문서: 36.개체 무결성 제약 (예시, 정의, 카드 C1~C3)
출처: 데이터베이스 설계 6-2 슬라이드 p.22, 7 슬라이드 p.7, 9 슬라이드 p.4
실행: python3 36_entity-integrity-constraint_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. COMPANY 상태(6-2 p.21)의 여섯 릴레이션 어디에도 기본 키 속성이 NULL인 튜플이 없다.
     키가 아닌 속성은 NULL이어도 된다(Borg의 Super_ssn, Borg의 Hours).
  2. 기본 키가 NULL인 튜플은 넣을 수 없다. 여러 속성으로 된 기본 키는 한 속성만 NULL이어도 안 된다.
  3. 슬라이드의 까닭: 기본 키가 NULL인 튜플이 둘이면 가려낼 길이 없다. "= NULL"로는 한 행도 안 잡히고,
     "IS NULL"로는 둘이 한꺼번에 잡힌다.
  4. p.22 그림의 Office_phone은 NULL이 3개다. 이 속성이 기본 키라면 세 학생을 가려낼 수 없다.
  5. SQLite만의 동작: PRIMARY KEY만 적고 NOT NULL을 안 적은 열에는 NULL이 들어간다.
     (PostgreSQL은 PRIMARY KEY만으로 막는다 → 36_entity-integrity-constraint_verify.sql)
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

PKS = {"EMPLOYEE": ["Ssn"], "DEPARTMENT": ["Dnumber"], "DEPT_LOCATIONS": ["Dnumber", "Dlocation"],
       "PROJECT": ["Pnumber"], "WORKS_ON": ["Essn", "Pno"], "DEPENDENT": ["Essn", "Dependent_name"]}


def fails(c, sql, args=(), needle="NOT NULL constraint failed"):
    try:
        c.execute(sql, args)
    except sqlite3.IntegrityError as e:
        assert needle in str(e), str(e)
        return True
    return False


def main():
    c = make_company()
    # 1. 상태에 NULL인 기본 키가 없다
    for rel, pk in PKS.items():
        n = c.execute(f"SELECT COUNT(*) FROM {rel} WHERE " + " OR ".join(f"{a} IS NULL" for a in pk)).fetchone()[0]
        assert n == 0, rel
    assert c.execute("SELECT Lname FROM EMPLOYEE WHERE Super_ssn IS NULL").fetchall() == [("Borg",)]
    assert c.execute("SELECT Essn, Pno FROM WORKS_ON WHERE Hours IS NULL").fetchall() == [("888665555", 20)]
    print("[OK] 여섯 릴레이션에 NULL인 기본 키 0건. 키가 아닌 속성의 NULL은 2칸(Borg)")

    # 2. NULL인 기본 키는 못 넣는다
    assert fails(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('Cecilia', 'Kolonsky', NULL, 4)")
    assert fails(c, "INSERT INTO WORKS_ON VALUES ('123456789', NULL, 5.0)")      # 기본 키의 한 속성만 NULL
    assert fails(c, "INSERT INTO DEPENDENT (Essn, Dependent_name) VALUES ('123456789', NULL)")
    print("[OK] Ssn이 NULL인 직원, Pno가 NULL인 WORKS_ON, 이름이 NULL인 부양가족은 거부된다")

    # 3. 까닭: NULL인 키 둘은 가려낼 수 없다 (제약이 없는 표로 실험)
    t = sqlite3.connect(":memory:")
    t.execute("CREATE TABLE PERSON (Ssn, Name)")
    t.executemany("INSERT INTO PERSON VALUES (?, ?)", [(None, "Kim"), (None, "Lee"), ("111", "Park")])
    assert t.execute("SELECT COUNT(*) FROM PERSON WHERE Ssn = NULL").fetchone()[0] == 0
    assert t.execute("SELECT COUNT(*) FROM PERSON WHERE Ssn IS NULL").fetchone()[0] == 2
    assert t.execute("SELECT COUNT(*) FROM PERSON WHERE Ssn = '111'").fetchone()[0] == 1
    print("[OK] 키가 NULL인 두 튜플: = NULL은 0행, IS NULL은 2행. 하나만 집어낼 수 없다")

    # 4. p.22 그림: Office_phone의 NULL 3개
    office = [None, None, "(817)749-1253", "(817)749-6492", None]
    assert office.count(None) == 3
    print("[OK] Office_phone이 기본 키라면 NULL인 세 학생을 가려낼 수 없다")

    # 5. SQLite만의 동작
    q = sqlite3.connect(":memory:")
    q.execute("CREATE TABLE LOOSE (Ssn CHAR(9) PRIMARY KEY, Name VARCHAR(15))")           # NOT NULL을 안 적음
    q.execute("INSERT INTO LOOSE VALUES (NULL, 'Kim')")
    q.execute("INSERT INTO LOOSE VALUES (NULL, 'Lee')")
    assert q.execute("SELECT COUNT(*) FROM LOOSE WHERE Ssn IS NULL").fetchone()[0] == 2
    q.execute("CREATE TABLE STRICT_T (Ssn CHAR(9) NOT NULL PRIMARY KEY, Name VARCHAR(15))")
    assert fails(q, "INSERT INTO STRICT_T VALUES (NULL, 'Kim')")
    print("[OK] SQLite: PRIMARY KEY만 적으면 NULL이 두 번 들어간다. NOT NULL을 같이 적어야 막힌다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
