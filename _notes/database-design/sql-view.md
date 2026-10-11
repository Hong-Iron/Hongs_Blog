---
layout: "note"
title: "뷰"
display_title: "뷰 (View)"
kind: "concept"
kind_label: "정의"
num: "75"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["View", "SQL View", "뷰", "가상 테이블", "Virtual Table", "기본 테이블", "Base Table", "정의 테이블", "Defining Table", "CREATE VIEW", "DROP VIEW", "WORKS_ON1", "DEPT_INFO", "DEPT5EMP", "BASIC_EMP_DATA"]
description: "자주 쓰는 질의에 이름을 붙여 두고 표처럼 쓰는 것이다. 창문과 같아서, 창문 자체에는 아무것도 들어 있지 않고 창밖 풍경이 바뀌면 창으로 보이는 것도 바로 바뀐다. 긴 질의를 매번 다시 쓰지 않아도 되고, 보여 주고 싶은 행과 열만 내보일 수 있다. 읽는 것은 진짜 표와 똑같이 …"
prev_url: "/studies/database-design/sql-trigger/"
prev_title: "트리거와 ECA 규칙"
next_url: "/studies/database-design/view-implementation/"
next_title: "질의 수정과 뷰 실체화"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-view/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자주 쓰는 질의에 이름을 붙여 두고 표처럼 쓰는 것이다. 창문과 같아서, 창문 자체에는 아무것도 들어 있지 않고 창밖 풍경이 바뀌면 창으로 보이는 것도 바로 바뀐다. 긴 질의를 매번 다시 쓰지 않아도 되고, 보여 주고 싶은 행과 열만 내보일 수 있다. 읽는 것은 진짜 표와 똑같이 되지만, 창문에 대고 풍경을 고치는 일은 많은 경우에 안 된다.

</div>


창문은 풍경을 있는 그대로 보여 준다. 뷰는 여러 표를 잇거나, 세고 더한 값을 보여 줄 수도 있다.

## 예시로 보기

"ProductX 프로젝트에서 일하는 직원의 이름"을 알고 싶다. 직원 이름은 EMPLOYEE에, 프로젝트 이름은 PROJECT에, 누가 어디서 일하는지는 WORKS_ON에 있다. 세 표를 이어야 한다[^1].

```sql
SELECT Fname, Lname
FROM   EMPLOYEE, PROJECT, WORKS_ON
WHERE  Ssn = Essn AND Pno = Pnumber
  AND  Pname = 'ProductX';
```

직원과 프로젝트를 함께 묻는 질의는 자주 나온다. 그때마다 세 표와 조인 조건 둘을 다시 써야 한다. 세 표를 이어 놓은 결과에 `WORKS_ON1`이라는 이름을 붙여 두면 어떨까?[^2]

```sql
CREATE VIEW WORKS_ON1
AS SELECT Fname, Lname, Pname, Hours
   FROM   EMPLOYEE, PROJECT, WORKS_ON
   WHERE  Ssn = Essn AND Pno = Pnumber;
```

이제 같은 질문을 표 하나에 묻듯이 쓴다[^3].

```sql
SELECT Fname, Lname
FROM   WORKS_ON1
WHERE  Pname = 'ProductX';
```

두 질의의 답은 같다. John Smith와 Joyce English다. `WORKS_ON1`을 통째로 펼치면 WORKS_ON의 행마다 한 줄씩 16행이 나온다. 그 가운데 다섯 줄은 이렇다.

| Fname | Lname | Pname | Hours |
|---|---|---|---|
| John | Smith | ProductX | 32.5 |
| John | Smith | ProductY | 7.5 |
| Ramesh | Narayan | ProductZ | 40.0 |
| Joyce | English | ProductX | 20.0 |
| Joyce | English | ProductY | 20.0 |

이 16행은 어디에도 저장돼 있지 않다. 저장된 것은 `CREATE VIEW` 뒤에 적은 질의 글뿐이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: WORKS_ON1 16행과 두 질의의 답, DEPT_INFO 세 행, 카탈로그에 정의만 있는 것, 직원을 넣은 뒤 바뀌는 답, DROP VIEW, DEPT5EMP 4행, BASIC_EMP_DATA 8행 3열, 카드 C2·C3 — [75_sql-view_verify.py](/Hongs_Blog/studies/database-design/code/75_sql-view_verify/). PostgreSQL 16에서 실행: 뷰에만 조회 권한을 준 사용자가 기본 테이블을 못 읽는 것 — [75_sql-view_verify.sql](/Hongs_Blog/studies/database-design/code/75_sql-view_verify-sql/)</div>

</div>


## 정의

뷰는 다른 표들에서 끌어낸 표 하나다. 특정 행과 열만 골라내도 되고, 묶어서 요약한 값을 담아도 된다. 실제로 저장된 꼴로 있지 않아도 되므로 가상 테이블이라고도 부른다. 추가 저장 자리가 들지 않는다[^4].

- **기본 테이블(base table).** 튜플이 늘 데이터베이스에 실제로 저장돼 있는 표다. `CREATE TABLE`로 만든 EMPLOYEE, PROJECT 같은 표다[^4].
- **정의 테이블(defining table).** 어떤 뷰를 만드는 데 쓴 표다. `WORKS_ON1`의 정의 테이블은 EMPLOYEE, PROJECT, WORKS_ON 셋이다[^1].

뷰는 이렇게 만든다[^2].

```
CREATE VIEW <뷰 이름> AS <select 문>
```

`<select 문>`이 뷰에 무엇이 담기는지를 정한다.

**열 이름.** 이름을 따로 안 적으면 정의 테이블의 열 이름을 그대로 물려받는다. `WORKS_ON1`의 열은 Fname, Lname, Pname, Hours다[^2]. 뷰 이름 뒤 괄호에 이름을 직접 적어 줄 수도 있다[^5].

```sql
CREATE VIEW DEPT_INFO (Dept_name, No_of_emps, Total_sal)
AS SELECT   Dname, COUNT (*), SUM (Salary)
   FROM     DEPARTMENT, EMPLOYEE
   WHERE    Dnumber = Dno
   GROUP BY Dname;
```

| Dept_name | No_of_emps | Total_sal |
|---|---|---|
| Research | 4 | 133000 |
| Administration | 3 | 93000 |
| Headquarters | 1 | 55000 |

`COUNT (*)`와 `SUM (Salary)`는 계산해서 나온 열이라 물려받을 이름이 없다. 이름을 안 적으면 제품이 알아서 붙인다. SQLite는 `COUNT (*)`라는 글자를 그대로 열 이름으로 쓰고, PostgreSQL 16은 `count`, `sum`이라고 붙인다. 뒤에서 이 열을 가리켜 쓰려면 직접 이름을 주는 편이 낫다[^s1].

**질의.** 뷰에 던지는 질의는 기본 테이블에 던지는 질의와 똑같이 쓴다. 제한이 없다[^3].

**늘 최신이다.** 정의 테이블의 튜플을 고치면 뷰는 그 변화를 저절로 담아야 한다. 뷰를 최신으로 맞추는 일은 사용자가 아니라 DBMS의 몫이다[^6]. 5번 부서에 급여 27000인 직원 한 명을 넣고 `DEPT_INFO`를 다시 물으면, 뷰를 새로 만들지 않았는데도 Research 줄이 (Research, 5, 160000)으로 나온다[^s1]. DBMS가 이 일을 어떻게 해내는지는 [질의 수정과 뷰 실체화](/Hongs_Blog/studies/database-design/view-implementation/)에서 다룬다.

**지우기.** 더 쓰지 않는 뷰는 `DROP VIEW`로 지운다. 뷰만 없어지고 정의 테이블은 그대로다[^7].

```sql
DROP VIEW WORKS_ON1;
```

## 보이는 범위 줄이기

뷰는 어떤 사용자에게 보이면 안 되는 행이나 열을 가리는 데에도 쓴다[^8].

**행 가리기.** 5번 부서 직원의 정보만 봐도 되는 사용자가 있다. 이 뷰를 만들고, 그 사용자에게 EMPLOYEE가 아니라 뷰를 조회할 권한만 준다. 그 사용자에게는 `Dno = 5`인 네 명만 보인다[^8].

```sql
CREATE VIEW DEPT5EMP AS
SELECT *
FROM   EMPLOYEE
WHERE  Dno = 5;
```

**열 가리기.** 민감한 열은 빼고 이름과 주소만 보이게 한다. 급여(Salary)와 Ssn은 이 뷰에 없다[^9].

```sql
CREATE VIEW BASIC_EMP_DATA AS
SELECT Fname, Lname, Address
FROM   EMPLOYEE;
```

PostgreSQL 16에서 사용자를 하나 만들어 두 뷰에만 조회 권한을 주고 그 사용자로 질의해 보았다. `DEPT5EMP`에서는 4행, `BASIC_EMP_DATA`에서는 8행이 나왔다. `SELECT … FROM EMPLOYEE`는 "permission denied for table employee"로 거부되었고, `BASIC_EMP_DATA`에서 Salary를 고르는 질의는 그런 열이 없다는 오류가 났다[^s2].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 13주차 슬라이드 p.4 "Enhance security (p.20)"<br>
문제점: p.20은 뷰 갱신 예제다. 보안 이야기(Views as Authorization)는 p.25~26에 있다.<br>
수정안: "(p.25)"로 읽는다.<br>
근거: 같은 덱의 p.20, p.25, p.26.

</div>


## 활용

- **쓰는 때 둘.** 조인이나 집계가 들어간 복잡한 질의를 자주 던질 때 질의를 짧게 만든다. 권한이 없는 사용자에게 일부만 보여 준다[^1].
- **뷰 위에 뷰.** 뷰도 표처럼 쓰이므로 뷰를 정의 테이블로 삼아 또 뷰를 만들 수 있다. `DEPT5EMP`에서 급여 30000 이상인 사람의 이름만 고른 뷰를 만들어 확인했다[^s1].
- **흔한 실수 1.** 뷰에 질의하면 조인을 안 하니까 빠르다고 생각하는 것. 질의 글이 짧아질 뿐이다. 뷰를 저장해 두지 않는 한 DBMS는 물을 때마다 세 표를 잇는다.
- **흔한 실수 2.** 뷰가 기대고 있는 기본 테이블을 지우는 것. PostgreSQL 16은 뷰가 기대는 표를 지우려 하면 오류를 내고, `CASCADE`를 붙이면 뷰까지 함께 지운다. SQLite는 표를 그냥 지우고, 남은 뷰는 질의할 때 "no such table" 오류를 낸다[^s2].

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [GROUP BY](/Hongs_Blog/studies/database-design/group-by/)
- [3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/)에서 사용자마다 다른 모습을 보여 주던 맨 위 단계를 SQL에서 만드는 도구가 뷰다. [데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/)의 "여러 뷰"도 같은 이야기다.
- 뷰를 최신으로 맞추는 두 방법: [질의 수정과 뷰 실체화](/Hongs_Blog/studies/database-design/view-implementation/)
- 뷰를 거쳐 고치기: [뷰 갱신 문제](/Hongs_Blog/studies/database-design/view-update-problem/)
- 헷갈리는 짝: [뷰와 기본 테이블 비교](/Hongs_Blog/studies/database-design/view-vs-base-table/)
- 연습: [뷰 연습](/Hongs_Blog/studies/database-design/view-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"뷰는 만들 때의 데이터를 복사해 둔 표다"</div>

틀렸다. 뷰가 표처럼 보이고 `SELECT * FROM 뷰`로 행이 나오니 어딘가에 그 행들이 저장돼 있다고 생각하기 쉽다. 실제로 저장되는 것은 `CREATE VIEW` 뒤에 적은 질의 글이다. SQLite의 카탈로그를 보면 기본 테이블 WORKS_ON에는 저장 자리 번호가 있고, 뷰 WORKS_ON1에는 정의 글만 있고 저장 자리는 0이다. 확인하는 법: 뷰와 나란히 `CREATE TABLE … AS SELECT`로 진짜 복사본을 떠 둔 뒤 5번 부서에 직원을 한 명 넣는다. 뷰는 (Research, 5, 160000)을 내고, 복사본은 (Research, 4, 133000)에 그대로 있다[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 뷰와 기본 테이블은 무엇이 다른가? 직원 이름과 프로젝트 이름, 일한 시간을 한 표처럼 보여 주는 뷰 `WORKS_ON1`을 만드는 문장을 쓰라.</summary>

**답:** 기본 테이블은 튜플이 실제로 저장돼 있다. 뷰는 다른 표에서 끌어낸 표이고 정의(질의)만 저장된다.
```sql
CREATE VIEW WORKS_ON1
AS SELECT Fname, Lname, Pname, Hours
   FROM   EMPLOYEE, PROJECT, WORKS_ON
   WHERE  Ssn = Essn AND Pno = Pnumber;
```
**이유:** 조인 조건 둘이 빠지면 세 표의 모든 조합이 나온다. 열 이름을 따로 안 적었으니 뷰의 열은 Fname, Lname, Pname, Hours다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `DEPT_INFO`를 만든 다음 날, EMPLOYEE에 5번 부서 직원 한 명(급여 27000)이 새로 들어왔다. `SELECT * FROM DEPT_INFO`의 Research 줄은 어떻게 나오는가? 뷰를 다시 만들어야 하는가? 까닭을 대라.</summary>

**답:** (Research, 5, 160000)이다. 다시 만들 필요가 없다.<br>
**이유:** 뷰에는 행이 아니라 질의가 저장돼 있고, DBMS가 뷰를 늘 최신으로 맞춘다. 흔한 오답은 "만들 때의 (Research, 4, 133000)이 나온다"이다. 그것은 `CREATE TABLE … AS SELECT`로 뜬 복사본의 동작이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `DEPT5EMP` 위에 "급여가 30000 이상인 사람의 이름"만 보이는 뷰 `DEPT5_NAMES`를 만들라. 슬라이드 상태에서 누가 보이는가? Smith의 급여를 29000으로 내리면?</summary>

**답:**
```sql
CREATE VIEW DEPT5_NAMES AS
SELECT Fname, Lname
FROM   DEPT5EMP
WHERE  Salary >= 30000;
```
Narayan(38000), Smith(30000), Wong(40000)이 보인다. Smith의 급여를 29000으로 내리면 Narayan과 Wong만 보인다.<br>
**이유:** 뷰를 정의 테이블로 삼아 뷰를 만들 수 있다. `DEPT5EMP`가 5번 부서 네 명을 내고, 그 가운데 English(25000)가 조건에서 빠진다. 기본 테이블이 바뀌면 그 위에 얹힌 뷰들이 모두 따라 바뀐다[^s1].

</details>


[^1]: 데이터베이스 설계 13회 강의 자료 「13-View」, p.4 (Motivation of Views: 세 표를 매번 조인해야 하는 예, defining table, 보안)
[^2]: 같은 자료, p.5 (CREATE VIEW <view name> AS <select statement>, WORKS_ON1)
[^3]: 같은 자료, p.7 (Specifying Queries on a View), p.30 (연습 0의 답: 뷰 없이 세 표를 조인한 질의)
[^4]: 같은 자료, p.3 (Concept of a View in SQL: derived, virtual table, base table)
[^5]: 같은 자료, p.6 (Attribute names can be specified explicitly, DEPT_INFO)
[^6]: 같은 자료, p.8 (A view is supposed to be always Up-to-Date)
[^7]: 같은 자료, p.14 (Dropping Views in SQL)
[^8]: 같은 자료, p.25 (Views as Authorization, DEPT5EMP)
[^9]: 같은 자료, p.26 (BASIC_EMP_DATA, "Some attributes might be sensitive")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> WORKS_ON1을 펼친 표, DEPT_INFO의 세 행, 이름을 안 붙인 열의 이름, 직원을 넣은 뒤의 (Research, 5, 160000), 뷰 위의 뷰, 카탈로그의 저장 자리, 복사본과의 비교, 카드 C2·C3은 슬라이드에 없다. SQLite 3.50.4와 PostgreSQL 16에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.25는 "뷰를 조회할 권한만 준다"고 글로만 적는다. PostgreSQL 16에서 사용자를 만들어 `GRANT SELECT ON DEPT5EMP, BASIC_EMP_DATA`만 준 뒤 그 사용자로 실행해 확인했다. 뷰가 기대는 표를 지울 때의 동작도 두 제품에서 실행한 결과다.
{% endraw %}
