---
layout: "note"
title: "일반 개체 타입과 약한 개체 타입 비교"
display_title: "일반 개체 타입과 약한 개체 타입 비교"
kind: "concept"
kind_label: "비교"
num: "28"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Regular vs Weak Entity Type", "강한 개체 타입", "Strong Entity Type", "일반 개체 타입", "Regular Entity Type"]
description: "둘 다 ER 다이어그램의 네모이고 속성을 갖는다. 가르는 질문은 하나다. \"자기 속성만으로 개체 하나를 가려낼 수 있는가.\" 가려낼 수 있으면 일반 개체 타입(regular entity type)이고, 주인 개체를 함께 대야 하면 약한 개체 타입이다. \"다른 개체가 있어야만 존재할…"
prev_url: "/studies/database-design/weak-entity-type/"
prev_title: "약한 개체 타입"
next_url: "/studies/database-design/er-diagram-notation/"
next_title: "ER 다이어그램 표기법"
math: false
mermaid: false
code_count: 0
permalink: "/studies/database-design/regular-vs-weak-entity/"
---
{% raw %}
둘 다 ER 다이어그램의 네모이고 속성을 갖는다. 가르는 질문은 하나다. "자기 속성만으로 개체 하나를 가려낼 수 있는가." 가려낼 수 있으면 일반 개체 타입(regular entity type)이고, 주인 개체를 함께 대야 하면 약한 개체 타입이다. "다른 개체가 있어야만 존재할 수 있는가"는 가르는 질문이 아니다. 이 둘을 섞는 것이 가장 흔한 혼동이다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 대학의 학생. 학생마다 겹치지 않는 학번이 있다. (b) 건물의 호실. 호수(101, 102, …)는 한 건물 안에서만 겹치지 않고, 다른 건물에도 101호가 있다. 각각 어느 쪽인가?</summary>

**답:** (a) 일반 개체 타입. 학번이 키 속성이다. (b) 약한 개체 타입. 호수만으로는 어느 건물의 101호인지 모른다. 주인은 건물이고 호수가 부분 키다.<br>
**이유:** (b)의 호수는 같은 주인(건물) 안에서만 개체를 가려낸다. 그것이 부분 키의 뜻이다. 건물까지 대야 호실 하나가 정해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) COMPANY의 PROJECT. 프로젝트는 반드시 어느 부서의 관리를 받는다(CONTROLS에 전체 참여). 이름과 번호는 회사 전체에서 겹치지 않는다. (d) 부품 주문 데이터베이스(PART_ORDER)의 ORDER. 주문은 반드시 고객 한 명이 낸다(PLACES에 전체 참여). 주문마다 겹치지 않는 주문 번호가 있다. 둘은 약한 개체 타입인가?</summary>

**답:** 둘 다 일반 개체 타입이다. PROJECT는 Name과 Number, ORDER는 주문 번호라는 자기 키가 있다.<br>
**이유:** 전체 참여는 "상대가 있어야 존재한다"는 뜻일 뿐이다. 약한 개체 타입의 조건은 "자기 키가 없다"다. 약한 개체 타입은 늘 전체 참여하지만, 전체 참여한다고 약한 개체 타입인 것은 아니다. 흔한 오답은 "부서 없이는 못 있으니 PROJECT는 약한 개체"다.

</details>


## 결정적 차이

| | 일반 개체 타입 | 약한 개체 타입 |
|---|---|---|
| 자기 속성 안의 키 | 있다 | 없다. 부분 키만 있다 |
| 개체 하나를 가려내는 법 | 키 속성의 값 | 주인 개체와 부분 키의 값을 함께 |
| 주인과 잇는 관계 | 없다 | 식별 관계가 있고, 거기에 늘 전체 참여한다 |
| 다른 관계의 참여 | 전체일 수도 부분일 수도 있다 | 식별 관계 밖에서는 마찬가지다 |
| 그림 | 네모. 키 속성에 밑줄 | 겹네모. 식별 관계는 겹마름모, 부분 키에는 점선 밑줄 |
| COMPANY의 예 | EMPLOYEE, DEPARTMENT, PROJECT | DEPENDENT(주인 EMPLOYEE, 식별 관계 DEPENDENTS_OF, 부분 키 Name) |
| 표로 옮길 때 | [개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/)에서 갈린다 | 같은 문서 |

선택을 가르는 줄은 첫 줄이다. 나머지 줄은 첫 줄에서 따라 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: COMPANY 자료의 DEPENDENT에서 이름만으로는 겹치고(Alice 두 명) 주인과 이름을 묶으면 안 겹치는 것 — [27_weak-entity-type_verify.py](/Hongs_Blog/studies/database-design/code/27_weak-entity-type_verify/). PROJECT와 ORDER의 키와 참여는 COMPANY와 PART_ORDER의 요구사항 글과 손으로 맞췄다.</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 부양가족처럼 주인에 딸린 것을 약한 개체 타입으로 그리지 않는 길이 둘 있다. 무엇이고, 언제 고르는가?</summary>

**답:** ① 주인의 속성으로 둔다. EMPLOYEE에 성분이 여럿인 다치 속성 {Dependents(Name, Sex, Birth_date, Relationship)}을 붙인다. 부양가족이 직원 말고 다른 개체 타입과 따로 이어질 일이 없을 때 고를 수 있다. ② 번호를 새로 매겨 일반 개체 타입으로 만든다. 주문에 주문 번호를 붙이듯, 전체에서 겹치지 않는 번호를 주면 자기 키가 생긴다.<br>
**이유:** 약한 개체 타입은 "주인에 딸려 있으면서, 다른 관계에도 따로 참여해야 하는" 것을 그릴 때 쓸모가 있다. 다른 관계가 없으면 ①로 충분하고, 주인 없이도 가려내고 싶으면 ②가 낫다. 어느 쪽으로 그릴지는 설계자가 정한다[^s2].

</details>


[^s2]: 약한 개체 타입을 주인의 다치 복합 속성으로 대신할 수 있다는 것과 고르는 기준은 Elmasri & Navathe, 같은 책 3장의 설명이다.
{% endraw %}
