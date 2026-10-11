---
layout: "note"
title: "63_sql-null_verify.sql"
display_title: "63_sql-null_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "63"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-null/"
parent_title: "NULL 값과 IS NULL"
description: "데이터베이스 설계 · NULL 값과 IS NULL 검증 코드"
permalink: "/studies/database-design/code/63_sql-null_verify-sql/"
---
{% raw %}
[NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 63.NULL 값과 IS NULL: 슬라이드 6-2 p.14, 11-2 p.18, 24~25, 28
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS sql_null CASCADE;
CREATE SCHEMA sql_null;
SET search_path TO sql_null;

-- COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7, 슬라이드 6-2 p.20~21).
-- 슬라이드의 DDL(9 p.18)은 Hours가 NOT NULL이지만 상태에 (888665555, 20, NULL)이 있어 NOT NULL을 뺐다.
-- 서로 가리키는 외래 키(EMPLOYEE.Dno <-> DEPARTMENT.Mgr_ssn)는 커밋할 때 검사하도록 미뤘다.
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn), FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
ALTER TABLE EMPLOYEE ADD FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED;
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE,
  Relationship VARCHAR(8),
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
INSERT INTO DEPARTMENT VALUES ('Research',5,'333445555','1988-05-22'),
 ('Administration',4,'987654321','1995-01-01'), ('Headquarters',1,'888665555','1981-06-19');
INSERT INTO DEPT_LOCATIONS VALUES (1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston');
INSERT INTO PROJECT VALUES ('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),
 ('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4);
INSERT INTO WORKS_ON VALUES ('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),
 ('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),
 ('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),
 ('987654321',20,15.0),('888665555',20,NULL);
INSERT INTO DEPENDENT VALUES ('333445555','Alice','F','1986-04-05','Daughter'),
 ('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),
 ('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),
 ('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse');
COMMIT;

-- 1. = NULL, <> NULL, IS NULL (p.18)
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = NULL) = 0, '= NULL이 0행이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn <> NULL) = 0, '<> NULL이 0행이 아니다';
  ASSERT (SELECT string_agg(Lname, ',') FROM EMPLOYEE WHERE Super_ssn IS NULL) = 'Borg', 'IS NULL이 Borg가 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NOT NULL) = 7, 'IS NOT NULL이 7행이 아니다';
END $$;

-- 2. 세 값 논리: 참, 거짓, 모름(NULL)
DO $$ BEGIN
  ASSERT (NULL = NULL) IS NULL, 'NULL = NULL이 모름이 아니다';
  ASSERT (NULL <> NULL) IS NULL, 'NULL <> NULL이 모름이 아니다';
  ASSERT (1 = NULL) IS NULL, '1 = NULL이 모름이 아니다';
  ASSERT (NULL IS NULL) IS TRUE, 'NULL IS NULL이 참이 아니다';
  ASSERT (NULL::boolean AND false) IS FALSE, '모름 AND 거짓이 거짓이 아니다';
  ASSERT (NULL::boolean AND true) IS NULL, '모름 AND 참이 모름이 아니다';
  ASSERT (NULL::boolean OR true) IS TRUE, '모름 OR 참이 참이 아니다';
  ASSERT (NULL::boolean OR false) IS NULL, '모름 OR 거짓이 모름이 아니다';
  ASSERT (NOT NULL::boolean) IS NULL, 'NOT 모름이 모름이 아니다';
END $$;

-- 3. 조건과 그 반대가 표 전체를 덮지 못한다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM WORKS_ON WHERE Hours > 10) = 8, 'Hours > 10이 8행이 아니다';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON WHERE Hours <= 10) = 7, 'Hours <= 10이 7행이 아니다';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON WHERE NOT (Hours > 10)) = 7, 'NOT (Hours > 10)이 7행이 아니다';
  ASSERT (SELECT COUNT(*) FROM WORKS_ON) = 16, '전체가 16행이 아니다';
  ASSERT (SELECT Hours + 1 FROM WORKS_ON WHERE Essn = '888665555') IS NULL, 'NULL + 1이 NULL이 아니다';
END $$;

-- 4. 조인에서 빠진다 (p.18, 24)
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn) = 7, '상사 조인이 7행이 아니다';
END $$;

-- 5. 집계 함수와 NULL (p.28의 물음)
DO $$ BEGIN
  ASSERT (SELECT ARRAY[COUNT(*), COUNT(Salary), COUNT(DISTINCT Salary), COUNT(Super_ssn), COUNT(DISTINCT Super_ssn)]
          FROM EMPLOYEE) = ARRAY[8, 8, 6, 7, 3]::bigint[], 'EMPLOYEE의 다섯 개수가 8, 8, 6, 7, 3이 아니다';
  ASSERT (SELECT COUNT(*) = 16 AND COUNT(Hours) = 15 AND SUM(Hours) = 275.0 AND ROUND(AVG(Hours), 2) = 18.33
          FROM WORKS_ON), 'WORKS_ON의 16, 15, 275, 18.33이 아니다';
  ASSERT (SELECT ROUND(SUM(Hours) / COUNT(*), 2) FROM WORKS_ON) = 17.19, '275 / 16이 17.19가 아니다';
  ASSERT (SELECT COUNT(*) = 3 AND COUNT(Hours) = 2 AND SUM(Hours) = 25.0 AND AVG(Hours) = 12.5
          FROM WORKS_ON WHERE Pno = 20), '프로젝트 20의 3, 2, 25, 12.5가 아니다';
END $$;

-- 6. GROUP BY와 DISTINCT는 NULL을 한 묶음으로 본다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM (SELECT Super_ssn FROM EMPLOYEE GROUP BY Super_ssn) t) = 4, '묶음이 4개가 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NULL GROUP BY Super_ssn) = 1, 'NULL 묶음이 1행이 아니다';
  ASSERT (SELECT COUNT(*) FROM (SELECT DISTINCT Super_ssn FROM EMPLOYEE) t) = 4, 'DISTINCT가 4개가 아니다';
END $$;

-- 7. NOT IN과 NULL
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn NOT IN (SELECT Super_ssn FROM EMPLOYEE)) = 0,
         'NULL이 섞인 NOT IN이 0행이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Ssn NOT IN (SELECT Super_ssn FROM EMPLOYEE WHERE Super_ssn IS NOT NULL))
         = 'English,Jabbar,Narayan,Smith,Zelaya', 'NULL을 걸러 낸 NOT IN이 5명이 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
