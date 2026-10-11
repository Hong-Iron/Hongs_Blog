---
layout: "note"
title: "참조 무결성 제약과 외래 키"
display_title: "참조 무결성 제약과 외래 키 (Referential Integrity Constraint, Foreign Key)"
kind: "concept"
kind_label: "정의"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Referential Integrity Constraint", "참조 무결성", "Foreign Key", "외래 키", "외래키", "FK", "참조하는 릴레이션", "Referencing Relation", "참조되는 릴레이션", "Referenced Relation"]
description: "직원 표에 \"5번 부서 소속\"이라고 적었다면 부서 표에 5번 부서가 정말 있어야 한다. 한 표의 줄이 다른 표의 줄을 가리킬 때, 가리킨 곳에 그 줄이 있어야 한다는 규칙이다. 가리키는 칸에는 상대 표의 대표 값과 같은 종류의 값이 들어가고, 그 값은 상대 표에 실제로 있는 값이거…"
prev_url: "/studies/database-design/entity-integrity-constraint/"
prev_title: "개체 무결성 제약"
next_url: "/studies/database-design/key-kinds-comparison/"
next_title: "키의 종류 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/referential-integrity-foreign-key/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직원 표에 "5번 부서 소속"이라고 적었다면 부서 표에 5번 부서가 정말 있어야 한다. 한 표의 줄이 다른 표의 줄을 가리킬 때, 가리킨 곳에 그 줄이 있어야 한다는 규칙이다. 가리키는 칸에는 상대 표의 대표 값과 같은 종류의 값이 들어가고, 그 값은 상대 표에 실제로 있는 값이거나 비어 있어야 한다. 이 규칙이 없으면 없는 부서에 속한 직원처럼 서로 어긋난 자료가 쌓인다.

</div>


## 예시로 보기

표를 여러 개로 나누면 표끼리 값으로 이어야 한다. 그런데 이어 놓은 값이 틀리면 어떻게 될까? EMPLOYEE의 Dno는 그 직원이 일하는 부서의 번호다[^1].

| EMPLOYEE (일부) | | | | DEPARTMENT | |
|---|---|---|---|---|---|
| **Lname** | **Ssn** | **Super_ssn** | **Dno** | **Dname** | **Dnumber** |
| Smith | 123456789 | 333445555 | 5 → | Research | 5 |
| Wallace | 987654321 | 888665555 | 4 → | Administration | 4 |
| Borg | 888665555 | NULL | 1 → | Headquarters | 1 |

John Smith의 튜플은 Dno 5로 Research 부서의 튜플을 가리킨다. Smith가 이 부서에서 일한다는 뜻이다[^2]. Smith의 Dno가 7이라면 가리킬 튜플이 없다. "Smith의 부서 이름은?"이라는 질문에 답할 수 없게 된다. 그래서 모든 EMPLOYEE 튜플의 Dno 값은 DEPARTMENT의 어떤 튜플의 Dnumber 값과 맞아야 한다[^1].

Dno처럼 다른 릴레이션의 기본 키를 가리키는 속성을 외래 키(foreign key)라 부른다. 남의 릴레이션에서 온 키라는 뜻이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: COMPANY의 외래 키 8개와 화살표가 꽂히는 곳(Ssn 4, Dnumber 3, Pnumber 1), 모든 외래 키 값이 상대 기본 키에 있거나 NULL(NULL은 Borg의 Super_ssn 하나), 없는 값을 가리키는 튜플은 거부, 가리킴을 받는 튜플은 못 지움, Wong을 가리키는 값 11개 — [37_referential-integrity-foreign-key_verify.py](/Hongs_Blog/studies/database-design/code/37_referential-integrity-foreign-key_verify/)</div>

</div>


## 정의

**참조 무결성 제약.** 두 릴레이션 사이에 거는 제약이다. 한 릴레이션의 튜플이 다른 릴레이션을 가리킨다면, 그 릴레이션에 실제로 있는 튜플을 가리켜야 한다. 두 릴레이션의 튜플들이 서로 어긋나지 않게 하려는 것이다[^1].

**외래 키.** 릴레이션 스키마 $$R_1$$의 속성 묶음 $$FK$$가 아래 두 조건을 지키면, $$FK$$는 $$R_2$$를 참조하는 $$R_1$$의 외래 키다[^3].

1. *같은 도메인.* $$FK$$의 속성들은 $$R_2$$의 기본 키 $$PK$$의 속성들과 도메인이 같다.
2. *있는 값이거나 NULL.* $$R_1$$의 지금 상태 $$r_1(R_1)$$에 든 튜플 $$t_1$$의 $$FK$$ 값은, $$R_2$$의 지금 상태 $$r_2(R_2)$$에 든 어떤 튜플 $$t_2$$의 $$PK$$ 값이거나 NULL이다.

기호로 쓰면 조건 2는, NULL이 아닌 $$t_1[FK]$$마다

$$t_1[FK] = t_2[PK]$$


인 튜플 $$t_2 \in r_2(R_2)$$가 있다는 것이다. 이때 "튜플 $$t_1$$이 튜플 $$t_2$$를 참조한다"고 말한다. 슬라이드는 이 식을 둥근 괄호로 $$t_1(FK) = t_2(PK)$$라고 적는다[^3].

$$R_1$$을 참조하는 릴레이션(referencing relation), $$R_2$$를 참조되는 릴레이션(referenced relation)이라 부른다. Dno의 경우 $$R_1$$은 EMPLOYEE, $$R_2$$는 DEPARTMENT다. 스키마 그림에서는 $$R_1$$의 외래 키에서 $$R_2$$의 기본 키로 화살표를 그린다[^3].

조건 2를 집합으로 말해도 같다. $$r_1$$에 나오는 NULL이 아닌 $$FK$$ 값을 모두 모은 집합이 $$r_2$$에 나오는 $$PK$$ 값을 모두 모은 집합에 들어 있다[^s1].

$$\{\, t_1[FK] : t_1 \in r_1,\ t_1[FK] \ne \text{NULL} \,\} \subseteq \{\, t_2[PK] : t_2 \in r_2 \,\}$$


COMPANY에는 외래 키가 여덟 개 있다[^4].

| 참조하는 릴레이션 | 외래 키 | 참조되는 릴레이션 | 그 기본 키 | 뜻 |
|---|---|---|---|---|
| EMPLOYEE | Super_ssn | EMPLOYEE | Ssn | 이 직원의 상사 |
| EMPLOYEE | Dno | DEPARTMENT | Dnumber | 이 직원이 일하는 부서 |
| DEPARTMENT | Mgr_ssn | EMPLOYEE | Ssn | 이 부서의 관리자 |
| DEPT_LOCATIONS | Dnumber | DEPARTMENT | Dnumber | 이 위치에 있는 부서 |
| PROJECT | Dnum | DEPARTMENT | Dnumber | 이 프로젝트를 맡은 부서 |
| WORKS_ON | Essn | EMPLOYEE | Ssn | 일하는 직원 |
| WORKS_ON | Pno | PROJECT | Pnumber | 일하는 프로젝트 |
| DEPENDENT | Essn | EMPLOYEE | Ssn | 이 부양가족의 직원 |

표에서 읽을 수 있는 것이 넷 있다[^s1].

- **같은 릴레이션을 가리켜도 된다.** Super_ssn은 EMPLOYEE에서 EMPLOYEE로 간다. Smith의 Super_ssn 333445555는 같은 릴레이션의 Wong을 가리킨다.
- **NULL이어도 된다.** Borg는 상사가 없어 Super_ssn이 NULL이다. 상태 전체에서 NULL인 외래 키 값은 이 하나다.
- **값이 겹쳐도 된다.** Dno 5는 네 직원에게 나온다. 외래 키는 자기 릴레이션에서 키가 아니어도 된다.
- **이름이 달라도 된다.** Dno와 Dnumber, Essn과 Ssn은 이름이 다르다. 조건은 이름이 아니라 도메인과 값에 걸린다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 6-2 슬라이드 p.23의 그림에서 "Must be matched!" 선이 EMPLOYEE의 Dno 상자와 DEPT_LOCATIONS의 Dnumber 상자를 잇는다. / 문제점: 같은 쪽의 글은 "the Dnumber value of some tuple in the DEPARTMENT relation"이라고 적는다. Dno가 가리키는 것은 DEPARTMENT의 Dnumber다. 상자가 한 줄 아래 릴레이션에 그려졌다. / 수정안: 파란 상자는 DEPARTMENT의 Dnumber에 있어야 한다. / 근거: 같은 슬라이드 p.24~25의 그림과 7주차 p.8, 9주차 p.5의 복습 그림은 DEPARTMENT의 Dnumber에 상자를 쳤다. DEPT_LOCATIONS의 Dnumber는 값이 겹쳐(5가 세 번) 혼자서는 키가 아니므로 가리킬 수 없다.

</div>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 조건 1(같은 도메인)이 없으면 어떤 선언이 통하게 되는가?</summary>

날짜 속성이 정수인 부서 번호를 가리키는 식의 선언이 통한다. 두 값은 견줄 수조차 없어서 조건 2의 $$t_1[FK] = t_2[PK]$$를 물을 수 없다. 조건 1은 조건 2가 말이 되게 하는 바탕이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 조건 2에서 "또는 NULL"을 빼면 COMPANY의 어느 튜플이 들어가지 못하는가?</summary>

Borg의 튜플이다. Super_ssn이 NULL이라서다. 사장처럼 가리킬 상대가 없는 튜플을 적으려면 NULL을 받아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 왜 아무 속성이 아니라 "기본 키"를 가리키게 하는가?</summary>

가리킨다는 것은 튜플 하나를 집어낸다는 뜻이다. 값이 겹칠 수 있는 속성을 가리키면 어느 튜플인지 정해지지 않는다. 기본 키는 값이 안 겹치고 NULL도 아니어서([개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/)) 늘 튜플 하나를 집어낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 생각은?</summary>

표를 나눠 놓고 값으로 잇되, 이어 놓은 값이 실제 튜플과 어긋나지 않게 DBMS가 지켜 준다. 조건 1은 틀에 거는 조건이고 조건 2는 내용에 거는 조건이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

프로그램에서 "없는 것을 가리키는 포인터"를 막는 것과 같은 걱정이다. ER 그림을 릴레이션으로 옮길 때는 관계 타입이 외래 키가 된다([일대다 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-many-relationship/)).

</details>


## 예제

**외래 키인 예.** EMPLOYEE.Dno → DEPARTMENT.Dnumber, EMPLOYEE.Super_ssn → EMPLOYEE.Ssn(같은 릴레이션), WORKS_ON.Essn → EMPLOYEE.Ssn(기본 키의 일부이면서 외래 키).

**외래 키가 아닌 예.** DEPENDENT.Sex와 EMPLOYEE.Sex는 이름이 같지만 가리키는 사이가 아니다. 부양가족의 성별이 어느 직원의 성별 값이어야 할 까닭이 없다. 출장 예제의 SALESPERSON.Dept_no는 부서 번호처럼 보이지만, 그 스키마에는 부서 릴레이션이 없어서 가리킬 곳이 없다([외래 키 찾기 연습](/Hongs_Blog/studies/database-design/foreign-key-practice/)).

**Wong을 지우려 하면.** EMPLOYEE에서 Wong(333445555)의 튜플을 지우면 Wong을 가리키던 값이 모두 갈 곳을 잃는다[^s1].

1. *EMPLOYEE.Super_ssn:* Smith, Narayan, English의 3개.
2. *DEPARTMENT.Mgr_ssn:* Research 부서의 1개.
3. *WORKS_ON.Essn:* 프로젝트 2, 3, 10, 20의 4개.
4. *DEPENDENT.Essn:* Alice, Theodore, Joy의 3개.
5. *합:* 11개. 그래서 DBMS는 따로 정해 두지 않으면 이 삭제를 거부한다. 거부 말고 다른 길은 [참조 동작 SET NULL·CASCADE·SET DEFAULT](/Hongs_Blog/studies/database-design/referential-triggered-actions/)에 있다.

## 활용

- **SQL로 적으면.** `FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)`: [PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/)
- **어길 수 있는 연산.** 참조하는 쪽에 넣거나 외래 키를 고칠 때, 참조되는 쪽에서 지우거나 기본 키를 고칠 때다: [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)
- **제품마다 다른 점.** PostgreSQL 16은 자료형이 안 맞는 외래 키 선언(날짜 속성이 정수 기본 키를 가리킴)을 표를 만들 때 거부한다. 기본 키도 `UNIQUE`도 아닌 속성을 가리키는 선언도 거부한다. `UNIQUE`인 후보 키는 가리킬 수 있다. SQLite는 자료형이 달라도 선언을 받는다. 또 `PRAGMA foreign_keys=ON`을 하지 않으면 외래 키를 아예 검사하지 않는다[^s2].
- **흔한 실수.** 이름이 같은 속성을 보고 외래 키라고 짐작하는 것. "이 값은 저 릴레이션에 반드시 있어야 하는가?"를 물어야 한다.
- 연습: [외래 키 찾기 연습](/Hongs_Blog/studies/database-design/foreign-key-practice/)

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: PostgreSQL 16에서 실행. 없는 부서를 가리키면 foreign_key_violation, 외래 키가 NULL인 튜플은 들어감, 가리킴을 받는 부서를 지우면 foreign_key_violation, 자료형이 안 맞으면 datatype_mismatch, 키가 아닌 속성을 가리키면 invalid_foreign_key — [37_referential-integrity-foreign-key_verify.sql](/Hongs_Blog/studies/database-design/code/37_referential-integrity-foreign-key_verify-sql/)</div>

</div>


## 연결

- 선수: [슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/), [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/)
- 다른 키와 견주기: [키의 종류 비교](/Hongs_Blog/studies/database-design/key-kinds-comparison/)
- 외래 키가 생기는 곳: ER 그림의 관계 타입을 옮길 때다. [일대일 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-one-relationship/), [일대다 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-many-relationship/), [다대다·n항 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-many-to-many-relationship/)
- 외래 키로 표를 잇는 질의: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"두 릴레이션에 이름이 같은 속성이 있으면 외래 키다"</div>

틀렸다. Dnumber가 DEPARTMENT와 DEPT_LOCATIONS에 똑같이 나오는 것을 보면 이름으로 외래 키를 찾을 수 있을 것 같다. 외래 키의 조건은 이름이 아니라 도메인(조건 1)과 값(조건 2)이다. Dno와 Dnumber는 이름이 달라도 외래 키와 기본 키 사이다. DEPENDENT.Sex와 EMPLOYEE.Sex는 이름이 같아도 아무 사이가 아니다. 확인하는 법: "이 속성의 값은 저 릴레이션의 기본 키 값으로 반드시 있어야 하는가?"를 묻는다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"외래 키도 키니까 값이 겹치면 안 되고 NULL도 안 된다"</div>

틀렸다. 이름에 '키'가 들어 있어 기본 키와 같은 규칙을 받을 것처럼 들린다. 외래 키는 자기 릴레이션의 튜플을 가려내는 값이 아니라 남의 튜플을 가리키는 값이다. COMPANY에서 Dno 5는 네 번 나오고, Borg의 Super_ssn은 NULL이다. 값이 겹치면 안 되고 NULL도 안 되는 것은 가리킴을 받는 쪽의 기본 키다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$R_1$$의 속성 묶음 $$FK$$가 $$R_2$$를 참조하는 외래 키가 되려면 지켜야 할 두 조건을 쓰라.</summary>

**답:** ① $$FK$$의 속성들이 $$R_2$$의 기본 키 $$PK$$의 속성들과 도메인이 같다. ② $$r_1(R_1)$$의 튜플 $$t_1$$의 $$FK$$ 값은 $$r_2(R_2)$$의 어떤 튜플 $$t_2$$의 $$PK$$ 값이거나($$t_1[FK] = t_2[PK]$$) NULL이다.<br>
**이유:** 흔히 빠뜨리는 것은 ②의 "또는 NULL"과 ①이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** WORKS_ON(Essn, Pno, Hours)과 DEPENDENT(Essn, Dependent_name, Sex, Bdate, Relationship)의 외래 키를 모두 찾고, 각각 어느 릴레이션의 어느 속성을 참조하는지 쓰라.</summary>

**답:** WORKS_ON.Essn → EMPLOYEE.Ssn, WORKS_ON.Pno → PROJECT.Pnumber, DEPENDENT.Essn → EMPLOYEE.Ssn. 세 개다.<br>
**이유:** DEPENDENT의 Sex와 Bdate는 EMPLOYEE에도 같은 이름이 있지만 외래 키가 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** COMPANY의 상태에서 다음 가운데 참조 무결성 제약을 어기는 것은? (가) Dno가 7인 직원을 넣는다. (나) Super_ssn이 NULL인 직원을 1번 부서에 넣는다. (다) DEPARTMENT에서 5번 부서를 지운다. (라) Essn이 000000000인 부양가족을 넣는다.</summary>

**답:** (가), (다), (라).<br>
**이유:** (가) 7번 부서가 없다. (나) 외래 키는 NULL이어도 된다. (다) 직원 넷, 위치 셋, 프로젝트 셋이 5번 부서를 가리키고 있다. (라) 그런 직원이 없다. 지우는 연산도 제약을 어길 수 있다는 점을 놓치기 쉽다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** EMPLOYEE에서 Wong(333445555)의 튜플을 지우면 갈 곳을 잃는 외래 키 값은 릴레이션마다 몇 개인가?</summary>

**답:** EMPLOYEE.Super_ssn 3개(Smith, Narayan, English), DEPARTMENT.Mgr_ssn 1개(Research), WORKS_ON.Essn 4개(프로젝트 2, 3, 10, 20), DEPENDENT.Essn 3개. 모두 11개.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 외래 키는 왜 상대 릴레이션의 "기본 키"를 가리키게 정했는가? 6-2 슬라이드 p.23의 그림처럼 DEPT_LOCATIONS의 Dnumber를 가리키면 무엇이 곤란한가?</summary>

**답:** 가리킨다는 것은 튜플 하나를 집어내는 일이라, 값이 안 겹치고 NULL이 아닌 기본 키여야 한다. DEPT_LOCATIONS의 Dnumber는 5가 세 번 나와서 Dno 5가 어느 튜플을 가리키는지 정해지지 않는다. 위치가 하나도 등록되지 않은 부서에는 직원을 둘 수 없게 되기도 한다.

</details>


[^1]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.23 (Referential Integrity Constraint, "Must be matched!"). 복습: 데이터베이스 설계 7회 강의 자료 「7_relational-model」, p.8, 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.5
[^2]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.25 (John Smith의 튜플이 Research 부서의 튜플을 참조한다)
[^3]: 같은 자료, p.24 (Foreign key FK, 두 조건, referencing relation과 referenced relation, 화살표)
[^4]: 데이터베이스 설계 7회 강의 자료 「7_relational-model」, p.11 (COMPANY 스키마 그림의 화살표 여덟 개). 6-2 p.24의 그림에는 그 가운데 EMPLOYEE와 DEPARTMENT 사이의 것만 보인다
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 조건 2의 집합 표현, 외래 키 표에서 읽은 네 가지, "Wong을 지우려 하면" 예제, 스스로 설명해 보기, 두 오해, 카드 C2~C5는 원본에 없다. 슬라이드 p.24의 두 조건과 6-2 p.21의 상태에서 끌어냈고 검증 코드로 세었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 제품마다 다른 점은 원본에 없다. PostgreSQL 16과 SQLite에서 실행해 확인했다. 슬라이드의 정의는 기본 키를 가리킨다고만 적는다. `UNIQUE`인 속성도 가리킬 수 있는 것은 PostgreSQL에서 본 동작이다.
{% endraw %}
