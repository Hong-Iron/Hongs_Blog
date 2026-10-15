---
layout: "note"
title: "77_view-practice_p1.py"
display_title: "77_view-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-practice/"
parent_title: "뷰 연습"
description: "데이터베이스 설계 · 뷰 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/77_view-practice_p1/"
---
{% raw %}
[뷰 연습](/Hongs_Blog/studies/database-design/view-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뷰 연습의 문제 1 (a~d) 확인 (SQLite). PostgreSQL 판은 77_view-practice_p1.sql.

문서: 77.뷰 연습
확인하는 것:
  1-a. DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary)는 3행 4열이다(Minit은 뷰에 없다).
  1-b. 틀리기 쉬운 곳이 셋이다: "S,Fname"의 쉼표, 한정하지 않은 Dno,
       열 이름 3개에 SELECT 항목 5개. 고친 뷰는 4행이다.
  1-c. ProjectInfo는 6행이다. SQLite는 GROUP BY에 없는 D.Dname을 받아 준다(PostgreSQL은 거부한다).
  1-d. 같은 이름 ProjectInfo로는 못 만든다. 이름을 바꾸면 6행이고 1-c와 내용이 같다(모든 프로젝트에 2명 이상).
  변형. 일하는 사람이 없는 프로젝트는 1-c의 뷰에 안 나온다. LEFT JOIN과 COUNT(W.Essn)으로 고치면 0명으로 나온다.
실행: python3 77_view-practice_p1.py
"""
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.6)
# WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다. 서로 가리키는 외래 키는 커밋 때 검사한다.
DDL = """
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE,
  Relationship VARCHAR(8), PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
"""
EMP = [
    ("John", "B", "Smith", "123456789", "1965-01-09", "731 Fondren, Houston, TX", "M", 30000, "333445555", 5),
    ("Franklin", "T", "Wong", "333445555", "1955-12-08", "638 Voss, Houston, TX", "M", 40000, "888665555", 5),
    ("Alicia", "J", "Zelaya", "999887777", "1968-01-19", "3321 Castle, Spring, TX", "F", 25000, "987654321", 4),
    ("Jennifer", "S", "Wallace", "987654321", "1941-06-20", "291 Berry, Bellaire, TX", "F", 43000, "888665555", 4),
    ("Ramesh", "K", "Narayan", "666884444", "1962-09-15", "975 Fire Oak, Humble, TX", "M", 38000, "333445555", 5),
    ("Joyce", "A", "English", "453453453", "1972-07-31", "5631 Rice, Houston, TX", "F", 25000, "333445555", 5),
    ("Ahmad", "V", "Jabbar", "987987987", "1969-03-29", "980 Dallas, Houston, TX", "M", 25000, "987654321", 4),
    ("James", "E", "Borg", "888665555", "1937-11-10", "450 Stone, Houston, TX", "M", 55000, None, 1),
]
DEPT = [("Research", 5, "333445555", "1988-05-22"), ("Administration", 4, "987654321", "1995-01-01"),
        ("Headquarters", 1, "888665555", "1981-06-19")]
LOC = [(1, "Houston"), (4, "Stafford"), (5, "Bellaire"), (5, "Sugarland"), (5, "Houston")]
PROJ = [("ProductX", 1, "Bellaire", 5), ("ProductY", 2, "Sugarland", 5), ("ProductZ", 3, "Houston", 5),
        ("Computerization", 10, "Stafford", 4), ("Reorganization", 20, "Houston", 1), ("Newbenefits", 30, "Stafford", 4)]
WORKS = [("123456789", 1, 32.5), ("123456789", 2, 7.5), ("666884444", 3, 40.0), ("453453453", 1, 20.0),
         ("453453453", 2, 20.0), ("333445555", 2, 10.0), ("333445555", 3, 10.0), ("333445555", 10, 10.0),
         ("333445555", 20, 10.0), ("999887777", 30, 30.0), ("999887777", 10, 10.0), ("987987987", 10, 35.0),
         ("987987987", 30, 5.0), ("987654321", 30, 20.0), ("987654321", 20, 15.0), ("888665555", 20, None)]
DEPN = [("333445555", "Alice", "F", "1986-04-05", "Daughter"), ("333445555", "Theodore", "M", "1983-10-25", "Son"),
        ("333445555", "Joy", "F", "1958-05-03", "Spouse"), ("987654321", "Abner", "M", "1942-02-28", "Spouse"),
        ("123456789", "Michael", "M", "1988-01-04", "Son"), ("123456789", "Alice", "F", "1988-12-30", "Daughter"),
        ("123456789", "Elizabeth", "F", "1967-05-05", "Spouse")]


def make():
    """COMPANY를 메모리에 새로 만든다."""
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(DDL)
    c.execute("BEGIN")
    c.executemany("INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)", EMP)
    c.executemany("INSERT INTO DEPARTMENT VALUES (?,?,?,?)", DEPT)
    c.executemany("INSERT INTO DEPT_LOCATIONS VALUES (?,?)", LOC)
    c.executemany("INSERT INTO PROJECT VALUES (?,?,?,?)", PROJ)
    c.executemany("INSERT INTO WORKS_ON VALUES (?,?,?)", WORKS)
    c.executemany("INSERT INTO DEPENDENT VALUES (?,?,?,?,?)", DEPN)
    c.commit()
    return c


def q(c, sql, args=()):
    return c.execute(sql, args).fetchall()


def fails(c, sql, part):
    """sql이 오류를 내고 오류 글에 part가 들어 있는지 본다."""
    try:
        c.executescript(sql) if ";" in sql.strip().rstrip(";") else c.execute(sql)
    except sqlite3.Error as e:
        assert part in str(e), (sql, str(e))
        return str(e)
    raise AssertionError("오류가 나야 하는데 실행됐다: " + sql)


A = """CREATE VIEW DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary)
AS SELECT D.Dname, E.Fname, E.Lname, E.Salary
   FROM DEPARTMENT AS D, EMPLOYEE AS E
   WHERE D.Mgr_ssn=E.Ssn"""

# 틀리기 쉬운 판: 쉼표, 한정하지 않은 Dno, 열 이름 셋
B_SLIDE = """CREATE VIEW ResearchDept(Name, Supervisor, Salary)
AS SELECT E.Fname, E.Lname, S,Fname, S,Lname, E.Salary
   FROM EMPLOYEE AS E, EMPLOYEE AS S
   WHERE E.Super_ssn = S.Ssn AND Dno IN ( SELECT D.Dnumber
                                          FROM DEPARTMENT AS D
                                          WHERE D.Dname='Research' )"""
B_STEP1 = B_SLIDE.replace("S,Fname, S,Lname", "S.Fname, S.Lname")                 # 쉼표 -> 점
B_STEP2 = B_STEP1.replace("AND Dno IN", "AND E.Dno IN")                           # Dno 한정
B_FIXED = B_STEP2.replace("(Name, Supervisor, Salary)", "(Fname, Lname, SuperFname, SuperLname, Salary)")
B_THREE = """CREATE VIEW ResearchDept3(Name, Supervisor, Salary)
AS SELECT E.Fname || ' ' || E.Lname, S.Fname || ' ' || S.Lname, E.Salary
   FROM EMPLOYEE AS E, EMPLOYEE AS S
   WHERE E.Super_ssn = S.Ssn AND E.Dno IN ( SELECT D.Dnumber FROM DEPARTMENT AS D WHERE D.Dname='Research' )"""

# 틀리기 쉬운 판: GROUP BY에 D.Dname이 없고, 1-d도 같은 이름
C_SLIDE = """CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours)
AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
   FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
   WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
   GROUP BY P.Pnumber, P.Pname"""
D_SLIDE = C_SLIDE + "\n   HAVING COUNT(*) > 1"
C_FIXED = C_SLIDE.replace("GROUP BY P.Pnumber, P.Pname", "GROUP BY P.Pnumber, P.Pname, D.Dname")
D_FIXED = C_FIXED.replace("ProjectInfo(", "BusyProjectInfo(") + "\n   HAVING COUNT(*) > 1"

PROJECT_ROWS = [("ProductX", "Research", 2, 52.5), ("ProductY", "Research", 3, 37.5), ("ProductZ", "Research", 2, 50.0),
                ("Computerization", "Administration", 3, 55.0), ("Reorganization", "Headquarters", 3, 25.0),
                ("Newbenefits", "Administration", 3, 55.0)]


def view_error(c, create_sql, name, part):
    """SQLite는 뷰를 만들 때가 아니라 쓸 때 정의를 검사한다. 만들고, 질의해서 오류를 본다."""
    c.execute(f"DROP VIEW IF EXISTS {name}")
    c.execute(create_sql)
    msg = fails(c, f"SELECT * FROM {name}", part)
    c.execute(f"DROP VIEW {name}")
    return msg


def main():
    c = make()

    # 1-a
    c.execute(A)
    a = q(c, "SELECT * FROM DEPT_INFO")
    assert a == [("Research", "Franklin", "Wong", 40000), ("Administration", "Jennifer", "Wallace", 43000),
                 ("Headquarters", "James", "Borg", 55000)]
    assert len(a[0]) == 4
    print("[OK] 1-a: 3행 4열", a)

    # 1-b: 적힌 그대로 -> 한 곳씩 고쳐 가며 오류를 본다
    print("[OK] 1-b 틀리기 쉬운 판:", view_error(c, B_SLIDE, "ResearchDept", "no such column: S"))
    print("[OK] 1-b 쉼표를 점으로:", view_error(c, B_STEP1, "ResearchDept", "ambiguous column name: Dno"))
    print("[OK] 1-b Dno를 E.Dno로:", view_error(c, B_STEP2, "ResearchDept", "expected 3 columns"))
    c.execute(B_FIXED)
    b = q(c, "SELECT * FROM ResearchDept")
    assert sorted(b) == sorted([("John", "Smith", "Franklin", "Wong", 30000), ("Franklin", "Wong", "James", "Borg", 40000),
                                ("Ramesh", "Narayan", "Franklin", "Wong", 38000),
                                ("Joyce", "English", "Franklin", "Wong", 25000)])
    c.execute(B_THREE)
    assert sorted(q(c, "SELECT * FROM ResearchDept3")) == sorted([
        ("John Smith", "Franklin Wong", 30000), ("Franklin Wong", "James Borg", 40000),
        ("Ramesh Narayan", "Franklin Wong", 38000), ("Joyce English", "Franklin Wong", 25000)])
    print("[OK] 1-b 고친 뷰: 4행 (열 5개 판과, 이름을 이어 붙인 열 3개 판)")

    # 상사가 없는 Research 직원은 내부 조인에서 빠진다
    c.execute("INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333',NULL,NULL,'F',27000,NULL,5)")
    assert len(q(c, "SELECT * FROM ResearchDept")) == 4
    left = q(c, "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn "
                "WHERE E.Dno IN (SELECT Dnumber FROM DEPARTMENT WHERE Dname = 'Research')")
    assert len(left) == 5 and ("Lee", None) in left
    c.execute("DELETE FROM EMPLOYEE WHERE Ssn = '111223333'")
    print("[OK] 1-b 경계: 상사 없는 Research 직원은 이 뷰에 안 나온다(LEFT OUTER JOIN이면 5행)")

    # 1-c
    c.execute(C_SLIDE)
    assert sorted(q(c, "SELECT * FROM ProjectInfo")) == sorted(PROJECT_ROWS)
    c.execute("DROP VIEW ProjectInfo")
    c.execute(C_FIXED)
    assert sorted(q(c, "SELECT * FROM ProjectInfo")) == sorted(PROJECT_ROWS)
    assert q(c, "SELECT SUM(Hours), COUNT(*), COUNT(Hours) FROM WORKS_ON WHERE Pno = 20") == [(25.0, 3, 2)]
    print("[OK] 1-c: 6행. Reorganization의 TotalHours 25.0은 NULL인 Borg의 시간을 빼고 더한 값(사람 수는 3)")

    # 1-d
    fails(c, D_SLIDE, "already exists")
    c.execute(D_FIXED)
    assert sorted(q(c, "SELECT * FROM BusyProjectInfo")) == sorted(PROJECT_ROWS)
    assert q(c, "SELECT MIN(NumEmployees) FROM ProjectInfo") == [(2,)]
    print("[OK] 1-d: 같은 이름으로는 'already exists'. 이름을 바꾸면 6행, 1-c와 같다(가장 적은 프로젝트도 2명)")

    # 변형: 일하는 사람이 없는 프로젝트
    c.execute("INSERT INTO PROJECT VALUES ('Planning', 40, 'Houston', 1)")
    assert len(q(c, "SELECT * FROM ProjectInfo")) == 6
    full = q(c, """SELECT P.Pname, D.Dname, COUNT(W.Essn), SUM(W.Hours)
                   FROM (PROJECT AS P JOIN DEPARTMENT AS D ON D.Dnumber = P.Dnum)
                        LEFT OUTER JOIN WORKS_ON AS W ON P.Pnumber = W.Pno
                   GROUP BY P.Pnumber, P.Pname, D.Dname""")
    assert len(full) == 7 and ("Planning", "Headquarters", 0, None) in full
    assert sorted(r for r in full if r[0] != "Planning") == sorted(PROJECT_ROWS)
    print("[OK] 변형: 사람이 없는 프로젝트는 1-c 뷰에 없고, LEFT OUTER JOIN + COUNT(W.Essn)이면 (Planning, 0, NULL)로 나온다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
