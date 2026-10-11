---
layout: "note"
title: "72_order-by-clause-order_verify.sql"
display_title: "72_order-by-clause-order_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/order-by-clause-order/"
parent_title: "ORDER BY와 질의의 절 순서"
description: "데이터베이스 설계 · ORDER BY와 질의의 절 순서 검증 코드"
permalink: "/studies/database-design/code/72_order-by-clause-order_verify-sql/"
---
{% raw %}
[ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 72.ORDER BY와 질의의 절 순서: 슬라이드 11-2 p.35, 37, 12 p.12
-- PostgreSQL 16에서 실행한다. 모든 단언을 통과하면 마지막 줄에 ALL CHECKS PASSED가 나온다.
SET client_min_messages TO WARNING;
DROP SCHEMA IF EXISTS order_by_clause_order CASCADE;
CREATE SCHEMA order_by_clause_order;
SET search_path TO order_by_clause_order;

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

-- 1. Q15 (p.35): 16행, 직원이 서는 순서
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM DEPARTMENT AS D, EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P
          WHERE D.Dnumber = E.Dno AND E.Ssn = W.Essn AND W.Pno = P.Pnumber) = 16, 'Q15가 16행이 아니다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY rn) FROM (
            SELECT Lname, MIN(rn) AS rn FROM (
              SELECT E.Lname, ROW_NUMBER() OVER (ORDER BY D.Dname, E.Lname, E.Fname) AS rn
              FROM DEPARTMENT AS D, EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P
              WHERE D.Dnumber = E.Dno AND E.Ssn = W.Essn AND W.Pno = P.Pnumber) x
            GROUP BY Lname) y)
         = 'Jabbar,Wallace,Zelaya,Borg,English,Narayan,Smith,Wong', 'Q15의 직원 순서가 다르다';
END $$;

-- 2. 여섯 절을 모두 쓴 예
DO $$ BEGIN
  ASSERT (SELECT string_agg(Dno || ':' || N || ':' || Avg_sal::int, ',' ORDER BY Avg_sal DESC) FROM (
            SELECT Dno, COUNT(*) AS N, AVG(Salary) AS Avg_sal
            FROM EMPLOYEE
            WHERE Sex = 'M'
            GROUP BY Dno
            HAVING AVG(Salary) > 30000
            ORDER BY Avg_sal DESC) t) = '1:1:55000,5:3:36000', '여섯 절 예의 결과가 다르다';
END $$;

-- 3. SELECT에서 붙인 이름: ORDER BY에서는 되고, WHERE와 HAVING에서는 오류다 (SQLite는 둘 다 받는다)
DO $$ DECLARE ok1 boolean := false; ok2 boolean := false; BEGIN
  ASSERT (SELECT string_agg(Lname, ',') FROM (
            SELECT Lname, Salary * 12 AS Yearly FROM EMPLOYEE ORDER BY Yearly DESC LIMIT 2) t) = 'Borg,Wallace',
         'ORDER BY Yearly가 Borg, Wallace가 아니다';
  BEGIN
    EXECUTE $q$ SELECT Lname, Salary * 12 AS Yearly FROM EMPLOYEE WHERE Yearly > 400000 $q$;
  EXCEPTION WHEN undefined_column THEN ok1 := true;   -- column "yearly" does not exist
  END;
  BEGIN
    EXECUTE $q$ SELECT Dno, COUNT(*) AS N FROM EMPLOYEE GROUP BY Dno HAVING N > 2 $q$;
  EXCEPTION WHEN undefined_column THEN ok2 := true;
  END;
  ASSERT ok1 AND ok2, 'WHERE나 HAVING에서 SELECT의 이름이 오류를 내지 않았다';
END $$;

-- 4. NULL이 서는 자리: PostgreSQL은 오름차순에서 맨 뒤, 내림차순에서 맨 앞 (SQLite와 반대)
DO $$ BEGIN
  ASSERT (SELECT (array_agg(Lname ORDER BY Super_ssn, Lname))[8] FROM EMPLOYEE) = 'Borg', '오름차순의 끝이 Borg가 아니다';
  ASSERT (SELECT (array_agg(Lname ORDER BY Super_ssn DESC, Lname))[1] FROM EMPLOYEE) = 'Borg', '내림차순의 처음이 Borg가 아니다';
  ASSERT (SELECT (array_agg(Lname ORDER BY Super_ssn NULLS FIRST, Lname))[1] FROM EMPLOYEE) = 'Borg',
         'NULLS FIRST의 처음이 Borg가 아니다';
END $$;

-- 5. 여러 기준과 DESC
DO $$ BEGIN
  ASSERT (SELECT (array_agg(Lname ORDER BY Dno ASC, Salary DESC))[1:2] FROM EMPLOYEE) = ARRAY['Borg', 'Wallace']::varchar[],
         'ORDER BY Dno ASC, Salary DESC의 앞 두 행이 다르다';
  ASSERT (SELECT (array_agg(Lname ORDER BY Dno ASC, Salary DESC))[5:8] FROM EMPLOYEE)
         = ARRAY['Wong', 'Narayan', 'Smith', 'English']::varchar[], '5번 부서의 순서가 다르다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
