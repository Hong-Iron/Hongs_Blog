---
layout: "note"
title: "마스터 정리 예제 사다리"
display_title: "마스터 정리 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "25"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 분할 정복 점화식과 마스터 정리, 점근 표기."
prev_url: "/studies/discrete-math/recurrence-ladder/"
prev_title: "점화식 풀이 예제 사다리"
next_url: "/studies/discrete-math/gcd-ladder/"
next_title: "유클리드 호제법 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/discrete-math/master-theorem-ladder/"
---
{% raw %}
사용 개념: [분할 정복 점화식과 마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/), [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/).

이 방법을 떠올리는 신호는 **"크기 $$n/b$$인 같은 문제 $$a$$개 + 나머지 일 $$f(n)$$"** 모양의 재귀다. 코드에서 재귀 호출의 수가 $$a$$, 인자가 줄어드는 비율이 $$b$$, 재귀 밖의 반복문이 $$f(n)$$이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *$$a, b, f$$ 읽기:* 조각 수, 줄어드는 비율, 나누고 합치는 비용.
2. *임계 지수:* $$p = \log_b a$$. 잎의 수가 $$n^p$$다.
3. *비교:* $$f(n)$$이 $$n^p$$보다 다항식만큼 작은지, 같은지, 다항식만큼 큰지 본다. 크면 정칙 조건도 확인한다.
4. *결과:* 경우에 맞는 답을 쓰고, 답이 $$f(n)$$과 $$n^p$$ 둘 다 이상인지 확인한다.

## 문제 1 · 완전한 풀이

병합 정렬: $$T(n) = 2T(n/2) + n$$.

1. *$$a, b, f$$:* $$a = 2$$, $$b = 2$$, $$f(n) = n$$.
2. *임계 지수:* $$p = \log_2 2 = 1$$. 잎이 $$n$$개다.
3. *비교:* $$f(n) = n = \Theta(n^1)$$. 같다(경우 2). 층마다 일이 $$n$$으로 같다.
4. *결과:* $$T(n) = \Theta(n \lg n)$$. $$f(n) = n$$보다도, 잎 $$n$$보다도 크다.

## 문제 2 · 마지막 하위목표만 빈칸

$$T(n) = 4T(n/2) + n$$.

1. *$$a, b, f$$:* $$a = 4$$, $$b = 2$$, $$f(n) = n$$.
2. *임계 지수:* $$p = \log_2 4 = 2$$. 잎이 $$n^2$$개다.
3. *비교:* $$f(n) = n = O(n^{2 - 1})$$. $$\varepsilon = 1$$만큼 다항식으로 작다(경우 1).
4. *결과:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$T(n) = \Theta(n^2)$$. 잎의 수가 전체를 정한다. $$f(n) = n$$은 답에서 사라진다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$T(n) = 3T(n/4) + n\lg n$$.

1. *$$a, b, f$$:* $$a = 3$$, $$b = 4$$, $$f(n) = n\lg n$$.
2. *임계 지수:* $$p = \log_4 3 \approx 0.793$$.
3. *비교:* ______
4. *결과:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. $$n \ge 2$$이면 $$n\lg n \ge n = n^{p + \varepsilon}$$이다($$\varepsilon = 1 - \log_4 3 \approx 0.2$$). 그래서 $$f(n) = \Omega(n^{p + \varepsilon})$$(경우 3 후보). 정칙 조건: $$3 f(n/4) = \frac34 n \lg\frac n4 \le \frac34 n\lg n$$이라 $$c = \frac34 < 1$$로 맞는다.
4. $$T(n) = \Theta(n \lg n)$$. 맨 위의 일이 전체를 정한다.

</details>


## 문제 4 · 독립 문제

$$T(n) = 2T(n/4) + \sqrt n$$을 풀라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$a = 2$$, $$b = 4$$라 $$p = \log_4 2 = \frac12$$. $$f(n) = n^{1/2} = \Theta(n^p)$$(경우 2)라 $$T(n) = \Theta(\sqrt n \lg n)$$.

**흔한 오답:** $$\sqrt n$$을 $$n$$과 비교해 "경우 1이라 $$\Theta(n^{1/2})$$"로 쓰는 것. 비교 대상은 늘 $$n^{\log_b a}$$다.

</details>


## 변형 문제

$$T(n) = 2T(\sqrt n) + \lg n$$은 크기가 $$n/b$$로 줄지 않는다. 어떻게 마스터 정리의 모양으로 바꾸는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

변수를 $$m = \lg n$$으로 바꾸면 $$\sqrt n = 2^{m/2}$$이다. $$S(m) = T(2^m)$$이라 두면 $$S(m) = 2S(m/2) + m$$이 되어 문제 1과 같다. $$S(m) = \Theta(m \lg m)$$이라 $$T(n) = \Theta(\lg n \lg\lg n)$$이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4와 변형 문제의 점화식을 $$n = b^k$$(변형은 $$m = 2^k$$)에서 정확히 계산해 $$T(n)/g(n)$$이 일정한 값으로 모이는지 확인 — [25_master-theorem_verify.py](/Hongs_Blog/studies/discrete-math/code/25_master-theorem_verify/)</div>

</div>


[^1]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 4.5절(마스터 방법의 사용법과 예). 변수 바꾸기는 같은 책 4.3절.
{% endraw %}
