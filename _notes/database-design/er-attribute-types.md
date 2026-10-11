---
layout: "note"
title: "속성의 종류"
display_title: "속성의 종류 (Types of Attributes)"
kind: "concept"
kind_label: "정의"
num: "20"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Types of Attributes", "복합 속성", "Composite Attribute", "단순 속성", "Simple Attribute", "Atomic Attribute", "단일값 속성", "Single-valued Attribute", "다치 속성", "Multivalued Attribute", "저장 속성", "Stored Attribute", "유도 속성", "Derived Attribute"]
description: "주소는 도로명, 도시, 우편번호로 쪼갤 수 있고, 전화번호는 한 사람이 여러 개 가질 수 있고, 나이는 생일만 알면 계산된다. 대상에 적는 항목은 이렇게 \"더 쪼갤 수 있는가\", \"값이 여럿일 수 있는가\", \"저장하는가 계산하는가\"의 세 물음으로 가른다. 어느 쪽인지에 따라 나중에…"
prev_url: "/studies/database-design/entity-type-and-set/"
prev_title: "개체 타입과 개체 집합"
next_url: "/studies/database-design/key-attribute/"
next_title: "키 속성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/er-attribute-types/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주소는 도로명, 도시, 우편번호로 쪼갤 수 있고, 전화번호는 한 사람이 여러 개 가질 수 있고, 나이는 생일만 알면 계산된다. 대상에 적는 항목은 이렇게 "더 쪼갤 수 있는가", "값이 여럿일 수 있는가", "저장하는가 계산하는가"의 세 물음으로 가른다. 어느 쪽인지에 따라 나중에 표로 옮기는 방법이 달라진다. 처음에 잘못 가르면 값 여러 개를 표의 한 칸에 욱여넣게 된다.

</div>


## 예시로 보기

개체에 적을 항목을 "이름, 주소, 전화번호, 나이"라고만 정하면 뒤에서 곤란해진다. "휴스턴에 사는 직원"을 찾고 싶은데 주소가 통짜 글 한 줄이면 도시만 꺼내기 어렵다. 전화번호가 둘인 직원은 어디에 적을지도 정해야 한다.

직원 $$e_1$$의 주소 "2311 Kirby, Houston, Texas 77001"은 이렇게 쪼개진다[^1].

```
Address
├── Street_address
│   ├── Number            2311
│   ├── Street            Kirby
│   └── Apartment_number  (없음)
├── City                  Houston
├── State                 Texas
└── Zip                   77001
```

Address와 Street_address처럼 더 작은 속성으로 나뉘는 것이 복합 속성이다. 맨 끝의 여섯 개(Number, Street, Apartment_number, City, State, Zip)는 더 못 쪼갠다. 단순 속성이다.

차 세 대의 색을 보면 값의 개수가 다르다[^2].

| 차 | Color |
|---|---|
| CAR₁ | {red, black} |
| CAR₂ | {blue} |
| CAR₃ | {white, blue} |

Color는 한 개체에 값이 여러 개 붙을 수 있다. 다치 속성이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Address 계층의 단순 속성 6개, CAR 표기의 복합 1개·다치 1개·단순 7개, Works_on이 복합이면서 다치인 것, Color 값의 수 2·1·2, 생일에서 나이 계산, 부서별 직원 수 — [20_er-attribute-types_verify.py](/Hongs_Blog/studies/database-design/code/20_er-attribute-types_verify/)</div>

</div>


## 세 가지 물음

| 물음 | 한쪽 | 다른 쪽 |
|---|---|---|
| 더 쪼갤 수 있는가 | **복합 속성**(composite): 더 작은 부분으로 나뉜다. 나뉜 부분이 또 나뉘어 계층을 이룰 수 있다. 예: Address | **단순 속성**(simple): 더 못 나눈다. 원자 속성(atomic)이라고도 한다. 예: City, State, Zip |
| 값이 여럿일 수 있는가 | **다치 속성**(multivalued): 한 개체에 값이 여러 개(값들의 집합)다. 예: 전화번호, 학위 | **단일값 속성**(single-valued): 한 개체에 값이 하나다. 대부분의 속성이 이쪽이다. 예: 나이, 성별, 이름 |
| 저장하는가 | **저장 속성**(stored): 데이터베이스에 실제로 저장한다. 예: 생일 | **유도 속성**(derived): 저장하지 않고 다른 것에서 계산한다. 예: 나이(생일에서 계산) |

세 종류의 정의와 예는 슬라이드의 것이다[^1][^3].

세 물음은 서로 따로다. 속성 하나가 세 물음에 각각 답을 갖는다. 직원이 맡은 프로젝트와 주당 시간을 적는 Works_on(Project, Hours)는 성분이 둘이라 복합이고, 프로젝트를 여럿 맡을 수 있어 다치다[^4].

**글로 적는 법.** 복합 속성은 이름 뒤 괄호에 성분을 쓰고, 다치 속성은 중괄호로 감싼다[^2].

```
CAR: Registration(Number, State), Vehicle_id, Make, Model, Year, {Color}
```

Registration은 성분이 둘인 복합 속성, Color는 다치 속성, 나머지 넷은 단순 단일값 속성이다.

**그림 기호.** 속성은 타원으로 그린다. 다치 속성은 겹타원, 유도 속성은 점선 타원이고, 복합 속성은 성분 타원들을 그 타원에 선으로 붙인다[^5].

## 활용

- 복합 속성은 언제 쓸모 있나: 어떤 때는 주소 전체를 한 덩어리로 쓰고, 어떤 때는 도시만 따로 쓸 때다. 늘 통째로만 쓴다면 쪼갤 필요가 없다[^s1].
- 유도 속성을 저장하지 않는 까닭: 나이는 가만히 있어도 해마다 바뀐다. 생일이 1965-01-09인 사람은 2024-10-04에는 59세이고 2025-01-09에는 60세다. 저장해 두면 그날부터 틀린 값이 된다[^s2].
- COMPANY의 유도 속성: DEPARTMENT의 Number_of_employees는 점선 타원이다[^6]. 그 부서에 소속된 직원을 세면 나온다. COMPANY의 자료에서 세면 5번 부서 4명, 4번 부서 3명, 1번 부서 1명이다[^s2].
- 표로 옮길 때 갈린다. 복합 속성은 단순 성분만 열로 넣는다. 다치 속성은 한 칸에 값 하나만 들어가는 표에 그대로 못 넣어 표를 따로 만든다: [개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/), [다치 속성의 사상](/Hongs_Blog/studies/database-design/mapping-multivalued-attributes/)

## 연결

- 속성이 붙는 대상: [개체 타입과 개체 집합](/Hongs_Blog/studies/database-design/entity-type-and-set/). 관계에도 속성이 붙는다: [관계 타입의 속성](/Hongs_Blog/studies/database-design/relationship-attributes/)
- 개체를 가려내는 데 쓰는 속성: [키 속성](/Hongs_Blog/studies/database-design/key-attribute/). 복합 속성 Registration이 통째로 키가 되는 예가 거기 있다.
- 표에서는 한 칸에 더 못 쪼개는 값 하나만 둔다: [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 속성을 세 물음(복합/단순, 다치/단일값, 저장/유도)으로 가르라. (a) 직원의 Address (b) 사람의 전화번호들 (c) 직원의 나이 (d) 직원의 Works_on(Project, Hours)</summary>

**답:** (a) 복합, 단일값, 저장 (b) 단순, 다치, 저장 (c) 단순, 단일값, 유도 (d) 복합, 다치, 저장.<br>
**이유:** 세 물음은 서로 따로라서 속성마다 답이 셋이다. (d)를 "복합이니까 다치는 아니다"라고 답하면 틀린다. 프로젝트를 여럿 맡으면 (Project, Hours) 짝이 여러 개가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 생일을 저장하면서 나이까지 저장 속성으로 두면 무엇이 곤란한가?</summary>

**답:** 나이는 아무도 고치지 않아도 생일이 지날 때마다 바뀌어야 한다. 저장해 둔 값은 다음 생일부터 틀린다. 생일만 저장하고 나이는 필요할 때 계산하면 늘 맞는다.<br>
**이유:** 같은 사실을 두 군데에 적으면 한쪽만 바뀌었을 때 서로 어긋난다. 유도 속성은 "한쪽에서 계산되는 값"이라 어긋날 일이 없다[^s2].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `Address(Street_address(Number, Street, Apartment_number), City, State, Zip)`를 계층 그림으로 그리면 맨 끝 칸(단순 속성)은 몇 개인가? 복합 속성은 무엇인가?</summary>

**답:** 단순 속성은 Number, Street, Apartment_number, City, State, Zip의 6개다. 복합 속성은 Address와 Street_address 둘이다.<br>
**이유:** 괄호가 붙은 이름이 복합 속성이다. 흔한 오답은 Street_address를 단순 속성으로 세어 7개라고 하거나, 맨 위 Address만 복합이라고 하는 것이다.

</details>


[^1]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.9 (Category 1: Composite vs Simple Attributes, Address 계층 그림). 주소 값은 p.8의 $$e_1$$ 그림.
[^2]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.12 (CAR 개체 집합과 표기 `Registration (Number, State), Vehicle_id, Make, Model, Year, {Color}`)
[^3]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.10 (Category 2: Single-valued vs Multivalued, Category 3: Stored vs Derived). 5주차 p.4에 같은 내용이 있다.
[^4]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.14 (EMPLOYEE의 Works_on: 성분 Project, Hours가 붙은 겹타원)
[^5]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.33 (Notation of the ER Diagram)
[^6]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.5 (COMPANY ER 다이어그램의 Number_of_employees)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 4-2 p.9는 "When are composite attributes useful?"라고 묻기만 한다. 답은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판, 3장의 설명이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 나이를 저장하지 않는 까닭, 날짜에 따른 나이 계산, 부서별 직원 수, 세 물음이 서로 따로라는 설명, 주소 계층의 값 배치, 카드 C1~C3은 원본에 없다. 생일과 부서 번호는 6주차 6-2 p.21의 COMPANY 자료이고, 계산은 검증 코드로 확인했다.
{% endraw %}
