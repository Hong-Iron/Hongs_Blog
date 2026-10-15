---
layout: "note"
title: "GROUP BY"
display_title: "GROUP BY"
kind: "concept"
kind_label: "정의"
num: "69"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["GROUP BY", "Grouping", "그룹화", "묶기", "그룹화 속성", "Grouping Attribute", "그룹", "Group"]
description: "회사 전체의 평균 급여가 아니라 \"부서마다\" 평균 급여를 알고 싶으면, 직원 명단을 부서 번호가 같은 사람끼리 묶은 뒤 묶음마다 따로 평균을 내면 된다. 어느 열의 값이 같은 행끼리 묶을지 적어 주면 묶음 하나가 결과의 한 줄이 된다. 묶음이 한 줄로 줄어들기 때문에, 결과에 적을…"
prev_url: "/studies/database-design/aggregate-functions/"
prev_title: "집계 함수"
next_url: "/studies/database-design/having-clause/"
next_title: "HAVING"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/group-by/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

회사 전체의 평균 급여가 아니라 "부서마다" 평균 급여를 알고 싶으면, 직원 명단을 부서 번호가 같은 사람끼리 묶은 뒤 묶음마다 따로 평균을 내면 된다. 어느 열의 값이 같은 행끼리 묶을지 적어 주면 묶음 하나가 결과의 한 줄이 된다. 묶음이 한 줄로 줄어들기 때문에, 결과에 적을 수 있는 것은 묶는 데 쓴 열과 묶음마다 값이 하나로 정해지는 계산뿐이다. 묶음 안에서 사람마다 다른 값을 그냥 적으면 어느 사람의 값을 보여 줄지 정할 수 없다.

</div>


## 예시로 보기

[집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/)만으로 부서마다 평균 급여를 구하려면 `WHERE Dno = 5`, `WHERE Dno = 4`, `WHERE Dno = 1`로 질의를 세 번 써야 한다. 부서가 100개면 100번이고, 부서가 새로 생기면 질의도 새로 써야 한다. `GROUP BY`는 이 일을 한 번에 한다.

```sql
SELECT   Dno, COUNT(*), AVG(Salary)
FROM     EMPLOYEE
GROUP BY Dno;
```

EMPLOYEE의 8행을 `Dno` 값이 같은 것끼리 나누면 세 묶음이 된다. 묶음마다 행을 세고 급여의 평균을 낸다.

| 묶음 (`Dno`) | 묶음에 든 직원과 급여 | `COUNT(*)` | `AVG(Salary)` |
|---|---|---|---|
| 5 | Smith 30000, Wong 40000, Narayan 38000, English 25000 | 4 | 33250 |
| 4 | Zelaya 25000, Wallace 43000, Jabbar 25000 | 3 | 31000 |
| 1 | Borg 55000 | 1 | 55000 |

결과는 (5, 4, 33250), (4, 3, 31000), (1, 1, 55000) 3행이다. 8행이 3행으로 줄었다. 묶음 하나가 결과의 한 행이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표와 묶음의 구성원, 프로젝트마다 묶은 여섯 묶음(2, 3, 2, 3, 3, 3), 프로젝트 20의 `COUNT(*)` 3과 `COUNT(Hours)` 2, `Sex`로 묶은 2행과 (`Dno`, `Sex`)로 묶은 5행, NULL 묶음, 카드 C2. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다. 묶지 않은 열을 `SELECT`에 쓴 질의는 다르다(PostgreSQL은 오류, SQLite는 받는다) — [69_group-by_verify.py](/Hongs_Blog/studies/database-design/code/69_group-by_verify/), [69_group-by_verify.sql](/Hongs_Blog/studies/database-design/code/69_group-by_verify-sql/)</div>

</div>


## 정의

묶기(grouping)는 표의 행을 서로 겹치지 않는 부분들로 나누는 일이다. 나뉜 부분 하나를 묶음(group)이라 한다. 묶는 기준이 되는 열을 묶는 속성(grouping attribute)이라 하고 `GROUP BY` 절에 적는다. 묶는 속성의 값이 같은 행끼리 한 묶음이 된다. 집계 함수는 묶음마다 따로 계산된다.

기호로 쓰면, 표의 상태를 $$r$$, 묶는 속성을 $$A$$라 할 때 값 $$v$$의 묶음은 $$G_v = \{\,t \in r : t[A] = v\,\}$$다. $$t \in r$$은 "$$t$$가 표의 행 가운데 하나", $$t[A]$$는 "행 $$t$$의 $$A$$ 칸에 든 값"으로 읽는다. 결과에는 $$A$$에 실제로 나오는 값 $$v$$마다 행이 하나씩 있다. "$$A$$의 값이 같다"는 행들을 겹치지 않게 빠짐없이 나누는 관계다([동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)).

질의가 돌아가는 차례는 넷이다.

1. *행 만들기:* `FROM`과 `WHERE`로 행을 만든다. 표가 여럿이면 여기서 잇는다.
2. *나누기:* 묶는 속성의 값이 같은 행끼리 묶음으로 나눈다.
3. *묶음마다 계산하기:* 묶음 하나하나에 집계 함수를 쓴다.
4. *한 줄씩 내기:* 묶음마다 결과 행 하나를 낸다.

### 이은 표를 묶기

"프로젝트마다 번호, 이름, 그 프로젝트에서 일하는 직원의 수를 구하라."

```sql
SELECT   Pnumber, Pname, COUNT(*)
FROM     PROJECT, WORKS_ON
WHERE    Pnumber = Pno
GROUP BY Pnumber, Pname;
```

먼저 PROJECT와 WORKS_ON을 이어 16행을 만든다. 한 행이 "어느 직원이 어느 프로젝트에서 일한다"는 사실 하나다. 이 16행을 (`Pnumber`, `Pname`)이 같은 것끼리 묶으면 여섯 묶음이고, 묶음의 행 수가 일하는 직원의 수다.

| Pnumber | Pname | COUNT(*) |
|---|---|---|
| 1 | ProductX | 2 |
| 2 | ProductY | 3 |
| 3 | ProductZ | 2 |
| 10 | Computerization | 3 |
| 20 | Reorganization | 3 |
| 30 | Newbenefits | 3 |

묶는 속성을 둘 적으면 두 값이 모두 같은 행끼리 묶인다. 여기서는 프로젝트 번호가 같으면 이름도 같아서 `Pnumber` 하나로 묶은 것과 묶음이 같다. `Pname`을 묶는 속성에 넣은 까닭은 `SELECT`에 `Pname`을 적기 위해서다.

### SELECT에 적을 수 있는 것

묶음 하나는 결과의 한 행이 된다. 그래서 `SELECT`에는 묶음마다 값이 하나로 정해지는 것만 적을 수 있다. 묶는 속성과 집계 함수가 그렇다. 묶는 속성은 묶음 안에서 값이 모두 같고, 집계 함수는 묶음을 값 하나로 줄인다[^s2].

`Dno`로 묶고 `SELECT Dno, Lname, COUNT(*)`라고 적으면 어떻게 될까. 5번 묶음에는 성이 넷(Smith, Wong, Narayan, English)이라 한 줄에 적을 성이 정해지지 않는다. PostgreSQL 16은 "column must appear in the GROUP BY clause or be used in an aggregate function" 오류로 거부한다. SQLite는 받아 주고 묶음마다 아무 한 사람의 성을 내놓는다(이 상태에서는 Borg, Zelaya, Smith).


PostgreSQL에는 예외가 하나 있다. 묶는 속성이 어떤 표의 기본 키이면 그 표의 다른 열을 `SELECT`에 적어도 받는다. 기본 키가 같으면 같은 행이라 나머지 열의 값도 하나로 정해지기 때문이다([슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/)). `GROUP BY D.Dnumber`에 `SELECT Dname`은 돌고, `GROUP BY E.Dno`에 `SELECT Dname`은 돌지 않는다. `E.Dno`는 EMPLOYEE의 열이라 DEPARTMENT의 `Dname`을 정해 준다고 보지 않는다. 학생 표 STUDENT를 성적 표와 이은 뒤 `GROUP BY S.Student_number, S.Name`으로 묶고 `SELECT Name, Major`를 적은 질의도 같다. 이 질의가 PostgreSQL에서 도는 것은 `Student_number`를 STUDENT의 기본 키로 선언했을 때뿐이다[^s2].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 첫 질의의 결과가 3행인 까닭은?</summary>

EMPLOYEE의 `Dno`에 나오는 서로 다른 값이 5, 4, 1 셋이기 때문이다. 묶음은 묶는 속성의 서로 다른 값마다 하나씩 생기고, 묶음 하나가 결과 한 행이다. DEPARTMENT에 부서가 몇 개 있는지는 이 질의와 상관이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 둘째 질의에서 COUNT(*)가 세는 것은 무엇인가? Reorganization의 3에는 일한 시간이 NULL인 Borg의 행도 들어 있는가?</summary>

이어 붙인 표의 행, 곧 "직원 한 명이 그 프로젝트에서 일한다"는 사실의 수를 센다. `COUNT(*)`는 행을 세므로 `Hours`가 NULL인 Borg의 행도 센다. 그래서 3이다. `COUNT(Hours)`로 세면 2가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `GROUP BY Dno`에 `SELECT Dno, AVG(Salary)`는 되고 `SELECT Dno, Salary`는 안 되는 근거는?</summary>

묶음 안에서 `Dno`는 모두 같은 값이고 `AVG(Salary)`는 묶음 전체를 값 하나로 줄인다. `Salary`는 묶음 안의 행마다 달라(5번 묶음에 30000, 40000, 38000, 25000) 한 줄에 적을 값이 정해지지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

나누고, 묶음마다 값 하나로 줄인다. 결과의 한 줄은 행 하나가 아니라 묶음 하나를 대표한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

파이썬에서 키마다 리스트를 모으는 딕셔너리를 만들고 리스트마다 `len`이나 `sum`을 내는 것과 같다([딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)). 수학에서는 "같은 값을 가진다"로 집합을 겹치지 않게 나누는 일이다([동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)).

</details>


## 예제

**부서와 성별로 묶어 직원 수와 평균 급여를 구하라.**[^s3]

1. *묶는 속성 정하기:* "부서마다, 그 안에서 성별마다"이므로 `Dno`와 `Sex` 둘이다.
2. *SELECT 정하기:* 묶는 속성 둘과 집계 함수 둘. `SELECT Dno, Sex, COUNT(*), AVG(Salary)`.
3. *질의:* `SELECT Dno, Sex, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno, Sex;`
4. *묶음 세기:* (`Dno`, `Sex`)의 서로 다른 쌍은 (1, M), (4, F), (4, M), (5, F), (5, M) 다섯이다.

| Dno | Sex | COUNT(*) | AVG(Salary) |
|---|---|---|---|
| 1 | M | 1 | 55000 |
| 4 | F | 2 | 34000 |
| 4 | M | 1 | 25000 |
| 5 | F | 1 | 25000 |
| 5 | M | 3 | 36000 |

(1, F)처럼 그런 직원이 없는 쌍은 결과에 나오지 않는다. 묶음은 실제로 있는 값에서만 생긴다.

## 활용

- 문제 글의 신호는 "~마다", "각 ~에 대해", "~별"이다. 그 뒤의 낱말이 묶는 속성이 된다.
- 결과 행의 순서는 정해져 있지 않다. 첫 질의를 SQLite는 1, 4, 5 순으로, PostgreSQL은 5, 4, 1 순으로 냈다. 순서가 필요하면 [ORDER BY](/Hongs_Blog/studies/database-design/order-by-clause-order/)를 붙인다.
- 묶는 속성이 NULL인 행들은 한 묶음으로 모인다. `GROUP BY Super_ssn`은 상사 셋의 묶음과 NULL 묶음(Borg 한 명)을 만든다([NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/))[^s3].
- 묶음을 조건으로 거르기: [HAVING](/Hongs_Blog/studies/database-design/having-clause/)
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/)의 p3, [복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/)의 p1, [GROUP BY 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/group-by-query-ladder/), [JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/)

## 연결

- 선수: [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/), [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/)
- 묶음에 거는 조건: [HAVING](/Hongs_Blog/studies/database-design/having-clause/), [WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/)
- 묶기는 "같은 값"이라는 관계로 나누는 일이다: [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)
- 묶어서 만든 요약을 표처럼 두고 쓰기: [뷰](/Hongs_Blog/studies/database-design/sql-view/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"GROUP BY를 쓰면 SELECT에 어느 열을 적어도 그 묶음의 값이 나온다"</div>

틀렸다. 묶는 속성은 묶음마다 값이 하나라서, 다른 열도 "그 묶음의 값"이 있을 것처럼 보인다. 부서 번호로 묶으면 부서 이름도 따라 정해지니 더 그렇다. 하지만 제품은 "부서 번호가 같으면 부서 이름도 같다"는 것을 질의만 보고는 알지 못한다. 묶음 안에서 값이 여럿일 수 있는 열을 적으면 PostgreSQL은 오류를 내고, SQLite는 묶음 안의 아무 한 행의 값을 조용히 내놓는다. `SELECT Dno, Lname, COUNT(*) FROM EMPLOYEE GROUP BY Dno`가 SQLite에서 (5, Smith, 4)를 내는데, 5번 부서에 Smith 혼자 있는 것이 아니다. 확인하는 법: `SELECT`의 항목마다 "묶는 속성인가, 집계 함수인가"를 묻는다. 둘 다 아니면 묶는 속성에 더하거나 집계 함수로 감싼다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `GROUP BY`가 하는 일을 쓰고, 그때 `SELECT`에 적을 수 있는 두 가지를 쓰라.</summary>

**답:** 묶는 속성의 값이 같은 행끼리 겹치지 않는 묶음으로 나누고, 묶음마다 집계 함수를 계산해 묶음 하나를 결과 한 행으로 낸다. `SELECT`에는 묶는 속성과 집계 함수만 적을 수 있다.<br>
**이유:** 묶음이 한 행으로 줄어들므로 묶음마다 값이 하나로 정해지는 것만 보여 줄 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** PROJECT의 `Dnum`(맡은 부서)은 차례로 5, 5, 5, 4, 1, 4다. `SELECT Dnum, COUNT(*) FROM PROJECT GROUP BY Dnum;`의 결과를 쓰라.</summary>

**답:** (5, 3), (4, 2), (1, 1). 행의 순서는 정해져 있지 않다.<br>
**이유:** `Dnum`의 서로 다른 값은 5, 4, 1이라 묶음이 셋이다. 5가 세 번, 4가 두 번, 1이 한 번 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `SELECT Dname, COUNT(*) FROM EMPLOYEE AS E, DEPARTMENT AS D WHERE E.Dno = D.Dnumber GROUP BY E.Dno;`가 PostgreSQL에서 오류인 까닭과 고친 질의를 쓰라.</summary>

**답:** `Dname`이 묶는 속성도 아니고 집계 함수도 아니다. 묶음 하나에 `Dname`이 하나로 정해진다는 보장을 질의에서 읽을 수 없다. `GROUP BY E.Dno, D.Dname`으로 고친다. 결과는 Research 4, Administration 3, Headquarters 1이다.<br>
**흔한 오답:** "부서 번호가 같으면 이름도 같으니 괜찮다"고 답하는 것. 사람은 알지만 질의에는 그 사실이 적혀 있지 않다. SQLite가 받아 주는 것은 SQLite가 너그러워서다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 프로젝트 20에서 일하는 행은 셋이고 그 가운데 Borg의 `Hours`는 NULL이다. `SELECT Pno, COUNT(*), COUNT(Hours) FROM WORKS_ON GROUP BY Pno;`에서 프로젝트 20의 두 값은 각각 얼마인가? "일하는 직원 수"로 맞는 것은 어느 쪽인가?</summary>

**답:** `COUNT(*)`는 3, `COUNT(Hours)`는 2. 일하는 직원 수는 3이 맞다.<br>
**이유:** `COUNT(*)`는 묶음의 행을 세고 `COUNT(Hours)`는 `Hours`가 적힌 칸만 센다. Borg는 시간이 적혀 있지 않을 뿐 그 프로젝트에서 일한다.

</details>


[^s2]: 규칙은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Grouping: The GROUP BY and HAVING Clauses"에 있다. 오류와 결과는 SQLite와 PostgreSQL 16에서 실행해 확인했다. 기본 키가 없는 표에서 Q2-1의 조인 풀이가 오류인 것은 [70_complex-retrieval-practice_p2.sql](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p2-sql/)에서 확인했다.
[^s3]: 값은 SQLite와 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
