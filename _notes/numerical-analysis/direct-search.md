---
layout: "note"
title: "직접 탐색법"
display_title: "직접 탐색법 (Direct Search Methods)"
kind: "concept"
kind_label: "기법"
num: "27"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Direct Search Methods", "무작위 탐색", "Random Search", "단변수 탐색", "Univariate Search", "패턴 탐색", "Pattern Search", "다차원 최적화", "Multidimensional Optimization"]
description: "변수가 여럿인 함수의 최댓값을 도함수 없이 함수 값만으로 찾는다. 무작위 탐색은 아무 점이나 많이 찍어 가장 좋은 것을 고르고, 단변수 탐색은 한 번에 한 변수만 움직여 1차원 최적화를 되풀이하며, 패턴 탐색은 지나온 길의 방향으로 크게 한 번 더 뛴다. 미분할 수 없는 함수에도 …"
prev_url: "/studies/numerical-analysis/fibonacci-search/"
prev_title: "피보나치 탐색"
next_url: "/studies/numerical-analysis/bisection-method/"
next_title: "이분법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/direct-search/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

변수가 여럿인 함수의 최댓값을 도함수 없이 함수 값만으로 찾는다. 무작위 탐색은 아무 점이나 많이 찍어 가장 좋은 것을 고르고, 단변수 탐색은 한 번에 한 변수만 움직여 1차원 최적화를 되풀이하며, 패턴 탐색은 지나온 길의 방향으로 크게 한 번 더 뛴다. 미분할 수 없는 함수에도 쓸 수 있다. 하지만 변수가 많아지면 계산이 크게 늘고, 함수 모양을 활용하지 않아 기울기를 쓰는 방법보다 느리다.

</div>


## 예시로 보기

$$f(x, y) = y - x - 2x^2 - 2xy - y^2$$의 최댓값을 찾는다. 참값은 $$(-1, 1.5)$$에서 1.25다[^1].

- **무작위 탐색**: $$-2 \le x \le 2$$, $$1 \le y \le 3$$에서 점을 100개, 1,000개, 10,000개 찍으니 가장 좋은 값이 1.2302, 1.2458, 1.2496이었다. 점을 늘리면 다가가지만 느리다[^s1].
- **단변수 탐색**: $$(0, 0)$$에서 $$y$$를 고정하고 $$x$$만 움직여 최대인 곳 $$x = -0.25$$로, 다음에 $$x$$를 고정하고 $$y$$만 움직인다. 등고선이 비스듬한 타원이라 계단처럼 지그재그로 다가가고, 갈수록 걸음이 작아진다[^2].
- **패턴 탐색**: 두 번 움직인 뒤 처음 점과 지금 점을 잇는 방향으로 한 번 더 찾는다. 오차 $$10^{-6}$$에 도달하는 데 단변수는 21회차, 패턴은 10회차였다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 탐색이 점을 늘릴수록 다가감, 단변수 탐색의 걸음이 줄고 참값에 도달, 패턴 탐색이 회차가 적음, 카드 C2, 미분할 수 없는 함수 — [27_direct-search_impl.py](/Hongs_Blog/studies/numerical-analysis/code/27_direct-search_impl/)</div>

</div>


## 정의

여러 변수의 극값을 찾는 방법은 도함수를 쓰지 않는 **직접 방법**과 도함수를 쓰는 **기울기 방법**으로 나뉜다[^3].

**무작위 탐색.** 독립변수를 무작위로 골라 함수 값을 계산하고 가장 좋은 것을 남긴다. 표본이 충분하면 결국 최적점을 찾는다[^4].

- 장점: 불연속이거나 미분할 수 없는 함수에도 통한다. 국소 최적이 여럿이어도 전체를 훑는다.
- 단점: 변수가 늘면 필요한 표본이 크게 늘어난다. 함수의 모양을 활용하지 않아 효율이 낮다[^5].

**단변수 탐색과 패턴 탐색.** 무작위보다 효율적이고 여전히 도함수가 필요 없다. 다른 변수를 고정하고 한 번에 한 변수만 바꾼다. 문제가 1차원 탐색의 연속이 되므로 [황금분할 탐색](/Hongs_Blog/studies/numerical-analysis/golden-section-search/) 같은 구간 탐색으로 푼다. 최댓값에 가까워질수록 효율이 떨어진다[^2]. 지그재그로 간 점들(예: 1→3, 3→5)을 이은 방향이 최적점을 가리키므로, 그 방향(패턴 방향)으로 한 번 더 찾으면 빨라진다[^6].

## 활용

- 시뮬레이션처럼 함수가 "블랙박스"라 도함수를 모를 때, 하이퍼파라미터 튜닝(무작위 탐색이 격자 탐색보다 나은 경우가 많다), 실험 설계에 쓴다. 넬더-미드 방법도 같은 계열의 직접 탐색이다[^s1].
- 흔한 실수: 단변수 탐색이 좁고 긴 비스듬한 골짜기에서 빨리 끝날 거라 기대하는 것. 축 방향으로만 움직이므로 골짜기가 축과 비스듬하면 아주 많은 계단이 필요하다.

## 연결

- 선수: [황금분할 탐색](/Hongs_Blog/studies/numerical-analysis/golden-section-search/)(한 방향의 1차원 탐색), [다변수 함수와 편미분](/Hongs_Blog/studies/calculus/partial-derivatives/)
- 도함수를 쓰는 방법: [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)(과목별 관점에 최급상승법)
- 무작위 표본으로 계산하기: [몬테카를로 방법](/Hongs_Blog/studies/probability-statistics/monte-carlo/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 무작위 탐색의 장점 두 가지와 단점 두 가지를 쓰라.</summary>

**답:** 장점: 불연속·미분 불가 함수에도 통함, 전체를 훑어 국소 최적에 덜 갇힘. 단점: 변수가 늘면 표본이 크게 늘어남, 함수 모양을 쓰지 않아 비효율.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예의 $$f$$에서 $$(0, 0)$$을 시작으로 $$y = 0$$에 고정하고 $$x$$만 움직여 최대인 $$x$$는?</summary>

**답:** $$f(x, 0) = -x - 2x^2$$, $$\frac{d}{dx} = -1 - 4x = 0$$에서 $$x = -0.25$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 단변수 탐색에 패턴 방향 탐색을 더하면 왜 빨라지는가?</summary>

**답:** 축 방향 걸음들은 골짜기를 지그재그로 오르지만, 지그재그의 꼭짓점들을 이은 방향은 골짜기의 방향과 거의 같다. 그 방향으로 한 번에 멀리 가면 계단 여러 개를 건너뛴다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/15.na15_multiop.pdf, p.3~4
[^2]: 같은 자료, p.6
[^3]: 같은 자료, p.2
[^4]: 같은 자료, p.3
[^5]: 같은 자료, p.5
[^6]: 같은 자료, p.7
[^s1]: 에이전트 보충. 무작위 탐색과 단변수·패턴 탐색의 실험 수치(슬라이드의 표와는 무작위 표본이 다르다), 패턴 방향의 정의, 활용, 넬더-미드, 흔한 실수, 카드 C2·C3은 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
