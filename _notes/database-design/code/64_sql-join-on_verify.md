---
layout: "note"
title: "64_sql-join-on_verify.py"
display_title: "64_sql-join-on_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "64"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-join-on/"
parent_title: "FROM 절의 조인 (JOIN ON)"
description: "데이터베이스 설계 · FROM 절의 조인 (JOIN ON) 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/64_sql-join-on_verify/"
---
{% raw %}
[FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FROM 절의 조인 (JOIN ON) 검증 (SQLite).

문서: 64.FROM 절의 조인 (JOIN ON)
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.20~21, 12주차 p.6
주장:
  1. Q1(WHERE에 조건을 모두 적은 판)과 Q1A(JOIN ON 판)의 결과가 같다: Research 부서 직원 4명 (p.20).
  2. 이어 붙인 표는 8행 14열이고, EMPLOYEE의 열 10개 뒤에 DEPARTMENT의 열 4개가 온다.
     맞춘 두 열 Dno와 Dnumber가 둘 다 남는다 (p.21, 12 p.6).
  3. 조인을 겹쳐 쓴 판(세 표)은 WHERE에 적은 Q2와 같은 2행을 낸다.
  4. 내부 조인에서는 행을 고르는 조건을 ON에 옮겨도 결과가 같다.
"""
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7, 슬라이드 6-2 p.20~21).
# 파일끼리 import하지 않으려고 통째로 넣었다.
# - 서로 가리키는 외래 키(EMPLOYEE.Dno <-> DEPARTMENT.Mgr_ssn)는 커밋할 때 검사하도록 미뤘다.
# - 슬라이드의 DDL(9 p.18)은 Hours가 NOT NULL이지만 상태에 (888665555, 20, NULL)이 있어 NOT NULL을 뺐다.
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
  Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
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
    """COMPANY 데이터베이스를 메모리에 새로 만든다."""
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


def rows(c, sql):
    """질의 결과를 행의 목록으로 돌려준다."""
    return c.execute(sql).fetchall()


def col(c, sql):
    """결과의 첫 열만 목록으로 돌려준다."""
    return [r[0] for r in c.execute(sql).fetchall()]


def cols(c, sql):
    """결과 표의 열 이름을 차례대로 돌려준다."""
    return [d[0] for d in c.execute(sql).description]


def fails(c, sql):
    """질의가 오류를 내면 오류 글을, 안 내면 None을 돌려준다."""
    try:
        c.execute(sql).fetchall()
    except sqlite3.Error as e:
        return str(e)
    return None


def main():
    c = make()

    # 1. Q1과 Q1A
    q1 = "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno"
    q1a = "SELECT Fname, Lname, Address FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber) WHERE Dname = 'Research'"
    assert rows(c, q1) == rows(c, q1a)
    assert [r[1] for r in rows(c, q1a)] == ["Smith", "Wong", "Narayan", "English"]
    print("[OK] Q1 = Q1A: Smith, Wong, Narayan, English")

    # 2. 이어 붙인 표
    star = "SELECT * FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)"
    names = cols(c, star)
    assert names == ["Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary", "Super_ssn", "Dno",
                     "Dname", "Dnumber", "Mgr_ssn", "Mgr_start_date"]
    table = rows(c, star)
    assert len(table) == 8 and all(r[9] == r[11] for r in table)
    short = rows(c, "SELECT Lname, Dno, Dname, Dnumber, Mgr_ssn FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)")
    assert short == [("Smith", 5, "Research", 5, "333445555"), ("Wong", 5, "Research", 5, "333445555"),
                     ("Zelaya", 4, "Administration", 4, "987654321"), ("Wallace", 4, "Administration", 4, "987654321"),
                     ("Narayan", 5, "Research", 5, "333445555"), ("English", 5, "Research", 5, "333445555"),
                     ("Jabbar", 4, "Administration", 4, "987654321"), ("Borg", 1, "Headquarters", 1, "888665555")]
    print("[OK] 이어 붙인 표: 8행 14열, Dno와 Dnumber가 둘 다 남는다")

    # 3. 조인을 겹쳐 쓰기 (Q2)
    q2 = """SELECT Pnumber, Dnum, Lname, Address, Bdate FROM PROJECT, DEPARTMENT, EMPLOYEE
            WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Plocation = 'Stafford'"""
    q2a = """SELECT Pnumber, Dnum, Lname, Address, Bdate
             FROM ((PROJECT JOIN DEPARTMENT ON Dnum = Dnumber) JOIN EMPLOYEE ON Mgr_ssn = Ssn)
             WHERE Plocation = 'Stafford'"""
    assert sorted(rows(c, q2)) == sorted(rows(c, q2a))
    assert sorted(r[:3] for r in rows(c, q2a)) == [(10, 4, "Wallace"), (30, 4, "Wallace")]
    print("[OK] 세 표를 이은 판: (10, 4, Wallace), (30, 4, Wallace)")

    # 4. 내부 조인에서는 조건을 ON으로 옮겨도 같다
    moved = "SELECT Fname, Lname, Address FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber AND Dname = 'Research')"
    assert rows(c, moved) == rows(c, q1a)
    print("[OK] 내부 조인: 고르는 조건을 ON에 적어도 같은 4행")

    # 카드 C1: 상사 조인을 JOIN ON으로
    old = "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn"
    new = "SELECT E.Lname, S.Lname FROM (EMPLOYEE AS E JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)"
    assert rows(c, old) == rows(c, new) and len(rows(c, new)) == 7
    # 카드 C2: PROJECT JOIN WORKS_ON
    pw = "SELECT * FROM (PROJECT JOIN WORKS_ON ON Pnumber = Pno)"
    assert cols(c, pw) == ["Pname", "Pnumber", "Plocation", "Dnum", "Essn", "Pno", "Hours"] and len(rows(c, pw)) == 16
    print("[OK] 카드 C1: 7행. 카드 C2: 16행 7열 (Pname, Pnumber, Plocation, Dnum, Essn, Pno, Hours)")
    # 카드 C3: 잇는 조건은 ON에, 고르는 조건은 WHERE에
    c3 = """SELECT Lname FROM ((PROJECT JOIN WORKS_ON ON Pnumber = Pno) JOIN EMPLOYEE ON Essn = Ssn)
            WHERE Dnum = 5 AND Hours > 20"""
    assert sorted(col(c, c3)) == ["Narayan", "Smith"]
    print("[OK] 카드 C3: Smith, Narayan")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
