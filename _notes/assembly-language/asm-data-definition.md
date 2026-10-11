---
layout: "note"
title: "데이터 정의"
display_title: "데이터 정의 (Data Definition)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Data Definition", "Data Definition Statement", "데이터 정의문", "내장 자료형", "Intrinsic Data Types", "BYTE", "SBYTE", "WORD", "SWORD", "DWORD", "SDWORD", "QWORD", "TBYTE", "REAL4", "REAL8", "REAL10", "초깃값", "Initializer", "DUP 연산자", "DUP Operator", "널 종료 문자열", "Null-terminated String", "초기화하지 않은 데이터", "Uninitialized Data"]
description: "변수를 만든다는 것은 메모리에 칸을 잡아 두고 이름표를 붙이는 일이다. 한 줄에 이름, 칸의 크기, 처음 넣을 값을 적으면 어셈블러가 그 값을 바이트로 바꿔 적은 순서대로 메모리에 놓는다. 정해지는 것은 칸의 크기뿐이다. 그 안의 바이트를 수로 읽을지 글자로 읽을지는 나중에 그 칸…"
prev_url: "/studies/assembly-language/assemble-link-execute/"
prev_title: "어셈블·링크·실행 과정"
next_url: "/studies/assembly-language/little-endian/"
next_title: "리틀 엔디언"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/asm-data-definition/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

변수를 만든다는 것은 메모리에 칸을 잡아 두고 이름표를 붙이는 일이다. 한 줄에 이름, 칸의 크기, 처음 넣을 값을 적으면 어셈블러가 그 값을 바이트로 바꿔 적은 순서대로 메모리에 놓는다. 정해지는 것은 칸의 크기뿐이다. 그 안의 바이트를 수로 읽을지 글자로 읽을지는 나중에 그 칸을 쓰는 명령이 정하므로, 문자열 끝 표시를 빼먹어도 어셈블러는 알려 주지 않는다.

</div>


## 예시로 보기

레지스터는 여덟 개 남짓이다. 값이 그보다 많거나 오래 두어야 하면 메모리에 둘 곳이 필요하다. 그런데 메모리는 번호(주소)만 붙은 바이트의 긴 줄이다. "404000번 칸의 값"이라고 쓰는 대신 이름을 붙이고, 그 칸이 몇 바이트짜리인지 정해 두는 문장이 데이터 정의문이다.

```asm
value1 BYTE 10
```

`value1`이 이름, `BYTE`가 칸의 크기(1바이트), `10`이 처음 넣을 값이다[^1]. 값을 여러 개 적으면 그 순서대로 이어서 놓인다.

```asm
list4 BYTE 0Ah,20h,'A',22h
```

```
주소(list4 기준)   +0    +1    +2    +3
메모리 바이트      0A    20    41    22
```

이름 `list4`는 첫 칸(+0)의 주소다. `'A'`는 그 글자의 ASCII 코드 41h가 되어 들어간다. 10진수로 적든 16진수로 적든 글자로 적든 메모리에 들어가는 것은 모두 2진 바이트다[^1]. `list3 BYTE ?,32,41h,00100010b`의 뒤 세 값도 20h, 41h, 22h로 `list4`의 뒤 세 칸과 똑같다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이 문서의 바이트 배치와 바이트 수(list2 12, str1 16, greeting 62, menu 137, var3 20, var4 5), AddSub2의 30000h, 카드 C1·C3. 파이썬 흉내로 확인 — [12_asm-data-definition_verify.py](/Hongs_Blog/studies/assembly-language/code/12_asm-data-definition_verify/)</div>

</div>


## 정의

데이터 정의문은 변수 하나가 쓸 메모리를 잡는다. 이름은 붙여도 되고 안 붙여도 된다[^1].

```
[이름] 지시어 초깃값 [,초깃값] ...
```

지시어가 칸 하나의 크기를 정한다. 어셈블러에 들어 있는 자료형은 다음과 같다[^3].

| 지시어 | 칸 하나의 크기 | 담는 값 |
|---|---|---|
| `BYTE` / `SBYTE` | 1바이트(8비트) | 부호 없는 정수 0~255 / 부호 있는 정수 −128~127 |
| `WORD` / `SWORD` | 2바이트(16비트) | 부호 없는 정수 0~65,535 / 부호 있는 정수 −32,768~32,767 |
| `DWORD` / `SDWORD` | 4바이트(32비트) | 부호 없는 정수 / 부호 있는 정수(−2,147,483,648부터) |
| `QWORD` | 8바이트(64비트) | 정수 |
| `TBYTE` | 10바이트(80비트) | 정수 |
| `REAL4` / `REAL8` / `REAL10` | 4 / 8 / 10바이트 | IEEE 실수(짧은, 긴, 확장) |

앞에 S가 붙은 것은 부호 있는(signed) 수라는 뜻이다. 칸의 크기는 같다.

초깃값 자리에는 네 가지가 올 수 있다.

- **값 하나.** `value3 BYTE 255`. 글자 상수 `'A'`도 값 하나다[^4].
- **물음표.** `value6 BYTE ?`. 칸만 잡고 값은 정하지 않는다[^4].
- **쉼표로 이은 여러 값.** `list1 BYTE 10,20,30,40`. 4바이트를 잡는다. 이름은 첫 값의 자리만 가리킨다. 다음 줄에 이름 없이 `BYTE 50,60,70,80`을 쓰면 바로 뒤에 이어서 놓인다[^2].
- **되풀이.** `개수 DUP (값)`. 같은 값을 개수만큼 놓는다. 개수와 값은 상수여야 한다[^5].

## 예제

**문자열.** 문자열은 글자(바이트)의 배열이다. 따옴표로 묶어 쓰면 글자마다 한 바이트가 된다. 끝에 0을 붙여 "여기서 끝"을 표시하는 일이 많다(널 종료)[^6].

```asm
str1 BYTE "Enter your name",0        ; 글자 15개 + 0 = 16바이트
str3 BYTE 'A','E','I','O','U'        ; 5바이트, 끝 표시 없음
greeting BYTE "Welcome to the Encryption Demo program "
         BYTE "created by Kip Irvine.",0
```

긴 문자열 하나를 여러 줄에 쓰려면 줄 끝마다 쉼표를 둔다[^7]. 줄을 바꾸는 글자는 두 바이트 `0Dh`(맨 앞으로, carriage return), `0Ah`(다음 줄로, line feed)를 이어 쓴다[^8].

```asm
str1 BYTE "Enter your name:    ",0Dh,0Ah
     BYTE "Enter your address: ",0
newLine BYTE 0Dh,0Ah,0
```

**DUP.**[^5]

```asm
var1 BYTE 20 DUP(0)          ; 20바이트, 모두 0
var2 BYTE 20 DUP(?)          ; 20바이트, 값은 정하지 않음
var3 BYTE 4 DUP("STACK")     ; 20바이트: "STACKSTACKSTACKSTACK"
var4 BYTE 10,3 DUP(0),20     ; 5바이트: 0A 00 00 00 14
```

**더 큰 칸.**[^9]

```asm
word1  WORD  65535           ; 부호 없는 가장 큰 값
word2  SWORD -32768          ; 부호 있는 가장 작은 값
myList WORD  1,2,3,4,5       ; 워드 5개 = 10바이트
array  WORD  5 DUP(?)        ; 값을 정하지 않은 워드 5개
val1   DWORD 12345678h
val3   DWORD 20 DUP(?)       ; 더블워드 20개 = 80바이트
val4   SDWORD -3,-2,-1,0,1
```

2바이트 이상인 칸은 바이트가 놓이는 순서가 따로 정해져 있다: [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/).

**변수를 쓰는 프로그램.** 변수는 `.data` 아래에 정의하고 `.code`의 명령에서 이름으로 쓴다[^10].

```asm
.data
val1     DWORD 10000h
val2     DWORD 40000h
val3     DWORD 20000h
finalVal DWORD ?
.code
main PROC
    mov eax,val1         ; 10000h로 시작
    add eax,val2         ; 40000h를 더한다
    sub eax,val3         ; 20000h를 뺀다
    mov finalVal,eax     ; 결과 30000h를 저장
```

## 활용

- 프로그램이 쓰는 문자열은 데이터 세그먼트의 한곳에 모아 정의한다[^8].
- `SBYTE`로 정의한 변수는 Microsoft 디버거가 부호 붙은 10진수로 보여 준다[^4]. 메모리에 들어간 바이트는 `BYTE`로 정의했을 때와 같다. −1과 255는 둘 다 FFh다[^s1].
- 흔한 실수: 문자열 끝의 0을 빼먹는다. 문자열을 찍는 코드는 0을 만날 때까지 읽으므로, 0이 없으면 바로 뒤에 놓인 다른 변수까지 읽는다[^s1].
- 흔한 실수: `var4 BYTE 10,3 DUP(0),20`을 "0이 3개"가 아니라 "3이 들어간다"로 읽는다. `DUP` 앞의 수는 개수, 괄호 안이 값이다.

## 연결

- 선수: [어셈블리 문장의 구성](/Hongs_Blog/studies/assembly-language/asm-statement-elements/)(이름, 지시어, 상수 쓰는 법), [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/)(`.data`와 `.code`)
- 배열의 크기를 어셈블러에게 세게 하기: [기호 상수와 위치 카운터](/Hongs_Blog/studies/assembly-language/symbolic-constants/), [TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/)
- 글자가 바이트가 되는 규칙과 0으로 끝나는 문자열: [부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)
- −128이 80h가 되는 이유: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- 컴파일러는 변수를 놓을 때 칸 사이에 빈 바이트를 끼워 주소를 맞춘다. 여기서는 적은 순서대로 빈틈없이 놓인다: [데이터 정렬과 패딩](/Hongs_Blog/studies/compilers/data-alignment/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `buf BYTE 3,2 DUP(0FFh),"OK",0`은 몇 바이트를 잡는가? 메모리에 놓이는 바이트를 순서대로 16진수로 쓰라.</summary>

**답:** 6바이트. `03 FF FF 4F 4B 00`.<br>
**이유:** 값 3이 1바이트, `2 DUP(0FFh)`가 FFh 두 바이트, `"OK"`가 글자 둘(O = 4Fh, K = 4Bh), 끝의 0이 1바이트다. `2 DUP`의 2를 값으로 읽으면 `03 02 FF …`라는 오답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `a SBYTE -1`과 `b BYTE 255`는 메모리에 서로 다른 바이트를 남기는가? 그렇다면, 또는 아니라면 `SBYTE`와 `BYTE`를 나눠 쓰는 까닭은 무엇인가?</summary>

**답:** 같은 바이트 FFh를 남긴다. 지시어의 부호 표시는 메모리에 적히지 않는다. 나눠 쓰는 까닭은 읽는 사람과 도구에게 뜻을 알려 주기 위해서다. 디버거는 `SBYTE` 변수를 부호 붙은 10진수(−1)로 보여 준다.<br>
**이유:** 칸에는 비트만 들어간다. FFh를 255로 볼지 −1로 볼지는 그 값을 쓰는 명령과 프로그래머가 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 세 정의가 잡는 메모리는 모두 몇 바이트인가? `w WORD 3 DUP(0)` / `dd DWORD 1,2` / `s BYTE "Hi",0Dh,0Ah,0`</summary>

**답:** 19바이트. 워드 3개 6바이트, 더블워드 2개 8바이트, 글자 2개와 줄바꿈 2바이트와 끝의 0으로 5바이트.<br>
**이유:** 바이트 수 = 값의 개수 × 칸 하나의 크기다. 문자열은 글자 수만큼 값이 있는 것으로 센다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-2」, p.9 (Data Definition Statement: 문법, `value1 BYTE 10`, 모든 초깃값은 2진 데이터가 된다)
[^2]: 같은 자료, p.11 (Defining Byte Arrays: list1~list4)
[^3]: 같은 자료, p.7~8 (Intrinsic Data Types)
[^4]: 같은 자료, p.10 (Defining BYTE and SBYTE Data, 디버거의 SBYTE 표시)
[^5]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-3」, p.1 (Using the DUP Operator)
[^6]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-2」, p.12 (Defining Strings 1: 글자의 배열, 널 종료)
[^7]: 같은 자료, p.13 (Defining Strings 2: 줄 끝의 쉼표, menu)
[^8]: 같은 자료, p.14 (Defining Strings 3: 0Dh와 0Ah, 문자열을 한곳에 정의)
[^9]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-3」, p.2~3 (Defining WORD and SWORD Data, Defining DWORD and SDWORD Data)
[^10]: 같은 자료, p.5 (Adding Variables to AddSub: AddSub2.asm)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 메모리 배치 그림, 표의 값 범위 가운데 슬라이드에 없는 칸, `SBYTE -1`과 `BYTE 255`가 같은 바이트라는 설명, 흔한 실수 두 항목, 카드 C1~C3은 원본에 없다. 5주차 슬라이드(05.wk05-chapt_04-3-1.pdf, p.8)가 `valB BYTE -1`을 쓰는 것이 같은 사실의 근거다. 바이트 배치는 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
