---
layout: "note"
title: "37_referential-integrity-foreign-key_verify.sql"
display_title: "37_referential-integrity-foreign-key_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/referential-integrity-foreign-key/"
parent_title: "참조 무결성 제약과 외래 키"
description: "데이터베이스 설계 · 참조 무결성 제약과 외래 키 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/37_referential-integrity-foreign-key_verify-sql/"
---
{% raw %}
[참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 문서: 37.참조 무결성 제약과 외래 키 (PostgreSQL 16에서 실행. SQLite와 동작이 다른 곳)
-- 출처: Elmasri & Navathe, Fundamentals of Database Systems 5장 (외래 키의 두 조건)
-- 확인하는 것:
--   1. 조건 2: 외래 키 값은 상대 기본 키에 있거나 NULL이어야 한다. 없는 값은 foreign_key_violation.
--   2. 가리킴을 받는 튜플을 지우면 foreign_key_violation (참조 동작을 적지 않았을 때).
--   3. 조건 1(같은 도메인): 자료형이 안 맞는 외래 키는 표를 만들 때 거부된다 (SQLite는 받는다).
--   4. 기본 키도 UNIQUE도 아닌 속성은 가리킬 수 없다. UNIQUE인 후보 키는 가리킬 수 있다.
DROP SCHEMA IF EXISTS referential_integrity_foreign_key CASCADE;
CREATE SCHEMA referential_integrity_foreign_key;
SET search_path TO referential_integrity_foreign_key;

CREATE TABLE DEPARTMENT (Dname VARCHAR(15) NOT NULL, Dnumber INT PRIMARY KEY, Dfloor INT);
CREATE TABLE EMPLOYEE (Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) PRIMARY KEY,
  Super_ssn CHAR(9) REFERENCES EMPLOYEE(Ssn), Dno INT REFERENCES DEPARTMENT(Dnumber));

INSERT INTO DEPARTMENT VALUES ('Research', 5, 3), ('Administration', 4, 3), ('Headquarters', 1, 9);
INSERT INTO EMPLOYEE VALUES ('Borg', '888665555', NULL, 1), ('Wong', '333445555', '888665555', 5), ('Smith', '123456789', '333445555', 5);

-- 1. 없는 부서를 가리키면 오류, NULL은 들어간다
DO $$ BEGIN
  INSERT INTO EMPLOYEE VALUES ('Kim', '111111111', NULL, 7);
  RAISE EXCEPTION '없는 7번 부서를 가리키는 직원이 들어가 버렸다';
EXCEPTION WHEN foreign_key_violation THEN NULL;
END $$;
INSERT INTO EMPLOYEE VALUES ('Lee', '222222222', NULL, NULL);
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM EMPLOYEE) = 4, '외래 키가 NULL인 직원은 들어가야 한다';
  ASSERT (SELECT D.Dname FROM EMPLOYEE E JOIN DEPARTMENT D ON E.Dno = D.Dnumber WHERE E.Lname = 'Smith') = 'Research',
         'Smith의 Dno 5는 Research를 가리킨다';
END $$;

-- 2. 가리킴을 받는 튜플은 못 지운다
DO $$ BEGIN
  DELETE FROM DEPARTMENT WHERE Dnumber = 5;
  RAISE EXCEPTION '직원이 가리키는 5번 부서가 지워져 버렸다';
EXCEPTION WHEN foreign_key_violation THEN NULL;
END $$;
DELETE FROM DEPARTMENT WHERE Dnumber = 4;        -- 아무도 안 가리킨다
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM DEPARTMENT) = 2, '4번 부서만 지워져야 한다';
END $$;

-- 3. 자료형이 안 맞는 외래 키
DO $$ BEGIN
  CREATE TABLE ODD (Since DATE REFERENCES DEPARTMENT(Dnumber));
  RAISE EXCEPTION 'DATE 열이 INT 기본 키를 가리키는 표가 만들어져 버렸다';
EXCEPTION WHEN datatype_mismatch THEN NULL;
END $$;

-- 4. 키가 아닌 속성은 가리킬 수 없다. UNIQUE를 걸면 가리킬 수 있다
DO $$ BEGIN
  CREATE TABLE ROOM (Room_no INT PRIMARY KEY, Dfloor INT REFERENCES DEPARTMENT(Dfloor));
  RAISE EXCEPTION '키가 아닌 Dfloor를 가리키는 표가 만들어져 버렸다';
EXCEPTION WHEN invalid_foreign_key THEN NULL;
END $$;
ALTER TABLE DEPARTMENT ADD UNIQUE (Dname);
CREATE TABLE DEPT_ALIAS (Alias VARCHAR(15) PRIMARY KEY, Dname VARCHAR(15) REFERENCES DEPARTMENT(Dname));
INSERT INTO DEPT_ALIAS VALUES ('R&D', 'Research');
DO $$ BEGIN
  INSERT INTO DEPT_ALIAS VALUES ('HR', 'Human Resources');
  RAISE EXCEPTION '없는 부서 이름을 가리키는 튜플이 들어가 버렸다';
EXCEPTION WHEN foreign_key_violation THEN NULL;
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
