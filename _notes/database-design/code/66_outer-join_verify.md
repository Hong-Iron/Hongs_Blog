---
layout: "note"
title: "66_outer-join_verify.py"
display_title: "66_outer-join_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "66"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/outer-join/"
parent_title: "외부 조인"
description: "데이터베이스 설계 · 외부 조인 검증 코드"
permalink: "/studies/database-design/code/66_outer-join_verify/"
---
{% raw %}
[외부 조인](/Hongs_Blog/studies/database-design/outer-join/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외부 조인 검증 (SQLite).

문서: 66.외부 조인
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.24~26, 12주차 p.8~9, 14주차 풀이 p.3~5, 8
RIGHT, FULL OUTER JOIN은 SQLite 3.39부터 돈다. 같은 값을 66_outer-join_verify.sql(PostgreSQL 16)에서도 확인한다.
주장:
  1. 직원-상사 내부 조인은 7행, LEFT OUTER JOIN은 (Borg, NULL)이 더해져 8행 (p.24~25).
  2. RIGHT OUTER JOIN은 12행(부하가 없는 다섯 명이 왼쪽이 NULL인 채 남는다), FULL OUTER JOIN은 13행.
  3. 짝 없는 행만 고르기(p.26): LEFT + IS NULL은 Borg, RIGHT + IS NULL은 5명.
     직원 LEFT OUTER JOIN 부양가족은 12행이고, 짝 없는 행만 고르면 Q6과 같은 5명.
  4. 빈칸으로 채운 행도 한 줄이다: COUNT(*) 8, COUNT(S.Ssn) 7. 직원마다 세면 COUNT(*)는 1, COUNT(D.Essn)은 0.
  5. 오른쪽 표에 거는 조건을 WHERE에 두면 3행, ON에 두면 8행.
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

SEL = "SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name FROM "
ON = " ON E.Super_ssn = S.Ssn)"
INNER7 = [("Smith", "Wong"), ("Wong", "Borg"), ("Zelaya", "Wallace"), ("Wallace", "Borg"),
          ("Narayan", "Wong"), ("English", "Wong"), ("Jabbar", "Wallace")]


def main():
    c = make()
    assert sqlite3.sqlite_version_info >= (3, 39), "RIGHT, FULL OUTER JOIN은 SQLite 3.39부터 된다"

    # 1. 내부 조인과 LEFT OUTER JOIN
    inner = rows(c, "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn")
    left = rows(c, SEL + "(EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S" + ON)
    assert inner == INNER7
    assert left == INNER7 + [("Borg", None)]
    print("[OK] 내부 7행, LEFT OUTER 8행 (Borg, NULL)")

    # 2. RIGHT, FULL
    right = rows(c, SEL + "(EMPLOYEE AS E RIGHT OUTER JOIN EMPLOYEE AS S" + ON)
    full = rows(c, SEL + "(EMPLOYEE AS E FULL OUTER JOIN EMPLOYEE AS S" + ON)
    no_sub = [("English",), ("Jabbar",), ("Narayan",), ("Smith",), ("Zelaya",)]
    assert len(right) == 12 and sorted((s,) for e, s in right if e is None) == no_sub
    assert len(full) == 13 and sorted(full, key=str) == sorted(left + [(None, s[0]) for s in no_sub], key=str)
    print("[OK] RIGHT OUTER 12행, FULL OUTER 13행")

    # 3. 짝 없는 행만 고르기
    la = "SELECT E.Lname FROM EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn WHERE S.Ssn IS NULL"
    ra = "SELECT S.Lname FROM EMPLOYEE AS E RIGHT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn WHERE E.Ssn IS NULL"
    assert col(c, la) == ["Borg"] and sorted(rows(c, ra)) == no_sub
    ed = "FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn"
    assert len(rows(c, "SELECT E.Lname, D.Dependent_name " + ed)) == 12
    anti = sorted(col(c, "SELECT E.Lname " + ed + " WHERE D.Essn IS NULL"))
    q6 = sorted(col(c, "SELECT Lname FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)"))
    assert anti == q6 == ["Borg", "English", "Jabbar", "Narayan", "Zelaya"]
    fa = "SELECT COUNT(*) FROM EMPLOYEE AS E FULL OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn WHERE E.Ssn IS NULL OR S.Ssn IS NULL"
    assert rows(c, fa) == [(6,)]
    print("[OK] 짝 없는 행: 상사 없는 Borg, 부하 없는 5명, 부양가족 없는 5명(Q6과 같다), FULL에서 짝 없는 6행")

    # 4. COUNT(*)와 COUNT(열)
    assert rows(c, "SELECT COUNT(*), COUNT(S.Ssn) FROM EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn") == [(8, 7)]
    per = rows(c, "SELECT E.Lname, COUNT(*), COUNT(D.Essn) " + ed + " GROUP BY E.Ssn, E.Lname ORDER BY E.Lname")
    assert per == [("Borg", 1, 0), ("English", 1, 0), ("Jabbar", 1, 0), ("Narayan", 1, 0),
                   ("Smith", 3, 3), ("Wallace", 1, 1), ("Wong", 3, 3), ("Zelaya", 1, 0)]
    inner_per = rows(c, "SELECT E.Lname, COUNT(*) FROM EMPLOYEE AS E JOIN DEPENDENT AS D ON E.Ssn = D.Essn GROUP BY E.Ssn, E.Lname ORDER BY E.Lname")
    assert inner_per == [("Smith", 3), ("Wallace", 1), ("Wong", 3)]
    left_col = rows(c, "SELECT E.Lname, COUNT(*), COUNT(E.Ssn) " + ed + " GROUP BY E.Ssn, E.Lname")
    assert all(n == k for _, n, k in left_col)               # 왼쪽 표의 열을 세면 COUNT(*)와 같아진다
    print("[OK] COUNT(*) 8, COUNT(S.Ssn) 7. 직원별:", per)

    # 5. 조건을 ON에 둘 때와 WHERE에 둘 때
    in_where = rows(c, "SELECT E.Lname, D.Dependent_name " + ed + " WHERE D.Relationship = 'Spouse'")
    in_on = rows(c, "SELECT E.Lname, D.Dependent_name " + ed + " AND D.Relationship = 'Spouse'")
    assert sorted(in_where) == [("Smith", "Elizabeth"), ("Wallace", "Abner"), ("Wong", "Joy")]
    assert len(in_on) == 8 and sorted(e for e, d in in_on if d is None) == ["Borg", "English", "Jabbar", "Narayan", "Zelaya"]
    print("[OK] 배우자 조건: WHERE에 두면 3행, ON에 두면 8행")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
