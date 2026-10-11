---
layout: "note"
title: "39_mapping-entity-types_verify.py"
display_title: "39_mapping-entity-types_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/mapping-entity-types/"
parent_title: "개체 타입의 사상"
description: "데이터베이스 설계 · 개체 타입의 사상 검증 코드"
permalink: "/studies/database-design/code/39_mapping-entity-types_verify/"
---
{% raw %}
[개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""개체 타입의 사상 검증.

문서: 39.개체 타입의 사상 (예시, 절차, 카드 C1~C3)
출처: 데이터베이스 설계 7 슬라이드 p.13~14, 9 슬라이드 p.7~8, 6-2 p.21 (상태)
실행: python3 39_mapping-entity-types_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. 일반 개체: 단순 속성만 열이 된다. 복합 속성 Name은 성분 Fname, Minit, Lname으로 들어간다.
     7 p.13의 결과는 EMPLOYEE 8열, DEPARTMENT 2열, PROJECT 3열이다. 다치 속성 Locations와 유도 속성은 빠진다.
  2. 키 속성이 둘인 DEPARTMENT(Name, Number)와 PROJECT(Name, Number)는 하나만 기본 키가 된다.
     상태에서 Dname, Pname도 안 겹친다(9 p.17~18의 DDL은 UNIQUE로 적는다).
  3. 약한 개체 DEPENDENT: 소유자 기본 키 Essn을 외래 키로 넣고, 기본 키는 (Essn, Dependent_name)이다.
     부분 키 Dependent_name 혼자는 겹친다('Alice'가 두 직원에게 있다). Essn 혼자도 겹친다. 둘을 묶으면 안 겹친다.
  4. Essn이 기본 키의 일부라 NULL일 수 없다. 그래서 주인 없는 부양가족은 넣을 수 없다(식별 관계의 전체 참여).
     없는 직원을 가리키는 부양가족도 넣을 수 없다.
  5. 카드 C1: CAR(4-2 p.12)는 키 속성이 Vehicle_id와 복합 속성 Registration(Number, State) 둘이다.
     옮기면 CAR(Vehicle_id, Reg_number, Reg_state, Make, Model, Year) 6열이고 다치 속성 Color는 빠진다.
     그림의 세 대에서 Vehicle_id도, (Reg_number, Reg_state)도 안 겹친다. Reg_number 혼자는 겹친다(ABC 123이 두 주에 있다).
"""
import sqlite3

# ---- COMPANY 스키마와 상태 (6-2 p.20~21, DDL은 9 p.17~18). 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
DDL = """
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname), FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1) {hours_null},
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
"""
EMP = [
 ('John','B','Smith','123456789','1965-01-09','731 Fondren, Houston, TX','M',30000,'333445555',5),
 ('Franklin','T','Wong','333445555','1955-12-08','638 Voss, Houston, TX','M',40000,'888665555',5),
 ('Alicia','J','Zelaya','999887777','1968-01-19','3321 Castle, Spring, TX','F',25000,'987654321',4),
 ('Jennifer','S','Wallace','987654321','1941-06-20','291 Berry, Bellaire, TX','F',43000,'888665555',4),
 ('Ramesh','K','Narayan','666884444','1962-09-15','975 Fire Oak, Humble, TX','M',38000,'333445555',5),
 ('Joyce','A','English','453453453','1972-07-31','5631 Rice, Houston, TX','F',25000,'333445555',5),
 ('Ahmad','V','Jabbar','987987987','1969-03-29','980 Dallas, Houston, TX','M',25000,'987654321',4),
 ('James','E','Borg','888665555','1937-11-10','450 Stone, Houston, TX','M',55000,None,1)]
DEPT = [('Research',5,'333445555','1988-05-22'),('Administration',4,'987654321','1995-01-01'),('Headquarters',1,'888665555','1981-06-19')]
LOC = [(1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston')]
PROJ = [('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4)]
WORKS = [('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),('987654321',20,15.0),('888665555',20,None)]
DEPN = [('333445555','Alice','F','1986-04-05','Daughter'),('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse')]


def make_company(hours_not_null=False):
    """COMPANY를 메모리 SQLite에 만든다. EMPLOYEE와 DEPARTMENT가 서로 가리켜서 그 외래 키는 커밋 때 검사한다."""
    c = sqlite3.connect(':memory:')
    c.isolation_level = None
    c.execute('PRAGMA foreign_keys=ON')
    c.executescript(DDL.format(hours_null='NOT NULL' if hours_not_null else ''))
    c.execute('BEGIN')
    c.executemany('INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)', EMP)
    c.executemany('INSERT INTO DEPARTMENT VALUES (?,?,?,?)', DEPT)
    c.executemany('INSERT INTO DEPT_LOCATIONS VALUES (?,?)', LOC)
    c.executemany('INSERT INTO PROJECT VALUES (?,?,?,?)', PROJ)
    c.executemany('INSERT INTO WORKS_ON VALUES (?,?,?)', WORKS)
    c.executemany('INSERT INTO DEPENDENT VALUES (?,?,?,?,?)', DEPN)
    c.execute('COMMIT')
    return c
# ---- COMPANY 끝 ----


def map_regular(attrs, key):
    """일반 개체 → (열 목록, 기본 키). attrs의 원소는 단순 속성 이름이거나 (복합 속성 이름, [성분들])."""
    cols = []
    for a in attrs:
        cols.extend(a[1] if isinstance(a, tuple) else [a])
    return cols, key


def map_weak(attrs, owner_pk_as_fk, partial_key):
    """약한 개체 → (열 목록, 기본 키, 외래 키)."""
    cols, _ = map_regular(attrs, None)
    return owner_pk_as_fk + cols, owner_pk_as_fk + partial_key, owner_pk_as_fk


def main():
    # 1. 일반 개체 (다치·유도 속성은 attrs에 넣지 않는다 = 이 단계에서 열이 되지 않는다)
    emp = map_regular([("Name", ["Fname", "Minit", "Lname"]), "Ssn", "Bdate", "Address", "Sex", "Salary"], ["Ssn"])
    dept = map_regular(["Dname", "Dnumber"], ["Dnumber"])
    proj = map_regular(["Pname", "Pnumber", "Plocation"], ["Pnumber"])
    assert emp == (["Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary"], ["Ssn"])
    assert (len(emp[0]), len(dept[0]), len(proj[0])) == (8, 2, 3)
    c = make_company()
    cols = {t: [r[1] for r in c.execute(f"PRAGMA table_info({t})")] for t in ("EMPLOYEE", "DEPARTMENT", "PROJECT", "DEPENDENT")}
    assert set(emp[0]) <= set(cols["EMPLOYEE"]) and set(dept[0]) <= set(cols["DEPARTMENT"]) and set(proj[0]) <= set(cols["PROJECT"])
    assert not {"Name", "Locations", "Number_of_employees"} & (set(cols["EMPLOYEE"]) | set(cols["DEPARTMENT"]))
    print("[OK] 일반 개체: EMPLOYEE 8열, DEPARTMENT 2열, PROJECT 3열. Name·Locations·Number_of_employees 열은 없다")

    # 2. 키 속성이 둘이면 하나만 기본 키
    assert c.execute("SELECT COUNT(DISTINCT Dname), COUNT(DISTINCT Dnumber), COUNT(*) FROM DEPARTMENT").fetchone() == (3, 3, 3)
    assert c.execute("SELECT COUNT(DISTINCT Pname), COUNT(DISTINCT Pnumber), COUNT(*) FROM PROJECT").fetchone() == (6, 6, 6)
    try:
        c.execute("INSERT INTO DEPARTMENT VALUES ('Research', 9, '888665555', NULL)")
        raise AssertionError("같은 부서 이름이 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "UNIQUE constraint failed: DEPARTMENT.Dname" in str(e)
    print("[OK] Dname·Pname도 안 겹친다. 기본 키는 Dnumber·Pnumber, 이름은 UNIQUE")

    # 3. 약한 개체
    dep = map_weak(["Dependent_name", "Sex", "Bdate", "Relationship"], ["Essn"], ["Dependent_name"])
    assert dep == (["Essn", "Dependent_name", "Sex", "Bdate", "Relationship"], ["Essn", "Dependent_name"], ["Essn"])
    assert dep[0] == cols["DEPENDENT"]
    n, names, owners, pairs = c.execute(
        "SELECT COUNT(*), COUNT(DISTINCT Dependent_name), COUNT(DISTINCT Essn), COUNT(DISTINCT Essn || '/' || Dependent_name) FROM DEPENDENT").fetchone()
    assert (n, names, owners, pairs) == (7, 6, 3, 7)
    assert c.execute("SELECT Essn FROM DEPENDENT WHERE Dependent_name = 'Alice' ORDER BY Essn").fetchall() == [("123456789",), ("333445555",)]
    print("[OK] DEPENDENT 7행: 이름은 6가지(Alice가 둘), 주인은 3명, (Essn, 이름) 짝은 7가지")

    # 4. 주인 없는 부양가족은 못 넣는다
    for sql, needle in (("INSERT INTO DEPENDENT VALUES (NULL, 'Tom', 'M', NULL, 'Son')", "NOT NULL constraint failed: DEPENDENT.Essn"),
                        ("INSERT INTO DEPENDENT VALUES ('000000000', 'Tom', 'M', NULL, 'Son')", "FOREIGN KEY constraint failed")):
        try:
            c.execute(sql)
            raise AssertionError(sql)
        except sqlite3.IntegrityError as e:
            assert needle in str(e), str(e)
    c.execute("INSERT INTO DEPENDENT VALUES ('666884444', 'Alice', 'F', NULL, 'Daughter')")     # 다른 주인의 Alice는 들어간다
    print("[OK] Essn이 NULL이거나 없는 직원이면 거부. 다른 직원의 'Alice'는 들어간다")

    # 5. 카드 C1: CAR
    car = map_regular(["Vehicle_id", ("Registration", ["Reg_number", "Reg_state"]), "Make", "Model", "Year"], ["Vehicle_id"])
    assert car[0] == ["Vehicle_id", "Reg_number", "Reg_state", "Make", "Model", "Year"] and len(car[0]) == 6
    cars = [("TK629", "ABC 123", "TEXAS", "Ford Mustang", "convertible", 2004),
            ("WP9872", "ABC 123", "NEW YORK", "Nissan Maxima", "4-door", 2005),
            ("TD729", "VSY 720", "TEXAS", "Chrysler LeBaron", "4-door", 2002)]
    assert len({r[0] for r in cars}) == 3 and len({(r[1], r[2]) for r in cars}) == 3 and len({r[1] for r in cars}) == 2
    print("[OK] CAR: 6열. Vehicle_id와 (Reg_number, Reg_state)는 안 겹치고 Reg_number 혼자는 겹친다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
