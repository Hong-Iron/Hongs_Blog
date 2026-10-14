---
layout: "note"
title: "70_group-by-query-ladder_p4.py"
display_title: "70_group-by-query-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/group-by-query-ladder/"
parent_title: "GROUP BY 질의 쓰기 예제 사다리"
description: "데이터베이스 설계 · GROUP BY 질의 쓰기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/70_group-by-query-ladder_p4/"
---
{% raw %}
[GROUP BY 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/group-by-query-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""GROUP BY 질의 쓰기 예제 사다리의 문제 1~4 확인. SQLite, COMPANY.

문서: 70.GROUP BY 질의 쓰기 예제 사다리
출처: 문제 1은 11주차 슬라이드 11-2_SQL-DML-Complex p.31의 Q24. 문제 2~4는 이 문서에서 만들었다.
확인하는 것:
  문제 1 (Q24). (5, 4, 33250), (4, 3, 31000), (1, 1, 55000).
  문제 2. 성별마다 (M, 5, 55000), (F, 3, 43000).
  문제 3. 시간 합이 40을 넘는 프로젝트 넷: ProductX 52.5, ProductZ 50.0, Computerization 55.0, Newbenefits 55.0.
  문제 4. 급여 30000 이상인 직원이 2명 이상인 부서는 (Research, 3). WHERE를 빼면 (Research, 4), (Administration, 3).
실행: python3 70_group-by-query-ladder_p4.py
"""
import sqlite3

# COMPANY 스키마와 상태 (슬라이드 6-2 p.21 = 13 p.16, 28. Elmasri 그림 5.6)
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


def main():
    c = make()

    # 문제 1 (Q24)
    p1 = q(c, "SELECT Dno, COUNT (*), AVG (Salary) FROM EMPLOYEE GROUP BY Dno")
    assert sorted(p1, reverse=True) == [(5, 4, 33250.0), (4, 3, 31000.0), (1, 1, 55000.0)]
    print("[OK] 문제 1 (Q24):", sorted(p1, reverse=True))

    # 문제 2
    p2 = q(c, "SELECT Sex, COUNT(*), MAX(Salary) FROM EMPLOYEE GROUP BY Sex")
    assert sorted(p2, reverse=True) == [("M", 5, 55000), ("F", 3, 43000)]
    print("[OK] 문제 2:", sorted(p2, reverse=True))

    # 문제 3
    every = q(c, """SELECT Pname, COUNT(*), SUM(Hours) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno
                    GROUP BY Pnumber, Pname""")
    assert sorted(every) == sorted([("ProductX", 2, 52.5), ("ProductY", 3, 37.5), ("ProductZ", 2, 50.0),
                                    ("Computerization", 3, 55.0), ("Reorganization", 3, 25.0), ("Newbenefits", 3, 55.0)])
    p3 = q(c, """SELECT Pname, COUNT(*), SUM(Hours) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno
                 GROUP BY Pnumber, Pname HAVING SUM(Hours) > 40""")
    assert sorted(p3) == sorted([("ProductX", 2, 52.5), ("ProductZ", 2, 50.0), ("Computerization", 3, 55.0),
                                 ("Newbenefits", 3, 55.0)])
    # 조건을 WHERE Hours > 40으로 쓰면 뜻이 달라진다: 한 사람이 40시간 넘게 일한 행만 남는다(그런 행은 없다)
    assert q(c, """SELECT Pname, COUNT(*), SUM(Hours) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno AND Hours > 40
                   GROUP BY Pnumber, Pname""") == []
    print("[OK] 문제 3: 시간 합 > 40인 프로젝트 4개", sorted(p3))

    # 문제 4
    p4 = q(c, """SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber AND Salary >= 30000
                 GROUP BY Dnumber, Dname HAVING COUNT(*) >= 2""")
    assert p4 == [("Research", 3)]
    before_having = q(c, """SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber AND Salary >= 30000
                            GROUP BY Dnumber, Dname""")
    assert sorted(before_having) == [("Administration", 1), ("Headquarters", 1), ("Research", 3)]
    no_where = q(c, """SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber
                       GROUP BY Dnumber, Dname HAVING COUNT(*) >= 2""")
    assert sorted(no_where) == [("Administration", 3), ("Research", 4)]
    fails(c, """SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber AND COUNT(*) >= 2
                GROUP BY Dnumber, Dname""", "misuse of aggregate")
    print("[OK] 문제 4:", p4, "/ WHERE를 빼면", sorted(no_where), "/ COUNT를 WHERE에 쓰면 오류")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
