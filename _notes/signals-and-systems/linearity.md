---
layout: "note"
title: "선형성"
display_title: "선형성 (Linearity)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Linearity", "Linear System", "선형 시스템", "비선형 시스템", "Nonlinear System", "중첩", "Superposition", "덧셈성", "Additivity", "동차성", "Homogeneity", "Scaling", "증분 선형 시스템", "Incrementally Linear System", "입력 0 응답", "Zero-Input Response", "영상태 응답", "Zero-State Response"]
description: "선형 시스템은 \"따로 넣고 더한 것\"과 \"더해서 넣은 것\"이 같은 시스템이다. 입력을 두 배로 하면 출력도 정확히 두 배가 되고, 두 입력을 섞어 넣으면 각자의 출력을 섞은 것이 나온다(중첩). 그래서 복잡한 입력을 쉬운 조각으로 나눠 따로 계산한 뒤 더하면 된다. 이 성질은 아주…"
prev_url: "/studies/signals-and-systems/time-invariance/"
prev_title: "시불변성"
next_url: "/studies/signals-and-systems/convolution-sum/"
next_title: "컨벌루션 합"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/linearity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

선형 시스템은 "따로 넣고 더한 것"과 "더해서 넣은 것"이 같은 시스템이다. 입력을 두 배로 하면 출력도 정확히 두 배가 되고, 두 입력을 섞어 넣으면 각자의 출력을 섞은 것이 나온다(중첩). 그래서 복잡한 입력을 쉬운 조각으로 나눠 따로 계산한 뒤 더하면 된다. 이 성질은 아주 엄격해서 $$y = 2x + 3$$처럼 직선 그래프로 보이는 시스템도 선형이 아니다. 입력이 0이면 출력도 0이어야 하기 때문이다.

</div>


## 예시로 보기

$$y[n] = 2x[n] + 3$$을 시험해 보자(예제 1.20)[^1].

| 입력 | 출력 |
|---|---|
| $$x_1[n] = 2$$ | $$y_1 = 2 \cdot 2 + 3 = 7$$ |
| $$x_2[n] = 3$$ | $$y_2 = 2 \cdot 3 + 3 = 9$$ |
| $$x_3 = x_1 + x_2 = 5$$ | $$y_3 = 2 \cdot 5 + 3 = 13$$ |

선형이라면 $$y_3 = y_1 + y_2 = 16$$이어야 하는데 13이다. 상수 3이 두 번 더해지느냐 한 번 더해지느냐의 차이다. 또 입력이 0이어도 출력이 3이다. 선형 시스템은 입력 0에 출력 0이어야 하므로 여기서 바로 탈락한다[^1].

## 정의

입력 $$x_1, x_2$$의 출력을 $$y_1, y_2$$라 하자. 다음 두 성질을 모두 만족하면 선형 시스템이다[^2].

1. 덧셈성: $$x_1 + x_2 \to y_1 + y_2$$
2. 동차성(크기 조절): $$ax_1 \to ay_1$$, 여기서 $$a$$는 임의의 복소수

둘을 한 문장으로 합치면 다음과 같다[^2][^3].

$$ax_1(t) + bx_2(t) \to ay_1(t) + by_2(t), \qquad ax_1[n] + bx_2[n] \to ay_1[n] + by_2[n] \quad (\text{모든 } a, b)$$


더 일반적으로, 입력이 여러 신호의 가중합 $$x[n] = \sum_k a_kx_k[n]$$이면 출력은 각 응답의 가중합 $$y[n] = \sum_k a_ky_k[n]$$이다. 이것이 중첩 성질이다[^4]. 동차성에 $$a = 0$$을 넣으면 $$0 \to 0$$, 즉 모든 시각에 0인 입력은 모든 시각에 0인 출력을 낸다[^4].

| 선형 | 비선형 |
|---|---|
| $$y(t) = Rx(t)$$, $$y(t) = \frac1C\int_{-\infty}^{t}x(\tau)d\tau$$, $$y[n] = \sum_{k=-\infty}^{n}x[k]$$, $$y[n] = x[n-1]$$ | $$y(t) = x^2(t)$$, $$y(t) = \sin[x(t)]$$ |

선형성과 시불변성은 서로 다른 성질이다. $$y[n] = nx[n]$$은 시변이면서 선형이고, $$y(t) = \sin[x(t)]$$는 시불변이면서 비선형이다[^4].

**증분 선형 시스템.** 선형 시스템의 출력에 "입력 0일 때의 응답" $$y_0$$을 더한 구조다(그림 1.48)[^5]. 두 입력에 대한 출력의 차이는 입력 차이의 선형 함수다. 예제 1.20은 선형 시스템 $$x \to 2x$$에 $$y_0 = 3$$을 더한 것이라 $$y_1 - y_2 = 2(x_1 - x_2)$$다. 적분 회로 $$y(t) = y(t_0) + \int_{t_0}^{t}f(\tau)d\tau$$의 출력도 입력 0 응답 $$y(t_0)$$과 영상태 응답(초기값 0에서 입력만으로 생기는 응답)의 합이다[^5].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$\dot y + \alpha(t)y = \beta(t)x$$는 선형이다.</summary>

$$x_1$$의 식에 $$a$$, $$x_2$$의 식에 $$b$$를 곱해 더하면 $$(ay_1 + by_2)' + \alpha(ay_1 + by_2) = \beta(ax_1 + bx_2)$$다. 미분과 곱셈이 덧셈과 상수배를 그대로 통과시키기 때문이다. 그래서 $$ay_1 + by_2$$가 $$ax_1 + bx_2$$의 출력이다[^3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 선형 시스템은 입력 0에 출력 0을 낸다.</summary>

동차성 $$ax \to ay$$에 $$a = 0$$을 넣으면 $$0 \to 0 \cdot y = 0$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

시스템이 "섞기"(가중합)와 순서를 바꿔도 된다. 섞고 통과시키나, 통과시키고 섞으나 같다.

</details>



## 예제

**예제 1.17** $$y(t) = tx(t)$$[^3]

- $$x_3 = ax_1 + bx_2$$를 넣으면 $$y_3 = t(ax_1 + bx_2) = atx_1 + btx_2 = ay_1 + by_2$$. 선형이다.
- $$t$$가 곱해져 있어도 그 $$t$$는 입력에 따라 바뀌지 않는 수라서 선형성을 해치지 않는다. 대신 시변이다.

**예제 1.18** $$y(t) = x^2(t)$$[^3]

- $$y_3 = (ax_1 + bx_2)^2 = a^2y_1 + b^2y_2 + 2abx_1x_2$$. 선형이라면 $$ay_1 + by_2$$여야 한다.
- 구체적으로 $$x_1 = 1$$, $$x_2 = 0$$, $$a = 2$$, $$b = 0$$이면 $$y_3 = (2 \cdot 1)^2 = 4$$인데 $$2y_1 = 2$$다. 비선형이다.

**예제 1.19** $$y[n] = \mathrm{Re}\{x[n]\}$$[^6]

- 덧셈성은 만족한다. 실수부끼리 더해지기 때문이다.
- 동차성을 복소수 $$a = j$$로 시험한다. $$x_1 = r + js$$($$r$$, $$s$$는 실수 신호)이면 $$y_1 = r$$이다.
- $$x_2 = jx_1 = -s + jr$$이면 $$y_2 = -s$$인데, $$jy_1 = jr$$이다. 둘이 다르므로 비선형이다.
- 동차성의 $$a$$가 "임의의 복소수"라는 조건이 결론을 바꾼다. 입력과 $$a$$를 실수로만 제한하면 이 시스템은 선형으로 판정된다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 입력과 무작위 계수로 중첩을 시험해 예제 1.17·누산기·지연기(선형), 1.18·$$\sin x$$·$$2x+3$$(비선형), 1.19(실수 계수로는 통과, $$j$$배에서 실패)를 판정하고 예제 수치(4 ≠ 2, 16 ≠ 13)와 증분 선형 관계를 확인 — [17_linearity_verify.py](/Hongs_Blog/studies/signals-and-systems/code/17_linearity_verify/)</div>

</div>


단계별 연습: [시스템 성질 판별 예제 사다리](/Hongs_Blog/studies/signals-and-systems/system-properties-ladder/)

## 활용

- 선형이고 시불변이면(LTI) 입력을 임펄스 조각들로 나눠 각 조각의 응답을 더하는 컨벌루션으로 출력을 구한다. 2장의 출발점이다.
- 회로 이론의 중첩 원리(전원이 여럿이면 하나씩 켜고 결과를 더한다)가 이 성질이다[^s1].
- 진자처럼 원래 비선형인 시스템도 작은 움직임에서는 $$\sin\theta \approx \theta$$로 선형화해 다룬다 → [1계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/first-order-linear-ode/)

## 연결

- 선수: [시스템과 시스템 연결](/Hongs_Blog/studies/signals-and-systems/systems-interconnection/)
- 같은 구조: [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/) (선형변환의 정의 $$T(a\mathbf{u} + b\mathbf{v}) = aT(\mathbf{u}) + bT(\mathbf{v})$$와 같다)
- 짝: [시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$y = 2x + 3$$은 그래프가 직선이니 선형이다."</div>

틀렸다. 고등학교에서 "1차 함수 = 직선 = 선형"이라 배워서 그럴듯하다. 시스템의 선형성은 중첩을 뜻하고, 상수항 3이 중첩을 깨뜨린다. 확인: 입력 2와 3의 출력 합은 16, 입력 5의 출력은 13이다. 이런 시스템은 증분 선형이라 부른다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"식에 $$t$$가 곱해져 있으면 비선형이다."</div>

틀렸다. $$y = tx(t)$$는 선형이다. 선형성은 입력 $$x$$에 대해 1차인지를 본다. $$t$$는 시간에 따라 정해진 계수일 뿐이다. 시각이 식에 들어간 것은 시불변성을 깨는 문제다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 선형 시스템의 정의를 덧셈성과 동차성으로 쓰고, 한 식으로 합쳐 쓰라.</summary>

**답:** $$x_1 + x_2 \to y_1 + y_2$$, $$ax_1 \to ay_1$$ (임의의 복소수 $$a$$). 합치면 $$ax_1 + bx_2 \to ay_1 + by_2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 선형인가? ① $$y[n] = x[n] + x[n-1]$$ ② $$y(t) = x(t) + 1$$ ③ $$y(t) = x(t)\cos t$$ ④ $$y[n] = \vert x[n]\vert $$</summary>

**답:** ① 선형 ② 비선형 (입력 0에 출력 1) ③ 선형 ④ 비선형 ($$a = -1$$이면 $$\vert -x\vert  \ne -\vert x\vert $$)

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 덧셈성은 만족하지만 동차성을 깨는 시스템의 예와 깨지는 입력을 들라.</summary>

**답:** $$y[n] = \mathrm{Re}\{x[n]\}$$. $$x = 1$$, $$a = j$$면 $$ax = j$$의 출력은 0인데 $$ay = j$$다. (또는 $$y = x^*$$(켤레): $$a = j$$에서 $$(jx)^* = -jx^* \ne jx^*$$.)

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 선형 시스템이 반드시 "입력 0 → 출력 0"이어야 하는 이유는? 이것으로 무엇을 빨리 판정할 수 있는가?</summary>

**답:** 동차성에 $$a = 0$$을 넣으면 나온다. 그래서 0을 넣어 출력이 0이 아니면(예: $$2x + 3$$, $$x + 1$$) 계산 없이 바로 비선형이다. 단, 0에 0이 나온다고 선형인 것은 아니다($$x^2$$).

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.24 (예제 1.20)
[^2]: 같은 자료, p.19, p.21
[^3]: 같은 자료, p.21~22 (예제 1.17, 1.18)
[^4]: 같은 자료, p.20
[^5]: 같은 자료, p.25 (그림 1.48)
[^6]: 같은 자료, p.23 (예제 1.19)
[^s1]: 에이전트 보충. 실수 계수로 제한하면 예제 1.19가 선형이 된다는 점, 회로의 중첩 원리, 스스로 설명해 보기의 2·핵심 아이디어, 오해 항목, 확인 문제 C2~C4는 원본에 없다. 판정은 검증 코드로 확인했다.
{% endraw %}
