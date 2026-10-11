---
layout: "note"
title: "76_view-implementation_verify.py"
display_title: "76_view-implementation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "76"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-implementation/"
parent_title: "질의 수정과 뷰 실체화"
description: "데이터베이스 설계 · 질의 수정과 뷰 실체화 검증 코드"
permalink: "/studies/database-design/code/76_view-implementation_verify/"
---
{% raw %}
[질의 수정과 뷰 실체화](/Hongs_Blog/studies/database-design/view-implementation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""질의 수정과 뷰 실체화 검증 (SQLite). PostgreSQL의 실체화된 뷰는 76_view-implementation_verify.sql.

문서: 76.질의 수정과 뷰 실체화
출처: 13주차 슬라이드 13-View p.8~13
주장:
  1. 질의 수정(p.10): 뷰에 던진 질의와, 뷰 정의를 풀어 기본 테이블에 던진 질의는 답이 같다.
     SQLite의 실행 계획도 두 질의가 글자까지 같다(뷰 이름이 계획에 안 나온다).
  2. 뷰 실체화(p.11): 뷰의 답을 표로 떠 두면 저장 자리를 차지하고, 같은 질의에 같은 답을 낸다.
     떠 둔 뒤 기본 테이블이 바뀌면 그 표는 옛 답을 낸다. 다시 맞춰야 한다.
  3. 점진적 갱신(p.12): 바뀐 행 하나에서 고칠 곳만 고친 결과가 처음부터 다시 계산한 결과와 같다.
     무작위 삽입·삭제·수정 300번 동안 한 번도 어긋나지 않는다.
  4. 세 갱신 시점(p.13): 같은 사건 열에서 즉시 갱신은 고치기 8번·낡은 답 0번, 지연 갱신은 3번·0번,
     주기 갱신(여섯 사건마다)은 2번·낡은 답 2번이다.
실행: python3 76_view-implementation_verify.py
"""
import random
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


VIEWS = """
CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON
  WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal) AS SELECT Dname, COUNT (*), SUM (Salary)
  FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;
"""
ON_VIEW = "SELECT Fname, Lname FROM WORKS_ON1 WHERE Pname = 'ProductX'"
ON_BASE = ("SELECT Fname, Lname FROM EMPLOYEE, PROJECT, WORKS_ON "
           "WHERE Ssn = Essn AND Pno = Pnumber AND Pname = 'ProductX'")

# 즉시 갱신: EMPLOYEE가 바뀌는 순간 DEPT_INFO_M에서 바뀐 부서의 한 줄만 고친다 (부서를 옮기는 수정은 다루지 않는다)
IMMEDIATE = """
CREATE TABLE DEPT_INFO_M AS SELECT * FROM DEPT_INFO;
CREATE TRIGGER DI_INS AFTER INSERT ON EMPLOYEE FOR EACH ROW BEGIN
  INSERT INTO DEPT_INFO_M SELECT Dname, 0, 0 FROM DEPARTMENT
    WHERE Dnumber = NEW.Dno AND Dname NOT IN (SELECT Dept_name FROM DEPT_INFO_M);
  UPDATE DEPT_INFO_M SET No_of_emps = No_of_emps + 1, Total_sal = Total_sal + NEW.Salary
    WHERE Dept_name = (SELECT Dname FROM DEPARTMENT WHERE Dnumber = NEW.Dno);
END;
CREATE TRIGGER DI_DEL AFTER DELETE ON EMPLOYEE FOR EACH ROW BEGIN
  UPDATE DEPT_INFO_M SET No_of_emps = No_of_emps - 1, Total_sal = Total_sal - OLD.Salary
    WHERE Dept_name = (SELECT Dname FROM DEPARTMENT WHERE Dnumber = OLD.Dno);
  DELETE FROM DEPT_INFO_M WHERE No_of_emps = 0;
END;
CREATE TRIGGER DI_UPD AFTER UPDATE OF Salary ON EMPLOYEE FOR EACH ROW BEGIN
  UPDATE DEPT_INFO_M SET Total_sal = Total_sal - OLD.Salary + NEW.Salary
    WHERE Dept_name = (SELECT Dname FROM DEPARTMENT WHERE Dnumber = NEW.Dno);
END;
"""


def plan(c, sql):
    return [r[3] for r in c.execute("EXPLAIN QUERY PLAN " + sql)]


def strategies(events="UUUQUUQQUQUU", period=6):
    """사건 열 하나를 세 방식으로 돌려 (고친 횟수, 낡은 답을 낸 횟수)를 센다. U = 급여 인상, Q = 뷰 질의.
    주기 갱신은 period번째 사건이 끝날 때마다 고친다."""
    out = {}
    for how in ("immediate", "lazy", "periodic"):
        c = make()
        c.executescript(VIEWS + "CREATE TABLE DEPT_INFO_M AS SELECT * FROM DEPT_INFO;")
        refresh = stale = 0
        dirty = False

        def redo():
            c.executescript("DELETE FROM DEPT_INFO_M; INSERT INTO DEPT_INFO_M SELECT * FROM DEPT_INFO;")

        for tick, ev in enumerate(events, 1):
            if ev == "U":
                c.execute("UPDATE EMPLOYEE SET Salary = Salary + 1000 WHERE Lname = 'Smith'")
                dirty = True
                if how == "immediate":
                    redo(); refresh += 1; dirty = False
            else:
                if how == "lazy" and dirty:
                    redo(); refresh += 1; dirty = False
                got = q(c, "SELECT Total_sal FROM DEPT_INFO_M WHERE Dept_name = 'Research'")
                true = q(c, "SELECT Total_sal FROM DEPT_INFO WHERE Dept_name = 'Research'")
                stale += got != true
            if how == "periodic" and tick % period == 0 and dirty:
                redo(); refresh += 1; dirty = False
        out[how] = (refresh, stale)
    return events, out


def main():
    c = make()
    c.executescript(VIEWS)

    # 1. 질의 수정
    assert sorted(q(c, ON_VIEW)) == sorted(q(c, ON_BASE)) == [("John", "Smith"), ("Joyce", "English")]
    assert plan(c, ON_VIEW) == plan(c, ON_BASE)
    assert not any("WORKS_ON1" in line for line in plan(c, ON_VIEW))
    print("[OK] p.10: 뷰 질의와 풀어 쓴 질의의 답이 같고, SQLite 실행 계획도 같다:", plan(c, ON_VIEW))

    fails(c, "CREATE MATERIALIZED VIEW WORKS_ON1_MV AS SELECT * FROM WORKS_ON1", "syntax error")   # SQLite에는 이 문장이 없다

    # 2. 실체화: 표로 떠 둔다
    c.execute("CREATE TABLE WORKS_ON1_M AS SELECT * FROM WORKS_ON1")
    root = dict(q(c, "SELECT name, rootpage FROM sqlite_master WHERE name IN ('WORKS_ON1', 'WORKS_ON1_M')"))
    assert root["WORKS_ON1"] == 0 and root["WORKS_ON1_M"] > 0
    assert sorted(q(c, "SELECT Fname, Lname FROM WORKS_ON1_M WHERE Pname = 'ProductX'")) == sorted(q(c, ON_VIEW))
    assert plan(c, "SELECT Fname, Lname FROM WORKS_ON1_M WHERE Pname = 'ProductX'") == ["SCAN WORKS_ON1_M"]
    print("[OK] p.11: 떠 둔 표는 저장 자리를 차지하고(16행), 같은 질의를 조인 없이 표 하나만 훑어 답한다")

    c.execute("INSERT INTO WORKS_ON VALUES ('666884444', 1, 3.0)")          # Narayan이 ProductX에 3시간
    fresh = sorted(q(c, ON_VIEW))
    old = sorted(q(c, "SELECT Fname, Lname FROM WORKS_ON1_M WHERE Pname = 'ProductX'"))
    assert fresh == [("John", "Smith"), ("Joyce", "English"), ("Ramesh", "Narayan")] and len(old) == 2
    print("[OK] p.11: 기본 테이블에 한 행을 넣으면 뷰는 3명, 떠 둔 표는 여전히 2명(낡은 답)")

    # 3. 점진적 갱신: 새 WORKS_ON 행 하나에서 생기는 뷰 행만 더한다
    c.execute("INSERT INTO WORKS_ON1_M SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON "
              "WHERE Ssn = Essn AND Pno = Pnumber AND Essn = '666884444' AND Pno = 1")
    assert sorted(q(c, "SELECT * FROM WORKS_ON1_M"), key=str) == sorted(q(c, "SELECT * FROM WORKS_ON1"), key=str)
    assert q(c, "SELECT COUNT(*) FROM WORKS_ON1_M") == [(17,)]
    print("[OK] p.12: 바뀐 행에서 생기는 뷰 행 1개만 더해도 처음부터 다시 만든 것(17행)과 같다")

    # 집계 뷰의 점진적 갱신 + 즉시 갱신(트리거)
    t = make()
    t.executescript(VIEWS + IMMEDIATE)
    same = lambda: sorted(q(t, "SELECT * FROM DEPT_INFO_M")) == sorted(q(t, "SELECT * FROM DEPT_INFO"))
    assert same()
    t.execute("INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main','F',27000,'333445555',5)")
    assert q(t, "SELECT * FROM DEPT_INFO_M WHERE Dept_name = 'Research'") == [("Research", 5, 160000)] and same()
    rnd = random.Random(7)
    extra, n = ["111223333"], 0
    for _ in range(300):
        op = rnd.choice("IIDU")
        if op == "I":
            n += 1
            ssn = f"7{n:08d}"
            t.execute("INSERT INTO EMPLOYEE VALUES ('F','M','L',?, NULL, NULL, 'F', ?, NULL, ?)",
                      (ssn, rnd.randrange(20, 60) * 1000, rnd.choice([1, 4, 5])))
            extra.append(ssn)
        elif op == "D" and extra:
            t.execute("DELETE FROM EMPLOYEE WHERE Ssn = ?", (extra.pop(rnd.randrange(len(extra))),))
        elif op == "U":
            t.execute("UPDATE EMPLOYEE SET Salary = ? WHERE Ssn = ?",
                      (rnd.randrange(20, 60) * 1000, rnd.choice(extra + [e[3] for e in EMP])))
        assert same(), "점진적 갱신이 다시 계산한 값과 어긋났다"
    print("[OK] p.12~13: 트리거로 바뀐 부서의 한 줄만 고친 표가 무작위 변경 300번 내내 뷰와 같다 (즉시 갱신)")

    # 부서의 마지막 직원이 나가면 그 줄이 사라져야 한다 (경계 사례)
    b = make()
    b.executescript(VIEWS + IMMEDIATE)
    b.execute("PRAGMA foreign_keys=OFF")
    b.execute("DELETE FROM EMPLOYEE WHERE Dno = 1")
    assert sorted(q(b, "SELECT * FROM DEPT_INFO_M")) == sorted(q(b, "SELECT * FROM DEPT_INFO")) and \
        len(q(b, "SELECT * FROM DEPT_INFO_M")) == 2
    print("[OK] 경계: 부서의 마지막 직원을 지우면 떠 둔 표에서도 그 부서 줄이 없어진다")

    # 4. 세 갱신 시점
    events, out = strategies()
    assert events.count("U") == 8 and events.count("Q") == 4
    assert out == {"immediate": (8, 0), "lazy": (3, 0), "periodic": (2, 2)}, out
    print("[OK] p.13: 사건 열", events, "-> (고친 횟수, 낡은 답)", out)
    ev2, out2 = strategies("UQUUQQU", 4)
    assert out2 == {"immediate": (4, 0), "lazy": (2, 0), "periodic": (1, 1)}, out2
    print("[OK] 카드 C2: 사건 열", ev2, "(주기 4) ->", out2)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
