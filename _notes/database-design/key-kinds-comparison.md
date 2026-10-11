---
layout: "note"
title: "키의 종류 비교"
display_title: "키의 종류 비교"
kind: "concept"
kind_label: "비교"
num: "38"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Superkey vs Candidate Key vs Primary Key vs Foreign Key", "슈퍼키와 후보 키와 기본 키와 외래 키", "키 비교"]
description: "이름에 '키'가 붙은 말이 넷이다. 슈퍼키, 후보 키, 기본 키는 자기 릴레이션의 튜플을 가려내는 값이다. 외래 키는 남의 릴레이션의 튜플을 가리키는 값이다. 가르는 질문은 둘이다. \"값이 겹쳐도 되는가?\" 그리고 \"NULL이어도 되는가?\""
prev_url: "/studies/database-design/referential-integrity-foreign-key/"
prev_title: "참조 무결성 제약과 외래 키"
next_url: "/studies/database-design/mapping-entity-types/"
next_title: "개체 타입의 사상"
math: false
mermaid: false
code_count: 0
permalink: "/studies/database-design/key-kinds-comparison/"
---
{% raw %}
이름에 '키'가 붙은 말이 넷이다. 슈퍼키, 후보 키, 기본 키는 자기 릴레이션의 튜플을 가려내는 값이다. 외래 키는 남의 릴레이션의 튜플을 가리키는 값이다. 가르는 질문은 둘이다. "값이 겹쳐도 되는가?" 그리고 "NULL이어도 되는가?"

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 속성(묶음)은 슈퍼키, 후보 키, 기본 키, 외래 키 가운데 무엇인가? 여럿일 수 있다. (가) STUDENT의 {Ssn, Name} (나) CAR의 Engine_serial_number (다) EMPLOYEE의 Dno (라) WORKS_ON의 Essn</summary>

**답:** (가) 슈퍼키. Name을 빼도 값이 안 겹쳐서 후보 키는 아니다. (나) 후보 키이자 슈퍼키. 슬라이드는 License_number를 기본 키로 골랐으므로 기본 키는 아니다. (다) 외래 키. Dno 5가 네 번 나오므로 어떤 키도 아니다. (라) 외래 키이면서 기본 키 (Essn, Pno)의 한 부분이다. 혼자서는 값이 겹쳐서 키가 아니다.<br>
**이유:** (라)가 가장 헷갈린다. "기본 키에 들어 있다"와 "혼자서 키다"는 다른 말이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 규칙은 네 가지 키 가운데 어느 것에 걸리는가? (가) 값이 NULL이면 안 된다. (나) 서로 다른 두 튜플의 값이 같으면 안 된다. (다) 값이 다른 릴레이션에 실제로 있어야 한다. (라) 속성을 하나라도 빼면 값이 겹칠 수 있어야 한다.</summary>

**답:** (가) 기본 키([개체 무결성 제약](/Hongs_Blog/studies/database-design/entity-integrity-constraint/)). (나) 슈퍼키, 후보 키, 기본 키(키 제약). (다) 외래 키([참조 무결성 제약](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)). 단 NULL이면 이 규칙을 받지 않는다. (라) 후보 키와 기본 키(최소성).

</details>


## 결정적 차이

| | 슈퍼키 | 후보 키 | 기본 키 | 외래 키 |
|---|---|---|---|---|
| 하는 일 | 자기 릴레이션의 튜플을 가려낸다 | 같다 | 같다. 대표로 쓴다 | 다른(또는 같은) 릴레이션의 튜플을 가리킨다 |
| 값이 겹쳐도 되나 | 안 된다 | 안 된다 | 안 된다 | 된다 (Dno 5가 네 번) |
| 군더더기 속성이 있어도 되나 | 된다 | 안 된다 | 안 된다 | 상관없다 |
| NULL이어도 되나 | 따로 정한 규칙이 없다 | 따로 정한 규칙이 없다 | 안 된다 | 된다 (Borg의 Super_ssn) |
| 릴레이션에 몇 개 | 여럿. 속성 전부를 모은 것은 늘 슈퍼키다 | 하나 이상 (CAR는 둘) | 하나 | 없거나 여럿 (EMPLOYEE는 둘) |
| 누가 정하나 | 실세계의 규칙 | 실세계의 규칙 | 설계자가 후보 키에서 고른다 | 설계자가 두 릴레이션을 잇는다 |
| 걸리는 제약 | 키 제약 | 키 제약 | 키 제약 + 개체 무결성 | 참조 무결성 |
| 그림에서 | — | — | 밑줄 | 기본 키로 가는 화살표 |

표는 슬라이드의 정의를 모은 것이다[^1]. 앞의 셋은 포개지는 사이다. 기본 키는 후보 키이고 후보 키는 슈퍼키다. 외래 키는 이 줄에 끼지 않는다. 외래 키가 자기 릴레이션의 키인지는 경우마다 다르다. Dno는 아니고, DEPT_LOCATIONS의 Dnumber는 기본 키의 한 부분이다[^s1].

선택을 가르는 줄은 "값이 겹쳐도 되나"와 "NULL이어도 되나"다. 둘 다 "된다"인 것은 외래 키뿐이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슈퍼키와 후보 키의 개수, {Ssn, Name}이 최소가 아님 — [34_relational-keys_verify.py](/Hongs_Blog/studies/database-design/code/34_relational-keys_verify/). 외래 키 값이 겹치고 NULL일 수 있음 — [37_referential-integrity-foreign-key_verify.py](/Hongs_Blog/studies/database-design/code/37_referential-integrity-foreign-key_verify/). 부분 키가 혼자서는 겹침 — [39_mapping-entity-types_verify.py](/Hongs_Blog/studies/database-design/code/39_mapping-entity-types_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이 과목에는 위의 네 가지 말고도 '키'가 붙은 말이 셋 더 나온다. ER 모델의 키 속성, 약한 개체 타입의 부분 키, B-트리의 키다. 각각 위의 넷과 어떻게 다른가?</summary>

**답:** ① 키 속성은 ER 그림에서 개체마다 값이 다른 속성이다[^2]. 릴레이션으로 옮기면 그 가운데 하나가 기본 키가 된다([키 속성](/Hongs_Blog/studies/database-design/key-attribute/)). ② 부분 키는 같은 주인에게 딸린 약한 개체들 사이에서만 값이 다르다[^3]. 혼자서는 릴레이션의 어떤 키도 아니다. DEPENDENT의 Dependent_name은 'Alice'가 두 직원에게 나온다. 주인의 기본 키 Essn과 묶어야 기본 키가 된다([약한 개체 타입](/Hongs_Blog/studies/database-design/weak-entity-type/)). ③ B-트리의 키는 노드에 넣어 두고 찾는 값이다. 튜플을 가려낸다는 뜻이 아니다([B-트리](/Hongs_Blog/studies/database-design/b-tree/)).<br>
**이유:** 같은 낱말이 "값이 안 겹친다"(릴레이션의 키, ER의 키 속성), "일부에서만 안 겹친다"(부분 키), "찾는 기준 값"(B-트리)의 세 가지 뜻으로 쓰인다.

</details>


[^1]: 데이터베이스 설계 6회 강의 자료 「6-2_relational-model」, p.17~19 (슈퍼키, 후보 키, 기본 키), p.22 (기본 키는 NULL일 수 없다), p.24 (외래 키)
[^2]: 데이터베이스 설계 4회 강의 자료 「4-2_ERmodel」, p.12 (Key Attributes of an Entity Type)
[^3]: 데이터베이스 설계 5회 강의 자료 「5_ERmodel」, p.22 (Partial Key, Dependent_name)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 가지를 한 표에 모은 것과 카드 C1~C3은 원본에 없다. 표의 칸은 각주 1의 슬라이드에서 옮겼고, 괄호 안의 예는 6-2 p.21의 상태에서 검증 코드로 확인했다. 슈퍼키와 후보 키의 NULL은 슬라이드가 말하지 않는다. 개체 무결성 제약은 기본 키에만 걸려 있어서 "따로 정한 규칙이 없다"고 적었다.
{% endraw %}
