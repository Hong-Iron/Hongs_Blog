---
layout: "note"
title: "66_join-query-ladder_p4.py"
display_title: "66_join-query-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "66"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/join-query-ladder/"
parent_title: "조인 질의 쓰기 예제 사다리"
description: "데이터베이스 설계 · 조인 질의 쓰기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/66_join-query-ladder_p4/"
---
{% raw %}
[조인 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/join-query-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""조인 질의 쓰기 예제 사다리의 문제 1~4와 변형 확인. SQLite, COMPANY.

문서: 66.조인 질의 쓰기 예제 사다리
출처: 문제 1은 Research 부서 직원을 JOIN ... ON으로 찾는 질의다. 문제 2~4와 변형은 이 문서에서 만들었다.
확인하는 것:
  문제 1. Research 부서 직원 4명(Smith, Wong, Narayan, English). WHERE에 조인 조건을 쓴 판과 답이 같다.
  문제 2. 프로젝트 6개와 맡은 부서의 부서장: Wong 3개, Wallace 2개, Borg 1개.
  문제 3. 직원과 부양가족을 LEFT OUTER JOIN으로 이으면 12행(짝 있는 7행 + 부양가족 없는 직원 5명).
          내부 조인이면 7행이다.
  문제 4. 부양가족이 없는 직원 5명. NOT EXISTS로 쓴 Q6과 답이 같다.
  변형.   LEFT OUTER JOIN에서 오른쪽 표의 조건을 ON에 두면 3행(Administration은 NULL), WHERE에 두면 2행.
실행: python3 66_join-query-ladder_p4.py
"""
import sqlite3

# COMPANY 스키마와 상태 (Elmasri 그림 5.6)
# WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다. 서로 가리키는 외래 키는 커밋 때 검사한다.
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
  Relationship VARCHAR(8), PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
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
    """COMPANY를 메모리에 새로 만든다."""
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


def q(c, sql, args=()):
    return c.execute(sql, args).fetchall()


def fails(c, sql, part):
    """sql이 오류를 내고 오류 글에 part가 들어 있는지 본다."""
    try:
        c.executescript(sql) if ";" in sql.strip().rstrip(";") else c.execute(sql)
    except sqlite3.Error as e:
        assert part in str(e), (sql, str(e))
        return str(e)
    raise AssertionError("오류가 나야 하는데 실행됐다: " + sql)


def main():
    c = make()

    # 문제 1
    p1 = q(c, "SELECT Fname, Lname, Address FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber) WHERE Dname = 'Research'")
    old = q(c, "SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno")
    assert sorted(p1) == sorted(old) and sorted(r[1] for r in p1) == ["English", "Narayan", "Smith", "Wong"]
    assert ("John", "Smith", "731 Fondren, Houston, TX") in p1
    print("[OK] 문제 1: Research 직원 4명, WHERE 판과 같다")

    # 문제 2
    p2 = q(c, "SELECT Pname, Lname FROM (PROJECT JOIN DEPARTMENT ON Dnum = Dnumber) JOIN EMPLOYEE ON Mgr_ssn = Ssn")
    assert sorted(p2) == sorted([("ProductX", "Wong"), ("ProductY", "Wong"), ("ProductZ", "Wong"),
                                 ("Computerization", "Wallace"), ("Newbenefits", "Wallace"), ("Reorganization", "Borg")])
    print("[OK] 문제 2: 6행", sorted(p2))

    # 문제 3
    p3 = q(c, "SELECT Lname, Dependent_name FROM EMPLOYEE LEFT OUTER JOIN DEPENDENT ON Ssn = Essn")
    assert len(p3) == 12 and sum(1 for r in p3 if r[1] is None) == 5
    assert sorted(r[0] for r in p3 if r[1] is None) == ["Borg", "English", "Jabbar", "Narayan", "Zelaya"]
    assert sorted(r for r in p3 if r[1] is not None) == sorted([
        ("Wong", "Alice"), ("Wong", "Theodore"), ("Wong", "Joy"), ("Wallace", "Abner"),
        ("Smith", "Michael"), ("Smith", "Alice"), ("Smith", "Elizabeth")])
    inner = q(c, "SELECT Lname, Dependent_name FROM EMPLOYEE JOIN DEPENDENT ON Ssn = Essn")
    assert len(inner) == 7
    print("[OK] 문제 3: LEFT OUTER JOIN 12행(NULL 5행), 내부 조인 7행")

    # 문제 4
    p4 = q(c, "SELECT Lname FROM EMPLOYEE LEFT OUTER JOIN DEPENDENT ON Ssn = Essn WHERE Essn IS NULL")
    q6 = q(c, "SELECT Lname FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)")
    assert sorted(p4) == sorted(q6) == [("Borg",), ("English",), ("Jabbar",), ("Narayan",), ("Zelaya",)]
    print("[OK] 문제 4: 부양가족 없는 직원 5명, NOT EXISTS 판(Q6)과 같다")

    # 변형
    on = q(c, "SELECT Dname, Pname FROM DEPARTMENT LEFT OUTER JOIN PROJECT ON Dnum = Dnumber AND Plocation = 'Houston'")
    where = q(c, "SELECT Dname, Pname FROM DEPARTMENT LEFT OUTER JOIN PROJECT ON Dnum = Dnumber WHERE Plocation = 'Houston'")
    assert sorted(on, key=str) == sorted([("Research", "ProductZ"), ("Headquarters", "Reorganization"),
                                          ("Administration", None)], key=str)
    assert sorted(where) == [("Headquarters", "Reorganization"), ("Research", "ProductZ")]
    print("[OK] 변형: 조건을 ON에 두면 3행(Administration, NULL 포함), WHERE에 두면 2행")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
