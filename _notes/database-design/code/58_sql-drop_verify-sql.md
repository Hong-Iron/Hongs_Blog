---
layout: "note"
title: "58_sql-drop_verify.sql"
display_title: "58_sql-drop_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "58"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-drop/"
parent_title: "DROP 명령과 CASCADE·RESTRICT"
description: "데이터베이스 설계 · DROP 명령과 CASCADE·RESTRICT 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/58_sql-drop_verify-sql/"
---
{% raw %}
[DROP 명령과 CASCADE·RESTRICT](/Hongs_Blog/studies/database-design/sql-drop/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 58.DROP 명령과 CASCADE·RESTRICT 검증 (PostgreSQL 16). SQLite에는 DROP SCHEMA도, DROP의 CASCADE·RESTRICT도 없다.
--   문서의 두 문장 DROP SCHEMA COMPANY CASCADE; DROP TABLE DEPENDENT CASCADE; 와 RESTRICT 판을 돌린다.
--   오류 번호: 2BP01 = 딸린 것이 있어 못 지움(RESTRICT), 42P01 = 없는 표, 23503 = 외래 키 위반
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_drop CASCADE;
DROP SCHEMA IF EXISTS company CASCADE;
CREATE SCHEMA sql_drop;
SET search_path TO sql_drop;
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
CREATE FUNCTION n_tables() RETURNS BIGINT LANGUAGE sql AS
  $f$ SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'company' AND table_type = 'BASE TABLE' $f$;
CREATE FUNCTION fk_names() RETURNS TEXT[] LANGUAGE sql AS
  $f$ SELECT ARRAY_AGG(conname::TEXT ORDER BY conname) FROM pg_constraint WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'company') AND contype = 'f' $f$;

CREATE SCHEMA COMPANY;
SET search_path TO company, sql_drop;
-- COMPANY 스키마와 상태.
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

-- 1. DELETE와 DROP TABLE의 차이
BEGIN;
DELETE FROM DEPENDENT;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM DEPENDENT) = 0, 'DELETE 뒤 0행';
  ASSERT n_tables() = 6, 'DELETE 뒤에도 표는 여섯 개';
  ASSERT err_of($q$INSERT INTO DEPENDENT VALUES ('123456789', 'Michael', 'M', '1988-01-04', 'Son')$q$) = 'OK', '다시 넣을 수 있다';
END $$;
ROLLBACK;
BEGIN;
DROP TABLE DEPENDENT CASCADE;
DO $$ BEGIN
  ASSERT n_tables() = 5, 'DROP TABLE 뒤 표는 다섯 개';
  ASSERT err_of($q$SELECT COUNT(*) FROM DEPENDENT$q$) = '42P01', '없는 표는 찾을 수 없다';
  ASSERT err_of($q$INSERT INTO DEPENDENT VALUES ('123456789', 'Michael', 'M', '1988-01-04', 'Son')$q$) = '42P01', '없는 표에는 넣을 수 없다';
END $$;
ROLLBACK;
-- DELETE는 제약을 지킨다
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM PROJECT$q$) = '23503', 'WORKS_ON이 가리키는 PROJECT 행은 못 지운다';
END $$;

-- 2. DROP TABLE의 RESTRICT와 CASCADE
-- EMPLOYEE: 다른 표의 외래 키 셋(DEPARTMENT.Mgr_ssn, WORKS_ON.Essn, DEPENDENT.Essn)이 가리킨다
BEGIN;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM pg_constraint WHERE contype = 'f' AND confrelid = 'company.employee'::regclass AND conrelid <> confrelid) = 3,
         'EMPLOYEE를 가리키는 다른 표의 외래 키는 셋';
  ASSERT err_of($q$DROP TABLE EMPLOYEE RESTRICT$q$) = '2BP01', '가리키는 외래 키가 있으면 RESTRICT는 막는다';
  ASSERT err_of($q$DROP TABLE EMPLOYEE CASCADE$q$) = 'OK', '';
  ASSERT fk_names() = ARRAY['dept_locations_dnumber_fkey', 'project_dnum_fkey', 'works_on_pno_fkey'], 'EMPLOYEE를 가리키던 셋과 EMPLOYEE의 둘이 사라진다';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON) = 16 AND (SELECT COUNT(*) FROM DEPENDENT) = 7 AND (SELECT COUNT(*) FROM DEPARTMENT) = 3, '가리키던 표의 행은 그대로다';
END $$;
ROLLBACK;
DO $$ BEGIN
  -- DEPENDENT는 아무도 가리키지 않는다: RESTRICT로도 지워진다
  ASSERT err_of($q$DROP TABLE DEPENDENT RESTRICT$q$) = 'OK', '딸린 것이 없으면 RESTRICT로도 지워진다';
  ASSERT n_tables() = 5, '';
  -- DEPARTMENT는 외래 키 셋이 가리킨다: RESTRICT는 막는다
  ASSERT err_of($q$DROP TABLE DEPARTMENT RESTRICT$q$) = '2BP01', '가리키는 제약이 있으면 RESTRICT는 막는다';
  ASSERT err_of($q$DROP TABLE DEPARTMENT$q$) = '2BP01', '아무것도 안 적으면 RESTRICT와 같다';
  ASSERT fk_names() = ARRAY['dept_locations_dnumber_fkey', 'deptmgrfk', 'empdeptfk', 'empsuperfk', 'project_dnum_fkey', 'works_on_essn_fkey', 'works_on_pno_fkey'],
         '지우기 전의 외래 키 일곱 개';
  -- CASCADE: 표와 함께, 그 표를 가리키던 제약 셋과 그 표가 가진 제약이 사라진다. 다른 표의 행은 그대로다
  ASSERT err_of($q$DROP TABLE DEPARTMENT CASCADE$q$) = 'OK', '';
  ASSERT n_tables() = 4, '';
  ASSERT fk_names() = ARRAY['empsuperfk', 'works_on_essn_fkey', 'works_on_pno_fkey'], 'DEPARTMENT를 가리키던 셋과 DEPARTMENT의 것 하나가 사라진다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM PROJECT) = 6 AND (SELECT COUNT(*) FROM DEPT_LOCATIONS) = 5, '다른 표의 행은 남는다';
  -- 제약이 사라졌으니 없는 부서 번호도 들어간다
  ASSERT err_of($q$INSERT INTO PROJECT VALUES ('Ghost', 99, 'Nowhere', 77)$q$) = 'OK', '외래 키가 사라져 77번 부서를 적어도 받는다';
END $$;

-- 표에 기대는 뷰가 있을 때 (뷰는 75번 문서)
CREATE VIEW EMP_NAMES AS SELECT Fname, Lname FROM EMPLOYEE;
DO $$ BEGIN
  ASSERT err_of($q$DROP TABLE WORKS_ON RESTRICT$q$) = 'OK', 'WORKS_ON에 기대는 것은 없다';
  ASSERT err_of($q$DROP TABLE EMPLOYEE RESTRICT$q$) = '2BP01', '뷰가 기대고 있으면 RESTRICT는 막는다';
  ASSERT err_of($q$DROP TABLE EMPLOYEE CASCADE$q$) = 'OK', '';
  ASSERT (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'company') = 0, 'CASCADE는 뷰도 함께 지운다';
END $$;

-- 3. DROP SCHEMA의 RESTRICT와 CASCADE
DO $$ BEGIN
  ASSERT n_tables() = 2, 'PROJECT와 DEPT_LOCATIONS가 남아 있다';
  ASSERT err_of($q$DROP SCHEMA COMPANY RESTRICT$q$) = '2BP01', '스키마에 든 것이 있으면 RESTRICT는 막는다';
  ASSERT err_of($q$DROP SCHEMA COMPANY CASCADE$q$) = 'OK', '';
  ASSERT (SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = 'company') = 0, '스키마가 사라졌다';
  ASSERT err_of($q$SELECT * FROM COMPANY.PROJECT$q$) = '42P01', '스키마와 함께 표도 사라졌다';
  -- 빈 스키마는 RESTRICT로도 지워진다
  ASSERT err_of($q$CREATE SCHEMA COMPANY$q$) = 'OK', '';
  ASSERT err_of($q$DROP SCHEMA COMPANY RESTRICT$q$) = 'OK', '빈 스키마';
END $$;

SET search_path TO sql_drop;
DROP SCHEMA sql_drop CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
