---
layout: "note"
title: "FP-Growth"
display_title: "FP-Growth"
kind: "concept"
kind_label: "알고리즘"
num: "15"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["FP-Growth", "Frequent Pattern Growth", "빈발 패턴 성장", "FP-tree", "FP 트리", "조건부 패턴 베이스", "Conditional Pattern Base", "조건부 FP 트리", "Conditional FP-tree", "헤더 테이블", "Header Table", "패턴 성장"]
description: "영수증들을 \"많이 팔린 물건부터\" 순서로 다시 적은 뒤, 앞부분이 같은 영수증끼리 한 가지에 겹쳐 쌓아 작은 나무로 압축한다. 그다음 어떤 물건이 든 영수증만 골라낸 작은 나무를 만들어 그 안에서 다시 찾는 일을 되풀이한다. 후보 묶음을 만들어 세는 과정이 없고 데이터는 두 번만 …"
prev_url: "/studies/data-science/eclat/"
prev_title: "ECLAT"
next_url: "/studies/data-science/contrast--fp-mining-methods/"
next_title: "빈발 패턴 마이닝 방법 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/fp-growth/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

영수증들을 "많이 팔린 물건부터" 순서로 다시 적은 뒤, 앞부분이 같은 영수증끼리 한 가지에 겹쳐 쌓아 작은 나무로 압축한다. 그다음 어떤 물건이 든 영수증만 골라낸 작은 나무를 만들어 그 안에서 다시 찾는 일을 되풀이한다. 후보 묶음을 만들어 세는 과정이 없고 데이터는 두 번만 훑는다. 대신 나무를 만들고 재귀로 쪼개는 과정이 복잡하고, 영수증들이 서로 거의 겹치지 않으면 나무가 별로 줄지 않는다.

</div>


## 예시로 보기

[Apriori](/Hongs_Blog/studies/data-science/apriori/)는 후보를 엄청나게 만들고, 셀 때마다 DB 전체를 다시 훑는다[^1]. 그렇다면 {C}가 빈발임을 안 다음에는 C가 든 거래만 보면 되지 않을까? 이것이 FP-Growth의 생각이다[^2].

Apriori 연습 1과 같은 거래 9개, 최소 지지 개수 2로 따라간다[^3].

**1단계: 압축.** DB를 한 번 훑어 항목별 개수를 센다: B 7, A 6, C 6, D 2, E 2. 많은 순서 <B, A, C, D, E>로 정한다. DB를 다시 훑어 거래마다 빈발 항목을 이 순서로 다시 적고, 나무에 차례로 넣는다. 앞부분이 같으면 같은 가지를 따라가며 개수를 1씩 더한다.

| 거래 | 원래 | 순서대로 |
|---|---|---|
| 10 | A, B, E | B, A, E |
| 20 | A, B, D | B, A, D |
| 30 | B, C | B, C |
| 40 | B, D | B, D |
| 50 | A, C | A, C |
| 60 | B, C | B, C |
| 70 | A, C | A, C |
| 80 | A, B, C, E | B, A, C, E |
| 90 | A, B, C | B, A, C |

```
(루트)
├─ B:7
│  ├─ A:4
│  │  ├─ E:1
│  │  ├─ D:1
│  │  └─ C:2
│  │     └─ E:1
│  ├─ C:2
│  └─ D:1
└─ A:2
   └─ C:2
```

항목 등장 23번이 마디 10개로 줄었다. 루트에서 한 마디까지의 경로가 거래 앞부분 하나이고, 마디의 숫자는 그 앞부분으로 시작하는 거래 수다. 옆에는 항목마다 그 항목의 마디들을 이은 목록(헤더 테이블)을 둔다[^3].

**2·3단계: 캐기.** 순서의 맨 뒤 항목부터 올라간다[^4].

| 항목 | 조건부 패턴 베이스 (그 항목 마디까지의 앞 경로) | 조건부 FP-tree | 만들어지는 빈발 패턴 |
|---|---|---|---|
| E | {B, A}:1, {B, A, C}:1 | <B:2, A:2> | {B,E}:2, {A,E}:2, {A,B,E}:2 |
| D | {B, A}:1, {B}:1 | <B:2> | {B,D}:2 |
| C | {B, A}:2, {B}:2, {A}:2 | <B:4, A:2>, <A:2> | {B,C}:4, {A,C}:4, {B,A,C}:2 |
| A | {B}:4 | <B:4> | {B,A}:4 |

E의 조건부 패턴 베이스는 "E가 든 거래들에서 E 앞에 있던 것"이다. 그 안에서 B와 A가 각각 2번이라 둘 다 빈발이고, 이것들에 E를 붙인 것이 빈발 패턴이다. C의 베이스에서는 B 4, A 4지만 B와 A가 함께 나온 것은 {B, A}:2뿐이라 {B,A,C}는 2다.

결과는 Apriori와 같다. 3항목 {A,B,C}, {A,B,E}, 2항목 {A,B}, {A,C}, {A,E}, {B,C}, {B,D}, {B,E}[^5].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 순서, 나무의 가지 개수, E·D·C·A의 조건부 베이스, 연습 2의 결과와 규칙, 무작위 자료 300개에서 모든 부분집합을 세는 방법과 일치, 마디 수(23 → 10, 18 → 9) — [15_fp-growth_impl.py](/Hongs_Blog/studies/data-science/code/15_fp-growth_impl/)</div>

</div>


## 정의

**FP-Growth**(Frequent Pattern Growth)는 후보 생성 없이 빈발 패턴을 찾는다. 빈발 항목 집합 $$p$$를 찾은 뒤에는 $$p$$가 든 거래로만 탐색 범위를 좁히는 깊이 우선 탐색이다[^2]. 세 단계로 나뉜다[^2].

1. **데이터 압축.** DB를 빈발 패턴 트리(FP-tree)로 압축한다. 순서대로 늘어놓은 빈발 항목 목록을 트리에 넣고, 공유하는 가지는 합치며 마디의 개수를 누적한다[^3].
2. **FP-tree 캐기.** 압축한 DB를 조건부 패턴 베이스들로 나눈다. 항목 $$p$$의 조건부 DB는 $$p$$를 담은 패턴들로 이루어진다. 아래 항목부터 위로 계산한다[^4].
3. **패턴 만들기.** 조건부 FP-tree가 가지 하나뿐이면, 그 가지의 항목 조합에 접미사를 붙여 모든 빈발 패턴을 바로 만든다[^4].

### 의사코드

```
FP-Growth(거래들(가중치 포함), 접미사 α):
    거래들을 훑어 항목별 개수를 세고, min_sup 이상인 항목을 개수 내림차순으로 정한다
    거래마다 빈발 항목만 그 순서로 늘어놓아 FP-tree에 넣는다
    순서의 맨 뒤 항목 a부터 앞으로:
        β ← {a} ∪ α 를 빈발로 기록 (지지 개수 = 트리 속 a 마디들의 개수 합)
        B ← a의 조건부 패턴 베이스 (a의 각 마디에서 루트까지의 앞 경로, 가중치 = 그 마디의 개수)
        B가 비지 않으면 FP-Growth(B, β)
```

### 정확성

**주장.** $$\beta = \{a\} \cup \alpha$$를 담은 거래들은, $$\alpha$$의 조건부 DB 안에서 $$a$$를 담은 거래들과 정확히 같다. 그래서 $$\alpha$$의 조건부 DB에서 $$a$$의 조건부 패턴 베이스로 내려가며 세면, 빈발 집합을 빠짐없이 한 번씩 정확한 지지도로 센다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치</summary>

1. **순서로 나누기.** 빈발 집합 $$X$$의 항목 중 정한 순서에서 가장 뒤에 오는 것을 $$a$$라 하면, $$X$$는 "$$a$$를 담고 $$a$$보다 뒤 항목은 안 담는" 집합이다. 항목마다 이런 집합의 무리가 하나씩 생기고, 무리끼리 겹치지 않는다. — 순서의 성질
2. **$$a$$의 무리는 $$a$$의 베이스에서 찾는다.** 거래를 순서대로 늘어놓았으므로, $$a$$가 든 거래에서 $$a$$보다 앞의 항목은 정확히 트리에서 $$a$$ 마디 위의 경로다. 그래서 $$X - \{a\}$$의 지지도를 $$a$$의 조건부 패턴 베이스(경로 × 마디 개수)에서 세면 $$X$$의 지지도다. — 트리 구성
3. **빈발이 아닌 항목을 버려도 된다.** 베이스에서 개수가 min_sup 미만인 항목은 $$a$$와 함께 빈발일 수 없으므로, 그 항목을 담은 상위 집합도 아프리오리 성질에 따라 빈발이 아니다. — 아프리오리 성질
4. **재귀.** 같은 논리를 베이스 안에서 반복하면(강한 귀납법, 베이스는 항목이 하나 이상 줄어든 더 작은 DB) 모든 빈발 집합이 정확히 한 번 나온다. ∎

[증명 스케치] 엄밀한 증명은 Han, Pei, Yin, "Mining Frequent Patterns without Candidate Generation", SIGMOD 2000의 보조정리들을 따른다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 항목을 개수 내림차순으로 늘어놓는 이유</summary>

자주 나오는 항목이 앞에 오면 많은 거래가 같은 앞부분을 공유해 트리의 위쪽 가지가 합쳐진다. 그래서 마디가 줄어 트리가 작아진다. 순서가 정확성을 바꾸지는 않는다. 어떤 고정된 순서든 결과는 같고 트리 크기만 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 조건부 패턴 베이스의 경로에 "그 마디의 개수"를 가중치로 붙이는 이유</summary>

마디 $$a{:}n$$은 그 경로를 앞부분으로 가진 거래 중 $$a$$까지 이어진 거래가 $$n$$개라는 뜻이다. 경로 위의 다른 항목 마디 개수는 $$a$$가 없는 거래까지 센 것이라 더 크다. $$a$$와 함께 나온 횟수는 $$a$$ 마디의 개수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 아래 항목(덜 빈발한 항목)부터 처리하는 이유</summary>

아래 항목의 마디에서 루트까지의 경로가 "그 항목보다 앞의 항목들"이다. 아래부터 처리하면 각 항목의 무리(그 항목이 가장 뒤인 집합)를 위쪽 경로만 보고 찾을 수 있어, 같은 집합을 두 번 세지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

빈발 집합을 "가장 뒤 항목"으로 겹치지 않게 나누고, 각 무리는 그 항목이 든 거래만 모은 작은 DB에서 같은 문제를 다시 푼다. 분할 정복이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

앞부분을 공유하는 문자열을 트리로 압축하는 [트라이](/Hongs_Blog/studies/algorithms/trie/)(자동 완성), 문제를 "어떤 원소를 포함하는 경우"로 나눠 재귀하는 [백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)과 부분집합 열거.

</details>


### 복잡도

- DB는 두 번 훑는다(개수 세기, 트리 만들기)[^6].
- 후보를 만들지 않는다. 대신 조건부 트리를 재귀로 만든다[^6].
- 트리 크기는 거래 속 빈발 항목 등장 수 이하다. 거래들이 앞부분을 많이 공유하면 크게 줄고(예시 23 → 10), 거의 공유하지 않으면 거의 줄지 않는다[^s1].

## 예제

**연습 2** (거래 5개, 최소 지지 개수 3)[^7].

| 거래 | 원래 | 순서대로 (<K:5, E:4, M:3, O:3, Y:3>) |
|---|---|---|
| T1 | E, K, M, N, O, Y | K, E, M, O, Y |
| T2 | D, E, K, N, O, Y | K, E, O, Y |
| T3 | A, E, K, M | K, E, M |
| T4 | C, K, M, U, Y | K, M, Y |
| T5 | C, E, I, K, O, O | K, E, O |

| 항목 | 조건부 패턴 베이스 | 조건부 FP-tree | 빈발 패턴 |
|---|---|---|---|
| Y | {K,E,M,O}:1, {K,E,O}:1, {K,M}:1 | <K:3> | {K,Y}:3 |
| O | {K,E,M}:1, {K,E}:2 | <K:3, E:3> | {K,O}:3, {E,O}:3, {K,E,O}:3 |
| M | {K,E}:2, {K}:1 | <K:3> | {K,M}:3 |
| E | {K}:4 | <K:4> | {K,E}:4 |

Y의 베이스에서 E는 2번, M은 2번, O는 2번이라 3에 못 미쳐 버린다. 남은 K만 Y와 함께 빈발이다. 가장 긴 빈발 집합 {K, E, O}에서 규칙을 만들면 K → EO 60%, E → KO 75%, O → KE 100%, KE → O 75%, KO → E 100%, EO → K 100%다(최소 신뢰도 50%라 모두 강하다)[^8].

## 활용

- 구현: [15_fp-growth_impl.py](/Hongs_Blog/studies/data-science/code/15_fp-growth_impl/)
- 연습: [FP-Growth 예제 사다리](/Hongs_Blog/studies/data-science/fp-growth-ladder/)
- Spark MLlib의 `FPGrowth`, 파이썬 mlxtend의 `fpgrowth`가 이 알고리즘이다[^s1].
- 흔한 실수: 조건부 패턴 베이스에 그 항목 자신을 넣거나, 경로의 가중치를 경로 위 마디의 개수로 적는 것. 가중치는 출발한 항목 마디의 개수다.

## 연결

- 선수: [Apriori 알고리즘](/Hongs_Blog/studies/data-science/apriori/)(같은 답, 다른 방법), [트라이](/Hongs_Blog/studies/algorithms/trie/)(앞부분 공유 트리)
- 세 방법 비교: [빈발 패턴 마이닝 방법 비교](/Hongs_Blog/studies/data-science/contrast--fp-mining-methods/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"FP-tree는 원래 거래 DB를 그대로 다시 만들 수 있다"</div>

아니다. FP-tree는 빈발 항목만 담는다. 예시에서는 모든 항목이 빈발이었지만, 연습 2에서는 N, D, A, C, U, I가 1단계에서 버려졌다. 트리는 "빈발 패턴을 찾는 데 필요한 정보"를 잃지 않을 뿐, 원래 DB를 되살리지는 못한다. 또 같은 앞부분의 거래들이 합쳐져서, 거래 50(A, C)과 70(A, C)이 서로 다른 거래였다는 사실도 개수 2로만 남는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** FP-Growth의 세 단계를 쓰고, Apriori와 달리 하지 않는 일을 말하라.</summary>

**답:** ① DB를 FP-tree로 압축 ② FP-tree를 조건부 패턴 베이스로 나눠 아래 항목부터 캐기 ③ 조건부 FP-tree에서 빈발 패턴 만들기. 후보 항목 집합을 만들어 DB를 훑어 세는 일을 하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예시의 FP-tree에서 D의 조건부 패턴 베이스와 조건부 FP-tree, 빈발 패턴을 구하라(최소 지지 개수 2).</summary>

**답:** D 마디는 B-A-D:1과 B-D:1 두 개다. 베이스 {B, A}:1, {B}:1. B는 2번, A는 1번이라 A를 버린다. 조건부 FP-tree <B:2>, 빈발 패턴 {B, D}:2.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 `B ← a의 조건부 패턴 베이스` 줄과 그 뒤 재귀 호출이 함께 하는 일을 한 문장으로 쓰라.</summary>

**답:** $$a$$가 든 거래들에서 $$a$$ 앞의 항목들만 모은 작은 DB를 만들고, 그 안에서 같은 방법으로 빈발 패턴을 찾아 $$a$$를 붙인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** E의 조건부 패턴 베이스 {B, A}:1, {B, A, C}:1에서 C를 버리는 것이 옳은 이유를 대라.</summary>

**답:** C는 베이스에서 1번만 나와 E와 함께 나온 거래가 1개뿐이다. 그래서 {C, E}는 빈발이 아니고, 아프리오리 성질에 따라 C와 E를 함께 담은 어떤 집합도 빈발이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 거래 4개 ABC, AB, AC, B(최소 지지 개수 2)의 FP-tree를 그리라. 항목 순서는 개수 내림차순, 같으면 알파벳순이다.</summary>

**답:** 개수 A 3, B 3, C 2 → 순서 <A, B, C>. 거래를 다시 적으면 ABC, AB, AC, B.
```
(루트)
├─ A:3
│  ├─ B:2
│  │  └─ C:1
│  └─ C:1
└─ B:1
```
C의 마디가 두 곳(A-B-C, A-C)에 흩어져 있어 헤더 테이블이 두 마디를 잇는다[^s1].

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/03.3-1_FP.pdf, p.25
[^2]: 같은 자료, p.29 (Han, Pei, Yin, SIGMOD 2000)
[^3]: 같은 자료, p.30
[^4]: 같은 자료, p.31~34
[^5]: 같은 자료, p.35. 3-4 풀이 p.11
[^6]: 같은 자료, p.39 (요약 표: DB 2번 훑기, 후보 생성 없음, DFS, 메모리 적음)
[^7]: 같은 자료, p.36 (연습 2). 3-4 풀이 p.3~8
[^8]: 3-2학기/데이터 과학/1.수업자료/03.3-4-solutions.pdf, p.9~10
[^s1]: 에이전트 보충. 의사코드, 정확성 스케치, 스스로 설명해 보기, 마디 수, 트리 크기 논의, 라이브러리, 오해 항목, 카드 C2~C5는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
