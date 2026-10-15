---
layout: "note"
title: "중첩 질의 쓰기 예제 사다리"
display_title: "중첩 질의 쓰기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "62"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 중첩 질의와 IN, EXISTS와 NOT EXISTS, 값 하나를 내는 집계 함수. 표와 행은 COMPANY다(관계형 데이터베이스 스키마와 상태)."
prev_url: "/studies/database-design/basic-select-practice/"
prev_title: "기본 검색 연습"
next_url: "/studies/database-design/join-query-ladder/"
next_title: "조인 질의 쓰기 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/nested-query-ladder/"
---
{% raw %}
사용 개념: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/), [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/), 값 하나를 내는 [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/). 표와 행은 COMPANY다([관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)).

"질의 안에 질의를 넣어 풀어라"는 문제는 같은 하위목표의 되풀이다[^s1].

① **바깥 질의 정하기.** 답으로 내놓을 열이 무엇이고 어느 표에 있는지 적는다.
② **안쪽 질의 정하기.** 바깥의 행을 고르는 데 필요한 값을 따로 뽑는 질의를 쓴다. 혼자 돌려 결과를 본다.
③ **잇는 말 고르기.** 안쪽 결과가 값 여러 개면 `IN`, 값 딱 하나면 `=`이나 `>` 같은 비교, "있다·없다"만 필요하면 `EXISTS`·`NOT EXISTS`를 쓴다.
④ **조립하고 결과 내기.**

## 문제 1 · 완전한 풀이

성이 'Smith'인 직원이 직원으로 일하거나, 그 프로젝트를 맡은 부서의 부서장으로 관여하는 프로젝트의 번호를 모두 구하라.

1. *바깥 질의 정하기:* 프로젝트 번호다. PROJECT의 `Pnumber`. 같은 번호가 두 번 나오지 않게 `DISTINCT`를 붙인다.
2. *안쪽 질의 정하기:* 둘이 필요하다.
    - 부서장으로: `SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith'`. 혼자 돌리면 0행이다. Smith는 부서장이 아니다.
    - 직원으로: `SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith'`. 혼자 돌리면 1, 2다.
3. *잇는 말 고르기:* 둘 다 값이 여러 개일 수 있는 목록이다. `IN`을 쓰고, "이거나"이므로 두 조건을 `OR`로 잇는다.
4. *조립하고 결과 내기:*

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

답은 1, 2다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [62_nested-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/62_nested-query-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

회사 전체의 평균 급여보다 많이 받는 직원의 성과 급여를 구하라.

1. *바깥 질의 정하기:* EMPLOYEE의 `Lname`, `Salary`.
2. *안쪽 질의 정하기:* `SELECT AVG(Salary) FROM EMPLOYEE`. 혼자 돌리면 35125 하나다. 여덟 명의 급여 합 281000을 8로 나눈 값이다.
3. *잇는 말 고르기:* 안쪽 결과가 값 하나다. 비교 연산자 `>`를 쓴다.
4. *조립하고 결과 내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT Lname, Salary
FROM   EMPLOYEE
WHERE  Salary > ( SELECT AVG(Salary) FROM EMPLOYEE );
```
Wong 40000, Wallace 43000, Narayan 38000, Borg 55000. 네 명이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

부양가족이 한 명도 없는 부서장의 성을 구하라.

1. *바깥 질의 정하기:* EMPLOYEE의 `Lname`.
2. *안쪽 질의 정하기:* ______ (둘이 필요하다)
3. *잇는 말 고르기:* 부서장 "가운데 한 사람"이어야 하니 한쪽은 `IN`이다. 부양가족이 "없다"만 알면 되니 다른 쪽은 `NOT EXISTS`다.
4. *조립하고 결과 내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 부서장의 Ssn 목록: `SELECT Mgr_ssn FROM DEPARTMENT`. 혼자 돌리면 333445555(Wong), 987654321(Wallace), 888665555(Borg)다. 그 직원의 부양가족: `SELECT * FROM DEPENDENT WHERE Essn = Ssn`. 여기서 `Ssn`은 바깥 질의가 지금 보고 있는 직원의 것이라, 바깥 행마다 다시 계산된다.<br>
4.
```sql
SELECT Lname
FROM   EMPLOYEE
WHERE  Ssn IN ( SELECT Mgr_ssn FROM DEPARTMENT )
  AND  NOT EXISTS ( SELECT * FROM DEPENDENT WHERE Essn = Ssn );
```
답은 Borg 한 명이다. Wong은 부양가족이 셋, Wallace는 하나 있다. `NOT EXISTS`를 `EXISTS`로 바꾸면 Wong과 Wallace가 나온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [62_nested-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/62_nested-query-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

**자기 부서의** 평균 급여보다 많이 받는 직원의 성과 급여를 구하라. 문제 2의 답과 무엇이 달라지는지, 왜 달라지는지 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT E.Lname, E.Salary
FROM   EMPLOYEE AS E
WHERE  E.Salary > ( SELECT AVG(X.Salary)
                    FROM   EMPLOYEE AS X
                    WHERE  X.Dno = E.Dno );
```
Wong 40000, Narayan 38000, Wallace 43000. 세 명이다. 부서별 평균은 5번 33250, 4번 31000, 1번 55000이다.

문제 2의 답에 있던 Borg가 빠진다. Borg는 회사 평균 35125보다는 많이 받지만, 1번 부서에는 자기 혼자라 부서 평균이 자기 급여 55000이다. 55000 > 55000은 거짓이다.

안쪽 질의가 바깥 직원의 부서(`E.Dno`)를 쓰므로, 견줄 평균이 직원마다 달라진다. 이때 별칭이 꼭 필요하다. 별칭 없이 `WHERE Dno = Dno`라고 쓰면 두 `Dno`가 모두 안쪽 EMPLOYEE의 것으로 읽혀 늘 참이 된다. 그러면 안쪽 질의가 회사 전체 평균을 내서 문제 2의 네 명이 나온다. 오류 없이 틀린 답이 나오는 것이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [62_nested-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/62_nested-query-ladder_p4/)</div>

</div>


[^s1]: 모든 답은 SQLite 3.50.4에서 실행해 확인했다.
{% endraw %}
