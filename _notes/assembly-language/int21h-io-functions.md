---
layout: "note"
title: "INT 21h 입출력 함수"
display_title: "INT 21h 입출력 함수 (MS-DOS Function Calls)"
kind: "concept"
kind_label: "정의"
num: "51"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["INT 21h", "MS-DOS Function Calls", "MS-DOS 함수 호출", "MS-DOS Services", "함수 4Ch", "Terminate Process", "표준 입력", "표준 출력", "Irvine16", "ReadString"]
description: "MS-DOS에 일을 시키는 창구는 하나뿐이다. 은행 창구에 번호표와 서류를 내밀듯, 정해진 자리에 \"몇 번 일\"인지와 필요한 값을 넣어 두고 창구를 부른다. 글자 찍기, 글자 읽기, 날짜 읽기, 프로그램 끝내기가 모두 같은 방식이라 번호만 알면 된다. 대신 번호마다 어느 자리에 무…"
prev_url: "/studies/assembly-language/interrupt-vector-table/"
prev_title: "INT 명령과 인터럽트 벡터 표"
next_url: "/studies/assembly-language/int21h-file-disk-functions/"
next_title: "INT 21h 파일·디스크 함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/int21h-io-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

MS-DOS에 일을 시키는 창구는 하나뿐이다. 은행 창구에 번호표와 서류를 내밀듯, 정해진 자리에 "몇 번 일"인지와 필요한 값을 넣어 두고 창구를 부른다. 글자 찍기, 글자 읽기, 날짜 읽기, 프로그램 끝내기가 모두 같은 방식이라 번호만 알면 된다. 대신 번호마다 어느 자리에 무엇을 넣고 결과가 어디로 나오는지가 달라서, 표를 보지 않으면 틀리기 쉽고, MS-DOS 위에서 도는 옛 방식 프로그램에서만 쓸 수 있다.

</div>


## 예시로 보기

화면에 글자 `A` 하나를 찍고 싶다. 화면 장치를 직접 다루는 코드를 짤 필요는 없다. MS-DOS가 이미 갖고 있는 코드를 부르면 된다[^1].

```asm
mov ah,02h      ; 2번 일: 글자 하나 쓰기
mov dl,'A'      ; 쓸 글자
int 21h         ; MS-DOS를 부른다
```

세 줄이 틀이다.

1. AH에 함수 번호를 넣는다.
2. 그 함수가 받는 값을 정해진 레지스터에 넣는다.
3. `int 21h`를 부른다. 결과가 있으면 정해진 레지스터로 돌아온다.

번호를 2에서 5로 바꾸면 같은 글자가 프린터로 간다[^2]. 번호를 1로 바꾸면 반대로 키보드에서 글자 하나를 읽어 AL에 넣어 준다[^3]. 창구(21h)는 그대로이고 번호만 바뀐다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 02h·09h·40h·06h·0Bh의 입력과 결과 레지스터, `LENGTHOF message` = 31, XOR 암호화가 두 번 하면 원래대로 돌아오는지(8비트 전수), ReadString이 돌려주는 값 — [51_int21h-io-functions_verify.py](/Hongs_Blog/studies/assembly-language/code/51_int21h-io-functions_verify/). MS-DOS가 없어서 `int 21h`를 실제로 부르지 못했다. 슬라이드가 적은 규칙을 파이썬으로 흉내 낸 것이고, 함수의 동작 자체는 슬라이드 근거다.</div>

</div>


## 함수 표

아래 값은 모두 슬라이드에 적힌 것이고 실행해서 확인하지는 않았다.

### 쓰기

| AH | 하는 일 | 넣는 값 | 돌아오는 값 |
|---|---|---|---|
| 02h | 글자 하나를 표준 출력에 쓴다[^1] | DL = 글자 | |
| 06h | 글자 하나를 표준 출력에 쓴다[^1] | DL = 글자 (FFh가 아닌 값) | |
| 05h | 글자 하나를 프린터에 쓴다[^2] | DL = 글자 | |
| 09h | 문자열을 표준 출력에 쓴다[^4] | DS:DX = 문자열 주소. 문자열은 `$`로 끝나야 한다 | |
| 40h | 파일이나 장치에 여러 바이트를 쓴다[^5] | BX = 핸들(화면은 1), CX = 바이트 수, DS:DX = 주소 | AX = 쓴 바이트 수 |

표준 출력은 보통 화면이다. 핸들은 MS-DOS가 열린 파일이나 장치마다 붙여 주는 번호다.

09h와 40h는 문자열의 끝을 아는 방법이 다르다. 09h는 `$` 글자를 만날 때까지 찍는다. 40h는 CX에 적힌 개수만큼만 찍는다.

```asm
.data
string BYTE "This is a string$"
.code
mov ah,9
mov dx,OFFSET string
int 21h
```

여러 함수가 다음 제어 문자를 만나면 글자를 찍는 대신 정해진 동작을 한다[^6].

| 값 | 이름 | 동작 |
|---|---|---|
| 08h | 백스페이스 | 왼쪽으로 한 칸 |
| 09h | 탭 | 오른쪽으로 몇 칸 건너뜀 |
| 0Ah | 줄 바꿈 | 다음 줄로 |
| 0Ch | 폼 피드 | 프린터의 다음 쪽으로 |
| 0Dh | 캐리지 리턴 | 줄의 맨 왼쪽으로 |
| 1Bh | 이스케이프 | |

### 읽기

| AH | 하는 일 | 넣는 값 | 돌아오는 값 | 특징 |
|---|---|---|---|---|
| 01h | 글자 하나를 읽는다[^3] | | AL = 글자 | 읽은 글자를 화면에 보여 준다. 버퍼가 비었으면 기다린다. Ctrl-Break를 확인한다 |
| 06h | 기다리지 않고 글자 하나를 읽는다[^7] | DL = FFh | AL = 글자. 글자가 없으면 ZF = 1 | 화면에 보여 주지 않는다 |
| 0Ah | 한 줄을 버퍼에 읽는다[^8] | DS:DX = 미리 만든 구조체 주소 | 구조체 안에 글자 수와 글자들 | |
| 0Bh | 입력 버퍼에 글자가 있는지 본다[^9] | | AL = 0이면 비어 있음 | Ctrl-Break로 끊을 수 있다 |
| 3Fh | 파일이나 장치에서 여러 바이트를 읽는다[^10] | BX = 핸들(키보드는 0), CX = 최대 바이트 수, DS:DX = 넣을 곳 | AX = 읽은 바이트 수 | Ctrl-Break로 끊을 수 있다 |

06h는 DL의 값에 따라 쓰기와 읽기를 오간다. DL이 FFh면 읽기, 다른 값이면 그 값을 쓰기다[^11].

0Ah가 받는 구조체는 세 칸이다. 첫 칸에 최대 글자 수를 미리 적어 두면, MS-DOS가 둘째 칸에 실제로 읽은 글자 수를, 셋째 칸에 글자들을 넣어 준다[^8].

```asm
count = 80
KEYBOARD STRUCT
    maxInput   BYTE count          ; 최대 글자 수
    inputCount BYTE ?              ; 실제로 읽은 글자 수
    buffer     BYTE count DUP(?)   ; 읽은 글자들
KEYBOARD ENDS
```

### 날짜와 시간

| AH | 하는 일 | 값이 오가는 자리 |
|---|---|---|
| 2Ah | 날짜 읽기[^12] | CX = 연도, DH = 월, DL = 일, AL = 요일 |
| 2Bh | 날짜 바꾸기[^13] | CX = 연도, DH = 월, DL = 일을 넣고 부른다. AL로 성공 여부가 돌아온다 |
| 2Ch | 시각 읽기[^14] | CH = 시(0~23), CL = 분(0~59), DH = 초(0~59) |
| 2Dh | 시각 바꾸기[^15] | CH = 시, CL = 분, DH = 초를 넣고 부른다. AL로 성공 여부가 돌아온다 |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 함수 2Bh와 2Dh 슬라이드의 설명이 "AL = 0 if the function was not successful"이다. 2Dh 슬라이드는 설명이 "Sets the system date"로 시작한다.<br>
문제점: 같은 슬라이드의 코드는 `cmp al,0` 다음 `jne failed`다. AL이 0이 아닐 때 실패로 간다. 설명과 코드가 반대다. 2Dh는 시각을 바꾸는 함수인데 날짜라고 적혀 있다.<br>
수정안: "AL = 0이면 성공, 0이 아니면 실패". 2Dh는 "시스템 시각을 바꾼다".<br>
근거: 14주차 슬라이드의 부록 표에 2Bh는 "Returns: AL = 0 if the date is valid", 2Dh는 "Returns: AL = 0 if the time is valid"로 적혀 있다[^16]. 코드와 부록이 같은 쪽을 가리킨다.

</div>


### 프로그램 끝내기

함수 4Ch는 지금 프로그램을 끝내고, 부른 쪽에 8비트 반환 코드를 돌려준다. 0은 보통 "잘 끝났다"는 뜻이다. `.EXIT 0`이라고 써도 같다[^17].

```asm
mov ah,4Ch      ; 프로그램 끝내기
mov al,0        ; 반환 코드
int 21h
```

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 제목이 "INT 4Ch: Terminate Process"다.<br>
문제점: 4Ch는 인터럽트 번호가 아니라 INT 21h의 함수 번호다. 같은 슬라이드의 코드도 `mov ah,4Ch` 다음 `int 21h`다.<br>
수정안: "INT 21h Function 4Ch: Terminate Process".<br>
근거: 슬라이드의 코드와 부록 표의 4C 줄(Terminate process, AL = 8비트 반환 코드)[^16].

</div>


## 예제

**글자가 올 때까지 기다리기.** 0Bh로 버퍼를 보고, 비어 있으면 다시 본다. 글자가 들어오면 01h로 읽는다[^9].

```asm
L1: mov ah,0Bh      ; 버퍼 상태 보기
    int 21h
    cmp al,0        ; 비었나?
    je  L1          ; 비었으면 다시
    mov ah,1        ; 있으면 읽는다
    int 21h
    mov char,al
```

**문자열 암호화.** 표준 입력에서 한 글자씩 읽어 239와 XOR해서 표준 출력에 쓴다. 더 읽을 글자가 없으면(ZF = 1) 끝난다[^18].

```asm
XORVAL = 239
L1: mov ah,6
    mov dl,0FFh     ; 기다리지 않고 읽기
    int 21h         ; AL = 글자
    jz  L2          ; 글자가 없으면 끝
    xor al,XORVAL
    mov ah,6        ; 같은 6번이지만 이번엔 쓰기
    mov dl,al
    int 21h
    jmp L1
L2: exit
```

같은 값으로 XOR를 두 번 하면 원래 값이 된다. 예: `A`(41h) XOR EFh = AEh, 다시 AEh XOR EFh = 41h. 그래서 암호문을 같은 프로그램에 다시 넣으면 원문이 나온다[^s1]: [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/).

**Irvine16의 ReadString.** 함수 01h를 되풀이해 한 줄을 읽고 끝에 0을 붙이는 프로시저다. DX에 버퍼 주소, CX에 "최대 글자 수 + 1"을 넣고 부른다. 글자를 CX − 1개 읽었거나 Enter를 누르면 끝난다[^19].

```asm
ReadString PROC
    push cx             ; 레지스터 보관
    push si
    push cx             ; 글자 수 보관
    mov  si,dx          ; 버퍼를 가리킨다
    dec  cx             ; 끝의 0이 들어갈 자리를 남긴다
L1: mov  ah,1
    int  21h            ; AL = 읽은 글자
    cmp  al,0Dh         ; Enter인가?
    je   L2
    mov  [si],al
    inc  si
    loop L1
L2: mov  BYTE PTR [si],0
    pop  ax             ; 처음의 CX
    sub  ax,cx          ; AX = 읽은 크기
    pop  si
    pop  cx
    ret
ReadString ENDP
```

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 위 코드의 끝 주석이 "AX = size of input string"이다. 설명 슬라이드에는 "Writestring inputs the string from the user"라고 적혀 있다.<br>
문제점: 코드 그대로면 AX에 글자 수보다 1 큰 값이 남는다. CX = 20으로 부르고 `abc`와 Enter를 치면, `dec cx`로 19가 되고 글자 셋에 `loop`가 세 번 돌아 16이 된다. `pop ax`로 20을 꺼내 16을 빼면 4다. 글자는 3개다. 설명 슬라이드의 Writestring은 ReadString을 잘못 적은 것이다.<br>
수정안: `sub ax,cx` 뒤에 `dec ax`를 넣거나, 주석을 "글자 수 + 1"로 읽는다.<br>
근거: 검증 코드에서 이 프로시저를 한 줄씩 옮겨 글자 수 0~19에 대해 돌리면 늘 글자 수 + 1이 나온다.

</div>


## 활용

- 흔한 실수 1: 09h로 찍을 문자열 끝에 `$`를 빼먹는 것. 멈출 곳이 없어서 뒤에 놓인 다른 자료까지 찍힌다[^s1].
- 흔한 실수 2: 0으로 끝나는 문자열을 09h에 넘기는 것. 0으로 끝나는 문자열은 Irvine 라이브러리의 `WriteString`이 받는 모양이다: [Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/).
- 흔한 실수 3: 09h와 40h를 부르기 전에 DS가 문자열이 든 세그먼트를 가리키게 해 두지 않는 것. 16비트 프로그램은 시작할 때 `mov ax,@data`, `mov ds,ax`를 직접 해야 한다[^4][^18].
- 함수 번호와 레지스터의 전체 목록은 14주차 슬라이드의 부록 표에 있다[^16].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 함수 40h 슬라이드의 자료 정의가 `message "Writing a string to the console"`이다.<br>
문제점: 자료형이 빠졌다. 이대로는 어셈블되지 않는다.<br>
수정안: `message BYTE "Writing a string to the console"`. 이 문자열은 31글자라 `LENGTHOF message`가 31이다.<br>
근거: 같은 슬라이드의 다른 정의(`bytesWritten WORD ?`)와 [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)의 문법.

</div>


## 연결

- 부르는 틀의 바탕: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)
- 같은 창구의 파일·디스크 함수: [INT 21h 파일·디스크 함수](/Hongs_Blog/studies/assembly-language/int21h-file-disk-functions/)
- 운영체제를 거치는 것과 BIOS를 바로 부르는 것의 차이: [입출력 접근 수준](/Hongs_Blog/studies/assembly-language/io-access-levels/)
- 제어 문자와 ASCII: [부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** INT 21h 함수를 부르는 세 단계를 쓰고, 글자 `A`를 화면에 찍는 코드를 쓰라.</summary>

**답:** ① AH에 함수 번호를 넣는다. ② 그 함수가 받는 값을 정해진 레지스터에 넣는다. ③ `int 21h`를 부른다. 코드는 `mov ah,02h` / `mov dl,'A'` / `int 21h`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 문자열을 찍는 함수 09h와 40h는 "어디까지 찍을지"를 어떻게 아는가? 길이를 이미 아는 바이트 묶음(중간에 `$`가 들어 있을 수 있다)을 찍으려면 어느 쪽을 써야 하는가?</summary>

**답:** 09h는 `$` 글자를 만날 때까지 찍는다. 40h는 CX에 넣은 바이트 수만큼 찍는다. 중간에 `$`가 있을 수 있으면 40h를 써야 한다.<br>
**이유:** 09h는 중간의 `$`에서 멈춰 버린다. 40h는 내용을 보지 않고 개수만 센다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 암호화 예제에서 글자 `A`(41h)가 들어오면 화면으로 나가는 바이트는? 그 바이트를 같은 프로그램에 다시 넣으면?</summary>

**답:** AEh가 나간다. 다시 넣으면 41h(`A`)가 나온다.<br>
**이유:** 41h = 0100 0001, EFh = 1110 1111. XOR하면 1010 1110 = AEh. 같은 값으로 한 번 더 XOR하면 바뀐 비트가 다시 바뀌어 원래대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 함수 2Bh 슬라이드에는 "AL = 0이면 실패"라고 적혀 있는데 코드는 `cmp al,0` / `jne failed`다. 어느 쪽이 맞다고 보는가? 근거는?</summary>

**답:** 코드가 맞다. AL = 0이면 성공이다.<br>
**이유:** `jne failed`는 AL이 0이 아닐 때 실패 쪽으로 간다. 14주차 부록 표도 "AL = 0 if the date is valid"라고 적는다.

</details>


[^1]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.18 (INT 21h Functions 02h and 06h)
[^2]: 같은 자료, p.19 (Function 05h: Write Character to Default Printer)
[^3]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-2」, p.2 (Function 01h)
[^4]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.20 (Function 09h: '$'로 끝나야 하고 DS가 문자열의 세그먼트를 가리켜야 한다)
[^5]: 같은 자료, p.21 (Function 40h)
[^6]: 같은 자료, p.17 (ASCII Control Characters)
[^7]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-2」, p.3 (Function 06h: Read character without waiting)
[^8]: 같은 자료, p.4~5 (Function 0Ah, KEYBOARD 구조체)
[^9]: 같은 자료, p.6 (Function 0Bh)
[^10]: 같은 자료, p.8 (Function 3Fh)
[^11]: 어셈블리어 14회 강의 자료 「wk14-chapt_16-2-1」, p.15 (INT 21h Appendix, 함수 6: DL = FFh면 읽기, 다른 값이면 쓰기)
[^12]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-2」, p.10 (Function 2Ah)
[^13]: 같은 자료, p.11 (Function 2Bh)
[^14]: 같은 자료, p.12 (Function 2Ch)
[^15]: 같은 자료, p.13 (Function 2Dh)
[^16]: 어셈블리어 14회 강의 자료 「wk14-chapt_16-2-1」, p.15~20 (INT 21h Appendix: 표 D-2). 같은 표가 14.wk14-chapt_17-2-2.pdf p.10~15에 다시 나온다.
[^17]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.15 (Terminate Process)
[^18]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-2」, p.7 (Example: String Encryption)
[^19]: 같은 자료, p.20~22 (ReadString Procedure, ReadString Implementation)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> XOR를 두 번 하면 원래대로 돌아온다는 설명과 41h → AEh 계산, `$`를 빼먹었을 때 생기는 일, 카드 C2~C4는 슬라이드에 없다. 계산은 검증 코드로 확인했다. 코드 블록의 한국어 주석은 슬라이드의 영어 주석을 옮긴 것이다.
{% endraw %}
