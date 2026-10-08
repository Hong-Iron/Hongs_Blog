---
layout: "note"
title: "페르마 소정리와 오일러 정리"
display_title: "페르마 소정리와 오일러 정리 (Fermat's Little Theorem and Euler's Theorem)"
kind: "concept"
kind_label: "정리"
num: "30"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Fermat's Little Theorem", "페르마 소정리", "페르마의 작은 정리", "Euler's Theorem", "오일러 정리", "오일러 피 함수", "Euler's totient function", "φ(n)", "빠른 거듭제곱", "fast exponentiation", "square-and-multiply", "제곱 곱셈", "카마이클 수", "Carmichael number", "페르마 판정법", "Fermat primality test"]
description: "나머지의 세계에서 같은 수를 계속 곱하면 결국 1로 돌아와 같은 순서가 되풀이된다. 소수로 나눈 나머지에서는 \"그 소수보다 하나 적은 횟수\"만큼 곱하면 반드시 1이 되고(페르마), 일반적인 수로 나눈 나머지에서는 \"그 수와 서로소인 수의 개수\"만큼 곱하면 1이 된다(오일러). 그래…"
prev_url: "/studies/discrete-math/modular-inverse-crt/"
prev_title: "모듈러 역원과 중국인의 나머지 정리"
next_url: "/studies/discrete-math/rsa/"
next_title: "RSA 암호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/fermat-euler/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

나머지의 세계에서 같은 수를 계속 곱하면 결국 1로 돌아와 같은 순서가 되풀이된다. 소수로 나눈 나머지에서는 "그 소수보다 하나 적은 횟수"만큼 곱하면 반드시 1이 되고(페르마), 일반적인 수로 나눈 나머지에서는 "그 수와 서로소인 수의 개수"만큼 곱하면 1이 된다(오일러). 그래서 거대한 지수도 이 주기로 나눈 나머지만큼만 계산하면 되고, RSA가 올바르게 복호되는 이유가 된다. 단, 밑이 법과 서로소여야 하고, 역은 맞지 않아 이 성질만으로는 소수를 확실히 가려낼 수 없다.

</div>


## 예시로 보기

$$3$$의 거듭제곱을 7로 나눈 나머지를 차례로 쓴다.

| $$k$$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| $$3^k \bmod 7$$ | 3 | 2 | 6 | 4 | 5 | 1 | 3 | 2 |

6번째에서 1로 돌아와 주기 6으로 되풀이된다. 그래서 $$3^{100} \bmod 7$$은 $$100 = 6 \times 16 + 4$$에서 $$3^4 \equiv 4$$($$a \equiv b \pmod m$$은 "$$a$$와 $$b$$를 $$m$$으로 나눈 나머지가 같다")다. 7이 아래 정리의 소수 $$p$$, 주기 6이 $$p - 1$$이다.

## 정의

$$n \in \mathbb{Z}^{+}$$($$\in$$은 "~에 속한다")에 대해 $$1 \le k \le n$$ 중 $$\gcd(k, n) = 1$$인 $$k$$의 개수를 **오일러 피 함수** $$\varphi(n)$$이라 한다. 예: $$\varphi(7) = 6$$, $$\varphi(10) = 4$$($$1, 3, 7, 9$$).

- $$p$$가 소수면 $$\varphi(p) = p - 1$$, $$\varphi(p^k) = p^k - p^{k-1}$$(배수 $$p^{k-1}$$개를 뺀다).
- $$\gcd(m, n) = 1$$이면 $$\varphi(mn) = \varphi(m)\varphi(n)$$([중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)로 서로소인 나머지의 쌍이 일대일로 대응한다).
- 그래서 $$\varphi(n) = n\prod_{p \mid n}\left(1 - \frac1p\right)$$. 예: $$\varphi(36) = 36 \cdot \frac12 \cdot \frac23 = 12$$[^1].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">오일러 정리와 페르마 소정리</div>

$$\gcd(a, n) = 1$$이면 $$a^{\varphi(n)} \equiv 1 \pmod n$$. 특히 $$p$$가 소수이고 $$p \nmid a$$이면 $$a^{p-1} \equiv 1 \pmod p$$(페르마 소정리). 모든 정수 $$a$$에 대해 $$a^p \equiv a \pmod p$$이다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. *서로소인 나머지들:* $$n$$과 서로소인 $$1 \le r \le n$$을 $$r_1, \dots, r_{\varphi(n)}$$이라 하자.
2. *a를 곱해도 같은 집합:* $$ar_i$$도 $$n$$과 서로소다. 또 $$ar_i \equiv ar_j$$이면 $$a$$의 [역원](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)을 곱해 $$r_i \equiv r_j$$다. 그래서 $$ar_1, \dots, ar_{\varphi(n)}$$을 $$n$$으로 나눈 나머지는 $$r_1, \dots, r_{\varphi(n)}$$을 순서만 바꾼 것이다.
3. *곱 비교:* 두 목록의 곱이 합동이다. $$a^{\varphi(n)}\prod r_i \equiv \prod r_i \pmod n$$.
4. *지우기:* $$\prod r_i$$는 $$n$$과 서로소라 역원이 있다. 양변에 곱하면 $$a^{\varphi(n)} \equiv 1$$. ∎

$$a^p \equiv a$$는 $$p \nmid a$$이면 페르마 소정리에 $$a$$를 곱한 것이고, $$p \mid a$$이면 양변이 0이다.

</details>


**빠른 거듭제곱.** $$a^e \bmod n$$은 $$e$$를 2진법으로 쓰고, $$a, a^2, a^4, \dots$$를 제곱으로 만들어 필요한 것만 곱한다. 매번 $$\bmod n$$을 취해 수가 커지지 않는다. 곱셈은 $$O(\log e)$$번이다[^2]. $$3^{100}$$이면 $$100 = 64 + 32 + 4$$라 제곱 6번과 곱셈 2번이면 된다.

## 예제

**페르마 판정법의 함정.** $$n$$이 소수면 $$a^{n-1} \equiv 1$$이다. 그렇다면 거꾸로 $$a^{n-1} \equiv 1$$이면 소수일까?

1. *합성수를 잡아내는 경우:* $$2^{14} \bmod 15 = 4 \ne 1$$이라 15는 확실히 합성수다.
2. *속는 경우:* $$561 = 3 \cdot 11 \cdot 17$$은 합성수인데, 561과 서로소인 **모든** $$a$$에서 $$a^{560} \equiv 1 \pmod{561}$$이다. 이런 수를 카마이클 수라 한다.
3. *이유:* $$560$$이 $$3 - 1$$, $$11 - 1$$, $$17 - 1$$의 배수라, 각 소인수에서 페르마 소정리로 1이 되고 중국인의 나머지 정리로 합쳐진다.
4. *해결:* 실제 소수 판정은 이 약점을 보완한 밀러–라빈 판정법을 쓴다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표와 $$3^{100} \bmod 7 = 4$$, 페르마 소정리(소수 $$p < 200$$, 모든 $$a$$), 오일러 정리($$n \le 150$$ 전수), 피 함수의 공식과 곱셈성, $$\varphi(36) = 12$$, 빠른 거듭제곱의 결과와 곱셈 횟수, 561이 카마이클 수임, $$2^{14} \bmod 15$$ — [30_fermat-euler_verify.py](/Hongs_Blog/studies/discrete-math/code/30_fermat-euler_verify/)</div>

</div>


## 활용

- **큰 지수의 나머지.** Python의 `pow(a, e, n)`은 빠른 거듭제곱이다. 2048비트 지수도 곱셈 수천 번이면 끝난다.
- **역원을 거듭제곱으로.** $$p$$가 소수면 $$a^{-1} \equiv a^{p-2} \pmod p$$이다. 법이 소수로 고정된 계산에서 확장 유클리드 대신 쓴다.
- **RSA.** 암호화한 뒤 복호하면 원래 수로 돌아오는 이유가 오일러 정리다([RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/)).

## 연결

- 선수: [모듈러 역원과 중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/), [소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/)
- 이어지는 개념: [RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/)
- 같은 생각: [1의 n제곱근](/Hongs_Blog/studies/college-math/euler-formula/)처럼, 곱해서 제자리로 돌아오는 원소의 주기다(군론의 라그랑주 정리)[^s1].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$3^{100} \bmod 7$$과 $$\varphi(36)$$을 구하라.</summary>

**답:** $$3^6 \equiv 1 \pmod 7$$이고 $$100 = 6 \cdot 16 + 4$$라 $$3^{100} \equiv 3^4 = 81 \equiv 4$$. $$36 = 2^2 \cdot 3^2$$이라 $$\varphi(36) = 36 \cdot \frac12 \cdot \frac23 = 12$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 증명에서 $$ar_1, \dots, ar_{\varphi(n)}$$이 $$r_1, \dots, r_{\varphi(n)}$$의 순서만 바꾼 것인 이유는?</summary>

**답:** $$a$$와 $$r_i$$가 모두 $$n$$과 서로소라 곱도 서로소다(목록 안에 든다). 또 $$a$$에 역원이 있어 $$ar_i \equiv ar_j$$이면 $$r_i \equiv r_j$$다(서로 다른 것은 서로 다르게 간다). 개수가 같은 집합으로 가는 일대일 대응이라 순서만 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "$$a^{n-1} \equiv 1 \pmod n$$이면 $$n$$은 소수다"의 반례를 들라.</summary>

**답:** $$n = 561 = 3 \cdot 11 \cdot 17$$. 561과 서로소인 모든 $$a$$에서 $$a^{560} \equiv 1$$이다(카마이클 수). 밑 2 하나만 보면 $$341 = 11 \cdot 31$$도 $$2^{340} \equiv 1 \pmod{341}$$이라 속는다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(오일러 피 함수, 오일러 정리, 페르마 소정리).
[^2]: Cormen et al., *Introduction to Algorithms* 3판, 31.6절 "Powers of an element"(MODULAR-EXPONENTIATION), 31.8절 "Primality testing"(유사소수, 카마이클 수, 밀러–라빈).
[^s1]: 에이전트 보충. 오일러 정리는 "유한군의 원소의 차수는 군의 크기를 나눈다"(라그랑주 정리)의 특수한 경우다. 서로소인 나머지들이 곱셈에 대해 크기 $$\varphi(n)$$인 군을 이룬다.
{% endraw %}
