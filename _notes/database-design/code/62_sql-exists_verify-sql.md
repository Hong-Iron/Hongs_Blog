---
layout: "note"
title: "62_sql-exists_verify.sql"
display_title: "62_sql-exists_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "62"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-exists/"
parent_title: "EXISTS와 NOT EXISTS"
description: "데이터베이스 설계 · EXISTS와 NOT EXISTS 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/62_sql-exists_verify-sql/"
---
{% raw %}
[EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 62.EXISTS와 NOT EXISTS 검증
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS sql_exists CASCADE;
CREATE SCHEMA sql_exists;
SET search_path TO sql_exists;

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

-- 1. Q6, EXISTS 판, Q16B, 부양가족이 있는 관리자
DO $$ BEGIN
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)) = 'Borg,English,Jabbar,Narayan,Zelaya',
         'Q6이 5명이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)) = 'Smith,Wallace,Wong', 'EXISTS 판이 3명이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E
          WHERE EXISTS (SELECT * FROM DEPENDENT AS D
                        WHERE E.Ssn = D.Essn AND E.Sex = D.Sex AND E.Fname = D.Dependent_name)) = 0, 'Q16B가 0행이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)
            AND EXISTS (SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn)) = 'Wallace,Wong', '부양가족이 있는 관리자가 Wallace, Wong이 아니다';
END $$;

-- 2. 바깥 행을 쓰지 않는 안쪽 질의는 모든 행에 같은 답을 준다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE EXISTS (SELECT * FROM DEPENDENT)) = 8, '8행이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT)) = 0, '0행이 아니다';
END $$;

-- 3. "부양가족이 모두 여성" = "여성이 아닌 부양가족이 없다". 부양가족이 없는 직원도 뽑힌다
DO $$ BEGIN
  ASSERT (SELECT string_agg(E.Lname, ',' ORDER BY E.Lname) FROM EMPLOYEE AS E
          WHERE NOT EXISTS (SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn AND D.Sex <> 'F'))
         = 'Borg,English,Jabbar,Narayan,Zelaya', 'NOT EXISTS 판이 부양가족 없는 5명이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E
          WHERE NOT EXISTS (SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn AND D.Sex <> 'F')
            AND EXISTS (SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn)) = 0, '부양가족이 있어야 한다는 판이 0명이 아니다';
END $$;

-- 4. UNIQUE(부질의): PostgreSQL 16은 "UNIQUE predicate is not yet implemented"로 거부한다
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Fname, Lname FROM EMPLOYEE WHERE UNIQUE (SELECT * FROM DEPENDENT WHERE Ssn = Essn) $q$;
  EXCEPTION WHEN feature_not_supported THEN ok := true;
  END;
  ASSERT ok, 'UNIQUE(부질의)가 feature_not_supported 오류를 내지 않았다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE
          WHERE NOT EXISTS (SELECT 1 FROM DEPENDENT WHERE Ssn = Essn
                            GROUP BY Essn, Dependent_name, Sex, Bdate, Relationship HAVING COUNT(*) > 1)) = 8,
         'UNIQUE를 바꿔 쓴 판이 8명이 아니다';
END $$;

-- 5. NOT EXIST (S가 빠짐)는 구문 오류다
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Fname FROM EMPLOYEE WHERE NOT EXIST (SELECT * FROM DEPENDENT WHERE Ssn = Essn) $q$;
  EXCEPTION WHEN syntax_error THEN ok := true;
  END;
  ASSERT ok, 'NOT EXIST가 구문 오류를 내지 않았다';
END $$;

-- 카드 C2
DO $$ BEGIN
  ASSERT (SELECT string_agg(D.Dname, ',') FROM DEPARTMENT AS D
          WHERE NOT EXISTS (SELECT * FROM PROJECT AS P WHERE P.Dnum = D.Dnumber AND P.Plocation = 'Houston'))
         = 'Administration', '카드 C2가 Administration이 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
