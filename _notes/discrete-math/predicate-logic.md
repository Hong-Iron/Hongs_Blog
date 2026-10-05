---
layout: "note"
title: "술어와 한정기호"
display_title: "술어와 한정기호 (Predicates and Quantifiers)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Predicate Logic", "Quantifiers", "술어", "predicate", "전칭 한정기호", "universal quantifier", "존재 한정기호", "existential quantifier", "∀", "∃", "정의역", "domain of discourse", "중첩 한정기호", "nested quantifiers", "1차 논리", "first-order logic"]
description: "\"x는 짝수다\"처럼 변수가 들어가 값에 따라 참·거짓이 바뀌는 문장을 술어라 하고, \"모든 x에 대해\"(∀)와 \"어떤 x가 있어\"(∃)로 변수를 묶어 명제로 만든다. 알고리즘의 명세, 데이터베이스 질의, 수학의 정의가 모두 이 말로 쓰인다. 부정할 때는 \"모든\"과 \"어떤\"이 서로 …"
prev_url: "/studies/discrete-math/logical-equivalence/"
prev_title: "논리적 동치와 정규형"
next_url: "/studies/discrete-math/proof-methods/"
next_title: "추론 규칙과 증명 방법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/predicate-logic/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"x는 짝수다"처럼 변수가 들어가 값에 따라 참·거짓이 바뀌는 문장을 술어라 하고, "모든 x에 대해"(∀)와 "어떤 x가 있어"(∃)로 변수를 묶어 명제로 만든다. 알고리즘의 명세, 데이터베이스 질의, 수학의 정의가 모두 이 말로 쓰인다. 부정할 때는 "모든"과 "어떤"이 서로 바뀌고, 둘의 순서를 바꾸면 뜻이 완전히 달라진다. 변수가 움직이는 범위를 정하지 않으면 참·거짓도 정해지지 않는다.

</div>


## 예시로 보기

사람 세 명 가, 나, 다가 있고 "가는 나를, 나는 다를, 다는 가를 좋아한다"고 하자. $$L(x, y)$$ = "$$x$$는 $$y$$를 좋아한다"로 두면 두 문장이 갈린다.

| 문장 | 식 | 이 예에서 |
|---|---|---|
| 모든 사람에게 좋아하는 사람이 있다 | $$\forall x\, \exists y\, L(x, y)$$ | 참. 가→나, 나→다, 다→가 |
| 모두가 좋아하는 한 사람이 있다 | $$\exists y\, \forall x\, L(x, y)$$ | 거짓. 셋 모두에게 사랑받는 사람이 없다 |

첫째는 $$x$$마다 **다른** $$y$$를 골라도 되고, 둘째는 **하나의** $$y$$가 모든 $$x$$에 통해야 한다. 한정기호의 순서가 "누가 먼저 고르는가"를 정한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

정의역(domain) $$D$$의 원소를 넣으면 명제가 되는 문장 $$P(x)$$를 **술어**라 한다[^1].
- $$\forall x\, P(x)$$: $$D$$의 **모든** $$x$$에서 $$P(x)$$가 참이다. 반례 하나로 거짓이 된다.
- $$\exists x\, P(x)$$: $$P(x)$$가 참인 $$x$$가 $$D$$에 **적어도 하나** 있다. 예 하나로 참이 된다.
- $$\exists!\, x\, P(x)$$: 그런 $$x$$가 정확히 하나 있다.

한정기호에 묶인 변수를 속박 변수, 묶이지 않은 변수를 자유 변수라 한다. 자유 변수가 남아 있으면 명제가 아니다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">부정 규칙</div>

$$\neg\forall x\, P(x) \equiv \exists x\, \neg P(x), \qquad \neg\exists x\, P(x) \equiv \forall x\, \neg P(x)$$

중첩된 식은 바깥부터 한 겹씩 적용한다. 예: $$\neg\forall x\,\exists y\, P(x, y) \equiv \exists x\,\forall y\,\neg P(x, y)$$.

</div>


**설계 이유.** 명제 논리로는 "모든 정수"처럼 끝없이 많은 경우를 한 문장으로 말할 수 없다. 한정기호가 그 일을 한다. 정의역을 반드시 함께 말해야 하는 이유는 같은 식의 참·거짓이 정의역에 따라 바뀌기 때문이다. $$\forall x\,(x^2 \ge x)$$는 정수에서 참이지만 실수에서는 $$x = 0.5$$가 반례다.

**동치인 다른 정의.** 정의역이 유한하면 $$D = \{d_1, \dots, d_n\}$$에서 $$\forall x\, P(x) \equiv P(d_1) \wedge \cdots \wedge P(d_n)$$이고 $$\exists x\, P(x) \equiv P(d_1) \vee \cdots \vee P(d_n)$$이다. 부정 규칙은 여기서 드모르간 법칙을 쓴 것과 같다. 파이썬의 `all()`, `any()`가 바로 이 정의다.

**해당하는 예:** $$\forall n \in \mathbb{Z}\ (n^2 \ge 0)$$(참), $$\exists n \in \mathbb{Z}\ (n^2 = 4)$$(참), $$\forall x \in \mathbb{R}\ \exists y \in \mathbb{R}\ (y > x)$$(참). **해당하지 않는 예:** "$$x > 3$$"(자유 변수가 남아 명제가 아님), "이 문장은 거짓이다"(참·거짓이 정해지지 않음).

## 증명

유한 정의역에서 부정 규칙은 드모르간 법칙의 반복이다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. $$\neg\forall x\, P(x) \equiv \neg(P(d_1) \wedge \cdots \wedge P(d_n))$$ — 유한 정의역에서 $$\forall$$의 뜻
2. $$\equiv \neg P(d_1) \vee \cdots \vee \neg P(d_n)$$ — [드모르간 법칙](/Hongs_Blog/studies/discrete-math/logical-equivalence/)을 $$n - 1$$번
3. $$\equiv \exists x\, \neg P(x)$$ — $$\exists$$의 뜻

무한 정의역에서는 뜻 그대로 따진다. "모든 $$x$$에서 참"이 아니라는 것은 "참이 아닌 $$x$$가 있다"는 것이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 함수 f가 0에서 연속이라는 명제 ∀ε>0 ∃δ>0 ∀x (\|x\| < δ → \|f(x) − f(0)\| < ε)를 부정하라. 각 단계에 쓴 규칙은?</summary>

바깥부터 $$\forall \to \exists$$, $$\exists \to \forall$$, $$\forall \to \exists$$로 바꾸고, 마지막 조건문은 $$\neg(p \to q) \equiv p \wedge \neg q$$를 쓴다. 결과: $$\exists\varepsilon > 0\ \forall\delta > 0\ \exists x\ (\vert x\vert  < \delta \wedge \vert f(x) - f(0)\vert  \ge \varepsilon)$$. 조건 "$$\varepsilon > 0$$"은 한정기호의 범위라 부정하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. ∃y∀x L(x,y)가 참이면 ∀x∃y L(x,y)도 참인 이유는? 거꾸로는 왜 안 되나?</summary>

모두에게 통하는 $$y_0$$이 있으면, 각 $$x$$에게 그 $$y_0$$을 골라 주면 된다. 거꾸로는 $$x$$마다 고른 $$y$$가 서로 달라서 하나로 모을 수 없을 수 있다(예시의 세 사람).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

한정기호는 "누가 먼저 고르는가"의 게임이다. $$\forall$$은 상대가 고르고 $$\exists$$는 내가 고른다. 순서가 바뀌면 정보가 달라져 뜻이 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

미분적분학의 [극한 정의](/Hongs_Blog/studies/calculus/limits/), 이산수학의 [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/) $$\exists c\,\exists n_0\,\forall n \ge n_0$$, 데이터베이스의 "모든 과목을 들은 학생" 질의가 모두 한정기호의 순서로 뜻이 정해진다.

</details>


## 예제

**명세를 식으로 쓰고 부정하기.** 배열 `a`(길이 $$n$$)가 오름차순으로 정렬되어 있다.

1. *술어 정하기:* 인덱스 $$i$$에서 "$$a[i] \le a[i+1]$$".
2. *한정하기:* $$\forall i \in \{0, \dots, n - 2\}\ (a[i] \le a[i+1])$$.
3. *부정하기:* $$\exists i \in \{0, \dots, n - 2\}\ (a[i] > a[i+1])$$. 정렬이 안 되었다는 것은 "거꾸로 된 이웃이 하나라도 있다"는 것이다.
4. *코드로:* `all(a[i] <= a[i+1] for i in range(n-1))`와 그 부정 `any(a[i] > a[i+1] for i in range(n-1))`.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 부정 규칙(무작위 유한 술어 3,000개), 좋아함 표에서 두 순서, 무작위 관계 3,000개에서 $$\exists\forall \Rightarrow \forall\exists$$, 정의역에 따른 참·거짓, 정렬 명세와 부정 — [03_predicate-logic_verify.py](/Hongs_Blog/studies/discrete-math/code/03_predicate-logic_verify/)</div>

</div>


## 활용

- **명세와 테스트.** 함수의 약속을 $$\forall$$로 쓰면 테스트의 목표가 분명해진다. 속성 기반 테스트(property-based testing)는 무작위 입력으로 $$\forall$$을 공격해 반례($$\exists\neg$$)를 찾는다. 반례 하나면 버그가 증명되지만, 통과는 증명이 아니다.
- **데이터베이스.** SQL의 `EXISTS`는 $$\exists$$다. "모든 과목을 수강한 학생"처럼 $$\forall$$이 필요한 질의는 SQL에 직접 기호가 없어서 "수강하지 않은 과목이 존재하지 않는다"($$\neg\exists\neg$$)로 바꿔 쓴다.
- **형식 검증.** 프로그램 검증 도구와 정리 증명기는 1차 논리 식을 입력으로 받는다.
- 알고리즘에서: 빠른 풀이를 작은 입력마다 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)의 답과 맞춰 보는 검증도 "모든 입력에서 두 답이 같다"는 $$\forall$$ 명제의 반례를 찾는 일이다.

## 연결

- 선수: [명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/)
- 이어지는 개념: [추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/)(모든 ~을 증명하기, 반례로 부정하기), [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"'모든 x가 P는 아니다'는 '모든 x가 P가 아니다'와 같다"</div>

틀렸다. 한국어 문장에서 "아니다"의 위치가 흐릿해서 두 뜻이 섞인다. $$\neg\forall x\, P(x)$$는 "P가 아닌 것이 **적어도 하나** 있다"이고, $$\forall x\, \neg P(x)$$는 "**하나도** P가 아니다"로 훨씬 강한 말이다. "모든 테스트가 통과한 것은 아니다"는 실패한 테스트가 하나 이상 있다는 뜻이지, 전부 실패했다는 뜻이 아니다. 정의역 $$\{0, 1\}$$에서 $$P(0)$$ = T, $$P(1)$$ = F이면 첫째는 참, 둘째는 거짓이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** ¬∀x P(x)와 ¬∃x P(x)를 각각 한정기호가 바깥에 오는 꼴로 바꿔 쓰라.</summary>

**답:** $$\exists x\,\neg P(x)$$, $$\ \forall x\,\neg P(x)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 정의역이 세 사람일 때 "∀x∃y L(x,y)는 참이지만 ∃y∀x L(x,y)는 거짓"인 좋아함 관계를 하나 만들고, 두 문장의 뜻 차이를 쓰라.</summary>

**답:** 가→나, 나→다, 다→가. 첫째는 "누구에게나 좋아하는 사람이 있다"(사람마다 달라도 됨), 둘째는 "모두가 좋아하는 한 사람이 있다"(한 사람으로 통일). 이 관계에서는 모두에게 사랑받는 사람이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "배열 a가 오름차순이다"를 한정기호로 쓰고, 부정을 한정기호가 바깥에 오는 꼴로 쓰라.</summary>

**답:** $$\forall i\,(0 \le i < n - 1 \to a[i] \le a[i+1])$$. 부정은 $$\exists i\,(0 \le i < n - 1 \wedge a[i] > a[i+1])$$.

**흔한 오답:** 부정에서 "$$\to$$"를 그대로 두는 것. $$\neg(p \to q) \equiv p \wedge \neg q$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "모든 요청에는 그 요청보다 늦게 도착한 응답이 있다"를 술어로 쓰라. 요청 집합 R, 응답 집합 S, t(·)는 도착 시각이다.</summary>

**답:** $$\forall r \in R\ \exists s \in S\ (t(s) > t(r))$$. 순서를 바꾼 $$\exists s \in S\ \forall r \in R\ (t(s) > t(r))$$은 "모든 요청보다 늦은 응답이 하나 있다"로 다른 뜻이다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 3장 "Logical Formulas"(술어 식). Rosen, *Discrete Mathematics and Its Applications* 7판, 1장(술어와 한정기호, 중첩 한정기호).
{% endraw %}
