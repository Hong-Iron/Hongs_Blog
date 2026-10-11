---
layout: "note"
title: "런타임 스택과 PUSH·POP"
display_title: "런타임 스택과 PUSH·POP (Runtime Stack)"
kind: "concept"
kind_label: "자료구조"
num: "25"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Runtime Stack", "런타임 스택", "실행 스택", "PUSH", "POP", "스택 포인터", "Stack Pointer", "ESP", "SS", "PUSHFD", "POPFD", "PUSHAD", "POPAD", "PUSHA", "POPA", "LIFO"]
description: "식당에 쌓아 둔 접시는 맨 위에만 올리고 맨 위에서만 집는다. 프로그램도 실행하는 동안 메모리 한 구역을 이렇게 쓴다. 잠깐 치워 둘 값을 맨 위에 올리고, 필요할 때 맨 위부터 도로 가져온다. 올린 순서의 거꾸로만 꺼낼 수 있어서, 여러 값을 치워 뒀다면 반드시 거꾸로 꺼내야 제…"
prev_url: "/studies/assembly-language/jmp-loop/"
prev_title: "JMP와 LOOP"
next_url: "/studies/assembly-language/call-ret/"
next_title: "프로시저와 CALL·RET"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/runtime-stack/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

식당에 쌓아 둔 접시는 맨 위에만 올리고 맨 위에서만 집는다. 프로그램도 실행하는 동안 메모리 한 구역을 이렇게 쓴다. 잠깐 치워 둘 값을 맨 위에 올리고, 필요할 때 맨 위부터 도로 가져온다. 올린 순서의 거꾸로만 꺼낼 수 있어서, 여러 값을 치워 뒀다면 반드시 거꾸로 꺼내야 제자리로 돌아간다. 올린 만큼 꺼내지 않으면 그 뒤에 스택을 쓰는 모든 것이 어긋난다.

</div>


## 예시로 보기

레지스터는 여덟 개뿐이다. 계산하다 보면 "이 값은 잠깐 치워 두고 이 레지스터를 다른 데 쓰고 싶다"는 때가 온다. 치울 때마다 변수를 하나씩 만들면 이름이 끝없이 늘어난다. 이름 없이 올려 두고 도로 가져올 자리가 스택이다.

CPU는 스택의 맨 위가 어디인지를 `ESP`라는 레지스터 하나로 기억한다[^1]. 주소 00001000h에 값 00000006h가 맨 위로 놓여 있다. 여기에 000000A5h, 1, 2를 차례로 올린다[^2].

```
 주소        처음         push 0A5h    push 1       push 2
 00001000  [00000006]←ESP [00000006]   [00000006]   [00000006]
 00000FFC  [        ]     [000000A5]←ESP [000000A5] [000000A5]
 00000FF8  [        ]     [        ]   [00000001]←ESP [00000001]
 00000FF4  [        ]     [        ]   [        ]   [00000002]←ESP
 00000FF0  [        ]     [        ]   [        ]   [        ]
```

값을 올릴 때마다 ESP가 4씩 **줄어든다**. 접시는 위로 쌓이지만, 이 스택은 주소가 작은 쪽으로 자란다. 그림에서는 아래로 내려간다[^3].

이제 `pop eax`를 한다[^4].

```
 주소        pop eax 앞     pop eax 뒤
 00001000  [00000006]     [00000006]
 00000FFC  [000000A5]     [000000A5]
 00000FF8  [00000001]     [00000001]←ESP       EAX = 00000002
 00000FF4  [00000002]←ESP [00000002]  (값은 남아 있지만 이제 빈 칸으로 친다)
```

맨 위의 2가 EAX로 가고 ESP가 4 늘었다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 그림의 ESP와 칸 내용, 16비트 PUSH의 ESP 변화, 거꾸로 꺼내기, 문자열 뒤집기("!dlroW olleH"), PUSHFD·POPFD, PUSHAD 순서, 무작위 push·pop 300회를 파이썬 리스트와 비교, 카드 C2 — [25_runtime-stack_verify.py](/Hongs_Blog/studies/assembly-language/code/25_runtime-stack_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 정의

런타임 스택은 CPU가 레지스터 둘로 직접 관리하는 메모리 구역이다. `SS`(스택 세그먼트)는 구역이 어디인지를, `ESP`(스택 포인터)는 그 안에서 마지막으로 올린 값의 주소를 담는다[^1]. 맨 나중에 넣은 것이 맨 먼저 나온다(LIFO)[^5]. 일반적인 스택 자료구조는 [스택](/Hongs_Blog/studies/algorithms/stack/)에 있다. 여기서는 그 스택을 배열 대신 메모리와 ESP로 만든 것이다.

**PUSH.** 32비트 값을 올릴 때 ESP를 4 줄인 뒤, ESP가 가리키는 자리에 값을 복사한다[^2].

$$\text{ESP} \leftarrow \text{ESP} - 4, \qquad \text{메모리}[\text{ESP}] \leftarrow \text{값}$$


**POP.** ESP가 가리키는 자리의 값을 레지스터나 변수로 복사한다[^4]. 그런 다음 ESP를 4 늘린다[^s1].

$$\text{목적지} \leftarrow \text{메모리}[\text{ESP}], \qquad \text{ESP} \leftarrow \text{ESP} + 4$$


두 식에서 $$\text{메모리}[\text{ESP}]$$는 "ESP에 적힌 주소에 있는 4바이트"로 읽는다.

**쓸 수 있는 피연산자.**[^6]

| 명령 | 꼴 | 뜻 |
|---|---|---|
| `PUSH` | `PUSH r/m16`, `PUSH r/m32`, `PUSH imm32` | 16비트나 32비트 레지스터·메모리, 또는 32비트 상수 |
| `POP` | `POP r/m16`, `POP r/m32` | 16비트나 32비트 레지스터·메모리 |

8비트 값은 올릴 수 없다. 16비트 값을 올리면 ESP는 2만 줄어든다[^s1].

**표현 불변식.** 32비트 값만 올리고 내린다고 하자. 스택에 값이 $$k$$개 쌓여 있으면 언제나 다음이 맞다[^s1].

$$\text{ESP} = \text{ESP}_0 - 4k$$


$$\text{ESP}_0$$는 아무것도 올리기 전의 ESP다. ESP보다 주소가 작은 쪽은 늘 비어 있는 자리다(스택이 넘치지 않았다면)[^3].

**연산별 비용.**

| 연산 | 하는 일 | 시간 |
|---|---|---|
| `PUSH` | ESP − 4, 4바이트 쓰기 | $$O(1)$$ |
| `POP` | 4바이트 읽기, ESP + 4 | $$O(1)$$ |
| 맨 위 보기 | `mov eax,[esp]` | $$O(1)$$ |

**딸린 명령.**[^7]

| 명령 | 하는 일 |
|---|---|
| `PUSHFD` / `POPFD` | 플래그가 모인 레지스터 EFLAGS를 통째로 올리고 내린다 |
| `PUSHAD` | 32비트 범용 레지스터 여덟 개를 EAX, ECX, EDX, EBX, ESP, EBP, ESI, EDI 순서로 올린다 |
| `POPAD` | 같은 레지스터들을 거꾸로 순서로 내린다 |
| `PUSHA` / `POPA` | 16비트 레지스터에 같은 일을 한다 |

`PUSHAD`가 올리는 ESP 값은 `PUSHAD`를 하기 직전의 값이다[^s1].

### 거꾸로 꺼내면 제자리로 돌아온다

**주장.** 레지스터 $$R_1, R_2, \dots, R_n$$을 이 순서로 올리고, 그 사이에 올린 만큼만 내린 뒤, $$R_n, \dots, R_2, R_1$$ 순서로 내리면 모든 레지스터와 ESP가 올리기 전 값으로 돌아온다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

올리기 전의 ESP를 $$E$$, $$R_i$$의 값을 $$v_i$$라 하자. $$n$$에 대한 수학적 귀납법이다.
1. **$$n = 1$$.** `push R1` 뒤에는 ESP가 $$E - 4$$이고 그 자리에 $$v_1$$이 있다. — PUSH의 정의
2. 그 사이의 코드는 올린 만큼만 내린다. 그래서 끝났을 때 ESP는 다시 $$E - 4$$다. 이 코드가 내리는 값은 자기가 올린 값뿐이라 주소 $$E - 4$$의 칸은 건드리지 않는다. — 불변식 $$\text{ESP} = \text{ESP}_0 - 4k$$
3. `pop R1`은 주소 $$E - 4$$의 값 $$v_1$$을 $$R_1$$에 넣고 ESP를 $$E$$로 만든다. — POP의 정의
4. **$$n - 1$$에서 $$n$$으로.** `push R1` 뒤의 상태를 새 출발점(ESP가 $$E - 4$$)으로 보면, `push R2` … `push Rn`, 가운데 코드, `pop Rn` … `pop R2`는 레지스터 $$n - 1$$개짜리 경우다. 귀납 가정에 따라 $$R_2, \dots, R_n$$과 ESP($$E - 4$$)가 돌아온다. 이 구간 전체가 "올린 만큼만 내리는 코드"이므로 1~3단계를 $$R_1$$에 그대로 쓸 수 있다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계에서 "주소 $$E - 4$$의 칸은 건드리지 않는다"는 어디서 나오는가</summary>

PUSH는 늘 지금의 ESP보다 아래(작은 주소)에 쓴다. 가운데 코드가 도는 동안 ESP는 $$E - 4$$ 이하다. 올린 것보다 더 많이 내리지 않으니 $$E - 4$$보다 커지지 않는다. 그래서 쓰는 자리는 늘 $$E - 8$$ 이하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4단계에서 귀납 가정을 쓸 수 있는 까닭</summary>

증명은 ESP의 처음 값이 얼마인지에 기대지 않는다. $$E$$ 자리에 $$E - 4$$를 넣어도 같은 논증이 된다. 그래서 `push R1` 뒤의 상태를 출발점으로 삼아 레지스터 $$n - 1$$개의 경우를 그대로 가져온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

괄호 맞추기다. `push`를 여는 괄호, `pop`을 닫는 괄호로 보면 "거꾸로 내린다"는 괄호가 바르게 겹쳐 있다는 말이다. 가장 안쪽 쌍부터 차례로 지워도 바깥 쌍은 흐트러지지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

프로시저 호출이 겹칠 때 복귀 주소가 거꾸로 순서로 꺼내지는 것([프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/)), 재귀 호출이 돌아오는 순서([재귀 프로시저](/Hongs_Blog/studies/assembly-language/recursive-procedure/)), 파서가 스택에서 기호를 꺼내는 순서([LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/)).

</details>


## 예제

**레지스터를 치워 두고 되돌리기.** 중요한 값이 든 레지스터를 다른 일에 쓰기 전에 올려 두고, 끝나면 내린다. `PUSH`와 `POP`의 순서가 서로 거꾸로다[^8].

```asm
    push esi                    ; 올린다: esi, ecx, ebx
    push ecx
    push ebx

    mov esi,OFFSET dwordVal     ; 세 레지스터를 다른 일에 쓴다
    mov ecx,LENGTHOF dwordVal
    mov ebx,TYPE dwordVal
    call DumpMem

    pop ebx                     ; 내린다: ebx, ecx, esi
    pop ecx
    pop esi
```

**반복 안의 반복.** [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)에서는 바깥 횟수를 변수 `count`에 치워 뒀다. 스택을 쓰면 변수가 필요 없다[^9].

```asm
    mov ecx,100         ; 바깥 횟수
L1:
    push ecx            ; 바깥 횟수를 올려 둔다
    mov ecx,20          ; 안쪽 횟수
L2:
    ;
    loop L2
    pop ecx             ; 바깥 횟수를 내린다
    loop L1
```

**문자열 뒤집기.** 글자를 앞에서부터 하나씩 올리고, 다시 앞에서부터 하나씩 내려 채운다. 맨 나중에 올린 마지막 글자가 맨 먼저 나와 첫 자리에 들어간다[^10].

```asm
.data
aName BYTE "Hello World!",0
nameSize = ($ - aName) - 1      ; 12 (끝의 0은 뺀다)
.code
    mov ecx,nameSize
    mov esi,0
L1: movzx eax,aName[esi]        ; 글자 하나를 32비트로 넓혀서
    push eax                    ; 올린다
    inc esi
    loop L1

    mov ecx,nameSize
    mov esi,0
L2: pop eax                     ; 내려서
    mov aName[esi],al           ; 아래 8비트만 문자열에 넣는다
    inc esi
    loop L2
```

끝나면 `aName`은 `"!dlroW olleH"`다. 글자를 왜 EAX에 넣고 올릴까? 스택에는 16비트나 32비트 값만 올릴 수 있어서다[^11]. 그래서 [MOVZX](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)로 8비트 글자를 32비트로 넓힌다. 글자 12개가 48바이트를 차지한다.

**플래그 치워 두기.** `PUSHFD`와 `POPFD` 사이에서 플래그가 바뀌어도 내리면 되돌아온다. 쓰임새는 [조건부 반복 명령](/Hongs_Blog/studies/assembly-language/conditional-loop-instructions/)에 나온다.

**경계 사례.** 같은 순서로 내리면 값이 서로 바뀐다. `push eax` / `push ebx` / `pop eax` / `pop ebx`를 하면 EAX에 EBX의 옛 값이, EBX에 EAX의 옛 값이 들어간다[^s1].

## 활용

- 스택에 올라가는 것은 세 가지다. 프로시저에서 돌아갈 주소, 프로시저에 넘기는 값, 프로시저 안에서만 쓰는 변수다[^5]. 차례로 [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/)에서 다룬다.
- 변수에 치워 두기와 견주면: 변수는 이름이 있어 아무 때나 읽지만 자리를 늘 차지한다. 스택은 이름이 없고 순서를 지켜야 하지만, 쓰고 나면 자리가 저절로 돌아온다.
- 흔한 실수: 올린 개수와 내린 개수가 다르다. 프로시저 안에서 이러면 돌아갈 주소 대신 엉뚱한 값을 꺼낸다([프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/)의 실패 시나리오).
- 흔한 실수: 반복문 안에서 올리기만 한다. 한 바퀴에 4바이트씩 스택이 내려가 결국 넘친다.

## 연결

- 선수: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)(ESP, SS), [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/)
- 자료구조로서의 스택: [스택](/Hongs_Blog/studies/algorithms/stack/)
- 올린 값이 메모리에 놓이는 바이트 순서: [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/)
- 스택을 쓰는 프로시저 호출: [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)
- 프로그램 전체 메모리에서 스택이 놓이는 자리와 자라는 방향: [실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/), [활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/)
- 연습: [스택 추적 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-tracing-ladder/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"스택에 값을 올리면 ESP가 커진다"</div>

틀렸다. 올리면 ESP는 줄어든다. "쌓는다"는 말과 접시 그림 때문에 위로, 곧 큰 주소 쪽으로 자란다고 생각하기 쉽다. 실제로는 `PUSH`가 ESP에서 4를 빼고 그 자리에 쓴다. 확인하는 법: ESP가 00001000h일 때 `push eax`를 하면 값은 00000FFCh에 들어가고 ESP도 00000FFCh가 된다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"POP을 하면 그 칸의 값이 지워진다"</div>

틀렸다. `POP`은 값을 복사해 가고 ESP만 올린다. 칸에는 옛 값이 그대로 남는다. 다만 ESP 아래는 "비어 있는 자리"로 치므로, 다음 `PUSH`가 그 위에 덮어쓴다. 위 그림에서 `pop eax` 뒤에도 00000FF4h에는 2가 남아 있다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 32비트 `PUSH`와 `POP`이 ESP와 메모리에 하는 일을 순서까지 맞춰 쓰라.</summary>

**답:** `PUSH`: ESP를 4 줄인다 → ESP가 가리키는 자리에 값을 쓴다. `POP`: ESP가 가리키는 자리의 값을 목적지에 복사한다 → ESP를 4 늘린다.<br>
**이유:** 두 명령의 순서가 서로 거울처럼 뒤집혀 있어야, ESP가 늘 "마지막으로 올린 값"을 가리킨다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** ESP가 00001000h에서 시작한다. `push 5` / `push 7` / `pop eax` / `push 9` / `pop ebx` / `pop ecx`를 차례로 실행한 뒤 EAX, EBX, ECX, ESP는?</summary>

**답:** EAX = 7, EBX = 9, ECX = 5, ESP = 00001000h.<br>
**이유:** 7을 내린 자리(00000FF8h)에 9가 다시 올라갔다가 내려온다. 맨 처음 올린 5가 맨 나중에 나온다. 세 번 올리고 세 번 내렸으니 ESP는 처음 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 문자열 뒤집기에서 `push aName[esi]`라고 쓰지 않고 `movzx eax,aName[esi]` 뒤에 `push eax`를 하는 까닭은?</summary>

**답:** `aName`의 원소는 8비트인데 `PUSH`는 16비트나 32비트 값만 받는다. 그래서 8비트 글자를 32비트 레지스터로 넓혀서 올린다.<br>
**이유:** 내릴 때는 `pop eax`로 32비트를 받고 아래 8비트 `AL`만 문자열에 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "올린 개수만큼 내리기만 하면 레지스터가 모두 제자리로 돌아온다"가 틀리는 예를 들라.</summary>

**답:** `push eax` / `push ebx` / `pop eax` / `pop ebx`. 두 번 올리고 두 번 내렸지만 EAX와 EBX의 값이 서로 바뀐다.<br>
**이유:** 개수만 맞으면 ESP는 돌아온다. 값까지 돌아오려면 올린 순서의 거꾸로 내려야 한다.

</details>


[^1]: 어셈블리어 6회 강의 자료 「wk06-chapt_05-3-2」, p.5 (SS와 ESP, ESP가 00001000의 00000006을 가리키는 그림)
[^2]: 같은 자료, p.6~7 (PUSH의 동작, 000000A5·1·2를 올린 그림)
[^3]: 같은 자료, p.7 (스택은 아래로 자란다, ESP 아래는 늘 쓸 수 있다)
[^4]: 같은 자료, p.8 (POP의 동작과 앞뒤 그림)
[^5]: 같은 자료, p.4 (접시 더미, LIFO); 어셈블리어 7회 강의 자료 「wk07-chapt_05-3-1」, p.15 (스택이 담는 것: 복귀 주소, 매개변수, 지역 변수)
[^6]: 어셈블리어 6회 강의 자료 「wk06-chapt_05-3-2」, p.9 (PUSH와 POP의 문법)
[^7]: 같은 자료, p.17 (PUSHFD, POPFD, PUSHAD, POPAD, PUSHA, POPA)
[^8]: 같은 자료, p.10 (레지스터 저장과 복원, 거꾸로 순서)
[^9]: 같은 자료, p.11~12 (중첩 루프에서 push ecx, pop ecx)
[^10]: 같은 자료, p.13~15 (문자열 뒤집기)
[^11]: 같은 자료, p.16 (글자를 EAX에 넣는 이유)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본 p.8의 글은 POP이 값을 복사한다고만 적고, ESP가 4 늘어나는 것은 그림으로만 보인다. 16비트 PUSH가 ESP를 2 줄이는 것, PUSHAD가 올리는 ESP 값, 불변식, 비용 표, 거꾸로 꺼내기의 증명과 스스로 설명해 보기, 경계 사례, 활용 항목, 오해 두 가지, 카드 C1~C4는 원본에 없다. 동작은 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 PUSH, POP, PUSHAD 항목을 따랐고 값은 검증 코드의 파이썬 흉내로 확인했다. ASCII 그림은 원본 p.5~8의 그림을 옮긴 것이다.
{% endraw %}
