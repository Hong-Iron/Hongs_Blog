---
layout: "note"
title: "74_sql-trigger_verify.sql"
display_title: "74_sql-trigger_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "74"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-trigger/"
parent_title: "트리거와 ECA 규칙"
description: "데이터베이스 설계 · 트리거와 ECA 규칙 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/74_sql-trigger_verify-sql/"
---
{% raw %}
[트리거와 ECA 규칙](/Hongs_Blog/studies/database-design/sql-trigger/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 트리거와 ECA 규칙 검증. PostgreSQL 16에서 실행한다.
-- 문서: 74.트리거와 ECA 규칙 / 출처: 11주차 슬라이드 11_SQL-DDL-Complex p.5, 9~13
-- 확인하는 것:
--   1. 슬라이드 p.10의 CREATE TRIGGER 문은 적힌 그대로는 구문 오류다. WHEN 안의 부질의도 PostgreSQL은 받지 않는다.
--      슬라이드가 쓴 열 이름 SUPERVISOR_SSN은 COMPANY의 EMPLOYEE에 없다(Super_ssn이다).
--   2. 조건을 함수 안으로 옮긴 판: 사건(삽입, Salary 수정, Super_ssn 수정)이 일어나고 조건이 참일 때만 알림이 쌓인다.
--   3. 사건 목록에 없는 열(Address)을 고치면 트리거가 아예 돌지 않는다.
--   4. 빠뜨린 사건: 상사의 급여를 내리면 부하가 상사보다 많이 받게 되는데 알림이 없다. 트리거를 하나 더 달면 잡힌다.
--   5. BEFORE 트리거는 새 행이 들어가기 전, AFTER 트리거는 들어간 뒤의 표를 본다.
--   6. 이 트리거는 알리기만 하고 막지 않는다(급여 45000인 행이 그대로 들어간다).
--   7. 트리거를 달기 전에 이미 있던 위반은 알려 주지 않는다. 문장 하나가 세 행을 고치면 트리거는 세 번 돈다.
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_trigger CASCADE;
CREATE SCHEMA sql_trigger;
SET search_path TO sql_trigger;

-- COMPANY 스키마와 상태 (슬라이드 6-2 p.21 = 13 p.16, 28). WORKS_ON.Hours는 상태에 NULL이 있어 NOT NULL을 뺐다.
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

-- 1. 슬라이드 p.10의 문장 그대로 (열 이름도 슬라이드대로 SALARY, SUPERVISOR_SSN)
DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    EXECUTE 'CREATE TRIGGER SALARY_VIOLATION BEFORE INSERT OR UPDATE OF SALARY, SUPERVISOR_SSN ON EMPLOYEE
             FOR EACH ROW WHEN (NEW.SALARY > (SELECT SALARY FROM EMPLOYEE WHERE SSN = NEW.SUPERVISOR_SSN))
             INFORM_SUPERVISOR(NEW.Supervisor_ssn, NEW.Ssn)';
  EXCEPTION WHEN syntax_error THEN ok := true;
  END;
  ASSERT ok, '슬라이드의 트리거 문이 그대로 실행됐다';
END $$;

-- 열 이름도 슬라이드와 COMPANY가 다르다: EMPLOYEE에는 SUPERVISOR_SSN이 없고 Super_ssn이 있다
CREATE FUNCTION do_nothing() RETURNS trigger AS $$ BEGIN RETURN NEW; END $$ LANGUAGE plpgsql;
DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    EXECUTE 'CREATE TRIGGER T_COL BEFORE INSERT OR UPDATE OF SALARY, SUPERVISOR_SSN ON EMPLOYEE
             FOR EACH ROW EXECUTE FUNCTION do_nothing()';
  EXCEPTION WHEN undefined_column THEN ok := true;       -- column "supervisor_ssn" of relation "employee" does not exist
  END;
  ASSERT ok, 'SUPERVISOR_SSN이라는 열이 받아들여졌다';
END $$;

-- 트리거를 달기 전에 이미 있는 위반: Narayan 38000 -> 41000 (상사 Wong 40000)
UPDATE EMPLOYEE SET Salary = 41000 WHERE Lname = 'Narayan';

-- 알림을 쌓는 표. 슬라이드의 INFORM_SUPERVISOR(상사 Ssn, 직원 Ssn)가 하는 일을 흉내 낸다.
CREATE TABLE NOTICE (Seq SERIAL, Supervisor_ssn CHAR(9), Emp_ssn CHAR(9));
CREATE TABLE FIRED (Seq SERIAL, What TEXT);            -- 트리거가 돌 때마다 한 줄 (사건 확인용)

CREATE FUNCTION inform_supervisor() RETURNS trigger AS $$
BEGIN
  INSERT INTO FIRED (What) VALUES (TG_OP);
  -- 조건(Condition): 새 급여가 직속 상사의 급여보다 많은가
  IF NEW.Salary > (SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn) THEN
    -- 동작(Action): 상사에게 알린다
    INSERT INTO NOTICE (Supervisor_ssn, Emp_ssn) VALUES (NEW.Super_ssn, NEW.Ssn);
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

-- WHEN 안에 부질의를 두면 PostgreSQL이 거부한다
DO $$
DECLARE ok boolean := false;
BEGIN
  BEGIN
    EXECUTE 'CREATE TRIGGER T_WHEN BEFORE INSERT OR UPDATE OF Salary, Super_ssn ON EMPLOYEE FOR EACH ROW
             WHEN (NEW.Salary > (SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn))
             EXECUTE FUNCTION inform_supervisor()';
  EXCEPTION WHEN feature_not_supported THEN ok := true;   -- "cannot use subquery in trigger WHEN condition"
  END;
  ASSERT ok, 'WHEN 안의 부질의가 받아들여졌다';
END $$;

-- 2. 사건(Event): EMPLOYEE에 삽입하거나 Salary, Super_ssn을 고치기 전에, 행마다
CREATE TRIGGER SALARY_VIOLATION
BEFORE INSERT OR UPDATE OF Salary, Super_ssn ON EMPLOYEE
FOR EACH ROW EXECUTE FUNCTION inform_supervisor();

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 0, '트리거를 달기 전의 위반(Narayan)은 알림이 없어야 한다';
  -- (가) 삽입, 조건 참: 상사 Wong(40000)보다 많은 45000
  INSERT INTO EMPLOYEE VALUES ('Kate','A','Lee','111223333','1980-03-03','1 Main, Houston, TX','F',45000,'333445555',5);
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 1, '(가) 알림 1건이어야 한다';
  ASSERT (SELECT Supervisor_ssn || '/' || Emp_ssn FROM NOTICE WHERE Seq = 1) = '333445555/111223333', '(가) 알림 내용';
  ASSERT (SELECT Salary FROM EMPLOYEE WHERE Ssn = '111223333') = 45000, '(가) 행은 그대로 들어간다(막지 않는다)';
  -- (나) 삽입, 조건 거짓: 20000
  INSERT INTO EMPLOYEE VALUES ('Paul','B','Roh','111224444','1981-04-04','2 Main, Houston, TX','M',20000,'333445555',5);
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 1, '(나) 알림이 늘면 안 된다';
  -- (다) 급여 수정, 조건 참: Smith 30000 -> 41000 (상사 Wong 40000)
  UPDATE EMPLOYEE SET Salary = 41000 WHERE Lname = 'Smith';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 2, '(다) 알림 2건이어야 한다';
  -- (라) 상사 바꾸기, 조건 참: Zelaya(25000)의 상사를 Roh(20000)로
  UPDATE EMPLOYEE SET Super_ssn = '111224444' WHERE Lname = 'Zelaya';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 3, '(라) 알림 3건이어야 한다';
  ASSERT (SELECT Supervisor_ssn || '/' || Emp_ssn FROM NOTICE WHERE Seq = 3) = '111224444/999887777', '(라) 알림 내용';
  -- (마) 상사가 없는 직원(Super_ssn이 NULL): 부질의가 빈 결과 -> 비교가 NULL -> 동작 안 함
  UPDATE EMPLOYEE SET Salary = 99000 WHERE Lname = 'Borg';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 3, '(마) 상사 없는 직원은 알림이 없어야 한다';
  ASSERT (SELECT COUNT(*) FROM FIRED) = 5, '(가)~(마)에서 트리거는 다섯 번 돌았어야 한다';
END $$;

-- 3. 사건 목록에 없는 열을 고치면 트리거가 돌지 않는다
DO $$ BEGIN
  UPDATE EMPLOYEE SET Address = '9 New Rd, Houston, TX' WHERE Lname = 'Smith';
  ASSERT (SELECT COUNT(*) FROM FIRED) = 5, 'Address 수정에 트리거가 돌았다';
  DELETE FROM EMPLOYEE WHERE Ssn = '111223333';
  ASSERT (SELECT COUNT(*) FROM FIRED) = 5, 'DELETE에 트리거가 돌았다';
END $$;

-- FOR EACH ROW: 문장 하나가 세 행을 고치면 트리거도 세 번 돈다 (셋 다 상사보다 적게 받아 알림은 없다)
DO $$ BEGIN
  UPDATE EMPLOYEE SET Salary = Salary + 1 WHERE Lname IN ('Roh', 'English', 'Jabbar');
  ASSERT (SELECT COUNT(*) FROM FIRED) = 8, '세 행을 고쳤으니 세 번 더 돌아야 한다';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 3, '조건이 거짓인 세 행에서 알림이 생겼다';
  UPDATE EMPLOYEE SET Salary = Salary - 1 WHERE Lname IN ('Roh', 'English', 'Jabbar');
  DELETE FROM FIRED WHERE Seq > 5;
END $$;

-- 4. 빠뜨린 사건: 상사 Wallace(43000)의 급여를 20000으로 내린다.
--    부하 Jabbar(25000)가 상사보다 많이 받게 되지만, 트리거는 Wallace의 행만 본다.
DO $$ BEGIN
  UPDATE EMPLOYEE SET Salary = 20000 WHERE Lname = 'Wallace';
  ASSERT (SELECT COUNT(*) FROM FIRED) = 6, '트리거는 Wallace 행에 한 번 돈다';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 3, '부하 쪽 위반은 알림이 없다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE E, EMPLOYEE S WHERE E.Super_ssn = S.Ssn AND E.Salary > S.Salary AND S.Lname = 'Wallace') = 1,
         'Jabbar가 Wallace보다 많이 받는 상태여야 한다';
  UPDATE EMPLOYEE SET Salary = 43000 WHERE Lname = 'Wallace';     -- 되돌린다 (FIRED 7)
END $$;

-- 사건을 하나 더 덮는 둘째 트리거: 누군가의 급여가 바뀐 뒤, 그 사람보다 많이 받는 부하마다 알린다
CREATE FUNCTION inform_about_subordinates() RETURNS trigger AS $$
BEGIN
  INSERT INTO NOTICE (Supervisor_ssn, Emp_ssn)
    SELECT NEW.Ssn, E.Ssn FROM EMPLOYEE E WHERE E.Super_ssn = NEW.Ssn AND E.Salary > NEW.Salary;
  RETURN NULL;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER SALARY_VIOLATION_SUP AFTER UPDATE OF Salary ON EMPLOYEE
FOR EACH ROW EXECUTE FUNCTION inform_about_subordinates();

DO $$ BEGIN
  UPDATE EMPLOYEE SET Salary = 20000 WHERE Lname = 'Wallace';
  ASSERT (SELECT COUNT(*) FROM NOTICE) = 4, '둘째 트리거가 Jabbar 건을 알려야 한다';
  ASSERT (SELECT Supervisor_ssn || '/' || Emp_ssn FROM NOTICE WHERE Seq = 4) = '987654321/987987987', '둘째 트리거 알림 내용';
END $$;

-- 5. BEFORE와 AFTER: 새 행이 들어가기 전과 뒤의 행 수
CREATE TABLE SEEN (Timing TEXT, Rows_in_table INT);
CREATE FUNCTION count_rows() RETURNS trigger AS $$
BEGIN
  INSERT INTO SEEN VALUES (TG_WHEN, (SELECT COUNT(*) FROM DEPT_LOCATIONS));
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER LOC_BEFORE BEFORE INSERT ON DEPT_LOCATIONS FOR EACH ROW EXECUTE FUNCTION count_rows();
CREATE TRIGGER LOC_AFTER  AFTER  INSERT ON DEPT_LOCATIONS FOR EACH ROW EXECUTE FUNCTION count_rows();

DO $$ BEGIN
  INSERT INTO DEPT_LOCATIONS VALUES (4, 'Dallas');
  ASSERT (SELECT Rows_in_table FROM SEEN WHERE Timing = 'BEFORE') = 5, 'BEFORE 트리거는 넣기 전의 5행을 봐야 한다';
  ASSERT (SELECT Rows_in_table FROM SEEN WHERE Timing = 'AFTER') = 6, 'AFTER 트리거는 넣은 뒤의 6행을 봐야 한다';
END $$;

-- 조건이 부질의 없이 NEW만 보면 WHEN에 쓸 수 있다. 조건이 거짓이면 함수가 불리지 않는다.
CREATE TABLE BIG_RAISE (Ssn CHAR(9), Old_salary DECIMAL(10,2), New_salary DECIMAL(10,2));
CREATE FUNCTION log_big_raise() RETURNS trigger AS $$
BEGIN INSERT INTO BIG_RAISE VALUES (NEW.Ssn, OLD.Salary, NEW.Salary); RETURN NULL; END $$ LANGUAGE plpgsql;
CREATE TRIGGER BIG_RAISE_TRG AFTER UPDATE OF Salary ON EMPLOYEE
FOR EACH ROW WHEN (NEW.Salary > OLD.Salary * 1.2) EXECUTE FUNCTION log_big_raise();

DO $$ BEGIN
  UPDATE EMPLOYEE SET Salary = 26000 WHERE Lname = 'English';     -- 25000 -> 26000, 4% 인상
  ASSERT (SELECT COUNT(*) FROM BIG_RAISE) = 0, '조건이 거짓인데 동작이 실행됐다';
  UPDATE EMPLOYEE SET Salary = 32000 WHERE Lname = 'English';     -- 26000 -> 32000, 23% 인상
  ASSERT (SELECT COUNT(*) FROM BIG_RAISE) = 1, '조건이 참인데 동작이 실행되지 않았다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
