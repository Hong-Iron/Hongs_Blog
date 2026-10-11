---
layout: "note"
title: "명령어 집합 구조"
display_title: "명령어 집합 구조 (Instruction Set Architecture)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Instruction Set Architecture", "ISA", "명령어 집합", "Instruction Set", "저장 프로그램 개념", "Stored-Program Concept", "폰 노이만 구조", "마이크로아키텍처", "Microarchitecture", "설계 원칙"]
description: "식당의 메뉴판과 같다. 손님은 메뉴판에 적힌 것만 주문하고, 주방이 그 음식을 어떻게 만드는지는 몰라도 된다. 프로그램과 프로세서 사이에도 이런 메뉴판이 있어서, 프로세서 안쪽을 새로 설계해도 메뉴판이 같으면 옛 프로그램이 그대로 돈다. 대신 메뉴판이 다른 프로세서에서는 같은 프로…"
prev_url: "/studies/computer-architecture/clocked-sequential-logic/"
prev_title: "클록과 순차 회로"
next_url: "/studies/computer-architecture/risc-vs-cisc/"
next_title: "RISC와 CISC 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/instruction-set-architecture/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

식당의 메뉴판과 같다. 손님은 메뉴판에 적힌 것만 주문하고, 주방이 그 음식을 어떻게 만드는지는 몰라도 된다. 프로그램과 프로세서 사이에도 이런 메뉴판이 있어서, 프로세서 안쪽을 새로 설계해도 메뉴판이 같으면 옛 프로그램이 그대로 돈다. 대신 메뉴판이 다른 프로세서에서는 같은 프로그램이 한 줄도 돌지 않는다. 또 주문서(명령)를 재료(데이터)와 같은 창고에 수로 적어 두기 때문에 프로그램을 갈아 끼우기 쉽지만, 기계는 어느 수가 명령이고 어느 수가 데이터인지 스스로 가려내지 못한다.

</div>


## 예시로 보기

프로세서 회사가 새 칩을 낼 때마다 세상의 프로그램을 모두 다시 만들어야 한다면 아무도 새 칩을 사지 않는다. 그래서 "프로그램이 프로세서에게 시킬 수 있는 일의 목록과 적는 법"을 먼저 못 박아 두고, 칩 안쪽은 그 목록만 지키면서 자유롭게 바꾼다. 인텔 프로세서는 세대마다 같은 x86 명령을 읽지만, 그 명령을 처리하는 방법은 세대마다 다르다[^1].

이 과목이 쓰는 목록은 MIPS다. 7과 5를 더하는 세 줄을 MIPS로 적으면 이렇다[^s1].

```asm
addi $t0, $zero, 7      # $t0 = 0 + 7
addi $t1, $zero, 5      # $t1 = 0 + 5
add  $t2, $t0, $t1      # $t2 = $t0 + $t1 = 12
```

`$t0`, `$t1`, `$t2`는 프로세서 안에 있는 작은 저장 칸이다. 이런 칸을 레지스터라 부른다. `$zero`는 늘 0이 들어 있는 칸이다.

프로세서는 이 글자를 읽지 못한다. 한 줄이 32비트 수 하나로 바뀌어 메모리에 들어간다. 메모리의 `0x00400000`번지부터 놓았다면 다음과 같다(`0x`는 16진수라는 표시다).

```
 주소          들어 있는 수     뜻
 0x00400000    0x20080007      addi $t0, $zero, 7
 0x00400004    0x20090005      addi $t1, $zero, 5
 0x00400008    0x01095020      add  $t2, $t0, $t1
```

프로세서는 지금 읽을 명령의 주소를 적어 둔 칸을 하나 갖고 있다. 이 칸을 프로그램 카운터(PC)라 부른다. 프로세서는 PC가 가리키는 수를 읽어 와서 그 수가 시키는 일을 하고, PC를 4 올려 다음 수를 읽는다. 명령 하나가 4바이트라서 4씩 오른다.

셋째 칸의 `0x01095020`은 10진수로 17,387,552다. 이 수를 명령으로 읽으면 "더하라"이고, 데이터로 읽으면 그냥 천칠백만쯤 되는 정수다. 메모리에는 어느 쪽인지 표시가 없다. PC가 가리키면 명령이고, 계산에 쓰이면 데이터다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 줄의 기계어 값, 실행 뒤 `$t2` = 12, `0x01095020`의 10진 값, 같은 수를 데이터로 읽어 더해도 기계가 막지 않는 것 — [12_instruction-set-architecture_verify.py](/Hongs_Blog/studies/computer-architecture/code/12_instruction-set-architecture_verify/). 실제 하드웨어가 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 정의

**명령어 집합 구조**(ISA)는 프로그래머 눈에 보이는 컴퓨터의 모습이다. 어떤 명령이 있는지와 그 명령의 재료(피연산자)가 어디에 있는지로 정해진다[^2]. 구체적으로는 다음을 정한다[^s1].

| 정하는 것 | MIPS에서 |
|---|---|
| 명령의 종류와 하는 일 | `add`, `lw`, `beq` 등 |
| 재료를 둘 수 있는 곳 | 레지스터 32개, 메모리, 명령 안에 적은 상수 |
| 명령을 비트로 적는 법 | 모든 명령이 32비트, 세 가지 형식 |
| 데이터의 크기와 주소 매기는 법 | 1워드 = 32비트, 주소는 바이트 단위 |

ISA가 정하지 않는 것도 있다. 그 명령들을 회로로 어떻게 만드는지다. 이것을 **마이크로아키텍처**라 부른다[^2]. 명령 하나를 몇 단계로 나눠 처리하는지, 클록이 얼마나 빠른지, 캐시가 얼마나 큰지가 여기에 든다. 같은 ISA에 마이크로아키텍처는 여럿일 수 있다.

**저장 프로그램 개념**은 명령을 수로 적어 데이터와 같은 메모리에 둔다는 생각이다. 새 프로그램을 돌리려고 전선을 다시 이을 필요가 없다. 새 프로그램을 메모리에 넣기만 하면 된다. 프로세서는 메모리에서 명령을 차례로 읽어 오고, 읽은 명령이 시키는 일을 한다[^3].

**설계 원칙 넷.** 헤네시와 패터슨이 MIPS를 설계하며 따랐다고 적은 원칙이다[^4].

1. 단순하게 하려면 규칙적이어야 한다 (Simplicity favors regularity). 모든 산술 명령이 "재료 둘, 결과 하나" 꼴이다.
2. 자주 생기는 일을 빠르게 한다 (Make the common case fast). 자주 쓰는 단순한 명령만 둔다.
3. 작을수록 빠르다 (Smaller is faster). 레지스터를 32개만 둔다.
4. 좋은 설계에는 좋은 절충이 필요하다 (Good design demands good compromises). 형식을 하나로 못 박지 않고 셋을 두되, 셋으로 묶는다.

## 활용

- 컴파일러는 ISA를 목표로 코드를 만든다. 고급 언어 한 줄이 명령 여러 줄로 바뀐다: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/).
- 성능을 따질 때 ISA와 구현이 나뉜다. 프로그램이 실행하는 명령 수는 주로 ISA와 컴파일러가 정하고, 명령 하나에 드는 클록 수와 클록 주기는 구현이 정한다: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/).
- 흔한 실수: "32비트 프로세서"를 속도나 회로 크기 이야기로 읽는 것. MIPS를 32비트 구조라 부르는 까닭은 32비트 데이터를 다루기 때문이다[^5]. ISA의 성질이지 구현의 성질이 아니다.

## 연결

- 선수: [컴퓨터 구조와 추상화 계층](/Hongs_Blog/studies/computer-architecture/computer-abstraction-layers/). ISA가 하드웨어와 소프트웨어를 가르는 층이다.
- MIPS가 정한 것 하나하나: [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/), [MIPS 산술·논리 명령](/Hongs_Blog/studies/computer-architecture/mips-arithmetic-logic/), [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)
- 다른 목록(x86)과 견주기: [RISC와 CISC 비교](/Hongs_Blog/studies/computer-architecture/risc-vs-cisc/), [어셈블리어와 기계어](/Hongs_Blog/studies/assembly-language/assembly-language/)
- "읽어 오고 실행한다"의 되풀이: [명령어 사이클](/Hongs_Blog/studies/operating-systems/instruction-cycle/). 그 되풀이를 회로로 만든 것: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)
- 컴파일러 과목의 [수업용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)는 MIPS를 단순하게 고친 표기를 쓴다. 이 과목은 실제 MIPS 표기를 쓴다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 명령어 집합 구조가 정하는 것 네 가지를 쓰고, 정하지 않는 것(마이크로아키텍처)의 예를 둘 들어라.</summary>

**답:** 정하는 것: 명령의 종류와 하는 일, 재료를 둘 수 있는 곳(레지스터·메모리·상수), 명령을 비트로 적는 법, 데이터의 크기와 주소 매기는 법. 정하지 않는 것: 명령을 몇 단계로 나눠 처리하는지, 클록 주기, 캐시 크기 등.<br>
**이유:** 앞의 넷은 프로그램이 직접 기대는 약속이라 바뀌면 프로그램이 안 돈다. 뒤의 것은 바뀌어도 프로그램의 결과가 같다. 빠르기만 달라진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 가운데 ISA에 드는 것을 모두 골라라. ① 레지스터가 32개다 ② 명령 하나를 다섯 단계로 나눠 처리한다 ③ `add`를 나타내는 비트 무늬 ④ 캐시가 32KB다 ⑤ 주소가 바이트 단위다</summary>

**답:** ①, ③, ⑤.<br>
**이유:** ②와 ④는 회로를 만드는 방법이다. 이 둘을 바꿔도 같은 기계어 프로그램이 같은 결과를 낸다. ①이 바뀌면 `$t9` 같은 이름을 쓰는 프로그램이 돌지 않고, ③이 바뀌면 기계어가 다른 뜻이 되고, ⑤가 바뀌면 주소 계산이 모두 틀어진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 명령과 데이터를 같은 메모리에 수로 두면 무엇이 좋고 무엇이 위험한가?</summary>

**답:** 좋은 점: 프로그램을 메모리에 넣기만 하면 다른 일을 하는 기계가 된다. 프로그램을 데이터처럼 다루는 프로그램(컴파일러, 로더)을 만들 수 있다. 위험한 점: 메모리의 수에는 명령인지 데이터인지 표시가 없다. PC가 데이터 구역을 가리키면 기계는 그 데이터를 명령으로 읽어 실행한다.<br>
**이유:** 예시의 `0x01095020`은 명령으로 읽으면 `add $t2, $t0, $t1`이고 데이터로 읽으면 17,387,552다. 두 읽기 모두 기계가 막지 않는다.

</details>


[^1]: University of Utah CS3810 (R. Balasubramonian), Lecture 3 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-03.pdf, 슬라이드 3 (실행 파일은 미래의 기계에서도 돌아야 한다, 인텔 프로세서는 모두 같은 x86 명령을 읽지만 처리하는 법은 다르다)
[^2]: Harris & Harris, *Digital Design and Computer Architecture* 2판 6장 강의 슬라이드, https://www.esa.informatik.tu-darmstadt.de/archive/twiki/pub/Lectures/Prozessorarchitektur16De/DDCA_Ch6.pdf, 슬라이드 3 (Architecture: programmer's view of computer, defined by instructions & operand locations. Microarchitecture: how to implement an architecture in hardware)
[^3]: 같은 슬라이드, 33 (Power of the Stored Program: 다시 배선할 필요 없이 새 프로그램을 메모리에 넣는다, 프로세서가 명령을 차례로 읽어 와 실행한다), 42 (프로그램 카운터). Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장 "Instructions: Language of the Computer"
[^4]: 같은 슬라이드, 6·9·11·14·32 (설계 원칙 넷과 그 예). Patterson & Hennessy, 같은 책, 2장
[^5]: 같은 슬라이드, 13 (MIPS는 32비트 데이터를 다루므로 32비트 구조라 부른다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 세 줄 프로그램과 주소·기계어 값, 메뉴판 비유, "정하는 것" 표의 네 갈래는 위 자료에 그대로 있지 않다. 표의 MIPS 칸은 MIPS Reference Data(Green Sheet)의 형식 그림과 위 슬라이드의 내용을 모은 것이고, 기계어 값은 검증 코드의 인코더로 구했다.
{% endraw %}
