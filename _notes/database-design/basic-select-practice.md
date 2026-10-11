---
layout: "note"
title: "기본 검색 연습"
display_title: "기본 검색 연습"
kind: "practice"
kind_label: "연습"
num: "55"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: SELECT-FROM-WHERE의 투영 속성·선택 조건·조인 조건, 별칭과 자기 조인."
prev_url: "/studies/database-design/library-ddl-practice/"
prev_title: "LIBRARY 스키마 DDL 연습"
next_url: "/studies/database-design/nested-query-ladder/"
next_title: "중첩 질의 쓰기 예제 사다리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/basic-select-practice/"
---
{% raw %}
사용 개념: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)의 투영 속성·선택 조건·조인 조건, [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/).

말로 된 물음을 SQL로 옮기는 문제는 같은 차례로 푼다. ① 표 고르기: 꺼낼 칸과 조건에 나오는 칸이 어느 표에 있는지 찾아 `FROM`에 적는다 ② 표 잇기: 표가 $$n$$개면 잇는 조건을 적어도 $$n - 1$$개 적는다. 대개 "외래 키 = 그것이 가리키는 기본 키"다 ③ 행 고르기: 물음의 "~인"을 선택 조건으로 적는다 ④ 칸 꺼내기: `SELECT`에 적는다 ⑤ 결과 구하기: 상태 표에서 조건에 맞는 조합을 찾는다[^s1].

질의는 모두 [COMPANY의 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 대한 것이다. 질의를 쓰고 결과도 구한다.

## 문제 p1 · 표 셋 잇기

Stafford에 있는 프로젝트마다 프로젝트 번호, 그 프로젝트를 맡은 부서의 번호, 그 부서 관리자의 성과 주소와 생일을 구하라[^1].

풀이 전략: 꺼낼 칸이 흩어져 있다. 프로젝트 번호와 위치는 PROJECT에, 관리자가 누구인지는 DEPARTMENT에, 그 사람의 성과 주소는 EMPLOYEE에 있다. 표 셋을 줄줄이 잇는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *표 고르기:* PROJECT, DEPARTMENT, EMPLOYEE.
2. *표 잇기:* 프로젝트와 맡은 부서는 `Dnum = Dnumber`, 부서와 그 관리자는 `Mgr_ssn = Ssn`. 표가 셋이라 조건이 둘이다.
3. *행 고르기:* `Plocation = 'Stafford'`.
4. *칸 꺼내기:* Pnumber, Dnum, Lname, Address, Bdate.

```sql
SELECT Pnumber, Dnum, Lname, Address, Bdate
FROM   PROJECT, DEPARTMENT, EMPLOYEE
WHERE  Dnum = Dnumber AND Mgr_ssn = Ssn AND
       Plocation = 'Stafford';
```

{: start="5"}
5. *결과 구하기:* Stafford에 있는 프로젝트는 Computerization(10번)과 Newbenefits(30번)다. 둘 다 4번 부서 Administration이 맡고, 그 관리자는 Ssn이 987654321인 Wallace다.

| Pnumber | Dnum | Lname | Address | Bdate |
|---|---|---|---|---|
| 10 | 4 | Wallace | 291 Berry, Bellaire, TX | 1941-06-20 |
| 30 | 4 | Wallace | 291 Berry, Bellaire, TX | 1941-06-20 |

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [55_basic-select-practice_p1.py](/Hongs_Blog/studies/database-design/code/55_basic-select-practice_p1/)</div>

</div>


변형: Houston에 있는 프로젝트마다 프로젝트 번호, 맡은 부서의 번호, 그 부서 관리자의 성을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

위 질의에서 `Plocation = 'Houston'`으로 바꾸고 `SELECT Pnumber, Dnum, Lname`만 꺼낸다. 결과는 (3, 5, Wong), (20, 1, Borg)다. ProductZ는 5번 부서(관리자 Wong)가, Reorganization은 1번 부서(관리자 Borg)가 맡는다.

</details>


## 문제 p2 · 세 가지 질의

다음 세 질의를 SQL로 쓰고 결과를 구하라[^2].

- a. 5번 부서 직원 가운데 ProductX 프로젝트에서 주 10시간 넘게 일하는 직원의 이름
- b. 자기와 이름(first name)이 같은 부양가족이 있는 직원의 이름
- c. Franklin Wong이 직접 감독하는 직원의 이름

풀이 전략: a는 "누가(EMPLOYEE) 어느 프로젝트에서(PROJECT) 몇 시간(WORKS_ON)"이라 표가 셋이다. 가운데에서 둘을 이어 주는 표가 WORKS_ON이다. b는 직원과 그 직원의 부양가족을 잇고 이름을 견준다. c는 직원과 상사가 모두 EMPLOYEE에 있으니 같은 표를 두 번 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">a의 답</summary>

1. *표 고르기:* 이름과 부서는 EMPLOYEE, 프로젝트 이름은 PROJECT, 시간은 WORKS_ON.
2. *표 잇기:* 직원과 일한 기록은 `E.Ssn = W.Essn`, 일한 기록과 프로젝트는 `W.Pno = P.Pnumber`.
3. *행 고르기:* `E.Dno = 5`, `P.Pname = 'ProductX'`, `W.Hours > 10`.

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E, PROJECT AS P, WORKS_ON AS W
WHERE  E.Dno = 5 AND E.Ssn = W.Essn AND W.Pno = P.Pnumber
       AND P.Pname = 'ProductX' AND W.Hours > 10;
```

{: start="4"}
4. *결과 구하기:* ProductX는 1번 프로젝트다. WORKS_ON에서 Pno가 1인 행은 (123456789, 32.5시간)과 (453453453, 20.0시간)이다. 둘 다 10시간을 넘고, 두 사람 Smith와 English는 5번 부서다.

| Fname | Lname |
|---|---|
| John | Smith |
| Joyce | English |

</details>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 풀이 슬라이드 p.21의 `WHERE E.Dno=5 AND E.Ssn=W.Essn AND P.Pname='ProductX' AND E.Dno=P.Dnum AND W.Hours > 10;` / 문제점: 일한 기록과 프로젝트를 잇는 `W.Pno = P.Pnumber`가 없다. 그 자리에 있는 `E.Dno = P.Dnum`은 "직원의 부서가 그 프로젝트를 맡은 부서다"라는 조건일 뿐, 그 직원이 그 프로젝트에서 일했다는 조건이 아니다 / 수정안: 위 답처럼 `W.Pno = P.Pnumber`를 넣는다 / 근거: 적힌 그대로 돌리면 Smith, Narayan, English, English의 네 행이 나온다. 5번 부서 직원이 어느 프로젝트에서든 10시간 넘게 일한 기록이 하나씩 다 잡힌 것이다. 슬라이드가 표에 표시한 답은 Smith와 English 두 사람이고, 고친 질의가 그 답을 낸다 — [55_basic-select-practice_p2.py](/Hongs_Blog/studies/database-design/code/55_basic-select-practice_p2/)

</div>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">b의 답</summary>

1. *표 고르기:* EMPLOYEE와 DEPENDENT.
2. *표 잇기:* 직원과 그 직원의 부양가족은 `E.Ssn = D.Essn`.
3. *행 고르기:* 이름이 같다. `E.Fname = D.Dependent_name`.

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E, DEPENDENT AS D
WHERE  E.Ssn = D.Essn AND E.Fname = D.Dependent_name;
```

{: start="4"}
4. *결과 구하기:* 0행이다. 부양가족의 이름은 Alice, Theodore, Joy, Abner, Michael, Alice, Elizabeth이고 직원의 이름과 겹치는 것이 하나도 없다. 자기와 이름이 같은 부양가족을 둔 직원은 없다.

여기서 `E.Ssn = D.Essn`을 빼도 지금은 0행이라 답이 같아 보인다. 그러나 뜻이 달라진다. 뺀 질의는 "누구의 부양가족이든, 이름이 자기와 같은 사람이 있는 직원"을 찾는다. Smith에게 Joyce라는 딸이 생기면 Joyce English가 답으로 나와 버린다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">c의 답</summary>

1. *표 고르기:* 직원 쪽 EMPLOYEE(E)와 상사 쪽 EMPLOYEE(S). 같은 표에 별칭 둘을 붙인다.
2. *표 잇기:* 직원의 상사 번호가 상사의 번호다. `E.Super_ssn = S.Ssn`.
3. *행 고르기:* 상사 쪽의 이름이 Franklin Wong이다.

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E, EMPLOYEE AS S
WHERE  E.Super_ssn = S.Ssn
       AND S.Fname = 'Franklin' AND S.Lname = 'Wong';
```

{: start="4"}
4. *결과 구하기:* Wong의 Ssn은 333445555다. Super_ssn이 이 값인 직원은 셋이다.

| Fname | Lname |
|---|---|
| John | Smith |
| Ramesh | Narayan |
| Joyce | English |

풀이 슬라이드는 질의 안에 질의를 넣어 풀었다. 안쪽 질의가 먼저 Wong의 Ssn을 구하고, 바깥 질의가 그 값을 상사 번호로 가진 직원을 찾는다[^3]. 결과는 같다. 이 꼴은 [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)에서 다룬다.

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E
WHERE  E.Super_ssn = ( SELECT E.Ssn
                       FROM   EMPLOYEE AS E
                       WHERE  E.Fname = 'Franklin' AND E.Lname = 'Wong' );
```

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: a의 고친 질의(2행)와 슬라이드에 적힌 그대로(4행), b의 0행과 조인 조건을 뺐을 때 달라지는 예, c의 두 판(자기 조인, 중첩 질의)이 같은 3행, 변형의 답 — [55_basic-select-practice_p2.py](/Hongs_Blog/studies/database-design/code/55_basic-select-practice_p2/)</div>

</div>


변형: 같은 틀로 세 질의를 더 써 보라. (a′) 4번 부서 직원 가운데 Newbenefits 프로젝트에서 주 10시간 넘게 일하는 직원의 이름 (b′) 배우자(Relationship이 'Spouse')가 부양가족으로 올라 있는 직원의 이름 (c′) James Borg가 직접 감독하는 직원의 이름

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

(a′) a의 질의에서 `E.Dno = 4`, `P.Pname = 'Newbenefits'`로 바꾼다. 결과는 Alicia Zelaya(30.0시간), Jennifer Wallace(20.0시간)다. Jabbar는 5.0시간이라 빠진다.<br>
(b′) `SELECT E.Fname, E.Lname FROM EMPLOYEE AS E, DEPENDENT AS D WHERE E.Ssn = D.Essn AND D.Relationship = 'Spouse';` 결과는 Franklin Wong, Jennifer Wallace, John Smith다.<br>
(c′) c의 질의에서 `S.Fname = 'James' AND S.Lname = 'Borg'`로 바꾼다. 결과는 Franklin Wong, Jennifer Wallace다.

</details>


[^1]: 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.5 (Exercise 1). 풀이는 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.1
[^2]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.25 (Exercise 4). 풀이는 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.21~23
[^3]: 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.23 ("We need the Ssn of 'Franklin Wong'", "Nested SQL query")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 푸는 차례, 하위목표로 나눈 풀이, b에서 조인 조건을 뺐을 때의 설명, c의 자기 조인 판(슬라이드는 중첩 질의 판만 보인다), 변형 문제와 그 답은 슬라이드에 없다. 결과는 문제 코드로 확인했다.
{% endraw %}
