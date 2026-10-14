---
layout: "note"
title: "02_database-approach-characteristics_verify.py"
display_title: "02_database-approach-characteristics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/database-approach-characteristics/"
parent_title: "데이터베이스 방식의 네 가지 특징"
description: "데이터베이스 설계 · 데이터베이스 방식의 네 가지 특징 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/02_database-approach-characteristics_verify/"
---
{% raw %}
[데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데이터베이스 방식의 네 가지 특징 문서의 값 확인.

문서: 02.데이터베이스 방식의 네 가지 특징
출처: 데이터베이스 설계 2주차 슬라이드 2-1 p.5, p.8~11
주장:
  1. (자기 기술) 표 다섯 개를 정의하면 DBMS의 카탈로그에서 p.8의 RELATIONS(표 이름, 열 수)와
     COLUMNS(열 이름, 자료형, 속한 표)를 그대로 꺼낼 수 있다.
  2. (프로그램과 데이터의 분리) p.9 자리표의 시작 자리 1, 31, 35, 36은 길이 30, 4, 1, 4를 차례로 더한 값이고
     레코드 하나는 39글자다. 자리 번호를 코드에 박아 둔 프로그램은 레코드 끝에 생일 8글자가 붙으면
     둘째 학생부터 틀리게 읽는다. 자리표를 보고 읽는 프로그램과 DBMS에 이름으로 묻는 프로그램은 그대로 맞다.
  3. (여러 뷰) p.10의 TRANSCRIPT 6줄과 COURSE_PREREQUISITES 3줄은 p.5의 저장된 표에서 뽑아낸 것이다.
     뷰는 행을 따로 저장하지 않아서 바탕 표에 행을 넣으면 뷰에도 바로 보인다.
  4. (공유) 두 창구가 남은 자리 1개를 각자 읽고 각자 예약하면 한 자리에 2명이 예약된다.
     DBMS의 트랜잭션으로 묶으면 둘째 창구는 막혔다가 0을 읽고 예약하지 못한다.
  5. p.8 카탈로그의 Course_name Character(10)에는 p.5의 과목 이름 넷 중 셋이 들어가지 않는다.
실행: python3 02_database-approach-characteristics_verify.py
SQLite를 DBMS의 한 예로 썼다. 생일 값과 항공편 KE001은 확인용으로 만든 값이다(슬라이드에 없다).
"""
import os
import sqlite3
import tempfile

# p.8의 COLUMNS 표에 보이는 자료형은 그대로 적었다(Character (30) -> CHARACTER(30)).
# 점선으로 생략된 열의 자료형은 확인용으로 정한 것이다.
DDL = """
CREATE TABLE STUDENT (Name CHARACTER(30), Student_number CHARACTER(4), Class INTEGER(1), Major Major_type);
CREATE TABLE COURSE (Course_name CHARACTER(10), Course_number XXXXNNNN, Credit_hours INTEGER(1), Department CHARACTER(4));
CREATE TABLE SECTION (Section_identifier INTEGER(3), Course_number XXXXNNNN, Semester CHARACTER(6), Year CHARACTER(2), Instructor CHARACTER(10));
CREATE TABLE GRADE_REPORT (Student_number CHARACTER(4), Section_identifier INTEGER(3), Grade CHARACTER(1));
CREATE TABLE PREREQUISITE (Course_number XXXXNNNN, Prerequisite_number XXXXNNNN);
"""

ROWS = {
    "STUDENT": [("Smith", "17", 1, "CS"), ("Brown", "8", 2, "CS")],
    "COURSE": [("Intro to Computer Science", "CS1310", 4, "CS"), ("Data Structures", "CS3320", 4, "CS"),
               ("Discrete Mathematics", "MATH2410", 3, "MATH"), ("Database", "CS3380", 3, "CS")],
    "SECTION": [(85, "MATH2410", "Fall", "07", "King"), (92, "CS1310", "Fall", "07", "Anderson"),
                (102, "CS3320", "Spring", "08", "Knuth"), (112, "MATH2410", "Fall", "08", "Chang"),
                (119, "CS1310", "Fall", "08", "Anderson"), (135, "CS3380", "Fall", "08", "Stone")],
    "GRADE_REPORT": [("17", 112, "B"), ("17", 119, "C"), ("8", 85, "A"), ("8", 92, "A"), ("8", 102, "B"), ("8", 135, "A")],
    "PREREQUISITE": [("CS3380", "CS3320"), ("CS3380", "MATH2410"), ("CS3320", "CS1310")],
}

VIEWS = """
CREATE VIEW TRANSCRIPT AS
  SELECT S.Name AS Student_name, SE.Course_number, G.Grade, SE.Semester, SE.Year, SE.Section_identifier AS Section_id
  FROM STUDENT S, GRADE_REPORT G, SECTION SE
  WHERE S.Student_number = G.Student_number AND G.Section_identifier = SE.Section_identifier;
CREATE VIEW COURSE_PREREQUISITES AS
  SELECT C.Course_name, C.Course_number, P.Prerequisite_number AS Prerequisites
  FROM COURSE C, PREREQUISITE P
  WHERE C.Course_number = P.Course_number;
"""


def build_university(conn):
    conn.executescript(DDL)
    for table, rows in ROWS.items():
        marks = ", ".join("?" * len(rows[0]))
        conn.executemany(f"INSERT INTO {table} VALUES ({marks})", rows)
    conn.commit()


# ---------- 2. 파일을 직접 읽는 프로그램 ----------
V1 = [("Name", 30), ("Student_number", 4), ("Class", 1), ("Major", 4)]           # p.9의 자리표
V2 = V1 + [("Date_of_birth", 8)]                                                  # 생일 칸을 덧붙인 뒤


def layout(fields):
    """[(이름, 시작 자리(1부터), 길이)]. 시작 자리는 앞 칸들의 길이를 더한 것 + 1."""
    out, start = [], 1
    for name, length in fields:
        out.append((name, start, length))
        start += length
    return out


def write_file(fields, records):
    """레코드마다 칸을 정해진 길이로 채워(빈 곳은 공백) 한 줄로 이어 붙인다."""
    return "".join("".join(str(v).ljust(n) for v, (_, n) in zip(rec, fields)) for rec in records)


def program_hardcoded(data):
    """자리 번호를 코드에 박아 둔 프로그램: 39글자씩 끊고 1~30, 31~34, 35, 36~39를 읽는다."""
    out = []
    for i in range(0, len(data), 39):
        rec = data[i:i + 39]
        out.append((rec[0:30].strip(), rec[30:34].strip(), rec[34:35].strip(), rec[35:39].strip()))
    return out


def program_with_catalog(data, catalog, wanted=("Name", "Student_number", "Class", "Major")):
    """자리표(카탈로그)를 먼저 읽고, 거기 적힌 대로 끊어 읽는 프로그램."""
    lay = {name: (start, length) for name, start, length in layout(catalog)}
    size = sum(length for _, length in catalog)
    out = []
    for i in range(0, len(data), size):
        rec = data[i:i + size]
        out.append(tuple(rec[lay[w][0] - 1: lay[w][0] - 1 + lay[w][1]].strip() for w in wanted))
    return out


# ---------- 4. 두 창구의 예약 ----------
def book_without_control(path):
    """각자 읽고(둘 다 1을 본다) 각자 쓴다. 문장 하나하나는 따로 처리된다."""
    a = sqlite3.connect(path, isolation_level=None)
    b = sqlite3.connect(path, isolation_level=None)
    seen_a = a.execute("SELECT Seats_left FROM FLIGHT WHERE Flight_no = 'KE001'").fetchone()[0]
    seen_b = b.execute("SELECT Seats_left FROM FLIGHT WHERE Flight_no = 'KE001'").fetchone()[0]
    for conn, seen, who in ((a, seen_a, "A"), (b, seen_b, "B")):
        if seen > 0:
            conn.execute("UPDATE FLIGHT SET Seats_left = ? WHERE Flight_no = 'KE001'", (seen - 1,))
            conn.execute("INSERT INTO RESERVATION VALUES ('KE001', ?)", (who,))
    result = (a.execute("SELECT Seats_left FROM FLIGHT").fetchone()[0],
              [r[0] for r in a.execute("SELECT Clerk FROM RESERVATION ORDER BY rowid")])
    a.close()
    b.close()
    return (seen_a, seen_b) + result


def book_in_transaction(conn, who):
    """읽기부터 쓰기까지를 한 트랜잭션으로 묶는다. 다른 창구가 쓰는 중이면 "막힘"을 돌려준다."""
    try:
        conn.execute("BEGIN IMMEDIATE")
    except sqlite3.OperationalError as e:
        assert "locked" in str(e), e
        return "막힘"
    seen = conn.execute("SELECT Seats_left FROM FLIGHT WHERE Flight_no = 'KE001'").fetchone()[0]
    if seen > 0:
        conn.execute("UPDATE FLIGHT SET Seats_left = ? WHERE Flight_no = 'KE001'", (seen - 1,))
        conn.execute("INSERT INTO RESERVATION VALUES ('KE001', ?)", (who,))
        return "예약함"          # 아직 COMMIT 전
    conn.execute("ROLLBACK")
    return "자리 없음"


def new_flight_db(path):
    c = sqlite3.connect(path)
    c.executescript("""CREATE TABLE FLIGHT (Flight_no TEXT, Seats_left INTEGER);
                       CREATE TABLE RESERVATION (Flight_no TEXT, Clerk TEXT);
                       INSERT INTO FLIGHT VALUES ('KE001', 1);""")
    c.commit()
    c.close()


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    build_university(conn)

    # ---- 1. 자기 기술: 카탈로그에서 p.8의 두 표를 꺼낸다 ----
    relations = conn.execute(
        """SELECT m.name, (SELECT COUNT(*) FROM pragma_table_info(m.name))
           FROM sqlite_master m WHERE m.type = 'table' ORDER BY m.rowid""").fetchall()
    assert relations == [("STUDENT", 4), ("COURSE", 4), ("SECTION", 5), ("GRADE_REPORT", 3), ("PREREQUISITE", 2)]
    columns = conn.execute(
        """SELECT p.name, p.type, m.name
           FROM sqlite_master m, pragma_table_info(m.name) p
           WHERE m.type = 'table' ORDER BY m.rowid, p.cid""").fetchall()
    assert len(columns) == 18
    # p.8 COLUMNS 표에 보이는 일곱 줄
    assert columns[:6] == [("Name", "CHARACTER(30)", "STUDENT"), ("Student_number", "CHARACTER(4)", "STUDENT"),
                           ("Class", "INTEGER(1)", "STUDENT"), ("Major", "Major_type", "STUDENT"),
                           ("Course_name", "CHARACTER(10)", "COURSE"), ("Course_number", "XXXXNNNN", "COURSE")]
    assert columns[-1] == ("Prerequisite_number", "XXXXNNNN", "PREREQUISITE")
    # 카탈로그도 데이터와 같은 방법(질의)으로 읽는다. 표를 하나 더 만들면 카탈로그에 한 줄이 늘어난다.
    conn.execute("CREATE TABLE DEPARTMENT (Dept_code CHARACTER(4), Office CHARACTER(10))")
    assert conn.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table'").fetchone()[0] == 6
    conn.execute("DROP TABLE DEPARTMENT")

    # ---- 5. 카탈로그와 상태가 어긋나는 곳 ----
    names = [r[0] for r in conn.execute("SELECT Course_name FROM COURSE ORDER BY rowid")]
    assert [len(n) for n in names] == [25, 15, 20, 8]
    assert [n for n in names if len(n) <= 10] == ["Database"]
    # SQLite는 Character(10)이라는 길이를 적어만 두고 검사하지 않아서 네 이름이 모두 들어갔다.
    letters = {r[0]: sum(ch.isalpha() for ch in r[0]) for r in conn.execute("SELECT Course_number FROM COURSE")}
    assert letters == {"CS1310": 2, "CS3320": 2, "MATH2410": 4, "CS3380": 2}   # 글자 넷 + 숫자 넷은 MATH2410뿐

    # ---- 2. 프로그램과 데이터의 분리 ----
    assert layout(V1) == [("Name", 1, 30), ("Student_number", 31, 4), ("Class", 35, 1), ("Major", 36, 4)]   # p.9
    assert sum(n for _, n in V1) == 39 and sum(n for _, n in V2) == 47
    students = [("Smith", "17", "1", "CS"), ("Brown", "8", "2", "CS")]
    file_v1 = write_file(V1, students)
    assert len(file_v1) == 78
    assert program_hardcoded(file_v1) == students
    assert program_with_catalog(file_v1, V1) == students
    # 레코드 끝에 생일 8글자를 붙인다(값은 만든 것).
    file_v2 = write_file(V2, [s + (b,) for s, b in zip(students, ("20050314", "20040927"))])
    assert len(file_v2) == 94
    broken = program_hardcoded(file_v2)
    assert broken == [("Smith", "17", "1", "CS"),
                      ("20050314Brown", "", "", "8"),
                      ("2CS  20040927", "", "", "")], broken
    assert program_with_catalog(file_v2, V2) == students            # 자리표만 새것으로 바꾸면 프로그램은 그대로
    # DBMS에 이름으로 묻는 프로그램: 열을 더해도 요청 문장과 결과가 같다.
    ask = "SELECT Name, Student_number, Class, Major FROM STUDENT ORDER BY rowid"
    before = conn.execute(ask).fetchall()
    conn.execute("ALTER TABLE STUDENT ADD COLUMN Date_of_birth CHARACTER(8)")
    assert conn.execute(ask).fetchall() == before == [("Smith", "17", 1, "CS"), ("Brown", "8", 2, "CS")]
    assert conn.execute("SELECT COUNT(*) FROM pragma_table_info('STUDENT')").fetchone()[0] == 5

    # ---- 3. 여러 뷰 ----
    conn.executescript(VIEWS)
    transcript = conn.execute("SELECT * FROM TRANSCRIPT").fetchall()
    figure_p10 = [("Smith", "CS1310", "C", "Fall", "08", 119), ("Smith", "MATH2410", "B", "Fall", "08", 112),
                  ("Brown", "MATH2410", "A", "Fall", "07", 85), ("Brown", "CS1310", "A", "Fall", "07", 92),
                  ("Brown", "CS3320", "B", "Spring", "08", 102), ("Brown", "CS3380", "A", "Fall", "08", 135)]
    assert sorted(transcript) == sorted(figure_p10) and len(transcript) == 6
    prereq = conn.execute("SELECT * FROM COURSE_PREREQUISITES").fetchall()
    assert sorted(prereq) == sorted([("Database", "CS3380", "CS3320"), ("Database", "CS3380", "MATH2410"),
                                     ("Data Structures", "CS3320", "CS1310")])
    # 뷰는 정의(문장)만 카탈로그에 있고 행은 따로 저장되지 않는다. 바탕 표가 바뀌면 뷰도 바뀐다.
    kinds = dict(conn.execute("SELECT name, type FROM sqlite_master WHERE name IN ('TRANSCRIPT', 'STUDENT')"))
    assert kinds == {"TRANSCRIPT": "view", "STUDENT": "table"}
    conn.execute("INSERT INTO GRADE_REPORT VALUES ('17', 135, 'A')")
    assert conn.execute("SELECT COUNT(*) FROM TRANSCRIPT").fetchone()[0] == 7
    assert ("Smith", "CS3380", "A", "Fall", "08", 135) in conn.execute("SELECT * FROM TRANSCRIPT").fetchall()

    # ---- 4. 공유와 동시성 제어 ----
    with tempfile.TemporaryDirectory() as d:
        p1 = os.path.join(d, "no_control.db")
        new_flight_db(p1)
        assert book_without_control(p1) == (1, 1, 0, ["A", "B"])     # 둘 다 1을 봤고, 한 자리에 두 명

        p2 = os.path.join(d, "with_control.db")
        new_flight_db(p2)
        a = sqlite3.connect(p2, timeout=0, isolation_level=None)
        b = sqlite3.connect(p2, timeout=0, isolation_level=None)
        assert book_in_transaction(a, "A") == "예약함"
        assert book_in_transaction(b, "B") == "막힘"                 # A가 끝내기 전에는 들어오지 못한다
        a.execute("COMMIT")
        assert book_in_transaction(b, "B") == "자리 없음"            # 다시 와서 0을 읽는다
        assert a.execute("SELECT Seats_left FROM FLIGHT").fetchone()[0] == 0
        assert [r[0] for r in a.execute("SELECT Clerk FROM RESERVATION")] == ["A"]
        a.close()
        b.close()

    print("ALL CHECKS PASSED")
```
{% endraw %}
