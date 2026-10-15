---
layout: "note"
title: "SLR 파서의 스택 동작"
display_title: "SLR 파서의 스택 동작 (SLR Parser with a Stack)"
kind: "concept"
kind_label: "알고리즘"
num: "28"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["SLR Parser with Stack", "LR 파서 구동기", "LR Driver", "상태 스택", "State Stack", "스택 기반 SLR 파서"]
description: "미로를 걸으며 지나온 갈림길마다 번호표를 차례로 쌓아 두는 방식이다. 묶을 때는 묶는 기호 수만큼 번호표를 걷어 내고, 드러난 갈림길에서 새 길로 한 걸음 간다. 처음부터 다시 걸을 필요가 없어서 입력 길이에 비례하는 시간에 끝난다. 맨 위 번호표와 다음 토큰만 보고 표 한 칸을 …"
prev_url: "/studies/compilers/slr-parsing-table/"
prev_title: "SLR 파싱 표"
next_url: "/studies/compilers/ll-vs-lr/"
next_title: "LL 파싱과 LR 파싱 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/slr-stack-parser/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

미로를 걸으며 지나온 갈림길마다 번호표를 차례로 쌓아 두는 방식이다. 묶을 때는 묶는 기호 수만큼 번호표를 걷어 내고, 드러난 갈림길에서 새 길로 한 걸음 간다. 처음부터 다시 걸을 필요가 없어서 입력 길이에 비례하는 시간에 끝난다. 맨 위 번호표와 다음 토큰만 보고 표 한 칸을 찾으면 할 일이 정해진다. 표에 충돌이 없어야만 쓸 수 있다.

</div>


## 예시로 보기

[SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)가 있어도, 결정할 때마다 막대 왼쪽을 상태 1부터 다시 읽으면 느리다. <code>T * E&#124;$</code>에서 결정하려면 1 → 3 → 6 → 8을 다시 밟아야 한다. 결정할 때마다 DFA를 처음부터 다시 도는 것은 너무 비효율적이다.

그런데 방금 전 걸음에서 이미 1 → 3 → 6까지 와 있었다. 지나온 상태를 버리지 않고 쌓아 두면 다시 밟지 않아도 된다. 환원으로 끝자락 기호 몇 개가 사라지면, 그 기호들을 읽으며 지나온 상태도 그만큼 걷어 내면 된다. 끝에서 넣고 끝에서 빼니 [스택](/Hongs_Blog/studies/algorithms/stack/)이다.

입력 `id * id $`를 표와 스택으로 파싱한다. 규칙 번호는 (1) $$S' \to E$$, (2) $$E \to T * E$$, (3) $$E \to T$$, (4) $$T \to (E)$$, (5) $$T \to id$$다.

| 스택 (오른쪽이 맨 위) | 남은 입력 | 표의 칸 | 한 일 |
|---|---|---|---|
| 1 | `id * id $` | (1, `id`) = S5 | 5를 넣고 `id`를 넘긴다 |
| 1 5 | `* id $` | (5, `*`) = R(5) | $$T \to id$$: 1개 꺼냄 → 맨 위 1, GOTO(1, T) = 3을 넣는다 |
| 1 3 | `* id $` | (3, `*`) = S6 | 6을 넣고 `*`를 넘긴다 |
| 1 3 6 | `id $` | (6, `id`) = S5 | 5를 넣고 `id`를 넘긴다 |
| 1 3 6 5 | `$` | (5, `$`) = R(5) | $$T \to id$$: 1개 꺼냄 → 맨 위 6, GOTO(6, T) = 3 |
| 1 3 6 3 | `$` | (3, `$`) = R(3) | $$E \to T$$: 1개 꺼냄 → 맨 위 6, GOTO(6, E) = 8 |
| 1 3 6 8 | `$` | (8, `$`) = R(2) | $$E \to T * E$$: 3개 꺼냄 → 맨 위 1, GOTO(1, E) = 2 |
| 1 2 | `$` | (2, `$`) = R(1) | $$S' \to E$$: 받아들임 |

일곱째 줄을 보자. $$E \to T * E$$의 오른쪽은 기호 3개다. 그래서 스택에서 8, 6, 3 셋을 꺼낸다. 이 셋은 `T`, `*`, `E`를 읽으며 들어간 상태들이다. 꺼내고 나면 맨 위가 1이고, 상태 1에서 방금 생긴 `E`를 읽으면 GOTO(1, E) = 2다.

## 절차

스택에는 기호가 아니라 **상태 번호**를 쌓는다.

| 때 | 할 일 |
|---|---|
| 시작 | 시작 상태(1)를 스택에 넣는다 |
| 걸음마다 | 지금 상태 = 스택의 맨 위. 다음 입력 기호 = 남은 입력의 맨 왼쪽 토큰. ACTION(지금 상태, 다음 입력 기호)를 찾는다 |
| 이동 `S j` | 상태 $$j$$를 스택에 넣고 막대를 오른쪽으로 한 칸 옮긴다 |
| 환원 `R(k)`, 규칙이 $$A \to \alpha$$ | ① 스택에서 $$\lvert\alpha\rvert$$개를 꺼낸다. ② 드러난 맨 위 상태를 $$q$$라 할 때 GOTO($$q$$, $$A$$)를 넣는다. 입력은 그대로 둔다 |
| 환원 R(1) ($$S' \to S$$) | 받아들인다 |
| 빈칸 | 오류 |

$$\lvert\alpha\rvert$$는 규칙 오른쪽의 기호 수다. $$T \to id$$면 1, $$E \to T * E$$면 3이다.

### 의사코드

```
스택 ← [시작 상태]
반복:
    q ← 스택의 맨 위,  a ← 다음 토큰
    ACTION[q, a] 가
        "S j"            : j를 넣는다. 다음 토큰으로 넘어간다
        "R k" (A → α)    : k가 덧붙인 규칙이면 받아들이고 끝낸다
                           스택에서 |α|개를 꺼낸다
                           q' ← 스택의 맨 위
                           GOTO[q', A]를 넣는다
        빈칸             : 오류로 끝낸다
```

### 스택에 든 것의 뜻

스택은 반복마다 이 성질을 지킨다: "스택에 든 상태들은, 막대 왼쪽 부분을 상태 1부터 DFA로 읽을 때 지나는 상태들을 순서대로 적은 것이다."[^s1]

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">왜 계속 맞는가</summary>

1. **처음.** 왼쪽 부분이 비었고 스택은 [1]이다. 아무것도 안 읽었을 때 DFA는 상태 1에 있다.
2. **이동.** 왼쪽 부분 끝에 토큰 $$a$$가 붙는다. DFA는 맨 위 상태 $$q$$에서 $$a$$를 읽어 $$\delta(q, a)$$로 가고, 표의 `S j`의 $$j$$가 바로 그 상태다. 그것을 넣는다.
3. **환원.** 왼쪽 부분의 끝 $$\lvert\alpha\rvert$$개 기호가 사라지고 $$A$$가 붙는다. 그 기호들을 읽으며 들어간 상태 $$\lvert\alpha\rvert$$개를 꺼내면, 스택은 남은 부분을 읽은 길이 된다. 거기서 $$A$$를 읽은 상태가 GOTO다.

그래서 맨 위 상태 하나만 보면 "왼쪽 부분 전체를 DFA에 읽힌 결과"를 안다.

</details>


다시 읽는 방식과 스택 방식은 결정이 모두 같고 드는 일만 다르다. `id * id`에서 다시 읽는 방식은 DFA를 14걸음 걷고, 스택 방식은 상태를 7번 넣는다. `id`가 10개면 390걸음 대 39번, 40개면 6,360걸음 대 159번이다. 한쪽은 입력 길이의 제곱으로, 다른 쪽은 길이에 비례해 는다[^s1].


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적의 스택 8줄, 길이 7 이하 토큰열 21,845개에서 다시 읽는 방식과 스택 방식의 결정이 모두 같고 스택 성질이 걸음마다 지켜짐, 걸음 수 14 대 7과 390 대 39, 오류 입력 `id id`와 `id *`가 멈추는 자리 — [28_slr-stack-parser_impl.py](/Hongs_Blog/studies/compilers/code/28_slr-stack-parser_impl/)</div>

</div>


## 활용

- 구현: [28_slr-stack-parser_impl.py](/Hongs_Blog/studies/compilers/code/28_slr-stack-parser_impl/). 연습: [SLR 파서 추적 연습](/Hongs_Blog/studies/compilers/slr-parse-trace-practice/)
- 오류는 표의 빈칸에서 난다. `id id $`는 스택 1 5에서 다음 토큰이 `id`인데 (5, `id`)가 빈칸이라 바로 멈춘다. `id * $`는 스택 1 3 6에서 (6, `$`)가 빈칸이다.
- 흔한 실수 둘. 환원할 때 꺼낸 뒤 드러난 상태가 아니라 꺼내기 전의 맨 위 상태로 GOTO를 찾는다. 환원한 뒤 입력 토큰을 하나 넘겨 버린다(환원은 입력을 읽지 않는다).
- 스택에 상태와 함께 트리 조각을 쌓으면 환원할 때마다 자식들을 묶어 [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)의 노드를 만들 수 있다[^s2].

## 연결

- 선수: [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/), [스택](/Hongs_Blog/studies/algorithms/stack/)
- [LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/)과 견주면, LL(1)의 스택에는 "앞으로 봐야 할 기호"가 들어 있고 SLR의 스택에는 "지금까지 본 것을 읽은 상태"가 들어 있다. LL(1)은 논터미널을 꺼내 규칙의 오른쪽을 넣고, SLR은 규칙의 오른쪽만큼 꺼내 상태 하나를 넣는다.
- 기계가 함수 호출에 쓰는 스택도 같은 자료구조다: [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/) 문서의 표로 `( id ) $`를 파싱할 때 스택이 어떻게 바뀌는지 차례로 쓰라.</summary>

**답:** [1] → [1 4] → [1 4 5] → [1 4 3] → [1 4 7] → [1 4 7 9] → [1 3] → [1 2] → 받아들임.<br>
**이유:** S4, S5, R(5)로 5를 꺼내고 GOTO(4, T) = 3, R(3)으로 3을 꺼내고 GOTO(4, E) = 7, S9, R(4)로 9·7·4 셋을 꺼내고 GOTO(1, T) = 3, R(3)으로 3을 꺼내고 GOTO(1, E) = 2, 마지막에 R(1). 틀리기 쉬운 곳은 R(4)에서 셋을 꺼내는 것이다. $$T \to (E)$$의 오른쪽이 기호 3개다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 환원에서 "꺼내고, GOTO를 넣는" 두 걸음이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 묶인 기호들을 읽으며 지나온 상태를 지우고, 그 자리에 묶어서 생긴 논터미널을 읽은 상태를 놓는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 스택에 기호(`T`, `*`, `E`)가 아니라 상태 번호를 쌓는 이유는?</summary>

**답:** 결정에 필요한 것은 "왼쪽 부분을 DFA에 읽힌 결과 상태"다. 상태를 쌓아 두면 맨 위만 보면 되고, 기호를 쌓으면 결정할 때마다 처음부터 DFA를 다시 돌려야 한다. 같은 기호 `T`라도 상태 1에서 읽었는지 6에서 읽었는지에 따라 다음에 갈 곳이 다르므로, 기호만으로는 모자란다.

</details>


[^s1]: 구현 코드로 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 4.6.3 "The LR-Parsing Algorithm".
[^s2]: 근거: 같은 책 5.4 "Syntax-Directed Translation Schemes".
{% endraw %}
