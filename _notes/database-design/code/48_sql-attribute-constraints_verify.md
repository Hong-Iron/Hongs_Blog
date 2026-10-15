---
layout: "note"
title: "48_sql-attribute-constraints_verify.py"
display_title: "48_sql-attribute-constraints_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-attribute-constraints/"
parent_title: "속성 제약 NOT NULL·DEFAULT·CHECK"
description: "데이터베이스 설계 · 속성 제약 NOT NULL·DEFAULT·CHECK 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/48_sql-attribute-constraints_verify/"
---
{% raw %}
[속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 48.속성 제약 NOT NULL·DEFAULT·CHECK 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 48_sql-attribute-constraints_verify.py)
# 확인하는 것 (문서의 NOT NULL, DEFAULT, CHECK 문장을 COMPANY에 붙여 돌린다)
#   1. NOT NULL: 값이 꼭 있어야 하는 열에 NULL을 넣거나 값을 빼먹으면 막힌다
#   2. DEFAULT: 값을 안 적으면 미리 정한 값이 들어간다 (Dno DEFAULT 1, Mgr_ssn DEFAULT '888665555')
#   3. CHECK (Dnumber > 0 AND Dnumber < 21): 1~20만 받는다. NULL은 CHECK만으로는 못 막는다
#   4. SQLite는 기본 키 열에 NOT NULL을 따로 안 쓰면 NULL을 받는다(표준과 다르다). PostgreSQL은 막는다
#      (48_sql-attribute-constraints_verify.sql)
import sqlite3

# COMPANY 스키마와 상태.
# 손본 곳은 둘이다. (1) EMPLOYEE의 외래 키 두 개를 CREATE TABLE 안에 적었다(SQLite는 아직 없는
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
    """여섯 표에 COMPANY 상태를 넣는다. EMPLOYEE와 DEPARTMENT가 서로를 가리키므로 넣는 동안만 외래 키 검사를 미룬다."""
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


# 문서대로 DEFAULT와 CHECK를 붙인 DDL
DDL_48 = (COMPANY_DDL
          .replace('Super_ssn CHAR(9), Dno INT NOT NULL,', 'Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,')
          .replace('Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL,',
                   "Dnumber INT NOT NULL CHECK (Dnumber > 0 AND Dnumber < 21), Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555',"))

if __name__ == "__main__":
    assert DDL_48.count('DEFAULT') == 2 and DDL_48.count('CHECK') == 1
    c = make(DDL_48)

    # --- 1. NOT NULL
    assert error_of(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES (NULL, 'Hatcher', '980760540')") \
        == 'NOT NULL constraint failed: EMPLOYEE.Fname'
    assert error_of(c, "INSERT INTO EMPLOYEE (Lname, Ssn) VALUES ('Hatcher', '980760540')") \
        == 'NOT NULL constraint failed: EMPLOYEE.Fname'              # 빼먹은 열은 NULL이 되므로 똑같이 막힌다
    # NOT NULL이 없는 열(Minit, Bdate, Address, Sex, Salary, Super_ssn)은 비워 둘 수 있다
    not_null = [r[1] for r in rows(c, 'PRAGMA table_info(EMPLOYEE)') if r[3] == 1]
    assert not_null == ['Fname', 'Lname', 'Ssn', 'Dno']

    # --- 2. DEFAULT
    c.execute("INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES ('Robert', 'Hatcher', '980760540')")
    assert rows(c, "SELECT Dno, Super_ssn, Salary FROM EMPLOYEE WHERE Ssn = '980760540'") == [(1, None, None)]
    c.execute("INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7)")
    assert rows(c, "SELECT Mgr_ssn, Mgr_start_date FROM DEPARTMENT WHERE Dnumber = 7") == [('888665555', None)]
    assert rows(c, "SELECT Lname FROM EMPLOYEE WHERE Ssn = '888665555'") == [('Borg',)]      # 기본 관리자는 Borg다
    # 값을 직접 적으면 DEFAULT는 쓰이지 않는다
    c.execute("INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('Cecilia', 'Kolonsky', '677678989', 4)")
    assert rows(c, "SELECT Dno FROM EMPLOYEE WHERE Ssn = '677678989'") == [(4,)]
    # NULL이라고 직접 적으면 DEFAULT로 바뀌지 않고 NOT NULL에 걸린다
    assert error_of(c, "INSERT INTO DEPARTMENT (Dname, Dnumber, Mgr_ssn) VALUES ('Legal', 8, NULL)") \
        == 'NOT NULL constraint failed: DEPARTMENT.Mgr_ssn'
    # DEFAULT가 없으면 NOT NULL 열을 빼먹을 수 없다 (원래 DDL)
    plain = make()
    assert error_of(plain, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES ('Robert', 'Hatcher', '980760540')") \
        == 'NOT NULL constraint failed: EMPLOYEE.Dno'

    # --- 3. CHECK (Dnumber > 0 AND Dnumber < 21)
    for bad in (0, 21, -3, 100):
        assert error_of(c, "INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('X', ?)", (bad,)) \
            == 'CHECK constraint failed: Dnumber > 0 AND Dnumber < 21'
    for good in (2, 20):
        assert error_of(c, "INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('X', ?)", (good,)) is None
    # NOT NULL 없이 CHECK만 있으면 NULL은 통과한다 (NULL > 0은 참도 거짓도 아니다)
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.execute("CREATE TABLE D (Dnumber INT CHECK (Dnumber > 0 AND Dnumber < 21))")
    k.execute("INSERT INTO D VALUES (NULL)")
    assert rows(k, "SELECT COUNT(*) FROM D") == [(1,)]
    try:
        k.execute("INSERT INTO D VALUES (0)")
        raise AssertionError('0이 들어갔다')
    except sqlite3.IntegrityError:
        pass
    # CHECK는 값을 고칠 때도 따진다
    k.execute("INSERT INTO D VALUES (5)")
    try:
        k.execute("UPDATE D SET Dnumber = 30 WHERE Dnumber = 5")
        raise AssertionError('30으로 고쳐졌다')
    except sqlite3.IntegrityError as e:
        assert str(e) == 'CHECK constraint failed: Dnumber > 0 AND Dnumber < 21'
    k.execute("UPDATE D SET Dnumber = 20 WHERE Dnumber = 5")
    assert rows(k, "SELECT COUNT(*) FROM D WHERE Dnumber = 20") == [(1,)]

    # --- 4. SQLite의 기본 키와 NULL
    k.execute("CREATE TABLE P (Ssn CHAR(9), Name VARCHAR(15), PRIMARY KEY (Ssn))")           # NOT NULL을 안 썼다
    k.execute("INSERT INTO P VALUES (NULL, 'x')")
    k.execute("INSERT INTO P VALUES (NULL, 'y')")
    assert rows(k, "SELECT COUNT(*) FROM P WHERE Ssn IS NULL") == [(2,)]                     # 표준과 달리 두 번이나 받는다
    k.execute("CREATE TABLE P2 (Ssn CHAR(9) NOT NULL, Name VARCHAR(15), PRIMARY KEY (Ssn))")
    try:
        k.execute("INSERT INTO P2 VALUES (NULL, 'x')")
        raise AssertionError('NOT NULL인데 NULL이 들어갔다')
    except sqlite3.IntegrityError as e:
        assert str(e) == 'NOT NULL constraint failed: P2.Ssn'

    print('ALL CHECKS PASSED')
```
{% endraw %}
