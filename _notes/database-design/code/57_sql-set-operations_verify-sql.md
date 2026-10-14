---
layout: "note"
title: "57_sql-set-operations_verify.sql"
display_title: "57_sql-set-operations_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "57"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-set-operations/"
parent_title: "집합 연산 UNION·EXCEPT·INTERSECT"
description: "데이터베이스 설계 · 집합 연산 UNION·EXCEPT·INTERSECT 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/57_sql-set-operations_verify-sql/"
---
{% raw %}
[집합 연산 UNION·EXCEPT·INTERSECT](/Hongs_Blog/studies/database-design/sql-set-operations/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 57.집합 연산 UNION·EXCEPT·INTERSECT 검증 (PostgreSQL 16)
--   SQLite에 없는 EXCEPT ALL, INTERSECT ALL을 슬라이드 10-2 p.24의 R, S로 실제로 돌린다.
--   합칠 수 있는 조건(열 수와 자료형)을 어기면 나는 오류도 본다. 42601 = 열 수가 다름, 42804 = 자료형이 안 맞음
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_set_operations CASCADE;
CREATE SCHEMA sql_set_operations;
SET search_path TO sql_set_operations;
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

-- 슬라이드 10-2 p.24 그림 (a)
CREATE TABLE R (A VARCHAR(2));
CREATE TABLE S (A VARCHAR(2));
INSERT INTO R VALUES ('a1'), ('a2'), ('a2'), ('a3');
INSERT INTO S VALUES ('a1'), ('a2'), ('a4'), ('a5');

DO $$ BEGIN
  -- ALL이 붙은 판: 개수까지 센다 (그림 b, c, d)
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R UNION ALL SELECT A FROM S) T)
         = ARRAY['a1', 'a1', 'a2', 'a2', 'a2', 'a3', 'a4', 'a5'], 'R UNION ALL S';
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R EXCEPT ALL SELECT A FROM S) T) = ARRAY['a2', 'a3'], 'R EXCEPT ALL S';
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R INTERSECT ALL SELECT A FROM S) T) = ARRAY['a1', 'a2'], 'R INTERSECT ALL S';
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM S EXCEPT ALL SELECT A FROM R) T) = ARRAY['a4', 'a5'], 'S EXCEPT ALL R';
  -- ALL이 없는 판: 중복을 지운다
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R UNION SELECT A FROM S) T) = ARRAY['a1', 'a2', 'a3', 'a4', 'a5'], 'R UNION S';
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R EXCEPT SELECT A FROM S) T) = ARRAY['a3'], 'R EXCEPT S';
  ASSERT (SELECT ARRAY_AGG(A::TEXT ORDER BY A) FROM (SELECT A FROM R INTERSECT SELECT A FROM S) T) = ARRAY['a1', 'a2'], 'R INTERSECT S';
END $$;

DO $$ BEGIN
  -- Query 4 (슬라이드 10-2 p.23): 괄호까지 그대로
  ASSERT (SELECT ARRAY_AGG(Pnumber ORDER BY Pnumber) FROM (
            (SELECT DISTINCT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith')
            UNION
            (SELECT DISTINCT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Smith')) T)
         = ARRAY[1, 2], 'Query 4';
  -- Wong으로 바꾼 예
  ASSERT (SELECT ARRAY_AGG(Pnumber ORDER BY Pnumber) FROM (
            (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Wong')
            UNION
            (SELECT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Wong')) T)
         = ARRAY[1, 2, 3, 10, 20], 'Wong UNION';
  ASSERT (SELECT ARRAY_AGG(Pnumber ORDER BY Pnumber) FROM (
            (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Wong')
            UNION ALL
            (SELECT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Wong')) T)
         = ARRAY[1, 2, 2, 3, 3, 10, 20], 'Wong UNION ALL';
  ASSERT (SELECT ARRAY_AGG(Pnumber ORDER BY Pnumber) FROM (
            (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Wong')
            INTERSECT
            (SELECT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Wong')) T)
         = ARRAY[2, 3], 'Wong INTERSECT';
  ASSERT (SELECT ARRAY_AGG(Pnumber ORDER BY Pnumber) FROM (
            (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Wong')
            EXCEPT
            (SELECT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Wong')) T)
         = ARRAY[1], 'Wong 관리자 EXCEPT 일꾼';
  -- 월급: 4번 부서 {25000, 43000, 25000}에서 5번 부서 {30000, 40000, 38000, 25000}을 뺀다
  ASSERT (SELECT ARRAY_AGG(Salary::INT ORDER BY Salary) FROM (SELECT Salary FROM EMPLOYEE WHERE Dno = 4 EXCEPT SELECT Salary FROM EMPLOYEE WHERE Dno = 5) T)
         = ARRAY[43000], 'EXCEPT';
  ASSERT (SELECT ARRAY_AGG(Salary::INT ORDER BY Salary) FROM (SELECT Salary FROM EMPLOYEE WHERE Dno = 4 EXCEPT ALL SELECT Salary FROM EMPLOYEE WHERE Dno = 5) T)
         = ARRAY[25000, 43000], 'EXCEPT ALL';
  ASSERT (SELECT ARRAY_AGG(Salary::INT ORDER BY Salary) FROM (SELECT Salary FROM EMPLOYEE WHERE Dno = 4 INTERSECT ALL SELECT Salary FROM EMPLOYEE WHERE Dno = 5) T)
         = ARRAY[25000], 'INTERSECT ALL';
END $$;

DO $$ BEGIN
  -- 합칠 수 있는 조건
  ASSERT err_of($q$SELECT Ssn FROM EMPLOYEE UNION SELECT Dnumber, Dname FROM DEPARTMENT$q$) = '42601', '열 수가 다르면 오류';
  ASSERT err_of($q$SELECT Ssn FROM EMPLOYEE UNION SELECT Dnumber FROM DEPARTMENT$q$) = '42804', '글자와 정수는 못 합친다';
  ASSERT err_of($q$SELECT Lname FROM EMPLOYEE UNION SELECT Dname FROM DEPARTMENT$q$) = 'OK', '열 이름은 달라도 자료형이 맞으면 된다';
  ASSERT err_of($q$SELECT Salary FROM EMPLOYEE UNION SELECT Dnumber FROM DEPARTMENT$q$) = 'OK', '수끼리는 합쳐진다(뜻이 통하는지는 DBMS가 모른다)';
END $$;

DROP SCHEMA sql_set_operations CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
