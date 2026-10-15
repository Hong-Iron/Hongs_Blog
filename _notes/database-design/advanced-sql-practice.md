---
layout: "note"
title: "JOIN·GROUP BY 종합 연습"
display_title: "JOIN·GROUP BY 종합 연습"
kind: "practice"
kind_label: "연습"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: FROM 절의 조인 (JOIN ON), 짝 없는 행을 남기는 외부 조인, 같은 표를 두 번 쓰는 자기 조인, GROUP BY와 HAVING, NULL을 세지 않는 COUNT(열)."
prev_url: "/studies/database-design/nested-aggregate-practice/"
prev_title: "중첩 질의·집계 연습"
next_url: "/studies/database-design/view-practice/"
next_title: "뷰 연습"
math: false
mermaid: false
code_count: 3
permalink: "/studies/database-design/advanced-sql-practice/"
---
{% raw %}
사용 개념: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/), 짝 없는 행을 남기는 [외부 조인](/Hongs_Blog/studies/database-design/outer-join/), 같은 표를 두 번 쓰는 [자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/), [GROUP BY](/Hongs_Blog/studies/database-design/group-by/)와 [HAVING](/Hongs_Blog/studies/database-design/having-clause/), NULL을 세지 않는 [COUNT(열)](/Hongs_Blog/studies/database-design/aggregate-functions/).

JOIN과 GROUP BY를 섞어 쓰는 문제 다섯이다. 답을 손으로 따라갈 수 있게 표마다 행을 몇 줄씩 두었다[^s1]. 풀이는 SQLite와 PostgreSQL 16에서 그대로 실행되는 문장으로 적었다.

## 운동복 가게 (문제 1~3)

옷, 옷의 범주, 색, 손님, 주문을 담은 데이터베이스다.

| 표 | 열 |
|---|---|
| COLOR | id (기본 키), name, extra_fee(이 색으로 주문하면 붙는 추가 요금) |
| CUSTOMER | id (기본 키), first_name, last_name, favorite_color_id (외래 키 → COLOR) |
| CATEGORY | id (기본 키), name, parent_id(하위 범주면 주 범주의 id, 주 범주면 NULL) |
| CLOTHING | id (기본 키), name, size, price, color_id (외래 키 → COLOR), category_id (외래 키 → CATEGORY) |
| ORDER | id (기본 키), customer_id (외래 키 → CUSTOMER), clothing_id (외래 키 → CLOTHING), items(산 개수), order_date |

`ORDER`는 SQL에서 `ORDER BY`에 쓰는 낱말이라 표 이름으로 그냥 쓸 수 없다. 큰따옴표로 감싸 `"ORDER"`라고 쓴다.

**COLOR**

| id | name | extra_fee |
|---|---|---|
| 1 | Red | 0 |
| 2 | Blue | 5 |
| 3 | Green | 0 |
| 4 | Black | 10 |

**CUSTOMER**

| id | first_name | last_name | favorite_color_id |
|---|---|---|---|
| 1 | Mina | Kim | 1 (Red) |
| 2 | Jisu | Park | 2 (Blue) |
| 3 | Hana | Lee | 3 (Green) |
| 4 | Doyun | Choi | 2 (Blue) |
| 5 | Sora | Jung | 4 (Black) |
| 6 | Yuna | Han | 1 (Red) |

**CATEGORY**

| id | name | parent_id |
|---|---|---|
| 1 | Tops | NULL |
| 2 | Bottoms | NULL |
| 3 | Accessories | NULL |
| 4 | T-shirts | 1 |
| 5 | Hoodies | 1 |
| 6 | Shorts | 2 |
| 7 | Graphic tees | 4 |

**CLOTHING**

| id | name | size | price | color_id | category_id |
|---|---|---|---|---|---|
| 1 | Running Tee | M | 25 | 1 (Red) | 4 |
| 2 | Trail Hoodie | L | 60 | 2 (Blue) | 5 |
| 3 | Track Shorts | M | 30 | 3 (Green) | 6 |
| 4 | Rain Jacket | L | 90 | 2 (Blue) | 1 |
| 5 | Logo Tee | S | 20 | 4 (Black) | 7 |

**ORDER**

| id | customer_id | clothing_id | items | order_date |
|---|---|---|---|---|
| 1 | 1 (Kim) | 1 (Running Tee) | 1 | 2024-11-02 |
| 2 | 1 (Kim) | 2 (Trail Hoodie) | 1 | 2024-11-02 |
| 3 | 2 (Park) | 2 (Trail Hoodie) | 2 | 2024-11-05 |
| 4 | 2 (Park) | 4 (Rain Jacket) | 1 | 2024-11-09 |
| 5 | 3 (Lee) | 1 (Running Tee) | 1 | 2024-11-12 |
| 6 | 4 (Choi) | 2 (Trail Hoodie) | 1 | 2024-11-20 |
| 7 | 3 (Lee) | 5 (Logo Tee) | 3 | 2024-11-21 |

괄호 안의 이름은 읽기 쉬우라고 붙인 것이고 표에는 번호만 들어 있다.

## 문제 1 · 좋아하는 색으로 산 옷

옷의 이름(`clothes`), 그 옷의 색(`color`), 그리고 그 옷을 **자기가 좋아하는 색으로** 산 손님의 성과 이름을 보여라. 색 이름의 오름차순으로 정렬한다.

**풀이 전략.** 보여 줄 값이 세 표에 흩어져 있다. 옷 이름은 CLOTHING, 색 이름은 COLOR, 손님 이름은 CUSTOMER다. 누가 무엇을 샀는지는 ORDER에 있다. 그래서 ORDER를 한가운데 두고 나머지 셋을 외래 키로 잇는다. "좋아하는 색으로 샀다"는 "손님의 좋아하는 색 번호 = 산 옷의 색 번호"라는 조건이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *가운데 표:* `"ORDER" AS O`. 주문 한 건이 한 줄이다.
2. *옷 잇기:* `CL.id = O.clothing_id`.
3. *색 잇기:* `C.id = CL.color_id`. 옷의 색 번호를 색 이름으로 바꾼다.
4. *손님 잇기:* `CUS.id = O.customer_id`.
5. *남길 줄:* `CUS.favorite_color_id = CL.color_id`.
6. *정렬:* `ORDER BY C.name`.

```sql
SELECT CL.name AS clothes,
       C.name AS color,
       CUS.last_name,
       CUS.first_name
FROM   "ORDER" AS O
  JOIN CLOTHING AS CL ON CL.id = O.clothing_id
  JOIN COLOR AS C ON C.id = CL.color_id
  JOIN CUSTOMER AS CUS ON CUS.id = O.customer_id
WHERE  CUS.favorite_color_id = CL.color_id
ORDER BY C.name;
```

| clothes | color | last_name | first_name |
|---|---|---|---|
| Trail Hoodie | Blue | Park | Jisu |
| Rain Jacket | Blue | Park | Jisu |
| Trail Hoodie | Blue | Choi | Doyun |
| Running Tee | Red | Kim | Mina |

주문 7건 가운데 4건이 남는다. 주문 2(Kim은 Red를 좋아하는데 Blue 옷을 샀다), 주문 5와 7(Lee는 Green을 좋아하는데 Red, Black 옷을 샀다)이 빠진다. Blue 세 줄끼리의 순서는 정해져 있지 않다. 색 이름으로만 정렬했기 때문이다.

</details>


## 문제 2 · 한 번도 사지 않은 손님

주문이 하나도 없는 손님의 성과 이름, 그 손님이 좋아하는 색의 이름을 구하라.

**풀이 전략.** "없는 것"을 찾는 문제다. 조인은 짝이 있는 줄만 남기므로, 그냥 이으면 주문 없는 손님이 사라진다. 손님을 모두 남기는 `LEFT JOIN`으로 ORDER를 붙이면, 주문 없는 손님의 줄에는 ORDER 쪽 열이 NULL로 채워진다. 그 줄만 고른다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *색 이름 붙이기:* `CUSTOMER`와 `COLOR`를 `C.id = CUS.favorite_color_id`로 잇는다.
2. *주문 붙이기, 손님은 모두 남기기:* `LEFT JOIN "ORDER" AS O ON O.customer_id = CUS.id`.
3. *짝 없는 줄만:* `WHERE O.customer_id IS NULL`.

```sql
SELECT CUS.last_name,
       CUS.first_name,
       C.name
FROM   CUSTOMER AS CUS
  JOIN COLOR AS C ON C.id = CUS.favorite_color_id
  LEFT JOIN "ORDER" AS O ON O.customer_id = CUS.id
WHERE  O.customer_id IS NULL;
```

| last_name | first_name | name |
|---|---|---|
| Jung | Sora | Black |
| Han | Yuna | Red |

`LEFT JOIN`을 `JOIN`으로 바꾸면 0행이다. 주문 없는 손님이 조인에서 먼저 빠져 버려서 `IS NULL`에 걸릴 줄이 없다.

같은 답을 `NOT EXISTS`로도 쓴다: `WHERE NOT EXISTS (SELECT * FROM "ORDER" AS O WHERE O.customer_id = CUS.id)`.

</details>


## 문제 3 · 주 범주와 하위 범주

주 범주(`parent_id`가 NULL인 범주)의 이름과 그 바로 아래 하위 범주의 이름을(있으면) 구하라. 첫 열은 `category`, 둘째 열은 `subcategory`라고 부른다.

**풀이 전략.** 주 범주도 하위 범주도 CATEGORY 한 표에 있다. 같은 표를 두 번 쓴다. `C1`은 주 범주 구실, `C2`는 하위 범주 구실이다. 하위 범주의 `parent_id`가 주 범주의 `id`를 가리킨다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *두 구실:* `CATEGORY AS C1`(주 범주), `CATEGORY AS C2`(하위 범주).
2. *잇는 조건:* `C2.parent_id = C1.id`.
3. *주 범주만:* `WHERE C1.parent_id IS NULL`.

```sql
SELECT C1.name AS category,
       C2.name AS subcategory
FROM   CATEGORY AS C1
  JOIN CATEGORY AS C2 ON C2.parent_id = C1.id
WHERE  C1.parent_id IS NULL;
```

| category | subcategory |
|---|---|
| Tops | T-shirts |
| Tops | Hoodies |
| Bottoms | Shorts |

Graphic tees는 T-shirts의 아래라서 Tops의 "바로 아래"가 아니다. 나오지 않는다.

하위 범주가 없는 주 범주 Accessories는 이 결과에 없다. 문제의 "있으면(if one exists)"을 "하위 범주가 없는 주 범주도 한 줄 내라"로 읽으면 `JOIN`을 `LEFT JOIN`으로 바꿔야 한다. 그러면 (Accessories, NULL) 한 줄이 더해져 4행이 된다. 어느 쪽 읽기가 맞는지는 문제만으로는 정해지지 않는다[^s2].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~3의 결과, `ORDER`를 따옴표 없이 쓴 문장의 구문 오류, 변형 — [72_advanced-sql-practice_p3.py](/Hongs_Blog/studies/database-design/code/72_advanced-sql-practice_p3/). PostgreSQL 16에서 실행 — [72_advanced-sql-practice_p5.sql](/Hongs_Blog/studies/database-design/code/72_advanced-sql-practice_p5-sql/)</div>

</div>


## 달리기 모임 (문제 4~5)

러너와 달리기 대회를 담은 데이터베이스다.

| 표 | 열 |
|---|---|
| RUNNER | id (기본 키), name, main_distance(대회에서 뛰는 거리), age, is_female |
| EVENT | id, name(예: London Marathon), start_date, city |
| RUNNER_EVENT | runner_id, event_id |

**RUNNER** (main_distance는 km)

| id | name | main_distance | age | is_female |
|---|---|---|---|---|
| 1 | Ara | 5 | 24 | 참 |
| 2 | Bin | 5 | 31 | 거짓 |
| 3 | Chan | 5 | 28 | 거짓 |
| 4 | Dana | 5 | 35 | 참 |
| 5 | Eun | 10 | 22 | 참 |
| 6 | Gun | 10 | 40 | 거짓 |
| 7 | Hyun | 10 | 29 | 거짓 |
| 8 | Jin | 42 | 33 | 거짓 |
| 9 | Kyu | 42 | 45 | 거짓 |

**EVENT**

| id | name | start_date | city |
|---|---|---|---|
| 1 | Seoul Marathon | 2024-03-17 | Seoul |
| 2 | Han River 10K | 2024-05-05 | Seoul |
| 3 | Jeju Trail Run | 2024-09-21 | Jeju |
| 4 | Busan Night Run | 2024-10-12 | Busan |

**RUNNER_EVENT**: (8, 1), (9, 1), (5, 1), (5, 2), (6, 2), (1, 4). 앞이 runner_id, 뒤가 event_id다.

## 문제 4 · 거리마다 러너 수

주 거리와 그 거리를 뛰는 러너의 수(`runners_number`)를 구하라. 러너 수가 3보다 큰 줄만 보인다.

**풀이 전략.** "거리마다 몇 명"이니 거리로 묶고 센다. "3보다 큰 줄만"은 센 값에 거는 조건이라 묶은 뒤에 거른다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *묶는 열:* `main_distance`. 한 줄이 거리 하나다.
2. *묶음마다 낼 값:* `COUNT(*)`.
3. *묶음에 거는 조건:* `HAVING COUNT(*) > 3`.

```sql
SELECT R.main_distance,
       COUNT(*) AS runners_number
FROM   RUNNER AS R
GROUP BY R.main_distance
HAVING COUNT(*) > 3;
```

묶으면 (5, 4), (10, 3), (42, 2)다. 조건을 지나는 것은 한 줄뿐이다.

| main_distance | runners_number |
|---|---|
| 5 | 4 |

10 km는 딱 3명이라 "3보다 크다"가 아니다. 조건을 `WHERE COUNT(*) > 3`으로 쓰면 오류다. `WHERE`는 묶기 전에 행을 거르는 자리라 그때는 센 값이 없다.

열에 붙이는 새 이름에는 표 이름을 달 수 없다. `COUNT(*) AS R.runners_number`처럼 쓰면 SQLite와 PostgreSQL 16 모두 구문 오류를 낸다.

</details>


## 문제 5 · 대회마다 참가자 수

대회 이름과 그 대회에 나가는 모임 회원의 수(`runner_count`)를 구하라. 회원이 한 명도 안 나가는 대회가 있을 수 있다. 그런 대회의 `runner_count`는 0이어야 한다.

**풀이 전략.** 대회와 러너는 다대다 사이다. 한 러너가 여러 대회에 나가고 한 대회에 여러 러너가 나간다. 둘을 잇는 표가 RUNNER_EVENT다. 참가자가 없는 대회도 한 줄 나와야 하니 EVENT를 왼쪽에 두고 `LEFT JOIN`한다. 0이 나오게 하려면 무엇을 세는지가 중요하다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *모두 남길 표:* `EVENT AS E`를 왼쪽에.
2. *참가 기록 붙이기:* `LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id`.
3. *러너 붙이기:* `LEFT JOIN RUNNER AS R ON RE.runner_id = R.id`.
4. *묶고 세기:* 대회로 묶고 `COUNT(R.id)`. 러너 쪽 열을 센다.

```sql
SELECT E.name,
       COUNT(R.id) AS runner_count
FROM   EVENT AS E
  LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id
  LEFT JOIN RUNNER AS R ON RE.runner_id = R.id
GROUP BY E.name;
```

| name | runner_count |
|---|---|
| Seoul Marathon | 3 |
| Han River 10K | 2 |
| Jeju Trail Run | 0 |
| Busan Night Run | 1 |

Jeju Trail Run은 `LEFT JOIN` 뒤에 러너 쪽이 NULL로 채워진 한 줄로 남는다. `COUNT(R.id)`는 NULL을 세지 않아 0을 낸다. `COUNT(*)`로 세면 그 한 줄을 세어 1이 나온다. `LEFT JOIN`을 `JOIN`으로 쓰면 Jeju Trail Run이 아예 사라져 3행이 된다.

러너의 이름이나 나이를 쓰지 않으므로 RUNNER까지 잇지 않아도 된다. `COUNT(RE.runner_id)`로 세면 조인 하나로 같은 답이 나온다.

표에 별칭 `R`을 붙인 뒤에는 그 표를 `R`로만 가리킨다. `COUNT(runner.id)`처럼 원래 표 이름을 쓰면 SQLite는 `no such column: runner.id`를, PostgreSQL 16은 `invalid reference to FROM-clause entry for table "runner"`를 낸다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 4~5의 결과, 별칭을 잘못 쓴 두 문장의 오류, `COUNT(*)`와 내부 조인의 결과, 변형 — [72_advanced-sql-practice_p5.py](/Hongs_Blog/studies/database-design/code/72_advanced-sql-practice_p5/). PostgreSQL 16에서 실행 — [72_advanced-sql-practice_p5.sql](/Hongs_Blog/studies/database-design/code/72_advanced-sql-practice_p5-sql/)</div>

</div>


## 변형 문제

**변형 1.** 문제 1에서 Park이 Trail Hoodie를 한 번 더 주문했다(주문 8). 결과는 몇 줄인가? 같은 줄이 두 번 나오지 않게 하려면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

5줄이다. (Trail Hoodie, Blue, Park, Jisu)가 두 번 나온다. 한 줄이 주문 한 건이기 때문이다. `SELECT DISTINCT`로 쓰면 4줄이다.

</details>


**변형 2.** 문제 2에 좋아하는 색을 정하지 않은 손님(favorite_color_id가 NULL)이 있고, 이 손님도 주문이 없다. 위 풀이에 이 손님이 나오는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

안 나온다. CUSTOMER와 COLOR를 잇는 내부 조인에서 먼저 빠진다. COLOR도 `LEFT JOIN`으로 이으면 색 이름이 NULL인 줄로 나온다. 손님 (7, Noah, Lim, NULL)을 넣어 보면 위 풀이는 2줄 그대로이고, 둘 다 `LEFT JOIN`으로 쓴 판은 (Lim, Noah, NULL)이 더해져 3줄이다.

</details>


**변형 3.** 문제 5에 이름이 같은 대회가 하나 더 생겼다: (5, 'Seoul Marathon', 2025-03-16, Seoul), 참가자는 러너 8 한 명. 위 풀이의 결과는? 대회를 따로 세려면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`GROUP BY E.name`은 이름이 같은 두 대회를 한 묶음으로 합쳐 (Seoul Marathon, 4)를 낸다. 결과는 여전히 4줄이다. 대회를 가려내는 것은 이름이 아니라 id다. `GROUP BY E.id, E.name`으로 묶으면 (Seoul Marathon, 3)과 (Seoul Marathon, 1)이 따로 나와 5줄이 된다.

</details>






[^s1]: 행은 문제마다 답이 갈리는 경우(좋아하는 색이 아닌 주문, 주문 없는 손님, 하위 범주 없는 주 범주, 딱 3명인 거리, 참가자 없는 대회)가 하나씩 들어가게 만들었다. 결과는 SQLite 3.50.4와 PostgreSQL 16에서 실행해 확인했다.
[^s2]: 두 판의 결과(3행, 4행)를 문제 코드로 확인했다.
{% endraw %}
