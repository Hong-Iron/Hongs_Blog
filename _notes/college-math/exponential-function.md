---
layout: "note"
title: "지수함수"
display_title: "지수함수 (Exponential Function)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Exponential Function", "지수적 성장", "exponential growth", "지수적 감소", "exponential decay", "자연상수", "e", "오일러 수", "Euler's number", "자연지수함수", "exp", "연속 복리"]
description: "종이를 반으로 접을 때마다 두께가 두 배가 되듯, 같은 간격마다 같은 비율로 곱해지는 양을 나타내는 함수다. 더하는 성장이 아니라 곱하는 성장이라, 처음에는 느려 보여도 결국 어떤 다항식보다 빨리 커진다. 비율이 1보다 크면 늘고 1보다 작으면 줄어든다. 곱하는 수는 양수이고 1이…"
prev_url: "/studies/college-math/exponent-laws/"
prev_title: "거듭제곱과 지수법칙"
next_url: "/studies/college-math/logarithm/"
next_title: "로그"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/exponential-function/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

종이를 반으로 접을 때마다 두께가 두 배가 되듯, 같은 간격마다 같은 **비율**로 곱해지는 양을 나타내는 함수다. 더하는 성장이 아니라 곱하는 성장이라, 처음에는 느려 보여도 결국 어떤 다항식보다 빨리 커진다. 비율이 1보다 크면 늘고 1보다 작으면 줄어든다. 곱하는 수는 양수이고 1이 아니어야 한다.

</div>


## 예시로 보기

두께 0.1 mm인 종이를 반으로 접을 때마다 두께가 두 배가 된다. $$n$$번 접은 두께는 $$0.1 \times 2^n$$ mm다.

| 접은 횟수 $$n$$ | 0 | 10 | 20 | 42 |
|---|---|---|---|---|
| 두께 | 0.1 mm | 10.24 cm | 약 104.9 m | 약 439,805 km |

42번이면 지구에서 달까지의 평균 거리(약 384,400 km)를 넘는다. 매번 "지금 두께만큼 더하는" 성장이라서 더할 양이 점점 커진다. 여기서 처음 두께 0.1이 아래 정의의 $$a$$, 두 배가 밑 $$b$$, 접은 횟수가 $$x$$다. 실제 종이는 몇 번 못 접으니, 이 표는 곱하는 성장의 크기를 보는 사고 실험이다.

같은 간격이 같은 비율을 낳는다는 점이 선형 성장과의 차이다.

| $$x$$ | 0 | 1 | 2 | 3 | 이웃한 값의 관계 |
|---|---|---|---|---|---|
| 선형 $$5 + 5x$$ | 5 | 10 | 15 | 20 | 늘 **5를 더함** |
| 지수 $$5 \cdot 2^x$$ | 5 | 10 | 20 | 40 | 늘 **2를 곱함** |

**자연상수 $$e$$.** 연이율 100%를 1년에 $$n$$번 나눠 복리로 붙이면 1원이 $$(1 + 1/n)^n$$원이 된다.

| $$n$$ | 1 | 2 | 12 (매달) | 365 (매일) | $$10^6$$ |
|---|---|---|---|---|---|
| $$(1 + 1/n)^n$$ | 2 | 2.25 | 2.61304 | 2.71457 | 2.71828 |

아무리 잘게 나눠도 어떤 값을 넘지 못하고 그 값에 다가간다. 그 값이 $$e = 2.71828\ldots$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

실수 $$a \ne 0$$, $$b > 0$$, $$b \ne 1$$에 대해 $$f(x) = a \cdot b^x$$ ($$x \in \mathbb{R}$$)를 **지수함수**라 한다[^1]. $$b$$를 밑이라 한다.
- $$a > 0$$이면 치역은 $$(0, \infty)$$다. 값은 늘 양수이고 $$0$$이 되지 않는다.
- $$b > 1$$이면 순증가(지수적 성장), $$0 < b < 1$$이면 순감소(지수적 감소)다.
- 간격 $$h$$마다 비율이 일정하다: $$\dfrac{f(x + h)}{f(x)} = b^h$$ ($$x$$와 무관).

무리수 지수 $$b^{\sqrt2}$$는 $$b^{1.4}, b^{1.41}, b^{1.414}, \dots$$처럼 유리수 지수 값이 다가가는 극한으로 정한다[^1]. [증명 생략: 극한이 존재하고 지수법칙이 유지된다는 것은 미분적분학의 결과]

**자연상수** $$e = \displaystyle\lim_{n \to \infty}\left(1 + \frac1n\right)^n \approx 2.718281828$$($$\lim$$은 한없이 가까이 갈 때 다가가는 값(극한))이고, $$e^x$$를 자연지수함수라 하며 $$\exp(x)$$로도 쓴다[^1].

</div>


**설계 이유.** 밑의 조건은 모두 이유가 있다.
- $$b = 1$$이면 $$1^x = 1$$로 상수함수다. 성장도 감소도 없고, 되돌릴 수 없어 로그를 정의할 수 없다.
- $$b < 0$$이면 $$(-2)^{1/2}$$처럼 실수가 아닌 값이 생겨 실수 전체에서 정의되지 않는다.
- $$b = 0$$이면 $$0^x$$는 $$x \le 0$$에서 정의되지 않는다.

**동치인 다른 정의.** 같은 함수를 다른 성질로 정할 수도 있다.

| 정의 | 근거 |
|---|---|
| 연속이고 $$f(x + y) = f(x)\,f(y)$$, $$f(1) = b > 0$$인 함수 | 아래 증명 스케치. "더하기를 곱하기로 바꾸는 함수"가 지수함수뿐이다 |
| $$e^x = \displaystyle\lim_{n\to\infty}\left(1 + \frac{x}{n}\right)^n$$ | $$x = 1$$이 위의 복리 표다. [증명 생략: [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/)] |
| $$e^x = 1 + x + \dfrac{x^2}{2!} + \dfrac{x^3}{3!} + \cdots$$ | [증명 생략: [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)] |
| $$e$$는 $$x = 0$$에서 $$b^x$$ 그래프의 기울기가 정확히 1인 밑 | 수치로: 기울기가 $$b = 2$$에서 0.6931, $$b = 3$$에서 1.0986, $$b = e$$에서 1.0000. [증명 생략: [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)] |

**해당하는 예:** $$2^x$$, $$\left(\tfrac12\right)^x = 2^{-x}$$, $$3e^{0.5x}$$. **해당하지 않는 예:** $$x^2$$(변수가 밑에 있는 거듭제곱함수), $$1^x$$(밑이 1이라 상수), $$(-2)^x$$(실수 전체에서 정의되지 않음).

## 증명

"더하기를 곱하기로 바꾸는 연속 함수는 지수함수다"를 보인다. 정수, 유리수, 실수 순서로 넓혀 간다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기 [증명 스케치]</summary>

연속이고 $$f(x + y) = f(x) f(y)$$이며 $$f(1) = b > 0$$이라 하자.

{: start="0"}
0. *어디서도 0이 아니고 양수:* 어떤 $$c$$에서 $$f(c) = 0$$이면 모든 $$x$$에서 $$f(x) = f(c) f(x - c) = 0$$이 되어 $$f(1) = b > 0$$과 모순이다. 또 $$f(x) = f(x/2)^2 \ge 0$$이므로 $$f(x) > 0$$이다.
1. *양의 정수:* $$f(n) = f(1 + \cdots + 1) = f(1)^n = b^n$$. — 성질을 $$n - 1$$번 적용
2. *0과 음의 정수:* $$f(0) = f(0 + 0) = f(0)^2$$이고 $$f(0) > 0$$이므로 $$f(0) = 1$$. $$f(-n) f(n) = f(0) = 1$$이므로 $$f(-n) = b^{-n}$$.
3. *역수 꼴 유리수:* $$f(1/q)^q = f(1/q + \cdots + 1/q) = f(1) = b$$이고 0단계에서 $$f(1/q) > 0$$이다. 따라서 $$f(1/q) = b^{1/q}$$(양의 $$q$$제곱근).
4. *유리수:* $$f(p/q) = f(1/q)^p = b^{p/q}$$. — 1과 같은 방법
5. *실수:* 모든 실수는 유리수의 극한이고 $$f$$와 $$b^x$$가 모두 연속이므로, 유리수에서 같은 두 함수는 실수 전체에서 같다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. "f(x + h)/f(x) = bʰ은 x와 무관하다"는 어디서 나오나?</summary>

지수법칙 $$b^{x+h} = b^x b^h$$에서 $$\dfrac{a\,b^{x+h}}{a\,b^x} = b^h$$다. $$x$$가 약분되어 사라진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명의 3단계에서 f(1/q)가 양수라는 것은 왜 필요한가?</summary>

$$f(1/q)^q = b$$를 만족하는 수는 $$q$$가 짝수면 양수와 음수 두 개다. 0단계의 $$f(x) = f(x/2)^2 > 0$$으로 양수 쪽을 골라야 $$b^{1/q}$$와 같아진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

성질 하나($$f(x+y) = f(x)f(y)$$)를 정수 → 유리수 → 실수로 차례로 넓힌다. 마지막 단계는 연속성이 메운다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓸 수 있는 다른 상황은?</summary>

"더하기를 더하기로 바꾸는 연속 함수 $$f(x + y) = f(x) + f(y)$$는 $$f(x) = cx$$뿐이다"도 같은 순서로 증명된다. [로그](/Hongs_Blog/studies/college-math/logarithm/)는 거꾸로 "곱하기를 더하기로 바꾸는" 함수다.

</details>


## 예제

**두 점으로 지수함수 정하기.** $$f(1) = 6$$, $$f(3) = 54$$인 $$f(x) = a \cdot b^x$$를 구한다.

1. *비율 구하기:* $$\dfrac{f(3)}{f(1)} = b^2 = 9$$. $$b > 0$$이므로 $$b = 3$$.
2. *처음 값 구하기:* $$a \cdot 3 = 6$$에서 $$a = 2$$.
3. *확인:* $$f(x) = 2 \cdot 3^x$$, $$f(3) = 2 \cdot 27 = 54$$.

**곱하는 성장과 더하는 성장.** 사용자 100명에서 시작해 (가) 매달 20%씩 늘거나 (나) 매달 20명씩 는다.

1. *식 세우기:* (가) $$100 \cdot 1.2^t$$, (나) $$100 + 20t$$.
2. *12개월 뒤:* (가) $$100 \cdot 1.2^{12} \approx 891.6$$명, (나) $$340$$명.
3. *해석:* 첫 달에는 둘 다 120명으로 같다. 곱하는 성장은 불어난 사용자에게 다시 20%가 붙어 격차가 계속 벌어진다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 종이 접기와 복리 표, 기울기 0.6931·1.0000·1.0986, 두 예제, 카드 C2~C4, 오해의 교차점 — [06_exponential-function_verify.py](/Hongs_Blog/studies/college-math/code/06_exponential-function_verify/)</div>

</div>


## 활용

- **지수 시간 알고리즘.** 원소 $$n$$개의 부분집합을 모두 검사하면 $$2^n$$가지다. 초당 $$10^9$$개를 검사해도 $$n = 50$$이면 약 13일, $$n = 60$$이면 약 36.5년이다. 입력이 10 늘 때마다 시간이 약 1000배가 된다.
- **지수 백오프.** 네트워크에서 충돌이나 실패 뒤 재시도 대기 시간을 1, 2, 4, 8, … 단위로 두 배씩 늘린다. 몰린 요청이 빠르게 흩어진다[^s1].
- **오버플로.** 배정밀도에서 `math.exp(709)`는 약 $$8.2 \times 10^{307}$$이지만 `math.exp(710)`은 `OverflowError`다. 소프트맥스처럼 $$e^x$$를 쓰는 계산은 큰 값을 먼저 빼서 이 문제를 피한다[^s1].
- 방사성 붕괴, 신호 감쇠, 학습률 감소처럼 일정한 비율로 줄어드는 양은 밑이 1보다 작은 지수함수로 나타낸다.
- 알고리즘에서: 부분집합 $$2^n$$개를 모두 도는 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)은 $$2^{20} \approx 10^6$$이라 n이 20 안팎일 때까지만 쓴다.

## 연결

- 선수: [거듭제곱과 지수법칙](/Hongs_Blog/studies/college-math/exponent-laws/), [함수](/Hongs_Blog/studies/college-math/function/)
- 이어지는 개념: [로그](/Hongs_Blog/studies/college-math/logarithm/)(지수함수의 역함수), [거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/)
- $$a \cdot b^{x}$$의 $$a$$는 [함수의 변환](/Hongs_Blog/studies/college-math/function-transformation/)의 세로 배율이다.
- 이산 버전은 [등비수열](/Hongs_Blog/studies/college-math/geometric-series/)이다. 복소수 지수 $$e^{i\theta}$$는 [오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)에서 회전이 된다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"지수적 성장은 처음부터 빠르다"</div>

틀렸다. 뉴스에서 "지수적으로 늘었다"를 "폭발적으로 늘었다"는 뜻으로 써서 그렇게 느껴진다. 지수적 성장의 정의는 같은 간격마다 같은 비율로 곱해지는 것이지, 처음부터 빠른 것이 아니다. $$1.01^x$$와 $$10x$$를 비교하면 $$x = 100$$에서 $$2.70$$ 대 $$1000$$으로 지수 쪽이 훨씬 작다. 그런데 $$x = 917$$에서 역전하고, 그 뒤로는 격차가 끝없이 벌어진다. 초기에 느리다고 지수적 성장이 아니라고 판단하면 늦는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 지수함수 f(x) = a·bˣ에서 밑 b의 조건을 쓰고, 각 조건이 왜 필요한지 설명하라.</summary>

**답:** $$b > 0$$이고 $$b \ne 1$$이다. $$b = 1$$이면 상수함수라 성장·감소가 없고 역함수(로그)도 없다. $$b < 0$$이면 $$(-2)^{1/2}$$처럼 실수로 정의되지 않는 값이 생긴다. $$b = 0$$이면 $$x \le 0$$에서 정의되지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 표의 y는 x에 대해 선형인가, 지수인가, 둘 다 아닌가? x = 0, 1, 2, 3일 때 (가) 5, 10, 20, 40 (나) 5, 10, 15, 20 (다) 5, 10, 17, 26</summary>

**답:** (가) 지수. 이웃 비율이 늘 2이므로 $$5 \cdot 2^x$$. (나) 선형. 이웃 차이가 늘 5이므로 $$5 + 5x$$. (다) 둘 다 아니다. 차이가 5, 7, 9로 늘고 비율도 일정하지 않다. 차이의 차이가 2로 일정한 이차식 $$x^2 + 4x + 5$$다.

**흔한 오답:** (가)와 (다)를 둘 다 "빨리 느니 지수"라고 하는 것. 지수인지는 빠르기가 아니라 비율이 일정한지로 판정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** f(0) = 3, f(2) = 12인 지수함수 f(x) = a·bˣ를 구하고 f(5)를 계산하라.</summary>

**답:** $$a = f(0) = 3$$. $$b^2 = 12/3 = 4$$이고 $$b > 0$$이므로 $$b = 2$$. $$f(x) = 3 \cdot 2^x$$, $$f(5) = 96$$.

**흔한 오답:** $$b = \pm 2$$로 두는 것. 밑은 양수여야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 부분집합 2ⁿ개를 초당 10⁹개씩 검사한다. n = 50과 n = 60에서 걸리는 시간을 어림하라.</summary>

**답:** $$2^{50} \approx 1.13 \times 10^{15}$$이므로 $$1.13 \times 10^6$$초, 약 13일. $$2^{60} = 2^{10} \cdot 2^{50}$$이므로 그 1024배인 약 36.5년.

**흔한 오답:** $$n$$이 50에서 60으로 20% 늘었으니 시간도 20%쯤 는다고 보는 것. 지수 시간에서는 입력이 10 늘면 시간이 $$2^{10}$$배가 된다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 4.1절 "Exponential Functions"(정의, 밑의 조건, 연속 복리와 $$e$$), 4.2절 "Graphs of Exponential Functions"
[^s1]: 에이전트 보충. 지수 백오프는 이더넷의 충돌 뒤 재전송 등에 쓰이는 방식이다(Kurose & Ross, *Computer Networking*, 6장 다중 접근 프로토콜). 소프트맥스에서 최댓값을 빼는 기법은 수치 계산의 표준 기법이다. `math.exp`의 경계(709와 710)는 검증 코드로 확인했다.
{% endraw %}
