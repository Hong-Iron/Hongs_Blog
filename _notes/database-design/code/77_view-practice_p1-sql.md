---
layout: "note"
title: "77_view-practice_p1.sql"
display_title: "77_view-practice_p1.sql"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-practice/"
parent_title: "뷰 연습"
description: "데이터베이스 설계 · 뷰 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/77_view-practice_p1-sql/"
---
{% raw %}
[뷰 연습](/Hongs_Blog/studies/database-design/view-practice/) 문서의 문제 1 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 뷰 연습의 문제 1 (a~d)을 PostgreSQL 16에서 확인한다. SQLite 판은 77_view-practice_p1.py.
-- 문서: 77.뷰 연습
-- 확인하는 것:
--   1-a. 3행 4열. 75.뷰 문서의 DEPT_INFO와 이름이 같아 둘을 함께 만들 수는 없다.
--   1-b. Dno를 한정하지 않으면 오류다(열 이름이 모호하다). 고친 뷰는 4행.
--   1-c. GROUP BY P.Pnumber, P.Pname만 쓰면 PostgreSQL이 거부한다: SELECT의 D.Dname이 GROUP BY에 없다.
--        D.Dname을 GROUP BY에 더하면 6행.
--   1-d. 1-c와 같은 이름으로는 못 만든다. 이름을 바꾸면 6행(1-c와 같다).
--   덧붙임: SELECT Dname ... GROUP BY Dno도 거부된다(부서 이름을 고르고 부서 번호로 묶는 꼴).
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS view_practice_p1 CASCADE;
CREATE SCHEMA view_practice_p1;
SET search_path TO view_practice_p1;

-- COMPANY 스키마와 상태 (Elmasri 그림 5.6). WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다.
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

-- 1-a
CREATE VIEW DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary)
AS SELECT D.Dname, E.Fname, E.Lname, E.Salary
   FROM DEPARTMENT AS D, EMPLOYEE AS E
   WHERE D.Mgr_ssn=E.Ssn;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'view_practice_p1' AND table_name = 'dept_info') = 4, '1-a는 4열';
  ASSERT (SELECT string_agg(DeptName || '/' || MgrFname || '/' || MgrLname || '/' || MgrSalary::int, ' ' ORDER BY MgrSalary) FROM DEPT_INFO)
         = 'Research/Franklin/Wong/40000 Administration/Jennifer/Wallace/43000 Headquarters/James/Borg/55000', '1-a의 세 행';
END $$;

-- 같은 이름의 다른 뷰: 75.뷰 문서의 DEPT_INFO(Dept_name, No_of_emps, Total_sal)는 이 데이터베이스에 함께 둘 수 없다
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN
    EXECUTE 'CREATE VIEW DEPT_INFO(Dept_name, No_of_emps, Total_sal)
             AS SELECT Dname, COUNT (*), SUM (Salary) FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname';
  EXCEPTION WHEN duplicate_table THEN refused := true;
  END;
  ASSERT refused, '이름이 같은 뷰가 둘 만들어졌다';
END $$;

-- 1-b
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN   -- 틀리기 쉬운 판
    EXECUTE 'CREATE VIEW ResearchDept(Name, Supervisor, Salary)
             AS SELECT E.Fname, E.Lname, S,Fname, S,Lname, E.Salary
                FROM EMPLOYEE AS E, EMPLOYEE AS S
                WHERE E.Super_ssn = S.Ssn AND Dno IN ( SELECT D.Dnumber FROM DEPARTMENT AS D WHERE D.Dname=''Research'' )';
  EXCEPTION WHEN ambiguous_column THEN k := k + 1;        -- "S,Fname": 한정 안 된 Fname이 E 것인지 S 것인지 모른다
  END;
  BEGIN   -- 쉼표를 점으로 고친 뒤
    EXECUTE 'CREATE VIEW ResearchDept(Name, Supervisor, Salary)
             AS SELECT E.Fname, E.Lname, S.Fname, S.Lname, E.Salary
                FROM EMPLOYEE AS E, EMPLOYEE AS S
                WHERE E.Super_ssn = S.Ssn AND Dno IN ( SELECT D.Dnumber FROM DEPARTMENT AS D WHERE D.Dname=''Research'' )';
  EXCEPTION WHEN ambiguous_column THEN k := k + 1;        -- Dno가 E 것인지 S 것인지 모른다
  END;
  BEGIN   -- Dno까지 고친 뒤: 이름 3개, 항목 5개. 남은 두 열이 원래 이름 lname, salary를 쓰면서 Salary가 겹친다
    EXECUTE 'CREATE VIEW ResearchDept(Name, Supervisor, Salary)
             AS SELECT E.Fname, E.Lname, S.Fname, S.Lname, E.Salary
                FROM EMPLOYEE AS E, EMPLOYEE AS S
                WHERE E.Super_ssn = S.Ssn AND E.Dno IN ( SELECT D.Dnumber FROM DEPARTMENT AS D WHERE D.Dname=''Research'' )';
  EXCEPTION WHEN duplicate_column THEN k := k + 1;
  END;
  ASSERT k = 3, '1-b의 세 판이 모두 오류여야 한다';
END $$;

CREATE VIEW ResearchDept(Fname, Lname, SuperFname, SuperLname, Salary)
AS SELECT E.Fname, E.Lname, S.Fname, S.Lname, E.Salary
   FROM EMPLOYEE AS E, EMPLOYEE AS S
   WHERE E.Super_ssn = S.Ssn AND E.Dno IN ( SELECT D.Dnumber
                                            FROM DEPARTMENT AS D
                                            WHERE D.Dname='Research' );

DO $$ BEGIN
  ASSERT (SELECT string_agg(Lname || '<' || SuperLname || ':' || Salary::int, ' ' ORDER BY Lname) FROM ResearchDept)
         = 'English<Wong:25000 Narayan<Wong:38000 Smith<Wong:30000 Wong<Borg:40000', '1-b의 네 행';
END $$;

-- 1-c
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN   -- 틀리기 쉬운 판: GROUP BY에 D.Dname이 없다
    EXECUTE 'CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours)
             AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
                FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
                WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
                GROUP BY P.Pnumber, P.Pname';
  EXCEPTION WHEN grouping_error THEN refused := true;     -- "column d.dname must appear in the GROUP BY clause ..."
  END;
  ASSERT refused, '1-c의 D.Dname 빠진 판이 실행됐다';
END $$;

CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours)
AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
   FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
   WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
   GROUP BY P.Pnumber, P.Pname, D.Dname;

DO $$ BEGIN
  ASSERT (SELECT string_agg(Pname || '/' || Dname || '/' || NumEmployees || '/' || TotalHours, ' ' ORDER BY Pname) FROM ProjectInfo)
         = 'Computerization/Administration/3/55.0 Newbenefits/Administration/3/55.0 ProductX/Research/2/52.5 '
           'ProductY/Research/3/37.5 ProductZ/Research/2/50.0 Reorganization/Headquarters/3/25.0', '1-c의 여섯 행';
END $$;

-- 1-d
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN   -- 1-c와 같은 이름으로
    EXECUTE 'CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours)
             AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
                FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
                WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
                GROUP BY P.Pnumber, P.Pname, D.Dname
                HAVING COUNT(*) > 1';
  EXCEPTION WHEN duplicate_table THEN refused := true;    -- "relation projectinfo already exists"
  END;
  ASSERT refused, '같은 이름의 뷰가 또 만들어졌다';
END $$;

CREATE VIEW BusyProjectInfo(Pname, Dname, NumEmployees, TotalHours)
AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
   FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
   WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
   GROUP BY P.Pnumber, P.Pname, D.Dname
   HAVING COUNT(*) > 1;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM BusyProjectInfo) = 6, '1-d는 6행';
  ASSERT NOT EXISTS (SELECT * FROM ProjectInfo EXCEPT SELECT * FROM BusyProjectInfo), '1-d는 1-c와 같아야 한다';
  ASSERT (SELECT MIN(NumEmployees) FROM ProjectInfo) = 2, '가장 적은 프로젝트도 2명';
END $$;

-- 덧붙임: 부서 이름을 고르고 부서 번호(EMPLOYEE.Dno)로 묶는 꼴
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN
    EXECUTE 'SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber GROUP BY Dno';
  EXCEPTION WHEN grouping_error THEN refused := true;
  END;
  ASSERT refused, 'GROUP BY Dno에 Dname을 고른 질의가 실행됐다';
  -- DEPARTMENT의 기본 키 Dnumber로 묶으면 Dname을 골라도 된다(키가 같으면 이름도 하나로 정해지니까)
  ASSERT (SELECT COUNT(*) FROM (SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber GROUP BY Dnumber) AS T) = 3,
         'GROUP BY Dnumber는 받아야 한다';
  ASSERT (SELECT COUNT(*) FROM (SELECT Dname, COUNT(*) FROM EMPLOYEE, DEPARTMENT WHERE Dno = Dnumber GROUP BY Dno, Dname) AS T) = 3,
         'GROUP BY Dno, Dname';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
