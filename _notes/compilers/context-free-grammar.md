---
layout: "note"
title: "문맥 자유 문법"
display_title: "문맥 자유 문법 (Context Free Grammar)"
kind: "concept"
kind_label: "정의"
num: "11"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Context Free Grammar", "Context-Free Grammar", "CFG", "문맥 자유 언어", "Context-Free Language", "단말 기호", "Terminal", "비단말 기호", "Non-terminal", "시작 기호", "Start Symbol", "생성 규칙", "Production", "구문 분석기", "Syntax Analyzer", "Parser", "파서"]
description: "프로그램의 문장이 올바른 모양인지 정하는 규칙 묶음이다. \"식은 식 더하기 식이다\"처럼 이름 하나를 더 작은 조각들로 바꿔 쓰는 규칙을 모아 두고, 그 규칙을 거듭 써서 만들 수 있는 것만 올바른 문장으로 친다. 규칙 안에서 자기 이름을 다시 쓸 수 있어서, 괄호 짝이나 겹겹이 든…"
prev_url: "/studies/compilers/longest-match-tokenizing/"
prev_title: "최장 일치와 토큰 인식"
next_url: "/studies/compilers/derivation-parse-tree/"
next_title: "유도와 파스 트리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/context-free-grammar/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로그램의 문장이 올바른 모양인지 정하는 규칙 묶음이다. "식은 식 더하기 식이다"처럼 이름 하나를 더 작은 조각들로 바꿔 쓰는 규칙을 모아 두고, 그 규칙을 거듭 써서 만들 수 있는 것만 올바른 문장으로 친다. 규칙 안에서 자기 이름을 다시 쓸 수 있어서, 괄호 짝이나 겹겹이 든 if 문처럼 같은 모양이 안에 또 들어가는 구조를 적을 수 있다. 낱말을 적을 때 쓰던 방법(정규 표현식)으로는 이것을 못 적는다. 다만 규칙을 아무렇게나 쓰면 한 문장이 두 가지로 읽히거나 읽는 프로그램이 끝나지 않으므로, 쓴 뒤에 다듬어야 한다.

</div>


## 예시로 보기

앞 단계(어휘 분석기)는 글자들을 낱말로 잘라 준다. `A = B + C`는 `<ID, A>`, `<ASSIGNMENT>`, `<ID, B>`, `<ADD>`, `<ID, C>` 다섯 토큰이 된다. 그런데 토큰을 `<ID, A>`, `<ADD>`, `<ID, B>`, `<ASSIGNMENT>`, `<ID, C>` 순서로 늘어놓은 `A + B = C`도 낱말 하나하나는 멀쩡하다. 낱말이 놓인 순서가 틀렸다는 것은 어휘 분석기가 모른다. 영어 문장에서 낱말은 다 맞는데 동사 자리에 명사가 온 것과 같다[^1].

이 순서를 검사하는 단계가 구문 분석기(파서)다. 구문 분석기는 두 가지 일을 한다[^2].

1. 토큰들이 올바른 순서로 놓였는지 판정한다.
2. 올바르면 토큰들이 어떻게 묶이는지를 나무 모양으로 그려 낸다. 이 나무는 [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)에서 다룬다.

그러려면 "올바른 순서"를 적어 둘 방법이 필요하다. 토큰을 적을 때 쓴 [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)을 다시 쓰면 될까? 괄호에서 막힌다. `()`, `(())`, `((()))`처럼 여는 괄호 $$n$$개 뒤에 닫는 괄호가 똑같이 $$n$$개 오는 문자열만 고르는 정규 표현식은 없다[^3]. 정규 표현식에 `(*)*`라고 쓰면 `(()`도 통과한다. 여는 괄호를 몇 개 봤는지 기억할 방법이 없기 때문이다.

규칙을 이렇게 쓰면 된다[^4].

$$BALANCED \to (\,BALANCED\,) \mid \epsilon$$


읽는 법은 "BALANCED는 괄호 한 쌍 안에 BALANCED를 넣은 것이거나, 아무것도 없는 것이다"다. 화살표 왼쪽 이름을 오른쪽으로 바꿔 쓴다. 세로줄 $$\mid$$은 "또는"이고 $$\epsilon$$(엡실론)은 빈 문자열이다.

BALANCED에서 시작해 `(())`를 만들어 본다.

| 걸음 | 지금 모양 | 쓴 규칙 |
|---|---|---|
| 0 | BALANCED | |
| 1 | ( BALANCED ) | 첫째 규칙 |
| 2 | ( ( BALANCED ) ) | 첫째 규칙 |
| 3 | ( ( ) ) | 둘째 규칙(빈 문자열) |

첫째 규칙을 한 번 쓸 때마다 여는 괄호와 닫는 괄호가 하나씩 같이 생긴다. 그래서 개수가 어긋날 수 없다. 규칙 오른쪽에 자기 이름이 다시 나오는 것(재귀)이 정규 표현식에 없던 힘이다.

이 예에서 `(`와 `)`처럼 더 바꿀 수 없는 기호를 단말 기호, BALANCED처럼 다른 것으로 바꿔 쓰는 이름을 비단말 기호, 화살표로 적은 줄 하나하나를 생성 규칙이라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 균형 괄호 규칙이 길이 12 이하에서 정확히 `(` $$n$$개 뒤 `)` $$n$$개만 만드는 것, 슬라이드의 산술식·함수 호출·while 문법이 예로 든 문자열을 모두 만드는 것, 상태 3개 이하의 결정적 유한 오토마타를 모두 시험해도 균형 괄호를 가르는 것이 없는 것 — [11_context-free-grammar_verify.py](/Hongs_Blog/studies/compilers/code/11_context-free-grammar_verify/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

문맥 자유 문법(CFG)은 문맥 자유 언어를 적는 표기법이고, 네 가지로 이루어진다[^5].
- **단말 기호**(terminal): 기본 기호다. 다른 것으로 바꿀 수 없다. 보통 토큰 이름이 단말 기호다.
- **비단말 기호**(non-terminal): 문법 안에서 쓰는 변수다. 다른 비단말 기호나 단말 기호로 바꿀 수 있다.
- **시작 기호**(start symbol): 비단말 기호 가운데 하나다. 보통 첫 규칙의 왼쪽에 있는 비단말 기호다.
- **생성 규칙**(production, $$\to$$): 바꿔 쓰는 규칙이다.

모든 생성 규칙은 왼쪽에 비단말 기호 하나, 오른쪽에 단말 기호·비단말 기호·$$\epsilon$$을 늘어놓은 것이 오는 $$A \to \alpha$$ 꼴이다[^6].

</div>


기호로 쓰면 문법은 네 개짜리 묶음 $$G = (V_T, V_N, S, P)$$다. $$V_T$$는 단말 기호의 집합, $$V_N$$은 비단말 기호의 집합, $$S \in V_N$$은 시작 기호, $$P$$는 생성 규칙의 집합이다. 규칙 하나는 $$A \to \alpha$$이고 $$A \in V_N$$, $$\alpha \in (V_T \cup V_N)^*$$이다. $$(V_T \cup V_N)^*$$는 단말·비단말 기호를 0개 이상 늘어놓은 것 전부를 뜻하고, 0개일 때가 $$\epsilon$$이다[^s1].

슬라이드의 가장 작은 예는 단말 기호가 $$\{+, id\}$$, 비단말 기호가 $$\{S, E\}$$, 시작 기호가 $$S$$, 규칙이 $$S \to E + E$$와 $$E \to id$$ 둘인 문법이다[^6]. 이 문법이 만드는 문자열은 $$id + id$$ 하나뿐이다.

**이 수업의 표기 약속.** 비단말 기호는 대문자, 단말 기호는 소문자로 쓴다. 단말·비단말 기호와 $$\epsilon$$을 늘어놓은 것은 그리스 문자 $$\alpha$$(알파), $$\beta$$(베타), $$\omega$$(오메가)로 쓴다. 예: $$\alpha = aABBBcddef$$[^4].

**이름의 뜻.** 규칙의 왼쪽에 비단말 기호가 딱 하나만 있다. 그래서 그 기호가 어떤 기호들 사이(문맥)에 끼어 있든 상관없이 규칙을 쓸 수 있다. "문맥에서 자유롭다"는 이름이 여기서 나왔다[^s1].

**CFG의 규칙인 것과 아닌 것**[^s1].

| 규칙 | CFG의 규칙인가 | 이유 |
|---|---|---|
| $$E \to E + E$$ | 맞다 | 왼쪽이 비단말 기호 하나 |
| $$E \to \epsilon$$ | 맞다 | 오른쪽은 빈 문자열이어도 된다 |
| $$S \to id\,(\,E\,)$$ | 맞다 | 오른쪽에 단말과 비단말을 섞어 써도 된다 |
| $$aA \to ab$$ | 아니다 | 왼쪽에 기호가 둘이다. $$A$$ 앞에 $$a$$가 있을 때만 쓰는 규칙이라 문맥을 본다 |
| $$id \to E$$ | 아니다 | 왼쪽이 단말 기호다. 단말 기호는 바꿀 수 없다 |

### 정규 표현식과의 관계

슬라이드는 언어의 넓이를 네 겹의 원으로 그린다. 가장 안쪽이 정규 언어이고, 그 바깥이 문맥 자유 언어, 문맥 의존 언어, 재귀 열거 가능 언어 순이다[^7].

$$\text{정규 언어} \subsetneq \text{문맥 자유 언어} \subsetneq \text{문맥 의존 언어} \subsetneq \text{재귀 열거 가능 언어}$$


$$\subsetneq$$는 "왼쪽이 오른쪽 안에 들어 있고 둘이 같지는 않다"는 뜻이다. 정규 표현식으로 적을 수 있는 것은 모두 문맥 자유 문법으로도 적을 수 있고, 균형 괄호처럼 문맥 자유 문법으로만 적을 수 있는 것이 있다.

균형 괄호를 정규 표현식으로 못 적는 까닭은 정규 표현식과 힘이 같은 [유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/)로 따지면 분명해진다. 유한 오토마타는 상태 수가 정해져 있어서, 여는 괄호를 상태 수보다 많이 읽으면 몇 개 읽었는지 구별하지 못한다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기: 균형 괄호는 유한 오토마타로 가를 수 없다</summary>

귀류법과 비둘기집 원리를 쓴다. $$L = \{\,(^n\,)^n : n \ge 0\,\}$$을 정확히 받아들이는 결정적 유한 오토마타(DFA)가 있고 상태가 $$k$$개라고 하자. $$(^n$$은 여는 괄호를 $$n$$개 이어 쓴 것이다.
1. 문자열 $$(^0, (^1, \dots, (^k$$은 $$k + 1$$개다. 상태는 $$k$$개뿐이므로 이 가운데 두 문자열 $$(^i$$와 $$(^j$$ ($$i < j$$)는 읽고 난 뒤 같은 상태에 있다. — 비둘기집 원리
2. 두 문자열 뒤에 똑같이 $$)^i$$를 붙인다. 같은 상태에서 같은 글자들을 읽으므로 도착하는 상태도 같다. — DFA는 상태와 입력이 같으면 다음 상태가 하나로 정해진다
3. 그런데 $$(^i\,)^i$$는 $$L$$에 들어 있어 받아들여야 하고, $$(^j\,)^i$$는 개수가 달라 받아들이면 안 된다. 같은 상태가 받아들이는 상태이면서 아니어야 한다. 모순이다.
4. 그래서 그런 DFA는 없다. 정규 표현식은 DFA로 바꿀 수 있으므로([톰슨 구성법](/Hongs_Blog/studies/compilers/thompson-construction/), [부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/)) 그런 정규 표현식도 없다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 문자열을 왜 꼭 $$k + 1$$개 골랐는가?</summary>

상태가 $$k$$개이므로 문자열이 $$k$$개 이하면 모두 다른 상태에 갈 수도 있다. $$k + 1$$개여야 적어도 둘이 같은 상태에 간다고 말할 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 2단계에서 붙이는 것이 왜 $$)^j$$가 아니라 $$)^i$$여도 되는가?</summary>

어느 쪽을 붙여도 된다. 필요한 것은 "한쪽은 $$L$$에 들고 다른 쪽은 안 드는" 꼬리다. $$)^i$$를 붙이면 $$(^i)^i \in L$$, $$(^j)^i \notin L$$이고, $$)^j$$를 붙이면 반대로 갈린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

유한한 상태로는 끝없이 커지는 수(여는 괄호의 개수)를 다 구별하지 못한다. 구별하지 못한 두 경우에 같은 꼬리를 붙여 답이 달라야 하는 상황을 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

$$a^n b^n$$, 앞뒤가 같은 문자열(회문), `{`와 `}`의 짝처럼 "앞에서 본 개수나 내용을 뒤에서 그대로 맞춰야 하는" 언어가 정규 언어가 아님을 보일 때 같은 논법을 쓴다.

</details>


## 예제

슬라이드가 든 문법 네 개다. 괄호와 쉼표도 단말 기호다.

| 적으려는 것 | 문법 | 만들 수 있는 예 |
|---|---|---|
| 산술식[^8] | $$E \to E + E \mid E * E \mid (E) \mid id$$ | $$id + id$$, $$id * id$$, $$(id)$$, $$id + id * id$$, $$(id + id) * id$$ |
| 함수 호출[^9] | $$S \to id(E) \mid id()$$, $$\ E \to id, E \mid id$$ | `func(arg1, arg2)`, `print(arg)`, `func2()` |
| while 문의 머리[^10] | $$S \to while(E)$$, $$\ E \to T\ comparison\ T \mid T \mid \epsilon$$, $$\ T \to id \mid number$$ | `while(A > B)`, `while(A)`, `while(0)`, `while(3 > 2)`, `while()` |
| if 문[^11] | $$STMT \to if\,(EXPR)\ STMT\ else\ STMT \mid if\,(EXPR)\ STMT$$ | if 안에 if가 겹겹이 든 문장 |

**함수 호출 문법으로 `func(arg1, arg2)` 만들기.** 어휘 분석을 거치면 $$id(id, id)$$다.

1. *시작:* $$S$$
2. *인자가 있는 쪽 규칙 고르기:* $$S \to id(E)$$를 써서 $$id(E)$$
3. *인자 하나 떼어 내기:* $$E \to id, E$$를 써서 $$id(id, E)$$
4. *마지막 인자:* $$E \to id$$를 써서 $$id(id, id)$$

$$E \to id, E$$는 오른쪽 끝에 자기 자신이 다시 나온다. 이 규칙을 한 번 쓸 때마다 인자가 하나 늘어나므로 인자가 몇 개든 적을 수 있다.

**경계 사례.** while 문법에서 $$E \to \epsilon$$이 있어서 `while()`도 문법에 맞는다. 조건이 빈 while이 말이 되는지는 문법이 따지지 않는다. 슬라이드가 `while()`을 예에 넣었다[^10].

**재귀를 멈출 규칙이 없으면.** 위 표의 if 문 규칙 두 개는 둘 다 오른쪽에 $$STMT$$가 있다. 이 두 규칙만으로는 $$STMT$$를 아무리 바꿔 써도 $$STMT$$가 남아, 끝나는 문장이 하나도 나오지 않는다. 실제 문법에는 대입문처럼 $$STMT$$가 다시 나오지 않는 규칙이 더 있다. 슬라이드는 재귀 구조를 보이려고 두 규칙만 적었다[^s3].

## 활용

- **문법 쓰기의 흔한 실수.** 재귀를 멈출 규칙(위의 $$BALANCED \to \epsilon$$, $$E \to id$$)을 빠뜨린다. 반복되는 것은 "하나 그리고 나머지"로 쪼개 재귀 규칙으로 쓴다($$E \to id, E \mid id$$).
- **좋은 문법의 세 조건.** 규칙이 맞는 문자열을 다 만든다고 끝이 아니다. 파서가 효율적으로 읽으려면 한 문장이 두 가지로 읽히지 않아야 하고([모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/)), 왼쪽 끝에서 자기 자신을 부르는 규칙이 없어야 하고([좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/)), 다음 토큰 하나로 쓸 규칙이 정해져야 한다([좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/))[^12].
- **문법으로 판정하기.** 토큰열이 문법에 맞는지는 "시작 기호에서 그 토큰열을 만들 수 있는가"로 정한다. 이것을 손이 아니라 프로그램으로 하는 방법이 위에서 내려가는 [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)과 아래에서 올라가는 [이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/)이다[^13].
- 문법이 따지지 못하는 것도 있다. 선언하지 않은 변수를 쓰는지, 타입이 맞는지는 다음 단계인 [의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/)이 본다.

## 연결

- 선수: [토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/)(단말 기호가 곧 토큰 이름이다), [정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/)
- 컴파일러 전체에서의 자리: [컴파일러의 구조](/Hongs_Blog/studies/compilers/compiler-structure/)의 둘째 단계
- 문법으로 문자열을 만드는 과정과 그 나무: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)
- 같은 생각의 수학 쪽 모습: [재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/). 균형 괄호를 "기본 재료와 만드는 규칙"으로 정의한 것이 곧 생성 규칙이다.
- 상태가 유한한 기계의 한계: [유한 오토마타](/Hongs_Blog/studies/compilers/finite-automata/). 괄호 짝은 [스택](/Hongs_Blog/studies/algorithms/stack/)이 있어야 센다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"정규 표현식을 잘 짜면 괄호 짝도 맞출 수 있다"</div>

틀렸다. `(*)*`나 <code>(()&#124;(()))</code>처럼 써 보면 될 것 같아 보이는 까닭은, 괄호가 두세 겹인 경우만 떠올리기 때문이다. 겹 수를 정해 두면 정규 표현식으로 적을 수 있다. 하지만 겹 수에 한계가 없으면 여는 괄호의 개수를 끝없이 세어야 하고, 정규 표현식과 힘이 같은 유한 오토마타는 상태가 유한해서 그럴 수 없다. 슬라이드도 기본 정규 표현식 다섯 가지만으로 적을 수 있어야 정규 표현식이라 하고, $$(^n)^n$$은 거기에 들지 않는다고 적는다[^3]. 확인하는 법: 내가 쓴 정규 표현식에 여는 괄호가 닫는 괄호보다 많은 문자열을 넣어 본다. 통과하거나, 겹 수가 큰 올바른 문자열이 떨어진다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 문맥 자유 문법을 이루는 네 가지를 쓰고, 생성 규칙의 왼쪽에 올 수 있는 것이 무엇인지 쓰라.</summary>

**답:** 단말 기호(더 바꿀 수 없는 기본 기호, 보통 토큰 이름), 비단말 기호(바꿔 쓸 수 있는 변수), 시작 기호(비단말 기호 하나), 생성 규칙(바꿔 쓰는 규칙). 규칙의 왼쪽에는 비단말 기호 하나만 온다.<br>
**이유:** 왼쪽이 비단말 기호 하나뿐이라서 주변 기호와 상관없이 규칙을 쓸 수 있고, 여기서 '문맥 자유'라는 이름이 나온다. 흔한 오답은 시작 기호를 빠뜨리는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 토큰은 정규 표현식으로 적으면서 문장 구조는 왜 정규 표현식으로 적지 않는가?</summary>

**답:** 프로그램에는 괄호 짝, if 안의 if처럼 같은 구조가 안에 또 들어가는 재귀 구조가 많다. 정규 표현식은 여는 괄호 $$n$$개 뒤에 닫는 괄호가 정확히 $$n$$개 오는 것조차 적지 못한다. 문맥 자유 문법은 규칙 오른쪽에 자기 자신을 다시 쓸 수 있어서 이런 구조를 적는다.<br>
**이유:** 정규 표현식과 힘이 같은 유한 오토마타는 상태가 유한해서 개수를 끝없이 셀 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 단말 기호가 `[`, `]`, `,`, `id`일 때 `[ ]`, `[ id ]`, `[ id , id ]`, `[ id , id , id ]`, …를 만드는 문법을 쓰라.</summary>

**답:** $$L \to [\ ] \mid [\ I\ ]$$, $$\ I \to id\ ,\ I \mid id$$.<br>
**이유:** 슬라이드의 함수 호출 문법과 같은 짜임이다. 빈 목록은 따로 규칙을 두고, 원소 나열은 "원소 하나, 쉼표, 나머지"로 쪼갠다. $$I \to id\ ,\ I \mid \epsilon$$으로 쓰면 `[ id , ]`처럼 쉼표로 끝나는 목록이 나와서 틀린다[^s4].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 규칙이 $$STMT \to if\,(EXPR)\ STMT\ else\ STMT \mid if\,(EXPR)\ STMT$$ 둘뿐이면 이 문법이 만드는 문장은 몇 개인가? 왜 그런가?</summary>

**답:** 하나도 없다. 두 규칙 모두 오른쪽에 $$STMT$$가 있어서, 어느 규칙을 써도 $$STMT$$가 다시 생긴다. 비단말 기호가 다 사라진 문자열에 이를 수 없다.<br>
**이유:** 재귀 규칙에는 재귀를 멈출 규칙이 함께 있어야 한다. $$STMT \to other$$ 하나만 더해도 문장이 끝없이 많이 나온다[^s3].

</details>


[^1]: 컴파일러 4회 강의 자료 「Lecture04 Syntax analysis part 1」, p.4~5 (문장 구조가 올바른가, 올바른 토큰 순서와 틀린 순서)
[^2]: 같은 자료, p.5~7 (구문 분석기가 하는 두 가지 일)
[^3]: 같은 자료, p.8~9 (기본 정규 표현식 다섯 가지, $$(^n)^n$$은 정규 표현식이 아니다)
[^4]: 같은 자료, p.13 (표기 약속, BALANCED 규칙)
[^5]: 같은 자료, p.11 (CFG의 네 구성 요소)
[^6]: 같은 자료, p.12 (규칙의 꼴, 가장 작은 예)
[^7]: 같은 자료, p.10 (형식 언어의 범위 그림)
[^8]: 같은 자료, p.15
[^9]: 같은 자료, p.16
[^10]: 같은 자료, p.17
[^11]: 같은 자료, p.14 (재귀 구조를 잘 적는다)
[^12]: 같은 자료, p.34, p.46
[^13]: 같은 자료, p.21~22, p.62
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 개짜리 묶음으로 쓴 기호 정의, '문맥 자유'라는 이름의 뜻, CFG 규칙이 아닌 예 둘은 원본에 없다. 형식 언어 교재의 표준 정의다(Aho·Lam·Sethi·Ullman, *Compilers: Principles, Techniques, and Tools* 2판, 4.2절).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드는 $$(^n)^n$$이 정규 표현식이 아니라는 결론만 적는다. 상태 수로 따지는 설명과 접어 둔 증명, 스스로 설명해 보기는 보탠 것이다. 표준 논법이고(Hopcroft·Motwani·Ullman, *Introduction to Automata Theory, Languages, and Computation* 3판, 4.1절), 상태 3개 이하 DFA를 모두 시험해 그런 기계가 없음을 검증 코드로 확인했다. 전수 시험은 작은 크기에서의 확인이고, 모든 크기에 대한 근거는 증명이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 두 규칙만으로는 문장이 나오지 않는다는 점과 카드 C4는 원본에 없다. 검증 코드에서 두 규칙만 둔 문법의 언어가 비어 있고, $$STMT \to other$$를 더하면 겹친 if 문이 나오는 것을 확인했다.
[^s4]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 카드 C3의 문법은 원본에 없다. 슬라이드 p.16의 함수 호출 문법을 본떠 만들었고, 길이 7 이하에서 네 문자열만 만드는 것을 검증 코드로 확인했다.
{% endraw %}
