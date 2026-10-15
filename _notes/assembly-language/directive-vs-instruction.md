---
layout: "note"
title: "지시어와 명령어 비교"
display_title: "지시어와 명령어 비교"
kind: "concept"
kind_label: "비교"
num: "09"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Directive vs Instruction", "지시어", "Directive", "어셈블러 지시어", "명령어", "Instruction", "실행 시간", "Runtime", "어셈블 시간"]
description: "어셈블리어 프로그램의 줄은 모두 비슷하게 생겼지만 읽는 쪽이 둘이다. 어떤 줄은 번역하는 프로그램인 어셈블러가 읽고 따른다. 어떤 줄은 기계어로 바뀌어 나중에 프로세서가 실행한다. 가르는 질문은 \"이 줄을 누가, 언제 따르는가\"다. 요리책으로 치면 \"이 장은 2인분 기준이다\"는 책…"
prev_url: "/studies/assembly-language/asm-statement-elements/"
prev_title: "어셈블리 문장의 구성"
next_url: "/studies/assembly-language/asm-program-template/"
next_title: "프로그램 틀"
math: false
mermaid: false
code_count: 0
permalink: "/studies/assembly-language/directive-vs-instruction/"
---
{% raw %}
어셈블리어 프로그램의 줄은 모두 비슷하게 생겼지만 읽는 쪽이 둘이다. 어떤 줄은 번역하는 프로그램인 어셈블러가 읽고 따른다. 어떤 줄은 기계어로 바뀌어 나중에 프로세서가 실행한다. 가르는 질문은 "이 줄을 누가, 언제 따르는가"다. 요리책으로 치면 "이 장은 2인분 기준이다"는 책을 읽는 사람에게 하는 말이고, "양파를 썬다"는 실제로 하는 동작이다.

## 어느 쪽일까

다음 프로그램의 줄들을 본다.

```asm
INCLUDE Irvine32.inc
.data
val1     DWORD 10000h
val2     DWORD 40000h
.code
main PROC
    mov  eax,val1
    add  eax,val2
    call DumpRegs
    exit
main ENDP
END main
```

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `.data`, `mov eax,val1`, `main PROC`, `add eax,val2`, `END main`은 각각 지시어인가 명령어인가?</summary>

**답:** `.data`, `main PROC`, `END main`은 지시어다. `mov eax,val1`과 `add eax,val2`는 명령어다.<br>
**이유:** `.data`는 "여기부터 변수 구역이다", `main PROC`는 "여기서 main이라는 프로시저가 시작한다", `END main`은 "원본은 여기까지다"라고 어셈블러에게 알린다. 프로세서가 실행할 동작이 아니다. `mov`와 `add`는 기계어로 바뀌어 프로그램이 돌 때 프로세서가 실행한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `val1 DWORD 10000h`는 지시어인가 명령어인가? 이 줄 때문에 프로그램에 4바이트가 생기는데도 그렇게 답하는 까닭은?</summary>

**답:** 지시어다. `DWORD`는 "32비트짜리 자리를 하나 잡고 `10000h`를 넣어 두라"고 어셈블러에게 시키는 말이다. 생기는 4바이트는 프로세서가 실행하는 명령이 아니라 값이 담긴 자리다.<br>
**흔한 오답:** "프로그램에 바이트가 생기니 명령어다". 가르는 기준은 바이트가 생기느냐가 아니라 프로세서가 그것을 명령으로 실행하느냐다[^s1].

</details>


## 결정적 차이

| | 지시어 (directive) | 명령어 (instruction) |
|---|---|---|
| 누가 따르나 | 어셈블러 | 프로세서 |
| 언제 | 원본을 번역할 때 | 프로그램이 돌 때 |
| 기계어 명령이 되나 | 안 된다. 인텔 명령어 집합에 들어 있지 않다 | 된다. 어셈블러가 기계어로 바꾼다 |
| 하는 일 | 코드 구역과 데이터 구역 알리기, 메모리 모델 고르기, 프로시저 알리기, 변수 자리 잡기 | 값 옮기기, 계산하기, 다른 곳으로 뛰기 |
| 어셈블러가 바뀌면 | 달라진다. NASM의 지시어는 MASM과 같지 않다 | 같은 프로세서면 같은 명령어 집합을 쓴다 |
| 예 | `.data`, `.code`, `PROC`, `ENDP`, `END`, `DWORD` | `MOV`, `ADD`, `SUB`, `INC`, `CALL` |

표를 한 줄로 줄이면 이렇다. 지시어는 어셈블러가 읽고 따르고, 명령어는 프로그램이 돌 때 프로세서가 실행한다.

지시어도 명령 니모닉도 대문자와 소문자를 가리지 않는다. `.DATA`와 `.data`, `MOV`와 `mov`는 같다.

## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위 프로그램에서 지시어도 명령어도 아닌 조각, 그리고 "지시어인데 명령어가 만들어지는" 줄을 찾아라.</summary>

**답:** ① 주석(`;` 뒤)은 어셈블러가 건너뛴다. 누구도 따르지 않는다. ② 레이블(`val1`, `val2`, `main`)은 줄에 붙은 이름표다. 그 자리의 주소를 이름으로 부르게 해 줄 뿐, 혼자서는 지시도 동작도 아니다. ③ `exit`는 어셈블러가 읽는 말인데, 어셈블러가 그 자리에 프로시저를 부르는 명령어를 대신 써넣는다.<br>
**이유:** `exit`는 `INVOKE ExitProcess,0`으로 바뀌는 줄임말이다[^s1]. `INVOKE`는 인텔의 `CALL` 명령을 대신하는 지시어로, 인수를 넘기는 명령과 `CALL`을 어셈블러가 만들어 준다. "지시어는 기계어를 만들지 않는다"는 말은 `.data`나 `PROC` 같은 대부분의 지시어에만 맞다.

</details>


자세한 것은 [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)에 있다. 이름에 값을 붙여 두는 지시어는 [기호 상수와 위치 카운터](/Hongs_Blog/studies/assembly-language/symbolic-constants/)에서, 변수 자리를 잡는 지시어는 [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)에서 다룬다.

[^s1]: 데이터 정의 지시어의 구별은 교재 Irvine, *Assembly Language for x86 Processors* 7판, 3.1절과 3.4절을 따랐다. `exit`는 Irvine32 라이브러리에 딸린 정의 파일 SmallWin.inc에 `exit EQU <INVOKE ExitProcess,0>`으로 적혀 있다. 이 문서에는 계산이 없어 검증 코드를 두지 않았다.
{% endraw %}
