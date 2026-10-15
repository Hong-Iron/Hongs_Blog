---
layout: "note"
title: "외부 조인"
display_title: "외부 조인 (Outer Join)"
kind: "concept"
kind_label: "정의"
num: "66"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Outer Join", "OUTER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "왼쪽 외부 조인", "오른쪽 외부 조인", "완전 외부 조인", "내부 조인", "Inner Join", "안티 조인"]
description: "직원 옆에 상사 이름을 붙인 명단을 만들면, 상사가 없는 사장은 짝이 없어서 명단에서 통째로 빠진다. 짝이 없는 사람도 명단에 남기고 짝 자리는 빈칸으로 두는 것이 외부 조인이다. 어느 쪽 표의 행을 다 남길지에 따라 왼쪽, 오른쪽, 양쪽 세 가지가 있다. 빈칸으로 채운 행도 한 …"
prev_url: "/studies/database-design/natural-join/"
prev_title: "자연 조인 NATURAL JOIN"
next_url: "/studies/database-design/inner-vs-outer-join/"
next_title: "내부 조인과 외부 조인 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/outer-join/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직원 옆에 상사 이름을 붙인 명단을 만들면, 상사가 없는 사장은 짝이 없어서 명단에서 통째로 빠진다. 짝이 없는 사람도 명단에 남기고 짝 자리는 빈칸으로 두는 것이 외부 조인이다. 어느 쪽 표의 행을 다 남길지에 따라 왼쪽, 오른쪽, 양쪽 세 가지가 있다. 빈칸으로 채운 행도 한 줄이라서, 줄 수를 그대로 세면 짝이 없는 사람도 1로 나온다.

</div>


## 예시로 보기

"모든 직원의 성과 그 상사의 성을 나란히 보여라." 직원 표를 두 번 써서 `E.Super_ssn = S.Ssn`으로 이으면 된다([별칭과 자기 조인](/Hongs_Blog/studies/database-design/sql-alias-self-join/)). 그런데 결과가 8행이 아니라 7행이다.

```sql
SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name
FROM   EMPLOYEE AS E, EMPLOYEE AS S
WHERE  E.Super_ssn = S.Ssn;
```

Borg는 `Super_ssn`이 NULL이라 어떤 `S.Ssn`과도 맞지 않는다. 짝이 없는 행은 결과에 나오지 않는다. "모든 직원"을 보려면 조인의 종류를 바꾼다.

```sql
SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name
FROM   (EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S
        ON E.Super_ssn = S.Ssn);
```

| Employee_name | Supervisor_name | 내부 조인 | LEFT OUTER JOIN |
|---|---|---|---|
| Smith | Wong | 나온다 | 나온다 |
| Wong | Borg | 나온다 | 나온다 |
| Zelaya | Wallace | 나온다 | 나온다 |
| Wallace | Borg | 나온다 | 나온다 |
| Narayan | Wong | 나온다 | 나온다 |
| English | Wong | 나온다 | 나온다 |
| Jabbar | Wallace | 나온다 | 나온다 |
| Borg | NULL | 빠진다 | 나온다 |

왼쪽 표(E)의 행은 짝이 없어도 남고, 오른쪽 표(S)에서 올 열은 NULL로 채워진다. 7행이 8행이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 내부 7행, LEFT 8행, RIGHT 12행, FULL 13행, 짝 없는 행만 고른 결과(Borg, 부하 없는 5명, 부양가족 없는 5명), `COUNT(*)` 8과 `COUNT(S.Ssn)` 7, 직원별 부양가족 수, 조건을 `ON`과 `WHERE`에 둔 8행과 3행. SQLite 3.50.4와 PostgreSQL 16에서 같은 값이 나온다 — [66_outer-join_verify.py](/Hongs_Blog/studies/database-design/code/66_outer-join_verify/), [66_outer-join_verify.sql](/Hongs_Blog/studies/database-design/code/66_outer-join_verify-sql/)</div>

</div>


## 정의

조인은 기본이 내부 조인(inner join)이다. 한 행은 다른 표에 짝이 되는 행이 있을 때만 결과에 들어간다. 외부 조인(outer join)은 짝이 없는 행도 꺼내고, 짝 쪽 표의 열을 NULL로 채운다.

| 종류 | 반드시 남는 행 | NULL로 채우는 쪽 |
|---|---|---|
| `A LEFT OUTER JOIN B ON …` | 왼쪽 표 A의 모든 행 | B의 열 |
| `A RIGHT OUTER JOIN B ON …` | 오른쪽 표 B의 모든 행 | A의 열 |
| `A FULL OUTER JOIN B ON …` | 양쪽 표의 모든 행 | 짝이 없는 쪽의 반대쪽 열 |

`OUTER`는 빼고 `LEFT JOIN`처럼 써도 같은 뜻이다.

기호로 쓰면, 내부 조인의 결과를 $$J$$라 할 때 `A LEFT OUTER JOIN B`의 결과는 $$J \cup \{\,(a, \text{NULL}, \dots, \text{NULL}) : a \in A,\ a\text{의 짝이 } B\text{에 없다}\,\}$$이다. $$\cup$$는 두 모음을 합친다는 뜻이다. 내부 조인의 행에, 짝 없는 A의 행을 NULL로 늘린 것을 더한다는 말이다[^s1].

같은 직원과 상사의 조인에서 종류만 바꾸면 행 수가 이렇게 달라진다[^s1].

| 종류 | 행 수 | 더해진 행 |
|---|---|---|
| 내부 조인 | 7 | — |
| `LEFT OUTER JOIN` | 8 | (Borg, NULL): 상사가 없는 직원 |
| `RIGHT OUTER JOIN` | 12 | (NULL, Smith), (NULL, Zelaya), (NULL, Narayan), (NULL, English), (NULL, Jabbar): 부하가 없는 직원 5명 |
| `FULL OUTER JOIN` | 13 | 위의 6행 모두 |

오른쪽 표 S는 "상사 자리"에 선 직원이다. 부하가 한 명도 없는 직원은 S 쪽에서 짝이 없어 `RIGHT`에서 남는다.

### 짝 없는 행만 고르기

외부 조인 뒤에 "채워진 쪽이 NULL인 행만" 남기면 짝이 없는 행만 얻는다. 표 A와 B를 겹친 두 원으로 그리고 결과에 드는 곳을 색칠하면, 질의의 꼴마다 이렇다.

| 색칠된 곳 | 질의의 꼴 | 뜻 |
|---|---|---|
| 겹친 곳만 | `A JOIN B ON A.KEY = B.KEY` | 짝이 있는 것 (내부 조인) |
| A 전체 | `A LEFT JOIN B ON A.KEY = B.KEY` | A는 모두, B는 짝만 |
| A에서 겹친 곳을 뺀 것 | `A LEFT JOIN B ON A.KEY = B.KEY WHERE B.KEY IS NULL` | B에 짝이 없는 A |
| B 전체 | `A RIGHT JOIN B ON A.KEY = B.KEY` | B는 모두, A는 짝만 |
| B에서 겹친 곳을 뺀 것 | `A RIGHT JOIN B ON A.KEY = B.KEY WHERE A.KEY IS NULL` | A에 짝이 없는 B |
| 양쪽 전체 | `A FULL OUTER JOIN B ON A.KEY = B.KEY` | 모두 |
| 겹친 곳만 뺀 것 | `A FULL OUTER JOIN B ON A.KEY = B.KEY WHERE A.KEY IS NULL OR B.KEY IS NULL` | 어느 쪽이든 짝이 없는 것 |

"부양가족이 없는 직원"을 이 방법으로 구한다[^s1].

```sql
SELECT E.Fname, E.Lname
FROM   EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D
       ON E.Ssn = D.Essn
WHERE  D.Essn IS NULL;
```

결과는 Zelaya, Narayan, English, Jabbar, Borg로, `NOT EXISTS`로 쓴 판([EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/))과 같다. "한 번도 주문하지 않은 고객"도 이 꼴로 구한다.

### 빈칸으로 채운 행을 셀 때

외부 조인의 결과를 세면 `COUNT(*)`와 `COUNT(열)`이 갈린다. 직원과 상사의 `LEFT OUTER JOIN`에서 `COUNT(*)`는 8, `COUNT(S.Ssn)`은 7이다. `COUNT(*)`는 줄을 세고, `COUNT(S.Ssn)`은 그 열에 값이 있는 칸만 센다([집계 함수](/Hongs_Blog/studies/database-design/aggregate-functions/)).

직원마다 부양가족 수를 세면 차이가 더 잘 보인다. 직원과 부양가족을 `LEFT OUTER JOIN`으로 잇고 직원별로 묶었다([GROUP BY](/Hongs_Blog/studies/database-design/group-by/))[^s1].

| 직원 | `COUNT(*)` | `COUNT(D.Essn)` |
|---|---|---|
| Smith | 3 | 3 |
| Wong | 3 | 3 |
| Wallace | 1 | 1 |
| Zelaya, Narayan, English, Jabbar, Borg | 1 | 0 |

부양가족이 없는 다섯 명은 NULL로 채운 한 줄이 있어서 `COUNT(*)`가 1이다. 맞는 값 0은 오른쪽 표의 열을 센 `COUNT(D.Essn)`에서 나온다. "참가자가 없는 행사는 0으로 보여라" 같은 물음도 이 방법으로 푼다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. LEFT OUTER JOIN의 결과가 내부 조인보다 정확히 한 행 많은 까닭은?</summary>

왼쪽 표 E의 행 가운데 짝이 없는 것이 Borg 하나뿐이기 때문이다. 나머지 일곱 명은 `Super_ssn`이 가리키는 직원이 정확히 한 명씩 있어 내부 조인에 이미 나온다. 외부 조인은 내부 조인의 행에 짝 없는 행을 한 번씩만 더한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 직원 8명과 부양가족 7명을 `EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn`으로 이으면 12행이다. 왜 8행이 아닌가?</summary>

왼쪽 행은 짝의 수만큼 되풀이해 나온다. Smith 3행, Wong 3행, Wallace 1행으로 짝 있는 행이 7행이고, 짝이 없는 다섯 명이 한 행씩 5행이다. 7 + 5 = 12다. "왼쪽 표의 모든 행이 남는다"는 "적어도 한 번 나온다"는 뜻이지 "한 번만 나온다"는 뜻이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `WHERE D.Essn IS NULL`이 부양가족 없는 직원만 남기는 근거는?</summary>

짝이 있는 행에서는 `D.Essn`이 `E.Ssn`과 같은 값이라 NULL일 수 없다. `D.Essn`이 NULL인 행은 외부 조인이 채워 넣은 행뿐이다. 그래서 검사하는 열은 원래 NULL이 될 수 없는 열(조인에 쓴 열이나 기본 키)로 고른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

조인은 짝을 찾는 일이고, 외부 조인은 "짝을 못 찾았다"는 사실도 결과에 한 줄로 남긴다. 그 줄의 짝 자리를 NULL로 채운다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

ER 모델에서 관계에 꼭 참여하지 않아도 되는 개체([참여 제약](/Hongs_Blog/studies/database-design/participation-constraint/)의 부분 참여)가 있으면 짝 없는 행이 생긴다. 직원이 부서를 관리하는 관계에서 직원 쪽이 그렇다. 그런 행까지 보려 할 때 외부 조인이 필요하다.

</details>


## 활용

- 쓰는 때: "모든 ~에 대해 …를 보여라, 없으면 빈칸이나 0으로"라는 말이 나오면 외부 조인이다. "…가 없는 ~"은 외부 조인에 `IS NULL`을 더한다.
- NULL로 채우는 쪽은 이름과 반대쪽이다. `LEFT`면 오른쪽 표의 열을, `RIGHT`면 왼쪽 표의 열을 채운다.
- 연습: [조인 질의 쓰기 예제 사다리](/Hongs_Blog/studies/database-design/join-query-ladder/), [JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/)

## 연결

- 선수: [FROM 절의 조인 (JOIN ON)](/Hongs_Blog/studies/database-design/sql-join-on/), [NULL 값과 IS NULL](/Hongs_Blog/studies/database-design/sql-null/)
- 헷갈리는 짝: [내부 조인과 외부 조인 비교](/Hongs_Blog/studies/database-design/inner-vs-outer-join/)
- 짝 없는 행을 찾는 다른 길: [EXISTS와 NOT EXISTS](/Hongs_Blog/studies/database-design/sql-exists/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"LEFT OUTER JOIN을 쓰면 왼쪽 표의 행은 마지막 결과에 반드시 남는다"</div>

틀렸다. 남는 것은 조인이 끝난 표까지다. 그 뒤의 `WHERE`가 다시 거른다. "모든 직원과, 있다면 그 배우자"를 구하려고 `EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn WHERE D.Relationship = 'Spouse'`라고 쓰면 3행(Smith–Elizabeth, Wong–Joy, Wallace–Abner)만 나온다. `LEFT`라고 적었으니 8명이 다 나올 것처럼 보이지만, 부양가족이 없는 직원의 행은 `D.Relationship`이 NULL이라 `WHERE`에서 참이 되지 못하고 버려진다. 조건을 `ON`으로 옮겨 `ON E.Ssn = D.Essn AND D.Relationship = 'Spouse'`로 쓰면 8행이 나온다. 배우자가 없는 다섯 명은 NULL로 채워진다. 확인하는 법: 결과의 행 수를 왼쪽 표의 행 수와 견준다. 오른쪽 표에 거는 조건은 "짝을 고르는 조건"이면 `ON`에, "결과 행을 버리는 조건"이면 `WHERE`에 둔다[^s2].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 내부 조인과 외부 조인의 차이를 쓰고, LEFT, RIGHT, FULL OUTER JOIN에서 각각 어느 표의 행이 모두 남는지 쓰라.</summary>

**답:** 내부 조인은 짝이 있는 행의 쌍만 낸다. 외부 조인은 짝이 없는 행도 내고, 짝 쪽 표의 열을 NULL로 채운다. LEFT는 왼쪽 표, RIGHT는 오른쪽 표, FULL은 양쪽 표의 행이 모두 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `FROM (EMPLOYEE AS E RIGHT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn)`의 결과는 몇 행인가? NULL로 채워지는 것은 어느 쪽 열이고, 그런 행은 누구의 행인가? 상사인 사람은 Wong(부하 3명), Wallace(2명), Borg(2명)뿐이다.</summary>

**답:** 12행. E 쪽 열이 NULL로 채워진다. 부하가 없는 Smith, Zelaya, Narayan, English, Jabbar의 행이다.<br>
**이유:** 짝이 있는 행은 3 + 2 + 2 = 7행이다. 오른쪽 표 S의 8명 가운데 상사가 아닌 5명은 짝이 없어 한 행씩 더해진다. 7 + 5 = 12다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 직원과 부양가족을 LEFT OUTER JOIN으로 잇고 직원마다 부양가족 수를 셀 때, `COUNT(*)` 대신 `COUNT(D.Essn)`을 써야 하는 까닭은?</summary>

**답:** 부양가족이 없는 직원도 NULL로 채운 한 줄이 결과에 있다. `COUNT(*)`는 줄을 세어 1을 내고, `COUNT(D.Essn)`은 NULL을 세지 않아 0을 낸다. 맞는 값은 0이다.<br>
**흔한 오답:** `COUNT(E.Ssn)`을 쓰는 것. 왼쪽 표의 열은 채운 줄에서도 값이 있어 `COUNT(*)`와 똑같이 1이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** (a) `… LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn AND D.Relationship = 'Spouse'` (b) `… LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn WHERE D.Relationship = 'Spouse'`. 각각 몇 행이고 무엇을 구하는가? 배우자가 있는 직원은 Smith, Wong, Wallace 셋이다.</summary>

**답:** (a) 8행. 모든 직원과, 있다면 그 배우자. 배우자가 없는 5명은 NULL로 채워진다. (b) 3행. 배우자가 있는 직원과 그 배우자.<br>
**이유:** (a)의 조건은 짝을 고를 때 쓰여서, 맞는 짝이 없는 직원도 남는다. (b)의 조건은 조인이 끝난 뒤에 쓰여서, NULL로 채운 행이 참이 되지 못하고 버려진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 벤 그림에서 "A에서 B와 겹친 곳을 뺀 부분"만 색칠된 그림을 질의로 옮겨라. A가 EMPLOYEE(키 Ssn), B가 DEPENDENT(잇는 열 Essn)일 때 결과는?</summary>

**답:** `SELECT E.Fname, E.Lname FROM EMPLOYEE AS E LEFT OUTER JOIN DEPENDENT AS D ON E.Ssn = D.Essn WHERE D.Essn IS NULL;` 결과는 Zelaya, Narayan, English, Jabbar, Borg.<br>
**이유:** A를 모두 남긴 뒤(LEFT) B에 짝이 없는 행만 고른다(`IS NULL`). 부양가족이 없는 직원 다섯 명이다.

</details>


[^s1]: 값은 SQLite와 PostgreSQL 16에서 실행해 확인했다.
[^s2]: 8행과 3행은 SQLite와 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
