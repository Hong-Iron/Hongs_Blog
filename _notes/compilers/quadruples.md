---
layout: "note"
title: "쿼드러플"
display_title: "쿼드러플 (Quadruples)"
kind: "concept"
kind_label: "자료구조"
num: "38"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Quadruples", "Quadruple", "4-튜플", "사중쌍", "op arg1 arg2 result"]
description: "서류 양식에 \"무엇을 / 누구와 / 누구로 / 결과는 어디에\" 네 칸이 인쇄되어 있고, 명령 하나마다 양식 한 장을 채우는 것과 같다. 한 번에 계산 하나씩만 하도록 풀어 쓴 코드의 한 줄을 이렇게 칸 네 개짜리 기록으로 담고, 기록들을 실행 순서대로 줄줄이 이어 둔다. 모든 줄이…"
prev_url: "/studies/compilers/three-address-code/"
prev_title: "3주소 코드"
next_url: "/studies/compilers/ast-to-tac/"
next_title: "AST에서 3주소 코드 만들기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/quadruples/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

서류 양식에 "무엇을 / 누구와 / 누구로 / 결과는 어디에" 네 칸이 인쇄되어 있고, 명령 하나마다 양식 한 장을 채우는 것과 같다. 한 번에 계산 하나씩만 하도록 풀어 쓴 코드의 한 줄을 이렇게 칸 네 개짜리 기록으로 담고, 기록들을 실행 순서대로 줄줄이 이어 둔다. 모든 줄이 같은 모양이라 프로그램으로 다루기 쉽고, 중간에 줄을 끼우거나 빼기도 쉽다. 대신 칸을 다 쓰지 않는 줄이 많아 빈칸이 생기고, 어느 칸에 무엇을 넣는지는 명령 종류마다 외워야 한다.

</div>


## 예시로 보기

[3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)를 `t1 = b * t0` 같은 글자로만 들고 있으면, 컴파일러가 그 줄을 볼 때마다 글자를 다시 쪼개 읽어야 한다. 미리 칸으로 나눠 담아 두면 "연산자 칸이 `*`인가", "결과 칸이 `t1`인가"를 바로 물을 수 있다.

다음 다섯 줄을 담는다[^1].

```
t0 = -a
t1 = b * t0
t2 = b * t1
t3 = t1 + t2
c = t3
```

```
HEAD
 │
 ▼
┌─────┬────┬────┬────┐   ┌─────┬────┬────┬────┐
│  -  │ a  │    │ t0 │──▶│  *  │ b  │ t0 │ t1 │──┐
└─────┴────┴────┴────┘   └─────┴────┴────┴────┘  │
 ┌───────────────────────────────────────────────┘
 ▼
┌─────┬────┬────┬────┐   ┌─────┬────┬────┬────┐
│  *  │ b  │ t1 │ t2 │──▶│  +  │ t1 │ t2 │ t3 │──┐
└─────┴────┴────┴────┘   └─────┴────┴────┴────┘  │
 ┌───────────────────────────────────────────────┘
 ▼
┌─────┬────┬────┬────┐
│copy │ t3 │    │ c  │
└─────┴────┴────┴────┘
  op   arg1 arg2 result
```

한 줄이 네 칸짜리 기록 하나다. 첫 줄 `t0 = -a`는 피연산자가 하나뿐이라 셋째 칸이 비었다. 마지막 줄 `c = t3`도 그렇다. `HEAD`가 첫 기록을 가리키고, 기록마다 다음 기록을 가리킨다.

a = 2, b = 3으로 차례대로 실행하면 t0 = −2, t1 = −6, t2 = −18, t3 = −24, c = −24다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 표 12줄을 3주소 코드에서 쿼드러플로 바꾼 결과, 위 다섯 줄의 리스트와 실행값(a, b가 −4~4), 같은 `-`가 arg2 유무로 단항·이항으로 갈림 — [38_quadruples_verify.py](/Hongs_Blog/studies/compilers/code/38_quadruples_verify/)</div>

</div>


## 정의

쿼드러플은 네 칸 (op, arg1, arg2, result)을 가진 기록이고, 연결 리스트에 담는다[^1]. 쿼드러플(quadruple)은 "넷이 한 벌"이라는 뜻이다.

| 칸 | 담는 것 |
|---|---|
| op | 연산자나 명령의 종류. `+`, `*`, `goto`, `param` 등 |
| arg1 | 첫째 피연산자 |
| arg2 | 둘째 피연산자. 없으면 비운다 |
| result | 결과를 받는 변수. 없으면 비운다 |

3주소 코드의 줄마다 칸을 채우는 법은 다음과 같다[^2].

| 3주소 코드 | op | arg1 | arg2 | result |
|---|---|---|---|---|
| 복사 `a = b` | `=` | b | | a |
| 이항 연산 `a = b - c` | `-` | b | c | a |
| 단항 연산 `a = -b` | `-` | b | | a |
| `L:` | `label` | L | | |
| `goto L` | `goto` | L | | |
| `if x goto L` | `if` | x | L | |
| `param x` | `param` | x | | |
| `call f, n` | `call` | f | n | |
| `x = call f, n` | `call` | f | n | x |
| `return x` | `return` | x | | |
| `x[i] = y` | `[]=` | i | y | x |
| `x = y[i]` | `=[]` | y | i | x |

눈여겨볼 곳이 셋이다.

- 이항 뺄셈과 단항 부호 바꾸기가 둘 다 op `-`다. arg2가 차 있으면 뺄셈, 비어 있으면 부호 바꾸기다.
- 흐름을 바꾸는 줄은 result가 비고, 갈 곳의 레이블이 arg 칸에 들어간다. `goto`는 arg1에, `if`는 조건 다음인 arg2에 둔다. `ifnot x goto L`도 `if`와 같은 자리를 쓴다[^3].
- 배열 연산은 op가 `[]=`(넣기)와 `=[]`(꺼내기)로 다르고, 배열 이름이 들어가는 칸도 다르다. 넣기는 배열이 result, 꺼내기는 배열이 arg1이다.

복사 줄의 op를 p.20의 그림은 `copy`로, p.21의 표는 `=`로 적었다. 같은 것을 가리킨다[^s2].

**하는 일.** 새 쿼드러플을 리스트 맨 끝에 붙인다. 처음부터 차례로 읽는다. [중간 코드 생성기](/Hongs_Blog/studies/compilers/ast-to-tac/)는 붙이기만 하고, 최적화 단계는 읽으면서 고치거나 뺀다.

| 일 | 비용 |
|---|---|
| 맨 끝에 붙이기 | 끝을 가리키는 포인터를 따로 두면 $$O(1)$$, 없으면 처음부터 따라가야 해서 $$O(n)$$ |
| 처음부터 끝까지 읽기 | $$O(n)$$ |
| 읽던 자리에서 한 줄 끼우기·빼기 | $$O(1)$$ |

$$n$$은 쿼드러플의 개수다[^s2].

## 활용

- 구현: [38_quadruples_verify.py](/Hongs_Blog/studies/compilers/code/38_quadruples_verify/)의 `QuadList`. 연습: [3주소 코드 변환 연습](/Hongs_Blog/studies/compilers/tac-translation-practice/)
- 최적화가 줄을 빼는 일이 잦다. [죽은 코드 제거](/Hongs_Blog/studies/compilers/live-variable-analysis/)는 쓸모없는 대입을 통째로 뺀다. 연결 리스트는 뺄 때 뒤의 줄을 당기지 않아도 된다.
- 흔한 실수: `if x goto L`에서 L을 result 칸에 넣는다. `x[i] = y`의 칸 순서를 `=[]`와 섞는다. 단항 연산에서 arg2 대신 arg1을 비운다.

## 연결

- 선수: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)
- 담는 그릇: [연결 리스트](/Hongs_Blog/studies/algorithms/linked-list/)
- 트리에서 쿼드러플을 만들어 붙이는 과정: [AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 쿼드러플의 네 칸을 순서대로 쓰고, `a = b - c`와 `a = -b`를 각각 쿼드러플로 쓰라. 둘은 어떻게 구별되는가?</summary>

**답:** (op, arg1, arg2, result). `a = b - c`는 (`-`, b, c, a), `a = -b`는 (`-`, b, 빈칸, a). op가 같으므로 arg2가 차 있는지로 구별한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예시의 다섯 쿼드러플을 a = 2, b = 3으로 차례로 실행할 때 result 칸의 변수에 들어가는 값을 순서대로 쓰라.</summary>

**답:** t0 = −2, t1 = 3 × (−2) = −6, t2 = 3 × (−6) = −18, t3 = −6 + (−18) = −24, c = −24.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 3주소 코드를 쿼드러플 표로 옮기라. `L0:` / `t0 = x < y` / `ifnot t0 goto L1` / `x = t1` / `goto L0`</summary>

**답:** (`label`, L0, , ), (`<`, x, y, t0), (`ifnot`, t0, L1, ), (`=`, t1, , x), (`goto`, L0, , ).<br>
**이유:** 흔한 오답은 `x = t1`을 (`=`, x, , t1)로 뒤집는 것이다. 값을 받는 쪽이 result다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `x[i] = y`와 `x = y[i]`의 쿼드러플에서 배열 이름은 각각 어느 칸에 들어가는가? 왜 다른가?</summary>

**답:** `x[i] = y`는 (`[]=`, i, y, x)로 배열 x가 result에, `x = y[i]`는 (`=[]`, y, i, x)로 배열 y가 arg1에 들어간다. result는 값이 바뀌는 쪽이다. 넣기에서는 배열 x가 바뀌고, 꺼내기에서는 변수 x가 바뀌고 배열 y는 읽기만 한다.

</details>


[^1]: 컴파일러 11회 강의 자료 「Lecture11 Intermediate code generation」, p.20 (네 칸, 연결 리스트에 담는다, 다섯 줄의 예와 그림)
[^2]: 같은 자료, p.21 (3주소 코드 12종류의 칸 채우기 표)
[^3]: 같은 자료, p.32 (while의 생성 규칙: op = ifnot, arg1 = 조건의 계산 결과, arg2 = 새 레이블)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> a = 2, b = 3의 실행값과 서류 양식 비유는 원본에 없다. 비유와 달리 쿼드러플의 칸에는 값이 아니라 이름이 적힌다. 값은 검증 코드로 확인했다. 연결 리스트 그림은 p.20의 그림을 글자로 옮긴 것이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 눈여겨볼 곳 세 가지, `copy`와 `=`가 같다는 설명, 하는 일과 비용 표, 카드 C3·C4는 원본에 없다. 슬라이드는 "연결 리스트에 담는다"와 "리스트의 끝에 붙인다"(p.22)만 적었다. 비용은 단일 연결 리스트의 일반적인 성질이다(Cormen 외, *Introduction to Algorithms* 3판 10.2절).
{% endraw %}
