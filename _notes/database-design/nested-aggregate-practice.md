---
layout: "note"
title: "중첩 질의·집계 연습"
display_title: "중첩 질의·집계 연습"
kind: "practice"
kind_label: "연습"
num: "70"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: EXISTS와 NOT EXISTS, 집계 함수, FROM 절의 조인 (JOIN ON), GROUP BY, HAVING."
prev_url: "/studies/database-design/complex-retrieval-practice/"
prev_title: "복잡한 검색 연습"
next_url: "/studies/database-design/advanced-sql-practice/"
next_title: "JOIN·GROUP BY 종합 연습"
math: false
mermaid: false
code_count: 4
permalink: "/studies/database-design/nested-aggregate-practice/"
---
{% raw %}
사용 개념: [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/), [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/), [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/), [GROUP BY](/Hongs_Blog/studies/database-design/group-by/), [HAVING](/Hongs_Blog/studies/database-design/having-clause/).

문제 셋 다 COMPANY 데이터베이스에 묻는다. 전체 상태는 [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 있고, 여기서 쓰는 열만 옮기면 이렇다.

EMPLOYEE (8행)

| Lname | Ssn | Salary | Dno |
|---|---|---|---|
| Smith | 123456789 | 30000 | 5 |
| Wong | 333445555 | 40000 | 5 |
| Zelaya | 999887777 | 25000 | 4 |
| Wallace | 987654321 | 43000 | 4 |
| Narayan | 666884444 | 38000 | 5 |
| English | 453453453 | 25000 | 5 |
| Jabbar | 987987987 | 25000 | 4 |
| Borg | 888665555 | 55000 | 1 |

DEPARTMENT (3행)

| Dname | Dnumber | Mgr_ssn |
|---|---|---|
| Research | 5 | 333445555 |
| Administration | 4 | 987654321 |
| Headquarters | 1 | 888665555 |

DEPENDENT (7행)

| Essn | Dependent_name |
|---|---|
| 333445555 | Alice, Theodore, Joy |
| 987654321 | Abner |
| 123456789 | Michael, Alice, Elizabeth |

DEPENDENT는 부양가족 한 명이 한 행이다. 위 표는 같은 `Essn`의 이름을 한 줄에 모아 적었다.

말로 된 질문을 질의로 옮길 때는 같은 차례로 묻는다. ① 어느 표가 필요한가 ② 표끼리 어느 열로 잇는가 ③ 행 하나만 보고 거를 조건은 무엇인가 ④ 묶어야 하는가, 묶음에 거는 조건은 무엇인가 ⑤ 무엇을 보여 주는가[^s1].

## 문제 p1 · 부양가족이 있는 관리자

안쪽 질의 둘을 써서 다음을 SQL로 적어라. "부양가족이 적어도 한 명 있는 관리자의 이름을 구하라." 첫째 안쪽 질의는 그 직원에게 딸린 DEPENDENT의 행을 모두 고르고, 둘째 안쪽 질의는 그 직원이 관리하는 DEPARTMENT의 행을 모두 고른다.

풀이 전략: "~가 적어도 하나 있다"는 `EXISTS`다. 조건이 둘("부양가족이 있다", "관리자다")이고 둘 다 "딸린 행이 있는가"를 묻는다. 직원을 한 명 짚었다고 치고, 그 직원의 `Ssn`으로 다른 표를 찾아보는 안쪽 질의를 하나씩 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *"부양가족이 있다":* DEPENDENT에서 `Essn`이 이 직원의 `Ssn`인 행이 있다. `EXISTS ( SELECT * FROM DEPENDENT WHERE Ssn = Essn )`.
2. *"관리자다":* DEPARTMENT에서 `Mgr_ssn`이 이 직원의 `Ssn`인 행이 있다. `EXISTS ( SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn )`.
3. *둘을 잇기:* 둘 다 참이어야 하므로 `AND`.

```sql
SELECT Fname, Lname
FROM   EMPLOYEE
WHERE  EXISTS ( SELECT *
                FROM   DEPENDENT
                WHERE  Ssn = Essn )
       AND
       EXISTS ( SELECT *
                FROM   DEPARTMENT
                WHERE  Ssn = Mgr_ssn );
```

{: start="4"}
4. *돌려 보기:* 부양가족이 있는 직원은 Smith, Wong, Wallace다. 관리자는 Wong(5번), Wallace(4번), Borg(1번)다. 둘 다인 사람은 **Franklin Wong, Jennifer Wallace**다.

흔한 오답은 안쪽 질의에서 `Ssn = Essn`을 빠뜨리는 것이다. 그러면 "DEPENDENT에 행이 있는가"가 되어 모든 직원에게 참이 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 답의 질의, `IN` 둘로 쓴 판, 조인으로 쓴 판이 모두 Wong과 Wallace를 낸다 — [70_nested-aggregate-practice_p1.py](/Hongs_Blog/studies/database-design/code/70_nested-aggregate-practice_p1/)</div>

</div>


변형: 부양가족이 한 명도 없는 관리자의 이름을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

첫째 `EXISTS`를 `NOT EXISTS`로 바꾼다. 결과는 James Borg다. 같은 답을 조인으로 쓰면 `SELECT DISTINCT`가 필요하다. 문제 p1을 조인으로 쓴 `FROM (EMPLOYEE AS E JOIN DEPARTMENT AS D ON E.Ssn = D.Mgr_ssn) JOIN DEPENDENT AS P ON E.Ssn = P.Essn`은 Wong이 부양가족 수만큼 3번 나와 4행이 되기 때문이다[^s1].

</details>


## 문제 p2 · 한 부서의 급여 요약

집계 함수와 JOIN 절을 써서 다음을 SQL로 적어라. "Research 부서 모든 직원의 급여의 합, 가장 큰 급여, 가장 작은 급여, 평균 급여를 구하라."

풀이 전략: 부서 이름은 DEPARTMENT에, 급여는 EMPLOYEE에 있으니 두 표를 이어야 한다. 이은 뒤 Research인 행만 남기고, 남은 행 전체를 한 줄로 줄인다. 부서 하나만 묻기 때문에 묶을 필요는 없다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *표 고르고 잇기:* 직원의 `Dno`가 부서의 `Dnumber`를 가리킨다. `FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)`.
2. *행 거르기:* `WHERE Dname = 'Research'`. Smith(30000), Wong(40000), Narayan(38000), English(25000) 네 행이 남는다.
3. *한 줄로 줄이기:* `SUM`, `MAX`, `MIN`, `AVG`를 `Salary`에 쓴다.

```sql
SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary)
FROM   (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)
WHERE  Dname = 'Research';
```

{: start="4"}
4. *돌려 보기:* 합 30000 + 40000 + 38000 + 25000 = **133000**, 최대 **40000**, 최소 **25000**, 평균 133000 ÷ 4 = **33250**.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: (133000, 40000, 25000, 33250). 잇는 조건을 `WHERE`에 적은 판도 같다 — [70_nested-aggregate-practice_p2.py](/Hongs_Blog/studies/database-design/code/70_nested-aggregate-practice_p2/)</div>

</div>


변형: Administration 부서로 바꾸면? (답: 93000, 43000, 25000, 31000.)

## 문제 p3 · 평균 급여가 높은 부서의 인원

다음을 SQL로 적어라. "평균 급여가 30000을 넘는 부서마다 부서 이름과 그 부서에서 일하는 직원의 수를 구하라."

풀이 전략: "부서마다"가 묶는 속성을 알려 준다. "평균 급여가 30000을 넘는"은 직원 한 명을 봐서는 알 수 없고 부서 전체를 봐야 아는 조건이라 `HAVING`에 간다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *표 고르고 잇기:* 부서 이름이 필요하므로 EMPLOYEE와 DEPARTMENT를 `E.Dno = D.Dnumber`로 잇는다.
2. *묶기:* 부서마다이므로 부서 번호로 묶는다. `SELECT`에 `Dname`을 적을 것이므로 `Dname`도 묶는 속성에 넣는다. `GROUP BY E.Dno`만 쓰면 PostgreSQL 16은 `column "d.dname" must appear in the GROUP BY clause or be used in an aggregate function` 오류로 거부한다. SQLite는 받아서 같은 답을 낸다.
3. *묶음 조건:* `HAVING AVG(E.Salary) > 30000`.
4. *보여 줄 것:* `Dname`과 `COUNT(*)`.

```sql
SELECT   Dname, COUNT(*)
FROM     EMPLOYEE AS E, DEPARTMENT AS D
WHERE    E.Dno = D.Dnumber
GROUP BY E.Dno, D.Dname
HAVING   AVG(E.Salary) > 30000;
```

{: start="5"}
5. *돌려 보기:* 부서별 평균은 Research 33250, Administration 31000, Headquarters 55000이다. 셋 다 30000을 넘어 **Research 4, Administration 3, Headquarters 1**이 나온다.

</details>



변형: 문턱을 32000으로 올리면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

Administration의 평균 31000이 문턱에 못 미쳐 묶음이 통째로 빠진다. 결과는 Research 4, Headquarters 1이다. 남은 묶음의 직원 수는 그대로다. `HAVING`은 묶음을 버릴 뿐 묶음 안의 행을 건드리지 않는다([WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/))[^s1].

</details>


[^s1]: 값은 문제 코드로 실행해 확인했다.
{% endraw %}
