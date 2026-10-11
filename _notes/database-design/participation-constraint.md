---
layout: "note"
title: "참여 제약"
display_title: "참여 제약 (Participation Constraint)"
kind: "concept"
kind_label: "정의"
num: "25"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Participation Constraint", "전체 참여", "Total Participation", "부분 참여", "Partial Participation", "존재 종속", "Existence Dependency", "필수 참여", "선택 참여", "최소 카디널리티"]
description: "\"모든 학생은 반드시 어느 반에 속해야 한다\"와 \"학생이 꼭 반장일 필요는 없다\"의 차이다. 앞의 규칙은 한 명도 빠지면 안 되고, 뒤의 규칙은 빠져도 된다. 빠지면 안 되는 규칙을 걸면 상대 없이는 저장조차 못 해서, 직원을 넣으려면 그 직원이 속할 부서가 먼저 있어야 한다. 이…"
prev_url: "/studies/database-design/cardinality-ratio/"
prev_title: "카디널리티 비율"
next_url: "/studies/database-design/relationship-attributes/"
next_title: "관계 타입의 속성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/participation-constraint/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"모든 학생은 반드시 어느 반에 속해야 한다"와 "학생이 꼭 반장일 필요는 없다"의 차이다. 앞의 규칙은 한 명도 빠지면 안 되고, 뒤의 규칙은 빠져도 된다. 빠지면 안 되는 규칙을 걸면 상대 없이는 저장조차 못 해서, 직원을 넣으려면 그 직원이 속할 부서가 먼저 있어야 한다. 이 규칙은 "적어도 하나는 있어야 하는가"만 정하고 "많아야 몇"은 정하지 않는다.

</div>


## 예시로 보기

"직원은 많아야 한 부서에서 일한다"만 정해 두면 부서가 아예 없는 직원이 들어와도 막을 수 없다. 급여를 부서 예산에서 주는 회사라면 곤란하다. "빠지는 직원이 있어도 되는가"를 따로 정해야 한다.

슬라이드는 같은 직원 일곱 명을 두 관계에 놓고 견준다[^2].

| 관계 타입 | 선에 닿은 직원 | 선에 닿지 않은 직원 | EMPLOYEE의 참여 |
|---|---|---|---|
| WORKS_FOR | $$e_1$$ ~ $$e_7$$ 모두 | 없음 | 전체 참여 |
| MANAGES | $$e_3$$, $$e_5$$, $$e_6$$ | $$e_1$$, $$e_2$$, $$e_4$$, $$e_7$$ | 부분 참여 |

모든 직원은 어느 부서에선가 일해야 한다. 하지만 모든 직원이 부서를 관리하는 것은 아니다.

같은 MANAGES를 부서 쪽에서 보면 $$d_1$$, $$d_2$$, $$d_3$$이 모두 선에 닿아 있다. 참여 제약은 관계 타입마다, 그리고 그 관계의 양쪽에 따로 붙는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 그림에서 선에 닿은 개체와 닿지 않은 개체, 선 없는 직원을 넣으면 전체 참여가 깨지는 것, COMPANY 자료에서 관리자 3명·부양가족이 있는 직원 3명, CONTROLS의 부서가 규칙은 부분 참여인데 자료에서는 모두 끼는 것 — [25_participation-constraint_verify.py](/Hongs_Blog/studies/database-design/code/25_participation-constraint_verify/)</div>

</div>


## 정의

참여 제약은 개체가 존재하려면 그 관계로 다른 개체와 이어져 있어야 하는지를 정한다[^1]. 두 가지다.

- **전체 참여(total participation):** 그 개체 타입의 모든 개체가 관계에 참여해야 한다[^2].
- **부분 참여(partial participation):** 모든 개체가 참여할 필요는 없다[^2].

기호로 쓰면, 개체 집합 $$E$$가 관계 집합 $$R$$에 전체 참여한다는 것은 $$E$$의 개체마다 그 개체가 낀 인스턴스가 하나는 있다는 뜻이다.

$$\forall e \in E,\ \exists r \in R:\ e\text{가 } r\text{에 들어 있다}$$


$$\forall e \in E$$는 "$$E$$의 모든 개체 $$e$$에 대해", $$\exists r \in R$$은 "$$R$$에 그런 인스턴스 $$r$$이 적어도 하나 있다"로 읽는다. 부분 참여는 이 조건을 걸지 않는 것이다[^s1].

전체 참여가 걸린 개체는 상대 개체가 있어야만 존재할 수 있다. 그래서 전체 참여를 존재 종속(existence dependency)이라고도 부른다[^s1].

**그림 기호.** 전체 참여는 개체 타입과 마름모를 잇는 선을 겹선으로 그린다. 부분 참여는 홑선이다[^4].

**COMPANY의 참여 제약.** 슬라이드가 정한 값이다[^3].

| 관계 타입 | 전체 참여 | 부분 참여 | 뜻 |
|---|---|---|---|
| WORKS_FOR | EMPLOYEE, DEPARTMENT | — | 직원은 반드시 부서가 있고, 부서에는 반드시 직원이 있다 |
| MANAGES | DEPARTMENT | EMPLOYEE | 부서에는 반드시 관리자가 있다. 관리자가 아닌 직원도 있다 |
| CONTROLS | PROJECT | DEPARTMENT | 프로젝트는 반드시 관리 부서가 있다. 프로젝트가 없는 부서도 된다 |
| SUPERVISION | — | EMPLOYEE(상사 쪽, 부하 쪽) | 상사가 없는 직원도, 부하가 없는 직원도 된다 |
| WORKS_ON | EMPLOYEE, PROJECT | — | 직원은 프로젝트를 하나는 맡고, 프로젝트에는 직원이 한 명은 있다 |
| DEPENDENTS_OF | DEPENDENT | EMPLOYEE | 부양가족은 반드시 직원에 딸려 있다. 부양가족이 없는 직원도 된다 |

SUPERVISION 줄은 슬라이드의 글이 아니라 그림을 따랐다. 까닭은 [역할 이름과 재귀 관계](/Hongs_Blog/studies/database-design/recursive-relationship/)의 원본 오류 의심에 있다.

## 활용

- 전체 참여는 넣는 순서를 정한다. EMPLOYEE가 WORKS_FOR에 전체 참여하면, 부서가 하나도 없는 데이터베이스에는 직원을 넣을 수 없다.[^s2]
- 자료만 보고는 참여 제약을 정하지 못한다. COMPANY의 자료에서는 세 부서가 모두 프로젝트를 하나 이상 관리한다. 그래도 규칙은 부분 참여다. 프로젝트가 없는 부서가 내일 생겨도 된다는 뜻이기 때문이다[^s2].
- 흔한 실수: 한쪽이 전체 참여면 반대쪽도 그렇다고 여기는 것. MANAGES에서 DEPARTMENT는 전체, EMPLOYEE는 부분이다. 양쪽은 따로 정한다.
- 표로 옮길 때 전체 참여 쪽이 중요해진다. 1:1 관계에서 상대를 가리키는 열을 어느 표에 넣을지를 참여 제약이 정한다: [일대일 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-one-relationship/)

## 연결

- "많아야 몇"을 정하는 짝: [카디널리티 비율](/Hongs_Blog/studies/database-design/cardinality-ratio/). 둘을 합친 것이 관계 타입의 구조 제약이다.
- 숫자 두 개로 적으면 아래 한계가 0이면 부분 참여, 1 이상이면 전체 참여다: [(min, max) 표기](/Hongs_Blog/studies/database-design/min-max-notation/)
- 늘 전체 참여여야 하는 경우: [약한 개체 타입](/Hongs_Blog/studies/database-design/weak-entity-type/)이 주인과 잇는 관계
- 1:N 관계에서 N쪽이 전체 참여면, N쪽 개체마다 상대가 정확히 하나라서 빠짐없이 정해지는 함수가 된다: [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/)[^s2]

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** "프로젝트는 반드시 어느 부서의 관리를 받는다. 프로젝트를 하나도 관리하지 않는 부서가 있어도 된다." CONTROLS에서 어느 쪽이 전체 참여인가? ER 다이어그램에서 겹선은 어디에 긋는가?</summary>

**답:** PROJECT가 전체 참여, DEPARTMENT가 부분 참여다. PROJECT 네모와 CONTROLS 마름모를 잇는 선을 겹선으로 긋는다.<br>
**이유:** "반드시"가 붙은 쪽이 전체 참여다. 겹선은 그 개체 타입 쪽 선에 긋는다. 흔한 오답은 "부서가 관리하는 주체이니 부서 쪽이 전체"다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** WORKS_FOR는 부서 1 : 직원 N이다. 이 "1"만으로 "직원은 반드시 부서가 있다"가 나오는가? 나오지 않는다면 무엇을 더 정해야 하는가?</summary>

**답:** 나오지 않는다. 1은 "직원 한 명의 부서는 많아야 하나"라는 위 한계다. "적어도 하나"는 EMPLOYEE의 전체 참여를 더 정해야 나온다. 둘을 합쳐야 "정확히 한 부서"가 된다.<br>
**이유:** 비율은 위 한계, 참여 제약은 아래 한계다. 같은 1:N이라도 DEPENDENTS_OF의 EMPLOYEE는 부분 참여이고 WORKS_FOR의 EMPLOYEE는 전체 참여다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** EMPLOYEE가 WORKS_FOR에 전체 참여한다는 규칙을 어기는 가장 작은 자료를 만들어라. 같은 자료가 MANAGES에서는 왜 규칙을 어기지 않는가?</summary>

**답:** 직원 $$e_8$$을 넣고 WORKS_FOR에 $$e_8$$이 낀 인스턴스를 하나도 넣지 않는다. 부서가 없는 직원이 생겨 전체 참여에 어긋난다. MANAGES에서는 EMPLOYEE가 부분 참여라, $$e_8$$이 어느 부서도 관리하지 않아도 된다.<br>
**이유:** 전체 참여는 "선에 닿지 않은 개체가 하나도 없다"다. 개체 하나만 빠져도 깨진다. 부분 참여에는 깨질 조건이 없다.

</details>


[^1]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.12 (Constraint 2: Participation Constraint: "Specifies whether the existence of an entity depends on its being related to another entity")
[^2]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.16 (Total Participation, Partial Participation, WORKS_FOR와 MANAGES 그림). 6주차 6-1 풀이 p.5에 같은 그림이 있다.
[^3]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.25~30 (MANAGES, WORKS_FOR, CONTROLS, SUPERVISION, WORKS_ON, DEPENDENTS_OF의 참여). SUPERVISION은 p.34의 그림.
[^4]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.33 (Notation: Total Participation of $$E_2$$ in $$R$$)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 기호로 쓴 식과 "존재 종속"이라는 이름은 슬라이드에 없다. 식은 슬라이드의 "every entity should participate in the relationship"을 옮긴 것이고, 이름은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판, 3장의 것이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 전체 참여가 넣는 순서를 정한다는 설명, 자료만으로는 참여 제약을 정하지 못한다는 설명, 흔한 실수, 함수와 잇는 설명, 표의 "뜻" 칸, 카드 C1~C3은 원본에 없다. COMPANY 자료(6주차 6-2 p.21)에서 센 값은 검증 코드로 확인했다.
{% endraw %}
