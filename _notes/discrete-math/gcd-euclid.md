---
layout: "note"
title: "최대공약수와 유클리드 호제법"
display_title: "최대공약수와 유클리드 호제법 (GCD and the Euclidean Algorithm)"
kind: "concept"
kind_label: "알고리즘"
num: "27"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["GCD", "Greatest Common Divisor", "최대공약수", "Euclidean Algorithm", "유클리드 호제법", "유클리드 알고리즘", "Extended Euclidean Algorithm", "확장 유클리드 호제법", "베주 항등식", "Bézout's identity", "일차 부정방정식", "linear Diophantine equation", "라메의 정리", "Lamé's theorem"]
description: "두 수의 최대공약수는 \"큰 수를 작은 수로 나눈 나머지\"로 바꿔도 변하지 않는다. 그래서 나머지로 계속 바꿔 나가다 0이 되기 직전의 수가 답이다. 소인수분해 없이 몇십 자리 수도 순식간에 계산하고, 과정을 거꾸로 따라가면 \"최대공약수 = 두 수의 정수 배의 합\"을 만드는 계수까지…"
prev_url: "/studies/discrete-math/modular-arithmetic/"
prev_title: "나눗셈과 합동"
next_url: "/studies/discrete-math/primes/"
next_title: "소수와 산술의 기본정리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/discrete-math/gcd-euclid/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 수의 최대공약수는 "큰 수를 작은 수로 나눈 나머지"로 바꿔도 변하지 않는다. 그래서 나머지로 계속 바꿔 나가다 0이 되기 직전의 수가 답이다. 소인수분해 없이 몇십 자리 수도 순식간에 계산하고, 과정을 거꾸로 따라가면 "최대공약수 = 두 수의 정수 배의 합"을 만드는 계수까지 얻는다. 이 계수가 모듈러 역원과 RSA 키 생성의 핵심이다. 단, 계수는 음수일 수 있고 한 가지로 정해지지 않는다.

</div>


## 예시로 보기

가로 252, 세로 105인 직사각형 바닥을 같은 크기의 정사각형 타일로 빈틈없이 덮을 때 가장 큰 타일의 한 변은? 한 변이 두 길이의 공약수여야 하므로 답은 최대공약수다.

1. 105짜리 정사각형 두 개를 깔면 $$252 - 2 \times 105 = 42$$가 남는다.
2. 남은 $$105 \times 42$$에 42짜리 두 개를 깔면 21이 남는다.
3. 남은 $$42 \times 21$$은 21짜리 두 개로 딱 덮인다.

답은 21이다. 매 단계 "큰 쪽을 작은 쪽으로 나눈 나머지"만 남는다. 252와 105가 아래 의사코드의 입력 $$a$$, $$b$$, 남는 42와 21이 나머지 $$r$$이다.

## 정의

**입력:** 정수 $$a, b \ge 0$$, 둘 다 0은 아님. **출력:** $$g = \gcd(a, b)$$와 $$g = as + bt$$인 정수 $$s, t$$.

```
EXT-GCD(a, b)
  (r0, s0, t0) ← (a, 1, 0)
  (r1, s1, t1) ← (b, 0, 1)
  while r1 ≠ 0
      q ← r0 div r1
      (r0, r1) ← (r1, r0 − q·r1)
      (s0, s1) ← (s1, s0 − q·s1)
      (t0, t1) ← (t1, t0 − q·t1)
  return (r0, s0, t0)
```

$$s, t$$ 부분을 빼면 보통의 유클리드 호제법이다. 핵심은 한 줄이다[^1].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">호제법의 원리</div>

$$b > 0$$이면 $$\gcd(a, b) = \gcd(b,\ a \bmod b)$$. 또 $$\gcd(a, 0) = a$$.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">베주 항등식</div>

$$\gcd(a, b) = as + bt$$인 정수 $$s, t$$가 있다. $$\gcd(a, b)$$는 $$as + bt$$ 꼴의 양의 정수 중 가장 작은 것이다.

</div>


**실행 추적.** $$\gcd(252, 105)$$. 각 줄은 $$r = 252s + 105t$$를 만족한다.

| 단계 | 몫 $$q$$ | $$r$$ | $$s$$ | $$t$$ |
|---|---|---|---|---|
| 시작 | — | 252 | 1 | 0 |
| 시작 | — | 105 | 0 | 1 |
| 1 | 2 | 42 | 1 | −2 |
| 2 | 2 | 21 | −2 | 5 |
| 3 | 2 | 0 | 5 | −12 |

0이 나오기 직전 줄에서 $$\gcd = 21 = 252 \cdot (-2) + 105 \cdot 5$$이다.

## 증명

루프 불변식으로 정확성을, 나머지가 빨리 줄어드는 것으로 속도를 보인다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**원리.** $$a = qb + r$$($$r = a \bmod b$$)이다. $$d$$가 $$a$$와 $$b$$를 나누면 $$r = a - qb$$도 나눈다. $$d$$가 $$b$$와 $$r$$을 나누면 $$a = qb + r$$도 나눈다. 두 쌍의 공약수 집합이 같으므로 가장 큰 것도 같다.

**불변식.** 반복이 시작될 때마다 (I1) $$\gcd(r_0, r_1) = \gcd(a, b)$$, (I2) $$r_0 = as_0 + bt_0$$, $$r_1 = as_1 + bt_1$$.
1. *초기화:* $$r_0 = a = a \cdot 1 + b \cdot 0$$, $$r_1 = b = a \cdot 0 + b \cdot 1$$. (I1)은 그대로다.
2. *유지:* 새 $$r_1$$은 $$r_0 - qr_1 = r_0 \bmod r_1$$이라 원리로 (I1)이 유지된다. 새 $$r_1 = (as_0 + bt_0) - q(as_1 + bt_1) = a(s_0 - qs_1) + b(t_0 - qt_1)$$이고, 이것이 새 $$s_1, t_1$$이다.
3. *종료:* $$r_1$$은 $$0 \le r_1 < r_0$$을 지키며 매번 줄어드는 음이 아닌 정수라 언젠가 0이 된다. 그때 (I1)로 $$\gcd(a, b) = \gcd(r_0, 0) = r_0$$이고 (I2)로 $$r_0 = as_0 + bt_0$$이다. 베주 항등식의 존재도 여기서 나온다.

**가장 작은 양의 결합.** $$as + bt > 0$$인 아무 결합을 잡으면 $$g$$가 $$a$$와 $$b$$를 나누므로 $$g$$가 그 결합도 나눠 $$g \le as + bt$$이다. $$g$$ 자신도 결합이므로 가장 작다.

**속도.** 두 단계마다 나머지가 절반 미만이 된다. $$r_{i+1} \le r_i/2$$이면 바로 성립한다. 아니면 $$r_{i+1} > r_i/2$$라 $$r_{i+2} = r_i - r_{i+1} < r_i/2$$이다. 그래서 나눗셈 횟수는 $$2\lg b + 2$$ 이하, 즉 $$O(\log \min(a, b))$$다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 원리에서 "공약수 집합이 같다"를 보이려고 두 방향을 모두 확인한 이유는?</summary>

한 방향만 보이면 한쪽 집합이 다른 쪽에 포함된다는 것까지만 안다. 가장 큰 원소가 같으려면 집합이 같아야 하므로 양쪽 포함이 모두 필요하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 유지 단계에서 s와 t를 r과 같은 몫 q로 갱신하는 이유는?</summary>

$$r$$의 갱신 $$r_0 - qr_1$$이 일차식이라, $$r_0$$과 $$r_1$$을 $$a, b$$의 결합으로 쓴 식에 같은 연산을 하면 결합의 계수에도 같은 연산이 적용된다. 그래서 $$(s, t)$$가 $$r$$을 그대로 따라간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 알고리즘의 핵심 아이디어는?</summary>

답(최대공약수)을 바꾸지 않는 더 작은 문제로 계속 옮긴다. 그리고 옮기는 연산이 일차식이라 "어떻게 만들었는지"(계수)를 함께 기록할 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

다항식의 최대공약수(다항식 나눗셈으로 같은 반복), 행렬을 행 연산으로 줄이면서 연산을 기록하는 선형대수학의 [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)이 같은 구조다.

</details>


## 예제

**일차 부정방정식.** $$ax + by = c$$에 정수해가 있을 조건과 해 하나.

1. *조건:* 해가 있으면 $$\gcd(a, b)$$가 좌변을 나누므로 $$c$$도 나눈다. 거꾸로 $$\gcd(a, b) \mid c$$이면 베주 계수에 $$c/\gcd(a, b)$$를 곱하면 해다. 그래서 **$$\gcd(a, b) \mid c$$일 때 그리고 그때만** 해가 있다.
2. *적용:* $$252x + 105y = 63$$. $$63 = 3 \times 21$$이라 해가 있고, $$x = 3 \cdot (-2) = -6$$, $$y = 3 \cdot 5 = 15$$.
3. *모든 해:* $$x = -6 + 5k$$, $$y = 15 - 12k$$($$k \in \mathbb{Z}$$). 더하고 빼는 5와 12는 $$\frac{105}{21}$$과 $$\frac{252}{21}$$이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 실행 추적 표, 불변식을 매 반복 확인하며 무작위 5,000쌍(최대 $$10^{12}$$)에서 `math.gcd`와 비교, 나눗셈 횟수 $$\le 2\lg b + 2$$, 피보나치 입력의 횟수, 카드와 예제의 해 — [27_gcd-euclid_impl.py](/Hongs_Blog/studies/discrete-math/code/27_gcd-euclid_impl/), [27_gcd-euclid_verify.py](/Hongs_Blog/studies/discrete-math/code/27_gcd-euclid_verify/)</div>

</div>


## 활용

- **복잡도.** 나눗셈 횟수가 $$O(\log \min(a, b))$$라, 2048비트 수에서도 수천 번 이내다. 가장 오래 걸리는 입력은 이웃한 피보나치 수다. $$\gcd(89, 55)$$는 몫이 모두 1이라 9번 나눈다(라메의 정리)[^2].
- **모듈러 역원과 RSA.** $$\gcd(a, m) = 1$$이면 $$as + mt = 1$$에서 $$as \equiv 1 \pmod m$$이라 $$s$$가 $$a$$의 역원이다. RSA의 개인키 계산이 정확히 이것이다([모듈러 역원](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)).
- **분수 약분과 비율.** 화면 비율 1920 : 1080을 $$\gcd = 120$$으로 나눠 16 : 9로 줄인다.
- **라이브러리.** Python의 `math.gcd`, C++의 `std::gcd`. Python 3.8 이상에서는 `pow(a, -1, m)`이 역원을 준다.
- 연습: [유클리드 호제법 예제 사다리](/Hongs_Blog/studies/discrete-math/gcd-ladder/)
- 알고리즘에서: 주기 $$p$$와 $$q$$로 되풀이되는 두 상태가 함께 처음 모습으로 돌아오는 가장 이른 시간은 최소공배수 $$\operatorname{lcm}(p, q) = pq / \gcd(p, q)$$다[^s2]. 그 안에서 못 찾으면 영원히 없어서, [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)과 [노란불 신호등](/Hongs_Blog/studies/algorithms/pg468371/)은 이 시간까지만 확인한다.

## 연결

- 선수: [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)
- 이어지는 개념: [소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/)(유클리드 보조정리가 베주 항등식에서 나온다), [모듈러 역원과 중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)
- 최악의 입력: [피보나치 수](/Hongs_Blog/studies/discrete-math/linear-recurrences/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"a < b이면 먼저 두 수를 바꿔 넣어야 한다"</div>

틀렸다. 손으로 풀 때 늘 큰 수를 앞에 두다 보니 필요한 절차처럼 느껴진다. 하지만 $$a < b$$이면 첫 단계에서 $$a \bmod b = a$$라 $$(a, b)$$가 $$(b, a)$$로 저절로 바뀐다. 나눗셈이 한 번 늘 뿐이다. $$\gcd(105, 252)$$는 첫 줄에서 $$(252, 105)$$가 되고 결과는 21로 같다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** gcd(1071, 462)를 유클리드 호제법으로 계산하라. 각 줄의 몫과 나머지를 쓰라.</summary>

**답:** $$1071 = 2 \times 462 + 147$$, $$462 = 3 \times 147 + 21$$, $$147 = 7 \times 21 + 0$$. 최대공약수는 21.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래 코드가 돌려주는 세 값은 무엇이고, s와 t는 어떤 관계를 만족하는가?</summary>

```python
def f(a, b):
    r0, s0, t0, r1, s1, t1 = a, 1, 0, b, 0, 1
    while r1:
        q = r0 // r1
        r0, r1 = r1, r0 - q * r1
        s0, s1 = s1, s0 - q * s1
        t0, t1 = t1, t0 - q * t1
    return r0, s0, t0
```
**답:** 확장 유클리드 호제법이다. 최대공약수 $$g$$와 $$g = as + bt$$를 만족하는 정수 $$s, t$$(베주 계수)를 돌려준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** gcd(a, b) = gcd(b, a mod b)가 성립하는 이유를 설명하라.</summary>

**답:** $$a = qb + r$$이다. $$a$$와 $$b$$의 공약수는 $$r = a - qb$$도 나누고, $$b$$와 $$r$$의 공약수는 $$a = qb + r$$도 나눈다. 두 쌍의 공약수가 똑같아 최대공약수도 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 240s + 46t = gcd(240, 46)을 만족하는 정수 s, t를 구하라.</summary>

**답:** $$240 = 5 \cdot 46 + 10$$, $$46 = 4 \cdot 10 + 6$$, $$10 = 1 \cdot 6 + 4$$, $$6 = 1 \cdot 4 + 2$$, $$4 = 2 \cdot 2$$. $$\gcd = 2$$이고 $$s = -9$$, $$t = 47$$($$-2160 + 2162 = 2$$).

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(유클리드 호제법, 베주 항등식의 "가장 작은 양의 결합" 증명). Cormen et al., *Introduction to Algorithms* 3판, 31.2절 "Greatest common divisor"(EXTENDED-EUCLID).
[^2]: Rosen, *Discrete Mathematics and Its Applications* 7판, 5장(라메의 정리). 이 문서에서는 더 간단한 한계 $$2\lg b + 2$$를 증명했다.
[^s1]: 에이전트 보충. 일차 부정방정식의 모든 해의 꼴은 두 해의 차가 $$(b/g, -a/g)$$의 정수배라는 사실에서 나온다. 27_gcd-euclid_verify.py에서 범위 안의 모든 해가 이 꼴임을 전수로 확인했다.
[^s2]: 에이전트 보충. $$g = \gcd(p, q)$$, $$p = gp'$$, $$q = gq'$$로 두면 $$\gcd(p', q') = 1$$이다. $$gp'q' = pq' = qp'$$는 $$p$$와 $$q$$의 공배수다. 양의 공배수 $$M = pk$$가 $$q$$로 나누어떨어지면 $$q' \mid p'k$$다. $$p'$$와 $$q'$$가 서로소라 베주 항등식으로 $$p's + q't = 1$$인 정수 $$s, t$$가 있고, $$k = (p'k)s + q'(kt)$$의 두 항이 모두 $$q'$$의 배수라 $$q' \mid k$$다. 곧 $$k \ge q'$$이고 $$M \ge pq' = pq/g$$다. 두 주기를 합친 상태가 $$pq/g$$마다 되풀이되고 그보다 일찍 처음 모습으로 돌아오지 않는 것은 [16_brute-force_verify.py](/Hongs_Blog/studies/algorithms/code/16_brute-force_verify/)가 $$p, q \le 20$$의 모든 쌍에서 확인했다.
{% endraw %}
