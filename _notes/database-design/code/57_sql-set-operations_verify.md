---
layout: "note"
title: "57_sql-set-operations_verify.py"
display_title: "57_sql-set-operations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "57"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-set-operations/"
parent_title: "집합 연산 UNION·EXCEPT·INTERSECT"
description: "데이터베이스 설계 · 집합 연산 UNION·EXCEPT·INTERSECT 검증 코드"
permalink: "/studies/database-design/code/57_sql-set-operations_verify/"
---
{% raw %}
[집합 연산 UNION·EXCEPT·INTERSECT](/Hongs_Blog/studies/database-design/sql-set-operations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 57.집합 연산 UNION·EXCEPT·INTERSECT 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 57_sql-set-operations_verify.py)
# 확인하는 것 (슬라이드 10-2 p.23~24, 11-2 p.9)
#   1. Query 4(UNION)의 답 {1, 2}와 두 부분 질의의 답
#   2. Wong으로 바꾼 예에서 UNION, UNION ALL, INTERSECT, EXCEPT의 답
#   3. p.24 그림의 R, S에서 UNION ALL, EXCEPT ALL, INTERSECT ALL: 개수를 세는 규칙을 파이썬 Counter로 계산
#      (SQLite에는 EXCEPT ALL과 INTERSECT ALL이 없다. 문장 그대로는 PostgreSQL에서 돌렸다: 57_sql-set-operations_verify.sql)
#   4. 두 질의의 열 수가 다르면 오류
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

from collections import Counter

MANAGER = "SELECT DISTINCT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = '%s'"
WORKER = "SELECT DISTINCT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = '%s'"


def nums(c, sql):
    return sorted(r[0] for r in rows(c, sql))


if __name__ == "__main__":
    c = make()

    # --- 1. Query 4: Smith가 일꾼으로든, 맡은 부서의 관리자로든 얽힌 프로젝트 번호
    assert nums(c, MANAGER % 'Smith') == []                 # Smith는 어느 부서의 관리자도 아니다
    assert nums(c, WORKER % 'Smith') == [1, 2]
    assert nums(c, MANAGER % 'Smith' + ' UNION ' + WORKER % 'Smith') == [1, 2]

    # --- 2. Wong: 5번 부서 관리자라 프로젝트 1, 2, 3을 맡고, 일꾼으로는 2, 3, 10, 20에서 일한다
    m, w = MANAGER % 'Wong', WORKER % 'Wong'
    assert nums(c, m) == [1, 2, 3] and nums(c, w) == [2, 3, 10, 20]
    assert nums(c, m + ' UNION ' + w) == [1, 2, 3, 10, 20]              # 겹치는 2, 3은 한 번만
    assert nums(c, m + ' UNION ALL ' + w) == [1, 2, 2, 3, 3, 10, 20]    # ALL이면 있는 대로 7행
    assert nums(c, m + ' INTERSECT ' + w) == [2, 3]
    assert nums(c, m + ' EXCEPT ' + w) == [1]
    assert nums(c, w + ' EXCEPT ' + m) == [10, 20]                      # EXCEPT는 순서를 바꾸면 답이 달라진다
    assert nums(c, w + ' UNION ' + m) == nums(c, m + ' UNION ' + w)     # UNION과 INTERSECT는 순서를 바꿔도 같다
    assert nums(c, w + ' INTERSECT ' + m) == nums(c, m + ' INTERSECT ' + w)
    # 파이썬의 집합 연산과 같다
    M, W = set(nums(c, m)), set(nums(c, w))
    assert (sorted(M | W), sorted(M & W), sorted(M - W), sorted(W - M)) == ([1, 2, 3, 10, 20], [2, 3], [1], [10, 20])
    # UNION은 두 질의에 DISTINCT가 없어도 중복을 지운다
    assert nums(c, "SELECT Salary FROM EMPLOYEE WHERE Dno = 5 UNION SELECT Salary FROM EMPLOYEE WHERE Dno = 4") == [25000, 30000, 38000, 40000, 43000]
    assert len(rows(c, "SELECT Salary FROM EMPLOYEE WHERE Dno = 5 UNION ALL SELECT Salary FROM EMPLOYEE WHERE Dno = 4")) == 7

    # --- 3. p.24 그림: R(A) = a1, a2, a2, a3 / S(A) = a1, a2, a4, a5
    R, S = Counter(['a1', 'a2', 'a2', 'a3']), Counter(['a1', 'a2', 'a4', 'a5'])
    assert sorted((R + S).elements()) == ['a1', 'a1', 'a2', 'a2', 'a2', 'a3', 'a4', 'a5']     # UNION ALL: 개수를 더한다 (그림 b)
    assert sorted((R - S).elements()) == ['a2', 'a3']                                         # EXCEPT ALL: 개수를 뺀다 (그림 c)
    assert sorted((R & S).elements()) == ['a1', 'a2']                                         # INTERSECT ALL: 작은 쪽 개수 (그림 d)
    assert sorted((S - R).elements()) == ['a4', 'a5']
    # ALL이 없는 판: 집합으로 만든 뒤 계산
    assert sorted(set(R) | set(S)) == ['a1', 'a2', 'a3', 'a4', 'a5'] and sorted(set(R) - set(S)) == ['a3'] and sorted(set(R) & set(S)) == ['a1', 'a2']
    c.executescript("CREATE TABLE R (A VARCHAR(2)); CREATE TABLE S (A VARCHAR(2));"
                    "INSERT INTO R VALUES ('a1'), ('a2'), ('a2'), ('a3'); INSERT INTO S VALUES ('a1'), ('a2'), ('a4'), ('a5');")
    assert nums(c, "SELECT A FROM R UNION ALL SELECT A FROM S") == sorted((R + S).elements())
    assert nums(c, "SELECT A FROM R UNION SELECT A FROM S") == ['a1', 'a2', 'a3', 'a4', 'a5']
    assert nums(c, "SELECT A FROM R EXCEPT SELECT A FROM S") == ['a3']
    assert nums(c, "SELECT A FROM R INTERSECT SELECT A FROM S") == ['a1', 'a2']
    assert 'syntax error' in error_of(c, "SELECT A FROM R EXCEPT ALL SELECT A FROM S")        # SQLite에는 없다
    assert 'syntax error' in error_of(c, "SELECT A FROM R INTERSECT ALL SELECT A FROM S")

    # 집합은 횟수가 0 아니면 1인 다중집합이다. 그때 빼기와 겹치기의 식은 차집합, 교집합과 같고,
    # 합집합은 횟수를 더한 뒤 2를 1로 줄인 것(max)이다. 무작위 집합 500쌍으로 확인한다
    import random
    rng = random.Random(57)
    for _ in range(500):
        A = {x for x in range(8) if rng.random() < 0.5}
        B = {x for x in range(8) if rng.random() < 0.5}
        ca, cb = Counter(A), Counter(B)
        assert set((ca - cb).elements()) == A - B and max((ca - cb).values(), default=0) <= 1        # max(m - n, 0)
        assert set((ca & cb).elements()) == A & B                                                    # min(m, n)
        assert set((ca | cb).elements()) == A | B and max((ca | cb).values(), default=0) <= 1        # max(m, n)
        assert sorted((ca + cb).elements()) == sorted(list(A) + list(B))                             # m + n: 겹치면 두 번

    # 월급으로 한 번 더: 4번 부서 {25000, 43000, 25000}, 5번 부서 {30000, 40000, 38000, 25000}
    d4 = Counter(r[0] for r in rows(c, "SELECT Salary FROM EMPLOYEE WHERE Dno = 4"))
    d5 = Counter(r[0] for r in rows(c, "SELECT Salary FROM EMPLOYEE WHERE Dno = 5"))
    assert sorted((d4 - d5).elements()) == [25000, 43000] and sorted(set(d4) - set(d5)) == [43000]
    assert sorted((d4 & d5).elements()) == [25000]

    # --- 4. 합칠 수 있는 조건: 열 수가 같아야 한다
    assert error_of(c, "SELECT Ssn FROM EMPLOYEE UNION SELECT Dnumber, Dname FROM DEPARTMENT") \
        == 'SELECTs to the left and right of UNION do not have the same number of result columns'
    # 열 이름은 달라도 된다. 결과의 열 이름은 첫 질의의 것이다
    cur = c.execute("SELECT Lname FROM EMPLOYEE WHERE Dno = 1 UNION SELECT Dname FROM DEPARTMENT WHERE Dnumber = 1")
    assert [d[0] for d in cur.description] == ['Lname'] and sorted(r[0] for r in cur.fetchall()) == ['Borg', 'Headquarters']

    print('ALL CHECKS PASSED')
```
{% endraw %}
