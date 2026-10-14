---
layout: "note"
title: "70_complex-retrieval-practice_p2.sql"
display_title: "70_complex-retrieval-practice_p2.sql"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/complex-retrieval-practice/"
parent_title: "복잡한 검색 연습"
description: "데이터베이스 설계 · 복잡한 검색 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/70_complex-retrieval-practice_p2-sql/"
---
{% raw %}
[복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/) 문서의 문제 2 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 70.복잡한 검색 연습 p2: 12주차 슬라이드 p.16~17, 풀이 p.3~6 (UNIVERSITY)
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS complex_retrieval_practice_p2 CASCADE;
CREATE SCHEMA complex_retrieval_practice_p2;
SET search_path TO complex_retrieval_practice_p2;

-- UNIVERSITY 스키마와 상태 (Elmasri 그림 1.2, 슬라이드 12 p.16~17).
CREATE TABLE STUDENT (Name VARCHAR(20) NOT NULL, Student_number INT NOT NULL, Class INT, Major VARCHAR(4),
  PRIMARY KEY (Student_number));
CREATE TABLE COURSE (Course_name VARCHAR(30), Course_number VARCHAR(8) NOT NULL, Credit_hours INT, Department VARCHAR(4),
  PRIMARY KEY (Course_number));
CREATE TABLE SECTION (Section_identifier INT NOT NULL, Course_number VARCHAR(8), Semester VARCHAR(6), Year CHAR(2),
  Instructor VARCHAR(10), PRIMARY KEY (Section_identifier),
  FOREIGN KEY (Course_number) REFERENCES COURSE(Course_number));
CREATE TABLE GRADE_REPORT (Student_number INT NOT NULL, Section_identifier INT NOT NULL, Grade CHAR,
  PRIMARY KEY (Student_number, Section_identifier),
  FOREIGN KEY (Student_number) REFERENCES STUDENT(Student_number),
  FOREIGN KEY (Section_identifier) REFERENCES SECTION(Section_identifier));
CREATE TABLE PREREQUISITE (Course_number VARCHAR(8) NOT NULL, Prerequisite_number VARCHAR(8) NOT NULL,
  PRIMARY KEY (Course_number, Prerequisite_number));
INSERT INTO STUDENT VALUES ('Smith',17,1,'CS'),('Brown',8,2,'CS');
INSERT INTO COURSE VALUES ('Intro to Computer Science','CS1310',4,'CS'),('Data Structures','CS3320',4,'CS'),
 ('Discrete Mathematics','MATH2410',3,'MATH'),('Database','CS3380',3,'CS');
INSERT INTO SECTION VALUES (85,'MATH2410','Fall','07','King'),(92,'CS1310','Fall','07','Anderson'),
 (102,'CS3320','Spring','08','Knuth'),(112,'MATH2410','Fall','08','Chang'),(119,'CS1310','Fall','08','Anderson'),
 (135,'CS3380','Fall','08','Stone');
INSERT INTO GRADE_REPORT VALUES (17,112,'B'),(17,119,'C'),(8,85,'A'),(8,92,'A'),(8,102,'B'),(8,135,'A');
INSERT INTO PREREQUISITE VALUES ('CS3380','CS3320'),('CS3380','MATH2410'),('CS3320','CS1310');

-- 풀이에 적힌 NOT EXIST (S가 빠짐)는 구문 오류다
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Name, Major FROM STUDENT AS S
                WHERE NOT EXIST (SELECT * FROM GRADE_REPORT AS G
                                 WHERE G.Student_number = S.Student_number AND G.Grade <> 'A') $q$;
  EXCEPTION WHEN syntax_error THEN ok := true;
  END;
  ASSERT ok, 'NOT EXIST가 구문 오류를 내지 않았다';
END $$;

-- Q2-1 (모두 A): 두 판 모두 0행. Q2-2 (A가 없음): 두 판 모두 Smith
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM STUDENT AS S
          WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                            WHERE G.Student_number = S.Student_number AND G.Grade <> 'A')) = 0, 'Q2-1 NOT EXISTS 판이 0행이 아니다';
  ASSERT (SELECT COUNT(*) FROM (
            SELECT Name, Major FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
            GROUP BY S.Student_number, S.Name
            HAVING SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END) = 0) t) = 0, 'Q2-1 조인과 묶기 판이 0행이 아니다';
  ASSERT (SELECT string_agg(Name || ':' || Major, ',') FROM STUDENT AS S
          WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                            WHERE G.Student_number = S.Student_number AND G.Grade = 'A')) = 'Smith:CS', 'Q2-2 NOT EXISTS 판이 Smith가 아니다';
  ASSERT (SELECT string_agg(Name || ':' || Major, ',') FROM (
            SELECT Name, Major FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
            GROUP BY S.Student_number, S.Name
            HAVING SUM(CASE WHEN G.Grade = 'A' THEN 1 ELSE 0 END) = 0) t) = 'Smith:CS', 'Q2-2 조인과 묶기 판이 Smith가 아니다';
END $$;

-- 조인과 묶기 판은 SELECT에 Major가 있는데 묶는 열에는 없다.
-- PostgreSQL은 Student_number가 STUDENT의 기본 키로 선언돼 있을 때만 받는다. 기본 키가 없는 사본에서는 오류다
CREATE TABLE STUDENT_NOKEY AS SELECT * FROM STUDENT;
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Name, Major FROM STUDENT_NOKEY AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
                GROUP BY S.Student_number, S.Name
                HAVING SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END) = 0 $q$;
  EXCEPTION WHEN grouping_error THEN ok := true;
  END;
  ASSERT ok, '기본 키가 없는 표에서 Major가 오류를 내지 않았다';
  -- 묶는 속성에 Major를 더하면 기본 키가 없어도 돈다
  ASSERT (SELECT COUNT(*) FROM (
            SELECT Name, Major FROM STUDENT_NOKEY AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
            GROUP BY S.Student_number, S.Name, S.Major
            HAVING SUM(CASE WHEN G.Grade = 'A' THEN 1 ELSE 0 END) = 0) t) = 1, 'Major를 더한 판이 1행이 아니다';
END $$;

-- 성적이 하나도 없는 학생 Kim: NOT EXISTS 판만 Kim을 뽑는다 (공허한 참)
INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS');
DO $$ BEGIN
  ASSERT (SELECT string_agg(Name, ',') FROM STUDENT AS S
          WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                            WHERE G.Student_number = S.Student_number AND G.Grade <> 'A')) = 'Kim', 'NOT EXISTS 판이 Kim을 뽑지 않았다';
  ASSERT (SELECT COUNT(*) FROM (
            SELECT Name, Major FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
            GROUP BY S.Student_number, S.Name
            HAVING SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END) = 0) t) = 0, '조인과 묶기 판이 0행이 아니다';
  ASSERT (SELECT COUNT(*) FROM STUDENT AS S
          WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                            WHERE G.Student_number = S.Student_number AND G.Grade <> 'A')
            AND EXISTS (SELECT * FROM GRADE_REPORT AS G WHERE G.Student_number = S.Student_number)) = 0,
         'EXISTS를 더한 판이 0행이 아니다';
END $$;

-- 성적이 모두 A인 학생 Lee
INSERT INTO STUDENT VALUES ('Lee', 30, 3, 'MATH');
INSERT INTO GRADE_REPORT VALUES (30, 85, 'A'), (30, 135, 'A');
DO $$ BEGIN
  ASSERT (SELECT string_agg(Name, ',' ORDER BY Name) FROM STUDENT AS S
          WHERE NOT EXISTS (SELECT * FROM GRADE_REPORT AS G
                            WHERE G.Student_number = S.Student_number AND G.Grade <> 'A')) = 'Kim,Lee', 'NOT EXISTS 판이 Kim, Lee가 아니다';
  ASSERT (SELECT string_agg(Name, ',') FROM (
            SELECT Name, Major FROM STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
            GROUP BY S.Student_number, S.Name
            HAVING SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END) = 0) t) = 'Lee', '조인과 묶기 판이 Lee가 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
