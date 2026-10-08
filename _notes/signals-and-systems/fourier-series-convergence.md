---
layout: "note"
title: "푸리에 급수의 수렴"
display_title: "푸리에 급수의 수렴 (Convergence of the Fourier Series)"
kind: "concept"
kind_label: "정리"
num: "31"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Convergence of the Fourier Series", "디리클레 조건", "Dirichlet Conditions", "깁스 현상", "Gibbs Phenomenon", "근사 오차 에너지", "Approximation Error Energy", "부분합", "Partial Sum", "유계 변동", "Bounded Variation"]
description: "고조파를 무한히 더하면 정말 원래 신호가 될까? 실제로 쓰는 거의 모든 주기 신호에서는 그렇다. 한 주기의 에너지가 유한하면 오차의 에너지가 0으로 가고, 디리클레의 세 조건을 만족하면 끊기지 않은 점마다 원래 값으로 간다. 하지만 끊긴 점에서는 양쪽 값의 평균으로 가고, 그 근처…"
prev_url: "/studies/signals-and-systems/ct-fourier-series/"
prev_title: "연속 시간 푸리에 급수"
next_url: "/studies/signals-and-systems/ctfs-properties/"
next_title: "연속 시간 푸리에 급수의 성질"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/fourier-series-convergence/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

고조파를 무한히 더하면 정말 원래 신호가 될까? 실제로 쓰는 거의 모든 주기 신호에서는 그렇다. 한 주기의 에너지가 유한하면 오차의 에너지가 0으로 가고, 디리클레의 세 조건을 만족하면 끊기지 않은 점마다 원래 값으로 간다. 하지만 끊긴 점에서는 양쪽 값의 평균으로 가고, 그 근처에서는 항을 아무리 늘려도 약 9% 튀어나오는 물결(깁스 현상)이 사라지지 않는다.

</div>


## 예시로 보기

사각파(예제 3.5)를 $$k = -N \dots N$$까지만 더한 근사 $$x_N(t)$$를 그려 보면(그림 3.9)[^1]

- $$N = 1$$: 코사인 하나라 둥근 언덕이다.
- $$N = 3, 7, 19$$: 점점 사각형에 가까워지고 위쪽이 평평해진다.
- $$N = 79$$: 거의 사각형이다. 그러나 모서리 옆에 작고 뾰족한 넘침이 여전히 있다.
- 끊긴 점 $$t = T_1$$에서는 $$N$$과 상관없이 늘 $$\frac12$$(위 값 1과 아래 값 0의 평균)을 지난다.

A. Michelson은 이 근사를 기계(조화 분석기)로 그려 보다가 이 넘침을 처음 보고했다[^1].

## 정의

**유한 개 항으로 근사하기.** $$x_N(t) = \sum_{k=-N}^{N}a_ke^{jk\omega_0t}$$로 근사하면 오차는 $$e_N(t) = x(t) - x_N(t)$$이다. 오차의 크기를 한 주기의 오차 에너지로 잰다[^2].

$$E_N = \int_T\vert e_N(t)\vert ^2dt = \int_T\left\vert x(t) - \sum_{k=-N}^{N}a_ke^{jk\omega_0t}\right\vert ^2dt$$


이 $$E_N$$을 가장 작게 만드는 계수가 바로 분석식의 $$a_k$$다. 그래서 유한 개 항을 쓸 때 가장 좋은 근사는 "푸리에 급수를 원하는 개수만큼 자르고 나머지를 버리는 것"이고, $$N$$이 커지면 $$E_N$$이 줄어든다[^2].

**수렴의 두 가지 보장**[^3][^4]

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. **에너지 조건:** 한 주기의 에너지가 유한하면($$\int_T\vert x(t)\vert ^2dt < \infty$$) 모든 $$a_k$$가 유한하고, $$N \to \infty$$에서 $$E_N \to 0$$이다. 이것은 오차의 에너지가 0이라는 뜻이지, 모든 $$t$$에서 값이 같다는 뜻은 아니다.
2. **디리클레 조건:** 다음 셋을 만족하는 주기 신호는 끊기지 않은 모든 점에서 푸리에 급수가 $$x(t)$$로 수렴하고, 끊긴 점에서는 양쪽 극한값의 평균으로 수렴한다.
   - 조건 1: 한 주기에서 절대 적분 가능 $$\int_T\vert x(t)\vert dt < \infty$$. 그러면 $$\vert a_k\vert  \le \frac1T\int_T\vert x(t)\vert dt < \infty$$.
   - 조건 2: 한 주기에서 최댓값·최솟값(오르내림)의 개수가 유한하다(유계 변동).
   - 조건 3: 한 주기에서 불연속점의 개수가 유한하고, 각 불연속에서 뛰는 크기가 유한하다.

</div>


조건 1에서 $$\vert a_k\vert $$의 한계가 나오는 이유: $$\vert e^{-jk\omega_0t}\vert  = 1$$이라 $$\vert a_k\vert  = \left\vert \frac1T\int x e^{-jk\omega_0t}dt\right\vert  \le \frac1T\int\vert x\vert dt$$이다[^4].

**조건을 깨는 신호**(그림 3.8)[^5]

| 깨는 조건 | 예 | 이유 |
|---|---|---|
| 조건 1 | $$x(t) = \frac1t$$ ($$0 < t \le 1$$, 주기 1) | $$\int_0^1\frac1tdt = \infty$$ |
| 조건 2 | $$x(t) = \sin\frac{2\pi}{t}$$ ($$0 < t \le 1$$) | 절대 적분은 1보다 작지만 0 근처에서 무한히 오르내린다 |
| 조건 3 | 주기 8, $$[0,4)$$에서 1, $$[4,6)$$에서 $$\frac12$$, $$[6,7)$$에서 $$\frac14$$, … | 넓이는 8보다 작지만 불연속점이 무한히 많다 |

조건 2의 예에서 $$\int_0^1\vert \sin\frac{2\pi}{t}\vert dt$$는 $$u = \frac1t$$로 바꾸면 $$\int_1^\infty\frac{\vert \sin2\pi u\vert }{u^2}du \le \int_1^\infty\frac{1}{u^2}du = 1$$이라 유한하다(비교 판정법)[^5].

이런 신호는 모두 인위적으로 만든 것이라 실제 상황에서는 거의 나오지 않는다[^6].

**두 신호가 "같다"는 뜻.** 불연속점에서만 값이 다른 두 신호는 어느 구간에서 적분해도 같고, 어떤 시스템과 컨벌루션해도 결과가 같다. 그래서 LTI 시스템 해석에서는 같은 신호로 본다[^6].

## 예제

**깁스 현상**[^7]. 사각파의 $$x_N$$은 불연속점 근처에서 넘침과 물결이 생긴다. $$N$$을 늘리면 물결이 불연속점 쪽으로 좁아지지만, 넘치는 높이는 점프 크기의 약 9%로 줄지 않는다. 그래도 넓이가 0으로 줄어 오차 에너지는 0으로 간다. 이것이 "오차 에너지 → 0"과 "모든 점에서 같다"가 다른 이유다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 사각파($$T = 4T_1$$)의 $$E_N$$이 $$N = 1, 2, 3, 7, 19, 79$$에서 늘지 않고 0.006 아래로 줄어듦, 불연속점에서 $$x_N(T_1) = \frac12$$, 연속점에서 원래 값에 수렴, $$N = 19, 79, 301$$에서 넘침이 모두 0.085~0.095 — [31_fourier-series-convergence_verify.py](/Hongs_Blog/studies/signals-and-systems/code/31_fourier-series-convergence_verify/)</div>

</div>


## 활용

- 디지털 오디오나 영상에서 높은 주파수 성분을 갑자기 잘라내면 경계 근처에 물결무늬(링잉)가 생긴다. 깁스 현상이다. 그래서 필터는 경계를 부드럽게 줄이는 창 함수를 함께 쓴다[^s1].
- LTI 시스템이 안정할 조건 $$\int\vert h(t)\vert dt < \infty$$(절대 적분 가능)도 디리클레 조건 1과 같은 꼴이다. 이 조건이면 $$H(s)$$를 정의하는 적분이 수렴한다[^4].

## 연결

- 선수: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)
- 수학 쪽: [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/), [푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/) (디리클레 정리, 깁스 현상)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사각파의 푸리에 급수는 불연속점 $$t = T_1$$에서 어떤 값으로 수렴하는가? 그 값이 나오는 이유는?</summary>

**답:** $$\frac12$$. 디리클레 조건을 만족하는 신호의 푸리에 급수는 불연속점에서 양쪽 극한값(1과 0)의 평균으로 수렴한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "오차 에너지가 0으로 간다"와 "모든 $$t$$에서 원래 값으로 간다"는 같은 말인가? 깁스 현상으로 설명하라.</summary>

**답:** 아니다. 깁스 현상에서 불연속점 근처의 넘침은 높이가 약 9%로 남지만 폭이 0으로 줄어 넓이(오차 에너지)는 0으로 간다. 에너지는 0이어도 특정 점 근처에서는 값이 다를 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 디리클레 조건 1(절대 적분 가능)은 만족하지만 조건 2를 깨는 신호를 들고, 어디서 깨지는지 말하라.</summary>

**답:** $$x(t) = \sin\frac{2\pi}{t}$$ ($$0 < t \le 1$$, 주기 1). 절대 적분은 1 이하로 유한하지만 $$t \to 0$$에서 무한히 많이 오르내려 조건 2(유한한 극값 개수)를 깬다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/09.Week09_CH03_2_handout.pdf, p.8 (그림 3.9)
[^2]: 같은 자료, p.2
[^3]: 같은 자료, p.3
[^4]: 같은 자료, p.4
[^5]: 같은 자료, p.4~6 (그림 3.8)
[^6]: 같은 자료, p.7
[^7]: 같은 자료, p.8~9
[^s1]: 에이전트 보충. 링잉과 창 함수의 활용, 넘침 높이 약 9%의 수치(Oppenheim·Willsky 2판 3.4절), 확인 문제는 원본에 없다. 수치는 검증 코드로 확인했다.
{% endraw %}
