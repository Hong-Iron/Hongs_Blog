---
layout: "note"
title: "59_sql-alter-table_verify.sql"
display_title: "59_sql-alter-table_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "59"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-alter-table/"
parent_title: "ALTER TABLE"
description: "데이터베이스 설계 · ALTER TABLE 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/59_sql-alter-table_verify-sql/"
---
{% raw %}
[ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 59.ALTER TABLE 검증 (PostgreSQL 16). 문서의 세 문장을 적힌 그대로 돌린다.
--   ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Job VARCHAR(12);
--   ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address CASCADE;
--   ALTER TABLE COMPANY.EMPLOYEE DROP CONSTRAINT EMPSUPERFK CASCADE;
--   오류 번호: 2BP01 = 딸린 것이 있어 못 지움(RESTRICT), 23502 = NOT NULL 위반, 23503 = 외래 키 위반, 42601 = 구문 오류
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_alter_table CASCADE;
DROP SCHEMA IF EXISTS company CASCADE;
CREATE SCHEMA sql_alter_table;
SET search_path TO sql_alter_table;
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
CREATE FUNCTION cols(tbl TEXT) RETURNS TEXT[] LANGUAGE sql AS
  $f$ SELECT ARRAY_AGG(column_name::TEXT ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema = 'company' AND table_name = tbl $f$;
CREATE FUNCTION fk_names() RETURNS TEXT[] LANGUAGE sql AS
  $f$ SELECT ARRAY_AGG(conname::TEXT ORDER BY conname) FROM pg_constraint
      WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'company') AND contype = 'f' $f$;

CREATE SCHEMA COMPANY;
SET search_path TO company, sql_alter_table;
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

-- 1. 열 더하기
ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Job VARCHAR(12);
DO $$ BEGIN
  ASSERT cols('employee') = ARRAY['fname', 'minit', 'lname', 'ssn', 'bdate', 'address', 'sex', 'salary', 'super_ssn', 'dno', 'job'], 'Job이 맨 뒤에 붙는다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Job IS NULL) = 8, '이미 있던 여덟 행의 Job은 NULL';
  -- NOT NULL인 열은 기본값이 있어야 붙일 수 있다
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Grade INT NOT NULL$q$) = '23502', '기존 행에 넣을 값이 없다';
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Grade INT NOT NULL DEFAULT 1$q$) = 'OK', '기본값이 있으면 된다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Grade = 1) = 8, '기존 행에 기본값이 들어간다';
END $$;
UPDATE EMPLOYEE SET Job = 'Manager' WHERE Ssn IN (SELECT Mgr_ssn FROM DEPARTMENT);
DO $$ BEGIN
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMPLOYEE WHERE Job = 'Manager') = ARRAY['Borg', 'Wallace', 'Wong'], '값은 UPDATE로 채운다';
END $$;

-- 2. 열 지우기
-- Address에는 아무것도 기대지 않는다: 문서의 문장 그대로 돈다
BEGIN;
ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address CASCADE;
DO $$ BEGIN
  ASSERT NOT ('address' = ANY (cols('employee'))), 'Address 열이 사라져야 한다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, '행 수는 그대로다';
  ASSERT err_of($q$SELECT Address FROM EMPLOYEE$q$) = '42703', '없는 열';
END $$;
ROLLBACK;
-- 그 열에 기대는 뷰가 있으면 RESTRICT는 막고 CASCADE는 뷰까지 지운다
CREATE VIEW EMP_ADDRESS AS SELECT Lname, Address FROM EMPLOYEE;
DO $$ BEGIN
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address RESTRICT$q$) = '2BP01', '기대는 뷰가 있으면 RESTRICT는 막는다';
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address$q$) = '2BP01', '아무것도 안 적으면 RESTRICT와 같다';
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address CASCADE$q$) = 'OK', '';
  ASSERT (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'company') = 0, 'CASCADE는 뷰도 지운다';
END $$;
-- 다른 표의 외래 키가 가리키는 열: DEPARTMENT.Dnumber
DO $$ BEGIN
  ASSERT err_of($q$ALTER TABLE COMPANY.DEPARTMENT DROP COLUMN Dnumber RESTRICT$q$) = '2BP01', '외래 키 셋이 가리키므로 막는다';
  ASSERT fk_names() = ARRAY['dependent_essn_fkey', 'dept_locations_dnumber_fkey', 'deptmgrfk', 'empdeptfk', 'empsuperfk', 'project_dnum_fkey',
                            'works_on_essn_fkey', 'works_on_pno_fkey'], '외래 키 여덟 개';
END $$;
BEGIN;
ALTER TABLE COMPANY.DEPARTMENT DROP COLUMN Dnumber CASCADE;
DO $$ BEGIN
  ASSERT fk_names() = ARRAY['dependent_essn_fkey', 'deptmgrfk', 'empsuperfk', 'works_on_essn_fkey', 'works_on_pno_fkey'],
         'Dnumber를 가리키던 외래 키 셋이 함께 사라진다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM PROJECT) = 6, '다른 표의 행은 남는다';
END $$;
ROLLBACK;

-- PostgreSQL 16에서는 그 표 자신의 제약에 든 열을 지우면 RESTRICT여도 그 제약이 함께 사라진다
BEGIN;
ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Super_ssn RESTRICT;
DO $$ BEGIN
  ASSERT NOT ('empsuperfk' = ANY (fk_names())), 'Super_ssn과 함께 EMPSUPERFK도 사라진다';
  ASSERT 'empdeptfk' = ANY (fk_names()), '다른 제약은 남는다';
END $$;
ROLLBACK;

-- 3. 제약 지우기와 다시 붙이기
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('Ann', 'Lee', '111111111', '000000000', 1)$q$) = '23503',
         '제약이 있을 때는 없는 상사 번호를 못 넣는다';
END $$;
ALTER TABLE COMPANY.EMPLOYEE DROP CONSTRAINT EMPSUPERFK CASCADE;
DO $$ BEGIN
  ASSERT NOT ('empsuperfk' = ANY (fk_names())), 'EMPSUPERFK가 사라져야 한다';
  ASSERT err_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Super_ssn, Dno) VALUES ('Ann', 'Lee', '111111111', '000000000', 1)$q$) = 'OK',
         '제약이 없으니 없는 상사 번호도 들어간다';
  -- 어긋난 행이 있는 채로는 제약을 다시 못 붙인다
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)$q$) = '23503',
         '이미 든 행이 제약을 어기면 못 붙인다';
  ASSERT err_of($q$DELETE FROM EMPLOYEE WHERE Ssn = '111111111'$q$) = 'OK', '';
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)$q$) = 'OK',
         '어긋난 행을 지우면 붙는다';
  ASSERT 'empsuperfk' = ANY (fk_names()), '';
  -- 기본 키 제약은 외래 키 넷이 기대고 있다
  ASSERT err_of($q$ALTER TABLE COMPANY.EMPLOYEE DROP CONSTRAINT EMPPK RESTRICT$q$) = '2BP01', '기본 키에 기대는 외래 키가 있으면 막는다';
END $$;
BEGIN;
ALTER TABLE COMPANY.EMPLOYEE DROP CONSTRAINT EMPPK CASCADE;
DO $$ BEGIN
  ASSERT fk_names() = ARRAY['dept_locations_dnumber_fkey', 'empdeptfk', 'project_dnum_fkey', 'works_on_pno_fkey'],
         'EMPLOYEE(Ssn)을 가리키던 외래 키 넷이 함께 사라진다';
END $$;
ROLLBACK;

-- 열의 정의 고치기: 기본값 떼기와 붙이기
ALTER TABLE COMPANY.DEPARTMENT ALTER COLUMN Mgr_ssn SET DEFAULT '888665555';
INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7);
ALTER TABLE COMPANY.DEPARTMENT ALTER COLUMN Mgr_ssn DROP DEFAULT;
DO $$ BEGIN
  ASSERT (SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 7) = '888665555', 'SET DEFAULT 뒤에는 기본값이 들어간다';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Legal', 8)$q$) = '23502', 'DROP DEFAULT 뒤에는 NOT NULL에 걸린다';
END $$;

-- ALTER SCHEMA로는 열을 못 더한다
DO $$ BEGIN
  ASSERT err_of($q$ALTER SCHEMA COMPANY ADD COLUMN Job VARCHAR(12)$q$) = '42601', 'ALTER SCHEMA에는 ADD COLUMN이 없다';
END $$;

DROP SCHEMA company CASCADE;
SET search_path TO sql_alter_table;
DROP SCHEMA sql_alter_table CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
