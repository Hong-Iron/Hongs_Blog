---
layout: "note"
title: "07_three-schema-architecture_verify.py"
display_title: "07_three-schema-architecture_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/three-schema-architecture/"
parent_title: "3단계 스키마 구조"
description: "데이터베이스 설계 · 3단계 스키마 구조 검증 코드"
permalink: "/studies/database-design/code/07_three-schema-architecture_verify/"
---
{% raw %}
[3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""3단계 스키마 구조 문서의 값 확인.

문서: 07.3단계 스키마 구조
출처: 데이터베이스 설계 2주차 슬라이드 2-2 p.9~14 (p.14의 대학 예)
주장:
  1. p.14 내부 스키마의 오프셋 0, 4, 8, 18, 20, 22, 27은 앞 칸들의 길이 4, 4, 10, 2, 2, 5, 44를 차례로 더한 값이고
     레코드 길이는 71바이트다.
  2. 두 외부 스키마는 개념 스키마의 여섯 칸 가운데 네 칸씩만 본다. Dept-A는 YEAR와 ADDRESS를,
     Dept-B는 GRADE와 DEPT를 못 본다. 두 쪽을 합치면 여섯 칸이 모두 나온다.
  3. 세 단계에서 같은 칸의 길이가 맞는다(CHAR(10) = PIC X(10) = BYTE(10) 등).
  4. 외부 스키마의 이름으로 한 요청을 두 번 옮기면(외부 -> 개념 -> 내부) 저장 레코드의 몇 번째 바이트를
     읽을지 정해진다. 그렇게 읽은 값은 DBMS(SQLite)의 뷰가 내놓는 값과 같다.
  5. 데이터는 한 벌이다. 바탕 표의 값을 고치면 두 외부 뷰가 모두 고친 값을 보여 준다.
실행: python3 07_three-schema-architecture_verify.py
학생 세 명의 값은 확인용으로 만든 것이다(슬라이드 p.14에는 스키마만 있고 행이 없다).
"""
import sqlite3
import struct

# ---------- p.14의 세 단계 ----------
EXTERNAL_1 = [("SN", "INT"), ("NAME", "CHAR(10)"), ("GRADE", "INT"), ("DEPT", "CHAR(5)")]                 # Dept-A의 ST
EXTERNAL_2 = [("SNO", "PIC 9(4)"), ("SNAME", "PIC X(10)"), ("YEAR", "PIC 9(2)"), ("ADDR", "PIC X(44)")]   # Dept-B의 STUDENT
CONCEPTUAL = [("SNUMBER", "INTEGER"), ("NAME", "CHAR(10)"), ("YEAR", "SMALLINT"),
              ("GRADE", "SMALLINT"), ("DEPT", "CHAR(5)"), ("ADDRESS", "CHAR(44)")]                         # STUDENT
INTERNAL = [("prefix", 4, 0), ("SNO", 4, 4), ("SNAME", 10, 8), ("SYEAR", 2, 18),
            ("SGRADE", 2, 20), ("SDEPT", 5, 22), ("SADDR", 44, 27)]                                         # STORED-STUDENT
STORED_LENGTH = 71

# ---------- 사상: 이름을 옮겨 적는 표 ----------
EXT1_TO_CONCEPTUAL = {"SN": "SNUMBER", "NAME": "NAME", "GRADE": "GRADE", "DEPT": "DEPT"}
EXT2_TO_CONCEPTUAL = {"SNO": "SNUMBER", "SNAME": "NAME", "YEAR": "YEAR", "ADDR": "ADDRESS"}
CONCEPTUAL_TO_INTERNAL = {"SNUMBER": "SNO", "NAME": "SNAME", "YEAR": "SYEAR",
                          "GRADE": "SGRADE", "DEPT": "SDEPT", "ADDRESS": "SADDR"}

# 확인용 학생 (SNUMBER, NAME, YEAR, GRADE, DEPT, ADDRESS)
STUDENTS = [(1001, "Kim", 1, 3, "CS", "Seoul"), (1002, "Lee", 2, 4, "MATH", "Busan"), (1003, "Park", 4, 2, "CS", "Daegu")]

RECORD_FORMAT = "<4si10shh5s44s"      # prefix 4, SNO 4(정수), SNAME 10, SYEAR 2(정수), SGRADE 2(정수), SDEPT 5, SADDR 44


def store(rows):
    """내부 단계: 레코드를 71바이트씩 이어 붙인 저장 파일과, 학번으로 레코드 위치를 찾는 색인 STINDX."""
    data, stindx = b"", {}
    for pos, (snumber, name, year, grade, dept, address) in enumerate(rows):
        stindx[snumber] = pos * STORED_LENGTH
        data += struct.pack(RECORD_FORMAT, b"\x00" * 4, snumber, name.encode().ljust(10),
                            year, grade, dept.encode().ljust(5), address.encode().ljust(44))
    return data, stindx


def read_field(data, record_start, stored_name):
    """내부 스키마가 적어 둔 오프셋과 길이대로 바이트를 읽어 값으로 바꾼다."""
    _, length, offset = next(f for f in INTERNAL if f[0] == stored_name)
    raw = data[record_start + offset: record_start + offset + length]
    if stored_name in ("SNO", "SYEAR", "SGRADE"):
        return int.from_bytes(raw, "little")
    return raw.decode().strip()


def answer(data, stindx, ext_to_conceptual, key_value, wanted):
    """외부 스키마의 이름으로 온 요청 "키가 key_value인 학생의 wanted 칸"을 두 번 옮겨 처리한다.
    돌려주는 것: (거친 이름들, 읽은 오프셋과 길이, 값)"""
    conceptual_name = ext_to_conceptual[wanted]                    # 외부/개념 사상
    stored_name = CONCEPTUAL_TO_INTERNAL[conceptual_name]          # 개념/내부 사상
    _, length, offset = next(f for f in INTERNAL if f[0] == stored_name)
    record_start = stindx[key_value]                               # 색인으로 레코드 위치를 찾는다
    value = read_field(data, record_start, stored_name)
    return (wanted, conceptual_name, stored_name), (offset, length), value


if __name__ == "__main__":
    # 1. 오프셋은 길이를 차례로 더한 값, 전체 71바이트
    running = 0
    for name, length, offset in INTERNAL:
        assert offset == running, (name, offset, running)
        running += length
    assert running == STORED_LENGTH == 71 == 4 + 4 + 10 + 2 + 2 + 5 + 44
    assert struct.calcsize(RECORD_FORMAT) == 71

    # 2. 외부 스키마는 개념 스키마의 일부만 본다
    conceptual_names = [n for n, _ in CONCEPTUAL]
    seen_1 = [EXT1_TO_CONCEPTUAL[n] for n, _ in EXTERNAL_1]
    seen_2 = [EXT2_TO_CONCEPTUAL[n] for n, _ in EXTERNAL_2]
    assert len(conceptual_names) == 6 and len(seen_1) == 4 and len(seen_2) == 4
    assert set(conceptual_names) - set(seen_1) == {"YEAR", "ADDRESS"}
    assert set(conceptual_names) - set(seen_2) == {"GRADE", "DEPT"}
    assert set(seen_1) | set(seen_2) == set(conceptual_names)
    assert set(seen_1) & set(seen_2) == {"SNUMBER", "NAME"}
    assert sorted(CONCEPTUAL_TO_INTERNAL) == sorted(conceptual_names)
    assert sorted(CONCEPTUAL_TO_INTERNAL.values()) == sorted(n for n, _, _ in INTERNAL if n != "prefix")

    # 3. 세 단계에서 길이가 맞는다
    stored_len = {n: length for n, length, _ in INTERNAL}
    declared = dict(CONCEPTUAL)
    for cname, sname in CONCEPTUAL_TO_INTERNAL.items():
        t = declared[cname]
        if t.startswith("CHAR("):
            assert int(t[5:-1]) == stored_len[sname], (cname, sname)       # CHAR(n) = BYTE(n)
    assert stored_len["SNO"] == 4 and stored_len["SYEAR"] == 2 and stored_len["SGRADE"] == 2
    pic = dict(EXTERNAL_2)                                                 # PIC X(n), PIC 9(n)의 n도 같다
    for ext_name, t in pic.items():
        n = int(t[t.index("(") + 1:-1])
        assert n == stored_len[CONCEPTUAL_TO_INTERNAL[EXT2_TO_CONCEPTUAL[ext_name]]], ext_name
    assert dict(EXTERNAL_1)["NAME"] == declared["NAME"] and dict(EXTERNAL_1)["DEPT"] == declared["DEPT"]

    # 4. 요청을 두 번 옮겨 저장 레코드를 읽는다
    data, stindx = store(STUDENTS)
    assert len(data) == 3 * 71 == 213 and stindx == {1001: 0, 1002: 71, 1003: 142}
    # Dept-A의 요청: SN이 1002인 학생의 GRADE
    path, where, value = answer(data, stindx, EXT1_TO_CONCEPTUAL, 1002, "GRADE")
    assert path == ("GRADE", "GRADE", "SGRADE") and where == (20, 2) and value == 4
    # 카드 C2: Dept-B의 요청: SNO가 1002인 학생의 ADDR
    path, where, value = answer(data, stindx, EXT2_TO_CONCEPTUAL, 1002, "ADDR")
    assert path == ("ADDR", "ADDRESS", "SADDR") and where == (27, 44) and value == "Busan"
    assert 27 + 44 == 71                                                   # 주소가 레코드의 마지막 칸이다
    # 키 자체도 옮겨진다: SN -> SNUMBER -> SNO (오프셋 4, 길이 4)
    assert answer(data, stindx, EXT1_TO_CONCEPTUAL, 1003, "SN")[:2] == (("SN", "SNUMBER", "SNO"), (4, 4))

    # 같은 일을 DBMS에 맡긴다: 개념 스키마 = 표, 외부 스키마 = 뷰
    conn = sqlite3.connect(":memory:")
    conn.executescript("""
        CREATE TABLE STUDENT (SNUMBER INTEGER, NAME CHAR(10), YEAR SMALLINT, GRADE SMALLINT, DEPT CHAR(5), ADDRESS CHAR(44));
        CREATE VIEW ST AS SELECT SNUMBER AS SN, NAME, GRADE, DEPT FROM STUDENT;                             -- Dept-A
        CREATE VIEW STUDENT_B AS SELECT SNUMBER AS SNO, NAME AS SNAME, YEAR, ADDRESS AS ADDR FROM STUDENT;  -- Dept-B
    """)
    conn.executemany("INSERT INTO STUDENT VALUES (?, ?, ?, ?, ?, ?)", STUDENTS)
    for snumber, name, year, grade, dept, address in STUDENTS:
        row_a = conn.execute("SELECT SN, NAME, GRADE, DEPT FROM ST WHERE SN = ?", (snumber,)).fetchone()
        row_b = conn.execute("SELECT SNO, SNAME, YEAR, ADDR FROM STUDENT_B WHERE SNO = ?", (snumber,)).fetchone()
        assert row_a == tuple(answer(data, stindx, EXT1_TO_CONCEPTUAL, snumber, c)[2] for c in ("SN", "NAME", "GRADE", "DEPT"))
        assert row_b == tuple(answer(data, stindx, EXT2_TO_CONCEPTUAL, snumber, c)[2] for c in ("SNO", "SNAME", "YEAR", "ADDR"))
    assert [d[0] for d in conn.execute("SELECT * FROM ST").description] == [n for n, _ in EXTERNAL_1]
    assert [d[0] for d in conn.execute("SELECT * FROM STUDENT_B").description] == [n for n, _ in EXTERNAL_2]

    # 5. 데이터는 한 벌이다
    kinds = dict(conn.execute("SELECT name, type FROM sqlite_master"))
    assert kinds == {"STUDENT": "table", "ST": "view", "STUDENT_B": "view"}
    conn.execute("UPDATE STUDENT SET NAME = 'Choi' WHERE SNUMBER = 1002")
    assert conn.execute("SELECT NAME FROM ST WHERE SN = 1002").fetchone()[0] == "Choi"
    assert conn.execute("SELECT SNAME FROM STUDENT_B WHERE SNO = 1002").fetchone()[0] == "Choi"

    print("ALL CHECKS PASSED")
```
{% endraw %}
