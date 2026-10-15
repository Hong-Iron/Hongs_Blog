---
layout: "note"
title: "76_view-implementation_verify.sql"
display_title: "76_view-implementation_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "76"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-implementation/"
parent_title: "질의 수정과 뷰 실체화"
description: "데이터베이스 설계 · 질의 수정과 뷰 실체화 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/76_view-implementation_verify-sql/"
---
{% raw %}
[질의 수정과 뷰 실체화](/Hongs_Blog/studies/database-design/view-implementation/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 질의 수정과 뷰 실체화 검증. PostgreSQL 16에서 실행한다.
-- 문서: 76.질의 수정과 뷰 실체화
-- 확인하는 것:
--   1. 질의 수정: 보통 뷰에 던진 질의의 실행 계획에는 뷰 이름이 없고 기본 테이블 셋만 나온다.
--      뷰 정의를 손으로 풀어 쓴 질의와 실행 계획이 글자까지 같다.
--   2. 뷰 실체화: CREATE MATERIALIZED VIEW로 만든 것은 행을 실제로 저장한다(보통 뷰는 저장 크기 0).
--   3. 갱신 시점: 기본 테이블을 고친 뒤 보통 뷰는 바로 새 답을, 실체화된 뷰는 옛 답을 낸다.
--      REFRESH MATERIALIZED VIEW를 돌린 뒤에야 같아진다(PostgreSQL은 저절로 맞추지 않는다).
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS view_implementation CASCADE;
CREATE SCHEMA view_implementation;
SET search_path TO view_implementation;

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

CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON
  WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal) AS SELECT Dname, COUNT (*), SUM (Salary)
  FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;
ANALYZE;

-- 1. 질의 수정: 두 질의의 실행 계획을 글로 받아 견준다 (비용 숫자는 뺀다)
DO $$
DECLARE r record; on_view text := ''; on_base text := '';
BEGIN
  FOR r IN EXECUTE 'EXPLAIN (COSTS OFF) SELECT Fname, Lname FROM WORKS_ON1 WHERE Pname = ''ProductX''' LOOP
    on_view := on_view || r."QUERY PLAN" || E'\n';
  END LOOP;
  FOR r IN EXECUTE 'EXPLAIN (COSTS OFF) SELECT Fname, Lname FROM EMPLOYEE, PROJECT, WORKS_ON
                    WHERE Ssn = Essn AND Pno = Pnumber AND Pname = ''ProductX''' LOOP
    on_base := on_base || r."QUERY PLAN" || E'\n';
  END LOOP;
  ASSERT on_view = on_base, '뷰 질의와 풀어 쓴 질의의 실행 계획이 다르다';
  ASSERT on_view NOT ILIKE '%works_on1%', '실행 계획에 뷰 이름이 나온다';
  ASSERT on_view ILIKE '%employee%' AND on_view ILIKE '%project%' AND on_view ILIKE '%works_on%', '기본 테이블 셋이 다 나와야 한다';
  ASSERT (SELECT string_agg(Lname, ',' ORDER BY Lname) FROM WORKS_ON1 WHERE Pname = 'ProductX') = 'English,Smith', '답';
END $$;

-- 2. 실체화된 뷰는 행을 저장한다
CREATE MATERIALIZED VIEW DEPT_INFO_M AS SELECT * FROM DEPT_INFO;

DO $$ BEGIN
  ASSERT pg_relation_size('dept_info') = 0, '보통 뷰가 저장 자리를 쓴다';
  ASSERT pg_relation_size('dept_info_m') > 0, '실체화된 뷰가 저장 자리를 안 쓴다';
  ASSERT (SELECT relkind FROM pg_class WHERE oid = 'dept_info'::regclass) = 'v'
     AND (SELECT relkind FROM pg_class WHERE oid = 'dept_info_m'::regclass) = 'm', '종류 표시';
  ASSERT (SELECT Total_sal FROM DEPT_INFO_M WHERE Dept_name = 'Research') = 133000, '처음 값';
END $$;

-- 3. 기본 테이블을 고친다: Smith의 급여 30000 -> 33000
UPDATE EMPLOYEE SET Salary = 33000 WHERE Lname = 'Smith';

DO $$ BEGIN
  ASSERT (SELECT Total_sal FROM DEPT_INFO   WHERE Dept_name = 'Research') = 136000, '보통 뷰는 바로 새 답을 내야 한다';
  ASSERT (SELECT Total_sal FROM DEPT_INFO_M WHERE Dept_name = 'Research') = 133000, '실체화된 뷰는 아직 옛 답이어야 한다';
END $$;

REFRESH MATERIALIZED VIEW DEPT_INFO_M;

DO $$
DECLARE refused boolean := false;
BEGIN
  ASSERT (SELECT Total_sal FROM DEPT_INFO_M WHERE Dept_name = 'Research') = 136000, 'REFRESH 뒤에는 같아야 한다';
  -- 실체화된 뷰의 행은 사용자가 직접 고칠 수 없다
  BEGIN
    UPDATE DEPT_INFO_M SET Total_sal = 0;
  EXCEPTION WHEN wrong_object_type THEN refused := true;      -- "cannot change materialized view"
  END;
  ASSERT refused, '실체화된 뷰를 직접 고칠 수 있었다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
