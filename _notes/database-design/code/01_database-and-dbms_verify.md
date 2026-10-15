---
layout: "note"
title: "01_database-and-dbms_verify.py"
display_title: "01_database-and-dbms_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/database-and-dbms/"
parent_title: "데이터베이스와 DBMS"
description: "데이터베이스 설계 · 데이터베이스와 DBMS 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/01_database-and-dbms_verify/"
---
{% raw %}
[데이터베이스와 DBMS](/Hongs_Blog/studies/database-design/database-and-dbms/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데이터베이스와 DBMS 문서의 값 확인.

문서: 01.데이터베이스와 DBMS
출처: Elmasri & Navathe, Fundamentals of Database Systems 그림 1.2 (UNIVERSITY 데이터베이스)
주장:
  1. 문서에 실은 UNIVERSITY 상태는 표 5개, 열 18개, 행 2 + 4 + 6 + 6 + 3 = 21개다.
  2. "Brown이 A를 받은 과목"은 STUDENT -> GRADE_REPORT -> SECTION 세 표를 이어야 나오고 답은
     MATH2410, CS1310, CS3380이다. Database(CS3380)의 선수 과목은 CS3320, MATH2410이다.
  3. DBMS가 돕는 네 가지 일을 SQLite로 해 본다.
     정의: 표 5개를 만들면 DBMS가 그 틀을 기억한다. 구축: 21행을 넣는다.
     조작: 찾기, 고치기(Smith의 Class 1 -> 2), 넣기(새 분반). 공유: 두 접속이 같은 파일의 같은 내용을 본다.
  4. 카드 C3: Smith가 들은 과목은 MATH2410(B), CS1310(C)이다.
실행: python3 01_database-and-dbms_verify.py
SQLite(파이썬 표준 라이브러리 sqlite3)를 DBMS의 한 예로 썼다.
"""
import os
import sqlite3
import tempfile

DDL = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER, Class INTEGER, Major TEXT);
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT, Credit_hours INTEGER, Department TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER, Course_number TEXT, Semester TEXT, Year TEXT, Instructor TEXT);
CREATE TABLE GRADE_REPORT (Student_number INTEGER, Section_identifier INTEGER, Grade TEXT);
CREATE TABLE PREREQUISITE (Course_number TEXT, Prerequisite_number TEXT);
"""

# 문서에 실은 UNIVERSITY 상태 (Elmasri 그림 1.2)
ROWS = {
    "STUDENT": [("Smith", 17, 1, "CS"), ("Brown", 8, 2, "CS")],
    "COURSE": [("Intro to Computer Science", "CS1310", 4, "CS"), ("Data Structures", "CS3320", 4, "CS"),
               ("Discrete Mathematics", "MATH2410", 3, "MATH"), ("Database", "CS3380", 3, "CS")],
    "SECTION": [(85, "MATH2410", "Fall", "07", "King"), (92, "CS1310", "Fall", "07", "Anderson"),
                (102, "CS3320", "Spring", "08", "Knuth"), (112, "MATH2410", "Fall", "08", "Chang"),
                (119, "CS1310", "Fall", "08", "Anderson"), (135, "CS3380", "Fall", "08", "Stone")],
    "GRADE_REPORT": [(17, 112, "B"), (17, 119, "C"), (8, 85, "A"), (8, 92, "A"), (8, 102, "B"), (8, 135, "A")],
    "PREREQUISITE": [("CS3380", "CS3320"), ("CS3380", "MATH2410"), ("CS3320", "CS1310")],
}


def define(conn):
    """정의: 표의 틀을 알려 준다."""
    conn.executescript(DDL)


def construct(conn):
    """구축: 데이터를 채운다."""
    for table, rows in ROWS.items():
        marks = ", ".join("?" * len(rows[0]))
        conn.executemany(f"INSERT INTO {table} VALUES ({marks})", rows)
    conn.commit()


def tables(conn):
    return [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY rowid")]


def n_columns(conn, table):
    return conn.execute("SELECT COUNT(*) FROM pragma_table_info(?)", (table,)).fetchone()[0]


def n_rows(conn, table):
    return conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")

    # 정의: 틀만 알려 준 직후에는 표 5개가 있고 행은 없다.
    define(conn)
    assert tables(conn) == ["STUDENT", "COURSE", "SECTION", "GRADE_REPORT", "PREREQUISITE"]
    assert [n_columns(conn, t) for t in tables(conn)] == [4, 4, 5, 3, 2]
    assert sum(n_columns(conn, t) for t in tables(conn)) == 18
    assert all(n_rows(conn, t) == 0 for t in tables(conn))

    # 구축: 21행이 들어간다.
    construct(conn)
    counts = [n_rows(conn, t) for t in tables(conn)]
    assert counts == [2, 4, 6, 6, 3] and sum(counts) == 21, counts

    # 조작 1: 찾기. Brown이 A를 받은 과목은 세 표를 이어야 나온다.
    q = """SELECT SE.Course_number
           FROM STUDENT S, GRADE_REPORT G, SECTION SE
           WHERE S.Name = ? AND G.Grade = ?
             AND S.Student_number = G.Student_number
             AND G.Section_identifier = SE.Section_identifier
           ORDER BY SE.Section_identifier"""
    assert [r[0] for r in conn.execute(q, ("Brown", "A"))] == ["MATH2410", "CS1310", "CS3380"]
    # 손으로 따라가기: Brown -> 8번 -> A인 분반 85, 92, 135 -> 과목 번호
    brown = conn.execute("SELECT Student_number FROM STUDENT WHERE Name = 'Brown'").fetchone()[0]
    assert brown == 8
    secs = [r[0] for r in conn.execute(
        "SELECT Section_identifier FROM GRADE_REPORT WHERE Student_number = ? AND Grade = 'A'", (brown,))]
    assert secs == [85, 92, 135]
    # Database 과목의 선수 과목
    pre = [r[0] for r in conn.execute(
        """SELECT P.Prerequisite_number FROM COURSE C, PREREQUISITE P
           WHERE C.Course_name = 'Database' AND C.Course_number = P.Course_number""")]
    assert pre == ["CS3320", "MATH2410"], pre
    # 카드 C3: Smith의 성적
    smith = conn.execute(
        """SELECT SE.Course_number, G.Grade FROM STUDENT S, GRADE_REPORT G, SECTION SE
           WHERE S.Name = 'Smith' AND S.Student_number = G.Student_number
             AND G.Section_identifier = SE.Section_identifier ORDER BY SE.Section_identifier""").fetchall()
    assert smith == [("MATH2410", "B"), ("CS1310", "C")], smith

    # 조작 2: 고치기와 넣기. 틀은 그대로이고 내용만 바뀐다.
    conn.execute("UPDATE STUDENT SET Class = 2 WHERE Name = 'Smith'")
    conn.execute("INSERT INTO SECTION VALUES (145, 'CS3380', 'Spring', '09', 'Stone')")
    conn.commit()
    assert conn.execute("SELECT Class FROM STUDENT WHERE Name = 'Smith'").fetchone()[0] == 2
    assert n_rows(conn, "SECTION") == 7
    assert [n_columns(conn, t) for t in tables(conn)] == [4, 4, 5, 3, 2]

    # 공유: 같은 데이터베이스 파일에 두 접속이 붙으면, 한쪽이 고친 것을 다른 쪽이 본다.
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, "university.db")
        registrar = sqlite3.connect(path)       # 교무과 프로그램
        department = sqlite3.connect(path)      # 학과 사무실 프로그램
        define(registrar)
        construct(registrar)
        assert n_rows(department, "STUDENT") == 2
        registrar.execute("INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')")
        registrar.commit()
        assert n_rows(department, "STUDENT") == 3
        assert department.execute("SELECT Name FROM STUDENT WHERE Student_number = 25").fetchone()[0] == "Kim"
        registrar.close()
        department.close()

    print("ALL CHECKS PASSED")
```
{% endraw %}
