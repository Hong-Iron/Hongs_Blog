---
layout: "note"
title: "합 ↔ 적분"
display_title: "합 ↔ 적분: 넓이로 합을 끼운다"
kind: "concept"
kind_label: "브리지"
num: "16"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Sums and Integrals", "합과 적분", "적분으로 합 어림하기", "integral bounds for sums", "차분", "finite difference", "유한 미적분", "finite calculus", "하강 거듭제곱", "falling power", "오일러-마스케로니 상수", "Euler–Mascheroni constant"]
description: "합은 폭이 1인 막대들의 넓이이고, 적분은 곡선 아래의 넓이다. 그래서 줄어들거나 늘어나기만 하는 함수라면, 닫힌 꼴이 없는 합도 적분 두 개 사이에 끼워 크기를 정확히 어림할 수 있다. 조화수가 로그만큼 자라는 이유와, 정렬에 필요한 비교 횟수의 크기가 이렇게 나온다. 더 나아가…"
prev_url: "/studies/calculus/improper-integrals/"
prev_title: "이상적분"
next_url: "/studies/calculus/series-convergence/"
next_title: "급수의 수렴"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/sum-integral-bounds/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

합은 폭이 1인 막대들의 넓이이고, 적분은 곡선 아래의 넓이다. 그래서 줄어들거나 늘어나기만 하는 함수라면, 닫힌 꼴이 없는 합도 적분 두 개 사이에 끼워 크기를 정확히 어림할 수 있다. 조화수가 로그만큼 자라는 이유와, 정렬에 필요한 비교 횟수의 크기가 이렇게 나온다. 더 나아가 차분과 미분, 누적합과 적분은 공식까지 짝을 이룬다. 다만 함수가 오르내리면 막대와 곡선이 크게 어긋날 수 있다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다.

| 이산수학: 누적합과 조화수 | 미분적분학: 적분과 로그 |
|---|---|
| $$a_k = \frac1k$$, $$S_n = \sum_{k=1}^{n} a_k = H_n$$ | $$f(x) = \frac1x$$, $$F(x) = \int_1^x \frac{dt}{t} = \ln x$$ |
| $$S_n - S_{n-1} = a_n$$ | $$F'(x) = f(x)$$ |
| $$\sum_{k=l}^{r} a_k = S_r - S_{l-1}$$ | $$\int_a^b f = F(b) - F(a)$$ |
| $$2^{k+1} - 2^k = 2^k$$ | $$(e^x)' = e^x$$ |
| $$H_{1000} = 7.485\ldots$$ | $$\ln 1000 = 6.907\ldots$$ |

<details class="callout callout-info" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 이산(합) | 연속(적분) | 공통 구조 |
|---|---|---|
| 차분 $$\Delta a_k = a_{k+1} - a_k$$ | 도함수 $$f'$$ | 변화율 |
| 합 $$\sum$$ | 적분 $$\int$$ | 누적 |
| 망원 합 $$\sum_{k=1}^{n}\Delta a_k = a_{n+1} - a_1$$ | [기본정리](/Hongs_Blog/studies/calculus/ftc/) $$\int_a^b f' = f(b) - f(a)$$ | 누적된 변화 = 끝값의 차 |
| $$2^k$$ ($$\Delta 2^k = 2^k$$) | $$e^x$$ ($$(e^x)' = e^x$$) | 자기 자신이 변화율인 함수 |
| 하강 거듭제곱 $$k^{\underline m} = k(k-1)\cdots(k-m+1)$$, $$\Delta k^{\underline m} = m\,k^{\underline{m-1}}$$ | $$x^m$$, $$(x^m)' = m x^{m-1}$$ | 거듭제곱 규칙 |
| $$H_n$$ | $$\ln n$$ | $$\frac1k$$와 $$\frac1x$$의 누적 |
| 부분합(교란법) | [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/) | 곱의 누적 |

거듭제곱 규칙에서 $$\sum_{k=0}^{n-1} k^{\underline m} = \frac{n^{\underline{m+1}}}{m + 1}$$이 $$\int_0^n x^m dx = \frac{n^{m+1}}{m+1}$$에 대응한다[^1].

</details>


## 어디까지 같은가

- **가장 큰 항까지는 같고, 가장자리가 다르다.** $$\sum_{k=1}^{n} k = \frac{n^2}{2} + \frac n2$$이고 $$\int_0^n x\,dx = \frac{n^2}{2}$$이다. 차이 $$\frac n2$$는 막대의 삐져나온 삼각형들이다.
- **보통의 거듭제곱은 차분과 맞지 않는다.** $$\Delta k^2 = 2k + 1$$이지 $$2k$$가 아니다. 거듭제곱 규칙이 그대로 통하려면 하강 거듭제곱을 써야 한다.
- **곱의 법칙에 밀림이 생긴다.** $$\Delta(uv)_k = u_k\,\Delta v_k + v_{k+1}\,\Delta u_k$$이다. 한쪽이 한 칸 밀린 값이다.
- **함수가 오르내리면 끼우기가 무너진다.** $$f(x) = \sin^2(\pi x)$$는 모든 정수에서 0이라 $$\sum_{k=1}^{n} f(k) = 0$$이지만, $$\int_0^n f = \frac n2$$이다. 아래 정리가 "줄어들기만" 또는 "늘어나기만"을 요구하는 이유다.

## 이 연결로 얻는 것

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">적분으로 합 끼우기</div>

$$f$$가 $$[1, n + 1]$$에서 음이 아니고 줄어들기만 하면

$$\int_1^{n+1} f(x)\,dx \le \sum_{k=1}^{n} f(k) \le f(1) + \int_1^{n} f(x)\,dx.$$

늘어나기만 하면 부등호 방향을 바꿔 $$\int_0^{n} f \le \sum_{k=1}^{n} f(k) \le \int_1^{n+1} f$$이다($$f$$가 $$[0, n+1]$$에서 음이 아니고 늘어나기만 할 때)[^2].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

줄어드는 $$f$$에서 $$x \in [k, k+1]$$이면 $$f(k + 1) \le f(x) \le f(k)$$이다. 적분하면 $$f(k + 1) \le \int_k^{k+1} f \le f(k)$$. 왼쪽 부등식을 $$k = 1, \dots, n - 1$$에서 더하면 $$\sum_{k=2}^{n} f(k) \le \int_1^n f$$라 위쪽 한계가, 오른쪽 부등식을 $$k = 1, \dots, n$$에서 더하면 아래쪽 한계가 나온다. ∎

</details>


이 정리로 이산수학의 어림들을 로그와 거듭제곱의 정확한 상수까지 끌어올린다.

| 합 | 끼운 결과 | 뜻 |
|---|---|---|
| $$H_n = \sum \frac1k$$ | $$\ln(n + 1) \le H_n \le 1 + \ln n$$ | $$H_n = \ln n + O(1)$$ |
| $$\ln n! = \sum \ln k$$ | $$n\ln n - n + 1 \le \ln n! \le (n + 1)\ln(n + 1) - n$$ | $$n! \approx (n/e)^n$$ (다항식 인수 차이) |
| $$\sum k^d$$ | $$\frac{n^{d+1}}{d+1} \le \sum_{k=1}^n k^d \le \frac{(n+1)^{d+1}}{d+1}$$ | 최고차항 $$\frac{n^{d+1}}{d+1}$$ |

더 나아가 $$H_n - \ln n$$은 $$n$$이 커지면 줄어들기만 하고 0보다 크다. 그래서 어떤 상수로 수렴하고, 그 값이 오일러–마스케로니 상수 $$\gamma \approx 0.5772$$다[^2]. 줄어드는 이유는 $$(H_{n+1} - \ln(n+1)) - (H_n - \ln n) = \frac{1}{n+1} - \ln\left(1 + \frac1n\right) < 0$$이기 때문이다($$\ln(1 + \frac1n) = \int_n^{n+1}\frac{dx}{x} > \frac{1}{n+1}$$).

**정렬의 하한.** $$\lg n! = \frac{\ln n!}{\ln 2} \approx n\lg n - n\lg e \approx n\lg n - 1.443n$$이다. [합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)에서 본 "비교 정렬은 $$\lg n!$$번 이상 비교"가 구체적인 수로 바뀐다. $$n = 1000$$이면 약 8,530번이다.

- 알고리즘에서: [누적 합과 차분 배열](/Hongs_Blog/studies/algorithms/prefix-sum/)은 구간 합을 누적 합 두 값의 차 $$S_r - S_{l-1}$$로 구하고, 구간 양 끝에만 표시했다가 앞에서부터 더해 배열을 되찾는 차분 배열로 망원 합을 쓴다. 병합 정렬은 최악에도 비교를 $$n \lg n$$번쯤 해서 위 하한과 맨 앞 항이 같다. 그래서 [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)은 `sorted`보다 빠른 비교 정렬을 직접 짤 일이 없다고 본다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 대응표의 공식($$\Delta 2^k$$, 하강 거듭제곱의 차분과 합), 정리의 세 끼우기($$n \le 10^4$$), $$H_n - \ln n$$이 줄어들며 $$\gamma$$로 감, $$\lg 1000!$$, $$\sin^2(\pi x)$$의 반례, 전이 문제와 카드의 값 — [16_sum-integral-bounds_verify.py](/Hongs_Blog/studies/calculus/code/16_sum-integral-bounds_verify/)</div>

</div>


## 전이 문제

반복문의 $$i$$번째 바퀴가 $$\sqrt i$$에 비례하는 일을 한다(예: $$i$$ 이하의 약수 후보를 $$\sqrt i$$까지만 검사). $$n$$바퀴의 총비용 $$\sum_{i=1}^{n}\sqrt i$$를 위아래로 끼우고, $$n = 10^6$$일 때 어림하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\sqrt x$$는 늘어나기만 하므로 $$\int_0^n\sqrt x\,dx \le \sum \le \int_1^{n+1}\sqrt x\,dx$$, 즉 $$\frac23 n^{3/2} \le \sum \le \frac23\left((n+1)^{3/2} - 1\right)$$. $$n = 10^6$$이면 $$666{,}666{,}667$$과 $$666{,}667{,}666$$ 사이이고, 실제 값은 약 $$666{,}667{,}166$$이다. 결국 $$\Theta(n^{3/2})$$다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** H₁₀₀₀을 적분으로 위아래에서 끼우라.</summary>

**답:** $$\ln 1001 \approx 6.909 \le H_{1000} \le 1 + \ln 1000 \approx 7.908$$. 실제 값은 $$7.4855$$이고, $$\ln 1000 + \gamma \approx 7.4850$$과 매우 가깝다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 적분으로 합을 끼우는 정리에 "줄어들기만(늘어나기만) 하는 함수" 조건이 필요한 이유를 반례로 보여라.</summary>

**답:** $$f(x) = \sin^2(\pi x)$$는 모든 정수에서 0이라 $$\sum_{k=1}^{n} f(k) = 0$$인데 $$\int_0^n f = \frac n2$$이다. 정수 사이에서 오르내리는 모양을 막대가 전혀 보지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** ∫₀ⁿ x² dx = n³/3에 대응하는 합 공식을 하강 거듭제곱으로 쓰고, n = 4에서 확인하라.</summary>

**답:** $$\sum_{k=0}^{n-1} k^{\underline 2} = \frac{n^{\underline 3}}{3}$$, 즉 $$\sum_{k=0}^{n-1} k(k - 1) = \frac{n(n-1)(n-2)}{3}$$. $$n = 4$$이면 $$0 + 0 + 2 + 6 = 8 = \frac{4 \cdot 3 \cdot 2}{3}$$.

</details>


## 출처

[^1]: Graham·Knuth·Patashnik, *Concrete Mathematics*, 2.6절 "Finite and Infinite Calculus"(차분 $$\Delta$$, 하강 거듭제곱, 부분합).
[^2]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 14장 "Sums and Asymptotics"(적분으로 합 끼우기, 조화수, 스털링 근사). 같은 부등식이 OpenStax, *Calculus Volume 2*, 5.3절 "The Divergence and Integral Tests"의 적분 판정 증명에 쓰인다.
{% endraw %}
