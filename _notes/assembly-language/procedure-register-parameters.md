---
layout: "note"
title: "레지스터 매개변수와 USES"
display_title: "레지스터 매개변수와 USES"
kind: "concept"
kind_label: "기법"
num: "27"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Procedure Parameters", "프로시저 매개변수", "레지스터 매개변수", "Register Parameters", "USES", "USES 연산자", "레지스터 보존", "지역 레이블", "Local Label", "전역 레이블", "Global Label"]
description: "심부름을 시킬 때 \"식탁 위의 그 봉투를 부쳐 줘\"라고 하면 그 봉투만 부칠 수 있다. \"내가 건네는 봉투를 부쳐 줘\"라고 하면 어떤 봉투든 된다. 프로시저도 다룰 자료의 이름을 코드에 박아 두지 않고, 부르는 쪽이 약속한 레지스터에 자료의 위치와 개수를 담아 건네면 어떤 자료에나…"
prev_url: "/studies/assembly-language/call-ret/"
prev_title: "프로시저와 CALL·RET"
next_url: "/studies/assembly-language/irvine32-library/"
next_title: "Irvine32 라이브러리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/procedure-register-parameters/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

심부름을 시킬 때 "식탁 위의 그 봉투를 부쳐 줘"라고 하면 그 봉투만 부칠 수 있다. "내가 건네는 봉투를 부쳐 줘"라고 하면 어떤 봉투든 된다. 프로시저도 다룰 자료의 이름을 코드에 박아 두지 않고, 부르는 쪽이 약속한 레지스터에 자료의 위치와 개수를 담아 건네면 어떤 자료에나 쓸 수 있다. 대신 프로시저가 일하면서 그 레지스터들을 바꿔 놓으므로, 부른 쪽이 계속 쓸 레지스터는 프로시저가 들어올 때 치워 두고 나갈 때 되돌려야 한다. 이 치우고 되돌리는 코드를 어셈블러가 대신 써 주게 할 수 있는데, 결과를 돌려줄 레지스터까지 되돌리게 하면 답이 지워진다.

</div>


## 예시로 보기

배열의 합을 구하는 프로시저를 처음에는 이렇게 쓰기 쉽다[^1].

```asm
ArraySum PROC
    mov esi,0                   ; 인덱스
    mov eax,0                   ; 합
    mov ecx,LENGTHOF myArray    ; 원소 수
L1: add eax,myArray[esi]
    add esi,4
    loop L1
    mov theSum,eax              ; 합을 변수에 넣는다
    ret
ArraySum ENDP
```

`myArray`와 `theSum`이라는 이름이 코드에 박혀 있다. 프로그램에 배열이 둘, 셋이면 어떻게 할까?[^1] 이 프로시저로는 `myArray`밖에 못 더한다. 배열마다 프로시저를 하나씩 복사해야 한다.

이름 대신 레지스터로 받게 고친다[^2].

```asm
ArraySum PROC
; Receives: ESI points to an array of doublewords,
;           ECX = number of array elements.
; Returns:  EAX = sum
;-----------------------------------------------------
    mov eax,0                   ; 합
L1: add eax,[esi]               ; ESI가 가리키는 원소를 더한다
    add esi,4
    loop L1
    ret
ArraySum ENDP
```

부르는 쪽이 ESI에 배열의 주소를, ECX에 원소 수를 넣고 부른다. 합은 EAX로 돌아온다.

```asm
    mov esi,OFFSET arrA
    mov ecx,LENGTHOF arrA
    call ArraySum               ; EAX = arrA의 합
    mov esi,OFFSET arrB
    mov ecx,LENGTHOF arrB
    call ArraySum               ; EAX = arrB의 합
```

`arrA`가 1, 2, 3, 4이고 `arrB`가 10, 20, 30이면 EAX는 차례로 10, 60이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 판의 ArraySum 결과(10, 10과 60), 부른 뒤 ESI·ECX가 바뀌어 있는 것, USES가 만드는 push·pop 줄과 그 뒤 레지스터 값, EAX를 USES에 넣으면 답이 지워지는 것, 카드 C2 — [27_procedure-register-parameters_verify.py](/Hongs_Blog/studies/assembly-language/code/27_procedure-register-parameters_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다. 레이블이 보이는 범위는 어셈블러가 하는 검사라 흉내 내지 않았다)</div>

</div>


## 레지스터로 주고받기

좋은 프로시저는 여러 프로그램에서 쓸 수 있다. 특정 변수 이름을 가리키면 그럴 수 없다. 받는 값(매개변수)은 실행할 때마다 달라질 수 있어서 프로시저를 어디에나 쓸 수 있게 한다[^3].

어느 레지스터로 무엇을 받고 무엇을 돌려주는지는 프로시저 머리의 주석(Receives, Returns)에 적는다([프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/)). 어셈블러는 이것을 검사해 주지 않는다. 부르는 쪽이 주석을 읽고 맞춰야 한다[^s1].

## USES: 레지스터를 치우고 되돌리기

위의 `ArraySum`은 일하면서 ESI를 배열 끝으로 옮기고 ECX를 0으로 만든다. 부른 쪽이 그 레지스터를 계속 쓰고 있었다면 값이 망가진다. 프로시저가 들어올 때 올려 두고 나갈 때 내리면 된다. `PROC` 뒤에 `USES`와 레지스터 이름을 적으면 MASM이 그 코드를 대신 만든다[^4].

```asm
ArraySum PROC USES esi ecx
    mov eax,0
    etc.
```

MASM은 이것을 다음처럼 바꾼다. `push`와 `pop` 네 줄이 MASM이 넣은 것이다[^4].

```asm
ArraySum PROC
    push esi
    push ecx
    .
    .
    pop ecx
    pop esi
    ret
ArraySum ENDP
```

적은 순서대로 올리고, 거꾸로 순서로 내린다. 레지스터 이름 사이에는 쉼표를 쓰지 않는다. 11주차 슬라이드의 `MySub1 PROC USES ecx edx`도 `push ecx`, `push edx`, `pop edx`, `pop ecx`, `ret`이 된다[^5].

이 프로시저 안에서 스택은 어떻게 되어 있을까? 복귀 주소 위에 레지스터 둘이 더 올라가 있다. ESP가 00001000h일 때 부르면 몸통을 도는 동안 ESP는 00000FF4h다[^s1].

```
 00000FFC  [ 복귀 주소 ]
 00000FF8  [ ESI의 옛 값 ]
 00000FF4  [ ECX의 옛 값 ]←ESP
```

**돌려줄 레지스터는 USES에 넣지 않는다.** `ArraySum PROC USES eax esi ecx`라고 쓰면 `ret` 직전의 `pop eax`가 애써 구한 합을 들어올 때의 옛 값으로 덮어쓴다[^s1].

## 레이블이 보이는 범위

프로시저는 레이블의 울타리이기도 하다. 쌍점 하나로 만든 레이블(`L2:`)은 지역 레이블이라, 같은 프로시저 안의 문장에서만 보인다. 쌍점 둘로 만든 레이블(`L1::`)은 전역 레이블이라 어디서나 보인다[^6].

```asm
main PROC
    jmp L2          ; 오류: L2는 sub2 안에서만 보인다
L1::                ; 전역 레이블
    exit
main ENDP

sub2 PROC
L2:                 ; 지역 레이블
    jmp L1          ; 된다
    ret
sub2 ENDP
```

그래서 프로시저마다 `L1`, `L2` 같은 이름을 다시 써도 서로 부딪히지 않는다[^s1]. [JMP](/Hongs_Blog/studies/assembly-language/jmp-loop/)로 프로시저 밖으로 뛰려면 목적지가 전역 레이블이어야 한다.

## 활용

- 이 기법을 쓸 조건: 넘길 값이 몇 개 안 되고 레지스터에 들어가는 크기다. 배열처럼 큰 것은 통째로 넘기지 않고 주소 하나를 넘긴다.
- 이 기법을 떠올릴 신호: 프로시저 안에 변수 이름이 직접 나온다. 같은 코드를 자료만 바꿔 여러 번 쓰고 싶다.
- 넘길 값이 많거나, 프로시저가 자기 자신을 부르면 레지스터로는 모자란다. 그때는 스택으로 넘긴다([스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)). 누가 어떤 레지스터를 지키는지 정해 둔 약속은 [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)에 있다.
- [Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/)의 프로시저들이 이 방식이다. `WriteString`은 EDX로 주소를, `WriteHex`는 EAX로 값을 받는다.
- 흔한 실수: `LOOP` 안에서 ECX를 바꾸는 프로시저를 부른다. 바깥 횟수가 망가져 끝나지 않는다. 프로시저에 `USES ecx`를 붙이거나 부르기 전후에 `push ecx`, `pop ecx`를 한다.

## 연결

- 선수: [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/)
- 스택으로 넘기는 방식과 그때의 스택 모양: [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/), [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)
- `PROC`에 매개변수 목록까지 적는 문법: [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)
- 컴파일러가 레지스터를 치우고 되돌리는 코드를 만드는 자리: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `ArraySum` 안에 `myArray`라는 이름을 직접 쓰면 무엇이 곤란한가? 레지스터로 받으면 무엇이 달라지는가?</summary>

**답:** 그 프로시저는 `myArray` 하나만 더할 수 있다. 다른 배열을 더하려면 프로시저를 복사해 이름을 고쳐야 한다. ESI에 주소, ECX에 원소 수를 받게 하면 부를 때마다 다른 배열을 건넬 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `ArraySum PROC USES esi ecx`를 ESP = 00001000h, ESI = 배열 주소, ECX = 4인 상태에서 `call`로 불렀다. 몸통의 `L1`을 도는 동안 ESP는 얼마이고, 돌아온 뒤 ESI와 ECX는 무엇인가? `USES`를 뺐다면 돌아온 뒤 ESI와 ECX는?</summary>

**답:** 몸통에서 ESP = 00000FF4h(복귀 주소 4 + 레지스터 둘 8 = 12바이트 아래). 돌아온 뒤 ESI와 ECX는 부르기 전 값 그대로다. `USES`를 빼면 ESI는 배열 주소 + 16, ECX는 0이다.<br>
**이유:** `USES`가 만든 `pop ecx`, `pop esi`가 `ret` 앞에서 옛 값을 되돌린다. 없으면 몸통이 바꾼 값이 그대로 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "`USES`에는 프로시저가 바꾸는 레지스터를 모두 적는 것이 안전하다"가 틀리는 예를 `ArraySum`으로 들라.</summary>

**답:** `ArraySum PROC USES eax esi ecx`. EAX도 프로시저가 바꾸는 레지스터지만, 적으면 `ret` 직전의 `pop eax`가 합을 옛 값으로 덮어써 답이 사라진다.<br>
**이유:** 결과를 돌려주는 레지스터는 바뀐 채로 돌아가야 한다. `USES`에는 부른 쪽이 그대로 남아 있기를 바라는 레지스터만 적는다.

</details>


[^1]: 어셈블리어 6회 강의 자료 「wk06-chapt_05-3-3」, p.12 (변수 이름이 박힌 ArraySum, 배열이 둘 셋이면?)
[^2]: 같은 자료, p.13 (ESI와 ECX로 받는 ArraySum)
[^3]: 같은 자료, p.11 (매개변수가 프로시저를 어디에나 쓸 수 있게 한다)
[^4]: 같은 자료, p.14 (USES 연산자와 MASM이 만드는 코드)
[^5]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.5 (MySub1 PROC USES ecx edx가 만드는 코드)
[^6]: 어셈블리어 6회 강의 자료 「wk06-chapt_05-3-3」, p.10 (지역 레이블과 전역 레이블)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 부르는 쪽 코드와 `arrA`·`arrB`의 값, 어셈블러가 주석을 검사하지 않는다는 점, 몸통에서의 스택 그림, EAX를 USES에 넣을 때의 문제, 같은 레이블 이름을 프로시저마다 다시 쓸 수 있다는 점, 활용 항목, 카드 C1~C3은 원본에 없다. 값은 검증 코드의 파이썬 흉내로 확인했다. EAX를 USES에 넣지 말라는 주의는 Irvine, Assembly Language for x86 Processors 7판 5장의 USES 설명에 있다[확인필요: 절 번호].
{% endraw %}
