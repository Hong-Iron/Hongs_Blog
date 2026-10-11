---
layout: "note"
title: "NULL 값과 IS NULL"
display_title: "NULL 값과 IS NULL (NULL and IS NULL)"
kind: "concept"
kind_label: "정의"
num: "63"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["NULL", "널", "널 값", "IS NULL", "IS NOT NULL", "세 값 논리", "Three-valued Logic", "3값 논리", "UNKNOWN", "모름"]
description: "표의 빈칸은 0이나 빈 글자가 아니라 \"값이 없다\"는 표시다. 아직 모르는 값일 수도 있고, 그 행에는 애초에 쓸 수 없는 값일 수도 있다. 무엇인지 모르는 값이라 다른 값과 같은지 다른지도 알 수 없어서, 빈칸끼리 견줘도 참이 되지 않는다. 그래서 빈칸인지 묻는 말이 따로 있고,…"
prev_url: "/studies/database-design/sql-exists/"
prev_title: "EXISTS와 NOT EXISTS"
next_url: "/studies/database-design/sql-join-on/"
next_title: "FROM 절의 조인 (JOIN ON)"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-null/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표의 빈칸은 0이나 빈 글자가 아니라 "값이 없다"는 표시다. 아직 모르는 값일 수도 있고, 그 행에는 애초에 쓸 수 없는 값일 수도 있다. 무엇인지 모르는 값이라 다른 값과 같은지 다른지도 알 수 없어서, 빈칸끼리 견줘도 참이 되지 않는다. 그래서 빈칸인지 묻는 말이 따로 있고, 빈칸이 낀 행은 표를 잇거나 값을 셀 때 조용히 빠진다.

</div>


## 예시로 보기

COMPANY 상태([관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/))에는 빈칸이 두 곳 있다. Borg의 `Super_ssn`은 사장이라 상사가 없어서 비어 있고, WORKS_ON의 (888665555, 20) 행은 일한 시간 `Hours`가 적혀 있지 않다.

"상사가 없는 직원"을 찾으려고 `=`로 견주면 아무도 안 나온다[^1].

| 조건 | 결과 |
|---|---|
| `WHERE Super_ssn = NULL` | 0행 |
| `WHERE Super_ssn <> NULL` | 0행 |
| `WHERE Super_ssn IS NULL` | Borg |
| `WHERE Super_ssn IS NOT NULL` | 나머지 7명 |

`= NULL`도 `<> NULL`도 0행이다. 같다고도 다르다고도 말할 수 없기 때문이다. 빈칸인지는 `IS NULL`로 묻는다.

```sql
SELECT Fname, Lname
FROM   EMPLOYEE
WHERE  Super_ssn IS NULL;
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 세 값 논리의 표, `Hours > 10`의 8행과 `Hours <= 10`의 7행, 상사 조인 7행, COUNT의 8·8·6·7, WORKS_ON의 16·15·275·18.33, `GROUP BY`의 NULL 묶음, `NOT IN`의 0행과 5명, 카드 C3. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다 — [63_sql-null_verify.py](/Hongs_Blog/studies/database-design/code/63_sql-null_verify/), [63_sql-null_verify.sql](/Hongs_Blog/studies/database-design/code/63_sql-null_verify-sql/)</div>

</div>


## 정의

NULL은 어떤 행에서 그 열의 값을 모르거나, 그 행에는 그 열이 맞지 않을 때 값 자리에 두는 표시다. 슬라이드는 뜻을 셋으로 든다[^2]. 표의 풀이와 예는 이 과목의 표에 있는 빈칸에 세 뜻을 맞춰 본 것이다[^s3].

| 뜻 | 풀이 | 예 |
|---|---|---|
| 모르는 값 (unknown) | 값은 있는데 무엇인지 모른다 | Borg가 프로젝트 20에서 일한 시간 |
| 얻지 못한 값 (unavailable) | 값은 있는데 알려 주지 않았거나 구하지 못했다 | 집 전화번호를 적지 않은 학생 |
| 정해지지 않는 값 (undefined) | 그 행에는 이 열이 맞지 않는다 | 사장 Borg의 상사, 사무실이 없는 학생의 사무실 전화번호 |

**IS NULL.** 열의 값이 NULL이면 참이다. `IS NOT NULL`은 그 반대다[^1].

슬라이드가 적은 규칙은 셋이다.

- NULL은 저마다 다른 NULL과 같지 않다고 본다. 그래서 `=`나 `<>`로 NULL과 견줄 수 없다[^1].
- 표를 이을 때 맞추는 열이 NULL인 행은 결과에서 빠진다[^1]. 직원과 상사를 `E.Super_ssn = S.Ssn`으로 이으면 8행이 아니라 7행이 나온다. Borg가 빠진다[^3]. 빠진 행까지 남기는 방법이 [외부 조인](/Hongs_Blog/studies/database-design/outer-join/)이다.
- 값을 세는 계산은 NULL을 세지 않는다. 슬라이드는 "`COUNT(Salary)`를 쓰면 어떻게 되는가, NULL도 세는가"를 물음으로 남겼다[^4]. 돌려 보면 이렇다[^s1].

| 식 | EMPLOYEE (8행) | 뜻 |
|---|---|---|
| `COUNT(*)` | 8 | 행의 수 |
| `COUNT(Salary)` | 8 | 급여가 적힌 칸의 수. 같은 값도 따로 센다 |
| `COUNT(DISTINCT Salary)` | 6 | 서로 다른 급여의 수 |
| `COUNT(Super_ssn)` | 7 | 상사가 적힌 칸의 수. Borg의 빈칸은 세지 않는다 |

평균도 같다. WORKS_ON은 16행인데 `Hours`가 적힌 칸은 15개, 합은 275다. `AVG(Hours)`는 275 ÷ 15 = 18.33이고, 275 ÷ 16 = 17.19가 아니다([집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/)).

### 참, 거짓, 모름

NULL과 견준 결과는 참도 거짓도 아닌 셋째 값 "모름"이다. `WHERE`는 조건이 참인 행만 남기므로 모름인 행은 거짓인 행과 함께 버려진다[^s2].

| 식 | 값 |
|---|---|
| `NULL = NULL`, `NULL <> NULL`, `1 = NULL` | 모름 |
| `NULL IS NULL` | 참 |
| 모름 `AND` 거짓 | 거짓 |
| 모름 `AND` 참 | 모름 |
| 모름 `OR` 참 | 참 |
| 모름 `OR` 거짓 | 모름 |
| `NOT` 모름 | 모름 |

"모름 AND 거짓"이 거짓인 까닭은 모르는 쪽이 참이든 거짓이든 전체가 거짓이기 때문이다. "모름 OR 참"도 같은 이유로 참이다.

이 때문에 조건과 그 반대 조건이 표 전체를 덮지 못한다. WORKS_ON에서 `Hours > 10`은 8행, `Hours <= 10`은 7행이고 합쳐도 15행이다. `Hours`가 NULL인 한 행은 어느 쪽에도 들지 않는다. `NOT (Hours > 10)`도 7행이다.

## 활용

흔한 실수와 알아 둘 동작이다[^s2].

- **NOT IN과 NULL.** "부하가 한 명도 없는 직원"을 `Ssn NOT IN ( SELECT Super_ssn FROM EMPLOYEE )`로 쓰면 0행이 나온다. 안쪽 결과에 Borg의 NULL이 섞여 있어서, 어느 직원이든 "그 모르는 값과 다르다"고 말할 수 없기 때문이다. 안쪽에 `WHERE Super_ssn IS NOT NULL`을 더하면 Smith, Zelaya, Narayan, English, Jabbar 5명이 나온다. `NOT EXISTS`로 쓰면 이 문제가 없다([EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)).
- **계산.** NULL이 든 계산의 결과는 NULL이다. `Hours + 1`은 그 행에서 NULL이다.
- **묶을 때는 한데 모인다.** `GROUP BY Super_ssn`과 `SELECT DISTINCT Super_ssn`은 NULL끼리 한 묶음으로 본다. 묶음이 넷(상사 셋과 NULL)이다. 견줄 때는 서로 같지 않다고 보면서 묶을 때는 함께 두는 것이라 헷갈리기 쉽다([GROUP BY](/Hongs_Blog/studies/database-design/group-by/)).
- **줄 세울 때의 자리**는 제품마다 다르다([ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/)).
- 분석에 쓰기 전에 빈칸을 채우거나 버리는 방법: [데이터 정제](/Hongs_Blog/studies/data-science/data-cleaning/)

## 연결

- 선수: [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/)(값이 없는 칸에 NULL을 둔다)
- 기본 키에는 NULL을 둘 수 없다: [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/). 외래 키는 NULL이어도 된다: [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)
- 참과 거짓 두 값만 쓰는 논리와 견주기: [명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/)
- NULL이 결과를 바꾸는 다른 곳: [ANY와 ALL](/Hongs_Blog/studies/database-design/sql-any-all/), [외부 조인](/Hongs_Blog/studies/database-design/outer-join/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** NULL의 세 가지 뜻을 쓰고, 값이 NULL인지 묻는 조건을 쓰라.</summary>

**답:** 모르는 값, 얻지 못한 값, 정해지지 않는 값(그 행에는 맞지 않는 열). `열 IS NULL`로 묻고, 반대는 `열 IS NOT NULL`이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `WHERE Super_ssn = NULL`이 Borg를 고르지 못하는 까닭을 설명하라. `WHERE Super_ssn <> NULL`은 몇 행을 고르는가?</summary>

**답:** NULL은 모르는 값이라 어떤 값과 같은지 알 수 없다. 비교의 결과가 참이 아니라 "모름"이 되고, `WHERE`는 참인 행만 남긴다. `<> NULL`도 모든 행에서 모름이라 0행이다.<br>
**흔한 오답:** "`= NULL`이 0행이니 `<> NULL`은 8행"이라고 답하는 것. 두 조건이 서로 반대여도 모름인 행은 양쪽에서 다 빠진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** WORKS_ON에서 프로젝트 20의 행은 (333445555, 20, 10.0), (987654321, 20, 15.0), (888665555, 20, NULL)이다. 이 세 행에 대한 `COUNT(*)`, `COUNT(Hours)`, `SUM(Hours)`, `AVG(Hours)`를 구하라.</summary>

**답:** 3, 2, 25.0, 12.5.<br>
**이유:** `COUNT(*)`는 행을 세어 3이다. 나머지는 NULL을 빼고 계산한다. 값이 둘(10.0, 15.0)이라 합은 25.0, 평균은 25 ÷ 2 = 12.5다. 25 ÷ 3이 아니다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.18 (IS NULL function, "상사가 없는 직원" 질의, NULL끼리 같지 않다, `=`와 `<>`로 견줄 수 없다, 조인에서 빠진다)
[^2]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.14 (NULL 값의 뜻: unknown, unavailable, undefined. STUDENT 표의 Home_phone과 Office_phone 빈칸)
[^3]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.24 (내부 조인의 결과 7행, `Super_ssn`이 NULL인 행은 빠진다)
[^4]: 같은 자료, p.28 (COUNT Function, 빨간 글씨의 두 물음)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드의 두 물음에는 답이 적혀 있지 않다. 표의 값과 WORKS_ON의 평균은 SQLite와 PostgreSQL 16에서 실행해 얻었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 셋째 값 "모름"과 `AND`·`OR`·`NOT`의 표, 조건과 반대 조건의 8행·7행, `NOT IN`의 0행, 계산과 묶기에서의 동작, 카드 C2·C3은 슬라이드에 없다. 세 값 논리는 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Comparisons Involving NULL and Three-Valued Logic"에 있다. 값은 모두 SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 세 뜻의 풀이와 예는 슬라이드에 없다. 슬라이드는 낱말 셋과 STUDENT 표의 빈칸 두 곳만 보인다. 어느 빈칸이 어느 뜻인지는 슬라이드가 정해 주지 않는다.
{% endraw %}
