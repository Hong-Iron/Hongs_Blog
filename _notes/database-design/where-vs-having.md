---
layout: "note"
title: "WHERE와 HAVING 비교"
display_title: "WHERE와 HAVING 비교"
kind: "concept"
kind_label: "비교"
num: "71"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["WHERE vs HAVING", "WHERE 대 HAVING", "선택 조건과 그룹 조건"]
description: "둘 다 조건을 걸어 거른다. 가르는 질문은 \"이 조건은 행 하나만 보면 참, 거짓이 정해지는가, 묶음 전체를 봐야 정해지는가\"다. 행 하나로 정해지면 WHERE, 묶음을 봐야 하면 HAVING이다. WHERE는 묶기 전에 쓰이므로, 무엇을 WHERE에 넣느냐에 따라 묶음마다 계산하…"
prev_url: "/studies/database-design/having-clause/"
prev_title: "HAVING"
next_url: "/studies/database-design/order-by-clause-order/"
next_title: "ORDER BY와 질의의 절 순서"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/where-vs-having/"
---
{% raw %}
둘 다 조건을 걸어 거른다. 가르는 질문은 "이 조건은 행 하나만 보면 참, 거짓이 정해지는가, 묶음 전체를 봐야 정해지는가"다. 행 하나로 정해지면 `WHERE`, 묶음을 봐야 하면 `HAVING`이다. `WHERE`는 묶기 전에 쓰이므로, 무엇을 `WHERE`에 넣느냐에 따라 묶음마다 계산하는 값의 대상도 바뀐다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 급여가 30000을 넘는 직원이 부서마다 몇 명인지 센다. (b) 평균 급여가 30000을 넘는 부서마다 직원이 몇 명인지 센다. 조건 "30000 초과"는 각각 어느 절에 가는가? 부서별 급여는 5번 (30000, 40000, 38000, 25000), 4번 (25000, 43000, 25000), 1번 (55000)이다.</summary>

**답:** (a) `WHERE Salary > 30000`. 결과는 (5, 2), (4, 1), (1, 1). (b) `HAVING AVG(Salary) > 30000`. 결과는 (5, 4), (4, 3), (1, 1).<br>
**이유:** (a)의 조건은 직원 한 명의 급여만 보면 정해진다. 걸러진 다섯 행을 묶으므로 세는 대상이 줄어든다. (b)의 조건은 부서 전체의 평균이라 묶은 뒤에야 알 수 있다. 평균이 33250, 31000, 55000으로 모두 넘으니 세 부서가 다 남고, 세는 대상은 전 직원이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "5번 부서가 맡은 프로젝트 가운데 일하는 직원이 둘보다 많은 것"을 구한다. 조건 `Dnum = 5`와 `COUNT(*) > 2`는 각각 어느 절에 가는가?</summary>

**답:** `WHERE Pnumber = Pno AND Dnum = 5`, 그리고 `HAVING COUNT(*) > 2`. 결과는 ProductY(3명) 하나다.<br>
**이유:** `Dnum = 5`는 행 하나(프로젝트 하나)의 값으로 정해진다. 직원 수는 프로젝트로 묶어야 나온다. 5번 부서의 프로젝트 셋(ProductX 2명, ProductY 3명, ProductZ 2명) 가운데 ProductY만 남는다.

</details>


## 결정적 차이

| | WHERE | HAVING |
|---|---|---|
| 거르는 것 | 행 | 묶음 |
| 쓰이는 때 | 묶기 전 | 묶은 뒤 |
| 조건이 보는 것 | 한 행의 열 값 | 집계 함수의 값, 묶는 속성 |
| 집계 함수 | 쓸 수 없다 | 쓸 수 있다 |
| 묶음마다 계산하는 값에 미치는 영향 | 대상 행이 줄어 값이 바뀐다 | 값은 그대로, 묶음만 빠진다 |
| `GROUP BY`가 없을 때 | 쓴다 | 표 전체를 한 묶음으로 본다 |

선택을 가르는 줄은 다섯째다. 같은 "남자 직원"이라도 `WHERE Sex = 'M'`에 적는 순간, 그 뒤의 `COUNT(*)`도 `AVG(Salary)`도 남자 직원만으로 계산된다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 12주차 풀이 Q1-2. "평균 급여가 30000을 넘는 부서마다, 전 직원이 아니라 남자 직원의 수"를 묻는데, 풀이는 Q1-1의 `WHERE`에 `AND Sex = 'M'`만 더하고("Just adding one more condition") 결과로 Research 3, Administration 1, Headquarters 1을 그렸다[^1] / 문제점: 적힌 질의를 돌리면 2행(Research 3, Headquarters 1)이다. `WHERE`가 먼저 남자만 남기므로 `HAVING AVG(Salary) > 30000`의 평균이 남자만의 평균(Research 36000, Administration 25000, Headquarters 55000)이 되어 Administration이 빠진다 / 수정안: 부서를 고르는 조건을 안쪽 질의로 떼어 전 직원의 평균으로 계산한다. `WHERE Dno = Dnumber AND Sex = 'M' AND Dno IN ( SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000 )`. 이 질의의 결과가 그려진 3행이다 / 근거: SQLite와 PostgreSQL 16에서 실행 — [71_where-vs-having_verify.py](/Hongs_Blog/studies/database-design/code/71_where-vs-having_verify/), [71_where-vs-having_verify.sql](/Hongs_Blog/studies/database-design/code/71_where-vs-having_verify-sql/)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 카드 C1~C3의 결과, Q1-2의 2행과 3행, 남자만의 평균 — [71_where-vs-having_verify.py](/Hongs_Blog/studies/database-design/code/71_where-vs-having_verify/), [71_where-vs-having_verify.sql](/Hongs_Blog/studies/database-design/code/71_where-vs-having_verify-sql/). 풀이의 질의는 `GROUP BY Dno`에 `SELECT Dname`이라 PostgreSQL 16에서는 그대로 돌지 않는다. 묶는 속성에 `Dname`을 더해 돌렸다([GROUP BY](/Hongs_Blog/studies/database-design/group-by/)).</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "평균 급여가 30000을 넘는 부서마다 남자 직원의 수"는 `WHERE`와 `HAVING`을 한 질의에 나란히 적어서는 구할 수 없다. 까닭과 쓸 수 있는 방법을 쓰라.</summary>

**답:** 묶음 조건(평균 30000 초과)은 부서의 전 직원으로 계산해야 하고, 세는 대상은 남자 직원만이어야 한다. 한 질의에서는 `WHERE`가 거른 행으로 묶음을 만들기 때문에 두 대상을 따로 둘 수 없다. 묶음 조건을 안쪽 질의로 떼어 "평균이 30000을 넘는 부서의 번호"를 먼저 구하고, 바깥에서 `Dno IN ( … )`으로 견준다([중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)). 결과는 Research 3, Administration 1, Headquarters 1이다.<br>
**이유:** 질의 한 덩어리에는 "어느 행으로 묶음을 만드는가"가 하나뿐이다. 조건마다 대상 행이 다르면 덩어리를 둘로 나눠야 한다.

</details>


[^1]: 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices-solution」, p.2 (Q1-2의 풀이와 결과 표), p.1 (Q1-1의 풀이). 문제는 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.15
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드에는 두 절을 나란히 견준 표가 없다. 표는 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.33~34의 HAVING 설명과 12주차 풀이 p.1~2를 견주어 만들었다. 카드의 상황과 결과, 수정안의 질의(Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Grouping: The GROUP BY and HAVING Clauses"에 같은 꼴의 예가 있다)는 실행해 확인했다.
{% endraw %}
