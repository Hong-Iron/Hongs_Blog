---
layout: "note"
title: "77_view-practice_p2.py"
display_title: "77_view-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-practice/"
parent_title: "뷰 연습"
description: "데이터베이스 설계 · 뷰 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/77_view-practice_p2/"
---
{% raw %}
[뷰 연습](/Hongs_Blog/studies/database-design/view-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뷰 연습의 문제 2 (a~e) 확인 (SQLite). 2-d, 2-e가 거부되는 까닭은 77_view-practice_p2.sql(PostgreSQL)에서 본다.

문서: 77.뷰 연습
확인하는 것:
  2-a. DEPT_SUMMARY는 (5, 4, 133000, 33250), (4, 3, 93000, 31000), (1, 1, 55000, 55000)이다.
  2-b. 답은 (5, 4). 기본 테이블에는 GROUP BY Dno HAVING SUM(Salary) > 100000으로 옮겨진다.
  2-c. 답은 (5, 33250). 안쪽 질의의 값(4번 부서 인원)은 3이다.
  2-d, 2-e. SQLite는 어떤 뷰든 고치지 못한다("because it is a view"). 조건에 맞는 행이 없는 2-e도 거부된다.
실행: python3 77_view-practice_p2.py
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


VIEW = """CREATE VIEW DEPT_SUMMARY (D, C, Total_s, Average_s)
AS SELECT Dno, COUNT (*), SUM (Salary), AVG (Salary)
   FROM EMPLOYEE
   GROUP BY Dno"""


def main():
    c = make()
    c.execute(VIEW)

    a = q(c, "SELECT * FROM DEPT_SUMMARY ORDER BY D DESC")
    assert a == [(5, 4, 133000, 33250.0), (4, 3, 93000, 31000.0), (1, 1, 55000, 55000.0)]
    assert sorted(a) == sorted(q(c, "SELECT Dno, COUNT(*), SUM(Salary), AVG(Salary) FROM EMPLOYEE GROUP BY Dno"))
    print("[OK] 2-a:", a)

    b = q(c, "SELECT D, C FROM DEPT_SUMMARY WHERE TOTAL_S > 100000")
    assert b == [(5, 4)]
    assert b == q(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno HAVING SUM(Salary) > 100000")
    # 조건을 WHERE에 쓰면 뜻이 달라진다: 한 사람의 급여가 100000을 넘는 직원만 남기라는 말이 된다
    assert q(c, "SELECT Dno, COUNT(*) FROM EMPLOYEE WHERE Salary > 100000 GROUP BY Dno") == []
    print("[OK] 2-b:", b, "= 기본 테이블의 GROUP BY Dno HAVING SUM(Salary) > 100000")

    assert q(c, "SELECT C FROM DEPT_SUMMARY WHERE D = 4") == [(3,)]
    cc = q(c, "SELECT D, AVERAGE_S FROM DEPT_SUMMARY WHERE C > (SELECT C FROM DEPT_SUMMARY WHERE D = 4)")
    assert cc == [(5, 33250.0)]
    assert cc == q(c, "SELECT Dno, AVG(Salary) FROM EMPLOYEE GROUP BY Dno "
                      "HAVING COUNT(*) > (SELECT COUNT(*) FROM EMPLOYEE WHERE Dno = 4)")
    print("[OK] 2-c:", cc, "(4번 부서 인원 3보다 많은 부서는 5번뿐)")

    fails(c, "UPDATE DEPT_SUMMARY SET D = 3 WHERE D = 4", "because it is a view")
    assert q(c, "SELECT COUNT(*) FROM DEPT_SUMMARY WHERE C > 4") == [(0,)]
    fails(c, "DELETE FROM DEPT_SUMMARY WHERE C > 4", "because it is a view")
    fails(c, "DELETE FROM DEPT_SUMMAR WHERE C > 4", "no such table")
    assert q(c, "SELECT * FROM DEPT_SUMMARY ORDER BY D DESC") == a
    print("[OK] 2-d, 2-e: 둘 다 거부. 2-e는 조건에 맞는 행이 0개인데도 거부된다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
