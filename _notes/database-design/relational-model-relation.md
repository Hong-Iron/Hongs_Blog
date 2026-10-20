---
layout: "note"
title: "릴레이션과 도메인·속성·튜플"
display_title: "릴레이션과 도메인·속성·튜플 (Relation, Domain, Attribute, Tuple)"
kind: "concept"
kind_label: "정의"
num: "32"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["Relation", "Relational Data Model", "관계형 데이터 모델", "관계형 모델", "릴레이션", "튜플", "Tuple", "속성", "Attribute", "도메인", "Domain", "릴레이션 스키마", "Relation Schema", "릴레이션 상태", "Relation State", "Relation Instance", "차수", "Degree", "dom"]
description: "관계형 모델은 모든 데이터를 표에 담는다. 표의 한 줄은 학생 한 명 같은 사실 하나이고, 칸 위에 적은 이름이 그 칸의 뜻을 정한다. 틀이 단순해서 누구나 읽을 수 있고 조건을 걸어 찾기도 쉽다. 다만 여기서 말하는 표는 줄의 모음이라, 화면에서 보던 표와 달리 같은 줄이 두 번…"
prev_url: "/studies/database-design/er-design-steps/"
prev_title: "ER 설계 절차"
next_url: "/studies/database-design/relation-characteristics/"
next_title: "릴레이션의 특성"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "32_relational-model-relation_verify.py", "u": "/studies/database-design/code/32_relational-model-relation_verify/", "r": "검증"}, {"t": "32_relational-model-relation_verify.sql", "u": "/studies/database-design/code/32_relational-model-relation_verify-sql/", "r": "검증"}]
permalink: "/studies/database-design/relational-model-relation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

관계형 모델은 모든 데이터를 표에 담는다. 표의 한 줄은 학생 한 명 같은 사실 하나이고, 칸 위에 적은 이름이 그 칸의 뜻을 정한다. 틀이 단순해서 누구나 읽을 수 있고 조건을 걸어 찾기도 쉽다. 다만 여기서 말하는 표는 줄의 모음이라, 화면에서 보던 표와 달리 같은 줄이 두 번 있을 수 없고 줄에 순서도 없다.

</div>


## 예시로 보기

학생 정보를 사람마다 다른 모양으로 적으면 찾을 수가 없다. 어떤 학생은 전화번호가 앞에, 어떤 학생은 뒤에 있으면 "학점이 3.5보다 높은 학생"을 고르는 프로그램을 짤 수 없다. 그래서 모든 학생을 같은 칸 일곱 개에 맞춰 적는다.

| Name | Ssn | Home_phone | Address | Office_phone | Age | Gpa |
|---|---|---|---|---|---|---|
| Benjamin Bayer | 305-61-2435 | (817)373-1616 | 2918 Bluebonnet Lane | NULL | 19 | 3.21 |
| Chung-cha Kim | 381-62-1245 | (817)375-4409 | 125 Kirby Road | NULL | 18 | 2.89 |
| Dick Davidson | 422-11-2320 | NULL | 3452 Elgin Road | (817)749-1253 | 25 | 3.53 |
| Rohan Panchal | 489-22-1100 | (817)376-9821 | 265 Lark Lane | (817)749-6492 | 28 | 3.93 |
| Barbara Benson | 533-69-1238 | (817)839-8461 | 7384 Fontana Lane | NULL | 19 | 3.25 |

이 표의 부분마다 이름이 있다.

| 평소에 쓰는 말 | 관계형 모델의 말 | 이 표에서 |
|---|---|---|
| 표 | 릴레이션(relation) | STUDENT |
| 줄 | 튜플(tuple) | 학생 한 명에 대한 사실. 다섯 개 |
| 칸 위의 이름 | 속성(attribute) | Name, Ssn, … 일곱 개 |
| 한 칸에 올 수 있는 값의 모음 | 도메인(domain) | Gpa 칸이면 0과 4 사이의 실수 |

한 줄은 실세계의 개체 하나나 관계 하나에 대한 사실이다. 칸 위의 이름은 그 칸의 값을 어떻게 읽을지 정한다. 19가 Age 칸에 있으니 나이이고, Gpa 칸에 있었다면 말이 안 되는 학점이다. 한 칸에 든 값은 모두 같은 자료형이다.

NULL은 "값이 없다"는 표시다. 그 뜻은 [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: STUDENT의 차수 7과 튜플 5개, 값 35개가 도메인 안이거나 NULL(4개), 곱집합 6개와 상태 64개, 같은 튜플을 또 넣어도 같은 상태, COMPANY의 차수 — [32_relational-model-relation_verify.py](/Hongs_Blog/studies/database-design/code/32_relational-model-relation_verify/)</div>

</div>


## 정의

**도메인.** 더 쪼갤 수 없는 값(원자값)의 집합이다. 도메인은 자료형을 적어서 정한다.

| 도메인 | 값 | 자료형으로 적으면 |
|---|---|---|
| Usa_phone_numbers | 미국에서 쓰는 열 자리 전화번호 | (ddd)ddd-dddd. d는 숫자 하나, 앞 세 자리는 지역 번호 |
| Employee_ages | 직원이 될 수 있는 나이 | 15와 80 사이의 정수 |
| Grade_point_averages | 평점 | 0과 4 사이의 실수 |

**릴레이션 스키마.** 릴레이션의 틀을 적은 것이다. 릴레이션 이름 $$R$$과 속성 목록 $$A_1, \dots, A_n$$으로 되어 있고 $$R(A_1, \dots, A_n)$$으로 쓴다. 속성의 수 $$n$$을 릴레이션의 차수(degree)라 한다. STUDENT(Name, Ssn, Home_phone, Address, Office_phone, Age, Gpa)의 차수는 7이다.

**속성.** 속성 $$A_i$$는 어떤 도메인이 이 스키마에서 맡은 역할의 이름이다. 그 도메인을 $$\text{dom}(A_i)$$(돔 에이 아이: 속성 $$A_i$$에 올 수 있는 값들)로 쓴다. Home_phone과 Office_phone은 도메인이 같고(전화번호) 맡은 역할이 다르다.

**튜플.** 값 $$n$$개를 순서대로 늘어놓은 것이다. $$t = \langle v_1, \dots, v_n \rangle$$으로 쓴다. 값 $$v_i$$는 $$\text{dom}(A_i)$$에 들어 있거나 특별한 값 NULL이다.

**릴레이션 상태.** 어느 순간 릴레이션에 들어 있는 튜플의 집합이다. 릴레이션 인스턴스라고도 한다. $$r(R) = \{t_1, \dots, t_m\}$$으로 쓴다($$m$$은 튜플 수).

상태는 도메인에서 값을 하나씩 뽑아 만들 수 있는 모든 조합 가운데 일부다. 식으로는 도메인들의 곱집합의 부분집합이다.

$$r(R) \subseteq \text{dom}(A_1) \times \text{dom}(A_2) \times \dots \times \text{dom}(A_n)$$


곱집합은 만들 수 있는 튜플을 전부 모은 것이다. 지금의 상태에는 그 가운데 실세계에서 지금 참인 튜플만 들어 있다. 작은 예로 $$\text{dom}(A) = \{a, b\}$$, $$\text{dom}(B) = \{1, 2, 3\}$$이면 만들 수 있는 튜플은 $$2 \times 3 = 6$$개다. 상태는 이 6개에서 몇 개를 골라 담은 것이라 가능한 상태는 $$2^6 = 64$$가지다[^s1]. 곱집합 식은 NULL을 뺀 값만 센 것이다[^s1].

실세계가 바뀌면 상태도 바뀐다. 학생이 전학을 오면 튜플이 하나 늘어난다. 스키마는 거의 바뀌지 않는다. 바뀐다면 새 속성을 더하는 정도다. 틀과 내용을 이렇게 가르는 생각은 [스키마와 인스턴스](/Hongs_Blog/studies/database-design/schema-and-instance/)와 같다.

## 활용

- **누가 만들었나.** IBM의 테드 코드(Ted Codd)가 1970년에 내놓았다. 데이터를 적는 방법을 단순하게 만들어 데이터 관리를 쉽게 했다.
- **장점 다섯 가지**. 납작한 표 하나로 되어 있어 이해하기 쉽다(단순함). 지켜야 할 규칙을 DBMS가 검사해서 데이터가 올바르고 서로 어긋나지 않는다(무결성과 정확성). SQL 같은 언어로 복잡한 조건을 걸어 데이터를 다룬다(다루기 쉬움). 스키마를 크게 고치지 않고 키울 수 있다(확장). 사용자 확인, 권한, 암호화 같은 기능이 있다(보안).
- **SQL로 적으면.** 릴레이션 스키마 하나가 `CREATE TABLE` 문 하나다: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/). 도메인은 자료형과 조건으로 적는다: [SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/), [속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/). PostgreSQL 16에서 `CREATE DOMAIN Employee_ages AS INT CHECK (VALUE BETWEEN 15 AND 80)`으로 도메인을 만들고 그 도메인의 칸에 14를 넣으면 거부된다. NULL은 들어간다. SQLite에는 `CREATE DOMAIN`이 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: PostgreSQL 16에서 실행. 도메인 밖의 나이 14와 꼴이 다른 전화번호는 거부, NULL은 들어감, 키가 없는 표는 같은 행을 두 번 받음 — [32_relational-model-relation_verify.sql](/Hongs_Blog/studies/database-design/code/32_relational-model-relation_verify-sql/)</div>

</div>


## 연결

- 어디에 놓이나: 사람이 읽는 설계도(ER 모델)와 디스크에 놓이는 방식 사이에서, DBMS가 직접 받아들이는 모델이다. [데이터 모델의 종류](/Hongs_Blog/studies/database-design/data-model-categories/)
- 수학의 관계: 곱집합의 부분집합을 수학에서는 관계라 부른다. 릴레이션이라는 이름이 여기서 왔다. [관계와 그 성질](/Hongs_Blog/studies/discrete-math/relations/)
- 헷갈리는 말: ER 모델의 관계 타입(relationship type)은 개체들 사이의 연결이고, 릴레이션(relation)은 표다. 영어도 다르다. [관계 타입과 관계 집합](/Hongs_Blog/studies/database-design/relationship-type-and-set/)
- 이어지는 개념: [릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/), [슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/), [관계형 데이터베이스 스키마와 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** "표, 줄, 칸 위의 이름, 한 칸에 올 수 있는 값의 모음"을 관계형 모델의 용어로 바꾸고, STUDENT 표에서 각각 무엇인지 하나씩 들어라.</summary>

**답:** 표 = 릴레이션(STUDENT), 줄 = 튜플(Benjamin Bayer의 줄), 칸 위의 이름 = 속성(Gpa), 값의 모음 = 도메인(0과 4 사이의 실수).<br>
**이유:** 흔한 실수는 속성과 도메인을 섞는 것이다. 속성은 칸의 이름이고 도메인은 그 칸에 올 수 있는 값의 집합이다. Home_phone과 Office_phone은 속성이 둘이고 도메인은 하나다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** EMPLOYEE(Fname, Minit, Lname, Ssn, Bdate, Address, Sex, Salary, Super_ssn, Dno)와 WORKS_ON(Essn, Pno, Hours)의 차수는 각각 얼마인가? 튜플 하나가 더 들어오면 차수가 바뀌는가?</summary>

**답:** 10과 3. 차수는 스키마의 속성 수라서 튜플이 늘어도 그대로다.<br>
**이유:** 튜플 수는 상태에 달렸고 차수는 스키마에 달렸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\text{dom}(A) = \{a, b\}$$, $$\text{dom}(B) = \{1, 2, 3\}$$인 $$R(A, B)$$에서 만들 수 있는 튜플은 몇 개인가? 가능한 상태는 몇 가지인가? 상태를 곱집합 "전체"가 아니라 "부분집합"이라고 하는 까닭은?</summary>

**답:** 튜플은 $$2 \times 3 = 6$$개, 상태는 $$2^6 = 64$$가지(빈 상태 포함). 곱집합은 만들 수 있는 조합 전부이고, 상태에는 그중 지금 실세계에서 참인 것만 들어가기 때문이다.

</details>


[^s1]: 곱집합 식이 NULL을 뺀 값만 센 것이라는 풀이는 이 둘을 맞춘 것이다.
{% endraw %}
