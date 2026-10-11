---
layout: "note"
title: "49_sql-key-clauses_verify.py"
display_title: "49_sql-key-clauses_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-key-clauses/"
parent_title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
description: "데이터베이스 설계 · PRIMARY KEY·UNIQUE·FOREIGN KEY 절 검증 코드"
permalink: "/studies/database-design/code/49_sql-key-clauses_verify/"
---
{% raw %}
[PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 49.PRIMARY KEY·UNIQUE·FOREIGN KEY 절 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 49_sql-key-clauses_verify.py)
# 확인하는 것 (슬라이드 10 p.18~19의 DEPARTMENT, DEPT_LOCATIONS)
#   1. PRIMARY KEY (Dnumber): 같은 부서 번호를 두 번 못 넣는다
#   2. UNIQUE (Dname): 기본 키가 아니어도 같은 이름을 두 번 못 넣는다
#   3. PRIMARY KEY (Dnumber, Dlocation): 두 값의 짝이 겹칠 때만 막는다
#   4. FOREIGN KEY: 가리키는 값이 상대 표에 있어야 한다. NULL은 된다
#   5. 기본 키는 표에 하나뿐이고 UNIQUE는 여럿 둘 수 있다
# 제약에 붙인 이름(EMPPK 등)이 오류 글에 나오는 것은 PostgreSQL에서 확인했다(49_sql-key-clauses_verify.sql).
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

    # --- 1. PRIMARY KEY (Dnumber)
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Sales', 5, '888665555', NULL)") == 'UNIQUE constraint failed: DEPARTMENT.Dnumber'
    # --- 2. UNIQUE (Dname)
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Research', 7, '888665555', NULL)") == 'UNIQUE constraint failed: DEPARTMENT.Dname'
    # 번호도 이름도 새것이면 들어간다
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Sales', 7, '888665555', NULL)") is None

    # --- 3. 두 열짜리 기본 키
    assert rows(c, "SELECT Dlocation FROM DEPT_LOCATIONS WHERE Dnumber = 5 ORDER BY Dlocation") == [('Bellaire',), ('Houston',), ('Sugarland',)]
    assert rows(c, "SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston' ORDER BY Dnumber") == [(1,), (5,)]
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (5, 'Houston')") \
        == 'UNIQUE constraint failed: DEPT_LOCATIONS.Dnumber, DEPT_LOCATIONS.Dlocation'      # 짝이 겹친다
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (4, 'Houston')") is None           # 4번은 처음, Houston은 이미 있지만 짝은 새것
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (5, 'Stafford')") is None

    # --- 4. FOREIGN KEY
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (3, 'Houston')") == 'FOREIGN KEY constraint failed'   # 3번 부서는 없다
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Sales', 7, '111111111', NULL)") == 'FOREIGN KEY constraint failed'
    assert rows(c, "SELECT Lname FROM EMPLOYEE WHERE Super_ssn IS NULL") == [('Borg',)]      # 외래 키 값이 NULL인 행
    # 외래 키가 가리키는 열은 모두 상대 표의 기본 키다
    for t in ('EMPLOYEE', 'DEPARTMENT', 'DEPT_LOCATIONS', 'PROJECT', 'WORKS_ON', 'DEPENDENT'):
        for fk in rows(c, 'PRAGMA foreign_key_list(%s)' % t):
            parent, parent_col = fk[2], fk[4]
            pk_cols = [r[1] for r in rows(c, 'PRAGMA table_info(%s)' % parent) if r[5] > 0]
            assert pk_cols == [parent_col], (t, parent, parent_col)

    # --- 5. 기본 키는 하나, UNIQUE는 여럿
    k = sqlite3.connect(':memory:', isolation_level=None)
    try:
        k.execute("CREATE TABLE CAR (License_number CHAR(8) PRIMARY KEY, Engine_serial_number CHAR(6) PRIMARY KEY)")
        raise AssertionError('기본 키를 둘 받았다')
    except sqlite3.OperationalError as e:
        assert 'more than one primary key' in str(e)
    k.execute("""CREATE TABLE CAR (License_number CHAR(8) NOT NULL, Engine_serial_number CHAR(6) NOT NULL, Make VARCHAR(10),
                 PRIMARY KEY (License_number), UNIQUE (Engine_serial_number))""")
    k.execute("INSERT INTO CAR VALUES ('TEXASABC', 'A69352', 'Ford')")
    for bad in ("('TEXASABC', 'B43696', 'Ford')", "('FLORTYW', 'A69352', 'Ford')"):
        try:
            k.execute('INSERT INTO CAR VALUES ' + bad)
            raise AssertionError('겹치는 키가 들어갔다')
        except sqlite3.IntegrityError:
            pass
    # UNIQUE 열은 NOT NULL을 안 붙이면 NULL을 여러 번 받는다
    k.execute("CREATE TABLE U (a INT, UNIQUE (a))")
    k.execute("INSERT INTO U VALUES (NULL), (NULL), (1)")
    assert rows(k, "SELECT COUNT(*) FROM U") == [(3,)]

    # 이름 붙인 제약 (슬라이드 10 p.16): SQLite도 문법은 받는다
    k.execute("""CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555',
                 CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname))""")
    k.execute("INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Research', 5)")
    try:
        k.execute("INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Research', 6)")
        raise AssertionError('DEPTSK가 안 걸렸다')
    except sqlite3.IntegrityError as e:
        assert str(e) == 'UNIQUE constraint failed: DEPARTMENT.Dname'       # 이름 DEPTSK는 오류 글에 안 나온다

    # 확인 문제 C3: UNIQUE (Dname)을 빼면 Research가 둘이 될 수 있고, 이름으로 찾는 질의가 두 부서를 섞는다
    no_unique = COMPANY_DDL.replace('PRIMARY KEY (Dnumber), UNIQUE (Dname),', 'PRIMARY KEY (Dnumber),')
    assert no_unique != COMPANY_DDL
    u = make(no_unique)
    u.execute("INSERT INTO DEPARTMENT VALUES ('Research', 7, '888665555', NULL)")
    u.execute("UPDATE EMPLOYEE SET Dno = 7 WHERE Lname = 'Borg'")
    got = rows(u, "SELECT Lname FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno")
    assert sorted(r[0] for r in got) == ['Borg', 'English', 'Narayan', 'Smith', 'Wong']

    print('ALL CHECKS PASSED')
```
{% endraw %}
