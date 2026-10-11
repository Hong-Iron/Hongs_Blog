---
layout: "note"
title: "46_sql-create-table_verify.py"
display_title: "46_sql-create-table_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-create-table/"
parent_title: "CREATE SCHEMA와 CREATE TABLE"
description: "데이터베이스 설계 · CREATE SCHEMA와 CREATE TABLE 검증 코드"
permalink: "/studies/database-design/code/46_sql-create-table_verify/"
---
{% raw %}
[CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 46.CREATE SCHEMA와 CREATE TABLE 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 46_sql-create-table_verify.py)
# 확인하는 것
#   1. 여섯 CREATE TABLE 문이 만드는 표, 열 수, 외래 키 여덟 개가 가리키는 곳
#   2. 슬라이드 9 p.18대로 Hours에 NOT NULL을 붙이면 상태(6-2 p.21)의 행 하나가 들어가지 않는다
#   3. EMPLOYEE와 DEPARTMENT는 서로를 가리킨다. 어느 쪽 행을 먼저 넣어도 막히고, 검사를 미루면 들어간다
#   4. SQLite에는 CREATE SCHEMA가 없다. ATTACH로 이름을 붙이면 COMPANY.EMPLOYEE라고 쓸 수 있다
# SQLite는 CREATE TABLE 때 가리키는 표가 있는지 보지 않는다. "아직 없는 표를 가리키면 오류"는
# PostgreSQL에서 확인했다(46_sql-create-table_verify.sql).
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


if __name__ == "__main__":
    c = make()

    # --- 1. 표 여섯 개, 열 수, 행 수
    n_cols = {t: len(rows(c, 'PRAGMA table_info(%s)' % t))
              for t in ('EMPLOYEE', 'DEPARTMENT', 'DEPT_LOCATIONS', 'PROJECT', 'WORKS_ON', 'DEPENDENT')}
    assert n_cols == {'EMPLOYEE': 10, 'DEPARTMENT': 4, 'DEPT_LOCATIONS': 2, 'PROJECT': 4, 'WORKS_ON': 3, 'DEPENDENT': 5}
    n_rows = {t: rows(c, 'SELECT COUNT(*) FROM %s' % t)[0][0] for t in n_cols}
    assert n_rows == {'EMPLOYEE': 8, 'DEPARTMENT': 3, 'DEPT_LOCATIONS': 5, 'PROJECT': 6, 'WORKS_ON': 16, 'DEPENDENT': 7}

    # 외래 키 여덟 개: (표, 열) -> (가리키는 표, 열). 슬라이드 스키마 그림의 화살표와 같다.
    fks = set()
    for t in n_cols:
        for r in rows(c, 'PRAGMA foreign_key_list(%s)' % t):
            fks.add((t, r[3], r[2], r[4]))
    assert fks == {
        ('EMPLOYEE', 'Super_ssn', 'EMPLOYEE', 'Ssn'), ('EMPLOYEE', 'Dno', 'DEPARTMENT', 'Dnumber'),
        ('DEPARTMENT', 'Mgr_ssn', 'EMPLOYEE', 'Ssn'), ('DEPT_LOCATIONS', 'Dnumber', 'DEPARTMENT', 'Dnumber'),
        ('PROJECT', 'Dnum', 'DEPARTMENT', 'Dnumber'), ('WORKS_ON', 'Essn', 'EMPLOYEE', 'Ssn'),
        ('WORKS_ON', 'Pno', 'PROJECT', 'Pnumber'), ('DEPENDENT', 'Essn', 'EMPLOYEE', 'Ssn')}
    assert rows(c, 'PRAGMA foreign_key_check') == []          # 상태의 모든 외래 키 값이 실제로 있는 행을 가리킨다

    # 기본 키: 한 열짜리 넷, 두 열짜리 셋(DEPT_LOCATIONS, WORKS_ON, DEPENDENT)
    pk = {t: [r[1] for r in sorted(rows(c, 'PRAGMA table_info(%s)' % t), key=lambda r: r[5]) if r[5] > 0] for t in n_cols}
    assert pk == {'EMPLOYEE': ['Ssn'], 'DEPARTMENT': ['Dnumber'], 'DEPT_LOCATIONS': ['Dnumber', 'Dlocation'],
                  'PROJECT': ['Pnumber'], 'WORKS_ON': ['Essn', 'Pno'], 'DEPENDENT': ['Essn', 'Dependent_name']}

    # --- 2. 슬라이드 9 p.18 그대로: Hours DECIMAL(3,1) NOT NULL
    slide_ddl = COMPANY_DDL.replace('Hours DECIMAL(3,1),', 'Hours DECIMAL(3,1) NOT NULL,')
    assert slide_ddl != COMPANY_DDL
    try:
        make(slide_ddl)
        raise AssertionError('Hours NOT NULL인데 상태가 들어갔다')
    except sqlite3.IntegrityError as e:
        assert str(e) == 'NOT NULL constraint failed: WORKS_ON.Hours'
    assert rows(c, 'SELECT Essn, Pno FROM WORKS_ON WHERE Hours IS NULL') == [('888665555', 20)]   # 걸리는 행은 하나다

    # --- 3. 서로 가리키는 외래 키: 빈 데이터베이스에 첫 행을 넣어 본다
    e = sqlite3.connect(':memory:', isolation_level=None)
    e.execute('PRAGMA foreign_keys = ON')
    e.executescript(COMPANY_DDL)
    borg = "INSERT INTO EMPLOYEE VALUES ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, NULL, 1)"
    hq = "INSERT INTO DEPARTMENT VALUES ('Headquarters', 1, '888665555', '1981-06-19')"
    assert error_of(e, borg) == 'FOREIGN KEY constraint failed'      # 1번 부서가 아직 없다
    assert error_of(e, hq) == 'FOREIGN KEY constraint failed'        # 직원 Borg가 아직 없다
    e.execute('BEGIN')
    e.execute('PRAGMA defer_foreign_keys = ON')                      # 검사를 COMMIT 때로 미룬다
    e.execute(borg)
    e.execute(hq)
    e.execute('COMMIT')
    assert rows(e, 'SELECT COUNT(*) FROM EMPLOYEE') == [(1,)] and rows(e, 'SELECT COUNT(*) FROM DEPARTMENT') == [(1,)]

    # --- 4. 스키마 이름
    s = sqlite3.connect(':memory:', isolation_level=None)
    try:
        s.execute("CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith'")
        raise AssertionError('SQLite가 CREATE SCHEMA를 받았다')
    except sqlite3.OperationalError as err:
        assert 'syntax error' in str(err)
    s.execute("ATTACH DATABASE ':memory:' AS COMPANY")
    s.execute("CREATE TABLE COMPANY.EMPLOYEE (Fname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL, PRIMARY KEY (Ssn))")
    s.execute("INSERT INTO COMPANY.EMPLOYEE VALUES ('John', '123456789')")
    assert rows(s, 'SELECT Fname FROM COMPANY.EMPLOYEE') == [('John',)]

    print('ALL CHECKS PASSED')
```
{% endraw %}
