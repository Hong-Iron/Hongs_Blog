---
layout: "note"
title: "FIRST·FOLLOW 예제 사다리"
display_title: "FIRST·FOLLOW 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "19"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: FIRST 집합, FOLLOW 집합."
prev_url: "/studies/compilers/grammar-rewriting-ladder/"
prev_title: "문법 고치기 예제 사다리"
next_url: "/studies/compilers/ll1-table-ladder/"
next_title: "LL(1) 파싱 표 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/first-follow-ladder/"
---
{% raw %}
사용 개념: [FIRST 집합](/Hongs_Blog/studies/compilers/first-set/), [FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/).

"이 문법의 FIRST와 FOLLOW를 구하라"는 문제는 같은 하위목표의 되풀이다[^s1].

① *사라질 수 있는 기호 찾기:* 빈 문자열이 될 수 있는 비단말 기호를 먼저 표시한다.
② *FIRST:* 다른 비단말 기호에 기대지 않는 것부터 구한다. 규칙 오른쪽은 왼쪽 기호부터 보고, 사라질 수 있는 기호를 지나면 다음 기호까지 본다. $$\epsilon$$은 모두 사라질 수 있을 때만 넣는다.
③ *FOLLOW 준비:* 시작 기호에 $$\$$$를 넣고, 비단말 기호마다 규칙 오른쪽에 나오는 자리를 모두 찾는다.
④ *FOLLOW:* 자리마다 바로 뒤 기호열 $$\beta$$의 FIRST에서 $$\epsilon$$을 뺀 것을 넣는다. $$\beta$$가 비었거나 사라질 수 있으면 그 규칙 왼쪽 기호의 FOLLOW도 넣는다.

FOLLOW의 세 규칙을 ① 시작 기호에 $$\$$$ ② 뒤 기호열의 FIRST ③ 왼쪽 기호의 FOLLOW 물려받기로 부른다.

## 문제 1 · 완전한 풀이

$$S \to (\,L\,) \mid a$$, $$\ L \to S\,L'$$, $$\ L' \to ,\ S\,L' \mid \epsilon$$ (괄호로 묶은 목록)

1. *사라질 수 있는 기호 찾기:* $$L'$$뿐이다($$L' \to \epsilon$$). $$S$$는 `(`나 $$a$$를 꼭 내놓고, $$L$$은 $$S$$로 시작하므로 사라질 수 없다.
2. *FIRST:*
    - $$First(S) = First((L)) \cup First(a) = \{(,\ a\}$$
    - $$First(L') = First(,SL') \cup First(\epsilon) = \{,\ ,\ \epsilon\}$$ (쉼표와 $$\epsilon$$)
    - $$First(L) = First(SL') = First(S) = \{(,\ a\}$$. $$S$$가 사라질 수 없어 $$L'$$까지 가지 않는다.
3. *FOLLOW 준비:* $$S$$는 시작 기호이고 $$L \to SL'$$, $$L' \to ,SL'$$에 나온다. $$L$$은 $$S \to (L)$$에 나온다. $$L'$$는 $$L \to SL'$$, $$L' \to ,SL'$$의 맨 끝에 나온다.
4. *FOLLOW:*
    - $$Follow(L)$$: $$S \to (L)$$에서 뒤가 `)`. $$\{)\}$$
    - $$Follow(L')$$: $$L \to SL'$$에서 맨 끝이라 $$Follow(L)$$을 물려받는다. $$L' \to ,SL'$$에서는 자기 자신의 FOLLOW라 늘 것이 없다. $$\{)\}$$
    - $$Follow(S)$$: 시작 기호라 $\$$. 두 자리 모두 뒤가 $L'$이므로 $First(L') - \{\epsilon\} = \{,\}$를 넣는다. $L'$가 사라질 수 있으므로 $Follow(L)$과 $Follow(L')$도 넣는다. $\{\$,\ ,\ ,\ )\}$ ($\$$, 쉼표, 닫는 괄호)

| | FIRST | FOLLOW |
|---|---|---|
| $$S$$ | `(`, $$a$$ | $$\$$$, `,`, `)` |
| $$L$$ | `(`, $$a$$ | `)` |
| $$L'$$ | `,`, $$\epsilon$$ | `)` |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [19_first-follow-ladder_p4.py](/Hongs_Blog/studies/compilers/code/19_first-follow-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$S \to A\,B$$, $$\ A \to a\,A \mid \epsilon$$, $$\ B \to b\,B \mid c$$

1. *사라질 수 있는 기호 찾기:* $$A$$뿐이다. $$B$$는 $$b$$나 $$c$$를 꼭 내놓는다.
2. *FIRST:* $$First(A) = \{a, \epsilon\}$$, $$First(B) = \{b, c\}$$. $$First(S) = First(AB)$$는 $$First(A)$$에서 $$\epsilon$$을 뺀 $$\{a\}$$에, $$A$$가 사라질 수 있으니 $$First(B) = \{b, c\}$$를 더한 $$\{a, b, c\}$$다. $$B$$가 사라질 수 없어 $$\epsilon$$은 없다.
3. *FOLLOW 준비:* $$S$$는 시작 기호이고 어느 규칙 오른쪽에도 없다. $$A$$는 $$S \to AB$$(뒤가 $$B$$)와 $$A \to aA$$(맨 끝)에 나온다. $$B$$는 $$S \to AB$$(맨 끝)와 $$B \to bB$$(맨 끝)에 나온다.
4. *FOLLOW:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$Follow(S) = \{\$\}$$.<br>
$$Follow(A)$$: $$S \to AB$$에서 뒤가 $$B$$이므로 $$First(B) = \{b, c\}$$. $$B$$가 사라질 수 없어 $$Follow(S)$$는 물려받지 않는다. $$A \to aA$$는 자기 자신의 FOLLOW라 늘 것이 없다. $$Follow(A) = \{b, c\}$$.<br>
$$Follow(B)$$: $$S \to AB$$의 맨 끝이라 $$Follow(S) = \{\$\}$$를 물려받는다. $$Follow(B) = \{\$\}$$.<br>
흔한 오답은 $$Follow(A)$$에 $$\$$$를 넣는 것이다. $$A$$ 뒤의 $$B$$는 사라지지 않으므로 $$A$$가 문장의 맨 끝에 올 일이 없다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$S \to a\,B\,D\,h$$, $$\ B \to c\,C$$, $$\ C \to b\,C \mid \epsilon$$, $$\ D \to E\,F$$, $$\ E \to g \mid \epsilon$$, $$\ F \to f \mid \epsilon$$

1. *사라질 수 있는 기호 찾기:* ______
2. *FIRST:* $$First(S) = \{a\}$$, $$First(B) = \{c\}$$, $$First(C) = \{b, \epsilon\}$$, $$First(E) = \{g, \epsilon\}$$, $$First(F) = \{f, \epsilon\}$$, $$First(D) = $$ ______
3. *FOLLOW 준비:* $$B$$와 $$D$$는 $$S \to aBDh$$에, $$C$$는 $$B \to cC$$와 $$C \to bC$$의 맨 끝에, $$E$$와 $$F$$는 $$D \to EF$$에 나온다.
4. *FOLLOW:* $$Follow(S) = \{\$\}$$, $$Follow(D) = \{h\}$$, $$Follow(F) = \{h\}$$, $$Follow(E) = \{f, h\}$$, $$Follow(B) = $$ ______, $$Follow(C) = $$ ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$C$$, $$E$$, $$F$$가 $$\epsilon$$ 규칙을 가진다. $$D \to EF$$는 $$E$$와 $$F$$가 모두 사라질 수 있으므로 $$D$$도 사라질 수 있다. 그래서 $$C$$, $$D$$, $$E$$, $$F$$ 넷이다.
2. $$First(D) = First(EF) = \{g\} \cup \{f\} \cup \{\epsilon\} = \{g, f, \epsilon\}$$. $$E$$가 사라질 수 있어 $$F$$까지 보고, 둘 다 사라질 수 있어 $$\epsilon$$을 넣는다.
4. $$Follow(B)$$: $$S \to aBDh$$에서 $$B$$ 뒤는 $$Dh$$다. $$First(Dh)$$는 $$First(D)$$에서 $$\epsilon$$을 뺀 $$\{g, f\}$$에, $$D$$가 사라질 수 있으니 $$h$$를 더한 $$\{g, f, h\}$$다. $$h$$는 단말 기호라 $$Dh$$는 사라질 수 없고, $$Follow(S)$$는 물려받지 않는다. $$Follow(B) = \{g, f, h\}$$.<br>
   $$Follow(C)$$: $$B \to cC$$의 맨 끝이라 $$Follow(B)$$를 물려받는다. $$Follow(C) = \{g, f, h\}$$.

$$Follow(E) = \{f, h\}$$인 까닭도 같다. $$E$$ 뒤의 $$F$$에서 $$f$$가 오고, $$F$$가 사라질 수 있어 $$Follow(D) = \{h\}$$를 물려받는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [19_first-follow-ladder_p4.py](/Hongs_Blog/studies/compilers/code/19_first-follow-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

$$S \to A\,B \mid c\,S\,d$$, $$\ A \to a\,A \mid \epsilon$$, $$\ B \to b \mid \epsilon$$의 모든 비단말 기호에 대해 FIRST와 FOLLOW를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

| | FIRST | FOLLOW |
|---|---|---|
| $$S$$ | $$a$$, $$b$$, $$c$$, $$\epsilon$$ | $$\$$$, $$d$$ |
| $$A$$ | $$a$$, $$\epsilon$$ | $$b$$, $$\$$$, $$d$$ |
| $$B$$ | $$b$$, $$\epsilon$$ | $$\$$$, $$d$$ |

$$A$$와 $$B$$가 모두 사라질 수 있어 $$First(AB) = \{a, b, \epsilon\}$$이고, 여기에 $$First(cSd) = \{c\}$$를 합친다. $$S$$ 자신도 사라질 수 있다.<br>
$$Follow(S)$$는 시작 기호의 $$\$$$와 $$S \to cSd$$에서 뒤에 오는 $$d$$다.<br>
$$Follow(A)$$는 $$S \to AB$$에서 $$First(B) - \{\epsilon\} = \{b\}$$를 받고, $$B$$가 사라질 수 있어 $$Follow(S) = \{\$, d\}$$도 물려받는다.<br>
$$Follow(B)$$는 $$S \to AB$$의 맨 끝이라 $$Follow(S)$$다.<br>
흔한 오답은 $$First(S)$$에서 $$\epsilon$$을 빠뜨리는 것과 $$Follow(A)$$에서 $$d$$를 빠뜨리는 것이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [19_first-follow-ladder_p4.py](/Hongs_Blog/studies/compilers/code/19_first-follow-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 풀이는 원본에 없다. 슬라이드 p.26~29의 정의와 계산 방식을 연습하도록 만들었고, 모든 답을 문제 코드로 확인했다. 문제 3의 문법은 컴파일러 교재 연습에 흔히 쓰이는 꼴이다.
{% endraw %}
