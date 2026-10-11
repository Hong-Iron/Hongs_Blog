---
layout: "note"
title: "표 기반 선택"
display_title: "표 기반 선택 (Table-Driven Selection)"
kind: "concept"
kind_label: "기법"
num: "35"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Table-Driven Selection", "표 기반 선택", "테이블 기반 선택", "조회표", "Lookup Table", "다중 선택", "Multiway Selection", "프로시저 오프셋 표", "NEAR PTR", "간접 호출", "Indirect Call"]
description: "병원 안내 데스크는 \"내과는 몇 호, 외과는 몇 호\"를 일일이 외워 답하지 않고 층별 안내표를 훑어 찾는다. 프로그램도 \"A면 이 일, B면 저 일\" 하는 갈림이 수십 개로 늘면, 조건마다 코드를 쓰는 대신 \"값과 그때 할 일이 있는 곳\"을 짝지은 표를 만들어 두고 그 표를 훑는다…"
prev_url: "/studies/assembly-language/conditional-structures/"
prev_title: "조건 구조를 점프로 옮기기"
next_url: "/studies/assembly-language/asm-finite-state-machine/"
next_title: "유한 상태 기계"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/table-driven-selection/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

병원 안내 데스크는 "내과는 몇 호, 외과는 몇 호"를 일일이 외워 답하지 않고 층별 안내표를 훑어 찾는다. 프로그램도 "A면 이 일, B면 저 일" 하는 갈림이 수십 개로 늘면, 조건마다 코드를 쓰는 대신 "값과 그때 할 일이 있는 곳"을 짝지은 표를 만들어 두고 그 표를 훑는다. 선택지를 더할 때 표에 한 줄만 보태면 되고, 찾는 코드는 그대로다. 대신 표의 한 줄이 몇 바이트이고 그 안 어디에 무엇이 있는지를 코드가 정확히 알아야 한다. 한 바이트만 어긋나도 엉뚱한 곳으로 뛴다.

</div>


## 예시로 보기

사용자가 누른 글자가 `'A'`면 `Process_A`를, `'B'`면 `Process_B`를 부르려 한다. [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)대로 쓰면 글자마다 `cmp`, `jne`, `call`, `jmp`가 한 묶음씩 든다. 글자가 네 개면 네 묶음, 스무 개면 스무 묶음이다. 묶음들은 견줄 글자와 부를 프로시저만 다르고 모양이 똑같다. 다른 부분만 뽑아 표로 만들면 묶음은 하나면 된다[^1].

표는 이렇게 생겼다. 글자 한 바이트 뒤에 그 글자일 때 부를 프로시저의 주소 네 바이트가 붙는다[^2].

```
 ┌───┬──────────┬───┬──────────┬───┬──────────┬───┬──────────┐
 │'A'│ 00000120 │'B'│ 00000130 │'C'│ 00000140 │'D'│ 00000150 │
 └───┴──────────┴───┴──────────┴───┴──────────┴───┴──────────┘
   ↑       ↑
 찾을 값  Process_A의 주소
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표 한 줄 5바이트·4줄·모두 20바이트, 메모리에 놓인 바이트 20개, `'A'`~`'D'`에서 부르는 프로시저와 그때의 EBX·ECX·견준 횟수, 없는 글자일 때, `[ebx]`에서 4바이트를 읽으면 나오는 값, 카드 C2 — [35_table-driven-selection_verify.py](/Hongs_Blog/studies/assembly-language/code/35_table-driven-selection_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다. 프로시저 주소 00000120~00000150은 슬라이드 그림의 값을 넣어 줬다)</div>

</div>


## 만드는 법

표 기반 선택은 여러 갈래로 갈라지는 선택 구조를 표 찾기로 바꾼 것이다. 찾을 값과 레이블이나 프로시저의 주소를 담은 표를 만들고, 루프로 표를 훑는다. 견줄 것이 많을 때 알맞다[^1].

### 1단계: 표 만들기

```asm
.data
CaseTable BYTE 'A'              ; 찾을 값
          DWORD Process_A       ; 프로시저의 주소
EntrySize = ($ - CaseTable)
          BYTE 'B'
          DWORD Process_B
          BYTE 'C'
          DWORD Process_C
          BYTE 'D'
          DWORD Process_D
NumberOfEntries = ($ - CaseTable) / EntrySize
```

`DWORD Process_A`처럼 자료 자리에 프로시저 이름을 쓰면 그 프로시저의 주소가 4바이트로 들어간다[^3].

`$`는 "지금 여기의 주소"다([기호 상수와 위치 카운터](/Hongs_Blog/studies/assembly-language/symbolic-constants/)). 첫 줄을 다 쓴 자리에서 `$ - CaseTable`을 계산하니 `EntrySize`는 한 줄의 크기, $$1 + 4 = 5$$다. 표를 다 쓴 자리에서 다시 계산한 `$ - CaseTable`은 표 전체의 크기 20이고, 5로 나눈 `NumberOfEntries`는 4다[^3]. 숫자 5와 4를 직접 쓰지 않았으니 줄을 더해도 두 값이 저절로 맞는다.

메모리에는 다음 20바이트가 놓인다. 주소 00000120h는 낮은 바이트부터 `20 01 00 00`으로 들어간다([리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/))[^s1].

```
 41 20 01 00 00 | 42 30 01 00 00 | 43 40 01 00 00 | 44 50 01 00 00
 'A' Process_A    'B' Process_B    'C' Process_C    'D' Process_D
```

### 2단계: 표 훑기

찾을 글자가 AL에 들어 있다. 표를 한 줄씩 보며 맞는 줄을 찾으면 그 줄에 적힌 주소의 프로시저를 부른다[^4].

```asm
    mov ebx,OFFSET CaseTable    ; EBX가 표의 첫 줄을 가리킨다
    mov ecx,NumberOfEntries     ; 횟수
L1: cmp al,[ebx]                ; 이 줄의 글자와 같은가?
    jne L2                      ; 아니다: 다음 줄로
    call NEAR PTR [ebx + 1]     ; 그렇다: 이 줄에 적힌 프로시저를 부른다
    call WriteString            ; 메시지를 찍는다
    call Crlf
    jmp L3                      ; 루프를 나간다
L2: add ebx,EntrySize           ; 다음 줄로
    loop L1                     ; ECX = 0이 될 때까지
L3:
```

`call NEAR PTR [ebx + 1]`이 핵심이다. EBX는 줄의 첫 바이트(글자)를 가리킨다. 주소는 그 한 바이트 뒤에 있으므로 `[ebx + 1]`에서 읽는다. 지금까지의 `call`은 뒤에 프로시저 이름이 왔다. 여기서는 "이 메모리 칸에 적힌 주소로 가라"다. 대괄호만으로는 거기서 몇 바이트를 읽을지 알 수 없어서 `NEAR PTR`을 붙여, 거기 있는 것이 프로시저의 주소임을 알린다. 슬라이드는 이것을 "프로시저 포인터에 필요하다"고 적는다[^4].

AL = `'C'`일 때를 따라간다. 표가 주소 T에서 시작한다고 하자[^s1].

| 바퀴 | EBX | `[ebx]` | 같은가 | 한 일 | ECX (바퀴 끝) |
|---|---|---|---|---|---|
| 1 | T | `'A'` | 아니다 | `add ebx,5`, `loop` | 3 |
| 2 | T + 5 | `'B'` | 아니다 | `add ebx,5`, `loop` | 2 |
| 3 | T + 10 | `'C'` | 그렇다 | `[ebx + 1]`의 00000140h를 부른다 | 2 |

`Process_C`가 끝나면 `call` 다음 줄로 돌아와 메시지를 찍고 `L3`으로 나간다. 슬라이드에는 `Process_C`의 몸통이 없다. 바로 뒤에 `WriteString`을 부르는 것으로 보아, 각 프로시저가 찍을 문자열의 주소를 EDX에 넣어 돌려주는 것으로 읽힌다[^s1].

표에 없는 글자면 네 줄을 모두 견준 뒤 `loop`가 ECX를 0으로 만들어 아래로 빠진다. 아무 프로시저도 부르지 않는다[^s1].

## 활용

- 이 기법을 쓸 조건: 갈림마다 하는 일의 모양이 같고 "어느 값일 때 어디로"만 다르다. 줄의 크기가 모두 같다.
- 이 기법을 떠올릴 신호: `cmp`와 `je`가 똑같은 모양으로 줄줄이 이어진다. 메뉴 번호, 명령 글자, 상태 번호에 따라 할 일을 고른다.
- 줄줄이 견주는 코드와의 차이: 견주는 횟수는 줄지 않는다. 표도 앞에서부터 하나씩 본다. 줄어드는 것은 코드다. 선택지 하나를 더할 때 표에 5바이트 한 줄만 보태면 되고, 훑는 코드에는 손대지 않는다[^s1].
- 찾을 값이 0, 1, 2, …처럼 이어진 번호면 훑지 않고 번호에 줄 크기를 곱해 그 줄로 바로 갈 수 있다. CPU가 인터럽트 번호로 처리 루틴을 찾는 표가 그렇게 생겼다([INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)).
- 흔한 실수: `call NEAR PTR [ebx]`로 쓴다. 글자 바이트부터 4바이트를 읽어 00012041h 같은 엉뚱한 주소로 간다.
- 흔한 실수: 다음 줄로 갈 때 `add ebx,4`나 `inc ebx`를 쓴다. 한 줄은 5바이트다. `EntrySize`를 쓰면 틀릴 일이 없다.
- C 컴파일러는 구조체 안의 4바이트 값을 4의 배수 주소에 맞추려고 사이에 빈 바이트를 넣는다([데이터 정렬과 패딩](/Hongs_Blog/studies/compilers/data-alignment/)). 여기서는 `BYTE` 바로 뒤에 `DWORD`를 붙여 써서 빈 바이트가 없다. 그래서 한 줄이 8이 아니라 5바이트이고, 주소가 `[ebx + 1]`에 있다[^s1].

## 연결

- 선수: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/), [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), [기호 상수와 위치 카운터](/Hongs_Blog/studies/assembly-language/symbolic-constants/)
- 레지스터에 든 주소에서 떨어진 자리를 읽기: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/), [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/)
- 상태와 입력으로 다음 할 일을 고르는 프로그램: [유한 상태 기계](/Hongs_Blog/studies/assembly-language/asm-finite-state-machine/)
- 번호로 바로 찾아가는 주소 표: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 찾을 값을 `WORD`(2바이트)로, 주소를 `DWORD`로 바꾸고 줄을 6개로 늘렸다. `EntrySize`와 `NumberOfEntries`는 얼마가 되고, 훑는 코드에서 고쳐야 할 곳은 어디인가?</summary>

**답:** `EntrySize` = 6, `NumberOfEntries` = 36 ÷ 6 = 6. 고칠 곳은 둘이다. `cmp al,[ebx]`를 `cmp ax,[ebx]`로, `call NEAR PTR [ebx + 1]`을 `call NEAR PTR [ebx + 2]`로.<br>
**이유:** 두 상수는 `$`로 계산해서 저절로 맞는다. 줄 안에서 주소가 놓인 자리(+1)와 견줄 값의 크기는 코드에 직접 적혀 있어서 손으로 고쳐야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 위 표와 코드에서 AL = `'C'`다. `call NEAR PTR [ebx + 1]`을 실행하는 순간 EBX는 표 시작에서 몇 바이트 뒤인가? 이 `call`이 읽는 4바이트는 표 시작에서 몇 바이트 뒤부터이고, 읽은 값은?</summary>

**답:** EBX는 10바이트 뒤. 읽는 자리는 11바이트 뒤부터 4바이트, 값은 00000140h.<br>
**이유:** 두 줄(5 × 2)을 지나 셋째 줄에 있다. 줄의 첫 바이트는 글자 `'C'`이고 주소는 그다음 바이트부터다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `call NEAR PTR [ebx + 1]`에서 `+ 1`을 빼면 어떻게 되는가? AL = `'A'`일 때 `call`이 가려는 주소를 쓰라.</summary>

**답:** 글자 바이트부터 4바이트 `41 20 01 00`을 읽는다. 리틀 엔디언이라 00012041h로 가려 한다. `Process_A`(00000120h)가 아니다.<br>
**이유:** 줄의 첫 바이트는 찾을 값이지 주소가 아니다. 주소 4바이트 가운데 앞의 셋과 글자가 섞여 읽힌다.

</details>


[^1]: 어셈블리어 9회 강의 자료 「wk09-chapt_06-2-1」, p.21 (표 기반 선택의 뜻과 쓰임)
[^2]: 같은 자료, p.23 (프로시저 오프셋 표 그림: 'A' 00000120, 'B' 00000130, 'C' 00000140, 'D' 00000150)
[^3]: 같은 자료, p.22 (1단계: CaseTable, EntrySize, NumberOfEntries)
[^4]: 같은 자료, p.24 (2단계: 표를 훑는 루프, NEAR PTR은 프로시저 포인터에 필요하다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 메모리에 놓인 20바이트, `'C'`를 찾는 추적 표, 프로시저가 EDX에 문자열 주소를 넣어 돌려준다는 풀이(원본에는 Process_A~D의 몸통이 없다), 없는 글자일 때의 동작, 견주는 횟수는 줄지 않는다는 점, 번호로 바로 찾아가는 표와의 견줌, 빈 바이트가 없다는 점, 활용 항목, 카드 C1~C3은 원본에 없다. 값은 검증 코드의 파이썬 흉내로 확인했다. ASCII 그림은 원본 p.23의 그림을 옮긴 것이다.
{% endraw %}
