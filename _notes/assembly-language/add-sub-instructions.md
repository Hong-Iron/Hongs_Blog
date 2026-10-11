---
layout: "note"
title: "덧셈·뺄셈 명령"
display_title: "덧셈·뺄셈 명령 (Addition and Subtraction)"
kind: "concept"
kind_label: "정의"
num: "18"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Addition and Subtraction", "INC", "DEC", "ADD", "SUB", "NEG", "INC 명령", "DEC 명령", "ADD 명령", "SUB 명령", "NEG 명령", "산술식 구현", "Implementing Arithmetic Expressions"]
description: "1 올리기, 1 내리기, 더하기, 빼기, 부호 바꾸기의 다섯 명령이다. 계산기의 버튼처럼 한 번에 한 가지만 하고, 결과는 늘 받는 쪽에 덮어쓴다. 그래서 긴 식은 한 줄에 못 쓰고 작은 계산 여러 줄로 쪼개야 한다. 계산은 명령에 적은 칸의 크기 안에서만 일어나므로, 칸이 넘쳐도…"
prev_url: "/studies/assembly-language/zero-sign-extension/"
prev_title: "제로 확장과 부호 확장"
next_url: "/studies/assembly-language/x86-status-flags/"
next_title: "산술 연산과 상태 플래그"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/add-sub-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

1 올리기, 1 내리기, 더하기, 빼기, 부호 바꾸기의 다섯 명령이다. 계산기의 버튼처럼 한 번에 한 가지만 하고, 결과는 늘 받는 쪽에 덮어쓴다. 그래서 긴 식은 한 줄에 못 쓰고 작은 계산 여러 줄로 쪼개야 한다. 계산은 명령에 적은 칸의 크기 안에서만 일어나므로, 칸이 넘쳐도 옆 칸으로 올림이 넘어가지 않는다.

</div>


## 예시로 보기

`Rval = -Xval + (Yval - Zval)`을 C 컴파일러는 알아서 기계어로 바꿔 준다. 어셈블리에는 식을 통째로 받는 명령이 없다. 사람이 손으로 계산하는 순서대로 한 줄씩 쓴다[^1].

```asm
.data
Rval DWORD ?
Xval DWORD 26
Yval DWORD 30
Zval DWORD 40
.code
mov eax,Xval
neg eax              ; EAX = -26
mov ebx,Yval
sub ebx,Zval         ; EBX = -10
add eax,ebx
mov Rval,eax         ; -36
```

변수 값을 레지스터로 가져와 거기서 계산하고, 다 되면 결과 변수에 적는다. `Xval`, `Yval`, `Zval`은 바뀌지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 INC·DEC·ADD·SUB·NEG 예와 Your turn 다섯 줄, NEG가 "0에서 빼기"와 같은 것(8비트 전수), 산술식의 −36, 카드 C1~C3. 파이썬 흉내로 확인 — [18_add-sub-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/18_add-sub-instructions_verify/)</div>

</div>


## 정의

| 명령 | 하는 일 | 피연산자 |
|---|---|---|
| `INC 목적지` | 목적지 ← 목적지 + 1 | 레지스터나 메모리[^2] |
| `DEC 목적지` | 목적지 ← 목적지 − 1 | 레지스터나 메모리[^2] |
| `ADD 목적지,원본` | 목적지 ← 목적지 + 원본 | `MOV`와 같은 규칙[^3] |
| `SUB 목적지,원본` | 목적지 ← 목적지 − 원본 | `MOV`와 같은 규칙[^3] |
| `NEG 목적지` | 목적지의 부호를 바꾼다 | 레지스터나 메모리[^4] |

화살표 ←는 "오른쪽을 계산해 왼쪽에 넣는다"다. `ADD`와 `SUB`가 `MOV`와 같은 규칙을 따른다는 말은, 두 피연산자의 크기가 같아야 하고 둘 다 메모리일 수 없다는 뜻이다: [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/).

`NEG`는 2의 보수를 구한다. 비트를 모두 뒤집고 1을 더한 값이고, 0에서 그 값을 뺀 것과 같다[^5][^s1].

## 예제

**INC와 DEC.**[^6]

```asm
.data
myWord  WORD  1000h
myDword DWORD 10000000h
.code
inc myWord       ; 1001h
dec myWord       ; 1000h
inc myDword      ; 10000001h

mov ax,00FFh
inc ax           ; AX = 0100h
mov ax,00FFh
inc al           ; AX = 0000h
```

마지막 두 경우가 갈린다. `inc ax`는 16비트 전체에서 00FFh + 1 = 0100h다. `inc al`은 아랫바이트 8비트 안에서만 FFh + 1을 하므로 AL이 00h로 돌아가고, 넘친 올림은 AH로 가지 않는다.

```
           AH        AL
mov ax,00FFh   00        FF
inc al         00        00      ← AL만 바뀐다. 올림은 버려진다
```

**슬라이드의 문제.**[^7]

```asm
.data
myByte BYTE 0FFh, 0
.code
mov al,myByte        ; AL = FFh
mov ah,[myByte+1]    ; AH = 00h
dec ah               ; AH = FFh
inc al               ; AL = 00h
dec ax               ; AX = FEFFh
```

`dec ah`는 00h에서 1을 빼 FFh가 된다. 그 시점의 AX는 FF00h이고, `dec ax`가 16비트 전체에서 1을 빼 FEFFh가 된다.

**ADD와 SUB.**[^8]

```asm
.data
var1 DWORD 10000h
var2 DWORD 20000h
.code                    ; ---EAX---
mov eax,var1             ; 00010000h
add eax,var2             ; 00030000h
add ax,0FFFFh            ; 0003FFFFh
add eax,1                ; 00040000h
sub ax,1                 ; 0004FFFFh
```

`add ax,0FFFFh`는 EAX의 아래 16비트(0000h)에만 더한다. `add eax,1`은 32비트 전체라 FFFFh에서 생긴 올림이 윗부분으로 올라가 0004가 된다. `sub ax,1`은 다시 아래 16비트 안에서만 0000h − 1 = FFFFh를 하고, 윗부분 0004는 그대로다.

**NEG.**[^4]

```asm
.data
valB BYTE -1
valW WORD +32767
.code
mov al,valB      ; AL = -1
neg al           ; AL = +1
neg valW         ; valW = -32767
```

8비트에서 −128(80h)에 `NEG`를 하면 80h가 그대로 나온다. +128은 8비트 부호 있는 수의 범위(−128~127)에 없기 때문이다[^s1].

## 활용

- 식을 옮길 때는 괄호 안부터, 변수는 레지스터로 가져와서 계산한다. 변수에 직접 `neg Yval`을 하면 `Yval` 자체가 바뀐다. 연습: [산술식을 어셈블리로 옮기기 연습](/Hongs_Blog/studies/assembly-language/arithmetic-expression-practice/).
- 이 명령들은 계산 결과에 따라 상태 플래그를 바꾼다. 칸이 넘쳤는지는 플래그를 봐야 안다: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/).
- 흔한 실수: 레지스터의 일부(`AL`, `AX`)에 한 계산이 나머지 부분까지 올림을 넘겨 줄 것이라고 생각한다.

## 연결

- 선수: [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/), [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- AL, AH, AX, EAX가 겹쳐 있는 모양: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)
- 컴파일러는 긴 식을 "연산 하나에 결과 하나"인 줄들로 먼저 쪼갠다. 위에서 손으로 한 일이 그것이다: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/), [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음을 차례로 실행할 때 줄마다 AX의 값을 쓰라. `mov ax,01FFh` / `inc al` / `dec ah` / `dec ax` / `inc al`</summary>

**답:** 01FFh → 0100h → 0000h → FFFFh → FF00h.<br>
**이유:** `inc al`은 AL 안에서만 FFh + 1 = 00h가 되고 AH의 01은 그대로다. `dec ah`가 01을 00으로 만든다. `dec ax`는 16비트 전체에서 0000h − 1 = FFFFh다. 마지막 `inc al`은 다시 AL만 00h로 만들고 AH의 FF는 그대로다. 둘째 줄을 0200h로 답하면 올림이 AH로 간다고 본 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** EAX가 0003FFFFh일 때 `add ax,1`과 `add eax,1`의 결과가 다른 이유를 쓰고, 두 결과를 쓰라.</summary>

**답:** `add ax,1`은 00030000h, `add eax,1`은 00040000h.<br>
**이유:** 계산은 명령에 적은 피연산자의 크기 안에서만 일어난다. `ax`는 아래 16비트라 FFFFh + 1의 올림이 버려지고 윗부분 0003은 그대로다. `eax`는 32비트 전체라 올림이 16번 비트로 올라간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `neg al`이 하는 일을 `SUB` 명령 하나와 다른 레지스터 하나로 바꿔 쓰라. AL이 5일 때 두 방법의 결과가 같은지 확인하라.</summary>

**답:** `mov bl,0` 다음에 `sub bl,al`. BL에 0 − AL이 들어간다. AL = 5면 둘 다 FBh(−5)다.<br>
**이유:** `NEG`는 0에서 그 값을 빼는 것이다. 결과가 AL이 아니라 BL에 들어간다는 점만 다르다.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-1」, p.9 (Implementing Arithmetic Expressions)
[^2]: 같은 자료, p.3 (INC and DEC Instructions)
[^3]: 같은 자료, p.6 (ADD and SUB Instructions: Same operand rules as for the MOV instruction)
[^4]: 같은 자료, p.8 (NEG (negate) Instruction)
[^5]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-2」, p.2 (NEG = Negate (same as SUB 0,operand))
[^6]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-1」, p.4 (INC and DEC Examples)
[^7]: 같은 자료, p.5 (Your turn: myByte)
[^8]: 같은 자료, p.7 (ADD and SUB Examples)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 줄마다 붙인 풀이 설명, AH·AL 그림, `NEG`가 비트를 뒤집고 1을 더하는 것이라는 설명, −128의 경계 사례, 흔한 실수, 카드 C1~C3은 원본에 없다. `NEG`의 정의는 Irvine, *Assembly Language for x86 Processors* 7판 4.2절에 있다. 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
