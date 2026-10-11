---
layout: "note"
title: "스택 프레임"
display_title: "스택 프레임 (Stack Frame)"
kind: "concept"
kind_label: "모델"
num: "41"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Stack Frame", "활성 레코드", "Activation Record", "프레임 포인터", "Frame Pointer", "베이스 포인터", "Base Pointer", "EBP", "프롤로그", "Prologue", "에필로그", "Epilogue"]
description: "프로시저를 한 번 부를 때마다 스택에 그 호출만 쓰는 작업 책상을 하나 편다. 책상에는 넘겨받은 값, 일이 끝나면 돌아갈 곳, 잠시 치워 둔 남의 물건, 자기 메모지가 정해진 순서로 놓인다. 책상 한가운데에 말뚝을 하나 박아 두고 \"말뚝에서 위로 두 칸\", \"아래로 한 칸\"처럼 물…"
prev_url: "/studies/assembly-language/double-shift/"
prev_title: "이중 시프트 SHLD·SHRD"
next_url: "/studies/assembly-language/stack-parameters/"
next_title: "스택 매개변수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/stack-frame/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로시저를 한 번 부를 때마다 스택에 그 호출만 쓰는 작업 책상을 하나 편다. 책상에는 넘겨받은 값, 일이 끝나면 돌아갈 곳, 잠시 치워 둔 남의 물건, 자기 메모지가 정해진 순서로 놓인다. 책상 한가운데에 말뚝을 하나 박아 두고 "말뚝에서 위로 두 칸", "아래로 한 칸"처럼 물건을 찾기 때문에, 스택 꼭대기가 오르내려도 자리가 헷갈리지 않는다. 대신 프로시저는 들어올 때 말뚝을 박고 나갈 때 뽑는 일을 어긋나지 않게 해야 하고, 하나라도 빠뜨리면 엉뚱한 주소로 돌아간다.

</div>


## 예시로 보기

지금까지는 프로시저에 값을 넘길 때 레지스터에 담았다. 레지스터는 몇 개 없어서 넘길 값이 많으면 모자라고, 프로시저가 자기를 다시 부르면 같은 레지스터를 덮어쓴다. 그래서 값을 스택에 넣어 넘긴다. 그러면 새 문제가 생긴다. 프로시저 안에서 `push`를 한 번 할 때마다 ESP가 4씩 내려가서, "ESP에서 몇 칸 위"로 값을 찾으면 그 거리가 계속 바뀐다.

두 수를 더하는 `AddTwo`를 부르는 코드로 본다[^1].

```asm
main PROC
    push 6              ; 둘째 인수
    push 5              ; 첫째 인수
    call AddTwo         ; EAX = 11
    ...
main ENDP

AddTwo PROC
    push ebp            ; ① 부른 쪽의 EBP를 스택에 맡긴다
    mov  ebp,esp        ; ② EBP를 지금 꼭대기에 고정한다 (말뚝)
    mov  eax,[ebp+12]   ; 둘째 인수 6
    add  eax,[ebp+8]    ; 첫째 인수 5를 더한다
    pop  ebp            ; ③ 맡겨 둔 EBP를 돌려놓는다
    ret  8              ; ④ 돌아가면서 인수 8바이트를 치운다
AddTwo ENDP
```

ESP가 `00001000h`, main이 쓰던 EBP가 `00001010h`인 상태에서 시작하면 명령마다 이렇게 바뀐다[^s1].

| 명령 | ESP | EBP | EAX | 일어난 일 |
|---|---|---|---|---|
| (시작) | 00001000 | 00001010 | | |
| `push 6` | 00000FFC | 00001010 | | 6을 넣는다 |
| `push 5` | 00000FF8 | 00001010 | | 5를 넣는다 |
| `call AddTwo` | 00000FF4 | 00001010 | | 복귀 주소를 넣고 AddTwo로 간다 |
| `push ebp` | 00000FF0 | 00001010 | | main의 EBP를 넣는다 |
| `mov ebp,esp` | 00000FF0 | 00000FF0 | | 말뚝을 박는다 |
| `mov eax,[ebp+12]` | 00000FF0 | 00000FF0 | 00000006 | 0FFCh의 값을 읽는다 |
| `add eax,[ebp+8]` | 00000FF0 | 00000FF0 | 0000000B | 0FF8h의 값을 더한다 |
| `pop ebp` | 00000FF4 | 00001010 | 0000000B | main의 EBP가 돌아온다 |
| `ret 8` | 00001000 | 00001010 | 0000000B | 복귀 주소를 꺼내고 8을 더 올린다 |

`mov ebp,esp` 직후의 스택이다. 주소는 위로 갈수록 크다.

```
   주소        든 값                     EBP에서 본 자리
 00001000   (main이 쓰던 곳)
 00000FFC   00000006   둘째 인수          [EBP+12]
 00000FF8   00000005   첫째 인수          [EBP+8]
 00000FF4   복귀 주소                     [EBP+4]
 00000FF0   00001010   main의 EBP         [EBP]     ← EBP, ESP
            (아직 안 쓴 곳)
```

0FF0h부터 0FFCh까지의 네 칸이 이 호출의 스택 프레임이다. 끝나고 나면 ESP와 EBP가 모두 처음 값으로 돌아와 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적 표의 모든 ESP·EBP·EAX, 그림의 주소별 값, 레지스터를 맡기는 예, 정리를 빠뜨린 고장 두 가지, 카드 C4 — [41_stack-frame_verify.py](/Hongs_Blog/studies/assembly-language/code/41_stack-frame_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

스택 프레임은 프로시저 호출 하나가 스택에서 차지하는 구역이다. 활성 레코드(activation record)라고도 부른다. 여기에 복귀 주소, 넘겨받은 매개변수, 맡아 둔 레지스터, 지역 변수가 들어간다[^2].

프레임은 세 걸음으로 만들어진다[^2].

1. 부르는 쪽이 인수를 스택에 넣고 프로시저를 부른다(`push`, `call`).
2. 불린 프로시저가 EBP를 스택에 넣고, EBP에 ESP 값을 넣는다(`push ebp`, `mov ebp,esp`).
3. 지역 변수가 필요하면 ESP에서 상수를 빼서 자리를 만든다(`sub esp,n`).

EBP를 베이스 포인터 또는 프레임 포인터라고 부른다. 프레임의 기준 주소를 들고 있기 때문이다. 프로시저는 EBP에서 일정한 거리만큼 떨어진 자리로 매개변수를 읽는다. EBP는 프로시저가 도는 동안 바뀌지 않고, 돌아갈 때는 원래 값으로 되돌려야 한다[^3].

기호로 쓰면, 4바이트 인수를 $$m$$개 넣고 부른 프로시저가 2번 걸음까지 마쳤을 때 EBP 기준의 자리는 다음과 같다. $$[\mathrm{EBP}+d]$$는 "EBP에 든 주소에 $$d$$를 더한 곳의 4바이트"라고 읽는다.

| 자리 | 든 것 |
|---|---|
| $$[\mathrm{EBP}+4+4k]$$, $$k = 1, \dots, m$$ | 마지막에서 $$k$$번째로 넣은 인수 |
| $$[\mathrm{EBP}+4]$$ | 복귀 주소 |
| $$[\mathrm{EBP}]$$ | 부른 쪽의 EBP |
| $$[\mathrm{EBP}-4]$$, $$[\mathrm{EBP}-8]$$, … | 지역 변수, 맡아 둔 레지스터 |

$$k = 1$$을 넣으면 $$[\mathrm{EBP}+8]$$이다. 가장 나중에 넣은 인수가 EBP에서 가장 가깝다. 위 예에서 마지막에 넣은 5가 $$[\mathrm{EBP}+8]$$, 그 앞에 넣은 6이 $$[\mathrm{EBP}+12]$$에 있다[^s1].

## 지키는 것과 지키지 못하는 것

**주장.** 프로시저가 ① `push ebp`, `mov ebp,esp`로 시작하고 ② 몸통에서 EBP에 값을 쓰지 않고 ③ 끝에서 ESP를 EBP와 같은 자리로 되돌린 뒤 `pop ebp`, `ret`을 하면, 다음 둘이 늘 맞다[^s1].

- 몸통의 어느 줄에서든 $$[\mathrm{EBP}+4+4k]$$는 같은 인수다. ESP가 얼마든 상관없다.
- 돌아간 직후 EBP는 부르기 전 값이고, 실행은 `call` 다음 명령에서 이어진다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">왜 그런가</summary>

인수를 넣기 직전의 ESP를 $$E$$라 하자.
1. 인수 $$m$$개를 넣으면 ESP는 $$E - 4m$$이다. — `push`는 ESP를 4 줄이고 그 자리에 쓴다
2. `call`이 복귀 주소를 넣어 ESP는 $$E - 4m - 4$$다. — `call`의 정의
3. `push ebp`가 부른 쪽 EBP를 넣어 ESP는 $$E - 4m - 8$$이다.
4. `mov ebp,esp`로 EBP $$= E - 4m - 8$$이 된다. 이때 $$[\mathrm{EBP}]$$는 3에서 넣은 옛 EBP, $$[\mathrm{EBP}+4]$$는 2의 복귀 주소, $$[\mathrm{EBP}+8]$$은 1에서 마지막에 넣은 인수다. — 넣은 순서의 거꾸로
5. 몸통은 EBP에 쓰지 않으므로(가정 ②) EBP는 계속 $$E - 4m - 8$$이다. 몸통의 `push`와 `pop`은 ESP와 EBP 아래쪽 메모리만 바꾼다. 그래서 4의 세 자리는 몸통 내내 같은 값이다. — 첫째 주장
6. 끝에서 ESP가 EBP와 같으면(가정 ③) `pop ebp`는 $$[\mathrm{EBP}]$$, 곧 옛 EBP를 꺼낸다. ESP는 $$E - 4m - 4$$가 되고 `ret`은 그 자리의 복귀 주소를 꺼낸다. — 둘째 주장 ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 4번 줄에서 마지막에 넣은 인수가 왜 하필 +8인가</summary>

EBP가 가리키는 칸에 옛 EBP(4바이트), 그 위 칸에 복귀 주소(4바이트)가 있다. 두 칸을 건너야 인수가 나온다. 4 + 4 = 8이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 5번 줄에서 몸통의 push가 매개변수 자리를 망가뜨리지 않는 이유</summary>

`push`는 ESP를 먼저 4 줄인 뒤 그 자리에 쓴다. ESP는 EBP와 같거나 더 낮은 주소에 있으므로, 쓰는 곳은 늘 EBP보다 아래다. 매개변수는 EBP보다 위에 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 6번 줄에서 ESP가 EBP와 다르면 무슨 일이 생기는가</summary>

`pop ebp`가 옛 EBP가 아니라 그 순간 꼭대기에 있던 다른 값을 꺼낸다. 이어지는 `ret`도 한 칸 어긋난 값을 복귀 주소로 꺼낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 논증의 핵심 아이디어는?</summary>

움직이는 기준(ESP) 대신 움직이지 않는 기준(EBP)을 하나 세우고, 모든 자리를 그 기준에서의 거리로 적는다. 기준이 그대로면 거리도 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

지역 변수([지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/))는 같은 기준에서 아래쪽 거리로 적는다. 컴파일러가 함수마다 변수 자리를 정할 때도 프레임 포인터에서의 거리를 표에 적어 둔다([활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)).

</details>


**지키지 못하는 것.**

- 인수를 스택에서 누가 치우는지는 프레임이 정해 주지 않는다. 부르는 쪽과 불린 쪽이 따로 약속해야 한다. → [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)
- 인수의 개수, 크기, 넣는 순서가 맞는지 아무도 검사하지 않는다. 하나를 덜 넣으면 프로시저는 그 자리에 있던 다른 값을 인수로 읽는다.
- EAX, ECX 같은 다른 레지스터는 저절로 지켜지지 않는다. 지키려면 프로시저가 직접 맡아 둬야 한다(아래).

**고장 나는 길.** 같은 코드에서 한 줄씩 빼고 흉내 내 보면 이렇게 된다[^s1].

| 빠뜨린 것 | 일어나는 일 |
|---|---|
| 끝의 `pop ebp` | `ret`이 꼭대기에 남은 옛 EBP 값 `00001010h`를 복귀 주소로 알고 그 주소로 뛴다 |
| 몸통에서 `push eax`를 하고 `pop`을 안 함 | `pop ebp`가 EAX 값(11)을 EBP에 넣고, `ret`이 옛 EBP 값으로 뛴다 |

두 경우 모두 어셈블러는 아무 경고도 하지 않는다. 실행해 봐야 프로그램이 엉뚱한 곳에서 죽는다.

## 레지스터 맡아 두기

프로시저가 안에서 고쳐 쓰는 레지스터는 `mov ebp,esp` 바로 다음에 스택에 넣어 두고, 끝에서 거꾸로 순서로 꺼낸다[^4].

```asm
MySub PROC
    push ebp
    mov  ebp,esp
    push ecx            ; 고쳐 쓸 레지스터를 맡긴다
    push edx
    mov  ecx,[ebp+8]    ; ESP가 8 내려갔어도 매개변수는 여전히 [ebp+8]
    ...
    pop  edx            ; 넣은 순서의 거꾸로
    pop  ecx
    pop  ebp
    ret  4
MySub ENDP
```

`push 7` 다음 `call MySub`로 부르면 `push edx` 직후의 프레임은 이렇다[^s1].

```
   주소        든 값                     EBP에서 본 자리
 00000FFC   00000007   매개변수           [EBP+8]
 00000FF8   복귀 주소                     [EBP+4]
 00000FF4   main의 EBP                    [EBP]     ← EBP
 00000FF0   맡아 둔 ECX                   [EBP-4]
 00000FEC   맡아 둔 EDX                   [EBP-8]   ← ESP
```

EBP를 먼저 세운 뒤에 레지스터를 넣었기 때문에 매개변수의 자리는 레지스터를 몇 개 맡기든 `[ebp+8]`이다. `USES ecx edx`를 쓰면 어셈블러가 프로시저 맨 앞에 `push ecx`, `push edx`를 만들어 넣는다[^5]. 이 두 줄이 직접 쓴 `push ebp`보다 먼저 실행되면 매개변수까지의 거리가 8만큼 늘어난다[^s1]. → [레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)

## 활용

- 고급 언어의 함수 호출은 모두 이 틀로 번역된다. 컴파일러가 함수마다 `push ebp`, `mov ebp,esp`와 같은 일을 하는 코드를 만들어 붙인다[^s1]. → [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)
- 프레임마다 "부른 쪽의 EBP"가 들어 있어서, 이 값을 따라 올라가면 누가 누구를 불렀는지 차례로 알 수 있다. 재귀에서 이 사슬이 그대로 보인다. → [재귀 프로시저](/Hongs_Blog/studies/assembly-language/recursive-procedure/)
- 비용: 호출 한 번에 스택 8바이트(복귀 주소와 옛 EBP)가 기본으로 들고, 인수·지역 변수·맡긴 레지스터만큼 더 든다[^s1].
- 흔한 실수: 첫 매개변수를 `[ebp+4]`로 읽는다(거기는 복귀 주소다). `pop` 순서를 `push`와 같은 순서로 쓴다. 몸통에서 EBP를 다른 계산에 쓴다.
- 연습: [스택 프레임 그리기 예제 사다리](/Hongs_Blog/studies/assembly-language/stack-frame-ladder/)

## 연결

- 선수: [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/), [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/). `[ebp+8]` 꼴로 메모리를 읽는 법: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)
- 프레임의 각 부분: 위쪽 [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), 아래쪽 [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/), 치우는 약속 [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)
- 컴파일러 과목에서는 같은 것을 활성 레코드라고 부르고, 함수 하나가 불릴 때 필요한 정보를 묶은 자료구조로 다룬다. 거기서는 스택이 자라는 방향과 레지스터 이름이 다르지만(수업용 MIPS의 `$fp`, `$sp`, `$ra`) 넣는 내용은 같다: [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"매개변수는 ESP로 읽어도 똑같다. EBP는 없어도 된다"</div>

틀렸다. 프로시저에 막 들어온 순간에는 첫 매개변수가 `[esp+4]`에 있으니 그럴듯해 보인다. 그런데 몸통에서 `push`를 한 번 하면 같은 매개변수가 `[esp+8]`로, 두 번 하면 `[esp+12]`로 밀려난다. 위의 MySub에서 `push ecx`, `push edx` 뒤에 ESP는 8 내려갔지만 `[ebp+8]`은 여전히 7을 읽는다. ESP 기준으로 쓰려면 `push`와 `pop`이 나올 때마다 거리를 다시 계산해야 하고, 한 군데만 틀려도 다른 값을 읽는다. EBP를 고정해 두면 거리를 한 번만 정하면 된다. 확인하는 법: 추적 표에서 ESP 열은 줄마다 바뀌고 EBP 열은 몸통 내내 같은 값인지 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 스택 프레임에 들어가는 네 가지와, 프레임이 만들어지는 세 걸음을 쓰라.</summary>

**답:** 복귀 주소, 넘겨받은 매개변수, 맡아 둔 레지스터, 지역 변수. ① 부르는 쪽이 인수를 스택에 넣고 `call` ② 불린 쪽이 `push ebp`, `mov ebp,esp` ③ 지역 변수가 필요하면 `sub esp,n`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `push ebp`와 `mov ebp,esp` 직후에 첫 매개변수가 `[ebp+4]`가 아니라 `[ebp+8]`에 있는 이유는?</summary>

**답:** `[ebp]`에는 방금 넣은 부른 쪽의 EBP가, `[ebp+4]`에는 `call`이 넣은 복귀 주소가 있다. 인수는 그 둘보다 먼저 넣었으므로 두 칸(8바이트) 위에서 시작한다.<br>
**이유:** 스택에는 나중에 넣은 것이 낮은 주소에 놓인다. 넣은 순서는 인수 → 복귀 주소 → 옛 EBP다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 몸통에서 `push`와 `pop`을 아무리 해도 `[ebp+8]`이 같은 매개변수를 가리키는 것은 어떤 두 사실에서 나오는가?</summary>

**답:** ① 몸통이 EBP에 값을 쓰지 않으므로 EBP가 그대로다. ② `push`는 ESP를 줄인 뒤 그 자리에 쓰므로, 쓰이는 곳은 늘 EBP보다 낮은 주소다. 매개변수는 EBP보다 높은 주소에 있으므로 덮이지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** ESP = 00001000h에서 `push 10`, `push 20`, `push 30`, `call F`를 하고, F가 `push ebp`, `mov ebp,esp`를 마쳤다. EBP의 값, `[ebp+8]`과 `[ebp+16]`의 값을 쓰라. F가 `pop ebp`, `ret 12`로 끝나면 돌아온 뒤 ESP는?</summary>

**답:** EBP = 00000FECh. `[ebp+8]` = 30, `[ebp+16]` = 10. 돌아온 뒤 ESP = 00001000h.<br>
**이유:** `push` 세 번에 0FF4h, `call`에 0FF0h, `push ebp`에 0FECh. 마지막에 넣은 30이 가장 가깝다. `pop ebp`로 0FF0h, `ret`이 복귀 주소를 꺼내 0FF4h, 12를 더해 1000h[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** "끝에서 `pop ebp`를 빼먹어도 EBP만 틀어질 뿐 돌아가기는 한다"가 틀렸음을 위의 AddTwo로 보여라.</summary>

**답:** `pop ebp`를 빼면 `ret`을 실행할 때 스택 꼭대기(0FF0h)에 든 것은 복귀 주소가 아니라 맡겨 둔 EBP 값 00001010h다. `ret`은 이 값을 주소로 알고 꺼내 그리로 뛴다. main의 `call` 다음 명령으로 돌아가지 못한다.<br>
**이유:** `ret`은 꼭대기에 무엇이 있든 그것을 복귀 주소로 쓴다. 복귀 주소가 꼭대기에 오도록 맞추는 것은 프로시저의 일이다[^s1].

</details>


[^1]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.2 (AddTwo의 호출과 몸통). 인수 값 5와 6은 10.wk10-chapt_08-3-3.pdf, p.7의 val1, val2
[^2]: 어셈블리어 10회 강의 자료 「wk10-chapt_08-3-3」, p.4 (스택 프레임의 뜻, 활성 레코드, 만드는 세 걸음)
[^3]: 같은 자료, p.13 (EBP 기준의 일정한 거리, 베이스 포인터·프레임 포인터, EBP는 바뀌지 않고 되돌려야 한다). p.10과 p.12에 CALL 뒤의 스택 그림
[^4]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.4 (레지스터를 `mov ebp,esp` 바로 다음에 넣는다)
[^5]: 같은 자료, p.5 (USES가 만드는 push와 pop)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 주소가 적힌 추적 표와 스택 그림, EBP 기준 자리의 일반식, 주장과 그 논증, 스스로 설명해 보기, 지키지 못하는 것, 고장 나는 길의 두 경우, MySub의 몸통과 프레임 그림, USES 때 거리가 늘어난다는 말, 비용, 오해 항목, 카드의 답은 원본에 없다. 시작 주소 00001000h와 EBP 00001010h는 설명용으로 정한 값이다. 실행 결과는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
{% endraw %}
