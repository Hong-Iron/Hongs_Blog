---
layout: "note"
title: "스택 매개변수"
display_title: "스택 매개변수 (Stack Parameters)"
kind: "concept"
kind_label: "기법"
num: "42"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Stack Parameters", "스택 인수", "값으로 전달", "Pass by Value", "참조로 전달", "Pass by Reference", "ArrayFill", "인수", "Argument"]
description: "프로시저에 넘길 값을 레지스터에 담는 대신 스택에 차례로 쌓아 놓고 부르는 방법이다. 값 자체를 쌓을 수도 있고, 값이 있는 곳의 주소를 쌓을 수도 있다. 값을 쌓으면 프로시저는 사본만 만지므로 원래 변수가 안전하고, 주소를 쌓으면 프로시저가 원래 변수나 큰 배열을 직접 읽고 고칠…"
prev_url: "/studies/assembly-language/stack-frame/"
prev_title: "스택 프레임"
next_url: "/studies/assembly-language/calling-convention/"
next_title: "호출 규약"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/stack-parameters/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로시저에 넘길 값을 레지스터에 담는 대신 스택에 차례로 쌓아 놓고 부르는 방법이다. 값 자체를 쌓을 수도 있고, 값이 있는 곳의 주소를 쌓을 수도 있다. 값을 쌓으면 프로시저는 사본만 만지므로 원래 변수가 안전하고, 주소를 쌓으면 프로시저가 원래 변수나 큰 배열을 직접 읽고 고칠 수 있다. 레지스터를 비워 두려고 맡겼다 되찾는 수고가 없어 편하지만, 쌓은 것은 누군가 반드시 치워야 하고 쌓는 순서를 양쪽이 똑같이 알고 있어야 한다.

</div>


## 예시로 보기

배열을 다루는 프로시저에 배열의 주소, 원소 수, 원소 크기를 넘긴다고 하자. 레지스터로 넘기면 ESI, ECX, EBX에 든 원래 값을 잃지 않으려고 앞뒤로 맡기고 되찾아야 한다. 스택으로 넘기면 세 줄이면 된다[^1].

```asm
; 레지스터로 넘기기               ; 스택으로 넘기기
pushad                            push TYPE array
mov esi,OFFSET array              push LENGTHOF array
mov ecx,LENGTHOF array            push OFFSET array
mov ebx,TYPE array                (프로시저를 부른다)
(프로시저를 부른다)
popad
```

`pushad`는 범용 레지스터 여덟 개를 한꺼번에 스택에 넣고 `popad`는 되찾는 명령이다. 슬라이드는 스택 쪽이 레지스터 쪽보다 편하다고 적는다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 값·참조로 넣은 뒤의 스택 내용, ArrayFill이 읽는 `[ebp+12]`와 `[ebp+8]`, 참조로 넘기면 원래 변수가 바뀌고 값으로 넘기면 안 바뀌는 것 — [42_stack-parameters_verify.py](/Hongs_Blog/studies/assembly-language/code/42_stack-parameters_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 값으로 넘기기와 참조로 넘기기

넘기는 순서는 두 방법이 같다. 인수를 스택에 넣는다. 프로시저를 부른다. 프로시저가 치우지 않았다면 돌아온 뒤 부른 쪽이 인수를 치운다[^2]. 다른 것은 스택에 무엇을 넣느냐다.

변수 둘이 데이터 구역 맨 앞에 있다고 하자. `val1`은 주소 00000000h에, `val2`는 00000004h에 있다[^3].

```asm
.data
val1 DWORD 5
val2 DWORD 6
```

| | 값으로 넘기기 | 참조로 넘기기 |
|---|---|---|
| 코드 | `push val2` / `push val1` | `push OFFSET val2` / `push OFFSET val1` |
| 스택에 쌓이는 것 | 변수에 든 값 | 변수의 주소 |
| 프로시저가 고치면 | 스택의 사본만 바뀐다 | 원래 변수가 바뀐다 |

ESP가 00001000h일 때 두 줄을 실행한 직후의 스택이다[^3].

```
   주소       값으로 넘겼을 때         참조로 넘겼을 때
 00000FFC   00000006  (val2의 값)    00000004  (val2의 주소)
 00000FF8   00000005  (val1의 값)    00000000  (val1의 주소)   ← ESP
```

여기서 `call`을 하면 복귀 주소가 그 아래에 하나 더 쌓이고 ESP는 복귀 주소를 가리킨다[^4]. 프로시저 안에서는 [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)의 방법대로 `[ebp+8]`, `[ebp+12]`로 읽는다. 슬라이드는 이것을 "EBP에서 일정한 거리로 스택 매개변수에 접근한다"고 적는다[^5].

참조로 받은 프로시저는 두 번에 걸쳐 읽는다. `[ebp+8]`에서 주소를 꺼내 레지스터에 넣고, 그 레지스터를 대괄호로 감싸 그 주소의 값을 읽는다. 두 변수의 값을 바꾸는 프로시저를 예로 든다[^s1].

```asm
Swap PROC
    push ebp
    mov  ebp,esp
    mov  esi,[ebp+8]      ; ESI = val1의 주소
    mov  edi,[ebp+12]     ; EDI = val2의 주소
    mov  eax,[esi]        ; EAX = val1의 값
    mov  ebx,[edi]        ; EBX = val2의 값
    mov  [esi],ebx        ; val1에 val2의 값을 쓴다
    mov  [edi],eax        ; val2에 val1의 값을 쓴다
    pop  ebp
    ret  8
Swap ENDP
```

위의 참조 코드로 부르면 `val1` = 6, `val2` = 5가 된다. 값으로 넘겼다면 프로시저는 스택에 있는 5와 6의 사본만 받으므로 원래 변수를 바꿀 길이 없다.

## 배열을 참조로 넘기기

배열은 통째로 스택에 넣기에는 크다. 그래서 시작 주소 하나와 원소 수를 넘긴다. `ArrayFill`은 16비트 정수 배열을 무작위 값으로 채우는 프로시저다[^6].

```asm
.data
count = 100
array WORD count DUP(?)
.code
    push OFFSET array      ; 배열의 주소
    push count             ; 원소 수
    call ArrayFill
```

```asm
ArrayFill PROC
    push ebp
    mov  ebp,esp
    pushad                 ; 레지스터 여덟 개를 맡긴다
    mov  esi,[ebp+12]      ; ESI = 배열의 주소
    mov  ecx,[ebp+8]       ; ECX = 원소 수
    ...
```

```
               든 값             EBP에서 본 자리
            배열의 주소           [EBP+12]
            원소 수 (count)       [EBP+8]
            복귀 주소             [EBP+4]
            부른 쪽의 EBP         [EBP]      ← EBP
            (pushad가 넣은 32바이트)
```

나중에 넣은 `count`가 `[ebp+8]`, 먼저 넣은 주소가 `[ebp+12]`다. `ArrayFill`은 배열의 이름을 모른 채로 배열을 다룬다. ESI가 배열의 시작을 가리키므로 반복문으로 원소를 하나씩 건너가면 된다[^7]. 이름이 아니라 주소를 받기 때문에 같은 프로시저로 어느 배열이든 채울 수 있다.

## 활용

- 값과 참조 가운데 고르는 기준[^s1].
    - 프로시저가 원래 변수를 고쳐야 하거나 결과를 여러 개 돌려줘야 하면 참조.
    - 배열이나 문자열처럼 크면 참조(4바이트 주소 하나만 넣는다).
    - 4바이트 이하의 값을 읽기만 하면 값.
- 고급 언어의 함수 인수가 이 방식으로 넘어간다. Java에서 배열을 메서드에 넘기면 메서드 안에서 고친 내용이 바깥에서도 보이는 것은 배열의 주소가 넘어가기 때문이다[^s1]. [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- 흔한 실수.
    - 참조로 받은 `[ebp+8]`을 값처럼 바로 쓴다. 거기 든 것은 주소다. 레지스터에 옮긴 뒤 `[esi]`로 한 번 더 읽어야 한다.
    - 넣는 순서를 헷갈린다. 나중에 넣은 것이 `[ebp+8]`이다.
    - 쌓은 인수를 아무도 치우지 않는다. → [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)
- `push`를 직접 쓰지 않고 한 줄로 부르는 지시어: [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)
- 연습: [스택 프레임 그리기 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-frame-ladder/)

## 연결

- 선수: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/). 레지스터로 넘기던 방법: [레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)
- 변수의 주소를 얻는 `OFFSET`: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/). 주소를 따라가 읽는 `[esi]`: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)
- 컴파일러가 인수를 넣는 코드를 만드는 법: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 값으로 넘기기와 참조로 넘기기에서 스택에 넣는 것은 각각 무엇인가? `val1 DWORD 5`가 주소 00000000h에 있을 때 `push val1`과 `push OFFSET val1`이 넣는 값을 쓰라.</summary>

**답:** 값으로 넘기면 변수에 든 값을, 참조로 넘기면 변수의 주소를 넣는다. `push val1`은 00000005h, `push OFFSET val1`은 00000000h를 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `push OFFSET array`, `push 100`, `call ArrayFill`을 하고 ArrayFill이 `push ebp`, `mov ebp,esp`를 마쳤다. `[ebp+4]`, `[ebp+8]`, `[ebp+12]`에 든 것을 차례로 쓰라.</summary>

**답:** `[ebp+4]` 복귀 주소, `[ebp+8]` 100(원소 수), `[ebp+12]` 배열의 주소.<br>
**이유:** 나중에 넣은 것일수록 EBP에 가깝다. 넣은 순서는 배열 주소 → 100 → 복귀 주소 → 옛 EBP다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 값으로 받은 매개변수를 프로시저 안에서 `mov [ebp+8],eax`로 고쳤다. 부른 쪽의 `val1`은 왜 그대로인가? `val1`을 고치려면 무엇을 넘겨야 하는가?</summary>

**답:** `[ebp+8]`은 스택에 있는 사본의 자리다. `push val1`이 `val1`의 값을 읽어 스택에 새로 썼으므로 두 자리는 서로 다른 메모리다. `val1`을 고치려면 `push OFFSET val1`로 주소를 넘기고, 프로시저가 그 주소를 레지스터에 옮겨 `mov [esi],eax`로 써야 한다.<br>
**이유:** `val1` = 5를 값으로 넘기고 사본에 100을 더하면 스택의 사본은 105가 되지만 `val1`은 5 그대로다[^s1].

</details>


[^1]: 어셈블리어 10회 강의 자료 「wk10-chapt_08-3-3」, p.5 (레지스터 방식과 스택 방식의 비교, "레지스터 매개변수보다 편하다"). 슬라이드에는 프로시저를 부르는 줄이 빠져 있다
[^2]: 같은 자료, p.6 (값으로 넘기기의 순서), p.8 (참조로 넘기기의 순서)
[^3]: 같은 자료, p.7 (값: 스택에 6, 5), p.9 (참조: 스택에 00000004, 00000000)
[^4]: 같은 자료, p.10 (CALL 뒤의 스택: val2, val1, 복귀 주소 ← ESP)
[^5]: 같은 자료, p.13 (EBP에서 일정한 거리로 접근한다, 예: `[ebp + 8]`)
[^6]: 같은 자료, p.11 (ArrayFill을 부르는 코드)
[^7]: 같은 자료, p.12 (ArrayFill의 앞부분과 스택 그림, "배열의 이름을 모르고도")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 주소가 적힌 스택 그림, Swap 프로시저, 고르는 기준, Java 배열과의 관계, 카드의 답은 원본에 없다. 시작 주소 00001000h는 설명용으로 정한 값이다. 실행 결과는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
{% endraw %}
