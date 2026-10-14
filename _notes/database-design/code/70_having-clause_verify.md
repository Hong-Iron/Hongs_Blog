---
layout: "note"
title: "70_having-clause_verify.py"
display_title: "70_having-clause_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/having-clause/"
parent_title: "HAVING"
description: "데이터베이스 설계 · HAVING 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/70_having-clause_verify/"
---
{% raw %}
[HAVING](/Hongs_Blog/studies/database-design/having-clause/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""HAVING 검증 (SQLite).

문서: 70.HAVING
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.33~34, 12주차 p.11
주장:
  1. Q26(p.34): 일하는 직원이 둘을 넘는 프로젝트는 ProductY, Computerization, Reorganization, Newbenefits(모두 3명).
     ProductX와 ProductZ(2명씩)가 빠진다 (p.33의 빨간 테두리).
  2. 묶음마다 구한 다른 값으로도 거른다: 시간 합이 40을 넘는 프로젝트는 1, 3, 10, 30.
  3. 집계 함수를 WHERE에 쓰면 오류다.
  4. HAVING에는 묶는 열도 쓸 수 있다. 묶지 않은 열은 SQLite만 받는다(PostgreSQL은 거부, .sql 파일).
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

    # 1. Q26
    q25 = "SELECT Pnumber, Pname, COUNT(*) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno GROUP BY Pnumber, Pname"
    q26 = q25 + " HAVING COUNT(*) > 2"
    assert sorted(rows(c, q26)) == [(2, "ProductY", 3), (10, "Computerization", 3), (20, "Reorganization", 3), (30, "Newbenefits", 3)]
    dropped = sorted(set(rows(c, q25)) - set(rows(c, q26)))
    assert dropped == [(1, "ProductX", 2), (3, "ProductZ", 2)]
    print("[OK] Q26: 네 프로젝트(3명씩). 빠진 것은 ProductX, ProductZ(2명씩)")

    # 2. 다른 집계 값으로 거르기
    total = "SELECT Pno, SUM(Hours) FROM WORKS_ON GROUP BY Pno"
    assert sorted(rows(c, total)) == [(1, 52.5), (2, 37.5), (3, 50.0), (10, 55.0), (20, 25.0), (30, 55.0)]
    assert sorted(rows(c, total + " HAVING SUM(Hours) > 40")) == [(1, 52.5), (3, 50.0), (10, 55.0), (30, 55.0)]
    print("[OK] 시간 합 > 40: 프로젝트 1, 3, 10, 30")

    # 3. WHERE에는 집계 함수를 못 쓴다
    err = fails(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE WHERE COUNT(*) > 2 GROUP BY Dno")
    assert err and "misuse of aggregate" in err
    print("[OK] WHERE COUNT(*) > 2:", err)

    # 4. HAVING에 쓰는 열
    assert sorted(rows(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno HAVING Dno > 1")) == [(4, 3), (5, 4)]
    lenient = rows(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno HAVING Salary > 30000")
    assert all(r in [(1, 1), (4, 3), (5, 4)] for r in lenient)       # SQLite는 묶음의 아무 한 행으로 판단한다
    print("[OK] HAVING Dno > 1: (4, 3), (5, 4). SQLite의 HAVING Salary > 30000:", lenient)

    # HAVING만 쓰면 표 전체가 한 묶음
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE HAVING COUNT(*) > 5") == [(8,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE HAVING COUNT(*) > 10") == []
    print("[OK] GROUP BY 없는 HAVING: 표 전체가 한 묶음")

    # 카드 C2
    assert sorted(rows(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno HAVING COUNT(*) >= 3")) == [(4, 3), (5, 4)]
    print("[OK] 카드 C2: (5, 4), (4, 3)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
