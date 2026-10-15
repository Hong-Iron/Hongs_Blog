---
layout: "note"
title: "52_constraint-violation-practice_p1.sql"
display_title: "52_constraint-violation-practice_p1.sql"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "52"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/constraint-violation-practice/"
parent_title: "제약 위반 찾기 연습"
description: "데이터베이스 설계 · 제약 위반 찾기 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/52_constraint-violation-practice_p1-sql/"
---
{% raw %}
[제약 위반 찾기 연습](/Hongs_Blog/studies/database-design/constraint-violation-practice/) 문서의 문제 1 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 52.제약 위반 찾기 연습 p1 (a~k)을 PostgreSQL 16에서 돌린다. SQLite와 갈리는 곳은 (a) 하나다.
--   (a)의 주소 '2365 Newcastle Rd, Bellaire, TX'는 31글자인데 COMPANY DDL의 Address는 VARCHAR(30)이다.
--   PostgreSQL은 길이를 넘는다고 막는다(22001). SQLite는 길이를 안 봐서 받는다.
--   오류 번호: 23505 = 키 위반, 23502 = NOT NULL(개체 무결성) 위반, 23503 = 참조 무결성 위반
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS constraint_violation_practice CASCADE;
CREATE SCHEMA constraint_violation_practice;
SET search_path TO constraint_violation_practice;
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

-- COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7). DDL은 46.CREATE SCHEMA와 CREATE TABLE의 문장을 따른다.
-- EMPLOYEE와 DEPARTMENT가 서로를 가리키므로 EMPLOYEE의 외래 키 두 개는 행을 넣은 뒤 ALTER TABLE로 붙인다.
-- WORKS_ON.Hours에는 NOT NULL이 없다(상태에 Hours가 NULL인 행이 있다).
CREATE TABLE EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  CONSTRAINT EMPPK PRIMARY KEY (Ssn));
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname),
  CONSTRAINT DEPTMGRFK FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn));
CREATE TABLE DEPT_LOCATIONS (
  Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (
  Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname),
  FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (
  Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn),
  FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (
  Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
INSERT INTO EMPLOYEE VALUES
  ('John', 'B', 'Smith', '123456789', '1965-01-09', '731 Fondren, Houston, TX', 'M', 30000, '333445555', 5),
  ('Franklin', 'T', 'Wong', '333445555', '1955-12-08', '638 Voss, Houston, TX', 'M', 40000, '888665555', 5),
  ('Alicia', 'J', 'Zelaya', '999887777', '1968-01-19', '3321 Castle, Spring, TX', 'F', 25000, '987654321', 4),
  ('Jennifer', 'S', 'Wallace', '987654321', '1941-06-20', '291 Berry, Bellaire, TX', 'F', 43000, '888665555', 4),
  ('Ramesh', 'K', 'Narayan', '666884444', '1962-09-15', '975 Fire Oak, Humble, TX', 'M', 38000, '333445555', 5),
  ('Joyce', 'A', 'English', '453453453', '1972-07-31', '5631 Rice, Houston, TX', 'F', 25000, '333445555', 5),
  ('Ahmad', 'V', 'Jabbar', '987987987', '1969-03-29', '980 Dallas, Houston, TX', 'M', 25000, '987654321', 4),
  ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, NULL, 1);
INSERT INTO DEPARTMENT VALUES ('Research', 5, '333445555', '1988-05-22'), ('Administration', 4, '987654321', '1995-01-01'),
  ('Headquarters', 1, '888665555', '1981-06-19');
INSERT INTO DEPT_LOCATIONS VALUES (1, 'Houston'), (4, 'Stafford'), (5, 'Bellaire'), (5, 'Sugarland'), (5, 'Houston');
INSERT INTO PROJECT VALUES ('ProductX', 1, 'Bellaire', 5), ('ProductY', 2, 'Sugarland', 5), ('ProductZ', 3, 'Houston', 5),
  ('Computerization', 10, 'Stafford', 4), ('Reorganization', 20, 'Houston', 1), ('Newbenefits', 30, 'Stafford', 4);
INSERT INTO WORKS_ON VALUES ('123456789', 1, 32.5), ('123456789', 2, 7.5), ('666884444', 3, 40.0), ('453453453', 1, 20.0),
  ('453453453', 2, 20.0), ('333445555', 2, 10.0), ('333445555', 3, 10.0), ('333445555', 10, 10.0), ('333445555', 20, 10.0),
  ('999887777', 30, 30.0), ('999887777', 10, 10.0), ('987987987', 10, 35.0), ('987987987', 30, 5.0), ('987654321', 30, 20.0),
  ('987654321', 20, 15.0), ('888665555', 20, NULL);
INSERT INTO DEPENDENT VALUES ('333445555', 'Alice', 'F', '1986-04-05', 'Daughter'), ('333445555', 'Theodore', 'M', '1983-10-25', 'Son'),
  ('333445555', 'Joy', 'F', '1958-05-03', 'Spouse'), ('987654321', 'Abner', 'M', '1942-02-28', 'Spouse'),
  ('123456789', 'Michael', 'M', '1988-01-04', 'Son'), ('123456789', 'Alice', 'F', '1988-12-30', 'Daughter'),
  ('123456789', 'Elizabeth', 'F', '1967-05-05', 'Spouse');
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn);
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber);

-- 받은 연산은 상태를 바꾸므로, 연산마다 트랜잭션 안에서 돌리고 되돌린다.
BEGIN;
DO $$ BEGIN
  ASSERT LENGTH('2365 Newcastle Rd, Bellaire, TX') = 31, '(a)의 주소는 31글자';
  ASSERT err_of($q$INSERT INTO EMPLOYEE VALUES ('Robert', 'F', 'Scott', '943775543', '1972-06-21', '2365 Newcastle Rd, Bellaire, TX', 'M', 58000, '888665555', 1)$q$) = '22001',
         '(a) 적힌 그대로는 Address VARCHAR(30)에 안 들어간다';
  ASSERT err_of($q$INSERT INTO EMPLOYEE VALUES ('Robert', 'F', 'Scott', '943775543', '1972-06-21', '2365 Newcastle, Bellaire, TX', 'M', 58000, '888665555', 1)$q$) = 'OK',
         '(a) 주소를 30글자 안으로 줄이면 키·개체·참조 무결성은 모두 지킨다';
END $$;
ROLLBACK;

DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO PROJECT VALUES ('ProductA', 4, 'Bellaire', 2)$q$) = '23503', '(b) 참조 무결성';
  ASSERT err_of($q$INSERT INTO DEPARTMENT VALUES ('Production', 4, '943775543', '2007-10-01')$q$) = '23505', '(c) 먼저 걸리는 것은 키';
  ASSERT err_of($q$INSERT INTO DEPARTMENT VALUES ('Production', 6, '943775543', '2007-10-01')$q$) = '23503', '(c) 번호를 고쳐도 참조 무결성';
  ASSERT err_of($q$INSERT INTO WORKS_ON VALUES ('677678989', NULL, '40.0')$q$) = '23502', '(d) 먼저 걸리는 것은 개체 무결성';
  ASSERT err_of($q$INSERT INTO WORKS_ON VALUES ('677678989', 1, '40.0')$q$) = '23503', '(d) Pno를 채워도 참조 무결성';
  ASSERT err_of($q$DELETE FROM EMPLOYEE WHERE Ssn = '987654321'$q$) = '23503', '(g) 참조 무결성';
  ASSERT err_of($q$DELETE FROM PROJECT WHERE Pname = 'ProductX'$q$) = '23503', '(h) 참조 무결성';
  ASSERT err_of($q$UPDATE EMPLOYEE SET Super_ssn = '943775543' WHERE Ssn = '999887777'$q$) = '23503', '(j) 참조 무결성';
END $$;

BEGIN;
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO DEPENDENT VALUES ('453453453', 'John', 'M', '1990-12-12', 'spouse')$q$) = 'OK', '(e) 위반 없음';
  ASSERT err_of($q$DELETE FROM WORKS_ON WHERE Essn = '333445555'$q$) = 'OK', '(f) 위반 없음';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON) = 12, '(f) 네 행이 지워진다';
  ASSERT err_of($q$UPDATE DEPARTMENT SET Mgr_ssn = '123456789', Mgr_start_date = '2007-10-01' WHERE Dnumber = 5$q$) = 'OK', '(i) 위반 없음';
  ASSERT err_of($q$UPDATE WORKS_ON SET Hours = '5.0' WHERE Essn = '999887777' AND Pno = 10$q$) = 'OK', '(k) 위반 없음';
  ASSERT (SELECT Hours FROM WORKS_ON WHERE Essn = '999887777' AND Pno = 10) = 5.0, '(k) 10.0이 5.0으로';
END $$;
ROLLBACK;

DROP SCHEMA constraint_violation_practice CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
