---
layout: "note"
title: "INT 21h 파일·디스크 함수"
display_title: "INT 21h 파일·디스크 함수 (MS-DOS File and Disk Functions)"
kind: "concept"
kind_label: "정의"
num: "52"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["MS-DOS File I/O Services", "함수 716Ch", "함수 7305h", "파일 핸들", "File Handle", "DISKIO", "절대 디스크 읽기", "Absolute Disk Read", "Create Subdirectory", "Remove Subdirectory"]
description: "파일을 다룰 때도 MS-DOS의 같은 창구에 번호를 대고 부탁한다. 파일을 열면 도서관의 대출 번호표 같은 번호를 하나 받고, 그 뒤로 읽기·쓰기·닫기는 파일 이름 대신 그 번호로 한다. 일이 잘못되면 깃발 하나가 서므로, 부른 직후에 그 깃발부터 봐야 한다. 디스크의 조각을 파일…"
prev_url: "/studies/assembly-language/int21h-io-functions/"
prev_title: "INT 21h 입출력 함수"
next_url: "/studies/assembly-language/bios-keyboard-int16h/"
next_title: "BIOS 키보드 입력 INT 16h"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/int21h-file-disk-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

파일을 다룰 때도 MS-DOS의 같은 창구에 번호를 대고 부탁한다. 파일을 열면 도서관의 대출 번호표 같은 번호를 하나 받고, 그 뒤로 읽기·쓰기·닫기는 파일 이름 대신 그 번호로 한다. 일이 잘못되면 깃발 하나가 서므로, 부른 직후에 그 깃발부터 봐야 한다. 디스크의 조각을 파일 이름 없이 번호로 바로 읽는 길도 있지만, 옛 MS-DOS 방식에서만 열려 있고 요즘 Windows에서는 막혀 있다.

</div>


## 예시로 보기

파일에 글을 쓰려면 먼저 "이 이름의 파일을 쓰겠다"고 MS-DOS에 알려야 한다. 그래야 MS-DOS가 디렉터리에서 그 파일을 찾거나 새로 만들고, 어느 클러스터에 쓸지 정한다. 새 파일을 만드는 코드다.

```asm
mov ax,716Ch            ; 파일 만들기 또는 열기
mov bx,2                ; 읽기와 쓰기
mov cx,0                ; 보통 파일
mov dx,10h + 02h        ; 없으면 만들고, 있으면 비운다
mov si,OFFSET Filename
int 21h
jc  failed              ; 올림 플래그가 서 있으면 실패
mov handle,ax           ; 파일 핸들
mov actionTaken,cx      ; 실제로 한 동작
```

[INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/)의 틀과 같다. 달라진 점은 둘이다.

- 함수 번호가 AH에 다 들어가지 않아 AX 전체(716Ch)를 쓴다.
- 성공하면 AX에 번호 하나가 돌아온다. 이 번호를 파일 핸들이라 부른다. 실패하면 올림 플래그(CF)가 1이 된다.

이미 있는 파일을 읽기만 하려면 BX를 0, DX를 1로 바꾼다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 716Ch·7305h가 AH와 AL로 나뉘는 값, 동작 값 10h + 02h = 12h, 속성 값 3 = 1 OR 2, 표의 속성 값이 서로 겹치지 않는 비트인 것, DISKIO 구조체의 크기 10바이트와 칸 위치 — [52_int21h-file-disk-functions_verify.py](/Hongs_Blog/studies/assembly-language/code/52_int21h-file-disk-functions_verify/). 상수 계산만 확인했다. 파일을 만들거나 섹터를 읽지는 않았고, 함수의 동작은 실행으로 확인하지 못했다.</div>

</div>


## 파일 함수

| 번호 | 하는 일 |
|---|---|
| 716Ch | 파일을 만들거나 연다 |
| 3Eh | 파일 핸들을 닫는다 |
| 42h | 파일 안에서 읽고 쓸 위치를 옮긴다 |
| 5706h | 파일을 만든 날짜와 시각을 읽는다 |
| 3Fh, 40h | 핸들로 읽고 쓴다: [INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/) |

앞의 넷이 MS-DOS의 기본 파일 입출력 함수다.

함수 716Ch가 받는 값은 다음과 같다.

| 레지스터 | 뜻 | 값 |
|---|---|---|
| AX | 함수 번호 | 716Ch |
| BX | 어떻게 쓸지 | 0 = 읽기, 1 = 쓰기, 2 = 읽기와 쓰기 |
| CX | 파일 속성 | 0 = 보통, 1 = 읽기 전용, 2 = 숨김, 4 = 시스템, 8 = 볼륨 이름, 20h = 보관 |
| DX | 동작 | 1 = 열기, 2 = 비우기, 10h = 만들기 |
| DS:SI | 파일 이름의 주소 | |
| DI | 별칭 힌트 | 안 써도 된다 |

동작 값은 더해서 쓴다. 10h + 02h = 12h는 "없으면 만들고, 있으면 내용을 비운다"다. 10h와 02h는 켜지는 비트가 달라서 더하기와 OR가 같다. 속성 값도 비트 하나씩이라 OR로 겹쳐 쓴다. 3은 1 OR 2, 곧 읽기 전용이면서 숨긴 파일이다. 시스템 파일은 3이 아니라 4다[^s2].


## 디스크와 디렉터리 함수

디스크와 디렉터리를 다루는 함수 가운데 자주 쓰는 것들이다.

| 번호 | 하는 일 |
|---|---|
| 0Eh | 기본 드라이브를 정한다 |
| 19h | 기본 드라이브를 읽는다 |
| 7303h | 디스크의 빈 공간을 읽는다 |
| 39h | 하위 디렉터리를 만든다 |
| 3Ah | 하위 디렉터리를 지운다 |
| 3Bh | 현재 디렉터리를 바꾼다 |
| 41h | 파일을 지운다 |
| 43h | 파일 속성을 읽거나 바꾼다 |
| 47h | 현재 디렉터리 경로를 읽는다 |
| 4Eh, 4Fh | 조건에 맞는 첫 파일, 다음 파일을 찾는다 |
| 56h | 파일 이름을 바꾼다 |
| 57h | 파일의 날짜와 시각을 읽거나 바꾼다 |
| 59h | 자세한 오류 정보를 읽는다 |

디렉터리를 만드는 39h와 지우는 3Ah는 모양이 같다. DX에 경로 문자열의 주소를 넣고 부른 뒤 올림 플래그를 본다. 경로 문자열은 0으로 끝난다.

```asm
.data
pathname BYTE "\ASM",0
.code
mov ah,39h              ; 3Ah로 바꾸면 지우기
mov dx,OFFSET pathname
int 21h
jc  DisplayError
```

## 섹터를 직접 읽고 쓰기

함수 7305h는 파일 이름을 거치지 않고 디스크의 논리 섹터를 번호로 읽고 쓴다.

- 16비트 실주소 모드에서만 돈다.
- Windows 2000, XP, Vista, Windows 7에서는 돌지 않는다. 보안을 엄격하게 지키는 운영체제라서 막아 둔다.

어느 섹터부터 몇 개를 어디로 읽을지는 구조체 하나에 적어 넘긴다.

```asm
DISKIO STRUCT
    startSector DWORD 0        ; 시작 섹터 번호
    numSectors  WORD 1         ; 섹터 수
    bufferOfs   WORD buffer    ; 버퍼의 오프셋
    bufferSeg   WORD @DATA     ; 버퍼의 세그먼트
DISKIO ENDS
```

```
오프셋  0           4        6        8        10
        +-----------+--------+--------+--------+
        |startSector|numSect.|buf.Ofs |buf.Seg |
        +-----------+--------+--------+--------+
          4바이트     2        2        2       = 10바이트
```

C 드라이브에서 섹터를 읽는 코드다.

```asm
.data
buffer     BYTE 512 DUP(?)
diskStruct DISKIO <>
.code
mov ax,7305h            ; 섹터 직접 읽기·쓰기
mov cx,0FFFFh           ; 늘 이 값
mov dl,3                ; C 드라이브
mov bx,OFFSET diskStruct
mov si,0                ; 읽기
int 21h
```

버퍼 512바이트가 섹터 하나의 크기다. 이 함수로 읽은 섹터 안에서 [FAT](/Hongs_Blog/studies/assembly-language/fat-file-system/)나 디렉터리의 실제 바이트를 볼 수 있다[^s1].

## 활용

- 흔한 실수: `int 21h` 바로 뒤에 `jc`로 실패를 확인하지 않고 AX를 핸들로 쓰는 것. 실패했을 때 AX에는 핸들이 아니라 오류 코드가 들어 있다.
- 파일을 다 쓰면 3Eh로 닫는다. 핸들은 MS-DOS가 열린 파일마다 내준 번호이고, 닫아야 그 번호를 다시 쓸 수 있다[^s1].
- 운영체제 과목의 "파일 열기 → 읽기·쓰기 → 닫기"가 어셈블리어 수준에서는 이 함수들이다: [파일과 파일 관리 시스템](/Hongs_Blog/studies/operating-systems/file-management-system/).

## 연결

- 부르는 틀과 글자 입출력: [INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/)
- 섹터와 클러스터, FAT: [클러스터와 FAT](/Hongs_Blog/studies/assembly-language/fat-file-system/)
- 디렉터리의 구조: [디렉터리와 파일 공유](/Hongs_Blog/studies/operating-systems/directories-file-sharing/)
- 실주소 모드에서만 도는 까닭: [x86 동작 모드](/Hongs_Blog/studies/assembly-language/x86-operating-modes/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 함수 716Ch를 부른 뒤 성공과 실패를 어떻게 가려내는가? 성공하면 AX에 무엇이 들어 있는가?</summary>

**답:** 올림 플래그(CF)를 본다. `jc failed`로 CF = 1이면 실패 쪽으로 간다. 성공하면 AX에 파일 핸들이 들어 있고, 그 뒤의 읽기·쓰기·닫기는 이 번호로 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 이미 있는 파일을 읽기 전용으로 열려면 716Ch의 BX, CX, DX에 무엇을 넣는가? 새 파일을 만들되 같은 이름이 있으면 비우려면 DX는 얼마인가?</summary>

**답:** BX = 0(읽기), CX = 0(보통 속성), DX = 1(열기). 새로 만들고 비우려면 DX = 10h + 02h = 12h.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 함수 7305h는 왜 Windows 2000 이후에서 막혀 있는가? 이 함수가 파일 함수(716Ch, 3Fh, 40h)와 다른 점에서 답하라.</summary>

**답:** 716Ch 같은 파일 함수는 파일 이름으로 부탁하므로 MS-DOS가 그 파일의 클러스터만 건드린다. 7305h는 섹터 번호를 바로 대므로 FAT나 디렉터리, 다른 파일의 섹터도 읽고 덮어쓸 수 있다. 프로그램 하나가 디스크 전체를 망가뜨릴 수 있어서 보호 장치가 있는 운영체제는 이를 막는다.<br>
**이유:** "보안 때문"이라는 말만으로는 무엇이 위험한지 알 수 없다. 위험은 섹터와 FAT의 관계에서 나온다.

</details>


[^s1]: 구조체 크기는 검증 코드로 확인했다.
[^s2]: 시스템 속성 값 4는 Microsoft의 FAT 명세(Microsoft Extensible Firmware Initiative FAT32 File System Specification, 2000)의 ATTR_SYSTEM = 0x04를 따랐다. 값들이 서로 겹치지 않는 비트라는 것은 검증 코드로 확인했다.
{% endraw %}
