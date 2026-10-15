---
layout: "note"
title: "68_aggregate-functions_verify.py"
display_title: "68_aggregate-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "68"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/aggregate-functions/"
parent_title: "집계 함수"
description: "데이터베이스 설계 · 집계 함수 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/68_aggregate-functions_verify/"
---
{% raw %}
[집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""집계 함수 검증 (SQLite).

문서: 68.집계 함수
주장:
  1. Q19: 전 직원 급여의 합 281000, 최대 55000, 최소 25000, 평균 35125.
  2. Q21 8, Q22 4, Q23 6.
  3. 문서의 물음: COUNT(Salary)는 8(같은 값도 따로 센다), NULL은 세지 않는다(COUNT(Super_ssn) = 7).
  4. AVG는 NULL이 아닌 값의 수로 나눈다: WORKS_ON.Hours는 275 / 15.
  5. 행이 하나도 없으면 COUNT는 0, 나머지는 NULL.
  6. 안쪽 질의에 쓴 COUNT: 부양가족이 둘 이상인 직원은 Smith, Wong.
  7. 급여가 가장 많은 직원의 이름은 중첩 질의로 구한다(Borg).
     SQLite는 SELECT Lname, MAX(Salary)를 받아 주지만 PostgreSQL은 거부한다(.sql 파일).
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

    # 1. Q19
    assert rows(c, "SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary) FROM EMPLOYEE") == [(281000, 55000, 25000, 35125.0)]
    print("[OK] Q19: 281000, 55000, 25000, 35125")

    # 2. Q21~Q23
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(8,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE DNO = DNUMBER AND DNAME = 'Research'") == [(4,)]
    assert rows(c, "SELECT COUNT(DISTINCT Salary) FROM EMPLOYEE") == [(6,)]
    print("[OK] Q21: 8, Q22: 4, Q23: 6")

    # 3. 문서의 물음: COUNT(Salary)와 NULL
    assert rows(c, "SELECT COUNT(Salary), COUNT(Super_ssn), COUNT(DISTINCT Super_ssn) FROM EMPLOYEE") == [(8, 7, 3)]
    assert sorted(col(c, "SELECT DISTINCT Salary FROM EMPLOYEE")) == [25000, 30000, 38000, 40000, 43000, 55000]
    print("[OK] COUNT(Salary) 8, COUNT(Super_ssn) 7, COUNT(DISTINCT Super_ssn) 3")

    # 4. AVG와 NULL
    n, k, s, a = rows(c, "SELECT COUNT(*), COUNT(Hours), SUM(Hours), AVG(Hours) FROM WORKS_ON")[0]
    assert (n, k, s) == (16, 15, 275.0) and abs(a - s / k) < 1e-9 and round(a, 2) == 18.33 and round(s / n, 2) == 17.19
    print("[OK] AVG(Hours) = 275 / 15 = 18.33 (275 / 16 = 17.19가 아니다)")

    # 5. 행이 없을 때
    assert rows(c, "SELECT COUNT(*), COUNT(Salary), SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary) FROM EMPLOYEE WHERE Dno = 9") == [(0, 0, None, None, None, None)]
    print("[OK] 빈 입력: COUNT는 0, SUM, MAX, MIN, AVG는 NULL")

    # 6. 안쪽 질의에 쓴 COUNT
    two = "SELECT Lname, Fname FROM EMPLOYEE WHERE (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2"
    assert sorted(rows(c, two)) == [("Smith", "John"), ("Wong", "Franklin")]
    print("[OK] 부양가족 둘 이상: Smith, Wong")

    # 7. 집계 함수와 보통 열을 섞을 때
    top = "SELECT Lname FROM EMPLOYEE WHERE Salary = (SELECT MAX(Salary) FROM EMPLOYEE)"
    assert col(c, top) == ["Borg"]
    assert rows(c, "SELECT Lname, MAX(Salary) FROM EMPLOYEE") == [("Borg", 55000)]      # SQLite만의 동작
    lname, cnt = rows(c, "SELECT Lname, COUNT(*) FROM EMPLOYEE")[0]
    assert cnt == 8 and lname in col(c, "SELECT Lname FROM EMPLOYEE")                   # 어느 한 행의 이름이 나온다
    print("[OK] 최고 급여자는 Borg. SQLite의 SELECT Lname, COUNT(*)는 ('%s', 8)을 낸다" % lname)

    # 카드 C2: 4번 부서
    assert rows(c, "SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary) FROM EMPLOYEE WHERE Dno = 4") == [(93000, 43000, 25000, 31000.0)]
    print("[OK] 카드 C2: 93000, 43000, 25000, 31000")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
