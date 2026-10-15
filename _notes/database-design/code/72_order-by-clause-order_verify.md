---
layout: "note"
title: "72_order-by-clause-order_verify.py"
display_title: "72_order-by-clause-order_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/order-by-clause-order/"
parent_title: "ORDER BY와 질의의 절 순서"
description: "데이터베이스 설계 · ORDER BY와 질의의 절 순서 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/72_order-by-clause-order_verify/"
---
{% raw %}
[ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ORDER BY와 질의의 절 순서 검증 (SQLite).

문서: 72.ORDER BY와 질의의 절 순서
주장:
  1. Q15: 16행이 부서 이름, 성, 이름 순으로 선다. 첫 행은 Administration의 Jabbar, 끝은 Research의 Wong.
     세 기준이 모두 같은 행(한 직원의 여러 프로젝트)끼리의 순서는 정해져 있지 않다.
  2. DESC를 붙이면 그 기준만 큰 것부터다.
  3. 여섯 절을 모두 쓴 예: 남자 직원만 남기고 부서로 묶어 평균이 30000을 넘는 묶음을 평균이 큰 순으로 -> (1, 1, 55000), (5, 3, 36000).
  4. SELECT에서 붙인 이름은 ORDER BY에서 쓸 수 있다. WHERE와 HAVING에서는 SQLite만 받아 준다(PostgreSQL은 오류, .sql 파일).
  5. NULL이 서는 자리: SQLite는 오름차순에서 맨 앞이다(PostgreSQL은 맨 뒤, .sql 파일).
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

Q15 = """SELECT D.Dname, E.Lname, E.Fname, P.Pname
FROM DEPARTMENT AS D, EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P
WHERE D.Dnumber = E.Dno AND E.Ssn = W.Essn AND W.Pno = P.Pnumber
ORDER BY D.Dname, E.Lname, E.Fname"""


def main():
    c = make()

    # 1. Q15
    r = rows(c, Q15)
    keys = [x[:3] for x in r]
    assert len(r) == 16 and keys == sorted(keys)
    assert r[0][:3] == ("Administration", "Jabbar", "Ahmad") and r[-1][:3] == ("Research", "Wong", "Franklin")
    assert keys[6] == ("Headquarters", "Borg", "James") and r[6][3] == "Reorganization"
    people = []
    for k in keys:
        if k not in people:
            people.append(k)
    assert [p[1] for p in people] == ["Jabbar", "Wallace", "Zelaya", "Borg", "English", "Narayan", "Smith", "Wong"]
    assert sorted(x[3] for x in r if x[1] == "English") == ["ProductX", "ProductY"]
    print("[OK] Q15: 16행, 직원 순서", [p[1] for p in people])

    # 2. DESC
    desc = rows(c, Q15.replace("ORDER BY D.Dname, E.Lname, E.Fname", "ORDER BY D.Dname DESC, E.Lname ASC, E.Fname ASC"))
    assert [x[0] for x in desc[:9]] == ["Research"] * 9 and desc[9][0] == "Headquarters" and desc[-1][0] == "Administration"
    assert desc[0][1] == "English" and desc[8][1] == "Wong"
    by = rows(c, "SELECT Dno, Lname, Salary FROM EMPLOYEE ORDER BY Dno ASC, Salary DESC")
    assert by[:2] == [(1, "Borg", 55000), (4, "Wallace", 43000)] and sorted(by[2:4]) == [(4, "Jabbar", 25000), (4, "Zelaya", 25000)]
    assert by[4:] == [(5, "Wong", 40000), (5, "Narayan", 38000), (5, "Smith", 30000), (5, "English", 25000)]
    print("[OK] DESC: Research 9행이 먼저. ORDER BY Dno ASC, Salary DESC의 앞 두 행은 Borg, Wallace")

    # 3. 여섯 절을 모두 쓴 예
    six = """SELECT Dno, COUNT(*) AS N, AVG(Salary) AS Avg_sal
             FROM EMPLOYEE
             WHERE Sex = 'M'
             GROUP BY Dno
             HAVING AVG(Salary) > 30000
             ORDER BY Avg_sal DESC"""
    assert sorted(rows(c, "SELECT Lname, Dno, Salary FROM EMPLOYEE WHERE Sex = 'M'")) == [
        ("Borg", 1, 55000), ("Jabbar", 4, 25000), ("Narayan", 5, 38000), ("Smith", 5, 30000), ("Wong", 5, 40000)]
    assert sorted(rows(c, "SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE WHERE Sex = 'M' GROUP BY Dno")) == [
        (1, 1, 55000.0), (4, 1, 25000.0), (5, 3, 36000.0)]
    assert rows(c, six) == [(1, 1, 55000.0), (5, 3, 36000.0)]
    print("[OK] 여섯 절: 5행 -> 3묶음 -> 2묶음 -> (1, 1, 55000), (5, 3, 36000)")

    # 4. SELECT에서 붙인 이름을 쓸 수 있는 절
    assert rows(c, "SELECT Lname, Salary * 12 AS Yearly FROM EMPLOYEE ORDER BY Yearly DESC LIMIT 2") == [("Borg", 660000), ("Wallace", 516000)]
    lenient = rows(c, "SELECT Lname, Salary * 12 AS Yearly FROM EMPLOYEE WHERE Yearly > 400000")
    assert sorted(x[0] for x in lenient) == ["Borg", "Narayan", "Wallace", "Wong"]            # SQLite만 받는다
    assert sorted(rows(c, "SELECT Dno, COUNT(*) AS N FROM EMPLOYEE GROUP BY Dno HAVING N > 2")) == [(4, 3), (5, 4)]
    print("[OK] ORDER BY Yearly는 된다. SQLite는 WHERE Yearly, HAVING N도 받는다")

    # 5. NULL이 서는 자리
    asc = col(c, "SELECT Lname FROM EMPLOYEE ORDER BY Super_ssn, Lname")
    dsc = col(c, "SELECT Lname FROM EMPLOYEE ORDER BY Super_ssn DESC, Lname")
    assert asc[0] == "Borg" and dsc[-1] == "Borg"
    assert asc == ["Borg", "English", "Narayan", "Smith", "Wallace", "Wong", "Jabbar", "Zelaya"]
    print("[OK] SQLite: NULL(Borg)이 오름차순에서 맨 앞, 내림차순에서 맨 뒤")

    # ORDER BY가 없으면 순서를 믿을 수 없다: 같은 묶음 질의의 행 집합만 같다
    assert sorted(rows(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno")) == [(1, 1), (4, 3), (5, 4)]

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
