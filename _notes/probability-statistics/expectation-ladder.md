---
layout: "note"
title: "기댓값 선형성 예제 사다리"
display_title: "기댓값 선형성 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "08"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 기댓값과 선형성(근본 다리), 지시 확률변수."
prev_url: "/studies/probability-statistics/bayes-ladder/"
prev_title: "베이즈 정리 예제 사다리"
next_url: "/studies/probability-statistics/mle-ladder/"
next_title: "최대가능도 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/probability-statistics/expectation-ladder/"
---
{% raw %}
사용 개념: [기댓값과 선형성](/Hongs_Blog/studies/probability-statistics/expectation/)(근본 다리), [지시 확률변수](/Hongs_Blog/studies/probability-statistics/random-variables/).

"평균 몇 개인가"를 묻는 문제는 대부분 분포를 구하지 않고 풀린다. 핵심은 **세는 대상을 "있다/없다"의 조각으로 쪼개는 것**이다. 조각들이 서로 얽혀 있어도 된다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *지시 확률변수로 쪼개기:* 세는 양 $$X$$를 $$I_1 + \cdots + I_m$$으로 쓴다. 각 $$I_j$$는 "$$j$$번째 후보가 조건을 만족하면 1".
2. *조각 하나의 확률:* $$\mathbb{E}[I_j] = P(\text{후보 } j\text{가 조건을 만족})$$을 구한다. 대칭이면 모든 $$j$$에서 같다.
3. *선형성으로 더하기:* $$\mathbb{E}[X] = \sum_j P(\cdots)$$($$\sum$$은 차례로 모두 더한다는 기호).
4. *검산:* 가장 작은 경우를 전부 세어 보거나, 값이 상식적인 범위인지 본다.

## 문제 1 · 완전한 풀이

$$n$$명이 모자를 맡겼다가 무작위로 돌려받는다. 자기 모자를 받는 사람 수의 기댓값은?

1. *쪼개기:* $$I_j$$ = "$$j$$번이 자기 모자를 받음", $$X = I_1 + \cdots + I_n$$.
2. *하나의 확률:* 무작위 배분에서 $$j$$번에게 가는 모자는 $$n$$개 중 하나가 똑같은 확률이라 $$P = \frac1n$$.
3. *더하기:* $$\mathbb{E}[X] = n \cdot \frac1n = 1$$.
4. *검산:* $$n = 2$$면 배분은 두 가지(둘 다 맞음, 둘 다 틀림)라 평균 $$\frac{2 + 0}{2} = 1$$.

## 문제 2 · 마지막 하위목표만 빈칸

공정한 동전을 10번 던진다. 연속한 두 번이 모두 앞면인 자리(HH)의 수의 기댓값은? (예: HHHT는 HH가 두 자리)

1. *쪼개기:* $$I_i$$ = "$$i$$번째와 $$i + 1$$번째가 모두 앞면"($$i = 1, \dots, 9$$). 이웃한 $$I_i$$들은 동전을 공유해 독립이 아니다.
2. *하나의 확률:* $$P = \frac12 \cdot \frac12 = \frac14$$.
3. *더하기:* $$\mathbb{E}[X] = 9 \cdot \frac14 = 2.25$$.
4. *검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

가능한 결과 $$2^{10} = 1024$$개의 HH 자리 수를 모두 더하면 2,304이고, $$\frac{2304}{1024} = 2.25$$로 맞는다. 자리가 9개이고 각각 $$\frac14$$의 확률이니 2~3개라는 값도 상식적이다. 이웃한 조각이 얽혀 있어도 선형성이 맞는다는 확인이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

23명의 생일(365일 균등, 독립) 중 생일이 같은 사람 쌍의 수의 기댓값은?

1. *쪼개기:* ______
2. *하나의 확률:* ______
3. *더하기:* $$\binom{23}{2} \cdot \frac{1}{365} = \frac{253}{365} \approx 0.693$$($$\binom{\ }{\ }$$은 위의 수만큼 있는 것에서 아래의 수만큼 고르는 경우의 수).
4. *검산:* 기댓값이 1보다 작은데도 "적어도 한 쌍"의 확률은 0.507이다. 쌍이 생기면 여럿이 함께 생기는 경우가 있어 둘이 모순되지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 두 사람 쌍 $$\{a, b\}$$마다 $$I_{ab}$$ = "$$a$$와 $$b$$의 생일이 같음". 쌍은 $$\binom{23}{2} = 253$$개.
2. $$b$$의 생일이 $$a$$와 같은 날일 확률 $$\frac{1}{365}$$.

</details>


## 문제 4 · 독립 문제

서로 다른 수 $$n$$개가 무작위 순서로 들어온다. 앞에서부터 훑으며 "지금까지 본 것 중 가장 큰 수"를 갱신하는 횟수(첫 원소 포함)의 기댓값을 구하고, $$n = 4$$일 때 값을 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$I_i$$ = "$$i$$번째 원소가 앞의 $$i$$개 중 가장 큼". 앞의 $$i$$개 중 가장 큰 것이 어느 자리에 있을지는 똑같은 확률이라 $$P = \frac1i$$. 기댓값은 $$1 + \frac12 + \cdots + \frac1n$$(조화수)이고 $$n$$이 크면 약 $$\ln n$$이다. $$n = 4$$면 $$\frac{25}{12} \approx 2.08$$. 순열 24개를 모두 세어도 같다. 채용 후보를 차례로 면접해 더 나은 사람이 오면 바꾸는 "고용 문제"와 같은 계산이다[^2].

**흔한 오답:** "$$i$$번째가 갱신되는 사건들이 독립이 아니니 선형성을 쓸 수 없다." 선형성은 독립이 필요 없다.

</details>


## 변형 문제

해시 테이블 $$m$$칸에 키 $$n$$개를 독립으로 고르게 넣는다. 빈 칸 수의 기댓값은? $$m = n = 10$$이면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

칸마다 "비어 있음"의 지시 확률변수를 두면, 한 칸이 키 $$n$$개 모두에게서 선택받지 않을 확률은 $$\left(1 - \frac1m\right)^n$$. 기댓값은 $$m\left(1 - \frac1m\right)^n$$. $$m = n = 10$$이면 $$10 \times 0.9^{10} \approx 3.49$$칸이 빈다. 칸 수만큼 키를 넣어도 약 35%가 빈다는 뜻이다($$m$$이 크면 $$e^{-1} \approx 0.37$$에 가까워진다).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: HH 자리 수(1024가지 전수), 생일 쌍 기댓값(모의실험), 갱신 횟수(24개 순열 전수), 빈 칸 수(모의실험 4만 회) — [08_expectation_verify.py](/Hongs_Blog/studies/probability-statistics/code/08_expectation_verify/)</div>

</div>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 4.4절 "Indicator r.v.s and the fundamental bridge".
[^2]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 5.2절(고용 문제).
{% endraw %}
