---
layout: "note"
title: "야코비 방법과 가우스-자이델 방법"
display_title: "야코비 방법과 가우스-자이델 방법 (Jacobi and Gauss-Seidel Methods)"
kind: "concept"
kind_label: "알고리즘"
num: "20"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Jacobi Method", "Gauss-Seidel Method", "반복법", "Iterative Method", "대각 우세", "Diagonal Dominance", "이완", "Relaxation", "SOR", "Successive Over-Relaxation", "과이완", "저이완"]
description: "연립방정식을 한 번에 정확히 풀지 않고, 아무 값이나 넣어 놓고 \"식 하나씩 자기 변수에 대해 풀어서 고치기\"를 되풀이해 답에 다가간다. 야코비 방법은 지난 회차 값만 써서 모든 변수를 한꺼번에 고치고, 가우스-자이델 방법은 방금 고친 값을 바로 다음 식에 써서 더 빨리 다가간다.…"
prev_url: "/studies/numerical-analysis/bounding-volume/"
prev_title: "경계 볼륨"
next_url: "/studies/numerical-analysis/polynomial-interpolation/"
next_title: "다항식 보간"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/jacobi-gauss-seidel/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연립방정식을 한 번에 정확히 풀지 않고, 아무 값이나 넣어 놓고 "식 하나씩 자기 변수에 대해 풀어서 고치기"를 되풀이해 답에 다가간다. 야코비 방법은 지난 회차 값만 써서 모든 변수를 한꺼번에 고치고, 가우스-자이델 방법은 방금 고친 값을 바로 다음 식에 써서 더 빨리 다가간다. 미지수가 수만 개라 소거법이 너무 느릴 때 쓴다. 다만 늘 다가가는 것은 아니다. 각 행에서 대각 원소의 절댓값이 나머지의 절댓값 합보다 크면(대각 우세) 반드시 다가가지만, 그렇지 않으면 멀어질 수도 있다.

</div>


## 예시로 보기

방 안의 빛이 벽과 벽 사이를 몇 번이고 튕기는 것을 계산하는 전역 조명(라디오시티)은 $$B = (I - \rho F)^{-1}E$$를 풀어야 한다. 면이 수만 개라 행렬이 너무 커서 보통 방법으로는 오래 걸린다[^1].

작은 예로 다음을 푼다. 참값은 $$(2, 4, 3)$$이다[^2].

$$4x - y + z = 7, \qquad 4x - 8y + z = -21, \qquad -2x + y + 5z = 15$$


식마다 자기 변수에 대해 푼다: $$x = \frac{7 + y - z}{4}$$, $$y = \frac{21 + 4x + z}{8}$$, $$z = \frac{15 + 2x - y}{5}$$. $$(1, 2, 2)$$에서 시작한다[^3][^4].

| $$k$$ | 야코비 $$(x_k, y_k, z_k)$$ | 가우스-자이델 $$(x_k, y_k, z_k)$$ |
|---|---|---|
| 0 | 1.0, 2.0, 2.0 | 1.0, 2.0, 2.0 |
| 1 | 1.75, 3.375, 3.0 | 1.75, 3.75, 2.95 |
| 2 | 1.84375, 3.875, 3.025 | 1.95, 3.96875, 2.98625 |
| 3 | 1.9625, 3.925, 2.9625 | 1.995625, 3.99609375, 2.99903125 |
| 10 | — | 2.00000000, 4.00000000, 3.00000000 |
| 19 | 2.00000000, 4.00000000, 3.00000000 | — |

가우스-자이델의 1회차 $$y$$는 방금 구한 $$x = 1.75$$를 써서 $$\frac{21 + 7 + 2}{8} = 3.75$$다. 야코비는 아직 옛 $$x = 1$$을 써서 3.375다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 표의 모든 값, 같은 기준에서 반복 횟수(야코비 17, 가우스-자이델 10), 행 순서를 바꾸면 발산, 대각 우세 무작위 행렬 100개에서 수렴, 대각 우세가 아니어도 수렴하는 예, 이완 계수 실험, 카드 C2 — [20_jacobi-gauss-seidel_impl.py](/Hongs_Blog/studies/numerical-analysis/code/20_jacobi-gauss-seidel_impl/)</div>

</div>


## 정의

**입력:** 대각 원소가 0이 아닌 $$n \times n$$ 행렬 $$A$$, 우변 $$\mathbf b$$, 시작값 $$\mathbf x^{(0)}$$, 허용 오차 $$\varepsilon_s$$. **출력:** $$A\mathbf x = \mathbf b$$의 근사해[^2].

**야코비 방법.** $$i$$번째 식을 $$x_i$$에 대해 풀고, 오른쪽에는 모두 지난 회차 값을 넣는다[^5].

$$x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j \ne i}a_{ij}x_j^{(k)}\right), \qquad i = 1, \dots, n$$


**가우스-자이델 방법.** 같은 식이지만 이미 이번 회차에 고친 $$x_1, \dots, x_{i-1}$$은 새 값을 쓴다. 더 나은 근삿값을 쓸 수 있을 때 바로 써서 빨리 다가간다[^6].

$$x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j < i}a_{ij}x_j^{(k+1)} - \sum_{j > i}a_{ij}x_j^{(k)}\right)$$


**멈추는 기준.** 모든 변수의 상대 변화가 허용 오차보다 작으면 멈춘다[^5].

$$\varepsilon_i = \left\vert \frac{x_i^{(k)} - x_i^{(k-1)}}{x_i^{(k)}}\right\vert  < \varepsilon_s$$


```
GAUSS_SEIDEL(A, b, x, eps)            # 인덱스 1부터
  repeat
      done ← true
      for i = 1 to n
          old ← x[i]
          x[i] ← (b[i] − Σ_{j≠i} A[i][j]·x[j]) / A[i][i]   # x[j]는 이미 고친 값이면 새 값
          if |x[i] − old| > eps·|x[i]| then done ← false
  until done
  return x
```

야코비는 새 값을 따로 담아 두었다가 한 회차가 끝난 뒤에 한꺼번에 바꾼다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">수렴의 충분조건</div>

$$A$$가 행 대각 우세이면, 곧 모든 행에서 $$\vert a_{ii}\vert  > \sum_{j \ne i}\vert a_{ij}\vert $$이면, 야코비와 가우스-자이델은 어떤 시작값에서도 참값으로 다가간다[^7].

</div>


예의 행렬은 $$4 > 1 + 1$$, $$8 > 4 + 1$$, $$5 > 2 + 1$$이라 대각 우세다. 이것은 충분조건이다. 대각 우세가 아니어도 수렴할 수 있다(검증 코드의 $$\begin{pmatrix}1 & 1.2\\ 0.1 & 1\end{pmatrix}$$)[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치 (야코비)</summary>

1. *오차의 점화식:* 참값 $$\mathbf x$$도 같은 식을 만족하므로 빼면 $$e_i^{(k+1)} = -\frac{1}{a_{ii}}\sum_{j \ne i}a_{ij}e_j^{(k)}$$이다($$\mathbf e = $$ 근삿값 $$-$$ 참값).
2. *한 번에 줄어드는 비율:* 가장 큰 오차를 $$\Vert \mathbf e\Vert _\infty$$라 하면 $$\vert e_i^{(k+1)}\vert  \le \frac{\sum_{j \ne i}\vert a_{ij}\vert }{\vert a_{ii}\vert }\Vert \mathbf e^{(k)}\Vert _\infty \le \rho\Vert \mathbf e^{(k)}\Vert _\infty$$이다. $$\rho$$는 행마다의 비율 중 가장 큰 값이다.
3. *0으로:* 대각 우세라 $$\rho < 1$$이고 $$\Vert \mathbf e^{(k)}\Vert _\infty \le \rho^k\Vert \mathbf e^{(0)}\Vert _\infty \to 0$$이다(등비수열).

</details>


**이완.** 가우스-자이델로 구한 새 값과 옛 값을 섞는다[^8].

$$x_i^{(k+1)} \leftarrow \lambda x_i^{(k+1)} + (1 - \lambda)x_i^{(k)}, \qquad 0 < \lambda < 2$$


- $$\lambda = 1$$: 그대로 가우스-자이델.
- $$0 < \lambda < 1$$(저이완): 한 걸음을 줄여 수렴하지 않는 계를 수렴하게 돕는다.
- $$1 < \lambda < 2$$(과이완, SOR): 한 걸음을 늘려 수렴을 빠르게 한다.

과이완이 늘 빠른 것은 아니다. 예의 계에서 $$\lambda = 1.1$$은 13번으로 가우스-자이델(10번)보다 느렸다. 대신 대각에 2, 이웃에 $$-1$$인 $$10 \times 10$$ 행렬에서는 $$\lambda = 1.5$$가 251번을 73번으로 줄였다. 좋은 $$\lambda$$는 행렬에 따라 다르다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 식마다 자기 변수에 대해 풀 수 있으려면 왜 대각 원소가 0이 아니어야 하는가?</summary>

$$x_i$$에 대해 풀 때 $$a_{ii}$$로 나누기 때문이다. 대각에 0이 있으면 행 순서를 바꿔 0이 아닌 수(되도록 큰 수)를 대각에 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 2단계에서 대각 우세가 하는 일</summary>

한 회차를 돌 때 오차가 "옆 칸 오차들의 무게 합"으로 바뀌는데, 무게 합이 $$\frac{\sum\vert a_{ij}\vert }{\vert a_{ii}\vert } < 1$$이라 가장 큰 오차가 매번 일정 비율 이상 줄어든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 가우스-자이델이 보통 더 빠른 이유</summary>

같은 회차 안에서 이미 더 정확해진 값을 바로 써서, 한 회차에 고친 정보가 다음 식에 곧바로 퍼진다. 표에서 1회차 $$y$$가 야코비 3.375, 가우스-자이델 3.75로 참값 4에 더 가깝다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법의 핵심 아이디어는?</summary>

답을 한 번에 구하지 않고, "고친 값이 다시 같은 식을 만족하는 점"(고정점)을 되풀이로 찾는다. 오차가 매번 1보다 작은 비율로 줄면 결국 0이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

비선형 방정식의 고정점 반복($$x = g(x)$$를 되풀이), PageRank의 거듭제곱법, 열 전도처럼 이웃 값의 평균으로 자기 값을 고치는 격자 계산.

</details>


## 예제

**행 순서가 중요하다.** 예의 첫 두 식을 바꾸면 첫 행이 $$4x - 8y + z$$라 $$\vert 4\vert  < 8 + 1$$로 대각 우세가 깨진다.

- 목표 1, 판정: 1행 $$4 < 9$$이라 대각 우세가 아니다.
- 목표 2, 실행: 같은 시작값으로 야코비를 30번 돌리면 값이 1000을 넘는다(발산).
- 목표 3, 고치기: 원래 순서로 되돌려 대각 우세를 만든다.

## 활용

- 연습: [예제 사다리](/Hongs_Blog/studies/numerical-analysis/jacobi-gs-ladder/)(완전한 풀이 → 빈칸 → 독립 문제)
- 복잡도: 한 회차가 행렬의 0 아닌 원소 수만큼 연산이다. 가우스 소거가 $$\frac23 n^3$$인 것과 달리, 0이 대부분인 큰 행렬(희소 행렬)에서는 반복이 훨씬 싸다. 메모리도 행렬을 바꾸지 않아 원래 크기만 쓴다[^s1].
- 야코비는 한 회차 안의 계산이 서로 독립이라 GPU에서 병렬로 하기 좋다. 가우스-자이델은 순서가 있어 병렬화가 어렵다.
- 쓰는 곳: 라디오시티, 편미분방정식을 격자로 푼 연립방정식(열 전도, 유체), 큰 회로 해석.
- 흔한 실수: 수렴 판정을 절대 변화로만 하는 것. 값이 큰 변수는 상대 변화로 봐야 한다. 또 참값이 0에 가까운 변수는 상대 변화의 분모가 0에 가까워진다.

## 연결

- 선수: [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/), [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)(바로 푸는 방법과 비교)
- 수렴과 오차의 크기: [노름과 조건수](/Hongs_Blog/studies/linear-algebra/conditioning/), 등비수열의 수렴: [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"반복법은 시작값만 참값에 가깝게 잡으면 언제나 수렴한다"</div>

틀렸다. 수렴 여부는 시작값이 아니라 행렬이 정한다. 시작값이 가까우면 반복 횟수가 줄 뿐이다. 오차가 회차마다 행렬이 정하는 비율로 곱해지므로, 그 비율이 1보다 크면 아무리 가까이서 시작해도 오차가 불어난다. 예의 식 순서를 바꾸면 같은 시작값 $$(1, 2, 2)$$에서도 발산한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 야코비와 가우스-자이델의 갱신식을 쓰고 차이를 말하라.</summary>

**답:** 야코비 $$x_i^{(k+1)} = \frac1{a_{ii}}(b_i - \sum_{j \ne i}a_{ij}x_j^{(k)})$$. 가우스-자이델은 $$j < i$$인 항에 이번 회차의 새 값 $$x_j^{(k+1)}$$을 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$2x + y = 5$$, $$x + 3y = 10$$을 $$(0, 0)$$에서 한 회차 돌려라. 야코비와 가우스-자이델 각각.</summary>

**답:** 야코비: $$x = \frac{5 - 0}{2} = 2.5$$, $$y = \frac{10 - 0}{3} \approx 3.333$$. 가우스-자이델: $$x = 2.5$$, $$y = \frac{10 - 2.5}{3} = 2.5$$. 참값은 $$(1, 3)$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 대각 우세이면 왜 오차가 줄어드는가?</summary>

**답:** 한 회차 뒤의 오차 $$e_i$$는 다른 변수들의 오차에 $$\frac{a_{ij}}{a_{ii}}$$를 곱해 더한 것이다. 대각 우세면 그 무게의 절댓값 합이 1보다 작아, 가장 큰 오차가 회차마다 1보다 작은 비율로 곱해져 0으로 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 위 의사코드의 `x[i] ← (b[i] − Σ A[i][j]·x[j]) / A[i][i]` 한 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 다른 변수들은 지금 가진 값으로 두고, $$i$$번째 식이 정확히 맞도록 $$x_i$$ 하나만 고친다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 대각 우세가 아닌데도 가우스-자이델이 수렴하는 행렬을 들라. 대각 우세 조건에 대해 무엇을 알려 주나?</summary>

**답:** $$\begin{pmatrix}1 & 1.2\\ 0.1 & 1\end{pmatrix}$$(1행 $$1 < 1.2$$). 우변 $$(2.2, 1.1)$$에서 $$(1, 1)$$로 수렴한다. 대각 우세는 수렴의 충분조건이지 필요조건이 아니다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/11.na11_iterative.pdf, p.2
[^2]: 같은 자료, p.3~4
[^3]: 같은 자료, p.5~6
[^4]: 같은 자료, p.9~10
[^5]: 같은 자료, p.7
[^6]: 같은 자료, p.8
[^7]: 같은 자료, p.12
[^8]: 같은 자료, p.13
[^s1]: 에이전트 보충. 반복 횟수와 이완 실험, 대각 우세가 아니어도 수렴하는 예, 의사코드, 증명 스케치(무한 노름 축소), 스스로 설명해 보기, 예제, 복잡도·병렬화·쓰는 곳, 흔한 실수, 오해, 카드 C2~C5는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
