---
layout: "note"
title: "기댓값과 선형성"
display_title: "기댓값과 선형성 (Expectation and Linearity)"
kind: "concept"
kind_label: "정리"
num: "08"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Expectation", "기댓값", "기대값", "expected value", "평균", "mean", "기댓값의 선형성", "linearity of expectation", "LOTUS", "무의식적 통계학자의 법칙", "law of the unconscious statistician", "근본 다리", "fundamental bridge", "모자 돌려받기 문제", "상트페테르부르크 역설", "St. Petersburg paradox"]
description: "기댓값은 같은 실험을 끝없이 되풀이했을 때 나오는 값들의 평균이고, 값마다 확률을 곱해 더해서 구한다. 가장 강력한 성질은 선형성이다. 합의 기댓값은 기댓값의 합이고, 변수들이 서로 얽혀 있어도 그대로 맞는다. 그래서 복잡한 \"개수\"를 하나하나의 \"있다/없다\"로 쪼개면 각자의 확률…"
prev_url: "/studies/probability-statistics/random-variables/"
prev_title: "확률변수와 분포"
next_url: "/studies/probability-statistics/variance/"
next_title: "분산과 표준편차"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/expectation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

기댓값은 같은 실험을 끝없이 되풀이했을 때 나오는 값들의 평균이고, 값마다 확률을 곱해 더해서 구한다. 가장 강력한 성질은 선형성이다. 합의 기댓값은 기댓값의 합이고, 변수들이 서로 얽혀 있어도 그대로 맞는다. 그래서 복잡한 "개수"를 하나하나의 "있다/없다"로 쪼개면 각자의 확률만 더해 답이 나온다. 다만 곱의 기댓값은 독립일 때만 곱으로 나뉘고, 기댓값이 가장 흔히 나오는 값이라는 보장도 없다.

</div>


## 예시로 보기

주사위 하나의 기댓값은 $$1 \cdot \frac16 + 2 \cdot \frac16 + \cdots + 6 \cdot \frac16 = 3.5$$다. 3.5는 한 번도 나올 수 없는 값이지만, 많이 던져 평균을 내면 이 값에 가까워진다.

두 주사위의 합의 기댓값은 합의 분포(2부터 12까지 11개 값)로 직접 계산해도 7이고, "첫째의 기댓값 + 둘째의 기댓값" $$= 3.5 + 3.5$$로 해도 7이다. 둘째 방법이 아래 정리의 선형성이다. 합의 분포를 몰라도 된다는 것이 핵심이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

이산 확률변수 $$X$$의 **기댓값**은 $$\sum_x \vert x\vert \,P(X = x) < \infty$$($$\sum$$은 차례로 모두 더한다는 기호)일 때

$$\mathbb{E}[X] = \sum_x x\,P(X = x)$$

이다. 확률을 가중치로 한 가중평균이다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">기댓값의 성질</div>

기댓값이 유한한 확률변수 $$X, Y$$와 상수 $$a, b$$에 대해
1. **선형성:** $$\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]$$. $$X$$와 $$Y$$가 독립이 아니어도 맞는다.
2. **근본 다리:** 사건 $$A$$의 지시 확률변수 $$I_A$$에 대해 $$\mathbb{E}[I_A] = P(A)$$.
3. **LOTUS:** 함수 $$g$$에 대해 $$\mathbb{E}[g(X)] = \sum_x g(x)\,P(X = x)$$. $$g(X)$$의 분포를 따로 구하지 않아도 된다.
4. **독립인 곱:** $$X$$, $$Y$$가 독립이면 $$\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$$.

</div>


**가정의 필요성.**

| 가정 | 빠지면 |
|---|---|
| 기댓값이 유한 | 상트페테르부르크 게임(앞면이 $$k$$번째에 처음 나오면 $$2^k$$원)은 판을 $$N$$번까지로 잘라도 기댓값이 $$N$$원이라 끝없이 커진다. 무한대끼리 빼면 선형성이 의미를 잃는다 |
| 4번의 독립 | $$X = Y$$가 반반으로 $$\pm1$$이면 $$\mathbb{E}[XY] = \mathbb{E}[X^2] = 1$$인데 $$\mathbb{E}[X]\,\mathbb{E}[Y] = 0$$ |

## 증명

전략: 기댓값을 "값별로 묶어 더하기" 대신 "결과별로 더하기"로 쓰면 합이 저절로 쪼개진다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

$$\Omega$$가 셀 수 있고 결과마다 확률 $$P(\{\omega\})$$가 있다고 하자.
1. *결과별 기댓값:* $$\mathbb{E}[X] = \sum_x x\,P(X = x) = \sum_x x\sum_{\omega : X(\omega) = x}P(\{\omega\}) = \sum_\omega X(\omega)\,P(\{\omega\})$$. 같은 값을 주는 결과들을 다시 풀어 쓴 것이다.
2. *선형성:* $$aX + bY$$도 확률변수라 1을 쓰면 $$\mathbb{E}[aX + bY] = \sum_\omega\big(aX(\omega) + bY(\omega)\big)P(\{\omega\}) = a\sum_\omega X(\omega)P(\{\omega\}) + b\sum_\omega Y(\omega)P(\{\omega\})$$. 합의 순서를 바꾼 것뿐이라 $$X$$와 $$Y$$의 관계를 쓰지 않았다(절대수렴하므로 재배열해도 된다).
3. *근본 다리:* $$\mathbb{E}[I_A] = 1 \cdot P(A) + 0 \cdot P(A^c) = P(A)$$.
4. *독립인 곱:* $$\mathbb{E}[XY] = \sum_{x, y}xy\,P(X = x, Y = y) = \sum_{x, y}xy\,P(X = x)P(Y = y) = \left(\sum_x xP(X = x)\right)\left(\sum_y yP(Y = y)\right)$$. 둘째 등호에서 독립을 썼다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계에서 독립이 필요 없는 이유는?</summary>

결과 $$\omega$$ 하나마다 $$aX(\omega) + bY(\omega)$$는 그냥 두 수의 합이다. 합을 둘로 나누는 데는 수의 덧셈 법칙만 쓰고, $$X$$와 $$Y$$가 서로 어떻게 얽혀 있는지(결합분포)는 전혀 쓰지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4단계에서 독립이 없으면 어디가 깨지는가?</summary>

$$P(X = x, Y = y)$$를 $$P(X = x)P(Y = y)$$로 바꾸는 둘째 등호다. 이것이 안 되면 이중합이 두 합의 곱으로 나뉘지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 선형성의 핵심 아이디어는?</summary>

기댓값은 결과별 값의 가중합이라 "더하기"와 순서를 바꿀 수 있다. 그래서 전체를 쪼개 각각 평균을 내고 다시 더해도 된다. 조각들 사이의 의존 관계가 아무리 복잡해도 상관없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 같은 방법을 쓰는 다른 상황은?</summary>

무작위 퀵정렬의 기대 비교 횟수(원소 쌍마다 "비교되는가"의 지시 확률변수), 해시 테이블의 기대 충돌 수(키 쌍마다), 그래프에서 기대 삼각형 수(세 정점 묶음마다). 모두 "쌍이나 묶음마다 지시 확률변수를 두고 더한다".

</details>


## 예제

**모자 돌려받기.** $$n$$명이 모자를 맡겼다가 무작위로 하나씩 돌려받는다. 자기 모자를 받는 사람 수의 기댓값은?

1. *지시 확률변수로 쪼개기:* $$I_j$$ = "$$j$$번 사람이 자기 모자를 받음"이면, 받는 사람 수는 $$X = I_1 + \cdots + I_n$$.
2. *하나의 확률:* 무작위 배분에서 $$j$$번이 자기 모자를 받을 확률은 $$\frac1n$$. 그래서 $$\mathbb{E}[I_j] = \frac1n$$.
3. *선형성:* $$\mathbb{E}[X] = n \cdot \frac1n = 1$$.
4. *검산:* $$I_j$$들은 독립이 아니다(앞의 $$n - 1$$명이 모두 자기 모자를 받으면 마지막 사람도 받는다). 그래도 선형성은 맞는다. $$n = 1, \dots, 8$$의 모든 배분을 세어도 평균이 정확히 1이다. $$X$$의 분포는 $$n$$에 따라 복잡하게 바뀌는데 기댓값은 늘 1이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 주사위의 3.5와 합의 7, 무작위 결합분포 300개에서 선형성, 독립인 곱 $$\frac{49}{4}$$와 독립이 아닐 때의 반례, LOTUS $$\frac{91}{6}$$, 모자 문제($$n \le 8$$ 전수), 생일 쌍 기댓값과 모의실험, 상트페테르부르크의 잘린 기댓값, 예제 사다리의 값 — [08_expectation_verify.py](/Hongs_Blog/studies/probability-statistics/code/08_expectation_verify/)</div>

</div>


## 활용

- **평균 경우 분석.** 배열을 한 번 훑으며 최댓값을 갱신할 때, 무작위 순서의 입력이면 갱신 횟수의 기댓값은 $$1 + \frac12 + \cdots + \frac1n \approx \ln n$$이다. $$i$$번째 원소가 앞의 원소들보다 클 확률이 $$\frac1i$$이기 때문이다. CLRS의 고용 문제가 이 계산이다[^2].
- **해시 충돌.** 키 $$k$$개를 $$n$$칸에 고르게 넣으면 같은 칸에 들어간 키 쌍의 수의 기댓값은 $$\binom{k}{2}\frac1n$$($$\binom{\ }{\ }$$은 위의 수만큼 있는 것에서 아래의 수만큼 고르는 경우의 수)이다. 23명의 생일로는 $$\frac{253}{365} \approx 0.69$$쌍이다.
- **흔한 실수.** $$\mathbb{E}[g(X)]$$를 $$g(\mathbb{E}[X])$$로 계산하는 것. 예: 주사위에서 $$\mathbb{E}[X^2] = \frac{91}{6} \approx 15.2$$이지만 $$(\mathbb{E}[X])^2 = 12.25$$다. 둘은 일차함수일 때만 같다.
- 연습: [기댓값 선형성 예제 사다리](/Hongs_Blog/studies/probability-statistics/expectation-ladder/)

## 연결

- 선수: [확률변수와 분포](/Hongs_Blog/studies/probability-statistics/random-variables/), [독립](/Hongs_Blog/studies/probability-statistics/independence/)
- 이어지는 개념: [분산과 표준편차](/Hongs_Blog/studies/probability-statistics/variance/), [기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)(쿠폰 수집)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"합의 기댓값을 기댓값의 합으로 쪼개려면 변수들이 독립이어야 한다"</div>

틀렸다. 곱의 기댓값 공식에는 독립이 필요해서, 합에도 필요하리라 짐작하기 쉽다. 하지만 선형성의 증명은 결과마다 두 수를 더하는 것뿐이라 의존 관계를 전혀 쓰지 않는다. 모자 문제의 $$I_j$$들은 서로 얽혀 있는데도 $$\mathbb{E}[X] = 1$$이 정확히 맞는다. 독립이 필요한 것은 곱($$\mathbb{E}[XY]$$)과 분산의 덧셈([분산](/Hongs_Blog/studies/probability-statistics/variance/))이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주사위 두 개를 던진 합의 기댓값을 선형성으로 구하라.</summary>

**답:** $$\mathbb{E}[X_1 + X_2] = 3.5 + 3.5 = 7$$. 합의 분포를 구하지 않아도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 무작위 순열(모든 순서가 같은 확률)에서 제자리에 있는 원소 수의 기댓값을 $$n$$에 대해 구하라.</summary>

**답:** 원소마다 "제자리에 있음"의 지시 확률변수를 두면 각각의 기댓값이 $$\frac1n$$이다. 선형성으로 $$n \cdot \frac1n = 1$$. $$n$$과 무관하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\mathbb{E}[XY] \ne \mathbb{E}[X]\,\mathbb{E}[Y]$$인 예를 들어라.</summary>

**답:** $$X$$가 반반으로 $$1$$ 또는 $$-1$$이고 $$Y = X$$. $$XY = X^2 = 1$$이라 $$\mathbb{E}[XY] = 1$$이지만 $$\mathbb{E}[X]\mathbb{E}[Y] = 0 \cdot 0 = 0$$. $$X$$와 $$Y$$가 독립이 아니기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 선형성이 독립 없이도 맞는 이유를 한두 문장으로 설명하라.</summary>

**답:** 기댓값은 결과마다의 값에 확률을 곱해 더한 것이고, 결과 하나에서 $$X + Y$$의 값은 그냥 두 수의 합이다. 합을 나누는 데 두 변수의 관계를 쓸 일이 없다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 4.1절 "Definition of expectation", 4.2절 "Linearity of expectation", 4.4절 "Indicator r.v.s and the fundamental bridge"(모자 문제), 4.5절 "Law of the unconscious statistician (LOTUS)".
[^2]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 5.2절 "Indicator random variables"(고용 문제의 기대 고용 횟수 $$\ln n + O(1)$$).
{% endraw %}
