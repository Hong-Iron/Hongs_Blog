---
layout: "note"
title: "대각화와 행렬 거듭제곱"
display_title: "대각화와 행렬 거듭제곱 (Diagonalization)"
kind: "concept"
kind_label: "정리"
num: "20"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Diagonalization", "대각화", "고유분해", "eigendecomposition", "행렬 거듭제곱", "matrix power", "대각화 가능", "diagonalizable", "결함 행렬", "defective matrix", "조르당 블록", "Jordan block", "정상 상태", "steady state", "선형 동역학계", "linear dynamical system"]
description: "고유벡터들을 새 좌표축(기저)으로 삼으면, 복잡해 보이던 변환이 \"축마다 따로 늘이기\"로 바뀐다. 그러면 행렬을 100번 곱하는 일도 고윳값을 100제곱하는 일로 줄고, 시스템의 장기 행동(무엇이 남고, 무엇이 사라지고, 무엇이 폭발하는지)이 한눈에 보인다. 다만 고유벡터가 차원 …"
prev_url: "/studies/linear-algebra/eigenvalues/"
prev_title: "고윳값과 고유벡터"
next_url: "/studies/linear-algebra/recurrence-matrix-bridge/"
next_title: "선형 점화식 ↔ 행렬 거듭제곱"
math: true
mermaid: true
code_count: 2
permalink: "/studies/linear-algebra/diagonalization/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

고유벡터들을 새 좌표축(기저)으로 삼으면, 복잡해 보이던 변환이 "축마다 따로 늘이기"로 바뀐다. 그러면 행렬을 100번 곱하는 일도 고윳값을 100제곱하는 일로 줄고, 시스템의 장기 행동(무엇이 남고, 무엇이 사라지고, 무엇이 폭발하는지)이 한눈에 보인다. 다만 고유벡터가 차원 수만큼 모이지 않는 행렬도 있어, 모든 행렬이 대각화되는 것은 아니다.

</div>


## 예시로 보기

[앞 문서](/Hongs_Blog/studies/linear-algebra/eigenvalues/)의 인구 이동 행렬 $$A = \begin{pmatrix}0.8 & 0.3\\ 0.2 & 0.7\end{pmatrix}$$은 고유벡터 $$(0.6, 0.4)$$($$\lambda = 1$$)와 $$(1, -1)$$($$\lambda = \frac12$$)을 가진다. 이 둘을 열로 세우면

$$X = \begin{pmatrix}0.6 & 1\\ 0.4 & -1\end{pmatrix}, \quad \Lambda = \begin{pmatrix}1 & 0\\ 0 & \frac12\end{pmatrix}, \quad A = X\Lambda X^{-1}.$$

$$k$$년 뒤의 행렬은 $$A^k = X\Lambda^k X^{-1}$$이고 $$\Lambda^k = \operatorname{diag}(1, 2^{-k})$$다. $$k \to \infty$$이면 $$2^{-k} \to 0$$이라 $$A^k \to \begin{pmatrix}0.6 & 0.6\\ 0.4 & 0.4\end{pmatrix}$$. 어디서 출발하든 결국 도심 60%, 교외 40%가 된다. 고유벡터 행렬이 아래 정리의 $$X$$다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">대각화</div>

$$n \times n$$ 행렬 $$A$$가 선형독립인 고유벡터 $$\mathbf{x}_1, \dots, \mathbf{x}_n$$을 가지면, 이것을 열로 세운 $$X$$와 고윳값을 대각에 놓은 $$\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$$에 대해

$$A = X\Lambda X^{-1}, \qquad A^k = X\Lambda^k X^{-1}.$$

역도 맞는다. $$A = X\Lambda X^{-1}$$이면 $$X$$의 열은 $$A$$의 독립인 고유벡터다. 고윳값이 모두 다르면 고유벡터는 자동으로 독립이라 대각화된다[^1].

</div>


**가정 목록.** (1) 정사각 행렬, (2) 독립인 고유벡터가 $$n$$개. 고윳값이 모두 다르다는 것은 (2)의 충분조건이지 필요조건이 아니다.

**동역학계.** $$\mathbf{u}_{k+1} = A\mathbf{u}_k$$이면 $$\mathbf{u}_0 = c_1\mathbf{x}_1 + \cdots + c_n\mathbf{x}_n$$으로 쪼개어

$$\mathbf{u}_k = c_1\lambda_1^k\mathbf{x}_1 + \cdots + c_n\lambda_n^k\mathbf{x}_n.$$

$$\vert \lambda_i\vert  < 1$$인 성분은 사라지고, $$\vert \lambda_i\vert  > 1$$인 성분은 폭발하며, $$\lambda_i = 1$$인 성분은 남는다. 계수는 $$\mathbf{c} = X^{-1}\mathbf{u}_0$$이다.

```mermaid
flowchart LR
    U0["출발 상태 u₀"] -->|"X⁻¹"| C["고유벡터 좌표 c₁ … cₙ"]
    C -->|"cᵢ마다 λᵢᵏ 곱하기"| CK["c₁λ₁ᵏ … cₙλₙᵏ"]
    CK -->|"X"| UK["k단계 뒤 uₖ"]
    U0 -->|"A를 k번 곱하기"| UK
```

A를 k번 곱하는 대신, 고유벡터 좌표로 옮겨 칸마다 λᵏ만 곱하고 되돌아온다. 가운데 단계에서는 칸끼리 섞이지 않는다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/20_diagonalization_fig1.svg" alt="그림" loading="lazy">

왼쪽은 세 출발점의 도심 비율이 0.6으로 모이는 모습이다. 오른쪽은 각 출발점의 $$\lambda = \frac12$$ 성분 크기 $$\vert c_2\vert (\frac12)^k$$를 로그 눈금으로 그렸다. 세 직선의 기울기가 같아, 어디서 출발하든 그 성분이 해마다 절반이 된다[^s1].

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**대각화.**
1. *열별로 보기:* $$AX$$의 $$i$$번째 열은 $$A\mathbf{x}_i = \lambda_i\mathbf{x}_i$$다. $$X\Lambda$$의 $$i$$번째 열도 $$\lambda_i\mathbf{x}_i$$다(대각행렬을 오른쪽에 곱하면 열마다 배율). 그래서 $$AX = X\Lambda$$.
2. *역행렬:* 열이 독립이라 $$X$$는 가역이다. 오른쪽에 $$X^{-1}$$을 곱하면 $$A = X\Lambda X^{-1}$$.
3. *거듭제곱:* $$A^2 = X\Lambda X^{-1}X\Lambda X^{-1} = X\Lambda^2X^{-1}$$. 가운데의 $$X^{-1}X = I$$가 지워진다. 귀납법으로 $$A^k = X\Lambda^kX^{-1}$$.
4. *역:* $$A = X\Lambda X^{-1}$$이면 $$AX = X\Lambda$$이고, 1을 거꾸로 읽으면 각 열이 고유벡터다. $$X$$가 가역이라 열이 독립이다.

**다른 고윳값의 고유벡터는 독립.** 두 개인 경우: $$c_1\mathbf{x}_1 + c_2\mathbf{x}_2 = \mathbf{0}$$에 $$A$$를 곱하면 $$c_1\lambda_1\mathbf{x}_1 + c_2\lambda_2\mathbf{x}_2 = \mathbf{0}$$. 원래 식에 $$\lambda_2$$를 곱해 빼면 $$c_1(\lambda_1 - \lambda_2)\mathbf{x}_1 = \mathbf{0}$$이고, $$\lambda_1 \ne \lambda_2$$, $$\mathbf{x}_1 \ne \mathbf{0}$$이라 $$c_1 = 0$$. 같은 방법으로 $$c_2 = 0$$. $$n$$개는 개수에 대한 귀납법이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "대각행렬을 오른쪽에 곱하면 열마다 배율"인 이유는?</summary>

[행렬 곱](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/) $$X\Lambda$$의 $$i$$번째 열은 $$X$$에 $$\Lambda$$의 $$i$$번째 열 $$\lambda_i\mathbf{e}_i$$를 곱한 것, 곧 $$\lambda_i\mathbf{x}_i$$다. 왼쪽에 곱하면 행마다 배율이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 독립성 증명에서 "$$\lambda_2$$를 곱해 빼는" 이유는?</summary>

두 식에서 $$\mathbf{x}_2$$ 항을 지우기 위해서다. 그러면 $$\mathbf{x}_1$$ 하나만 남고, 영벡터가 아닌 벡터의 배수가 0이려면 계수가 0이어야 한다. 이때 $$\lambda_1 \ne \lambda_2$$가 쓰인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정리의 핵심 아이디어는?</summary>

고유벡터 좌표계로 [기저를 바꾸면](/Hongs_Blog/studies/linear-algebra/change-of-basis/)($$X^{-1}AX = \Lambda$$) 변환이 축마다 독립적인 늘이기가 된다. 거듭제곱은 좌표마다 수의 거듭제곱으로 끝난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

[선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)의 일반해 $$\alpha r_1^n + \beta r_2^n$$은 동반 행렬을 대각화한 것이다([선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)). 미분방정식 $$\mathbf{u}' = A\mathbf{u}$$의 해가 $$\sum c_ie^{\lambda_it}\mathbf{x}_i$$인 것도 같다.

</details>


## 가정이 필요한 이유

| 가정 | 없으면 | 예 |
|---|---|---|
| 독립인 고유벡터 $$n$$개 | 대각화할 수 없다 | $$J = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$은 고윳값 1이 두 번인데 고유벡터는 $$(1, 0)$$ 방향뿐. $$J^k = \begin{pmatrix}1 & k\\ 0 & 1\end{pmatrix}$$로 $$k$$에 비례해 자라, $$\Lambda^k$$로는 나타낼 수 없다 |
| (충분조건) 서로 다른 고윳값 | 대각화될 수도, 안 될 수도 있다 | $$I$$는 고윳값 1이 두 번이지만 이미 대각. $$J$$는 대각화되지 않는다 |

## 예제

$$A = \begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$의 $$A^k$$.

1. *고유쌍:* $$\lambda = 3$$에 $$(1, 1)$$, $$\lambda = 1$$에 $$(1, -1)$$.
2. *분해:* $$X = \begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$, $$X^{-1} = \frac12\begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$.
3. *거듭제곱:* $$A^k = X\operatorname{diag}(3^k, 1)X^{-1} = \frac12\begin{pmatrix}3^k + 1 & 3^k - 1\\ 3^k - 1 & 3^k + 1\end{pmatrix}$$.
4. *검산:* $$k = 1$$이면 $$\frac12\begin{pmatrix}4 & 2\\ 2 & 4\end{pmatrix} = A$$. $$k = 2$$이면 $$\begin{pmatrix}5 & 4\\ 4 & 5\end{pmatrix} = A^2$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$X\Lambda X^{-1} = A$$와 극한, 예제의 $$A^k$$ 공식($$k \le 30$$, 정수로 정확히), 무작위 대각화 가능 행렬에서 $$A^k = X\Lambda^kX^{-1}$$(유리수), 서로 다른 고윳값의 고유벡터가 독립, $$J^k$$의 선형 증가와 대각화 불가(고유공간 1차원), 동역학계의 성분별 감쇠·폭발, 카드의 값 — [20_diagonalization_verify.py](/Hongs_Blog/studies/linear-algebra/code/20_diagonalization_verify/)</div>

</div>


## 활용

- **장기 예측.** 마르코프 연쇄(날씨, 웹 서핑, 사용자 상태 전이)의 정상 상태는 $$\lambda = 1$$의 고유벡터다([마르코프 연쇄](/Hongs_Blog/studies/probability-statistics/markov-chains/)).
- **빠른 거듭제곱.** $$A^k$$를 $$k$$번 곱하는 대신 고윳값 $$k$$제곱 몇 개로 계산한다. 정수 행렬이면 제곱을 되풀이하는 [빠른 거듭제곱](/Hongs_Blog/studies/discrete-math/fermat-euler/)으로 $$O(\log k)$$번의 행렬 곱이면 된다.
- **안정성 설계.** 디지털 필터, 게임 물리의 수치 적분이 발산하지 않으려면 반복 행렬의 모든 고윳값 크기가 1 이하여야 한다.
- 연습: [고윳값과 대각화 예제 사다리](/Hongs_Blog/studies/linear-algebra/diagonalization-ladder/)

## 연결

- 선수: [고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/), [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)($$X^{-1}AX = \Lambda$$)
- 이어지는 개념: [선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/), [대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)(늘 대각화되는 경우)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"고윳값이 겹치면 대각화할 수 없다"</div>

틀렸다. "서로 다른 고윳값이면 대각화된다"를 거꾸로 기억해서 생기는 오해다. 겹치는 고윳값이 있어도 그 고윳값의 고유벡터가 겹친 횟수만큼 독립적으로 있으면 대각화된다. 단위행렬 $$I$$는 고윳값 1이 $$n$$번 겹치지만 이미 대각이다. 대각화가 실패하는 것은 $$\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$처럼 고유벡터가 **모자랄** 때뿐이다. 판정은 각 고윳값에서 $$N(A - \lambda I)$$의 차원을 세어서 한다.

</div>


## 과목별 관점

**수치해석 (2-2학기).** 같은 내용을 $$P^{-1}AP = \Lambda$$(대각행렬)로 쓴다. $$P$$의 열이 고유벡터다. $$n \times n$$ 행렬이 고윳값 $$\lambda_1, \dots, \lambda_n$$과 서로 독립인 고유벡터 $$X_1, \dots, X_n$$을 가지면 $$P = [X_1\ X_2\ \cdots\ X_n]$$이 $$A$$를 대각화하고, 거꾸로 $$P$$가 $$A$$를 대각화하면 $$P$$의 $$i$$번째 열은 고윳값 $$\lambda_i$$의 고유벡터다[^n1].

$$2 \times 2$$ 행렬 $$\begin{pmatrix}a & b\\ c & d\end{pmatrix}$$의 특성방정식은 $$\lambda^2 - (a + d)\lambda + (ad - bc) = 0$$이다[^n2]. 슬라이드의 예 $$A = \begin{pmatrix}5 & -1\\ 3 & 1\end{pmatrix}$$은 $$\lambda^2 - 6\lambda + 8 = 0$$이라 $$\lambda = 2, 4$$이고, 고유벡터는 $$(1, 3)$$과 $$(1, 1)$$이다. $$P = \begin{pmatrix}1 & 1\\ 3 & 1\end{pmatrix}$$이면 $$P^{-1}AP = \begin{pmatrix}2 & 0\\ 0 & 4\end{pmatrix}$$다[^n3].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 대각화 $$A = X\Lambda X^{-1}$$에서 $$X$$와 $$\Lambda$$는 무엇이고, 맞을 조건은?</summary>

**답:** $$X$$의 열은 고유벡터, $$\Lambda$$는 대응하는 고윳값을 대각에 놓은 행렬. 독립인 고유벡터가 $$n$$개 있어야 한다($$X$$가 가역).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$A = \begin{pmatrix}1 & 2\\ 2 & 1\end{pmatrix}$$에 대해 $$A^5$$를 대각화로 구하라.</summary>

**답:** 고윳값 3($$(1, 1)$$), $$-1$$($$(1, -1)$$). $$A^k = \frac12\begin{pmatrix}3^k + (-1)^k & 3^k - (-1)^k\\ 3^k - (-1)^k & 3^k + (-1)^k\end{pmatrix}$$이라 $$A^5 = \begin{pmatrix}121 & 122\\ 122 & 121\end{pmatrix}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 대각화되지 않는 $$2 \times 2$$ 행렬을 들고 이유를 쓰라.</summary>

**답:** $$\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$. 고윳값은 1뿐이고 $$A - I = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$$의 영공간은 1차원이라 독립인 고유벡터가 하나뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$A^k = X\Lambda^kX^{-1}$$이 맞는 이유는?</summary>

**답:** $$A^k = (X\Lambda X^{-1})(X\Lambda X^{-1})\cdots$$에서 이웃한 $$X^{-1}X$$가 모두 $$I$$로 지워져 $$X\Lambda\Lambda\cdots\Lambda X^{-1}$$만 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$\begin{pmatrix}2 & 1\\ 0 & 3\end{pmatrix}$$를 $$P^{-1}AP = \Lambda$$ 꼴로 대각화하라.</summary>

**답:** 특성방정식 $$\lambda^2 - 5\lambda + 6 = 0$$이라 $$\lambda = 2, 3$$. 고유벡터 $$(1, 0)$$과 $$(1, 1)$$. $$P = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$, $$P^{-1}AP = \begin{pmatrix}2 & 0\\ 0 & 3\end{pmatrix}$$[^sn1].

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.2절 "Diagonalizing a Matrix"($$A = X\Lambda X^{-1}$$, $$A^k$$, 서로 다른 고윳값의 독립성, 대각화되지 않는 예, $$\mathbf{u}_{k+1} = A\mathbf{u}_k$$).
[^n1]: 2-2학기/수치해석/1.수업자료/03.na03_matrix.pdf, p.41~46
[^n2]: 같은 자료, p.40
[^n3]: 같은 자료, p.39~40, p.46
[^sn1]: 에이전트 보충. 카드 C5는 원본에 없다. 20_diagonalization_verify.py로 확인했다.
[^s1]: 에이전트 보충. 그림은 원본에 없다. [20_diagonalization_plot.py](/Hongs_Blog/studies/linear-algebra/code/20_diagonalization_plot/)로 그렸고, $$(1, 0) = 1\cdot(0.6, 0.4) + 0.4\cdot(1, -1)$$, $$k \le 12$$에서 $$A^k\mathbf{u}_0 = X\Lambda^kX^{-1}\mathbf{u}_0$$, $$A^{60}$$이 극한 행렬과 같은 것을 같은 코드로 확인했다.
[^s2]: 에이전트 보충. 다이어그램 1개는 원본에 없다. 이 문서 `정의`의 동역학계 문단($$\mathbf{c} = X^{-1}\mathbf{u}_0$$, $$\mathbf{u}_k = \sum c_i\lambda_i^k\mathbf{x}_i$$)을 옮겼다(Strang 5판 6.2절).
{% endraw %}
