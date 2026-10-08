---
layout: "note"
title: "소수와 산술의 기본정리"
display_title: "소수와 산술의 기본정리 (Primes and the Fundamental Theorem of Arithmetic)"
kind: "concept"
kind_label: "정리"
num: "28"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Prime Numbers", "소수", "소인수분해", "prime factorization", "Fundamental Theorem of Arithmetic", "산술의 기본정리", "유클리드 보조정리", "Euclid's lemma", "에라토스테네스의 체", "Sieve of Eratosthenes", "소수 정리", "prime number theorem"]
description: "소수는 1과 자기 자신으로만 나누어지는, 더 쪼갤 수 없는 수다. 1보다 큰 모든 정수는 소수의 곱으로 쓸 수 있고, 순서를 무시하면 그 방법은 딱 하나다. 레고 블록처럼 수의 설계도가 유일하다는 이 사실이 정수론 계산의 바탕이다. 하지만 곱하기는 쉬워도 곱을 거꾸로 쪼개는 소인수…"
prev_url: "/studies/discrete-math/gcd-euclid/"
prev_title: "최대공약수와 유클리드 호제법"
next_url: "/studies/discrete-math/modular-inverse-crt/"
next_title: "모듈러 역원과 중국인의 나머지 정리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/discrete-math/primes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소수는 1과 자기 자신으로만 나누어지는, 더 쪼갤 수 없는 수다. 1보다 큰 모든 정수는 소수의 곱으로 쓸 수 있고, 순서를 무시하면 그 방법은 딱 하나다. 레고 블록처럼 수의 설계도가 유일하다는 이 사실이 정수론 계산의 바탕이다. 하지만 곱하기는 쉬워도 곱을 거꾸로 쪼개는 소인수분해는 큰 수에서 매우 어렵고, 암호는 바로 이 비대칭을 쓴다.

</div>


## 예시로 보기

$$360$$을 쪼갠다. $$360 = 2 \times 180 = 2 \times 2 \times 90 = \cdots = 2^3 \times 3^2 \times 5$$. 어떤 순서로 쪼개도($$360 = 10 \times 36 = (2 \times 5)(2^2 \times 3^2)$$) 같은 결과가 나온다. 설계도가 유일하므로 약수도 설계도로 센다. 약수는 $$2^i 3^j 5^k$$($$0 \le i \le 3$$, $$0 \le j \le 2$$, $$0 \le k \le 1$$)라 $$4 \times 3 \times 2 = 24$$개다([곱의 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)). 2, 3, 5가 아래 정리의 $$p_i$$, 지수 3, 2, 1이 $$e_i$$다.

## 정의

1보다 큰 정수 $$p$$의 양의 약수가 1과 $$p$$뿐이면 **소수**, 아니면 **합성수**다. 1은 어느 쪽도 아니다[^1].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">유클리드 보조정리</div>

소수 $$p$$가 $$ab$$를 나누면 $$p \mid a$$이거나 $$p \mid b$$이다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">산술의 기본정리</div>

1보다 큰 모든 정수는 소수의 곱 $$p_1^{e_1}p_2^{e_2}\cdots p_k^{e_k}$$($$p_1 < \cdots < p_k$$, $$e_i \ge 1$$)로 쓸 수 있고, 이 표현은 하나뿐이다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">소수는 무한히 많다</div>

어떤 유한한 소수 목록에도 들지 않는 소수가 있다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

**유클리드 보조정리.** $$p \nmid a$$라 하자. $$p$$의 약수는 1과 $$p$$뿐이라 $$\gcd(p, a) = 1$$이다. [베주 항등식](/Hongs_Blog/studies/discrete-math/gcd-euclid/)으로 $$ps + at = 1$$. 양변에 $$b$$를 곱하면 $$b = pbs + (ab)t$$이고, 두 항이 모두 $$p$$의 배수라 $$p \mid b$$.

**기본정리 — 존재.** [강한 귀납법](/Hongs_Blog/studies/discrete-math/induction/). $$n$$이 소수면 그 자체가 표현이다. 아니면 $$n = ab$$($$1 < a, b < n$$)이고, 귀납 가정으로 $$a$$, $$b$$가 각각 소수의 곱이라 $$n$$도 그렇다.

**기본정리 — 유일성.** 두 표현 $$p_1 \cdots p_r = q_1 \cdots q_s$$(같은 소수가 반복되어도 된다)가 있으면, $$p_1$$이 우변을 나누므로 유클리드 보조정리를 되풀이해 어떤 $$q_j$$를 나누고, $$q_j$$가 소수라 $$p_1 = q_j$$다. 양변에서 지우고 같은 논리를 되풀이하면 두 표현은 순서만 다르다.

**무한성.** 소수가 $$p_1, \dots, p_k$$뿐이라 하자. $$N = p_1 \cdots p_k + 1$$은 어느 $$p_i$$로 나눠도 나머지가 1이다. 그런데 $$N > 1$$이라 어떤 소수로 나누어떨어진다(존재). 목록 밖의 소수가 있어 모순이다. ∎

</details>


**소수 판정과 목록.** $$n$$이 합성수면 $$n = ab$$에서 둘 중 하나는 $$\sqrt n$$ 이하다. 그래서 $$\sqrt n$$ 이하의 수로만 나눠 보면 된다. $$n$$ 이하의 소수를 모두 구할 때는 에라토스테네스의 체를 쓴다. 2부터 차례로, 지워지지 않은 수 $$p$$의 배수를 $$p^2$$부터 지운다. 연산 횟수는 $$O(n\log\log n)$$이다[^s1].

**소수의 밀도.** $$n$$ 이하 소수의 개수 $$\pi(n)$$은 대략 $$\frac{n}{\ln n}$$이다(소수 정리)[^s1]. $$n = 10^6$$이면 실제 78,498개, 어림 72,382개다.

## 예제

유클리드의 증명에서 만든 $$N = p_1 \cdots p_k + 1$$이 늘 소수일까?

1. *작은 경우:* $$2 + 1 = 3$$, $$2 \cdot 3 + 1 = 7$$, $$2 \cdot 3 \cdot 5 + 1 = 31$$, $$\dots$$, $$2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 + 1 = 2311$$은 모두 소수다.
2. *다음 경우:* $$2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 + 1 = 30031 = 59 \times 509$$. 소수가 아니다.
3. *증명과의 관계:* 증명은 "$$N$$이 소수"라고 말하지 않는다. "$$N$$의 소인수는 목록 밖에 있다"고 말한다. 실제로 59와 509는 2~13 목록에 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 360의 분해와 약수 24개, 1~5000의 분해가 소수의 곱이고 다시 곱하면 원래 수(유일성은 증명), 유클리드 보조정리(범위 전수), 체와 시험 나눗셈의 일치, $$\pi(10^6) = 78498$$, 30031의 분해, 해시 칸 예 — [28_primes_impl.py](/Hongs_Blog/studies/discrete-math/code/28_primes_impl/), [28_primes_verify.py](/Hongs_Blog/studies/discrete-math/code/28_primes_verify/)</div>

</div>


## 활용

- **암호.** 두 큰 소수를 곱하기는 쉽지만, 곱에서 두 소수를 찾는 효율적인 방법은 알려져 있지 않다. [RSA](/Hongs_Blog/studies/discrete-math/rsa/)의 안전성이 여기에 기댄다.
- **해시 테이블 크기.** 키가 4의 배수로만 들어오는데 칸 수가 8이면 $$k \bmod 8$$은 0과 4 두 칸에만 몰린다. 칸 수를 소수 7로 하면 일곱 칸에 고르게 퍼진다. 키에 규칙이 있을 때 칸 수를 소수로 잡는 이유다[^s1].
- **구현.** [28_primes_impl.py](/Hongs_Blog/studies/discrete-math/code/28_primes_impl/)에 체, 시험 나눗셈, 소인수분해가 있다.
- 알고리즘에서: [k진수에서 소수 개수 구하기](/Hongs_Blog/studies/algorithms/pg92335/)는 판정할 수가 몇 개뿐이지만 가장 큰 수가 약 2.2조다. 그만큼 큰 체는 만들 수 없으니 수마다 $$\sqrt n$$까지만 나눠 보는 판정을 쓰고, 한 번에 약 150만 번이면 끝난다.

## 연결

- 선수: [최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)(유클리드 보조정리의 증명)
- 이어지는 개념: [페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/), [RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 360을 소인수분해하고 양의 약수의 개수를 구하라.</summary>

**답:** $$2^3 \cdot 3^2 \cdot 5$$. 약수의 개수는 $$(3 + 1)(2 + 1)(1 + 1) = 24$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** n이 소수인지 판정할 때 √n 이하의 수로만 나눠 봐도 되는 이유는?</summary>

**답:** $$n$$이 합성수면 $$n = ab$$($$1 < a \le b$$)로 쓸 수 있고, $$a > \sqrt n$$이면 $$ab > n$$이 되어 모순이다. 그래서 $$\sqrt n$$ 이하의 약수가 반드시 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "처음 k개 소수의 곱에 1을 더하면 소수다"의 반례를 들고, 유클리드의 증명이 실제로 말하는 것을 쓰라.</summary>

**답:** $$2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 + 1 = 30031 = 59 \times 509$$. 증명은 $$N$$이 소수라는 것이 아니라, $$N$$의 소인수가 처음 목록에 없다는 것을 말한다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(소수, 산술의 기본정리). Rosen, *Discrete Mathematics and Its Applications* 7판, 4장(소수의 무한성, 에라토스테네스의 체, 소수 정리 소개).
[^s1]: 에이전트 보충. 체의 $$O(n\log\log n)$$과 소수 정리는 증명하지 않고 인용했다(소수 정리는 해석적 정수론의 결과). 해시 칸 예와 $$\pi(10^6)$$은 28_primes_verify.py에서 계산했다.
{% endraw %}
