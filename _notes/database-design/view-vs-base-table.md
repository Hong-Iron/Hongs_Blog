---
layout: "note"
title: "뷰와 기본 테이블 비교"
display_title: "뷰와 기본 테이블 비교"
kind: "concept"
kind_label: "비교"
num: "78"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["View vs Base Table", "뷰와 테이블의 차이", "가상 테이블과 기본 테이블"]
description: "둘 다 SELECT … FROM 뒤에 이름을 쓰면 행이 나온다. 질의를 쓰는 사람 눈에는 똑같은 표다. 가르는 질문은 \"그 행이 저장돼 있는가, 물을 때마다 계산되는가\"다. 이 답이 자리를 차지하는지, 고칠 수 있는지, 지웠을 때 무엇이 없어지는지를 함께 정한다."
prev_url: "/studies/database-design/view-update-problem/"
prev_title: "뷰 갱신 문제"
math: false
mermaid: false
code_count: 0
permalink: "/studies/database-design/view-vs-base-table/"
---
{% raw %}
둘 다 `SELECT … FROM` 뒤에 이름을 쓰면 행이 나온다. 질의를 쓰는 사람 눈에는 똑같은 표다. 가르는 질문은 "그 행이 저장돼 있는가, 물을 때마다 계산되는가"다. 이 답이 자리를 차지하는지, 고칠 수 있는지, 지웠을 때 무엇이 없어지는지를 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 새로 뽑은 직원의 이름, 급여, 부서를 처음 적어 넣을 곳이 필요하다. (b) 세 표를 잇는 같은 조인을 여러 프로그램이 매일 쓴다. (c) 인턴에게 직원의 이름과 주소만 보여 주고 급여는 감추려 한다. 각각 기본 테이블과 뷰 가운데 무엇을 만드는가?</summary>

**답:** (a) 기본 테이블. 데이터가 처음 저장되는 곳은 기본 테이블뿐이다. 뷰는 이미 있는 표에서 끌어낸 것이라 뷰만으로는 아무것도 담을 수 없다. (b) 뷰. 조인을 한 번 적어 이름을 붙여 두면 질의마다 다시 쓰지 않는다. (c) 뷰. 이름과 주소 열만 고른 뷰를 만들고 그 뷰를 볼 권한만 준다.<br>
**이유:** (b)와 (c)에서 기본 테이블을 하나 더 만들어 내용을 복사해 두면, 원래 표가 바뀔 때마다 복사본도 고쳐야 한다. 뷰는 늘 최신이라 그 일이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `WORKS_ON1`은 EMPLOYEE, PROJECT, WORKS_ON을 이은 뷰다. (a) `DROP VIEW WORKS_ON1`을 실행하면 무엇이 없어지는가? (b) 뷰가 있는 채로 `DROP TABLE WORKS_ON`을 실행하면?</summary>

**답:** (a) 뷰의 정의만 없어진다. 세 기본 테이블의 행은 그대로다. (b) 뷰가 기대던 표가 없어지므로 뷰가 쓸모없어진다. PostgreSQL 16은 이 문장을 거부하고, `CASCADE`를 붙이면 표와 함께 뷰까지 지운다. SQLite는 표를 지우고, 남은 뷰는 질의할 때 오류를 낸다.<br>
**이유:** 뷰는 기본 테이블에 기대지만 기본 테이블은 뷰에 기대지 않는다. 그래서 지우는 방향에 따라 결과가 다르다[^s1].

</details>


## 결정적 차이

| | 기본 테이블 | 뷰 |
|---|---|---|
| 만드는 문장 | `CREATE TABLE` | `CREATE VIEW … AS SELECT …` |
| 저장되는 것 | 튜플 | 정의(질의)뿐. 추가 저장 자리가 없다 |
| 내용이 정해지는 때 | 넣고 고치고 지울 때 | 물을 때. 정의 테이블이 바뀌면 저절로 따라 바뀐다 |
| 검색 | 된다 | 된다. 똑같이 쓴다 |
| 갱신 | 제약만 지키면 된다 | 많은 경우 안 된다. 표 하나에 집계 없는 뷰만 조건부로 된다 |
| 지웠을 때 | 행이 없어진다. 기대던 뷰가 깨진다 | 정의만 없어진다. 정의 테이블은 그대로다 |

표는 슬라이드의 설명을 한자리에 모은 것이다[^1]. 선택을 가르는 줄은 "저장되는 것"과 "갱신"이다. 처음 저장할 곳이거나 마음대로 고쳐야 하면 기본 테이블이고, 이미 있는 데이터를 다른 모양으로 보여 주기만 하면 뷰다.

두 제품에서 저장 여부를 직접 볼 수 있다. SQLite의 카탈로그에서 기본 테이블 WORKS_ON은 저장 자리 번호가 있고 뷰 WORKS_ON1은 0이다. PostgreSQL 16에서 보통 뷰가 차지한 크기는 0바이트다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 저장 자리, 늘 최신, DROP VIEW와 DROP TABLE — [75_sql-view_verify.py](/Hongs_Blog/studies/database-design/code/75_sql-view_verify/), [75_sql-view_verify.sql](/Hongs_Blog/studies/database-design/code/75_sql-view_verify-sql/). 갱신 — [77_view-update-problem_verify.sql](/Hongs_Blog/studies/database-design/code/77_view-update-problem_verify-sql/). 실체화된 뷰 — [76_view-implementation_verify.sql](/Hongs_Blog/studies/database-design/code/76_view-implementation_verify-sql/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 조인과 집계가 든 무거운 질의의 결과를 1초에도 여러 번 읽어야 한다. 원래 표는 가끔만 바뀐다. 기본 테이블에 복사해 두면 낡고, 뷰로 두면 읽을 때마다 다시 계산한다. 무엇을 쓰는가? 그것은 기본 테이블, 뷰와 각각 어디가 같고 다른가?</summary>

**답:** 실체화된 뷰를 쓴다. 정의는 뷰처럼 질의로 적고, 결과는 기본 테이블처럼 실제로 저장한다. 저장하므로 자리를 차지하고 빨리 읽힌다. 대신 원래 표가 바뀌면 저장한 결과를 고쳐야 하고, 고치기 전에는 낡은 답을 낸다. 사용자가 그 행을 직접 고칠 수는 없다.<br>
**이유:** PostgreSQL 16에서 `CREATE MATERIALIZED VIEW`로 만든 것은 저장 크기가 0보다 크고, 원래 표를 고친 뒤 `REFRESH MATERIALIZED VIEW`를 하기 전까지 옛 답을 냈다. 직접 `UPDATE`하면 "cannot change materialized view"로 거부되었다. 고치는 때를 정하는 세 방식은 [질의 수정과 뷰 실체화](/Hongs_Blog/studies/database-design/view-implementation/)에 있다[^2][^s1].

</details>


[^1]: 데이터베이스 설계 13회 강의 자료 「13-View」, p.3 (뷰는 끌어낸 가상 테이블, 기본 테이블은 튜플이 늘 저장돼 있다, 뷰는 갱신이 제한되고 검색은 제한이 없다), p.8 (늘 최신), p.14 (DROP VIEW는 정의 테이블에 영향이 없다), p.17~18 (뷰 갱신)
[^2]: 같은 자료, p.11 (View Materialization: 임시 표를 실제로 만들어 둔다, 추가 저장 자리가 든다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 세 카드의 상황, 뷰가 기대는 표를 지울 때의 제품별 동작, 저장 자리와 크기, 실체화된 뷰를 직접 고칠 수 없다는 것은 슬라이드에 없다. SQLite 3.50.4와 PostgreSQL 16에서 실행해 확인했다.
{% endraw %}
