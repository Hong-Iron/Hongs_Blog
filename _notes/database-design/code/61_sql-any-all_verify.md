---
layout: "note"
title: "61_sql-any-all_verify.py"
display_title: "61_sql-any-all_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "61"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-any-all/"
parent_title: "ANY와 ALL"
description: "데이터베이스 설계 · ANY와 ALL 검증 코드"
permalink: "/studies/database-design/code/61_sql-any-all_verify/"
---
{% raw %}
[ANY와 ALL](/Hongs_Blog/studies/database-design/sql-any-all/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ANY와 ALL 검증 (SQLite로 바꿔 쓴 판).

문서: 61.ANY와 ALL
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.12~13, 12주차 p.4
SQLite에는 ANY와 ALL이 없다. 슬라이드 문장 그대로는 61_sql-any-all_verify.sql(PostgreSQL 16)에서 돌린다.
주장:
  1. SQLite는 > ALL, = ANY를 구문 오류로 거부한다.
  2. > ALL (5번 부서 급여)를 > (SELECT MAX ...)로 바꾸면 Wallace, Borg (p.13).
  3. > ANY를 > (SELECT MIN ...)으로 바꾸면 5명, = ANY를 IN으로 바꾼 Q4A는 {1, 2}.
  4. 바꿔 쓴 판이 원래 식과 달라지는 두 경우의 MAX 쪽 값: 빈 집합이면 0행, NULL이 섞이면 7행.
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

    # 1. SQLite에는 ANY·ALL이 없다
    err1 = fails(c, "SELECT Lname FROM EMPLOYEE WHERE Salary > ALL (SELECT Salary FROM EMPLOYEE WHERE Dno = 5)")
    err2 = fails(c, "SELECT Lname FROM EMPLOYEE WHERE Dno = ANY (SELECT Dnumber FROM DEPARTMENT)")
    assert err1 and "syntax error" in err1 and err2 and "syntax error" in err2
    print("[OK] SQLite", sqlite3.sqlite_version, ": > ALL, = ANY는 구문 오류")

    # 2. 5번 부서 급여와 > ALL의 MAX 판
    d5 = sorted(col(c, "SELECT Salary FROM EMPLOYEE WHERE Dno = 5"))
    assert d5 == [25000, 30000, 38000, 40000]
    gt_max = "SELECT Lname FROM EMPLOYEE WHERE Salary > (SELECT MAX(Salary) FROM EMPLOYEE WHERE Dno = 5)"
    assert sorted(col(c, gt_max)) == ["Borg", "Wallace"]
    print("[OK] 5번 부서 급여", d5, "-> 모두보다 많은 사람은 Borg, Wallace")

    # 3. > ANY의 MIN 판, = ANY의 IN 판
    gt_min = "SELECT Lname FROM EMPLOYEE WHERE Salary > (SELECT MIN(Salary) FROM EMPLOYEE WHERE Dno = 5)"
    assert sorted(col(c, gt_min)) == ["Borg", "Narayan", "Smith", "Wallace", "Wong"]
    q4a = """SELECT DISTINCT Pnumber FROM PROJECT
             WHERE Pnumber IN (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
                               WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith')
                OR Pnumber IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith')"""
    assert sorted(col(c, q4a)) == [1, 2]
    print("[OK] 어느 하나보다 많은 사람은 5명, = ANY 자리에 IN을 쓴 Q4A는 {1, 2}")

    # 4. 바꿔 쓴 판이 달라지는 곳
    empty = "SELECT Lname FROM EMPLOYEE WHERE Salary > (SELECT MAX(Salary) FROM EMPLOYEE WHERE Dno = 9)"
    assert rows(c, "SELECT MAX(Salary) FROM EMPLOYEE WHERE Dno = 9") == [(None,)]
    assert rows(c, empty) == []
    p20 = col(c, "SELECT Hours FROM WORKS_ON WHERE Pno = 20")
    assert sorted(h for h in p20 if h is not None) == [10.0, 15.0] and p20.count(None) == 1
    with_null = "SELECT COUNT(*) FROM WORKS_ON WHERE Hours > (SELECT MAX(Hours) FROM WORKS_ON WHERE Pno = 20)"
    assert rows(c, with_null) == [(7,)]
    print("[OK] MAX 판: 빈 집합이면 0행, NULL이 섞인 프로젝트 20이면 7행 (ALL 판의 8행, 0행과 다르다)")

    # 카드 C2의 바꿔 쓴 판
    top = "SELECT Lname FROM EMPLOYEE WHERE Salary >= (SELECT MAX(Salary) FROM EMPLOYEE)"
    assert col(c, top) == ["Borg"]
    lt = "SELECT Lname FROM EMPLOYEE WHERE Salary < (SELECT MAX(Salary) FROM EMPLOYEE WHERE Dno = 4)"
    assert sorted(col(c, lt)) == ["English", "Jabbar", "Narayan", "Smith", "Wong", "Zelaya"]
    print("[OK] 카드 C2: >= ALL은 Borg, 4번 부서의 < ANY는 6명")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
