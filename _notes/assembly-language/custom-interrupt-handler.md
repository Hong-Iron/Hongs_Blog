---
layout: "note"
title: "인터럽트 핸들러 바꿔 끼우기"
display_title: "인터럽트 핸들러 바꿔 끼우기 (Writing a Custom Interrupt Handler)"
kind: "concept"
kind_label: "기법"
num: "56"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Writing a Custom Interrupt Handler", "사용자 인터럽트 핸들러", "인터럽트 벡터 바꾸기", "Get Interrupt Vector", "Set Interrupt Vector", "함수 35h", "함수 25h", "Chaining", "TSR", "Terminate and Stay Resident", "상주 프로그램", "No_Reset", "Ctrl-Break Handler"]
description: "주소록의 한 줄을 내 주소로 고쳐 두면, 그 번호로 걸려 오는 전화를 내가 먼저 받는다. 나는 내용을 훑어보고 필요한 것만 손본 뒤 원래 주인에게 그대로 넘긴다. 이렇게 하면 운영체제의 코드를 고치지 않고도 키 조합 하나를 막거나 동작을 바꿀 수 있다. 다만 고치기 전에 원래 주소…"
prev_url: "/studies/assembly-language/hardware-interrupt-irq/"
prev_title: "하드웨어 인터럽트와 IRQ"
math: false
mermaid: true
code_count: 1
permalink: "/studies/assembly-language/custom-interrupt-handler/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주소록의 한 줄을 내 주소로 고쳐 두면, 그 번호로 걸려 오는 전화를 내가 먼저 받는다. 나는 내용을 훑어보고 필요한 것만 손본 뒤 원래 주인에게 그대로 넘긴다. 이렇게 하면 운영체제의 코드를 고치지 않고도 키 조합 하나를 막거나 동작을 바꿀 수 있다. 다만 고치기 전에 원래 주소를 적어 두지 않으면 넘겨줄 곳을 잃어 키보드가 통째로 먹통이 되고, 내 코드는 아무 때나 불리므로 쓴 것을 모두 원래대로 돌려놓아야 한다.

</div>


## 예시로 보기

Ctrl+Alt+Del을 누르면 컴퓨터가 다시 시작한다. 실수로 눌러 작업을 날리는 일을 막고 싶다. 키를 받아 처리하는 BIOS의 코드는 내가 만든 것이 아니라서 직접 고치기 어렵다. 그런데 키가 눌릴 때 프로세서는 그 코드로 곧장 가지 않고, [인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)의 9번 칸에 적힌 주소로 간다. 그 칸은 고칠 수 있다.

칸에 내 코드의 주소를 적어 두면 키가 눌릴 때마다 이렇게 흐른다[^1].

```mermaid
flowchart LR
  K[키가 눌린다] --> P[8259가 프로세서에<br/>인터럽트 번호 9를 넘긴다]
  P --> T[벡터 표 9번 칸<br/>10B2:0020]
  T --> M[내 코드 10B2:0020<br/>키를 먼저 본다]
  M -->|jmp 0DAD:2BAD| B[BIOS의 INT 9 코드<br/>0DAD:2BAD]
  B -->|IRET| R[끊긴 프로그램으로<br/>돌아간다]
```

1. 키가 눌리고, 하드웨어가 바이트 하나를 키보드 포트로 보낸다.
2. 8259가 프로세서를 끊고 인터럽트 번호를 넘긴다.
3. 프로세서가 벡터 표의 9번 칸을 보고 거기 적힌 주소로 간다.
4. 내 코드가 돌면서 키보드가 보낸 바이트를 먼저 본다.
5. 내 코드가 원래의 INT 9 코드로 뛴다.
6. 원래 코드가 일을 마치고 돌아간다.
7. 시스템이 하던 일을 계속한다.

5번처럼 일을 마친 뒤 원래 코드로 넘기는 것을 사슬로 잇는다(chaining)고 한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 벡터 표의 9번 칸에서 옛 주소 0DAD:2BAD를 읽어 오프셋·세그먼트 순서로 저장하고 10B2:0020을 써넣은 뒤의 바이트, 키가 눌렸을 때 지나가는 두 주소, `NOT ctrl_key` = 11111011b, No_Reset의 판정을 플래그 256가지 × 스캔 코드 256가지 전수(막는 경우는 32가지), 카드 C3 — [56_custom-interrupt-handler_verify.py](/Hongs_Blog/studies/assembly-language/code/56_custom-interrupt-handler_verify/). 실제로 핸들러를 메모리에 올린 것이 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 언제 쓰고 무엇을 하나

쓰는 까닭은 셋이다. 이미 있는 핸들러의 동작을 바꾸려고, 이미 있는 핸들러의 잘못을 고치려고, 어떤 키보드 명령을 꺼서 시스템을 안전하게 하려고[^2].

할 일은 넷이다[^2].

1. 새 핸들러를 쓴다.
2. 그것을 메모리에 올린다.
3. 벡터 표의 칸을 바꾼다.
4. 보통은 원래 핸들러로 넘긴다.

칸을 직접 고치지 않고 MS-DOS 함수 두 개를 쓴다.

| 함수 | 하는 일 | 넣는 값 | 돌아오는 값 |
|---|---|---|---|
| INT 21h, 35h | 칸에 적힌 주소를 읽는다[^3] | AL = 인터럽트 번호 | ES:BX = 핸들러 주소 |
| INT 21h, 25h | 칸에 새 주소를 쓴다[^4] | AL = 인터럽트 번호, DS:DX = 새 핸들러 주소 | |

**원래 주소 적어 두기.** 4바이트 자리를 만들어 오프셋을 앞에, 세그먼트를 뒤에 넣는다[^3].

```asm
.data
int9Save LABEL WORD
         DWORD ?            ; 원래 INT 9 주소를 넣을 자리
.code
mov ah,35h                  ; 벡터 읽기
mov al,9                    ; INT 9
int 21h
mov int9Save,BX             ; 오프셋
mov [int9Save+2],ES         ; 세그먼트
```

**새 주소 써넣기.**[^4]

```asm
mov ax,SEG kybd_rtn         ; 새 핸들러의 세그먼트
mov ds,ax
mov dx,OFFSET kybd_rtn      ; 새 핸들러의 오프셋
mov ah,25h                  ; 벡터 쓰기
mov al,9h                   ; INT 9h
int 21h
...
kybd_rtn PROC               ; 새 핸들러가 여기서 시작한다
```

순서가 중요하다. 읽어서 적어 둔 다음에 써야 한다. 먼저 쓰면 원래 주소 0DAD:2BAD가 표에서 사라져 되찾을 수 없다.

## 예제 1: Ctrl-Break 핸들러

MS-DOS 프로그램이 입력을 기다리는 동안 사용자가 Ctrl-Break를 누르면 INT 23h의 핸들러가 불린다. 기본 핸들러는 프로그램을 끝낸다. 그러면 파일이 열린 채 남거나 메모리가 반납되지 않을 수 있다. INT 23h의 칸을 내 코드로 바꾸면 프로그램이 멈추지 않는다[^5].

```asm
TITLE Control-Break Handler             (Ctrlbrk.asm)
INCLUDE Irvine16.inc

.data
breakMsg BYTE "BREAK",0
msg  BYTE "Ctrl-Break demonstration."
     BYTE 0dh,0ah
     BYTE "This program disables Ctrl-Break (Ctrl-C). Press any"
     BYTE 0dh,0ah
     BYTE "keys to continue, or press ESC to end the program."
     BYTE 0dh,0ah,0

.code
main PROC
    mov  ax,@data
    mov  ds,ax

    mov  dx,OFFSET msg          ; 안내문을 보여 준다
    call Writestring

install_handler:
    push ds                     ; DS 보관
    mov  ax,@code               ; DS가 코드 세그먼트를 가리키게 한다
    mov  ds,ax
    mov  ah,25h                 ; 벡터 쓰기
    mov  al,23h                 ; INT 23h
    mov  dx,OFFSET break_handler
    int  21h
    pop  ds                     ; DS 되돌리기

L1: mov  ah,1                   ; 키를 기다려 읽고 화면에 보여 준다
    int  21h
    cmp  al,1Bh                 ; ESC인가?
    jnz  L1                     ; 아니면 계속

    exit
main ENDP

; Ctrl-Break가 눌리면 아래 프로시저가 돈다.
; 레지스터를 모두 원래대로 두어야 한다.
break_handler PROC
    push ax
    push dx
    mov  dx,OFFSET breakMsg
    call WriteString
    pop  dx
    pop  ax
    iret
break_handler ENDP
END main
```

읽을 곳은 세 군데다.

- 함수 25h는 새 주소를 DS:DX로 받는다. 핸들러는 코드 세그먼트에 있으므로 부르기 전에 DS를 잠깐 `@code`로 바꾸고, 끝나면 `pop ds`로 되돌린다.
- 핸들러는 쓰는 레지스터(AX, DX)를 먼저 스택에 넣고 끝에서 거꾸로 꺼낸다: [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/).
- 핸들러는 `ret`가 아니라 `iret`로 끝난다.

이 예는 원래 핸들러로 넘기지 않는다. 원래 핸들러가 하는 일(프로그램 끝내기)을 막는 것이 목적이기 때문이다.

## 예제 2: No_Reset

메모리에 올라가서 치워질 때까지 남아 있는 프로그램을 상주 프로그램(TSR)이라 부른다. 치우는 프로그램을 돌리거나 컴퓨터를 다시 켜야 없어진다[^6]. No_Reset은 INT 9의 칸을 자기 핸들러로 바꾸는 상주 프로그램이다. 들어오는 키를 하나하나 보다가 Del 키가 오면 Ctrl과 Alt가 눌려 있는지 본다. 오른쪽 Shift까지 눌려 있을 때만 다시 시작을 허락한다[^7].

키보드 상태 바이트(0040:0017)의 비트는 다음과 같다[^7].

| 비트 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| 뜻 | Insert 켜짐 | Caps Lock 켜짐 | Num Lock 켜짐 | Scroll Lock 켜짐 | Alt 눌림 | Ctrl 눌림 | 왼쪽 Shift 눌림 | 오른쪽 Shift 눌림 |

핸들러 전체다[^8].

```asm
int9_handler PROC FAR
    sti                     ; 하드웨어 인터럽트를 다시 받는다
    pushf                   ; 플래그와 레지스터 보관
    push es
    push ax
    push di

L1: mov  ax,40h             ; BIOS 데이터 세그먼트 40h
    mov  es,ax
    mov  di,17h             ; 키보드 플래그의 자리
    mov  ah,es:[di]         ; 플래그를 AH로

L2: test ah,ctrl_key        ; Ctrl이 눌려 있나?
    jz   L5                 ; 아니면 나간다
    test ah,alt_key         ; Alt가 눌려 있나?
    jz   L5                 ; 아니면 나간다

L3: in   al,kybd_port       ; 키보드 포트를 읽는다
    cmp  al,del_key         ; Del 키인가?
    jne  L5                 ; 아니면 나간다
    test ah,rt_shift        ; 오른쪽 Shift가 눌려 있나?
    jnz  L5                 ; 그렇다면 다시 시작을 허락한다

L4: and  ah,NOT ctrl_key    ; Ctrl 비트를 끈다
    mov  es:[di],ah         ; 플래그를 메모리에 되쓴다

L5: pop  di                 ; 레지스터와 플래그 되돌리기
    pop  ax
    pop  es
    popf
    jmp  cs:[old_interrupt9]    ; 원래 INT 9 코드로 뛴다
int9_handler ENDP
```

막는 방법이 눈여겨볼 곳이다. 핸들러는 키를 버리지 않는다. 메모리에 있는 Ctrl 비트만 0으로 바꿔 놓고 원래 BIOS 코드로 넘긴다. BIOS 코드는 Del을 받지만 Ctrl이 안 눌린 것으로 보고 다시 시작하지 않는다[^s1].

| 상태 바이트 | 뜻 | 들어온 키 | 지나가는 길 | 되쓰는 값 |
|---|---|---|---|---|
| 0Ch | Ctrl + Alt | Del | L2 → L3 → L4 → L5 | 08h (Ctrl 꺼짐) |
| 0Dh | Ctrl + Alt + 오른쪽 Shift | Del | L2 → L3 → L5 | 바꾸지 않음 |
| 0Ch | Ctrl + Alt | 다른 키 | L2 → L3 → L5 | 바꾸지 않음 |
| 04h | Ctrl만 | Del | L2 → L5 | 바꾸지 않음 |

표에서 `ctrl_key`는 04h, `alt_key`는 08h, `rt_shift`는 01h로 두었다. 위 비트 표의 자리 그대로다. `del_key`는 Del의 스캔 코드 53h다[^s1]: [BIOS 키보드 입력 INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/).

## 활용

- 핸들러를 쓸 때 지킬 것: 맨 앞에서 `sti`, 쓰는 레지스터와 플래그를 모두 보관했다가 되돌리기, 끝은 `iret` 또는 원래 핸들러로 `jmp`.
- 흔한 실수 1: 원래 주소를 적어 두기 전에 칸을 덮어쓰는 것.
- 흔한 실수 2: 원래 핸들러를 `call`로 부르는 것. 슬라이드는 `jmp`를 쓴다. 뛰어 들어가면 원래 핸들러의 `IRET`가 끊긴 프로그램으로 곧장 돌아간다[^s1].
- 16비트 실주소 모드의 MS-DOS에서만 쓸 수 있다. 보호 장치가 있는 운영체제에서는 응용 프로그램이 벡터 표를 고칠 수 없다[^s1].

## 연결

- 벡터 표와 칸의 주소 계산: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)
- 키보드 인터럽트가 오는 길: [하드웨어 인터럽트와 IRQ](/Hongs_Blog/studies/assembly-language/hardware-interrupt-irq/)
- 비트 하나를 검사하는 `TEST`, 끄는 `AND`와 `NOT`: [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/), [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/)
- 끊긴 프로그램의 상태를 저장하고 되살리는 일반 원리: [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 내 핸들러를 끼우는 네 단계를 쓰고, 벡터를 읽는 함수와 쓰는 함수의 번호와 주소가 오가는 레지스터를 쓰라.</summary>

**답:** ① 새 핸들러를 쓴다 ② 메모리에 올린다 ③ 벡터 표의 칸을 바꾼다 ④ 보통은 원래 핸들러로 넘긴다. 읽기는 INT 21h 함수 35h(AL = 번호, 결과 ES:BX), 쓰기는 함수 25h(AL = 번호, DS:DX = 새 주소).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 함수 25h로 새 주소를 쓰기 전에 함수 35h로 원래 주소를 읽어 저장해야 하는 이유는? 저장하지 않고 INT 9를 바꾸면 무슨 일이 생기는가?</summary>

**답:** 원래 주소는 벡터 표의 그 칸에만 적혀 있다. 덮어쓰면 사라진다. 내 핸들러가 일을 마친 뒤 넘겨줄 곳이 없어서, 키를 버퍼에 넣는 원래 BIOS 코드가 다시는 돌지 않는다. 키보드 입력이 통째로 멈춘다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** No_Reset 핸들러가 불렸을 때 키보드 상태 바이트가 2Ch이고 들어온 키가 Del(53h)이다. 어느 라벨들을 지나고, 상태 바이트는 얼마가 되는가?</summary>

**답:** L1 → L2 → L3 → L4 → L5. 상태 바이트는 28h가 된다.<br>
**이유:** 2Ch = 0010 1100b라 Num Lock 켜짐, Alt, Ctrl이 1이고 오른쪽 Shift는 0이다. Ctrl과 Alt 검사를 지나고, Del이고, 오른쪽 Shift가 없으니 L4로 간다. `and ah,NOT ctrl_key`는 2Ch AND FBh = 28h다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** No_Reset 핸들러가 하는 일을 쉬운 말 한두 문장으로 쓰라.</summary>

**답:** 키가 눌릴 때마다 먼저 불려서, Ctrl+Alt+Del이 오른쪽 Shift 없이 눌렸으면 "Ctrl이 눌려 있다"는 표시를 지운 뒤 원래 키보드 코드로 넘긴다. 그래서 원래 코드는 다시 시작 조합을 알아채지 못한다.

</details>


[^1]: 어셈블리어 14회 강의 자료 「wk14-chapt_17-2-2」, p.22~23 (Keyboard Processing Steps 1~7과 그림: 벡터 표의 INT 9 칸 10B2:0020 → our program → jmp 0DAD:2BAD → Bios INT 9 service routine → IRET)
[^2]: 같은 자료, p.19 (Writing a Custom Interrupt Handler: Motivations, What's Involved)
[^3]: 같은 자료, p.20 (Get Interrupt Vector: 함수 35h)
[^4]: 같은 자료, p.21 (Set Interrupt Vector: 함수 25h)
[^5]: 같은 자료, p.24~25 (Ctrl-Break Handler Example. 교재 쪽을 찍은 그림이라 그림에서 옮겨 적었다)
[^6]: 같은 자료, p.26 (Terminate and Stay Resident Programs)
[^7]: 같은 자료, p.27 (The No_Reset Program 1 of 5와 키보드 상태 바이트 그림)
[^8]: 같은 자료, p.28~31 (The No_Reset Program 2~5 of 5). 네 쪽에 나뉜 코드를 이어 붙였다.
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 흐름 그림, 읽기와 쓰기의 순서 설명, Ctrl-Break 예제의 읽을 곳 세 가지, No_Reset이 키를 버리지 않고 Ctrl 비트만 지운다는 풀이와 경우 표, `ctrl_key` = 04h·`alt_key` = 08h·`rt_shift` = 01h·`del_key` = 53h라는 값(슬라이드 코드는 이름만 쓰고, 값은 p.27의 비트 그림과 14.wk14-chapt_16-2-1.pdf p.10의 스캔 코드 표에서 읽어 냈다), `call`이 아니라 `jmp`로 넘기는 이유, 보호 장치가 있는 운영체제에서는 안 된다는 것, `int9_handler ENDP` 줄, 카드 C2~C4는 슬라이드에 없다. 비트 계산과 경우 표는 검증 코드로 확인했다. 코드 블록의 한국어 주석은 슬라이드의 영어 주석을 옮긴 것이다.
{% endraw %}
