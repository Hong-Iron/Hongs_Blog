---
layout: "note"
title: "리프트"
display_title: "리프트 (Lift)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Lift", "향상도", "흥미도 측정", "Interestingness Measure", "패턴 평가", "Pattern Evaluation", "상관 규칙", "Correlation Rule", "지지도-신뢰도 틀의 한계"]
description: "\"A를 산 사람의 67%가 B도 산다\"는 말은 원래 B를 사는 사람이 75%라면 오히려 A가 B를 덜 사게 만든다는 뜻이다. 리프트는 A를 아는 것이 B의 확률을 몇 배로 끌어올리는지 잰다. 1보다 크면 함께 잘 나타나고, 1이면 서로 상관없고, 1보다 작으면 서로 피한다. 다만 …"
prev_url: "/studies/data-science/contrast--fp-mining-methods/"
prev_title: "빈발 패턴 마이닝 방법 비교"
next_url: "/studies/data-science/null-invariant-measures/"
next_title: "널 불변 측정"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/lift/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"A를 산 사람의 67%가 B도 산다"는 말은 원래 B를 사는 사람이 75%라면 오히려 A가 B를 덜 사게 만든다는 뜻이다. 리프트는 A를 아는 것이 B의 확률을 몇 배로 끌어올리는지 잰다. 1보다 크면 함께 잘 나타나고, 1이면 서로 상관없고, 1보다 작으면 서로 피한다. 다만 둘 다 없는 거래가 아주 많으면 값이 크게 부풀어, 거의 관련 없는 둘이 강하게 관련된 것처럼 보인다.

</div>


## 예시로 보기

[연관 규칙](/Hongs_Blog/studies/data-science/association-rules/) 마이닝은 규칙을 아주 많이 만들고, 그중 상당수는 흥미롭지 않다[^1]. 학생 1,000명의 조사다[^2].

| | 축구함 | 축구 안 함 | 합 |
|---|---|---|---|
| 시리얼 먹음 | 400 | 350 | 750 |
| 시리얼 안 먹음 | 200 | 50 | 250 |
| 합 | 600 | 400 | 1000 |

규칙 "축구 → 시리얼"은 지지도 40%, 신뢰도 $$\frac{400}{600} = 66.7\%$$다. 최소 신뢰도가 60%면 강한 규칙이다. 그런데 전체 학생 중 시리얼을 먹는 비율이 75%다. 축구하는 학생은 오히려 덜 먹는다. "축구 안 함 → 시리얼"의 신뢰도는 $$\frac{350}{400} = 87.5\%$$로 더 높다[^2].

리프트로 재면 바로 드러난다.

$$\operatorname{lift} = \frac{0.4}{0.6 \times 0.75} = 0.89 < 1$$


축구와 시리얼은 음의 상관이다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 신뢰도 66.7%와 87.5%, 리프트 0.89, 기대 빈도와 카이제곱 55.56, 독립이면 1, 카드 C2 — [17_lift_verify.py](/Hongs_Blog/studies/data-science/code/17_lift_verify/)</div>

</div>


## 정의

지지도와 신뢰도만으로는 모자라서, 두 패턴의 상관을 재는 값을 더한다. 규칙에 지지도, 신뢰도와 함께 상관값을 붙인다[^3].

$$A$$와 $$B$$가 독립이면 $$s(A \cup B) = s(A) \cdot s(B)$$다. 리프트는 실제 함께 나타난 비율을 독립일 때의 비율로 나눈 것이다. 신뢰도를 $$B$$의 원래 비율로 나눈 것과 같다[^3].

$$\operatorname{lift}(A, B) = \frac{s(A \cup B)}{s(A)\, s(B)} = \frac{c(A \Rightarrow B)}{s(B)}$$


- $$\operatorname{lift} = 1$$: 독립
- $$\operatorname{lift} > 1$$: 양의 상관
- $$\operatorname{lift} < 1$$: 음의 상관

분자와 분모가 $$A$$, $$B$$에 대해 대칭이라 $$\operatorname{lift}(A, B) = \operatorname{lift}(B, A)$$다. 규칙의 방향은 신경 쓰지 않는다[^s1].

**카이제곱으로 확인하기.** 같은 표를 [카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/)에 넣으면 기대 빈도가 450, 300, 150, 100이다. "축구하고 시리얼 먹음"의 실제 400이 기대 450보다 적어 역시 음의 상관이다. 카이제곱 값은 55.56이다[^4][^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 3-2 슬라이드 p.14 기대 빈도 계산 "*150 = (250*600)/1000"이 두 번 적혀 있다 / 문제점: 네 번째 칸(시리얼 안 먹음, 축구 안 함)의 기대 빈도는 100이고 식은 $$(250 \times 400)/1000$$이다. 표 안의 (100)은 맞다 / 수정안: "*100 = (250*400)/1000" / 근거: 행 합 250, 열 합 400, 전체 1000. 17_lift_verify.py

</div>


## 연결

- 선수: [연관 규칙](/Hongs_Blog/studies/data-science/association-rules/)(신뢰도), [카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/)
- "독립"의 확률 정의 $$P(A \cap B) = P(A)P(B)$$: [독립](/Hongs_Blog/studies/probability-statistics/independence/)
- 리프트가 실패하는 경우: [널 불변 측정](/Hongs_Blog/studies/data-science/null-invariant-measures/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 리프트의 식을 두 가지 꼴로 쓰고, 값이 1, 1보다 큼, 1보다 작음일 때의 뜻을 쓰라.</summary>

**답:** $$\frac{s(A \cup B)}{s(A)s(B)} = \frac{c(A \Rightarrow B)}{s(B)}$$. 1이면 독립, 1보다 크면 양의 상관, 1보다 작으면 음의 상관.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 거래 200건 중 우유 80, 빵 100, 둘 다 60이다. 우유 → 빵의 신뢰도와 리프트를 구하라.</summary>

**답:** 신뢰도 $$\frac{60}{80} = 75\%$$. 빵의 원래 비율은 50%라 리프트 $$\frac{0.75}{0.5} = 1.5$$. 우유를 사면 빵을 살 확률이 1.5배가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 신뢰도가 66.7%로 높은 "축구 → 시리얼"이 흥미롭지 않은 규칙인 이유를 리프트로 설명하라.</summary>

**답:** 시리얼은 원래 75%가 먹는다. 축구하는 학생 중 먹는 비율 66.7%는 그보다 낮아 리프트가 0.89다. 축구를 안다고 시리얼을 먹을 가능성이 올라가지 않고 오히려 내려간다. 신뢰도만 보면 뒤쪽 항목이 원래 흔하다는 사실을 놓친다.

</details>


[^1]: 데이터 과학 3회 강의 자료 「3-2_FP-eval」, p.10
[^2]: 같은 자료, p.11
[^3]: 같은 자료, p.12~13
[^4]: 같은 자료, p.14
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 리프트의 대칭성, 카이제곱 값 55.56, 카드 C2·C3은 원본에 없다. 검증 코드로 계산했다.
{% endraw %}
