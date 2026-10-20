---
layout: "note"
title: "데이터 모델의 종류"
display_title: "데이터 모델의 종류 (Categories of Data Models)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Categories of Data Models", "데이터 모델", "Data Model", "데이터 추상화", "Data Abstraction", "개념적 데이터 모델", "Conceptual Data Model", "고수준 데이터 모델", "High-level Data Model", "표현적 데이터 모델", "Representational Data Model", "구현 데이터 모델", "Implementation Data Model", "물리적 데이터 모델", "Physical Data Model", "저수준 데이터 모델", "Low-level Data Model", "접근 경로", "Access Path"]
description: "\"학생이 과목을 듣는다\"는 같은 사실도 누구에게 보여 주느냐에 따라 다르게 적는다. 누구나 알아듣게 \"무엇이 있고 서로 어떻게 이어지나\"로 적는 방식, 표처럼 사용자도 이해하고 컴퓨터에도 바로 올릴 수 있게 적는 방식, 디스크에 어떤 모양과 순서로 놓이는지까지 적는 방식이 있다. …"
prev_url: "/studies/database-design/dbms-features/"
prev_title: "DBMS의 기능과 쓰지 않을 때"
next_url: "/studies/database-design/schema-and-instance/"
next_title: "스키마와 인스턴스"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "05_data-model-categories_verify.py", "u": "/studies/database-design/code/05_data-model-categories_verify/", "r": "검증"}]
permalink: "/studies/database-design/data-model-categories/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"학생이 과목을 듣는다"는 같은 사실도 누구에게 보여 주느냐에 따라 다르게 적는다. 누구나 알아듣게 "무엇이 있고 서로 어떻게 이어지나"로 적는 방식, 표처럼 사용자도 이해하고 컴퓨터에도 바로 올릴 수 있게 적는 방식, 디스크에 어떤 모양과 순서로 놓이는지까지 적는 방식이 있다. 위쪽일수록 읽기 쉽지만 그대로는 컴퓨터에 올리지 못하고, 아래쪽일수록 정확하지만 전문가만 읽는다. 그래서 요구를 모을 때는 맨 위 방식으로 시작하고, 실제로 쓰는 제품은 대부분 가운데 방식을 받는다.

</div>


## 예시로 보기

데이터베이스를 처음 만들면서 교무과 직원에게 "레코드의 31번째 글자부터 학번이 맞습니까?"라고 물으면 대화가 안 된다. 반대로 "학생이 과목을 듣는다"는 말만으로는 디스크에 한 글자도 쓸 수 없다. 듣는 사람에 따라 적는 말이 달라야 한다.

같은 대학 이야기를 세 가지 말로 적으면 이렇다.

| 적는 말 | "학생이 과목을 듣는다"를 적으면 |
|---|---|
| 누구나 알아듣는 말 | 학생이라는 대상이 있고 이름과 전공을 가진다. 과목이라는 대상이 있다. 둘 사이에 "수강한다(take_course)"라는 이어짐이 있다 |
| 표로 적는 말 | STUDENT(Name, Student_number, Class, Major) 표와 COURSE(Course_name, Course_number, Credit_hours, Department) 표가 있다. 누가 무엇을 들었는지는 GRADE_REPORT와 SECTION 표가 학번과 분반 번호로 잇는다[^s1] |
| 저장 모양까지 적는 말 | STUDENT 레코드는 39글자다. 1~30번째가 이름, 31~34번째가 학번, 35번째가 학년, 36~39번째가 전공이다[^s1] |

세 줄은 같은 내용이다. 표에서 "누가 어느 과목을 들었나"를 뽑으면 여섯 쌍이 나오고, 저장 모양대로 39글자에 채워 넣었다가 다시 끊어 읽으면 표의 행이 그대로 나온다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표에서 뽑은 수강 여섯 쌍, STUDENT 레코드를 39바이트로 채웠다가 다시 읽으면 표의 행과 같음, 색인을 달아도 답이 같음 — [05_data-model-categories_verify.py](/Hongs_Blog/studies/database-design/code/05_data-model-categories_verify/)</div>

</div>


## 데이터 모델과 세 갈래

데이터가 어떻게 짜여 저장되는지의 세부는 누르고, 데이터를 이해하는 데 꼭 필요한 특징만 드러내는 일을 데이터 추상화(data abstraction)라 한다. 그 덕에 사용자마다 자기가 원하는 만큼만 자세히 데이터를 볼 수 있다.

데이터 모델(data model)은 데이터베이스의 구조를 적는 데 쓰는 개념들의 모음이다. 데이터 추상화를 하려면 적을 말이 있어야 하는데, 그 말을 주는 것이 데이터 모델이다. 자료형, 관계, 제약, 그리고 찾기와 고치기를 적는 기본 연산이 여기에 든다.

데이터 모델은 구조를 적을 때 어떤 개념을 쓰느냐에 따라 셋으로 나눈다.

| 종류 | 누구를 위한 개념인가 | 쓰는 개념 | 대표 |
|---|---|---|---|
| 개념적 데이터 모델 (고수준) | 컴퓨터를 전공하지 않은 사용자와 이해관계자까지 포함한 누구나 | 개체, 속성, 관계 | ER 모델 |
| 표현적 데이터 모델 (둘 사이) | 최종 사용자도 쉽게 이해하지만, 컴퓨터 안에서 데이터가 짜인 모양과 너무 멀지 않다 | 표처럼 그대로 구현할 수 있는 구조 | 관계형 모델, 네트워크 모델, 계층 모델 |
| 물리적 데이터 모델 (저수준) | 컴퓨터 전문가. 최종 사용자를 위한 것이 아니다 | 레코드 형식, 레코드를 놓는 순서, 접근 경로 | — |

**개념적 데이터 모델.** 쓰는 개념은 셋이다.

- 개체(entity): 현실의 대상이나 개념. 예: 학생, 과목.
- 속성(attribute): 개체를 설명하는, 관심 있는 성질. 예: 학생의 이름, 전공.
- 관계(relationship): 둘 이상의 개체 사이의 이어짐. 예: 수강한다.

특정 데이터베이스를 만들기 전, 요구를 모으는 단계에서 쓴다. 흔히 쓰는 것이 개체-관계 모델, 줄여서 ER 모델이다.

**표현적 데이터 모델.** 디스크에 저장하는 세부는 많이 가리지만 그대로 구현할 수 있다. 그래서 대부분의 상용 DBMS가 이 종류를 쓴다. 구현 데이터 모델이라고도 부른다[^s2].

**물리적 데이터 모델.** 데이터가 컴퓨터(디스크)에 어떻게 저장되는지를 적는다. 접근 경로(access path)는 원하는 레코드를 빨리 찾게 해 주는 길이고, 색인이 그 예다[^s2].

### 이 과목에서의 자리

| 종류 | 배우는 곳 |
|---|---|
| 개념적 | ER 모델: [개체 타입과 개체 집합](/Hongs_Blog/studies/database-design/entity-type-and-set/)부터 |
| 표현적 | 관계형 모델: [릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/)부터 |
| 물리적 | 접근 경로의 하나인 [B-트리](/Hongs_Blog/studies/database-design/b-tree/) |

개념적 모델로 적은 설계는 그대로는 DBMS에 못 올린다. 표현적 모델로 옮겨 적는 단계가 따로 있다: [데이터베이스 설계 과정](/Hongs_Blog/studies/database-design/database-design-process/).

## 연결

- 선수: [데이터베이스와 DBMS](/Hongs_Blog/studies/database-design/database-and-dbms/), [데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/)(저장 세부를 가리는 데이터 추상화)
- 세 종류의 모델이 한 DBMS 안에서 층층이 쓰이는 모습: [3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/)
- 모델로 적은 틀과 그 안에 든 내용의 구분: [스키마와 인스턴스](/Hongs_Blog/studies/database-design/schema-and-instance/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 데이터 모델이란 무엇인가? 세 종류와 각각의 대표 모델 또는 쓰는 개념을 쓰라.</summary>

**답:** 데이터 모델은 데이터베이스의 구조를 적는 데 쓰는 개념들의 모음이고, 데이터 추상화를 이루는 수단이다. ① 개념적(고수준): 개체, 속성, 관계. 대표는 ER 모델. ② 표현적: 사용자도 이해하고 그대로 구현할 수 있다. 관계형, 네트워크, 계층 모델. ③ 물리적(저수준): 레코드 형식, 레코드 순서, 접근 경로.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 세 문장은 각각 어느 종류의 데이터 모델로 적은 것인가? (a) "학생과 과목 사이에 수강한다는 관계가 있다." (b) "레코드를 학번 순으로 놓고 학번으로 찾는 색인을 단다." (c) "STUDENT(Name, Student_number, Class, Major)"</summary>

**답:** (a) 개념적 (b) 물리적 (c) 표현적.<br>
**이유:** (a)는 개체와 관계만 말하고 어떻게 담을지는 말하지 않는다. (b)는 레코드 순서와 접근 경로, 곧 저장하는 방법을 말한다. (c)는 표의 이름과 칸으로 적었다. 사용자도 읽을 수 있고 DBMS에 그대로 만들 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 대부분의 상용 DBMS는 왜 개념적 모델도 물리적 모델도 아닌 표현적 모델을 쓰는가?</summary>

**답:** 양쪽 끝의 약점을 피하기 때문이다. 개념적 모델은 누구나 읽지만 그대로는 컴퓨터에 구현할 수 없다. 물리적 모델은 그대로 구현되지만 최종 사용자가 읽을 수 없다. 표현적 모델은 사용자가 이해할 수 있으면서 컴퓨터 안의 짜임과 멀지 않아 그대로 구현할 수 있다.

</details>


[^s1]: 세 줄이 같은 내용이라는 것은 검증 코드로 확인했다.
[^s2]: Elmasri & Navathe, *Fundamentals of Database Systems* 7판 2.1.1절을 따랐다.
{% endraw %}
