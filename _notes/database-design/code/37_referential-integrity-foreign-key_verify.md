---
layout: "note"
title: "37_referential-integrity-foreign-key_verify.py"
display_title: "37_referential-integrity-foreign-key_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/referential-integrity-foreign-key/"
parent_title: "참조 무결성 제약과 외래 키"
description: "데이터베이스 설계 · 참조 무결성 제약과 외래 키 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/37_referential-integrity-foreign-key_verify/"
---
{% raw %}
[참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""참조 무결성 제약과 외래 키 검증.

문서: 37.참조 무결성 제약과 외래 키 (예시, 정의, 오해, 카드 C1~C5)
출처: Elmasri & Navathe, Fundamentals of Database Systems 5장(참조 무결성 제약, 외래 키)과 COMPANY 상태
실행: python3 37_referential-integrity-foreign-key_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. COMPANY의 외래 키는 8개다. 화살표는 Ssn에 4개, Dnumber에 3개, Pnumber에 1개가 꽂힌다(문서의 외래 키 표).
  2. COMPANY 상태의 모든 외래 키 값은 가리키는 릴레이션의 기본 키에 있거나 NULL이다.
     NULL인 외래 키는 Borg의 Super_ssn 하나다. Smith의 Dno 5는 Research 부서를 가리킨다(문서의 예시).
  3. 없는 값을 가리키는 튜플은 못 넣는다(Dno 7, Super_ssn 000000000). 외래 키가 NULL인 튜플은 넣을 수 있다.
  4. 가리킴을 받는 튜플은 그냥 지울 수 없다(5번 부서). 아무도 안 가리키는 튜플은 지울 수 있다.
  5. 외래 키는 자기 릴레이션에서 값이 겹쳐도 된다(Dno 5가 네 번). 같은 릴레이션을 가리킬 수도 있다(Super_ssn).
  6. 카드 C4: Wong(333445555)을 가리키는 외래 키 값은 Super_ssn 3, Mgr_ssn 1, WORKS_ON.Essn 4, DEPENDENT.Essn 3, 모두 11개.
  7. 이름이 같다고 외래 키가 되지는 않는다: DEPENDENT.Sex와 EMPLOYEE.Sex, DEPENDENT.Bdate와 EMPLOYEE.Bdate.
  8. SQLite는 "같은 도메인" 조건을 검사하지 않는다(DATE 열이 INT 기본 키를 가리켜도 표가 만들어진다).
     또 PRAGMA foreign_keys=ON을 하지 않으면 외래 키를 아예 검사하지 않는다(없는 부서를 가리키는 직원이 들어간다).
     PostgreSQL의 동작은 37_referential-integrity-foreign-key_verify.sql.
"""
import sqlite3

# ---- COMPANY 스키마와 상태 (Elmasri & Navathe의 COMPANY, DDL은 같은 교재의 CREATE TABLE 문). 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
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

FKS = [("EMPLOYEE", "Super_ssn", "EMPLOYEE", "Ssn"), ("EMPLOYEE", "Dno", "DEPARTMENT", "Dnumber"),
       ("DEPARTMENT", "Mgr_ssn", "EMPLOYEE", "Ssn"), ("DEPT_LOCATIONS", "Dnumber", "DEPARTMENT", "Dnumber"),
       ("PROJECT", "Dnum", "DEPARTMENT", "Dnumber"), ("WORKS_ON", "Essn", "EMPLOYEE", "Ssn"),
       ("WORKS_ON", "Pno", "PROJECT", "Pnumber"), ("DEPENDENT", "Essn", "EMPLOYEE", "Ssn")]


def fk_fails(c, sql):
    try:
        c.execute(sql)
    except sqlite3.IntegrityError as e:
        assert "FOREIGN KEY constraint failed" in str(e), str(e)
        return True
    return False


def main():
    c = make_company()
    # 1. 외래 키 8개와 화살표가 꽂히는 곳
    into = {}
    for _, _, ref, pk in FKS:
        into[(ref, pk)] = into.get((ref, pk), 0) + 1
    assert len(FKS) == 8
    assert into == {("EMPLOYEE", "Ssn"): 4, ("DEPARTMENT", "Dnumber"): 3, ("PROJECT", "Pnumber"): 1}
    print("[OK] 외래 키 8개. Ssn에 4, Dnumber에 3, Pnumber에 1")

    # 2. 조건 2: 값이 상대 기본 키에 있거나 NULL
    null_fks = 0
    for rel, fk, ref, pk in FKS:
        bad = c.execute(f"SELECT COUNT(*) FROM {rel} WHERE {fk} IS NOT NULL AND {fk} NOT IN (SELECT {pk} FROM {ref})").fetchone()[0]
        assert bad == 0, (rel, fk)
        null_fks += c.execute(f"SELECT COUNT(*) FROM {rel} WHERE {fk} IS NULL").fetchone()[0]
    assert null_fks == 1
    row = c.execute("SELECT D.Dname FROM EMPLOYEE E, DEPARTMENT D WHERE E.Lname = 'Smith' AND E.Dno = D.Dnumber").fetchone()
    assert row == ("Research",)
    print("[OK] 외래 키 값은 모두 상대 기본 키에 있다. NULL은 Borg의 Super_ssn 하나. Smith → Research")

    # 3. 넣기
    assert fk_fails(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('A', 'Kim', '111111111', NULL, 7)")
    assert fk_fails(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('A', 'Kim', '111111111', '000000000', 1)")
    assert not fk_fails(c, "INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('A', 'Kim', '111111111', NULL, 1)")
    c.execute("DELETE FROM EMPLOYEE WHERE Ssn = '111111111'")
    print("[OK] Dno 7, Super_ssn 000000000은 거부. Super_ssn이 NULL이면 들어간다")

    # 4. 지우기
    assert fk_fails(c, "DELETE FROM DEPARTMENT WHERE Dnumber = 5")
    c.execute("INSERT INTO DEPARTMENT VALUES ('Temp', 9, '888665555', NULL)")
    assert not fk_fails(c, "DELETE FROM DEPARTMENT WHERE Dnumber = 9")
    assert c.execute("SELECT COUNT(*) FROM DEPARTMENT").fetchone()[0] == 3
    print("[OK] 가리킴을 받는 5번 부서는 못 지운다. 아무도 안 가리키는 9번 부서는 지워진다")

    # 5. 외래 키 값은 겹쳐도 되고, 같은 릴레이션을 가리켜도 된다
    assert c.execute("SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno ORDER BY Dno").fetchall() == [(1, 1), (4, 3), (5, 4)]
    assert c.execute("SELECT S.Lname FROM EMPLOYEE E, EMPLOYEE S WHERE E.Lname = 'Smith' AND E.Super_ssn = S.Ssn").fetchone() == ("Wong",)
    print("[OK] Dno 5는 네 번 나온다. Smith의 Super_ssn은 같은 릴레이션의 Wong을 가리킨다")

    # 6. 카드 C4: Wong을 가리키는 값
    w = "333445555"
    refs = [c.execute(f"SELECT COUNT(*) FROM {rel} WHERE {fk} = ?", (w,)).fetchone()[0]
            for rel, fk, ref, _ in FKS if ref == "EMPLOYEE"]
    assert refs == [3, 1, 4, 3] and sum(refs) == 11
    print("[OK] Wong을 가리키는 외래 키 값: Super_ssn 3, Mgr_ssn 1, WORKS_ON.Essn 4, DEPENDENT.Essn 3 = 11")

    # 7. 이름이 같아도 외래 키가 아니다
    fk_cols = {(rel, fk) for rel, fk, _, _ in FKS}
    assert ("DEPENDENT", "Sex") not in fk_cols and ("DEPENDENT", "Bdate") not in fk_cols
    assert ("EMPLOYEE", "Dno") in fk_cols                 # 이름이 달라도(Dno ↔ Dnumber) 외래 키다
    print("[OK] DEPENDENT.Sex·Bdate는 이름만 같다. Dno는 이름이 달라도 Dnumber를 가리킨다")

    # 8. SQLite는 자료형이 달라도 외래 키를 받는다
    q = sqlite3.connect(":memory:")
    q.execute("PRAGMA foreign_keys=ON")
    q.execute("CREATE TABLE DEPARTMENT (Dname VARCHAR(15), Dnumber INT PRIMARY KEY)")
    q.execute("CREATE TABLE ODD (Since DATE REFERENCES DEPARTMENT(Dnumber))")      # 오류 없이 만들어진다
    off = sqlite3.connect(":memory:")                                             # PRAGMA를 켜지 않은 연결
    off.execute("CREATE TABLE DEPARTMENT (Dnumber INT PRIMARY KEY)")
    off.execute("CREATE TABLE EMPLOYEE (Ssn CHAR(9) PRIMARY KEY, Dno INT REFERENCES DEPARTMENT(Dnumber))")
    off.execute("INSERT INTO EMPLOYEE VALUES ('111111111', 7)")
    assert off.execute("SELECT COUNT(*) FROM EMPLOYEE").fetchone()[0] == 1
    print("[OK] SQLite: DATE 열이 INT 기본 키를 가리키는 표가 만들어진다. PRAGMA를 안 켜면 없는 부서도 들어간다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
