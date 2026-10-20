---
layout: "note"
title: "일대다 관계 타입의 사상"
display_title: "일대다 관계 타입의 사상 (Mapping of Binary 1:N Relationship Types)"
kind: "concept"
kind_label: "기법"
num: "42"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Mapping of Binary 1:N Relationship Types", "1:N 관계 타입의 사상", "1:N 관계 사상", "N쪽에 외래 키", "WORKS_FOR", "SUPERVISION", "CONTROLS", "Dno", "Super_ssn", "Dnum"]
description: "직원은 한 부서에만 속하고 부서에는 직원이 여럿이다. 이런 연결은 \"여럿\" 쪽 표에 상대의 대표 값을 적는 칸 하나를 더한다. 직원 줄에는 부서 번호 하나만 적으면 되지만, 부서 줄에 직원을 적으려면 한 칸에 여러 값이 들어가야 해서 안 되기 때문이다. 연결되는 줄이 드물면 빈칸이…"
prev_url: "/studies/database-design/mapping-one-to-one-relationship/"
prev_title: "일대일 관계 타입의 사상"
next_url: "/studies/database-design/mapping-many-to-many-relationship/"
next_title: "다대다·n항 관계 타입의 사상"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "42_mapping-one-to-many-relationship_verify.py", "u": "/studies/database-design/code/42_mapping-one-to-many-relationship_verify/", "r": "검증"}]
permalink: "/studies/database-design/mapping-one-to-many-relationship/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직원은 한 부서에만 속하고 부서에는 직원이 여럿이다. 이런 연결은 "여럿" 쪽 표에 상대의 대표 값을 적는 칸 하나를 더한다. 직원 줄에는 부서 번호 하나만 적으면 되지만, 부서 줄에 직원을 적으려면 한 칸에 여러 값이 들어가야 해서 안 되기 때문이다. 연결되는 줄이 드물면 빈칸이 많아지는데, 그때는 연결만 적는 표를 따로 만들 수도 있다.

</div>


## 예시로 보기

WORKS_FOR는 부서 1 : 직원 N인 관계 타입이다. "누가 어느 부서에서 일하는가"를 적을 칸을 어느 릴레이션에 둘까? COMPANY의 상태로 두 쪽을 견준다.

| 칸을 두는 곳 | 한 줄에 적어야 할 값의 수 |
|---|---|
| EMPLOYEE (N쪽) | 직원마다 부서 번호 1개. 여덟 줄 모두 1개 |
| DEPARTMENT (1쪽) | 부서마다 직원 여러 명. 5번 부서 4명, 4번 부서 3명, 1번 부서 1명 |

EMPLOYEE에 두면 줄마다 값 하나로 끝난다. DEPARTMENT에 두면 5번 부서의 한 칸에 직원 번호 네 개를 넣어야 한다. 릴레이션의 칸에는 값 하나만 들어가므로([릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/)) 이쪽은 안 된다.

그래서 EMPLOYEE에 Dno를 더한다.

| Lname | Ssn | … | Dno |
|---|---|---|---|
| Smith | 123456789 | … | 5 |
| Wong | 333445555 | … | 5 |
| Zelaya | 999887777 | … | 4 |
| Borg | 888665555 | … | 1 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 직원 8명 모두 Dno가 한 값이고 부서별 직원은 1·3·4명, Super_ssn은 7칸에 값이 있고 Borg만 NULL, 프로젝트 6개 모두 Dnum이 있음, 교차 참조 WORKS_FOR 8줄과 SUPERVISION 7줄, 두 방법의 질의 결과가 같음 — [42_mapping-one-to-many-relationship_verify.py](/Hongs_Blog/studies/database-design/code/42_mapping-one-to-many-relationship_verify/)</div>

</div>


## 두 가지 방법

1:N인 이항 관계 타입을 옮기는 방법은 둘이다. N쪽 개체 타입을 옮긴 릴레이션을 $$S$$, 1쪽 개체 타입을 옮긴 릴레이션을 $$T$$라 부른다.

**방법 1. 외래 키 방법.** 릴레이션 수가 늘지 않아서 이쪽을 먼저 쓴다.

1. 관계 타입의 N쪽에 있는 개체 타입의 릴레이션 $$S$$를 찾는다.
2. 1쪽 릴레이션 $$T$$의 기본 키를 $$S$$에 외래 키로 넣는다.
3. 관계 타입의 단순 속성도 $$S$$의 속성으로 넣는다.

N쪽에 넣는 까닭은 N쪽의 개체 하나가 1쪽의 개체 많아야 하나와 이어지기 때문이다. 한 칸이면 충분하다.

COMPANY에는 1:N 관계 타입이 셋 있다.

| 관계 타입 | 1쪽 ($$T$$) | N쪽 ($$S$$) | $$S$$에 넣는 외래 키 |
|---|---|---|---|
| WORKS_FOR | DEPARTMENT | EMPLOYEE | Dno → DEPARTMENT.Dnumber |
| SUPERVISION | EMPLOYEE (상사) | EMPLOYEE (부하) | Super_ssn → EMPLOYEE.Ssn |
| CONTROLS | DEPARTMENT | PROJECT | Dnum → DEPARTMENT.Dnumber |

SUPERVISION은 양쪽이 같은 개체 타입이다([역할 이름과 재귀 관계](/Hongs_Blog/studies/database-design/recursive-relationship/)). 규칙은 그대로다. 부하 쪽이 N이므로 부하의 튜플에 상사의 Ssn을 적는다. 그 칸이 Super_ssn이고, 같은 릴레이션의 Ssn을 가리킨다.

세 관계를 다 옮기면 EMPLOYEE에 Dno와 Super_ssn이, PROJECT에 Dnum이 붙는다.

| 릴레이션 | 속성 (굵은 것이 기본 키, 기울인 것이 이 단계에서 붙은 외래 키) |
|---|---|
| EMPLOYEE | Fname, Minit, Lname, **Ssn**, Bdate, Address, Sex, Salary, *Dno*, *Super_ssn* |
| PROJECT | Pname, **Pnumber**, Plocation, *Dnum* |

상태에서 세어 보면, Dno와 Dnum은 모든 줄에 값이 있다. 직원은 모두 어느 부서에 속하고(전체 참여) 프로젝트는 모두 맡은 부서가 있기 때문이다. Super_ssn은 여덟 칸 가운데 Borg의 한 칸이 NULL이다. 사장에게는 상사가 없다(부분 참여).

**방법 2. 교차 참조 방법.** $$S$$와 $$T$$의 기본 키를 이어 주는 관계 릴레이션 $$R$$을 따로 만든다.

1. $$S$$와 $$T$$의 기본 키를 $$R$$에 외래 키로 넣는다.
2. $$R$$의 기본 키는 $$S$$(N쪽)의 기본 키다.

| 릴레이션 | 속성 (굵은 것이 기본 키) | 외래 키 |
|---|---|---|
| WORKS_FOR | **Essn**, Dno | Essn → EMPLOYEE.Ssn, Dno → DEPARTMENT.Dnumber |

기본 키가 Essn 하나인 까닭은 직원 한 명이 이 릴레이션에 한 번만 나와야 하기 때문이다. 직원은 부서 하나에만 속한다. Dno는 여러 줄에 되풀이된다. COMPANY에서는 여덟 줄이다.

이 방법은 "$$S$$의 튜플 가운데 관계에 참여하는 것이 적을 때" 쓸 만하다. 까닭은 NULL이다. 참여하는 튜플이 적으면 외래 키 칸이 거의 다 NULL이 된다. 관계 릴레이션에는 참여하는 짝만 줄로 들어가서 NULL이 없다. SUPERVISION을 이 방법으로 옮기면 일곱 줄이고 Borg는 아예 나오지 않는다.

## 활용

- **N쪽을 찾는 법.** 그림에서 N이 적힌 쪽의 네모가 N쪽이다. (min, max) 표기에서는 숫자가 놓이는 쪽이 반대다. max가 1인 개체 타입이 외래 키를 받는다. "상대를 많아야 하나만 가지는 쪽"이라고 기억하면 두 표기에서 다 통한다([(min, max) 표기](/Hongs_Blog/studies/database-design/min-max-notation/)).
- **대표 문제.** ① 서로 다른 두 개체 타입(WORKS_FOR, CONTROLS). ② 같은 개체 타입끼리(SUPERVISION).
- **관계의 속성.** 1:N 관계 타입의 속성은 N쪽으로 간다([관계 타입의 속성](/Hongs_Blog/studies/database-design/relationship-attributes/)).
- **흔한 실수.** 1쪽에 외래 키를 넣는 것. 부서 줄에 "직원 번호" 칸을 만들면 직원이 한 명인 부서만 적을 수 있다.
- **지켜지는 것과 안 지켜지는 것.** 외래 키 칸이 하나라서 "직원은 많아야 한 부서"는 저절로 지켜진다. "부서에는 직원이 넷 이상" 같은 아래쪽 한계는 이 릴레이션으로는 지켜지지 않는다([ER-관계형 사상 절차](/Hongs_Blog/studies/database-design/er-to-relational-mapping/)).

## 연결

- 선수: [카디널리티 비율](/Hongs_Blog/studies/database-design/cardinality-ratio/), [참여 제약](/Hongs_Blog/studies/database-design/participation-constraint/), [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)
- 앞뒤 단계: [일대일 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-one-relationship/), [다대다·n항 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-many-to-many-relationship/)
- Super_ssn으로 같은 표를 두 번 잇는 질의: [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
- 수학으로 보면: N쪽에서 1쪽으로 가는 함수다. [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 학과(DEPARTMENT, 기본 키 DName)와 과목(COURSE, 기본 키 CCode) 사이에 OFFERS 관계 타입이 있다. (min, max) 표기로 학과 쪽은 (0, N), 과목 쪽은 (1, 1)이다. 외래 키 방법으로 옮겨라. 그 외래 키는 NULL일 수 있는가?</summary>

**답:** max가 1인 COURSE가 외래 키를 받는다: COURSE(CCode, Credits, CoName, Level, CDesc, Offered), Offered → DEPARTMENT.DName. 과목 쪽의 min이 1이라 모든 과목에 학과가 있어야 한다. 그래서 Offered는 NULL이면 안 된다.<br>
**이유:** 과목 하나는 학과 딱 하나에 딸리고, 학과 하나는 과목을 여럿 연다. 과목이 N쪽이다. 흔한 오답은 (0, N)이 적힌 학과 쪽을 N쪽으로 읽는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** WORKS_FOR의 외래 키를 1쪽인 DEPARTMENT가 아니라 N쪽인 EMPLOYEE에 넣는 까닭을 COMPANY의 상태로 설명하라.</summary>

**답:** 직원은 부서가 하나씩이라 EMPLOYEE의 줄마다 Dno 한 값이면 된다. DEPARTMENT에 넣으면 5번 부서의 한 칸에 직원 4명, 4번 부서에 3명을 적어야 한다. 한 칸에는 값 하나만 들어가므로 적을 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 프로젝트 6개 가운데 1개에만 후원 부서가 있다고 하자(SPONSORS, 부서 1 : 프로젝트 N). 외래 키 방법과 교차 참조 방법으로 옮기면 각각 NULL이 몇 칸, 줄이 몇 줄 생기는가? 어느 쪽이 낫고, 프로젝트 대부분에 후원 부서가 있다면 어떤가?</summary>

**답:** 외래 키 방법은 PROJECT에 칸 하나가 붙고 6칸 가운데 5칸이 NULL이다. 교차 참조 방법은 릴레이션 하나가 늘고 1줄이 들어가며 NULL이 없다. 참여가 이렇게 드물면 교차 참조가 낫다. 대부분 참여하면 NULL이 적으므로 릴레이션 수가 안 느는 외래 키 방법이 낫다.

</details>
{% endraw %}
