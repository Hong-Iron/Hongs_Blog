---
layout: "note"
title: "65_natural-join_verify.py"
display_title: "65_natural-join_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "65"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/natural-join/"
parent_title: "자연 조인 NATURAL JOIN"
description: "데이터베이스 설계 · 자연 조인 NATURAL JOIN 검증 코드"
permalink: "/studies/database-design/code/65_natural-join_verify/"
---
{% raw %}
[자연 조인 NATURAL JOIN](/Hongs_Blog/studies/database-design/natural-join/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""자연 조인 NATURAL JOIN 검증 (SQLite로 바꿔 쓴 판).

문서: 65.자연 조인 NATURAL JOIN
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.22~23, 12주차 p.7
SQLite는 열 목록이 붙은 별칭 DEPT (Dname, Dno, Mssn, Msdate)를 받지 않는다.
슬라이드의 꼴은 65_natural-join_verify.sql(PostgreSQL 16)에서 돌린다.
주장:
  1. 슬라이드의 문장은 SQLite에서 구문 오류다. 열 이름을 바꾼 부질의로 쓰면 Research 직원 4명이 나온다.
  2. 자연 조인한 표는 8행 13열이고 Dno가 한 번만 나온다 (JOIN ON은 14열).
  3. 이름을 맞추지 않고 EMPLOYEE NATURAL JOIN DEPARTMENT를 하면 같은 이름의 열이 없어 8 x 3 = 24행이 나온다.
  4. EMPLOYEE NATURAL JOIN DEPENDENT는 Sex와 Bdate가 겹쳐 그 두 열을 맞추려다 0행이 된다.
  5. DEPARTMENT NATURAL JOIN DEPT_LOCATIONS는 Dnumber로 이어져 5행 5열이다.
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

    # 1. 슬라이드의 문장과 바꿔 쓴 판
    slide = """SELECT Fname, Lname, Address
               FROM (EMPLOYEE NATURAL JOIN (DEPARTMENT AS DEPT (Dname, Dno, Mssn, Msdate)))
               WHERE Dname = 'Research'"""
    err = fails(c, slide)
    assert err and "syntax error" in err
    dept = "(SELECT Dname, Dnumber AS Dno, Mgr_ssn AS Mssn, Mgr_start_date AS Msdate FROM DEPARTMENT)"
    rewritten = "SELECT Fname, Lname, Address FROM EMPLOYEE NATURAL JOIN " + dept + " WHERE Dname = 'Research'"
    assert [r[1] for r in rows(c, rewritten)] == ["Smith", "Wong", "Narayan", "English"]
    print("[OK] 슬라이드 문장은 SQLite 구문 오류. 바꿔 쓴 판은 Smith, Wong, Narayan, English")

    # 2. 열이 한 번만 나온다
    star = "SELECT * FROM EMPLOYEE NATURAL JOIN " + dept
    names = cols(c, star)
    assert len(rows(c, star)) == 8 and len(names) == 13 and names.count("Dno") == 1 and "Dnumber" not in names
    assert len(cols(c, "SELECT * FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)")) == 14
    print("[OK] 자연 조인: 8행 13열", names)

    # 3. 같은 이름의 열이 없으면 모든 조합
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE NATURAL JOIN DEPARTMENT") == [(24,)]
    assert not set(cols(c, "SELECT * FROM EMPLOYEE")) & set(cols(c, "SELECT * FROM DEPARTMENT"))
    print("[OK] EMPLOYEE NATURAL JOIN DEPARTMENT: 겹치는 이름이 없어 24행")

    # 4. 뜻이 다른데 이름만 같은 열
    common = set(cols(c, "SELECT * FROM EMPLOYEE")) & set(cols(c, "SELECT * FROM DEPENDENT"))
    assert common == {"Sex", "Bdate"}
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE NATURAL JOIN DEPENDENT") == [(0,)]
    assert rows(c, "SELECT COUNT(*) FROM EMPLOYEE JOIN DEPENDENT ON Ssn = Essn") == [(7,)]
    print("[OK] EMPLOYEE NATURAL JOIN DEPENDENT: Sex, Bdate로 맞춰 0행 (Ssn = Essn으로 이으면 7행)")

    # 5. 이름이 처음부터 같은 경우
    dl = "SELECT * FROM DEPARTMENT NATURAL JOIN DEPT_LOCATIONS"
    assert len(rows(c, dl)) == 5 and len(cols(c, dl)) == 5 and cols(c, dl).count("Dnumber") == 1
    on = "SELECT D.Dname, L.Dlocation FROM DEPARTMENT AS D JOIN DEPT_LOCATIONS AS L ON D.Dnumber = L.Dnumber"
    assert sorted(rows(c, "SELECT Dname, Dlocation FROM DEPARTMENT NATURAL JOIN DEPT_LOCATIONS")) == sorted(rows(c, on))
    assert sorted(rows(c, on)) == [("Administration", "Stafford"), ("Headquarters", "Houston"), ("Research", "Bellaire"),
                                   ("Research", "Houston"), ("Research", "Sugarland")]
    print("[OK] DEPARTMENT NATURAL JOIN DEPT_LOCATIONS: 5행 5열")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
