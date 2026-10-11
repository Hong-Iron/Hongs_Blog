---
layout: "note"
title: "데이터패스 추적 예제 사다리"
display_title: "데이터패스 추적 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "25"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 단일 사이클 데이터패스의 길, 제어 장치와 제어 신호의 표, MIPS 명령어 형식의 필드."
prev_url: "/studies/computer-architecture/mips-encoding-ladder/"
prev_title: "명령어 인코딩 예제 사다리"
next_url: "/studies/computer-architecture/pipeline-hazard-ladder/"
next_title: "파이프라인 해저드 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/datapath-tracing-ladder/"
---
{% raw %}
사용 개념: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)의 길, [제어 장치와 제어 신호](/Hongs_Blog/studies/computer-architecture/control-unit/)의 표, [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)의 필드.

"이 명령어를 실행하는 한 사이클 동안 도선마다 무슨 값이 흐르는가"는 늘 같은 하위목표의 반복이다. ① 명령어를 필드로 나눈다 ② 제어 신호를 정한다 ③ 레지스터를 읽고 16비트를 늘린다 ④ ALU의 두 입력과 결과를 구한다 ⑤ 데이터 메모리에서 일어나는 일을 적는다 ⑥ 레지스터에 쓰는 것과 다음 PC를 정한다.

네 문제 모두 처음 상태는 같다. `$s0` = 200, `$s1` = 9, `$s2` = 9, `$t1` = 31이다(문제 4만 `$s1`, `$s2`를 바꾼다). 레지스터 번호는 `$t0` = 8, `$t1` = 9, `$s0` = 16, `$s1` = 17, `$s2` = 18이다[^1].

## 문제 1 · 완전한 풀이

PC = 24에 `lw $t1, 12($s0)`이 있다. 메모리 212번지에는 55가 들어 있다. 이 사이클의 도선 값과 끝난 뒤의 상태를 구하라.

1. *필드 나누기:* `lw`는 I형이다. opcode 35, rs = 16(`$s0`), rt = 9(`$t1`), 아래 16비트 = 12. 기계어는 `0x8E09000C`다.
2. *제어 신호:* RegDst 0, ALUSrc 1, MemtoReg 1, RegWrite 1, MemRead 1, MemWrite 0, Branch 0, ALUOp 00.
3. *레지스터 읽기와 늘리기:* 읽은 값 1 = `$s0` = 200. 12를 32비트로 늘리면 `0x0000000C`.
4. *ALU:* ALUSrc가 1이라 둘째 입력은 늘린 12다. ALUOp 00은 더하기다. $$200 + 12 = 212$$. Zero = 0.
5. *데이터 메모리:* MemRead가 1이다. 212번지를 읽어 55가 나온다.
6. *쓰기와 다음 PC:* RegDst 0이라 쓸 곳은 rt(`$t1`), MemtoReg 1이라 쓸 값은 메모리에서 읽은 55다. Branch가 0이라 다음 PC = $$24 + 4 = 28$$.

끝난 뒤: `$t1` = 55, PC = 28. 메모리는 그대로다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 기계어, 도선 값, 끝난 뒤의 상태 — [24_single-cycle-datapath_impl.py](/Hongs_Blog/studies/computer-architecture/code/24_single-cycle-datapath_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

PC = 28에 `sw $t1, -8($s0)`이 있다. `$t1` = 31이다(문제 1을 실행하기 전의 값으로 본다).

1. *필드 나누기:* opcode 43, rs = 16(`$s0`), rt = 9(`$t1`), 아래 16비트 = `0xFFF8`($$-8$$). 기계어는 `0xAE09FFF8`.
2. *제어 신호:* RegDst X, ALUSrc 1, MemtoReg X, RegWrite 0, MemRead 0, MemWrite 1, Branch 0, ALUOp 00.
3. *레지스터 읽기와 늘리기:* 읽은 값 1 = 200, 읽은 값 2 = `$t1` = 31. `0xFFF8`을 늘리면 `0xFFFFFFF8`.
4. *ALU:* $$200 + (-8) = 192$$.
5. *데이터 메모리:* MemWrite가 1이다. 주소는 ALU 결과 192, 쓸 값은 읽은 값 2인 31이다.
6. *쓰기와 다음 PC:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

RegWrite가 0이라 레지스터에는 아무것도 쓰지 않는다. RegDst와 MemtoReg가 X인 것도 이 때문이다. Branch가 0이라 다음 PC = $$28 + 4 = 32$$. 끝난 뒤: 메모리 192번지 = 31, 레지스터는 그대로, PC = 32.<br>
흔한 오답: "`$t1`에 192를 쓴다". `sw`에서 rt는 쓸 곳이 아니라 메모리에 넣을 값을 읽어 오는 곳이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

PC = 48에 `beq $s1, $s2, -5`가 있다. 여기서 $$-5$$는 명령어의 16비트 칸에 든 값이다. `$s1` = `$s2` = 9다.

1. *필드 나누기:* opcode 4, rs = 17, rt = 18, 아래 16비트 = `0xFFFB`. 기계어는 `0x1232FFFB`.
2. *제어 신호:* ______
3. *레지스터 읽기와 늘리기:* 읽은 값 1 = 9, 읽은 값 2 = 9. `0xFFFB`를 늘리면 `0xFFFFFFFB`.
4. *ALU:* ______
5. *데이터 메모리:* 읽지도 쓰지도 않는다.
6. *쓰기와 다음 PC:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. RegDst X, ALUSrc 0, MemtoReg X, RegWrite 0, MemRead 0, MemWrite 0, Branch 1, ALUOp 01.
4. ALUSrc가 0이라 두 입력은 9와 9다. ALUOp 01은 빼기(ALU 제어 0110)다. $$9 - 9 = 0$$이고 Zero = 1.
6. 레지스터에 쓰지 않는다. 분기 목표 = $$(48 + 4) + (-5 \times 4) = 52 - 20 = 32$$. PCSrc = Branch · Zero = 1이라 다음 PC = 32.<br>
흔한 오답: 목표를 $$48 - 20 = 28$$로 구하는 것. 기준은 분기 명령의 주소가 아니라 그다음 명령어의 주소(PC + 4)다.

</details>


## 문제 4 · 독립 문제

PC = 0에 기계어 `0x0232402A`가 있다. `$s1` = `0xFFFFFFFB`, `$s2` = 3이다. 무슨 명령어인지 풀어내고, 이 사이클의 제어 신호, ALU의 두 입력과 결과, 끝난 뒤 바뀌는 것을 모두 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

2진수로 `000000 10001 10010 01000 00000 101010`이다. opcode 0이라 R형이고, rs = 17(`$s1`), rt = 18(`$s2`), rd = 8(`$t0`), funct = `101010`(42)이다. `slt $t0, $s1, $s2`다.<br>
제어 신호: RegDst 1, ALUSrc 0, MemtoReg 0, RegWrite 1, MemRead 0, MemWrite 0, Branch 0, ALUOp 10. ALU 제어는 funct를 보고 0111(작으면 1)을 낸다.<br>
ALU: 두 입력은 `0xFFFFFFFB`와 3이다. `slt`는 부호 있는 수로 견준다. `0xFFFFFFFB`는 $$-5$$이고 $$-5 < 3$$이라 결과는 1이다. Zero = 0.<br>
끝난 뒤: `$t0` = 1, PC = 4. 메모리는 그대로다.<br>
흔한 오답: `0xFFFFFFFB`를 약 43억인 양수로 보고 결과를 0으로 쓰는 것.

</details>


[^1]: 명령어의 형식과 opcode·funct 값은 MIPS Reference Data (교재의 참조표, Univ. of Patras 게시본), https://eclass.upatras.gr/modules/document/file.php/EE805/MIPS_Instruction_Set/MIPSReferenceData.pdf. 제어 신호의 값은 [제어 장치와 제어 신호](/Hongs_Blog/studies/computer-architecture/control-unit/)의 표와 그 출처를 따른다. 네 문제의 명령어와 수치는 이 문서에서 새로 만든 것이다.
{% endraw %}
