---
layout: "note"
title: "49_sql-key-clauses_verify.sql"
display_title: "49_sql-key-clauses_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-key-clauses/"
parent_title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
description: "데이터베이스 설계 · PRIMARY KEY·UNIQUE·FOREIGN KEY 절 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/49_sql-key-clauses_verify-sql/"
---
{% raw %}
[PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 49.PRIMARY KEY·UNIQUE·FOREIGN KEY 절 검증 (PostgreSQL 16)
--   1. 제약에 붙인 이름(슬라이드 10 p.16의 EMPPK, EMPSUPERFK, EMPDEPTFK, DEPTPK, DEPTSK, DEPTMGRFK)이 오류에 그대로 나온다
--   2. 외래 키는 상대 표의 기본 키나 UNIQUE 열만 가리킬 수 있다
--   3. 기본 키는 표에 하나뿐이다
--   오류 번호: 23505 = 키(유일성) 위반, 23503 = 외래 키 위반, 42830 = 가리킬 수 없는 열, 42P16 = 표 정의 오류
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_key_clauses CASCADE;
CREATE SCHEMA sql_key_clauses;
SET search_path TO sql_key_clauses;
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
-- 문장이 어긴 제약의 이름을 돌려준다. 오류가 없으면 'OK'.
CREATE FUNCTION constraint_of(stmt TEXT) RETURNS TEXT LANGUAGE plpgsql AS $f$
DECLARE name TEXT;
BEGIN
  BEGIN
    EXECUTE stmt;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS name = CONSTRAINT_NAME;
    RETURN name;
  END;
  RETURN 'OK';
END $f$;

-- COMPANY 스키마와 상태. 스키마는 슬라이드 6-2 p.20, 상태는 6-2 p.21, DDL은 9 p.17~18을 따른다.
-- EMPLOYEE와 DEPARTMENT가 서로를 가리키므로 EMPLOYEE의 외래 키 두 개는 행을 넣은 뒤 ALTER TABLE로 붙인다.
-- WORKS_ON.Hours의 NOT NULL은 뺐다(상태에 Hours가 NULL인 행이 있다).
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

DO $$ BEGIN
  -- 1. 이름 붙인 제약
  ASSERT constraint_of($q$INSERT INTO DEPARTMENT VALUES ('Sales', 5, '888665555', NULL)$q$) = 'deptpk', '기본 키 DEPTPK';
  ASSERT constraint_of($q$INSERT INTO DEPARTMENT VALUES ('Research', 7, '888665555', NULL)$q$) = 'deptsk', 'UNIQUE DEPTSK';
  ASSERT constraint_of($q$INSERT INTO DEPARTMENT VALUES ('Sales', 7, '111111111', NULL)$q$) = 'deptmgrfk', '외래 키 DEPTMGRFK';
  ASSERT constraint_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('A', 'B', '123456789', 5)$q$) = 'emppk', '기본 키 EMPPK';
  ASSERT constraint_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('A', 'B', '111111111', '000000000', 5)$q$) = 'empsuperfk', '외래 키 EMPSUPERFK';
  ASSERT constraint_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('A', 'B', '111111111', 7)$q$) = 'empdeptfk', '외래 키 EMPDEPTFK';
  ASSERT err_of($q$INSERT INTO DEPARTMENT VALUES ('Sales', 5, '888665555', NULL)$q$) = '23505', '키 위반 번호';
  ASSERT err_of($q$INSERT INTO DEPARTMENT VALUES ('Sales', 7, '111111111', NULL)$q$) = '23503', '외래 키 위반 번호';
  -- 이름을 안 붙이면 DBMS가 지어 준다
  ASSERT constraint_of($q$INSERT INTO DEPT_LOCATIONS VALUES (5, 'Houston')$q$) = 'dept_locations_pkey', '지어 준 기본 키 이름';
  ASSERT constraint_of($q$INSERT INTO DEPT_LOCATIONS VALUES (3, 'Houston')$q$) = 'dept_locations_dnumber_fkey', '지어 준 외래 키 이름';
  -- 두 열짜리 기본 키: 짝이 새것이면 들어간다
  ASSERT err_of($q$INSERT INTO DEPT_LOCATIONS VALUES (4, 'Houston'), (5, 'Stafford')$q$) = 'OK', '짝이 새것';
  -- 제약은 모두 기본 키 6, UNIQUE 2, 외래 키 8
  ASSERT (SELECT ARRAY_AGG(n ORDER BY t) FROM (SELECT contype::TEXT AS t, COUNT(*) AS n FROM pg_constraint
          WHERE connamespace = 'sql_key_clauses'::regnamespace GROUP BY contype) x) = ARRAY[8, 6, 2]::BIGINT[], '제약 개수';
END $$;

DO $$ BEGIN
  -- 2. 외래 키가 가리킬 수 있는 열
  ASSERT err_of($q$CREATE TABLE BAD (d DATE, FOREIGN KEY (d) REFERENCES DEPARTMENT(Mgr_start_date))$q$) = '42830', '키가 아닌 열을 가리킴';
  ASSERT err_of($q$CREATE TABLE OK1 (n VARCHAR(15), FOREIGN KEY (n) REFERENCES DEPARTMENT(Dname))$q$) = 'OK', 'UNIQUE 열은 가리킬 수 있다';
  -- 3. 기본 키는 하나
  ASSERT err_of($q$CREATE TABLE CAR (License_number CHAR(8) PRIMARY KEY, Engine_serial_number CHAR(6) PRIMARY KEY)$q$) = '42P16', '기본 키 둘';
  ASSERT err_of($q$CREATE TABLE CAR (License_number CHAR(8) NOT NULL, Engine_serial_number CHAR(6) NOT NULL,
                   PRIMARY KEY (License_number), UNIQUE (Engine_serial_number))$q$) = 'OK', '기본 키 하나와 UNIQUE 하나';
  -- UNIQUE 열은 NULL을 여러 번 받는다. 기본 키 열은 한 번도 못 받는다
  ASSERT err_of($q$CREATE TABLE U (a INT, UNIQUE (a))$q$) = 'OK', '';
  ASSERT err_of($q$INSERT INTO U VALUES (NULL), (NULL), (1)$q$) = 'OK', 'UNIQUE와 NULL';
  ASSERT err_of($q$INSERT INTO U VALUES (1)$q$) = '23505', 'UNIQUE와 겹치는 값';
END $$;

DROP SCHEMA sql_key_clauses CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
