---
layout: "note"
title: "조건부 반복 명령"
display_title: "조건부 반복 명령 (LOOPZ, LOOPNZ)"
kind: "concept"
kind_label: "기법"
num: "33"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Conditional Loop Instructions", "LOOPZ", "LOOPE", "LOOPNZ", "LOOPNE", "조건부 루프", "보초값", "Sentinel", "배열 훑기"]
description: "서랍 여덟 칸을 차례로 열며 열쇠를 찾을 때는 두 가지로 멈춘다. 열쇠가 나오면 멈추고, 여덟 칸을 다 열어도 멈춘다. 이 명령들은 남은 횟수와 방금 견준 결과를 한꺼번에 보고, 둘 다 \"계속\"일 때만 되돌아간다. 배열에서 조건에 맞는 첫 원소를 찾는 일이 한 줄로 끝난다. 다만 …"
prev_url: "/studies/assembly-language/signed-vs-unsigned-jumps/"
prev_title: "부호 있는 비교 점프와 부호 없는 비교 점프"
next_url: "/studies/assembly-language/conditional-structures/"
next_title: "조건 구조를 점프로 옮기기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/conditional-loop-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

서랍 여덟 칸을 차례로 열며 열쇠를 찾을 때는 두 가지로 멈춘다. 열쇠가 나오면 멈추고, 여덟 칸을 다 열어도 멈춘다. 이 명령들은 남은 횟수와 방금 견준 결과를 한꺼번에 보고, 둘 다 "계속"일 때만 되돌아간다. 배열에서 조건에 맞는 첫 원소를 찾는 일이 한 줄로 끝난다. 다만 반복이 끝난 뒤 "찾아서 멈췄는지, 다 봐서 멈췄는지"를 따로 가려야 하고, 견준 줄과 이 명령 사이에 표시등을 바꾸는 계산이 끼면 견준 결과가 사라진다.

</div>


## 예시로 보기

[LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)는 정해진 횟수를 다 돈다. 배열에서 첫 양수를 찾을 때는 찾는 순간 그만 돌고 싶다. `LOOP` 앞에 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)를 하나 더 넣어도 되지만, 두 검사를 한 줄로 하는 명령이 있다.

16비트 배열에서 첫 양수를 찾는다[^1].

```asm
.data
array    SWORD -3,-6,-1,-10,10,30,40,4
sentinel SWORD 0
.code
    mov esi,OFFSET array
    mov ecx,LENGTHOF array
next:
    test WORD PTR [esi],8000h   ; 부호 비트를 본다
    pushfd                      ; 플래그를 스택에 치워 둔다
    add esi,TYPE array          ; 다음 원소로
    popfd                       ; 플래그를 되돌린다
    loopnz next                 ; 음수였고 남은 횟수가 있으면 계속
    jnz quit                    ; 끝까지 음수뿐이었다
    sub esi,TYPE array          ; 찾았다: ESI를 한 칸 되돌린다
quit:
```

`test`는 맨 위 비트만 남겨 본다. 음수면 결과가 0이 아니라 ZF = 0, 양수면 ZF = 1이다([TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)). `loopnz`는 ZF = 0인 동안 되돌아간다.

| 본 원소 | ZF (`test` 뒤) | ECX (`loopnz` 뒤) | `loopnz` |
|---|---|---|---|
| −3 | 0 | 7 | 되돌아간다 |
| −6 | 0 | 6 | 되돌아간다 |
| −1 | 0 | 5 | 되돌아간다 |
| −10 | 0 | 4 | 되돌아간다 |
| 10 | 1 | 3 | 아래로 빠진다 |

빠져나왔을 때 ESI는 이미 10의 다음 칸을 가리킨다. ZF = 1이라 `jnz quit`는 넘어가지 않고, `sub`가 ESI를 한 칸 되돌려 10을 가리키게 한다. 배열 시작에서 8바이트 뒤, 인덱스 4다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적(인덱스 4, ECX = 3), 모두 음수일 때 ESI가 보초값을 가리키는 것, 마지막 원소가 첫 양수일 때, 무작위 배열 300개에서 두 코드를 파이썬 탐색과 대조, Your turn 풀이(50칸), `pushfd`·`popfd`를 뺀 코드가 틀리는 것, 동작 규칙표, 카드 C2 — [33_conditional-loop-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/33_conditional-loop-instructions_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 정의

두 쌍이 있다. 쌍 안의 두 이름은 같은 명령이다[^2].

| 명령 | 하는 일 | 쓰임새 |
|---|---|---|
| `LOOPZ 목적지`, `LOOPE 목적지` | ECX를 1 줄인다. ECX > 0이고 ZF = 1이면 목적지로 간다 | 주어진 값과 **다른** 첫 원소 찾기 |
| `LOOPNZ 목적지`, `LOOPNE 목적지` | ECX를 1 줄인다. ECX > 0이고 ZF = 0이면 목적지로 간다 | 주어진 값과 **같은** 첫 원소 찾기 |

기호로 쓰면 다음과 같다. $$\land$$는 "그리고"다.

$$\text{LOOPZ}: \quad \text{ECX} \leftarrow \text{ECX} - 1, \quad (\text{ECX} > 0) \land (\text{ZF} = 1) \text{이면 점프}$$


$$\text{LOOPNZ}: \quad \text{ECX} \leftarrow \text{ECX} - 1, \quad (\text{ECX} > 0) \land (\text{ZF} = 0) \text{이면 점프}$$


ECX는 부호 없는 수로 본다. 그래서 ECX > 0은 "0이 아니다"와 같은 말이다[^s1]. 이름은 "같은 동안(Equal, Zero) 돈다", "다른 동안(Not Equal, Not Zero) 돈다"로 읽는다. `LOOPZ`는 같은 동안 도니까 다른 것을 만나면 멈추고, 그래서 다른 첫 원소를 찾는 데 쓴다.

세 반복 명령을 나란히 놓으면 이렇다[^s1].

| 줄인 뒤의 ECX | ZF | `LOOP` | `LOOPZ` | `LOOPNZ` |
|---|---|---|---|---|
| 0이 아니다 | 1 | 간다 | 간다 | 안 간다 |
| 0이 아니다 | 0 | 간다 | 안 간다 | 간다 |
| 0 | 1 | 안 간다 | 안 간다 | 안 간다 |
| 0 | 0 | 안 간다 | 안 간다 | 안 간다 |

이 명령들은 ECX를 줄이지만 플래그는 바꾸지 않는다. 그래서 빠져나온 뒤에도 ZF에는 마지막으로 견준 결과가 남아 있다[^s1].

## 코드의 세 군데

**`pushfd`와 `popfd`.** 견준 줄(`test`)과 `loopnz` 사이에 `add esi,TYPE array`가 있다. `ADD`는 플래그를 다시 매긴다. ESI는 0이 아니니 ZF가 늘 0이 되어 버린다. 그래서 견준 직후의 플래그를 스택에 올려 두고(`pushfd`), 덧셈 뒤에 내린다(`popfd`)[^1]. 이 두 줄을 빼면 위 배열에서 `loopnz`가 여덟 번을 다 돌고 ESI는 보초값을 가리킨 채 끝난다[^s1]. `PUSHFD`와 `POPFD`는 [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/)에 있다.

**빠져나온 뒤의 `jnz quit`.** 반복은 찾아서도 끝나고 횟수가 다해서도 끝난다. 둘을 가르는 것이 ZF다. ZF = 0이면 마지막 원소까지 음수였다는 뜻이라 `quit`로 간다. ECX로 가르면 안 된다. 마지막 원소가 첫 양수면 ECX도 0이기 때문이다[^s1].

**보초값.** 못 찾으면 ESI는 배열 바로 다음 칸을 가리킨다. 거기에 `sentinel`이라는 변수를 미리 놓아 둔다. 뒤의 코드가 ESI가 가리키는 값을 읽어도 배열 밖의 아무 값이 아니라 약속한 값(0)을 읽는다[^1].

## 예제

**Your turn.** 배열에서 0이 아닌 첫 값을 찾는다. 없으면 ESI가 보초값을 가리키게 한다[^3].

```asm
.data
array    SWORD 50 DUP(?)
sentinel SWORD 0FFFFh
.code
    mov esi,OFFSET array
    mov ecx,LENGTHOF array
L1: cmp WORD PTR [esi],0        ; 0인지 본다
    (여기를 채운다)
quit:
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    pushfd                      ; 플래그를 치워 둔다
    add esi,TYPE array
    popfd                       ; 플래그를 되돌린다
    loope L1                    ; 0이었고 남은 횟수가 있으면 계속
    jz quit                     ; 끝까지 0뿐이었다
    sub esi,TYPE array          ; 찾았다: ESI를 되돌린다
```
첫 예제와 뼈대가 같고 세 군데가 반대다. 견주는 줄이 `cmp …,0`이라 0이면 ZF = 1이다. 0인 동안 돌아야 하므로 `loope`를 쓴다. 못 찾은 경우는 ZF = 1로 끝나므로 `jz quit`다[^4].

</details>


**경계 사례.** 배열이 `-1, -1, …, -1, 5`처럼 마지막 원소만 양수면, `loopnz`는 ECX = 0이고 ZF = 1인 채 빠져나온다. `jnz quit`는 넘어가지 않고 ESI가 마지막 원소로 돌아온다. 바르게 찾는다[^s1].

## 활용

- 이 기법을 떠올릴 신호: "배열에서 ~인 첫 원소"를 찾는다. 돌 횟수의 한도는 알지만 중간에 멈출 수 있다.
- 쓸 조건: 견준 줄의 ZF가 `LOOPZ`·`LOOPNZ`에 닿을 때까지 살아 있어야 한다. 사이에 플래그를 바꾸는 명령이 있으면 `pushfd`·`popfd`로 감싼다.
- 대표 문제 둘: 부호 비트가 0인 첫 원소 찾기(`test` + `loopnz`), 0이 아닌 첫 원소 찾기(`cmp` + `loope`).
- 흔한 실수: `LOOPZ`와 `LOOPNZ`를 거꾸로 고른다. "~인 동안 돈다"로 읽고, 멈출 조건의 반대를 고른다.
- 흔한 실수: 찾은 뒤 ESI를 되돌리지 않는다. ESI는 견준 직후 이미 다음 칸으로 넘어가 있다.
- `ECX`가 0으로 시작하면 `LOOP`와 똑같이 FFFFFFFFh가 되어 계속 돈다([JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/))[^s1].

## 연결

- 선수: [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/), [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/), [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/)
- 견주는 줄: [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)
- 조건이 두 개인 `while`을 점프로 쓰는 일반적인 방법: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `LOOPNZ`가 하는 일을 순서대로 쓰고, 목적지로 가는 조건을 쓰라.</summary>

**답:** ECX를 1 줄인다. 줄인 뒤 ECX > 0이고 ZF = 0이면 목적지로 간다. 아니면 아래 줄로 간다.<br>
**이유:** 두 조건 중 하나만 깨져도 빠져나온다. 플래그는 바꾸지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `array SWORD 3,3,7,3`에 Your turn의 답 코드를 쓰되 `cmp WORD PTR [esi],0`만 `cmp WORD PTR [esi],3`으로 바꿨다. 끝났을 때 ESI는 배열 시작에서 몇 바이트 뒤를 가리키고, ECX는 얼마인가?</summary>

**답:** 4바이트 뒤(인덱스 2, 값 7). ECX = 1.<br>
**이유:** 3, 3에서는 ZF = 1이라 `loope`가 되돌아가고 ECX는 3, 2가 된다. 7에서 ZF = 0이라 ECX를 1로 줄인 뒤 빠져나온다. 그때 ESI는 6바이트 뒤이고 `sub`가 4바이트 뒤로 되돌린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 견주는 줄과 `loopnz` 사이에 `pushfd`와 `popfd`가 왜 필요한가? 빼면 어떤 답이 나오는가?</summary>

**답:** 사이의 `add esi,TYPE array`가 플래그를 다시 매겨서, `loopnz`가 볼 ZF가 `test`의 것이 아니라 덧셈의 것이 된다. ESI는 0이 아니라서 ZF가 늘 0이고, `loopnz`는 ECX가 0이 될 때까지 돈다. 양수가 있어도 못 찾았다고 끝난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 반복이 끝난 뒤 "찾았는지"를 ECX가 0인지로 가리면 왜 틀리는가?</summary>

**답:** 마지막 원소에서 찾으면 ECX도 0이다. 찾았는데 못 찾았다고 판정한다. 찾았는지는 마지막으로 견준 결과, 곧 ZF에 남아 있다. `LOOPNZ`가 플래그를 바꾸지 않으므로 빠져나온 직후의 ZF가 그 결과다.

</details>


[^1]: 어셈블리어 9회 강의 자료 「wk09-chapt_06-2-1」, p.5 (LOOPNZ 예: 배열에서 첫 양수 찾기)
[^2]: 같은 자료, p.3~4 (LOOPZ·LOOPE, LOOPNZ·LOOPNE의 문법, 동작, 쓰임새)
[^3]: 같은 자료, p.6 (Your turn: 0이 아닌 첫 값 찾기)
[^4]: 같은 자료, p.7 (풀이)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 추적 표, ECX > 0이 "0이 아니다"와 같다는 점, 세 명령을 견준 표, 이 명령들이 플래그를 바꾸지 않는다는 점, `pushfd`·`popfd`를 뺀 결과, ECX로 가르면 안 되는 까닭, 경계 사례, 활용 항목, 카드 C1~C4는 원본에 없다. 동작은 원본 p.3~4의 Logic과 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 LOOP/LOOPcc 항목을 따랐고, 값은 검증 코드의 파이썬 흉내로 확인했다. `pushfd`·`popfd`를 두는 까닭은 원본 코드의 주석(push flags on stack, pop flags from stack)에서 읽었다.
{% endraw %}
