---
layout: "note"
title: "JMP와 LOOP"
display_title: "JMP와 LOOP"
kind: "concept"
kind_label: "기법"
num: "24"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["JMP", "LOOP", "무조건 점프", "Unconditional Jump", "횟수 반복", "Counting Loop", "상대 오프셋", "Relative Offset", "중첩 루프", "Nested Loop"]
description: "프로그램은 위에서 아래로 한 줄씩 읽힌다. 책을 읽다가 \"37쪽으로 가시오\"를 만나면 그쪽으로 넘어가듯, 다음에 읽을 줄을 바꿔 주는 명령이 둘 있다. 하나는 따지지 않고 무조건 넘어가고, 다른 하나는 남은 횟수를 하나 줄인 뒤 0이 아니면 넘어가서 같은 줄들을 정해진 횟수만큼 되…"
prev_url: "/studies/assembly-language/indirect-addressing/"
prev_title: "간접 피연산자와 인덱스 피연산자"
next_url: "/studies/assembly-language/runtime-stack/"
next_title: "런타임 스택과 PUSH·POP"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/jmp-loop/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로그램은 위에서 아래로 한 줄씩 읽힌다. 책을 읽다가 "37쪽으로 가시오"를 만나면 그쪽으로 넘어가듯, 다음에 읽을 줄을 바꿔 주는 명령이 둘 있다. 하나는 따지지 않고 무조건 넘어가고, 다른 하나는 남은 횟수를 하나 줄인 뒤 0이 아니면 넘어가서 같은 줄들을 정해진 횟수만큼 되풀이한다. 횟수를 세는 칸이 하나뿐이라, 처음에 0을 넣으면 한 번도 안 도는 것이 아니라 40억 번 넘게 돌고, 반복 안에 반복을 넣을 때는 바깥 횟수를 다른 곳에 치워 둬야 한다.

</div>


## 예시로 보기

배열의 수 네 개를 더하려면 "더하기"를 네 번 쓰면 된다. 수가 천 개면 천 줄을 쓸 수는 없다. 같은 줄로 되돌아가는 명령이 필요하다.

CPU는 다음에 읽을 명령의 주소를 `EIP`라는 칸([x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/))에 적어 둔다. 보통은 명령 하나를 읽을 때마다 그다음 주소로 넘어간다. `JMP`는 이 칸에 다른 주소를 써넣는다[^1].

```asm
top:
    .
    .
    jmp top        ; EIP ← top의 주소. 조건 없이 되돌아간다
```

`top:`처럼 이름 뒤에 쌍점을 붙인 것은 그 줄의 주소에 붙인 이름표(레이블)다. 위 코드는 빠져나갈 길이 없어 끝없이 돈다. 정해진 횟수만 돌려면 `LOOP`를 쓴다[^2].

```asm
    mov ax,0
    mov ecx,5      ; 다섯 번 돈다
L1: add ax,cx
    loop L1        ; ECX를 1 줄이고, 0이 아니면 L1로
```

| 실행한 줄 | AX | ECX | 다음 |
|---|---|---|---|
| `add ax,cx` | 0005h | 5 | |
| `loop L1` | 0005h | 4 | L1로 |
| `add ax,cx` | 0009h | 4 | |
| `loop L1` | 0009h | 3 | L1로 |
| `add ax,cx` | 000Ch | 3 | |
| `loop L1` | 000Ch | 2 | L1로 |
| `add ax,cx` | 000Eh | 2 | |
| `loop L1` | 000Eh | 1 | L1로 |
| `add ax,cx` | 000Fh | 1 | |
| `loop L1` | 000Fh | 0 | 아래로 빠진다 |

$$5 + 4 + 3 + 2 + 1 = 15$$, 16진수로 0Fh다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적, Your turn 두 답(10, 4,294,967,296), 상대 오프셋 계산, 배열 합 0A00h, 문자열 복사 26바이트, 중첩 루프 2,000번, 카드 C1·C3 — [24_jmp-loop_verify.py](/Hongs_Blog/studies/assembly-language/code/24_jmp-loop_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 정의

**JMP.** `JMP 목적지`는 조건 없이 목적지 레이블로 넘어간다. 하는 일은 $$\text{EIP} \leftarrow \text{목적지}$$ 하나다(화살표는 "오른쪽 값을 왼쪽 칸에 넣는다"로 읽는다). 목적지는 보통 같은 프로시저 안의 레이블이다. 프로시저 밖으로 뛰려면 전역 레이블이어야 한다[^1]. 레이블이 어디까지 보이는지는 [레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)에 있다.

**LOOP.** `LOOP 목적지`는 두 일을 이 순서로 한다[^2].

1. $$\text{ECX} \leftarrow \text{ECX} - 1$$
2. $$\text{ECX} \ne 0$$이면 목적지로 넘어간다. 0이면 바로 아래 줄로 간다.

먼저 줄이고 나서 0인지 본다. 이 순서가 아래 Your turn의 답을 정한다.

**상대 오프셋.** 기계어 속의 `LOOP`에는 목적지 주소가 통째로 들어 있지 않다. 어셈블러가 "LOOP 바로 다음 명령의 주소에서 목적지까지 몇 바이트 떨어졌는가"를 계산해 그 거리만 넣는다. 이 거리를 상대 오프셋(relative offset)이라 부른다. CPU는 실행할 때 이 값을 EIP에 더한다[^2].

$$\text{상대 오프셋} = \text{목적지 주소} - \text{LOOP 다음 명령의 주소}$$


위 예제를 어셈블한 목록이다[^3].

```
오프셋     기계어          소스
00000000  66 B8 0000     mov ax,0
00000004  B9 00000005    mov ecx,5
00000009  66 03 C1       L1: add ax,cx
0000000C  E2 FB          loop L1
0000000E
```

`loop L1`의 기계어는 `E2 FB` 두 바이트다. 뒤의 `FB`가 상대 오프셋이다. FBh를 부호 있는 8비트로 읽으면 −5다([정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)). LOOP 다음 명령의 주소 0000000Eh에 −5를 더하면 00000009h, 곧 `L1`이다. 식에 넣어 보면 $$9 - 14 = -5$$다.

## 예제

**Your turn 1.** AX의 마지막 값은?[^4]

```asm
    mov ax,6
    mov ecx,4
L1:
    inc ax
    loop L1
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="10"}
10. 몸통이 네 번 돌아 $$6 + 4 = 10$$이다.

</details>


**Your turn 2.** 이 루프는 몇 번 도는가?[^4]

```asm
    mov ecx,0
X2:
    inc ax
    loop X2
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

4,294,967,296번($$2^{32}$$번). `LOOP`는 먼저 줄인다. 0에서 1을 빼면 32비트 칸에서는 FFFFFFFFh가 된다. 0이 아니므로 되돌아가고, 거기서부터 0이 될 때까지 4,294,967,295번을 더 줄여야 한다[^s1].

</details>


**배열의 합.** 16비트 정수 배열을 처음부터 끝까지 더한다. 주소를 레지스터에 넣고 한 칸씩 옮겨 가는 방식은 [간접 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)에서 본 것이다[^5].

```asm
.data
intarray WORD 100h,200h,300h,400h
.code
    mov edi,OFFSET intarray     ; 배열의 주소
    mov ecx,LENGTHOF intarray   ; 횟수 = 원소 수 4
    mov ax,0                    ; 합을 0으로
L1:
    add ax,[edi]                ; 원소 하나를 더한다
    add edi,TYPE intarray       ; 다음 원소로 (2바이트 뒤)
    loop L1
```

AX는 0100h → 0300h → 0600h → 0A00h로 바뀐다. 횟수와 건너뛸 크기를 4, 2라고 직접 쓰지 않고 [LENGTHOF와 TYPE](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/)으로 쓴 덕에, 배열을 고쳐도 코드는 그대로다.

**문자열 복사.** 인덱스로 같은 자리의 글자를 하나씩 옮긴다[^6].

```asm
.data
source BYTE "This is the source string",0
target BYTE SIZEOF source DUP(0)
.code
    mov esi,0                   ; 인덱스
    mov ecx,SIZEOF source       ; 횟수 = 26 (글자 25개 + 끝의 0)
L1:
    mov al,source[esi]          ; 글자 하나를 꺼내
    mov target[esi],al          ; 같은 자리에 넣는다
    inc esi
    loop L1
```

메모리에서 메모리로 한 번에 옮기는 `MOV`는 없어서 AL을 거친다([데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/)).

**반복 안의 반복.** 안쪽 루프도 ECX를 쓴다. 그래서 안쪽으로 들어가기 전에 바깥 횟수를 다른 곳에 옮겨 두고, 나와서 되돌린다. 바깥 100번, 안쪽 20번이면 안쪽 몸통은 2,000번 돈다[^7].

```asm
.data
count DWORD ?
.code
    mov ecx,100         ; 바깥 횟수
L1:
    mov count,ecx       ; 바깥 횟수를 치워 둔다
    mov ecx,20          ; 안쪽 횟수
L2: .
    .
    loop L2
    mov ecx,count       ; 바깥 횟수를 되돌린다
    loop L1
```

치워 두지 않으면 어떻게 될까? 안쪽 루프가 끝날 때 ECX는 0이다. 바깥 `loop L1`이 이것을 1 줄여 FFFFFFFFh로 만들고 되돌아간다. 매번 같은 일이 벌어져 끝나지 않는다[^s1]. 변수 대신 스택에 치워 두는 방법(`push ecx` … `pop ecx`)은 [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/)에 있다[^8].

## 활용

- 이 기법을 떠올릴 신호: 돌 횟수를 시작 전에 안다(배열 길이, 문자열 크기). 횟수를 모르고 조건으로 멈춰야 하면 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)나 [조건부 반복 명령](/Hongs_Blog/studies/assembly-language/conditional-loop-instructions/)을 쓴다.
- 흔한 실수: ECX가 0일 수 있는데 그대로 `LOOP`에 들어간다. 빈 배열에서 40억 번을 돈다. 들어가기 전에 ECX가 0이면 건너뛰는 `JECXZ`가 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)에 있다.
- 흔한 실수: 몸통 안에서 ECX를 다른 일에 쓴다. 횟수가 망가진다.
- 흔한 실수: 다음 원소로 갈 때 원소 크기를 틀린다. WORD 배열에서 `inc edi`를 쓰면 1바이트만 움직여 두 원소에 걸친 값을 읽는다.
- Java의 `for (int i = 5; i > 0; i--)`가 하는 일을 `LOOP` 한 줄이 한다. 다만 `for`는 돌기 전에 조건을 보고, `LOOP`는 몸통을 한 번 돈 뒤에 본다([제어문](/Hongs_Blog/studies/java/java-control-flow/)의 `do-while`과 같은 꼴이다)[^s1].

## 연결

- 선수: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)(EIP, ECX), [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)
- 조건이 붙은 점프와 반복: [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/), [조건부 반복 명령](/Hongs_Blog/studies/assembly-language/conditional-loop-instructions/)
- `if`와 `while`을 점프로 만들기: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)
- 연습: [LOOP로 배열 돌기 예제 사다리](/Hongs_Blog/studies/assembly-language/array-loop-ladder/)
- 컴파일러가 만드는 중간 코드의 `goto`가 `JMP`다: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 코드가 끝났을 때 AX와 ECX의 값은? `mov ax,0` / `mov ecx,3` / `L1: add ax,cx` / `add ax,cx` / `loop L1`</summary>

**답:** AX = 12(000Ch), ECX = 0.<br>
**이유:** 한 바퀴에 CX를 두 번 더한다. $$2 \times (3 + 2 + 1) = 12$$다. `LOOP`가 ECX를 0으로 만든 순간 아래로 빠진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov ecx,0` 뒤에 바로 `LOOP`가 있는 루프는 왜 0번이 아니라 $$2^{32}$$번 도는가?</summary>

**답:** `LOOP`는 0인지 보기 전에 먼저 1을 줄인다. 0에서 1을 줄이면 FFFFFFFFh가 되고, 이것은 0이 아니라서 되돌아간다. 다시 0이 되려면 $$2^{32}$$번을 줄여야 한다.<br>
**이유:** "ECX가 0이면 안 돈다"고 읽는 오답이 많다. 검사는 줄인 뒤의 값에 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `loop L1`(2바이트)이 주소 0000001Ah에 있고 `L1`이 00000010h에 있다. 기계어에 들어가는 상대 오프셋을 16진수 한 바이트로 쓰라.</summary>

**답:** F4h.<br>
**이유:** LOOP 다음 명령의 주소는 $$\text{1Ah} + 2 = \text{1Ch}$$다. $$\text{10h} - \text{1Ch} = -12$$이고, −12를 8비트 2의 보수로 쓰면 F4h다. LOOP 자신의 주소 1Ah에서 재서 F6h라고 쓰면 틀린다.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-3」, p.16 (JMP의 문법과 동작, 전역 레이블)
[^2]: 같은 자료, p.17 (LOOP의 문법과 동작, 상대 오프셋)
[^3]: 어셈블리어 6회 강의 자료 「wk06-chapt_04-3-1」, p.1 (5+4+3+2+1 예제의 오프셋·기계어 목록, 0000000E + FB)
[^4]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-3」, p.18 (Your turn, 답 10과 4,294,967,296)
[^5]: 어셈블리어 6회 강의 자료 「wk06-chapt_04-3-1」, p.3 (정수 배열의 합)
[^6]: 같은 자료, p.4 (문자열 복사)
[^7]: 같은 자료, p.2 (중첩 루프, count 변수에 저장)
[^8]: 어셈블리어 6회 강의 자료 「wk06-chapt_05-3-2」, p.11~12 (중첩 루프에서 push ecx, pop ecx)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 추적 표, Your turn 2의 풀이(FFFFFFFFh가 되는 과정), 바깥 횟수를 치워 두지 않을 때의 동작, 활용 항목, `for`·`do-while`과의 견줌, 카드 C1~C3은 원본에 없다. 값은 검증 코드의 파이썬 흉내로 확인했다. LOOP의 동작은 원본 p.17의 Logic 두 줄을 그대로 따랐다.
{% endraw %}
