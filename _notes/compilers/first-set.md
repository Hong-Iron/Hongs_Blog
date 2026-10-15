---
layout: "note"
title: "FIRST 집합"
display_title: "FIRST 집합 (First Set)"
kind: "concept"
kind_label: "알고리즘"
num: "18"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["First Set", "FIRST", "First 집합", "퍼스트 집합", "시작 기호 집합", "Nullable", "널 가능"]
description: "문법의 어떤 이름을 끝까지 풀어 썼을 때 맨 앞에 올 수 있는 낱말을 모두 모은 것이다. 식당 메뉴판에서 \"세트 A를 시키면 처음 나오는 음식은 무엇일 수 있나\"를 미리 적어 둔 표와 같다. 이 표가 있으면 읽는 프로그램은 다음 낱말 하나만 보고 어느 규칙으로 갈지 바로 고른다. …"
prev_url: "/studies/compilers/recursive-descent-parsing/"
prev_title: "재귀 하강 파싱"
next_url: "/studies/compilers/follow-set/"
next_title: "FOLLOW 집합"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/first-set/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

문법의 어떤 이름을 끝까지 풀어 썼을 때 맨 앞에 올 수 있는 낱말을 모두 모은 것이다. 식당 메뉴판에서 "세트 A를 시키면 처음 나오는 음식은 무엇일 수 있나"를 미리 적어 둔 표와 같다. 이 표가 있으면 읽는 프로그램은 다음 낱말 하나만 보고 어느 규칙으로 갈지 바로 고른다. 주의할 곳은 아무것도 내놓지 않고 사라질 수 있는 이름이다. 그런 이름이 앞에 있으면 그 뒤 것의 첫 낱말까지 함께 모아야 한다.

</div>


## 예시로 보기

[재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)은 규칙을 찍어서 시험하고 틀리면 되돌아간다. 되돌아가지 않으려면 규칙을 펼치기 전에 "이 규칙을 쓰면 맨 앞에 무슨 토큰이 나오는가"를 알아야 한다. 다음 입력 토큰이 그 가운데 있으면 그 규칙을 고르고, 없으면 고르지 않는다.

문법 $$S \to aA \mid b \mid A$$, $$\ A \to (S)$$를 보자. $$S$$를 펼칠 차례에 다음 입력이 `(`라면 어느 규칙인가? $$aA$$는 $$a$$로, $$b$$는 $$b$$로 시작하니 아니다. 셋째 규칙 $$A$$는 단말 기호가 아니라서 바로는 모른다. $$A$$를 한 번 더 풀어 $$A \to (S)$$를 봐야 `(`로 시작한다는 것을 안다. 이렇게 "끝까지 풀었을 때 맨 앞에 올 수 있는 단말 기호"를 비단말 기호마다 미리 모아 둔 것이 FIRST 집합이다. 여기서는 $$First(A) = \{(\}$$이고 $$First(S) = \{a, b, (\}$$다.

빈 문자열이 끼면 한 가지를 더 챙겨야 한다. 문법 $$S \to ABc$$, $$\ A \to a \mid \epsilon$$, $$\ B \to b \mid \epsilon$$에서 $$S$$가 만드는 문자열은 $$abc$$, $$ac$$, $$bc$$, $$c$$ 넷이다. 맨 앞 글자는 $$a$$, $$b$$, $$c$$가 다 될 수 있다. $$A$$가 사라지면 $$B$$의 첫 글자가 앞으로 나오고, $$B$$까지 사라지면 $$c$$가 앞으로 나오기 때문이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 산술식 예의 다섯 집합과 규칙 오른쪽의 FIRST, 위 두 문법의 값, 무작위 문법 300개에서 되풀이로 구한 값이 "만들 수 있는 문자열을 다 만들어 첫 글자를 모은 값"과 같은 것 — [18_first-set_impl.py](/Hongs_Blog/studies/compilers/code/18_first-set_impl/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

비단말 기호 $$A$$의 FIRST 집합은 $$A$$에서 유도되는 문자열의 맨 앞에 올 수 있는 단말 기호를 모두 모은 집합이다. $$A$$가 빈 문자열을 유도할 수 있으면 $$\epsilon$$도 넣는다.

$$First(A) = \{\,x \mid A \Rightarrow^* x\alpha\,\}, \qquad \epsilon \in First(A)\ \text{ if }\ A \Rightarrow^* \epsilon$$

</div>


$$x$$는 단말 기호이고, $$\alpha$$는 단말·비단말 기호를 늘어놓은 것이다. $$A \Rightarrow^* x\alpha$$는 "$$A$$에서 0걸음 이상 유도해 $$x$$로 시작하는 모양에 이른다"로 읽는다.

단말 기호와 기호열에도 FIRST를 정한다.

- 단말 기호 $$x$$: $$First(x) = \{x\}$$. 자기 자신으로 시작한다.
- 기호열 $$\alpha = Y_1 Y_2 \dots Y_n$$: 왼쪽 기호부터 차례로 본다.
    1. $$First(Y_1)$$에서 $$\epsilon$$을 뺀 것을 넣는다.
    2. $$Y_1$$이 사라질 수 있으면($$\epsilon \in First(Y_1)$$) $$First(Y_2)$$에서 $$\epsilon$$을 뺀 것도 넣는다. $$Y_2$$도 사라질 수 있으면 $$Y_3$$로 간다. 사라질 수 없는 기호를 만나면 거기서 멈춘다.
    3. $$Y_1$$부터 $$Y_n$$까지 모두 사라질 수 있을 때만 $$\epsilon$$을 넣는다.
- 빈 기호열: $$First(\epsilon) = \{\epsilon\}$$.

기호로 쓰면, $$k$$를 "$$Y_1, \dots, Y_{k-1}$$은 모두 $$\epsilon$$을 가지고 $$Y_k$$는 갖지 않는" 첫 자리라 할 때 다음과 같다. 그런 자리가 없으면 $$k = n$$으로 두고 $$\epsilon$$을 더한다.

$$First(Y_1 \dots Y_n) = \bigcup_{i=1}^{k} \bigl(First(Y_i) \setminus \{\epsilon\}\bigr)\ \cup\ \bigl(\{\epsilon\}\ \text{if 모든 } Y_i \text{가 } \epsilon \text{을 가질 때}\bigr)$$


$$\bigcup$$은 여러 집합을 다 합친다는 뜻이고, $$\setminus$$는 "왼쪽 집합에서 오른쪽 원소를 뺀다"는 뜻이다. 단말 기호는 $$\epsilon$$을 갖지 않으므로 단말 기호를 만나면 늘 거기서 멈춘다.


**비단말 기호의 FIRST 구하기.** $$A$$의 규칙이 $$A \to \alpha_1 \mid \dots \mid \alpha_m$$이면 각 규칙 오른쪽의 FIRST를 다 합친다.

$$First(A) = First(\alpha_1) \cup \dots \cup First(\alpha_m)$$


### 예: 산술식 문법

문법은 [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)를 마친 산술식 문법이다.

$$E \to TE' \qquad E' \to +E \mid \epsilon \qquad T \to FT' \qquad T' \to *T \mid \epsilon \qquad F \to (E) \mid id$$


다른 비단말 기호에 기대지 않는 것부터 구하면 한 번에 끝난다.

| 순서 | 계산 | 결과 |
|---|---|---|
| 1 | $$First(F) = First((E)) \cup First(id) = First(() \cup First(id)$$ | $$\{(,\ id\}$$ |
| 2 | $$First(T') = First(*T) \cup First(\epsilon) = First(*) \cup First(\epsilon)$$ | $$\{*,\ \epsilon\}$$ |
| 3 | $$First(T) = First(FT') = First(F)$$ | $$\{(,\ id\}$$ |
| 4 | $$First(E') = First(+E) \cup First(\epsilon) = First(+) \cup First(\epsilon)$$ | $$\{+,\ \epsilon\}$$ |
| 5 | $$First(E) = First(TE') = First(T)$$ | $$\{(,\ id\}$$ |

셋째 줄에서 $$First(FT')$$가 $$First(F)$$에서 멈추는 까닭은 $$F$$가 사라질 수 없기 때문이다($$\epsilon \notin First(F)$$). $$T'$$가 $$\epsilon$$을 가져도 $$F$$ 뒤에 있으니 상관없다.

### 알고리즘

손으로 할 때는 위처럼 쉬운 것부터 구한다. 규칙들이 서로 물려 있어 쉬운 순서가 없을 때도 통하는 방법은 "바뀌는 것이 없을 때까지 되풀이"다[^s2].

```
입력: 문법 G
모든 비단말 기호 A에 대해 First(A) ← 빈 집합
되풀이:
    모든 규칙 A → α 에 대해
        First(A) ← First(A) ∪ First(α)      (First(α)는 지금까지 구한 값으로 계산)
어느 집합도 커지지 않았으면 멈춘다
출력: 모든 A의 First(A)
```

규칙을 $$E, E', T, T', F$$ 순서로 돌 때의 추적이다.

| 바퀴 | $$First(E)$$ | $$First(E')$$ | $$First(T)$$ | $$First(T')$$ | $$First(F)$$ |
|---|---|---|---|---|---|
| 1 | $$\{\}$$ | $$\{+, \epsilon\}$$ | $$\{\}$$ | $$\{*, \epsilon\}$$ | $$\{(, id\}$$ |
| 2 | $$\{\}$$ | $$\{+, \epsilon\}$$ | $$\{(, id\}$$ | $$\{*, \epsilon\}$$ | $$\{(, id\}$$ |
| 3 | $$\{(, id\}$$ | $$\{+, \epsilon\}$$ | $$\{(, id\}$$ | $$\{*, \epsilon\}$$ | $$\{(, id\}$$ |
| 4 | 그대로 | 그대로 | 그대로 | 그대로 | 그대로 → 멈춤 |

$$F$$의 값이 한 바퀴에 한 단계씩 $$T$$, $$E$$로 올라간다. 넷째 바퀴에서 바뀐 것이 없어 멈춘다.

**정확성.** 되풀이는 반드시 멈추고, 멈췄을 때의 값이 정의의 FIRST와 같다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치 펼치기</summary>

1. **멈춘다.** 각 집합은 커지기만 한다. 넣을 수 있는 원소는 단말 기호와 $$\epsilon$$뿐이라 유한하다. 한 바퀴에 적어도 하나가 커지지 않으면 멈추므로, 바퀴 수는 많아야 (비단말 기호 수) × (단말 기호 수 + 1) + 1이다. — 단조 증가와 유한성
2. **넣은 것은 모두 옳다.** 바퀴 수에 대한 귀납법으로 보인다. 처음에는 빈 집합이라 틀린 원소가 없다. 어떤 바퀴에서 규칙 $$A \to Y_1 \dots Y_n$$을 보고 $$x$$를 넣었다면, 어떤 $$i$$에 대해 $$x \in First(Y_i)$$이고 $$Y_1, \dots, Y_{i-1}$$이 모두 $$\epsilon$$을 가진다. 귀납 가정으로 이 값들은 옳으므로 $$Y_1 \dots Y_{i-1} \Rightarrow^* \epsilon$$이고 $$Y_i \Rightarrow^* x\gamma$$다. 이어 붙이면 $$A \Rightarrow Y_1 \dots Y_n \Rightarrow^* x\gamma Y_{i+1} \dots Y_n$$이다. $$\epsilon$$을 넣은 경우도 같다. — 귀납법
3. **빠진 것이 없다.** $$A \Rightarrow^* x\alpha$$인 유도의 걸음 수에 대한 귀납법으로 보인다. 첫 걸음에 쓴 규칙이 $$A \to Y_1 \dots Y_n$$이면, $$x$$는 어떤 $$Y_i$$에서 나왔고 그 앞의 $$Y_1, \dots, Y_{i-1}$$은 모두 빈 문자열이 되었다. 이 유도들은 걸음 수가 더 적으므로 귀납 가정에 따라 멈춘 뒤의 집합에 $$x \in First(Y_i)$$와 $$\epsilon \in First(Y_1), \dots, First(Y_{i-1})$$이 들어 있다. 멈췄다는 것은 규칙 $$A \to Y_1 \dots Y_n$$을 다시 봐도 더 넣을 것이 없다는 뜻이므로 $$x$$는 이미 $$First(A)$$에 있다. — 강한 귀납법 ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "집합이 커지기만 한다"는 것은 의사코드의 어느 줄에서 나오는가?</summary>

`First(A) ← First(A) ∪ First(α)` 줄이다. 합집합만 하고 빼는 일이 없다. 또 $$First(\alpha)$$는 다른 집합들이 커지면 같이 커지거나 그대로이므로, 나중 바퀴에서 넣는 것이 줄어들지도 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 2단계에서 $$Y_1, \dots, Y_{i-1}$$이 모두 $$\epsilon$$을 가져야 한다는 조건은 왜 필요한가?</summary>

그래야 $$Y_i$$가 맨 앞으로 나올 수 있다. 앞의 기호 하나라도 사라질 수 없으면 그 기호가 내놓는 글자가 늘 $$Y_i$$의 것보다 앞에 온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 3단계에서 "멈췄다"는 사실을 어디에 쓰는가?</summary>

멈춘 뒤에는 어느 규칙을 다시 봐도 집합이 커지지 않는다. 그래서 $$First(Y_i)$$에 $$x$$가 있고 앞 기호들이 $$\epsilon$$을 가지면, 규칙 $$A \to Y_1 \dots Y_n$$이 $$x$$를 $$First(A)$$에 이미 넣었어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 계산의 핵심 아이디어는?</summary>

서로 물려 있는 정의를 "빈 집합에서 시작해 규칙이 시키는 만큼만 넣기를 되풀이"로 푼다. 집합이 커지기만 하고 끝이 있으니 반드시 멈추고, 멈춘 곳이 답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

[FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/)도 같은 꼴로 구한다. 뒤에 나오는 [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/) 같은 데이터 흐름 분석, [부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/)의 ε-닫힘도 "더 늘지 않을 때까지 넣는다"는 같은 틀이다.

</details>


### 복잡도

한 바퀴는 규칙 오른쪽의 기호를 한 번씩 보므로 문법 크기(규칙 오른쪽 길이의 합)에 비례하는 횟수만큼 집합을 합친다. 바퀴 수는 위 1단계의 한도를 넘지 않는다. 실제 문법에서는 몇 바퀴면 끝난다. 위 예는 네 바퀴였다[^s2].

## 활용

- **LL(1) 파싱 표.** 규칙 $$A \to \alpha$$는 표의 $$A$$ 줄에서 $$First(\alpha)$$에 든 단말 기호의 칸에 적는다. 산술식 문법에서는 다섯 규칙의 FIRST가 $$First(TE') = \{(, id\}$$, $$First(+E) = \{+\}$$, $$First(FT') = \{(, id\}$$, $$First(*T) = \{*\}$$, $$First((E)) = \{(\}$$이고, 이것으로 여덟 칸을 채운다. 자세한 것은 [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)에 있다.
- **ε이 들어 있으면.** $$First(\alpha)$$에 $$\epsilon$$이 있으면 그 규칙은 FIRST만으로는 자리를 정할 수 없다. "$$A$$ 뒤에 무엇이 오는가"를 봐야 하고, 그것이 [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/)이다.
- **흔한 실수.** $$First(AB)$$를 $$First(A)$$로만 적는다($$A$$가 사라질 수 있는지 안 본다). 합칠 때 $$\epsilon$$을 빼지 않는다. 거꾸로 모든 기호가 사라질 수 있는데 $$\epsilon$$을 넣지 않는다. $$\epsilon$$을 단말 기호처럼 여겨 파싱 표의 열로 만든다.
- 연습: [FIRST·FOLLOW 예제 사다리](/Hongs_Blog/studies/compilers/first-follow-ladder/)

## 연결

- 선수: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)($$\Rightarrow^*$$), [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)(예로 쓰는 문법)
- 짝이 되는 집합: [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/). FOLLOW를 구할 때 FIRST를 쓴다.
- 쓰이는 곳: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/). 상향식 쪽에서는 FOLLOW를 거쳐 [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)에 쓰인다.
- 합집합, 차집합 기호: [집합](/Hongs_Blog/studies/discrete-math/sets/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"First(AB)는 A의 첫 글자들이니 First(A)와 같다"</div>

틀렸다. $$A$$가 빈 문자열이 될 수 있으면 $$B$$의 첫 글자가 맨 앞으로 나온다. 그럴듯해 보이는 까닭은 위 산술식 예의 $$First(FT') = First(F)$$, $$First(TE') = First(T)$$가 다 그렇게 끝나기 때문이다. 이 예들에서는 앞 기호 $$F$$, $$T$$가 사라질 수 없어서 그랬을 뿐이다. $$S \to AB$$, $$A \to a \mid \epsilon$$, $$B \to b \mid \epsilon$$에서 $$First(A) = \{a, \epsilon\}$$이지만 $$First(AB) = \{a, b, \epsilon\}$$이다. $$S$$가 만드는 문자열 $$ab$$, $$a$$, $$b$$, 빈 문자열을 늘어놓고 맨 앞 글자를 모아 보면 확인된다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$First(A)$$의 정의를 쓰고, 기호열 $$Y_1 Y_2 \dots Y_n$$의 FIRST에 $$\epsilon$$이 들어가는 조건을 쓰라.</summary>

**답:** $$First(A)$$는 $$A$$에서 유도되는 문자열의 맨 앞에 올 수 있는 단말 기호의 집합이고, $$A \Rightarrow^* \epsilon$$이면 $$\epsilon$$도 넣는다. 기호열의 FIRST에 $$\epsilon$$이 들어가는 것은 $$Y_1$$부터 $$Y_n$$까지 모두가 $$\epsilon$$을 가질 때뿐이다.<br>
**이유:** 하나라도 사라질 수 없으면 기호열 전체가 빈 문자열이 될 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$S \to Ab \mid c$$, $$\ A \to aA \mid \epsilon$$의 $$First(A)$$와 $$First(S)$$를 구하라.</summary>

**답:** $$First(A) = \{a, \epsilon\}$$, $$First(S) = \{a, b, c\}$$.<br>
**이유:** $$First(Ab)$$는 $$First(A)$$에서 $$\epsilon$$을 뺀 $$\{a\}$$에, $$A$$가 사라질 수 있으니 $$First(b) = \{b\}$$를 더한 $$\{a, b\}$$다. $$b$$는 사라질 수 없어 $$\epsilon$$은 넣지 않는다. 여기에 $$First(c) = \{c\}$$를 합친다. 흔한 오답은 $$First(S)$$에 $$\epsilon$$을 넣거나 $$b$$를 빠뜨리는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 "어느 집합도 커지지 않았으면 멈춘다"가 왜 필요한지 한 문장으로 쓰라.</summary>

**답:** 어떤 비단말 기호의 FIRST가 커지면 그 기호를 오른쪽에 쓰는 다른 규칙의 FIRST도 커질 수 있으므로, 한 바퀴를 다 돌아도 아무것도 늘지 않을 때에야 모든 규칙이 다 반영된 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "기호열의 FIRST는 각 기호의 FIRST를 그대로 다 합친 것"이라는 규칙이 틀리는 문법과 기호열을 하나 들어라.</summary>

**답:** $$A \to a \mid \epsilon$$일 때 기호열 $$Ac$$. 그대로 합치면 $$\{a, \epsilon, c\}$$가 되지만 $$Ac$$가 만드는 문자열은 $$ac$$와 $$c$$뿐이라 빈 문자열이 없다. 옳은 값은 $$\{a, c\}$$다.<br>
**이유:** 앞 기호의 $$\epsilon$$은 "다음 기호로 넘어가라"는 표시일 뿐이고, 기호열 전체가 사라질 수 있다는 뜻이 아니다.

</details>


[^s1]: 구현 코드로 값을 확인했다.
[^s2]: 되풀이 알고리즘, 바퀴별 추적 표, 정확성 증명 스케치, 스스로 설명해 보기, 복잡도는 보탠 것이다(Aho 외, *Compilers* 2판 4.4.2절의 계산 규칙). 추적 표는 구현 코드로 확인했고, 무작위 문법 300개에서 정의대로 구한 값과 같았다. 이 비교는 실험이고, 모든 문법에 대한 근거는 증명 스케치다.
{% endraw %}
