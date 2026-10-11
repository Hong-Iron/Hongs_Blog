---
layout: "note"
title: "제약 위반 찾기 연습"
display_title: "제약 위반 찾기 연습"
kind: "practice"
kind_label: "연습"
num: "52"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 갱신 연산과 제약 위반의 판정표. 키 제약, 개체 무결성, 참조 무결성."
prev_url: "/studies/database-design/university-mapping-practice/"
prev_title: "UNIVERSITY 사상 연습"
next_url: "/studies/database-design/library-ddl-practice/"
next_title: "LIBRARY 스키마 DDL 연습"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/constraint-violation-practice/"
---
{% raw %}
사용 개념: [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)의 판정표. 키 제약, 개체 무결성, 참조 무결성.

"이 연산이 어기는 제약을 모두 말하라"는 문제는 늘 같은 차례로 푼다. ① 연산의 종류 보기: 삽입이면 세 제약을 모두, 삭제면 참조 무결성만, 수정이면 고치는 칸이 기본 키인지 외래 키인지부터 본다 ② 키 따지기: 새 키 값이 이미 있는가, 기본 키에 NULL이 있는가 ③ 가리키는 쪽 따지기: 새 외래 키 값이 상대 표에 있는가 ④ 가리킴 받는 쪽 따지기: 지우거나 고치는 키 값을 가리키던 행이 있는가[^s1].

## 문제 p1 · 열한 가지 연산

아래 연산을 [COMPANY의 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 하나씩 따로 적용한다고 하자. 앞의 연산이 한 일은 다음 연산에 남지 않는다. 연산마다 어기는 무결성 제약을 모두 말하고, 그 제약을 지키게 하는 방법을 말하라[^1].

- a. EMPLOYEE에 〈'Robert', 'F', 'Scott', '943775543', '1972-06-21', '2365 Newcastle Rd, Bellaire, TX', M, 58000, '888665555', 1〉을 넣는다.
- b. PROJECT에 〈'ProductA', 4, 'Bellaire', 2〉를 넣는다.
- c. DEPARTMENT에 〈'Production', 4, '943775543', '2007-10-01'〉을 넣는다.
- d. WORKS_ON에 〈'677678989', NULL, '40.0'〉을 넣는다.
- e. DEPENDENT에 〈'453453453', 'John', 'M', '1990-12-12', 'spouse'〉를 넣는다.
- f. WORKS_ON에서 Essn = '333445555'인 행들을 지운다.
- g. EMPLOYEE에서 Ssn = '987654321'인 행을 지운다.
- h. PROJECT에서 Pname = 'ProductX'인 행을 지운다.
- i. DEPARTMENT에서 Dnumber = 5인 행의 Mgr_ssn과 Mgr_start_date를 '123456789'와 '2007-10-01'로 고친다.
- j. EMPLOYEE에서 Ssn = '999887777'인 행의 Super_ssn을 '943775543'으로 고친다.
- k. WORKS_ON에서 Essn = '999887777'이고 Pno = 10인 행의 Hours를 '5.0'으로 고친다.

풀 때 필요한 값만 모으면 다음과 같다.

| 표 | 지금 들어 있는 키 값 |
|---|---|
| EMPLOYEE (Ssn) | 123456789, 333445555, 999887777, 987654321, 666884444, 453453453, 987987987, 888665555 |
| DEPARTMENT (Dnumber) | 5, 4, 1 |
| PROJECT (Pnumber) | 1, 2, 3, 10, 20, 30 |

풀이 전략: 삽입(a~e)은 새 행의 키와 외래 키를 위 표에 하나씩 대 본다. 삭제(f~h)는 "이 행을 가리키는 행이 어느 표에 있는가"만 찾는다. 수정(i~k)은 고치는 칸이 무엇인지부터 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">a의 답</summary>

1. *연산의 종류:* 삽입. 세 제약을 모두 본다.
2. *키 따지기:* Ssn 943775543은 표에 없는 새 값이고 NULL이 아니다.
3. *가리키는 쪽 따지기:* Super_ssn 888665555는 직원 Borg의 번호다. Dno 1인 부서도 있다.
4. *답:* 어기는 제약이 없다. 들어간다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">b의 답</summary>

1. *키 따지기:* Pnumber 4와 Pname 'ProductA'는 둘 다 새 값이다.
2. *가리키는 쪽 따지기:* Dnum 2가 가리킬 부서가 없다. 부서는 5, 4, 1번뿐이다.
3. *답:* 참조 무결성을 어긴다.
4. *지키게 하는 방법:* 거부한다. 넣고 싶으면 Dnum을 있는 부서 번호로 고쳐 넣거나, 2번 부서를 DEPARTMENT에 먼저 넣고 나서 넣는다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">c의 답</summary>

1. *키 따지기:* Dnumber 4는 이미 Administration의 번호다. 키 제약 위반.
2. *가리키는 쪽 따지기:* Mgr_ssn 943775543인 직원이 없다. 참조 무결성 위반.
3. *답:* 키 제약과 참조 무결성을 함께 어긴다.
4. *지키게 하는 방법:* 거부한다. 넣으려면 부서 번호를 안 쓰는 번호로 바꾸고, 관리자를 있는 직원으로 바꾸거나 그 직원을 먼저 넣는다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">d의 답</summary>

1. *키 따지기:* WORKS_ON의 기본 키는 {Essn, Pno}다. Pno가 NULL이다. 개체 무결성 위반.
2. *가리키는 쪽 따지기:* Essn 677678989인 직원이 없다. 참조 무결성 위반.
3. *답:* 개체 무결성과 참조 무결성을 함께 어긴다.
4. *지키게 하는 방법:* 거부한다. 넣으려면 Pno에 있는 프로젝트 번호를 적고, Essn을 있는 직원 번호로 바꾸거나 그 직원을 먼저 넣는다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">e의 답</summary>

1. *키 따지기:* 기본 키 {Essn, Dependent_name}의 값 (453453453, John)은 새 짝이고 NULL이 없다.
2. *가리키는 쪽 따지기:* Essn 453453453은 직원 Joyce English의 번호다.
3. *답:* 어기는 제약이 없다. Joyce의 배우자가 부양가족으로 더해진다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">f의 답</summary>

1. *연산의 종류:* 삭제. 지우는 행을 가리키는 행이 있는지만 본다.
2. *가리킴 받는 쪽 따지기:* WORKS_ON을 가리키는 외래 키는 어느 표에도 없다.
3. *답:* 어기는 제약이 없다. Wong이 일한 기록 네 행이 지워져 WORKS_ON이 16행에서 12행이 된다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">g의 답</summary>

1. *가리킴 받는 쪽 따지기:* Ssn 987654321(Wallace)을 가리키는 행을 찾는다. EMPLOYEE 2행(Zelaya와 Jabbar의 Super_ssn), DEPARTMENT 1행(Administration의 Mgr_ssn), WORKS_ON 2행, DEPENDENT 1행(Abner). 네 표의 여섯 행이다.
2. *답:* 참조 무결성을 어긴다.
3. *지키게 하는 방법:* 거부한다. 지우려면 여섯 행을 먼저 처리한다. 부하 둘의 Super_ssn은 NULL로 비울 수 있다. Administration의 Mgr_ssn은 비울 수 없는 칸이라 다른 직원으로 바꾼다. WORKS_ON과 DEPENDENT의 행은 Essn이 기본 키의 한 부분이라 비울 수 없으므로 함께 지운다. 이런 뒤처리를 외래 키에 미리 적어 두는 방법이 [참조 동작](/Hongs_Blog/studies/database-design/referential-triggered-actions/)이다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">h의 답</summary>

1. *가리킴 받는 쪽 따지기:* ProductX는 1번 프로젝트다. WORKS_ON의 두 행 (123456789, 1)과 (453453453, 1)이 가리킨다.
2. *답:* 참조 무결성을 어긴다.
3. *지키게 하는 방법:* 거부한다. 지우려면 WORKS_ON의 그 두 행을 먼저(또는 함께) 지운다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">i의 답</summary>

1. *고치는 칸:* Mgr_ssn은 EMPLOYEE를 가리키는 외래 키다. Mgr_start_date는 키도 외래 키도 아니다.
2. *가리키는 쪽 따지기:* 새 값 123456789는 직원 Smith의 번호다.
3. *답:* 어기는 제약이 없다. Research 부서의 관리자가 Smith로 바뀌고 시작 날짜가 고쳐진다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">j의 답</summary>

1. *고치는 칸:* Super_ssn은 EMPLOYEE를 가리키는 외래 키다.
2. *가리키는 쪽 따지기:* 새 값 943775543인 직원이 없다.
3. *답:* 참조 무결성을 어긴다.
4. *지키게 하는 방법:* 거부한다. 고치려면 있는 직원의 번호나 NULL로 고치거나, 그 번호의 직원을 먼저 넣는다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">k의 답</summary>

1. *고치는 칸:* Hours는 기본 키에도 외래 키에도 들지 않는다.
2. *답:* 어기는 제약이 없다. 10.0이 5.0이 된다.
3. *교훈:* 기본 키에도 외래 키에도 들지 않은 속성을 고치는 것은 대개 문제를 일으키지 않는다[^2].

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">한눈에 보는 답</summary>

| 연산 | 어기는 제약 |
|---|---|
| a | 없음 |
| b | 참조 무결성 |
| c | 키 제약, 참조 무결성 |
| d | 개체 무결성, 참조 무결성 |
| e | 없음 |
| f | 없음 |
| g | 참조 무결성 |
| h | 참조 무결성 |
| i | 없음 |
| j | 참조 무결성 |
| k | 없음 |

</details>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 풀이 슬라이드 p.4의 (c) "Key constraint is violated. A tuple with Dnumber=4 already exists" / 문제점: 키 제약만 적혀 있다. Mgr_ssn 943775543인 직원이 없어서 참조 무결성도 어긴다 / 수정안: (c)는 키 제약과 참조 무결성을 함께 어긴다 / 근거: 번호만 안 쓰는 6으로 바꿔 넣어도 외래 키 오류로 거부된다. 다만 (a)를 먼저 했다고 치면 943775543이 직원이 되어 키 제약 하나만 남는다. 문제는 "따로 적용한다"고 했으므로 둘 다 적는 것이 맞다 — [52_constraint-violation-practice_p1.py](/Hongs_Blog/studies/database-design/code/52_constraint-violation-practice_p1/)

</div>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 풀이 슬라이드 p.2~12에는 (j)의 쪽이 없다. (i)의 쪽(p.10) 다음이 (k)의 쪽(p.11)이다 / 문제점: (j)의 답이 빠졌다 / 수정안: (j)는 참조 무결성을 어긴다 / 근거: Ssn이 943775543인 직원이 없고, 이 수정은 SQLite와 PostgreSQL 16 모두 외래 키 오류로 거부한다 — [52_constraint-violation-practice_p1.py](/Hongs_Blog/studies/database-design/code/52_constraint-violation-practice_p1/)

</div>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 풀이 슬라이드 p.2의 (a) "None of the integrity constraints is violated" / 문제점: (a)의 주소 '2365 Newcastle Rd, Bellaire, TX'는 31글자다. 슬라이드 9 p.17의 문장은 Address를 `VARCHAR(30)`으로 만든다. 그 문장대로 만든 표에는 이 주소가 들어가지 않는다 / 수정안: 키 제약, 개체 무결성, 참조 무결성은 풀이대로 어기지 않는다. 자료형의 길이까지 따지면 한 글자가 넘친다 / 근거: PostgreSQL 16은 "값이 너무 길다"는 오류로 (a)를 막고, 주소를 30글자 안으로 줄이면 받는다. SQLite는 길이를 검사하지 않아 그대로 받는다 — [52_constraint-violation-practice_p1.sql](/Hongs_Blog/studies/database-design/code/52_constraint-violation-practice_p1-sql/)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 열한 연산의 판정, 두 제약을 함께 어기는 (c)·(d)를 한쪽씩 고쳐 따로 확인, 가리키는 행의 수, 지키게 하는 방법대로 했을 때 통과하는지(SQLite) — [52_constraint-violation-practice_p1.py](/Hongs_Blog/studies/database-design/code/52_constraint-violation-practice_p1/). 같은 판정과 (a)의 주소 길이는 PostgreSQL 16에서 실행 — [52_constraint-violation-practice_p1.sql](/Hongs_Blog/studies/database-design/code/52_constraint-violation-practice_p1-sql/)</div>

</div>


## 변형 문제

같은 상태에 다음 연산을 하나씩 따로 적용한다. 어기는 제약을 모두 말하라[^s1].

1. DEPT_LOCATIONS에 〈4, 'Stafford'〉를 넣는다.
2. DEPARTMENT에서 Dnumber = 4인 행을 지운다.
3. PROJECT에서 Pnumber = 30인 행의 Pnumber를 20으로 고친다. 40으로 고치면 어떻게 달라지는가?
4. DEPENDENT에서 Essn = '987654321'이고 Dependent_name = 'Abner'인 행의 Relationship을 'Husband'로 고친다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

1. 키 제약. 기본 키 {Dnumber, Dlocation}의 짝 (4, Stafford)가 이미 있다. 4번 부서는 있으므로 참조 무결성은 지킨다.
2. 참조 무결성. 4번 부서를 EMPLOYEE 3행(Zelaya, Wallace, Jabbar의 Dno), DEPT_LOCATIONS 1행, PROJECT 2행(Computerization, Newbenefits)이 가리킨다.
3. 20으로 고치면 키 제약(20번이 이미 있다)과 참조 무결성(옛 번호 30을 가리키던 WORKS_ON 3행)을 함께 어긴다. 40으로 고치면 키 제약은 지키지만 참조 무결성은 똑같이 어긴다.
4. 없음. Relationship은 기본 키에도 외래 키에도 들지 않는다.

</details>


[^1]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.30~31. 같은 문제가 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.7~8에 "Exercise 2"로 다시 나온다. 풀이는 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.2~12
[^2]: 데이터베이스 설계 11회 강의 자료 「10-11-SQL-Solutions」, p.11~12 ("Lesson: Updating an attribute that is neither part of a primary key nor part of a foreign key usually causes no problems")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 풀이 슬라이드는 연산마다 어긴 제약의 이름과 한 줄 설명만 적는다. 푸는 차례, 하위목표로 나눈 풀이, "지키게 하는 방법", 가리키는 행의 수, 변형 문제와 그 답은 슬라이드에 없다. 모두 문제 코드로 확인했다.
{% endraw %}
