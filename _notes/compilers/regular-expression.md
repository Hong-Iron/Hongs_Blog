---
layout: "note"
title: "정규 표현식"
display_title: "정규 표현식 (Regular Expression)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Regular Expression", "정규식", "regex", "정규 언어", "Regular Language", "기본 정규 표현식", "Basic Regular Expression", "클레이니 스타", "Kleene Star", "정규 표현식의 대수 법칙", "형식 언어의 포함 관계", "촘스키 위계", "Chomsky Hierarchy"]
description: "레고는 몇 가지 기본 블록과 \"옆에 붙인다\", \"둘 중 하나를 고른다\", \"원하는 만큼 되풀이한다\"는 조립법만으로 온갖 모양을 만든다. 정규 표현식도 글자 한 개짜리 블록과 이 세 조립법만으로 \"어떤 모양의 글자 줄인가\"를 한 줄로 적는다. 단순해서 기계가 다루기 쉬운데도 이름, …"
prev_url: "/studies/compilers/alphabet-string-language/"
prev_title: "알파벳·문자열·언어"
next_url: "/studies/compilers/finite-automata/"
next_title: "유한 오토마타"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/regular-expression/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

레고는 몇 가지 기본 블록과 "옆에 붙인다", "둘 중 하나를 고른다", "원하는 만큼 되풀이한다"는 조립법만으로 온갖 모양을 만든다. 정규 표현식도 글자 한 개짜리 블록과 이 세 조립법만으로 "어떤 모양의 글자 줄인가"를 한 줄로 적는다. 단순해서 기계가 다루기 쉬운데도 이름, 수, 연산자 같은 토큰의 모양을 적기에는 넉넉하다. 대신 개수를 세어 맞춰야 하는 모양, 예를 들어 여는 괄호와 닫는 괄호의 수가 같은 줄은 적을 수 없다.

</div>


## 예시로 보기

"정수는 숫자가 하나 이상 이어진 것"을 [언어](/Hongs_Blog/studies/compilers/alphabet-string-language/)로 적으려면 $$\{0, 1, \dots, 9, 00, 01, \dots\}$$처럼 끝없는 목록을 써야 한다. 목록 대신 "만드는 법"을 적으면 한 줄로 끝난다.

글자 `a`, `b`만 쓰는 작은 예로 조립법 셋을 본다.

| 적은 식 | 읽는 법 | 이 식이 가리키는 문자열 |
|---|---|---|
| `a` | 글자 a 하나 | a |
| `ab` | a 다음에 b | ab |
| `a\|b` | a 또는 b | a, b |
| `a*` | a를 0번 이상 | (빈 문자열), a, aa, aaa, … |
| `(a\|b)*` | a 또는 b를 0번 이상 | a와 b로 된 모든 문자열 |
| `(a\|b)(a\|b)` | a 또는 b, 그다음 또 a 또는 b | aa, ab, ba, bb |

마지막 줄은 [언어의 이어 붙이기](/Hongs_Blog/studies/compilers/alphabet-string-language/) $$\{a, b\}\{a, b\}$$를 식으로 적은 것이다. 식 하나가 언어 하나를 가리킨다. 정규 표현식 $$r$$이 가리키는 언어를 $$L(r)$$로 쓰고 "엘 알"로 읽는다[^1].

## 정의

정규 표현식은 정규 언어를 적는 표기다. 기본 식은 다섯 가지뿐이다[^1]. 알파벳 $$\Sigma$$가 정해져 있고, $$r_1$$과 $$r_2$$는 이미 만든 정규 표현식이다.

| 정규 표현식 | 말로 | 가리키는 언어 |
|---|---|---|
| $$\epsilon$$ | 빈 문자열 | $$L(\epsilon) = \{\epsilon\}$$ |
| $$a$$ | $$\Sigma$$의 기호 하나 | $$L(a) = \{a\}$$ |
| $$r_1 \mid r_2$$ | $$r_1$$ 또는 $$r_2$$(선택) | $$L(r_1) \cup L(r_2)$$ |
| $$r_1 r_2$$ | $$r_1$$ 다음에 $$r_2$$(연결) | $$L(r_1)L(r_2) = \{s_1 s_2 \mid s_1 \in L(r_1),\ s_2 \in L(r_2)\}$$ |
| $$r^*$$ | $$r$$을 0번 이상(반복) | $$\bigcup_{i \ge 0} L(r^i)$$ |

$$r^i$$는 $$r$$을 $$i$$번 이어 쓴 식이고 $$r^0 = \epsilon$$이다. 그래서 $$L(r^*)$$에는 늘 빈 문자열이 들어 있다.

**어떤 식이 정규 표현식인가.** 기본 다섯 식만으로 적을 수 있으면 정규 표현식이고, 그럴 때만 정규 표현식이다[^2]. 처음 두 줄이 블록이고 나머지 세 줄이 조립법이다. 블록에서 시작해 조립법을 유한 번 쓴 것만 정규 표현식이다. 이렇게 "기본 것과 만드는 규칙"으로 정하는 방식이 [재귀적 정의](/Hongs_Blog/studies/discrete-math/recursive-definitions/)다.

| 식 | 정규 표현식인가 | 까닭 |
|---|---|---|
| $$a^+$$ (a를 한 번 이상) | 그렇다 | $$a^+ = aa^*$$로 고쳐 쓸 수 있다[^2] |
| $$(a \mid b)^*$$ | 그렇다 | 선택과 반복만 썼다 |
| $$letter(letter \mid digit)^*$$ | 그렇다 | $$letter$$와 $$digit$$가 각각 글자, 숫자를 `\|`로 이은 식이다 |
| $$(^n\,)^n$$ (여는 괄호 $$n$$개 뒤에 닫는 괄호 $$n$$개, $$n \ge 0$$) | 아니다 | 다섯 식으로는 앞뒤의 개수를 맞출 수 없다[^3] |
| $$a^n b^n$$ | 아니다 | 같은 까닭이다[^s1] |

넷째 줄을 다섯 식으로 적을 수 없다는 것은 [유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/)에서 증명한다. 프로그램의 괄호, 중괄호가 바로 이 모양이라서 문법을 적을 때는 정규 표현식 대신 [문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/)을 쓴다[^3].

**우선순위.** 괄호가 없으면 반복(`*`, `+`)을 가장 먼저, 그다음 연결, 마지막에 선택(<code>&#124;</code>)을 묶는다. 곱셈을 덧셈보다 먼저 하는 것과 같다[^4].

$$(r_1) \mid ((r_2)^*(r_3)) = r_1 \mid r_2^* r_3$$


<code>a&#124;b*c</code>는 "a 하나" 또는 "b 여러 개 뒤에 c"다. `abc`는 여기에 들지 않는다. <code>(a&#124;b)*c</code>로 괄호를 치면 든다.

**두 식이 같다는 것.** 가리키는 언어가 같으면 두 식을 같다고 한다. 기호로 쓰면 $$L(r_1) = L(r_2)$$일 때 $$r_1 = r_2$$다[^4]. 모양이 달라도 같은 식일 수 있다.

**대수 법칙.** 수의 덧셈·곱셈처럼 식을 고쳐 쓰는 규칙이 있다[^4].

| 연산 | 법칙 | 식으로 |
|---|---|---|
| 선택 | 순서를 바꿔도 같다(교환) | $$r_1 \mid r_2 = r_2 \mid r_1$$ |
| 선택 | 어디를 먼저 묶어도 같다(결합) | $$r_1 \mid (r_2 \mid r_3) = (r_1 \mid r_2) \mid r_3$$ |
| 연결 | 어디를 먼저 묶어도 같다(결합) | $$r_1(r_2 r_3) = (r_1 r_2)r_3$$ |
| 연결과 선택 | 연결을 선택 안으로 나눠 넣는다(분배) | $$r_1(r_2 \mid r_3) = r_1 r_2 \mid r_1 r_3$$ |
| $$\epsilon$$ | 이어 붙여도 그대로다(항등원) | $$r_1 \epsilon = \epsilon r_1 = r_1$$ |
| $$\epsilon$$ | 반복 안에는 늘 들어 있다 | $$r^* = (r \mid \epsilon)^*$$ |
| 반복 | 두 번 해도 한 번과 같다(멱등) | $$a^{**} = a^*$$ |

연결에는 교환 법칙이 없다. `ab`와 `ba`는 다른 문자열이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 기본 다섯 식의 뜻을 집합 연산으로 직접 계산해, 무작위 식 300조에서 일곱 법칙이 길이 6 이하의 모든 문자열에서 맞는 것, $$a^+ = aa^*$$, 우선순위 예, 아래 토큰 식과 카드의 답 — [05_regular-expression_verify.py](/Hongs_Blog/studies/compilers/code/05_regular-expression_verify/). 길이를 끊어 본 실험이고 증명은 아니다. 여섯째 법칙의 증명은 아래에 있다.</div>

</div>


## 증명

$$r^* = (r \mid \epsilon)^*$$를 보인다. 전략은 양쪽 포함이다. $$A = L(r)$$라 두면 보일 것은 $$A^* = (A \cup \{\epsilon\})^*$$다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. **왼쪽이 오른쪽에 든다.** $$w \in A^*$$이면 $$w = s_1 s_2 \cdots s_k$$이고 각 $$s_j \in A$$다. $$A \subseteq A \cup \{\epsilon\}$$이므로 각 $$s_j$$는 $$A \cup \{\epsilon\}$$에도 든다. 그래서 $$w \in (A \cup \{\epsilon\})^k \subseteq (A \cup \{\epsilon\})^*$$다. — 닫힘의 정의, 부분집합
2. **오른쪽이 왼쪽에 든다.** $$w \in (A \cup \{\epsilon\})^*$$이면 $$w = s_1 s_2 \cdots s_k$$이고 각 $$s_j$$는 $$A$$의 문자열이거나 $$\epsilon$$이다. — 닫힘의 정의
3. $$s_j = \epsilon$$인 조각을 모두 지운다. $$\epsilon s = s = s\epsilon$$이므로 지워도 $$w$$는 그대로다. — $$\epsilon$$은 이어 붙이기의 항등원
4. 남은 조각은 $$m$$개($$0 \le m \le k$$)이고 모두 $$A$$의 문자열이다. 그래서 $$w \in A^m \subseteq A^*$$다. 조각이 다 지워졌으면 $$w = \epsilon \in A^0$$이다. — 닫힘의 정의
5. 1과 2~4로 두 집합은 같다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 3단계에서 ε인 조각을 지워도 되는 까닭</summary>

$$\epsilon$$은 길이가 0이라 앞뒤 어디에 붙여도 문자열이 바뀌지 않는다($$\epsilon s = s = s\epsilon$$). 지운 뒤에 이은 결과가 여전히 $$w$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4단계에서 조각이 하나도 안 남는 경우를 따로 본 까닭</summary>

조각이 0개면 "$$A$$의 문자열을 0개 이은 것"이 되어야 하는데, 그것이 $$A^0 = \{\epsilon\}$$이다. $$A^*$$의 정의가 $$i = 0$$부터 합치기 때문에 이 경우도 $$A^*$$에 든다. $$A^+$$였다면 여기서 막힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

반복은 이미 "0번"을 품고 있어서 빈 문자열을 낼 수 있다. 그래서 고를 수 있는 조각에 $$\epsilon$$을 하나 더 넣어도 새로 만들 수 있는 문자열이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

$$a^{**} = a^*$$도 양쪽 포함으로 보인다. $$a^*$$의 문자열을 여러 개 이은 것은 결국 $$a$$를 여러 개 이은 것이므로 $$a^*$$에 든다. 두 정규 표현식이 같다는 주장은 모두 "가리키는 두 집합이 서로를 품는다"로 바꿔 보일 수 있다.

</details>


## 예제

토큰의 모양을 정규 표현식으로 적는다. 슬라이드의 여섯 예다[^5].

- **예약어.** `if`, `else`, `for` 가운데 하나다. $$Keyword = if \mid else \mid for \mid \cdots$$
- **비교 연산자.** $$Comparison = < \;\mid\; > \;\mid\; <= \;\mid\; >= \;\mid \cdots$$
- **빈칸.** 빈칸·탭·줄바꿈이 하나 이상 이어진 것이다. $$Whitespace = (␣ \mid \backslash t \mid \backslash n)^+$$. `␣`는 빈칸 한 글자다.

나머지 셋은 슬라이드가 식을 비워 두었다. 먼저 써 보고 펼친다. $$digit = 0 \mid 1 \mid \cdots \mid 9$$, $$letter = a \mid \cdots \mid z \mid A \mid \cdots \mid Z$$로 둔다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">정수: 숫자가 하나 이상 이어진 것 (0, 11, 1530)</summary>

\$$Integer = digit^+ = digit\;digit^*$$

"하나 이상"이라서 `*`가 아니라 `+`다. `*`로 쓰면 빈 문자열도 정수가 된다[^s3].

</details>


<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">식별자: 글자·숫자·밑줄이 하나 이상 이어지고, 숫자로 시작하지 않는 것 (aaa, _var, variable123)</summary>

\$$Identifier = (letter \mid \_)(letter \mid digit \mid \_)^*$$

첫 글자와 나머지를 따로 적는다. 첫 자리에는 숫자를 뺀 것만, 나머지 자리에는 셋 모두를 둔다[^s3].

</details>


<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">실수: 0.5, 3.14, -6.111, 1.0E+3, 100.0, -10.53E-1, 9.123E3</summary>

\$$Float = (- \mid \epsilon)\;digit^+\;.\;digit^+\;(\epsilon \mid E(+ \mid - \mid \epsilon)\,digit^+)$$

네 토막이다. 빼기 기호는 있어도 없어도 된다. 점 앞뒤에 숫자가 하나 이상 있다. 지수 토막은 통째로 있거나 없고, 있으면 `E`, 있어도 없어도 되는 부호, 숫자 하나 이상이다. "있어도 없어도 된다"는 $$\epsilon$$과의 선택으로 적는다. 일곱 예가 모두 이 식에 맞는다. `5.`이나 `.5`를 받을지는 슬라이드의 예만으로는 정할 수 없어 받지 않게 적었다[^s3].

</details>


**형식 언어의 포함 관계.** 정규 언어는 가장 안쪽의 작은 원이다. 정규 언어 ⊂ 문맥 자유 언어 ⊂ 문맥 의존 언어 ⊂ 귀납적 가산 언어 순서로 바깥 원이 안쪽 원을 품는다. 토큰에 가장 안쪽 것을 쓰는 까닭은 단순하면서도 토큰의 모양을 적기에 넉넉해서다[^6].

## 활용

- 어휘 분석기를 만들 때 토큰마다 정규 표현식을 하나씩 적고, 그것을 기계가 따라갈 수 있는 표로 바꾼다. 순서는 정규 표현식 → NFA → DFA다: [톰슨 구성법](/Hongs_Blog/studies/compilers/thompson-construction/), [부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/).
- 기본 식이 다섯 개뿐이라서 기계로 바꾸는 규칙도 다섯 개면 된다. `+`, `?`, `[a-z]` 같은 편한 표기는 다섯 식으로 풀어 쓴 뒤 바꾼다. 풀어 쓰는 법은 [문자열 파싱과 정규 표현식](/Hongs_Blog/studies/algorithms/string-parsing/)의 과목별 관점에 있다.
- 흔한 실수: <code>a&#124;b*c</code>를 <code>(a&#124;b)*c</code>로 읽는다. <code>&#124;</code>가 가장 늦게 묶인다.
- 흔한 실수: `*`와 `+`를 바꿔 쓴다. "비어 있어도 되는가"로 가른다.
- 연습: [정규 표현식 연습](/Hongs_Blog/studies/compilers/regular-expression-practice/)

## 연결

- 선수: [알파벳·문자열·언어](/Hongs_Blog/studies/compilers/alphabet-string-language/), [토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/)
- 같은 언어를 "받아들이는 기계"로 적는 방법: [유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/). 정규 표현식으로 적을 수 있는 언어와 유한 오토마타가 받아들이는 언어는 같다.
- 정규 표현식으로 못 적는 모양을 적는 표기: [문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"(a\|b)*는 a만 되풀이하거나 b만 되풀이한 것이다"</div>

틀렸다. <code>(a&#124;b)*</code>는 되풀이할 때마다 a와 b 가운데 하나를 새로 고른다. 그래서 `ab`, `ba`, `abba`처럼 섞인 문자열이 모두 든다. a만 되풀이하거나 b만 되풀이한 것은 <code>a*&#124;b*</code>이고, 여기에는 `ab`가 없다. 그럴듯해 보이는 까닭은 <code>(a&#124;b)</code>에서 한 번 고른 것을 `*`가 복사한다고 읽기 때문이다. 정의를 보면 $$L((a \mid b)^*) = \bigcup_i L((a \mid b)^i)$$이고 $$(a \mid b)^2 = (a \mid b)(a \mid b)$$라서 자리마다 따로 고른다. 길이 6 이하의 문자열을 모두 넣어 보면 <code>(a&#124;b)*</code>는 127개를 모두 받고, <code>a*&#124;b*</code>는 `ab`를 받지 않는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 기본 정규 표현식 다섯 가지와 각각이 가리키는 언어를 쓰라. 괄호가 없을 때 묶는 순서는?</summary>

**답:** $$\epsilon$$은 $$\{\epsilon\}$$, 기호 $$a$$는 $$\{a\}$$, $$r_1 \mid r_2$$는 $$L(r_1) \cup L(r_2)$$, $$r_1 r_2$$는 $$L(r_1)L(r_2)$$, $$r^*$$는 $$\bigcup_{i \ge 0} L(r^i)$$. 묶는 순서는 반복 → 연결 → 선택이다.<br>
**이유:** 흔한 오답은 `+`를 기본 식에 넣는 것이다. $$r^+$$는 $$rr^*$$로 풀리므로 기본 식이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** <code>ab&#124;c*</code>가 가리키는 문자열 가운데 길이 2 이하인 것을 모두 쓰라. `abc`와 `abab`는 여기에 드는가?</summary>

**답:** 빈 문자열, `c`, `cc`, `ab`. `abc`와 `abab`는 들지 않는다.<br>
**이유:** 묶으면 <code>(ab)&#124;(c*)</code>다. "ab 하나" 또는 "c를 0번 이상"이다. `*`는 바로 앞의 `c`에만 걸린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `a*b*`와 `(ab)*`는 같은 식인가? 한쪽에만 드는 문자열을 하나씩 들라.</summary>

**답:** 다르다. `aab`는 `a*b*`에만 든다. `abab`는 `(ab)*`에만 든다.<br>
**이유:** `a*b*`는 a가 몇 개든 먼저 다 나온 뒤 b가 나온다. `(ab)*`는 `ab` 한 덩어리를 되풀이한다. 두 식이 같으려면 가리키는 언어가 같아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$a^+$$는 기본 다섯 식에 없는데도 정규 표현식이다. 반면 "여는 괄호 $$n$$개 뒤에 닫는 괄호 $$n$$개"는 정규 표현식이 아니다. 두 판정의 기준은 무엇인가? 여는 괄호의 반복 뒤에 닫는 괄호의 반복을 이어 적으면 왜 안 되는가?</summary>

**답:** 기준은 "기본 다섯 식만으로 고쳐 쓸 수 있는가"다. $$a^+ = aa^*$$로 고쳐 쓸 수 있다. 괄호 짝은 고쳐 쓸 수 없다. 여는 괄호의 반복 뒤에 닫는 괄호의 반복을 이은 식은 `(()`처럼 개수가 다른 줄도 받는다.<br>
**이유:** 반복은 "몇 번 돌았는지"를 다음 반복에 넘겨주지 못한다. 앞의 반복과 뒤의 반복이 서로 따로 돈다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$r^* = (r \mid \epsilon)^*$$의 증명에서 "$$\epsilon$$인 조각을 지워도 문자열이 그대로다"는 어떤 법칙에서 나오는가? 이 법칙이 없다면 증명의 어느 방향이 막히는가?</summary>

**답:** $$\epsilon$$이 연결의 항등원이라는 법칙 $$\epsilon s = s = s\epsilon$$에서 나온다. 이것이 없으면 "오른쪽이 왼쪽에 든다"는 방향이 막힌다.<br>
**이유:** 왼쪽이 오른쪽에 드는 것은 $$A \subseteq A \cup \{\epsilon\}$$만으로 된다. 반대 방향에서는 $$\epsilon$$이 섞인 조각 줄을 $$A$$의 조각만으로 다시 적어야 한다.

</details>


[^1]: 컴파일러 2회 강의 자료 「Lecture02 Lexical analysis part 1」, p.18 (Regular expressions: 기본 다섯 식과 가리키는 언어)
[^2]: 같은 자료, p.19 (기본 식만으로 적을 수 있을 때만 정규 표현식, Q1 $$a^+ = aa^*$$, Q2 괄호 짝)
[^3]: 컴파일러 4회 강의 자료 「Lecture04 Syntax analysis part 1」, p.8~10 (괄호 짝은 정규 표현식이 아니다, 그래서 문맥 자유 문법을 쓴다)
[^4]: 컴파일러 2회 강의 자료 「Lecture02 Lexical analysis part 1」, p.20 (우선순위, 두 식이 같다는 것, 대수 법칙)
[^5]: 같은 자료, p.21~24 (토큰을 적는 예 여섯 개. 예 4·5·6의 식은 비어 있다)
[^6]: 같은 자료, p.12 (정규 언어를 쓰는 까닭, 형식 언어의 포함 관계 그림)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> $$a^n b^n$$의 예와 카드 C4의 설명은 원본에 없다. 괄호 짝과 같은 모양이다. 증명은 유한 오토마타 문서에 있다(Sipser, *Introduction to the Theory of Computation* 3판, 1.4절).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드는 법칙을 표로만 적었다. 증명과 스스로 설명해 보기, 카드 C5는 원본에 없다. 표준적인 양쪽 포함 증명이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본 p.22~24는 정수, 식별자, 실수의 식을 비워 두었다. 세 식은 슬라이드의 말 설명과 예에 맞게 적은 것이고, 슬라이드의 예가 모두 맞고 틀린 모양(`5`, `.5`, `1.0E`, 숫자로 시작하는 이름)은 맞지 않는 것을 검증 코드로 확인했다. 실수의 식은 답이 하나가 아니다. 수업에서 쓴 식과 다를 수 있다.
{% endraw %}
