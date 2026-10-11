---
layout: "note"
title: "54_missing-where-cross-product_verify.py"
display_title: "54_missing-where-cross-product_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "54"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/missing-where-cross-product/"
parent_title: "WHERE 없는 질의와 카티션 곱"
description: "데이터베이스 설계 · WHERE 없는 질의와 카티션 곱 검증 코드"
permalink: "/studies/database-design/code/54_missing-where-cross-product_verify/"
---
{% raw %}
[WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 54.WHERE 없는 질의와 카티션 곱 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 54_missing-where-cross-product_verify.py)
# 확인하는 것 (슬라이드 10-2 p.18~19, 11-2 p.5)
#   1. SELECT Ssn FROM EMPLOYEE: 조건이 없으면 모든 행(8행)이 나온다
#   2. SELECT Ssn, Dname FROM EMPLOYEE, DEPARTMENT: 모든 조합 8 x 3 = 24행이 나온다
#   3. 조건을 하나 빠뜨릴 때마다 결과가 몇 배로 불어나는지 (Q1, Q2)
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

if __name__ == "__main__":
    c = make()

    # --- 1. 표 하나, WHERE 없음
    ssns = rows(c, "SELECT Ssn FROM EMPLOYEE")
    # 여덟 개가 다 나온다. 나오는 차례는 정해져 있지 않다(SQLite는 여기서 번호가 작은 것부터 낸다)
    assert sorted(r[0] for r in ssns) == sorted(['123456789', '333445555', '999887777', '987654321', '666884444', '453453453', '987987987', '888665555'])
    assert len(ssns) == 8

    # --- 2. 표 둘, WHERE 없음
    pairs = rows(c, "SELECT Ssn, Dname FROM EMPLOYEE, DEPARTMENT")
    assert len(pairs) == 24 == 8 * 3
    assert Counter(p[0] for p in pairs) == Counter({s[0]: 3 for s in ssns})              # 직원마다 세 번씩
    assert Counter(p[1] for p in pairs) == Counter({'Research': 8, 'Administration': 8, 'Headquarters': 8})
    assert len(set(pairs)) == 24                                                         # 24쌍이 모두 다르다
    # 맞는 짝은 그중 8쌍뿐이다 (직원 한 명에 부서 하나)
    right = rows(c, "SELECT Ssn, Dname FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber")
    assert len(right) == 8 and set(right) <= set(pairs)
    assert dict(right)['888665555'] == 'Headquarters' and dict(right)['123456789'] == 'Research'
    # 24쌍 가운데 16쌍은 사실이 아니다. 예: Borg는 Research 직원이 아니다
    assert ('888665555', 'Research') in pairs and ('888665555', 'Research') not in right

    # --- 3. 조건을 빠뜨리면
    # Q1에서 조인 조건을 빼면 4행이 8행으로
    assert len(rows(c, "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno")) == 4
    assert len(rows(c, "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research'")) == 8
    # Q2에서 조인 조건을 하나씩 빼면 2행이 16행, 48행으로
    q2 = "SELECT Pnumber, Dnum, Lname FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Plocation = 'Stafford'"
    assert len(rows(c, q2 + " AND Dnum = Dnumber AND Mgr_ssn = Ssn")) == 2
    assert len(rows(c, q2 + " AND Dnum = Dnumber")) == 16          # 프로젝트 2 x 직원 8
    assert len(rows(c, q2 + " AND Mgr_ssn = Ssn")) == 6            # 프로젝트 2 x (부서, 관리자) 3
    assert len(rows(c, q2)) == 48                                  # 2 x 3 x 8
    assert rows(c, "SELECT COUNT(*) FROM PROJECT, DEPARTMENT, EMPLOYEE") == [(144,)]      # 6 x 3 x 8
    # 여섯 표를 모두 조건 없이 늘어놓으면
    sizes = [8, 3, 5, 6, 16, 7]
    total = 1
    for s in sizes:
        total *= s
    assert total == 80640
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT") == [(80640,)]

    # 한쪽 표가 비어 있으면 조합도 0개다
    c.execute("CREATE TABLE EMPTY_T (x INT)")
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, EMPTY_T") == [(0,)]

    # --- 확인 문제
    # C1: SELECT Pname, Dname FROM PROJECT, DEPARTMENT -> 6 x 3 = 18행, 그중 맞는 짝은 6행
    assert rows(c, "SELECT COUNT(*) FROM PROJECT, DEPARTMENT") == [(18,)]
    assert rows(c, "SELECT COUNT(*) FROM PROJECT, DEPARTMENT WHERE Dnum = Dnumber") == [(6,)]
    # C3: 직원과 일하는 프로젝트 이름: 표 셋, 조인 조건 둘 -> 16행. 하나를 빼면 96행(= 16 x 6), 128행(= 8 x 16)
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, WORKS_ON, PROJECT WHERE Ssn = Essn AND Pno = Pnumber") == [(16,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, WORKS_ON, PROJECT WHERE Ssn = Essn") == [(96,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE, WORKS_ON, PROJECT WHERE Pno = Pnumber") == [(128,)]

    print('ALL CHECKS PASSED')
```
{% endraw %}
