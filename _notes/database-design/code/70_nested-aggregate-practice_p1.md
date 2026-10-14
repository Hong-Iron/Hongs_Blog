---
layout: "note"
title: "70_nested-aggregate-practice_p1.py"
display_title: "70_nested-aggregate-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/nested-aggregate-practice/"
parent_title: "중첩 질의·집계 연습"
description: "데이터베이스 설계 · 중첩 질의·집계 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/70_nested-aggregate-practice_p1/"
---
{% raw %}
[중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중첩 질의·집계 연습 p1: 부양가족이 있는 관리자 (SQLite).

문서: 70.중첩 질의·집계 연습의 문제 p1
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.17 (연습 1), 풀이 10-11-SQL-Solutions p.24
확인: 풀이의 질의(EXISTS 둘)는 Wong, Wallace를 낸다. IN 둘로 쓴 판과 조인으로 쓴 판도 같다.
      변형(부양가족이 없는 관리자)은 Borg다.
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
    slide = """SELECT Fname, Lname FROM EMPLOYEE
               WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)
                 AND EXISTS (SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn)"""
    assert sorted(rows(c, slide)) == [("Franklin", "Wong"), ("Jennifer", "Wallace")]
    print("[OK] 풀이(EXISTS 둘): Franklin Wong, Jennifer Wallace")

    # 하위목표별 중간 결과
    assert sorted(col(c, "SELECT DISTINCT Essn FROM DEPENDENT")) == ["123456789", "333445555", "987654321"]
    assert sorted(col(c, "SELECT Mgr_ssn FROM DEPARTMENT")) == ["333445555", "888665555", "987654321"]
    print("[OK] 부양가족이 있는 직원 3명, 관리자 3명, 둘 다인 사람 2명")

    with_in = """SELECT Fname, Lname FROM EMPLOYEE
                 WHERE Ssn IN (SELECT Essn FROM DEPENDENT) AND Ssn IN (SELECT Mgr_ssn FROM DEPARTMENT)"""
    with_join = """SELECT DISTINCT E.Fname, E.Lname
                   FROM (EMPLOYEE AS E JOIN DEPARTMENT AS D ON E.Ssn = D.Mgr_ssn) JOIN DEPENDENT AS P ON E.Ssn = P.Essn"""
    assert sorted(rows(c, with_in)) == sorted(rows(c, with_join)) == sorted(rows(c, slide))
    no_distinct = with_join.replace("SELECT DISTINCT", "SELECT")
    assert len(rows(c, no_distinct)) == 4                    # Wong이 부양가족 수만큼 3번, Wallace 1번
    print("[OK] IN 판과 조인 판도 같다. 조인 판에서 DISTINCT를 빼면 4행")

    variant = """SELECT Fname, Lname FROM EMPLOYEE
                 WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)
                   AND EXISTS (SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn)"""
    assert rows(c, variant) == [("James", "Borg")]
    print("[OK] 변형: 부양가족이 없는 관리자는 James Borg")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
