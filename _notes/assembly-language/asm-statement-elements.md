---
layout: "note"
title: "어셈블리 문장의 구성"
display_title: "어셈블리 문장의 구성 (Basic Elements of Assembly Language)"
kind: "concept"
kind_label: "정의"
num: "08"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Basic Elements of Assembly Language", "정수 상수", "Integer Constant", "진법 꼬리표", "Radix", "정수 식", "Integer Expression", "문자 상수", "문자열 상수", "예약어", "Reserved Word", "식별자", "Identifier", "레이블", "Label", "니모닉", "Mnemonic", "피연산자", "Operand", "즉시값", "Immediate Value", "주석", "Comment"]
description: "어셈블리어 한 줄은 많아야 네 칸으로 된 짧은 문장이다. 이 줄에 붙이는 이름표, 무슨 동작인지 적은 낱말, 그 동작에 쓸 재료, 사람만 읽는 메모다. 가운데의 동작 낱말만 꼭 있어야 하고 나머지는 있을 때만 쓴다. 모양이 단순해서 읽기 쉽지만, 숫자 하나를 적을 때도 몇 진법인지…"
prev_url: "/studies/assembly-language/io-access-levels/"
prev_title: "입출력 접근 수준"
next_url: "/studies/assembly-language/directive-vs-instruction/"
next_title: "지시어와 명령어 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/asm-statement-elements/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

어셈블리어 한 줄은 많아야 네 칸으로 된 짧은 문장이다. 이 줄에 붙이는 이름표, 무슨 동작인지 적은 낱말, 그 동작에 쓸 재료, 사람만 읽는 메모다. 가운데의 동작 낱말만 꼭 있어야 하고 나머지는 있을 때만 쓴다. 모양이 단순해서 읽기 쉽지만, 숫자 하나를 적을 때도 몇 진법인지 꼬리표를 붙여야 하고 이름 짓는 규칙을 어기면 엉뚱하게 읽힌다.

</div>


## 예시로 보기

C에서는 `x = (a + 3) * b;`처럼 한 줄에 여러 일을 섞어 쓴다. 어셈블리어는 한 줄에 동작 하나만 쓴다. 대신 줄의 모양이 늘 같다.

```asm
L1:   add   eax,36 * 25      ; 900을 더한다
```

| 칸 | 이 줄에서 | 꼭 있어야 하나 |
|---|---|---|
| 레이블 (label) | `L1:` | 없어도 된다 |
| 니모닉 (mnemonic) | `add` | 꼭 있어야 한다 |
| 피연산자 (operand) | `eax` 와 `36 * 25` | 명령마다 다르다 |
| 주석 (comment) | `; 900을 더한다` | 없어도 된다 |

네 칸과 필요 여부는 슬라이드의 목록이다[^1]. 니모닉은 동작에 붙인 이름, 피연산자는 그 동작에 쓸 재료다. `36 * 25`는 어셈블러가 프로그램을 번역할 때 미리 계산해서 900으로 바꿔 넣는다.

피연산자는 명령에 따라 0개, 1개, 2개다[^2].

```asm
stc                  ; 0개: 올림 플래그를 켠다
inc  eax             ; 1개: 레지스터
inc  myByte          ; 1개: 메모리
add  ebx,ecx         ; 2개: 레지스터, 레지스터
sub  myByte,25       ; 2개: 메모리, 상수
add  eax,36 * 25     ; 2개: 레지스터, 상수식
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 정수 상수 다섯 개의 값, `A5h`가 식별자 규칙에 걸리는 것, 정수 식 네 개의 값(3, −35, 20, 1), 식별자 규칙(첫 글자, 길이 247), 위 여섯 문장의 피연산자 수, 36 × 25 = 900, 카드의 값 — [08_asm-statement-elements_verify.py](/Hongs_Blog/studies/assembly-language/code/08_asm-statement-elements_verify/). MASM의 규칙을 파이썬으로 흉내 내어 확인했다.</div>

</div>


## 문장을 이루는 조각

### 정수 상수

숫자 뒤에 진법을 알리는 글자(radix)를 붙인다[^3]. 앞에 `+`나 `−` 부호를 붙여도 된다.

| 꼬리 글자 | 진법 | 예 | 값 (10진수) |
|---|---|---|---|
| `h` | 16진수 | `6Ah` | 106 |
| `d` 또는 없음 | 10진수 | `30d`, `42` | 30, 42 |
| `b` | 2진수 | `1101b` | 13 |
| `r` | 부호화한 실수 | | |

16진수가 글자로 시작하면 앞에 0을 붙인다. `A5h`가 아니라 `0A5h`다[^3]. `A5h`는 글자로 시작해서 아래의 이름 규칙에 맞는다. 그래서 어셈블러가 숫자가 아니라 이름으로 읽는다[^s1].

### 정수 식

상수끼리의 계산식을 쓸 수 있다. 연산자의 순서는 다음과 같다. 숫자가 작을수록 먼저 계산한다[^4].

| 연산자 | 이름 | 순서 |
|---|---|---|
| `( )` | 괄호 | 1 |
| `+`, `−` | 부호 (수 하나 앞에 붙는 것) | 2 |
| `*`, `/` | 곱셈, 나눗셈 | 3 |
| `MOD` | 나머지 | 3 |
| `+`, `−` | 덧셈, 뺄셈 | 4 |

| 식 | 값 | 계산 |
|---|---|---|
| `16 / 5` | 3 | 정수 나눗셈이라 소수점 아래를 버린다 |
| `-(3 + 4) * (6 - 1)` | −35 | 괄호 먼저: −7 × 5 |
| `-3 + 4 * 6 - 1` | 20 | 곱셈 먼저: −3 + 24 − 1 |
| `25 mod 3` | 1 | 25를 3으로 나눈 나머지 |

### 문자와 문자열 상수

글자 하나나 글자열을 작은따옴표나 큰따옴표로 감싼다. `'A'`, `"x"`, `"ABC"`, `'xyz'`. ASCII 글자 하나가 1바이트를 차지한다. 따옴표를 글자열 안에 넣으려면 바깥을 다른 종류의 따옴표로 감싼다. `'Say "Goodnight," Gracie'`[^5].

### 예약어와 식별자

**예약어 (reserved word).** 어셈블러가 이미 뜻을 정해 둔 낱말이다. 명령 니모닉, 어셈블러에게 하는 지시(지시어), 타입 이름, 연산자, 미리 정해진 기호가 여기에 든다. 이름으로 쓸 수 없다[^6].

**식별자 (identifier).** 프로그래머가 변수, 상수, 함수(어셈블리어에서는 프로시저라 부른다), 줄에 붙이는 이름이다[^6].

- 길이는 1~247자다. 숫자를 넣을 수 있다.
- 첫 글자는 글자, `_`, `@`, `?`, `$` 가운데 하나여야 한다. 숫자로 시작할 수 없다.
- 대문자와 소문자를 가리지 않는다. `myArray`와 `MYARRAY`는 같은 이름이다.

### 레이블

레이블은 줄에 붙이는 이름표다. 코드나 데이터가 놓인 자리(주소)를 그 이름으로 부를 수 있게 한다. 식별자 규칙을 따른다[^7].

| 종류 | 붙는 곳 | 모양 | 예 |
|---|---|---|---|
| 데이터 레이블 | 변수 | 콜론이 없다. 이름이 겹치면 안 된다 | `myArray` |
| 코드 레이블 | 명령어. 점프와 반복 명령이 가는 곳 | 뒤에 콜론이 붙는다 | `L1:` |

### 니모닉과 피연산자

니모닉의 예는 `MOV`, `ADD`, `SUB`, `MUL`, `INC`, `DEC`다. 피연산자로 쓸 수 있는 것은 네 가지다[^8].

- 상수
- 상수식
- 레지스터
- 메모리 (데이터 레이블로 가리킨다)

상수와 상수식은 명령어 안에 값이 바로 들어 있다고 해서 즉시값(immediate value)이라고도 부른다. 종류별 규칙은 [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/)에 있다.

### 주석

- 한 줄 주석: 세미콜론(`;`)부터 줄 끝까지.
- 여러 줄 주석: `COMMENT` 지시어와 프로그래머가 고른 글자 하나로 시작하고, 같은 글자가 다시 나오는 곳에서 끝난다[^9].

```asm
COMMENT !
  이 줄들은 모두 주석이다.
  느낌표가 다시 나올 때까지 이어진다.
!
```

주석에는 프로그램이 하는 일, 쓴 사람과 날짜, 고친 기록, 까다로운 코드의 설명을 적는다[^9].

## 활용

- 흔한 실수: `mov al,A5h`. `A5h`를 이름으로 읽어 "그런 이름이 없다"는 오류가 난다. `0A5h`로 쓴다.
- 흔한 실수: 코드 레이블의 콜론을 빼거나 데이터 레이블에 콜론을 붙이는 것.
- 상수식은 어셈블러가 번역할 때 계산한다. 프로그램이 돌 때 계산하는 것이 아니므로 레지스터나 변수의 값은 넣을 수 없다[^s1].
- 줄 가운데 어떤 것은 프로세서가 실행하는 명령이 아니라 어셈블러에게 하는 지시다: [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/).

## 연결

- 선수: [어셈블리어와 기계어](/Hongs_Blog/studies/assembly-language/assembly-language/), [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/). 진법 꼬리표의 바탕: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 글자의 줄을 상수, 이름, 연산자 같은 조각으로 자르는 일을 컴파일러 과목에서는 낱말 분석이라 부른다: [토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/)
- 변수를 만드는 줄: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/). 줄들을 모아 프로그램으로: [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `0FFh`, `11111111b`, `255d`의 값을 10진수로 쓰라. 그리고 상수식 `-5 + 3 * 4 mod 5`와 `(2 + 3) * 4 / 3`의 값을 구하라.</summary>

**답:** 세 상수는 모두 255다. 식의 값은 −3과 6이다.<br>
**이유:** 첫 식은 `*`와 `MOD`가 같은 순서라 왼쪽부터 한다. 3 × 4 = 12, 12 mod 5 = 2, −5 + 2 = −3. 둘째 식은 5 × 4 = 20, 20 / 3 = 6(나머지는 버린다)[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 16진수 `A5`를 MASM에서 `A5h`라고 쓰면 왜 안 되는가? 어떻게 써야 하는가?</summary>

**답:** `A5h`는 글자로 시작하고 글자와 숫자로만 되어 있어서 식별자 규칙에 맞는다. 어셈블러는 이것을 숫자가 아니라 이름으로 읽는다. 앞에 0을 붙여 `0A5h`로 쓰면 숫자로 시작하므로 상수로 읽는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 문장 `target: sub myByte,25 ; 25를 뺀다`를 네 칸(레이블, 니모닉, 피연산자, 주석)으로 나누고, 각 피연산자가 상수·상수식·레지스터·메모리 가운데 무엇인지 쓰라. `target`은 데이터 레이블인가 코드 레이블인가?</summary>

**답:** 레이블 `target:`, 니모닉 `sub`, 피연산자 `myByte`(메모리)와 `25`(상수), 주석 `; 25를 뺀다`. `target`은 명령어 앞에 붙고 콜론이 있으므로 코드 레이블이다. `myByte`는 변수의 이름이므로 데이터 레이블이다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.9 (Instructions: Label (optional), Mnemonic (required), Operand (depends on the instruction), Comment (optional))
[^2]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.13 (Instruction Format Examples)
[^3]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.4 (Integer Constants: radix characters h·d·b·r, Examples: 30d, 6Ah, 42, 1101b, Hexadecimal beginning with letter: 0A5h)
[^4]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.5 (Integer Expressions: 연산자 순서 표와 예 네 개)
[^5]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.6 (Character and String Constants)
[^6]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.7 (Reserved Words and Identifiers)
[^7]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.10 (Labels: Data label, Code label)
[^8]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.11 (Mnemonics and Operands, immediate values)
[^9]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-1」, p.12 (Comments)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> C 문장과 견준 도입, 맨 위의 `L1: add eax,36 * 25` 한 줄과 네 칸 표, 값 칸의 10진수, `A5h`가 이름으로 읽히는 까닭, 정수 식 표의 "계산" 칸, `COMMENT` 예, 상수식에 레지스터를 못 넣는다는 설명, 카드는 슬라이드에 없다. 슬라이드는 규칙과 예를 목록으로 적는다. 상수식을 어셈블러가 번역할 때 계산한다는 것과 `A5h`의 풀이는 교재 Irvine, *Assembly Language for x86 Processors* 7판, 3.1절을 따랐다. 값은 검증 코드로 확인했다.
{% endraw %}
