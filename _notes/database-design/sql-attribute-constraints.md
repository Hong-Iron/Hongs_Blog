---
layout: "note"
title: "속성 제약 NOT NULL·DEFAULT·CHECK"
display_title: "속성 제약 NOT NULL·DEFAULT·CHECK (Attribute Constraints)"
kind: "concept"
kind_label: "정의"
num: "48"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Attribute Constraints", "NOT NULL", "DEFAULT", "CHECK", "속성 제약", "기본값", "Attribute Defaults", "NOT NULL 제약", "CHECK 절"]
description: "칸 하나에 거는 규칙 세 가지다. \"이 칸은 비워 둘 수 없다\", \"안 적으면 이 값으로 채운다\", \"이 범위의 값만 받는다\"로, 신청서의 필수 칸, 미리 체크된 기본 선택, 나이 칸의 1~120 제한과 같다. 규칙을 표에 걸어 두면 어느 프로그램이 값을 넣든 똑같이 걸러진다. 다…"
prev_url: "/studies/database-design/sql-data-types/"
prev_title: "SQL 자료형"
next_url: "/studies/database-design/sql-key-clauses/"
next_title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-attribute-constraints/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

칸 하나에 거는 규칙 세 가지다. "이 칸은 비워 둘 수 없다", "안 적으면 이 값으로 채운다", "이 범위의 값만 받는다"로, 신청서의 필수 칸, 미리 체크된 기본 선택, 나이 칸의 1~120 제한과 같다. 규칙을 표에 걸어 두면 어느 프로그램이 값을 넣든 똑같이 걸러진다. 다만 범위 규칙은 빈칸을 막지 못해서, 빈칸까지 막으려면 "비워 둘 수 없다"를 함께 걸어야 한다.

</div>


## 예시로 보기

값을 넣는 프로그램마다 "부서 번호는 1부터 20까지" 같은 검사를 따로 짜면, 하나만 빠뜨려도 잘못된 값이 들어간다. 규칙을 표에 걸어 두면 DBMS가 문 앞에서 한 번에 막는다.

부서 표의 두 열에 규칙을 건다.

```sql
Dnumber  INT      NOT NULL  CHECK (Dnumber > 0 AND Dnumber < 21),
Mgr_ssn  CHAR(9)  NOT NULL  DEFAULT '888665555',
```

이제 새 부서를 이름과 번호만 적어 넣어 본다.

```sql
INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7);
```

관리자(Mgr_ssn)를 안 적었는데도 들어간다. 그 칸에는 미리 정해 둔 `'888665555'`가 채워진다. 이 번호의 주인은 본사(Headquarters)를 맡고 있는 Borg다. 반대로 번호를 0이나 21로 적으면 `CHECK`에 걸려 거부된다.

## 정의

**`NOT NULL`.** SQL은 값이 없다는 표시인 NULL을 속성 값으로 받는다. `NOT NULL`을 붙인 속성은 NULL을 받지 않는다. 기본 키에 든 속성에는 적지 않아도 이 제약이 늘 걸린다. 기본 키는 NULL일 수 없다는 [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/) 때문이다.

**`DEFAULT <값>`.** 속성 정의 뒤에 붙여 기본값을 정한다. 새 행을 넣을 때 그 속성의 값을 따로 적지 않으면 기본값이 들어간다.

```sql
CREATE TABLE EMPLOYEE
( … ,
  Dno      INT      NOT NULL  DEFAULT 1,
  … );
CREATE TABLE DEPARTMENT
( … ,
  Mgr_ssn  CHAR(9)  NOT NULL  DEFAULT '888665555',
  … );
```

첫 줄은 새 직원의 기본 부서를 1번으로, 둘째 줄은 새 부서의 기본 관리자를 888665555로 정한다. `DEFAULT`가 없는 속성은 값을 안 적으면 NULL이 된다. 그 속성이 `NOT NULL`이면 그 삽입은 거부된다.

**`CHECK (조건)`.** 속성 정의 뒤에 붙여 값의 범위를 묶는다. 부서 번호가 1부터 20까지의 정수여야 한다면 다음과 같이 쓴다.

```sql
Dnumber INT NOT NULL CHECK (Dnumber > 0 AND Dnumber < 21);
```

새 값이나 고친 값으로 조건을 따져 거짓이면 거부한다.


## 예제

위 정의대로 표를 만들고 문장을 하나씩 돌린 결과다[^s1].

| 문장 | 결과 |
|---|---|
| `INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES ('Robert', 'Hatcher', '980760540');` | 들어간다. Dno는 기본값 1, 나머지 여섯 열은 NULL |
| `INSERT INTO EMPLOYEE (Lname, Ssn) VALUES ('Hatcher', '980760540');` | 거부. Fname이 `NOT NULL`인데 값도 기본값도 없다 |
| `INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7);` | 들어간다. Mgr_ssn은 기본값 888665555 |
| `INSERT INTO DEPARTMENT (Dname, Dnumber, Mgr_ssn) VALUES ('Legal', 8, NULL);` | 거부. NULL이라고 직접 적으면 기본값으로 바뀌지 않는다 |
| `INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Zero', 0);` | 거부. `CHECK` 위반(21도 같다) |
| `INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('One', 1);` | 들어간다(20도 같다) |

넷째 줄에서 "어? 기본값이 있는데 왜 거부되지?" 하고 멈칫하기 쉽다. 기본값은 값을 아예 안 적었을 때만 쓰인다. NULL이라고 적은 것은 "값이 없다"를 적은 것이라, 그대로 `NOT NULL`에 부딪힌다.

**`CHECK`만으로는 빈칸을 못 막는다.** `NOT NULL` 없이 `Dnumber INT CHECK (Dnumber > 0 AND Dnumber < 21)`만 건 열에 NULL을 넣으면 들어간다. NULL이 0보다 큰지는 참도 거짓도 아니다. `CHECK`는 조건이 거짓일 때만 막으므로 통과시킨다. 그래서 위의 Dnumber 정의는 `NOT NULL`과 `CHECK`를 함께 건다. NULL을 넣은 비교가 왜 참도 거짓도 아닌지는 [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 여섯 줄, `CHECK`와 NULL, `DEFAULT`가 없을 때의 거부(SQLite) — [48_sql-attribute-constraints_verify.py](/Hongs_Blog/studies/database-design/code/48_sql-attribute-constraints_verify/). 같은 내용과 "기본 키 열은 저절로 `NOT NULL`"을 PostgreSQL 16에서 실행 — [48_sql-attribute-constraints_verify.sql](/Hongs_Blog/studies/database-design/code/48_sql-attribute-constraints_verify-sql/)</div>

</div>


## 활용

- **경계 읽기.** `Dnumber > 0 AND Dnumber < 21`은 정수 열이라 1 이상 20 이하와 같다. 조건의 양 끝이 들어가는지는 `>`인지 `>=`인지로 갈린다.
- **기본값과 참조 동작.** 가리키던 행이 지워질 때 외래 키를 기본값으로 되돌리는 `ON DELETE SET DEFAULT`가 여기서 정한 `DEFAULT`를 쓴다: [참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/).
- **SQLite의 기본 키와 NULL.** "기본 키 속성은 저절로 `NOT NULL`"이라는 규칙을 SQLite는 지키지 않는다. `NOT NULL`을 따로 안 쓴 기본 키 열에 NULL이 두 번이나 들어간다. PostgreSQL 16은 `NOT NULL`을 안 써도 막는다. COMPANY의 `CREATE TABLE`은 기본 키 열에도 `NOT NULL`을 적어 두어 어느 제품에서나 막힌다[^s1].
- **한 행을 넘는 규칙.** `CHECK`는 넣거나 고치는 그 행의 값만 본다. "직원의 월급은 자기 부서 관리자의 월급을 넘지 못한다"처럼 여러 행, 여러 표를 봐야 하는 규칙은 [주장](/Hongs_Blog/studies/database-design/sql-assertion/)이나 [트리거](/Hongs_Blog/studies/database-design/sql-trigger/)로 적는다.

## 연결

- 선수: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/)
- 속성 하나가 아니라 표 전체에 거는 제약: [PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/)
- 제약을 어기는 삽입과 수정이 어떻게 거부되는가: [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `Dno INT NOT NULL DEFAULT 1`, `Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555'`로 만든 표에 다음 세 문장을 돌린다. 각각 어떻게 되는가? ① `INSERT INTO EMPLOYEE (Fname, Lname, Ssn) VALUES ('Robert', 'Hatcher', '980760540');` ② `INSERT INTO DEPARTMENT (Dname, Dnumber) VALUES ('Sales', 7);` ③ `INSERT INTO DEPARTMENT (Dname, Dnumber, Mgr_ssn) VALUES ('Legal', 8, NULL);`</summary>

**답:** ①은 들어가고 Dno가 1이 된다. ②는 들어가고 Mgr_ssn이 888665555가 된다. ③은 거부된다.<br>
**이유:** 기본값은 값을 안 적은 열에만 들어간다. ③은 NULL을 직접 적었으므로 기본값이 쓰이지 않고 `NOT NULL`에 걸린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 기본 키에 든 속성에는 `NOT NULL`을 적지 않아도 되는 까닭은 무엇인가? 그런데도 적어 두는 편이 안전한 까닭은?</summary>

**답:** 기본 키는 행을 가려내는 값이라 NULL일 수 없고(개체 무결성), SQL은 기본 키에 든 속성에 이 제약을 저절로 건다. 그런데 SQLite는 `NOT NULL`을 따로 안 쓴 기본 키 열에 NULL을 받는다. 적어 두면 어느 제품에서나 막힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "`Dnumber INT CHECK (Dnumber > 0 AND Dnumber < 21)`이면 부서 번호는 반드시 1~20 가운데 하나다"가 틀린 예를 들라.</summary>

**답:** Dnumber에 NULL을 넣으면 들어간다. 번호가 없는 부서가 생긴다.<br>
**이유:** NULL로 조건을 따지면 참도 거짓도 아니고, `CHECK`는 거짓일 때만 막는다. `NOT NULL`을 함께 걸어야 빈칸까지 막힌다.

</details>


[^s1]: SQLite 3.50과 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
