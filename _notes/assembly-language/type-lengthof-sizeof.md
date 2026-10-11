---
layout: "note"
title: "TYPE·LENGTHOF·SIZEOF 연산자"
display_title: "TYPE·LENGTHOF·SIZEOF 연산자"
kind: "concept"
kind_label: "정의"
num: "22"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["TYPE Operator", "LENGTHOF Operator", "SIZEOF Operator", "TYPE 연산자", "LENGTHOF 연산자", "SIZEOF 연산자", "원소 크기", "원소 개수", "여러 줄에 걸친 데이터 정의", "Spanning Multiple Lines"]
description: "배열에 대해 알고 싶은 수는 셋이다. 칸 하나가 몇 바이트인가, 칸이 몇 개인가, 전체가 몇 바이트인가. 이 셋을 손으로 세어 코드에 적는 대신 어셈블러에게 물어보는 연산자다. 배열을 고쳐도 코드는 그대로 두면 된다. 다만 어셈블러는 이름이 붙은 정의 한 덩이만 세므로, 배열을 여…"
prev_url: "/studies/assembly-language/offset-ptr-operators/"
prev_title: "OFFSET과 PTR 연산자"
next_url: "/studies/assembly-language/indirect-addressing/"
next_title: "간접 피연산자와 인덱스 피연산자"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/type-lengthof-sizeof/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

배열에 대해 알고 싶은 수는 셋이다. 칸 하나가 몇 바이트인가, 칸이 몇 개인가, 전체가 몇 바이트인가. 이 셋을 손으로 세어 코드에 적는 대신 어셈블러에게 물어보는 연산자다. 배열을 고쳐도 코드는 그대로 두면 된다. 다만 어셈블러는 이름이 붙은 정의 한 덩이만 세므로, 배열을 여러 줄에 나눠 쓸 때 줄 끝의 쉼표를 빼먹으면 첫 줄만 센다.

</div>


## 예시로 보기

배열을 처음부터 끝까지 훑으려면 두 수가 필요하다. 다음 칸으로 가려면 주소를 몇 바이트 옮겨야 하는지, 몇 번 되풀이해야 하는지다. 워드 배열이라면 앞의 것은 2, 뒤의 것은 값의 개수다. 이 수를 코드에 직접 써 두면 배열을 더블워드로 바꾸거나 값을 하나 더 넣는 날 코드도 함께 고쳐야 한다.

```asm
.data
array3 DWORD 1,2,3,4
.code
mov eax,TYPE array3       ; 4   (칸 하나가 4바이트)
mov ecx,LENGTHOF array3   ; 4   (칸이 4개)
mov ebx,SIZEOF array3     ; 16  (전체 16바이트)
```

세 값은 어셈블할 때 정해져 코드에는 수로 들어간다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 표의 TYPE·LENGTHOF·SIZEOF 값 전부, SIZEOF = LENGTHOF × TYPE, 여러 줄 정의의 6과 12, 쉼표를 빼먹은 경우, 카드 C1·C3. 파이썬 흉내로 확인 — [22_type-lengthof-sizeof_verify.py](/Hongs_Blog/studies/assembly-language/code/22_type-lengthof-sizeof_verify/)</div>

</div>


## 정의

| 연산자 | 주는 값 | 근거 |
|---|---|---|
| `TYPE 이름` | 데이터 정의의 원소 하나의 크기(바이트) | [^1] |
| `LENGTHOF 이름` | 한 데이터 정의에 든 원소의 개수 | [^2] |
| `SIZEOF 이름` | `LENGTHOF`에 `TYPE`을 곱한 값. 전체 바이트 수다 | [^3] |

$$\text{SIZEOF} = \text{LENGTHOF} \times \text{TYPE}$$


`TYPE`은 지시어만 보고 정해진다. `BYTE`는 1, `WORD`는 2, `DWORD`는 4, `QWORD`는 8이다[^1].

## 예제

**슬라이드의 표.**[^2][^3]

| 정의 | TYPE | LENGTHOF | SIZEOF |
|---|---|---|---|
| `byte1 BYTE 10,20,30` | 1 | 3 | 3 |
| `array1 WORD 30 DUP(?),0,0` | 2 | 32 | 64 |
| `array2 WORD 5 DUP(3 DUP(?))` | 2 | 15 | 30 |
| `array3 DWORD 1,2,3,4` | 4 | 4 | 16 |
| `digitStr BYTE "12345678",0` | 1 | 9 | 9 |

`array1`은 `DUP`로 만든 30개에 0 두 개가 더 붙어 32개다. `array2`는 "3개짜리를 5번"이라 15개다. `digitStr`은 글자 8개에 끝의 0까지 9개다. 바이트 배열에서는 `LENGTHOF`와 `SIZEOF`가 같다.

**여러 줄에 걸친 정의.** 마지막 줄을 뺀 모든 줄이 쉼표로 끝나면 한 정의다. `LENGTHOF`와 `SIZEOF`는 그 줄들을 모두 센다[^4].

```asm
.data
array WORD 10,20,
      30,40,
      50,60
.code
mov eax,LENGTHOF array    ; 6
mov ebx,SIZEOF array      ; 12
```

**쉼표 없이 줄을 바꾸면.** 다음 줄을 새 지시어로 시작하면 다른 정의가 된다. 메모리에는 이어서 놓이지만 `array`라는 이름에는 첫 줄만 딸린다[^s1].

```asm
array WORD 10,20
      WORD 30,40
; LENGTHOF array = 2, SIZEOF array = 4. 메모리에는 8바이트가 놓여 있다
```

## 활용

- 반복 횟수는 `mov ecx,LENGTHOF array`, 다음 칸으로 가는 걸음은 `add esi,TYPE array`로 쓴다: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/), [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/).
- 위치 카운터로 세던 것과 같은 값이다. `($ - list) / 2`가 `LENGTHOF list`이고 `($ - list)`가 `SIZEOF list`다. 연산자 쪽은 세는 줄을 배열 바로 뒤에 두지 않아도 된다: [기호 상수와 위치 카운터](/Hongs_Blog/studies/assembly-language/symbolic-constants/)[^s1].
- 자바의 `array.length`는 실행 중에 배열에서 읽는 값이다. `LENGTHOF`는 어셈블할 때 정의문을 보고 세는 수라, 실행 중에 주소만 건네받은 배열에는 쓸 수 없다: [배열](/Hongs_Blog/studies/java/java-array/)[^s1].

## 연결

- 선수: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `tbl DWORD 4 DUP(2 DUP(0)),1`의 `TYPE`, `LENGTHOF`, `SIZEOF`를 구하라.</summary>

**답:** `TYPE` 4, `LENGTHOF` 9, `SIZEOF` 36.<br>
**이유:** "2개짜리를 4번"이라 8개, 뒤의 1까지 9개다. 9 × 4 = 36바이트. `4 DUP(2 DUP(0))`을 6개(4 + 2)로 세면 틀린다. 겹친 `DUP`는 곱한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "`LENGTHOF 이름`은 그 이름에서 시작해 이어서 놓인 값의 개수다"가 틀렸음을 보이는 데이터 정의를 쓰라.</summary>

**답:** `array WORD 10,20` 다음 줄에 `WORD 30,40`. 메모리에는 워드 4개가 이어서 놓이지만 `LENGTHOF array`는 2다.<br>
**이유:** `LENGTHOF`는 정의문 하나에 든 원소만 센다. 첫 줄이 쉼표로 끝나지 않으면 둘째 줄은 이름 없는 다른 정의다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `msg BYTE "Hello",0Dh,0Ah,0`과 `pts WORD 3 DUP(1,2)`에서 `LENGTHOF`와 `SIZEOF`를 각각 구하라. 두 값이 같은 것은 어느 쪽이고 왜 그런가?</summary>

**답:** `msg`: 8과 8. `pts`: 6과 12. 같은 쪽은 `msg`다.<br>
**이유:** `SIZEOF`는 `LENGTHOF`에 `TYPE`을 곱한 값이다. `BYTE`는 `TYPE`이 1이라 둘이 같고, `WORD`는 2라 두 배다. `pts`는 "(1, 2) 두 개짜리를 3번"이라 6개다.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-3」, p.1 (TYPE Operator: var1~var4의 1, 2, 4, 8)
[^2]: 같은 자료, p.2 (LENGTHOF Operator 표)
[^3]: 같은 자료, p.3 (SIZEOF Operator 표: LENGTHOF에 TYPE을 곱한 값)
[^4]: 같은 자료, p.4 (Spanning Multiple Lines)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시의 세 줄, 표의 TYPE 칸, 쉼표 없이 줄을 바꾼 예, 위치 카운터·자바 배열과의 비교, 카드 C1~C3은 원본에 없다. 쉼표 없는 예는 Irvine, *Assembly Language for x86 Processors* 7판 4.3.5절에 있다. 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
