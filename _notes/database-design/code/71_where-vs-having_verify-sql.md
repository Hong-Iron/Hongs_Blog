---
layout: "note"
title: "71_where-vs-having_verify.sql"
display_title: "71_where-vs-having_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "71"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/where-vs-having/"
parent_title: "WHERE와 HAVING 비교"
description: "데이터베이스 설계 · WHERE와 HAVING 비교 검증 코드"
permalink: "/studies/database-design/code/71_where-vs-having_verify-sql/"
---
{% raw %}
[WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 71.WHERE와 HAVING 비교: 슬라이드 11-2 p.33~34, 12주차 풀이 p.1~2
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS where_vs_having CASCADE;
CREATE SCHEMA where_vs_having;
SET search_path TO where_vs_having;

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

-- 1. 행을 거르기(WHERE)와 묶음을 거르기(HAVING)
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dno || ':' || n || ':' || a, ',' ORDER BY Dno DESC) FROM (
            SELECT Dno, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE WHERE Salary > 30000 GROUP BY Dno) t)
         = '5:2:39000,4:1:43000,1:1:55000', 'WHERE 판이 다르다';
  ASSERT (SELECT string_agg(Dno || ':' || n || ':' || a, ',' ORDER BY Dno DESC) FROM (
            SELECT Dno, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000) t)
         = '5:4:33250,4:3:31000,1:1:55000', 'HAVING 판이 다르다';
END $$;

-- 2. 12주차 풀이 Q1-2 (p.2). 적힌 그대로(GROUP BY Dno, SELECT Dname)는 PostgreSQL에서 오류다
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Dname, COUNT(*) AS Number_of_employees FROM EMPLOYEE, DEPARTMENT
                WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno HAVING AVG(Salary) > 30000 $q$;
  EXCEPTION WHEN grouping_error THEN ok := true;
  END;
  ASSERT ok, '풀이의 질의가 오류를 내지 않았다';
END $$;

-- 묶는 열에 Dname을 더해 돌리면 2행이고, 그려진 3행은 중첩 질의의 결과다
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno, Dname HAVING AVG(Salary) > 30000) t)
         = 'Headquarters:1,Research:3', 'WHERE에 Sex만 더한 판이 2행이 아니다';
  ASSERT (SELECT string_agg(Dname || ':' || n || ':' || a, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M' GROUP BY Dno, Dname) t)
         = 'Administration:1:25000,Headquarters:1:55000,Research:3:36000', '남자만의 평균이 다르다';
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE, DEPARTMENT
            WHERE Dno = Dnumber AND Sex = 'M'
              AND Dno IN (SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000)
            GROUP BY Dno, Dname) t)
         = 'Administration:1,Headquarters:1,Research:3', '중첩 질의 판이 3행이 아니다';
END $$;

-- 3. 둘을 함께 쓰기
DO $$ BEGIN
  ASSERT (SELECT string_agg(Pno || ':' || n, ',' ORDER BY Pno) FROM (
            SELECT Pno, COUNT(*) AS n FROM WORKS_ON WHERE Hours >= 20 GROUP BY Pno HAVING COUNT(*) >= 2) t)
         = '1:2,30:2', 'WHERE + HAVING 판이 다르다';
  ASSERT (SELECT string_agg(Pname, ',') FROM (
            SELECT Pnumber, Pname FROM PROJECT, WORKS_ON WHERE Pnumber = Pno AND Dnum = 5
            GROUP BY Pnumber, Pname HAVING COUNT(*) > 2) t) = 'ProductY', '카드의 답이 ProductY가 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
