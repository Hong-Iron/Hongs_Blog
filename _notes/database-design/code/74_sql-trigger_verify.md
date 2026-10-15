---
layout: "note"
title: "74_sql-trigger_verify.py"
display_title: "74_sql-trigger_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "74"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-trigger/"
parent_title: "트리거와 ECA 규칙"
description: "데이터베이스 설계 · 트리거와 ECA 규칙 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/74_sql-trigger_verify/"
---
{% raw %}
[트리거와 ECA 규칙](/Hongs_Blog/studies/database-design/sql-trigger/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""트리거와 ECA 규칙 검증 (SQLite 판). PostgreSQL 판은 74_sql-trigger_verify.sql.

문서: 74.트리거와 ECA 규칙
SQLite는 교재 문법의 트리거 문을 그대로 받지 않는다. 트리거 하나에 사건을 하나만 적을 수 있어
삽입용과 수정용 둘로 나누고, 동작은 알림 표에 한 줄 넣는 것으로 바꿨다.
주장:
  1. 교재 문법의 문장 그대로는 구문 오류다("INSERT OR UPDATE"를 한 트리거에 못 쓴다).
  2. 나눠 쓴 두 트리거: 삽입, Salary 수정, Super_ssn 수정에서 조건이 참일 때만 알림이 한 줄 쌓인다.
  3. 사건 목록에 없는 Address 수정, 조건이 거짓인 삽입, 상사가 없는 직원에서는 알림이 없다.
  4. 상사의 급여를 내리는 사건은 이 트리거가 못 잡는다("모든 사건을 챙겨야 한다").
  5. 동작을 RAISE(ABORT)로 바꾸면 알리는 대신 그 문장을 거부한다.
실행: python3 74_sql-trigger_verify.py
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


SLIDE = """
CREATE TRIGGER SALARY_VIOLATION
BEFORE INSERT OR UPDATE OF SALARY, SUPERVISOR_SSN ON EMPLOYEE
FOR EACH ROW
WHEN (NEW.SALARY > (SELECT SALARY FROM EMPLOYEE WHERE SSN = NEW.SUPERVISOR_SSN))
INFORM_SUPERVISOR(NEW.Supervisor_ssn, NEW.Ssn)
"""
# 사건마다 하나씩. 조건은 WHEN에, 동작은 BEGIN ... END에 적는다.
TWO = """
CREATE TABLE NOTICE (Supervisor_ssn CHAR(9), Emp_ssn CHAR(9));
CREATE TRIGGER SALARY_VIOLATION_INS
BEFORE INSERT ON EMPLOYEE
FOR EACH ROW
WHEN (NEW.Salary > (SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn))
BEGIN
  INSERT INTO NOTICE VALUES (NEW.Super_ssn, NEW.Ssn);
END;
CREATE TRIGGER SALARY_VIOLATION_UPD
BEFORE UPDATE OF Salary, Super_ssn ON EMPLOYEE
FOR EACH ROW
WHEN (NEW.Salary > (SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn))
BEGIN
  INSERT INTO NOTICE VALUES (NEW.Super_ssn, NEW.Ssn);
END;
"""
KATE = ("INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',"
        "{sal},'333445555',5)")


def main():
    c = make()
    fails(c, SLIDE, "syntax error")
    fails(c, "CREATE TRIGGER T BEFORE INSERT OR UPDATE ON EMPLOYEE BEGIN SELECT 1; END", 'near "OR": syntax error')
    print("[OK] 교재 문법의 문장 그대로는 SQLite에서 구문 오류 (한 트리거에 INSERT OR UPDATE를 못 쓴다)")

    c.executescript(TWO)
    n = lambda: q(c, "SELECT * FROM NOTICE")
    c.execute(KATE.format(sal=45000))
    assert n() == [("333445555", "111223333")]
    assert q(c, "SELECT Salary FROM EMPLOYEE WHERE Ssn = '111223333'") == [(45000,)]
    print("[OK] 삽입, 조건 참(45000 > Wong 40000): 알림 1줄, 행은 그대로 들어간다")

    c.execute("INSERT INTO EMPLOYEE VALUES ('Paul','B','Roh','111224444','1981-04-04','2 Main','M',20000,'333445555',5)")
    assert len(n()) == 1
    print("[OK] 삽입, 조건 거짓(20000): 알림 없음")

    c.execute("UPDATE EMPLOYEE SET Salary = 41000 WHERE Lname = 'Smith'")
    assert n()[-1] == ("333445555", "123456789") and len(n()) == 2
    c.execute("UPDATE EMPLOYEE SET Super_ssn = '111224444' WHERE Lname = 'Zelaya'")
    assert n()[-1] == ("111224444", "999887777") and len(n()) == 3
    print("[OK] Salary 수정(Smith 41000)과 Super_ssn 수정(Zelaya의 상사를 Roh로): 알림이 한 줄씩")

    c.execute("UPDATE EMPLOYEE SET Address = '9 New Rd' WHERE Lname = 'Smith'")
    c.execute("UPDATE EMPLOYEE SET Salary = 99000 WHERE Lname = 'Borg'")
    assert len(n()) == 3
    print("[OK] Address 수정(사건 아님), 상사 없는 Borg의 급여 인상(조건이 NULL): 알림 없음")

    c.execute("UPDATE EMPLOYEE SET Salary = 20000 WHERE Lname = 'Wallace'")
    over = q(c, "SELECT E.Lname FROM EMPLOYEE E, EMPLOYEE S WHERE E.Super_ssn = S.Ssn AND E.Salary > S.Salary "
                "AND S.Lname = 'Wallace'")
    assert len(n()) == 3 and over == [("Jabbar",)]
    print("[OK] 상사 Wallace의 급여를 20000으로 내림: Jabbar(25000)가 더 많이 받게 되지만 알림 없음")
    c.commit()

    # 카드 C2: 새 상태에서 세 문장
    k = make()
    k.executescript(TWO)
    k.execute(KATE.format(sal=45000))
    k.execute("UPDATE EMPLOYEE SET Salary = 41000 WHERE Lname = 'Smith'")
    k.execute("UPDATE EMPLOYEE SET Salary = 20000 WHERE Lname = 'Wallace'")
    assert q(k, "SELECT * FROM NOTICE") == [("333445555", "111223333"), ("333445555", "123456789")]
    over = q(k, "SELECT E.Lname FROM EMPLOYEE E, EMPLOYEE S WHERE E.Super_ssn = S.Ssn AND E.Salary > S.Salary "
                "AND S.Lname = 'Wallace' ORDER BY E.Lname")
    assert over == [("Jabbar",), ("Zelaya",)]
    print("[OK] 카드 C2: 알림 2건(둘 다 Wong에게). Wallace의 급여를 내린 뒤 Jabbar, Zelaya가 상사보다 많이 받지만 알림 없음")

    # 동작을 '거부'로 바꾼 판
    r = make()
    r.executescript("""
    CREATE TRIGGER SALARY_GUARD BEFORE INSERT ON EMPLOYEE FOR EACH ROW
    WHEN (NEW.Salary > (SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn))
    BEGIN SELECT RAISE(ABORT, 'salary greater than supervisor'); END;
    """)
    fails(r, KATE.format(sal=45000), "salary greater than supervisor")
    assert q(r, "SELECT COUNT(*) FROM EMPLOYEE") == [(8,)]
    r.execute(KATE.format(sal=39000))
    assert q(r, "SELECT COUNT(*) FROM EMPLOYEE") == [(9,)]
    print("[OK] 동작이 RAISE(ABORT)면 45000인 행은 거부되고 39000인 행은 들어간다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
