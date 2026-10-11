---
layout: "note"
title: "08_data-independence_verify.py"
display_title: "08_data-independence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/data-independence/"
parent_title: "데이터 독립성"
description: "데이터베이스 설계 · 데이터 독립성 검증 코드"
permalink: "/studies/database-design/code/08_data-independence_verify/"
---
{% raw %}
[데이터 독립성](/Hongs_Blog/studies/database-design/data-independence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데이터 독립성 문서의 값 확인.

문서: 08.데이터 독립성
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.16~19, 3주차 슬라이드 3 p.6, UNIVERSITY 상태 2-1 p.5, p.10, p.20
주장: 응용 프로그램(성적표 프로그램)의 요청 문장을 한 글자도 안 고치고 아래 변화를 차례로 겪게 한다.
  물리적 데이터 독립성 (내부 스키마를 바꾼다)
    P1. SECTION에 (Semester, Year) 색인을 단다. "2008년 가을 분반" 질의의 실행 계획은 전부 훑기에서
        색인 찾기로 바뀌고, 답 112, 119, 135는 그대로다.
    P2. GRADE_REPORT에 색인을 달았다가 뗀다. 성적표는 그대로다.
  논리적 데이터 독립성 (개념 스키마를 바꾼다)
    L1. STUDENT에 Date_of_birth 열을 더한다(슬라이드 2-2 p.6). 성적표는 그대로다.
    L2. 새 표 DEPARTMENT를 더한다. 성적표는 그대로다.
    L3. GRADE_REPORT를 이름과 과목 번호가 든 꼴(2-1 p.20)로 바꾼다. 뷰 정의(사상)만 고치면 성적표는 그대로다.
    L4. 성적표가 쓰지 않는 SECTION.Instructor 열을 뺀다. 성적표는 그대로다.
  지켜 주지 못하는 것
    N1. 프로그램이 쓰는 데이터를 빼면 깨진다: PREREQUISITE 표를 없애면 선수 과목 프로그램이 오류를 낸다.
        뷰가 쓰는 Grade 열을 빼려는 시도는 SQLite가 아예 거부한다.
    N2. 외부 스키마를 거치지 않고 표의 열 개수에 기대는 프로그램은 열 하나만 더해도 깨진다.
  카드 C2: 3 p.6의 네 가지 변화 가운데 (1)~(3)은 개념 스키마, (4)는 내부 스키마의 변화다.
실행: python3 08_data-independence_verify.py
SQLite를 DBMS의 한 예로 썼다. EXPLAIN QUERY PLAN의 글귀는 SQLite 3.50.4 기준이다.
"""
import sqlite3

DDL = """
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

# 외부 스키마: 성적표를 뽑는 사람들이 보는 모습(2-1 p.10의 TRANSCRIPT)
VIEW_V1 = """
CREATE VIEW TRANSCRIPT AS
  SELECT S.Name AS Student_name, SE.Course_number, G.Grade, SE.Semester, SE.Year, SE.Section_identifier AS Section_id
  FROM STUDENT S, GRADE_REPORT G, SECTION SE
  WHERE S.Student_number = G.Student_number AND G.Section_identifier = SE.Section_identifier
"""
# L3 뒤에 고친 사상: 이름과 과목 번호를 이제 GRADE_REPORT에서 바로 읽는다
VIEW_V2 = """
CREATE VIEW TRANSCRIPT AS
  SELECT G.Student_name, G.Course_number, G.Grade, SE.Semester, SE.Year, G.Section_identifier AS Section_id
  FROM GRADE_REPORT G, SECTION SE
  WHERE G.Section_identifier = SE.Section_identifier
"""
VIEW_PREREQ = """
CREATE VIEW COURSE_PREREQUISITES AS
  SELECT C.Course_name, C.Course_number, P.Prerequisite_number AS Prerequisites
  FROM COURSE C, PREREQUISITE P WHERE C.Course_number = P.Course_number
"""

# 응용 프로그램의 요청 문장. 끝까지 이 글자 그대로 쓴다.
APP_TRANSCRIPT = ("SELECT Course_number, Grade, Semester, Year, Section_id "
                  "FROM TRANSCRIPT WHERE Student_name = ? ORDER BY Section_id")
APP_FALL08 = "SELECT Section_identifier FROM SECTION WHERE Semester = 'Fall' AND Year = '08'"
APP_PREREQ = "SELECT Prerequisites FROM COURSE_PREREQUISITES WHERE Course_name = 'Database'"

EXPECTED = {       # 2-1 p.10의 TRANSCRIPT 그림
    "Smith": [("MATH2410", "B", "Fall", "08", 112), ("CS1310", "C", "Fall", "08", 119)],
    "Brown": [("MATH2410", "A", "Fall", "07", 85), ("CS1310", "A", "Fall", "07", 92),
              ("CS3320", "B", "Spring", "08", 102), ("CS3380", "A", "Fall", "08", 135)],
}
FIGURE_P20 = [(17, "Smith", 112, "MATH2410", "B"), (17, "Smith", 119, "CS1310", "C"),
              (8, "Brown", 85, "MATH2410", "A"), (8, "Brown", 92, "CS1310", "A"),
              (8, "Brown", 102, "CS3320", "B"), (8, "Brown", 135, "CS3380", "A")]


def build_university(conn):
    conn.executescript(DDL)
    for table, rows in ROWS.items():
        conn.executemany(f"INSERT INTO {table} VALUES ({', '.join('?' * len(rows[0]))})", rows)
    conn.commit()


# 문서 "예시로 보기"에 실은 문장(Smith를 문장 안에 적은 꼴)
DOC_SQL = """SELECT Course_number, Grade, Semester, Year, Section_id
FROM TRANSCRIPT
WHERE Student_name = 'Smith'
ORDER BY Section_id;"""


def transcript_program(conn):
    """성적표 프로그램: 외부 스키마 TRANSCRIPT의 이름만 안다."""
    assert conn.execute(DOC_SQL).fetchall() == EXPECTED["Smith"]       # 문서의 문장도 매번 같은 두 줄을 낸다
    return {name: conn.execute(APP_TRANSCRIPT, (name,)).fetchall() for name in ("Smith", "Brown")}


def plan(conn, sql):
    return " / ".join(r[3] for r in conn.execute("EXPLAIN QUERY PLAN " + sql))


def columns(conn, table):
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})")]


def view_text(conn, name):
    return conn.execute("SELECT sql FROM sqlite_master WHERE type = 'view' AND name = ?", (name,)).fetchone()[0]


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    build_university(conn)
    conn.execute(VIEW_V1)
    conn.execute(VIEW_PREREQ)
    app_text_at_start = (APP_TRANSCRIPT, APP_FALL08, APP_PREREQ)
    assert transcript_program(conn) == EXPECTED
    assert sum(len(v) for v in EXPECTED.values()) == 6

    # ---------- 물리적 데이터 독립성 ----------
    # P1. 색인을 단다
    before_plan = plan(conn, APP_FALL08)
    before_rows = conn.execute(APP_FALL08).fetchall()
    assert before_plan.startswith("SCAN") and "INDEX" not in before_plan, before_plan       # 여섯 행을 모두 훑는다
    conn.execute("CREATE INDEX SECTION_SEM_YEAR ON SECTION (Semester, Year)")
    after_plan = plan(conn, APP_FALL08)
    assert "SEARCH" in after_plan and "USING INDEX SECTION_SEM_YEAR" in after_plan, after_plan
    assert sorted(conn.execute(APP_FALL08).fetchall()) == sorted(before_rows) == [(112,), (119,), (135,)]
    assert columns(conn, "SECTION") == ["Section_identifier", "Course_number", "Semester", "Year", "Instructor"]  # 개념 스키마는 그대로
    assert transcript_program(conn) == EXPECTED
    # P2. 다른 색인을 달았다가 뗀다
    conn.execute("CREATE INDEX GRADE_BY_STUDENT ON GRADE_REPORT (Student_number)")
    assert transcript_program(conn) == EXPECTED
    conn.execute("DROP INDEX GRADE_BY_STUDENT")
    assert transcript_program(conn) == EXPECTED

    # ---------- 논리적 데이터 독립성 ----------
    # L1. 열을 더한다 (2-2 p.6의 Date_of_birth)
    conn.execute("ALTER TABLE STUDENT ADD COLUMN Date_of_birth TEXT")
    assert columns(conn, "STUDENT") == ["Name", "Student_number", "Class", "Major", "Date_of_birth"]
    assert transcript_program(conn) == EXPECTED
    # L2. 새 표를 더한다
    conn.execute("CREATE TABLE DEPARTMENT (Dept_code TEXT, Office TEXT)")
    conn.execute("INSERT INTO DEPARTMENT VALUES ('CS', 'Bldg 208')")
    assert transcript_program(conn) == EXPECTED
    assert view_text(conn, "TRANSCRIPT").split() == VIEW_V1.split()            # 여기까지 사상도 그대로다
    # L3. GRADE_REPORT의 모양을 바꾼다 (2-1 p.5의 꼴 -> p.20의 꼴). 뷰 정의(사상)만 고친다.
    conn.executescript("""
        CREATE TABLE GRADE_REPORT_NEW (Student_number INTEGER, Student_name TEXT,
                                       Section_identifier INTEGER, Course_number TEXT, Grade TEXT);
        INSERT INTO GRADE_REPORT_NEW
          SELECT G.Student_number, S.Name, G.Section_identifier, SE.Course_number, G.Grade
          FROM GRADE_REPORT G, STUDENT S, SECTION SE
          WHERE G.Student_number = S.Student_number AND G.Section_identifier = SE.Section_identifier
          ORDER BY G.rowid;
        DROP VIEW TRANSCRIPT;
        DROP TABLE GRADE_REPORT;
        ALTER TABLE GRADE_REPORT_NEW RENAME TO GRADE_REPORT;
    """)
    conn.execute(VIEW_V2)
    assert conn.execute("SELECT * FROM GRADE_REPORT ORDER BY rowid").fetchall() == FIGURE_P20
    assert columns(conn, "GRADE_REPORT") == ["Student_number", "Student_name", "Section_identifier", "Course_number", "Grade"]
    assert view_text(conn, "TRANSCRIPT").split() != VIEW_V1.split()            # 사상은 바뀌었다
    assert columns(conn, "TRANSCRIPT") == ["Student_name", "Course_number", "Grade", "Semester", "Year", "Section_id"]  # 외부 스키마는 그대로
    assert transcript_program(conn) == EXPECTED                                # 프로그램도 결과도 그대로
    # L4. 프로그램이 쓰지 않는 열을 뺀다
    conn.execute("ALTER TABLE SECTION DROP COLUMN Instructor")
    assert columns(conn, "SECTION") == ["Section_identifier", "Course_number", "Semester", "Year"]
    assert transcript_program(conn) == EXPECTED

    # ---------- 지켜 주지 못하는 것 ----------
    # N1. 프로그램이 쓰는 데이터를 뺀다
    assert conn.execute(APP_PREREQ).fetchall() == [("CS3320",), ("MATH2410",)]
    try:
        conn.execute("ALTER TABLE GRADE_REPORT DROP COLUMN Grade")             # 뷰가 쓰는 열
        raise AssertionError("뷰가 쓰는 열이 지워졌다")
    except sqlite3.OperationalError as e:
        assert "TRANSCRIPT" in str(e) and "Grade" in str(e), e                 # SQLite가 거부한다
    assert transcript_program(conn) == EXPECTED
    conn.execute("DROP TABLE PREREQUISITE")                                    # 뷰가 쓰는 표
    try:
        conn.execute(APP_PREREQ).fetchall()
        raise AssertionError("없는 표를 쓰는 프로그램이 돌았다")
    except sqlite3.OperationalError as e:
        assert "PREREQUISITE" in str(e), e
    assert transcript_program(conn) == EXPECTED                                # 남은 데이터만 쓰는 프로그램은 멀쩡하다

    # N2. 외부 스키마를 거치지 않고 열 개수에 기대는 프로그램
    fresh = sqlite3.connect(":memory:")
    build_university(fresh)

    def positional_program(c):
        out = []
        for row in c.execute("SELECT * FROM STUDENT"):
            name, number, cls, major = row            # 열이 꼭 네 개라고 믿는다
            out.append(name)
        return out

    assert positional_program(fresh) == ["Smith", "Brown"]
    fresh.execute("ALTER TABLE STUDENT ADD COLUMN Date_of_birth TEXT")
    try:
        positional_program(fresh)
        raise AssertionError("열 개수에 기대는 프로그램이 돌았다")
    except ValueError as e:
        assert "too many values" in str(e), e

    assert (APP_TRANSCRIPT, APP_FALL08, APP_PREREQ) == app_text_at_start       # 요청 문장은 처음 그대로다

    # 카드 C2: 3 p.6의 네 변화가 어느 스키마의 변화인가
    changes = {"새 레코드 타입이나 데이터 항목을 더한다": "개념", "제약을 고친다": "개념",
               "레코드 타입이나 데이터 항목을 뺀다": "개념", "새 접근 경로를 만든다": "내부"}
    independence = {"개념": "논리적", "내부": "물리적"}
    assert [independence[v] for v in changes.values()] == ["논리적", "논리적", "논리적", "물리적"]

    print("ALL CHECKS PASSED")
```
{% endraw %}
