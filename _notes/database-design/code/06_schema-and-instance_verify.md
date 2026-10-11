---
layout: "note"
title: "06_schema-and-instance_verify.py"
display_title: "06_schema-and-instance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/schema-and-instance/"
parent_title: "스키마와 인스턴스"
description: "데이터베이스 설계 · 스키마와 인스턴스 검증 코드"
permalink: "/studies/database-design/code/06_schema-and-instance_verify/"
---
{% raw %}
[스키마와 인스턴스](/Hongs_Blog/studies/database-design/schema-and-instance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스키마와 인스턴스 문서의 값 확인.

문서: 06.스키마와 인스턴스
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.6~7 (스키마 다이어그램, Kim 행 추가, Date_of_birth 추가)
주장:
  1. p.6의 스키마 다이어그램은 표 5개의 열 이름 4, 4, 2, 5, 3개(합 18개)다. 행은 하나도 들어 있지 않다.
  2. p.7: STUDENT에 (Kim, 25, 4, CS)를 넣으면 상태는 바뀌고(2행 -> 3행) 스키마는 그대로다.
  3. 넣기, 고치기, 지우기를 한 번 할 때마다 상태가 다른 상태로 바뀐다. 그동안 스키마는 한 번도 안 바뀐다.
  4. p.6: STUDENT에 Date_of_birth 열을 더하면(스키마 진화) 스키마가 바뀐다(4열 -> 5열).
     이미 있던 행은 그대로 남고 새 칸은 비어 있다(NULL).
  5. 카드 C2의 분류: 행을 모두 지워도 스키마는 남고, 표를 없애면 스키마가 바뀐다.
실행: python3 06_schema-and-instance_verify.py
"""
import sqlite3

# p.6 스키마 다이어그램에 그려진 순서
DDL = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER, Class INTEGER, Major TEXT);
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT, Credit_hours INTEGER, Department TEXT);
CREATE TABLE PREREQUISITE (Course_number TEXT, Prerequisite_number TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER, Course_number TEXT, Semester TEXT, Year TEXT, Instructor TEXT);
CREATE TABLE GRADE_REPORT (Student_number INTEGER, Section_identifier INTEGER, Grade TEXT);
"""

SCHEMA_DIAGRAM = {      # p.6
    "STUDENT": ["Name", "Student_number", "Class", "Major"],
    "COURSE": ["Course_name", "Course_number", "Credit_hours", "Department"],
    "PREREQUISITE": ["Course_number", "Prerequisite_number"],
    "SECTION": ["Section_identifier", "Course_number", "Semester", "Year", "Instructor"],
    "GRADE_REPORT": ["Student_number", "Section_identifier", "Grade"],
}

ROWS = {
    "STUDENT": [("Smith", 17, 1, "CS"), ("Brown", 8, 2, "CS")],
    "COURSE": [("Intro to Computer Science", "CS1310", 4, "CS"), ("Data Structures", "CS3320", 4, "CS"),
               ("Discrete Mathematics", "MATH2410", 3, "MATH"), ("Database", "CS3380", 3, "CS")],
    "PREREQUISITE": [("CS3380", "CS3320"), ("CS3380", "MATH2410"), ("CS3320", "CS1310")],
    "SECTION": [(85, "MATH2410", "Fall", "07", "King"), (92, "CS1310", "Fall", "07", "Anderson"),
                (102, "CS3320", "Spring", "08", "Knuth"), (112, "MATH2410", "Fall", "08", "Chang"),
                (119, "CS1310", "Fall", "08", "Anderson"), (135, "CS3380", "Fall", "08", "Stone")],
    "GRADE_REPORT": [(17, 112, "B"), (17, 119, "C"), (8, 85, "A"), (8, 92, "A"), (8, 102, "B"), (8, 135, "A")],
}


def schema(conn):
    """스키마: 표 이름마다 열 이름의 목록. 행은 보지 않는다."""
    names = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY rowid")]
    return {t: [r[1] for r in conn.execute(f"PRAGMA table_info({t})")] for t in names}


def state(conn):
    """상태: 지금 이 순간 모든 표에 들어 있는 행 전부."""
    return {t: conn.execute(f"SELECT * FROM {t} ORDER BY rowid").fetchall() for t in schema(conn)}


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    conn.executescript(DDL)

    # 1. 스키마만 있고 행은 없다(빈 상태).
    assert schema(conn) == SCHEMA_DIAGRAM
    assert [len(c) for c in SCHEMA_DIAGRAM.values()] == [4, 4, 2, 5, 3]
    assert sum(len(c) for c in SCHEMA_DIAGRAM.values()) == 18
    assert all(rows == [] for rows in state(conn).values())

    # 데이터를 채운다. 스키마는 그대로다.
    for table, rows in ROWS.items():
        conn.executemany(f"INSERT INTO {table} VALUES ({', '.join('?' * len(rows[0]))})", rows)
    assert schema(conn) == SCHEMA_DIAGRAM
    assert state(conn) == ROWS

    # 2~3. 넣기, 고치기, 지우기마다 상태가 바뀐다.
    seen_states = [state(conn)]
    changes = [
        "INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')",                 # p.7
        "UPDATE STUDENT SET Class = 2 WHERE Name = 'Smith'",
        "DELETE FROM GRADE_REPORT WHERE Student_number = 17 AND Section_identifier = 119",
    ]
    for sql in changes:
        conn.execute(sql)
        now = state(conn)
        assert now != seen_states[-1]          # 상태는 바뀌었다
        assert schema(conn) == SCHEMA_DIAGRAM  # 스키마는 그대로다
        seen_states.append(now)
    assert len(seen_states) == 4
    assert seen_states[1]["STUDENT"] == [("Smith", 17, 1, "CS"), ("Brown", 8, 2, "CS"), ("Kim", 25, 4, "CS")]
    assert [len(s["STUDENT"]) for s in seen_states] == [2, 3, 3, 3]
    assert [len(s["GRADE_REPORT"]) for s in seen_states] == [6, 6, 6, 5]

    # 4. 스키마 진화: 열을 더한다.
    before_rows = conn.execute("SELECT Name, Student_number, Class, Major FROM STUDENT ORDER BY rowid").fetchall()
    conn.execute("ALTER TABLE STUDENT ADD COLUMN Date_of_birth TEXT")
    assert schema(conn) != SCHEMA_DIAGRAM
    assert schema(conn)["STUDENT"] == ["Name", "Student_number", "Class", "Major", "Date_of_birth"]
    assert {t: c for t, c in schema(conn).items() if t != "STUDENT"} == \
           {t: c for t, c in SCHEMA_DIAGRAM.items() if t != "STUDENT"}
    assert conn.execute("SELECT Name, Student_number, Class, Major FROM STUDENT ORDER BY rowid").fetchall() == before_rows
    assert [r[0] for r in conn.execute("SELECT Date_of_birth FROM STUDENT")] == [None, None, None]

    # 5. 카드 C2: 행을 모두 지우는 것과 표를 없애는 것
    evolved = schema(conn)
    conn.execute("DELETE FROM PREREQUISITE")
    assert schema(conn) == evolved and state(conn)["PREREQUISITE"] == []     # 상태만 바뀜
    conn.execute("DROP TABLE PREREQUISITE")
    assert "PREREQUISITE" not in schema(conn) and len(schema(conn)) == 4     # 스키마가 바뀜

    print("ALL CHECKS PASSED")
```
{% endraw %}
