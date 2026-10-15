---
layout: "note"
title: "관계 타입의 속성"
display_title: "관계 타입의 속성 (Attributes of Relationship Types)"
kind: "concept"
kind_label: "정의"
num: "26"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Attributes of Relationship Types", "관계 속성", "Relationship Attribute", "속성 옮기기", "Attribute Migration", "Hours", "Start_date"]
description: "\"김씨가 A 프로젝트에 주 10시간 일한다\"에서 10시간은 김씨의 것도 A 프로젝트의 것도 아니고, 김씨와 A라는 짝에 붙은 값이다. 이런 값은 사람이나 프로젝트가 아니라 둘을 잇는 줄에 적는다. 한쪽이 상대를 하나만 가질 수 있는 관계라면 그 값을 그쪽 대상으로 옮겨 적어도 뜻이…"
prev_url: "/studies/database-design/participation-constraint/"
prev_title: "참여 제약"
next_url: "/studies/database-design/weak-entity-type/"
next_title: "약한 개체 타입"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/relationship-attributes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"김씨가 A 프로젝트에 주 10시간 일한다"에서 10시간은 김씨의 것도 A 프로젝트의 것도 아니고, 김씨와 A라는 짝에 붙은 값이다. 이런 값은 사람이나 프로젝트가 아니라 둘을 잇는 줄에 적는다. 한쪽이 상대를 하나만 가질 수 있는 관계라면 그 값을 그쪽 대상으로 옮겨 적어도 뜻이 같다. 양쪽 다 상대를 여럿 가질 수 있으면 옮길 곳이 없다.

</div>


## 예시로 보기

"직원이 프로젝트에 주당 몇 시간 일하는가"를 어디에 적을지 정해야 한다. 직원에 적어 보자. Smith는 1번 프로젝트에 32.5시간, 2번 프로젝트에 7.5시간 일한다. Smith의 "시간" 칸에 적을 값이 둘이다. 프로젝트에 적어도 마찬가지다. 1번 프로젝트에는 Smith의 32.5시간과 English의 20.0시간이 있다.

| 직원 | 프로젝트 | Hours |
|---|---|---|
| Smith | 1 | 32.5 |
| Smith | 2 | 7.5 |
| English | 1 | 20.0 |
| English | 2 | 20.0 |

값은 (직원, 프로젝트) 짝마다 하나씩 정해진다. 짝은 곧 관계 인스턴스다. 그래서 Hours는 관계 타입 WORKS_ON에 붙인다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: COMPANY 자료의 WORKS_ON 16줄에서 Hours가 직원만으로도 프로젝트만으로도 정해지지 않고 짝으로는 정해지는 것, 1:1인 MANAGES의 시작 날짜는 양쪽 어느 개체로도 정해지는 것, 1:N에서는 N쪽 개체로만 정해지는 것 — [26_relationship-attributes_verify.py](/Hongs_Blog/studies/database-design/code/26_relationship-attributes_verify/)</div>

</div>


## 정의

관계 타입도 개체 타입처럼 속성을 가질 수 있다. 관계 타입의 속성 값은 관계 인스턴스마다 하나씩 붙는다. COMPANY의 예는 둘이다.

- WORKS_ON의 Hours: 직원이 그 프로젝트에 주당 일하는 시간
- MANAGES의 Start_date: 관리자가 그 부서를 맡기 시작한 날

ER 다이어그램에서는 속성 타원을 마름모에 선으로 붙인다.

**옮길 수 있는 곳.** 관계 타입의 비율에 따라, 관계에 붙은 속성을 참여하는 개체 타입으로 옮겨 적을 수 있는지가 정해진다.

| 비율 | 옮길 수 있는 곳 | 예 | 까닭 |
|---|---|---|---|
| 1:1 | 양쪽 어느 개체 타입으로든 | MANAGES의 Start_date → DEPARTMENT 또는 EMPLOYEE | 양쪽 개체 모두 인스턴스 하나에만 낀다 |
| 1:N | N쪽 개체 타입으로만 | WORKS_FOR에 시작 날짜를 붙인다면 → EMPLOYEE | N쪽 개체는 인스턴스 하나에만 낀다 |
| M:N | 옮길 수 없다 | WORKS_ON의 Hours | 양쪽 개체 모두 인스턴스 여러 개에 낀다 |

까닭은 한 줄이다. 어떤 개체가 인스턴스 하나에만 낀다면, 그 인스턴스의 값을 "그 개체의 값"이라고 불러도 값이 하나로 정해진다[^s1]. 직원은 WORKS_FOR 인스턴스 하나에만 끼므로 "이 직원이 부서에서 일하기 시작한 날"은 직원마다 하나다. 부서는 인스턴스 여럿에 끼므로 "이 부서의 시작 날짜"는 직원 수만큼 있다.

M:N 관계에서는 값이 참여 개체들의 짝으로만 정해진다. 그래서 Hours는 어느 참여 개체로도 옮길 수 없다.

## 활용

- 관계 타입에 속성이 꼭 있어야 하는가: 아니다. 짝에 붙는 값이 있을 때만 붙인다. COMPANY의 여섯 관계 타입 가운데 속성이 있는 것은 WORKS_ON과 MANAGES 둘뿐이다.
- 옮길 수 있다고 해서 꼭 옮기는 것은 아니다. COMPANY의 그림은 Start_date를 MANAGES에 그대로 붙여 두었다. 표로 옮길 때 비로소 어느 표의 열이 될지 정한다. Start_date는 DEPARTMENT 표의 Mgr_start_date가 된다: [일대일 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-one-relationship/)
- M:N 관계의 속성은 표로 옮겨도 갈 곳이 관계를 옮긴 표뿐이다. Hours는 WORKS_ON 표의 열이 된다: [다대다·n항 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-many-to-many-relationship/)
- 요구사항에서 알아보는 신호: "A가 B를 여럿 갖고, B마다 값이 하나씩 딸린다". 처음 설계에서 EMPLOYEE의 Works_on(Project, Hours)처럼 성분이 둘인 다치 속성으로 적히는 것이 이것이다: [ER 설계 절차](/Hongs_Blog/studies/database-design/er-design-steps/)

## 연결

- 인스턴스 몇 개에 끼는지를 정하는 규칙: [카디널리티 비율](/Hongs_Blog/studies/database-design/cardinality-ratio/)
- 개체 타입에 붙는 속성과 종류: [속성의 종류](/Hongs_Blog/studies/database-design/er-attribute-types/). 관계 타입의 속성도 복합이나 다치일 수 있다. 설계 연습의 MOVIE 문제에서 ACTS는 다치 속성 Quotes를, REVIEWS는 복합 속성 Rating을 갖는다: [ER 다이어그램 설계 연습](/Hongs_Blog/studies/database-design/er-diagram-design-practice/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 속성을 참여 개체 타입으로 옮길 수 있는가? 옮길 수 있다면 어느 쪽인가? (a) MANAGES(1:1)의 Start_date (b) 부서 1 : 직원 N인 WORKS_FOR에 붙인 시작 날짜 (c) WORKS_ON(M:N)의 Hours</summary>

**답:** (a) DEPARTMENT로도 EMPLOYEE로도 옮길 수 있다. (b) N쪽인 EMPLOYEE로만 옮길 수 있다. (c) 옮길 수 없다. 관계 타입에 남는다.<br>
**이유:** 인스턴스 하나에만 끼는 개체 쪽으로만 옮길 수 있다. 1:1은 양쪽 다, 1:N은 N쪽만, M:N은 어느 쪽도 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 부서 1 : 직원 N인 WORKS_FOR의 시작 날짜를 1쪽인 DEPARTMENT로는 옮길 수 없는 까닭을 설명하라.</summary>

**답:** 부서 하나는 직원 수만큼의 인스턴스에 낀다. 인스턴스마다 시작 날짜가 다르므로 "부서의 시작 날짜"는 값이 하나로 정해지지 않는다. 직원 한 명은 인스턴스 하나에만 끼므로 직원 쪽으로는 값이 하나로 정해진다.<br>
**이유:** 속성은 개체마다 값이 하나여야 한다. 흔한 오답은 "1쪽이 더 중요한 쪽이니 1쪽으로 옮긴다"다. 옮길 수 있는 쪽은 여럿이 모이는 N쪽이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** Hours를 EMPLOYEE의 속성으로 옮기면 깨지는 것을 위 표의 자료로 보여라. PROJECT로 옮겨도 깨지는 것을 보여라.</summary>

**답:** EMPLOYEE로 옮기면 Smith의 Hours가 32.5와 7.5 둘이 된다. 어느 프로젝트의 시간인지도 알 수 없다. PROJECT로 옮기면 1번 프로젝트의 Hours가 32.5(Smith)와 20.0(English) 둘이 된다.<br>
**이유:** Hours는 직원과 프로젝트의 짝이 정한다. 한쪽만으로는 값이 하나로 정해지지 않는다. English처럼 두 프로젝트의 시간이 우연히 같은 직원(20.0, 20.0)만 보면 옮겨도 될 것처럼 보이지만, Smith 한 명이 반례다.

</details>


[^s1]: 1:N의 시작 날짜 값은 검증 코드에서 지어낸 것이다.
{% endraw %}
