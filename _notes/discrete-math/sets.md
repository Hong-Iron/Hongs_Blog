---
layout: "note"
title: "집합"
display_title: "집합 (Sets)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Set", "집합", "원소", "element", "부분집합", "subset", "공집합", "empty set", "합집합", "union", "교집합", "intersection", "차집합", "difference", "여집합", "complement", "멱집합", "power set", "곱집합", "Cartesian product", "벤 다이어그램", "Venn diagram", "러셀의 역설", "Russell's paradox"]
description: "집합은 순서와 중복을 따지지 않는 \"원소의 모음\"이다. 합집합·교집합·차집합으로 모음을 조합하고, 부분집합을 모두 모은 멱집합, 순서쌍을 모은 곱집합으로 새 집합을 만든다. 데이터베이스의 표, 타입, 권한 그룹이 모두 집합이다. 다만 \"자기 자신을 원소로 갖지 않는 모든 집합의 집…"
prev_url: "/studies/discrete-math/boolean-algebra/"
prev_title: "불 대수와 논리 회로"
next_url: "/studies/discrete-math/function-properties/"
next_title: "함수의 성질과 집합의 크기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/sets/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

집합은 순서와 중복을 따지지 않는 "원소의 모음"이다. 합집합·교집합·차집합으로 모음을 조합하고, 부분집합을 모두 모은 멱집합, 순서쌍을 모은 곱집합으로 새 집합을 만든다. 데이터베이스의 표, 타입, 권한 그룹이 모두 집합이다. 다만 "자기 자신을 원소로 갖지 않는 모든 집합의 집합"처럼 아무 조건으로나 모으면 모순이 생긴다.

</div>


## 예시로 보기

동아리 A에 1, 2, 3, 4번 학생이, 동아리 B에 3, 4, 5번 학생이 있다.

| 연산 | 뜻 | 결과 | 파이썬 |
|---|---|---|---|
| $$A \cup B$$ | 둘 중 하나라도 속한 학생 | $$\{1,2,3,4,5\}$$ | `A \| B` |
| $$A \cap B$$ | 둘 다 속한 학생 | $$\{3,4\}$$ | `A & B` |
| $$A - B$$ | A에만 속한 학생 | $$\{1,2\}$$ | `A - B` |
| $$A \oplus B$$ | 한쪽에만 속한 학생 | $$\{1,2,5\}$$ | `A ^ B` |

원소가 집합에 속하는지를 참·거짓으로 보면, 합집합은 "또는", 교집합은 "그리고", 여집합은 "아니다"다. 그래서 [논리의 동치 법칙](/Hongs_Blog/studies/discrete-math/logical-equivalence/)이 그대로 집합의 항등식이 된다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$x \in A$$는 "$$x$$가 집합 $$A$$의 원소"라는 뜻이다. 집합은 원소로 정해진다: 원소가 모두 같으면 같은 집합이다. 전체집합 $$U$$ 안에서[^1]
- 부분집합: $$A \subseteq B \iff \forall x\,(x \in A \to x \in B)$$($$\forall$$은 "모든"). 진부분집합 $$A \subsetneq B$$는 $$A \subseteq B$$이고 $$A \ne B$$.
- 공집합 $$\varnothing$$: 원소가 없는 집합. 모든 집합의 부분집합이다.
- $$A \cup B = \{x : x \in A \vee x \in B\}$$, $$\ A \cap B = \{x : x \in A \wedge x \in B\}$$, $$\ A - B = \{x : x \in A \wedge x \notin B\}$$, $$\ \bar A = U - A$$
- 멱집합 $$\mathcal{P}(A)$$: $$A$$의 모든 부분집합의 집합. $$\vert A\vert  = n$$이면 $$\vert \mathcal{P}(A)\vert  = 2^n$$.
- 곱집합 $$A \times B = \{(a, b) : a \in A, b \in B\}$$. 순서쌍이라 $$(a, b) \ne (b, a)$$일 수 있다. $$\vert A \times B\vert  = \vert A\vert \,\vert B\vert $$.

</div>


$$\{x : \text{조건}\}$$ 꼴을 조건제시법이라 한다. 조건을 아무렇게나 쓰면 모순이 생긴다. $$R = \{X : X \notin X\}$$라 하면 $$R \in R$$이든 아니든 모순이다(러셀의 역설). 그래서 수학에서는 이미 있는 집합에서 원소를 골라내는 방식으로만 조건제시를 허용한다[^s1].

**증명 방법: 양쪽 포함.** 두 집합이 같음을 보이려면 $$A \subseteq B$$와 $$B \subseteq A$$를 각각 보인다. 원소 하나를 잡고 따라가며 보이므로 원소 추적이라고도 한다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">집합의 드모르간 법칙</div>

$$A - (B \cup C) = (A - B) \cap (A - C)$$, $$\quad A - (B \cap C) = (A - B) \cup (A - C)$$

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

첫째 식을 원소 추적으로 보인다. $$x \in A - (B \cup C)$$ $$\iff$$ $$x \in A \wedge \neg(x \in B \vee x \in C)$$ $$\iff$$ $$x \in A \wedge x \notin B \wedge x \notin C$$ (논리의 드모르간) $$\iff$$ $$(x \in A \wedge x \notin B) \wedge (x \in A \wedge x \notin C)$$ $$\iff$$ $$x \in (A - B) \cap (A - C)$$. 각 단계가 $$\iff$$이므로 양쪽 포함이 한 번에 된다. 둘째 식도 같다. ∎

</details>


## 예제

$$A = \{1,2,3,4\}$$, $$B = \{3,4,5\}$$에서 $$\mathcal{P}(A \cap B)$$를 구한다.

1. *교집합:* $$A \cap B = \{3, 4\}$$.
2. *부분집합 늘어놓기:* 원소마다 넣을지 뺄지 두 가지씩이다. $$\varnothing, \{3\}, \{4\}, \{3,4\}$$.
3. *개수 확인:* $$2^2 = 4$$개다. 공집합과 자기 자신도 부분집합이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 부분집합 3,000조에서 드모르간·분배, $$\vert \mathcal{P}(A)\vert  = 2^n$$, $$\vert A \times B\vert $$, 예시와 예제, 비트마스크 연산, $$\varnothing \ne \{\varnothing\}$$ — [06_sets_verify.py](/Hongs_Blog/studies/discrete-math/code/06_sets_verify/)</div>

</div>


## 활용

- **비트 집합.** $$\{0, 1, \dots, n - 1\}$$의 부분집합을 $$n$$비트 정수로 쓴다. $$i$$가 들어 있으면 $$i$$번째 비트가 1이다. 합집합은 <code>&#124;</code>, 교집합은 `&`, 차집합은 `& ~`로 한 번에 계산한다. $$\{0, 2, 3\}$$은 $$1101_2 = 13$$이다. 0부터 $$2^n - 1$$까지 세면 모든 부분집합을 돈다.
- **데이터베이스.** SQL의 `UNION`, `INTERSECT`, `EXCEPT`가 집합 연산이다. 관계형 모델의 표 하나는 곱집합의 부분집합이다([관계](/Hongs_Blog/studies/discrete-math/relations/)).
- **자료구조.** 해시 집합(`set`)은 원소 확인을 평균 상수 시간에 한다. 중복 제거는 리스트를 집합으로 바꾸는 것이다.
- 알고리즘에서: 해시 집합이 원소를 빨리 찾는 원리는 [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)에 있다. 위의 비트 집합을 코딩테스트에서 쓰는 법은 [비트 연산과 비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/)에 있고, [비밀지도](/Hongs_Blog/studies/algorithms/pg17681/)는 두 지도의 벽 칸 집합을 줄마다 <code>a &#124; b</code>(합집합)로 겹친다. [순위 검색](/Hongs_Blog/studies/algorithms/pg72412/)은 네 칸마다 그 값과 `-` 중 하나를 고르는 곱집합으로, 지원자마다 조건 모양 $$2^4 = 16$$개를 만든다. 그 밖에 [미로 탈출](/Hongs_Blog/studies/algorithms/pg81304/), [뉴스 클러스터링](/Hongs_Blog/studies/algorithms/pg17677/), [완주하지 못한 선수](/Hongs_Blog/studies/algorithms/pg42576/), [신고 결과 받기](/Hongs_Blog/studies/algorithms/pg92334/), [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/), [이분 매칭](/Hongs_Blog/studies/algorithms/bipartite-matching/), [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/)에서도 쓴다.

## 연결

- 선수: [명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/)
- 이어지는 개념: [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/), [관계와 그 성질](/Hongs_Blog/studies/discrete-math/relations/), 확률과 통계의 [표본공간과 사건](/Hongs_Blog/studies/probability-statistics/sample-space/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"∅와 {∅}는 같다"</div>

틀렸다. 둘 다 "비어 있는" 느낌이라 같아 보인다. $$\varnothing$$은 원소가 없는 집합이고, $$\{\varnothing\}$$은 공집합 하나를 원소로 가진 집합이다. 크기가 0과 1로 다르다. 빈 상자와 "빈 상자가 하나 든 상자"의 차이다. $$\mathcal{P}(\varnothing) = \{\varnothing\}$$이라 크기가 $$2^0 = 1$$인 것으로도 확인된다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** A = {1,2,3,4}, B = {3,4,5}일 때 A ∪ B, A ∩ B, A − B, B − A와 𝒫(A ∩ B)의 크기를 구하라.</summary>

**답:** $$\{1,2,3,4,5\}$$, $$\{3,4\}$$, $$\{1,2\}$$, $$\{5\}$$, $$2^2 = 4$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** A − (B ∪ C) = (A − B) ∩ (A − C)를 원소 추적으로 증명하고, 어느 단계에서 논리의 드모르간 법칙을 쓰는지 밝혀라.</summary>

**답:** $$x \in A - (B \cup C) \iff x \in A \wedge \neg(x \in B \vee x \in C) \iff x \in A \wedge x \notin B \wedge x \notin C \iff x \in (A - B) \cap (A - C)$$. 두 번째 $$\iff$$에서 $$\neg(p \vee q) \equiv \neg p \wedge \neg q$$를 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** {0,1,2,3}의 부분집합을 4비트 정수로 쓴다. A = {0,2,3}, B = {1,2}를 정수로 쓰고, A ∪ B와 A ∩ B를 비트 연산으로 구하라.</summary>

**답:** $$A = 1101_2 = 13$$, $$B = 0110_2 = 6$$. $$A \cup B$$ = <code>13 &#124; 6</code> $$= 1111_2 = 15$$ = $$\{0,1,2,3\}$$. $$A \cap B$$ = `13 & 6` $$= 0100_2 = 4$$ = $$\{2\}$$.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 4장 "Mathematical Data Types"(집합). Rosen, *Discrete Mathematics and Its Applications* 7판, 2장(집합, 집합 연산).
[^s1]: 에이전트 보충. 러셀의 역설과 이를 피하는 분리 공리는 공리적 집합론(ZFC)의 내용이다.
{% endraw %}
