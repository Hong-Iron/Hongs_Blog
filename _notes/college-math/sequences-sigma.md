---
layout: "note"
title: "수열과 합의 기호"
display_title: "수열과 합의 기호 (Sequences and Summation)"
kind: "concept"
kind_label: "정의"
num: "20"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Sequences", "Summation Notation", "수열", "시그마", "sigma notation", "Σ", "등차수열", "arithmetic sequence", "등비수열", "geometric sequence", "등차급수", "망원합", "telescoping sum", "가우스 합"]
description: "수열은 번호를 붙여 줄 세운 수이고, 시그마(Σ)는 그 수들을 \"여기부터 저기까지 더하라\"는 약속이다. 반복문이 한 바퀴 돌 때마다 드는 비용을 더하는 것이 곧 Σ 계산이라, 알고리즘 분석의 기본 언어가 된다. 같은 수를 더해 가면 등차수열, 같은 수를 곱해 가면 등비수열이다. 다…"
prev_url: "/studies/college-math/euler-formula/"
prev_title: "복소수의 극형식과 오일러 공식"
next_url: "/studies/college-math/geometric-series/"
next_title: "등비급수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/sequences-sigma/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

수열은 번호를 붙여 줄 세운 수이고, 시그마(Σ)는 그 수들을 "여기부터 저기까지 더하라"는 약속이다. 반복문이 한 바퀴 돌 때마다 드는 비용을 더하는 것이 곧 Σ 계산이라, 알고리즘 분석의 기본 언어가 된다. 같은 수를 더해 가면 등차수열, 같은 수를 곱해 가면 등비수열이다. 다만 어디서 시작해 어디서 끝나는지를 한 칸만 잘못 잡아도 답이 달라진다.

</div>


## 예시로 보기

이 코드의 안쪽 줄은 몇 번 실행될까?

```python
for i in range(n):        # i = 0, 1, ..., n-1
    for j in range(i):    # 이번 바퀴에 i번
        work()
```

바깥 반복의 $$i$$번째 바퀴에서 안쪽이 $$i$$번 돈다. 모두 더하면 $$0 + 1 + 2 + \cdots + (n - 1)$$이고, Σ로 쓰면 $$\sum_{i=0}^{n-1} i$$다. 아래에서 이 값이 $$\frac{n(n-1)}{2}$$임을 보인다. 여기서 바퀴 번호 $$i$$가 합의 첨자(index), 한 바퀴의 비용 $$i$$가 수열의 항 $$a_i$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**수열**은 정수 번호에 수를 대응시키는 함수 $$a: \{m, m+1, \dots\} \to \mathbb{R}$$($$\mathbb{R}$$은 실수 전체)이고, $$a(k)$$를 $$a_k$$로 쓴다[^1].
- 등차수열: $$a_k = a_1 + (k - 1)d$$. 이웃한 항의 **차**가 늘 $$d$$다.
- 등비수열: $$a_k = a_1 r^{k-1}$$. 이웃한 항의 **비**가 늘 $$r$$이다.

**합의 기호.** 정수 $$m \le n$$에 대해 $$\sum_{k=m}^{n} a_k = a_m + a_{m+1} + \cdots + a_n$$. 항의 개수는 $$n - m + 1$$이다. $$n < m$$이면 빈 합으로 보고 $$0$$으로 정한다[^2].

</div>


Σ는 다음 규칙으로 다룬다.

| 규칙 | 식 | 뜻 |
|---|---|---|
| 상수 합 | $$\sum_{k=m}^{n} c = (n - m + 1)c$$ | 항 개수 × 상수 |
| 선형성 | $$\sum (c\,a_k + b_k) = c\sum a_k + \sum b_k$$ | 곱한 상수는 밖으로, 합은 나눠서 |
| 구간 나누기 | $$\sum_{k=m}^{n} a_k = \sum_{k=m}^{p} a_k + \sum_{k=p+1}^{n} a_k$$ | 중간에서 끊어 더하기 |
| 첨자 옮기기 | $$\sum_{k=m}^{n} a_k = \sum_{j=m-1}^{n-1} a_{j+1}$$ | $$k = j + 1$$로 이름 바꾸기 |
| 망원합 | $$\sum_{k=m}^{n} (b_{k+1} - b_k) = b_{n+1} - b_m$$ | 가운데 항이 모두 지워진다 |

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. $$\displaystyle\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$$
2. 등차수열의 합: $$\displaystyle\sum_{k=1}^{n} a_k = \frac{n(a_1 + a_n)}{2}$$ (항 개수 × 첫 항과 끝 항의 평균)
3. \$$\displaystyle\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$$

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1·2. *짝 맞추기:* 합 $$S$$를 거꾸로 한 번 더 적어 위아래를 더한다. $$a_1 + a_n$$, $$a_2 + a_{n-1}$$, … 모든 짝이 $$a_1 + a_n$$으로 같다(앞에서 $$d$$만큼 늘면 뒤에서 $$d$$만큼 준다). 짝이 $$n$$개이므로 $$2S = n(a_1 + a_n)$$. $$a_k = k$$이면 1이다.

{: start="3"}
3. *망원합:* $$(k+1)^3 - k^3 = 3k^2 + 3k + 1$$을 $$k = 1$$부터 $$n$$까지 더한다. 왼쪽은 망원합이라 $$(n+1)^3 - 1$$, 오른쪽은 $$3\sum k^2 + 3\cdot\frac{n(n+1)}{2} + n$$이다. $$\sum k^2$$에 대해 풀어 정리하면 공식이 나온다. ∎

</details>


<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/20_sequences-sigma_fig1.svg" alt="그림" width="484" height="335" loading="lazy">

파란 막대 1, 2, …, 6 위에 거꾸로 6, 5, …, 1(주황)을 얹으면 모든 막대의 높이가 7이 된다. 직사각형 넓이 $$6 \times 7 = 42$$가 합의 두 배이므로 합은 21이다[^s1].

## 예제

$$\sum_{k=3}^{10}(2k + 1)$$을 구한다.

1. *항 개수:* $$10 - 3 + 1 = 8$$개.
2. *첫 항과 끝 항:* $$k = 3$$에서 7, $$k = 10$$에서 21. 차가 2로 일정한 등차수열이다.
3. *등차수열의 합:* $$8 \times \frac{7 + 21}{2} = 112$$.
4. *다른 방법으로 확인:* 선형성으로 $$2\sum_{k=3}^{10} k + 8 = 2 \times 52 + 8 = 112$$. ($$\sum_{k=3}^{10}k = 55 - 3 = 52$$)

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 공식을 $$n \le 2{,}000$$에서 전수 확인, 등차수열 합, 예제 112, 이중 반복문 두 가지의 실행 횟수를 직접 세어 비교, 망원합 — [20_sequences-sigma_verify.py](/Hongs_Blog/studies/college-math/code/20_sequences-sigma_verify/)</div>

</div>


## 활용

- **반복문 비용.** 이중 반복문에서 `for j in range(i)`이면 $$\frac{n(n-1)}{2}$$번, `for j in range(i, n)`이면 $$\frac{n(n+1)}{2}$$번이다. 둘 다 $$n^2$$의 절반쯤이다. 버블 정렬과 삽입 정렬의 최악 비교 횟수가 이 꼴이다.
- **하나 차이 오류(off-by-one).** `range(1, n)`은 $$n - 1$$개, `range(n + 1)`은 $$n + 1$$개다. Σ의 항 개수 공식 $$n - m + 1$$을 쓰면 헷갈리지 않는다.
- **점화식으로 가는 다리.** 등차수열은 $$a_k = a_{k-1} + d$$, 등비수열은 $$a_k = r\,a_{k-1}$$처럼 앞 항으로도 정할 수 있다. 이런 정의를 이산수학의 [점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)에서 일반적으로 다룬다.
- 알고리즘에서: 부분합 $$S_k = a_1 + \cdots + a_k$$($$S_0 = 0$$)를 배열에 적어 두면, 구간 합 $$\sum_{k=m}^{n} a_k$$는 구간 나누기에 따라 $$S_n - S_{m-1}$$이라 뺄셈 한 번으로 나온다([누적 합과 차분 배열](/Hongs_Blog/studies/algorithms/prefix-sum/)). n = 200,000이면 원소마다 앞부분을 다 훑는 이중 반복은 $$1 + 2 + \cdots + n \approx n^2/2 = 2 \times 10^{10}$$번이라 시간 안에 안 끝난다([시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)). $$\sum_{a=1}^{p}\sum_{b=1}^{q}\min(a, b)$$ 같은 이중 합을 구간으로 끊고 제곱의 합 공식으로 닫힌 식 하나로 바꾸면, 반복 대신 계산 한 번으로 끝난다([문자열의 아름다움](/Hongs_Blog/studies/algorithms/pg68938/)). 그 밖에 [파이썬 기본 문법](/Hongs_Blog/studies/algorithms/python-basics/), [투 포인터와 슬라이딩 윈도](/Hongs_Blog/studies/algorithms/two-pointers/)에서도 쓴다.

## 연결

- 선수: [함수](/Hongs_Blog/studies/college-math/function/)(수열은 정수에서 정의된 함수)
- 이어지는 개념: [등비급수](/Hongs_Blog/studies/college-math/geometric-series/), 이산수학의 [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)과 [합의 계산](/Hongs_Blog/studies/discrete-math/sums-asymptotics/), 미분적분학의 [리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\sum_{k=3}^{10} (2k + 1)$$을 구하라.</summary>

**답:** 항이 8개이고 첫 항 7, 끝 항 21인 등차수열이라 $$8 \times \frac{7 + 21}{2} = 112$$.

**흔한 오답:** 항 개수를 $$10 - 3 = 7$$로 세는 것. 양 끝을 모두 포함하므로 $$n - m + 1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드에서 count는 얼마인가? Σ로 쓴 뒤 닫힌 꼴로 구하라. `for i in range(n): for j in range(i, n): count += 1`</summary>

**답:** $$i$$번째 바퀴에서 안쪽이 $$n - i$$번 돈다. $$\sum_{i=0}^{n-1}(n - i) = n + (n-1) + \cdots + 1 = \frac{n(n+1)}{2}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 1 + 2 + … + n = n(n+1)/2가 맞는 이유를 짝 맞추기로 설명하라.</summary>

**답:** 합을 거꾸로 한 번 더 적어 위아래를 더하면 모든 짝이 $$n + 1$$이 되고 짝이 $$n$$개라 두 배 합이 $$n(n+1)$$이다. 한 쪽이 1씩 늘 때 다른 쪽이 1씩 줄어서 짝의 합이 일정하다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 11.1절 "Sequences and Their Notations", 11.2절 "Arithmetic Sequences", 11.3절 "Geometric Sequences"
[^2]: OpenStax, *Precalculus 2e*, 11.4절 "Series and Their Notations". Σ의 조작 규칙과 망원합은 Graham·Knuth·Patashnik, *Concrete Mathematics*, 2장 "Sums"의 방식이다.
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [20_sequences-sigma_plot.py](/Hongs_Blog/studies/college-math/code/20_sequences-sigma_plot/)로 그렸고, 그림에 쓴 값($$1 + 2 + \cdots + 6 = 21$$, $$2 \times 21 = 6 \times 7$$, $$n \le 2{,}000$$에서 공식 일치)을 같은 코드로 확인했다.
{% endraw %}
