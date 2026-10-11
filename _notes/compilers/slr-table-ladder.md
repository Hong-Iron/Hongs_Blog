---
layout: "note"
title: "SLR 파싱 표 예제 사다리"
display_title: "SLR 파싱 표 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "27"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: LR(0) 항목과 항목 오토마타의 상태 만들기, FOLLOW 집합, SLR 파싱 표의 두 단계."
prev_url: "/studies/compilers/ll1-table-ladder/"
prev_title: "LL(1) 파싱 표 예제 사다리"
next_url: "/studies/compilers/slr-parse-trace-practice/"
next_title: "SLR 파서 추적 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/slr-table-ladder/"
---
{% raw %}
사용 개념: [LR(0) 항목과 항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/)의 상태 만들기, [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/), [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)의 두 단계.

"이 문법의 SLR 파싱 표를 만들라"는 문제는 늘 같은 하위 목표를 거친다[^s1].

① 번호 붙이기: 덧붙인 규칙 $$S' \to S$$를 (1)로 넣고 규칙에 번호를 붙인다
② 상태 만들기: 상태 1은 $$S' \to .S$$에서 시작해 점 뒤 논터미널의 규칙을 연다. 상태마다 기호를 읽어 새 상태를 만든다
③ GOTO와 이동 옮기기: 논터미널 전이는 GOTO에, 터미널 전이는 `S`+상태로 ACTION에 적는다
④ FOLLOW 구하기: 점이 끝인 항목의 왼쪽 기호마다 구한다
⑤ 환원 적기: 점이 끝인 항목마다, 왼쪽 기호의 FOLLOW 칸에 `R(규칙 번호)`를 적는다
⑥ 충돌 확인: 한 칸에 둘이 들어갔는지 본다

상태 번호는 만들어진 차례로 붙인다. 한 상태에서는 논터미널을 먼저, 그다음 터미널을 표의 열 순서대로 읽는다. 항목은 다른 규칙에서 연 것(점이 맨 앞인 것)을 빼고 핵심만 적는다.

## 문제 1 · 완전한 풀이

문법: $$S \to (S) \mid a$$

1. *번호 붙이기:* (1) $$S' \to S$$, (2) $$S \to (S)$$, (3) $$S \to a$$.
2. *상태 만들기:* 상태 1은 $$S' \to .S$$이고, 점 뒤 `S`의 규칙 $$S \to .(S)$$, $$S \to .a$$를 연다.
    - 1에서 `S`: $$S' \to S.$$ → 상태 2
    - 1에서 `(`: $$S \to (.S)$$, 다시 $$S \to .(S)$$, $$S \to .a$$를 연다 → 상태 3
    - 1에서 `a`: $$S \to a.$$ → 상태 4
    - 3에서 `S`: $$S \to (S.)$$ → 상태 5. 3에서 `(`는 다시 3, `a`는 4
    - 5에서 `)`: $$S \to (S).$$ → 상태 6
3. *GOTO와 이동 옮기기:* GOTO(1, S) = 2, GOTO(3, S) = 5. 이동은 (1, `(`) = S3, (1, `a`) = S4, (3, `(`) = S3, (3, `a`) = S4, (5, `)`) = S6.
4. *FOLLOW 구하기:* Follow(S') = {`$`}. `S` 뒤에는 `)`가 오거나($$S \to (S)$$) 끝이 온다. Follow(S) = {`)`, `$`}.
5. *환원 적기:* 상태 2의 $$S' \to S.$$ → `$` 칸에 R(1). 상태 4의 $$S \to a.$$ → `)`, `$` 칸에 R(3). 상태 6의 $$S \to (S).$$ → `)`, `$` 칸에 R(2).
6. *충돌 확인:* 칸마다 하나뿐이다. SLR 문법이다.

| 상태 | `(` | `)` | `a` | `$` | S |
|---|---|---|---|---|---|
| 1 | S3 | | S4 | | 2 |
| 2 | | | | R(1) | |
| 3 | S3 | | S4 | | 5 |
| 4 | | R(3) | | R(3) | |
| 5 | | S6 | | | |
| 6 | | R(2) | | R(2) | |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [27_slr-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/27_slr-table-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위 목표만 빈칸

문법: $$S \to aS \mid b$$

1. *번호 붙이기:* (1) $$S' \to S$$, (2) $$S \to aS$$, (3) $$S \to b$$.
2. *상태 만들기:* 상태 1: $$S' \to .S$$, $$S \to .aS$$, $$S \to .b$$. 상태 2: $$S' \to S.$$ 상태 3(1에서 `a`): $$S \to a.S$$, $$S \to .aS$$, $$S \to .b$$. 상태 4(1에서 `b`): $$S \to b.$$ 상태 5(3에서 `S`): $$S \to aS.$$ 3에서 `a`는 다시 3, `b`는 4.
3. *GOTO와 이동 옮기기:* GOTO(1, S) = 2, GOTO(3, S) = 5. (1, `a`) = S3, (1, `b`) = S4, (3, `a`) = S3, (3, `b`) = S4.
4. *FOLLOW 구하기:* `S`는 $$S' \to S$$와 $$S \to aS$$의 맨 끝에만 나온다. Follow(S) = {`$`}.
5. *환원 적기와 충돌 확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

상태 2: `$` 칸에 R(1). 상태 4($$S \to b.$$): `$` 칸에 R(3). 상태 5($$S \to aS.$$): `$` 칸에 R(2). 환원은 모두 `$` 칸에만 들어간다. Follow(S)에 `a`와 `b`가 없기 때문이다. 충돌은 없다.

| 상태 | `a` | `b` | `$` | S |
|---|---|---|---|---|
| 1 | S3 | S4 | | 2 |
| 2 | | | R(1) | |
| 3 | S3 | S4 | | 5 |
| 4 | | | R(3) | |
| 5 | | | R(2) | |

</details>


## 문제 3 · 하위 목표 절반이 빈칸

문법: $$E \to E + T \mid T$$, $$T \to id$$ (왼쪽 기호가 오른쪽 맨 앞에 다시 나오는 문법)

1. *번호 붙이기:* (1) $$S' \to E$$, (2) $$E \to E + T$$, (3) $$E \to T$$, (4) $$T \to id$$.
2. *상태 만들기:* ______
3. *GOTO와 이동 옮기기:* GOTO(1, E) = 2, GOTO(1, T) = 3, GOTO(5, T) = 6. (1, `id`) = S4, (2, `+`) = S5, (5, `id`) = S4.
4. *FOLLOW 구하기:* ______
5. *환원 적기:* ______
6. *충돌 확인:* 상태 2에 $$S' \to E.$$과 $$E \to E.+T$$가 함께 있지만, 환원 R(1)은 `$` 칸에, 이동 S5는 `+` 칸에 들어가 겹치지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 상태 1: $$S' \to .E$$, $$E \to .E + T$$, $$E \to .T$$, $$T \to .id$$. 상태 2(1에서 `E`): $$S' \to E.$$, $$E \to E.+T$$. 상태 3(1에서 `T`): $$E \to T.$$ 상태 4(1에서 `id`): $$T \to id.$$ 상태 5(2에서 `+`): $$E \to E+.T$$, $$T \to .id$$. 상태 6(5에서 `T`): $$E \to E + T.$$ 5에서 `id`는 4.
4. `E` 뒤에는 `+`($$E \to E + T$$)나 끝이 온다: Follow(E) = {`+`, `$`}. `T`는 `E`의 규칙 맨 끝에 오므로 Follow(T) = Follow(E) = {`+`, `$`}.
5. 상태 2: `$`에 R(1). 상태 3: `+`, `$`에 R(3). 상태 4: `+`, `$`에 R(4). 상태 6: `+`, `$`에 R(2).

| 상태 | `+` | `id` | `$` | E | T |
|---|---|---|---|---|---|
| 1 | | S4 | | 2 | 3 |
| 2 | S5 | | R(1) | | |
| 3 | R(3) | | R(3) | | |
| 4 | R(4) | | R(4) | | |
| 5 | | S4 | | | 6 |
| 6 | R(2) | | R(2) | | |

이 문법은 위에서 내려오는 파서가 못 쓰는 꼴인데 SLR 표에는 충돌이 없다([LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [27_slr-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/27_slr-table-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

문법 $$E \to T + E \mid T$$, $$T \to id$$의 SLR 파싱 표를 만들라. (a) FOLLOW를 쓰지 않고 점이 끝인 항목의 환원을 그 줄의 모든 칸에 적으면 어느 칸에서 충돌이 나는가? (b) FOLLOW를 쓰면 왜 풀리는가? (c) `id + id + id`를 파싱할 때 스택이 가장 깊을 때의 깊이를 문제 3의 문법과 견주라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

번호: (1) $$S' \to E$$, (2) $$E \to T + E$$, (3) $$E \to T$$, (4) $$T \to id$$.<br>
상태 1: $$S' \to .E$$, $$E \to .T + E$$, $$E \to .T$$, $$T \to .id$$. 상태 2(1에서 `E`): $$S' \to E.$$ 상태 3(1에서 `T`): $$E \to T.+E$$, $$E \to T.$$ 상태 4(1에서 `id`): $$T \to id.$$ 상태 5(3에서 `+`): $$E \to T+.E$$, $$E \to .T + E$$, $$E \to .T$$, $$T \to .id$$. 상태 6(5에서 `E`): $$E \to T + E.$$ 5에서 `T`는 3, `id`는 4.<br>
Follow(E) = {`$`}(`E`는 규칙의 맨 끝에만 온다). Follow(T) = {`+`, `$`}.

| 상태 | `+` | `id` | `$` | E | T |
|---|---|---|---|---|---|
| 1 | | S4 | | 2 | 3 |
| 2 | | | R(1) | | |
| 3 | S5 | | R(3) | | |
| 4 | R(4) | | R(4) | | |
| 5 | | S4 | | 6 | 3 |
| 6 | | | R(2) | | |

(a) 상태 3의 `+` 칸. 이동 S5와 환원 R(3)이 겹친다. 충돌은 이 한 칸뿐이다.<br>
(b) R(3)은 $$E \to T$$이고 Follow(E) = {`$`}에 `+`가 없다. R(3)은 `$` 칸에만 들어가고 `+` 칸에는 S5만 남는다. `T` 뒤에 `+`가 보이면 아직 `E`가 끝난 것이 아니니 더 읽는다는 뜻이다.<br>
(c) 이 문법에서는 스택이 6칸까지 쌓인다. 오른쪽 끝의 `E`가 묶여야 그 왼쪽이 묶이므로 입력을 끝까지 읽어 쌓은 뒤에야 줄기 시작한다. 문제 3의 문법에서는 `id + id`를 읽자마자 `E`로 묶으므로 가장 깊을 때도 4칸이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [27_slr-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/27_slr-table-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 네 문법과 표는 원본에 없다. 8회 슬라이드 p.7~11의 만드는 순서를 연습하도록 만들었고, 상태, FOLLOW, 표의 모든 칸과 스택 깊이를 문제 코드로 확인했다.
{% endraw %}
