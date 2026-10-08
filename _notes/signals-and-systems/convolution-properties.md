---
layout: "note"
title: "컨벌루션의 성질"
display_title: "컨벌루션의 성질 (Properties of Convolution)"
kind: "concept"
kind_label: "정리"
num: "20"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Properties of Convolution", "교환법칙", "Commutative Property", "분배법칙", "Distributive Property", "결합법칙", "Associative Property", "직렬 연결", "Cascade", "병렬 연결", "Parallel"]
description: "컨벌루션은 보통의 곱셈처럼 순서를 바꿔도(교환), 덧셈에 나눠 걸어도(분배), 묶는 순서를 바꿔도(결합) 결과가 같다. 그래서 LTI 시스템을 줄줄이 이은 것은 임펄스 응답을 컨벌루션한 시스템 하나로, 나란히 이은 것은 임펄스 응답을 더한 시스템 하나로 바꿔 생각할 수 있다. 줄줄…"
prev_url: "/studies/signals-and-systems/convolution-integral/"
prev_title: "컨벌루션 적분"
next_url: "/studies/signals-and-systems/lti-system-properties/"
next_title: "임펄스 응답으로 본 LTI 시스템의 성질"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/convolution-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컨벌루션은 보통의 곱셈처럼 순서를 바꿔도(교환), 덧셈에 나눠 걸어도(분배), 묶는 순서를 바꿔도(결합) 결과가 같다. 그래서 LTI 시스템을 줄줄이 이은 것은 임펄스 응답을 컨벌루션한 시스템 하나로, 나란히 이은 것은 임펄스 응답을 더한 시스템 하나로 바꿔 생각할 수 있다. 줄줄이 이은 LTI 시스템은 순서를 바꿔도 전체 결과가 같다. 이 성질들은 두 시스템이 모두 LTI일 때만 쓸 수 있다.

</div>


## 예시로 보기

마이크 신호를 잡음 제거기와 증폭기에 차례로 통과시킨다고 하자. 둘 다 LTI라면 잡음 제거를 먼저 하든 증폭을 먼저 하든 결과는 같다. 두 기계를 하나로 합친 장치의 임펄스 응답은 두 임펄스 응답의 컨벌루션 $$h_1 * h_2$$다(그림 2.25)[^1][^s1].

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

이산 시간과 연속 시간 모두에서[^2][^3][^4]

| 성질 | 식 | 시스템으로 보면 |
|---|---|---|
| 교환법칙 | $$x * h = h * x$$ | 입력과 임펄스 응답의 역할을 바꿔도 출력이 같다 |
| 분배법칙 | $$x * (h_1 + h_2) = x * h_1 + x * h_2$$ | 병렬 연결 = 임펄스 응답이 $$h_1 + h_2$$인 시스템 하나 |
| 결합법칙 | $$x * (h_1 * h_2) = (x * h_1) * h_2$$ | 직렬 연결 = 임펄스 응답이 $$h_1 * h_2$$인 시스템 하나 |

교환과 결합을 함께 쓰면, 직렬 연결된 LTI 시스템의 순서를 바꿔도 전체 임펄스 응답이 같다.

</div>


분배법칙은 입력 쪽으로도 통한다: $$(x_1 + x_2) * h = x_1 * h + x_2 * h$$. 두 입력의 합에 대한 응답은 각 응답의 합이라는 뜻이다[^3].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

**교환법칙**(이산): $$r = n - k$$로 바꾸면 $$k = n - r$$이고, $$k$$가 모든 정수를 돌 때 $$r$$도 모든 정수를 돈다[^2].

$$x[n] * h[n] = \sum_{k}x[k]h[n-k] = \sum_{r}x[n-r]h[r] = h[n] * x[n]$$

**교환법칙**(연속): $$u = t - \tau$$로 바꾸면 $$d\tau = -du$$이고 적분 범위가 뒤집혀 부호가 상쇄된다[^5].

$$(f * g)(t) = \int_{\infty}^{-\infty}f(t-u)g(u)(-du) = \int_{-\infty}^{\infty}g(u)f(t-u)du = (g * f)(t)$$

**결합법칙**(연속)[^5]
1. $$((f*g)*h)(t) = \int\left[\int f(u)g(\tau - u)du\right]h(t-\tau)d\tau$$ (안쪽 정의를 대입)
2. 적분 순서를 바꾼다: $$= \int f(u)\left[\int g(\tau-u)h(t-\tau)d\tau\right]du$$ (적분 순서를 바꿀 수 있다고 가정)
3. 안쪽에서 $$v = \tau - u$$로 바꾸면 $$\int g(v)h(t - u - v)dv = (g*h)(t-u)$$
4. 그래서 $$= \int f(u)(g*h)(t-u)du = (f*(g*h))(t)$$.

**분배법칙**은 합과 적분이 덧셈에 대해 나눠지는 성질에서 바로 나온다[^s1].

</details>


## 예제

**예제 2.10** $$x[n] = (\frac12)^n u[n] + 2^n u[-n]$$, $$h[n] = u[n]$$[^6]

- 분배법칙으로 나눈다: $$x_1 = (\frac12)^n u[n]$$, $$x_2 = 2^n u[-n]$$.
- $$y_1 = x_1 * h$$는 예제 2.3에서 $$\alpha = \frac12$$: $$2 - (\frac12)^n$$ ($$n \ge 0$$).
- $$y_2 = x_2 * h$$는 예제 2.5: $$2$$ ($$n \ge 0$$), $$2^{n+1}$$ ($$n < 0$$).
- 더하면 $$y[n] = 4 - (\frac12)^n$$ ($$n \ge 0$$), $$2^{n+1}$$ ($$n < 0$$). 값은 $$y[-3] = \frac14$$, $$y[-1] = 1$$, $$y[0] = 3$$, $$y[1] = 3.5$$, $$y[2] = 3.75$$로 4에 다가간다(그림 2.24).

**비선형 시스템에서는 통하지 않는다.**[^7] $$y[n] = (x[n] + x[n-1])^2$$나 $$y[n] = \max(x[n], x[n-1])$$은 $$x[n] + x[n-1]$$과 비슷한 모양이지만 LTI가 아니라 임펄스 응답으로 나타낼 수 없다. max의 예: 행렬 $$m_1 = \begin{bmatrix}0&1\\2&3\end{bmatrix}$$, $$m_2 = \begin{bmatrix}4&5\\0&1\end{bmatrix}$$에서 $$\max(m_1 - m_2) = 2$$이지만 $$\max m_1 - \max m_2 = -2$$다(딥러닝의 맥스 풀링).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 교환·분배·결합법칙과 직렬 순서 무관을 무작위 정수 수열 300쌍으로 확인, 예제 2.10의 닫힌 꼴과 값, max 예 확인 — [20_convolution-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/20_convolution-properties_verify/)</div>

</div>


## 활용

- 복잡한 신호 처리 사슬을 하나의 임펄스 응답으로 미리 합쳐 두면, 입력마다 계산을 한 번만 하면 된다[^s1].
- 계산할 때 더 쉬운 쪽을 뒤집어 민다(교환법칙). 보통 모양이 단순한 쪽을 뒤집는 것이 편하다.

## 연결

- 선수: [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/), [시스템과 시스템 연결](/Hongs_Blog/studies/signals-and-systems/systems-interconnection/)
- 다음: [임펄스 응답으로 본 LTI 시스템의 성질](/Hongs_Blog/studies/signals-and-systems/lti-system-properties/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 입력이 $$h_1$$과 $$h_2$$인 두 LTI 시스템에 나란히 들어가 출력이 더해진다. 이어서 그 결과가 $$h_3$$ 시스템을 지난다. 전체 임펄스 응답을 식으로 쓰라.</summary>

**답:** $$(h_1 + h_2) * h_3$$. 분배법칙으로 $$h_1 * h_3 + h_2 * h_3$$과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 직렬 연결된 두 LTI 시스템의 순서를 바꿔도 되는 이유를 성질 이름으로 설명하라.</summary>

**답:** 결합법칙으로 전체 출력은 $$x * (h_1 * h_2)$$이고, 교환법칙으로 $$h_1 * h_2 = h_2 * h_1$$이다. 그래서 $$x * (h_2 * h_1)$$, 곧 순서를 바꾼 연결과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 순서를 바꾸면 결과가 달라지는 두 시스템의 직렬 연결 예를 들라.</summary>

**답:** "제곱하기"와 "2배 하기". 입력 1을 넣으면 제곱 → 2배는 2, 2배 → 제곱은 4다. 제곱이 선형이 아니라 컨벌루션으로 나타낼 수 없기 때문이다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/06.Week06_CH02_2_handout.pdf, p.8 (그림 2.25)
[^2]: 같은 자료, p.3
[^3]: 같은 자료, p.4 (그림 2.23)
[^4]: 같은 자료, p.8
[^5]: 같은 자료, p.43
[^6]: 같은 자료, p.5~6 (예제 2.10, 그림 2.24)
[^7]: 같은 자료, p.2~3
[^s1]: 에이전트 보충. 마이크 신호 비유, 분배법칙 증명의 한 줄, 하나로 합쳐 계산을 줄이는 활용, 확인 문제는 원본에 없다. 성질은 검증 코드로 확인했다.
{% endraw %}
