---
layout: "note"
title: "51_sql-insert-delete-update_verify.py"
display_title: "51_sql-insert-delete-update_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "51"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-insert-delete-update/"
parent_title: "INSERT·DELETE·UPDATE"
description: "데이터베이스 설계 · INSERT·DELETE·UPDATE 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/51_sql-insert-delete-update_verify/"
---
{% raw %}
[INSERT·DELETE·UPDATE](/Hongs_Blog/studies/database-design/sql-insert-delete-update/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 51.INSERT·DELETE·UPDATE 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 51_sql-insert-delete-update_verify.py)
# 확인하는 것 (슬라이드 9 p.23~24, 26, 28의 문장을 COMPANY 상태에 돌린다)
#   1. INSERT: 값을 열 순서대로 다 적는 꼴, 열 이름을 골라 적는 꼴(안 적은 열은 NULL이나 DEFAULT)
#   2. DELETE: WHERE에 맞는 행을 모두 지운다. 맞는 행이 없으면 0행을 지우고 끝난다
#   3. UPDATE: WHERE에 맞는 행의 값을 SET대로 고친다
#   4. 슬라이드의 빨간 물음 셋(2번 부서가 없으면? Ssn 123456789를 지워도 되나? 키 값을 고치면?)
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


def changed(c, sql):
    """문장을 돌리고 바뀐 행 수를 돌려준다."""
    return c.execute(sql).rowcount


if __name__ == "__main__":
    # --- 1. INSERT
    c = make()
    assert changed(c, """INSERT INTO EMPLOYEE VALUES ('Richard', 'K', 'Marini', '653298653', '1962-12-30',
                         '98 Oak Forest, Katy, TX', 'M', 37000, '653298653', 4)""") == 1
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(9,)]
    assert rows(c, "SELECT Fname, Lname, Salary, Super_ssn, Dno FROM EMPLOYEE WHERE Ssn = '653298653'") \
        == [('Richard', 'Marini', 37000, '653298653', 4)]          # 이 행은 상사 칸에 자기 번호를 적었다

    # 값의 순서는 CREATE TABLE의 열 순서다. 이름과 성을 바꿔 적어도 DBMS는 모른다
    c = make()
    c.execute("""INSERT INTO EMPLOYEE VALUES ('Marini', 'K', 'Richard', '653298653', '1962-12-30',
                 '98 Oak Forest, Katy, TX', 'M', 37000, '653298653', 4)""")
    assert rows(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE Ssn = '653298653'") == [('Marini', 'Richard')]
    # 값의 개수가 열 수와 다르면 오류다
    assert error_of(c, "INSERT INTO EMPLOYEE VALUES ('Richard', 'K', 'Marini', '653298653')") \
        == 'table EMPLOYEE has 10 columns but 4 values were supplied'

    # 열 이름을 골라 적는 꼴 (9 p.23): 안 적은 여섯 열은 NULL
    c = make()
    assert changed(c, "INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn) VALUES ('Richard', 'Marini', 4, '653298653')") == 1
    assert rows(c, "SELECT * FROM EMPLOYEE WHERE Ssn = '653298653'") \
        == [('Richard', None, 'Marini', '653298653', None, None, None, None, None, 4)]
    # 열 목록의 순서와 값의 순서가 짝이 맞으면 된다 (9 p.24는 Ssn, Dno 순서로 적었다)
    c = make()
    assert error_of(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('Robert', 'Hatcher', '980760540', 4)") is None
    # 빨간 물음 1: Dnumber = 2인 부서가 없다 -> 참조 무결성 위반
    assert rows(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Dnumber = 2") == [(0,)]
    assert error_of(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('Robert', 'Hatcher', '980760540', 2)") \
        == 'FOREIGN KEY constraint failed'
    # NOT NULL인 열을 빼먹으면 막힌다 (DEFAULT가 없을 때)
    assert error_of(c, "INSERT INTO EMPLOYEE (Lname, Ssn, Dno) VALUES ('Hatcher', '980760540', 4)") \
        == 'NOT NULL constraint failed: EMPLOYEE.Fname'

    # --- 2. DELETE
    c = make()
    assert changed(c, "DELETE FROM EMPLOYEE WHERE Lname = 'Brown'") == 0       # Brown이라는 직원은 없다. 오류도 없다
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(8,)]
    # 빨간 물음 2: Ssn = '123456789'(Smith)를 지워도 되나 -> 안 된다
    assert error_of(c, "DELETE FROM EMPLOYEE WHERE Ssn = '123456789'") == 'FOREIGN KEY constraint failed'
    assert rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Essn = '123456789'") == [(2,)]      # Smith를 가리키는 행들
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT WHERE Essn = '123456789'") == [(3,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = '123456789'") == [(0,)]
    assert rows(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Mgr_ssn = '123456789'") == [(0,)]
    # 가리키는 행 다섯 개를 먼저 지우면 Smith도 지워진다
    assert changed(c, "DELETE FROM WORKS_ON WHERE Essn = '123456789'") == 2
    assert changed(c, "DELETE FROM DEPENDENT WHERE Essn = '123456789'") == 3
    assert changed(c, "DELETE FROM EMPLOYEE WHERE Ssn = '123456789'") == 1
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(7,)]
    # 조건에 맞는 행이 여럿이면 모두 지운다
    c = make()
    assert changed(c, "DELETE FROM WORKS_ON WHERE Essn = '333445555'") == 4
    assert rows(c, "SELECT COUNT(*) FROM WORKS_ON") == [(12,)]
    # WHERE가 없으면 모든 행을 지운다. 표는 남는다
    assert changed(c, "DELETE FROM DEPENDENT") == 7
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT") == [(0,)]
    assert rows(c, "SELECT name FROM sqlite_master WHERE name = 'DEPENDENT'") == [('DEPENDENT',)]

    # --- 3. UPDATE
    c = make()
    assert rows(c, "SELECT * FROM PROJECT WHERE Pnumber = 10") == [('Computerization', 10, 'Stafford', 4)]
    assert changed(c, "UPDATE PROJECT SET Plocation = 'Bellaire', Dnum = 5 WHERE Pnumber = 10") == 1
    assert rows(c, "SELECT * FROM PROJECT WHERE Pnumber = 10") == [('Computerization', 10, 'Bellaire', 5)]
    assert rows(c, "SELECT COUNT(*) FROM PROJECT") == [(6,)]                                 # 행 수는 그대로다
    # 여러 행을 한 번에: 5번 부서 네 명의 월급을 10% 올린다
    assert changed(c, "UPDATE EMPLOYEE SET Salary = Salary * 1.1 WHERE Dno = 5") == 4
    got = rows(c, "SELECT Lname, Salary FROM EMPLOYEE WHERE Dno = 5 ORDER BY Lname")
    want = [('English', 27500), ('Narayan', 41800), ('Smith', 33000), ('Wong', 44000)]
    assert [g[0] for g in got] == [w[0] for w in want] and all(abs(g[1] - w[1]) < 1e-6 for g, w in zip(got, want))
    # WHERE가 없으면 모든 행을 고친다
    assert changed(c, "UPDATE DEPT_LOCATIONS SET Dlocation = Dlocation || ', TX'") == 5
    assert rows(c, "SELECT COUNT(*) FROM DEPT_LOCATIONS WHERE Dlocation LIKE '%, TX'") == [(5,)]
    # 맞는 행이 없으면 0행을 고친다
    assert changed(c, "UPDATE PROJECT SET Plocation = 'Seoul' WHERE Pnumber = 99") == 0
    # 빨간 물음 3: 외래 키 값을 없는 부서로 고치면 참조 무결성 위반, 기본 키 값을 이미 있는 값으로 고치면 키 위반
    c = make()
    assert error_of(c, "UPDATE PROJECT SET Dnum = 7 WHERE Pnumber = 10") == 'FOREIGN KEY constraint failed'
    assert error_of(c, "UPDATE PROJECT SET Pnumber = 20 WHERE Pnumber = 10") == 'UNIQUE constraint failed: PROJECT.Pnumber'
    # 기본 키 값을 새 값으로 고쳐도, 그 행을 가리키던 행이 있으면 참조 무결성 위반이다
    assert rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Pno = 10") == [(3,)]
    assert error_of(c, "UPDATE PROJECT SET Pnumber = 11 WHERE Pnumber = 10") == 'FOREIGN KEY constraint failed'

    # --- 확인 문제
    c = make()
    # C1: 세 문장을 차례로 돌린 뒤의 행 수
    c.execute("INSERT INTO DEPENDENT VALUES ('453453453', 'John', 'M', '1990-12-12', 'Spouse')")
    c.execute("DELETE FROM DEPENDENT WHERE Relationship = 'Son'")
    c.execute("UPDATE DEPENDENT SET Relationship = 'Child' WHERE Relationship = 'Daughter'")
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT") == [(6,)]
    assert rows(c, "SELECT Relationship, COUNT(*) FROM DEPENDENT GROUP BY Relationship ORDER BY Relationship") \
        == [('Child', 2), ('Spouse', 4)]
    # C2: 열 목록 없이 값 넷만 적은 INSERT는 오류
    assert error_of(c, "INSERT INTO PROJECT VALUES ('ProductW', 40, 5)") == 'table PROJECT has 4 columns but 3 values were supplied'
    assert error_of(c, "INSERT INTO PROJECT (Pname, Pnumber, Dnum) VALUES ('ProductW', 40, 5)") is None

    print('ALL CHECKS PASSED')
```
{% endraw %}
