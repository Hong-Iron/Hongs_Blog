---
layout: "note"
title: "47_sql-data-types_verify.sql"
display_title: "47_sql-data-types_verify.sql"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-data-types/"
parent_title: "SQL 자료형"
description: "데이터베이스 설계 · SQL 자료형 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/47_sql-data-types_verify-sql/"
---
{% raw %}
[SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/) 문서의 검증 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- 47.SQL 자료형 검증 (PostgreSQL 16). 자료형이 값을 실제로 막는지 본다. SQLite는 이름만 받고 검사하지 않는다.
--   수: INT, FLOAT, DECIMAL(i, j) / 문자열: CHAR(n), VARCHAR(n) / 비트열: BIT(n), VARBIT(n) / BOOLEAN / DATE, TIME, TIMESTAMP
\set QUIET 1
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS sql_data_types CASCADE;
CREATE SCHEMA sql_data_types;
SET search_path TO sql_data_types;
-- 문장을 돌려 보고 SQLSTATE(오류 번호)를 돌려준다. 오류가 없으면 'OK'. 오류가 나면 그 문장이 한 일은 되돌려진다.
CREATE FUNCTION err_of(stmt TEXT) RETURNS TEXT LANGUAGE plpgsql AS $f$
BEGIN
  BEGIN
    EXECUTE stmt;
  EXCEPTION WHEN OTHERS THEN
    RETURN SQLSTATE;
  END;
  RETURN 'OK';
END $f$;

CREATE TABLE T (v VARCHAR(15), ch CHAR(9), n INT, f FLOAT, d31 DECIMAL(3,1), d52 DECIMAL(5,2), b BOOLEAN,
                bt BIT(4), vb VARBIT(4), dt DATE, tm TIME, ts TIMESTAMP);

-- 문자열: VARCHAR(15)는 15글자까지, CHAR(9)는 늘 9칸
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO T (v) VALUES ('123456789012345')$q$) = 'OK', '15글자는 들어가야 한다';
  ASSERT err_of($q$INSERT INTO T (v) VALUES ('1234567890123456')$q$) = '22001', '16글자는 막혀야 한다';
  ASSERT err_of($q$INSERT INTO T (ch) VALUES ('123')$q$) = 'OK', '짧은 값은 들어가야 한다';
  ASSERT (SELECT OCTET_LENGTH(ch) FROM T WHERE ch IS NOT NULL) = 9, 'CHAR(9)는 빈칸을 채워 9칸으로 둔다';
  ASSERT (SELECT ch = '123' FROM T WHERE ch IS NOT NULL), '뒤의 빈칸은 비교할 때 무시한다';
  ASSERT err_of($q$INSERT INTO T (ch) VALUES ('1234567890')$q$) = '22001', '10글자는 CHAR(9)에 안 들어간다';
END $$;

-- 수: DECIMAL(3,1)은 모두 세 자리, 그중 소수 한 자리. -99.9 ~ 99.9
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO T (d31) VALUES (32.5), (99.9), (7.55)$q$) = 'OK', '범위 안의 값이다';
  ASSERT (SELECT ARRAY_AGG(d31 ORDER BY d31) FROM T WHERE d31 IS NOT NULL) = ARRAY[7.6, 32.5, 99.9], '7.55는 7.6으로 반올림된다';
  ASSERT err_of($q$INSERT INTO T (d31) VALUES (100.0)$q$) = '22003', '100.0은 세 자리를 넘는다';
  ASSERT err_of($q$INSERT INTO T (d52) VALUES (999.99), (123.456)$q$) = 'OK', 'DECIMAL(5,2) 범위 안이다';
  ASSERT (SELECT ARRAY_AGG(d52 ORDER BY d52) FROM T WHERE d52 IS NOT NULL) = ARRAY[123.46, 999.99], '123.456은 123.46이 된다';
  ASSERT err_of($q$INSERT INTO T (d52) VALUES (1000.00)$q$) = '22003', '1000.00은 다섯 자리를 넘는다';
  ASSERT err_of($q$INSERT INTO T (n) VALUES ('abc')$q$) = '22P02', '정수 칸에 글자는 안 들어간다';
  ASSERT err_of($q$INSERT INTO T (n) VALUES (2147483648)$q$) = '22003', 'INT는 2147483647까지다';
  ASSERT (0.1::FLOAT + 0.2::FLOAT = 0.3::FLOAT) = FALSE, 'FLOAT는 어림값이라 0.1 + 0.2가 0.3과 다르다';
  ASSERT 0.1::DECIMAL(3,1) + 0.2::DECIMAL(3,1) = 0.3::DECIMAL(3,1), 'DECIMAL은 적힌 자리까지 정확하다';
END $$;

-- 비트열: BIT(4)는 꼭 네 자리, VARBIT(4)는 네 자리까지
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO T (bt) VALUES (B'1010')$q$) = 'OK', '네 자리는 들어간다';
  ASSERT err_of($q$INSERT INTO T (bt) VALUES (B'101')$q$) = '22026', 'BIT(4)에 세 자리는 안 들어간다';
  ASSERT err_of($q$INSERT INTO T (bt) VALUES (B'10101')$q$) = '22026', 'BIT(4)에 다섯 자리는 안 들어간다';
  ASSERT err_of($q$INSERT INTO T (vb) VALUES (B'1'), (B'101'), (B'1010')$q$) = 'OK', 'VARBIT(4)는 한 자리부터 네 자리까지 받는다';
  ASSERT err_of($q$INSERT INTO T (vb) VALUES (B'10101')$q$) = '22001', 'VARBIT(4)에 다섯 자리는 안 들어간다';
END $$;

-- 불: TRUE, FALSE (그리고 NULL)
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO T (b) VALUES (TRUE), (FALSE)$q$) = 'OK', 'TRUE와 FALSE';
  ASSERT err_of($q$INSERT INTO T (b) VALUES (2)$q$) = '42804', '2는 불 값이 아니다';
  ASSERT (SELECT COUNT(*) FROM T WHERE b) = 1 AND (SELECT COUNT(*) FROM T WHERE NOT b) = 1, '참 하나, 거짓 하나';
END $$;

-- 날짜와 시각: DATE는 10자리, TIME은 8자리, TIMESTAMP는 둘에 소수 여섯 자리
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO T (dt) VALUES ('2024-11-07')$q$) = 'OK', '있는 날짜';
  ASSERT err_of($q$INSERT INTO T (dt) VALUES ('2024-02-30')$q$) = '22008', '2월 30일은 없다';
  ASSERT err_of($q$INSERT INTO T (dt) VALUES ('2024-13-01')$q$) = '22008', '13월은 없다';
  ASSERT err_of($q$INSERT INTO T (tm) VALUES ('13:15:47')$q$) = 'OK', '있는 시각';
  ASSERT err_of($q$INSERT INTO T (tm) VALUES ('25:00:00')$q$) = '22008', '25시는 없다';
  ASSERT err_of($q$INSERT INTO T (ts) VALUES ('2024-11-07 13:15:47.648302')$q$) = 'OK', '문서의 TIMESTAMP 예';
  ASSERT (SELECT LENGTH(dt::TEXT) FROM T WHERE dt IS NOT NULL) = 10, 'DATE는 10자리';
  ASSERT (SELECT LENGTH(tm::TEXT) FROM T WHERE tm IS NOT NULL) = 8, 'TIME은 8자리';
  ASSERT (SELECT ts::TEXT FROM T WHERE ts IS NOT NULL) = '2024-11-07 13:15:47.648302', '소수 여섯 자리까지 그대로 남는다';
  ASSERT (SELECT ts::DATE = DATE '2024-11-07' AND ts::TIME = TIME '13:15:47.648302' FROM T WHERE ts IS NOT NULL), 'TIMESTAMP = DATE + TIME';
  ASSERT DATE '2024-11-07' < DATE '2024-11-10' AND DATE '2024-11-10' - DATE '2024-11-07' = 3, '날짜는 비교하고 뺄 수 있다';
  ASSERT ('2024-11-07'::TEXT COLLATE "C" < '2024-2-10'::TEXT COLLATE "C") = TRUE, '글자로 두면 사전 순서로 비교된다';
  ASSERT (DATE '2024-11-07' < DATE '2024-2-10') = FALSE, '날짜로 두면 11월이 2월보다 뒤다';
END $$;

-- COMPANY의 자료형: Hours DECIMAL(3,1), Salary DECIMAL(10,2), Ssn CHAR(9)
CREATE TABLE W (Essn CHAR(9), Hours DECIMAL(3,1), Salary DECIMAL(10,2));
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO W VALUES ('123456789', 32.5, 30000)$q$) = 'OK', '문서의 값';
  ASSERT err_of($q$INSERT INTO W (Salary) VALUES (99999999.99)$q$) = 'OK', 'DECIMAL(10,2)의 가장 큰 값';
  ASSERT err_of($q$INSERT INTO W (Salary) VALUES (100000000)$q$) = '22003', '정수부는 여덟 자리까지다';
  ASSERT err_of($q$INSERT INTO W (Hours) VALUES (168.0)$q$) = '22003', '주 168시간은 DECIMAL(3,1)에 안 들어간다';
END $$;

-- 도메인: 자료형에 이름을 붙여 여러 열에서 쓴다
CREATE DOMAIN SSN_TYPE AS CHAR(9);
CREATE TABLE P (Ssn SSN_TYPE, Super_ssn SSN_TYPE);
DO $$ BEGIN
  ASSERT err_of($q$INSERT INTO P VALUES ('123456789', '333445555')$q$) = 'OK', '9글자';
  ASSERT err_of($q$INSERT INTO P VALUES ('1234567890', NULL)$q$) = '22001', '도메인의 길이 제한이 그대로 걸린다';
END $$;

DROP SCHEMA sql_data_types CASCADE;
SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
