---
layout: "note"
title: "모듈러 역원과 중국인의 나머지 정리"
display_title: "모듈러 역원과 중국인의 나머지 정리 (Modular Inverses and the CRT)"
kind: "concept"
kind_label: "정리"
num: "29"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Modular Inverse", "모듈러 역원", "모듈로 역원", "multiplicative inverse", "Chinese Remainder Theorem", "CRT", "중국인의 나머지 정리", "서로소", "coprime", "relatively prime"]
description: "나머지 산술에서 \"나누기\"는 역원을 곱하는 것이다. 26으로 나눈 나머지만 보는 세계에서 7에 곱해 1이 되는 수(15)를 찾아 두면, 7로 나누는 대신 15를 곱하면 된다. 이런 역원은 두 수의 공약수가 1뿐(서로소)일 때만 있고, 확장 유클리드 호제법으로 바로 구한다. 또 서로…"
prev_url: "/studies/discrete-math/primes/"
prev_title: "소수와 산술의 기본정리"
next_url: "/studies/discrete-math/fermat-euler/"
next_title: "페르마 소정리와 오일러 정리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/modular-inverse-crt/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

나머지 산술에서 "나누기"는 역원을 곱하는 것이다. 26으로 나눈 나머지만 보는 세계에서 7에 곱해 1이 되는 수(15)를 찾아 두면, 7로 나누는 대신 15를 곱하면 된다. 이런 역원은 두 수의 공약수가 1뿐(서로소)일 때만 있고, 확장 유클리드 호제법으로 바로 구한다. 또 서로소인 여러 수로 나눈 나머지들을 알면 원래 수를 (그 수들의 곱을 법으로) 하나로 되살릴 수 있다. 법들이 서로소가 아니면 해가 없거나 하나로 정해지지 않는다.

</div>


## 예시로 보기

아핀 암호는 알파벳을 0~25로 보고 $$y = 7x + 3 \pmod{26}$$으로 바꾼다. 풀려면 $$x = 7^{-1}(y - 3)$$이 필요하다. $$7 \times 15 = 105 = 4 \times 26 + 1$$이라 $$7^{-1} \equiv 15 \pmod{26}$$이다. 그래서 $$x \equiv 15(y - 3) \pmod{26}$$로 복호한다. 한편 $$y = 2x \pmod{26}$$은 풀 수 없다. $$2 \cdot 0 \equiv 2 \cdot 13 \equiv 0$$이라 두 글자가 같은 암호문이 된다. 7이 아래 정리의 $$a$$, 26이 $$m$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">모듈러 역원</div>

$$a x \equiv 1 \pmod m$$인 $$x$$를 $$a$$의 법 $$m$$에 대한 **역원** $$a^{-1}$$이라 한다. 역원은 $$\gcd(a, m) = 1$$일 때 **그리고 그때만** 있고, 있으면 법 $$m$$에 대해 하나뿐이다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

($$\Leftarrow$$) [베주 항등식](/Hongs_Blog/studies/discrete-math/gcd-euclid/)으로 $$as + mt = 1$$이라 $$as \equiv 1 \pmod m$$. $$s$$가 역원이다.  
($$\Rightarrow$$) $$ax \equiv 1$$이면 $$ax - 1 = mk$$, 즉 $$ax - mk = 1$$. $$\gcd(a, m)$$이 좌변을 나누므로 1을 나눠 1이다.  
유일성: $$ax \equiv ay \equiv 1$$이면 $$x \equiv x(ay) = (xa)y \equiv y$$. ∎

</details>


$$p$$가 소수면 $$1, \dots, p - 1$$이 모두 $$p$$와 서로소라 0이 아닌 모든 수에 역원이 있다. 그래서 $$\mathbb{Z}_p$$에서는 사칙연산이 모두 된다(유한체).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">중국인의 나머지 정리</div>

$$m_1, \dots, m_k$$가 **쌍마다 서로소**이고 $$M = m_1 \cdots m_k$$이면, 연립 합동식 $$x \equiv a_i \pmod{m_i}$$($$i = 1, \dots, k$$)의 해가 법 $$M$$에 대해 정확히 하나 있다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

*존재:* $$M_i = M/m_i$$로 두면 $$\gcd(M_i, m_i) = 1$$이라 역원 $$y_i = M_i^{-1} \bmod m_i$$가 있다. $$x = \sum_i a_i M_i y_i$$로 두자. $$j \ne i$$이면 $$m_i \mid M_j$$라 법 $$m_i$$에서 $$i$$번째 항만 남고, $$a_i M_i y_i \equiv a_i$$이다.  
*유일성:* 두 해 $$x, x'$$는 모든 $$m_i$$에 대해 $$m_i \mid (x - x')$$이다. $$m_i$$들이 쌍마다 서로소라 곱 $$M$$도 $$x - x'$$을 나눈다(산술의 기본정리). ∎

</details>


## 예제

"3으로 나누면 2가 남고, 5로 나누면 3이 남고, 7로 나누면 2가 남는 수"(손자산경의 문제)[^2].

1. *곱과 몫:* $$M = 105$$, $$M_1 = 35$$, $$M_2 = 21$$, $$M_3 = 15$$.
2. *역원:* $$35 \equiv 2 \pmod 3$$이라 $$y_1 = 2$$. $$21 \equiv 1 \pmod 5$$라 $$y_2 = 1$$. $$15 \equiv 1 \pmod 7$$이라 $$y_3 = 1$$.
3. *조립:* $$x = 2 \cdot 35 \cdot 2 + 3 \cdot 21 \cdot 1 + 2 \cdot 15 \cdot 1 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}$$.
4. *검산:* $$23 = 7 \cdot 3 + 2 = 4 \cdot 5 + 3 = 3 \cdot 7 + 2$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 역원의 존재 조건과 유일성($$m \le 60$$ 전수), $$7^{-1} \equiv 15 \pmod{26}$$과 아핀 암호의 왕복, $$y = 2x$$의 충돌, CRT 해의 존재·유일성(작은 법 전수)과 손자산경 23, 서로소가 아닐 때의 예, RSA-CRT 복호의 일치 — [29_modular-inverse-crt_verify.py](/Hongs_Blog/studies/discrete-math/code/29_modular-inverse-crt_verify/)</div>

</div>


## 활용

- **나눗셈이 필요한 모듈러 계산.** 조합 수 $$\binom{n}{k} \bmod p$$를 계산할 때 $$k!$$로 나누는 대신 역원을 곱한다. 경진 프로그래밍에서 자주 쓰는 법 $$10^9 + 7$$은 소수라 모든 0 아닌 수에 역원이 있다.
- **RSA 복호 가속.** $$n = pq$$에서 $$c^d \bmod n$$을 직접 계산하는 대신, $$\bmod p$$와 $$\bmod q$$에서 따로 계산해 CRT로 합친다. 지수와 법이 모두 절반 크기라 두 번 계산해도 더 빠르다[^s1]. [RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/)의 구현에 들어 있다.
- **큰 정수 연산.** 큰 수를 여러 작은 소수로 나눈 나머지들로 들고 다니며 덧셈·곱셈을 따로 하고, 마지막에 CRT로 되살린다(잉여 수 체계)[^s1].
- 알고리즘에서: [노란불 신호등](/Hongs_Blog/studies/algorithms/pg468371/)에서 모든 신호등이 동시에 노란불인 때는, 신호등마다 노란불인 위치를 하나씩 골라 세운 연립 합동식의 해다. 주기들이 쌍마다 서로소면 답이 늘 있고, 1보다 큰 공약수를 가진 쌍이 있으면 답이 없을 수 있다. 주기가 서로소인 두 반복은 두 주기를 곱한 시간 동안 모든 상태 짝을 한 번씩 거친 뒤 되풀이되고, 주기 5초·6초인 신호등 두 개를 30초까지만 확인하면 되는 예가 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)에 있다.

## 연결

- 선수: [최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)
- 이어지는 개념: [페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/)(역원을 거듭제곱으로 구하기), [RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 7의 법 26에 대한 역원을 확장 유클리드 호제법으로 구하라.</summary>

**답:** $$26 = 3 \cdot 7 + 5$$, $$7 = 1 \cdot 5 + 2$$, $$5 = 2 \cdot 2 + 1$$. 거꾸로 대입하면 $$1 = 5 - 2 \cdot 2 = 5 - 2(7 - 5) = 3 \cdot 5 - 2 \cdot 7 = 3(26 - 3 \cdot 7) - 2 \cdot 7 = 3 \cdot 26 - 11 \cdot 7$$. 그래서 $$7^{-1} \equiv -11 \equiv 15$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 4에는 법 6에 대한 역원이 없는 이유를 두 가지 방법으로 설명하라.</summary>

**답:** (1) $$\gcd(4, 6) = 2 \ne 1$$이다. $$4x - 6k$$는 늘 짝수라 1이 될 수 없다. (2) $$4x \bmod 6$$을 $$x = 0, \dots, 5$$에서 계산하면 $$0, 4, 2, 0, 4, 2$$라 1이 나오지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** x ≡ 1 (mod 4), x ≡ 2 (mod 9)를 푸라.</summary>

**답:** $$M = 36$$. $$M_1 = 9 \equiv 1 \pmod 4$$라 $$y_1 = 1$$. $$M_2 = 4$$, $$4 \cdot 7 = 28 \equiv 1 \pmod 9$$라 $$y_2 = 7$$. $$x = 1 \cdot 9 \cdot 1 + 2 \cdot 4 \cdot 7 = 65 \equiv 29 \pmod{36}$$. 검산: $$29 = 7 \cdot 4 + 1 = 3 \cdot 9 + 2$$.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장. Rosen, *Discrete Mathematics and Its Applications* 7판, 4장(역원, 중국인의 나머지 정리). Cormen et al., *Introduction to Algorithms* 3판, 31.4절 "Solving modular linear equations", 31.5절 "The Chinese remainder theorem".
[^2]: 손자산경의 문제는 Rosen 7판 4장의 중국인의 나머지 정리 절에 역사적 예로 실려 있다.
[^s1]: 에이전트 보충. RSA-CRT 복호는 실제 RSA 구현이 쓰는 표준 기법이다. 잉여 수 체계는 큰 정수·다항식 곱셈 알고리즘에서 쓰는 표준 기법이다. 여러 소수로 나눈 나머지로 곱셈을 하고 되살리는 과정과 RSA-CRT 복호 결과가 직접 복호와 같음은 29_modular-inverse-crt_verify.py에서 확인했다.
{% endraw %}
