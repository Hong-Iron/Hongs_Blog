---
layout: "note"
title: "프로그램 틀"
display_title: "프로그램 틀 (Program Template)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Program Template", "프로그램 템플릿", "AddTwo", "AddSub", ".386", ".model", ".stack", ".data", ".code", "PROC", "ENDP", "END", "ExitProcess", "코딩 규칙", "Coding Standards"]
description: "어셈블리어 프로그램은 매번 똑같은 뼈대 위에 쓴다. 이력서 양식처럼 칸이 미리 나뉘어 있어서, 변수는 변수 칸에, 실행할 코드는 코드 칸에 채워 넣으면 된다. 뼈대를 한 번 익히면 새 프로그램마다 바뀌는 곳은 두 칸뿐이다. 다만 뼈대의 줄들은 순서와 짝이 맞아야 하고, 끝내는 줄을…"
prev_url: "/studies/assembly-language/directive-vs-instruction/"
prev_title: "지시어와 명령어 비교"
next_url: "/studies/assembly-language/assemble-link-execute/"
next_title: "어셈블·링크·실행 과정"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/asm-program-template/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

어셈블리어 프로그램은 매번 똑같은 뼈대 위에 쓴다. 이력서 양식처럼 칸이 미리 나뉘어 있어서, 변수는 변수 칸에, 실행할 코드는 코드 칸에 채워 넣으면 된다. 뼈대를 한 번 익히면 새 프로그램마다 바뀌는 곳은 두 칸뿐이다. 다만 뼈대의 줄들은 순서와 짝이 맞아야 하고, 끝내는 줄을 빼먹으면 프로그램이 제대로 끝나지 않는다.

</div>


## 예시로 보기

실제로 하고 싶은 일은 "5에 6을 더한다" 두 줄이다. 그런데 어셈블러는 이 두 줄만으로는 프로그램을 만들지 못한다. 어떤 프로세서용인지, 코드가 어디서 시작하는지, 끝나면 무엇을 할지를 알려 주어야 한다. 가장 작은 완성 프로그램은 이렇다.

```asm
; AddTwo.asm – adds two 32-bit integers

.386
.model flat,stdcall
.stack 4096
ExitProcess PROTO, dwExitCode:DWORD
.code
main PROC
    mov  eax,5        ; move 5 to the EAX register
    add  eax,6        ; add 6 to the EAX register

    INVOKE ExitProcess,0
main ENDP
END main
```

가운데 `mov`와 `add` 두 줄만 프로세서가 실행하는 계산이다. 나머지는 뼈대다. 두 줄을 실행하면 EAX는 5 + 6 = 11, 16진수로 `0000000Bh`가 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: AddTwo의 EAX = `0000000Bh`, AddSub2의 EAX = `00030000h`와 `finalVal`, 두 프로그램이 끝날 때의 플래그, 디버거 화면의 `EAX=00030000`·`EFL=00000206`이 AddSub2의 결과와 맞고 AddTwo의 결과와는 맞지 않는 것, 카드의 값 — [10_asm-program-template_verify.py](/Hongs_Blog/studies/assembly-language/code/10_asm-program-template_verify/). 파이썬 흉내로 확인했다.</div>

</div>



## 틀

새 프로그램을 쓸 때 베껴 쓰는 뼈대다.

```asm
; Program Template           (Template.asm)

; Program Description:
; Author:
; Creation Date:
; Revisions:
; Date:              Modified by:

.386
.model flat,stdcall
.stack 4096
ExitProcess PROTO, dwExitCode:DWORD
.data
    ; declare variables here
.code
main PROC
    ; write your code here
    INVOKE ExitProcess,0
main ENDP
; (insert additional procedures here)
END main
```

줄마다 하는 일은 다음과 같다[^s1].

| 줄 | 하는 일 |
|---|---|
| `.386` | 32비트 프로세서용 프로그램이라고 알린다. 32비트 레지스터와 주소를 쓸 수 있게 된다 |
| `.model flat,stdcall` | 메모리를 쓰는 방식(flat: 구역을 나누지 않은 하나의 주소 공간)과 프로시저를 부르는 약속(stdcall)을 고른다 |
| `.stack 4096` | 스택으로 쓸 메모리를 4,096바이트 잡는다 |
| `ExitProcess PROTO, dwExitCode:DWORD` | 운영체제의 `ExitProcess`라는 프로시저를 쓰겠다고 미리 알린다. 32비트 인수 하나를 받는다 |
| `.data` | 여기부터 변수를 둔다 |
| `.code` | 여기부터 코드를 둔다 |
| `main PROC` … `main ENDP` | `main`이라는 프로시저의 시작과 끝 |
| `INVOKE ExitProcess,0` | 운영체제에 "끝났다"고 알리고 프로그램을 끝낸다. 0은 정상 종료라는 뜻으로 넘기는 값이다 |
| `END main` | 원본의 마지막 줄이다. 프로그램이 `main`에서 시작한다고도 알린다 |

표의 줄은 모두 어셈블러에게 하는 지시(지시어)이고 프로세서가 실행하는 명령이 아니다. `INVOKE`만은 어셈블러가 그 자리에 프로시저를 부르는 명령어를 써넣는다: [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/). 프로그램은 코드, 데이터, 스택 세 구역(세그먼트)으로 이루어진다.

### 변수를 쓰는 프로그램

`.data` 칸에 변수를 두면 이렇게 된다.

```asm
TITLE Add and Subtract, Version 2         (AddSub2.asm)

; This program adds and subtracts 32-bit unsigned
; integers and stores the sum in a variable.

INCLUDE Irvine32.inc
.data
val1     DWORD  10000h
val2     DWORD  40000h
val3     DWORD  20000h
finalVal DWORD  ?
.code
main PROC
    mov  eax,val1         ; start with 10000h
    add  eax,val2         ; add 40000h
    sub  eax,val3         ; subtract 20000h
    mov  finalVal,eax     ; store the result (30000h)
    call DumpRegs         ; display the registers
    exit
main ENDP
END main
```

| 실행한 줄 | EAX | `finalVal` |
|---|---|---|
| (시작) | 정해지지 않음 | 정해지지 않음 (`?`) |
| `mov eax,val1` | `00010000h` | 그대로 |
| `add eax,val2` | `00050000h` | 그대로 |
| `sub eax,val3` | `00030000h` | 그대로 |
| `mov finalVal,eax` | `00030000h` | `00030000h` |

이 프로그램은 뼈대의 앞 네 줄 대신 `INCLUDE Irvine32.inc` 한 줄을 쓴다. 이 파일 안에 `.model`과 `.stack` 같은 줄과 라이브러리 프로시저의 선언이 들어 있기 때문이다. `exit`는 `INVOKE ExitProcess,0`의 줄임말이다[^s2]. `call DumpRegs`는 레지스터와 플래그를 화면에 찍는 라이브러리 프로시저를 부른다: [Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/). 이 프로그램에서는 EAX가 `00030000`으로 찍힌다. 화면 전체의 모양은 [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)의 예제에 있다.

### 권하는 쓰기 규칙

어셈블러가 강제하는 것은 아니고, 읽기 좋게 쓰자는 약속이다.

- 대문자 쓰기는 한 가지로 정해 끝까지 지킨다. 전부 소문자, 전부 대문자, 예약어만 대문자, 지시어와 연산자만 대문자 가운데 고른다.
- 이름은 뜻이 드러나게 짓는다.
- 레이블은 들여 쓰지 않고, 실행하는 명령은 4~5칸 들여 쓴다.
- 니모닉과 피연산자 사이는 1~3칸 띄운다. 예: `mov  ax,bx`.
- 주석은 줄 오른쪽에 세로로 맞춘다.
- 프로시저 사이에 빈 줄을 1~2줄 둔다.

## 활용

- 흔한 실수: `main ENDP`와 `END main`을 같은 것으로 보고 하나를 빼는 것. 앞의 것은 프로시저의 끝, 뒤의 것은 원본 파일의 끝이다.
- 흔한 실수: `INVOKE ExitProcess,0`(또는 `exit`)을 빼는 것. 프로세서는 `main`의 마지막 명령 다음에 메모리에 놓인 것을 계속 명령으로 읽어 나간다[^s1].
- `.model`의 `stdcall`이 정하는 것: [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/). `PROTO`와 `INVOKE`: [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/).

## 연결

- 선수: [어셈블리 문장의 구성](/Hongs_Blog/studies/assembly-language/asm-statement-elements/), [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/)
- 이 글자 파일이 실행 파일이 되는 길: [어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/). `.data` 칸에 쓰는 줄: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)
- 코드, 데이터, 스택 구역이 프로그램이 돌 때 메모리에 놓이는 모습: [실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** AddSub2에서 세 변수를 `val1 DWORD 5000h`, `val2 DWORD 3000h`, `val3 DWORD 1000h`로 바꿨다. 명령 네 줄을 차례로 실행할 때 EAX와 `finalVal`의 값을 줄마다 쓰라.</summary>

**답:** `mov eax,val1` 뒤 EAX = `5000h`. `add eax,val2` 뒤 `8000h`. `sub eax,val3` 뒤 `7000h`. `mov finalVal,eax` 뒤 EAX는 그대로 `7000h`이고 `finalVal` = `7000h`.<br>
**흔한 오답:** 마지막 줄 뒤 EAX가 0이 된다고 적는 것. `mov`는 값을 베끼는 것이라 원래 자리의 값은 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** AddTwo 프로그램 전체가 하는 일을 한 문장으로 쓰라. 프로그램이 끝났을 때 EAX의 값은?</summary>

**답:** EAX 레지스터에 5를 넣고 6을 더한 뒤, 운영체제에 끝났다고 알리고 끝낸다. EAX = `0000000Bh`(11).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `main ENDP`와 `END main`은 각각 무엇을 끝내는가? `.data`와 `.code`의 순서를 바꿔 `.code`를 먼저 써도 두 줄의 뜻은 그대로인가?</summary>

**답:** `main ENDP`는 `main` 프로시저를 끝낸다. `END main`은 원본 파일을 끝내고, 프로그램이 `main`에서 시작한다고 알린다. `.data`와 `.code`는 "여기부터 어느 구역"이라는 표시일 뿐이라 순서를 바꿔도 각 줄이 자기 구역에 들어가는 것은 같다.<br>
**이유:** `ENDP`는 `PROC`와 짝이고, `END`는 파일에 하나뿐이다. 구역 표시는 다음 구역 표시가 나올 때까지 이어진다[^s1].

</details>


[^s1]: 표의 풀이는 교재 Irvine, *Assembly Language for x86 Processors* 7판, 3.2절을 따랐다.
[^s2]: 추적 표는 검증 코드의 흉내 실행 결과다. `.MODEL flat,stdcall`, `.STACK 4096`, `exit EQU <INVOKE ExitProcess,0>`은 Irvine32.inc가 불러오는 정의 파일 SmallWin.inc에 적혀 있다.
{% endraw %}
