---
layout: "note"
title: "자료 선형화"
display_title: "자료 선형화 (Data Linearization)"
kind: "concept"
kind_label: "기법"
num: "24"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "데이터와 계산"
track_sub: "신호와 수치 계산"
updated: "2026-10-15"
status: "verified"
aliases: ["Data Linearization", "선형화", "Linearization", "거듭제곱 맞춤", "Power Fit", "지수 맞춤", "Exponential Fit", "비선형 최소제곱", "Nonlinear Least Squares", "오차 노름", "RMS Error"]
description: "자료가 직선이 아니라 지수 곡선이나 거듭제곱 곡선을 따를 때, 축을 바꿔(예: y 대신 \\ln y) 직선으로 펴 놓고 최소제곱 직선을 구하는 방법이다. 직선 맞추기는 연립방정식 하나로 끝나므로 빠르고 쉽다. 다만 펴진 축에서 오차를 줄인 것이라, 원래 축에서의 오차 제곱합이 가장 …"
prev_url: "/studies/numerical-analysis/slerp/"
prev_title: "구면 선형 보간"
next_url: "/studies/numerical-analysis/golden-section-search/"
next_title: "황금분할 탐색"
math: true
mermaid: true
code_count: 2
code_files: [{"t": "24_data-linearization_plot.py", "u": "/studies/numerical-analysis/code/24_data-linearization_plot/", "r": "그림 생성"}, {"t": "24_data-linearization_verify.py", "u": "/studies/numerical-analysis/code/24_data-linearization_verify/", "r": "검증"}]
permalink: "/studies/numerical-analysis/data-linearization/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자료가 직선이 아니라 지수 곡선이나 거듭제곱 곡선을 따를 때, 축을 바꿔(예: $$y$$ 대신 $$\ln y$$) 직선으로 펴 놓고 최소제곱 직선을 구하는 방법이다. 직선 맞추기는 연립방정식 하나로 끝나므로 빠르고 쉽다. 다만 펴진 축에서 오차를 줄인 것이라, 원래 축에서의 오차 제곱합이 가장 작은 답은 아니다. 원래 오차를 정말 최소로 하려면 비선형 최소제곱을 반복법으로 풀어야 한다.

</div>


## 예시로 보기

세균 수가 시간마다 $$(0, 1.5), (1, 2.5), (2, 3.5), (3, 5.0), (4, 7.5)$$이다. 늘어나는 폭이 점점 커지니 $$y = Ce^{Ax}$$를 맞춘다. 미지수 $$A$$가 지수에 있어 정규방정식이 일차가 아니다.

양변에 로그를 취하면 $$\ln y = Ax + \ln C$$로 직선이다. 자료를 $$(x_k, \ln y_k) = (0, 0.40547), (1, 0.91629), (2, 1.25276), (3, 1.60944), (4, 2.01490)$$으로 바꿔 최소제곱 직선을 구하면 $$A = 0.3912023$$, $$\ln C = B$$에서 $$C = e^B = 1.579910$$이다.

| | 선형화 | 비선형 최소제곱 |
|---|---|---|
| 식 | $$1.579910e^{0.3912023x}$$ | $$1.6109e^{0.38357x}$$ |
| 원래 오차 제곱합 | 0.0501 | 0.0409 |
| $$x = 10$$ 예측 | 78.9955 | 74.6287 |

자료 범위 안에서는 둘이 거의 같지만, 멀리 외삽하면 차이가 커진다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/24_data-linearization_fig1.svg" alt="그림" width="555" height="311" loading="lazy">

왼쪽은 세로축에 $$y$$ 대신 $$\ln y$$를 둔 것으로, 점들이 거의 한 직선 위에 놓인다. 오른쪽은 원래 축이다. 두 곡선은 자료 범위에서는 겹치고, $$x = 4$$를 넘어 외삽할수록 벌어진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 거듭제곱 맞춤의 합과 $$A$$, $$g = 2A$$, 로그 변환 값, 선형화 계수, 가우스-뉴턴으로 비선형 해, 두 오차 비교, $$x = 10$$ 예측, 다른 선형화 두 가지, 카드 C2 — [24_data-linearization_verify.py](/Hongs_Blog/studies/numerical-analysis/code/24_data-linearization_verify/)</div>

</div>


## 정의

### 거듭제곱 맞춤

$$y = Ax^M$$에서 $$M$$을 알고 $$A$$만 구한다. 오차 제곱합 $$E(A) = \sum_k(Ax_k^M - y_k)^2$$을 최소화한다. $$E'(A) = 2\sum_k(Ax_k^M - y_k)x_k^M = 0$$에서 다음을 얻는다.

$$A = \frac{\sum_k x_k^My_k}{\sum_k x_k^{2M}}$$


예를 들어 떨어지는 물체의 시간 $$t$$와 거리 $$d$$로 $$d = \frac12gt^2$$($$M = 2$$)을 맞춘다. $$\sum d_kt_k^2 = 7.68680$$, $$\sum t_k^4 = 1.5664$$라 $$A = 4.9073$$이다. $$A$$가 $$\frac12g$$ 자리에 있으니 중력 가속도는 $$g = 2A = 9.8146\ \mathrm{m/s^2}$$이다.


### 자료 선형화

비선형 관계를 변수를 바꿔 선형 관계 $$Y = AX + B$$로 만드는 것이다.

| 모형 | 바꾼 변수 | 계수 되돌리기 |
|---|---|---|
| $$y = Ce^{Ax}$$ | $$X = x$$, $$Y = \ln y$$ | $$C = e^B$$ |
| $$y = A\ln x + B$$ | $$X = \ln x$$, $$Y = y$$ | 그대로 |
| $$y = \frac{x}{Cx + D}$$ | $$X = \frac1x$$, $$Y = \frac1y$$ | $$C = B$$, $$D = A$$ |

셋째 줄은 $$\frac1y = \frac{Cx + D}{x} = D\frac1x + C$$에서 나온다. 바꾼 자료 $$(X_k, Y_k)$$에 정규방정식을 푼다.

$$\left(\sum X_k^2\right)A + \left(\sum X_k\right)B = \sum X_kY_k, \qquad \left(\sum X_k\right)A + NB = \sum Y_k$$


```mermaid
flowchart LR
    D["자료 xk, yk"] -->|"변수 바꾸기"| T["바꾼 자료 Xk, Yk"]
    T -->|"정규방정식"| AB["직선의 A, B"]
    AB -->|"계수 되돌리기"| M["모형의 계수"]
    M -.->|"시작값으로"| N["비선형 최소제곱 반복"]
    N --> M2["원래 축 오차가 최소인 계수"]
```

실선만 따라가면 선형화로 끝난다. 원래 축의 오차를 정말 최소로 하려면 점선을 따라 그 답을 반복법의 시작값으로 넘긴다.

### 비선형 최소제곱

원래 축의 오차 $$E(A, C) = \sum_k(Ce^{Ax_k} - y_k)^2$$을 직접 최소화한다. 두 편미분을 0으로 두면 $$A$$, $$C$$에 대한 비선형 연립방정식이 된다. 이것은 뉴턴 방법으로 풀 수 있지만 시간이 들고 좋은 시작값이 필요하다. 최적화 방법으로 $$E$$를 직접 줄이기도 한다. 선형화한 답을 시작값으로 쓰면 좋다.

## 활용

- 성장·감쇠(인구, 방사능, 약물 농도), 물리 법칙의 상수 찾기, 실험 자료의 경향 파악에 쓴다.
- 흔한 실수: 선형화한 답을 원래 오차의 최소라고 믿는 것. 로그를 취하면 큰 $$y$$의 오차가 작게, 작은 $$y$$의 오차가 크게 다뤄져 무게가 바뀐다. 또 $$y \le 0$$인 자료가 있으면 로그를 취할 수 없다.

## 연결

- 선수: [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)(바꾼 자료에 쓰는 도구, 오차 노름은 그 문서의 과목별 관점), [로그](/Hongs_Blog/studies/college-math/logarithm/)
- 통계에서의 같은 직선 맞추기: [선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/)
- 비선형 오차를 직접 줄이기: [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/), [황금분할 탐색](/Hongs_Blog/studies/numerical-analysis/golden-section-search/)·[직접 탐색법](/Hongs_Blog/studies/numerical-analysis/direct-search/) 같은 최적화 방법, [다변수 뉴턴 방법](/Hongs_Blog/studies/numerical-analysis/multivariate-newton/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$y = Ce^{Ax}$$와 $$y = \frac{x}{Cx + D}$$를 선형화하는 변수 바꾸기를 쓰라.</summary>

**답:** $$Y = \ln y$$, $$X = x$$로 $$Y = AX + \ln C$$. $$Y = \frac1y$$, $$X = \frac1x$$로 $$Y = DX + C$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$y = Ce^{Ax}$$가 $$(0, 2)$$와 $$(1, 2e)$$를 지난다. 선형화로 $$A$$, $$C$$를 구하라.</summary>

**답:** $$\ln y$$는 $$\ln 2$$와 $$\ln2 + 1$$이라 직선의 기울기 $$A = 1$$, 절편 $$\ln C = \ln 2$$로 $$C = 2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형화로 구한 지수 곡선이 원래 오차 제곱합을 최소로 하지 않는 이유는?</summary>

**답:** 최소로 만든 것은 $$\ln y$$ 축의 오차 제곱합이다. 로그는 큰 값의 차이를 줄이고 작은 값의 차이를 늘리므로, 같은 자료라도 원래 축에서 보면 점마다 다른 무게로 맞춘 셈이다. 예시에서 원래 오차는 선형화 0.0501, 비선형 0.0409다.

</details>


[^s1]: 검증 코드로 확인했다.
[^s2]: [24_data-linearization_plot.py](/Hongs_Blog/studies/numerical-analysis/code/24_data-linearization_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 두 맞춤의 계수, 오차 제곱합 0.0501과 0.0409, $$x = 10$$ 예측 78.9955와 74.6287. 비선형 해는 가우스-뉴턴 방법으로 다시 구했다.
{% endraw %}
