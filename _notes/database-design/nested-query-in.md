---
layout: "note"
title: "중첩 질의와 IN"
display_title: "중첩 질의와 IN (Nested Query and IN)"
kind: "concept"
kind_label: "정의"
num: "60"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Nested Query", "중첩 질의", "부질의", "서브쿼리", "Subquery", "바깥 질의", "Outer Query", "안쪽 질의", "Inner Query", "IN 연산자", "IN", "명시적 집합", "Explicit Set"]
description: "어떤 질문은 다른 질문의 답을 먼저 알아야 답할 수 있다. \"Smith가 일하는 프로젝트 번호\"를 쪽지에 적어 두고, 프로젝트 표를 훑으며 번호가 쪽지에 있는 것만 고르는 식이다. 질의 안에 다른 질의를 통째로 넣으면 쪽지를 손으로 옮겨 적지 않아도 되고, 표가 바뀌어도 답이 늘 …"
prev_url: "/studies/database-design/sql-alter-table/"
prev_title: "ALTER TABLE"
next_url: "/studies/database-design/sql-any-all/"
next_title: "ANY와 ALL"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/nested-query-in/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

어떤 질문은 다른 질문의 답을 먼저 알아야 답할 수 있다. "Smith가 일하는 프로젝트 번호"를 쪽지에 적어 두고, 프로젝트 표를 훑으며 번호가 쪽지에 있는 것만 고르는 식이다. 질의 안에 다른 질의를 통째로 넣으면 쪽지를 손으로 옮겨 적지 않아도 되고, 표가 바뀌어도 답이 늘 맞는다. 다만 쪽지에 값이 여럿일 수 있으면 "같다"가 아니라 "쪽지 안에 있다"로 견줘야 하고, 안팎의 표에 이름이 같은 열이 있으면 이름만 쓴 열은 가장 안쪽 표의 것으로 읽힌다.

</div>


## 예시로 보기

"Smith라는 직원이 일하고 있거나, Smith가 관리자인 부서가 맡은 프로젝트의 번호를 모두 구하라." 손으로 하면 두 번에 나눠 한다. 먼저 Smith가 일하는 프로젝트 번호를 찾아 쪽지에 적는다. 그다음 프로젝트 표를 훑으며 번호가 쪽지에 있는 것을 고른다. 이렇게 하면 질의를 두 번 쓰고, 첫 결과를 사람이 둘째 질의에 옮겨 적어야 한다. Smith가 내일 다른 프로젝트에도 들어가면 옮겨 적은 값은 틀린 값이 된다.

SQL에서는 쪽지를 만드는 질의를 괄호에 넣어 조건 안에 그대로 적는다[^1].

```sql
SELECT DISTINCT Pnumber
FROM   PROJECT
WHERE  Pnumber IN ( SELECT Pnumber
                    FROM   PROJECT, DEPARTMENT, EMPLOYEE
                    WHERE  Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith' )
       OR
       Pnumber IN ( SELECT Pno
                    FROM   WORKS_ON, EMPLOYEE
                    WHERE  Essn = Ssn AND Lname = 'Smith' );
```

괄호 안의 두 질의가 쪽지 두 장이다. 첫째는 "Smith가 관리자인 부서가 맡은 프로젝트 번호", 둘째는 "Smith가 일하는 프로젝트 번호"다. 바깥의 질의는 PROJECT의 행을 하나씩 보면서 `Pnumber`가 두 쪽지 가운데 어느 한 장에라도 있으면 그 행을 고른다.

COMPANY 상태([관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/))에서 돌린 결과다. Wong으로 바꾼 줄은 두 쪽지가 모두 차 있는 경우다[^s1].

| `Lname` | 첫째 쪽지 (관리자로서) | 둘째 쪽지 (일하는 사람으로서) | 바깥 질의의 결과 |
|---|---|---|---|
| 'Smith' | 비어 있다 | 1, 2 | 1, 2 |
| 'Wong' | 1, 2, 3 | 2, 3, 10, 20 | 1, 2, 3, 10, 20 |

Smith는 어느 부서의 관리자도 아니라서 첫째 쪽지가 비어 있다. 빈 쪽지에는 아무 번호도 없으니 첫째 조건은 늘 거짓이고, 둘째 조건이 참인 1번과 2번만 남는다. 같은 질문을 두 질의의 합집합으로 쓴 판은 [집합 연산 UNION·EXCEPT·INTERSECT](/Hongs_Blog/studies/database-design/sql-set-operations/)에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, Q17의 4행, Q16의 0행과 별칭 실험(2명과 3명), 부양가족 둘 이상(Smith, Wong), 두 겹 예제, 카드 C2·C3. SQLite 3.50.4와 PostgreSQL 16에서 실행했고, 여러 행을 돌려주는 안쪽 질의 앞의 `=`만 두 제품의 동작이 다르다(PostgreSQL은 오류, SQLite는 첫 행만 쓴다) — [60_nested-query-in_verify.py](/Hongs_Blog/studies/database-design/code/60_nested-query-in_verify/), [60_nested-query-in_verify.sql](/Hongs_Blog/studies/database-design/code/60_nested-query-in_verify-sql/)</div>

</div>


## 정의

질의 하나(SELECT-FROM-WHERE 한 덩어리)가 통째로 다른 질의의 `WHERE` 절 안에 들어가 있으면 중첩 질의(nested query)라 부른다[^1]. 감싸는 쪽이 바깥 질의(outer query), 괄호 안에 든 쪽이 안쪽 질의(inner query)다.

- 쓰임: 데이터베이스에 들어 있는 값을 먼저 꺼내 오고, 그 값을 `WHERE`의 비교에 쓴다.
- 안쪽 질의의 결과는 표다. 행이 없을 수도, 여럿일 수도, 같은 행이 두 번 나올 수도 있다([다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)).
- 안쪽 질의는 `WHERE` 말고 `FROM`, `SELECT` 같은 다른 절에도 넣을 수 있다.
- 안쪽 질의 안에 또 질의를 넣어 여러 겹으로 쌓을 수 있다[^3].

**IN.** `v IN V`는 값 `v`를 값의 모음 `V`와 견준다. `v`가 `V`의 원소 가운데 하나와 같으면 참이다[^2].

기호로 쓰면 $$v \in V$$이고, 풀어 쓰면 $$\exists x \in V\ (v = x)$$다. $$\in$$은 "~에 들어 있다", $$\exists x \in V$$는 "$$V$$ 안에 그런 $$x$$가 적어도 하나 있다"로 읽는다([술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)). $$V$$가 비어 있으면 그런 $$x$$가 없으므로 거짓이다.

`V` 자리에는 안쪽 질의 대신 값을 직접 늘어놓아도 된다. 이것을 명시적 집합(explicit set)이라 부른다[^4].

```sql
SELECT DISTINCT Essn
FROM   WORKS_ON
WHERE  Pno IN (1, 2, 3);
```

프로젝트 1, 2, 3 가운데 하나에서라도 일하는 직원의 번호 4개(123456789, 333445555, 453453453, 666884444)가 나온다.

### 값 하나를 돌려주는 안쪽 질의

안쪽 질의의 결과가 한 행 한 열, 곧 값 하나뿐이면 그 값을 `=`, `>`, `>=` 같은 비교에 바로 쓸 수 있다. 부양가족이 둘 이상인 직원을 찾는 질의가 그렇다[^5].

```sql
SELECT Lname, Fname
FROM   EMPLOYEE
WHERE  ( SELECT COUNT(*)
         FROM   DEPENDENT
         WHERE  Ssn = Essn ) >= 2;
```

`COUNT(*)`는 행의 수를 세어 수 하나를 돌려준다([집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/)). Smith와 Wong은 부양가족이 3명씩이라 뽑힌다. "값 하나"라는 조건이 깨지면 생기는 일은 아래 `자주 하는 오해`에 있다.

### 이름이 겹칠 때

바깥 질의의 표와 안쪽 질의의 표에 이름이 같은 열이 있으면 어느 표의 열인지 헷갈린다. 표 이름을 붙이지 않은 열은 가장 안쪽 질의의 표에서 먼저 찾는다[^s2]. 슬라이드는 이런 모호함을 피하도록 질의에 나오는 모든 표에 별칭을 붙이라고 권한다[^3].

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E
WHERE  E.Ssn IN ( SELECT D.Essn
                  FROM   DEPENDENT AS D
                  WHERE  E.Fname = D.Dependent_name AND E.Sex = D.Sex );
```

"자기와 이름도 같고 성별도 같은 부양가족이 있는 직원"을 찾는다. `Sex`는 EMPLOYEE에도 DEPENDENT에도 있다. `E.Sex = D.Sex`라고 적어야 직원의 성별과 부양가족의 성별을 견준다. 이 상태에는 그런 직원이 없어 결과는 0행이다.

별칭을 빼면 어떻게 되는지는 조건을 성별 하나만 남기면 잘 보인다[^s2].

| 안쪽 질의의 조건 | 견주는 것 | 결과 |
|---|---|---|
| `WHERE E.Sex = D.Sex` | 직원의 성별과 부양가족의 성별 | Smith, Wong |
| `WHERE Sex = Sex` | 부양가족의 성별과 부양가족의 성별 | Smith, Wong, Wallace |

`Sex = Sex`의 두 `Sex`는 모두 가장 안쪽 표인 DEPENDENT의 것으로 읽힌다. 자기 자신과 같은지 묻는 꼴이라 늘 참이고, 부양가족이 있는 직원이 모두 뽑힌다. Wallace는 여성이고 부양가족은 남성인 Abner 한 명뿐인데도 결과에 들어 있다. 오류는 나지 않고 답만 틀린다.

이 안쪽 질의는 바깥 행의 값(`E.Fname`, `E.Sex`)을 쓴다. 그래서 바깥 행이 바뀔 때마다 쪽지의 내용이 달라진다. 이런 질의를 돌리는 차례는 [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)에서 다룬다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 첫 질의에서 Smith의 첫째 안쪽 질의는 빈 표를 돌려준다. 그런데도 바깥 결과가 비지 않는 까닭은?</summary>

두 `IN` 조건이 `OR`로 이어져 있다. 빈 표에 대한 `IN`은 모든 행에서 거짓이지만, 둘째 `IN`이 참인 행(프로젝트 1, 2)은 "거짓 OR 참 = 참"이라 남는다. `AND`로 이었다면 결과가 비었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. `Pno IN (1, 2, 3)`을 IN 없이 쓰면 어떤 조건인가? 근거는?</summary>

`Pno = 1 OR Pno = 2 OR Pno = 3`. `IN`의 뜻이 "원소 가운데 하나와 같다"이고, 원소가 셋뿐이라 셋을 `OR`로 이으면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `WHERE Sex = Sex`가 오류 없이 틀린 답을 내는 까닭은?</summary>

이름만 쓴 열은 가장 안쪽 표에서 먼저 찾는다. DEPENDENT에 `Sex`가 있으니 양쪽 모두 DEPENDENT의 열로 정해지고, 문법으로는 아무 문제가 없는 조건이 된다. 그래서 제품은 틀린 것을 알려 주지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

질의의 결과도 표다. 그러니 값이나 값의 모음이 올 자리에 질의를 넣을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

함수를 부를 때 인자 자리에 다른 함수의 호출을 넣는 것과 같다. 질의에 이름을 붙여 표처럼 쓰는 [뷰](/Hongs_Blog/studies/database-design/sql-view/), 어기는 행을 고르는 질의를 조건 안에 넣는 [주장 CREATE ASSERTION](/Hongs_Blog/studies/database-design/sql-assertion/)도 질의 안에 질의를 넣는다.

</details>


## 예제

**Smith와 같은 프로젝트에서 일하는 직원의 성을 구하라.**[^s3]

1. *가장 안쪽 쪽지:* Smith가 일하는 프로젝트 번호. → 1, 2.
2. *가운데 쪽지:* 번호가 그 쪽지에 있는 프로젝트에서 일하는 직원의 번호. → 123456789, 333445555, 453453453.
3. *바깥 질의:* 번호가 가운데 쪽지에 있는 직원의 성.

```sql
SELECT Lname
FROM   EMPLOYEE
WHERE  Ssn IN ( SELECT Essn
                FROM   WORKS_ON
                WHERE  Pno IN ( SELECT Pno
                                FROM   WORKS_ON, EMPLOYEE
                                WHERE  Essn = Ssn AND Lname = 'Smith' ) );
```

{: start="4"}
4. *결과:* Smith, Wong, English. Smith 자신도 들어 있다. 빼려면 바깥 `WHERE`에 `AND Lname <> 'Smith'`를 더한다(Wong, English).

안쪽에서 바깥으로 쪽지를 하나씩 만들어 가면 여러 겹이어도 읽힌다.

## 활용

- 같은 질문을 여러 꼴로 쓸 수 있다. 위 첫 질의는 합집합으로도 쓰고([집합 연산 UNION·EXCEPT·INTERSECT](/Hongs_Blog/studies/database-design/sql-set-operations/)), 안쪽 질의 하나하나는 조인으로도 쓴다([FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/)). "있다, 없다"만 물을 때는 [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)가, 크기를 견줄 때는 [ANY와 ALL](/Hongs_Blog/studies/database-design/sql-any-all/)이 맞는다.
- 흔한 실수 셋. 여러 행을 돌려주는 안쪽 질의 앞에 `=`를 쓴다. 별칭 없이 이름이 겹치는 열을 쓴다. `NOT IN` 뒤의 쪽지에 빈칸(NULL)이 섞여 있다. 마지막 것은 [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)에 있다.
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/), [복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/), [중첩 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/nested-query-ladder/)

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
- `IN`은 "그런 원소가 있다"를 묻는다: [술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)
- 쪽지와 견주는 다른 방법: [ANY와 ALL](/Hongs_Blog/studies/database-design/sql-any-all/), [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"안쪽 질의 앞에는 = 을 써도 IN을 써도 같다"</div>

틀렸다. `=`는 값 하나와 값 하나를 견준다. 안쪽 질의가 한 행만 돌려줄 때는 `=`와 `IN`의 결과가 같아서 둘이 같은 말처럼 보인다. "Franklin Wong이 상사인 직원"을 찾는 `E.Super_ssn = ( SELECT … WHERE Fname = 'Franklin' AND Lname = 'Wong' )`은 안쪽이 한 행이라 잘 돈다(Smith, Narayan, English)[^6]. 안쪽이 두 행 이상을 돌려주면 달라진다. "상사의 상사가 888665555인 직원"을 `Super_ssn = ( SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555' )`로 쓰면 안쪽 결과가 Wong과 Wallace 두 행이다. PostgreSQL 16은 "more than one row returned by a subquery used as an expression" 오류로 멈춘다. SQLite는 오류 없이 첫 행(Wong)만 써서 3명을 내놓는데, 맞는 답은 5명이다. `IN`으로 바꾸면 두 제품 모두 5명(Smith, Zelaya, Narayan, English, Jabbar)을 낸다. 확인하는 법: 안쪽 질의만 따로 돌려 행이 몇 개 나오는지 본다. 기본 키로 한 행을 짚거나 `MAX`, `COUNT`처럼 값 하나로 줄이는 계산이 아니면 `IN`을 쓴다.

</div>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 12주차 풀이 Q3-2 `SELECT Fname, Minit, Lname FROM EMPLOYEE WHERE Super_ssn = ( SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555');`[^7] / 문제점: `=` 뒤의 안쪽 질의가 2행(Wong, Wallace)을 돌려준다 / 수정안: `=`를 `IN`으로 바꾼다 / 근거: PostgreSQL 16은 오류, SQLite는 첫 행만 써서 3명, `IN`은 5명 — [60_nested-query-in_verify.sql](/Hongs_Blog/studies/database-design/code/60_nested-query-in_verify-sql/)

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 중첩 질의, 바깥 질의, 안쪽 질의가 무엇인지 쓰고, `v IN V`가 참이 되는 조건을 쓰라.</summary>

**답:** 질의 하나가 통째로 다른 질의의 `WHERE` 절 안에 들어간 것이 중첩 질의다. 감싸는 쪽이 바깥 질의, 괄호 안에 든 쪽이 안쪽 질의다. `v IN V`는 `v`가 `V`의 원소 가운데 하나와 같으면 참이다.<br>
**이유:** 안쪽 질의의 결과는 값 하나가 아니라 표(값의 모음)라서 "같다"가 아니라 "들어 있다"로 견준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `SELECT Lname FROM EMPLOYEE WHERE Dno IN ( SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston' );`의 결과를 쓰라. DEPT_LOCATIONS의 행은 (1, Houston), (4, Stafford), (5, Bellaire), (5, Sugarland), (5, Houston)이다.</summary>

**답:** Smith, Wong, Narayan, English, Borg.<br>
**이유:** 안쪽 질의의 결과는 부서 번호 1과 5다. 5번 부서 직원 넷(Smith, Wong, Narayan, English)과 1번 부서의 Borg가 뽑힌다. 4번 부서의 Zelaya, Wallace, Jabbar는 빠진다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 두 조건의 `?` 자리에 `=`를 써도 되는 것은 어느 쪽인가? (a) `Dno ? ( SELECT Dnumber FROM DEPARTMENT WHERE Dname = 'Research' )` (b) `Dno ? ( SELECT Dnumber FROM DEPT_LOCATIONS WHERE Dlocation = 'Houston' )`</summary>

**답:** (a)만 된다. (b)는 `IN`을 써야 한다.<br>
**이유:** (a)의 안쪽 질의는 5 한 행만 돌려준다. 부서 이름은 부서마다 다르게 정해져 있어 늘 한 행 이하다. (b)의 안쪽 질의는 1과 5 두 행을 돌려준다. `=`를 쓰면 PostgreSQL은 오류를 내고, SQLite는 첫 행만 써서 틀린 답을 낸다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 중첩 질의에서는 모든 표에 별칭을 붙이라고 권한다. 붙이지 않으면 생기는 일을 예로 설명하라.</summary>

**답:** "성별이 같은 부양가족이 있는 직원"을 `WHERE Ssn IN ( SELECT Essn FROM DEPENDENT WHERE Sex = Sex )`로 쓰면 Smith, Wong, Wallace가 나온다. 맞는 답은 Smith, Wong이다.<br>
**이유:** 이름만 쓴 `Sex`는 둘 다 가장 안쪽 표 DEPENDENT의 것으로 읽혀서, 부양가족의 성별을 자기 자신과 견주는 늘 참인 조건이 된다. `E.Sex = D.Sex`처럼 별칭을 붙여야 직원과 부양가족을 견준다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.11 (Nested Query의 뜻, Query 4의 중첩 판, Outer query와 Inner query). 같은 그림이 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.3에 다시 나온다.
[^2]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.12 (IN operator: 값 v를 값의 집합 또는 다중집합 V와 견준다)
[^3]: 같은 자료, p.14 (Ambiguity in Nested Queries, Query 16, 모든 표에 별칭을 붙이라는 권고)
[^4]: 같은 자료, p.19 (Explicit Sets, Query 17)
[^5]: 같은 자료, p.30 (안쪽 질의에 집계 함수를 쓴 선택 조건)
[^6]: 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.23 (연습 4-c의 풀이: 한 행을 돌려주는 안쪽 질의 앞의 `=`)
[^7]: 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices-solution」, p.7 (Q3-2의 풀이). 문제는 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.19
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 쪽지 비유와 Wong으로 바꾼 줄은 슬라이드에 없다. 슬라이드는 질의만 싣고 결과 표는 싣지 않았다. 표의 값은 검증 코드로 실행해 얻었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "이름만 쓴 열은 가장 안쪽 질의의 표에서 찾는다"는 규칙의 글과 `Sex = Sex` 실험은 슬라이드에 없다. 규칙은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Nested Queries, Tuples, and Set/Multiset Comparisons"에 있고, 표의 두 결과는 SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 두 겹 예제, 스스로 설명해 보기, 카드 C2~C4의 질의와 답은 슬라이드에 없다. 검증 코드로 실행해 확인했다.
{% endraw %}
