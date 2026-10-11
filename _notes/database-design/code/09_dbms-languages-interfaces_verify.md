---
layout: "note"
title: "09_dbms-languages-interfaces_verify.py"
display_title: "09_dbms-languages-interfaces_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/dbms-languages-interfaces/"
parent_title: "DBMS 언어와 인터페이스"
description: "데이터베이스 설계 · DBMS 언어와 인터페이스 검증 코드"
permalink: "/studies/database-design/code/09_dbms-languages-interfaces_verify/"
---
{% raw %}
[DBMS 언어와 인터페이스](/Hongs_Blog/studies/database-design/dbms-languages-interfaces/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""DBMS 언어와 인터페이스 문서의 값 확인.

문서: 09.DBMS 언어와 인터페이스
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.21~23, UNIVERSITY 상태 2-1 p.5
주장:
  1. 네 언어가 하는 일은 "무엇이 바뀌는가"로 갈린다.
     DDL(표의 틀 정의), VDL(뷰 정의), SDL(색인 같은 저장 구조 정의)의 문장은 카탈로그(스키마의 기록)를 바꾸고
     저장된 행은 건드리지 않는다. DML의 넣기, 지우기, 고치기는 행을 바꾸고 카탈로그는 건드리지 않는다.
     DML의 찾기는 아무것도 바꾸지 않고 행을 돌려준다.
  2. "Brown이 A를 받은 과목 번호"를 두 방식으로 구하면 답이 같다(MATH2410, CS1310, CS3380).
     비절차적 DML: 문장 하나에 원하는 것만 적는다.
     절차적 DML: 레코드를 하나씩 꺼내 비교하는 차례를 직접 적는다. 이 자료에서는 레코드를 17번 꺼낸다.
  3. 카드 C2의 분류.
실행: python3 09_dbms-languages-interfaces_verify.py
SQLite를 DBMS의 한 예로 썼다. 요즘 DBMS에서는 네 언어가 SQL 하나에 들어 있다.
"""
import sqlite3

DDL_STATEMENTS = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER, Class INTEGER, Major TEXT);
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT, Credit_hours INTEGER, Department TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER, Course_number TEXT, Semester TEXT, Year TEXT, Instructor TEXT);
CREATE TABLE GRADE_REPORT (Student_number INTEGER, Section_identifier INTEGER, Grade TEXT);
CREATE TABLE PREREQUISITE (Course_number TEXT, Prerequisite_number TEXT);
"""

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


def catalog(conn):
    """카탈로그: DBMS가 기억하는 정의(종류, 이름, 정의 문장)."""
    return conn.execute("SELECT type, name, sql FROM sqlite_master ORDER BY rowid").fetchall()


def state(conn):
    """상태: 모든 표의 모든 행."""
    names = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY rowid")]
    return {t: conn.execute(f"SELECT * FROM {t} ORDER BY rowid").fetchall() for t in names}


def effect(conn, sql):
    """문장을 실행하고 (카탈로그가 바뀌었나, 원래 있던 표의 행이 바뀌었나, 돌려준 행 수)를 낸다."""
    cat0, st0 = catalog(conn), state(conn)
    rows = conn.execute(sql).fetchall()
    st1 = state(conn)
    return (catalog(conn) != cat0, any(st1.get(t) != rows0 for t, rows0 in st0.items()), len(rows))


# ---------- 비절차적 DML: 원하는 것만 적는다 ----------
DECLARATIVE = """SELECT SE.Course_number
                 FROM STUDENT S, GRADE_REPORT G, SECTION SE
                 WHERE S.Name = 'Brown' AND G.Grade = 'A'
                   AND S.Student_number = G.Student_number
                   AND G.Section_identifier = SE.Section_identifier"""


# ---------- 절차적 DML: 레코드를 하나씩 꺼내는 차례를 적는다 ----------
class RecordFile:
    """표 하나를 처음부터 한 레코드씩 읽는 파일처럼 다룬다. 꺼낸 횟수를 센다."""
    fetched = 0

    def __init__(self, conn, table):
        self.cursor = conn.execute(f"SELECT * FROM {table} ORDER BY rowid")

    def next_record(self):
        rec = self.cursor.fetchone()
        if rec is not None:
            RecordFile.fetched += 1
        return rec


def procedural(conn):
    RecordFile.fetched = 0
    # 1) STUDENT를 앞에서부터 읽어 Brown의 학번을 찾는다.
    f = RecordFile(conn, "STUDENT")
    number = None
    while (rec := f.next_record()) is not None:
        if rec[0] == "Brown":
            number = rec[1]
            break
    # 2) GRADE_REPORT를 끝까지 읽으며 그 학번이고 성적이 A인 분반 번호를 모은다.
    f = RecordFile(conn, "GRADE_REPORT")
    sections = []
    while (rec := f.next_record()) is not None:
        if rec[0] == number and rec[2] == "A":
            sections.append(rec[1])
    # 3) 분반 번호마다 SECTION을 앞에서부터 읽어 과목 번호를 찾는다.
    courses = []
    for sec in sections:
        f = RecordFile(conn, "SECTION")
        while (rec := f.next_record()) is not None:
            if rec[0] == sec:
                courses.append(rec[1])
                break
    return courses, RecordFile.fetched


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    conn.isolation_level = None

    # ---- 1. 네 언어가 바꾸는 것 ----
    # DDL: 틀을 정한다. 표 5개가 카탈로그에 생기고 행은 아직 없다.
    conn.executescript(DDL_STATEMENTS)
    assert [(t, n) for t, n, _ in catalog(conn)] == [("table", "STUDENT"), ("table", "COURSE"), ("table", "SECTION"),
                                                     ("table", "GRADE_REPORT"), ("table", "PREREQUISITE")]
    assert all(rows == [] for rows in state(conn).values())
    # DML(넣기): 행이 생긴다. 카탈로그는 그대로다.
    cat0 = catalog(conn)
    for table, rows in ROWS.items():
        conn.executemany(f"INSERT INTO {table} VALUES ({', '.join('?' * len(rows[0]))})", rows)
    assert catalog(conn) == cat0 and state(conn) == ROWS

    results = {}
    results["DDL  표에 칸 더하기"] = effect(conn, "ALTER TABLE COURSE ADD COLUMN Language TEXT")
    results["VDL  뷰 정의"] = effect(conn, """CREATE VIEW TRANSCRIPT AS
        SELECT S.Name AS Student_name, SE.Course_number, G.Grade, SE.Semester, SE.Year, SE.Section_identifier AS Section_id
        FROM STUDENT S, GRADE_REPORT G, SECTION SE
        WHERE S.Student_number = G.Student_number AND G.Section_identifier = SE.Section_identifier""")
    results["SDL  색인 달기"] = effect(conn, "CREATE INDEX SECTION_SEM_YEAR ON SECTION (Semester, Year)")
    results["DML  찾기"] = effect(conn, "SELECT Grade FROM TRANSCRIPT WHERE Student_name = 'Smith'")
    results["DML  넣기"] = effect(conn, "INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')")
    results["DML  고치기"] = effect(conn, "UPDATE STUDENT SET Class = 2 WHERE Name = 'Smith'")
    results["DML  지우기"] = effect(conn, "DELETE FROM STUDENT WHERE Name = 'Kim'")
    # ALTER TABLE로 칸을 더하면 COURSE의 행마다 빈 칸(NULL)이 하나 붙는다. 그래서 "행이 바뀌었나"는 COURSE만 참이다.
    assert results["DDL  표에 칸 더하기"] == (True, True, 0)
    assert conn.execute("SELECT COUNT(*) FROM COURSE WHERE Language IS NULL").fetchone()[0] == 4
    assert results["VDL  뷰 정의"] == (True, False, 0)
    assert results["SDL  색인 달기"] == (True, False, 0)
    assert results["DML  찾기"] == (False, False, 2)
    assert results["DML  넣기"] == (False, True, 0)
    assert results["DML  고치기"] == (False, True, 0)
    assert results["DML  지우기"] == (False, True, 0)
    kinds = [t for t, _, _ in catalog(conn)]
    assert kinds.count("table") == 5 and kinds.count("view") == 1 and kinds.count("index") == 1
    conn.execute("UPDATE STUDENT SET Class = 1 WHERE Name = 'Smith'")      # 원래 상태로

    # ---- 2. 비절차적 DML과 절차적 DML ----
    declarative_answer = [r[0] for r in conn.execute(DECLARATIVE)]
    procedural_answer, fetched = procedural(conn)
    assert sorted(declarative_answer) == sorted(procedural_answer) == ["CS1310", "CS3380", "MATH2410"]
    assert procedural_answer == ["MATH2410", "CS1310", "CS3380"]
    assert fetched == 2 + 6 + (1 + 2 + 6) == 17        # STUDENT 2, GRADE_REPORT 6, SECTION 1 + 2 + 6
    assert DECLARATIVE.count(";") == 0 and DECLARATIVE.strip().upper().startswith("SELECT")   # 문장 하나

    # ---- 문서 "예시로 보기"의 다섯 문장을 적힌 그대로 ----
    doc = sqlite3.connect(":memory:")
    doc.isolation_level = None
    doc.execute("CREATE TABLE STUDENT (Name VARCHAR(30), Student_number INT, Class INT, Major VARCHAR(4))")   # DDL
    doc.executemany("INSERT INTO STUDENT VALUES (?, ?, ?, ?)", ROWS["STUDENT"])                               # Smith, Brown
    e_view = effect(doc, "CREATE VIEW CS_STUDENT AS SELECT Name, Student_number FROM STUDENT WHERE Major = 'CS'")  # VDL
    e_index = effect(doc, "CREATE INDEX STUDENT_BY_NUMBER ON STUDENT (Student_number)")                       # SDL
    e_insert = effect(doc, "INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')")                                 # DML
    e_select = effect(doc, "SELECT Name FROM STUDENT WHERE Major = 'CS'")                                     # DML
    assert e_view == (True, False, 0) and e_index == (True, False, 0)        # 카탈로그만 바뀐다
    assert e_insert == (False, True, 0) and e_select == (False, False, 3)    # 행만 바뀐다 / 아무것도 안 바뀐다
    assert [r[0] for r in doc.execute("SELECT Name FROM STUDENT WHERE Major = 'CS'")] == ["Smith", "Brown", "Kim"]
    assert [(t, n) for t, n, _ in catalog(doc)] == [("table", "STUDENT"), ("view", "CS_STUDENT"), ("index", "STUDENT_BY_NUMBER")]
    assert doc.execute("SELECT * FROM CS_STUDENT").fetchall() == [("Smith", 17), ("Brown", 8), ("Kim", 25)]

    # ---- 3. 카드 C2 ----
    card = {
        "STUDENT 표에 Date_of_birth 칸을 만든다": "DDL",
        "Kim의 행을 넣는다": "DML",
        "TRANSCRIPT라는 뷰를 정의한다": "VDL",
        "SECTION에 학기와 연도로 찾는 색인을 단다": "SDL",
        "Smith의 성적을 찾는다": "DML",
    }
    changes_schema_record = {"DDL": True, "VDL": True, "SDL": True, "DML": False}
    assert [changes_schema_record[v] for v in card.values()] == [True, False, True, True, False]

    print("ALL CHECKS PASSED")
```
{% endraw %}
