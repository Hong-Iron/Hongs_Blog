---
layout: "note"
title: "58_sql-drop_verify.py"
display_title: "58_sql-drop_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "58"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-drop/"
parent_title: "DROP 명령과 CASCADE·RESTRICT"
description: "데이터베이스 설계 · DROP 명령과 CASCADE·RESTRICT 검증 코드"
permalink: "/studies/database-design/code/58_sql-drop_verify/"
---
{% raw %}
[DROP 명령과 CASCADE·RESTRICT](/Hongs_Blog/studies/database-design/sql-drop/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 58.DROP 명령과 CASCADE·RESTRICT 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 58_sql-drop_verify.py)
# 확인하는 것 (슬라이드 11 p.16의 "DELETE는 행만, DROP TABLE은 표의 정의까지")
#   1. DELETE FROM DEPENDENT 뒤에는 표가 남아 다시 넣을 수 있다
#   2. DROP TABLE DEPENDENT 뒤에는 표 자체가 없어 넣을 수도 찾을 수도 없다
#   3. SQLite에는 DROP SCHEMA와 DROP의 CASCADE·RESTRICT가 없다
# CASCADE와 RESTRICT가 실제로 하는 일은 PostgreSQL에서 확인했다(58_sql-drop_verify.sql).
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


def tables(c):
    return sorted(r[0] for r in rows(c, "SELECT name FROM sqlite_master WHERE type = 'table'"))


if __name__ == "__main__":
    c = make()
    assert 'DEPENDENT' in tables(c) and rows(c, "SELECT COUNT(*) FROM DEPENDENT") == [(7,)]

    # --- 1. DELETE: 행만 사라진다
    c.execute("DELETE FROM DEPENDENT")
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT") == [(0,)]
    assert 'DEPENDENT' in tables(c)                                           # 카탈로그에 정의가 남아 있다
    assert len(rows(c, "PRAGMA table_info(DEPENDENT)")) == 5                  # 열 다섯 개도 그대로
    c.execute("INSERT INTO DEPENDENT VALUES ('123456789', 'Michael', 'M', '1988-01-04', 'Son')")
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT") == [(1,)]                # 다시 넣을 수 있다
    assert error_of(c, "INSERT INTO DEPENDENT VALUES ('000000000', 'Nobody', 'M', NULL, 'Son')") == 'FOREIGN KEY constraint failed'   # 제약도 살아 있다

    # --- 2. DROP TABLE: 정의까지 사라진다
    c.execute("DROP TABLE DEPENDENT")
    assert 'DEPENDENT' not in tables(c) and len(tables(c)) == 5
    assert error_of(c, "SELECT COUNT(*) FROM DEPENDENT") == 'no such table: DEPENDENT'
    assert error_of(c, "INSERT INTO DEPENDENT VALUES ('123456789', 'Michael', 'M', '1988-01-04', 'Son')") == 'no such table: DEPENDENT'

    # DELETE는 제약을 지킨다: 다른 표가 가리키는 행은 못 지운다
    assert error_of(c, "DELETE FROM PROJECT") == 'FOREIGN KEY constraint failed'
    assert rows(c, "SELECT COUNT(*) FROM PROJECT") == [(6,)]

    # --- 3. SQLite가 못 받는 문장
    c = make()
    for sql in ("DROP TABLE DEPENDENT CASCADE", "DROP TABLE DEPENDENT RESTRICT", "DROP SCHEMA COMPANY CASCADE", "DROP SCHEMA COMPANY RESTRICT"):
        assert 'syntax error' in error_of(c, sql), sql
    assert len(tables(c)) == 6

    print('ALL CHECKS PASSED')
```
{% endraw %}
