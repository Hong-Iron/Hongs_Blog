---
layout: "note"
title: "포함-배제 원리"
display_title: "포함-배제 원리 (Inclusion-Exclusion Principle)"
kind: "concept"
kind_label: "정리"
num: "19"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Inclusion-Exclusion Principle", "포함-배제", "포함배제", "교란순열", "derangement", "모자 문제", "hat-check problem", "전사 함수의 수", "surjections"]
description: "겹치는 모음들의 합집합 크기를 셀 때, 각 크기를 그냥 더하면 겹친 부분이 여러 번 세어진다. 둘이 겹친 부분을 빼고, 셋이 겹친 부분은 다시 더하는 식으로 번갈아 고쳐 정확한 수를 얻는다. 여러 조건을 \"모두 피하는\" 경우의 수를 셀 때 특히 강하다. 다만 모음이 많아지면 더하고…"
prev_url: "/studies/discrete-math/binomial-theorem/"
prev_title: "이항정리"
next_url: "/studies/discrete-math/pigeonhole/"
next_title: "비둘기집 원리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/discrete-math/inclusion-exclusion/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

겹치는 모음들의 합집합 크기를 셀 때, 각 크기를 그냥 더하면 겹친 부분이 여러 번 세어진다. 둘이 겹친 부분을 빼고, 셋이 겹친 부분은 다시 더하는 식으로 번갈아 고쳐 정확한 수를 얻는다. 여러 조건을 "모두 피하는" 경우의 수를 셀 때 특히 강하다. 다만 모음이 많아지면 더하고 빼야 할 항이 급격히 늘어난다.

</div>


## 예시로 보기

1부터 1000까지 중 2, 3, 5 중 하나 이상으로 나누어떨어지는 수를 센다.

| 단계 | 셈 | 값 |
|---|---|---|
| 하나씩 더하기 | 2의 배수 500, 3의 배수 333, 5의 배수 200 | +1033 |
| 둘씩 겹침 빼기 | 6의 배수 166, 10의 배수 100, 15의 배수 66 | −332 |
| 셋 겹침 다시 더하기 | 30의 배수 33 | +33 |
| 합 | | **734** |

30의 배수(예: 30)는 첫 줄에서 세 번 더해지고 둘째 줄에서 세 번 빠져 0번이 되므로, 셋째 줄에서 한 번 더해 정확히 1번이 된다. 2·3·5의 배수가 아래 정리의 $$A_1, A_2, A_3$$이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/discrete-math/19_inclusion-exclusion_fig2.svg" alt="그림" loading="lazy">

원 셋이 2·3·5의 배수이고, 칸의 수는 그 칸에만 드는 수의 개수다. 원 하나에 든 칸을 더하면 그 원의 크기(500, 333, 200)가 되고, 일곱 칸을 모두 더하면 734다. 가운데 33이 세 원에 모두 드는 30의 배수다[^s2].

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">포함-배제 원리</div>

유한 집합 $$A_1, \dots, A_m$$에 대해[^1]

$$\vert A_1 \cup \cdots \cup A_m\vert  = \sum_{i}\vert A_i\vert  - \sum_{i<j}\vert A_i \cap A_j\vert  + \sum_{i<j<l}\vert A_i \cap A_j \cap A_l\vert  - \cdots + (-1)^{m+1}\vert A_1 \cap \cdots \cap A_m\vert $$

즉 $$j$$개씩 고른 교집합의 크기들을 $$(-1)^{j+1}$$ 부호로 더한다. $$m = 2$$이면 $$\vert A \cup B\vert  = \vert A\vert  + \vert B\vert  - \vert A \cap B\vert $$다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

합집합의 원소 $$x$$가 정확히 $$t \ge 1$$개의 $$A_i$$에 속한다고 하자. $$j$$개씩의 교집합 중 $$x$$를 포함하는 것은 그 $$t$$개에서 $$j$$개를 고른 $$\binom{t}{j}$$개다. 그래서 오른쪽에서 $$x$$가 세어지는 횟수는

$$\sum_{j=1}^{t}(-1)^{j+1}\binom{t}{j} = 1 - \sum_{j=0}^{t}(-1)^{j}\binom{t}{j} = 1 - (1 - 1)^t = 1$$

이다. 마지막 등호는 [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)다. 합집합 밖의 원소는 한 번도 세어지지 않는다. ∎

</details>


## 예제

**교란순열(모자 문제).** 4명이 맡긴 모자를 아무렇게나 돌려줄 때, 아무도 자기 모자를 받지 못하는 경우는 몇 가지인가?

1. *나쁜 사건 정하기:* $$A_i$$ = "$$i$$번째 사람이 자기 모자를 받는다". 원하는 것은 $$4! - \vert A_1 \cup \cdots \cup A_4\vert $$.
2. *교집합 크기:* 특정한 $$j$$명이 자기 모자를 받는 경우는 나머지 $$4 - j$$개를 아무렇게나 주는 $$(4 - j)!$$가지. 그런 $$j$$명 조합은 $$\binom{4}{j}$$개.
3. *포함-배제:* $$\vert \bigcup A_i\vert  = \binom41 3! - \binom42 2! + \binom43 1! - \binom44 0! = 24 - 12 + 4 - 1 = 15$$.
4. *답:* $$24 - 15 = 9$$가지.

일반적으로 $$D_n = n!\sum_{k=0}^{n}\frac{(-1)^k}{k!}$$이고, 아무도 자기 모자를 받지 못할 확률 $$D_n / n!$$은 $$n$$이 커지면 $$1/e \approx 0.368$$에 다가간다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/discrete-math/19_inclusion-exclusion_fig1.svg" alt="그림" loading="lazy">

확률은 0.5, 0.333, 0.375처럼 $$1/e$$ 위아래를 번갈아 넘으며 다가간다. 6명이면 이미 0.368이라, 그 뒤로는 사람이 늘어도 확률이 거의 그대로다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 집합 1~5개 2,000회에서 공식 = 합집합 크기, 734를 전수로 확인, 교란순열 $$D_1 \dots D_6$$을 전수로 세어 공식과 비교, $$D_{10}/10! \approx 1/e$$, 전사 150, 원소가 한 번씩 세어짐 — [19_inclusion-exclusion_verify.py](/Hongs_Blog/studies/discrete-math/code/19_inclusion-exclusion_verify/)</div>

</div>


## 활용

- **조건을 모두 피하는 경우.** "어느 서버도 비지 않게 작업 배분"(전사 함수의 수), "금지된 패턴이 하나도 없는 문자열", "자기 자리에 앉지 않는 좌석 배치"가 모두 포함-배제다. 서로 다른 작업 5개를 서버 3대에 빈 곳 없이 나누는 수는 $$3^5 - \binom31 2^5 + \binom32 1^5 = 150$$이다.
- **소수와 서로소.** $$n$$ 이하에서 $$n$$과 서로소인 수의 개수(오일러 파이 함수)를 $$n$$의 소인수들로 포함-배제해 구한다([페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/)).
- **데이터 분석.** 여러 조건을 만족하는 사용자 수를 집계할 때, 조건별 집계를 그냥 더하면 겹친 사용자를 여러 번 센다.
- 알고리즘에서: 칸에 적힌 수의 합도 개수처럼 겹친 부분을 빼서 고치므로, 2차원 [누적 합](/Hongs_Blog/studies/algorithms/prefix-sum/)은 직사각형 안의 합을 네 값의 더하기·빼기로 구한다. 직사각형 $$N$$개가 덮는 넓이도 포함-배제로 쓸 수 있지만 교집합 항이 $$2^N - 1$$개라, [직사각형의 넓이](/Hongs_Blog/studies/algorithms/pg12974/)는 [세그먼트 트리와 스위핑](/Hongs_Blog/studies/algorithms/segment-tree-sweep/)으로 $$O(N \log N)$$에 구한다. 원소를 하나씩 늘어놓을 수 있으면 [프렌즈4블록](/Hongs_Blog/studies/algorithms/pg17679/)처럼 집합에 모아 합집합 크기를 바로 세는 편이 간단하다.

## 연결

- 선수: [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)(겹치지 않을 때의 합), [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)(증명)
- 이어지는 개념: 확률의 합사건 공식 $$\Pr[A \cup B] = \Pr[A] + \Pr[B] - \Pr[A \cap B]$$([확률의 공리와 계산](/Hongs_Blog/studies/probability-statistics/probability-axioms/))

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 1부터 1000까지 중 2, 3, 5 중 적어도 하나로 나누어떨어지는 수는 몇 개인가?</summary>

**답:** $$500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$$.

**흔한 오답:** 셋이 모두 겹친 30의 배수를 다시 더하지 않아 701로 답하는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 세 집합 모두에 속한 원소가 포함-배제 식에서 정확히 한 번 세어지는 이유를 계산으로 보여라.</summary>

**답:** 하나씩 더할 때 3번($$\binom31$$), 둘씩 뺄 때 3번($$\binom32$$), 셋을 더할 때 1번($$\binom33$$)이라 $$3 - 3 + 1 = 1$$번이다. 일반적으로 $$t$$개에 속하면 $$1 - (1 - 1)^t = 1$$번이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 4명이 모자를 돌려받을 때 아무도 자기 모자를 받지 못하는 경우의 수를 포함-배제로 구하라.</summary>

**답:** $$4! - \left[\binom41 3! - \binom42 2! + \binom43 1! - \binom44 0!\right] = 24 - 15 = 9$$.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장 "Cardinality Rules"(포함-배제). Rosen, *Discrete Mathematics and Its Applications* 7판, 8장 "Advanced Counting Techniques"(포함-배제의 응용, 교란순열).
[^s1]: 에이전트 보충. 그림 한 장은 원본에 없다. [19_inclusion-exclusion_plot.py](/Hongs_Blog/studies/discrete-math/code/19_inclusion-exclusion_plot/)로 그렸고, $$D_1, \dots, D_6 = 0, 1, 2, 9, 44, 265$$, $$D_6/6! \approx 0.368$$, $$\vert D_{10}/10! - 1/e\vert  < 10^{-7}$$을 같은 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 한 장은 원본에 없다. [19_inclusion-exclusion_plot.py](/Hongs_Blog/studies/discrete-math/code/19_inclusion-exclusion_plot/)로 그렸고, 일곱 칸의 수(267, 134, 67, 133, 67, 33, 33)와 합 734, 원 밖의 266을 같은 코드로 확인했다.
{% endraw %}
