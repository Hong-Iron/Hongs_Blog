---
layout: "note"
title: "문법 고치기 예제 사다리"
display_title: "문법 고치기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "15"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 좌재귀 없애기, 좌인수분해."
prev_url: "/studies/compilers/subset-construction-ladder/"
prev_title: "부분집합 구성법 예제 사다리"
next_url: "/studies/compilers/first-follow-ladder/"
next_title: "FIRST·FOLLOW 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/grammar-rewriting-ladder/"
---
{% raw %}
사용 개념: [좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/), [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/).

"이 문법을 위에서 내려가는 파서가 읽을 수 있게 고쳐라"는 문제는 같은 하위목표의 되풀이다[^s1].

① *좌재귀 찾기:* 오른쪽 첫 기호가 왼쪽과 같은 규칙을 찾아 $$A \to A\alpha \mid \beta$$로 가른다.
② *우재귀로 고치기:* $$A \to \beta A'$$, $$\ A' \to \alpha A' \mid \epsilon$$.
③ *공통 접두사 찾기:* 한 비단말 기호의 규칙 가운데 같은 기호로 시작하는 것들을 찾는다.
④ *좌인수분해:* $$A \to \alpha A''$$, $$\ A'' \to$$ (뒷부분들). 뒷부분이 없으면 $$\epsilon$$.
⑤ *확인:* 짧은 문자열 하나를 원래 문법과 고친 문법에서 모두 만들어 본다.

## 문제 1 · 완전한 풀이

슬라이드의 연습이다. $$DECL \to DECL\ type\ id\ ; \mid DECL\ type\ id = id\ ; \mid \epsilon$$ (모호하지 않은 문법이다)[^1].

이 문법은 `int a; int b = c;`처럼 선언을 0개 이상 늘어놓은 것을 만든다.

1. *좌재귀 찾기:* 앞의 두 규칙이 $$DECL$$로 시작한다. $$\alpha_1 = type\ id\ ;$$, $$\ \alpha_2 = type\ id = id\ ;$$이고 $$\beta = \epsilon$$이다.
2. *우재귀로 고치기:* $$DECL \to \epsilon\,A$$, $$\ A \to type\ id\ ;\ A \mid type\ id = id\ ;\ A \mid \epsilon$$. $$DECL \to A$$뿐이라 $$A$$를 $$DECL$$로 합쳐 쓴다.

   $$DECL \to type\ id\ ;\ DECL \mid type\ id = id\ ;\ DECL \mid \epsilon$$

3. *공통 접두사 찾기:* 앞의 두 규칙이 $$type\ id$$로 시작한다. 가장 긴 공통 접두사는 $$type\ id$$다.
4. *좌인수분해:*

   $$DECL \to type\ id\ DECL' \mid \epsilon \qquad DECL' \to ;\ DECL \mid = id\ ;\ DECL$$

5. *확인:* $$type\ id\ ;\ type\ id = id\ ;$$를 만든다. $$DECL \Rightarrow type\ id\ DECL' \Rightarrow type\ id\ ;\ DECL \Rightarrow type\ id\ ;\ type\ id\ DECL' \Rightarrow type\ id\ ;\ type\ id = id\ ;\ DECL \Rightarrow type\ id\ ;\ type\ id = id\ ;$$

고친 문법은 다음 토큰 하나로 규칙이 정해진다. $$DECL$$은 $$type$$이면 첫 규칙, 아니면 $$\epsilon$$이다. $$DECL'$$은 `;`이면 첫 규칙, `=`이면 둘째 규칙이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 원래 문법과 단계마다의 문법이 길이 12 이하에서 같은 문자열을 만들고, 마지막 문법만 LL(1) 표에 겹치는 칸이 없다 — [15_grammar-rewriting-ladder_p4.py](/Hongs_Blog/studies/compilers/code/15_grammar-rewriting-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$E \to E + T \mid T$$, $$\ T \to id \mid id\,(\,)$$

1. *좌재귀 찾기:* $$E \to E + T$$. $$\alpha = +\,T$$, $$\beta = T$$.
2. *우재귀로 고치기:* $$E \to T\,E'$$, $$\ E' \to +\,T\,E' \mid \epsilon$$.
3. *공통 접두사 찾기:* $$T$$의 두 규칙이 $$id$$로 시작한다.
4. *좌인수분해:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$T \to id\ T'$$, $$\ T' \to (\,) \mid \epsilon$$. 전체 문법은 $$E \to TE'$$, $$E' \to +TE' \mid \epsilon$$, $$T \to id\,T'$$, $$T' \to (\,) \mid \epsilon$$이다.<br>
확인: $$id + id\,(\,)$$는 $$E \Rightarrow TE' \Rightarrow id\,T'E' \Rightarrow id\,E' \Rightarrow id + TE' \Rightarrow id + id\,T'E' \Rightarrow id + id\,(\,)E' \Rightarrow id + id\,(\,)$$.<br>
$$T \to id$$의 뒷부분이 없으므로 $$T' \to \epsilon$$을 넣어야 한다. 이것을 빠뜨리면 괄호 없는 $$id$$를 만들 수 없다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

\$$S \to S\ ;\ a \mid a\,b \mid a\,c$$

1. *좌재귀 찾기:* ______
2. *우재귀로 고치기:* $$S \to a\,b\,S' \mid a\,c\,S'$$, $$\ S' \to ;\ a\,S' \mid \epsilon$$.
3. *공통 접두사 찾기:* ______
4. *좌인수분해:* $$S \to a\,S''$$, $$\ S'' \to b\,S' \mid c\,S'$$, $$\ S' \to ;\ a\,S' \mid \epsilon$$.
5. *확인:* ______ ($$a\,c\ ;\ a$$를 고친 문법에서 만들어라)

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$S \to S\ ;\ a$$가 좌재귀다. $$\alpha = ;\ a$$이고, $$S$$로 시작하지 않는 규칙이 둘이라 $$\beta_1 = a\,b$$, $$\beta_2 = a\,c$$다.
3. $$S$$의 두 규칙 $$a\,b\,S'$$와 $$a\,c\,S'$$가 $$a$$로 시작한다. 공통 접두사는 $$a$$ 하나다(둘째 기호가 $$b$$와 $$c$$로 다르다).
5. $$S \Rightarrow a\,S'' \Rightarrow a\,c\,S' \Rightarrow a\,c\ ;\ a\,S' \Rightarrow a\,c\ ;\ a$$.

좌재귀를 없애면서 $$\beta$$가 둘이라 공통 접두사가 새로 드러났다. 좌재귀를 먼저 없애는 까닭이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 2, 3의 고친 문법이 원래 문법과 같은 문자열을 만들고 LL(1) 표에 겹치는 칸이 없다 — [15_grammar-rewriting-ladder_p4.py](/Hongs_Blog/studies/compilers/code/15_grammar-rewriting-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

논리식 문법이다. 위에서 내려가는 파서가 다음 토큰 하나로 읽을 수 있게 고쳐라.

$$B \to B\ or\ C \mid C \qquad C \to C\ and\ D \mid D \qquad D \to not\ D \mid id \mid id\,(\,)$$


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\begin{aligned} B &\to C\,B' & B' &\to or\ C\,B' \mid \epsilon\\ C &\to D\,C' & C' &\to and\ D\,C' \mid \epsilon\\ D &\to not\ D \mid id\,D' & D' &\to (\,) \mid \epsilon \end{aligned}$$

$$B$$와 $$C$$는 좌재귀다($$\alpha$$는 각각 $$or\ C$$, $$and\ D$$). $$D$$의 $$not\ D$$는 자기 자신이 오른쪽 끝에 있어 좌재귀가 아니다. $$D$$의 $$id$$와 $$id\,(\,)$$가 공통 접두사 $$id$$를 가져 좌인수분해한다.<br>
고친 문법은 원래와 같은 문자열을 만들고 LL(1) 표에 겹치는 칸이 없다. 좌인수분해만 하고 좌재귀를 남겨 두면 표가 여전히 겹친다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [15_grammar-rewriting-ladder_p4.py](/Hongs_Blog/studies/compilers/code/15_grammar-rewriting-ladder_p4/)</div>

</div>


[^1]: 컴파일러 4회 강의 자료 「Lecture04 Syntax analysis part 1」, p.47 (DECL 문법을 우재귀와 좌인수분해로 고쳐 쓰는 연습)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.47은 문제 1의 문법과 두 단계의 이름만 적고 풀이는 비워 두었다. 문제 1의 풀이와 문제 2~4는 보탠 것이다. 슬라이드 p.43의 좌재귀 없애기 절차와 p.45의 좌인수분해 절차를 따랐고, 고친 문법이 원래 문법과 같은 문자열을 만드는 것과 LL(1) 표에 겹치는 칸이 없는 것을 문제 코드로 확인했다.
{% endraw %}
