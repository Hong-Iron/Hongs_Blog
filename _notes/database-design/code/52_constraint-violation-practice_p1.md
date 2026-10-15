---
layout: "note"
title: "52_constraint-violation-practice_p1.py"
display_title: "52_constraint-violation-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "52"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/constraint-violation-practice/"
parent_title: "제약 위반 찾기 연습"
description: "데이터베이스 설계 · 제약 위반 찾기 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/52_constraint-violation-practice_p1/"
---
{% raw %}
[제약 위반 찾기 연습](/Hongs_Blog/studies/database-design/constraint-violation-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 52.제약 위반 찾기 연습 p1 (a~k) 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 52_constraint-violation-practice_p1.py)
# 문제: 열한 연산을 COMPANY 상태에 하나씩 따로 적용할 때 어기는 제약을 찾는다.
# 연산마다 (1) SQLite가 받는지 막는지, (2) 어긴 제약을 하나씩 떼어 확인한 결과, (3) 막힌 연산을 통과시키는 방법을 확인한다.
# 문서의 "두 제약을 함께 어긴다"는 한 번에 볼 수 없다(DBMS는 먼저 걸린 것 하나만 알려 준다). 그래서 한쪽만 고친 문장을 따로 돌린다.
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7). DDL은 46.CREATE SCHEMA와 CREATE TABLE의 문장을 따른다.
# 그 문장과 다른 곳은 하나다. EMPLOYEE의 외래 키 두 개를 ALTER TABLE 대신 CREATE TABLE 안에 적었다(SQLite는
# 아직 없는 표를 가리켜도 받는다). WORKS_ON.Hours에는 NOT NULL이 없다(상태에 Hours가 NULL인 행이 있다).
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


A = """INSERT INTO EMPLOYEE VALUES ('Robert', 'F', 'Scott', '943775543', '1972-06-21', '2365 Newcastle Rd, Bellaire, TX', 'M', 58000, '888665555', 1)"""
B = "INSERT INTO PROJECT VALUES ('ProductA', 4, 'Bellaire', 2)"
C = "INSERT INTO DEPARTMENT VALUES ('Production', 4, '943775543', '2007-10-01')"
D = "INSERT INTO WORKS_ON VALUES ('677678989', NULL, '40.0')"
E = "INSERT INTO DEPENDENT VALUES ('453453453', 'John', 'M', '1990-12-12', 'spouse')"
F = "DELETE FROM WORKS_ON WHERE Essn = '333445555'"
G = "DELETE FROM EMPLOYEE WHERE Ssn = '987654321'"
H = "DELETE FROM PROJECT WHERE Pname = 'ProductX'"
I = "UPDATE DEPARTMENT SET Mgr_ssn = '123456789', Mgr_start_date = '2007-10-01' WHERE Dnumber = 5"
J = "UPDATE EMPLOYEE SET Super_ssn = '943775543' WHERE Ssn = '999887777'"
K = "UPDATE WORKS_ON SET Hours = '5.0' WHERE Essn = '999887777' AND Pno = 10"


def count(c, sql, args=()):
    return rows(c, sql, args)[0][0]


if __name__ == "__main__":
    c = make()
    FKERR = 'FOREIGN KEY constraint failed'

    # 받는 연산: a, e, f, i, k / 막는 연산: b, c, d, g, h, j
    verdict = {name: error_of(c, sql) for name, sql in zip('abcdefghijk', (A, B, C, D, E, F, G, H, I, J, K))}
    assert [n for n in 'abcdefghijk' if verdict[n] is None] == ['a', 'e', 'f', 'i', 'k']
    assert [n for n in 'abcdefghijk' if verdict[n] is not None] == ['b', 'c', 'd', 'g', 'h', 'j']

    # --- a. 위반 없음: Ssn이 새 값이고, 상사 888665555(Borg)와 1번 부서가 있다
    assert count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '943775543'") == 0
    assert count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '888665555'") == 1
    assert count(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Dnumber = 1") == 1
    assert len('2365 Newcastle Rd, Bellaire, TX') == 31            # 주소는 31글자다. Address는 VARCHAR(30)이다 (SQLite는 길이를 안 본다)

    # --- b. 참조 무결성: 2번 부서가 없다. 키 제약은 괜찮다(Pnumber 4와 ProductA는 새 값)
    assert verdict['b'] == FKERR
    assert count(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Dnumber = 2") == 0
    assert count(c, "SELECT COUNT(*) FROM PROJECT WHERE Pnumber = 4 OR Pname = 'ProductA'") == 0
    # 통과시키는 방법 1: 있는 부서 번호로 고친다
    assert error_of(c, "INSERT INTO PROJECT VALUES ('ProductA', 4, 'Bellaire', 5)") is None
    # 방법 2: 2번 부서를 먼저 넣는다
    c.execute('SAVEPOINT b2')
    c.execute("INSERT INTO DEPARTMENT VALUES ('Production', 2, '888665555', '2007-10-01')")
    c.execute(B)
    assert count(c, "SELECT COUNT(*) FROM PROJECT") == 7
    c.execute('ROLLBACK TO b2')
    c.execute('RELEASE b2')

    # --- c. 키 제약 + 참조 무결성
    assert verdict['c'] == 'UNIQUE constraint failed: DEPARTMENT.Dnumber'      # 먼저 걸리는 것은 키
    assert count(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Dnumber = 4") == 1   # Administration이 4번이다
    assert count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '943775543'") == 0
    # 번호만 새것(6)으로 고치면 참조 무결성에 걸린다
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Production', 6, '943775543', '2007-10-01')") == FKERR
    # 관리자만 있는 직원으로 고치면 키에 걸린다
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Production', 4, '888665555', '2007-10-01')") == 'UNIQUE constraint failed: DEPARTMENT.Dnumber'
    # 둘 다 고치면 들어간다
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Production', 6, '888665555', '2007-10-01')") is None
    # (a)를 먼저 했다고 치면 943775543이 직원이 되어, (c)가 어기는 것은 키 제약 하나만 남는다
    c.execute('SAVEPOINT after_a')
    c.execute(A)
    assert error_of(c, "INSERT INTO DEPARTMENT VALUES ('Production', 6, '943775543', '2007-10-01')") is None
    assert error_of(c, C) == 'UNIQUE constraint failed: DEPARTMENT.Dnumber'
    assert error_of(c, J) is None                                               # (j)도 그때는 위반이 없다
    c.execute('ROLLBACK TO after_a')
    c.execute('RELEASE after_a')

    # --- d. 개체 무결성 + 참조 무결성
    assert verdict['d'] == 'NOT NULL constraint failed: WORKS_ON.Pno'           # 기본 키 {Essn, Pno}의 한 열이 NULL
    assert count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '677678989'") == 0
    assert error_of(c, "INSERT INTO WORKS_ON VALUES ('677678989', 1, '40.0')") == FKERR                    # Pno만 채우면 참조 무결성
    assert error_of(c, "INSERT INTO WORKS_ON VALUES ('666884444', NULL, '40.0')") == 'NOT NULL constraint failed: WORKS_ON.Pno'   # Essn만 고치면 개체 무결성
    assert error_of(c, "INSERT INTO WORKS_ON VALUES ('666884444', 1, '40.0')") is None                     # 둘 다 고치면 들어간다

    # --- e. 위반 없음: 453453453(Joyce English)이 있고, (453453453, John)은 새 키다
    assert rows(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE Ssn = '453453453'") == [('Joyce', 'English')]
    assert count(c, "SELECT COUNT(*) FROM DEPENDENT WHERE Essn = '453453453'") == 0

    # --- f. 위반 없음: WORKS_ON을 가리키는 표가 없다. 네 행이 지워진다
    c.execute('SAVEPOINT f')
    assert c.execute(F).rowcount == 4 and count(c, "SELECT COUNT(*) FROM WORKS_ON") == 12
    c.execute('ROLLBACK TO f')
    c.execute('RELEASE f')

    # --- g. 참조 무결성: Wallace(987654321)를 네 표의 여섯 행이 가리킨다
    assert verdict['g'] == FKERR
    refs_g = (count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = '987654321'"), count(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Mgr_ssn = '987654321'"),
              count(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Essn = '987654321'"), count(c, "SELECT COUNT(*) FROM DEPENDENT WHERE Essn = '987654321'"))
    assert refs_g == (2, 1, 2, 1) and sum(refs_g) == 6
    # 통과시키는 방법: 가리키는 여섯 행을 먼저 지우거나 고친다
    c.execute('SAVEPOINT g')
    c.execute("UPDATE EMPLOYEE SET Super_ssn = NULL WHERE Super_ssn = '987654321'")
    c.execute("UPDATE DEPARTMENT SET Mgr_ssn = '888665555' WHERE Mgr_ssn = '987654321'")
    c.execute("DELETE FROM WORKS_ON WHERE Essn = '987654321'")
    c.execute("DELETE FROM DEPENDENT WHERE Essn = '987654321'")
    assert c.execute(G).rowcount == 1 and count(c, "SELECT COUNT(*) FROM EMPLOYEE") == 7
    c.execute('ROLLBACK TO g')
    c.execute('RELEASE g')

    # --- h. 참조 무결성: ProductX(1번)를 WORKS_ON의 두 행이 가리킨다
    assert verdict['h'] == FKERR
    assert rows(c, "SELECT Essn FROM WORKS_ON WHERE Pno = 1 ORDER BY Essn") == [('123456789',), ('453453453',)]
    c.execute('SAVEPOINT h')
    c.execute("DELETE FROM WORKS_ON WHERE Pno = 1")
    assert c.execute(H).rowcount == 1
    c.execute('ROLLBACK TO h')
    c.execute('RELEASE h')

    # --- i. 위반 없음: 새 관리자 123456789(Smith)가 직원이다. Mgr_ssn은 외래 키지만 가리킬 행이 있다
    assert count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '123456789'") == 1
    # 없는 번호로 고치면 참조 무결성에 걸린다
    assert error_of(c, "UPDATE DEPARTMENT SET Mgr_ssn = '943775543' WHERE Dnumber = 5") == FKERR

    # --- j. 참조 무결성: 943775543인 직원이 없다
    assert verdict['j'] == FKERR
    assert error_of(c, "UPDATE EMPLOYEE SET Super_ssn = '888665555' WHERE Ssn = '999887777'") is None      # 있는 직원 번호면 된다
    assert error_of(c, "UPDATE EMPLOYEE SET Super_ssn = NULL WHERE Ssn = '999887777'") is None             # NULL도 된다

    # --- k. 위반 없음: Hours는 기본 키도 외래 키도 아니다
    c.execute('SAVEPOINT k')
    c.execute(K)
    assert rows(c, "SELECT Hours FROM WORKS_ON WHERE Essn = '999887777' AND Pno = 10") == [(5,)]
    c.execute('ROLLBACK TO k')
    c.execute('RELEASE k')

    # 정리: 어긴 제약 (키 / 개체 무결성 / 참조 무결성)
    answer = {'a': set(), 'b': {'참조'}, 'c': {'키', '참조'}, 'd': {'개체', '참조'}, 'e': set(), 'f': set(),
              'g': {'참조'}, 'h': {'참조'}, 'i': set(), 'j': {'참조'}, 'k': set()}
    assert {n for n, v in answer.items() if v} == {n for n in verdict if verdict[n] is not None}
    assert sum(1 for v in answer.values() if '참조' in v) == 6

    # --- 변형 문제
    assert error_of(c, "INSERT INTO DEPT_LOCATIONS VALUES (4, 'Stafford')") == 'UNIQUE constraint failed: DEPT_LOCATIONS.Dnumber, DEPT_LOCATIONS.Dlocation'
    assert error_of(c, "DELETE FROM DEPARTMENT WHERE Dnumber = 4") == FKERR
    assert (count(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Dno = 4"), count(c, "SELECT COUNT(*) FROM DEPT_LOCATIONS WHERE Dnumber = 4"),
            count(c, "SELECT COUNT(*) FROM PROJECT WHERE Dnum = 4")) == (3, 1, 2)
    assert error_of(c, "UPDATE PROJECT SET Pnumber = 20 WHERE Pnumber = 30") == 'UNIQUE constraint failed: PROJECT.Pnumber'
    assert count(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Pno = 30") == 3        # 번호가 안 겹쳐도 이 세 행 때문에 참조 무결성이 깨진다
    assert error_of(c, "UPDATE PROJECT SET Pnumber = 40 WHERE Pnumber = 30") == FKERR
    assert error_of(c, "UPDATE DEPENDENT SET Relationship = 'Husband' WHERE Essn = '987654321' AND Dependent_name = 'Abner'") is None

    print('ALL CHECKS PASSED')
```
{% endraw %}
