---
layout: "note"
title: "05_data-model-categories_verify.py"
display_title: "05_data-model-categories_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/data-model-categories/"
parent_title: "데이터 모델의 종류"
description: "데이터베이스 설계 · 데이터 모델의 종류 검증 코드"
permalink: "/studies/database-design/code/05_data-model-categories_verify/"
---
{% raw %}
[데이터 모델의 종류](/Hongs_Blog/studies/database-design/data-model-categories/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데이터 모델의 종류 문서의 값 확인.

문서: 05.데이터 모델의 종류
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.3~5, 2-1 p.5, p.9
주장: 같은 사실("학생이 과목을 듣는다")을 세 가지 데이터 모델의 말로 적어도 내용은 같다.
  1. 개념적 모델의 말: 개체 학생 2개, 개체 과목 4개, 둘을 잇는 관계 take_course 6개.
  2. 표현적 모델의 말(표): p.5의 표에서 "누가 어느 과목을 들었나"를 뽑으면 위의 6쌍과 같다.
     표 형태는 DBMS(SQLite)에 그대로 만들어 넣을 수 있다.
  3. 물리적 모델의 말(레코드 형식): STUDENT 레코드를 p.9의 자리표(1, 31, 35, 36 / 30, 4, 1, 4)대로 39바이트에
     채워 넣고 다시 끊어 읽으면 표의 행과 같다.
  4. 접근 경로(색인)를 달아도 표에 묻는 질문의 답은 같다.
실행: python3 05_data-model-categories_verify.py
"""
import sqlite3
import struct

ROWS = {
    "STUDENT": [("Smith", 17, 1, "CS"), ("Brown", 8, 2, "CS")],
    "COURSE": [("Intro to Computer Science", "CS1310", 4, "CS"), ("Data Structures", "CS3320", 4, "CS"),
               ("Discrete Mathematics", "MATH2410", 3, "MATH"), ("Database", "CS3380", 3, "CS")],
    "SECTION": [(85, "MATH2410", "Fall", "07", "King"), (92, "CS1310", "Fall", "07", "Anderson"),
                (102, "CS3320", "Spring", "08", "Knuth"), (112, "MATH2410", "Fall", "08", "Chang"),
                (119, "CS1310", "Fall", "08", "Anderson"), (135, "CS3380", "Fall", "08", "Stone")],
    "GRADE_REPORT": [(17, 112, "B"), (17, 119, "C"), (8, 85, "A"), (8, 92, "A"), (8, 102, "B"), (8, 135, "A")],
}

DDL = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER, Class INTEGER, Major TEXT);
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT, Credit_hours INTEGER, Department TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER, Course_number TEXT, Semester TEXT, Year TEXT, Instructor TEXT);
CREATE TABLE GRADE_REPORT (Student_number INTEGER, Section_identifier INTEGER, Grade TEXT);
"""

# 1. 개념적 모델의 말: 개체와 관계만 적는다(어디에 어떻게 저장할지는 없다).
STUDENT_ENTITIES = {"Smith", "Brown"}
COURSE_ENTITIES = {"Intro to Computer Science", "Data Structures", "Discrete Mathematics", "Database"}
TAKE_COURSE = {("Smith", "Discrete Mathematics"), ("Smith", "Intro to Computer Science"),
               ("Brown", "Discrete Mathematics"), ("Brown", "Intro to Computer Science"),
               ("Brown", "Data Structures"), ("Brown", "Database")}

# 3. 물리적 모델의 말: p.9의 저장 형식. 30바이트 + 4바이트 + 1바이트 + 4바이트
RECORD_FORMAT = "30s4s1s4s"
P9_TABLE = [("Name", 1, 30), ("Student_number", 31, 4), ("Class", 35, 1), ("Major", 36, 4)]


def pack_student(row):
    return struct.pack(RECORD_FORMAT, *(str(v).ljust(n).encode("ascii") for v, (_, _, n) in zip(row, P9_TABLE)))


def unpack_student(record):
    name, number, cls, major = (b.decode("ascii").strip() for b in struct.unpack(RECORD_FORMAT, record))
    return (name, int(number), int(cls), major)


if __name__ == "__main__":
    # 2. 표현적 모델: 표로 만들어 DBMS에 그대로 올린다.
    conn = sqlite3.connect(":memory:")
    conn.executescript(DDL)
    for table, rows in ROWS.items():
        conn.executemany(f"INSERT INTO {table} VALUES ({', '.join('?' * len(rows[0]))})", rows)
    assert {r[0] for r in conn.execute("SELECT Name FROM STUDENT")} == STUDENT_ENTITIES
    assert {r[0] for r in conn.execute("SELECT Course_name FROM COURSE")} == COURSE_ENTITIES
    ask = """SELECT S.Name, C.Course_name
             FROM STUDENT S, GRADE_REPORT G, SECTION SE, COURSE C
             WHERE S.Student_number = G.Student_number
               AND G.Section_identifier = SE.Section_identifier
               AND SE.Course_number = C.Course_number"""
    pairs = conn.execute(ask).fetchall()
    assert len(pairs) == 6 and set(pairs) == TAKE_COURSE

    # 3. 물리적 모델: 자리표의 시작 자리는 앞 칸 길이의 합 + 1이고, 레코드는 39바이트다.
    assert struct.calcsize(RECORD_FORMAT) == 39
    start = 1
    for _, s, n in P9_TABLE:
        assert s == start
        start += n
    assert start - 1 == 39
    stored_file = b"".join(pack_student(r) for r in ROWS["STUDENT"])
    assert len(stored_file) == 78
    assert stored_file[0:5] == b"Smith" and stored_file[30:32] == b"17" and stored_file[34:35] == b"1"
    read_back = [unpack_student(stored_file[i:i + 39]) for i in range(0, len(stored_file), 39)]
    assert read_back == ROWS["STUDENT"] == conn.execute("SELECT * FROM STUDENT").fetchall()

    # 4. 접근 경로를 더해도 답은 같다(물리적 모델의 일이라 표를 쓰는 사람에게는 보이지 않는다).
    conn.execute("CREATE INDEX GRADE_BY_STUDENT ON GRADE_REPORT (Student_number)")
    assert set(conn.execute(ask).fetchall()) == TAKE_COURSE

    print("ALL CHECKS PASSED")
```
{% endraw %}
