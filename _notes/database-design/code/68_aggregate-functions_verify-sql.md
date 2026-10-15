---
layout: "note"
title: "68_aggregate-functions_verify.sql"
display_title: "68_aggregate-functions_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "68"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/aggregate-functions/"
parent_title: "집계 함수"
description: "데이터베이스 설계 · 집계 함수 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/68_aggregate-functions_verify-sql/"
---
{% raw %}
[집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 68.집계 함수 검증
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS aggregate_functions CASCADE;
CREATE SCHEMA aggregate_functions;
SET search_path TO aggregate_functions;

-- COMPANY 스키마와 상태 (Elmasri 그림 5.5~5.7).
-- 상태에 (888665555, 20, NULL)이 있어 Hours에는 NOT NULL을 걸지 않았다.
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

-- 1. Q19, Q21~Q23
DO $$ BEGIN
  ASSERT (SELECT SUM(Salary) = 281000 AND MAX(Salary) = 55000 AND MIN(Salary) = 25000 AND AVG(Salary) = 35125
          FROM EMPLOYEE), 'Q19가 281000, 55000, 25000, 35125가 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, 'Q21이 8이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE DNO = DNUMBER AND DNAME = 'Research') = 4, 'Q22가 4가 아니다';
  ASSERT (SELECT COUNT(DISTINCT Salary) FROM EMPLOYEE) = 6, 'Q23이 6이 아니다';
END $$;

-- 2. COUNT(Salary)의 물음과 NULL
DO $$ BEGIN
  ASSERT (SELECT COUNT(Salary) = 8 AND COUNT(Super_ssn) = 7 AND COUNT(DISTINCT Super_ssn) = 3 FROM EMPLOYEE),
         'COUNT(Salary) 8, COUNT(Super_ssn) 7, COUNT(DISTINCT Super_ssn) 3이 아니다';
  ASSERT (SELECT AVG(Hours) = SUM(Hours) / COUNT(Hours) AND ROUND(AVG(Hours), 2) = 18.33 FROM WORKS_ON),
         'AVG(Hours)가 275 / 15가 아니다';
END $$;

-- 3. 행이 없을 때
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) = 0 AND SUM(Salary) IS NULL AND MAX(Salary) IS NULL AND AVG(Salary) IS NULL
          FROM EMPLOYEE WHERE Dno = 9), '빈 입력의 COUNT 0, 나머지 NULL이 아니다';
END $$;

-- 4. 안쪽 질의에 쓴 COUNT와 최고 급여자
DO $$ BEGIN
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2) = 'Smith,Wong', '부양가족 둘 이상이 Smith, Wong이 아니다';
  ASSERT (SELECT string_agg(Lname, ',') FROM EMPLOYEE WHERE Salary = (SELECT MAX(Salary) FROM EMPLOYEE)) = 'Borg',
         '최고 급여자가 Borg가 아니다';
END $$;

-- 5. 집계 함수와 보통 열을 섞으면 PostgreSQL은 거부한다 (SQLite는 받는다)
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Lname, MAX(Salary) FROM EMPLOYEE $q$;
  EXCEPTION WHEN grouping_error THEN ok := true;   -- column must appear in the GROUP BY clause or be used in an aggregate function
  END;
  ASSERT ok, 'SELECT Lname, MAX(Salary)가 오류를 내지 않았다';
END $$;

-- 카드 C2
DO $$ BEGIN
  ASSERT (SELECT SUM(Salary) = 93000 AND MAX(Salary) = 43000 AND MIN(Salary) = 25000 AND AVG(Salary) = 31000
          FROM EMPLOYEE WHERE Dno = 4), '4번 부서가 93000, 43000, 25000, 31000이 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
