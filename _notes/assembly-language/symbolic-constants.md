---
layout: "note"
title: "기호 상수와 위치 카운터"
display_title: "기호 상수와 위치 카운터 (Symbolic Constants)"
kind: "concept"
kind_label: "정의"
num: "14"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Symbolic Constant", "기호 상수", "등호 지시어", "Equal-Sign Directive", "EQU", "EQU 지시어", "TEXTEQU", "위치 카운터", "현재 위치 카운터", "Current Location Counter", "배열 크기 계산"]
description: "코드 여기저기에 500이라는 수를 직접 쓰는 대신 COUNT라는 이름을 지어 두고 이름을 쓴다. 어셈블러는 기계어로 옮기기 전에 이름을 그 값으로 바꿔 넣으므로, 이름은 메모리를 한 칸도 차지하지 않는다. 값이 바뀌면 한 줄만 고치면 되고, 배열의 크기처럼 손으로 세기 귀찮은 값은…"
prev_url: "/studies/assembly-language/little-endian/"
prev_title: "리틀 엔디언"
next_url: "/studies/assembly-language/operand-types/"
next_title: "피연산자의 종류"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/symbolic-constants/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

코드 여기저기에 500이라는 수를 직접 쓰는 대신 COUNT라는 이름을 지어 두고 이름을 쓴다. 어셈블러는 기계어로 옮기기 전에 이름을 그 값으로 바꿔 넣으므로, 이름은 메모리를 한 칸도 차지하지 않는다. 값이 바뀌면 한 줄만 고치면 되고, 배열의 크기처럼 손으로 세기 귀찮은 값은 어셈블러가 대신 세게 할 수 있다. 다만 크기를 세는 줄은 배열 정의 바로 다음에 두어야 맞는 값이 나온다.

</div>


## 예시로 보기

배열에 값이 몇 개 들었는지 코드에 4라고 직접 써 두면, 배열에 값을 하나 더 넣는 날 그 4를 찾아 모두 고쳐야 한다. 하나라도 놓치면 프로그램은 조용히 틀린다. 어셈블러에게 세게 하면 이 걱정이 사라진다.

어셈블러는 데이터를 놓아 가면서 "다음 바이트가 들어갈 자리"를 늘 기억한다. 그 자리를 `$`로 쓴다. 배열을 다 놓은 직후의 `$`에서 배열이 시작한 자리를 빼면 배열의 바이트 수다[^1].

```asm
list BYTE 10,20,30,40
ListSize = ($ - list)
```

```
오프셋    0     1     2     3     4
바이트    0A    14    1E    28    (다음 자리)
         ▲                       ▲
         list                    $
```

`$`는 4, `list`는 0이라 `ListSize`는 4다. `list`가 어디서 시작하든 차이는 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 바이트·워드·더블워드 배열의 `$ - list`가 4, 8, 16인 것, 시작 주소를 바꿔도 같은 것, 사이에 변수가 끼면 틀리는 것, 카드 C1·C2. 파이썬 흉내로 확인 — [14_symbolic-constants_verify.py](/Hongs_Blog/studies/assembly-language/code/14_symbolic-constants_verify/)</div>

</div>


## 정의

기호 상수는 정수 식이나 글에 붙인 이름이다. 만드는 지시어가 둘 나온다.

| | 등호 지시어 `=` | `EQU` 지시어 |
|---|---|---|
| 쓰는 법 | `이름 = 식` | `이름 EQU <글>` 등 |
| 붙일 수 있는 것 | 32비트 정수(식이나 상수) | 정수 식이나 글 |
| 같은 이름을 다시 정하기 | 된다 | 안 된다 |
| 근거 | [^2] | [^3] |

```asm
COUNT = 500
    .
    .
    mov ax,COUNT          ; mov ax,500과 같다
```

```asm
PI EQU <3.1416>
pressKey EQU <"Press any key to continue...",0>
.data
prompt BYTE pressKey      ; prompt BYTE "Press any key to continue...",0과 같다
```

수 대신 이름을 쓰는 것이 좋은 프로그래밍 습관이다[^2].

위치 카운터 `$`는 지금 놓고 있는 자리의 주소다. 배열 바로 다음 줄에서 배열의 시작 주소를 빼면 바이트 수가 나온다[^1]. 원소가 1바이트보다 크면 원소 하나의 크기로 나눠야 개수가 된다[^4].

$$\text{원소 개수} = \frac{\$ - \text{배열 이름}}{\text{원소 하나의 바이트 수}}$$


```asm
list WORD 1000h,2000h,3000h,4000h
ListSize = ($ - list) / 2         ; 8 / 2 = 4

list DWORD 1,2,3,4
ListSize = ($ - list) / 4         ; 16 / 4 = 4
```

## 예제

**세는 줄을 떨어뜨리면 틀린다.**[^s1]

```asm
list  BYTE 10,20,30,40
other BYTE 1,2
ListSize = ($ - list)             ; 6. list의 크기 4가 아니다
```

`$`는 "지금 자리"일 뿐 `list`의 끝을 아는 것이 아니다. 사이에 `other`가 놓이면 그 2바이트까지 센다.

## 활용

- 기호 상수는 어셈블할 때 값으로 바뀌어 사라진다. 실행 파일에 `COUNT`라는 칸은 없다[^s1]. 지시어가 어셈블러에게 하는 말이라는 점은 [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/)와 같다.
- 강의 목차에는 `TEXTEQU` 지시어도 있지만 설명하는 쪽은 없다[^5].
- 같은 일을 하는 연산자가 뒤에 나온다. `LENGTHOF list`는 원소 개수, `SIZEOF list`는 바이트 수를 준다: [TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/).
- 흔한 실수: 워드 배열에서 2로 나누는 것을 잊어 개수가 두 배로 나온다.

## 연결

- 선수: [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/), [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)
- 이름이 값으로 바뀌는 때: [어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `list WORD 5 DUP(0),7` 바로 다음 줄에 `ListSize = ($ - list) / 2`를 썼다. `ListSize`는 얼마인가?</summary>

**답:** 6.<br>
**이유:** 워드가 5개 + 1개 = 6개라 12바이트다. `$ - list`가 12, 2로 나누면 6이다. 나누지 않으면 바이트 수 12가 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "`ListSize = ($ - list)`는 어디에 써도 `list`의 바이트 수다"가 틀렸음을 보이는 데이터 정의를 만들고, 그때의 `ListSize`를 쓰라.</summary>

**답:** 예: `list BYTE 1,2,3` / `other BYTE 9,9` / `ListSize = ($ - list)`. `ListSize`는 3이 아니라 5다.<br>
**이유:** `$`는 그 줄에 이르기까지 놓인 모든 바이트의 다음 자리다. `list`와 세는 줄 사이에 다른 데이터가 놓이면 그것까지 센다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 프로그램 앞쪽에서 `SIZE`를 10으로 쓰다가 뒤쪽에서 20으로 바꿔 쓰고 싶다. `=`와 `EQU` 가운데 무엇으로 정의해야 하는가? 다른 쪽은 왜 안 되는가?</summary>

**답:** `=`. `SIZE = 10`으로 정하고 뒤에서 `SIZE = 20`으로 다시 정한다.<br>
**이유:** `=`로 만든 이름은 다시 정할 수 있고, `EQU`로 만든 이름은 다시 정할 수 없다. 대신 `EQU`는 `<…>` 안에 글을 통째로 붙일 수 있다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-3」, p.9 (Calculating the Size of a Byte Array: current location counter `$`)
[^2]: 같은 자료, p.8 (Equal-Sign Directive: 32비트 정수, 다시 정할 수 있다, `COUNT = 500`)
[^3]: 같은 자료, p.12 (EQU Directive: 정수 또는 글, 다시 정할 수 없다, `PI`, `pressKey`)
[^4]: 같은 자료, p.10~11 (Calculating the Size of a Word Array, a Doubleword Array)
[^5]: 같은 자료, p.7 (Symbolic Constants 목차)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 오프셋 그림, 원소 개수 식, 사이에 변수가 낀 반례, 기호 상수가 메모리를 차지하지 않는다는 설명, 카드 C1~C3은 원본에 없다. 반례와 "메모리를 차지하지 않는다"는 Irvine, *Assembly Language for x86 Processors* 7판 3.5절의 내용이다. 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
