---
layout: "note"
title: "LL(1) 파싱 표"
display_title: "LL(1) 파싱 표 (LL(1) Parsing Table)"
kind: "concept"
kind_label: "알고리즘"
num: "20"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["LL(1) Parsing Table", "LL(1) 파싱 테이블", "예측 파싱", "Predictive Parsing", "예측 파서", "LL(k)", "LL(1) 문법", "Lookahead", "미리보기 기호"]
description: "\"지금 풀어야 할 이름\"과 \"다음에 올 낱말 하나\"를 알면 어느 규칙을 쓸지 바로 찾아볼 수 있게 미리 만들어 둔 표다. 갈림길마다 \"이 표지가 보이면 이 길\"이라고 적어 둔 길 안내판과 같아서, 길을 잘못 들어 되돌아가는 일이 없다. 표의 빈칸은 문법에 어긋난 입력이라는 뜻이다.…"
prev_url: "/studies/compilers/follow-set/"
prev_title: "FOLLOW 집합"
next_url: "/studies/compilers/ll1-stack-parser/"
next_title: "LL(1) 파서의 스택 동작"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "20_ll1-parsing-table_impl.py", "u": "/studies/compilers/code/20_ll1-parsing-table_impl/", "r": "구현"}]
permalink: "/studies/compilers/ll1-parsing-table/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"지금 풀어야 할 이름"과 "다음에 올 낱말 하나"를 알면 어느 규칙을 쓸지 바로 찾아볼 수 있게 미리 만들어 둔 표다. 갈림길마다 "이 표지가 보이면 이 길"이라고 적어 둔 길 안내판과 같아서, 길을 잘못 들어 되돌아가는 일이 없다. 표의 빈칸은 문법에 어긋난 입력이라는 뜻이다. 다만 모든 문법에 이런 표를 만들 수 있지는 않다. 한 칸에 규칙이 둘 들어가면 낱말 하나로는 길을 정할 수 없다는 뜻이고, 그런 문법은 이 방법으로 읽지 못한다.

</div>


## 예시로 보기

[재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)은 규칙을 찍어 보고 틀리면 되돌아가서 느리다. 되돌아가지 않으려면 규칙을 고르는 순간에 맞는 것을 알아야 한다. 방법은 입력을 조금 미리 보는 것이다.

문법 $$S \to aA \mid b \mid A$$, $$\ A \to (S)$$에서 $$S$$를 펼칠 차례라고 하자. 다음 입력 토큰 하나만 보면 규칙이 정해진다.

| 가장 왼쪽 비단말 기호 | 다음 입력 토큰 | 고르는 규칙 |
|---|---|---|
| $$S$$ | $$a$$ | $$S \Rightarrow aA$$ |
| $$S$$ | $$b$$ | $$S \Rightarrow b$$ |
| $$S$$ | `(` | $$S \Rightarrow A$$ |

이렇게 다음 토큰을 보고 규칙을 내다보는 방법을 예측 파싱이라 한다. 위 표를 모든 비단말 기호와 모든 토큰에 대해 만들어 둔 것이 파싱 표다.

산술식 문법 $$E \to TE'$$, $$\ E' \to +E \mid \epsilon$$, $$\ T \to FT'$$, $$\ T' \to *T \mid \epsilon$$, $$\ F \to (E) \mid id$$의 파싱 표는 다음과 같다. 줄은 가장 왼쪽 비단말 기호, 열은 다음 입력 토큰이다. 칸에는 그때 쓸 규칙의 오른쪽을 적는다. $$\$$$는 입력의 끝을 알리는 표시다.

| | $$+$$ | $$*$$ | `(` | `)` | $$id$$ | $$\$$$ |
|---|---|---|---|---|---|---|
| $$E$$ | | | $$TE'$$ | | $$TE'$$ | |
| $$E'$$ | $$+E$$ | | | $$\epsilon$$ | | $$\epsilon$$ |
| $$T$$ | | | $$FT'$$ | | $$FT'$$ | |
| $$T'$$ | $$\epsilon$$ | $$*T$$ | | $$\epsilon$$ | | $$\epsilon$$ |
| $$F$$ | | | $$(E)$$ | | $$id$$ | |

$$E$$를 펼칠 차례에 다음 토큰이 $$id$$면 $$[E, id]$$ 칸의 $$TE'$$를 쓴다. $$T'$$를 펼칠 차례에 다음 토큰이 $$+$$면 $$[T', +]$$ 칸의 $$\epsilon$$, 곧 $$T'$$를 지운다. 서른 칸 가운데 열세 칸만 차 있다. 빈칸을 찾게 되면 그 입력은 문법에 맞지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 열세 칸, FIRST로 채우는 여덟 칸과 FOLLOW로 채우는 다섯 칸, 좌인수분해를 안 한 문법·좌재귀 문법·모호한 문법에서 한 칸에 규칙이 둘 드는 자리 — [20_ll1-parsing-table_impl.py](/Hongs_Blog/studies/compilers/code/20_ll1-parsing-table_impl/)</div>

</div>


## 정의

예측 파싱은 LL($$k$$) 파싱이라고도 부른다.

- 첫째 L: 입력을 왼쪽에서 오른쪽으로 읽는다.
- 둘째 L: 좌측 유도를 만든다.
- $$k$$: 입력 토큰을 $$k$$개 미리 보고 규칙을 내다본다.

실제로는 $$k = 1$$인 LL(1)을 쓴다. LL(1) 파서는 가장 왼쪽 비단말 기호 $$A$$와 다음 입력 토큰 $$a$$ 하나로 규칙을 정한다. 한마디로 되돌아가기가 필요 없는 재귀 하강 파싱이다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**LL(1) 파싱 표** $$M$$은 줄이 비단말 기호, 열이 단말 기호와 끝 표시 $$\$$$인 표다. 칸 $$M[A, x]$$에는 "가장 왼쪽 비단말 기호가 $$A$$이고 다음 입력이 $$x$$일 때 쓸 규칙"을 적는다. 모든 규칙 $$A \to \alpha$$에 대해 다음 두 가지를 한다.
1. $$First(\alpha)$$에 든 단말 기호 $$x$$마다 $$M[A, x]$$에 $$\alpha$$를 적는다.
2. $$\epsilon \in First(\alpha)$$이면, $$Follow(A)$$에 든 단말 기호($$\$$$ 포함) $$x$$마다 $$M[A, x]$$에 $$\alpha$$를 적는다.

</div>


$$First(\alpha)$$는 $$\alpha$$를 끝까지 풀었을 때 맨 앞에 올 수 있는 토큰들이고([FIRST 집합](/Hongs_Blog/studies/compilers/first-set/)), $$Follow(A)$$는 $$A$$ 바로 뒤에 올 수 있는 토큰들이다([FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/)).

**쓸 수 있는 조건.** 조건은 셋이다.

- 문법이 모호하지 않다.
- 문법에 좌재귀가 없다.
- 문법이 좌인수분해되어 있다.

재귀 하강과 견주면 셋째가 다르다. 재귀 하강은 좌인수분해가 필요 없었지만 예측 파싱은 꼭 해야 한다.

표를 만든 뒤에 판정하는 기준은 하나다. 모든 칸에 규칙이 많아야 하나씩 들어 있으면 그 문법을 LL(1) 문법이라 하고, 한 칸이라도 규칙이 둘 이상 들면 LL(1) 문법이 아니다[^s1]. 위 세 조건은 꼭 갖춰야 하는 것이지 갖추면 끝인 것은 아니다. 좌인수분해까지 마쳐도 2번 규칙 때문에 칸이 겹칠 수 있다(아래 예제).

## 알고리즘

```
입력: 좌재귀가 없고 좌인수분해된 문법 G
모든 비단말 기호의 First, Follow를 구한다
모든 규칙 A → α 에 대해
    First(α)를 구한다
    First(α)의 단말 기호 x마다:   M[A, x] 에 α 를 적는다       (1번)
    ε ∈ First(α) 이면
        Follow(A)의 x마다:        M[A, x] 에 α 를 적는다       (2번)
어느 칸에 규칙이 둘 이상 적히면 "LL(1) 문법이 아니다"를 알린다
출력: 표 M
```

### 추적: 산술식 문법

FIRST와 FOLLOW는 앞 두 문서의 값을 쓴다.

**1번으로 채우기.** 규칙 오른쪽마다 FIRST를 구해 그 칸에 적는다.

| 규칙 | $$First(\alpha)$$ | 적는 칸 |
|---|---|---|
| $$E \to TE'$$ | $$First(T) = \{(, id\}$$ | $$[E, (]$$, $$[E, id]$$ |
| $$E' \to +E$$ | $$\{+\}$$ | $$[E', +]$$ |
| $$T \to FT'$$ | $$First(F) = \{(, id\}$$ | $$[T, (]$$, $$[T, id]$$ |
| $$T' \to *T$$ | $$\{*\}$$ | $$[T', *]$$ |
| $$F \to (E)$$ | $$\{(\}$$ | $$[F, (]$$ |
| $$F \to id$$ | $$\{id\}$$ | $$[F, id]$$ |

여기까지 여덟 칸이 찬다.

**2번으로 채우기.** 오른쪽이 빈 문자열이 될 수 있는 규칙은 둘이다.

| 규칙 | $$Follow(A)$$ | 적는 칸 |
|---|---|---|
| $$E' \to \epsilon$$ | $$Follow(E') = \{\$, )\}$$ | $$[E', )]$$, $$[E', \$]$$ |
| $$T' \to \epsilon$$ | $$Follow(T') = \{+, \$, )\}$$ | $$[T', +]$$, $$[T', )]$$, $$[T', \$]$$ |

다섯 칸이 더 차서 모두 열세 칸이다. 같은 칸에 두 번 적힌 곳이 없으므로 이 문법은 LL(1) 문법이다.

### 표를 써서 읽기

입력 $$(id)\$$$를 읽는다. 걸음마다 가장 왼쪽 비단말 기호와 다음 입력 토큰으로 표를 찾는다.

| 다음 입력 | 유도 | 찾은 칸 |
|---|---|---|
| `(` | $$E \Rightarrow_{lm} TE' \Rightarrow_{lm} FT'E' \Rightarrow_{lm} (E)T'E'$$ | $$[E, (]$$, $$[T, (]$$, $$[F, (]$$ |
| $$id$$ | $$\Rightarrow_{lm} (TE')T'E' \Rightarrow_{lm} (FT'E')T'E' \Rightarrow_{lm} (id\,T'E')T'E'$$ | $$[E, id]$$, $$[T, id]$$, $$[F, id]$$ |
| `)` | $$\Rightarrow_{lm} (id\,E')T'E' \Rightarrow_{lm} (id)T'E'$$ | $$[T', )]$$, $$[E', )]$$ |
| $$\$$$ | $$\Rightarrow_{lm} (id)E' \Rightarrow_{lm} (id)$$ 받아들인다 | $$[T', \$]$$, $$[E', \$]$$ |

한 번도 되돌아가지 않았다. 이것을 스택으로 돌리는 방법은 [LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/)에 있다.

### 왜 이 두 규칙이 맞는가

**주장.** 문법이 LL(1) 문법이면(칸마다 규칙이 많아야 하나), 가장 왼쪽 비단말 기호가 $$A$$이고 다음 입력이 $$x$$일 때 입력을 끝까지 맞출 수 있는 규칙은 $$M[A, x]$$에 적힌 것뿐이다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치 펼치기</summary>

지금 문장 형식이 $$wA\gamma$$이고($$w$$는 이미 맞춘 입력) 다음 입력이 $$x$$라 하자. $$A$$에 규칙 $$A \to \alpha$$를 써서 끝까지 맞출 수 있다고 하자.
1. $$A$$를 $$\alpha$$로 바꾼 뒤 $$\alpha\gamma$$에서 나오는 문자열은 $$x$$로 시작해야 한다. 경우는 둘뿐이다. — 입력의 다음 토큰이 $$x$$이므로
2. **$$\alpha$$가 한 글자 이상을 내놓는 경우.** 그 첫 글자가 $$x$$다. 곧 $$x \in First(\alpha)$$이고, 1번이 $$M[A, x]$$에 $$\alpha$$를 적었다. — FIRST의 정의
3. **$$\alpha$$가 빈 문자열이 되는 경우.** $$\epsilon \in First(\alpha)$$이고, $$x$$는 $$\gamma$$ 쪽에서 나온다(입력이 끝났으면 $$x = \$$$). $$x$$는 이 문장 형식에서 $$A$$ 바로 뒤에 온 토큰이므로 $$x \in Follow(A)$$이고, 2번이 $$M[A, x]$$에 $$\alpha$$를 적었다. — FOLLOW의 정의
4. 그래서 쓸 수 있는 규칙은 모두 $$M[A, x]$$에 적혀 있다. 칸에 규칙이 하나뿐이면 그것만이 후보다. 칸이 비었으면 어떤 규칙으로도 맞출 수 없으니 오류다. ∎

이 논증은 "적힌 규칙 말고는 가망이 없다"를 보인다. 적힌 규칙을 쓰면 반드시 끝까지 맞는다는 뜻은 아니다. 뒤쪽 입력이 틀렸으면 나중 걸음에서 빈칸을 만난다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계와 3단계로 경우가 다 나뉘는 까닭은?</summary>

$$\alpha$$에서 나오는 문자열은 한 글자 이상이거나 빈 문자열이거나 둘 중 하나다. 한 글자 이상이면 다음 입력 $$x$$는 $$\alpha$$의 것이고, 빈 문자열이면 $$x$$는 $$A$$ 뒤의 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계에서 $$x \in Follow(A)$$라고 할 수 있는 근거는?</summary>

$$wA\gamma$$는 시작 기호에서 유도된 문장 형식이고, $$\gamma$$에서 $$x$$로 시작하는 문자열이 나온다. 그러면 $$A$$ 바로 오른쪽에 $$x$$가 붙은 문장 형식이 있다는 것이고, 이것이 $$Follow(A)$$의 정의다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 한 칸에 규칙이 둘 들어가면 이 논증의 어디가 무너지는가?</summary>

4단계다. 후보가 둘이면 다음 토큰 하나로는 어느 것이 맞는지 정할 수 없다. 둘 다 시험하려면 되돌아가기가 다시 필요하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 논증의 핵심 아이디어는?</summary>

다음 토큰이 나올 수 있는 출처는 "지금 펼치는 규칙의 안쪽"과 "그 비단말 기호의 뒤쪽" 둘뿐이다. 안쪽은 FIRST가, 뒤쪽은 FOLLOW가 미리 계산해 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

상향식의 [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)도 "상태와 다음 토큰"으로 할 일을 찾는 표이고, 묶는 동작의 자리를 FOLLOW로 정한다. 표로 미리 정해 두고 되돌아가지 않는다는 생각은 [부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/)으로 만든 DFA의 전이표와도 같다.

</details>


### 복잡도

표의 크기는 (비단말 기호 수) × (단말 기호 수 + 1)칸이다. 만드는 일은 FIRST와 FOLLOW를 구한 뒤 규칙마다 제 칸을 채우는 것이라, 규칙 수 × 열 수에 비례하는 일이면 끝난다. 표를 쓰는 쪽은 걸음마다 칸 하나를 찾으므로 한 걸음이 상수 시간이다[^s2].

## 예제

**표가 겹치는 세 경우**[^s3].

| 문법 | 겹치는 칸 | 들어가는 규칙 | 원인 |
|---|---|---|---|
| $$E \to T + E \mid T$$, $$T \to F * T \mid F$$, $$F \to (E) \mid id$$ | $$[E, (]$$, $$[E, id]$$, $$[T, (]$$, $$[T, id]$$ | $$T + E$$와 $$T$$ / $$F * T$$와 $$F$$ | 좌인수분해를 안 했다 |
| $$S \to Sa \mid b$$ | $$[S, b]$$ | $$Sa$$와 $$b$$ | 좌재귀 |
| $$S \to i\,E\,t\,S\,S' \mid a$$, $$S' \to e\,S \mid \epsilon$$, $$E \to b$$ | $$[S', e]$$ | $$eS$$와 $$\epsilon$$ | 문법이 모호하다(매달린 else) |

셋째 문법은 좌재귀도 없고 좌인수분해도 했다. 그런데 $$First(eS) = \{e\}$$이고 $$Follow(S') = \{\$, e\}$$라서 1번과 2번이 같은 칸 $$[S', e]$$에 적는다. else를 보았을 때 안쪽 if에 붙일지($$eS$$) 바깥 if를 위해 남겨 둘지($$\epsilon$$) 정할 수 없다는 [모호함](/Hongs_Blog/studies/compilers/ambiguous-grammar/)이 표에 그대로 나타난 것이다.

**경계 사례.** $$S \to aSb \mid \epsilon$$의 표는 $$[S, a] = aSb$$, $$[S, b] = \epsilon$$, $$[S, \$] = \epsilon$$이다. $$First(aSb) = \{a\}$$와 $$Follow(S) = \{b, \$\}$$가 겹치지 않아 LL(1) 문법이다.

## 활용

- **파서의 두 단계.** ① 문법에서 표를 만든다. ② 입력이 오면 표를 찾아가며 읽는다. ①은 문법마다 한 번만 하고 ②는 입력마다 한다.
- **오류 찾기.** 빈칸이 곧 문법 오류다. $$[E, )]$$가 빈칸이므로 식이 `)`로 시작하면 바로 오류를 알린다.
- **흔한 실수.**
    - $$\epsilon$$ 규칙을 $$\epsilon$$ 열에 적으려 한다. 표에 $$\epsilon$$ 열은 없다. $$\epsilon$$ 규칙은 FOLLOW의 열에 적는다.
    - 2번에서 $$Follow(A)$$가 아니라 $$Follow(\alpha)$$나 $$First(A)$$를 쓴다.
    - $$\$$$ 열을 빠뜨린다.
    - $$First(\alpha)$$를 구할 때 규칙의 첫 기호만 보고 멈춘다(첫 기호가 사라질 수 있으면 다음 기호도 본다).
- 연습: [LL(1) 파싱 표 예제 사다리](/Hongs_Blog/studies/compilers/ll1-table-ladder/)

## 연결

- 선수: [FIRST 집합](/Hongs_Blog/studies/compilers/first-set/), [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/), [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)
- 문법을 표에 맞게 다듬는 일: [모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/), [좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/), [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)
- 표를 돌리는 기계: [LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/)
- 상향식의 표: [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/), 두 방식 견주기: [LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"좌재귀를 없애고 좌인수분해를 하면 그 문법은 LL(1)이다"</div>

틀렸다. 두 작업은 표가 겹치는 흔한 원인 둘을 없앨 뿐이다. 그럴듯해 보이는 까닭은 조건을 흔히 "모호하지 않다, 좌재귀가 없다, 좌인수분해되어 있다" 셋으로 들고, 예로 든 산술식 문법이 그 셋을 갖추자 표가 깨끗하게 나오기 때문이다. 하지만 빈 문자열이 되는 규칙이 있으면 그 비단말 기호의 FOLLOW가 다른 규칙의 FIRST와 겹칠 수 있다. $$S \to aAa \mid \epsilon$$, $$A \to abS \mid \epsilon$$은 좌재귀도 공통 접두사도 없지만 $$[S, a]$$에 $$aAa$$와 $$\epsilon$$이, $$[A, a]$$에 $$abS$$와 $$\epsilon$$이 함께 들어간다. 확인하는 법: 표를 끝까지 만들어 한 칸에 규칙이 둘 든 곳이 있는지 본다. 이것이 유일한 판정이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 규칙 $$A \to \alpha$$를 LL(1) 파싱 표의 어느 칸에 적는지 두 가지 경우로 쓰라.</summary>

**답:** ① $$First(\alpha)$$에 든 단말 기호 $$x$$마다 $$[A, x]$$에 적는다. ② $$\epsilon \in First(\alpha)$$이면 $$Follow(A)$$에 든 $$x$$($$\$$$ 포함)마다 $$[A, x]$$에 적는다.<br>
**이유:** ①은 $$\alpha$$가 $$x$$로 시작할 수 있을 때, ②는 $$\alpha$$가 사라지고 $$A$$ 뒤의 것이 $$x$$일 때다. 흔한 오답은 ②에서 $$Follow(\alpha)$$라고 쓰는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$S \to Ab \mid c$$, $$\ A \to aA \mid \epsilon$$의 LL(1) 파싱 표를 만들어라. LL(1) 문법인가?</summary>

**답:** $$[S, a] = Ab$$, $$[S, b] = Ab$$, $$[S, c] = c$$, $$[A, a] = aA$$, $$[A, b] = \epsilon$$. 나머지는 빈칸이다. 겹치는 칸이 없어 LL(1) 문법이다.<br>
**이유:** $$First(Ab) = \{a, b\}$$($$A$$가 사라질 수 있어 $$b$$까지), $$First(c) = \{c\}$$, $$First(aA) = \{a\}$$. $$A \to \epsilon$$은 $$Follow(A) = \{b\}$$의 칸에 적는다. $$[S, b]$$를 빠뜨리기 쉽다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 2번(ε ∈ First(α)이면 Follow(A)의 칸에 적는다)이 하는 일을 한 문장으로 쓰라.</summary>

**답:** $$A$$를 아무것도 남기지 않고 지워도 되는 때, 곧 다음 토큰이 $$A$$ 뒤에 올 수 있는 토큰일 때를 표에 적어 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 재귀 하강 파싱은 좌인수분해가 필요 없는데 예측 파싱은 왜 꼭 해야 하는가?</summary>

**답:** 재귀 하강은 같은 기호로 시작하는 두 규칙을 차례로 시험하고 틀리면 되돌아간다. 예측 파싱은 되돌아가지 않으므로 다음 토큰 하나로 규칙이 하나로 정해져야 한다. 두 규칙이 같은 기호로 시작하면 그 기호의 FIRST에 든 토큰 칸에 두 규칙이 함께 적혀 정할 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 다음 가운데 LL(1) 문법인 것을 고르고, 아닌 것은 겹치는 칸을 대라. (가) $$S \to aSb \mid \epsilon$$ (나) $$S \to aAa \mid \epsilon$$, $$A \to abS \mid \epsilon$$ (다) $$S \to Sa \mid b$$</summary>

**답:** (가)만 LL(1) 문법이다. (나)는 $$[S, a]$$에 $$aAa$$와 $$\epsilon$$, $$[A, a]$$에 $$abS$$와 $$\epsilon$$이 겹친다. (다)는 $$[S, b]$$에 $$Sa$$와 $$b$$가 겹친다.<br>
**이유:** (나)는 $$Follow(S) = \{\$, a\}$$, $$Follow(A) = \{a\}$$가 각각 $$First(aAa)$$, $$First(abS)$$와 겹친다. (다)는 좌재귀라 $$First(Sa) = First(b) = \{b\}$$다.

</details>


[^s1]: 오해 항목의 문법은 구현 코드로 겹치는 칸을 확인했다.
[^s2]: 표로 읽은 결과가 길이 6 이하의 모든 입력에서 문법의 언어와 같음은 [21_ll1-stack-parser_impl.py](/Hongs_Blog/studies/compilers/code/21_ll1-stack-parser_impl/)로 확인했다. 이 비교는 실험이고 근거는 증명 스케치다.
[^s3]: 구현 코드로 표와 겹치는 칸을 확인했다. 매달린 else 문법은 if, then, else를 $$i$$, $$t$$, $$e$$로 줄여 쓴 것이다.
{% endraw %}
