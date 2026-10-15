---
layout: "note"
title: "04_dbms-features_verify.py"
display_title: "04_dbms-features_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/dbms-features/"
parent_title: "DBMS의 기능과 쓰지 않을 때"
description: "데이터베이스 설계 · DBMS의 기능과 쓰지 않을 때 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/04_dbms-features_verify/"
---
{% raw %}
[DBMS의 기능과 쓰지 않을 때](/Hongs_Blog/studies/database-design/dbms-features/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""DBMS의 기능과 쓰지 않을 때 문서의 값 확인.

문서: 04.DBMS의 기능과 쓰지 않을 때
출처: Elmasri & Navathe, Fundamentals of Database Systems 1.6절 (UNIVERSITY 예)
주장:
  1. (중복 통제) 문서의 중복이 든 GRADE_REPORT 6행은 UNIVERSITY의 STUDENT, GRADE_REPORT, SECTION을 이은 것과 같다.
     값은 18개에서 30개로 늘고, Smith는 2번 Brown은 4번 적힌다.
  2. 통제하지 않으면 문서의 틀린 행 (17, Brown, 112, MATH2410, B)이 그대로 들어가고 17번 학생의 이름이 둘이 된다.
     "(학번, 이름) 짝은 STUDENT에 있는 짝이어야 한다"를 DBMS가 검사하게 하면 그 행은 거부되고 맞는 행은 들어간다.
  3. (접근 제한) 읽기만 허락된 접속은 찾기는 되고 고치기는 거부된다.
  4. (무결성 제약) 자료형·길이 제약과 "다른 표의 레코드와 이어져야 한다"는 제약을 걸면 어긋난 행이 거부된다.
     SQLite는 Character(30), Integer(1) 같은 자료형 이름을 적어만 두고 검사하지 않으므로 CHECK로 적었다.
  5. (백업과 복구) 백업해 둔 사본으로 고장 난 데이터베이스를 백업 시점의 21행으로 되돌린다.
     백업 뒤에 넣은 행은 사본만으로는 돌아오지 않는다. 끝내지 못한 트랜잭션은 다시 열면 흔적이 없다.
실행: python3 04_dbms-features_verify.py
SQLite를 DBMS의 한 예로 썼다. SQLite에는 사용자 계정이 없어 3번은 "읽기 전용으로 연 접속"으로 흉내 냈다.
"""
import os
import sqlite3
import tempfile

DDL = """
CREATE TABLE STUDENT (Name TEXT, Student_number INTEGER PRIMARY KEY, Class INTEGER, Major TEXT,
                      UNIQUE (Student_number, Name));
CREATE TABLE COURSE (Course_name TEXT, Course_number TEXT PRIMARY KEY, Credit_hours INTEGER, Department TEXT);
CREATE TABLE SECTION (Section_identifier INTEGER PRIMARY KEY, Course_number TEXT, Semester TEXT, Year TEXT,
                      Instructor TEXT, UNIQUE (Section_identifier, Course_number));
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

# 문서의 첫 표: Student_name과 Course_number를 함께 적은 GRADE_REPORT
FIGURE_P20 = [(17, "Smith", 112, "MATH2410", "B"), (17, "Smith", 119, "CS1310", "C"),
              (8, "Brown", 85, "MATH2410", "A"), (8, "Brown", 92, "CS1310", "A"),
              (8, "Brown", 102, "CS3320", "B"), (8, "Brown", 135, "CS3380", "A")]
BAD_ROW = (17, "Brown", 112, "MATH2410", "B")        # 문서의 틀린 행


def build_university(conn):
    conn.executescript(DDL)
    for table, rows in ROWS.items():
        marks = ", ".join("?" * len(rows[0]))
        conn.executemany(f"INSERT INTO {table} VALUES ({marks})", rows)
    conn.commit()


def snapshot(conn):
    """모든 표의 모든 행. 두 데이터베이스의 내용이 같은지 볼 때 쓴다."""
    names = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")]
    return {t: sorted(conn.execute(f"SELECT * FROM {t}").fetchall()) for t in names}


def rejected(conn, sql, args=()):
    """문장이 제약 때문에 거부되면 True."""
    try:
        conn.execute(sql, args)
    except sqlite3.IntegrityError:
        return True
    return False


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    conn.execute("PRAGMA foreign_keys = ON")
    build_university(conn)

    # ---- 1. 문서의 중복 표는 세 표를 이은 것이다 ----
    joined = conn.execute(
        """SELECT G.Student_number, S.Name, G.Section_identifier, SE.Course_number, G.Grade
           FROM GRADE_REPORT G, STUDENT S, SECTION SE
           WHERE G.Student_number = S.Student_number AND G.Section_identifier = SE.Section_identifier
           ORDER BY G.rowid""").fetchall()
    assert joined == FIGURE_P20
    assert len(ROWS["GRADE_REPORT"]) * 3 == 18 and len(FIGURE_P20) * 5 == 30      # 값 12개가 더 든다
    name_counts = {n: sum(1 for r in FIGURE_P20 if r[1] == n) for n in ("Smith", "Brown")}
    assert name_counts == {"Smith": 2, "Brown": 4}

    # ---- 2. 통제하지 않은 중복과 통제한 중복 ----
    conn.execute("""CREATE TABLE GRADE_REPORT_LOOSE (Student_number INTEGER, Student_name TEXT,
                                                    Section_identifier INTEGER, Course_number TEXT, Grade TEXT)""")
    conn.executemany("INSERT INTO GRADE_REPORT_LOOSE VALUES (?, ?, ?, ?, ?)", FIGURE_P20)
    assert not rejected(conn, "INSERT INTO GRADE_REPORT_LOOSE VALUES (?, ?, ?, ?, ?)", BAD_ROW)   # 그대로 들어간다
    two_names = conn.execute(
        "SELECT COUNT(DISTINCT Student_name) FROM GRADE_REPORT_LOOSE WHERE Student_number = 17").fetchone()[0]
    assert two_names == 2                                         # 17번이 Smith이기도 하고 Brown이기도 하다
    mismatch = conn.execute(
        """SELECT R.Student_number, R.Student_name, R.Section_identifier, R.Course_number, R.Grade
           FROM GRADE_REPORT_LOOSE R, STUDENT S
           WHERE R.Student_number = S.Student_number AND R.Student_name <> S.Name""").fetchall()
    assert mismatch == [BAD_ROW]

    conn.execute("""CREATE TABLE GRADE_REPORT_CHECKED (
                        Student_number INTEGER, Student_name TEXT,
                        Section_identifier INTEGER, Course_number TEXT, Grade TEXT,
                        FOREIGN KEY (Student_number, Student_name) REFERENCES STUDENT (Student_number, Name),
                        FOREIGN KEY (Section_identifier, Course_number)
                            REFERENCES SECTION (Section_identifier, Course_number))""")
    conn.executemany("INSERT INTO GRADE_REPORT_CHECKED VALUES (?, ?, ?, ?, ?)", FIGURE_P20)       # 맞는 6행은 들어간다
    assert rejected(conn, "INSERT INTO GRADE_REPORT_CHECKED VALUES (?, ?, ?, ?, ?)", BAD_ROW)     # 틀린 행은 거부
    assert rejected(conn, "INSERT INTO GRADE_REPORT_CHECKED VALUES (17, 'Smith', 112, 'CS1310', 'B')")  # 과목 번호도 검사
    assert conn.execute("SELECT COUNT(*) FROM GRADE_REPORT_CHECKED").fetchone()[0] == 6
    # 중복해 둔 덕에 표 하나만 읽고도 이름과 과목 번호가 나온다.
    one_table = conn.execute(
        "SELECT Student_name, Course_number, Grade FROM GRADE_REPORT_CHECKED WHERE Student_number = 17").fetchall()
    assert one_table == [("Smith", "MATH2410", "B"), ("Smith", "CS1310", "C")]

    # ---- 4. 무결성 제약 ----
    # SQLite는 선언한 자료형 이름을 검사하지 않는다: INTEGER(1) 열에 글자가 들어간다.
    conn.execute("CREATE TABLE T_NAME_ONLY (Name CHARACTER(30), Class INTEGER(1))")
    assert not rejected(conn, "INSERT INTO T_NAME_ONLY VALUES (?, ?)", ("A" * 31, "two"))
    conn.execute("""CREATE TABLE STUDENT_CHECKED (
                        Name TEXT CHECK (length(Name) <= 30),
                        Student_number INTEGER PRIMARY KEY,
                        Class INTEGER CHECK (typeof(Class) = 'integer' AND Class BETWEEN 0 AND 9),
                        Major TEXT)""")
    assert not rejected(conn, "INSERT INTO STUDENT_CHECKED VALUES ('Smith', 17, 1, 'CS')")
    assert rejected(conn, "INSERT INTO STUDENT_CHECKED VALUES (?, 18, 1, 'CS')", ("A" * 31,))    # 31글자 이름
    assert rejected(conn, "INSERT INTO STUDENT_CHECKED VALUES ('Lee', 19, 'two', 'CS')")          # 수가 아닌 학년
    assert rejected(conn, "INSERT INTO STUDENT_CHECKED VALUES ('Park', 20, 12, 'CS')")            # 두 자리 수
    # 다른 표의 레코드와 이어져야 한다: 분반은 있는 과목의 분반이어야 한다.
    conn.execute("""CREATE TABLE SECTION_CHECKED (
                        Section_identifier INTEGER PRIMARY KEY,
                        Course_number TEXT REFERENCES COURSE (Course_number),
                        Semester TEXT, Year TEXT, Instructor TEXT)""")
    assert not rejected(conn, "INSERT INTO SECTION_CHECKED VALUES (145, 'CS3380', 'Spring', '09', 'Stone')")
    assert rejected(conn, "INSERT INTO SECTION_CHECKED VALUES (146, 'CS9999', 'Spring', '09', 'Stone')")   # 없는 과목
    conn.commit()

    with tempfile.TemporaryDirectory() as d:
        # ---- 3. 접근 제한: 읽기 전용 접속 ----
        path = os.path.join(d, "university.db")
        owner = sqlite3.connect(path)
        build_university(owner)
        reader = sqlite3.connect("file:" + path + "?mode=ro", uri=True)
        assert reader.execute("SELECT Grade FROM GRADE_REPORT WHERE Student_number = 17 AND Section_identifier = 112"
                              ).fetchone()[0] == "B"
        try:
            reader.execute("UPDATE GRADE_REPORT SET Grade = 'A' WHERE Student_number = 17")
            raise AssertionError("읽기 전용 접속이 고치는 데 성공했다")
        except sqlite3.OperationalError as e:
            assert "readonly" in str(e), e
        reader.close()
        assert owner.execute("SELECT COUNT(*) FROM GRADE_REPORT WHERE Grade = 'A'").fetchone()[0] == 3

        # ---- 5. 백업과 복구 ----
        original = snapshot(owner)
        assert sum(len(rows) for rows in original.values()) == 21
        backup_path = os.path.join(d, "backup.db")
        copy = sqlite3.connect(backup_path)
        owner.backup(copy)                                             # 평소에 사본을 떠 둔다
        owner.execute("INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS')")   # 백업 뒤에 들어온 행
        owner.commit()
        owner.execute("DELETE FROM GRADE_REPORT")                      # 고장: 성적이 모두 날아갔다
        owner.execute("DROP TABLE PREREQUISITE")
        owner.commit()
        assert snapshot(owner) != original
        copy.backup(owner)                                             # 사본으로 되돌린다
        assert snapshot(owner) == original                             # 백업 시점의 21행
        assert owner.execute("SELECT COUNT(*) FROM STUDENT WHERE Name = 'Kim'").fetchone()[0] == 0   # 백업 뒤 변경은 없다
        copy.close()

        # 끝내지 못한 트랜잭션: 두 줄을 고치던 중에 프로그램이 죽으면, 다시 열었을 때 하나도 안 고쳐져 있다.
        crashing = sqlite3.connect(path, isolation_level=None)
        crashing.execute("BEGIN")
        crashing.execute("UPDATE GRADE_REPORT SET Grade = 'F' WHERE Student_number = 17")
        assert crashing.execute("SELECT COUNT(*) FROM GRADE_REPORT WHERE Grade = 'F'").fetchone()[0] == 2
        crashing.close()                                               # COMMIT 없이 끊김
        assert snapshot(owner) == original
        owner.close()

    print("ALL CHECKS PASSED")
```
{% endraw %}
