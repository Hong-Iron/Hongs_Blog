---
layout: "note"
title: "가산 집합과 대각선 논법"
display_title: "가산 집합과 대각선 논법 (Countability and Diagonalization)"
kind: "concept"
kind_label: "정리"
num: "08"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Countable Set", "Diagonal Argument", "가산 집합", "셀 수 있는 집합", "countably infinite", "비가산 집합", "uncountable", "칸토어의 대각선 논법", "Cantor's diagonal argument", "칸토어 정리", "계산 불가능성", "uncomputable", "정지 문제", "halting problem"]
description: "원소에 1번, 2번, 3번… 번호를 빠짐없이 붙일 수 있으면 셀 수 있는(가산) 집합이다. 정수와 분수는 자연수보다 훨씬 많아 보이지만 번호를 붙일 수 있어 크기가 같다. 반면 실수나 끝없는 0·1의 나열은 어떤 번호 매기기로도 빠뜨리는 것이 반드시 생긴다(대각선 논법). 이 논법…"
prev_url: "/studies/discrete-math/function-properties/"
prev_title: "함수의 성질과 집합의 크기"
next_url: "/studies/discrete-math/relations/"
next_title: "관계와 그 성질"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/countability/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

원소에 1번, 2번, 3번… 번호를 빠짐없이 붙일 수 있으면 셀 수 있는(가산) 집합이다. 정수와 분수는 자연수보다 훨씬 많아 보이지만 번호를 붙일 수 있어 크기가 같다. 반면 실수나 끝없는 0·1의 나열은 어떤 번호 매기기로도 빠뜨리는 것이 반드시 생긴다(대각선 논법). 이 논법이 "어떤 문제는 어떤 프로그램으로도 풀 수 없다"는 결론의 뿌리다.

</div>


## 예시로 보기

손님이 꽉 찬 호텔에 방이 1번, 2번, 3번… 끝없이 있다. 새 손님이 오면 모두 한 칸씩 옮기면 1번 방이 빈다. 끝이 없는 집합은 자기의 일부와 크기가 같을 수 있다.

정수 전체도 자연수처럼 한 줄로 세울 수 있다.

| 번호 $$n$$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | … |
|---|---|---|---|---|---|---|---|---|
| 정수 $$f(n)$$ | 0 | −1 | 1 | −2 | 2 | −3 | 3 | … |

모든 정수가 언젠가 한 번씩, 딱 한 번 나온다. 이 줄 세우기가 아래 정의의 전단사 $$f: \mathbb{N} \to \mathbb{Z}$$($$\mathbb{Z}$$는 정수 전체)다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$\mathbb{N} = \{0, 1, 2, \dots\}$$에서 $$A$$로 가는 [전단사](/Hongs_Blog/studies/discrete-math/function-properties/)가 있으면 $$A$$를 **가산 무한**이라 한다. 유한하거나 가산 무한이면 **가산**(셀 수 있는), 아니면 **비가산**(셀 수 없는)이다[^1]. 가산 집합은 원소를 $$a_0, a_1, a_2, \dots$$로 빠짐없이 늘어놓을 수 있는 집합이다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. $$\mathbb{Z}$$와 $$\mathbb{Q}$$(유리수)는 가산이다.
2. 0과 1로 된 무한 수열 전체의 집합은 비가산이다. 따라서 실수 $$\mathbb{R}$$($$\mathbb{R}$$은 실수 전체)도 비가산이다.
3. (칸토어) 어떤 집합 $$A$$에서도 $$\mathcal{P}(A)$$로 가는 전사는 없다. 즉 $$\vert A\vert  < \vert \mathcal{P}(A)\vert $$다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. $$\mathbb{Z}$$는 위 표의 $$f(n) = n/2$$ ($$n$$ 짝수), $$-(n+1)/2$$ ($$n$$ 홀수). $$\mathbb{Q}$$는 기약분수 $$p/q$$($$q \ge 1$$)를 높이 $$\vert p\vert  + q$$가 작은 것부터 늘어놓는다. 높이가 같은 분수는 유한 개라 모든 유리수가 유한 번째 안에 나온다.
2. *귀류법:* 무한 비트열을 모두 $$s_0, s_1, s_2, \dots$$로 늘어놓을 수 있다고 하자. 새 비트열 $$d$$를 "$$d$$의 $$i$$번째 비트 = $$s_i$$의 $$i$$번째 비트를 뒤집은 것"으로 만든다. 그러면 $$d$$는 모든 $$i$$에서 $$s_i$$와 $$i$$번째 비트가 달라 목록 어디에도 없다. 모든 비트열을 늘어놓았다는 가정과 모순이다. 실수 $$[0,1)$$의 2진 전개가 비트열이므로 실수도 비가산이다(끝이 $$0111\ldots$$과 $$1000\ldots$$처럼 두 표현을 갖는 수는 가산 개라 결론이 바뀌지 않는다).
3. 전사 $$g: A \to \mathcal{P}(A)$$가 있다고 하자. $$D = \{a \in A : a \notin g(a)\}$$로 두면 전사라서 $$g(d) = D$$인 $$d$$가 있다. $$d \in D$$이면 정의로 $$d \notin g(d) = D$$, $$d \notin D$$이면 $$d \in g(d) = D$$. 어느 쪽이든 모순이다. ∎

</details>


## 예제

비트열 네 개의 앞 네 자리가 다음과 같을 때 대각선 비트열을 만든다.

| | 0번째 | 1번째 | 2번째 | 3번째 |
|---|---|---|---|---|
| $$s_0$$ | **1** | 0 | 1 | 1 |
| $$s_1$$ | 0 | **0** | 0 | 0 |
| $$s_2$$ | 1 | 1 | **1** | 0 |
| $$s_3$$ | 0 | 1 | 0 | **1** |

1. *대각선 읽기:* 굵은 칸은 1, 0, 1, 1이다.
2. *뒤집기:* $$d$$ = 0, 1, 0, 0.
3. *비교:* $$d$$는 $$s_0$$과 0번째, $$s_1$$과 1번째, $$s_2$$와 2번째, $$s_3$$과 3번째에서 다르다. 목록이 아무리 길어도 같은 방법으로 빠진 것을 만든다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$\mathbb{N} \to \mathbb{Z}$$ 전단사($$n \le 20{,}000$$), 높이 순 유리수 목록에 $$\vert p\vert , q \le 30$$인 모든 유리수가 있음, 무작위 비트열 목록 500개에서 대각선 비트열이 목록에 없음, 길이 순 문자열 번호 매기기 — [08_countability_verify.py](/Hongs_Blog/studies/discrete-math/code/08_countability_verify/)</div>

</div>


## 활용

- **풀 수 없는 문제가 있다.** 프로그램은 유한한 문자열이라 길이 순으로 번호를 매길 수 있다(가산). 반면 "자연수를 받아 예/아니오를 답하는 문제"는 무한 비트열과 짝이 맞아 비가산이다. 프로그램보다 문제가 많으므로 어떤 프로그램으로도 풀 수 없는 문제가 반드시 있다. 정지 문제는 그런 문제의 구체적인 예이고, 그 증명도 대각선 논법이다[^s1].
- **부동소수점의 한계.** 컴퓨터의 `float`는 유한 개뿐이다. 실수는 비가산이라 거의 모든 실수는 정확히 표현되지 않고 가장 가까운 값으로 반올림된다.
- **쌍 함수.** $$\mathbb{N} \times \mathbb{N}$$도 대각선 방향으로 세면 가산이다. 두 정수를 한 정수로 합치는 쌍 함수(pairing function)가 이 원리다.

## 연결

- 선수: [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/)(전단사로 크기 비교), [추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/)(귀류법)
- 같은 논법: 칸토어 정리의 $$D$$는 러셀의 역설([집합](/Hongs_Blog/studies/discrete-math/sets/))과 같은 자기 참조 구조다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 자연수 ℕ = {0, 1, 2, …}에서 정수 ℤ로 가는 전단사를 하나 식으로 쓰고, 처음 다섯 값을 쓰라.</summary>

**답:** $$f(n) = n/2$$ ($$n$$ 짝수), $$f(n) = -(n+1)/2$$ ($$n$$ 홀수). 처음 다섯 값은 $$0, -1, 1, -2, 2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 대각선 논법에서 만든 d가 목록의 어떤 sᵢ와도 같지 않은 이유를 정확히 쓰라.</summary>

**답:** $$d$$의 $$i$$번째 비트는 $$s_i$$의 $$i$$번째 비트를 뒤집은 것이라, 모든 $$i$$에 대해 $$d$$와 $$s_i$$는 적어도 $$i$$번째 자리에서 다르다. 한 자리라도 다르면 다른 수열이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어떤 프로그램으로도 풀 수 없는 예/아니오 문제가 반드시 존재하는 이유를 셀 수 있음으로 설명하라.</summary>

**답:** 프로그램은 유한한 문자열이라 길이 순으로 모두 번호를 붙일 수 있어 가산이다. 예/아니오 문제(자연수 → {0,1}인 함수)는 무한 비트열과 전단사라 비가산이다. 가산 집합에서 비가산 집합으로 가는 전사는 없으므로, 어떤 프로그램도 풀지 못하는 문제가 남는다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 8장 "Infinite Sets"(무한 집합의 크기, 대각선 논법, 칸토어 정리, 정지 문제)
[^s1]: 에이전트 보충. 정지 문제의 결정 불가능성은 튜링(1936)의 결과다. 이 문서는 "셀 수 있는 프로그램 vs 셀 수 없는 문제"라는 개수 논증만 보인다. 정지 문제 자체의 증명은 계산 이론 과목의 범위다.
{% endraw %}
