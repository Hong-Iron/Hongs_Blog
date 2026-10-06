---
layout: "note"
title: "라그랑주 승수법"
display_title: "라그랑주 승수법 (Lagrange Multipliers)"
kind: "concept"
kind_label: "기법"
num: "28"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Lagrange Multipliers", "라그랑주 승수법", "라그랑주 승수", "Lagrange multiplier", "라그랑지안", "Lagrangian", "제약 최적화", "constrained optimization", "잠재 가격", "shadow price", "KKT 조건", "KKT conditions", "레일리 몫", "Rayleigh quotient", "최대 엔트로피", "maximum entropy"]
description: "산에 난 등산로(제약) 위로만 걸으면서 가장 높은 곳을 찾는다고 하자. 그 지점에서는 등고선이 등산로에 딱 스치듯 닿는다. 더 가면 내려가고, 덜 가도 내려가기 때문이다. 이 \"스치는\" 조건을 두 그래디언트가 같은 방향이라는 식으로 쓰고, 미지수 하나(승수)를 더해 연립방정식으로 …"
prev_url: "/studies/calculus/convexity/"
prev_title: "볼록 함수와 볼록 최적화"
next_url: "/studies/calculus/ode-euler/"
next_title: "미분방정식과 오일러 방법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/lagrange-multipliers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

산에 난 등산로(제약) 위로만 걸으면서 가장 높은 곳을 찾는다고 하자. 그 지점에서는 등고선이 등산로에 딱 스치듯 닿는다. 더 가면 내려가고, 덜 가도 내려가기 때문이다. 이 "스치는" 조건을 두 그래디언트가 같은 방향이라는 식으로 쓰고, 미지수 하나(승수)를 더해 연립방정식으로 푼다. 다만 이 방법은 후보를 줄 뿐이라 최대인지 최소인지는 따로 따져야 하고, 제약식의 그래디언트가 0이 되는 뾰족한 점은 놓칠 수 있다.

</div>


## 예시로 보기

둘레가 20인 직사각형 울타리의 넓이를 최대로 하려 한다. 가로 $$x$$, 세로 $$y$$로 두면 제약은 $$x + y = 10$$, 목표는 $$f(x, y) = xy$$다. 제약 직선 위를 움직이면 넓이는 $$x(10 - x)$$라 $$x = y = 5$$에서 25로 가장 크다.

이 점에서 두 그래디언트를 비교한다. 목표의 그래디언트 $$\nabla f = (y, x) = (5, 5)$$($$\nabla f$$는 편미분을 모은 벡터(그래디언트)), 제약식 $$g(x, y) = x + y$$의 그래디언트 $$\nabla g = (1, 1)$$. 방향이 같고 $$\nabla f = 5\,\nabla g$$다. 등고선 $$xy = 25$$가 직선 $$x + y = 10$$에 접하는 점이다. 여기서 5가 아래 정리의 승수 $$\lambda$$다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">라그랑주 승수 정리</div>

$$f, g : \mathbb{R}^n \to \mathbb{R}$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체)의 편미분이 연속이고, 점 $$\mathbf{x}^*$$가 제약 $$g(\mathbf{x}) = c$$ 위에서 $$f$$의 지역 최대 또는 최소이며, $$\nabla g(\mathbf{x}^*) \ne \mathbf{0}$$이면

$$\nabla f(\mathbf{x}^*) = \lambda\,\nabla g(\mathbf{x}^*)$$

인 실수 $$\lambda$$가 있다. 이 $$\lambda$$를 **라그랑주 승수**라 한다[^1].

</div>


**푸는 법.** 미지수 $$\mathbf{x}$$와 $$\lambda$$에 대해 $$\nabla f = \lambda\nabla g$$($$n$$개 식)와 $$g = c$$(1개 식)를 연립한다. 라그랑지안 $$\mathcal{L}(\mathbf{x}, \lambda) = f(\mathbf{x}) - \lambda(g(\mathbf{x}) - c)$$의 모든 편미분을 0으로 놓는 것과 같다. 나온 후보들의 $$f$$ 값을 비교해 최대·최소를 가린다. 제약이 여러 개면 $$\nabla f = \sum_i\lambda_i\nabla g_i$$($$\sum$$은 차례로 모두 더한다는 기호)로 늘린다.

**승수의 뜻.** $$\lambda$$는 제약의 값 $$c$$를 조금 늘릴 때 최적값이 늘어나는 비율이다(잠재 가격). 예시에서 둘레의 절반이 $$c$$면 최대 넓이는 $$\frac{c^2}{4}$$이고, 이를 $$c$$로 미분하면 $$\frac{c}{2}$$, $$c = 10$$에서 5다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치</summary>

1. *제약 위의 곡선:* $$\mathbf{x}^*$$를 지나며 제약 위에 머무는 매끄러운 곡선 $$\mathbf{r}(t)$$, $$\mathbf{r}(0) = \mathbf{x}^*$$를 아무거나 잡는다.
2. *제약의 그래디언트는 곡선에 수직:* $$g(\mathbf{r}(t)) = c$$를 [연쇄 법칙](/Hongs_Blog/studies/calculus/multivariable-chain-rule/)으로 미분하면 $$\nabla g(\mathbf{x}^*)\cdot\mathbf{r}'(0) = 0$$.
3. *목표의 그래디언트도 곡선에 수직:* $$f(\mathbf{r}(t))$$는 $$t = 0$$에서 극값이라 도함수가 0이다. 곧 $$\nabla f(\mathbf{x}^*)\cdot\mathbf{r}'(0) = 0$$.
4. *평행:* $$\nabla f$$는 제약 곡면의 모든 접선 방향에 수직이다. $$\nabla g \ne \mathbf{0}$$이면 음함수 정리로 접선 방향들이 $$\nabla g$$에 수직인 $$(n-1)$$차원 전체를 채우고, 그 모두에 수직인 벡터는 $$\nabla g$$의 배수뿐이다. ∎

4단계의 "접선 방향이 전부 채워진다"는 음함수 정리가 필요하다 [증명 생략: OpenStax Calculus Vol. 3 4.8절은 2변수에서 기하적으로 설명한다].

</details>


**가정 $$\nabla g \ne \mathbf{0}$$이 필요한 이유.** 곡선 $$y^2 = x^3$$ 위에서 $$f = x$$를 최소로 하자. 곡선 위의 점은 $$(t^2, t^3)$$이라 $$x \ge 0$$이고, 최솟점은 원점이다. 그런데 원점에서 $$\nabla g = (-3x^2, 2y) = (0, 0)$$이라 $$\nabla f = (1, 0) = \lambda\nabla g$$를 만족하는 $$\lambda$$가 없다. 연립방정식만 풀면 이 최솟점을 놓친다. 원점은 곡선이 뾰족하게 꺾이는 점(첨점)이다.

## 예제

**단위구 위의 이차형식 최대화.** 대칭행렬 $$A$$에 대해 $$\Vert \mathbf{x}\Vert  = 1$$($$\lVert\cdot\rVert$$는 벡터의 길이) 위에서 $$f(\mathbf{x}) = \mathbf{x}^\top A\mathbf{x}$$를 최대로 한다.

1. *그래디언트:* [행렬 미분](/Hongs_Blog/studies/calculus/matrix-calculus/)으로 $$\nabla f = 2A\mathbf{x}$$, 제약 $$g = \mathbf{x}^\top\mathbf{x}$$의 $$\nabla g = 2\mathbf{x}$$.
2. *승수 조건:* $$2A\mathbf{x} = \lambda\cdot 2\mathbf{x}$$, 곧 $$A\mathbf{x} = \lambda\mathbf{x}$$. 후보는 정확히 $$A$$의 단위 [고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/)다.
3. *후보 비교:* 고유벡터에서 $$f = \mathbf{x}^\top(\lambda\mathbf{x}) = \lambda$$. 가장 큰 값은 최대 고윳값이다.
4. *결론:* 단위구 위 $$\mathbf{x}^\top A\mathbf{x}$$의 최댓값은 $$A$$의 최대 고윳값이고, 최댓점은 그 고유벡터다. 주성분 분석(PCA)이 분산이 가장 큰 방향을 찾을 때 푸는 문제가 이것이다[^s1].

**최대 엔트로피.** 확률 $$p_1, \dots, p_n$$(합이 1)의 엔트로피 $$H = -\sum p_i\ln p_i$$를 최대로 한다. $$\frac{\partial H}{\partial p_i} = -\ln p_i - 1 = \lambda$$($$\partial$$는 다른 변수는 그대로 두고 한 변수로만 미분한다는 기호)이 모든 $$i$$에서 같으니 $$p_i$$가 모두 같다. 곧 균등분포 $$p_i = \frac1n$$이고 $$H = \ln n$$이다. 아무 정보가 없을 때 균등분포를 가정하는 근거가 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 울타리 예시의 최댓값·승수·변화율, 단위원 위 무작위 이차함수 200개에서 최댓점의 두 그래디언트 평행, 첨점 반례, 엔트로피 최댓값 $$\ln n$$($$n = 2, 3, 5, 10$$, 무작위 분포 500개씩), 단위구 위 최댓값 = 최대 고윳값(무작위 대칭행렬 100개), 카드의 값 — [28_lagrange-multipliers_verify.py](/Hongs_Blog/studies/calculus/code/28_lagrange-multipliers_verify/)</div>

</div>


## 활용

- **부등식 제약(KKT 조건).** 제약이 $$g(\mathbf{x}) \le c$$이면, 최적점에서 제약이 빡빡하게 걸려 있을 때만 승수가 0이 아니고 부호가 정해진다. 이것을 정리한 것이 KKT 조건이고, SVM을 쌍대 문제로 바꿔 푸는 데 쓰인다[^2].
- **자원 배분.** 예산 제약 아래 효용 최대화에서 $$\lambda$$는 예산 1원을 더 줄 때 늘어나는 효용이다.
- **흔한 실수.** 후보를 찾고 최대·최소 판정을 빼먹는 것, 제약식의 그래디언트가 0인 점과 영역의 끝점을 후보에서 빠뜨리는 것.

## 연결

- 선수: [그래디언트](/Hongs_Blog/studies/calculus/gradient/)(등고선에 수직)
- 다른 과목에서: [스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)의 최대 고윳값을 제약 최적화로 다시 얻는다. 엔트로피 최대화는 확률과 통계의 [엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/)로 이어진다.
- 비교: 제약이 없으면 [기울기가 0인 점](/Hongs_Blog/studies/calculus/hessian/)이 후보, 볼록 문제면 KKT 조건이 최적의 필요충분조건이 된다([볼록 최적화](/Hongs_Blog/studies/calculus/convexity/)).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 직선 $$x + 2y = 5$$ 위에서 원점에 가장 가까운 점을 라그랑주 승수법으로 구하라.</summary>

**답:** $$f = x^2 + y^2$$, $$g = x + 2y$$. $$(2x, 2y) = \lambda(1, 2)$$에서 $$x = \frac\lambda2$$, $$y = \lambda$$. 제약에 넣으면 $$\frac\lambda2 + 2\lambda = 5$$, $$\lambda = 2$$. 점 $$(1, 2)$$, 거리의 제곱 5.<br>
**검산:** $$(1, 2)$$는 직선의 법선 방향 $$(1, 2)$$ 위에 있다. 원점에서 직선으로 내린 수선의 발과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 제약 위의 최댓점에서 $$\nabla f$$가 $$\nabla g$$와 평행해야 하는 이유를 등고선으로 설명하라.</summary>

**답:** $$\nabla f$$에 제약 곡선의 접선 방향 성분이 있으면 그 방향으로 조금 움직여 제약을 지키면서 $$f$$를 키울 수 있다. 그러니 최댓점에서 $$\nabla f$$는 접선에 수직이다. $$\nabla g$$도 제약 곡선(= $$g$$의 등위선)에 수직이다. 둘 다 같은 접선에 수직이라 평행하다. 그림으로는 $$f$$의 등고선이 제약 곡선에 접한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 단위원 $$x^2 + y^2 = 1$$ 위에서 $$f = 2x^2 + 2xy + 2y^2$$의 최댓값과 최솟값을 구하라.</summary>

**답:** $$f = \mathbf{x}^\top A\mathbf{x}$$, $$A = \begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$. 승수 조건이 $$A\mathbf{x} = \lambda\mathbf{x}$$라 후보는 고유벡터다. 고윳값 3(방향 $$(1, 1)$$)과 1(방향 $$(1, -1)$$)이므로 최댓값 3은 $$\pm\frac{1}{\sqrt2}(1, 1)$$에서, 최솟값 1은 $$\pm\frac{1}{\sqrt2}(1, -1)$$에서 나온다.

</details>


[^1]: OpenStax, *Calculus Volume 3*, 4.8절 "Lagrange Multipliers"(정리, 풀이 절차, 제약이 둘일 때).
[^2]: Boyd, Vandenberghe, *Convex Optimization*, 5장 "Duality"(라그랑지안, 쌍대 문제, KKT 최적 조건, 승수의 민감도 해석).
[^s1]: 에이전트 보충. 승수를 최적값의 민감도로 읽는 해석은 Boyd·Vandenberghe 5장에 있다. PCA가 공분산 행렬의 최대 고윳값 방향을 찾는다는 것은 [특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)에서 다룬다. 수치는 28_lagrange-multipliers_verify.py에서 확인했다.
{% endraw %}
