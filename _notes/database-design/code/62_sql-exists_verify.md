---
layout: "note"
title: "62_sql-exists_verify.py"
display_title: "62_sql-exists_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "62"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-exists/"
parent_title: "EXISTS와 NOT EXISTS"
description: "데이터베이스 설계 · EXISTS와 NOT EXISTS 검증 코드"
permalink: "/studies/database-design/code/62_sql-exists_verify/"
---
{% raw %}
[EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""EXISTS와 NOT EXISTS 검증 (SQLite).

문서: 62.EXISTS와 NOT EXISTS (그리고 이산수학 03.술어와 한정기호의 과목별 관점)
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.15~18, 12주차 p.5
주장:
  1. 직원마다 안쪽 질의(그 직원의 부양가족)가 돌려주는 행 수는 3, 3, 0, 1, 0, 0, 0, 0이다.
  2. Q6(p.16): 부양가족이 없는 직원은 5명. EXISTS로 바꾸면 나머지 3명.
  3. Q16B(p.15): Q16과 같은 0행.
  4. 연습 1(p.17): 부양가족이 있는 관리자는 Wong, Wallace.
  5. 안쪽 질의가 바깥 행을 쓰지 않으면 EXISTS는 모든 행에 같은 답을 준다(8행 또는 0행).
  6. "부양가족이 모두 여성인 직원"을 NOT EXISTS로 쓰면 5명이 나오고, 다섯 모두 부양가족이 없다.
     부양가족이 있다는 조건을 더하면 0명이다.
  7. UNIQUE(부질의)(p.18)는 SQLite에서 구문 오류다. GROUP BY로 바꿔 쓴 판은 8명을 고른다.
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


def main():
    c = make()

    # 1. 직원마다 안쪽 질의의 행 수 (EMPLOYEE 표에 적힌 차례)
    counts = rows(c, """SELECT Lname, (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn)
                        FROM EMPLOYEE ORDER BY rowid""")
    assert counts == [("Smith", 3), ("Wong", 3), ("Zelaya", 0), ("Wallace", 1),
                      ("Narayan", 0), ("English", 0), ("Jabbar", 0), ("Borg", 0)]
    print("[OK] 직원마다 부양가족 수:", counts)

    # 2. Q6과 그 반대
    q6 = "SELECT Lname FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)"
    has = "SELECT Lname FROM EMPLOYEE WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)"
    none = sorted(col(c, q6))
    assert none == ["Borg", "English", "Jabbar", "Narayan", "Zelaya"]
    assert sorted(col(c, has)) == ["Smith", "Wallace", "Wong"]
    assert sorted(col(c, q6.replace("SELECT *", "SELECT Essn"))) == none        # SELECT 뒤는 결과와 무관하다
    assert sorted(col(c, "SELECT Lname FROM EMPLOYEE WHERE Ssn IN (SELECT Essn FROM DEPENDENT)")) == ["Smith", "Wallace", "Wong"]
    print("[OK] Q6: 5명. EXISTS와 IN 판은 Smith, Wallace, Wong")

    # 3. Q16B
    q16b = """SELECT E.Fname, E.Lname FROM EMPLOYEE AS E
              WHERE EXISTS (SELECT * FROM DEPENDENT AS D
                            WHERE E.Ssn = D.Essn AND E.Sex = D.Sex AND E.Fname = D.Dependent_name)"""
    assert rows(c, q16b) == []
    print("[OK] Q16B: 0행")

    # 4. 연습 1
    ex1 = """SELECT Lname FROM EMPLOYEE
             WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)
               AND EXISTS (SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn)"""
    assert sorted(col(c, ex1)) == ["Wallace", "Wong"]
    print("[OK] 연습 1: Wallace, Wong")

    # 5. 바깥 행을 쓰지 않는 안쪽 질의
    assert len(rows(c, "SELECT Lname FROM EMPLOYEE WHERE EXISTS (SELECT * FROM DEPENDENT)")) == 8
    assert len(rows(c, "SELECT Lname FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT)")) == 0
    print("[OK] 바깥 행을 쓰지 않으면 8행 또는 0행")

    # 6. 모두 ~이다 = ~가 아닌 것이 없다. 견줄 것이 없는 직원도 뽑힌다
    all_f = """SELECT E.Lname FROM EMPLOYEE AS E
               WHERE NOT EXISTS (SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn AND D.Sex <> 'F')"""
    assert sorted(col(c, all_f)) == none
    strict = all_f + " AND EXISTS (SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn)"
    assert rows(c, strict) == []
    male = sorted(col(c, "SELECT DISTINCT Essn FROM DEPENDENT WHERE Sex <> 'F'"))
    assert male == ["123456789", "333445555", "987654321"]          # 부양가족이 있는 세 명 모두 남성 부양가족이 있다
    print("[OK] 부양가족이 모두 여성: 5명(모두 부양가족 없음). 부양가족이 있어야 한다면 0명")

    # 7. UNIQUE(부질의)
    err = fails(c, "SELECT Fname, Lname FROM EMPLOYEE WHERE UNIQUE (SELECT * FROM DEPENDENT WHERE Ssn = Essn)")
    assert err and "syntax error" in err
    rewritten = """SELECT Lname FROM EMPLOYEE
                   WHERE NOT EXISTS (SELECT 1 FROM DEPENDENT WHERE Ssn = Essn
                                     GROUP BY Essn, Dependent_name, Sex, Bdate, Relationship
                                     HAVING COUNT(*) > 1)"""
    assert len(rows(c, rewritten)) == 8
    print("[OK] UNIQUE(부질의): SQLite 구문 오류. 바꿔 쓴 판은 8명")

    # 카드 C2: Houston에 있는 프로젝트를 맡지 않은 부서
    c2 = """SELECT D.Dname FROM DEPARTMENT AS D
            WHERE NOT EXISTS (SELECT * FROM PROJECT AS P WHERE P.Dnum = D.Dnumber AND P.Plocation = 'Houston')"""
    assert col(c, c2) == ["Administration"]
    assert sorted(rows(c, "SELECT Dnum, Pname FROM PROJECT WHERE Plocation = 'Houston'")) == [(1, "Reorganization"), (5, "ProductZ")]
    print("[OK] 카드 C2: Administration")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
