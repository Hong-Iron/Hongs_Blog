---
layout: "note"
title: "59_sql-alter-table_verify.py"
display_title: "59_sql-alter-table_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "59"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-alter-table/"
parent_title: "ALTER TABLE"
description: "데이터베이스 설계 · ALTER TABLE 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/59_sql-alter-table_verify/"
---
{% raw %}
[ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 59.ALTER TABLE 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 59_sql-alter-table_verify.py)
# 확인하는 것 (슬라이드 11 p.17~18)
#   1. ADD COLUMN Job VARCHAR(12): 열이 하나 늘고, 이미 있던 여덟 행의 Job은 모두 NULL이다
#   2. DROP COLUMN Address: 열과 그 열의 값이 사라진다 (SQLite는 CASCADE·RESTRICT 낱말을 못 받는다)
#   3. SQLite에는 DROP CONSTRAINT가 없다
# CASCADE·RESTRICT와 DROP CONSTRAINT는 PostgreSQL에서 확인했다(59_sql-alter-table_verify.sql).
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


def columns(c, table, schema='main'):
    return [r[1] for r in rows(c, 'PRAGMA %s.table_info(%s)' % (schema, table))]


if __name__ == "__main__":
    c = make()
    assert len(columns(c, 'EMPLOYEE')) == 10

    # --- 1. ADD COLUMN
    c.execute("ALTER TABLE EMPLOYEE ADD COLUMN Job VARCHAR(12)")
    assert columns(c, 'EMPLOYEE')[-1] == 'Job' and len(columns(c, 'EMPLOYEE')) == 11        # 맨 뒤에 붙는다
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Job IS NULL") == [(8,)]             # 기존 행은 모두 NULL
    c.execute("UPDATE EMPLOYEE SET Job = 'Manager' WHERE Ssn IN (SELECT Mgr_ssn FROM DEPARTMENT)")   # 값은 UPDATE로 채운다
    assert sorted(r[0] for r in rows(c, "SELECT Lname FROM EMPLOYEE WHERE Job = 'Manager'")) == ['Borg', 'Wallace', 'Wong']
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Job IS NULL") == [(5,)]
    # NOT NULL인 열은 기본값 없이 못 붙인다. 이미 있는 행에 넣을 값이 없기 때문이다
    assert error_of(c, "ALTER TABLE EMPLOYEE ADD COLUMN Grade INT NOT NULL") == 'Cannot add a NOT NULL column with default value NULL'
    assert error_of(c, "ALTER TABLE EMPLOYEE ADD COLUMN Grade INT NOT NULL DEFAULT 1") is None

    # --- 2. DROP COLUMN
    assert 'syntax error' in error_of(c, "ALTER TABLE EMPLOYEE DROP COLUMN Address CASCADE")
    assert 'syntax error' in error_of(c, "ALTER TABLE EMPLOYEE DROP COLUMN Address RESTRICT")
    c.execute("ALTER TABLE EMPLOYEE DROP COLUMN Address")
    assert 'Address' not in columns(c, 'EMPLOYEE') and len(columns(c, 'EMPLOYEE')) == 10
    assert error_of(c, "SELECT Address FROM EMPLOYEE") == 'no such column: Address'
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(8,)]                               # 행 수는 그대로다
    # 기본 키 열은 못 지운다
    assert 'PRIMARY KEY' in error_of(c, "ALTER TABLE EMPLOYEE DROP COLUMN Ssn")

    # --- 3. DROP CONSTRAINT
    assert 'syntax error' in error_of(c, "ALTER TABLE EMPLOYEE DROP CONSTRAINT EMPSUPERFK CASCADE")

    # 스키마 이름을 붙인 꼴 (슬라이드는 COMPANY.EMPLOYEE라고 쓴다): ATTACH로 흉내 낸다
    s = sqlite3.connect(':memory:', isolation_level=None)
    s.execute("ATTACH DATABASE ':memory:' AS COMPANY")
    s.execute("CREATE TABLE COMPANY.EMPLOYEE (Fname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL, Address VARCHAR(30), PRIMARY KEY (Ssn))")
    s.execute("INSERT INTO COMPANY.EMPLOYEE VALUES ('John', '123456789', '731 Fondren, Houston, TX')")
    s.execute("ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Job VARCHAR(12)")
    assert columns(s, 'EMPLOYEE', 'COMPANY') == ['Fname', 'Ssn', 'Address', 'Job']
    assert rows(s, "SELECT Fname, Job FROM COMPANY.EMPLOYEE") == [('John', None)]
    s.execute("ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address")
    assert columns(s, 'EMPLOYEE', 'COMPANY') == ['Fname', 'Ssn', 'Job']

    print('ALL CHECKS PASSED')
```
{% endraw %}
