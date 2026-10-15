---
layout: "note"
title: "Irvine32 라이브러리"
display_title: "Irvine32 라이브러리 (Irvine32 Library)"
kind: "concept"
kind_label: "정의"
num: "28"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Irvine32", "Irvine32 Library", "Irvine32.inc", "INCLUDE 지시어", "WriteString", "WriteHex", "WriteDec", "WriteInt", "WriteBin", "ReadString", "DumpRegs", "DumpMem", "Crlf", "Clrscr", "RandomRange", "SetTextColor", "링크 라이브러리", "Link Library"]
description: "화면에 숫자 하나를 찍는 일도 맨손으로 하려면 수를 글자로 바꾸고 운영체제에 부탁하는 코드를 길게 써야 한다. 교재 저자가 이런 일을 미리 만들어 둔 도구 상자가 있어서, 약속된 레지스터에 값을 넣고 도구 이름을 부르기만 하면 된다. 덕분에 입출력에 매이지 않고 배우려는 명령에 집…"
prev_url: "/studies/assembly-language/procedure-register-parameters/"
prev_title: "레지스터 매개변수와 USES"
next_url: "/studies/assembly-language/bitwise-instructions/"
next_title: "비트 논리 명령"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/irvine32-library/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

화면에 숫자 하나를 찍는 일도 맨손으로 하려면 수를 글자로 바꾸고 운영체제에 부탁하는 코드를 길게 써야 한다. 교재 저자가 이런 일을 미리 만들어 둔 도구 상자가 있어서, 약속된 레지스터에 값을 넣고 도구 이름을 부르기만 하면 된다. 덕분에 입출력에 매이지 않고 배우려는 명령에 집중할 수 있다. 다만 도구마다 값을 받는 레지스터가 정해져 있어서, 다른 레지스터에 넣고 부르면 오류 없이 엉뚱한 것이 찍힌다.

</div>


## 예시로 보기

지금까지의 프로그램은 계산을 해도 결과를 볼 길이 없었다. EAX에 든 값을 화면에 16진수로 찍어 본다.

```asm
INCLUDE Irvine32.inc
.code
    mov eax,1234h       ; 찍을 값을 EAX에 넣고
    call WriteHex       ; 16진수로 찍는다
    call Crlf           ; 줄을 바꾼다
```

세 가지를 한다. 맨 위에 `INCLUDE Irvine32.inc`를 쓴다. 약속된 레지스터에 값을 넣는다. `CALL`로 프로시저를 부른다. `INCLUDE` 지시어는 프로시저들의 선언(원형)을 그 자리에 복사해 넣는다. 그래야 어셈블러가 `WriteHex`라는 이름을 안다.

실제 라이브러리의 `WriteHex`는 32비트 값을 앞자리를 0으로 채운 여덟 자리로 찍는 것으로 알려져 있다. 그러면 이 코드는 `00001234`를 찍는다[확인필요].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 35의 2진·10진·16진 표기, EFL=00000286에서 읽은 플래그, 예제 2와 2a의 출력이 같은 것, `SIZEOF fileName - 1` = 79, 예제 5의 호출 순서와 0~99 범위, `yellow + (blue * 16)` = 1Eh, 프로시저 48개 — [28_irvine32-library_verify.py](/Hongs_Blog/studies/assembly-language/code/28_irvine32-library_verify/) (라이브러리 자체는 돌리지 못했다. 본문에 실린 출력과 인수 계산만 파이썬으로 다시 셈했고, 호출 순서는 라이브러리 프로시저를 파이썬 함수로 바꿔 끼운 흉내로 확인했다)</div>

</div>


## 부르는 법

모든 프로시저를 `CALL`로 부른다. 어떤 프로시저는 받는 값이 있다. 받는 값은 레지스터로 넘긴다([레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)). 아래 예제에 나오는 약속은 다음과 같다.

| 프로시저 | 부르기 전에 넣는 것 | 하는 일 |
|---|---|---|
| `WriteHex`, `WriteDec`, `WriteBin`, `WriteInt` | EAX = 찍을 수 | 16진, 부호 없는 10진, 2진, 부호 있는 10진으로 찍는다 |
| `WriteString` | EDX = 문자열의 주소 | 0으로 끝나는 문자열을 찍는다 |
| `ReadString` | EDX = 받을 자리의 주소, ECX = 받을 글자 수의 한도 | 글자를 읽어 넣고 끝에 0을 붙인다 |
| `Delay` | EAX = 멈출 시간(밀리초) | 그만큼 멈춘다 |
| `RandomRange` | EAX = 위쪽 한계 n | 0부터 n − 1까지의 난수를 EAX로 돌려준다 |
| `SetTextColor` | EAX = 글자색 + 배경색 × 16 | 이후에 찍는 글자의 색을 바꾼다 |
| `Crlf`, `Clrscr`, `DumpRegs` | 없음 | 줄 바꾸기, 화면 지우기, 레지스터와 플래그 찍기 |

## 예제 여섯

**예제 1.** 화면을 지우고, 500밀리초 멈추고, 레지스터와 플래그를 찍는다.

```asm
    call Clrscr
    mov eax,500
    call Delay
    call DumpRegs
```

```
EAX=00000613  EBX=00000000  ECX=000000FF  EDX=00000000
ESI=00000000  EDI=00000100  EBP=0000091E  ESP=000000F6
EIP=00401026  EFL=00000286  CF=0  SF=1  ZF=0  OF=0
```

`DumpRegs`는 프로그램을 고칠 때 가장 자주 쓴다. 명령 하나를 실행한 뒤 레지스터와 플래그가 어떻게 됐는지 눈으로 본다. 위 출력에서 `EFL=00000286`은 플래그가 모인 레지스터의 값이고, 뒤의 네 칸은 거기서 네 비트를 뽑아 보여 준 것이다. 286h는 2진수로 `0010 1000 0110`이다. 0번 비트(CF)가 0, 6번 비트(ZF)가 0, 7번 비트(SF)가 1, 11번 비트(OF)가 0이라 옆에 적힌 값과 맞는다[^s1].

**예제 2와 2a.** 0으로 끝나는 문자열을 찍고 다음 줄 맨 앞으로 간다. 줄 바꾸기를 `Crlf`로 해도 되고, 문자열 안에 줄 바꿈 글자 둘(0Dh, 0Ah)을 넣어도 된다.

```asm
.data
str1 BYTE "Assembly language is easy!",0
.code
    mov edx,OFFSET str1
    call WriteString
    call Crlf
```

```asm
.data
str1 BYTE "Assembly language is easy!",0Dh,0Ah,0
.code
    mov edx,OFFSET str1
    call WriteString
```

0Dh는 줄 맨 앞으로 가는 글자(CR), 0Ah는 한 줄 내려가는 글자(LF)다([부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)). `Crlf`라는 이름이 이 둘을 합친 것이다[^s1].

**예제 3.** 부호 없는 정수 35를 2진, 10진, 16진으로 한 줄씩 찍는다.

```asm
IntVal = 35
.code
    mov eax,IntVal
    call WriteBin       ; 2진
    call Crlf
    call WriteDec       ; 10진
    call Crlf
    call WriteHex       ; 16진
    call Crlf
```

```
0000 0000 0000 0000 0000 0000 0010 0011
35
23
```

$$35 = 32 + 2 + 1$$이라 2진수 끝이 `10 0011`이고, 네 자리씩 끊어 읽으면 23h다.

**예제 4.** 사용자에게서 문자열을 받는다. EDX가 받을 자리를 가리키고, ECX가 받을 수 있는 글자 수의 한도다. 끝에 0이 저절로 붙는다.

```asm
.data
fileName BYTE 80 DUP(0)
.code
    mov edx,OFFSET fileName
    mov ecx,SIZEOF fileName - 1     ; 79
    call ReadString
```

왜 80이 아니라 79일까? 80칸 가운데 한 칸은 끝에 붙을 0의 자리로 남겨야 한다.

**예제 5.** 0부터 99까지의 난수 열 개를 한 줄에 하나씩 찍는다.

```asm
    mov ecx,10              ; 열 번
L1: mov eax,100             ; 위쪽 한계
    call RandomRange        ; EAX = 0~99의 난수
    call WriteInt           ; 부호 있는 정수로 찍는다
    call Crlf
    loop L1
```

`RandomRange`가 EAX로 돌려준 값을 `WriteInt`가 그대로 EAX로 받는다. 그래서 둘 사이에 옮기는 명령이 없다.

**예제 6.** 파란 바탕에 노란 글자로 문자열을 찍는다. 배경색에 16을 곱해 글자색에 더한다.

```asm
.data
str1 BYTE "Color output is easy!",0
.code
    mov eax,yellow + (blue * 16)
    call SetTextColor
    mov edx,OFFSET str1
    call WriteString
    call Crlf
```

16을 곱하면 16진수에서 한 자리 왼쪽으로 간다. 그래서 위 자리(위 4비트)가 배경색, 아래 자리가 글자색이 된다. `yellow`가 14, `blue`가 1이면 $$14 + 1 \times 16 = 30$$, 곧 1Eh다[^s2]. 같은 꼴의 색 바이트가 [BIOS 비디오 INT 10h와 속성 바이트](/Hongs_Blog/studies/assembly-language/bios-video-int10h/)에 다시 나온다.

## 프로시저 목록

자주 쓰는 프로시저 48개를 하는 일끼리 묶으면 다음과 같다[^s1].

| 묶음 | 프로시저 | 하는 일 |
|---|---|---|
| 수 찍기 | `WriteBin`, `WriteBinB` | 부호 없는 32비트 정수를 2진으로. `B`가 붙은 것은 바이트·워드·더블워드 크기를 골라서 |
| | `WriteDec`, `WriteInt` | 부호 없는 10진, 부호 있는 10진 |
| | `WriteHex`, `WriteHexB` | 16진. `B`가 붙은 것은 크기를 골라서 |
| 글자 찍기 | `WriteChar`, `WriteString`, `Crlf` | 글자 하나, 0으로 끝나는 문자열, 줄 바꿈 |
| 수 읽기 | `ReadDec`, `ReadInt`, `ReadHex` | 키보드에서 부호 없는 10진, 부호 있는 10진, 16진 정수를 읽는다 |
| 글자 읽기 | `ReadChar`, `ReadKey`, `ReadString` | 글자 하나, 키보드 버퍼의 글자, Enter까지의 문자열 |
| 화면 | `Clrscr`, `Gotoxy`, `GetMaxXY` | 지우고 커서를 왼쪽 위로, 커서를 행·열로 옮기기, 콘솔의 열·행 수 |
| | `SetTextColor`, `GetTextColor` | 글자색·배경색 정하기, 지금 색 알아내기 |
| | `WaitMsg`, `MsgBox`, `MsgBoxAsk` | 메시지를 찍고 Enter 기다리기, 팝업 창 띄우기 |
| 시간 | `Delay`, `GetMseconds`, `GetDateTime` | n밀리초 멈추기, 자정부터 흐른 밀리초, 지금 날짜와 시각 |
| 난수 | `Randomize`, `Random32`, `RandomRange` | 난수 발생기 씨앗 넣기, 0~FFFFFFFFh의 난수, 범위 안의 난수 |
| 문자열 | `Str_compare`, `Str_copy`, `Str_length` | 두 문자열 견주기, 복사, 길이를 EAX로 |
| | `Str_trim`, `Str_ucase` | 필요 없는 글자 떼기, 대문자로 바꾸기 |
| 글자 판별·변환 | `IsDigit` | AL이 숫자 글자(0~9)의 ASCII 코드면 ZF를 1로 |
| | `ParseDecimal32`, `ParseInteger32` | 부호 없는·부호 있는 정수 문자열을 2진 값으로 |
| 파일 | `CreateOutputFile`, `OpenInputFile`, `CloseFile` | 쓸 파일 만들기, 있는 파일 열기, 닫기 |
| | `ReadFromFile`, `WriteToFile` | 파일을 버퍼로 읽기, 버퍼를 파일에 쓰기 |
| 고칠 때 | `DumpRegs`, `DumpMem` | 레지스터와 플래그를 16진으로, 메모리 한 구역을 16진으로 |
| | `WriteStackFrame`, `WriteStackFrameName` | 지금 프로시저의 [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)을 찍기. 뒤의 것은 프로시저 이름도 함께 |
| 그 밖 | `GetCommandtail`, `WriteWindowsMsg` | 명령줄에 덧붙인 글자를 바이트 배열로, 윈도우가 가장 최근에 낸 오류 메시지 |

`IsDigit`처럼 답을 플래그로 돌려주는 프로시저는 부른 뒤 바로 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)로 갈라 쓴다.

## 활용

- 실습 프로그램을 고칠 때의 기본 도구는 `DumpRegs`와 `DumpMem`이다. [런타임 스택](/Hongs_Blog/studies/assembly-language/runtime-stack/)의 예제도 `DumpMem`을 ESI(주소), ECX(개수), EBX(원소 크기)로 부른다.
- 이 프로시저들은 결국 운영체제에 일을 부탁한다. 16비트 MS-DOS에서 같은 일을 운영체제에 직접 부탁하는 방법은 [INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/)에 있다.
- 흔한 실수: 찍을 값을 약속과 다른 레지스터에 넣는다. `WriteString`을 부르면서 주소를 EAX에 넣으면 어셈블러는 오류를 내지 않는다. 프로시저는 EDX에 들어 있던 값을 주소로 쓴다[^s1].
- 흔한 실수: `LOOP` 안에서 부르는 프로시저가 EAX로 값을 돌려주는 것을 잊고, EAX에 넣어 둔 값이 남아 있으리라 기대한다. 예제 5가 `mov eax,100`을 루프 안에서 매번 다시 하는 까닭이다.

## 연결

- 선수: [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), [레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)
- `INCLUDE`가 들어가는 자리와 라이브러리가 합쳐지는 단계: [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/), [어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/)
- 같은 일을 운영체제와 BIOS에 직접 부탁하기: [INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/), [BIOS 비디오 INT 10h와 속성 바이트](/Hongs_Blog/studies/assembly-language/bios-video-int10h/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `WriteString`, `WriteDec`, `ReadString`을 부르기 전에 어느 레지스터에 무엇을 넣는가?</summary>

**답:** `WriteString`: EDX에 0으로 끝나는 문자열의 주소. `WriteDec`: EAX에 찍을 부호 없는 정수. `ReadString`: EDX에 받을 자리의 주소, ECX에 받을 글자 수의 한도.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `fileName BYTE 80 DUP(0)`에 문자열을 받을 때 ECX에 `SIZEOF fileName`이 아니라 `SIZEOF fileName - 1`을 넣는 까닭은?</summary>

**답:** `ReadString`은 읽은 글자 뒤에 0을 하나 붙인다. 80칸에 글자 80개를 받으면 0이 들어갈 자리가 없다. 79개까지만 받게 해 마지막 한 칸을 남긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 글자색 상수가 `white = 15`, `red = 4`라 하자. 빨간 바탕에 흰 글자로 바꾸려면 `SetTextColor`를 부르기 전 EAX에 넣을 식과 그 값을 16진수로 쓰라.</summary>

**답:** `mov eax,white + (red * 16)`. 값은 $$15 + 64 = 79$$, 곧 4Fh.<br>
**이유:** 배경색에 16을 곱해 위 자리로 올린다. 16진수 4Fh의 위 자리 4가 배경(빨강), 아래 자리 F가 글자색(흰색)이다. `red + (white * 16)` = F4h로 쓰면 흰 바탕에 빨간 글자가 된다.

</details>


[^s1]: EFLAGS의 비트 자리(CF 0번, ZF 6번, SF 7번, OF 11번)는 Intel 64 and IA-32 Architectures Software Developer's Manual 1권 3.4.3절을 따랐다.
[^s2]: Irvine32.inc는 black = 0, blue = 1, …, yellow = 14, white = 15로 정해 둔다. 카드 C3의 값도 이 표를 따랐다.
{% endraw %}
