---
layout: "note"
title: "GROUP BY 질의 쓰기 예제 사다리"
display_title: "GROUP BY 질의 쓰기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: GROUP BY, 집계 함수, HAVING. 표와 행은 COMPANY다(관계형 데이터베이스 스키마와 상태)."
prev_url: "/studies/database-design/join-query-ladder/"
prev_title: "조인 질의 쓰기 예제 사다리"
next_url: "/studies/database-design/complex-retrieval-practice/"
next_title: "복잡한 검색 연습"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/group-by-query-ladder/"
---
{% raw %}
사용 개념: [GROUP BY](/Hongs_Blog/studies/database-design/group-by/), [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/), [HAVING](/Hongs_Blog/studies/database-design/having-clause/). 표와 행은 COMPANY다([관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)).

"~마다 ~를 구하라"는 문제는 같은 하위목표의 되풀이다[^s1].

① **묶는 열 정하기.** 결과의 한 줄이 무엇 하나를 뜻하는지 정한다. "부서마다"면 부서를 가려내는 열이 묶는 열이다.
② **묶기 전에 버릴 행 정하기.** 행 하나만 보고 알 수 있는 조건은 `WHERE`에 쓴다.
③ **묶음마다 낼 값과 묶음에 거는 조건 정하기.** 세거나 더하거나 평균 낼 값은 집계 함수로 쓴다. 집계한 값에 거는 조건은 `HAVING`에 쓴다.
④ **조립하고 결과 내기.** `SELECT`에는 묶는 열과 집계 함수만 쓴다.

## 문제 1 · 완전한 풀이

부서마다 부서 번호, 그 부서의 직원 수, 평균 급여를 구하라.

1. *묶는 열 정하기:* 한 줄이 부서 하나다. EMPLOYEE의 `Dno`로 묶는다.
2. *묶기 전에 버릴 행 정하기:* 없다. 모든 직원을 센다.
3. *묶음마다 낼 값과 묶음에 거는 조건 정하기:* 직원 수는 `COUNT (*)`, 평균 급여는 `AVG (Salary)`. 묶음에 거는 조건은 없다.
4. *조립하고 결과 내기:*

```sql
SELECT   Dno, COUNT (*), AVG (Salary)
FROM     EMPLOYEE
GROUP BY Dno;
```

| Dno | COUNT (*) | AVG (Salary) |
|---|---|---|
| 5 | 4 | 33250 |
| 4 | 3 | 31000 |
| 1 | 1 | 55000 |

직원 여덟 명이 `Dno` 값에 따라 겹치지 않는 세 묶음으로 나뉘고, 묶음마다 한 줄이 나온다. 5번 부서의 평균은 (30000 + 40000 + 38000 + 25000) ÷ 4 = 33250이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [70_group-by-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/70_group-by-query-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

성별마다 직원 수와 가장 많은 급여를 구하라.

1. *묶는 열 정하기:* 한 줄이 성별 하나다. `Sex`.
2. *묶기 전에 버릴 행 정하기:* 없다.
3. *묶음마다 낼 값과 묶음에 거는 조건 정하기:* `COUNT (*)`와 `MAX (Salary)`. 묶음에 거는 조건은 없다.
4. *조립하고 결과 내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT   Sex, COUNT (*), MAX (Salary)
FROM     EMPLOYEE
GROUP BY Sex;
```
(M, 5, 55000), (F, 3, 43000). 남자 다섯 가운데 가장 많이 받는 사람은 Borg, 여자 셋 가운데는 Wallace다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

프로젝트마다 프로젝트 이름, 일하는 직원 수, 일한 시간의 합을 구하라. 시간의 합이 40을 넘는 프로젝트만 보인다.

1. *묶는 열 정하기:* 한 줄이 프로젝트 하나다. 이름은 PROJECT에, 일한 기록은 WORKS_ON에 있으니 두 표를 `Pnumber = Pno`로 잇고 `Pnumber, Pname`으로 묶는다. `Pname`을 `SELECT`에 쓰려면 묶는 열에도 적어야 한다.
2. *묶기 전에 버릴 행 정하기:* 없다. 조인 조건만 있다.
3. *묶음마다 낼 값과 묶음에 거는 조건 정하기:* ______
4. *조립하고 결과 내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 직원 수는 `COUNT (*)`, 시간의 합은 `SUM (Hours)`. "시간의 합이 40을 넘는"은 더한 뒤의 값에 거는 조건이라 `HAVING SUM (Hours) > 40`이다.<br>
4.
```sql
SELECT   Pname, COUNT (*), SUM (Hours)
FROM     PROJECT, WORKS_ON
WHERE    Pnumber = Pno
GROUP BY Pnumber, Pname
HAVING   SUM (Hours) > 40;
```

| Pname | COUNT (*) | SUM (Hours) |
|---|---|---|
| ProductX | 2 | 52.5 |
| ProductZ | 2 | 50.0 |
| Computerization | 3 | 55.0 |
| Newbenefits | 3 | 55.0 |

ProductY(37.5)와 Reorganization(25.0)이 빠진다. 조건을 `WHERE Hours > 40`으로 쓰면 뜻이 달라진다. "한 사람이 한 프로젝트에서 40시간 넘게 일한 기록만 남겨라"가 되고, 그런 기록이 없어 결과가 빈다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [70_group-by-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/70_group-by-query-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

급여가 30000 이상인 직원이 2명 이상 있는 부서의 이름과, 그런 직원의 수를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT   Dname, COUNT (*)
FROM     EMPLOYEE, DEPARTMENT
WHERE    Dno = Dnumber AND Salary >= 30000
GROUP BY Dnumber, Dname
HAVING   COUNT (*) >= 2;
```
(Research, 3) 한 줄이다.

조건이 둘이고 자리가 다르다. "급여가 30000 이상"은 직원 한 명만 보면 아는 조건이라 `WHERE`에, "그런 직원이 2명 이상"은 센 뒤에야 아는 조건이라 `HAVING`에 간다. `WHERE`를 지난 직원은 Smith, Wong, Narayan(5번 부서), Wallace(4번), Borg(1번)다. 묶으면 (Research, 3), (Administration, 1), (Headquarters, 1)이고 `HAVING`이 뒤의 둘을 버린다.

흔한 오답은 급여 조건을 빼먹는 것이다. `WHERE`에 조인 조건만 두면 `COUNT (*)`가 부서의 모든 직원을 세어 (Research, 4), (Administration, 3)이 나온다. 인원 조건을 `WHERE COUNT (*) >= 2`로 쓰면 오류다. `WHERE`는 묶기 전에 일해서 센 값이 아직 없다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [70_group-by-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/70_group-by-query-ladder_p4/)</div>

</div>


[^s1]: 모든 답은 SQLite 3.50.4에서 실행해 확인했다.
{% endraw %}
