---
layout: "note"
title: "호출 규약"
display_title: "호출 규약 (Calling Convention)"
kind: "concept"
kind_label: "정의"
num: "43"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Calling Convention", "C 호출 규약", "cdecl", "STDCALL", "stdcall", "RET n", "스택 정리", "Stack Cleanup", "호출자 정리", "피호출자 정리"]
description: "프로시저를 부르는 쪽과 불리는 쪽이 미리 맞춰 두는 약속이다. 식당에서 다 먹은 그릇을 손님이 치우는지 직원이 치우는지 정해 두는 것과 같다. 스택에 쌓아 넘긴 값을 부른 쪽이 치우는 방식과 불린 쪽이 돌아가면서 치우는 방식이 있고, 어느 쪽이든 한쪽이 정확히 한 번 치우면 된다.…"
prev_url: "/studies/assembly-language/stack-parameters/"
prev_title: "스택 매개변수"
next_url: "/studies/assembly-language/local-variables/"
next_title: "지역 변수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/calling-convention/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로시저를 부르는 쪽과 불리는 쪽이 미리 맞춰 두는 약속이다. 식당에서 다 먹은 그릇을 손님이 치우는지 직원이 치우는지 정해 두는 것과 같다. 스택에 쌓아 넘긴 값을 부른 쪽이 치우는 방식과 불린 쪽이 돌아가면서 치우는 방식이 있고, 어느 쪽이든 한쪽이 정확히 한 번 치우면 된다. 양쪽이 서로 다른 약속을 믿으면 아무도 안 치우거나 둘 다 치워서 스택이 어긋나고, 그 뒤의 복귀가 모두 틀어진다.

</div>


## 예시로 보기

[스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)로 인수 둘(8바이트)을 넣고 `AddTwo`를 불렀다. 프로시저가 `ret`으로 돌아오면 복귀 주소는 꺼내졌지만 인수 둘은 스택에 그대로 남는다. 이대로 반복문에서 100번 부르면 스택이 800바이트 줄어든 채로 남는다. 누군가는 ESP를 8만큼 올려 줘야 한다.

치우는 사람이 누구냐에 따라 두 방식이 있다.

```asm
; C 방식: 부른 쪽이 치운다          ; STDCALL 방식: 불린 쪽이 치운다
    push val2                           push val2
    push val1                           push val1
    call AddTwo                         call AddTwo
    add  esp,8      ; 여기서 치운다

AddTwo PROC                         AddTwo PROC
    push ebp                            push ebp
    mov  ebp,esp                        mov  ebp,esp
    mov  eax,[ebp+12]                   mov  eax,[ebp+12]
    add  eax,[ebp+8]                    add  eax,[ebp+8]
    pop  ebp                            pop  ebp
    ret                                 ret  8      ; 여기서 치운다
AddTwo ENDP                         AddTwo ENDP
```

`val1` = 5, `val2` = 6, ESP = 00001000h에서 시작했을 때 끝부분의 ESP다[^s1].

| 방식 | `pop ebp` 뒤 | `ret` 또는 `ret 8` 뒤 | `add esp,8` 뒤 |
|---|---|---|---|
| C | 00000FF4 | 00000FF8 (`ret`) | 00001000 |
| STDCALL | 00000FF4 | 00001000 (`ret 8`) | (없음) |

두 방식 모두 EAX = 11을 돌려주고 ESP가 처음 값으로 돌아온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 방식의 명령별 ESP, 아무도 안 치울 때(0FF8h)와 둘 다 치울 때(1008h), 100번 호출에 800바이트, Difference의 EAX = 16 — [43_calling-convention_verify.py](/Hongs_Blog/studies/assembly-language/code/43_calling-convention_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

**RET n.** `RET`은 스택 꼭대기의 값을 꺼내 명령 포인터(EIP)에 넣어 그 주소로 돌아간다. 뒤에 수 $$n$$을 붙이면 복귀 주소를 꺼낸 다음 ESP에 $$n$$을 더한다. 인수 $$n$$바이트를 한 번에 치우는 것이다.

$$\texttt{RET}\ n: \quad \mathrm{EIP} \leftarrow [\mathrm{ESP}], \qquad \mathrm{ESP} \leftarrow \mathrm{ESP} + 4 + n$$


화살표는 "오른쪽 값을 왼쪽에 넣는다"는 뜻이다. 4는 꺼낸 복귀 주소의 크기, $$n$$은 치울 인수의 바이트 수다. 4바이트 인수가 둘이면 $$n = 8$$이다.

**두 가지 규약.** 여기서 다루는 규약은 둘이다.

| | C 규약 | STDCALL 규약 |
|---|---|---|
| 인수를 치우는 쪽 | 부른 쪽 | 불린 프로시저 |
| 치우는 명령 | `call` 다음 줄의 `add esp,n` | 프로시저 끝의 `ret n` |
| 프로시저의 끝 | `ret` | `ret n` |
| 치우는 코드가 놓이는 곳 | 호출하는 자리마다 | 프로시저 안에 한 번 |

어느 규약을 쓸지는 프로그램 맨 앞의 `.model` 지시어가 정한다. [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/)의 `.model flat,stdcall`은 STDCALL 규약을 고른다.

## 예제

**Difference.** 첫째 인수를 둘째 인수에서 빼는 프로시저를 만든다.

```asm
    push 14               ; 첫째 인수
    push 30               ; 둘째 인수
    call Difference       ; EAX = 16

Difference PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp + 8]    ; 둘째 인수 (30)
    sub  eax,[ebp + 12]   ; 첫째 인수 (14)
    pop  ebp
    ret  8
Difference ENDP
```

`ret 8`로 끝나므로 STDCALL 방식이다. 여기서는 첫째 인수를 먼저 넣었다. 그래서 나중에 넣은 둘째 인수가 `[ebp+8]`에 있다. 앞의 `AddTwo`는 반대로 `val2`를 먼저 넣어 `val1`이 `[ebp+8]`에 있었다. 인수를 넣는 순서도 양쪽이 맞춰야 하는 약속이다[^s1].

**약속이 어긋나면.** 같은 `AddTwo` 호출에서 치우는 줄을 빼거나 겹치게 넣고 흉내 냈다[^s1].

| 상황 | 돌아온 뒤 ESP | 결과 |
|---|---|---|
| 한쪽만 치운다 (정상) | 00001000 | 처음 값과 같다 |
| 아무도 안 치운다 (`ret`만, `add esp,8` 없음) | 00000FF8 | 호출마다 8바이트가 남는다 |
| 둘 다 치운다 (`ret 8`과 `add esp,8`) | 00001008 | 부른 쪽이 쌓아 둔 다른 값 8바이트가 버려진다 |

ESP가 어긋난 채로 부른 쪽 프로시저가 자기 `ret`에 닿으면, 꼭대기에 있는 것은 복귀 주소가 아닌 다른 값이다.

## 활용

- C 방식은 호출하는 자리마다 넣은 인수의 수를 알고 치우므로, 인수의 수가 호출마다 달라도 된다. STDCALL 방식은 치우는 코드가 프로시저 안에 한 번만 있어 프로그램이 짧아지지만, 프로시저가 `ret n`의 $$n$$을 하나로 못 박으므로 인수의 수가 늘 같아야 한다[^s1].
- [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)를 쓰면 어셈블러가 규약에 맞춰 인수를 넣고 치우는 코드를 만들어 준다.
- 컴파일러는 함수 호출마다 이 약속대로 코드를 만든다. 서로 다른 컴파일러나 언어로 만든 코드가 서로를 부를 수 있는 것은 같은 규약을 따르기 때문이다[^s1]. [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- 흔한 실수: `ret n`의 $$n$$에 인수의 개수를 쓴다(바이트 수를 써야 한다. 인수 둘이면 2가 아니라 8). 프로시저를 `ret 8`로 고쳐 놓고 호출 자리의 `add esp,8`을 그대로 둔다.
- 연습: [스택 프레임 그리기 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-frame-ladder/)

## 연결

- 선수: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/), [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/). `RET`의 기본 동작: [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/)
- `.model flat,stdcall`이 적힌 자리: [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/)
- 컴파일러 과목은 같은 약속을 "부르는 쪽이 할 일"과 "불린 쪽이 할 일"로 나눠 코드를 만든다. 거기서는 인수를 넣고 치우는 일, 복귀 주소와 프레임 포인터를 맡는 일을 양쪽에 나눠 준다: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- 재귀에서는 `ret 4`가 호출마다 인수 하나를 치운다: [재귀 프로시저](/Hongs_Blog/studies/assembly-language/recursive-procedure/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `RET 8`이 하는 일을 순서대로 쓰라. C 규약과 STDCALL 규약에서 인수를 치우는 쪽과 명령은 각각 무엇인가?</summary>

**답:** 스택 꼭대기의 복귀 주소를 꺼내 EIP에 넣고(ESP + 4), 이어서 ESP에 8을 더한다. C 규약: 부른 쪽이 `call` 다음에 `add esp,n`. STDCALL 규약: 불린 프로시저가 `ret n`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 프로시저 `Sum3`이 `ret 12`로 끝난다. 호출 코드 (가) `push 1 / push 2 / push 3 / call Sum3`과 (나) 같은 코드 뒤에 `add esp,12`를 붙인 것 가운데 어느 쪽이 맞는가? 틀린 쪽에서 ESP는 처음 값보다 얼마나 어긋나는가?</summary>

**답:** (가)가 맞다. `ret 12`가 이미 인수 12바이트를 치운다. (나)는 12바이트를 한 번 더 올려서 ESP가 처음 값보다 12 커진다. 부른 쪽이 그 전에 스택에 넣어 둔 값 세 칸이 버려진다.<br>
**이유:** 인수는 정확히 한 번 치워야 한다. 프로시저의 끝이 `ret n`이면 STDCALL, `ret`이면 C다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 아무도 인수를 치우지 않아도 프로시저는 올바른 값을 돌려주고 `call` 다음 줄로 잘 돌아온다. 그런데 왜 문제인가?</summary>

**답:** 호출 한 번마다 인수 크기만큼 ESP가 낮아진 채로 남는다. 반복해서 부르면 스택이 계속 줄어든다(8바이트 인수로 100번 부르면 800바이트). 그리고 그 호출을 한 프로시저가 자기 `ret`에 닿았을 때 꼭대기에 남은 인수를 복귀 주소로 꺼내게 된다.<br>
**이유:** `ret`은 꼭대기에 무엇이 있든 그것을 주소로 쓴다. 프로시저에 들어올 때와 나갈 때 ESP가 같아야 복귀 주소가 꼭대기에 온다[^s1].

</details>


[^s1]: 실행 결과는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
{% endraw %}
