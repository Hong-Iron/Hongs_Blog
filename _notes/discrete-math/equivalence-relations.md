---
layout: "note"
title: "동치관계와 분할"
display_title: "동치관계와 분할 (Equivalence Relations and Partitions)"
kind: "concept"
kind_label: "정리"
num: "10"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Equivalence Relation", "Partition", "동치관계", "동치류", "equivalence class", "분할", "몫집합", "quotient set", "유니온-파인드", "union-find", "서로소 집합", "disjoint set"]
description: "반사·대칭·추이를 모두 갖춘 관계는 \"같은 무리로 본다\"는 뜻의 동치관계다. 동치관계가 있으면 집합이 서로 겹치지 않는 무리로 깔끔하게 나뉘고, 거꾸로 집합을 무리로 나누면 동치관계가 생긴다. 나머지가 같은 정수, 서로 연결된 네트워크 노드, 같은 동작을 하는 상태들이 모두 이 구…"
prev_url: "/studies/discrete-math/relations/"
prev_title: "관계와 그 성질"
next_url: "/studies/discrete-math/partial-orders/"
next_title: "부분순서와 위상 정렬"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/equivalence-relations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

반사·대칭·추이를 모두 갖춘 관계는 "같은 무리로 본다"는 뜻의 동치관계다. 동치관계가 있으면 집합이 서로 겹치지 않는 무리로 깔끔하게 나뉘고, 거꾸로 집합을 무리로 나누면 동치관계가 생긴다. 나머지가 같은 정수, 서로 연결된 네트워크 노드, 같은 동작을 하는 상태들이 모두 이 구조다. 세 성질 중 하나라도 빠지면 무리가 겹치거나 어긋나 나눔이 되지 않는다.

</div>


## 예시로 보기

정수를 3으로 나눈 나머지가 같은 것끼리 같은 무리로 묶으면, 정수 전체가 정확히 세 무리로 나뉜다.

| 무리 | 원소 |
|---|---|
| 나머지 0 | …, −3, 0, 3, 6, … |
| 나머지 1 | …, −2, 1, 4, 7, … |
| 나머지 2 | …, −1, 2, 5, 8, … |

모든 정수가 딱 한 무리에 들어가고, 두 무리가 겹치는 일은 없다. 무리 하나가 아래 정의의 동치류, 세 무리의 모음이 분할이다. 같은 무리의 원소는 "나머지"라는 관점에서 구별할 필요가 없다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

집합 $$A$$ 위의 관계 $$\sim$$가 반사적·대칭적·추이적이면 **동치관계**라 한다. $$a$$의 **동치류**는 $$[a] = \{x \in A : x \sim a\}$$($$\in$$은 "~에 속한다")다[^1].

$$A$$의 **분할**은 공집합이 아닌 부분집합들의 모음으로, 서로 겹치지 않고 합하면 $$A$$가 되는 것이다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. $$\sim$$가 동치관계이면 두 동치류 $$[a]$$, $$[b]$$는 같거나 서로소다. 따라서 동치류들은 $$A$$의 분할을 이룬다.
2. 거꾸로 $$A$$의 분할이 주어지면 "같은 조각에 있다"는 동치관계다.
3. 두 변환은 서로의 역이다. 즉 동치관계와 분할은 같은 것을 두 방식으로 적은 것이다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 반사성으로 $$a \in [a]$$라 동치류는 비어 있지 않고, 모든 원소가 어떤 동치류에 든다. $$[a]$$와 $$[b]$$가 원소 $$c$$를 공유한다고 하자. $$c \sim a$$, $$c \sim b$$이므로 대칭·추이로 $$a \sim b$$다. 그러면 $$x \in [a]$$이면 $$x \sim a \sim b$$라 $$x \in [b]$$이고, 반대도 같아 $$[a] = [b]$$다. 즉 공유하는 원소가 하나라도 있으면 같은 동치류다.
2. 같은 조각에 있다는 관계는 자기 자신과 같은 조각(반사), 대칭은 당연, $$a, b$$가 같은 조각이고 $$b, c$$가 같은 조각이면 조각들이 겹치지 않으므로 $$a, c$$도 같은 조각(추이)이다.
3. 1의 분할로 2의 관계를 만들면 "$$a$$와 $$b$$가 같은 동치류" $$\iff a \sim b$$로 원래 관계다. 반대 방향도 같다. ∎

</details>


## 예제

"두 실수의 차가 1 이하"는 동치관계인가?

1. *반사:* $$\vert a - a\vert  = 0 \le 1$$. 맞는다.
2. *대칭:* $$\vert a - b\vert  = \vert b - a\vert $$. 맞는다.
3. *추이:* $$0$$과 $$1$$, $$1$$과 $$2$$는 차가 1 이하지만 $$0$$과 $$2$$는 차가 2다. 맞지 않는다.
4. *결론:* 동치관계가 아니다. "비슷하다"로 무리를 지으려 하면 0과 2가 같은 무리인지 정할 수 없어 무리가 겹친다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 동치관계 1,000개에서 동치류가 분할을 이루고 되돌리면 원래 관계, 유니온-파인드 결과 일치, mod 3의 세 동치류, 예제의 반례, NaN의 반사성 — [10_equivalence-relations_verify.py](/Hongs_Blog/studies/discrete-math/code/10_equivalence-relations_verify/)</div>

</div>


## 활용

- **유니온-파인드.** "이 둘을 같은 무리로 합쳐라", "이 둘이 같은 무리인가"를 거의 상수 시간에 처리하는 자료구조다. 네트워크의 연결 성분, 크루스칼 최소 신장 트리, 이미지의 영역 나누기에 쓴다. 분할을 직접 관리하는 것이다[^s1].
- **해시 버킷.** "해시값이 같다"는 동치관계라 키들을 버킷으로 나눈다. 버킷 안에서만 비교하면 된다.
- **상태 최소화.** 유한 오토마타에서 앞으로의 동작이 모두 같은 상태를 하나로 합치는 것이 동치류로 나누는 것이다.
- **`==`의 약속.** 프로그래밍 언어의 같음 비교는 동치관계여야 집합과 사전이 제대로 동작한다. 부동소수점 NaN은 `nan == nan`이 거짓이라 반사성이 깨진다. 그래서 파이썬에서 `float('nan') in [float('nan')]`은 거짓이다(같은 객체는 먼저 동일성으로 확인해 `x in [x]`는 참이다).
- 알고리즘에서: 무리를 합치고 같은 무리인지 묻는 구현과 그 비용(크기로 합치기, 경로 압축)은 [유니온 파인드](/Hongs_Blog/studies/algorithms/union-find/)에 있다. [지형 이동](/Hongs_Blog/studies/algorithms/pg62050/)의 '이웃 칸과 높이 차가 일정 이하'는 위 예제처럼 추이가 깨지지만, 한 칸씩 이어 가며 닿는가로 바꾸면 동치관계가 되어 사다리 없이 오가는 칸의 무리를 나눈다. 순서만 다른 경우를 하나로 셀 때는 동치류마다 하나뿐인 이름표를 집합에 모으는데, [불량 사용자](/Hongs_Blog/studies/algorithms/pg64064/)의 `frozenset`과 [블록 이동하기](/Hongs_Blog/studies/algorithms/pg60063/)의 정렬한 튜플이 그 이름표다. 그 밖에 [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/), [깊이 우선 탐색(DFS)](/Hongs_Blog/studies/algorithms/dfs/), [최소 신장 트리](/Hongs_Blog/studies/algorithms/mst/), [호텔 방 배정](/Hongs_Blog/studies/algorithms/pg64063/), [문자열과 알파벳과 쿼리](/Hongs_Blog/studies/algorithms/pg389632/), [코딩 테스트 공부](/Hongs_Blog/studies/algorithms/pg118668/)에서도 쓴다.

## 연결

- 선수: [관계와 그 성질](/Hongs_Blog/studies/discrete-math/relations/)
- 이어지는 개념: [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)(mod $$n$$의 동치류), 그래프의 [연결 성분](/Hongs_Blog/studies/discrete-math/connectivity/)
- 대조: [부분순서](/Hongs_Blog/studies/discrete-math/partial-orders/)는 대칭 대신 반대칭을 요구해 "무리 짓기"가 아니라 "줄 세우기"가 된다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 동치관계의 세 조건을 쓰고, 동치관계와 분할이 어떻게 서로를 만드는지 한 줄씩 설명하라.</summary>

**답:** 반사, 대칭, 추이. 동치관계 → 각 원소의 동치류를 모으면 분할. 분할 → "같은 조각에 있다"가 동치관계.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 길이 3 이하인 0·1 문자열 집합에서 "1의 개수가 같다"는 동치관계다. 동치류는 몇 개이고 각각 몇 원소인가? (빈 문자열 포함)</summary>

**답:** 1의 개수 0, 1, 2, 3에 따라 4개. 크기는 0개인 류: 길이 0~3의 전부 0인 문자열 4개, 1개인 류: 1 + 2 + 3 = 6개, 2개인 류: 1 + 3 = 4개, 3개인 류: 1개. 합 15 = $$1 + 2 + 4 + 8$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 동치관계의 세 조건 중 추이성이 빠지면 무엇이 잘못되는지 예를 들어 보여라.</summary>

**답:** "차가 1 이하"는 반사·대칭이지만 0~1, 1~2인데 0과 2는 아니다. 무리를 지으려 하면 1이 0의 무리와 2의 무리에 모두 들어가야 해서 무리가 겹친다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 10장(동치관계). Rosen, *Discrete Mathematics and Its Applications* 7판, 9장 "Relations"(동치관계와 분할).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 유니온-파인드의 경로 압축과 랭크 합치기를 함께 쓰면 연산당 비용이 역아커만 함수 $$\alpha(n)$$로 사실상 상수다(Cormen et al., *Introduction to Algorithms* 3판, 21장).
{% endraw %}
