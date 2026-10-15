---
layout: "note"
title: "73_sql-assertion_verify.sql"
display_title: "73_sql-assertion_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "73"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-assertion/"
parent_title: "주장 CREATE ASSERTION"
description: "데이터베이스 설계 · 주장 CREATE ASSERTION 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/73_sql-assertion_verify-sql/"
---
{% raw %}
[주장 CREATE ASSERTION](/Hongs_Blog/studies/database-design/sql-assertion/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 주장(CREATE ASSERTION) 검증. PostgreSQL 16에서 실행한다.
-- 문서: 73.주장 CREATE ASSERTION
-- 확인하는 것:
--   1. 문서의 CREATE ASSERTION 문은 PostgreSQL 16도 받지 않는다(문법은 알아보지만 "not yet implemented").
--   2. CHECK 안에 부질의를 넣는 길도 막혀 있다.
--   3. 주장 안의 점검 질의는 COMPANY 상태에서 0행, 규칙을 깨는 직원을 넣으면 1행이다.
--   4. 실제로 막으려면 트리거를 쓴다: 규칙을 깨는 삽입을 오류로 거부한다(74.트리거와 ECA 규칙).
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_assertion CASCADE;
CREATE SCHEMA sql_assertion;
SET search_path TO sql_assertion;

-- COMPANY 스키마와 상태. WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다.
-- EMPLOYEE와 DEPARTMENT는 서로 가리키므로 외래 키를 커밋 때 검사한다(DEFERRABLE INITIALLY DEFERRED).
CREATE TABLE EMPLOYEE (Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL,
  Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
  PRIMARY KEY (Ssn));
CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
  PRIMARY KEY (Dnumber), UNIQUE (Dname), FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED);
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED;
CREATE TABLE DEPT_LOCATIONS (Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE PROJECT (Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
  PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber));
CREATE TABLE WORKS_ON (Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
  PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber));
CREATE TABLE DEPENDENT (Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
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
INSERT INTO DEPARTMENT VALUES ('Research',5,'333445555','1988-05-22'),('Administration',4,'987654321','1995-01-01'),('Headquarters',1,'888665555','1981-06-19');
INSERT INTO DEPT_LOCATIONS VALUES (1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston');
INSERT INTO PROJECT VALUES ('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4);
INSERT INTO WORKS_ON VALUES ('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),('987654321',20,15.0),('888665555',20,NULL);
INSERT INTO DEPENDENT VALUES ('333445555','Alice','F','1986-04-05','Daughter'),('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse');
COMMIT;

-- 1. 문서의 문장 그대로
DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    EXECUTE 'CREATE ASSERTION SALARY_CONSTRAINT CHECK (NOT EXISTS (SELECT * FROM EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
             WHERE E.Salary > M.Salary AND E.Dno = D.Dnumber AND D.Mgr_ssn = M.Ssn))';
  EXCEPTION WHEN feature_not_supported THEN ok := true;      -- "CREATE ASSERTION is not yet implemented"
  END;
  ASSERT ok, 'CREATE ASSERTION이 실행됐다';
END $$;

-- 2. CHECK 안의 부질의
DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    EXECUTE 'ALTER TABLE EMPLOYEE ADD CONSTRAINT SAL_CK CHECK (Salary <= (SELECT MAX(Salary) FROM EMPLOYEE))';
  EXCEPTION WHEN feature_not_supported THEN ok := true;      -- "cannot use subquery in check constraint"
  END;
  ASSERT ok, 'CHECK 안의 부질의가 받아들여졌다';
END $$;

-- 3. 점검 질의: 부서장보다 많이 받는 직원
CREATE VIEW SALARY_VIOLATORS AS
  SELECT E.Lname AS Emp, M.Lname AS Mgr, D.Dname
  FROM EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
  WHERE E.Salary > M.Salary AND E.Dno = D.Dnumber AND D.Mgr_ssn = M.Ssn;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM SALARY_VIOLATORS) = 0, 'COMPANY 상태에서 위반이 있다';
  ASSERT (SELECT NOT EXISTS (SELECT * FROM SALARY_VIOLATORS)), '주장이 거짓이다';
END $$;

INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',45000,'333445555',5);

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM SALARY_VIOLATORS) = 1, '새 직원 뒤 위반은 1행이어야 한다';
  ASSERT (SELECT Emp || '>' || Mgr || '@' || Dname FROM SALARY_VIOLATORS) = 'Lee>Wong@Research', '위반 행이 다르다';
END $$;

DELETE FROM EMPLOYEE WHERE Ssn = '111223333';

-- 4. 트리거로 막기: 직원을 넣거나 급여·부서를 바꿀 때 부서장 급여를 넘으면 거부한다.
--    (부서장 급여 인하, 부서장 교체까지 막으려면 그 사건마다 트리거가 더 있어야 한다.)
CREATE FUNCTION reject_over_manager() RETURNS trigger AS $$
BEGIN
  IF NEW.Salary > (SELECT M.Salary FROM DEPARTMENT D, EMPLOYEE M WHERE D.Dnumber = NEW.Dno AND D.Mgr_ssn = M.Ssn) THEN
    RAISE EXCEPTION 'salary % is greater than the manager''s', NEW.Salary;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER SALARY_CONSTRAINT_TRG BEFORE INSERT OR UPDATE OF Salary, Dno ON EMPLOYEE
FOR EACH ROW EXECUTE FUNCTION reject_over_manager();

DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',45000,'333445555',5);
  EXCEPTION WHEN raise_exception THEN ok := true;
  END;
  ASSERT ok, '트리거가 삽입을 막지 못했다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, '거부된 행이 들어갔다';
  INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',39000,'333445555',5);
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 9, '규칙을 지키는 행이 안 들어갔다';
  -- 이 트리거가 못 보는 사건: 부서장 Wong의 급여를 내린다. 트리거는 Wong의 행만 보고 통과시킨다.
  UPDATE EMPLOYEE SET Salary = 35000 WHERE Lname = 'Wong';
  ASSERT (SELECT COUNT(*) FROM SALARY_VIOLATORS) = 2, '부서장 급여 인하 뒤 위반은 Lee, Narayan 2행이어야 한다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
