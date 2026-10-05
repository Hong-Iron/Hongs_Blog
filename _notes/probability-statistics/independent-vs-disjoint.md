---
layout: "note"
title: "독립과 배반 비교"
display_title: "독립과 배반 비교"
kind: "concept"
kind_label: "비교"
num: "05"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["독립 vs 배반", "independent vs mutually exclusive", "배반과 독립의 차이"]
description: "둘 다 \"서로 상관없다\"는 느낌이라 자주 섞어 쓰지만, 뜻은 거의 반대다. 가르는 질문은 이렇다. 두 사건이 함께 일어날 수 있는가(배반은 불가능), 한쪽 소식이 다른 쪽 확률을 바꾸는가(독립은 바꾸지 않음). 배반이면 확률을 더하고, 독립이면 곱한다."
prev_url: "/studies/probability-statistics/independence/"
prev_title: "독립"
next_url: "/studies/probability-statistics/bayes-theorem/"
next_title: "베이즈 정리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/independent-vs-disjoint/"
---
{% raw %}
둘 다 "서로 상관없다"는 느낌이라 자주 섞어 쓰지만, 뜻은 거의 반대다. 가르는 질문은 이렇다. **두 사건이 함께 일어날 수 있는가**(배반은 불가능), **한쪽 소식이 다른 쪽 확률을 바꾸는가**(독립은 바꾸지 않음). 배반이면 확률을 더하고, 독립이면 곱한다[^1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주사위를 한 번 던질 때 "짝수가 나옴"과 "홀수가 나옴"은 배반인가, 독립인가?</summary>

**답:** 배반이고 독립이 아니다. 둘이 함께 일어날 수 없다. 오히려 "짝수"를 알면 "홀수"의 확률은 $$\frac12$$에서 0으로 떨어져, 정보가 확률을 크게 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 주사위 두 개를 던질 때 "첫째가 짝수"와 "둘째가 짝수"는 배반인가, 독립인가?</summary>

**답:** 독립이고 배반이 아니다. $$(2, 4)$$처럼 함께 일어날 수 있고, $$P(\text{둘 다}) = \frac14 = \frac12 \cdot \frac12$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$P(A) = 0.3$$, $$P(B) = 0.4$$다. $$A$$와 $$B$$가 배반일 때와 독립일 때 각각 $$P(A \cup B)$$는?</summary>

**답:** 배반이면 겹침이 없어 $$0.3 + 0.4 = 0.7$$. 독립이면 $$P(A \cap B) = 0.12$$라 $$0.3 + 0.4 - 0.12 = 0.58$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 확률이 양수인 두 사건이 배반이면서 동시에 독립일 수 있는가?</summary>

**답:** 없다. 배반이면 $$P(A \cap B) = 0$$인데, 독립이려면 $$P(A)P(B) = 0$$이어야 해서 한쪽 확률이 0이어야 한다. 직관으로는 "$$A$$가 일어났다"는 소식이 "$$B$$는 절대 안 일어났다"를 알려 주므로, 배반인 사건은 서로에 대한 정보가 가장 많은 사건이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 카드의 네 판단과 값, 원소 6개 표본공간의 모든 사건 쌍에서 "확률이 양수이고 배반이면 독립이 아님" — [05_independent-vs-disjoint_verify.py](/Hongs_Blog/studies/probability-statistics/code/05_independent-vs-disjoint_verify/)</div>

</div>


## 결정적 차이

| | 배반 | 독립 |
|---|---|---|
| 정의 | $$A \cap B = \emptyset$$ (사건의 모양) | $$P(A \cap B) = P(A)P(B)$$ (확률의 성질) |
| 확인 방법 | 표본공간에서 겹치는 결과가 있는지 본다 | 확률을 계산해 곱과 비교한다 |
| "함께 일어날" 확률 | 0 | $$P(A)P(B)$$ |
| "또는"의 확률 | $$P(A) + P(B)$$ | $$P(A) + P(B) - P(A)P(B)$$ |
| 한쪽 소식이 주는 정보 | 최대("다른 쪽은 안 일어났다") | 없음 |
| 대표 상황 | 한 번의 실험에서 서로 다른 결과 | 서로 다른 실험, 따로 도는 장비 |

판단을 돕는 질문은 이렇다.
- **한 번의 실험인가, 여러 번인가?** 한 번의 실험에서 나올 수 있는 서로 다른 결과는 배반이다. 따로 하는 실험의 결과는 보통 독립으로 모델링한다.
- **"또는"인가, "그리고"인가?** "또는"을 더하기로 계산하려면 배반이 필요하고, "그리고"를 곱하기로 계산하려면 독립이 필요하다.

## 둘 다 아닐 때

- 대부분의 사건 쌍은 배반도 독립도 아니다. 그때는 $$P(A \cap B)$$를 따로 구해 [포함-배제](/Hongs_Blog/studies/probability-statistics/probability-axioms/)로 합집합을 구하거나, [곱셈 법칙](/Hongs_Blog/studies/probability-statistics/conditional-probability/) $$P(A \cap B) = P(A)P(B \mid A)$$로 교집합을 구한다.
- 확률을 모르고 위쪽 한계만 필요하면 합집합 한계 $$P(A \cup B) \le P(A) + P(B)$$를 쓴다. 배반이 아니어도 성립한다.

[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 1.6절(배반 사건의 덧셈 공리), 2.5절 "Independence of events"(독립과 배반을 혼동하지 말라는 주의).
{% endraw %}
