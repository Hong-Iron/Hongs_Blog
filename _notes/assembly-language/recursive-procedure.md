---
layout: "note"
title: "재귀 프로시저"
display_title: "재귀 프로시저 (Recursive Procedure)"
kind: "concept"
kind_label: "알고리즘"
num: "47"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Recursive Procedure", "Recursion", "재귀", "재귀 호출", "Recursive Call", "CalcSum", "Factorial", "팩토리얼", "바닥 조건", "Base Case", "스택 넘침", "Stack Overflow"]
description: "자기 자신을 다시 부르는 프로시저다. 러시아 인형을 열면 조금 작은 인형이 나오고, 그것을 또 열다가 더 열 수 없는 가장 작은 인형에서 멈춘 뒤, 연 순서의 거꾸로 하나씩 닫아 나오는 것과 같다. 부를 때마다 스택에 그 호출만의 칸이 새로 쌓여서, 같은 코드를 돌려 쓰면서도 호출…"
prev_url: "/studies/assembly-language/invoke-proc-proto/"
prev_title: "INVOKE·PROC·PROTO 지시어"
next_url: "/studies/assembly-language/fat-file-system/"
next_title: "클러스터와 FAT"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/recursive-procedure/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자기 자신을 다시 부르는 프로시저다. 러시아 인형을 열면 조금 작은 인형이 나오고, 그것을 또 열다가 더 열 수 없는 가장 작은 인형에서 멈춘 뒤, 연 순서의 거꾸로 하나씩 닫아 나오는 것과 같다. 부를 때마다 스택에 그 호출만의 칸이 새로 쌓여서, 같은 코드를 돌려 쓰면서도 호출마다 자기 값을 따로 기억한다. 대신 깊이 들어갈수록 스택을 그만큼 먹고, 멈추는 조건이 없으면 스택이 바닥나 프로그램이 죽는다.

</div>


## 예시로 보기

5! = 5 × 4!이고 4! = 4 × 3!이다. 같은 모양이 작아지며 되풀이된다. 이런 계산을 반복문으로 바꾸려면 식을 다시 짜야 하지만, 프로시저가 자기를 부를 수 있으면 식 그대로 옮기면 된다. 문제는 하나다. 프로시저의 코드는 한 벌뿐인데, 5를 든 호출과 4를 든 호출이 동시에 살아 있어야 한다. 그 값들을 어디에 따로 둘 것인가.

먼저 값을 레지스터에만 두는 쉬운 예다. `CalcSum`은 ECX에 든 수부터 1까지를 EAX에 더한다[^1].

```asm
CalcSum PROC
    cmp  ecx,0          ; 남은 수가 0인가?
    jz   L2             ; 그러면 그만둔다
    add  eax,ecx        ; 아니면 합에 더하고
    dec  ecx            ; 하나 줄여서
    call CalcSum        ; 자기를 다시 부른다
L2: ret
CalcSum ENDP
```

main이 EAX = 0, ECX = 5로 부르면 `call`이 실행될 때마다 스택에 복귀 주소가 하나씩 쌓인다. `L1`은 main에서 `call` 다음 줄의 주소, `L2`는 CalcSum 안에서 `call` 다음 줄(`ret`)의 주소다[^1].

| 스택에 넣은 복귀 주소 | 그때의 ECX | 그때의 EAX |
|---|---|---|
| L1 | 5 | 0 |
| L2 | 4 | 5 |
| L2 | 3 | 9 |
| L2 | 2 | 12 |
| L2 | 1 | 14 |
| L2 | 0 | 15 |

여섯 번째 호출에서 ECX가 0이라 `ret`으로 돌아간다. 돌아간 곳은 `L2`, 곧 또 `ret`이다. `ret`이 여섯 번 이어지며 복귀 주소 여섯 개(24바이트)를 차례로 꺼내고 main으로 돌아온다. EAX = 15다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.4의 설명은 CalcSum이 "정수 배열의 합(the sum of an array of integers)"을 재귀로 구한다고 적었다. / 문제점: 코드는 메모리를 한 번도 읽지 않는다. ECX 자신을 EAX에 더할 뿐이다. 구하는 것은 배열의 합이 아니라 ECX부터 1까지의 합 $$n + (n-1) + \cdots + 1$$이다. / 수정안: "1부터 ECX까지 정수의 합을 구한다"로 읽는다. / 근거: ECX = 0~59를 넣어 흉내 낸 결과가 모두 $$n(n+1)/2$$와 같고, 슬라이드 자신의 표도 5 + 4 + 3 + 2 + 1 = 15다.

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: CalcSum의 표 여섯 줄, Factorial(0)~(12)가 $$n!$$과 같은 것, 12!을 부를 때의 스택 그림(슬라이드 p.7), Factorial(3)의 프레임 주소와 곱하는 순서, 호출마다 12바이트, 13!에서 넘치는 것 — [47_recursive-procedure_impl.py](/Hongs_Blog/studies/assembly-language/code/47_recursive-procedure_impl/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

재귀는 프로시저가 자기 자신을 부를 때, 또는 프로시저 A가 B를 부르고 B가 다시 A를 부를 때 생긴다. 프로시저를 점으로, 호출을 화살표로 그리면 재귀는 한 바퀴 돌아 제자리로 오는 고리(cycle)를 만든다[^2].

재귀 프로시저에는 두 갈래가 있어야 한다[^s1].

- **바닥 조건(base case):** 자기를 부르지 않고 바로 답을 내는 경우. `CalcSum`의 ECX = 0, 아래 `Factorial`의 $$n = 0$$.
- **재귀 단계:** 문제를 더 작게 만들어 자기를 부르는 경우. 부를 때마다 바닥에 가까워져야 한다.

## Factorial

$$n$$의 계승 $$n!$$은 1부터 $$n$$까지를 모두 곱한 수이고, $$0! = 1$$로 약속한다. C로 쓰면 이렇다[^3].

```c
int factorial(int n)
{
    if (n == 0)
        return 1;
    else
        return n * factorial(n - 1);
}
```

`CalcSum`과 다른 점이 있다. 자기를 부르고 돌아온 다음에 할 일(`n *`)이 남아 있다. 그래서 돌아왔을 때 자기의 $$n$$을 기억하고 있어야 한다. 호출마다 $$n$$을 스택 프레임에 따로 두는 까닭이다[^3].

**입력과 출력.** 부르는 쪽이 $$n$$(부호 없는 32비트 수)을 스택에 넣고 부른다. 돌아오면 EAX에 $$n!$$이 있고, 넣었던 $$n$$은 프로시저가 치웠다. $$n!$$이 32비트에 들어가야 맞는 값이 나온다($$n \le 12$$)[^s1]. 슬라이드의 코드다[^5].

```asm
Factorial PROC
    push ebp
    mov  ebp,esp
    mov  eax,[ebp+8]        ; EAX = n
    cmp  eax,0              ; n > 0 인가?
    ja   L1                 ; 그러면 재귀 단계로
    mov  eax,1              ; 아니면 (n = 0) 1을 돌려준다
    jmp  L2
L1: dec  eax
    push eax                ; n - 1을 넣고
    call Factorial          ; 자기를 부른다
ReturnFact:                 ; 재귀 호출이 돌아올 때마다 여기부터 실행된다
    mov  ebx,[ebp+8]        ; EBX = 이 호출의 n
    mul  ebx                ; EAX = EAX × EBX
L2: pop  ebp
    ret  4                  ; n 한 칸을 치우고 돌아간다
Factorial ENDP
```

`mul ebx`는 EAX에 EBX를 곱해 결과의 아래 32비트를 EAX에, 위 32비트를 EDX에 넣는 명령이다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.6의 주석은 `cmp eax,0 ; n < 0?` / `ja L1 ; yes: continue` / `mov eax,1 ; no: return 1`이다. / 문제점: `ja`는 부호 없이 견주어 왼쪽이 클 때 뛴다. 곧 $$n > 0$$일 때 `L1`로 간다. 주석대로 "$$n < 0$$이면 계속"이라면 $$n = 5$$에서 곧장 1을 돌려줘야 하는데 코드는 그렇게 움직이지 않는다. / 수정안: 주석을 `n > 0?`으로 고친다(위 코드는 고친 것이다). / 근거: p.5의 C 코드가 `n == 0`일 때 1을 돌려준다. 흉내에서 $$n = 0$$은 1을, $$n = 3$$은 6을 돌려준다.

</div>


### 3!을 따라가기

main이 ESP = 00001000h, EBP = 00001010h에서 `push 3`, `call Factorial`을 한다. 호출은 네 번 일어난다[^s1].

내려가는 길:

| 호출 | 받은 $$n$$ = `[ebp+8]` | 그 호출의 EBP | 한 일 |
|---|---|---|---|
| 1 | 3 | 00000FF4 | $$3 > 0$$ → 2를 넣고 자기를 부른다 |
| 2 | 2 | 00000FE8 | $$2 > 0$$ → 1을 넣고 자기를 부른다 |
| 3 | 1 | 00000FDC | $$1 > 0$$ → 0을 넣고 자기를 부른다 |
| 4 | 0 | 00000FD0 | $$n = 0$$ → EAX = 1, 돌아간다 |

네 번째 호출이 `mov ebp,esp`를 마친 순간의 스택이다. 이때가 가장 깊다.

```
   주소        든 값
 00000FFC   00000003   n = 3                    ┐
 00000FF8   ReturnMain (main으로 돌아갈 주소)    │ 호출 1의 프레임
 00000FF4   00001010   main의 EBP               ┘
 00000FF0   00000002   n = 2                    ┐
 00000FEC   ReturnFact                          │ 호출 2
 00000FE8   00000FF4   호출 1의 EBP             ┘
 00000FE4   00000001   n = 1                    ┐
 00000FE0   ReturnFact                          │ 호출 3
 00000FDC   00000FE8   호출 2의 EBP             ┘
 00000FD8   00000000   n = 0                    ┐
 00000FD4   ReturnFact                          │ 호출 4
 00000FD0   00000FDC   호출 3의 EBP             ┘  ← EBP, ESP
```

프레임 하나는 $$n$$, 복귀 주소, 맡아 둔 EBP 세 칸, 12바이트다[^4]. 코드는 한 벌이지만 $$n$$은 네 군데(0FFCh, 0FF0h, 0FE4h, 0FD8h)에 따로 있다. 맡아 둔 EBP는 바로 위 프레임의 EBP 자리를 가리켜서, 따라 올라가면 호출 4 → 3 → 2 → 1 → main으로 이어진다.

올라오는 길:

| 돌아온 곳 | `pop ebp`가 되살린 EBP | `[ebp+8]` | `mul` 뒤 EAX | 그 호출의 `ret 4` 뒤 ESP |
|---|---|---|---|---|
| (호출 4가 끝남) | | | 1 | 00000FDC |
| 호출 3의 ReturnFact | 00000FDC | 1 | 1 × 1 = 1 | 00000FE8 |
| 호출 2의 ReturnFact | 00000FE8 | 2 | 1 × 2 = 2 | 00000FF4 |
| 호출 1의 ReturnFact | 00000FF4 | 3 | 2 × 3 = 6 | 00001000 |

main으로 돌아왔을 때 EAX = 6, ESP = 00001000h, EBP = 00001010h다. 슬라이드의 그림으로는 "내려가며 부르기"가 5! = 5 × 4!, 4! = 4 × 3!, …, 0! = 1이고 "되돌아오며 곱하기"가 1, 1 × 1 = 1, 2 × 1 = 2, 3 × 2 = 6, 4 × 6 = 24, 5 × 24 = 120이다[^3].

### 왜 맞는가

**주장.** $$n \ge 0$$이고 $$n! < 2^{32}$$이면, $$n$$을 스택에 넣고 `Factorial`을 불렀을 때 ① EAX = $$n!$$로 돌아오고 ② ESP는 $$n$$을 넣기 전 값이며 ③ EBP는 부르기 전 값이다[^s1].

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

$$n$$에 대한 수학적 귀납법으로 보인다.
1. **바닥($$n = 0$$).** `mov eax,[ebp+8]`로 EAX = 0. `cmp eax,0` 뒤 `ja`는 뛰지 않는다(0은 0보다 크지 않다). EAX = 1 = $$0!$$. — ①
2. `pop ebp`가 맡아 둔 EBP를 되살리고 `ret 4`가 복귀 주소와 $$n$$ 한 칸을 꺼낸다. — ②, ③ ([스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)의 논증)
3. **재귀 단계.** $$n - 1$$에서 주장이 맞다고 하자(귀납 가정). $$n > 0$$이면 `ja`가 `L1`로 뛰고, `push eax`로 $$n - 1$$을 넣고 자기를 부른다.
4. 귀납 가정에 따라 돌아왔을 때 EAX = $$(n-1)!$$, ESP는 `push eax` 전 값, EBP는 이 호출의 EBP 그대로다. — 가정의 ①, ②, ③
5. EBP가 그대로이므로 `mov ebx,[ebp+8]`은 이 호출의 $$n$$을 읽는다. `mul ebx`로 EAX = $$(n-1)! \cdot n = n!$$. $$n! < 2^{32}$$이므로 EAX에 다 들어간다. — ①
6. ESP가 `push eax` 전 값(= EBP)이므로 `pop ebp`, `ret 4`가 2와 같이 ②, ③을 채운다. ∎

**끝나는가.** 호출마다 $$n$$이 정확히 1 줄고, 0이 되면 더 부르지 않는다. 그래서 호출은 정확히 $$n + 1$$번이다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1번 줄에서 n = 0일 때 ja가 뛰지 않는 이유</summary>

`cmp eax,0`은 0 − 0을 계산해 ZF = 1, CF = 0으로 만든다. `ja`는 CF = 0이고 ZF = 0일 때만 뛴다. ZF가 1이므로 뛰지 않고 다음 줄 `mov eax,1`로 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 5번 줄에서 [ebp+8]이 n - 1이 아니라 n인 이유</summary>

안쪽 호출은 자기 EBP를 새로 세웠지만, 끝에서 `pop ebp`로 내 EBP를 되살려 놓고 돌아왔다(귀납 가정의 ③). 내 EBP에서 8 위에는 내가 받은 $$n$$이 있다. 안쪽 호출이 받은 $$n - 1$$은 12바이트 아래의 다른 칸에 있었고 이미 치워졌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 6번 줄에서 ESP가 EBP와 같다는 것은 어디서 나오는가</summary>

이 호출이 `mov ebp,esp` 뒤에 스택에 넣은 것은 `push eax` 하나뿐이고, 그 한 칸은 안쪽 호출의 `ret 4`가 치웠다(귀납 가정의 ②). 그래서 ESP는 `mov ebp,esp` 때의 값, 곧 EBP와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

"한 번의 호출이 스택과 EBP를 원래대로 돌려놓는다"를 주장에 함께 넣은 것이다. 답(EAX)만 주장하면 5번 줄에서 `[ebp+8]`이 여전히 $$n$$이라는 것을 댈 근거가 없다. 프레임을 되돌린다는 약속이 있어야 호출 여러 겹이 서로를 망가뜨리지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

프로시저가 다른 프로시저를 부르는 모든 경우에 같은 약속(들어올 때와 나갈 때 ESP·EBP가 같다)을 쓴다. 재귀로 정의된 구조(트리, 문법)를 따라 내려가는 프로시저의 정확성도 같은 식으로 보인다: [재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/).

</details>


### 복잡도

| | 값 |
|---|---|
| 호출 횟수 | $$n + 1$$ |
| 실행하는 명령 수 | $$12n + 9$$ (재귀 단계 호출마다 12개, 바닥 호출 9개) |
| 스택 | $$12(n + 1)$$바이트 |

시간과 스택이 모두 $$n$$에 비례한다. 최선·최악의 구분은 없다. 입력 $$n$$이 정해지면 길이 하나로 정해진다. 12!을 구하면 13번 불려 156바이트를 쓴다. 슬라이드는 12!을 부를 때의 앞쪽 프레임(12, ReturnMain, ebp₀ / 11, ReturnFact, ebp₁ / 10, ReturnFact, ebp₂ / 9, ReturnFact, ebp₃)을 그림으로 보이고 호출마다 12바이트라고 적는다[^4]. 반복문으로 짜면 스택을 더 쓰지 않는다[^s1].

## 활용

- 구현과 검증: [47_recursive-procedure_impl.py](/Hongs_Blog/studies/assembly-language/code/47_recursive-procedure_impl/). 연습: [재귀 호출 스택 추적 연습](/Hongs_Blog/studies/assembly-language/recursion-stack-practice/)
- 고급 언어의 재귀 함수는 모두 이 모양으로 번역된다. 컴파일러가 호출마다 프레임을 쌓고 걷는 코드를 만든다. [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- 흔한 실수와 한계[^s1].
    - 바닥 조건을 빼먹는다. `CalcSum`에서 `jz L2`를 지우면 ECX가 0을 지나 계속 줄면서 스택이 끝없이 자란다.
    - 음수를 넣는다. `ja`는 부호 없이 견주므로 −1(FFFFFFFFh)은 아주 큰 수로 보인다. 40억 번 넘게 자기를 부르려다 스택이 바닥난다.
    - 13!부터는 틀린다. 13! = 6,227,020,800은 32비트(약 42억 9천만)를 넘는다. `mul`이 넘친 부분을 EDX에 넣고 EAX에는 아래 32비트 7328CC00h만 남는다.
    - `Factorial`은 EBX와 EDX를 맡아 두지 않고 고쳐 쓴다. 부르는 쪽이 이 두 레지스터에 든 값을 계속 쓰려면 미리 맡겨야 한다.
- 돌아온 뒤 할 일이 없는 재귀(`CalcSum`)는 값을 레지스터에만 둬도 된다. 돌아온 뒤 할 일이 있는 재귀(`Factorial`)는 호출마다 값을 프레임에 둬야 한다[^s1].

## 연결

- 선수: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/), [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)(`ret 4`), [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)(`ja`, `jz`)
- `ja`가 부호 없는 비교인 것: [부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/)
- 재귀를 문제 푸는 방법으로 쓰는 쪽: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/). 거기서 말하는 "호출 스택"이 이 문서의 프레임 더미다.
- 정확성 증명의 도구: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)
- 컴파일러 과목에서는 호출들이 이루는 나무와 그때의 스택을 함께 본다: [활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/)
- 같은 일을 반복문으로: [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"자기를 다시 부르면 n이 든 자리가 덮어써져서, 돌아왔을 때 n이 바뀌어 있다"</div>

틀렸다. 코드가 한 벌이고 `[ebp+8]`이라는 글자도 하나라서 자리도 하나일 것처럼 보인다. 그런데 `[ebp+8]`은 "지금 EBP에서 8 위"라는 뜻이고, EBP가 호출마다 다르다. 3!을 구할 때 네 호출의 EBP는 0FF4h, 0FE8h, 0FDCh, 0FD0h이고, 그래서 $$n$$이 든 주소도 0FFCh, 0FF0h, 0FE4h, 0FD8h로 다 다르다. 안쪽 호출은 끝날 때 `pop ebp`로 바깥 호출의 EBP를 되살리므로, 돌아온 바깥 호출이 `[ebp+8]`을 읽으면 자기 $$n$$이 나온다. 확인하는 법: 올라오는 길의 표에서 `[ebp+8]`이 1, 2, 3으로 호출마다 제 값을 읽는지 본다. 반대로 값을 레지스터 하나에만 두면 정말로 덮인다. `CalcSum`의 ECX는 돌아왔을 때 0이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 재귀 프로시저에 꼭 있어야 하는 두 갈래를 쓰고, Factorial의 프레임 하나에 든 세 가지와 그 크기를 쓰라.</summary>

**답:** 자기를 부르지 않고 답을 내는 바닥 조건과, 문제를 더 작게 만들어 자기를 부르는 재귀 단계. 프레임에는 $$n$$, 복귀 주소, 맡아 둔 EBP가 4바이트씩 들어 12바이트다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** ESP = 00001000h에서 `push 2`, `call Factorial`을 한다. 호출은 몇 번 일어나는가? 가장 깊을 때의 ESP와, 그때 스택에 든 아홉 칸을 높은 주소부터 쓰라(main의 EBP는 00001010h).</summary>

**답:** 세 번. 가장 깊을 때 ESP = 00000FDCh(36바이트). 높은 주소부터 2, ReturnMain, 00001010h / 1, ReturnFact, 00000FF4h / 0, ReturnFact, 00000FE8h.<br>
**이유:** 호출마다 12바이트. 맡아 둔 EBP 자리는 0FF4h, 0FE8h, 0FDCh이고 각 칸에는 바로 위 프레임의 EBP가 들어 있다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `ReturnFact:` 아래의 두 줄 `mov ebx,[ebp+8]`과 `mul ebx`가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 안쪽 호출이 돌려준 $$(n-1)!$$에 이 호출이 받은 $$n$$을 곱해 $$n!$$을 EAX에 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 재귀 호출에서 돌아온 직후 `[ebp+8]`이 안쪽 호출의 $$n - 1$$이 아니라 이 호출의 $$n$$을 읽는다는 것은 어느 명령 덕분인가?</summary>

**답:** 안쪽 호출 끝의 `pop ebp`. 안쪽 호출은 들어오면서 내 EBP를 스택에 맡겼고(`push ebp`), 나가면서 그것을 되살렸다. EBP가 내 프레임을 다시 가리키므로 8 위의 칸은 내가 받은 $$n$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `CalcSum`은 `push ebp`도 `[ebp+8]`도 없이 재귀를 한다. `Factorial`은 왜 그렇게 못 하는가?</summary>

**답:** `CalcSum`은 자기를 부르고 돌아온 뒤 할 일이 `ret`뿐이라, 돌아왔을 때 ECX나 EAX의 옛 값이 필요 없다. `Factorial`은 돌아온 뒤에 자기의 $$n$$을 곱해야 한다. 안쪽 호출들이 같은 레지스터를 고쳐 쓰므로 $$n$$을 레지스터에 둘 수 없고, 호출마다 따로 있는 스택 칸에 둬야 한다.<br>
**이유:** `CalcSum`이 끝났을 때 ECX는 처음의 5가 아니라 0이다. 레지스터 하나는 모든 호출이 함께 쓴다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C6** "Factorial은 어떤 32비트 수를 넣어도 맞는 값을 돌려준다"가 틀렸음을 보이는 입력 둘을 서로 다른 이유로 들라.</summary>

**답:** ① $$n = 13$$: 13!이 $$2^{32}$$를 넘어 EAX에는 아래 32비트(7328CC00h = 1,932,053,504)만 남는다. ② $$n = -1$$(FFFFFFFFh): `ja`가 부호 없이 견주어 "0보다 크다"고 보고 재귀로 들어간다. 바닥에 닿기 전에 스택이 바닥난다.

</details>


[^1]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-2」, p.4 (CalcSum과 "Pushed On Stack / ECX / EAX" 표)
[^2]: 같은 자료, p.3 (재귀의 뜻, 호출 그래프의 고리 그림 A→B→C→D→E→A)
[^3]: 같은 자료, p.5 (C 코드, "새 n이 프레임마다 저장된다", 내려가며 부르기와 되돌아오며 곱하기 그림)
[^4]: 같은 자료, p.7 (12!을 부를 때의 스택 그림, "재귀 호출마다 12바이트")
[^5]: 같은 자료, p.6 (Factorial의 어셈블리 코드)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 바닥 조건과 재귀 단계라는 정리, 입력과 출력, `mul`의 설명, 주소가 적힌 3!의 추적 표와 스택 그림, 정확성 주장과 귀납 증명, 스스로 설명해 보기, 복잡도 표, 흔한 실수와 한계의 수치, 오해 항목, 카드의 답은 원본에 없다. 시작 주소는 설명용으로 정한 값이다. 실행 결과는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
{% endraw %}
