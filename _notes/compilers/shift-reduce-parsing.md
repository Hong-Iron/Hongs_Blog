---
layout: "note"
title: "이동-환원 파싱"
display_title: "이동-환원 파싱 (Shift-Reduce Parsing)"
kind: "concept"
kind_label: "알고리즘"
num: "22"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Shift-Reduce Parsing", "Bottom-up Parsing", "상향식 파싱", "이동", "Shift", "환원", "Reduce", "Reduction", "이동-환원 충돌", "Shift-Reduce Conflict", "환원-환원 충돌", "Reduce-Reduce Conflict"]
description: "퍼즐 조각을 왼쪽부터 하나씩 집어 책상에 늘어놓다가, 방금 놓은 몇 조각이 한 덩어리가 되면 바로 묶어 이름표 하나로 바꾸는 방식이다. 입력을 다 읽고 책상에 \"문장 전체\"라는 이름표 하나만 남으면 문법에 맞는 입력이다. 규칙을 미리 찍지 않고 조각을 본 뒤에 묶으니, 위에서 내려…"
prev_url: "/studies/compilers/ll1-stack-parser/"
prev_title: "LL(1) 파서의 스택 동작"
next_url: "/studies/compilers/parse-handle/"
next_title: "핸들"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/shift-reduce-parsing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

퍼즐 조각을 왼쪽부터 하나씩 집어 책상에 늘어놓다가, 방금 놓은 몇 조각이 한 덩어리가 되면 바로 묶어 이름표 하나로 바꾸는 방식이다. 입력을 다 읽고 책상에 "문장 전체"라는 이름표 하나만 남으면 문법에 맞는 입력이다. 규칙을 미리 찍지 않고 조각을 본 뒤에 묶으니, 위에서 내려오는 방식보다 더 많은 문법을 다룬다. 대신 지금 묶을지 더 집을지, 묶는다면 어느 규칙으로 묶을지를 스스로 정하지 못한다. 이 결정을 틀리면 맞는 입력도 놓친다.

</div>


## 예시로 보기

위에서 내려오는 파서는 토큰을 한두 개만 보고 어느 규칙을 쓸지 먼저 정해야 한다. `id * id + id`의 첫 토큰 `id`만 봐서는 $$E \to T + E$$인지 $$E \to T$$인지 알 수 없다. 거꾸로 가면 이 고민이 뒤로 밀린다. 토큰을 먼저 읽어 두고, 규칙의 오른쪽이 다 모였을 때 그 규칙으로 묶으면 된다.

강의의 문법은 이것이다[^1].

$$E \to T + E \mid T, \qquad T \to F * T \mid F, \qquad F \to (E) \mid id$$


입력 `id * id + id`를 따라간다. 세로 막대 <code>&#124;</code>의 왼쪽이 이미 읽어 책상에 놓은 부분이고, 오른쪽이 아직 안 읽은 부분이다[^2].

| 단계 | 상태 | 한 일 |
|---|---|---|
| 1 | `\|id * id + id` | 이동 |
| 2 | `id\|* id + id` | $$F \to id$$로 환원 |
| 3 | `F\|* id + id` | 이동 |
| 4 | `F *\|id + id` | 이동 |
| 5 | `F * id\|+ id` | $$F \to id$$로 환원 |
| 6 | `F * F\|+ id` | $$T \to F$$로 환원 |
| 7 | `F * T\|+ id` | $$T \to F * T$$로 환원 |
| 8 | `T\|+ id` | 이동 |
| 9 | `T +\|id` | 이동 |
| 10 | `T + id\|` | $$F \to id$$로 환원 |
| 11 | `T + F\|` | $$T \to F$$로 환원 |
| 12 | `T + T\|` | $$E \to T$$로 환원 |
| 13 | `T + E\|` | $$E \to T + E$$로 환원 |
| 14 | `E\|` | 받아들임 |

막대를 오른쪽으로 한 칸 옮기는 일을 이동(shift)이라 부른다. 막대 바로 왼쪽의 몇 기호를 규칙의 왼쪽 기호 하나로 바꾸는 일을 환원(reduce)이라 부른다. 5단계에서는 막대 왼쪽 끝의 `id`가 $$F \to id$$의 오른쪽과 같아서 `F`로 바꿨다.

3단계를 보면 이상한 점이 있다. `F`는 $$T \to F$$의 오른쪽과 같은데 왜 환원하지 않고 이동했을까? 거기서 환원하면 <code>T&#124;* id + id</code>가 되고, 이 문법에는 `T` 바로 뒤에 `*`가 오는 꼴이 없어 더 나아가지 못한다. 묶을 수 있다고 다 묶으면 안 된다. 어느 때 묶어야 하는지는 [핸들](/Hongs_Blog/studies/compilers/parse-handle/)이 답한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표 14줄, 길이 7 이하의 모든 토큰열 97,656개에서 "문법에 맞는가"의 답이 뻔한 방법과 같음(맞는 것 60개), 맞는 입력에서 이동 횟수 = 토큰 수 — [22_shift-reduce-parsing_impl.py](/Hongs_Blog/studies/compilers/code/22_shift-reduce-parsing_impl/)</div>

</div>


## 정의

이동-환원 파싱은 아래에서 위로 올라가는 파싱(상향식 파싱)을 하는 방법이다. 파스 트리를 잎(입력 토큰)에서 시작해 뿌리(시작 기호)까지 쌓아 올린다[^1].

**두 가지 생각.** 문자열을 둘로 나누고, 걸음마다 이동이나 환원 중 하나를 한다[^3].

- 문자열 $$\omega$$를 왼쪽 부분 $$\alpha$$와 오른쪽 부분 $$\beta$$로 나눈다. 기호로 쓰면 $$\omega = \alpha \mid \beta$$다. $$\alpha$$(알파)에는 터미널과 논터미널이 섞여 있고, $$\beta$$(베타)는 아직 안 읽은 토큰이라 터미널뿐이다.
- 이동: 막대를 오른쪽으로 한 칸 옮긴다. $$XaY \mid bcd$$가 $$XaYb \mid cd$$가 된다.
- 환원: 왼쪽 부분의 끝자락이 어떤 규칙의 오른쪽과 같으면, 그 끝자락을 규칙의 왼쪽 기호로 바꾼다. 규칙 $$Z \to Yb$$가 있으면 $$XaYb \mid cd$$가 $$XaZ \mid cd$$가 된다. 이때 끝자락 후보는 $$XaYb$$, $$aYb$$, $$Yb$$, $$b$$ 넷이다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "$$XaYb\vert cd \Rightarrow_{reduce} XaZ\vert cb$$" (7회 슬라이드 p.5) / 문제점: 환원은 막대 왼쪽만 바꾼다. 오른쪽의 `cd`가 `cb`로 바뀔 수 없다 / 수정안: $$XaZ \mid cd$$ / 근거: 같은 슬라이드의 이동 예는 오른쪽을 `cd`로 적었고, 구현에서 환원은 남은 입력을 건드리지 않는다([22_shift-reduce-parsing_impl.py](/Hongs_Blog/studies/compilers/code/22_shift-reduce-parsing_impl/)).

</div>


### 입력과 출력

- 입력: 문맥 자유 문법 $$G$$(시작 기호 $$S$$)와 토큰열 $$\omega$$.
- 출력: $$\omega$$가 $$G$$의 문장이면 받아들임과 환원한 규칙의 순서, 아니면 오류.

### 의사코드

```
왼쪽 ← 빈 문자열,  오른쪽 ← 입력 전체
반복:
    왼쪽 = S 이고 오른쪽이 비었으면 → 받아들임
    결정한다: 환원할까, 이동할까            ← 이 줄이 어렵다
    환원이면: 왼쪽의 끝자락 β를 A로 바꾼다 (규칙 A → β)
    이동이면: 오른쪽의 첫 토큰을 왼쪽 끝으로 옮긴다
    둘 다 못 하면 → 오류
```

왼쪽 부분은 끝에서만 늘고 끝에서만 줄어든다. 그래서 [스택](/Hongs_Blog/studies/algorithms/stack/)에 담는다[^s1].

### 두 가지 충돌

"결정한다" 줄에서 막히는 경우는 두 가지다[^4].

| 이름 | 무엇을 못 정하나 | 강의의 예 |
|---|---|---|
| 이동-환원 충돌 | 이동할지 환원할지 | `id\|* id`에서 이동? $$F \to id$$로 환원? |
| 환원-환원 충돌 | 어느 규칙으로 환원할지 | `F * T\|`에서 $$T \to F * T$$? $$E \to T$$? |

둘째 예에서 $$E \to T$$를 고르면 `F * E`가 되어 더 줄일 수 없다. 이 충돌을 푸는 도구가 [핸들](/Hongs_Blog/studies/compilers/parse-handle/)과 [유효 접두사](/Hongs_Blog/studies/compilers/viable-prefix/)다[^4].

### 정확성: 환원을 거꾸로 읽으면 오른쪽 끝 유도다

**주장.** 이동-환원 파서가 받아들이면 입력은 문법의 문장이다. 환원한 규칙을 마지막 것부터 거꾸로 늘어놓으면, 걸음마다 가장 오른쪽 논터미널을 바꾸는 유도(오른쪽 끝 유도)가 된다[^1].

반복마다 계속 맞는 성질(루프 불변식)은 이것이다: "왼쪽 부분과 오른쪽 부분을 이어 붙인 문자열에서 출발해 원래 입력을 유도할 수 있다."[^s2]

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. **처음.** 왼쪽은 비었고 오른쪽은 입력 전체다. 이어 붙이면 입력 그대로이므로 0걸음에 유도한다. — 유도의 정의
2. **이동.** 막대만 옮긴다. 이어 붙인 문자열이 그대로라서 성질도 그대로다.
3. **환원.** $$\alpha\beta \mid \omega$$가 규칙 $$X \to \beta$$로 $$\alpha X \mid \omega$$가 된다. 거꾸로 보면 $$\alpha X \omega \Rightarrow \alpha\beta\omega$$는 유도 한 걸음이다. 환원 전의 문자열에서 입력을 유도할 수 있었으니, 한 걸음을 앞에 붙여 환원 뒤의 문자열에서도 유도한다. — 유도 한 걸음의 정의
4. **오른쪽 끝 유도인 이유.** 막대 오른쪽 $$\omega$$는 아직 안 읽은 토큰이라 터미널뿐이다. 그래서 $$\alpha X \omega$$에서 $$X$$는 가장 오른쪽 논터미널이다. 3의 걸음은 늘 가장 오른쪽 논터미널을 바꾼다. — 오른쪽 끝 유도의 정의
5. **끝.** 받아들일 때 왼쪽은 $$S$$ 하나이고 오른쪽은 비었다. 성질에 따라 $$S$$에서 입력을 유도한다. 곧 입력은 문장이다. ∎

</details>


`id * id`에서 환원한 순서는 $$F \to id$$, $$F \to id$$, $$T \to F$$, $$T \to F * T$$, $$E \to T$$다. 문자열로 보면 `id * id` → `F * id` → `F * F` → `F * T` → `T` → `E`다. 거꾸로 읽으면 슬라이드의 오른쪽 끝 유도와 같다[^1].

$$E \Rightarrow_{rm} T \Rightarrow_{rm} F * T \Rightarrow_{rm} F * F \Rightarrow_{rm} F * id \Rightarrow_{rm} id * id$$


$$\Rightarrow_{rm}$$은 "가장 오른쪽(rightmost) 논터미널을 바꾸는 한 걸음"이라고 읽는다.

이 증명은 "받아들이면 문장이다"만 보인다. "문장이면 반드시 받아들인다"는 결정을 잘해야만 맞다. 아래 오해 항목의 예처럼 결정을 틀리면 문장도 놓친다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3에서 환원 한 번이 유도 한 걸음과 짝이 되는 이유</summary>

환원은 $$\beta$$를 $$X$$로 바꾸고, 유도는 $$X$$를 $$\beta$$로 바꾼다. 같은 규칙 $$X \to \beta$$를 반대 방향으로 쓴 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4에서 "$$X$$가 가장 오른쪽 논터미널"인 이유</summary>

막대 오른쪽에는 아직 읽지 않은 입력 토큰만 있다. 토큰은 모두 터미널이다. 환원은 막대 바로 왼쪽에서 일어나므로 새로 생긴 $$X$$의 오른쪽에는 논터미널이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 이동이 성질을 깨지 않는 이유</summary>

성질은 "왼쪽과 오른쪽을 이어 붙인 문자열"에 대한 것이다. 이동은 막대 자리만 바꾸고 문자열은 그대로 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

파서가 한 일을 필름처럼 거꾸로 돌린다. 환원을 거꾸로 돌리면 유도이고, 막대 오른쪽이 터미널뿐이라는 사실이 그 유도를 오른쪽 끝 유도로 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

위에서 내려오는 파서의 정확성도 같은 식으로 본다. [LL(1) 파서](/Hongs_Blog/studies/compilers/ll1-stack-parser/)가 고른 규칙을 순서대로 늘어놓으면 왼쪽 끝 유도가 된다. 이번에는 거꾸로 돌리지 않는다.

</details>


### 복잡도

토큰이 $$n$$개인 문장을 받아들일 때 이동은 정확히 $$n$$번이다. 토큰마다 막대를 한 번씩 넘기 때문이다. 환원은 파스 트리의 안쪽 노드마다 한 번이다[^s2]. 위 표에서 토큰 5개에 이동 5번, 환원 8번이다. 걸음마다 드는 시간은 "결정"을 어떻게 하느냐에 달렸고, 표를 찾아 정하면 상수 시간이다([SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/)).

## 활용

- 구현: [22_shift-reduce-parsing_impl.py](/Hongs_Blog/studies/compilers/code/22_shift-reduce-parsing_impl/)
- 이 방식을 LR 파싱이라고도 부른다. 입력을 왼쪽에서 오른쪽으로(Left-to-right) 읽고, 오른쪽 끝(Rightmost) 유도를 거꾸로 만든다는 뜻이다[^s3].
- 결정을 자동으로 하는 방법이 [SLR 파싱](/Hongs_Blog/studies/compilers/slr-parsing/)이고, 그 결정을 표로 굳힌 것이 [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)다.
- 흔한 실수: 환원을 "문자열 어디서든" 하는 것. 환원은 막대 바로 왼쪽 끝자락에서만 한다.

## 연결

- 선수: [문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/), [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)
- 충돌을 푸는 두 낱말: [핸들](/Hongs_Blog/studies/compilers/parse-handle/), [유효 접두사](/Hongs_Blog/studies/compilers/viable-prefix/)
- 반대 방향: [재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/). 둘의 차이는 [LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)
- 왼쪽 부분을 담는 그릇: [스택](/Hongs_Blog/studies/algorithms/stack/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"왼쪽 끝자락이 규칙의 오른쪽과 같으면 바로 환원하면 된다"</div>

틀렸다. `id * id`를 이 방식으로 돌리면 `id` → `F` → `T` → `E`까지 한꺼번에 줄여 버리고, 그 뒤 `E * id`를 `E * E`까지 줄인 채 멈춘다. 이 문법에 `E * E`를 묶는 규칙이 없어 `E` 하나로 줄지 않는다. 그런데 `id * id`는 문법에 맞는 입력이다. 그럴듯해 보이는 이유는 환원이 "규칙을 거꾸로 쓰는 것"이라 같기만 하면 써도 될 것 같기 때문이다. 실제로는 오른쪽 끝 유도를 거꾸로 되돌리는 자리에서만 환원해야 한다. 확인하는 법: 3단계의 <code>F&#124;* id + id</code>에서 $$T \to F$$로 환원한 뒤 `T *`로 시작하는 문자열을 문법에서 만들 수 있는지 따져 본다[^s2].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 이동과 환원이 각각 무엇을 하는지, $$\omega = \alpha \mid \beta$$를 써서 말하라.</summary>

**답:** 이동은 막대를 오른쪽으로 한 칸 옮겨 $$\beta$$의 첫 토큰을 $$\alpha$$의 끝에 붙인다. 환원은 $$\alpha$$의 끝자락이 규칙 $$A \to \gamma$$의 오른쪽 $$\gamma$$와 같을 때 그 끝자락을 $$A$$로 바꾼다.<br>
**이유:** 환원은 늘 막대 바로 왼쪽에서만 일어난다. 문자열 가운데를 바꾸는 것이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 강의의 문법으로 `id + id`를 이동-환원 파싱하라. 상태(막대 포함)와 한 일을 차례로 쓰라.</summary>

**답:** <code>&#124;id + id</code> 이동 → <code>id&#124;+ id</code> $$F \to id$$ → <code>F&#124;+ id</code> $$T \to F$$ → <code>T&#124;+ id</code> 이동 → <code>T +&#124;id</code> 이동 → <code>T + id&#124;</code> $$F \to id$$ → <code>T + F&#124;</code> $$T \to F$$ → <code>T + T&#124;</code> $$E \to T$$ → <code>T + E&#124;</code> $$E \to T + E$$ → <code>E&#124;</code> 받아들임.<br>
**이유:** 넷째 줄 <code>T&#124;+ id</code>에서 $$E \to T$$로 환원하면 `E +`가 되어 막힌다. 이 문법에서 `+`의 왼쪽에는 `T`만 온다. 이동 3번, 환원 6번이다[^s2].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드 전체가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 입력을 왼쪽부터 읽어 쌓으면서, 쌓인 끝자락을 규칙의 왼쪽 기호로 바꾸는 일을 되풀이해 입력 전체를 시작 기호 하나로 줄일 수 있는지 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 환원한 규칙을 거꾸로 늘어놓으면 왜 "왼쪽 끝"이 아니라 "오른쪽 끝" 유도가 되는가?</summary>

**답:** 환원할 때 막대 오른쪽은 아직 안 읽은 토큰, 곧 터미널뿐이다. 그래서 환원으로 생긴 논터미널은 그 순간 문자열에서 가장 오른쪽 논터미널이다. 거꾸로 돌리면 걸음마다 가장 오른쪽 논터미널을 펼치는 유도가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** "환원할 수 있으면 늘 환원한다"는 규칙이 문법에 맞는 입력을 놓치는 예를 하나 들라.</summary>

**답:** `id * id`. `id` → `F` → `T` → `E`로 줄인 뒤 `*`와 `id`를 읽어 `E * E`에서 멈춘다. `E` 하나로 줄지 않아 오류라고 답하지만, `id * id`는 $$E \Rightarrow T \Rightarrow F * T \Rightarrow \cdots$$로 만들 수 있는 문장이다.

</details>


[^1]: 컴파일러 7회 강의 자료 「Lecture07 Syntax analysis part 4」, p.3~4 (상향식 파싱의 뜻, 문법, `id * id`의 오른쪽 끝 유도와 파스 트리)
[^2]: 같은 자료, p.6 (`id * id + id`의 상태와 동작 표). 슬라이드는 10~13단계의 환원 넷을 "<code>T + id&#124;</code> Reduce by $$F \to id, T \to F, E \to T, E \to T + E$$" 한 줄에 적었다.
[^3]: 같은 자료, p.5 (두 가지 핵심 생각, 이동과 환원의 예)
[^4]: 같은 자료, p.7~8 (두 가지 충돌과 예, 핸들과 유효 접두사를 배워야 한다는 말)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 7회 슬라이드의 이 부분은 스택을 말하지 않는다. 8회 슬라이드 p.22~34가 스택으로 구현한다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 6회 슬라이드가 없어 7회 p.3~8의 요약만 원본 근거다. 표의 10~13단계를 줄마다 나눈 것, 3단계에서 환원하면 막히는 이유, 루프 불변식과 증명, 스스로 설명해 보기, 이동·환원 횟수, 오해 항목의 `E * E` 예, 카드 C2·C4·C5는 원본에 없다. 구현 코드로 슬라이드 표를 다시 만들고 전수 비교로 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers: Principles, Techniques, and Tools* 2판, 4.5 "Bottom-Up Parsing".
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> LR이라는 이름의 뜻은 7회 슬라이드에 없다. 5회 슬라이드 p.6이 LL의 두 글자를 같은 방식으로 풀고, 7회 p.32부터 "LR(0) parsing"이라는 이름을 쓴다. 근거: 같은 책 4.5~4.6.
{% endraw %}
