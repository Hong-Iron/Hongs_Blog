---
layout: "note"
title: "35_relational-database-schema_verify.sql"
display_title: "35_relational-database-schema_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relational-database-schema/"
parent_title: "관계형 데이터베이스 스키마와 상태"
description: "데이터베이스 설계 · 관계형 데이터베이스 스키마와 상태 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/35_relational-database-schema_verify-sql/"
---
{% raw %}
[관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 문서: 35.관계형 데이터베이스 스키마와 상태 (PostgreSQL 16에서 실행)
-- 출처: Elmasri & Navathe, Fundamentals of Database Systems의 COMPANY 스키마와 상태, CREATE TABLE 문
-- 확인하는 것:
--   1. EMPLOYEE와 DEPARTMENT는 서로 가리킨다. 아직 없는 표를 가리키는 외래 키는 표를 만들 때 거부된다
--      (SQLite는 받는다). 그래서 표를 먼저 만들고 외래 키를 나중에 붙인다.
--   2. 교재 CREATE TABLE 문의 자료형(길이까지 검사된다)과 제약으로 문서의 상태 45행이 들어간다. 단 Hours는 NULL을 받게 해야 한다.
--   3. Hours를 NOT NULL로 하면 (888665555, 20, NULL) 때문에 거부된다.
--   4. 기본 키 6개, 외래 키 8개가 카탈로그에 있다.
DROP SCHEMA IF EXISTS relational_database_schema CASCADE;
CREATE SCHEMA relational_database_schema;
SET search_path TO relational_database_schema;

-- 1. 아직 없는 DEPARTMENT를 가리키면 오류
DO $$ BEGIN
  CREATE TABLE EMPLOYEE (Ssn CHAR(9) PRIMARY KEY, Dno INT NOT NULL REFERENCES DEPARTMENT(Dnumber));
  RAISE EXCEPTION '없는 표를 가리키는 외래 키가 만들어져 버렸다';
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE TABLE EMPLOYEE
 ( Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL, Bdate DATE,
   Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,
   PRIMARY KEY (Ssn) );
CREATE TABLE DEPARTMENT
 ( Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,
   PRIMARY KEY (Dnumber), UNIQUE (Dname) );
CREATE TABLE DEPT_LOCATIONS
 ( Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,
   PRIMARY KEY (Dnumber, Dlocation), FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) );
CREATE TABLE PROJECT
 ( Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,
   PRIMARY KEY (Pnumber), UNIQUE (Pname), FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber) );
CREATE TABLE WORKS_ON
 ( Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),
   PRIMARY KEY (Essn, Pno), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn), FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber) );
CREATE TABLE DEPENDENT
 ( Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),
   PRIMARY KEY (Essn, Dependent_name), FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn) );
-- 서로 가리키는 외래 키 셋은 표가 다 생긴 뒤에 붙이고, 검사를 커밋 때로 미룬다
ALTER TABLE EMPLOYEE ADD FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE EMPLOYEE ADD FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE DEPARTMENT ADD FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) DEFERRABLE INITIALLY DEFERRED;

-- 2. 상태를 넣는다 (문서의 COMPANY 상태)
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
INSERT INTO DEPARTMENT VALUES ('Research',5,'333445555','1988-05-22'), ('Administration',4,'987654321','1995-01-01'),
 ('Headquarters',1,'888665555','1981-06-19');
INSERT INTO DEPT_LOCATIONS VALUES (1,'Houston'), (4,'Stafford'), (5,'Bellaire'), (5,'Sugarland'), (5,'Houston');
INSERT INTO PROJECT VALUES ('ProductX',1,'Bellaire',5), ('ProductY',2,'Sugarland',5), ('ProductZ',3,'Houston',5),
 ('Computerization',10,'Stafford',4), ('Reorganization',20,'Houston',1), ('Newbenefits',30,'Stafford',4);
INSERT INTO WORKS_ON VALUES ('123456789',1,32.5), ('123456789',2,7.5), ('666884444',3,40.0), ('453453453',1,20.0),
 ('453453453',2,20.0), ('333445555',2,10.0), ('333445555',3,10.0), ('333445555',10,10.0), ('333445555',20,10.0),
 ('999887777',30,30.0), ('999887777',10,10.0), ('987987987',10,35.0), ('987987987',30,5.0), ('987654321',30,20.0),
 ('987654321',20,15.0), ('888665555',20,NULL);
INSERT INTO DEPENDENT VALUES ('333445555','Alice','F','1986-04-05','Daughter'), ('333445555','Theodore','M','1983-10-25','Son'),
 ('333445555','Joy','F','1958-05-03','Spouse'), ('987654321','Abner','M','1942-02-28','Spouse'),
 ('123456789','Michael','M','1988-01-04','Son'), ('123456789','Alice','F','1988-12-30','Daughter'),
 ('123456789','Elizabeth','F','1967-05-05','Spouse');
COMMIT;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM DEPARTMENT) = 3
     AND (SELECT COUNT(*) FROM DEPT_LOCATIONS) = 5 AND (SELECT COUNT(*) FROM PROJECT) = 6
     AND (SELECT COUNT(*) FROM WORKS_ON) = 16 AND (SELECT COUNT(*) FROM DEPENDENT) = 7, '행 수는 8, 3, 5, 6, 16, 7';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Super_ssn IS NULL) = 1, 'Super_ssn이 NULL인 직원은 Borg 하나';
END $$;

-- 3. Hours를 NOT NULL로
DO $$ BEGIN
  ALTER TABLE WORKS_ON ALTER COLUMN Hours SET NOT NULL;
  RAISE EXCEPTION 'NULL인 Hours가 있는데 NOT NULL이 걸려 버렸다';
EXCEPTION WHEN not_null_violation THEN NULL;
END $$;

-- 4. 카탈로그
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.table_constraints
          WHERE table_schema = 'relational_database_schema' AND constraint_type = 'PRIMARY KEY') = 6, '기본 키 6개';
  ASSERT (SELECT COUNT(*) FROM information_schema.table_constraints
          WHERE table_schema = 'relational_database_schema' AND constraint_type = 'FOREIGN KEY') = 8, '외래 키 8개';
  ASSERT (SELECT string_agg(kcu.table_name || '.' || kcu.column_name, ' ' ORDER BY kcu.table_name, kcu.ordinal_position)
          FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
          WHERE tc.table_schema = 'relational_database_schema' AND tc.constraint_type = 'PRIMARY KEY')
       = 'department.dnumber dependent.essn dependent.dependent_name dept_locations.dnumber dept_locations.dlocation employee.ssn project.pnumber works_on.essn works_on.pno',
         '기본 키 속성이 문서 스키마 표의 기본 키와 같아야 한다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
