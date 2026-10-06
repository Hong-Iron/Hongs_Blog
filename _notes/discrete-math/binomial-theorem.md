---
layout: "note"
title: "이항정리"
display_title: "이항정리 (Binomial Theorem)"
kind: "concept"
kind_label: "정리"
num: "18"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Binomial Theorem", "이항정리", "이항계수", "binomial coefficient", "파스칼 삼각형", "Pascal's triangle", "조합적 증명", "combinatorial proof", "방데르몽드 항등식", "Vandermonde's identity"]
description: "(x + y)를 n번 곱해 전개하면, 괄호 n개 중 x를 몇 개의 괄호에서 고르느냐에 따라 항이 정해진다. 그래서 각 항의 계수가 \"n개 중 k개를 고르는 수\"이고, 파스칼 삼각형의 한 줄이 곧 전개식의 계수다. 같은 것을 두 가지로 세어 등식을 얻는 조합적 증명의 대표 예이기도 …"
prev_url: "/studies/discrete-math/counting-formula-choice/"
prev_title: "순열·조합·중복조합 비교"
next_url: "/studies/discrete-math/inclusion-exclusion/"
next_title: "포함-배제 원리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/binomial-theorem/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

(x + y)를 n번 곱해 전개하면, 괄호 n개 중 x를 몇 개의 괄호에서 고르느냐에 따라 항이 정해진다. 그래서 각 항의 계수가 "n개 중 k개를 고르는 수"이고, 파스칼 삼각형의 한 줄이 곧 전개식의 계수다. 같은 것을 두 가지로 세어 등식을 얻는 조합적 증명의 대표 예이기도 하다. x와 y에 1이나 −1을 넣으면 부분집합의 수 같은 셈 공식이 한 줄로 나온다.

</div>


## 예시로 보기

$$(x + y)^3 = (x + y)(x + y)(x + y)$$를 전개하면, 괄호 셋에서 각각 $$x$$나 $$y$$ 하나를 골라 곱한 $$2^3 = 8$$개 항이 나온다. $$x^2 y$$가 되는 것은 $$y$$를 고를 괄호 하나를 정하는 방법 $$\binom{3}{1} = 3$$가지($$xxy$$, $$xyx$$, $$yxx$$)다.

$$(x + y)^3 = x^3 + 3x^2y + 3xy^2 + y^3$$


계수 1, 3, 3, 1은 파스칼 삼각형의 넷째 줄이다. 파스칼 삼각형은 위의 두 수를 더해 아래 수를 만든다([파스칼 항등식](/Hongs_Blog/studies/discrete-math/permutations-combinations/)).

```
        1
       1 1
      1 2 1
     1 3 3 1
    1 4 6 4 1
  1 5 10 10 5 1
```

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">이항정리</div>

정수 $$n \ge 0$$과 수 $$x$$, $$y$$에 대해[^1]

$$(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k$$

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

*조합적 증명:* $$(x + y)^n$$을 전개하면 괄호 $$n$$개에서 $$x$$나 $$y$$를 하나씩 골라 곱한 항들의 합이다. $$x^{n-k}y^k$$는 $$y$$를 고를 괄호 $$k$$개를 정하는 방법만큼, 즉 $$\binom{n}{k}$$번 나온다.

*귀납적 증명:* $$n = 0$$이면 $$1 = 1$$. $$n$$에서 맞으면 $$(x+y)^{n+1} = (x+y)\sum_k \binom{n}{k}x^{n-k}y^k$$를 전개해 $$x^{n+1-k}y^k$$의 계수를 모으면 $$\binom{n}{k} + \binom{n}{k-1} = \binom{n+1}{k}$$(파스칼 항등식)다. ∎

</details>


$$x$$와 $$y$$에 특별한 값을 넣으면 항등식이 나온다.

| 대입 | 결과 | 뜻 |
|---|---|---|
| $$x = y = 1$$ | $$\sum_k \binom{n}{k} = 2^n$$ | 부분집합의 총수 |
| $$x = 1, y = -1$$ ($$n \ge 1$$) | $$\sum_k (-1)^k\binom{n}{k} = 0$$ | 짝수 크기 부분집합 수 = 홀수 크기 부분집합 수 |
| 양변을 $$y$$로 미분 후 $$x = y = 1$$ | $$\sum_k k\binom{n}{k} = n2^{n-1}$$ | 모든 부분집합의 크기의 합 |

**방데르몽드 항등식** $$\sum_{j} \binom{m}{j}\binom{n}{k-j} = \binom{m+n}{k}$$도 조합적으로 증명된다. 남자 $$m$$명, 여자 $$n$$명에서 $$k$$명을 뽑는 방법을 "남자를 몇 명 뽑았는가"로 나눠 센다.

## 예제

$$(2x - 1)^5$$에서 $$x^3$$의 계수를 구한다.

1. *이항정리의 틀에 맞추기:* $$x$$ 자리에 $$2x$$, $$y$$ 자리에 $$-1$$을 넣은 $$(2x + (-1))^5$$.
2. *해당 항 고르기:* $$x^3$$은 $$(2x)^3(-1)^2$$, 즉 $$k = 2$$인 항 $$\binom{5}{2}(2x)^3(-1)^2$$.
3. *계산:* $$10 \cdot 8 \cdot 1 = 80$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$(1+x)^n$$을 직접 곱해 $$n \le 20$$에서 계수 비교, 표의 세 항등식과 방데르몽드, 예제의 80, 짝수 개 1인 비트열 수 — [18_binomial-theorem_verify.py](/Hongs_Blog/studies/discrete-math/code/18_binomial-theorem_verify/)</div>

</div>


## 활용

- **확률.** 성공 확률 $$p$$인 시도를 $$n$$번 할 때 성공이 $$k$$번일 확률 $$\binom{n}{k}p^k(1-p)^{n-k}$$의 합이 $$(p + (1 - p))^n = 1$$이 되는 것이 이항정리다(확률과 통계의 [이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)).
- **패리티.** 1이 짝수 개인 $$n$$비트 문자열은 $$2^{n-1}$$개로 정확히 절반이다($$x = 1, y = -1$$ 대입). 패리티 비트 하나로 오류 한 개를 감지할 수 있는 이유와 이어진다.
- **어림.** $$(1 + 0.01)^{100} = 1 + 100(0.01) + \binom{100}{2}(0.01)^2 + \cdots = 1 + 1 + 0.495 + \cdots$$처럼 앞의 몇 항으로 값을 어림한다.
- 알고리즘에서: 부분집합을 크기별로 `combinations`로 만들어도, 비트마스크로 한꺼번에 돌아도 보는 부분집합은 모두 $$2^n$$개다([완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)). [메뉴 리뉴얼](/Hongs_Blog/studies/algorithms/pg72411/)에서는 주문이 10글자 이하라, 한 주문의 조합을 크기별로 다 합쳐도 $$2^{10} = 1{,}024$$개 이하다.

## 연결

- 선수: [순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/), [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)
- 이어지는 개념: [포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/)(증명에 $$\sum (-1)^k\binom{m}{k} = 0$$을 쓴다), [생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (2x − 1)⁵을 전개했을 때 x³의 계수를 구하라.</summary>

**답:** $$\binom{5}{2}(2)^3(-1)^2 = 80$$.

**흔한 오답:** $$2^3$$을 빼먹고 $$\binom{5}{3} = 10$$으로 답하는 것. 계수에는 $$2x$$의 2도 거듭제곱되어 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** Σₖ C(n, k) = 2ⁿ을 (가) 이항정리로 (나) 조합적으로 증명하라.</summary>

**답:** (가) $$(1 + 1)^n$$에 이항정리를 쓴다. (나) $$n$$원소 집합의 부분집합을 크기별로 세면 왼쪽, 원소마다 넣을지 뺄지 곱의 법칙으로 세면 $$2^n$$이다. 같은 것을 두 가지로 셌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 파스칼 삼각형의 여섯째 줄(1 5 10 10 5 1)이 (x + y)⁵의 계수라는 것을, "위의 두 수를 더한다"는 규칙과 전개식으로 연결해 설명하라.</summary>

**답:** $$(x+y)^5 = (x+y)(x+y)^4$$에서 $$x^{5-k}y^k$$는 $$(x+y)^4$$의 $$x^{4-k}y^k$$에 $$x$$를 곱한 것과 $$x^{5-k}y^{k-1}$$에 $$y$$를 곱한 것 두 곳에서 온다. 그래서 계수는 윗줄의 이웃한 두 계수의 합이다. 이것이 파스칼 항등식 $$\binom{5}{k} = \binom{4}{k} + \binom{4}{k-1}$$이다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 11.6절 "Binomial Theorem". 조합적 증명과 방데르몽드 항등식은 Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장.
{% endraw %}
