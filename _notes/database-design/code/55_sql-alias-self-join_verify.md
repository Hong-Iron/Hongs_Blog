---
layout: "note"
title: "55_sql-alias-self-join_verify.py"
display_title: "55_sql-alias-self-join_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "55"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-alias-self-join/"
parent_title: "별칭과 자기 조인"
description: "데이터베이스 설계 · 별칭과 자기 조인 검증 코드"
permalink: "/studies/database-design/code/55_sql-alias-self-join_verify/"
---
{% raw %}
[별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 55.별칭과 자기 조인 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 55_sql-alias-self-join_verify.py)
# 확인하는 것 (슬라이드 10-2 p.14~17, 11-2 p.4, 14, 19)
#   1. 두 표에 같은 이름의 열이 있으면 표 이름을 붙여야 한다
#   2. 별칭 E, D를 붙인 질의는 긴 이름으로 쓴 질의와 답이 같다
#   3. 일부러 틀린 판(E 하나만 씀)은 0행, 고친 판(E와 S)은 슬라이드의 7행
#   4. 결과 열 이름 바꾸기(AS Employee_name), 확인 문제의 답
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


def same(a, b):
    """행이 나오는 차례는 정해져 있지 않으므로 차례를 빼고 견준다."""
    return sorted(a) == sorted(b)


if __name__ == "__main__":
    c = make()

    # --- 1. 같은 이름의 열 (슬라이드 10-2 p.14는 두 표에 Name과 Dnumber가 있다고 가정한다)
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.executescript("""CREATE TABLE EMPLOYEE (Fname, Name, Address, Dnumber);
                       CREATE TABLE DEPARTMENT (Name, Dnumber);
                       INSERT INTO EMPLOYEE VALUES ('John', 'Smith', '731 Fondren, Houston, TX', 5), ('Alicia', 'Zelaya', '3321 Castle, Spring, TX', 4);
                       INSERT INTO DEPARTMENT VALUES ('Research', 5), ('Administration', 4);""")
    try:
        k.execute("SELECT Fname, Name, Address FROM EMPLOYEE, DEPARTMENT WHERE Name = 'Research' AND Dnumber = Dnumber")
        raise AssertionError('헷갈리는 이름을 받았다')
    except sqlite3.OperationalError as e:
        assert str(e) == 'ambiguous column name: Name'
    assert rows(k, """SELECT Fname, EMPLOYEE.Name, Address FROM EMPLOYEE, DEPARTMENT
                      WHERE DEPARTMENT.Name = 'Research' AND DEPARTMENT.Dnumber = EMPLOYEE.Dnumber""") \
        == [('John', 'Smith', '731 Fondren, Houston, TX')]

    # --- 2. 긴 이름 = 별칭 (COMPANY에서는 이름이 겹치지 않아 안 붙여도 된다)
    plain = rows(c, "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno")
    full = rows(c, """SELECT EMPLOYEE.Fname, EMPLOYEE.Lname, EMPLOYEE.Address FROM EMPLOYEE, DEPARTMENT
                      WHERE DEPARTMENT.Dname = 'Research' AND DEPARTMENT.Dnumber = EMPLOYEE.Dno""")
    alias = rows(c, "SELECT E.Fname, E.Lname, E.Address FROM EMPLOYEE AS E, DEPARTMENT AS D WHERE D.Dname = 'Research' AND D.Dnumber = E.Dno")
    no_as = rows(c, "SELECT E.Fname, E.Lname, E.Address FROM EMPLOYEE E, DEPARTMENT D WHERE D.Dname = 'Research' AND D.Dnumber = E.Dno")
    assert same(plain, full) and same(plain, alias) and same(plain, no_as) and len(plain) == 4
    # 별칭을 붙이면 그 질의 안에서는 원래 이름을 못 쓴다
    assert error_of(c, "SELECT EMPLOYEE.Fname FROM EMPLOYEE AS E WHERE E.Dno = 5") == 'no such column: EMPLOYEE.Fname'

    # --- 3. 자기 조인
    # 별칭 없이 같은 표를 두 번 적으면 어느 쪽 열인지 가릴 수 없다
    assert error_of(c, "SELECT Fname, Lname FROM EMPLOYEE, EMPLOYEE WHERE Super_ssn = Ssn") == 'ambiguous column name: Fname'
    # 틀린 판 (10-2 p.15~16). 슬라이드에 적힌 그대로는 FROM 앞의 쉼표 때문에 구문 오류다
    assert 'syntax error' in error_of(c, "SELECT E.Fname, E.Lname, E.Fname, E.Lname, FROM EMPLOYEE AS E WHERE E.Super_ssn = E.Ssn")
    # 쉼표를 지워도 0행이다. 자기가 자기 상사인 직원은 없다
    assert rows(c, "SELECT E.Fname, E.Lname, E.Fname, E.Lname FROM EMPLOYEE AS E WHERE E.Super_ssn = E.Ssn") == []
    # 고친 판 (10-2 p.17)
    q8 = "SELECT E.Fname, E.Lname, S.Fname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn"
    assert same(rows(c, q8), [('John', 'Smith', 'Franklin', 'Wong'), ('Franklin', 'Wong', 'James', 'Borg'),
                              ('Alicia', 'Zelaya', 'Jennifer', 'Wallace'), ('Jennifer', 'Wallace', 'James', 'Borg'),
                              ('Ramesh', 'Narayan', 'Franklin', 'Wong'), ('Joyce', 'English', 'Franklin', 'Wong'),
                              ('Ahmad', 'Jabbar', 'Jennifer', 'Wallace')])
    # 8 x 8 = 64쌍 가운데 7쌍이 남는다. Borg는 Super_ssn이 NULL이라 직원 쪽(E)으로는 한 번도 안 나온다
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE AS E, EMPLOYEE AS S") == [(64,)]
    assert 'Borg' not in [r[1] for r in rows(c, q8)] and 'Borg' in [r[3] for r in rows(c, q8)]
    # 두 별칭의 자리를 바꾸면 뜻이 뒤집힌다: 상사 쪽 조건을 E.Ssn = S.Super_ssn으로 적으면 E가 상사다
    swapped = rows(c, "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Ssn = S.Super_ssn")
    assert sorted(swapped) == sorted((r[3], r[1]) for r in rows(c, q8))

    # --- 4. 결과 열 이름 바꾸기 (11-2 p.19)
    cur = c.execute("SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn")
    assert [d[0] for d in cur.description] == ['Employee_name', 'Supervisor_name']
    assert same(cur.fetchall(), [('Smith', 'Wong'), ('Wong', 'Borg'), ('Zelaya', 'Wallace'), ('Wallace', 'Borg'),
                                 ('Narayan', 'Wong'), ('English', 'Wong'), ('Jabbar', 'Wallace')])
    cur = c.execute("SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn")
    assert [d[0] for d in cur.description] == ['Lname', 'Lname']                # 이름을 안 바꾸면 두 열 이름이 같다

    # --- 확인 문제
    # Wong이 상사인 직원 (연습 4-c와 같은 답)
    assert same(rows(c, "SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn AND S.Fname = 'Franklin' AND S.Lname = 'Wong'"),
                [('John', 'Smith'), ('Ramesh', 'Narayan'), ('Joyce', 'English')])
    # Jennifer Wallace가 직속 상사인 직원
    assert same(rows(c, "SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn AND S.Fname = 'Jennifer' AND S.Lname = 'Wallace'"),
                [('Alicia', 'Zelaya'), ('Ahmad', 'Jabbar')])
    # 확인 문제 C2: 상사 쪽으로 나오는 사람은 셋뿐이다
    assert sorted(set(r[0] for r in rows(c, "SELECT S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn"))) == ['Borg', 'Wallace', 'Wong']
    # 예제 1: 상사와 다른 부서에서 일하는 직원
    assert same(rows(c, "SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn AND E.Dno <> S.Dno"),
                [('Wong', 'Borg'), ('Wallace', 'Borg')])
    # 예제 2: 상사의 상사 (같은 표를 세 번)
    assert same(rows(c, """SELECT E.Lname, T.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S, EMPLOYEE AS T
                           WHERE E.Super_ssn = S.Ssn AND S.Super_ssn = T.Ssn"""),
                [('Smith', 'Borg'), ('Zelaya', 'Borg'), ('Narayan', 'Borg'), ('English', 'Borg'), ('Jabbar', 'Borg')])

    print('ALL CHECKS PASSED')
```
{% endraw %}
