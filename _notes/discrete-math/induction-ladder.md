---
layout: "note"
title: "귀납법 증명 예제 사다리"
display_title: "귀납법 증명 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "12"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 수학적 귀납법."
next_url: "/studies/discrete-math/counting-ladder/"
next_title: "경우의 수 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/discrete-math/induction-ladder/"
---
{% raw %}
사용 개념: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/).

이 방법을 떠올리는 신호는 **"모든 자연수 n에 대해"와 함께, n에서 n+1로 식이 이어지는 구조**다. 합의 공식, "n ≥ n₀이면" 부등식, 나누어떨어짐이 대표적이다. 증명은 늘 같은 다섯 하위목표로 쓴다[^1].

1. *명제와 시작점 적기:* $$P(n)$$을 한 줄로 쓰고, 어디서부터인지($$n \ge b$$) 적는다.
2. *기저 확인:* $$P(b)$$를 직접 계산한다.
3. *귀납 가정 적기:* "어떤 $$n \ge b$$에서 $$P(n)$$이 참이라 하자."
4. *$$P(n+1)$$을 $$P(n)$$으로 바꿔 가정 쓰기:* $$n + 1$$의 식에서 $$n$$의 식을 찾아내 가정을 대입하고 정리한다.
5. *결론:* "따라서 모든 $$n \ge b$$에서 $$P(n)$$이 참이다."

## 문제 1 · 완전한 풀이

$$n \ge 0$$이면 $$\sum_{k=0}^{n} 2^k = 2^{n+1} - 1$$($$\sum$$은 차례로 모두 더한다는 기호)임을 보여라.

1. *명제와 시작점:* $$P(n)$$: $$1 + 2 + \cdots + 2^n = 2^{n+1} - 1$$, $$n \ge 0$$.
2. *기저:* $$n = 0$$이면 왼쪽 $$1$$, 오른쪽 $$2 - 1 = 1$$.
3. *귀납 가정:* 어떤 $$n \ge 0$$에서 $$\sum_{k=0}^{n} 2^k = 2^{n+1} - 1$$이라 하자.
4. *바꿔 쓰고 가정 쓰기:* $$\sum_{k=0}^{n+1} 2^k = \left(\sum_{k=0}^{n} 2^k\right) + 2^{n+1} = (2^{n+1} - 1) + 2^{n+1} = 2^{n+2} - 1$$.
5. *결론:* 모든 $$n \ge 0$$에서 맞는다.

## 문제 2 · 마지막 하위목표만 빈칸

$$n \ge 0$$이면 $$n^3 - n$$은 3의 배수임을 보여라.

1. *명제와 시작점:* $$P(n)$$: $$3 \mid n^3 - n$$, $$n \ge 0$$. ($$a \mid b$$는 "$$a$$가 $$b$$를 나눈다")
2. *기저:* $$n = 0$$이면 $$0$$이고, $$0 = 3 \cdot 0$$.
3. *귀납 가정:* 어떤 $$n$$에서 $$n^3 - n = 3m$$($$m$$은 정수)이라 하자.
4. *바꿔 쓰고 가정 쓰기:* $$(n+1)^3 - (n+1) = n^3 + 3n^2 + 3n + 1 - n - 1 = (n^3 - n) + 3n^2 + 3n = 3m + 3(n^2 + n) = 3(m + n^2 + n)$$.
5. *결론:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$m + n^2 + n$$은 정수이므로 $$(n+1)^3 - (n+1)$$도 3의 배수다. 따라서 모든 $$n \ge 0$$에서 $$n^3 - n$$은 3의 배수다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$n \ge 4$$이면 $$n! > 2^n$$임을 보여라.

1. *명제와 시작점:* $$P(n)$$: $$n! > 2^n$$, $$n \ge 4$$.
2. *기저:* ______
3. *귀납 가정:* 어떤 $$n \ge 4$$에서 $$n! > 2^n$$이라 하자.
4. *바꿔 쓰고 가정 쓰기:* ______
5. *결론:* 모든 $$n \ge 4$$에서 맞는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$4! = 24 > 16 = 2^4$$. ($$n = 3$$이면 $$6 < 8$$이라 시작점이 4다.)
4. $$(n+1)! = (n+1) \cdot n! > (n+1) \cdot 2^n \ge 2 \cdot 2^n = 2^{n+1}$$. 첫 부등호는 가정, 둘째는 $$n + 1 \ge 2$$.

</details>


## 문제 4 · 독립 문제

$$x \ge -1$$인 실수와 $$n \ge 0$$인 정수에 대해 $$(1 + x)^n \ge 1 + nx$$임을 보여라(베르누이 부등식).

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

기저 $$n = 0$$: $$1 \ge 1$$. 가정: $$(1 + x)^n \ge 1 + nx$$. 단계: $$1 + x \ge 0$$이므로 가정의 양변에 곱해도 부등호가 유지되어 $$(1 + x)^{n+1} \ge (1 + nx)(1 + x) = 1 + (n+1)x + nx^2 \ge 1 + (n+1)x$$. 마지막은 $$nx^2 \ge 0$$. 따라서 모든 $$n \ge 0$$에서 맞는다.

**흔한 오답:** $$1 + x \ge 0$$을 쓰는 곳을 놓치는 것. $$x < -1$$이면 음수를 곱해 부등호가 뒤집혀 증명이 깨진다. 조건 $$x \ge -1$$이 바로 여기서 쓰인다.

</details>


## 변형 문제

강한 귀납법으로 "2 이상의 모든 정수는 소수들의 곱으로 쓸 수 있다"를 보여라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

기저 $$n = 2$$는 소수다. $$2, \dots, n$$이 모두 소수의 곱이라 하자. $$n + 1$$이 소수면 끝이다. 아니면 $$n + 1 = ab$$($$2 \le a, b \le n$$)이고, 가정으로 $$a$$와 $$b$$가 각각 소수의 곱이므로 $$ab$$도 그렇다. $$n + 1$$의 바로 앞 $$n$$이 아니라 더 작은 $$a$$, $$b$$를 쓰기 때문에 강한 귀납법이 필요하다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 명제를 넓은 범위에서 확인(실험. 증명은 위) — [12_induction_verify.py](/Hongs_Blog/studies/discrete-math/code/12_induction_verify/)</div>

</div>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 5장 "Induction"(귀납 증명의 틀)
{% endraw %}
