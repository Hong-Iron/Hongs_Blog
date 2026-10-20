---
layout: "note"
title: "DBMS의 기능과 쓰지 않을 때"
display_title: "DBMS의 기능과 쓰지 않을 때 (DBMS Features)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["DBMS Features", "DBMS의 기능", "DBMS의 장점", "중복 통제", "Controlling Redundancy", "중복", "Redundancy", "통제된 중복", "Controlled Redundancy", "불일치", "Inconsistency", "접근 제한", "Restricting Unauthorized Access", "무결성 제약", "Integrity Constraint", "백업과 복구", "Backup and Recovery", "DBMS를 쓰지 않을 때", "When Not to Use a DBMS"]
description: "데이터베이스를 관리하는 프로그램(DBMS)은 장부를 맡아 주는 관리인과 같다. 같은 내용을 여러 군데 적다가 어긋나는 일을 막고, 볼 자격이 없는 사람을 막고, 사람마다 맞는 창구를 내주고, 규칙에 어긋나는 값을 돌려보내고, 사고가 나면 되돌려 준다. 이런 일을 프로그램마다 따로 …"
prev_url: "/studies/database-design/database-users/"
prev_title: "데이터베이스 사용자"
next_url: "/studies/database-design/data-model-categories/"
next_title: "데이터 모델의 종류"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "04_dbms-features_verify.py", "u": "/studies/database-design/code/04_dbms-features_verify/", "r": "검증"}]
permalink: "/studies/database-design/dbms-features/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터베이스를 관리하는 프로그램(DBMS)은 장부를 맡아 주는 관리인과 같다. 같은 내용을 여러 군데 적다가 어긋나는 일을 막고, 볼 자격이 없는 사람을 막고, 사람마다 맞는 창구를 내주고, 규칙에 어긋나는 값을 돌려보내고, 사고가 나면 되돌려 준다. 이런 일을 프로그램마다 따로 짜지 않아도 되는 것이 이득이다. 대신 들이는 돈과 품이 크고 처리가 느려질 수 있어서, 혼자 쓰고 바뀔 일 없는 단순한 프로그램이나 아주 빠듯한 시간 안에 답해야 하는 프로그램은 그냥 파일이 낫다.

</div>


## 예시로 보기

성적표를 뽑을 때마다 학생 이름과 과목 번호를 다른 표에서 찾아오기가 번거롭다. 그래서 GRADE_REPORT에 이름과 과목 번호를 아예 같이 적어 두었다고 하자.

| Student_number | Student_name | Section_identifier | Course_number | Grade |
|---|---|---|---|---|
| 17 | Smith | 112 | MATH2410 | B |
| 17 | Smith | 119 | CS1310 | C |
| 8 | Brown | 85 | MATH2410 | A |
| 8 | Brown | 92 | CS1310 | A |
| 8 | Brown | 102 | CS3320 | B |
| 8 | Brown | 135 | CS3380 | A |

Smith가 2번, Brown이 4번 적혔다. 이름은 STUDENT 표에도 있고 과목 번호는 SECTION 표에도 있다. 이렇게 같은 데이터를 여러 곳에 여러 번 저장하는 것을 중복(redundancy)이라 한다. 문제가 둘 생긴다.

- **저장 공간이 낭비된다.** 칸이 셋이면 값 $$6 \times 3 = 18$$개로 되던 표가 $$6 \times 5 = 30$$개가 되었다.
- **같은 데이터가 서로 어긋날 수 있다.** 누군가 아래 행을 넣으면 17번 학생은 STUDENT에서는 Smith인데 여기서는 Brown이다. 어느 쪽이 맞는지 표만 봐서는 알 수 없다.

| Student_number | Student_name | Section_identifier | Course_number | Grade |
|---|---|---|---|---|
| 17 | Brown | 112 | MATH2410 | B |

그래서 DBMS는 중복을 통제해서 데이터가 어긋나지 않게 막는 능력이 있어야 한다.

그럼 중복은 늘 나쁜가? 그렇지 않다. 이름과 과목 번호가 한 표에 있으면 성적표를 뽑을 때 표 하나만 읽으면 된다. 문제는 중복 자체가 아니라 아무도 지켜보지 않는 중복이다. DBMS가 행을 넣을 때마다 "여기 적힌 (학번, 이름) 짝은 STUDENT에 있는 짝이어야 한다"를 검사하면, 위의 틀린 행은 거부되고 맞는 여섯 행은 그대로 들어간다. 이것을 통제된 중복이라 한다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 여섯 행이 STUDENT·GRADE_REPORT·SECTION을 이은 것과 같음, 값 18개와 30개, 틀린 행이 통제 없이는 들어가고 통제하면 거부되는 것, 읽기 전용 접속, 제약에 어긋난 행의 거부, 백업으로 21행 되돌리기 — [04_dbms-features_verify.py](/Hongs_Blog/studies/database-design/code/04_dbms-features_verify/)</div>

</div>


## 다섯 가지 기능

DBMS가 갖춰야 하는 기능으로 다음 다섯을 꼽는다. 이것이 전부는 아니고, 더 있다.

| 기능 | DBMS가 갖춰야 하는 것 | 까닭과 예 |
|---|---|---|
| 중복 통제 | 중복을 통제해 불일치를 막는 능력 | 통제하지 않으면 공간이 낭비되고 같은 데이터가 어긋난다 |
| 권한 없는 접근 막기 | 보안과 권한을 맡는 서브시스템 | 대부분의 사용자는 데이터베이스의 모든 정보를 볼 자격이 없다. 예: 급여와 보너스는 허락받은 사람만 본다. 할 수 있는 연산의 종류도 통제한다. 어떤 사용자는 찾기만, 어떤 사용자는 찾기와 고치기를 다 한다 |
| 여러 사용자 인터페이스 | 여러 가지 사용자 인터페이스 | 기술 지식의 수준이 저마다 다른 사용자가 데이터베이스를 쓴다. 응용 프로그래머에게는 질의 언어, 초보 사용자와 독립형 사용자에게는 그림 화면(GUI)을 준다 |
| 무결성 제약 지키기 | 제약을 정의하고 지키게 하는 능력 | 아래 문단 |
| 백업과 복구 | 하드웨어나 소프트웨어 고장에서 되살리는 장치 | 고장은 예고 없이 난다. 아래 문단 |

**무결성 제약.** 데이터가 주어진 제약을 만족하는 성질을 무결성(integrity)이라 한다. 가장 단순한 제약은 자료형이다. 카탈로그에 Name은 Character (30), Class는 Integer (1)이라고 적혀 있으면, 이름은 30글자까지의 문자이고 학년은 한 자리 정수여야 한다. 더 복잡한 제약도 자주 나온다. 한 파일의 레코드가 다른 파일의 레코드와 이어져 있어야 한다는 제약이 그 예다. 분반은 있는 과목의 분반이어야 한다는 식이다. 이 제약은 뒤에서 [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)라는 이름으로 다시 나온다.

관리인 비유가 어긋나는 곳이 여기다. 사람 관리인은 눈치껏 이상한 값을 걸러 주지만, DBMS는 적어 준 규칙만 지킨다. 제약을 정의해 두지 않으면 틀린 값도 그대로 받는다.

**백업과 복구.** 백업(backup)은 평소에 DBMS 안에서 데이터베이스의 사본을 만들어 두는 일이다. 복구(recovery)는 고장이 났을 때 백업해 둔 데이터로 데이터베이스를 최신 상태로 되돌리는 일이다.

SQLite에서 해 보면 이렇다[^s3].

| 해 본 일 | 결과 |
|---|---|
| 읽기 전용으로 연 접속에서 성적을 찾는다 | B가 나온다 |
| 같은 접속에서 성적을 고친다 | 거부된다 |
| 31글자 이름, 글자 "two"로 적은 학년, 두 자리 학년 12를 넣는다 | 셋 다 거부된다 |
| 없는 과목 CS9999의 분반을 넣는다 | 거부된다 |
| 성적을 모두 지우고 표 하나를 없앤 뒤 백업 사본으로 되돌린다 | 백업을 뜬 때의 21행이 돌아온다 |

마지막 줄에서 백업을 뜬 뒤에 넣은 행은 돌아오지 않았다. 사본만으로는 사본을 뜬 순간까지만 돌아간다. 그 뒤의 변경까지 되살리려면 변경을 차례로 적어 둔 기록이 더 있어야 한다[^s3].

## DBMS를 쓰지 않을 때

DBMS에는 값이 든다.

- 하드웨어, 소프트웨어, 교육에 드는 큰 초기 투자.
- 보안, 동시성 제어, 백업과 복구, 무결성 기능을 돌리는 데 드는 시간과 품.

그래서 다음 경우에는 보통 파일을 쓰는 편이 낫다.

- 단순하고 잘 정해져 있으며 바뀔 일이 전혀 없는 응용.
- DBMS의 부담 때문에 맞추지 못할 만큼 빠듯한 실시간 요구가 있는 프로그램.
- 여러 사용자가 데이터에 접근하지 않는 경우.

## 연결

- 선수: [데이터베이스와 DBMS](/Hongs_Blog/studies/database-design/database-and-dbms/), [데이터베이스 방식의 네 가지 특징](/Hongs_Blog/studies/database-design/database-approach-characteristics/)
- 인터페이스의 종류: [DBMS 언어와 인터페이스](/Hongs_Blog/studies/database-design/dbms-languages-interfaces/)
- 제약을 정확히 적은 것: [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/), [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)
- 동시성 제어와 복구를 맡는 DBMS 안의 부품: [DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** DBMS의 다섯 가지 기능을 쓰라. DBMS보다 파일이 나은 경우 셋은 무엇인가?</summary>

**답:** 중복 통제, 권한 없는 접근 막기, 여러 사용자 인터페이스 제공, 무결성 제약 지키기, 백업과 복구. 파일이 나은 경우는 ① 단순하고 잘 정해져 있으며 바뀔 일이 없는 응용 ② DBMS의 부담 때문에 못 맞출 만큼 빠듯한 실시간 요구 ③ 여러 사용자가 접근하지 않는 데이터다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 중복이 일으키는 두 문제는 무엇인가? 그런데도 일부러 중복을 두는 까닭은 무엇이고, 그때 DBMS는 무엇을 해 줘야 하는가?</summary>

**답:** 저장 공간이 낭비되고, 같은 데이터가 서로 어긋날 수 있다. 그래도 중복을 두는 것은 찾기가 빨라지기 때문이다. 이름과 과목 번호를 성적표에 같이 적어 두면 표 하나만 읽고 성적표를 뽑는다. 이때 DBMS는 넣거나 고칠 때마다 중복된 값이 원래 값과 같은지 검사해 어긋난 행을 거부해야 한다.<br>
**이유:** (17, Brown, 112, MATH2410, B)는 통제가 없으면 그대로 들어가 17번 학생의 이름이 둘이 된다. "(학번, 이름) 짝은 STUDENT에 있는 짝이어야 한다"를 걸어 두면 거부된다[^s2].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 셋에 DBMS와 파일 가운데 무엇이 알맞은가? (a) 한 사람이 쓰고 형식이 바뀔 일 없는 프로그램의 설정값 (b) 지점 300곳이 동시에 찾고 고치는 계좌 (c) 몇 밀리초 안에 반응해야 하는 기계 제어 프로그램이 쓰는 측정값</summary>

**답:** (a) 파일 (b) DBMS (c) 파일.<br>
**이유:** (a)는 단순하고 바뀌지 않으며 여러 사용자가 접근하지 않는다. (b)는 여럿이 동시에 쓰므로 동시성 제어가 필요하고, 고장이 나도 돈이 사라지면 안 되므로 복구가 필요하고, 남의 계좌를 못 보게 막아야 한다. (c)는 DBMS가 권한과 제약을 검사하고 기록을 남기는 데 드는 시간 때문에 시간 요구를 못 맞출 수 있다.

</details>


[^s2]: 답과 "통제된 중복"이라는 말은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 1.6.1절을 따랐다. 교재는 조회를 빠르게 하려고 일부러 중복을 두는 경우를 들고, DBMS가 GRADE_REPORT의 이름과 학번 짝이 STUDENT의 짝과 맞는지 자동으로 검사하면 된다고 적는다. 검증 코드에서 이 검사를 걸어 틀린 행이 거부되는 것을 확인했다.
[^s3]: SQLite에는 사용자 계정이 없어서 권한은 "읽기 전용으로 연 접속"으로 흉내 냈다. SQLite는 Character (30), Integer (1) 같은 자료형 이름을 적어만 두고 검사하지 않으므로 같은 뜻의 검사 조건을 따로 적어 확인했다(검사 조건 없이는 31글자 이름과 "two"가 들어간다). 사본만으로는 사본을 뜬 때까지만 돌아간다는 것도 같은 코드로 확인했다. 변경 기록이 더 필요하다는 설명은 같은 교재의 복구 기법 장을 따랐다.
{% endraw %}
