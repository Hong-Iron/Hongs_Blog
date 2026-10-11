---
layout: "note"
title: "AST에서 3주소 코드 만들기"
display_title: "AST에서 3주소 코드 만들기 (AST to TAC)"
kind: "concept"
kind_label: "알고리즘"
num: "39"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["AST to TAC", "TAC Construction Rules", "3주소 코드 생성", "중간 코드 생성", "Intermediate Code Generation", "코드 생성 규칙"]
description: "회사에서 부장이 과장에게, 과장이 대리에게 일을 내려보내고, 맨 아래에서 끝난 결과가 \"어느 서랍에 넣어 뒀습니다\"라는 말과 함께 거꾸로 올라오는 것과 같다. 나무 모양으로 펼친 프로그램의 칸마다 \"내 아래 칸들에게 먼저 시키고, 그 결과가 담긴 이름을 받아 내 계산 한 줄을 적는…"
prev_url: "/studies/compilers/quadruples/"
prev_title: "쿼드러플"
next_url: "/studies/compilers/basic-block-cfg/"
next_title: "기본 블록과 제어 흐름 그래프"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/ast-to-tac/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

회사에서 부장이 과장에게, 과장이 대리에게 일을 내려보내고, 맨 아래에서 끝난 결과가 "어느 서랍에 넣어 뒀습니다"라는 말과 함께 거꾸로 올라오는 것과 같다. 나무 모양으로 펼친 프로그램의 칸마다 "내 아래 칸들에게 먼저 시키고, 그 결과가 담긴 이름을 받아 내 계산 한 줄을 적는다"는 규칙을 붙여 둔다. 맨 위 칸에서 시작하면 코드가 맨 아래 계산부터 차례로 적힌다. 규칙이 단순해서 만들기 쉽지만, 같은 계산을 또 하는 줄이나 한 번 쓰고 버리는 이름이 그대로 나온다.

</div>


## 예시로 보기

[3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)를 사람이 눈으로 옮길 수는 있다. 컴파일러는 어떤 트리가 와도 같은 방법으로 옮겨야 한다. 그래서 트리를 만들 때 노드 종류마다 "이 노드에서는 이렇게 코드를 만든다"는 규칙을 붙여 두고, 트리를 돌면서 그 규칙대로 만든다[^1].

`A + A * B - 1`의 트리를 돈다. 화살표 옆의 이름은 그 노드가 부모에게 돌려주는 것이다[^2].

```
            -            → t2
          /   \
   t1 ←  +     num 1     → 1
        / \
 A ← id A   *            → t0
           / \
    A ← id A   id B → B
```

| 차례 | 서 있는 노드 | 하는 일 | 리스트 끝에 붙는 쿼드러플 |
|---|---|---|---|
| 1 | `-` | op = `-`인 쿼드러플을 만들기 시작한다. arg1을 알려면 왼쪽 자식으로 내려간다 | |
| 2 | `+` | op = `+`를 만들기 시작한다. 왼쪽 자식으로 | |
| 3 | `id A` | 이름 A를 돌려준다 → `+`의 arg1 = A | |
| 4 | `*` | op = `*`를 만들기 시작한다. 왼쪽 자식으로 | |
| 5 | `id A`, `id B` | A, B를 돌려준다 → `*`의 arg1 = A, arg2 = B | |
| 6 | `*` | result = 새 임시 변수 t0. 리스트에 붙이고 t0를 돌려준다 | (`*`, A, B, t0) |
| 7 | `+` | arg2 = t0, result = t1. 붙이고 t1을 돌려준다 | (`+`, A, t0, t1) |
| 8 | `num 1` | 값 1을 돌려준다 → `-`의 arg2 = 1 | |
| 9 | `-` | arg1 = t1, result = t2. 붙이고 t2를 돌려준다 | (`-`, t1, 1, t2) |

리스트에는 `t0 = A * B`, `t1 = A + t0`, `t2 = t1 - 1`이 이 순서로 쌓인다. 맨 먼저 찾아간 노드는 뿌리 `-`인데, 쿼드러플은 `-`가 맨 나중에 붙는다. 자식의 결과를 받아야 자기 칸을 다 채울 수 있기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적의 방문 순서와 쿼드러플 세 개, 아래 while 연습의 답과 실행 결과, 슬라이드의 while 예(L11 p.18)와 글자까지 같은 출력, if-else 예와 같은 실행 결과, 무작위 식 2,000개에서 "만든 코드를 실행한 값 = 트리를 직접 계산한 값"과 "쿼드러플의 순서 = 후위 순회의 연산자 순서" — [39_ast-to-tac_impl.py](/Hongs_Blog/studies/compilers/code/39_ast-to-tac_impl/)</div>

</div>


## 정의

입력은 추상 구문 트리다. 출력은 [쿼드러플](/Hongs_Blog/studies/compilers/quadruples/)의 연결 리스트다. 각 노드의 규칙은 "리스트에 무엇을 붙이는가"와 "부모에게 무엇을 돌려주는가"를 정한다.

**이항 연산자 노드.** `+`, `-`, `*` 같은 노드다[^1].

1. op가 그 연산자인 새 쿼드러플을 만든다.
2. arg1 = 왼쪽 자식의 계산 결과.
3. arg2 = 오른쪽 자식의 계산 결과.
4. result = 새 임시 변수 $$t_i$$. $$i$$는 지금까지 쓰지 않은 번호다.
5. 쿼드러플을 연결 리스트 맨 끝에 붙인다.

**잎 노드.** 식별자 노드(`id`)는 자기 이름을, 숫자 노드(`num`)는 자기 값을 돌려준다. 리스트에는 아무것도 붙이지 않는다[^3].

**while 노드.** 왼쪽 자식이 조건, 오른쪽 자식이 몸통이다[^4].

1. op = `label`, arg1 = 새 레이블 $$L_i$$인 쿼드러플을 만들어 붙인다.
2. op = `ifnot`인 쿼드러플을 만든다.
3. arg1 = 왼쪽 자식의 계산 결과(조건을 계산한다).
4. arg2 = 또 다른 새 레이블 $$L_j$$.
5. 그 쿼드러플을 붙인다.
6. 오른쪽 자식을 계산한다(몸통의 코드가 붙는다).
7. op = `goto`, arg1 = $$L_i$$인 쿼드러플을 만들어 붙인다.
8. op = `label`, arg1 = $$L_j$$인 쿼드러플을 만들어 붙인다.

2번에서 `ifnot` 쿼드러플을 만들기 시작하지만, 붙이는 것은 5번이다. 그 사이 3번에서 조건을 계산하는 쿼드러플이 먼저 붙는다. 그래서 리스트에서는 조건 계산이 `ifnot`보다 앞에 온다.

```
만들기(노드 n):                          # 돌려주는 값: 결과가 담긴 이름
    n이 id면:   이름을 돌려준다
    n이 num이면: 값을 돌려준다
    n이 이항 연산자면:
        a1 = 만들기(왼쪽 자식)
        a2 = 만들기(오른쪽 자식)
        t  = 새 임시 변수
        리스트 끝에 (n의 연산자, a1, a2, t)를 붙인다
        t를 돌려준다
    n이 대입(=)이면:
        a1 = 만들기(오른쪽 자식)
        리스트 끝에 (=, a1, , 왼쪽 자식의 이름)을 붙인다
    n이 while이면:
        Li = 새 레이블;  리스트 끝에 (label, Li, , )
        c  = 만들기(왼쪽 자식)
        Lj = 새 레이블;  리스트 끝에 (ifnot, c, Lj, )
        만들기(오른쪽 자식)
        리스트 끝에 (goto, Li, , );  리스트 끝에 (label, Lj, , )
```

대입 노드의 규칙은 슬라이드에 따로 적혀 있지 않다. 슬라이드의 예가 `x = x + 1`을 `t1 = x + 1`, `x = t1` 두 줄로 옮긴 것에 맞췄다[^s1].

**왜 맞는 코드가 나오는가.** 이항 연산자 노드는 자식 둘의 코드가 모두 리스트에 붙은 뒤에 자기 쿼드러플을 붙인다. 그러므로 어떤 쿼드러플이 실행될 때 그 arg1, arg2에 적힌 이름에는 이미 값이 들어 있다. 트리의 높이에 대한 귀납법으로, 노드가 돌려준 이름에는 그 노드 아래 식의 값이 담긴다[^s2].

**비용.** 노드마다 한 번 들르고 쿼드러플을 많아야 몇 개 붙인다. 노드가 $$n$$개면 시간은 $$O(n)$$이다. 이항 연산자 노드 하나마다 임시 변수와 쿼드러플이 하나씩 생긴다[^s2].

## 예제

**while (슬라이드의 연습).** `while (x <= y) x = x + 1;`의 트리다[^4].

```
          while
         /     \
       <=        =
      /  \      / \
  id x   id y  id x   +
                     / \
                  id x   num 1
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

| 규칙 단계 | 붙는 쿼드러플 | 3주소 코드 |
|---|---|---|
| 1 | (`label`, L0, , ) | `L0:` |
| 3 (조건 계산) | (`<=`, x, y, t0) | `t0 = x <= y` |
| 2·4·5 | (`ifnot`, t0, L1, ) | `ifnot t0 goto L1` |
| 6 (몸통의 `+`) | (`+`, x, 1, t1) | `t1 = x + 1` |
| 6 (몸통의 `=`) | (`=`, t1, , x) | `x = t1` |
| 7 | (`goto`, L0, , ) | `goto L0` |
| 8 | (`label`, L1, , ) | `L1:` |

쿼드러플은 일곱 개다. x = 2, y = 5로 실행하면 x가 6이 되어 끝난다. 반복문은 x가 y보다 커지는 첫 값, 곧 y + 1에서 멈춘다(처음부터 x가 더 크면 x 그대로다)[^s1].

</details>


**같은 계산이 두 번 나온다.** `a = b * c + b * c`를 규칙대로 옮기면 `t0 = b * c`, `t1 = b * c`, `t2 = t0 + t1`, `a = t2`다. `b * c`를 두 번 계산한다. 규칙은 노드 하나만 보고 코드를 만들기 때문에, 옆 가지에서 같은 계산을 이미 했는지 모른다. 이것을 줄이는 일은 다음 단계인 [최적화](/Hongs_Blog/studies/compilers/local-optimizations/)가 맡는다[^s1].

## 활용

- 구현: [39_ast-to-tac_impl.py](/Hongs_Blog/studies/compilers/code/39_ast-to-tac_impl/). 연습: [3주소 코드 변환 연습](/Hongs_Blog/studies/compilers/tac-translation-practice/)
- 시험에서는 트리를 주고 쿼드러플이 붙는 순서를 묻거나, 새 노드 종류(if, for)의 규칙을 쓰게 한다. 규칙을 쓸 때는 "붙이는 것"과 "돌려주는 것"을 모두 적는다.
- 흔한 실수: 뿌리 노드의 쿼드러플을 먼저 붙인다. 오른쪽 자식을 왼쪽보다 먼저 계산한다(임시 변수 번호가 달라진다). while에서 조건 계산을 `L0:` 위에 둔다(조건이 한 번만 계산된다). `ifnot`의 레이블을 result 칸에 둔다.

## 연결

- 선수: [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/), [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/), [쿼드러플](/Hongs_Blog/studies/compilers/quadruples/)
- 자식 둘을 끝낸 뒤 자기 일을 하는 순서는 후위 순회다: [트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/). [타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)도 같은 순서로 트리를 돈다. 거기서는 타입을 돌려주고, 여기서는 결과가 담긴 이름을 돌려준다.
- 어셈블리어에서 while을 손으로 옮기는 틀과 같다: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `(a - b) * (c + 1)`의 트리(뿌리 `*`, 왼쪽 `-`, 오른쪽 `+`)를 규칙대로 돌 때 리스트에 붙는 쿼드러플을 순서대로 쓰라.</summary>

**답:** (`-`, a, b, t0), (`+`, c, 1, t1), (`*`, t0, t1, t2). 3주소 코드로는 `t0 = a - b`, `t1 = c + 1`, `t2 = t0 * t1`.<br>
**이유:** 왼쪽 자식을 먼저 끝내므로 `-`가 t0를 받는다. 뿌리 `*`는 맨 먼저 찾아가지만 맨 나중에 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 의사코드의 `만들기`가 이항 연산자 노드에서 하는 일을 한 문장으로 쓰라.</summary>

**답:** 왼쪽과 오른쪽 자식의 코드를 먼저 만들게 해서 두 결과가 담긴 이름을 받고, 그 둘을 피연산자로 하고 새 임시 변수를 결과로 하는 쿼드러플을 리스트 끝에 붙인 뒤, 그 임시 변수 이름을 부모에게 돌려준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** while 규칙에서 `ifnot` 쿼드러플을 2번에서 만들기 시작하는데, 리스트에서는 조건을 계산하는 쿼드러플이 그 앞에 온다. 왜 그런가? 만약 순서가 뒤집히면 무엇이 잘못되는가?</summary>

**답:** `ifnot`의 arg1을 채우려면 왼쪽 자식(조건)을 계산해야 하고, 그 계산이 조건의 쿼드러플을 먼저 리스트에 붙인다. `ifnot`은 칸이 다 찬 5번에서야 붙는다. 뒤집혀서 `ifnot t0 goto L1`이 `t0 = x <= y`보다 앞에 오면, 분기할 때 `t0`에 아직 이번 바퀴의 조건 값이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** if-else 노드(자식 셋: 조건, 참일 때 몸통, 거짓일 때 몸통)의 규칙을 while 규칙처럼 단계로 쓰라. 3주소 코드의 if-else 예와 같은 모양이 나오게 한다.</summary>

**답:** ① 조건 자식을 계산해 결과 이름 c를 받는다. ② 새 레이블 $$L_i$$, $$L_j$$, $$L_k$$를 만든다. ③ (`if`, c, $$L_i$$, )를 붙인다. ④ (`goto`, $$L_j$$, , )를 붙인다. ⑤ (`label`, $$L_i$$, , )를 붙이고 참 쪽 몸통을 계산한다. ⑥ (`goto`, $$L_k$$, , )를 붙인다. ⑦ (`label`, $$L_j$$, , )를 붙이고 거짓 쪽 몸통을 계산한다. ⑧ (`label`, $$L_k$$, , )를 붙인다.<br>
**이유:** ⑥이 없으면 참 쪽을 끝낸 뒤 거짓 쪽까지 실행한다. 이 규칙은 슬라이드에 없고, 슬라이드의 if-else 예가 나오도록 거꾸로 맞춘 것이다[^s3].

</details>


[^1]: 컴파일러 11회 강의 자료 「Lecture11 Intermediate code generation」, p.22 (AST를 만들 때 노드마다 TAC 생성 규칙을 정한다, 이항 연산자 노드의 규칙 다섯 줄, num 노드의 규칙)
[^2]: 같은 자료, p.23~31 (A + A * B − 1의 트리를 돌며 쿼드러플 세 개를 붙이는 과정)
[^3]: 같은 자료, p.22 (num: Return its value), p.25 (id: Return its name)
[^4]: 같은 자료, p.32 (Practice: while의 TAC 생성 규칙 여덟 줄과 트리. 답은 슬라이드에 없다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 대입 노드의 규칙, while 연습의 답과 실행값, `a = b * c + b * c` 예는 원본에 없다. 대입 규칙은 슬라이드 p.17~18의 예가 `x = x + 1`을 두 줄로 옮긴 것에 맞췄다. 답은 구현으로 만들고 실행해 확인했다. 회사 비유도 원본에 없다. 실제로는 "서랍" 노릇을 하는 임시 변수가 일마다 새로 생긴다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 맞는 코드가 나오는 이유와 비용은 원본에 없다. 귀납 논증은 스케치이고, 무작위 식 2,000개에서 실행값이 트리의 값과 같음을 실험으로 확인했다. 실험은 증명이 아니다. Aho 외, *Compilers* 2판 6.4절(식의 번역)이 같은 구성을 다룬다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> if-else 규칙과 카드 C1은 원본에 없다. 이 규칙으로 만든 코드가 슬라이드 p.17의 코드와 같은 값을 돌려주는 것을 x, y가 −5~5인 모든 경우에 실행해 확인했다. 임시 변수 번호만 다르다(슬라이드는 `t0`를 두 번 쓴다).
{% endraw %}
