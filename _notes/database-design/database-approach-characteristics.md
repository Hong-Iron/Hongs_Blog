---
layout: "note"
title: "데이터베이스 방식의 네 가지 특징"
display_title: "데이터베이스 방식의 네 가지 특징 (Characteristics of the Database Approach)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Characteristics of the Database Approach", "데이터베이스의 특징", "자기 기술", "Self-describing Nature", "메타데이터", "Meta-data", "카탈로그", "DBMS Catalog", "프로그램-데이터 독립성", "Program-data Independence", "데이터 추상화", "Data Abstraction", "여러 뷰", "Multiple Views", "뷰", "View", "다중 사용자 트랜잭션 처리", "Multiuser Transaction Processing", "동시성 제어", "Concurrency Control"]
description: "예전에는 프로그램마다 자기 파일을 따로 들고, 그 파일이 어떻게 생겼는지를 프로그램 코드 안에 적어 두었다. 데이터베이스 방식은 자료 곁에 \"이 자료는 이렇게 생겼다\"는 설명서를 함께 넣어 두고, 프로그램이 그 설명서를 거쳐 자료를 찾게 한다. 그래서 저장 모양이 바뀌어도 프로그램…"
prev_url: "/studies/database-design/database-and-dbms/"
prev_title: "데이터베이스와 DBMS"
next_url: "/studies/database-design/database-users/"
next_title: "데이터베이스 사용자"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/database-approach-characteristics/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

예전에는 프로그램마다 자기 파일을 따로 들고, 그 파일이 어떻게 생겼는지를 프로그램 코드 안에 적어 두었다. 데이터베이스 방식은 자료 곁에 "이 자료는 이렇게 생겼다"는 설명서를 함께 넣어 두고, 프로그램이 그 설명서를 거쳐 자료를 찾게 한다. 그래서 저장 모양이 바뀌어도 프로그램을 안 고치고, 같은 자료를 사람마다 필요한 모양으로 보여 주고, 여럿이 동시에 써도 엉키지 않게 막을 수 있다. 다만 이 이득은 프로그램이 파일을 직접 열지 않고, 자료를 맡아 관리하는 프로그램을 반드시 거칠 때만 생긴다.

</div>


## 예시로 보기

프로그램이 파일의 생김새를 코드 안에 품고 있으면, 파일을 조금만 바꿔도 프로그램이 틀린 값을 읽는다.

학생 한 명의 기록이 파일에 39글자로 적혀 있다고 하자. 어느 글자부터 어느 글자까지가 무엇인지는 이 자리표가 정한다[^1].

| 항목 | 레코드 안에서 시작하는 자리 | 길이(글자) |
|---|---|---|
| Name | 1 | 30 |
| Student_number | 31 | 4 |
| Class | 35 | 1 |
| Major | 36 | 4 |

시작하는 자리는 앞 칸들의 길이를 더한 다음 자리다. Student_number는 $$30 + 1 = 31$$번째, Major는 $$30 + 4 + 1 + 1 = 36$$번째에서 시작한다. 전체 길이는 $$30 + 4 + 1 + 4 = 39$$글자다.

어떤 프로그램이 이 자리 번호를 코드에 그대로 적어 두었다. "39글자씩 끊고, 31번째부터 4글자를 학번으로 읽어라." 학생이 Smith와 Brown 둘일 때는 잘 돈다. 그런데 레코드 끝에 생일 8글자를 덧붙였더니 이렇게 읽는다[^s1].

| 읽은 순서 | 이름 | 학번 | 학년 | 전공 |
|---|---|---|---|---|
| 1 | Smith | 17 | 1 | CS |
| 2 | `20050314Brown` | (빈칸) | (빈칸) | `8` |
| 3 | `2CS  20040927` | (빈칸) | (빈칸) | (빈칸) |

학생은 둘인데 셋으로 읽었고, 둘째 줄부터는 엉뚱한 값이다. 레코드는 47글자가 되었는데 프로그램은 여전히 39글자씩 끊기 때문이다. 이 파일을 읽는 프로그램이 열 개면 열 개를 모두 고쳐야 한다.

자리표를 프로그램 밖에 두고, 프로그램이 읽을 때마다 자리표부터 보게 하면 어떨까? 자리표에 생일 한 줄만 더하면 프로그램은 한 글자도 안 고쳐도 Smith와 Brown을 맞게 읽는다. 데이터베이스 방식이 하는 일이 이것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 자리표의 1, 31, 35, 36과 39글자, 생일을 붙인 뒤 위 표처럼 틀리게 읽는 것, 카탈로그에서 꺼낸 표 다섯 개의 칸 수, TRANSCRIPT 6줄과 COURSE_PREREQUISITES 3줄, 두 창구의 예약, 과목 이름의 길이 — [02_database-approach-characteristics_verify.py](/Hongs_Blog/studies/database-design/code/02_database-approach-characteristics_verify/)</div>

</div>


## 네 가지 특징

| 특징 | 한마디로 | 슬라이드의 예 |
|---|---|---|
| 자기 기술 | 데이터베이스가 자기 구조에 대한 설명을 함께 품는다 | 카탈로그 |
| 프로그램과 데이터의 분리, 데이터 추상화 | 저장 구조가 바뀌어도 프로그램은 그대로다. 저장 세부는 가려 둔다 | STUDENT 레코드의 자리표 |
| 여러 뷰 | 같은 데이터를 사용자마다 다른 모습으로 보여 준다 | TRANSCRIPT |
| 공유와 다중 사용자 트랜잭션 처리 | 여럿이 동시에 써도 엉키지 않는다 | 항공 예약 |

슬라이드는 이 넷을 순서대로 든다[^2].

### 자기 기술

데이터베이스 시스템에는 데이터만 있지 않다. 데이터베이스의 구조와 제약을 적은 정의가 함께 들어 있다. 이 정의를 메타데이터라 하고, 메타데이터를 모아 둔 곳을 카탈로그(catalog)라 한다[^3]. 자기 기술(self-describing)은 "스스로를 설명한다"는 뜻이다.

대학 데이터베이스의 카탈로그는 표 두 개로 그려져 있다[^3]. 하나는 어떤 표가 있는지 적는다.

| Relation_name | No_of_columns |
|---|---|
| STUDENT | 4 |
| COURSE | 4 |
| SECTION | 5 |
| GRADE_REPORT | 3 |
| PREREQUISITE | 2 |

다른 하나는 칸마다 이름, 자료형, 어느 표의 칸인지를 적는다. 가운데 줄들은 슬라이드에서 점으로 줄여져 있다.

| Column_name | Data_type | Belongs_to_relation |
|---|---|---|
| Name | Character (30) | STUDENT |
| Student_number | Character (4) | STUDENT |
| Class | Integer (1) | STUDENT |
| Major | Major_type | STUDENT |
| Course_name | Character (10) | COURSE |
| Course_number | XXXXNNNN | COURSE |
| … | … | … |
| Prerequisite_number | XXXXNNNN | PREREQUISITE |

카탈로그는 DBMS가 스스로 채우고, 데이터와 같은 방법으로 읽을 수 있다. SQLite에 표 다섯 개를 정의한 뒤 카탈로그에 물으면 위의 두 표가 그대로 나온다[^s2].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.8 카탈로그의 "Course_name \| Character (10)" / 문제점: p.5의 과목 이름 네 개 가운데 Intro to Computer Science(25글자), Data Structures(15글자), Discrete Mathematics(20글자)는 10글자에 들어가지 않는다. 들어가는 것은 Database(8글자)뿐이다. / 수정안: 길이를 25 이상으로 잡아야 p.5의 표와 맞는다. / 근거: 검증 코드로 네 이름의 길이를 셌다. 교재의 그림을 그대로 옮긴 쪽이라 교재 그림에서 온 것으로 보인다. 교재는 XXXXNNNN을 "글자 넷 뒤에 숫자 넷"으로 풀이하는데, 과목 번호 CS1310, CS3320, CS3380도 글자가 둘뿐이라 이 꼴과 어긋난다[^s2].

</div>


### 프로그램과 데이터의 분리, 데이터 추상화

데이터의 구조가 바뀌어도 프로그램에 영향이 없다. 이 성질을 프로그램-데이터 독립성(program-data independence)이라 한다. 슬라이드는 이것이 자기 기술 덕분이라고 적는다[^1]. 예시의 자리표가 프로그램 안이 아니라 카탈로그에 있기 때문이다.

DBMS는 사용자에게 데이터를 "무엇이 있고, 어떤 속성을 가지며, 서로 어떻게 이어지는가"로만 보여 준다. 어떻게 저장되는지와 연산이 어떻게 구현되는지는 보여 주지 않는다. 대부분의 사용자에게는 쓸모없는 세부이기 때문이다. 이렇게 세부를 가리고 뼈대만 드러내는 일이 데이터 추상화(data abstraction)다[^1]. 위의 자리표는 가려지는 쪽, 곧 저장 형식의 한 예다.

세 단계로 가려 주는 구조는 [3단계 스키마 구조](/Hongs_Blog/studies/database-design/three-schema-architecture/)에서, 그 덕에 생기는 성질은 [데이터 독립성](/Hongs_Blog/studies/database-design/data-independence/)에서 다룬다.

### 여러 뷰

사용자마다 데이터베이스에서 보고 싶은 모습이 다르다. 저장된 데이터에서 뽑아내 보여 주지만 따로 저장해 두지는 않는 가상의 데이터를 뷰(view)라 한다. 사용자는 보고 있는 것이 저장된 것인지 뽑아낸 것인지 몰라도 된다[^4].

성적표를 뽑는 사람이 보는 TRANSCRIPT 뷰는 이렇다[^4].

| Student_name | Course_number | Grade | Semester | Year | Section_id |
|---|---|---|---|---|---|
| Smith | CS1310 | C | Fall | 08 | 119 |
| Smith | MATH2410 | B | Fall | 08 | 112 |
| Brown | MATH2410 | A | Fall | 07 | 85 |
| Brown | CS1310 | A | Fall | 07 | 92 |
| Brown | CS3320 | B | Spring | 08 | 102 |
| Brown | CS3380 | A | Fall | 08 | 135 |

저장된 다섯 표 어디에도 이런 표는 없다. STUDENT의 이름, GRADE_REPORT의 성적, SECTION의 학기와 과목 번호를 이어 붙여 그때그때 만든 것이다. 그래서 GRADE_REPORT에 한 줄을 넣으면 TRANSCRIPT에도 바로 한 줄이 늘어난다[^s2]. 슬라이드에는 과목 이름 옆에 선수 과목을 모아 보여 주는 COURSE_PREREQUISITES 뷰도 있다. Database(CS3380)에는 CS3320과 MATH2410이, Data Structures(CS3320)에는 CS1310이 붙는다[^4].

뷰를 만들고 쓰는 법은 [뷰](/Hongs_Blog/studies/database-design/sql-view/)에서 다룬다.

### 공유와 다중 사용자 트랜잭션 처리

데이터베이스는 여러 사용자가 같은 순간에 쓸 수 있어야 한다. 여러 응용 프로그램의 데이터를 데이터베이스 하나에 모아 관리하려면 꼭 필요하다. 그러려면 동시에 들어온 요청이 서로를 망가뜨리지 않게 하는 동시성 제어(concurrency control) 소프트웨어가 있어야 한다. 슬라이드는 항공 예약 시스템을 예로 든다[^5].

예약 한 건처럼 데이터베이스를 읽고 고치는 한 묶음의 일을 트랜잭션(transaction)이라 한다[^s3]. 자리가 하나 남은 비행기를 두 창구가 동시에 예약한다고 하자. 두 창구가 각자 "남은 자리 1"을 읽고 각자 예약을 적으면 한 자리에 두 명이 예약된다. 읽기부터 적기까지를 한 묶음으로 처리하게 하면, 둘째 창구는 첫째가 끝날 때까지 막혔다가 "남은 자리 0"을 읽고 예약하지 못한다[^s3].

## 연결

- 선수: [데이터베이스와 DBMS](/Hongs_Blog/studies/database-design/database-and-dbms/), [데이터와 메타데이터](/Hongs_Blog/studies/data-and-information/data-metadata/)(0과 1의 줄을 어떻게 읽을지 알려 주는 설명)
- 프로그램-데이터 독립성을 단계별로 나눠 말한 것: [데이터 독립성](/Hongs_Blog/studies/database-design/data-independence/)
- 카탈로그를 채우고 읽는 DBMS 안의 부품: [DBMS 구성 모듈](/Hongs_Blog/studies/database-design/dbms-component-modules/)
- 두 창구가 같은 값을 읽고 고칠 때 생기는 문제: [경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 데이터베이스 방식의 네 가지 특징을 한 문장씩 말하라.</summary>

**답:** ① 자기 기술: 데이터베이스 시스템이 데이터뿐 아니라 구조와 제약을 적은 메타데이터를 카탈로그에 함께 가진다. ② 프로그램과 데이터의 분리, 데이터 추상화: 데이터 구조가 바뀌어도 프로그램은 그대로이고, 저장과 구현의 세부는 사용자에게 가려진다. ③ 여러 뷰: 사용자마다 필요한 모습을 저장된 데이터에서 뽑아 보여 준다. ④ 공유와 다중 사용자 트랜잭션 처리: 여러 사용자가 동시에 쓰고, 동시성 제어가 엉키지 않게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 39글자짜리 학생 레코드 끝에 생일 8글자를 붙였다. 자리 번호를 코드에 적어 둔 프로그램은 왜 둘째 학생부터 틀리게 읽는가? DBMS에 "이름과 학번을 달라"고 묻는 프로그램은 왜 안 고쳐도 되는가?</summary>

**답:** 레코드가 47글자가 되었는데 프로그램은 39글자씩 끊는다. 그래서 둘째 덩어리는 첫 학생의 생일 8글자로 시작하고, 이름 자리에 "20050314Brown"이 들어온다. DBMS에 묻는 프로그램은 자리 번호를 모른다. 이름으로 물으면 DBMS가 그때마다 카탈로그에서 새 구조를 읽고 찾아 준다.<br>
**이유:** 바뀐 것은 구조에 대한 설명 하나다. 그 설명이 프로그램마다 흩어져 있으면 프로그램을 모두 고쳐야 하고, 카탈로그 한곳에 있으면 그곳만 바뀌면 된다. 자기 기술이 프로그램-데이터 독립성을 가능하게 한다는 말이 이 뜻이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** [데이터베이스와 DBMS](/Hongs_Blog/studies/database-design/database-and-dbms/)의 세 표(STUDENT, GRADE_REPORT, SECTION)에서 TRANSCRIPT 뷰의 Smith 두 줄을 직접 만들어 보라.</summary>

**답:** (Smith, CS1310, C, Fall, 08, 119)와 (Smith, MATH2410, B, Fall, 08, 112).<br>
**이유:** Smith의 학번은 17이다. GRADE_REPORT에서 학번 17인 줄은 (112, B)와 (119, C)다. SECTION에서 112는 MATH2410, Fall, 08이고 119는 CS1310, Fall, 08이다. 뷰의 한 줄은 세 표의 줄을 하나씩 이어 붙인 것이다.

</details>


[^1]: 데이터베이스 설계 2회 강의 자료 「2-1_DB-users」, p.9 (Insulation between Programs and Data, and Data Abstraction, "Thanks to the self-describing nature!", STUDENT 레코드의 내부 저장 형식 표)
[^2]: 데이터베이스 설계 2회 강의 자료 「2-1_DB-users」, p.7 (네 가지 특징의 목록. p.26의 요약에 다시 나온다)
[^3]: 데이터베이스 설계 2회 강의 자료 「2-1_DB-users」, p.8 (Self-describing Nature, Meta-data의 정의, 카탈로그 예: RELATIONS와 COLUMNS)
[^4]: 데이터베이스 설계 2회 강의 자료 「2-1_DB-users」, p.10 (Support of Multiple Views, TRANSCRIPT와 COURSE_PREREQUISITES 그림)
[^5]: 데이터베이스 설계 2회 강의 자료 「2-1_DB-users」, p.11 (Sharing of Data and Multiuser Transaction Processing, Concurrency control, 항공 예약)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 자리 번호를 코드에 적어 둔 프로그램, 생일 8글자를 붙이는 장면과 잘못 읽은 결과 표는 슬라이드에 없다. 슬라이드의 "구조가 바뀌어도 프로그램은 그대로"를 눈으로 보이려고 만들었다. 생일 값 20050314와 20040927은 지어낸 값이다. 같은 예(STUDENT에 생일을 더하면 파일 프로그램은 고쳐야 한다)가 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 1.3.2절에 있다. 결과는 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> SQLite로 카탈로그를 읽어 본 것, 바탕 표에 줄을 넣으면 뷰에도 보인다는 확인은 슬라이드에 없다. SQLite는 자료형 이름을 적은 그대로 카탈로그에 넣어 주므로 슬라이드의 Character (30), Major_type, XXXXNNNN을 그대로 적어 확인했다. 점선으로 생략된 칸의 자료형은 확인용으로 정했다. XXXXNNNN의 풀이는 같은 교재 그림 1.3의 주석을 따랐다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 트랜잭션의 풀이와 두 창구의 예는 슬라이드에 없다. 슬라이드에는 "동시성 제어가 필요하다, 예: 항공 예약"만 있다. 같은 교재 1.3.4절의 예(여러 예약 직원이 한 좌석을 잡으려 할 때)를 수로 옮겼고, 항공편 이름 KE001과 남은 자리 1은 지어낸 값이다. 통제 없이 2명이 예약되고, 한 묶음으로 처리하면 1명만 예약되는 것을 검증 코드로 확인했다.
{% endraw %}
