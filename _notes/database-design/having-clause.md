---
layout: "note"
title: "HAVING"
display_title: "HAVING"
kind: "concept"
kind_label: "정의"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["HAVING", "HAVING 절", "그룹 조건", "Group Condition", "묶음 조건"]
description: "프로젝트마다 일하는 사람 수를 센 뒤 \"세 명 이상인 프로젝트만\" 보고 싶다면, 묶음을 다 만든 다음 묶음 단위로 한 번 더 걸러야 한다. 행을 하나씩 거르는 조건은 묶기 전에 쓰이므로 \"이 묶음에 몇 행이 있는가\" 같은 값을 볼 수 없다. 묶음마다 계산한 값으로 묶음을 통째로 남…"
prev_url: "/studies/database-design/group-by/"
prev_title: "GROUP BY"
next_url: "/studies/database-design/where-vs-having/"
next_title: "WHERE와 HAVING 비교"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "70_having-clause_verify.py", "u": "/studies/database-design/code/70_having-clause_verify/", "r": "검증"}, {"t": "70_having-clause_verify.sql", "u": "/studies/database-design/code/70_having-clause_verify-sql/", "r": "검증"}]
permalink: "/studies/database-design/having-clause/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로젝트마다 일하는 사람 수를 센 뒤 "세 명 이상인 프로젝트만" 보고 싶다면, 묶음을 다 만든 다음 묶음 단위로 한 번 더 걸러야 한다. 행을 하나씩 거르는 조건은 묶기 전에 쓰이므로 "이 묶음에 몇 행이 있는가" 같은 값을 볼 수 없다. 묶음마다 계산한 값으로 묶음을 통째로 남기거나 버리는 조건이 HAVING이다. 묶음 안의 행 몇 개만 골라내지는 못한다.

</div>


## 예시로 보기

[GROUP BY](/Hongs_Blog/studies/database-design/group-by/)로 프로젝트마다 일하는 직원 수를 구했다. 여기서 "직원이 둘보다 많은 프로젝트만" 남기려 한다. `WHERE COUNT(*) > 2`라고 쓰고 싶지만, `WHERE`는 묶기 전에 행을 하나씩 보는 자리라 묶음의 행 수를 알 수 없다. 묶은 뒤에 거르는 자리가 따로 있다.

```sql
SELECT   Pnumber, Pname, COUNT(*)
FROM     PROJECT, WORKS_ON
WHERE    Pnumber = Pno
GROUP BY Pnumber, Pname
HAVING   COUNT(*) > 2;
```

| Pnumber | Pname | 묶음의 행 수 | `HAVING COUNT(*) > 2` |
|---|---|---|---|
| 1 | ProductX | 2 | 버린다 |
| 2 | ProductY | 3 | 남긴다 |
| 3 | ProductZ | 2 | 버린다 |
| 10 | Computerization | 3 | 남긴다 |
| 20 | Reorganization | 3 | 남긴다 |
| 30 | Newbenefits | 3 | 남긴다 |

행이 둘뿐인 ProductX와 ProductZ의 묶음이 통째로 빠지고, 결과는 ProductY, Computerization, Reorganization, Newbenefits 4행이다(모두 3).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 시간 합이 40을 넘는 프로젝트(1, 3, 10, 30), `WHERE`에 쓴 집계 함수의 오류, `HAVING Dno > 1`, `GROUP BY` 없는 `HAVING`, 카드 C2. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다. 묶지 않은 열을 쓴 `HAVING Salary > 30000`만 다르다(PostgreSQL은 오류, SQLite는 받는다) — [70_having-clause_verify.py](/Hongs_Blog/studies/database-design/code/70_having-clause_verify/), [70_having-clause_verify.sql](/Hongs_Blog/studies/database-design/code/70_having-clause_verify-sql/)</div>

</div>


## 정의

`HAVING` 절은 묶음을 요약한 값에 조건을 건다. 조건이 참인 묶음만 결과에 나온다. `GROUP BY` 절과 함께 쓴다.

```
GROUP BY 묶는 속성
HAVING   묶음 조건
```

기호로 쓰면, 묶음을 $$G_1, \dots, G_m$$, 묶음 조건을 $$c$$라 할 때 결과에 남는 묶음은 $$\{\,G_i : c(G_i)\text{가 참}\,\}$$이다. $$c(G_i)$$는 "묶음 $$G_i$$ 전체를 보고 계산한 참, 거짓"으로 읽는다. 조건이 행이 아니라 묶음을 받는다는 점이 `WHERE`와 다르다.

`HAVING`에 쓸 수 있는 것은 `SELECT`에 쓸 수 있는 것과 같다. 묶음마다 값이 하나로 정해지는 것, 곧 집계 함수와 묶는 속성이다[^s1].

| 조건 | 되는가 | 까닭 |
|---|---|---|
| `HAVING COUNT(*) > 2` | 된다 | 집계 함수는 묶음을 값 하나로 줄인다 |
| `HAVING SUM(Hours) > 40` | 된다 | `SELECT`에 적지 않은 집계 함수도 쓸 수 있다 |
| `HAVING Dno > 1` (`Dno`로 묶었을 때) | 된다 | 묶는 속성은 묶음 안에서 값이 같다 |
| `HAVING Salary > 30000` (`Dno`로 묶었을 때) | PostgreSQL 16은 오류, SQLite는 받는다 | `Salary`는 묶음 안에서 행마다 다르다 |

거꾸로 `WHERE`에는 집계 함수를 쓸 수 없다. `WHERE COUNT(*) > 2`는 PostgreSQL에서 "aggregate functions are not allowed in WHERE", SQLite에서 "misuse of aggregate" 오류다[^s1].

## 예제

**일한 시간의 합이 40을 넘는 프로젝트의 번호와 합을 구하라.**[^s1]

1. *묶는 속성:* "프로젝트마다"이므로 `Pno`.
2. *묶음마다 구할 값:* `SUM(Hours)`.
3. *묶음 조건:* 합이 40을 넘어야 하므로 `HAVING SUM(Hours) > 40`.
4. *질의:* `SELECT Pno, SUM(Hours) FROM WORKS_ON GROUP BY Pno HAVING SUM(Hours) > 40;`

| Pno | SUM(Hours) | 남는가 |
|---|---|---|
| 1 | 52.5 | 남는다 |
| 2 | 37.5 | 빠진다 |
| 3 | 50.0 | 남는다 |
| 10 | 55.0 | 남는다 |
| 20 | 25.0 | 빠진다 |
| 30 | 55.0 | 남는다 |

프로젝트 20의 합 25.0은 시간이 적힌 두 행(10.0, 15.0)만 더한 값이다. NULL인 행은 합에서 빠진다.

## 활용

- 문제 글의 신호는 "~가 … 이상인 부서만", "평균이 …를 넘는 ~에 대해"처럼 묶음의 요약값에 거는 조건이다.
- `GROUP BY` 없이 `HAVING`만 쓰면 표 전체가 한 묶음이다. `SELECT COUNT(*) FROM EMPLOYEE HAVING COUNT(*) > 5`는 8을 한 행으로 내고, `> 10`으로 바꾸면 0행이다[^s1].
- 행에 거는 조건과 섞일 때의 가르기: [WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/)
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/)의 p3, [복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/)의 p1, [GROUP BY 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/group-by-query-ladder/)

## 연결

- 선수: [GROUP BY](/Hongs_Blog/studies/database-design/group-by/)
- 헷갈리는 짝: [WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/)
- 여섯 절 가운데 `HAVING`이 놓이는 자리: [ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `HAVING` 절이 하는 일을 쓰고, 조건에 쓸 수 있는 두 가지를 쓰라.</summary>

**답:** 묶음을 요약한 값에 조건을 걸어, 조건이 참인 묶음만 결과에 남긴다. 조건에는 집계 함수와 묶는 속성을 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 부서별 직원 수는 5번 4명, 4번 3명, 1번 1명이다. `SELECT Dno, COUNT(*) FROM EMPLOYEE GROUP BY Dno HAVING COUNT(*) >= 3;`의 결과는?</summary>

**답:** (5, 4), (4, 3).<br>
**이유:** 세 묶음 가운데 행 수가 3 이상인 것은 5번과 4번이다. 1번 묶음(Borg 한 명)은 통째로 빠진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "직원이 둘보다 많은 프로젝트"를 구하면서 `WHERE COUNT(*) > 2`라고 쓰면 오류가 난다. 까닭을 질의가 돌아가는 차례로 설명하라.</summary>

**답:** `WHERE`는 묶기 전에 행을 하나씩 보고 남길지 정한다. 그때는 묶음이 아직 없어서 "묶음의 행 수"라는 값이 없다. 묶음이 만들어진 뒤에 쓰이는 `HAVING`에 적어야 한다.<br>
**흔한 오답:** "`COUNT`는 `SELECT`에서만 쓸 수 있어서"라고 답하는 것. `HAVING`에서도 쓸 수 있다. 문제는 자리가 아니라 차례다.

</details>


[^s1]: 값과 오류는 SQLite와 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
