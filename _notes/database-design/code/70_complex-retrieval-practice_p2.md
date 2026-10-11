---
layout: "note"
title: "70_complex-retrieval-practice_p2.py"
display_title: "70_complex-retrieval-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/complex-retrieval-practice/"
parent_title: "복잡한 검색 연습"
description: "데이터베이스 설계 · 복잡한 검색 연습 문제 2 풀이 코드"
permalink: "/studies/database-design/code/70_complex-retrieval-practice_p2/"
---
{% raw %}
[복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""복잡한 검색 연습 p2: 연습 2-1, 2-2 (SQLite, UNIVERSITY).

문서: 70.복잡한 검색 연습의 문제 p2 (그리고 이산수학 03.술어와 한정기호의 과목별 관점 카드)
출처: 데이터베이스 설계 12주차 슬라이드 p.16~17, 풀이 p.3~6
확인:
  Q2-1. 풀이에 적힌 NOT EXIST는 구문 오류다. NOT EXISTS로 고치면 0행, 조인과 묶기로 쓴 판도 0행.
  Q2-2. 두 판 모두 (Smith, CS).
  성적이 하나도 없는 학생 Kim을 넣으면 NOT EXISTS 판은 Kim을 뽑고, 조인과 묶기 판은 뽑지 않는다.
  성적이 있어야 한다는 조건(EXISTS)을 더하면 두 판이 다시 같아진다.
"""
import sqlite3


def rows(c, sql):
    return c.execute(sql).fetchall()


def fails(c, sql):
    try:
        c.execute(sql).fetchall()
    except sqlite3.Error as e:
        return str(e)
    return None


# UNIVERSITY 스키마와 상태 (Elmasri 그림 1.2, 슬라이드 12 p.16~17).
UNIV_DDL = """
CREATE TABLE STUDENT (Name VARCHAR(20) NOT NULL, Student_number INT NOT NULL, Class INT, Major VARCHAR(4),
  PRIMARY KEY (Student_number));
CREATE TABLE COURSE (Course_name VARCHAR(30), Course_number VARCHAR(8) NOT NULL, Credit_hours INT, Department VARCHAR(4),
  PRIMARY KEY (Course_number));
CREATE TABLE SECTION (Section_identifier INT NOT NULL, Course_number VARCHAR(8), Semester VARCHAR(6), Year CHAR(2),
  Instructor VARCHAR(10), PRIMARY KEY (Section_identifier),
  FOREIGN KEY (Course_number) REFERENCES COURSE(Course_number));
CREATE TABLE GRADE_REPORT (Student_number INT NOT NULL, Section_identifier INT NOT NULL, Grade CHAR,
  PRIMARY KEY (Student_number, Section_identifier),
  FOREIGN KEY (Student_number) REFERENCES STUDENT(Student_number),
  FOREIGN KEY (Section_identifier) REFERENCES SECTION(Section_identifier));
CREATE TABLE PREREQUISITE (Course_number VARCHAR(8) NOT NULL, Prerequisite_number VARCHAR(8) NOT NULL,
  PRIMARY KEY (Course_number, Prerequisite_number));
"""
STUDENT = [("Smith", 17, 1, "CS"), ("Brown", 8, 2, "CS")]
COURSE = [("Intro to Computer Science", "CS1310", 4, "CS"), ("Data Structures", "CS3320", 4, "CS"),
          ("Discrete Mathematics", "MATH2410", 3, "MATH"), ("Database", "CS3380", 3, "CS")]
SECTION = [(85, "MATH2410", "Fall", "07", "King"), (92, "CS1310", "Fall", "07", "Anderson"),
           (102, "CS3320", "Spring", "08", "Knuth"), (112, "MATH2410", "Fall", "08", "Chang"),
           (119, "CS1310", "Fall", "08", "Anderson"), (135, "CS3380", "Fall", "08", "Stone")]
GRADE = [(17, 112, "B"), (17, 119, "C"), (8, 85, "A"), (8, 92, "A"), (8, 102, "B"), (8, 135, "A")]
PREREQ = [("CS3380", "CS3320"), ("CS3380", "MATH2410"), ("CS3320", "CS1310")]


def make_univ():
    """UNIVERSITY 데이터베이스를 메모리에 새로 만든다."""
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(UNIV_DDL)
    c.executemany("INSERT INTO STUDENT VALUES (?,?,?,?)", STUDENT)
    c.executemany("INSERT INTO COURSE VALUES (?,?,?,?)", COURSE)
    c.executemany("INSERT INTO SECTION VALUES (?,?,?,?,?)", SECTION)
    c.executemany("INSERT INTO GRADE_REPORT VALUES (?,?,?)", GRADE)
    c.executemany("INSERT INTO PREREQUISITE VALUES (?,?)", PREREQ)
    c.commit()
    return c


NE = """SELECT Name, Major FROM STUDENT AS S
WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                  WHERE G.Student_number = S.Student_number AND G.Grade OP 'A')"""
JG = """SELECT Name, Major
FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
GROUP BY S.Student_number, S.Name
HAVING SUM(CASE WHEN G.Grade OP 'A' THEN 1 ELSE 0 END) = 0"""


def main():
    c = make_univ()

    # 풀이에 적힌 그대로: NOT EXIST
    err = fails(c, NE.replace("NOT EXISTS", "NOT EXIST").replace("OP", "<>"))
    assert err and "syntax error" in err
    print("[OK] NOT EXIST:", err)

    # Q2-1: 성적이 모두 A인 학생
    assert rows(c, NE.replace("OP", "<>")) == [] and rows(c, JG.replace("OP", "<>")) == []
    per = rows(c, """SELECT S.Name, COUNT(*), SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END),
                            SUM(CASE WHEN G.Grade = 'A' THEN 1 ELSE 0 END)
                     FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
                     GROUP BY S.Student_number, S.Name ORDER BY S.Name""")
    assert per == [("Brown", 4, 1, 3), ("Smith", 2, 2, 0)]
    print("[OK] Q2-1: 두 판 모두 0행. Brown은 A가 아닌 성적 1개, Smith는 2개")

    # Q2-2: A가 하나도 없는 학생
    assert rows(c, NE.replace("OP", "=")) == [("Smith", "CS")] and rows(c, JG.replace("OP", "=")) == [("Smith", "CS")]
    has_a = "SELECT Name FROM STUDENT AS S WHERE EXISTS (SELECT * FROM GRADE_REPORT AS G WHERE G.Student_number = S.Student_number AND G.Grade = 'A')"
    assert rows(c, has_a) == [("Brown",)]                    # "A가 하나라도 있다"는 다른 질문이다
    print("[OK] Q2-2: 두 판 모두 (Smith, CS). A가 하나라도 있는 학생은 Brown")

    # 성적이 없는 학생이 있으면 두 풀이가 갈린다
    c.execute("INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')")
    assert rows(c, NE.replace("OP", "<>")) == [("Kim", "CS")]
    assert rows(c, JG.replace("OP", "<>")) == []
    assert sorted(rows(c, NE.replace("OP", "="))) == [("Kim", "CS"), ("Smith", "CS")]
    assert rows(c, JG.replace("OP", "=")) == [("Smith", "CS")]
    strict = NE.replace("OP", "<>") + " AND EXISTS (SELECT * FROM GRADE_REPORT AS G WHERE G.Student_number = S.Student_number)"
    assert rows(c, strict) == []
    print("[OK] 성적 없는 Kim: NOT EXISTS 판만 Kim을 뽑는다. EXISTS를 더하면 다시 0행")

    # 성적이 모두 A인 학생 Lee를 넣으면 두 판 모두 Lee를 찾는다
    c.execute("INSERT INTO STUDENT VALUES ('Lee', 30, 3, 'MATH')")
    c.executemany("INSERT INTO GRADE_REPORT VALUES (?,?,?)", [(30, 85, "A"), (30, 135, "A")])
    assert sorted(rows(c, NE.replace("OP", "<>"))) == [("Kim", "CS"), ("Lee", "MATH")]
    assert rows(c, JG.replace("OP", "<>")) == [("Lee", "MATH")]
    assert rows(c, strict) == [("Lee", "MATH")]
    print("[OK] 모두 A인 Lee: 조인과 묶기 판과 EXISTS를 더한 판은 Lee만, NOT EXISTS 판은 Kim과 Lee")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
