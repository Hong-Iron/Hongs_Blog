---
layout: "note"
title: "비트 논리 명령"
display_title: "비트 논리 명령 (AND, OR, XOR, NOT)"
kind: "concept"
kind_label: "기법"
num: "29"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["AND 명령", "OR 명령", "XOR 명령", "NOT 명령", "Boolean Instructions", "비트 마스크", "Bit Mask", "비트 끄기", "비트 켜기", "비트 뒤집기", "XOR 암호", "대문자 변환"]
description: "레지스터에 든 값은 스위치 여덟 개나 서른두 개가 한 줄로 늘어선 것이다. 이 명령들은 값을 수로 보지 않고 스위치 줄로 보아, 골라 낸 스위치만 끄거나 켜거나 뒤집고 나머지는 그대로 둔다. 어느 스위치를 건드릴지는 같은 길이의 다른 스위치 줄로 알려 준다. 덧셈·뺄셈 없이 글자의…"
prev_url: "/studies/assembly-language/irvine32-library/"
prev_title: "Irvine32 라이브러리"
next_url: "/studies/assembly-language/test-cmp/"
next_title: "TEST와 CMP"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/bitwise-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

레지스터에 든 값은 스위치 여덟 개나 서른두 개가 한 줄로 늘어선 것이다. 이 명령들은 값을 수로 보지 않고 스위치 줄로 보아, 골라 낸 스위치만 끄거나 켜거나 뒤집고 나머지는 그대로 둔다. 어느 스위치를 건드릴지는 같은 길이의 다른 스위치 줄로 알려 준다. 덧셈·뺄셈 없이 글자의 대소문자를 바꾸고, 짝수인지 가리고, 글을 암호로 바꿨다 되돌린다. 대신 원래 값이 바뀌므로, 값은 두고 확인만 하려면 다른 명령을 써야 한다.

</div>


## 예시로 보기

소문자 `'a'`를 대문자 `'A'`로 바꾸려 한다. ASCII 코드로 `'a'`는 61h, `'A'`는 41h다. 32를 빼면 된다. 그런데 이미 대문자인 글자에서 32를 빼면 엉뚱한 글자가 된다. 먼저 소문자인지 따져야 한다.

두 코드를 2진수로 적어 보면 길이 하나 더 보인다[^1].

```
 'a' = 0 1 1 0 0 0 0 1
 'A' = 0 1 0 0 0 0 0 1
           ↑ 5번 비트만 다르다
```

맨 오른쪽을 0번으로 세어 5번 비트가 1이면 소문자, 0이면 대문자다. 이 비트 하나만 끄면 된다. 이미 꺼져 있으면 아무 일도 없으니 따질 필요도 없다.

```asm
    mov al,'a'           ; AL = 01100001b
    and al,11011111b     ; AL = 01000001b = 'A'
```

`11011111b`처럼 "어느 비트를 건드릴지"를 알려 주는 값을 마스크라 부른다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 네 연산 그림 값, 소문자 26자 전부의 대문자 변환, 숫자 0~9의 글자 변환, 짝수·0·음수 판별(전수 또는 표본), 0·1·3번 비트 검사 256가지 전수, XOR 암호의 암호화와 복호화, 연산 뒤 CF·OF가 0인 것(8비트 전수), 카드 C1~C3 — [29_bitwise-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/29_bitwise-instructions_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 네 명령

두 피연산자의 같은 자리 비트끼리 짝지어 계산하고, 결과를 목적지에 넣는다. `NOT`만 피연산자가 하나다. 쓸 수 있는 피연산자 조합은 `MOV`와 같다[^2]. 슬라이드의 그림은 모두 `00111011`에 `00001111`을 건다[^2].

| 명령 | 결과 비트가 1인 때 | `00111011`과 `00001111` | 쓰임새 |
|---|---|---|---|
| `AND 목적지, 원본` | 두 비트가 모두 1 | `00001011` | 마스크가 0인 자리를 끈다. 1인 자리는 그대로 |
| `OR 목적지, 원본` | 둘 중 하나라도 1 | `00111111` | 마스크가 1인 자리를 켠다. 0인 자리는 그대로 |
| `XOR 목적지, 원본` | 두 비트가 서로 다름 | `00110100` | 마스크가 1인 자리를 뒤집는다. 0인 자리는 그대로 |
| `NOT 목적지` | 원래 비트가 0 | `11000100` (`00111011`을 뒤집음) | 모든 자리를 뒤집는다 |

```
   0 0 1 1 1 0 1 1          0 0 1 1 1 0 1 1          0 0 1 1 1 0 1 1
 AND 0 0 0 0 1 1 1 1      OR 0 0 0 0 1 1 1 1      XOR 0 0 0 0 1 1 1 1
   ---------------          ---------------          ---------------
   0 0 0 0|1 0 1 1          0 0 1 1|1 1 1 1          0 0 1 1|0 1 0 0
   꺼짐    그대로            그대로   켜짐             그대로   뒤집힘
```

비트 하나의 AND·OR·XOR·NOT 규칙은 [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)의 진리표와 같다.

**플래그.** `AND`, `OR`, `XOR`은 올림 플래그와 넘침 플래그를 늘 0으로 만들고, 결과가 0이면 ZF를, 결과의 맨 위 비트가 1이면 SF를 켠다. `NOT`은 플래그를 하나도 바꾸지 않는다[^s1]. 그래서 이 명령들 바로 뒤에 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)를 붙여 "결과가 0인가"로 갈라 쓸 수 있다. 아래 예제의 `jz`, `jnz`가 그렇게 쓴 것이다.

## 예제

**대문자로 바꾸기.** `AND`로 5번 비트를 끈다. 위에서 본 코드다[^1].

**숫자를 숫자 글자로.** 0~9의 수를 화면에 찍을 글자 `'0'`~`'9'`로 바꾼다. 글자 `'6'`의 코드는 `00110110b`, 수 6은 `00000110b`다. `OR`로 4번, 5번 비트를 켠다[^3].

```asm
    mov al,6             ; AL = 00000110b
    or  al,00110000b     ; AL = 00110110b = '6'
```

**CapsLock 켜기.** BIOS가 키보드 상태를 적어 두는 바이트가 주소 0040:0017h에 있다. 이 바이트의 6번 비트가 CapsLock이다. `OR`로 그 비트만 켠다[^4].

```asm
    mov ax,40h                   ; BIOS 자료 구역의 세그먼트
    mov ds,ax
    mov bx,17h                   ; 키보드 상태 바이트
    or  BYTE PTR [bx],01000000b  ; CapsLock 켜기
```

이 코드는 실주소 모드에서만 돈다. Windows NT, 2000, XP에서는 안 된다[^4]. 주소 표기는 [실주소 모드의 세그먼트 주소](/Hongs_Blog/studies/assembly-language/real-mode-segment-address/)에, 이 바이트의 다른 비트는 [BIOS 키보드 입력 INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/)에 있다. (슬라이드 근거. 실행 확인 안 함)

**짝수면 점프.** 2진수의 맨 아래 비트는 1의 자리다. 이것이 0이면 짝수다. 맨 아래 비트만 남기고 다 끈 뒤 결과가 0인지 본다[^5].

```asm
    mov ax,wordVal
    and ax,1             ; 맨 아래 비트만 남긴다
    jz  EvenValue        ; 결과가 0이면(ZF = 1) 짝수
```

**Your turn: 음수면 점프.** 슬라이드는 답을 주지 않는다[^5]. 음수는 맨 위 비트가 1이다. 두 가지로 쓸 수 있다[^s2].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    or  ax,ax            ; AX는 그대로, 플래그만 다시 매긴다
    js  IsNegative       ; SF = 1이면 음수
```
```asm
    test ax,8000h        ; 맨 위 비트만 본다 (AX는 그대로)
    jnz IsNegative       ; 결과가 0이 아니면 음수
```
`and ax,8000h` 뒤에 `jnz`를 써도 가를 수는 있다. 다만 AX가 망가진다.

</details>


**0이 아니면 점프.** 어떤 값을 자기 자신과 `OR` 하면 값은 그대로이고 플래그만 그 값에 맞게 매겨진다[^6].

```asm
    or  al,al
    jnz IsNotZero        ; AL이 0이 아니면 점프
```

**여러 비트가 모두 켜졌는지.** AL의 0번, 1번, 3번 비트가 **모두** 1이면 `L1`로 간다. 세 비트만 남기고 끈 뒤, 남은 것이 마스크와 똑같은지 견준다[^7].

```asm
    and al,00001011b     ; 0·1·3번 비트만 남긴다
    cmp al,00001011b     ; 셋 다 켜져 있나
    je  L1
```

`and` 뒤에 바로 `jnz`를 쓰면 "셋 중 하나라도 켜졌으면"이 된다. "모두"를 물으려면 `cmp`가 있어야 한다. `CMP`는 [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)에 있다.

**XOR 암호.** 같은 값으로 `XOR`을 두 번 하면 원래대로 돌아온다. 뒤집은 것을 다시 뒤집기 때문이다. 문자열의 글자마다 같은 열쇠 값으로 `XOR` 하면 암호가 되고, 한 번 더 하면 풀린다[^8].

```asm
KEY = 239                    ; 아무 바이트 값이나 된다
BUFMAX = 128
.data
buffer  BYTE BUFMAX+1 DUP(0)
bufSize DWORD BUFMAX
.code
    mov ecx,bufSize          ; 횟수
    mov esi,0                ; 인덱스
L1:
    xor buffer[esi],KEY      ; 한 바이트를 바꾼다
    inc esi
    loop L1
```

슬라이드의 프로그램은 글을 받아 암호로 바꿔 찍고, 다시 풀어 찍는다. "Attack at dawn."을 넣으면 알아볼 수 없는 글자들이 나왔다가 "Attack at dawn."으로 돌아온다[^9]. 첫 글자 `'A'`(41h)는 $$\text{41h} \oplus \text{EFh} = \text{AEh}$$가 된다($$\oplus$$는 XOR이다).

## 활용

- 이 기법을 떠올릴 신호: "몇 번 비트", "켜져 있으면", "나머지는 그대로"라는 말이 나온다. 값의 일부만 바꾸거나 본다.
- 어떤 일을 할지에 따라 명령이 정해진다. 끄기는 `AND`(끌 자리가 0인 마스크), 켜기는 `OR`(켤 자리가 1), 뒤집기는 `XOR`(뒤집을 자리가 1), 값은 두고 확인만 하기는 `TEST`다.
- Java의 `&`, <code>&#124;</code>, `^`, `~`가 이 네 명령이다([비트 연산](/Hongs_Blog/studies/java/java-bitwise/)).
- 흔한 실수: 확인만 하려던 것인데 `AND`를 써서 값을 망가뜨린다.
- 흔한 실수: "모두 켜졌나"를 `and` 뒤 `jnz`로 묻는다. 이것은 "하나라도 켜졌나"다.
- 흔한 실수: 끄려는 자리를 1로 둔 마스크를 `AND`에 쓴다. `AND`는 마스크가 0인 자리를 끈다.

## 연결

- 선수: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/), [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)
- 값을 바꾸지 않고 플래그만 얻는 짝: [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)
- 플래그를 보고 갈라 가기: [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)
- 비트 줄 전체를 옆으로 미는 명령: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/)
- 글자의 코드 값: [부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** AL = `10101100b`일 때 `and al,11110000b`, `or al,00000011b`, `xor al,11111111b`를 각각 따로 실행한 결과를 2진수로 쓰라.</summary>

**답:** `10100000b`, `10101111b`, `01010011b`.<br>
**이유:** `AND`는 아래 네 비트를 끄고, `OR`은 아래 두 비트를 켜고, `XOR`은 여덟 비트를 모두 뒤집는다. 마지막 것은 `not al`과 같은 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** AL에 영문자 하나가 들어 있다. 대문자면 소문자로, 소문자면 대문자로 바꾸는 명령 한 줄을 쓰라. AL = `'Q'`이면 무엇이 되는가?</summary>

**답:** `xor al,00100000b`. `'Q'`(51h)는 `'q'`(71h)가 된다.<br>
**이유:** 대소문자는 5번 비트만 다르다. 그 비트를 뒤집으면 서로 바뀐다. `AND`는 끄기만, `OR`은 켜기만 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "AL의 0번, 1번 비트 중 하나라도 켜져 있으면 점프"와 "둘 다 켜져 있으면 점프"를 각각 쓰라. AL은 망가져도 된다.</summary>

**답:** 하나라도: `and al,00000011b` / `jnz L1`. 둘 다: `and al,00000011b` / `cmp al,00000011b` / `je L1`.<br>
**이유:** `and` 뒤의 ZF는 "남은 비트가 하나도 없는가"만 알려 준다. 0이 아니라는 것은 하나 이상 켜졌다는 뜻이다. 둘 다인지는 남은 값을 마스크와 견줘야 안다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** XOR 암호에서 암호로 바꾸는 코드와 푸는 코드가 왜 똑같은가?</summary>

**답:** 어떤 비트든 같은 값과 XOR을 두 번 하면 제자리로 온다. 열쇠 비트가 0이면 두 번 다 그대로이고, 1이면 뒤집혔다가 다시 뒤집힌다. 식으로는 $$(x \oplus k) \oplus k = x$$다.

</details>


[^1]: 어셈블리어 7회 강의 자료 「wk07-chapt_06-3-2」, p.9 (대문자로 바꾸기: AND로 5번 비트 끄기)
[^2]: 같은 자료, p.5~8 (AND, OR, XOR, NOT의 문법과 그림: 00111011과 00001111)
[^3]: 같은 자료, p.10 (숫자를 ASCII 숫자 글자로)
[^4]: 같은 자료, p.11 (CapsLock 켜기, 실주소 모드에서만 돈다)
[^5]: 같은 자료, p.12 (짝수면 점프, Your turn: 음수면 점프)
[^6]: 같은 자료, p.13 (0이 아니면 점프: or al,al)
[^7]: 어셈블리어 7회 강의 자료 「wk07-chapt_06-3-3」, p.12 (0·1·3번 비트가 모두 켜졌는지)
[^8]: 같은 자료, p.13 (XOR로 문자열 바꾸기)
[^9]: 같은 자료, p.14 (문자열 암호화 프로그램과 출력 예)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 마스크라는 이름, 네 연산을 한 표로 모은 것과 ASCII 그림(원본 p.5~7의 그림을 옮김), 네 명령이 플래그에 하는 일, `'A'`가 AEh가 되는 계산, 활용 항목, 카드 C1~C4는 원본에 없다. 플래그 동작은 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 AND, OR, XOR, NOT 항목을 따랐고 8비트 전수 검사로 흉내기와 맞췄다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본 p.12의 Your turn에는 답이 없다. 두 답 모두 16비트 값을 7 간격으로 훑어 부호와 맞는지 확인했다. `JS`와 `TEST`는 같은 주차 슬라이드(wk07-3-3 p.3, wk07-3-2 p.14)에 나온다.
{% endraw %}
