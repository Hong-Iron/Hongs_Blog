---
layout: "note"
title: "스택 프레임 그리기 예제 사다리"
display_title: "스택 프레임 그리기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "44"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 스택 프레임, 스택 매개변수, 호출 규약, 지역 변수."
prev_url: "/studies/assembly-language/shift-rotate-ladder/"
prev_title: "시프트와 회전 예제 사다리"
next_url: "/studies/assembly-language/recursion-stack-practice/"
next_title: "재귀 호출 스택 추적 연습"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/stack-frame-ladder/"
---
{% raw %}
사용 개념: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/), [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/), [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/).

"이 호출의 스택 프레임을 그려라"는 문제는 늘 같은 하위목표로 풀린다. ESP가 4씩 내려가는 것을 한 줄도 건너뛰지 않고 적는 것이 전부다[^s1].

1. *인수:* `push`마다 ESP에서 4를 빼고 그 주소에 값을 적는다.
2. *호출:* `call`이 ESP에서 4를 더 빼고 복귀 주소를 적는다.
3. *기준 세우기:* `push ebp`로 4를 더 빼고 옛 EBP를 적는다. `mov ebp,esp`로 EBP를 그 주소에 고정한다.
4. *아래쪽:* `sub esp,n`(지역 변수)과 `push`(맡기는 레지스터)만큼 ESP를 더 내린다.
5. *그림:* 주소, 든 값, EBP에서 본 자리(`[EBP+8]` 등)를 세 열로 적는다.
6. *걷기:* 끝의 명령마다 ESP와 EBP를 적는다. 돌아온 뒤 ESP가 처음 값인지 확인한다.

모든 문제에서 16진 주소의 뒤에 붙는 `h`는 줄인다.

## 문제 1 · 완전한 풀이

ESP = 00001000, EBP = 00001010에서 시작한다.

```asm
    push 9
    push 4
    call Sub2

Sub2 PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+12]
    sub  eax,[ebp+8]
    pop  ebp
    ret  8
Sub2 ENDP
```

1. *인수:* `push 9` → ESP = 0FFC, 거기에 9. `push 4` → ESP = 0FF8, 거기에 4.
2. *호출:* `call Sub2` → ESP = 0FF4, 거기에 복귀 주소.
3. *기준 세우기:* `push ebp` → ESP = 0FF0, 거기에 00001010. `mov ebp,esp` → EBP = 0FF0.
4. *아래쪽:* 없다.
5. *그림:*

```
   주소        든 값              EBP에서 본 자리
 00000FFC   00000009              [EBP+12]
 00000FF8   00000004              [EBP+8]
 00000FF4   복귀 주소             [EBP+4]
 00000FF0   00001010              [EBP]      ← EBP, ESP
```

   몸통: `mov eax,[ebp+12]`로 EAX = 9, `sub eax,[ebp+8]`로 EAX = 9 − 4 = 5.

{: start="6"}
6. *걷기:* `pop ebp` → EBP = 00001010, ESP = 0FF4. `ret 8` → 복귀 주소를 꺼내 0FF8, 8을 더해 ESP = 1000. 처음 값과 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [44_stack-frame-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/44_stack-frame-ladder_p4/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

ESP = 00001000, EBP = 00001010에서 시작한다.

```asm
    push 7
    call P

P PROC
    push ebp
    mov  ebp,esp
    sub  esp,8
    mov  DWORD PTR [ebp-4],1
    mov  eax,[ebp+8]
    mov  [ebp-8],eax
    add  eax,[ebp-4]
    mov  esp,ebp
    pop  ebp
    ret  4
P ENDP
```

1. *인수:* `push 7` → ESP = 0FFC.
2. *호출:* `call P` → ESP = 0FF8.
3. *기준 세우기:* `push ebp` → ESP = 0FF4. `mov ebp,esp` → EBP = 0FF4.
4. *아래쪽:* `sub esp,8` → ESP = 0FEC.
5. *그림:* (`add eax,[ebp-4]`까지 실행한 뒤)

```
   주소        든 값              EBP에서 본 자리
 00000FFC   00000007              [EBP+8]
 00000FF8   복귀 주소             [EBP+4]
 00000FF4   00001010              [EBP]      ← EBP
 00000FF0   00000001              [EBP-4]
 00000FEC   00000007              [EBP-8]    ← ESP
```

   EAX = 7 + 1 = 8.

{: start="6"}
6. *걷기:* `mov esp,ebp`, `pop ebp`, `ret 4` 각각의 뒤에 ESP와 EBP는? ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`mov esp,ebp` → ESP = 0FF4, EBP = 0FF4(지역 변수 두 칸을 한 번에 돌려준다). `pop ebp` → EBP = 00001010, ESP = 0FF8. `ret 4` → 복귀 주소를 꺼내 0FFC, 4를 더해 ESP = 1000. 처음 값과 같다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

ESP = 00002000, EBP = 00002020, ESI = 00005555, EDI = 00006666에서 시작한다.

```asm
    push 30
    push 20
    push 10
    call R

R PROC
    push ebp
    mov  ebp,esp
    sub  esp,4
    push esi
    push edi
    mov  esi,[ebp+8]
    mov  edi,[ebp+16]
    mov  [ebp-4],esi
    add  [ebp-4],edi
    mov  eax,[ebp-4]
    pop  edi
    pop  esi
    mov  esp,ebp
    pop  ebp
    ret  12
R ENDP
```

1. *인수:* `push` 세 번 → ESP = 1FF4. 1FFC에 30, 1FF8에 20, 1FF4에 10.
2. *호출:* ______
3. *기준 세우기:* ______
4. *아래쪽:* `sub esp,4` → ESP = 1FE8. `push esi` → 1FE4. `push edi` → 1FE0.
5. *그림:* (`mov eax,[ebp-4]`까지 실행한 뒤) ______
6. *걷기:* `pop edi` → ESP = 1FE4. `pop esi` → 1FE8. `mov esp,ebp` → 1FEC. `pop ebp` → 1FF0. `ret 12` → 2000.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. `call R` → ESP = 1FF0, 거기에 복귀 주소.
3. `push ebp` → ESP = 1FEC, 거기에 00002020. `mov ebp,esp` → EBP = 1FEC.<br>
5.
```
   주소        든 값                  EBP에서 본 자리
 00001FFC   0000001E  (30)            [EBP+16]
 00001FF8   00000014  (20)            [EBP+12]
 00001FF4   0000000A  (10)            [EBP+8]
 00001FF0   복귀 주소                 [EBP+4]
 00001FEC   00002020                  [EBP]      ← EBP
 00001FE8   00000028  (지역 변수 40)  [EBP-4]
 00001FE4   00005555  (맡아 둔 ESI)   [EBP-8]
 00001FE0   00006666  (맡아 둔 EDI)   [EBP-12]   ← ESP
```
`[ebp+8]`은 마지막에 넣은 10, `[ebp+16]`은 처음 넣은 30이다. 지역 변수에는 10 + 30 = 40이 들어가고 EAX = 40이다. 돌아온 뒤 ESI = 00005555, EDI = 00006666으로 처음 값이다. 꺼내는 순서(`edi`, `esi`)가 넣은 순서(`esi`, `edi`)의 거꾸로라서 그렇다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [44_stack-frame-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/44_stack-frame-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

ESP = 0012FF80, EBP = 0012FF94에서 시작한다. (a) `mov [ebp-4],eax`까지 실행한 순간의 스택 프레임을 주소, 든 값, EBP에서 본 자리로 그려라. (b) 끝에서 EAX의 값은? (c) `leave`, `ret`, `add esp,8` 각각의 뒤에 ESP는? (d) 이 코드는 어느 호출 규약인가? 근거 둘을 대라.

```asm
    push 2
    push 8
    call Q
    add  esp,8

Q PROC
    enter 4,0
    mov  eax,[ebp+8]
    add  eax,[ebp+12]
    mov  [ebp-4],eax
    add  eax,[ebp-4]
    leave
    ret
Q ENDP
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) `push 2` → 0012FF7C. `push 8` → 0012FF78. `call Q` → 0012FF74. `enter 4,0`은 `push ebp`(0012FF70), `mov ebp,esp`(EBP = 0012FF70), `sub esp,4`(ESP = 0012FF6C)를 한 번에 한다.
```
   주소        든 값                  EBP에서 본 자리
 0012FF7C   00000002                  [EBP+12]
 0012FF78   00000008                  [EBP+8]
 0012FF74   복귀 주소                 [EBP+4]
 0012FF70   0012FF94                  [EBP]      ← EBP
 0012FF6C   0000000A  (지역 변수 10)  [EBP-4]    ← ESP
```
(b) EAX = 8 + 2 = 10, 지역 변수에 10을 적고, 다시 더해 EAX = 20.<br>
(c) `leave` → ESP = 0012FF74(EBP는 0012FF94로 돌아온다). `ret` → 0012FF78. `add esp,8` → 0012FF80. 처음 값과 같다.<br>
(d) C 규약이다. 프로시저가 `ret n`이 아니라 `ret`으로 끝나고, 부른 쪽이 `call` 다음 줄에서 `add esp,8`로 인수를 치운다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [44_stack-frame-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/44_stack-frame-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제, 시작 주소, 수치는 원본에 없다. 슬라이드의 스택 그림(wk10-3-3 p.12, wk11-2-1 p.7)과 코드(wk11-2-1 p.2, p.11)를 연습하도록 만들었고, 답은 문제 코드로 확인했다.
{% endraw %}
