---
layout: "note"
title: "60_nested-query-in_verify.py"
display_title: "60_nested-query-in_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "60"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/nested-query-in/"
parent_title: "중첩 질의와 IN"
description: "데이터베이스 설계 · 중첩 질의와 IN 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/60_nested-query-in_verify/"
---
{% raw %}
[중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중첩 질의와 IN 검증 (SQLite).

문서: 60.중첩 질의와 IN
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.11~12, 14, 19, 30, 12주차 풀이 p.7
주장:
  1. Q4A(p.11): Smith가 관리자이거나 일하는 프로젝트 번호는 1, 2다. 첫째 안쪽 질의는 빈 표, 둘째는 {1, 2}.
     Wong으로 바꾸면 {1, 2, 3}과 {2, 3, 10, 20}이라 바깥 결과는 {1, 2, 3, 10, 20}이다.
  2. Q17(p.19): 프로젝트 1, 2, 3에서 일하는 직원의 Essn은 4개다.
  3. Q16(p.14): 이 상태에서는 0행이다. 조건을 성별만 남기면 별칭이 있을 때 2명,
     별칭 없이 Sex = Sex로 쓰면 3명(안쪽 표의 Sex끼리 견준다).
  4. 값 하나를 돌려주는 안쪽 질의(p.30): 부양가족이 둘 이상인 직원은 Smith, Wong.
  5. 12주차 풀이 Q3-2(p.7): = 뒤의 안쪽 질의가 2행을 돌려준다. SQLite는 첫 행만 써서 3명, IN으로 고치면 5명.
"""
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7, 슬라이드 6-2 p.20~21).
# 파일끼리 import하지 않으려고 통째로 넣었다.
# - 서로 가리키는 외래 키(EMPLOYEE.Dno <-> DEPARTMENT.Mgr_ssn)는 커밋할 때 검사하도록 미뤘다.
# - 슬라이드의 DDL(9 p.18)은 Hours가 NOT NULL이지만 상태에 (888665555, 20, NULL)이 있어 NOT NULL을 뺐다.
DDL = """
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE,
  Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
"""
EMP = [
    ("John", "B", "Smith", "123456789", "1965-01-09", "731 Fondren, Houston, TX", "M", 30000, "333445555", 5),
    ("Franklin", "T", "Wong", "333445555", "1955-12-08", "638 Voss, Houston, TX", "M", 40000, "888665555", 5),
    ("Alicia", "J", "Zelaya", "999887777", "1968-01-19", "3321 Castle, Spring, TX", "F", 25000, "987654321", 4),
    ("Jennifer", "S", "Wallace", "987654321", "1941-06-20", "291 Berry, Bellaire, TX", "F", 43000, "888665555", 4),
    ("Ramesh", "K", "Narayan", "666884444", "1962-09-15", "975 Fire Oak, Humble, TX", "M", 38000, "333445555", 5),
    ("Joyce", "A", "English", "453453453", "1972-07-31", "5631 Rice, Houston, TX", "F", 25000, "333445555", 5),
    ("Ahmad", "V", "Jabbar", "987987987", "1969-03-29", "980 Dallas, Houston, TX", "M", 25000, "987654321", 4),
    ("James", "E", "Borg", "888665555", "1937-11-10", "450 Stone, Houston, TX", "M", 55000, None, 1),
]
DEPT = [("Research", 5, "333445555", "1988-05-22"), ("Administration", 4, "987654321", "1995-01-01"),
        ("Headquarters", 1, "888665555", "1981-06-19")]
LOC = [(1, "Houston"), (4, "Stafford"), (5, "Bellaire"), (5, "Sugarland"), (5, "Houston")]
PROJ = [("ProductX", 1, "Bellaire", 5), ("ProductY", 2, "Sugarland", 5), ("ProductZ", 3, "Houston", 5),
        ("Computerization", 10, "Stafford", 4), ("Reorganization", 20, "Houston", 1), ("Newbenefits", 30, "Stafford", 4)]
WORKS = [("123456789", 1, 32.5), ("123456789", 2, 7.5), ("666884444", 3, 40.0), ("453453453", 1, 20.0),
         ("453453453", 2, 20.0), ("333445555", 2, 10.0), ("333445555", 3, 10.0), ("333445555", 10, 10.0),
         ("333445555", 20, 10.0), ("999887777", 30, 30.0), ("999887777", 10, 10.0), ("987987987", 10, 35.0),
         ("987987987", 30, 5.0), ("987654321", 30, 20.0), ("987654321", 20, 15.0), ("888665555", 20, None)]
DEPN = [("333445555", "Alice", "F", "1986-04-05", "Daughter"), ("333445555", "Theodore", "M", "1983-10-25", "Son"),
        ("333445555", "Joy", "F", "1958-05-03", "Spouse"), ("987654321", "Abner", "M", "1942-02-28", "Spouse"),
        ("123456789", "Michael", "M", "1988-01-04", "Son"), ("123456789", "Alice", "F", "1988-12-30", "Daughter"),
        ("123456789", "Elizabeth", "F", "1967-05-05", "Spouse")]


def make():
    """COMPANY 데이터베이스를 메모리에 새로 만든다."""
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(DDL)
    c.execute("BEGIN")
    c.executemany("INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?,?,?)", EMP)
    c.executemany("INSERT INTO DEPARTMENT VALUES (?,?,?,?)", DEPT)
    c.executemany("INSERT INTO DEPT_LOCATIONS VALUES (?,?)", LOC)
    c.executemany("INSERT INTO PROJECT VALUES (?,?,?,?)", PROJ)
    c.executemany("INSERT INTO WORKS_ON VALUES (?,?,?)", WORKS)
    c.executemany("INSERT INTO DEPENDENT VALUES (?,?,?,?,?)", DEPN)
    c.commit()
    return c


def rows(c, sql):
    """질의 결과를 행의 목록으로 돌려준다."""
    return c.execute(sql).fetchall()


def col(c, sql):
    """결과의 첫 열만 목록으로 돌려준다."""
    return [r[0] for r in c.execute(sql).fetchall()]


def cols(c, sql):
    """결과 표의 열 이름을 차례대로 돌려준다."""
    return [d[0] for d in c.execute(sql).description]


def fails(c, sql):
    """질의가 오류를 내면 오류 글을, 안 내면 None을 돌려준다."""
    try:
        c.execute(sql).fetchall()
    except sqlite3.Error as e:
        return str(e)
    return None


Q4A = """SELECT DISTINCT Pnumber FROM PROJECT
WHERE Pnumber IN (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
                  WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'NAME')
   OR Pnumber IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'NAME')"""
AS_MANAGER = """SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'NAME'"""
AS_WORKER = "SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'NAME'"


def main():
    c = make()

    # 1. Q4A
    assert sorted(col(c, Q4A.replace("NAME", "Smith"))) == [1, 2]
    assert col(c, AS_MANAGER.replace("NAME", "Smith")) == []
    assert sorted(col(c, AS_WORKER.replace("NAME", "Smith"))) == [1, 2]
    assert sorted(col(c, AS_MANAGER.replace("NAME", "Wong"))) == [1, 2, 3]
    assert sorted(col(c, AS_WORKER.replace("NAME", "Wong"))) == [2, 3, 10, 20]
    assert sorted(col(c, Q4A.replace("NAME", "Wong"))) == [1, 2, 3, 10, 20]
    union = """SELECT DISTINCT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
               WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith'
               UNION
               SELECT DISTINCT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE
               WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Smith'"""
    assert sorted(col(c, union)) == [1, 2]
    print("[OK] Q4A: Smith -> {1, 2}, Wong -> {1, 2, 3, 10, 20}, UNION 판과 같다")

    # 2. Q17 명시적 집합
    q17 = "SELECT DISTINCT Essn FROM WORKS_ON WHERE Pno IN (1, 2, 3)"
    assert sorted(col(c, q17)) == ["123456789", "333445555", "453453453", "666884444"]
    print("[OK] Q17: Essn 4개")

    # 3. Q16과 이름이 겹칠 때
    q16 = """SELECT E.Fname, E.Lname FROM EMPLOYEE AS E
             WHERE E.Ssn IN (SELECT D.Essn FROM DEPENDENT AS D
                             WHERE E.Fname = D.Dependent_name AND E.Sex = D.Sex)"""
    assert rows(c, q16) == []
    with_alias = """SELECT E.Lname FROM EMPLOYEE AS E
                    WHERE E.Ssn IN (SELECT D.Essn FROM DEPENDENT AS D WHERE E.Sex = D.Sex)"""
    no_alias = "SELECT Lname FROM EMPLOYEE WHERE Ssn IN (SELECT Essn FROM DEPENDENT WHERE Sex = Sex)"
    assert sorted(col(c, with_alias)) == ["Smith", "Wong"]
    assert sorted(col(c, no_alias)) == ["Smith", "Wallace", "Wong"]
    # Wallace(F)의 부양가족은 Abner(M) 한 명뿐이다
    assert rows(c, "SELECT Dependent_name, Sex FROM DEPENDENT WHERE Essn = '987654321'") == [("Abner", "M")]
    print("[OK] Q16: 0행. 성별만 견주면 별칭이 있을 때 2명, 없을 때 3명")

    # 4. 값 하나를 돌려주는 안쪽 질의
    two = "SELECT Lname, Fname FROM EMPLOYEE WHERE (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2"
    assert sorted(rows(c, two)) == [("Smith", "John"), ("Wong", "Franklin")]
    single = """SELECT E.Lname FROM EMPLOYEE AS E
                WHERE E.Super_ssn = (SELECT S.Ssn FROM EMPLOYEE AS S
                                     WHERE S.Fname = 'Franklin' AND S.Lname = 'Wong')"""
    assert sorted(col(c, single)) == ["English", "Narayan", "Smith"]
    print("[OK] p.30: 부양가족 둘 이상은 Smith, Wong. 한 행짜리 안쪽 질의 앞의 = 는 3명")

    # 5. = 대신 IN (12주차 풀이 Q3-2)
    inner = "SELECT Lname FROM EMPLOYEE WHERE Super_ssn = '888665555'"
    assert sorted(col(c, inner)) == ["Wallace", "Wong"]
    eq = "SELECT Lname FROM EMPLOYEE WHERE Super_ssn = (SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555')"
    with_in = eq.replace("Super_ssn = (", "Super_ssn IN (")
    assert sorted(col(c, eq)) == ["English", "Narayan", "Smith"]          # SQLite: 첫 행(Wong)만 쓴다
    assert sorted(col(c, with_in)) == ["English", "Jabbar", "Narayan", "Smith", "Zelaya"]
    print("[OK] Q3-2: 안쪽 2행. SQLite의 = 는 3명(조용히 틀림), IN은 5명")

    # 예제: 두 겹 중첩 (Smith와 같은 프로젝트에서 일하는 직원)
    coworkers = """SELECT Lname FROM EMPLOYEE
                   WHERE Ssn IN (SELECT Essn FROM WORKS_ON
                                 WHERE Pno IN (SELECT Pno FROM WORKS_ON, EMPLOYEE
                                               WHERE Essn = Ssn AND Lname = 'Smith'))"""
    assert sorted(col(c, coworkers)) == ["English", "Smith", "Wong"]
    mid = """SELECT DISTINCT Essn FROM WORKS_ON
             WHERE Pno IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith')"""
    assert sorted(col(c, mid)) == ["123456789", "333445555", "453453453"]
    assert sorted(col(c, coworkers + " AND Lname <> 'Smith'")) == ["English", "Wong"]
    print("[OK] 예제: Smith와 같은 프로젝트에서 일하는 직원은 English, Smith, Wong (Smith를 빼면 둘)")

    # 카드 C2: Houston에 자리가 있는 부서의 직원
    houston = "SELECT Lname FROM EMPLOYEE WHERE Dno IN (SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston')"
    assert sorted(col(c, "SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston'")) == [1, 5]
    assert sorted(col(c, houston)) == ["Borg", "English", "Narayan", "Smith", "Wong"]
    print("[OK] 카드 C2: 부서 {1, 5} -> 5명")

    # 카드 C3: (a)의 안쪽 질의는 한 행이라 = 를 써도 된다
    assert col(c, "SELECT Dnumber FROM DEPARTMENT WHERE Dname = 'Research'") == [5]
    c3a = "SELECT Lname FROM EMPLOYEE WHERE Dno = (SELECT Dnumber FROM DEPARTMENT WHERE Dname = 'Research')"
    assert sorted(col(c, c3a)) == ["English", "Narayan", "Smith", "Wong"]
    print("[OK] 카드 C3: (a)의 안쪽 질의는 1행(5), (b)는 2행(1, 5)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
