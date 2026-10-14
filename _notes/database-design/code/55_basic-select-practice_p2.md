---
layout: "note"
title: "55_basic-select-practice_p2.py"
display_title: "55_basic-select-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "55"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/basic-select-practice/"
parent_title: "기본 검색 연습"
description: "데이터베이스 설계 · 기본 검색 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/55_basic-select-practice_p2/"
---
{% raw %}
[기본 검색 연습](/Hongs_Blog/studies/database-design/basic-select-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 55.기본 검색 연습 p2 (a, b, c) 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 55_basic-select-practice_p2.py)
# 문제 (슬라이드 10-2 p.25 연습 4). 풀이는 10-11-SQL-Solutions p.21~23.
#   a. 5번 부서 직원 가운데 ProductX 프로젝트에서 주 10시간 넘게 일하는 직원의 이름
#   b. 자기와 이름(first name)이 같은 부양가족이 있는 직원의 이름
#   c. Franklin Wong이 직접 감독하는 직원의 이름
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


# a. 풀이 슬라이드 p.21에 적힌 그대로: WORKS_ON과 PROJECT를 잇는 조건(W.Pno = P.Pnumber)이 없다
A_SLIDE = """SELECT E.Fname, E.Lname
             FROM EMPLOYEE AS E, PROJECT AS P, WORKS_ON AS W
             WHERE E.Dno = 5 AND E.Ssn = W.Essn AND P.Pname = 'ProductX'
               AND E.Dno = P.Dnum AND W.Hours > 10"""
A_FIXED = """SELECT E.Fname, E.Lname
             FROM EMPLOYEE AS E, PROJECT AS P, WORKS_ON AS W
             WHERE E.Dno = 5 AND E.Ssn = W.Essn AND W.Pno = P.Pnumber
               AND P.Pname = 'ProductX' AND W.Hours > 10"""
B = """SELECT E.Fname, E.Lname
       FROM EMPLOYEE AS E, DEPENDENT AS D
       WHERE E.Ssn = D.Essn AND E.Fname = D.Dependent_name"""
C_JOIN = """SELECT E.Fname, E.Lname
            FROM EMPLOYEE AS E, EMPLOYEE AS S
            WHERE E.Super_ssn = S.Ssn AND S.Fname = 'Franklin' AND S.Lname = 'Wong'"""
C_NESTED = """SELECT E.Fname, E.Lname
              FROM EMPLOYEE AS E
              WHERE E.Super_ssn = (SELECT E.Ssn FROM EMPLOYEE AS E WHERE E.Fname = 'Franklin' AND E.Lname = 'Wong')"""

if __name__ == "__main__":
    c = make()

    # --- a
    assert sorted(rows(c, A_FIXED)) == [('John', 'Smith'), ('Joyce', 'English')]                      # 슬라이드가 표에 표시한 답
    assert sorted(rows(c, A_SLIDE)) == [('John', 'Smith'), ('Joyce', 'English'), ('Joyce', 'English'), ('Ramesh', 'Narayan')]   # 적힌 그대로 돌린 답
    # 왜 넷인가: ProductX와 무관하게 "5번 부서 직원이 10시간 넘게 일하는 WORKS_ON 행"을 센 것이다
    over10 = rows(c, "SELECT E.Lname, W.Pno, W.Hours FROM EMPLOYEE AS E, WORKS_ON AS W WHERE E.Dno = 5 AND E.Ssn = W.Essn AND W.Hours > 10")
    assert sorted(over10) == [('English', 1, 20), ('English', 2, 20), ('Narayan', 3, 40), ('Smith', 1, 32.5)]
    # ProductX는 1번 프로젝트다. 그 넷 가운데 Pno = 1인 것만이 맞는 답이다
    assert rows(c, "SELECT Pnumber FROM PROJECT WHERE Pname = 'ProductX'") == [(1,)]
    assert sorted(r[0] for r in over10 if r[1] == 1) == ['English', 'Smith']
    # E.Dno = P.Dnum은 있어도 없어도 답이 같다 (ProductX는 5번 부서의 프로젝트다)
    with_dnum = A_FIXED + " AND E.Dno = P.Dnum"
    assert sorted(rows(c, with_dnum)) == sorted(rows(c, A_FIXED))

    # --- b: 0행
    assert rows(c, B) == []
    names = {r[0] for r in rows(c, "SELECT Fname FROM EMPLOYEE")}
    dep_names = {r[0] for r in rows(c, "SELECT Dependent_name FROM DEPENDENT")}
    assert names & dep_names == set()                       # 직원 이름과 겹치는 부양가족 이름이 아예 없다
    # 조인 조건 E.Ssn = D.Essn을 빼도 0행이지만, 그것은 우연이다. 이름만 같은 남의 부양가족까지 잡는 질의가 된다
    c.execute('SAVEPOINT b')
    c.execute("INSERT INTO DEPENDENT VALUES ('123456789', 'Joyce', 'F', '1990-01-01', 'Daughter')")    # Smith의 딸 Joyce
    assert rows(c, B) == []                                                                            # 맞는 질의: 여전히 0행
    assert rows(c, "SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, DEPENDENT AS D WHERE E.Fname = D.Dependent_name") == [('Joyce', 'English')]
    c.execute("INSERT INTO DEPENDENT VALUES ('453453453', 'Joyce', 'F', '1995-01-01', 'Daughter')")    # Joyce English의 딸 Joyce
    assert rows(c, B) == [('Joyce', 'English')]
    c.execute('ROLLBACK TO b')
    c.execute('RELEASE b')

    # --- c
    want = [('John', 'Smith'), ('Joyce', 'English'), ('Ramesh', 'Narayan')]
    assert sorted(rows(c, C_JOIN)) == want
    assert sorted(rows(c, C_NESTED)) == want                # 풀이 슬라이드 p.23의 중첩 질의 판
    assert rows(c, "SELECT Ssn FROM EMPLOYEE WHERE Fname = 'Franklin' AND Lname = 'Wong'") == [('333445555',)]    # 안쪽 질의의 답은 한 행
    assert sorted(rows(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE Super_ssn = '333445555'")) == want

    # --- 변형
    # a': 4번 부서 직원 가운데 Newbenefits에서 주 10시간 넘게 일하는 직원
    assert sorted(rows(c, """SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, PROJECT AS P, WORKS_ON AS W
                             WHERE E.Dno = 4 AND E.Ssn = W.Essn AND W.Pno = P.Pnumber AND P.Pname = 'Newbenefits' AND W.Hours > 10""")) \
        == [('Alicia', 'Zelaya'), ('Jennifer', 'Wallace')]
    # b': 배우자(Spouse)가 부양가족으로 올라 있는 직원
    assert sorted(rows(c, "SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, DEPENDENT AS D WHERE E.Ssn = D.Essn AND D.Relationship = 'Spouse'")) \
        == [('Franklin', 'Wong'), ('Jennifer', 'Wallace'), ('John', 'Smith')]
    # c': James Borg가 직접 감독하는 직원
    assert sorted(rows(c, """SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S
                             WHERE E.Super_ssn = S.Ssn AND S.Fname = 'James' AND S.Lname = 'Borg'""")) \
        == [('Franklin', 'Wong'), ('Jennifer', 'Wallace')]

    print('ALL CHECKS PASSED')
```
{% endraw %}
