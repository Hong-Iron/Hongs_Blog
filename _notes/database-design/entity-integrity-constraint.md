---
layout: "note"
title: "개체 무결성 제약"
display_title: "개체 무결성 제약 (Entity Integrity Constraint)"
kind: "concept"
kind_label: "정의"
num: "36"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Entity Integrity Constraint", "개체 무결성", "엔티티 무결성", "기본 키 NULL 금지"]
description: "표에서 대표로 정한 값(학번 같은 것)은 줄을 가려내는 이름표다. 이 값이 비어 있으면 그 줄을 가리킬 방법이 없고, 비어 있는 줄이 둘이면 서로 가려낼 수도 없다. 그래서 대표로 정한 값은 어느 줄에서도 비워 둘 수 없다. 대표가 아닌 칸은 비워도 된다."
prev_url: "/studies/database-design/relational-database-schema/"
prev_title: "관계형 데이터베이스 스키마와 상태"
next_url: "/studies/database-design/referential-integrity-foreign-key/"
next_title: "참조 무결성 제약과 외래 키"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/entity-integrity-constraint/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표에서 대표로 정한 값(학번 같은 것)은 줄을 가려내는 이름표다. 이 값이 비어 있으면 그 줄을 가리킬 방법이 없고, 비어 있는 줄이 둘이면 서로 가려낼 수도 없다. 그래서 대표로 정한 값은 어느 줄에서도 비워 둘 수 없다. 대표가 아닌 칸은 비워도 된다.

</div>


## 예시로 보기

STUDENT 표에서 Office_phone 칸은 세 줄이 NULL이다[^1].

| Name | Ssn | Office_phone |
|---|---|---|
| Benjamin Bayer | 305-61-2435 | NULL |
| Chung-cha Kim | 381-62-1245 | NULL |
| Dick Davidson | 422-11-2320 | (817)749-1253 |
| Rohan Panchal | 489-22-1100 | (817)749-6492 |
| Barbara Benson | 533-69-1238 | NULL |

Office_phone은 기본 키가 아니라서 이대로 괜찮다. 만약 Office_phone이 기본 키였다면 어떨까? Bayer, Kim, Benson을 가려낼 값이 없다. 다른 릴레이션에서 "사무실 전화가 NULL인 학생"이라고 가리켜도 셋 가운데 누구인지 알 수 없다[^1].

SQL로 해 보면 더 분명하다. 키가 NULL인 줄이 둘 있는 표에서 `WHERE Ssn = NULL`은 한 줄도 못 찾는다. NULL은 무엇과 견주어도 참이 되지 않기 때문이다. `WHERE Ssn IS NULL`은 두 줄을 한꺼번에 찾는다. 한 줄만 집어낼 방법이 없다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: COMPANY 여섯 릴레이션에 NULL인 기본 키 0건, NULL인 기본 키는 거부(기본 키의 한 속성만 NULL이어도), 키가 NULL인 두 튜플에서 `= NULL` 0행·`IS NULL` 2행, SQLite는 PRIMARY KEY만 적으면 NULL을 받음 — [36_entity-integrity-constraint_verify.py](/Hongs_Blog/studies/database-design/code/36_entity-integrity-constraint_verify/)</div>

</div>


## 정의

릴레이션 스키마 $$R$$의 기본 키 $$PK$$의 값은 어떤 튜플에서도 NULL일 수 없다. 슬라이드의 문장으로는 'No primary key value can be NULL'이다[^1].

기호로 쓰면, $$r(R)$$의 모든 튜플 $$t$$에 대해

$$t[PK] \ne \text{NULL}$$


이다. $$t[PK]$$는 튜플 $$t$$의 기본 키 값이다. 까닭은 기본 키 값이 튜플 하나하나를 가려내는 데 쓰이기 때문이다. 기본 키가 NULL이면 그 튜플을 가려낼 수 없다[^1].

기본 키가 속성 여럿이면 그 속성 하나하나가 NULL일 수 없다. WORKS_ON의 기본 키는 (Essn, Pno)다. Essn만 있고 Pno가 NULL인 튜플은 "어느 프로젝트인지 모르는 근무 기록"이라 다른 튜플과 가려낼 수 없다[^s1].

이름의 뜻도 여기서 나온다. 튜플 하나는 실세계의 개체 하나를 적은 것이다. 무결성은 흠이 없다는 말이다. 개체 하나하나를 가려낼 수 있어야 흠이 없다는 뜻이다.

키 제약과 이 제약은 릴레이션 하나 안에서 검사한다. 두 릴레이션 사이에 걸리는 [참조 무결성 제약](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)과 다르다[^2].

## 활용

- **기본 키가 아닌 속성은 NULL이어도 된다.** COMPANY 상태에서 Borg의 Super_ssn과 Hours가 NULL이다. 둘 다 기본 키가 아니다. 기본 키로 뽑히지 않은 후보 키도 이 제약을 받지 않는다. PostgreSQL 16에서 `UNIQUE`만 건 열에는 NULL이 여러 번 들어간다[^s2].
- **SQL로 적으면.** 기본 키는 `PRIMARY KEY`로 선언한다: [PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/). NULL을 막는 선언은 `NOT NULL`이다: [속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/)
- **SQLite와 PostgreSQL이 다르다.** PostgreSQL 16은 `PRIMARY KEY`만 적어도 그 열에 NULL을 거부한다. SQLite는 `PRIMARY KEY`만 적은 열에 NULL을 받는다. `NOT NULL`을 함께 적어야 막힌다. 9주차 슬라이드의 `CREATE TABLE`은 기본 키 속성마다 `NOT NULL`을 함께 적어 두어서 두 제품에서 똑같이 막힌다[^s2].
- **어길 수 있는 연산.** 튜플을 넣을 때와 기본 키를 고칠 때다. 지울 때는 어길 수 없다: [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: PostgreSQL 16에서 실행. `PRIMARY KEY`만 적은 열과 두 속성 기본 키의 한 속성에 NULL을 넣으면 not_null_violation, `UNIQUE`만 건 열은 NULL 두 개를 받음 — [36_entity-integrity-constraint_verify.sql](/Hongs_Blog/studies/database-design/code/36_entity-integrity-constraint_verify-sql/)</div>

</div>


## 연결

- 선수: [슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/), [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/)(NULL의 뜻)
- 짝이 되는 제약: [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/). 기본 키에 NULL이 없어야 다른 릴레이션이 그 튜플을 가리킬 수 있다.
- 이 제약 때문에 따라오는 것: 약한 개체를 옮긴 릴레이션은 주인의 키가 기본 키에 들어가서, 주인 없는 튜플을 넣을 수 없다([개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/)).
- NULL을 SQL에서 다루는 법: [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 개체 무결성 제약을 한 문장으로 쓰고, 그 까닭을 대라.</summary>

**답:** 기본 키 값은 어떤 튜플에서도 NULL일 수 없다($$t[PK] \ne \text{NULL}$$). 기본 키는 튜플을 가려내는 데 쓰는 값이라, NULL이면 그 튜플을 가려낼 수 없고 다른 릴레이션에서 가리킬 수도 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** COMPANY에서 다음 가운데 개체 무결성 제약을 어기는 것을 골라라. (가) Borg의 Super_ssn이 NULL이다. (나) WORKS_ON에 (123456789, NULL, 5.0)을 넣는다. (다) Ssn이 123456789인 직원을 한 명 더 넣는다. (라) Ssn이 NULL인 직원을 넣는다.</summary>

**답:** (나)와 (라).<br>
**이유:** (가) Super_ssn은 기본 키가 아니다. (나) Pno는 기본 키 (Essn, Pno)의 한 속성이다. (다)는 키 값이 겹치는 것이라 키 제약 위반이지 개체 무결성 위반이 아니다. 이 둘을 섞는 것이 흔한 오답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 기본 키가 NULL인 튜플이 둘 들어갔다고 하자. `WHERE Ssn = NULL`과 `WHERE Ssn IS NULL`은 각각 몇 줄을 찾는가? 이것이 왜 문제인가?</summary>

**답:** 0줄과 2줄. 어느 쪽으로도 둘 가운데 한 줄만 집어낼 수 없다. 기본 키가 하는 일(튜플 하나를 가려내기)을 못 한다.

</details>


[^1]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.22 (Entity Integrity Constraint, Office_phone에 상자를 친 STUDENT 표). 복습: 데이터베이스 설계 7회 강의 자료 「7_relational-model」, p.7, 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.4
[^2]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.23 ("Key constrains and entity integrity constraints are specified on an individual relation")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> SQL로 해 본 예, 기본 키가 속성 여럿일 때의 설명, 카드 C2·C3은 원본에 없다. 슬라이드 p.22의 "The constrain for an attribute in its primary key"를 풀어 쓴 것이고 SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `UNIQUE` 열의 NULL, SQLite와 PostgreSQL의 차이는 원본에 없다. 두 제품에서 실행해 확인했다. 9주차 슬라이드 p.17~18의 `CREATE TABLE`이 기본 키 속성에 `NOT NULL`을 적은 것은 그림으로 확인했다.
{% endraw %}
