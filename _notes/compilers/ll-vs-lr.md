---
layout: "note"
title: "LL 파싱과 LR 파싱 비교"
display_title: "LL 파싱과 LR 파싱 비교"
kind: "concept"
kind_label: "비교"
num: "29"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["LL vs LR", "Top-down vs Bottom-up Parsing", "하향식 파싱과 상향식 파싱", "LL(1)과 SLR 비교"]
description: "둘 다 토큰열을 왼쪽에서 오른쪽으로 한 번 읽으며 파스 트리를 만든다. 가르는 질문은 \"어느 규칙을 쓸지를 언제 정하는가\"다. LL은 규칙의 오른쪽을 보기 전에 다음 토큰 하나로 정한다. LR은 규칙의 오른쪽을 다 본 뒤에 정한다. 이 차이가 트리를 쌓는 방향, 받아 주는 문법의 …"
prev_url: "/studies/compilers/slr-stack-parser/"
prev_title: "SLR 파서의 스택 동작"
next_url: "/studies/compilers/semantic-analysis/"
next_title: "의미 분석"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/ll-vs-lr/"
---
{% raw %}
둘 다 토큰열을 왼쪽에서 오른쪽으로 한 번 읽으며 파스 트리를 만든다. 가르는 질문은 "어느 규칙을 쓸지를 언제 정하는가"다. LL은 규칙의 오른쪽을 보기 **전에** 다음 토큰 하나로 정한다. LR은 규칙의 오른쪽을 **다 본 뒤에** 정한다. 이 차이가 트리를 쌓는 방향, 받아 주는 문법의 넓이, 손으로 짜기 쉬운 정도를 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 문법 $$E \to E + T \mid T$$, $$T \to id$$를 고치지 않고 그대로 쓰고 싶다. (나) 작은 설정 파일 언어의 파서를 도구 없이 손으로 빨리 짜고 싶다. 어느 쪽인가?</summary>

**답:** (가) LR. 이 문법은 왼쪽 기호가 자기 오른쪽의 맨 앞에 다시 나온다(좌재귀). LL은 `E`를 펼치려고 다시 `E`를 펼치게 되어 쓸 수 없고, LL(1) 표에서는 (E, `id`) 칸에 두 규칙이 겹친다. SLR 표에는 충돌이 없다. (나) LL. 재귀 하강 파서는 이해하기 쉽고 손으로 짜기 쉽다[^1].<br>
**이유:** (가)에서 LL을 쓰려면 먼저 [좌재귀를 없애야](/Hongs_Blog/studies/compilers/left-recursion-elimination/) 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (다) 문법 $$E \to T + E \mid T$$, $$T \to F * T \mid F$$, $$F \to (E) \mid id$$를 고치지 않고 쓴다. (라) 파서가 쓴 규칙을 순서대로 적었더니 `id * id`에 대해 $$F \to id$$가 맨 먼저, $$E \to T$$가 맨 나중에 나왔다. 각각 어느 쪽인가?</summary>

**답:** (다) LR. $$E \to T + E$$와 $$E \to T$$는 둘 다 `T`로 시작해 다음 토큰 하나로는 가를 수 없다. LL(1)로 쓰려면 [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)가 필요하다. SLR은 `T`를 다 본 뒤 다음 토큰이 `+`인지 보고 정하므로 그대로 된다. (라) LR. 잎에서 가까운 규칙부터 쓰고 시작 기호의 규칙을 맨 나중에 쓴다. LL이면 $$E \to T$$가 맨 먼저다.<br>
**이유:** (라)에서 LL의 순서는 $$E \to T$$, $$T \to F * T$$, $$F \to id$$, $$T \to F$$, $$F \to id$$이고 LR의 순서는 $$F \to id$$, $$F \to id$$, $$T \to F$$, $$T \to F * T$$, $$E \to T$$다.

</details>


## 결정적 차이

| | LL (위에서 아래로) | LR (아래에서 위로) |
|---|---|---|
| 트리를 쌓는 방향 | 뿌리(시작 기호)에서 잎으로[^2] | 잎(입력)에서 뿌리로[^3] |
| 만드는 유도 | 왼쪽 끝 유도를 순서대로[^2] | 오른쪽 끝 유도를 거꾸로(환원)[^3] |
| 이름의 뜻 | Left-to-right로 읽고 Leftmost 유도[^2] | Left-to-right로 읽고 Rightmost 유도를 거꾸로[^s1] |
| 규칙을 정하는 때 | 규칙의 오른쪽을 보기 전. 다음 토큰으로 미리 찍는다(예측)[^4] | 규칙의 오른쪽을 다 쌓은 뒤. 다음 토큰은 확인용으로만 본다 |
| 막히는 자리 | 어느 규칙으로 펼칠지[^5] | 이동할지 환원할지, 어느 규칙으로 환원할지[^6] |
| 문법에 바라는 것 | 모호하지 않다, 좌재귀가 없다, 좌인수분해가 되어 있다[^4] | 표에 충돌이 없다. 좌재귀와 같은 앞부분은 그대로 둬도 된다 |
| 표 | 줄 = 논터미널, 칸 = 쓸 규칙 | 줄 = 상태, 칸 = 이동·환원 |
| 스택에 든 것 | 앞으로 봐야 할 기호 | 지금까지 본 것을 읽은 상태 |
| 손으로 짜기 | 쉽다(재귀 하강)[^1] | 어렵다. 표를 도구로 만든다 |

선택을 가르는 줄은 "규칙을 정하는 때"다. 나머지 줄은 거기서 따라 나온다. 일찍 정해야 하니 LL은 문법을 손봐야 하고, 늦게 정해도 되니 LR은 더 많은 문법을 그대로 받는다. 대신 LR은 "다 본 것"을 기억할 상태가 많이 필요해 표가 크고 손으로 만들기 힘들다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: (다)의 문법은 LL(1) 표에 충돌이 있고 SLR 표에는 없음, 좌재귀 문법 $$E \to E + T \mid T$$, $$T \to id$$는 LL(1) 표의 (E, `id`) 칸이 겹치고 SLR 표에는 충돌이 없음, 좌인수분해한 문법은 LL(1)과 SLR 둘 다 충돌 없음, `id * id`에서 두 파서가 규칙을 쓰는 순서 — [29_ll-vs-lr_verify.py](/Hongs_Blog/studies/compilers/code/29_ll-vs-lr_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** LL(1)도 SLR도 그대로는 못 쓰는 문법의 예를 들고, 그때 할 수 있는 일 두 가지를 쓰라.</summary>

**답:** 모호한 문법 $$E \to E + E \mid E * E \mid id$$. LL은 모호하지 않은 문법을 바라고[^4], SLR 표에는 충돌이 남는다[^7]. 할 수 있는 일: ① 문법을 모호하지 않게 고쳐 쓴다([모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/)). ② 문법은 두고 "`*`가 `+`보다 우선순위가 높다"고 선언해 충돌 칸에서 고를 쪽을 정해 준다([SLR 파싱](/Hongs_Blog/studies/compilers/slr-parsing/))[^7].<br>
**이유:** 모호하지 않은데도 SLR 표에 충돌이 남는 문법도 있다. 그때는 다음 토큰을 FOLLOW보다 더 정밀하게 따지는 LR 방식(LALR(1), LR(1))을 쓴다[^s2].

</details>


[^1]: 컴파일러 5회 강의 자료 「Lecture05 Syntax analysis part 2」, p.17 (재귀 하강 파서의 장점: 이해하기 쉽고 손으로 구현하기 쉽다)
[^2]: 같은 자료, p.3~6 (위에서 아래로 가는 파싱, 왼쪽 끝 유도, LL의 두 글자의 뜻)
[^3]: 컴파일러 7회 강의 자료 「Lecture07 Syntax analysis part 4」, p.3~4 (아래에서 위로 가는 파싱, 오른쪽 끝 유도를 거꾸로)
[^4]: 컴파일러 5회 강의 자료 「Lecture05 Syntax analysis part 2」, p.18~19, p.46 (다음 토큰으로 규칙을 정하는 LL(1), 쓸 수 있는 문법의 세 조건)
[^5]: 같은 자료, p.7 (유도마다 어느 규칙을 골라야 하는가)
[^6]: 컴파일러 7회 강의 자료 「Lecture07 Syntax analysis part 4」, p.7~8, p.48 (이동-환원 충돌과 환원-환원 충돌)
[^7]: 같은 자료, p.47 (충돌이 남으면 SLR 문법이 아니다, 우선순위 선언)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> LR의 두 글자의 뜻, "규칙을 정하는 때"로 두 방식을 가른 것, 표와 스택을 나란히 견준 줄, LR이 좌재귀와 같은 앞부분을 그대로 받는다는 말, 카드 C1·C2의 문법별 판정은 원본에 없다. 슬라이드는 두 방식을 따로 설명한다. LL(1) 표와 SLR 표의 충돌을 코드로 세어 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 4.4, 4.5, 4.6.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> LALR(1)과 LR(1)은 이 강의 범위 밖이다. 근거: 같은 책 4.7 "More Powerful LR Parsers".
{% endraw %}
