---
layout: "note"
title: "MIPS 주소 지정 방식"
display_title: "MIPS 주소 지정 방식 (MIPS Addressing Modes)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["MIPS Addressing Modes", "주소 지정 방식", "Addressing Mode", "즉시 주소 지정", "Immediate Addressing", "레지스터 주소 지정", "Register Addressing", "베이스 주소 지정", "Base Addressing", "변위 주소 지정", "PC 상대 주소 지정", "PC-Relative Addressing", "의사 직접 주소 지정", "Pseudo-Direct Addressing", "분기 주소", "Branch Address", "점프 주소", "Jump Address"]
description: "길을 알려 주는 방법은 여러 가지다. \"이 물건이다\" 하고 직접 건네기, \"세 번째 서랍에 있다\", \"저 건물에서 스무 걸음 뒤\", \"지금 선 자리에서 여섯 집 앞\", \"이 동네 몇 번지\". MIPS 명령이 재료나 갈 곳을 가리키는 방법도 이 다섯 가지다. 명령이 서른두 비트뿐이라…"
prev_url: "/studies/computer-architecture/mips-procedure-call/"
prev_title: "MIPS 프로시저 호출"
next_url: "/studies/computer-architecture/multiplier-circuit/"
next_title: "곱셈 회로"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/mips-addressing-modes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

길을 알려 주는 방법은 여러 가지다. "이 물건이다" 하고 직접 건네기, "세 번째 서랍에 있다", "저 건물에서 스무 걸음 뒤", "지금 선 자리에서 여섯 집 앞", "이 동네 몇 번지". MIPS 명령이 재료나 갈 곳을 가리키는 방법도 이 다섯 가지다. 명령이 서른두 비트뿐이라 주소 전체를 적을 자리가 없어서, 가까운 곳은 "여기서 몇 줄"로, 먼 곳은 "같은 구역의 몇 번째 줄"로 줄여 적는다. 그래서 한 명령으로 갈 수 있는 거리에 끝이 있고, 그보다 멀면 명령을 둘로 나눠야 한다.

</div>


## 예시로 보기

`beq $t0, $zero, Exit`의 `Exit`는 사람이 붙인 이름이다. 기계어에는 수만 들어간다. 그런데 주소는 32비트이고, 명령도 32비트이며 그중 16비트는 이미 op와 레지스터 번호가 썼다. 주소를 통째로 적을 자리가 없다.

[MIPS 분기와 점프](/Hongs_Blog/studies/computer-architecture/mips-branch-jump/)의 반복문을 `0x00400000`번지부터 놓으면 분기와 점프는 이렇게 옮겨진다[^s1].

```
 주소          기계어         어셈블리어
 0x00400008    0x0212402A     Loop: slt  $t0, $s0, $s2
 0x0040000C    0x11000006           beq  $t0, $zero, Exit
 0x00400010    0x00104880           sll  $t1, $s0, 2
 ...
 0x00400024    0x08100002           j    Loop
 0x00400028                   Exit:
```

**`beq`의 16비트 칸에는 6이 들어갔다.** `Exit`의 주소 `0x00400028`이 아니다. "다음 명령에서 몇 줄 뒤인가"를 적은 것이다. `beq` 다음 명령은 `0x00400010`에 있고, `Exit`는 거기서 `0x18` = 24바이트, 곧 명령 6개 뒤다.

**`j`의 26비트 칸에는 `0x0100002`가 들어갔다.** `Loop`의 주소 `0x00400008`을 4로 나눈 값이다. 명령의 주소는 늘 4의 배수라 맨 아래 2비트가 늘 00이다. 늘 같은 것은 적지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 기계어 값과 칸의 값, 분기·점프 주소 식을 무작위 2,000개 명령에서 왕복, 분기가 닿는 범위의 양 끝, 범위를 넘으면 인코더가 막는 것, 먼 분기를 두 명령으로 바꾼 것이 같은 일을 하는지, 카드의 값 — [19_mips-addressing-modes_verify.py](/Hongs_Blog/studies/computer-architecture/code/19_mips-addressing-modes_verify/). 실제 어셈블러가 아니라 파이썬으로 짠 인코더와 흉내기다.</div>

</div>


## 정의

명령이 재료의 위치나 갈 곳을 가리키는 방법을 주소 지정 방식이라 부른다. MIPS에는 다섯 가지가 있다[^1].

| 방식 | 재료나 갈 곳이 있는 데 | 예 |
|---|---|---|
| 즉시 (immediate) | 명령 안의 16비트 상수 그 자체 | `addi $s4, $t5, -73` |
| 레지스터 (register) | 레지스터 | `add $s0, $t2, $t3` |
| 베이스 (base) | 메모리. 주소 = 레지스터 + 16비트 상수 | `lw $s4, 72($t1)` |
| PC 상대 (PC-relative) | 갈 곳 = 다음 명령의 주소 + 16비트 상수 × 4 | `beq $t0, $zero, Exit` |
| 의사 직접 (pseudo-direct) | 갈 곳 = PC의 위 4비트 + 26비트 상수 × 4 | `j Loop`, `jal sum` |

앞의 셋은 계산에 쓸 값을 어디서 얻는지, 뒤의 둘은 다음에 실행할 명령을 어디서 찾는지를 정한다.

**분기 주소(PC 상대).** PC는 지금 실행 중인 명령의 주소다. 분기 명령의 16비트 칸에 든 수를 $$imm$$이라 하면, 갈 곳은 다음 명령의 주소에 $$imm$$을 4배 해 더한 값이다. $$imm$$은 부호 있는 수라 음수면 뒤로 돌아간다[^2].

$$\text{갈 곳} = (\mathrm{PC} + 4) + \mathrm{SignExt}(imm) \times 4$$


거꾸로 어셈블러가 칸에 적을 수는 다음과 같다.

$$imm = \frac{\text{갈 곳} - (\mathrm{PC} + 4)}{4}$$


예시의 `beq`에 넣어 보면 $$(\texttt{0x00400028} - \texttt{0x00400010}) / 4 = 24 / 4 = 6$$이다.

**점프 주소(의사 직접).** 26비트 칸의 수를 $$addr$$라 하면, 갈 곳은 다음 명령 주소의 위 4비트, $$addr$$ 26비트, 00 두 비트를 이어 붙인 32비트다[^2].

$$\text{갈 곳} = \{\,(\mathrm{PC} + 4)[31{:}28],\ addr,\ 00\,\}$$


$$[31{:}28]$$은 31번부터 28번까지의 네 비트라는 뜻이다. 중괄호는 비트를 이어 붙인다는 표시다.

```
 PC 상대:      [  PC + 4 (32비트)  ]  +  [ 부호 확장한 imm ][00]

 의사 직접:    [PC+4의 위 4비트][      addr 26비트      ][00]
                    4비트               26비트            2비트   = 32비트
```

"직접"은 주소를 명령에 그대로 적는다는 뜻이다. 32비트를 다 적지 못하고 위 4비트를 PC에서 빌려 오므로 "의사"(비슷하지만 진짜는 아닌)가 붙었다[^s1].

**닿는 범위.**

- 분기: $$imm$$이 $$-32768$$부터 $$32767$$까지다. 다음 명령에서 뒤로 131,072바이트, 앞으로 131,068바이트까지 간다. 명령 수로는 앞뒤 약 3만 2천 줄이다. 반복문과 `if`는 대개 가까운 곳으로 가므로 이것으로 충분하다[^3].
- 점프: 26비트에 2비트가 붙어 28비트, 곧 $$2^{28}$$바이트 = 256MB짜리 구역 안의 아무 명령이나 가리킨다. 위 4비트가 다른 구역으로는 못 간다.
- 그보다 먼 곳은 주소 32비트를 레지스터에 만들어 넣고 `jr`로 간다[^3].

## 예제

**뒤로 가는 분기.** `0x00400018`에 있는 `bne $t0, $zero, Loop`에서 `Loop`가 `0x00400004`다.

1. *다음 명령의 주소:* `0x00400018` + 4 = `0x0040001C`.
2. *바이트 거리:* `0x00400004` − `0x0040001C` = −24.
3. *명령 수로:* −24 / 4 = −6.
4. *16비트로:* −6 = `0xFFFA`. 기계어는 `0x1500FFFA`.

**기계어에서 갈 곳 찾기.** `0x0040000C`에 있는 `0x08100013`은 어디로 가는가.

1. *op 보기:* 앞 6비트 `000010` = 2. `j`다.
2. *26비트 칸:* `0x0100013`.
3. *두 비트 붙이기:* 4배 하면 `0x040004C`.
4. *위 4비트 빌리기:* PC + 4 = `0x00400010`의 위 4비트는 `0000`. 갈 곳은 `0x0040004C`.

**분기가 닿지 않을 때.** `0x00400010`에 있는 `beq $s0, $s1, Far`에서 `Far`가 40,000줄 뒤(`0x00427114`)라면 $$imm$$ = 40,000이 16비트에 안 들어간다. 조건을 뒤집어 가까운 곳으로 분기하고, 먼 곳은 `j`로 간다[^4].

```asm
      bne $s0, $s1, Skip     # 같지 않으면 점프를 건너뛴다
      j   Far                # 같으면 먼 곳으로
Skip:
```

## 활용

- 코드가 메모리의 다른 곳에 놓여도 분기 명령의 기계어는 바뀌지 않는다. 거리만 적었기 때문이다. 점프 명령은 주소를 적었으므로 코드를 옮기면 고쳐야 한다. 이 일을 링커가 한다[^5].
- 프로세서 안에는 PC + 4에 "부호 확장해 2칸 민 immediate"를 더하는 덧셈기가 따로 있다: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/).
- 흔한 실수: 분기 거리를 분기 명령 자신의 주소에서 재는 것. 다음 명령의 주소(PC + 4)에서 잰다. 한 줄 차이로 틀린다.
- 흔한 실수: 거리를 바이트로 적는 것. 칸에는 명령 수(바이트 ÷ 4)를 적는다.

## 연결

- 선수: [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)(칸의 폭), [MIPS 분기와 점프](/Hongs_Blog/studies/computer-architecture/mips-branch-jump/)(라벨)
- 베이스 방식으로 배열과 스택을 읽는 예: [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/), [MIPS 프로시저 호출](/Hongs_Blog/studies/computer-architecture/mips-procedure-call/)
- x86과 견주기: x86도 재료가 상수, 레지스터, 메모리 셋이다([피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/)). 다만 x86은 32비트 주소를 명령에 통째로 적을 수 있고(명령 길이가 늘어난다), `[esi+4]`처럼 레지스터에 상수를 더하는 꼴이 MIPS의 베이스 방식과 같다([간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)). MIPS는 명령 길이를 지키려고 주소를 줄여 적는 쪽을 골랐다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** MIPS의 주소 지정 방식 다섯 가지를 쓰고, `addi`, `add`, `sw`, `bne`, `jal`이 각각 어느 방식을 쓰는지 짝지어라.</summary>

**답:** 즉시(`addi`), 레지스터(`add`), 베이스(`sw`), PC 상대(`bne`), 의사 직접(`jal`).<br>
**이유:** `addi`도 재료 하나는 레지스터에서 읽으므로 레지스터 방식도 함께 쓴다. 한 명령이 재료마다 다른 방식을 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `0x00400020`에 있는 `beq $s0, $s1, Done`에서 `Done`이 `0x00400040`이다. immediate 칸에 들어갈 수와 기계어 전체를 구하라.</summary>

**답:** immediate = 7, 기계어 `0x12110007`.<br>
**이유:** 다음 명령은 `0x00400024`. `0x00400040` − `0x00400024` = `0x1C` = 28바이트. 28 / 4 = 7. op = 4, rs = `$s0` = 16, rt = `$s1` = 17. 흔한 오답은 `0x00400020`에서 재서 8이라 하는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `0x00400034`에 있는 기계어 `0x0C100004`는 무슨 명령이고 어디로 가는가? 실행 뒤 `$ra`는 얼마인가(PC + 4를 넣는다고 친다)?</summary>

**답:** `jal`이고 `0x00400010`으로 간다. `$ra` = `0x00400038`.<br>
**이유:** 앞 6비트 `000011` = 3이라 `jal`. 26비트 칸 `0x0100004`를 4배 하면 `0x0400010`. PC + 4의 위 4비트 `0000`을 붙이면 `0x00400010`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 분기 명령의 칸에 바이트 거리가 아니라 명령 수를 적는 까닭은 무엇인가? 그렇게 해서 얻는 것을 수로 말하라.</summary>

**답:** 명령은 모두 4바이트이고 4의 배수 주소에 놓인다. 바이트 거리는 늘 4의 배수라 아래 2비트가 늘 00이다. 그 2비트를 적지 않으면 같은 16비트로 4배 먼 곳까지 간다. 바이트로 적으면 앞뒤 약 32KB, 명령 수로 적으면 앞뒤 약 128KB다.

</details>


[^1]: Harris & Harris, *Digital Design and Computer Architecture* 2판 6장 강의 슬라이드, https://www.esa.informatik.tu-darmstadt.de/archive/twiki/pub/Lectures/Prozessorarchitektur16De/DDCA_Ch6.pdf, 슬라이드 104~108 (Register Only, Immediate, Base Addressing, PC-Relative, Pseudo Direct와 각각의 예). Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장 "Instructions: Language of the Computer"
[^2]: MIPS Reference Data(Green Sheet), NUS CS2100 공개본 https://www.comp.nus.edu.sg/~cs2100/lect/MIPS_Reference_Data_page1.pdf (beq: PC = PC + 4 + BranchAddr. 주 (4) BranchAddr = {14{immediate[15]}, immediate, 2'b0}. 주 (5) JumpAddr = {PC+4[31:28], address, 2'b0})
[^3]: University of Utah CS3810 (R. Balasubramonian), Lecture 5 "Procedure Calls", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-05.pdf, 슬라이드 13 (조건 분기의 목적지는 지금 PC에 상대적인 16비트 상수, j는 26비트 상수, 더 필요하면 jr)
[^4]: Patterson & Hennessy, 같은 책, 2장 (먼 곳으로 분기할 때 조건을 뒤집은 분기와 점프로 바꾸는 방법)
[^5]: University of Utah CS3810, Lecture 5, 같은 자료, 슬라이드 16 (링커가 안팎의 참조를 고치고 라벨의 주소를 정한다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시의 주소와 기계어 값, 비트 그림, "의사 직접"이라는 이름의 풀이, 범위의 바이트 수, 세 예제의 수치, 코드를 옮길 때의 차이, 카드는 위 자료에 그대로 있지 않다. 값은 검증 코드의 인코더로 구했다.
{% endraw %}
