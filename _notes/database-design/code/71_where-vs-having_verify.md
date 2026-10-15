---
layout: "note"
title: "71_where-vs-having_verify.py"
display_title: "71_where-vs-having_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "71"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/where-vs-having/"
parent_title: "WHERE와 HAVING 비교"
description: "데이터베이스 설계 · WHERE와 HAVING 비교 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/71_where-vs-having_verify/"
---
{% raw %}
[WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""WHERE와 HAVING 비교 검증 (SQLite).

문서: 71.WHERE와 HAVING 비교
주장:
  1. 같은 "30000 초과"라도 WHERE에 쓰면 행을 거르고 HAVING에 쓰면 묶음을 거른다.
     WHERE Salary > 30000: (5, 2), (4, 1), (1, 1). HAVING AVG(Salary) > 30000: (5, 4), (4, 3), (1, 1).
  2. 틀리기 쉬운 답: 평균 급여로 거르는 질의의 WHERE에 Sex = 'M'만 더한 질의는 2행(Research 3, Headquarters 1)이다.
     남자만의 평균이 Research 36000, Administration 25000, Headquarters 55000이라 Administration이 빠진다.
     그려진 결과 3행(3, 1, 1)은 평균을 전 직원으로 내는 중첩 질의의 결과다.
  3. 둘을 함께 쓰는 예: 20시간 이상 일하는 행만 남기고, 그런 행이 둘 이상인 프로젝트 -> (1, 2), (30, 2).
"""
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7).
# 파일끼리 import하지 않으려고 통째로 넣었다.
# - 서로 가리키는 외래 키(EMPLOYEE.Dno <-> DEPARTMENT.Mgr_ssn)는 커밋할 때 검사하도록 미뤘다.
# - 상태에 (888665555, 20, NULL)이 있어 Hours에는 NOT NULL을 걸지 않았다.
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

    # 1. 행을 거르기와 묶음을 거르기
    w_ = "SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE WHERE Salary > 30000 GROUP BY Dno"
    h_ = "SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000"
    assert sorted(rows(c, w_), reverse=True) == [(5, 2, 39000.0), (4, 1, 43000.0), (1, 1, 55000.0)]
    assert sorted(rows(c, h_), reverse=True) == [(5, 4, 33250.0), (4, 3, 31000.0), (1, 1, 55000.0)]
    h2 = h_.replace("> 30000", "> 32000")
    assert sorted(rows(c, h2), reverse=True) == [(5, 4, 33250.0), (1, 1, 55000.0)]
    print("[OK] WHERE: (5, 2), (4, 1), (1, 1) / HAVING: (5, 4), (4, 3), (1, 1) / 문턱 32000이면 4번 부서가 빠진다")

    # 2. 틀리기 쉬운 답(WHERE에 Sex = 'M'만 더함)과 고친 답
    q11 = "SELECT Dname, COUNT(*) AS Number_of_employees FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber GROUP BY Dno, Dname HAVING AVG(Salary) > 30000"
    assert sorted(rows(c, q11)) == [("Administration", 3), ("Headquarters", 1), ("Research", 4)]
    slide = q11.replace("WHERE Dno = Dnumber", "WHERE Dno = Dnumber AND Sex = 'M'")
    assert sorted(rows(c, slide)) == [("Headquarters", 1), ("Research", 3)]
    male = "SELECT Dname, COUNT(*), AVG(Salary) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno, Dname"
    assert sorted(rows(c, male)) == [("Administration", 1, 25000.0), ("Headquarters", 1, 55000.0), ("Research", 3, 36000.0)]
    nested = """SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT
                WHERE Dno = Dnumber AND Sex = 'M'
                  AND Dno IN (SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000)
                GROUP BY Dno, Dname"""
    assert sorted(rows(c, nested)) == [("Administration", 1), ("Headquarters", 1), ("Research", 3)]
    print("[OK] Q1-2: 적힌 질의는 2행, 중첩 질의는 3행 (3, 1, 1)")

    # 3. 둘을 함께
    both = "SELECT Pno, COUNT(*) FROM WORKS_ON WHERE Hours >= 20 GROUP BY Pno HAVING COUNT(*) >= 2"
    assert sorted(rows(c, both)) == [(1, 2), (30, 2)]
    assert sorted(rows(c, "SELECT Pno, COUNT(*) FROM WORKS_ON WHERE Hours >= 20 GROUP BY Pno")) == [(1, 2), (2, 1), (3, 1), (10, 1), (30, 2)]
    assert sorted(rows(c, "SELECT Pno, COUNT(*) FROM WORKS_ON GROUP BY Pno HAVING COUNT(*) >= 2")) == [(1, 2), (2, 3), (3, 2), (10, 3), (20, 3), (30, 3)]
    print("[OK] WHERE Hours >= 20 + HAVING COUNT(*) >= 2: (1, 2), (30, 2)")

    # 카드 C3: 5번 부서 프로젝트 가운데 세 명 이상이 일하는 것
    c3 = "SELECT Pnumber, Pname, COUNT(*) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno AND Dnum = 5 GROUP BY Pnumber, Pname HAVING COUNT(*) > 2"
    assert rows(c, c3) == [(2, "ProductY", 3)]
    print("[OK] 카드: 5번 부서 프로젝트 가운데 둘을 넘는 것은 ProductY")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
