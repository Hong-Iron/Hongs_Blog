---
layout: "note"
title: "거듭제곱함수와 지수함수 비교"
display_title: "거듭제곱함수와 지수함수 비교"
kind: "concept"
kind_label: "비교"
num: "09"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["거듭제곱 vs 지수", "power vs exponential", "다항 시간 vs 지수 시간", "polynomial vs exponential time"]
description: "x^2과 2^x는 둘 다 \"제곱\"처럼 보이지만 변수가 있는 자리가 다르다. 가르는 질문은 \"변수가 밑에 있는가, 지수에 있는가\"다. 밑에 있으면 거듭제곱함수, 지수에 있으면 지수함수다. 결국에는 밑이 1보다 큰 지수함수가 어떤 거듭제곱함수보다도 커지지만, 언제 역전하는지는 계수에 …"
prev_url: "/studies/college-math/log-scale/"
prev_title: "로그함수와 로그 스케일"
next_url: "/studies/college-math/positional-notation/"
next_title: "진법과 자릿수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/power-vs-exponential/"
---
{% raw %}
$$x^2$$과 $$2^x$$는 둘 다 "제곱"처럼 보이지만 변수가 있는 자리가 다르다. 가르는 질문은 "변수가 밑에 있는가, 지수에 있는가"다. 밑에 있으면 거듭제곱함수, 지수에 있으면 지수함수다. 결국에는 밑이 1보다 큰 지수함수가 어떤 거듭제곱함수보다도 커지지만, 언제 역전하는지는 계수에 달려 있다[^1].

## 어느 쪽일까

상황마다 비용이 거듭제곱($$n^k$$ 꼴)인지 지수($$b^n$$ 꼴)인지 고르고, 다른 쪽이 왜 아닌지 쓴다.

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 원소 n개의 모든 부분집합 검사 (b) n×n 격자의 모든 칸 한 번씩 방문 (c) n개 중 서로 다른 두 개로 된 모든 쌍 검사 (d) 숫자 n자리 비밀번호를 모두 시도</summary>

**답:** (a) 지수 $$2^n$$. 원소마다 넣을지 뺄지 두 갈래가 $$n$$번 곱해진다. (b) 거듭제곱 $$n^2$$. 칸 수가 가로 × 세로다. (c) 거듭제곱 $$n(n-1)/2$$. 첫째를 $$n$$가지, 둘째를 $$n - 1$$가지 고르고 순서를 무시한다. (d) 지수 $$10^n$$. 자리마다 10가지가 $$n$$번 곱해진다.

**가르는 신호:** $$n$$이 "몇 번 곱하는가"를 정하면 지수, $$n$$이 "곱해지는 값"이면 거듭제곱이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** n¹⁰과 1.1ⁿ 중 n = 100에서 더 큰 쪽은? n이 한없이 커지면 어느 쪽이 더 큰가?</summary>

**답:** $$n = 100$$에서는 $$100^{10} = 10^{20}$$이 $$1.1^{100} \approx 13{,}781$$보다 훨씬 크다. 그러나 $$n \ge 686$$부터는 늘 $$1.1^n > n^{10}$$이다. 밑이 1보다 조금만 커도 지수함수가 결국 이긴다.

**흔한 오답:** 작은 $$n$$에서 비교한 결과를 그대로 믿는 것. 증가 속도는 충분히 큰 $$n$$에서 비교한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** n이 자연수일 때 n² < 2ⁿ은 언제부터 늘 맞는가? 두 식이 같은 n과 거꾸로인 n은?</summary>

**답:** $$n \ge 5$$부터 늘 맞는다. $$n = 2, 4$$에서는 같고($$4 = 4$$, $$16 = 16$$), $$n = 3$$에서는 $$9 > 8$$로 거꾸로다. "늘"을 증명하려면 이산수학의 [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)을 쓴다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: C2의 역전점을 정수 연산으로 $$n \le 5{,}000$$까지 확인, C3을 $$n \le 10{,}000$$까지 전수 확인, 아래 표의 수치 — [09_power-vs-exponential_verify.py](/Hongs_Blog/studies/college-math/code/09_power-vs-exponential_verify/)</div>

</div>


## 결정적 차이

| 기준 | 거듭제곱 $$x^k$$ | 지수 $$b^x$$ ($$b > 1$$) |
|---|---|---|
| 변수의 자리 | 밑 | 지수 |
| 입력을 1 늘리면 | 비율 $$\left(\frac{x+1}{x}\right)^k$$가 1로 줄어든다 | 늘 $$b$$배 |
| 입력을 2배로 하면 | 늘 $$2^k$$배 | 제곱이 된다: $$b^{2x} = (b^x)^2$$ |
| 로그-로그 그래프 | 기울기 $$k$$인 직선 | 위로 휘어 올라감 |
| 반로그 그래프 (세로축 상용로그 눈금) | 점점 평평해짐 | 기울기 $$\log_{10} b$$인 직선 |
| 역함수 | 거듭제곱근 $$x^{1/k}$$ | 로그 $$\log_b x$$ |
| 1000배 빠른 컴퓨터로 같은 시간에 풀 수 있는 입력 | $$n^2$$이면 약 31.6배 큰 입력 | $$2^n$$이면 약 10만큼 큰 입력 |

마지막 줄이 알고리즘에서 가장 중요한 차이다. 다항 시간 알고리즘은 컴퓨터가 빨라지면 푸는 문제의 크기가 몇 **배**로 커진다. 지수 시간 알고리즘은 몇 **개**만 늘어난다.

- 알고리즘에서: C++ 기준 교재의 입력 제한표에서 $$2^n$$ 방법은 $$n \le 20$$까지인데 $$n^2$$ 방법은 $$n \le 5{,}000$$까지 되는 것도 이 차이다([시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)). [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)을 짜기 전에 경우의 수를 셀 때도 맨 위의 가르는 질문으로 거듭제곱인지 지수인지 먼저 가른다. 제한의 $$n$$을 보고 지수 방법이 시간 안에 되는지 어림하는 연습은 [시간 복잡도 어림 예제 사다리](/Hongs_Blog/studies/algorithms/complexity-ladder/)의 문제 4다.

## 둘 다 아닐 때

증가 속도에는 두 부류 사이와 바깥에도 단계가 있다. 느린 것부터 늘어놓으면 다음과 같다.

$$\lg n \ \ll\ \sqrt{n} \ \ll\ n \ \ll\ n \lg n \ \ll\ n^2 \ \ll\ n^3 \ \ll\ 2^n \ \ll\ n! \ \ll\ n^n$$


- $$n \lg n$$은 거듭제곱도 지수도 아니지만 $$n$$과 $$n^{1.01}$$ 사이에 있다. 병합 정렬의 비용이다.
- $$n!$$은 지수보다 빠르다. $$n \ge 4$$이면 $$n! > 2^n$$이다. $$n$$개를 줄 세우는 모든 순서를 검사하는 비용이다.
- 이 순서의 증명은 이산수학의 [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)와 미분적분학의 [로피탈 정리](/Hongs_Blog/studies/calculus/lhopital-growth/)에서 한다.

[^1]: Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* 3판, 3.2절(밑이 1보다 큰 지수함수는 모든 다항식보다 빨리 자란다: $$n^b = o(a^n)$$). Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 14.7절 "Asymptotic Notation".
{% endraw %}
