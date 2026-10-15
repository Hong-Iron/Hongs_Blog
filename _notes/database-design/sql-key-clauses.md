---
layout: "note"
title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
display_title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
kind: "concept"
kind_label: "정의"
num: "49"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["PRIMARY KEY", "UNIQUE", "FOREIGN KEY", "REFERENCES", "CONSTRAINT", "기본 키 절", "유일성 제약", "외래 키 절", "이름 붙인 제약", "Named Constraint", "Key Integrity Constraint", "Referential Integrity Constraint"]
description: "표를 만들 때 \"이 칸의 값은 행마다 달라야 한다\"와 \"이 칸의 값은 저 표에 있는 값이어야 한다\"를 적어 두는 세 문구다. 학번은 학생마다 달라야 하고, 수강 신청서에 적힌 학번은 학적부에 있는 학번이어야 하는 것과 같다. 적어 두면 겹치는 값과 없는 것을 가리키는 값이 들어올 …"
prev_url: "/studies/database-design/sql-attribute-constraints/"
prev_title: "속성 제약 NOT NULL·DEFAULT·CHECK"
next_url: "/studies/database-design/select-from-where/"
next_title: "SELECT-FROM-WHERE"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-key-clauses/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표를 만들 때 "이 칸의 값은 행마다 달라야 한다"와 "이 칸의 값은 저 표에 있는 값이어야 한다"를 적어 두는 세 문구다. 학번은 학생마다 달라야 하고, 수강 신청서에 적힌 학번은 학적부에 있는 학번이어야 하는 것과 같다. 적어 두면 겹치는 값과 없는 것을 가리키는 값이 들어올 때 데이터베이스가 막는다. 다만 가리킴 받던 행이 나중에 지워질 때 어떻게 할지는 여기서 정해지지 않아 따로 적어야 한다.

</div>


## 예시로 보기

부서 표와 부서 위치 표를 만드는 문장이다.

```sql
CREATE TABLE DEPARTMENT
( Dname           VARCHAR(15)   NOT NULL,
  Dnumber         INT           NOT NULL,
  Mgr_ssn         CHAR(9)       NOT NULL,
  Mgr_start_date  DATE,
  PRIMARY KEY (Dnumber),
  UNIQUE (Dname),
  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) );
CREATE TABLE DEPT_LOCATIONS
( Dnumber         INT           NOT NULL,
  Dlocation       VARCHAR(15)   NOT NULL,
  PRIMARY KEY (Dnumber, Dlocation),
  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) );
```

세 문구가 없으면 5번 부서가 둘 생겨도, 없는 3번 부서의 위치가 적혀도 막을 길이 없다. 지금 표에는 부서 5(Research), 4(Administration), 1(Headquarters)이 있고, 5번 부서의 위치로 Bellaire, Sugarland, Houston이 적혀 있다. 여기에 행을 하나씩 넣어 본다[^s1].

| 넣으려는 행 | 결과 | 막는 문구 |
|---|---|---|
| DEPARTMENT에 ('Sales', 5, …) | 거부 | `PRIMARY KEY (Dnumber)`: 5번이 이미 있다 |
| DEPARTMENT에 ('Research', 7, …) | 거부 | `UNIQUE (Dname)`: Research가 이미 있다 |
| DEPARTMENT에 ('Sales', 7, '111111111', …) | 거부 | `FOREIGN KEY (Mgr_ssn)`: 그런 직원이 없다 |
| DEPT_LOCATIONS에 (5, 'Houston') | 거부 | `PRIMARY KEY (Dnumber, Dlocation)`: 이 짝이 이미 있다 |
| DEPT_LOCATIONS에 (4, 'Houston') | 들어간다 | 4도 Houston도 이미 있지만 둘의 짝은 처음이다 |
| DEPT_LOCATIONS에 (3, 'Houston') | 거부 | `FOREIGN KEY (Dnumber)`: 3번 부서가 없다 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 여섯 줄, 두 열짜리 기본 키, 외래 키가 가리키는 열이 모두 상대 표의 기본 키라는 것(SQLite) — [49_sql-key-clauses_verify.py](/Hongs_Blog/studies/database-design/code/49_sql-key-clauses_verify/). 제약 이름이 오류에 나오는 것, 외래 키가 가리킬 수 있는 열, 기본 키는 하나뿐이라는 것은 PostgreSQL 16에서 실행 — [49_sql-key-clauses_verify.sql](/Hongs_Blog/studies/database-design/code/49_sql-key-clauses_verify-sql/)</div>

</div>


## 정의

**`PRIMARY KEY (속성, …)`.** 릴레이션의 [기본 키](/Hongs_Blog/studies/database-design/relational-keys/)를 이루는 속성을 하나 이상 적는다. 속성이 둘이면 두 값의 짝이 행마다 달라야 한다. 한쪽 값만 겹치는 것은 괜찮다.

**`UNIQUE (속성, …)`.** 기본 키로 뽑히지 않은 또 다른 키를 적는다. 후보 키 가운데 기본 키가 아닌 것이 여기에 온다. DEPARTMENT에서는 번호(Dnumber)가 기본 키이고, 이름(Dname)도 부서마다 달라야 해서 `UNIQUE`다.

**`FOREIGN KEY (속성) REFERENCES 표(속성)`.** 다른 릴레이션의 기본 키를 가리키는 [외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)를 적는다. `FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber)`는 "이 표의 Dnumber 값은 DEPARTMENT의 Dnumber에 있는 값이어야 한다"는 뜻이다.

기본 키와 `UNIQUE`는 이렇게 다르다[^s1].

| | `PRIMARY KEY` | `UNIQUE` |
|---|---|---|
| 표에 몇 개 | 하나뿐 | 여럿 둘 수 있다 |
| NULL | 못 받는다([저절로 `NOT NULL`](/Hongs_Blog/studies/database-design/sql-attribute-constraints/)) | `NOT NULL`을 안 붙이면 받는다. 여러 행이 NULL이어도 된다 |
| 뜻 | 행을 가려내는 대표 키 | 그 밖의 후보 키 |

**이름 붙이기.** 제약 앞에 `CONSTRAINT 이름`을 붙이면 그 제약에 이름이 생긴다.

```sql
CREATE TABLE EMPLOYEE
( … ,
  CONSTRAINT EMPPK
    PRIMARY KEY (Ssn),
  CONSTRAINT EMPSUPERFK
    FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn),
  CONSTRAINT EMPDEPTFK
    FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) );
```

외래 키마다 뒤에 `ON DELETE …`를 더 붙일 수도 있다. 그 부분은 [참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/)에서 다룬다. DEPARTMENT 쪽 이름은 DEPTPK(기본 키), DEPTSK(`UNIQUE`), DEPTMGRFK(관리자를 가리키는 외래 키)다. 이름이 있으면 어긴 제약이 무엇인지 오류에 그 이름으로 나오고, 나중에 그 제약만 골라 뗄 수 있다([ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/)의 `DROP CONSTRAINT EMPSUPERFK`). PostgreSQL 16에서 이미 있는 Ssn을 또 넣으면 오류에 `emppk`가, 없는 부서 번호를 넣으면 `empdeptfk`가 찍힌다. 이름을 안 붙이면 DBMS가 `dept_locations_pkey` 같은 이름을 지어 붙인다[^s1].

## 활용

- **참조 무결성은 넣을 때만 깨지는 것이 아니다.** 참조 무결성은 행을 넣거나 지울 때, 그리고 외래 키나 기본 키의 값을 고칠 때 깨질 수 있다. SQL은 그런 연산을 기본으로는 거부하고, 따로 적어 두면 정해 둔 동작을 한다. 어떤 연산이 무엇을 깨는지는 [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/), 거부 말고 무엇을 할 수 있는지는 [참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/)에 있다.
- **외래 키 값은 NULL일 수 있다.** Borg의 Super_ssn은 NULL이다. 상사가 없다는 뜻이고 제약을 어기지 않는다. NULL을 막으려면 그 열에 `NOT NULL`을 붙인다(Dno, Mgr_ssn이 그렇다).
- **외래 키가 가리킬 수 있는 열.** 외래 키는 보통 다른 릴레이션의 기본 키를 가리킨다. PostgreSQL 16은 `UNIQUE`로 적은 열도 가리킬 수 있게 하고, 키가 아닌 열(Mgr_start_date)을 가리키면 표를 만들 때 오류를 낸다[^s1].
- **흔한 실수.** 두 열짜리 기본 키를 `PRIMARY KEY (Dnumber), PRIMARY KEY (Dlocation)`처럼 두 줄로 쓴다. 기본 키는 표에 하나뿐이라 오류다. 괄호 하나에 `PRIMARY KEY (Dnumber, Dlocation)`으로 쓴다.

## 연결

- 선수: [슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/), [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/), [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/)
- 키의 종류를 한자리에서 견주기: [키의 종류 비교](/Hongs_Blog/studies/database-design/key-kinds-comparison/)
- ER 그림의 키 속성과 관계 타입이 어느 문구가 되는가: [ER-관계형 사상 절차](/Hongs_Blog/studies/database-design/er-to-relational-mapping/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 자동차 표 CAR(License_number, Engine_serial_number, Make, Model, Year)에서 번호판(License_number)과 엔진 번호(Engine_serial_number)는 둘 다 차마다 다르다. 번호판을 기본 키로 삼을 때, 두 사실을 `CREATE TABLE`의 어느 문구로 적는가?</summary>

**답:** `PRIMARY KEY (License_number)`와 `UNIQUE (Engine_serial_number)`다.<br>
**이유:** 후보 키가 둘이면 하나를 기본 키로 고르고 나머지는 `UNIQUE`로 적는다. `PRIMARY KEY`를 두 번 쓰면 오류다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 지금 DEPT_LOCATIONS에는 (1, Houston), (4, Stafford), (5, Bellaire), (5, Sugarland), (5, Houston)이 있고 부서는 1, 4, 5번뿐이다. (4, 'Houston'), (5, 'Houston'), (3, 'Houston') 가운데 들어가는 행은 무엇인가? 막히는 행은 어느 문구에 걸리는가?</summary>

**답:** (4, 'Houston')만 들어간다. (5, 'Houston')은 `PRIMARY KEY (Dnumber, Dlocation)`에, (3, 'Houston')은 `FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber)`에 걸린다.<br>
**이유:** 두 열짜리 기본 키는 두 값의 짝이 겹칠 때만 막는다. 4번 부서도 Houston도 이미 표에 있지만 (4, Houston)이라는 짝은 처음이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** DEPARTMENT에서 `UNIQUE (Dname)`을 빼면 무엇이 달라지는가? `SELECT … WHERE Dname = 'Research' AND Dnumber = Dno`로 Research 직원을 찾는 질의를 놓고 설명하라.</summary>

**답:** 이름이 Research인 부서를 번호만 다르게 또 넣을 수 있게 된다. 그러면 `Dname = 'Research'`가 두 부서를 고르고, 질의는 두 부서의 직원을 한데 섞어 내놓는다.<br>
**이유:** `PRIMARY KEY`는 번호가 겹치는 것만 막는다. "이름으로 부서 하나를 가려낼 수 있다"는 사실은 `UNIQUE (Dname)`이 따로 지켜 준다.

</details>


[^s1]: SQLite 3.50과 PostgreSQL 16에서 실행해 확인했다. SQLite는 오류 글에 제약 이름 대신 "UNIQUE constraint failed: DEPARTMENT.Dname"처럼 표와 열을 적는다.
{% endraw %}
