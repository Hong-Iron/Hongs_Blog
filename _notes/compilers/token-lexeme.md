---
layout: "note"
title: "토큰과 렉심"
display_title: "토큰과 렉심 (Token and Lexeme)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Token and Lexeme", "토큰", "Token", "렉심", "Lexeme", "어휘항목", "패턴", "Pattern", "토큰 이름", "Token Name", "토큰 값", "Token Value", "어휘 분석", "Lexical Analysis", "어휘 분석기", "Lexical Analyzer", "스캐너", "Scanner", "예약어", "Keyword", "식별자", "Identifier"]
description: "영어 문장을 읽을 때 먼저 낱말로 끊고, 낱말마다 \"명사\", \"동사\" 같은 꼬리표를 붙인다. 컴파일러의 첫 단계도 똑같이 프로그램 글자 줄을 뜻 있는 조각으로 끊고, 조각마다 종류를 적은 꼬리표를 붙인다. 뒤 단계는 글자가 아니라 꼬리표만 보고 문법을 따지므로 일이 훨씬 쉬워진다.…"
prev_url: "/studies/compilers/compilation-vs-interpretation/"
prev_title: "컴파일과 인터프리트 비교"
next_url: "/studies/compilers/alphabet-string-language/"
next_title: "알파벳·문자열·언어"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "03_token-lexeme_verify.py", "u": "/studies/compilers/code/03_token-lexeme_verify/", "r": "검증"}]
permalink: "/studies/compilers/token-lexeme/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

영어 문장을 읽을 때 먼저 낱말로 끊고, 낱말마다 "명사", "동사" 같은 꼬리표를 붙인다. 컴파일러의 첫 단계도 똑같이 프로그램 글자 줄을 뜻 있는 조각으로 끊고, 조각마다 종류를 적은 꼬리표를 붙인다. 뒤 단계는 글자가 아니라 꼬리표만 보고 문법을 따지므로 일이 훨씬 쉬워진다. 다만 꼬리표만 남기면 변수 이름이 무엇이었는지 사라지므로, 필요한 조각에는 원래 글자도 함께 달아 준다.

</div>


## 예시로 보기

"In this course, you will learn how to design and implement compilers"를 읽는 사람은 글자를 하나씩 보지 않는다. `In` / `this` / `course` / `,` / `you` / … 로 끊어 읽는다. 끊지 않으면 문법을 따질 단위가 없다. 프로그램도 같다. `A = B + C`는 컴퓨터에게 글자 아홉 개(빈칸 포함)의 줄일 뿐이다. 구문 분석기가 "이름, 대입 기호, 이름, 더하기 기호, 이름" 순서인지 보려면 먼저 누군가 끊어 줘야 한다.

어휘 분석기가 `A = B + C`에 하는 일이다.

| 끊은 조각 | `A` | `=` | `B` | `+` | `C` |
|---|---|---|---|---|---|
| 종류(토큰 이름) | ID | ASSIGN | ID | ADD | ID |
| 딸린 값(토큰 값) | A | | B | | C |
| 내보내는 것 | `<ID, A>` | `<ASSIGN>` | `<ID, B>` | `<ADD>` | `<ID, C>` |

끊은 조각 `A`, `=`, `B`를 렉심(lexeme)이라 부르고, 붙인 종류 ID, ASSIGN을 토큰(token)이라 부른다. `A`, `B`, `C`는 글자가 다르지만 종류는 모두 ID다. 그래서 ID에는 어느 이름이었는지를 값으로 달아 둔다. 값 자리에는 글자 `A`를 그대로 넣거나, 심벌 테이블에서 `A`가 적힌 칸을 가리키는 포인터를 넣는다. `=`처럼 종류가 곧 글자인 것은 값이 없어도 된다.

## 정의

**토큰.** 토큰은 문법에서의 종류다. 영어의 명사·동사·형용사, 프로그래밍 언어의 식별자·수·연산자가 그 예다. 토큰은 토큰 이름과 토큰 값의 쌍이고, 값은 없어도 된다.

**렉심과 패턴.** 렉심은 어떤 토큰의 패턴에 맞는 글자 줄이다. 패턴은 그 토큰이 어떤 모양인지 정해 둔 규칙이다.

기호로 쓰면, 토큰 $$t$$의 패턴이 정하는 문자열의 집합을 $$L(t)$$라 할 때 문자열 $$s$$가 $$t$$의 렉심이라는 것은 $$s \in L(t)$$라는 뜻이다. $$\in$$은 "~에 들어 있다"로 읽는다. 이 집합을 적는 방법이 [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)이다.

| 토큰 이름 | 렉심의 예 |
|---|---|
| IDENTIFIER (줄여서 ID) | `pi`, `score`, `i`, `j`, `k` |
| NUMBER | `0`, `3.14` |
| IF | `if` |
| COMMA | `,` |
| LPAREN | `(` |
| LITERAL | `"Hello world"` |

토큰 하나에 렉심이 여럿일 수도 있고(ID), 하나뿐일 수도 있다(IF).

**토큰의 종류.** 토큰은 크게 여섯 부류로 나뉜다.

| 부류 | 예 |
|---|---|
| 예약어(keyword) | `if`는 IF, `else`는 ELSE, `float`는 FLOAT |
| 연산자 | `+`는 ADD, `<` `>` `==`는 COMPARISON |
| 식별자 | 모든 이름이 ID |
| 상수 | 수는 NUMBER(또는 INTEGER, REAL), 글자 줄은 LITERAL |
| 구두점 | `(`는 LPAREN, `,`는 COMMA |
| 빈칸(whitespace) | 빈칸·줄바꿈·탭이 하나 이상 이어진 것 |

빈칸과 주석처럼 문법을 따지는 데 쓰이지 않는 토큰은 어휘 분석기가 버린다.

**어휘 분석기가 하는 일.** 다섯 가지를 차례로 한다.

1. 원시 프로그램의 글자를 읽는다.
2. 글자를 뜻 있는 덩어리(렉심)로 묶는다.
3. 토큰의 줄을 만든다.
4. 토큰 정보를 심벌 테이블에 적는다.
5. 토큰을 구문 분석기로 보낸다.

줄이면 둘이다. 입력을 렉심으로 끊고, 렉심마다 어느 토큰인지 알아낸다.

## 예제

아래 C 함수를 어휘 분석기에 넣으면 어떤 토큰이 어떤 순서로 나올까? 펼치기 전에 토큰 줄을 직접 써 본다.

```c
bool compare(int a, int b) {
/* compare a and b */
return a >= b;
}
```

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">토큰 줄</summary>

`<BOOL> <ID, compare> <LPAREN> <INT> <ID, a> <COMMA> <INT> <ID, b> <RPAREN> <LBRACE> <RETURN> <ID, a> <COMPARISON, >=> <ID, b> <SEMI> <RBRACE>`

모두 16개다. 빈칸, 줄바꿈, 주석 `/* compare a and b */`는 버려져 나오지 않는다. `>=`는 `>`와 `=` 둘로 끊지 않고 하나로 끊는다: [최장 일치와 토큰 인식](/Hongs_Blog/studies/compilers/longest-match-tokenizing/). COMPARISON에는 `<`, `>`, `>=`가 모두 들어가므로 어느 것이었는지를 값으로 단다[^s1].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `A = B + C`의 렉심·토큰 이름·출력, 위 예의 토큰 16개, 버린 것까지 모두 이으면 원래 글이 되는 것, 카드 C2 — [03_token-lexeme_verify.py](/Hongs_Blog/studies/compilers/code/03_token-lexeme_verify/)</div>

</div>


## 활용

- 구문 분석기는 토큰 이름만 보고 문법을 따진다. `a + b`와 `x + y`는 둘 다 `ID ADD ID`라서 같은 규칙으로 처리된다. 토큰 값은 그 뒤 단계(의미 분석, 코드 생성)에서 쓴다[^s1].
- 흔한 실수: 토큰과 렉심을 바꿔 말한다. `score`는 렉심이고 ID가 토큰이다.
- 흔한 실수: 예약어 `if`를 ID로 본다. `if`는 식별자의 모양에도 맞지만 IF로 본다. 겹칠 때 누가 이기는지는 [최장 일치와 토큰 인식](/Hongs_Blog/studies/compilers/longest-match-tokenizing/)에서 정한다.
- 파이썬에서 `split`이나 `re.findall`로 문자열을 조각내는 일이 작은 어휘 분석이다: [문자열 파싱과 정규 표현식](/Hongs_Blog/studies/algorithms/string-parsing/).

## 연결

- 선수: [컴파일러의 구조](/Hongs_Blog/studies/compilers/compiler-structure/)
- 패턴을 적는 방법: [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/). 그 바탕이 되는 말: [알파벳·문자열·언어](/Hongs_Blog/studies/compilers/alphabet-string-language/)
- 토큰을 받아 쓰는 쪽: [문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/)에서는 토큰 이름이 문법의 가장 작은 기호가 된다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `score`, ID, "글자나 밑줄로 시작하고 글자·숫자·밑줄이 이어진다" 가운데 토큰, 렉심, 패턴은 각각 어느 것인가? `total`과 `score`는 같은 토큰인가, 같은 렉심인가?</summary>

**답:** `score`가 렉심, ID가 토큰(토큰 이름), 따옴표 안의 규칙이 패턴이다. `total`과 `score`는 토큰은 같고(ID) 렉심은 다르다.<br>
**이유:** 토큰은 종류, 렉심은 실제 글자, 패턴은 그 종류에 드는 글자의 규칙이다. 흔한 오답은 `score`를 토큰이라 부르는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `if (x1 >= 10) y = y + 1;`을 토큰 줄로 쓰라. 토큰은 모두 몇 개인가? (이름은 IF, LPAREN, RPAREN, ID, COMPARISON, NUMBER, ASSIGN, ADD, SEMI를 쓴다.)</summary>

**답:** `<IF> <LPAREN> <ID, x1> <COMPARISON, >=> <NUMBER, 10> <RPAREN> <ID, y> <ASSIGN> <ID, y> <ADD> <NUMBER, 1> <SEMI>`. 12개다.<br>
**이유:** 빈칸은 버린다. `x1`은 글자로 시작하므로 통째로 ID 하나다. `y`는 두 번 나오지만 나올 때마다 토큰 하나다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 토큰 이름만 내보내고 토큰 값을 버리면 무엇이 곤란한가? 반대로 `<ASSIGN>`에는 왜 값이 없어도 되는가?</summary>

**답:** `A = B + C`와 `C = A + A`가 둘 다 `ID ASSIGN ID ADD ID`가 되어 구별할 수 없다. 문법은 맞는지 알 수 있지만 어느 변수에 무엇을 넣는지 모른다. ASSIGN은 렉심이 `=` 하나뿐이라 이름만으로 글자가 정해진다.<br>
**이유:** 값은 "같은 토큰에 드는 여러 렉심 중 어느 것이었나"를 남기는 칸이다. 렉심이 하나뿐인 토큰에는 남길 것이 없다.

</details>


[^s1]: 토큰 줄은 검증 코드로 만들었다.
{% endraw %}
