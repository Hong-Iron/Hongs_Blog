---
layout: "note"
title: "46_sql-create-table_verify.sql"
display_title: "46_sql-create-table_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-create-table/"
parent_title: "CREATE SCHEMA와 CREATE TABLE"
description: "데이터베이스 설계 · CREATE SCHEMA와 CREATE TABLE 검증 코드"
permalink: "/studies/database-design/code/46_sql-create-table_verify-sql/"
---
{% raw %}
[CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 46.CREATE SCHEMA와 CREATE TABLE 검증 (PostgreSQL 16). SQLite가 못 돌리거나 다르게 받는 문장을 실제로 돌린다.
--   1. CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith' (슬라이드 10 p.11): 따옴표가 있으면 구문 오류, 없으면 돈다
--   2. 아직 없는 표를 가리키는 FOREIGN KEY는 CREATE TABLE에서 오류다 (슬라이드 9 p.18의 물음)
--   3. 서로 가리키는 EMPLOYEE와 DEPARTMENT: 어느 쪽 행을 먼저 넣어도 막힌다. 푸는 길 둘을 돌려 본다
--   4. 슬라이드대로 Hours에 NOT NULL을 붙이면 상태의 (888665555, 20, NULL) 행이 들어가지 않는다
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_create_table CASCADE;
DROP SCHEMA IF EXISTS company CASCADE;
DROP ROLE IF EXISTS jsmith;
CREATE SCHEMA sql_create_table;
SET search_path TO sql_create_table;
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

-- 1. 스키마 만들기
DO $$ BEGIN
  ASSERT err_of($q$CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith'$q$) = '42601', '따옴표 붙은 권한 식별자는 구문 오류여야 한다';
  ASSERT err_of($q$CREATE SCHEMA COMPANY AUTHORIZATION Jsmith$q$) = '42704', '없는 사용자에게 줄 수는 없다';
END $$;
CREATE ROLE Jsmith;
CREATE SCHEMA COMPANY AUTHORIZATION Jsmith;
DO $$ BEGIN
  ASSERT (SELECT schema_owner FROM information_schema.schemata WHERE schema_name = 'company') = 'jsmith', '스키마 주인이 jsmith가 아니다';
END $$;

-- 2. 표 이름 앞에 스키마 이름을 붙인다 (슬라이드 10 p.12). 아직 없는 표를 가리키면 오류다.
DO $$ BEGIN
  ASSERT err_of($q$CREATE TABLE COMPANY.EMPLOYEE (Ssn CHAR(9) NOT NULL, Dno INT NOT NULL, PRIMARY KEY (Ssn),
                   FOREIGN KEY (Dno) REFERENCES COMPANY.DEPARTMENT(Dnumber))$q$) = '42P01', 'DEPARTMENT가 없는데 받았다';
END $$;

-- 자기 자신을 가리키는 외래 키(Super_ssn -> EMPLOYEE.Ssn)는 한 문장 안에 적어도 받는다.
DO $$ BEGIN
  ASSERT err_of($q$CREATE TABLE SELF_REF (Ssn CHAR(9) NOT NULL, Super_ssn CHAR(9), PRIMARY KEY (Ssn),
                   FOREIGN KEY (Super_ssn) REFERENCES SELF_REF(Ssn))$q$) = 'OK', '자기 자신을 가리키는 외래 키';
END $$;

-- 슬라이드 9 p.17~18의 여섯 문장. EMPLOYEE에는 외래 키 줄이 없다. Hours는 슬라이드대로 NOT NULL이다.
CREATE TABLE COMPANY.EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn));
SET search_path TO company, sql_create_table;
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn));
CREATE TABLE DEPT_LOCATIONS (
  Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (
  Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname),
  FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (
  Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1) NOT NULL,
  PRIMARY KEY (Essn, Pno),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn),
  FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (
  Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
  PRIMARY KEY (Essn, Dependent_name),
  FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn));
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'company') = 6, '표가 여섯 개가 아니다';
  ASSERT (SELECT COUNT(*) FROM pg_constraint WHERE connamespace = 'company'::regnamespace AND contype = 'f') = 6,
         '슬라이드 문장만으로는 외래 키가 여섯 개여야 한다(EMPLOYEE의 둘이 빠져 있다)';
END $$;

-- 빠진 두 외래 키를 ALTER TABLE로 붙인다. 표가 모두 생긴 뒤라 이제는 받는다.
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn);
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber);
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM pg_constraint WHERE connamespace = 'company'::regnamespace AND contype = 'f') = 8, '외래 키가 여덟 개가 아니다';
END $$;

-- 3. 서로 가리키는 두 표: 빈 표에 첫 행을 넣어 본다.
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO EMPLOYEE VALUES ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, NULL, 1)$q$) = '23503',
         '1번 부서가 없는데 Borg가 들어갔다';
  ASSERT err_of($q$INSERT INTO DEPARTMENT VALUES ('Headquarters', 1, '888665555', '1981-06-19')$q$) = '23503',
         'Borg가 없는데 Headquarters가 들어갔다';
END $$;
-- 길 1: 검사를 트랜잭션 끝으로 미루는 제약으로 바꾼다.
ALTER TABLE EMPLOYEE ALTER CONSTRAINT EMPDEPTFK DEFERRABLE INITIALLY DEFERRED;
BEGIN;
INSERT INTO EMPLOYEE VALUES ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, NULL, 1);
INSERT INTO DEPARTMENT VALUES ('Headquarters', 1, '888665555', '1981-06-19');
COMMIT;
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 1 AND (SELECT COUNT(*) FROM DEPARTMENT) = 1, '미룬 검사로도 못 넣었다';
END $$;
-- 길 2: 외래 키를 떼고 행을 다 넣은 뒤 다시 붙인다.
ALTER TABLE EMPLOYEE DROP CONSTRAINT EMPDEPTFK;
ALTER TABLE EMPLOYEE DROP CONSTRAINT EMPSUPERFK;
DELETE FROM DEPARTMENT;
DELETE FROM EMPLOYEE;
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
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn);
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber);
INSERT INTO PROJECT VALUES ('ProductX', 1, 'Bellaire', 5), ('ProductY', 2, 'Sugarland', 5), ('ProductZ', 3, 'Houston', 5),
  ('Computerization', 10, 'Stafford', 4), ('Reorganization', 20, 'Houston', 1), ('Newbenefits', 30, 'Stafford', 4);

-- 4. Hours NOT NULL과 상태의 NULL 행
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO WORKS_ON VALUES ('888665555', 20, NULL)$q$) = '23502', 'Hours가 NOT NULL인데 NULL이 들어갔다';
END $$;
ALTER TABLE WORKS_ON ALTER COLUMN Hours DROP NOT NULL;
INSERT INTO WORKS_ON VALUES ('888665555', 20, NULL);
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM WORKS_ON WHERE Hours IS NULL) = 1, 'NOT NULL을 뗀 뒤에도 못 넣었다';
END $$;

DROP SCHEMA company CASCADE;
DROP ROLE jsmith;
DROP SCHEMA sql_create_table CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
