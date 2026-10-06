---
layout: "note"
title: "결합분포와 조건부 기댓값"
display_title: "결합분포와 조건부 기댓값 (Joint Distributions and Conditional Expectation)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Joint Distribution", "결합분포", "결합확률밀도", "joint density", "주변분포", "marginal distribution", "조건부 분포", "conditional distribution", "조건부 기댓값", "conditional expectation", "아담의 법칙", "Adam's law", "전체 기댓값의 법칙", "law of total expectation", "이브의 법칙", "Eve's law", "전체 분산의 법칙", "law of total variance"]
description: "두 확률변수를 따로가 아니라 함께 보는 표가 결합분포다. 한쪽만 보고 싶으면 다른 쪽을 모두 더해 없애고(주변분포), 한쪽 값을 알 때 다른 쪽을 보려면 그 줄만 잘라 합이 1이 되게 다시 맞춘다(조건부 분포). 조건부 기댓값은 \"이것을 알 때 저것의 가장 좋은 예측\"이고, 그룹별…"
prev_url: "/studies/probability-statistics/normal-distribution/"
prev_title: "정규분포"
next_url: "/studies/probability-statistics/covariance/"
next_title: "공분산과 상관계수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/joint-distributions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 확률변수를 따로가 아니라 함께 보는 표가 결합분포다. 한쪽만 보고 싶으면 다른 쪽을 모두 더해 없애고(주변분포), 한쪽 값을 알 때 다른 쪽을 보려면 그 줄만 잘라 합이 1이 되게 다시 맞춘다(조건부 분포). 조건부 기댓값은 "이것을 알 때 저것의 가장 좋은 예측"이고, 그룹별 평균을 그룹 크기로 가중평균하면 전체 평균이 된다. 흔한 함정은 각자의 분포만 알면 둘의 관계도 안다고 생각하는 것이다. 같은 주변분포에서 전혀 다른 결합분포가 나올 수 있다.

</div>


## 예시로 보기

두 랙의 서버가 오늘 장애를 낼지(1) 안 낼지(0)를 $$X$$, $$Y$$라 하자. 같은 전원을 쓰는 탓에 결합분포가 이렇다.

| | $$Y = 0$$ | $$Y = 1$$ | $$X$$의 주변 |
|---|---|---|---|
| $$X = 0$$ | 0.4 | 0.1 | 0.5 |
| $$X = 1$$ | 0.1 | 0.4 | 0.5 |
| $$Y$$의 주변 | 0.5 | 0.5 | 1 |

- *주변분포:* 행과 열을 더하면 각자 반반이다.
- *조건부 분포:* $$X = 1$$인 줄만 보면 $$(0.1, 0.4)$$이고, 합 0.5로 나누면 $$P(Y = 1 \mid X = 1) = 0.8$$이다. 한 랙이 장애면 다른 랙도 80% 확률로 장애다.
- *비교:* 주변분포가 똑같이 반반인데 독립이면 네 칸이 모두 0.25다. 주변분포만으로는 이 차이를 알 수 없다.

표의 칸이 아래 정의의 $$p(x, y)$$, 가장자리 합이 주변분포다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

이산 확률변수 $$X, Y$$의 **결합 PMF**는 $$p(x, y) = P(X = x, Y = y)$$다. 연속이면 **결합밀도** $$f(x, y) \ge 0$$가 있어 평면의 영역 $$A$$에 대해 $$P((X, Y) \in A) = \iint_A f(x, y)\,dx\,dy$$이다([중적분](/Hongs_Blog/studies/calculus/multiple-integrals/)).
- **주변분포:** $$p_X(x) = \sum_y p(x, y)$$, $$f_X(x) = \int f(x, y)\,dy$$($$\int$$는 넓이를 구하는 적분 기호).
- **조건부 분포:** $$p_X(x) > 0$$일 때 $$p_{Y \mid X}(y \mid x) = \frac{p(x, y)}{p_X(x)}$$. 연속이면 밀도로 같은 식.
- **독립:** 모든 $$x, y$$에서 $$p(x, y) = p_X(x)p_Y(y)$$(연속이면 밀도로).
- **조건부 기댓값:** $$\mathbb{E}[Y \mid X = x] = \sum_y y\,p_{Y \mid X}(y \mid x)$$. 이것을 $$g(x)$$라 할 때 확률변수 $$g(X)$$를 $$\mathbb{E}[Y \mid X]$$로 쓴다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">아담의 법칙과 이브의 법칙</div>

1. **전체 기댓값(아담):** $$\mathbb{E}\big[\mathbb{E}[Y \mid X]\big] = \mathbb{E}[Y]$$.
2. **전체 분산(이브):** $$\operatorname{Var}[Y] = \mathbb{E}\big[\operatorname{Var}(Y \mid X)\big] + \operatorname{Var}\big(\mathbb{E}[Y \mid X]\big)$$($$\operatorname{Var}$$는 분산).

</div>


이브의 법칙은 전체 흔들림을 "그룹 안의 흔들림의 평균"과 "그룹 평균끼리의 흔들림"으로 나눈다.

**설계 이유.** 조건부 분포를 $$p_X(x)$$로 나누는 것은 [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/)과 같은 이유다. 한 줄만 남기고 나머지를 버린 뒤 합을 1로 맞춘다. $$\mathbb{E}[Y \mid X]$$를 수가 아닌 확률변수로 두는 이유는, $$X$$가 무엇이 나오느냐에 따라 예측값이 달라지기 때문이다. 이렇게 두면 아담의 법칙을 "예측값의 평균 = 실제 평균"이라는 한 줄로 쓸 수 있다.

**해당하는 예와 해당하지 않는 예.**

| 해당함 | 해당하지 않음 |
|---|---|
| 예시의 랙 장애 표 | 두 주변분포만 적은 표(결합을 정하지 못함) |
| 단위정사각형의 밀도 $$f(x, y) = x + y$$ | 넓이가 1이 아닌 함수, 음수가 되는 함수 |
| 두 주사위의 (첫째, 합) |  |

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">아담의 법칙의 증명(이산)</summary>

1. *정의 대입:* $$\mathbb{E}[\mathbb{E}[Y \mid X]] = \sum_x p_X(x)\,\mathbb{E}[Y \mid X = x] = \sum_x p_X(x)\sum_y y\frac{p(x, y)}{p_X(x)}$$.
2. *약분:* $$p_X(x)$$가 지워져 $$\sum_x\sum_y y\,p(x, y)$$.
3. *합의 순서 바꾸기:* $$\sum_y y\sum_x p(x, y) = \sum_y y\,p_Y(y) = \mathbb{E}[Y]$$. 안쪽 합이 $$Y$$의 주변분포다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계에서 약분이 되는 이유는?</summary>

바깥 가중치 $$p_X(x)$$(그룹 크기)와 조건부 분포의 분모 $$p_X(x)$$(그룹 안에서 비율을 만들 때 나눈 것)가 같은 수라서다. 비율로 만들었던 것을 크기로 되돌린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계에서 안쪽 합이 $$p_Y(y)$$가 되는 이유는?</summary>

$$\sum_x p(x, y)$$는 $$Y = y$$인 칸을 모든 $$x$$에 대해 더한 것, 곧 주변분포의 정의다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 아담의 법칙의 핵심 아이디어는?</summary>

전체 평균은 그룹별 평균을 그룹 크기로 가중평균한 것이다. 반 평균들을 학생 수로 가중해 전교 평균을 구하는 계산과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 같은 아이디어를 쓰는 다른 상황은?</summary>

[전확률 공식](/Hongs_Blog/studies/probability-statistics/conditional-probability/)(확률판), 알고리즘의 평균 실행 시간을 입력 종류별로 나눠 계산하는 것, 개수가 무작위인 합의 평균(아래 예제).

</details>


## 예제

**개수가 무작위인 합.** 1초에 들어오는 요청 수 $$N \sim \mathrm{Pois}(10)$$이고, 요청마다 처리 시간 $$T_i$$는 평균 0.2초, 분산 0.04인 지수분포이며 서로, 그리고 $$N$$과 독립이다. 1초 동안 들어온 요청의 총 처리 시간 $$S = T_1 + \cdots + T_N$$의 평균과 분산은?

1. *조건 걸기:* $$N = n$$이면 $$S$$는 $$n$$개의 합이라 $$\mathbb{E}[S \mid N] = 0.2N$$, $$\operatorname{Var}(S \mid N) = 0.04N$$.
2. *아담:* $$\mathbb{E}[S] = \mathbb{E}[0.2N] = 0.2 \times 10 = 2$$초.
3. *이브:* $$\operatorname{Var}[S] = \mathbb{E}[0.04N] + \operatorname{Var}(0.2N) = 0.4 + 0.04 \times 10 = 0.8$$.
4. *해석:* 분산의 절반은 처리 시간의 흔들림에서, 절반은 요청 수의 흔들림에서 온다. $$N$$을 고정된 10으로 보면 분산을 0.4로 절반만 잡게 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 주변·조건부 분포와 독립 표와의 차이, 밀도 $$x + y$$의 넓이·주변밀도·$$P(X + Y \le 1) = \frac13$$·조건부 기댓값과 $$\mathbb{E}[Y] = \frac{7}{12}$$, 무작위 결합분포 200개에서 아담·이브의 법칙(분수로 정확히), 주사위 카드, 무작위 합의 평균 2·분산 0.8(모의실험 10만 회) — [17_joint-distributions_verify.py](/Hongs_Blog/studies/probability-statistics/code/17_joint-distributions_verify/)</div>

</div>


## 활용

- **예측과 회귀.** $$\mathbb{E}[Y \mid X]$$는 제곱오차를 가장 작게 하는 $$X$$의 함수다. 회귀 모델은 이 조건부 기댓값을 어림하는 것이다([선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/)).
- **생성 모델과 센서 융합.** 여러 변수의 결합분포를 모델링하고, 관측된 변수로 조건을 걸어 나머지를 추론한다.
- **흔한 실수.** 주변분포만 보고 결합 확률을 곱으로 계산하는 것(독립 가정 몰래 쓰기).
- 알고리즘에서: 첫걸음으로 경우를 나눠 기댓값을 구하는 식(아담의 법칙)은 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/) 표로 푼다. 다음 상태의 값이 먼저 나오도록 칸을 채우고, 상태가 이전 상태로 되돌아갈 수 있으면 채울 순서가 없어 연립방정식을 세운다.

## 연결

- 선수: [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/), [기댓값](/Hongs_Blog/studies/probability-statistics/expectation/), [확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/)
- 이어지는 개념: [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)(결합분포의 한 줄 요약)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$X$$와 $$Y$$ 각각의 분포를 알면 둘이 함께 어떻게 나오는지도 안다"</div>

틀렸다. 각자에 대해 모든 것을 아는 것 같아 그렇게 믿기 쉽다. 하지만 주변분포는 결합분포의 가장자리 합일 뿐이라, 같은 가장자리를 가진 표가 무수히 많다. 예시의 장애 표와 독립 표는 주변분포가 똑같이 반반인데, 두 랙이 함께 장애일 확률이 0.4와 0.25로 다르다. 관계를 알려면 결합분포나, 최소한 공분산 같은 관계 정보가 필요하다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 예시의 결합분포 표에서 $$P(Y = 1 \mid X = 1)$$과 $$P(Y = 1 \mid X = 0)$$을 구하라.</summary>

**답:** $$\frac{0.4}{0.5} = 0.8$$, $$\frac{0.1}{0.5} = 0.2$$. $$X$$에 따라 $$Y$$의 확률이 달라지므로 독립이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주사위 두 개에서 첫째 눈을 $$X$$, 합을 $$S$$라 할 때 $$\mathbb{E}[S \mid X]$$를 구하고 아담의 법칙으로 $$\mathbb{E}[S]$$를 확인하라.</summary>

**답:** $$X = a$$이면 합은 $$a +$$ (둘째 눈)이라 $$\mathbb{E}[S \mid X] = X + 3.5$$. $$\mathbb{E}[X + 3.5] = 3.5 + 3.5 = 7 = \mathbb{E}[S]$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주변분포가 같지만 결합분포가 다른 두 경우를 만들어라.</summary>

**답:** $$X, Y$$가 각각 반반으로 0 또는 1. (가) 독립: 네 칸 모두 0.25. (나) 예시 표: 대각선 0.4, 나머지 0.1. (다) 극단적으로 $$Y = X$$: 대각선 0.5, 나머지 0. 주변분포는 셋 다 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 개수가 무작위인 합의 분산에서, 개수를 평균값으로 고정하면 분산을 과소평가하는 이유를 이브의 법칙으로 설명하라.</summary>

**답:** 이브의 법칙의 둘째 항 $$\operatorname{Var}(\mathbb{E}[S \mid N])$$이 "개수가 흔들려서 생기는 흔들림"이다. 개수를 고정하면 이 항이 0이 되어 첫째 항만 남는다. 예제에서는 0.8 대신 0.4가 된다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 7.1절 "Joint, marginal, and conditional", 7.2절 "2D LOTUS", 9.1~9.3절(조건부 기댓값과 그 성질, 아담의 법칙), 9.4절(조건부 기댓값은 제곱오차를 가장 작게 하는 예측), 9.5절 "Conditional variance"(이브의 법칙).
{% endraw %}
