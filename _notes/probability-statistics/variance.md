---
layout: "note"
title: "분산과 표준편차"
display_title: "분산과 표준편차 (Variance and Standard Deviation)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Variance", "분산", "표준편차", "standard deviation", "SD", "산포", "dispersion", "웰퍼드 방법", "Welford's algorithm", "평균의 분산"]
description: "값들이 평균에서 평균적으로 얼마나 멀리 흩어지는지를 재는 수다. 평균에서 벗어난 거리를 제곱해 평균 낸 것이 분산이고, 그 제곱근이 원래 단위로 돌아온 표준편차다. 평균 응답 시간이 같은 두 서버도 흔들림이 크게 다를 수 있어서, 평균만으로는 성능을 말할 수 없다. 서로 독립인 것…"
prev_url: "/studies/probability-statistics/expectation/"
prev_title: "기댓값과 선형성"
next_url: "/studies/probability-statistics/binomial/"
next_title: "베르누이 시행과 이항분포"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/variance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

값들이 평균에서 평균적으로 얼마나 멀리 흩어지는지를 재는 수다. 평균에서 벗어난 거리를 제곱해 평균 낸 것이 분산이고, 그 제곱근이 원래 단위로 돌아온 표준편차다. 평균 응답 시간이 같은 두 서버도 흔들림이 크게 다를 수 있어서, 평균만으로는 성능을 말할 수 없다. 서로 독립인 것들을 더하면 분산도 그대로 더해지지만, 독립이 아니면 이 덧셈이 맞지 않는다.

</div>


## 예시로 보기

서버 A는 늘 100 ms에 응답하고, 서버 B는 반반의 확률로 50 ms 또는 150 ms에 응답한다. 평균은 둘 다 100 ms다.

| | 평균 $$\mu$$ | 평균에서 벗어난 거리의 제곱 | 분산 | 표준편차 |
|---|---|---|---|---|
| A | 100 | 늘 0 | 0 | 0 ms |
| B | 100 | 늘 $$50^2 = 2500$$ | 2500 | 50 ms |

B의 분산 2500은 단위가 ms²라 감이 오지 않는다. 제곱근을 씌운 표준편차 50 ms가 "평균에서 보통 이만큼 벗어난다"는 뜻으로 읽힌다. 표의 셋째 열의 평균이 아래 정의의 분산이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

평균이 $$\mu = \mathbb{E}[X]$$($$\mathbb{E}[\cdot]$$은 평균(기댓값))인 확률변수 $$X$$의 **분산**은

$$\operatorname{Var}[X] = \mathbb{E}\big[(X - \mu)^2\big] = \mathbb{E}[X^2] - \mu^2$$

이고, **표준편차**는 $$\operatorname{SD}(X) = \sqrt{\operatorname{Var}[X]}$$다[^1].

</div>


둘째 등호는 [선형성](/Hongs_Blog/studies/probability-statistics/expectation/)으로 전개한 것이다. $$\mathbb{E}[X^2 - 2\mu X + \mu^2] = \mathbb{E}[X^2] - 2\mu^2 + \mu^2$$. 주사위 하나는 $$\mathbb{E}[X^2] = \frac{91}{6}$$, $$\mu = \frac72$$라 분산 $$\frac{91}{6} - \frac{49}{4} = \frac{35}{12} \approx 2.92$$다.

**성질.**

| 성질 | 이유 |
|---|---|
| $$\operatorname{Var}[aX + b] = a^2\operatorname{Var}[X]$$ | $$b$$만큼 옮기면 평균도 같이 옮겨 거리가 그대로다. $$a$$배 늘리면 거리가 $$a$$배, 제곱이 $$a^2$$배다 |
| $$X$$, $$Y$$가 독립이면 $$\operatorname{Var}[X + Y] = \operatorname{Var}[X] + \operatorname{Var}[Y]$$ | 전개하면 교차항 $$2\mathbb{E}[(X - \mu_X)(Y - \mu_Y)]$$가 남는데, 독립이면 [곱의 기댓값](/Hongs_Blog/studies/probability-statistics/expectation/)이 나뉘어 0이다 |
| 독립이 아니면 맞지 않을 수 있다 | $$\operatorname{Var}[X + X] = \operatorname{Var}[2X] = 4\operatorname{Var}[X]$$이지 $$2\operatorname{Var}[X]$$가 아니다 |

**설계 이유.** 거리의 평균 $$\mathbb{E}[\vert X - \mu\vert ]$$도 쓸 수 있지만, 제곱을 쓰면 독립합의 덧셈 법칙이 생기고 미분하기 쉽다. 제곱의 평균은 [벡터 길이의 제곱](/Hongs_Blog/studies/linear-algebra/dot-product/)과 같은 구조라, 최소제곱과도 자연스럽게 이어진다.

## 예제

**여러 번 재서 평균 내기.** 서로 독립이고 분포가 같은 측정값 $$X_1, \dots, X_n$$(각각 분산 $$\sigma^2$$)의 평균 $$\bar X = \frac{X_1 + \cdots + X_n}{n}$$의 분산은?

1. *합의 분산:* 독립이라 $$\operatorname{Var}[X_1 + \cdots + X_n] = n\sigma^2$$.
2. *$$\frac1n$$배:* 성질 1로 $$\operatorname{Var}[\bar X] = \frac{1}{n^2} \cdot n\sigma^2 = \frac{\sigma^2}{n}$$.
3. *표준편차:* $$\operatorname{SD}(\bar X) = \frac{\sigma}{\sqrt n}$$.
4. *결론:* 측정을 4배 늘리면 흔들림은 절반으로 준다. 벤치마크를 여러 번 돌려 평균을 내는 이유이자, 몬테카를로 오차가 표본 수의 제곱근에 반비례하는 이유다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 서버의 분산, 계산 공식(무작위 분포 200개), 주사위 $$\frac{35}{12}$$, 세 성질과 $$\operatorname{Var}[X + X]$$, 평균의 분산 $$\frac{\sigma^2}{n}$$(모의실험, $$n = 1, 4, 16, 64$$), 부동소수점 실험 — [09_variance_verify.py](/Hongs_Blog/studies/probability-statistics/code/09_variance_verify/)</div>

</div>


## 활용

- **꼬리 지연.** 서비스 품질은 평균보다 흔들림(표준편차, 상위 1% 지연)에 좌우될 때가 많다. 평균이 같아도 분산이 큰 쪽이 사용자에게 더 나쁘다.
- **수치 계산의 함정.** $$\mathbb{E}[X^2] - \mu^2$$ 공식으로 분산을 계산하면, 값이 크고 흔들림이 작을 때 비슷한 큰 수끼리 빼면서 유효숫자가 사라진다. $$10^9$$ 근처의 값 $$10^9 + 4, 10^9 + 7, 10^9 + 13, 10^9 + 16$$(참 분산 22.5)을 배정밀도로 계산하면 이 공식은 0을 낸다. 평균을 갱신하며 편차를 누적하는 웰퍼드 방법은 22.5를 정확히 낸다[^s1].

## 연결

- 선수: [기댓값과 선형성](/Hongs_Blog/studies/probability-statistics/expectation/)
- 이어지는 개념: [이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)(독립합의 분산 $$np(1-p)$$), 확률 부등식과 [큰 수의 법칙](/Hongs_Blog/studies/probability-statistics/lln/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 공정한 주사위 눈의 분산을 구하라.</summary>

**답:** $$\mathbb{E}[X^2] = \frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \frac{91}{6}$$, $$\mu^2 = \frac{49}{4}$$. 분산 $$\frac{182 - 147}{12} = \frac{35}{12} \approx 2.92$$, 표준편차 약 1.71.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\operatorname{Var}[X] = 2$$일 때 $$\operatorname{Var}[3X + 5]$$는?</summary>

**답:** $$3^2 \times 2 = 18$$. 더한 5는 분산에 영향이 없다.<br>
**흔한 오답:** $$3 \times 2 + 5 = 11$$. 분산은 제곱 단위라 배율이 제곱으로 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 같은 주사위의 눈 $$X$$에 대해 $$\operatorname{Var}[X + X]$$가 $$2\operatorname{Var}[X]$$가 아니라 $$4\operatorname{Var}[X]$$인 이유는?</summary>

**답:** $$X + X = 2X$$라 성질 1로 $$4\operatorname{Var}[X]$$다. 분산의 덧셈 법칙은 독립일 때만 맞는데, $$X$$와 자기 자신은 완전히 같이 움직여서 흔들림이 상쇄되지 않고 겹쳐 커진다. 교차항 $$2\operatorname{Var}[X]$$가 0이 아니다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 4.6절 "Variance"(정의, 계산 공식, 성질, 독립합의 분산).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 웰퍼드 방법은 B. P. Welford, "Note on a method for calculating corrected sums of squares and products", *Technometrics* 4(3), 1962에서 나왔다. 두 공식의 결과(0과 22.5)는 09_variance_verify.py로 확인했다.
{% endraw %}
