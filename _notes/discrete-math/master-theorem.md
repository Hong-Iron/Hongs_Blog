---
layout: "note"
title: "분할 정복 점화식과 마스터 정리"
display_title: "분할 정복 점화식과 마스터 정리 (Master Theorem)"
kind: "concept"
kind_label: "정리"
num: "25"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Master Theorem", "마스터 정리", "마스터 방법", "master method", "분할 정복 점화식", "divide-and-conquer recurrence", "재귀 트리", "recursion tree", "임계 지수", "critical exponent"]
description: "문제를 같은 크기의 조각 여러 개로 나눠 풀고 합치는 알고리즘의 비용을, 층마다 드는 일의 합으로 본다. 아래층으로 갈수록 일이 줄면 맨 위(나누고 합치는 일)가, 늘면 맨 아래(조각의 개수)가 전체를 정하고, 같으면 층 수만큼 곱해진다. 이 세 갈래를 공식으로 만든 것이 마스터 …"
prev_url: "/studies/discrete-math/asymptotic-notation/"
prev_title: "점근 표기"
next_url: "/studies/discrete-math/modular-arithmetic/"
next_title: "나눗셈과 합동"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/master-theorem/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

문제를 같은 크기의 조각 여러 개로 나눠 풀고 합치는 알고리즘의 비용을, 층마다 드는 일의 합으로 본다. 아래층으로 갈수록 일이 줄면 맨 위(나누고 합치는 일)가, 늘면 맨 아래(조각의 개수)가 전체를 정하고, 같으면 층 수만큼 곱해진다. 이 세 갈래를 공식으로 만든 것이 마스터 정리라 대부분의 분할 정복을 한 줄로 푼다. 다만 조각 크기가 서로 다르거나, 크기가 나눗셈이 아니라 뺄셈으로 줄거나, 두 갈래 사이의 틈에 걸리면 쓸 수 없다.

</div>


## 예시로 보기

$$n = 16$$에서 세 점화식을 층별로 펼친다. $$T(1) = 1$$이다. 0층은 원래 문제이고, 한 층 내려갈 때마다 조각이 $$a$$배로 늘고 크기는 절반이 된다.

| 층 | $$2T(n/2) + n$$ | $$4T(n/2) + n$$ | $$T(n/2) + n$$ |
|---|---|---|---|
| 0 | 16 | 16 | 16 |
| 1 | 2×8 = 16 | 4×8 = 32 | 8 |
| 2 | 4×4 = 16 | 16×4 = 64 | 4 |
| 3 | 8×2 = 16 | 64×2 = 128 | 2 |
| 잎 | 16×1 = 16 | 256×1 = 256 | 1 |
| 합 | 80 | 496 | 31 |
| 층 비율 | 1배 (고름) | 2배 (아래가 무거움) | ½배 (위가 무거움) |

가운데 열은 합 496 중 절반 이상이 잎에서 나오고, 오른쪽 열은 절반 이상이 맨 위에서 나온다. 가운데는 잎의 개수 $$4^{\lg n} = n^2$$, 오른쪽은 맨 위의 $$n$$, 왼쪽은 "한 층의 $$n$$ × 층 수 $$\lg n$$"이 답의 모양이다. 조각 수 2·4·1이 아래 정리의 $$a$$, 절반의 2가 $$b$$, 더하는 $$n$$이 $$f(n)$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">마스터 정리</div>

상수 $$a \ge 1$$, $$b > 1$$과 충분히 큰 $$n$$에서 양수인 $$f(n)$$에 대해 $$T(n) = a\,T(n/b) + f(n)$$이라 하자($$n/b$$는 올림이나 내림이어도 된다). 잎의 개수를 나타내는 **임계 지수** $$p = \log_b a$$와 $$f$$를 비교한다[^1].
1. 어떤 $$\varepsilon > 0$$에 대해 $$f(n) = O(n^{p - \varepsilon})$$이면 $$T(n) = \Theta(n^p)$$.
2. $$f(n) = \Theta(n^p)$$이면 $$T(n) = \Theta(n^p \lg n)$$.
3. 어떤 $$\varepsilon > 0$$에 대해 $$f(n) = \Omega(n^{p + \varepsilon})$$이고, 어떤 상수 $$c < 1$$로 충분히 큰 $$n$$에서 $$a f(n/b) \le c f(n)$$(정칙 조건)이면 $$T(n) = \Theta(f(n))$$.

</div>


시험과 실제 분석에서는 $$f(n) = \Theta(n^d)$$인 경우가 대부분이다. 이때는 층 비율 $$r = a/b^d$$ 하나로 갈린다.

| 조건 | 뜻 | 결과 |
|---|---|---|
| $$a < b^d$$ ($$d > p$$) | 층마다 일이 줄어든다 | $$\Theta(n^d)$$ |
| $$a = b^d$$ ($$d = p$$) | 층마다 일이 같다 | $$\Theta(n^d \lg n)$$ |
| $$a > b^d$$ ($$d < p$$) | 층마다 일이 늘어난다 | $$\Theta(n^{\log_b a})$$ |

$$f$$가 다항식이면 정칙 조건은 저절로 성립한다. $$a f(n/b) = \frac{a}{b^d} n^d$$이고 $$\frac{a}{b^d} < 1$$이 곧 $$c$$가 되기 때문이다.

## 증명

재귀 트리의 층별 비용을 등비급수로 더한다. 다항식판을 $$n = b^k$$에서 증명한다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *층의 모양:* $$j$$층에는 크기 $$n/b^j$$인 조각이 $$a^j$$개 있다. 조각 크기가 1이 되는 $$k = \log_b n$$층이 잎이다.
2. *잎의 수:* $$a^k = a^{\log_b n} = n^{\log_b a}$$. 양변에 $$\log_b$$를 취하면 둘 다 $$\log_b n \cdot \log_b a$$라 같다. 잎 하나의 비용은 상수라 잎층 전체는 $$\Theta(n^p)$$다.
3. *안쪽 층:* $$j$$층의 비용은 $$a^j \left(\frac{n}{b^j}\right)^d = n^d \left(\frac{a}{b^d}\right)^j = n^d r^j$$. 그래서 $$T(n) = \Theta(n^p) + n^d \sum_{j=0}^{k-1} r^j$$.
4. *$$r < 1$$:* [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)가 $$\frac{1}{1 - r}$$ 미만이라 안쪽 합은 $$\Theta(n^d)$$. $$r < 1$$은 $$d > p$$와 같아 잎층 $$n^p$$보다 크다. 합은 $$\Theta(n^d)$$.
5. *$$r = 1$$:* 층마다 $$n^d$$이고 층이 $$k = \log_b n$$개라 $$n^d \log_b n$$. $$d = p$$라 잎층도 같은 크기다. 합은 $$\Theta(n^d \lg n)$$(로그의 밑은 상수배 차이).
6. *$$r > 1$$:* 등비급수는 마지막 항의 상수배라 $$\Theta(n^d r^{k})$$이다. $$n^d r^k = n^d \frac{a^k}{(b^k)^d} = a^k = n^p$$라 합은 $$\Theta(n^p)$$. ∎

일반적인 $$f$$는 3의 합 $$\sum_j a^j f(n/b^j)$$에 경우별 가정을 넣어 같은 방식으로 위아래를 묶는다. 경우 3에서는 정칙 조건이 "층마다 $$c$$배 이하로 준다"를 보장해 등비급수 묶음을 가능하게 한다[증명 스케치]. $$n$$이 $$b$$의 거듭제곱이 아닐 때 올림·내림을 해도 결과가 같다는 부분은 [증명 생략: Cormen et al. 3판 4.6.2절].

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계의 $$a^{\log_b n} = n^{\log_b a}$$는 어떻게 나오는가?</summary>

양변에 $$\log_b$$를 취하면 왼쪽은 $$\log_b n \cdot \log_b a$$, 오른쪽은 $$\log_b a \cdot \log_b n$$이다. 곱의 순서만 다르다. 이 등식이 "잎의 수"를 $$n$$의 거듭제곱으로 바꿔 $$f(n)$$과 비교할 수 있게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 6단계에서 등비급수가 "마지막 항의 상수배"인 이유는?</summary>

비율 $$r > 1$$이면 $$\sum_{j=0}^{k-1} r^j = \frac{r^k - 1}{r - 1} < \frac{1}{r - 1} r^k$$이다. $$r$$은 $$n$$과 무관한 상수라 $$\frac{1}{r - 1}$$도 상수다([합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)의 등비 어림).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

점화식을 층별 합으로 펼치면 등비급수가 되고, 등비급수는 가장 큰 항(맨 위, 맨 아래)이 지배하거나 모든 항이 같다. 세 경우는 이 세 가지 모양이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓸 수 있는 다른 상황은?</summary>

조각 크기가 다른 $$T(n/3) + T(2n/3) + n$$도 재귀 트리로 층별 합을 어림해 푼다. 힙 만들기의 $$O(n)$$ 분석도 "높이별 개수 × 비용"의 합이다.

</details>


## 가정이 필요한 이유

| 가정 | 없으면 | 예 |
|---|---|---|
| 조각의 크기가 모두 $$n/b$$ | 정리의 모양이 아니라 쓸 수 없다 | $$T(n/3) + T(2n/3) + n$$은 재귀 트리로 $$\Theta(n\lg n)$$ |
| 크기가 나눗셈으로 준다($$b > 1$$) | 층 수가 $$\log_b n$$이 아니라 $$n$$이 된다 | $$T(n - 1) + n = \frac{n(n+1)}{2} = \Theta(n^2)$$([선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)으로 푼다) |
| 경우 1·3의 $$\varepsilon$$ (다항식만큼 차이) | 경우 사이의 틈에 빠진다 | $$2T(n/2) + n/\lg n = \Theta(n \lg\lg n)$$ (카드 C4) |
| 경우 3의 정칙 조건 | 결론이 틀릴 수 있다 | $$T(n/2) + f(n)$$, $$f(n)$$은 $$\lg n$$이 짝수면 $$n^2$$, 홀수면 $$n$$: $$\lg n$$이 홀수인 $$n$$에서 $$T(n) \ge f(n/2) = n^2/4$$인데 $$f(n) = n$$이라 $$\Theta(f)$$가 아니다[^s1] |

**역은 성립하지 않는다.** $$T(n) = \Theta(n^p)$$라고 경우 1인 것은 아니다. $$2T(n/2) + n/\lg^2 n$$은 층 비용 $$\frac{n}{(\lg n - j)^2}$$의 합이 $$n\sum \frac{1}{i^2} = O(n)$$이라 $$\Theta(n)$$이지만, $$f = n/\lg^2 n$$은 어떤 $$\varepsilon$$으로도 $$O(n^{1 - \varepsilon})$$이 아니다[^s1].

## 예제

**카라츠바 곱셈.** $$n$$자리 두 수의 곱을 $$n/2$$자리 곱 3번과 덧셈 $$\Theta(n)$$으로 푼다. $$T(n) = 3T(n/2) + \Theta(n)$$.

1. *$$a, b, f$$:* $$a = 3$$, $$b = 2$$, $$f(n) = \Theta(n^1)$$이라 $$d = 1$$.
2. *비교:* $$b^d = 2 < 3 = a$$. 층마다 일이 1.5배로 는다(아래가 무거움).
3. *결과:* $$\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})$$. 곱 4번으로 나누는 단순한 방법 $$4T(n/2) + n = \Theta(n^2)$$보다 빠르다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 여덟 점화식을 $$n = b^k$$에서 정확히 계산해 $$T(n)/g(n)$$이 일정한 값으로 모이는지 확인(실험), 예시 표의 층별 값, 층 비율과 경우의 대응, 틈에 빠지는 예와 역의 반례, 정칙 조건 반례, $$T(n/3) + T(2n/3) + n$$ — [25_master-theorem_verify.py](/Hongs_Blog/studies/discrete-math/code/25_master-theorem_verify/). 정리 자체는 위의 증명(다항식판)과 Cormen et al. 4.6절이 근거다.</div>

</div>


## 활용

| 알고리즘 | 점화식 | 결과 |
|---|---|---|
| 이진 탐색 | $$T(n/2) + \Theta(1)$$ | $$\Theta(\lg n)$$ |
| 병합 정렬 | $$2T(n/2) + \Theta(n)$$ | $$\Theta(n \lg n)$$ |
| 카라츠바 곱셈 | $$3T(n/2) + \Theta(n)$$ | $$\Theta(n^{\lg 3}) \approx n^{1.585}$$ |
| 단순 분할 행렬 곱 | $$8T(n/2) + \Theta(n^2)$$ | $$\Theta(n^3)$$ |
| 슈트라센 행렬 곱 | $$7T(n/2) + \Theta(n^2)$$ | $$\Theta(n^{\lg 7}) \approx n^{2.807}$$ |

- **설계의 지렛대.** 아래가 무거운 경우($$a > b^d$$)에는 조각 수 $$a$$를 줄여야 빨라진다. 카라츠바(4 → 3)와 슈트라센(8 → 7)이 그 예다[^2]. 위가 무거운 경우에는 $$a$$를 줄여도 소용없고 나누고 합치는 $$f(n)$$을 줄여야 한다.
- **흔한 실수.** $$\log_b a$$에서 $$a$$와 $$b$$를 바꿔 쓰기. $$f(n)$$을 $$n^{\log_b a}$$가 아니라 늘 $$n$$과 비교하기. 연습은 [마스터 정리 예제 사다리](/Hongs_Blog/studies/discrete-math/master-theorem-ladder/).
- 알고리즘에서: 표의 병합 정렬이 실제로 반으로 나눠 합치는 과정은 [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)에 있다. 표의 이진 탐색이 찾는 구간을 반씩 좁혀 가는 과정과, 그것이 맞다는 루프 불변식 증명은 [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)에 있다.

## 연결

- 선수: [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)
- 증명의 도구: [등비급수](/Hongs_Blog/studies/college-math/geometric-series/), [합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)
- 뺄셈으로 줄어드는 점화식: [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)
- 일반화: 조각 크기가 서로 달라도 되는 아크라–바치(Akra–Bazzi) 정리[^1]

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"분할 정복 점화식이면 마스터 정리로 다 풀린다"</div>

틀렸다. 교재의 예제가 대부분 $$aT(n/b) + n^d$$ 꼴이라 모든 재귀가 그렇게 보인다. 하지만 퀵정렬이 3 : 7로 나뉘면 $$T(0.3n) + T(0.7n) + n$$처럼 조각 크기가 다르고, 하노이 탑은 $$2T(n - 1) + 1$$처럼 뺄셈으로 준다. 이런 경우에도 재귀 트리는 쓸 수 있다. $$T(n/3) + T(2n/3) + n$$은 층마다 비용이 $$n$$ 이하이고 층 수가 $$\log_3 n$$에서 $$\log_{3/2} n$$ 사이라 $$\Theta(n \lg n)$$이다. 계산해 보면 $$T(n)/(n\lg n)$$이 1 근처에 머문다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$f(n)$$이 $$n^{\log_b a}$$보다 크기만 하면 경우 3이다"</div>

틀렸다. "크다"가 아니라 "$$n^\varepsilon$$배 이상 크다"여야 한다. $$\lg n$$배 차이는 어떤 $$n^\varepsilon$$보다도 느리게 자라서 경우 2와 3 사이의 틈에 빠진다. $$2T(n/2) + n\lg n$$은 경우 3이 아니고 $$\Theta(n \lg^2 n)$$이다(층마다 비용이 $$n\lg(n/2^j)$$로 조금씩 줄어 합이 $$n\lg^2 n$$의 상수배)[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** T(n) = aT(n/b) + Θ(n^d)의 세 경우를 a, b, d의 조건과 결과로 쓰라.</summary>

**답:** $$a < b^d$$이면 $$\Theta(n^d)$$, $$a = b^d$$이면 $$\Theta(n^d \lg n)$$, $$a > b^d$$이면 $$\Theta(n^{\log_b a})$$.

**흔한 오답:** 세 번째 결과를 $$\Theta(n^{\log_a b})$$로 쓰는 것. 잎의 수는 $$a^{\log_b n} = n^{\log_b a}$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음을 풀라. (a) 3T(n/2) + n (b) 7T(n/2) + n² (c) T(n/2) + 1 (d) 2T(n/2) + n²</summary>

**답:** (a) $$3 > 2$$라 $$\Theta(n^{\lg 3}) \approx n^{1.585}$$. (b) $$7 > 4$$라 $$\Theta(n^{\lg 7}) \approx n^{2.807}$$. (c) $$1 = 2^0$$이라 $$\Theta(\lg n)$$. (d) $$2 < 4$$라 $$\Theta(n^2)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 재귀 트리의 층 비율 a/b^d로, 경우 2에 lg n이 붙는 이유와 경우 3에서 답이 f(n)이 되는 이유를 설명하라.</summary>

**답:** $$j$$층의 비용은 $$n^d (a/b^d)^j$$다. 비율이 1이면 모든 층이 $$n^d$$이고 층이 $$\log_b n$$개라 $$n^d \lg n$$이다. 비율이 1보다 작으면 층 비용이 등비급수로 줄어 합이 첫 항 $$n^d = f(n)$$의 상수배다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** T(n) = 2T(n/2) + n/lg n이 마스터 정리의 어느 경우에도 들지 않는 이유를 설명하고, 재귀 트리로 답을 구하라.</summary>

**답:** $$p = 1$$이다. $$n/\lg n$$은 $$n$$보다 작지만 $$\lg n$$배만 작아서 어떤 $$\varepsilon > 0$$에 대해서도 $$O(n^{1 - \varepsilon})$$이 아니고(경우 1 아님), $$\Theta(n)$$도 아니다(경우 2 아님). $$n = 2^k$$에서 $$j$$층의 비용은 $$2^j \cdot \frac{n/2^j}{k - j} = \frac{n}{k - j}$$이라 합은 $$n(1 + \frac12 + \cdots + \frac1k) = nH_k = \Theta(n \lg\lg n)$$이다.

</details>


[^1]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 4.4절(재귀 트리), 4.5절(마스터 방법), 4.6절(증명). 아크라–바치 정리는 Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 22장 "Recurrences".
[^2]: 카라츠바 곱셈은 Kleinberg·Tardos, *Algorithm Design*, 5장. 슈트라센 알고리즘은 Cormen et al. 3판, 4.2절.
[^s1]: 에이전트 보충. 정칙 조건의 반례, 역의 반례, $$2T(n/2) + n\lg n$$의 답은 재귀 트리의 층별 합으로 유도했고 $$n = 2^k$$에서 정확히 계산해 확인했다(25_master-theorem_verify.py).
{% endraw %}
