---
layout: "note"
title: "40_mapping-multivalued-attributes_verify.py"
display_title: "40_mapping-multivalued-attributes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/mapping-multivalued-attributes/"
parent_title: "다치 속성의 사상"
description: "데이터베이스 설계 · 다치 속성의 사상 검증 코드"
permalink: "/studies/database-design/code/40_mapping-multivalued-attributes_verify/"
---
{% raw %}
[다치 속성의 사상](/Hongs_Blog/studies/database-design/mapping-multivalued-attributes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다치 속성의 사상 검증.

문서: 40.다치 속성의 사상 (예시, 절차, 카드 C1~C3)
출처: 데이터베이스 설계 7 슬라이드 p.15, 9 슬라이드 p.9, 6-2 p.14·p.21
실행: python3 40_mapping-multivalued-attributes_verify.py   (표준 라이브러리 sqlite3만 쓴다)
주장:
  1. DEPT_LOCATIONS(Dnumber, Dlocation)는 5행이다. Dnumber 5가 세 번, Houston이 두 번 나온다.
     그래서 어느 속성도 혼자서는 키가 아니고, 둘을 묶어야 안 겹친다.
  2. Dnumber는 DEPARTMENT를 가리키는 외래 키다. 없는 부서의 위치는 넣을 수 없다. 같은 (부서, 위치)를 두 번 넣을 수도 없다.
  3. 행을 부서별로 다시 모으면 원래의 여러 값이 나온다: 1 → {Houston}, 4 → {Stafford}, 5 → {Bellaire, Sugarland, Houston}.
  4. 위치를 DEPARTMENT 안에 그대로 두고 위치마다 행을 만들면 5행이 되고 Dnumber 5가 세 번 나와 기본 키가 깨진다.
     부서 이름과 관리자도 세 번 적힌다.
  5. 카드 C3: Houston에 있는 부서는 1번과 5번이다.
  6. 카드 C1: CAR(4-2 p.12)의 다치 속성 Color를 CAR_COLOR(Vehicle_id, Color)로 옮기면 세 대의 색
     {red, black}, {blue}, {white, blue}가 5행이 된다. blue가 두 번, TK629가 두 번 나와 둘을 묶어야 안 겹친다.
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
    # 1. 키
    n, d, l = c.execute("SELECT COUNT(*), COUNT(DISTINCT Dnumber), COUNT(DISTINCT Dlocation) FROM DEPT_LOCATIONS").fetchone()
    assert (n, d, l) == (5, 3, 4)
    assert c.execute("SELECT COUNT(*) FROM DEPT_LOCATIONS WHERE Dnumber = 5").fetchone()[0] == 3
    assert c.execute("SELECT COUNT(*) FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston'").fetchone()[0] == 2
    assert c.execute("SELECT COUNT(*) FROM (SELECT DISTINCT Dnumber, Dlocation FROM DEPT_LOCATIONS)").fetchone()[0] == 5
    print("[OK] 5행: 부서 번호 3가지, 위치 4가지, (번호, 위치) 짝 5가지")

    # 2. 외래 키와 기본 키
    for sql, needle in (("INSERT INTO DEPT_LOCATIONS VALUES (9, 'Dallas')", "FOREIGN KEY constraint failed"),
                        ("INSERT INTO DEPT_LOCATIONS VALUES (5, 'Houston')", "UNIQUE constraint failed")):
        try:
            c.execute(sql)
            raise AssertionError(sql)
        except sqlite3.IntegrityError as e:
            assert needle in str(e), str(e)
    c.execute("INSERT INTO DEPT_LOCATIONS VALUES (4, 'Houston')")          # 새 짝은 들어간다
    c.execute("DELETE FROM DEPT_LOCATIONS WHERE Dnumber = 4 AND Dlocation = 'Houston'")
    print("[OK] 없는 9번 부서의 위치, 이미 있는 (5, Houston)은 거부")

    # 3. 다시 모으기
    back = {}
    for dno, loc in c.execute("SELECT Dnumber, Dlocation FROM DEPT_LOCATIONS"):
        back.setdefault(dno, set()).add(loc)
    assert back == {1: {"Houston"}, 4: {"Stafford"}, 5: {"Bellaire", "Sugarland", "Houston"}}
    print("[OK] 부서별로 모으면", {k: sorted(v) for k, v in sorted(back.items())})

    # 4. 위치를 DEPARTMENT에 둔 채 행을 늘리면
    wide = c.execute("SELECT D.Dname, D.Dnumber, D.Mgr_ssn, L.Dlocation FROM DEPARTMENT D, DEPT_LOCATIONS L WHERE D.Dnumber = L.Dnumber").fetchall()
    assert len(wide) == 5
    assert sum(1 for r in wide if r[1] == 5) == 3 and len({r[1] for r in wide}) == 3      # Dnumber가 겹친다
    assert sum(1 for r in wide if r[0] == "Research") == 3                                # 이름도 세 번 적힌다
    print("[OK] 한 표에 두면 5행에 Dnumber 5와 'Research'가 세 번씩 나온다")

    # 5. 카드 C3
    assert c.execute("SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston' ORDER BY Dnumber").fetchall() == [(1,), (5,)]
    print("[OK] Houston에 있는 부서: 1, 5")

    # 6. 카드 C1: CAR의 Color
    colors = {"TK629": {"red", "black"}, "WP9872": {"blue"}, "TD729": {"white", "blue"}}
    car_color = sorted((v, col) for v, cs in colors.items() for col in cs)
    assert len(car_color) == 5 and len(set(car_color)) == 5
    assert sum(1 for _, col in car_color if col == "blue") == 2 and sum(1 for v, _ in car_color if v == "TK629") == 2
    print("[OK] CAR_COLOR 5행: blue 두 번, TK629 두 번, 짝은 안 겹친다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
