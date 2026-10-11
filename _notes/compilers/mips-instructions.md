---
layout: "note"
title: "수업용 MIPS 명령어"
display_title: "수업용 MIPS 명령어 (MIPS Assembly for This Class)"
kind: "concept"
kind_label: "정의"
num: "51"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["MIPS Assembly", "MIPS 어셈블리", "MIPS", "레지스터", "Register", "스택 포인터", "Stack Pointer", "$sp", "$ra", "lw", "sw", "li", "addi", "subi", "slt", "slti", "beq", "beqz", "bnez", "즉시값", "Immediate", "코드 생성기", "Code Generator"]
description: "요리사는 창고에 있는 재료를 바로 썰지 못한다. 도마에 꺼내 놓고 썰고, 다 되면 다시 창고에 넣는다. 이 기계도 그렇다. 계산은 프로세서 안의 작은 칸 몇 개에서만 하고, 메모리와는 \"꺼내 오기\"와 \"넣어 두기\" 두 명령으로만 값을 주고받는다. 명령의 종류가 적고 모양이 단순해서…"
prev_url: "/studies/compilers/runtime-memory-layout/"
prev_title: "실행 시 메모리 배치"
next_url: "/studies/compilers/codegen-simple-operations/"
next_title: "단순 연산과 분기의 코드 생성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/mips-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

요리사는 창고에 있는 재료를 바로 썰지 못한다. 도마에 꺼내 놓고 썰고, 다 되면 다시 창고에 넣는다. 이 기계도 그렇다. 계산은 프로세서 안의 작은 칸 몇 개에서만 하고, 메모리와는 "꺼내 오기"와 "넣어 두기" 두 명령으로만 값을 주고받는다. 명령의 종류가 적고 모양이 단순해서, 컴파일러의 앞 단계가 만든 코드 한 줄을 명령 몇 줄로 기계적으로 옮길 수 있다. 대신 도마가 좁아서 값을 꺼내고 넣는 일이 잦다. 수업에서 쓰는 표기는 실제 기계의 것을 단순하게 고친 것이라 실제 어셈블러에 그대로 넣으면 돌지 않는다.

</div>


## 예시로 보기

컴파일러의 마지막 단계인 코드 생성기는 3주소 코드 같은 중간 표현을 기계 수준의 코드로 옮긴다. 할 일은 둘이다. 중간 코드의 명령마다 알맞은 기계 명령을 고르고, 레지스터처럼 수가 정해진 기계 자원을 아껴 나눠 쓴다[^1].

어셈블리어는 기계 수준의 언어이고 기계 구조마다 다르다. 이 수업은 MIPS 기계를 목표로 삼는다. MIPS는 Microprocessor without Interlocked Pipelined Stages를 줄인 이름이다. 90년대에 가장 많이 팔린 프로세서였고 지금도 임베디드 기기에 많이 쓰인다. x86 같은 다른 주류 구조도 비슷하게 돈다[^2].

3주소 코드 `a = b + c` 한 줄을 옮긴 것이 아래 네 줄이다. b는 메모리의 `$sp + 8`번지에, c는 `$sp + 4`번지에, a는 `$sp + 12`번지에 있다고 하자[^3].

```
lw  $r0 8($sp)       # 메모리에서 b를 꺼내 $r0에 둔다
lw  $r1 4($sp)       # 메모리에서 c를 꺼내 $r1에 둔다
add $r2 $r0 $r1      # $r2 = $r0 + $r1
sw  $r2 12($sp)      # $r2를 메모리의 a 자리에 넣는다
```

`$r0`, `$r1`, `$r2`가 프로세서 안의 칸이다. 이런 칸을 레지스터(register)라 부른다. `add`는 레지스터끼리만 더한다. 메모리에 있는 b와 c를 바로 더하는 명령은 없다. 그래서 꺼내고(`lw`), 계산하고, 넣는(`sw`) 세 걸음이 된다.

`8($sp)`는 "`$sp`에 든 번지에 8을 더한 곳"이라고 읽는다. 괄호 밖의 수를 오프셋이라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 표의 모든 명령을 파이썬 흉내기로 돌려 슬라이드가 적은 뜻과 같은지 확인(산술·비교·분기는 −3~3의 모든 쌍), `subi`가 `addi`에 음수를 넣은 것과 같음, `lw`·`sw`만 메모리를 만짐, 카드 C2 — [51_mips-instructions_impl.py](/Hongs_Blog/studies/compilers/code/51_mips-instructions_impl/). 실제 MIPS 어셈블러로 돌린 것이 아니다.</div>

</div>


## 기계의 성격과 수업의 가정

**MIPS의 성격**[^4].

- 메모리에 닿는 명령은 꺼내 오기(load)와 넣어 두기(store)뿐이다.
- 나머지 명령(산술 등)은 모두 레지스터를 피연산자로 쓴다.
- 레지스터는 빨리 읽고 쓸 수 있고 계산을 바로 할 수 있는 전용 저장 칸이다. 하지만 수가 적다. 그래서 레지스터를 알맞게, 아껴서 쓰는 일이 아주 중요하다.
- MIPS에는 범용 레지스터가 32개 있다.

**이 수업에서만 두는 가정**[^5].

- 32비트 기계다. 모든 객체는 4바이트 정렬이라고 친다. 변수 하나가 4바이트 한 칸이다.
- 레지스터는 두 종류만 쓴다.
    - `$sp`: 스택 포인터. 스택 꼭대기 바로 다음 자리(다음에 쓸 빈칸)를 가리킨다.
    - `$r0`, `$r1`, …: 값을 잠깐 담는 레지스터.
- `$r0`, `$r1`, …은 끝없이 많다고 친다.
- 중간 코드의 조각 하나하나를 그대로 어셈블리로 옮긴다.

뒤의 두 가정은 현실과 다르다. 실제 레지스터는 수가 정해져 있다. 조각마다 따로 옮기면 만들기는 쉽지만 쓸데없이 꺼내고 넣는 명령이 생긴다[^6]. 이 문제는 [그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/)에서 푼다.

함수 호출을 옮길 때는 레지스터가 하나 더 나온다. `$ra`는 돌아갈 주소를 담는 레지스터다[^7].

## 명령 표

`reg1`, `reg2`, `reg3`은 레지스터, `offset`과 `immediate`는 명령에 바로 적는 수, `label`은 코드의 한 자리에 붙인 이름이다.

**메모리와 주고받기**[^8].

| 명령 | 하는 일 |
|---|---|
| `lw reg1 offset(reg2)` | `reg2 + offset`번지에서 32비트 값 하나를 꺼내 `reg1`에 넣는다 |
| `sw reg1 offset(reg2)` | `reg1`의 32비트 값을 `reg2 + offset`번지에 넣는다 |

`lw`는 load word, `sw`는 store word를 줄인 것이다. 두 명령 모두 레지스터를 앞에, 번지를 뒤에 쓴다. 값이 움직이는 방향은 반대다.

**산술**[^8].

| 명령 | 하는 일 |
|---|---|
| `add reg1 reg2 reg3` | `reg1 = reg2 + reg3` |
| `sub reg1 reg2 reg3` | `reg1 = reg2 - reg3` |
| `mul reg1 reg2 reg3` | `reg1 = reg2 * reg3` |
| `div reg1 reg2 reg3` | `reg1 = reg2 / reg3` |

**비교.** 결과가 참이면 `reg1`에 1, 거짓이면 0이 들어간다[^8][^s1].

| 명령 | 하는 일 | 명령 | 하는 일 |
|---|---|---|---|
| `seq reg1 reg2 reg3` | `reg1 = reg2 == reg3` | `sne reg1 reg2 reg3` | `reg1 = reg2 != reg3` |
| `sgt reg1 reg2 reg3` | `reg1 = reg2 > reg3` | `sge reg1 reg2 reg3` | `reg1 = reg2 >= reg3` |
| `slt reg1 reg2 reg3` | `reg1 = reg2 < reg3` | `sle reg1 reg2 reg3` | `reg1 = reg2 <= reg3` |

이름은 set if equal, set if less than처럼 읽는다. `s` 뒤의 두 글자가 조건이다.

**명령에 수를 바로 적는 꼴.** 명령에 바로 적는 상수를 즉시값(immediate)이라 부른다. 이름 끝에 `i`가 붙는다[^9].

| 명령 | 하는 일 |
|---|---|
| `li reg1 immediate` | `reg1 = immediate` |
| `addi reg1 reg2 immediate` | `reg1 = reg2 + immediate`. `subi`, `muli`, `divi`도 같은 꼴이다 |
| `seqi reg1 reg2 immediate` | `reg1 = reg2 == immediate`. `snei`, `sgti`, `sgei`, `slti`, `slei`도 같은 꼴이다 |

**흐름 바꾸기**[^10].

| 명령 | 하는 일 |
|---|---|
| `j label` | 무조건 `label`로 간다 (`goto label`) |
| `beq reg1 reg2 label` | `reg1 == reg2`면 `label`로 간다. `bne`(≠), `bgt`(>), `bge`(≥), `blt`(<), `ble`(≤)도 같은 꼴이다 |
| `beqz reg1 label` | `reg1 == 0`이면 `label`로 간다. `bnez`는 0이 아니면 간다 |
| `beqi reg1 immediate label` | `reg1 == immediate`면 `label`로 간다. `bnei`, `bgti`, `bgei`, `blti`, `blei`도 같은 꼴이다 |
| `jr reg1` | `reg1`에 든 주소로 간다[^7] |

조건이 맞지 않으면 바로 다음 줄로 넘어간다. `b`는 branch, `z`는 zero다.

**실제 MIPS와 다른 점.** 위 표기는 수업용으로 단순하게 고친 것이다. 확실한 차이만 적는다[^s2].

- 실제 MIPS 어셈블리에는 `$r0`, `$r1` 같은 이름이 없다. 레지스터는 `$0`~`$31`의 번호나 `$t0`, `$s0`, `$a0`, `$v0` 같은 쓰임새 이름으로 부른다. `$sp`와 `$ra`는 실제 이름과 같다.
- 실제 표기는 피연산자 사이에 쉼표를 쓴다: `lw $t0, 8($sp)`, `add $t2, $t0, $t1`.
- 실제 기계 명령에는 `subi`가 없다. 빼기는 `addi`에 음수를 적어서 한다.
- 실제 MIPS의 `jal label`은 돌아올 주소를 `$ra`에 넣고 `label`로 간다. 슬라이드에는 함수로 뛰는 명령이 나오지 않는다.

`seqi`, `beqi`처럼 표에 있는 나머지 명령이 실제 어셈블러에서 어떻게 받아들여지는지는 어셈블러마다 달라 여기 적지 않는다[확인필요].

## 연결

- 선수: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)(옮길 재료), [실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)(스택이 낮은 번지 쪽으로 자란다)
- 이 명령들로 옮기는 법: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/), [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- x86과 견주기: 레지스터의 종류와 이름은 [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/). x86은 비교 결과를 플래그에 남기고 그 플래그를 보고 뛰는데([조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)), 여기서는 비교 결과를 레지스터에 0이나 1로 받거나, 비교와 분기를 `beq` 한 명령으로 한다[^s2].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 이 기계에서 메모리에 닿는 명령 둘을 쓰고, `lw $r0 8($sp)`가 하는 일을 말로 쓰라. 수업에서 `$sp`는 무엇을 가리키는가?</summary>

**답:** `lw`(꺼내 오기)와 `sw`(넣어 두기). `lw $r0 8($sp)`는 `$sp`에 든 번지에 8을 더한 곳의 32비트 값을 `$r0`에 넣는다. `$sp`는 스택 꼭대기 바로 다음 자리, 곧 다음에 쓸 빈칸을 가리킨다.<br>
**이유:** 나머지 명령은 모두 레지스터나 즉시값만 쓴다. 그래서 메모리에 있는 변수로 계산하려면 반드시 `lw`가 먼저 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 네 줄을 차례로 실행한 뒤 `$r1`, `$r2`, `$r3`의 값은? `li $r0 5` / `subi $r1 $r0 2` / `slti $r2 $r1 3` / `sgt $r3 $r0 $r1`</summary>

**답:** `$r1 = 3`, `$r2 = 0`, `$r3 = 1`.<br>
**이유:** `$r0 = 5`, `$r1 = 5 − 2 = 3`. `slti`는 3 < 3이 거짓이라 0을 넣는다. `sgt`는 5 > 3이 참이라 1을 넣는다. 흔한 오답은 `slti $r2 $r1 3`을 "3 이하"로 읽어 1이라 하는 것이다. `lt`는 작다이고, 작거나 같다는 `le`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `$r0`에 든 값이 0이 아닐 때 `L1`으로 가게 하려 한다. ① `beqz $r0 L1` ② `bnez $r0 L1` ③ `bnei $r0 0 L1` ④ `j L1` 가운데 맞는 것을 모두 고르라.</summary>

**답:** ②와 ③.<br>
**이유:** ①은 0일 때 가므로 반대다. ④는 값을 보지 않고 늘 간다. ②는 "0이 아니면", ③은 "즉시값 0과 다르면"이라 같은 일을 한다.

</details>


[^1]: 컴파일러 15회 강의 자료 「Lecture15 Code generation part 2」, p.3~4 (코드 생성기가 하는 일과 목표)
[^2]: 같은 자료, p.5 (어셈블리어, 수업의 목표 기계 MIPS)
[^3]: 같은 자료, p.10~13 (a = b + c를 옮긴 네 줄)
[^4]: 같은 자료, p.6 (MIPS 어셈블리의 성격, 레지스터, 범용 레지스터 32개)
[^5]: 같은 자료, p.7 (수업의 가정: 32비트, 4바이트 정렬, $$sp와 $$r0…, 끝없이 많은 레지스터, 조각마다 옮기기)
[^6]: 같은 자료, p.29 (가정의 문제점)
[^7]: 같은 자료, p.23 ($$ra는 돌아갈 주소를 담는 레지스터), p.28 (jr $$ra)
[^8]: 같은 자료, p.8 (기본 명령: lw, sw, 산술 넷, 비교 여섯)
[^9]: 같은 자료, p.9 (li, 즉시값 산술, 즉시값 비교)
[^10]: 같은 자료, p.15 (흐름 제어 명령)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 비교 결과가 1과 0이라는 것, 명령 이름을 읽는 법(set if …, branch, zero, load word)은 원본에 없다. 슬라이드 p.16은 비교 결과를 `bnez`로 받아 0이 아니면 뛰게 하므로 참을 0이 아닌 값으로 쓴다. 흉내기는 참을 1로 두었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 실제 MIPS와의 차이, x86과의 비교는 원본에 없다. 레지스터 이름과 쉼표 표기, `addi`만 있고 `subi` 기계 명령이 없는 것, `jal`이 `$ra`에 돌아올 주소를 넣는 것은 MIPS32 명령 집합과 표준 어셈블러 표기에 따른 것이다(Patterson·Hennessy, Computer Organization and Design, MIPS판 2장).
{% endraw %}
