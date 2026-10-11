---
layout: "note"
title: "도함수"
display_title: "도함수 (Derivative)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Derivative", "미분", "미분계수", "도함수", "순간 변화율", "instantaneous rate of change", "접선의 기울기", "slope of tangent", "평균 변화율", "average rate of change", "미분 가능", "differentiable", "수치 미분", "numerical differentiation", "유한 차분", "finite difference"]
description: "도함수는 \"지금 이 순간 얼마나 빨리 변하는가\"를 재는 함수다. 짧은 구간의 평균 변화율에서 구간을 한없이 줄인 극한이고, 그래프에서는 그 점의 접선의 기울기다. 기울기를 알면 함수를 가장 빨리 줄이는 방향을 알 수 있어서, 머신러닝의 학습이 모두 도함수 위에 선다. 다만 뾰족하거…"
prev_url: "/studies/calculus/sequence-limits/"
prev_title: "수열의 극한과 e"
next_url: "/studies/calculus/differentiation-rules/"
next_title: "미분 법칙"
math: true
mermaid: true
code_count: 2
permalink: "/studies/calculus/derivative/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

도함수는 "지금 이 순간 얼마나 빨리 변하는가"를 재는 함수다. 짧은 구간의 평균 변화율에서 구간을 한없이 줄인 극한이고, 그래프에서는 그 점의 접선의 기울기다. 기울기를 알면 함수를 가장 빨리 줄이는 방향을 알 수 있어서, 머신러닝의 학습이 모두 도함수 위에 선다. 다만 뾰족하거나 끊긴 점에서는 도함수가 없다.

</div>


## 예시로 보기

자동차의 위치가 $$f(t) = t^2$$ (m)일 때 $$t = 3$$초의 속도를 구한다. 속도계가 없으니 짧은 구간의 평균 속도를 잰다.

| 구간 | $$[3, 4]$$ | $$[3, 3.1]$$ | $$[3, 3.01]$$ | $$[3, 3.001]$$ |
|---|---|---|---|---|
| 평균 속도 $$\frac{f(3+h) - f(3)}{h}$$ | 7 | 6.1 | 6.01 | 6.001 |

평균 속도는 정확히 $$6 + h$$이고, 구간을 줄이면 6에 다가간다. 그래서 $$t = 3$$의 순간 속도는 6 m/s다. 그래프에서 두 점을 잇는 할선이 구간이 줄면서 접선으로 바뀌고, 그 기울기가 6이다. 구간 길이가 아래 정의의 $$h$$, 평균 속도가 차분몫이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/04_derivative_fig1.svg" alt="그림" width="525" height="335" loading="lazy">

세 할선은 모두 점 $$(3, 9)$$를 지난다. $$h$$가 1, 0.5, 0.1로 줄면 할선의 기울기가 7, 6.5, 6.1로 줄며 보라색 점선(접선)에 겹쳐 간다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

함수 $$f$$의 $$a$$에서의 **미분계수**는

$$f'(a) = \lim_{h \to 0}\frac{f(a + h) - f(a)}{h}$$

이고, 이 극한이 있으면 $$f$$는 $$a$$에서 **미분 가능**하다. $$x$$마다 $$f'(x)$$를 대응시킨 함수 $$f'$$을 **도함수**라 하며 $$\frac{df}{dx}$$, $$\frac{d}{dx}f(x)$$로도 쓴다[^1].

</div>


**설계 이유.** 변화율은 "변화량 ÷ 걸린 양"이라 두 점이 필요하다. 한 점에서의 변화율을 말하려면 두 점을 한없이 가깝게 하는 [극한](/Hongs_Blog/studies/calculus/limits/)밖에 방법이 없다. $$h$$를 0으로 **보내지** 0을 **넣지** 않는 것도 그래서다. 넣으면 $$0/0$$이다.

**동치인 다른 정의.** $$f'(a) = m$$이라는 것은 $$f(a + h) = f(a) + m h + r(h)$$로 쓸 때 나머지가 $$h$$보다 빨리 0으로 간다($$r(h)/h \to 0$$)는 것과 같다. "가까이서 보면 직선 $$f(a) + mh$$와 거의 같다"는 뜻이다. [선형 근사](/Hongs_Blog/studies/calculus/linear-approx-newton/)가 이 모양이고, 다변수 미분은 이 모양으로 정의한다([다변수 연쇄 법칙과 야코비 행렬](/Hongs_Blog/studies/calculus/multivariable-chain-rule/)). 양변을 $$h$$로 나누면 원래 정의가 된다.

**해당하는 예:** $$(x^2)' = 2x$$, $$(1/x)' = -1/x^2$$ ($$x \ne 0$$), $$(c)' = 0$$. **해당하지 않는 예:** $$\vert x\vert $$는 $$x = 0$$에서 오른쪽 몫이 1, 왼쪽 몫이 $$-1$$이라 극한이 없다. $$x^{1/3}$$은 $$x = 0$$에서 몫 $$h^{-2/3}$$이 한없이 커진다(세로 접선).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

$$f$$가 $$a$$에서 미분 가능하면 $$a$$에서 연속이다. 역은 맞지 않는다($$\vert x\vert $$).

</div>


```mermaid
flowchart LR
    D["a에서 미분 가능"] -- "늘 맞다" --> C["a에서 연속"]
    C -- "늘 맞다" --> L["a에서 극한이 있다"]
    C -. "거꾸로는 꺾인 점에서 깨진다" .-> D
    L -. "거꾸로는 뚫린 점에서 깨진다" .-> C
```

실선 화살표는 늘 맞는 방향이고, 점선은 거꾸로 가면 깨지는 방향이다. 꺾인 점은 연속이지만 미분할 수 없다. 뚫린 점은 극한이 있지만 연속이 아니다[^s3].

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *$$x^2$$의 도함수:* $$\frac{(x+h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h \to 2x$$. — $$h \ne 0$$이라 약분할 수 있다
2. *$$1/x$$의 도함수:* $$\frac{1/(x+h) - 1/x}{h} = \frac{x - (x+h)}{h\,x(x+h)} = \frac{-1}{x(x+h)} \to -\frac{1}{x^2}$$.
3. *미분 가능 ⇒ 연속:* $$f(a + h) - f(a) = \frac{f(a+h) - f(a)}{h} \cdot h \to f'(a) \cdot 0 = 0$$이므로 $$\lim_{h \to 0} f(a + h) = f(a)$$. — [극한 법칙](/Hongs_Blog/studies/calculus/limits/)의 곱 ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 1에서 h로 약분해도 되는 근거는?</summary>

극한은 $$h \ne 0$$인 값만 보기 때문이다. $$h = 0$$에서는 약분이 불가능하지만 극한과 무관하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 3에서 "·h → 0"만으로 끝나지 않고 앞의 몫이 수렴해야 하는 이유는?</summary>

곱의 극한 법칙은 두 인수가 모두 수렴할 때 쓴다. 몫이 한없이 커지면(세로 접선) $$\infty \cdot 0$$ 꼴이라 법칙을 쓸 수 없다. 미분 가능이 바로 그 몫의 수렴을 보장한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

두 점으로만 잴 수 있는 기울기를, 두 점을 한없이 붙여 한 점의 성질로 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

적분은 거꾸로 "잘게 나눈 조각의 합의 극한"이다([정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)). 수치 계산에서는 극한을 끝까지 갈 수 없어 작은 $$h$$로 멈추고, 그 대가로 오차가 생긴다(아래 활용).

</details>


## 예제

$$f(x) = 1/x$$의 $$x = 2$$에서의 접선을 구한다.

1. *기울기:* $$f'(2) = -\frac{1}{2^2} = -\frac14$$.
2. *지나는 점:* $$(2, f(2)) = (2, \frac12)$$.
3. *접선의 식:* $$y = \frac12 - \frac14(x - 2) = -\frac14 x + 1$$.
4. *확인:* $$x = 2.1$$에서 접선 $$0.475$$, 실제 $$1/2.1 \approx 0.4762$$. 가까운 곳에서 거의 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 몫이 정확히 $$6 + h$$, $$1/x$$의 몫을 유리수로 확인, $$\vert x\vert $$와 $$x^{1/3}$$, 수치 미분의 오차표 — [04_derivative_verify.py](/Hongs_Blog/studies/calculus/code/04_derivative_verify/)</div>

</div>


## 활용

- **최적화와 학습.** 손실 함수의 도함수가 양수면 입력을 줄이고 음수면 늘린다. 이것을 반복하는 것이 [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)이다.
- **수치 미분의 함정.** 컴퓨터로 $$\frac{f(x+h) - f(x)}{h}$$를 계산할 때 $$h$$를 무작정 줄이면 안 된다. $$f = e^x$$, $$x = 0$$에서 배정밀도로 계산한 오차는 다음과 같다.

| $$h$$ | $$10^{-1}$$ | $$10^{-4}$$ | $$10^{-8}$$ | $$10^{-12}$$ | $$10^{-15}$$ |
|---|---|---|---|---|---|
| 전진 차분 오차 | $$5.2 \times 10^{-2}$$ | $$5.0 \times 10^{-5}$$ | $$6.1 \times 10^{-9}$$ | $$8.9 \times 10^{-5}$$ | $$1.1 \times 10^{-1}$$ |
| 중앙 차분 $$\frac{f(x+h) - f(x-h)}{2h}$$ 오차 | $$1.7 \times 10^{-3}$$ | $$1.7 \times 10^{-9}$$ | $$6.1 \times 10^{-9}$$ | $$3.3 \times 10^{-5}$$ | $$5.5 \times 10^{-2}$$ |

$$h$$가 크면 극한에서 먼 오차(절단 오차)가, 작으면 거의 같은 두 수를 빼는 반올림 오차가 커진다. 전진 차분은 $$h \approx 10^{-8}$$, 중앙 차분은 $$h \approx 10^{-5}$$(오차 $$1.2 \times 10^{-11}$$)에서 가장 정확하다[^s1]. 그래서 신경망은 수치 미분 대신 자동미분을 쓴다([연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/)).

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/04_derivative_fig2.svg" alt="그림" width="539" height="336" loading="lazy">

두 눈금 모두 로그다. 오른쪽에서 왼쪽으로 $$h$$를 줄이면 오차가 처음엔 곧게 내려가다가, 점선 근처의 바닥을 지나면 들쭉날쭉하게 다시 오른다. 중앙 차분은 더 가파르게 내려가서 바닥이 더 깊다[^s2].

## 연결

- 선수: [극한](/Hongs_Blog/studies/calculus/limits/)
- 이어지는 개념: [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/), [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/), [선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"연속이면 미분 가능하다"</div>

틀렸다. 교과서에 나오는 매끄러운 함수들은 대부분 둘 다라서 같은 조건처럼 느껴진다. 미분 가능하면 연속이지만 그 역은 아니다. $$\vert x\vert $$는 $$x = 0$$에서 끊김 없이 이어지지만(연속), 꺾여 있어서 오른쪽 기울기 1과 왼쪽 기울기 $$-1$$이 다르다(미분 불가능). 신경망의 ReLU $$\max(0, x)$$도 0에서 꺾여 미분 불가능이라, 구현에서는 그 점의 기울기를 0 같은 값으로 정해 쓴다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** f'(a)의 정의를 극한으로 쓰고, 그래프와 움직임에서 각각 무엇을 뜻하는지 말하라.</summary>

**답:** $$f'(a) = \lim_{h \to 0}\frac{f(a+h) - f(a)}{h}$$. 그래프에서는 $$(a, f(a))$$에서의 접선의 기울기, 움직임에서는 순간 속도(순간 변화율)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 정의로 f(x) = x²의 x = 3에서의 미분계수를 구하라.</summary>

**답:** $$\frac{(3+h)^2 - 9}{h} = \frac{6h + h^2}{h} = 6 + h \to 6$$.

**흔한 오답:** $$h = 0$$을 먼저 넣어 $$0/0$$에서 멈추는 것. 약분한 뒤 극한을 취한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 연속이지만 미분 가능하지 않은 함수와 점을 들고, 왜 미분 가능하지 않은지 보여라.</summary>

**답:** $$\vert x\vert $$, $$x = 0$$. $$\frac{\vert h\vert  - 0}{h}$$는 $$h > 0$$이면 1, $$h < 0$$이면 $$-1$$이라 한쪽 극한이 달라 극한이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 수치 미분에서 h를 계속 작게 하면 왜 오히려 부정확해지는가?</summary>

**답:** $$f(x+h)$$와 $$f(x)$$가 거의 같아져 빼는 순간 유효숫자가 사라진다(반올림 오차는 대략 $$\epsilon/h$$로 커짐). 반대로 $$h$$가 크면 극한과의 차이(절단 오차, 대략 $$h$$에 비례)가 크다. 두 오차의 합이 가장 작은 $$h$$(배정밀도 전진 차분에서 약 $$10^{-8}$$)가 있다.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 3.1절 "Defining the Derivative", 3.2절 "The Derivative as a Function"(미분 가능성과 연속성)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 수치 미분의 최적 $$h$$가 기계 엡실론 $$\epsilon \approx 2.2 \times 10^{-16}$$의 제곱근(전진 차분), 세제곱근(중앙 차분) 정도라는 것은 수치 해석의 표준 결과다. 표의 값은 검증 코드로 계산했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. [04_derivative_plot.py](/Hongs_Blog/studies/calculus/code/04_derivative_plot/)로 그렸고, 할선 기울기가 $$6 + h$$인 것과 오차표의 값(전진 차분 $$h = 10^{-1}, 10^{-4}, 10^{-8}, 10^{-15}$$, 중앙 차분 $$h = 10^{-1}, 10^{-4}, 10^{-5}$$)을 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. 이 문서의 정리(미분 가능하면 연속, 역은 거짓), [연속](/Hongs_Blog/studies/calculus/continuity/)의 세 조건, [극한](/Hongs_Blog/studies/calculus/limits/)의 오해(극한값과 함숫값이 다른 함수)를 근거로 그렸다.
{% endraw %}
