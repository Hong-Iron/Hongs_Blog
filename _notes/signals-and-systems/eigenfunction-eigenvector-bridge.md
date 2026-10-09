---
layout: "note"
title: "LTI 고유함수 ↔ 행렬 고유벡터"
display_title: "LTI 고유함수 ↔ 행렬 고유벡터: 모양을 지키는 입력으로 나누기"
kind: "concept"
kind_label: "브리지"
num: "29"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Eigenfunctions and Eigenvectors", "고유함수와 고유벡터", "고윳값 분해와 푸리에 해석", "Eigendecomposition and Fourier Analysis"]
description: "행렬을 곱해도 방향이 그대로인 벡터가 고유벡터이고, LTI 시스템을 지나도 모양이 그대로인 신호가 고유함수다. 둘 다 \"입력을 이런 특별한 것들의 합으로 나누면, 복잡한 연산이 성분별 곱셈이 된다\"는 같은 생각이다. 수업 자료도 선형대수의 고윳값 분해 A = C\\Lambda C^{…"
prev_url: "/studies/signals-and-systems/lti-eigenfunction/"
prev_title: "LTI 시스템의 고유함수"
next_url: "/studies/signals-and-systems/ct-fourier-series/"
next_title: "연속 시간 푸리에 급수"
math: true
mermaid: false
code_count: 0
permalink: "/studies/signals-and-systems/eigenfunction-eigenvector-bridge/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

행렬을 곱해도 방향이 그대로인 벡터가 고유벡터이고, LTI 시스템을 지나도 모양이 그대로인 신호가 고유함수다. 둘 다 "입력을 이런 특별한 것들의 합으로 나누면, 복잡한 연산이 성분별 곱셈이 된다"는 같은 생각이다. 수업 자료도 선형대수의 고윳값 분해 $$A = C\Lambda C^{-1}$$를 먼저 보이고 푸리에 이론을 그 유추로 소개한다. 차이는 크기다. 행렬은 고유벡터가 유한 개이고, 연속 시간 신호에는 고유함수 $$e^{j\omega t}$$가 무한히 많다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다.

| 선형대수학: $$A = \begin{bmatrix}2&1\\1&2\end{bmatrix}$$에 벡터 $$\mathbf{x}$$ 곱하기 | 신호 및 시스템: 지연 시스템 $$y(t) = x(t-3)$$에 $$x(t) = \cos4t + \cos7t$$ 넣기 |
|---|---|
| 고유벡터 $$(1,-1)$$, $$(1,1)$$, 고윳값 1, 3 | 고유함수 $$e^{\pm j4t}$$, $$e^{\pm j7t}$$, 고유값 $$e^{\mp j12}$$, $$e^{\mp j21}$$ |

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 행렬 | LTI 시스템 | 공통 구조 |
|---|---|---|
| 행렬 $$A$$ | 시스템 (임펄스 응답 $$h$$) | 선형 연산 |
| 고유벡터 $$\mathbf{v}_k$$ | 고유함수 $$e^{j\omega t}$$ | 연산을 지나도 모양(방향)이 그대로 |
| 고윳값 $$\lambda_k$$ | $$H(j\omega)$$ | 그 성분에 곱해지는 수 |
| $$\mathbf{x} = \sum c_k\mathbf{v}_k$$ (고유벡터로 분해) | $$x(t) = \sum a_ke^{jk\omega_0t}$$ (푸리에 급수) | 입력을 특별한 것들의 합으로 |
| $$A\mathbf{x} = \sum c_k\lambda_k\mathbf{v}_k$$ | $$y(t) = \sum a_kH(jk\omega_0)e^{jk\omega_0t}$$ | 출력 = 성분별 곱셈의 합 |
| $$A = C\Lambda C^{-1}$$ (대각화) | 시간 영역 컨벌루션 = 주파수 영역 곱셈 | 좌표를 바꾸면 연산이 대각(곱셈)이 된다 |
| 고유벡터가 서로 수직(대칭 행렬)이면 내적으로 $$c_k$$를 구함 | $$e^{jk\omega_0t}$$가 서로 직교해 내적(적분)으로 $$a_k$$를 구함 | 직교 기저로 계수 구하기 |

</details>


## 어디까지 같은가

- 같은 것: 선형성, 고유한 성분으로 나누는 것, 성분별 곱셈, 직교하면 내적으로 계수를 구한다는 것[^1][^2].
- 다른 것: 행렬은 아무 행렬이나 고유벡터가 다르다. LTI 시스템은 어떤 시스템이든 고유함수가 똑같이 $$e^{st}$$다. 시불변성 덕분이다. 그래서 신호를 미리 한 번 푸리에 성분으로 나눠 두면 모든 LTI 시스템에 쓸 수 있다.
- 행렬은 $$n \times n$$이면 고유벡터가 많아야 $$n$$개다. 주기 신호는 무한히 많은 고조파가 필요하고, 그 무한합이 언제 원래 신호로 수렴하는지가 따로 문제가 된다 → [푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/)
- 순환 행렬(한 칸씩 돌린 행으로 만든 행렬)은 정확히 이산 시간 주기 컨벌루션이고, 그 고유벡터가 DFT 기저 $$e^{j2\pi kn/N}$$이다. 두 세계가 완전히 겹치는 지점이다[^s1].

## 이 연결로 얻는 것

- 선형대수의 "대각화하면 거듭제곱이 쉽다"를 시스템에 쓰면, LTI 시스템을 $$m$$번 직렬로 이은 것의 주파수 응답은 $$H(j\omega)^m$$이다.
- 반대로 푸리에 해석의 직관(주파수별로 키우고 줄인다)이 고유벡터 방향별로 늘이고 줄이는 행렬의 기하학적 그림을 이해시켜 준다.

## 전이 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">그래프의 라플라시안 행렬 $$L$$로 그래프 위의 신호(노드마다의 값)를 다듬는 그래프 신호 처리가 있다. $$L$$의 고유벡터를 "그래프 주파수"라 부르는 이유를 이 문서의 대응표로 설명하라.</summary>

$$L$$은 대칭 행렬이라 서로 수직인 고유벡터로 신호를 나눌 수 있다. 이웃 노드끼리 값이 비슷한 고유벡터는 고윳값이 작고(천천히 변함, 저주파), 이웃끼리 값이 크게 다른 고유벡터는 고윳값이 크다(빠르게 변함, 고주파). 그래서 고유벡터로 나눈 뒤 고윳값이 큰 성분을 줄이면 저역 통과 필터가 된다. 행렬 쪽의 고유벡터가 신호 쪽의 $$e^{j\omega t}$$ 자리, 고윳값이 주파수 자리를 차지한다.

</details>


## 출처

[^1]: 신호 및 시스템 7회 강의 자료 「Week07_CH03_1_handout」, p.14~16 (고유값과 고유벡터, 대각화 $$A = C\Lambda C^{-1}$$), p.20 ("analogous to eigenvectors/eigenvalues matrix decomposition")
[^2]: 같은 자료, p.37~38 (직교 기저 벡터와 내적으로 계수 구하기)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 순환 행렬과 DFT의 관계, 직렬 연결의 $$H^m$$, 전이 문제는 원본에 없다. Strang, *Introduction to Linear Algebra* 5판 9.3절과 그래프 신호 처리의 표준 정의를 바탕으로 썼고, 행렬 예의 고윳값은 [28_lti-eigenfunction_verify.py](/Hongs_Blog/studies/signals-and-systems/code/28_lti-eigenfunction_verify/)로 확인했다.
{% endraw %}
