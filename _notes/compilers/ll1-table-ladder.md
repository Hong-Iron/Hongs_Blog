---
layout: "note"
title: "LL(1) 파싱 표 예제 사다리"
display_title: "LL(1) 파싱 표 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "20"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: LL(1) 파싱 표. FIRST와 FOLLOW를 구하는 연습은 FIRST·FOLLOW 예제 사다리에 있고, 문제 1~3은 그 문서와 같은 문법을 쓴다."
prev_url: "/studies/compilers/first-follow-ladder/"
prev_title: "FIRST·FOLLOW 예제 사다리"
next_url: "/studies/compilers/slr-table-ladder/"
next_title: "SLR 파싱 표 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/ll1-table-ladder/"
---
{% raw %}
사용 개념: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/). FIRST와 FOLLOW를 구하는 연습은 [FIRST·FOLLOW 예제 사다리](/Hongs_Blog/studies/compilers/first-follow-ladder/)에 있고, 문제 1~3은 그 문서와 같은 문법을 쓴다.

"이 문법의 LL(1) 파싱 표를 만들어라"는 문제는 같은 하위목표의 되풀이다[^s1].

① *FIRST와 FOLLOW:* 모든 비단말 기호에 대해 구한다.
② *규칙 오른쪽의 FIRST:* 규칙 $$A \to \alpha$$마다 $$First(\alpha)$$를 구한다.
③ *FIRST 칸 채우기:* $$First(\alpha)$$의 단말 기호 $$x$$마다 $$[A, x]$$에 $$\alpha$$를 적는다.
④ *ε 규칙을 FOLLOW 칸에:* $$\epsilon \in First(\alpha)$$이면 $$Follow(A)$$의 $$x$$마다 $$[A, x]$$에 $$\alpha$$를 적는다.
⑤ *판정:* 한 칸에 규칙이 둘 든 곳이 있는지 본다. 없으면 LL(1) 문법이다.

## 문제 1 · 완전한 풀이

$$S \to (\,L\,) \mid a$$, $$\ L \to S\,L'$$, $$\ L' \to ,\ S\,L' \mid \epsilon$$

1. *FIRST와 FOLLOW:* $$First(S) = First(L) = \{(, a\}$$, $$First(L') = \{,\ ,\ \epsilon\}$$(쉼표와 $$\epsilon$$). $$Follow(S) = \{\$,\ ,\ ,\ )\}$$, $$Follow(L) = Follow(L') = \{)\}$$.
2. *규칙 오른쪽의 FIRST:*

| 규칙 | $$First(\alpha)$$ |
|---|---|
| $$S \to (L)$$ | `(` |
| $$S \to a$$ | $$a$$ |
| $$L \to SL'$$ | `(`, $$a$$ |
| $$L' \to ,SL'$$ | `,` |
| $$L' \to \epsilon$$ | $$\epsilon$$ |

{: start="3"}
3. *FIRST 칸 채우기:* 위 표대로 $$[S, (]$$, $$[S, a]$$, $$[L, (]$$, $$[L, a]$$, $$[L', ,]$$의 다섯 칸.
4. *ε 규칙을 FOLLOW 칸에:* $$L' \to \epsilon$$을 $$Follow(L') = \{)\}$$의 칸 $$[L', )]$$에 적는다.
5. *판정:* 겹치는 칸이 없다. LL(1) 문법이다.

| | `(` | `)` | `,` | $$a$$ | $$\$$$ |
|---|---|---|---|---|---|
| $$S$$ | $$(L)$$ | | | $$a$$ | |
| $$L$$ | $$SL'$$ | | | $$SL'$$ | |
| $$L'$$ | | $$\epsilon$$ | $$,SL'$$ | | |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [20_ll1-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/20_ll1-table-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$S \to A\,B$$, $$\ A \to a\,A \mid \epsilon$$, $$\ B \to b\,B \mid c$$

1. *FIRST와 FOLLOW:* $$First(S) = \{a, b, c\}$$, $$First(A) = \{a, \epsilon\}$$, $$First(B) = \{b, c\}$$. $$Follow(S) = \{\$\}$$, $$Follow(A) = \{b, c\}$$, $$Follow(B) = \{\$\}$$.
2. *규칙 오른쪽의 FIRST:* $$First(AB) = \{a, b, c\}$$, $$First(aA) = \{a\}$$, $$First(\epsilon) = \{\epsilon\}$$, $$First(bB) = \{b\}$$, $$First(c) = \{c\}$$.
3. *FIRST 칸 채우기:* $$[S, a] = [S, b] = [S, c] = AB$$, $$\ [A, a] = aA$$, $$\ [B, b] = bB$$, $$\ [B, c] = c$$.
4. *ε 규칙을 FOLLOW 칸에, 그리고 판정:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$A \to \epsilon$$을 $$Follow(A) = \{b, c\}$$의 두 칸 $$[A, b]$$, $$[A, c]$$에 적는다.

| | $$a$$ | $$b$$ | $$c$$ | $$\$$$ |
|---|---|---|---|---|
| $$S$$ | $$AB$$ | $$AB$$ | $$AB$$ | |
| $$A$$ | $$aA$$ | $$\epsilon$$ | $$\epsilon$$ | |
| $$B$$ | | $$bB$$ | $$c$$ | |

겹치는 칸이 없어 LL(1) 문법이다. $$\$$$ 열은 모두 빈칸이다. 이 문법의 문장은 반드시 $$c$$로 끝나므로, 무엇을 펼치려는 순간에 입력이 끝나 있으면 늘 오류다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$S \to a\,B\,D\,h$$, $$\ B \to c\,C$$, $$\ C \to b\,C \mid \epsilon$$, $$\ D \to E\,F$$, $$\ E \to g \mid \epsilon$$, $$\ F \to f \mid \epsilon$$

1. *FIRST와 FOLLOW:* $$First(D) = \{g, f, \epsilon\}$$, $$First(C) = \{b, \epsilon\}$$, $$First(E) = \{g, \epsilon\}$$, $$First(F) = \{f, \epsilon\}$$. $$Follow(C) = \{g, f, h\}$$, $$Follow(D) = \{h\}$$, $$Follow(E) = \{f, h\}$$, $$Follow(F) = \{h\}$$.
2. *규칙 오른쪽의 FIRST:* $$First(EF) = $$ ______. 나머지는 첫 기호가 단말 기호이거나 $$\epsilon$$이다.
3. *FIRST 칸 채우기:* $$[S, a] = aBDh$$, $$\ [B, c] = cC$$, $$\ [C, b] = bC$$, $$\ [E, g] = g$$, $$\ [F, f] = f$$, 그리고 $$D$$ 줄은 ______
4. *ε 규칙을 FOLLOW 칸에:* $$C \to \epsilon$$은 $$[C, g]$$, $$[C, f]$$, $$[C, h]$$에. $$E \to \epsilon$$은 ______. $$F \to \epsilon$$은 ______. $$D \to EF$$는 ______
5. *판정:* 겹치는 칸이 없다. LL(1) 문법이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$First(EF) = \{g, f, \epsilon\}$$. $$E$$가 사라질 수 있어 $$F$$까지 보고, 둘 다 사라질 수 있어 $$\epsilon$$이 든다.
3. $$[D, g] = EF$$, $$[D, f] = EF$$.
4. $$E \to \epsilon$$은 $$Follow(E) = \{f, h\}$$의 $$[E, f]$$, $$[E, h]$$에. $$F \to \epsilon$$은 $$Follow(F) = \{h\}$$의 $$[F, h]$$에. $$D \to EF$$도 $$\epsilon \in First(EF)$$이므로 $$Follow(D) = \{h\}$$의 $$[D, h]$$에 적는다.

| | $$a$$ | $$b$$ | $$c$$ | $$f$$ | $$g$$ | $$h$$ | $$\$$$ |
|---|---|---|---|---|---|---|---|
| $$S$$ | $$aBDh$$ | | | | | | |
| $$B$$ | | | $$cC$$ | | | | |
| $$C$$ | | $$bC$$ | | $$\epsilon$$ | $$\epsilon$$ | $$\epsilon$$ | |
| $$D$$ | | | | $$EF$$ | $$EF$$ | $$EF$$ | |
| $$E$$ | | | | $$\epsilon$$ | $$g$$ | $$\epsilon$$ | |
| $$F$$ | | | | $$f$$ | | $$\epsilon$$ | |

놓치기 쉬운 칸은 $$[D, h]$$다. 오른쪽이 $$\epsilon$$이라고 적힌 규칙만 FOLLOW 칸에 가는 것이 아니다. $$EF$$처럼 끝까지 풀면 빈 문자열이 될 수 있는 규칙도 간다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [20_ll1-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/20_ll1-table-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

if 문 문법을 좌인수분해한 것이다. $$i$$는 if, $$t$$는 then, $$e$$는 else, $$a$$는 다른 문장, $$b$$는 조건이다.

$$S \to i\,E\,t\,S\,S' \mid a \qquad S' \to e\,S \mid \epsilon \qquad E \to b$$


LL(1) 파싱 표를 만들고, LL(1) 문법인지 판정하라. 아니라면 까닭을 문법의 성질로 설명하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$First(S) = \{i, a\}$$, $$First(S') = \{e, \epsilon\}$$, $$First(E) = \{b\}$$. $$Follow(S) = \{\$, e\}$$, $$Follow(S') = \{\$, e\}$$, $$Follow(E) = \{t\}$$.

| | $$a$$ | $$b$$ | $$e$$ | $$i$$ | $$t$$ | $$\$$$ |
|---|---|---|---|---|---|---|
| $$S$$ | $$a$$ | | | $$iEtSS'$$ | | |
| $$S'$$ | | | $$eS$$ 와 $$\epsilon$$ | | | $$\epsilon$$ |
| $$E$$ | | $$b$$ | | | | |

$$[S', e]$$에 규칙이 둘 든다. $$S' \to eS$$는 $$First(eS) = \{e\}$$ 때문에, $$S' \to \epsilon$$은 $$e \in Follow(S')$$ 때문에 같은 칸에 간다. LL(1) 문법이 아니다.<br>
까닭은 문법이 모호해서다. $$i\,b\,t\,i\,b\,t\,a\,e\,a$$에서 $$e$$를 안쪽 if에 붙일 수도($$S' \to eS$$) 바깥 if에 붙이려고 안쪽을 끝낼 수도($$S' \to \epsilon$$) 있다. 좌인수분해는 공통 접두사만 없애고 이 모호함은 그대로 둔다.<br>
$$Follow(S)$$에 $$e$$가 드는 까닭: $$S \to iEtSS'$$에서 $$S$$ 뒤가 $$S'$$이고 $$First(S') - \{\epsilon\} = \{e\}$$다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [20_ll1-table-ladder_p4.py](/Hongs_Blog/studies/compilers/code/20_ll1-table-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 풀이는 원본에 없다. 슬라이드 p.30~32의 표 만들기 절차를 연습하도록 만들었고, 모든 표를 문제 코드로 확인했다. 문제 4의 문법은 4회 슬라이드 p.37의 매달린 else 문법을 좌인수분해한 것이다.
{% endraw %}
