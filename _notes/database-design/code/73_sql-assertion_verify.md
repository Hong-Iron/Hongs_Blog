---
layout: "note"
title: "73_sql-assertion_verify.py"
display_title: "73_sql-assertion_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "73"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-assertion/"
parent_title: "주장 CREATE ASSERTION"
description: "데이터베이스 설계 · 주장 CREATE ASSERTION 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/73_sql-assertion_verify/"
---
{% raw %}
[주장 CREATE ASSERTION](/Hongs_Blog/studies/database-design/sql-assertion/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""주장(CREATE ASSERTION) 검증. SQLite로 점검 질의를 돌린다.

문서: 73.주장 CREATE ASSERTION
출처: 11주차 슬라이드 11_SQL-DDL-Complex p.5~8
CREATE ASSERTION은 SQLite에 없다(구문 오류). 그래서 주장 안의 "위반하는 튜플을 고르는 질의"를
그대로 돌려, 결과가 0행이면 주장이 지켜진 상태, 1행 이상이면 깨진 상태로 본다.
주장:
  1. 슬라이드의 COMPANY 상태에서 SALARY_CONSTRAINT의 점검 질의는 0행이다.
  2. 기본 키·외래 키·NOT NULL을 하나도 어기지 않는 새 직원(5번 부서, 급여 45000)이 들어가면 1행이 된다.
  3. 같은 규칙이 직원 급여 인상, 부서장 급여 인하, 직원의 부서 이동, 부서장 교체로도 깨진다.
  4. CHECK 안에는 부질의를 못 쓴다(한 행만 보는 CHECK로는 이 규칙을 못 적는다).
  5. 카드 C3의 주장(프로젝트 시간 합 40 이하)도 같은 방법으로 0행 → 1행.
실행: python3 73_sql-assertion_verify.py
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


# 슬라이드 p.7~8의 주장에서 NOT EXISTS 안에 든 질의. 부서장보다 많이 받는 직원을 고른다.
VIOLATORS = """
SELECT E.Lname, E.Salary, M.Lname, M.Salary, D.Dname
FROM EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
WHERE E.Salary > M.Salary AND E.Dno = D.Dnumber AND D.Mgr_ssn = M.Ssn
"""
HOLDS = "SELECT NOT EXISTS (" + VIOLATORS + ")"


def main():
    c = make()
    assert q(c, VIOLATORS) == [] and q(c, HOLDS) == [(1,)]
    print("[OK] p.6~8: 슬라이드 상태에서 점검 질의 0행, NOT EXISTS는 참")

    # 2. 처음부터 있던 제약은 하나도 안 어기지만 규칙은 깨는 새 직원
    c.execute("INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',"
              "45000,'333445555',5)")
    c.commit()                                    # 외래 키(커밋 때 검사)도 통과
    assert q(c, VIOLATORS) == [("Lee", 45000, "Wong", 40000, "Research")]
    assert q(c, HOLDS) == [(0,)]
    print("[OK] p.6: 급여 45000인 5번 부서 새 직원은 들어가고, 점검 질의가 1행(Lee > Wong)이 된다")

    # 3. 규칙을 깨는 다른 길 네 가지 (매번 새 상태에서)
    cases = [
        ("직원 급여 인상", "UPDATE EMPLOYEE SET Salary = 41000 WHERE Lname = 'Narayan'", ["Narayan"]),
        ("부서장 급여 인하", "UPDATE EMPLOYEE SET Salary = 35000 WHERE Lname = 'Wong'", ["Narayan"]),
        ("직원의 부서 이동", "UPDATE EMPLOYEE SET Dno = 5 WHERE Lname = 'Wallace'", ["Wallace"]),
        ("부서장 교체", "UPDATE DEPARTMENT SET Mgr_ssn = '453453453' WHERE Dnumber = 5", ["Narayan", "Smith", "Wong"]),
    ]
    for name, sql, who in cases:
        c = make()
        c.execute(sql)
        c.commit()
        assert sorted(r[0] for r in q(c, VIOLATORS)) == who, (name, q(c, VIOLATORS))
        print(f"[OK] {name}: 위반 {len(who)}행 {who}")

    # 4. 제품이 받는가
    c = make()
    fails(c, "CREATE ASSERTION SALARY_CONSTRAINT CHECK (NOT EXISTS (" + VIOLATORS + "))", "syntax error")
    fails(c, "CREATE TABLE T (A INT, CHECK (A <= (SELECT MAX(Salary) FROM EMPLOYEE)))", "subqueries prohibited")
    print("[OK] SQLite: CREATE ASSERTION은 구문 오류, CHECK 안의 부질의는 금지")

    # 5. 카드 C3: 한 직원의 프로젝트 시간 합은 40을 넘지 못한다
    hours = "SELECT Essn, SUM(Hours) FROM WORKS_ON GROUP BY Essn HAVING SUM(Hours) > 40"
    assert q(c, hours) == []
    sums = dict(q(c, "SELECT Essn, SUM(Hours) FROM WORKS_ON GROUP BY Essn"))
    assert sums["123456789"] == 40.0 and sums["987654321"] == 35.0 and sums["888665555"] is None
    at40 = q(c, "SELECT Lname FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn GROUP BY Essn, Lname HAVING SUM(Hours) >= 40 ORDER BY Lname")
    assert [r[0] for r in at40] == ["English", "Jabbar", "Narayan", "Smith", "Wong", "Zelaya"]      # 딱 40.0인 여섯 명
    c.execute("INSERT INTO WORKS_ON VALUES ('123456789', 3, 5.0)")
    assert q(c, hours) == [("123456789", 45.0)]
    print("[OK] 카드 C3: 시간 합 점검 질의 0행 -> Smith에게 5시간을 더하면 1행 (45.0)")

    # 카드 C2: 빈 EMPLOYEE에서도 주장은 참이다 (위반하는 조합이 없으니까)
    e = sqlite3.connect(":memory:")
    e.executescript(DDL)
    assert q(e, HOLDS) == [(1,)]
    print("[OK] 카드 C2: 직원이 한 명도 없어도 NOT EXISTS는 참")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
