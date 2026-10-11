---
layout: "note"
title: "77_view-update-problem_verify.py"
display_title: "77_view-update-problem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-update-problem/"
parent_title: "뷰 갱신 문제"
description: "데이터베이스 설계 · 뷰 갱신 문제 검증 코드"
permalink: "/studies/database-design/code/77_view-update-problem_verify/"
---
{% raw %}
[뷰 갱신 문제](/Hongs_Blog/studies/database-design/view-update-problem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뷰 갱신 문제 검증 (SQLite 판). 뷰에 대한 갱신 자체는 77_view-update-problem_verify.sql(PostgreSQL)에서 본다.

문서: 77.뷰 갱신 문제
출처: 13주차 슬라이드 13-View p.17~24
SQLite는 뷰를 모두 읽기 전용으로 다룬다. 그래서 여기서는 (1) 그 사실과, (2) 뷰 갱신을 기본 테이블 갱신으로
옮기는 두 길 (a)·(b)의 효과, (3) 집계 값을 맞추는 길이 여럿이라는 것을 기본 테이블에서 확인한다.
주장:
  1. SQLite에서는 표 하나로 만든 뷰(DEPT5EMP)조차 UPDATE·INSERT·DELETE가 "is a view" 오류로 거부된다.
  2. p.21의 (a)와 (b)를 슬라이드의 COMPANY 상태에 그대로 돌리면 둘 다 유일성 제약에 걸린다.
     (a): WORKS_ON의 기본 키 (Essn, Pno) = (123456789, 2)가 이미 있다. (b): UNIQUE (Pname)에 ProductY가 이미 있다.
  3. 제약 없는 복사본에서 (a)와 (b)는 둘 다 뷰의 (John, Smith, ProductX, 32.5)를 ProductY로 바꾼다.
     (a)는 다른 행을 건드리지 않고, (b)는 English의 ProductX 행까지 ProductY로 바꾼다.
  4. p.22: Research의 Total_sal 133000을 100000으로 만드는 기본 테이블 수정이 둘 이상 있다.
  5. p.23: INSTEAD OF 트리거를 달면 SQLite의 뷰도 UPDATE를 받는다(설계자가 길을 정한다).
실행: python3 77_view-update-problem_verify.py
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
CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON
  WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal) AS SELECT Dname, COUNT (*), SUM (Salary)
  FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;
CREATE VIEW DEPT5EMP AS SELECT * FROM EMPLOYEE WHERE Dno = 5;
"""
A = """UPDATE {W} SET Pno = (SELECT Pnumber FROM {P} WHERE Pname = 'ProductY')
WHERE Essn IN (SELECT Ssn FROM {E} WHERE Lname = 'Smith' AND Fname = 'John')
  AND Pno = (SELECT Pnumber FROM {P} WHERE Pname = 'ProductX')"""
B = "UPDATE {P} SET Pname = 'ProductY' WHERE Pname = 'ProductX'"
REAL = dict(E="EMPLOYEE", P="PROJECT", W="WORKS_ON")
COPY = dict(E="E2", P="P2", W="W2")


def copies(c):
    """제약을 뗀 복사본과 그 위의 뷰 V2."""
    c.executescript("""
    DROP VIEW IF EXISTS V2; DROP TABLE IF EXISTS E2; DROP TABLE IF EXISTS P2; DROP TABLE IF EXISTS W2;
    CREATE TABLE E2 AS SELECT * FROM EMPLOYEE; CREATE TABLE P2 AS SELECT * FROM PROJECT;
    CREATE TABLE W2 AS SELECT * FROM WORKS_ON;
    CREATE VIEW V2 AS SELECT Fname, Lname, Pname, Hours FROM E2, P2, W2 WHERE Ssn = Essn AND Pno = Pnumber;
    """)


def main():
    c = make()
    c.executescript(VIEWS)

    for sql in ("UPDATE DEPT5EMP SET Salary = 31000 WHERE Lname = 'Smith'",
                "DELETE FROM DEPT5EMP WHERE Lname = 'Smith'",
                "INSERT INTO DEPT5EMP VALUES ('T','A','K','111111111',NULL,NULL,'M',1,NULL,5)",
                "UPDATE WORKS_ON1 SET Pname = 'ProductY' WHERE Lname = 'Smith' AND Fname = 'John' AND Pname = 'ProductX'",
                "UPDATE DEPT_INFO SET Total_sal = 100000 WHERE Dept_name = 'Research'"):
        fails(c, sql, "because it is a view")
    print("[OK] SQLite: 표 하나짜리 뷰를 포함해 모든 뷰의 UPDATE·INSERT·DELETE가 거부된다")

    # 2. 실제 COMPANY에서 두 길
    assert q(c, "SELECT Pno FROM WORKS_ON WHERE Essn = '123456789' ORDER BY Pno") == [(1,), (2,)]
    fails(c, A.format(**REAL), "UNIQUE constraint failed: WORKS_ON.Essn, WORKS_ON.Pno")
    fails(c, B.format(**REAL), "UNIQUE constraint failed: PROJECT.Pname")
    print("[OK] p.21: 슬라이드 상태에서는 (a)도 (b)도 유일성 제약에 걸린다")

    # 3. 제약 없는 복사본에서 두 길의 효과
    before = sorted(q(c, "SELECT * FROM WORKS_ON1"), key=str)
    want_gone, want_new = ("John", "Smith", "ProductX", 32.5), ("John", "Smith", "ProductY", 32.5)
    copies(c)
    assert sorted(q(c, "SELECT * FROM V2"), key=str) == before
    c.execute(A.format(**COPY))
    va = q(c, "SELECT * FROM V2")
    copies(c)
    c.execute(B.format(**COPY))
    vb = q(c, "SELECT * FROM V2")
    for v in (va, vb):
        assert want_gone not in v and want_new in v and len(v) == 16
    changed_a = sorted(set(before) - set(va))
    changed_b = sorted(set(before) - set(vb))
    assert changed_a == [want_gone]
    assert changed_b == [("John", "Smith", "ProductX", 32.5), ("Joyce", "English", "ProductX", 20.0)]
    assert q(c, "SELECT COUNT(*) FROM P2 WHERE Pname = 'ProductX'") == [(0,)]
    print("[OK] p.21: 복사본에서 (a)는 뷰의 1행만, (b)는 2행(Smith, English)을 바꾼다. 둘 다 바라던 행은 ProductY가 된다")

    # 4. 집계 값을 맞추는 길은 여럿
    total = "SELECT Total_sal FROM DEPT_INFO WHERE Dept_name = 'Research'"
    assert q(c, total) == [(133000,)]
    c.execute("UPDATE EMPLOYEE SET Salary = Salary - 8250 WHERE Dno = 5")
    assert q(c, total) == [(100000,)]
    c.execute("UPDATE EMPLOYEE SET Salary = Salary + 8250 WHERE Dno = 5")
    c.execute("UPDATE EMPLOYEE SET Salary = Salary - 33000 WHERE Lname = 'Wong'")
    assert q(c, total) == [(100000,)]
    c.execute("UPDATE EMPLOYEE SET Salary = Salary + 33000 WHERE Lname = 'Wong'")
    assert 133000 - 4 * 8250 == 100000 and q(c, total) == [(133000,)]
    print("[OK] p.22: 넷에게서 8250씩 깎아도, Wong 한 사람에게서 33000을 깎아도 Total_sal은 100000")

    # 5. INSTEAD OF 트리거: 설계자가 길 (a)를 골라 준다
    c.executescript("""
    CREATE TRIGGER WORKS_ON1_UPD INSTEAD OF UPDATE OF Pname ON WORKS_ON1 FOR EACH ROW BEGIN
      UPDATE WORKS_ON SET Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = NEW.Pname)
      WHERE Essn IN (SELECT Ssn FROM EMPLOYEE WHERE Fname = OLD.Fname AND Lname = OLD.Lname)
        AND Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = OLD.Pname);
    END;
    """)
    c.execute("UPDATE WORKS_ON1 SET Pname = 'ProductX' WHERE Lname = 'Narayan' AND Pname = 'ProductZ'")
    assert q(c, "SELECT Pno FROM WORKS_ON WHERE Essn = '666884444'") == [(1,)]
    assert q(c, "SELECT Pname FROM WORKS_ON1 WHERE Lname = 'Narayan'") == [("ProductX",)]
    assert q(c, "SELECT COUNT(*) FROM PROJECT WHERE Pname = 'ProductZ'") == [(1,)]
    print("[OK] p.23: INSTEAD OF 트리거를 단 뒤에는 뷰의 UPDATE가 WORKS_ON 수정으로 옮겨진다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
