---
layout: "note"
title: "62_nested-query-ladder_p4.py"
display_title: "62_nested-query-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "62"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/nested-query-ladder/"
parent_title: "중첩 질의 쓰기 예제 사다리"
description: "데이터베이스 설계 · 중첩 질의 쓰기 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/database-design/code/62_nested-query-ladder_p4/"
---
{% raw %}
[중첩 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/nested-query-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중첩 질의 쓰기 예제 사다리의 문제 1~4 확인. SQLite, COMPANY.

문서: 62.중첩 질의 쓰기 예제 사다리
출처: 문제 1은 11주차 슬라이드 11-2_SQL-DML-Complex p.11의 Q4A. 문제 2~4는 이 문서에서 만들었다.
확인하는 것:
  문제 1. 안쪽 질의 둘의 결과는 0행과 {1, 2}, 전체 답은 프로젝트 번호 1, 2.
  문제 2. 평균 급여는 35125, 그보다 많이 받는 직원은 Wong, Wallace, Narayan, Borg.
  문제 3. 부서장 셋 가운데 부양가족이 없는 사람은 Borg.
  문제 4. 자기 부서 평균보다 많이 받는 직원은 Wong, Wallace, Narayan. 별칭을 빼면 문제 2의 답(4명)이 나온다.
실행: python3 62_nested-query-ladder_p4.py
"""
import sqlite3

# COMPANY 스키마와 상태 (슬라이드 6-2 p.21 = 13 p.16, 28. Elmasri 그림 5.6)
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

    # 문제 1 (Q4A)
    as_manager = q(c, "SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE "
                      "WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith'")
    as_worker = q(c, "SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith'")
    assert as_manager == [] and sorted(as_worker) == [(1,), (2,)]
    q4a = q(c, """SELECT DISTINCT Pnumber FROM PROJECT
                  WHERE Pnumber IN (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
                                    WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith')
                     OR Pnumber IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith')""")
    assert sorted(q4a) == [(1,), (2,)]
    print("[OK] 문제 1 (Q4A): 부서장으로 0행, 직원으로 {1, 2} -> 답 {1, 2}")

    # 문제 2
    assert q(c, "SELECT AVG(Salary) FROM EMPLOYEE") == [(35125.0,)]
    p2 = q(c, "SELECT Lname, Salary FROM EMPLOYEE WHERE Salary > (SELECT AVG(Salary) FROM EMPLOYEE)")
    assert sorted(p2) == [("Borg", 55000), ("Narayan", 38000), ("Wallace", 43000), ("Wong", 40000)]
    print("[OK] 문제 2: 평균 35125보다 많이 받는 직원", sorted(p2))

    # 문제 3
    assert sorted(q(c, "SELECT Mgr_ssn FROM DEPARTMENT")) == [("333445555",), ("888665555",), ("987654321",)]
    p3 = q(c, """SELECT Lname FROM EMPLOYEE
                 WHERE Ssn IN (SELECT Mgr_ssn FROM DEPARTMENT)
                   AND NOT EXISTS (SELECT * FROM DEPENDENT WHERE Essn = Ssn)""")
    assert p3 == [("Borg",)]
    with_dep = q(c, """SELECT Lname FROM EMPLOYEE
                       WHERE Ssn IN (SELECT Mgr_ssn FROM DEPARTMENT)
                         AND EXISTS (SELECT * FROM DEPENDENT WHERE Essn = Ssn)""")
    assert sorted(with_dep) == [("Wallace",), ("Wong",)]
    print("[OK] 문제 3: 부양가족 없는 부서장", p3, "/ 있는 부서장", sorted(with_dep))

    # 문제 4
    assert q(c, "SELECT Dno, AVG(Salary) FROM EMPLOYEE GROUP BY Dno ORDER BY Dno") == [(1, 55000.0), (4, 31000.0), (5, 33250.0)]
    p4 = q(c, """SELECT E.Lname, E.Salary FROM EMPLOYEE AS E
                 WHERE E.Salary > (SELECT AVG(X.Salary) FROM EMPLOYEE AS X WHERE X.Dno = E.Dno)""")
    assert sorted(p4) == [("Narayan", 38000), ("Wallace", 43000), ("Wong", 40000)]
    # 흔한 오답: 별칭 없이 Dno = Dno. 안쪽의 Dno는 둘 다 안쪽 EMPLOYEE 것이라 늘 참 -> 회사 전체 평균과 견준다
    wrong = q(c, "SELECT Lname, Salary FROM EMPLOYEE WHERE Salary > (SELECT AVG(Salary) FROM EMPLOYEE WHERE Dno = Dno)")
    assert sorted(wrong) == sorted(p2) and len(wrong) == 4
    print("[OK] 문제 4: 자기 부서 평균보다 많이 받는 직원", sorted(p4), "/ 별칭을 빼면 4명(문제 2의 답)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
