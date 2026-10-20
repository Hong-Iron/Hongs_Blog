---
layout: "note"
title: "최장 일치와 토큰 인식"
display_title: "최장 일치와 토큰 인식 (Longest Match)"
kind: "concept"
kind_label: "알고리즘"
num: "10"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Longest Match", "Maximal Munch", "최장 일치 원칙", "최대 뭉크", "토큰 인식", "Token Recognition", "토큰 인식기", "Token Recognizer", "어휘 분석기 구현", "토큰 우선순위", "Token Priority"]
description: "띄어쓰기 없는 글을 낱말로 끊을 때 \"아는 낱말 가운데 가장 긴 것\"부터 떼어 내는 방법이다. 앞에서부터 한 글자씩 읽어 가다가 더는 어떤 낱말도 될 수 없게 되면, 낱말이 되었던 마지막 자리까지를 한 조각으로 자르고 그 뒤에서 다시 시작한다. 이렇게 하면 =가 와 =로 쪼개지지 …"
prev_url: "/studies/compilers/subset-construction/"
prev_title: "부분집합 구성법"
next_url: "/studies/compilers/context-free-grammar/"
next_title: "문맥 자유 문법"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "10_longest-match-tokenizing_impl.py", "u": "/studies/compilers/code/10_longest-match-tokenizing_impl/", "r": "구현"}]
permalink: "/studies/compilers/longest-match-tokenizing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

띄어쓰기 없는 글을 낱말로 끊을 때 "아는 낱말 가운데 가장 긴 것"부터 떼어 내는 방법이다. 앞에서부터 한 글자씩 읽어 가다가 더는 어떤 낱말도 될 수 없게 되면, 낱말이 되었던 마지막 자리까지를 한 조각으로 자르고 그 뒤에서 다시 시작한다. 이렇게 하면 `>=`가 `>`와 `=`로 쪼개지지 않고, 긴 이름이 한 글자씩 흩어지지 않는다. 다만 같은 조각이 두 종류의 낱말 모양에 다 맞으면 길이만으로는 못 가리므로 종류에 우선순위를 미리 정해 둬야 하고, 첫 글자부터 어느 낱말도 못 되는 경우를 위한 오류 처리가 따로 있어야 한다.

</div>


## 예시로 보기

토큰마다 [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)을 적었다고 하자. 이것으로 `COMPARE(A`를 끊으려 하면 곧 막힌다. `C`도 식별자의 모양이고 `CO`도, `COMPARE`도 식별자의 모양이다. 어디서 끊어야 하는가? 짧은 쪽에서 끊으면 `C`, `O`, `M`, …으로 흩어진다. 그래서 가장 긴 쪽에서 끊는다.

토큰이 둘뿐인 작은 언어다. $$letter = a \mid \cdots \mid z \mid A \mid \cdots \mid Z$$, $$digit = 0 \mid \cdots \mid 9$$이다.

- $$sIdentifier = letter(digit \mid letter)^*$$
- $$lparen = ($$
- \$$Merged = sIdentifier \mid lparen$$

$$Merged$$를 DFA로 바꾼 전이 표다. $$T_1$$, $$T_2$$, $$T_3$$은 $$sIdentifier$$를, $$T_4$$는 $$lparen$$을 받아들이는 상태다.

| | $$letter$$ | $$digit$$ | `(` |
|---|---|---|---|
| $$T_0$$ | $$T_1$$ | $$\varnothing$$ | $$T_4$$ |
| $$T_1$$ | $$T_2$$ | $$T_3$$ | $$\varnothing$$ |
| $$T_2$$ | $$T_2$$ | $$T_3$$ | $$\varnothing$$ |
| $$T_3$$ | $$T_2$$ | $$T_3$$ | $$\varnothing$$ |
| $$T_4$$ | $$\varnothing$$ | $$\varnothing$$ | $$\varnothing$$ |

`COMPARE(A`를 넣고 표를 따라간다.

| 걸음 | 상태 | 읽은 글자 | 다음 상태 |
|---|---|---|---|
| 1 | $$T_0$$ | C | $$T_1$$ |
| 2 | $$T_1$$ | O | $$T_2$$ |
| 3 | $$T_2$$ | M | $$T_2$$ |
| 4 | $$T_2$$ | P | $$T_2$$ |
| 5 | $$T_2$$ | A | $$T_2$$ |
| 6 | $$T_2$$ | R | $$T_2$$ |
| 7 | $$T_2$$ | E | $$T_2$$ |
| 8 | $$T_2$$ | ( | 갈 곳 없음 |

8걸음에서 전이가 없다. 받아들이는 상태에 닿았던 마지막 글자를 찾는다. 7걸음의 E다. 그래서 `COMPARE`를 잘라 $$sIdentifier$$로 분류한다.

남은 `(A`로 $$T_0$$부터 다시 시작한다.

| 걸음 | 상태 | 읽은 글자 | 다음 상태 |
|---|---|---|---|
| 1 | $$T_0$$ | ( | $$T_4$$ |
| 2 | $$T_4$$ | A | 갈 곳 없음 |

`(`를 잘라 $$lparen$$으로 분류한다. 남은 `A`는 $$T_0$$에서 $$T_1$$로 가고 입력이 끝난다. $$T_1$$이 받아들이는 상태이므로 `A`를 $$sIdentifier$$로 분류한다. 결과는 `COMPARE` / `(` / `A` 세 토큰이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 세 추적 표와 결과, 표를 따라가는 방법과 아래 의사코드가 무작위 입력 2,000개에서 같은 답을 내는 것, 우선순위 예와 "마지막으로 받아들인 자리" 예, 카드의 답 — [10_longest-match-tokenizing_impl.py](/Hongs_Blog/studies/compilers/code/10_longest-match-tokenizing_impl/)</div>

</div>


## 정의

**입력:** 토큰별 정규 표현식(우선순위 순서로 적은 것)과 입력 글자 줄 $$a_1 a_2 \cdots a_n$$. **출력:** (토큰, 렉심)의 줄.

세 걸음이다.

1. 토큰의 정규 표현식을 <code>&#124;</code>로 모두 잇는다. $$Merged = Keyword \mid Identifier \mid Comparison \mid Float \mid Whitespace \mid \cdots$$
2. 입력의 앞부분 가운데 $$L(Merged)$$에 드는 **가장 긴 것**을 찾아 자르고 분류한다.
3. 남은 입력에 2를 되풀이한다.

2번을 의사코드로 적으면 이렇다. $$mIdx$$는 "지금까지 찾은, 토큰이 되는 가장 긴 앞부분의 길이"다.

```
mIdx = 0
i를 1부터 n까지:
    a1 a2 ... ai 가 L(Merged)에 들면 mIdx = i
a1 a2 ... a_mIdx 를 잘라 내고 분류한다
```

$$i$$를 끝까지 늘려 가며 조건이 맞을 때마다 $$mIdx$$를 덮어쓰므로, 고리가 끝나면 가장 큰 $$i$$가 남는다.

**겹칠 때: 우선순위.** 잘라 낸 조각이 두 토큰의 모양에 다 맞을 수 있다. `if`는 $$L(Keyword)$$에도 $$L(Identifier)$$에도 든다. 길이가 같아서 "가장 긴 것"으로는 못 가린다. 그래서 토큰마다 우선순위를 정해 둔다. 예약어를 식별자보다 앞에 두면 `if`는 예약어가 된다. `ifx`는 길이 3인 식별자 모양이 길이 2인 `if`보다 길어서, 우선순위를 따지기 전에 식별자로 정해진다.

**어디에도 안 맞을 때: 오류 처리.** 위 의사코드에는 오류 처리가 없다. 첫 글자 $$a_1$$부터 $$L(Merged)$$에 들지 않으면 $$mIdx$$가 0으로 남아 아무것도 자르지 못한다. 이런 경우를 다루는 부분이 더 있어야 한다.

### 표로 빠르게 하기

의사코드의 "$$a_1 \cdots a_i$$가 $$L(Merged)$$에 드는가"를 $$i$$마다 처음부터 다시 따지면 느리다. $$Merged$$의 DFA 표를 한 번 따라가면 이 물음 $$n$$개에 한꺼번에 답할 수 있다. 글자를 읽을 때마다 지금 상태가 받아들이는 상태인지만 보면 되기 때문이다.

```
상태 = T0,  마지막 = 없음
글자를 하나씩 읽으며:
    표[상태][글자]가 ∅이면 그만 읽는다
    상태 = 표[상태][글자]
    상태가 받아들이는 상태이면 마지막 = (지금 자리, 이 상태의 토큰)
마지막이 없으면 오류
마지막에 적힌 자리까지 잘라 내고, 그 토큰으로 분류한다
```

의사코드는 $$i$$를 $$n$$까지 다 돌지만, 표를 따라갈 때는 갈 곳이 없어지면 바로 멈춘다. 멈춰도 답이 같은 까닭은 DFA가 한 번 막히면 그 뒤에 무엇이 오든 받아들이지 못하기 때문이다. 더 긴 앞부분이 $$L(Merged)$$에 들 수 없다.

**자르는 자리는 "마지막으로 받아들인 자리"다.** 예시에서는 막히기 바로 앞 상태가 받아들이는 상태였다. 늘 그렇지는 않다. 토큰이 `a`와 `abc` 둘뿐일 때 `abd`를 넣으면 `a`(받아들임), `ab`(받아들이지 않음)까지 간 뒤 `d`에서 막힌다. 이때는 막히기 바로 앞인 `ab`가 아니라 마지막으로 받아들였던 `a`에서 자르고, `b`부터 다시 읽는다.

### 실행 추적

같은 표에 `x1(y`를 넣는다.

| 시작 자리 | 걸음 | 상태 | 읽은 글자 | 다음 상태 | 마지막으로 받아들인 자리 |
|---|---|---|---|---|---|
| `x1(y` | 1 | $$T_0$$ | x | $$T_1$$ | `x` |
| | 2 | $$T_1$$ | 1 | $$T_3$$ | `x1` |
| | 3 | $$T_3$$ | ( | 갈 곳 없음 | `x1`에서 자른다 → $$sIdentifier$$ |
| `(y` | 1 | $$T_0$$ | ( | $$T_4$$ | `(` |
| | 2 | $$T_4$$ | y | 갈 곳 없음 | `(`에서 자른다 → $$lparen$$ |
| `y` | 1 | $$T_0$$ | y | $$T_1$$ | `y` |
| | 2 | $$T_1$$ | 입력 끝 | | `y`에서 자른다 → $$sIdentifier$$ |

## 활용

- 어휘 분석기를 만드는 마지막 걸음이다. 토큰 정의 → 정규 표현식 → NFA → DFA 전이 표를 만든 뒤, 이 방법으로 표를 따라가며 자른다.
- 시간: 토큰 하나를 자를 때 읽은 글자 수는 자른 길이에 "받아들인 뒤 더 읽어 본 글자 수"를 더한 것이다. 예시처럼 막히기 바로 앞이 받아들이는 상태이면 글자 하나만 더 읽는다.
- 구현: [10_longest-match-tokenizing_impl.py](/Hongs_Blog/studies/compilers/code/10_longest-match-tokenizing_impl/)
- "지금 가장 좋아 보이는 것(가장 긴 것)을 먼저 떼어 낸다"는 점에서 [그리디](/Hongs_Blog/studies/algorithms/greedy/)다. 그리디가 늘 그렇듯 전체로 보면 못 끊는 경우가 있다. 토큰이 `a`, `ab`, `bc`일 때 `abc`는 `a` / `bc`로 끊을 수 있지만, 최장 일치는 `ab`를 먼저 떼고 남은 `c`에서 오류를 낸다. 프로그래밍 언어는 토큰을 이런 일이 없게 정한다.
- 흔한 실수: `>=`를 `>`와 `=`로 끊는다. 더 긴 `>=`가 토큰이면 그쪽이다.
- 흔한 실수: 예약어로 시작하는 이름(`ifx`, `format`)을 예약어와 나머지로 끊는다. 길이가 먼저이고 우선순위는 길이가 같을 때만 본다.
- 파이썬 `re`의 <code>a&#124;ab</code>는 가장 긴 것이 아니라 왼쪽에 적힌 것부터 맞춰 본다. 어휘 분석기의 최장 일치와 다르다: [문자열 파싱과 정규 표현식](/Hongs_Blog/studies/algorithms/string-parsing/).

## 연결

- 선수: [토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/), [부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/)
- 표의 바탕: [유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/)
- 자른 토큰을 받아 문법을 따지는 다음 단계: [문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 예시의 전이 표로 `ab1(`을 끊는다. 걸음마다 상태를 적고, 잘라 낸 렉심과 토큰을 차례로 쓰라.</summary>

**답:** $$T_0$$ →(a) $$T_1$$ →(b) $$T_2$$ →(1) $$T_3$$ →( `(` ) 갈 곳 없음. `ab1`을 잘라 $$sIdentifier$$. 남은 `(`: $$T_0$$ →( `(` ) $$T_4$$, 입력 끝. `(`를 잘라 $$lparen$$.<br>
**이유:** $$T_3$$이 받아들이는 상태이고 거기서 `(`로 가는 칸이 $$\varnothing$$이다. 마지막으로 받아들인 자리가 `ab1`이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 본문의 의사코드(`mIdx = 0`부터 "잘라 내고 분류한다"까지)가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 입력의 앞부분을 한 글자씩 늘려 가며 토큰 모양에 맞을 때마다 그 길이를 적어 두었다가, 마지막에 적힌 길이(가장 긴 것)만큼 잘라 토큰으로 분류한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 토큰이 $$Keyword = if \mid else \mid for$$, $$Identifier$$(글자나 밑줄로 시작)이고 예약어가 우선이다. `if`, `ifx`, `iffy if`는 각각 어떻게 끊기고 분류되는가? 무엇이 길이로 정해지고 무엇이 우선순위로 정해지는가?</summary>

**답:** `if` → 예약어. `ifx` → 식별자 하나. `iffy if` → 식별자 `iffy`, 빈칸, 예약어 `if`. `ifx`와 `iffy`는 길이로 정해진다(더 긴 식별자 모양이 있다). 혼자 있는 `if`는 두 모양의 길이가 같아 우선순위로 정해진다.<br>
**이유:** 흔한 오답은 `ifx`를 예약어 `if`와 식별자 `x`로 끊는 것이다. 우선순위는 같은 조각이 여러 토큰에 맞을 때만 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 표를 따라가다 갈 곳이 없어지면 남은 글자를 더 보지 않고 멈춰도 되는 까닭은 무엇인가? 그리고 자르는 자리가 "막히기 바로 앞"이 아니라 "마지막으로 받아들인 자리"인 까닭을 토큰 `a`, `abc`와 입력 `abd`로 설명하라.</summary>

**답:** DFA가 한 번 막히면 뒤에 무엇을 붙여도 받아들이지 못한다. 그래서 더 긴 앞부분은 토큰이 될 수 없다. `abd`에서 `ab`까지 읽고 `d`에서 막히는데, `ab`는 토큰이 아니다(`abc`의 중간일 뿐이다). 토큰이었던 마지막 앞부분은 `a`이므로 `a`를 자르고 `b`부터 다시 읽는다.<br>
**이유:** 막히기 바로 앞 상태가 받아들이는 상태라는 보장이 없다. 그래서 받아들이는 상태를 지날 때마다 자리를 적어 둔다.

</details>
{% endraw %}
