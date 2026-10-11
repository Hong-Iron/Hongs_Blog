---
layout: "note"
title: "45_sql-overview_verify.py"
display_title: "45_sql-overview_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "45"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-overview/"
parent_title: "SQL 한눈에 보기"
description: "데이터베이스 설계 · SQL 한눈에 보기 검증 코드"
permalink: "/studies/database-design/code/45_sql-overview_verify/"
---
{% raw %}
[SQL 한눈에 보기](/Hongs_Blog/studies/database-design/sql-overview/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 45.SQL 한눈에 보기 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 45_sql-overview_verify.py)
# 확인하는 것
#   1. DDL 문(CREATE, ALTER, DROP)은 표의 정의를 바꾸고, DML 문(SELECT, INSERT, DELETE, UPDATE)은 행만 바꾼다.
#   2. 같은 SELECT 문은 DBMS가 찾는 방법을 바꿔도(색인을 만들기 전과 뒤) 같은 답을 낸다. "무엇을"만 적는 선언적 언어라는 뜻이다.
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


def table_names(c):
    return [r[0] for r in rows(c, "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")]


def column_names(c, table):
    return [r[1] for r in rows(c, 'PRAGMA table_info(%s)' % table)]


def counts(c):
    return {t: rows(c, 'SELECT COUNT(*) FROM %s' % t)[0][0] for t in table_names(c)}


if __name__ == "__main__":
    c = make()
    six = ['DEPARTMENT', 'DEPENDENT', 'DEPT_LOCATIONS', 'EMPLOYEE', 'PROJECT', 'WORKS_ON']
    assert table_names(c) == six
    assert counts(c) == {'DEPARTMENT': 3, 'DEPENDENT': 7, 'DEPT_LOCATIONS': 5, 'EMPLOYEE': 8, 'PROJECT': 6, 'WORKS_ON': 16}

    # --- 1. DML: 행만 바뀐다. 표 목록과 열 목록은 그대로다.
    cols_before = {t: column_names(c, t) for t in six}
    assert len(rows(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE Dno = 4")) == 3            # SELECT는 아무것도 안 바꾼다
    assert counts(c)['EMPLOYEE'] == 8
    c.execute("INSERT INTO DEPENDENT VALUES ('453453453', 'John', 'M', '1990-12-12', 'Spouse')")
    assert counts(c)['DEPENDENT'] == 8
    c.execute("UPDATE PROJECT SET Plocation = 'Bellaire' WHERE Pnumber = 10")
    assert rows(c, "SELECT Plocation FROM PROJECT WHERE Pnumber = 10") == [('Bellaire',)]
    c.execute("DELETE FROM DEPENDENT WHERE Essn = '453453453'")
    assert counts(c)['DEPENDENT'] == 7
    assert table_names(c) == six and {t: column_names(c, t) for t in six} == cols_before

    # --- 1. DDL: 표의 정의가 바뀐다.
    c.execute("CREATE TABLE JOB_HISTORY (Essn CHAR(9) NOT NULL, Job VARCHAR(12))")          # CREATE: 표가 하나 는다
    assert table_names(c) == sorted(six + ['JOB_HISTORY'])
    c.execute("ALTER TABLE JOB_HISTORY ADD COLUMN Start_date DATE")                         # ALTER: 열이 하나 는다
    assert column_names(c, 'JOB_HISTORY') == ['Essn', 'Job', 'Start_date']
    c.execute("DROP TABLE JOB_HISTORY")                                                     # DROP: 표가 사라진다
    assert table_names(c) == six

    # --- 2. 선언적: 찾는 방법이 달라져도 답은 같다.
    query = "SELECT Fname, Lname FROM EMPLOYEE WHERE Lname = 'Smith'"
    plan_before = rows(c, 'EXPLAIN QUERY PLAN ' + query)[0][3]
    answer_before = rows(c, query)
    c.execute("CREATE INDEX EMP_LNAME ON EMPLOYEE (Lname)")
    plan_after = rows(c, 'EXPLAIN QUERY PLAN ' + query)[0][3]
    answer_after = rows(c, query)
    assert plan_before.startswith('SCAN')                 # 표를 처음부터 끝까지 훑는다
    assert plan_after.startswith('SEARCH') and 'EMP_LNAME' in plan_after   # 색인으로 바로 찾는다
    assert answer_before == answer_after == [('John', 'Smith')]

    print('ALL CHECKS PASSED')
```
{% endraw %}
