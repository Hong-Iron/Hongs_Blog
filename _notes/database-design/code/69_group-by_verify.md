---
layout: "note"
title: "69_group-by_verify.py"
display_title: "69_group-by_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "69"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/group-by/"
parent_title: "GROUP BY"
description: "데이터베이스 설계 · GROUP BY 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/69_group-by_verify/"
---
{% raw %}
[GROUP BY](/Hongs_Blog/studies/database-design/group-by/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""GROUP BY 검증 (SQLite).

문서: 69.GROUP BY (그리고 이산수학 10.동치관계와 분할의 과목별 관점)
출처: 데이터베이스 설계 11주차 슬라이드 11-2 p.31~32, 12주차 p.11
주장:
  1. Q24(p.31): (5, 4, 33250), (4, 3, 31000), (1, 1, 55000). 묶음의 구성원이 그림과 같다.
  2. Dno로 나눈 묶음은 겹치지 않고 합치면 전체다(분할).
     "급여 차이가 3000 이하"로는 묶음이 겹친다(38000-40000-43000).
  3. Q25(p.32): PROJECT와 WORKS_ON을 이은 16행을 프로젝트로 묶으면 2, 3, 2, 3, 3, 3.
  4. 프로젝트 20: COUNT(*) 3, COUNT(Hours) 2.
  5. 열 둘로 묶기: (Dno, Sex)는 다섯 묶음. Sex만으로는 (F, 3, 31000), (M, 5, 37600).
  6. SQLite는 묶지 않은 열을 SELECT에 써도 받아서, 묶음 안의 아무 한 행 값을 내놓는다.
     PostgreSQL은 거부한다(.sql 파일).
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

    # 1. Q24
    q24 = "SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno"
    assert sorted(rows(c, q24), reverse=True) == [(5, 4, 33250.0), (4, 3, 31000.0), (1, 1, 55000.0)]
    members = {}
    for lname, dno, sal in rows(c, "SELECT Lname, Dno, Salary FROM EMPLOYEE"):
        members.setdefault(dno, []).append((lname, sal))
    assert members == {5: [("Smith", 30000), ("Wong", 40000), ("Narayan", 38000), ("English", 25000)],
                       4: [("Zelaya", 25000), ("Wallace", 43000), ("Jabbar", 25000)],
                       1: [("Borg", 55000)]}
    for dno, n, avg in rows(c, q24):
        assert n == len(members[dno]) and avg == sum(s for _, s in members[dno]) / n
    print("[OK] Q24: (5, 4, 33250), (4, 3, 31000), (1, 1, 55000)")

    # 2. 분할
    groups = [set(l for l, _ in m) for m in members.values()]
    everyone = set(col(c, "SELECT Lname FROM EMPLOYEE"))
    assert set().union(*groups) == everyone and sum(len(g) for g in groups) == len(everyone) == 8
    sal = dict(rows(c, "SELECT Lname, Salary FROM EMPLOYEE"))
    near = lambda a, b: abs(sal[a] - sal[b]) <= 3000
    assert near("Narayan", "Wong") and near("Wong", "Wallace") and not near("Narayan", "Wallace")
    print("[OK] Dno 묶음은 겹치지 않고 8명을 다 덮는다. '차이 3000 이하'는 Narayan-Wong-Wallace에서 겹친다")

    # 3. Q25
    assert rows(c, "SELECT COUNT(*) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno") == [(16,)]
    q25 = "SELECT Pnumber, Pname, COUNT(*) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno GROUP BY Pnumber, Pname"
    assert sorted(rows(c, q25)) == [(1, "ProductX", 2), (2, "ProductY", 3), (3, "ProductZ", 2),
                                    (10, "Computerization", 3), (20, "Reorganization", 3), (30, "Newbenefits", 3)]
    print("[OK] Q25: 2, 3, 2, 3, 3, 3")

    # 4. COUNT(*)와 COUNT(열)
    assert rows(c, "SELECT COUNT(*), COUNT(Hours) FROM WORKS_ON WHERE Pno = 20") == [(3, 2)]
    per = dict((p, (n, k)) for p, n, k in rows(c, "SELECT Pno, COUNT(*), COUNT(Hours) FROM WORKS_ON GROUP BY Pno"))
    assert per[20] == (3, 2) and all(n == k for p, (n, k) in per.items() if p != 20)
    print("[OK] 프로젝트 20: COUNT(*) 3, COUNT(Hours) 2")

    # 5. 다른 열로 묶기
    by_sex = "SELECT Sex, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Sex ORDER BY Sex"
    assert rows(c, by_sex) == [("F", 3, 31000.0), ("M", 5, 37600.0)]
    two = "SELECT Dno, Sex, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno, Sex ORDER BY Dno, Sex"
    assert rows(c, two) == [(1, "M", 1, 55000.0), (4, "F", 2, 34000.0), (4, "M", 1, 25000.0),
                            (5, "F", 1, 25000.0), (5, "M", 3, 36000.0)]
    print("[OK] Sex로 2묶음, (Dno, Sex)로 5묶음")

    # 6. 묶지 않은 열을 SELECT에 쓰면
    slide = "SELECT Dname, COUNT(*) FROM EMPLOYEE AS E, DEPARTMENT AS D WHERE E.Dno = D.Dnumber GROUP BY E.Dno HAVING AVG(E.Salary) > 30000"
    assert sorted(rows(c, slide)) == [("Administration", 3), ("Headquarters", 1), ("Research", 4)]
    fixed = slide.replace("GROUP BY E.Dno", "GROUP BY E.Dno, D.Dname")
    assert sorted(rows(c, fixed)) == sorted(rows(c, slide))
    bare = rows(c, "SELECT Dno, Lname, COUNT(*) FROM EMPLOYEE GROUP BY Dno")
    assert len(bare) == 3 and all(l in [m for m, _ in members[d]] and n == len(members[d]) for d, l, n in bare)
    print("[OK] SQLite는 받는다. 묶음마다 아무 한 사람의 Lname:", sorted(bare))

    # NULL도 한 묶음
    assert dict(rows(c, "SELECT Super_ssn, COUNT(*) FROM EMPLOYEE GROUP BY Super_ssn"))[None] == 1
    print("[OK] Super_ssn이 NULL인 행은 한 묶음(1행)")

    # 카드 C2: 관리하는 부서(Dnum)로 프로젝트 묶기
    assert sorted(rows(c, "SELECT Dnum, COUNT(*) FROM PROJECT GROUP BY Dnum")) == [(1, 1), (4, 2), (5, 3)]
    print("[OK] 카드 C2: (5, 3), (4, 2), (1, 1)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
