---
layout: "note"
title: "제어 장치와 제어 신호"
display_title: "제어 장치와 제어 신호 (Control Unit and Control Signals)"
kind: "concept"
kind_label: "모델"
num: "25"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Control Unit", "제어 유닛", "제어 신호", "Control Signals", "주 제어", "Main Control", "ALU 제어", "ALU Control", "RegDst", "ALUSrc", "MemtoReg", "RegWrite", "MemRead", "MemWrite", "Branch", "ALUOp", "PCSrc", "돈 케어", "Don't Care"]
description: "프로세서 안에서 값이 지나다니는 길이 선로라면, 제어 장치는 선로 전환기를 조작하는 신호소다. 열차(값)는 스스로 길을 고르지 못해서, 신호소가 명령어의 앞머리 몇 비트를 보고 갈림길마다 어느 쪽으로 보낼지, 어느 역에 짐을 내릴지를 정해 준다. 명령어 종류마다 스위치 묶음을 표 …"
prev_url: "/studies/computer-architecture/single-cycle-datapath/"
prev_title: "단일 사이클 데이터패스"
next_url: "/studies/computer-architecture/single-cycle-timing/"
next_title: "단일 사이클의 클록 주기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/control-unit/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로세서 안에서 값이 지나다니는 길이 선로라면, 제어 장치는 선로 전환기를 조작하는 신호소다. 열차(값)는 스스로 길을 고르지 못해서, 신호소가 명령어의 앞머리 몇 비트를 보고 갈림길마다 어느 쪽으로 보낼지, 어느 역에 짐을 내릴지를 정해 준다. 명령어 종류마다 스위치 묶음을 표 한 줄로 적어 두면 그만이라 만들기는 쉽다. 다만 스위치 하나만 잘못 놓아도 엉뚱한 레지스터나 메모리가 덮어써진다.

</div>


## 예시로 보기

제어가 없으면 [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)는 무엇을 할지 모른다. `sw $t0, 12($s3)`을 실행한다고 하자. `$s3` = 100, `$t0` = 12다.

- 맞는 설정: ALU 둘째 입력은 상수 12, 메모리 쓰기는 켜고, 레지스터 쓰기는 끈다. 메모리 112번지에 12가 들어가고 레지스터는 그대로다.
- 레지스터 쓰기만 잘못 켜면: 메모리에는 똑같이 쓰는데, 덤으로 ALU 결과 112가 rt 자리의 `$t0`에 들어간다. `$t0`가 12에서 112로 바뀐다.

`sw`는 레지스터를 고치면 안 되는 명령어다. 신호 1비트가 프로그램을 망가뜨린다. 그래서 명령어 종류마다 모든 신호의 값을 빠짐없이 정해 둔다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 신호 하나를 틀리게 준 다섯 경우(`sw`의 RegWrite, R형의 RegDst·ALUSrc, `lw`의 MemtoReg, `beq`의 Branch)에서 결과가 달라짐, X 칸에 0과 1을 넣은 두 경우가 무작위 프로그램 3,000개에서 같은 결과 — [24_single-cycle-datapath_impl.py](/Hongs_Blog/studies/computer-architecture/code/24_single-cycle-datapath_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 제어 신호 여덟 가지

| 신호 | 0일 때 | 1일 때 | 닿는 부품 |
|---|---|---|---|
| RegDst | 쓸 레지스터 번호 = rt (20~16번 비트) | 쓸 레지스터 번호 = rd (15~11번 비트) | 멀티플렉서 |
| ALUSrc | ALU 둘째 입력 = 레지스터에서 읽은 값 2 | ALU 둘째 입력 = 부호 확장한 16비트 | 멀티플렉서 |
| MemtoReg | 레지스터에 쓸 값 = ALU 결과 | 레지스터에 쓸 값 = 메모리에서 읽은 값 | 멀티플렉서 |
| RegWrite | 레지스터에 쓰지 않는다 | 클록이 올라갈 때 쓴다 | 레지스터 파일 |
| MemRead | 메모리를 읽지 않는다 | 주소의 값을 읽어 내보낸다 | 데이터 메모리 |
| MemWrite | 메모리에 쓰지 않는다 | 클록이 올라갈 때 쓴다 | 데이터 메모리 |
| Branch | 분기 명령이 아니다 | 분기 명령이다 | 다음 PC 고르기 |
| ALUOp (2비트) | ALU가 할 일의 종류를 ALU 제어에 알린다 (아래) | | ALU 제어 |

표의 뜻은 공개 강의 자료에서 확인했다[^1].

다음 PC를 고르는 신호 PCSrc는 제어 장치가 혼자 정하지 못한다. 분기 명령이어도 두 값이 같을 때만 가야 하기 때문이다. 그래서 Branch와 ALU의 Zero 출력을 AND 게이트에 넣는다[^1].

$$\text{PCSrc} = \text{Branch} \cdot \text{Zero}$$


가운뎃점은 AND다. 둘 다 1일 때만 1이다.

## 주 제어의 표

주 제어는 명령어의 맨 앞 6비트(opcode)만 보고 신호를 낸다. opcode는 R형 0, `lw` 35, `sw` 43, `beq` 4다[^2].

| 신호 | R형 | `lw` | `sw` | `beq` |
|---|---|---|---|---|
| RegDst | 1 | 0 | X | X |
| ALUSrc | 0 | 1 | 1 | 0 |
| MemtoReg | 0 | 1 | X | X |
| RegWrite | 1 | 1 | 0 | 0 |
| MemRead | 0 | 1 | 0 | 0 |
| MemWrite | 0 | 0 | 1 | 0 |
| Branch | 0 | 0 | 0 | 1 |
| ALUOp | 10 | 00 | 00 | 01 |

값은 공개 강의 자료 두 곳에서 확인했다[^3]. X는 "0이든 1이든 결과가 같다"는 표시다.

표를 외우지 않고 한 줄씩 만들 수 있다. `lw`를 예로 든다.

1. rt에 쓴다. → RegDst = 0, RegWrite = 1
2. 주소는 레지스터 + 상수다. → ALUSrc = 1, ALU는 더한다 → ALUOp = 00
3. 메모리를 읽는다. → MemRead = 1, MemWrite = 0
4. 읽은 값을 레지스터에 쓴다. → MemtoReg = 1
5. 분기가 아니다. → Branch = 0

**X가 붙는 자리.** `sw`와 `beq`는 레지스터에 쓰지 않는다(RegWrite = 0). 그러면 "어느 레지스터에 쓸까"(RegDst)와 "무슨 값을 쓸까"(MemtoReg)는 어느 쪽을 골라도 버려진다. X로 두면 회로를 만들 때 더 간단한 쪽을 고를 수 있다. 반대로 RegWrite와 MemWrite에는 X가 올 수 없다. 이 둘은 값을 실제로 고치는 신호라서, 아무렇게나 두면 예시처럼 엉뚱한 곳이 덮인다.

**`j`를 넣으면.** 신호 Jump를 하나 더 만들고, 다음 PC 앞에 멀티플렉서를 하나 더 둔다. `j`(opcode 2)에서는 Jump = 1, RegWrite = 0, MemWrite = 0, Branch = 0이고 나머지는 X다. 다른 명령어에서는 Jump = 0이다[^s1].

### 게이트로 만들기

표를 회로로 옮기면 두 층이 된다. 앞층의 AND 게이트 넷이 opcode 6비트를 보고 "R형이다", "`lw`다", "`sw`다", "`beq`다"를 하나씩 알아본다. 뒤층의 OR 게이트가 그 넷을 모아 신호를 만든다[^4].

$$\begin{aligned}
\text{RegDst} &= \text{R형} & \text{ALUSrc} &= lw + sw & \text{MemtoReg} &= lw \\
\text{RegWrite} &= \text{R형} + lw & \text{MemRead} &= lw & \text{MemWrite} &= sw \\
\text{Branch} &= beq & \text{ALUOp}_1 &= \text{R형} & \text{ALUOp}_0 &= beq
\end{aligned}$$


$+$는 OR다. 예를 들어 "`lw`다"는 opcode가 $100011_2$일 때만 1이 되는 AND 게이트다. 이 식은 X 칸을 0으로 채운 것과 같다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 식이 표의 X 아닌 모든 칸과 같음, opcode 64가지 가운데 네 명령어가 아닌 것에는 RegWrite·MemWrite·Branch가 모두 0, 아래 ALU 제어 식이 ALU 제어 표와 같음(전수 검사) — [[2-1학기/컴퓨터 구조/3.개념집/25_control-unit_verify.py|25_control-unit_verify.py]]</div>

</div>


## ALU 제어

ALU가 할 일은 두 단계로 정한다. 주 제어가 "더해라(00)", "빼라(01)", "명령어의 funct 칸을 봐라(10)" 가운데 하나를 ALUOp로 내면, 작은 회로인 ALU 제어가 그것과 funct 6비트를 보고 [[2-1학기/컴퓨터 구조/3.개념집/08.ALU|ALU]]에 넣을 4비트를 만든다[^5].

| 명령어 | ALUOp | funct | ALU가 하는 일 | ALU 제어 4비트 |
|---|---|---|---|---|
| `lw`, `sw` | 00 | 보지 않는다 | 더하기 (주소) | 0010 |
| `beq` | 01 | 보지 않는다 | 빼기 (견주기) | 0110 |
| `add` | 10 | 100000 | 더하기 | 0010 |
| `sub` | 10 | 100010 | 빼기 | 0110 |
| `and` | 10 | 100100 | AND | 0000 |
| `or` | 10 | 100101 | OR | 0001 |
| `slt` | 10 | 101010 | 작으면 1 | 0111 |

두 단계로 나누는 까닭은 주 제어를 작게 두기 위해서다. R형 다섯 명령어는 opcode가 모두 0이라 주 제어에게는 한 가지로 보인다. 다섯을 가르는 일은 funct만 보는 작은 회로에 맡긴다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">ALU 제어를 게이트 식으로</summary>

ALU 제어 4비트를 위에서부터 $op_3 op_2 op_1 op_0$, funct를 $F_5 \dots F_0$이라 쓴다. 표에서 funct의 위 두 비트는 늘 10이라 볼 필요가 없다[^5].

$$op_3 = 0, \qquad op_2 = \text{ALUOp}_0 + \text{ALUOp}_1 \cdot F_1, \qquad op_1 = \overline{\text{ALUOp}_1} + \overline{F_2}, \qquad op_0 = \text{ALUOp}_1 \cdot (F_3 + F_0)$$


윗줄은 "아니다"(NOT)이다. $op_2$는 "빼기 쪽인가"를 뜻한다. `beq`이거나(ALUOp₀ = 1), R형이면서 funct의 1번 비트가 1일 때(`sub`, `slt`)다. `add`에 넣어 보면 ALUOp = 10, funct = 100000이라 $op_2 = 0$, $op_1 = 0 + 1 = 1$, $op_0 = 1 \cdot 0 = 0$으로 0010이 나온다[^s2].

</details>


오래된 판의 교재와 일부 강의 자료는 ALU 제어를 3비트(AND 000, OR 001, 더하기 010, 빼기 110, 작으면 1은 111)로 적는다. 위 4비트에서 맨 앞 0을 뗀 것과 같다[^6].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `beq`의 ALUSrc가 0이어야 하는 이유는? 16비트 상수는 어디에 쓰이나?</summary>

ALU는 두 레지스터를 견줘야 하므로 둘째 입력이 레지스터 값이다. 16비트 상수는 ALU로 가지 않고, 부호 확장과 2칸 밀기를 거쳐 분기용 가산기로 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. R형의 MemtoReg는 X가 아니라 0이다. 왜인가?</summary>

R형은 RegWrite = 1이라 쓸 값이 실제로 레지스터에 들어간다. ALU 결과를 써야 하므로 0으로 정해져야 한다. X는 쓰기 신호가 0이라 선택이 버려질 때만 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `sw`의 MemRead는 왜 X가 아니라 0인가?</summary>

결과만 보면 읽은 값이 버려지므로 X여도 될 것 같다. 하지만 메모리를 읽는 일은 실제 장치에서 시간과 전력을 쓰고, 없는 주소를 읽으면 오류가 날 수 있다. 그래서 필요 없을 때는 꺼 둔다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 설계의 핵심 아이디어는?</summary>

명령어의 뜻을 "갈림길마다의 선택 + 쓰기 스위치"의 묶음으로 바꾼다. 데이터패스는 그대로 두고 표의 한 줄만 바꾸면 다른 명령어가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

[[2-1학기/컴퓨터 구조/3.개념집/28.파이프라인 레지스터와 제어|파이프라인]]에서도 같은 표를 쓴다. 신호를 한꺼번에 쓰지 않고 명령어와 함께 단계마다 실어 보낼 뿐이다.

</details>


## 활용

- 새 명령어 넣기: 데이터패스에 길이 있으면 표에 줄 하나만 더한다. 길이 없으면 멀티플렉서를 넓히고 신호를 더한다(`j`의 Jump가 그 예).
- 흔한 실수: `lw`의 RegDst를 1로 쓰는 것. `lw`의 목적지는 rd가 아니라 rt다. I형에는 rd 칸이 없다.
- 흔한 실수: `beq`의 ALUOp를 00으로 쓰는 것. 견주려면 빼야 하므로 01이다.
- 연습: [[2-1학기/컴퓨터 구조/4.연습문제/25.데이터패스 추적 예제 사다리|데이터패스 추적 예제 사다리]]

## 연결

- 선수: [[2-1학기/컴퓨터 구조/3.개념집/24.단일 사이클 데이터패스|단일 사이클 데이터패스]], [[2-1학기/컴퓨터 구조/3.개념집/16.MIPS 명령어 형식|MIPS 명령어 형식]], [[2-1학기/컴퓨터 구조/3.개념집/08.ALU|ALU]]
- 진리표에서 게이트 식 만들기: [[공학수학/이산수학/3.개념집/05.불 대수와 논리 회로|불 대수와 논리 회로]]
- 신호가 고르는 부품: [[2-1학기/컴퓨터 구조/3.개념집/06.멀티플렉서와 디코더|멀티플렉서와 디코더]]
- 파이프라인에서 신호를 실어 나르기: [[2-1학기/컴퓨터 구조/3.개념집/28.파이프라인 레지스터와 제어|파이프라인 레지스터와 제어]]

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"표의 X는 0이라는 뜻이다"</div>

틀렸다. X는 "0이어도 1이어도 결과가 같다"는 뜻이다. 표에서 숫자가 아닌 칸이라 "꺼짐"으로 읽기 쉽고, 실제 회로가 X 칸에 0을 내는 일이 많아서 그럴듯해 보인다. 하지만 `sw`의 RegDst를 1로 두어도 프로세서는 똑같이 동작한다. RegWrite가 0이라 고른 번호를 쓰지 않기 때문이다. 확인하는 법: 흉내기에서 X 칸을 전부 0으로 채운 것과 전부 1로 채운 것을 같은 프로그램으로 돌리면 레지스터와 메모리가 늘 같다. 거꾸로 X가 아닌 칸은 하나만 바꿔도 결과가 달라진다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `lw`의 제어 신호 여덟 가지를 쓰라.</summary>

**답:** RegDst 0, ALUSrc 1, MemtoReg 1, RegWrite 1, MemRead 1, MemWrite 0, Branch 0, ALUOp 00.<br>
**이유:** rt에 쓰고(RegDst 0), 주소는 레지스터 + 상수이며(ALUSrc 1, 더하기), 메모리에서 읽은 값을 쓴다(MemRead 1, MemtoReg 1).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `sw`와 `beq`에서 RegDst와 MemtoReg는 X인데, RegWrite와 MemWrite는 어떤 명령어에서도 X가 되지 못한다. 왜인가?</summary>

**답:** RegDst와 MemtoReg는 "레지스터에 쓸 때 무엇을 어디에"를 고르는 신호라서, 쓰지 않는 명령어(RegWrite = 0)에서는 무엇을 골라도 버려진다. RegWrite와 MemWrite는 레지스터나 메모리를 실제로 고치는 스위치라서 값에 따라 늘 결과가 달라진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `addi $t5, $t0, -7`(rt ← rs + 상수, opcode 8)을 지금 데이터패스에 넣으려 한다. 부품을 더하지 않고 제어 표에 줄 하나만 더해 된다. 그 줄을 쓰라.</summary>

**답:** RegDst 0, ALUSrc 1, MemtoReg 0, RegWrite 1, MemRead 0, MemWrite 0, Branch 0, ALUOp 00.<br>
**이유:** `lw`처럼 rt에 쓰고 ALU가 레지스터 + 상수를 더한다. 다른 점은 메모리를 거치지 않고 ALU 결과를 바로 쓴다는 것이다(MemtoReg 0, MemRead 0). `$t0` = 12이면 `$t5`에 5가 들어간다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `sub $t0, $s1, $s2`와 `beq $s1, $s2, L`은 둘 다 ALU가 뺄셈을 한다. ALUOp는 각각 무엇이고, ALU 제어 4비트는 같은가?</summary>

**답:** `sub`는 ALUOp 10(funct를 보라), `beq`는 ALUOp 01(빼라). ALU 제어 4비트는 둘 다 0110으로 같다.<br>
**이유:** `sub`는 opcode가 0이라 주 제어가 무슨 연산인지 모르고 funct 100010을 봐야 안다. `beq`는 opcode만으로 뺄셈임을 안다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** "R형의 RegDst를 0으로 바꿔도 결과는 같다"가 틀렸음을 보이는 예를 들라. `$t0` = 12, `$t1` = 5에서 `add $t2, $t0, $t1`을 쓴다.</summary>

**답:** 맞는 설정이면 `$t2`에 17이 들어간다. RegDst를 0으로 하면 쓸 번호가 rd(`$t2`)가 아니라 rt(`$t1`)가 되어, `$t2`는 그대로 0이고 `$t1`이 5에서 17로 바뀐다.

</details>


[^1]: Princeton COS/ELE 375 (Fall 2015, David August), Lecture 8 "Control", 슬라이드 6~15 (제어 신호의 이름, 참·거짓일 때의 뜻, PCSrc = Branch & Zero), https://www.cs.princeton.edu/courses/archive/fall15/cos375/lectures/08-Control.pdf
[^2]: 같은 강의, 슬라이드 17 (Control Design: Inputs. opcode 비트와 10진 값 0, 35, 43, 4). MIPS Reference Data (교재의 참조표, Univ. of Patras 게시본)의 lw 23hex, sw 2bhex, beq 4hex, j 2hex, addi 8hex, https://eclass.upatras.gr/modules/document/file.php/EE805/MIPS_Instruction_Set/MIPSReferenceData.pdf
[^3]: NYU, A. Gottlieb, Computer Architecture 2007-08 Fall, Lecture 17 (주 제어의 진리표: 입력 Op5~Op0과 출력 아홉 줄), https://cs.nyu.edu/~gottlieb/courses/2000s/2007-08-fall/arch/lectures/lecture-17.html. Edinboro Univ. CSCI 312 (Fall 2017) 강의 노트 "Building the ALU Control"의 ALUOp 값(lw·sw 00, beq 01, R형 10), https://mirkwood.cs.edinboro.edu/~bennett/class/csci312/fall2017/notes/control/one.html. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^4]: NYU 같은 강의 (제어 논리를 두 층 PLA로 그린다는 설명). Princeton 같은 강의, 슬라이드 20 (Combinational Implementation)
[^5]: Edinboro Univ. 같은 노트 (ALU 제어 4비트 0000 AND, 0001 OR, 0010 add, 0110 subtract, 0111 slt, 1100 nor와 ALUOp·funct 표, funct의 위 두 비트는 늘 10)
[^6]: Princeton 같은 강의, 슬라이드 11~12 (ALUControl 3비트 표)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `j`의 제어 줄과 "MemRead를 꺼 두는 이유"는 연 자료에서 글로 확인하지 못했다. `j`의 줄은 "레지스터도 메모리도 고치지 않는다"에서 정했고 흉내기로 확인했다. MemRead의 이유는 [확인필요].
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 주 제어의 식은 표에서 1인 칸을 모은 것이고, ALU 제어의 식은 표에서 직접 구했다. 두 식 모두 표와 같은지 [[2-1학기/컴퓨터 구조/3.개념집/25_control-unit_verify.py|25_control-unit_verify.py]]에서 전수 검사했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `addi`의 제어 줄은 이 문서의 명령어 범위 밖이다. 흉내기에 이 줄을 넣어 `$t5` = 5가 나오는 것을 확인했다.
{% endraw %}
