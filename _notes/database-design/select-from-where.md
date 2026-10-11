---
layout: "note"
title: "SELECT-FROM-WHERE"
display_title: "SELECT-FROM-WHERE"
kind: "concept"
kind_label: "정의"
num: "50"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["SELECT", "SELECT-FROM-WHERE Block", "기본 검색 질의", "Basic Retrieval Query", "투영 속성", "Projection Attributes", "선택 조건", "Selection Condition", "조인 조건", "Join Condition", "SELECT *", "Asterisk"]
description: "표에서 원하는 것을 꺼내 달라고 하는 문장이고, 어느 표에서, 어떤 행을, 그 행의 어느 칸을 꺼낼지 세 칸을 채운다. 도서관 사서에게 \"소설 서가에서, 2020년 뒤에 나온 책의, 제목과 지은이만 알려 주세요\"라고 말하는 것과 같다. 표가 둘 이상이면 행들을 어떻게 짝지을지도 조…"
prev_url: "/studies/database-design/sql-key-clauses/"
prev_title: "PRIMARY KEY·UNIQUE·FOREIGN KEY 절"
next_url: "/studies/database-design/sql-insert-delete-update/"
next_title: "INSERT·DELETE·UPDATE"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/select-from-where/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표에서 원하는 것을 꺼내 달라고 하는 문장이고, 어느 표에서, 어떤 행을, 그 행의 어느 칸을 꺼낼지 세 칸을 채운다. 도서관 사서에게 "소설 서가에서, 2020년 뒤에 나온 책의, 제목과 지은이만 알려 주세요"라고 말하는 것과 같다. 표가 둘 이상이면 행들을 어떻게 짝지을지도 조건으로 적어야 한다. 이 조건을 빠뜨리면 오류 없이, 엉뚱한 짝이 모두 섞인 답이 나온다.

</div>


## 예시로 보기

직원이 여덟 명이면 눈으로 훑어도 찾는다. 팔천 명이면 못 찾는다. 그래서 "이런 행의 이런 칸을 달라"고 문장으로 적어 DBMS에 맡긴다. 아래 질의는 모두 [COMPANY의 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 돌린 것이다.

**표 하나에서 찾기.** 이름이 John B. Smith인 직원의 생일과 주소를 찾는다[^1].

```sql
SELECT Bdate, Address
FROM   EMPLOYEE
WHERE  Fname = 'John' AND Minit = 'B' AND Lname = 'Smith';
```

| Bdate | Address |
|---|---|
| 1965-01-09 | 731 Fondren, Houston, TX |

EMPLOYEE의 여덟 행 가운데 `WHERE`의 조건이 참인 행은 하나다. 그 행에서 `SELECT`에 적힌 두 칸만 꺼냈다. `SELECT` 뒤에 적은 Bdate, Address를 투영 속성, `WHERE` 뒤의 조건처럼 한 표에서 행을 골라내는 조건을 선택 조건이라고 부른다.

**표 둘에서 찾기.** Research 부서에서 일하는 직원의 이름과 주소를 찾는다[^2].

```sql
SELECT Fname, Lname, Address
FROM   EMPLOYEE, DEPARTMENT
WHERE  Dname = 'Research' AND Dnumber = Dno;
```

직원 표에는 부서 번호(Dno)만 있고 부서 이름은 없다. 이름은 부서 표에 있다. 그래서 두 표를 함께 본다. 읽는 법은 이렇다. 직원 한 행과 부서 한 행을 짝지은 모든 조합을 떠올리고, 조건으로 걸러 낸다.

| 걸음 | 남는 조합 |
|---|---|
| `FROM EMPLOYEE, DEPARTMENT`: 직원 한 행과 부서 한 행의 모든 짝 | 8 × 3 = 24 |
| `Dname = 'Research'`: 부서 쪽이 Research인 짝만 | 8 |
| `Dnumber = Dno`: 직원의 부서 번호가 그 부서의 번호와 같은 짝만 | 4 |
| `SELECT Fname, Lname, Address`: 세 칸만 꺼냄 | 4행 |

| Fname | Lname | Address |
|---|---|---|
| John | Smith | 731 Fondren, Houston, TX |
| Franklin | Wong | 638 Voss, Houston, TX |
| Ramesh | Narayan | 975 Fire Oak, Humble, TX |
| Joyce | English | 5631 Rice, Houston, TX |

`Dname = 'Research'`는 부서 표에서 행 하나를 고르는 선택 조건이다. `Dnumber = Dno`는 다르다. 부서 표의 행과 직원 표의 행을 맞는 것끼리 짝지어 준다. 이렇게 두 표의 행을 잇는 조건을 조인 조건이라고 부른다[^3]. Dno는 Dnumber를 가리키는 [외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)다. 조인 조건은 대개 이렇게 "외래 키 = 그것이 가리키는 기본 키" 꼴이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Q0, Q1, Q2의 결과 표, 조합 수 24 → 8 → 4와 144 → 48 → 16 → 2, `SELECT *`의 행과 열 수, 읽는 법대로 짠 파이썬 계산과 SQLite의 답이 무작위 조건 200개에서 일치, 확인 문제의 답 — [50_select-from-where_verify.py](/Hongs_Blog/studies/database-design/code/50_select-from-where_verify/)</div>

</div>


## 정의

SQL에서 정보를 꺼내는 기본 문장은 하나다. 세 절로 된 이 틀을 SELECT-FROM-WHERE 블록이라 한다[^4].

```sql
SELECT <속성 목록>
FROM   <표 목록>
WHERE  <조건>;
```

- **〈속성 목록〉:** 값을 꺼낼 속성의 이름들.
- **〈표 목록〉:** 질의를 처리하는 데 필요한 릴레이션의 이름들.
- **〈조건〉:** 꺼낼 튜플을 가려내는 조건식. 튜플마다 참이나 거짓이 된다.

결과의 튜플 하나는 `FROM`에 적힌 표마다 튜플을 하나씩 뽑아 붙인 조합 하나에서 나온다. 그 조합에서 `SELECT`의 속성만 내보인다[^5].

**기호로 쓰면.** 표 $$R_1, \dots, R_m$$에서 속성 $$A_1, \dots, A_k$$를 조건으로 꺼내는 질의의 결과는 다음과 같다[^s1].

$$\text{결과} = \{\, (t.A_1, \dots, t.A_k) \;:\; t \in R_1 \times \dots \times R_m,\ \ \text{조건}(t) = \text{참} \,\}$$


$$R_1 \times \dots \times R_m$$은 표마다 행을 하나씩 뽑아 만든 모든 조합의 모임이다([곱집합](/Hongs_Blog/studies/discrete-math/sets/)). $$t$$는 그 조합 하나이고, $$t.A_1$$은 그 조합에서 $$A_1$$ 칸의 값이다. 말로 읽으면 "모든 조합 $$t$$ 가운데 조건이 참인 것마다, 적힌 칸의 값만 뽑아 한 행으로 만든다"다. 조건이 참인 조합이 둘이면 뽑힌 값이 같아도 결과에는 두 행이 나온다([다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)).

질의에 적는 것에는 이름이 셋 붙어 있다[^3].

| 이름 | 적는 곳 | 하는 일 |
|---|---|---|
| 투영 속성(projection attributes) | `SELECT` | 꺼낼 칸을 정한다 |
| 선택 조건(selection condition) | `WHERE` | 한 표에서 관심 있는 행을 고른다 |
| 조인 조건(join condition) | `WHERE` | 두 표의 행을 맞는 것끼리 짝짓는다 |

**모든 칸 꺼내기.** 속성 목록 자리에 별표 `*`를 쓰면 고른 행의 모든 칸이 나온다. 속성 이름을 일일이 적지 않아도 된다[^6].

```sql
SELECT * FROM EMPLOYEE WHERE Dno = 5;
SELECT * FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dno = Dnumber;
```

첫 문장은 5번 부서 직원 네 행을 EMPLOYEE의 칸 10개를 모두 붙여 내놓는다. 둘째 문장은 네 행에 직원 표의 칸 10개와 부서 표의 칸 4개, 모두 14개를 붙여 내놓는다.

### 표 셋으로 읽어 보기

Stafford에 있는 프로젝트마다 프로젝트 번호, 그 프로젝트를 맡은 부서의 번호, 그 부서 관리자의 성과 주소와 생일을 찾는다[^7].

```sql
SELECT Pnumber, Dnum, Lname, Address, Bdate
FROM   PROJECT, DEPARTMENT, EMPLOYEE
WHERE  Dnum = Dnumber AND Mgr_ssn = Ssn AND
       Plocation = 'Stafford';
```

프로젝트의 위치는 PROJECT에, 부서의 관리자가 누구인지는 DEPARTMENT에, 관리자의 성과 주소는 EMPLOYEE에 있다. 표 셋을 조인 조건 둘로 잇는다.

| 걸음 | 남는 조합 |
|---|---|
| `FROM PROJECT, DEPARTMENT, EMPLOYEE` | 6 × 3 × 8 = 144 |
| `Plocation = 'Stafford'` (선택 조건) | 2 × 3 × 8 = 48 |
| `Dnum = Dnumber` (조인 조건) | 2 × 1 × 8 = 16 |
| `Mgr_ssn = Ssn` (조인 조건) | 2 × 1 × 1 = 2 |

| Pnumber | Dnum | Lname | Address | Bdate |
|---|---|---|---|---|
| 10 | 4 | Wallace | 291 Berry, Bellaire, TX | 1941-06-20 |
| 30 | 4 | Wallace | 291 Berry, Bellaire, TX | 1941-06-20 |

남은 두 조합은 (Computerization, Administration, Wallace)와 (Newbenefits, Administration, Wallace)다. 결과의 한 행은 프로젝트 하나, 부서 하나, 직원 하나를 붙인 조합이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `FROM`에 표가 셋인데 조합이 왜 6 + 3 + 8이 아니라 6 × 3 × 8개인가</summary>

조합 하나는 프로젝트 하나, 부서 하나, 직원 하나를 각각 골라 만든다. 프로젝트를 고르는 방법 6가지마다 부서를 고르는 방법이 3가지, 그 각각에 직원을 고르는 방법이 8가지다. 서로 얽매이지 않는 선택을 이어서 하므로 곱한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. `Dnum = Dnumber`를 걸면 48개가 왜 꼭 16개로 줄어드는가</summary>

프로젝트마다 Dnum 값은 하나이고, Dnumber는 DEPARTMENT의 기본 키라 그 값을 가진 부서가 하나뿐이다. 그래서 프로젝트 하나에 짝지어지는 부서가 3개에서 1개로 준다. 48 ÷ 3 = 16이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `Mgr_ssn = Ssn`을 걸면 16개가 왜 2개가 되는가</summary>

남은 조합마다 부서는 정해져 있고 그 부서의 Mgr_ssn은 하나다. Ssn은 EMPLOYEE의 기본 키라 그 값을 가진 직원이 한 명뿐이다. 직원 쪽이 8명에서 1명으로 줄어 16 ÷ 8 = 2다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 읽는 법의 핵심 아이디어는?</summary>

가능한 모든 조합에서 출발해 조건으로 걸러 낸다. 조인 조건이 "외래 키 = 기본 키" 꼴이면 표 하나를 이을 때마다 짝이 하나로 정해진다. 그래서 결과의 행 수가 표를 곱한 만큼 불어나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

표가 넷, 다섯이어도 같다. 표 $$n$$개를 한 줄로 이으려면 조인 조건이 적어도 $$n - 1$$개 있어야 한다. 한 표를 두 번 쓰는 질의([별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/))도 같은 표의 조합 8 × 8 = 64개에서 걸러 낸다고 읽는다.

</details>


## 예제

**맞게 쓴 질의 셋**은 위의 Q0(표 하나), Q1(표 둘), Q2(표 셋)다. 틀리게 쓴 꼴 둘을 본다[^s2].

1. *조인 조건을 빠뜨린다.* `SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research';`는 오류 없이 8행을 낸다. 직원 여덟 명이 모두 Research 부서의 행과 짝지어져, 다른 부서 사람까지 Research 직원처럼 나온다.
2. *글자 값에 따옴표를 안 붙인다.* `WHERE Lname = Smith`라고 쓰면 DBMS는 Smith를 열 이름으로 읽고 "그런 열이 없다"는 오류를 낸다. 글자 값은 `'Smith'`처럼 작은따옴표로 싼다.

**경계 사례.**

- 조건에 맞는 행이 하나도 없으면 오류가 아니라 0행이 나온다. `SELECT Bdate FROM EMPLOYEE WHERE Lname = 'Brown';`의 결과는 빈 표다.
- `WHERE`에는 `SELECT`에 없는 칸도 쓴다. Q0는 이름 세 칸으로 고르고 생일과 주소만 꺼낸다.

**왜 이런 모양인가.** 세 절은 "무엇을 / 어디에서 / 어떤 것을"에 하나씩 맞춰져 있다. 어느 표부터 읽을지, 조건을 어떤 순서로 따질지를 적는 자리는 없다. 그 방법은 DBMS가 고른다([선언적 언어](/Hongs_Blog/studies/database-design/sql-overview/)).

## 활용

- **조건 쓰기.** 조건은 값을 `=`, `<`, `<=`, `>`, `>=`, `<>`로 견준 것을 `AND`, `OR`, `NOT`으로 이은 식이다. 잇는 법은 [명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/)과 같다[^s2].
- **결과도 표다.** 질의의 결과를 다른 질의 안에 넣거나([중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)) 두 결과를 합칠 수 있다([집합 연산](/Hongs_Blog/studies/database-design/sql-set-operations/)).
- **실제로 144개를 다 만들지는 않는다.** "모든 조합을 만들고 거른다"는 답이 무엇인지 정하는 읽는 법이다. DBMS는 같은 답을 내는 더 빠른 길을 고른다([DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)의 질의 최적화기)[^s2].
- **흔한 실수.**
    - 조인 조건을 빠뜨린다 → [WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/)
    - 두 표에 같은 이름의 칸이 있는데 어느 표 것인지 안 밝힌다 → [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
    - 결과에 같은 행이 여러 번 나오는 것을 모른다 → [다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)
- 연습: [기본 검색 연습](/Hongs_Blog/studies/database-design/basic-select-practice/)

## 연결

- 선수: [SQL 한눈에 보기](/Hongs_Blog/studies/database-design/sql-overview/), [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/), [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)
- 조인 조건을 `WHERE`에서 떼어 `FROM`에 적는 방법: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/)
- 세 절 뒤에 더 붙는 절(묶기, 정렬)과 전체 순서: [ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"SELECT가 맨 앞에 적혀 있으니 SELECT부터 처리된다"</div>

틀렸다. 글을 위에서 아래로 읽는 버릇 때문에 그럴듯해 보인다. 하지만 뜻을 읽는 순서는 `FROM`(어느 표의 조합인가) → `WHERE`(어떤 조합을 남기는가) → `SELECT`(무슨 칸을 꺼내는가)다. Q0로 확인된다. Q0의 `WHERE`는 Fname, Minit, Lname을 쓰는데 `SELECT`에는 Bdate와 Address뿐이다. `SELECT`가 먼저였다면 이름 세 칸은 이미 버려져서 조건을 따질 수 없다. 그런데 Q0는 답을 낸다[^s2].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** SELECT-FROM-WHERE 블록의 세 절에 각각 무엇을 적는가? 결과의 뜻을 읽는 순서는?</summary>

**답:** `SELECT`에는 값을 꺼낼 속성의 이름, `FROM`에는 필요한 표의 이름, `WHERE`에는 꺼낼 행을 가려내는 조건을 적는다. 읽는 순서는 `FROM`의 표에서 행을 하나씩 뽑은 모든 조합 → `WHERE`가 참인 조합만 → `SELECT`의 칸만이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `SELECT Fname, Lname FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Administration' AND Dnumber = Dno;`의 결과를 쓰라.</summary>

**답:** (Alicia, Zelaya), (Jennifer, Wallace), (Ahmad, Jabbar)의 세 행이다.<br>
**이유:** Administration은 4번 부서다. 24개 조합 가운데 부서 쪽이 Administration인 것이 8개이고, 그중 직원의 Dno가 4인 것이 셋이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "Houston에 있는 프로젝트의 이름과, 그 프로젝트를 맡은 부서의 이름"을 SQL로 쓰고 결과를 구하라.</summary>

**답:**
```sql
SELECT Pname, Dname
FROM   PROJECT, DEPARTMENT
WHERE  Dnum = Dnumber AND Plocation = 'Houston';
```
결과는 (ProductZ, Research), (Reorganization, Headquarters)다.<br>
**이유:** 프로젝트 이름과 위치는 PROJECT에, 부서 이름은 DEPARTMENT에 있어 표가 둘 필요하다. 둘을 잇는 조인 조건은 외래 키 Dnum과 기본 키 Dnumber를 맞춘 `Dnum = Dnumber`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** Q2에서 `Mgr_ssn = Ssn`을 빼면 몇 행이 나오는가? 왜 그런가?</summary>

**답:** 16행이다. Stafford의 두 프로젝트가 각각 직원 여덟 명 모두와 짝지어진다.<br>
**이유:** 프로젝트와 부서는 `Dnum = Dnumber`로 이어졌지만 부서와 직원을 잇는 조건이 없다. 그래서 직원 쪽은 걸러지지 않고 2 × 1 × 8 = 16개 조합이 그대로 남는다. 표가 셋이면 조인 조건이 적어도 둘 있어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `SELECT Lname, Salary FROM EMPLOYEE WHERE Salary > 30000 AND Dno = 5;`의 두 조건은 선택 조건인가 조인 조건인가? 결과도 구하라.</summary>

**답:** 둘 다 선택 조건이다. 결과는 (Wong, 40000), (Narayan, 38000)이다.<br>
**이유:** 조인 조건은 서로 다른 두 표의 칸을 맞대는 조건이다. 여기서는 표가 하나이고 두 조건 모두 한 행의 칸을 정해진 값과 견준다. `Dno = 5`에 부서 번호가 나온다고 조인 조건인 것은 아니다.

</details>


[^1]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.20 (Q0와 결과 표). 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.11
[^2]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.21 (Q1과 결과 표). 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.4
[^3]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.11~12 (Projection attributes, Selection condition, Join condition의 색 구분)
[^4]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.19 (SELECT-FROM-WHERE block). 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.4
[^5]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.13. 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.3 ("Each resulting tuple is a combination of one project, one department, and one employee")
[^6]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.20 (Use of the Asterisk). 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.6
[^7]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.22 (Q2와 결과 표). 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.12~13
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 기호로 쓴 식과 "조합 수가 줄어드는 걸음" 표는 슬라이드에 없다. 슬라이드 10-2 p.13의 문장(결과의 튜플은 표마다 하나씩 뽑은 조합이고, 거기서 투영 속성을 내보인다)을 식과 숫자로 옮겼다. 걸음마다의 조합 수는 검증 코드로 세었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 스스로 설명해 보기, 틀리게 쓴 꼴 둘, 경계 사례, 비교 연산자와 `AND`·`OR`·`NOT`(슬라이드는 "conditional (Boolean) expression"이라고만 적는다), 최적화기에 대한 설명, 오해 항목, 확인 문제는 슬라이드에 없다. 수치와 결과는 SQLite 3.50에서 실행해 확인했다. 비교 연산자의 목록은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 6.3.1절에 있다.
{% endraw %}
