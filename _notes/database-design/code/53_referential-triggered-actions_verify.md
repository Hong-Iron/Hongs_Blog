---
layout: "note"
title: "53_referential-triggered-actions_verify.py"
display_title: "53_referential-triggered-actions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "53"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/referential-triggered-actions/"
parent_title: "참조 동작 SET NULL·CASCADE·SET DEFAULT"
description: "데이터베이스 설계 · 참조 동작 SET NULL·CASCADE·SET DEFAULT 검증 코드"
permalink: "/studies/database-design/code/53_referential-triggered-actions_verify/"
---
{% raw %}
[참조 동작 SET NULL·CASCADE·SET DEFAULT](/Hongs_Blog/studies/database-design/referential-triggered-actions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 53.참조 동작 SET NULL·CASCADE·SET DEFAULT 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 53_referential-triggered-actions_verify.py)
# 확인하는 것 (슬라이드 10 p.19~21, 10-2 p.7~8의 문장을 COMPANY 상태에 돌린다)
#   1. 아무것도 안 적으면 거부한다
#   2. ON DELETE SET NULL, ON UPDATE CASCADE, ON DELETE SET DEFAULT, ON DELETE CASCADE가 하는 일
#   3. 10-2 p.7의 물음(Wong을 지우면? Wong의 Ssn을 444335555로 고치면?)
#   4. 10-2 p.8의 물음(EMPSUPERFK가 ON DELETE CASCADE일 때 Borg를 지우면?)
#   5. DELETE EMPLOYEE WHERE ...(FROM 없음)와 ON DELETE REJECT는 SQL 문법이 아니다
# 같은 내용을 PostgreSQL 16에서도 돌렸다(53_referential-triggered-actions_verify.sql).
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


# 슬라이드 10 p.16, p.20~21에 적힌 DEFAULT, 제약 이름, 참조 동작을 붙인 DDL.
# 슬라이드가 동작을 적지 않은 PROJECT, WORKS_ON, DEPENDENT의 외래 키는 그대로 둔다(기본값: 거부).
ACTION_DDL = """
CREATE TABLE EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,
  CONSTRAINT EMPPK PRIMARY KEY (Ssn),
  CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) ON DELETE SET DEFAULT ON UPDATE CASCADE);
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555', Mgr_start_date DATE,
  CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname),
  CONSTRAINT DEPTMGRFK FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET DEFAULT ON UPDATE CASCADE);
CREATE TABLE DEPT_LOCATIONS (
  Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE);
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


def one_table(on_delete):
    """EMPLOYEE 한 표만 있는 데이터베이스. Super_ssn 외래 키의 ON DELETE 동작만 바꿔 만든다."""
    c = sqlite3.connect(':memory:', isolation_level=None)
    c.execute('PRAGMA foreign_keys = ON')
    c.execute("""CREATE TABLE EMPLOYEE (
        Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
        Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,
        CONSTRAINT EMPPK PRIMARY KEY (Ssn),
        CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE %s ON UPDATE CASCADE)""" % on_delete)
    c.execute('BEGIN')
    c.execute('PRAGMA defer_foreign_keys = ON')
    c.executemany('INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)', EMPLOYEE)
    c.execute('COMMIT')
    return c


def supervisors(c):
    return dict(rows(c, "SELECT Lname, Super_ssn FROM EMPLOYEE"))


if __name__ == "__main__":
    WONG, BORG = '333445555', '888665555'

    # --- 1. 동작을 안 적은 외래 키: 거부한다
    c = make()
    assert error_of(c, "DELETE FROM EMPLOYEE WHERE Ssn = ?", (WONG,)) == 'FOREIGN KEY constraint failed'
    assert error_of(c, "UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = ?", (WONG,)) == 'FOREIGN KEY constraint failed'
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE") == [(8,)]

    # --- 2, 3. EMPLOYEE 한 표로 보는 SET NULL과 UPDATE CASCADE (슬라이드 10 p.20의 두 상자)
    e = one_table('SET NULL')
    assert sorted(l for l, s in supervisors(e).items() if s == WONG) == ['English', 'Narayan', 'Smith']
    e.execute("DELETE FROM EMPLOYEE WHERE Ssn = ?", (WONG,))
    assert rows(e, "SELECT COUNT(*) FROM EMPLOYEE") == [(7,)]                       # Wong 한 행만 사라진다
    sup = supervisors(e)
    assert sup['Smith'] is None and sup['Narayan'] is None and sup['English'] is None
    assert sup['Zelaya'] == '987654321' and sup['Jabbar'] == '987654321' and sup['Wallace'] == BORG   # 나머지는 그대로

    e = one_table('SET NULL')
    e.execute("UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = ?", (WONG,))
    sup = supervisors(e)
    assert sup['Smith'] == sup['Narayan'] == sup['English'] == '444335555'           # 새 번호가 따라 들어간다
    assert rows(e, "SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = ?", (WONG,)) == [(0,)]

    # --- 3. 여섯 표가 다 있을 때: WORKS_ON과 DEPENDENT의 외래 키에는 동작이 없어서 거부된다
    c = make(ACTION_DDL)
    assert rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Essn = ?", (WONG,)) == [(4,)]
    assert rows(c, "SELECT COUNT(*) FROM DEPENDENT WHERE Essn = ?", (WONG,)) == [(3,)]
    assert error_of(c, "DELETE FROM EMPLOYEE WHERE Ssn = ?", (WONG,)) == 'FOREIGN KEY constraint failed'
    assert error_of(c, "UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = ?", (WONG,)) == 'FOREIGN KEY constraint failed'
    # 그 일곱 행을 먼저 지우면 지워지고, 두 동작이 함께 일한다
    c.execute("DELETE FROM WORKS_ON WHERE Essn = ?", (WONG,))
    c.execute("DELETE FROM DEPENDENT WHERE Essn = ?", (WONG,))
    c.execute('SAVEPOINT before')
    c.execute("DELETE FROM EMPLOYEE WHERE Ssn = ?", (WONG,))
    sup = supervisors(c)
    assert sup['Smith'] is None and sup['Narayan'] is None and sup['English'] is None          # EMPSUPERFK: SET NULL
    assert rows(c, "SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 5") == [(BORG,)]              # DEPTMGRFK: SET DEFAULT
    c.execute('ROLLBACK TO before')
    c.execute("UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = ?", (WONG,))
    sup = supervisors(c)
    assert sup['Smith'] == sup['Narayan'] == sup['English'] == '444335555'                      # EMPSUPERFK: UPDATE CASCADE
    assert rows(c, "SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 5") == [('444335555',)]       # DEPTMGRFK: UPDATE CASCADE

    # --- 2. 부서를 지울 때: SET DEFAULT(EMPLOYEE.Dno)와 CASCADE(DEPT_LOCATIONS)
    c = make(ACTION_DDL)
    assert error_of(c, "DELETE FROM DEPARTMENT WHERE Dnumber = 5") == 'FOREIGN KEY constraint failed'   # PROJECT.Dnum에는 동작이 없다
    c.execute("DELETE FROM WORKS_ON WHERE Pno IN (1, 2, 3)")
    c.execute("DELETE FROM PROJECT WHERE Dnum = 5")
    c.execute("DELETE FROM DEPARTMENT WHERE Dnumber = 5")
    assert rows(c, "SELECT Lname, Dno FROM EMPLOYEE ORDER BY Lname") == [
        ('Borg', 1), ('English', 1), ('Jabbar', 4), ('Narayan', 1), ('Smith', 1), ('Wallace', 4), ('Wong', 1), ('Zelaya', 4)]
    assert rows(c, "SELECT Dnumber, Dlocation FROM DEPT_LOCATIONS ORDER BY Dnumber") == [(1, 'Houston'), (4, 'Stafford')]
    # 부서 번호를 고칠 때: ON UPDATE CASCADE (PROJECT가 없는 4번 부서의 위치만 남긴 뒤 4 -> 9)
    c = make(ACTION_DDL)
    c.execute("DELETE FROM WORKS_ON WHERE Pno IN (10, 30)")
    c.execute("DELETE FROM PROJECT WHERE Dnum = 4")
    c.execute("UPDATE DEPARTMENT SET Dnumber = 9 WHERE Dnumber = 4")
    assert rows(c, "SELECT Lname FROM EMPLOYEE WHERE Dno = 9 ORDER BY Lname") == [('Jabbar',), ('Wallace',), ('Zelaya',)]
    assert rows(c, "SELECT Dnumber, Dlocation FROM DEPT_LOCATIONS WHERE Dlocation = 'Stafford'") == [(9, 'Stafford')]

    # SET DEFAULT의 기본값이 가리키는 행까지 사라지면 거부된다 (기본 관리자 Borg, 기본 부서 1번)
    c = make(ACTION_DDL)
    c.execute("DELETE FROM WORKS_ON WHERE Essn = ?", (BORG,))
    assert error_of(c, "DELETE FROM EMPLOYEE WHERE Ssn = ?", (BORG,)) == 'FOREIGN KEY constraint failed'
    c.execute("DELETE FROM WORKS_ON WHERE Pno = 20")
    c.execute("DELETE FROM PROJECT WHERE Dnum = 1")
    assert error_of(c, "DELETE FROM DEPARTMENT WHERE Dnumber = 1") == 'FOREIGN KEY constraint failed'
    # SET NULL은 NOT NULL인 외래 키에는 쓸 수 없다 (지울 때 NOT NULL에 걸린다)
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.execute('PRAGMA foreign_keys = ON')
    k.executescript("""CREATE TABLE D (Dnumber INT PRIMARY KEY);
                       CREATE TABLE E (Ssn CHAR(9) PRIMARY KEY, Dno INT NOT NULL REFERENCES D(Dnumber) ON DELETE SET NULL);
                       INSERT INTO D VALUES (1); INSERT INTO E VALUES ('1', 1);""")
    try:
        k.execute("DELETE FROM D WHERE Dnumber = 1")
        raise AssertionError('NOT NULL 열이 NULL이 됐다')
    except sqlite3.IntegrityError as err:
        assert str(err) == 'NOT NULL constraint failed: E.Dno'

    # 동작의 방향: 가리키는 쪽(DEPT_LOCATIONS)의 행을 지워도 가리킴 받는 쪽(DEPARTMENT)에는 아무 일도 없다
    c = make(ACTION_DDL)
    c.execute("DELETE FROM DEPT_LOCATIONS WHERE Dnumber = 5 AND Dlocation = 'Houston'")
    assert rows(c, "SELECT COUNT(*) FROM DEPARTMENT") == [(3,)] and rows(c, "SELECT COUNT(*) FROM DEPT_LOCATIONS") == [(4,)]
    # 확인 문제: SET NULL일 때 Wallace를 지우면 Zelaya와 Jabbar의 상사 칸이 빈다
    e = one_table('SET NULL')
    e.execute("DELETE FROM EMPLOYEE WHERE Lname = 'Wallace'")
    assert rows(e, "SELECT COUNT(*) FROM EMPLOYEE") == [(7,)]
    assert sorted(l for l, s in supervisors(e).items() if s is None) == ['Borg', 'Jabbar', 'Zelaya']

    # ON UPDATE에 SET NULL, SET DEFAULT를 적은 경우 (정의의 표 오른쪽 칸)
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.execute('PRAGMA foreign_keys = ON')
    k.executescript("""CREATE TABLE D (Dnumber INT PRIMARY KEY);
                       CREATE TABLE E1 (Ssn CHAR(9) PRIMARY KEY, Dno INT REFERENCES D(Dnumber) ON UPDATE SET NULL);
                       CREATE TABLE E2 (Ssn CHAR(9) PRIMARY KEY, Dno INT DEFAULT 1 REFERENCES D(Dnumber) ON UPDATE SET DEFAULT);
                       INSERT INTO D VALUES (1), (5);
                       INSERT INTO E1 VALUES ('a', 5); INSERT INTO E2 VALUES ('b', 5);""")
    k.execute("UPDATE D SET Dnumber = 6 WHERE Dnumber = 5")
    assert rows(k, "SELECT Dno FROM E1") == [(None,)] and rows(k, "SELECT Dno FROM E2") == [(1,)]

    # --- 4. 10-2 p.8: EMPSUPERFK가 ON DELETE CASCADE일 때
    e = one_table('CASCADE')
    e.execute("DELETE FROM EMPLOYEE WHERE Lname = 'Wong'")
    assert sorted(r[0] for r in rows(e, "SELECT Lname FROM EMPLOYEE")) == ['Borg', 'Jabbar', 'Wallace', 'Zelaya']   # Wong과 부하 셋이 사라진다
    e = one_table('CASCADE')
    e.execute("DELETE FROM EMPLOYEE WHERE Lname = 'Borg'")
    assert rows(e, "SELECT COUNT(*) FROM EMPLOYEE") == [(0,)]                       # 여덟 명이 모두 사라진다
    # 슬라이드의 원래 선택(SET NULL)이면 Borg 한 행만 사라진다
    e = one_table('SET NULL')
    e.execute("DELETE FROM EMPLOYEE WHERE Lname = 'Borg'")
    assert rows(e, "SELECT COUNT(*) FROM EMPLOYEE") == [(7,)]
    assert sorted(l for l, s in supervisors(e).items() if s is None) == ['Wallace', 'Wong']
    # 지워지는 차례: Borg -> (Wong, Wallace) -> (Smith, Narayan, English, Zelaya, Jabbar)
    level = {BORG: 0}
    changed = True
    while changed:
        changed = False
        for r in EMPLOYEE:
            if r[3] not in level and r[8] in level:
                level[r[3]] = level[r[8]] + 1
                changed = True
    by_level = {}
    for r in EMPLOYEE:
        by_level.setdefault(level[r[3]], []).append(r[2])
    assert by_level == {0: ['Borg'], 1: ['Wong', 'Wallace'], 2: ['Smith', 'Zelaya', 'Narayan', 'English', 'Jabbar']}

    # --- 5. 문법이 아닌 것
    c = make()
    assert 'syntax error' in error_of(c, "DELETE EMPLOYEE WHERE Lname = 'Borg'")
    for word, ok in (('REJECT', False), ('RESTRICT', True), ('NO ACTION', True), ('SET NULL', True), ('SET DEFAULT', True), ('CASCADE', True)):
        err = error_of(c, "CREATE TABLE X (a INT REFERENCES DEPARTMENT(Dnumber) ON DELETE %s)" % word)
        assert (err is None) == ok, (word, err)

    print('ALL CHECKS PASSED')
```
{% endraw %}
