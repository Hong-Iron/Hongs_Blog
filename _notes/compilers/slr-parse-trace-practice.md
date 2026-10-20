---
layout: "note"
title: "SLR 파서 추적 연습"
display_title: "SLR 파서 추적 연습"
kind: "practice"
kind_label: "연습"
num: "28"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: SLR 파서의 스택 동작, SLR 파싱 표."
prev_url: "/studies/compilers/slr-table-ladder/"
prev_title: "SLR 파싱 표 예제 사다리"
next_url: "/studies/compilers/type-checking-practice/"
next_title: "타입 검사 연습"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "28_slr-parse-trace-practice_p4.py", "u": "/studies/compilers/code/28_slr-parse-trace-practice_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/compilers/slr-parse-trace-practice/"
---
{% raw %}
사용 개념: [SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/), [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/).

네 문제 모두 [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)의 문법과 표를 쓴다. 규칙은 (1) $$S' \to E$$, (2) $$E \to T * E$$, (3) $$E \to T$$, (4) $$T \to (E)$$, (5) $$T \to id$$다.

| 상태 | `*` | `(` | `)` | `id` | `$` | E | T |
|---|---|---|---|---|---|---|---|
| 1 | | S4 | | S5 | | 2 | 3 |
| 2 | | | | | R(1) | | |
| 3 | S6 | | R(3) | | R(3) | | |
| 4 | | S4 | | S5 | | 7 | 3 |
| 5 | R(5) | | R(5) | | R(5) | | |
| 6 | | S4 | | S5 | | 8 | 3 |
| 7 | | | S9 | | | | |
| 8 | | | R(2) | | R(2) | | |
| 9 | R(4) | | R(4) | | R(4) | | |

**풀이 전략.** 줄마다 세 가지만 본다. 스택의 맨 위 상태, 다음 토큰, 그 둘이 만나는 칸. 칸이 `S j`면 $$j$$를 넣고 토큰을 넘긴다. `R(k)`면 규칙 $$k$$의 오른쪽 기호 수만큼 꺼내고, 드러난 상태와 규칙의 왼쪽 기호로 GOTO를 찾아 넣는다. 토큰은 넘기지 않는다. 빈칸이면 오류다[^s1].

## p1 · `( id ) $`

입력 `( id ) $`를 추적하라. 줄마다 스택, 남은 입력, 한 일을 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 스택 | 남은 입력 | 칸 | 한 일 |
|---|---|---|---|
| 1 | `( id ) $` | S4 | 4를 넣는다 |
| 1 4 | `id ) $` | S5 | 5를 넣는다 |
| 1 4 5 | `) $` | R(5) | 1개 꺼냄, GOTO(4, T) = 3 |
| 1 4 3 | `) $` | R(3) | 1개 꺼냄, GOTO(4, E) = 7 |
| 1 4 7 | `) $` | S9 | 9를 넣는다 |
| 1 4 7 9 | `$` | R(4) | 3개 꺼냄, GOTO(1, T) = 3 |
| 1 3 | `$` | R(3) | 1개 꺼냄, GOTO(1, E) = 2 |
| 1 2 | `$` | R(1) | 받아들임 |

*검증:* 이동 3번(토큰 3개), 환원 4번에 받아들임. R(4)에서 9, 7, 4 셋을 꺼내는 것이 요점이다. $$T \to (E)$$의 오른쪽이 기호 3개다.

</details>


## p2 · `id * ( id ) $`

입력 `id * ( id ) $`를 추적하고, 이동과 환원이 각각 몇 번인지 세라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 스택 | 남은 입력 | 칸 | 한 일 |
|---|---|---|---|
| 1 | `id * ( id ) $` | S5 | |
| 1 5 | `* ( id ) $` | R(5) | GOTO(1, T) = 3 |
| 1 3 | `* ( id ) $` | S6 | |
| 1 3 6 | `( id ) $` | S4 | |
| 1 3 6 4 | `id ) $` | S5 | |
| 1 3 6 4 5 | `) $` | R(5) | GOTO(4, T) = 3 |
| 1 3 6 4 3 | `) $` | R(3) | GOTO(4, E) = 7 |
| 1 3 6 4 7 | `) $` | S9 | |
| 1 3 6 4 7 9 | `$` | R(4) | 3개 꺼냄, GOTO(6, T) = 3 |
| 1 3 6 3 | `$` | R(3) | GOTO(6, E) = 8 |
| 1 3 6 8 | `$` | R(2) | 3개 꺼냄, GOTO(1, E) = 2 |
| 1 2 | `$` | R(1) | 받아들임 |

이동 5번(토큰 5개), 환원 6번(받아들이는 R(1)은 빼고 셈).<br>
같은 R(3)인데 일곱째 줄은 GOTO(4, E) = 7로, 열째 줄은 GOTO(6, E) = 8로 간다. 꺼낸 뒤 드러난 상태가 달라서다.

</details>


## p3 · 오류가 나는 입력

다음 세 입력은 문법에 맞지 않는다. 각각 스택이 어떤 상태이고 다음 토큰이 무엇일 때 오류가 나는가? (가) `id * * id $` (나) `( id $` (다) `id ) $`

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

(가) 스택 1 3 6, 다음 토큰 `*`. (6, `*`)가 빈칸이다. `*` 뒤에는 `(`나 `id`가 와야 한다.<br>
(나) 스택 1 4 7, 다음 토큰 `$`. `id`를 `T`로, `T`를 `E`로 환원한 뒤 상태 7에서 닫는 괄호를 기다리는데 `$`가 왔다.<br>
(다) 스택 1 2, 다음 토큰 `)`. (5, `)`)는 R(5), (3, `)`)는 R(3)이라 환원을 두 번 한 뒤에야 (2, `)`)의 빈칸을 만난다.

(다)가 말해 주는 것: SLR 파서는 틀린 토큰을 보고도 환원을 몇 번 더 할 수 있다. `)`가 Follow(T)와 Follow(E)에 들어 있어 "문법 어딘가에서는" `T`나 `E` 뒤에 올 수 있기 때문이다. 그래도 틀린 토큰을 **이동**하지는 않는다.

</details>


## p4 · 스택 깊이

`id * id * id $`를 추적하고 스택이 가장 깊을 때의 칸 수를 구하라. `id`가 $$k$$개인 `id * id * … * id`에서는 몇 칸까지 쌓이는가? 왜 그런가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 스택 | 남은 입력 | 칸 |
|---|---|---|
| 1 | `id * id * id $` | S5 |
| 1 5 | `* id * id $` | R(5) |
| 1 3 | `* id * id $` | S6 |
| 1 3 6 | `id * id $` | S5 |
| 1 3 6 5 | `* id $` | R(5) |
| 1 3 6 3 | `* id $` | S6 |
| 1 3 6 3 6 | `id $` | S5 |
| 1 3 6 3 6 5 | `$` | R(5) |
| 1 3 6 3 6 3 | `$` | R(3) |
| 1 3 6 3 6 8 | `$` | R(2) |
| 1 3 6 8 | `$` | R(2) |
| 1 2 | `$` | R(1), 받아들임 |

가장 깊을 때 6칸이다. `id`가 $$k$$개면 $$2k$$칸까지 쌓인다. 이동은 $$2k - 1$$번, 환원은 $$2k$$번이다.<br>
까닭: 규칙 $$E \to T * E$$는 오른쪽 끝에 `E`가 있다. 맨 오른쪽 `E`가 만들어져야 그 왼쪽의 `T * E`를 묶을 수 있으므로, `T *`를 계속 쌓으며 입력 끝까지 간 뒤 뒤에서부터 차례로 묶는다. `T` 뒤에 `*`가 보이는 동안은 (3, `*`) = S6이라 환원하지 않는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 스택, 남은 입력, 한 일, 오류 자리, $$k = 1 \ldots 8$$에서 깊이 $$2k$$와 이동·환원 횟수 — [28_slr-parse-trace-practice_p4.py](/Hongs_Blog/studies/compilers/code/28_slr-parse-trace-practice_p4/)</div>

</div>


## 변형 문제

- p1을 `( ( id ) ) $`로 바꿔 추적하라. R(4)가 두 번 나오고, 그때마다 GOTO를 찾는 상태가 다르다.
- p4의 문법을 $$E \to E * T \mid T$$로 바꾸면 스택 깊이가 어떻게 달라질지 [SLR 파싱 표 예제 사다리](/Hongs_Blog/studies/compilers/slr-table-ladder/)의 문제 3, 4로 미루어 말하라.

[^s1]: 모든 줄을 문제 코드로 확인했다.
{% endraw %}
