---
layout: "note"
title: "차분방정식 ↔ 선형 점화식"
display_title: "차분방정식 ↔ 선형 점화식: 거듭제곱을 넣어 특성방정식 풀기"
kind: "concept"
kind_label: "브리지"
num: "25"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Difference Equations and Linear Recurrences", "차분방정식과 점화식", "특성방정식의 공통 구조"]
description: "신호 및 시스템의 차분방정식과 이산수학의 선형 점화식은 같은 식을 다른 이름으로 부른 것이다. 둘 다 \"다음 값을 앞의 값들에 상수를 곱해 더해 만든다\"이고, 둘 다 거듭제곱 r^n을 넣어 특성방정식을 풀어서 닫힌 꼴을 얻는다. 차이는 관점이다. 점화식은 수열 하나를 계산하고, 차…"
prev_url: "/studies/signals-and-systems/difference-equation-system/"
prev_title: "차분방정식으로 표현한 LTI 시스템"
next_url: "/studies/signals-and-systems/block-diagram/"
next_title: "블록 다이어그램"
math: true
mermaid: false
code_count: 0
permalink: "/studies/signals-and-systems/difference-equation-recurrence-bridge/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신호 및 시스템의 차분방정식과 이산수학의 선형 점화식은 같은 식을 다른 이름으로 부른 것이다. 둘 다 "다음 값을 앞의 값들에 상수를 곱해 더해 만든다"이고, 둘 다 거듭제곱 $$r^n$$을 넣어 특성방정식을 풀어서 닫힌 꼴을 얻는다. 차이는 관점이다. 점화식은 수열 하나를 계산하고, 차분방정식은 입력이 들어오는 시스템을 다룬다. 그래서 오른쪽의 입력 항, 초기 휴지 조건, 임펄스 응답 같은 말이 시스템 쪽에만 있다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 두 사례의 공통 구조와 대응 관계를 먼저 적어 본다.

| 이산수학: 하노이의 탑 $$T_n = 2T_{n-1} + 1$$, $$T_0 = 0$$ | 신호 및 시스템: 계단 응답 $$s[n] = as[n-1] + b\,u[n]$$, $$s[-1] = 0$$ |
|---|---|
| 닫힌 꼴 $$T_n = 2^n - 1$$ | 닫힌 꼴 $$s[n] = \frac{b}{1-a}(1 - a^{n+1})$$ ($$n \ge 0$$) |

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 하노이의 탑 | 계단 응답 | 공통 구조 |
|---|---|---|
| 앞 항에 곱하는 2 | 과거 출력에 곱하는 $$a$$ | 특성방정식 $$r - 2 = 0$$, $$r - a = 0$$의 근 |
| 더하는 상수 1 | 매 칸 들어오는 입력 $$b$$ | 비동차 항 = 입력. 특수해는 상수 |
| 특수해 $$-1$$ ($$A = 2A + 1$$) | 특수해 $$\frac{b}{1-a}$$ ($$A = aA + b$$) | 상수를 넣어 계수 맞추기 |
| 제차해 $$C \cdot 2^n$$ | 제차해 $$Ca^n$$ | 특성근의 거듭제곱 |
| 초기값 $$T_0 = 0$$으로 $$C = 1$$ | 초기 휴지 $$s[-1] = 0$$으로 $$C = -\frac{ab}{1-a}$$ | 초기 조건으로 상수 정하기 |
| $$a = 2 > 1$$이라 끝없이 커짐 | $$\lvert a\rvert < 1$$이면 $$\frac{b}{1-a}$$로 수렴 | 특성근의 크기가 커지는지(불안정) 줄어드는지(안정)를 정한다 |

하노이의 탑은 $$a = 2$$, $$b = 1$$인 계단 응답에 $$n$$을 하나 밀어 맞춘 것이다: $$s[n-1] = \frac{1}{1-2}(1 - 2^n) = 2^n - 1 = T_n$$.

</details>


## 어디까지 같은가

- 같은 것: 상수계수 선형 식, 거듭제곱 해, 특성방정식, 중근이면 $$n r^n$$을 곱하는 규칙, 일반해 = 제차해 + 특수해, 초기 조건으로 상수 결정.
- 다른 것: 점화식은 보통 초기값($$a_0, a_1$$)을 직접 주고, 시스템은 초기 휴지(과거 출력이 0)를 기본으로 둔다. 시스템 쪽은 입력을 바꿔 가며 같은 식을 여러 번 쓰므로 임펄스 응답 $$h[n]$$ 하나로 모든 입력의 출력을 구한다(컨벌루션). 점화식 쪽에는 이 관점이 없다.
- 미분방정식과도 같은 구조다. 연속 시간에서는 $$r^n$$ 대신 $$e^{st}$$를 넣고, 미분이 곱셈 $$s$$로, 이동이 곱셈 $$\frac1r$$로 바뀐다. 표본화 $$t = nT$$에서 $$r = e^{sT}$$로 이어진다.

## 이 연결로 얻는 것

- 이산수학에서 익힌 점화식 풀이(피보나치의 비네 공식 등)를 그대로 디지털 필터의 임펄스 응답 계산에 쓸 수 있다. 예: $$y[n] = y[n-1] + y[n-2] + x[n]$$의 임펄스 응답은 피보나치 수열(한 칸 밀린 것)이다.
- 거꾸로, 시스템의 안정성 판정(특성근의 크기가 1보다 작은가)은 점화식의 값이 커지는지 줄어드는지를 바로 알려 준다.
- [선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)과 이으면, 고차 차분방정식을 상태 벡터와 행렬로 쓰는 상태 공간 표현으로 넘어간다.

## 전이 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">컴퓨터 메모리의 캐시 적중률을 매번 $$h[n] = 0.8h[n-1] + 0.2x[n]$$으로 갱신한다($$x[n]$$은 $$n$$번째 접근이 적중이면 1, 아니면 0). 처음 $$h[-1] = 0$$이고 모든 접근이 적중하면 $$h[n]$$은? 0.9를 넘는 첫 $$n$$은?</summary>

계단 응답 꼴이다. $$a = 0.8$$, $$b = 0.2$$이므로 $$h[n] = \frac{0.2}{0.2}(1 - 0.8^{n+1}) = 1 - 0.8^{n+1}$$. $$0.8^{n+1} < 0.1$$이려면 $$n + 1 > \frac{\ln 0.1}{\ln 0.8} \approx 10.3$$, 곧 $$n = 10$$부터다.

</details>


## 출처

- 3-1학기/신호 및 시스템/1.수업자료/06.Week06_CH02_2_handout.pdf, p.38~40 (계단·임펄스 응답, $$r^n$$을 쓰는 이유)
- [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/) (하노이의 탑, 특성방정식)
- 전이 문제와 대응표는 에이전트가 만들었다. 계산은 [24_difference-equation-system_verify.py](/Hongs_Blog/studies/signals-and-systems/code/24_difference-equation-system_verify/)의 계단 응답 공식과 같다.
{% endraw %}
