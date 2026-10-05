---
layout: "note"
title: "등비급수"
display_title: "등비급수 (Geometric Series)"
kind: "concept"
kind_label: "정리"
num: "21"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Geometric Series", "등비수열의 합", "무한 등비급수", "infinite geometric series", "공비", "common ratio", "두 배 늘리기", "doubling"]
description: "같은 비율로 곱해 가는 수들을 더한 합에는 간단한 공식이 있다. 비율이 1보다 크면 합이 마지막 항의 몇 배 정도라서 \"마지막 항이 거의 전부\"이고, 1보다 작으면 합이 첫 항의 몇 배로 묶여서 \"첫 항이 거의 전부\"다. 이것이 동적 배열의 두 배 늘리기가 싼 이유이고, 포화 이진…"
prev_url: "/studies/college-math/sequences-sigma/"
prev_title: "수열과 합의 기호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/geometric-series/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 비율로 곱해 가는 수들을 더한 합에는 간단한 공식이 있다. 비율이 1보다 크면 합이 마지막 항의 몇 배 정도라서 "마지막 항이 거의 전부"이고, 1보다 작으면 합이 첫 항의 몇 배로 묶여서 "첫 항이 거의 전부"다. 이것이 동적 배열의 두 배 늘리기가 싼 이유이고, 포화 이진 트리의 노드 절반 이상이 잎인 이유다. 끝없이 더할 때는 비율의 크기가 1보다 작아야만 합이 유한하다.

</div>


## 예시로 보기

파이썬 리스트처럼 꽉 차면 용량을 두 배로 늘리는 배열에 원소 1,000개를 넣는다. 용량은 1, 2, 4, …, 512, 1024로 늘고, 늘릴 때마다 기존 원소를 새 공간에 복사한다. 복사는 모두 몇 번일까?

$$1 + 2 + 4 + \cdots + 512 = 1023$$


넣은 원소 1,000개의 두 배도 안 된다. 원소 하나를 넣을 때 평균 복사가 1번 남짓이다. 늘 마지막으로 늘린 한 번(512)이 전체의 절반을 차지한다. 여기서 1이 아래 정리의 첫 항, 2가 비율 $$r$$, 늘린 횟수 10이 항 개수 $$n$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

비율 $$r \ne 1$$이면

$$\sum_{k=0}^{n-1} r^k = 1 + r + r^2 + \cdots + r^{n-1} = \frac{r^n - 1}{r - 1}$$

이다. $$r = 1$$이면 합은 $$n$$이다[^1]. 첫 항이 $$a$$이면 전체에 $$a$$를 곱한다.

**무한 등비급수.** $$\vert r\vert  < 1$$이면 $$\displaystyle\sum_{k=0}^{\infty} r^k = \frac{1}{1 - r}$$이다. $$\vert r\vert  \ge 1$$이면 부분합이 한 값에 다가가지 않는다(발산).

</div>


두 가지 결과가 알고리즘 분석에서 반복해 쓰인다.
- $$r = 2$$: $$1 + 2 + \cdots + 2^k = 2^{k+1} - 1 < 2 \cdot 2^k$$. 합이 마지막 항의 두 배보다 작다.
- $$0 < r < 1$$: 몇 개를 더하든 $$\sum r^k < \frac{1}{1 - r}$$. 합이 첫 항의 상수배로 묶인다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

합을 $$S$$라 하고 $$r$$을 곱하면 $$rS = r + r^2 + \cdots + r^n$$이다. $$rS - S$$를 계산하면 가운데 항이 모두 지워져 $$r^n - 1$$만 남는다(망원합). $$r \ne 1$$이므로 $$S = \dfrac{r^n - 1}{r - 1}$$.

$$\vert r\vert  < 1$$이면 $$n$$이 커질 때 $$r^n$$이 $$0$$으로 다가가므로 $$S \to \dfrac{0 - 1}{r - 1} = \dfrac{1}{1 - r}$$. $$r^n \to 0$$의 엄밀한 증명은 미분적분학의 [수열의 극한](/Hongs_Blog/studies/calculus/sequence-limits/)에서 한다. ∎

</details>


## 예제

**반복되는 소수.** $$0.121212\ldots$$를 분수로 쓴다.

1. *등비급수로 쓰기:* $$0.12 + 0.0012 + 0.000012 + \cdots$$는 첫 항 $$\frac{12}{100}$$, 비율 $$\frac{1}{100}$$이다.
2. *공식:* $$\dfrac{12/100}{1 - 1/100} = \dfrac{12}{99} = \dfrac{4}{33}$$.
3. *같은 방법:* $$0.999\ldots = \dfrac{9/10}{1 - 1/10} = 1$$이다. 두 표기는 같은 수다.

**포화 이진 트리.** 모든 층이 꽉 찬 이진 트리(포화 이진 트리)는 높이가 $$h$$일 때 깊이 $$d$$에는 노드가 $$2^d$$개 있다. 전체는 $$\sum_{d=0}^{h} 2^d = 2^{h+1} - 1$$개이고, 잎은 $$2^h$$개로 절반보다 많다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 공식을 유리수 비율 70여 개 × $$n < 25$$에서 정확히 확인, $$2^{k+1} - 1$$, 부분합이 2와 10에 다가감, 반복 소수, 동적 배열 시뮬레이션(복사 1,023번), 이진 트리, 발산하는 경우 — [21_geometric-series_verify.py](/Hongs_Blog/studies/college-math/code/21_geometric-series_verify/)</div>

</div>


## 활용

- **동적 배열.** 두 배로 늘리면 $$n$$개를 넣는 총비용이 $$O(n)$$, 한 번 넣는 평균 비용이 상수다. 늘릴 때 두 배가 아니라 "10칸씩" 늘리면 복사가 등차급수가 되어 총비용이 $$n^2$$에 비례한다[^2].
- **분할 정복.** 문제를 반으로 줄이며 단계마다 비용이 절반이 되면 전체가 첫 단계의 두 배 이하로 묶인다. [마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/)의 세 경우가 곧 "비율이 1보다 큰가, 같은가, 작은가"다.
- **재시도 대기.** [지수 백오프](/Hongs_Blog/studies/college-math/exponential-function/)로 $$k$$번 재시도한 총 대기 시간은 $$1 + 2 + \cdots + 2^{k-1} = 2^k - 1$$ 단위다.
- **1의 제곱근.** 1의 $$n$$제곱근([복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/))의 합 $$\sum_{k=0}^{n-1}\omega^k = \frac{\omega^n - 1}{\omega - 1} = 0$$도 복소수 비율 $$\omega$$의 등비급수다.
- 알고리즘에서: 늘리는 비율이 2가 아니어도 1보다 크기만 하면 복사 합이 넣은 개수의 상수배라서, 파이썬 리스트의 `append`가 평균 $$O(1)$$이다([리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/)). 위 예제의 포화 이진 트리의 노드 수 1, 3, 7, 15, …를 [트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/)에서 쓴다. 세그먼트 트리의 노드 수가 맨 아래층 노드 수의 두 배보다 적은 것도 이 합 때문이다([세그먼트 트리와 스위핑](/Hongs_Blog/studies/algorithms/segment-tree-sweep/)). 그 밖에 [표현 가능한 이진트리](/Hongs_Blog/studies/algorithms/pg150367/), [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)에서도 쓴다.

## 연결

- 선수: [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/), [거듭제곱과 지수법칙](/Hongs_Blog/studies/college-math/exponent-laws/)
- 이어지는 곳: 이산수학의 [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)·[합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)·[마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/), 미분적분학의 [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/), 확률과 통계의 [기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$1 + r + \dots + r^{n-1} = \frac{r^n - 1}{r - 1}$$을 유도하라. $$r = 1$$이면 왜 이 공식을 쓸 수 없는가?</summary>

**답:** 합 $$S$$에 $$r$$을 곱해 $$rS - S$$를 계산하면 가운데 항이 지워져 $$r^n - 1$$이 남는다. $$S(r - 1) = r^n - 1$$에서 $$r - 1$$로 나눈다. $$r = 1$$이면 $$0$$으로 나누게 되므로 쓸 수 없고, 그때 합은 1이 $$n$$개라 $$n$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 용량 1에서 시작해 꽉 차면 두 배로 늘리는 배열에 원소 1,000개를 넣는다. 복사는 모두 몇 번이고, 최종 용량은?</summary>

**답:** 용량 1, 2, …, 512가 찰 때마다 복사하므로 $$1 + 2 + \cdots + 512 = 1023$$번. 최종 용량 1024.

**흔한 오답:** 1024까지 더해 2047이라고 하는 것. 1,000번째 원소를 넣은 뒤에는 용량 1024가 아직 차지 않아 복사가 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 비율 r = 2, r = 1/2, r = 1, r = −1인 등비급수에서 항을 계속 더하면 부분합은 각각 어떻게 되는가? 유한 합에서 가장 큰 몫을 차지하는 항은 어느 쪽인가?</summary>

**답:** $$r = 2$$: 한없이 커지고, 마지막 항이 합의 절반 이상이다. $$r = 1/2$$: 2에 다가가고, 첫 항이 합의 절반 이상이다. $$r = 1$$: 항 개수 $$n$$만큼 커진다. $$r = -1$$: 1, 0, 1, 0, …으로 오가며 한 값에 다가가지 않는다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 11.4절 "Series and Their Notations"(유한·무한 등비급수)
[^2]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 부록 A.1 "Summation formulas and properties"(등비급수), 17.4절 "Dynamic tables"(두 배 늘리는 표의 분할상환 비용)
{% endraw %}
