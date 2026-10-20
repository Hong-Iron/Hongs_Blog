---
layout: "note"
title: "릴레이션의 특성"
display_title: "릴레이션의 특성 (Characteristics of Relations)"
kind: "concept"
kind_label: "정의"
num: "33"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Characteristics of Relations", "튜플의 순서", "Ordering of Tuples", "속성의 순서", "원자값", "Atomic Value", "NULL", "널", "평면 관계형 모델", "Flat Relational Model"]
description: "관계형 모델의 표는 줄의 모음이라, 줄을 어떤 순서로 적어도 같은 표다. 칸도 이름과 값의 짝만 맞으면 순서를 바꿔도 된다. 한 칸에는 더 쪼갤 수 없는 값 하나만 들어가므로, 여러 값을 넣고 싶으면 표를 하나 더 만들어야 한다. 값을 모르거나 그 줄에는 맞지 않는 칸에는 '값 없…"
prev_url: "/studies/database-design/relational-model-relation/"
prev_title: "릴레이션과 도메인·속성·튜플"
next_url: "/studies/database-design/relational-keys/"
next_title: "슈퍼키·후보 키·기본 키"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "33_relation-characteristics_verify.py", "u": "/studies/database-design/code/33_relation-characteristics_verify/", "r": "검증"}]
permalink: "/studies/database-design/relation-characteristics/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

관계형 모델의 표는 줄의 모음이라, 줄을 어떤 순서로 적어도 같은 표다. 칸도 이름과 값의 짝만 맞으면 순서를 바꿔도 된다. 한 칸에는 더 쪼갤 수 없는 값 하나만 들어가므로, 여러 값을 넣고 싶으면 표를 하나 더 만들어야 한다. 값을 모르거나 그 줄에는 맞지 않는 칸에는 '값 없음' 표시를 해 둔다.

</div>


## 예시로 보기

엑셀 표에서는 "세 번째 줄"이라는 말이 통한다. 릴레이션에서는 통하지 않는다. 같은 학생 다섯 명을 두 가지 순서로 적은 표가 있다.

| 순서 1 | 순서 2 |
|---|---|
| Bayer, Kim, Davidson, Panchal, Benson | Davidson, Benson, Panchal, Kim, Bayer |

두 표는 같은 릴레이션이다. 어느 순서가 더 맞는 것도 아니다. 릴레이션은 튜플의 집합이고, 집합의 원소에는 순서가 없기 때문이다. 디스크에는 어떤 순서로든 저장되고 화면에도 위에서 아래로 그려지지만, 그 순서는 릴레이션의 정의에 들어 있지 않다.

칸의 순서는 어떨까? Davidson의 튜플을 "속성 이름과 값의 짝"으로 두 번 적는다.

- ⟨(Name, Dick Davidson), (Ssn, 422-11-2320), (Home_phone, NULL), (Address, 3452 Elgin Road), (Office_phone, (817)749-1253), (Age, 25), (Gpa, 3.53)⟩
- ⟨(Address, 3452 Elgin Road), (Name, Dick Davidson), (Ssn, 422-11-2320), (Age, 25), (Office_phone, (817)749-1253), (Gpa, 3.53), (Home_phone, NULL)⟩

짝의 순서만 다르고 짝은 같다. 그래서 같은 튜플이다. 반대로 값만 자리를 바꿔 Age 칸에 3.53을, Gpa 칸에 25를 넣으면 짝이 달라져 다른 튜플이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 순서가 집합으로 같음, 짝의 순서를 바꿔도 같은 튜플이고 짝이 어긋나면 다른 튜플, 부서 위치 5행, NULL 4개와 `= NULL` 0행·`IS NULL` 3행, 키가 없는 SQL 표에 같은 행 두 번 — [33_relation-characteristics_verify.py](/Hongs_Blog/studies/database-design/code/33_relation-characteristics_verify/)</div>

</div>


## 네 가지 특성

**1. 튜플에는 순서가 없다.** 릴레이션은 튜플의 집합으로 정의한다. 그래서 튜플을 늘어놓는 순서는 릴레이션의 일부가 아니다.

**2. 속성의 순서는 짝만 맞으면 중요하지 않다.** 튜플은 정의로는 값 $$n$$개를 순서대로 늘어놓은 목록이다. 그래도 어느 값이 어느 속성의 것인지만 지켜지면 속성을 적는 순서는 그리 중요하지 않다.

**3. 값은 더 쪼갤 수 없는 값 하나다.** 이런 값을 원자값이라 부른다. 그래서 여러 부분으로 된 속성(복합 속성)과 값이 여럿인 속성(다치 속성)은 그대로는 들어가지 못한다.

- 복합 속성은 가장 작은 성분만 속성으로 둔다. 이름 Name(Fname, Minit, Lname)은 Fname, Minit, Lname 세 속성이 된다.
- 다치 속성은 릴레이션을 따로 만든다. 5번 부서의 위치는 Bellaire, Sugarland, Houston 세 곳이다. 이 셋을 한 칸에 넣지 않고, DEPT_LOCATIONS(Dnumber, Dlocation)에 (5, Bellaire), (5, Sugarland), (5, Houston) 세 줄로 적는다: [다치 속성의 사상](/Hongs_Blog/studies/database-design/mapping-multivalued-attributes/)

칸마다 값이 하나뿐인 납작한 표만 쓴다는 뜻에서 이 모델을 평면 관계형 모델(flat relational model)이라 부른다.

**4. 값이 없으면 NULL을 쓴다.** NULL은 그 튜플에서 값을 모르거나 그 속성이 그 튜플에 맞지 않을 때 쓴다. 뜻이 여럿이다: 모른다(unknown), 있지만 얻을 수 없다(unavailable), 정해지지 않았다(undefined). STUDENT 표에는 NULL이 네 칸 있다. Davidson의 Home_phone 한 칸과 Bayer, Kim, Benson의 Office_phone 세 칸이다. 학생에게는 사무실이 없을 수 있으니 Office_phone의 NULL은 "맞지 않는다"로, Home_phone의 NULL은 "모른다"로 읽을 수 있다. 표만 보고는 어느 뜻인지 가를 수 없다[^s2].

## 활용

- **NULL은 값이 아니다.** SQL에서 `Office_phone = NULL`로 찾으면 한 줄도 안 나온다. NULL끼리 견주어도 참이 되지 않기 때문이다. `Office_phone IS NULL`로 찾아야 세 줄이 나온다: [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)[^s3]
- **SQL의 표는 릴레이션과 조금 다르다.** 키를 정하지 않은 SQL 표는 똑같은 줄을 두 번 받는다. 집합이 아니라 같은 원소를 여러 번 담는 모음이다: [다중집합인 표와 DISTINCT](/Hongs_Blog/studies/database-design/sql-multiset-distinct/)[^s3]
- **흔한 실수.** "취미" 칸에 `독서, 등산`처럼 쉼표로 이어 적는 것. 원자값이 아니라서 "등산이 취미인 사람"을 찾으려면 글자를 쪼개야 한다. 표를 따로 만든다.

## 연결

- 선수: [릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/), [속성의 종류](/Hongs_Blog/studies/database-design/er-attribute-types/)(복합 속성, 다치 속성)
- 순서가 없는 까닭: [집합](/Hongs_Blog/studies/discrete-math/sets/)
- 복합·다치 속성을 릴레이션으로 옮기기: [개체 타입의 사상](/Hongs_Blog/studies/database-design/mapping-entity-types/), [다치 속성의 사상](/Hongs_Blog/studies/database-design/mapping-multivalued-attributes/)
- NULL이 올 수 없는 자리: [개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** STUDENT 표를 세 가지로 바꿨다. 원래와 같은 릴레이션인 것은? (가) 줄의 순서를 거꾸로 뒤집었다. (나) Age 칸과 Gpa 칸을 이름과 값을 함께 맞바꿔 적었다. (다) 칸의 이름은 그대로 두고 Davidson의 줄에서 값 25와 3.53만 자리를 바꿨다.</summary>

**답:** (가)와 (나)는 같다. (다)는 다르다.<br>
**이유:** (가) 튜플에는 순서가 없다. (나) 속성과 값의 짝이 그대로다. (다) (Age, 3.53), (Gpa, 25)라는 다른 짝이 되어 다른 튜플이다. Gpa의 도메인(0과 4 사이)에도 맞지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 5번 부서의 위치 세 곳을 DEPARTMENT의 한 칸에 적지 않는 까닭은 무엇인가? 그러면 어떻게 적는가? COMPANY 상태에서 그 릴레이션은 몇 줄인가?</summary>

**답:** 릴레이션의 값은 더 쪼갤 수 없는 값 하나여야 한다. 세 곳을 한 칸에 넣으면 원자값이 아니다. DEPT_LOCATIONS(Dnumber, Dlocation)를 따로 만들어 위치마다 한 줄씩 적는다. 1번 부서 1곳, 4번 부서 1곳, 5번 부서 3곳이라 모두 5줄이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** STUDENT 표에서 `Office_phone = NULL`인 줄과 `Office_phone IS NULL`인 줄은 각각 몇 줄 나오는가? 왜 다른가?</summary>

**답:** 0줄과 3줄. NULL은 값이 아니라 "값 없음" 표시라서 무엇과 견주어도, NULL끼리 견주어도 참이 되지 않는다. NULL인지 묻는 말은 `IS NULL`로 따로 있다.

</details>


[^s2]: Elmasri & Navathe, *Fundamentals of Database Systems* 7판 5.1절이 같은 표를 이렇게 설명한다 [확인필요: 판과 절 번호].
[^s3]: 링크한 두 문서가 다루는 내용이고 SQLite로 실행해 확인했다.
{% endraw %}
