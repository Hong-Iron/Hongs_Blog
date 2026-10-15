---
layout: "note"
title: "53_referential-triggered-actions_verify.sql"
display_title: "53_referential-triggered-actions_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "53"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/referential-triggered-actions/"
parent_title: "참조 동작 SET NULL·CASCADE·SET DEFAULT"
description: "데이터베이스 설계 · 참조 동작 SET NULL·CASCADE·SET DEFAULT 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/53_referential-triggered-actions_verify-sql/"
---
{% raw %}
[참조 동작 SET NULL·CASCADE·SET DEFAULT](/Hongs_Blog/studies/database-design/referential-triggered-actions/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 53.참조 동작 SET NULL·CASCADE·SET DEFAULT 검증 (PostgreSQL 16)
--   문서의 DDL을 그대로 만들고 문서의 물음을 실제로 돌린다.
--   오류 번호: 23503 = 외래 키 위반(거부), 23502 = NOT NULL 위반, 42601 = 구문 오류
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS referential_triggered_actions CASCADE;
CREATE SCHEMA referential_triggered_actions;
SET search_path TO referential_triggered_actions;
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

-- COMPANY 스키마와 상태.
-- 제약 이름, DEFAULT, 참조 동작은 문서에 적힌 그대로다. 문서가 동작을 적지 않은
-- PROJECT, WORKS_ON, DEPENDENT의 외래 키에는 아무 동작도 붙이지 않았다(기본값: 거부).
-- EMPLOYEE와 DEPARTMENT가 서로를 가리키므로 EMPLOYEE의 외래 키 두 개는 행을 넣은 뒤 ALTER TABLE로 붙인다.
CREATE TABLE EMPLOYEE (
  Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,
  CONSTRAINT EMPPK PRIMARY KEY (Ssn));
CREATE TABLE DEPARTMENT (
  Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555', Mgr_start_date DATE,
  CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname),
  CONSTRAINT DEPTMGRFK FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET DEFAULT ON UPDATE CASCADE);
CREATE TABLE DEPT_LOCATIONS (
  Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE);
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
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)
  ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- EMPLOYEE 한 표만 따로 떼어 낸 것 (CASCADE 물음용). 외래 키 동작만 바꿔 가며 쓴다.
CREATE TABLE EMP_NULL AS SELECT * FROM EMPLOYEE;
ALTER TABLE EMP_NULL ADD PRIMARY KEY (Ssn);
ALTER TABLE EMP_NULL ADD FOREIGN KEY (Super_ssn) REFERENCES EMP_NULL(Ssn) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE EMP_CASC AS SELECT * FROM EMPLOYEE;
ALTER TABLE EMP_CASC ADD PRIMARY KEY (Ssn);
ALTER TABLE EMP_CASC ADD FOREIGN KEY (Super_ssn) REFERENCES EMP_CASC(Ssn) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE EMP_NONE AS SELECT * FROM EMPLOYEE;
ALTER TABLE EMP_NONE ADD PRIMARY KEY (Ssn);
ALTER TABLE EMP_NONE ADD FOREIGN KEY (Super_ssn) REFERENCES EMP_NONE(Ssn);

-- 1. 동작을 안 적으면 거부한다
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM EMP_NONE WHERE Ssn = '333445555'$q$) = '23503', '부하가 있는 Wong이 지워졌다';
  ASSERT err_of($q$UPDATE EMP_NONE SET Ssn = '444335555' WHERE Ssn = '333445555'$q$) = '23503', '가리키는 행이 있는데 번호가 바뀌었다';
END $$;

-- 2. EMPLOYEE 한 표: ON DELETE SET NULL, ON UPDATE CASCADE
BEGIN;
DELETE FROM EMP_NULL WHERE Ssn = '333445555';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMP_NULL) = 7, 'Wong 한 행만 사라져야 한다';
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMP_NULL WHERE Super_ssn IS NULL) = ARRAY['Borg', 'English', 'Narayan', 'Smith'],
         'Wong의 부하 셋의 Super_ssn이 NULL이 되어야 한다';
END $$;
ROLLBACK;
BEGIN;
UPDATE EMP_NULL SET Ssn = '444335555' WHERE Ssn = '333445555';
DO $$ BEGIN
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMP_NULL WHERE Super_ssn = '444335555') = ARRAY['English', 'Narayan', 'Smith'],
         '새 번호가 부하 셋에게 따라 들어가야 한다';
END $$;
ROLLBACK;

-- 3. 여섯 표가 다 있을 때
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM EMPLOYEE WHERE Ssn = '333445555'$q$) = '23503', 'WORKS_ON과 DEPENDENT가 가리키므로 거부되어야 한다';
  ASSERT err_of($q$UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = '333445555'$q$) = '23503', '같은 까닭으로 거부되어야 한다';
END $$;
BEGIN;
DELETE FROM WORKS_ON WHERE Essn = '333445555';
DELETE FROM DEPENDENT WHERE Essn = '333445555';
SAVEPOINT cleared;
DELETE FROM EMPLOYEE WHERE Ssn = '333445555';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Lname IN ('Smith', 'Narayan', 'English') AND Super_ssn IS NULL) = 3, 'EMPSUPERFK: SET NULL';
  ASSERT (SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 5) = '888665555', 'DEPTMGRFK: SET DEFAULT';
END $$;
ROLLBACK TO cleared;
UPDATE EMPLOYEE SET Ssn = '444335555' WHERE Ssn = '333445555';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = '444335555') = 3, 'EMPSUPERFK: UPDATE CASCADE';
  ASSERT (SELECT Mgr_ssn FROM DEPARTMENT WHERE Dnumber = 5) = '444335555', 'DEPTMGRFK: UPDATE CASCADE';
END $$;
ROLLBACK;

-- 부서를 지울 때: EMPDEPTFK는 SET DEFAULT, DEPT_LOCATIONS는 CASCADE, PROJECT는 거부
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM DEPARTMENT WHERE Dnumber = 5$q$) = '23503', 'PROJECT가 가리키므로 거부되어야 한다';
END $$;
BEGIN;
DELETE FROM WORKS_ON WHERE Pno IN (1, 2, 3);
DELETE FROM PROJECT WHERE Dnum = 5;
DELETE FROM DEPARTMENT WHERE Dnumber = 5;
DO $$ BEGIN
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMPLOYEE WHERE Dno = 1) = ARRAY['Borg', 'English', 'Narayan', 'Smith', 'Wong'],
         '5번 부서 네 명이 기본 부서 1번으로 옮겨져야 한다';
  ASSERT (SELECT COUNT(*) FROM DEPT_LOCATIONS) = 2, '5번 부서의 위치 세 행이 함께 지워져야 한다';
END $$;
ROLLBACK;

-- SET DEFAULT의 기본값이 가리키는 행까지 사라지면 거부된다
BEGIN;
DELETE FROM WORKS_ON WHERE Essn = '888665555';
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM EMPLOYEE WHERE Ssn = '888665555'$q$) = '23503', '기본 관리자 Borg는 지울 수 없다';
END $$;
ROLLBACK;

-- SET NULL은 NOT NULL인 외래 키와 함께 못 쓴다
CREATE TABLE D (Dnumber INT PRIMARY KEY);
CREATE TABLE E (Ssn CHAR(9) PRIMARY KEY, Dno INT NOT NULL REFERENCES D(Dnumber) ON DELETE SET NULL);
INSERT INTO D VALUES (1);
INSERT INTO E VALUES ('1', 1);
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM D WHERE Dnumber = 1$q$) = '23502', 'NOT NULL 열을 NULL로 만들 수는 없다';
END $$;

-- 4. EMPSUPERFK가 ON DELETE CASCADE일 때
BEGIN;
DELETE FROM EMP_CASC WHERE Lname = 'Wong';
DO $$ BEGIN
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMP_CASC) = ARRAY['Borg', 'Jabbar', 'Wallace', 'Zelaya'], 'Wong과 부하 셋이 사라져야 한다';
END $$;
ROLLBACK;
BEGIN;
DELETE FROM EMP_CASC WHERE Lname = 'Borg';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMP_CASC) = 0, 'Borg를 지우면 여덟 명이 모두 사라져야 한다';
END $$;
ROLLBACK;
BEGIN;
DELETE FROM EMP_NULL WHERE Lname = 'Borg';
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMP_NULL) = 7, 'SET NULL이면 Borg 한 행만 사라진다';
  ASSERT (SELECT ARRAY_AGG(Lname::TEXT ORDER BY Lname) FROM EMP_NULL WHERE Super_ssn IS NULL) = ARRAY['Wallace', 'Wong'], '두 사람의 상사 칸이 빈다';
END $$;
ROLLBACK;
-- 여섯 표가 다 있을 때 EMPSUPERFK만 CASCADE로 바꾸면: 다른 외래 키(DEPTMGRFK의 SET DEFAULT가 가리킬 Borg)가 막는다
BEGIN;
ALTER TABLE EMPLOYEE DROP CONSTRAINT EMPSUPERFK;
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE ON UPDATE CASCADE;
DO $$ BEGIN
  ASSERT err_of($q$DELETE FROM EMPLOYEE WHERE Lname = 'Borg'$q$) = '23503', '여섯 표가 다 있으면 다른 외래 키가 막는다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, '거부되면 아무 행도 안 지워진다';
END $$;
ROLLBACK;

-- 5. 문법이 아닌 것
DO $$ BEGIN
  ASSERT err_of($q$DELETE EMPLOYEE WHERE Lname = 'Borg'$q$) = '42601', 'FROM이 없는 DELETE는 구문 오류';
  ASSERT err_of($q$CREATE TABLE X (a INT REFERENCES D(Dnumber) ON DELETE REJECT)$q$) = '42601', 'REJECT는 SQL 낱말이 아니다';
  ASSERT err_of($q$CREATE TABLE X1 (a INT REFERENCES D(Dnumber) ON DELETE RESTRICT ON UPDATE NO ACTION)$q$) = 'OK', '거부를 적는 낱말은 RESTRICT와 NO ACTION';
END $$;

DROP SCHEMA referential_triggered_actions CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
