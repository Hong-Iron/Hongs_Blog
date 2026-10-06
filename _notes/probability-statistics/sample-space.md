---
layout: "note"
title: "표본공간과 사건"
display_title: "표본공간과 사건 (Sample Space and Events)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Sample Space", "표본공간", "사건", "event", "근원사건", "outcome", "결과", "여사건", "complement", "배반 사건", "disjoint events", "분할", "partition", "드모르간 법칙", "De Morgan's laws"]
description: "실험에서 나올 수 있는 결과를 빠짐없이 모은 목록이 표본공간이고, 그중 관심 있는 결과들의 묶음이 사건이다. 사건을 집합으로 보면 \"또는\", \"그리고\", \"아니다\"가 각각 합집합, 교집합, 여집합이 되어 말로 된 확률 문제를 기계적으로 옮길 수 있다. 다만 결과를 어떤 단위로 적느…"
next_url: "/studies/probability-statistics/probability-axioms/"
next_title: "확률의 공리와 계산"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/sample-space/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

실험에서 나올 수 있는 결과를 빠짐없이 모은 목록이 표본공간이고, 그중 관심 있는 결과들의 묶음이 사건이다. 사건을 집합으로 보면 "또는", "그리고", "아니다"가 각각 합집합, 교집합, 여집합이 되어 말로 된 확률 문제를 기계적으로 옮길 수 있다. 다만 결과를 어떤 단위로 적느냐가 중요하다. 너무 뭉뚱그려 적으면 결과마다 가능성이 달라져서, 뒤에서 "경우의 수 나누기 전체"로 세는 계산이 틀어진다.

</div>


## 예시로 보기

주사위 두 개를 던진다. 결과를 (첫 주사위, 둘째 주사위)의 순서쌍으로 적으면 $$6 \times 6 = 36$$개이고, 모두 똑같이 그럴듯하다. "합이 7"은 $$(1,6), (2,5), \dots, (6,1)$$의 6개 결과를 묶은 사건이다.

같은 실험을 "두 눈의 합"만 적어 $$\{2, 3, \dots, 12\}$$로 쓸 수도 있다. 틀린 표본공간은 아니지만, 합 2는 $$(1,1)$$ 하나뿐이고 합 7은 결과 6개가 모인 것이라 가능성이 다르다. 순서쌍 하나하나가 아래 정의의 결과 $$\omega$$, 순서쌍 36개의 모음이 $$\Omega$$, "합이 7"이 사건 $$A \subseteq \Omega$$($$\subseteq$$는 "~에 모두 들어 있다(부분집합)")다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

실험의 **표본공간** $$\Omega$$는 일어날 수 있는 모든 결과 $$\omega$$의 집합이다. 결과는 서로 겹치지 않고, 실험을 하면 정확히 하나가 나온다. **사건**은 $$\Omega$$의 부분집합이다. 실제로 나온 결과가 $$A$$에 속하면 "사건 $$A$$가 일어났다"고 한다[^1].

</div>


말과 집합 연산은 이렇게 대응한다([집합](/Hongs_Blog/studies/discrete-math/sets/)).

| 말 | 집합 | 예(주사위 두 개) |
|---|---|---|
| $$A$$ 또는 $$B$$ | $$A \cup B$$ | 합이 7 또는 두 눈이 같음 |
| $$A$$ 그리고 $$B$$ | $$A \cap B$$ | 합이 8이고 첫 주사위가 3 |
| $$A$$가 아니다 | $$A^c = \Omega \setminus A$$ | 합이 7이 아님 |
| $$A$$와 $$B$$는 함께 일어날 수 없다(배반) | $$A \cap B = \emptyset$$ | 합이 2와 합이 12 |
| $$A$$가 일어나면 $$B$$도 일어난다 | $$A \subseteq B$$ | 두 눈이 모두 6 ⊆ 합이 짝수 |

서로 배반이면서 합치면 $$\Omega$$가 되는 사건들을 $$\Omega$$의 **분할**이라 한다. 드모르간 법칙 $$(A \cup B)^c = A^c \cap B^c$$, $$(A \cap B)^c = A^c \cup B^c$$는 "적어도 하나"를 "모두 아님"의 반대로 바꿀 때 쓴다.

**설계 이유.** 결과가 "정확히 하나 나온다"는 조건 덕분에, 확률을 결과들에 나눠 주고 사건의 확률을 그 합으로 정할 수 있다([확률의 공리](/Hongs_Blog/studies/probability-statistics/probability-axioms/)). 표본공간이 무한할 수도 있다. "앞면이 나올 때까지 던지기"는 $$\{H, TH, TTH, \dots\}$$로 셀 수 있게 무한하고, "대기 시간"은 $$[0, \infty)$$로 셀 수 없게 무한하다[^s1].

## 예제

**서버 세 대의 장애.** 서버마다 정상(0)·다운(1)이면 $$\Omega = \{0, 1\}^3$$, 결과 8개다. $$A_i$$를 "서버 $$i$$가 다운"이라 하자.

1. *말을 집합으로:* "적어도 한 대 다운"은 $$A_1 \cup A_2 \cup A_3$$.
2. *드모르간:* 그 여사건은 $$(A_1 \cup A_2 \cup A_3)^c = A_1^c \cap A_2^c \cap A_3^c$$, 곧 "모두 정상"이다.
3. *세기:* "모두 정상"은 결과 $$(0, 0, 0)$$ 하나이고, "적어도 한 대 다운"은 나머지 7개다.

"적어도 하나"를 직접 세면 경우가 많지만 여사건은 하나뿐이다. 확률 계산에서 가장 자주 쓰는 요령이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 주사위 두 개의 36개 결과와 합의 분포, 드모르간 법칙(원소 4개 집합의 모든 사건 쌍 256개), 서버 세 대의 여사건, 카드의 결과 목록 — [01_sample-space_verify.py](/Hongs_Blog/studies/probability-statistics/code/01_sample-space_verify/)</div>

</div>


## 연결

- 선수: [집합](/Hongs_Blog/studies/discrete-math/sets/)(연산과 드모르간 법칙)
- 이어지는 개념: [확률의 공리와 계산](/Hongs_Blog/studies/probability-statistics/probability-axioms/)(사건에 수를 붙인다)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 동전을 세 번 던지는 실험의 표본공간을 쓰고, "앞면이 정확히 두 번"인 사건을 원소로 나열하라.</summary>

**답:** $$\Omega = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$$, 8개. 사건은 $$\{HHT, HTH, THH\}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$A_i$$ = "서버 $$i$$가 다운"일 때 "서버 1은 정상이고, 서버 2와 3 중 적어도 하나는 다운"을 집합 기호로 쓰라.</summary>

**답:** $$A_1^c \cap (A_2 \cup A_3)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주사위 두 개의 표본공간을 $$\{2, 3, \dots, 12\}$$로 잡고 "합이 7일 확률 $$= \frac{1}{11}$$"이라 하면 왜 틀리는가?</summary>

**답:** "경우의 수 ÷ 전체"는 결과들이 똑같이 그럴듯할 때만 맞다. 합 7은 순서쌍 6개, 합 2는 1개가 모인 결과라 가능성이 다르다. 순서쌍 36개로 세면 $$\frac{6}{36} = \frac16$$이다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 1.2절 "Sample spaces and Pebble World"(표본공간, 사건, 집합 연산과 말의 대응표).
[^s1]: 에이전트 보충. 셀 수 없게 무한한 표본공간에서는 모든 부분집합에 확률을 일관되게 줄 수 없어서, 확률을 줄 사건의 모음을 제한한다(측도론의 σ-대수). 이 과정에서는 그런 제한이 결과를 바꾸는 경우를 다루지 않는다.
{% endraw %}
