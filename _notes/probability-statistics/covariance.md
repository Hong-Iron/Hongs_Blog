---
layout: "note"
title: "공분산과 상관계수"
display_title: "공분산과 상관계수 (Covariance and Correlation)"
kind: "concept"
kind_label: "정의"
num: "18"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Covariance", "공분산", "상관계수", "correlation coefficient", "피어슨 상관계수", "Pearson correlation", "무상관", "uncorrelated", "상관과 인과", "correlation vs causation"]
description: "두 값이 함께 움직이는 정도를 하나의 수로 요약한다. 한쪽이 평균보다 클 때 다른 쪽도 평균보다 큰 경향이면 양수, 반대면 음수다. 상관계수는 단위를 없애 −1에서 1 사이로 맞춘 것으로, 두 자료를 벡터로 봤을 때 사이 각의 코사인과 같다. 하지만 직선 관계만 잡아내서 0이어도 …"
prev_url: "/studies/probability-statistics/joint-distributions/"
prev_title: "결합분포와 조건부 기댓값"
next_url: "/studies/probability-statistics/multivariate-normal/"
next_title: "공분산 행렬과 다변량 정규분포"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/covariance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 값이 함께 움직이는 정도를 하나의 수로 요약한다. 한쪽이 평균보다 클 때 다른 쪽도 평균보다 큰 경향이면 양수, 반대면 음수다. 상관계수는 단위를 없애 −1에서 1 사이로 맞춘 것으로, 두 자료를 벡터로 봤을 때 사이 각의 코사인과 같다. 하지만 직선 관계만 잡아내서 0이어도 무관하다는 뜻이 아니고, 상관이 커도 한쪽이 다른 쪽의 원인이라는 뜻은 아니다.

</div>


## 예시로 보기

학생 5명의 공부 시간이 $$x = (1, 2, 3, 4, 5)$$, 점수가 $$y = (2, 4, 5, 4, 5)$$다. 평균은 3과 4다.

| 학생 | $$x - 3$$ | $$y - 4$$ | 곱 |
|---|---|---|---|
| 1 | −2 | −2 | 4 |
| 2 | −1 | 0 | 0 |
| 3 | 0 | 1 | 0 |
| 4 | 1 | 0 | 0 |
| 5 | 2 | 1 | 2 |

곱의 평균 $$\frac{6}{5} = 1.2$$가 공분산이다. 둘 다 평균보다 크거나 둘 다 작은 학생이 곱을 양수로 만든다. 표준편차 $$\sqrt2$$와 $$\sqrt{1.2}$$로 나누면 상관계수 $$\frac{1.2}{\sqrt{2.4}} = \sqrt{0.6} \approx 0.77$$이다. 편차 열 두 개가 아래 정리의 가운데로 옮긴 벡터다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

평균이 $$\mu_X, \mu_Y$$인 $$X, Y$$의 **공분산**은

$$\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big] = \mathbb{E}[XY] - \mu_X\mu_Y$$

이고, 두 분산이 양수일 때 **상관계수**는 $$\rho(X, Y) = \frac{\operatorname{Cov}(X, Y)}{\operatorname{SD}(X)\operatorname{SD}(Y)}$$다[^1].

</div>


**성질.**
- $$\operatorname{Cov}(X, X) = \operatorname{Var}[X]$$, 대칭, 각 자리에 대해 선형.
- $$\operatorname{Var}[X + Y] = \operatorname{Var}[X] + \operatorname{Var}[Y] + 2\operatorname{Cov}(X, Y)$$. [분산](/Hongs_Blog/studies/probability-statistics/variance/)의 덧셈에 필요했던 "독립"은 사실 "공분산 0"이면 충분하다.
- $$-1 \le \rho \le 1$$이고, $$\vert \rho\vert  = 1$$ ⇔ $$Y = aX + b$$($$a \ne 0$$)가 확률 1로 성립.
- 독립이면 $$\operatorname{Cov} = 0$$. 역은 맞지 않는다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">$$\vert \rho\vert  \le 1$$의 증명</summary>

1. *가운데로 옮기기:* $$\tilde X = X - \mu_X$$, $$\tilde Y = Y - \mu_Y$$로 두면 $$\operatorname{Cov}(X, Y) = \mathbb{E}[\tilde X\tilde Y]$$, $$\operatorname{Var} = \mathbb{E}[\tilde X^2]$$.
2. *내적으로 보기:* $$\langle U, V\rangle = \mathbb{E}[UV]$$는 확률변수들의 [내적](/Hongs_Blog/studies/linear-algebra/dot-product/) 규칙을 만족한다.
3. *코시–슈바르츠:* $$\vert \mathbb{E}[\tilde X\tilde Y]\vert  \le \sqrt{\mathbb{E}[\tilde X^2]}\sqrt{\mathbb{E}[\tilde Y^2]}$$. 양변을 오른쪽으로 나누면 $$\vert \rho\vert  \le 1$$. 등호는 $$\tilde Y$$가 $$\tilde X$$의 상수배일 때다. ∎

</details>


그래서 $$\rho$$는 가운데로 옮긴 두 확률변수 사이 각의 코사인이다. 자료에서는 편차 벡터 두 개의 코사인이 표본 상관계수다. 예시에서 $$\frac{(4 + 0 + 0 + 0 + 2)}{\sqrt{10}\sqrt6} = \sqrt{0.6}$$이다.

## 예제

**무상관인데 독립이 아닌 경우.** $$X$$가 $$-1, 0, 1$$ 중 하나로 균등하고 $$Y = X^2$$이다.

1. *공분산:* $$\mathbb{E}[X] = 0$$, $$\mathbb{E}[XY] = \mathbb{E}[X^3] = 0$$이라 $$\operatorname{Cov} = 0 - 0 = 0$$.
2. *독립인가:* $$X$$를 알면 $$Y$$가 완전히 정해진다. 수로 확인하면 $$P(X = 0, Y = 0) = \frac13$$인데 $$P(X = 0)P(Y = 0) = \frac19$$다.
3. *이유:* 관계가 포물선이라 왼쪽의 음의 기울기와 오른쪽의 양의 기울기가 상쇄된다. 공분산은 직선 경향만 재기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 공분산 1.2와 상관계수 $$\sqrt{0.6}$$ = 편차 벡터의 코사인, 계산 공식과 합의 분산(무작위 결합분포 300개), $$\vert \rho\vert  \le 1$$과 일차 관계의 $$\rho = \pm1$$, 무상관이지만 독립이 아닌 반례, 카드의 값 — [18_covariance_verify.py](/Hongs_Blog/studies/probability-statistics/code/18_covariance_verify/)</div>

</div>


## 활용

- **부하 분산.** 두 서비스의 부하를 한 서버에 합치면 합의 분산은 $$\operatorname{Var} + \operatorname{Var} + 2\operatorname{Cov}$$다. 서로 반대로 움직이는(음의 공분산) 부하를 묶으면 흔들림이 줄어 용량을 덜 잡아도 된다.
- **추천 시스템.** 사용자 두 명의 평점 벡터의 상관계수(피어슨 유사도)로 취향이 비슷한 사람을 찾는다.
- **특징 선택.** 서로 상관이 매우 높은 입력 특징은 정보가 겹친다. 공분산을 행렬로 모은 것이 [공분산 행렬](/Hongs_Blog/studies/probability-statistics/multivariate-normal/)이다.

## 연결

- 선수: [결합분포](/Hongs_Blog/studies/probability-statistics/joint-distributions/), [분산](/Hongs_Blog/studies/probability-statistics/variance/), [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)(코사인과 코시–슈바르츠)
- 이어지는 개념: [공분산 행렬](/Hongs_Blog/studies/probability-statistics/multivariate-normal/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"상관계수가 크면 한쪽이 다른 쪽의 원인이다"</div>

틀렸다. 함께 움직이는 것을 보면 인과를 떠올리기 쉽다. 하지만 상관은 제3의 공통 원인(여름에 아이스크림 판매와 물놀이 사고가 함께 느는 것은 더위 때문), 우연, 역방향 인과로도 생긴다. 상관계수는 결합분포의 요약일 뿐 방향을 담지 않는다. 인과를 주장하려면 무작위 실험(A/B 테스트)처럼 원인만 바꾸는 설계가 필요하다.

</div>


## 과목별 관점

**데이터 과학 (3-2학기).** 두 속성이 함께 변하는 정도를 재서, 하나에서 다른 하나를 거의 계산해 낼 수 있는 쓸모없는 속성(중복)을 찾는다. 예: 월 매출 × 12 = 연 매출이면 둘 중 하나는 버려도 된다[^d2].

슬라이드는 $$n$$으로 나눈 공분산 $$\operatorname{Cov}(A, B) = \frac1n\sum(a_i - \bar A)(b_i - \bar B)$$와 그 정규화인 피어슨 상관계수(PCC) $$r_{A,B} = \frac{\operatorname{Cov}(A, B)}{\sigma_A\sigma_B}$$를 쓴다[^d1]. 다섯 시점의 두 회사 주가(AllElectronics 6, 5, 4, 3, 2 / HighTech 20, 10, 14, 5, 5)에서 곱의 평균 50.2에서 평균의 곱 $$4 \times 10.8 = 43.2$$를 빼 $$\operatorname{Cov} = 7$$이다. 같이 오르내린다. 공분산은 단위에 따라 크기가 바뀌므로, 크기를 비교하려면 상관계수(약 0.87)를 본다[^d1][^sd1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.17 "Cov(A, B) = 0: A and B are independent", p.18 r = 0 그림에 "Independent" / 문제점: 공분산(상관계수)이 0이면 직선 관계가 없다는 뜻일 뿐 독립은 아니다. 역(독립이면 공분산 0)만 맞다 / 수정안: "Cov = 0이면 무상관(uncorrelated). 독립이면 Cov = 0이지만 반대는 아니다" / 근거: 이 문서의 카드 C2($$Y = X^2$$), 18_covariance_verify.py 주장 3

</div>


명목 속성끼리의 관련성은 공분산 대신 [카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/)으로 잰다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 결합분포가 $$P(0,0) = 0.4$$, $$P(0,1) = 0.1$$, $$P(1,0) = 0.1$$, $$P(1,1) = 0.4$$인 $$X, Y$$의 공분산과 상관계수는?</summary>

**답:** $$\mathbb{E}[XY] = 0.4$$, $$\mathbb{E}[X] = \mathbb{E}[Y] = 0.5$$라 $$\operatorname{Cov} = 0.4 - 0.25 = 0.15$$. 분산은 각각 0.25라 $$\rho = \frac{0.15}{0.25} = 0.6$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 공분산이 0이지만 독립이 아닌 두 확률변수의 예를 들어라.</summary>

**답:** $$X$$가 $$-1, 0, 1$$ 균등, $$Y = X^2$$. $$\operatorname{Cov} = \mathbb{E}[X^3] - 0 = 0$$이지만 $$X$$를 알면 $$Y$$가 정해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\operatorname{Var}[X] = 4$$, $$\operatorname{Var}[Y] = 9$$, $$\rho = 0.5$$일 때 $$\operatorname{Var}[X + Y]$$는? $$\rho = -0.5$$면?</summary>

**답:** $$\operatorname{Cov} = \rho \cdot 2 \cdot 3$$. $$\rho = 0.5$$면 $$4 + 9 + 2 \times 3 = 19$$, $$\rho = -0.5$$면 $$4 + 9 - 6 = 7$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 두 속성 $$A = (6, 5, 4, 3, 2)$$, $$B = (20, 10, 14, 5, 5)$$의 공분산($$n$$으로 나눔)을 구하라. 두 속성은 함께 오르내리는가?</summary>

**답:** $$\overline{AB} = 50.2$$, $$\bar A\bar B = 4 \times 10.8 = 43.2$$이므로 $$\operatorname{Cov} = 7 > 0$$. 함께 오르내린다. 상관계수는 $$\frac{7}{\sqrt2 \times \sqrt{32.56}} \approx 0.87$$이다[^d1].

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 7.3절 "Covariance and correlation"(정의, 성질, 합의 분산, 무상관과 독립의 차이).
[^d1]: 3-2학기/데이터 과학/1.수업자료/02.2-1_data-measure-preprocess.pdf, p.17 (공분산, AllElectronics·HighTech 예), p.18 (피어슨 상관계수)
[^d2]: 같은 자료, p.39 (상관 분석으로 중복 속성 찾기)
[^sd1]: 에이전트 보충. 상관계수 약 0.87과 원본 오류 의심의 판정은 18_covariance_verify.py로 계산했다.
{% endraw %}
