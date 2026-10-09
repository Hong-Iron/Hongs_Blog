---
layout: "note"
title: "차분방정식으로 표현한 LTI 시스템"
display_title: "차분방정식으로 표현한 LTI 시스템 (Systems Described by Difference Equations)"
kind: "concept"
kind_label: "기법"
num: "24"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Linear Constant-Coefficient Difference Equation", "선형 상수계수 차분방정식", "차분방정식", "Difference Equation", "재귀 방정식", "Recursive Equation", "비재귀 방정식", "Nonrecursive Equation", "FIR", "Finite Impulse Response", "IIR", "Infinite Impulse Response"]
description: "이산 시간 시스템은 \"지금 출력 = 지금과 과거 입력의 가중합 − 과거 출력의 가중합\"이라는 규칙(차분방정식)으로 적는다. 은행 잔액, 이동 평균, 디지털 필터가 모두 이 꼴이다. 과거 출력을 쓰지 않으면 임펄스 응답이 몇 칸 뒤 끝나고(FIR), 과거 출력을 다시 쓰면 메아리가 …"
prev_url: "/studies/signals-and-systems/lccde-system/"
prev_title: "미분방정식으로 표현한 LTI 시스템"
next_url: "/studies/signals-and-systems/difference-equation-recurrence-bridge/"
next_title: "차분방정식 ↔ 선형 점화식"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/difference-equation-system/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이산 시간 시스템은 "지금 출력 = 지금과 과거 입력의 가중합 − 과거 출력의 가중합"이라는 규칙(차분방정식)으로 적는다. 은행 잔액, 이동 평균, 디지털 필터가 모두 이 꼴이다. 과거 출력을 쓰지 않으면 임펄스 응답이 몇 칸 뒤 끝나고(FIR), 과거 출력을 다시 쓰면 메아리가 끝없이 이어진다(IIR). 미분방정식과 달리 위에서부터 한 칸씩 직접 계산할 수 있다는 것이 장점이지만, 시작하려면 과거 출력값(보조 조건)이 필요하다.

</div>


## 예시로 보기

$$y[n] - \frac12y[n-1] = x[n]$$, 곧 $$y[n] = x[n] + \frac12y[n-1]$$에 $$x[n] = K\delta[n]$$을 넣어 보자(예제 2.15)[^1].

- 초기 휴지: $$n \le -1$$에서 입력이 0이므로 출력도 0, 그래서 $$y[-1] = 0$$.
- $$y[0] = x[0] + \frac12y[-1] = K$$
- $$y[1] = x[1] + \frac12y[0] = \frac12K$$
- $$y[2] = \frac14K$$, … , $$y[n] = (\frac12)^nK$$

$$K = 1$$이면 임펄스 응답 $$h[n] = (\frac12)^nu[n]$$이다. 한 번 들어온 입력이 반씩 줄며 끝없이 남는다.

## 정의

**$$N$$차 선형 상수계수 차분방정식**[^2]

$$\sum_{k=0}^{N}a_ky[n-k] = \sum_{k=0}^{M}b_kx[n-k]$$


해는 특수해와 $$\sum a_ky[n-k] = 0$$의 해의 합이다. 초기 휴지 조건($$n < n_0$$에서 $$x[n] = 0$$이면 $$y[n] = 0$$)과 함께라면 LTI이고 인과적이다.

$$y[n]$$에 대해 풀면 재귀식이 된다[^2].

$$y[n] = \frac{1}{a_0}\left\{\sum_{k=0}^{M}b_kx[n-k] - \sum_{k=1}^{N}a_ky[n-k]\right\}$$


지금 출력을 계산하려면 지금·과거 입력과 과거 출력 $$y[n-1], \dots, y[n-N]$$이 필요하다. 그래서 $$y[-N], \dots, y[-1]$$ 같은 보조 조건이 주어지면 차례로 계산할 수 있다.

| | 비재귀 ($$N = 0$$) | 재귀 ($$N \ge 1$$) |
|---|---|---|
| 식 | $$y[n] = \sum_{k=0}^{M}\frac{b_k}{a_0}x[n-k]$$ | 과거 출력이 다시 들어간다 |
| 보조 조건 | 필요 없다 | 필요하다 |
| 임펄스 응답 | $$h[n] = \frac{b_n}{a_0}$$ ($$0 \le n \le M$$), 그 밖 0 | 보통 끝없이 이어진다 |
| 이름 | FIR (유한 임펄스 응답) | IIR (무한 임펄스 응답) |

비재귀식은 그 자체가 컨벌루션 합이다. 임펄스 응답의 0 아닌 값이 $$M + 1$$개뿐이다[^3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/24_difference-equation-system_fig1.svg" alt="그림" loading="lazy">

3점 평균(FIR)은 3칸 뒤에 응답이 끝나고, $$y[n] = x[n] + \frac12y[n-1]$$(IIR)은 반씩 줄며 끝없이 이어진다[^s2].

IIR의 예 $$y[n] = ay[n-1] + bx[n]$$을 계속 펼치면[^4]

$$y[n] = a^2y[n-2] + abx[n-1] + bx[n] = a^3y[n-3] + a^2bx[n-2] + abx[n-1] + bx[n] = \cdots$$


무한히 먼 과거의 입력까지 지금 출력에 영향을 준다.

**$$r^n$$을 쓰는 이유.**[^5] 차분방정식의 기본 연산은 시간 이동이다. $$y[n] = r^n$$이면 $$y[n-1] = \frac1r r^n$$, $$y[n-2] = \frac{1}{r^2}r^n$$으로 이동이 상수배로 바뀐다. 미분방정식의 $$e^{st}$$와 같은 역할이고, 실제로 $$t = nT$$로 표본화하면 $$e^{snT} = (e^{sT})^n$$, 곧 $$r = e^{sT}$$다. 예: $$y[n] - ay[n-1] = 0$$에 $$r^n$$을 넣으면 $$r^{n-1}(r - a) = 0$$, 특성방정식 $$r - a = 0$$에서 $$y[n] = a^n$$.

## 예제

**$$y[n] - ay[n-1] = bx[n]$$의 계단 응답**[^6]

1. *제차해:* $$\lambda^n$$을 넣으면 특성방정식 $$\lambda - a = 0$$, $$s_h[n] = Ca^n$$.
2. *특수해:* 입력이 단위 계단이라 상수 $$A$$를 넣는다. $$A = aA + b$$에서 $$A = \frac{b}{1-a}$$.
3. *초기 조건:* $$s[-1] = 0$$이므로 $$s[0] = as[-1] + b = b$$. $$\frac{b}{1-a} + C = b$$에서 $$C = -\frac{ab}{1-a}$$.
4. *답:* $$s[n] = \frac{b}{1-a}(1 - a^{n+1})u[n]$$.

**같은 식의 임펄스 응답.**[^7] $$h[0] = ah[-1] + b = b$$, $$h[1] = ab$$, $$n \ge 1$$에서 $$h[n] = ah[n-1]$$이므로 $$h[n] = Ca^n$$에 $$h[1] = ab$$를 넣어 $$C = b$$. 결과 $$h[n] = ba^nu[n]$$. $$s[n] - s[n-1]$$과 같다.

**보조 조건이 0이 아닌 예.**[^8] $$y[n] - 0.6y[n-1] = u[n]$$, $$y[1] = 2.68$$

- 제차해 $$C(0.6)^n$$, 특수해 $$A - 0.6A = 1$$에서 $$A = \frac52$$.
- $$y[1] = 0.6C + \frac52 = 2.68$$에서 $$C = 0.3$$, 그래서 $$y[n] = 0.3(0.6)^n + \frac52$$ ($$n \ge 0$$).

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/24_difference-equation-system_fig2.svg" alt="그림" loading="lazy">

같은 식이라도 출발값이 다르면 $$y[0]$$이 1과 2.8로 다르다. 두 출력 모두 특수해 2.5로 다가간다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 2.15를 재귀로 계산해 $$K(\frac12)^n$$과 일치, 계단 응답 $$\frac{b}{1-a}(1 - a^{n+1})$$, 임펄스 응답 $$ba^n$$, $$h = s[n] - s[n-1]$$, FIR 임펄스 응답 $$b_n/a_0$$, 0.6 예의 해가 식과 $$y[1] = 2.68$$을 만족함 — [24_difference-equation-system_verify.py](/Hongs_Blog/studies/signals-and-systems/code/24_difference-equation-system_verify/)</div>

</div>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 비재귀식의 임펄스 응답이 $$h[n] = b_n/a_0$$인 이유는?</summary>

$$x = \delta$$를 넣으면 $$a_0h[n] = b_0\delta[n] + b_1\delta[n-1] + \cdots + b_M\delta[n-M]$$이다. 각 $$n$$에서 0이 아닌 항은 $$b_n\delta[0]$$ 하나뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 계단 응답 3단계에서 $$s[0] = b$$로 먼저 구하는 이유는?</summary>

일반해 $$\frac{b}{1-a} + Ca^n$$은 $$n \ge 0$$에서만 맞는 식이라, 상수 $$C$$를 정할 값이 $$n \ge 0$$ 쪽에 하나 있어야 한다. 초기 휴지에서 아는 것은 $$s[-1] = 0$$이므로 재귀식으로 $$s[0]$$을 먼저 구한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

미분방정식과 같은 틀(제차해 + 특수해 + 초기 조건)을 쓰되, 지수함수 $$e^{st}$$ 대신 거듭제곱 $$r^n$$을 넣는다.

</details>


## 활용

- 디지털 오디오 필터, 주가의 지수 이동 평균($$y[n] = \alpha x[n] + (1-\alpha)y[n-1]$$, IIR), 은행 잔액 계산이 모두 차분방정식이다[^s1].
- FIR은 늘 안정이다(절대 합이 유한한 몇 개뿐). IIR은 $$\vert a\vert  < 1$$처럼 특성근이 작아야 안정이다[^s1].
- 컴퓨터에서는 위의 재귀식을 그대로 반복문으로 돌린다. 미분방정식을 수치로 풀 때도 결국 차분방정식으로 바꾼다.

## 연결

- 선수: [미분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/lccde-system/)
- 같은 구조: [차분방정식 ↔ 선형 점화식](/Hongs_Blog/studies/signals-and-systems/difference-equation-recurrence-bridge/)
- 그림으로: [블록 다이어그램](/Hongs_Blog/studies/signals-and-systems/block-diagram/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"재귀식은 과거 출력만 알면 되니 초기 조건 없이도 계산된다."</div>

틀렸다. 위에서부터 직접 계산할 수 있어 그럴듯하다. 하지만 첫 출력 $$y[0]$$을 계산하려면 $$y[-1]$$이 필요하고, 그 값을 정해야 한다. 확인: 같은 $$y[n] - 0.6y[n-1] = u[n]$$이라도 $$y[-1] = 0$$이면 $$y[0] = 1$$이고, 위 예처럼 $$y[1] = 2.68$$을 맞추려면 $$y[0] = 2.8$$이어야 한다. 초기 조건이 바뀌면 출력이 바뀐다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$y[n] = x[n] + 0.5y[n-1]$$, 초기 휴지, $$x[n] = u[n]$$. $$y[0], y[1], y[2]$$를 계산하라.</summary>

**답:** $$y[0] = 1$$, $$y[1] = 1 + 0.5 = 1.5$$, $$y[2] = 1 + 0.75 = 1.75$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** FIR인가 IIR인가? ① $$y[n] = \frac13(x[n] + x[n-1] + x[n-2])$$ ② $$y[n] = 0.9y[n-1] + x[n]$$ ③ $$y[n] = x[n] - x[n-4]$$</summary>

**답:** ① FIR ($$h$$ 3개) ② IIR ($$h = 0.9^n u[n]$$) ③ FIR ($$h = \delta[n] - \delta[n-4]$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 코드 `for n in range(N): y[n] = (sum(b[k]*x(n-k) ...) - sum(a[k]*y.get(n-k,0) for k in range(1,len(a)))) / a[0]`가 하는 일을 한 문장으로 말하라.</summary>

**답:** 차분방정식을 $$y[n]$$에 대해 푼 재귀식으로, 지금·과거 입력과 이미 계산한 과거 출력을 써서 출력을 한 칸씩 차례로 계산한다(없는 과거 출력은 0으로 둔다 = 초기 휴지).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 차분방정식의 해를 찾을 때 $$e^{st}$$ 대신 $$r^n$$을 넣는 이유는?</summary>

**답:** 차분방정식의 연산은 시간 이동이고, $$r^n$$을 한 칸 옮기면 $$r^{n-1} = \frac1rr^n$$처럼 상수배가 되어 모든 항이 $$r^n$$으로 묶인다. 미분에 대해 $$e^{st}$$가 하는 역할과 같다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/06.Week06_CH02_2_handout.pdf, p.30 (예제 2.15)
[^2]: 같은 자료, p.27~28
[^3]: 같은 자료, p.28~30
[^4]: 같은 자료, p.31
[^5]: 같은 자료, p.40
[^6]: 같은 자료, p.38
[^7]: 같은 자료, p.39
[^8]: 같은 자료, p.42
[^s1]: 에이전트 보충. 지수 이동 평균 예, FIR·IIR의 안정성, 오해 항목의 계산, 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 2장은 원본에 없다. [24_difference-equation-system_plot.py](/Hongs_Blog/studies/signals-and-systems/code/24_difference-equation-system_plot/)로 그렸고, 같은 코드로 다음을 확인했다: FIR $$h = \frac13, \frac13, \frac13$$, IIR $$h = (\frac12)^n$$, 초기 휴지 해 $$(1 - 0.6^{n+1})/0.4$$, 다른 보조 조건의 $$y[0] = 2.8$$, $$y[1] = 2.68$$.
{% endraw %}
