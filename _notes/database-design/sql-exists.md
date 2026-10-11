---
layout: "note"
title: "EXISTS와 NOT EXISTS"
display_title: "EXISTS와 NOT EXISTS (EXISTS and NOT EXISTS)"
kind: "concept"
kind_label: "정의"
num: "62"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["EXISTS", "NOT EXISTS", "EXISTS 함수", "존재 검사", "상관 중첩 질의", "Correlated Nested Query", "상관 부질의", "Correlated Subquery", "UNIQUE 함수"]
description: "직원마다 \"이 사람의 부양가족이 한 명이라도 있는가\"만 알고 싶을 때가 있다. 누구인지, 몇 명인지는 필요 없고 있다, 없다만 본다. 직원을 한 명씩 짚으면서 그 사람에게 딸린 행을 찾아보고, 하나라도 나오면 뽑는 것이 EXISTS이고 하나도 안 나와야 뽑는 것이 NOT EXIST…"
prev_url: "/studies/database-design/sql-any-all/"
prev_title: "ANY와 ALL"
next_url: "/studies/database-design/sql-null/"
next_title: "NULL 값과 IS NULL"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-exists/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직원마다 "이 사람의 부양가족이 한 명이라도 있는가"만 알고 싶을 때가 있다. 누구인지, 몇 명인지는 필요 없고 있다, 없다만 본다. 직원을 한 명씩 짚으면서 그 사람에게 딸린 행을 찾아보고, 하나라도 나오면 뽑는 것이 EXISTS이고 하나도 안 나와야 뽑는 것이 NOT EXISTS다. "모두 ~이다"는 "~가 아닌 것이 없다"로 바꿔 NOT EXISTS로 쓰는데, 이때 견줄 것이 아예 없는 사람도 함께 뽑힌다는 점을 놓치기 쉽다.

</div>


## 예시로 보기

"부양가족이 없는 직원의 이름을 구하라." [IN](/Hongs_Blog/studies/database-design/nested-query-in/)은 "쪽지에 있는 값"을 고르는 데 맞고, 여기서 필요한 것은 "딸린 행이 하나도 없다"이다. 이 질문은 이렇게 쓴다[^1].

```sql
SELECT Fname, Lname
FROM   EMPLOYEE
WHERE  NOT EXISTS ( SELECT *
                    FROM   DEPENDENT
                    WHERE  Ssn = Essn );
```

안쪽 질의의 `Ssn`은 DEPENDENT에 없는 열이다. 바깥 질의가 지금 짚고 있는 직원의 `Ssn`이다. 그래서 안쪽 질의는 직원이 바뀔 때마다 다른 답을 낸다. 직원 여덟 명을 차례로 짚으면 이렇다[^s1].

| 바깥에서 짚은 직원 | 안쪽 질의가 돌려준 행 | `EXISTS` | `NOT EXISTS` |
|---|---|---|---|
| Smith | Michael, Alice, Elizabeth | 참 | 거짓 |
| Wong | Alice, Theodore, Joy | 참 | 거짓 |
| Zelaya | 없다 | 거짓 | 참 |
| Wallace | Abner | 참 | 거짓 |
| Narayan | 없다 | 거짓 | 참 |
| English | 없다 | 거짓 | 참 |
| Jabbar | 없다 | 거짓 | 참 |
| Borg | 없다 | 거짓 | 참 |

`NOT EXISTS`가 참인 다섯 명 Zelaya, Narayan, English, Jabbar, Borg가 결과다. `NOT`을 떼면 나머지 세 명 Smith, Wong, Wallace가 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, Query 6의 5명, Query 16의 EXISTS 판(0행), 연습 1(Wong, Wallace), 바깥 행을 쓰지 않는 안쪽 질의(8행과 0행), "부양가족이 모두 여성"의 5명과 0명, 카드 C2. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다. `UNIQUE(부질의)`는 두 제품 모두 거부한다 — [62_sql-exists_verify.py](/Hongs_Blog/studies/database-design/code/62_sql-exists_verify/), [62_sql-exists_verify.sql](/Hongs_Blog/studies/database-design/code/62_sql-exists_verify-sql/)</div>

</div>


## 정의

`EXISTS`와 `NOT EXISTS`는 안쪽 질의의 결과가 비어 있는지 아닌지만 본다. 주로 `WHERE` 절의 조건으로 쓴다[^2].

- `EXISTS ( Q )`: 안쪽 질의 `Q`의 결과에 행이 적어도 하나 있으면 참이다.
- `NOT EXISTS ( Q )`: `Q`의 결과에 행이 하나도 없으면 참이다.

기호로 쓰면, 바깥에서 짚은 행을 $$t$$, 그때 안쪽 질의의 결과를 $$Q(t)$$라 할 때 `EXISTS`는 $$Q(t) \ne \emptyset$$, `NOT EXISTS`는 $$Q(t) = \emptyset$$이다. $$\emptyset$$은 원소가 하나도 없는 빈 집합이다.

슬라이드는 돌리는 차례를 이렇게 적는다. EMPLOYEE의 행마다 (1) 안쪽 질의를 돌려 조건에 맞는 DEPENDENT의 행을 모두 꺼내고 (2) 결과에 행이 하나라도 있으면(`NOT EXISTS`는 하나도 없으면) 그 EMPLOYEE의 행을 고른다[^2][^1].

행이 있는지만 보므로 안쪽 질의의 `SELECT` 뒤에 무엇을 적든 결과는 같다. 그래서 흔히 `SELECT *`로 쓴다. `SELECT Essn`으로 바꿔도 위 질의는 같은 다섯 명을 낸다[^s1].

### 바깥 행마다 다시 돌리는 안쪽 질의

안쪽 질의가 바깥 행의 값을 쓰면, 바깥 행 하나에 안쪽 질의를 한 번씩 돌려야 한다. 위 질의의 `Ssn = Essn`이 그렇다. 교재는 이런 질의를 상관 중첩 질의(correlated nested query)라 부른다[^s2]. [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)의 첫 질의는 안쪽 질의가 바깥 행의 값을 쓰지 않는다. 그런 쪽지는 한 번만 만들어 두면 된다.

`EXISTS`의 안쪽 질의가 바깥 행을 쓰지 않으면 모든 바깥 행에 같은 답이 나온다. `WHERE EXISTS ( SELECT * FROM DEPENDENT )`는 DEPENDENT에 행이 있기만 하면 참이라 직원 8명을 모두 고르고, `NOT EXISTS`로 바꾸면 0명을 고른다[^s1]. `Ssn = Essn` 같은 연결 조건을 빠뜨리면 이렇게 "전부 아니면 전무"가 된다.

같은 질문을 `IN`으로도 `EXISTS`로도 쓸 수 있다. "자기와 이름도 성별도 같은 부양가족이 있는 직원"을 `EXISTS`로 쓴 판은 이렇다[^2].

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E
WHERE  EXISTS ( SELECT *
                FROM   DEPENDENT AS D
                WHERE  E.Ssn = D.Essn AND E.Sex = D.Sex
                       AND E.Fname = D.Dependent_name );
```

`IN` 판에서 `E.Ssn IN ( SELECT D.Essn … )`으로 맞추던 것을 안쪽 `WHERE`의 `E.Ssn = D.Essn`으로 옮겼다. 결과는 `IN` 판과 같은 0행이다.

### "모두"를 NOT EXISTS로

SQL에는 "모든 행이 조건을 지킨다"를 묻는 `EXISTS`의 짝이 없다. 그래서 "모두 ~이다"를 "~가 아닌 것이 없다"로 바꿔 쓴다. 12주차 풀이가 "성적이 모두 A인 학생"을 "A가 아닌 성적이 없는 학생"으로 쓴 것이 이 방법이다[^3]. COMPANY에서 "부양가족이 모두 여성인 직원"을 구하면 이렇다[^s3].

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E
WHERE  NOT EXISTS ( SELECT *
                    FROM   DEPENDENT AS D
                    WHERE  D.Essn = E.Ssn AND D.Sex <> 'F' );
```

기호로 쓰면, 직원 $$e$$의 부양가족 모음을 $$D_e$$라 할 때 다음 두 식이 같은 말이다. $$\forall$$은 "모든 ~에 대해", $$\exists$$는 "~가 있다", $$\neg$$는 "아니다"로 읽는다([술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)).

$$\forall d \in D_e\ (\text{Sex}(d) = \text{F}) \iff \neg\,\exists d \in D_e\ (\text{Sex}(d) \ne \text{F})$$


결과는 Zelaya, Narayan, English, Jabbar, Borg 다섯 명이다. 그런데 이 다섯은 부양가족이 한 명도 없는 사람들이다. 부양가족이 있는 Smith, Wong, Wallace는 모두 남성 부양가족이 있어 빠졌다. 부양가족이 없으면 "여성이 아닌 부양가족"도 없으므로 조건이 참이 된다. 부양가족이 있는 사람만 원하면 `AND EXISTS ( SELECT * FROM DEPENDENT AS D WHERE D.Essn = E.Ssn )`을 더한다. 그러면 0명이다.

### UNIQUE

슬라이드는 참, 거짓을 돌려주는 함수를 하나 더 든다. `UNIQUE ( Q )`는 `Q`의 결과에 똑같은 행이 두 번 나오지 않으면 참이다[^4].

```sql
SELECT Fname, Lname
FROM   EMPLOYEE
WHERE  UNIQUE ( SELECT *
                FROM   DEPENDENT
                WHERE  Ssn = Essn );
```

이 문장은 SQLite에서 구문 오류이고, PostgreSQL 16은 "UNIQUE predicate is not yet implemented"라며 거부한다. 어느 제품에서도 적힌 그대로는 실행을 확인하지 못했다. 뜻대로라면 DEPENDENT에는 기본 키가 있어 똑같은 행이 둘일 수 없으니 직원 8명이 모두 뽑혀야 한다. "똑같은 행이 둘 이상인 묶음이 없다"로 바꿔 쓴 판은 8명을 낸다[^s4].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 첫 질의의 안쪽 `WHERE Ssn = Essn`에서 `Ssn`은 어느 표의 열인가? 근거는?</summary>

바깥 질의의 EMPLOYEE다. 이름만 쓴 열은 가장 안쪽 표(DEPENDENT)에서 먼저 찾는데, DEPENDENT에는 `Ssn`이라는 열이 없다. 그래서 한 겹 바깥의 EMPLOYEE에서 찾는다. `Essn`은 DEPENDENT에 있으니 DEPENDENT의 열이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. Borg 행에서 안쪽 질의의 결과와 `NOT EXISTS`의 값은?</summary>

DEPENDENT에 `Essn`이 888665555인 행이 없어 결과가 비어 있다. 빈 결과에 대한 `NOT EXISTS`는 참이라 Borg가 뽑힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 안쪽 질의의 `SELECT *`를 `SELECT Essn`으로 바꿔도 결과가 같은 까닭은?</summary>

`EXISTS`는 결과에 행이 있는지만 본다. `SELECT` 뒤는 행마다 어느 열을 보여 줄지만 정하고, 행의 수는 `FROM`과 `WHERE`가 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

바깥 행 하나를 붙잡아 두고 "이 행에 딸린 행이 있는가"를 묻는다. 안쪽 질의는 바깥 행의 값을 받아 도는 작은 검사다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

이중 반복문에서 바깥 값마다 안쪽을 훑어 "하나라도 있으면 멈춘다"를 하는 것(파이썬의 `any`)과 같다. [주장 CREATE ASSERTION](/Hongs_Blog/studies/database-design/sql-assertion/)은 "제약을 어기는 행이 없다"를 `NOT EXISTS`로 적는다. 짝 없는 행을 찾는 일은 [외부 조인](/Hongs_Blog/studies/database-design/outer-join/)으로도 한다.

</details>


## 활용

- 고르는 기준: 값을 쪽지와 견주면 `IN`, 딸린 행이 있는지만 물으면 `EXISTS`, 없어야 하면 `NOT EXISTS`다.
- "모두 ~이다"는 `NOT EXISTS ( ~가 아닌 것 )`으로 쓴다. 견줄 것이 없는 행을 빼려면 `EXISTS`를 하나 더한다.
- 흔한 실수: 안쪽 질의에서 바깥 행과 잇는 조건을 빠뜨린다. 오류는 나지 않고 결과가 전부 아니면 전무가 된다.
- 연습: [중첩 질의·집계 연습](/Hongs_Blog/studies/database-design/nested-aggregate-practice/)의 p1(부양가족이 있는 관리자), [복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/)의 p2(성적이 모두 A인 학생), [중첩 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/nested-query-ladder/)

## 연결

- 선수: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)
- `EXISTS`는 "있다", `NOT EXISTS`로 쓴 "모두"는 "아닌 것이 없다"이다: [술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)
- 짝 없는 행을 찾는 다른 길: [외부 조인](/Hongs_Blog/studies/database-design/outer-join/)의 `LEFT OUTER JOIN … IS NULL`
- 제약을 `NOT EXISTS`로 적기: [주장 CREATE ASSERTION](/Hongs_Blog/studies/database-design/sql-assertion/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"NOT EXISTS로 쓴 '모두 ~이다'는 ~인 것을 하나 이상 가진 행만 뽑는다"</div>

틀렸다. "성적이 모두 A인 학생"이라는 말을 들으면 A를 받은 적이 있는 학생만 떠올리게 되어 그럴듯해 보인다. 하지만 `NOT EXISTS`가 보는 것은 "어긴 것이 있는가"뿐이다. 견줄 것이 하나도 없는 행은 어긴 것도 없으니 참이다. 위의 "부양가족이 모두 여성인 직원"에서 뽑힌 다섯 명은 모두 부양가족이 없는 사람이었다. 12주차 연습의 "성적이 모두 A인 학생"도 같다. 성적이 한 줄도 없는 학생을 넣어 보면 `NOT EXISTS`로 쓴 풀이는 그 학생을 뽑고, 조인과 묶기로 쓴 풀이는 뽑지 않는다([복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/)). 확인하는 법: 딸린 행이 하나도 없는 행을 넣고 돌려 본다. 그런 행을 빼려면 `AND EXISTS ( … )`를 더한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `EXISTS ( Q )`와 `NOT EXISTS ( Q )`가 참이 되는 조건을 쓰고, 바깥 행을 쓰는 안쪽 질의를 돌리는 차례를 쓰라.</summary>

**답:** `EXISTS`는 `Q`의 결과에 행이 하나라도 있으면 참, `NOT EXISTS`는 하나도 없으면 참이다. 바깥 표의 행마다 (1) 그 행의 값으로 안쪽 질의를 돌리고 (2) 결과가 비었는지에 따라 그 바깥 행을 고르거나 버린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** PROJECT의 행이 (ProductX, 1, Bellaire, 5), (ProductY, 2, Sugarland, 5), (ProductZ, 3, Houston, 5), (Computerization, 10, Stafford, 4), (Reorganization, 20, Houston, 1), (Newbenefits, 30, Stafford, 4)이고 열은 차례로 Pname, Pnumber, Plocation, Dnum이다. `SELECT D.Dname FROM DEPARTMENT AS D WHERE NOT EXISTS ( SELECT * FROM PROJECT AS P WHERE P.Dnum = D.Dnumber AND P.Plocation = 'Houston' );`의 결과는?</summary>

**답:** Administration.<br>
**이유:** 부서를 하나씩 짚는다. Research(5번)는 ProductZ가 Houston에 있어 안쪽 결과가 1행이다. Headquarters(1번)도 Reorganization 1행이다. Administration(4번)의 프로젝트는 둘 다 Stafford라 안쪽 결과가 비어 있고, `NOT EXISTS`가 참이 된다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** (a) `WHERE Pnumber IN ( SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith' )` (b) `WHERE NOT EXISTS ( SELECT * FROM DEPENDENT WHERE Ssn = Essn )`. 바깥 행마다 안쪽 질의를 다시 돌려야 하는 것은 어느 쪽인가? 또 (b)에서 `WHERE Ssn = Essn`을 지우면 바깥의 EMPLOYEE 8행 가운데 몇 행이 뽑히는가?</summary>

**답:** (b)다. `WHERE Ssn = Essn`을 지우면 0행이 뽑힌다.<br>
**이유:** (a)의 안쪽 질의에 나오는 열은 모두 안쪽 표의 것이라 바깥 행과 상관없이 답이 같다. (b)의 `Ssn`은 바깥 EMPLOYEE의 열이라 직원마다 답이 다르다. 연결 조건을 지우면 안쪽 질의는 "DEPENDENT에 행이 있는가"가 되어 모든 직원에게 같은 답(있다)을 주고, `NOT EXISTS`는 모두 거짓이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "부양가족이 모두 여성인 직원"을 `NOT EXISTS ( 여성이 아닌 부양가족 )`으로 썼더니 다섯 명이 나왔다. 이 결과가 질문의 뜻과 어긋나 보이는 까닭과 고치는 법을 쓰라.</summary>

**답:** 다섯 명(Zelaya, Narayan, English, Jabbar, Borg)은 모두 부양가족이 한 명도 없는 직원이다. 부양가족이 없으면 "여성이 아닌 부양가족"도 없어서 조건이 참이 된다. 부양가족이 있는 직원만 원하면 `AND EXISTS ( 그 직원의 부양가족 )`을 더한다. 이 상태에서는 0명이 된다.<br>
**이유:** "모두 ~이다"는 견줄 것이 하나도 없을 때도 참이다. 논리에서는 이것을 공허한 참이라 부른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `SELECT Lname FROM EMPLOYEE WHERE Ssn IN ( SELECT Essn FROM DEPENDENT );`를 `EXISTS`로 바꿔 쓰고 결과를 쓰라.</summary>

**답:** `SELECT Lname FROM EMPLOYEE WHERE EXISTS ( SELECT * FROM DEPENDENT WHERE Ssn = Essn );` 결과는 Smith, Wong, Wallace.<br>
**이유:** `IN`이 바깥의 `Ssn`과 안쪽 결과의 `Essn`을 견주던 것을, 안쪽 `WHERE`의 `Ssn = Essn`으로 옮긴다. 그러면 안쪽 결과가 "이 직원의 부양가족"이 되고, 하나라도 있으면 뽑힌다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.16 (NOT EXISTS Function, Query 6, EMPLOYEE 튜플마다 안쪽 질의를 돌리는 두 단계)
[^2]: 같은 자료, p.15 (EXISTS Function, Query 16의 EXISTS 판, 두 단계). 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.5에 두 함수가 한 쪽으로 다시 정리되어 있다.
[^3]: 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices-solution」, p.3 (Q2-1의 풀이: 성적이 A가 아닌 행이 없는 학생)
[^4]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.18 (Other Boolean Functions: UNIQUE function)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 직원별 추적 표, `SELECT Essn`으로 바꾼 판, 바깥 행을 쓰지 않는 안쪽 질의의 8행과 0행은 슬라이드에 없다. 슬라이드는 질의와 돌리는 차례만 적었다. SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드에는 "상관 중첩 질의"라는 이름이 없고 "EMPLOYEE 튜플마다 안쪽 질의를 돌린다"는 설명만 있다. 이름은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 7.1절 "Correlated Nested Queries"의 것이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "부양가족이 모두 여성인 직원" 질의와 그 결과, 카드 C2~C5는 슬라이드에 없다. 슬라이드에서 "모두"를 `NOT EXISTS`로 쓴 곳은 12주차 풀이 Q2-1 하나다. SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s4]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 실행 결과와 바꿔 쓴 판은 슬라이드에 없다. 바꿔 쓴 판은 `NOT EXISTS ( SELECT 1 FROM DEPENDENT WHERE Ssn = Essn GROUP BY Essn, Dependent_name, Sex, Bdate, Relationship HAVING COUNT(*) > 1 )`이고 두 제품에서 8명을 낸다.
{% endraw %}
