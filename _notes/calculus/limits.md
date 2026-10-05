---
layout: "note"
title: "극한"
display_title: "극한 (Limit)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Limit", "극한", "극한값", "입실론-델타", "epsilon-delta", "한쪽 극한", "one-sided limit", "좌극한", "우극한", "극한 법칙", "limit laws", "조임 정리", "squeeze theorem"]
description: "극한은 입력이 어떤 값에 한없이 다가갈 때 출력이 다가가는 값이다. 그 점에서의 함숫값과는 상관이 없어서, 0 나누기 0처럼 계산이 안 되는 곳에서도 \"다가가는 값\"은 말할 수 있다. 미분과 적분이 모두 극한으로 정의된다. 다만 왼쪽과 오른쪽에서 다가가는 값이 다르거나, 출력이 한…"
next_url: "/studies/calculus/continuity/"
next_title: "연속과 사잇값 정리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/limits/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

극한은 입력이 어떤 값에 한없이 다가갈 때 출력이 다가가는 값이다. 그 점에서의 함숫값과는 상관이 없어서, 0 나누기 0처럼 계산이 안 되는 곳에서도 "다가가는 값"은 말할 수 있다. 미분과 적분이 모두 극한으로 정의된다. 다만 왼쪽과 오른쪽에서 다가가는 값이 다르거나, 출력이 한없이 커지거나 계속 흔들리면 극한은 없다.

</div>


## 예시로 보기

$$f(x) = \dfrac{x^2 - 1}{x - 1}$$은 $$x = 1$$에서 $$0/0$$이라 값이 없다. 그 근처를 넣어 본다.

| $$x$$ | 0.9 | 0.99 | 0.999 | 1 | 1.001 | 1.01 | 1.1 |
|---|---|---|---|---|---|---|---|
| $$f(x)$$ | 1.9 | 1.99 | 1.999 | 없음 | 2.001 | 2.01 | 2.1 |

양쪽 어디서 다가가도 2에 가까워진다. $$x \ne 1$$이면 $$f(x) = \frac{(x-1)(x+1)}{x-1} = x + 1$$이라 그래프는 직선 $$y = x + 1$$에서 점 $$(1, 2)$$ 하나만 뚫린 모양이다. 뚫린 점의 높이 2가 극한이다. 여기서 1이 아래 정의의 $$a$$, 2가 $$L$$이다.

## 정의

직관적으로 $$\lim_{x \to a} f(x) = L$$은 "$$x$$를 $$a$$에 충분히 가깝게(단, $$a$$는 아니게) 하면 $$f(x)$$를 $$L$$에 원하는 만큼 가깝게 할 수 있다"는 뜻이다[^1].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">극한의 엄밀한 정의</div>

$$\lim_{x \to a} f(x) = L \iff \forall \varepsilon > 0\ \exists \delta > 0\ \forall x\ \big(0 < \vert x - a\vert  < \delta \to \vert f(x) - L\vert  < \varepsilon\big)$$

- 오른쪽 극한 $$\lim_{x \to a^+}$$는 $$a < x < a + \delta$$, 왼쪽 극한 $$\lim_{x \to a^-}$$는 $$a - \delta < x < a$$만 본다. 극한이 있을 필요충분조건은 두 한쪽 극한이 있고 같은 것이다.
- $$x \to \infty$$일 때의 극한과 $$f(x) \to \infty$$(무한대로 발산)도 같은 방식으로 정한다[^2].

</div>


**설계 이유.** 조건 $$0 < \vert x - a\vert $$는 $$x = a$$를 뺀다. 극한은 점 자체가 아니라 주변의 행동에 대한 말이기 때문이다. 한정기호 순서 $$\forall\varepsilon\,\exists\delta$$는 "상대가 오차 허용치 $$\varepsilon$$을 아무리 작게 불러도, 나는 그에 맞는 $$\delta$$를 댈 수 있다"는 게임이다([술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)). 순서를 바꾸면 전혀 다른 뜻이 된다.

**동치인 다른 정의.** $$\lim_{x \to a} f(x) = L$$은 "$$a$$로 다가가는($$a$$와 다른) 모든 수열 $$x_n$$에 대해 $$f(x_n) \to L$$"과 같다. [증명 생략: OpenStax *Calculus Volume 1* 2.5절의 범위를 넘는 해석학의 결과. 수열의 극한은 [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/)]

**해당하는 예:** $$\lim_{x \to 2}(x^2 + 1) = 5$$, $$\lim_{x \to 1}\frac{x^2 - 1}{x - 1} = 2$$, $$\lim_{x \to 0}\frac{\sin x}{x} = 1$$. **해당하지 않는 예:** $$\lim_{x \to 0}\frac{1}{x}$$(양쪽에서 $$+\infty$$와 $$-\infty$$로 달아남), $$\lim_{x \to 0}\sin\frac1x$$(0 근처에서 $$-1$$과 $$1$$ 사이를 끝없이 오감).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">극한 법칙과 조임 정리</div>

$$\lim f = L$$, $$\lim g = M$$이면 $$\lim (f \pm g) = L \pm M$$, $$\lim fg = LM$$, $$M \ne 0$$이면 $$\lim f/g = L/M$$이다. 또 $$a$$ 근처에서 $$g(x) \le f(x) \le h(x)$$이고 $$\lim g = \lim h = L$$이면 $$\lim f = L$$이다(조임 정리)[^1].

</div>


## 증명

**$$\lim_{x \to 3}(2x + 1) = 7$$을 정의로 증명한다.**

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *목표를 $$\vert x - 3\vert $$로 쓰기:* $$\vert f(x) - 7\vert  = \vert 2x - 6\vert  = 2\vert x - 3\vert $$.
2. *$$\delta$$ 고르기:* $$\varepsilon > 0$$이 주어지면 $$\delta = \varepsilon / 2$$로 둔다.
3. *확인:* $$0 < \vert x - 3\vert  < \delta$$이면 $$\vert f(x) - 7\vert  = 2\vert x - 3\vert  < 2\delta = \varepsilon$$. ∎

**$$\lim_{x \to 0}\frac{\sin x}{x} = 1$$** [증명 스케치]: 단위원에서 넓이를 비교하면 $$0 < \vert x\vert  < \pi/2$$에서 $$\cos x \le \frac{\sin x}{x} \le 1$$이다. $$x \to 0$$이면 $$\cos x \to 1$$이므로 조임 정리로 1이다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명의 2단계에서 δ = ε/2가 "먼저 ε을 받고 나서" 정해지는 것은 왜 중요한가?</summary>

정의가 $$\forall\varepsilon\,\exists\delta$$ 순서라서 $$\delta$$는 $$\varepsilon$$에 따라 달라져도 된다. 모든 $$\varepsilon$$에 통하는 $$\delta$$ 하나를 먼저 정하라는 요구가 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 조임 정리로 sin x / x → 1을 얻을 때 부등식이 x = 0에서 성립할 필요가 없는 이유는?</summary>

극한은 $$0 < \vert x - a\vert $$인 곳만 보기 때문이다. $$x = 0$$에서 $$\frac{\sin x}{x}$$는 정의조차 되지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정의의 핵심 아이디어는?</summary>

"한없이 가까워진다"는 모호한 말을 "어떤 오차 허용치에도 맞출 수 있다"는 유한한 약속들의 모음으로 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 형식을 쓰는 다른 상황은?</summary>

[수열의 극한](/Hongs_Blog/studies/calculus/sequence-limits/)은 $$\forall\varepsilon\,\exists N$$, 이산수학의 [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)는 $$\exists c\,\exists n_0\,\forall n \ge n_0$$ 꼴로 같은 게임을 한다.

</details>


## 예제

$$\lim_{x \to 0}\frac{\sin 3x}{x}$$를 구한다.

1. *알고 있는 모양 만들기:* $$\frac{\sin 3x}{x} = 3 \cdot \frac{\sin 3x}{3x}$$.
2. *바꿔 부르기:* $$u = 3x$$로 두면 $$x \to 0$$일 때 $$u \to 0$$.
3. *극한 법칙:* $$3 \cdot \lim_{u \to 0}\frac{\sin u}{u} = 3 \cdot 1 = 3$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표, $$\sin x/x$$와 $$\sin 3x/x$$, $$\delta = \varepsilon/2$$를 무작위 2만 번 확인, 부호 함수와 $$\sin(1/x)$$, 부동소수점의 한계, 조임 부등식, 오해의 함수 — [01_limits_verify.py](/Hongs_Blog/studies/calculus/code/01_limits_verify/)</div>

</div>


## 활용

- **미분과 적분의 정의.** 순간 변화율(도함수)과 넓이(적분)가 모두 극한이다.
- **부동소수점은 한없이 다가가지 못한다.** `1 + 1e-17 == 1.0`이 참이다. 실수는 연속이지만 컴퓨터의 수는 띄엄띄엄 있어서, 극한을 "아주 작은 $$h$$를 넣어 계산"하려 하면 어느 순간부터 오차가 커진다([도함수](/Hongs_Blog/studies/calculus/derivative/)의 수치 미분).
- **신호 처리.** $$\frac{\sin x}{x}$$(싱크 함수)는 이상적인 저역 통과 필터와 표본에서 신호를 복원하는 공식에 나온다. $$x = 0$$에서의 값은 극한값 1로 정한다[^s1].

## 연결

- 선수: [함수](/Hongs_Blog/studies/college-math/function/)
- 이어지는 개념: [연속](/Hongs_Blog/studies/calculus/continuity/), [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/), [도함수](/Hongs_Blog/studies/calculus/derivative/)
- 한정기호의 순서: [술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"극한값은 그 점의 함숫값이다"</div>

틀렸다. 다항식처럼 흔히 보는 함수는 극한값과 함숫값이 같아서 그렇게 느껴진다. 하지만 극한은 $$x = a$$ 자체를 보지 않는다. $$x \ne 0$$이면 $$x^2$$, $$x = 0$$이면 5인 함수는 0 근처에서 값이 0에 다가가므로 극한은 0이지만 함숫값은 5다. 함숫값이 아예 없는 $$\frac{x^2 - 1}{x - 1}$$도 $$x = 1$$에서 극한 2를 가진다. 둘이 같은 경우를 따로 이름 붙인 것이 [연속](/Hongs_Blog/studies/calculus/continuity/)이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\lim_{x \to a} f(x) = L$$의 ε-δ 정의를 쓰고, $$0 < \vert x - a\vert $$ 조건이 왜 있는지 설명하라.</summary>

**답:** 모든 $$\varepsilon > 0$$에 대해 어떤 $$\delta > 0$$이 있어, $$0 < \vert x - a\vert  < \delta$$인 모든 $$x$$에서 $$\vert f(x) - L\vert  < \varepsilon$$. $$0 < \vert x - a\vert $$는 $$x = a$$를 빼서, 그 점의 값(또는 값이 없음)이 극한에 영향을 주지 않게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\lim_{x \to 1} \frac{x^2 - 1}{x - 1}$$과 $$\lim_{x \to 0} \frac{\sin 3x}{x}$$를 구하라.</summary>

**답:** 2와 3. 첫째는 약분해 $$x + 1$$로 만든 뒤 $$x = 1$$을 넣고, 둘째는 $$3 \cdot \frac{\sin 3x}{3x}$$로 바꾼다.

**흔한 오답:** 둘째를 1이라고 하는 것. $$\frac{\sin u}{u} \to 1$$은 사인 안의 $$u$$와 분모의 $$u$$가 같을 때만 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** x → 0에서 극한이 없는 함수를 두 가지 이유로 하나씩 들라.</summary>

**답:** 한쪽 극한이 다름: 부호 함수(왼쪽 $$-1$$, 오른쪽 $$1$$). 계속 흔들림: $$\sin\frac1x$$(0 근처에서 $$1$$과 $$-1$$을 끝없이 오간다). ($$\frac1x$$처럼 무한대로 가는 것도 유한한 극한이 없다.)

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$\lim_{x \to 3} (2x + 1) = 7$$을 ε-δ로 증명하라.</summary>

**답:** $$\vert f(x) - 7\vert  = 2\vert x - 3\vert $$이다. 주어진 $$\varepsilon$$에 $$\delta = \varepsilon/2$$를 고르면 $$0 < \vert x - 3\vert  < \delta$$일 때 $$\vert f(x) - 7\vert  < 2\delta = \varepsilon$$.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 2.2절 "The Limit of a Function", 2.3절 "The Limit Laws"(조임 정리, $$\sin x / x$$)
[^2]: OpenStax, *Calculus Volume 1*, 2.5절 "The Precise Definition of a Limit"
[^s1]: 에이전트 보충. 싱크 함수와 표본화 정리(휘태커-섀넌 보간)는 신호 처리의 표준 내용이다.
{% endraw %}
