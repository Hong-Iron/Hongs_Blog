---
layout: "note"
title: "닫힌 패턴과 최대 패턴"
display_title: "닫힌 패턴과 최대 패턴 (Closed and Maximal Patterns)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Closed Pattern", "Closed Frequent Itemset", "닫힌 빈발 패턴", "Maximal Pattern", "Max Pattern", "Maximal Frequent Itemset", "최대 빈발 패턴", "패턴 압축"]
description: "빈발 집합 하나가 있으면 그 부분집합이 모두 빈발이라, 빈발 패턴을 다 적으면 목록이 감당할 수 없이 길어진다. 닫힌 패턴은 \"더 큰 집합으로 늘려도 지지도가 줄지 않는\" 집합을 버리고 나머지만 남긴다. 이것만 있으면 모든 빈발 패턴과 그 지지도를 되살릴 수 있다(손실 없는 압축)…"
prev_url: "/studies/data-science/association-rules/"
prev_title: "연관 규칙"
next_url: "/studies/data-science/apriori/"
next_title: "Apriori 알고리즘"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/closed-maximal-patterns/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빈발 집합 하나가 있으면 그 부분집합이 모두 빈발이라, 빈발 패턴을 다 적으면 목록이 감당할 수 없이 길어진다. 닫힌 패턴은 "더 큰 집합으로 늘려도 지지도가 줄지 않는" 집합을 버리고 나머지만 남긴다. 이것만 있으면 모든 빈발 패턴과 그 지지도를 되살릴 수 있다(손실 없는 압축). 최대 패턴은 더 늘리면 빈발이 아니게 되는 가장 큰 집합만 남겨 더 짧지만, 각 패턴의 지지도는 잃는다.

</div>


## 예시로 보기

{A, B, C, D}가 빈발이면 그 부분집합 15개가 모두 빈발이다. 다 계산하고 저장해야 할까[^1]?

거래가 2개뿐인 자료를 본다. 거래 1은 $$\{a_1, \dots, a_{50}\}$$, 거래 2는 $$\{a_1, \dots, a_{100}\}$$이고 최소 지지 개수는 1이다[^2].

- 빈발 패턴은 $$\{a_1, \dots, a_{100}\}$$의 공집합 아닌 부분집합 전부, $$2^{100} - 1$$개다.
- $$\{a_1, a_2\}$$는 지지 2인데, 이것을 늘린 $$\{a_1, \dots, a_{50}\}$$도 지지 2다. 늘려도 지지도가 같으니 $$\{a_1, a_2\}$$는 더 큰 집합이 대신 말해 준다. 닫힌 패턴은 $$\{a_1, \dots, a_{50}\}{:}2$$와 $$\{a_1, \dots, a_{100}\}{:}1$$ 두 개뿐이다[^2].
- 더 늘리면 빈발이 아니게 되는 가장 큰 집합, 즉 최대 패턴은 $$\{a_1, \dots, a_{100}\}$$ 하나다[^3].

$$\{a_2, a_{45}\}$$의 지지도를 알고 싶다. 닫힌 패턴 중 이것을 포함하는 것은 둘이고, 그중 큰 지지도 2가 답이다. 최대 패턴만 있으면 "1 이상"이라는 것밖에 모른다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 줄인 예(거래 $$\{a_1..a_3\}$$, $$\{a_1..a_6\}$$)에서 빈발 63개, 닫힘 2개, 최대 1개, 닫힌 패턴으로 모든 지지도 복원, 무작위 자료 200개에서 최대 ⊆ 닫힘 ⊆ 빈발, 카드 C2 — [12_closed-maximal_verify.py](/Hongs_Blog/studies/data-science/code/12_closed-maximal_verify/)</div>

</div>


## 정의

빈발 항목 집합 $$X$$에 대해[^1]

- **닫힌 빈발 패턴:** 지지도가 같은 더 큰 집합이 없다. $$\nexists\, Y \supsetneq X$$ such that $$\operatorname{sup}(Y) = \operatorname{sup}(X)$$. ($$\nexists$$는 "존재하지 않는다", $$Y \supsetneq X$$는 "$$Y$$가 $$X$$를 담고 더 크다"이다.)
- **최대 빈발 패턴:** 빈발인 더 큰 집합이 없다. $$\nexists\, Y \supsetneq X$$ such that $$\operatorname{sup}(Y) \ge \text{min\_sup}$$.

더 큰 집합의 지지도는 작은 집합의 지지도 이하다. 그래서 더 큰 집합 $$Y$$와 $$X$$의 관계는 둘뿐이다[^2].

1. $$\operatorname{sup}(Y) = \operatorname{sup}(X)$$: $$X$$와 $$Y$$의 정보량이 같다. $$X$$를 따로 저장할 이유가 없다.
2. $$\operatorname{sup}(Y) < \operatorname{sup}(X)$$: $$X$$에 $$Y$$에 없는 정보가 있다.

| | 조건 | 잃는 정보 | 목적 |
|---|---|---|---|
| 빈발 | 지지도 ≥ min_sup | 없음 | 모든 패턴 |
| 닫힌 | 지지도가 같은 더 큰 집합이 없다 | 없음 | 손실 없는 압축 |
| 최대 | 빈발인 더 큰 집합이 없다 | 지지도 | 패턴 수 최소화 |

그래서 빈발 ⊇ 닫힌 ⊇ 최대다[^4]. 최대 패턴은 닫혀 있다. 지지도가 같은 더 큰 집합이 있다면 그 집합도 빈발이라 최대가 아니기 때문이다.

**지지도 되살리기.** 빈발 집합 $$X$$의 지지도는 $$X$$를 포함하는 닫힌 패턴들의 지지도 중 가장 큰 값이다[^s1]. $$X$$에서 지지도를 유지하며 늘릴 수 있는 데까지 늘린 집합(닫힘)이 그 목록에 반드시 있기 때문이다.

## 연결

- 선수: [빈발 패턴](/Hongs_Blog/studies/data-science/frequent-patterns/)(아프리오리 성질)
- 항목 집합들은 포함 관계로 [부분순서](/Hongs_Blog/studies/discrete-math/partial-orders/)를 이룬다. 최대 패턴은 빈발 집합들 중 포함 관계로 가장 위에 있는 원소(극대 원소)다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 닫힌 빈발 패턴과 최대 빈발 패턴을 정의하고, 각각 무엇을 잃는지 쓰라.</summary>

**답:** 닫힌 패턴은 지지도가 같은 더 큰 집합이 없는 빈발 집합이고, 잃는 것이 없다. 최대 패턴은 빈발인 더 큰 집합이 없는 빈발 집합이고, 부분집합들의 지지도를 잃는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 거래 9개 ABE, ABD, BC, BD, AC, BC, AC, ABCE, ABC(최소 지지 개수 2)의 빈발 패턴은 13개다. 이 중 닫힌 패턴과 최대 패턴을 찾으라.</summary>

**답:** 닫힌 패턴 9개: A6, B7, C6, AB4, AC4, BC4, BD2, ABC2, ABE2. (D2는 BD2에, E2·AE2·BE2는 ABE2에 같은 지지도로 포함되어 닫히지 않았다.) 최대 패턴 3개: BD, ABC, ABE[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 모든 최대 패턴은 닫힌 패턴이다. 이유를 대라.</summary>

**답:** 최대 패턴 $$X$$가 닫히지 않았다고 하자. 그러면 지지도가 같은 더 큰 집합 $$Y$$가 있고, $$\operatorname{sup}(Y) = \operatorname{sup}(X) \ge$$ min_sup이라 $$Y$$는 빈발이다. 빈발인 더 큰 집합이 있으니 $$X$$는 최대가 아니다. 모순이다(귀류법).

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/03.3-1_FP.pdf, p.12
[^2]: 같은 자료, p.13
[^3]: 같은 자료, p.14
[^4]: 같은 자료, p.15
[^s1]: 에이전트 보충. 지지도 되살리기 규칙과 그 이유, 카드 C2·C3은 원본에 없다. 검증 코드로 무작위 자료에서 확인했다.
{% endraw %}
