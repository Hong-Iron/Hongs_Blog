---
layout: "note"
title: "SQL 한눈에 보기"
display_title: "SQL 한눈에 보기 (Structured Query Language)"
kind: "concept"
kind_label: "정의"
num: "45"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["SQL", "Structured Query Language", "SEQUEL", "Structured English Query Language", "구조적 질의어", "선언적 언어", "Declarative Language", "데이터 정의어", "DDL", "Data Definition Language", "데이터 조작어", "DML", "Data Manipulation Language"]
description: "SQL은 표로 된 데이터베이스에 일을 시키는 언어다. 식당에서 주문하듯 \"무엇을 달라\"만 말하면 되고, 어떻게 찾을지는 데이터베이스가 정한다. 명령은 표 자체를 만들고 고치고 없애는 묶음과, 표 안의 행을 찾고 넣고 지우고 고치는 묶음으로 나뉜다. 다만 찾는 방법만 맡기는 것이라서…"
prev_url: "/studies/database-design/er-to-relational-mapping/"
prev_title: "ER-관계형 사상 절차"
next_url: "/studies/database-design/sql-create-table/"
next_title: "CREATE SCHEMA와 CREATE TABLE"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/sql-overview/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

SQL은 표로 된 데이터베이스에 일을 시키는 언어다. 식당에서 주문하듯 "무엇을 달라"만 말하면 되고, 어떻게 찾을지는 데이터베이스가 정한다. 명령은 표 자체를 만들고 고치고 없애는 묶음과, 표 안의 행을 찾고 넣고 지우고 고치는 묶음으로 나뉜다. 다만 찾는 방법만 맡기는 것이라서, 조건을 빠뜨리면 틀린 답이 아무 경고 없이 나온다.

</div>


## 예시로 보기

직원 표와 부서 표에서 Research 부서 직원의 이름과 주소를 찾고 싶다. 보통의 프로그램이라면 순서를 하나하나 적어야 한다. "부서 표를 첫 행부터 읽어 Research의 번호를 찾는다. 직원 표를 첫 행부터 읽는다. 부서 번호가 같으면 이름과 주소를 적는다."

SQL에서는 답이 어떤 것이어야 하는지만 적는다[^1].

```sql
SELECT Fname, Lname, Address
FROM   EMPLOYEE, DEPARTMENT
WHERE  Dname = 'Research' AND Dnumber = Dno;
```

"두 표에서, 부서 이름이 Research이고 부서 번호가 서로 맞는 행의, 이름과 주소"라는 뜻이다. 어느 표를 먼저 읽을지, 처음부터 끝까지 훑을지는 어디에도 없다. 그 방법은 DBMS가 고른다.

정말 그런지 돌려 보면 보인다. `SELECT Fname, Lname FROM EMPLOYEE WHERE Lname = 'Smith';`를 그냥 돌리면 DBMS는 직원 표를 처음부터 끝까지 훑는다. 성(Lname)으로 빨리 찾게 해 주는 색인을 하나 만들어 주면, 같은 문장인데 DBMS는 색인으로 바로 찾아간다. 답은 두 번 다 (John, Smith)다[^s1]. 이렇게 "무엇을"만 적고 "어떻게"는 맡기는 언어를 선언적 언어라고 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: DML 문은 행만 바꾸고 DDL 문은 표의 정의를 바꾼다. 같은 SELECT가 색인을 만들기 전(전체 훑기)과 뒤(색인 사용)에 같은 답을 낸다 — [45_sql-overview_verify.py](/Hongs_Blog/studies/database-design/code/45_sql-overview_verify/)</div>

</div>


## 정의

SQL(Structured Query Language)은 데이터베이스를 다루려고 만든 선언적 언어다. IBM의 첫 DBMS를 위해 만들었고 처음 이름은 SEQUEL(Structured English Query Language)이었다. 그래서 "에스큐엘"이라고도, "시퀄"이라고도 읽는다[^2].

명령은 무엇을 건드리느냐로 두 묶음으로 나뉜다[^2].

| 묶음 | 건드리는 것 | 명령 |
|---|---|---|
| 데이터 정의어(DDL) | 데이터베이스와 표 | `CREATE`(스키마·표 만들기), `ALTER`(고치기), `DROP`(없애기) |
| 데이터 조작어(DML) | 표 안의 행(튜플) | 찾기: `SELECT` / 바꾸기: `INSERT`, `DELETE`, `UPDATE` |

DDL 문을 돌리면 표의 틀이 달라진다. 표가 생기거나 사라지고, 열이 늘거나 준다. DML 문을 돌리면 틀은 그대로이고 그 안의 행만 달라진다. `SELECT`는 행을 읽기만 한다.

DML에는 두 갈래가 있다[^3].

- **비절차적 DML:** 어떤 데이터를 원하는지만 적는다. 문장 하나로 행 여러 개를 한꺼번에 찾는다. SQL이 여기에 든다.
- **절차적 DML:** 찾는 걸음을 하나하나 적는다. 행을 하나씩 꺼내 따로따로 처리한다.

찾는 문장은 세 줄이 기본 틀이다. 무엇을(`SELECT`), 어느 표에서(`FROM`), 어떤 조건으로(`WHERE`)[^1].

## 활용

명령마다 다루는 문서는 다음과 같다.

| 명령 | 문서 |
|---|---|
| `CREATE SCHEMA`, `CREATE TABLE` | [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/), [속성 제약](/Hongs_Blog/studies/database-design/sql-attribute-constraints/), [키를 적는 절](/Hongs_Blog/studies/database-design/sql-key-clauses/), [참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/) |
| `SELECT` | [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [WHERE 없는 질의](/Hongs_Blog/studies/database-design/missing-where-cross-product/), [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/), [DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/), [집합 연산](/Hongs_Blog/studies/database-design/sql-set-operations/) |
| `INSERT`, `DELETE`, `UPDATE` | [INSERT·DELETE·UPDATE](/Hongs_Blog/studies/database-design/sql-insert-delete-update/), [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/) |
| `DROP`, `ALTER` | [DROP 명령](/Hongs_Blog/studies/database-design/sql-drop/), [ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/) |

- **흔한 실수.** `DELETE`와 `DROP`을 섞는다. `DELETE`는 DML이라 행만 지우고 빈 표가 남는다. `DROP TABLE`은 DDL이라 표의 틀까지 없앤다.
- **선언적이라고 답까지 챙겨 주지는 않는다.** DBMS는 적힌 조건대로만 찾는다. 두 표를 잇는 조건을 빠뜨리면 모든 짝을 다 내놓는다([WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/))[^s1].
- **제품마다 받는 문장이 조금씩 다르다.** 이 수업의 문장은 특정 제품의 것이 아니라 교재의 표준 문법이다. 예를 들어 SQLite에는 `CREATE SCHEMA`가 없고 자료형의 길이도 검사하지 않는다. PostgreSQL 16은 둘 다 한다. 두 제품이 다르게 구는 곳은 문서마다 적혀 있다[^s1].

## 연결

- 선수: [DBMS 언어와 인터페이스](/Hongs_Blog/studies/database-design/dbms-languages-interfaces/)(DDL, DML이라는 갈래), [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)(예제로 쓰는 COMPANY의 표 여섯 개)
- 찾는 방법을 고르는 부품: [DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)의 질의 최적화기
- 사용자마다 보여 줄 표를 따로 정하는 `CREATE VIEW`도 SQL 문이다: [뷰](/Hongs_Blog/studies/database-design/sql-view/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 여섯 문장 `CREATE TABLE`, `SELECT`, `DROP TABLE`, `UPDATE`, `ALTER TABLE`, `DELETE`를 DDL과 DML로 가르라. 가르는 기준은 무엇인가?</summary>

**답:** DDL은 `CREATE TABLE`, `DROP TABLE`, `ALTER TABLE`이고 DML은 `SELECT`, `UPDATE`, `DELETE`다.<br>
**이유:** 표의 틀(어떤 표가 있고 어떤 열이 있는가)을 바꾸면 DDL, 틀은 두고 행만 읽거나 바꾸면 DML이다. 흔한 오답은 `DELETE`를 DDL에 넣는 것이다. `DELETE`는 행을 모두 지워도 빈 표를 남긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** SQL을 선언적 언어라고 부르는 까닭을 쓰고, 그 말이 맞는지 확인할 방법을 하나 들라.</summary>

**답:** 어떤 데이터를 원하는지만 적고 어떻게 찾을지는 적지 않기 때문이다. 찾는 방법은 DBMS가 고른다.<br>
**이유:** 같은 `SELECT` 문을 색인이 없을 때와 있을 때 돌려 보면 된다. DBMS가 쓰는 방법은 "표 전체 훑기"에서 "색인으로 찾기"로 바뀌지만 문장은 한 글자도 안 고쳤고 답도 같다.

</details>


[^1]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.19, p.21 (SELECT-FROM-WHERE 틀, Q1). 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.4
[^2]: 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.10 (Overview: SQL, SEQUEL, 발음, DDL과 DML의 명령). 같은 명령 목록이 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.16, p.23에도 있다
[^3]: 데이터베이스 설계 2회 강의 자료 「2-2_DB-system-architecture」, p.21~23 (DBMS Languages, non-procedural과 procedural DML)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 색인을 만들기 전과 뒤를 견주는 실험, "선언적이라고 답까지 챙겨 주지는 않는다", 제품마다 문법이 다르다는 설명은 슬라이드에 없다. 실험은 SQLite의 `EXPLAIN QUERY PLAN`으로 했다(만들기 전 `SCAN EMPLOYEE`, 만든 뒤 `SEARCH EMPLOYEE USING INDEX`). 슬라이드의 문법이 표준 SQL이라는 판단은 `CREATE SCHEMA … AUTHORIZATION`, `CREATE ASSERTION`, `EXCEPT ALL` 같은 문장이 나오는 것에 근거한다.
{% endraw %}
