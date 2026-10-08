---
layout: "note"
title: "베이즈 정리 예제 사다리"
display_title: "베이즈 정리 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "06"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 베이즈 정리, 조건부 확률(전확률 공식)."
next_url: "/studies/probability-statistics/expectation-ladder/"
next_title: "기댓값 선형성 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/probability-statistics/bayes-ladder/"
---
{% raw %}
사용 개념: [베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/), [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/)(전확률 공식).

베이즈 문제의 핵심은 **문장 속 확률이 어느 방향인지 가려 적는 것**이다. "원인일 때 증거가 나올 확률"은 문제에 주어지고, "증거가 나왔을 때 원인일 확률"은 구해야 하는 값이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *사건 정하기:* 원인 후보 $$H_1, \dots, H_n$$(겹치지 않고 전체를 덮게)과 관측한 증거 $$E$$를 이름 붙인다.
2. *주어진 값 적기:* 사전확률 $$P(H_i)$$와 가능도 $$P(E \mid H_i)$$를 표로 적는다.
3. *증거의 전체 확률:* 전확률 공식으로 $$P(E) = \sum_i P(E \mid H_i)P(H_i)$$($$\sum$$은 차례로 모두 더한다는 기호).
4. *뒤집고 해석하기:* $$P(H \mid E) = \frac{P(E \mid H)P(H)}{P(E)}$$를 구하고, 사전확률과 비교해 증거가 믿음을 얼마나 움직였는지 본다.

## 문제 1 · 완전한 풀이

공장 A가 제품의 60%를 불량률 2%로, 공장 B가 40%를 불량률 5%로 만든다. 불량품 하나를 집었을 때 B에서 왔을 확률은?

1. *사건:* $$H_A$$ = A 제품, $$H_B$$ = B 제품(분할). $$E$$ = 불량.
2. *주어진 값:* $$P(H_A) = 0.6$$, $$P(H_B) = 0.4$$, $$P(E \mid H_A) = 0.02$$, $$P(E \mid H_B) = 0.05$$.
3. *전체 확률:* $$P(E) = 0.02 \times 0.6 + 0.05 \times 0.4 = 0.032$$.
4. *뒤집기:* $$P(H_B \mid E) = \frac{0.020}{0.032} = 0.625$$. 생산량은 40%지만 불량률이 높아, 불량품의 62.5%가 B에서 온다.

## 문제 2 · 마지막 하위목표만 빈칸

받은 메일의 40%가 스팸이다. "당첨"이라는 단어는 스팸의 30%, 정상 메일의 1%에 들어 있다. "당첨"이 든 메일이 스팸일 확률은?

1. *사건:* $$H$$ = 스팸, $$H^c$$ = 정상. $$E$$ = "당첨" 포함.
2. *주어진 값:* $$P(H) = 0.4$$, $$P(E \mid H) = 0.3$$, $$P(E \mid H^c) = 0.01$$.
3. *전체 확률:* $$P(E) = 0.3 \times 0.4 + 0.01 \times 0.6 = 0.126$$.
4. *뒤집고 해석하기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$P(H \mid E) = \frac{0.12}{0.126} \approx 0.952$$. 사전확률 0.4가 단어 하나로 0.95까지 올랐다. 가능도비가 $$\frac{0.3}{0.01} = 30$$으로 커서다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

유병률 1%, 민감도 95%, 위양성률 5%인 검사에서 두 번 연속 양성이 나왔다. 두 검사의 오류는 병의 유무가 주어지면 서로 독립이다. 병이 있을 확률은?

1. *사건:* $$H$$ = 병, $$E_1$$, $$E_2$$ = 첫째·둘째 양성.
2. *주어진 값:* ______
3. *전체 확률:* ______
4. *뒤집고 해석하기:* 첫 검사 뒤 약 0.161, 두 검사 뒤 약 0.785다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 첫 검사의 사후확률 $$\frac{95}{590} \approx 0.161$$을 둘째 검사의 사전확률로 쓴다. 가능도는 그대로 $$P(E_2 \mid H) = 0.95$$, $$P(E_2 \mid H^c) = 0.05$$.
3. $$P(E_2 \mid E_1) = 0.95 \times 0.161 + 0.05 \times 0.839 \approx 0.195$$. 그래서 $$\frac{0.153}{0.195} \approx 0.785$$.

</details>


## 문제 4 · 독립 문제

어느 도시의 택시는 85%가 초록, 15%가 파랑이다. 뺑소니 사고의 목격자는 "파란 택시"라고 했고, 이 목격자는 색을 80% 정확하게 구별한다(초록을 파랑으로, 파랑을 초록으로 잘못 볼 확률이 각각 20%). 사고 택시가 실제로 파랑일 확률은?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$H$$ = 파랑, $$E$$ = "파랑"이라는 증언. $$P(E) = 0.8 \times 0.15 + 0.2 \times 0.85 = 0.12 + 0.17 = 0.29$$. $$P(H \mid E) = \frac{0.12}{0.29} \approx 0.414$$. 80% 정확한 증언이 있어도 초록 택시가 훨씬 많아 파랑일 확률은 절반이 안 된다.

**흔한 오답:** 0.8. 목격자의 정확도 $$P(E \mid H)$$를 답으로 쓴 것이다.

</details>


## 변형 문제

공장이 셋이다. 생산 비율 50%·30%·20%, 불량률 1%·2%·5%. 불량품이 셋째 공장에서 왔을 확률은? 셋째 공장을 빼고 앞 두 공장만으로 분모를 계산하면 무엇이 잘못되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$P(E) = 0.005 + 0.006 + 0.010 = 0.021$$. $$P(H_3 \mid E) = \frac{0.010}{0.021} \approx 0.476$$. 셋째 공장을 빼면 분모가 원인의 일부만 더한 값이 되어, 나머지 공장의 사후확률이 부풀려지고 합이 1이 되지 않는다. 원인 후보는 반드시 전체를 덮어야 한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 사후확률과 전체 확률을 코드로 재계산 — [06_bayes-theorem_verify.py](/Hongs_Blog/studies/probability-statistics/code/06_bayes-theorem_verify/)</div>

</div>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 2.3절 "Bayes' rule and the law of total probability".
{% endraw %}
