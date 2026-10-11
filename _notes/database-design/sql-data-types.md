---
layout: "note"
title: "SQL 자료형"
display_title: "SQL 자료형 (SQL Data Types)"
kind: "concept"
kind_label: "정의"
num: "47"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["SQL Data Types", "Attribute Data Types", "자료형", "데이터 타입", "INT", "FLOAT", "DECIMAL", "CHAR", "VARCHAR", "BIT", "VARBIT", "BOOLEAN", "DATE", "TIME", "TIMESTAMP", "도메인", "CREATE DOMAIN"]
description: "칸마다 어떤 꼴의 값을 받을지 정해 두는 것이 자료형이다. 신청서의 칸에 \"숫자만\", \"아홉 글자\", \"날짜\"라고 적어 두는 것과 같다. 꼴이 정해져 있으면 엉뚱한 값이 걸러지고, 크기를 견주거나 날짜끼리 빼는 계산도 제대로 된다. 다만 얼마나 엄격하게 막는지는 제품마다 달라서, …"
prev_url: "/studies/database-design/sql-create-table/"
prev_title: "CREATE SCHEMA와 CREATE TABLE"
next_url: "/studies/database-design/sql-attribute-constraints/"
next_title: "속성 제약 NOT NULL·DEFAULT·CHECK"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-data-types/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

칸마다 어떤 꼴의 값을 받을지 정해 두는 것이 자료형이다. 신청서의 칸에 "숫자만", "아홉 글자", "날짜"라고 적어 두는 것과 같다. 꼴이 정해져 있으면 엉뚱한 값이 걸러지고, 크기를 견주거나 날짜끼리 빼는 계산도 제대로 된다. 다만 얼마나 엄격하게 막는지는 제품마다 달라서, 자료형의 이름만 받아 두고 길이를 넘는 값도 그대로 넣는 제품이 있다.

</div>


## 예시로 보기

값의 꼴을 정해 두지 않으면 월급 칸에 `'abc'`가 들어가도 아무도 모른다. 그런 칸은 더할 수도, 크기를 견줄 수도 없다. 그래서 표를 만들 때 열 이름 바로 뒤에 그 열이 받을 꼴을 적는다.

직원 표 EMPLOYEE의 열 열 개에는 다음 자료형이 붙어 있다[^1].

| 열 | 자료형 | 읽는 법 |
|---|---|---|
| Fname, Lname | `VARCHAR(15)` | 글자, 15글자까지 |
| Minit, Sex | `CHAR` | 글자 하나 |
| Ssn, Super_ssn | `CHAR(9)` | 글자, 늘 9글자 |
| Bdate | `DATE` | 날짜 |
| Address | `VARCHAR(30)` | 글자, 30글자까지 |
| Salary | `DECIMAL(10,2)` | 수, 모두 열 자리이고 그중 소수점 아래가 두 자리 |
| Dno | `INT` | 정수 |

주민 번호 같은 Ssn은 늘 아홉 자리라서 길이를 고정했고, 이름과 주소는 사람마다 길이가 달라 "몇 글자까지"로 정했다.

## 정의

슬라이드가 드는 기본 자료형은 다음과 같다[^2].

| 갈래 | 자료형 | 뜻 |
|---|---|---|
| 수 | `INT` | 정수 |
| | `FLOAT` | 소수점 자리가 떠다니는 실수. 어림값으로 저장한다 |
| | `DECIMAL(i, j)` | 자릿수를 정해 둔 수. 예: `DECIMAL(5,2)` |
| 문자열 | `CHAR(n)` | 길이가 n으로 고정된 글자열 |
| | `VARCHAR(n)` | 길이가 n까지인 글자열 |
| 비트열 | `BIT(n)` | 길이가 n으로 고정된 0과 1의 줄 |
| | `VARBIT(n)` | 길이가 n까지인 0과 1의 줄 |
| 불 | `BOOLEAN` | 참(True) 또는 거짓(False) |
| 날짜 | `DATE` | 열 자리. 해·달·날을 `YYYY-MM-DD` 꼴로 적는다 |
| 시각 | `TIME` | 여덟 자리. 시·분·초를 `HH:MM:SS` 꼴로 적는다 |
| 날짜와 시각 | `TIMESTAMP` | `DATE` + `TIME` + 초의 소수 부분 여섯 자리 이상. 예: `2024-11-07 13:15:47.648302` |

`DECIMAL(i, j)`에서 $$i$$는 수 전체의 자릿수, $$j$$는 그 가운데 소수점 아래 자릿수다. `DECIMAL(5,2)`는 모두 다섯 자리에 소수 두 자리라서 정수부는 세 자리다. 그래서 999.99까지 들어간다. `DECIMAL(3,1)`인 Hours는 99.9까지다[^s1].

`TIMESTAMP`의 예를 세어 보면 날짜 10자리, 빈칸 1자리, 시각 8자리, 점 1자리, 소수 6자리로 모두 26자리다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 10 p.13의 "BIT(n): fixed or varying length of bits" / 문제점: 바로 아랫줄이 `VARBIT(n)`을 "varying length of bits"라고 적는다. 둘을 가르는 것이 길이가 고정이냐 아니냐이므로 `BIT(n)`은 고정 길이여야 한다 / 수정안: "BIT(n): fixed length of bits" / 근거: PostgreSQL 16에서 `BIT(4)` 열은 세 자리나 다섯 자리 비트열을 오류로 막고, `VARBIT(4)` 열은 한 자리부터 네 자리까지 받는다 — [47_sql-data-types_verify.sql](/Hongs_Blog/studies/database-design/code/47_sql-data-types_verify-sql/)

</div>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 10 p.14의 소제목 "Date Time" / 문제점: 그 아래 설명(열 자리, YEAR·MONTH·DAY, `YYYY-MM-DD`)은 자료형 `DATE` 하나의 것이다. 날짜와 시각을 함께 담는 자료형은 같은 쪽 아래의 `TIMESTAMP`다 / 수정안: 소제목을 "DATE"로 읽는다. 10-2 p.4도 "Date Time" 아래에 `DATE: YYYY-MM-DD`라고 적는다 / 근거: 같은 쪽의 "TIMESTAMP = DATE + TIME + …"라는 설명

</div>


## 예제

**자료형이 값을 막는 모습.** 같은 문장을 두 제품에서 돌린 결과다[^s1].

| 넣으려는 값 | PostgreSQL 16 | SQLite 3.50 |
|---|---|---|
| `VARCHAR(15)` 열에 16글자 | 오류: 값이 너무 길다 | 그대로 들어간다(`VARCHAR(3)`에 8글자도 들어간다) |
| `CHAR(9)` 열에 `'123'` | 빈칸을 채워 9칸으로 저장한다 | 3글자 그대로 저장한다 |
| `DECIMAL(3,1)` 열에 7.55 | 7.6으로 반올림해 넣는다 | 7.55 그대로 넣는다 |
| `DECIMAL(3,1)` 열에 100.0 | 오류: 자릿수를 넘는다 | 그대로 들어간다 |
| `INT` 열에 `'abc'` | 오류: 정수가 아니다 | 글자로 들어간다 |
| `DATE` 열에 `'2024-02-30'` | 오류: 없는 날짜다 | 글자로 들어간다 |
| `BOOLEAN` 열에 2 | 오류: 참·거짓이 아니다 | 그대로 들어간다 |

SQLite는 자료형의 이름만 받아 두고 길이와 꼴을 검사하지 않는다. 세상에 없는 이름을 자료형 자리에 적어도 받는다. SQLite로 연습할 때 "들어갔으니 맞다"고 믿으면 안 되는 까닭이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 PostgreSQL 16 쪽과 `BIT(4)`·`VARBIT(4)`, `DATE`·`TIME`·`TIMESTAMP`의 자릿수(10, 8, 26), `DECIMAL(5,2)`의 범위 — [47_sql-data-types_verify.sql](/Hongs_Blog/studies/database-design/code/47_sql-data-types_verify-sql/) (PostgreSQL 16에서 실행). SQLite 쪽 — [47_sql-data-types_verify.py](/Hongs_Blog/studies/database-design/code/47_sql-data-types_verify/)</div>

</div>


## 활용

- **`CHAR`와 `VARCHAR` 고르기.** 길이가 늘 같은 값(아홉 자리 Ssn, 한 글자 Sex)에는 `CHAR(n)`, 길이가 들쭉날쭉한 값(이름, 주소)에는 `VARCHAR(n)`을 쓴다[^s1].
- **돈은 `DECIMAL`.** `FLOAT`는 어림값이라 0.1 + 0.2가 0.3과 같지 않다. `DECIMAL`은 적어 둔 자리까지 정확하다. 그래서 Salary가 `DECIMAL(10,2)`다[^s1].
- **날짜는 `DATE`.** 날짜를 글자로 넣어 두면 `'2024-11-07'`이 `'2024-2-10'`보다 앞이라고 나온다. 글자는 사전 순서로 견주기 때문이다. `DATE`로 두면 11월이 2월보다 뒤라고 바르게 나오고, 두 날짜를 빼서 며칠 차이인지도 구한다[^s1].
- **도메인.** 자주 쓰는 자료형에 이름을 붙여 여러 열에서 함께 쓸 수 있다. 예: `CREATE DOMAIN SSN_TYPE AS CHAR(9);`를 해 두고 Ssn, Super_ssn, Essn, Mgr_ssn을 모두 `SSN_TYPE`으로 적는다. 길이를 바꿀 때 한 곳만 고치면 된다[^s2].
- **길이를 넉넉하게.** 열의 길이는 실제로 들어올 값을 보고 정한다. 연습 문제의 주소 하나는 31글자라서 `VARCHAR(30)`인 Address에 들어가지 않는다: [제약 위반 찾기 연습](/Hongs_Blog/studies/database-design/constraint-violation-practice/).

## 연결

- 선수: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/)
- 속성이 가질 수 있는 값의 모임(도메인)을 SQL로 적은 것이 자료형이다: [릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/)
- 자료형보다 좁은 범위로 값을 묶는 방법: [속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/)의 `CHECK`

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** WORKS_ON의 Hours는 `DECIMAL(3,1)`이다. 값 32.5, 7.55, 100.0, 168.0을 PostgreSQL 16에서 넣으면 각각 어떻게 되는가?</summary>

**답:** 32.5는 그대로 들어간다. 7.55는 소수 한 자리로 반올림되어 7.6이 된다. 100.0과 168.0은 오류다.<br>
**이유:** 모두 세 자리에 소수 한 자리이므로 정수부는 두 자리, 곧 99.9까지다. 한 주는 168시간이라, 이 자료형으로는 "주 100시간 이상"을 적을 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** EMPLOYEE에서 Ssn은 `CHAR(9)`, Fname은 `VARCHAR(15)`다. 왜 서로 다른 자료형을 골랐는가? Ssn에 `'123'`을 넣으면 `CHAR(9)`와 `VARCHAR(9)`에서 저장되는 모습이 어떻게 다른가?</summary>

**답:** Ssn은 누구나 아홉 자리라서 고정 길이로, 이름은 사람마다 길이가 달라 "15글자까지"로 했다. `CHAR(9)`는 `'123'` 뒤에 빈칸 여섯 개를 채워 9칸으로 저장하고, `VARCHAR(9)`는 3글자만 저장한다.<br>
**이유:** `CHAR(n)`은 길이를 n으로 맞춰 두는 자료형이고 `VARCHAR(n)`은 n을 넘지만 않으면 되는 자료형이다. PostgreSQL 16에서 `CHAR(9)` 열의 `'123'`은 9바이트를 차지한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "SQLite에서 `INSERT`가 오류 없이 됐으니 그 값은 열의 자료형에 맞다"가 틀린 예를 하나 들라.</summary>

**답:** `VARCHAR(3)` 열에 `'12345678'`(8글자)을 넣으면 SQLite는 받는다. PostgreSQL 16에서 `VARCHAR(15)` 열에 16글자를 넣으면 "값이 너무 길다"는 오류가 난다.<br>
**이유:** SQLite는 자료형의 이름만 기록하고 길이와 꼴을 검사하지 않는다. `INT` 열에 `'abc'`, `DATE` 열에 `'2024-02-30'`도 그대로 들어간다.

</details>


[^1]: 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.13 (CREATE TABLE EMPLOYEE의 자료형 열). 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.17
[^2]: 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.13~14 (Attribute Data Types in SQL). 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.4
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `DECIMAL(i, j)`의 $$i$$, $$j$$의 뜻(슬라이드는 "formatted numbers (e.g., DECIMAL(5,2))"만 적는다), 두 제품을 견준 표, `CHAR`와 `VARCHAR` 고르기, `FLOAT`와 `DECIMAL`, 날짜를 글자로 둘 때의 문제는 슬라이드에 없다. 모두 PostgreSQL 16과 SQLite 3.50에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 9 p.17은 "basic data types … and domains"라고 도메인을 이름만 든다. `CREATE DOMAIN` 문과 예는 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 6.1.3절의 것이고, PostgreSQL 16에서 실행해 길이 제한이 걸리는 것을 확인했다.
{% endraw %}
