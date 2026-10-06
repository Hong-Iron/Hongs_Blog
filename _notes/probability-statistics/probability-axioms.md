---
layout: "note"
title: "확률의 공리와 계산"
display_title: "확률의 공리와 계산 (Probability Axioms)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Probability Axioms", "확률의 공리", "콜모고로프 공리", "Kolmogorov axioms", "확률 측도", "probability measure", "고전적 확률", "naive definition of probability", "여사건 법칙", "complement rule", "합집합 한계", "union bound", "생일 문제", "birthday problem"]
description: "확률은 사건마다 0에서 1 사이의 수를 붙이는 규칙이다. 지켜야 할 약속은 셋뿐이다. 음수는 없고, 전체의 확률은 1이며, 겹치지 않는 사건들의 확률은 더한다. 결과가 모두 똑같이 그럴듯하면 \"원하는 경우의 수 ÷ 전체 경우의 수\"로 세면 되어 계산이 쉬워진다. 하지만 그 조건이 …"
prev_url: "/studies/probability-statistics/sample-space/"
prev_title: "표본공간과 사건"
next_url: "/studies/probability-statistics/conditional-probability/"
next_title: "조건부 확률"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/probability-axioms/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

확률은 사건마다 0에서 1 사이의 수를 붙이는 규칙이다. 지켜야 할 약속은 셋뿐이다. 음수는 없고, 전체의 확률은 1이며, 겹치지 않는 사건들의 확률은 더한다. 결과가 모두 똑같이 그럴듯하면 "원하는 경우의 수 ÷ 전체 경우의 수"로 세면 되어 계산이 쉬워진다. 하지만 그 조건이 깨지면 이 세기 공식은 조용히 틀린 답을 낸다.

</div>


## 예시로 보기

주사위 두 개를 던져 합이 7이 될 확률은 순서쌍 36개 중 6개라 $$\frac{6}{36} = \frac16$$이다. 여기서 한 일을 규칙으로 풀면 이렇다. 결과 36개에 똑같이 $$\frac{1}{36}$$씩 나눠 주고(전체는 1), 사건 "합이 7"의 확률은 그 안에 든 결과들의 몫을 더한다(겹치지 않으니 덧셈). 이 두 동작이 아래 공리의 둘째와 셋째 줄이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">확률의 공리</div>

표본공간 $$\Omega$$의 사건 $$A$$마다 수 $$P(A)$$를 붙이는 함수 $$P$$가 다음을 만족하면 **확률**이라 한다[^1].
1. 모든 사건 $$A$$에서 $$P(A) \ge 0$$.
2. $$P(\Omega) = 1$$.
3. 서로 배반인 사건 $$A_1, A_2, \dots$$에 대해 $$P\left(\bigcup_i A_i\right) = \sum_i P(A_i)$$($$\sum$$은 차례로 모두 더한다는 기호).

</div>


$$\Omega$$가 유한하고 모든 결과가 똑같이 그럴듯하면 $$P(A) = \frac{\vert A\vert }{\vert \Omega\vert }$$다(고전적 정의). 이때 확률 계산은 [세기](/Hongs_Blog/studies/discrete-math/permutations-combinations/) 문제가 된다.

**공리에서 나오는 성질.**

| 성질 | 식 |
|---|---|
| 여사건 | $$P(A^c) = 1 - P(A)$$ |
| 단조성 | $$A \subseteq B$$이면 $$P(A) \le P(B)$$ |
| 포함-배제 | $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$ |
| 합집합 한계 | $$P(A_1 \cup \cdots \cup A_n) \le P(A_1) + \cdots + P(A_n)$$ |

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *여사건:* $$A$$와 $$A^c$$는 배반이고 합치면 $$\Omega$$다. 공리 3과 2로 $$P(A) + P(A^c) = 1$$.
2. *단조성:* $$B = A \cup (B \setminus A)$$이고 두 조각은 배반이다. $$P(B) = P(A) + P(B \setminus A) \ge P(A)$$(공리 1).
3. *포함-배제:* $$A \cup B$$를 배반인 $$A$$와 $$B \setminus A$$로, $$B$$를 배반인 $$A \cap B$$와 $$B \setminus A$$로 쪼갠다. 두 식에서 $$P(B \setminus A)$$를 지우면 된다. $$A \cap B$$를 두 번 센 것을 한 번 빼는 것이다([포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/)).
4. *합집합 한계:* 포함-배제에서 $$P(A \cap B) \ge 0$$을 버리면 $$P(A \cup B) \le P(A) + P(B)$$. 귀납법으로 $$n$$개까지 늘린다. ∎

</details>


## 예제

**생일 문제.** 23명이 모였을 때 생일이 같은 사람이 적어도 한 쌍 있을 확률은? (1년은 365일, 생일은 균등하고 서로 독립이라 가정한다.)

1. *여사건으로 바꾸기:* "적어도 한 쌍 같음"의 여사건은 "모두 다름"이다.
2. *모두 다를 확률:* 첫 사람은 아무 날, 둘째는 남은 364일, …. $$\frac{365 \cdot 364 \cdots 343}{365^{23}} \approx 0.4927$$.
3. *결론:* $$1 - 0.4927 \approx 0.5073$$. 23명이면 절반을 넘고, 57명이면 0.99를 넘는다.

직관이 틀리는 이유는 "나와 같은 생일"(22쌍)이 아니라 "누구든 두 사람"($$\binom{23}{2} = 253$$쌍)을 따지기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 공리에서 나온 네 성질(주사위 두 개의 무작위 사건 쌍 2,000개), 생일 문제의 정확값과 모의실험 2만 회, 카드의 값(4번 던지기 1,296가지 전수), 해시 충돌 절반 지점 — [02_probability-axioms_verify.py](/Hongs_Blog/studies/probability-statistics/code/02_probability-axioms_verify/)</div>

</div>


## 활용

- **해시 충돌.** 해시값이 $$n$$가지이고 고르게 퍼지면, 키 $$k$$개 중 충돌이 있을 확률은 생일 문제와 같은 계산이다. 절반이 되는 $$k$$는 약 $$\sqrt{2n\ln 2}$$다. 32비트 해시($$n = 2^{32} \approx 43$$억)라도 키가 77,164개면 충돌 확률이 절반을 넘는다. 해시 테이블이 충돌 처리를 반드시 갖추는 이유다[^s1].
- **합집합 한계.** 사건들이 얽혀 있어 정확한 합집합 확률을 모를 때도 "나쁜 일이 하나라도 일어날 확률 ≤ 각 확률의 합"으로 위를 막는다. 무작위 알고리즘의 실패 확률 분석에서 가장 자주 쓰는 도구다.
- **흔한 실수.** 결과가 똑같이 그럴듯하지 않은 표본공간에 고전적 정의를 쓰는 것([표본공간과 사건](/Hongs_Blog/studies/probability-statistics/sample-space/)의 카드 C3).
- 알고리즘에서: 파이썬의 `dict`와 `set` 같은 해시 테이블은 충돌한 키를 다른 빈칸에 넣거나 한 칸에 매달아 두고, 칸이 너무 차면 칸 수를 늘려 모두 다시 넣는다([딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)). 그래서 충돌이 있어도 키 하나를 찾을 때 비교하는 키가 평균 몇 개뿐이라, 키가 아무리 많아도 넣기·찾기·지우기가 거의 일정한 시간에 끝난다(평균 $$O(1)$$).

## 연결

- 선수: [표본공간과 사건](/Hongs_Blog/studies/probability-statistics/sample-space/), [순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/)
- 같은 원리: [포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/)(세기 판을 확률로)
- 이어지는 개념: [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주사위 두 개를 던져 합이 7일 확률은?</summary>

**답:** 순서쌍 36개 중 $$(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$$의 6개. $$\frac{6}{36} = \frac16$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주사위를 네 번 던져 6이 적어도 한 번 나올 확률은?</summary>

**답:** 여사건 "한 번도 안 나옴"은 $$\left(\frac56\right)^4$$. $$1 - \frac{625}{1296} \approx 0.518$$.<br>
**흔한 오답:** $$4 \times \frac16 = \frac23$$. 한 번 이상 나오는 경우를 겹쳐 센 것이다(합집합 한계는 위쪽 한계일 뿐이다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$P(A \cup B)$$를 구할 때 $$P(A) + P(B)$$에서 $$P(A \cap B)$$를 빼는 이유는?</summary>

**답:** $$A$$와 $$B$$에 모두 속하는 결과는 $$P(A)$$에도 $$P(B)$$에도 들어가 두 번 더해진다. 한 번만 세도록 겹친 부분을 한 번 뺀다. 배반이면 겹친 부분이 없어 빼지 않는다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 1.3절 "Naive definition of probability", 1.4절 "How to count"(생일 문제), 1.6절 "Non-naive definition of probability"(공리와 그 성질).
[^s1]: 에이전트 보충. 절반 지점의 근사 $$\sqrt{2n\ln 2}$$는 $$\prod_{i<k}\left(1 - \frac in\right) \approx e^{-k^2/(2n)}$$에서 나온다. $$n = 2^{32}$$에서 정확한 경계 77,164는 02_probability-axioms_verify.py로 계산했다. 해시 테이블의 충돌 처리는 CLRS 3판 11장에서 다룬다.
{% endraw %}
