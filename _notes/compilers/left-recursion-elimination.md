---
layout: "note"
title: "좌재귀 없애기"
display_title: "좌재귀 없애기 (Left Recursion Elimination)"
kind: "concept"
kind_label: "기법"
num: "14"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Left Recursion", "좌재귀", "왼쪽 재귀", "Left Recursion Elimination", "좌재귀 제거", "Right Recursion", "우재귀", "간접 좌재귀", "Indirect Left Recursion"]
description: "규칙의 맨 앞에서 자기 자신을 다시 부르는 문법은, 왼쪽부터 차례로 풀어 가며 읽는 프로그램을 제자리에서 끝없이 맴돌게 만든다. 입력을 한 글자도 읽지 않은 채 같은 규칙만 되풀이해 펼치기 때문이다. 자기 자신을 부르는 자리를 규칙의 맨 뒤로 옮기도록 문법을 바꿔 쓰면 고쳐진다. …"
prev_url: "/studies/compilers/ambiguous-grammar/"
prev_title: "모호한 문법"
next_url: "/studies/compilers/left-factoring/"
next_title: "좌인수분해"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/left-recursion-elimination/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

규칙의 맨 앞에서 자기 자신을 다시 부르는 문법은, 왼쪽부터 차례로 풀어 가며 읽는 프로그램을 제자리에서 끝없이 맴돌게 만든다. 입력을 한 글자도 읽지 않은 채 같은 규칙만 되풀이해 펼치기 때문이다. 자기 자신을 부르는 자리를 규칙의 맨 뒤로 옮기도록 문법을 바꿔 쓰면 고쳐진다. 바꾼 문법은 원래와 똑같은 문장들을 만들지만 나무가 기우는 방향은 달라진다.

</div>


## 예시로 보기

문법 $$S \to Sa \mid b$$가 만드는 문자열은 $$b$$, $$ba$$, $$baa$$, …다. $$b$$ 하나 뒤에 $$a$$가 몇 개 붙는다.

위에서 내려가는 파서는 가장 왼쪽 비단말 기호부터 바꾼다([좌측 유도](/Hongs_Blog/studies/compilers/derivation-parse-tree/)). 이 문법에서 첫 규칙을 따라가 본다[^1].

$$S \Rightarrow_{lm} Sa \Rightarrow_{lm} Saa \Rightarrow_{lm} Saaa \Rightarrow_{lm} \cdots$$


가장 왼쪽은 늘 $$S$$다. 파서는 입력과 견줄 단말 기호를 맨 앞에서 한 번도 만나지 못한다. 그래서 규칙을 잘못 골랐다는 것을 알아챌 기회가 없고, $$S$$를 펼치는 일만 끝없이 되풀이한다. 규칙의 맨 왼쪽에 자기 자신이 오는 이런 꼴을 좌재귀라 부른다.

같은 문자열들을 이렇게도 만들 수 있다[^2].

$$S \to bA \qquad A \to aA \mid \epsilon$$


$$S$$는 먼저 $$b$$를 내놓고 나머지를 $$A$$에 맡긴다. $$A$$는 $$a$$를 하나 내놓고 자기 자신을 다시 부르거나, 아무것도 내놓지 않고 끝난다. 이제 규칙을 펼칠 때마다 맨 앞에 단말 기호가 하나씩 나와 입력과 견줄 수 있다. 자기 자신을 부르는 자리가 규칙의 맨 오른쪽으로 갔으므로 우재귀라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$S \to Sa \mid b$$와 $$S \to bA$$, $$A \to aA \mid \epsilon$$이 길이 9 이하에서 같은 문자열을 만드는 것, 일반 꼴 변환, 간접 좌재귀 판정, 좌재귀 문법에서 첫 규칙만 따라가면 입력을 못 읽은 채 200번 넘게 내려가는 것 — [14_left-recursion-elimination_verify.py](/Hongs_Blog/studies/compilers/code/14_left-recursion-elimination_verify/)</div>

</div>


## 정의

어떤 비단말 기호 $$A$$에서 한 걸음 이상 유도해 다시 $$A$$로 시작하는 모양이 나오면 그 문법은 좌재귀다[^1].

$$A \Rightarrow^+ A\alpha$$


$$\Rightarrow^+$$는 유도를 한 걸음 이상 했다는 뜻이고, $$\alpha$$는 단말·비단말 기호를 늘어놓은 것이다.

**고치는 절차.** 좌재귀가 있는 비단말 기호 $$S$$의 규칙을 두 무리로 가른다. $$S$$로 시작하는 규칙들 $$S \to S\alpha_1 \mid \dots \mid S\alpha_m$$과 $$S$$로 시작하지 않는 규칙들 $$S \to \beta_1 \mid \dots \mid \beta_n$$이다[^2].

1. 새 비단말 기호 $$A$$를 만든다. $$\alpha_i$$마다 규칙 $$A \to \alpha_i A$$를 넣고, $$A \to \epsilon$$도 넣는다.
2. $$S$$의 규칙을 모두 버리고, $$\beta_i$$마다 $$S \to \beta_i A$$를 넣는다.

$$S \to S\alpha_1 \mid \dots \mid S\alpha_m \mid \beta_1 \mid \dots \mid \beta_n \quad\Longrightarrow\quad \begin{aligned} S &\to \beta_1 A \mid \dots \mid \beta_n A\\ A &\to \alpha_1 A \mid \dots \mid \alpha_m A \mid \epsilon \end{aligned}$$


왜 같은 문자열이 나오는지는 원래 문법이 만드는 모양을 보면 안다. 좌재귀 규칙을 몇 번 쓰든 마지막에는 $$S \to \beta_j$$로 끝나야 하므로, 만들어지는 것은 늘 "$$\beta$$ 하나 뒤에 $$\alpha$$가 0개 이상"이다. 새 문법은 그 모양을 앞에서부터 적은 것이다. $$S$$가 $$\beta$$를 먼저 내놓고, $$A$$가 $$\alpha$$를 하나씩 붙이다가 $$\epsilon$$으로 끝낸다[^s1].

**적용 조건과 신호.**

- 써야 하는 때: 위에서 내려가는 파서(재귀 하강, LL(1))를 쓸 때. 좋은 문법의 둘째 조건이 좌재귀가 없는 것이다[^3].
- 알아보는 신호: 규칙 오른쪽의 첫 기호가 왼쪽과 같다($$E \to E + T$$). 목록이나 왼쪽부터 묶는 연산을 적은 규칙에 흔하다.
- $$\beta$$가 하나도 없으면(모든 규칙이 $$S$$로 시작하면) $$S$$는 끝나는 문자열을 만들지 못한다. 그런 문법은 고칠 것이 아니라 잘못 쓴 것이다[^s1].

## 예제

**대표 문제 1: 덧셈 식.** $$E \to E + T \mid T$$

1. *무리 가르기:* $$E$$로 시작하는 규칙은 $$E + T$$ 하나이고 $$\alpha = +\,T$$다. 나머지는 $$T$$ 하나이고 $$\beta = T$$다.
2. *새 기호의 규칙:* $$E' \to +\,T\,E' \mid \epsilon$$
3. *원래 기호의 규칙:* $$E \to T\,E'$$
4. *확인:* $$T + T + T$$를 만들어 본다. $$E \Rightarrow TE' \Rightarrow T + TE' \Rightarrow T + T + TE' \Rightarrow T + T + T$$.

**대표 문제 2: 돌아서 오는 좌재귀.** 슬라이드가 묻는다. $$S \to Aa \mid b$$, $$A \to Sb$$는 좌재귀 문법인가[^1]?

좌재귀다. 규칙만 보면 오른쪽 첫 기호가 왼쪽과 같은 것이 없다. 하지만 두 걸음을 가면 $$S \Rightarrow Aa \Rightarrow Sba$$로 $$S$$가 다시 맨 앞에 온다. 정의가 "한 걸음 이상"이라서 이것도 좌재귀이고, 간접 좌재귀라 부른다[^s2].

1. *직접 좌재귀로 바꾸기:* $$S \to Aa$$의 $$A$$ 자리에 $$A$$의 규칙 오른쪽 $$Sb$$를 넣는다. $$S \to Sba \mid b$$.
2. *무리 가르기:* $$\alpha = ba$$, $$\beta = b$$.
3. *고치기:* $$S \to bS'$$, $$\ S' \to baS' \mid \epsilon$$.

**경계 사례.** 우재귀 문법 $$E \to T + E \mid T$$는 좌재귀가 아니다. 오른쪽 첫 기호 $$T$$에서 유도해도 $$E$$가 맨 앞에 오지 않는다. 고칠 필요가 없다.

## 활용

- **왜 위에서 내려가는 파서만 문제인가.** 좌측 유도를 따라가며 가장 왼쪽 비단말 기호를 먼저 펼치기 때문이다[^1]. 아래에서 올라가는 파서([이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/))는 입력을 먼저 읽고 나서 묶으므로 좌재귀 문법을 그대로 읽는다[^s3].
- **나무가 바뀐다.** $$E \to E + T \mid T$$는 $$T + T + T$$를 $$(T + T) + T$$로 왼쪽부터 묶는다. 고친 문법의 나무는 오른쪽으로 기운다. 문자열은 같아도 묶이는 모양이 달라지므로, 뺄셈처럼 묶는 순서가 값을 바꾸는 연산은 [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)를 만들 때 왼쪽부터 묶이도록 따로 손봐야 한다[^s3].
- **흔한 실수.** $$A \to \epsilon$$을 빠뜨린다. 그러면 $$A$$가 끝나지 않아 문자열이 하나도 나오지 않는다. 또 $$\beta$$ 뒤에 $$A$$를 붙이는 것을 잊어 $$S \to \beta$$로 남겨 둔다.
- 좌재귀를 없앤 뒤에는 같은 기호로 시작하는 규칙이 남았는지 보고 [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)를 한다. 두 가지를 이어서 하는 연습은 [문법 고치기 예제 사다리](/Hongs_Blog/studies/compilers/grammar-rewriting-ladder/)에 있다.

## 연결

- 선수: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)(좌측 유도)
- 좋은 문법의 세 조건 가운데 나머지 둘: [모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/), [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)
- 좌재귀 문법에서 실제로 끝나지 않는 모습: [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)
- 끝나지 않는 재귀의 일반적인 모습: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/). 재귀할 때마다 문제가 작아져야 끝나는데, 좌재귀는 입력을 줄이지 않고 자기 자신을 부른다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$L \to L\ ,\ id \mid id$$의 좌재귀를 없애라.</summary>

**답:** $$L \to id\ L'$$, $$\ L' \to ,\ id\ L' \mid \epsilon$$.<br>
**이유:** $$\alpha = ,\ id$$이고 $$\beta = id$$다. 흔한 오답은 $$L' \to ,\ id\ L'$$만 쓰고 $$\epsilon$$을 빠뜨리는 것이다. 그러면 목록이 끝나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 위에서 내려가는 파서가 좌재귀 문법 $$S \to Sa \mid b$$에서 끝나지 않는 까닭은?</summary>

**답:** 가장 왼쪽 비단말 기호부터 펼치는데, $$S \to Sa$$를 쓰면 가장 왼쪽이 다시 $$S$$다. 맨 앞에 단말 기호가 나오지 않아 입력과 견줄 수 없고 입력도 줄지 않는다. 같은 상태에서 같은 규칙을 끝없이 다시 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 가운데 좌재귀 문법을 모두 고르라. (가) $$E \to T + E \mid T$$, $$T \to id$$ (나) $$A \to Bc \mid d$$, $$B \to Ae$$ (다) $$S \to aSb \mid \epsilon$$</summary>

**답:** (나)만 좌재귀다. $$A \Rightarrow Bc \Rightarrow Aec$$로 $$A$$가 다시 맨 앞에 온다.<br>
**이유:** (가)는 자기 자신이 오른쪽 끝에 있다. (다)는 $$S$$ 앞에 단말 기호 $$a$$가 있어 펼칠 때마다 입력을 하나 읽는다. 규칙 한 줄만 봐서는 (나)를 놓친다. 첫 기호를 따라 한 걸음 더 유도해 본다[^s2].

</details>


[^1]: 컴파일러 4회 강의 자료 「Lecture04 Syntax analysis part 1」, p.42 (좌재귀의 정의, 끝없는 반복, 간접 좌재귀를 묻는 질문)
[^2]: 같은 자료, p.43 (우재귀로 다시 쓰기, 두 단계 절차)
[^3]: 같은 자료, p.34, p.46 (좋은 문법의 조건, 우재귀로 쉽게 고친다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 바꾼 문법이 같은 문자열을 만드는 이유와 $$\beta$$가 없는 경우의 설명은 원본에 없다. 일반 꼴($$\alpha$$ 둘, $$\beta$$ 둘)과 덧셈 식에서 변환 전후의 언어가 같음을 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.42는 질문만 남겼다. 답(간접 좌재귀다)과 고치는 과정, 카드 C3는 보탠 것이다. '맨 왼쪽에 올 수 있다' 관계를 따라가 자기 자신으로 돌아오는지 보는 코드로 판정했고, 고친 문법이 같은 언어를 만드는 것도 확인했다(Aho 외, *Compilers* 2판 4.3.3절).
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 상향식 파서는 좌재귀를 그대로 읽는다는 점과 나무가 기우는 방향이 바뀐다는 점은 원본 4회 슬라이드에 없다(Aho 외, *Compilers* 2판 4.3.3절, 4.5절).
{% endraw %}
