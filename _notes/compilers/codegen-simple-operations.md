---
layout: "note"
title: "단순 연산과 분기의 코드 생성"
display_title: "단순 연산과 분기의 코드 생성 (Code Generation for Simple Operations and Jumps)"
kind: "concept"
kind_label: "알고리즘"
num: "52"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Code Generation for Simple Operations", "코드 생성", "Code Generation", "Code Generation for Conditional Jumps", "조건 분기의 코드 생성", "적재-연산-저장", "Load-Compute-Store"]
description: "서랍에 든 서류로 일하려면 꺼내서 책상에 놓고, 고치고, 다시 서랍에 넣는다. 컴파일러가 계산 한 줄을 기계 명령으로 옮길 때도 이 세 걸음을 그대로 찍어 낸다. 변수의 값을 메모리에서 꺼내고, 계산하고, 결과를 메모리에 넣는다. 조건에 따라 건너뛰는 줄은 조건 값을 꺼내서 0인지…"
prev_url: "/studies/compilers/mips-instructions/"
prev_title: "수업용 MIPS 명령어"
next_url: "/studies/compilers/codegen-function-call/"
next_title: "함수 호출의 코드 생성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/codegen-simple-operations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

서랍에 든 서류로 일하려면 꺼내서 책상에 놓고, 고치고, 다시 서랍에 넣는다. 컴파일러가 계산 한 줄을 기계 명령으로 옮길 때도 이 세 걸음을 그대로 찍어 낸다. 변수의 값을 메모리에서 꺼내고, 계산하고, 결과를 메모리에 넣는다. 조건에 따라 건너뛰는 줄은 조건 값을 꺼내서 0인지 보고 뛰는 두 걸음이 된다. 줄마다 따로 옮기니 만들기는 아주 쉽다. 대신 방금 넣은 값을 바로 다음 줄에서 다시 꺼내는 헛일이 많이 생긴다.

</div>


## 예시로 보기

[수업용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)에서 본 것처럼 이 기계는 메모리에 있는 값끼리 바로 계산하지 못한다. 그런데 3주소 코드의 변수는 모두 메모리에 있다. 지금 도는 함수의 지역 변수이므로 그 함수의 [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/), 곧 스택에 이미 자리가 있다[^1].

3주소 코드 `a = b + c`를 옮긴다. 스택은 이런 모습이다. `$sp`는 스택 꼭대기 바로 다음의 빈칸을 가리킨다[^1].

```
 높은 번지   |   ...   |
             +---------+
   $sp + 12  |    a    |
             +---------+
   $sp + 8   |    b    |
             +---------+
   $sp + 4   |    c    |
             +---------+
   $sp --->  | (빈칸)  |
 낮은 번지   +---------+
```

변수마다 `$sp`에서 몇 바이트 떨어져 있는지는 심벌 테이블에 적혀 있다[^1]. 옮기는 걸음은 셋이다[^2].

| 걸음 | 하는 일 | 명령 |
|---|---|---|
| 1 | 변수를 메모리에서 레지스터로 꺼낸다 | `lw $r0 8($sp)` (b), `lw $r1 4($sp)` (c) |
| 2 | 레지스터끼리 더한다 | `add $r2 $r0 $r1` |
| 3 | 결과를 메모리에 넣는다 | `sw $r2 12($sp)` (a) |

b = 2, c = 5로 돌리면 `$r0 = 2`, `$r1 = 5`, `$r2 = 7`이 되고 `$sp + 12`번지에 7이 들어간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 규칙대로 만든 명령이 슬라이드 p.13, p.14, p.16, p.18의 어셈블리와 글자까지 같음, 파이썬 흉내기로 돌려 3주소 코드를 직접 실행한 값과 같음(`a = b + c`는 −3~3의 모든 쌍, 반복문은 x, y가 −2~5인 모든 쌍, 무작위 직선 코드 500개), 메모리 읽기·쓰기 횟수 — [52_codegen-simple-operations_impl.py](/Hongs_Blog/studies/compilers/code/52_codegen-simple-operations_impl/). 실제 MIPS 어셈블러로 돌린 것이 아니다.</div>

</div>


## 옮기는 규칙

3주소 코드의 줄 모양마다 찍어 낼 명령이 정해져 있다. `off(x)`는 심벌 테이블에 적힌 변수 x의 오프셋이다. 줄마다 레지스터 번호를 `$r0`부터 새로 쓴다[^3][^s1].

| 3주소 코드 | 찍어 내는 명령 |
|---|---|
| `x = y op z` (둘 다 변수) | `lw $r0 off(y)($sp)` / `lw $r1 off(z)($sp)` / `(op 명령) $r2 $r0 $r1` / `sw $r2 off(x)($sp)` |
| `x = y op 상수` | `lw $r0 off(y)($sp)` / `(op 명령)i $r1 $r0 상수` / `sw $r1 off(x)($sp)` |
| `if x goto L` | `lw $r0 off(x)($sp)` / `bnez $r0 L` |
| `ifnot x goto L` | `lw $r0 off(x)($sp)` / `beqz $r0 L` |
| `goto L` | `j L` |
| `L:` | `L:` |

`op 명령`은 연산자에 맞는 명령이다. `+`는 `add`, `-`는 `sub`, `*`는 `mul`, `/`는 `div`, `<`는 `slt`, `<=`는 `sle`, `>`는 `sgt`, `>=`는 `sge`, `==`는 `seq`, `!=`는 `sne`다. 오른쪽이 상수면 끝에 `i`가 붙은 즉시값 명령을 써서 꺼내 오기 한 번을 아낀다.

**비교.** `a = b < 3`은 a가 `$sp + 8`, b가 `$sp + 4`에 있을 때 이렇게 된다[^4].

```
lw   $r0 4($sp)      # b를 꺼낸다
slti $r1 $r0 3       # $r1 = ($r0 < 3)
sw   $r1 8($sp)      # a에 넣는다
```

**조건 분기.** 조건이 참이면 뛰는 줄은 "0이 아니면 뛴다"가 된다. 참을 0이 아닌 값으로 적어 두었기 때문이다. `t0`가 `$sp + 8`, b가 `$sp + 4`에 있다[^5].

```
[3주소 코드]            [어셈블리]
t0 = b < 3              lw   $r0 4($sp)
                        slti $r1 $r0 3
                        sw   $r1 8($sp)
if t0 goto L0           lw   $r0 8($sp)
                        bnez $r0 L0
L0:                     L0:
```

## 예제

**반복문.** 슬라이드의 연습이다. `t0`는 `$sp + 12`, x는 `$sp + 8`, y는 `$sp + 4`에 있다[^6].

```
[3주소 코드]            [어셈블리]
L0:                     L0:
t0 = x < y              lw   $r0 8($sp)        # x
                        lw   $r1 4($sp)        # y
                        slt  $r2 $r0 $r1
                        sw   $r2 12($sp)       # t0
ifnot t0 goto L1        lw   $r0 12($sp)       # t0
                        beqz $r0 L1
x = x + 1               lw   $r0 8($sp)        # x
                        addi $r1 $r0 1
                        sw   $r1 8($sp)        # x
goto L0                 j    L0
L1:                     L1:
```

x = 0, y = 3으로 돌린 흐름이다[^s2].

| 바퀴 | 들어올 때 x | `t0 = x < y` | `beqz` | 나갈 때 x |
|---|---|---|---|---|
| 1 | 0 | 1 | 안 뛴다 | 1 |
| 2 | 1 | 1 | 안 뛴다 | 2 |
| 3 | 2 | 1 | 안 뛴다 | 3 |
| 4 | 3 | 0 | `L1`로 뛴다 | 3 |

세 바퀴 돌고 넷째 검사에서 나온다. 그동안 메모리 읽기(`lw`)가 15번, 쓰기(`sw`)가 7번 일어난다. 한 바퀴에 읽기 4번과 쓰기 2번이고, 마지막 검사에 읽기 3번과 쓰기 1번이다.

**헛일이 생기는 곳.** 위 어셈블리의 넷째와 다섯째 명령을 보면 `sw $r2 12($sp)`로 `t0`를 메모리에 넣자마자 `lw $r0 12($sp)`로 다시 꺼낸다. 값은 방금까지 `$r2`에 있었다. 줄마다 따로 옮기기 때문에 생기는 일이다. 슬라이드는 이 방식의 문제를 둘로 적는다[^7].

- 레지스터가 끝없이 많다고 쳤는데 실제로는 수가 정해져 있다.
- 조각마다 그대로 옮기면 만들기는 간단하지만 효율을 잃는다. 필요 없는 꺼내 오기와 넣어 두기가 나온다.

둘 다 레지스터를 더 잘 나눠 써서 푼다([레지스터 간섭 그래프](/Hongs_Blog/studies/compilers/register-interference-graph/), [그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/)).

## 활용

- 구현: [52_codegen-simple-operations_impl.py](/Hongs_Blog/studies/compilers/code/52_codegen-simple-operations_impl/). 연습: [코드 생성 연습](/Hongs_Blog/studies/compilers/codegen-practice/)
- 비용: 3주소 코드 한 줄이 명령 2~4줄이 된다. 줄 수에 비례하는 시간에 끝난다. 앞뒤 줄을 보지 않으므로 한 줄씩 읽으면서 바로 찍어 낼 수 있다[^s1].
- 흔한 실수: 오프셋을 변수의 순서로 착각한다. 오프셋은 `$sp`에서 떨어진 바이트 수이고, 그림에서 위에 있는(높은 번지의) 변수일수록 크다.
- 흔한 실수: `if x goto L`에 `beqz`를 쓴다. 참일 때 뛰어야 하므로 "0이 아니면"인 `bnez`다. `ifnot`이 `beqz`다.
- 흔한 실수: `x = x + 1`에서 결과를 넣는 `sw`를 빼먹는다. `addi`는 레지스터만 바꾼다. 메모리의 x는 `sw`를 해야 바뀐다.

## 연결

- 선수: [수업용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/), [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/), [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)
- 변수의 오프셋을 적어 두는 곳: [심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)
- 함수 호출 줄(`param`, `call`, `return`)을 옮기는 법: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- x86에서 같은 일을 하는 명령: 비교한 뒤 플래그를 보고 뛰는 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/), 값을 담는 [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 예제의 반복문 어셈블리를 x = 1, y = 3으로 돌린다. 끝났을 때 메모리의 x와 t0는? `lw`와 `sw`는 각각 몇 번 실행되는가?</summary>

**답:** x = 3, t0 = 0. `lw` 11번, `sw` 5번.<br>
**이유:** 두 바퀴를 돈다(x가 1 → 2 → 3). 한 바퀴에 `lw` 4번(x, y, t0, x)과 `sw` 2번(t0, x)이다. 마지막 검사에서 `lw` 3번(x, y, t0)과 `sw` 1번(t0)이 더 나온다. 4 × 2 + 3 = 11, 2 × 2 + 1 = 5. 흔한 오답은 마지막 검사를 빼고 8번, 4번이라 답하는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `lw $r0 8($sp)` / `addi $r1 $r0 1` / `sw $r1 8($sp)` 세 줄이 하는 일을 한 문장으로 쓰라. 가운데 줄만 있으면 왜 안 되는가?</summary>

**답:** `$sp + 8`번지에 있는 변수의 값을 1 늘린다(`x = x + 1`). `addi`는 레지스터끼리만 계산하므로, 앞의 `lw`가 없으면 `$r0`에 x가 들어 있지 않고, 뒤의 `sw`가 없으면 늘어난 값이 메모리의 x에 닿지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** d가 `$sp + 16`, a가 `$sp + 12`에 있다. 3주소 코드 `d = a * 4`를 옮기라. 메모리 읽기는 몇 번인가?</summary>

**답:** `lw $r0 12($sp)` / `muli $r1 $r0 4` / `sw $r1 16($sp)`. 읽기 1번, 쓰기 1번.<br>
**이유:** 오른쪽 4가 상수라서 즉시값 명령 `muli`를 쓴다. 4를 레지스터에 따로 넣을 필요가 없어 명령이 넷이 아니라 셋이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 3주소 코드 `if x goto L`과 `ifnot x goto L`을 옮길 때 각각 `bnez`와 `beqz` 가운데 무엇을 쓰는가? 반대로 쓰면 반복문 예제는 어떻게 되는가?</summary>

**답:** `if x goto L`은 `bnez`(0이 아니면 뛴다), `ifnot x goto L`은 `beqz`(0이면 뛴다)다.<br>
**이유:** 참은 0이 아닌 값이다. `if`는 참일 때 뛰어야 하므로 "0이 아니면"을 쓴다. 반대로 쓰면 조건이 참일 때 반복문을 빠져나가고 거짓일 때 몸통을 돌아, 원래 코드와 정반대로 움직인다.

</details>


[^1]: 컴파일러 15회 강의 자료 「Lecture15 Code generation part 2」, p.10 (변수는 이미 스택에 있다, $sp 기준 위치는 심벌 테이블에 있다)
[^2]: 같은 자료, p.11~13 (a = b + c의 세 걸음)
[^3]: 같은 자료, p.13, p.14, p.16, p.18 (네 예제의 어셈블리)
[^4]: 같은 자료, p.14 (a = b < 3)
[^5]: 같은 자료, p.16 (조건 분기 예제)
[^6]: 같은 자료, p.17~18 (연습과 답). p.17~18의 3주소 코드에 "itnot t0 goto L1"이라 적혀 있는데 "ifnot"의 오타로 읽었다. 답의 `beqz`가 "t0가 거짓이면 뛴다"와 맞는다.
[^7]: 같은 자료, p.29 (수업 가정의 문제점)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 규칙을 한 표로 모은 것, "줄마다 레지스터 번호를 새로 쓴다", 비용 이야기는 원본에 없다. 슬라이드의 네 예제에서 읽어 낸 규칙이고, 이 규칙으로 만든 명령이 네 예제와 글자까지 같은 것을 구현 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> b = 2, c = 5의 값, x = 0, y = 3의 실행 표, 읽기·쓰기 횟수, 카드 C1~C3은 원본에 없다. 파이썬 흉내기로 돌려 확인했다.
{% endraw %}
