---
layout: "note"
title: "외래 키 찾기 연습"
display_title: "외래 키 찾기 연습"
kind: "practice"
kind_label: "연습"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 참조 무결성 제약과 외래 키의 두 조건, 기본 키."
prev_url: "/studies/database-design/er-model-practice/"
prev_title: "ER 모델 연습"
next_url: "/studies/database-design/er-mapping-ladder/"
next_title: "ER-관계형 사상 예제 사다리"
math: false
mermaid: false
code_count: 2
permalink: "/studies/database-design/foreign-key-practice/"
---
{% raw %}
사용 개념: [참조 무결성 제약과 외래 키](/Hongs_Blog/studies/database-design/referential-integrity-foreign-key/)의 두 조건, [기본 키](/Hongs_Blog/studies/database-design/relational-keys/).

외래 키를 찾는 문제 둘이다. 릴레이션 스키마와 기본 키만 주어지고 외래 키를 찾으라고 한다.

**풀이 전략.** 외래 키는 "다른 릴레이션의 기본 키를 가리키는 속성"이다. 그래서 기본 키에서 출발한다.

1. *기본 키 적기:* 릴레이션마다 기본 키를 적는다.
2. *후보 찾기:* 어떤 릴레이션의 기본 키 속성이 다른 릴레이션에 그대로 나오면 외래 키 후보다.
3. *뜻으로 거르기:* 후보마다 "이 값은 저 릴레이션에 반드시 있어야 하는가?"를 묻는다. 그렇다고 답할 수 있는 것만 외래 키다.
4. *남은 속성 보기:* 이름이 그럴듯한데 가리킬 릴레이션이 없는 속성은 외래 키가 아니다.

2단계는 이름만 보는 것이라 틀릴 수 있다. 3단계가 답을 정한다.

## p1 · 출장 데이터베이스

판매 사무소 직원들의 출장을 적는 데이터베이스다. 출장 한 번의 경비는 계정 하나 이상에 청구할 수 있다. 이 스키마의 외래 키를 적어라.

| 릴레이션 | 속성 (굵은 것이 기본 키) |
|---|---|
| SALESPERSON | **Ssn**, Name, Start_year, Dept_no |
| TRIP | Ssn, From_city, To_city, Departure_date, Return_date, **Trip_id** |
| EXPENSE | **Trip_id**, **Account#**, Amount |

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *기본 키 적기:* SALESPERSON은 Ssn, TRIP은 Trip_id, EXPENSE는 (Trip_id, Account#).
2. *후보 찾기:* TRIP에 Ssn이 있다(SALESPERSON의 기본 키). EXPENSE에 Trip_id가 있다(TRIP의 기본 키). 후보는 둘이다.
3. *뜻으로 거르기:* 출장은 실제로 있는 판매원에게 배정되어야 한다. 경비는 어떤 출장에 쓴 것이어야 한다. 둘 다 "반드시 있어야 한다"가 맞다.
4. *남은 속성 보기:* SALESPERSON의 Dept_no는 부서 번호처럼 보이지만, 이 스키마에는 부서 릴레이션이 없다. 가리킬 곳이 없어 외래 키가 아니다.

| 외래 키 | 참조되는 릴레이션 | 뜻 |
|---|---|---|
| TRIP.Ssn | SALESPERSON(Ssn) | 출장은 있는 판매원의 것이어야 한다 |
| EXPENSE.Trip_id | TRIP(Trip_id) | 경비는 있는 출장의 것이어야 한다 |

외래 키는 이 둘이다.

</details>


EXPENSE의 Trip_id는 기본 키의 한 부분이면서 외래 키다. 출장 하나의 경비를 계정 100과 계정 200에 나눠 적으면 Trip_id가 같은 줄이 둘 생긴다. 그래서 Trip_id 혼자서는 키가 아니고 Account#과 묶어야 한다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 기본 키 속성을 가진 릴레이션을 기계적으로 찾으면 후보가 정확히 2개, 답대로 만든 표가 없는 판매원의 출장과 없는 출장의 경비를 거부, 한 출장의 경비가 두 계정에 들어감 — [37_foreign-key-practice_p1.py](/Hongs_Blog/studies/database-design/code/37_foreign-key-practice_p1/)</div>

</div>


**변형.** 이 스키마에 DEPARTMENT(**Dept_no**, Dname)를 더하면 외래 키는 어떻게 바뀌는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

SALESPERSON.Dept_no → DEPARTMENT(Dept_no)가 하나 더 생겨 셋이 된다. 가리킬 릴레이션이 생겼고, "판매원의 부서는 있는 부서여야 한다"가 맞기 때문이다[^s1].

</details>


## p2 · 수강과 교재 데이터베이스

학생의 수강과 과목마다 채택한 교재를 적는 데이터베이스다. 이 스키마의 외래 키를 적어라.

| 릴레이션 | 속성 (굵은 것이 기본 키) |
|---|---|
| STUDENT | **Ssn**, Name, Major, Bdate |
| COURSE | **Course#**, Cname, Dept |
| ENROLL | **Ssn**, **Course#**, **Quarter**, Grade |
| BOOK_ADOPTION | **Course#**, **Quarter**, Book_isbn |
| TEXT | **Book_isbn**, Book_title, Publisher, Author |

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *기본 키 적기:* STUDENT는 Ssn, COURSE는 Course#, ENROLL은 (Ssn, Course#, Quarter), BOOK_ADOPTION은 (Course#, Quarter), TEXT는 Book_isbn.
2. *후보 찾기:* ENROLL에 Ssn과 Course#이 있다. BOOK_ADOPTION에 Course#과 Book_isbn이 있다. 하나가 더 있다. ENROLL에 (Course#, Quarter)가 있는데 이것은 BOOK_ADOPTION의 기본 키다. 후보는 다섯이다.
3. *뜻으로 거르기:* 수강은 있는 학생과 있는 과목의 것이어야 한다. 채택은 있는 과목과 있는 교재의 것이어야 한다. 이 넷은 맞다. 다섯째는 "수강하려면 그 학기에 그 과목의 교재가 채택되어 있어야 한다"는 뜻이 된다. 문제는 그런 규칙을 말하지 않았다.
4. *남은 속성 보기:* Major, Dept, Publisher, Author는 가리킬 릴레이션이 없다.

| 외래 키 | 참조되는 릴레이션 | 뜻 |
|---|---|---|
| ENROLL.Ssn | STUDENT(Ssn) | 수강에는 있는 학생이 들어가야 한다 |
| ENROLL.Course# | COURSE(Course#) | 수강에는 있는 과목이 들어가야 한다 |
| BOOK_ADOPTION.Course# | COURSE(Course#) | 채택하는 교재는 어떤 과목의 것이어야 한다 |
| BOOK_ADOPTION.Book_isbn | TEXT(Book_isbn) | 채택하는 교재의 ISBN은 TEXT에 있어야 한다 |

외래 키는 이 넷이다.

</details>


다섯째 후보를 외래 키로 걸면 무엇이 달라질까? 교재를 채택하지 않은 학기의 수강이 들어가지 않는다. 답의 넷만 걸면 그런 수강도 들어간다. 어느 쪽이 맞는지는 학교의 규칙이 정한다. 이름이 맞는다고 외래 키로 거는 것이 아니라 규칙이 있을 때만 건다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 기계적으로 찾은 후보 5개 가운데 4개가 답이고 남는 것은 ENROLL(Course#, Quarter) → BOOK_ADOPTION, 답 4개가 없는 학생·과목·교재를 거부, 교재 없는 학기의 수강은 답 4개로는 들어가고 다섯째까지 걸면 거부 — [37_foreign-key-practice_p2.py](/Hongs_Blog/studies/database-design/code/37_foreign-key-practice_p2/)</div>

</div>


**변형.** 학교가 "모든 과목은 학기마다 교재를 하나 채택하고, 채택이 끝난 뒤에만 수강 신청을 받는다"는 규칙을 세웠다. 외래 키는 어떻게 바뀌는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

ENROLL(Course#, Quarter) → BOOK_ADOPTION(Course#, Quarter)를 더한다. 두 속성을 묶은 외래 키다. 이 외래 키가 있으면 ENROLL.Course# → COURSE는 없어도 과목이 있는 것이 지켜진다. BOOK_ADOPTION.Course#이 이미 COURSE를 가리키기 때문이다. 그래도 뜻이 바로 드러나게 둘 다 적어 두는 편이 읽기 쉽다[^s2].

</details>


[^s1]: 문제 코드로 확인했다.
[^s2]: 다섯째를 걸었을 때와 안 걸었을 때의 차이는 문제 코드로 확인했다.
{% endraw %}
