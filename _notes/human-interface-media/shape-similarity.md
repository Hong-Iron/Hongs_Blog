---
layout: "note"
title: "모양의 비슷함 재기"
display_title: "모양의 비슷함 재기 (Measuring Shape Similarity)"
kind: "concept"
kind_label: "기법"
num: "28"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Shape Similarity", "유사도", "similarity", "평균 제곱 차이", "mean squared difference", "MSE", "정규화 교차 상관", "normalized cross-correlation", "NCC", "상관계수", "correlation coefficient"]
description: "아이들은 \"같은 그림 찾기\"를 눈으로 금방 하지만, 컴퓨터는 두 데이터가 얼마나 비슷한지를 숫자 하나로 받아야 한다. 가장 먼저 떠오르는 방법은 칸마다 차이를 제곱해 평균 내는 것인데, 이 값은 한쪽이 전체적으로 더 밝거나 크기만 해도 커진다. 모양만 비교하려면 두 데이터에서 각자…"
prev_url: "/studies/human-interface-media/two-dimensional-functions/"
prev_title: "2차원 함수"
next_url: "/studies/human-interface-media/cross-correlation/"
next_title: "교차 상관"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/shape-similarity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

아이들은 "같은 그림 찾기"를 눈으로 금방 하지만, 컴퓨터는 두 데이터가 얼마나 비슷한지를 숫자 하나로 받아야 한다. 가장 먼저 떠오르는 방법은 칸마다 차이를 제곱해 평균 내는 것인데, 이 값은 한쪽이 전체적으로 더 밝거나 크기만 해도 커진다. 모양만 비교하려면 두 데이터에서 각자의 평균을 빼고 퍼진 정도로 나눈 뒤 비교해야 한다. 이렇게 만든 상관계수는 −1에서 1 사이 값으로, 1에 가까울수록 모양이 같다.

</div>


## 예시로 보기

막대그래프 두 개 $$X = [x_1, x_2, x_3]$$, $$Y = [y_1, y_2, y_3]$$가 얼마나 다른지 수로 적어 보자[^1]. 칸마다 차이를 더하면, 데이터가 3개일 때와 4개일 때 값의 크기가 달라진다. 차이가 모두 1이어도 3개면 합이 3, 4개면 4다. 그래서 개수로 나눈다. 데이터 개수와 상관없게 만드는 이 과정이 정규화다[^1].

그런데 평균 차이로는 부족하다. $$X = [1, 2, 3, 4]$$와 거꾸로 놓인 $$[4, 3, 2, 1]$$은 모양이 정반대인데, 차이 $$-3, -1, 1, 3$$을 평균 내면 0이다[^2]. 양수와 음수가 서로 지운다. 그래서 차이를 제곱(또는 절댓값)한다. 제곱해 평균 내면 $$(9 + 1 + 1 + 9)/4 = 5$$다.

평균 제곱 차이도 모양을 다 말해 주지는 못한다[^2]. 같은 값 1이 두 가지 전혀 다른 상황에서 나온다.

| 차이 | 평균 제곱 차이 | 상황 |
|---|---|---|
| $$(2, 0, 0, 0)$$ | 1 | 하나만 빼고 모두 같다 |
| $$(1, -1, 1, -1)$$ | 1 | 조금씩 모두 다르다 |

더 큰 문제는 모양이 같아도 값이 커진다는 것이다.

| $$Y$$ | 평균 제곱 차이 | 상관계수 |
|---|---|---|
| $$X + 10 = [11, 12, 13, 14]$$ (전체가 밝아짐) | 100 | 1 |
| $$2X = [2, 4, 6, 8]$$ (대비가 커짐) | 7.5 | 1 |
| $$[4, 3, 2, 1]$$ (뒤집힘) | 5 | −1 |

전체가 밝아진 사진은 모양이 그대로인데 평균 제곱 차이는 가장 크다. "평균이 같아도 모양이 다를 수 있음", 거꾸로 "평균이 달라도 모양이 같음"을 나타내는 또 다른 척도가 필요하다[^2]. 그것이 오른쪽 열의 상관계수다.

## 정의

강의는 비슷함을 재는 도구를 세 무리로 묶는다[^3]. 분산 무리(분산, 공분산, 교차 공분산), 상관 무리(상관, 교차 상관, 자기 상관), 그리고 합성곱이다. 이 문서는 두 데이터를 한 번에 비교하는 앞의 두 무리를 다룬다. 한쪽을 옮겨 가며 비교하는 교차 상관과 합성곱은 [교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/)에 있다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

데이터 $$x_1, \dots, x_n$$과 $$y_1, \dots, y_n$$의 평균을 $$\bar{x}$$, $$\bar{y}$$, 표준편차를 $$\sigma_x$$, $$\sigma_y$$라 한다.
- **평균 제곱 차이**: $$\frac{1}{n}\sum_{i=1}^{n}(x_i - y_i)^2$$
- **공분산**: 각자 평균에서 벗어난 양을 곱해 평균 낸 값[^4]. $$\operatorname{cov}(X, Y) = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})$$
- **상관계수**: 공분산을 두 표준편차로 나눈 값. $$-1 \le \rho \le 1$$이다[^5].

$$ \rho_{X,Y} = \frac{\operatorname{cov}(X, Y)}{\sigma_X\sigma_Y} = \frac{1}{n}\sum_{i=1}^{n}\frac{(x_i - \bar{x})(y_i - \bar{y})}{\sigma_x\sigma_y} \qquad (\sigma_X\sigma_Y > 0) $$

</div>


말로 읽으면, 두 데이터 각각에서 평균을 빼서 "높이"를 지우고, 표준편차로 나눠 "크기"를 지운 뒤, 남은 모양끼리 곱해 평균 낸다. 그래서 $$X + 10$$이나 $$2X$$는 $$X$$와 상관계수가 1이다. 분산·공분산·상관계수의 자세한 성질은 [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)에 있다.

**정규화 교차 상관 계수(NCC).** 강의는 두 함수(또는 영상 조각) $$f$$, $$g$$의 비슷함을 이렇게 적는다[^5].

$$ NCC(f, g) = \frac{1}{n}\sum_{i=1}^{n}\frac{f(x_i)g(x_i)}{\sigma_f\sigma_g} \quad \text{또는} \quad \frac{1}{n}\sum_{i=1}^{n}\frac{(f(x_i) - \bar{f})(g(x_i) - \bar{g})}{\sigma_f\sigma_g} $$


두 식은 같지 않다. 평균을 빼는 뒤의 식이 상관계수이고, 밝기가 통째로 바뀌어도 값이 그대로다. 평균을 빼지 않는 앞의 식은 $$X$$와 $$X + 10$$을 비교하면 1이 아니라 훨씬 큰 값이 나온다. 모양만 비교하려면 뒤의 식을 쓴다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "zero-normalized $$Corr(X, Y) = \frac{1}{n}\sum(x_i - \bar{x})(y_i - \bar{y})$$"(p.8) / 문제점: 평균만 빼고 표준편차로 나누지 않아 공분산과 같다. 그래서 크기에 따라 값이 바뀐다: $$X$$와 $$2X$$에서 2.5, $$X$$와 $$10X$$에서 12.5 / 수정안: 영평균 정규화 상관(ZNCC)은 표준편차로도 나눈다. $$\frac{1}{n}\sum\frac{(x_i - \bar{x})(y_i - \bar{y})}{\sigma_x\sigma_y}$$ / 근거: [28_shape-similarity_verify.py](/Hongs_Blog/studies/human-interface-media/code/28_shape-similarity_verify/)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 개수에 따른 합의 변화, 평균 차이 0인 반대 모양, 평균 제곱 차이가 같은 두 차이 모양, 밝기·대비가 바뀌어도 상관계수 1, NCC 두 식의 차이, 공분산이 크기에 따라 바뀜 (실험으로 확인됨) — [28_shape-similarity_verify.py](/Hongs_Blog/studies/human-interface-media/code/28_shape-similarity_verify/)</div>

</div>


## 활용

- 사진에서 작은 조각(틀)과 가장 비슷한 곳을 찾을 때, 틀을 옮겨 가며 위치마다 상관계수를 잰다. 그 결과를 그림으로 그린 것이 슬라이드의 상관 그래프 영상이고, 같은 모양이 있는 곳이 밝게 빛난다[^6]. 자세한 방법은 [교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/)에 있다.
- 조명이 바뀌는 환경(낮과 밤, 그늘)에서는 평균 제곱 차이 대신 상관계수를 쓴다. 전체 밝기와 대비가 바뀌어도 값이 그대로이기 때문이다.
- 흔한 실수: 상관계수 1을 "같은 데이터"로 읽는 것. 모양이 같다는 뜻이지 값이 같다는 뜻이 아니다.

## 연결

- 선수: [디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/), [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)
- 한쪽을 옮겨 가며 비교하기: [교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"평균 제곱 차이가 작을수록 모양이 비슷하다"</div>

항상 그렇지는 않다. 평균 제곱 차이는 모양과 함께 높이와 크기의 차이까지 한꺼번에 잰다. 그래서 모양이 똑같고 밝기만 다른 $$X$$와 $$X + 10$$이 100으로, 모양이 정반대인 $$X$$와 $$[4, 3, 2, 1]$$의 5보다 훨씬 "달라" 보인다. 확인 방법: 둘의 상관계수는 1과 −1이다. 모양만 보려면 평균을 빼고 표준편차로 나눈 뒤 비교한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 차이의 합을 개수로 나누는 이유와, 차이를 제곱(또는 절댓값)하는 이유를 각각 쓰라.</summary>


**답:** 개수로 나누지 않으면 데이터가 많을수록 값이 커져 길이가 다른 데이터끼리 비교할 수 없다. 제곱하지 않으면 양의 차이와 음의 차이가 서로 지워져, 모양이 정반대여도 평균 차이가 0이 될 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$X = [1, 2, 3, 4]$$, $$Y = [3, 5, 7, 9]$$의 평균 제곱 차이와 상관계수를 구하라. 두 값이 말하는 것은?</summary>


**답:** 차이 $$-2, -3, -4, -5$$의 제곱 평균은 $$(4 + 9 + 16 + 25)/4 = 13.5$$. $$Y = 2X + 1$$이라 상관계수는 1이다. 값은 많이 다르지만 모양은 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 낮에 찍은 틀과 해 질 녘에 찍은 사진(전체가 어둡고 대비가 약함)을 맞춰야 한다. 평균 제곱 차이, 평균을 빼지 않는 NCC, 상관계수 중 무엇을 쓰고, 나머지는 왜 안 되는가?</summary>


**답:** 상관계수(평균을 빼고 표준편차로 나눈 NCC). 평균 제곱 차이는 전체 밝기 차이 때문에 맞는 자리에서도 커진다. 평균을 빼지 않는 NCC는 밝기의 평균이 곱셈에 끼어들어, 밝은 곳에서 값이 커지는 쪽으로 치우친다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/06.HIM_강의06_모양맞추기.pdf, p.4 (막대 그래프의 비슷함, 데이터 개수로부터 독립 → 정규화 방법)
[^2]: 같은 자료, p.5 (평균 차이가 0이라면? 제곱 또는 절댓값, 평균 자승 차이가 같은 값이라도 하나만 빼고 같을 때와 조금씩 모두 다를 때, 또 다른 척도)
[^3]: 같은 자료, p.6 (분산 가족, 상관 가족, 합성곱). 같은 자료 p.2~3의 같은 그림 찾기가 이 강의의 출발점이다.
[^4]: 같은 자료, p.7 (분산, 공분산 $$\operatorname{Cov}(X, Y) = \frac{1}{n}\sum(x_i - \bar{x})(y_i - \bar{y})$$)
[^5]: 같은 자료, p.8 (상관계수, 교차 상관 계수 NCC의 두 식, 상관, zero-normalized Corr)
[^6]: 같은 자료, p.3, p.43 (상관 그래프 영상)
[^s1]: 에이전트 보충. 표의 수치, NCC 두 식의 차이 설명, 카드 C2·C3은 원본에 없다. 검증 코드로 계산했다.
{% endraw %}
