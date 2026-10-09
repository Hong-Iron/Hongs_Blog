---
layout: "note"
title: "선형회귀"
display_title: "선형회귀 (Linear Regression)"
kind: "concept"
kind_label: "모델"
num: "34"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Linear Regression", "선형회귀", "단순 선형회귀", "simple linear regression", "다중 선형회귀", "multiple linear regression", "최소제곱 추정", "ordinary least squares", "OLS", "잔차", "residual", "결정계수", "coefficient of determination", "R²", "회귀계수", "regression coefficient"]
description: "결과를 입력들의 가중합에 잡음이 더해진 것으로 보는 모델이다. 잡음이 종 모양(정규분포)이라고 가정하면, 가장 그럴듯한 가중치를 찾는 것이 곧 오차 제곱합을 최소로 하는 것이라 행렬 계산 한 번으로 답이 나온다. 가중치는 \"다른 입력을 그대로 둘 때 이 입력이 하나 늘면 결과가 얼…"
prev_url: "/studies/probability-statistics/bayesian-inference/"
prev_title: "베이즈 추론과 MAP"
next_url: "/studies/probability-statistics/overfitting-cv/"
next_title: "과적합과 교차검증"
math: true
mermaid: false
code_count: 2
permalink: "/studies/probability-statistics/linear-regression/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

결과를 입력들의 가중합에 잡음이 더해진 것으로 보는 모델이다. 잡음이 종 모양(정규분포)이라고 가정하면, 가장 그럴듯한 가중치를 찾는 것이 곧 오차 제곱합을 최소로 하는 것이라 행렬 계산 한 번으로 답이 나온다. 가중치는 "다른 입력을 그대로 둘 때 이 입력이 하나 늘면 결과가 얼마나 느는가"로 읽는다. 하지만 관계가 곡선이거나 극단값이 섞이면 틀린 직선을 그리고, 잘 맞는 직선도 원인과 결과를 말해 주지는 않는다.

</div>


## 예시로 보기

광고비 $$x$$(백만 원)와 매출 $$y$$(억 원)가 다섯 달 동안 $$(1, 2.1), (2, 3.9), (3, 6.2), (4, 7.8), (5, 10.1)$$이었다. 오차 제곱합이 가장 작은 직선은 $$\hat y = 0.05 + 1.99x$$이고, 남은 오차(잔차)의 제곱합은 0.107이다. 매출 변화의 99.7%($$R^2 = 0.997$$)를 이 직선이 설명한다.

기울기 1.99가 아래 정의의 $$\beta_1$$, 절편 0.05가 $$\beta_0$$, 잔차가 $$\varepsilon$$의 추정값이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/34_linear-regression_fig1.svg" alt="그림" loading="lazy">

주황 선분이 잔차, 곧 점에서 직선까지의 세로 거리다. 다섯 잔차의 제곱을 더한 0.107은 다른 어떤 직선보다 작다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

관측 $$i = 1, \dots, n$$에서 결과 $$y_i$$와 입력 벡터 $$\mathbf{x}_i$$(첫 성분 1)에 대해

$$y_i = \mathbf{x}_i^\top\boldsymbol\beta + \varepsilon_i,\qquad \varepsilon_i \sim \mathcal{N}(0, \sigma^2)\ \text{독립}$$

인 모델이 **선형회귀**다. 행렬로 $$\mathbf{y} = X\boldsymbol\beta + \boldsymbol\varepsilon$$이다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">최대가능도 = 최소제곱</div>

이 모델에서 $$\boldsymbol\beta$$의 최대가능도 추정값은 오차 제곱합 $$\Vert \mathbf{y} - X\boldsymbol\beta\Vert ^2$$($$\lVert\cdot\rVert$$는 벡터의 길이)을 최소로 하는 값, 곧 [정규방정식](/Hongs_Blog/studies/linear-algebra/least-squares/) $$X^\top X\hat{\boldsymbol\beta} = X^\top\mathbf{y}$$의 해다. 분산의 MLE는 $$\hat\sigma^2 = \frac{\text{RSS}}{n}$$이다(RSS는 잔차 제곱합).

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

로그 가능도는 $$\ell(\boldsymbol\beta, \sigma^2) = -\frac n2\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\Vert \mathbf{y} - X\boldsymbol\beta\Vert ^2$$이다. $$\sigma^2$$가 무엇이든 $$\boldsymbol\beta$$에 달린 부분은 $$-\frac{1}{2\sigma^2}\Vert \cdot\Vert ^2$$뿐이라, $$\ell$$을 최대로 하는 $$\boldsymbol\beta$$는 제곱합을 최소로 하는 $$\boldsymbol\beta$$다. 그 $$\hat{\boldsymbol\beta}$$를 넣고 $$\sigma^2$$로 미분해 0으로 놓으면 $$\hat\sigma^2 = \frac{\Vert \mathbf{y} - X\hat{\boldsymbol\beta}\Vert ^2}{n}$$. ∎

</details>


**결정계수** $$R^2 = 1 - \frac{\text{RSS}}{\text{TSS}}$$(TSS는 $$y$$의 평균 주변 제곱합)는 $$y$$의 흩어짐 중 모델이 설명한 비율이다.

| 보장한다(모델 가정이 맞을 때) | 보장하지 않는다 |
|---|---|
| $$\hat{\boldsymbol\beta}$$는 불편이고 공분산은 $$\sigma^2(X^\top X)^{-1}$$ | 인과 관계(공통 원인이 있으면 $$R^2$$가 높아도 효과가 없을 수 있다) |
| 잔차 제곱합이 가장 작은 직선(초평면) | 자료 범위 밖에서의 예측(외삽) |
| 계수의 신뢰구간과 검정 | 곡선 관계, 극단값, 이분산이 있을 때 구간과 검정의 정확성 |

**실패 시나리오.**
- *곡선 관계:* $$y = x^2$$에 직선을 맞추면 잔차가 양 끝에서 양수, 가운데서 음수인 U자를 그린다. 잔차 그림에 패턴이 보이면 모델이 틀린 것이다.
- *극단값:* $$y = 2x + 1$$을 따르는 점 10개 중 하나를 $$-50$$으로 바꾸면 기울기가 음수로 뒤집힌다. 제곱 오차는 큰 오차를 매우 무겁게 본다.
- *공선성:* 입력끼리 거의 일차종속이면 $$X^\top X$$의 [조건수](/Hongs_Blog/studies/linear-algebra/conditioning/)가 커져 계수가 불안정해진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/34_linear-regression_fig2.svg" alt="그림" loading="lazy">

왼쪽은 $$y = x^2$$에 직선을 맞춘 뒤의 잔차로, 양 끝은 양수이고 가운데는 음수인 U자다. 오른쪽은 $$y = 2x + 1$$ 위의 점 10개 중 마지막 하나만 $$-50$$으로 바꾼 것이다. 기울기가 2에서 $$-1.76$$으로 뒤집힌다[^s2].

## 예제

**계수의 불확실성.** $$x = 0, 0.5, 1, \dots, 5.5$$(12개)에서 참 모델 $$y = 1 + 2x + \varepsilon$$, $$\sigma = 1$$로 자료를 2만 번 만들어 기울기를 추정하면

1. *평균:* 추정 기울기의 평균이 2와 0.005 안으로 맞는다(불편).
2. *분산:* 추정 기울기의 분산이 $$\frac{\sigma^2}{\sum(x_i - \bar x)^2}$$($$\sum$$은 차례로 모두 더한다는 기호)와 5% 안으로 맞는다.
3. *해석:* $$x$$가 넓게 퍼질수록 분모가 커져 기울기가 정확해진다. 실험을 설계할 때 입력을 넓게 잡는 이유다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 기울기·절편·RSS·$$R^2$$, 정규 잡음의 로그 가능도 최댓점 = 최소제곱 해와 $$\hat\sigma^2 = \frac{\text{RSS}}{n}$$(무작위 자료 50개), 불편성과 기울기 분산(모의실험 2만 회), 곡선 관계의 U자 잔차와 극단값 하나의 영향, 공통 원인만으로 $$R^2 \approx 0.91$$ — [34_linear-regression_verify.py](/Hongs_Blog/studies/probability-statistics/code/34_linear-regression_verify/)</div>

</div>


## 활용

- **예측과 추세.** 용량 계획(사용자 수 → 서버 부하), 추세선, 간단한 기준 모델.
- **특징의 효과 읽기.** 다른 입력을 고정한 조건에서의 효과를 계수로 읽는다. 무작위 실험이 아니면 인과로 읽지 않는다.
- **더 복잡한 모델의 출발점.** 입력을 $$x, x^2, \dots$$로 바꾸면 다항 회귀, 결과를 로지스틱 함수로 감싸면 로지스틱 회귀, 여러 층으로 쌓으면 신경망이다. 입력을 늘릴수록 [과적합](/Hongs_Blog/studies/probability-statistics/overfitting-cv/)에 주의한다.

## 연결

- 선수: [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/), [정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/), [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)(기하적으로는 직교 사영)
- 이어지는 개념: [과적합과 교차검증](/Hongs_Blog/studies/probability-statistics/overfitting-cv/), [MAP](/Hongs_Blog/studies/probability-statistics/bayesian-inference/)(릿지 회귀)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 점 $$(1, 2.1), (2, 3.9), (3, 6.2), (4, 7.8), (5, 10.1)$$의 최소제곱 직선을 구하라.</summary>

**답:** $$\bar x = 3$$, $$\bar y = 6.02$$. 기울기 $$\frac{\sum(x_i - \bar x)(y_i - \bar y)}{\sum(x_i - \bar x)^2} = \frac{19.9}{10} = 1.99$$, 절편 $$6.02 - 1.99 \times 3 = 0.05$$. $$\hat y = 0.05 + 1.99x$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 정규 잡음을 가정하면 최대가능도 추정이 왜 최소제곱이 되는가?</summary>

**답:** 정규 밀도의 로그는 $$-\frac{(y_i - \mathbf{x}_i^\top\boldsymbol\beta)^2}{2\sigma^2}$$ + 상수다. 독립 관측의 로그 가능도는 이것들의 합이라, 최대화하는 것은 제곱 오차의 합을 최소화하는 것과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 광고비와 매출의 회귀에서 $$R^2 = 0.9$$가 나왔다. "광고비를 늘리면 매출이 오른다"고 결론 낼 수 있는가?</summary>

**답:** 아니다. $$R^2$$는 함께 움직이는 정도일 뿐이다. 성수기처럼 광고비와 매출을 함께 올리는 공통 원인이 있으면, 광고가 효과가 없어도 $$R^2$$가 높게 나온다(공통 원인만 있는 모의실험에서도 0.91). 인과는 광고비를 무작위로 바꾸는 실험으로 확인한다.

</details>


[^1]: Wasserman, *All of Statistics*, "Linear and Logistic Regression" 장(모델, 최소제곱과 최대가능도, 추정량의 분산, $$R^2$$). Strang, *Introduction to Linear Algebra* 5판, 4.3절 "Least Squares Approximations"(정규방정식).
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [34_linear-regression_plot.py](/Hongs_Blog/studies/probability-statistics/code/34_linear-regression_plot/)로 그렸고, 그림에 쓴 값($$\hat y = 0.05 + 1.99x$$, RSS 0.107, $$R^2 = 0.997$$, U자 잔차의 부호, 기울기 2와 $$-1.76$$)을 같은 코드로 확인했다.
{% endraw %}
