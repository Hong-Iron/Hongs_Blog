---
layout: "note"
title: "52_update-constraint-violations_verify.py"
display_title: "52_update-constraint-violations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "52"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/update-constraint-violations/"
parent_title: "갱신 연산과 제약 위반"
description: "데이터베이스 설계 · 갱신 연산과 제약 위반 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/52_update-constraint-violations_verify/"
---
{% raw %}
[갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 52.갱신 연산과 제약 위반 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 52_update-constraint-violations_verify.py)
# 확인하는 것
#   1. 문서의 삽입 넷, 삭제 셋, 수정 넷의 결과
#   2. 문서의 판정표: 삽입은 키·개체 무결성·참조 무결성을 모두 어길 수 있고, 삭제는 참조 무결성만 어긴다.
#      기본 키도 외래 키도 아닌 열을 고치면 세 제약은 그대로다
#   3. 제약을 하나하나 손으로 검사하는 파이썬 검사기와 SQLite의 판정(받는다/막는다)이 무작위 연산 900개에서 일치한다
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

import copy
import random

COLS = {'EMPLOYEE': ['Fname', 'Minit', 'Lname', 'Ssn', 'Bdate', 'Address', 'Sex', 'Salary', 'Super_ssn', 'Dno'],
        'DEPARTMENT': ['Dname', 'Dnumber', 'Mgr_ssn', 'Mgr_start_date'],
        'DEPT_LOCATIONS': ['Dnumber', 'Dlocation'],
        'PROJECT': ['Pname', 'Pnumber', 'Plocation', 'Dnum'],
        'WORKS_ON': ['Essn', 'Pno', 'Hours'],
        'DEPENDENT': ['Essn', 'Dependent_name', 'Sex', 'Bdate', 'Relationship']}
PK = {'EMPLOYEE': ['Ssn'], 'DEPARTMENT': ['Dnumber'], 'DEPT_LOCATIONS': ['Dnumber', 'Dlocation'],
      'PROJECT': ['Pnumber'], 'WORKS_ON': ['Essn', 'Pno'], 'DEPENDENT': ['Essn', 'Dependent_name']}
UNIQUE = {'DEPARTMENT': ['Dname'], 'PROJECT': ['Pname']}
NOT_NULL = {'EMPLOYEE': ['Fname', 'Lname', 'Dno'], 'DEPARTMENT': ['Dname', 'Mgr_ssn'], 'PROJECT': ['Pname', 'Dnum']}
FK = [('EMPLOYEE', 'Super_ssn', 'EMPLOYEE', 'Ssn'), ('EMPLOYEE', 'Dno', 'DEPARTMENT', 'Dnumber'),
      ('DEPARTMENT', 'Mgr_ssn', 'EMPLOYEE', 'Ssn'), ('DEPT_LOCATIONS', 'Dnumber', 'DEPARTMENT', 'Dnumber'),
      ('PROJECT', 'Dnum', 'DEPARTMENT', 'Dnumber'), ('WORKS_ON', 'Essn', 'EMPLOYEE', 'Ssn'),
      ('WORKS_ON', 'Pno', 'PROJECT', 'Pnumber'), ('DEPENDENT', 'Essn', 'EMPLOYEE', 'Ssn')]
STATE0 = {'EMPLOYEE': EMPLOYEE, 'DEPARTMENT': DEPARTMENT, 'DEPT_LOCATIONS': DEPT_LOCATIONS,
          'PROJECT': PROJECT, 'WORKS_ON': WORKS_ON, 'DEPENDENT': DEPENDENT}


def as_dicts(state):
    return {t: [dict(zip(COLS[t], r)) for r in rs] for t, rs in state.items()}


def violated(db):
    """데이터베이스 상태 전체를 훑어, 어긴 제약의 종류를 집합으로 돌려준다."""
    out = set()
    for t, rs in db.items():
        keys = [tuple(r[k] for k in PK[t]) for r in rs]
        if any(v is None for key in keys for v in key):
            out.add('개체 무결성')                              # 기본 키에 NULL
        full = [k for k in keys if None not in k]
        if len(full) != len(set(full)):
            out.add('키')                                       # 기본 키 값이 겹침
        for u in UNIQUE.get(t, []):
            vals = [r[u] for r in rs if r[u] is not None]
            if len(vals) != len(set(vals)):
                out.add('키')                                   # UNIQUE로 적은 또 다른 키가 겹침
        for col in NOT_NULL.get(t, []):
            if any(r[col] is None for r in rs):
                out.add('NOT NULL')
    for child, col, parent, pcol in FK:
        have = {r[pcol] for r in db[parent]}
        if any(r[col] is not None and r[col] not in have for r in db[child]):
            out.add('참조 무결성')                              # 가리키는 값이 상대 표에 없음
    return out


def apply(db, op):
    """연산을 적용한 새 상태를 돌려준다. op = ('insert', 표, 값들) / ('delete', 표, 조건) / ('update', 표, 조건, 바꿀 값)"""
    db = copy.deepcopy(db)
    kind, t = op[0], op[1]
    if kind == 'insert':
        db[t].append(dict(zip(COLS[t], op[2])))
    elif kind == 'delete':
        db[t] = [r for r in db[t] if not all(r[k] == v for k, v in op[2].items())]
    else:
        for r in db[t]:
            if all(r[k] == v for k, v in op[2].items()):
                r.update(op[3])
    return db


def to_sql(op):
    kind, t = op[0], op[1]
    if kind == 'insert':
        return 'INSERT INTO %s VALUES (%s)' % (t, ','.join('?' * len(op[2]))), list(op[2])
    where = ' AND '.join('%s = ?' % k for k in op[2])
    if kind == 'delete':
        return 'DELETE FROM %s WHERE %s' % (t, where), list(op[2].values())
    sets = ', '.join('%s = ?' % k for k in op[3])
    return 'UPDATE %s SET %s WHERE %s' % (t, sets, where), list(op[3].values()) + list(op[2].values())


def judge(c, db, op):
    """(검사기가 찾은 위반 집합, SQLite의 오류 글)을 돌려준다. 둘의 판정이 어긋나면 멈춘다."""
    found = violated(apply(db, op))
    sql, args = to_sql(op)
    err = error_of(c, sql, args)
    assert (err is None) == (not found), (op, found, err)
    return found, err


if __name__ == "__main__":
    c = make()
    db = as_dicts(STATE0)
    assert violated(db) == set()                                    # 처음 상태는 어떤 제약도 어기지 않는다

    # --- 1. 문서의 예: 삽입 넷
    f, e = judge(c, db, ('insert', 'EMPLOYEE', ('Cecilia', 'F', 'Kolonsky', None, '1960-04-05', '6357 Windy Lane, Katy, TX', 'F', 28000, None, 4)))
    assert f == {'개체 무결성'} and e == 'NOT NULL constraint failed: EMPLOYEE.Ssn'
    f, e = judge(c, db, ('insert', 'EMPLOYEE', ('Alicia', 'J', 'Zelaya', '999887777', '1960-04-05', '6357 Windy Lane, Katy, TX', 'F', 28000, '987654321', 4)))
    assert f == {'키'} and e == 'UNIQUE constraint failed: EMPLOYEE.Ssn'
    f, e = judge(c, db, ('insert', 'EMPLOYEE', ('Cecilia', 'F', 'Kolonsky', '677678989', '1960-04-05', '6357 Windswept, Katy, TX', 'F', 28000, '987654321', 7)))
    assert f == {'참조 무결성'} and e == 'FOREIGN KEY constraint failed'
    f, e = judge(c, db, ('insert', 'EMPLOYEE', ('Cecilia', 'F', 'Kolonsky', '677678989', '1960-04-05', '6357 Windy Lane, Katy, TX', 'F', 28000, None, 4)))
    assert f == set() and e is None

    # --- 문서의 예: 삭제 셋
    f, e = judge(c, db, ('delete', 'WORKS_ON', {'Essn': '999887777', 'Pno': 10}))
    assert f == set()
    f, e = judge(c, db, ('delete', 'EMPLOYEE', {'Ssn': '999887777'}))
    assert f == {'참조 무결성'}
    f, e = judge(c, db, ('delete', 'EMPLOYEE', {'Ssn': '333445555'}))
    assert f == {'참조 무결성'}

    def referencing(ssn):
        """이 직원을 가리키는 행의 수: (EMPLOYEE.Super_ssn, DEPARTMENT.Mgr_ssn, WORKS_ON.Essn, DEPENDENT.Essn)"""
        return (rows(c, "SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = ?", (ssn,))[0][0],
                rows(c, "SELECT COUNT(*) FROM DEPARTMENT WHERE Mgr_ssn = ?", (ssn,))[0][0],
                rows(c, "SELECT COUNT(*) FROM WORKS_ON WHERE Essn = ?", (ssn,))[0][0],
                rows(c, "SELECT COUNT(*) FROM DEPENDENT WHERE Essn = ?", (ssn,))[0][0])
    assert referencing('999887777') == (0, 0, 2, 0)                 # Zelaya: WORKS_ON 두 행만 가리킨다
    assert referencing('333445555') == (3, 1, 4, 3)                 # Wong: 네 표의 11행이 가리킨다 ("even worse")
    assert referencing('987654321') == (2, 1, 2, 1)                 # Wallace: 네 표의 6행

    # --- 문서의 예: 수정 넷
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Salary': 28000}))
    assert f == set()
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Dno': 1}))
    assert f == set()
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Dno': 7}))
    assert f == {'참조 무결성'}
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Ssn': '987654321'}))
    assert f == {'키', '참조 무결성'}                               # 겹치는 기본 키 + 옛 값을 가리키던 WORKS_ON 두 행
    # 겹치지 않는 새 번호로 고쳐도 참조 무결성은 깨진다
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Ssn': '111111111'}))
    assert f == {'참조 무결성'}
    # 아무도 가리키지 않는 행의 기본 키는 새 값으로 고칠 수 있다 (가리키는 행이 없는 DEPENDENT의 한 행)
    f, e = judge(c, db, ('update', 'DEPENDENT', {'Essn': '987654321', 'Dependent_name': 'Abner'}, {'Dependent_name': 'Abe'}))
    assert f == set()

    # --- 2. "기본 키도 외래 키도 아닌 열"이라도 UNIQUE나 NOT NULL에는 걸릴 수 있다 ("usually"의 까닭)
    f, e = judge(c, db, ('update', 'DEPARTMENT', {'Dnumber': 4}, {'Dname': 'Research'}))
    assert f == {'키'} and e == 'UNIQUE constraint failed: DEPARTMENT.Dname'
    f, e = judge(c, db, ('update', 'EMPLOYEE', {'Ssn': '999887777'}, {'Lname': None}))
    assert f == {'NOT NULL'}

    # --- 3. 무작위 연산: 검사기와 SQLite의 판정이 늘 같다. 그리고 판정표를 확인한다
    rng = random.Random(52)
    ssns = [r[3] for r in EMPLOYEE] + ['111111111', None]
    dnos = [1, 4, 5, 2, 7, None]
    pnos = [1, 2, 3, 10, 20, 30, 40, None]
    seen = {'insert': set(), 'delete': set(), 'update_plain': set()}
    for _ in range(300):                                            # 삽입 300개
        t = rng.choice(['EMPLOYEE', 'DEPARTMENT', 'PROJECT', 'WORKS_ON', 'DEPT_LOCATIONS', 'DEPENDENT'])
        if t == 'EMPLOYEE':
            op = ('insert', t, ('A', 'B', 'C', rng.choice(ssns), None, None, 'F', 1000, rng.choice(ssns), rng.choice(dnos)))
        elif t == 'DEPARTMENT':
            op = ('insert', t, (rng.choice(['Research', 'Sales', 'Legal']), rng.choice(dnos), rng.choice(ssns), None))
        elif t == 'PROJECT':
            op = ('insert', t, (rng.choice(['ProductX', 'ProductA', 'ProductB']), rng.choice(pnos), 'Seoul', rng.choice(dnos)))
        elif t == 'WORKS_ON':
            op = ('insert', t, (rng.choice(ssns), rng.choice(pnos), 5.0))
        elif t == 'DEPT_LOCATIONS':
            op = ('insert', t, (rng.choice(dnos), rng.choice(['Houston', 'Seoul', None])))
        else:
            op = ('insert', t, (rng.choice(ssns), rng.choice(['Alice', 'Bob', None]), 'F', None, 'Son'))
        seen['insert'] |= judge(c, db, op)[0]
    n_delete = 0
    while n_delete < 300:                                           # 삭제 300개
        t = rng.choice(list(COLS))
        row = rng.choice(db[t])
        col = rng.choice(COLS[t])
        if row[col] is None:
            continue
        seen['delete'] |= judge(c, db, ('delete', t, {col: row[col]}))[0]
        n_delete += 1
    plain_cols = {'EMPLOYEE': ['Fname', 'Minit', 'Lname', 'Bdate', 'Address', 'Sex', 'Salary'], 'DEPARTMENT': ['Mgr_start_date'],
                  'PROJECT': ['Plocation'], 'WORKS_ON': ['Hours'], 'DEPENDENT': ['Sex', 'Bdate', 'Relationship']}
    for _ in range(300):                                            # 키도 외래 키도 UNIQUE도 아닌 열을 NULL 아닌 값으로 고치기 300개
        t = rng.choice(list(plain_cols))
        row = rng.choice(db[t])
        where = {k: row[k] for k in PK[t]}
        seen['update_plain'] |= judge(c, db, ('update', t, where, {rng.choice(plain_cols[t]): rng.choice(['Z', 'F', 7.5, 99])}))[0]
    assert seen['insert'] == {'키', '개체 무결성', '참조 무결성', 'NOT NULL'}   # 삽입은 무엇이든 어길 수 있다
    assert seen['delete'] == {'참조 무결성'}                                      # 삭제가 어기는 것은 참조 무결성뿐이다
    assert seen['update_plain'] == set()                                          # 평범한 열을 고치면 아무것도 안 어긴다

    # --- 확인 문제
    # C2: Insert <'Sales', 6, '123456789', NULL> into DEPARTMENT -> 위반 없음
    assert judge(c, db, ('insert', 'DEPARTMENT', ('Sales', 6, '123456789', None)))[0] == set()
    #     Insert <'Research', 6, '123456789', NULL> -> 키(UNIQUE Dname)
    assert judge(c, db, ('insert', 'DEPARTMENT', ('Research', 6, '123456789', None)))[0] == {'키'}
    #     Insert <5, 'Houston'> into DEPT_LOCATIONS -> 키, Insert <2, NULL> -> 개체 무결성 + 참조 무결성
    assert judge(c, db, ('insert', 'DEPT_LOCATIONS', (5, 'Houston')))[0] == {'키'}
    assert judge(c, db, ('insert', 'DEPT_LOCATIONS', (2, None)))[0] == {'개체 무결성', '참조 무결성'}
    # C3: 부서 1을 지우면 EMPLOYEE(Borg), DEPT_LOCATIONS, PROJECT가 가리킨다
    assert judge(c, db, ('delete', 'DEPARTMENT', {'Dnumber': 1}))[0] == {'참조 무결성'}
    assert rows(c, "SELECT (SELECT COUNT(*) FROM EMPLOYEE WHERE Dno = 1), (SELECT COUNT(*) FROM DEPT_LOCATIONS WHERE Dnumber = 1), "
                   "(SELECT COUNT(*) FROM PROJECT WHERE Dnum = 1)") == [(1, 1, 1)]
    # C5: 수정 셋
    assert judge(c, db, ('update', 'WORKS_ON', {'Essn': '123456789', 'Pno': 1}, {'Pno': 2}))[0] == {'키'}       # (123456789, 2)가 이미 있다
    assert judge(c, db, ('update', 'WORKS_ON', {'Essn': '123456789', 'Pno': 1}, {'Pno': 40}))[0] == {'참조 무결성'}
    assert judge(c, db, ('update', 'WORKS_ON', {'Essn': '123456789', 'Pno': 1}, {'Pno': 3}))[0] == set()

    print('ALL CHECKS PASSED')
```
{% endraw %}
