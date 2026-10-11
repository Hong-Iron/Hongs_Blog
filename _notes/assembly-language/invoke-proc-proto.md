---
layout: "note"
title: "INVOKE·PROC·PROTO 지시어"
display_title: "INVOKE·PROC·PROTO 지시어"
kind: "concept"
kind_label: "정의"
num: "46"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["INVOKE", "PROC", "PROTO", "ADDR", "INVOKE Directive", "PROC Directive", "PROTO Directive", "프로시저 원형", "Procedure Prototype", "매개변수 목록", "Parameter List"]
description: "스택으로 값을 넘기는 호출을 고급 언어의 함수 호출처럼 한 줄로 쓰게 해 주는 받아쓰기 도구다. 부르는 쪽은 프로시저 이름과 넘길 값만 적고, 불리는 쪽은 받을 값에 이름을 붙여 둔다. 값을 스택에 넣고, 기준점에서 몇 칸 떨어졌는지 세고, 끝나고 치우는 줄은 어셈블러가 대신 써 …"
prev_url: "/studies/assembly-language/offset-vs-lea/"
prev_title: "OFFSET과 LEA 비교"
next_url: "/studies/assembly-language/recursive-procedure/"
next_title: "재귀 프로시저"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/invoke-proc-proto/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

스택으로 값을 넘기는 호출을 고급 언어의 함수 호출처럼 한 줄로 쓰게 해 주는 받아쓰기 도구다. 부르는 쪽은 프로시저 이름과 넘길 값만 적고, 불리는 쪽은 받을 값에 이름을 붙여 둔다. 값을 스택에 넣고, 기준점에서 몇 칸 떨어졌는지 세고, 끝나고 치우는 줄은 어셈블러가 대신 써 넣는다. 손으로 세다 틀리는 일이 줄지만, 기계가 실제로 하는 일이 바뀐 것은 아니어서 넘기는 값의 개수와 크기가 선언과 맞아야 한다.

</div>


## 예시로 보기

두 수를 더하는 프로시저를 [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)로 쓰면, 부르는 쪽은 `push` 두 줄과 `call`을, 불리는 쪽은 `push ebp`, `mov ebp,esp`, `[ebp+8]`, `[ebp+12]`, `pop ebp`, `ret 8`을 손으로 적어야 한다. 넣는 순서나 거리 하나만 틀려도 다른 값을 읽는다.

같은 프로시저를 지시어로 쓰면 이렇다[^1].

```asm
AddTwo PROC,
    val1:DWORD, val2:DWORD

    mov eax,val1
    add eax,val2
    ret
AddTwo ENDP
```

부르는 쪽은 한 줄이다.

```asm
INVOKE AddTwo, 5, 6        ; EAX = 11
```

어셈블러가 이 두 덩어리를 아래처럼 풀어 쓴다[^s1].

```asm
; INVOKE AddTwo, 5, 6           ; AddTwo PROC, val1:DWORD, val2:DWORD
    push 6                      AddTwo PROC
    push 5                          push ebp
    call AddTwo                     mov  ebp,esp
                                    mov  eax,[ebp+8]     ; val1
                                    add  eax,[ebp+12]    ; val2
                                    mov  esp,ebp
                                    pop  ebp
                                    ret  8
                                AddTwo ENDP
```

인수는 뒤에서부터 넣는다. 그래서 첫 인수 5가 맨 나중에 들어가 `[ebp+8]`에 놓이고, 이것이 첫 매개변수 `val1`이다. `ret`은 인수 8바이트를 치우는 `ret 8`로 바뀐다. 이 수업의 프로그램은 `.model flat,stdcall`로 시작하므로 불린 쪽이 치운다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 풀어 쓴 AddTwo가 EAX = 11을 돌려주고 ESP가 제자리로 오는 것, 풀어 쓴 FillArray가 배열 6칸만 0AAh로 채우고 `ret 12`로 돌아오는 것 — [46_invoke-proc-proto_verify.py](/Hongs_Blog/studies/assembly-language/code/46_invoke-proc-proto_verify/) (풀어 쓴 코드를 파이썬 흉내로 돌렸다. 어셈블러가 실제로 만드는 코드는 확인하지 못했다)</div>

</div>


## 정의

**INVOKE.** 32비트 모드에서 `CALL`을 대신해 인수 여러 개를 한 줄로 넘기는 지시어다[^3].

```asm
INVOKE 프로시저이름 [, 인수목록]
```

인수목록은 쉼표로 나눈다. 인수 자리에 올 수 있는 것은 네 가지다[^3][^4].

| 인수의 종류 | 예 |
|---|---|
| 즉시값, 정수 식 | `INVOKE Sub3,eax,(10 * 20)`의 둘째 인수 |
| 변수 이름 | `INVOKE Sub1,byteVal,wordVal` |
| 주소 식, `ADDR` 식 | `INVOKE Sub4,[ebx]`, `INVOKE Sub2,ADDR byteVal` |
| 레지스터 이름 | `INVOKE Sub3,eax,(10 * 20)`의 첫째 인수 |

`ADDR 변수`는 변수의 주소를 넘긴다. [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)의 참조로 넘기기를 `INVOKE` 안에서 쓰는 방법이다. `(10 * 20)` 같은 식은 번역할 때 200으로 계산된다[^s1].

**PROC.** 프로시저를 선언하면서 매개변수에 이름과 자료형을 붙인다[^5].

```asm
이름 PROC 매개변수목록

매개변수 하나의 꼴:   매개변수이름 : 자료형
```

자료형은 `BYTE`, `SBYTE`, `WORD` 같은 기본 자료형이거나 그것을 가리키는 포인터(`PTR BYTE`)다. 매개변수목록을 다음 줄로 넘길 때는 `PROC` 뒤에 쉼표를 붙이고, 매개변수를 여러 줄에 나눠 쓸 때는 줄마다 끝에 쉼표를 붙인다(마지막 줄 빼고)[^6].

```asm
이름 PROC,
    매개변수1:자료형1,
    매개변수2:자료형2,
    매개변수n:자료형n
```

**PROTO.** 프로시저의 이름과 매개변수목록만 먼저 알려 주는 선언이다. 몸통은 없다. `INVOKE`가 프로시저 정의보다 앞에 나올 때, 어셈블러가 인수의 개수와 자료형을 맞춰 볼 수 있게 프로그램 앞쪽에 적어 둔다[^s2]. 이 수업의 모든 프로그램 앞머리에 있던 줄이 바로 이것이다[^2].

```asm
ExitProcess PROTO, dwExitCode:DWORD
...
INVOKE ExitProcess,0
```

`ExitProcess`는 운영체제가 가진 프로시저라 내 프로그램 안에 몸통이 없다. `PROTO` 줄이 "이름은 ExitProcess이고 4바이트 인수 하나를 받는다"를 알려 주기 때문에 `INVOKE ExitProcess,0`을 쓸 수 있다.

## 예제

**FillArray.** 바이트 배열의 주소, 채울 값, 배열 크기를 받아 배열을 그 값으로 채운다[^7].

```asm
FillArray PROC,
    pArray:PTR BYTE, fillVal:BYTE,
    arraySize:DWORD

    mov ecx,arraySize
    mov esi,pArray
    mov al,fillVal
L1: mov [esi],al
    inc esi
    loop L1
    ret
FillArray ENDP
```

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.22는 매개변수목록을 `pArray:PTR BYTE, fillVal:BYTE` 다음 줄에 `arraySize:DWORD`로 적었다. 첫 줄 끝에 쉼표가 없다. / 문제점: p.20의 규칙은 매개변수를 여러 줄에 나눠 쓸 때 줄 끝에 쉼표를 붙이라는 것이다. 쉼표가 없으면 둘째 줄은 매개변수목록에 이어지지 않는다. / 수정안: `fillVal:BYTE,`처럼 첫 줄 끝에 쉼표를 붙인다(위 코드는 붙인 것이다). / 근거: 같은 자료 p.20의 "comma required". 실제 어셈블러로 오류가 나는지는 확인하지 못했다[확인필요].

</div>


`INVOKE FillArray, ADDR array, 0AAh, 6`으로 부른다고 하면 프레임은 이렇게 된다[^s1].

```
            든 값                        EBP에서 본 자리
         00000006   arraySize             [EBP+16]
         000000AA   fillVal               [EBP+12]
         배열의 주소  pArray              [EBP+8]
         복귀 주소                        [EBP+4]
         부른 쪽의 EBP                    [EBP]      ← EBP
```

`fillVal`은 `BYTE`지만 스택에서는 4바이트 한 칸을 차지한다. 스택에는 4바이트 단위로 넣기 때문이다. 그래서 매개변수 셋에 12바이트이고 프로시저는 `ret 12`로 끝난다. 배열 8칸 가운데 앞 6칸만 0AAh가 되고 나머지 2칸은 그대로다.

## 활용

- 손으로 쓴 `push`·`call`·`[ebp+8]`과 지시어로 쓴 코드는 같은 기계어가 된다. 지시어는 번역할 때 풀려서 사라진다[^s1]. [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/)
- 지역 변수를 이름으로 쓰게 해 주는 `LOCAL`도 같은 종류다. 매개변수는 `PROC`의 목록으로, 지역 변수는 `LOCAL`로 이름을 붙이면 `[ebp±n]`을 한 번도 직접 쓰지 않고 프로시저를 짤 수 있다. [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/)
- Java의 메서드 선언 `int addTwo(int val1, int val2)`와 호출 `addTwo(5, 6)`이 각각 `PROC`의 매개변수목록, `INVOKE`와 같은 자리다[^s1]. [필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/)
- 흔한 실수.
    - `INVOKE`가 인수를 넣을 때 EAX와 EDX를 임시로 쓸 수 있다. 32비트보다 작은 인수를 넓혀 넣을 때 그렇다. 그 레지스터에 든 값을 다음 인수로 넘기면 덮인 값이 넘어간다[^s2].
    - 매개변수 이름이 붙은 주소를 `OFFSET`으로 구하려 한다. `LEA`나 `ADDR`을 쓴다. [OFFSET과 LEA 비교](/Hongs_Blog/studies/assembly-language/offset-vs-lea/)
    - `PROC,` 뒤나 줄 끝의 쉼표를 빼먹는다.

## 연결

- 선수: [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)
- `PROTO`와 `INVOKE`가 처음 나온 자리: [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/)
- 레지스터를 맡기는 `USES`도 `PROC` 줄에 함께 적는다: [레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `INVOKE`, `PROC`의 매개변수목록, `PROTO`가 각각 무엇을 대신 써 주거나 알려 주는지 한 줄씩 쓰라.</summary>

**답:** `INVOKE`: 인수를 스택에 넣는 `push`들과 `call`을 대신 쓴다. `PROC`의 매개변수목록: 매개변수에 이름을 붙여 `[ebp+8]` 같은 거리를 대신 세고, 프레임을 세우고 걷는 줄과 `ret n`을 대신 쓴다. `PROTO`: 몸통 없이 이름과 매개변수목록만 먼저 알려 줘서, 정의보다 앞에서(또는 몸통이 다른 곳에 있어도) `INVOKE`를 쓸 수 있게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `Sub3 PROC, a:DWORD, b:DWORD, c:DWORD`가 있다. `INVOKE Sub3, 1, 2, 3`을 `push`와 `call`로 풀어 쓰고, 프로시저 안에서 `a`, `b`, `c`가 각각 EBP에서 몇 칸 떨어진 자리인지 쓰라. 프로시저의 `ret`은 무엇으로 바뀌는가?</summary>

**답:** `push 3` / `push 2` / `push 1` / `call Sub3`. `a` = `[ebp+8]`, `b` = `[ebp+12]`, `c` = `[ebp+16]`. `ret 12`.<br>
**이유:** 뒤 인수부터 넣으므로 첫 인수가 맨 나중에 들어가 EBP에서 가장 가깝다. 4바이트 인수 셋이라 12바이트를 치운다(STDCALL)[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `fillVal:BYTE`는 1바이트 매개변수인데 왜 FillArray는 `ret 9`가 아니라 `ret 12`로 끝나는가?</summary>

**답:** 32비트 모드의 스택에는 4바이트 단위로 넣는다. 1바이트 값도 4바이트 한 칸을 차지하므로 매개변수 셋은 4 × 3 = 12바이트다. 프로시저는 그 한 칸의 맨 아래 1바이트만 `fillVal`로 읽는다.<br>
**이유:** 칸 크기가 섞이면 ESP가 4의 배수에서 벗어나고, `[ebp+8]`, `[ebp+12]`처럼 4씩 세는 거리가 맞지 않게 된다[^s1].

</details>


[^1]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.21 (AddTwo: 두 정수를 받아 합을 EAX로 돌려준다)
[^2]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.15, p.19 (`.model flat,stdcall`, `ExitProcess PROTO, dwExitCode:DWORD`, `INVOKE ExitProcess,0`)
[^3]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.17 (INVOKE의 뜻, 문법, 인수의 종류)
[^4]: 같은 자료, p.18 (INVOKE 예 네 가지)
[^5]: 같은 자료, p.19 (PROC 지시어의 문법, 매개변수의 꼴)
[^6]: 같은 자료, p.20 (매개변수목록을 여러 줄에 쓰는 법, "comma required")
[^7]: 같은 자료, p.22 (FillArray)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `INVOKE AddTwo, 5, 6`이라는 호출, 풀어 쓴 코드, FillArray를 부르는 줄과 프레임 그림, `ret 12`, Java와의 짝, 카드의 답은 원본에 없다. 풀어 쓴 꼴은 슬라이드 p.14가 LOCAL에 대해 보인 "어셈블러가 만드는 코드"와 p.2의 STDCALL 코드를 따라 쓴 것이고, 어셈블러의 목록 파일과 대조하지는 못했다[확인필요]. 풀어 쓴 코드는 파이썬 흉내로 돌려 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> PROTO의 설명과 INVOKE가 EAX·EDX를 덮을 수 있다는 주의는 이 슬라이드 묶음에 없다(목차와 요약에 이름만 있다). Irvine, *Assembly Language for x86 Processors* 7판 8.4절의 내용이다[확인필요].
{% endraw %}
