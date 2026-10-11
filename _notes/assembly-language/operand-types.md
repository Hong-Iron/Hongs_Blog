---
layout: "note"
title: "피연산자의 종류"
display_title: "피연산자의 종류 (Operand Types)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Operand Types", "피연산자", "Operand", "즉시값", "Immediate Operand", "레지스터 피연산자", "Register Operand", "메모리 피연산자", "Memory Operand", "직접 메모리 피연산자", "Direct Memory Operand", "직접 오프셋 피연산자", "Direct-Offset Operand", "유효 주소", "Effective Address", "피연산자 표기법", "Instruction Operand Notation"]
description: "명령은 \"무엇을 하라\"와 \"무엇을 가지고\"로 이루어진다. \"무엇을 가지고\" 자리에 올 수 있는 것은 세 가지뿐이다. 코드에 직접 적은 수, CPU 안의 작은 저장 칸, 메모리의 한 자리다. 메모리의 자리는 변수 이름으로 가리키고, 이름에 수를 더하면 그 변수에서 몇 바이트 뒤의 자…"
prev_url: "/studies/assembly-language/symbolic-constants/"
prev_title: "기호 상수와 위치 카운터"
next_url: "/studies/assembly-language/data-transfer-instructions/"
next_title: "데이터 전송 명령"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/operand-types/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

명령은 "무엇을 하라"와 "무엇을 가지고"로 이루어진다. "무엇을 가지고" 자리에 올 수 있는 것은 세 가지뿐이다. 코드에 직접 적은 수, CPU 안의 작은 저장 칸, 메모리의 한 자리다. 메모리의 자리는 변수 이름으로 가리키고, 이름에 수를 더하면 그 변수에서 몇 바이트 뒤의 자리를 가리킨다. 이때 더해지는 것은 주소이지 값이 아니며, 배열 끝을 넘어가도 어셈블러는 막지 않는다.

</div>


## 예시로 보기

"AL에 값을 넣어라"만으로는 명령이 안 된다. 어떤 값인지, 그 값이 어디 있는지를 CPU에게 알려야 한다. 값이 있을 수 있는 곳이 셋이다.

```asm
.data
var1 BYTE 10h
.code
mov al,5         ; 코드에 적은 수 5
mov al,bl        ; 레지스터 BL에 든 값
mov al,var1      ; 메모리의 var1 자리에 든 값 10h
```

명령에 쓰는 이런 재료를 피연산자라 부른다. 첫째 줄의 `5`가 즉시값, 둘째 줄의 `bl`이 레지스터 피연산자, 셋째 줄의 `var1`이 메모리 피연산자다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 직접 메모리 피연산자, `arrayB+1`이 20h인 것, `[arrayW+2]`, `[arrayW+4]`, `[arrayD+4]`, 원소 가운데를 읽을 때의 값, 카드 C2·C3. 파이썬 흉내로 확인 — [15_operand-types_verify.py](/Hongs_Blog/studies/assembly-language/code/15_operand-types_verify/)</div>

</div>


## 정의

피연산자는 세 종류다[^1].

| 종류 | 무엇인가 | 기계어 명령 안에 들어가는 것 |
|---|---|---|
| 즉시값(immediate) | 상수 정수(8, 16, 32비트) | 그 값 자체 |
| 레지스터(register) | 레지스터 이름 | 이름을 바꾼 번호 |
| 메모리(memory) | 메모리의 한 자리 | 그 자리의 주소 |

명령마다 어느 자리에 어떤 피연산자를 쓸 수 있는지 적을 때는 다음 줄임말을 쓴다[^2].

| 표기 | 뜻 |
|---|---|
| `reg8` | 8비트 범용 레지스터: AH, AL, BH, BL, CH, CL, DH, DL |
| `reg16` | 16비트 범용 레지스터: AX, BX, CX, DX, SI, DI, SP, BP |
| `reg32` | 32비트 범용 레지스터: EAX, EBX, ECX, EDX, ESI, EDI, ESP, EBP |
| `reg` | 아무 범용 레지스터 |
| `sreg` | 16비트 세그먼트 레지스터: CS, DS, SS, ES, FS, GS |
| `imm` | 8, 16, 32비트 즉시값 |
| `imm8`, `imm16`, `imm32` | 8비트, 16비트, 32비트 즉시값 |
| `reg/mem8` | 8비트 피연산자. 8비트 범용 레지스터이거나 메모리의 바이트 |
| `reg/mem16`, `reg/mem32` | 16비트, 32비트 피연산자. 레지스터이거나 메모리의 워드, 더블워드 |
| `mem` | 8, 16, 32비트 메모리 피연산자 |

**직접 메모리 피연산자.** 변수 이름으로 메모리의 자리를 가리킨다. 어셈블러가 이름을 주소로 바꾸고, 명령은 그 주소에 든 값을 쓴다. 대괄호를 씌워 `[var1]`로 써도 같다[^3].

```asm
mov al,var1      ; AL = 10h
mov al,[var1]    ; AL = 10h
```

**직접 오프셋 피연산자.** 이름에 상수를 더하면 "그 이름의 자리에서 그만큼 뒤"의 주소가 된다. 이렇게 계산해 얻은 주소를 유효 주소라 부른다. 명령은 그 주소에 든 값을 쓴다[^4].

```asm
.data
arrayB BYTE 10h,20h,30h,40h
.code
mov al,arrayB+1       ; AL = 20h
mov al,[arrayB+1]     ; 같은 뜻
```

## 예제

**`arrayB+1`은 왜 11h가 아닌가.** 슬라이드가 던지는 질문이다[^4]. `arrayB`는 값 10h가 아니라 그 값이 놓인 자리다. `+1`은 자리를 한 칸 옮긴다. 옮긴 자리에 든 값이 20h다. 값에 1을 더하고 싶으면 값을 꺼낸 뒤에 더하는 명령을 따로 쓴다[^s1].

```
주소        arrayB+0   arrayB+1   arrayB+2   arrayB+3
바이트         10         20         30         40
                          ▲
                       arrayB+1
```

**원소가 1바이트보다 클 때.** 더하는 수는 바이트 수다. 워드 배열의 다음 원소는 2 뒤, 더블워드 배열의 다음 원소는 4 뒤에 있다[^5].

```asm
.data
arrayW WORD 1000h,2000h,3000h
arrayD DWORD 1,2,3,4
.code
mov ax,[arrayW+2]     ; AX = 2000h
mov ax,[arrayW+4]     ; AX = 3000h
mov eax,[arrayD+4]    ; EAX = 00000002h
```

0번부터 셀 때 $$k$$번째 원소의 자리는 "이름 + $$k$$ × 원소 하나의 바이트 수"다[^s1].

**원소 가운데를 가리키면.** `mov ax,[arrayW+1]`은 오류가 아니다. `arrayW`의 메모리는 `00 10 00 20 00 30`이고, +1 자리부터 두 바이트 `10 00`을 읽어 AX는 0010h가 된다. 첫 원소의 윗바이트와 둘째 원소의 아랫바이트가 붙은 값이다[^s1].

## 활용

- 어셈블러는 이름에 더한 수가 배열 범위 안인지 확인하지 않는다. `arrayB+4`는 배열 바로 뒤에 놓인 다른 변수의 첫 바이트를 읽는다[^s1].
- 주소를 레지스터에 넣어 두고 실행 중에 옮겨 가며 쓰는 방법은 [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)에 있다.
- 명령마다 허용되는 피연산자 조합이 다르다. `MOV`의 규칙은 [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/)에 있다.

## 연결

- 선수: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/), [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/), [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/)
- 명령 한 줄에서 피연산자가 놓이는 자리: [어셈블리 문장의 구성](/Hongs_Blog/studies/assembly-language/asm-statement-elements/)
- 컴파일러의 중간 코드도 명령 하나에 재료를 많아야 셋 적는다. 그 재료(이름, 상수, 임시 변수)가 여기의 메모리, 즉시값, 레지스터로 옮겨진다: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 명령의 피연산자를 각각 즉시값, 레지스터, 메모리로 나누라. (a) `mov eax,[arrayD+4]` (b) `add bl,5` (c) `mov count,al`</summary>

**답:** (a) `eax` 레지스터, `[arrayD+4]` 메모리. (b) `bl` 레지스터, `5` 즉시값. (c) `count` 메모리, `al` 레지스터.<br>
**이유:** 수를 직접 적었으면 즉시값, 레지스터 이름이면 레지스터, 변수 이름(대괄호나 `+수`가 붙어도)이면 메모리다. `[arrayD+4]`의 4는 즉시값이 아니라 주소 계산의 일부다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `arrayW WORD 1000h,2000h,3000h`일 때 `mov ax,[arrayW+1]`을 실행한 뒤 AX는?</summary>

**답:** 0010h.<br>
**이유:** 메모리는 낮은 주소부터 `00 10 00 20 00 30`이다. +1 자리부터 두 바이트는 `10 00`이고, 높은 주소의 바이트가 윗자리라 0010h다. "두 번째 원소 2000h"라고 답하면 틀린다. 더하는 수는 원소 번호가 아니라 바이트 수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `tbl DWORD 10h,20h,30h`에서 세 번째 원소 30h를 EAX로 가져오는 명령을 쓰고, `mov eax,[tbl+2]`가 그 답이 아닌 이유를 대라. `[tbl+2]`로 읽히는 값도 쓰라.</summary>

**답:** `mov eax,[tbl+8]`. `[tbl+2]`는 00200000h를 읽는다.<br>
**이유:** 더블워드는 4바이트라 0번부터 센 2번 원소는 2 × 4 = 8 뒤에 있다. +2는 첫 원소의 가운데다. 메모리 `10 00 00 00 20 00 00 00 …`의 +2부터 네 바이트 `00 00 20 00`을 읽어 00200000h가 된다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_04-4-4」, p.4 (Operand Types)
[^2]: 같은 자료, p.5 (Instruction Operand Notation 표)
[^3]: 같은 자료, p.6 (Direct Memory Operands)
[^4]: 같은 자료, p.12 (Direct-Offset Operands, "Q: Why doesn't arrayB+1 produce 11h?")
[^5]: 같은 자료, p.13 (Direct-Offset Operands (cont): arrayW, arrayD)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시로 보기의 세 줄 코드, 슬라이드의 질문에 대한 답, 주소 그림, 원소 자리 식, 원소 가운데를 읽는 예, 범위를 확인하지 않는다는 설명, 카드 C1~C3은 원본에 없다. 범위를 확인하지 않는다는 점은 Irvine, *Assembly Language for x86 Processors* 7판 4.1.8절에 있다. 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
