---
layout: "note"
title: "자연 조인 NATURAL JOIN"
display_title: "자연 조인 NATURAL JOIN"
kind: "concept"
kind_label: "정의"
num: "65"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["NATURAL JOIN", "Natural Join", "자연 조인", "내추럴 조인", "조인 속성 이름 바꾸기"]
description: "두 표에 이름이 같은 열이 있으면 \"그 열끼리 값이 같은 행을 잇는다\"는 말을 생략할 수 있다. 맞출 조건을 적지 않아도 이름이 같은 열을 모두 찾아 맞춰 주고, 결과에는 그 열이 한 번만 나온다. 편하지만 이름에만 기대므로, 뜻이 같은 열의 이름이 다르면 먼저 이름을 맞춰 줘야 …"
prev_url: "/studies/database-design/sql-join-on/"
prev_title: "FROM 절의 조인 (JOIN ON)"
next_url: "/studies/database-design/outer-join/"
next_title: "외부 조인"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "65_natural-join_verify.py", "u": "/studies/database-design/code/65_natural-join_verify/", "r": "검증"}, {"t": "65_natural-join_verify.sql", "u": "/studies/database-design/code/65_natural-join_verify-sql/", "r": "검증"}]
permalink: "/studies/database-design/natural-join/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 표에 이름이 같은 열이 있으면 "그 열끼리 값이 같은 행을 잇는다"는 말을 생략할 수 있다. 맞출 조건을 적지 않아도 이름이 같은 열을 모두 찾아 맞춰 주고, 결과에는 그 열이 한 번만 나온다. 편하지만 이름에만 기대므로, 뜻이 같은 열의 이름이 다르면 먼저 이름을 맞춰 줘야 한다. 이름이 같은 열이 하나도 없으면 모든 조합이 나오고, 뜻이 다른데 이름만 같은 열이 있으면 그 열까지 맞추려다 엉뚱한 결과가 나온다.

</div>


## 예시로 보기

[JOIN ON](/Hongs_Blog/studies/database-design/sql-join-on/)으로 직원과 부서를 이으면 `ON Dno = Dnumber`를 적어야 하고, 결과에 값이 같은 `Dno`와 `Dnumber`가 둘 다 나온다. 두 열의 이름이 처음부터 같았다면 조건을 적을 필요도, 같은 값을 두 번 보여 줄 필요도 없다.

EMPLOYEE는 부서 번호를 `Dno`라 부르고 DEPARTMENT는 `Dnumber`라 부른다. 그래서 DEPARTMENT에 새 이름 DEPT를 붙이면서 열 이름도 (Dname, Dno, Mssn, Msdate)로 바꿔 부른다. 이제 `Dno`가 양쪽에 있다. PostgreSQL 16에서는 이렇게 쓴다.

```sql
SELECT Fname, Lname, Address
FROM   (EMPLOYEE NATURAL JOIN
        DEPARTMENT AS DEPT (Dname, Dno, Mssn, Msdate))
WHERE  Dname = 'Research';
```

`NATURAL JOIN`은 이름이 같은 `Dno`끼리 값이 같은 행을 잇는다. 결과는 Research 부서의 4명(Smith, Wong, Narayan, English)이다. 이어 붙인 표는 8행 13열이고, `Dno`는 한 번만 나온다.

| | 열의 수 | 맞춘 열 |
|---|---|---|
| `EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber` | 14 | `Dno`와 `Dnumber`가 둘 다 나온다 |
| `EMPLOYEE NATURAL JOIN DEPT(…)` | 13 | `Dno` 한 번 |

이름을 바꾼 표를 괄호로 한 번 더 싸서 `(EMPLOYEE NATURAL JOIN (DEPARTMENT AS DEPT (…)))`로 쓰면 PostgreSQL 16은 `syntax error at or near ")"`를 낸다. PostgreSQL은 이어 붙인 표 전체나 안쪽 질의는 괄호로 싸게 해 주지만, 표 하나만 싼 괄호는 받지 않는다.


SQLite는 표 이름 뒤에 열 목록을 붙이는 별칭을 받지 않는다. 그래서 열 이름을 바꾼 안쪽 질의를 대신 쓴다[^s1].

```sql
SELECT Fname, Lname, Address
FROM   EMPLOYEE NATURAL JOIN
       ( SELECT Dname, Dnumber AS Dno, Mgr_ssn AS Mssn, Mgr_start_date AS Msdate
         FROM   DEPARTMENT )
WHERE  Dname = 'Research';
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Research 직원 4명, 이어 붙인 표의 8행 13열, 이름을 맞추지 않은 조인의 24행, EMPLOYEE와 DEPENDENT의 0행, DEPARTMENT와 DEPT_LOCATIONS의 5행 5열. 열 목록이 붙은 별칭은 PostgreSQL 16에서, 바꿔 쓴 판은 SQLite 3.50.4에서 실행했다. `SELECT *`의 열 순서가 두 제품에서 다르다(PostgreSQL은 맞춘 열 `Dno`를 맨 앞에 두고, SQLite는 EMPLOYEE에서의 자리에 둔다) — [65_natural-join_verify.sql](/Hongs_Blog/studies/database-design/code/65_natural-join_verify-sql/), [65_natural-join_verify.py](/Hongs_Blog/studies/database-design/code/65_natural-join_verify/)</div>

</div>


## 정의

두 표 R과 S의 자연 조인 `R NATURAL JOIN S`는 잇는 조건을 적지 않는다. R과 S에서 이름이 같은 열의 쌍마다 "두 값이 같다"는 조건이 저절로 만들어진다. 그렇게 맞춘 쌍은 결과 표에 한 번만 나온다.

기호로 쓰면, R과 S에 함께 있는 열 이름을 $$A_1, \dots, A_k$$라 할 때 자연 조인은 조건 $$R.A_1 = S.A_1 \text{ AND } \cdots \text{ AND } R.A_k = S.A_k$$로 이은 뒤 $$S$$ 쪽의 $$A_1, \dots, A_k$$를 지운 것이다. $$R.A_1$$은 "표 R의 열 $$A_1$$"로 읽는다.

맞추려는 열의 이름이 두 표에서 다르면, 먼저 이름을 같게 바꾼 뒤 자연 조인을 한다. 위에서 DEPARTMENT를 DEPT(Dname, Dno, Mssn, Msdate)로 바꿔 부른 것이 그 일이다.

## 예제

이름에 기대는 조인이라, 이름이 뜻과 어긋나면 틀린 답이 나온다. 세 경우를 돌려 보았다[^s1].

| 질의 | 이름이 같은 열 | 결과 |
|---|---|---|
| `DEPARTMENT NATURAL JOIN DEPT_LOCATIONS` | Dnumber | 5행 5열. 바라던 대로다 |
| `EMPLOYEE NATURAL JOIN DEPARTMENT` | 없다 | 24행. 8 × 3의 모든 조합이다 |
| `EMPLOYEE NATURAL JOIN DEPENDENT` | Sex, Bdate | 0행 |

- 첫째는 두 표가 부서 번호를 똑같이 `Dnumber`라 불러서 잘 된다. 부서마다 그 부서의 위치가 붙어 5행이 나온다.
- 둘째는 이름을 바꾸지 않은 채 직원과 부서를 이은 것이다. 같은 이름의 열이 없으니 맞출 조건이 하나도 없고, 조건 없는 조인은 모든 조합이다([WHERE 없는 질의와 카티션 곱](/Hongs_Blog/studies/database-design/missing-where-cross-product/)).
- 셋째는 직원과 그 부양가족을 이으려 한 것이다. 이어야 할 열은 `Ssn`과 `Essn`인데 이름이 다르다. 대신 뜻이 다른 `Sex`와 `Bdate`가 두 표에 모두 있다. 그래서 "성별도 생일도 같은 직원과 부양가족"을 찾는 조건이 되어 버린다. 그런 쌍이 없어 0행이다. `ON Ssn = Essn`으로 이으면 7행이 나온다.

셋 다 오류는 나지 않는다.

## 활용

- 두 표를 잇는 열의 이름을 처음부터 같게 지어 둔 스키마에서는 짧게 쓸 수 있다.
- 흔한 실수: 표에 열을 하나 더했더니 다른 표와 이름이 겹쳐, 전에는 잘 돌던 자연 조인의 결과가 달라진다. 어느 열로 잇는지 질의에 적혀 있지 않기 때문이다. 그래서 잇는 열을 눈으로 확인할 수 있는 [JOIN ON](/Hongs_Blog/studies/database-design/sql-join-on/)을 쓰는 쪽이 안전하다[^s1].

## 연결

- 선수: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/)
- 표와 열에 새 이름을 붙이기: [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)
- 조인의 종류를 고르기: [내부 조인과 외부 조인 비교](/Hongs_Blog/studies/database-design/inner-vs-outer-join/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 자연 조인이 `JOIN … ON`과 다른 점 둘을 쓰라. 맞추려는 열의 이름이 두 표에서 다르면 어떻게 하는가?</summary>

**답:** ① 잇는 조건을 적지 않는다. 이름이 같은 열끼리 값이 같다는 조건이 저절로 붙는다. ② 맞춘 열이 결과에 한 번만 나온다. 이름이 다르면 한쪽 표의 열 이름을 바꿔 같게 만든 뒤 자연 조인을 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** DEPARTMENT(Dname, Dnumber, Mgr_ssn, Mgr_start_date)는 3행, DEPT_LOCATIONS(Dnumber, Dlocation)는 (1, Houston), (4, Stafford), (5, Bellaire), (5, Sugarland), (5, Houston) 5행이다. `SELECT * FROM DEPARTMENT NATURAL JOIN DEPT_LOCATIONS;`의 결과는 몇 행 몇 열인가?</summary>

**답:** 5행 5열.<br>
**이유:** 이름이 같은 열은 `Dnumber` 하나다. 위치 5행마다 부서가 정확히 하나씩 맞아 5행이다. 열은 4 + 2에서 겹친 `Dnumber` 하나를 빼 5개다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 직원과 부양가족을 이으려고 `EMPLOYEE NATURAL JOIN DEPENDENT`를 썼더니 0행이 나왔다. 까닭과 고친 질의를 쓰라. DEPENDENT의 열은 (Essn, Dependent_name, Sex, Bdate, Relationship)이다.</summary>

**답:** 두 표에서 이름이 같은 열은 `Sex`와 `Bdate`다. 자연 조인은 이 둘이 모두 같은 쌍을 찾는데, 성별과 생일이 다 같은 직원과 부양가족은 없다. `EMPLOYEE JOIN DEPENDENT ON Ssn = Essn`으로 고치면 7행이 나온다.<br>
**이유:** 자연 조인은 열의 뜻이 아니라 이름만 본다. 이어야 할 `Ssn`과 `Essn`은 이름이 달라 조건에 들어가지 않는다.

</details>


[^s1]: 값은 SQLite와 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
