---
layout: "note"
title: "스키마와 인스턴스"
display_title: "스키마와 인스턴스 (Schemas and Instances)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Schemas and Instances", "스키마", "Schema", "데이터베이스 스키마", "Database Schema", "스키마 다이어그램", "Schema Diagram", "스키마 진화", "Schema Evolution", "인스턴스", "Instance", "데이터베이스 상태", "Database State", "스냅샷", "Snapshot"]
description: "빈 출석부 양식과 거기 적힌 이름들은 다른 것이다. 데이터베이스도 \"어떤 표에 어떤 칸이 있는가\"라는 틀과 \"지금 그 칸에 무엇이 적혀 있는가\"라는 내용을 갈라서 본다. 틀은 설계할 때 정해 두고 거의 안 바뀌지만, 내용은 한 줄 넣고 고치고 지울 때마다 바뀐다. 둘을 섞으면 \"표…"
prev_url: "/studies/database-design/data-model-categories/"
prev_title: "데이터 모델의 종류"
next_url: "/studies/database-design/three-schema-architecture/"
next_title: "3단계 스키마 구조"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "06_schema-and-instance_verify.py", "u": "/studies/database-design/code/06_schema-and-instance_verify/", "r": "검증"}]
permalink: "/studies/database-design/schema-and-instance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빈 출석부 양식과 거기 적힌 이름들은 다른 것이다. 데이터베이스도 "어떤 표에 어떤 칸이 있는가"라는 틀과 "지금 그 칸에 무엇이 적혀 있는가"라는 내용을 갈라서 본다. 틀은 설계할 때 정해 두고 거의 안 바뀌지만, 내용은 한 줄 넣고 고치고 지울 때마다 바뀐다. 둘을 섞으면 "표가 바뀌었다"는 말이 칸이 늘었다는 뜻인지 줄이 늘었다는 뜻인지 알 수 없다.

</div>


## 예시로 보기

"대학 데이터베이스가 어떻게 생겼느냐"고 물으면 두 가지로 답할 수 있다. 표 이름과 칸 이름만 말할 수도 있고, 지금 들어 있는 학생과 성적을 다 읊을 수도 있다. 앞의 답은 내일도 같지만 뒤의 답은 수강신청이 한 건 들어올 때마다 달라진다. 둘을 따로 부를 이름이 필요하다.

대학 데이터베이스의 틀을 그리면 이렇다. 표마다 이름과 칸 이름만 있고 행은 하나도 없다.

```
STUDENT       | Name | Student_number | Class | Major |
COURSE        | Course_name | Course_number | Credit_hours | Department |
PREREQUISITE  | Course_number | Prerequisite_number |
SECTION       | Section_identifier | Course_number | Semester | Year | Instructor |
GRADE_REPORT  | Student_number | Section_identifier | Grade |
```

STUDENT에 일을 하나씩 해 보면 무엇이 바뀌는지 갈린다[^s1].

| 한 일 | STUDENT의 칸 | STUDENT의 행 | 바뀐 것 |
|---|---|---|---|
| 처음 | Name, Student_number, Class, Major | (Smith, 17, 1, CS), (Brown, 8, 2, CS) | — |
| (Kim, 25, 4, CS)를 넣는다 | 그대로 | 세 행 | 내용 |
| Smith의 Class를 2로 고친다 | 그대로 | 세 행, Smith의 Class가 2 | 내용 |
| Date_of_birth 칸을 더한다 | 다섯 칸 | 세 행, 새 칸은 비어 있다 | 틀 |

Kim을 넣는 줄을 보자. 새 데이터가 들어오면 내용이 바뀌고, 맨 윗줄의 칸 이름은 그대로다. 마지막 줄처럼 칸을 더하는 것은 틀을 고치는 일이다.

출석부 비유는 한 군데서 어긋난다. 종이 양식은 칸을 늘리면 새 종이에 옮겨 적어야 하지만, 데이터베이스는 이미 든 행을 그대로 둔 채 칸을 더한다. 있던 행의 새 칸은 비어 있게 된다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 틀의 칸 수 4, 4, 2, 5, 3(합 18), Kim을 넣으면 내용만 바뀜, 넣기·고치기·지우기마다 내용이 달라지고 틀은 그대로, Date_of_birth를 더하면 틀이 바뀌고 있던 세 행은 남음, 카드 C2 — [06_schema-and-instance_verify.py](/Hongs_Blog/studies/database-design/code/06_schema-and-instance_verify/)</div>

</div>


## 정의

데이터 모델로 데이터베이스를 적을 때는 데이터베이스에 대한 설명과 데이터베이스 그 자체를 갈라야 한다.

- **데이터베이스 스키마(database schema).** 데이터베이스에 대한 설명이다. 데이터베이스를 설계할 때 정의하고, 데이터베이스를 쓰는 동안 드물게 바뀐다. 스키마를 고치는 일을 스키마 진화(schema evolution)라 한다.
- **스키마 다이어그램(schema diagram).** 레코드의 종류(레코드 타입)마다 구조를 보여 주는 그림이다. 실제 레코드는 그리지 않는다. 위의 다섯 줄이 스키마 다이어그램이다.
- **인스턴스(instance).** 어느 한 순간 데이터베이스에 들어 있는 실제 데이터다. 데이터베이스 상태(database state), 스냅샷(snapshot)이라고도 부른다. 그 순간의 데이터 인스턴스를 모두 모은 것이 데이터베이스 상태다.

인스턴스는 "실제로 있는 사례 하나"라는 뜻이고, 스냅샷은 그 순간을 찍은 사진이라는 뜻이다.

상태는 자주 바뀐다. 데이터를 넣고, 고치고, 지울 때마다 데이터베이스는 한 상태에서 다른 상태로 넘어간다.

| | 스키마 | 인스턴스(상태) |
|---|---|---|
| 무엇인가 | 데이터베이스에 대한 설명 | 어느 순간의 실제 데이터 |
| 언제 정해지나 | 설계할 때 | 데이터를 넣고 고치고 지울 때마다 |
| 얼마나 자주 바뀌나 | 드물게 | 자주 |
| 바꾸는 일의 예 | 칸 더하기(스키마 진화) | 행 넣기, 고치기, 지우기 |
| 대학 예 | 표 다섯 개의 이름과 칸 18개 | 그 안의 21행 |

상태는 아무렇게나 바뀌지 않는다. DBMS는 새 상태가 스키마에 적힌 구조와 제약에 맞는지 확인하고, 맞지 않으면 받아들이지 않는다[^s2]. 어떤 제약이 있는지는 [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/)과 [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)에서 다룬다.

### 뒤에서 다시 만나는 곳

같은 구분이 이름만 바꿔 계속 나온다.

- [ER 다이어그램](/Hongs_Blog/studies/database-design/er-diagram-notation/)은 개체 하나하나가 아니라 스키마를 그린다. 데이터베이스 스키마는 드물게 바뀌지만 개체 집합에 든 내용은 자주 바뀌기 때문이다.
- 관계형 모델에서는 표의 틀을 릴레이션 스키마, 지금 든 행들을 릴레이션 상태라 부른다. 현실이 바뀌면 릴레이션 상태가 따라 바뀌고, 릴레이션 스키마는 속성을 더할 때처럼 드물게만 바뀐다. [릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/)과 [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에서 다룬다.

## 연결

- 선수: [데이터 모델의 종류](/Hongs_Blog/studies/database-design/data-model-categories/). 스키마는 어떤 데이터 모델의 말로 적은 설명이다.
- 스키마를 세 단계로 나눠 두는 구조: [3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/)
- 스키마가 저장되는 곳(카탈로그): [데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 데이터베이스 스키마, 스키마 다이어그램, 인스턴스(데이터베이스 상태), 스키마 진화를 각각 한 문장으로 말하라.</summary>

**답:** 스키마는 데이터베이스에 대한 설명이고 설계할 때 정한다. 스키마 다이어그램은 레코드의 종류마다 구조를 보여 주는 그림이고 실제 레코드는 그리지 않는다. 인스턴스는 어느 한 순간 데이터베이스에 들어 있는 실제 데이터이고, 그것을 모두 모은 것이 데이터베이스 상태(스냅샷)다. 스키마 진화는 스키마를 고치는 일이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 다섯 가지 일은 스키마를 바꾸는가, 상태를 바꾸는가? (a) STUDENT에 (Kim, 25, 4, CS)를 넣는다 (b) STUDENT에 Date_of_birth 칸을 더한다 (c) Smith의 Class를 2로 고친다 (d) PREREQUISITE의 행을 모두 지운다 (e) PREREQUISITE 표 자체를 없앤다</summary>

**답:** (a) 상태 (b) 스키마 (c) 상태 (d) 상태 (e) 스키마.<br>
**이유:** 행을 넣고 고치고 지우는 일은 내용만 바꾼다. 칸을 더하거나 표를 없애는 일은 틀을 바꾼다.<br>
**흔한 오답:** (d)를 스키마로 답하는 것. 행이 0개가 되어도 표 이름과 칸 이름은 남는다. 비어 있는 것도 하나의 상태다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 스키마는 드물게 바뀌고 상태는 자주 바뀌는 까닭은 무엇인가? 스키마 다이어그램에 행을 그리지 않는 까닭과 이어서 설명하라.</summary>

**답:** 스키마는 "어떤 종류의 사실을 적는가"를 정하고, 상태는 "지금 어떤 사실이 있는가"를 담는다. 학생이 한 명 들어오고 성적이 하나 나올 때마다 사실은 바뀌지만, 학생마다 이름·학번·학년·전공을 적는다는 약속은 업무가 달라질 때만 바뀐다. 스키마 다이어그램은 그 약속을 보여 주려는 그림이라, 금방 달라질 행을 그려 넣으면 그림이 곧 틀리게 된다.

</details>


[^s1]: 표의 네 줄과 C2의 다섯 가지 일은 검증 코드에서 SQLite로 실행해 확인했다.
[^s2]: Elmasri & Navathe, *Fundamentals of Database Systems* 7판 2.1.2절이 이런 상태를 유효한 상태(valid state)라 부른다.
{% endraw %}
