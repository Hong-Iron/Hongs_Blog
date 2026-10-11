---
layout: "note"
title: "LL(1) 파서의 스택 동작"
display_title: "LL(1) 파서의 스택 동작 (Implementation of LL(1) Parser)"
kind: "concept"
kind_label: "알고리즘"
num: "21"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["LL(1) Parser", "LL(1) 파서", "표 구동 파서", "Table-driven Parser", "예측 파서의 구현", "Nonrecursive Predictive Parser", "파싱 스택"]
description: "미리 만든 표를 보며 입력을 읽어 나가는 기계다. \"앞으로 맞춰야 할 것들\"을 접시 더미처럼 쌓아 두고 맨 위 것만 꺼내 본다. 꺼낸 것이 더 풀어야 할 이름이면 표에서 찾은 규칙의 조각들로 바꿔 쌓고, 낱말이면 입력의 다음 낱말과 견줘 같으면 한 칸 나아간다. 더미와 입력이 함께…"
prev_url: "/studies/compilers/ll1-parsing-table/"
prev_title: "LL(1) 파싱 표"
next_url: "/studies/compilers/shift-reduce-parsing/"
next_title: "이동-환원 파싱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/ll1-stack-parser/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

미리 만든 표를 보며 입력을 읽어 나가는 기계다. "앞으로 맞춰야 할 것들"을 접시 더미처럼 쌓아 두고 맨 위 것만 꺼내 본다. 꺼낸 것이 더 풀어야 할 이름이면 표에서 찾은 규칙의 조각들로 바꿔 쌓고, 낱말이면 입력의 다음 낱말과 견줘 같으면 한 칸 나아간다. 더미와 입력이 함께 바닥나면 올바른 문장이다. 한 번도 되돌아가지 않아 빠르지만, 표를 만들 수 있는 문법에서만 쓴다.

</div>


## 예시로 보기

[LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)가 있으면 "가장 왼쪽 비단말 기호와 다음 입력"으로 규칙을 찾을 수 있다. 남은 일은 "지금 가장 왼쪽 비단말 기호가 무엇인가"를 프로그램이 기억하는 것이다. 문장 형식에서 이미 입력과 맞춘 앞부분은 다시 볼 일이 없다. 아직 맞추지 않은 뒷부분만 왼쪽 것이 위로 오게 [스택](/Hongs_Blog/studies/algorithms/stack/)에 쌓아 두면, 맨 위가 늘 다음에 다룰 기호다.

문법 $$E \to TE'$$, $$\ E' \to +E \mid \epsilon$$, $$\ T \to FT'$$, $$\ T' \to *T \mid \epsilon$$, $$\ F \to (E) \mid id$$로 입력 $$id * id\ \$$$를 읽는다. 표는 다음과 같다[^1].

| | $$+$$ | $$*$$ | `(` | `)` | $$id$$ | $$\$$$ |
|---|---|---|---|---|---|---|
| $$E$$ | | | $$TE'$$ | | $$TE'$$ | |
| $$E'$$ | $$+E$$ | | | $$\epsilon$$ | | $$\epsilon$$ |
| $$T$$ | | | $$FT'$$ | | $$FT'$$ | |
| $$T'$$ | $$\epsilon$$ | $$*T$$ | | $$\epsilon$$ | | $$\epsilon$$ |
| $$F$$ | | | $$(E)$$ | | $$id$$ | |

스택은 맨 위를 왼쪽에 적는다. 처음에 끝 표시 $$\$$$와 시작 기호 $$E$$를 넣는다[^2].

| 걸음 | 스택 (맨 위가 왼쪽) | 남은 입력 | 꺼낸 것 | 한 일 |
|---|---|---|---|---|
| 1 | $$E\ \0 | $$E$ | $$[E, id] = TE'$$. $$T$$, $$E'$$를 넣는다 |
| 2 | $$T\ E'\ \0 | $$T$ | $$[T, id] = FT'$$ |
| 3 | $$F\ T'\ E'\ \0 | $$F$ | $$[F, id] = id$$ |
| 4 | $$id\ T'\ E'\ \0 | $$id$ | 입력과 같다. 입력을 한 칸 나아간다 |
| 5 | $$T'\ E'\ \0 | $$T'$ | $$[T', *] = *T$$ |
| 6 | $$*\ T\ E'\ \0 | $$*$ | 입력과 같다. 한 칸 나아간다 |
| 7 | $$T\ E'\ \0 | $$T$ | $$[T, id] = FT'$$ |
| 8 | $$F\ T'\ E'\ \0 | $$F$ | $$[F, id] = id$$ |
| 9 | $$id\ T'\ E'\ \0 | $$id$ | 입력과 같다. 한 칸 나아간다 |
| 10 | $$T'\ E'\ \0 | $$T'$ | $$[T', \$] = \epsilon$$. 아무것도 넣지 않는다 |
| 11 | $$E'\ \0 | $$E'$ | $$[E', \$] = \epsilon$$ |
| 12 | $$\0 | $$\$$ | 입력도 $\$$다. 받아들인다 |

열두 걸음 동안 남은 입력은 줄기만 했다. 되돌아간 적이 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 열두 줄이 슬라이드 p.33~45의 스택 그림과 같은 것, 적용한 규칙을 이으면 좌측 유도가 되는 것, 길이 6 이하의 모든 입력 19,531개에서 문법의 언어와 같은 답을 내는 것, 틀린 입력에서 멈추는 자리 — [21_ll1-stack-parser_impl.py](/Hongs_Blog/studies/compilers/code/21_ll1-stack-parser_impl/)</div>

</div>


## 알고리즘

**입출력.** 입력은 LL(1) 파싱 표 $$M$$, 시작 기호 $$S$$, 끝에 $$\$$$를 붙인 토큰열이다. 출력은 받아들임 또는 오류다. 받아들일 때는 쓴 규칙의 차례가 곧 좌측 유도다.

**동작**[^2].

1. 스택에 끝 표시 $$\$$$와 시작 기호를 차례로 넣는다. 시작 기호가 맨 위다.
2. 스택 맨 위를 꺼낸다.
    - 비단말 기호 $$A$$면: 다음 입력 $$a$$로 $$M[A, a]$$를 찾아, 그 규칙 오른쪽의 기호들을 스택에 넣는다.
    - 단말 기호면: 지금 입력 토큰과 견준다. 같으면 입력 포인터를 한 칸 옮긴다.
3. 입력을 모두 맞추거나 어긋남(오류)이 생길 때까지 2를 되풀이한다.

```
스택 ← [$, S]            (S가 맨 위)
되풀이:
    X ← 스택에서 꺼낸다
    a ← 지금 입력 토큰
    X가 비단말 기호:
        M[X, a]가 빈칸이면 오류
        M[X, a] = Y1 Y2 … Yk 이면 Yk, …, Y2, Y1 순서로 넣는다   (Y1이 맨 위에 오게)
    X가 단말 기호 또는 $:
        X ≠ a 이면 오류
        X = a = $ 이면 받아들이고 끝낸다
        아니면 입력을 한 칸 나아간다
```

규칙 오른쪽을 거꾸로 넣는 까닭은 스택이 나중에 넣은 것을 먼저 꺼내기 때문이다. $$Y_1$$을 마지막에 넣어야 맨 위에 오고, 그래야 가장 왼쪽 기호부터 다루게 된다. $$\epsilon$$ 규칙이면 넣을 것이 없으니 꺼내기만 한다[^s1].

**스택이 뜻하는 것.** 걸음마다 "이미 읽은 입력 + 스택의 내용(위에서 아래로, $$\$$$ 빼고)"이 좌측 유도의 문장 형식이다. 걸음 5를 보면 읽은 입력이 $$id$$, 스택이 $$T'E'$$이고 이어 붙인 $$id\,T'E'$$는 $$E \Rightarrow_{lm} TE' \Rightarrow_{lm} FT'E' \Rightarrow_{lm} id\,T'E'$$의 마지막 모양이다. 위 추적에서 쓴 규칙만 차례로 이으면 다음 좌측 유도가 된다[^s1].

$$E \Rightarrow TE' \Rightarrow FT'E' \Rightarrow id\,T'E' \Rightarrow id * TE' \Rightarrow id * FT'E' \Rightarrow id * id\,T'E' \Rightarrow id * id\,E' \Rightarrow id * id$$


### 복잡도

LL(1) 문법에는 좌재귀가 없어서 입력을 읽지 않은 채 비단말 기호만 끝없이 펼치는 일이 없다. 걸음마다 표의 칸 하나를 찾고 스택에 기호 몇 개를 넣거나 뺄 뿐이라, 전체 걸음 수는 입력 길이에 비례한다. 위 문법에서는 받아들인 모든 입력(길이 6 이하)에서 걸음 수가 $$7n + 5$$를 넘지 않았다($$n$$은 토큰 수)[^s2]. [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/)이 괄호 한 겹마다 4배씩 일이 늘던 것과 견줘 보면 차이가 크다.

## 예제

**오류가 나는 자리**[^s2].

| 입력 | 멈추는 걸음 | 스택 | 남은 입력 | 까닭 |
|---|---|---|---|---|
| $$id\ +\ \0 | $$\$$ | $$[E, \$]$$가 빈칸. $$+$$ 뒤에 식이 없다 |
| $$id\ id\ \0 | $$id\ \$$ | $$[T', id]$$가 빈칸. 연산자 없이 $$id$$가 이어졌다 |
| $$(\ id\ \0 | $$\$$ | 스택 맨 위는 `)`인데 입력은 $\$$. 괄호를 닫지 않았다 |
| $$id\ *\ +\ id\ \0 | $$+\ id\ \$$ | $$[T, +]$$가 빈칸. $$*$$ 뒤에 바로 $$+$$가 왔다 |

오류는 두 가지 꼴이다. 비단말 기호를 꺼냈는데 표가 빈칸이거나, 단말 기호를 꺼냈는데 입력과 다르다. 어느 쪽이든 틀린 토큰을 처음 만난 자리에서 바로 멈춘다.

**경계 사례.** 빈 입력 $$\$$$는 첫 걸음에서 $$[E, \$]$$가 빈칸이라 오류다. 이 문법은 빈 식을 허락하지 않는다.

## 활용

- **예측 파싱 정리.** 되돌아가기가 필요 없는 재귀 하강 파싱이다. 쓸 수 있는 조건은 문법이 모호하지 않고, 좌재귀가 없고, 좌인수분해되어 있는 것이다. 하는 일은 둘이다. ① 문법에서 FIRST, FOLLOW로 LL(1) 파싱 표를 만든다. ② 입력을 표와 스택으로 읽는다[^3].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.46 "Summary: Predictive parsing" 아래 소제목 "Conditions for using recursive descent parsers" / 문제점: 이 쪽은 예측 파싱의 정리이고, 그 아래 세 조건의 마지막이 "A CFG must be left factored"다. 재귀 하강 파서의 조건은 p.17에서 "Left factoring is not needed"였다. 소제목만 재귀 하강으로 적혀 있다. / 수정안: "Conditions for using predictive parsers" / 근거: 같은 세 조건을 처음 적은 p.19의 소제목이 "Conditions for using predictive parsers"다.

</div>


- **재귀 함수로도 짠다.** 비단말 기호마다 함수를 두고 다음 토큰으로 `if`/`switch`를 갈라 규칙을 고르면, 함수 호출 스택이 여기의 스택 노릇을 한다. 표와 스택을 직접 두는 쪽은 문법이 바뀌어도 표만 갈아 끼우면 된다[^s3].
- **파스 트리 짓기.** 비단말 기호를 꺼내 규칙을 쓸 때마다 그 노드 아래에 자식을 단다. 뿌리에서 잎 쪽으로 자란다. 규칙에 [의미 동작](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)을 붙여 두면 AST가 함께 지어진다.
- **흔한 실수.** 규칙 오른쪽을 적힌 순서대로 넣어 맨 오른쪽 기호가 위로 온다. $$\epsilon$$ 규칙에서 스택에 $$\epsilon$$을 넣는다. 단말 기호를 꺼냈을 때 입력을 나아가지 않는다. 비단말 기호를 펼칠 때 입력을 나아간다(펼칠 때는 입력을 보기만 한다).

## 연결

- 선수: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/), [스택](/Hongs_Blog/studies/algorithms/stack/)
- 이 기계가 찾는 것: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)의 좌측 유도
- 상향식의 스택 기계: [SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/). 저쪽 스택은 "이미 읽은 것"을 쌓고, 이쪽 스택은 "앞으로 읽을 것"을 쌓는다. 견주기는 [LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)에 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 같은 문법과 표로 입력 $$id + id\ \$$$를 읽는다. 첫 $$id$$를 맞춘 직후부터 $$+$$를 맞출 때까지의 스택과 한 일을 쓰라.</summary>

**답:** 스택 $$T'\ E'\ \0: $$[T', +] = \epsilon$$이라 $$T'$$를 꺼내기만 한다. 스택 $$E'\ \$$: $[E', +] = +E$이라 $+$, $E$를 넣는다. 스택 $+\ E\ \$$: $$+$$가 입력과 같아 한 칸 나아간다. 이제 스택 $E\ \$$, 입력 $id\ \$$다.<br>
**이유:** 전체는 14걸음이다. $$T'$$를 $$\epsilon$$으로 지우는 칸 $$[T', +]$$는 $$Follow(T')$$로 채운 칸이다. $$[T', +]$$를 빈칸으로 보고 오류라 하기 쉽다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 의사코드에서 "Yk, …, Y2, Y1 순서로 넣는다"가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 규칙 오른쪽의 가장 왼쪽 기호 $$Y_1$$이 스택 맨 위에 오게 해서, 다음 걸음에 가장 왼쪽 기호부터 다루도록(좌측 유도가 되도록) 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 스택 맨 위가 단말 기호일 때는 표를 찾지 않는다. 왜 그래도 되는가?</summary>

**답:** 표는 "어느 규칙으로 펼칠까"를 정하는 것인데 단말 기호는 펼칠 규칙이 없다. 할 수 있는 일은 입력의 지금 토큰과 같은지 견주는 것뿐이다. 같으면 그 토큰을 맞춘 것이고 다르면 오류다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 문법 $$S \to aSb \mid \epsilon$$ (표: $$[S, a] = aSb$$, $$[S, b] = \epsilon$$, $$[S, \$] = \epsilon$$)으로 $$a\,a\,b\,b\,\$$$를 읽을 때의 스택 변화를 쓰고, 여기서 쓴 규칙들을 좌측 유도로 옮겨라.</summary>

**답:** 스택: $$S\ \0 → $$S\ b\ \$$ → $a\ S\ b\ b\ \$$ → $$S\ b\ b\ \2 → $$b\ \$$ → $\$$ (받아들임). 좌측 유도: $$S \Rightarrow aSb \Rightarrow aaSbb \Rightarrow aabb$$.<br>
**이유:** 걸음마다 "읽은 입력 + 스택"이 문장 형식이다. 예를 들어 $$a$$를 하나 읽고 스택이 $$S\ b$$일 때 이어 붙이면 $$aSb$$다[^s2].

</details>


[^1]: 컴파일러 5회 강의 자료 「Lecture05 Syntax analysis part 2」, p.20, p.33 (파싱 표)
[^2]: 같은 자료, p.33~45 (스택으로 $$id * id\ \$$$ 읽기, 1단계와 2단계)
[^3]: 같은 자료, p.19, p.46 (예측 파싱의 조건과 하는 일)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 의사코드, 거꾸로 넣는 까닭, "읽은 입력 + 스택 = 문장 형식"이라는 설명과 이어 쓴 좌측 유도는 원본에 글로 없다. 슬라이드의 스택 그림을 옮겨 적은 것이고, 구현 코드에서 추적 표의 규칙으로 좌측 유도를 다시 만들어 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 오류 예 넷, 걸음 수 한도 $$7n + 5$$, 카드 C1·C4는 원본에 없다. 구현 코드로 확인했다. 걸음 수 한도는 이 문법에서 길이 6 이하의 입력을 모두 돌려 본 실험값이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 재귀 함수로 짜는 방법과의 관계는 원본에 없다(Aho 외, *Compilers* 2판 4.4.1절, 4.4.4절).
{% endraw %}
