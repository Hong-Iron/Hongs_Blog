---
layout: "note"
title: "MIPS 레지스터와 메모리 피연산자"
display_title: "MIPS 레지스터와 메모리 피연산자 (MIPS Operands)"
kind: "concept"
kind_label: "정의"
num: "14"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["MIPS Operands", "MIPS 레지스터", "MIPS Registers", "$zero", "$t0", "$s0", "lw", "sw", "load word", "store word", "워드", "Word", "바이트 주소", "Byte Addressing", "워드 정렬", "Alignment", "빅 엔디언", "Big-Endian", "엔디언", "Endianness", "베이스 레지스터", "오프셋"]
description: "목수는 창고에 쌓인 나무를 바로 자르지 않는다. 작업대에 올려놓고 자른 뒤 다시 창고에 넣는다. MIPS도 계산은 프로세서 안의 작은 칸 서른두 개에서만 하고, 메모리의 값은 꺼내 오는 명령과 넣어 두는 명령 둘로만 옮긴다. 칸이 가까이 있어 빠르지만 서른두 개뿐이라 변수가 많으면…"
prev_url: "/studies/computer-architecture/risc-vs-cisc/"
prev_title: "RISC와 CISC 비교"
next_url: "/studies/computer-architecture/mips-arithmetic-logic/"
next_title: "MIPS 산술·논리 명령"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/mips-operands/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

목수는 창고에 쌓인 나무를 바로 자르지 않는다. 작업대에 올려놓고 자른 뒤 다시 창고에 넣는다. MIPS도 계산은 프로세서 안의 작은 칸 서른두 개에서만 하고, 메모리의 값은 꺼내 오는 명령과 넣어 두는 명령 둘로만 옮긴다. 칸이 가까이 있어 빠르지만 서른두 개뿐이라 변수가 많으면 계속 꺼내고 넣어야 한다. 메모리의 자리는 "어느 칸에 든 주소에서 몇 바이트 뒤"로 가리키는데, 번호가 바이트마다 붙어 있어서 배열의 다음 원소는 1이 아니라 4만큼 뒤에 있다.

</div>


## 예시로 보기

C에서는 변수마다 메모리에 자리가 있다. 그런데 메모리까지 다녀오는 일은 비싸다. 같은 변수를 여러 번 쓴다면 프로세서 안의 칸으로 가져와서 거기서 계산하는 편이 낫다. MIPS는 한 걸음 더 나아가 `add`, `sub` 같은 계산 명령이 레지스터만 쓰도록 못 박았다[^1].

배열 `A`의 원소를 쓰는 C 두 줄을 옮긴다. 변수 `g`는 `$s1`, `h`는 `$s2`에 있고 배열 `A`가 시작하는 주소는 `$s3`에 있다[^s1].

```asm
# g = h + A[5];
lw  $t0, 20($s3)       # $s3 + 20번지의 값을 꺼내 $t0에 둔다
add $s1, $s2, $t0      # g = h + A[5]
# A[7] = g;
sw  $s1, 28($s3)       # $s1의 값을 $s3 + 28번지에 넣는다
```

`A[5]`인데 5가 아니라 20을 더했다. 원소 하나가 4바이트이고 주소는 바이트마다 붙기 때문이다. `A`가 `0x10000000`번지에서 시작한다면 메모리는 이렇게 놓인다.

```
 주소           원소     원소 번호 × 4
 0x10000000     A[0]      0
 0x10000004     A[1]      4
 0x10000008     A[2]      8
 ...
 0x10000014     A[5]     20   ← lw  $t0, 20($s3)
 0x10000018     A[6]     24
 0x1000001C     A[7]     28   ← sw  $s1, 28($s3)
```

`A[5]` = 40, `h` = 2이면 실행 뒤 `g` = 42이고 `0x1000001C`번지에 42가 들어간다.

`20($s3)`은 "`$s3`에 든 주소에서 20바이트 뒤"라고 읽는다. 괄호 안의 레지스터를 베이스 레지스터, 괄호 밖의 수를 오프셋이라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 줄의 실행 결과(`g` = 42, `A[7]` = 42), 4의 배수가 아닌 주소에서 워드를 읽으면 막히는 것, 엔디언 예의 바이트 배치와 `lb` 결과, `$zero`에 써도 0인 것, 카드의 값 — [14_mips-operands_verify.py](/Hongs_Blog/studies/computer-architecture/code/14_mips-operands_verify/). 실제 하드웨어가 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 정의

**레지스터.** MIPS에는 32비트 레지스터가 32개 있다[^2]. 32비트 한 덩어리(4바이트)를 **워드**라 부른다[^1]. 레지스터는 0~31의 번호로 가리키고, 어셈블리어에서는 쓰임새를 딴 이름으로 적는다[^3].

| 이름 | 번호 | 쓰임 | 호출 뒤에도 값이 그대로인가 |
|---|---|---|---|
| `$zero` | 0 | 늘 0 | (바뀌지 않는다) |
| `$at` | 1 | 어셈블러가 잠깐 쓰는 칸 | 아니다 |
| `$v0`~`$v1` | 2~3 | 함수가 돌려주는 값 | 아니다 |
| `$a0`~`$a3` | 4~7 | 함수에 넘기는 값 | 아니다 |
| `$t0`~`$t7` | 8~15 | 잠깐 쓰는 값 | 아니다 |
| `$s0`~`$s7` | 16~23 | 오래 두는 값 | 그렇다 |
| `$t8`~`$t9` | 24~25 | 잠깐 쓰는 값 | 아니다 |
| `$k0`~`$k1` | 26~27 | 운영체제가 쓰는 칸 | 아니다 |
| `$gp` | 28 | 전역 변수 구역을 가리킨다 | 그렇다 |
| `$sp` | 29 | 스택 꼭대기를 가리킨다 | 그렇다 |
| `$fp` | 30 | 지금 함수의 스택 구역을 가리킨다 | 그렇다 |
| `$ra` | 31 | 함수가 끝나면 돌아갈 주소 | 그렇다 |

마지막 열은 [MIPS 프로시저 호출](/Hongs_Blog/studies/computer-architecture/mips-procedure-call/)에서 쓴다. 하드웨어가 특별히 다루는 칸은 `$zero`(써도 0이다)와 `$ra`(함수를 부르는 명령이 여기에 주소를 넣는다)뿐이다. 나머지 이름은 프로그래머끼리의 약속이다[^s1]. C 변수는 보통 `$s0`~`$s7`에, 계산 중간값은 `$t0`~`$t9`에 둔다[^1].

레지스터가 32개인 까닭은 설계 원칙 "작을수록 빠르다"다. 칸이 많아지면 그 가운데 하나를 고르는 회로가 커지고 느려진다.

**메모리 명령.** 메모리에 닿는 명령은 둘이다[^5].

| 명령 | 하는 일 |
|---|---|
| `lw $t0, 8($t3)` | `$t3 + 8`번지의 워드를 꺼내 `$t0`에 넣는다 (load word) |
| `sw $t0, 8($t3)` | `$t0`의 워드를 `$t3 + 8`번지에 넣는다 (store word) |

기호로 쓰면 이렇다. $$R[x]$$는 레지스터 $$x$$의 값, $$M[a]$$는 $$a$$번지의 워드, $$\mathrm{SignExt}$$는 16비트 수를 부호를 지키며 32비트로 늘린 것이다[^3].

$$\texttt{lw}:\ R[rt] = M[R[rs] + \mathrm{SignExt}(imm)], \qquad \texttt{sw}:\ M[R[rs] + \mathrm{SignExt}(imm)] = R[rt]$$


오프셋은 16비트라 $$-32768$$부터 $$32767$$까지 적을 수 있다. 음수도 된다.

**바이트 주소와 정렬.** 메모리의 주소는 바이트마다 하나씩 붙는다. 워드는 4바이트이므로 이웃한 워드의 주소는 4씩 차이 난다. 워드의 주소는 4의 배수여야 한다[^6]. 그래서 배열 원소 `A[i]`의 오프셋은 $$4i$$다.

**엔디언.** 워드 하나의 4바이트를 어느 쪽부터 낮은 주소에 놓는지에는 두 방식이 있다.

- 빅 엔디언: 가장 윗자리 바이트가 가장 낮은 주소에 온다.
- 리틀 엔디언: 가장 아랫자리 바이트가 가장 낮은 주소에 온다.

`0x1A2B3C4D`를 `0x10000020`번지에 `sw`로 넣으면 이렇게 된다.

```
 주소            빅 엔디언   리틀 엔디언
 0x10000020        1A           4D
 0x10000021        2B           3C
 0x10000022        3C           2B
 0x10000023        4D           1A
```

워드의 주소 자체는 두 방식에서 같다. 워드를 통째로 `sw`로 넣고 `lw`로 꺼내면 어느 쪽이든 같은 값이 나온다. 차이는 바이트 하나만 꺼낼 때 드러난다. 한 바이트를 꺼내는 `lb`로 `0x10000021`번지를 읽으면 빅 엔디언에서는 `0x2B`, 리틀 엔디언에서는 `0x3C`다. MIPS는 두 방식 모두로 만들 수 있다[확인필요]. 이 과목의 예는 빅 엔디언으로 적는다. x86은 리틀 엔디언이다: [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/).

## 활용

- 상수 0이 자주 필요해서 `$zero`가 있다. 레지스터의 값을 다른 레지스터로 옮기는 명령이 따로 없어도 `add $t0, $s1, $zero`로 된다[^s1].
- 배열 원소의 번호가 변수(`A[i]`)이면 오프셋을 명령에 적을 수 없다. `i`를 4배 해서 배열 주소에 더한 뒤 오프셋 0으로 읽는다: [MIPS 분기와 점프](/Hongs_Blog/studies/computer-architecture/mips-branch-jump/)의 반복문 예.
- 흔한 실수: `A[5]`를 `5($s3)`으로 적는 것. 5번지 뒤는 `A[1]`의 둘째 바이트이고, 4의 배수가 아니라 워드를 읽을 수 없다.
- 흔한 실수: `lw`와 `sw`의 방향. 둘 다 레지스터를 앞에, 메모리를 뒤에 적는다. `sw`에서는 앞에 적은 레지스터가 값을 내주는 쪽이다. 결과를 맨 앞에 적는 다른 명령들과 반대다.

## 연결

- 선수: [명령어 집합 구조](/Hongs_Blog/studies/computer-architecture/instruction-set-architecture/), 회로로 본 레지스터 묶음은 [레지스터 파일과 메모리 소자](/Hongs_Blog/studies/computer-architecture/register-file/)
- x86의 레지스터와 견주기: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/). x86의 `[esi+4]` 같은 표기가 MIPS의 `4($s3)`과 같은 생각이다: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)
- 프로세서 종류와 상관없는 레지스터 이야기: [프로세서 레지스터](/Hongs_Blog/studies/operating-systems/processor-registers/)
- 컴파일러 과목의 [코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)는 레지스터를 `$r0`, `$r1`, …로 적고 쉼표를 뺀다. 실제 MIPS에는 그런 이름이 없고 위 표의 이름을 쓴다.
- `lw`·`sw`의 주소 계산을 다른 방식들과 함께: [MIPS 주소 지정 방식](/Hongs_Blog/studies/computer-architecture/mips-addressing-modes/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** MIPS의 레지스터는 몇 개이고 몇 비트인가? `$zero`, `$sp`, `$ra`의 번호와 쓰임을 쓰라. 메모리에 닿는 명령 둘은?</summary>

**답:** 32개, 32비트. `$zero`는 0번이고 늘 0이다. `$sp`는 29번이고 스택 꼭대기를 가리킨다. `$ra`는 31번이고 돌아갈 주소를 담는다. 메모리 명령은 `lw`(꺼내 오기)와 `sw`(넣어 두기)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 배열 `B`의 시작 주소가 `$s4`에, 변수 `x`가 `$s0`에 있다. `B[3] = B[9] + x;`를 MIPS로 옮겨라. 잠깐 쓰는 칸은 `$t0`을 쓴다.</summary>

**답:** `lw $t0, 36($s4)` / `add $t0, $t0, $s0` / `sw $t0, 12($s4)`<br>
**이유:** 원소 번호에 4를 곱한다. $$9 \times 4 = 36$$, $$3 \times 4 = 12$$. 흔한 오답은 `9($s4)`와 `3($s4)`다. `B`가 `0x10000000`에서 시작하고 `B[9]` = 100, `x` = 23이면 실행 뒤 `0x1000000C`번지에 123이 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `0x8899AABB`를 `0x10000020`번지에 `sw`로 넣었다. 이어서 `lw`로 같은 번지를 읽으면 빅 엔디언과 리틀 엔디언에서 각각 얼마인가? `0x10000020`번지의 한 바이트만 보면 각각 얼마인가? 왜 워드로 읽을 때는 차이가 없는가?</summary>

**답:** `lw`는 두 방식 모두 `0x8899AABB`. 한 바이트는 빅 엔디언에서 `0x88`, 리틀 엔디언에서 `0xBB`.<br>
**이유:** 넣을 때 쓴 순서 그대로 꺼낼 때 다시 모으기 때문이다. 순서가 문제 되는 것은 워드의 일부만 볼 때나, 순서가 다른 기계끼리 데이터를 주고받을 때다.

</details>


[^1]: University of Utah CS3810 (R. Balasubramonian), Lecture 3 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-03.pdf, 슬라이드 9~11 (메모리 접근은 비싸다, add·sub는 레지스터만 쓴다, 32비트 덩어리를 워드라 부른다, `$s0`~`$s7`은 변수에 `$t0`~`$t9`는 임시값에, lw와 sw)
[^2]: Harris & Harris, *Digital Design and Computer Architecture* 2판 6장 강의 슬라이드, https://www.esa.informatik.tu-darmstadt.de/archive/twiki/pub/Lectures/Prozessorarchitektur16De/DDCA_Ch6.pdf, 슬라이드 13 (MIPS has 32 32-bit registers)
[^3]: MIPS Reference Data(Green Sheet), Patterson & Hennessy 교재의 참조표, NUS CS2100 공개본 https://www.comp.nus.edu.sg/~cs2100/lect/MIPS_Reference_Data_page1.pdf (REGISTER NAME, NUMBER, USE, CALL CONVENTION 표. lw와 sw의 동작 식)
[^5]: University of Utah CS3810, Lecture 4 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-04.pdf, 슬라이드 3~4 (lw와 sw의 꼴: 레지스터, 괄호 안 레지스터에 더하는 상수)
[^6]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장 "Instructions: Language of the Computer" (바이트 주소, 워드 주소는 4의 배수라는 정렬 제약)
[^s1]: 예시의 C 두 줄과 수치, 메모리 배치 그림, 엔디언 예의 값(`0x1A2B3C4D`), "하드웨어가 특별히 다루는 칸은 둘뿐"이라는 정리, 활용 절, 카드는 위 자료에 그대로 있지 않다. 값은 검증 코드의 흉내기로 구했다. `jal`이 31번 레지스터에 주소를 넣는 것은 Green Sheet의 `jal` 줄(R[31] = …)에 있다.
{% endraw %}
