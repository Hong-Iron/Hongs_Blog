---
layout: "note"
title: "ALTER TABLE"
display_title: "ALTER TABLE"
kind: "concept"
kind_label: "정의"
num: "59"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["ALTER TABLE", "ALTER", "ADD COLUMN", "DROP COLUMN", "DROP CONSTRAINT", "ADD CONSTRAINT", "표 변경", "테이블 변경", "열 추가", "열 삭제", "제약 삭제", "Altering Schema Elements"]
description: "이미 만든 표의 틀을 고치는 명령으로, 칸을 새로 더하고, 안 쓰는 칸을 없애고, 걸어 둔 규칙을 떼거나 붙인다. 쓰고 있는 장부에 칸 하나를 덧그리는 것과 같아서, 표를 새로 만들고 행을 옮겨 적지 않아도 된다. 새로 더한 칸은 이미 있던 행에서는 비어 있다. 없애려는 칸에 다른…"
prev_url: "/studies/database-design/sql-drop/"
prev_title: "DROP 명령과 CASCADE·RESTRICT"
next_url: "/studies/database-design/nested-query-in/"
next_title: "중첩 질의와 IN"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-alter-table/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이미 만든 표의 틀을 고치는 명령으로, 칸을 새로 더하고, 안 쓰는 칸을 없애고, 걸어 둔 규칙을 떼거나 붙인다. 쓰고 있는 장부에 칸 하나를 덧그리는 것과 같아서, 표를 새로 만들고 행을 옮겨 적지 않아도 된다. 새로 더한 칸은 이미 있던 행에서는 비어 있다. 없애려는 칸에 다른 것이 기대고 있으면, 기댄 것까지 없앨지 그만둘지를 함께 적는다.

</div>


## 예시로 보기

직원 표를 쓰다 보니 직원이 맡은 일(Job)도 적어 두고 싶어졌다. 표를 없애고 칸을 하나 더해 다시 만들면 여덟 행을 처음부터 다시 넣어야 한다. 표를 그대로 둔 채 칸만 더한다[^1].

```sql
ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Job VARCHAR(12);
```

EMPLOYEE의 칸이 10개에서 11개가 된다. Job은 맨 뒤에 붙는다. 이미 있던 여덟 행은 그대로이고, 그 행들의 Job 칸은 모두 NULL이다. 아직 아무도 값을 적지 않았으니 당연하다. 값은 그다음에 `UPDATE`로 채운다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `ADD COLUMN` 뒤 칸 11개와 Job이 NULL인 8행, `DROP COLUMN` 뒤의 칸 목록(SQLite) — [59_sql-alter-table_verify.py](/Hongs_Blog/studies/database-design/code/59_sql-alter-table_verify/). 슬라이드의 세 문장과 `CASCADE`·`RESTRICT`, `DROP CONSTRAINT`는 PostgreSQL 16에서 실행 — [59_sql-alter-table_verify.sql](/Hongs_Blog/studies/database-design/code/59_sql-alter-table_verify-sql/)</div>

</div>


## 정의

`ALTER TABLE`은 표의 정의를 바꾼다. 할 수 있는 일은 세 갈래다[^1].

- 속성(칸)을 더하거나 없앤다.
- 칸의 정의를 바꾼다. 자료형이나 그 칸에 걸린 제약을 바꾼다.
- 표에 건 제약을 더하거나 없앤다.

`DROP`과 함께, 돌아가는 데이터베이스의 스키마를 고치는 [스키마 진화 명령](/Hongs_Blog/studies/database-design/sql-drop/)이다.

**칸 더하기.** `ADD COLUMN 이름 자료형`.

**칸 없애기.** <code>DROP COLUMN 이름 CASCADE &#124; RESTRICT</code>[^2].

```sql
ALTER TABLE COMPANY.EMPLOYEE DROP COLUMN Address CASCADE;
```

- `CASCADE`: 그 칸을 가리키는 제약을 모두 칸과 함께 저절로 없앤다.
- `RESTRICT`: 스키마의 어떤 요소도 그 칸을 가리키지 않을 때만 없앤다.

**제약 없애기와 더하기.** `DROP CONSTRAINT 제약이름`. 표를 만들 때 [이름을 붙여 둔 제약](/Hongs_Blog/studies/database-design/sql-key-clauses/)을 그 이름으로 골라 뗀다[^3].

```sql
ALTER TABLE COMPANY.EMPLOYEE
      DROP CONSTRAINT EMPSUPERFK CASCADE;
```

다시 붙일 때는 `ADD CONSTRAINT 제약이름 …`으로 제약을 적는다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 11 p.17~19의 소제목 "The ALTER SCHEMA Command" / 문제점: 세 쪽의 예가 모두 `ALTER TABLE …`로 시작하고 설명도 "표나 다른 스키마 요소의 정의를 바꾼다"다. 칸을 더하고 빼는 명령은 `ALTER TABLE`이다 / 수정안: 소제목을 "The ALTER TABLE Command"로 읽는다. 큰 제목 "Altering Schema Elements"(스키마 요소 고치기)는 그대로 맞다 / 근거: PostgreSQL 16에서 `ALTER SCHEMA COMPANY ADD COLUMN …`은 구문 오류이고 `ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN …`은 돈다 — [59_sql-alter-table_verify.sql](/Hongs_Blog/studies/database-design/code/59_sql-alter-table_verify-sql/)

</div>


## 예제

COMPANY에 PostgreSQL 16으로 문장을 하나씩 돌린 결과다[^s1].

| 문장 | 결과 |
|---|---|
| `ADD COLUMN Job VARCHAR(12)` | 칸이 맨 뒤에 붙는다. 여덟 행 모두 Job이 NULL |
| `ADD COLUMN Grade INT NOT NULL` | 거부. 이미 있는 여덟 행에 넣을 값이 없는데 NULL은 안 된다고 했다 |
| `ADD COLUMN Grade INT NOT NULL DEFAULT 1` | 붙는다. 여덟 행 모두 Grade가 1 |
| `DROP COLUMN Address CASCADE` | Address 칸이 사라진다. 행은 여덟 개 그대로 |
| DEPARTMENT에서 `DROP COLUMN Dnumber RESTRICT` | 거부. 다른 표의 외래 키 셋이 이 칸을 가리킨다 |
| DEPARTMENT에서 `DROP COLUMN Dnumber CASCADE` | 칸이 사라지고, 가리키던 외래 키 제약 셋도 함께 사라진다 |
| `DROP CONSTRAINT EMPSUPERFK CASCADE` | 상사 칸의 외래 키가 사라진다. 그 뒤로는 없는 직원 번호를 상사로 적어도 들어간다 |
| 그런 행이 든 채로 `ADD CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)` | 거부. 이미 든 행이 제약을 어긴다. 그 행을 지우거나 고치면 붙는다 |

둘째 줄이 `NOT NULL` 칸을 더할 때 걸리는 곳이다. 새 칸은 이미 있던 행에서 값이 없다. 그 "없음"을 무엇으로 채울지 정해 주지 않으면 `NOT NULL`과 부딪힌다. 기본값을 주면 풀린다.

마지막 줄은 제약을 나중에 붙일 때 일어나는 일이다. 제약은 앞으로 들어올 행만이 아니라 이미 든 행에도 맞아야 한다.

## 활용

- **서로 가리키는 외래 키 붙이기.** 직원 표와 부서 표처럼 서로를 가리키는 표는 `CREATE TABLE`에서 외래 키를 다 적을 수 없다. 한쪽 외래 키를 빼고 만든 뒤 `ALTER TABLE … ADD CONSTRAINT`로 붙인다: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/).
- **기본값 바꾸기.** 칸의 정의를 바꾸는 예다. `ALTER TABLE COMPANY.DEPARTMENT ALTER COLUMN Mgr_ssn DROP DEFAULT;`는 기본값을 떼고, `… SET DEFAULT '333445555';`는 새 기본값을 건다[^s2].
- **칸을 없애는 것과 값을 비우는 것은 다르다.** `DROP COLUMN Address`는 칸 자체를 없앤다. Address 값만 비우려면 `UPDATE EMPLOYEE SET Address = NULL;`이다. 앞의 것은 틀을, 뒤의 것은 내용을 바꾼다.
- **제품마다 다른 점.** SQLite는 `ADD COLUMN`과 `DROP COLUMN`만 받고, `CASCADE`·`RESTRICT`를 적거나 `DROP CONSTRAINT`를 쓰면 구문 오류다. PostgreSQL 16은 없애는 칸이 그 표 자신의 제약에 들어 있으면 `RESTRICT`여도 그 제약을 함께 없앤다. Super_ssn을 없애면 EMPSUPERFK도 사라진다. `RESTRICT`가 막는 것은 다른 표의 외래 키나 뷰가 그 칸에 기댈 때다[^s1].

## 연결

- 선수: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/), [DROP 명령과 CASCADE·RESTRICT](/Hongs_Blog/studies/database-design/sql-drop/)
- 표에 칸을 더해도 그 칸을 안 쓰는 프로그램은 고칠 필요가 없다: [데이터 독립성](/Hongs_Blog/studies/database-design/data-independence/)
- 새 칸의 값을 채우는 문장: [INSERT·DELETE·UPDATE](/Hongs_Blog/studies/database-design/sql-insert-delete-update/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `ALTER TABLE COMPANY.EMPLOYEE ADD COLUMN Job VARCHAR(12);`를 돌린 바로 뒤에 `SELECT Lname, Job FROM EMPLOYEE;`를 돌리면 몇 행이 나오고 Job 칸에는 무엇이 들어 있는가?</summary>

**답:** 8행이 나온다. Job은 여덟 행 모두 NULL이다.<br>
**이유:** 칸을 더하는 문장은 틀만 바꾼다. 이미 있던 행에는 새 칸의 값을 적은 적이 없으므로 "값이 없음"인 NULL이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 행이 든 표에 `ADD COLUMN Grade INT NOT NULL`이 거부되는 까닭은 무엇인가? 어떻게 고치면 되는가?</summary>

**답:** 이미 있는 행의 Grade는 값이 없어 NULL이 되어야 하는데, `NOT NULL`이 그것을 금지한다. `ADD COLUMN Grade INT NOT NULL DEFAULT 1`처럼 기본값을 주면 이미 있던 행에 그 값이 들어가 붙는다.<br>
**이유:** 제약은 새로 들어올 행만이 아니라 표에 이미 든 행에도 맞아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 세 가지 일에 맞는 문장을 고르라. (가) 직원 표에서 주소 칸을 아예 없앤다 (나) 주소 칸은 두고 모든 직원의 주소 값만 비운다 (다) 직원 표 자체를 없앤다</summary>

**답:** (가) `ALTER TABLE EMPLOYEE DROP COLUMN Address …;` (나) `UPDATE EMPLOYEE SET Address = NULL;` (다) `DROP TABLE EMPLOYEE …;`<br>
**이유:** (가)와 (다)는 표의 틀을 바꾸는 DDL이고 (나)는 행의 값만 바꾸는 DML이다. (가)는 칸 하나를, (다)는 표 전체를 없앤다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.17 (Altering Schema Elements, ADD COLUMN Job VARCHAR(12))
[^2]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.18 (DROP COLUMN Address CASCADE, CASCADE와 RESTRICT의 설명)
[^3]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.19 (DROP CONSTRAINT EMPSUPERFK CASCADE, "To drop (or add) the constraint specified on a table")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예제 표의 여덟 문장과 결과, `NOT NULL` 칸을 더할 때의 거부, 어긋난 행이 있을 때 제약을 못 붙이는 것, 제품마다 다른 점, 확인 문제는 슬라이드에 없다. PostgreSQL 16과 SQLite 3.50에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드는 "Changing a column definition (e.g., data types or constraints)"라고만 적고 문장은 보이지 않는다. `ALTER COLUMN … DROP DEFAULT`와 `SET DEFAULT`의 예는 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.4.2절의 것이고 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
