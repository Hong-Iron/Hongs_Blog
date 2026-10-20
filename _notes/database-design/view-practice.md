---
layout: "note"
title: "뷰 연습"
display_title: "뷰 연습"
kind: "practice"
kind_label: "연습"
num: "77"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 뷰를 만드는 문장과 뷰에 던지는 질의, 뷰 갱신 문제의 세 부류."
prev_url: "/studies/database-design/advanced-sql-practice/"
prev_title: "JOIN·GROUP BY 종합 연습"
math: false
mermaid: false
code_count: 4
code_files: [{"t": "77_view-practice_p1.py", "u": "/studies/database-design/code/77_view-practice_p1/", "r": "문제 1 풀이"}, {"t": "77_view-practice_p1.sql", "u": "/studies/database-design/code/77_view-practice_p1-sql/", "r": "문제 1 풀이"}, {"t": "77_view-practice_p2.py", "u": "/studies/database-design/code/77_view-practice_p2/", "r": "문제 2 풀이"}, {"t": "77_view-practice_p2.sql", "u": "/studies/database-design/code/77_view-practice_p2-sql/", "r": "문제 2 풀이"}]
permalink: "/studies/database-design/view-practice/"
---
{% raw %}
사용 개념: [뷰](/Hongs_Blog/studies/database-design/sql-view/)를 만드는 문장과 뷰에 던지는 질의, [뷰 갱신 문제](/Hongs_Blog/studies/database-design/view-update-problem/)의 세 부류.

뷰를 만들고 쓰는 문제 셋이다. 표는 모두 COMPANY이고 행은 [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 있는 그대로다. 풀이는 SQLite와 PostgreSQL 16에서 그대로 실행되는 문장으로 적었다.

## 문제 0 · 뷰 없이 쓰기

뷰 `WORKS_ON1`이 있으면 "ProductX 프로젝트에서 일하는 모든 직원의 이름"은 이렇게 쓴다.

```sql
SELECT Fname, Lname
FROM   WORKS_ON1
WHERE  Pname = 'ProductX';
```

`WORKS_ON1`이 없다면 이 질의를 어떻게 쓰는가?

**풀이 전략.** 뷰 이름 자리에 뷰의 정의를 풀어 넣는다. 뷰의 `FROM`과 `WHERE`를 가져오고, 내 질의의 조건을 `AND`로 붙인다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

```sql
SELECT Fname, Lname
FROM   EMPLOYEE, PROJECT, WORKS_ON
WHERE  Ssn = Essn AND Pno = Pnumber
  AND  Pname = 'ProductX';
```
답은 John Smith, Joyce English다. 뷰에 던진 질의와 같은 답이다. 이 질의를 던질 때마다 세 표를 이어야 한다. 자주 던지는 질의라면 그만큼 시간이 든다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [75_sql-view_verify.py](/Hongs_Blog/studies/database-design/code/75_sql-view_verify/)</div>

</div>


## 문제 1 · 뷰 만들기

COMPANY 스키마에 다음 뷰를 SQL로 적고, 각 뷰를 펼친 결과(실체화한 뷰)를 보여라.

- **1-a.** 부서마다 부서 이름, 부서장 이름, 부서장 급여를 담은 뷰.
- **1-b.** 'Research' 부서에서 일하는 직원마다 직원 이름, 상사 이름, 직원 급여를 담은 뷰.
- **1-c.** 프로젝트마다 프로젝트 이름, 맡은 부서 이름, 일하는 직원 수, 그 프로젝트에서 주마다 일한 시간의 합을 담은 뷰.
- **1-d.** 1-c와 같되, 일하는 직원이 한 명보다 많은 프로젝트만 담은 뷰.

### 1-a

**풀이 전략.** "부서마다 한 줄"이니 DEPARTMENT가 바탕이다. 부서장의 이름과 급여는 EMPLOYEE에 있다. 두 표를 잇는 열은 부서장을 가리키는 `Mgr_ssn`이다. 직원이 일하는 부서를 뜻하는 `Dno`로 이으면 부서의 모든 직원이 나오니 조심한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *바탕 표:* DEPARTMENT. 한 줄이 부서 하나다.
2. *잇는 조건:* `D.Mgr_ssn = E.Ssn`. 부서장인 직원만 짝이 된다.
3. *열 이름:* 뷰 이름 뒤에 네 개를 적는다.

```sql
CREATE VIEW DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary)
AS SELECT D.Dname, E.Fname, E.Lname, E.Salary
   FROM   DEPARTMENT AS D, EMPLOYEE AS E
   WHERE  D.Mgr_ssn = E.Ssn;
```

| DeptName | MgrFname | MgrLname | MgrSalary |
|---|---|---|---|
| Research | Franklin | Wong | 40000 |
| Administration | Jennifer | Wallace | 43000 |
| Headquarters | James | Borg | 55000 |

이 뷰의 이름 `DEPT_INFO`는 [뷰](/Hongs_Blog/studies/database-design/sql-view/)에 나온 다른 뷰(부서 이름, 인원, 급여 합)와 같다. 한 데이터베이스에 둘을 함께 두려면 하나의 이름을 바꾼다. 같은 이름으로 또 만들면 "already exists"로 거부된다.

</details>


### 1-b

**풀이 전략.** 직원과 그 상사는 둘 다 EMPLOYEE에 있다. 같은 표를 두 번, 한 번은 직원(E)으로 한 번은 상사(S)로 쓴다. EMPLOYEE에는 부서 번호만 있고 부서 이름이 없다. 'Research'가 몇 번 부서인지는 DEPARTMENT에 물어야 한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *직원과 상사 잇기:* `E.Super_ssn = S.Ssn`.
2. *Research 직원만 남기기:* `E.Dno IN (SELECT D.Dnumber FROM DEPARTMENT AS D WHERE D.Dname = 'Research')`. 안쪽 질의의 답은 5다. `Dno`는 E에도 S에도 있으므로 `E.Dno`처럼 어느 쪽인지 밝힌다. 그냥 `Dno`라고 쓰면 SQLite는 "ambiguous column name: Dno"를 낸다.
3. *열 이름:* 고르는 열이 다섯이니 이름도 다섯을 적는다. E와 S 양쪽에 Fname, Lname이 있어 이름을 새로 붙여야 한다. 이름을 셋만 적으면 SQLite는 "expected 3 columns for 'ResearchDept' but got 5"를 낸다.

```sql
CREATE VIEW ResearchDept(Fname, Lname, SuperFname, SuperLname, Salary)
AS SELECT E.Fname, E.Lname, S.Fname, S.Lname, E.Salary
   FROM   EMPLOYEE AS E, EMPLOYEE AS S
   WHERE  E.Super_ssn = S.Ssn
     AND  E.Dno IN ( SELECT D.Dnumber
                     FROM   DEPARTMENT AS D
                     WHERE  D.Dname = 'Research' );
```

| Fname | Lname | SuperFname | SuperLname | Salary |
|---|---|---|---|---|
| John | Smith | Franklin | Wong | 30000 |
| Franklin | Wong | James | Borg | 40000 |
| Ramesh | Narayan | Franklin | Wong | 38000 |
| Joyce | English | Franklin | Wong | 25000 |

열 이름을 `(Name, Supervisor, Salary)` 셋으로 하려면 이름과 성을 한 열로 이어 붙인다: <code>E.Fname &#124;&#124; ' ' &#124;&#124; E.Lname, S.Fname &#124;&#124; ' ' &#124;&#124; S.Lname, E.Salary</code>. 첫 줄이 (John Smith, Franklin Wong, 30000)이 된다[^s1].

</details>


### 1-c

**풀이 전략.** "프로젝트마다 한 줄"에 세어서 더한 값이 붙는다. 프로젝트로 묶고 `COUNT`와 `SUM`을 쓴다. 직원 수와 시간은 WORKS_ON에서, 부서 이름은 DEPARTMENT에서 온다. DEPARTMENT는 이름 하나를 가져오려고만 잇는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *잇는 조건:* `P.Pnumber = W.Pno`(프로젝트와 일한 기록), `D.Dnumber = P.Dnum`(프로젝트와 맡은 부서).
2. *묶는 열:* 프로젝트 하나가 한 묶음이 되게 `P.Pnumber`로 묶는다. `SELECT`에 쓰는 `P.Pname`과 `D.Dname`도 `GROUP BY`에 적는다. `D.Dname`을 빠뜨리면 PostgreSQL 16은 `column "d.dname" must appear in the GROUP BY clause or be used in an aggregate function`으로 거부한다. SQLite는 받아 주고 결과도 같다.
3. *묶음마다 낼 값:* `COUNT(*)`는 그 프로젝트의 WORKS_ON 행 수, 곧 일하는 직원 수다. `SUM(W.Hours)`는 시간의 합이다.

```sql
CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours)
AS SELECT   P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
   FROM     PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
   WHERE    P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
   GROUP BY P.Pnumber, P.Pname, D.Dname;
```

| Pname | Dname | NumEmployees | TotalHours |
|---|---|---|---|
| ProductX | Research | 2 | 52.5 |
| ProductY | Research | 3 | 37.5 |
| ProductZ | Research | 2 | 50.0 |
| Computerization | Administration | 3 | 55.0 |
| Reorganization | Headquarters | 3 | 25.0 |
| Newbenefits | Administration | 3 | 55.0 |

Reorganization에서 일하는 사람은 셋인데 시간 합은 10 + 15 = 25.0이다. Borg의 시간이 NULL이고, `SUM`은 NULL을 빼고 더한다. `COUNT(*)`는 행을 세므로 Borg도 센다[^s1].

</details>


### 1-d

**풀이 전략.** 1-c에 "묶음에 거는 조건" 하나가 더 붙는다. 직원 수는 묶은 뒤에야 나오는 값이니 `WHERE`가 아니라 `HAVING`에 쓴다. 뷰 이름은 1-c와 달라야 한다. 같은 이름이면 두 제품 모두 "already exists"로 거부한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

```sql
CREATE VIEW BusyProjectInfo(Pname, Dname, NumEmployees, TotalHours)
AS SELECT   P.Pname, D.Dname, COUNT(*), SUM(W.Hours)
   FROM     PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D
   WHERE    P.Pnumber = W.Pno AND D.Dnumber = P.Dnum
   GROUP BY P.Pnumber, P.Pname, D.Dname
   HAVING   COUNT(*) > 1;
```
결과는 1-c의 여섯 줄과 똑같다. 주어진 상태에서는 가장 적은 프로젝트(ProductX, ProductZ)도 직원이 2명이라 조건에서 빠지는 프로젝트가 없다[^s1].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 1-a~1-d의 결과 표, 틀리기 쉬운 판(한정하지 않은 `Dno`, 모자란 열 이름, `GROUP BY`에 빠진 `D.Dname`, 같은 뷰 이름)의 오류 — [77_view-practice_p1.py](/Hongs_Blog/studies/database-design/code/77_view-practice_p1/). PostgreSQL 16에서 실행 — [77_view-practice_p1.sql](/Hongs_Blog/studies/database-design/code/77_view-practice_p1-sql/)</div>

</div>


## 문제 2 · 뷰에 던진 질의와 갱신

COMPANY에 다음 뷰가 있다.

```sql
CREATE VIEW DEPT_SUMMARY (D, C, Total_s, Average_s)
AS SELECT   Dno, COUNT (*), SUM (Salary), AVG (Salary)
   FROM     EMPLOYEE
   GROUP BY Dno;
```

아래 질의와 갱신 가운데 이 뷰에 허락되는 것은 무엇인가? 허락된다면 기본 테이블에 대한 질의나 갱신으로는 어떻게 되는지 적고, 결과를 보여라.

```sql
-- a
SELECT * FROM DEPT_SUMMARY;
-- b
SELECT D, C FROM DEPT_SUMMARY WHERE TOTAL_S > 100000;
-- c
SELECT D, AVERAGE_S FROM DEPT_SUMMARY
WHERE  C > ( SELECT C FROM DEPT_SUMMARY WHERE D = 4 );
-- d
UPDATE DEPT_SUMMARY SET D = 3 WHERE D = 4;
-- e
DELETE FROM DEPT_SUMMARY WHERE C > 4;
```

**풀이 전략.** 먼저 문장이 검색인지 갱신인지 본다. 검색은 어느 뷰에서나 된다. 갱신이면 뷰를 만든 방법을 본다. 이 뷰는 표 하나로 만들었지만 `GROUP BY`와 집계 함수가 있다. 검색을 기본 테이블 질의로 옮길 때는, 뷰의 열에 건 조건이 묶은 뒤의 값에 거는 조건이라는 점을 떠올린다. 묶은 뒤의 조건은 `HAVING`으로 간다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">2-a 풀이</summary>

허락된다. 검색이다.

| D | C | Total_s | Average_s |
|---|---|---|---|
| 5 | 4 | 133000 | 33250 |
| 4 | 3 | 93000 | 31000 |
| 1 | 1 | 55000 | 55000 |

기본 테이블에 대한 질의는 뷰의 정의 그대로다.
```sql
SELECT Dno, COUNT (*), SUM (Salary), AVG (Salary)
FROM   EMPLOYEE
GROUP BY Dno;
```

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">2-b 풀이</summary>

허락된다. 결과는 (5, 4) 한 줄이다. 급여 합이 100000을 넘는 부서는 133000인 5번뿐이다.

기본 테이블에 대한 질의로 옮기면 `TOTAL_S > 100000`은 `HAVING SUM(Salary) > 100000`이 된다[^s2].
```sql
SELECT Dno, COUNT (*)
FROM   EMPLOYEE
GROUP BY Dno
HAVING SUM (Salary) > 100000;
```
`WHERE Salary > 100000`으로 옮기면 틀린다. 그것은 "혼자서 100000 넘게 받는 직원만 남겨라"는 말이고, 그런 직원이 없어 결과가 비어 버린다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">2-c 풀이</summary>

허락된다. 뷰는 중첩 질의 안에서도 쓸 수 있다.
1. *안쪽 질의:* 4번 부서의 인원 C를 구한다. 3이다.
2. *바깥 질의:* 인원이 3보다 많은 부서를 고른다. 4명인 5번 부서뿐이다.
3. *고른 열:* 그 부서의 번호와 평균 급여.

결과는 (5, 33250) 한 줄이다. 기본 테이블에 대한 질의로 옮기면 이렇다[^s2].
```sql
SELECT Dno, AVG (Salary)
FROM   EMPLOYEE
GROUP BY Dno
HAVING COUNT (*) > ( SELECT COUNT (*) FROM EMPLOYEE WHERE Dno = 4 );
```

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">2-d 풀이</summary>

허락되지 않는다. 집계 함수나 조인으로 만든 뷰는 갱신할 수 없다. PostgreSQL 16은 "cannot update view dept_summary … Views containing GROUP BY are not automatically updatable"로 거부한다.

D는 계산한 값이 아니라 묶는 열 `Dno`다. "4번 부서 직원을 모두 3번 부서로 옮긴다"로 읽을 수도 있을 것 같다. 그래도 규칙은 뷰를 만든 방법만 보고 거부한다. 그 뜻으로 기본 테이블을 직접 고쳐 보면(`UPDATE EMPLOYEE SET Dno = 3 WHERE Dno = 4`) DEPARTMENT에 3번 부서가 없어 외래 키 제약에 걸린다[^s2].

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">2-e 풀이</summary>

허락되지 않는다. 인원이 4를 넘는 부서가 없어서 조건에 맞는 줄은 하나도 없다. 그래도 거부된다. 갱신할 수 있는지는 뷰의 정의가 정하고, 안에 든 데이터와는 상관없다. PostgreSQL 16은 "cannot delete from view dept_summary"를 낸다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 2-a~2-c의 결과와 기본 테이블로 옮긴 질의 — [77_view-practice_p2.py](/Hongs_Blog/studies/database-design/code/77_view-practice_p2/). PostgreSQL 16에서 실행(2-d, 2-e가 거부되는 것 포함) — [77_view-practice_p2.sql](/Hongs_Blog/studies/database-design/code/77_view-practice_p2-sql/). SQLite는 뷰를 모두 읽기 전용으로 다뤄서 2-d, 2-e뿐 아니라 어떤 뷰의 갱신도 거부한다.</div>

</div>


## 변형 문제

**변형 1.** PROJECT에 ('Planning', 40, 'Houston', 1)을 넣었다. 아직 아무도 일하지 않는 프로젝트다. 1-c의 뷰에 이 프로젝트가 나오는가? 나오게 하려면 어디를 고치는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

안 나온다. `P.Pnumber = W.Pno`에서 짝이 없는 프로젝트는 조인에서 빠진다. PROJECT를 왼쪽에 두고 WORKS_ON을 `LEFT OUTER JOIN`으로 잇는다. 사람 수는 `COUNT(*)` 대신 `COUNT(W.Essn)`으로 센다. `COUNT(*)`는 NULL로 채운 한 줄도 세어 1을 낸다.
```sql
SELECT   P.Pname, D.Dname, COUNT(W.Essn), SUM(W.Hours)
FROM     (PROJECT AS P JOIN DEPARTMENT AS D ON D.Dnumber = P.Dnum)
         LEFT OUTER JOIN WORKS_ON AS W ON P.Pnumber = W.Pno
GROUP BY P.Pnumber, P.Pname, D.Dname;
```
일곱 줄이 나오고 새 줄은 (Planning, Headquarters, 0, NULL)이다[^s1].

</details>


**변형 2.** Research 부서에 상사가 없는 직원(Super_ssn이 NULL)이 새로 들어왔다. 1-b의 뷰에 이 직원이 나오는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

안 나온다. Super_ssn이 NULL이면 `E.Super_ssn = S.Ssn`이 어느 S 행과도 참이 되지 않는다. 짝이 없으니 그 직원은 조인에서 빠진다. 직원 쪽을 왼쪽에 두고 `EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn`으로 이으면 상사 이름이 NULL인 줄로 나온다. 직원 한 명을 그렇게 넣어 보면 뷰는 4줄 그대로이고 LEFT OUTER JOIN 판은 5줄이다[^s1].

</details>






[^s1]: 문제 코드로 확인했다.
[^s2]: 옮긴 질의가 뷰 질의와 같은 답을 내는 것, `UPDATE EMPLOYEE SET Dno = 3 WHERE Dno = 4`가 외래 키 위반인 것을 문제 코드로 확인했다.
{% endraw %}
