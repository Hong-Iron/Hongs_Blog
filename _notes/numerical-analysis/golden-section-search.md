---
layout: "note"
title: "황금분할 탐색"
display_title: "황금분할 탐색 (Golden Ratio Search)"
kind: "concept"
kind_label: "알고리즘"
num: "25"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Golden Ratio Search", "Golden Section Search", "황금비 탐색", "구간 탐색", "Bracketing Search", "단봉 함수", "Unimodal Function", "황금비", "Golden Ratio"]
description: "골짜기가 하나뿐인 함수에서 가장 낮은 곳을, 도함수 없이 함수 값 비교만으로 찾는다. 구간 안에 두 점을 찍어 더 높은 쪽 바깥을 잘라 내고, 남은 구간에서 되풀이한다. 두 점을 황금비 자리에 두면 남은 점 하나를 다음 회차에 그대로 다시 쓸 수 있어, 한 회차에 함수 계산이 한 …"
prev_url: "/studies/numerical-analysis/data-linearization/"
prev_title: "자료 선형화"
next_url: "/studies/numerical-analysis/fibonacci-search/"
next_title: "피보나치 탐색"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/golden-section-search/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

골짜기가 하나뿐인 함수에서 가장 낮은 곳을, 도함수 없이 함수 값 비교만으로 찾는다. 구간 안에 두 점을 찍어 더 높은 쪽 바깥을 잘라 내고, 남은 구간에서 되풀이한다. 두 점을 황금비 자리에 두면 남은 점 하나를 다음 회차에 그대로 다시 쓸 수 있어, 한 회차에 함수 계산이 한 번뿐이고 구간은 매번 약 0.618배로 준다. 다만 골짜기가 여러 개인 함수에서는 가장 깊은 골짜기가 아닌 곳으로 갈 수 있다.

</div>


## 예시로 보기

함수 값을 한 번 계산하는 데 몇 분씩 걸리는 시뮬레이션이 있다. 도함수는 모른다. 최솟값을 찾으려면 계산 횟수를 아껴야 한다[^1].

$$f(x) = x^2 - \sin x$$를 $$[0, 1]$$에서 줄인다[^2][^3].

| $$k$$ | $$a_k$$ | $$c_k$$ | $$d_k$$ | $$b_k$$ | $$f(c_k)$$ | $$f(d_k)$$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 0.3819660 | 0.6180340 | 1 | −0.22684748 | −0.19746793 |
| 1 | 0 | 0.2360680 | 0.3819660 | 0.6180340 | −0.17815339 | −0.22684748 |
| 2 | 0.2360680 | 0.3819660 | 0.4721360 | 0.6180340 | −0.22684748 | −0.23187724 |
| 3 | 0.3819660 | 0.4721360 | 0.5278640 | 0.6180340 | −0.23187724 | −0.22504882 |
| ⋮ | | | | | | |
| 22 | 0.4501730 | 0.4501827 | 0.4501886 | 0.4501983 | −0.23246558 | −0.23246558 |

0회차에 $$f(c) < f(d)$$라 $$[d, b]$$를 버린다. 1회차의 $$d$$는 0회차의 $$c$$를 그대로 쓴다. 새로 계산하는 점은 $$c_1$$ 하나다. 참 최솟값은 $$x \approx 0.4501836$$이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 0~6, 21·22행, 구간이 매번 $$r$$배, 함수 계산 25번, 참 최솟값, 카드 C2, 단봉이 아닐 때 다른 극소로 감 — [25_golden-section_impl.py](/Hongs_Blog/studies/numerical-analysis/code/25_golden-section_impl/)</div>

</div>


## 정의

**입력:** 구간 $$[a, b]$$에서 단봉인 함수 $$f$$. **출력:** 최솟값이 있는 작은 구간.

$$f$$가 $$[a, b]$$에서 **단봉**이라는 것은 $$f$$가 $$[a, p]$$에서 줄고 $$[p, b]$$에서 느는 $$p$$가 하나 있다는 뜻이다[^4]. 단봉이면 안쪽 두 점 $$a < c < d < b$$의 값만 비교해 최솟값이 있는 쪽을 안다[^5].

- $$f(c) \le f(d)$$이면 최솟값은 $$[a, d]$$에 있다. $$b \leftarrow d$$.
- $$f(c) > f(d)$$이면 최솟값은 $$[c, b]$$에 있다. $$a \leftarrow c$$.

두 경우가 같은 크기로 줄도록 $$[a, d]$$와 $$[c, b]$$를 대칭으로($$d - a = b - c$$) 놓는다. 남는 비율을 $$r$$이라 하면 다음과 같다[^6].

$$c = a + (1 - r)(b - a), \qquad d = a + r(b - a), \qquad \tfrac12 < r < 1$$


$$r$$이 매 회차 같고, 옛 안쪽 점 하나가 새 안쪽 점이 되려면 $$\frac{r}{1} = \frac{1 - r}{r}$$, 곧 $$r^2 + r - 1 = 0$$이어야 한다[^7][^8].

$$r = \frac{-1 + \sqrt5}{2} \approx 0.618 \quad(\text{황금비})$$


```
GOLDEN(f, a, b, n)
  r ← (√5 − 1)/2
  c ← a + (1 − r)(b − a);  d ← a + r(b − a)
  repeat n times
      if f(c) ≤ f(d) then  b ← d; d ← c; c ← a + (1 − r)(b − a)    # f(c) 하나만 새로
      else                 a ← c; c ← d; d ← a + r(b − a)          # f(d) 하나만 새로
  return [a, b]
```

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: $$c_0 = \frac{3 - \sqrt5}{2} \approx 0.38919660$$ (p.17) / 문제점: $$\frac{3 - \sqrt5}{2} = 0.3819660$$이다. 숫자 둘이 자리를 바꿨다 / 수정안: $$c_0 \approx 0.3819660$$ / 근거: 같은 자료 p.18의 표도 0.3819660이고, 25_golden-section_impl.py로 계산[^2]

</div>


## 활용

- 복잡도: 처음 두 번 뒤 한 회차에 함수 계산 1번, 구간은 $$r^n$$배. 폭을 $$\varepsilon$$ 이하로 줄이는 데 약 $$\log_{1/r}\frac{b - a}{\varepsilon}$$번이다. 오차 $$10^{-6}$$이면 폭 1에서 약 29번이다[^s1].
- 기계학습의 하이퍼파라미터 하나 고르기, [단변수 탐색](/Hongs_Blog/studies/numerical-analysis/direct-search/)과 최급상승법의 직선 탐색에 쓴다.
- 흔한 실수: 단봉인지 확인하지 않는 것. $$\sin5x + 0.05x$$를 $$[0, 4]$$에서 줄이면 $$x \approx 2.197$$의 극소로 가는데, 전체 최솟값은 $$x \approx 0.94$$에 있다(검증 코드).

## 연결

- 선수: [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/)(극값), [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)(구간을 줄이는 생각)
- 회차마다 비율을 바꿔 회차 수를 미리 정하는 방법: [피보나치 탐색](/Hongs_Blog/studies/numerical-analysis/fibonacci-search/)
- 근 찾기의 같은 생각: [이분법](/Hongs_Blog/studies/numerical-analysis/bisection-method/)(부호로 반 자르기)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 황금분할 탐색의 두 안쪽 점 공식과, 값 비교 뒤 구간을 줄이는 규칙을 쓰라.</summary>

**답:** $$c = a + (1 - r)(b - a)$$, $$d = a + r(b - a)$$, $$r = \frac{\sqrt5 - 1}{2}$$. $$f(c) \le f(d)$$이면 $$[a, d]$$, 아니면 $$[c, b]$$를 남긴다(최솟값을 찾을 때).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$[0, 2]$$에서 시작할 때 처음 두 안쪽 점은?</summary>

**답:** $$c = (1 - 0.618034)\cdot2 \approx 0.763932$$, $$d = 0.618034\cdot2 \approx 1.236068$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 점을 황금비 자리에 두면 왜 회차마다 함수 계산이 한 번이면 되는가?</summary>

**답:** 구간을 줄인 뒤에도 남은 옛 점이 새 구간의 정확히 황금비 자리에 놓인다($$r^2 = 1 - r$$이기 때문). 그래서 그 점의 값을 다시 쓰고, 반대편 새 점 하나만 계산한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 표의 2회차에서 $$f(c_2) = -0.22684748 > f(d_2) = -0.23187724$$이다. 3회차의 $$a, c, d, b$$를 쓰라.</summary>

**답:** $$f(c) > f(d)$$라 $$[c, b]$$를 남긴다. $$a_3 = 0.3819660$$, $$c_3 = d_2 = 0.4721360$$, $$b_3 = 0.6180340$$, $$d_3 = a_3 + r(b_3 - a_3) = 0.5278640$$.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/14.na14_optimization.pdf, p.9
[^2]: 같은 자료, p.17
[^3]: 같은 자료, p.18
[^4]: 같은 자료, p.10
[^5]: 같은 자료, p.11~13
[^6]: 같은 자료, p.14
[^7]: 같은 자료, p.15
[^8]: 같은 자료, p.16
[^s1]: 에이전트 보충. 동기 예, 참 최솟값, 의사코드, 복잡도, 활용, 단봉이 아닌 예, 카드 C2~C4는 원본에 없다. 22행에서 $$f(c)$$와 $$f(d)$$가 8자리까지 같아 23행의 선택은 반올림에 달린다. 슬라이드의 23행과 구현의 23행 모두 참 최솟값을 담는다. 구현 코드로 확인했다.
{% endraw %}
