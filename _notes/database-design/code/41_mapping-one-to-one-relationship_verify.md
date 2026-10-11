---
layout: "note"
title: "41_mapping-one-to-one-relationship_verify.py"
display_title: "41_mapping-one-to-one-relationship_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/mapping-one-to-one-relationship/"
parent_title: "일대일 관계 타입의 사상"
description: "데이터베이스 설계 · 일대일 관계 타입의 사상 검증 코드"
permalink: "/studies/database-design/code/41_mapping-one-to-one-relationship_verify/"
---
{% raw %}
[일대일 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-one-relationship/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""일대일 관계 타입의 사상 검증.

문서: 41.일대일 관계 타입의 사상 (예시, 세 방법, 카드 C1~C4)
출처: 데이터베이스 설계 7 슬라이드 p.16~20, 9 슬라이드 p.10, 6-2 p.21 (상태)
실행: python3 41_mapping-one-to-one-relationship_verify.py   (표준 라이브러리 sqlite3만 쓴다)
MANAGES(직원 1 : 부서 1. 부서는 전체 참여, 직원은 부분 참여)를 세 방법으로 옮겨 COMPANY 상태로 견준다.
주장:
  1. 외래 키 방법, 전체 참여인 DEPARTMENT에 넣기(7 p.17): Mgr_ssn 3칸이 모두 차 있다. NULL 0개.
  2. 외래 키 방법, 부분 참여인 EMPLOYEE에 넣기(7 p.18): D_managed가 8명 가운데 5명에게 NULL이다.
     Mgr_start_date까지 옮기면 NULL은 10칸이다.
  3. 합친 릴레이션(7 p.19): 직원 8명, 부서 3개라 튜플 수가 다르다. 한 표로 합치면 8행 가운데 5행의 부서 열이 NULL이고,
     Dnumber는 NULL이 있어 기본 키가 못 된다. 양쪽이 전체 참여일 때만 쓸 수 있다.
  4. 교차 참조(7 p.20): MANAGES(Essn, Dno)는 3행이고 Essn도 Dno도 혼자 안 겹친다(둘 중 하나가 기본 키).
     부서 이름과 관리자 성을 함께 보려면 표 셋을 이어야 한다. 외래 키 방법은 둘이면 된다. 결과는 같다.
  5. 외래 키만으로는 "한 직원이 많아야 한 부서를 관리한다"가 지켜지지 않는다. Mgr_ssn에 UNIQUE가 없으면
     Wong을 관리자로 하는 부서를 하나 더 넣을 수 있다. UNIQUE를 걸면 거부된다.
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


def main():
    c = make_company()
    # 1. S = DEPARTMENT
    assert c.execute("SELECT COUNT(*), COUNT(Mgr_ssn) FROM DEPARTMENT").fetchone() == (3, 3)
    print("[OK] DEPARTMENT.Mgr_ssn: 3칸 모두 값이 있다")

    # 2. S = EMPLOYEE (7 p.18의 D_managed)
    c.executescript("""
      CREATE TABLE EMPLOYEE2 AS
        SELECT E.Ssn, E.Lname, D.Dnumber AS D_managed, D.Mgr_start_date
        FROM EMPLOYEE E LEFT OUTER JOIN DEPARTMENT D ON D.Mgr_ssn = E.Ssn;""")
    total, filled = c.execute("SELECT COUNT(*), COUNT(D_managed) FROM EMPLOYEE2").fetchone()
    assert (total, filled) == (8, 3) and total - filled == 5
    null_cells = c.execute("SELECT SUM((D_managed IS NULL) + (Mgr_start_date IS NULL)) FROM EMPLOYEE2").fetchone()[0]
    assert null_cells == 10
    assert [r[0] for r in c.execute("SELECT Lname FROM EMPLOYEE2 WHERE D_managed IS NOT NULL ORDER BY Lname")] == ["Borg", "Wallace", "Wong"]
    print("[OK] EMPLOYEE.D_managed: 8명 가운데 5명이 NULL, Mgr_start_date까지 NULL 10칸")

    # 3. 합친 릴레이션
    assert c.execute("SELECT (SELECT COUNT(*) FROM EMPLOYEE), (SELECT COUNT(*) FROM DEPARTMENT)").fetchone() == (8, 3)
    merged = c.execute("""SELECT E.Ssn, D.Dname, D.Dnumber FROM EMPLOYEE E LEFT OUTER JOIN DEPARTMENT D ON D.Mgr_ssn = E.Ssn""").fetchall()
    assert len(merged) == 8 and sum(1 for r in merged if r[2] is None) == 5
    print("[OK] 합치면 8행 가운데 5행의 Dname·Dnumber가 NULL이다. Dnumber는 기본 키가 못 된다")

    # 4. 교차 참조
    c.executescript("""
      CREATE TABLE MANAGES (Essn CHAR(9) NOT NULL, Dno INT NOT NULL, PRIMARY KEY (Essn),
        FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber));
      INSERT INTO MANAGES SELECT Mgr_ssn, Dnumber FROM DEPARTMENT;""")
    assert c.execute("SELECT COUNT(*), COUNT(DISTINCT Essn), COUNT(DISTINCT Dno) FROM MANAGES").fetchone() == (3, 3, 3)
    by_fk = c.execute("SELECT D.Dname, E.Lname FROM DEPARTMENT D, EMPLOYEE E WHERE D.Mgr_ssn = E.Ssn ORDER BY D.Dname").fetchall()
    by_cross = c.execute("""SELECT D.Dname, E.Lname FROM DEPARTMENT D, MANAGES M, EMPLOYEE E
                            WHERE M.Dno = D.Dnumber AND M.Essn = E.Ssn ORDER BY D.Dname""").fetchall()
    assert by_fk == by_cross == [("Administration", "Wallace"), ("Headquarters", "Borg"), ("Research", "Wong")]
    print("[OK] MANAGES(Essn, Dno) 3행. 표 둘을 이은 답과 셋을 이은 답이 같다:", by_fk)

    # 5. 1:1을 지키려면
    c.execute("INSERT INTO DEPARTMENT VALUES ('Planning', 9, '333445555', NULL)")            # Wong이 두 부서를 관리한다
    assert c.execute("SELECT COUNT(*) FROM DEPARTMENT WHERE Mgr_ssn = '333445555'").fetchone()[0] == 2
    c.execute("DELETE FROM DEPARTMENT WHERE Dnumber = 9")
    c.execute("CREATE UNIQUE INDEX one_dept_per_manager ON DEPARTMENT (Mgr_ssn)")
    try:
        c.execute("INSERT INTO DEPARTMENT VALUES ('Planning', 9, '333445555', NULL)")
        raise AssertionError("UNIQUE를 걸었는데 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "UNIQUE constraint failed: DEPARTMENT.Mgr_ssn" in str(e)
    print("[OK] UNIQUE가 없으면 Wong이 두 부서의 관리자가 된다. Mgr_ssn에 UNIQUE를 걸면 거부된다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
