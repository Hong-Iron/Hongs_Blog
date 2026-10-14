---
layout: "note"
title: "43_mapping-many-to-many-relationship_verify.py"
display_title: "43_mapping-many-to-many-relationship_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/mapping-many-to-many-relationship/"
parent_title: "다대다·n항 관계 타입의 사상"
description: "데이터베이스 설계 · 다대다·n항 관계 타입의 사상 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/43_mapping-many-to-many-relationship_verify/"
---
{% raw %}
[다대다·n항 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-many-to-many-relationship/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다대다·n항 관계 타입의 사상 검증.

문서: 43.다대다·n항 관계 타입의 사상 (예시, 절차, 카드 C1~C3)
출처: 데이터베이스 설계 7 슬라이드 p.26~28, 9 슬라이드 p.12~13, 6-2 p.21 (상태)
실행: python3 43_mapping-many-to-many-relationship_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. WORKS_ON(Essn, Pno, Hours)은 16행이다. Essn은 8가지, Pno는 6가지라 혼자서는 겹치고, 짝은 16가지라 안 겹친다.
  2. 외래 키 하나로는 못 적는다: 한 직원이 많게는 4개 프로젝트(Wong), 한 프로젝트에 많게는 3명이 붙는다.
     EMPLOYEE에 Pno를 넣어도, PROJECT에 Essn을 넣어도 한 칸에 여러 값이 필요하다.
  3. Hours는 (직원, 프로젝트) 짝에 달린 값이다. Smith는 1번에 32.5, 2번에 7.5시간이다.
  4. 같은 짝을 두 번 넣을 수 없고, 없는 직원이나 프로젝트를 가리킬 수 없다.
  5. 삼항 SUPPLY(Sname, Proj_name, Part_no, Quantity): 외래 키 셋, 기본 키는 셋의 조합.
     지어낸 4행에서 어느 둘을 골라도 겹치고 셋을 묶어야 안 겹친다.
  6. 본문과 카드 C2: 프로젝트 2에서 일하는 직원은 Smith, English, Wong(3명). Wong의 프로젝트는 2, 3, 10, 20.
"""
import sqlite3
from itertools import combinations

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


def main():
    c = make_company()
    # 1. 기본 키
    n, e, p = c.execute("SELECT COUNT(*), COUNT(DISTINCT Essn), COUNT(DISTINCT Pno) FROM WORKS_ON").fetchone()
    pairs = c.execute("SELECT COUNT(*) FROM (SELECT DISTINCT Essn, Pno FROM WORKS_ON)").fetchone()[0]
    assert (n, e, p, pairs) == (16, 8, 6, 16)
    print("[OK] WORKS_ON 16행: Essn 8가지, Pno 6가지, 짝 16가지")

    # 2. 외래 키 하나로는 안 된다
    max_proj = c.execute("SELECT MAX(k) FROM (SELECT COUNT(*) AS k FROM WORKS_ON GROUP BY Essn)").fetchone()[0]
    max_emp = c.execute("SELECT MAX(k) FROM (SELECT COUNT(*) AS k FROM WORKS_ON GROUP BY Pno)").fetchone()[0]
    assert (max_proj, max_emp) == (4, 3)
    who = c.execute("""SELECT E.Lname FROM EMPLOYEE E WHERE (SELECT COUNT(*) FROM WORKS_ON W WHERE W.Essn = E.Ssn) = 4""").fetchall()
    assert who == [("Wong",)]
    print("[OK] 한 직원이 많게는 4개(Wong), 한 프로젝트에 많게는 3명")

    # 3. Hours는 짝에 달린 값
    assert c.execute("SELECT Pno, Hours FROM WORKS_ON WHERE Essn = '123456789' ORDER BY Pno").fetchall() == [(1, 32.5), (2, 7.5)]
    print("[OK] Smith: 1번 32.5시간, 2번 7.5시간")

    # 4. 제약
    for sql, needle in (("INSERT INTO WORKS_ON VALUES ('123456789', 1, 5.0)", "UNIQUE constraint failed"),
                        ("INSERT INTO WORKS_ON VALUES ('000000000', 1, 5.0)", "FOREIGN KEY constraint failed"),
                        ("INSERT INTO WORKS_ON VALUES ('123456789', 99, 5.0)", "FOREIGN KEY constraint failed")):
        try:
            c.execute(sql)
            raise AssertionError(sql)
        except sqlite3.IntegrityError as err:
            assert needle in str(err), str(err)
    c.execute("INSERT INTO WORKS_ON VALUES ('123456789', 3, 5.0)")           # 새 짝은 들어간다
    c.execute("DELETE FROM WORKS_ON WHERE Essn = '123456789' AND Pno = 3")
    print("[OK] 같은 짝, 없는 직원, 없는 프로젝트는 거부")

    # 5. SUPPLY (7 p.28의 스키마. 행은 지어낸 것)
    s = sqlite3.connect(":memory:")
    s.execute("PRAGMA foreign_keys=ON")
    s.executescript("""
      CREATE TABLE SUPPLIER (Sname VARCHAR(15) PRIMARY KEY NOT NULL);
      CREATE TABLE PROJECT (Proj_name VARCHAR(15) PRIMARY KEY NOT NULL);
      CREATE TABLE PART (Part_no INT PRIMARY KEY NOT NULL);
      CREATE TABLE SUPPLY (Sname VARCHAR(15) NOT NULL, Proj_name VARCHAR(15) NOT NULL, Part_no INT NOT NULL, Quantity INT,
        PRIMARY KEY (Sname, Proj_name, Part_no),
        FOREIGN KEY (Sname) REFERENCES SUPPLIER(Sname), FOREIGN KEY (Proj_name) REFERENCES PROJECT(Proj_name),
        FOREIGN KEY (Part_no) REFERENCES PART(Part_no));
      INSERT INTO SUPPLIER VALUES ('s1'), ('s2');
      INSERT INTO PROJECT VALUES ('j1'), ('j2');
      INSERT INTO PART VALUES (1), (2);""")
    rows = [("s1", "j1", 1, 100), ("s1", "j1", 2, 50), ("s1", "j2", 1, 30), ("s2", "j1", 1, 70)]
    s.executemany("INSERT INTO SUPPLY VALUES (?,?,?,?)", rows)
    assert len(s.execute("PRAGMA foreign_key_list(SUPPLY)").fetchall()) == 3
    for i, j in combinations(range(3), 2):
        assert len({(r[i], r[j]) for r in rows}) < len(rows)                 # 어느 둘도 겹친다
    assert len({r[:3] for r in rows}) == len(rows)
    print("[OK] SUPPLY: 외래 키 3개, 어느 두 속성도 겹치고 셋을 묶어야 안 겹친다")

    # 6. 본문과 카드 C2
    assert [r[0] for r in c.execute("""SELECT E.Lname FROM EMPLOYEE E, WORKS_ON W
            WHERE W.Essn = E.Ssn AND W.Pno = 2 ORDER BY E.Lname""")] == ["English", "Smith", "Wong"]
    assert [r[0] for r in c.execute("SELECT Pno FROM WORKS_ON WHERE Essn = '333445555' ORDER BY Pno")] == [2, 3, 10, 20]
    print("[OK] 프로젝트 2: English, Smith, Wong. Wong의 프로젝트: 2, 3, 10, 20")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
