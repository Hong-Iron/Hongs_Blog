---
layout: "note"
title: "OFFSET과 PTR 연산자"
display_title: "OFFSET과 PTR 연산자 (OFFSET and PTR Operators)"
kind: "concept"
kind_label: "기법"
num: "21"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["OFFSET Operator", "PTR Operator", "OFFSET 연산자", "PTR 연산자", "BYTE PTR", "WORD PTR", "DWORD PTR", "LABEL 지시어", "LABEL Directive", "오프셋", "Offset", "포인터", "Pointer"]
description: "변수 이름을 쓰면 보통은 그 칸에 든 값을 뜻한다. 두 연산자는 이 기본을 바꾼다. 하나는 값 대신 그 칸이 어디 있는지, 곧 주소를 내놓는다. 다른 하나는 \"이 칸을 정의할 때와 다른 크기로 읽어라\"라고 시킨다. 덕분에 큰 값의 일부만 꺼내거나 작은 값 여러 개를 묶어 한 번에 …"
prev_url: "/studies/assembly-language/carry-vs-overflow-flag/"
prev_title: "올림 플래그와 넘침 플래그 비교"
next_url: "/studies/assembly-language/type-lengthof-sizeof/"
next_title: "TYPE·LENGTHOF·SIZEOF 연산자"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/offset-ptr-operators/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

변수 이름을 쓰면 보통은 그 칸에 든 값을 뜻한다. 두 연산자는 이 기본을 바꾼다. 하나는 값 대신 그 칸이 어디 있는지, 곧 주소를 내놓는다. 다른 하나는 "이 칸을 정의할 때와 다른 크기로 읽어라"라고 시킨다. 덕분에 큰 값의 일부만 꺼내거나 작은 값 여러 개를 묶어 한 번에 읽을 수 있다. 다만 크기를 바꿔 읽으면 어느 바이트가 윗자리가 되는지를 직접 따져야 하고, 변수의 끝을 넘어 읽어도 막아 주지 않는다.

</div>


## 예시로 보기

4바이트 변수 `myDouble`의 아래 2바이트만 AX에 가져오고 싶다. 그대로 쓰면 오류다. `myDouble`은 32비트, AX는 16비트라 크기가 다르다.

```asm
.data
myDouble DWORD 12345678h
.code
mov ax,myDouble               ; 오류: 크기가 다르다
mov ax,WORD PTR myDouble      ; AX = 5678h
```

`WORD PTR`은 "이 주소에서 2바이트만 읽어라"다. 그런데 왜 윗자리 1234h가 아니라 5678h일까? 메모리에는 아랫자리 바이트가 앞에 놓여 있기 때문이다([리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/)).

```
더블워드    워드    바이트   오프셋
12345678   5678     78     0000   myDouble
                    56     0001   myDouble + 1
           1234     34     0002   myDouble + 2
                    12     0003   myDouble + 3
```

`myDouble` 자리에서 두 바이트 `78 56`을 읽으면, 높은 주소의 56이 윗자리가 되어 5678h다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: OFFSET 네 값, PTR 예의 모든 값, 4321h를 적은 뒤의 메모리, 연습 문제 다섯 답, LABEL 예, 카드 C1·C2. 파이썬 흉내로 확인 — [21_offset-ptr-operators_verify.py](/Hongs_Blog/studies/assembly-language/code/21_offset-ptr-operators_verify/)</div>

</div>


## 정의

**OFFSET.** 이름이 붙은 자리가 자기가 속한 세그먼트의 시작에서 몇 바이트 떨어져 있는지를 준다. 보호 모드에서는 32비트, 실주소 모드에서는 16비트 값이다.

데이터 세그먼트가 00404000h에서 시작한다고 하자.

```asm
.data
bVal  BYTE  ?
wVal  WORD  ?
dVal  DWORD ?
dVal2 DWORD ?
.code
mov esi,OFFSET bVal     ; ESI = 00404000
mov esi,OFFSET wVal     ; ESI = 00404001
mov esi,OFFSET dVal     ; ESI = 00404003
mov esi,OFFSET dVal2    ; ESI = 00404007
```

앞 변수의 크기(1, 2, 4바이트)만큼씩 뒤로 밀린다. `OFFSET`이 주는 값은 포인터다. C++의 `char *p = array;`가 어셈블리에서는 `mov esi,OFFSET array`다.

**PTR.** 이름에 붙은 기본 크기를 무시하고 앞에 적은 크기로 읽거나 쓴다. 변수의 일부에 손댈 수 있게 해 준다.

```
크기 PTR 메모리 피연산자          (크기: BYTE, WORD, DWORD 등)
```

### 적용 조건과 알아보는 신호

| 신호 | 쓰는 것 |
|---|---|
| 값이 아니라 변수의 주소가 필요하다(배열을 훑을 레지스터에 시작 주소를 넣는다) | `OFFSET` |
| 변수와 레지스터의 크기가 달라 "크기가 다르다" 오류가 난다 | `PTR` |
| 큰 변수의 한 바이트나 한 워드만 고치고 싶다 | `PTR` |
| `[esi]`처럼 크기를 알 수 없는 메모리 피연산자에 즉시값을 쓰거나 `INC`를 한다 | `PTR` ([간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)) |

## 예제

**큰 것의 일부를 읽는다.**

```asm
mov al,BYTE PTR myDouble         ; AL = 78h
mov al,BYTE PTR [myDouble+1]     ; AL = 56h
mov al,BYTE PTR [myDouble+2]     ; AL = 34h
mov ax,WORD PTR myDouble         ; AX = 5678h
mov ax,WORD PTR [myDouble+2]     ; AX = 1234h
```

**일부만 쓴다.** `mov WORD PTR myDouble,4321h`는 아래 두 바이트만 `21 43`으로 바꾼다. 메모리는 `21 43 34 12`가 되고 `myDouble`은 12344321h가 된다[^s1].

**작은 것을 모아 큰 것으로 읽는다.** CPU가 바이트 순서를 알아서 뒤집어 준다.

```asm
.data
myBytes BYTE 12h,34h,56h,78h
.code
mov ax,WORD PTR [myBytes]        ; AX = 3412h
mov ax,WORD PTR [myBytes+2]      ; AX = 7856h
mov eax,DWORD PTR myBytes        ; EAX = 78563412h
```

**연습 문제.**

```asm
.data
varB BYTE 65h,31h,02h,05h
varW WORD 6543h,1202h
varD DWORD 12345678h
.code
mov ax,WORD PTR [varB+2]     ; a. 0502h
mov bl,BYTE PTR varD         ; b. 78h
mov bl,BYTE PTR [varW+2]     ; c. 02h
mov ax,WORD PTR [varD+2]     ; d. 1234h
mov eax,DWORD PTR varW       ; e. 12026543h
```

**LABEL 지시어.** 이미 있는 자리에 다른 이름과 다른 크기를 하나 더 붙인다. 자기 몫의 메모리는 잡지 않는다. 이름을 붙여 두면 `PTR`을 쓰지 않아도 된다.

```asm
.data
dwList   LABEL DWORD
wordList LABEL WORD
intList  BYTE 00h,10h,00h,20h
.code
mov eax,dwList       ; 20001000h
mov cx,wordList      ; 1000h
mov dl,intList       ; 00h
```

세 이름 모두 같은 주소를 가리키고 읽는 크기만 다르다.

## 활용

- 풀이 순서는 늘 같다. 변수를 메모리 바이트로 펼치고, 시작 자리를 찾고, 크기만큼 집어서, 높은 주소 쪽이 윗자리가 되게 붙인다. 연습: [PTR과 리틀 엔디언 예제 사다리](/Hongs_Blog/studies/assembly-language/ptr-little-endian-ladder/).
- `PTR`은 메모리의 값을 바꾸지 않는다. 같은 바이트를 몇 개씩 묶어 읽을지만 바꾼다. 자바의 타입 변환이 값을 새 크기로 고쳐 만드는 것과 다르다: [타입 변환](/Hongs_Blog/studies/java/java-type-conversion/)[^s1].
- 흔한 실수: `mov eax,DWORD PTR varW`가 `varW` 한 원소(2바이트)만 읽는다고 생각한다. 4바이트를 읽으므로 뒤의 원소나 다음 변수까지 따라 들어온다.
- 실행 중에 정해지는 주소는 `OFFSET`으로 얻을 수 없다: [OFFSET과 LEA 비교](/Hongs_Blog/studies/assembly-language/offset-vs-lea/).

## 연결

- 선수: [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/), [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/), [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/)
- 주소가 32비트인 모드와 16비트인 모드: [x86 동작 모드](/Hongs_Blog/studies/assembly-language/x86-operating-modes/)
- 변수의 크기와 개수를 얻는 연산자: [TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 데이터 세그먼트가 00404000h에서 시작한다. `a WORD 1,2,3` / `b BYTE "Hi",0` / `c DWORD 5` 순서로 정의했을 때 `OFFSET a`, `OFFSET b`, `OFFSET c`를 쓰라.</summary>

**답:** 00404000h, 00404006h, 00404009h.<br>
**이유:** `a`는 워드 3개라 6바이트, `b`는 글자 둘과 0으로 3바이트를 차지한다. 각 이름의 오프셋은 앞에 놓인 바이트 수를 시작 주소에 더한 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `big DWORD 0CAFE1234h` 바로 뒤에 `small BYTE 0AAh,0BBh`가 있다. 차례로 실행할 때 각 줄의 결과를 쓰라. (가) `mov ax,WORD PTR [big+1]` (나) `mov bl,BYTE PTR [big+3]` (다) `mov cx,WORD PTR small` (라) `mov BYTE PTR big,0FFh` 뒤의 `big`</summary>

**답:** (가) AX = FE12h. (나) BL = CAh. (다) CX = BBAAh. (라) `big` = CAFE12FFh.<br>
**이유:** 메모리는 낮은 주소부터 `34 12 FE CA AA BB`다. (가) +1부터 두 바이트 `12 FE`에서 높은 주소의 FE가 윗자리다. (나) +3의 한 바이트. (다) `AA BB`를 워드로 읽으면 BBAAh다. (라) 가장 낮은 주소의 바이트 34가 FF로 바뀐다. 그 바이트는 값의 가장 아랫자리다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `myDouble DWORD 12345678h`에서 `mov ax,myDouble`은 왜 오류인가? `WORD PTR`을 붙이면 왜 1234h가 아니라 5678h가 들어오는가?</summary>

**답:** `MOV`는 두 피연산자의 크기가 같아야 하는데 `myDouble`은 32비트, AX는 16비트다. `WORD PTR myDouble`은 `myDouble`의 주소에서 2바이트를 읽는다. 그 자리에는 아랫자리 바이트부터 `78 56`이 놓여 있어 5678h가 된다. 1234h는 2바이트 뒤 `[myDouble+2]`에 있다.

</details>


[^s1]: 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
