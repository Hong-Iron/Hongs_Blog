---
layout: "note"
title: "주장 CREATE ASSERTION"
display_title: "주장 CREATE ASSERTION (Assertion)"
kind: "concept"
kind_label: "정의"
num: "73"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Assertion", "CREATE ASSERTION", "주장", "단언", "일반 제약", "General Constraint", "SALARY_CONSTRAINT"]
description: "표를 만들 때 걸어 두는 규칙은 행 하나나 표 하나만 본다. \"직원은 자기 부서의 부서장보다 급여를 많이 받을 수 없다\"처럼 여러 행과 여러 표를 함께 봐야 하는 규칙은 거기에 적을 자리가 없다. 주장은 이런 규칙을 \"규칙을 어기는 조합을 찾는 질의의 결과가 늘 비어 있어야 한다\"…"
prev_url: "/studies/database-design/order-by-clause-order/"
prev_title: "ORDER BY와 질의의 절 순서"
next_url: "/studies/database-design/sql-trigger/"
next_title: "트리거와 ECA 규칙"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "73_sql-assertion_verify.py", "u": "/studies/database-design/code/73_sql-assertion_verify/", "r": "검증"}, {"t": "73_sql-assertion_verify.sql", "u": "/studies/database-design/code/73_sql-assertion_verify-sql/", "r": "검증"}]
permalink: "/studies/database-design/sql-assertion/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표를 만들 때 걸어 두는 규칙은 행 하나나 표 하나만 본다. "직원은 자기 부서의 부서장보다 급여를 많이 받을 수 없다"처럼 여러 행과 여러 표를 함께 봐야 하는 규칙은 거기에 적을 자리가 없다. 주장은 이런 규칙을 "규칙을 어기는 조합을 찾는 질의의 결과가 늘 비어 있어야 한다"는 꼴로 데이터베이스에 걸어 두는 문장이다. 뜻이 분명하고 한 번만 적으면 되지만, 어느 표가 바뀌든 다시 확인해야 해서 값이 비싸고, PostgreSQL과 SQLite는 이 문장을 받아 주지 않는다.

</div>


## 예시로 보기

COMPANY의 표에는 이미 규칙이 걸려 있다. 기본 키는 비거나 겹칠 수 없고, 외래 키의 값은 가리키는 표에 있어야 한다. 그런데 회사에는 이런 규칙도 있다.

> 직원의 급여는 그 직원이 일하는 부서의 부서장 급여보다 많을 수 없다.


5번 부서(Research)의 부서장은 Wong이고 급여는 40000이다. 여기에 새 직원을 넣는다.

| Fname | Lname | Ssn | Salary | Super_ssn | Dno |
|---|---|---|---|---|---|
| Kate | Lee | 111223333 | 45000 | 333445555 | 5 |

Ssn은 비지도 겹치지도 않는다. Super_ssn 333445555(Wong)와 Dno 5는 둘 다 있는 값이다. 처음부터 걸려 있던 규칙은 하나도 어기지 않았으니 이 행은 그대로 들어간다. 그런데 Lee는 부서장 Wong보다 5000을 더 받는다. 회사 규칙은 깨졌는데 데이터베이스는 모른다.

이 규칙을 확인하려면 행 세 개를 한꺼번에 봐야 한다.

| 무엇 | 어느 표 | 이 예에서 |
|---|---|---|
| 직원의 행 (E) | EMPLOYEE | Lee, Salary 45000, Dno 5 |
| 그 직원의 부서 행 (D) | DEPARTMENT | Research, Dnumber 5, Mgr_ssn 333445555 |
| 그 부서의 부서장 행 (M) | EMPLOYEE | Wong, Salary 40000 |

`NOT NULL`이나 `CHECK`는 지금 넣는 행 하나만 본다. 기본 키와 외래 키도 정해진 꼴의 규칙만 적는다. 그래서 이런 규칙은 따로 적는 자리가 필요하다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: COMPANY 상태에서 점검 질의 0행, Lee를 넣은 뒤 1행, 규칙을 깨는 다른 네 가지 변경, 카드 C2·C3 — [73_sql-assertion_verify.py](/Hongs_Blog/studies/database-design/code/73_sql-assertion_verify/). PostgreSQL 16에서 실행: `CREATE ASSERTION`과 `CHECK` 안의 부질의가 거부되는 것, 트리거로 막는 판 — [73_sql-assertion_verify.sql](/Hongs_Blog/studies/database-design/code/73_sql-assertion_verify-sql/)</div>

</div>


## 정의

주장은 데이터베이스의 어느 상태에서나 참이어야 하는 조건에 이름을 붙여 걸어 둔 것이다. 조건을 지키는 일은 DBMS가 맡는다. 조건을 어기는 튜플의 조합이 그 상태에 하나도 없으면, 그 상태는 주장을 지킨 것이다.

```sql
CREATE ASSERTION SALARY_CONSTRAINT
CHECK ( NOT EXISTS ( SELECT *
                     FROM   EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
                     WHERE  E.Salary > M.Salary
                       AND  E.Dno = D.Dnumber
                       AND  D.Mgr_ssn = M.Ssn ) );
```

| 조각 | 뜻 |
|---|---|
| `CREATE ASSERTION SALARY_CONSTRAINT` | 주장을 만들고 이름을 붙인다 |
| `CHECK ( … )` | 괄호 안의 조건이 모든 상태에서 참이어야 한다 |
| `NOT EXISTS ( 질의 )` | 안쪽 질의의 결과가 비어 있어야 참이다 |
| 안쪽 질의 | 부서장(M)보다 많이 받는 직원(E)을 고른다. `EMPLOYEE`를 E와 M 두 이름으로 두 번 쓴다 |

주장은 두 걸음으로 쓴다.

1. 규칙을 **어기는** 튜플을 고르는 질의를 쓴다.
2. 그 질의를 `NOT EXISTS` 안에 넣는다. 결과가 비어 있으면 조건은 참이고, 한 행이라도 나오면 주장은 깨진 것이다.

"모든 직원이 규칙을 지킨다"를 곧바로 적지 않고 "어기는 직원이 없다"로 뒤집어 적는다. SQL에는 "모든"을 적는 말이 따로 없어서, [NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)로 돌려 말하는 것이다. 기호로 쓰면 다음 두 줄은 같은 말이다[^s1].

$$\forall e, m, d\ \big( (e.\text{Dno} = d.\text{Dnumber} \land d.\text{Mgr\_ssn} = m.\text{Ssn}) \rightarrow e.\text{Salary} \le m.\text{Salary} \big)$$


$$\lnot \exists e, m, d\ \big( e.\text{Dno} = d.\text{Dnumber} \land d.\text{Mgr\_ssn} = m.\text{Ssn} \land e.\text{Salary} > m.\text{Salary} \big)$$


여기서 $$e$$와 $$m$$은 EMPLOYEE의 튜플, $$d$$는 DEPARTMENT의 튜플이다. $$\forall$$는 "모든", $$\exists$$는 "어떤 ~가 있다", $$\lnot$$는 "아니다"로 읽는다. 첫 줄은 "$$d$$가 $$e$$의 부서이고 $$m$$이 그 부서장이면 $$e$$의 급여는 $$m$$의 급여 이하다", 둘째 줄은 "그런데도 $$e$$가 더 많이 받는 조합은 없다"이다.

## 예제

**점검 질의로 돌려 보기.** PostgreSQL 16과 SQLite는 `CREATE ASSERTION`을 받지 않는다. 그래서 `NOT EXISTS` 안의 질의만 꺼내 그대로 돌린다. 0행이면 주장이 지켜진 상태다[^s2].

COMPANY 상태에서는 0행이다. 5번 부서에서 가장 많이 받는 사람이 부서장 Wong(40000)이고, 4번 부서는 Wallace(43000), 1번 부서는 Borg(55000) 혼자다.

규칙을 깨는 길은 새 직원을 넣는 것만이 아니다. COMPANY 상태에서 아래 변경을 하나씩 해 보면 점검 질의가 이렇게 답한다[^s2].

| 변경 | 고친 표 | 점검 질의의 결과 |
|---|---|---|
| Lee(45000, 5번 부서)를 넣는다 | EMPLOYEE | 1행: Lee > Wong |
| Narayan의 급여를 38000에서 41000으로 올린다 | EMPLOYEE | 1행: Narayan > Wong |
| 부서장 Wong의 급여를 40000에서 35000으로 내린다 | EMPLOYEE | 1행: Narayan(38000) > Wong |
| Wallace(43000)를 5번 부서로 옮긴다 | EMPLOYEE | 1행: Wallace > Wong |
| 5번 부서의 부서장을 English(25000)로 바꾼다 | DEPARTMENT | 3행: Smith, Wong, Narayan > English |

다섯 변경이 두 표에 걸쳐 있다. 주장을 한 번 걸어 두면 DBMS가 이 모든 길을 알아서 지켜야 한다. 편한 만큼 DBMS가 할 일이 많다.

**직원이 한 명도 없으면?** 어기는 조합이 없으니 주장은 참이다. 빈 EMPLOYEE에서 `NOT EXISTS (…)`는 참을 낸다[^s2].

## 활용

- **어느 제품에서도 적힌 그대로는 실행 확인 안 함.** PostgreSQL 16은 문법은 알아보지만 "CREATE ASSERTION is not yet implemented"라고 거부한다. SQLite 3.50은 구문 오류를 낸다. `CHECK` 안에 부질의를 넣어 같은 일을 시키는 길도 두 제품 모두 막아 두었다[^s2].
- **실제로 막으려면** [트리거](/Hongs_Blog/studies/database-design/sql-trigger/)를 쓴다. PostgreSQL 16에서 "직원을 넣거나 급여·부서를 고칠 때 부서장 급여를 넘으면 오류를 낸다"는 트리거를 달았더니, 45000인 Lee는 거부되고 39000인 Lee는 들어갔다. 다만 이 트리거는 직원 쪽 변경만 본다. 부서장 Wong의 급여를 35000으로 내리는 문장은 그대로 통과해서 위반이 2행(Lee, Narayan) 생겼다. 위 표의 다섯 길을 다 막으려면 길마다 트리거를 달아야 한다[^s2].
- **이미 있는 데이터를 점검할 때** 점검 질의를 그대로 돌린다. 나온 행이 곧 고쳐야 할 행이다.
- **흔한 실수.** `NOT EXISTS` 안에 규칙을 지키는 행을 고르는 질의를 넣는 것이다. 그러면 "지키는 행이 하나도 없어야 한다"는 뜻이 된다.

## 연결

- 선수: [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/), [속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/), 같은 표를 두 이름으로 쓰는 [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
- 처음부터 걸려 있는 제약과 그것을 어기는 갱신: [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)
- 조건을 지키게 하는 대신 일이 일어났을 때 할 일을 적는 쪽: [트리거와 ECA 규칙](/Hongs_Blog/studies/database-design/sql-trigger/)
- "모두 ~이다"를 "~가 아닌 것이 없다"로 바꾸는 규칙: [술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주장을 쓰는 두 걸음을 말하고, "직원은 자기 부서의 부서장보다 급여를 많이 받을 수 없다"를 주장으로 쓰라.</summary>

**답:** ① 규칙을 어기는 튜플을 고르는 질의를 쓴다. ② 그 질의를 `NOT EXISTS` 안에 넣는다.
```sql
CREATE ASSERTION SALARY_CONSTRAINT
CHECK ( NOT EXISTS ( SELECT *
                     FROM   EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
                     WHERE  E.Salary > M.Salary
                       AND  E.Dno = D.Dnumber
                       AND  D.Mgr_ssn = M.Ssn ) );
```
**이유:** 안쪽 질의의 결과가 비어 있어야 조건이 참이다. 한 행이라도 나오면 주장이 깨진 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주장을 "규칙을 지키는 조합이 있다(`EXISTS`)"로 쓰면 왜 안 되는가? 직원이 한 명도 없는 데이터베이스에서 `SALARY_CONSTRAINT`는 참인가 거짓인가?</summary>

**답:** `EXISTS (지키는 조합)`은 지키는 조합이 하나만 있어도 참이다. 어기는 직원이 있어도 참이 되어 아무것도 막지 못한다. 규칙은 "모든 조합이 지킨다"이고, 이것은 "어기는 조합이 없다"와 같은 말이다. 직원이 한 명도 없으면 어기는 조합도 없으니 주장은 참이다.<br>
**이유:** 흔한 오답은 "직원이 없으면 확인할 것이 없으니 거짓"이다. `NOT EXISTS`는 결과가 빈 질의에 참을 낸다. 빈 EMPLOYEE에서 실행해 참이 나오는 것을 확인했다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "한 직원이 여러 프로젝트에서 일하는 시간을 다 더한 값은 40을 넘을 수 없다"를 주장으로 쓰라. COMPANY 상태는 이 주장을 지키는가? Smith(123456789)가 3번 프로젝트에서 5시간을 더 일하게 되면?</summary>

**답:**
```sql
CREATE ASSERTION HOURS_LIMIT
CHECK ( NOT EXISTS ( SELECT   Essn
                     FROM     WORKS_ON
                     GROUP BY Essn
                     HAVING   SUM(Hours) > 40 ) );
```
COMPANY 상태는 지킨다. 점검 질의가 0행이다. Smith는 32.5 + 7.5로 딱 40.0이고, 가장 적은 Wallace는 35.0이다. `WORKS_ON`에 (123456789, 3, 5.0)을 넣으면 점검 질의가 (123456789, 45.0) 한 행을 낸다.<br>
**이유:** 어기는 것은 "시간 합이 40을 넘는 직원"이다. 직원마다 묶어 합을 내고 `HAVING`으로 넘는 묶음만 남긴다. 조건이 `> 40`이라 딱 40인 Smith는 위반이 아니다. `>= 40`으로 쓰면 지금 상태에서 여섯 명이 걸린다[^s3].

</details>


[^s1]: 두 줄이 같다는 것은 $$\lnot\exists x\,P(x) \equiv \forall x\,\lnot P(x)$$와 $$\lnot(A \land B) \equiv (A \rightarrow \lnot B)$$에서 나온다.
[^s2]: SQLite 3.50.4와 PostgreSQL 16에서 실행해 확인했다. `CREATE ASSERTION`은 두 제품 모두 받지 않아 점검 질의(위반이 없으면 0행)로 확인했다.
[^s3]: 검증 코드로 확인했다.
{% endraw %}
