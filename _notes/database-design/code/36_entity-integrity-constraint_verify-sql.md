---
layout: "note"
title: "36_entity-integrity-constraint_verify.sql"
display_title: "36_entity-integrity-constraint_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/entity-integrity-constraint/"
parent_title: "개체 무결성 제약"
description: "데이터베이스 설계 · 개체 무결성 제약 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/36_entity-integrity-constraint_verify-sql/"
---
{% raw %}
[개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 문서: 36.개체 무결성 제약 (PostgreSQL 16에서 실행. SQLite와 동작이 다른 곳)
-- 출처: Elmasri & Navathe, Fundamentals of Database Systems 5장 ('No primary key value can be NULL')
-- 확인하는 것:
--   1. PRIMARY KEY만 적어도 그 열은 NULL을 받지 않는다 (SQLite는 NOT NULL을 따로 적지 않으면 받는다).
--   2. 속성 여럿으로 된 기본 키는 한 속성만 NULL이어도 거부된다.
--   3. 기본 키로 뽑히지 않은 후보 키(UNIQUE)는 NULL을 받고, NULL은 여러 개여도 된다.
DROP SCHEMA IF EXISTS entity_integrity_constraint CASCADE;
CREATE SCHEMA entity_integrity_constraint;
SET search_path TO entity_integrity_constraint;

CREATE TABLE EMPLOYEE (Ssn CHAR(9) PRIMARY KEY, Lname VARCHAR(15));          -- NOT NULL을 적지 않았다
CREATE TABLE WORKS_ON (Essn CHAR(9), Pno INT, Hours DECIMAL(3,1), PRIMARY KEY (Essn, Pno));
CREATE TABLE CAR (License_number VARCHAR(20) PRIMARY KEY, Engine_serial_number VARCHAR(10) UNIQUE, Make VARCHAR(12));

INSERT INTO EMPLOYEE VALUES ('123456789', 'Smith');
INSERT INTO WORKS_ON VALUES ('123456789', 1, 32.5), ('888665555', 20, NULL);   -- 키가 아닌 Hours는 NULL이어도 된다

-- 1. 기본 키 NULL
DO $$ BEGIN
  INSERT INTO EMPLOYEE VALUES (NULL, 'Kolonsky');
  RAISE EXCEPTION 'Ssn이 NULL인 직원이 들어가 버렸다';
EXCEPTION WHEN not_null_violation THEN NULL;
END $$;

-- 2. 기본 키의 한 속성만 NULL
DO $$ BEGIN
  INSERT INTO WORKS_ON VALUES ('123456789', NULL, 5.0);
  RAISE EXCEPTION 'Pno가 NULL인 WORKS_ON 튜플이 들어가 버렸다';
EXCEPTION WHEN not_null_violation THEN NULL;
END $$;

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.columns
          WHERE table_schema = 'entity_integrity_constraint' AND is_nullable = 'NO'
            AND (table_name, column_name) IN (('employee', 'ssn'), ('works_on', 'essn'), ('works_on', 'pno'), ('car', 'license_number'))) = 4,
         '기본 키 열 4개가 모두 NOT NULL이어야 한다';
  ASSERT (SELECT is_nullable FROM information_schema.columns
          WHERE table_schema = 'entity_integrity_constraint' AND table_name = 'car' AND column_name = 'engine_serial_number') = 'YES',
         'UNIQUE만 건 열은 NULL을 받아야 한다';
END $$;

-- 3. UNIQUE인 후보 키는 NULL을 여러 번 받는다
INSERT INTO CAR VALUES ('Texas ABC-739', 'A69352', 'Ford'), ('Florida TVP-347', NULL, 'Oldsmobile'), ('New York MPO-22', NULL, 'Oldsmobile');
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM CAR WHERE Engine_serial_number IS NULL) = 2, 'UNIQUE 열에 NULL 두 개가 들어가야 한다';
END $$;
DO $$ BEGIN
  INSERT INTO CAR VALUES ('Texas RSK-629', 'A69352', 'Jaguar');
  RAISE EXCEPTION '같은 엔진 번호가 두 번 들어가 버렸다';
EXCEPTION WHEN unique_violation THEN NULL;
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
