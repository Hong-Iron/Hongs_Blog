---
layout: "note"
title: "좌인수분해"
display_title: "좌인수분해 (Left Factoring)"
kind: "concept"
kind_label: "기법"
num: "15"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Left Factoring", "좌인수분해", "왼쪽 인수분해", "공통 접두사", "Common Prefix"]
description: "한 이름에서 갈라지는 규칙 둘이 똑같은 조각으로 시작하면, 읽는 프로그램은 그 조각을 다 읽을 때까지 어느 규칙인지 알 수 없다. 갈림길 표지판이 두 길에 똑같이 붙어 있는 셈이다. 똑같은 앞부분을 한 번만 쓰도록 묶어 내고, 달라지는 뒷부분은 새 이름에 맡긴다. 그러면 고르는 일…"
prev_url: "/studies/compilers/left-recursion-elimination/"
prev_title: "좌재귀 없애기"
next_url: "/studies/compilers/abstract-syntax-tree/"
next_title: "추상 구문 트리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/left-factoring/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 이름에서 갈라지는 규칙 둘이 똑같은 조각으로 시작하면, 읽는 프로그램은 그 조각을 다 읽을 때까지 어느 규칙인지 알 수 없다. 갈림길 표지판이 두 길에 똑같이 붙어 있는 셈이다. 똑같은 앞부분을 한 번만 쓰도록 묶어 내고, 달라지는 뒷부분은 새 이름에 맡긴다. 그러면 고르는 일이 앞부분을 다 읽은 뒤로 미뤄진다. 문법이 만드는 문장은 그대로다.

</div>


## 예시로 보기

위에서 내려가는 파서는 비단말 기호를 펼칠 때 규칙을 하나 골라야 한다. 문법 $$E \to T + E \mid T$$에서 $$E$$를 펼칠 차례라고 하자. 두 규칙 모두 $$T$$로 시작한다. 다음 토큰이 $$id$$든 `(`든 두 규칙이 다 들어맞아 보인다. 어느 쪽인지는 $$T$$를 다 읽고 그 뒤에 $$+$$가 오는지 봐야 안다[^1].

찍어서 고르고 틀리면 되돌아가는 방법도 있다([재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)). 되돌아가지 않으려면 문법을 바꾼다.

$$E \to T + E \mid T \quad\Longrightarrow\quad E \to T\,E' \qquad E' \to +\,E \mid \epsilon$$


$$E$$의 규칙이 하나가 되어 고를 것이 없다. $$T$$를 읽고 나서 $$E'$$를 펼칠 때 비로소 고른다. 다음 토큰이 $$+$$면 $$+E$$이고, 아니면 $$\epsilon$$이다. 수식에서 $$ab + ac = a(b + c)$$로 공통인수를 묶어 내는 것과 같은 일이라 인수분해라는 이름이 붙었다. 다만 문법에서는 기호의 순서를 바꿀 수 없어서 앞부분이 같을 때만 묶는다. 두 규칙의 똑같은 앞부분 $$T$$를 공통 접두사라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 네 단계 절차를 코드로 옮겨 슬라이드의 결과와 같은 문법이 나오는 것, 변환 전후에 길이 9 이하의 문자열이 같은 것, 공통 접두사가 여러 겹일 때 되풀이해 끝내는 것 — [15_left-factoring_verify.py](/Hongs_Blog/studies/compilers/code/15_left-factoring_verify/)</div>

</div>


## 절차

한 비단말 기호의 규칙 가운데 같은 기호로 시작하는 것이 둘 이상 있으면 좌인수분해가 필요하다[^1]. 슬라이드의 절차는 네 단계다[^2].

1. 비단말 기호 $$A$$마다, 규칙들의 가장 긴 공통 접두사 $$\alpha$$를 찾는다.
2. $$A \to \alpha\beta$$ 꼴인 규칙을 모두 버리고, $$A \to \alpha A'$$를 넣는다. $$A'$$는 새 비단말 기호다.
3. 버린 규칙마다 뒷부분 $$\beta$$로 $$A' \to \beta$$를 넣는다. 뒷부분이 없던 규칙은 $$A' \to \epsilon$$이 된다.
4. 어떤 비단말 기호에도 공통 접두사가 남지 않을 때까지 1~3을 되풀이한다.

기호로 쓰면 다음과 같다. $$\gamma$$(감마)는 $$\alpha$$로 시작하지 않는 나머지 규칙들이다.

$$A \to \alpha\beta_1 \mid \alpha\beta_2 \mid \dots \mid \gamma \quad\Longrightarrow\quad A \to \alpha A' \mid \gamma \qquad A' \to \beta_1 \mid \beta_2 \mid \dots$$


**적용 조건과 신호.**

- 써야 하는 때: 다음 토큰 하나만 보고 규칙을 고르는 파서([LL(1)](/Hongs_Blog/studies/compilers/ll1-parsing-table/))를 쓸 때. 좋은 문법의 셋째 조건이 "비단말 기호마다, 어떤 입력 기호로 시작하는 규칙이 하나뿐"인 것이다[^3].
- 알아보는 신호: 한 비단말 기호의 규칙 둘이 같은 기호로 시작한다. `if … then …`과 `if … then … else …`, `id`와 `id()`처럼 "짧은 꼴과 거기에 뭔가 더 붙은 꼴"이 함께 있을 때 흔하다.

## 예제

**대표 문제 1: 산술식.** $$E \to T + E \mid T$$, $$\ T \to F * T \mid F$$, $$\ F \to (E) \mid id$$[^2]

1. *공통 접두사 찾기:* $$E$$의 두 규칙은 $$T$$로 시작한다. $$\alpha = T$$.
2. *앞부분 묶기:* $$E \to T\,E'$$
3. *뒷부분을 새 기호로:* $$T + E$$의 뒷부분은 $$+E$$, $$T$$의 뒷부분은 없다. $$E' \to +\,E \mid \epsilon$$
4. *되풀이:* $$T$$의 두 규칙은 $$F$$로 시작한다. 같은 방법으로 $$T \to F\,T'$$, $$\ T' \to *\,T \mid \epsilon$$. $$F$$의 두 규칙은 `(`와 $$id$$로 시작이 달라 그대로 둔다.

결과는 다음과 같다. 5회 강의의 LL(1) 예는 모두 이 문법을 쓴다.

$$E \to TE' \qquad E' \to +E \mid \epsilon \qquad T \to FT' \qquad T' \to *T \mid \epsilon \qquad F \to (E) \mid id$$


**대표 문제 2: 공통 접두사가 여러 겹.** $$A \to abc \mid abd \mid ae$$[^s1]

1. *공통 접두사 찾기:* 세 규칙이 모두 $$a$$로 시작한다. 셋 모두에 공통인 가장 긴 앞부분은 $$a$$다.
2. *묶기:* $$A \to aA'$$, $$\ A' \to bc \mid bd \mid e$$
3. *되풀이:* $$A'$$의 규칙 둘이 $$b$$로 시작한다. $$A' \to bA'' \mid e$$, $$\ A'' \to c \mid d$$

**경계 사례: 모호함은 그대로 남는다.** 매달린 else 문법 $$S \to if\ E\ then\ S \mid if\ E\ then\ S\ else\ S \mid other$$를 좌인수분해하면 $$S \to if\ E\ then\ S\ S' \mid other$$, $$\ S' \to else\ S \mid \epsilon$$이 된다. 공통 접두사는 사라졌지만 else가 어느 if의 것인지는 여전히 정해지지 않는다. 좌인수분해는 [모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/)을 고쳐 주지 않는다[^s2].

## 활용

- 좋은 문법의 세 조건은 "모호하지 않다, 좌재귀가 없다, 다음 입력 기호 하나로 규칙이 정해진다"이다. 첫째는 약속을 정해 손으로 고쳐야 해서 쉽지 않고, 둘째와 셋째는 정해진 절차([좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/), 좌인수분해)로 쉽게 고친다[^3].
- **순서.** 좌재귀를 먼저 없애고 좌인수분해를 한다. 슬라이드의 연습 문제 $$DECL \to DECL\ type\ id; \mid DECL\ type\ id = id; \mid \epsilon$$도 그 순서로 풀게 한다[^4]. 풀이는 [문법 고치기 예제 사다리](/Hongs_Blog/studies/compilers/grammar-rewriting-ladder/)의 문제 1에 있다.
- **이것만으로 충분한가.** 좌인수분해를 마쳐도 LL(1) 표에 충돌이 남을 수 있다. 빈 문자열이 되는 규칙이 있으면 "그 기호 뒤에 올 수 있는 토큰"과도 겹치지 않아야 한다([FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/)). 최종 판정은 [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)를 만들어 한 칸에 규칙이 둘 든 곳이 없는지로 한다[^s2].
- **흔한 실수.** 뒷부분이 없는 규칙에서 $$A' \to \epsilon$$을 빠뜨린다. 가장 긴 접두사가 아니라 첫 기호 하나만 묶고 되풀이를 멈춘다.

## 연결

- 선수: [좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/)
- 되돌아가기로 버티는 길: [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/). 되돌아가기를 없애는 길: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$S \to id \mid id\,(\,)\mid id\,(\,L\,)$$를 좌인수분해하라.</summary>

**답:** $$S \to id\ S'$$, $$\ S' \to \epsilon \mid (\ S''$$, $$\ S'' \to\ ) \mid L\ )$$.<br>
**이유:** 세 규칙 모두의 공통 접두사는 $$id$$다. 묶고 나면 $$S'$$의 규칙 둘이 `(`로 시작하므로 한 번 더 묶는다. $$S' \to \epsilon \mid (\,) \mid (\,L\,)$$에서 멈추면 `(`가 겹친 채 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$E \to T + E \mid T$$를 다음 토큰 하나만 보는 파서가 읽지 못하는 까닭과, 좌인수분해가 이것을 어떻게 푸는지 쓰라.</summary>

**답:** 두 규칙이 모두 $$T$$로 시작해서, $$E$$를 펼치는 순간에는 다음 토큰이 무엇이든 두 규칙이 다 맞아 보인다. 좌인수분해는 $$E \to TE'$$로 고를 일을 없애고, 고르는 시점을 $$T$$를 다 읽은 뒤로 미룬다. 그때는 다음 토큰이 $$+$$인지 아닌지로 $$E' \to +E$$와 $$E' \to \epsilon$$을 가를 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 문법에 필요한 것은 좌재귀 없애기인가, 좌인수분해인가, 둘 다인가? (가) $$A \to Ab \mid c$$ (나) $$A \to bA \mid bc$$ (다) $$A \to Ab \mid Ac \mid d$$</summary>

**답:** (가) 좌재귀 없애기. (나) 좌인수분해. (다) 좌재귀 없애기.<br>
**이유:** (다)의 두 규칙은 $$A$$로 시작해 공통 접두사가 있어 보이지만, 그 첫 기호가 자기 자신이라 좌재귀다. 좌재귀를 없애면 $$A \to dA'$$, $$A' \to bA' \mid cA' \mid \epsilon$$이 되고 공통 접두사도 함께 사라진다. 좌재귀를 먼저 보는 까닭이다[^s1].

</details>


[^1]: 컴파일러 4회 강의 자료 「Lecture04 Syntax analysis part 1」, p.44 (같은 입력 기호로 시작하는 규칙이 둘 이상이면 어느 것을 고르나)
[^2]: 같은 자료, p.45 (좌인수분해의 네 단계와 결과)
[^3]: 같은 자료, p.34, p.46 (좋은 문법의 세 조건)
[^4]: 같은 자료, p.47 (DECL 문법을 고쳐 쓰는 연습)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 대표 문제 2와 카드 C1·C3는 원본에 없다. 대표 문제 2는 검증 코드로 결과와 언어가 같음을 확인했다. C3 (다)의 결과는 [14_left-recursion-elimination_verify.py](/Hongs_Blog/studies/compilers/code/14_left-recursion-elimination_verify/)의 일반 꼴과 같은 절차다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 좌인수분해가 모호함을 없애지 못한다는 점과 좌인수분해만으로는 LL(1)이 보장되지 않는다는 점은 원본에 없다. 좌인수분해한 매달린 else 문법의 LL(1) 표에서 한 칸에 규칙이 둘 드는 것을 [20_ll1-parsing-table_impl.py](/Hongs_Blog/studies/compilers/code/20_ll1-parsing-table_impl/)로 확인했다.
{% endraw %}
