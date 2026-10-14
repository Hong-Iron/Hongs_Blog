---
layout: "note"
title: "75_sql-view_verify.sql"
display_title: "75_sql-view_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "75"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-view/"
parent_title: "뷰"
description: "데이터베이스 설계 · 뷰 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/75_sql-view_verify-sql/"
---
{% raw %}
[뷰](/Hongs_Blog/studies/database-design/sql-view/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 뷰 검증 가운데 SQLite로 못 보이는 것. PostgreSQL 16에서 실행한다.
-- 문서: 75.뷰, 78.뷰와 기본 테이블 비교 / 출처: 13주차 슬라이드 13-View p.3~8, 14, 25~26
-- 확인하는 것:
--   1. p.25~26: 뷰에만 조회 권한을 준 사용자는 뷰는 읽고, 기본 테이블 EMPLOYEE는 읽지 못한다.
--      5번 부서가 아닌 직원과 Salary 열은 그 사용자에게 보이지 않는다.
--   2. p.5~8: WORKS_ON1 16행, DEPT_INFO 세 행, 기본 테이블을 고치면 뷰의 답이 바로 바뀐다.
--   3. p.14: DROP VIEW는 기본 테이블을 건드리지 않는다. 거꾸로 뷰가 기대고 있는 기본 테이블은
--      그냥은 못 지우고(오류), CASCADE를 붙이면 뷰까지 함께 지워진다.
-- 주의: 사용자(역할) vault_dept5_user를 잠깐 만들었다가 끝에서 지운다.
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_view CASCADE;
CREATE SCHEMA sql_view;
SET search_path TO sql_view;

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

DROP ROLE IF EXISTS vault_dept5_user;

CREATE VIEW WORKS_ON1
AS SELECT Fname, Lname, Pname, Hours
   FROM EMPLOYEE, PROJECT, WORKS_ON
   WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal)
AS SELECT Dname, COUNT (*), SUM (Salary)
   FROM DEPARTMENT, EMPLOYEE
   WHERE Dnumber = Dno
   GROUP BY Dname;
CREATE VIEW DEPT5EMP AS SELECT * FROM EMPLOYEE WHERE Dno = 5;
CREATE VIEW BASIC_EMP_DATA AS SELECT Fname, Lname, Address FROM EMPLOYEE;

-- 2. 뷰의 내용과 "늘 최신"
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM WORKS_ON1) = 16, 'WORKS_ON1은 16행이어야 한다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM WORKS_ON1 WHERE Pname = 'ProductX') = 'English,Smith', 'p.7의 답';
  ASSERT (SELECT string_agg(Dept_name || ':' || No_of_emps || ':' || Total_sal::int, ' ' ORDER BY No_of_emps DESC) FROM DEPT_INFO)
         = 'Research:4:133000 Administration:3:93000 Headquarters:1:55000', 'DEPT_INFO의 세 행';
  INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main','F',27000,'333445555',5);
  ASSERT (SELECT No_of_emps || ':' || Total_sal::int FROM DEPT_INFO WHERE Dept_name = 'Research') = '5:160000', '뷰가 최신이 아니다';
  DELETE FROM EMPLOYEE WHERE Ssn = '111223333';
  ASSERT (SELECT No_of_emps FROM DEPT_INFO WHERE Dept_name = 'Research') = 4, '되돌린 뒤 4명';
END $$;

-- 열 이름을 안 붙인 집계 뷰: PostgreSQL은 함수 이름을 열 이름으로 쓴다
CREATE VIEW DEPT_INFO_NONAME AS SELECT Dname, COUNT (*), SUM (Salary) FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;
DO $$ BEGIN
  ASSERT (SELECT string_agg(column_name, ',' ORDER BY ordinal_position) FROM information_schema.columns
          WHERE table_schema = 'sql_view' AND table_name = 'dept_info_noname') = 'dname,count,sum', '이름 없는 열의 이름';
END $$;
DROP VIEW DEPT_INFO_NONAME;

-- 뷰는 카탈로그에 정의(질의 글)로 들어 있다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'sql_view') = 4, '뷰 네 개';
  ASSERT (SELECT definition FROM pg_views WHERE schemaname = 'sql_view' AND viewname = 'dept5emp') LIKE '%WHERE%dno = 5%', '정의 글';
  ASSERT (SELECT relkind FROM pg_class WHERE relname = 'dept5emp' AND relnamespace = 'sql_view'::regnamespace) = 'v', '뷰는 relkind v';
  ASSERT (SELECT relkind FROM pg_class WHERE relname = 'employee' AND relnamespace = 'sql_view'::regnamespace) = 'r', '기본 테이블은 relkind r';
END $$;

-- 1. 권한: 뷰만 읽을 수 있는 사용자
CREATE ROLE vault_dept5_user;
GRANT USAGE ON SCHEMA sql_view TO vault_dept5_user;
GRANT SELECT ON DEPT5EMP, BASIC_EMP_DATA TO vault_dept5_user;     -- EMPLOYEE에는 주지 않는다

SET ROLE vault_dept5_user;
DO $$
DECLARE denied boolean := false;
BEGIN
  ASSERT (SELECT COUNT(*) FROM DEPT5EMP) = 4, '뷰로는 5번 부서 4명이 보여야 한다';
  ASSERT (SELECT COUNT(*) FROM DEPT5EMP WHERE Dno <> 5) = 0, '다른 부서 직원이 보인다';
  ASSERT (SELECT COUNT(*) FROM BASIC_EMP_DATA) = 8, 'BASIC_EMP_DATA는 8행';
  BEGIN
    PERFORM COUNT(*) FROM EMPLOYEE;
  EXCEPTION WHEN insufficient_privilege THEN denied := true;       -- "permission denied for table employee"
  END;
  ASSERT denied, '기본 테이블을 읽을 수 있었다';
  denied := false;
  BEGIN
    EXECUTE 'SELECT Salary FROM BASIC_EMP_DATA';
  EXCEPTION WHEN undefined_column THEN denied := true;             -- 뷰에 없는 열
  END;
  ASSERT denied, 'Salary 열이 보였다';
END $$;
RESET ROLE;

-- 3. 지우기
-- 뷰 WORKS_ON1이 기대고 있는 기본 테이블 WORKS_ON은 그냥은 못 지운다
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN
    DROP TABLE WORKS_ON;
  EXCEPTION WHEN dependent_objects_still_exist THEN refused := true;   -- "cannot drop table works_on because other objects depend on it"
  END;
  ASSERT refused, '뷰가 기대는 표가 그냥 지워졌다';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON1) = 16, '거부된 뒤 뷰는 그대로여야 한다';
END $$;

-- 뷰를 지우면 기본 테이블은 그대로다
DROP VIEW WORKS_ON1;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM PROJECT) = 6 AND (SELECT COUNT(*) FROM WORKS_ON) = 16,
         'DROP VIEW가 기본 테이블을 건드렸다';
END $$;

-- 뷰를 다시 만들고, 이번에는 CASCADE를 붙여 표를 지운다: 뷰까지 함께 없어진다
CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON WHERE Ssn = Essn AND Pno = Pnumber;
DROP TABLE WORKS_ON CASCADE;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'sql_view' AND viewname = 'works_on1') = 0, 'CASCADE가 뷰를 안 지웠다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM PROJECT) = 6, '다른 기본 테이블은 그대로여야 한다';
END $$;

DROP OWNED BY vault_dept5_user;
DROP ROLE vault_dept5_user;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
