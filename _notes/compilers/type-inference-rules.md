---
layout: "note"
title: "타입 추론 규칙"
display_title: "타입 추론 규칙 (Rules of Inference for Types)"
kind: "concept"
kind_label: "정의"
num: "35"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Rules of Inference for Types", "Type Inference Rules", "Typing Rules", "Typing Judgment", "타입 규칙", "타입 판단", "자유 변수", "Free Variable", "공리", "Axiom"]
description: "\"양쪽이 다 정수면 더한 것도 정수다\"처럼, 작은 조각이 어떤 종류의 값인지(타입) 알면 그 조각들로 만든 식의 타입도 알 수 있다는 약속을 하나씩 적어 둔 것이다. 가로선을 긋고 위에 \"이것들을 알면\", 아래에 \"이것을 안다\"를 쓴다. 컴파일러는 이 약속을 식의 맨 안쪽부터 바깥…"
prev_url: "/studies/compilers/static-vs-dynamic-typing/"
prev_title: "정적 타입과 동적 타입 비교"
next_url: "/studies/compilers/type-checking-procedure/"
next_title: "타입 검사 절차"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/type-inference-rules/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"양쪽이 다 정수면 더한 것도 정수다"처럼, 작은 조각이 어떤 종류의 값인지(타입) 알면 그 조각들로 만든 식의 타입도 알 수 있다는 약속을 하나씩 적어 둔 것이다. 가로선을 긋고 위에 "이것들을 알면", 아래에 "이것을 안다"를 쓴다. 컴파일러는 이 약속을 식의 맨 안쪽부터 바깥으로 차례로 써서 식 전체의 타입을 정하고, 쓸 수 있는 약속이 하나도 없으면 타입 오류로 본다. 다만 변수는 이름만 봐서는 타입을 알 수 없어서, 그 변수가 어디에 어떤 타입으로 선언되어 있는지를 함께 들고 다녀야 한다.

</div>


## 예시로 보기

타입 규칙이 없으면 컴파일러는 `A + B`를 보고 "이게 무슨 타입이지?"에 답할 방법이 없다. 식의 종류마다 답하는 법을 정해 둔 것이 추론 규칙이다. 추론 규칙은 보통 "만약 ~이면 ~이다" 꼴이다. 가정이 참이면 결론도 참이다[^1].

식 `A + B`에 쓰는 규칙은 "A가 int이고 B가 int이면 A + B는 int다"이다[^2]. 트리로 보면, 아래 두 잎의 타입을 알 때 위 노드의 타입이 정해진다.

```
        +  : int
       / \
id A : int   id B : int
```

식 `A && B`에 쓰는 규칙은 "A가 bool이고 B가 bool이면 A && B는 bool이다"이다. A가 bool인데 B가 int면 가정이 채워지지 않는다. 쓸 수 있는 규칙이 없으므로 타입 오류다[^3].

```
        &&  : 규칙을 쓸 수 없다 → 타입 오류
       /  \
id A : bool   id B : int
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 두 예, 아래 표의 모든 규칙, 자유 변수 예, 증명 나무의 규칙 수, 카드의 답 — [35_type-inference-rules_verify.py](/Hongs_Blog/studies/compilers/code/35_type-inference-rules_verify/)</div>

</div>


## 정의

### 적는 법

규칙은 세 가지 기호로 적는다[^4].

| 기호 | 읽는 법 | 뜻 |
|---|---|---|
| $$x : T$$ | "x는 타입 T다" | 식 x의 타입이 T다 |
| $$\dfrac{\text{가정들}}{\text{결론}}$$ | "위가 참이면 아래가 참이다" | 만약 ~이면 ~이다 |
| $$\vdash$$ | "~라고 추론할 수 있다" | 규칙들을 써서 끌어낼 수 있다 |

`A && B`의 규칙을 말에서 기호로 한 단계씩 줄이면 이렇게 된다[^4].

1. A가 bool이고 B가 bool이라고 추론할 수 있으면, A && B가 bool이라고 추론할 수 있다.
2. 가로선으로: $$\dfrac{\text{A가 bool이고 B가 bool이라고 추론할 수 있다}}{\text{A \&\& B가 bool이라고 추론할 수 있다}}$$
3. 기호로:

$$\frac{\vdash A : bool \qquad \vdash B : bool}{\vdash A \,\&\&\, B : bool}$$


### 기본 규칙

가정이 없는 규칙을 공리(axiom)라 부른다. 가로선 위가 비어 있다. 아무것도 몰라도 바로 쓸 수 있다는 뜻이다[^5].

$$\frac{}{\vdash true : bool} \qquad \frac{}{\vdash false : bool} \qquad \frac{}{\vdash 1 : int} \qquad \frac{}{\vdash 1000 : int}$$


상수는 모양만 보고 타입을 정한다. $$i$$, $$s$$, $$d$$는 소스 코드에 적힌 상수다[^5].

$$\frac{i\text{는 정수 상수}}{\vdash i : int} \qquad \frac{s\text{는 문자열 상수}}{\vdash s : string} \qquad \frac{d\text{는 double 상수}}{\vdash d : double}$$


덧셈은 양쪽이 같은 타입일 때 그 타입이 된다. $$e_1$$, $$e_2$$는 아무 식이나 가리키는 이름이고, $$T$$는 타입을 가리키는 이름이다[^5].

$$\frac{\vdash e_1 : int \qquad \vdash e_2 : int}{\vdash e_1 + e_2 : int} \qquad \frac{\vdash e_1 : double \qquad \vdash e_2 : double}{\vdash e_1 + e_2 : double}$$


두 규칙을 하나로 묶으면 이렇다. "$$T$$는 short, int, long, float, double 중 하나다"도 가정이다. bool끼리나 string끼리는 이 규칙으로 더할 수 없다[^5].

$$\frac{\vdash e_1 : T \qquad \vdash e_2 : T \qquad T\text{는 short, int, long, float, double 중 하나}}{\vdash e_1 + e_2 : T}$$


비교는 양쪽이 같은 원시 타입(primitive type)일 때 bool이 된다. 원시 타입은 언어가 처음부터 갖고 있는 기본 타입으로, 슬라이드는 byte, short, int, long, float, double, char를 예로 든다[^6].

$$\frac{\vdash e_1 : T \qquad \vdash e_2 : T \qquad T\text{는 원시 타입}}{\vdash e_1 == e_2 : bool}$$


`<=`, `>=`, `!=`도 가정이 같고 결론의 연산자만 다르다[^6].

덧셈과 비교는 가정이 같은데 결론이 다르다. 덧셈은 받은 타입 $$T$$를 그대로 내놓고, 비교는 무엇을 받았든 bool을 내놓는다.

### 변수가 나오면: 스코프 정보 더하기

`int y = x + 3;`의 `x`처럼, 식 안에서 타입이 선언되지 않은 변수를 그 식의 자유 변수(free variable)라 부른다. `y = x + 3;`에서는 x와 y가, `if (a == b)`에서는 a와 b가 자유 변수다[^7].

`x + 3`에 덧셈 규칙을 쓰려면 $$\vdash x : T$$가 필요하다. 그런데 x는 상수가 아니라서 모양만으로는 타입을 정할 수 없다. "x는 변수다"만으로는 가로선 아래에 쓸 타입이 없다[^8].

$$\frac{x\text{는 변수}}{\vdash x : \,??}$$


x의 타입은 선언에 적혀 있고, 어느 선언이 보이는지는 [스코프](/Hongs_Blog/studies/compilers/identifier-scope/)가 정한다. 그래서 $$\vdash$$의 왼쪽에 스코프 $$S$$를 적는다[^9].

$$S \vdash e : T$$


"스코프 $$S$$ 안에서 식 $$e$$의 타입이 $$T$$라고 추론할 수 있다"로 읽는다. 타입은 이제 그 식이 놓인 스코프에 대해서 정해진다. 앞의 규칙들은 모든 $$\vdash$$ 앞에 $$S$$를 붙이면 그대로 쓴다[^9].

$$\frac{}{S \vdash true : bool} \qquad \frac{i\text{는 정수 상수}}{S \vdash i : int} \qquad \frac{S \vdash e_1 : int \qquad S \vdash e_2 : int}{S \vdash e_1 + e_2 : int}$$


스코프 정보가 들어오면서 새로 적을 수 있는 규칙이 셋이다[^10].

**변수.** x가 변수이고 스코프 $$S$$에서 int로 선언되어 있으면 x는 int다. 선언은 [심벌 테이블](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)을 찾아서 확인한다.

$$\frac{x\text{는 변수} \qquad x\text{는 스코프 }S\text{에서 타입 int로 선언되어 있다}}{S \vdash x : int}$$


**함수 호출.** f가 인자 타입 $$T_1, \dots, T_n$$을 받아 $$U$$를 돌려주는 함수로 선언되어 있고, 넘기는 식 $$e_i$$의 타입이 차례대로 $$T_i$$이면 호출 전체의 타입은 $$U$$다. $$(T_1, \dots, T_n) \to U$$는 "$$T_1$$부터 $$T_n$$까지를 받아 $$U$$를 돌려준다"로 읽는다.

$$\frac{f\text{는 스코프 }S\text{의 비멤버 함수} \qquad f\text{는 전역에서 타입 }(T_1, \dots, T_n) \to U\text{로 선언} \qquad S \vdash e_i : T_i \ (1 \le i \le n)}{S \vdash f(e_1, \dots, e_n) : U}$$


**배열.** $$e_1$$이 $$T$$ 배열이고 $$e_2$$가 int면 $$e_1[e_2]$$는 $$T$$다. $$T[\,]$$는 "$$T$$의 배열"로 읽는다.

$$\frac{S \vdash e_1 : T[\,] \qquad S \vdash e_2 : int}{S \vdash e_1[e_2] : T}$$


### 설계 이유

- **가정이 모두 더 작은 식에 대한 것이다.** 덧셈 규칙의 가정은 $$e_1$$과 $$e_2$$의 타입이고, 이 둘은 $$e_1 + e_2$$보다 작다. 그래서 식의 맨 안쪽(상수와 변수)에서 시작해 바깥으로 한 겹씩 나가면 반드시 끝난다. 추상 구문 트리를 잎에서 뿌리로 올라가는 순서와 같다[^s1].
- **맞는 규칙이 없는 것이 곧 오류다.** "틀린 식"의 목록을 따로 적지 않는다. 허용하는 모양만 적고, 어디에도 맞지 않으면 오류로 본다.
- **$$S$$를 왼쪽에 둔다.** 같은 글자 `x + 3`이 x를 int로 선언한 곳에서는 int이고, x를 double로 선언한 곳에서는 오류다. 타입은 식만으로 정해지지 않고 식과 스코프가 함께 정한다.

## 예제

스코프 $$S$$에 `int x; int y;`가 선언되어 있을 때 `x + 3 == y`의 타입을 정한다[^s2].

1. *잎: 변수.* x는 변수이고 $$S$$에 int로 선언되어 있다. 변수 규칙으로 $$S \vdash x : int$$.
2. *잎: 상수.* 3은 정수 상수다. 상수 규칙으로 $$S \vdash 3 : int$$.
3. *덧셈.* 1과 2에서 양쪽이 int다. int는 덧셈이 받는 타입이다. 덧셈 규칙으로 $$S \vdash x + 3 : int$$.
4. *잎: 변수.* 변수 규칙으로 $$S \vdash y : int$$.
5. *비교.* 3과 4에서 양쪽이 같은 원시 타입 int다. 비교 규칙으로 $$S \vdash x + 3 == y : bool$$.

규칙을 다섯 번 썼다. 식의 트리에 노드가 다섯 개(`==`, `+`, `x`, `3`, `y`)라서다. 노드마다 규칙을 정확히 한 번 쓴다. 다섯 단계를 한 그림으로 쌓으면 증명 나무가 된다. 맨 아래가 결론이고, 위로 갈수록 작은 식이다.

$$\frac{\dfrac{\dfrac{x\text{는 변수} \quad x\text{는 }S\text{에 int로 선언}}{S \vdash x : int} \qquad \dfrac{3\text{은 정수 상수}}{S \vdash 3 : int}}{S \vdash x + 3 : int} \qquad \dfrac{y\text{는 변수} \quad y\text{는 }S\text{에 int로 선언}}{S \vdash y : int}}{S \vdash x + 3 == y : bool}$$


**타입이 정해지는 예 셋.** `1 + 1000`은 int(공리 두 번, 덧셈). `true && false`는 bool. `a[i]`는 a가 `int[]`, i가 int로 선언된 스코프에서 int.

**정해지지 않는 예 둘.** `true + false`는 양쪽 타입이 같지만 bool이 덧셈이 받는 다섯 타입에 없다. `1 == 2.5`는 양쪽이 int와 double로 달라서 비교 규칙의 $$T$$를 하나로 정할 수 없다.

**가정을 하나 빼면.** 덧셈 규칙에서 "$$T$$는 short, int, long, float, double 중 하나"를 빼면 `true + false : bool`이 통과한다. 비교 규칙에서 양쪽의 $$T$$가 같아야 한다는 조건을 빼면 `1 == "one"`이 bool로 통과한다[^s2].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 예제 3단계에서 $$S \vdash x + 3 : int$$를 쓸 수 있는 근거는?</summary>

덧셈 규칙의 가정 셋이 모두 채워졌다. $$S \vdash x : int$$는 1단계에서, $$S \vdash 3 : int$$는 2단계에서 나왔고, int는 덧셈이 받는 다섯 타입 중 하나다. 가정의 $$T$$ 자리에 int를 넣으면 결론의 $$T$$도 int가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 예제 1단계는 무엇을 보고 "x는 int로 선언되어 있다"고 하는가?</summary>

스코프 검사가 만들어 둔 심벌 테이블에서 x를 찾는다. 규칙의 가정 "x는 스코프 $$S$$에서 타입 int로 선언되어 있다"는 다른 규칙으로 끌어내는 것이 아니라 표를 찾아서 확인하는 사실이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 5단계에서 결론의 타입이 int가 아니라 bool인 이유는?</summary>

비교 규칙은 가정의 $$T$$를 결론에 쓰지 않는다. 양쪽이 같은 원시 타입이기만 하면 결론은 늘 bool이다. 덧셈 규칙은 가정의 $$T$$가 결론에 그대로 내려온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방식의 핵심 아이디어는?</summary>

큰 식의 타입을 그 식을 이루는 더 작은 식들의 타입으로 정한다. 가장 작은 식(상수, 변수)은 가정 없는 규칙이나 표 찾기로 정한다. 식이 만들어진 순서를 그대로 따라 올라가는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방식을 쓰는 다른 상황은?</summary>

수학의 증명에서 "전제가 참이면 결론이 참"인 규칙을 쌓아 가는 것([추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/)), 재귀적으로 정의한 구조의 성질을 작은 것에서 큰 것으로 보이는 것([구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/)). 다음 문서에서는 같은 꼴을 문장에 넓힌다([타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)의 WF 규칙).

</details>


## 활용

- 시험에서는 규칙을 주고 식의 타입을 묻거나, 말로 된 조건을 가로선 꼴로 쓰게 한다. 가로선 위에는 가정을 빠짐없이, 아래에는 결론 하나를 쓴다.
- 구현에서는 규칙 하나가 트리 노드 종류 하나의 처리 함수가 된다. 가정의 $$S \vdash e_i : T_i$$는 자식 노드에 대한 재귀 호출이고, 결론의 타입은 함수가 돌려주는 값이다: [36_type-checking-procedure_impl.py](/Hongs_Blog/studies/compilers/code/36_type-checking-procedure_impl/)
- 이 규칙들에는 타입을 알아서 바꿔 주는 규칙이 없다. `int + double`은 오류다([타입과 타입 시스템](/Hongs_Blog/studies/compilers/type-system/)).
- 흔한 실수: $$S$$를 빼고 쓴다(변수가 있으면 타입을 정할 수 없다). 덧셈 규칙에서 "$$T$$는 다섯 타입 중 하나"를 빼먹는다. 함수 호출에서 인자 수가 맞는지 보지 않는다.

## 연결

- 선수: [타입과 타입 시스템](/Hongs_Blog/studies/compilers/type-system/), [스코프](/Hongs_Blog/studies/compilers/identifier-scope/), [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)
- $$S$$가 실제로는 무엇인가: [심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)
- 규칙을 트리 위에서 쓰는 순서와 문장의 규칙: [타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)
- 가로선 꼴의 뿌리: [추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/). 전건 긍정($$p \to q$$와 $$p$$에서 $$q$$)을 타입에 맞춰 여러 개 적어 둔 것이다.
- 연습: [타입 검사 연습](/Hongs_Blog/studies/compilers/type-checking-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"어떤 규칙의 가정이 안 맞으면 그 식은 타입 오류다"</div>

틀렸다. 규칙은 "위가 참이면 아래가 참"만 말한다. 위가 채워지지 않으면 그 규칙을 쓸 수 없을 뿐이고, 그 식에 대해서는 아무 말도 하지 않는다. 같은 식에 쓸 수 있는 다른 규칙이 있으면 그것으로 타입이 정해진다. `2.5 + 1.5`는 int 덧셈 규칙의 가정이 안 맞지만 double 덧셈 규칙의 가정이 맞아서 double이다. 그럴듯해 보이는 이유는 예시의 `A && B`에서 "가정이 안 맞으니 타입 오류"라고 했기 때문이다. 거기서 오류인 까닭은 그 규칙 하나가 안 맞아서가 아니라, `&&`에 쓸 수 있는 규칙이 그것 하나뿐인데 그마저 안 맞아서다. 타입 오류는 "맞는 규칙이 하나도 없다"이다. 확인하는 법: 그 식의 맨 바깥 연산자에 쓸 수 있는 규칙을 모두 대 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$x : T$$, 가로선, $$\vdash$$, $$S \vdash e : T$$를 각각 어떻게 읽는지 쓰고, 정수 덧셈 규칙을 가로선 꼴로 쓰라.</summary>

**답:** $$x : T$$는 "x의 타입은 T다". 가로선은 "위의 가정들이 참이면 아래 결론이 참이다". $$\vdash$$는 "추론할 수 있다". $$S \vdash e : T$$는 "스코프 S 안에서 식 e의 타입이 T라고 추론할 수 있다". 정수 덧셈: $$\dfrac{S \vdash e_1 : int \qquad S \vdash e_2 : int}{S \vdash e_1 + e_2 : int}$$

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `x + 3`의 타입을 $$\vdash$$만으로는 정할 수 없고 $$S \vdash$$가 필요한 이유는?</summary>

**답:** x는 이 식 안에서 선언되지 않은 자유 변수다. 상수 3은 모양만 보고 int라고 할 수 있지만 x는 이름만 봐서는 타입을 알 수 없다. x의 타입은 선언에 있고, 어느 선언이 보이는지는 식이 놓인 스코프가 정한다. 그래서 스코프 $$S$$를 함께 적고 "x는 $$S$$에서 int로 선언되어 있다"를 가정으로 쓴다.<br>
**이유:** x가 int로 선언된 스코프에서는 `x + 3 : int`이고, double로 선언된 스코프에서는 맞는 규칙이 없어 오류다. 같은 글자가 스코프에 따라 다른 답을 낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 스코프 $$S$$에 `int[] a; int i; double d;`와 함수 `double f(int, bool)`이 선언되어 있다. `f(a[i], i == 1) + d`의 타입을 구하고, 규칙을 몇 번 쓰는지 세라.</summary>

**답:** double. 규칙 9번. 안쪽부터: a는 `int[]`(변수), i는 int(변수), `a[i]`는 int(배열), i는 int(변수), 1은 int(상수), `i == 1`은 bool(비교), `f(…)`는 인자가 (int, bool)로 맞아 double(함수 호출), d는 double(변수), 덧셈은 양쪽이 double이라 double.<br>
**이유:** 식의 트리 노드가 9개라 9번이다. 흔한 오답은 f의 반환 타입만 보고 인자를 확인하지 않는 것이다. `f(i == 1, a[i])`로 순서를 바꾸면 인자 타입이 어긋나 오류다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "$$e_1$$과 $$e_2$$가 둘 다 bool이면 $$e_1$$ <code>&#124;&#124;</code> $$e_2$$도 bool이다"를 스코프를 넣은 가로선 꼴로 옮기라. 이 규칙으로 <code>(1 == 2) &#124;&#124; (x &lt;= 3)</code>의 타입을 구하라. x는 $$S$$에 int로 선언되어 있다.</summary>

**답:** $$\dfrac{S \vdash e_1 : bool \qquad S \vdash e_2 : bool}{S \vdash e_1 \,\vert \vert \, e_2 : bool}$$. `1 == 2`는 양쪽이 int라 bool, `x <= 3`도 양쪽이 int라 bool이다. 두 가정이 채워져 전체는 bool이다.<br>
**이유:** <code>&#124;&#124;</code> 규칙은 슬라이드에 없지만 `&&` 규칙과 같은 모양이다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 덧셈 규칙에서 "$$T$$는 short, int, long, float, double 중 하나"라는 가정을 지우면 통과해 버리는 틀린 식을 하나 들라.</summary>

**답:** `true + false`. 양쪽이 같은 타입 bool이므로, 그 가정이 없으면 $$\vdash true + false : bool$$이 나온다. 가정이 있으면 bool이 다섯 타입에 없어 규칙을 쓸 수 없고 타입 오류가 된다.

</details>


[^1]: 컴파일러 10회 강의 자료 「Lecture10 Semantic analysis part 2」, p.13 (추론 규칙은 if-then 꼴)
[^2]: 같은 자료, p.14 (A + B의 규칙과 트리 그림)
[^3]: 같은 자료, p.15 (A && B에서 bool과 int: Not satisfied… type error)
[^4]: 같은 자료, p.16 (표기 세 가지와 A && B 규칙을 기호로 줄여 가는 네 줄)
[^5]: 같은 자료, p.17 (공리, 상수 규칙, 덧셈 규칙 세 개)
[^6]: 같은 자료, p.18 (==, <=, >=, != 규칙)
[^7]: 같은 자료, p.19 (자유 변수의 뜻과 예 세 개)
[^8]: 같은 자료, p.20 (x + 3에서 x의 타입을 정할 정보가 없다)
[^9]: 같은 자료, p.21 (S ⊢ e : T와 스코프를 넣은 규칙들)
[^10]: 같은 자료, p.22 (변수, 함수 호출, 배열 규칙. 배열 규칙의 대괄호는 슬라이드 그림에서 읽었다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 설계 이유 세 가지는 원본에 없다. 슬라이드의 규칙들이 모두 "더 작은 식의 타입 → 더 큰 식의 타입" 꼴인 것과 p.28의 "AST를 재귀로 돈다"에서 끌어냈다. Aho 외, *Compilers* 2판 6.5절.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `x + 3 == y`의 다섯 단계와 증명 나무, 정해지는 예·정해지지 않는 예, 가정을 뺀 반례, 스스로 설명해 보기, 오해 항목의 `2.5 + 1.5`, 카드 C3·C5는 원본에 없다. 슬라이드 p.17~22의 규칙만 써서 만들었고 검증 코드로 타입과 규칙 수를 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> <code>&#124;&#124;</code> 규칙은 원본에 없다. p.16의 `&&` 규칙과 같은 모양으로 적었다.
{% endraw %}
