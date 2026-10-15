---
layout: "note"
title: "개체 타입과 개체 집합"
display_title: "개체 타입과 개체 집합 (Entity Type, Entity Set)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Entity Type", "Entity Set", "개체", "Entity", "속성", "Attribute", "엔티티 타입", "엔티티 집합", "Extension", "ER 모델", "Entity-Relationship Model"]
description: "붕어빵 틀과 붕어빵의 차이다. \"직원이라면 이름, 나이, 급여를 적는다\"는 틀이 있고, 그 틀에 맞춰 지금 적혀 있는 직원 한 사람 한 사람의 모음이 있다. 틀은 한번 정하면 좀처럼 안 바뀌고, 모음은 직원이 들어오고 나갈 때마다 바뀐다. 둘을 같은 이름으로 부르기 때문에, 지금 …"
prev_url: "/studies/database-design/database-design-process/"
prev_title: "데이터베이스 설계 과정"
next_url: "/studies/database-design/er-attribute-types/"
next_title: "속성의 종류"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/entity-type-and-set/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

붕어빵 틀과 붕어빵의 차이다. "직원이라면 이름, 나이, 급여를 적는다"는 틀이 있고, 그 틀에 맞춰 지금 적혀 있는 직원 한 사람 한 사람의 모음이 있다. 틀은 한번 정하면 좀처럼 안 바뀌고, 모음은 직원이 들어오고 나갈 때마다 바뀐다. 둘을 같은 이름으로 부르기 때문에, 지금 말하는 것이 틀인지 모음인지 늘 가려야 한다.

</div>


## 예시로 보기

회사 데이터베이스에 무엇을 넣을지 정하려면, 먼저 "무엇에 대해 적는가"와 "그것의 무엇을 적는가"를 갈라야 한다. ER 모델은 자료를 세 가지로 적는다. 대상(개체), 대상에 적는 항목(속성), 대상 사이의 관계다.

직원 한 사람 $$e_1$$과 회사 하나 $$c_1$$을 적으면 이렇다.

| 대상 | 항목 = 값 |
|---|---|
| $$e_1$$ | Name = John Smith, Address = 2311 Kirby, Houston, Texas 77001, Age = 55, Home_phone = 713-749-2630 |
| $$c_1$$ | Name = Sunco Oil, Headquarters = Houston, President = John Smith |

$$e_1$$, $$c_1$$처럼 따로 가려낼 수 있는 대상 하나하나를 개체라 하고, Name, Age 같은 항목을 속성이라 한다. 개체는 속성마다 값을 하나씩 갖는다.

직원은 한 명이 아니다. 직원이라면 누구나 같은 항목을 적으므로, 항목 목록은 한 번만 정해 두고 그 아래에 직원들을 모은다.

| | EMPLOYEE | COMPANY |
|---|---|---|
| 틀: 이름과 속성 목록 | Name, Age, Salary | Name, Headquarters, President |
| 모음: 지금 들어 있는 개체들 | $$e_1$$ = (John Smith, 55, 80k) | $$c_1$$ = (Sunco Oil, Houston, John Smith) |
| | $$e_2$$ = (Fred Brown, 40, 30K) | $$c_2$$ = (Fast Computer, Dallas, Bob King) |
| | $$e_3$$ = (Judy Clark, 25, 20K) | ⋮ |
| | ⋮ | |

윗줄의 틀이 개체 타입이고, 아랫줄의 모음이 개체 집합이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 그림의 개체 다섯 개가 타입의 속성 수와 맞는 것, 개체를 넣고 빼도 타입은 그대로인 것 — [19_entity-type-and-set_verify.py](/Hongs_Blog/studies/database-design/code/19_entity-type-and-set_verify/)</div>

</div>


## 정의

- **개체(entity):** 현실 세계에서 따로 존재하는 것. 사람, 차, 집, 학생처럼 눈에 보이는 것일 수도 있고, 회사, 부서, 프로젝트처럼 생각 속에만 있는 것일 수도 있다.
- **속성(attribute):** 개체를 설명하는 성질. 이름, 나이, 주소, 급여, 생일 같은 것이다.
- **개체 타입(entity type):** 같은 속성들을 갖는 개체들의 모음을 정하는 틀. 이름과 속성 목록으로 적는다. 예: 이름이 EMPLOYEE이고 속성이 Name, Age, Salary 셋인 개체 타입.
- **개체 집합(entity set):** 어느 한 시점에 데이터베이스에 들어 있는, 그 타입의 개체 전부[^s1]. 개체 집합을 그 타입의 외연(extension)이라고도 부른다.

글로 적을 때는 개체 타입을 `EMPLOYEE(Name, Age, Salary)`처럼 이름 뒤 괄호에 속성을 늘어놓는다.

개체 타입과 개체 집합은 보통 같은 이름으로 부른다[^s1]. "EMPLOYEE에 속성을 하나 더한다"의 EMPLOYEE는 타입이고, "EMPLOYEE에 세 명이 있다"의 EMPLOYEE는 집합이다.

## 활용

- ER 다이어그램에는 타입만 그린다. 네모 하나가 개체 타입 하나다. 개체 집합의 내용은 그리지 않는다. 틀은 드물게 바뀌고 내용은 자주 바뀌기 때문이다. 기호는 [ER 다이어그램 표기법](/Hongs_Blog/studies/database-design/er-diagram-notation/)에 있다.
- 흔한 실수: 개체 하나를 개체 타입으로 그리는 것. "John Smith"는 네모가 아니다. 네모는 EMPLOYEE다.
- 위 표에서 $$c_1$$의 President 값은 John Smith이고, $$e_1$$의 Name도 John Smith다. 한 개체의 속성 값이 다른 개체를 가리키고 있다. 이런 속성은 설계를 다듬을 때 관계로 바꾼다: [ER 설계 절차](/Hongs_Blog/studies/database-design/er-design-steps/).

## 연결

- 틀과 내용을 가르는 같은 생각을 데이터베이스 전체에 쓴 것: [스키마와 인스턴스](/Hongs_Blog/studies/database-design/schema-and-instance/). 개체 타입은 스키마 쪽이고 개체 집합은 상태 쪽이다.
- 속성을 더 잘게 가르는 법: [속성의 종류](/Hongs_Blog/studies/database-design/er-attribute-types/). 개체를 가려내는 속성: [키 속성](/Hongs_Blog/studies/database-design/key-attribute/)
- 개체끼리 잇는 것에도 같은 짝(타입과 집합)이 있다: [관계 타입과 관계 집합](/Hongs_Blog/studies/database-design/relationship-type-and-set/)
- 표로 옮기면 개체 타입은 릴레이션 스키마가, 개체 하나는 행 하나가 된다: [릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/), [개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 개체, 속성, 개체 타입, 개체 집합을 각각 한 문장으로 쓰라.</summary>

**답:** 개체는 현실 세계에서 따로 존재하는 것 하나다. 속성은 개체를 설명하는 성질이다. 개체 타입은 같은 속성들을 갖는 개체들의 모음을 정하는 틀이고, 이름과 속성 목록으로 적는다. 개체 집합은 어느 시점에 데이터베이스에 들어 있는 그 타입의 개체 전부다.<br>
**이유:** 개체에는 회사나 프로젝트처럼 손에 잡히지 않는 것도 들어간다. "눈에 보이는 물건"이라고만 쓰면 반만 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음은 개체 타입에 대한 말인가, 개체 집합에 대한 말인가? (a) EMPLOYEE에는 Name, Age, Salary가 있다. (b) EMPLOYEE에 Judy Clark이 새로 들어왔다. (c) COMPANY에 속성 Founded_year를 더한다. (d) 지금 COMPANY는 두 곳이다.</summary>

**답:** (a) 타입 (b) 집합 (c) 타입 (d) 집합.<br>
**이유:** 속성 목록을 말하면 타입이고, 지금 들어 있는 개체를 말하면 집합이다. (b)에서 직원이 들어와도 속성 목록은 그대로다. 흔한 오답은 (b)를 "EMPLOYEE가 바뀌었으니 타입이 바뀐 것"으로 보는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** ER 다이어그램에는 왜 개체 집합의 내용($$e_1$$, $$e_2$$, …)을 그리지 않고 개체 타입만 그리는가?</summary>

**답:** 다이어그램은 데이터베이스의 틀(스키마)을 보이려는 그림이기 때문이다. 틀은 드물게 바뀌지만 개체 집합의 내용은 자주 바뀐다. 내용을 그리면 직원이 한 명 들어올 때마다 그림을 고쳐야 한다.<br>
**이유:** 설계는 틀을 정하는 일이라 틀만 있으면 된다.

</details>


[^s1]: "어느 한 시점에 들어 있는 그 타입의 개체 전부"라는 정의와, 타입과 집합을 같은 이름으로 부른다는 설명은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판, 3장의 것이다.
{% endraw %}
