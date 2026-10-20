---
layout: "note"
title: "DBMS 언어와 인터페이스"
display_title: "DBMS 언어와 인터페이스 (DBMS Languages and Interfaces)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["DBMS Languages and Interfaces", "DBMS 언어", "데이터 정의어", "Data Definition Language", "DDL", "저장 정의어", "Storage Definition Language", "SDL", "뷰 정의어", "View Definition Language", "VDL", "데이터 조작어", "Data Manipulation Language", "DML", "절차적 DML", "Procedural DML", "비절차적 DML", "Non-procedural DML", "선언적 언어", "Declarative Language", "DBMS 인터페이스", "메뉴 기반 인터페이스", "서식 기반 인터페이스", "그래픽 사용자 인터페이스", "GUI", "자연어 인터페이스"]
description: "데이터베이스를 관리하는 프로그램(DBMS)에 일을 시키는 말은 무엇을 시키느냐에 따라 갈린다. 표의 틀을 정하는 말, 디스크에 어떻게 둘지 정하는 말, 사용자마다 보여 줄 모습을 정하는 말이 있고, 틀이 선 뒤에 자료를 넣고 찾고 고치고 지우는 말이 따로 있다. 자료를 다루는 말은…"
prev_url: "/studies/database-design/data-independence/"
prev_title: "데이터 독립성"
next_url: "/studies/database-design/dbms-component-modules/"
next_title: "DBMS 구성 모듈"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "09_dbms-languages-interfaces_verify.py", "u": "/studies/database-design/code/09_dbms-languages-interfaces_verify/", "r": "검증"}]
permalink: "/studies/database-design/dbms-languages-interfaces/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터베이스를 관리하는 프로그램(DBMS)에 일을 시키는 말은 무엇을 시키느냐에 따라 갈린다. 표의 틀을 정하는 말, 디스크에 어떻게 둘지 정하는 말, 사용자마다 보여 줄 모습을 정하는 말이 있고, 틀이 선 뒤에 자료를 넣고 찾고 고치고 지우는 말이 따로 있다. 자료를 다루는 말은 다시 "무엇을 원하는지만 말하는" 방식과 "한 줄씩 어떻게 찾을지 차례를 적는" 방식으로 나뉘는데, 앞쪽은 짧고 쉽지만 찾는 방법을 DBMS에 맡겨야 한다. 이런 말을 모르는 사람을 위해 메뉴, 서식, 그림 화면 같은 창구도 함께 준다.

</div>


## 예시로 보기

데이터베이스의 설계를 마쳤고, 그것을 올릴 DBMS도 골랐다. 다음에 할 일은 무엇인가? 세 스키마와 그 사이의 사상을 DBMS에 알려 주는 것이다. 스키마가 들어가고 데이터가 채워진 다음에는 그 데이터를 다룰 도구가 있어야 한다. 알려 주는 말과 다루는 말이 따로 필요하다.

요즘 DBMS에서는 이 말들이 SQL이라는 언어 하나에 들어 있다[^s1]. 아래는 STUDENT 표 하나에 네 가지 말을 한 번씩 쓴 것이다. 문법은 뒤에서 배운다. 지금은 문장마다 무엇을 시키는지만 보면 된다.

```sql
-- 표의 틀을 정한다
CREATE TABLE STUDENT (Name VARCHAR(30), Student_number INT, Class INT, Major VARCHAR(4));

-- 어느 사용자에게 보여 줄 모습을 정한다: 전공이 CS인 학생의 이름과 학번만
CREATE VIEW CS_STUDENT AS SELECT Name, Student_number FROM STUDENT WHERE Major = 'CS';

-- 디스크에서 찾아가는 길을 정한다: 학번으로 찾는 색인
CREATE INDEX STUDENT_BY_NUMBER ON STUDENT (Student_number);

-- 자료를 넣는다
INSERT INTO STUDENT VALUES ('Kim', 25, 4, 'CS');

-- 자료를 찾는다
SELECT Name FROM STUDENT WHERE Major = 'CS';
```

첫 문장으로 표를 만들고 Smith와 Brown 두 행을 넣어 둔 뒤 나머지 네 문장을 차례로 돌리면, 무엇이 바뀌는지가 갈린다[^s1].

| 문장 | DBMS가 기억하는 정의(카탈로그) | 저장된 행 | 돌려주는 것 |
|---|---|---|---|
| CREATE VIEW | 바뀐다 | 그대로 | 없음 |
| CREATE INDEX | 바뀐다 | 그대로 | 없음 |
| INSERT | 그대로 | 바뀐다 | 없음 |
| SELECT | 그대로 | 그대로 | Smith, Brown, Kim |

앞의 두 문장은 "데이터베이스가 어떻게 생겼는가"를 고친다. 뒤의 두 문장은 그 안의 데이터를 다룬다. 언어의 종류는 이 차이로 갈린다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 다섯 문장을 적힌 그대로 실행해 표의 결과가 나오는 것, "Brown이 A를 받은 과목"을 두 방식으로 구하면 같은 답(MATH2410, CS1310, CS3380)이고 한 줄씩 꺼내는 방식은 레코드를 17번 꺼냄, 카드 C2 — [09_dbms-languages-interfaces_verify.py](/Hongs_Blog/studies/database-design/code/09_dbms-languages-interfaces_verify/)</div>

</div>


## 네 가지 언어

DBMS는 사용자가 여러 부류라서 여러 종류의 언어를 준다. 데이터베이스 설계자는 개념 스키마와 내부 스키마를 적어야 하고, 데이터베이스 관리자(DBA)는 색인을 고르고 데이터를 저장 장치에 어떻게 놓을지를 조절하고 싶어 한다. DBMS 언어는 DBMS가 데이터베이스를 다스리고 관리하라고 주는 언어다.

| 언어 | 무엇을 적나 | 누가 쓰나 |
|---|---|---|
| 데이터 정의어 (DDL) | 대상 데이터베이스의 외부 스키마와 개념 스키마 | DBA와 데이터베이스 설계자 |
| 저장 정의어 (SDL) | 내부 스키마 | DBA. 색인 선택과 데이터를 저장 장치에 놓는 방법을 조절한다 |
| 뷰 정의어 (VDL) | 사용자 뷰와, 그 뷰를 개념 스키마에 잇는 사상 | — |
| 데이터 조작어 (DML) | 데이터를 찾고, 넣고, 지우고, 고치는 일 | 사용자 |

DDL은 data definition language, SDL은 storage definition language, VDL은 view definition language, DML은 data manipulation language를 줄인 말이다. 예시의 CREATE TABLE이 DDL, CREATE VIEW가 VDL, CREATE INDEX가 SDL, INSERT와 SELECT가 DML의 일을 한다[^s1].

표에서 외부 스키마가 DDL에도 VDL에도 걸려 있다. 세 단계를 엄격히 가른 DBMS에서는 DDL로 개념 스키마만 적고 뷰는 VDL로 적는다. 대부분의 DBMS는 DDL 하나로 개념 스키마와 외부 스키마를 모두 적는다[^s2].


## 데이터 조작어의 두 갈래

DML은 적는 방식에 따라 둘로 나뉜다.

| | 비절차적 DML (고수준) | 절차적 DML (저수준) |
|---|---|---|
| 적는 것 | 어떤 데이터를 원하는가 | 어떻게 찾아오는가. 찾는 단계를 자세히 적는다 |
| 한 문장이 다루는 양 | 한 문장으로 많은 레코드를 정하고 가져온다 | 레코드를 하나씩 가져와 따로따로 처리한다 |
| 예 | SQL | — |

비절차적 DML은 복잡한 연산을 아주 짧게 적는다. 어떻게 찾을지가 아니라 무엇을 찾을지에 집중하므로 선언적(declarative)이라고 부른다.

"Brown이 A를 받은 과목 번호"는 두 방식으로 구할 수 있다[^s3]. 먼저 원하는 것만 적는 방식이다.

```sql
SELECT SE.Course_number
FROM STUDENT S, GRADE_REPORT G, SECTION SE
WHERE S.Name = 'Brown' AND G.Grade = 'A'
  AND S.Student_number = G.Student_number
  AND G.Section_identifier = SE.Section_identifier;
```

다음은 찾는 차례를 적는 방식이다.

```
STUDENT의 레코드를 앞에서부터 하나씩 꺼낸다. Name이 Brown이면 학번을 적어 두고 멈춘다.
GRADE_REPORT의 레코드를 끝까지 하나씩 꺼낸다. 학번이 같고 Grade가 A면 분반 번호를 적어 둔다.
적어 둔 분반 번호마다:
    SECTION의 레코드를 앞에서부터 하나씩 꺼낸다. 분반 번호가 같으면 과목 번호를 내놓고 멈춘다.
```

두 방식의 답은 MATH2410, CS1310, CS3380으로 같다. 둘째 방식은 레코드를 $$2 + 6 + (1 + 2 + 6) = 17$$번 꺼낸다. 첫째 문장에는 어느 표부터 읽을지도, 몇 번 꺼낼지도 없다. 그것은 DBMS가 정한다. 정하는 부품은 [DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)에서 다룬다.

## 인터페이스

DBMS는 언어 말고도 쓰기 쉬운 인터페이스를 여러 가지 준다. 인터페이스마다 겨냥하는 사용자 부류가 다르다.

| 인터페이스 | 어떻게 쓰나 |
|---|---|
| 메뉴 기반 | 시스템이 보여 주는 선택지 목록(메뉴)에서 하나씩 골라 가며 질의를 만든다. 질의 언어의 명령과 문법을 외울 필요가 없다. 웹 클라이언트나 둘러보기에 쓴다 |
| 서식 기반 | 미리 만들어 둔 서식의 칸을 채워 새 데이터를 넣는다. 보통 초보 사용자가 트랜잭션을 쓰는 창구로 설계한다 |
| 그래픽 사용자 인터페이스 (GUI) | 스키마를 그림으로 보여 주고, 사용자가 그 그림을 다뤄 질의를 적는다. 보통 메뉴와 서식을 함께 쓴다 |
| 자연어 | 영어 같은 사람의 말로 적은 요청을 받는다 |
| DBA용 | DBMS를 관리하는 특권 명령을 준다. DBA 직원만 쓸 수 있다. 예: 계정 만들기, 스키마 바꾸기, 데이터베이스의 저장 구조 다시 짜기, 시스템 매개변수 정하기, 계정에 권한 주기 |

## 연결

- 선수: [3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/)(언어가 적는 대상인 세 스키마와 사상), [데이터베이스 사용자](/Hongs_Blog/studies/database-design/database-users/)(누가 어느 언어와 인터페이스를 쓰는가)
- 언어로 적은 문장이 DBMS 안에서 처리되는 길: [DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)
- SQL에서 이 구분이 어떻게 나타나는가: [SQL 한눈에 보기](/Hongs_Blog/studies/database-design/sql-overview/), [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [뷰](/Hongs_Blog/studies/database-design/sql-view/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** DBMS의 네 가지 언어와 각각이 적는 것을 쓰라. DML의 두 갈래는 무엇인가?</summary>

**답:** 데이터 정의어(DDL)는 외부 스키마와 개념 스키마를, 저장 정의어(SDL)는 내부 스키마를, 뷰 정의어(VDL)는 사용자 뷰와 개념 스키마로의 사상을 적는다. 데이터 조작어(DML)는 데이터를 찾고 넣고 지우고 고친다. DML은 무엇을 원하는지 적는 비절차적(고수준, 선언적) DML과 어떻게 찾는지 적는 절차적(저수준) DML로 나뉜다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 다섯 가지 일은 각각 어느 언어의 일인가? (a) STUDENT 표에 Date_of_birth 칸을 만든다 (b) Kim의 행을 넣는다 (c) TRANSCRIPT라는 뷰를 정의한다 (d) SECTION에 학기와 연도로 찾는 색인을 단다 (e) Smith의 성적을 찾는다</summary>

**답:** (a) DDL (b) DML (c) VDL (d) SDL (e) DML.<br>
**이유:** (a), (c), (d)는 데이터베이스가 어떻게 생겼는지를 고친다. 그 가운데 (a)는 표의 틀(개념 스키마), (c)는 사용자에게 보여 줄 모습(외부 스키마), (d)는 저장하고 찾는 방법(내부 스키마)이다. (b)와 (e)는 틀은 그대로 두고 안에 든 데이터를 다룬다.<br>
**흔한 오답:** (b)를 DDL로 답하는 것. 데이터를 "넣는" 일은 정의가 아니라 조작이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위의 SQL 문장 하나는 레코드를 17번 꺼내는 절차와 같은 답을 낸다. SQL 문장에는 무엇이 빠져 있고, 빠진 것은 누가 정하는가? 이런 언어를 왜 선언적이라 부르는가?</summary>

**답:** 어느 표부터 읽을지, 레코드를 어떤 순서로 몇 번 꺼낼지가 빠져 있다. 그것은 DBMS가 정한다. 사용자는 원하는 데이터가 무엇인지만 밝히고(선언하고) 찾는 방법은 말하지 않으므로 선언적이라 부른다.<br>
**이유:** 찾는 방법을 사용자가 적지 않기 때문에, DBMS는 색인이 새로 생기면 같은 문장을 더 빠른 길로 처리할 수 있다. 차례를 적어 둔 절차는 사람이 다시 짜야 한다[^s3].

</details>


[^s1]: 요즘 DBMS에서 네 언어가 따로 떨어져 있지 않고 SQL이 DDL, VDL, DML을 겸한다는 것은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 2.3.1절을 따랐다. 교재는 SDL이 SQL의 초기 판에 있다가 빠졌다고 적는다. 색인을 다는 CREATE INDEX는 제품마다 있지만 표준 SQL에는 없다. 다섯 문장은 SQLite에서 적힌 그대로 실행했다.
[^s2]: 같은 교재 2.3.1절을 따랐다.
[^s3]: 교재는 두 방식을 한 번에 집합 하나(set-at-a-time), 한 번에 레코드 하나(record-at-a-time)라고도 부른다. 두 답이 같은 것과 횟수는 검증 코드로 확인했다. 색인이 생기면 DBMS가 같은 문장을 다른 길로 처리하는 것은 [10_dbms-component-modules_verify.py](/Hongs_Blog/studies/database-design/code/10_dbms-component-modules_verify/)에서 확인했다.
{% endraw %}
