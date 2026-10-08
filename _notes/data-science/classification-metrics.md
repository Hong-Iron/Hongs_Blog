---
layout: "note"
title: "분류 평가 지표"
display_title: "분류 평가 지표 (Classification Metrics)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Classification Metrics", "혼동 행렬", "Confusion Matrix", "정확도", "Accuracy", "정밀도", "Precision", "재현율", "Recall", "민감도", "Sensitivity", "F1 점수", "F1 Score", "참 양성", "TP", "거짓 양성", "FP", "제1종 오류", "거짓 음성", "FN", "제2종 오류", "참 음성", "TN"]
description: "병을 가려내는 검사가 얼마나 좋은지 하나의 숫자로 말하기는 어렵다. 전체 중 맞힌 비율(정확도)은 환자가 드물면 \"모두 건강하다\"고만 해도 높게 나온다. 그래서 \"양성이라 한 것 중 진짜 양성의 비율\"(정밀도)과 \"진짜 양성 중 찾아낸 비율\"(재현율)을 따로 보고, 둘을 함께 보려…"
prev_url: "/studies/data-science/null-invariant-measures/"
prev_title: "널 불변 측정"
next_url: "/studies/data-science/ensemble-learning/"
next_title: "앙상블 학습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/classification-metrics/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

병을 가려내는 검사가 얼마나 좋은지 하나의 숫자로 말하기는 어렵다. 전체 중 맞힌 비율(정확도)은 환자가 드물면 "모두 건강하다"고만 해도 높게 나온다. 그래서 "양성이라 한 것 중 진짜 양성의 비율"(정밀도)과 "진짜 양성 중 찾아낸 비율"(재현율)을 따로 보고, 둘을 함께 보려면 F1을 쓴다. 어떤 실수가 더 비싼지에 따라 알맞은 지표가 달라진다.

</div>


## 예시로 보기

환자 1,000명 중 병이 있는 사람이 10명이다. 모두 "건강하다"고 답하는 모델은 990명을 맞혀 정확도 99%다. 하지만 환자를 한 명도 찾지 못한다[^s1].

다른 모델의 결과를 네 칸으로 센다[^s1]. 이 표를 혼동 행렬이라 부른다.

| | 모델: 양성 | 모델: 음성 |
|---|---|---|
| 실제 양성 | 8 (참 양성, TP) | 2 (거짓 음성, FN) |
| 실제 음성 | 40 (거짓 양성, FP) | 950 (참 음성, TN) |

- 정확도 $$\frac{8 + 950}{1000} = 95.8\%$$. 앞의 "모두 건강" 모델보다 낮다.
- 재현율 $$\frac{8}{8 + 2} = 80\%$$. 환자 10명 중 8명을 찾았다.
- 정밀도 $$\frac{8}{8 + 40} = 16.7\%$$. "양성"이라 한 48명 중 진짜 환자는 8명이다.

환자를 놓치는 것(FN)이 비싸면 재현율을, 건강한 사람을 괜히 재검사하는 것(FP)이 비싸면 정밀도를 본다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 정확도 99%와 재현율 0, 위 혼동 행렬의 네 지표, 조화평균의 범위, 카드 C2 — [19_classification-metrics_verify.py](/Hongs_Blog/studies/data-science/code/19_classification-metrics_verify/)</div>

</div>


## 정의

양성(+)과 음성(−)을 가르는 분류에서, 실제 값과 예측의 조합을 넷으로 센다[^1].

- **TP**(참 양성): 양성을 양성으로 맞힘
- **FN**(거짓 음성): 양성을 음성으로 틀림. 제2종 오류
- **FP**(거짓 양성): 음성을 양성으로 틀림. 제1종 오류
- **TN**(참 음성): 음성을 음성으로 맞힘

| 지표 | 식 | 재는 것 | 쓸모 있을 때 | 한계 |
|---|---|---|---|---|
| 정확도 | $$\frac{TP + TN}{TP + TN + FP + FN}$$ | 전체 정답률 | 부류 비율이 고를 때 | 불균형 자료에서 속인다 |
| 정밀도 | $$\frac{TP}{TP + FP}$$ | 양성 예측을 믿을 수 있나 | 거짓 양성이 비쌀 때 | 거짓 음성을 무시한다 |
| 재현율 | $$\frac{TP}{TP + FN}$$ | 양성을 찾아내는 능력 | 양성을 놓치면 비쌀 때 | 거짓 양성을 무시한다 |
| F1 | $$\frac{2 \cdot \text{정밀도} \cdot \text{재현율}}{\text{정밀도} + \text{재현율}}$$ | 정밀도와 재현율의 균형 | 불균형 자료, 둘을 함께 따질 때 | 참 음성을 무시한다 |

표는 슬라이드를 옮긴 것이다[^1]. F1은 두 값의 조화평균이라 작은 쪽에 끌린다. 위 예는 정밀도 16.7%, 재현율 80%로 산술평균은 48%지만 F1은 27.6%다[^s1].

## 연결

- 평가 방법(홀드아웃, 교차검증, 부트스트랩): [과적합과 교차검증](/Hongs_Blog/studies/probability-statistics/overfitting-cv/)의 과목별 관점
- 두 모델의 차이가 우연인지 가리기: [가설검정과 p값](/Hongs_Blog/studies/probability-statistics/hypothesis-testing/)의 과목별 관점(짝지은 t-검정). 제1종·제2종 오류도 같은 말이다.
- 불균형 자료에서 시험 집합의 비율 맞추기: [층화 추출](/Hongs_Blog/studies/data-science/sampling/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 정밀도, 재현율, F1을 TP, FP, FN으로 쓰라.</summary>

**답:** 정밀도 $$\frac{TP}{TP + FP}$$, 재현율 $$\frac{TP}{TP + FN}$$, F1 $$= \frac{2PR}{P + R}$$($$P$$ 정밀도, $$R$$ 재현율).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** TP 30, FP 10, FN 20, TN 940일 때 정밀도, 재현율, F1을 구하라.</summary>

**답:** 정밀도 $$\frac{30}{40} = 75\%$$, 재현율 $$\frac{30}{50} = 60\%$$, F1 $$= \frac{2 \times 0.75 \times 0.6}{1.35} \approx 66.7\%$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 경우 정밀도와 재현율 중 무엇을 더 중시해야 하나? ① 암 검진의 1차 선별 ② 스팸 필터(정상 메일을 스팸함에 넣으면 큰일) ③ 신용카드 사기 탐지(사기를 놓치면 큰 손해)</summary>

**답:** ① 재현율. 환자를 놓치면 안 되고, 거짓 양성은 정밀 검사로 다시 걸러진다. ② 정밀도. 스팸이라 한 것이 정말 스팸이어야 한다. ③ 재현율. 사기를 놓치는 비용이 정상 거래를 확인하는 비용보다 크다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/06.6-2_ensemble.pdf, p.4 (6-1 복습: 분류 평가 지표). 6-1 강의 자료는 받은 자료에 없다
[^s1]: 에이전트 보충. 환자 예와 수치, F1과 산술평균의 비교, 카드 C2·C3은 원본에 없다. 검증 코드로 계산했다.
{% endraw %}
