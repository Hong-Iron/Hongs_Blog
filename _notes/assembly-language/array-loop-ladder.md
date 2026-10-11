---
layout: "note"
title: "LOOP로 배열 돌기 예제 사다리"
display_title: "LOOP로 배열 돌기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "24"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: JMP와 LOOP, 간접 피연산자와 인덱스 피연산자, TYPE·LENGTHOF·SIZEOF 연산자."
prev_url: "/studies/assembly-language/ptr-little-endian-ladder/"
prev_title: "PTR과 리틀 엔디언 예제 사다리"
next_url: "/studies/assembly-language/stack-tracing-ladder/"
next_title: "스택 추적 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/array-loop-ladder/"
---
{% raw %}
사용 개념: [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/), [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/), [TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/).

"배열을 처음부터 끝까지 돌며 무엇을 하라"는 문제는 같은 하위목표의 되풀이다. ① 위치 준비: 배열의 주소나 인덱스 0을 레지스터에 넣는다 ② 횟수 준비: ECX에 원소 수를 넣는다 ③ 결과 자리 준비: 합을 담을 레지스터를 0으로 만든다(필요할 때) ④ 몸통: 원소 하나를 다룬다 ⑤ 다음 원소로: 위치를 원소 크기만큼 옮긴다 ⑥ 되풀이: `loop`[^s1].

모든 답은 파이썬 흉내로 확인했다. 실제 MASM으로 돌린 것이 아니다.

## 문제 1 · 완전한 풀이

16비트 정수 배열 `intarray WORD 100h,200h,300h,400h`의 합을 AX에 구한다[^1].

```asm
    mov edi,OFFSET intarray     ; ① 위치 준비: 배열의 주소
    mov ecx,LENGTHOF intarray   ; ② 횟수 준비: 4
    mov ax,0                    ; ③ 결과 자리 준비
L1:
    add ax,[edi]                ; ④ 몸통: 원소 하나를 더한다
    add edi,TYPE intarray       ; ⑤ 다음 원소로: 2바이트 뒤
    loop L1                     ; ⑥ 되풀이
```

AX는 0100h → 0300h → 0600h → 0A00h가 된다. 끝났을 때 EDI는 배열 시작에서 8바이트 뒤, ECX는 0이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [24_array-loop-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/24_array-loop-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

32비트 정수 배열 `nums DWORD 10,20,30,40,50`의 합을 EAX에 구한다. 이번에는 주소가 아니라 인덱스(ESI)를 쓴다.

```asm
    mov esi,0                   ; ① 위치 준비: 인덱스 0
    mov ecx,LENGTHOF nums       ; ② 횟수 준비: 5
    mov eax,0                   ; ③ 결과 자리 준비
L1:
    add eax,nums[esi]           ; ④ 몸통
    ______                      ; ⑤ 다음 원소로
    ______                      ; ⑥ 되풀이
```

끝났을 때 EAX의 값도 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    add esi,TYPE nums           ; ⑤ 4바이트 뒤
    loop L1                     ; ⑥
```
EAX = 150(96h). 끝났을 때 ESI = 20이다.<br>
⑤에 `inc esi`를 쓰면 틀린다. 1바이트씩만 밀려서 두 원소에 걸친 4바이트를 읽는다. 그렇게 돌리면 EAX는 150이 아니라 1414141Eh가 된다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

바이트 배열 `bytes BYTE 0F0h,20h,30h`의 합을 AX(16비트)에 구한다. 합이 255를 넘으므로 AL에는 담기지 않는다.

```asm
    mov esi,OFFSET bytes        ; ① 위치 준비
    ______                      ; ② 횟수 준비
    mov ax,0                    ; ③ 결과 자리 준비
L1:
    ______                      ; ④ 몸통 (두 줄): 8비트 원소를 16비트에 더한다
    ______
    ______                      ; ⑤ 다음 원소로
    loop L1                     ; ⑥ 되풀이
```

끝났을 때 AX의 값도 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    mov ecx,LENGTHOF bytes      ; ② 3
    movzx dx,BYTE PTR [esi]     ; ④ 8비트 원소를 16비트로 넓혀서
    add ax,dx                   ;    더한다
    inc esi                     ; ⑤ 원소가 1바이트라 1만 옮긴다
```
AX는 00F0h → 0110h → 0140h가 된다. 답은 0140h(320)다.<br>
`add ax,[esi]`라고 쓰면 16비트를 읽어 옆 원소까지 함께 더한다. `add al,[esi]`로 AL에 더하면 8비트를 넘친 올림이 사라져 40h만 남는다. 크기가 다른 값을 더할 때는 [MOVZX](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)로 먼저 넓힌다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [24_array-loop-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/24_array-loop-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

`src DWORD 1,2,3,4`와 `dst DWORD 4 DUP(0)`이 있다. `src`의 원소를 거꾸로 순서로 `dst`에 복사해 `dst`가 4, 3, 2, 1이 되게 하라. `LOOP`를 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    mov esi,0                       ; src는 앞에서부터
    mov edi,SIZEOF src - TYPE src   ; dst는 맨 뒤 원소부터: 16 - 4 = 12
    mov ecx,LENGTHOF src            ; 4번
L1:
    mov eax,src[esi]                ; 메모리에서 메모리로는 못 옮기니 EAX를 거친다
    mov dst[edi],eax
    add esi,TYPE src                ; 읽는 쪽은 뒤로
    sub edi,TYPE src                ; 쓰는 쪽은 앞으로
    loop L1
```
위치가 둘이라 ①과 ⑤가 두 줄씩이다. 마지막 원소의 인덱스는 "전체 크기 − 원소 하나의 크기"다. `SIZEOF src`(16)에서 시작하면 배열 바로 뒤를 가리켜 틀린다.<br>
끝났을 때 ESI = 16, EDI는 0에서 4를 한 번 더 빼 FFFFFFFCh다. 그 값으로 메모리를 읽지는 않으므로 문제없다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [24_array-loop-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/24_array-loop-ladder_p4/)</div>

</div>


[^1]: 어셈블리어 6회 강의 자료 「wk06-chapt_04-3-1」, p.3 (정수 배열의 합)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 하위목표 라벨과 문제 2~4는 원본에 없다. 슬라이드 p.3~4의 배열 합과 문자열 복사를 연습하도록 만들었고, 답은 문제 코드의 파이썬 흉내로 확인했다.
{% endraw %}
