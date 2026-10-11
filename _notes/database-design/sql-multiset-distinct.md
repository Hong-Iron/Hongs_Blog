---
layout: "note"
title: "다중집합인 표와 DISTINCT"
display_title: "다중집합인 표와 DISTINCT (Tables as Multisets)"
kind: "concept"
kind_label: "정의"
num: "56"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Tables as Multisets", "Multiset", "Bag", "다중집합", "백", "중복 튜플", "Duplicate Tuples", "DISTINCT", "SELECT DISTINCT", "SELECT ALL", "중복 제거", "Duplicate Elimination", "Tables as Sets"]
description: "SQL의 표와 질의 결과에는 똑같은 행이 여러 번 들어 있을 수 있다. 수학의 집합은 같은 것을 한 번만 치지만, SQL은 장바구니처럼 같은 물건이 세 개면 세 개로 둔다. 겹치는 행을 찾아 지우는 데는 품이 들고 개수나 평균을 낼 때는 겹친 채로 있어야 답이 맞기 때문이라서, 겹…"
prev_url: "/studies/database-design/sql-alias-self-join/"
prev_title: "별칭과 자기 조인"
next_url: "/studies/database-design/sql-set-operations/"
next_title: "집합 연산 UNION·EXCEPT·INTERSECT"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/sql-multiset-distinct/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

SQL의 표와 질의 결과에는 똑같은 행이 여러 번 들어 있을 수 있다. 수학의 집합은 같은 것을 한 번만 치지만, SQL은 장바구니처럼 같은 물건이 세 개면 세 개로 둔다. 겹치는 행을 찾아 지우는 데는 품이 들고 개수나 평균을 낼 때는 겹친 채로 있어야 답이 맞기 때문이라서, 겹치는 것을 한 번만 보고 싶으면 질의에 그렇게 적어야 한다. 다만 행마다 값이 달라야 하는 칸이 걸린 표에는 애초에 똑같은 행이 둘 있을 수 없다.

</div>


## 예시로 보기

"직원들이 받는 월급에는 어떤 금액들이 있나?"를 알고 싶어 월급 칸만 꺼낸다[^1].

```sql
SELECT ALL Salary           -- Q1
FROM   EMPLOYEE;

SELECT DISTINCT Salary      -- Q2
FROM   EMPLOYEE;
```

| Q1의 결과 (8행) | Q2의 결과 (6행) |
|---|---|
| 30000 | 30000 |
| 40000 | 40000 |
| 25000 | 25000 |
| 43000 | 43000 |
| 38000 | 38000 |
| 25000 | 55000 |
| 25000 | |
| 55000 | |

Q1에는 25000이 세 번 나온다. Zelaya, English, Jabbar 세 사람의 월급이 같아서다. SQL은 이것을 저절로 한 번으로 줄이지 않는다. `DISTINCT`를 적은 Q2에서만 한 번으로 준다. `ALL`은 "줄이지 말라"는 뜻이고, 아무것도 안 적어도 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Q1 8행과 Q2 6행, 키가 없는 표에 같은 행 넣기, 키를 다 고른 질의와 일부만 고른 질의의 행 수, 중복을 지웠을 때 달라지는 합과 평균, 확인 문제의 답 — [56_sql-multiset-distinct_verify.py](/Hongs_Blog/studies/database-design/code/56_sql-multiset-distinct_verify/)</div>

</div>


## 정의

같은 것이 여러 번 들어 있을 수 있는 모음을 다중집합(multiset)이라 한다. 집합은 "들어 있다, 없다"만 따지고, 다중집합은 "몇 번 들어 있다"까지 따진다.

SQL은 표를 집합이 아니라 다중집합으로 다룬다. 똑같은 튜플이 표나 질의 결과에 두 번 이상 나올 수 있고, SQL은 질의 결과에서 중복 튜플을 저절로 지우지 않는다[^2].

그렇게 정한 까닭이 셋 있다[^2].

1. **중복을 지우는 일은 비싸다.** 튜플을 먼저 정렬하고 나서 겹치는 것을 지워야 한다.
2. **사용자가 중복을 보고 싶을 수 있다.** 서로 다른 월급의 목록이 아니라 월급이 어떻게 퍼져 있는지를 보고 싶을 때가 그렇다.
3. **집계 함수에는 중복이 있어야 할 때가 있다.** 합이나 평균을 내려면 겹친 값도 그 수만큼 들어가야 한다.

**집합이 되는 경우.** 키가 있는 SQL 표는 집합일 수밖에 없다. 키 값이 튜플마다 달라야 하므로 똑같은 튜플이 둘 있을 수 없다[^3].

**`DISTINCT`와 `ALL`.** `SELECT` 바로 뒤에 `DISTINCT`를 쓰면 결과에서 중복 튜플을 지워 서로 다른 튜플만 남긴다. `ALL`을 쓰면 지우지 않는다[^3].

## 예제

**`DISTINCT`는 행 전체를 견준다.** 칸을 둘 고르면 두 값의 짝이 같아야 중복이다[^s1].

| 질의 | 행 수 |
|---|---|
| `SELECT Dno FROM EMPLOYEE;` | 8 |
| `SELECT DISTINCT Dno FROM EMPLOYEE;` | 3 (부서 1, 4, 5) |
| `SELECT DISTINCT Dno, Salary FROM EMPLOYEE;` | 7 |

셋째 줄이 7행인 까닭을 따져 본다. (5, 25000)인 English와 (4, 25000)인 Zelaya는 월급이 같아도 부서가 달라 다른 행이다. (4, 25000)인 Zelaya와 Jabbar만 짝이 같아 한 번으로 준다.

**키와 중복.** WORKS_ON의 기본 키는 {Essn, Pno}다[^s1].

- `SELECT Essn, Pno FROM WORKS_ON;`은 16행이고 `DISTINCT`를 붙여도 16행이다. 키를 다 골랐으니 겹칠 수 없다.
- `SELECT Essn FROM WORKS_ON;`은 16행인데 `DISTINCT`를 붙이면 8행이다. 키의 한쪽만 골랐기 때문에, 프로젝트 여럿에서 일하는 직원의 번호가 여러 번 나온다.

키가 걸린 표도, 거기서 키를 뺀 칸만 고른 결과는 다중집합이 된다.

**중복을 지우면 계산이 달라진다.** 직원 여덟 명의 월급을 다 더하면 281,000이고 평균은 35,125다. 겹치는 월급을 한 번만 치면 여섯 값의 합이 231,000, 평균이 38,500이 된다. 25000을 받는 세 사람을 한 사람으로 친 셈이라 "직원의 평균 월급"이 아니게 된다. 까닭 3이 말하는 것이 이 차이다[^s1].

## 활용

- **`DISTINCT`를 버릇처럼 붙이지 않는다.** 중복을 지우는 데는 품이 든다(까닭 1). 그리고 조인 조건을 빠뜨려 생긴 가짜 중복을 `DISTINCT`가 가려 버리면 틀린 질의를 알아채지 못한다([WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/))[^s1].
- **집합 연산은 반대다.** `UNION`, `EXCEPT`, `INTERSECT`는 아무것도 안 적으면 중복을 지우고, `ALL`을 붙여야 남긴다: [집합 연산 UNION·EXCEPT·INTERSECT](/Hongs_Blog/studies/database-design/sql-set-operations/).
- **세는 함수와 함께.** 서로 다른 값이 몇 가지인지 셀 때 함수 안에 `DISTINCT`를 쓴다: [집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/).

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/)
- 관계형 모델의 릴레이션은 튜플의 집합이라 중복이 없다: [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/). SQL의 표는 그 점에서 릴레이션과 다르다.
- 집합과 다중집합의 차이, 개수를 세는 연산: [집합](/Hongs_Blog/studies/discrete-math/sets/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SELECT Dno FROM EMPLOYEE;`와 `SELECT DISTINCT Dno FROM EMPLOYEE;`는 각각 몇 행을 내는가? 앞의 결과에서 5, 4, 1은 몇 번씩 나오는가?</summary>

**답:** 8행과 3행이다. 앞의 결과에서 5가 네 번, 4가 세 번, 1이 한 번 나온다.<br>
**이유:** `DISTINCT`가 없으면 직원 한 명에 한 행씩 그대로 나온다. 5번 부서에 네 명, 4번에 세 명, 1번에 한 명이 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** SQL이 질의 결과의 중복을 저절로 지우지 않는 까닭 셋을 쓰라.</summary>

**답:** ① 중복을 지우려면 정렬을 해야 해서 비싸다. ② 사용자가 중복까지 보고 싶을 수 있다(월급이 퍼진 모양). ③ 합이나 평균 같은 집계에는 겹친 값도 그 수만큼 있어야 한다.<br>
**이유:** 예를 들어 월급의 평균은 겹친 값을 남기면 35,125, 지우면 38,500이다. 지운 쪽은 직원의 평균 월급이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 네 질의 가운데 `DISTINCT`를 붙여도 행 수가 그대로인 것을 고르라. (가) `SELECT Ssn FROM EMPLOYEE` (나) `SELECT Pno FROM WORKS_ON` (다) `SELECT Essn, Pno FROM WORKS_ON` (라) `SELECT Plocation FROM PROJECT`</summary>

**답:** (가)와 (다)다. (나)는 16행이 6행으로, (라)는 6행이 4행으로 준다.<br>
**이유:** (가)는 EMPLOYEE의 키 Ssn을, (다)는 WORKS_ON의 키 {Essn, Pno}를 모두 골랐다. 키 값은 행마다 달라 겹칠 수 없다. (나)는 키의 한쪽만, (라)는 키가 아닌 칸만 골라 겹치는 값이 생긴다.

</details>


[^1]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.22 (Q1, Q2와 두 결과 표). 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.8
[^2]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.21 (Tables as Multisets in SQL, Why SQL treats Tables as Multisets?). 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.7 (월급 분포의 예)
[^3]: 데이터베이스 설계 10회 강의 자료 「10-2_SQL-DML」, p.22 (An SQL Table with a key is restricted to being a set, DISTINCT와 ALL)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 칸을 둘 고른 `DISTINCT`의 예, WORKS_ON으로 본 키와 중복, 합과 평균의 수치(281,000과 35,125, 231,000과 38,500), `DISTINCT`를 버릇처럼 붙이지 말라는 조언, 확인 문제는 슬라이드에 없다. 수치는 SQLite 3.50에서 실행해 확인했다.
{% endraw %}
