---
layout: "note"
title: "복잡한 검색 연습"
display_title: "복잡한 검색 연습"
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
description: "사용 개념: GROUP BY, HAVING, WHERE와 HAVING 비교, EXISTS와 NOT EXISTS, 중첩 질의와 IN, 집계 함수."
prev_url: "/studies/database-design/group-by-query-ladder/"
prev_title: "GROUP BY 질의 쓰기 예제 사다리"
next_url: "/studies/database-design/nested-aggregate-practice/"
next_title: "중첩 질의·집계 연습"
math: true
mermaid: false
code_count: 6
permalink: "/studies/database-design/complex-retrieval-practice/"
---
{% raw %}
사용 개념: [GROUP BY](/Hongs_Blog/studies/database-design/group-by/), [HAVING](/Hongs_Blog/studies/database-design/having-clause/), [WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/), [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/), [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/), [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/).

문제 셋 가운데 p1과 p3은 COMPANY에, p2는 UNIVERSITY에 묻는다. COMPANY의 상태는 [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 있다. 직원의 (성, 성별, 급여, 부서, 상사)만 옮기면 이렇다.

| Lname | Ssn | Sex | Salary | Dno | Super_ssn |
|---|---|---|---|---|---|
| Smith | 123456789 | M | 30000 | 5 | 333445555 |
| Wong | 333445555 | M | 40000 | 5 | 888665555 |
| Zelaya | 999887777 | F | 25000 | 4 | 987654321 |
| Wallace | 987654321 | F | 43000 | 4 | 888665555 |
| Narayan | 666884444 | M | 38000 | 5 | 333445555 |
| English | 453453453 | F | 25000 | 5 | 333445555 |
| Jabbar | 987987987 | M | 25000 | 4 | 987654321 |
| Borg | 888665555 | M | 55000 | 1 | NULL |

부서는 Research(5번), Administration(4번), Headquarters(1번)다.

질의와 결과는 SQLite 3.50.4와 PostgreSQL 16에서 실행해 확인했다.

## 문제 p1 · 묶음 조건과 행 조건 (Q1-1, Q1-2)

COMPANY에 다음 두 질의를 SQL로 적고, 위 상태에서의 결과를 보여라.

- **Q1-1.** 평균 급여가 30000을 넘는 부서마다 부서 이름과 그 부서에서 일하는 직원의 수를 구하라.
- **Q1-2.** 평균 급여가 30000을 넘는 부서마다, 전 직원이 아니라 남자 직원의 수를 부서 이름과 함께 구하라.

풀이 전략: Q1-1은 "부서마다"로 묶고 평균에 조건을 건다. Q1-2에서는 조건마다 "어느 행들을 보고 계산하는가"를 따진다. 평균 30000은 부서의 전 직원으로 계산하고, 세는 것은 남자 직원만이다. 두 대상이 다르면 한 번의 묶기로는 안 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q1-1의 답</summary>

1. *표 잇기:* 부서 이름이 필요하므로 `WHERE Dno = Dnumber`.
2. *묶기:* 부서 번호와 이름으로 묶는다. `SELECT`에 Dname을 꺼내므로 Dname도 묶는 속성에 넣는다. `GROUP BY Dno`만 쓰면 PostgreSQL 16은 오류로 거부한다. SQLite는 받는다.
3. *묶음 조건:* `HAVING AVG(Salary) > 30000`.

```sql
SELECT   Dname, COUNT(*) AS Number_of_employees
FROM     EMPLOYEE, DEPARTMENT
WHERE    Dno = Dnumber
GROUP BY Dno, Dname
HAVING   AVG(Salary) > 30000;
```

{: start="4"}
4. *결과:* 부서별 평균은 33250, 31000, 55000으로 모두 30000을 넘는다.

| Dname | Number_of_employees |
|---|---|
| Research | 4 |
| Administration | 3 |
| Headquarters | 1 |

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q1-2의 답</summary>

1. *부서 고르기를 떼어 내기:* "평균이 30000을 넘는 부서의 번호"를 안쪽 질의로 구한다. 여기에는 성별 조건이 없다. `SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING AVG(Salary) > 30000` → 5, 4, 1.
2. *바깥에서 남자만 남기기:* `WHERE Sex = 'M'`. 그리고 부서 번호가 안쪽 결과에 있는 행만 남긴다.
3. *묶어서 세기:* 부서로 묶고 `COUNT(*)`.

```sql
SELECT   Dname, COUNT(*) AS Number_of_employees
FROM     EMPLOYEE, DEPARTMENT
WHERE    Dno = Dnumber AND Sex = 'M'
         AND Dno IN ( SELECT   Dno
                      FROM     EMPLOYEE
                      GROUP BY Dno
                      HAVING   AVG(Salary) > 30000 )
GROUP BY Dno, Dname;
```

{: start="4"}
4. *결과:* 남자 직원은 Research에 Smith, Wong, Narayan, Administration에 Jabbar, Headquarters에 Borg다.

| Dname | Number_of_employees |
|---|---|
| Research | 3 |
| Administration | 1 |
| Headquarters | 1 |

Q1-1의 질의에 `AND Sex = 'M'`만 더하면 안 된다. `WHERE`가 먼저 남자만 남기므로 `HAVING`의 평균이 남자만의 평균(36000, 25000, 55000)이 된다. 그러면 Administration이 빠져 2행(Research 3, Headquarters 1)만 나온다. 까닭은 [WHERE와 HAVING 비교](/Hongs_Blog/studies/database-design/where-vs-having/)에 있다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Q1-1의 3행, Q1-2의 중첩 질의 3행, `AND Sex = 'M'`만 더한 질의의 2행, 다른 해석의 2행 — [70_complex-retrieval-practice_p1.py](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p1/), [70_complex-retrieval-practice_p1.sql](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p1-sql/)</div>

</div>




변형: Q1-2를 "급여가 30000을 넘는 남자 직원의 수를 부서마다"로 읽으면 질의와 결과는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

두 조건이 모두 직원 한 명만 보면 정해지므로 둘 다 `WHERE`에 간다. `WHERE Dno = Dnumber AND Sex = 'M' AND Salary > 30000 GROUP BY Dno, Dname`. 결과는 Research 2(Wong, Narayan), Headquarters 1(Borg)이다. 문제 글의 "making more than $30,000"이 부서를 꾸미는지 직원을 꾸미는지에 따라 답이 갈린다. 본문의 답 3행은 부서를 꾸미는 쪽이다[^s1].

</details>


## 문제 p2 · "모두"와 "하나도 없다" (Q2-1, Q2-2)

UNIVERSITY 데이터베이스에 다음을 SQL로 적어라.

- **Q2-1.** 성적이 모두 A인 학생의 이름과 전공을 구하라.
- **Q2-2.** A인 성적이 하나도 없는 학생의 이름과 전공을 구하라.

STUDENT (2행)

| Name | Student_number | Class | Major |
|---|---|---|---|
| Smith | 17 | 1 | CS |
| Brown | 8 | 2 | CS |

GRADE_REPORT (6행)

| Student_number | Section_identifier | Grade |
|---|---|---|
| 17 | 112 | B |
| 17 | 119 | C |
| 8 | 85 | A |
| 8 | 92 | A |
| 8 | 102 | B |
| 8 | 135 | A |

스키마에는 COURSE, SECTION, PREREQUISITE도 있지만 이 문제에는 쓰이지 않는다.

풀이 전략: SQL에는 "모두 ~이다"를 바로 묻는 말이 없다. "A가 아닌 성적이 하나도 없다"로 바꿔 `NOT EXISTS`로 쓴다. Q2-2는 처음부터 "~가 없다"라 그대로 `NOT EXISTS`다. 두 질의는 안쪽 조건의 `<>`와 `=`만 다르다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q2-1의 답</summary>

1. *말 바꾸기:* 성적이 모두 A다 = A가 아닌 성적이 없다.
2. *안쪽 질의:* 이 학생의 성적 가운데 A가 아닌 것. `G.Student_number = S.Student_number AND G.Grade <> 'A'`.
3. *바깥:* 그런 행이 없는 학생을 고른다.

```sql
SELECT Name, Major
FROM   STUDENT AS S
WHERE  NOT EXISTS ( SELECT *
                    FROM   GRADE_REPORT AS G
                    WHERE  G.Student_number = S.Student_number
                           AND G.Grade <> 'A' );
```

{: start="4"}
4. *결과:* Smith는 B와 C가 있고 Brown은 B가 하나 있다. 둘 다 안쪽 질의에 행이 나와 **결과는 0행**이다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q2-2의 답</summary>

```sql
SELECT Name, Major
FROM   STUDENT AS S
WHERE  NOT EXISTS ( SELECT *
                    FROM   GRADE_REPORT AS G
                    WHERE  G.Student_number = S.Student_number
                           AND G.Grade = 'A' );
```

Smith의 성적 B, C에는 A가 없어 안쪽 결과가 비어 있다. Brown은 A가 셋이다. 결과는 **(Smith, CS)** 한 행이다.

</details>


같은 두 질문을 조인과 묶기로도 풀 수 있다.

```sql
SELECT   Name, Major
FROM     STUDENT AS S JOIN GRADE_REPORT AS G ON S.Student_number = G.Student_number
GROUP BY S.Student_number, S.Name
HAVING   SUM(CASE WHEN G.Grade <> 'A' THEN 1 ELSE 0 END) = 0;
```

`CASE WHEN 조건 THEN 값1 ELSE 값2 END`는 행마다 조건이 참이면 값1을, 아니면 값2를 낸다. 여기서는 A가 아닌 성적에 1을, A에 0을 매기고 학생마다 더한다. 합은 "A가 아닌 성적의 수"이고, 0이면 모두 A다. Smith의 합은 2, Brown의 합은 1이라 결과는 0행이다. `<>`를 `=`로 바꾸면 합이 "A의 수"가 되고(Smith 0, Brown 3), Q2-2의 답 (Smith, CS)가 나온다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Q2-1은 두 풀이 모두 0행, Q2-2는 두 풀이 모두 (Smith, CS). 성적이 없는 학생과 모두 A인 학생을 넣은 실험 — [70_complex-retrieval-practice_p2.py](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p2/), [70_complex-retrieval-practice_p2.sql](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p2-sql/)</div>

</div>




변형: 성적이 한 줄도 없는 학생 (Kim, 25, 4, CS)를 STUDENT에 넣으면, Q2-1의 두 풀이는 각각 무엇을 내는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

`NOT EXISTS` 풀이는 **Kim**을 낸다. Kim에게는 성적이 없으니 "A가 아닌 성적"도 없어 조건이 참이다. 조인과 묶기 풀이는 **0행**이다. Kim은 GRADE_REPORT에 짝이 없어 조인에서 빠지고 묶음이 만들어지지 않는다. 두 풀이는 "성적이 없는 학생"에서 답이 갈린다. 성적이 있는 학생만 원하면 `NOT EXISTS` 풀이에 `AND EXISTS ( SELECT * FROM GRADE_REPORT AS G WHERE G.Student_number = S.Student_number )`를 더한다. 그러면 다시 0행이다. 성적이 A 둘뿐인 학생 Lee를 더 넣으면 `NOT EXISTS` 풀이는 Kim과 Lee를, 나머지 두 판은 Lee만 낸다[^s2].

조인과 묶기 풀이에는 하나가 더 있다. `SELECT`의 `Major`가 묶는 속성에 없다. PostgreSQL 16은 `Student_number`가 STUDENT의 기본 키로 선언되어 있을 때만 이 질의를 받고, 기본 키가 없는 표에서는 오류를 낸다. `GROUP BY S.Student_number, S.Name, S.Major`로 쓰면 어느 쪽에서나 돈다.

</details>


## 문제 p3 · 값을 먼저 구해 견주기 (Q3-1, Q3-2, Q3-3)

COMPANY에 다음을 중첩 질의와 집계 함수 따위를 써서 SQL로 적어라.

- **Q3-1.** 전 직원 가운데 급여가 가장 많은 직원이 있는 부서에서 일하는 모든 직원의 이름을 구하라.
- **Q3-2.** 상사의 상사가 Ssn 888665555인 모든 직원의 이름을 구하라.
- **Q3-3.** 회사에서 급여가 가장 적은 직원보다 10000 이상 더 받는 직원의 이름을 구하라.

풀이 전략: 세 문제 모두 "먼저 알아야 하는 값"이 있다. 그 값을 구하는 질의를 가장 안쪽에 쓰고 바깥으로 나오면서 견준다. 안쪽 질의가 값 하나를 돌려주면 `=`나 `>=`로, 여러 값을 돌려줄 수 있으면 `IN`으로 견준다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q3-1의 답</summary>

1. *가장 안쪽:* 가장 큰 급여. `SELECT MAX(Salary) FROM EMPLOYEE` → 55000.
2. *가운데:* 그 급여를 받는 직원의 부서. `SELECT Dno FROM EMPLOYEE WHERE Salary = ( … )` → 1.
3. *바깥:* 그 부서에서 일하는 직원.

```sql
SELECT Fname, Minit, Lname
FROM   EMPLOYEE
WHERE  Dno = ( SELECT Dno
               FROM   EMPLOYEE
               WHERE  Salary = ( SELECT MAX(Salary) FROM EMPLOYEE ) );
```

{: start="4"}
4. *결과:* 1번 부서에는 Borg뿐이라 **James E Borg** 한 행이다.

가운데 질의 앞의 `=`는 가장 큰 급여를 받는 직원이 한 명일 때만 안전하다. 같은 급여의 직원이 다른 부서에 또 있으면 가운데 질의가 두 행을 돌려준다. `Dno IN ( … )`로 쓰면 그때도 돈다[^s3].

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q3-2의 답</summary>

1. *안쪽:* 상사가 888665555인 직원, 곧 "상사가 될 사람들". `SELECT Ssn FROM EMPLOYEE WHERE Super_ssn = '888665555'` → Wong(333445555), Wallace(987654321) 두 행.
2. *바깥:* 상사가 그 가운데 한 명인 직원. 안쪽이 두 행이므로 `IN`이다.

```sql
SELECT Fname, Minit, Lname
FROM   EMPLOYEE
WHERE  Super_ssn IN ( SELECT Ssn
                      FROM   EMPLOYEE
                      WHERE  Super_ssn = '888665555' );
```

{: start="3"}
3. *결과:* Wong의 부하 Smith, Narayan, English와 Wallace의 부하 Zelaya, Jabbar. **John B Smith, Alicia J Zelaya, Ramesh K Narayan, Joyce A English, Ahmad V Jabbar** 다섯 행이다.

`IN` 대신 `=`를 쓰면 안쪽 질의가 두 행을 돌려주어 탈이 난다. PostgreSQL 16은 "more than one row returned by a subquery used as an expression" 오류로 멈춘다. SQLite는 오류 없이 첫 행(Wong)만 써서 Smith, Narayan, English 세 명만 내고 Wallace의 부하 둘을 빠뜨린다.

자기 조인으로도 쓴다. `FROM EMPLOYEE AS E JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn WHERE S.Super_ssn = '888665555'`. 같은 다섯 명이 나온다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">Q3-3의 답</summary>

1. *안쪽:* 가장 적은 급여. `SELECT MIN(Salary) FROM EMPLOYEE` → 25000.
2. *바깥:* 급여에서 10000을 뺀 값이 그 이상인 직원.

```sql
SELECT Fname, Minit, Lname
FROM   EMPLOYEE
WHERE  Salary - 10000 >= ( SELECT MIN(Salary) FROM EMPLOYEE );
```

{: start="3"}
3. *결과:* 급여가 35000 이상인 **Franklin T Wong(40000), Jennifer S Wallace(43000), Ramesh K Narayan(38000), James E Borg(55000)** 네 행이다. Smith(30000)는 5000만 더 받아 빠진다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Q3-1 Borg, Q3-2 다섯 명(자기 조인 판도 같다), Q3-3 네 명 — [70_complex-retrieval-practice_p3.py](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p3/), [70_complex-retrieval-practice_p3.sql](/Hongs_Blog/studies/database-design/code/70_complex-retrieval-practice_p3-sql/)</div>

</div>




변형: Q3-3을 "가장 많이 받는 직원보다 10000 이상 적게 받는 직원"으로 바꾸면 조건은 어떻게 쓰는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

`WHERE Salary + 10000 <= ( SELECT MAX(Salary) FROM EMPLOYEE )`. 가장 큰 급여가 55000이므로 45000 이하를 받는 직원, 곧 Borg를 뺀 일곱 명이다[^s3].

</details>


[^s1]: 중첩 질의의 꼴은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Grouping: The GROUP BY and HAVING Clauses"에 같은 꼴의 예가 있다. 결과는 문제 코드로 실행해 확인했다.
[^s2]: 문제 코드로 실행해 확인했다.
[^s3]: 문제 코드로 실행해 확인했다.
{% endraw %}
