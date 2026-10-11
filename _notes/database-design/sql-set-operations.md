---
layout: "note"
title: "집합 연산 UNION·EXCEPT·INTERSECT"
display_title: "집합 연산 UNION·EXCEPT·INTERSECT (Set Operations)"
kind: "concept"
kind_label: "정의"
num: "57"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Set Operations", "UNION", "EXCEPT", "INTERSECT", "UNION ALL", "EXCEPT ALL", "INTERSECT ALL", "합집합", "차집합", "교집합", "합병 가능", "Type Compatible", "Union Compatible", "다중집합 연산", "Multiset Operations"]
description: "두 질의의 결과를 하나로 합치거나, 양쪽에 다 있는 것만 남기거나, 한쪽에서 다른 쪽에 있는 것을 빼는 연산이다. 두 반의 명단을 한 장으로 합치고, 두 반에 다 있는 이름을 뽑고, 한 반에만 있는 이름을 뽑는 일과 같다. 이 연산들은 겹치는 행을 한 번만 남기므로, 겹친 횟수까지…"
prev_url: "/studies/database-design/sql-multiset-distinct/"
prev_title: "다중집합인 표와 DISTINCT"
next_url: "/studies/database-design/sql-drop/"
next_title: "DROP 명령과 CASCADE·RESTRICT"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-set-operations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 질의의 결과를 하나로 합치거나, 양쪽에 다 있는 것만 남기거나, 한쪽에서 다른 쪽에 있는 것을 빼는 연산이다. 두 반의 명단을 한 장으로 합치고, 두 반에 다 있는 이름을 뽑고, 한 반에만 있는 이름을 뽑는 일과 같다. 이 연산들은 겹치는 행을 한 번만 남기므로, 겹친 횟수까지 살리려면 따로 그렇게 적어야 한다. 그리고 두 결과의 칸 수와 칸의 꼴이 서로 맞을 때만 쓸 수 있다.

</div>


## 예시로 보기

"성이 Smith인 직원이 얽힌 프로젝트의 번호를 모두 구하라. 그 프로젝트에서 일하는 사람으로든, 그 프로젝트를 맡은 부서의 관리자로든." 얽히는 길이 둘이라 조건 하나로 쓰기 어렵다. 길마다 질의를 하나씩 쓰고 결과를 합친다[^1].

```sql
( SELECT DISTINCT Pnumber
  FROM   PROJECT, DEPARTMENT, EMPLOYEE
  WHERE  Dnum = Dnumber AND Mgr_ssn = Ssn
         AND Lname = 'Smith' )
UNION
( SELECT DISTINCT Pnumber
  FROM   PROJECT, WORKS_ON, EMPLOYEE
  WHERE  Pnumber = Pno AND Essn = Ssn
         AND Lname = 'Smith' );
```

위 질의는 Smith가 관리자인 부서의 프로젝트를, 아래 질의는 Smith가 일하는 프로젝트를 찾는다. 두 결과 모두 칸이 Pnumber 하나라서 합칠 수 있다. 답은 1과 2다. Smith는 어느 부서의 관리자도 아니라서 위 질의는 0행이고, 아래 질의가 1, 2를 낸다.

Smith의 예는 한쪽 결과가 비어 있어 세 연산의 차이가 드러나지 않는다. 5번 부서 관리자인 Wong으로 바꾸면 보인다. 관리자로서 얽힌 프로젝트는 1, 2, 3이고 일하는 프로젝트는 2, 3, 10, 20이다[^s1].

| 두 질의 사이에 쓴 것 | 결과 | 뜻 |
|---|---|---|
| `UNION` | 1, 2, 3, 10, 20 | 어느 쪽에든 있는 번호. 겹치는 2, 3은 한 번만 |
| `UNION ALL` | 1, 2, 2, 3, 3, 10, 20 | 두 결과를 그대로 이어 붙임. 7행 |
| `INTERSECT` | 2, 3 | 양쪽에 다 있는 번호 |
| `EXCEPT` (관리자 쪽에서 일하는 쪽을 뺌) | 1 | 관리만 하고 직접 일하지는 않는 프로젝트 |
| `EXCEPT` (순서를 바꿈) | 10, 20 | 다른 부서 것인데 가서 일하는 프로젝트 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Query 4의 답 {1, 2}, Wong의 다섯 결과, 그림의 R·S에서 개수를 세는 규칙(파이썬 `Counter`), 열 수가 다를 때의 오류(SQLite) — [57_sql-set-operations_verify.py](/Hongs_Blog/studies/database-design/code/57_sql-set-operations_verify/). `EXCEPT ALL`·`INTERSECT ALL`과 자료형이 안 맞을 때의 오류는 PostgreSQL 16에서 실행 — [57_sql-set-operations_verify.sql](/Hongs_Blog/studies/database-design/code/57_sql-set-operations_verify-sql/)</div>

</div>


## 정의

SQL에는 집합의 연산 셋이 그대로 들어 있다[^1].

| SQL | 집합의 연산 | 남는 것 |
|---|---|---|
| `UNION` | 합집합 | 두 결과 가운데 어느 쪽에든 있는 튜플 |
| `EXCEPT` | 차집합 | 앞 결과에는 있고 뒤 결과에는 없는 튜플 |
| `INTERSECT` | 교집합 | 두 결과에 다 있는 튜플 |

세 연산의 결과는 집합이다. 겹치는 튜플은 한 번만 남는다.

**합칠 수 있는 조건.** 이 연산들은 서로 꼴이 맞는(type-compatible) 릴레이션에만 쓸 수 있다. 두 릴레이션이 같은 속성을 가져야 한다[^1]. 풀어 쓰면 칸의 수가 같고, 같은 자리의 칸끼리 자료형이 맞아야 한다. 칸의 이름까지 같을 필요는 없다[^s1].

**개수까지 세는 판.** 연산 뒤에 `ALL`을 붙인 `UNION ALL`, `EXCEPT ALL`, `INTERSECT ALL`은 [다중집합](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)의 연산이다. 중복을 지우지 않고 몇 번 나왔는지를 계산에 넣는다[^2].

**기호로 쓰면.** 어떤 튜플이 앞 결과 $$R$$에 $$m$$번, 뒤 결과 $$S$$에 $$n$$번 들어 있다고 하자. 연산의 결과에 그 튜플이 들어가는 횟수는 다음과 같다[^s1].

$$\text{UNION ALL}: m + n \qquad \text{EXCEPT ALL}: \max(m - n,\ 0) \qquad \text{INTERSECT ALL}: \min(m,\ n)$$


말로 읽으면 이렇다. 합칠 때는 횟수를 더한다. 뺄 때는 앞의 횟수에서 뒤의 횟수를 빼되 0보다 작아지지는 않는다. 겹치는 것을 구할 때는 두 횟수 가운데 작은 쪽을 딴다.

슬라이드의 그림으로 확인한다. $$R$$에는 a1, a2, a2, a3이, $$S$$에는 a1, a2, a4, a5가 들어 있다[^2].

| 값 | $$R$$에 | $$S$$에 | `UNION ALL` | `EXCEPT ALL` | `INTERSECT ALL` |
|---|---|---|---|---|---|
| a1 | 1 | 1 | 2 | 0 | 1 |
| a2 | 2 | 1 | 3 | 1 | 1 |
| a3 | 1 | 0 | 1 | 1 | 0 |
| a4 | 0 | 1 | 1 | 0 | 0 |
| a5 | 0 | 1 | 1 | 0 | 0 |
| 모두 | 4행 | 4행 | 8행 | 2행 (a2, a3) | 2행 (a1, a2) |

`ALL`이 없으면 먼저 중복이 지워진다. `R UNION S`는 a1, a2, a3, a4, a5 다섯 행이고, `R EXCEPT S`는 a3 한 행이다. a2는 $$R$$에 두 번 있어도 $$S$$에 한 번이라도 있으면 통째로 빠진다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 10-2 p.24의 그림 설명 "R(A) UNION ALL R(S)", "R(A) EXCEPT ALL R(S)", "R(A) INTERSECT ALL R(S)"와 본문의 "EXCETP ALL" / 문제점: 둘째 릴레이션은 $$S$$이고 그 속성이 A다. "R(S)"가 아니라 "S(A)"여야 한다. "EXCETP"는 EXCEPT의 오타다 / 수정안: "R(A) UNION ALL S(A)", "R(A) EXCEPT ALL S(A)", "R(A) INTERSECT ALL S(A)", "EXCEPT ALL" / 근거: 그림 (a)의 두 표 머리글이 R과 S이고 칸 이름이 둘 다 A다. 세 결과는 PostgreSQL 16에서 그림 (b), (c), (d)와 같게 나온다 — [57_sql-set-operations_verify.sql](/Hongs_Blog/studies/database-design/code/57_sql-set-operations_verify-sql/)

</div>


## 활용

- **`EXCEPT`는 순서가 중요하다.** 합치기와 겹치는 것 찾기는 두 질의의 자리를 바꿔도 답이 같다. 빼기는 다르다. Wong의 예에서 한쪽은 1, 바꾸면 10과 20이다.
- **꼴이 맞는지는 DBMS가 본다. 뜻이 맞는지는 못 본다.** 칸 수가 다르면 두 제품 모두 오류를 낸다. Ssn(글자)과 Dnumber(정수)를 `UNION`하면 PostgreSQL 16은 자료형이 안 맞는다고 막는다. SQLite는 자료형을 따지지 않아 그대로 합친다. 월급과 부서 번호처럼 둘 다 수이면 어느 제품도 막지 않는다. 그 결과가 말이 되는지는 쓰는 사람이 챙겨야 한다[^s1].
- **결과의 칸 이름.** 두 질의의 칸 이름이 달라도 합쳐지고, 결과에는 앞 질의의 이름이 붙는다[^s1].
- **제품마다 다른 점.** SQLite에는 `EXCEPT ALL`과 `INTERSECT ALL`이 없다(구문 오류). `UNION ALL`은 있다. PostgreSQL 16은 여섯 가지를 모두 받는다.
- **다르게 쓰는 길.** Query 4는 질의 안에 질의를 넣고 `OR`로 이어 써도 된다: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/).

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)
- 합집합·교집합·차집합의 정의와 성질: [집합](/Hongs_Blog/studies/discrete-math/sets/)
- 자료형이 맞는다는 것: [SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 4번 부서 직원의 월급은 25000, 43000, 25000이고 5번 부서 직원의 월급은 30000, 40000, 38000, 25000이다. "4번 부서의 월급" 질의에서 "5번 부서의 월급" 질의를 `EXCEPT`, `EXCEPT ALL`, `INTERSECT ALL`로 이으면 결과는 각각 무엇인가?</summary>

**답:** `EXCEPT`는 43000 한 행. `EXCEPT ALL`은 25000, 43000 두 행. `INTERSECT ALL`은 25000 한 행.<br>
**이유:** 25000은 앞에 2번, 뒤에 1번 있다. `EXCEPT`는 뒤에 한 번이라도 있으면 다 빼므로 43000만 남는다. `EXCEPT ALL`은 2 − 1 = 1번 남긴다. `INTERSECT ALL`은 작은 쪽인 1번을 딴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** Wong이 관리자로서 얽힌 프로젝트는 1, 2, 3이고 일하는 프로젝트는 2, 3, 10, 20이다. 두 질의를 `UNION`으로 이으면 몇 행, `UNION ALL`로 이으면 몇 행인가?</summary>

**답:** `UNION`은 5행(1, 2, 3, 10, 20), `UNION ALL`은 7행이다.<br>
**이유:** `UNION`은 겹치는 2와 3을 한 번만 남긴다. `UNION ALL`은 3행과 4행을 그대로 이어 붙여 3 + 4 = 7행이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 가운데 `UNION`으로 이을 수 없는 짝은 어느 것인가? 왜 그런가? (가) `SELECT Ssn FROM EMPLOYEE`와 `SELECT Dnumber, Dname FROM DEPARTMENT` (나) `SELECT Lname FROM EMPLOYEE`와 `SELECT Dname FROM DEPARTMENT` (다) `SELECT Pnumber FROM PROJECT`와 `SELECT Pno FROM WORKS_ON`</summary>

**답:** (가)다. 앞은 칸이 하나, 뒤는 칸이 둘이라 꼴이 안 맞는다. (나)와 (다)는 칸 수가 같고 자료형도 맞아 이을 수 있다.<br>
**이유:** 합칠 수 있는 조건은 칸의 수와 자료형이다. (나)처럼 칸의 이름이 다른 것은 걸림돌이 아니다. 다만 (나)는 사람의 성과 부서 이름을 한 칸에 섞는 것이라 뜻이 통하는지는 따로 생각해야 한다.

</details>


[^1]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.23 (Tables as Sets: UNION, EXCEPT, INTERSECT, type-compatible, Query 4). 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.9
[^2]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.24 (Tables as Multisets: UNION ALL, EXCEPT ALL, INTERSECT ALL과 R, S, T의 그림)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> Wong으로 바꾼 예, 합칠 수 있는 조건을 "칸 수와 자료형"으로 푼 것, 횟수를 세는 식, 순서와 칸 이름에 대한 설명, 제품마다 다른 점, 확인 문제는 슬라이드에 없다. 횟수의 식은 슬라이드 p.24의 그림에서 읽은 규칙이고 파이썬 `Counter`와 PostgreSQL 16의 실행 결과로 확인했다. 그 밖의 결과는 SQLite 3.50과 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
