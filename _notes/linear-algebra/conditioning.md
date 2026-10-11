---
layout: "note"
title: "노름과 조건수"
display_title: "노름과 조건수 (Norms and Condition Numbers)"
kind: "concept"
kind_label: "정의"
num: "26"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Norm", "노름", "벡터 노름", "vector norm", "행렬 노름", "matrix norm", "연산자 노름", "operator norm", "Condition Number", "조건수", "불량 조건", "ill-conditioned", "기계 엡실론", "machine epsilon", "힐베르트 행렬", "Hilbert matrix", "수치 안정성", "numerical stability"]
description: "조건수는 \"입력의 작은 오차가 답에서 몇 배로 커질 수 있는가\"를 재는 수다. 측정값이나 컴퓨터의 반올림 오차는 피할 수 없으므로, 조건수가 백만인 문제는 답에서 유효숫자 여섯 자리 정도를 잃는다고 각오해야 한다(조건수의 자릿수만큼). 조건수는 문제(행렬) 자체의 성질이라, 좋은 …"
prev_url: "/studies/linear-algebra/abstract-vector-spaces/"
prev_title: "추상 벡터공간과 베지어 곡선"
next_url: "/studies/linear-algebra/dft/"
next_title: "이산 푸리에 변환과 FFT"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/conditioning/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

조건수는 "입력의 작은 오차가 답에서 몇 배로 커질 수 있는가"를 재는 수다. 측정값이나 컴퓨터의 반올림 오차는 피할 수 없으므로, 조건수가 백만인 문제는 답에서 유효숫자 여섯 자리 정도를 잃는다고 각오해야 한다(조건수의 자릿수만큼). 조건수는 문제(행렬) 자체의 성질이라, 좋은 알고리즘이 그 이상 잃지 않게 해 줄 수는 있어도 줄여 주지는 못한다. 또 행렬식이 작다고 조건이 나쁜 것은 아니다.

</div>


## 예시로 보기

$$\begin{pmatrix}1 & 1\\ 1 & 1.0001\end{pmatrix}\mathbf{x} = \begin{pmatrix}2\\ 2.0001\end{pmatrix}$$의 해는 $$\mathbf{x} = (1, 1)$$이다. 우변의 둘째 값을 $$0.0001$$만 바꿔 $$2.0002$$로 하면(상대 변화 약 0.005%) 해는 $$(0, 2)$$가 된다. 답이 통째로 바뀌었다.

두 식이 거의 같은 직선이라, 교점이 직선의 작은 흔들림에 크게 움직인다. 이 행렬의 조건수는 약 $$4 \times 10^4$$이다. 우변의 상대 오차가 최대 $$4 \times 10^4$$배로 커질 수 있다는 뜻이다. 행렬이 아래 정의의 $$A$$, 흔들림이 $$\delta\mathbf{b}$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/26_conditioning_fig1.svg" alt="그림" width="525" height="306" loading="lazy">

두 직선을 그대로 그리면 겹쳐 보여서, 첫째 직선을 0에 두고 둘째 직선이 그보다 얼마나 위에 있는지를 1만 배 키워 그렸다. 우변을 0.0001 바꾸면 둘째 직선이 살짝 올라갈 뿐인데, 교점은 $$x = 1$$에서 $$x = 0$$으로 크게 미끄러진다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **벡터 노름**(길이의 여러 재는 법): $$\Vert \mathbf{x}\Vert _1 = \sum\vert x_i\vert $$($$\sum$$은 차례로 모두 더한다는 기호), $$\Vert \mathbf{x}\Vert _2 = \sqrt{\sum x_i^2}$$, $$\Vert \mathbf{x}\Vert _\infty = \max\vert x_i\vert $$. 모두 양수성, $$\Vert c\mathbf{x}\Vert  = \vert c\vert \Vert \mathbf{x}\Vert $$, 삼각부등식을 만족한다.
- **행렬 노름**: $$\Vert A\Vert  = \max_{\mathbf{x} \ne \mathbf{0}}\frac{\Vert A\mathbf{x}\Vert }{\Vert \mathbf{x}\Vert }$$(가장 많이 늘이는 배율). 2-노름에서는 $$\Vert A\Vert _2 = \sigma_1$$(가장 큰 [특잇값](/Hongs_Blog/studies/linear-algebra/svd/))이다.
- **조건수**: 가역 행렬 $$A$$에 대해 $$\kappa(A) = \Vert A\Vert \,\Vert A^{-1}\Vert $$. 2-노름에서는 $$\kappa(A) = \frac{\sigma_{\max}}{\sigma_{\min}}$$[^1].

</div>


$$\kappa(A) \ge 1$$이고, 단위행렬과 직교 행렬은 $$\kappa = 1$$이다(길이를 그대로 두므로 오차도 키우지 않는다). 특이 행렬은 $$\kappa = \infty$$로 본다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">오차 증폭</div>

$$A\mathbf{x} = \mathbf{b}$$에서 우변이 $$\mathbf{b} + \delta\mathbf{b}$$로 바뀌어 해가 $$\mathbf{x} + \delta\mathbf{x}$$가 되면

$$\frac{\Vert \delta\mathbf{x}\Vert }{\Vert \mathbf{x}\Vert } \le \kappa(A)\,\frac{\Vert \delta\mathbf{b}\Vert }{\Vert \mathbf{b}\Vert }.$$

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. *오차의 식:* $$A(\mathbf{x} + \delta\mathbf{x}) = \mathbf{b} + \delta\mathbf{b}$$에서 $$A\mathbf{x} = \mathbf{b}$$를 빼면 $$\delta\mathbf{x} = A^{-1}\delta\mathbf{b}$$. 그래서 $$\Vert \delta\mathbf{x}\Vert  \le \Vert A^{-1}\Vert \Vert \delta\mathbf{b}\Vert $$.
2. *해의 크기:* $$\Vert \mathbf{b}\Vert  = \Vert A\mathbf{x}\Vert  \le \Vert A\Vert \Vert \mathbf{x}\Vert $$라 $$\frac{1}{\Vert \mathbf{x}\Vert } \le \frac{\Vert A\Vert }{\Vert \mathbf{b}\Vert }$$.
3. *곱하기:* 두 부등식을 곱하면 결론이다. 등호가 되는 $$\mathbf{b}$$, $$\delta\mathbf{b}$$가 있어서(각각 $$\sigma_{\max}$$, $$\sigma_{\min}$$ 방향) 이 한계는 더 줄일 수 없다. ∎

</details>


**부동소수점.** 배정밀도의 상대 반올림 오차는 $$\varepsilon \approx 2.2 \times 10^{-16}$$이다. 안정한 알고리즘(부분 피벗팅 소거 등)으로 풀어도 해의 상대 오차는 대략 $$\kappa(A)\,\varepsilon$$ 정도까지 생길 수 있다[^2].

## 예제

**힐베르트 행렬.** $$H_{ij} = \frac{1}{i + j - 1}$$은 성분이 모두 평범한 분수인데 조건이 매우 나쁘다.

1. *조건수:* $$n = 10$$이면 $$\kappa_2(H) \approx 1.6 \times 10^{13}$$이다.
2. *예상:* 배정밀도로 풀면 $$10^{13} \times 10^{-16} = 10^{-3}$$ 정도의 상대 오차가 생길 수 있다. 유효숫자 16자리 중 13자리를 잃는다.
3. *실험:* 참 해가 $$(1, \dots, 1)$$이 되도록 $$\mathbf{b} = H\mathbf{1}$$을 만들고 부분 피벗팅 소거로 풀면, $$n = 10$$에서 최대 오차가 약 $$6 \times 10^{-4}$$이다. $$n = 4$$에서는 $$10^{-13}$$ 수준이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/26_conditioning_fig2.svg" alt="그림" width="516" height="320" loading="lazy">

$$n$$이 하나 늘 때마다 조건수가 약 30배씩 커진다. 실제 오차(주황)는 예상 크기 $$\kappa\varepsilon$$(점선)을 넘지 않고 그와 함께 자란다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 두 해와 $$\kappa \approx 4.0 \times 10^4$$, 세 벡터 노름의 성질과 행렬 노름 공식(1-노름 = 열 절댓값 합의 최대, $$\infty$$-노름 = 행 합의 최대, 2-노름 = $$\sigma_1$$), 무작위 행렬에서 오차 증폭 부등식, 힐베르트 행렬의 조건수와 풀이 오차($$n = 4 \dots 12$$), 카드의 값, 릿지로 조건수가 줄어듦 — [26_conditioning_verify.py](/Hongs_Blog/studies/linear-algebra/code/26_conditioning_verify/)</div>

</div>


## 활용

- **결과를 믿을 수 있는가.** 과학 계산 라이브러리는 조건수 추정값(예: `numpy.linalg.cond`)을 제공한다. $$\kappa\varepsilon$$이 원하는 정확도보다 크면 문제를 다시 세운다.
- **특징 스케일링.** 입력 특징의 단위가 크게 다르면(미터와 밀리미터) 데이터 행렬의 조건수가 커져 학습이 불안정해진다. 표준화로 조건을 개선한다. 경사 하강법의 수렴 속도도 헤세 행렬의 조건수에 달려 있다([경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)).
- **정규화.** 릿지 회귀의 $$A^\top A + \lambda I$$($$^\top$$는 행과 열을 바꾸는 전치)는 조건수가 $$\frac{\sigma_1^2 + \lambda}{\sigma_n^2 + \lambda}$$로 줄어 해가 안정해진다. [정규방정식](/Hongs_Blog/studies/linear-algebra/least-squares/)이 $$A$$의 조건수를 제곱하는 것도 같은 식에서 보인다.

## 연결

- 선수: [특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)($$\sigma_{\max}/\sigma_{\min}$$), [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)
- 쓰는 곳: [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)의 피벗팅, [QR로 푸는 최소제곱](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)
- 헷갈리는 것: [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)은 부피 배율이지 조건의 척도가 아니다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"더 좋은 알고리즘을 쓰면 조건수 문제는 사라진다"</div>

틀렸다. 피벗팅이나 QR처럼 "안정한" 알고리즘이 정확도를 크게 높이는 것을 보면, 알고리즘으로 무엇이든 해결될 것 같다. 하지만 조건수는 문제에 들어 있다. 입력 자체가 $$\varepsilon$$만큼 흔들리면 **정확한** 답이 이미 $$\kappa\varepsilon$$만큼 달라진다. 좋은 알고리즘이 하는 일은 이 한계보다 더 잃지 않는 것이다. 나쁜 알고리즘은 더 잃는다. 정규방정식은 $$\kappa$$를 $$\kappa^2$$으로 만든다. 조건 자체를 바꾸려면 문제를 바꿔야 한다(스케일링, 정규화, 다른 기저).

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 조건수의 정의를 쓰고, $$\kappa(A) = 10^8$$이 배정밀도 계산에서 무슨 뜻인지 설명하라.</summary>

**답:** $$\kappa(A) = \Vert A\Vert \Vert A^{-1}\Vert $$(2-노름에서 $$\sigma_{\max}/\sigma_{\min}$$). 입력의 상대 오차가 해에서 최대 $$10^8$$배로 커질 수 있다. 배정밀도($$\varepsilon \approx 10^{-16}$$)에서는 해의 유효숫자 16자리 중 약 8자리만 믿을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$A = \operatorname{diag}(100, 0.01)$$의 2-노름 조건수를 구하라.</summary>

**답:** 특잇값이 100과 0.01이라 $$\kappa = \frac{100}{0.01} = 10^4$$. $$\Vert A\Vert _2 = 100$$, $$\Vert A^{-1}\Vert _2 = 100$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 행렬식은 아주 작은데 조건이 완벽한($$\kappa = 1$$) 행렬을 들라.</summary>

**답:** $$0.1I_{10}$$($$10 \times 10$$). 행렬식은 $$10^{-10}$$이지만 모든 방향을 똑같이 0.1배 해서 $$\kappa = 1$$이다. 행렬식은 크기의 척도이지 조건의 척도가 아니다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 11.2절 "Norms and Condition Numbers"(벡터·행렬 노름, $$\kappa = \sigma_{\max}/\sigma_{\min}$$, 오차 한계).
[^2]: Trefethen·Bau, *Numerical Linear Algebra*, 12장 "Conditioning and Condition Numbers", 13장 "Floating Point Arithmetic"(기계 엡실론, 역방향 안정성과 $$\kappa\varepsilon$$ 크기의 오차).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. [26_conditioning_plot.py](/Hongs_Blog/studies/linear-algebra/code/26_conditioning_plot/)로 그렸고, 두 해 $$(1, 1)$$과 $$(0, 2)$$, $$\kappa \approx 4 \times 10^4$$, 힐베르트 행렬의 $$\kappa_2(H_{10}) \approx 1.6 \times 10^{13}$$, 조건수가 한 단계에 25~35배 커지는 것, 실제 오차가 $$\kappa\varepsilon$$ 이하인 것을 같은 코드로 확인했다.
{% endraw %}
