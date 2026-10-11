---
layout: "note"
title: "데이터패스의 구성 요소"
display_title: "데이터패스의 구성 요소 (Datapath Elements)"
kind: "concept"
kind_label: "모델"
num: "23"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Datapath Elements", "데이터패스", "Datapath", "데이터 경로", "프로그램 카운터", "Program Counter", "PC", "명령어 메모리", "Instruction Memory", "데이터 메모리", "Data Memory", "부호 확장기", "Sign Extension Unit", "상태 소자", "State Element", "조합 소자", "Combinational Element"]
description: "프로세서 안에서 값이 지나다니는 길과 그 길에 놓인 부품을 통틀어 데이터패스라 부른다. 부엌에 비기면 재료가 냉장고에서 도마로, 도마에서 냄비로 옮겨 가는 동선이고, 냉장고·도마·냄비가 부품이다. 부품은 두 부류인데, 값을 기억하는 부품은 시계가 울릴 때만 내용이 바뀌고 계산만 하…"
prev_url: "/studies/computer-architecture/floating-point-arithmetic/"
prev_title: "부동소수점 연산"
next_url: "/studies/computer-architecture/single-cycle-datapath/"
next_title: "단일 사이클 데이터패스"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/datapath-elements/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로세서 안에서 값이 지나다니는 길과 그 길에 놓인 부품을 통틀어 데이터패스라 부른다. 부엌에 비기면 재료가 냉장고에서 도마로, 도마에서 냄비로 옮겨 가는 동선이고, 냉장고·도마·냄비가 부품이다. 부품은 두 부류인데, 값을 기억하는 부품은 시계가 울릴 때만 내용이 바뀌고 계산만 하는 부품은 들어온 값이 바뀌면 곧바로 새 답을 낸다. 이 구분을 놓치면 "언제 값이 바뀌는가"를 잘못 짚게 된다.

</div>


## 예시로 보기

`lw $t0, 8($s3)` 하나를 실행하려면 무엇이 필요한지 세어 본다. 이 명령어는 "`$s3`의 값에 8을 더한 주소의 메모리 값을 `$t0`에 넣어라"다.

1. 지금 실행할 명령어가 어디 있는지 알아야 한다. → 주소를 기억하는 칸
2. 그 주소에서 명령어 32비트를 꺼내야 한다. → 명령어가 든 메모리
3. `$s3`의 값을 읽고, 나중에 `$t0`에 써야 한다. → 레지스터 32개 묶음
4. 명령어 안의 8은 16비트인데 `$s3`의 값은 32비트다. 길이를 맞춰야 한다. → 16비트를 32비트로 늘리는 부품
5. 둘을 더해야 한다. → 덧셈을 하는 부품
6. 그 주소의 값을 읽어야 한다. → 데이터가 든 메모리
7. 다음 명령어의 주소를 구해야 한다. → 4를 더하는 부품

부품을 하나도 빼놓을 수 없다. 반대로, 이 일곱 가지만 있으면 덧셈·뺄셈 명령과 분기까지 거의 다 실행된다. [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)가 이 부품들을 선으로 잇는다.

## 부품 목록

프로세서는 둘로 나뉜다. 값이 흐르고 바뀌는 길이 데이터패스(datapath)이고, 명령어를 보고 그 길의 부품들에 "이번엔 이렇게 해라" 하고 시키는 쪽이 제어(control)다[^1]. 이 문서는 데이터패스 쪽 부품만 다룬다.

| 부품 | 들어가는 것 | 나오는 것 | 부류 |
|---|---|---|---|
| 프로그램 카운터(PC) | 다음 명령어의 주소 | 지금 명령어의 주소 (32비트) | 기억 |
| 명령어 메모리 | 주소 | 그 주소의 명령어 32비트 | 읽기만 하므로 계산처럼 다룬다 |
| 레지스터 파일 | 읽을 번호 둘(5비트씩), 쓸 번호(5비트), 쓸 값, 쓰기 신호 | 읽은 값 둘 (32비트씩) | 기억 |
| 부호 확장기 | 16비트 값 | 32비트 값 | 계산 |
| 왼쪽 2칸 밀기 | 32비트 값 | 4를 곱한 값 | 계산 |
| ALU | 32비트 값 둘, 연산을 고르는 신호 | 결과 32비트, 결과가 0인지 알리는 1비트(Zero) | 계산 |
| 가산기 | 32비트 값 둘 | 합 | 계산 |
| 데이터 메모리 | 주소, 쓸 값, 읽기 신호, 쓰기 신호 | 읽은 값 | 기억 |
| 멀티플렉서 | 값 둘, 고르는 신호 1비트 | 둘 중 하나 | 계산 |

### 기억하는 부품과 계산하는 부품

- **기억하는 부품(상태 소자).** PC, 레지스터 파일, 데이터 메모리다. 안에 든 값은 클록이 올라가는 순간에만 바뀐다. 그것도 쓰기 신호가 1일 때만이다. PC는 사이클마다 바뀌므로 쓰기 신호를 따로 두지 않는다[^2].
- **계산하는 부품(조합 소자).** ALU, 가산기, 부호 확장기, 멀티플렉서다. 기억이 없다. 입력이 바뀌면 조금 뒤 출력이 따라 바뀐다.

한 사이클은 이렇게 흐른다. 클록이 올라가면 기억하는 부품에서 값이 나온다. 그 값이 계산하는 부품들을 차례로 지난다. 다음 클록이 올라갈 때 결과가 기억하는 부품에 들어간다. 그래서 같은 사이클 안에 레지스터를 읽고, 계산하고, 다시 같은 레지스터에 쓸 수 있다. 읽은 것은 옛 값이고 쓰는 것은 다음 클록에 들어가기 때문이다([클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/)).

레지스터 파일은 읽기는 계산처럼, 쓰기는 기억처럼 군다. 읽을 번호를 주면 클록과 상관없이 값이 나오고, 쓰기는 클록이 올라갈 때만 일어난다([레지스터 파일과 메모리 소자](/Hongs_Blog/studies/computer-architecture/register-file/)).

### 길이를 맞추는 두 부품

**부호 확장.** 명령어 안의 16비트 수를 32비트로 늘린다. 맨 위 비트(15번 비트)를 위쪽 16칸에 그대로 복사한다. 이렇게 하면 2의 보수로 읽은 값이 그대로다.

$$\text{0x0008} \to \text{0x00000008} \;(8), \qquad \text{0xFFFC} \to \text{0xFFFFFFFC} \;(-4)$$


위쪽을 0으로만 채우면 `0xFFFC`가 $$-4$$가 아니라 65,532가 된다. `lw $t0, -4($s3)`이 4바이트 앞이 아니라 6만 바이트 뒤를 읽게 된다.

**왼쪽으로 2칸 밀기.** 분기 명령의 16비트 칸에는 "명령어 몇 개만큼 건너뛰나"가 적혀 있다. 명령어 하나가 4바이트이므로 4를 곱해야 바이트 거리가 된다. 2진수에서 왼쪽으로 두 칸 미는 것이 4를 곱하는 것이다. 예: 3 → 12.

분기가 갈 주소는 이 둘을 이어서 구한다[^3].

$$\text{분기 목표} = (\text{PC} + 4) + (\text{부호 확장한 16비트} \ll 2)$$


$$\ll 2$$는 "왼쪽으로 두 칸 민다"로 읽는다. PC가 `0x00400020`이고 16비트 칸이 3이면 $$\text{0x00400024} + 12 = \text{0x00400030}$$이다. 칸이 `0xFFFD`($$-3$$)이면 $$\text{0x00400024} - 12 = \text{0x00400018}$$로 뒤로 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 16비트 값 65,536가지 모두에서 부호 확장 뒤 값이 그대로임, 왼쪽 2칸 밀기 = 4 곱하기, 위 분기·점프 주소, 레지스터 0번은 늘 0 — [23_datapath-elements_verify.py](/Hongs_Blog/studies/computer-architecture/code/23_datapath-elements_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


### 메모리가 왜 둘인가

명령어 메모리와 데이터 메모리를 따로 그린다. 한 사이클에 명령어 하나를 끝내는 설계에서는 부품 하나를 한 사이클에 한 번만 쓸 수 있다. `lw`는 명령어를 꺼낼 때 한 번, 데이터를 읽을 때 또 한 번 메모리가 필요하다. 그래서 둘로 나눈다. 같은 이유로 PC에 4를 더하는 가산기와 분기 주소를 구하는 가산기를 ALU와 따로 둔다[^2].

실제 컴퓨터의 메모리는 하나다. 여기서 둘로 그린 것은 설계를 단순하게 보이려는 것이고, 실제로는 명령어용과 데이터용 캐시가 따로 있어서 이 그림과 비슷해진다[^4].

## 활용

- 새 명령어를 넣을 수 있는지 따질 때 이 목록부터 본다. 필요한 부품과 길이 이미 있으면 제어 신호만 더하면 되고, 없으면 부품이나 멀티플렉서를 더해야 한다.
- 흔한 실수: 부호 확장과 2칸 밀기의 순서를 바꾸는 것. 16비트를 먼저 밀면 위쪽 두 비트가 떨어져 나간다. 늘 32비트로 늘린 뒤에 민다.
- 흔한 실수: PC가 1씩 는다고 쓰는 것. 주소는 바이트 단위이고 명령어는 4바이트라서 4씩 는다.

## 연결

- 선수: [ALU](/Hongs_Blog/studies/computer-architecture/alu/), [레지스터 파일과 메모리 소자](/Hongs_Blog/studies/computer-architecture/register-file/), [클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/), [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)
- 둘 중 하나를 고르는 부품: [멀티플렉서와 디코더](/Hongs_Blog/studies/computer-architecture/mux-decoder/)
- 이 부품들을 잇기: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)
- PC와 명령어 레지스터를 운영체제 쪽에서 본 모습: [프로세서 레지스터](/Hongs_Blog/studies/operating-systems/processor-registers/)
- x86에서 길이를 늘리는 명령(MOVZX, MOVSX): [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** PC, ALU, 레지스터 파일, 부호 확장기, 데이터 메모리, 멀티플렉서를 "기억하는 부품"과 "계산하는 부품"으로 나누라. 두 부류는 값이 바뀌는 때가 어떻게 다른가?</summary>

**답:** 기억: PC, 레지스터 파일, 데이터 메모리. 계산: ALU, 부호 확장기, 멀티플렉서.<br>
**이유:** 기억하는 부품의 내용은 클록이 올라가는 순간에만 바뀐다(PC 말고는 쓰기 신호도 1이어야 한다). 계산하는 부품의 출력은 입력이 바뀌면 곧 따라 바뀐다.<br>
**흔한 오답:** 레지스터 파일을 계산 쪽에 넣는 것. 읽기는 클록 없이 되지만 안에 값을 담고 있으므로 기억하는 부품이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 16비트 값 `0x8004`를 부호 확장한 32비트 값을 16진수로 쓰고, 10진수로는 얼마인지 답하라.</summary>

**답:** `0xFFFF8004`, $$-32764$$.<br>
**이유:** 맨 위 비트가 1이므로 위쪽 16칸을 1로 채운다. $$\text{0x8004} = 32772$$이고 $$32772 - 65536 = -32764$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 한 사이클에 명령어 하나를 끝내는 설계에서 명령어 메모리와 데이터 메모리를 따로 두는 이유는?</summary>

**답:** 부품 하나는 한 사이클에 한 번만 쓸 수 있기 때문이다. `lw`와 `sw`는 같은 사이클 안에 명령어도 꺼내고 데이터도 읽거나 써야 한다. 메모리가 하나면 주소를 두 번 넣을 수 없다.<br>
**이유:** 같은 까닭으로 PC + 4를 구하는 가산기와 분기 주소를 구하는 가산기도 ALU와 따로 둔다.

</details>


[^1]: Princeton COS/ELE 375 (Fall 2015, David August), Lecture 8 "Control", 슬라이드 2 (Datapath and Control의 정의), https://www.cs.princeton.edu/courses/archive/fall15/cos375/lectures/08-Control.pdf
[^2]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor". 부품의 종류와 "부품 하나는 한 사이클에 한 번"이라는 설명은 이 장의 내용이다. 절·쪽 번호는 직접 확인하지 못해 적지 않는다.
[^3]: MIPS Reference Data (교재의 참조표, Univ. of Patras 게시본), BranchAddr = { 14{immediate[15]}, immediate, 2'b0 }와 beq의 PC = PC + 4 + BranchAddr, https://eclass.upatras.gr/modules/document/file.php/EE805/MIPS_Instruction_Set/MIPSReferenceData.pdf. Princeton 같은 강의, 슬라이드 8 (PC = SignExt(Imm16) << 2 + PC + 4)
[^4]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 7 (Structure Hazards: 파이프라인 데이터패스는 명령어·데이터 메모리나 캐시를 따로 둔다), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf
{% endraw %}
