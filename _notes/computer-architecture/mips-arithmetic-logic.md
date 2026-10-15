---
layout: "note"
title: "MIPS 산술·논리 명령"
display_title: "MIPS 산술·논리 명령 (MIPS Arithmetic and Logical Instructions)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["MIPS Arithmetic and Logical Instructions", "add", "sub", "addi", "addu", "and", "or", "nor", "andi", "ori", "sll", "srl", "sra", "slt", "slti", "sltu", "lui", "즉시값", "Immediate", "부호 확장", "Sign Extension", "제로 확장", "Zero Extension", "set on less than"]
description: "계산하는 명령은 모두 같은 꼴이다. 재료 둘을 받아 결과 하나를 칸에 적는다. 더하기, 빼기, 비트끼리 견주기, 비트를 옆으로 밀기, 어느 쪽이 작은지 묻기가 있고, 재료 하나를 칸 대신 명령에 직접 적은 작은 수로 바꾼 꼴도 있다. 꼴이 하나라 외우기 쉽고 회로도 단순하다. 대신…"
prev_url: "/studies/computer-architecture/mips-operands/"
prev_title: "MIPS 레지스터와 메모리 피연산자"
next_url: "/studies/computer-architecture/mips-instruction-formats/"
next_title: "MIPS 명령어 형식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/mips-arithmetic-logic/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

계산하는 명령은 모두 같은 꼴이다. 재료 둘을 받아 결과 하나를 칸에 적는다. 더하기, 빼기, 비트끼리 견주기, 비트를 옆으로 밀기, 어느 쪽이 작은지 묻기가 있고, 재료 하나를 칸 대신 명령에 직접 적은 작은 수로 바꾼 꼴도 있다. 꼴이 하나라 외우기 쉽고 회로도 단순하다. 대신 명령에 직접 적는 수는 열여섯 비트까지만 들어가고, 그 수를 서른두 비트로 늘리는 방법이 명령마다 달라서 음수나 큰 수를 적을 때 조심해야 한다.

</div>


## 예시로 보기

C의 `f = (g + h) - (i + j);` 한 줄에는 더하기가 둘, 빼기가 하나 있다. MIPS 명령 하나는 계산 하나만 하므로 세 줄이 된다. `f`~`j`가 `$s0`~`$s4`에 있다고 하자[^1].

```asm
add $t0, $s1, $s2      # $t0 = g + h
add $t1, $s3, $s4      # $t1 = i + j
sub $s0, $t0, $t1      # f = $t0 - $t1
```

모든 줄이 "결과, 재료, 재료" 순서다. 재료의 수가 늘 둘이라는 규칙이 설계 원칙 "단순하게 하려면 규칙적이어야 한다"의 예다.

값을 넣어 명령마다 결과를 본다. `$t0` = 12, `$t1` = −3(`0xFFFFFFFD`)에서 시작한다[^s1].

| 명령 | 결과 (16진수) | 10진수로 | 한 일 |
|---|---|---|---|
| `add $t2, $t0, $t1` | `0x00000009` | 9 | 12 + (−3) |
| `sub $t3, $t0, $t1` | `0x0000000F` | 15 | 12 − (−3) |
| `sll $t4, $t0, 2` | `0x00000030` | 48 | 왼쪽으로 2칸. 4배 |
| `srl $t5, $t1, 28` | `0x0000000F` | 15 | 오른쪽으로 28칸. 빈자리는 0 |
| `and $t6, $t0, $t1` | `0x0000000C` | 12 | 둘 다 1인 비트만 1 |
| `or $t7, $t0, $t1` | `0xFFFFFFFD` | −3 | 하나라도 1인 비트는 1 |
| `nor $s0, $t0, $zero` | `0xFFFFFFF3` | −13 | 12의 모든 비트를 뒤집는다 |
| `slt $s1, $t1, $t0` | `0x00000001` | 1 | −3 < 12는 참 |
| `sltu $s2, $t1, $t0` | `0x00000000` | 0 | 부호 없이 보면 4,294,967,293 < 12는 거짓 |
| `andi $s3, $t1, 0xff` | `0x000000FD` | 253 | 아래 8비트만 남긴다 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 열 줄, 예시 세 줄(무작위 1,000회), 즉시값의 부호 확장과 제로 확장, `lui`·`ori`로 만든 `0x1A2B3C4D`, `add`의 넘침과 `addu`, `nor`로 뒤집기(8비트 전수), 카드의 값 — [15_mips-arithmetic-logic_verify.py](/Hongs_Blog/studies/computer-architecture/code/15_mips-arithmetic-logic_verify/). 실제 하드웨어가 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 명령 표

$$R[x]$$는 레지스터 $$x$$의 값이다. `rd`, `rs`, `rt`는 레지스터 자리의 이름이고 뜻은 [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)에서 다룬다. 여기서는 `rd`와 `rt`가 결과 자리, 나머지가 재료 자리라고만 읽으면 된다[^2].

**레지스터끼리.**

| 명령 | 하는 일 | 읽는 법 |
|---|---|---|
| `add rd, rs, rt` | $$R[rd] = R[rs] + R[rt]$$ | 더한다 |
| `sub rd, rs, rt` | $$R[rd] = R[rs] - R[rt]$$ | 뺀다 |
| `and rd, rs, rt` | $$R[rd] = R[rs] \mathbin{\&} R[rt]$$ | 비트마다 "그리고" |
| `or rd, rs, rt` | $$R[rd] = R[rs] \mid R[rt]$$ | 비트마다 "또는" |
| `nor rd, rs, rt` | $$R[rd] = \sim(R[rs] \mid R[rt])$$ | "또는"을 한 뒤 뒤집는다 |
| `slt rd, rs, rt` | $$R[rd] = 1$$ ($$R[rs] < R[rt]$$일 때), 아니면 0 | 작으면 1로 둔다 (set on less than) |
| `sll rd, rt, shamt` | $$R[rd] = R[rt] \ll shamt$$ | 왼쪽으로 민다 (shift left logical) |
| `srl rd, rt, shamt` | $$R[rd] = R[rt] \gg shamt$$ | 오른쪽으로 민다. 빈자리는 0 (shift right logical) |

**명령에 수를 직접 적는 꼴.** 명령 안에 적은 상수를 즉시값이라 부른다. 16비트다.

| 명령 | 하는 일 | 16비트를 32비트로 늘리는 법 |
|---|---|---|
| `addi rt, rs, imm` | $$R[rt] = R[rs] + imm$$ | 부호를 지킨다 |
| `slti rt, rs, imm` | $$R[rt] = 1$$ ($$R[rs] < imm$$일 때), 아니면 0 | 부호를 지킨다 |
| `andi rt, rs, imm` | $$R[rt] = R[rs] \mathbin{\&} imm$$ | 위쪽을 0으로 채운다 |
| `ori rt, rs, imm` | $$R[rt] = R[rs] \mid imm$$ | 위쪽을 0으로 채운다 |
| `lui rt, imm` | $$R[rt] = imm \times 2^{16}$$ | 즉시값을 위쪽 16비트에 놓고 아래쪽은 0 |

부호를 지키며 늘리는 것을 부호 확장, 위쪽을 0으로 채우는 것을 제로 확장이라 부른다. 16비트 `0xFFFF`는 부호 확장하면 `0xFFFFFFFF`(−1)이고 제로 확장하면 `0x0000FFFF`(65,535)다. 그래서 `addi $t0, $zero, -1`은 `$t0`을 `0xFFFFFFFF`로 만들고, `ori $t1, $zero, 0xffff`는 `$t1`을 `0x0000FFFF`로 만든다. 산술 명령은 음수를 적을 수 있어야 하고, 논리 명령은 비트 무늬를 그대로 써야 하기 때문에 방법이 갈린다[^s1].

**없는 명령과 그 대신.**

- 빼기의 즉시값 꼴(`subi`)은 없다. `addi`에 음수를 적는다: `addi $s1, $s2, -5`.
- 비트를 뒤집는 명령(NOT)은 없다. `nor`의 한쪽 재료를 `$zero`로 둔다. 0과 "또는"을 하면 그대로이고, 그것을 뒤집기 때문이다[^3].
- 상수를 레지스터에 넣는 명령이 따로 없다. `$zero`에 더한다: `addi $s0, $zero, 1000`[^4].
- 32비트 상수는 명령 하나에 안 들어간다. 위쪽 16비트를 `lui`로 넣고 아래쪽 16비트를 `ori`로 붙인다[^5].

```asm
lui $t0, 0x1a2b            # $t0 = 0x1A2B0000
ori $t0, $t0, 0x3c4d       # $t0 = 0x1A2B3C4D
```

**넘침.** `add`, `addi`, `sub`는 부호 있는 수로 계산한 결과가 32비트에 들어가지 않으면 프로그램을 멈추고 운영체제에 알린다. 이것을 넘침 예외라 부른다. 이름 끝에 `u`가 붙은 `addu`, `addiu`, `subu`는 같은 계산을 하되 넘쳐도 알리지 않고 아래 32비트만 남긴다[^6]. `0x7FFFFFFF`에 1을 더하면 `addi`는 예외를 내고 `addiu`는 `0x80000000`을 남긴다.

**부호 있는 비교와 부호 없는 비교.** `slt`는 두 값을 부호 있는 수로, `sltu`는 부호 없는 수로 견준다[^6]. 같은 비트 `0xFFFFFFFD`가 앞에서는 −3, 뒤에서는 4,294,967,293이라 표의 두 줄처럼 답이 달라진다.

## 활용

- 왼쪽으로 $$k$$칸 밀면 $$2^k$$배다. 배열 원소 번호를 4배 해서 바이트 거리로 바꿀 때 `sll $t1, $s3, 2`를 쓴다.
- `andi`로 원하는 비트만 남기고(마스크), `ori`로 원하는 비트를 켠다.
- 이 명령들을 실제로 계산하는 회로가 [ALU](/Hongs_Blog/studies/computer-architecture/alu/)다. `slt`는 빼기를 한 뒤 결과의 부호를 본다.
- 흔한 실수: `andi $t0, $t1, -1`처럼 논리 명령에 음수를 적는 것. 제로 확장이라 위쪽 16비트가 0이 된다.
- 흔한 실수: `srl`로 음수를 2로 나누려는 것. 빈자리에 0이 들어가 큰 양수가 된다. 부호 비트를 채워 넣는 `sra`(shift right arithmetic)를 쓴다. −3을 `srl`로 1칸 밀면 `0x7FFFFFFE`, `sra`로 밀면 `0xFFFFFFFE`(−2)다[^6].

## 연결

- 선수: [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/), 음수를 적는 법은 [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- x86과 견주기: x86은 계산할 때마다 결과가 0인지, 넘쳤는지를 플래그에 남긴다([산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)). MIPS에는 플래그가 없다. 넘침은 예외로 알리고, 크기 비교는 `slt`가 결과를 보통 레지스터에 적는다.
- 밀기의 두 종류: [논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/). 늘리기의 두 종류: [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)
- 컴파일러 과목의 [코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)에는 `subi`, `mul`, `div`, `sgt` 같은 편의 명령이 있다. 위 표에는 없다. 곱셈과 나눗셈은 [곱셈 회로](/Hongs_Blog/studies/computer-architecture/multiplier-circuit/)와 [나눗셈 회로](/Hongs_Blog/studies/computer-architecture/divider-circuit/)에서 다룬다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `$s0` = 20, `$s1` = −6에서 다음을 차례로 실행한다. `$t0`~`$t3`의 값은? `sub $t0, $s0, $s1` / `sll $t1, $t0, 3` / `slt $t2, $s0, $s1` / `andi $t3, $s1, 0xf`</summary>

**답:** `$t0` = 26, `$t1` = 208, `$t2` = 0, `$t3` = 10.<br>
**이유:** 20 − (−6) = 26. 3칸 밀면 8배라 208. 20 < −6은 거짓이라 0. −6은 `0xFFFFFFFA`이고 아래 4비트가 `A`(10)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `addi $t0, $zero, 0xffff`는 명령 하나의 기계어로 옮길 수 없고 `ori $t0, $zero, 0xffff`는 옮길 수 있다. 왜인가? 그리고 `$t0`에 −1을 넣으려면 어떻게 적는가?</summary>

**답:** `addi`의 즉시값은 부호 있는 16비트라 −32,768~32,767만 적을 수 있다. `0xffff`는 65,535라 범위 밖이다. `ori`는 제로 확장이라 0~65,535를 적는다. −1은 `addi $t0, $zero, -1`로 넣는다. 16비트 `0xFFFF`가 부호 확장되어 `0xFFFFFFFF`가 된다.<br>
**이유:** 같은 16비트 `0xFFFF`가 명령에 따라 −1로도 65,535로도 읽힌다. 어느 쪽인지는 명령이 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 가운데 MIPS에 실제로 있는 명령이 아닌 것을 골라라. ① `addi $t0, $t1, -4` ② `subi $t0, $t1, 4` ③ `nor $t0, $t1, $zero` ④ `not $t0, $t1` ⑤ `sll $t0, $t1, 2`</summary>

**답:** ②와 ④.<br>
**이유:** 빼기의 즉시값 꼴은 `addi`에 음수를 적는 것으로 대신하고, 뒤집기는 `nor`에 `$zero`를 넣는 것으로 대신한다. 명령 수를 줄이는 쪽을 고른 것이다. 어셈블러에 따라 ②와 ④를 받아 다른 명령으로 바꿔 주기도 하지만, 기계어에는 그런 명령이 없다.

</details>


[^1]: University of Utah CS3810 (R. Balasubramonian), Lecture 3 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-03.pdf, 슬라이드 7~8 (f = (g + h) − (i + j)를 add 둘과 sub 하나로). Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장 "Instructions: Language of the Computer"
[^2]: MIPS Reference Data(Green Sheet), NUS CS2100 공개본 https://www.comp.nus.edu.sg/~cs2100/lect/MIPS_Reference_Data_page1.pdf (CORE INSTRUCTION SET 표의 동작 식. 주 (2) SignExtImm, 주 (3) ZeroExtImm. addi·slti는 SignExtImm, andi·ori는 ZeroExtImm)
[^3]: University of Utah CS3810, Lecture 4 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-04.pdf, 슬라이드 10 (논리 연산 표: sll, srl, and·andi, or·ori, NOT은 nor)
[^4]: 같은 자료, 슬라이드 2 (상수를 레지스터에 넣으려면 `$zero`에 더한다: `addi $s0, $zero, 1000`)
[^5]: University of Utah CS3810, Lecture 5 "Procedure Calls", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-05.pdf, 슬라이드 13 (즉시값은 16비트, lui로 위쪽 16비트를 넣고 OR로 합쳐 32비트 상수를 만든다)
[^6]: Green Sheet, 같은 자료 (주 (1) May cause overflow exception이 add·addi·sub에 붙고 addu·addiu·subu에는 없다. 주 (6) sltu는 피연산자를 부호 없는 수로 본다. sra는 `>>>`). Cornell CS3410 MIPS Reference Sheet, https://www.cs.cornell.edu/courses/cs3410/2018fa/resources/3410_MIPS.pdf (Add (with overflow), Add Unsig. (no overflow))
[^s1]: 값을 넣은 표, 부호 확장과 제로 확장이 갈리는 까닭, 활용 절의 실수 예, 카드는 위 자료에 그대로 있지 않다. 값은 검증 코드의 흉내기로 구했다.
{% endraw %}
