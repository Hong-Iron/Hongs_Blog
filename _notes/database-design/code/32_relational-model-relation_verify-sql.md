---
layout: "note"
title: "32_relational-model-relation_verify.sql"
display_title: "32_relational-model-relation_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relational-model-relation/"
parent_title: "릴레이션과 도메인·속성·튜플"
description: "데이터베이스 설계 · 릴레이션과 도메인·속성·튜플 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/32_relational-model-relation_verify-sql/"
---
{% raw %}
[릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 문서: 32.릴레이션과 도메인·속성·튜플 (활용: 도메인을 SQL로 적기)
-- 출처: 데이터베이스 설계 6-2 슬라이드 p.8 (도메인은 자료형으로 정한다. Usa_phone_numbers, Employee_ages)
-- PostgreSQL 16에서 확인하는 것 (SQLite에는 CREATE DOMAIN이 없다):
--   1. 도메인을 자료형 + 조건으로 만들 수 있다.
--   2. 도메인 밖의 값(나이 14, 꼴이 다른 전화번호)은 들어가지 않는다.
--   3. NULL은 도메인의 값이 아니지만 속성 값으로는 들어간다.
--   4. 같은 튜플을 두 번 넣으면 SQL 표는 둘 다 받는다(키를 정하지 않았을 때). 릴레이션은 집합이라 한 번만 센다.
DROP SCHEMA IF EXISTS relational_model_relation CASCADE;
CREATE SCHEMA relational_model_relation;
SET search_path TO relational_model_relation;

CREATE DOMAIN Usa_phone_numbers AS CHAR(13) CHECK (VALUE ~ '^\(\d{3}\)\d{3}-\d{4}$');
CREATE DOMAIN Employee_ages AS INT CHECK (VALUE BETWEEN 15 AND 80);

CREATE TABLE STUDENT (
  Name VARCHAR(30), Ssn CHAR(11), Home_phone Usa_phone_numbers, Address VARCHAR(40),
  Office_phone Usa_phone_numbers, Age Employee_ages, Gpa DECIMAL(3,2));

INSERT INTO STUDENT VALUES
 ('Benjamin Bayer', '305-61-2435', '(817)373-1616', '2918 Bluebonnet Lane', NULL, 19, 3.21),
 ('Chung-cha Kim', '381-62-1245', '(817)375-4409', '125 Kirby Road', NULL, 18, 2.89),
 ('Dick Davidson', '422-11-2320', NULL, '3452 Elgin Road', '(817)749-1253', 25, 3.53),
 ('Rohan Panchal', '489-22-1100', '(817)376-9821', '265 Lark Lane', '(817)749-6492', 28, 3.93),
 ('Barbara Benson', '533-69-1238', '(817)839-8461', '7384 Fontana Lane', NULL, 19, 3.25);

DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM STUDENT) = 5, 'STUDENT 튜플은 5개여야 한다';
  ASSERT (SELECT COUNT(*) FROM information_schema.columns
          WHERE table_schema = 'relational_model_relation' AND table_name = 'student') = 7, '차수는 7이어야 한다';
  ASSERT (SELECT COUNT(*) FROM STUDENT WHERE Office_phone IS NULL) = 3, 'Office_phone이 NULL인 튜플은 3개';
END $$;

-- 2. 도메인 밖의 값은 오류
DO $$ BEGIN
  INSERT INTO STUDENT VALUES ('Too Young', '111-11-1111', NULL, 'x', NULL, 14, 3.00);
  RAISE EXCEPTION '나이 14가 들어가 버렸다';
EXCEPTION WHEN check_violation THEN NULL;
END $$;
DO $$ BEGIN
  INSERT INTO STUDENT VALUES ('Bad Phone', '222-22-2222', '817-373-1616', 'x', NULL, 20, 3.00);
  RAISE EXCEPTION '꼴이 다른 전화번호가 들어가 버렸다';
EXCEPTION WHEN check_violation THEN NULL;
END $$;

-- 3. NULL은 들어간다 (위 INSERT에서 이미 확인). 4. 키가 없으면 같은 튜플이 두 번 들어간다
INSERT INTO STUDENT VALUES ('Barbara Benson', '533-69-1238', '(817)839-8461', '7384 Fontana Lane', NULL, 19, 3.25);
DO $$ BEGIN
  ASSERT (SELECT COUNT(*) FROM STUDENT) = 6, '키가 없는 SQL 표는 같은 행을 두 번 받는다';
  ASSERT (SELECT COUNT(*) FROM (SELECT DISTINCT * FROM STUDENT) AS t) = 5, '집합으로 보면 5개';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
