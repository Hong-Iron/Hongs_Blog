---
layout: "note"
title: "널 불변 측정"
display_title: "널 불변 측정 (Null-Invariant Measures)"
kind: "concept"
kind_label: "정의"
num: "18"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Null-Invariant Measure", "널 불변성", "Null Invariance", "널 거래", "Null Transaction", "쿨친스키", "Kulczynski", "Kulc", "불균형 비율", "Imbalance Ratio", "IR"]
description: "마트 영수증 대부분에는 우유도 커피도 없다. 이렇게 두 물건 모두 없는 영수증(널 거래)이 많아지면 리프트와 카이제곱은 크게 부풀어, 거의 관련 없는 우유와 커피가 강하게 붙어 다니는 것처럼 보인다. 널 불변 측정은 두 물건 중 하나라도 있는 영수증만 보고 계산해서, 널 거래가 몇…"
prev_url: "/studies/data-science/lift/"
prev_title: "리프트"
next_url: "/studies/data-science/classification-metrics/"
next_title: "분류 평가 지표"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-science/null-invariant-measures/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

마트 영수증 대부분에는 우유도 커피도 없다. 이렇게 두 물건 모두 없는 영수증(널 거래)이 많아지면 리프트와 카이제곱은 크게 부풀어, 거의 관련 없는 우유와 커피가 강하게 붙어 다니는 것처럼 보인다. 널 불변 측정은 두 물건 중 하나라도 있는 영수증만 보고 계산해서, 널 거래가 몇 장이든 값이 바뀌지 않는다. 대신 두 물건의 인기가 크게 다르면 쿨친스키 값만으로는 상황을 다 알 수 없어, 불균형 비율을 함께 본다.

</div>


## 예시로 보기

우유(B)와 커피(C)가 든 거래를 센다[^1].

| | 우유 있음 | 우유 없음 | 합 |
|---|---|---|---|
| 커피 있음 | 100 | 1,000 | 1,100 |
| 커피 없음 | 1,000 | 100,000 | 101,000 |
| 합 | 1,100 | 101,000 | 102,100 |

우유를 산 1,100명 중 커피도 산 사람은 100명(9%)뿐이다. 커피를 산 1,100명 중 우유도 산 사람도 100명이다. 둘은 거의 따로 팔린다. 그런데 리프트는

$$\operatorname{lift}(B, C) = \frac{100 / 102100}{(1100 / 102100)^2} = 8.44$$


로 "강한 양의 상관"이라 말한다. 카이제곱도 670으로 크다. 둘 다 없는 거래 10만 건이 분모를 키워, 기대 빈도가 11.85밖에 안 되기 때문이다. 실제 100은 기대보다 훨씬 많아 보인다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 우유·커피 예의 리프트 8.44, 카이제곱 670, 기대 11.85, 표 D1~D6의 네 값, 널 거래를 $$10^9$$까지 늘려도 Kulc·IR 그대로, 카드 C2 — [18_null-invariant_verify.py](/Hongs_Blog/studies/data-science/code/18_null-invariant_verify/)</div>

</div>


## 정의

**널 거래**는 따지는 항목 집합을 하나도 담지 않은 거래다[^1]. 측정값이 널 거래 수에 따라 바뀌지 않으면 **널 불변**이라 한다. 큰 DB에는 널 거래가 아주 흔하므로(대부분의 영수증에 우유도 커피도 없고, 대부분의 논문에 김 교수도 존 교수도 없다) 널 불변성이 중요하다[^2].

**쿨친스키 측정**(Kulc)은 두 신뢰도의 평균이다. 1927년 폴란드 수학자 쿨친스키가 제안했다[^3].

$$\operatorname{Kulc}(A, B) = \frac12\left(P(A \mid B) + P(B \mid A)\right) = \frac12\left(\frac{s(A \cup B)}{s(A)} + \frac{s(A \cup B)}{s(B)}\right) \le 1$$


분자와 분모에 "$$A$$나 $$B$$를 담은 거래"만 나오고, 둘 다 없는 거래는 어디에도 나오지 않는다. 그래서 널 불변이다. 0.5 근처면 중립, 1에 가까우면 양의 상관, 0에 가까우면 음의 상관으로 읽는다[^s1].

**불균형 비율**(IR)은 두 패턴의 지지도가 얼마나 다른지 잰다. 차이가 클수록 크다[^4].

$$\operatorname{IR}(A, B) = \frac{\vert s(A) - s(B)\vert }{s(A) + s(B) - s(A \cup B)}$$


분모는 $$A$$나 $$B$$ 중 하나라도 담은 거래의 수다. 이것도 널 불변이다.

여섯 자료를 비교한다. BC는 둘 다, ¬BC는 C만, B¬C는 B만, ¬B¬C는 둘 다 없음(널 거래)이다[^2][^3][^4].

| | BC | ¬BC | B¬C | ¬B¬C | $$\chi^2$$ | lift | Kulc | IR |
|---|---|---|---|---|---|---|---|---|
| D1 | 10,000 | 1,000 | 1,000 | 100,000 | 90,557 | 9.26 | 0.91 | 0 |
| D2 | 10,000 | 1,000 | 1,000 | 100 | 0 | 1 | 0.91 | 0 |
| D3 | 100 | 1,000 | 1,000 | 100,000 | 670 | 8.44 | 0.09 | 0 |
| D4 | 1,000 | 1,000 | 1,000 | 100,000 | 24,740 | 25.75 | 0.5 | 0 |
| D5 | 1,000 | 100 | 10,000 | 100,000 | 8,173 | 9.18 | 0.5 | 0.89 |
| D6 | 1,000 | 10 | 100,000 | 100,000 | 965 | 1.97 | 0.5 | 0.99 |

- D1과 D2는 널 거래 수만 다르다(10만 대 100). Kulc는 둘 다 0.91인데, 리프트는 9.26과 1, 카이제곱은 90,557과 0으로 정반대 결론을 낸다.
- D4, D5, D6은 Kulc가 모두 0.5다. D4는 B와 C의 인기가 같아(IR 0) 정말 중립이다. D5와 D6은 IR이 0.89, 0.99로 크다. 한쪽(C)을 산 사람은 대부분 B도 샀지만, B를 산 사람 대부분은 C를 사지 않았다. 신뢰도 하나는 높고 하나는 낮아 평균이 0.5가 된 것이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/data-science/18_null-invariant-measures_fig1.svg" alt="그림" width="519" height="328" loading="lazy">

D1, D2의 BC 10,000, ¬BC 1,000, B¬C 1,000을 그대로 두고 널 거래만 늘렸다. 리프트는 널 거래 100건에서 1(독립)이다가 10만 건에서 9.26으로 오르고, 그 뒤로도 끝없이 커진다. Kulc는 0.91에서 움직이지 않는다[^s2].

**고르는 법.** 널 거래가 지배적이지 않으면 리프트와 카이제곱도 좋다. 널 거래가 많으면 Kulc와 IR을 함께 쓴다[^5].

## 연결

- 선수: [리프트](/Hongs_Blog/studies/data-science/lift/)(널 거래에 흔들리는 측정)
- 같은 생각, 다른 자리: [자카드 계수](/Hongs_Blog/studies/data-science/categorical-dissimilarity/)도 "둘 다 0인 칸"을 빼서 희소한 자료의 비교를 지킨다. 자카드는 $$\frac{s(A \cup B)}{s(A) + s(B) - s(A \cup B)}$$로 Kulc, IR과 같은 분모를 쓴다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 널 거래와 널 불변을 정의하고, 쿨친스키 측정과 불균형 비율의 식을 쓰라.</summary>

**답:** 널 거래는 따지는 항목을 하나도 담지 않은 거래, 널 불변은 널 거래 수가 바뀌어도 값이 그대로인 성질이다. $$\operatorname{Kulc} = \frac12\left(\frac{s(A \cup B)}{s(A)} + \frac{s(A \cup B)}{s(B)}\right)$$, $$\operatorname{IR} = \frac{\vert s(A) - s(B)\vert }{s(A) + s(B) - s(A \cup B)}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** BC 500, ¬BC 500, B¬C 500이다. 널 거래가 0, 500, 100,000일 때 리프트를 각각 구하라. Kulc는?</summary>

**답:** 리프트는 0.75, 1.00, 50.75로 널 거래만 늘었는데 "음의 상관"에서 "아주 강한 양의 상관"으로 바뀐다. Kulc는 $$\frac12(\frac{500}{1000} + \frac{500}{1000}) = 0.5$$로 셋 다 같다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** D4와 D6은 Kulc가 둘 다 0.5다. 두 자료에서 B와 C의 관계는 같은가? 무엇으로 구별하는가?</summary>

**답:** 다르다. D4는 B와 C의 지지도가 같고 서로의 절반이 겹쳐 정말 중립이다(IR 0). D6은 C를 산 1,010명 중 1,000명이 B를 샀지만, B를 산 101,000명 중 C를 산 사람은 1%뿐이다(IR 0.99). 불균형 비율로 구별한다.

</details>


[^1]: 데이터 과학 3회 강의 자료 「3-2_FP-eval」, p.15
[^2]: 같은 자료, p.16
[^3]: 같은 자료, p.17
[^4]: 같은 자료, p.18
[^5]: 같은 자료, p.19
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> Kulc의 읽는 법(0.5 중립), 자카드 계수와의 비교, D4~D6의 풀이, 카드 C2·C3은 원본에 없다. 표의 모든 값은 검증 코드로 다시 계산했다(D6의 카이제곱은 965.5라 반올림하면 966이다. 슬라이드는 965).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [18_null-invariant-measures_plot.py](/Hongs_Blog/studies/data-science/code/18_null-invariant-measures_plot/)로 그렸고, 리프트 1.00(D2)과 9.26(D1), 널 거래 10건~$$10^9$$건에서 Kulc가 $$\frac{10000}{11000} \approx 0.91$$로 같음을 같은 코드로 확인했다.
{% endraw %}
