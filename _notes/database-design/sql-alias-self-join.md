---
layout: "note"
title: "별칭과 자기 조인"
display_title: "별칭과 자기 조인 (Alias)"
kind: "concept"
kind_label: "기법"
num: "55"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Alias", "Tuple Variable", "튜플 변수", "별칭", "별명", "AS", "이름 한정", "Qualified Attribute Name", "모호한 속성 이름", "Ambiguous Attribute Name", "자기 조인", "셀프 조인", "Self Join", "Renaming Attributes"]
description: "질의 안에서 표에 짧은 별명을 붙이는 방법이다. 같은 이름의 칸이 두 표에 있을 때 어느 표의 칸인지 밝히는 데 쓰고, 한 표를 두 번 쓸 때는 꼭 있어야 한다. 직원 명단 한 장으로 \"직원과 그 상사\"를 찾으려면, 명단을 두 장 복사해 한 장은 직원용, 한 장은 상사용으로 놓고 …"
prev_url: "/studies/database-design/missing-where-cross-product/"
prev_title: "WHERE 없는 질의와 카티션 곱"
next_url: "/studies/database-design/sql-multiset-distinct/"
next_title: "다중집합인 표와 DISTINCT"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "55_sql-alias-self-join_verify.py", "u": "/studies/database-design/code/55_sql-alias-self-join_verify/", "r": "검증"}]
permalink: "/studies/database-design/sql-alias-self-join/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

질의 안에서 표에 짧은 별명을 붙이는 방법이다. 같은 이름의 칸이 두 표에 있을 때 어느 표의 칸인지 밝히는 데 쓰고, 한 표를 두 번 쓸 때는 꼭 있어야 한다. 직원 명단 한 장으로 "직원과 그 상사"를 찾으려면, 명단을 두 장 복사해 한 장은 직원용, 한 장은 상사용으로 놓고 짝지어야 하는 것과 같다. 별명을 하나만 쓰면 "자기가 자기 상사인 직원"을 찾는 엉뚱한 질의가 되어 아무도 안 나온다.

</div>


## 예시로 보기

"직원마다 그 직원의 이름과 직속 상사의 이름을 구하라." 직원도 상사도 같은 표 EMPLOYEE에 들어 있다. 직원 행의 Super_ssn에 상사의 Ssn이 적혀 있다. 그러니 표 하나로 될 것 같다. 그런데 그렇게 쓴 아래 질의는 틀렸다.

```sql
SELECT E.Fname, E.Lname, E.Fname, E.Lname
FROM   EMPLOYEE AS E
WHERE  E.Super_ssn = E.Ssn;
```

돌리면 0행이다. 이 조건은 한 행 안에서 Super_ssn과 Ssn이 같은지를 본다. 곧 "자기가 자기 상사인 직원"을 찾는다. 그런 직원은 없다.

필요한 것은 직원 행 하나와 상사 행 하나, 두 행을 나란히 놓고 견주는 일이다. 그래서 같은 표를 두 번 적고 서로 다른 별명을 붙인다.

```sql
SELECT E.Fname, E.Lname, S.Fname, S.Lname
FROM   EMPLOYEE AS E, EMPLOYEE AS S
WHERE  E.Super_ssn = S.Ssn;
```

E와 S를 EMPLOYEE의 서로 다른 두 복사본이라고 생각한다. E는 감독받는 직원 쪽, S는 상사 쪽이다. E의 행 하나와 S의 행 하나를 짝지은 8 × 8 = 64개 조합 가운데 "E의 상사 번호가 S의 번호와 같은" 짝만 남는다.

| E.Fname | E.Lname | S.Fname | S.Lname |
|---|---|---|---|
| John | Smith | Franklin | Wong |
| Franklin | Wong | James | Borg |
| Alicia | Zelaya | Jennifer | Wallace |
| Jennifer | Wallace | James | Borg |
| Ramesh | Narayan | Franklin | Wong |
| Joyce | English | Franklin | Wong |
| Ahmad | Jabbar | Jennifer | Wallace |

직원은 여덟 명인데 결과는 일곱 행이다. Borg가 직원 쪽으로는 한 번도 안 나온다. Borg의 Super_ssn은 NULL이라 어느 S와도 맞지 않는다.


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 틀린 판 0행, 고친 판 7행(위 표), 64개 조합, 같은 이름의 열에서 나는 오류, 긴 이름과 별칭의 답이 같음, 결과 열 이름 바꾸기, 확인 문제의 답 — [55_sql-alias-self-join_verify.py](/Hongs_Blog/studies/database-design/code/55_sql-alias-self-join_verify/)</div>

</div>


## 정의

**표 이름 붙여 쓰기.** 서로 다른 릴레이션의 속성이 같은 이름을 쓸 수 있다. 한 질의가 그런 속성을 둘 이상 건드리면 어느 릴레이션의 것인지 헷갈린다. 이때는 속성 이름 앞에 릴레이션 이름을 붙이고 점으로 잇는다. 직원 표와 부서 표에 둘 다 Name과 Dnumber라는 칸이 있다고 하자. 그러면 이렇게 쓴다.

```sql
SELECT Fname, EMPLOYEE.Name, Address
FROM   EMPLOYEE, DEPARTMENT
WHERE  DEPARTMENT.Name = 'Research' AND
       DEPARTMENT.Dnumber = EMPLOYEE.Dnumber;
```

헷갈릴 것이 없는 속성에도 표 이름을 붙일 수 있다. 읽기에는 더 또렷하다.

**별칭.** 표 이름을 매번 다 쓰면 길다. `FROM`에서 `표 AS 별칭`으로 짧은 이름을 붙이고 그 이름으로 쓴다. 이 별칭을 튜플 변수라고도 한다.

```sql
SELECT E.Fname, E.LName, E.Address
FROM   EMPLOYEE AS E, DEPARTMENT AS D
WHERE  D.DName = 'Research' AND D.Dnumber = E.Dno;
```

**같은 표를 두 번 쓰기.** 한 질의가 같은 릴레이션을 두 번 가리킬 때도 이름이 헷갈린다. 이때는 별칭이 꼭 있어야 한다. 별칭마다 그 표의 복사본 하나를 가리킨다고 보고 두 복사본을 조인한다. 이런 조인을 흔히 자기 조인이라고 부른다[^s1].

**결과의 칸 이름 바꾸기.** `SELECT`에서 `속성 AS 새이름`이라고 쓰면 결과에 나오는 칸의 이름이 바뀐다.

```sql
SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name
FROM   EMPLOYEE AS E, EMPLOYEE AS S
WHERE  E.Super_ssn = S.Ssn;
```

이름을 안 바꾸면 결과의 두 칸이 모두 Lname이라 어느 쪽이 직원이고 어느 쪽이 상사인지 알 수 없다.

질의에 나오는 모든 표에 별칭을 붙여 두는 편이 좋다. 실수와 헷갈림을 미리 막는다.

## 예제

**이 방법을 꺼낼 신호.** 한 표의 행끼리 견주거나 이어야 하는 물음이다. "직원과 그 상사", "상사의 상사", "같은 부서의 다른 직원"처럼 같은 종류의 것 둘이 문장에 나온다. 표에 자기 자신을 가리키는 외래 키(Super_ssn → EMPLOYEE.Ssn)가 있으면 거의 틀림없다.

**예제 1. 상사와 다른 부서에서 일하는 직원의 성과 상사의 성**[^s1]

1. *복사본 정하기:* 직원 쪽을 E, 상사 쪽을 S로 둔다.
2. *두 복사본 잇기:* 직원의 상사 번호가 상사의 번호와 같다. `E.Super_ssn = S.Ssn`.
3. *고르는 조건:* 두 사람의 부서가 다르다. `E.Dno <> S.Dno`.
4. *꺼낼 칸:* `E.Lname`, `S.Lname`.

```sql
SELECT E.Lname, S.Lname
FROM   EMPLOYEE AS E, EMPLOYEE AS S
WHERE  E.Super_ssn = S.Ssn AND E.Dno <> S.Dno;
```

결과는 (Wong, Borg), (Wallace, Borg)다. Wong은 5번, Wallace는 4번 부서인데 상사 Borg는 1번 부서다.

**예제 2. 직원과 그 상사의 상사**[^s1]

1. *복사본 정하기:* 사람이 셋 나온다. 직원 E, 상사 S, 상사의 상사 T.
2. *잇기:* E와 S를 `E.Super_ssn = S.Ssn`으로, S와 T를 `S.Super_ssn = T.Ssn`으로 잇는다. 표가 셋이니 잇는 조건이 둘이다.

```sql
SELECT E.Lname, T.Lname
FROM   EMPLOYEE AS E, EMPLOYEE AS S, EMPLOYEE AS T
WHERE  E.Super_ssn = S.Ssn AND S.Super_ssn = T.Ssn;
```

결과는 Smith, Zelaya, Narayan, English, Jabbar 다섯 명이고 모두 Borg와 짝지어진다. Wong과 Wallace는 상사 Borg의 상사가 없어서 빠진다.

## 활용

- **별칭을 붙인 뒤에는 그 이름만 쓴다.** `FROM EMPLOYEE AS E`라고 적고 `EMPLOYEE.Fname`이라고 쓰면 오류다. 그 질의 안에서 표의 이름은 E다[^s1].
- **`AS`는 빼도 된다.** `FROM EMPLOYEE E, DEPARTMENT D`도 같은 뜻이다[^s1].
- **흔한 실수.** 두 별칭의 자리를 바꿔 조건을 쓴다. `E.Super_ssn = S.Ssn`은 E가 부하이고 S가 상사다. `E.Ssn = S.Super_ssn`이라고 쓰면 E가 상사, S가 부하가 되어 결과의 앞뒤 칸이 뒤집힌다.
- **빠진 Borg까지 보고 싶으면.** 짝이 없는 행도 남기는 조인을 쓴다: [외부 조인](/Hongs_Blog/studies/database-design/outer-join/).
- 연습: [기본 검색 연습](/Hongs_Blog/studies/database-design/basic-select-practice/)의 연습 4-c

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/)
- "직원이 직원을 감독한다"처럼 한 개체 타입이 두 역할로 나오는 관계가 표에서는 자기 자신을 가리키는 외래 키가 된다: [역할 이름과 재귀 관계](/Hongs_Blog/studies/database-design/recursive-relationship/). ER 그림의 두 역할(상사, 부하)이 질의에서는 두 별칭 S, E다.
- 질의 안에 질의를 넣을 때도 바깥과 안쪽의 이름이 겹친다. 그때도 별칭으로 가른다: [중첩 질의와 IN](/Hongs_Blog/studies/database-design/nested-query-in/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SELECT E.Fname, E.Lname FROM EMPLOYEE AS E WHERE E.Super_ssn = E.Ssn;`이 0행을 내는 까닭은 무엇인가? "직원과 상사"를 구하려면 무엇이 더 있어야 하는가?</summary>

**답:** 조건이 한 행 안에서 Super_ssn과 Ssn을 견주기 때문이다. 자기 번호가 자기 상사 번호인 직원은 없다. 직원 행과 상사 행, 두 행을 나란히 놓아야 하므로 EMPLOYEE를 한 번 더 적고 다른 별칭을 붙여 `E.Super_ssn = S.Ssn`으로 잇는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `SELECT E.Fname, E.Lname, S.Fname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn;`의 결과는 왜 8행이 아니라 7행인가? 빠진 사람은 누구인가? 상사 쪽(S)으로 한 번도 안 나오는 직원은 몇 명인가?</summary>

**답:** Borg가 빠진다. Borg의 Super_ssn이 NULL이라 `E.Super_ssn = S.Ssn`이 어느 S에 대해서도 참이 되지 않는다. 상사 쪽으로 나오는 사람은 Wong, Wallace, Borg 셋뿐이라, 나머지 다섯 명은 S로 한 번도 안 나온다.<br>
**이유:** 조인 조건이 참인 짝만 남는다. NULL은 어떤 값과 견주어도 참이 아니다([NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 조건 `E.Super_ssn = S.Ssn`과 `E.Ssn = S.Super_ssn`은 어떻게 다른가? `SELECT E.Lname, S.Lname`의 결과에서 (Smith, Wong)은 어느 쪽에서 나오는가?</summary>

**답:** 앞의 것은 E가 부하이고 S가 상사다. 뒤의 것은 E가 상사이고 S가 부하다. (Smith, Wong)은 앞의 조건에서 나온다. 뒤의 조건에서는 (Wong, Smith)가 나온다.<br>
**이유:** Super_ssn을 가진 쪽이 부하다. 그 값이 가리키는 Ssn을 가진 쪽이 상사다. 별칭의 글자가 아니라 어느 쪽의 Super_ssn을 썼는지가 역할을 정한다.

</details>


[^s1]: 결과는 SQLite 3.50에서 실행해 확인했다.
{% endraw %}
