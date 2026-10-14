---
layout: "note"
title: "77_view-practice_p2.sql"
display_title: "77_view-practice_p2.sql"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-practice/"
parent_title: "뷰 연습"
description: "데이터베이스 설계 · 뷰 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/77_view-practice_p2-sql/"
---
{% raw %}
[뷰 연습](/Hongs_Blog/studies/database-design/view-practice/) 문서의 문제 2 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 뷰 연습의 연습 2 (a~e)를 PostgreSQL 16에서 확인한다. SQLite 판은 77_view-practice_p2.py.
-- 문서: 77.뷰 연습 / 출처: 13주차 슬라이드 13-View p.27~28(문제), p.35~39(풀이)
-- 확인하는 것:
--   2-a~c. 뷰에 던진 질의가 실행되고, 기본 테이블로 풀어 쓴 질의와 답이 같다.
--   2-d. UPDATE DEPT_SUMMARY ... 는 거부된다(GROUP BY가 든 뷰).
--   2-e. DELETE FROM DEPT_SUMMARY WHERE C > 4 는 조건에 맞는 행이 하나도 없는데도 거부된다.
--        슬라이드에 적힌 이름 DEPT_SUMMAR는 없는 표라는 다른 오류가 난다.
--   덧붙임: 2-d를 기본 테이블 수정으로 옮긴 UPDATE EMPLOYEE SET Dno = 3 WHERE Dno = 4는 3번 부서가 없어 외래 키에 걸린다.
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS view_practice_p2 CASCADE;
CREATE SCHEMA view_practice_p2;
SET search_path TO view_practice_p2;

-- COMPANY 스키마와 상태 (슬라이드 6-2 p.21 = 13 p.16, 28). WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다.
-- EMPLOYEE와 DEPARTMENT는 서로 가리키므로 외래 키를 커밋 때 검사한다(DEFERRABLE INITIALLY DEFERRED).
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn));
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname), FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED;
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
BEGIN;
INSERT INTO EMPLOYEE VALUES
 ('John','B','Smith','123456789','1965-01-09','731 Fondren, Houston, TX','M',30000,'333445555',5),
 ('Franklin','T','Wong','333445555','1955-12-08','638 Voss, Houston, TX','M',40000,'888665555',5),
 ('Alicia','J','Zelaya','999887777','1968-01-19','3321 Castle, Spring, TX','F',25000,'987654321',4),
 ('Jennifer','S','Wallace','987654321','1941-06-20','291 Berry, Bellaire, TX','F',43000,'888665555',4),
 ('Ramesh','K','Narayan','666884444','1962-09-15','975 Fire Oak, Humble, TX','M',38000,'333445555',5),
 ('Joyce','A','English','453453453','1972-07-31','5631 Rice, Houston, TX','F',25000,'333445555',5),
 ('Ahmad','V','Jabbar','987987987','1969-03-29','980 Dallas, Houston, TX','M',25000,'987654321',4),
 ('James','E','Borg','888665555','1937-11-10','450 Stone, Houston, TX','M',55000,NULL,1);
INSERT INTO DEPARTMENT VALUES ('Research',5,'333445555','1988-05-22'),('Administration',4,'987654321','1995-01-01'),('Headquarters',1,'888665555','1981-06-19');
INSERT INTO DEPT_LOCATIONS VALUES (1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston');
INSERT INTO PROJECT VALUES ('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4);
INSERT INTO WORKS_ON VALUES ('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),('987654321',20,15.0),('888665555',20,NULL);
INSERT INTO DEPENDENT VALUES ('333445555','Alice','F','1986-04-05','Daughter'),('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse');
COMMIT;

CREATE VIEW DEPT_SUMMARY (D, C, Total_s, Average_s)
AS SELECT Dno, COUNT (*), SUM (Salary), AVG (Salary)
   FROM EMPLOYEE
   GROUP BY Dno;

DO $$ BEGIN
  -- 2-a
  ASSERT (SELECT string_agg(D || '/' || C || '/' || Total_s::int || '/' || Average_s::int, ' ' ORDER BY D DESC) FROM DEPT_SUMMARY)
         = '5/4/133000/33250 4/3/93000/31000 1/1/55000/55000', '2-a';
  ASSERT NOT EXISTS (SELECT * FROM DEPT_SUMMARY EXCEPT SELECT Dno, COUNT(*), SUM(Salary), AVG(Salary) FROM EMPLOYEE GROUP BY Dno), '2-a 풀어 쓴 질의';
  -- 2-b
  ASSERT (SELECT string_agg(D || '/' || C, ' ') FROM DEPT_SUMMARY WHERE TOTAL_S > 100000) = '5/4', '2-b';
  ASSERT (SELECT string_agg(Dno || '/' || n, ' ') FROM (SELECT Dno, COUNT(*) AS n FROM EMPLOYEE GROUP BY Dno HAVING SUM(Salary) > 100000) AS T)
         = '5/4', '2-b 풀어 쓴 질의';
  -- 2-c
  ASSERT (SELECT string_agg(D || '/' || AVERAGE_S::int, ' ') FROM DEPT_SUMMARY WHERE C > (SELECT C FROM DEPT_SUMMARY WHERE D = 4))
         = '5/33250', '2-c';
  ASSERT (SELECT string_agg(Dno || '/' || a::int, ' ') FROM (SELECT Dno, AVG(Salary) AS a FROM EMPLOYEE GROUP BY Dno
          HAVING COUNT(*) > (SELECT COUNT(*) FROM EMPLOYEE WHERE Dno = 4)) AS T) = '5/33250', '2-c 풀어 쓴 질의';
END $$;

-- 2-d, 2-e
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN
    UPDATE DEPT_SUMMARY SET D = 3 WHERE D = 4;
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;      -- "Views containing GROUP BY are not automatically updatable."
  END;
  ASSERT (SELECT COUNT(*) FROM DEPT_SUMMARY WHERE C > 4) = 0, '2-e의 조건에 맞는 행은 없다';
  BEGIN
    DELETE FROM DEPT_SUMMARY WHERE C > 4;
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;
  END;
  BEGIN   -- 슬라이드 p.39에 적힌 그대로(이름 끝의 Y가 빠졌다)
    EXECUTE 'DELETE FROM DEPT_SUMMAR WHERE C > 4';
  EXCEPTION WHEN undefined_table THEN k := k + 1;
  END;
  ASSERT k = 3, '2-d, 2-e';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, '기본 테이블은 그대로';
END $$;

-- 덧붙임: 2-d를 기본 테이블로 옮겨 본다
DO $$
DECLARE refused boolean := false;
BEGIN
  SET CONSTRAINTS ALL IMMEDIATE;
  BEGIN
    UPDATE EMPLOYEE SET Dno = 3 WHERE Dno = 4;
  EXCEPTION WHEN foreign_key_violation THEN refused := true;           -- DEPARTMENT에 3번 부서가 없다
  END;
  ASSERT refused, '3번 부서가 없는데 Dno = 3이 들어갔다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
