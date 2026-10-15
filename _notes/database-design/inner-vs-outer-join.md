---
layout: "note"
title: "내부 조인과 외부 조인 비교"
display_title: "내부 조인과 외부 조인 비교"
kind: "concept"
kind_label: "비교"
num: "67"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Inner Join vs Outer Join", "내부 조인 대 외부 조인", "INNER JOIN과 OUTER JOIN"]
description: "둘 다 두 표의 행을 조건에 맞춰 짝짓는다. 가르는 질문은 하나다. \"짝이 없는 행도 결과에 나와야 하는가.\" 문제 글에서는 \"모든 ~\", \"없으면 0\", \"…가 없는 ~\" 같은 말이 그 신호다."
prev_url: "/studies/database-design/outer-join/"
prev_title: "외부 조인"
next_url: "/studies/database-design/aggregate-functions/"
next_title: "집계 함수"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/inner-vs-outer-join/"
---
{% raw %}
둘 다 두 표의 행을 조건에 맞춰 짝짓는다. 가르는 질문은 하나다. "짝이 없는 행도 결과에 나와야 하는가." 문제 글에서는 "모든 ~", "없으면 0", "…가 없는 ~" 같은 말이 그 신호다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 프로젝트 이름 옆에 그 프로젝트에서 일하는 직원의 성을 붙인 목록을 만든다. 일하는 사람이 없는 프로젝트는 볼 필요가 없다. (b) 모든 직원의 성 옆에 상사의 성을 붙인다. 상사가 없는 직원도 목록에 있어야 한다. 어느 조인인가?</summary>

**답:** (a) 내부 조인. (b) 직원 쪽을 남기는 LEFT OUTER JOIN.<br>
**이유:** (a)는 짝이 있는 것만 필요하다. COMPANY 상태에서는 16행이 나온다. (b)를 내부 조인으로 쓰면 상사가 없는 Borg가 빠져 7행이고, LEFT OUTER JOIN이면 Borg가 NULL과 함께 남아 8행이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 부양가족이 한 명도 없는 직원을 구한다. (d) 직원마다 부양가족 수를 구한다. 부양가족이 없는 직원은 0으로 나와야 한다. 어느 조인이고, 무엇을 더해야 하는가?</summary>

**답:** 둘 다 직원 쪽을 남기는 LEFT OUTER JOIN이다. (c)는 `WHERE D.Essn IS NULL`을 더한다. (d)는 직원별로 묶고 `COUNT(D.Essn)`으로 센다.<br>
**이유:** (c)의 답인 5명은 짝이 없는 행이라 내부 조인에는 아예 나오지 않는다. (d)를 내부 조인으로 쓰면 부양가족이 있는 3명만 나온다. LEFT OUTER JOIN이면 8명이 다 나오고, 그 가운데 5명이 0이다. `COUNT(*)`로 세면 그 5명이 1로 나온다.

</details>


## 결정적 차이

| | 내부 조인 | 외부 조인 |
|---|---|---|
| 짝이 없는 행 | 결과에서 빠진다 | 남는다. 짝 쪽 열은 NULL로 채운다 |
| 쓰는 말 | `JOIN … ON`, 또는 `FROM`에 쉼표와 `WHERE` | `LEFT`, `RIGHT`, `FULL OUTER JOIN … ON` |
| 표의 순서 | 바꿔도 같은 행이 나온다 | `LEFT`와 `RIGHT`는 어느 표를 남길지가 순서로 정해진다 |
| 고르는 조건을 `ON`에 둘 때와 `WHERE`에 둘 때 | 결과가 같다 | 결과가 다르다 |
| 줄 수 세기 | `COUNT(*)`로 충분하다 | 짝 쪽 열을 `COUNT(열)`로 세어야 0이 나온다 |
| 문제 글의 신호 | "~인 것의 …" | "모든 ~", "없으면 0", "…가 없는 ~" |

직원과 상사를 `E.Super_ssn = S.Ssn`으로 이을 때의 행 수는 내부 7, LEFT 8, RIGHT 12, FULL 13이다. 선택을 가르는 줄은 첫 줄이고, 실수가 가장 잦은 줄은 넷째와 다섯째다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 카드 C1~C3의 행 수와 직원과 상사 조인의 7, 8, 12, 13행 — [67_inner-vs-outer-join_verify.py](/Hongs_Blog/studies/database-design/code/67_inner-vs-outer-join_verify/). 같은 행 수를 PostgreSQL 16에서도 확인했다 — [66_outer-join_verify.sql](/Hongs_Blog/studies/database-design/code/66_outer-join_verify-sql/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 내부 조인도 외부 조인도 아닌 두 경우를 쓰라. (가) 직원 8명과 부서 3개를 조건 없이 `FROM EMPLOYEE, DEPARTMENT`로 적었다. (나) 부서와 부서 위치를 이름이 같은 열 `Dnumber`로 잇되 조건을 적지 않으려 한다.</summary>

**답:** (가) 카티션 곱이다. 짝을 맞추지 않으니 모든 조합 8 × 3 = 24행이 나온다: [WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/). (나) 자연 조인이다. `DEPARTMENT NATURAL JOIN DEPT_LOCATIONS`는 5행을 내고 `Dnumber`가 한 번만 나온다: [자연 조인 NATURAL JOIN](/Hongs_Blog/studies/database-design/natural-join/).<br>
**이유:** 내부와 외부는 "짝 없는 행을 어떻게 할까"의 갈래다. 카티션 곱은 짝을 맞추는 조건 자체가 없고, 자연 조인은 조건을 이름으로 정한다는 점에서 다른 갈래다[^s1].

</details>


[^s1]: 행 수는 검증 코드로 확인했다.
{% endraw %}
