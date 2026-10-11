---
layout: "note"
title: "56_sql-multiset-distinct_verify.py"
display_title: "56_sql-multiset-distinct_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "56"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-multiset-distinct/"
parent_title: "다중집합인 표와 DISTINCT"
description: "데이터베이스 설계 · 다중집합인 표와 DISTINCT 검증 코드"
permalink: "/studies/database-design/code/56_sql-multiset-distinct_verify/"
---
{% raw %}
[다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 56.다중집합인 표와 DISTINCT 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 56_sql-multiset-distinct_verify.py)
# 확인하는 것 (슬라이드 10-2 p.21~22, 11-2 p.7~8)
#   1. SELECT ALL Salary는 8행, SELECT DISTINCT Salary는 6행
#   2. 키가 있는 표에는 똑같은 행이 둘 있을 수 없다. 키가 없는 표와 질의 결과에는 있을 수 있다
#   3. 중복을 남겨 두어야 평균과 합이 맞게 나온다
import sqlite3

# COMPANY 스키마와 상태. 스키마는 슬라이드 6-2 p.20, 상태는 6-2 p.21, DDL은 9 p.17~18을 따른다.
# 슬라이드와 다른 곳은 둘이다. (1) EMPLOYEE의 외래 키 두 개를 CREATE TABLE 안에 적었다(SQLite는 아직 없는
# 표를 가리켜도 받는다). (2) WORKS_ON.Hours의 NOT NULL은 뺐다(상태에 Hours가 NULL인 행이 있다).
COMPANY_DDL = """
CREATE TABLE EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn),
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn));
CREATE TABLE DEPT_LOCATIONS (
  Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (
  Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname),
  FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (
  Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn),
  FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (
  Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
"""
EMPLOYEE = [
    ('John', 'B', 'Smith', '123456789', '1965-01-09', '731 Fondren, Houston, TX', 'M', 30000, '333445555', 5),
    ('Franklin', 'T', 'Wong', '333445555', '1955-12-08', '638 Voss, Houston, TX', 'M', 40000, '888665555', 5),
    ('Alicia', 'J', 'Zelaya', '999887777', '1968-01-19', '3321 Castle, Spring, TX', 'F', 25000, '987654321', 4),
    ('Jennifer', 'S', 'Wallace', '987654321', '1941-06-20', '291 Berry, Bellaire, TX', 'F', 43000, '888665555', 4),
    ('Ramesh', 'K', 'Narayan', '666884444', '1962-09-15', '975 Fire Oak, Humble, TX', 'M', 38000, '333445555', 5),
    ('Joyce', 'A', 'English', '453453453', '1972-07-31', '5631 Rice, Houston, TX', 'F', 25000, '333445555', 5),
    ('Ahmad', 'V', 'Jabbar', '987987987', '1969-03-29', '980 Dallas, Houston, TX', 'M', 25000, '987654321', 4),
    ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, None, 1)]
DEPARTMENT = [('Research', 5, '333445555', '1988-05-22'), ('Administration', 4, '987654321', '1995-01-01'),
              ('Headquarters', 1, '888665555', '1981-06-19')]
DEPT_LOCATIONS = [(1, 'Houston'), (4, 'Stafford'), (5, 'Bellaire'), (5, 'Sugarland'), (5, 'Houston')]
PROJECT = [('ProductX', 1, 'Bellaire', 5), ('ProductY', 2, 'Sugarland', 5), ('ProductZ', 3, 'Houston', 5),
           ('Computerization', 10, 'Stafford', 4), ('Reorganization', 20, 'Houston', 1), ('Newbenefits', 30, 'Stafford', 4)]
WORKS_ON = [('123456789', 1, 32.5), ('123456789', 2, 7.5), ('666884444', 3, 40.0), ('453453453', 1, 20.0),
            ('453453453', 2, 20.0), ('333445555', 2, 10.0), ('333445555', 3, 10.0), ('333445555', 10, 10.0),
            ('333445555', 20, 10.0), ('999887777', 30, 30.0), ('999887777', 10, 10.0), ('987987987', 10, 35.0),
            ('987987987', 30, 5.0), ('987654321', 30, 20.0), ('987654321', 20, 15.0), ('888665555', 20, None)]
DEPENDENT = [('333445555', 'Alice', 'F', '1986-04-05', 'Daughter'), ('333445555', 'Theodore', 'M', '1983-10-25', 'Son'),
             ('333445555', 'Joy', 'F', '1958-05-03', 'Spouse'), ('987654321', 'Abner', 'M', '1942-02-28', 'Spouse'),
             ('123456789', 'Michael', 'M', '1988-01-04', 'Son'), ('123456789', 'Alice', 'F', '1988-12-30', 'Daughter'),
             ('123456789', 'Elizabeth', 'F', '1967-05-05', 'Spouse')]


def load(c):
    """여섯 표에 슬라이드의 상태를 넣는다. EMPLOYEE와 DEPARTMENT가 서로를 가리키므로 넣는 동안만 외래 키 검사를 미룬다."""
    c.execute('BEGIN')
    c.execute('PRAGMA defer_foreign_keys = ON')
    c.executemany('INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)', EMPLOYEE)
    c.executemany('INSERT INTO DEPARTMENT VALUES (?,?,?,?)', DEPARTMENT)
    c.executemany('INSERT INTO DEPT_LOCATIONS VALUES (?,?)', DEPT_LOCATIONS)
    c.executemany('INSERT INTO PROJECT VALUES (?,?,?,?)', PROJECT)
    c.executemany('INSERT INTO WORKS_ON VALUES (?,?,?)', WORKS_ON)
    c.executemany('INSERT INTO DEPENDENT VALUES (?,?,?,?,?)', DEPENDENT)
    c.execute('COMMIT')


def make(ddl=COMPANY_DDL):
    """외래 키 검사를 켠 메모리 데이터베이스에 COMPANY를 만들어 돌려준다."""
    c = sqlite3.connect(':memory:', isolation_level=None)
    c.execute('PRAGMA foreign_keys = ON')
    c.executescript(ddl)
    load(c)
    return c


def rows(c, sql, args=()):
    return c.execute(sql, args).fetchall()


def error_of(c, sql, args=()):
    """문장을 돌려 보고 오류 글을 돌려준다. 오류가 없으면 None. 어느 쪽이든 데이터베이스는 돌리기 전으로 되돌린다."""
    c.execute('SAVEPOINT try_it')
    try:
        c.execute(sql, args)
        return None
    except sqlite3.Error as e:
        return str(e)
    finally:
        c.execute('ROLLBACK TO try_it')
        c.execute('RELEASE try_it')

from collections import Counter

if __name__ == "__main__":
    c = make()

    # --- 1. ALL과 DISTINCT
    q1 = [r[0] for r in rows(c, "SELECT ALL Salary FROM EMPLOYEE")]
    q2 = [r[0] for r in rows(c, "SELECT DISTINCT Salary FROM EMPLOYEE")]
    # 행이 나오는 차례는 정해져 있지 않으므로 차례를 빼고 견준다
    assert sorted(q1) == sorted([30000, 40000, 25000, 43000, 38000, 25000, 25000, 55000])     # 슬라이드 Q1 (8행)
    assert sorted(q2) == sorted([30000, 40000, 25000, 43000, 38000, 55000])                    # 슬라이드 Q2 (6행)
    assert sorted(r[0] for r in rows(c, "SELECT Salary FROM EMPLOYEE")) == sorted(q1)          # ALL은 안 써도 같다
    assert Counter(q1) == Counter({25000: 3, 30000: 1, 38000: 1, 40000: 1, 43000: 1, 55000: 1})
    assert sorted(set(q1)) == sorted(q2)                                          # DISTINCT = 집합으로 만든 것
    # DISTINCT는 행 전체를 견준다. 열이 둘이면 두 값의 짝이 같아야 중복이다
    assert len(rows(c, "SELECT DISTINCT Dno FROM EMPLOYEE")) == 3
    assert len(rows(c, "SELECT DISTINCT Dno, Salary FROM EMPLOYEE")) == 7         # (5, 25000)과 (4, 25000)은 다른 행, (4, 25000)만 두 번
    assert len(rows(c, "SELECT DISTINCT Sex, Dno FROM EMPLOYEE")) == 5
    assert len(rows(c, "SELECT DISTINCT * FROM EMPLOYEE")) == 8                   # 키가 든 행은 애초에 중복이 없다

    # --- 2. 키와 중복
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (5, 'Houston')") is not None       # 키가 있는 표: 같은 행을 또 못 넣는다
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.execute("CREATE TABLE LOG (Dnumber INT, Dlocation VARCHAR(15))")                      # 키가 없는 표
    k.execute("INSERT INTO LOG VALUES (5, 'Houston'), (5, 'Houston'), (1, 'Houston')")
    assert rows(k, "SELECT COUNT(*) FROM LOG") == [(3,)]
    assert rows(k, "SELECT COUNT(*) FROM (SELECT DISTINCT * FROM LOG)") == [(2,)]
    # 키가 있는 표에서 뽑아도, 키를 뺀 열만 고르면 결과에 중복이 생긴다
    assert len(rows(c, "SELECT Essn FROM WORKS_ON")) == 16 and len(rows(c, "SELECT DISTINCT Essn FROM WORKS_ON")) == 8
    assert len(rows(c, "SELECT Essn, Pno FROM WORKS_ON")) == len(rows(c, "SELECT DISTINCT Essn, Pno FROM WORKS_ON")) == 16   # 키를 다 고르면 중복이 없다

    # --- 3. 집계와 중복
    total, n = sum(q1), len(q1)
    assert (total, n, total / n) == (281000, 8, 35125.0)
    assert rows(c, "SELECT SUM(Salary), COUNT(*), AVG(Salary) FROM EMPLOYEE") == [(281000, 8, 35125.0)]
    assert rows(c, "SELECT SUM(DISTINCT Salary), COUNT(DISTINCT Salary), AVG(DISTINCT Salary) FROM EMPLOYEE") == [(231000, 6, 38500.0)]

    # --- 확인 문제
    # C1: SELECT Dno FROM EMPLOYEE는 8행, DISTINCT면 3행
    assert sorted(r[0] for r in rows(c, "SELECT Dno FROM EMPLOYEE")) == [1, 4, 4, 4, 5, 5, 5, 5]
    assert sorted(r[0] for r in rows(c, "SELECT DISTINCT Dno FROM EMPLOYEE")) == [1, 4, 5]
    # C3: WORKS_ON의 Pno
    assert len(rows(c, "SELECT Pno FROM WORKS_ON")) == 16 and len(rows(c, "SELECT DISTINCT Pno FROM WORKS_ON")) == 6
    assert len(rows(c, "SELECT Plocation FROM PROJECT")) == 6 and len(rows(c, "SELECT DISTINCT Plocation FROM PROJECT")) == 4

    print('ALL CHECKS PASSED')
```
{% endraw %}
