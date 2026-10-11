---
layout: "note"
title: "77_view-update-problem_verify.sql"
display_title: "77_view-update-problem_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/view-update-problem/"
parent_title: "뷰 갱신 문제"
description: "데이터베이스 설계 · 뷰 갱신 문제 검증 코드"
permalink: "/studies/database-design/code/77_view-update-problem_verify-sql/"
---
{% raw %}
[뷰 갱신 문제](/Hongs_Blog/studies/database-design/view-update-problem/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 뷰 갱신 문제 검증. PostgreSQL 16에서 실행한다(SQLite는 모든 뷰가 읽기 전용이라 이 내용을 못 보인다).
-- 문서: 77.뷰 갱신 문제, 78.뷰와 기본 테이블 비교 / 출처: 13주차 슬라이드 13-View p.17~24
-- 확인하는 것:
--   1. p.18, 24: 표 하나에서 만든 집계 없는 뷰(DEPT5EMP)는 UPDATE·INSERT·DELETE를 받고, 그 결과가 기본 테이블에 남는다.
--   2. p.24: 기본 키와 NOT NULL 열이 빠진 뷰(BASIC_EMP_DATA)에는 INSERT가 안 된다. (PostgreSQL은 UPDATE·DELETE는 받는다.)
--   3. 뷰 조건을 벗어나는 행: 그냥 뷰는 받아 주고 그 행은 뷰에서 사라진다. WITH CHECK OPTION을 붙이면 거부한다.
--   4. p.19~21: 조인으로 만든 뷰(WORKS_ON1)는 UPDATE·INSERT·DELETE를 모두 거부한다.
--   5. p.21: 길 (a)와 (b)를 기본 테이블에 직접 돌리면, 슬라이드의 COMPANY 상태에서는 둘 다 유일성 제약에 걸린다.
--      제약을 뗀 복사본에서는 둘 다 뷰의 그 행을 ProductY로 바꾸지만, (b)는 English의 행까지 바꾼다.
--   6. p.22: 집계로 만든 뷰(DEPT_INFO)는 UPDATE를 거부한다. Total_sal을 100000으로 만드는 기본 테이블 수정은 여러 가지다.
--   7. p.23: INSTEAD OF 트리거로 길을 정해 주면 조인 뷰도 UPDATE를 받는다.
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS view_update_problem CASCADE;
CREATE SCHEMA view_update_problem;
SET search_path TO view_update_problem;

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

CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON
  WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal) AS SELECT Dname, COUNT (*), SUM (Salary)
  FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;
CREATE VIEW DEPT5EMP AS SELECT * FROM EMPLOYEE WHERE Dno = 5;
CREATE VIEW BASIC_EMP_DATA AS SELECT Fname, Lname, Address FROM EMPLOYEE;

-- PostgreSQL이 스스로 매긴 "고칠 수 있는 뷰인가"
DO $$ BEGIN
  ASSERT (SELECT string_agg(table_name || '=' || is_updatable, ' ' ORDER BY table_name)
          FROM information_schema.views WHERE table_schema = 'view_update_problem')
         = 'basic_emp_data=YES dept5emp=YES dept_info=NO works_on1=NO', 'is_updatable';
END $$;

-- 1. 표 하나, 집계 없음: 세 갱신 모두 기본 테이블로 간다
DO $$ BEGIN
  UPDATE DEPT5EMP SET Salary = 31000 WHERE Lname = 'Smith';
  ASSERT (SELECT Salary FROM EMPLOYEE WHERE Ssn = '123456789') = 31000, '뷰에 한 UPDATE가 EMPLOYEE에 안 남았다';
  INSERT INTO DEPT5EMP VALUES ('Tom','A','Kim','111111111','1990-01-01','1 Elm, Houston, TX','M',20000,'333445555',5);
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 9 AND (SELECT COUNT(*) FROM DEPT5EMP) = 5, '뷰에 한 INSERT';
  DELETE FROM DEPT5EMP WHERE Lname = 'Kim';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM DEPT5EMP) = 4, '뷰에 한 DELETE';
  UPDATE DEPT5EMP SET Salary = 30000 WHERE Lname = 'Smith';
END $$;

-- 2. 기본 키(Ssn)와 NOT NULL 열(Dno)이 빠진 뷰
DO $$
DECLARE refused boolean := false;
BEGIN
  BEGIN
    INSERT INTO BASIC_EMP_DATA VALUES ('Zed', 'Yoon', '3 Oak, Dallas, TX');
  EXCEPTION WHEN not_null_violation THEN refused := true;       -- Ssn 자리에 넣을 값이 없다
  END;
  ASSERT refused, '키가 빠진 뷰에 INSERT가 됐다';
  UPDATE BASIC_EMP_DATA SET Address = '9 New Rd, Houston, TX' WHERE Lname = 'Smith';
  ASSERT (SELECT Address FROM EMPLOYEE WHERE Ssn = '123456789') = '9 New Rd, Houston, TX', 'PostgreSQL은 이 UPDATE를 받는다';
  UPDATE EMPLOYEE SET Address = '731 Fondren, Houston, TX' WHERE Ssn = '123456789';
END $$;

DO $$ BEGIN     -- 키가 빠진 뷰의 DELETE도 PostgreSQL은 받는다
  INSERT INTO EMPLOYEE VALUES ('Zed','Q','Yoon','444444444',NULL,'3 Oak, Dallas, TX','M',20000,NULL,1);
  DELETE FROM BASIC_EMP_DATA WHERE Lname = 'Yoon';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8, 'BASIC_EMP_DATA로 한 DELETE가 EMPLOYEE에 안 남았다';
END $$;

-- 키가 없는 뷰에서는 행 하나를 집어낼 수 없다: 급여만 보이는 뷰에서 25000인 "한 명"만 고칠 길이 없다
CREATE VIEW SALARIES AS SELECT Salary FROM EMPLOYEE;
DO $$
DECLARE n int;
BEGIN
  UPDATE SALARIES SET Salary = 26000 WHERE Salary = 25000;
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 3, '25000을 받는 세 사람(Zelaya, English, Jabbar)이 한꺼번에 바뀌어야 한다';
  UPDATE EMPLOYEE SET Salary = 25000 WHERE Salary = 26000;
END $$;

-- 3. 뷰 조건(Dno = 5)을 벗어나는 행
CREATE VIEW DEPT5EMP_CK AS SELECT * FROM EMPLOYEE WHERE Dno = 5 WITH CHECK OPTION;
DO $$
DECLARE refused boolean := false; n int;
BEGIN
  INSERT INTO DEPT5EMP VALUES ('Ann','B','Lee','222222222','1991-02-02','2 Elm, Houston, TX','F',20000,'987654321',4);
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE WHERE Ssn = '222222222') = 1, '4번 부서 행이 기본 테이블에 들어가야 한다';
  ASSERT (SELECT COUNT(*) FROM DEPT5EMP WHERE Ssn = '222222222') = 0, '그 행은 뷰에 안 보여야 한다';
  DELETE FROM DEPT5EMP WHERE Ssn = '222222222';
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 0, '뷰에 안 보이는 행은 뷰로 지울 수 없다';
  DELETE FROM EMPLOYEE WHERE Ssn = '222222222';

  UPDATE DEPT5EMP SET Dno = 4 WHERE Lname = 'English';
  ASSERT (SELECT COUNT(*) FROM DEPT5EMP) = 3, '부서를 옮긴 행은 뷰에서 사라진다';
  UPDATE EMPLOYEE SET Dno = 5 WHERE Lname = 'English';

  BEGIN
    INSERT INTO DEPT5EMP_CK VALUES ('Ann','B','Lee','222222222','1991-02-02','2 Elm, Houston, TX','F',20000,'987654321',4);
  EXCEPTION WHEN with_check_option_violation THEN refused := true;
  END;
  ASSERT refused, 'WITH CHECK OPTION이 조건 밖 INSERT를 막지 못했다';
  refused := false;
  BEGIN
    UPDATE DEPT5EMP_CK SET Dno = 4 WHERE Lname = 'English';
  EXCEPTION WHEN with_check_option_violation THEN refused := true;
  END;
  ASSERT refused, 'WITH CHECK OPTION이 조건 밖으로 나가는 UPDATE를 막지 못했다';
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 8 AND (SELECT COUNT(*) FROM DEPT5EMP) = 4, '거부 뒤 상태는 그대로';
END $$;

-- 4. 조인 뷰: p.20의 UPDATE와 INSERT, DELETE
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN
    UPDATE WORKS_ON1 SET Pname = 'ProductY' WHERE Lname = 'Smith' AND Fname = 'John' AND Pname = 'ProductX';
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;      -- "cannot update view works_on1"
  END;
  BEGIN
    INSERT INTO WORKS_ON1 VALUES ('John', 'Smith', 'ProductZ', 5.0);
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;
  END;
  BEGIN
    DELETE FROM WORKS_ON1 WHERE Lname = 'Smith';
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;
  END;
  ASSERT k = 3, '조인 뷰가 갱신을 받았다';
END $$;

-- 5. p.21의 두 길을 기본 테이블에 직접 돌린다. Smith는 이미 ProductY에서도 일하고, Pname은 UNIQUE다.
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN   -- (a)
    UPDATE WORKS_ON SET Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = 'ProductY')
    WHERE Essn IN (SELECT Ssn FROM EMPLOYEE WHERE Lname = 'Smith' AND Fname = 'John')
      AND Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = 'ProductX');
  EXCEPTION WHEN unique_violation THEN k := k + 1;      -- WORKS_ON의 기본 키 (123456789, 2)가 이미 있다
  END;
  BEGIN   -- (b)
    UPDATE PROJECT SET Pname = 'ProductY' WHERE Pname = 'ProductX';
  EXCEPTION WHEN unique_violation THEN k := k + 1;      -- UNIQUE (Pname): ProductY가 이미 있다
  END;
  ASSERT k = 2, '슬라이드 상태에서 (a)와 (b)는 둘 다 유일성 제약에 걸려야 한다';
END $$;

-- 제약을 뗀 복사본 두 벌에서 두 길의 효과를 본다
CREATE TABLE EA AS SELECT * FROM EMPLOYEE;  CREATE TABLE PA AS SELECT * FROM PROJECT;  CREATE TABLE WA AS SELECT * FROM WORKS_ON;
CREATE TABLE EB AS SELECT * FROM EMPLOYEE;  CREATE TABLE PB AS SELECT * FROM PROJECT;  CREATE TABLE WB AS SELECT * FROM WORKS_ON;
CREATE VIEW VA AS SELECT Fname, Lname, Pname, Hours FROM EA, PA, WA WHERE Ssn = Essn AND Pno = Pnumber;
CREATE VIEW VB AS SELECT Fname, Lname, Pname, Hours FROM EB, PB, WB WHERE Ssn = Essn AND Pno = Pnumber;

UPDATE WA SET Pno = (SELECT Pnumber FROM PA WHERE Pname = 'ProductY')
WHERE Essn IN (SELECT Ssn FROM EA WHERE Lname = 'Smith' AND Fname = 'John')
  AND Pno = (SELECT Pnumber FROM PA WHERE Pname = 'ProductX');                      -- (a)
UPDATE PB SET Pname = 'ProductY' WHERE Pname = 'ProductX';                          -- (b)

DO $$ BEGIN
  -- 두 길 모두 뷰에서 바라던 효과를 낸다: (John, Smith, ProductX, 32.5) -> (John, Smith, ProductY, 32.5)
  ASSERT (SELECT COUNT(*) FROM VA WHERE Lname = 'Smith' AND Pname = 'ProductX') = 0
     AND (SELECT COUNT(*) FROM VA WHERE Lname = 'Smith' AND Pname = 'ProductY' AND Hours = 32.5) = 1, '(a)의 효과';
  ASSERT (SELECT COUNT(*) FROM VB WHERE Lname = 'Smith' AND Pname = 'ProductX') = 0
     AND (SELECT COUNT(*) FROM VB WHERE Lname = 'Smith' AND Pname = 'ProductY' AND Hours = 32.5) = 1, '(b)의 효과';
  -- 곁따르는 효과가 다르다
  ASSERT (SELECT Pname FROM VA WHERE Lname = 'English' AND Hours = 20.0 ORDER BY Pname LIMIT 1) = 'ProductX'
     AND (SELECT COUNT(*) FROM VA WHERE Pname = 'ProductX') = 1, '(a): English의 ProductX 행은 그대로';
  ASSERT (SELECT COUNT(*) FROM VB WHERE Pname = 'ProductX') = 0
     AND (SELECT COUNT(*) FROM VB WHERE Lname = 'English' AND Pname = 'ProductY') = 2, '(b): English의 행도 ProductY가 된다';
  ASSERT (SELECT COUNT(*) FROM PA WHERE Pname = 'ProductX') = 1 AND (SELECT COUNT(*) FROM PB WHERE Pname = 'ProductX') = 0
     AND (SELECT COUNT(*) FROM PB WHERE Pname = 'ProductY') = 2, '(b)는 PROJECT에서 ProductX라는 이름을 없앤다';
  ASSERT (SELECT COUNT(*) FROM WA WHERE Essn = '123456789' AND Pno = 2) = 2, '(a)는 (Smith, 2)인 행을 둘로 만든다';
END $$;

-- 6. 집계 뷰
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN   -- p.22에 적힌 그대로: 뷰의 열 이름은 Dept_name인데 Dname이라고 썼다
    EXECUTE 'UPDATE DEPT_INFO SET Total_sal = 100000 WHERE Dname = ''Research''';
  EXCEPTION WHEN undefined_column THEN k := k + 1;
  END;
  BEGIN
    UPDATE DEPT_INFO SET Total_sal = 100000 WHERE Dept_name = 'Research';
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;      -- "Views containing GROUP BY are not automatically updatable."
  END;
  BEGIN
    INSERT INTO DEPT_INFO VALUES ('Sales', 2, 50000);
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;
  END;
  BEGIN
    DELETE FROM DEPT_INFO WHERE Dept_name = 'Research';
  EXCEPTION WHEN object_not_in_prerequisite_state THEN k := k + 1;
  END;
  ASSERT k = 4, '집계 뷰의 UPDATE·INSERT·DELETE';

  -- Total_sal을 100000으로 만드는 기본 테이블 수정은 하나가 아니다
  ASSERT (SELECT Total_sal FROM DEPT_INFO WHERE Dept_name = 'Research') = 133000, '처음 합';
  UPDATE EMPLOYEE SET Salary = Salary - 8250 WHERE Dno = 5;             -- 넷에게서 똑같이
  ASSERT (SELECT Total_sal FROM DEPT_INFO WHERE Dept_name = 'Research') = 100000, '길 1';
  UPDATE EMPLOYEE SET Salary = Salary + 8250 WHERE Dno = 5;
  UPDATE EMPLOYEE SET Salary = Salary - 33000 WHERE Lname = 'Wong';     -- 한 사람에게서만
  ASSERT (SELECT Total_sal FROM DEPT_INFO WHERE Dept_name = 'Research') = 100000, '길 2';
  UPDATE EMPLOYEE SET Salary = Salary + 33000 WHERE Lname = 'Wong';
END $$;

-- 7. 설계자가 길을 정해 준다: WORKS_ON1의 Pname을 고치면 길 (a)로 옮긴다
CREATE FUNCTION works_on1_move() RETURNS trigger AS $$
BEGIN
  UPDATE WORKS_ON SET Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = NEW.Pname)
  WHERE Essn IN (SELECT Ssn FROM EMPLOYEE WHERE Fname = OLD.Fname AND Lname = OLD.Lname)
    AND Pno = (SELECT Pnumber FROM PROJECT WHERE Pname = OLD.Pname);
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER WORKS_ON1_UPD INSTEAD OF UPDATE ON WORKS_ON1 FOR EACH ROW EXECUTE FUNCTION works_on1_move();

DO $$ BEGIN
  -- Narayan은 ProductZ(3)에서만 일한다. ProductX(1)로 옮긴다.
  UPDATE WORKS_ON1 SET Pname = 'ProductX' WHERE Lname = 'Narayan' AND Pname = 'ProductZ';
  ASSERT (SELECT Pno FROM WORKS_ON WHERE Essn = '666884444') = 1, 'INSTEAD OF 트리거가 WORKS_ON을 고쳐야 한다';
  ASSERT (SELECT COUNT(*) FROM PROJECT WHERE Pname = 'ProductZ') = 1, 'PROJECT는 그대로여야 한다';
  ASSERT (SELECT Pname FROM WORKS_ON1 WHERE Lname = 'Narayan') = 'ProductX', '뷰에서 바뀐 것이 보여야 한다';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
