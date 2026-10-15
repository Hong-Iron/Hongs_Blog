---
layout: "note"
title: "67_inner-vs-outer-join_verify.py"
display_title: "67_inner-vs-outer-join_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "67"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/inner-vs-outer-join/"
parent_title: "내부 조인과 외부 조인 비교"
description: "데이터베이스 설계 · 내부 조인과 외부 조인 비교 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/67_inner-vs-outer-join_verify/"
---
{% raw %}
[내부 조인과 외부 조인 비교](/Hongs_Blog/studies/database-design/inner-vs-outer-join/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""내부 조인과 외부 조인 비교 검증 (SQLite).

문서: 67.내부 조인과 외부 조인 비교
주장 (카드의 답):
  C1 (a) 프로젝트와 일하는 직원을 내부 조인하면 16행. (b) 모든 직원과 상사 이름은 LEFT OUTER JOIN으로 8행, 내부 조인이면 7행.
  C2 (c) 부양가족이 없는 직원은 LEFT OUTER JOIN + IS NULL로 5명.
     (d) 직원별 부양가족 수는 LEFT OUTER JOIN + COUNT(D.Essn)으로 8행(0이 다섯), 내부 조인이면 3행.
  C3 조건 없이 두 표를 적으면 8 x 3 = 24행, 자연 조인은 이름이 같은 열로 5행.
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

    # C1
    a = "SELECT P.Pname, E.Lname FROM (PROJECT AS P JOIN WORKS_ON AS W ON P.Pnumber = W.Pno) JOIN EMPLOYEE AS E ON W.Essn = E.Ssn"
    assert len(rows(c, a)) == 16
    a_left = a.replace("PROJECT AS P JOIN", "PROJECT AS P LEFT OUTER JOIN").replace(") JOIN EMPLOYEE", ") LEFT OUTER JOIN EMPLOYEE")
    assert len(rows(c, a_left)) == 16                        # 모든 프로젝트에 일하는 사람이 있어 외부 조인도 같다
    b_inner = "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn"
    b_left = b_inner.replace(" JOIN ", " LEFT OUTER JOIN ")
    assert len(rows(c, b_inner)) == 7 and len(rows(c, b_left)) == 8
    swapped = "SELECT E.Lname, S.Lname FROM EMPLOYEE AS S JOIN EMPLOYEE AS E ON E.Super_ssn = S.Ssn"
    assert sorted(rows(c, swapped)) == sorted(rows(c, b_inner))      # 내부 조인은 표의 순서를 바꿔도 같은 행
    print("[OK] C1: (a) 내부 16행, (b) 내부 7행 / LEFT OUTER 8행")

    # C2
    cq = "SELECT E.Lname FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn WHERE D.Essn IS NULL"
    assert sorted(col(c, cq)) == ["Borg", "English", "Jabbar", "Narayan", "Zelaya"]
    d_left = """SELECT E.Lname, COUNT(D.Essn) FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn
                GROUP BY E.Ssn, E.Lname"""
    d_inner = d_left.replace("LEFT OUTER JOIN", "JOIN")
    left = dict(rows(c, d_left))
    assert left == {"Smith": 3, "Wong": 3, "Wallace": 1, "Zelaya": 0, "Narayan": 0, "English": 0, "Jabbar": 0, "Borg": 0}
    assert dict(rows(c, d_inner)) == {"Smith": 3, "Wong": 3, "Wallace": 1}
    print("[OK] C2: (c) 5명, (d) LEFT OUTER 8행(0이 다섯) / 내부 3행")

    # C3
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, DEPARTMENT") == [(24,)]
    assert rows(c, "SELECT COUNT(*) FROM DEPARTMENT NATURAL JOIN DEPT_LOCATIONS") == [(5,)]
    print("[OK] C3: 카티션 곱 24행, 자연 조인 5행")

    # 표: 직원-상사 조인의 행 수
    n = {}
    for kind in ("JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN"):
        n[kind] = rows(c, "SELECT COUNT(*) FROM EMPLOYEE AS E " + kind + " EMPLOYEE AS S ON E.Super_ssn = S.Ssn")[0][0]
    assert n == {"JOIN": 7, "LEFT OUTER JOIN": 8, "RIGHT OUTER JOIN": 12, "FULL OUTER JOIN": 13}
    print("[OK] 직원-상사:", n)

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
