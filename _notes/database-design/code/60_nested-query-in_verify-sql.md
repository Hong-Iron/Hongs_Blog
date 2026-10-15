---
layout: "note"
title: "60_nested-query-in_verify.sql"
display_title: "60_nested-query-in_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "60"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/nested-query-in/"
parent_title: "중첩 질의와 IN"
description: "데이터베이스 설계 · 중첩 질의와 IN 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/60_nested-query-in_verify-sql/"
---
{% raw %}
[중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 60.중첩 질의와 IN 검증
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS nested_query_in CASCADE;
CREATE SCHEMA nested_query_in;
SET search_path TO nested_query_in;

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

-- 1. Q4A: Smith -> {1, 2}
DO $$ BEGIN
  ASSERT (SELECT string_agg(Pnumber::text, ',' ORDER BY Pnumber) FROM (
            SELECT DISTINCT Pnumber FROM PROJECT
            WHERE Pnumber IN (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE
                              WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith')
               OR Pnumber IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith')) t) = '1,2',
         'Q4A의 결과가 1, 2가 아니다';
END $$;

-- 2. Q17: 명시적 집합
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM (SELECT DISTINCT Essn FROM WORKS_ON WHERE Pno IN (1, 2, 3)) t) = 4, 'Q17이 4행이 아니다';
END $$;

-- 3. Q16과 이름이 겹칠 때: 별칭이 없으면 Sex = Sex는 안쪽 표(DEPENDENT)의 Sex끼리 견준다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E
          WHERE E.Ssn IN (SELECT D.Essn FROM DEPENDENT AS D
                          WHERE E.Fname = D.Dependent_name AND E.Sex = D.Sex)) = 0, 'Q16이 0행이 아니다';
  ASSERT (SELECT string_agg(E.Lname, ',' ORDER BY E.Lname) FROM EMPLOYEE AS E
          WHERE E.Ssn IN (SELECT D.Essn FROM DEPENDENT AS D WHERE E.Sex = D.Sex)) = 'Smith,Wong',
         '별칭을 붙인 판이 Smith, Wong이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Ssn IN (SELECT Essn FROM DEPENDENT WHERE Sex = Sex)) = 'Smith,Wallace,Wong',
         '별칭 없는 판이 Smith, Wallace, Wong이 아니다';
END $$;

-- 4. 값 하나를 돌려주는 안쪽 질의
DO $$ BEGIN
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2) = 'Smith,Wong',
         '부양가족 둘 이상이 Smith, Wong이 아니다';
  ASSERT (SELECT string_agg(E.Lname, ',' ORDER BY E.Lname) FROM EMPLOYEE AS E
          WHERE E.Super_ssn = (SELECT S.Ssn FROM EMPLOYEE AS S WHERE S.Fname = 'Franklin' AND S.Lname = 'Wong'))
         = 'English,Narayan,Smith', '한 행짜리 안쪽 질의 앞의 = 가 3명이 아니다';
END $$;

-- 5. 틀리기 쉬운 답(= 로 쓴 상사의 상사 질의): = 뒤의 안쪽 질의가 2행이면 PostgreSQL은 오류를 낸다 (SQLite는 첫 행만 쓴다)
DO $$ DECLARE ok boolean := false; BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn = '888665555') = 2, '안쪽 질의가 2행이 아니다';
  BEGIN
    EXECUTE $q$ SELECT Fname, Minit, Lname FROM EMPLOYEE
                WHERE Super_ssn = (SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555') $q$;
  EXCEPTION WHEN cardinality_violation THEN ok := true;   -- more than one row returned by a subquery used as an expression
  END;
  ASSERT ok, '여러 행 부질의 앞의 = 가 오류를 내지 않았다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Super_ssn IN (SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555'))
         = 'English,Jabbar,Narayan,Smith,Zelaya', 'IN으로 고친 판이 5명이 아니다';
END $$;

-- 예제와 카드 C2
DO $$ BEGIN
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Ssn IN (SELECT Essn FROM WORKS_ON
                        WHERE Pno IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith')))
         = 'English,Smith,Wong', '두 겹 중첩 예제가 English, Smith, Wong이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Dno IN (SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston'))
         = 'Borg,English,Narayan,Smith,Wong', '카드 C2가 5명이 아니다';
END $$;

-- 카드 C3: (a)는 안쪽이 한 행이라 = 가 돌고, (b)는 두 행이라 = 가 오류다
DO $$ DECLARE ok boolean := false; BEGIN
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM EMPLOYEE
          WHERE Dno = (SELECT Dnumber FROM DEPARTMENT WHERE Dname = 'Research')) = 'English,Narayan,Smith,Wong',
         '카드 C3 (a)가 4명이 아니다';
  BEGIN
    EXECUTE $q$ SELECT Lname FROM EMPLOYEE
                WHERE Dno = (SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston') $q$;
  EXCEPTION WHEN cardinality_violation THEN ok := true;
  END;
  ASSERT ok, '카드 C3 (b)의 = 가 오류를 내지 않았다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
