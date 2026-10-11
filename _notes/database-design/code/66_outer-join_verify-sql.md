---
layout: "note"
title: "66_outer-join_verify.sql"
display_title: "66_outer-join_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "66"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/outer-join/"
parent_title: "외부 조인"
description: "데이터베이스 설계 · 외부 조인 검증 코드"
permalink: "/studies/database-design/code/66_outer-join_verify-sql/"
---
{% raw %}
[외부 조인](/Hongs_Blog/studies/database-design/outer-join/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 66.외부 조인: 슬라이드 11-2 p.24~26, 12 p.8~9
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS outer_join CASCADE;
CREATE SCHEMA outer_join;
SET search_path TO outer_join;

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

-- 1. 내부 조인 7행, LEFT OUTER JOIN 8행 (p.24~25)
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn) = 7, '내부 조인이 7행이 아니다';
  ASSERT (SELECT COUNT(*) FROM (EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)) = 8,
         'LEFT OUTER JOIN이 8행이 아니다';
  ASSERT (SELECT string_agg(E.Lname, ',') FROM (EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)
          WHERE S.Lname IS NULL) = 'Borg', '빈칸으로 채운 행이 Borg가 아니다';
END $$;

-- 2. RIGHT 12행, FULL 13행
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM (EMPLOYEE AS E RIGHT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)) = 12,
         'RIGHT OUTER JOIN이 12행이 아니다';
  ASSERT (SELECT COUNT(*) FROM (EMPLOYEE AS E FULL OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)) = 13,
         'FULL OUTER JOIN이 13행이 아니다';
  ASSERT (SELECT string_agg(S.Lname, ',' ORDER BY S.Lname)
          FROM EMPLOYEE AS E RIGHT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn
          WHERE E.Ssn IS NULL) = 'English,Jabbar,Narayan,Smith,Zelaya', '부하 없는 직원이 5명이 아니다';
END $$;

-- 3. 짝 없는 행만 고르기 (p.26)
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn) = 12,
         '직원 LEFT OUTER JOIN 부양가족이 12행이 아니다';
  ASSERT (SELECT string_agg(E.Lname, ',' ORDER BY E.Lname)
          FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn
          WHERE D.Essn IS NULL) = 'Borg,English,Jabbar,Narayan,Zelaya', '부양가족 없는 직원이 5명이 아니다';
END $$;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E FULL OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn
          WHERE E.Ssn IS NULL OR S.Ssn IS NULL) = 6, 'FULL에서 짝 없는 행이 6행이 아니다';
END $$;

-- 4. COUNT(*)와 COUNT(열)
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) = 8 AND COUNT(S.Ssn) = 7
          FROM EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn), 'COUNT(*) 8, COUNT(S.Ssn) 7이 아니다';
  ASSERT (SELECT string_agg(Lname || ':' || n || ':' || k, ',' ORDER BY Lname) FROM (
            SELECT E.Lname, COUNT(*) AS n, COUNT(D.Essn) AS k
            FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn
            GROUP BY E.Ssn, E.Lname) t)
         = 'Borg:1:0,English:1:0,Jabbar:1:0,Narayan:1:0,Smith:3:3,Wallace:1:1,Wong:3:3,Zelaya:1:0',
         '직원별 COUNT(*)와 COUNT(D.Essn)이 다르다';
END $$;

-- 5. 조건을 ON에 둘 때와 WHERE에 둘 때
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn
          WHERE D.Relationship = 'Spouse') = 3, 'WHERE에 둔 판이 3행이 아니다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D
          ON E.Ssn = D.Essn AND D.Relationship = 'Spouse') = 8, 'ON에 둔 판이 8행이 아니다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
