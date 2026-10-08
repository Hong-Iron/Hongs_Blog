---
layout: "note"
title: "합의 계산과 어림"
display_title: "합의 계산과 어림 (Sums and Approximations)"
kind: "concept"
kind_label: "기법"
num: "23"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Sums and Approximations", "합의 계산", "거듭제곱의 합", "조화수", "harmonic number", "교란법", "perturbation method", "스털링 근사", "Stirling's approximation", "계승의 크기", "정렬의 하한"]
description: "반복문 비용을 더한 합을 닫힌 꼴로 구하거나, 닫힌 꼴이 없으면 위아래에서 끼워 크기를 어림한다. 거듭제곱의 합은 차수가 하나 높은 다항식, 등비급수는 가장 큰 항의 상수배, 조화수는 로그만큼 자란다. 알고리즘 분석은 정확한 값보다 이런 \"크기의 모양\"을 원한다. 다만 끼울 때는 …"
prev_url: "/studies/discrete-math/generating-functions/"
prev_title: "생성함수"
next_url: "/studies/discrete-math/asymptotic-notation/"
next_title: "점근 표기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/sums-asymptotics/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

반복문 비용을 더한 합을 닫힌 꼴로 구하거나, 닫힌 꼴이 없으면 위아래에서 끼워 크기를 어림한다. 거듭제곱의 합은 차수가 하나 높은 다항식, 등비급수는 가장 큰 항의 상수배, 조화수는 로그만큼 자란다. 알고리즘 분석은 정확한 값보다 이런 "크기의 모양"을 원한다. 다만 끼울 때는 부등식의 방향이 맞는지, 버린 항이 정말 작은지를 꼭 확인해야 한다.

</div>


## 예시로 보기

해시 테이블을 쓰는 알고리즘을 분석하다 $$1 + \frac12 + \frac13 + \cdots + \frac1n$$(조화수 $$H_n$$)이 나왔다. 닫힌 꼴은 없지만 크기는 잡을 수 있다. 항을 2의 거듭제곱 단위로 묶는다.

$$\underbrace{1}_{1} + \underbrace{\tfrac12 + \tfrac13}_{\le 1} + \underbrace{\tfrac14 + \cdots + \tfrac17}_{\le 1} + \cdots$$

묶음마다 첫 항이 가장 크고, 묶음 안의 항 수가 첫 항의 역수라 묶음의 합은 1 이하다. 묶음은 $$\lfloor \lg n \rfloor + 1$$($$\lfloor\ \rfloor$$는 소수점 아래를 버린 정수)개라 $$H_n \le 1 + \lg n$$이다. 거꾸로 각 묶음을 마지막 항으로 줄이면 묶음마다 $$\frac12$$ 이상이다. 그래서 $$H_n$$은 로그만큼 자란다. 묶음이 아래 정리의 끼우기, $$\lg n$$이 크기의 모양이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">자주 쓰는 합과 어림</div>

1. $$\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$$, $$\ \sum k^2 = \frac{n(n+1)(2n+1)}{6}$$, $$\ \sum k^3 = \left(\frac{n(n+1)}{2}\right)^2$$. 일반적으로 $$\sum_{k=1}^{n} k^d$$는 $$\frac{n^{d+1}}{d+1}$$로 시작하는 $$d+1$$차 다항식이다[^1].
2. 등비: $$r > 1$$이면 $$\sum_{k=0}^{n} r^k < \frac{r}{r - 1}r^n$$(마지막 항의 상수배), $$0 < r < 1$$이면 $$< \frac{1}{1 - r}$$(첫 항의 상수배).
3. 조화수: $$1 + \frac{\lfloor \lg n \rfloor}{2} \le H_n \le 1 + \lg n$$. 더 정확히는 $$H_n \approx \ln n + 0.5772$$(미분적분학의 [합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/)).
4. 계승: $$\left(\frac n2\right)^{n/2} \le n! \le n^n$$이라 $$\lg n! = \Theta(n \lg n)$$. 더 정확히는 스털링 근사 $$n! \approx \sqrt{2\pi n}\left(\frac ne\right)^n$$이다.

</div>


**교란법(perturbation).** $$S = \sum_{k=1}^{n} k\,2^k$$처럼 등비급수에 $$k$$가 곱해진 합은, $$2S - S$$를 계산해 항을 한 칸씩 밀면 등비급수가 남는다. 결과는 $$S = (n - 1)2^{n+1} + 2$$다. 같은 방법으로 $$\sum_{k=1}^{n}\frac{k}{2^k} = 2 - \frac{n + 2}{2^n} < 2$$다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

{: start="3"}
3. 예시의 묶음 논증이다. 위쪽: $$2^j$$부터 $$2^{j+1} - 1$$까지의 $$2^j$$개 항은 각각 $$\frac{1}{2^j}$$ 이하라 묶음 합 $$\le 1$$. 아래쪽: $$2^{j-1} + 1$$부터 $$2^j$$까지의 $$2^{j-1}$$개 항은 각각 $$\frac{1}{2^j}$$ 이상이라 묶음 합 $$\ge \frac12$$.
4. $$n!$$의 인수 $$n$$개는 모두 $$n$$ 이하라 $$n! \le n^n$$. 큰 쪽 절반의 인수 $$\frac n2$$개는 모두 $$\frac n2$$ 이상이라 $$n! \ge (n/2)^{n/2}$$. 로그를 취하면 $$\frac n2 \lg\frac n2 \le \lg n! \le n\lg n$$이고 양쪽 모두 $$n \lg n$$의 상수배다. ∎

</details>


## 예제

$$\lg n! = \Theta(n \lg n)$$이 정렬에 대해 알려 주는 것.

1. *세는 대상:* 서로 다른 $$n$$개의 순서는 $$n!$$가지이고, 비교 정렬은 이 중 하나를 골라내야 한다.
2. *비교 한 번의 정보:* 비교 결과는 둘 중 하나라, $$k$$번 비교로 구별할 수 있는 경우는 많아야 $$2^k$$가지다.
3. *부등식:* $$2^k \ge n!$$이어야 하므로 $$k \ge \lg n!$$.
4. *어림:* 정리 4로 $$\lg n! \ge \frac n2 \lg \frac n2$$라, 어떤 비교 정렬도 최악의 경우 $$n \lg n$$에 비례하는 비교가 필요하다. 병합 정렬은 이 한계에 닿는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$\sum k^3$$ 공식($$n \le 2000$$), 교란법의 두 결과(유리수로 정확히), 조화수의 끼우기($$n \le 10^5$$), 계승의 끼우기와 $$\lg n!/(n \lg n)$$, 힙 만들기 비용 — [23_sums-asymptotics_verify.py](/Hongs_Blog/studies/discrete-math/code/23_sums-asymptotics_verify/)</div>

</div>


## 활용

- **반복문 비용.** 이중 반복문이 $$\sum_{i}\sum_{j \le i} 1$$이면 $$n^2/2$$, 반복마다 $$\lg i$$가 들면 $$\sum_{i=1}^{n}\lg i = \lg n! = \Theta(n \lg n)$$이다.
- **힙 만들기가 $$O(n)$$인 이유.** 높이 $$h$$인 노드는 많아야 $$n/2^{h+1}$$개이고 각자 $$h$$만큼 내려간다. 합 $$\sum_h h\frac{n}{2^{h+1}} = \frac n2\sum_h \frac{h}{2^h} < n$$이다(교란법의 결과). 직관적으로 대부분의 노드는 아래쪽에 있어 조금만 내려간다.
- **해싱과 캐시.** 조화수 $$H_n$$은 "쿠폰 모으기"(모든 종류를 다 모을 때까지의 기대 시도 $$nH_n$$) 같은 분석에 나온다([기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)의 쿠폰 수집).
- 알고리즘에서: [힙과 우선순위 큐](/Hongs_Blog/studies/algorithms/heap/)의 `heapq.heapify`가 위의 힙 만들기 방법으로 리스트를 $$O(n)$$에 힙으로 바꾼다. 예제의 하한에 닿는 병합 정렬과 파이썬 `sorted`는 [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)에 있다. [문자열의 아름다움](/Hongs_Blog/studies/algorithms/pg68938/)은 $$\sum k$$와 $$\sum k^2$$ 공식으로 이중 합 $$\sum_{a=1}^{p} \sum_{b=1}^{q} \min(a, b)$$를 닫힌 꼴로 바꿔, 짝마다 반복하지 않고 한 번에 계산한다.

## 연결

- 선수: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)(공식의 증명), [등비급수](/Hongs_Blog/studies/college-math/geometric-series/), [로그](/Hongs_Blog/studies/college-math/logarithm/)
- 이어지는 개념: [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/), 미분적분학의 [합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/)(적분으로 더 정확히 끼우기)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\sum_{k=1}^{n} \frac{k}{2^k}$$가 $$n$$에 상관없이 2보다 작음을 보이고 정확한 값을 쓰라.</summary>

**답:** 교란법: $$S - \frac12 S = \sum_{k=1}^{n}\frac{1}{2^k} - \frac{n}{2^{n+1}}$$에서 $$S = 2 - \frac{n + 2}{2^n}$$. 뺀 항이 양수라 늘 2보다 작다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 조화수 Hₙ이 Θ(log n)인 이유를 항을 묶는 방법으로 설명하라.</summary>

**답:** 2의 거듭제곱 경계로 묶으면 묶음이 약 $$\lg n$$개이고, 각 묶음의 합은 $$\frac12$$ 이상 1 이하다. 그래서 $$\frac12\lg n \lesssim H_n \le 1 + \lg n$$으로, 로그의 상수배 사이에 끼인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** lg n! = Θ(n lg n)을 n!의 간단한 위·아래 어림으로 보여라.</summary>

**답:** $$n! \le n^n$$에서 $$\lg n! \le n\lg n$$. 큰 절반의 인수가 $$\frac n2$$ 이상이라 $$n! \ge (n/2)^{n/2}$$, $$\lg n! \ge \frac n2(\lg n - 1)$$. $$n \ge 4$$이면 이것은 $$\frac14 n\lg n$$ 이상이다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 14장 "Sums and Asymptotics"(거듭제곱의 합, 합의 어림, 조화수, 스털링 근사). Graham·Knuth·Patashnik, *Concrete Mathematics*, 2장 "Sums"(교란법).
{% endraw %}
