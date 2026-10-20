---
layout: "note"
title: "지역 변수"
display_title: "지역 변수 (Local Variables)"
kind: "concept"
kind_label: "기법"
num: "44"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Local Variables", "스택 지역 변수", "ENTER", "LEAVE", "LOCAL 지시어", "LOCAL Directive", "LEA", "Load Effective Address"]
description: "프로시저가 도는 동안만 쓰고 버리는 메모지다. 프로시저에 들어오면서 스택 꼭대기를 필요한 만큼 아래로 내려 빈칸을 만들고, 나가면서 꼭대기를 제자리로 올려 한꺼번에 돌려준다. 호출마다 자기 칸을 새로 받으므로 다른 프로시저의 같은 이름 변수와 부딪히지 않고, 자기를 다시 불러도 값…"
prev_url: "/studies/assembly-language/calling-convention/"
prev_title: "호출 규약"
next_url: "/studies/assembly-language/offset-vs-lea/"
next_title: "OFFSET과 LEA 비교"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "44_local-variables_verify.py", "u": "/studies/assembly-language/code/44_local-variables_verify/", "r": "검증"}]
permalink: "/studies/assembly-language/local-variables/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로시저가 도는 동안만 쓰고 버리는 메모지다. 프로시저에 들어오면서 스택 꼭대기를 필요한 만큼 아래로 내려 빈칸을 만들고, 나가면서 꼭대기를 제자리로 올려 한꺼번에 돌려준다. 호출마다 자기 칸을 새로 받으므로 다른 프로시저의 같은 이름 변수와 부딪히지 않고, 자기를 다시 불러도 값이 섞이지 않는다. 다만 빈칸에는 앞서 누가 쓰다 남긴 값이 그대로 들어 있어서 쓰기 전에 직접 값을 넣어야 하고, 프로시저가 끝나면 그 칸은 더는 내 것이 아니다.

</div>


## 예시로 보기

`.data`에 만든 변수는 프로그램 어디서나 보이고 프로그램이 끝날 때까지 자리를 차지한다. 프로시저 안에서 잠깐 쓸 임시 값까지 거기 두면 이름이 겹치고, 프로시저가 자기를 다시 부를 때 같은 변수를 덮어쓴다.

C의 `int x = 10, y = 20;`처럼 4바이트 지역 변수 둘을 스택에 만든다.

```asm
MySub PROC
    push ebp
    mov  ebp,esp
    sub  esp,8                    ; 4바이트 변수 둘의 자리를 만든다
    mov  DWORD PTR [ebp-4],10     ; x = 10
    mov  DWORD PTR [ebp-8],20     ; y = 20
    ...
    mov  esp,ebp                  ; 지역 변수의 자리를 돌려준다
    pop  ebp
    ret
MySub ENDP
```

ESP = 00001000h, 부른 쪽의 EBP = 00001010h에서 `call MySub`를 하면 이렇게 바뀐다[^s1].

| 명령 | ESP | EBP | 일어난 일 |
|---|---|---|---|
| `call MySub` | 00000FFC | 00001010 | 복귀 주소를 넣는다 |
| `push ebp` | 00000FF8 | 00001010 | |
| `mov ebp,esp` | 00000FF8 | 00000FF8 | |
| `sub esp,8` | 00000FF0 | 00000FF8 | 두 칸이 생긴다 |
| `mov DWORD PTR [ebp-4],10` | 00000FF0 | 00000FF8 | 0FF4h에 10 |
| `mov DWORD PTR [ebp-8],20` | 00000FF0 | 00000FF8 | 0FF0h에 20 |
| `mov esp,ebp` | 00000FF8 | 00000FF8 | 두 칸을 돌려준다 |
| `pop ebp` | 00000FFC | 00001010 | |
| `ret` | 00001000 | 00001010 | |

```
   주소        든 값                  EBP에서 본 자리
 00000FFC   복귀 주소                  [EBP+4]
 00000FF8   부른 쪽의 EBP              [EBP]     ← EBP
 00000FF4   0000000A   x = 10          [EBP-4]
 00000FF0   00000014   y = 20          [EBP-8]   ← ESP
```

매개변수는 EBP 위쪽(`[ebp+8]`부터), 지역 변수는 EBP 아래쪽(`[ebp-4]`부터)이다. `DWORD PTR`은 "이 주소부터 4바이트"라고 크기를 알려 주는 말이다. `[ebp-4]`만으로는 어셈블러가 10을 몇 바이트로 써야 할지 모른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적 표와 그림, `enter 8,0`·`leave`로 바꿔도 메모리와 레지스터가 똑같은 것, `add esp,0FFFFFFF8h`가 `sub esp,8`과 같은 것, 값을 안 넣은 지역 변수에 앞 호출의 값이 남는 것, `mov esp,ebp`를 뺐을 때의 고장 — [44_local-variables_verify.py](/Hongs_Blog/studies/assembly-language/code/44_local-variables_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

지역 변수는 세 가지 성질을 가진다.

- 그 프로시저 안의 문장만 보거나 고칠 수 있다.
- 프로시저가 끝나면 차지하던 자리가 풀린다.
- 다른 프로시저의 지역 변수와 이름이 같아도 부딪히지 않는다.

만들고 없애는 방법은 세 가지고, 뒤로 갈수록 어셈블러가 대신 써 주는 부분이 많다.

**① 직접 쓴다.** 위 예처럼 `sub esp,n`으로 만들고 `mov esp,ebp`로 없앤다. $$n$$은 지역 변수들의 바이트 수를 더한 값이다.

**② ENTER와 LEAVE.** `ENTER n,0`은 프레임을 세우는 세 줄을 명령 하나로 한다. `LEAVE`는 프레임을 걷는 두 줄을 명령 하나로 한다.

| 명령 | 같은 일을 하는 명령들 |
|---|---|
| `enter 8,0` | `push ebp` / `mov ebp,esp` / `sub esp,8` |
| `leave` | `mov esp,ebp` / `pop ebp` |

```asm
MySub PROC
    enter 8,0
    ...
    leave
    ret
MySub ENDP
```

**③ LOCAL 지시어.** `PROC` 바로 다음 줄에 변수 이름과 자료형을 적으면, 어셈블러가 자리를 만들고 없애는 코드를 넣어 주고 이름으로 변수를 쓸 수 있게 해 준다.

```asm
LOCAL 변수목록                           ; 이름:자료형 을 쉼표로 나열

MySub PROC
    LOCAL var1:BYTE, var2:WORD, var3:SDWORD

LOCAL flagVals[20]:BYTE                  ; 바이트 20개짜리 배열
LOCAL pArray:PTR WORD                    ; WORD를 가리키는 포인터
```

`LOCAL temp:DWORD, SwapFlag:BYTE`를 쓴 프로시저에 어셈블러가 만드는 코드다.

```asm
BubbleSort PROC                          BubbleSort PROC
    LOCAL temp:DWORD, SwapFlag:BYTE          push ebp
    . . .                                    mov  ebp,esp
    ret                                      add  esp,0FFFFFFF8h   ; ESP에 -8을 더한다
BubbleSort ENDP                              . . .
                                             mov  esp,ebp
                                             pop  ebp
                                             ret
                                         BubbleSort ENDP
```

`0FFFFFFF8h`는 32비트에서 −8이다. 그래서 `add esp,0FFFFFFF8h`는 `sub esp,8`과 같다. 변수는 4 + 1 = 5바이트인데 8을 뺀다. 스택은 4바이트 단위로 쓰기 때문에 4의 배수로 올려 잡는다[^s1].

**바이트 변수의 자리.** `LOCAL var1:BYTE` 하나만 있어도 ESP는 4 내려간다. `var1`은 그 네 칸 가운데 EBP 바로 아래 한 칸, `[EBP-1]`이다. 나머지 세 칸은 쓰지 않는다.

```
 [EBP]      부른 쪽의 EBP     ← EBP
 [EBP-1]    var1
 [EBP-2]    (안 씀)
 [EBP-3]    (안 씀)
 [EBP-4]    (안 씀)           ← ESP
```

변수가 여럿이면 적은 순서대로 EBP 아래에 놓인다. 위 `BubbleSort`에서는 `temp`가 `[EBP-4]`부터 4바이트를 차지한다. 바이트 변수를 4바이트 칸의 맨 위에 두는 규칙을 따르면 `SwapFlag`는 그 바로 아래 `[EBP-5]`에 놓이고, `[EBP-8]`은 그 칸의 맨 아래 주소다. 그래서 코드에서는 이런 주소를 직접 쓰지 않고 이름 `temp`, `SwapFlag`를 쓴다. 어셈블러가 알맞은 주소로 바꿔 준다[^s2].


## 주소가 필요할 때: LEA

지역 변수의 주소를 다른 프로시저에 넘기거나 ESI에 담아 배열처럼 돌고 싶을 때가 있다. `LEA`(load effective address)는 피연산자가 가리키는 곳의 주소를 계산해 레지스터에 넣는 명령이다. 메모리의 내용은 읽지 않는다.

```asm
lea esi,[ebp-8]       ; ESI = EBP - 8 (지역 변수 y의 주소)
mov eax,[ebp-8]       ; EAX = 그 주소에 든 값
```

위 예에서 `lea esi,[ebp-8]`은 ESI에 00000FF0h를 넣고, `mov eax,[ebp-8]`은 EAX에 20을 넣는다[^s1]. 전역 변수의 주소를 얻던 `OFFSET`은 지역 변수에 쓸 수 없다. 까닭은 [OFFSET과 LEA 비교](/Hongs_Blog/studies/assembly-language/offset-vs-lea/)에서 다룬다.

## 활용

- 고급 언어에서 함수 안에 선언한 변수가 이렇게 만들어진다. 함수가 끝나면 사라지고, 재귀 호출마다 따로 생기는 까닭이 여기 있다. 컴파일러는 변수마다 EBP에서의 거리를 정해 표에 적어 둔다[^s1]. [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)
- 만드는 비용은 `sub esp,n` 한 줄이다. 변수가 몇 개든 ESP를 한 번 옮기면 끝이다[^s1].
- 흔한 실수.
    - 값을 넣기 전에 읽는다. `sub esp,n`은 자리만 만들 뿐 0으로 지우지 않는다. 앞서 불린 프로시저가 같은 자리에 1234h를 쓰고 끝났다면, 다음에 불린 프로시저의 지역 변수에는 1234h가 들어 있다.
    - `mov esp,ebp`를 빼먹는다. 위 예에서 이 줄을 빼면 `pop ebp`가 `y`의 값 20을 EBP에 넣고, `ret`이 `x`의 값 10을 복귀 주소로 꺼낸다.
    - 지역 변수의 주소를 프로시저가 끝난 뒤에 쓴다. 그 자리는 다음 호출이 덮어쓴다.
    - `[ebp-4]`에 크기를 안 붙인다. 즉시값을 쓸 때는 `DWORD PTR`처럼 크기를 알려 줘야 한다.
- 연습: [스택 프레임 그리기 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-frame-ladder/)

## 연결

- 선수: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/). 크기를 알려 주는 `PTR`: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/). `.data`에 만드는 변수와 자료형 이름: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)
- 프레임의 위쪽 절반: [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)
- 매개변수도 이름으로 쓰게 해 주는 지시어: [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)
- "그 프로시저 안에서만 보인다"는 규칙을 언어 차원에서 정한 것: [스코프](/Hongs_Blog/studies/compilers/identifier-scope/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `enter 8,0`과 `leave`를 각각 같은 일을 하는 보통 명령들로 풀어 쓰라.</summary>

**답:** `enter 8,0` = `push ebp` / `mov ebp,esp` / `sub esp,8`. `leave` = `mov esp,ebp` / `pop ebp`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** ESP = 00001000h, EBP = 00001010h에서 `call P`를 했다. P는 `push ebp`, `mov ebp,esp`, `sub esp,12`로 시작한다. 이 세 줄 뒤의 ESP와 EBP, 셋째 지역 변수(4바이트)의 주소를 쓰라.</summary>

**답:** EBP = 00000FF8h, ESP = 00000FECh. 셋째 지역 변수는 `[ebp-12]` = 00000FECh.<br>
**이유:** `call`에 0FFCh, `push ebp`에 0FF8h, 여기에 EBP를 고정. 12를 빼면 0FECh. 지역 변수는 `[ebp-4]` = 0FF4h, `[ebp-8]` = 0FF0h, `[ebp-12]` = 0FECh 순서로 놓인다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 끝에서 `mov esp,ebp`를 하지 않고 바로 `pop ebp`, `ret`을 하면 왜 고장 나는가? 몸통에서 `push`를 몇 번 했는지 몰라도 `mov esp,ebp` 한 줄로 정리되는 이유는?</summary>

**답:** ESP가 지역 변수 자리에 머물러 있어서 `pop ebp`가 지역 변수의 값을 EBP로 꺼내고, `ret`이 그 위의 지역 변수 값을 복귀 주소로 꺼낸다. `mov esp,ebp`는 ESP를 "옛 EBP가 든 칸"으로 곧장 옮긴다. EBP가 몸통 내내 그 칸을 가리키고 있었으므로, 그 아래에 무엇이 얼마나 쌓였든 한 번에 버려진다.<br>
**이유:** 프레임의 기준인 EBP는 지역 변수와 임시로 넣은 값들의 바로 위 경계다[^s1].

</details>


[^s1]: 시작 주소는 설명용으로 정한 값이다. 실행 결과는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
[^s2]: 실제 어셈블러의 목록 파일로 확인하지는 못했다.
{% endraw %}
