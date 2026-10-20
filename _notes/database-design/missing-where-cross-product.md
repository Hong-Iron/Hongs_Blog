---
layout: "note"
title: "WHERE 없는 질의와 카티션 곱"
display_title: "WHERE 없는 질의와 카티션 곱 (Missing WHERE Clause)"
kind: "concept"
kind_label: "정의"
num: "54"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Missing WHERE Clause", "WHERE 절 생략", "카티션 곱", "카테시안 곱", "Cartesian Product", "Cross Product", "크로스 곱", "모든 조합"]
description: "행을 고르는 조건을 적지 않으면 모든 행이 나오고, 표가 둘이면 한 표의 행 하나하나가 다른 표의 모든 행과 짝지어져 나온다. 학생 8명과 동아리 3개를 조건 없이 늘어놓으면 \"누가 어느 동아리인지\"가 아니라 있을 수 있는 24가지 짝이 전부 나오는 것과 같다. 오류가 나지 않아서…"
prev_url: "/studies/database-design/referential-triggered-actions/"
prev_title: "참조 동작 SET NULL·CASCADE·SET DEFAULT"
next_url: "/studies/database-design/sql-alias-self-join/"
next_title: "별칭과 자기 조인"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "54_missing-where-cross-product_verify.py", "u": "/studies/database-design/code/54_missing-where-cross-product_verify/", "r": "검증"}]
permalink: "/studies/database-design/missing-where-cross-product/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

행을 고르는 조건을 적지 않으면 모든 행이 나오고, 표가 둘이면 한 표의 행 하나하나가 다른 표의 모든 행과 짝지어져 나온다. 학생 8명과 동아리 3개를 조건 없이 늘어놓으면 "누가 어느 동아리인지"가 아니라 있을 수 있는 24가지 짝이 전부 나오는 것과 같다. 오류가 나지 않아서 더 위험하다. 조건 하나를 빠뜨리면 행 수가 몇 배로 불어난 틀린 답이 아무 경고 없이 나온다.

</div>


## 예시로 보기

조건은 "이런 행만"이라고 좁히는 말이다. 그 말을 안 하면 좁혀지지 않는다.

```sql
SELECT Ssn
FROM   EMPLOYEE;
```

직원 여덟 명의 Ssn이 모두 나온다. 여기까지는 바라던 대로다. 표를 둘 적으면 이야기가 달라진다.

```sql
SELECT Ssn, Dname
FROM   EMPLOYEE, DEPARTMENT;
```

24행이 나온다. 직원 한 명마다 부서 셋이 모두 붙는다.

| Ssn | Dname |
|---|---|
| 123456789 | Research |
| 123456789 | Administration |
| 123456789 | Headquarters |
| 333445555 | Research |
| 333445555 | Administration |
| 333445555 | Headquarters |
| … (나머지 여섯 명도 세 번씩) | … |

Smith(123456789)는 Research에서만 일한다. 그런데 결과에는 Administration, Headquarters와도 짝지어져 있다. 24행 가운데 사실인 짝은 8행뿐이고 16행은 사실이 아니다. `WHERE Dno = Dnumber`를 붙여야 그 8행만 남는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 8행과 24행, 직원마다 세 번·부서마다 여덟 번, 맞는 짝 8행, 조건을 빠뜨릴 때의 행 수(4 → 8, 2 → 16), 여섯 표의 곱 80,640, 확인 문제의 답 — [54_missing-where-cross-product_verify.py](/Hongs_Blog/studies/database-design/code/54_missing-where-cross-product_verify/)</div>

</div>


## 정의

`WHERE` 절이 없으면 튜플을 고르는 조건이 없다. `FROM`에 적힌 릴레이션의 모든 튜플이 나온다. 릴레이션이 둘 이상이면 그 릴레이션들의 튜플로 만들 수 있는 모든 조합이 나온다.

이렇게 만든 "모든 조합"을 두 표의 카티션 곱(cross product)이라 부른다[^s1].

**기호로 쓰면.** 표 $$R$$과 $$S$$의 카티션 곱은 $$R$$의 행 하나와 $$S$$의 행 하나를 붙인 짝을 모두 모은 것이다.

$$R \times S = \{\, (r, s) \;:\; r \in R,\ s \in S \,\}, \qquad \vert R \times S\vert  = \vert R\vert  \cdot \vert S\vert $$


$$r$$은 $$R$$의 행 하나, $$s$$는 $$S$$의 행 하나다. $$\vert R\vert $$은 $$R$$의 행 수다. 행 수는 두 표의 행 수를 곱한 것이다. EMPLOYEE가 8행, DEPARTMENT가 3행이라 8 × 3 = 24행이 나왔다. 집합의 [곱집합](/Hongs_Blog/studies/discrete-math/sets/)과 같은 식이다.

그래서 선택 조건과 조인 조건을 `WHERE` 절에 하나도 빠짐없이 적는 것이 아주 중요하다. 하나라도 빠뜨리면 틀리고 아주 큰 릴레이션이 결과로 나올 수 있다.


## 예제

조건을 하나씩 빠뜨리면 결과가 얼마나 불어나는지 본다[^s1]. 질의는 [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)의 Q1과 Q2다.

| 질의 | 조건을 다 적으면 | 조인 조건 하나를 빠뜨리면 | `WHERE`를 통째로 빠뜨리면 |
|---|---|---|---|
| Q1: Research 직원 (표 둘) | 4행 | 8행 | 24행 |
| Q2: Stafford의 프로젝트와 관리자 (표 셋) | 2행 | 16행 (`Mgr_ssn = Ssn`을 빠뜨림) 또는 6행 (`Dnum = Dnumber`를 빠뜨림) | 144행 |

Q1에서 조인 조건을 빠뜨린 8행은 "직원 여덟 명 모두"다. 다른 부서 사람까지 Research 직원으로 나온다. 행 수가 4에서 8로 겨우 두 배라 눈에 잘 안 띈다.

표가 많아지면 곱은 금세 커진다. COMPANY의 여섯 표를 조건 없이 한 `FROM`에 적으면 8 × 3 × 5 × 6 × 16 × 7 = 80,640행이 나온다. 행이 몇십 개뿐인 연습용 표에서 이 정도다.

한쪽 표가 비어 있으면 조합도 0개다. 곱하는 수 가운데 0이 있으면 곱이 0인 것과 같다.

## 활용

- **빠뜨린 것을 알아채는 법.** 결과의 행 수를 어림한다. "직원이 8명인데 왜 24행이지?" 싶으면 조건이 빠졌다. 또 `FROM`의 표 수를 센다. 표가 $$n$$개인데 표끼리 잇는 조건이 $$n - 1$$개보다 적으면 어딘가 이어지지 않은 표가 있다[^s1].
- **조인 조건을 `FROM`에 적기.** 조인 조건을 `WHERE`에 섞어 쓰면 빠뜨려도 티가 안 난다. `FROM`에서 표를 이을 때 조건을 바로 붙여 쓰는 방법이 있다: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/).
- **행이 나오는 차례.** 결과의 행이 어떤 차례로 나오는지는 정해져 있지 않다. SQLite에서 `SELECT Ssn FROM EMPLOYEE;`를 돌리면 행을 넣은 차례(Smith, Wong, Zelaya, …)가 아니라 번호가 작은 것부터 나온다. 차례를 정하려면 따로 적어야 한다: [ORDER BY와 질의의 절 순서](/Hongs_Blog/studies/database-design/order-by-clause-order/)[^s1].

## 연결

- 선수: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)
- 같은 식: [집합](/Hongs_Blog/studies/discrete-math/sets/)의 곱집합 $$A \times B$$와 $$\vert A \times B\vert  = \vert A\vert \,\vert B\vert $$
- 조합을 걸러 내는 방법들: [내부 조인과 외부 조인 비교](/Hongs_Blog/studies/database-design/inner-vs-outer-join/)
- 한 표를 자기 자신과 곱하기: [별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SELECT Pname, Dname FROM PROJECT, DEPARTMENT;`는 몇 행을 내는가? 그 가운데 "프로젝트와 그것을 맡은 부서"라는 사실에 맞는 짝은 몇 행인가? 맞는 짝만 남기려면 무엇을 붙이는가?</summary>

**답:** 6 × 3 = 18행이다. 맞는 짝은 6행이다. `WHERE Dnum = Dnumber`를 붙인다.<br>
**이유:** 프로젝트 여섯 개가 각각 부서 셋과 모두 짝지어진다. 프로젝트 하나를 맡은 부서는 하나뿐이므로 맞는 짝은 프로젝트 수와 같은 6개다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 조인 조건을 빠뜨린 질의가 왜 오류가 아닌가? 그래서 왜 더 위험한가?</summary>

**답:** `WHERE` 절은 없어도 되는 절이고, "모든 조합을 달라"도 문법에 맞는 질의이기 때문이다. DBMS는 사용자가 어떤 짝을 바랐는지 모른다. 오류가 안 나므로 틀린 답을 맞는 답으로 믿고 쓰게 된다.<br>
**이유:** Q1에서 조인 조건을 빠뜨리면 4행이어야 할 답이 8행으로 나온다. 행 수가 조금만 달라 눈으로는 알아채기 어렵다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "직원과 그 직원이 일하는 프로젝트의 이름"을 구하려고 `FROM EMPLOYEE, WORKS_ON, PROJECT`를 적었다. 조인 조건 둘(`Ssn = Essn`, `Pno = Pnumber`)을 다 적으면 16행이다. 하나씩 빠뜨리면 각각 몇 행이 되는가? (EMPLOYEE 8행, WORKS_ON 16행, PROJECT 6행)</summary>

**답:** `Pno = Pnumber`를 빠뜨리면 16 × 6 = 96행, `Ssn = Essn`을 빠뜨리면 8 × 16 = 128행이다.<br>
**이유:** 남은 조건이 이어 준 두 표의 결과는 16행이다. 이어지지 않은 셋째 표의 모든 행이 그 16행 하나하나에 붙는다.

</details>


[^s1]: 이름은 Elmasri & Navathe, *Fundamentals of Database Systems* 7판 6.3.3절의 "CROSS PRODUCT"를 따랐다. 수치는 SQLite 3.50에서 실행해 확인했다.
{% endraw %}
