---
layout: "note"
title: "69_group-by_verify.sql"
display_title: "69_group-by_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "69"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/group-by/"
parent_title: "GROUP BY"
description: "데이터베이스 설계 · GROUP BY 검증 코드"
permalink: "/studies/database-design/code/69_group-by_verify-sql/"
---
{% raw %}
[GROUP BY](/Hongs_Blog/studies/database-design/group-by/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 69.GROUP BY: 슬라이드 11-2 p.31~32, 12 p.11, 풀이 S p.26, 12s p.1~2, 4, 6
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS group_by CASCADE;
CREATE SCHEMA group_by;
SET search_path TO group_by;

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

-- 1. Q24 (p.31), Q25 (p.32)
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dno || ':' || n || ':' || a, ',' ORDER BY Dno DESC) FROM (
            SELECT Dno, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE GROUP BY Dno) t)
         = '5:4:33250,4:3:31000,1:1:55000', 'Q24가 (5, 4, 33250), (4, 3, 31000), (1, 1, 55000)이 아니다';
  ASSERT (SELECT string_agg(Pnumber || ':' || n, ',' ORDER BY Pnumber) FROM (
            SELECT Pnumber, Pname, COUNT(*) AS n FROM PROJECT, WORKS_ON WHERE Pnumber = Pno GROUP BY Pnumber, Pname) t)
         = '1:2,2:3,3:2,10:3,20:3,30:3', 'Q25가 2, 3, 2, 3, 3, 3이 아니다';
END $$;

-- 2. 풀이 슬라이드의 꼴: GROUP BY E.Dno인데 SELECT에 Dname. PostgreSQL 16은 거부한다 (SQLite는 받는다)
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Dname, COUNT(*) FROM EMPLOYEE AS E, DEPARTMENT AS D
                WHERE E.Dno = D.Dnumber GROUP BY E.Dno HAVING AVG(E.Salary) > 30000 $q$;
  EXCEPTION WHEN grouping_error THEN ok := true;
  END;
  ASSERT ok, 'GROUP BY E.Dno에 SELECT Dname이 오류를 내지 않았다';
END $$;

-- 3. 고친 꼴 둘: Dname도 묶는 열에 넣거나, DEPARTMENT의 기본 키 Dnumber로 묶는다
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE AS E, DEPARTMENT AS D
            WHERE E.Dno = D.Dnumber GROUP BY E.Dno, D.Dname HAVING AVG(E.Salary) > 30000) t)
         = 'Administration:3,Headquarters:1,Research:4', 'GROUP BY E.Dno, D.Dname 판의 결과가 다르다';
  ASSERT (SELECT string_agg(Dname || ':' || n, ',' ORDER BY Dname) FROM (
            SELECT Dname, COUNT(*) AS n FROM EMPLOYEE AS E, DEPARTMENT AS D
            WHERE E.Dno = D.Dnumber GROUP BY D.Dnumber HAVING AVG(E.Salary) > 30000) t)
         = 'Administration:3,Headquarters:1,Research:4', 'GROUP BY D.Dnumber 판의 결과가 다르다';
  -- Q25에서 Pname을 빼도 Pnumber가 PROJECT의 기본 키라 받는다
  ASSERT (SELECT COUNT(*) FROM (SELECT Pnumber, Pname, COUNT(*) FROM PROJECT, WORKS_ON
                                WHERE Pnumber = Pno GROUP BY Pnumber) t) = 6, 'GROUP BY Pnumber 판이 6행이 아니다';
END $$;

-- 4. 묶음 안에서 값이 여럿인 열은 어느 쪽으로도 못 쓴다
DO $$ DECLARE ok boolean := false; BEGIN
  BEGIN
    EXECUTE $q$ SELECT Dno, Lname, COUNT(*) FROM EMPLOYEE GROUP BY Dno $q$;
  EXCEPTION WHEN grouping_error THEN ok := true;
  END;
  ASSERT ok, 'SELECT Dno, Lname ... GROUP BY Dno가 오류를 내지 않았다';
END $$;

-- 5. COUNT(*)와 COUNT(열), 열 둘로 묶기, NULL 묶음
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) = 3 AND COUNT(Hours) = 2 FROM WORKS_ON WHERE Pno = 20), '프로젝트 20이 3, 2가 아니다';
  ASSERT (SELECT string_agg(Dno || Sex || ':' || n || ':' || a, ',' ORDER BY Dno, Sex) FROM (
            SELECT Dno, Sex, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE GROUP BY Dno, Sex) t)
         = '1M:1:55000,4F:2:34000,4M:1:25000,5F:1:25000,5M:3:36000', '(Dno, Sex) 다섯 묶음이 다르다';
  ASSERT (SELECT string_agg(Sex || ':' || n || ':' || a, ',' ORDER BY Sex) FROM (
            SELECT Sex, COUNT(*) AS n, AVG(Salary)::int AS a FROM EMPLOYEE GROUP BY Sex) t)
         = 'F:3:31000,M:5:37600', 'Sex 두 묶음이 다르다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NULL GROUP BY Super_ssn) = 1, 'NULL 묶음이 1행이 아니다';
  ASSERT (SELECT string_agg(Dnum || ':' || n, ',' ORDER BY Dnum DESC) FROM (
            SELECT Dnum, COUNT(*) AS n FROM PROJECT GROUP BY Dnum) t) = '5:3,4:2,1:1', '카드 C2가 다르다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
