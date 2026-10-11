---
layout: "note"
title: "75_sql-view_verify.py"
display_title: "75_sql-view_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "75"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-view/"
parent_title: "뷰"
description: "데이터베이스 설계 · 뷰 검증 코드"
permalink: "/studies/database-design/code/75_sql-view_verify/"
---
{% raw %}
[뷰](/Hongs_Blog/studies/database-design/sql-view/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뷰 검증 (SQLite). 권한 예는 75_sql-view_verify.sql(PostgreSQL)에서 확인한다.

문서: 75.뷰, 78.뷰와 기본 테이블 비교, 77.뷰 연습의 연습 0
출처: 13주차 슬라이드 13-View p.3~8, 14, 25~26, 30
주장:
  1. WORKS_ON1(p.5)은 16행, 열은 Fname, Lname, Pname, Hours(정의에 쓴 표의 열 이름 그대로)다.
  2. DEPT_INFO(p.6)는 열 이름을 따로 붙인 뷰다(안 붙이면 계산식 글자가 열 이름이 된다): (Research, 4, 133000), (Administration, 3, 93000), (Headquarters, 1, 55000).
  3. 뷰에 던진 질의(p.7)와 세 표를 직접 조인한 질의(p.30, 연습 0)의 답이 같다: Smith, English.
  4. 뷰는 저장된 표가 아니다: 카탈로그에 정의 글만 있고 저장 자리(rootpage)는 0이다.
  5. 기본 테이블을 고치면 뷰를 다시 만들지 않아도 답이 바뀐다(p.8). CREATE TABLE ... AS로 떠 둔 복사본은 안 바뀐다.
  6. DROP VIEW는 정의에 쓴 표를 건드리지 않는다(p.14).
  7. DEPT5EMP(p.25)는 5번 부서 4행만, BASIC_EMP_DATA(p.26)는 8행의 세 열만 보인다.
  8. 뷰가 기대는 기본 테이블을 지우면 SQLite는 뷰 정의만 남기고, 그 뷰는 쓸 때 오류가 난다.
실행: python3 75_sql-view_verify.py
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


VIEWS = """
CREATE VIEW WORKS_ON1
AS SELECT Fname, Lname, Pname, Hours
   FROM EMPLOYEE, PROJECT, WORKS_ON
   WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal)
AS SELECT Dname, COUNT (*), SUM (Salary)
   FROM DEPARTMENT, EMPLOYEE
   WHERE Dnumber = Dno
   GROUP BY Dname;
CREATE VIEW DEPT5EMP AS SELECT * FROM EMPLOYEE WHERE Dno = 5;
CREATE VIEW BASIC_EMP_DATA AS SELECT Fname, Lname, Address FROM EMPLOYEE;
"""


def cols(c, sql):
    return [d[0] for d in c.execute(sql).description]


def counts(c):
    return [q(c, f"SELECT COUNT(*) FROM {t}")[0][0]
            for t in ("EMPLOYEE", "DEPARTMENT", "DEPT_LOCATIONS", "PROJECT", "WORKS_ON", "DEPENDENT")]


def main():
    c = make()
    c.executescript(VIEWS)

    assert cols(c, "SELECT * FROM WORKS_ON1") == ["Fname", "Lname", "Pname", "Hours"]
    assert q(c, "SELECT COUNT(*) FROM WORKS_ON1") == [(16,)]
    assert q(c, "SELECT * FROM WORKS_ON1 WHERE Lname = 'Smith' ORDER BY Pname") == [
        ("John", "Smith", "ProductX", 32.5), ("John", "Smith", "ProductY", 7.5)]
    print("[OK] p.5: WORKS_ON1은 16행, 열 이름은 기본 테이블 것 그대로")

    assert cols(c, "SELECT * FROM DEPT_INFO") == ["Dept_name", "No_of_emps", "Total_sal"]
    assert q(c, "SELECT * FROM DEPT_INFO ORDER BY No_of_emps DESC") == [
        ("Research", 4, 133000), ("Administration", 3, 93000), ("Headquarters", 1, 55000)]
    print("[OK] p.6: DEPT_INFO =", q(c, "SELECT * FROM DEPT_INFO ORDER BY No_of_emps DESC"))

    c.execute("CREATE VIEW DEPT_INFO_NONAME AS SELECT Dname, COUNT (*), SUM (Salary) FROM DEPARTMENT, EMPLOYEE "
              "WHERE Dnumber = Dno GROUP BY Dname")
    assert cols(c, "SELECT * FROM DEPT_INFO_NONAME") == ["Dname", "COUNT (*)", "SUM (Salary)"]
    c.execute("DROP VIEW DEPT_INFO_NONAME")
    print("[OK] p.6: 열 이름을 안 붙이면 SQLite는 계산식 글자를 그대로 열 이름으로 쓴다 ('COUNT (*)', 'SUM (Salary)')")

    on_view = q(c, "SELECT Fname, Lname FROM WORKS_ON1 WHERE Pname = 'ProductX' ORDER BY Lname DESC")
    on_base = q(c, "SELECT Fname, Lname FROM EMPLOYEE, PROJECT, WORKS_ON "
                   "WHERE Ssn = Essn AND Pno = Pnumber AND Pname = 'ProductX' ORDER BY Lname DESC")
    assert on_view == on_base == [("John", "Smith"), ("Joyce", "English")]
    print("[OK] p.7, p.30(연습 0): 뷰 질의 = 세 표 조인 질의 =", on_view)

    kind = q(c, "SELECT name, type, rootpage FROM sqlite_master WHERE name IN ('WORKS_ON1', 'WORKS_ON') ORDER BY name")
    assert kind[0][:2] == ("WORKS_ON", "table") and kind[0][2] > 0
    assert kind[1] == ("WORKS_ON1", "view", 0)
    sql = q(c, "SELECT sql FROM sqlite_master WHERE name = 'WORKS_ON1'")[0][0]
    assert sql.startswith("CREATE VIEW WORKS_ON1")
    print("[OK] p.3: 카탈로그에 뷰는 정의 글만 있고 저장 자리(rootpage)는 0, 기본 테이블은 저장 자리가 있다")

    # 늘 최신: 복사본(표)과 뷰를 나란히 두고 기본 테이블을 고친다
    c.execute("CREATE TABLE DEPT_INFO_COPY AS SELECT * FROM DEPT_INFO")
    c.execute("INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main','F',27000,'333445555',5)")
    c.execute("INSERT INTO WORKS_ON VALUES ('111223333', 1, 12.0)")
    c.commit()
    assert q(c, "SELECT * FROM DEPT_INFO WHERE Dept_name = 'Research'") == [("Research", 5, 160000)]
    assert q(c, "SELECT * FROM DEPT_INFO_COPY WHERE Dept_name = 'Research'") == [("Research", 4, 133000)]
    assert q(c, "SELECT COUNT(*) FROM WORKS_ON1") == [(17,)]
    assert q(c, "SELECT Lname FROM WORKS_ON1 WHERE Pname = 'ProductX' ORDER BY Lname") == [
        ("English",), ("Lee",), ("Smith",)]
    print("[OK] p.8: 직원 한 명을 넣으면 뷰는 (Research, 5, 160000), 떠 둔 복사본은 (Research, 4, 133000) 그대로")
    c.execute("DELETE FROM WORKS_ON WHERE Essn = '111223333'")
    c.execute("DELETE FROM EMPLOYEE WHERE Ssn = '111223333'")
    c.commit()

    before = counts(c)
    c.execute("DROP VIEW WORKS_ON1")
    assert counts(c) == before == [8, 3, 5, 6, 16, 7]
    fails(c, "SELECT * FROM WORKS_ON1", "no such table")
    print("[OK] p.14: DROP VIEW 뒤 기본 테이블 여섯 개의 행 수는 그대로", before)

    assert [r[2] for r in q(c, "SELECT * FROM DEPT5EMP ORDER BY Lname")] == ["English", "Narayan", "Smith", "Wong"]
    assert cols(c, "SELECT * FROM DEPT5EMP") == cols(c, "SELECT * FROM EMPLOYEE")
    assert cols(c, "SELECT * FROM BASIC_EMP_DATA") == ["Fname", "Lname", "Address"]
    assert q(c, "SELECT COUNT(*) FROM BASIC_EMP_DATA") == [(8,)]
    fails(c, "SELECT Salary FROM BASIC_EMP_DATA", "no such column")
    print("[OK] p.25~26: DEPT5EMP는 5번 부서 4행, BASIC_EMP_DATA는 8행 3열(Salary는 안 보인다)")

    # 기본 테이블을 지우면: SQLite는 지우게 두고, 남은 뷰는 쓸 때 오류가 난다 (PostgreSQL은 지우기를 거부한다)
    d = make()
    d.executescript(VIEWS)
    d.execute("DROP TABLE WORKS_ON")
    assert q(d, "SELECT type FROM sqlite_master WHERE name = 'WORKS_ON1'") == [("view",)]
    fails(d, "SELECT * FROM WORKS_ON1", "no such table")
    print("[OK] 뷰가 기대는 표를 지우면 SQLite에서는 뷰 정의만 남고, 그 뷰에 질의하면 오류가 난다")

    # 카드 C3: 뷰 위에 뷰
    c.execute("CREATE VIEW DEPT5_NAMES AS SELECT Fname, Lname FROM DEPT5EMP WHERE Salary >= 30000")
    assert q(c, "SELECT Lname FROM DEPT5_NAMES ORDER BY Lname") == [("Narayan",), ("Smith",), ("Wong",)]
    c.execute("UPDATE EMPLOYEE SET Salary = 29000 WHERE Lname = 'Smith'")
    assert q(c, "SELECT Lname FROM DEPT5_NAMES ORDER BY Lname") == [("Narayan",), ("Wong",)]
    print("[OK] 카드 C3: 뷰 위에 만든 뷰도 기본 테이블이 바뀌면 바로 따라 바뀐다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
