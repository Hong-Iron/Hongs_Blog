---
layout: "note"
title: "10_dbms-component-modules_verify.py"
display_title: "10_dbms-component-modules_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/dbms-component-modules/"
parent_title: "DBMS 구성 모듈"
description: "데이터베이스 설계 · DBMS 구성 모듈 검증 코드"
permalink: "/studies/database-design/code/10_dbms-component-modules_verify/"
---
{% raw %}
[DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""DBMS 구성 모듈 문서의 값 확인.

문서: 10.DBMS 구성 모듈
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.29~33 (그림은 Elmasri 그림 2.3), UNIVERSITY 상태 2-1 p.5
주장: 슬라이드가 말하는 모듈의 일을 실제 DBMS 하나(SQLite)에서 하나씩 본다.
  1. DDL 컴파일러: 정의 문장을 처리하면 그 내용이 시스템 카탈로그에 들어간다(이름, 정의, 저장 위치).
  2. 질의 컴파일러: 문법이 틀린 질의와 카탈로그에 없는 표·열을 쓰는 질의는 실행하기 전에 걸러진다.
     맞는 질의는 내부 형태(실행 시간 처리기가 돌릴 명령의 줄)로 바뀐다.
  3. 질의 최적화기: FROM에 표를 적은 순서를 바꿔 써도 실행 계획이 같다. 색인을 달면 계획이 바뀐다.
     어느 경우에도 답은 같다.
  4. 미리 컴파일해 둔 트랜잭션: 같은 문장에 값만 바꿔 넣어 여러 번 돌린다.
  5. 실행 시간 처리기와 트랜잭션 관리: 도중에 그만둔 트랜잭션은 흔적을 남기지 않는다.
  6. 저장 데이터 관리자: 저장된 데이터베이스는 크기가 같은 블록(페이지)의 줄이고, 표와 색인마다 시작 페이지가
     카탈로그에 적혀 있다.
실행: python3 10_dbms-component-modules_verify.py
SQLite의 부품과 슬라이드의 모듈을 짝지은 것은 확인을 위해 보탠 것이다. 글귀는 SQLite 3.50.4 기준이다.
"""
import os
import sqlite3
import tempfile

DDL = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER PRIMARY KEY, Class INTEGER, Major TEXT);
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT, Credit_hours INTEGER, Department TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER PRIMARY KEY, Course_number TEXT, Semester TEXT, Year TEXT, Instructor TEXT);
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


def compile_error(conn, sql):
    """실행하지 않고 컴파일만 해 본다(EXPLAIN). 걸리면 오류 글귀를, 통과하면 None을 돌려준다."""
    try:
        conn.execute("EXPLAIN " + sql)
    except sqlite3.OperationalError as e:
        return str(e)
    return None


def plan(conn, sql):
    return [r[3] for r in conn.execute("EXPLAIN QUERY PLAN " + sql)]


if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, "university.db")
        conn = sqlite3.connect(path, isolation_level=None)

        # ---- 1. DDL 컴파일러 -> 시스템 카탈로그 ----
        assert conn.execute("SELECT COUNT(*) FROM sqlite_master").fetchone()[0] == 0
        conn.executescript(DDL)
        cat = conn.execute("SELECT type, name, rootpage, sql FROM sqlite_master WHERE type = 'table' ORDER BY rowid").fetchall()
        assert [c[1] for c in cat] == ["STUDENT", "COURSE", "SECTION", "GRADE_REPORT", "PREREQUISITE"]
        assert all(c[3].startswith("CREATE TABLE " + c[1]) for c in cat)        # 정의 문장이 그대로 들어 있다
        roots = [c[2] for c in cat]
        assert len(set(roots)) == 5 and all(r >= 2 for r in roots)               # 표마다 저장이 시작되는 페이지
        names_types = conn.execute("SELECT name, type FROM pragma_table_info('SECTION')").fetchall()
        assert names_types == [("Section_identifier", "INTEGER"), ("Course_number", "TEXT"), ("Semester", "TEXT"),
                               ("Year", "TEXT"), ("Instructor", "TEXT")]         # 데이터 항목의 이름과 자료형
        for table, rows in ROWS.items():
            conn.executemany(f"INSERT INTO {table} VALUES ({', '.join('?' * len(rows[0]))})", rows)

        # ---- 2. 질의 컴파일러: 실행 전에 걸러 낸다 ----
        good = "SELECT Section_identifier FROM SECTION WHERE Semester = 'Fall' AND Year = '08'"
        assert "syntax error" in compile_error(conn, "SELEC Section_identifier FROM SECTION")     # 문법 검사(구문 분석)
        assert "no such table" in compile_error(conn, "SELECT * FROM SECTIONS")                    # 카탈로그에 없는 표
        assert "no such column" in compile_error(conn, "SELECT Teacher FROM SECTION")              # 카탈로그에 없는 열
        assert compile_error(conn, good) is None
        program = [r[1] for r in conn.execute("EXPLAIN " + good)]                # 내부 형태: 명령의 줄
        assert len(program) > 5 and {"OpenRead", "ResultRow", "Halt"} <= set(program), program
        assert conn.execute("SELECT COUNT(*) FROM SECTION").fetchone()[0] == 6   # EXPLAIN은 아무것도 실행하지 않았다

        # ---- 3. 질의 최적화기 ----
        q_as_written_1 = ("SELECT G.Grade FROM STUDENT S, GRADE_REPORT G "
                          "WHERE S.Name = 'Smith' AND S.Student_number = G.Student_number")
        q_as_written_2 = ("SELECT G.Grade FROM GRADE_REPORT G, STUDENT S "
                          "WHERE G.Student_number = S.Student_number AND S.Name = 'Smith'")
        plan_before = plan(conn, q_as_written_1)
        assert plan(conn, q_as_written_2) == plan_before                          # 적은 순서와 상관없이 같은 계획
        assert plan_before[0].startswith("SCAN G"), plan_before                   # 성적을 훑고 학생을 찾는다
        answers_before = sorted(conn.execute(q_as_written_1).fetchall())
        assert answers_before == sorted(conn.execute(q_as_written_2).fetchall()) == [("B",), ("C",)]
        conn.execute("CREATE INDEX GRADE_BY_STUDENT ON GRADE_REPORT (Student_number)")
        plan_after = plan(conn, q_as_written_1)
        assert plan(conn, q_as_written_2) == plan_after != plan_before            # 색인이 생기자 계획을 바꿨다
        assert plan_after[0].startswith("SCAN S") and "USING INDEX GRADE_BY_STUDENT" in plan_after[1], plan_after
        assert sorted(conn.execute(q_as_written_1).fetchall()) == answers_before  # 답은 같다
        # 단순한 질의도 마찬가지: 훑기 -> 색인 찾기
        assert plan(conn, good)[0].startswith("SCAN")
        fall08 = sorted(conn.execute(good).fetchall())
        conn.execute("CREATE INDEX SECTION_SEM_YEAR ON SECTION (Semester, Year)")
        after = plan(conn, good)[0]
        assert after.startswith("SEARCH") and "INDEX SECTION_SEM_YEAR" in after, after
        assert sorted(conn.execute(good).fetchall()) == fall08 == [(112,), (119,), (135,)]

        # ---- 4. 미리 컴파일해 둔 트랜잭션: 값만 바꿔 넣는다 ----
        canned = ("SELECT SE.Course_number, G.Grade FROM GRADE_REPORT G, SECTION SE "
                  "WHERE G.Student_number = ? AND G.Section_identifier = SE.Section_identifier "
                  "ORDER BY SE.Section_identifier")
        assert conn.execute(canned, (17,)).fetchall() == [("MATH2410", "B"), ("CS1310", "C")]
        assert conn.execute(canned, (8,)).fetchall() == [("MATH2410", "A"), ("CS1310", "A"), ("CS3320", "B"), ("CS3380", "A")]
        assert conn.execute(canned, (99,)).fetchall() == []

        # ---- 5. 실행 시간 처리기 + 트랜잭션 관리 ----
        before = conn.execute("SELECT * FROM GRADE_REPORT ORDER BY rowid").fetchall()
        conn.execute("BEGIN")
        conn.execute("UPDATE GRADE_REPORT SET Grade = 'F'")
        assert conn.execute("SELECT COUNT(*) FROM GRADE_REPORT WHERE Grade = 'F'").fetchone()[0] == 6
        conn.execute("ROLLBACK")
        assert conn.execute("SELECT * FROM GRADE_REPORT ORDER BY rowid").fetchall() == before

        # ---- 6. 저장 데이터 관리자: 페이지 단위의 저장 ----
        page_size = conn.execute("PRAGMA page_size").fetchone()[0]
        page_count = conn.execute("PRAGMA page_count").fetchone()[0]
        assert os.path.getsize(path) == page_size * page_count
        everything = conn.execute("SELECT type, name, rootpage FROM sqlite_master ORDER BY rootpage").fetchall()
        root_pages = [r[2] for r in everything]
        assert len(everything) == 7 and len(set(root_pages)) == 7                 # 표 5개 + 색인 2개
        assert all(2 <= r <= page_count for r in root_pages)                      # 1쪽은 카탈로그 자신이 쓴다
        conn.close()

    print("ALL CHECKS PASSED")
```
{% endraw %}
