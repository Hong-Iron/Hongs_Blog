---
layout: "note"
title: "48_sql-attribute-constraints_verify.sql"
display_title: "48_sql-attribute-constraints_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-attribute-constraints/"
parent_title: "속성 제약 NOT NULL·DEFAULT·CHECK"
description: "데이터베이스 설계 · 속성 제약 NOT NULL·DEFAULT·CHECK 검증 코드"
permalink: "/studies/database-design/code/48_sql-attribute-constraints_verify-sql/"
---
{% raw %}
[속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 48.속성 제약 NOT NULL·DEFAULT·CHECK 검증 (PostgreSQL 16)
--   SQLite와 갈리는 곳: 기본 키 열은 NOT NULL을 안 써도 NULL을 못 넣는다(슬라이드 10 p.15). SQLite는 받는다.
--   오류 번호: 23502 = NOT NULL 위반, 23514 = CHECK 위반
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_attribute_constraints CASCADE;
CREATE SCHEMA sql_attribute_constraints;
SET search_path TO sql_attribute_constraints;
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

-- 1. 기본 키에 든 열은 저절로 NOT NULL이다
CREATE TABLE P (Ssn CHAR(9), Name VARCHAR(15), PRIMARY KEY (Ssn));
DO $$ BEGIN
  ASSERT (SELECT is_nullable FROM information_schema.columns
          WHERE table_schema = 'sql_attribute_constraints' AND table_name = 'p' AND column_name = 'ssn') = 'NO',
         '기본 키 열이 NULL을 받는 열로 잡혀 있다';
  ASSERT (SELECT is_nullable FROM information_schema.columns
          WHERE table_schema = 'sql_attribute_constraints' AND table_name = 'p' AND column_name = 'name') = 'YES',
         '기본 키가 아닌 열은 NULL을 받아야 한다';
  ASSERT err_of($q$INSERT INTO P VALUES (NULL, 'x')$q$) = '23502', '기본 키에 NULL이 들어갔다';
END $$;

-- 2. 슬라이드 10 p.16~17: DEFAULT와 CHECK
CREATE TABLE EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,
  CONSTRAINT EMPPK PRIMARY KEY (Ssn));
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL CHECK (Dnumber > 0 AND Dnumber < 21),
  Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555', Mgr_start_date DATE,
  CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname));
INSERT INTO EMPLOYEE VALUES ('James', 'E', 'Borg', '888665555', '1937-11-10', '450 Stone, Houston, TX', 'M', 55000, NULL, 1);

DO $$ BEGIN
  -- NOT NULL
  ASSERT err_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES (NULL, 'Hatcher', '980760540')$q$) = '23502', 'Fname에 NULL';
  ASSERT err_of($q$INSERT INTO EMPLOYEE (Lname, Ssn) VALUES ('Hatcher', '980760540')$q$) = '23502', 'Fname을 빼먹음';
  -- DEFAULT
  ASSERT err_of($q$INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES ('Robert', 'Hatcher', '980760540')$q$) = 'OK', 'Dno를 안 적어도 된다';
  ASSERT (SELECT Dno FROM EMPLOYEE WHERE Ssn = '980760540') = 1, 'Dno의 기본값은 1';
  ASSERT (SELECT Super_ssn IS NULL AND Salary IS NULL FROM EMPLOYEE WHERE Ssn = '980760540'), 'DEFAULT가 없는 열은 NULL';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7)$q$) = 'OK', 'Mgr_ssn을 안 적어도 된다';
  ASSERT (SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 7) = '888665555', 'Mgr_ssn의 기본값';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber, Mgr_ssn) VALUES ('Legal', 8, NULL)$q$) = '23502', 'NULL을 직접 적으면 기본값으로 안 바뀐다';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber, Mgr_ssn) VALUES ('Legal', 8, DEFAULT)$q$) = 'OK', 'DEFAULT라고 적으면 기본값이 들어간다';
  ASSERT (SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 8) = '888665555', 'DEFAULT 낱말';
  -- CHECK
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Zero', 0)$q$) = '23514', '0은 범위 밖';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('TwentyOne', 21)$q$) = '23514', '21은 범위 밖';
  ASSERT err_of($q$INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('One', 1), ('Twenty', 20)$q$) = 'OK', '1과 20은 범위 안';
END $$;

-- 3. NOT NULL 없이 CHECK만 있으면 NULL은 통과한다
CREATE TABLE D (Dnumber INT CHECK (Dnumber > 0 AND Dnumber < 21));
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO D VALUES (NULL)$q$) = 'OK', 'CHECK는 NULL을 막지 않는다';
  ASSERT err_of($q$INSERT INTO D VALUES (0)$q$) = '23514', '0은 막는다';
  ASSERT (NULL::INT > 0 AND NULL::INT < 21) IS NULL, '조건의 값이 참도 거짓도 아니다';
END $$;

DROP SCHEMA sql_attribute_constraints CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
