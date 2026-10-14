---
layout: "note"
title: "37_foreign-key-practice_p2.py"
display_title: "37_foreign-key-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/foreign-key-practice/"
parent_title: "외래 키 찾기 연습"
description: "데이터베이스 설계 · 외래 키 찾기 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/37_foreign-key-practice_p2/"
---
{% raw %}
[외래 키 찾기 연습](/Hongs_Blog/studies/database-design/foreign-key-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외래 키 찾기 연습 문제 2 (수강과 교재 데이터베이스) 검증.

문서: 37.외래 키 찾기 연습 p2
출처: 데이터베이스 설계 6-2 슬라이드 p.27 (문제), 7 풀이 슬라이드 p.2 (답)
실행: python3 37_foreign-key-practice_p2.py   (표준 라이브러리 sqlite3만 쓴다)
스키마: STUDENT(Ssn, Name, Major, Bdate), COURSE(Course#, Cname, Dept), ENROLL(Ssn, Course#, Quarter, Grade),
        BOOK_ADOPTION(Course#, Quarter, Book_isbn), TEXT(Book_isbn, Book_title, Publisher, Author).
        기본 키는 Ssn / Course# / (Ssn, Course#, Quarter) / (Course#, Quarter) / Book_isbn.
확인하는 것:
  1. "다른 릴레이션의 기본 키 속성을 모두 가진 릴레이션"을 기계적으로 찾으면 후보가 5개 나온다.
     그중 4개가 슬라이드의 답이다. 남는 하나는 ENROLL(Course#, Quarter) → BOOK_ADOPTION이다.
  2. 답 4개로 표를 만들면 없는 학생·과목의 수강, 없는 과목·교재의 채택은 들어가지 않는다. (행은 지어낸 것)
  3. 남는 후보를 외래 키로 걸지 않았으므로, 교재를 채택하지 않은 학기의 수강도 들어간다.
     그 후보까지 걸면 같은 수강이 거부된다. 문제는 "수강하려면 그 학기에 교재가 채택돼 있어야 한다"고 말하지 않았다.
  4. Dept, Major, Publisher, Author는 가리킬 릴레이션이 없어 외래 키가 아니다.
"""
import sqlite3

SCHEMA = {
    "STUDENT": (["Ssn", "Name", "Major", "Bdate"], ["Ssn"]),
    "COURSE": (["Course#", "Cname", "Dept"], ["Course#"]),
    "ENROLL": (["Ssn", "Course#", "Quarter", "Grade"], ["Ssn", "Course#", "Quarter"]),
    "BOOK_ADOPTION": (["Course#", "Quarter", "Book_isbn"], ["Course#", "Quarter"]),
    "TEXT": (["Book_isbn", "Book_title", "Publisher", "Author"], ["Book_isbn"]),
}
ANSWER = {("ENROLL", ("Ssn",), "STUDENT"), ("ENROLL", ("Course#",), "COURSE"),
          ("BOOK_ADOPTION", ("Course#",), "COURSE"), ("BOOK_ADOPTION", ("Book_isbn",), "TEXT")}      # 풀이 슬라이드 p.2

DDL = """
  CREATE TABLE STUDENT (Ssn CHAR(9) NOT NULL, Name VARCHAR(20), Major VARCHAR(10), Bdate DATE, PRIMARY KEY (Ssn));
  CREATE TABLE COURSE ("Course#" VARCHAR(8) NOT NULL, Cname VARCHAR(30), Dept VARCHAR(10), PRIMARY KEY ("Course#"));
  CREATE TABLE TEXT (Book_isbn VARCHAR(13) NOT NULL, Book_title VARCHAR(40), Publisher VARCHAR(20), Author VARCHAR(20),
    PRIMARY KEY (Book_isbn));
  CREATE TABLE BOOK_ADOPTION ("Course#" VARCHAR(8) NOT NULL, Quarter VARCHAR(6) NOT NULL, Book_isbn VARCHAR(13),
    PRIMARY KEY ("Course#", Quarter),
    FOREIGN KEY ("Course#") REFERENCES COURSE("Course#"), FOREIGN KEY (Book_isbn) REFERENCES TEXT(Book_isbn));
  CREATE TABLE ENROLL (Ssn CHAR(9) NOT NULL, "Course#" VARCHAR(8) NOT NULL, Quarter VARCHAR(6) NOT NULL, Grade CHAR,
    PRIMARY KEY (Ssn, "Course#", Quarter),
    FOREIGN KEY (Ssn) REFERENCES STUDENT(Ssn), FOREIGN KEY ("Course#") REFERENCES COURSE("Course#") {extra});
  INSERT INTO STUDENT VALUES ('111111111', 'Kim', 'CS', '2003-05-01');
  INSERT INTO COURSE VALUES ('CS3380', 'Database', 'CS'), ('CS3320', 'Data Structures', 'CS');
  INSERT INTO TEXT VALUES ('9780133970777', 'Fundamentals of Database Systems', 'Pearson', 'Elmasri');
  INSERT INTO BOOK_ADOPTION VALUES ('CS3380', '2024F', '9780133970777');
  INSERT INTO ENROLL VALUES ('111111111', 'CS3380', '2024F', 'A');
"""
FIFTH = ', FOREIGN KEY ("Course#", Quarter) REFERENCES BOOK_ADOPTION("Course#", Quarter)'


def candidates(schema):
    """R1이 R2(≠ R1)의 기본 키 속성을 모두 가지면 (R1, 그 속성들, R2)를 후보로 낸다. 이름만 본 것이라 뜻으로 걸러야 한다."""
    out = set()
    for r1, (attrs, _) in schema.items():
        for r2, (_, pk) in schema.items():
            if r1 != r2 and set(pk) <= set(attrs):
                out.add((r1, tuple(pk), r2))
    return out


def make(extra=""):
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(DDL.format(extra=extra))
    return c


def rejected(c, sql):
    try:
        c.execute(sql)
    except sqlite3.IntegrityError as e:
        assert "FOREIGN KEY constraint failed" in str(e), str(e)
        return True
    return False


def main():
    cand = candidates(SCHEMA)
    assert len(cand) == 5 and ANSWER <= cand
    assert cand - ANSWER == {("ENROLL", ("Course#", "Quarter"), "BOOK_ADOPTION")}
    print("[OK] 후보 5개 가운데 4개가 슬라이드의 답. 남는 것:", cand - ANSWER)

    c = make()
    assert rejected(c, "INSERT INTO ENROLL VALUES ('999999999', 'CS3380', '2024F', 'B')")           # 없는 학생
    assert rejected(c, "INSERT INTO ENROLL VALUES ('111111111', 'CS9999', '2024F', 'B')")           # 없는 과목
    assert rejected(c, "INSERT INTO BOOK_ADOPTION VALUES ('CS9999', '2024F', '9780133970777')")     # 없는 과목
    assert rejected(c, "INSERT INTO BOOK_ADOPTION VALUES ('CS3320', '2024F', '0000000000000')")     # 없는 교재
    print("[OK] 답 4개의 외래 키가 없는 학생·과목·교재를 막는다")

    q = "INSERT INTO ENROLL VALUES ('111111111', 'CS3320', '2024F', 'B')"       # CS3320은 2024F에 채택한 교재가 없다
    assert not rejected(c, q)
    assert rejected(make(FIFTH), q)
    print("[OK] 교재 없는 학기의 수강: 답 4개로는 들어가고, 다섯째 후보까지 걸면 거부된다")

    pk_attrs = {a for _, pk in SCHEMA.values() for a in pk}
    assert not {"Dept", "Major", "Publisher", "Author"} & pk_attrs
    print("[OK] Dept, Major, Publisher, Author를 기본 키로 가진 릴레이션이 없다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
