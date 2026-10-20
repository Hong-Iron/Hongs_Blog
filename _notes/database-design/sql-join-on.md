---
layout: "note"
title: "FROM 절의 조인 (JOIN ON)"
display_title: "FROM 절의 조인 (JOIN ON)"
kind: "concept"
kind_label: "정의"
num: "64"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["JOIN ON", "Joined Table", "조인된 테이블", "조인 테이블", "JOIN 절", "INNER JOIN", "조인 조건", "Join Condition"]
description: "두 표를 이을 때 \"어느 열끼리 맞출지\"와 \"어떤 행만 남길지\"를 한 조건문에 섞어 쓰면, 질의가 길어질수록 무엇이 무엇인지 읽기 어렵다. 표를 잇는 말을 표 이름을 적는 자리로 옮기면 \"이 두 표를 이 열로 이어 붙인 큰 표 하나\"가 먼저 보이고, 행을 고르는 조건만 따로 남는다…"
prev_url: "/studies/database-design/sql-null/"
prev_title: "NULL 값과 IS NULL"
next_url: "/studies/database-design/natural-join/"
next_title: "자연 조인 NATURAL JOIN"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "64_sql-join-on_verify.py", "u": "/studies/database-design/code/64_sql-join-on_verify/", "r": "검증"}]
permalink: "/studies/database-design/sql-join-on/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 표를 이을 때 "어느 열끼리 맞출지"와 "어떤 행만 남길지"를 한 조건문에 섞어 쓰면, 질의가 길어질수록 무엇이 무엇인지 읽기 어렵다. 표를 잇는 말을 표 이름을 적는 자리로 옮기면 "이 두 표를 이 열로 이어 붙인 큰 표 하나"가 먼저 보이고, 행을 고르는 조건만 따로 남는다. 결과는 섞어 쓴 것과 같다. 이어 붙인 표에는 앞 표의 열이 모두 나오고 그 뒤에 뒤 표의 열이 모두 나오며, 맞춘 두 열도 둘 다 남는다.

</div>


## 예시로 보기

"Research 부서에서 일하는 직원의 이름과 주소를 구하라." 지금까지는 표 둘을 `FROM`에 쉼표로 적고, 조건을 모두 `WHERE`에 적었다. 아래의 첫 질의가 그 꼴이다. 둘째 질의는 표를 잇는 조건을 `FROM`으로 옮긴 꼴이다.

```sql
-- 조건을 모두 WHERE에
SELECT Fname, Lname, Address
FROM   EMPLOYEE, DEPARTMENT
WHERE  Dname = 'Research' AND Dnumber = Dno;

-- 잇는 조건을 FROM으로
SELECT Fname, Lname, Address
FROM   (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)
WHERE  Dname = 'Research';
```

첫 질의의 `WHERE`에는 성격이 다른 조건 둘이 섞여 있다. `Dnumber = Dno`는 직원과 그 직원의 부서를 짝짓는 조건이고, `Dname = 'Research'`는 짝지은 행 가운데 일부만 고르는 조건이다. 표가 둘이면 괜찮지만 넷, 다섯이 되면 잇는 조건 하나를 빠뜨리기 쉽고, 빠뜨리면 모든 조합이 쏟아진다([WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/)). 둘째 질의는 잇는 조건이 표 바로 옆의 `ON`에 붙어 있어 빠졌는지 한눈에 보인다.

두 질의는 같은 4행(Smith, Wong, Narayan, English)을 낸다.

`(EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)`가 만드는 큰 표는 8행 14열이다. 직원마다 자기 부서의 행이 옆에 붙는다. 열을 몇 개만 골라 보면 이렇다.

| Lname | … | Dno | Dname | Dnumber | Mgr_ssn | … |
|---|---|---|---|---|---|---|
| Smith | | 5 | Research | 5 | 333445555 | |
| Wong | | 5 | Research | 5 | 333445555 | |
| Zelaya | | 4 | Administration | 4 | 987654321 | |
| Wallace | | 4 | Administration | 4 | 987654321 | |
| Narayan | | 5 | Research | 5 | 333445555 | |
| English | | 5 | Research | 5 | 333445555 | |
| Jabbar | | 4 | Administration | 4 | 987654321 | |
| Borg | | 1 | Headquarters | 1 | 888665555 | |

`Dno`와 `Dnumber`는 값이 같은 채로 둘 다 남는다. `WHERE Dname = 'Research'`는 이 큰 표에서 네 행을 고른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 질의의 4행, 이어 붙인 표의 8행 14열과 열 순서, 세 표를 이은 판의 2행, 고르는 조건을 `ON`에 옮긴 판, 카드 C1·C2 — [64_sql-join-on_verify.py](/Hongs_Blog/studies/database-design/code/64_sql-join-on_verify/)</div>

</div>


## 정의

`FROM` 절에 표 이름 대신 "두 표를 이은 결과"를 적은 것을 조인된 표(joined table)라 한다.

```
FROM (표1 JOIN 표2 ON 잇는 조건)
```

- `ON` 뒤에는 두 표의 행을 짝짓는 조건(조인 조건)을 적는다. 행을 고르는 조건(선택 조건)은 `WHERE`에 남긴다.
- 결과 표의 열은 표1의 열 전부, 그 뒤에 표2의 열 전부다. EMPLOYEE가 10열, DEPARTMENT가 4열이라 14열이다.
- 짝이 있는 행만 결과에 나온다. 이것이 기본인 내부 조인(inner join)이다. 짝이 없는 행도 남기려면 [외부 조인](/Hongs_Blog/studies/database-design/outer-join/)을 쓴다.

기호로 쓰면, 표1의 상태를 $$r_1$$, 표2의 상태를 $$r_2$$, 잇는 조건을 $$c$$라 할 때 결과는 $$\{\,(t_1, t_2) : t_1 \in r_1,\ t_2 \in r_2,\ c(t_1, t_2)\text{가 참}\,\}$$이다. $$t_1 \in r_1$$은 "$$t_1$$이 표1의 행 가운데 하나"라는 뜻이고, $$(t_1, t_2)$$는 두 행을 옆으로 이어 붙인 행이다. 모든 조합 가운데 조건이 참인 것만 남긴다는 말이다[^s1].

조인된 표를 다시 다른 표와 이을 수 있다. "Stafford에 있는 프로젝트마다 번호, 맡은 부서 번호, 그 부서 관리자의 성"을 묻는 질의는 표 셋을 차례로 잇는다[^s1].

```sql
SELECT Pnumber, Dnum, Lname, Address, Bdate
FROM   ((PROJECT JOIN DEPARTMENT ON Dnum = Dnumber)
        JOIN EMPLOYEE ON Mgr_ssn = Ssn)
WHERE  Plocation = 'Stafford';
```

프로젝트에 부서를 붙이고, 그 결과에 관리자인 직원을 붙인다. 결과는 (10, 4, Wallace, …), (30, 4, Wallace, …) 2행으로, 조건을 모두 `WHERE`에 적은 판([SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/))과 같다.

## 활용

- 잇는 조건은 대개 "외래 키 = 그것이 가리키는 기본 키"다. `Dno = Dnumber`, `Mgr_ssn = Ssn`, `Essn = Ssn`이 모두 그렇다([참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)). 스키마 그림의 화살표를 따라가며 `ON`을 적으면 된다.
- 내부 조인에서는 고르는 조건을 `ON`에 `AND`로 붙여도 결과가 같다. `ON Dno = Dnumber AND Dname = 'Research'`도 같은 4행이다. 외부 조인에서는 결과가 달라지므로([외부 조인](/Hongs_Blog/studies/database-design/outer-join/)), 잇는 조건은 `ON`, 고르는 조건은 `WHERE`로 나눠 적는 버릇이 안전하다[^s1].
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/)의 p2, [조인 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/join-query-ladder/), [JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/)

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
- 잇는 조건을 생략하는 꼴: [자연 조인 NATURAL JOIN](/Hongs_Blog/studies/database-design/natural-join/)
- 짝 없는 행을 남기는 꼴: [외부 조인](/Hongs_Blog/studies/database-design/outer-join/), [내부 조인과 외부 조인 비교](/Hongs_Blog/studies/database-design/inner-vs-outer-join/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SELECT E.Lname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn;`을 `JOIN … ON`으로 바꿔 쓰고 결과의 행 수를 쓰라.</summary>

**답:** `SELECT E.Lname, S.Lname FROM (EMPLOYEE AS E JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn);` 7행이다.<br>
**이유:** `WHERE`에 있던 조건은 직원과 상사를 짝짓는 조건이라 `ON`으로 간다. 고르는 조건이 없어 `WHERE`는 사라진다. 상사가 없는 Borg는 짝이 없어 빠지므로 8행이 아니라 7행이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** PROJECT의 열은 (Pname, Pnumber, Plocation, Dnum)이고 6행, WORKS_ON의 열은 (Essn, Pno, Hours)이고 16행이다. `SELECT * FROM (PROJECT JOIN WORKS_ON ON Pnumber = Pno);`의 결과는 몇 행 몇 열이고 열은 어떤 순서인가?</summary>

**답:** 16행 7열. 열은 Pname, Pnumber, Plocation, Dnum, Essn, Pno, Hours 순서다.<br>
**이유:** WORKS_ON의 행마다 `Pno`가 가리키는 프로젝트가 정확히 하나 있어 16행이다. 열은 앞 표의 것 4개 뒤에 뒤 표의 것 3개가 온다. `Pnumber`와 `Pno`는 둘 다 남는다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "5번 부서가 맡은 프로젝트에서 20시간 넘게 일하는 직원"을 구하려 한다. 조건 `Pnumber = Pno`, `Essn = Ssn`, `Dnum = 5`, `Hours > 20` 가운데 `ON`에 적을 것과 `WHERE`에 적을 것을 가르라.</summary>

**답:** `ON`에는 `Pnumber = Pno`와 `Essn = Ssn`, `WHERE`에는 `Dnum = 5`와 `Hours > 20`.<br>
**이유:** 앞의 둘은 서로 다른 표의 열을 맞춰 행을 짝짓는다. 뒤의 둘은 한 행 안의 값만 보고 그 행을 남길지 정한다. 가르는 질문은 "이 조건이 두 표를 잇는가, 이어진 행을 거르는가"다. 이렇게 쓴 질의 `FROM ((PROJECT JOIN WORKS_ON ON Pnumber = Pno) JOIN EMPLOYEE ON Essn = Ssn) WHERE Dnum = 5 AND Hours > 20`은 Smith와 Narayan을 낸다[^s1].

</details>


[^s1]: 세 표를 이은 꼴은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Joined Tables in SQL and Outer Joins"의 꼴을 따랐다. 결과는 검증 코드로 실행해 확인했다.
{% endraw %}
