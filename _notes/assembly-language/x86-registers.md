---
layout: "note"
title: "x86 레지스터"
display_title: "x86 레지스터 (x86 Registers)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["x86 Registers", "범용 레지스터", "General-Purpose Registers", "EAX", "EBX", "ECX", "EDX", "ESI", "EDI", "EBP", "ESP", "세그먼트 레지스터", "Segment Registers", "EIP", "명령어 포인터", "Instruction Pointer", "EFLAGS", "상태 플래그", "Status Flags", "누산기", "Accumulator"]
description: "레지스터는 프로세서 안에 있는, 이름이 붙은 작은 저장 칸이다. 계산기를 두드릴 때 화면에 떠 있는 숫자처럼, 지금 계산 중인 값을 잠깐 들고 있는 자리다. 메모리까지 다녀올 필요가 없어서 가장 빠르다. 하지만 32비트 x86에서 마음대로 쓸 수 있는 칸은 여덟 개뿐이고, 그중 몇…"
prev_url: "/studies/assembly-language/instruction-pipeline/"
prev_title: "파이프라인과 슈퍼스칼라"
next_url: "/studies/assembly-language/x86-operating-modes/"
next_title: "x86 동작 모드"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/x86-registers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

레지스터는 프로세서 안에 있는, 이름이 붙은 작은 저장 칸이다. 계산기를 두드릴 때 화면에 떠 있는 숫자처럼, 지금 계산 중인 값을 잠깐 들고 있는 자리다. 메모리까지 다녀올 필요가 없어서 가장 빠르다. 하지만 32비트 x86에서 마음대로 쓸 수 있는 칸은 여덟 개뿐이고, 그중 몇은 정해진 일이 따로 있어서 아무 값이나 넣으면 프로그램이 망가진다.

</div>


## 예시로 보기

`mov eax,5`와 `add eax,6`은 "EAX라는 칸에 5를 넣고, 거기에 6을 더한다"는 뜻이다. 어셈블리어의 거의 모든 줄에 이런 칸 이름이 나온다. 이름을 모르면 한 줄도 읽을 수 없다.

칸 하나는 32비트다. 그런데 EAX는 같은 칸의 일부를 다른 이름으로 부를 수 있다[^1].

```
 비트   31              16 15       8 7        0
       +------------------+----------+----------+
 EAX   |                  |    AH    |    AL    |
       +------------------+----------+----------+
                          |<------- AX -------->|
       |<---------------- EAX ----------------->|
```

EAX에 `12345678h`가 들어 있으면 AX는 아래 16비트인 `5678h`, AH는 그 위쪽 8비트인 `56h`, AL은 아래쪽 8비트인 `78h`다. 따로 있는 칸이 아니라 같은 칸을 잘라 본 것이다. 그래서 AL에 `FFh`를 넣으면 EAX가 `123456FFh`로 바뀐다. 나머지 24비트는 그대로다[^s1].

AH와 AL의 H와 L은 high(위쪽)와 low(아래쪽)다. EAX의 E는 extended로, 16비트이던 AX를 32비트로 늘렸다는 뜻이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `12345678h`에서 AX·AH·AL의 값, 한 조각에 값을 써도 나머지 조각이 그대로인지 8비트 값 256개 전부, 디버거 출력 `EFL=00000206`을 비트로 푼 결과, 카드의 값 — [04_x86-registers_verify.py](/Hongs_Blog/studies/assembly-language/code/04_x86-registers_verify/). 파이썬 흉내로 확인했다.</div>

</div>


## 레지스터의 종류

32비트 x86의 기본 실행 환경에는 다음 칸들이 있다[^2].

| 무리 | 이름 | 크기 |
|---|---|---|
| 범용 레지스터 | EAX, EBX, ECX, EDX, EBP, ESP, ESI, EDI | 32비트 × 8 |
| 세그먼트 레지스터 | CS, SS, DS, ES, FS, GS | 16비트 × 6 |
| 플래그 레지스터 | EFLAGS | 32비트 |
| 명령어 포인터 | EIP | 32비트 |

**작은 이름.** 범용 레지스터 여덟 개가 모두 8비트 이름을 갖는 것은 아니다.

| 32비트 | 16비트 | 위쪽 8비트 | 아래쪽 8비트 |
|---|---|---|---|
| EAX | AX | AH | AL |
| EBX | BX | BH | BL |
| ECX | CX | CH | CL |
| EDX | DX | DH | DL |
| ESI | SI | 없음 | 없음 |
| EDI | DI | 없음 | 없음 |
| EBP | BP | 없음 | 없음 |
| ESP | SP | 없음 | 없음 |

위 네 줄은 슬라이드 p.9, 아래 네 줄은 p.10의 표다[^1].

**정해진 쓰임.** 이름은 범용이지만 몇몇 칸은 특정 명령이 정해 놓고 쓴다[^3].

| 레지스터 | 쓰임 | 풀이[^s2] |
|---|---|---|
| EAX | 누산기 (accumulator) | 곱셈·나눗셈 명령이 이 칸의 값을 쓰고 결과도 여기에 둔다 |
| ECX | 반복 횟수 (loop counter) | 반복 명령 `LOOP`가 이 칸을 1씩 줄이며 센다 |
| ESP | 스택 포인터 (stack pointer) | 스택이라는 메모리 구역의 맨 위 주소를 가리킨다 |
| ESI, EDI | 인덱스 레지스터 | 배열이나 문자열의 "몇 번째 칸"을 가리키는 데 쓴다 |
| EBP | 프레임 포인터 (extended frame pointer) | 스택 안에서 지금 실행 중인 함수(어셈블리어에서는 프로시저라 부른다)가 쓰는 구역을 가리킨다 |
| CS, DS, SS | 코드, 데이터, 스택 세그먼트 | 프로그램의 코드·데이터·스택 구역이 어디인지 담는다 |
| ES, FS, GS | 추가 세그먼트 | 더 쓸 수 있는 구역 칸 |
| EIP | 명령어 포인터 (instruction pointer) | 다음에 실행할 명령어의 주소를 담는다 |
| EFLAGS | 상태·제어 플래그 | 비트 하나하나가 깃발(flag) 하나다 |

**상태 플래그.** 계산이 끝날 때마다 프로세서가 EFLAGS의 몇몇 비트를 켜고 끈다. 슬라이드의 여섯 개다[^4].

| 플래그 | 켜지는 때 |
|---|---|
| 올림 (Carry, CF) | 부호 없는 계산의 결과가 칸의 범위를 벗어났다 |
| 넘침 (Overflow, OF) | 부호 있는 계산의 결과가 칸의 범위를 벗어났다 |
| 부호 (Sign, SF) | 결과가 음수다 |
| 영 (Zero, ZF) | 결과가 0이다 |
| 보조 올림 (Auxiliary Carry, AC) | 3번 비트에서 4번 비트로 올림이 생겼다 |
| 짝수 (Parity, PF) | 결과에서 1인 비트의 수가 짝수다 |

짝수 플래그는 결과 전체가 아니라 맨 아래 8비트만 센다[^s2]. 플래그가 정확히 언제 켜지는지는 [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)에서 다룬다.

## 예제

디버거가 레지스터를 보여 준 화면이다[^5].

```
EAX=00030000  EBX=7FFDF000  ECX=00000101  EDX=FFFFFFFF
ESI=00000000  EDI=00000000  EBP=0012FFF0  ESP=0012FFC4
EIP=00401024  EFL=00000206  CF=0  SF=0  ZF=0  OF=0
```

1. *범용 레지스터 읽기:* 여덟 칸이 모두 16진수 여덟 글자(32비트)로 나온다. EAX는 `00030000h`다. AX는 `0000h`, AL도 `00h`다.
2. *EIP 읽기:* `00401024h`. 다음에 실행할 명령어가 이 주소에 있다.
3. *EFL 읽기:* `00000206h`를 2진수로 쓰면 `0010 0000 0110`이다. 켜진 비트는 1번, 2번, 9번이다. 올림(0번), 영(6번), 부호(7번), 넘침(11번) 비트는 모두 꺼져 있어 화면의 `CF=0 SF=0 ZF=0 OF=0`과 맞다. 2번은 짝수 플래그다. EAX의 아래 8비트 `00h`에 1이 0개(짝수)라서 켜졌다[^s2].

## 활용

- 값을 8비트만 다룰 때는 AL, 16비트면 AX, 32비트면 EAX를 쓴다. 이름의 크기와 값의 크기가 맞아야 한다: [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/).
- 흔한 실수: ESP와 EBP를 계산용으로 쓰는 것. 두 칸은 스택을 가리키고 있어서 값을 바꾸면 돌아갈 자리를 잃는다: [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/), [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/).
- 흔한 실수: AL에 값을 넣으면 EAX의 위쪽이 0이 된다고 생각하는 것. 위쪽은 전에 있던 값 그대로다. 작은 값을 큰 칸으로 옮길 때는 [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)을 쓴다.

## 연결

- 선수: [어셈블리어와 기계어](/Hongs_Blog/studies/assembly-language/assembly-language/), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 프로세서 종류와 상관없는 레지스터 일반 이야기: [프로세서 레지스터](/Hongs_Blog/studies/operating-systems/processor-registers/). 그 문서의 프로그램 카운터가 x86의 EIP, 조건 코드가 EFLAGS의 상태 플래그, 스택 포인터가 ESP다.
- 칸이 여덟 개뿐이라 생기는 문제(변수는 많은데 어느 것을 레지스터에 둘까): [그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/)

## 과목별 관점

**컴퓨터 구조 (2-1학기).** 컴퓨터 구조 과목의 MIPS는 레지스터를 다르게 짰다. [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/)와 견주면 이렇다[^k1].

| | x86 (32비트) | MIPS |
|---|---|---|
| 범용 레지스터 수 | 8개 | 32개 |
| 칸의 일부를 부르는 이름 | AL, AH, AX처럼 있다 | 없다. 늘 32비트 통째로 쓰고, 한 바이트는 메모리에서 꺼낼 때 `lb`로 고른다 |
| 정해진 쓰임 | 몇몇 명령이 특정 칸을 몰래 쓴다(`LOOP`은 ECX, 곱셈은 EAX) | 명령이 쓰는 칸이 모두 명령에 적혀 있다. `$t0`, `$s0` 같은 이름은 프로그래머끼리의 약속이다 |
| 늘 0인 칸 | 없다 | `$zero` (0번) |
| 다음 명령의 주소 | EIP | PC. 번호가 없어 보통 명령으로는 읽고 쓰지 못한다 |
| 스택 꼭대기 | ESP. `PUSH`·`POP`이 알아서 바꾼다 | `$sp` (29번). `addi`로 직접 내리고 올린다 |
| 프레임의 기준점 | EBP | `$fp` (30번) |
| 돌아갈 주소 | `CALL`이 스택에 넣는다 | `jal`이 `$ra` (31번)에 넣는다 |
| 계산 결과의 표시 | EFLAGS의 상태 플래그 | 없다. 크기 비교의 답을 `slt`가 보통 레지스터에 0이나 1로 적는다 |
| 곱셈·나눗셈의 결과 | 범용 레지스터인 EAX에 둔다 | Hi, Lo라는 전용 칸 둘에 둔다 |

칸이 32개라 변수를 메모리 대신 레지스터에 두기 쉽다. 그 대신 명령마다 레지스터 번호 하나에 5비트씩 든다. 두 설계의 큰 그림은 [RISC와 CISC 비교](/Hongs_Blog/studies/computer-architecture/risc-vs-cisc/)에 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** EAX, ECX, ESP, EBP, EIP는 각각 무슨 일에 쓰이는가?</summary>

**답:** EAX: 누산기(곱셈·나눗셈의 값과 결과). ECX: 반복 횟수. ESP: 스택 맨 위의 주소. EBP: 스택 안에서 지금 프로시저의 구역을 가리키는 프레임 포인터. EIP: 다음에 실행할 명령어의 주소.<br>
**흔한 오답:** ESP와 EBP를 맞바꿔 적는 것. S는 stack, B는 base(기준점)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** EBX에 `0000A1B2h`가 들어 있다. BL에 `00h`를 넣고, 이어서 BH에 `FFh`를 넣는다. 각 단계 뒤 EBX의 값은? 또 ECX가 `FFFFFFFFh`일 때 CX에 0을 넣으면 ECX는 얼마인가?</summary>

**답:** `0000A1B2h` → `0000A100h` → `0000FF00h`. ECX는 `FFFF0000h`.<br>
**이유:** BL은 아래 8비트, BH는 그 위 8비트만 바꾼다. CX는 아래 16비트만 바꾸고 위 16비트는 건드리지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 가운데 실제로 있는 레지스터 이름을 모두 골라라: AL, SIL(ESI의 아래 8비트라는 뜻으로), BP, DH, EIP의 아래 16비트 IP, ES. 32비트 x86 슬라이드의 표를 기준으로 한다.</summary>

**답:** AL, BP, DH, ES는 표에 있다. ESI에는 8비트 이름이 없다. EIP는 표에 32비트 이름만 나온다.<br>
**이유:** 8비트 이름은 EAX·EBX·ECX·EDX 넷에만 있다. ESI·EDI·EBP·ESP는 16비트 이름(SI, DI, BP, SP)까지만 있다. IP라는 이름은 16비트 프로세서 시절의 명령어 포인터로, 슬라이드에서는 뒤의 `RET` 설명에 "EIP or IP"로 나온다[^6].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** x86의 EIP, ESP, EBP, EFLAGS가 하는 일을 MIPS에서는 각각 무엇이 맡는가? MIPS에만 있고 x86에 없는 칸 하나를 들어라.</summary>

**답:** EIP → PC(번호 없는 칸). ESP → `$sp`(29번). EBP → `$fp`(30번). EFLAGS → 맡는 칸이 없다. 크기 비교의 답은 `slt`가 보통 레지스터에 적고, 넘침은 예외로 알린다. MIPS에만 있는 칸: 늘 0인 `$zero`, 돌아갈 주소를 담는 `$ra`.<br>
**이유:** x86은 돌아갈 주소를 스택에 두므로 `$ra` 같은 칸이 필요 없다. MIPS는 플래그를 두지 않아 한 명령의 결과가 다음 명령에 몰래 넘어가는 일이 없다[^k1].

</details>


[^1]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.9 (Accessing Parts of Registers: AH·AL·AX·EAX 그림과 표), p.10 (Index and Base Registers 표)
[^2]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.8 (General-Purpose Registers: Named storage locations inside the CPU, optimized for speed. 그림)
[^3]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.11~12 (Some Specialized Register Uses)
[^4]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.13 (Status Flags)
[^5]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.16 (Example Output: Showing registers and flags in the debugger)
[^6]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.1 (RET Instruction: Pops stack into the instruction pointer (EIP or IP))
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `12345678h`의 예, 비트 번호를 적은 그림, 이름 글자의 뜻은 슬라이드에 없다. 슬라이드 p.9의 그림(8 + 8비트, 16비트, 32비트)을 수로 옮겼다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 표의 "풀이" 칸, 짝수 플래그가 아래 8비트만 센다는 것, EFLAGS의 비트 번호(올림 0, 짝수 2, 영 6, 부호 7, 넘침 11), 예제의 3단계는 슬라이드에 없다. Intel 64 and IA-32 Architectures Software Developer's Manual, Vol. 1, 3.4.3절을 따랐다. 9번 비트는 인터럽트를 받을지 정하는 비트, 1번 비트는 늘 1인 비트다.
[^k1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> MIPS와의 비교는 어셈블리어 슬라이드에 없다. MIPS 쪽 내용(레지스터 32개와 번호, `jal`이 31번 레지스터에 주소를 넣는 것, Hi·Lo)은 MIPS Reference Data(Green Sheet, https://www.comp.nus.edu.sg/~cs2100/lect/MIPS_Reference_Data_page1.pdf)와 Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장을 따랐다. 레지스터 번호는 [14_mips-operands_verify.py](/Hongs_Blog/studies/computer-architecture/code/14_mips-operands_verify/)로 확인했다.
{% endraw %}
