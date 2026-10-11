---
layout: "note"
title: "정규 표현식 연습"
display_title: "정규 표현식 연습"
kind: "practice"
kind_label: "연습"
num: "05"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 정규 표현식의 기본 다섯 식, 우선순위, 대수 법칙."
next_url: "/studies/compilers/subset-construction-ladder/"
next_title: "부분집합 구성법 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/regular-expression-practice/"
---
{% raw %}
사용 개념: [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)의 기본 다섯 식, 우선순위, 대수 법칙.

말로 된 토큰 설명을 식으로 옮기는 문제는 같은 차례로 푼다. ① 토막 나누기: 설명을 "처음에 오는 것, 그다음에 오는 것"으로 끊는다 ② 토막마다 고르기: 그 자리에 올 수 있는 것을 <code>&#124;</code>로 잇는다 ③ 횟수 정하기: 그 토막이 몇 번 오는지에 따라 그대로, `*`, `+`, 또는 $$\epsilon$$과의 선택을 고른다 ④ 맞는 예와 틀린 예 넣어 보기[^s1].

문제 2~4는 슬라이드가 식을 비워 둔 예 4~6이다[^1]. $$digit = 0 \mid 1 \mid \cdots \mid 9$$, $$letter = a \mid \cdots \mid z \mid A \mid \cdots \mid Z$$로 둔다.

## 문제 p1 · 우선순위 읽기

<code>a&#124;bc*</code>에 괄호를 모두 채워 쓰고, 이 식이 가리키는 문자열 가운데 길이 3 이하인 것을 모두 쓰라. `ac`, `bcbc`는 여기에 드는가?

풀이 전략: 가장 먼저 묶이는 것부터 안쪽 괄호를 친다. 반복 → 연결 → 선택 순서다[^2].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *반복 묶기:* `*`는 바로 앞의 `c`에만 걸린다. <code>a&#124;b(c*)</code>.
2. *연결 묶기:* `b`와 `(c*)`를 잇는다. <code>a&#124;(b(c*))</code>.
3. *선택:* 맨 바깥이 <code>&#124;</code>다. "a 하나" 또는 "b 뒤에 c가 0번 이상".
4. *늘어놓기:* `a`, `b`, `bc`, `bcc`.

`ac`는 들지 않는다. <code>(a&#124;b)c*</code>로 읽었을 때만 든다. `bcbc`도 들지 않는다. <code>a&#124;(bc)*</code>로 읽었을 때만 든다.

</details>


변형: <code>ab*&#124;c</code>와 <code>(ab)*&#124;c</code>에서 `abab`는 어느 쪽에 드는가? (답: 뒤쪽에만 든다.)

## 문제 p2 · 정수

"정수는 숫자가 하나 이상 이어진 것이다(0, 11, 1530)"를 기본 다섯 식만으로 적으라.

풀이 전략: "하나 이상"은 `+`다. 기본 식에는 `+`가 없으므로 $$r^+ = rr^*$$로 푼다[^3].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *토막 나누기:* 토막은 "숫자" 하나뿐이다.
2. *횟수 정하기:* 하나 이상이므로 $$digit^+$$.
3. *기본 식으로:* $$Integer = digit\;digit^*$$.
4. *넣어 보기:* `0`, `11`, `1530`은 맞는다. 빈 문자열은 맞지 않는다. `007`도 맞는다. 설명이 "숫자가 하나 이상"이라고만 했기 때문이다.

</details>


변형: 앞에 쓸데없는 0이 붙지 않는 정수(`0`은 되고 `007`은 안 된다)를 적으라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

$$0 \mid nonzero\;digit^*$$, 여기서 $$nonzero = 1 \mid 2 \mid \cdots \mid 9$$. "0 하나"이거나 "0이 아닌 숫자로 시작해 숫자가 이어진 것"이다.

</details>


## 문제 p3 · 식별자

"식별자는 글자, 숫자, 밑줄이 하나 이상 이어진 것이고 숫자로 시작하지 않는다(aaa, i, funcAtoB, _var, main, variable123)"를 적으라.

풀이 전략: "~로 시작하지 않는다" 같은 조건은 첫 자리를 따로 떼어 토막 둘로 나눈다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *토막 나누기:* 첫 글자 하나, 그리고 나머지.
2. *토막마다 고르기:* 첫 글자는 $$letter \mid \_$$. 나머지 자리는 $$letter \mid digit \mid \_$$.
3. *횟수 정하기:* 첫 글자는 한 번. 나머지는 없어도 되므로 `*`.
4. *식:* $$Identifier = (letter \mid \_)(letter \mid digit \mid \_)^*$$.
5. *넣어 보기:* 예 여섯 개가 모두 맞는다. `123variable`은 첫 자리에서 걸린다.

흔한 오답은 $$(letter \mid digit \mid \_)^+$$다. 숫자로 시작하는 것까지 받는다.

</details>


## 문제 p4 · 실수

다음이 모두 맞는 식을 적으라: 0.5, 3.14, -6.111, 1.0E+3, 100.0, -10.53E-1, 9.123E3.

풀이 전략: 예를 나란히 놓고 "늘 있는 토막"과 "있을 때도 없을 때도 있는 토막"을 가른다. 있어도 없어도 되는 토막은 $$\epsilon$$과의 선택으로 적는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *토막 나누기:* 부호 / 점 앞의 숫자들 / 점 / 점 뒤의 숫자들 / 지수.
2. *부호:* `-`가 있거나 없다. $$(- \mid \epsilon)$$.
3. *숫자들:* 점 앞뒤 모두 하나 이상. $$digit^+\;.\;digit^+$$.
4. *지수:* 통째로 있거나 없다. 있으면 `E`, 있거나 없는 부호(`+` 또는 `-`), 숫자 하나 이상. $$(\epsilon \mid E(+ \mid - \mid \epsilon)\,digit^+)$$.
5. *식:* $$Float = (- \mid \epsilon)\;digit^+\;.\;digit^+\;(\epsilon \mid E(+ \mid - \mid \epsilon)\,digit^+)$$.
6. *넣어 보기:* 일곱 예가 모두 맞는다. `5`, `.5`, `5.`, `1.0E`는 맞지 않는다.

답은 하나가 아니다. 예만으로는 `.5`나 `+1.0`을 받을지 정해지지 않는다. 받게 하려면 그 토막의 횟수와 선택지를 바꾼다[^s1].

</details>


## 문제 p5 · 법칙으로 줄이기

(가) $$(a \mid \epsilon)^*$$를 더 짧게 쓰라. (나) $$(a^*)^*b \mid (a^*)^*c$$를 더 짧게 쓰라. (다) $$(a \mid b)^*$$와 $$a^* \mid b^*$$는 같은가?

풀이 전략: 대수 법칙 표[^2]에서 모양이 맞는 줄을 찾아 한 번에 하나씩 쓴다. 같은지 아닌지는 한쪽에만 드는 문자열을 찾아본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) $$a^*$$. 반복 안의 $$\epsilon$$은 빼도 된다($$r^* = (r \mid \epsilon)^*$$).

(나) *멱등:* $$(a^*)^* = a^*$$이므로 $$a^*b \mid a^*c$$. *분배를 거꾸로:* $$a^*(b \mid c)$$.

(다) 다르다. `ab`는 $$(a \mid b)^*$$에는 들고 $$a^* \mid b^*$$에는 들지 않는다. 앞의 식은 자리마다 a와 b를 새로 고르고, 뒤의 식은 a만 되풀이하거나 b만 되풀이한다.

</details>


변형: $$ab \mid ac \mid a$$를 분배 법칙으로 묶으라. (답: $$a(b \mid c \mid \epsilon)$$. 마지막 $$a$$는 $$a\epsilon$$으로 본다.)

## 문제 p6 · 실전 표기를 기본 식으로

파이썬 `re`의 표기를 기본 다섯 식으로 풀어 쓰라. 알파벳은 $$\{a, b\}$$다. (가) `a?b+` (나) `[ab]{2}` (다) `(ab){1,2}`

풀이 전략: `?`는 $$\epsilon$$과의 선택, `+`는 $$rr^*$$, `[ ]`는 <code>&#124;</code>로 잇기, `{n}`은 $$n$$번 이어 쓰기로 바꾼다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) $$(a \mid \epsilon)bb^*$$

(나) $$(a \mid b)(a \mid b)$$

(다) $$ab \mid abab$$. 또는 $$ab(ab \mid \epsilon)$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 여섯 문제와 변형의 답을 길이 4~7 이하의 모든 문자열에서 확인했다 — [05_regular-expression-practice_p6.py](/Hongs_Blog/studies/compilers/code/05_regular-expression-practice_p6/)</div>

</div>


[^1]: 컴파일러 2회 강의 자료 「Lecture02 Lexical analysis part 1」, p.22~24 (예 4 정수, 예 5 식별자, 예 6 실수. 식은 비어 있다)
[^2]: 같은 자료, p.20 (우선순위와 대수 법칙)
[^3]: 같은 자료, p.19 ($$a^+ = aa^*$$)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 풀이의 네 걸음, 문제 p1·p5·p6과 모든 변형, 문제 p2~p4의 답은 원본에 없다. 문제 p2~p4의 말 설명과 예는 슬라이드의 것이다. 답은 문제 코드로 확인했다. 수업에서 쓴 답과 다를 수 있다.
{% endraw %}
