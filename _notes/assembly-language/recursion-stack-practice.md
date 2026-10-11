---
layout: "note"
title: "재귀 호출 스택 추적 연습"
display_title: "재귀 호출 스택 추적 연습"
kind: "practice"
kind_label: "연습"
num: "47"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 재귀 프로시저의 CalcSum과 Factorial, 스택 프레임."
prev_url: "/studies/assembly-language/stack-frame-ladder/"
prev_title: "스택 프레임 그리기 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/recursion-stack-practice/"
---
{% raw %}
사용 개념: [재귀 프로시저](/Hongs_Blog/studies/assembly-language/recursive-procedure/)의 `CalcSum`과 `Factorial`, [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/).

재귀를 따라갈 때는 두 가지를 따로 적는다. 내려가는 길에서는 호출마다 프레임이 놓이는 주소를, 올라오는 길에서는 돌아올 때마다 레지스터가 어떻게 바뀌는지를 적는다. 프레임 하나의 크기를 먼저 구해 두면 주소는 그만큼씩 빼기만 하면 된다[^s1].

모든 문제는 ESP = 00001000h, EBP = 00001010h에서 시작한다. 코드는 슬라이드의 것이다[^1].

```asm
CalcSum PROC                    Factorial PROC
    cmp  ecx,0                      push ebp
    jz   L2                         mov  ebp,esp
    add  eax,ecx                    mov  eax,[ebp+8]
    dec  ecx                        cmp  eax,0
    call CalcSum                    ja   L1
L2: ret                             mov  eax,1
CalcSum ENDP                        jmp  L2
                                L1: dec  eax
                                    push eax
                                    call Factorial
                                ReturnFact:
                                    mov  ebx,[ebp+8]
                                    mul  ebx
                                L2: pop  ebp
                                    ret  4
                                Factorial ENDP
```

## 문제 1 · CalcSum 표 채우기

main이 `mov ecx,3`, `mov eax,0`, `call CalcSum`을 한다. (a) `call`이 실행될 때마다 그 직후의 ECX, EAX, ESP를 표로 적어라. (b) `ret`은 모두 몇 번 실행되는가? (c) main으로 돌아왔을 때 EAX, ECX, ESP는?

풀이 전략: `CalcSum`의 프레임은 복귀 주소 한 칸(4바이트)뿐이다. `call` 한 번에 ESP가 4씩 내려간다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a)

| `call` | 넣은 복귀 주소 | ECX | EAX | ESP |
|---|---|---|---|---|
| main의 `call` | main 안 | 3 | 0 | 00000FFC |
| 첫째 재귀 | L2 | 2 | 3 | 00000FF8 |
| 둘째 재귀 | L2 | 1 | 5 | 00000FF4 |
| 셋째 재귀 | L2 | 0 | 6 | 00000FF0 |

(b) 네 번. 넷째 호출에서 ECX = 0이라 `jz L2`로 가서 `ret`. 돌아간 곳이 또 `L2: ret`이라 세 번 더 이어진다.<br>
(c) EAX = 6, ECX = 0, ESP = 00001000h. ECX는 처음의 3이 아니다. 레지스터 하나를 모든 호출이 함께 쓰기 때문이다.

</details>


## 문제 2 · Factorial(4)의 프레임 주소

main이 `push 4`, `call Factorial`을 한다. (a) 호출은 몇 번 일어나고 스택은 가장 깊을 때 몇 바이트를 쓰는가? 그때의 ESP는? (b) 다섯 호출이 받은 $$n$$이 든 주소를 차례로 쓰라. (c) 각 프레임의 "맡아 둔 EBP" 칸의 주소와 거기 든 값을 쓰라. (d) `mul ebx` 직후의 EAX를 실행 순서대로 쓰라.

풀이 전략: 프레임은 $$n$$, 복귀 주소, 옛 EBP의 12바이트다. 첫 프레임의 세 주소(0FFCh, 0FF8h, 0FF4h)를 구한 뒤 12(= 0Ch)씩 뺀다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 다섯 번($$n$$ = 4, 3, 2, 1, 0). 5 × 12 = 60바이트. ESP = 1000h − 3Ch = 00000FC4h.<br>
(b) 0FFCh(4), 0FF0h(3), 0FE4h(2), 0FD8h(1), 0FCCh(0).<br>
(c)

| 호출 | 맡아 둔 EBP의 주소 (= 그 호출의 EBP) | 든 값 |
|---|---|---|
| 1 | 00000FF4 | 00001010 (main의 EBP) |
| 2 | 00000FE8 | 00000FF4 |
| 3 | 00000FDC | 00000FE8 |
| 4 | 00000FD0 | 00000FDC |
| 5 | 00000FC4 | 00000FD0 |

각 칸의 값이 바로 윗줄의 주소다. 따라 올라가면 main에 닿는다.<br>
(d) 1, 2, 6, 24. 호출 5는 곱하지 않고 EAX = 1을 돌려준다. 호출 4가 1 × 1, 호출 3이 1 × 2, 호출 2가 2 × 3, 호출 1이 6 × 4를 한다.

</details>


## 문제 3 · 고장 난 코드

`Factorial`의 마지막 줄 `ret 4`를 `ret`으로 잘못 썼다. main이 `push 1`, `call Factorial`을 한다. 곱셈까지는 맞게 하는데 main으로 돌아오지 못한다. 바깥 호출이 자기 `ret`을 실행하기 직전의 ESP와 EBP, 그리고 `ret`이 꺼낼 값을 구하고, 무엇이 어긋났는지 설명하라.

풀이 전략: 안쪽 호출이 돌아온 직후 ESP가 바깥 호출의 EBP와 같은지 본다. 같지 않으면 `pop ebp`가 엉뚱한 칸을 꺼낸다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 바깥 호출: `push ebp`, `mov ebp,esp` 뒤 EBP = 0FF4h. 스택은 0FFCh에 1, 0FF8h에 ReturnMain, 0FF4h에 00001010h.
2. `push eax`로 0을 0FF0h에 넣고, `call`이 0FECh에 ReturnFact를 넣는다.
3. 안쪽 호출($$n$$ = 0): EAX = 1. `pop ebp`로 EBP = 0FF4h, ESP = 0FECh. `ret`이 복귀 주소만 꺼내 ESP = 0FF0h. 인수 0이 0FF0h에 그대로 남았다.
4. 바깥으로 돌아와 `mov ebx,[ebp+8]`(1), `mul ebx` → EAX = 1. 여기까지는 맞다.
5. `pop ebp`가 꼭대기(0FF0h)의 0을 꺼낸다. EBP = 00000000h, ESP = 0FF4h.
6. `ret`이 꺼낼 값은 0FF4h에 든 00001010h다. 복귀 주소가 아니라 main의 EBP 값이다. 그 주소로 뛴다.

어긋난 것: 안쪽 호출이 인수 한 칸을 치우지 않아 ESP가 EBP보다 4 낮은 채로 돌아왔다. 한 칸 밀린 탓에 `pop ebp`는 인수를, `ret`은 옛 EBP를 꺼낸다. `ret 4`로 고친다. 또는 C 규약으로 바꿔, `call Factorial`을 하는 두 곳(main과 프로시저 안) 모두 바로 뒤에 `add esp,4`를 넣는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~3의 모든 값 — [47_recursion-stack-practice_p3.py](/Hongs_Blog/studies/assembly-language/code/47_recursion-stack-practice_p3/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 문제 4 · 변형: 스택으로 받는 합

`CalcSum`은 값을 ECX와 EAX로 주고받는다. 같은 일(1부터 $$n$$까지의 합)을 `Factorial`처럼 스택 매개변수로 받아 EAX로 돌려주는 재귀 프로시저 `SumTo`로 다시 써라. $$\mathrm{SumTo}(0) = 0$$, $$\mathrm{SumTo}(n) = n + \mathrm{SumTo}(n-1)$$이다. `push 3`, `call SumTo`를 했을 때 쓰는 스택 바이트 수와 `add` 직후의 EAX를 순서대로 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
SumTo PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+8]      ; EAX = n
    cmp  eax,0
    je   L2               ; n = 0이면 EAX = 0 그대로 돌려준다
    dec  eax
    push eax              ; n - 1을 넣고
    call SumTo            ; EAX = SumTo(n - 1)
    add  eax,[ebp+8]      ; EAX = SumTo(n - 1) + n
L2: pop  ebp
    ret  4
SumTo ENDP
```
호출 네 번($$n$$ = 3, 2, 1, 0), 4 × 12 = 48바이트. `add` 직후의 EAX는 1, 3, 6. 돌아온 뒤 EAX = 6, ESP = 00001000h.

`CalcSum`은 호출마다 4바이트를 썼는데 `SumTo`는 12바이트를 쓴다. `CalcSum`은 돌아온 뒤 할 일이 없어 값을 기억할 필요가 없었고, `SumTo`는 돌아온 뒤에 자기 $$n$$을 더해야 해서 $$n$$과 EBP를 프레임에 둔다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$n$$ = 0~39에서 SumTo가 $$n(n+1)/2$$를 돌려주고 스택을 $$12(n+1)$$바이트 쓴다 — [47_recursion-stack-practice_p3.py](/Hongs_Blog/studies/assembly-language/code/47_recursion-stack-practice_p3/)</div>

</div>


[^1]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-2」, p.4 (CalcSum), p.6 (Factorial), p.7 (프레임 그림)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제, 시작 주소, 풀이 전략, 답, SumTo 코드는 원본에 없다. 답은 문제 코드로 확인했다.
{% endraw %}
