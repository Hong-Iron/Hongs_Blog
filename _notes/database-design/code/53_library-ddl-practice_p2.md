---
layout: "note"
title: "53_library-ddl-practice_p2.py"
display_title: "53_library-ddl-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "53"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/library-ddl-practice/"
parent_title: "LIBRARY 스키마 DDL 연습"
description: "데이터베이스 설계 · LIBRARY 스키마 DDL 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/53_library-ddl-practice_p2/"
---
{% raw %}
[LIBRARY 스키마 DDL 연습](/Hongs_Blog/studies/database-design/library-ddl-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 53.LIBRARY 스키마 DDL 연습 p2 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 53_library-ddl-practice_p2.py)
# 문제: p1(외래 키 일곱 개의 참조 동작 고르기)과 p2(DDL 쓰기).
# 문서의 답대로 표 일곱 개를 만들고, 작은 예시 행을 넣어 동작을 하나씩 확인한다.
# 틀리기 쉬운 곳: 가리키는 표를 먼저 만든다, 쉼표를 동작 뒤로 옮긴다, ON DELETE REJECT는 쓰지 않는다(안 적으면 거부다).
# 틀리기 쉬운 판이 왜 안 도는지는 PostgreSQL에서 확인했다(53_library-ddl-practice_p2.sql).
import sqlite3

LIBRARY_DDL = """
CREATE TABLE PUBLISHER (
  Name VARCHAR(50) NOT NULL, Address VARCHAR(50), Phone VARCHAR(15),
  PRIMARY KEY (Name));
CREATE TABLE LIBRARY_BRANCH (
  Branch_id INT NOT NULL, Branch_name VARCHAR(50), Address VARCHAR(50),
  PRIMARY KEY (Branch_id));
CREATE TABLE BORROWER (
  Card_no INT NOT NULL, Name VARCHAR(50) NOT NULL, Address VARCHAR(50), Phone VARCHAR(15),
  PRIMARY KEY (Card_no));
CREATE TABLE BOOK (
  Book_id CHAR(15) NOT NULL, Title VARCHAR(100) NOT NULL, Publisher_name VARCHAR(50),
  PRIMARY KEY (Book_id),
  FOREIGN KEY (Publisher_name) REFERENCES PUBLISHER(Name) ON UPDATE CASCADE);
CREATE TABLE BOOK_AUTHORS (
  Book_id CHAR(15) NOT NULL, Author_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (Book_id, Author_name),
  FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE TABLE BOOK_COPIES (
  Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, No_of_copies INT NOT NULL,
  PRIMARY KEY (Book_id, Branch_id),
  FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE TABLE BOOK_LOANS (
  Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, Card_no INT NOT NULL, Date_out DATE NOT NULL, Due_date DATE NOT NULL,
  PRIMARY KEY (Book_id, Branch_id, Card_no),
  FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Card_no) REFERENCES BORROWER(Card_no) ON UPDATE CASCADE);
"""
# 예시 행 (동작을 보려고 만든 것이다)
ROWS = """
INSERT INTO PUBLISHER VALUES ('Pearson', 'New Jersey', '111'), ('MIT Press', 'Massachusetts', '222');
INSERT INTO LIBRARY_BRANCH VALUES (1, 'Central', 'Seoul'), (2, 'East', 'Seoul');
INSERT INTO BORROWER VALUES (100, 'Kim', 'Seoul', '010'), (200, 'Lee', 'Seoul', '011');
INSERT INTO BOOK VALUES ('B1', 'Fundamentals of Database Systems', 'Pearson'), ('B2', 'Introduction to Algorithms', 'MIT Press');
INSERT INTO BOOK_AUTHORS VALUES ('B1', 'Elmasri'), ('B1', 'Navathe'), ('B2', 'Cormen'), ('B2', 'Leiserson'), ('B2', 'Rivest'), ('B2', 'Stein');
INSERT INTO BOOK_COPIES VALUES ('B1', 1, 3), ('B1', 2, 1), ('B2', 1, 2);
INSERT INTO BOOK_LOANS VALUES ('B1', 1, 100, '2024-11-01', '2024-11-15'), ('B2', 1, 200, '2024-11-03', '2024-11-17');
"""
FKERR = 'FOREIGN KEY constraint failed'


def make():
    c = sqlite3.connect(':memory:', isolation_level=None)
    c.execute('PRAGMA foreign_keys = ON')
    c.executescript(LIBRARY_DDL)
    c.executescript(ROWS)
    return c


def rows(c, sql, args=()):
    return c.execute(sql, args).fetchall()


def error_of(c, sql):
    c.execute('SAVEPOINT try_it')
    try:
        c.execute(sql)
        return None
    except sqlite3.Error as e:
        return str(e)
    finally:
        c.execute('ROLLBACK TO try_it')
        c.execute('RELEASE try_it')


def counts(c):
    return tuple(rows(c, 'SELECT COUNT(*) FROM %s' % t)[0][0]
                 for t in ('BOOK', 'BOOK_AUTHORS', 'PUBLISHER', 'BOOK_COPIES', 'BOOK_LOANS', 'LIBRARY_BRANCH', 'BORROWER'))


if __name__ == "__main__":
    c = make()
    assert counts(c) == (2, 6, 2, 3, 2, 2, 2)

    # 연습 2의 답: (가리키는 표.열, 가리킴 받는 표) -> (ON DELETE, ON UPDATE). 안 적은 것은 NO ACTION(거부)이다
    actions = {}
    for t in ('BOOK', 'BOOK_AUTHORS', 'BOOK_COPIES', 'BOOK_LOANS'):
        for fk in rows(c, 'PRAGMA foreign_key_list(%s)' % t):
            actions[(t + '.' + fk[3], fk[2])] = (fk[6], fk[5])
    assert actions == {
        ('BOOK_AUTHORS.Book_id', 'BOOK'): ('CASCADE', 'CASCADE'),
        ('BOOK.Publisher_name', 'PUBLISHER'): ('NO ACTION', 'CASCADE'),
        ('BOOK_COPIES.Book_id', 'BOOK'): ('CASCADE', 'CASCADE'),
        ('BOOK_COPIES.Branch_id', 'LIBRARY_BRANCH'): ('CASCADE', 'CASCADE'),
        ('BOOK_LOANS.Book_id', 'BOOK'): ('NO ACTION', 'CASCADE'),
        ('BOOK_LOANS.Branch_id', 'LIBRARY_BRANCH'): ('CASCADE', 'CASCADE'),
        ('BOOK_LOANS.Card_no', 'BORROWER'): ('NO ACTION', 'CASCADE')}
    assert len(actions) == 7

    # --- 지울 때 거부하는 셋
    assert error_of(c, "DELETE FROM PUBLISHER WHERE Name = 'Pearson'") == FKERR        # 낸 책이 남아 있는 출판사
    assert error_of(c, "DELETE FROM BOOK WHERE Book_id = 'B1'") == FKERR               # 빌려 간 사람이 있는 책
    assert error_of(c, "DELETE FROM BORROWER WHERE Card_no = 100") == FKERR            # 안 돌려준 책이 있는 회원

    # --- 고칠 때는 일곱 개 모두 따라 고친다
    c = make()
    c.execute("UPDATE PUBLISHER SET Name = 'Pearson Education' WHERE Name = 'Pearson'")
    assert rows(c, "SELECT Publisher_name FROM BOOK WHERE Book_id = 'B1'") == [('Pearson Education',)]
    c.execute("UPDATE BOOK SET Book_id = 'B9' WHERE Book_id = 'B1'")
    assert rows(c, "SELECT COUNT(*) FROM BOOK_AUTHORS WHERE Book_id = 'B9'") == [(2,)]
    assert rows(c, "SELECT COUNT(*) FROM BOOK_COPIES WHERE Book_id = 'B9'") == [(2,)]
    assert rows(c, "SELECT COUNT(*) FROM BOOK_LOANS WHERE Book_id = 'B9'") == [(1,)]
    c.execute("UPDATE LIBRARY_BRANCH SET Branch_id = 7 WHERE Branch_id = 1")
    assert rows(c, "SELECT COUNT(*) FROM BOOK_COPIES WHERE Branch_id = 7") == [(2,)]
    assert rows(c, "SELECT COUNT(*) FROM BOOK_LOANS WHERE Branch_id = 7") == [(2,)]
    c.execute("UPDATE BORROWER SET Card_no = 101 WHERE Card_no = 100")
    assert rows(c, "SELECT Card_no FROM BOOK_LOANS WHERE Book_id = 'B9'") == [(101,)]
    assert counts(c) == (2, 6, 2, 3, 2, 2, 2)                                          # 행 수는 하나도 안 바뀐다

    # --- 지울 때 함께 지우는 넷
    c = make()
    c.execute("DELETE FROM BOOK_LOANS WHERE Book_id = 'B1'")                           # B1이 반납된 뒤
    c.execute("DELETE FROM BOOK WHERE Book_id = 'B1'")                                 # 책을 지우면
    assert counts(c) == (1, 4, 2, 1, 1, 2, 2)                                          # 저자 2행과 보유 권수 2행이 함께 사라진다
    c = make()
    c.execute("DELETE FROM LIBRARY_BRANCH WHERE Branch_id = 1")                        # 지점을 닫으면
    assert counts(c) == (2, 6, 2, 1, 0, 1, 2)                                          # 그 지점의 보유 권수 2행과 대출 2행이 함께 사라진다

    # --- ON DELETE REJECT는 SQL이 아니다. 같은 뜻으로 받는 낱말은 RESTRICT와 NO ACTION이다
    k = sqlite3.connect(':memory:', isolation_level=None)
    k.execute("CREATE TABLE BORROWER (Card_no INT NOT NULL, PRIMARY KEY (Card_no))")
    for word, ok in (('REJECT', False), ('RESTRICT', True), ('NO ACTION', True)):
        try:
            k.execute("CREATE TABLE L_%s (Card_no INT, FOREIGN KEY (Card_no) REFERENCES BORROWER(Card_no) ON DELETE %s)" % (word.replace(' ', '_'), word))
            got = True
        except sqlite3.OperationalError:
            got = False
        assert got == ok, word

    # --- 변형: BOOK.Publisher_name을 ON DELETE SET NULL로 바꾸면 출판사를 지울 수 있고 책은 남는다
    c = sqlite3.connect(':memory:', isolation_level=None)
    c.execute('PRAGMA foreign_keys = ON')
    c.executescript(LIBRARY_DDL.replace('REFERENCES PUBLISHER(Name) ON UPDATE CASCADE', 'REFERENCES PUBLISHER(Name) ON DELETE SET NULL ON UPDATE CASCADE'))
    c.executescript(ROWS)
    c.execute("DELETE FROM PUBLISHER WHERE Name = 'Pearson'")
    assert rows(c, "SELECT Book_id, Publisher_name FROM BOOK ORDER BY Book_id") == [('B1', None), ('B2', 'MIT Press')]

    print('ALL CHECKS PASSED')
```
{% endraw %}
