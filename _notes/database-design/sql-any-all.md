---
layout: "note"
title: "ANY와 ALL"
display_title: "ANY와 ALL (ANY and ALL)"
kind: "concept"
kind_label: "정의"
num: "61"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["ANY", "ALL", "SOME", "= ANY", "> ALL", "한정 비교", "Quantified Comparison", "비교 연산자", "Comparison Operator"]
description: "쪽지에 적힌 값들과 \"같은 것이 있나\"만 묻는 것이 아니라 \"더 큰가, 더 작은가\"를 묻고 싶을 때가 있다. 그때는 \"쪽지의 값 가운데 어느 하나보다만 크면 된다\"인지 \"쪽지의 값 모두보다 커야 한다\"인지를 함께 말해야 한다. 앞의 것이 ANY, 뒤의 것이 ALL이다. 쪽지가 비어…"
prev_url: "/studies/database-design/nested-query-in/"
prev_title: "중첩 질의와 IN"
next_url: "/studies/database-design/sql-exists/"
next_title: "EXISTS와 NOT EXISTS"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/sql-any-all/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쪽지에 적힌 값들과 "같은 것이 있나"만 묻는 것이 아니라 "더 큰가, 더 작은가"를 묻고 싶을 때가 있다. 그때는 "쪽지의 값 가운데 어느 하나보다만 크면 된다"인지 "쪽지의 값 모두보다 커야 한다"인지를 함께 말해야 한다. 앞의 것이 ANY, 뒤의 것이 ALL이다. 쪽지가 비어 있으면 "모두보다 크다"는 누구에게나 참이 되고, 쪽지에 모르는 값이 하나라도 섞여 있으면 "모두보다 크다"는 아무에게도 참이 되지 않는다.

</div>


## 예시로 보기

[IN](/Hongs_Blog/studies/database-design/nested-query-in/)은 쪽지의 값과 같은지만 본다. "5번 부서의 어느 직원보다도 급여가 많은 직원"처럼 크기를 견주는 질문에는 쓸 수 없다. 이 질문은 이렇게 쓴다[^1].

```sql
SELECT Lname, Fname
FROM   EMPLOYEE
WHERE  Salary > ALL ( SELECT Salary
                      FROM   EMPLOYEE
                      WHERE  Dno = 5 );
```

안쪽 질의가 만든 쪽지에는 5번 부서 네 명의 급여 30000, 40000, 38000, 25000이 적혀 있다. 직원마다 자기 급여가 네 값 모두보다 큰지 본다. `ALL`을 `ANY`로 바꾸면 네 값 가운데 하나보다만 크면 된다[^s1].

| 직원 | 급여 | `> ANY` (하나보다만 크면) | `> ALL` (모두보다 커야) |
|---|---|---|---|
| Borg | 55000 | 참 | 참 |
| Wallace | 43000 | 참 | 참 |
| Wong | 40000 | 참 | 거짓 (40000과 같다) |
| Narayan | 38000 | 참 | 거짓 |
| Smith | 30000 | 참 | 거짓 |
| Zelaya, English, Jabbar | 25000 | 거짓 (25000보다 크지 않다) | 거짓 |

`> ALL`의 결과는 Wallace와 Borg 두 명이고, `> ANY`의 결과는 다섯 명이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, `= ANY`로 쓴 Query 4(1, 2), `= ALL`·`<> ALL`·`<> ANY`, 빈 집합과 NULL이 섞인 집합, 카드 C2. `ANY`와 `ALL`은 SQLite에 없어 PostgreSQL 16에서 실행했다 — [61_sql-any-all_verify.sql](/Hongs_Blog/studies/database-design/code/61_sql-any-all_verify-sql/). SQLite에서는 `MAX`·`MIN`·`IN`으로 바꿔 쓴 판을 돌렸다 — [61_sql-any-all_verify.py](/Hongs_Blog/studies/database-design/code/61_sql-any-all_verify/)</div>

</div>


## 정의

비교 연산자 `=`, `>`, `>=`, `<`, `<=`, `<>` 뒤에 `ANY`나 `ALL`을 붙여, 값 `v` 하나를 값의 모음 `V`(안쪽 질의의 결과)와 견준다[^2].

- `v > ANY V`: `V`의 값 가운데 **적어도 하나**보다 `v`가 크면 참이다.
- `v > ALL V`: `V`의 **모든** 값보다 `v`가 크면 참이다.
- `>` 자리에 다른 다섯 연산자를 넣어도 같은 식으로 읽는다.

기호로 쓰면, 비교 연산자를 $$\theta$$(세타, 여섯 연산자 가운데 하나)라 할 때 다음과 같다. $$\exists$$는 "~가 있다", $$\forall$$은 "모든 ~에 대해"로 읽는다([술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)).

$$v \;\theta\; \text{ANY}\; V \iff \exists x \in V\ (v \;\theta\; x), \qquad v \;\theta\; \text{ALL}\; V \iff \forall x \in V\ (v \;\theta\; x)$$


자주 쓰는 꼴은 넷이다.

| 식 | 뜻 | 같은 말 |
|---|---|---|
| `v = ANY V` | `V`에 `v`와 같은 값이 있다 | `v IN V`[^2] |
| `v <> ALL V` | `V`의 어느 값과도 다르다 | `v NOT IN V` |
| `v > ALL V` | `V`의 가장 큰 값보다도 크다 | 대개 `v > (SELECT MAX …)` |
| `v > ANY V` | `V`의 가장 작은 값보다는 크다 | 대개 `v > (SELECT MIN …)` |

`= ANY`가 `IN`과 같으므로, [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)의 첫 질의에서 `IN`을 `= ANY`로 바꿔도 결과는 1, 2다. `<> ANY`는 `NOT IN`이 아니다. "다른 값이 하나라도 있다"는 뜻이라, 부서가 셋인 이 상태에서 `Dno <> ANY ( SELECT Dnumber FROM DEPARTMENT )`는 직원 8명 모두에게 참이다. `= ALL`은 `V`의 값이 모두 `v`와 같아야 참이라, 1번 부서(Borg 한 명)의 급여와 견주면 Borg만 남고 5번 부서와 견주면 아무도 남지 않는다[^s1].

### MAX, MIN으로 바꿔 쓸 때 달라지는 곳

`> ALL V`를 `> (SELECT MAX …)`로 바꿔 쓰는 일이 흔하다. SQLite처럼 `ANY`와 `ALL`이 없는 제품에서는 그렇게 써야 한다. 두 경우에는 결과가 달라진다[^s2].

| 쪽지 `V` | `> ALL V` | `> (SELECT MAX …)` |
|---|---|---|
| 5번 부서의 급여 (네 값) | Wallace, Borg | Wallace, Borg |
| 9번 부서의 급여 (그런 부서가 없어 비어 있다) | 8명 모두 | 0명 |
| 프로젝트 20의 `Hours` (10.0, 15.0, NULL) | 0행 | 7행 |

- **빈 쪽지.** "모든 값보다 크다"에서 견줄 값이 하나도 없으면 어긴 값도 없으니 참이다. `MAX`는 값이 없으면 NULL을 돌려주고, NULL과의 비교는 참이 되지 않는다.
- **NULL이 섞인 쪽지.** NULL은 모르는 값이다. 그 값보다 큰지 알 수 없으니 "모두보다 크다"는 참이 되지 못한다. `MAX`는 NULL을 빼고 15.0을 돌려줘서, 15시간보다 많이 일하는 7행이 나온다([NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)).

## 연결

- 선수: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)
- "하나라도 있다"와 "모두 그렇다"를 묻는 다른 방법: [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)
- `ANY`는 "있다", `ALL`은 "모든"이다: [술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)
- 연습: [복잡한 검색 연습](/Hongs_Blog/studies/database-design/complex-retrieval-practice/)의 Q3-1은 가장 많이 받는 직원을 `MAX`로 찾는다. 같은 직원을 `Salary >= ALL ( … )`로도 찾는다(카드 C2).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `v = ANY V`와 `v > ALL V`의 뜻을 쓰고, 둘 가운데 `IN`과 같은 것을 고르라.</summary>

**답:** `v = ANY V`는 `V`에 `v`와 같은 값이 적어도 하나 있으면 참이다. `v > ALL V`는 `v`가 `V`의 모든 값보다 크면 참이다. `= ANY`가 `IN`과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 직원 급여가 Smith 30000, Wong 40000, Zelaya 25000, Wallace 43000, Narayan 38000, English 25000, Jabbar 25000, Borg 55000이고 4번 부서 직원은 Zelaya, Wallace, Jabbar다. (a) `Salary >= ALL ( SELECT Salary FROM EMPLOYEE )` (b) `Salary < ANY ( SELECT Salary FROM EMPLOYEE WHERE Dno = 4 )`를 만족하는 직원을 각각 쓰라.</summary>

**답:** (a) Borg. (b) Smith, Wong, Zelaya, Narayan, English, Jabbar.<br>
**이유:** (a)는 모든 직원의 급여 이상이어야 하니 가장 많이 받는 한 명이다. 자기 자신과도 견주므로 `>`가 아니라 `>=`여야 한다. (b)는 4번 부서의 급여 25000, 43000, 25000 가운데 하나보다만 작으면 되므로 43000보다 적게 받는 여섯 명이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `Salary > ALL ( 안쪽 질의 )`를 `Salary > ( 같은 안쪽 질의에 MAX를 씌운 것 )`으로 바꾸면 결과가 달라지는 경우를 둘 들어라.</summary>

**답:** ① 안쪽 질의의 결과가 비어 있을 때. `> ALL`은 모든 행에서 참(8명)이고, `MAX`는 NULL이라 0명이다. ② 안쪽 결과에 NULL이 섞여 있을 때. 프로젝트 20의 `Hours`(10.0, 15.0, NULL)와 견주면 `> ALL`은 0행, `MAX`는 15.0이라 7행이다.<br>
**이유:** `ALL`은 견줄 값이 없으면 어긴 것도 없어 참이고, 모르는 값이 하나라도 있으면 참이라고 말하지 못한다. `MAX`는 NULL을 빼고 계산하며 값이 하나도 없으면 NULL을 돌려준다.

</details>


[^1]: 데이터베이스 설계 11회 강의 자료 「11-2_SQL-DML-Complex」, p.13 (= ALL operator, "5번 부서의 모든 직원보다 급여가 많은 직원" 질의)
[^2]: 같은 자료, p.12 (= ANY operator는 IN과 같다, `>`, `>=`, `<`, `<=`, `<>`도 ANY와 함께 쓴다). 데이터베이스 설계 12회 강의 자료 「12_SQL-DML-Complex-practices」, p.4에 IN, ANY, ALL이 한 쪽으로 다시 정리되어 있다.
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 직원별 참·거짓 표, `> ANY`의 결과, `<> ANY`·`= ALL`·`<> ALL`의 예, 카드 C2는 슬라이드에 없다. 슬라이드는 `> ALL` 질의만 싣고 결과는 싣지 않았다. PostgreSQL 16에서 실행해 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `MAX`·`MIN`으로 바꿔 쓰기와 두 경우의 차이는 슬라이드에 없다. `> ALL`의 8명과 0행은 PostgreSQL 16에서, `MAX` 쪽의 0명과 7행은 SQLite와 PostgreSQL 16 양쪽에서 실행해 확인했다.
{% endraw %}
