---
layout: "note"
title: "63_sql-null_verify.py"
display_title: "63_sql-null_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "63"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-null/"
parent_title: "NULL 값과 IS NULL"
description: "데이터베이스 설계 · NULL 값과 IS NULL 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/63_sql-null_verify/"
---
{% raw %}
[NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""NULL 값과 IS NULL 검증 (SQLite).

문서: 63.NULL 값과 IS NULL
주장:
  1. Super_ssn = NULL과 Super_ssn <> NULL은 0행, IS NULL은 Borg 1행, IS NOT NULL은 7행.
  2. NULL과의 비교는 참도 거짓도 아닌 값(모름)이다. AND, OR, NOT의 값 표.
  3. Hours > 10은 8행, Hours <= 10은 7행, 합쳐도 16행이 아니라 15행이다(NULL 행 하나가 양쪽에서 빠진다).
  4. 조인에서 조인 열이 NULL인 행은 빠진다: 상사 조인은 8행이 아니라 7행.
  5. COUNT(*) 8, COUNT(Salary) 8, COUNT(DISTINCT Salary) 6, COUNT(Super_ssn) 7 (문서의 물음).
     WORKS_ON: COUNT(*) 16, COUNT(Hours) 15, SUM 275, AVG는 275 / 15.
  6. GROUP BY와 DISTINCT는 NULL끼리 한데 모은다.
  7. NOT IN 뒤의 결과에 NULL이 하나라도 있으면 0행이다.
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

    # 1. = NULL, <> NULL, IS NULL
    assert rows(c, "SELECT Lname FROM EMPLOYEE WHERE Super_ssn = NULL") == []
    assert rows(c, "SELECT Lname FROM EMPLOYEE WHERE Super_ssn <> NULL") == []
    assert rows(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE Super_ssn IS NULL") == [("James", "Borg")]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NOT NULL") == [(7,)]
    print("[OK] = NULL과 <> NULL은 0행, IS NULL은 Borg, IS NOT NULL은 7행")

    # 2. 세 값 논리 (SQLite는 참 1, 거짓 0, 모름 None으로 보여 준다)
    t = rows(c, """SELECT NULL = NULL, NULL <> NULL, 1 = NULL, NULL IS NULL,
                          NULL AND 0, NULL AND 1, NULL OR 1, NULL OR 0, NOT NULL""")[0]
    assert t == (None, None, None, 1, 0, None, 1, None, None)
    print("[OK] NULL = NULL은 모름, 모름 AND 거짓 = 거짓, 모름 OR 참 = 참, NOT 모름 = 모름")

    # 3. 조건과 그 반대가 표 전체를 덮지 못한다
    gt = rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Hours > 10")[0][0]
    le = rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Hours <= 10")[0][0]
    neg = rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE NOT (Hours > 10)")[0][0]
    assert (gt, le, neg) == (8, 7, 7) and rows(c, "SELECT COUNT(*) FROM WORKS_ON")[0][0] == 16
    assert rows(c, "SELECT Essn, Pno, Hours, Hours + 1 FROM WORKS_ON WHERE Hours IS NULL") == [("888665555", 20, None, None)]
    print("[OK] Hours > 10: 8행, Hours <= 10: 7행, 전체 16행. NULL + 1 = NULL")

    # 4. 조인에서 빠진다
    join = "SELECT COUNT(*) FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn"
    assert rows(c, join) == [(7,)]
    print("[OK] 상사 조인: 7행 (Borg가 빠진다)")

    # 5. 집계 함수와 NULL
    cnt = rows(c, "SELECT COUNT(*), COUNT(Salary), COUNT(DISTINCT Salary), COUNT(Super_ssn), COUNT(DISTINCT Super_ssn) FROM EMPLOYEE")
    assert cnt == [(8, 8, 6, 7, 3)]
    n, k, s, a = rows(c, "SELECT COUNT(*), COUNT(Hours), SUM(Hours), AVG(Hours) FROM WORKS_ON")[0]
    assert (n, k, s) == (16, 15, 275.0) and abs(a - 275 / 15) < 1e-9 and abs(a - 275 / 16) > 1
    assert rows(c, "SELECT COUNT(*), COUNT(Hours), SUM(Hours), AVG(Hours) FROM WORKS_ON WHERE Pno = 20") == [(3, 2, 25.0, 12.5)]
    print("[OK] EMPLOYEE:", cnt[0], "/ WORKS_ON: 16, 15, 275, 평균 %.2f (275/16 = %.2f이 아니다)" % (a, 275 / 16))

    # 6. GROUP BY와 DISTINCT는 NULL을 한 묶음으로 본다
    g = dict(rows(c, "SELECT Super_ssn, COUNT(*) FROM EMPLOYEE GROUP BY Super_ssn"))
    assert g == {None: 1, "333445555": 3, "888665555": 2, "987654321": 2}
    assert len(rows(c, "SELECT DISTINCT Super_ssn FROM EMPLOYEE")) == 4
    print("[OK] GROUP BY Super_ssn: NULL 묶음 1행 포함 4묶음")

    # 7. NOT IN과 NULL
    bad = "SELECT Lname FROM EMPLOYEE WHERE Ssn NOT IN (SELECT Super_ssn FROM EMPLOYEE)"
    good = bad.replace("FROM EMPLOYEE)", "FROM EMPLOYEE WHERE Super_ssn IS NOT NULL)")
    assert rows(c, bad) == []
    assert sorted(col(c, good)) == ["English", "Jabbar", "Narayan", "Smith", "Zelaya"]
    print("[OK] NOT IN: NULL이 섞이면 0행, IS NOT NULL로 걸러 내면 5명")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
