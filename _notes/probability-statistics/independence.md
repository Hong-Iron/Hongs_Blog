---
layout: "note"
title: "독립"
display_title: "독립 (Independence)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Independence", "독립", "독립 사건", "independent events", "상호 독립", "mutual independence", "쌍마다 독립", "pairwise independence", "공통 원인 고장", "common-cause failure"]
description: "한 사건이 일어났다는 소식이 다른 사건의 확률을 조금도 바꾸지 않으면 두 사건은 독립이다. 그러면 둘이 함께 일어날 확률은 각 확률의 곱이 되어 계산이 아주 쉬워진다. 서버 여러 대, 패킷 여러 개의 확률 모델은 거의 다 이 가정 위에 서 있다. 하지만 같은 전원, 같은 소프트웨어…"
prev_url: "/studies/probability-statistics/conditional-probability/"
prev_title: "조건부 확률"
next_url: "/studies/probability-statistics/independent-vs-disjoint/"
next_title: "독립과 배반 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/independence/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 사건이 일어났다는 소식이 다른 사건의 확률을 조금도 바꾸지 않으면 두 사건은 독립이다. 그러면 둘이 함께 일어날 확률은 각 확률의 곱이 되어 계산이 아주 쉬워진다. 서버 여러 대, 패킷 여러 개의 확률 모델은 거의 다 이 가정 위에 서 있다. 하지만 같은 전원, 같은 소프트웨어 버그처럼 공통 원인이 있으면 독립이 깨지고, 곱으로 계산한 위험은 실제보다 수천 배 작게 나올 수 있다.

</div>


## 예시로 보기

주사위 두 개에서 "첫 주사위가 6"(확률 $$\frac16$$)과 "합이 7"(확률 $$\frac16$$)은 독립이다. 첫 주사위가 6이면 합 7이 되는 둘째 눈은 1 하나라, 조건부 확률도 $$\frac16$$이다. 정보가 확률을 바꾸지 않았다. 실제로 $$P(\text{둘 다}) = \frac{1}{36} = \frac16 \times \frac16$$이다.

반면 "첫 주사위 6"과 "합이 8"은 독립이 아니다. 합 8의 확률은 $$\frac{5}{36}$$인데, 첫 주사위가 6이면 $$\frac16$$로 바뀐다. 두 사건이 같은 주사위에 달려 있다는 것만으로는 독립 여부를 알 수 없고, 아래 정의의 등식으로 확인해야 한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

두 사건 $$A$$, $$B$$가 **독립**이라는 것은

$$P(A \cap B) = P(A)\,P(B)$$

라는 뜻이다. $$P(B) > 0$$이면 이것은 $$P(A \mid B) = P(A)$$와 같다. 사건 $$A_1, \dots, A_n$$이 **(상호) 독립**이라는 것은 그중 어떤 몇 개를 골라도 그것들의 교집합 확률이 각 확률의 곱이라는 뜻이다[^1].

</div>


곱 꼴의 정의는 $$P(B) = 0$$일 때도 쓸 수 있고, $$A$$와 $$B$$에 대해 대칭이라 조건부 꼴보다 기본으로 쓴다.

**독립이면 여사건끼리도 독립이다.** $$A$$, $$B$$가 독립이면 $$A$$와 $$B^c$$도 독립이다. $$P(A \cap B^c) = P(A) - P(A \cap B) = P(A) - P(A)P(B) = P(A)\,P(B^c)$$이기 때문이다. 그래서 "모두 실패할 확률"을 각 실패 확률의 곱으로 쓸 수 있다.

**쌍마다 독립은 상호 독립이 아니다.** 동전 두 개를 던져 $$A$$ = "첫째 앞면", $$B$$ = "둘째 앞면", $$C$$ = "두 면이 같음"이라 하자. 확률은 모두 $$\frac12$$이고, 어느 두 사건의 교집합도 확률 $$\frac14$$라 쌍마다 독립이다. 하지만 $$A \cap B$$가 일어나면 $$C$$는 반드시 일어나서 $$P(A \cap B \cap C) = \frac14 \ne \frac18$$이다. 셋이 독립이려면 세 쌍의 조건과 세 개 전체의 조건이 모두 필요하다.

## 예제

**복제본과 공통 원인.** 데이터를 서버 세 대에 복제하고, 서버마다 하루에 확률 0.01로 고장 난다.

1. *독립 가정:* 세 대가 독립으로 고장 나면 모두 고장 날 확률은 $$0.01^3 = 10^{-6}$$이다.
2. *공통 원인 추가:* 세 대가 같은 랙 전원을 쓰고, 그 전원이 하루에 0.001의 확률로 나가 세 대를 한꺼번에 멈춘다고 하자.
3. *다시 계산:* 모두 멈출 확률은 $$0.001 + 0.999 \times 10^{-6} \approx 0.001$$이다.
4. *결론:* 독립 가정은 위험을 약 1,000배 작게 잡았다. 고가용성 설계에서 복제본을 다른 랙, 다른 데이터센터에 두는 이유다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 두 쌍(독립·비독립), 여사건 독립(무작위 확률 200쌍), 쌍마다 독립이지만 셋은 독립이 아닌 반례, 공통 원인 계산과 모의실험 40만 회, 카드의 값 — [04_independence_verify.py](/Hongs_Blog/studies/probability-statistics/code/04_independence_verify/)</div>

</div>


## 활용

- **신뢰성 계산.** 독립인 부품이 직렬이면 모두 정상일 확률이 곱이고, 병렬(하나만 살아도 됨)이면 "모두 고장"의 확률을 곱해 1에서 뺀다.
- **확률 모델의 기본 가정.** 동전 던지기, 패킷 손실, [이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)는 모두 시행들이 독립이라는 가정에서 출발한다. 가정이 맞는지부터 따져야 결과를 믿을 수 있다.
- 알고리즘에서: 길마다 성공 확률 $$p$$가 있는 망에서 성공 확률이 가장 큰 경로는, 길의 비용을 $$-\ln p$$(0 이상)로 두고 [다익스트라](/Hongs_Blog/studies/algorithms/dijkstra/)로 찾는다. 길끼리 독립이어야 경로의 성공 확률이 길마다의 $$p$$를 곱한 값이 되어, 곱을 가장 크게 하는 일이 비용 합을 가장 작게 하는 일로 바뀐다.

## 연결

- 선수: [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/)
- 헷갈리는 개념: [독립과 배반 비교](/Hongs_Blog/studies/probability-statistics/independent-vs-disjoint/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"같은 실험에서 나온 사건이면 서로 영향을 주니 독립이 아니다"</div>

틀렸다. 두 사건이 같은 주사위나 같은 데이터에 달려 있으면 얽혀 있을 것 같아 보인다. 하지만 독립은 인과 관계가 아니라 확률의 등식으로 정의된다. 예시에서 "첫 주사위 6"과 "합 7"은 같은 첫 주사위에 달려 있는데도 독립이다. 반대로 물리적으로 떨어진 서버도 공통 원인이 있으면 독립이 아니다. 판단은 늘 $$P(A \cap B) = P(A)P(B)$$를 계산해서 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주사위 두 개에서 "첫 주사위가 6"과 "합이 7"은 독립인가? "첫 주사위가 6"과 "합이 8"은?</summary>

**답:** 합 7과는 독립이다. $$P(\text{둘 다}) = \frac{1}{36} = \frac16 \cdot \frac16$$. 합 8과는 독립이 아니다. $$P(\text{둘 다}) = \frac{1}{36}$$인데 $$\frac16 \cdot \frac{5}{36} = \frac{5}{216}$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 쌍마다 독립이지만 셋이 함께 독립은 아닌 세 사건의 예를 들어라.</summary>

**답:** 동전 두 개에서 $$A$$ = 첫째 앞, $$B$$ = 둘째 앞, $$C$$ = 두 면이 같음. 어느 두 사건도 교집합 확률이 $$\frac14 = \frac12 \cdot \frac12$$이지만, $$P(A \cap B \cap C) = \frac14 \ne \frac18$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 서버 세 대가 서로 독립으로 각각 확률 0.9로 정상일 때, 적어도 한 대가 정상일 확률은?</summary>

**답:** 여사건 "모두 고장"의 확률이 $$0.1^3 = 0.001$$이라 $$1 - 0.001 = 0.999$$. 고장끼리 독립인 것은 정상끼리 독립인 데서 나온다(여사건의 독립).

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 2.5절 "Independence of events"(두 사건과 여러 사건의 독립, 쌍마다 독립과의 차이).
{% endraw %}
