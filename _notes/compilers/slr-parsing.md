---
layout: "note"
title: "SLR 파싱"
display_title: "SLR 파싱 (SLR Parsing)"
kind: "concept"
kind_label: "알고리즘"
num: "26"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["SLR Parsing", "Simple LR", "SLR(1)", "LR(0) 파싱", "LR(0) Parsing", "SLR 문법", "우선순위 선언", "Precedence Declaration"]
description: "쌓아 둔 부분을 기계에 읽혀 지금 처지를 알아낸 뒤, 묶을 수 있는 규칙이 보여도 바로 묶지 않고 다음 토큰을 한 번 훔쳐본다. 그 토큰이 \"묶어서 생길 기호 바로 뒤에 올 수 있는 것\"일 때만 묶는다. 이 한 번의 확인으로 묶을지 더 읽을지 겹치던 자리가 대부분 풀린다. 그래도 …"
prev_url: "/studies/compilers/lr0-item-automaton/"
prev_title: "LR(0) 항목과 항목 오토마타"
next_url: "/studies/compilers/slr-parsing-table/"
next_title: "SLR 파싱 표"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/slr-parsing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쌓아 둔 부분을 기계에 읽혀 지금 처지를 알아낸 뒤, 묶을 수 있는 규칙이 보여도 바로 묶지 않고 다음 토큰을 한 번 훔쳐본다. 그 토큰이 "묶어서 생길 기호 바로 뒤에 올 수 있는 것"일 때만 묶는다. 이 한 번의 확인으로 묶을지 더 읽을지 겹치던 자리가 대부분 풀린다. 그래도 겹치는 칸이 남는 문법이 있고, 그런 문법은 이 방법으로 파싱하지 못한다. 뜻이 두 가지로 읽히는 문법이 그 예인데, 이때는 연산자의 우선순위를 따로 알려 줘서 고르게 한다.

</div>


## 예시로 보기

[항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/)만으로 결정하는 방법부터 본다. 막대 왼쪽 $$\alpha$$를 DFA에 읽혀 상태 $$q_i$$에 닿았을 때[^1]

- $$q_i$$에 점이 끝에 있는 항목 $$X \to \beta.$$이 있으면 그 규칙으로 환원한다.
- $$q_i$$에서 다음 토큰 $$b$$로 가는 전이가 있으면 이동한다. 둘 다 아니면 오류다.

이것을 LR(0) 파싱이라 부른다. 0은 다음 토큰을 0개 본다는 뜻이다[^s1].

문법 $$S' \to E$$, $$E \to T * E \mid T$$, $$T \to (E) \mid id$$로 입력 `( id * id )`를 파싱한다. <code>( T&#124;* id )</code>에 왔을 때 `( T`를 읽은 DFA는 상태 3에 있다. 상태 3의 항목은 둘이다[^2].

$$E \to T.*E \qquad E \to T.$$


첫 항목은 "`*`를 이동하라"고 하고, 둘째 항목은 "$$E \to T$$로 환원하라"고 한다. LR(0)의 규칙으로는 둘 다 맞아서 정하지 못한다. 이동-환원 충돌이다[^2].

여기서 다음 토큰 `*`를 본다. $$E \to T$$로 환원하면 <code>( E&#124;* id )</code>가 되는데, 이 문법에서 `E` 바로 뒤에 `*`가 올 수 있을까? `E` 바로 뒤에 올 수 있는 토큰의 모음(FOLLOW(E))은 `)`와 `$`뿐이다. `*`는 없다. 그러니 환원하면 반드시 막힌다. 이동이 답이다[^3].

## 정의

SLR 파싱은 LR(0)의 환원 조건에 [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/) 확인을 하나 더한 것이다. SLR은 Simple LR, 곧 "간단한 LR"이다[^s1].

막대 왼쪽이 $$\alpha$$, 다음 토큰이 $$b$$이고($$\alpha \mid b\omega$$), DFA가 $$\alpha$$를 읽고 상태 $$q_i$$에 닿았을 때[^3]

| 조건 | 할 일 |
|---|---|
| $$q_i$$에 항목 $$X \to \beta.$$이 있고 다음 토큰 $$b$$가 $$X$$ 바로 뒤에 올 수 있다 | $$X \to \beta$$로 환원 |
| $$q_i$$에서 $$b$$로 가는 전이가 있다 | 이동 |
| 둘 다 아니다 | 오류 |

기호로 쓰면 환원 조건은 "$$X \to \beta. \in q_i$$ 그리고 $$b \in \text{Follow}(X)$$"다. $$\beta$$는 $$\alpha$$의 끝자락이고, $$\text{Follow}(X)$$는 문법에서 $$X$$ 바로 뒤에 올 수 있는 터미널의 집합이다. 입력 끝 표시 `$`도 들어갈 수 있다.

파싱은 두 걸음을 되풀이한다[^4].

1. $$\alpha$$를 DFA에 읽혀 어느 상태에서 끝나는지 본다. 길이 끊기면 $$\alpha$$가 [유효 접두사](/Hongs_Blog/studies/compilers/viable-prefix/)가 아니므로 오류다.
2. 닿은 상태와 다음 토큰으로 위 표에서 할 일을 고른다.

$$S' \to E.$$이 든 상태에서 다음 토큰이 `$`이면 $$S' \to E$$로 환원하고 받아들인다[^5].

### 입력과 출력

- 입력: 덧붙인 문법, 그 문법의 항목 DFA와 FOLLOW 집합, 끝에 `$`를 붙인 토큰열.
- 출력: 받아들임과 환원한 규칙의 순서, 또는 오류.

### 의사코드

```
왼쪽 ← 빈 문자열
반복:
    q ← 왼쪽을 DFA에 읽혀 닿은 상태            (끊기면 오류)
    b ← 다음 토큰
    q에 S' → S. 이 있고 b = $ 이면 → 받아들임
    q에 X → β. 이 있고 b ∈ Follow(X) 이면 → 왼쪽의 끝자락 β를 X로 바꾼다
    아니고 q에서 b로 가는 전이가 있으면 → b를 왼쪽 끝으로 옮긴다
    아니면 → 오류
```

### 실행 추적

같은 문법에서 $$\text{Follow}(E) = \{\,),\ \$\,\}$$, $$\text{Follow}(T) = \{\,*,\ ),\ \$\,\}$$이다[^3]. 입력 `( id * id )`의 추적이다. 상태 번호는 [항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/)의 표를 따른다[^6].

| 왼쪽\|오른쪽 | 닿은 상태 | 다음 토큰 | 한 일과 이유 |
|---|---|---|---|
| `\|( id * id ) $` | 1 | `(` | 이동 |
| `(\|id * id ) $` | 4 | `id` | 이동 |
| `( id\|* id ) $` | 5 | `*` | $$T \to id$$로 환원. `*`가 Follow(T)에 있다 |
| `( T\|* id ) $` | 3 | `*` | 이동. `*`가 Follow(E)에 없어 $$E \to T$$는 안 쓴다 |
| `( T *\|id ) $` | 6 | `id` | 이동 |
| `( T * id\|) $` | 5 | `)` | $$T \to id$$로 환원. `)`가 Follow(T)에 있다 |
| `( T * T\|) $` | 3 | `)` | $$E \to T$$로 환원. `)`가 Follow(E)에 있다 |
| `( T * E\|) $` | 8 | `)` | $$E \to T * E$$로 환원. `)`가 Follow(E)에 있다 |
| `( E\|) $` | 7 | `)` | 이동 |
| `( E )\|$` | 9 | `$` | $$T \to (E)$$로 환원. `$`가 Follow(T)에 있다 |
| `T\|$` | 3 | `$` | $$E \to T$$로 환원. `$`가 Follow(E)에 있다 |
| `E\|$` | 2 | `$` | $$S' \to E$$로 환원하고 받아들임 |

넷째 줄과 일곱째 줄은 둘 다 상태 3이다. 같은 상태인데 다음 토큰이 `*`이면 이동하고 `)`이면 환원한다. 다음 토큰을 보는 것이 결정을 가른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: LR(0)의 충돌이 상태 3의 `*` 한 칸뿐이고 SLR에서는 0칸, Follow(E)와 Follow(T), 위 추적 12줄, 길이 7 이하 토큰열 21,845개에서 SLR 파서의 답이 뻔한 방법과 같음(문법에 맞는 것 22개) — [26_slr-parsing_impl.py](/Hongs_Blog/studies/compilers/code/26_slr-parsing_impl/)</div>

</div>


### 정확성: FOLLOW를 봐도 되는 이유

**주장.** $$X \to \beta$$로 환원한 뒤에도 파싱이 끝까지 가려면 다음 토큰 $$b$$가 $$\text{Follow}(X)$$ 안에 있어야 한다. 그래서 $$b \notin \text{Follow}(X)$$일 때 환원을 빼도 맞는 입력을 놓치지 않는다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. $$\alpha\beta \mid b\omega$$에서 $$X \to \beta$$로 환원하면 $$\alpha X \mid b\omega$$가 된다. — 환원의 정의
2. 이 입력이 끝내 받아들여진다면, $$\alpha X b\omega$$에서 원래 입력까지 가는 유도가 있고 시작 기호에서 $$\alpha X b\omega$$까지 가는 유도도 있다. — [이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/)의 정확성
3. 그러면 시작 기호에서 만든 문자열 안에 $$X$$ 바로 뒤에 $$b$$가 온 것이 있다. 이것이 $$b \in \text{Follow}(X)$$의 뜻이다. — FOLLOW 집합의 정의
4. 대우를 취하면, $$b \notin \text{Follow}(X)$$일 때 그 환원은 받아들이는 길 위에 있지 않다. 빼도 잃는 것이 없다. ∎

</details>


거꾸로는 맞지 않는다. $$b \in \text{Follow}(X)$$라고 해서 그 환원이 꼭 옳은 것은 아니다. FOLLOW는 "문법 어딘가에서" $$X$$ 뒤에 $$b$$가 올 수 있는지만 말하고, "지금 이 자리에서" 올 수 있는지는 말하지 않는다. 그래서 FOLLOW를 봐도 충돌이 남는 문법이 있다.

### 충돌이 남으면: SLR 문법이 아니다

FOLLOW를 봐도 한 상태, 한 토큰에서 할 일이 둘 이상이면 그 문법은 SLR 문법이 아니다. [모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/)이 그렇다[^7].

문법 $$E \to E + E \mid E * E \mid id$$와 입력 `id + id * id`를 보자. <code>E + E&#124;* id</code>에 왔을 때[^7]

- $$E \to E + E.$$이 상태에 있고 `*`는 Follow(E)에 있다. 환원할 수 있다. 환원하면 `(id + id) * id`로 묶인다.
- $$E \to E.*E$$도 상태에 있어 `*`를 이동할 수 있다. 이동하면 `id + (id * id)`로 묶인다.

둘 다 조건에 맞으니 이동-환원 충돌이다. 우리가 바라는 것은 곱셈을 먼저 묶는 쪽, 곧 이동이다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "When $$E + E\vert * id$$, reduce will be selected because $$* \in Follow(E)$$" (7회 슬라이드 p.47) / 문제점: 같은 슬라이드 p.37의 규칙으로는 환원 조건과 이동 조건이 둘 다 맞는다. 환원이 "선택되는" 것이 아니라 한 칸에 이동과 환원이 함께 들어가 충돌한다 / 수정안: "$$* \in Follow(E)$$라서 환원도 할 수 있고, `*`로 가는 전이가 있어 이동도 할 수 있다. 충돌이다" / 근거: 이 문법의 SLR 표를 만들면 $$E \to E + E.$$이 든 상태의 `*` 칸에 이동과 환원이 함께 들어가고, 충돌 칸은 모두 4개다([26_slr-parsing_impl.py](/Hongs_Blog/studies/compilers/code/26_slr-parsing_impl/)).

</div>


**푸는 법: 우선순위 선언.** "`*`가 `+`보다 우선순위가 높다"고 따로 알려 준다. `*`와 `+` 사이에서 충돌이 나면 `*`에 관한 일을 한다[^7]. <code>E + E&#124;* id</code>에서는 `*`를 이동한다. 그 결과 `id + id * id`는 `id + (id * id)`로 묶인다.

우선순위가 같은 연산자끼리(<code>E + E&#124;+ id</code>)는 선언만으로 정해지지 않는다. 왼쪽부터 묶으려면 환원을 고른다[^s2].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3에서 "$$X$$ 바로 뒤에 $$b$$가 온다"가 FOLLOW의 뜻과 이어지는 이유</summary>

$$\text{Follow}(X)$$는 시작 기호에서 유도되는 문자열 가운데 $$X$$ 바로 오른쪽에 나타날 수 있는 터미널을 모은 것이다. $$\alpha X b\omega$$가 그런 문자열이니 $$b$$가 그 안에 든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4에서 대우를 쓰는 이유</summary>

1~3은 "환원이 옳으면 $$b \in \text{Follow}(X)$$"를 보였다. 파서에 필요한 것은 "$$b \notin \text{Follow}(X)$$이면 환원하지 않아도 된다"이고, 이것이 앞 문장의 대우다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 상태 3에서 다음 토큰이 `)`일 때 이동-환원 충돌이 없는 이유</summary>

상태 3에서 나가는 전이는 `*` 하나뿐이라 `)`로는 이동할 수 없다. `)`는 Follow(E)에 있으므로 $$E \to T$$ 환원 하나만 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법의 핵심 아이디어는?</summary>

환원은 논터미널 하나를 만들어 낸다. 그 논터미널 뒤에 올 수 없는 토큰이 기다리고 있으면 그 환원은 헛일이다. 헛일을 미리 걸러 낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

[LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)에서 빈 문자열로 가는 규칙을 어느 칸에 넣을지 정할 때도 FOLLOW를 쓴다. "이 논터미널이 끝난 뒤 올 수 있는 토큰"을 보고 결정한다는 점이 같다.

</details>


### 복잡도

위 의사코드는 걸음마다 왼쪽 부분을 처음부터 다시 읽는다. 왼쪽 부분의 길이는 입력 길이 $$n$$까지 자랄 수 있으니 전체가 $$n^2$$에 비례할 수 있다. 상태를 스택에 쌓아 두면 다시 읽지 않아도 된다([SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/))[^s2].

## 활용

- 구현: [26_slr-parsing_impl.py](/Hongs_Blog/studies/compilers/code/26_slr-parsing_impl/)
- 결정을 미리 다 계산해 표로 적어 둔 것이 [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)다.
- 알아보는 신호: 한 상태에 "점이 끝난 항목"과 "점 뒤에 터미널이 있는 항목"이 함께 있으면 충돌 후보다. 점이 끝난 항목의 왼쪽 기호의 FOLLOW와 그 터미널이 겹치는지 본다.
- yacc와 bison 같은 파서 생성기는 `%left '+'`, `%left '*'`처럼 뒤에 적은 줄일수록 우선순위가 높게 연산자를 선언받아 이동-환원 충돌을 푼다[^s3].

## 연결

- 선수: [LR(0) 항목과 항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/), [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/), [핸들](/Hongs_Blog/studies/compilers/parse-handle/)
- 표와 스택으로 구현: [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/), [SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/)
- 위에서 내려오는 방식과 견주기: [LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"SLR 표에 충돌이 남으면 그 문법은 모호한 문법이다"</div>

틀렸다. 모호한 문법은 늘 충돌을 남기지만, 충돌이 남는다고 모호한 것은 아니다. 문법 $$S \to L = R \mid R$$, $$L \to *R \mid id$$, $$R \to L$$은 모호하지 않다. 길이 8 이하의 모든 토큰열에서 파스 트리가 많아야 하나다. 그런데 SLR 표를 만들면 $$S \to L.=R$$과 $$R \to L.$$이 함께 든 상태의 `=` 칸에 이동과 환원이 겹친다. `=`가 Follow(R)에 들어 있기 때문이다(`* R = …` 꼴에서 `R` 뒤에 `=`가 온다). 그럴듯해 보이는 이유는 슬라이드가 충돌의 예로 모호한 문법만 들기 때문이다. 실제로는 FOLLOW가 "문법 어딘가"만 보는 거친 기준이라, 모호하지 않은 문법도 걸린다. 확인하는 법: 이 문법의 SLR 표를 만들어 충돌 칸을 세고, 짧은 토큰열 전부에서 파스 트리 수를 센다[^s4].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** SLR 파싱에서 환원하는 조건과 이동하는 조건을 쓰라.</summary>

**답:** DFA가 왼쪽 부분을 읽고 상태 $$q_i$$에 닿았고 다음 토큰이 $$b$$일 때, $$q_i$$에 $$X \to \beta.$$이 있고 $$b \in \text{Follow}(X)$$이면 $$X \to \beta$$로 환원한다. $$q_i$$에서 $$b$$로 가는 전이가 있으면 이동한다. 둘 다 아니면 오류다.<br>
**이유:** LR(0)와 다른 곳은 "$$b \in \text{Follow}(X)$$" 하나다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 강의의 문법과 DFA로 `id * id $`를 SLR 파싱하라. 줄마다 왼쪽 부분, 닿은 상태, 한 일을 쓰라.</summary>

**답:** (빈 문자열, 1, 이동) → (`id`, 5, $$T \to id$$) → (`T`, 3, 이동) → (`T *`, 6, 이동) → (`T * id`, 5, $$T \to id$$) → (`T * T`, 3, $$E \to T$$) → (`T * E`, 8, $$E \to T * E$$) → (`E`, 2, 받아들임).<br>
**이유:** 셋째 줄의 다음 토큰은 `*`이고 Follow(E)에 없어 이동한다. 여섯째 줄의 다음 토큰은 `$`이고 Follow(E)에 있어 환원한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 "q에 X → β. 이 있고 b ∈ Follow(X) 이면" 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 규칙의 오른쪽을 다 봤더라도, 다음 토큰이 환원으로 생길 논터미널 뒤에 올 수 있는 것일 때만 환원한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** <code>( T&#124;* id )</code>에서 LR(0)는 못 정하고 SLR은 정하는 이유를 말하라.</summary>

**답:** 상태 3에 $$E \to T.*E$$와 $$E \to T.$$이 함께 있어 LR(0)로는 이동과 환원이 둘 다 맞다. SLR은 다음 토큰 `*`가 Follow(E) = {`)`, `$`}에 없음을 보고 환원을 뺀다. 이동만 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** FOLLOW를 봐도 이동-환원 충돌이 남는 문법과 상황을 하나 들라.</summary>

**답:** $$E \to E + E \mid E * E \mid id$$에서 <code>E + E&#124;* id</code>. $$E \to E + E.$$이 있고 `*`가 Follow(E) = {`+`, `*`, `$`}에 있어 환원할 수 있고, $$E \to E.*E$$가 있어 `*`를 이동할 수도 있다.<br>
**이유:** 이 문법은 모호해서 `id + id * id`의 파스 트리가 둘이다. 두 선택이 두 트리로 이어진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C6** 우선순위를 "`*`가 `+`보다 높다"로 선언하고 같은 우선순위에서는 환원을 고른다. `id * id + id`와 `id + id + id`는 각각 어떻게 묶이는가?</summary>

**답:** `(id * id) + id`와 `(id + id) + id`.<br>
**이유:** <code>E * E&#124;+ id</code>에서 스택 쪽 연산자 `*`가 다음 토큰 `+`보다 높으므로 환원한다. <code>E + E&#124;+ id</code>는 우선순위가 같아 환원한다[^s2].

</details>


[^1]: 컴파일러 7회 강의 자료 「Lecture07 Syntax analysis part 4」, p.32~33 (DFA로 하는 LR(0) 파싱의 규칙)
[^2]: 같은 자료, p.36 (<code>( T&#124;* id )</code>에서 이동과 환원이 충돌한다)
[^3]: 같은 자료, p.37~38 (SLR의 환원 조건, `*`가 Follow(E) = {`)`, `$`}에 없어 이동한다), p.40 (Follow(T) = {`*`, `)`, `$`})
[^4]: 컴파일러 8회 강의 자료 「Lecture08 Syntax analysis part 5」, p.3~5 (SLR 파싱의 두 걸음과 <code>( T&#124;* id )</code>의 예)
[^5]: 컴파일러 7회 강의 자료 「Lecture07 Syntax analysis part 4」, p.46 (<code>E&#124;$</code>에서 환원하고 받아들인다). 슬라이드는 규칙을 "$$S \to E$$"로 적었는데 덧붙인 규칙 $$S' \to E$$를 뜻한다.
[^6]: 같은 자료, p.33~46 (`( id * id )`를 한 걸음씩 파싱하는 그림). 슬라이드는 상태를 색칠한 그림으로 보이고, 표의 상태 번호는 8회 슬라이드 p.7의 번호다.
[^7]: 같은 자료, p.47 (충돌이 남으면 SLR 문법이 아니다, 모호한 문법의 예, 우선순위 선언)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> LR(0)의 0과 SLR의 S가 무슨 뜻인지는 슬라이드에 없다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 4.6 "Introduction to LR Parsing: Simple LR".
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 입출력과 의사코드, 추적 표에 상태 번호와 다음 토큰을 나란히 적은 것, 정확성 주장과 증명, FOLLOW가 필요조건일 뿐이라는 설명, 같은 우선순위에서 환원을 고르는 규칙, 스스로 설명해 보기, 복잡도, 카드 C3·C5·C6은 원본에 없다. 추적과 카드의 답은 구현 코드로 확인했다(우선순위로 푼 결과 `id+(id*id)`, `(id*id)+id`, `(id+id)+id`). 근거: 같은 책 4.6.4, 4.8.1.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본에 없다. 근거: GNU Bison 설명서 "Operator Precedence" 절.
[^s4]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본에 없는 예다. 근거: 같은 책 예제 4.48(SLR이 아닌데 모호하지 않은 문법). 충돌 1칸과 파스 트리 수를 [26_slr-parsing_impl.py](/Hongs_Blog/studies/compilers/code/26_slr-parsing_impl/)로 확인했다.
{% endraw %}
