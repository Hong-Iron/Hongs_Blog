---
layout: "note"
title: "53_library-ddl-practice_p2.sql"
display_title: "53_library-ddl-practice_p2.sql"
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
permalink: "/studies/database-design/code/53_library-ddl-practice_p2-sql/"
---
{% raw %}
[LIBRARY 스키마 DDL 연습](/Hongs_Blog/studies/database-design/library-ddl-practice/) 문서의 문제 2 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 53.LIBRARY 스키마 DDL 연습 p2를 PostgreSQL 16에서 돌린다.
--   풀이 슬라이드(10-11-SQL-Solutions p.17~20)에 적힌 그대로는 세 군데에서 멈춘다.
--     1. BOOK을 PUBLISHER보다 먼저 만든다 -> 아직 없는 표를 가리킨다 (42P01). SQLite는 이것을 받는다
--     2. BOOK_COPIES와 BOOK_LOANS: REFERENCES 줄 끝에 쉼표가 있고 동작이 다음 줄에 있다 -> 구문 오류 (42601)
--     3. ON DELETE REJECT -> 구문 오류 (42601)
--   고친 DDL로 일곱 표를 만들고 예시 행으로 동작을 확인한다. 23503 = 외래 키 위반(거부)
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS library_ddl_practice CASCADE;
CREATE SCHEMA library_ddl_practice;
SET search_path TO library_ddl_practice;
-- 문장을 돌려 보고 SQLSTATE(오류 번호)를 돌려준다. 오류가 없으면 'OK'. 오류가 나면 그 문장이 한 일은 되돌려진다.
CREATE FUNCTION err_of(stmt TEXT) RETURNS TEXT LANGUAGE plpgsql AS $f$
BEGIN
  BEGIN
    EXECUTE stmt;
  EXCEPTION WHEN OTHERS THEN
    RETURN SQLSTATE;
  END;
  RETURN 'OK';
END $f$;

-- 1. 슬라이드 순서대로 BOOK부터
DO $$ BEGIN
  ASSERT err_of($q$CREATE TABLE BOOK (
      Book_id CHAR(15) NOT NULL, Title VARCHAR(100) NOT NULL, Publisher_name VARCHAR(50),
      PRIMARY KEY (Book_id),
      FOREIGN KEY (Publisher_name) REFERENCES PUBLISHER(Name) ON UPDATE CASCADE)$q$) = '42P01', 'PUBLISHER가 아직 없다';
END $$;

-- 가리킴 받는 표부터 만든다
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

-- 2. 슬라이드 p.18의 BOOK_COPIES: 쉼표가 동작 앞에 있다
DO $$ BEGIN
  ASSERT err_of($q$CREATE TABLE BOOK_COPIES (
      Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, No_of_copies INT NOT NULL,
      PRIMARY KEY (Book_id, Branch_id),
      FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id),
        ON DELETE CASCADE ON UPDATE CASCADE
      FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id)
        ON DELETE CASCADE ON UPDATE CASCADE)$q$) = '42601', '쉼표 자리 때문에 구문 오류여야 한다';
END $$;
CREATE TABLE BOOK_COPIES (
  Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, No_of_copies INT NOT NULL,
  PRIMARY KEY (Book_id, Branch_id),
  FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id) ON DELETE CASCADE ON UPDATE CASCADE);

-- 3. 슬라이드 p.19의 BOOK_LOANS: 쉼표를 바로잡아도 ON DELETE REJECT에서 멈춘다
DO $$ BEGIN
  ASSERT err_of($q$CREATE TABLE BOOK_LOANS (
      Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, Card_no INT NOT NULL, Date_out DATE NOT NULL, Due_date DATE NOT NULL,
      PRIMARY KEY (Book_id, Branch_id, Card_no),
      FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON UPDATE CASCADE ON DELETE REJECT,
      FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (Card_no) REFERENCES BORROWER(Card_no) ON UPDATE CASCADE ON DELETE REJECT)$q$) = '42601', 'REJECT는 SQL 낱말이 아니다';
END $$;
CREATE TABLE BOOK_LOANS (
  Book_id CHAR(15) NOT NULL, Branch_id INT NOT NULL, Card_no INT NOT NULL, Date_out DATE NOT NULL, Due_date DATE NOT NULL,
  PRIMARY KEY (Book_id, Branch_id, Card_no),
  FOREIGN KEY (Book_id) REFERENCES BOOK(Book_id) ON UPDATE CASCADE,
  FOREIGN KEY (Branch_id) REFERENCES LIBRARY_BRANCH(Branch_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Card_no) REFERENCES BORROWER(Card_no) ON UPDATE CASCADE);

-- 연습 2의 답과 맞는지: 외래 키 일곱 개의 (ON DELETE, ON UPDATE). a = 아무 동작 없음(거부), c = CASCADE
DO $$ BEGIN
  ASSERT (SELECT ARRAY_AGG(conrelid::regclass::TEXT || '>' || confrelid::regclass::TEXT || ':' || confdeltype::TEXT || confupdtype::TEXT
                           ORDER BY conrelid::regclass::TEXT, confrelid::regclass::TEXT)
          FROM pg_constraint WHERE connamespace = 'library_ddl_practice'::regnamespace AND contype = 'f')
         = ARRAY['book>publisher:ac', 'book_authors>book:cc', 'book_copies>book:cc', 'book_copies>library_branch:cc',
                 'book_loans>book:ac', 'book_loans>borrower:ac', 'book_loans>library_branch:cc'], '외래 키 일곱 개의 동작';
END $$;

-- 예시 행 (슬라이드에는 행이 없다)
INSERT INTO PUBLISHER VALUES ('Pearson', 'New Jersey', '111'), ('MIT Press', 'Massachusetts', '222');
INSERT INTO LIBRARY_BRANCH VALUES (1, 'Central', 'Seoul'), (2, 'East', 'Seoul');
INSERT INTO BORROWER VALUES (100, 'Kim', 'Seoul', '010'), (200, 'Lee', 'Seoul', '011');
INSERT INTO BOOK VALUES ('B1', 'Fundamentals of Database Systems', 'Pearson'), ('B2', 'Introduction to Algorithms', 'MIT Press');
INSERT INTO BOOK_AUTHORS VALUES ('B1', 'Elmasri'), ('B1', 'Navathe'), ('B2', 'Cormen'), ('B2', 'Leiserson'), ('B2', 'Rivest'), ('B2', 'Stein');
INSERT INTO BOOK_COPIES VALUES ('B1', 1, 3), ('B1', 2, 1), ('B2', 1, 2);
INSERT INTO BOOK_LOANS VALUES ('B1', 1, 100, '2024-11-01', '2024-11-15'), ('B2', 1, 200, '2024-11-03', '2024-11-17');

DO $$ BEGIN
  -- 지울 때 거부하는 셋
  ASSERT err_of($q$DELETE FROM PUBLISHER WHERE Name = 'Pearson'$q$) = '23503', '낸 책이 남아 있는 출판사';
  ASSERT err_of($q$DELETE FROM BOOK WHERE Book_id = 'B1'$q$) = '23503', '빌려 간 사람이 있는 책';
  ASSERT err_of($q$DELETE FROM BORROWER WHERE Card_no = 100$q$) = '23503', '안 돌려준 책이 있는 회원';
END $$;

BEGIN;   -- 고칠 때는 모두 따라 고친다
UPDATE PUBLISHER SET Name = 'Pearson Education' WHERE Name = 'Pearson';
UPDATE BOOK SET Book_id = 'B9' WHERE Book_id = 'B1';
UPDATE LIBRARY_BRANCH SET Branch_id = 7 WHERE Branch_id = 1;
UPDATE BORROWER SET Card_no = 101 WHERE Card_no = 100;
DO $$ BEGIN
  ASSERT (SELECT Publisher_name FROM BOOK WHERE Book_id = 'B9') = 'Pearson Education', '출판사 이름이 따라 바뀐다';
  ASSERT (SELECT COUNT(*) FROM BOOK_AUTHORS WHERE Book_id = 'B9') = 2 AND (SELECT COUNT(*) FROM BOOK_COPIES WHERE Book_id = 'B9') = 2
         AND (SELECT COUNT(*) FROM BOOK_LOANS WHERE Book_id = 'B9') = 1, '책 번호가 세 표에 따라 바뀐다';
  ASSERT (SELECT COUNT(*) FROM BOOK_COPIES WHERE Branch_id = 7) = 2 AND (SELECT COUNT(*) FROM BOOK_LOANS WHERE Branch_id = 7) = 2, '지점 번호가 따라 바뀐다';
  ASSERT (SELECT Card_no FROM BOOK_LOANS WHERE Book_id = 'B9') = 101, '회원 번호가 따라 바뀐다';
END $$;
ROLLBACK;

BEGIN;   -- 책을 지우면 저자와 보유 권수가 함께 지워진다
DELETE FROM BOOK_LOANS WHERE Book_id = 'B1';
DELETE FROM BOOK WHERE Book_id = 'B1';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM BOOK_AUTHORS) = 4 AND (SELECT COUNT(*) FROM BOOK_COPIES) = 1, '저자 2행과 보유 권수 2행이 함께 사라진다';
END $$;
ROLLBACK;

BEGIN;   -- 지점을 닫으면 보유 권수와 대출이 함께 지워진다
DELETE FROM LIBRARY_BRANCH WHERE Branch_id = 1;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM BOOK_COPIES) = 1 AND (SELECT COUNT(*) FROM BOOK_LOANS) = 0, '그 지점의 보유 권수 2행과 대출 2행이 함께 사라진다';
END $$;
ROLLBACK;

DROP SCHEMA library_ddl_practice CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
