---
layout: "note"
title: "집계 함수"
display_title: "집계 함수 (Aggregate Functions)"
kind: "concept"
kind_label: "정의"
num: "68"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Aggregate Function", "집계 함수", "집단 함수", "COUNT", "SUM", "MAX", "MIN", "AVG", "COUNT DISTINCT"]
description: "직원 여덟 명의 급여를 하나하나 보는 대신 \"모두 더하면 얼마, 가장 많이 받는 사람은 얼마, 평균은 얼마\"처럼 한 줄로 줄여 보고 싶을 때가 있다. 여러 행을 받아 값 하나로 줄여 주는 계산이 집계 함수다. 개수, 합, 가장 큰 값, 가장 작은 값, 평균 다섯 가지가 기본으로 있…"
prev_url: "/studies/database-design/inner-vs-outer-join/"
prev_title: "내부 조인과 외부 조인 비교"
next_url: "/studies/database-design/group-by/"
next_title: "GROUP BY"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/aggregate-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직원 여덟 명의 급여를 하나하나 보는 대신 "모두 더하면 얼마, 가장 많이 받는 사람은 얼마, 평균은 얼마"처럼 한 줄로 줄여 보고 싶을 때가 있다. 여러 행을 받아 값 하나로 줄여 주는 계산이 집계 함수다. 개수, 합, 가장 큰 값, 가장 작은 값, 평균 다섯 가지가 기본으로 있다. 빈칸은 계산에서 빠지므로 "행이 몇 개인가"와 "이 열에 값이 몇 개 있는가"는 답이 다를 수 있다.

</div>


## 예시로 보기

지금까지의 질의는 조건에 맞는 행을 그대로 보여 주었다. "직원이 모두 몇 명인가", "급여의 합은 얼마인가"에 답하려면 결과 행을 사람이 세고 더해야 했다. 집계 함수는 그 일을 질의 안에서 한다[^1].

```sql
SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary)
FROM   EMPLOYEE;
```

EMPLOYEE의 8행이 한 행으로 줄어든다.

| SUM(Salary) | MAX(Salary) | MIN(Salary) | AVG(Salary) |
|---|---|---|---|
| 281000 | 55000 | 25000 | 35125 |

여덟 급여 30000, 40000, 25000, 43000, 38000, 25000, 25000, 55000을 더하면 281000이고, 8로 나누면 35125다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, Q21의 8, Q22의 4, Q23의 6, `COUNT(Salary)` 8과 `COUNT(Super_ssn)` 7, `AVG(Hours)` 18.33, 행이 없을 때의 0과 NULL, 부양가족 둘 이상(Smith, Wong), 최고 급여자 Borg, 카드 C2. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다. 집계 함수와 보통 열을 섞은 `SELECT Lname, MAX(Salary)`만 다르다(PostgreSQL은 오류, SQLite는 받는다) — [68_aggregate-functions_verify.py](/Hongs_Blog/studies/database-design/code/68_aggregate-functions_verify/), [68_aggregate-functions_verify.sql](/Hongs_Blog/studies/database-design/code/68_aggregate-functions_verify-sql/)</div>

</div>


## 정의

집계 함수(aggregate function)는 여러 행의 정보를 한 행으로 줄여 요약한다. 주로 `SELECT` 절에 쓰고 `HAVING` 절에도 쓴다[^1].

| 함수 | 돌려주는 것 |
|---|---|
| `COUNT` | 질의가 고른 행의 수, 또는 값의 수 |
| `SUM` | 값의 합 |
| `MAX` | 가장 큰 값 |
| `MIN` | 가장 작은 값 |
| `AVG` | 평균 |

`SUM`, `MAX`, `MIN`, `AVG`는 수로 된 값의 모음에 쓴다. 같은 값이 여러 번 들어 있어도 되는 모음이다. 25000을 받는 세 사람을 한 번으로 치면 합과 평균이 틀리므로, 표가 중복을 지우지 않는다는 점이 여기서 쓸모가 있다([다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)).

**COUNT의 세 꼴.** 무엇을 세는지가 괄호 안에 따라 다르다[^2].

| 식 | 세는 것 | EMPLOYEE에서 |
|---|---|---|
| `COUNT(*)` | 행. `*`는 행을 가리킨다 | 8 |
| `COUNT(Salary)` | `Salary`에 값이 있는 칸. 같은 값도 따로 센다 | 8 |
| `COUNT(DISTINCT Salary)` | 서로 다른 `Salary` 값 | 6 |
| `COUNT(Super_ssn)` | `Super_ssn`에 값이 있는 칸. NULL은 세지 않는다 | 7 |

슬라이드는 "`COUNT(Salary)`를 쓰면 어떻게 되는가, NULL 값도 세는가"를 물음으로 남겼다[^2]. 급여는 여덟 명 모두 적혀 있어 `COUNT(Salary)`는 `COUNT(*)`와 같은 8이다. 서로 다른 급여는 25000, 30000, 38000, 40000, 43000, 55000 여섯 가지다. NULL은 세지 않는다. Borg의 `Super_ssn`이 비어 있어 `COUNT(Super_ssn)`은 7이다[^s1].

조건이나 조인과 함께 쓰면 고른 행만 센다. "Research 부서의 직원 수"는 4다[^2].

```sql
SELECT COUNT(*)
FROM   EMPLOYEE, DEPARTMENT
WHERE  Dno = Dnumber AND Dname = 'Research';
```

**NULL과 빈 입력.** 다섯 함수 모두 NULL인 칸을 빼고 계산한다(`COUNT(*)`만 예외다). 그래서 평균은 합을 "값이 있는 칸의 수"로 나눈 것이다. 식으로는 $$\text{AVG}(A) = \text{SUM}(A) \div \text{COUNT}(A)$$이고, $$A$$는 열 이름이다. WORKS_ON은 16행인데 `Hours`가 적힌 칸은 15개이고 합은 275다. `AVG(Hours)`는 275 ÷ 15 = 18.33이지 275 ÷ 16 = 17.19가 아니다. 고른 행이 하나도 없으면 `COUNT`는 0을, 나머지 넷은 NULL을 돌려준다[^s1].

### 안쪽 질의에 쓰기

집계 함수는 값 하나를 돌려주므로, 안쪽 질의에 넣어 바깥 질의의 조건에 쓸 수 있다. (1) 집계 함수가 든 안쪽 질의를 적고 (2) 그것을 바깥 `WHERE`의 비교에 쓴다[^3].

```sql
SELECT Lname, Fname
FROM   EMPLOYEE
WHERE  ( SELECT COUNT(*)
         FROM   DEPENDENT
         WHERE  Ssn = Essn ) >= 2;
```

직원마다 자기 부양가족의 수를 세어 2 이상이면 뽑는다. Smith와 Wong(3명씩)이 나온다.

## 활용

- 요약값을 한 줄로 얻는다. 묶음마다 따로 얻으려면 [GROUP BY](/Hongs_Blog/studies/database-design/group-by/)를, 요약값으로 묶음을 거르려면 [HAVING](/Hongs_Blog/studies/database-design/having-clause/)을 쓴다.
- 흔한 실수: "급여가 가장 많은 직원의 성"을 `SELECT Lname, MAX(Salary) FROM EMPLOYEE`로 쓴다. `MAX(Salary)`는 8행을 한 행으로 줄이는데 `Lname`은 행마다 값이 달라, 어느 성을 보여 줄지 정해지지 않는다. PostgreSQL 16은 오류로 거부한다. SQLite는 받아 주고 ('Borg', 55000)을 내지만, 같은 꼴인 `SELECT Lname, COUNT(*)`에는 아무 행의 성을 붙여 ('Smith', 8)을 낸다. 가장 큰 값을 안쪽 질의로 먼저 구해 견주는 것이 맞다[^s2].

```sql
SELECT Lname
FROM   EMPLOYEE
WHERE  Salary = ( SELECT MAX(Salary) FROM EMPLOYEE );
```

- 평균, 최댓값 같은 요약값의 뜻과 한계: [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/)의 p2

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)
- 묶음마다 집계하기: [GROUP BY](/Hongs_Blog/studies/database-design/group-by/), [HAVING](/Hongs_Blog/studies/database-design/having-clause/)
- 값 하나를 돌려주는 안쪽 질의: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 기본 집계 함수 다섯 가지를 쓰고, `COUNT(*)`, `COUNT(열)`, `COUNT(DISTINCT 열)`이 각각 무엇을 세는지 쓰라.</summary>

**답:** COUNT, SUM, MAX, MIN, AVG. `COUNT(*)`는 행의 수, `COUNT(열)`은 그 열에 값이 있는(NULL이 아닌) 칸의 수, `COUNT(DISTINCT 열)`은 그 열의 서로 다른 값의 수를 센다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 4번 부서의 직원은 Zelaya(25000), Wallace(43000), Jabbar(25000)다. `SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary) FROM EMPLOYEE WHERE Dno = 4;`의 결과는?</summary>

**답:** 93000, 43000, 25000, 31000.<br>
**이유:** `WHERE`가 먼저 세 행을 고르고, 집계 함수는 그 세 행만 본다. 25000 + 43000 + 25000 = 93000이고 3으로 나누면 31000이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `SELECT Lname, MAX(Salary) FROM EMPLOYEE;`가 "급여가 가장 많은 직원의 성"을 구하는 질의로 맞지 않는 까닭을 쓰고 고쳐라.</summary>

**답:** `MAX(Salary)`는 모든 행을 한 행으로 줄이는데, `Lname`은 행마다 달라 그 한 행에 어느 성을 적을지 정해지지 않는다. PostgreSQL은 오류를 낸다. `SELECT Lname FROM EMPLOYEE WHERE Salary = ( SELECT MAX(Salary) FROM EMPLOYEE );`로 고친다. 결과는 Borg다.<br>
**이유:** 집계 함수의 결과와 한 행의 값은 "몇 행에 대한 값인가"가 서로 다르다. 가장 큰 값을 먼저 값 하나로 구한 뒤, 그 값을 가진 행을 따로 찾아야 한다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.27 (Aggregate Functions: 뜻, COUNT와 SUM·MAX·MIN·AVG, Query 19). 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.10에 다시 나온다.
[^2]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.28 (COUNT Function: Query 21, 22, 23, `*`는 행을 가리킨다, 빨간 글씨의 두 물음)
[^3]: 같은 자료, p.30 (Other Usage of Aggregate Functions: 안쪽 질의에 집계 함수를 쓰는 두 단계, 부양가족이 둘 이상인 직원)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드에는 질의만 있고 결과 값은 없다. Query 19·21·22·23의 값, 두 물음의 답, `AVG(Hours)`와 빈 입력의 동작은 SQLite와 PostgreSQL 16에서 실행해 얻었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 집계 함수와 보통 열을 섞는 실수, 고친 질의, 카드 C2·C3은 슬라이드에 없다. 고친 질의의 꼴은 12주차 풀이 Q3-1(데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices-solution」, p.7)이 쓴 것과 같다. 두 제품의 동작은 실행해 확인했다.
{% endraw %}
