---
layout: "note"
title: "알파벳·문자열·언어"
display_title: "알파벳·문자열·언어 (Alphabet, String, and Language)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Alphabet String and Language", "알파벳", "Alphabet", "문자열", "String", "언어", "Language", "형식 언어", "Formal Language", "빈 문자열", "Empty String", "엡실론", "Epsilon", "접합", "연결", "Concatenation", "클레이니 닫힘", "Kleene Closure", "클레이니 스타", "양의 닫힘", "Positive Closure"]
description: "쓸 수 있는 글자의 목록을 먼저 정하고, 그 글자를 줄 세운 것을 글자 줄이라 하고, 글자 줄 가운데 \"우리 편\"으로 치는 것만 모은 주머니를 언어라 부른다. \"식별자란 무엇인가\"를 \"이 주머니에 든 글자 줄\"이라고 말할 수 있게 되어, 토큰의 모양을 집합 계산으로 다룰 수 있다.…"
prev_url: "/studies/compilers/token-lexeme/"
prev_title: "토큰과 렉심"
next_url: "/studies/compilers/regular-expression/"
next_title: "정규 표현식"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "04_alphabet-string-language_verify.py", "u": "/studies/compilers/code/04_alphabet-string-language_verify/", "r": "검증"}]
permalink: "/studies/compilers/alphabet-string-language/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쓸 수 있는 글자의 목록을 먼저 정하고, 그 글자를 줄 세운 것을 글자 줄이라 하고, 글자 줄 가운데 "우리 편"으로 치는 것만 모은 주머니를 언어라 부른다. "식별자란 무엇인가"를 "이 주머니에 든 글자 줄"이라고 말할 수 있게 되어, 토큰의 모양을 집합 계산으로 다룰 수 있다. 다만 여기서 말하는 언어는 뜻이나 문법을 묻지 않는다. 주머니에 들었는지 아닌지만 본다. 또 글자 줄은 순서가 있어서, 이어 붙이는 차례를 바꾸면 대개 다른 줄이 된다.

</div>


## 예시로 보기

"식별자는 글자로 시작하고 글자나 숫자가 이어진다"를 말로만 적으면 프로그램이 검사할 수 없다. 검사하려면 "어떤 글자 줄이 식별자인가"를 예, 아니오로 답할 수 있는 모음으로 적어야 한다.

글자를 `a`와 `b` 둘만 쓰기로 한다. 이 둘로 만들 수 있는 줄은 `a`, `b`, `aa`, `ab`, `ba`, `bb`, `aaa`, …로 끝이 없다. 이 가운데 몇 개를 골라 주머니에 담는다.

- $$L_1 = \{a, ab, ba, aba\}$$: 줄이 네 개뿐인 주머니다.
- $$L_2 = \{a, b, aa, ab, ba, bb, aaa, \dots\}$$: 줄이 끝없이 많은 주머니다.

쓰기로 한 글자의 목록 $$\{a, b\}$$를 알파벳, 글자를 줄 세운 것을 문자열, 문자열을 담은 주머니를 언어라 부른다. "`ab`는 $$L_1$$의 문자열인가?"는 주머니를 들여다보면 답이 나온다.

## 정의

**알파벳.** 알파벳 $$\Sigma$$(시그마)는 기호를 유한 개 모은 집합이다. 예: 글자 $$\Sigma^L = \{A, B, \dots, Z, a, b, \dots, z\}$$, 숫자 $$\Sigma^D = \{0, 1, \dots, 9\}$$.

**문자열.** 알파벳 $$\Sigma$$ 위의 문자열 $$s$$는 $$\Sigma$$에서 뽑은 기호를 유한 개 **줄 세운 것**이다. $$\Sigma = \{0\}$$이면 $$0$$, $$00$$, $$000$$이 문자열이고, $$\Sigma = \{a, b\}$$이면 $$a$$, $$b$$, $$aa$$, $$ab$$, $$ba$$가 문자열이다.

문자열에서는 기호의 순서와 겹침이 중요하다. 그래서 문자열은 기호의 집합이 아니다. 집합은 순서와 겹침을 따지지 않으므로, 집합으로 보면 $$ab$$와 $$ba$$가 같고 $$aa$$와 $$a$$도 같아진다. 문자열로는 넷이 모두 다르다[^s2].


**언어.** 언어 $$L$$은 정해 둔 알파벳 $$\Sigma$$ 위의 문자열을 모은 집합이다. 어떤 집합이든 된다. 문자열이 유한 개면 유한 언어, 끝없이 많으면 무한 언어다.

기호로 쓰면, $$\Sigma$$ 위의 모든 문자열의 집합을 $$\Sigma^*$$라 할 때 언어는 $$L \subseteq \Sigma^*$$다($$\subseteq$$는 "~의 부분집합"으로 읽는다).

### 문자열의 연산

| 표기 | 뜻 | 예와 성질 |
|---|---|---|
| $$\lvert s \rvert$$ | 길이. $$s$$에 기호가 놓인 자리의 수 | $$s = compiler$$이면 $$\lvert s \rvert = 8$$ |
| $$s_1 s_2$$ | 이어 붙이기(접합). $$s_1$$ 뒤에 $$s_2$$를 붙인다 | $$CSE$$, $$@$$, $$CAU$$를 이으면 $$CSE@CAU$$. $$\lvert s_1 s_2 \rvert = \lvert s_1 \rvert + \lvert s_2 \rvert$$ |
| $$\epsilon$$ | 빈 문자열. 기호가 하나도 없는 줄. "엡실론"으로 읽는다 | $$\lvert \epsilon \rvert = 0$$. $$\epsilon s = s = s\epsilon$$ |
| $$s^i$$ | 거듭 쓰기. $$s$$를 $$i$$번 이어 붙인다 | $$s^0 = \epsilon$$, $$s^1 = s$$, $$s^2 = ss$$. $$i > 0$$이면 $$s^i = s^{i-1}s$$ |

이어 붙이기는 순서를 바꿔도 된다는 법칙이 없다. $$ab \cdot ba = abba$$이고 $$ba \cdot ab = baab$$처럼 대개는 순서를 바꾸면 다른 문자열이 된다. 그렇다고 서로 다른 두 문자열이면 반드시 달라지는 것도 아니다. $$ab \cdot abab = ababab = abab \cdot ab$$다. 두 문자열이 같은 조각($$ab$$)을 되풀이한 것이라서, 어느 쪽을 먼저 붙여도 그 조각이 세 번 이어진다[^s2].


### 언어의 연산

언어는 집합이라서 집합 연산을 그대로 쓰고, 문자열의 이어 붙이기를 집합으로 넓혀 쓴다.

| 표기 | 말로 | 기호로 쓰면 | 예 |
|---|---|---|---|
| $$L_1 \cup L_2$$ | 합치기. 둘 중 한 곳에라도 든 문자열 | $$\{s \mid s \in L_1 \text{ 또는 } s \in L_2\}$$ | $$\{a, ab\} \cup \{b, aa\} = \{a, b, ab, aa\}$$ |
| $$L_1 L_2$$ | 이어 붙이기. 앞 것 하나와 뒤 것 하나를 골라 이은 모든 문자열 | $$\{s_1 s_2 \mid s_1 \in L_1,\ s_2 \in L_2\}$$ | $$\{a, ab\}\{b, aa\} = \{ab, aaa, abb, abaa\}$$ |
| $$L^i$$ | $$L$$을 $$i$$번 이어 붙이기 | $$L^0 = \{\epsilon\}$$, $$L^i = L^{i-1}L$$ | $$L = \{a, ab\}$$이면 $$L^2 = \{aa, aab, aba, abab\}$$ |
| $$L^*$$ | 0번 이상 이어 붙인 것 전부(클레이니 닫힘) | $$\bigcup_{i=0}^{\infty} L^i = L^0 \cup L^1 \cup L^2 \cup \cdots$$ | $$L = \{0\}$$이면 $$L^* = \{\epsilon, 0, 00, 000, \dots\}$$ |
| $$L^+$$ | 한 번 이상 이어 붙인 것 전부(양의 닫힘) | $$\bigcup_{i=1}^{\infty} L^i = L^1 \cup L^2 \cup \cdots$$ | $$L = \{0\}$$이면 $$L^+ = \{0, 00, 000, \dots\}$$ |

$$\{s \mid \text{조건}\}$$은 "조건에 맞는 $$s$$를 모두 모은 집합"으로 읽는다. $$\bigcup$$는 여러 집합을 한꺼번에 합친다는 표시다. $$L^0 = \{\epsilon\}$$인 것은 "한 번도 안 붙이면 빈 문자열 하나가 남는다"는 뜻이다. 빈 집합 $$\varnothing$$과 다르다.

$$L_1 L_2$$를 구할 때는 앞에서 하나, 뒤에서 하나를 고르는 모든 짝을 만든다. $$\{a, ab\}\{b, aa\}$$는 $$a \cdot b$$, $$a \cdot aa$$, $$ab \cdot b$$, $$ab \cdot aa$$ 네 개다.

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$L^+$$는 $$L^*$$에서 빈 문자열만 뺀 것이다"</div>

늘 맞는 말은 아니다. $$L^*$$와 $$L^+$$의 차이는 $$L^0 = \{\epsilon\}$$을 넣느냐 마느냐뿐이라서, $$L^+ = L^* - \{\epsilon\}$$으로 쓰고 싶어진다. 그런데 $$L$$ 자체에 빈 문자열이 들어 있으면 한 번만 이어 붙여도($$L^1 = L$$) 빈 문자열이 나온다. $$L = \{\epsilon, a\}$$이면 $$L^+$$에 $$\epsilon$$이 있지만 $$L^* - \{\epsilon\}$$에는 없다. 그래서 이 식은 $$\epsilon \notin L$$일 때만 맞는다. $$L = \{0\}$$처럼 빈 문자열이 없는 언어에서는 맞는다. 조건 없이 늘 맞는 식은 $$L^+ = L L^*$$(하나를 먼저 고르고 그 뒤에 0번 이상 더 붙인다)다[^s2].

</div>



<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 모든 예, 길이 4 이하의 모든 문자열 쌍에서 $$\lvert s_1 s_2 \rvert = \lvert s_1 \rvert + \lvert s_2 \rvert$$, 문자열을 집합으로 볼 때와 순서를 바꿔 이을 때와 $$L^+ = L^* - \{\epsilon\}$$의 반례, 길이 4 이하에서 $$L^+ = L L^*$$, 카드의 답 — [04_alphabet-string-language_verify.py](/Hongs_Blog/studies/compilers/code/04_alphabet-string-language_verify/)</div>

</div>


## 활용

- 토큰 하나는 언어 하나다. "식별자"는 식별자 모양의 문자열을 모두 모은 집합이고, 어떤 렉심이 식별자인지는 그 집합에 드는지로 정한다: [토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/).
- 합치기, 이어 붙이기, 닫힘 세 연산이 [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)의 <code>&#124;</code>, 이어 쓰기, `*`가 된다.
- 흔한 실수: $$\varnothing$$(문자열이 하나도 없는 언어)과 $$\{\epsilon\}$$(빈 문자열 하나가 든 언어)을 같게 본다. 앞의 것은 크기가 0, 뒤의 것은 1이다.
- 흔한 실수: $$L_1 L_2$$의 크기를 늘 $$\lvert L_1 \rvert \times \lvert L_2 \rvert$$로 센다. 서로 다른 짝이 같은 문자열을 만들면 줄어든다. $$\{a, aa\}\{a, aa\} = \{aa, aaa, aaaa\}$$는 4개가 아니라 3개다[^s1].

## 연결

- 선수: [집합](/Hongs_Blog/studies/discrete-math/sets/)
- $$L^*$$처럼 "기본 것에서 시작해 규칙을 되풀이해 만든 것 전부"로 집합을 정하는 방법: [재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/)
- 언어를 짧게 적는 표기: [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$L_1 = \{a, b\}$$, $$L_2 = \{\epsilon, c\}$$일 때 $$L_1 L_2$$를 구하라. $$L = \{0, 11\}$$일 때 $$L^2$$를 구하라.</summary>

**답:** $$L_1 L_2 = \{a, b, ac, bc\}$$. $$L^2 = \{00, 011, 110, 1111\}$$.<br>
**이유:** 앞에서 하나, 뒤에서 하나를 고르는 모든 짝을 잇는다. $$\epsilon$$을 고르면 앞 문자열이 그대로 남는다. 흔한 오답은 $$\epsilon$$을 고른 짝을 빼먹어 $$\{ac, bc\}$$만 쓰는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "서로 다른 두 문자열은 이어 붙이는 순서를 바꾸면 반드시 다른 문자열이 된다"가 틀렸음을 보이는 예를 들라. 순서를 바꾸면 정말 달라지는 예도 하나 들라.</summary>

**답:** $$a$$와 $$aa$$. $$a \cdot aa = aaa = aa \cdot a$$다. 달라지는 예는 $$ab$$와 $$ba$$다. $$ab \cdot ba = abba$$, $$ba \cdot ab = baab$$.<br>
**이유:** 두 문자열이 같은 조각을 되풀이한 것이면 어느 쪽을 먼저 붙여도 그 조각이 같은 횟수만큼 이어진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\varnothing$$, $$\{\epsilon\}$$, $$\epsilon$$은 각각 무엇인가? $$\varnothing^*$$는 무엇인가?</summary>

**답:** $$\varnothing$$은 문자열이 하나도 없는 언어, $$\{\epsilon\}$$은 빈 문자열 하나만 든 언어, $$\epsilon$$은 길이 0인 문자열이다. $$\varnothing^* = \{\epsilon\}$$이다.<br>
**이유:** $$L^* = L^0 \cup L^1 \cup \cdots$$이고 $$L^0$$은 어떤 $$L$$에서든 $$\{\epsilon\}$$이다. $$\varnothing^1$$부터는 고를 문자열이 없어 모두 $$\varnothing$$이다[^s1].

</details>


[^s1]: 검증 코드로 확인했다.
[^s2]: 문자열을 집합으로 볼 때의 문제, 순서를 바꿔 이어도 같은 예 $$ab$$와 $$abab$$, $$L^+ = L^* - \{\epsilon\}$$의 조건과 $$L^+ = L L^*$$는 검증 코드로 확인했다. 표준 정의는 Aho·Lam·Sethi·Ullman, *Compilers: Principles, Techniques, and Tools* 2판, 3.3.1~3.3.2절을 따랐다.
{% endraw %}
