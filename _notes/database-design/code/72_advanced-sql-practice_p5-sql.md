---
layout: "note"
title: "72_advanced-sql-practice_p5.sql"
display_title: "72_advanced-sql-practice_p5.sql"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/advanced-sql-practice/"
parent_title: "JOIN·GROUP BY 종합 연습"
description: "데이터베이스 설계 · JOIN·GROUP BY 종합 연습 문제 5 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/72_advanced-sql-practice_p5-sql/"
---
{% raw %}
[JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/) 문서의 문제 5 풀이 코드다.

```sql
-- 실행: docker exec -i vault-pg psql -U postgres -v ON_ERROR_STOP=1 -q -f - < 이 파일
-- JOIN·GROUP BY 종합 연습의 연습 1~5를 PostgreSQL 16에서 확인한다. SQLite 판은 _p3.py(연습 1~3), _p5.py(연습 4~5).
-- 문서: 72.JOIN·GROUP BY 종합 연습 / 출처: 14주차 슬라이드 14-Adavanced-SQL-practice p.3~9, 풀이 덱 p.1~8
-- 표의 행은 슬라이드에 없어 이 문서에서 만들었다(_p3.py, _p5.py와 같은 행).
-- 확인하는 것:
--   슬라이드 풀이 다섯 가운데 넷은 적힌 그대로는 오류다.
--     연습 1, 2: FROM ORDER AS O (ORDER는 예약어) -> 구문 오류
--     연습 4:    COUNT(*) AS R.runners_number -> 구문 오류
--     연습 5:    COUNT(runner.id) (표의 별칭은 R) -> 없는 표를 가리킨다는 오류
--   고친 풀이의 답: 연습 1은 4행, 연습 2는 2행, 연습 3은 내부 조인 3행·LEFT JOIN 4행, 연습 4는 (5, 4), 연습 5는 3·2·0·1.
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS advanced_sql_practice_p5 CASCADE;
CREATE SCHEMA advanced_sql_practice_p5;
SET search_path TO advanced_sql_practice_p5;


CREATE TABLE COLOR (id INT PRIMARY KEY, name VARCHAR(20), extra_fee INT);
CREATE TABLE CUSTOMER (id INT PRIMARY KEY, first_name VARCHAR(20), last_name VARCHAR(20),
  favorite_color_id INT REFERENCES COLOR(id));
CREATE TABLE CATEGORY (id INT PRIMARY KEY, name VARCHAR(20), parent_id INT REFERENCES CATEGORY(id));
CREATE TABLE CLOTHING (id INT PRIMARY KEY, name VARCHAR(20), size VARCHAR(3), price INT,
  color_id INT REFERENCES COLOR(id), category_id INT REFERENCES CATEGORY(id));
CREATE TABLE "ORDER" (id INT PRIMARY KEY, customer_id INT REFERENCES CUSTOMER(id),
  clothing_id INT REFERENCES CLOTHING(id), items INT, order_date DATE);
INSERT INTO COLOR VALUES (1,'Red',0), (2,'Blue',5), (3,'Green',0), (4,'Black',10);
INSERT INTO CUSTOMER VALUES (1,'Mina','Kim',1), (2,'Jisu','Park',2), (3,'Hana','Lee',3), (4,'Doyun','Choi',2),
  (5,'Sora','Jung',4), (6,'Yuna','Han',1);
INSERT INTO CATEGORY VALUES (1,'Tops',NULL), (2,'Bottoms',NULL), (3,'Accessories',NULL), (4,'T-shirts',1), (5,'Hoodies',1),
  (6,'Shorts',2), (7,'Graphic tees',4);
INSERT INTO CLOTHING VALUES (1,'Running Tee','M',25,1,4), (2,'Trail Hoodie','L',60,2,5), (3,'Track Shorts','M',30,3,6),
  (4,'Rain Jacket','L',90,2,1), (5,'Logo Tee','S',20,4,7);
INSERT INTO "ORDER" VALUES (1,1,1,1,'2024-11-02'), (2,1,2,1,'2024-11-02'), (3,2,2,2,'2024-11-05'), (4,2,4,1,'2024-11-09'),
  (5,3,1,1,'2024-11-12'), (6,4,2,1,'2024-11-20'), (7,3,5,3,'2024-11-21');

CREATE TABLE RUNNER (id INT PRIMARY KEY, name VARCHAR(20), main_distance INT, age INT, is_female BOOLEAN);
CREATE TABLE EVENT (id INT PRIMARY KEY, name VARCHAR(30), start_date DATE, city VARCHAR(20));
CREATE TABLE RUNNER_EVENT (runner_id INT REFERENCES RUNNER(id), event_id INT REFERENCES EVENT(id),
  PRIMARY KEY (runner_id, event_id));
INSERT INTO RUNNER VALUES (1,'Ara',5,24,TRUE), (2,'Bin',5,31,FALSE), (3,'Chan',5,28,FALSE), (4,'Dana',5,35,TRUE),
  (5,'Eun',10,22,TRUE), (6,'Gun',10,40,FALSE), (7,'Hyun',10,29,FALSE), (8,'Jin',42,33,FALSE), (9,'Kyu',42,45,FALSE);
INSERT INTO EVENT VALUES (1,'Seoul Marathon','2024-03-17','Seoul'), (2,'Han River 10K','2024-05-05','Seoul'),
  (3,'Jeju Trail Run','2024-09-21','Jeju'), (4,'Busan Night Run','2024-10-12','Busan');
INSERT INTO RUNNER_EVENT VALUES (8,1), (9,1), (5,1), (5,2), (6,2), (1,4);

-- 슬라이드 풀이를 적힌 그대로 돌린다
DO $$
DECLARE k int := 0;
BEGIN
  BEGIN   -- 연습 1 (풀이 덱 p.1)
    EXECUTE 'SELECT CL.name AS clothes, C.name AS color, CUS.last_name, CUS.first_name
             FROM ORDER AS O JOIN CLOTHING AS CL ON CL.id = O.clothing_id JOIN COLOR AS C ON C.id = CL.color_id
                  JOIN CUSTOMER AS CUS ON CUS.id = O.customer_id
             WHERE CUS.favorite_color_id = CL.color_id ORDER BY C.name';
  EXCEPTION WHEN syntax_error THEN k := k + 1;
  END;
  BEGIN   -- 연습 2 (풀이 덱 p.3)
    EXECUTE 'SELECT CUS.last_name, CUS.first_name, C.name
             FROM CUSTOMER AS CUS JOIN COLOR AS C ON C.id = CUS.favorite_color_id
                  LEFT JOIN ORDER AS O ON O.customer_id = CUS.id
             WHERE O.customer_id IS NULL';
  EXCEPTION WHEN syntax_error THEN k := k + 1;
  END;
  BEGIN   -- 연습 4 (풀이 덱 p.7)
    EXECUTE 'SELECT R.main_distance, COUNT(*) AS R.runners_number FROM RUNNER AS R
             GROUP BY R.main_distance HAVING COUNT(*) > 3';
  EXCEPTION WHEN syntax_error THEN k := k + 1;
  END;
  BEGIN   -- 연습 5 (풀이 덱 p.8)
    EXECUTE 'SELECT E.name, COUNT(runner.id) AS runner_count
             FROM EVENT AS E LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id LEFT JOIN RUNNER AS R ON RE.runner_id = R.id
             GROUP BY E.name';
  EXCEPTION WHEN undefined_table THEN k := k + 1;       -- "invalid reference to FROM-clause entry for table runner"
  END;
  ASSERT k = 4, '슬라이드 풀이 넷이 모두 오류여야 한다';
END $$;

-- 고친 풀이
CREATE VIEW EX1 AS
SELECT CL.name AS clothes, C.name AS color, CUS.last_name, CUS.first_name
FROM "ORDER" AS O
  JOIN CLOTHING AS CL ON CL.id = O.clothing_id
  JOIN COLOR AS C ON C.id = CL.color_id
  JOIN CUSTOMER AS CUS ON CUS.id = O.customer_id
WHERE CUS.favorite_color_id = CL.color_id
ORDER BY C.name;

CREATE VIEW EX2 AS
SELECT CUS.last_name, CUS.first_name, C.name
FROM CUSTOMER AS CUS
  JOIN COLOR AS C ON C.id = CUS.favorite_color_id
  LEFT JOIN "ORDER" AS O ON O.customer_id = CUS.id
WHERE O.customer_id IS NULL;

CREATE VIEW EX3 AS            -- 슬라이드 풀이 그대로 (풀이 덱 p.6)
SELECT C1.name AS category, C2.name AS subcategory
FROM CATEGORY AS C1
  JOIN CATEGORY AS C2 ON C2.parent_id = C1.id
WHERE C1.parent_id IS NULL;

CREATE VIEW EX3_LEFT AS
SELECT C1.name AS category, C2.name AS subcategory
FROM CATEGORY AS C1
  LEFT JOIN CATEGORY AS C2 ON C2.parent_id = C1.id
WHERE C1.parent_id IS NULL;

CREATE VIEW EX4 AS
SELECT R.main_distance, COUNT(*) AS runners_number
FROM RUNNER AS R
GROUP BY R.main_distance
HAVING COUNT(*) > 3;

CREATE VIEW EX5 AS
SELECT E.name, COUNT(R.id) AS runner_count
FROM EVENT AS E
  LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id
  LEFT JOIN RUNNER AS R ON RE.runner_id = R.id
GROUP BY E.name;

DO $$ BEGIN
  ASSERT (SELECT string_agg(clothes || '/' || color || '/' || last_name || '/' || first_name, ' ' ORDER BY color, clothes, last_name) FROM EX1)
         = 'Rain Jacket/Blue/Park/Jisu Trail Hoodie/Blue/Choi/Doyun Trail Hoodie/Blue/Park/Jisu Running Tee/Red/Kim/Mina', '연습 1';
  ASSERT (SELECT string_agg(last_name || '/' || first_name || '/' || name, ' ' ORDER BY last_name) FROM EX2)
         = 'Han/Yuna/Red Jung/Sora/Black', '연습 2';
  ASSERT (SELECT string_agg(category || '>' || subcategory, ' ' ORDER BY category, subcategory) FROM EX3)
         = 'Bottoms>Shorts Tops>Hoodies Tops>T-shirts', '연습 3 (내부 조인)';
  ASSERT (SELECT string_agg(category || '>' || COALESCE(subcategory, 'NULL'), ' ' ORDER BY category, subcategory) FROM EX3_LEFT)
         = 'Accessories>NULL Bottoms>Shorts Tops>Hoodies Tops>T-shirts', '연습 3 (LEFT JOIN)';
  ASSERT (SELECT string_agg(main_distance || '/' || runners_number, ' ') FROM EX4) = '5/4', '연습 4';
  ASSERT (SELECT string_agg(name || '=' || runner_count, ', ' ORDER BY name) FROM EX5)
         = 'Busan Night Run=1, Han River 10K=2, Jeju Trail Run=0, Seoul Marathon=3', '연습 5';
  -- COUNT(*)로 세면 아무도 안 나간 대회가 1이 된다
  ASSERT (SELECT COUNT(*) FROM EVENT AS E LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id WHERE E.name = 'Jeju Trail Run') = 1, 'COUNT(*)';
  ASSERT (SELECT COUNT(RE.runner_id) FROM EVENT AS E LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id WHERE E.name = 'Jeju Trail Run') = 0, 'COUNT(열)';
END $$;

SELECT 'ALL CHECKS PASSED';
```
{% endraw %}
