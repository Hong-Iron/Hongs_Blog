---
layout: "note"
title: "INSERT·DELETE·UPDATE"
display_title: "INSERT·DELETE·UPDATE"
kind: "concept"
kind_label: "정의"
num: "51"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["INSERT", "DELETE", "UPDATE", "INSERT INTO", "DELETE FROM", "삽입", "삭제", "수정", "갱신 명령", "Update Commands", "Basic Update Queries"]
description: "표의 내용을 바꾸는 세 문장으로, 새 행을 넣고, 조건에 맞는 행을 지우고, 조건에 맞는 행의 값을 고친다. 장부에 한 줄을 새로 적고, 어떤 줄에 줄을 긋고, 어떤 줄의 숫자를 고쳐 적는 일과 같다. 지우기와 고치기는 조건에 맞는 모든 행에 한꺼번에 일어나서, 조건을 잘못 적으면…"
prev_url: "/studies/database-design/select-from-where/"
prev_title: "SELECT-FROM-WHERE"
next_url: "/studies/database-design/update-constraint-violations/"
next_title: "갱신 연산과 제약 위반"
math: false
mermaid: false
code_count: 1
permalink: "/studies/database-design/sql-insert-delete-update/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표의 내용을 바꾸는 세 문장으로, 새 행을 넣고, 조건에 맞는 행을 지우고, 조건에 맞는 행의 값을 고친다. 장부에 한 줄을 새로 적고, 어떤 줄에 줄을 긋고, 어떤 줄의 숫자를 고쳐 적는 일과 같다. 지우기와 고치기는 조건에 맞는 모든 행에 한꺼번에 일어나서, 조건을 잘못 적으면 엉뚱한 행까지 바뀐다. 표에 걸어 둔 규칙을 어기는 변경은 통째로 거부된다.

</div>


## 예시로 보기

`SELECT`는 표를 읽기만 한다. 새 직원이 들어오고, 누가 떠나고, 프로젝트가 자리를 옮기면 표의 행을 바꿔야 한다. 그 일을 하는 문장이 셋 있다[^1].

```sql
INSERT INTO EMPLOYEE
VALUES      ('Richard', 'K', 'Marini', '653298653', '1962-12-30',
             '98 Oak Forest, Katy, TX', 'M', 37000, '653298653', 4);

DELETE FROM EMPLOYEE
WHERE       Lname = 'Brown';

UPDATE      PROJECT
SET         Plocation = 'Bellaire', Dnum = 5
WHERE       Pnumber = 10;
```

[COMPANY의 상태](/Hongs_Blog/studies/database-design/relational-database-schema/)에 차례로 돌리면 이렇게 된다.

| 문장 | 일어나는 일 |
|---|---|
| `INSERT` | EMPLOYEE가 8행에서 9행이 된다 |
| `DELETE` | 한 행도 안 지워진다. 성이 Brown인 직원이 없다. 오류도 아니다 |
| `UPDATE` | 10번 프로젝트의 행 (Computerization, 10, Stafford, 4)가 (Computerization, 10, Bellaire, 5)가 된다 |

새로 넣은 Marini의 행은 상사 번호(아홉째 값)가 자기 Ssn과 같다. 자기 자신을 가리키는 값도 "직원 표에 있는 Ssn"이기는 해서 제약에는 걸리지 않는다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 세 문장의 결과, 열 이름을 골라 적는 `INSERT`, 슬라이드의 빨간 물음 셋의 답, 확인 문제의 답 — [51_sql-insert-delete-update_verify.py](/Hongs_Blog/studies/database-design/code/51_sql-insert-delete-update_verify/)</div>

</div>


## 정의

SQL에서 데이터베이스를 바꾸는 명령은 셋이다[^1].

- **`INSERT`:** 릴레이션에 튜플 하나를 더한다.
- **`DELETE`:** 릴레이션에서 튜플들을 뺀다.
- **`UPDATE`:** 고른 튜플 하나 이상의 속성 값을 고친다.

**`INSERT INTO 표 VALUES (값, …)`.** 표 이름과 값의 목록을 적는다. 쓰는 꼴이 둘이다[^2].

1. *모든 속성의 값을 적는 꼴.* 값을 `CREATE TABLE`에 속성을 적은 순서 그대로 늘어놓는다. 위 예의 열 개 값은 Fname, Minit, Lname, Ssn, Bdate, Address, Sex, Salary, Super_ssn, Dno 순서다.
2. *몇몇 속성의 값만 적는 꼴.* 표 이름 뒤에 속성 이름을 적고, 그 순서대로 값을 적는다. 안 적은 속성에는 기본값이 들어가고, 기본값이 없으면 NULL이 들어간다.

```sql
INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn)
VALUES      ('Richard', 'Marini', 4, '653298653');
```

이 문장으로 생긴 행은 Minit, Bdate, Address, Sex, Salary, Super_ssn 여섯 칸이 NULL이다.

**`DELETE FROM 표 WHERE 조건`.** 조건이 참인 튜플을 모두 지운다. 맞는 튜플이 없으면 아무것도 지우지 않는다.

**`UPDATE 표 SET 속성 = 값, … WHERE 조건`.** 조건이 참인 튜플마다 `SET`에 적힌 속성의 값을 바꾼다. 행의 수는 변하지 않는다.

`DELETE`와 `UPDATE`의 `WHERE`는 `SELECT`의 `WHERE`와 같은 조건식이다([SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)).

### 슬라이드의 물음 셋

세 명령을 소개하는 쪽마다 빨간 글씨의 물음이 하나씩 있다. 답은 모두 "표에 걸어 둔 제약을 어겨서 거부된다"다[^s1].

| 물음 | 답 |
|---|---|
| `INSERT INTO EMPLOYEE (Fname, Lname, Ssn, Dno) VALUES ('Robert', 'Hatcher', '980760540', 2);`에서 Dnumber가 2인 부서가 없으면?[^2] | Dno는 DEPARTMENT를 가리키는 외래 키다. 가리킬 2번 부서가 없으므로 참조 무결성을 어긴다. 거부된다 |
| `DELETE FROM EMPLOYEE WHERE Ssn = '123456789';`로 이 행을 지워도 안전한가?[^3] | 안전하지 않다. 이 직원(Smith)을 WORKS_ON의 두 행과 DEPENDENT의 세 행이 가리킨다. 지우면 그 다섯 행이 없는 직원을 가리키게 되어 참조 무결성을 어긴다. 거부된다 |
| 기본 키나 외래 키의 값을 고치면?[^4] | 외래 키를 없는 값으로 고치면 참조 무결성을 어긴다(`Dnum = 7`). 기본 키를 이미 있는 값으로 고치면 키 제약을 어긴다(`Pnumber = 20`). 기본 키를 새 값으로 고쳐도, 옛 값을 가리키던 행이 있으면 참조 무결성을 어긴다 |

어떤 명령이 어떤 제약을 어길 수 있는지 가려내는 법은 [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)에 있다.

## 예제

**값의 순서를 틀리면.** 값을 다 적는 꼴에서 이름과 성의 자리를 바꿔 `('Marini', 'K', 'Richard', …)`라고 넣어도 DBMS는 막지 않는다. 두 칸 모두 `VARCHAR(15)`라 꼴이 맞기 때문이다. Fname이 Marini인 행이 조용히 생긴다. 열 이름을 적는 꼴은 어느 값이 어느 칸에 가는지 문장에 보여서 이런 실수가 줄어든다[^s1].

**값의 개수가 안 맞으면.** `INSERT INTO PROJECT VALUES ('ProductW', 40, 5);`는 오류다. PROJECT는 칸이 넷인데 값이 셋이다.

**여러 행을 한 번에 고치기.** 조건에 맞는 행이 여럿이면 모두 고쳐진다[^s1].

```sql
UPDATE EMPLOYEE
SET    Salary = Salary * 1.1
WHERE  Dno = 5;
```

5번 부서 네 명의 월급이 10%씩 오른다. Smith 30000 → 33000, Wong 40000 → 44000, Narayan 38000 → 41800, English 25000 → 27500. `SET`의 오른쪽에 그 행의 옛 값을 써서 새 값을 계산했다.

## 활용

- **`WHERE`를 빠뜨리면 모든 행이다.** `DELETE FROM DEPENDENT;`는 일곱 행을 모두 지운다. 표는 빈 채로 남는다. `UPDATE`도 `WHERE`가 없으면 모든 행을 고친다. 지우거나 고치기 전에 같은 `WHERE`로 `SELECT`를 먼저 돌려 어떤 행이 걸리는지 보면 안전하다[^s1].
- **행을 다 지우는 것과 표를 없애는 것은 다르다.** `DELETE`는 틀을 남긴다. 틀까지 없애는 문장은 `DROP TABLE`이다: [DROP 명령과 CASCADE·RESTRICT](/Hongs_Blog/studies/database-design/sql-drop/).
- **틀은 안 바뀐다.** 세 명령은 표의 [상태](/Hongs_Blog/studies/database-design/schema-and-instance/)만 바꾼다. 칸을 더하거나 빼려면 [ALTER TABLE](/Hongs_Blog/studies/database-design/sql-alter-table/)을 쓴다.

## 연결

- 선수: [CREATE SCHEMA와 CREATE TABLE](/Hongs_Blog/studies/database-design/sql-create-table/), [속성 제약 NOT NULL·DEFAULT·CHECK](/Hongs_Blog/studies/database-design/sql-attribute-constraints/)(안 적은 칸에 들어가는 기본값), [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/)(`WHERE` 조건)
- 가리킴 받는 행을 지우거나 고칠 때 거부 말고 할 수 있는 일: [참조 동작 SET NULL·CASCADE·SET DEFAULT](/Hongs_Blog/studies/database-design/referential-triggered-actions/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** DEPENDENT에는 일곱 행이 있다. 관계(Relationship)는 Daughter 2, Son 2, Spouse 3이다. 다음 세 문장을 차례로 돌린 뒤 DEPENDENT는 몇 행이고 관계별로 몇 행씩인가? ① `INSERT INTO DEPENDENT VALUES ('453453453', 'John', 'M', '1990-12-12', 'Spouse');` ② `DELETE FROM DEPENDENT WHERE Relationship = 'Son';` ③ `UPDATE DEPENDENT SET Relationship = 'Child' WHERE Relationship = 'Daughter';`</summary>

**답:** 6행이다. Child 2행, Spouse 4행이다.<br>
**이유:** ①로 8행이 되고 Spouse가 4가 된다. ②는 조건에 맞는 두 행을 모두 지워 6행이 된다. ③은 행 수를 바꾸지 않고 Daughter 두 행의 값만 Child로 고친다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `INSERT INTO PROJECT VALUES ('ProductW', 40, 5);`는 왜 오류인가? 프로젝트의 위치를 아직 모를 때 이 행을 넣는 문장을 쓰라.</summary>

**답:** PROJECT는 (Pname, Pnumber, Plocation, Dnum) 네 칸인데 값이 셋이라서다. 열 이름을 적어 `INSERT INTO PROJECT (Pname, Pnumber, Dnum) VALUES ('ProductW', 40, 5);`로 쓴다. Plocation은 NULL이 된다.<br>
**이유:** 열 이름을 안 적으면 값을 모든 칸에 순서대로 다 줘야 한다. 일부만 줄 때는 어느 칸의 값인지 이름으로 밝힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `DELETE FROM EMPLOYEE WHERE Lname = 'Brown';`은 Brown이 없는데도 왜 오류가 아닌가?</summary>

**답:** `DELETE`는 "조건이 참인 행을 모두 지워라"는 문장이다. 그런 행이 0개면 0개를 지우고 끝난다. "Brown을 찾아서 지워라"가 아니다.<br>
**이유:** `SELECT`가 맞는 행이 없을 때 빈 표를 돌려주는 것과 같다. 조건은 행을 고르는 데만 쓰이고, 고른 행이 몇 개인지는 문장이 올바른지와 상관없다.

</details>


[^1]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.23 (Basic Update Queries in SQL, 세 명령과 예). 데이터베이스 설계 10회 강의 자료 「10_SQL-DDL」, p.6
[^2]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.24 (INSERT command, 두 꼴, "What if no DEPARTMENT tuple with 'Dnumber'=2 exist?")
[^3]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.26 (DELETE command, "Is it safe to delete this tuple with Ssn='123456789'")
[^4]: 데이터베이스 설계 9회 강의 자료 「9_introduction-to-basic-SQL」, p.28 (UPDATE command, "What if we modify the primary or foreign keys values?")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 빨간 물음 셋의 답은 슬라이드의 그 쪽에는 없다(다음 쪽들의 예와 연습 풀이가 같은 내용을 보인다). Marini 행의 상사 번호가 자기 번호라는 설명, 값의 순서를 틀린 예, 값의 개수가 안 맞는 예, 여러 행을 고치는 `UPDATE` 예, `WHERE`를 빠뜨린 `DELETE`, 확인 문제는 슬라이드에 없다. 모두 SQLite 3.50에서 실행해 확인했다.
{% endraw %}
