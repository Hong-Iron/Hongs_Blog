---
layout: "note"
title: "순열과 조합"
display_title: "순열과 조합 (Permutations and Combinations)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Permutations", "Combinations", "순열", "조합", "이항계수", "binomial coefficient", "nCk", "nPk", "계승", "factorial", "파스칼 항등식", "Pascal's identity", "격자 경로", "lattice path"]
description: "여러 개 중 몇 개를 뽑을 때, 뽑은 순서가 중요하면 순열이고 중요하지 않으면 조합이다. 순열은 자리마다 남은 것 중 하나를 고르는 곱이고, 조합은 그 순열을 \"같은 묶음을 늘어놓는 방법의 수\"로 나눈 것이다. 조합은 부분집합의 수, 길찾기의 경로 수, 확률 계산 어디에나 나온다.…"
prev_url: "/studies/discrete-math/counting-rules/"
prev_title: "셈의 기본 법칙"
next_url: "/studies/discrete-math/multiset-counting/"
next_title: "중복을 허용하는 셈"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/permutations-combinations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 개 중 몇 개를 뽑을 때, 뽑은 순서가 중요하면 순열이고 중요하지 않으면 조합이다. 순열은 자리마다 남은 것 중 하나를 고르는 곱이고, 조합은 그 순열을 "같은 묶음을 늘어놓는 방법의 수"로 나눈 것이다. 조합은 부분집합의 수, 길찾기의 경로 수, 확률 계산 어디에나 나온다. 다만 뽑은 것을 다시 뽑을 수 있으면(중복 허용) 공식이 달라진다.

</div>


## 예시로 보기

동아리 10명 중에서 뽑는다.

- **회장·부회장·총무를 뽑는다(순서 중요).** 회장 10가지, 부회장 9가지, 총무 8가지로 $$10 \cdot 9 \cdot 8 = 720$$가지다.
- **대표 위원 3명을 뽑는다(순서 무관).** 위원 {가, 나, 다}는 직책이 없으니, 위의 720가지 중 같은 세 사람을 직책만 바꿔 앉힌 $$3! = 6$$가지가 모두 한 경우다. 그래서 $$720 / 6 = 120$$가지다.

10명이 아래 정의의 $$n$$, 뽑는 3명이 $$k$$, 직책을 바꿔 앉히는 수 $$3!$$이 나누는 수다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

정수 $$0 \le k \le n$$에 대해 $$n! = n(n-1)\cdots 2 \cdot 1$$, $$0! = 1$$이라 하자[^1].
- **순열:** 서로 다른 $$n$$개에서 $$k$$개를 골라 **순서대로** 늘어놓는 수 $$P(n, k) = n(n-1)\cdots(n-k+1) = \dfrac{n!}{(n-k)!}$$
- **조합:** 서로 다른 $$n$$개에서 $$k$$개를 **순서 없이** 고르는 수, 즉 $$k$$원소 부분집합의 수 $$\dbinom{n}{k} = C(n, k) = \dfrac{n!}{k!\,(n-k)!}$$
- 둘 사이의 관계: $$P(n, k) = \dbinom{n}{k} \cdot k!$$

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. 대칭: $$\dbinom{n}{k} = \dbinom{n}{n-k}$$
2. 파스칼 항등식: $$1 \le k \le n - 1$$이면 $$\dbinom{n}{k} = \dbinom{n-1}{k-1} + \dbinom{n-1}{k}$$

</div>


**설계 이유.** 조합이 순열을 $$k!$$로 나눈 꼴인 것은 [나눗셈 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/) 때문이다. $$k$$개로 된 묶음 하나마다 줄 세우기 $$k!$$개가 대응한다. $$0! = 1$$로 정하는 것은 "아무것도 고르지 않는 방법은 한 가지"라서 $$\binom{n}{0} = \binom{n}{n} = 1$$이 맞게 나오도록 하기 위해서다.

**동치인 다른 정의.** $$\binom{n}{k}$$는 모두 같은 값이다.

| 세는 것 | 근거 |
|---|---|
| $$n$$원소 집합의 $$k$$원소 부분집합 | 정의 |
| 1이 정확히 $$k$$개인 $$n$$비트 문자열 | 1의 위치를 고르는 것과 전단사 |
| 격자에서 오른쪽 $$n - k$$번, 위로 $$k$$번 가는 경로 | "위로"인 걸음의 위치를 고르는 것과 전단사 |
| $$(1 + x)^n$$을 전개했을 때 $$x^k$$의 계수 | [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/) |

**해당하는 예:** $$\binom{5}{2} = 10$$(5명 중 2명의 짝), $$\binom{52}{5} = 2{,}598{,}960$$(포커 패), $$\binom{7}{3} = 35$$(격자 경로). **해당하지 않는 예:** 순서가 있는 뽑기(순열), 같은 것을 여러 번 고를 수 있는 뽑기([중복조합](/Hongs_Blog/studies/discrete-math/multiset-counting/)).

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *대칭:* $$k$$개를 고르는 것은 남길 $$n - k$$개를 고르는 것과 같다(전단사). 식으로도 분모의 $$k!$$과 $$(n-k)!$$이 자리만 바뀐다.
2. *파스칼 항등식 (조합적 증명):* $$n$$명 중 $$k$$명을 고르는 방법을 특정한 한 사람(가)을 기준으로 나눈다. 가를 뽑으면 나머지 $$n - 1$$명에서 $$k - 1$$명을 더 뽑고, 가를 뽑지 않으면 $$n - 1$$명에서 $$k$$명을 뽑는다. 두 경우는 겹치지 않고 모든 경우를 덮으므로 합의 법칙으로 더한다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 파스칼 항등식 증명에서 두 경우가 "겹치지 않고 모두 덮는다"는 것은 왜 참인가?</summary>

어떤 뽑기든 가를 포함하거나 포함하지 않거나 둘 중 정확히 하나다. 그래서 합의 법칙을 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. P(n, k) = C(n, k)·k!을 곱의 법칙으로 읽으면?</summary>

순서 있게 뽑는 것을 두 단계로 나눈다. 먼저 누구를 뽑을지 고르고($$\binom{n}{k}$$가지), 그다음 그 $$k$$명을 줄 세운다($$k!$$가지).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

순서를 세고 나서, 순서 때문에 여러 번 센 만큼 나눈다. 같은 값을 여러 방법으로 세면 항등식이 증명된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓰는 다른 상황은?</summary>

[삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)의 "같은 거리를 두 번 재기"처럼 같은 양을 두 가지로 계산하는 증명이다. [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)의 여러 항등식이 이 방식으로 증명된다.

</details>


## 예제

**포커의 풀하우스.** 52장(숫자 13종 × 무늬 4종)에서 5장을 받을 때, 같은 숫자 3장과 다른 같은 숫자 2장인 패의 수.

1. *세 장짜리 숫자:* 13가지 중 하나.
2. *그 숫자의 무늬 3개:* $$\binom{4}{3} = 4$$가지.
3. *두 장짜리 숫자:* 남은 12가지 중 하나.
4. *그 숫자의 무늬 2개:* $$\binom{4}{2} = 6$$가지.
5. *곱:* $$13 \cdot 4 \cdot 12 \cdot 6 = 3{,}744$$. 전체 $$\binom{52}{5} = 2{,}598{,}960$$이므로 확률은 약 0.14%.

숫자 두 개를 $$\binom{13}{2}$$로 고르면 틀린다. 세 장짜리와 두 장짜리는 역할이 달라 순서가 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 작은 $$n$$에서 순열·조합을 전수로 세어 공식·대칭·파스칼 확인, 풀하우스 공식을 20장 덱에서 전수로 센 480과 비교, 격자 경로 35, $$\binom{2n}{n}$$의 어림 — [15_permutations-combinations_verify.py](/Hongs_Blog/studies/discrete-math/code/15_permutations-combinations_verify/)</div>

</div>


## 활용

- **네트워크.** 노드 $$n$$개를 모두 직접 잇는 링크 수는 두 노드의 짝 $$\binom{n}{2} = \frac{n(n-1)}{2}$$이다([점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)).
- **알고리즘 비용.** 크기 $$k$$인 부분집합을 모두 검사하는 알고리즘은 $$\binom{n}{k}$$번 돈다. $$k$$가 고정이면 $$n^k$$ 정도, $$k = n/2$$이면 $$\binom{n}{n/2} \approx \frac{4^{n/2}}{\sqrt{\pi n/2}}$$로 지수적이다.
- **계산.** 파이썬 `math.comb(n, k)`, `math.perm(n, k)`. 고정 폭 정수로 $$n!$$을 먼저 계산하면 금방 넘치므로, 파스칼 삼각형을 채우거나 곱하고 나누기를 번갈아 한다.
- 알고리즘에서: `combinations`·`permutations`·`product`로 경우를 모두 만들어 보는 방법은 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)에 있다. 순서만 다른 뽑기를 한 번만 세려고 [메뉴 리뉴얼](/Hongs_Blog/studies/algorithms/pg72411/)은 글자를 정렬한 문자열을 키로 쓰고, [불량 사용자](/Hongs_Blog/studies/algorithms/pg64064/)는 묶음마다 배정 수가 달라 $$k!$$로 나눌 수 없어서 고른 사람들을 `frozenset`으로 묶어 센다. 길이 $$n$$인 문자열의 모든 부분 문자열에서 (길이 − 1)을 더한 값은 글자 사이 경계 $$n + 1$$개 중 셋을 고르는 수 $$\binom{n+1}{3}$$이고, [문자열의 아름다움](/Hongs_Blog/studies/algorithms/pg68938/)이 여기서 출발한다. 그 밖에 [가장 많이 받은 선물](/Hongs_Blog/studies/algorithms/pg258712/), [재귀와 백트래킹 예제 사다리](/Hongs_Blog/studies/algorithms/backtracking-ladder/), [시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/), [거리두기 확인하기](/Hongs_Blog/studies/algorithms/pg81302/), [시험장 나누기](/Hongs_Blog/studies/algorithms/pg81305/), [동적 계획법 예제 사다리](/Hongs_Blog/studies/algorithms/dp-ladder/)에서도 쓴다.

## 연결

- 선수: [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)
- 이어지는 개념: [중복을 허용하는 셈](/Hongs_Blog/studies/discrete-math/multiset-counting/), [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/), 확률과 통계의 [이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)
- 대조: [순열·조합·중복조합 비교](/Hongs_Blog/studies/discrete-math/counting-formula-choice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"5명 중 2명을 뽑는 방법은 5 × 4 = 20가지다"</div>

틀렸다. 곱의 법칙으로 "첫째 5명, 둘째 4명"을 곱하면 자연스러워 보인다. 하지만 이 곱은 (가, 나)와 (나, 가)를 다른 것으로 센 순열이다. 순서 없이 두 명을 고르는 것이면 모든 짝이 두 번씩 세어졌으므로 2로 나눠 $$\binom{5}{2} = 10$$이다. 확인하려면 짝을 직접 늘어놓으면 된다: 가나, 가다, 가라, 가마, 나다, 나라, 나마, 다라, 다마, 라마로 10개다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** P(n, k)와 C(n, k)의 공식을 쓰고, 둘 사이의 관계를 한 문장으로 설명하라.</summary>

**답:** $$P(n,k) = \frac{n!}{(n-k)!}$$, $$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$. 순열은 조합을 고른 뒤 그 $$k$$개를 줄 세운 것이라 $$P(n,k) = \binom{n}{k} \cdot k!$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 52장에서 받은 5장이 풀하우스(같은 숫자 3장 + 다른 같은 숫자 2장)인 경우의 수를 구하라.</summary>

**답:** $$13 \cdot \binom{4}{3} \cdot 12 \cdot \binom{4}{2} = 3{,}744$$.

**흔한 오답:** 숫자 둘을 $$\binom{13}{2}$$로 골라 $$\binom{13}{2} \cdot 4 \cdot 6 = 1{,}872$$로 절반만 세는 것. 어느 숫자가 세 장인지까지 정해야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 파스칼 항등식 C(n, k) = C(n−1, k−1) + C(n−1, k)를 조합적으로 증명하라.</summary>

**답:** $$n$$명 중 한 사람 "가"를 정한다. $$k$$명 뽑기는 가를 포함하는 것($$\binom{n-1}{k-1}$$)과 포함하지 않는 것($$\binom{n-1}{k}$$)으로 겹치지 않게 나뉜다. 합의 법칙으로 더한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 격자에서 (0,0)에서 (4,3)까지 오른쪽이나 위로 한 칸씩만 가는 경로의 수를 조합으로 쓰고, 경로를 비트열로 바꾸는 대응을 설명하라.</summary>

**답:** 7걸음 중 위로 가는 3걸음의 위치를 고르므로 $$\binom{7}{3} = 35$$. 오른쪽을 0, 위를 1로 적으면 경로 하나가 1이 3개인 7비트 문자열 하나와 짝지어진다(전단사).

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장 "Cardinality Rules"(순열, 부분집합 세기, 포커 패, 조합적 증명). OpenStax, *Precalculus 2e*, 11.5절 "Counting Principles".
{% endraw %}
