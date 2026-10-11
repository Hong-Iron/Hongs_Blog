---
layout: "note"
title: "데이터 전송 명령"
display_title: "데이터 전송 명령 (Data Transfer Instructions)"
kind: "concept"
kind_label: "정의"
num: "16"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Data Transfer Instructions", "MOV", "MOV 명령", "MOV Instruction", "XCHG", "XCHG 명령", "XCHG Instruction", "목적지 피연산자", "Destination Operand", "원본 피연산자", "Source Operand", "크기 불일치", "Size Mismatch"]
description: "값을 한 곳에서 다른 곳으로 옮겨 적는 명령과, 두 곳의 값을 맞바꾸는 명령이다. 옮겨 적어도 원래 자리의 값은 그대로 남으므로 \"이동\"보다 \"복사\"에 가깝다. 계산은 거의 다 레지스터에서 하므로 프로그램의 절반은 값을 나르는 이 명령이다. 다만 양쪽의 크기가 같아야 하고, 메모리…"
prev_url: "/studies/assembly-language/operand-types/"
prev_title: "피연산자의 종류"
next_url: "/studies/assembly-language/zero-sign-extension/"
next_title: "제로 확장과 부호 확장"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/data-transfer-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

값을 한 곳에서 다른 곳으로 옮겨 적는 명령과, 두 곳의 값을 맞바꾸는 명령이다. 옮겨 적어도 원래 자리의 값은 그대로 남으므로 "이동"보다 "복사"에 가깝다. 계산은 거의 다 레지스터에서 하므로 프로그램의 절반은 값을 나르는 이 명령이다. 다만 양쪽의 크기가 같아야 하고, 메모리에서 메모리로는 한 번에 옮기지 못해 레지스터를 한 번 거쳐야 한다.

</div>


## 예시로 보기

변수 `var1`의 값을 `var2`에 넣고 싶다. C라면 `var2 = var1;` 한 줄이다. 어셈블리에서는 그렇게 쓰면 오류다. 한 명령이 메모리 두 곳을 동시에 건드릴 수 없기 때문이다. 레지스터를 징검다리로 쓴다[^s1].

```asm
mov ax,var1      ; 메모리 → 레지스터
mov var2,ax      ; 레지스터 → 메모리
```

`MOV`는 쉼표 왼쪽이 받는 쪽, 오른쪽이 주는 쪽이다. `mov ax,var1`은 "AX ← var1"로 읽는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 MOV·XCHG 예와 오류 줄, Your turn 다섯 줄의 오류 이유, 두 변수 맞바꾸기 추적, MOV 뒤에 플래그가 그대로인 것, 카드 C1·C2. 파이썬 흉내로 확인 — [16_data-transfer-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/16_data-transfer-instructions_verify/)</div>

</div>


## 정의

### MOV

주는 쪽(원본, source)의 값을 받는 쪽(목적지, destination)에 복사한다[^1].

```
MOV 목적지,원본
```

지켜야 할 규칙은 다음과 같다[^1].

- 두 피연산자의 크기가 같아야 한다.
- 메모리 피연산자는 많아야 하나다. 둘 다 메모리일 수 없다.
- CS, EIP, IP는 목적지가 될 수 없다.
- 즉시값을 세그먼트 레지스터에 바로 넣을 수 없다.

```asm
.data
count BYTE 100
wVal  WORD 2
.code
mov bl,count      ; 8비트 ← 8비트
mov ax,wVal       ; 16비트 ← 16비트
mov count,al      ; 메모리 ← 레지스터

mov al,wVal       ; 오류: 8비트 ← 16비트
mov ax,count      ; 오류: 16비트 ← 8비트
mov eax,count     ; 오류: 32비트 ← 8비트
```

`MOV`는 상태 플래그를 하나도 바꾸지 않는다[^2].

### XCHG

두 피연산자의 값을 맞바꾼다. 적어도 한쪽은 레지스터여야 하고, 즉시값은 쓸 수 없다[^3].

```asm
.data
var1 WORD 1000h
var2 WORD 2000h
.code
xchg ax,bx        ; 16비트 레지스터끼리
xchg ah,al        ; 8비트 레지스터끼리
xchg var1,bx      ; 메모리와 레지스터
xchg eax,ebx      ; 32비트 레지스터끼리

xchg var1,var2    ; 오류: 둘 다 메모리
```

## 예제

**틀린 MOV 다섯 줄.** 슬라이드의 문제와 답이다[^4].

```asm
.data
bVal  BYTE  100
bVal2 BYTE  ?
wVal  WORD  2
dVal  DWORD 5
```

| 명령 | 틀린 이유 |
|---|---|
| `mov ds,45` | 즉시값을 세그먼트 레지스터 DS에 넣을 수 없다 |
| `mov esi,wVal` | 크기가 다르다(32비트 ← 16비트) |
| `mov eip,dVal` | EIP는 목적지가 될 수 없다 |
| `mov 25,bVal` | 즉시값은 목적지가 될 수 없다 |
| `mov bVal2,bVal` | 메모리에서 메모리로는 옮길 수 없다 |

**두 변수 맞바꾸기.** `xchg var1,var2`가 안 되므로 레지스터를 거친다[^s1].

```asm
mov  ax,var1
xchg ax,var2
mov  var1,ax
```

| 명령 | AX | var1 | var2 |
|---|---|---|---|
| (처음) | ? | 1000h | 2000h |
| `mov ax,var1` | 1000h | 1000h | 2000h |
| `xchg ax,var2` | 2000h | 1000h | 1000h |
| `mov var1,ax` | 2000h | 2000h | 1000h |

## 활용

- 크기가 다른 값을 옮겨야 하면 `MOV` 대신 넓혀 주는 명령을 쓴다: [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/).
- `MOV`가 플래그를 바꾸지 않으므로, 계산 직후에 값을 옮겨도 그 계산이 남긴 플래그를 뒤에서 쓸 수 있다: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/).
- `ADD`와 `SUB`도 피연산자 규칙이 `MOV`와 같다: [덧셈·뺄셈 명령](/Hongs_Blog/studies/assembly-language/add-sub-instructions/).
- 흔한 실수: 방향을 거꾸로 쓴다. `mov 25,bVal`처럼 받는 쪽에 수를 두면 오류지만, `mov var1,ax`와 `mov ax,var1`은 둘 다 통과하고 뜻만 반대다.

## 연결

- 선수: [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/)
- 컴파일러가 `x = y`를 기계 명령으로 옮길 때도 메모리의 값을 레지스터에 올렸다가 다시 내린다: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `w WORD 7`, `dw DWORD 9`일 때 다음 가운데 어셈블되는 것은? 안 되는 것은 이유를 쓰라. (a) `mov ax,dw` (b) `mov w,w` (c) `mov w,300` (d) `mov bl,300` (e) `mov cs,ax`</summary>

**답:** (c)만 된다. (a) 크기가 다르다(16비트 ← 32비트). (b) 둘 다 메모리다. (d) 300은 8비트에 들어가지 않는다. (e) CS는 목적지가 될 수 없다.<br>
**이유:** (c)는 16비트 메모리에 즉시값을 넣는 것이고 300은 16비트에 들어간다. 메모리 피연산자가 하나뿐이라 문제없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `a BYTE 11h`, `b BYTE 22h`이고 EAX가 0일 때 다음을 차례로 실행한다. 줄마다 AX의 값을 쓰고, 끝난 뒤 `a`와 `b`의 값을 쓰라. `mov al,a` / `mov ah,b` / `xchg ah,al` / `mov a,al` / `mov b,ah`</summary>

**답:** AX는 0011h → 2211h → 1122h → 1122h → 1122h. 끝난 뒤 `a` = 22h, `b` = 11h.<br>
**이유:** AL은 AX의 아랫바이트, AH는 윗바이트다. `xchg ah,al`이 두 바이트를 맞바꾸고, 그 뒤 둘을 다시 메모리에 적으니 `a`와 `b`가 서로 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `mov ax,var1` 다음에 `mov var2,ax`를 실행한 뒤 `var1`의 값은 어떻게 되는가? `MOV`를 "이동"이라고 옮기면 생기는 오해를 한 문장으로 쓰라.</summary>

**답:** `var1`은 그대로다. "이동"이라고 하면 원래 자리가 비는 것처럼 들리지만, `MOV`는 주는 쪽을 바꾸지 않고 받는 쪽에 같은 값을 적을 뿐이다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_04-4-4」, p.7 (MOV Instruction: 문법, 규칙, 예와 오류 세 줄)
[^2]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-1」, p.11 (The MOV instruction never affects the flags)
[^3]: 어셈블리어 4회 강의 자료 「wk04-chapt_04-4-4」, p.11 (XCHG Instruction)
[^4]: 같은 자료, p.8 (Your turn: 틀린 MOV 다섯 줄과 이유)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 레지스터를 거쳐 메모리에서 메모리로 옮기는 두 줄, 두 변수 맞바꾸기 세 줄과 추적 표, 흔한 실수, 카드 C1~C3은 원본에 없다. 두 코드는 Irvine, *Assembly Language for x86 Processors* 7판 4.1.4절과 4.1.7절에 있다. 추적 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
