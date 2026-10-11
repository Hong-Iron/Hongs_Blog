---
layout: "note"
title: "70_complex-retrieval-practice_p1.sql"
display_title: "70_complex-retrieval-practice_p1.sql"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/complex-retrieval-practice/"
parent_title: "복잡한 검색 연습"
description: "데이터베이스 설계 · 복잡한 검색 연습 문제 1 풀이 코드"
permalink: "/studies/database-design/code/70_complex-retrieval-practice_p1-sql/"
---
{% raw %}
[복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/) 문서의 문제 1 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 70.복잡한 검색 연습 p1: 12주차 슬라이드 p.14~15, 풀이 p.1~2
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS complex_retrieval_practice_p1 CASCADE;
CREATE SCHEMA complex_retrieval_practice_p1;
SET search_path TO complex_retrieval_practice_p1;

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

-- Q1-1, Q1-2 풀이의 질의 그대로: GROUP BY Dno인데 SELECT에 Dname. PostgreSQL 16은 둘 다 거부한다
DO $$ DECLARE ok1 boolean := false; ok2 boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Dname, COUNT(*) AS Number_of_employees FROM EMPLOYEE, DEPARTMENT
                WHERE Dno = Dnumber GROUP BY Dno HAVING AVG(Salary) > 30000 $q$;
  EXCEPTION WHEN grouping_error THEN ok1 := true;
  END;
  BEGIN
    EXECUTE $q$ SELECT Dname, COUNT(*) AS Number_of_employees FROM EMPLOYEE, DEPARTMENT
                WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno HAVING AVG(Salary) > 30000 $q$;
  EXCEPTION WHEN grouping_error THEN ok2 := true;
  END;
  ASSERT ok1 AND ok2, '풀이의 질의가 오류를 내지 않았다';
END $$;

-- 묶는 열에 Dname을 더한 판
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dname || ':' || n || ':' || a, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber GROUP BY Dno, Dname HAVING AVG(Salary) > 30000) t)
         = 'Administration:3:31000,Headquarters:1:55000,Research:4:33250', 'Q1-1의 결과가 다르다';
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno, Dname HAVING AVG(Salary) > 30000) t)
         = 'Headquarters:1,Research:3', 'Q1-2 풀이의 질의가 2행이 아니다';
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M'
              AND Dno IN (SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000)
            GROUP BY Dno, Dname) t)
         = 'Administration:1,Headquarters:1,Research:3', 'Q1-2 중첩 질의가 3행이 아니다';
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M' AND Salary > 30000 GROUP BY Dno, Dname) t)
         = 'Headquarters:1,Research:2', '다른 해석의 결과가 다르다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
