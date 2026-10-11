---
layout: "note"
title: "DROP 명령과 CASCADE·RESTRICT"
display_title: "DROP 명령과 CASCADE·RESTRICT"
kind: "concept"
kind_label: "정의"
num: "58"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["DROP", "DROP TABLE", "DROP SCHEMA", "CASCADE", "RESTRICT", "스키마 진화", "Schema Evolution", "스키마 변경", "Schema Modification", "표 삭제", "테이블 삭제", "Drop Behavior"]
description: "표나 표 묶음을 통째로 없애는 명령이다. 행을 지우면 빈 표가 남아 다시 채울 수 있지만, 표를 없애면 틀까지 사라져 그 이름으로는 아무것도 할 수 없다. 서류철에서 종이를 다 빼는 것과 서류철 자체를 버리는 것의 차이다. 없애려는 것에 다른 것이 기대고 있을 때는, 기댄 것까지 …"
prev_url: "/studies/database-design/sql-set-operations/"
prev_title: "집합 연산 UNION·EXCEPT·INTERSECT"
next_url: "/studies/database-design/sql-alter-table/"
next_title: "ALTER TABLE"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-drop/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표나 표 묶음을 통째로 없애는 명령이다. 행을 지우면 빈 표가 남아 다시 채울 수 있지만, 표를 없애면 틀까지 사라져 그 이름으로는 아무것도 할 수 없다. 서류철에서 종이를 다 빼는 것과 서류철 자체를 버리는 것의 차이다. 없애려는 것에 다른 것이 기대고 있을 때는, 기댄 것까지 한꺼번에 없애라고 하거나 기댄 것이 있으면 그만두라고 함께 적는다.

</div>


## 예시로 보기

부양가족 표 DEPENDENT가 더 필요 없어졌다. 행을 다 지우면 될까, 표를 없애야 할까? 두 문장을 따로 돌려 견준다[^1].

| | `DELETE FROM DEPENDENT;` | `DROP TABLE DEPENDENT CASCADE;` |
|---|---|---|
| 행 | 7행이 0행이 된다 | 사라진다 |
| 표의 틀 | 남는다. 칸 다섯 개와 제약이 그대로다 | 사라진다 |
| 그 뒤에 행을 넣으면 | 들어간다 | 오류. 그런 표가 없다 |
| 그 뒤에 행 수를 세면 | 0 | 오류. 그런 표가 없다 |

`DELETE`는 표의 내용만 비운다. `DROP TABLE`은 DBMS가 "어떤 표가 있고 어떤 칸이 있는가"를 적어 둔 곳(카탈로그)에서 그 표의 틀까지 지운다. 나중에 다시 쓸 표라면 `DELETE`를, 표 자체가 필요 없으면 `DROP TABLE`을 쓴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `DELETE`와 `DROP TABLE` 뒤의 차이(SQLite) — [58_sql-drop_verify.py](/Hongs_Blog/studies/database-design/code/58_sql-drop_verify/). `DROP TABLE`과 `DROP SCHEMA`의 `CASCADE`·`RESTRICT`는 PostgreSQL 16에서 실행 — [58_sql-drop_verify.sql](/Hongs_Blog/studies/database-design/code/58_sql-drop_verify-sql/)</div>

</div>


## 정의

표, 속성, 제약 같은 스키마의 요소를 더하거나 없애 스키마를 바꾸는 문장을 스키마 진화(schema evolution) 명령이라 한다. `DROP`과 `ALTER`가 여기에 든다. 세 가지가 따라붙는다[^2].

- 데이터베이스가 돌아가는 동안에 할 수 있다.
- 스키마 전체를 DBMS가 다시 읽어 들이게 할(재컴파일) 필요가 없다.
- 바꾼 것이 데이터베이스의 나머지에 영향을 주거나 앞뒤가 안 맞게 만들지 않는지 DBMS가 검사해야 한다.

**<code>DROP SCHEMA 이름 CASCADE &#124; RESTRICT</code>.** 더 필요 없는 스키마를 통째로 없앤다[^3].

```sql
DROP SCHEMA COMPANY CASCADE;
```

- `CASCADE`: 스키마에 든 요소(표, 도메인 등)를 모두 함께 없앤다.
- `RESTRICT`: 스키마에 든 요소가 하나도 없을 때만 없앤다. 든 것이 있으면 사용자가 하나씩 먼저 없애야 한다.

**<code>DROP TABLE 이름 CASCADE &#124; RESTRICT</code>.** 이름으로 가리킨 표를 없앤다. 표의 튜플을 모두 지우고, 카탈로그에서 표의 정의도 지운다[^1].

```sql
DROP TABLE DEPENDENT CASCADE;
```

- `CASCADE`: 튜플과 표의 정의를 지우고, 이 표를 가리키는 제약과 다른 요소도 스키마에서 저절로 함께 없앤다.
- `RESTRICT`: 어떤 제약도, 다른 어떤 요소도 이 표를 가리키지 않을 때만 없앤다.

`DROP`은 도메인, 자료형, 제약(주장과 트리거까지)처럼 이름이 붙은 다른 요소를 없애는 데도 쓴다[^1].

## 예제

COMPANY의 여섯 표를 만들어 놓고 PostgreSQL 16에서 문장을 하나씩 돌린 결과다[^s1].

| 문장 | 결과 |
|---|---|
| `DROP TABLE DEPENDENT RESTRICT;` | 없어진다. DEPENDENT를 가리키는 것이 없다 |
| `DROP TABLE DEPARTMENT RESTRICT;` | 거부. 외래 키 셋(EMPLOYEE.Dno, DEPT_LOCATIONS.Dnumber, PROJECT.Dnum)이 이 표를 가리킨다 |
| `DROP TABLE DEPARTMENT CASCADE;` | 표가 없어지고, 가리키던 외래 키 제약 셋도 함께 없어진다 |
| `DROP SCHEMA COMPANY RESTRICT;` | 거부. 스키마에 표가 들어 있다 |
| `DROP SCHEMA COMPANY CASCADE;` | 스키마와 그 안의 표가 모두 없어진다 |

셋째 줄에서 놓치기 쉬운 것이 있다. "CASCADE니까 DEPARTMENT를 가리키던 직원 행까지 지워지나?" 아니다. 함께 없어지는 것은 가리키던 **제약**이지 가리키던 **행**이 아니다. `DROP TABLE DEPARTMENT CASCADE;` 뒤에도 EMPLOYEE는 8행, PROJECT는 6행, DEPT_LOCATIONS는 5행 그대로다. 달라진 것은 그 표들의 부서 번호 칸이 이제 아무 표도 가리키지 않는다는 점이다. 그래서 77번처럼 없는 부서 번호를 적은 프로젝트도 들어간다.

같은 낱말 `CASCADE`가 외래 키의 `ON DELETE CASCADE`에서는 행을 함께 지운다([참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/)). 둘을 섞지 않는다.

| | `DROP TABLE … CASCADE` | `ON DELETE CASCADE` |
|---|---|---|
| 언제 | 표를 없앨 때 | 가리킴 받는 행을 지울 때 |
| 함께 없어지는 것 | 그 표를 가리키던 제약(과 뷰) | 그 행을 가리키던 행 |

## 활용

- **`DELETE`도 마음대로 다 지우지는 못한다.** `DELETE FROM PROJECT;`는 거부된다. WORKS_ON의 행들이 프로젝트를 가리키기 때문이다. `DELETE`는 표의 제약을 지키며 일한다[^s1].
- **아무것도 안 적으면.** PostgreSQL 16은 `CASCADE`도 `RESTRICT`도 안 적은 `DROP TABLE`을 `RESTRICT`로 다룬다[^s1].
- **제품마다 다른 점.** SQLite에는 `DROP SCHEMA`가 없고, `DROP TABLE` 뒤에 `CASCADE`나 `RESTRICT`를 적으면 구문 오류다[^s1].
- **기대는 것은 외래 키만이 아니다.** 표에서 뽑아 만든 [뷰](/Hongs_Blog/studies/database-design/sql-view/)가 있으면 `RESTRICT`는 막고 `CASCADE`는 뷰까지 없앤다[^s1].

## 연결

- 선수: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [INSERT·DELETE·UPDATE](/Hongs_Blog/studies/database-design/sql-insert-delete-update/)
- 표의 정의를 적어 두는 카탈로그: [데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/)
- 표를 없애지 않고 틀만 고치기: [ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 학기가 바뀌어 수강 신청 표의 행을 모두 비우되 다음 학기에 같은 표를 다시 쓴다. (나) 시범 사업이 끝나 그 사업의 표가 더 필요 없다. 각각 `DELETE`와 `DROP TABLE` 가운데 무엇을 쓰는가? 두 문장은 무엇이 다른가?</summary>

**답:** (가)는 `DELETE`, (나)는 `DROP TABLE`이다. `DELETE`는 튜플만 지우고 표의 정의는 남긴다. `DROP TABLE`은 튜플을 모두 지우고 카탈로그에서 표의 정의까지 지운다.<br>
**이유:** `DELETE` 뒤에는 그 표에 다시 행을 넣을 수 있다. `DROP TABLE` 뒤에는 그런 표가 없어서 넣을 수도 찾을 수도 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** COMPANY의 여섯 표가 다 있을 때 `DROP TABLE EMPLOYEE RESTRICT;`는 되는가? 안 된다면 무엇이 막는가?</summary>

**답:** 안 된다. 다른 표의 외래 키 셋이 EMPLOYEE를 가리킨다. DEPARTMENT.Mgr_ssn, WORKS_ON.Essn, DEPENDENT.Essn이다.<br>
**이유:** `RESTRICT`는 그 표를 가리키는 제약이 하나라도 있으면 그만둔다. `CASCADE`로 바꾸면 표와 함께 그 제약 셋이 없어진다. WORKS_ON의 16행과 DEPENDENT의 7행은 그대로 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `DROP TABLE DEPARTMENT CASCADE;`를 한 뒤에도 EMPLOYEE의 여덟 행이 그대로 남아 있는 까닭은 무엇인가? 외래 키의 `ON DELETE CASCADE`와는 어떻게 다른가?</summary>

**답:** `DROP TABLE`의 `CASCADE`가 함께 없애는 것은 그 표를 가리키던 제약이지, 그 표를 가리키던 행이 아니기 때문이다. `ON DELETE CASCADE`는 가리킴 받는 행이 지워질 때 그 행을 가리키던 행을 함께 지운다.<br>
**이유:** 앞의 것은 틀(스키마)을 고치는 문장의 선택지이고, 뒤의 것은 행을 지울 때 일어나는 동작이다. 낱말만 같다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.16 (The DROP TABLE Command, DELETE와의 차이, CASCADE와 RESTRICT, 다른 요소의 DROP)
[^2]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.14 (Schema Evolution Statements in SQL)
[^3]: 데이터베이스 설계 11회 강의 자료 「11_SQL-DDL-Complex」, p.15 (The DROP SCHEMA Command)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `DELETE`와 `DROP TABLE`을 견준 표, PostgreSQL 16에서 돌린 다섯 문장의 결과, "함께 없어지는 것은 제약이지 행이 아니다", `ON DELETE CASCADE`와 견준 표, 아무것도 안 적었을 때의 동작, SQLite에 없는 것, 뷰가 기댈 때의 결과, 확인 문제는 슬라이드에 없다. PostgreSQL 16과 SQLite 3.50에서 실행해 확인했다.
{% endraw %}
