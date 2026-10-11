---
layout: "note"
title: "조인 질의 쓰기 예제 사다리"
display_title: "조인 질의 쓰기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "66"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: FROM 절의 조인 (JOIN ON), 외부 조인. 표와 행은 COMPANY다(관계형 데이터베이스 스키마와 상태)."
prev_url: "/studies/database-design/nested-query-ladder/"
prev_title: "중첩 질의 쓰기 예제 사다리"
next_url: "/studies/database-design/group-by-query-ladder/"
next_title: "GROUP BY 질의 쓰기 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/join-query-ladder/"
---
{% raw %}
사용 개념: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/), [외부 조인](/Hongs_Blog/studies/database-design/outer-join/). 표와 행은 COMPANY다([관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)).

"여러 표에서 값을 모아 와라"는 문제는 같은 하위목표의 되풀이다[^s1].

① **필요한 열 찾기.** 답에 내놓을 열과 조건에 쓰는 열이 어느 표에 있는지 적는다. 그 표들이 `FROM`에 들어간다.
② **잇는 열 짝 찾기.** 표와 표를 잇는 것은 [외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)와 그것이 가리키는 기본 키다. 표가 $$k$$개면 짝이 적어도 $$k - 1$$개 있어야 한다.
③ **짝 없는 행을 남길지 정하기.** 버려도 되면 `JOIN`, 남겨야 하면 남길 쪽을 왼쪽에 두고 `LEFT OUTER JOIN`.
④ **남은 조건을 쓰고 결과 내기.**

## 문제 1 · 완전한 풀이

'Research' 부서에서 일하는 모든 직원의 이름과 주소를 구하라[^1].

1. *필요한 열 찾기:* `Fname`, `Lname`, `Address`는 EMPLOYEE에 있다. 조건에 쓰는 'Research'는 DEPARTMENT의 `Dname`이다. 표는 둘이다.
2. *잇는 열 짝 찾기:* EMPLOYEE의 `Dno`가 DEPARTMENT의 `Dnumber`를 가리킨다. `Dno = Dnumber`.
3. *짝 없는 행을 남길지 정하기:* Research 직원만 원한다. 짝 없는 행은 필요 없다. `JOIN`.
4. *남은 조건을 쓰고 결과 내기:* `Dname = 'Research'`.

```sql
SELECT Fname, Lname, Address
FROM   (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)
WHERE  Dname = 'Research';
```

| Fname | Lname | Address |
|---|---|---|
| John | Smith | 731 Fondren, Houston, TX |
| Franklin | Wong | 638 Voss, Houston, TX |
| Ramesh | Narayan | 975 Fire Oak, Humble, TX |
| Joyce | English | 5631 Rice, Houston, TX |

조인 조건을 `WHERE`에 섞어 쓴 `FROM EMPLOYEE, DEPARTMENT WHERE Dname = 'Research' AND Dnumber = Dno`와 답이 같다. `JOIN … ON`으로 쓰면 "잇는 조건"과 "고르는 조건"이 다른 자리에 놓여 읽기 쉽다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [66_join-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/66_join-query-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

프로젝트마다 프로젝트 이름과, 그 프로젝트를 맡은 부서의 부서장 성을 구하라.

1. *필요한 열 찾기:* `Pname`은 PROJECT, 부서장의 성 `Lname`은 EMPLOYEE에 있다. PROJECT에서 부서장으로 곧장 가는 열은 없다. 부서를 거쳐야 하니 DEPARTMENT도 필요하다. 표는 셋이다.
2. *잇는 열 짝 찾기:* PROJECT의 `Dnum` = DEPARTMENT의 `Dnumber`. DEPARTMENT의 `Mgr_ssn` = EMPLOYEE의 `Ssn`. 표가 셋이니 짝은 둘이다.
3. *짝 없는 행을 남길지 정하기:* 모든 프로젝트에 맡은 부서가 있고(`Dnum`은 NOT NULL), 모든 부서에 부서장이 있다(`Mgr_ssn`은 NOT NULL). 짝 없는 행이 생기지 않는다. `JOIN`.
4. *남은 조건을 쓰고 결과 내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

남은 조건은 없다.
```sql
SELECT Pname, Lname
FROM   (PROJECT JOIN DEPARTMENT ON Dnum = Dnumber)
       JOIN EMPLOYEE ON Mgr_ssn = Ssn;
```

| Pname | Lname |
|---|---|
| ProductX | Wong |
| ProductY | Wong |
| ProductZ | Wong |
| Computerization | Wallace |
| Reorganization | Borg |
| Newbenefits | Wallace |

</details>


## 문제 3 · 하위목표 절반이 빈칸

모든 직원의 성과 그 직원의 부양가족 이름을 구하라. 부양가족이 없는 직원도 한 줄 나와야 한다.

1. *필요한 열 찾기:* `Lname`은 EMPLOYEE, `Dependent_name`은 DEPENDENT.
2. *잇는 열 짝 찾기:* DEPENDENT의 `Essn` = EMPLOYEE의 `Ssn`.
3. *짝 없는 행을 남길지 정하기:* ______
4. *남은 조건을 쓰고 결과 내기:* ______ (몇 줄이 나오는가?)

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 부양가족이 없는 직원은 DEPENDENT에 짝이 없다. 그래도 남겨야 한다. 남길 쪽인 EMPLOYEE를 왼쪽에 두고 `LEFT OUTER JOIN`을 쓴다.<br>
4.
```sql
SELECT Lname, Dependent_name
FROM   EMPLOYEE LEFT OUTER JOIN DEPENDENT ON Ssn = Essn;
```
12줄이다. 짝이 있는 줄이 7개다(Wong 3, Smith 3, Wallace 1). 부양가족이 없는 Zelaya, Narayan, English, Jabbar, Borg는 `Dependent_name`이 NULL인 줄로 하나씩 나와 5개다. `JOIN`으로 쓰면 7줄뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [66_join-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/66_join-query-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

부양가족이 한 명도 없는 직원의 성을, 중첩 질의를 쓰지 않고 조인으로 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT Lname
FROM   EMPLOYEE LEFT OUTER JOIN DEPENDENT ON Ssn = Essn
WHERE  Essn IS NULL;
```
Zelaya, Narayan, English, Jabbar, Borg. 다섯 명이다.

문제 3의 12줄에서 DEPENDENT 쪽이 NULL로 채워진 줄만 남긴 것이다. `Essn`은 DEPENDENT의 기본 키에 드는 열이라 진짜 행에서는 NULL일 수 없다. 그러니 `Essn IS NULL`인 줄은 짝이 없어서 채워진 줄뿐이다. `NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn)`으로 쓴 질의와 같은 답이다.

</details>


**변형.** 모든 부서에 대해 부서 이름과, 그 부서가 맡은 프로젝트 가운데 Houston에 있는 것의 이름을 구하라. Houston 프로젝트가 없는 부서도 한 줄 나와야 한다. `Plocation = 'Houston'`을 `ON`에 쓸 때와 `WHERE`에 쓸 때 결과가 어떻게 다른가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```sql
SELECT Dname, Pname
FROM   DEPARTMENT LEFT OUTER JOIN PROJECT
       ON Dnum = Dnumber AND Plocation = 'Houston';
```
3줄이다: (Research, ProductZ), (Headquarters, Reorganization), (Administration, NULL).

조건을 `WHERE Plocation = 'Houston'`으로 옮기면 2줄이다. Administration이 사라진다. `WHERE`는 조인이 끝난 뒤에 줄을 거른다. Administration의 프로젝트는 둘 다 Stafford에 있다. 둘 다 `WHERE`에서 떨어지고, NULL로 채운 줄은 애초에 만들어지지 않는다. `ON`에 쓰면 "Houston 프로젝트와만 짝을 지어라"가 되어, 짝이 없는 Administration이 NULL로 채워져 남는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [66_join-query-ladder_p4.py](/Hongs_Blog/studies/database-design/code/66_join-query-ladder_p4/)</div>

</div>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.20 (JOIN Tables in SQL: Research 부서 직원의 이름과 주소를 WHERE 판과 JOIN … ON 판으로 쓴 예. "Easier to comprehend than simply mixing together all the select and join conditions in WHERE clause")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 하위목표로 나눈 것, 문제 2~4와 변형은 원본에 없다. 문제 1의 질의는 슬라이드 p.20의 것이다. 문제 4의 꼴(LEFT JOIN 뒤 IS NULL)은 14주차 연습 2의 풀이가 쓰는 방법이다. 모든 답은 SQLite 3.50.4에서 실행해 확인했다.
{% endraw %}
