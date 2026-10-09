---
layout: "note"
title: "선형 점화식 ↔ 행렬 거듭제곱"
display_title: "선형 점화식 ↔ 행렬 거듭제곱: 특성방정식의 근은 고윳값이다"
kind: "concept"
kind_label: "브리지"
num: "21"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Recurrence–Matrix Bridge", "동반 행렬", "companion matrix", "피보나치 행렬", "Fibonacci matrix", "전이 행렬 방법", "transfer matrix method", "빠른 피보나치"]
description: "이산수학에서 피보나치 같은 선형 점화식을 풀 때 쓴 특성방정식은, 점화식을 \"벡터에 행렬을 한 번 곱하는 것\"으로 다시 쓰면 그 행렬의 고윳값 방정식과 똑같다. 그래서 점화식의 일반해는 행렬을 대각화한 결과이고, 수열이 자라는 속도는 가장 큰 고윳값이다. 이 대응 덕분에 아주 먼 …"
prev_url: "/studies/linear-algebra/diagonalization/"
prev_title: "대각화와 행렬 거듭제곱"
next_url: "/studies/linear-algebra/spectral-theorem/"
next_title: "대칭행렬과 스펙트럼 정리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/recurrence-matrix-bridge/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이산수학에서 피보나치 같은 선형 점화식을 풀 때 쓴 특성방정식은, 점화식을 "벡터에 행렬을 한 번 곱하는 것"으로 다시 쓰면 그 행렬의 고윳값 방정식과 똑같다. 그래서 점화식의 일반해는 행렬을 대각화한 결과이고, 수열이 자라는 속도는 가장 큰 고윳값이다. 이 대응 덕분에 아주 먼 번째 피보나치 수도 번호의 자릿수에 비례하는 적은 횟수의 행렬 곱으로 정확히 계산하고, "특정 패턴이 없는 문자열의 개수" 같은 셈 문제를 행렬 하나로 푼다. 다만 겹근은 대각화되지 않는 행렬에 대응하고, 실수 공식(비네)은 큰 번호에서 반올림으로 틀린다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다.

| 이산수학: 피보나치 점화식 | 선형대수학: 행렬 거듭제곱 |
|---|---|
| $$F_{n+1} = F_n + F_{n-1}$$, $$F_0 = 0$$, $$F_1 = 1$$ | $$\begin{pmatrix}F_{n+1}\\ F_n\end{pmatrix} = \begin{pmatrix}1 & 1\\ 1 & 0\end{pmatrix}\begin{pmatrix}F_n\\ F_{n-1}\end{pmatrix}$$ |
| 특성방정식 $$x^2 = x + 1$$ | $$\det\left(\begin{pmatrix}1 & 1\\ 1 & 0\end{pmatrix} - \lambda I\right) = \lambda^2 - \lambda - 1 = 0$$ |
| $$F_n = \frac{\varphi^n - \psi^n}{\sqrt5}$$ | $$Q^n = X\Lambda^nX^{-1}$$, $$\Lambda = \operatorname{diag}(\varphi, \psi)$$ |
| $$F_{10} = 55$$ | $$Q^{10} = \begin{pmatrix}89 & 55\\ 55 & 34\end{pmatrix}$$ |

<details class="callout callout-info" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 선형 점화식 | 행렬 | 공통 구조 |
|---|---|---|
| $$a_n = c_1a_{n-1} + c_2a_{n-2}$$ | $$\mathbf{u}_n = A\mathbf{u}_{n-1}$$, $$A = \begin{pmatrix}c_1 & c_2\\ 1 & 0\end{pmatrix}$$(동반 행렬), $$\mathbf{u}_n = (a_n, a_{n-1})$$ | 한 단계의 규칙 |
| 특성방정식 $$x^2 - c_1x - c_2 = 0$$ | 특성다항식 $$\det(A - \lambda I) = \lambda^2 - c_1\lambda - c_2$$ | 같은 다항식 |
| 특성근 $$r_1, r_2$$ | 고윳값 $$\lambda_1, \lambda_2$$ | 모드의 성장률 |
| 일반해 $$\alpha r_1^n + \beta r_2^n$$ | $$\mathbf{u}_n = c_1\lambda_1^n\mathbf{x}_1 + c_2\lambda_2^n\mathbf{x}_2$$ | 고유 모드의 합 |
| 초기값으로 $$\alpha, \beta$$ 정하기 | $$\mathbf{c} = X^{-1}\mathbf{u}_1$$ | 좌표 바꾸기 |
| 겹근 $$(\alpha + \beta n)r^n$$ | 대각화되지 않는 행렬(조르당 블록 $$J^n$$에 $$n$$이 나옴) | $$n$$이 곱해지는 이유 |

$$k$$계 점화식도 $$k \times k$$ 동반 행렬로 같은 대응이 맞는다[^1].

</details>


## 어디까지 같은가

- **상수 계수의 선형 점화식까지.** $$a_n = na_{n-1}$$(계수가 $$n$$에 따라 변함)이나 $$a_n = a_{n-1}^2$$(비선형)은 한 개의 고정 행렬로 쓸 수 없다.
- **겹근과 대각화.** 특성방정식이 겹근이면 동반 행렬은 대각화되지 않는다. 이산수학에서 겹근일 때 일반해에 $$n$$이 곱해지던 것이 [대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/)에서 본 $$J^k = \begin{pmatrix}1 & k\\ 0 & 1\end{pmatrix}$$에 $$k$$가 나오는 것과 같은 현상이다.
- **정확한 계산은 정수 행렬로.** 비네 공식 $$\frac{\varphi^n - \psi^n}{\sqrt5}$$을 부동소수점으로 계산해 반올림하면 $$n = 71$$부터 틀린다. 정수 행렬을 제곱해 나가면 $$n$$이 아무리 커도 정확하다.

## 이 연결로 얻는 것

- **$$O(\log n)$$ 피보나치.** $$Q^n$$을 [빠른 거듭제곱](/Hongs_Blog/studies/discrete-math/fermat-euler/)(제곱을 되풀이)으로 계산하면 $$2 \times 2$$ 행렬 곱 $$O(\log n)$$번이다. $$\bmod m$$을 취하며 계산하면 $$F_{10^{18}} \bmod m$$도 금방 나온다.
- **성장률 읽기.** 수열은 결국 가장 큰 고윳값(특성근)의 거듭제곱처럼 자란다. $$F_{n+1}/F_n \to \varphi \approx 1.618$$이다.
- **전이 행렬로 세기.** "허용되는 패턴"을 상태로, 한 글자 붙이기를 행렬로 두면 문자열·타일링의 개수가 행렬 거듭제곱의 성분이 된다. 오토마타가 받아들이는 길이 $$n$$ 문자열의 수를 세는 표준 방법이다[^s1].
- 알고리즘에서: 앞 칸들에 상수를 곱해 더하는 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)은 표를 n칸 모두 채워야 한다. n이 $$10^{18}$$처럼 커서 표를 다 채울 수 없을 때 위의 행렬 거듭제곱을 쓴다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/21_recurrence-matrix-bridge_fig1.svg" alt="그림" loading="lazy">

왼쪽처럼 $$F_{n+1}/F_n$$은 $$\varphi$$의 위아래를 번갈아 오가며 다가간다. 오른쪽처럼 그 차이는 한 단계마다 약 $$\varphi^2 \approx 2.6$$배씩 줄어든다. 둘째 고윳값 $$\psi \approx -0.618$$이 음수라 번갈아 오가고, $$\vert \psi/\varphi\vert  = 1/\varphi^2$$이 작아 빨리 준다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$Q^n$$의 성분 = 피보나치($$n \le 90$$, 정수), 동반 행렬의 특성다항식 = 특성방정식(무작위 계수), 대각화 결과 = 점화식 일반해(유리수·무리수), 비네 부동소수점이 처음 틀리는 $$n = 71$$, 빠른 거듭제곱의 곱셈 횟수, $$F_{n+1}/F_n \to \varphi$$, 겹근 점화식과 $$J^k$$, 전이 문제의 개수(전수 세기)와 성장률 $$1 + \sqrt3$$ — [21_recurrence-matrix-bridge_verify.py](/Hongs_Blog/studies/linear-algebra/code/21_recurrence-matrix-bridge_verify/)</div>

</div>


## 전이 문제

알파벳 $$\{a, b, c\}$$로 만든 길이 $$n$$인 문자열 중 $$a$$가 두 번 연달아 나오지 않는 것의 개수 $$t_n$$을 행렬로 세라. $$t_1 = 3$$, $$t_2 = 8$$이다. $$t_5$$와 대략의 성장률을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

마지막 글자가 $$a$$인 개수 $$x_n$$, 아닌 개수 $$y_n$$을 상태로 둔다. $$a$$ 뒤에는 $$b, c$$만 올 수 있고, $$b, c$$ 뒤에는 아무거나 온다. 그래서 $$x_n = y_{n-1}$$, $$y_n = 2x_{n-1} + 2y_{n-1}$$, 곧 $$\begin{pmatrix}x_n\\ y_n\end{pmatrix} = \begin{pmatrix}0 & 1\\ 2 & 2\end{pmatrix}\begin{pmatrix}x_{n-1}\\ y_{n-1}\end{pmatrix}$$, $$(x_1, y_1) = (1, 2)$$. 합은 $$t_n = 2t_{n-1} + 2t_{n-2}$$를 만족해 $$3, 8, 22, 60, 164$$이고 $$t_5 = 164$$다. 특성다항식 $$\lambda^2 - 2\lambda - 2 = 0$$의 큰 근 $$1 + \sqrt3 \approx 2.73$$이 성장률이다. 제약이 없으면 3배씩 자라니, 제약 때문에 조금 느리다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 점화식 $$a_n = 5a_{n-1} - 6a_{n-2}$$를 행렬 꼴로 쓰고, 그 행렬의 고윳값이 특성근과 같음을 보여라.</summary>

**답:** $$\begin{pmatrix}a_n\\ a_{n-1}\end{pmatrix} = \begin{pmatrix}5 & -6\\ 1 & 0\end{pmatrix}\begin{pmatrix}a_{n-1}\\ a_{n-2}\end{pmatrix}$$. 특성다항식 $$\lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3)$$이고, 점화식의 특성방정식 $$x^2 = 5x - 6$$과 같아 근이 2, 3이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$Q = \begin{pmatrix}1 & 1\\ 1 & 0\end{pmatrix}$$일 때 $$Q^n = \begin{pmatrix}F_{n+1} & F_n\\ F_n & F_{n-1}\end{pmatrix}$$임을 이용해 $$F_{10}$$을 구하고, 필요한 행렬 곱의 수를 어림하라.</summary>

**답:** $$Q^{10} = \begin{pmatrix}89 & 55\\ 55 & 34\end{pmatrix}$$라 $$F_{10} = 55$$. 제곱을 되풀이하면 $$Q^2, Q^4, Q^8$$을 만들고 $$Q^8Q^2$$를 곱해 곱셈 4번이면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형 점화식의 해가 결국 가장 큰 특성근의 거듭제곱처럼 자라는 이유를 행렬로 설명하라.</summary>

**답:** $$\mathbf{u}_n = c_1\lambda_1^n\mathbf{x}_1 + c_2\lambda_2^n\mathbf{x}_2$$에서 $$\vert \lambda_1\vert  > \vert \lambda_2\vert $$이면 $$(\lambda_2/\lambda_1)^n \to 0$$이라 둘째 항이 첫째 항에 비해 사라진다($$c_1 \ne 0$$일 때). 남는 것은 $$c_1\lambda_1^n\mathbf{x}_1$$이다.

</details>


## 출처

[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.2절(피보나치 수와 $$\begin{pmatrix}1 & 1\\ 1 & 0\end{pmatrix}$$, 황금비 고윳값). Rosen, *Discrete Mathematics and Its Applications* 7판, 8장(선형 점화식과 특성방정식).
[^s1]: 에이전트 보충. 전이 행렬로 문자열·경로를 세는 방법은 조합론의 전이 행렬 방법이며, 결정적 유한 오토마타의 인접 행렬 거듭제곱이 길이 $$n$$ 문자열의 수를 준다. 전이 문제의 개수는 21_recurrence-matrix-bridge_verify.py에서 전수로 셌다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [21_recurrence-matrix-bridge_plot.py](/Hongs_Blog/studies/linear-algebra/code/21_recurrence-matrix-bridge_plot/)로 그렸고, $$F_{10} = 55$$, $$Q^{10}$$, 비가 $$\varphi$$의 위아래를 번갈아 오가는 것, 차이가 줄어드는 비율이 $$\varphi^2$$에 가까운 것을 같은 코드로 확인했다.
{% endraw %}
