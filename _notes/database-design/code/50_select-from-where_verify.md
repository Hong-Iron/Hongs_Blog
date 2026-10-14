---
layout: "note"
title: "50_select-from-where_verify.py"
display_title: "50_select-from-where_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/select-from-where/"
parent_title: "SELECT-FROM-WHERE"
description: "데이터베이스 설계 · SELECT-FROM-WHERE 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/50_select-from-where_verify/"
---
{% raw %}
[SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 50.SELECT-FROM-WHERE 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 50_select-from-where_verify.py)
# 확인하는 것
#   1. 슬라이드의 Q0, Q1, Q2 결과 표 (9 p.20~22, 10-2 p.11~13)
#   2. "FROM의 표에서 행을 하나씩 뽑은 모든 조합 -> WHERE가 참인 조합만 -> SELECT의 열만"이라는 읽는 법을
#      파이썬으로 그대로 짜서 SQLite의 답과 견준다. 조합 수가 줄어드는 과정(24 -> 8 -> 4, 144 -> 48 -> 16 -> 2)도 센다
#   3. SELECT * (10-2 p.20), 흔한 실수 두 가지, 확인 문제의 답
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

from itertools import product

TABLES = {'EMPLOYEE': (['Fname', 'Minit', 'Lname', 'Ssn', 'Bdate', 'Address', 'Sex', 'Salary', 'Super_ssn', 'Dno'], EMPLOYEE),
          'DEPARTMENT': (['Dname', 'Dnumber', 'Mgr_ssn', 'Mgr_start_date'], DEPARTMENT),
          'PROJECT': (['Pname', 'Pnumber', 'Plocation', 'Dnum'], PROJECT)}


def combos(table_list):
    """FROM: 표마다 행을 하나씩 뽑은 모든 조합. 조합 하나를 {열 이름: 값} 사전 하나로 만든다."""
    out = []
    for picked in product(*[TABLES[t][1] for t in table_list]):
        d = {}
        for t, row in zip(table_list, picked):
            d.update(zip(TABLES[t][0], row))
        out.append(d)
    return out


def select_from_where(attrs, table_list, cond):
    """SELECT attrs FROM table_list WHERE cond를 적힌 뜻 그대로 계산한다."""
    return [tuple(d[a] for a in attrs) for d in combos(table_list) if cond(d)]


if __name__ == "__main__":
    c = make()

    # --- 1. Q0, Q1, Q2
    q0 = "SELECT Bdate, Address FROM EMPLOYEE WHERE Fname = 'John' AND Minit = 'B' AND Lname = 'Smith'"
    assert rows(c, q0) == [('1965-01-09', '731 Fondren, Houston, TX')]
    q1 = "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno"
    q1_slide = [('John', 'Smith', '731 Fondren, Houston, TX'), ('Franklin', 'Wong', '638 Voss, Houston, TX'),
                ('Ramesh', 'Narayan', '975 Fire Oak, Humble, TX'), ('Joyce', 'English', '5631 Rice, Houston, TX')]
    assert sorted(rows(c, q1)) == sorted(q1_slide)           # 행이 나오는 차례는 정해져 있지 않아 차례를 빼고 견준다
    q2 = ("SELECT Pnumber, Dnum, Lname, Address, Bdate FROM PROJECT, DEPARTMENT, EMPLOYEE "
          "WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Plocation = 'Stafford'")
    q2_slide = [(10, 4, 'Wallace', '291 Berry, Bellaire, TX', '1941-06-20'), (30, 4, 'Wallace', '291 Berry, Bellaire, TX', '1941-06-20')]
    assert sorted(rows(c, q2)) == sorted(q2_slide)

    # --- 2. 읽는 법대로 계산해도 같은 답이 나온다
    assert select_from_where(['Bdate', 'Address'], ['EMPLOYEE'],
                             lambda d: d['Fname'] == 'John' and d['Minit'] == 'B' and d['Lname'] == 'Smith') == rows(c, q0)
    assert sorted(select_from_where(['Fname', 'Lname', 'Address'], ['EMPLOYEE', 'DEPARTMENT'],
                                    lambda d: d['Dname'] == 'Research' and d['Dnumber'] == d['Dno'])) == sorted(q1_slide)
    assert sorted(select_from_where(['Pnumber', 'Dnum', 'Lname', 'Address', 'Bdate'], ['PROJECT', 'DEPARTMENT', 'EMPLOYEE'],
                                    lambda d: d['Dnum'] == d['Dnumber'] and d['Mgr_ssn'] == d['Ssn'] and d['Plocation'] == 'Stafford')) == sorted(q2_slide)

    # Q1의 조합 수: 8 x 3 = 24 -> Dname = 'Research' 8 -> Dnumber = Dno 4
    all1 = combos(['EMPLOYEE', 'DEPARTMENT'])
    step1 = [d for d in all1 if d['Dname'] == 'Research']
    step2 = [d for d in step1 if d['Dnumber'] == d['Dno']]
    assert (len(all1), len(step1), len(step2)) == (24, 8, 4)
    # Q2의 조합 수: 6 x 3 x 8 = 144 -> Plocation = 'Stafford' 48 -> Dnum = Dnumber 16 -> Mgr_ssn = Ssn 2
    all2 = combos(['PROJECT', 'DEPARTMENT', 'EMPLOYEE'])
    s1 = [d for d in all2 if d['Plocation'] == 'Stafford']
    s2 = [d for d in s1 if d['Dnum'] == d['Dnumber']]
    s3 = [d for d in s2 if d['Mgr_ssn'] == d['Ssn']]
    assert (len(all2), len(s1), len(s2), len(s3)) == (144, 48, 16, 2)
    assert rows(c, "SELECT COUNT(*) FROM PROJECT, DEPARTMENT, EMPLOYEE") == [(144,)]
    # 남은 두 조합: (Computerization, Administration, Wallace), (Newbenefits, Administration, Wallace)
    assert [(d['Pname'], d['Dname'], d['Lname']) for d in s3] == [('Computerization', 'Administration', 'Wallace'),
                                                                  ('Newbenefits', 'Administration', 'Wallace')]

    # 무작위 조건 200개로 파이썬 계산과 SQLite를 견준다 (EMPLOYEE x DEPARTMENT)
    import random
    rng = random.Random(50)
    for _ in range(200):
        sal, dno, use_join = rng.choice([20000, 25000, 30000, 40000, 50000]), rng.choice([1, 4, 5]), rng.random() < 0.5
        sql = "SELECT Lname, Dname FROM EMPLOYEE, DEPARTMENT WHERE Salary > %d AND Dnumber = %d" % (sal, dno)
        cond = lambda d: d['Salary'] > sal and d['Dnumber'] == dno
        if use_join:
            sql += " AND Dno = Dnumber"
            cond = lambda d: d['Salary'] > sal and d['Dnumber'] == dno and d['Dno'] == d['Dnumber']
        assert sorted(rows(c, sql)) == sorted(select_from_where(['Lname', 'Dname'], ['EMPLOYEE', 'DEPARTMENT'], cond))

    # --- 3. SELECT *
    q1c = rows(c, "SELECT * FROM EMPLOYEE WHERE Dno = 5")
    assert len(q1c) == 4 and len(q1c[0]) == 10 and sorted(r[2] for r in q1c) == ['English', 'Narayan', 'Smith', 'Wong']
    q1d = rows(c, "SELECT * FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dno = Dnumber")
    assert len(q1d) == 4 and len(q1d[0]) == 14                      # EMPLOYEE 10열 + DEPARTMENT 4열

    # 흔한 실수 1: 조인 조건을 빼먹으면 모든 직원이 Research 직원처럼 나온다
    assert len(rows(c, "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research'")) == 8
    # 흔한 실수 2: 문자열에 따옴표를 안 붙이면 열 이름으로 읽는다
    assert error_of(c, "SELECT Bdate, Address FROM EMPLOYEE WHERE Lname = Smith") == 'no such column: Smith'
    # WHERE는 SELECT에 없는 열도 쓴다 (Q0의 Fname, Minit, Lname)
    assert rows(c, "SELECT Bdate FROM EMPLOYEE WHERE Lname = 'Smith'") == [('1965-01-09',)]
    # 조건에 맞는 행이 없으면 오류가 아니라 0행이다
    assert rows(c, "SELECT Bdate FROM EMPLOYEE WHERE Lname = 'Brown'") == []

    # --- 확인 문제
    # C2: Administration 부서 직원
    assert sorted(rows(c, "SELECT Fname, Lname FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Administration' AND Dnumber = Dno")) \
        == sorted([('Alicia', 'Zelaya'), ('Jennifer', 'Wallace'), ('Ahmad', 'Jabbar')])
    # C3: Houston에 있는 프로젝트의 이름과 맡은 부서의 이름
    assert sorted(rows(c, "SELECT Pname, Dname FROM PROJECT, DEPARTMENT WHERE Dnum = Dnumber AND Plocation = 'Houston'")) \
        == [('ProductZ', 'Research'), ('Reorganization', 'Headquarters')]
    # C4: Q2에서 Mgr_ssn = Ssn을 빼면 2 x 8 = 16행
    assert len(rows(c, "SELECT Pnumber, Dnum, Lname FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Plocation = 'Stafford'")) == 16
    # C5: 월급이 30000보다 많은 5번 부서 직원 (선택 조건만 둘, 조인 조건 없음)
    assert sorted(rows(c, "SELECT Lname, Salary FROM EMPLOYEE WHERE Salary > 30000 AND Dno = 5")) == [('Narayan', 38000), ('Wong', 40000)]

    print('ALL CHECKS PASSED')
```
{% endraw %}
