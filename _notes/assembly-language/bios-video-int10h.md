---
layout: "note"
title: "BIOS 비디오 INT 10h와 속성 바이트"
display_title: "BIOS 비디오 INT 10h와 속성 바이트 (VIDEO Programming with INT 10h)"
kind: "concept"
kind_label: "정의"
num: "54"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["INT 10h", "VIDEO Programming with INT 10h", "속성 바이트", "Attribute Byte", "비디오 접근 수준", "Three Levels of Video Access", "Clrscr", "비디오 메모리 직접 쓰기", "Memory-Mapped Video"]
description: "글자 화면의 한 칸에는 글자만 있는 것이 아니라 \"무슨 색 바탕에 무슨 색 글씨\"라는 꼬리표가 붙어 있다. 꼬리표는 스위치 여덟 개짜리 판인데, 절반은 바탕색, 절반은 글자색을 정하고, 스위치 하나하나가 빨강·초록·파랑 빛과 밝기를 켜고 끈다. 그래서 색을 섞는 일이 비트를 켜는 …"
prev_url: "/studies/assembly-language/bios-keyboard-int16h/"
prev_title: "BIOS 키보드 입력 INT 16h"
next_url: "/studies/assembly-language/hardware-interrupt-irq/"
next_title: "하드웨어 인터럽트와 IRQ"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/bios-video-int10h/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

글자 화면의 한 칸에는 글자만 있는 것이 아니라 "무슨 색 바탕에 무슨 색 글씨"라는 꼬리표가 붙어 있다. 꼬리표는 스위치 여덟 개짜리 판인데, 절반은 바탕색, 절반은 글자색을 정하고, 스위치 하나하나가 빨강·초록·파랑 빛과 밝기를 켜고 끈다. 그래서 색을 섞는 일이 비트를 켜는 일이 된다. 화면에 그리는 길은 세 가지인데, 빠른 길일수록 돌아가는 컴퓨터가 줄어든다.

</div>


## 예시로 보기

[INT 21h](/Hongs_Blog/studies/assembly-language/int21h-io-functions/)로는 글자를 찍을 수 있지만 색을 정할 수 없다. 파란 바탕에 밝은 회색 글자를 찍고 싶다면 칸마다 붙는 색 꼬리표를 직접 만들어야 한다.

색은 빨강(R), 초록(G), 파랑(B) 세 빛과 밝기(I) 한 비트, 모두 4비트로 정한다[^1]. 비트 자리는 위에서부터 I, R, G, B다[^s1].

| 켠 것 | 4비트 | 색 |
|---|---|---|
| 빨강 + 초록 + 파랑 | 0111 | 밝은 회색 |
| 밝기 + 빨강 + 초록 + 파랑 | 1111 | 흰색 |
| 초록 + 파랑 | 0011 | 청록 |
| 빨강 + 파랑 | 0101 | 자홍 |

파랑만 켜면 0001이다. 바탕색 4비트를 위쪽에, 글자색 4비트를 아래쪽에 놓으면 한 바이트가 된다.

```
 비트  7  6  5  4    3  2  1  0
     +--+--+--+--+ +--+--+--+--+
     | 0  0  0  1 | | 0  1  1  1 |   = 17h
     +--+--+--+--+ +--+--+--+--+
       바탕: 파랑     글자: 밝은 회색
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 가지 색의 4비트, (blue SHL 4) OR lightGray = 17h, (red SHL 4) OR white = 4Fh, yellow + blue × 16 = 1Eh, 모든 바탕·글자 조합 256가지에서 SHL·OR와 곱하기·더하기가 같은지, `or bl,10000000b`가 맨 윗비트만 켜는지(8비트 전수), 184Fh = (24, 79), 카드 C2·C3 — [54_bios-video-int10h_verify.py](/Hongs_Blog/studies/assembly-language/code/54_bios-video-int10h_verify/). 비트 계산만 확인했다. 화면에 실제로 찍지는 않았고, 함수의 동작은 슬라이드 근거다.</div>

</div>


## 속성 바이트

속성 바이트는 화면 한 칸의 색을 정하는 1바이트다. 위쪽 4비트가 바탕색, 아래쪽 4비트가 글자색이다[^1].

**기호로 쓰면.** 바탕색을 $$b$$, 글자색을 $$f$$(둘 다 0~15)라 하면 속성 바이트는 바탕색을 왼쪽으로 4칸 밀어 글자색과 합친 값이다[^2].

$$\text{속성} = (b \text{ SHL } 4) \text{ OR } f = 16b + f$$


- 파란 바탕에 밝은 회색 글자: (blue SHL 4) OR lightGray = 10h OR 07h = 17h
- 빨간 바탕에 흰 글자: (red SHL 4) OR white = 40h OR 0Fh = 4Fh

왼쪽으로 4칸 미는 것은 16을 곱하는 것과 같다: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/). 밀고 나면 아래 4비트가 비어서 글자색과 겹치는 비트가 없다. 그래서 OR 대신 더해도 값이 같다. 7주차의 `mov eax,yellow + (blue * 16)`이 같은 계산이다[^3]: [Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/).

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "Mix primary colors: red, green, blue — called subtractive mixing"<br>
문제점: 빨강·초록·파랑 빛을 켤수록 밝아진다. 같은 슬라이드에서도 셋을 다 켜면 밝은 회색, 밝기까지 켜면 흰색이다. 섞을수록 밝아지는 것은 더하는 혼합(additive mixing)이다. 빼는 혼합(subtractive mixing)은 물감이나 잉크처럼 섞을수록 어두워지는 쪽이다.<br>
수정안: "called additive mixing". [확인필요]<br>
근거: 슬라이드의 예 0111 = 밝은 회색, 1111 = 흰색. 비트를 더 켤수록 밝아진다.

</div>


## 화면에 쓰는 세 가지 길

| 길 | 빠르기 | 도는 곳 |
|---|---|---|
| MS-DOS 함수 호출 | 느리다 | MS-DOS가 도는 어느 컴퓨터든 |
| BIOS 함수 호출 | 중간 | MS-DOS 계열 컴퓨터 거의 전부 |
| 비디오 메모리에 직접 쓰기 | 빠르다 | IBM과 100% 호환되는 컴퓨터만 |

아래로 갈수록 중간에서 일을 대신해 주는 층이 줄어든다[^4]. 비디오 메모리는 [MS-DOS 메모리 배치](/Hongs_Blog/studies/assembly-language/msdos-memory-map/)의 A0000h~BFFFFh다.

## INT 10h 함수

AH에 함수 번호를 넣고 `int 10h`를 부른다[^5]. 아래 표는 슬라이드의 목록이고 실행해서 확인하지는 않았다.

| AH | 하는 일 |
|---|---|
| 00h | 비디오 모드를 정한다(글자 모드, 그래픽 모드) |
| 01h | 커서의 줄 모양을 정한다 |
| 02h | 커서 위치를 정한다 |
| 03h | 커서 위치와 크기를 읽는다 |
| 06h | 창을 위로 민다 |
| 07h | 창을 아래로 민다 |
| 08h | 커서 자리의 글자와 속성을 읽는다 |
| 09h | 글자와 속성을 쓴다 |
| 0Ah | 글자만 쓴다 |
| 0Fh | 지금 비디오 모드를 읽는다 |
| 10h (AL = 03h) | 맨 윗비트의 뜻을 깜빡임과 밝기 사이에서 바꾼다 |

## 예제

**색 글자 하나 쓰기.** 함수 09h는 AL의 글자를 BL의 속성으로 CX번 쓴다[^6].

```asm
mov si,OFFSET string
...
mov ah,9            ; 글자와 속성 쓰기
mov al,[si]         ; 쓸 글자
mov bh,0            ; 비디오 페이지 0
mov bl,color        ; 속성
or  bl,10000000b    ; 맨 윗비트를 켠다 (깜빡임 또는 밝기)
mov cx,1            ; 한 번
int 10h
```

`or bl,10000000b`는 속성의 나머지 7비트를 그대로 두고 비트 7만 켠다. 17h라면 97h가 된다.

**화면 지우기.** `Clrscr`는 화면 전체를 위로 밀어 비우고 커서를 왼쪽 위로 보낸다[^7].

```asm
Clrscr PROC
    pusha
    mov ax,0600h    ; 창을 위로 민다
    mov cx,0        ; 왼쪽 위 (0,0)
    mov dx,184Fh    ; 오른쪽 아래 (24,79)
    mov bh,7        ; 보통 속성
    int 10h
    mov ah,2        ; 커서 위치 정하기
    mov bh,0        ; 비디오 페이지 0
    mov dx,0        ; 0줄 0칸
    int 10h
    popa
    ret
Clrscr ENDP
```

레지스터 하나에 값 두 개를 넣는 곳이 세 군데다.

| 명령 | 위쪽 절반 | 아래쪽 절반 |
|---|---|---|
| `mov ax,0600h` | AH = 06h (함수 번호) | AL = 0 |
| `mov cx,0` | CH = 0 (줄) | CL = 0 (칸) |
| `mov dx,184Fh` | DH = 18h = 24 (줄) | DL = 4Fh = 79 (칸) |

화면이 25줄 80칸이라 마지막 줄이 24, 마지막 칸이 79다. 속성 7은 0000 0111b, 검은 바탕에 밝은 회색 글자다[^s1].

## 활용

- 색 상수를 이름으로 두고 `(바탕 SHL 4) OR 글자`로 쓰면 숫자를 외울 필요가 없다.
- 흔한 실수: 바탕색을 밀지 않고 그냥 OR하는 것. blue OR lightGray = 01h OR 07h = 07h라 바탕이 사라진다[^s1].
- 16비트 프로그램에서만 쓸 수 있다. 32비트 콘솔 프로그램에서는 `SetTextColor`, `Clrscr` 같은 라이브러리 프로시저를 부른다: [Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/).

## 연결

- 세 가지 길의 일반 그림: [입출력 접근 수준](/Hongs_Blog/studies/assembly-language/io-access-levels/)
- 비트를 켜는 OR: [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/)
- 부르는 틀: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 속성 바이트의 여덟 비트는 어떻게 나뉘는가? 색 4비트의 각 자리는 무엇인가?</summary>

**답:** 위쪽 4비트가 바탕색, 아래쪽 4비트가 글자색이다. 색 4비트는 위에서부터 밝기, 빨강, 초록, 파랑이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 파란 바탕에 노란 글자의 속성 바이트는? (노랑 = 밝기 + 빨강 + 초록) 여기에 `or bl,10000000b`를 하면?</summary>

**답:** 1Eh, 그다음 9Eh.<br>
**이유:** 노랑은 1110b = 14, 파랑은 0001b. $$(1 \text{ SHL } 4) \text{ OR } 14 = 10\text{h} + 0\text{Eh} = 1\text{Eh}$$. 비트 7을 켜면 80h가 더해져 9Eh다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 속성 바이트 4Eh는 무슨 바탕에 무슨 글자인가?</summary>

**답:** 빨간 바탕에 노란 글자.<br>
**이유:** 위쪽 4비트 0100은 빨강만 켠 것이다. 아래쪽 4비트 1110은 밝기·빨강·초록을 켠 노랑이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `(blue SHL 4) OR lightGray`에서 OR를 더하기로 바꿔도 값이 같은 이유는? 바탕을 밀지 않고 `blue OR lightGray`로 쓰면 어떻게 되는가?</summary>

**답:** 4칸 밀면 아래 4비트가 모두 0이 되어 글자색과 겹치는 비트가 없다. 겹치는 비트가 없으면 올림이 생기지 않아 더하기와 OR가 같다. 밀지 않으면 01h OR 07h = 07h가 되어 바탕색이 글자색에 묻힌다.

</details>


[^1]: 어셈블리어 14회 강의 자료 「wk14-chapt_16-2-1」, p.28 (Controlling the Color: 색 예 네 개, 4 MSB bits = background, 4 LSB bits = foreground)
[^2]: 같은 자료, p.29 (Constructing Attribute Bytes)
[^3]: 어셈블리어 7회 강의 자료 「wk07-chapt_05-3-1」, p.14 (Example 6: yellow + (blue * 16), 바탕색에 16을 곱해 글자색에 더한다)
[^4]: 어셈블리어 14회 강의 자료 「wk14-chapt_16-2-1」, p.27 (Three Levels of Video Access)
[^5]: 같은 자료, p.30~31 (INT 10h Video Functions)
[^6]: 같은 자료, p.32 (Displaying a Color String)
[^7]: 같은 자료, p.33 (Clrscr Procedure)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 색 비트의 자리 순서(I, R, G, B)는 슬라이드의 예 0011 = 초록 + 파랑, 0101 = 빨강 + 파랑에서 읽어 냈다. 17h·4Fh·97h 같은 계산 값, $$16b + f$$ 식, 레지스터 절반 표, 25줄 80칸, 속성 7의 풀이, 밀지 않았을 때의 실수, 카드 C2~C4는 슬라이드에 없다. 계산은 검증 코드로 확인했다. 코드 블록의 한국어 주석은 슬라이드의 영어 주석을 옮긴 것이다.
{% endraw %}
