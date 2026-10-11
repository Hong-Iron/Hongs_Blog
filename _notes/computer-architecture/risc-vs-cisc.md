---
layout: "note"
title: "RISC와 CISC 비교"
display_title: "RISC와 CISC 비교"
kind: "concept"
kind_label: "비교"
num: "13"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["RISC vs CISC", "RISC", "Reduced Instruction Set Computer", "CISC", "Complex Instruction Set Computer", "적재-저장 구조", "Load-Store Architecture", "고정 길이 명령", "가변 길이 명령"]
description: "명령어 집합을 짜는 두 갈래다. 단순한 명령 몇 가지만 두고 모양을 똑같이 맞추는 쪽이 RISC(reduced instruction set computer)이고, 한 명령이 여러 일을 하게 하고 모양도 제각각 두는 쪽이 CISC(complex instruction set compu…"
prev_url: "/studies/computer-architecture/instruction-set-architecture/"
prev_title: "명령어 집합 구조"
next_url: "/studies/computer-architecture/mips-operands/"
next_title: "MIPS 레지스터와 메모리 피연산자"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/risc-vs-cisc/"
---
{% raw %}
명령어 집합을 짜는 두 갈래다. 단순한 명령 몇 가지만 두고 모양을 똑같이 맞추는 쪽이 RISC(reduced instruction set computer)이고, 한 명령이 여러 일을 하게 하고 모양도 제각각 두는 쪽이 CISC(complex instruction set computer)다. MIPS가 RISC, 어셈블리어 과목의 x86이 CISC다[^1]. 가르는 질문은 "계산하는 명령이 메모리를 직접 만질 수 있는가"와 "명령의 길이가 모두 같은가"다.

같은 일을 두 기계로 적으면 차이가 보인다. 메모리의 변수 A와 C를 더해 레지스터에 둔다.

```asm
; x86 (어셈블리어 과목)                 # MIPS (이 과목). $s3에 A의 주소가 있다
mov eax,A        ; A1 00000000          lw  $t0, 0($s3)      # 0x8E680000
add eax,C        ; 03 05 00000008       lw  $t1, 8($s3)      # 0x8E690008
                                        add $t2, $t0, $t1    # 0x01095020
```

x86은 두 줄이다. `add`가 메모리의 C를 직접 읽어 더한다. 기계어는 5바이트와 6바이트로 길이가 다르다[^2]. MIPS는 세 줄이다. `add`는 레지스터끼리만 더하므로 C를 먼저 `lw`로 꺼내 와야 한다. 대신 세 줄 모두 정확히 4바이트다. 합치면 x86이 11바이트, MIPS가 12바이트다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: MIPS 세 줄의 기계어 값과 길이(4바이트씩 12바이트), x86 두 줄의 바이트 수(5 + 6 = 11), 두 기계가 같은 합을 내는 것(무작위 1,000회), `loop`를 MIPS 두 줄로 옮긴 결과 — [13_risc-vs-cisc_verify.py](/Hongs_Blog/studies/computer-architecture/code/13_risc-vs-cisc_verify/). 실제 하드웨어가 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 모든 명령이 32비트이고, 메모리는 "꺼내 오기"와 "넣어 두기" 두 명령으로만 만진다. (b) `add eax,var2`처럼 더하기 명령이 메모리의 값을 바로 읽고, 명령마다 바이트 수가 다르다. 어느 쪽인가?</summary>

**답:** (a) RISC. (b) CISC.<br>
**이유:** (a)는 계산 명령과 메모리 명령이 나뉘어 있고 길이가 같다. (b)는 한 명령이 "메모리 읽기 + 더하기"를 한꺼번에 하고 길이가 제각각이다. 길이만 보고 가르면 안 된다. 계산 명령이 메모리를 만지는지가 더 깊은 차이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) `loop L1` 한 줄이 ECX를 1 줄이고, 0이 아니면 L1로 간다. (d) 같은 일을 `addi $t0, $t0, -1`과 `bne $t0, $zero, L1` 두 줄로 한다. (e) 견준 결과를 플래그라는 숨은 칸에 남기고 다음 명령이 그것을 읽는다. (f) 견준 결과를 보통 레지스터에 0이나 1로 받는다. 각각 어느 쪽인가?</summary>

**답:** (c) CISC, (d) RISC, (e) CISC(x86), (f) RISC(MIPS의 `slt`).<br>
**이유:** (c)는 명령 하나가 "빼기 + 견주기 + 건너뛰기" 세 일을 하고, ECX라는 정해진 레지스터를 몰래 쓴다. (d)는 한 줄이 한 일만 하고 쓰는 레지스터가 모두 명령에 적혀 있다. (e)와 (f)는 엄밀히는 RISC·CISC를 가르는 기준이 아니라 x86과 MIPS의 차이다. 플래그를 쓰는 RISC도 있다[^s1].

</details>


## 결정적 차이

| | RISC (MIPS) | CISC (x86) |
|---|---|---|
| 명령의 길이 | 모두 32비트 | 제각각. 예시의 두 줄이 5바이트와 6바이트 |
| 계산 명령이 메모리를 만지는가 | 아니다. `lw`·`sw`만 메모리에 닿는다[^3] | 그렇다. `add eax,var2` |
| 한 명령이 하는 일 | 하나 | 여럿일 수 있다. `loop`, `call`(주소를 스택에 넣고 건너뛴다) |
| 레지스터 수 | 32개[^4] | 범용 8개 (32비트 x86) |
| 재료를 적는 꼴 | 재료 둘, 결과 하나: `add $t2, $t0, $t1` | 재료 하나가 결과 자리를 겸한다: `add eax,ebx` |
| 같은 일에 드는 명령 수 | 많다 | 적다 |
| 명령을 읽어 푸는 회로 | 단순하다. 정해진 자리의 비트를 자르면 된다 | 복잡하다. 앞 바이트를 읽어야 길이를 안다 |

선택을 바꾸는 줄은 위의 두 줄이다. 길이가 같고 메모리에 닿는 명령이 따로 있으면 모든 명령이 같은 순서의 단계를 밟는다. 그러면 여러 명령을 겹쳐서 처리하는 [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)을 짜기 쉽다[^s1]. 반대로 CISC는 프로그램이 짧아진다. 예시에서는 고작 1바이트 차이지만 명령 수는 2줄 대 3줄이다.

"명령 수가 적으니 CISC가 빠르다"는 틀린 결론이다. 실행 시간은 명령 수에 명령 하나당 드는 클록 수와 클록 주기를 곱한 값이다. 명령 수가 줄어도 뒤의 둘이 늘면 느려진다: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/).

MIPS의 설계 원칙으로 읽으면 RISC는 "자주 생기는 일을 빠르게"를 고른 것이다. 자주 쓰는 단순한 명령만 두고, 드물게 쓰는 복잡한 일은 단순한 명령 여러 개로 한다[^1].

## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "x86은 CISC이니 안쪽 회로도 복잡한 명령을 통째로 실행한다"는 말이 왜 틀릴 수 있는가? RISC·CISC라는 이름표가 가리키는 것이 무엇인지로 답하라.</summary>

**답:** RISC·CISC는 프로그램에 보이는 약속(명령어 집합)에 붙는 이름표다. 안쪽 회로를 어떻게 만드는지는 따로다. 요즘 x86 프로세서는 복잡한 명령을 안에서 단순한 작은 동작 여러 개로 쪼갠 뒤, 그 작은 동작들을 RISC 프로세서처럼 처리한다[^5].<br>
**이유:** [명령어 집합 구조](/Hongs_Blog/studies/computer-architecture/instruction-set-architecture/)는 약속이고 구현은 그 아래 층이다. 그래서 "겉은 CISC, 속은 RISC에 가까운" 프로세서가 있을 수 있다. 이 경우 두 이름표 중 하나만 고르는 것이 맞지 않다.

</details>


[^1]: Harris & Harris, *Digital Design and Computer Architecture* 2판 6장 강의 슬라이드, https://www.esa.informatik.tu-darmstadt.de/archive/twiki/pub/Lectures/Prozessorarchitektur16De/DDCA_Ch6.pdf, 슬라이드 11 (MIPS는 단순한 명령 몇 개만 둔 RISC, 인텔 x86은 CISC. 덜 쓰는 복잡한 명령은 단순한 명령 여러 개로 한다)
[^2]: x86 두 줄과 기계어는 [어셈블리어와 기계어](/Hongs_Blog/studies/assembly-language/assembly-language/)의 예(`mov eax,A`는 `A1 00000000`, `add eax,C`는 `03 05 00000008`)를 가져왔다. `add eax,var2` 꼴은 [덧셈·뺄셈 명령](/Hongs_Blog/studies/assembly-language/add-sub-instructions/), `loop`는 [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)에 있다.
[^3]: KFUPM ICS 233 (A. R. Naseer), Lecture 4 "MIPS Processor Instruction Set", https://faculty.kfupm.edu.sa/coe/arnaseer/ICS233_Lecture4%20Slides.pdf, 슬라이드 4~5 (RISC 설계: 명령 종류가 적다, 산술이 단순하다, 레지스터가 넉넉하다. MIPS는 적재-저장 구조라 load와 store만 메모리에 닿는다)
[^4]: University of Utah CS3810 (R. Balasubramonian), Lecture 3 "MIPS Instruction Set", https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-15-03.pdf, 슬라이드 10 (MIPS는 레지스터 32개, x86은 8개)
[^5]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition). x86 명령을 안에서 마이크로 연산(micro-operation)으로 바꿔 처리한다는 설명이다. 책을 직접 보지 못해 장을 적지 않는다 [확인필요].
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> MIPS 세 줄과 그 기계어 값, 바이트 수 비교, 카드의 예, 표의 "재료를 적는 꼴"·"회로" 줄, 파이프라인과의 관계, 플래그를 쓰는 RISC가 있다는 말(ARM이 그렇다)은 위 자료에 그대로 있지 않다. MIPS 값은 검증 코드의 인코더로 구했다. 길이가 같으면 파이프라인을 짜기 쉽다는 설명은 Patterson & Hennessy, 같은 책, 4장 "The Processor"의 내용이다.
{% endraw %}
