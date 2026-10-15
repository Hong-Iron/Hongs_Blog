---
layout: "note"
title: "42_mapping-one-to-many-relationship_verify.py"
display_title: "42_mapping-one-to-many-relationship_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/mapping-one-to-many-relationship/"
parent_title: "일대다 관계 타입의 사상"
description: "데이터베이스 설계 · 일대다 관계 타입의 사상 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/42_mapping-one-to-many-relationship_verify/"
---
{% raw %}
[일대다 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-many-relationship/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""일대다 관계 타입의 사상 검증.

문서: 42.일대다 관계 타입의 사상 (예시, 두 방법, 카드 C1~C3)
실행: python3 42_mapping-one-to-many-relationship_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. WORKS_FOR(부서 1 : 직원 N): N쪽인 EMPLOYEE에 Dno를 넣는다. 직원 8명 모두 부서 번호가 하나씩 있다.
     반대로 1쪽인 DEPARTMENT에 직원 키를 넣으려면 5번 부서 한 칸에 4개, 4번 부서에 3개가 들어가야 한다.
  2. SUPERVISION(상사 1 : 부하 N): 같은 릴레이션을 가리키는 Super_ssn. 8명 가운데 Borg 한 명만 NULL(부분 참여).
     부하는 Wong 3명, Wallace 2명, Borg 2명이다.
  3. CONTROLS(부서 1 : 프로젝트 N): PROJECT에 Dnum. 6칸 모두 값이 있다. 5번 부서 3개, 4번 2개, 1번 1개.
  4. 교차 참조: WORKS_FOR(Essn, Dno)는 8행이고 기본 키는 N쪽의 키 Essn이다. Dno는 겹친다.
     SUPERVISION을 교차 참조로 만들면 7행이고 NULL이 없다.
  5. 참여하는 튜플이 적을 때: 프로젝트 6개 가운데 1개만 후원 부서가 있다면 외래 키 방법은 NULL이 5칸,
     교차 참조는 1행이다(카드 C3).
"""
import sqlite3

# ---- COMPANY 스키마와 상태. 이 파일 안에 그대로 둔다(다른 파일을 불러오지 않는다) ----
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
    # 1. WORKS_FOR
    assert c.execute("SELECT COUNT(*), COUNT(Dno) FROM EMPLOYEE").fetchone() == (8, 8)
    per_dept = c.execute("SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno ORDER BY Dno").fetchall()
    assert per_dept == [(1, 1), (4, 3), (5, 4)]
    print("[OK] Dno: 직원 8명 모두 한 값. 거꾸로 넣으려면 부서 한 칸에 1, 3, 4개가 필요하다")

    # 2. SUPERVISION
    assert c.execute("SELECT COUNT(*), COUNT(Super_ssn) FROM EMPLOYEE").fetchone() == (8, 7)
    boss = c.execute("""SELECT S.Lname, COUNT(*) FROM EMPLOYEE E, EMPLOYEE S WHERE E.Super_ssn = S.Ssn
                        GROUP BY S.Lname ORDER BY S.Lname""").fetchall()
    assert boss == [("Borg", 2), ("Wallace", 2), ("Wong", 3)]
    print("[OK] Super_ssn: 7칸에 값, Borg만 NULL. 부하 수", boss)

    # 3. CONTROLS
    assert c.execute("SELECT COUNT(*), COUNT(Dnum) FROM PROJECT").fetchone() == (6, 6)
    assert c.execute("SELECT Dnum, COUNT(*) FROM PROJECT GROUP BY Dnum ORDER BY Dnum").fetchall() == [(1, 1), (4, 2), (5, 3)]
    print("[OK] Dnum: 프로젝트 6개 모두 값. 부서별 1, 2, 3개")

    # 4. 교차 참조
    c.executescript("""
      CREATE TABLE WORKS_FOR (Essn CHAR(9) NOT NULL, Dno INT NOT NULL, PRIMARY KEY (Essn),
        FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber));
      INSERT INTO WORKS_FOR SELECT Ssn, Dno FROM EMPLOYEE;
      CREATE TABLE SUPERVISION (Essn CHAR(9) NOT NULL, Super_ssn CHAR(9) NOT NULL, PRIMARY KEY (Essn),
        FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn));
      INSERT INTO SUPERVISION SELECT Ssn, Super_ssn FROM EMPLOYEE WHERE Super_ssn IS NOT NULL;""")
    assert c.execute("SELECT COUNT(*), COUNT(DISTINCT Essn), COUNT(DISTINCT Dno) FROM WORKS_FOR").fetchone() == (8, 8, 3)
    assert c.execute("SELECT COUNT(*) FROM SUPERVISION").fetchone()[0] == 7
    try:
        c.execute("INSERT INTO WORKS_FOR VALUES ('123456789', 4)")           # Smith를 두 번째 부서에
        raise AssertionError("한 직원이 두 부서에 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "UNIQUE constraint failed: WORKS_FOR.Essn" in str(e)
    a = c.execute("SELECT E.Lname, D.Dname FROM EMPLOYEE E, DEPARTMENT D WHERE E.Dno = D.Dnumber ORDER BY E.Lname").fetchall()
    b = c.execute("""SELECT E.Lname, D.Dname FROM EMPLOYEE E, WORKS_FOR W, DEPARTMENT D
                     WHERE W.Essn = E.Ssn AND W.Dno = D.Dnumber ORDER BY E.Lname""").fetchall()
    assert a == b and len(a) == 8
    print("[OK] WORKS_FOR(Essn, Dno) 8행(기본 키 Essn), SUPERVISION 7행. 두 방법의 질의 결과가 같다")

    # 5. 참여가 적을 때 (카드 C3: 지어낸 SPONSORS 관계)
    sponsored = {20: 1}                                    # 프로젝트 20만 후원 부서(1번)가 있다
    pnumbers = [r[0] for r in c.execute("SELECT Pnumber FROM PROJECT")]
    fk_column = [sponsored.get(p) for p in pnumbers]
    assert fk_column.count(None) == 5 and len(sponsored) == 1
    print("[OK] 6개 가운데 1개만 참여: 외래 키 열은 NULL 5칸, 교차 참조는 1행")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
