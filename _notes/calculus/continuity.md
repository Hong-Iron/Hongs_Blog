---
layout: "note"
title: "연속과 사잇값 정리"
display_title: "연속과 사잇값 정리 (Continuity and the Intermediate Value Theorem)"
kind: "concept"
kind_label: "정리"
num: "02"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Continuity", "Intermediate Value Theorem", "연속", "연속함수", "continuous function", "불연속", "discontinuity", "사잇값 정리", "IVT", "최대·최소 정리", "extreme value theorem", "이분법", "bisection method"]
description: "연속은 그래프를 펜을 떼지 않고 그릴 수 있다는 뜻으로, 그 점의 극한값과 함숫값이 같다는 것이다. 연속함수가 구간의 양 끝에서 부호가 다르면 그 사이 어딘가에서 반드시 0을 지난다(사잇값 정리). 이것이 \"반씩 줄여 가며 근을 찾는\" 이분법의 근거다. 단, 구간 안에 끊긴 곳이 …"
prev_url: "/studies/calculus/limits/"
prev_title: "극한"
next_url: "/studies/calculus/sequence-limits/"
next_title: "수열의 극한과 e"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/continuity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연속은 그래프를 펜을 떼지 않고 그릴 수 있다는 뜻으로, 그 점의 극한값과 함숫값이 같다는 것이다. 연속함수가 구간의 양 끝에서 부호가 다르면 그 사이 어딘가에서 반드시 0을 지난다(사잇값 정리). 이것이 "반씩 줄여 가며 근을 찾는" 이분법의 근거다. 단, 구간 안에 끊긴 곳이 하나라도 있으면 이 보장은 사라진다.

</div>


## 예시로 보기

$$f(x) = x^3 - x - 2$$는 $$f(1) = -2 < 0$$, $$f(2) = 4 > 0$$이다. 연속함수라서 1과 2 사이에 근이 있다. 구간을 반으로 나눠 부호가 바뀌는 쪽을 남기기를 되풀이한다(이분법).

| 단계 | 구간 | 중점 $$m$$ | $$f(m)$$의 부호 | 남는 구간 |
|---|---|---|---|---|
| 1 | $$[1, 2]$$ | 1.5 | − | $$[1.5, 2]$$ |
| 2 | $$[1.5, 2]$$ | 1.75 | + | $$[1.5, 1.75]$$ |
| 3 | $$[1.5, 1.75]$$ | 1.625 | + | $$[1.5, 1.625]$$ |
| 4 | $$[1.5, 1.625]$$ | 1.5625 | + | $$[1.5, 1.5625]$$ |
| 5 | $$[1.5, 1.5625]$$ | 1.53125 | + | $$[1.5, 1.53125]$$ |

구간이 매번 절반이 되어 근 $$x \approx 1.52138$$로 좁혀진다. 구간의 양 끝이 아래 정리의 $$a$$, $$b$$이고, 0이 사잇값 $$y$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

함수 $$f$$가 $$a$$에서 **연속**이라는 것은 다음 세 조건이 모두 맞는다는 뜻이다[^1].
1. $$f(a)$$가 정의되어 있다.
2. $$\lim_{x \to a} f(x)$$($$\lim$$은 한없이 가까이 갈 때 다가가는 값(극한))가 있다.
3. 둘이 같다: $$\lim_{x \to a} f(x) = f(a)$$.

구간의 모든 점에서 연속이면 그 구간에서 연속이라 한다(끝점은 한쪽 극한으로 본다). 다항식, 지수·로그, 삼각함수는 정의역에서 연속이고, 연속함수의 합·곱·몫(분모가 0이 아닐 때)·합성도 연속이다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. **사잇값 정리:** $$f$$가 $$[a, b]$$에서 연속이고 $$y$$가 $$f(a)$$와 $$f(b)$$ 사이의 값이면, $$f(c) = y$$인 $$c \in [a, b]$$($$\in$$은 "~에 속한다")가 있다. 특히 $$f(a)$$와 $$f(b)$$의 부호가 다르면 $$[a, b]$$ 안에 근이 있다.
2. **최대·최소 정리:** $$f$$가 닫힌 구간 $$[a, b]$$에서 연속이면 최댓값과 최솟값을 그 구간 안에서 가진다[^2].

[증명 생략: 두 정리 모두 실수의 완비성(빈틈없음)에 기대며, OpenStax 교재도 증명 없이 쓴다.]

</div>


**가정의 필요성.** $$f(x) = 1/x$$는 $$f(-1) < 0 < f(1)$$이지만 $$[-1, 1]$$에서 0이 되는 점이 없다. $$x = 0$$에서 끊겨 연속이 아니기 때문이다. 최대·최소 정리도 열린 구간이면 깨진다. $$f(x) = x$$는 $$(0, 1)$$에서 최댓값이 없다.

## 예제

오차 $$10^{-6}$$ 이하로 근을 찾으려면 이분법을 몇 번 해야 하는가? (처음 구간 길이 1)

1. *한 번에 줄어드는 비율:* 구간 길이가 매번 절반.
2. *조건 세우기:* $$k$$번 뒤 길이 $$1/2^k \le 10^{-6}$$.
3. *로그로 풀기:* $$k \ge \lg 10^6 \approx 19.93$$이므로 $$k = 20$$번.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이분법 표의 중점과 부호, 근 1.52138, 20번이면 충분, $$1/x$$의 반례, 첫 나쁜 커밋 찾기가 $$\lceil \lg n \rceil$$번 안에 끝남 — [02_continuity_verify.py](/Hongs_Blog/studies/calculus/code/02_continuity_verify/)</div>

</div>


## 활용

- **이분법.** 방정식의 근을 구하는 가장 튼튼한 방법이다. 연속이고 양 끝의 부호만 다르면 늘 수렴하고, 한 번에 1비트씩 정확해진다. 대신 느려서, 빠른 [뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)과 섞어 쓰기도 한다.
- **git bisect.** 커밋 1000개 중 버그가 처음 생긴 커밋을 10번 안팎의 테스트로 찾는다. "이 커밋에 버그가 있는가"가 어느 지점부터 쭉 참인 단조 술어라서, 사잇값 정리의 이산판처럼 경계를 반으로 좁힐 수 있다[^s1].
- **답을 이분 탐색하기.** "용량 $$C$$로 기한 안에 끝낼 수 있는가"처럼 답이 커질수록 한 번 참이면 계속 참인 문제는, 답 자체를 이분 탐색해 최솟값을 찾는다.
- 알고리즘에서: 바로 위 항목의 방법이 [매개변수 탐색](/Hongs_Blog/studies/algorithms/parametric-search/)이고, 정렬된 배열에서 경계를 찾는 정수판이 [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)이다(두 문서에 루프 불변식 증명이 있다). [징검다리](/Hongs_Blog/studies/algorithms/pg43236/)는 "바위 사이 간격을 모두 $$d$$ 이상으로 만들 수 있나"를 묻고, 0부터 도착점까지의 거리(최대 10억)를 범위로 판정 약 30번 만에 가장 큰 $$d$$를 찾는다. [시험장 나누기](/Hongs_Blog/studies/algorithms/pg81305/)에서 그룹 수를 정확히 $$k$$와 비교하면 "한 번 되면 계속 된다"가 깨져, 끊긴 함수에 이분법을 쓴 것처럼 엉뚱한 답으로 좁혀진다. 그 밖에 [징검다리 건너기](/Hongs_Blog/studies/algorithms/pg64062/)에서도 쓴다.

## 연결

- 선수: [극한](/Hongs_Blog/studies/calculus/limits/)
- 이어지는 개념: [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/)(최대·최소 정리), [선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)
- 브리지: [매개변수 탐색 ↔ 사잇값 정리](/Hongs_Blog/studies/algorithms/parametric-search-ivt/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 함수가 a에서 연속이라는 것의 세 조건을 쓰라.</summary>

**답:** $$f(a)$$가 정의되고, $$\lim_{x \to a} f(x)$$가 있고, 둘이 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** f(x) = x³ − x − 2를 [1, 2]에서 이분법으로 세 번 좁힌다. 각 단계의 중점, f(중점)의 부호, 남는 구간을 쓰라.</summary>

**답:** 1.5(−) → $$[1.5, 2]$$, 1.75(+) → $$[1.5, 1.75]$$, 1.625(+) → $$[1.5, 1.625]$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 양 끝에서 부호가 다른데도 구간 안에 근이 없는 함수를 들고, 사잇값 정리의 어느 가정이 깨졌는지 쓰라.</summary>

**답:** $$f(x) = 1/x$$를 $$[-1, 1]$$에서 보면 $$f(-1) = -1$$, $$f(1) = 1$$인데 0이 되는 점이 없다. $$x = 0$$에서 정의되지 않아 연속이라는 가정이 깨졌다.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 2.4절 "Continuity"(연속의 세 조건, 사잇값 정리)
[^2]: OpenStax, *Calculus Volume 1*, 4.3절 "Maxima and Minima"(최대·최소 정리)
[^s1]: 에이전트 보충. `git bisect`는 커밋 이력을 이분 탐색해 문제를 처음 일으킨 커밋을 찾는 git 명령이다.
{% endraw %}
